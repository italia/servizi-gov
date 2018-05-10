'use strict';

module.exports = function (Deletedservice) {

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

                    // ChangesArchiveService.create(stc)
                    //     .then(function () {
                    //         var message = ''
                    //         publicservices.updateAttributes({ publicationStatus: newStatus, version: aggVer }, function (err, info) {
                    //             if (err) message = 'Lo stato del servizio non è stato aggiornato'
                    //             else message = 'Stato servizio aggiornato'
                    //             cb(null, message);
                    //         })
                    //     })

                    ChangesArchiveService.create(stc, function (err, models) {
                        if (err) {
                            cb('Errore nella procedura')
                        }
                        else {
                            var updateObj = queryManager.getUserDateStr(pso.userId)

                            publicservices.updateAttributes({ publicationStatus: newStatus, update: updateObj, version: aggVer }, function (err, info) {
                                if (err) {
                                    cb('Lo stato del servizio non è stato aggiornato')
                                }
                                else {
                                    cb(null, 'Stato servizio aggiornato')
                                }
                            })
                        }
                    })
                })
            }
        } else {
            cb("Utente non abilitato");
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

    Deletedservice.resumeServiceFromArchive = function (resumeObj, cb) {

        var queryManager = require('../../data/queryManager.js');
        var resumeInputData = JSON.parse(resumeObj)

        if (queryManager.checkUserCanResume(resumeInputData.userId, resumeInputData.ipaCode)) {
            var ObjectID = require('mongodb').ObjectID;

            Deletedservice.findById(ObjectID(resumeInputData.idService))
                .then(function (serviceToResume) {
                    moveToMainCollection(queryManager, resumeInputData, serviceToResume)
                        .then(function (archived) {
                            if (archived) {
                                var outInfo = deleteFromCollection(Deletedservice, resumeInputData.idService)
                                console.log(outInfo)
                            }

                            console.log("servizio ripristinato")
                            cb(null, "servizio ripristinato");
                        })
                })
        }
        else {
            cb("Utente non abilitato");
        }
    }

    Deletedservice.remoteMethod('resumeServiceFromArchive', {
        accepts: { arg: 'resumeObj', type: 'string' },
        returns: { arg: 'result', type: 'string' },
        http: {
            path: '/resumeServiceFromArchive',
            verb: 'POST'
        }
    })

};

function moveToMainCollection(queryManager, resumeInputData, serviceToResume) {

    return new Promise((resolve, reject) => {
        var resumedService = {}
        resumedService.version = (+(serviceToResume.version) + 1).toString()
        resumedService.creation = serviceToResume.creation
        resumedService.update = queryManager.getUserDateStr(resumeInputData.userId)

        // resumedService.removal = queryManager.getUserDateStr(deleteInputData.userId)
        if (serviceToResume.approval) resumedService.approval = serviceToResume.approval
        resumedService.publicationStatus = queryManager.changePubStatus("R", resumeInputData.userId)
        resumedService.codiceIpa = serviceToResume.codiceIpa
        if (serviceToResume.metadataPercentage) resumedService.metadataPercentage = serviceToResume.metadataPercentage

        resumedService.publicService = serviceToResume.publicService

        var app = require('../../server/server');
        var Publicservice = app.models.PublicService

        Publicservice.create(resumedService)
        resolve(true);
    });
}

function deleteFromCollection(Deletedservice, serviceId) {
    return new Promise((resolve, reject) => {
        var ObjectID = require('mongodb').ObjectID;
        var dataOutput = ''

        //var whereFilter = { '_id': ObjectID(serviceId) }
        //Publicservice.destroyAll(whereFilter, function (err, info) {
        Deletedservice.destroyById(ObjectID(serviceId), function (err, info) {
            if (err) {
                reject(err)
            }

            dataOutput = info
        })

        resolve(dataOutput)
    })
}