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
		host: "localhost",
		user: "root",
		password: "",
		database: "pennpolls",
		port: "3306"
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

// The users table was created via command line, so 
// might be slightly different than below
var createUsersTable = function() {
	var query = "CREATE TABLE IF NOT EXISTS users" +
		"id INT NOT NULL AUTO_INCREMENT, " +
		"email VARCHAR(500) NOT NULL, " +
		"password VARCHAR(1000) NOT NULL, " +
		"schools VARCHAR(100) NOT NULL, " +
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
	schools, gradyear, firstname, lastname, pennkey, phonenumber, route_callback) {
	getConnection();

	var timestamp = new Date().getTime();
	var hashedPassword = SHA3(password).toString();
	var inserts = {
		email: email, 
		password: hashedPassword, 
		schools: schools.toString(), 
		gradyear: gradyear,
		firstname: firstname, 
		lastname: lastname,
		datecreated: timestamp,
		pennkey: pennkey,
		phonenumber: phonenumber
	};
	var query = "INSERT INTO pennpolls.users SET ?";

	connection.query(query, inserts, function(err, result) {
		if (err) console.log("Error inserting User into users table: " + err);
		else {
			var newData = {};
			newData.success = true;
			newData.email = email;
			newData.password = hashedPassword;
			newData.schools = schools;
			newData.firstname = firstname;
			newData.lastname = lastname;
			newData.datecreated = timestamp;
			newData.uid = result.insertId;
			newData.pennkey = pennkey;
			newData.phonenumber = phonenumber;
			route_callback(false, newData);
		}
	});

	closeConnection();
};

//====================================================
//	Database Retrieval Methods
//====================================================

var getUserFromUsersTable = function(email, password) {
	getConnection();

	var hashedPassword = SHA3(password).toString();
	var query = "SELECT * FROM pennpolls.users WHERE " +
		"email = ? AND password = ?";
	var inserts = {
		email: email, 
		hashedPassword: hashedPassword
	};
	connection.query(query, inserts, function(err, result) {
		if (err) console.log("Error retrieving User from users table: " + err);
		else {
			console.log("it worked too!");
		}
	});

	closeConnection();
};

var getCheckLogin = function(email, password, route_callback) {
	getConnection();

	var hashedPassword = SHA3(password).toString();
	console.log("in getchecklogin the hashedPassword is: " +hashedPassword);
	var query = "SELECT * FROM users WHERE " +
		"email=? AND password=?";
	var inserts = [email,hashedPassword];
	
	connection.query(query, inserts, function(err, results) {
		if (err) {
			route_callback(err, null);
			console.log("Error retrieving User from users table: " + err);
		}
		else {
			if (results.length > 1) {
				console.log("the result set in getchecklogin was greater than 1");
			} else {
				console.log(JSON.stringify(results));
			}
		}
	});

	closeConnection();
};

//====================================================
//	Setup Database Functions
//====================================================

var database = {
	putUserInUsersTable: putUserInUsersTable,
	getUserFromUsersTable: getUserFromUsersTable,
	getCheckLogin: getCheckLogin
};
module.exports = database;