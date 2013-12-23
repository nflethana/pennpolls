//====================================================
//	Import libraries
//====================================================

var db = require('../models/awsdb.js');
var SHA3 = require('crypto-js/sha3');

//====================================================
//	Handle First Step for User Connections
//====================================================

var getPennPolls = function(req, res) {
	res.render('pennpolls.ejs', {message: null});
};

//====================================================
//	Define Routing Functions
//====================================================

var routes = {
	getPennPolls: getPennPolls
};
module.exports = routes;