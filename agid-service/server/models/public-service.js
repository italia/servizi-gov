'use strict';

var xss = require('xss')
var atob = require('atob')

module.exports = function (Publicservice) {
    Publicservice.checkAndSaveService = function (serviceDataStr, cb) {
        var queryManager = require('../../data/queryManager.js');

        //var serviceData = require('../../data/serviceInputDataTest4.json');
        var serviceData = JSON.parse(xss(atob(serviceDataStr)))

        var message = ''

        try {

            if (queryManager.checkUserCanCreate(serviceData.userId, serviceData.codiceIpa)) {

                var dataService = {}

                if (serviceData.serviceId && serviceData.serviceId != "") {
                    var ObjectID = require('mongodb').ObjectID;

                    Publicservice.findById(ObjectID(serviceData.serviceId), function (err, publicservices) {
                        if (err) throw (err)
                        else {
                            var ser = publicservices
                            var stc = queryManager.getServiceToChange(JSON.parse(JSON.stringify(ser)))

                            var app = require('../../server/server');
                            var ChangesArchiveService = app.models.ChangesArchiveService

                            ChangesArchiveService.create(stc, function (err, models) {
                                if (err) throw (err)
                                else {
                                    dataService = queryManager.updateServiceDataObj(serviceData, ser)

                                    ser.updateAttributes(
                                        {
                                            version: dataService.version,
                                            update: dataService.update,
                                            metadataPercentage: dataService.metadataPercentage,
                                            publicService: dataService.publicService
                                        }, function (err, info) {
                                            if (err) throw (err)
                                            else {
                                                message = 'Servizio aggiornato'
                                                cb(null, message)
                                            }
                                        })
                                }
                            })

                        }
                    })
                }
                else {
                    dataService = queryManager.createServiceDataObj(serviceData)
                    Publicservice.create(dataService, function (err, models) {
                        if (err) throw (err)
                        else {
                            message = 'Il servizio è stato salvato'
                            cb(null, message);
                        }
                    })
                }
            }
            else {
                cb('Utente non abilitato')
            }
        } catch (error) {
            cb(error)
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

        try {
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
                            //retVal = checkPublicationStatusInChanges(deleteInputData.idService)
                            retVal = checkPublicationStatusInChanges(serviceToArchive.publicService.id)
                        }

                        return retVal
                    })
                    .then(function (result) {
                        if (result) {

                            if (checkPublicationStatus(serviceToArchive)) {
                                var psoObj = {}
                                psoObj.userId = deleteInputData.userId
                                psoObj.codiceIpa = deleteInputData.ipaCode
                                psoObj.serviceId = deleteInputData.idService
                                psoObj.pubStatus = 'R'

                                changePS(psoObj, Publicservice)
                                    .then(function (res, rej) {
                                        if (res) {
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
                                    })
                            }
                            else {
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
                        }
                        else {
                            console.log("CANCELLAZIONE FISICA")

                            // var whereFilter = { '_id': ObjectID(deleteInputData.idService) }
                            // Publicservice.destroyAll(whereFilter, function (err, info) { })
                            Publicservice.destroyById(ObjectID(deleteInputData.idService), function (err, info) {
                                if (err) throw (err)
                                else cb(null, "CANCELLAZIONE FISICA");
                            })
                            //REMOVE FROM ARCHIVE CHANGES
                            //message = "CANCELLAZIONE FISICA"
                        }
                    })
            }
            else {
                cb('Utente non abilitato')
            }

        } catch (error) {
            cb(error)
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

    Publicservice.updatePubStatus = function (pubStatusObjStr, cb) {

        var pubStatusObj = JSON.parse(pubStatusObjStr)
        var queryManager = require('../../data/queryManager.js');
        if (queryManager.checkUserCanChangeStatus(pubStatusObj.userId, pubStatusObj.codiceIpa)) {
            cb(null, changePS(pubStatusObj, Publicservice))
        }
        else
            cb('Utente non abilitato')
    }

    Publicservice.remoteMethod('updatePubStatus', {
        accepts: { arg: 'pubStatusObj', type: 'string' },
        returns: { arg: 'result', type: 'string' },
        http: {
            path: '/updatePubStatus',
            verb: 'POST'
        }
    })

    Publicservice.updateLanguageFields = function (languageObj, cb) {
        var queryManager = require('../../data/queryManager.js');
        var languageData = JSON.parse(xss(languageObj))
        var message = ''

        try {

            if (queryManager.checkUserCanCreate(languageData.user, languageData.codiceIpa)) {

                if (languageData.idService && languageData.idService != "") {
                    var ObjectID = require('mongodb').ObjectID;

                    Publicservice.findById(ObjectID(languageData.idService), function (err, publicservices) {

                        var ser = publicservices
                        var stc = queryManager.getServiceToChange(JSON.parse(JSON.stringify(ser)))

                        var app = require('../../server/server');
                        var ChangesArchiveService = app.models.ChangesArchiveService

                        ChangesArchiveService.create(stc, function (err, models) {
                            if (err) throw (err)
                            else {

                                var servName = []
                                var servAltName = []
                                var servDescr = []

                                if (languageData.name) {
                                    servName = queryManager.getLangValueArray(languageData.language, languageData.name.description, ser.publicService.name)
                                }
                                else {
                                    servName = ser.publicService.name
                                }

                                if (languageData.alternativeName) {
                                    servAltName = queryManager.getLangValueArray(languageData.language, languageData.alternativeName.description, ser.publicService.alternativeName)
                                }
                                else {
                                    servAltName = ser.publicService.alternativeName
                                }

                                if (languageData.description) {
                                    servDescr = queryManager.getLangValueArray(languageData.language, languageData.description.description, ser.publicService.description)
                                }
                                else {
                                    servDescr = ser.publicService.description
                                }

                                var ps = JSON.parse(JSON.stringify(ser.publicService))

                                ps.name = servName
                                ps.alternativeName = servAltName
                                ps.description = servDescr

                                ser.updateAttributes({ publicService: ps }, function (err, info) {
                                    if (err) throw (err)
                                    else {
                                        message = 'Servizio aggiornato'
                                        cb(null, message);
                                    }
                                })
                            }
                        })
                    })
                }
            }
            else {
                cb("Utente non abilitato")
            }
        } catch (error) {
            cb(error)
        }

        //
    }

    Publicservice.remoteMethod('updateLanguageFields', {
        accepts: { arg: 'languageObj', type: 'string' },
        returns: { arg: 'result', type: 'string' },
        http: {
            path: '/updateLanguageFields',
            verb: 'POST'
        }
    })
};

function moveToArchive(queryManager, deleteInputData, serviceToDelete) {

    return new Promise((resolve, reject) => {
        var deletedService = {}
        deletedService.version = serviceToDelete.version
        deletedService.creation = serviceToDelete.creation
        if (serviceToDelete.update) deletedService.update = serviceToDelete.update
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
            if (err) {
                reject(err)
            }
            else {
                for (var i = 0; i < changedservices.length; i++) {
                    if (changedservices[i].publicationStatus.type == "P") {
                        retVal = true
                        break
                    }
                }

                resolve(retVal)
            }
        })
    })
}

