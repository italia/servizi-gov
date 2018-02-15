var fs = require('fs');

var parseXlsx = require('excel');

fs.readdirSync('./data').forEach(file => {
    parseXlsx('./data/' + file, function (err, data) {
        if (err) throw err;
        var counter = 0

        var fileEntePaIndex = file.substring(25, file.lastIndexOf('_'))
        var fileEntePa = file.substring(25, file.lastIndexOf('_')).replace('_', ' ')
        var templateArray = []

        for (var i = 1; i < data.length; i++) {
            var dataRow = data[i]
            if (dataRow[0] != "") {
                var template = {}

                template.templateIndex = dataRow[0] + '_' + fileEntePaIndex
                template.name = dataRow[11]
                template.entePa = fileEntePa
                template.publicService = getPublicServiceField(dataRow)

                templateArray.push(template)
                counter++
            }
        }

        fs.writeFileSync(fileEntePaIndex + '_serviceTemplates.json', JSON.stringify(templateArray));
        console.log(file + ' -> ' + counter)
    })
})

function getPublicServiceField(dataRow) {

    var publicService = {}

    publicService.name = getLangValue('it', dataRow[11])
    publicService.description = getLangValue('it', dataRow[12])
    publicService.keywords = getKeywordArray(dataRow[13])
    publicService.themes = getThemesArray(dataRow[1], dataRow[2])
    publicService.sector = getSectorArray(dataRow[3], dataRow[4], dataRow[5], dataRow[6], dataRow[7], dataRow[8], dataRow[9], dataRow[10])
    if (dataRow[14] != "" || dataRow[16] != "") publicService.events = getEvents(dataRow[14], dataRow[15], dataRow[16], dataRow[17])
    if (dataRow[19] != "") publicService.authentications = getAuthenticationArray()

    return publicService
}

function getLangValue(lang, value) {
    var langValue = {}

    langValue.language = lang
    langValue.description = value

    return langValue
}

function getIdDescription(id, description) {
    var idDescription = {}

    idDescription.id = id
    if (description) idDescription.description = description

    return idDescription
}

function getIdLeDescription(id, description) {
    var idDescription = {}

    idDescription.idLe = id
    if (description) idDescription.description = description

    return idDescription
}

function getIdBeDescription(id, description) {
    var idDescription = {}

    idDescription.idBe = id
    if (description) idDescription.description = description

    return idDescription
}

function getSector(id, level, descr) {
    var sector = {}

    sector.idNace = id
    sector.levelNace = level
    sector.description = descr

    return sector
}

function getKeywordArray(keywords) {
    var keywordArray = []
    var kw = keywords.split(',')

    for (var i = 0; i < kw.length; i++) {
        keywordArray.push(getLangValue('it', kw[i].trim()))
    }

    return keywordArray
}

function getThemesArray(id, description) {
    var themeArray = []

    themeArray.push(getIdDescription(id, description))

    return themeArray
}

function getSectorArray(id1, descr1, id2, descr2, id3, descr3, id4, descr4) {
    var sectorArray = []

    if (id1 != "" && descr1 != "") sectorArray.push(getSector(id1, '1', descr1))
    if (id2 != "" && descr2 != "") sectorArray.push(getSector(id2, '2', descr2))
    if (id3 != "" && descr3 != "") sectorArray.push(getSector(id3, '3', descr3))
    if (id4 != "" && descr4 != "") sectorArray.push(getSector(id4, '4', descr4))

    return sectorArray
}

function getEvents(idLe, descrLe, idBe, descrBe) {
    var events = {}

    if (idLe != "") {
        var leArray = []
        leArray.push(getIdLeDescription(idLe, descrLe))
        events.lifeEvent = leArray
    }

    if (idBe != "") {
        var beArray = []
        beArray.push(getIdBeDescription(idBe, descrBe))
        events.businessEvent = beArray
    }

    return events
}

function getAuthenticationArray() {
    var authArray = []

    var authObj = {}

    authObj.type = "SPIDL1"
    authObj.url = "http://dati.gov.it/onto/controlledvocabulary/Authentication/SPIDL1"

    authArray.push(authObj)

    return authArray
}
