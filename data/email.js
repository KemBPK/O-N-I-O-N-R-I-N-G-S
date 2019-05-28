'use strict';

var mysql = require('mysql');
require('dotenv').config();

const nodemailer = require("nodemailer");
const cryptoRandomString = require('crypto-random-string');

function connection() {
    var con = mysql.createConnection({
        //deployment code
        host     : process.env.RDS_HOSTNAME,
        user     : process.env.RDS_USERNAME,
        password : process.env.RDS_PASSWORD,
        port     : process.env.RDS_PORT,
        database : process.env.DB_SCHEMA

        //testing code
        // host: process.env.DB_HOSTNAME,
        // port: process.env.DB_PORT,
        // user: process.env.DB_USER,
        // password: process.env.DB_PASSWORD,
        // database: process.env.DB_SCHEMA
    });
    return con;
}

function sendVerificationEmail(email, callback) {
    var con = connection();
    con.connect(function (err) {
        if (err) {
            //console.log('Database connection failed: ' + err.stack);
            return callback(err);
        }

        con.query("SELECT * FROM tblUser WHERE email = ?", [email.toString()], function (err, result) {
            if (err) {
                con.end();
                return callback(err);
            }

            var userID = result[0].userID;

            var hash = cryptoRandomString({ length: 30, type: 'url-safe' });
            con.query("INSERT INTO tblVerify (userID, hashVal) VALUE (?, ?)", [userID, hash], function (err, result) {
                if (err) {
                    //console.log("CheckRestaurant SQL failed\n");
                    con.end();
                    return callback(err);
                }
                con.end();

                var link = "https://www.onionringsworldwide.com/User/Verify/" + hash;

                sendEmail(email.toString(), link.toString()).then(function(err){
                    if(err){
                        //console.log('failed to send email');
                        return callback(err);
                    }
                    else{             
                        //console.log('sent email');
                        return callback(null);
                    } 
                });
            })
        })
    })
}

function verifyEmail(hash, callback){
    var con = connection();
    con.connect(function (err) {
        if (err) {
            //console.log('Database connection failed: ' + err.stack);
            return callback(err);
        }

        con.query("SELECT userID FROM tblVerify WHERE hashVal = ?", [hash.toString()], function (err, result) {
            if (err) {
                con.end();
                return callback(err);
            }
            if (result.length < 1) {
                var error = { messsage: 'hash ' + hash.toString() + ' not found' };
                return callback(error);
            }
            var userID = result[0].userID;
            con.query("UPDATE tblUser SET isVerified = true WHERE userID = ?", [userID], function (err, result) {
                con.end();
                if (err) {      
                    return callback(err);
                }
                return callback(null);
            })
        })
    })
}

async function sendEmail(email, link) {
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
            user: process.env.EMAIL_SMTP_USER,
            pass: process.env.EMAIL_SMTP_PASS
        }
    });

    try{
        await transporter.sendMail({
            from: '"OnionRingsWorldWide" <no-reply@onionringsworldwide.com>', // sender address
            to: email,
            subject: "Account Registration",
            html: "<b>Account Registration</b><p>Please click on the link below to verify your account.</p><a href=\"" + link.toString() +  "\">Click here</a>" // html body
        });
    }
    catch(error){
        return error;
    }

    return null;
}

module.exports.sendVerificationEmail = sendVerificationEmail;
module.exports.verifyEmail = verifyEmail;