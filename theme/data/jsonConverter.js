var fs = require('fs');

var jsonDoc = [];

var jsonConverter = function jsonLd2JsonModel(pathUrl){
    
    
    //var data = fs.readFileSync('./data/MappingDataThemeEurovoc.jsonld');
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

        if(document["skos:prefLabel"] != null && document["skos:prefLabel"] != undefined){

            var labelIt = '';
            var labelEn = '';

            var labels = document["skos:prefLabel"];

            if(labels != undefined){
                for(var k = 0; k < labels.length; k++){
                    if(labels[k]["@language"] == "it"){ labelIt = labels[k]["@value"]; } 
                    if(labels[k]["@language"] == "en"){ labelEn = labels[k]["@value"]; }
                }
            }

            var itemIt = { 
                "identifier": document["dcterms:identifier"],
                "rdfUrl": document["@id"],
                "label": labelIt,
                "language": "it"
            };

            var itemEn = { 
                "identifier": document["dcterms:identifier"],
                "rdfUrl": document["@id"],
                "label": labelEn,
                "language": "en"
            };

            jsonDoc.push(itemIt);
            jsonDoc.push(itemEn);
        }
    }
}

function writeJsonResult(jsonToWrite){
    // fs.writeFile('../data/theme.json', JSON.stringify(jsonToWrite), (err) => {

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
    fs.writeFileSync('./data/theme.json', JSON.stringify(jsonToWrite));
}



