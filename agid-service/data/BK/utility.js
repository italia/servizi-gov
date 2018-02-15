// var request = require('request');
// var request = require('request-promise');

var request = require('sync-request');

var env = 'azure'

function dateNow() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    today = dd + '/' + mm + '/' + yyyy;

    return today
}

module.exports.dateNow = dateNow;

function callTeplateByIdGET(teplateId) {
    var address = urlComposer('sgiservicetemplate', env) + 'service-templates/' + teplateId
    var jsonTemplate = restCallerGET(address)

    return jsonTemplate
}

module.exports.callTeplateByIdGET = callTeplateByIdGET;

function callThemesArrayByIdGET(themes, serviceLang) {
    var idFilter = []

    for (var i = 0; i < themes.length; i++) {
        var f = {}
        f.identifier = themes[i]
        idFilter.push(f)
    }

    var whereFilter = '?filter={"where":{"or":' + JSON.stringify(idFilter) + ',"and":[{"language":"' + serviceLang + '"}]}}'
    var address = urlComposer('sgithemes', env) + 'themes' + whereFilter
    var jsonThemes = restCallerGET(address)

    return jsonThemes
}

module.exports.callThemesArrayByIdGET = callThemesArrayByIdGET;

function callSectorArrayByIdGET(sector) {
    var idFilter = []

    for (var i = 0; i < sector.length; i++) {
        var f = {}
        f.identifier = sector[i]
        idFilter.push(f)
    }

    var whereFilter = '?filter={"where":{"or":' + JSON.stringify(idFilter) + '}}'
    var address = urlComposer('sginace', env) + 'naces' + whereFilter
    var jsonSector = restCallerGET(address)

    return jsonSector
}

module.exports.callSectorArrayByIdGET = callSectorArrayByIdGET;

function callOrganizationByNameGET(name) {
    var nameFilter = '?filter={"where":{"name":"' + name + '"}}'

    var address = urlComposer('sgiorganization', env) + 'organizations' + nameFilter
    var jsonOrganization = restCallerGET(address)

    return jsonOrganization
}

module.exports.callOrganizationByNameGET = callOrganizationByNameGET

function callInputOutputByTypeGET(type, serviceLang) {
    var filter = '?filter[where][language]=' + serviceLang + '&filter[where][identifier]=' + type

    var address = urlComposer('sgiserviceinputoutput', env) + 'serviceinputoutputs' + filter
    var jsonIo = restCallerGET(address)

    return jsonIo
}

module.exports.callInputOutputByTypeGET = callInputOutputByTypeGET


function restCallerGET(queryUrl) {

    var reqVal = request('GET', queryUrl)

    var retVal = JSON.parse(reqVal.getBody('utf8'))

    return retVal
}

function urlComposer(serviceName, environment) {
    var url = ''

    switch (environment) {
        case "test":
            url = 'http://' + serviceName + '/api/'
            break;
        case "kong":
            url = '' + serviceName + '/api/'
            break;
        case "local":
            //code block
            break;
        default:
        //code block
    }
    return url
}






