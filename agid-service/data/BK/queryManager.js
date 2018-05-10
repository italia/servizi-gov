
var Uuid = require('uuid-lib')
var utility = require('./utility')

var serviceLang = 'it'

function checkUserCanCreate(userId) {
    //call abac module
    return true
}

module.exports.checkUserCanCreate = checkUserCanCreate;

function createServiceDataObj(jsonData) {
    var serviceData = {}

    serviceData.version = "1"
    serviceData.creation = getUserDateStr(jsonData.userId)
    //TODO: serviceData.pubblicationStatus = jsonData.status
    serviceData.codiceIpa = jsonData.codiceIpa
    serviceData.publicService = getPublicServiceData(jsonData)

    return serviceData
}

module.exports.createServiceDataObj = createServiceDataObj;

function getUserDateStr(userId) {
    var userDate = {}

    userDate.date = utility.dateNow
    userDate.user = userId

    return userDate
}

function getPublicServiceData(jsonData) {
    var publicService = {}

    var templateData = getTemplate(jsonData.templateRef)

    publicService.id = jsonData.codiceIpa + '_' + Uuid.raw()
    publicService.template = getTemplateStr(jsonData.templateRef, templateData.name)
    publicService.name = getLangValue(serviceLang, jsonData.serviceName)
    if (jsonData.altServiceName) publicService.alternativeName = getLangValue(serviceLang, jsonData.altServiceName)
    if (jsonData.altServiceId) publicService.alternativeId = getIdDescription(jsonData.altServiceId)
    if (jsonData.serviceDescription) publicService.description = getLangValue(serviceLang, jsonData.serviceDescription)
    publicService.serviceUrl = jsonData.serviceUrl
    if (jsonData.keyword && jsonData.keyword.length > 0) publicService.keywords = getKeywordArr(jsonData.keyword)
    if (jsonData.themes && jsonData.themes.length > 0) publicService.themes = getThemesArray(jsonData.themes)
    var sector = jsonData.sector_1 + jsonData.sector_2 + jsonData.sector_3 + jsonData.sector_4
    if (sector && sector.length > 0) publicService.sector = getSectorArray(sector)
    //regulationsAndRules
    //technicalStandards
    publicService.serviceType = templateData.entePa
    publicService.languages = jsonData.language
    //publicService.requires = 
    //publicService.relations = 
    if (jsonData.organizations && jsonData.organizations.length > 0) publicService.organizations = getOrganizationsArray(jsonData.organizations)
    if (jsonData.contacts && jsonData.contacts.length > 0) publicService.contacts = getContactsArray(jsonData.contacts)
    if (jsonData.temporalCoverage && jsonData.temporalCoverage.length) publicService.temporalCoverage = getTempCoverageArray(jsonData.temporalCoverage)
    //TODO: Authentications
    if (jsonData.input && jsonData.input.length > 0) publicService.input = getInputArray(jsonData.input)
    if (jsonData.output && jsonData.output.length > 0) publicService.output = getInputArray(jsonData.output)
    if (templateData.publicService.events.businessEvent.length > 0 || templateData.publicService.events.lifeEvent.length > 0)
        publicService.events = getEventsFromTemplate(templateData.publicService.events)

    //TODO: channels
    //TODO: costs
    //TODO: processingTimes
    //TODO: spatialCoverage
    if (jsonData.interactivityLevel) publicService.interactivityLevel = jsonData.interactivityLevel

    return publicService
}

function getLangValue(lang, value) {
    var langValue = {}

    langValue.language = lang
    langValue.description = value

    return langValue
}

function getIdDescription(id, description) {
    var idDescroption = {}

    idDescroption.id = id
    if (description) idDescroption.description = description

    return idDescroption
}

function getKeywordArr(keyword) {
    var kw = []

    for (var i = 0; i < keyword.length; i++) {
        kwVal = getLangValue(serviceLang, kw[i])
        kw.push(kwVal)
    }

    return kw
}

function getTemplate(templateId) {
    var templateData = utility.callTeplateByIdGET(templateId)
    return templateData
}

