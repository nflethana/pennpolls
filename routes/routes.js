//====================================================
//	Import libraries
//====================================================

var db = require('../models/awsdb.js');

//====================================================
//	Handle First Step for User Connections
//====================================================

var getPennPolls = function(req, res) {
	res.render('pennpolls.ejs', {message: req.session.msg});
	req.session.msg = false;
};

var postCreateAccount = function(req, res) {
	// Extract User data from request body
	var email = req.body.createAccountEmail;
	var password = req.body.createAccountPassword;
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var gradyear = req.body.gradyear;
	var schools = req.body.schools;
	var pennkey = req.body.pennkey;
	var phonenumber = req.body.phonenumber;

	// log that data biatch!
	console.log("find me in postCreateAccount");
	console.log(JSON.stringify(email));
	console.log(JSON.stringify(password));
	console.log(JSON.stringify(firstname));
	console.log(JSON.stringify(lastname));
	console.log(JSON.stringify(gradyear));
	console.log(JSON.stringify(schools));
	console.log(JSON.stringify(pennkey));
	console.log(JSON.stringify(phonenumber));

	// Make sure all of the data is in the correct format
	// Still need to check the email
	if (password.length < 8) res.render('pennpolls.ejs', 
		{message: "Password must be more than 8 characters"});
	if (gradyear < 2012 || gradyear > 2018) 
		res.render('pennpolls.ejs', {message: "You must still be attending the University of Pennsylvania to create an account."});
	if (schools.length < 1 || schools.length > 2)
		res.render('pennpolls.ejs', {message: "You can only attend a maximum of two schools."});
	if (pennkey.length != 8) res.render('pennpolls.ejs', {message: "That is not a valid Pennkey"});
	var pieces = phonenumber.split('-');
	if (pieces.length != 3) res.render('pennpolls.ejs', {message: "The phone number is in the wrong format."});
	if (isNaN(pieces[0]) || isNaN(pieces[1]) || isNaN(pieces[2]))
		res.render('pennpolls.ejs', {message: "Phone number is not in the right format."});
	if (phonenumber.length != 12) res.render('pennpolls.ejs', {message: "Phone number is not the correct length."});

	// Try adding the User to the database
	db.putUserInUsersTable(email, password, schools, 
		gradyear, firstname, lastname, pennkey, phonenumber, function(err, data) {

		if (err) console.log(err);
		else {
			if (data.success) {
				// Log the user in via sessions
				req.session.msg = false;
				req.session.email = data.email;
				req.session.password = data.password;
				req.session.userData = data;

				// Redirect the user to their respective homepage
				res.redirect('/'+data.uid);
			}
		}
	});
};

var getHomePage = function(req, res) {
	if (isSignedIn(req, res)) {
		res.render('home.ejs', {message: false, userData: req.session.userData});
	} else {
		req.session.msg = "You must sign in first!";
		res.redirect('/');
	}
};

//====================================================
//	Handle Initial Poll Funcitons
//====================================================

var postNewPoll = function(req, res) {

};

//====================================================
//	Helper Functions
//====================================================

var isSignedIn = function(req, res) {
	if (req.session.email && req.session.password) {
		return true;
	} else {
		return false;
	}
};

//====================================================
//	Define Routing Functions
//====================================================

var routes = {
	getPennPolls: getPennPolls,
	postCreateAccount: postCreateAccount,
	getHomePage: getHomePage,
	getNewPoll: getNewPoll
};
module.exports = routes;