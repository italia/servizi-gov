var fs = require('fs');

var jsonDoc = [];

//var jsonConverter = function jsonLd2JsonModel(pathUrl){

var data = fs.readFileSync('Authentication.jsonld');
//var data = fs.readFileSync(pathUrl);
var dataParsed = JSON.parse(data);
var dataGraph = dataParsed["@graph"];

fetchJsonToModel(dataGraph);

//return writeJsonResult(jsonDoc);
//}

//module.exports.jsonConverter = jsonConverter;

function fetchJsonToModel(dataGraph) {
    for (var i = 0; i < dataGraph.length; i++) {
        var document = dataGraph[i];

        var lv1key = 'lv1child';

        if (document["clvapit:hasRankOrder"] != null
            && document["clvapit:hasRankOrder"] != undefined
            && document["clvapit:hasRankOrder"] == "1"
            && document["dcterms:identifier"] == "MFA") {

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

            console.log("documento parsato");
            console.log(itemIt);

            console.log("controllo i figli");


            if (document["skos:narrower"] != null && document["skos:narrower"] != undefined && document["skos:narrower"].length != 0) {

                console.log("trovati figli");

                itemIt[lv1key] = [];
                itemEn[lv1key] = [];

                for (var j = 0; j < document["skos:narrower"].length; j++) {

                    console.log("prima della ricerca oggeto")
                    console.log(document["skos:narrower"][j]["@id"])

                    // var lvUpObj = getLevelUpObj(document["skos:narrower"][j]["@id"], pathUrl);
                    var lvUpObj = getLevelUpObj(document["skos:narrower"][j]["@id"]);

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
    var dataLevelUp = fs.readFileSync('Authentication.jsonld');

    console.log(dataLevelUp)

    //var dataLevelUp = fs.readFileSync(pathUrl);
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



