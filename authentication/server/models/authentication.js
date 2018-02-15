'use strict';

module.exports = function (Authentication) {

    Authentication.loadDbFromDictionary = function (dictionaryUrl, cb) {
        var validUrl = require('valid-url');
        var jsonConverter = require('../../data/jsonConverter.js');
        var fs = require('fs');
        
        if (validUrl.isHttpsUri(dictionaryUrl)) {
            readWriteFile(dictionaryUrl);
        }

        jsonConverter.jsonConverter('./data/Authentication.jsonld');

        var jsonData = require('../../data/authentication.json');
        loadDbFronJson(jsonData);

        cb(null, 'prova -> ' + dictionaryUrl);
    }

    Authentication.remoteMethod('loadDbFromDictionary', {
        accepts: { arg: 'dictionaryUrl', type: 'string' },
        returns: { arg: 'result', type: 'string' }
    });

};

function readWriteFile(dictionaryUrl) {
    var fs = require('fs');
    var https = require('https');

    const file = fs.createWriteStream("data/Authentication.jsonld");
    
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
    
    MongoClient.connect(ds.authenticationDS.url, function (err, db) {
        var col = db.collection('authentication');
        col.insert(jsonData)
        db.close();
    });
}


