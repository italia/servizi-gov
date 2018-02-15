'use strict';

module.exports = function(Deletedservice) {

    Deletedservice.updatePubStatusArchive = function (pubStatusObj, cb) {
        var queryManager = require('../../data/queryManager.js');
        var pso = JSON.parse(pubStatusObj)

        var pubStatusValues = ["R", "P", "A", "C"]

        if (queryManager.checkUserCanCreate(pso.userId, pso.codiceIpa)) {
            if (pso.serviceId && pso.serviceId != "" && pubStatusValues.indexOf(pso.pubStatus) > -1) {
                var ObjectID = require('mongodb').ObjectID;

                var newStatus = queryManager.changePubStatus(pso.pubStatus, pso.userId)

                Deletedservice.findById(ObjectID(pso.serviceId), function (err, publicservices) {
                    var stc = queryManager.getServiceToChange(JSON.parse(JSON.stringify(publicservices)))

                    var aggVer = (+(publicservices.version) + 1).toString()

                    var app = require('../../server/server');
                    var ChangesArchiveService = app.models.ChangesArchiveService

                    ChangesArchiveService.create(stc)
                        .then(function () {
                            var message = ''                            
                            publicservices.updateAttributes({ publicationStatus: newStatus, version: aggVer }, function (err, info) {
                                if (err) message = 'Lo stato del servizio non è stato aggiornato'
                                else message = 'Stato servizio aggiornato'
                                cb(null, message);
                            })
                        })
                })
            }
        } else {
            cb(null, "Utente non abilitato");
        }
    }

    Deletedservice.remoteMethod('updatePubStatusArchive', {
        accepts: { arg: 'pubStatusObj', type: 'string' },
        returns: { arg: 'result', type: 'string' },
        http: {
            path: '/updatePubStatusArchive',
            verb: 'POST'
        }
    })

};
