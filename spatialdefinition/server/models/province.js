'use strict';

module.exports = function (Province) {
    Province.loadDbProvinceFromDictionary = function (dictionaryUrl, cb) {
        var fs = require('fs');

        var jsonData = require('../../data/provincia.json');

        for (var i = 0; i < jsonData.length; i++) {
            Province.create(jsonData[i])
        }

        cb(null, 'prova -> ' + dictionaryUrl);
    }

    Province.remoteMethod('loadDbProvinceFromDictionary', {
        accepts: { arg: 'dictionaryUrl', type: 'string' },
        returns: { arg: 'result', type: 'string' }
    });
};
