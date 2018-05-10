'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
const basicAuth = require('express-basic-auth')
// const cors = require('cors')

var app = module.exports = loopback();
//const ai = require('applicationinsights')
app.start = function () {
  // ai.setup("d2cafbb4-a436-44cd-9eaa-be7948d8a633")
  //   .setAutoDependencyCorrelation(true)
  //   .setAutoCollectRequests(true)
  //   .setAutoCollectPerformance(true)
  //   //.setAutoCollectExceptions(true)
  //   .setAutoCollectDependencies(true)
  //   .setAutoCollectConsole(true)
  //   .setUseDiskRetryCaching(true)
  // ai.start();
  // start the web server
  return app.listen(function () {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function (err) {
  if (err) throw err;

  app.use(basicAuth({
    users: { 'nomeutente': '-' },
    unauthorizedResponse: getUnauthorizedResponse
  }))



  // app.use(cors({
  //   origin: function (origin, callback) {
  //     if (!origin) return callback(null, true);
  //     if (allowedOrigins.indexOf(origin) === -1) {
  //       var msg = 'The CORS policy for this site does not ' +
  //         'allow access from the specified Origin.';
  //       return callback(new Error(msg), false);
  //     }
  //     return callback(null, true);
  //   },

  // }));


  function getUnauthorizedResponse(req) {
    return req.auth
      ? ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected')
      : 'No credentials provided'
  }

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
