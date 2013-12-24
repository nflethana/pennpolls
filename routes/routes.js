//====================================================
//	Import libraries
//====================================================

var db = require('../models/awsdb.js');

//====================================================
//	Handle First Step for User Connections
//====================================================

var getPennPolls = function(req, res) {
	res.render('pennpolls.ejs', {message: null});
};

var postCreateAccount = function(req, res) {
	var email = req.body.createAccountEmail;
	var password = req.body.createAccountPassword;
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var gradyear = req.body.gradyear;
	var schools = req.body.schools;

	console.log(JSON.stringify(email));
	console.log(JSON.stringify(password));
	console.log(JSON.stringify(firstname));
	console.log(JSON.stringify(lastname));
	console.log(JSON.stringify(gradyear));
	console.log(JSON.stringify(schools));
};

//====================================================
//	Define Routing Functions
//====================================================

var routes = {
	getPennPolls: getPennPolls,
	postCreateAccount: postCreateAccount
};
module.exports = routes;