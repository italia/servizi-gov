'use strict';

module.exports = function(Role) {
    Role.loadDbFromDictionary = function (dictionaryUrl, cb) {
        
                var jsonData = require('../../data/roles.json');
                loadDbFronJson(jsonData);
        
                cb(null, 'prova -> ' + dictionaryUrl);
            }
        
            Role.remoteMethod('loadDbFromDictionary', {
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
        ds = require('../../server/datasources.production.json');        
    // }
    // else{
    //     ds = require('../../server/datasources.json');        
    // }
    
    MongoClient.connect(ds.roleTypeDS.url, function (err, db) {
        var col = db.collection('role');
        col.insert(jsonData)
        db.close();
    });
}
