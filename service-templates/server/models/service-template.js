'use strict';

module.exports = function (Servicetemplate) {
    Servicetemplate.loadDbFromDictionary = function (dictionaryUrl, cb) {
        var fs = require('fs');

        fs.readdirSync('./data/JSON_Separati').forEach(file => {
            var jsonData = require('../../data/JSON_Separati/' + file);

            for (var i = 0; i < jsonData.length; i++) {
                Servicetemplate.create(jsonData[i])
            }
        })

        cb(null, 'prova -> ' + dictionaryUrl);
    }

    Servicetemplate.remoteMethod('loadDbFromDictionary', {
        accepts: { arg: 'dictionaryUrl', type: 'string' },
        returns: { arg: 'result', type: 'string' }
    });

};

// function readWriteFile(dictionaryUrl) {
//     var fs = require('fs');
//     var https = require('https');

//     const file = fs.createWriteStream("data/MappingDataThemeEurovoc.jsonld");

//     https.get(dictionaryUrl, response => {
//         response.pipe(file);
//     }).on('error', (e) => {
//         console.error(e);
//     });
// }

// function loadDbFronJson(jsonData) {
//     var Db = require('mongodb').Db,
//         MongoClient = require('mongodb').MongoClient,
//         Server = require('mongodb').Server,
//         ReplSetServers = require('mongodb').ReplSetServers,
//         ObjectID = require('mongodb').ObjectID,
//         Binary = require('mongodb').Binary,
//         GridStore = require('mongodb').GridStore,
//         Grid = require('mongodb').Grid,
//         Code = require('mongodb').Code,
//         assert = require('assert');

//     var ds = {};

//     // if(process.env.NODE_ENV == 'production'){
//     ds = require('../../server/datasources.production.json');
//     // }
//     // else{
//     //  ds = require('../../server/datasources.json');        
//     // }

//     MongoClient.connect(ds.serviceTemplateDS.url, function (err, db) {
//         var col = db.collection('service-template');
//         col.insert(jsonData)
//         db.close();
//     });
// }