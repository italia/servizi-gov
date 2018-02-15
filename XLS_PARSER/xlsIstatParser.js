var fs = require('fs');
var parseXlsx = require('excel');
fs.readdirSync('./dataIstat').forEach(file => {
    parseXlsx('./dataIstat/' + file, function (err, data) {
        if (err) throw err;

        var regioneCounter = 0
        var provinciaCounter = 0
        var comuneCounter = 0

        var regioneArray = []
        var provinciaArray = []
        var comuneArray = []

        var regioneId = ''
        var provinciaId = ''

        for (var i = 1; i < data.length; i++) {
            var dataRow = data[i]
            if (dataRow[0] != "") {

                if (dataRow[0] != regioneId) {
                    regioneId = dataRow[0]
                    var regione = {}

                    regione.codiceRegione = dataRow[0]
                    regione.codiceRipartizioneGeografica = dataRow[7]
                    regione.ripartizioneGeografica = dataRow[8]
                    regione.denominazioneRegione = dataRow[9]

                    regioneArray.push(regione)
                    regioneCounter++
                }

                if (dataRow[2] != provinciaId) {
                    provinciaId = dataRow[2]
                    var provincia = {}

                    provincia.codiceCittaMetropolitana = dataRow[1]
                    provincia.codiceProvincia = dataRow[2]
                    var denominazione = ''
                    if (dataRow[10] != '-') { denominazione = dataRow[10] } else { denominazione = dataRow[11] }
                    provincia.denomProvCitMetropol = denominazione
                    provincia.siglaAutomobilistica = dataRow[13]

                    provincia.codiceRegione = dataRow[0]
                    provincia.codiceRipartizioneGeografica = dataRow[7]
                    provincia.denominazioneRegione = dataRow[9]

                    provinciaArray.push(provincia)
                    provinciaCounter++
                }

                var comune = {}

                comune.denominazioneIt = dataRow[5]
                if (dataRow[6] != "") comune.denominazioneDe = dataRow[6]
                comune.codiceNum = dataRow[14]
                comune.codiceCatastale = dataRow[18]

                comune.codiceProvincia = dataRow[2]
                var denominazione = ''
                if (dataRow[10] != '-') { denominazione = dataRow[10] } else { denominazione = dataRow[11] }
                comune.denomProvCitMetropol = denominazione
                comune.siglaAutomobilistica = dataRow[13]

                comune.codiceRegione = dataRow[0]
                comune.codiceRipartizioneGeografica = dataRow[7]
                comune.denominazioneRegione = dataRow[9]

                comuneArray.push(comune)
                comuneCounter++
            }
        }

        fs.writeFileSync('regione.json', JSON.stringify(regioneArray));
        fs.writeFileSync('provincia.json', JSON.stringify(provinciaArray));
        fs.writeFileSync('comune.json', JSON.stringify(comuneArray));

        console.log('regioneCounter   -> ' + regioneCounter)
        console.log('provinciaCounter -> ' + provinciaCounter)
        console.log('comuneCounter    -> ' + comuneCounter)
    })
})