//====================================================
//	Import libraries
//====================================================

var db = require('../models/awsdb.js');

//====================================================
//	Handle First Step for User Connections
//====================================================

var getPennPolls = function(req, res) {
	console.log("in getPennPolls");
	req.session.msg;
	res.render('pennpolls.ejs', {message: req.session.msg});
	req.session.msg = null;
};

var postCreateAccount = function(req, res) {
	console.log("in postCreateAccount");
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
	// if (password.length < 8) res.render('pennpolls.ejs', 
	// 	{message: "Password must be more than 8 characters"});
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
				req.session.msg = null;
				req.session.email = data.email;
				req.session.password = data.password;
				req.session.userData = data;

				// Redirect the user to their respective homepage
				res.redirect('/home/'+data.uid);
			}
		}
	});
};

var getCheckLogin = function(req, res) {
	// get the user's cridentials from the form
	var email = req.param('signInEmail');
	var password = req.param('password');
	console.log('in getCheckLogin');
	console.log(email);
	console.log(password);

	db.getCheckLogin(email, password, function(err, data) {
		if (err) {
			req.session.msg = "Error Logging User In: " + err;
			res.redirect('/');
		} else {
			var userData = {};
			console.log("find me in getCheckLogin");
			// console.log(JSON.stringify(data));
			console.log(JSON.stringify(data.email));
			console.log(JSON.stringify(data.password));
			console.log(JSON.stringify(data.id));
			console.log(JSON.stringify(data.schools));
			console.log(JSON.stringify(data.gradyear));
			console.log(JSON.stringify(data.firstname));
			console.log(JSON.stringify(data.lastname));
			console.log(JSON.stringify(data.phonenumber));
			console.log(JSON.stringify(data.pennkey));
			console.log(JSON.stringify(data.datecreated));

			req.session.email = data.email;
			req.session.password = data.password;
			req.session.userData = data;
			res.redirect('/home/'+data.id);
		}
	});
};

var getUserHomePage = function(req, res) {
	console.log("in getHomePage");

	if (isSignedIn(req, res)) {
		res.render('home.ejs', {message: null, userData: req.session.userData});
	} else {
		req.session.msg = "You must sign in first!";
		res.redirect('/');
	}
};

var getLogout = function(req, res) {
	// delete the user's session data and redirect 
	// to front page
	req.session.userData = null;
	req.session.email = null;
	req.session.password = null;
	req.session.msg = "You have been logged out.";
	res.redirect('/');
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
	console.log("in isSignedIn");
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
	getUserHomePage: getUserHomePage,
	postNewPoll: postNewPoll,
	getCheckLogin: getCheckLogin,
	getLogout: getLogout
};
module.exports = routes;