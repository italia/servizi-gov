'use strict';
const guid = require("../../utils/guid.js")
var isStatic = true;
module.exports = function (Event) {
  removeDefaultOperations(Event);
  addLogOperations(Event);
};
function addLogOperations(Event) {
    Event.logInfo = function (caller, msg, cb) {
        const guidManager = new guid();
        var correlationId = guidManager.newGuid();
        let event = {
            caller: caller,
            logLevel: 6,
            msg: msg,
            correlationId: correlationId,
            date: new Date(),
            timestamp: new Date().getTime()
        };
        Event.create(event, function () {
            console.log("Created log entry for %s at %s; log level %d", event.correlationId, event.date.toString(), event.logLevel);
        });
        cb(null, correlationId);
    };
    Event.remoteMethod("logInfo", {
        description : "Writes info events to logs",
        http: {
            verb: "post"
        },
        accepts: [{
            arg: 'caller',
            type: 'string',
            required: true
        },
        {
            arg: 'msg',
            type: 'string'
        }
        ],
        returns: {
            arg: 'correlationId',
            type: 'string'
        }
    });
    Event.logError = function (caller, msg, cb) {
        const guidManager = new guid();
        var correlationId = guidManager.newGuid();
        let event = {
            caller: caller,
            logLevel: 3,
            msg: msg,
            correlationId: correlationId,
            date: new Date(),
            timestamp: new Date().getTime()
        };
        Event.create(event, function () {
            console.log("Created log entry for %s at %s; log level %d", event.correlationId, event.date.toString(), event.logLevel);
        });
        cb(null, correlationId);
    };
    Event.remoteMethod("logError", {
        description: "Writes errors to log",
        http: {
            verb: "post"
        },
        accepts: [{
            arg: 'caller',
            type: 'string',
            required: true
        },
        {
            arg: 'msg',
            type: 'string',
            required: true
        }
        ],
        returns: {
            arg: 'correlationId',
            type: 'string'
        }
    });
    Event.logWarning = function (caller, msg, cb) {
        const guidManager = new guid();
        var correlationId = guidManager.newGuid();
        let event = {
            caller: caller,
            logLevel: 4,
            msg: msg,
            correlationId: correlationId,
            date: new Date(),
            timestamp: new Date().getTime()
        };
        Event.create(event, function () {
            console.log("Created log entry for %s at %s; log level %d", event.correlationId, event.date.toString(), event.logLevel);
        });
        cb(null, correlationId);
    };
    Event.remoteMethod("logWarning", {
        description : "Writes warning messages to logs",
        http: {
            verb: "post"
        },
        accepts: [{
            arg: 'caller',
            type: 'string'
        },
        {
            arg: 'msg',
            type: 'string'
        }
        ],
        returns: {
            arg: 'correlationId',
            type: 'string'
        }
    });
    Event.logDebug = function (caller, msg, obj, cb) {
        const guidManager = new guid();
        var correlationId = guidManager.newGuid();
        let event = {
            caller: caller,
            logLevel: 7,
            msg: msg,
            correlationId: correlationId,
            date: new Date(),
            timestamp: new Date().getTime(),
            debugObject: JSON.parse(obj)
        };
        Event.create(event, function () {
            console.log("Created log entry for %s at %s; log level %d", event.correlationId, event.date.toString(), event.logLevel);
        });
        cb(null, correlationId);
    };
    Event.remoteMethod("logDebug", {
        description:"Writes debug useful infos & objects to logs",
        http: {
            verb: "post"
        },
        accepts: [{
            arg: 'caller',
            description: 'The microservice calling the log',
            type: 'string',
            required: true
        },
        {
            arg: 'msg',
            description: 'The message to log',
            type: 'string'
        },
        {
            arg: 'obj',
            description: 'Useful to store object to debug them in the future',
            type: 'string'
        }
        ],
        returns: {
            arg: 'correlationId',
            type: 'string'
        }
    });
}

function removeDefaultOperations(Event) {
    Event.disableRemoteMethodByName('create');
    Event.disableRemoteMethodByName('upsert');
    Event.disableRemoteMethodByName('updateAll');
    Event.disableRemoteMethodByName('prototype.updateAttributes');
    Event.disableRemoteMethodByName('find');
    Event.disableRemoteMethodByName('findById');
    Event.disableRemoteMethodByName('findOne');
    Event.disableRemoteMethodByName('deleteById');
    Event.disableRemoteMethodByName('confirm');
}

