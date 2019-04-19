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

