'use strict';

module.exports = function (Giorni) {

    Giorni.loadDbFromDictionary = function (dictionaryUrl, cb) {
        var validUrl = require('valid-url');
        var fs = require('fs');

        if (validUrl.isHttpsUri(dictionaryUrl)) {
            readWriteFile(dictionaryUrl);
        }

        var jsonData = require('../../data/giorni.json');
        loadDbFronJson(Giorni, jsonData)
            .then(function (res) {
                if (res)
                    cb(null, 'prova -> ' + dictionaryUrl);
            })
    }

    Giorni.remoteMethod('loadDbFromDictionary', {
        accepts: { arg: 'dictionaryUrl', type: 'string' },
        returns: { arg: 'result', type: 'string' }
    });
}
function loadDbFronJson(Giorni, jsonData) {
    return new Promise((resolve, reject) => {
        var whereFilter = {}

        Giorni.destroyAll(whereFilter, function (err, info) {

            if (err) console.log('errore')
            else {
                for (var i = 0; i < jsonData.length; i++) {
                    Giorni.create(jsonData[i])
                }

                resolve(true);

            }
        })


    })
}