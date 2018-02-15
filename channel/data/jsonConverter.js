var fs = require('fs');

var jsonDoc = [];

var jsonConverter = function jsonLd2JsonModel(pathUrl) {
    //var data = fs.readFileSync('./data/Channel.jsonld');
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
        var lv2key = 'lv2child';

        if (document["clvapit:hasRankOrder"] != null && document["clvapit:hasRankOrder"] != undefined && document["clvapit:hasRankOrder"] == "1") {

            var descriptionIt = '';
            var descriptionEn = '';

            console.log(document["dcterms:identifier"])

            var labels = document["skos:prefLabel"];

            for (k = 0; k < labels.length; k++) {
                if (labels[k]["@language"] == "it") { descriptionIt = labels[k]["@value"]; }
                if (labels[k]["@language"] == "en") { descriptionEn = labels[k]["@value"]; }
            }

            var itemIt = {
                "lv0id": document["dcterms:identifier"],
                "lv0rdfuri": document["@id"],
                "lv0description": descriptionIt,
                "language": "it"
            };

            var itemEn = {
                "lv0id": document["dcterms:identifier"],
                "lv0rdfuri": document["@id"],
                "lv0description": descriptionEn,
                "language": "en"
            };

            if (document["skos:narrower"] != null && document["skos:narrower"] != undefined && document["skos:narrower"].length != 0) {

                itemIt[lv1key] = [];
                itemEn[lv1key] = [];

                for (var j = 0; j < document["skos:narrower"].length; j++) {

                    var lvUpObj = getLevelUpObj(document["skos:narrower"][j]["@id"], pathUrl);

                    console.log(lvUpObj["dcterms:identifier"])

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
                            "lv1description": descriptionLvUpIt,
                            "lv1rdfuri": document["skos:narrower"][j]["@id"],
                            "lv0id": document["dcterms:identifier"],
                            "lv0rdfuri": document["@id"]
                        };

                        var subItemEn = {
                            "lv1id": lvUpObj["dcterms:identifier"],
                            "lv1description": descriptionLvUpEn,
                            "lv1rdfuri": document["skos:narrower"][j]["@id"],
                            "lv0id": document["dcterms:identifier"],
                            "lv0rdfuri": document["@id"]
                        };

                        if (lvUpObj["skos:narrower"] != null && lvUpObj["skos:narrower"] != undefined && lvUpObj["skos:narrower"].length != 0) {
                            subItemIt[lv2key] = [];
                            subItemEn[lv2key] = [];

                            for (var m = 0; m < lvUpObj["skos:narrower"].length; m++) {
                                var lv2Obj = getLevelUpObj(lvUpObj["skos:narrower"][m]["@id"], pathUrl);

                                console.log(lv2Obj["dcterms:identifier"])

                                if (lv2Obj != undefined) {

                                    var descriptionLv2It = '';
                                    var descriptionLv2En = '';

                                    var labelsLv2 = lv2Obj["skos:prefLabel"];

                                    for (var p = 0; p < labelsLv2.length; p++) {
                                        if (labelsLv2[p]["@language"] == "it") { descriptionLv2It = labelsLv2[p]["@value"]; }
                                        if (labelsLv2[p]["@language"] == "en") { descriptionLv2En = labelsLv2[p]["@value"]; }
                                    }

                                    var subItem2It = {
                                        "lv2id": lv2Obj["dcterms:identifier"],
                                        "lv2description": descriptionLv2It,
                                        "lv2rdfuri": lvUpObj["skos:narrower"][m]["@id"],
                                        "lv1id": lvUpObj["dcterms:identifier"],
                                        "lv1rdfuri": lvUpObj["@id"]
                                    };

                                    var subItem2En = {
                                        "lv2id": lv2Obj["dcterms:identifier"],
                                        "lv2description": descriptionLv2En,
                                        "lv2rdfuri": lvUpObj["skos:narrower"][m]["@id"],
                                        "lv1id": lvUpObj["dcterms:identifier"],
                                        "lv1rdfuri": lvUpObj["@id"]
                                    };

                                    subItemIt[lv2key].push(subItem2It);
                                    subItemEn[lv2key].push(subItem2En);
                                }
                            }
                        }

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
    //var dataLevelUp = fs.readFileSync('./data/Channel.jsonld');
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
    // fs.writeFile('../data/channel.json', JSON.stringify(jsonToWrite), (err) => {

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
    fs.writeFileSync('./data/channel.json', JSON.stringify(jsonToWrite));
}



