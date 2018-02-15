
fs = require('fs');
var xmlreader = require('xmlreader');
var parseString = require('xml2js').parseString;
var docFile = fs.readFileSync('temi.xml');

var jsonDoc = [];

parseString(docFile, function (err, result) {
    var recordCollection = result["data-theme"]["record"];

    for (var i = 0; i < recordCollection.length; i++) {
        var record = recordCollection[i];
        var labels = record["label"];

        var labelIt = '';
        var labelEn = '';

        if (labels != undefined) {
            for (var k = 0; k < labels.length; k++) {

                var lgVersion = labels[k]["lg.version"]

                for (var n = 0; n < lgVersion.length; n++) {

                    if (lgVersion[n].$["lg"] == "ita") { labelIt = lgVersion[n]._ }
                    if (lgVersion[n].$["lg"] == "eng") { labelEn = lgVersion[n]._ }
                }
            }
        }

        var itemIt = {
            "identifier": record["authority-code"][0],
            "rdfUrl": "http://publications.europa.eu/resource/authority/data-theme/" + record["authority-code"][0],
            "label": labelIt,
            "language": "it"
        };

        var itemEn = {
            "identifier": record["authority-code"][0],
            "rdfUrl": "http://publications.europa.eu/resource/authority/data-theme/" + record["authority-code"][0],
            "label": labelEn,
            "language": "en"
        };

        jsonDoc.push(itemIt);
        jsonDoc.push(itemEn);
    }

    fs.writeFileSync('theme.json', JSON.stringify(jsonDoc));
});