function getTemplateStr(templateId, templateName) {
    var templ = {}

    templ.id = templateId
    templ.name = templateName

    return templ
}

function getThemesArray(themes) {
    var themesData = utility.callThemesArrayByIdGET(themes, serviceLang)
    var themeArray = []

    for (var i = 0; i < themesData.length; i++) {
        themeArray.push(getIdDescription(themesData[i].identifier, themesData[i].label))
    }

    return themeArray
}

function getSectorArray(sector) {
    var sectorData = utility.callSectorArrayByIdGET(sector)
    var sectorArray = []

    for (var i = 0; i < sectorData.length; i++) {
        var s = {}
        s.idNace = sectorData[i].identifier
        s.levelNace = sectorData[i].idLevel
        s.description = sectorData[i].description

        sectorArray.push(s)
    }

    return sectorArray
}

function getOrganizationsArray(organization) {
    var organizationArray = []

    for (var i = 0; i < organization.length; i++) {
        var organizationData = utility.callOrganizationByNameGET(organization[i].name)

        var s = {}

        if (organizationData.length == 1) {

            if (organizationData[0].type) s.type = organizationData[0].type
            if (organizationData[0].organizationCode) s.organizationCode = organizationData[0].organizationCode
        }

        s.name = organization[i].name
        if (organization[i].role) s.role = organization[i].role

        if (organization[i].startDateTime || organization[i].endDateTime) {
            var dAr = []
            var d = {}
            if (organization[i].startDateTime) d.startDateTime = organization[i].startDateTime
            if (organization[i].endDateTime) d.endDateTime = organization[i].endDateTime
            dAr.push(d)
            s.date = dAr
        }
        organizationArray.push(s)
    }

    return organizationArray
}

function getContactsArray(contacts) {
    var contactArray = []

    for (var i = 0; i < contacts.length; i++) {
        var con = contacts[i]
        var c = {}

        if (con.office && con.office.description) { c.office = getLangValue(serviceLang, con.office.description) }
        if (con.phoneNumber) c.phoneNumber = con.phoneNumber
        if (con.email) c.email = con.email
        if (con.web) c.web = con.web

        contactArray.push(c)
    }
    return contactArray
}

function getTempCoverageArray(tempCoverage) {
    var tCovAr = []
    var tC = {}

    if (tempCoverage.startInterval) tC.startInterval = tempCoverage.startInterval
    if (tempCoverage.endInterval) tC.endInterval = tempCoverage.endInterval
    if (tempCoverage.weekDays && tempCoverage.weekDays.length > 0) tC.weekDays = tempCoverage.weekDays

    tCovAr.push(tC)

    return tCovAr
}

function getInputArray(input) {
    var iAr = []

    for (var j = 0; j < input.length; j++) {
        var ipt = input[j]
        var i = {}

        if (ipt.referenceDocumentation) i.referenceDocumentation = ipt.referenceDocumentation
        if (ipt.name) i.name = ipt.name
        if (ipt.type) i.type = getInOutObj(ipt.type.identifier)
        iAr.push(i)
    }

    return iAr
}

function getOutputArray(output) {
    var oAr = []

    for (var j = 0; j < output.length; j++) {
        var opt = output[j]
        var o = {}

        if (opt.name) i.name = opt.name
        if (opt.type) i.type = getInOutObj(opt.type.identifier)
        oAr.push(o)
    }

    return oAr
}

function getInOutObj(type) {
    var inOut = {}
    var ioTypeAr = utility.callInputOutputByTypeGET(type, serviceLang)

    if (ioTypeAr.length > 0) {
        var ioType = ioTypeAr[0]

        inOut.identifier = ioType.identifier
        inOut.rdfUri = ioType.rdfUri
        inOut.label = ioType.label
        inOut.language = ioType.language
    }
    return inOut
}

function getEventsFromTemplate(events) {
    var evObj = {}

    if (events.businessEvent.length > 0) { evObj.businessEvent = events.businessEvent }
    if (events.lifeEvent.length > 0) { evObj.lifeEvent = events.lifeEvent }

    return evObj
}