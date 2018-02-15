
fs = require('fs');
var xmlreader = require('xmlreader');
var parseString = require('xml2js').parseString;
var docFile = fs.readFileSync('NACE_REV2_20171106_171428.xml');

var jsonDoc = [];

parseString(docFile, function (err, result) {
    var itemCollection = result["Claset"]["Classification"][0]["Item"];

    var lv1Id = '';
    var lv2Id = '';
    var lv3Id = '';
    var lv4Id = '';

    for (var i = 0; i < itemCollection.length; i++) {
        var item = itemCollection[i];

        var identifier = item.$["id"];
        var idLevel = item.$["idLevel"];
        var description = item.Label[0].LabelText[0]._;

        var idParent = '';

        switch (idLevel) {
            case "1":
                lv1Id = item.$["id"];
                idParent = '';
                break;
            case "2":
                lv2Id = item.$["id"];
                idParent = lv1Id;
                break;
            case "3":
                lv3Id = item.$["id"];
                idParent = lv2Id;
                break;
            case "4":
                lv4Id = item.$["id"];
                idParent = lv3Id;
                break;
        }

        // if (item.$["idLevel"] != prevIdLevel) {
        //     lvUpId = item.$["id"]
        //     prevIdLevel = item.$["idLevel"]
        // }

        var itemNace = {
            "identifier": identifier,
            "idLevel": idLevel,
            "description": description,
            "idParent": idParent
        };

        jsonDoc.push(itemNace);
    }

    //console.log(jsonDoc)

    fs.writeFileSync('nace.json', JSON.stringify(jsonDoc));
});
