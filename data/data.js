'use strict';

var mysql = require('mysql');
require('dotenv').config();

function connection(){
    var con = mysql.createConnection({
        //deployment code
        // host     : process.env.RDS_HOSTNAME,
        // user     : process.env.RDS_USERNAME,
        // password : process.env.RDS_PASSWORD,
        // port     : process.env.RDS_PORT,
        // database : process.env.DB_SCHEMA

        //testing code
        host: process.env.DB_HOSTNAME,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_SCHEMA
      });
    return con;    
}

function insert(first, last, age, callback){
    var con = connection();
    con.connect(function(err){
      if(err){
        console.log('Database connection failed: ' + err.stack);  
        throw err;
      }
      var sql = "INSERT INTO TestTable (firstName, lastName, age) VALUES (\'" + first + "\', \'" + last + "\', \'" + age + "\')";
      con.query(sql, function (err, result){
        if(err){
          console.log("insertion failed\n");
          con.end(); 
          throw err;
        }
      });
      con.end();   
      return callback(null);
    });
}

function selectAll(callback){ //Look up callback and asynchronous call with javascript
    var con = connection();
    con.connect(function(err) {
      if(err){
        console.log('Database connection failed: ' + err.stack);   
        throw err;
      }
      con.query("SELECT * FROM TestTable", function (err, result, fields) {
        if(err){
          console.log("insertion failed\n");
          con.end(); 
          throw err;
        }
        con.end(); 
        console.log('Returning result');
        return callback(result);
      });
    });
}

//module.exports.connection = connection;
module.exports.insert = insert;
module.exports.selectAll = selectAll;