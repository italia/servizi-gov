'use strict';

module.exports = function (Tiposerv) {

    Tiposerv.loadDbFromDictionary = function (dictionaryUrl, cb) {
        var validUrl = require('valid-url');
        var fs = require('fs');

        if (validUrl.isHttpsUri(dictionaryUrl)) {
            readWriteFile(dictionaryUrl);
        }

        var jsonData = require('../../data/tiposerv.json');
        loadDbFronJson(Tiposerv, jsonData)
            .then(function (res) {
                if (res)
                    cb(null, 'prova -> ' + dictionaryUrl);
            })
    }

    Tiposerv.remoteMethod('loadDbFromDictionary', {
        accepts: { arg: 'dictionaryUrl', type: 'string' },
        returns: { arg: 'result', type: 'string' }
    });
}
function loadDbFronJson(Tiposerv, jsonData) {
    return new Promise((resolve, reject) => {
        var whereFilter = {}

        Tiposerv.destroyAll(whereFilter, function (err, info) {

            if (err) console.log('errore')
            else {
                for (var i = 0; i < jsonData.length; i++) {
                    Tiposerv.create(jsonData[i])
                }

                resolve(true);

            }
        })


    })
}