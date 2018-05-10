'use strict';

module.exports = function (Application) {


  Application.createApplication = function (appObj, cb) {

    var queryManager = require('../../data/queryManager.js');

    var appCreate = JSON.parse(appObj)
    var message;
    Application.create(appCreate, function (err, models) {
      if (err) message = err;
      else
        message = 'Nuova Applicazione salvata'
      cb(null, message);
    })

  }

  Application.remoteMethod("createApplication", {
    accepts: {
      arg: "appObj",
      type: "string"
    },
    returns: {
      arg: "result",
      type: "string"
    }
  })

  Application.updateApplication = function (appToAdd, cb) {
    var ObjectID = require('mongodb').ObjectID;
    var objToAdd = JSON.parse(appToAdd);
 
    Application.findById(ObjectID(objToAdd.id), function (err, application) {

      var app = application

      var message = ""

      app.updateAttributes({
        nome: objToAdd.nome,
        url: objToAdd.url,
        description: objToAdd.description,
        attributes: objToAdd.attributes
      }, function (err, info) {
        if (err) message = 'Il servizio non è stato aggiornato'
        else message = 'Applicazione aggiornata'
        cb(null, message);
      })
    })

  };

  Application.remoteMethod("updateApplication", {
    accepts: {
      arg: "appToAdd",
      type: "string"
    },
    returns: {
      arg: "result",
      type: "string"
    },
    http: {
      path: "/updateApplication",
      verb: "POST"
    }
  });

};
