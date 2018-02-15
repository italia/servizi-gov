'use strict';

module.exports = function (Publicservice) {
    Publicservice.checkAndSaveService = function (serviceDataStr, cb) {
        var queryManager = require('../../data/queryManager.js');

        //var serviceData = require('../../data/serviceInputDataTest4.json');
        var serviceData = JSON.parse(serviceDataStr)

        var message = ''

        if (queryManager.checkUserCanCreate(serviceData.userId, serviceData.codiceIpa)) {

            var dataService = {}

            if (serviceData.serviceId && serviceData.serviceId != "") {
                var ObjectID = require('mongodb').ObjectID;
                //dataService.version = (+(dataService.version) + 1).toString()

                var whereFilter = { '_id': ObjectID(serviceData.serviceId) }
                Publicservice.find(whereFilter, function (err, publicservices) {
                    if (publicservices.length = 1) {
                        var stc = queryManager.getServiceToChange(JSON.parse(JSON.stringify(publicservices[0])))

                        var app = require('../../server/server');
                        var ChangesArchiveService = app.models.ChangesArchiveService

                        ChangesArchiveService.create(stc)

                        dataService = queryManager.updateServiceDataObj(serviceData, publicservices[0])

                        Publicservice.updateAll(whereFilter, dataService, function (err, info) {
                            message = 'Il servizio è stato aggiornato'

                            cb(null, message);
                        })
                    }
                })
            }
            else {
                dataService = queryManager.createServiceDataObj(serviceData)
                Publicservice.create(dataService)
                message = 'Il servizio è stato salvato'

                cb(null, message);
            }
        }
        else {
            cb(null, "Utente non abilitato");
        }
    }

    Publicservice.remoteMethod('checkAndSaveService', {
        accepts: { arg: 'serviceInputData', type: 'string' },
        returns: { arg: 'result', type: 'string' },
        http: {
            path: '/checkAndSaveService',
            verb: 'post'
        }
    });

    Publicservice.checkAndDeleteService = function (deleteInputDataStr, cb) {
        var queryManager = require('../../data/queryManager.js');
        var deleteInputData = JSON.parse(deleteInputDataStr)
        var serviceToArchive = {}

        if (queryManager.checkUserCanDelete(deleteInputData.userId, deleteInputData.ipaCode)) {
            var ObjectID = require('mongodb').ObjectID;

            Publicservice.findById(ObjectID(deleteInputData.idService))
                .then(function (publicservices) {
                    serviceToArchive = publicservices
                    return checkPublicationStatus(publicservices)
                })
                .then(function (status) {

                    var retVal = status
                    if (!status) {
                        retVal = checkPublicationStatusInChanges(deleteInputData.idService)
                    }

                    return retVal
                })
                .then(function (result) {
                    if (result) {
                        moveToArchive(queryManager, deleteInputData, serviceToArchive)
                            .then(function (archived) {
                                if (archived) {
                                    var outInfo = deleteFromCollection(Publicservice, deleteInputData.idService)
                                    console.log(outInfo)
                                }

                                console.log("servizio archiviato")
                                cb(null, "servizio archiviato");
                            })
                    }
                    else {
                        console.log("CANCELLAZIONE FISICA")

                        var whereFilter = { '_id': ObjectID(deleteInputData.idService) }
                        Publicservice.destroyAll(whereFilter, function (err, info) { })
                        //REMOVE FROM ARCHIVE CHANGES
                        //message = "CANCELLAZIONE FISICA"
                        cb(null, "CANCELLAZIONE FISICA");
                    }
                })
        }
    }

    Publicservice.remoteMethod('checkAndDeleteService', {
        accepts: { arg: 'deleteInputData', type: 'string' },
        returns: { arg: 'result', type: 'string' },
        http: {
            path: '/checkAndDeleteService',
            verb: 'post'
        }
    })

    Publicservice.updatePubStatus = function (pubStatusObj, cb) {
        var queryManager = require('../../data/queryManager.js');
        var pso = JSON.parse(pubStatusObj)

        var pubStatusValues = ["R", "P", "A", "C"]

        if (queryManager.checkUserCanCreate(pso.userId, pso.codiceIpa)) {
            if (pso.serviceId && pso.serviceId != "" && pubStatusValues.indexOf(pso.pubStatus) > -1) {
                var ObjectID = require('mongodb').ObjectID;

                var newStatus = queryManager.changePubStatus(pso.pubStatus, pso.userId)

                Publicservice.findById(ObjectID(pso.serviceId), function (err, publicservices) {
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

    Publicservice.remoteMethod('updatePubStatus', {
        accepts: { arg: 'pubStatusObj', type: 'string' },
        returns: { arg: 'result', type: 'string' },
        http: {
            path: '/updatePubStatus',
            verb: 'POST'
        }
    })

    // Publicservice.resumeServiceFromArchive = function (){}

    // Publicservice.remoteMethod('resumeServiceFromArchive', )
};


function moveToArchive(queryManager, deleteInputData, serviceToDelete) {

    return new Promise((resolve, reject) => {
        var deletedService = {}
        deletedService.version = serviceToDelete.version
        deletedService.creation = serviceToDelete.creation
        deletedService.removal = queryManager.getUserDateStr(deleteInputData.userId)
        if (serviceToDelete.approval) deletedService.approval = serviceToDelete.approval
        deletedService.publicationStatus = queryManager.changePubStatus("A", deleteInputData.userId)
        deletedService.codiceIpa = serviceToDelete.codiceIpa
        if (serviceToDelete.metadataPercentage) deletedService.metadataPercentage = serviceToDelete.metadataPercentage
        deletedService.publicService = serviceToDelete.publicService

        var app = require('../../server/server');
        var Deletedservice = app.models.Deletedservice

        Deletedservice.create(deletedService)
        resolve(true);
    });
}

function checkPublicationStatus(serviceToDelete) {
    return new Promise((resolve, reject) => {
        resolve(serviceToDelete && serviceToDelete.publicationStatus.type == "P")
    })
}

function checkPublicationStatusInChanges(idService) {
    return new Promise((resolve, reject) => {
        var retVal = false

        var app = require('../../server/server');
        var ChangesArchiveService = app.models.ChangesArchiveService

        var whereFilter = { "where": { "origId": { "like": idService }, "publicationStatus.type": "P" } }

        ChangesArchiveService.find(whereFilter, function (err, changedservices) {
            if (err) reject(err)
            for (var i = 0; i < changedservices.length; i++) {
                if (changedservices[i].publicationStatus.type == "P") {
                    retVal = true
                    break
                }
            }

            resolve(retVal)
        })
    })
}

function deleteFromCollection(Publicservice, serviceId) {
    return new Promise((resolve, reject) => {
        var ObjectID = require('mongodb').ObjectID;
        var dataOutput = ''

        var whereFilter = { '_id': ObjectID(serviceId) }
        Publicservice.destroyAll(whereFilter, function (err, info) {
            if (err) {
                reject(err)
            }

            dataOutput = info
        })

        resolve(dataOutput)
    })
}
