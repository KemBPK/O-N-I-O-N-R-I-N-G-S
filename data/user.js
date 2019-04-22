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

function registerUser(email, password, lname, fname, age, bio, city, state, country, callback) {
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
            
            // TODO - test once page is made
            var sql = "INSERT INTO ebdb.tblUser (email, pass, lastName, firstName, age, bio, city, state, country) " +
            "VALUES (\'" + email + "\', \'" + hash + "\', \'" + lname + "\', \'" + fname + "\', \'" + age + "\', \'" + bio + "\', \'" + city + "\', \'" + state + "\', \'" + country + "\')";
    
            con.query(sql, function(err, result, field) {
                if(err){
                    console.log("registerUser SQL INSERT FAILED\n");
                    con.end(); 
                    return callback(err);
                    //throw err;
                }
                con.end(); 
                console.log('Returning result');
                return callback(null);
            });

        });      
    });
}

function authenicateUser(email, password, callback){
    var con = connection();
    con.connect(function(err) {
        if(err) {
            console.log('Database connection failed: ' + err.stack);
            return callback(err);
            //throw err;
        }

        var sql = "SELECT email, pass FROM tblUser WHERE email = \'" + email + "\' AND pass = \'" + password + "\'";
        con.query(sql, function(err, result, field) {
            if(err){
                console.log("authenicateUser SQL INSERT FAILED\n");
                con.end(); 
                return callback(err);
                //throw err;
            }
            con.end(); 
            console.log('Returning result');
            if(result.length == 0){
                console.log('User ' + email + ' not found');
                return callback(false)
            }
            var dbPassword = result[0].pass;
            bcrypt.compare(password, dbPassword, function(err, res){
                if(err){
                    console.log('Hash function failed');
                    return callback(err);
                }
                return callback(res) //true or false
            })
        });
    });
}

module.exports.registerUser = registerUser;
module.exports.authenicateUser = authenicateUser;