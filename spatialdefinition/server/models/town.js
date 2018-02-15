'use strict';

module.exports = function (Town) {
    Town.loadDbComuniFromDictionary = function (dictionaryUrl, cb) {
        var fs = require('fs');

        var jsonData = require('../../data/comune.json');

        for (var i = 0; i < jsonData.length; i++) {
            Town.create(jsonData[i])
        }

        cb(null, 'prova -> ' + dictionaryUrl);
    }

    Town.remoteMethod('loadDbComuniFromDictionary', {
        accepts: { arg: 'dictionaryUrl', type: 'string' },
        returns: { arg: 'result', type: 'string' }
    });
};
