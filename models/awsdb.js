//====================================================
//	Imports
//====================================================

var AWS = require('aws-sdk');
AWS.config.loadFromPath('config.json');
var uuid = require('node-uuid');
var async = require('async');



//====================================================
//	Setup Database Functions
//====================================================

var database = {

};
module.exports = database;