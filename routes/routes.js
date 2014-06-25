//====================================================
//	Import libraries
//====================================================

var db = require('../models/awsdb.js');
var request = require('request');
var logger = require('tracer').colorConsole();
var request = require('request');

// Venmo Client Info
var CLIENT_ID = "1785";
var CLIENT_SECRET = "ytznZevekGqLkvsvXkNMzf4KStKGypLF";

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
	// console.log("CREATING ACCOUNT -> in postCreateAccount");
	// Extract User data from request body
	var email = req.body.createAccountEmail;
	var password = req.body.createAccountPassword;
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var gradyear = req.body.gradyear;
	var schools = req.body.schools;
	var pennkey = req.body.pennkey;
	// var phonenumber = req.body.phonenumber;

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
	var pieces = phonenumber.split('-');
	if (gradyear < 2012 || gradyear > 2018) {
		res.render('pennpolls.ejs', {message: "You must still be attending the University of Pennsylvania to create an account."});
	} else if (pennkey.length != 8) {
		res.render('pennpolls.ejs', {message: "That is not a valid Pennkey"});
	} else if (pieces.length != 3) { 
		res.render('pennpolls.ejs', { message: "The phone number is in the wrong format."});
	} else if (isNaN(pieces[0]) || isNaN(pieces[1]) || isNaN(pieces[2])) {
		res.render('pennpolls.ejs', {message: "Phone number is not in the right format."});
	} else if (phonenumber.length != 12) res.render('pennpolls.ejs', {message: "Phone number is not the correct length."});

	// Try adding the User to the database
	var user = {
		email: email,
		password: password,
		schools: schools,
		gradyear: gradyear,
		firstname: firstname,
		lastname: lastname,
		pennkey: pennkey,
		phonenumber: phonenumber
	};
	db.putUserInUsersTable(user, function(err, data) {
		if (err) {
			// console.log(err);
		} else {
			// Log the user in via sessions
			req.session.msg = null;
			req.session.email = data.email;
			req.session.password = data.password;
			req.session.userData = data;

			// Redirect the user to their respective homepage
			res.redirect('/home/'+data.email);
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
		} else if (!data) {
			req.session.msg = "Email or password is incorrect";
			res.redirect('/');
		} else {
			var userData = {};
			// console.log("find me in getCheckLogin");
			// console.log(JSON.stringify(data));
			console.log(JSON.stringify(data.email));
			// console.log(JSON.stringify(data.password));
			// console.log(JSON.stringify(data.id));
			// console.log(JSON.stringify(data.schools));
			// console.log(JSON.stringify(data.gradyear));
			// console.log(JSON.stringify(data.firstname));
			// console.log(JSON.stringify(data.lastname));
			// console.log(JSON.stringify(data.phonenumber));
			// console.log(JSON.stringify(data.pennkey));
			// console.log(JSON.stringify(data.datecreated));
			console.log(data);

			req.session.email = data.email;
			req.session.password = data.password;
			req.session.userData = data;
			// res.redirect('/home/'+data.id);
		}
	});
};

var getUserHomePage = function(req, res) {
	console.log("in getHomePage");

	res.render('home.ejs', {message: req.session.msg, userData: null});
	delete req.session.msg;


	// if (isSignedIn(req, res)) {
	// 	console.log(req.session.userData);
	// 	// console.log(req.session.userData.uid);
	// 	// console.log(req.param('userid'));
	// 	// need seperate stuff for if you are visiting your page or another's
	// 	if (req.session.userData && req.session.userData.uid == req.param('userid')) {
	// 		// this is for when you are visiting your own page
	// 		res.render('home.ejs', {message: req.session.msg, userData: req.session.userData});
	// 		req.session.msg = null;
	// 	} else if (req.session.userData) {
	// 		console.log("in getUserHomePage you are visiting someone else's page");
	// 		req.session.msg = "You cannot visit anyone else's page";
	// 		res.redirect('/home/'+req.session.userData.id);
	// 	} else {
	// 		req.session.msg = "You must sign in first before viewing any pages";
	// 		res.redirect('/');
	// 	}
	// } else {
	// 	req.session.msg = "You must sign in first!";
	// 	res.redirect('/');
	// }
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

var getAuthenticatedUserPage = function(req, res) {
	accesstoken = req.url;

	request({
		uri: "https://api.venmo.com/v1/oauth/"+accesstoken, 
		method: "POST",
		form: {
			client_id: CLIENT_ID,
			client_secret: CLIENT_SECRET,
			code: AUTHORIZATION_CODE
		}
		}, function (err, response, body) {
			console.log(body);
	});
};

//====================================================
//	Handle Initial Poll Funcitons
//====================================================

var postNewPoll = function(req, res) {
	console.log("In postNewPoll");
	console.log(JSON.stringify(req.body.newPollQuestion));
};

//====================================================
//	Helper Functions
//====================================================

var isSignedIn = function(req, res) {
	// console.log("in isSignedIn");
	if (req.session.email && req.session.password) {
		return true;
	} else {
		return false;
	}
};


//====================================================
//	Venmo Redirect Logic
//====================================================

var getVenmoRedirect = function(req, res) {
	logger.info(req.url);
	if (req.url.indexOf("code") > -1) {
		var code = req.url.split("/venmoRedirect?code=")[1];
		logger.info(code);
		getVenmoUserInfo(code, function(err, data) {
			if (err) {
				logger.error(err);
				res.send(code);
			} else {
				logger.info(data);
				res.send(code);
			}
		});
	} else if (req.url.indexOf("error") > -1) {
		req.session.msg = req.url.split("/venmoRedirect?error=")[1];
		res.redirect('/');
	}
};

var getVenmoUserInfo = function(code, callback) {
	var form = {
		"client_id": CLIENT_ID,
		"client_secret": CLIENT_SECRET,
		"code": code
	};
	var data = {};
	data.form = form;
	url = "https://api.venmo.com/v1/oauth/access_token";
	request.post(url, data, function(err, response, body) {
		if (err) {
			logger.error(err);
			callback(err, response.statusCode);
		} else {
			var res = JSON.parse(body);
			if (res.error) {
				logger.error(res.error);
				logger.info(data);
				callback(res.error, null);
			} else {
				logger.info(res);
				var ud = {};
				ud.access_token = res.access_token;
				ud.expires_in = res.expires_in;
				ud.toke_type = res.token_type;
				ud.username = res.user.username;
				ud.first_name = res.user.first_name;
				ud.last_name = res.user.last_name;
				ud.display_name = res.user.display_name;
				ud.is_friend = res.user.is_friend;
				ud.friends_count = res.user.friends_count;
				ud.about = res.user.about;
				ud.email = res.user.email;
				ud.phone = res.user.phone;
				ud.profile_picture_url = res.user.profile_picture_url;
				ud.friend_request = res.user.friend_request;
				ud.trust_request = res.user.trust_request;
				ud.id = res.user.id;
				ud.date_joined_venmo = res.user.date_joined;
				ud.balance = res.user.balance;
				ud.refresh_token = res.refresh_token;
				logger.info(ud);

				// TODO: Insert the userData into the DB
			}
		}
	});
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
	getLogout: getLogout,
	getAuthenticatedUserPage: getAuthenticatedUserPage,
	getVenmoRedirect: getVenmoRedirect
};
module.exports = routes;