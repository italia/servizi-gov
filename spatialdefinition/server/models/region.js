'use strict';

module.exports = function (Region) {
    Region.loadDbRegioniFromDictionary = function (dictionaryUrl, cb) {
        var fs = require('fs');

        var jsonData = require('../../data/regione.json');

        for (var i = 0; i < jsonData.length; i++) {
            Region.create(jsonData[i])
        }

        cb(null, 'prova -> ' + dictionaryUrl);
    }

    Region.remoteMethod('loadDbRegioniFromDictionary', {
        accepts: { arg: 'dictionaryUrl', type: 'string' },
        returns: { arg: 'result', type: 'string' }
    });
};
