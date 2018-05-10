var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var router = express.Router();
var request = require('request');
// Get Homepage
router.get('/', ensureAuthenticated, function (req, res) {
	res.render('index2');
});

// Login
router.get('/index', ensureAuthenticated, function (req, res) {
	res.render('servizi/index');
});

router.get('/dashboard', ensureAuthenticated, function (req, res) {
	res.render('dashboard');
});

router.get('/service-new', ensureAuthenticated, function (req, res) {
	res.render('servizi/service-new');
});

router.get('/service-wizard-complete1', ensureAuthenticated, function (req, res) {
	res.render('servizi/service-wizard-complete1');
});

router.get('/service-wizard-complete2', ensureAuthenticated, function (req, res) {
	res.render('servizi/service-wizard-complete2');
});

router.get('/service-wizard1', ensureAuthenticated, function (req, res) {
	res.render('servizi/service-wizard1');
});

router.get('/service-wizard2', ensureAuthenticated, function (req, res) {
	res.render('servizi/service-wizard2');
});

router.get('/service-from-spid-1', ensureAuthenticated, function (req, res) {
	res.render('servizi/service-from-spid-1');
});

router.get('/service-from-spid-2', ensureAuthenticated, function (req, res) {
	res.render('servizi/service-from-spid-2');
});

router.get('/accesscontrol/index', ensureAuthenticated, function (req, res) {
	res.render('accesscontrol/index');
});

router.get('/service-wizard-complete-archived2', ensureAuthenticated, function (req, res) {
	res.render('servizi/service-wizard-complete-archived2');
});

// router.post('/login', passport.authenticate('local', {successRedirect:'/servizi/index', failureRedirect:'/users/login',failureFlash: true}),
// function(req, res) {
//   res.redirect('/servizi');
// });
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}
module.exports = router;