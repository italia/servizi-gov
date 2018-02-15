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
var datasource = require("./server/datasources.json");
const appInsights = require("applicationinsights");
const cors = require('cors')

mongoose.Promise = require('bluebird');

var ds = datasource.abacDS

mongoose.connect(ds.connector + '://' + ds.host + ':' + ds.port + '/'+ ds.database + '?ssl=true&replicaSet=globaldb', { user: ds.user, pass: ds.password }, function (err, db) { if(err) console.log(err) })


var db = mongoose.connection;
var exphbs = require('./lib/helpers.js');
var routes = require('./routes/index');
var users = require('./routes/users');
var servizi = require('./routes/servizi');
var accesscontrol = require('./routes/accesscontrol');

// Init App
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
// app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.engine('handlebars', exphbs.engine);
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
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
console.log("Started Application Insights agent")

app.use(cors())
app.use('/', routes);
app.use('/users', users);
app.use('/servizi',servizi);
app.use('/accesscontrol',accesscontrol);


// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});