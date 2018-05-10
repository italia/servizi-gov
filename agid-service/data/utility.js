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

// function callComuneByCodiceCatastale(comune) {
// }
// module.exports.callComuneByCodiceCatastale = callComuneByCodiceCatastale;
// function callProvinciaByCodiceProvincia(provincia) {
// }
// module.exports.callProvinciaByCodiceProvincia = callProvinciaByCodiceProvincia;
// function callregioneByCodiceRegione(regione) {
// }
// module.exports.callregioneByCodiceRegione = callregioneByCodiceRegione;

function callOrganizationByNameGET(name) {
    var nameFilter = '?filter={"where":{"name":"' + encodeURIComponent(name) + '"}}'

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

function callInputOutputByLabelGET(type, serviceLang) {
    var filter = '?filter={"where":{"label":"' + encodeURIComponent(type) + '","language":"' + serviceLang + '"}}'
    var address = urlComposer('sgiserviceinputoutput', env) + 'serviceinputoutputs' + filter
    var jsonIo = restCallerGET(address)

    return jsonIo
}

module.exports.callInputOutputByLabelGET = callInputOutputByLabelGET

function callAuthArrayByLang(serviceLang) {
    var filter = '?filter={"where":{"language":"' + serviceLang + '"}}'
    var address = urlComposer('sgiauth', env) + 'authentications' + filter
    var jsonAuthSer = restCallerGET(address)
    var jsonAuth = []

    for (var k = 0; k < jsonAuthSer.length; k++) {
        var a = {}
        a.type = jsonAuthSer[k].lv0id
        a.url = jsonAuthSer[k].lv0rdfuri
        jsonAuth.push(a)

        if (jsonAuthSer[k].lv1child && jsonAuthSer[k].lv1child.length > 0) {
            var child = jsonAuthSer[k].lv1child
            for (var j = 0; j < child.length; j++) {
                var a1 = {}
                a1.type = child[j].lv1id
                a1.url = child[j].lv1rdfuri
                jsonAuth.push(a1)
            }
        }
    }

    return jsonAuth
}

module.exports.callAuthArrayByLang = callAuthArrayByLang

function getUserById(userId) {
    var userFilter = '?filter={"where":{"codicefiscale":"' + userId + '"}}'

    var address = urlComposer('sgiabaccontroller', env) + 'users' + userFilter
    var jsonOrganization = restCallerGET(address)

    return jsonOrganization
}

module.exports.getUserById = getUserById

function restCallerGET(queryUrl) {

    var reqVal = request('GET', queryUrl, {
        headers: {
            'content-type': 'application/json; charset=utf8',
            "Authorization": "Basic " + Buffer.from("nomeutente:-").toString('base64')
        }
    })

    var retVal = JSON.parse(reqVal.getBody('utf8'))

    return retVal
}

function urlComposer(serviceName, environment) {
    var url = ''

    switch (environment) {
        case "azure":
            url = 'https://' + serviceName + '.xxxx/api/'
            break;
        case "kong":
            url = 'http:///' + serviceName + '/api/'
            break;
        case "local":
            //code block
            break;
        default:
        //code block
    }
    return url
}






