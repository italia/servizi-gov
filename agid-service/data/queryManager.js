
var Uuid = require('uuid-lib')
var utility = require('./utility')

var serviceLang = 'it'

function checkUserCanCreate(userId, codiceIpa) {
    var retVal = false

    var attrRange = ["superAdmin", "admin", "DataManager", "DataEntry"]
    var userToCheck = utility.getUserById(userId)

    if (userToCheck.length == 1) {

        var usr = userToCheck[0]

        if (usr.isSuperAdmin || usr.organizzazioni.findIndex((item) => item.codiceIpa === codiceIpa) > -1) {
            retVal = true
        }
    }

    return retVal
}

module.exports.checkUserCanCreate = checkUserCanCreate;

function checkUserCanDelete(userId, codiceIpa) {
    var attrRange = ["superAdmin", "admin", "DataManager"]
    var retVal = false
    var userToCheck = utility.getUserById(userId)

    if (userToCheck.length == 1) {

        var usr = userToCheck[0]

        if (usr.isSuperAdmin ||
            ((usr.organizzazioni.findIndex((item) => item.codiceIpa === codiceIpa) > -1) &&
                ((usr.attributes.findIndex((item) => item.name === "admin") > -1)) || (usr.attributes.findIndex((item) => item.name === "DataManager") > -1))) {

            retVal = true
        }
    }

    return retVal
}

module.exports.checkUserCanDelete = checkUserCanDelete;

function checkUserCanResume(userId, codiceIpa) {
    var attrRange = ["superAdmin", "admin", "DataManager"]
    var retVal = false
    var userToCheck = utility.getUserById(userId)

    if (userToCheck.length == 1) {

        var usr = userToCheck[0]

        if (usr.isSuperAdmin ||
            ((usr.organizzazioni.findIndex((item) => item.codiceIpa === codiceIpa) > -1) &&
                ((usr.attributes.findIndex((item) => item.name === "admin") > -1)) || (usr.attributes.findIndex((item) => item.name === "DataManager") > -1))) {

            retVal = true
        }
    }

    return retVal
}

module.exports.checkUserCanResume = checkUserCanResume;

function checkUserCanChangeStatus(userId, codiceIpa) {
    var attrRange = ["superAdmin", "admin", "DataManager"]
    var retVal = false
    var userToCheck = utility.getUserById(userId)

    if (userToCheck.length == 1) {

        var usr = userToCheck[0]

        if (usr.isSuperAdmin ||
            ((usr.organizzazioni.findIndex((item) => item.codiceIpa === codiceIpa) > -1) &&
                ((usr.attributes.findIndex((item) => item.name === "admin") > -1)) || (usr.attributes.findIndex((item) => item.name === "DataManager") > -1))) {

            retVal = true
        }
    }

    return retVal
}

module.exports.checkUserCanChangeStatus = checkUserCanChangeStatus;

function createServiceDataObj(jsonData) {
    var serviceData = {}

    serviceData.version = "1"
    serviceData.creation = getUserDateStr(jsonData.userId)
    serviceData.publicationStatus = getPublicationStatusObj("R", jsonData.userId)
    serviceData.codiceIpa = jsonData.codiceIpa

    var publicServiceDataObj = getPublicServiceData(jsonData, "")

    serviceData.publicService = publicServiceDataObj

    serviceData.metadataPercentage = getMetadataPercentage(publicServiceDataObj)

    return serviceData
}

module.exports.createServiceDataObj = createServiceDataObj;

function updateServiceDataObj(jsonData, publicService) {
    var serviceData = {}

    serviceData.version = (+(publicService.version) + 1).toString()

    var cre = {}
    cre.date = publicService.creation.date
    cre.user = publicService.creation.user
    serviceData.creation = cre

    serviceData.update = getUserDateStr(jsonData.userId)

    var pub = {}
    pub.date = publicService.publicationStatus.date
    pub.user = publicService.publicationStatus.user
    pub.type = publicService.publicationStatus.type
    serviceData.publicationStatus = pub

    serviceData.codiceIpa = jsonData.codiceIpa

    var publicServiceDataObj = getPublicServiceData(jsonData, publicService)

    serviceData.publicService = publicServiceDataObj

    serviceData.metadataPercentage = getMetadataPercentage(publicServiceDataObj)

    return serviceData
}

module.exports.updateServiceDataObj = updateServiceDataObj;

