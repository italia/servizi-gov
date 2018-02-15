var fs = require('fs');


fs.readdirSync('./JSON_Separati').forEach(file => {
    var jsonData = require('./JSON_Separati/' + file);

    var counter = 0
    for (var i = 0; i < jsonData.length; i++) {
        counter++


    }

    console.log(file + ' -> ' + counter)
})