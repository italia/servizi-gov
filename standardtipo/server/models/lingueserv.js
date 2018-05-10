'use strict';

module.exports = function (Lingueserv) {
    Lingueserv.loadDbFromDictionary = function (dictionaryUrl, cb) {
        var validUrl = require('valid-url');
        var fs = require('fs');

        if (validUrl.isHttpsUri(dictionaryUrl)) {
            readWriteFile(dictionaryUrl);
        }

        var jsonData = require('../../data/lingueserv.json');
        loadDbFronJson(Lingueserv, jsonData)
            .then(function (res) {
                if (res)
                    cb(null, 'prova -> ' + dictionaryUrl);
            })
    }

    Lingueserv.remoteMethod('loadDbFromDictionary', {
        accepts: { arg: 'dictionaryUrl', type: 'string' },
        returns: { arg: 'result', type: 'string' }
    });
}
function loadDbFronJson(Lingueserv, jsonData) {
    return new Promise((resolve, reject) => {
        var whereFilter = {}

        Lingueserv.destroyAll(whereFilter, function (err, info) {

            if (err) console.log('errore')
            else {
                for (var i = 0; i < jsonData.length; i++) {
                    Lingueserv.create(jsonData[i])
                }

                resolve(true);

            }
        })


    })
}