"use strict";
var bcrypt = require('bcryptjs');

module.exports = function (User) {
  User.addUsersToAbac = function (userToAdd, cb) {

    console.log(userToAdd);
    // userToAdd = "{"+userToAdd+"}"
    bcrypt.genSalt(10, function (err, salt) {
      var userToAddObj = JSON.parse(userToAdd)
      bcrypt.hash(userToAddObj.password, salt, function (err, hash) {
        userToAddObj.password = hash;
        User.create(userToAddObj)
        cb(null, userToAdd);
      });
    });
  };

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
    bcrypt.genSalt(10, function (err, salt) {
      var userToUpdateObj = JSON.parse(userToUpdate)
      bcrypt.hash(userToUpdateObj.password, salt, function (err, hash) {
        var whereFilter = {
          '_id': ObjectID(userToUpdateObj.id)
        }
        userToUpdateObj.password = hash;
        User.updateAll(whereFilter, userToUpdateObj, function (err, info) {
          var message = 'Utente aggiornato'

          cb(null, message);
        })
      })
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

};

function comparePassword(candidatePassword, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
      if (err) throw err;
      resolve(isMatch);
    })
  })
}

function getSalt() {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) throw err
      resolve(salt);
    })
  })
}

function getHash(obj, salt) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(obj.newPassword, salt, function (err, hash) {
      if (err) throw err;
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

        obj.user.updateAttributes({ password: obj.pwdCrypted }, function (err, info) {
          if (err) throw err
          message = 'Password aggiornata'
          resolve(message);
        })
      })
  })
}
