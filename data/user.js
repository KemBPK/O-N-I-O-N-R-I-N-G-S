'use strict'

var mysql = require('mysql');
require('dotenv').config();

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

function registerUser(email, password, lname, fname, age, bio, city, state, country) {
    var con = connection();
    con.connect(function(err) {
        if(err) {
            console.log('Database connection failed: ' + err.stack);
            throw err;
        }

        // TODO - test once page is made
        var sql = "INSERT INSERT INTO ebdb.tblUser (email, pass, lastName, firstName, age, bio, city, state, country) " +
              "VALUES (\'" + email + "\', \'" + pass + "\', \'" + lastName + "\', \'" + firstName + "\', \'" + age + "\', \'" + bio + "\', \'" + city + "\', \'" + state + "\', \'" + country + "\')";
        
        con.query(sql, function(err, result, field) {
            if(err){
                console.log("INSERT FAILED\n");
                con.end(); 
                throw err;
            }
            con.end(); 
            console.log('Returning result');
            return callback(null);
            });
        });
}

module.exports.registerUser = registerUser;