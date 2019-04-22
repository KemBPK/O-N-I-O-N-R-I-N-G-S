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

function checkRestaurant(id, callback){ //Look up callback and asynchronous call with javascript
  var con = connection();
  con.connect(function(err) {
    if(err){
      console.log('Database connection failed: ' + err.stack);   
      return callback(err, null);
      //throw err;
    }
    con.query("SELECT COUNT(*) AS rowNum FROM tblRestaurant WHERE yelpID =\'" + id + "\'", function (err, result, fields) {
      if(err){
        console.log("CheckRestaurant failed\n");
        con.end(); 
        return callback(err, null);
        //throw err;
      }
      con.end(); 
      console.log('Returning result');
      console.log(result);
      if (result[0].rowNum > 0){
        console.log('true')
        return callback(null, true);
      }
      else{
        return callback(null, false);
      }           
    });
  });
}

function insertRestaurant(yelpID, restName, alias, address, city, state, zipCode, latitude, longitude, phoneNum, yelpURL, callback){
  var con = connection();
  con.connect(function(err){
    if(err){
      console.log('Database connection failed: ' + err.stack);  
      return callback(err);
      //throw err;
    }
    var sql = "INSERT INTO tblRestaurant (yelpID, restName, alias, address, city, state, zipCode, latitude, longitude, phoneNum, yelpURL) VALUES (\'" 
              + yelpID + "\', \'" + restName + "\', \'" + alias + "\', \'" + address + "\', \'" + city + "\', \'" + state + "\', \'" 
              + zipCode + "\', \'" + latitude + "\', \'" + longitude + "\', \'" + phoneNum + "\', \'" + yelpURL + "\')";
    con.query(sql, function (err, result){
      if(err){
        console.log("insertRestaurant failed\n");
        con.end(); 
        return callback(err);
        //throw err;
      }
    });
    con.end();   
    return callback(null);
  });
}

module.exports.checkRestaurant  = checkRestaurant;
module.exports.insertRestaurant = insertRestaurant;