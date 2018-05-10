'use strict';

module.exports = function (Tempoproc) {
    Tempoproc.loadDbFromDictionary = function (dictionaryUrl, cb) {
        var validUrl = require('valid-url');
        var fs = require('fs');

        if (validUrl.isHttpsUri(dictionaryUrl)) {
            readWriteFile(dictionaryUrl);
        }

        var jsonData = require('../../data/tempoproc.json');
        loadDbFronJson(Tempoproc, jsonData)
            .then(function (res) {
                if (res)
                    cb(null, 'prova -> ' + dictionaryUrl);
            })
    }

    Tempoproc.remoteMethod('loadDbFromDictionary', {
        accepts: { arg: 'dictionaryUrl', type: 'string' },
        returns: { arg: 'result', type: 'string' }
    });
}
function loadDbFronJson(Tempoproc, jsonData) {
    return new Promise((resolve, reject) => {
        var whereFilter = {}

        Tempoproc.destroyAll(whereFilter, function (err, info) {

            if (err) console.log('errore')
            else {
                for (var i = 0; i < jsonData.length; i++) {
                    Tempoproc.create(jsonData[i])
                }

                resolve(true);

            }
        })


    })
}