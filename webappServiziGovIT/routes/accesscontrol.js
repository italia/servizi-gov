var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var router = express.Router();



// Login
router.get('/index', ensureAuthenticated, isauthorizatedAccessControl, function (req, res) {
	res.render('accesscontrol/index');
});

router.get('/users', ensureAuthenticated, isauthorizatedAccessControl, function (req, res) {
	res.render('accesscontrol/users');
});


function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

function ensureAuthenticatedAccessControl(req, res, next) {
	if (req.isAuthenticated()) {

		req.user.attributes.forEach(function (element) {
			if (element.name == "superAdmin")
				return next();
			else
				res.redirect('/index');
		}, this);

	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/index');
	}
}

function isauthorizatedAccessControl(req, res, next) {
	var control = false;
	if(req.user.isSuperAdmin == false) {
		for (var a = 0; a < req.user.organizzazioni.length; a++) {
			if (req.user.organizzazioni[a].attributes[0].name == "admin") {
				control = true
				break;
			}
		}
	} else
		control = true

	if(!control){
		res.redirect('/index');
	}else{
		return next();
	}




}

module.exports = router;