var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


//var User = require('../models/user');
var User = require('../models/userAbac');
var bcrypt = require('bcryptjs');

// Get Homepage
router.get('/', ensureAuthenticated, function (req, res) {
	res.render('index');
});

router.get('/index', ensureAuthenticated, function (req, res) {
	res.render('index');
});

router.get('/dashboard', ensureAuthenticated, function (req, res) {
	res.render('dashboard');
});

router.get('/dashboardArchiviati', ensureAuthenticated, function (req, res) {
	res.render('dashboardArchiviati');
});

router.get('/profilo', ensureAuthenticated, function (req, res) {
	res.render('profilo');
});








function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash('error_msg', 'You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;