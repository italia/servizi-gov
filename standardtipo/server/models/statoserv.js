'use strict';

module.exports = function (Statoserv) {

    Statoserv.loadDbFromDictionary = function (dictionaryUrl, cb) {
        var validUrl = require('valid-url');
        var fs = require('fs');

        if (validUrl.isHttpsUri(dictionaryUrl)) {
            readWriteFile(dictionaryUrl);
        }

        var jsonData = require('../../data/statiServizio.json');
        loadDbFronJson(Statoserv, jsonData)
            .then(function (res) {
                if (res)
                    cb(null, 'prova -> ' + dictionaryUrl);
            })


    }

    Statoserv.remoteMethod('loadDbFromDictionary', {
        accepts: { arg: 'dictionaryUrl', type: 'string' },
        returns: { arg: 'result', type: 'string' }
    });

};

function loadDbFronJson(Statoserv, jsonData) {
    return new Promise((resolve, reject) => {
        var whereFilter = {}

        Statoserv.destroyAll(whereFilter, function (err, info) {

            if (err) console.log('errore')
            else {
                for (var i = 0; i < jsonData.length; i++) {
                    Statoserv.create(jsonData[i])
                }

                resolve(true);

            }
        })


    })
}