function changePubStatus(pubStatus, userId) {
    return getPublicationStatusObj(pubStatus, userId)
}

module.exports.changePubStatus = changePubStatus;

function getUserDateStr(userId) {
    var userDate = {}

    userDate.date = utility.dateNow()
    userDate.user = userId

    return userDate
}

module.exports.getUserDateStr = getUserDateStr;

function getServiceToChange(serviceData) {
    var serviceChange = {}

    if (serviceData.version) serviceChange.version = serviceData.version
    // serviceChange.origId = serviceData.id.toString()
    serviceChange.origId = serviceData.publicService.id.toString()
    if (serviceData.creation) serviceChange.creation = serviceData.creation
    if (serviceData.update) serviceChange.update = serviceData.update
    if (serviceData.removal) serviceChange.removal = serviceData.removal
    if (serviceData.approval) serviceChange.approval = serviceData.approval
    if (serviceData.publicationStatus) serviceChange.publicationStatus = serviceData.publicationStatus
    if (serviceData.codiceIpa) serviceChange.codiceIpa = serviceData.codiceIpa
    if (serviceData.metadataPercentage) serviceChange.metadataPercentage = serviceData.metadataPercentage
    if (serviceData.publicService) serviceChange.publicService = serviceData.publicService

    return serviceChange
}

module.exports.getServiceToChange = getServiceToChange;

function getPublicServiceData(jsonData, oldService) {
    var publicService = {}

    var servName = []
    var servAltName = []
    var servDescr = []

    if (jsonData.templateRef && jsonData.templateRef != "") {
        var templateData = getTemplate(jsonData.templateRef)
        publicService.template = getTemplateStr(jsonData.templateRef, templateData.name)

        if (oldService == "") {
            servName.push(getLangValue(serviceLang, templateData.name))
        }
        else {
            servName = checkAndGetLangValueArray(serviceLang, templateData.name, oldService.publicService.name)
        }

        publicService.name = servName

        if (templateData.publicService.events && (templateData.publicService.events.businessEvent || templateData.publicService.events.lifeEvent)) {
            publicService.events = getEventsFromTemplate(templateData.publicService.events)
        }

    }
    else {
        var tmpl = {}
        tmpl.id = "NO-TEMPLATE SERVICE"
        tmpl.name = "NO-TEMPLATE SERVICE"
        publicService.template = tmpl

        if (oldService == "") {
            servName.push(getLangValue(serviceLang, jsonData.nomedelservizio))
        }
        else {
            servName = checkAndGetLangValueArray(serviceLang, jsonData.nomedelservizio, oldService.publicService.name)
        }

        publicService.name = servName
    }

    if (jsonData.serviceType) publicService.serviceType = jsonData.serviceType
    publicService.id = jsonData.codiceIpa + '_' + Uuid.raw()

    if (jsonData.nomedelservizioAlternativo) {
        if (oldService == "") {
            servAltName.push(getLangValue(serviceLang, jsonData.nomedelservizioAlternativo))
        }
        else {
            servAltName = checkAndGetLangValueArray(serviceLang, jsonData.nomedelservizioAlternativo, oldService.publicService.alternativeName)
        }

        publicService.alternativeName = servAltName
    }

    if (jsonData.descrizioneServizio) {
        if (oldService == "") {
            servDescr.push(getLangValue(serviceLang, jsonData.descrizioneServizio))
        }
        else {
            servDescr = checkAndGetLangValueArray(serviceLang, jsonData.descrizioneServizio, oldService.publicService.description)
        }

        publicService.description = servDescr
    }

    if (jsonData.altroIdentificativo) publicService.alternativeId = getIdDescription(jsonData.altroIdentificativo)

    publicService.status = jsonData.radioOptionStato
    publicService.serviceUrl = jsonData.urlservizio
    if (jsonData.paroleChiaveClass && jsonData.paroleChiaveClass.length > 0) publicService.keywords = getKeywordArr(jsonData.paroleChiaveClass)
    if (jsonData.temaCheck && jsonData.temaCheck.length > 0) publicService.themes = getThemesArray(jsonData.temaCheck)
    var sector = arraySectorAdder(jsonData.settoreservizio_1, jsonData.settoreservizio_2, jsonData.settoreservizio_3, jsonData.settoreservizio_4)
    if (sector && sector.length > 0) publicService.sector = getSectorArray(sector)
    publicService.languages = jsonData.linguaCheck
    if (jsonData.organizations && jsonData.organizations.length > 0) publicService.organizations = getOrganizationsArray(jsonData.organizations)
    if (jsonData.contacts && jsonData.contacts.length > 0) publicService.contacts = getContactsArray(jsonData.contacts)
    if (jsonData.temporalCoverage) publicService.temporalCoverage = getTempCoverageArray(jsonData.temporalCoverage)
    if (jsonData.inputCoperturaGeog) publicService.spatialCoverage = getSpatialCoverageArray(jsonData.inputCoperturaGeog)
    if (jsonData.checkAuth && jsonData.checkAuth.length > 0) publicService.authentications = getAuthArray(jsonData.checkAuth)
    if (jsonData.input && jsonData.input.length > 0) publicService.input = getInputArray(jsonData.input)
    if (jsonData.output && jsonData.output.length > 0) publicService.output = getOutputArray(jsonData.output)
    if (jsonData.channels) publicService.channels = getChannels(jsonData.channels)
    if (jsonData.costoEuro && jsonData.costoEuro.value.length > 0) publicService.costs = getCostArray(jsonData.costoEuro)
    if (jsonData.tempoProcessamento) publicService.processingTimes = getProcessingTimeArray(jsonData.tempoProcessamento)
    if (jsonData.radioOptionLivIner) publicService.interactivityLevel = jsonData.radioOptionLivIner

    //regulationsAndRules
    //technicalStandards
    //publicService.requires =
    //publicService.relations =

    return publicService
}

