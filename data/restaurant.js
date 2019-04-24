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
    }
    con.query("SELECT COUNT(*) AS rowNum FROM tblRestaurant WHERE yelpID =\'" + id + "\'", function (err, result, fields) {
      if(err){
        console.log("CheckRestaurant SQL failed\n");
        con.end(); 
        return callback(err, null);
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
    })
  })
}

function insertRestaurant(yelpID, restName, alias, address, city, state, zipCode, latitude, longitude, phoneNum, yelpURL, callback){
  var con = connection();
  con.connect(function(err){
    if(err){
      console.log('Database connection failed: ' + err.stack);  
      return callback(err);
    }
    var sql = "INSERT INTO tblRestaurant (yelpID, restName, alias, address, city, state, zipCode, latitude, longitude, phoneNum, yelpURL) VALUES (\'" 
              + yelpID + "\', \'" + restName + "\', \'" + alias + "\', \'" + address + "\', \'" + city + "\', \'" + state + "\', \'" 
              + zipCode + "\', \'" + latitude + "\', \'" + longitude + "\', \'" + phoneNum + "\', \'" + yelpURL + "\')";
    con.query(sql, function (err, result){
      if(err){
        console.log("insertRestaurant SQL failed\n");
        con.end(); 
        return callback(err);
      }
    })
    con.end();   
    return callback(null);
  })
}

function getRestaurantID(yelpID, callback){
  var con = connection();
  con.connect(function(err){
    if(err){
      console.log('Database connection failed: ' + err.stack);  
      return callback(err, null);
    }
    var sql = "SELECT restID FROM tblRestaurant WHERE yelpID = \'" + yelpID + "\'";
    con.query(sql, function (err, result){
      if(err){
        console.log("getRestaurantID SQL failed");
        con.end(); 
        return callback(err, null);
      }
      con.end();
      if(result.length < 1){
        console.log("yelpID: " + yelpID + "not found");
        var error = {messsage: "yelpID: " + yelpID + " not found"};
        return callback(error, null);
      }
      console.log(result);
      var id = result[0].restID;
      return callback(null, id);
    })
    
  })
}

// function getReviewCount(restID, callback){
//   var con = connection();
//   con.connect(function(err){
//     if(err){
//       console.log('Database connection failed: ' + err.stack);  
//       return callback(err);
//       //throw err;
//     }
//     var sql = "SELECT COUNT(*) AS count FROM tblReview WHERE restID = " + restID;
//     con.query(sql, function (err, result){
//       if(err){
//         console.log("getReviewCount failed");
//         con.end(); 
//         return callback(err, null);
//       }
//       con.end();
//       var count = result[0].count;
//       return callback(null, count);
//     })

//   })
// }

function getRatingSumAndCount(restID, callback){
  var con = connection();
  con.connect(function(err){
    if(err){
      console.log('Database connection failed: ' + err.stack);  
      return callback(err, null, null);
    }
    var sql = "SELECT COUNT(*) AS count, SUM(rating) AS sum FROM tblReview WHERE restID = " + restID;
    con.query(sql, function (err, result){
      if(err){
        console.log("getRating SQL failed");
        con.end(); 
        return callback(err, null, null);
      }
      con.end(); 
      var count = result[0].count;
      var sum = result[0].sum;
      return callback(null, count, sum);
    })
  })
}

function getRestaurantInfoByAlias(alias, callback){
  var con = connection();
  con.connect(function(err){
    if(err){
      console.log('Database connection failed: ' + err.stack);  
      return callback(err, null, null);
    }
    var sql = "SELECT * FROM tblRestaurant WHERE alias = \'" + alias + "\'";
    con.query(sql, function (err, result){
      con.end();
      if(err){
        console.log("getRestaurantInfoByAlias SQL failed");
        return callback(err, null);
      }
      if(result.length < 1){
        console.log("alias " + alias + " not found");
        var error = {
          messsage: "alias " + alias + " not found"
        };
        return callback(error, null);
      }
      return callback(null, result[0]);
    })
  })
}

module.exports.checkRestaurant  = checkRestaurant;
module.exports.insertRestaurant = insertRestaurant;
module.exports.getRestaurantID = getRestaurantID;
module.exports.getRatingSumAndCount = getRatingSumAndCount;
module.exports.getRestaurantInfoByAlias = getRestaurantInfoByAlias;