var fs = require('fs');

var jsonDoc = [];

var jsonConverter = function jsonLd2JsonModel(pathUrl) {


    //var data = fs.readFileSync('./data/Authentication.jsonld');
    var data = fs.readFileSync(pathUrl);
    var dataParsed = JSON.parse(data);
    var dataGraph = dataParsed["@graph"];

    fetchJsonToModel(dataGraph, pathUrl);

    return writeJsonResult(jsonDoc);
}

module.exports.jsonConverter = jsonConverter;

function fetchJsonToModel(dataGraph, pathUrl) {
    for (var i = 0; i < dataGraph.length; i++) {
        var document = dataGraph[i];

        var lv1key = 'lv1child';

        if (document["clvapit:hasRankOrder"] != null && document["clvapit:hasRankOrder"] != undefined && document["clvapit:hasRankOrder"] == "1") {

            var descriptionIt = '';
            var descriptionEn = '';

            var labels = document["skos:prefLabel"];

            for (k = 0; k < labels.length; k++) {
                if (labels[k]["@language"] == "it") { descriptionIt = labels[k]["@value"]; }
                if (labels[k]["@language"] == "en") { descriptionEn = labels[k]["@value"]; }
            }

            var itemIt = {
                "lv0id": document["dcterms:identifier"],
                "lv0rdfuri": document["@id"],
                "description": descriptionIt,
                "language": "it"
            };

            var itemEn = {
                "lv0id": document["dcterms:identifier"],
                "lv0rdfuri": document["@id"],
                "description": descriptionEn,
                "language": "en"
            };

            var orderNumber = getOrderNumber(document["dcterms:identifier"])

            if(orderNumber != 0){
                itemIt.order = orderNumber
                itemEn.order = orderNumber
            }

            if (document["skos:narrower"] != null && document["skos:narrower"] != undefined && document["skos:narrower"].length != 0) {

                itemIt[lv1key] = [];
                itemEn[lv1key] = [];

                for (var j = 0; j < document["skos:narrower"].length; j++) {

                    var lvUpObj = getLevelUpObj(document["skos:narrower"][j]["@id"], pathUrl);

                    if (lvUpObj != undefined) {

                        var descriptionLvUpIt = '';
                        var descriptionLvUpEn = '';

                        var labelsLvUp = lvUpObj["skos:prefLabel"];

                        for (var n = 0; n < labelsLvUp.length; n++) {
                            if (labelsLvUp[n]["@language"] == "it") { descriptionLvUpIt = labelsLvUp[n]["@value"]; }
                            if (labelsLvUp[n]["@language"] == "en") { descriptionLvUpEn = labelsLvUp[n]["@value"]; }
                        }

                        var subItemIt = {
                            "lv1id": lvUpObj["dcterms:identifier"],
                            "description": descriptionLvUpIt,
                            "lv1rdfuri": document["skos:narrower"][j]["@id"],
                            "lv0id": document["dcterms:identifier"],
                            "lv0rdfuri": document["@id"]
                        };

                        var subItemEn = {
                            "lv1id": lvUpObj["dcterms:identifier"],
                            "description": descriptionLvUpEn,
                            "lv1rdfuri": document["skos:narrower"][j]["@id"],
                            "lv0id": document["dcterms:identifier"],
                            "lv0rdfuri": document["@id"]
                        };

                        itemIt[lv1key].push(subItemIt);
                        itemEn[lv1key].push(subItemEn);
                    }
                }
            }

            jsonDoc.push(itemIt);
            jsonDoc.push(itemEn);
        }
    }
}

function getLevelUpObj(identifier, pathUrl) {
    //var dataLevelUp = fs.readFileSync('./data/Authentication.jsonld');
    var dataLevelUp = fs.readFileSync(pathUrl);
    var dataParsedLevelUp = JSON.parse(dataLevelUp);
    var dataGraphLevelUp = dataParsedLevelUp["@graph"];

    for (i = 0; i < dataGraphLevelUp.length; i++) {
        if (dataGraphLevelUp[i]["@id"] == identifier) {
            return dataGraphLevelUp[i];
        }
    }
}

function writeJsonResult(jsonToWrite) {
    // fs.writeFile('../data/authentication.json', JSON.stringify(jsonToWrite), (err) => {

    //     var retVal = '';

    //     if (err){
    //         retVal = err.message;
    //         throw err;
    //     }
    //     else{
    //         retVal = "dati trasformati correttamente";
    //     }
    //     return retVal;
    //   });
    fs.writeFileSync('./data/authentication.json', JSON.stringify(jsonToWrite));
}

function getOrderNumber(lv0id) {
    switch (lv0id) {
        case "NONE":
            return 1
            break;
        case "2FA":
            return 3
            break;
        case "2FAHW":
            return 4
            break;
        case "MFA":
            return 5
            break;
        case "SFA":
            return 2
            break;
        default:
            return 0
    }
}