function checkAndGetLangValueArray(serviceLangVal, name, oldServLanValArray) {
    // var retArray = []

    for (var i = 0; i < oldServLanValArray.length; i++) {
        if (oldServLanValArray[i].language == serviceLangVal)
            oldServLanValArray[i] = getLangValue(serviceLangVal, name)
    }
    // retArray.push(oldServLanValArray)

    // return retArray
    return oldServLanValArray
}

function getLangValueArray(serviceLangVal, name, oldServLanValArray) {

    var checkVal = false
    var serviceLangValLower = serviceLangVal.toLowerCase()

    for (var i = 0; i < oldServLanValArray.length; i++) {
        if (oldServLanValArray[i].language == serviceLangValLower) {
            oldServLanValArray[i] = getLangValue(serviceLangVal, name)
            checkVal = true
        }
    }

    if (!checkVal)
        oldServLanValArray.push(getLangValue(serviceLangVal, name))

    return oldServLanValArray
}

module.exports.getLangValueArray = getLangValueArray;

function getLangValue(lang, value) {
    var langValue = {}

    langValue.language = lang.toLowerCase()
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
        kwVal = getLangValue(serviceLang, keyword[i])
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

function arraySectorAdder(s1, s2, s3, s4) {
    var s = []

    for (var i = 0; i < s1.length; i++) {
        if (s4 && s4[i] != "-") {
            s.push(s4[i])
        } else if (s3 && s3[i] != "-") {
            s.push(s3[i])
        } else if (s2 && s2[i] != "-") {
            s.push(s2[i])
        } else if (s1 && s1[i] != "-") {
            s.push(s1[i])
        }
    }
    return s
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

function getSpatialCoverageArray(inputCoperturaGeog) {
    var s = []

    for (var i = 0; i < inputCoperturaGeog.regione.length; i++) {
        if (inputCoperturaGeog.comune[i] != "-") {
            var comune = {}
            //var c = callComuneByCodiceCatastale(inputCoperturaGeog.comune[i])
            comune.type = "comune"
            comune.code = inputCoperturaGeog.comune[i]
            s.push(comune)
        } else if (inputCoperturaGeog.provincia[i] != "-") {
            var provincia = {}
            //var p = callProvinciaByCodiceProvincia(inputCoperturaGeog.provincia[i])
            provincia.type = "provincia"
            provincia.code = inputCoperturaGeog.provincia[i]
            s.push(provincia)
        } else if (inputCoperturaGeog.regione[i] != "-") {
            var regione = {}
            //var r = callregioneByCodiceRegione(inputCoperturaGeog.regione[i])
            regione.type = "regione"
            regione.code = inputCoperturaGeog.regione[i]
            s.push(regione)
        }
    }

    return s
}

function getOrganizationsArray(organization) {
    var organizationArray = []

    for (var i = 0; i < organization.length; i++) {
        if (organization[i].organizz && organization[i].organizz != "") {
            var organizationData = utility.callOrganizationByNameGET(organization[i].organizz)

            var s = {}

            if (organizationData.length == 1) {

                if (organizationData[0].type) s.type = organizationData[0].type
                if (organizationData[0].organizationCode) s.organizationCode = organizationData[0].organizationCode
            }

            s.name = organization[i].organizz
            if (organization[i].ruolo) s.role = organization[i].ruolo

            if (organization[i].date.length > 0) {

                var dataAr = organization[i].date[0]

                if (dataAr.dal || dataAr.al) {
                    var dAr = []
                    var d = {}
                    if (dataAr.dal) d.startDateTime = dataAr.dal
                    if (dataAr.al) d.endDateTime = dataAr.al
                    dAr.push(d)
                    s.date = dAr
                }
            }

            organizationArray.push(s)
        }
    }

    return organizationArray
}

function getContactsArray(contacts) {
    var contactArray = []

    for (var i = 0; i < contacts.length; i++) {
        var con = contacts[i]
        var c = {}

        if (con.office && con.office.nomeContatto) { c.office = getLangValue(serviceLang, con.office.nomeContatto) }
        if (con.telefonoContatto) c.phoneNumber = con.telefonoContatto
        if (con.emailContatto) c.email = con.emailContatto
        if (con.urlContatto) c.web = con.urlContatto

        contactArray.push(c)
    }
    return contactArray
}

function getTempCoverageArray(tempCoverage) {
    var tCovAr = []
    tempCoverage.forEach(element => {
        var tC = {}

        if (element.startInterval != '-' || element.endInterval != '-' || element.weekDays.length > 0) {

            if (element.startInterval && element.startInterval != '-') tC.startInterval = element.startInterval
            if (element.endInterval && element.endInterval != '-') tC.endInterval = element.endInterval
            if (element.weekDays && element.weekDays.length > 0) {

                tC.weekDays = element.weekDays[0].split(",").map(String);
            }

            tCovAr.push(tC)
        }
    });
    return tCovAr
}

function getInputArray(input) {
    var iAr = []

    for (var j = 0; j < input.length; j++) {
        var ipt = input[j]
        var i = {}

        if (ipt.docRifInputRichiesti) i.referenceDocumentation = ipt.docRifInputRichiesti
        if (ipt.nomeInputRichiesti) i.name = ipt.nomeInputRichiesti
        if (ipt.tipoInputRichiesti) i.type = getInOutObj(ipt.tipoInputRichiesti.label)
        iAr.push(i)
    }

    return iAr
}

function getOutputArray(output) {
    var oAr = []

    for (var j = 0; j < output.length; j++) {
        var opt = output[j]
        var o = {}

        if (opt.nomeOutputProdotti) o.name = opt.nomeOutputProdotti
        if (opt.tipoOutputProdotti) o.type = getInOutObj(opt.tipoOutputProdotti.label)
        oAr.push(o)
    }

    return oAr
}

function getInOutObj(type) {
    var inOut = {}
    //var ioTypeAr = utility.callInputOutputByTypeGET(type, serviceLang)
    var ioTypeAr = utility.callInputOutputByLabelGET(type, serviceLang)

    if (ioTypeAr.length > 0) {
        var ioType = ioTypeAr[0]

        inOut.identifier = ioType.identifier
        inOut.rdfUri = ioType.rdfuri
        inOut.label = ioType.label
        inOut.language = ioType.language
    }
    return inOut
}

function getEventsFromTemplate(events) {
    var evObj = {}

    if (events.businessEvent && events.businessEvent.length > 0) { evObj.businessEvent = events.businessEvent }
    if (events.lifeEvent && events.lifeEvent.length > 0) { evObj.lifeEvent = events.lifeEvent }

    return evObj
}

function getAuthArray(checkAuth) {
    var authAr = []
    var authFromServ = utility.callAuthArrayByLang(serviceLang)

    for (var k = 0; k < checkAuth.length; k++) {
        for (var i = 0; i < authFromServ.length; i++) {
            if (checkAuth[k] == authFromServ[i].type) authAr.push(authFromServ[i])
        }
    }

    return authAr
}

function getProcessingTimeArray(tempoProcessamento) {
    var tpArr = []

    if (tempoProcessamento.length > 0) {
        for (var i = 0; i < tempoProcessamento.length; i++) {
            if ((tempoProcessamento[i].value).trim() != "") tpArr.push(tempoProcessamento[i])
        }
    }

    return tpArr
}

function getChannels(channels) {
    var channel = {}

    if (channels.offlineChannels && channels.offlineChannels.length > 0) {
        var oc = []
        for (var o = 0; o < channels.offlineChannels.length; o++) {
            var offline = channels.offlineChannels[o]
            if (offline && offline.type) {
                var olc = {}

                olc.type = offline.type
                if (offline.subType != "-") olc.subType = offline.subType

                if (offline.locationName && offline.locationName.description != "") {
                    olc.locationName = offline.locationName
                }
                if (offline.streetType != "") olc.streetType = offline.streetType
                if (offline.streetName != "") olc.streetName = offline.streetName
                if (offline.number != "") olc.number = offline.number
                if (offline.city != "") olc.city = offline.city
                if (offline.postCode != "") olc.postCode = offline.postCode

                if (offline.geometry) {
                    var geo = {}
                    if (offline.geometry.type) geo.type = offline.geometry.type
                    if (offline.geometry.latitude) geo.latitude = offline.geometry.latitude
                    if (offline.geometry.longitude) geo.longitude = offline.geometry.longitude

                    olc.geometry = geo
                }

                oc.push(olc)
            }
        }
        channel.offlineChannels = oc
    }

    if (channels.webApplications && channels.webApplications.length > 0) {
        var wa = []
        for (var w = 0; w < channels.webApplications.length; w++) {
            var webapp = channels.webApplications[w]

            if (webapp && webapp.type) {
                var web = {}

                web.type = webapp.type
                if (webapp.url != "") web.url = webapp.url

                wa.push(web)
            }
        }
        channel.webApplications = wa
    }

    if (channels.phones && channels.phones.length > 0) {
        var ph = []
        for (var p = 0; p < channels.phones.length; p++) {
            var phone = channels.phones[p]

            if (phone && phone.type) {
                var pho = {}

                pho.type = phone.type
                if (phone.subType != "-") pho.subType = phone.subType
                if (phone.phoneNumber != "") pho.phoneNumber = phone.phoneNumber

                ph.push(pho)
            }
        }
        channel.phones = ph
    }

    if (channels.emails && channels.emails.length > 0) {
        var em = []
        for (var e = 0; e < channels.emails.length; e++) {
            var email = channels.emails[e]

            if (email && email.type) {
                var ema = {}

                ema.type = email.type
                if (email.subType != "-") ema.subType = email.subType
                if (email.email != "") ema.email = email.email

                em.push(ema)
            }
        }
        channel.emails = em
    }

    if (channels.otherElectronicChannels && channels.otherElectronicChannels.length > 0) {
        var oec = []
        for (var i = 0; i < channels.otherElectronicChannels.length; i++) {
            var otherElectronicChannel = channels.otherElectronicChannels[i]

            if (otherElectronicChannel && otherElectronicChannel.type) {
                var otherElCh = {}

                otherElCh.type = otherElectronicChannel.type
                if (otherElectronicChannel.subType != "-") otherElCh.subType = otherElectronicChannel.subType

                if (otherElectronicChannel.accessReference && otherElectronicChannel.accessReference.description != "") {
                    otherElCh.accessReference = otherElectronicChannel.accessReference
                }

                oec.push(otherElCh)
            }
        }
        channel.otherElectronicChannels = oec
    }

    return channel
}

function getCostArray(costoEuro) {
    var costArr = []

    for (var i = 0; i < costoEuro.value.length; i++) {
        var costo = {}
        costo.description = getLangValue(serviceLang, costoEuro.description[i])
        costo.currency = "Euro"
        costo.value = costoEuro.value[i]

        costArr.push(costo)
    }

    return costArr
}

function getPublicationStatusObj(pubStatusVal, userId) {
    var pubStatus = {}

    pubStatus.date = utility.dateNow()
    pubStatus.user = userId
    pubStatus.type = pubStatusVal

    return pubStatus
}

function getMetadataPercentage(serviceObj) {

    //property count max 25
    var propertyCount = Object.keys(serviceObj).length

    var percentage = (propertyCount / 25) * 100

    return (Math.round(percentage) <= 100) ? Math.round(percentage).toString() : '100'
}