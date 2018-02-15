 'use strict';
 var exphbs = require('express-handlebars');
 var hbs = exphbs.create({
     defaultLayout: 'layout',
     helpers: {
         foo: function (prima, seconda) {
             return prima == seconda;
         },
         checkIsAdmin: function (user) {
             return checkIsAdmin(user)
         },
         bar: function () {
             return 'BAR!';
         }
     },
     extname: '.handlebars'
 });

 module.exports = hbs;

 function checkIsAdmin(user) {
     var control = false
     if (user.isSuperAdmin == false) {
         for (var a = 0; a < user.organizzazioni.length; a++) {
             if (user.organizzazioni[a].attributes[0].name == "admin") {
                 control = true
                 break;
             }
         }
     } else
         control = true
     return control
 }



 // module.exports = {