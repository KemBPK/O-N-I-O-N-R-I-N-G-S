'use strict'

var mysql = require('mysql');
require('dotenv').config();

const bcrypt = require('bcrypt');
const saltRounds = 10;

// connect to mysql
function connection() {
    var con = mysql.createConnection({
        host: process.env.DB_HOSTNAME,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_SCHEMA
      });
    return con;    
}

function registerUser(email, password, fname, lname, callback) {
    var con = connection();
    con.connect(function(err) {
        if(err) {
            console.log('Database connection failed: ' + err.stack);
            return callback(err);
            //throw err;
        }

        bcrypt.hash(password, saltRounds, function(err, hash){
            if(err){
                console.log('Hash function failed: ' + err.stack);
                return callback(err);
            }
            
            // var sql = "INSERT INTO ebdb.tblUser (email, pass, lastName, firstName) " +
            // "VALUES (\'" + email + "\', \'" + hash + "\', \'" + lname + "\', \'" + fname + "\')";

            // Prepare SQL statement, avoid SQL injection
            con.query("INSERT INTO ebdb.tblUser (email, pass, lastName, firstName) VALUES (?, ?, ?, ?)", [email, hash, lname, fname], function(err, result, field) {
                if(err){
                    console.log("registerUser SQL INSERT FAILED\n");
                    con.end(); 
                    return callback(err);
                    //throw err;
                }
                con.end(); 
                console.log('Returning result');
                return callback(null);
            })

        })     
    })
}

function authenicateUser(email, password, callback){
    var con = connection();
    con.connect(function(err) {
        if(err) {
            console.log('Database connection failed: ' + err.stack);
            return callback(err, null);
            //throw err;
        }

        //var sql = "SELECT email, pass FROM tblUser WHERE email = \'" + email + "\'";
        con.query("SELECT email, pass FROM tblUser WHERE email = ?", [email], function(err, result, field) {
            if(err){
                console.log("authenicateUser SQL INSERT FAILED\n");
                con.end(); 
                return callback(err, null);
                //throw err;
            }
            con.end(); 
            console.log('Returning result');
            if(result.length < 1){
                console.log('User ' + email + ' not found');
                var error = {messsage: 'User ' + email + ' not found'};
                return callback(error, null)
            }
            var dbPassword = result[0].pass;
            bcrypt.compare(password, dbPassword, function(err, res){
                if(err){
                    console.log('Hash function failed');
                    return callback(err, null);
                }
                return callback(null, res) //true or false
            })
        })
    })
}

function getUserId(email, callback){
    var con = connection();
    con.connect(function(err) {
        if(err) {
            console.log('Database connection failed: ' + err.stack);
            return callback(err, null);
            //throw err;
        }

        //var sql = "SELECT userID FROM tblUser WHERE email = \'" + email + "\'";
        con.query("SELECT userID FROM tblUser WHERE email = ?", [email], function(err, result, field) {
            if(err){
                console.log("getUserId SQL SELECT FAILED\n");
                con.end(); 
                return callback(err, null);
                //throw err;
            }
            if(result.length < 1){
                console.log('User ' + email + ' not found');
                var error = {messsage: 'User ' + email + ' not found'};
                return callback(error, null);
            }
            var id = result[0].userID;
            return callback(null, id);
        })

    })
}

function getUsername(id, callback){
    var con = connection();
    con.connect(function(err) {
        if(err) {
            console.log('Database connection failed: ' + err.stack);
            return callback(err, null);
            //throw err;
        }

        //var sql = "SELECT firstName, lastName  FROM tblUser WHERE userID = " + id;
        con.query("SELECT firstName, lastName  FROM tblUser WHERE userID = ?", [id], function(err, result, field) {
            if(err){
                console.log("getUsername SQL SELECT FAILED\n");
                con.end(); 
                return callback(err, null);
                //throw err;
            }
            if(result.length < 1){
                console.log('User id ' + id + ' not found');
                var error = {messsage: 'User id ' + id + ' not found'};
                return callback(error, null);
            }
            var name = result[0].firstName + ' ' + result[0].lastName.charAt(0) + '.';
            return callback(null, name);
        })
    })
}

module.exports.registerUser = registerUser;
module.exports.authenicateUser = authenicateUser;
module.exports.getUserId = getUserId;
module.exports.getUsername = getUsername;