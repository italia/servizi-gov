"use strict";
var bcrypt = require('bcryptjs');
// var async = require('async');
// var await = require('await');

module.exports = function (User) {

  User.addUsersToAbac = function (userToAdd, cb) {
    var queryManager = require('../../data/queryManager.js');

    var usr = {}

    var userToAdd = JSON.parse(userToAdd)
    if (userToAdd.nome != null) usr.nome = userToAdd.nome
    if (userToAdd.cognome != null) usr.cognome = userToAdd.cognome
    if (userToAdd.codicefiscale != null) usr.codicefiscale = userToAdd.codicefiscale
    if (userToAdd.codiceSPID != null) usr.codiceSPID = userToAdd.codiceSPID
    if (userToAdd.password != null) usr.password = userToAdd.password
    if (userToAdd.email != null) usr.email = userToAdd.email
    if (userToAdd.attributes != null) usr.attributes = userToAdd.attributes
    if (userToAdd.organizzazioni != null) usr.organizzazioni = userToAdd.organizzazioni
    if (userToAdd.idApplicazione != null) usr.idApplicazione = userToAdd.idApplicazione
    usr.isSuperAdmin = false //userToAdd.isSuperAdmin

    var whereFilter = {
      "where": {
        "codicefiscale": userToAdd.codiceFiscaleAdmin
      }
    }
    User.find(whereFilter, function (err, usrFind) {
      if (usrFind.length == 1) {
        var usrAdm = usrFind[0]
        try {
          if (!queryManager.checkUserCanCreate(usrAdm)) {
            var error = new Error()
            error.success = false
            error.message = 'Utente non abilitato'
            cb(null, error)
          }
          if (!queryManager.checkHierarchy(usrAdm.attributes, userToAdd.attributes, usrAdm.isSuperAdmin)) {
            var error = new Error()
            error.success = false
            error.message = 'Non è stata rispettata la gerarchia degli attributi'
            cb(null, error)
          }

          var arr = usr.organizzazioni.map(a => a.codiceIpa)


          var abc = queryMongoAdminUsers(arr)
            .then(function (isAdminPresent) {
              if (isAdminPresent && usr.attributes.findIndex((item) => item.name === "admin") > -1) {
                var error = new Error()
                error.success = false
                error.message = 'Esiste un utente admin per una delle PA inserite'
                cb(null, error)
              } else {
                bcrypt.genSalt(10, function (err, salt) {
                  var userToAddObj = usr
                  bcrypt.hash(userToAddObj.password, salt, function (err, hash) {
                    userToAddObj.password = hash;

                    User.create(userToAddObj, function (err, models) {
                      if (err && err.code == 11000) {
                        var error = new Error()
                        error.success = false
                        error.statuscode = err.code
                        error.message = 'Esiste già un utente con il codice fiscale inserito'
                        cb(null, error)
                      } else if (err && err.code != 11000) {
                        var error = new Error()
                        error.success = false
                        error.statuscode = err.code
                        error.message = 'Si è verificato un errore'
                        cb(null, error)
                      } else {
                        cb(null, models);
                      }
                    })
                  });
                });
              }
            })
        } catch (error) {
          cb(error)
        }

      }
    })
  }

  User.remoteMethod("addUsersToAbac", {
    accepts: {
      arg: "userToAdd",
      type: "string"
    },
    returns: {
      arg: "result",
      type: "string"
    },
    http: {
      path: "/addUsersToAbac",
      verb: "post"
    }
  });


  User.updateUser = function (userToUpdate, cb) {
    var ObjectID = require('mongodb').ObjectID;
    var userToUpdateObj = JSON.parse(userToUpdate)
    var queryManager = require('../../data/queryManager.js');


    var whereFilter = {
      "where": {
        "codicefiscale": userToUpdateObj.codiceFiscaleAdmin
      }
    }
    User.find(whereFilter, function (err, usrFind) {
      if (usrFind.length == 1) {
        var usrAdm = usrFind[0]

        try {

          if (!queryManager.checkUserCanCreate(usrAdm)) {
            var error = new Error()
            error.success = false
            error.message = 'Utente non abilitato'
            cb(null, error)
          } else if (!queryManager.checkHierarchy(usrAdm.attributes, userToUpdateObj.attributes, usrAdm.isSuperAdmin)) {
            var error = new Error()
            error.success = false
            error.message = 'Non è stata rispettata la gerarchia degli attributi'
            cb(null, error)
          }

          var arr = userToUpdateObj.organizzazioni.map(a => a.codiceIpa)


          var abc = queryMongoAdminUsers(arr)
            .then(function (isAdminPresent) {
              if (isAdminPresent && userToUpdateObj.attributes.findIndex((item) => item.name === "admin") > -1) {
                var error = new Error()
                error.success = false
                error.message = 'Esiste un utente admin per una delle PA inserite'
                cb(null, error)
              } else {
                try {
                  User.findById(ObjectID(userToUpdateObj.id), function (err, usr) {
                    if (err) cb(err)
                    else {
                      usr.updateAttributes({
                        nome: userToUpdateObj.nome,
                        cognome: userToUpdateObj.cognome,
                        codicefiscale: userToUpdateObj.codicefiscale,
                        codiceSPID: userToUpdateObj.codiceSPID,
                        email: userToUpdateObj.email,
                        attributes: userToUpdateObj.attributes,
                        organizzazioni: userToUpdateObj.organizzazioni
                      }, function (err, info) {
                        if (err && err.code == 11000) {
                          var error = new Error()
                          error.success = false
                          error.statuscode = err.code
                          error.message = 'Esiste già un utente con il codice fiscale inserito'
                          cb(null, error)
                        }
                        if (err && err.code != 11000) {
                          var error = new Error()
                          error.success = false
                          error.statuscode = err.code
                          error.message = 'Si è verificato un errore'
                          cb(null, error)
                        } else
                          cb(null, 'Utente aggiornato')
                      })
                    }

                  })
                } catch (error) {
                  cb(error)
                }

              }
            })
        } catch (error) {
          cb(error)
        }

      }
    })

  };

  User.remoteMethod("updateUser", {
    accepts: {
      arg: "userToUpdate",
      type: "string"
    },
    returns: {
      arg: "result",
      type: "string"
    },
    http: {
      path: "/updateUser",
      verb: "post"
    }
  });

  User.changePassword = function (userToChangePassword, cb) {

    var ObjectID = require('mongodb').ObjectID;

    var userStrToObj = JSON.parse(userToChangePassword)

    var retObj = {};

    User.findById(ObjectID(userStrToObj.id))
      .then(function (user) {

        retObj.user = user;
        retObj.newPassword = userStrToObj.newPassword;
        retObj.passwordTC = userStrToObj.password;
        return retObj;
      })
      .then(function (userObj) {
        return comparePassword(userObj.passwordTC, userObj.user.password)
      })
      .then(function (match) {
        if (match) {
          //return updateNewPassword(retObj, user);
          return updateNewPassword(retObj);
        } else
          return "Password attuale errata"
      })
      .then(function (message) {
        cb(null, message)
      })
  };

  User.remoteMethod("changePassword", {
    accepts: {
      arg: "userToChangePassword",
      type: "string"
    },
    returns: {
      arg: "result",
      type: "string"
    },
    http: {
      path: "/changePassword",
      verb: "post"
    }
  });









  User.deleteUser = function (userToDelete, cb) {
    var ObjectID = require('mongodb').ObjectID;
    var objUsers = JSON.parse(userToDelete)
    var queryManager = require('../../data/queryManager.js');

    var whereFilter = {
      "where": {
        "codicefiscale": objUsers.codiceFiscaleAdmin
      }
    }
    User.find(whereFilter, function (err, usrFind) {
      if (usrFind.length == 1) {
        var usrAdm = usrFind[0]
        try {
          if (!queryManager.checkUserCanCreate(usrAdm)) {
            var error = new Error()
            error.success = false
            error.message = 'Utente non abilitato'
            cb(null, error)
          } else {
            try {
              User.destroyById(ObjectID(objUsers.idUserToDelete), function (err, info) {
                if (err) cb(err)
                else
                  cb(null, 'Utente eliminato')
              })
            } catch (error) {
              cb(error)
            }
          }
        } catch (error) {
          cb(error)
        }
      }
    })
  };

  User.remoteMethod("deleteUser", {
    accepts: {
      arg: "userToDelete",
      type: "string"
    },
    returns: {
      arg: "result",
      type: "string"
    },
    http: {
      path: "/deleteUser",
      verb: "post"
    }
  });











};

