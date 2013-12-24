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
	
};

//====================================================
//	Define Routing Functions
//====================================================

var routes = {
	getPennPolls: getPennPolls,
	postCreateAccount: postCreateAccount
};
module.exports = routes;