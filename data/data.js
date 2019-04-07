'use strict';

var mysql = require('mysql');

function connection(){
    var con = mysql.createConnection({

        host     : process.env.RDS_HOSTNAME,
        user     : process.env.RDS_USERNAME,
        password : process.env.RDS_PASSWORD,
        port     : process.env.RDS_PORT
        // host: "aa10bua224idnik.cvo7xscrgkdh.us-west-1.rds.amazonaws.com",
        // port: 3306,
        // user: "orwwDB",
        // password: "z5zuQ5G6r4CiVmF"
      });
    console.log('Attempting to connect...\n');

    console.log(process.env.RDS_HOSTNAME);
    console.log(process.env.RDS_USERNAME);

    con.connect(function(err){
      if(err){
        console.log('Database connection failed: ' + err.stack);
        return;
      }
      console.log('Connected to database');
      con.end();   
      return;
    });
    // return con;
}

// function select(){
//     var con = connection();
//     con.connect(function(err) {
//         if (err) throw err;
//         con.query("SELECT * FROM customers", function (err, result, fields) {
//           if (err) throw err;
//           console.log(result);
//         });
//       });
// }

module.exports.connection = connection;
//module.exports.select = select;