function deleteFromCollection(Publicservice, serviceId) {
    return new Promise((resolve, reject) => {
        var ObjectID = require('mongodb').ObjectID;
        var dataOutput = ''

        //var whereFilter = { '_id': ObjectID(serviceId) }
        //Publicservice.destroyAll(whereFilter, function (err, info) {
        Publicservice.destroyById(ObjectID(serviceId), function (err, info) {
            if (err) {
                reject(err)
            }

            dataOutput = info
        })

        resolve(dataOutput)
    })
}

function changePS(pso, Publicservice) {

    return new Promise((resolve, reject) => {

        var queryManager = require('../../data/queryManager.js');

        var pubStatusValues = ["R", "P", "A", "C"]

        // if (queryManager.checkUserCanCreate(pso.userId, pso.codiceIpa)) {
        if (pso.serviceId && pso.serviceId != "" && pubStatusValues.indexOf(pso.pubStatus) > -1) {
            var ObjectID = require('mongodb').ObjectID;

            var newStatus = queryManager.changePubStatus(pso.pubStatus, pso.userId)

            Publicservice.findById(ObjectID(pso.serviceId), function (err, publicservices) {
                var stc = queryManager.getServiceToChange(JSON.parse(JSON.stringify(publicservices)))

                var aggVer = (+(publicservices.version) + 1).toString()

                var app = require('../../server/server');
                var ChangesArchiveService = app.models.ChangesArchiveService

                ChangesArchiveService.create(stc, function (err, models) {

                    if (err) reject('Errore nella procedura')

                    var updateObj = queryManager.getUserDateStr(pso.userId)

                    publicservices.updateAttributes({ publicationStatus: newStatus, update: updateObj, version: aggVer }, function (err, info) {
                        if (err) {
                            reject('Lo stato del servizio non è stato aggiornato')
                        }
                        else {
                            resolve('Stato servizio aggiornato')
                        }
                    })
                })
            })
        }
        // } else {
        //     reject("Utente non abilitato");
        // }
    })
}