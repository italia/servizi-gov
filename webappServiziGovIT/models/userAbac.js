var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// // User Schema
// var attribute = mongoose.Schema({
// 	name: {
// 		type: String
// 	},
// 	description: {
// 		type: String
// 	}
// });

// var organizzazione = mongoose.Schema({
// 	codiceIpa: {
// 		type: String
// 	},
// 	description: {
// 		type: String
// 	}
// });


// var user = mongoose.Schema({
// 	loginName: {
// 		type: String,
// 		index:true
// 	},
// 	codicefiscale: {
// 		type: String
// 	},
// 	email: {
// 		type: String
// 	},
// 	nome: {
// 		type: String
// 	},
// 	password: {
// 		type: String
// 	},
// 	cognome: {
// 		type: String
// 	},
// 	attributes:{
// 		type: [
// 			attribute
// 		]
// 	},
// 	organizzazioni:{
// 		type: [
// 			organizzazione
// 		]
// 	}
// });



// User Schema
var attribute = mongoose.Schema({
	name: {
		type: String
	},
	description: {
		type: String
	}
});

var organizzazione = mongoose.Schema({
	codiceIpa: {
		type: String
	},
	description: {
		type: String
	},
	attributes: {
		type: [attribute]
	}
});

var user = mongoose.Schema({
	loginName: {
		type: String,
		index: true
	},
	codicefiscale: {
		type: String
	},
	email: {
		type: String
	},
	nome: {
		type: String
	},
	password: {
		type: String
	},
	cognome: {
		type: String
	},
	codiceSPID: {
		type: String
	},
	isSuperAdmin: {
		type: Boolean
	},
	organizzazioni: {
		type: [
			organizzazione
		]
	}
});


var User = module.exports = mongoose.model('User', user, 'user');

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

//metodo esteso per cercare sul db abac
module.exports.getUserByUsernameAbac = function(username, callback){
	var query = {codicefiscale: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}