//====================================================
//	Imports
//====================================================

var AWS = require('aws-sdk');
AWS.config.loadFromPath('config.json');
var uuid = require('node-uuid');
var SHA3 = require('crypto-js/sha3');
var async = require('async');
var db = require('mysql');
var connection;

//====================================================
//	Database Connection Methods
//====================================================

var getConnection = function() {
	connection = db.createConnection({
		host: process.env.RDS_HOSTNAME,
		user: process.env.RDS_USERNAME,
		password: process.env.RDS_PASSWORD,
		port: process.env.RDS_PORT
	});
	connection.connect();
};

var closeConnection = function() {
	connection.end();
};

//====================================================
//	Database Talbe Setup Methods
//====================================================

var createPennPollsDatabase = function() {
	var query = "CREATE DATABASE pennpolls";
	connection.query(query);
};

var createUsersTable = function() {
	var query = "CREATE TABLE IF NOT EXISTS users" +
		"id INT NOT NULL AUTO_INCREMENT, " +
		"email VARCHAR(500) NOT NULL, " +
		"password VARCHAR(1000) NOT NULL, " +
		"school VARCHAR(100) NOT NULL, " +
		"gradyear VARCHAR(4) NOT NULL, " +
		"firstname VARCHAR(1000) NOT NULL, " +
		"lastname VARCHAR(1000) NOT NULL, " +
		"datecreated VARCHAR(1000) NOT NULL";
	connection.query(query);
};

//====================================================
//	Database Insertion Methods
//====================================================

var putUserInUsersTable = function(email, password, 
	school, gradyear, firstname, lastname) {
	var timestamp = new Date().getTime();
	var hashedPassword = SHA3(password).toString();
	var inserts = [email, hashedPassword, school, gradyear,
		firstname, lastname, timestamp];
	var query = "INSERT INTO pennpolls.users VALUES ?";

	connection.query(query, inserts, function(err, result) {
		if (err) console.log("Error inserting User into users table: " + err);
		else {
			console.log("it worked!");
		}
	});
};

//====================================================
//	Database Retrieval Methods
//====================================================

var getUserFromUsersTable = function(email, password) {
	var hashedPassword = SHA3(password).toString();
	var query = "SELECT * FROM pennpolls.users WHERE " +
		"email = ? AND password = ?";
	var inserts = [email, hashedPassword];
	connection.query(query, inserts, function(err, result) {
		if (err) console.log("Error retrieving User from users table: " + err);
		else {
			console.log("it worked too!");
		}
	});
};

//====================================================
//	Setup Database Functions
//====================================================

var database = {
	putUserInUsersTable: putUserInUsersTable,
	getUserFromUsersTable: getUserFromUsersTable
};
module.exports = database;