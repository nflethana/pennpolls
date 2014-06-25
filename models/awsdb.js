// //====================================================
// //	Imports
// //====================================================

// var AWS = require('aws-sdk');
// AWS.config.loadFromPath('config.json');
var uuid = require('node-uuid');
var SHA3 = require('crypto-js/sha3');
var async = require('async');
var logger = require('tracer').colorConsole();
var AWS = require('aws-sdk');
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_KEY) {
	AWS.config = new AWS.Config({
	  accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_KEY, region: 'us-east-1'
	});
} else {
	AWS.config.loadFromPath('./config.json');
}
var dynamodb = new AWS.DynamoDB();

// //====================================================
// //	Database Methods
// //====================================================

var putUserInUsersTable = function(user, route_callback) {
	var keys = Object.keys(user);
	var dbEntry = {};
	async.forEach(keys, function(key, callback) {
		dbEntry[key] = {S: user[key]};
		callback();
	}, function(err) {
		if (err) {
			logger.error(err);
			route_callback(err, null);
		} else {

			logger.info(dbEntry);

			params = {
				TableName: 'Users',
				Item: dbEntry
			};

			dynamodb.putItem(params, function(err, data) {
				if (err) {
					// TODO: handle the case where data is not entered correctly.
					logger.error("There was an error adding the user to the database: ");
					console.log(err);
					route_callback(err, null);
				} else {
					route_callback(null, user);
				}
			});
		}
	});
};


var database = {
	putUserInUsersTable: putUserInUsersTable,
	// getUserFromUsersTable: getUserFromUsersTable,
	// getCheckLogin: getCheckLogin
};
module.exports = database;


// // //====================================================
// // //	Get Mongo Client
// // //====================================================

//  var MongoClient = require('mongodb').MongoClient;
//  // var MongoClient = new MongoClient(new Server('localhost', 27017));
//  // MongoClient.open(function(err, MongoClient) {
// 	//  if (err) {
// 	//  	logger.error(err);
// 	//  } else {
// 	//  	var db1 = MongoClient.db('mydb');

// 	//  	MongoClient.close();
// 	//  }
//  // });

// // //====================================================
// // //	Connect to the DB
// // //====================================================

// var getDB = function() {
// 	MongoClient.connect("mongodb://localhost:27017/pennpolls", function(err, db) {
// 		if(!err) {
//     		return db;
//   		} else {
//   			logger.error(err);
//   		}
// 	});
// };


// var putUserInUsersTable = function(user, route_callback) {
// 	db.users.insert(user);
// 	route_callback(null, user);
// };



// //====================================================
// //	Setup Database Functions
// //====================================================

// //====================================================
// //	Database Connection Methods
// //====================================================

// var getConnection = function() {
// 	connection = db.createConnection({
// 		host: "localhost",
// 		user: "root",
// 		password: "",
// 		database: "pennpolls",
// 		port: "3306"
// 	});
// 	connection.connect();
// };

// var closeConnection = function() {
// 	connection.end();
// };

// //====================================================
// //	Database Talbe Setup Methods
// //====================================================

// var createPennPollsDatabase = function() {
// 	var query = "CREATE DATABASE pennpolls";
// 	connection.query(query);
// };

// // The users table was created via command line, so 
// // might be slightly different than below
// var createUsersTable = function() {
// 	var query = "CREATE TABLE IF NOT EXISTS users" +
// 		"id INT NOT NULL AUTO_INCREMENT, " +
// 		"email VARCHAR(500) NOT NULL, " +
// 		"password VARCHAR(1000) NOT NULL, " +
// 		"schools VARCHAR(100) NOT NULL, " +
// 		"gradyear VARCHAR(4) NOT NULL, " +
// 		"firstname VARCHAR(1000) NOT NULL, " +
// 		"lastname VARCHAR(1000) NOT NULL, " +
// 		"datecreated VARCHAR(1000) NOT NULL";
// 	connection.query(query);
// };

// //====================================================
// //	Database Insertion Methods
// //====================================================

// var putUserInUsersTable = function(email, password, 
// 	schools, gradyear, firstname, lastname, pennkey, phonenumber, route_callback) {
// 	getConnection();

// 	var timestamp = new Date().getTime();
// 	var hashedPassword = SHA3(password).toString();
// 	var inserts = {
// 		email: email, 
// 		password: hashedPassword, 
// 		schools: schools.toString(), 
// 		gradyear: gradyear,
// 		firstname: firstname, 
// 		lastname: lastname,
// 		datecreated: timestamp,
// 		pennkey: pennkey,
// 		phonenumber: phonenumber
// 	};
// 	var query = "INSERT INTO pennpolls.users SET ?";

// 	connection.query(query, inserts, function(err, result) {
// 		if (err) console.log("Error inserting User into users table: " + err);
// 		else {
// 			var newData = {};
// 			newData.success = true;
// 			newData.email = email;
// 			newData.password = hashedPassword;
// 			newData.schools = schools;
// 			newData.firstname = firstname;
// 			newData.lastname = lastname;
// 			newData.datecreated = timestamp;
// 			newData.uid = result.insertId;
// 			newData.pennkey = pennkey;
// 			newData.phonenumber = phonenumber;
// 			route_callback(false, newData);
// 		}
// 	});

// 	closeConnection();
// };

// //====================================================
// //	Database Retrieval Methods
// //====================================================

// var getUserFromUsersTable = function(email, password) {
// 	getConnection();

// 	var hashedPassword = SHA3(password).toString();
// 	var query = "SELECT * FROM pennpolls.users WHERE " +
// 		"email = ? AND password = ?";
// 	var inserts = {
// 		email: email, 
// 		hashedPassword: hashedPassword
// 	};
// 	connection.query(query, inserts, function(err, result) {
// 		if (err) console.log("Error retrieving User from users table: " + err);
// 		else {
// 			console.log("it worked too!");
// 		}
// 	});

// 	closeConnection();
// };

// var getCheckLogin = function(email, password, route_callback) {
// 	getConnection();

// 	var hashedPassword = SHA3(password).toString();
// 	console.log("in getchecklogin db method the hashedPassword is: " +hashedPassword);
// 	var query = "SELECT * FROM users WHERE " +
// 		"email=? AND password=?";
// 	var inserts = [email,password];
	
// 	connection.query(query, inserts, function(err, results) {
// 		if (err) {
// 			route_callback(err, null);
// 			console.log("Error retrieving User from users table: " + err);
// 		}
// 		else {
// 			if (results == undefined || results.length > 1 || results.length == 0) {
// 				route_callback(null, false);
// 				console.log("the result set in getchecklogin was greater than 1 or undefined");
// 			} else {
// 				console.log(results);
// 				route_callback(null, results[0]);
// 			}
// 		}
// 	});

// 	closeConnection();
// };