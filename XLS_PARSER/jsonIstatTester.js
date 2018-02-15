var fs = require('fs');


fs.readdirSync('./JSON_Istat').forEach(file => {
    var jsonData = require('./JSON_Istat/' + file);

    var counter = 0
    for (var i = 0; i < jsonData.length; i++) {
        counter++
    }

    console.log(file + ' -> ' + counter)
})