'use strict';

module.exports = function(Businesseventtype) {
    Businesseventtype.loadDbFromDictionary = function (dictionaryUrl, cb) {
        var validUrl = require('valid-url');
        var jsonConverter = require('../../data/jsonConverter.js');
        var fs = require('fs');
        
        if (validUrl.isHttpsUri(dictionaryUrl)) {
            readWriteFile(dictionaryUrl);
        }

        jsonConverter.jsonConverter('./data/BE_ITA.jsonld');

        var jsonData = require('../../data/businesseventtype.json');
        loadDbFronJson(jsonData);

        cb(null, 'prova -> ' + dictionaryUrl);
    }

    Businesseventtype.remoteMethod('loadDbFromDictionary', {
        accepts: { arg: 'dictionaryUrl', type: 'string' },
        returns: { arg: 'result', type: 'string' }
    });

};

function readWriteFile(dictionaryUrl) {
    var fs = require('fs');
    var https = require('https');

    const file = fs.createWriteStream("data/BE_ITA.jsonld");
    
    https.get(dictionaryUrl, response => {
            response.pipe(file);
        }
    ).on('error', (e) => {
            console.error(e);
        }
    );
}

function loadDbFronJson(jsonData){
    var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    ReplSetServers = require('mongodb').ReplSetServers,
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Grid = require('mongodb').Grid,
    Code = require('mongodb').Code,
    assert = require('assert');
    
    var ds = {};
    
    // if(process.env.NODE_ENV == 'production'){
        ds = require('../../server/datasources.production.json');        
    // }
    // else{
    //     ds = require('../../server/datasources.json');        
    // }
    
    MongoClient.connect(ds.businesseventtypeDS.url, function (err, db) {
        var col = db.collection('businesseventtype');
        col.insert(jsonData)
        db.close();
    });
}