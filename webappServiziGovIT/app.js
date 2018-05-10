var envVar = (process.env && process.env.NODE_ENV) ? process.env.NODE_ENV : 'development'

var environment = envVar;
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var datasource = require("./server/datasources." + environment + ".json");
const appInsights = require("applicationinsights");
const cors = require('cors');
const helmet = require('helmet');
var csp = require('helmet-csp');
//const csp = require('express-csp-header');
mongoose.Promise = require('bluebird');
var noSniff = require('dont-sniff-mimetype');
var referrerPolicy = require('referrer-policy');
const nocache = require('nocache');
var ds = datasource.abacDS
mongoose.connect(ds.connector + '://' + ds.host + ':' + ds.port + '/' + ds.database + '?ssl=true', {
  user: ds.user,
  pass: ds.password
}, function (err, db) {
  if (err) console.log(err)
})
var db = mongoose.connection;
var exphbs = require('./lib/helpers.js');
var routes = require('./routes/index');
var users = require('./routes/users');
var servizi = require('./routes/servizi');
var accesscontrol = require('./routes/accesscontrol');

// Init App
var app = express();
app.disable('x-powered-by');

var allowedOrigins1 = ['https://servizi.gov.it',
  'https://beta.servizi.gov.it',
  'https://beta-servizi.gov.it',
  'https://beta-servizi-stage2.gov.it',
  'https://beta.servizi.xxxx',
  'https://beta-servizi.xxxx',
  'https://beta-servizi-stage2.xxxx',
  'https://sgiservice.xxxx',
  'https://sgiabaccontroller.xxxx',
  'https://sgiauth.xxxx',
  'https://sgibusinesseventtype.xxxx',
  'https://sgichannel.xxxx',
  'https://sgiinteractivitylevel.xxxx',
  'https://sgilifeeventtype.xxxx',
  'https://sginace.xxxx',
  'https://sgiorganization.xxxx',
  'https://sgiroletype.xxxx',
  'https://sgiserviceinputoutput.xxxx',
  'https://sgiservicestatus.xxxx',
  'https://sgiservicetemplate.xxxx',
  'https://sgispatialdefinition.xxxx',
  'https://sgithemes.xxxx',
  'https://az416426.vo.msecnd.net',
  'https://dc.services.visualstudio.com',
  'http://localhost:3500', 'http://localhost:3000',
  'https://sgistandardtipo.xxxx'
];

// Sets "X-Content-Type-Options: nosniff".
app.use(noSniff());

app.use(helmet());

app.use(helmet({
  frameguard: {
    action: 'deny'
  }
}));

app.use(referrerPolicy({
  policy: 'strict-origin-when-cross-origin'
}))

if (environment !== 'development') {
  app.use(csp({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://az416426.vo.msecnd.net'],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:'],
      objectSrc: ["'self'", 'data:'],
      connectSrc: allowedOrigins1
    },
    setAllHeaders: true
  }));
}

// View Engine
app.set('views', path.join(__dirname, 'views'));
// app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.engine('handlebars', exphbs.engine);
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

var expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 's3Cur3Alm4v1v4',
  name: 'sessionId'
  // cookie: {
  //   secure: true,
  //   httpOnly: true
  // }
}));
app.use(nocache())
// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

appInsights.setup("6c4561ee-8ba8-4ecf-8664-8b68d18d744a")
  .setAutoDependencyCorrelation(true)
  .setAutoCollectRequests(true)
  .setAutoCollectPerformance(true)
  .setAutoCollectExceptions(true)
  .setAutoCollectDependencies(true)
  .setAutoCollectConsole(true)
  .setUseDiskRetryCaching(true)
appInsights.start();
console.log("Starting with env %s", environment)
console.log("Started Application Insights agent")


var allowedOrigins = ['https://servizi.gov.it',
  'https://beta.servizi.gov.it',
  'https://beta-servizi.gov.it',
  'https://beta-servizi-stage2.gov.it',
  'https://beta.servizi.xxxx',
  'https://beta-servizi.xxxx',
  'https://beta-servizi-stage2.xxxx',
  'https://sgiservice.xxxx',
  'https://sgiabaccontroller.xxxx',
  'https://sgiauth.xxxx',
  'https://sgibusinesseventtype.xxxx',
  'https://sgichannel.xxxx',
  'https://sgiinteractivitylevel.xxxx',
  'https://sgilifeeventtype.xxxx',
  'https://sginace.xxxx',
  'https://sgiorganization.xxxx',
  'https://sgiroletype.xxxx',
  'https://sgiserviceinputoutput.xxxx',
  'https://sgiservicestatus.xxxx',
  'https://sgiservicetemplate.xxxx',
  'https://sgispatialdefinition.xxxx',
  'https://sgithemes.xxxx',
  'https://az416426.vo.msecnd.net',
  'https://dc.services.visualstudio.com',
  'http://localhost:3500', 'http://localhost:3000',
  'https://sgistandardtipo.xxxx'
];
if (environment !== 'development') {
  app.use(cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg = 'The CORS policy for this site does not ' +
          'allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },

  }));
}

app.use('/', routes);
app.use('/users', users);
app.use('/servizi', servizi);
app.use('/accesscontrol', accesscontrol);

// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function () {
  console.log('Server started on port ' + app.get('port'));
});