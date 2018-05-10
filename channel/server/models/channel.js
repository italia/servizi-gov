'use strict';

module.exports = function (Channel) {
  Channel.loadDbFromDictionary = function (dictionaryUrl, cb) {
    var validUrl = require('valid-url');
    var jsonConverter = require('../../data/jsonConverter.js');
    var fs = require('fs');

    if (validUrl.isHttpsUri(dictionaryUrl)) {
      readWriteFile(dictionaryUrl);
    }

    jsonConverter.jsonConverter('./data/Channel.jsonld');

    var jsonData = require('../../data/channel.json');
    loadDbFronJson(jsonData);

    cb(null, 'prova -> ' + dictionaryUrl);
  }

  Channel.remoteMethod('loadDbFromDictionary', {
    accepts: {
      arg: 'dictionaryUrl',
      type: 'string'
    },
    returns: {
      arg: 'result',
      type: 'string'
    }
  });

  Channel.getChildListById = function (channelIdLang, cb) {
    var response = [];

    var idQuery = (channelIdLang.identifier).split(".")[0]

    Channel.find({
      where: {
        lv0id: idQuery,
        language: channelIdLang.language
      }
    }, function (err, channel) {
      if (err) return cb(err);
      var queryChannelById = require('../../data/queryManager.js');

      if (channel.length == 1) {
        response = queryChannelById.unwrapChannel(channel[0], channelIdLang.identifier)
      }

      cb(null, response);
    });
  };

  Channel.remoteMethod('getChildListById', {
    accepts: {
      arg: 'channelIdLang',
      type: 'channelIdLang'
    },
    returns: {
      arg: 'response',
      type: ['getbyidres']
    },
    http: {
      path: '/getChildListById',
      verb: 'post'
    }
  });

  Channel.getDescriptionByIdentifier = function (identifier, cb) {
    var query = JSON.parse(identifier)
    var idCh = query.identifier.split(".")[0]
    var idf = query.identifier.substring(0, query.identifier.lastIndexOf('.'))
    var response = []
    Channel.find({
      where: {
        lv0id: idCh,
        language: query.language
      }
    }, function (err, channel) {
      if (err) return cb(err);
      var queryChannelById = require('../../data/queryManager.js');

      if (channel.length == 1) {
        var unwrappedChannel = queryChannelById.unwrapChannel(channel[0], idf)
        unwrappedChannel.forEach(channel => {
            if(channel.identifier == query.identifier)
            {
                response += channel.description
            }
        })
      }
      cb(null, response);
    });
  };
  Channel.remoteMethod('getDescriptionByIdentifier', {
    accepts: {
      arg: 'identifier',
      type: 'string'
    },
    returns: {
      arg: 'response',
      type: 'string'
    },
    http: {
      path: '/getDescriptionByIdentifier',
      verb: 'GET'
    }
  })
};

function readWriteFile(dictionaryUrl) {
  var fs = require('fs');
  var https = require('https');

  const file = fs.createWriteStream("data/Channel.jsonld");

  https.get(dictionaryUrl, response => {
    response.pipe(file);
  }).on('error', (e) => {
    console.error(e);
  });
}

function loadDbFronJson(jsonData) {
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

  MongoClient.connect(ds.channelDS.url, function (err, db) {
    var col = db.collection('channel');
    col.insert(jsonData)
    db.close();
  });
}
