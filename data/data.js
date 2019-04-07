'use strict';

var mysql = require('mysql');

function connection(){
    var con = mysql.createConnection({
        //deployment code
        host     : process.env.RDS_HOSTNAME,
        user     : process.env.RDS_USERNAME,
        password : process.env.RDS_PASSWORD,
        port     : process.env.RDS_PORT,
        database    : "ebdb"

        //testing code
        // host: "aa10bua224idnik.cvo7xscrgkdh.us-west-1.rds.amazonaws.com",
        // port: 3306,
        // user: "orwwDB",
        // password: "z5zuQ5G6r4CiVmF",
        // database: "ebdb"
      });
    return con;    
}

function insert(First, Last, Age, callback){
    var con = connection();
    con.connect(function(err){
      if(err){
        console.log('Database connection failed: ' + err.stack);  
        throw err;
      }
      var sql = "INSERT INTO TestTable (firstName, lastName, age) VALUES (\'" + First + "\', \'" + Last + "\', \'" + Age + "\')";
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