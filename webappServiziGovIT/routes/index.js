var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var request = require('request');

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
router.post('/serverApi', ensureAuthenticated, function (req, res) {
	var options;
	var filter = ''
	if (req.body.query)
		filter = req.body.query;
	var uri = 'https://nomeutente:-@' + req.body.name + '.xxxx/api/' + req.body.collection + filter;
	if (req.body.verb == "post" || req.body.verb == "POST") {
		options = {
			form: req.body.data,
			uri: uri,
		};
		return request.post(options, function (error, response, body) {

			if (!error && response.statusCode === 200) {
				res.json(body);
			} else {

				res.json(error);
			}
		});
	} else {
		options = {
			method: req.body.verb,
			uri: uri,
			headers: {
				'Content-type': 'application/json',
			}
		};
		return request(options, function (error, response, body) {
			if (!error && response.statusCode === 200)
				res.json(body);
		}).on('error', function (error) {
			res.json(error);
		});
	}
})

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash('error_msg', 'You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;