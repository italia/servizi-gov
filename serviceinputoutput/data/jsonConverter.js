var fs = require('fs');

var jsonDoc = [];

var jsonConverter = function jsonLd2JsonModel(pathUrl){
    
    
    //var data = fs.readFileSync('./data/ServiceInputOutput.jsonld');
    var data = fs.readFileSync(pathUrl);
    var dataParsed = JSON.parse(data);
    var dataGraph = dataParsed["@graph"];
    
    fetchJsonToModel(dataGraph, pathUrl);
    
    return writeJsonResult(jsonDoc);
}

module.exports.jsonConverter = jsonConverter;

function fetchJsonToModel(dataGraph, pathUrl){
    for(var i = 0; i < dataGraph.length; i++){
        var document = dataGraph[i];

        var lv1key = 'lv1child';

        if(document["clvapit:hasRankOrder"] != null && document["clvapit:hasRankOrder"] != undefined && document["clvapit:hasRankOrder"] == "1" ){

            var labelIt = '';
            var labelEn = '';

            var labels = document["skos:prefLabel"];

            if(labels != undefined){
                for(var k = 0; k < labels.length; k++){
                    if(labels[k]["@language"] == "it"){ labelIt = labels[k]["@value"]; } 
                    if(labels[k]["@language"] == "en"){ labelEn = labels[k]["@value"]; }
                }
            }

            var definitionIt = '';
            var definitionEn = '';

            var definitions = document["skos:definition"];

            if(definitions != undefined){
                for(var j = 0; j < labels.length; j++){
                    if(definitions[j]["@language"] == "it"){ definitionIt = definitions[j]["@value"]; } 
                    if(definitions[j]["@language"] == "en"){ definitionEn = definitions[j]["@value"]; }
                }
            }

            var itemIt = { 
                "identifier": document["dcterms:identifier"],
                "rdfuri": document["@id"], 
                "label": labelIt,
                "definition": definitionIt,
                "language": "it"
            };

            var itemEn = { 
                "identifier": document["dcterms:identifier"],
                "rdfuri": document["@id"], 
                "label": labelEn,
                "definition": definitionEn,
                "language": "en"
            };

            jsonDoc.push(itemIt);
            jsonDoc.push(itemEn);
        }
    }
}

function writeJsonResult(jsonToWrite){
    // fs.writeFile('../data/serviceInputOutput.json', JSON.stringify(jsonToWrite), (err) => {

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
    fs.writeFileSync('./data/serviceInputOutput.json', JSON.stringify(jsonToWrite));
}



