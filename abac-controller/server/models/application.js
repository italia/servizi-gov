'use strict';

module.exports = function(Application) {



    Application.updateApplication = function (appToAdd, cb) {
        var ObjectID = require('mongodb').ObjectID;
       
        var objToAdd = JSON.parse(appToAdd);
        var whereFilter = {
            '_id': ObjectID(objToAdd.id)
          }
        Application.updateAll(whereFilter, objToAdd, function (err, info) {
            var message = 'Utente aggiornato'
      
            cb(null, message);
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
