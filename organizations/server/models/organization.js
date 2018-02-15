'use strict';
const http = require('http')
module.exports = function(Organization) {
    Organization.loadDbFromDictionary = function (dictionaryUrl, cb) {

        var jsonData = require('../../data/organizations.json');
        loadDbFronJson(jsonData);

        cb(null, 'prova -> ' + dictionaryUrl);
    }

    Organization.remoteMethod('loadDbFromDictionary', {
        accepts: { arg: 'dictionaryUrl', type: 'string' },
        returns: { arg: 'result', type: 'string' }
    });
};

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
        // ds = require('../../server/datasources.production.json');        
    // }
    // else{
        ds = require('../../server/datasources.json');        
    // }
    
    MongoClient.connect(ds.organizationDS.url, function (err, db) {
        var col = db.collection('organization');
        col.insert(jsonData)
        db.close();
    });
}