function comparePassword(candidatePassword, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
      if (err) reject(err);
      resolve(isMatch);
    })
  })
}

function getSalt() {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) reject(err)
      resolve(salt);
    })
  })
}

function getHash(obj, salt) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(obj.newPassword, salt, function (err, hash) {
      if (err) reject(err);
      resolve(hash)
    })
  })
}

function updateNewPassword(obj) {
  return new Promise((resolve, reject) => {

    var message = ''

    getSalt()
      .then(function (salt) {
        return getHash(obj, salt)
      })
      .then(function (hash) {
        obj.pwdCrypted = hash;

        return obj
      })
      .then(function (obj) {
        var ObjectID = require('mongodb').ObjectID;
        var whereFilter = {
          '_id': ObjectID(obj.user.id)
        }

        // User.updateAll(whereFilter, obj.user, function (err, info) {
        //   if (err) throw err
        //   message = 'Password aggiornata'
        //     resolve(message);
        // })

        obj.user.updateAttributes({
          password: obj.pwdCrypted
        }, function (err, info) {
          if (err) reject(err)
          message = 'Password aggiornata'
          resolve(message);
        })
      })
  })
}

function queryMongoAdminUsers(ipaArray) {

  // var Db = require('mongodb').Db,
  // MongoClient = require('mongodb').MongoClient,
  // Server = require('mongodb').Server,
  // ReplSetServers = require('mongodb').ReplSetServers,
  // ObjectID = require('mongodb').ObjectID,
  // Binary = require('mongodb').Binary,
  // GridStore = require('mongodb').GridStore,
  // Grid = require('mongodb').Grid,
  // Code = require('mongodb').Code,
  // assert = require('assert');

  return new Promise((resolve, reject) => {
    var MongoClient = require('mongodb').MongoClient

    var app = require('../../server/server')
    var ds = app.datasources.abacDS

    try {
      MongoClient.connect(ds.settings.url, function (err, db) {
        var col = db.collection('user');

        var whereFilter = {
          "organizzazioni.codiceIpa": {
            $in: ipaArray
          },
          "attributes.name": "admin"
        }

        col.find(whereFilter).toArray(function (err, result) {
          if (err) reject(err);

          if (result.length > 0) resolve(true)
          else resolve(false)
          db.close();
        });
      });
    } catch (error) {
      reject(error)
    }
  })
}
