'use strict'

var mysql = require('mysql');
require('dotenv').config();

const bcrypt = require('bcryptjs');
const saltRounds = 10;

// connect to mysql
function connection() {
    var con = mysql.createConnection({

        //deployment code
        host     : process.env.RDS_HOSTNAME,
        user     : process.env.RDS_USERNAME,
        password : process.env.RDS_PASSWORD,
        port     : process.env.RDS_PORT,
        database : process.env.DB_SCHEMA 

        // host: process.env.DB_HOSTNAME,
        // port: process.env.DB_PORT,
        // user: process.env.DB_USER,
        // password: process.env.DB_PASSWORD,
        // database: process.env.DB_SCHEMA
      });
    return con;    

}

function registerUser(email, password, fname, lname, callback) {
    var con = connection();
    con.connect(function (err) {
        if (err) {
            //console.log('Database connection failed: ' + err.stack);
            return callback(err);
        }

        bcrypt.hash(password, saltRounds, function (err, hash) {
            if (err) {
                //console.log('Hash function failed: ' + err.stack);
                return callback(err);
            }

            // var sql = "INSERT INTO ebdb.tblUser (email, pass, lastName, firstName) " +
            // "VALUES (\'" + email + "\', \'" + hash + "\', \'" + lname + "\', \'" + fname + "\')";

            // Prepare SQL statement, avoid SQL injection
            con.query("INSERT INTO ebdb.tblUser (email, pass, lastName, firstName, isVerified) VALUES (?, ?, ?, ?, ?)", [email, hash, lname, fname, false], function (err, result, field) {
                if (err) {
                    //console.log("registerUser SQL INSERT FAILED\n");
                    con.end();
                    return callback(err);
                }
                con.end();
                //console.log('Returning result');
                return callback(null);
            })

        })
    })
}

function authenicateUser(email, password, callback) {
    var con = connection();
    con.connect(function (err) {
        if (err) {
            //console.log('Database connection failed: ' + err.stack);
            return callback(err, null, null);
        }

        //var sql = "SELECT email, pass FROM tblUser WHERE email = \'" + email + "\'";
        con.query("SELECT email, pass, isVerified FROM tblUser WHERE email = ?", [email], function (err, result, field) {
            if (err) {
                //console.log("authenicateUser SQL INSERT FAILED\n");
                con.end();
                return callback(err, null, null);
            }
            con.end();
            //console.log('Returning result');
            if (result.length < 1) {
                //console.log('User ' + email + ' not found');
                var error = { messsage: 'User ' + email + ' not found' };
                return callback(error, null, null)
            }
            var verificationStatus = result[0].isVerified;
            var dbPassword = result[0].pass;
            bcrypt.compare(password, dbPassword, function (err, res) {
                if (err) {
                    //console.log('Hash function failed');
                    return callback(err, null, null);
                }
                return callback(null, res, verificationStatus) //true or false
            })
        })
    })
}

function getUserId(email, callback) {
    var con = connection();
    con.connect(function (err) {
        if (err) {
            //console.log('Database connection failed: ' + err.stack);
            return callback(err, null);
        }

        //var sql = "SELECT userID FROM tblUser WHERE email = \'" + email + "\'";
        con.query("SELECT userID FROM tblUser WHERE email = ?", [email], function (err, result, field) {
            con.end();
            if (err) {
                //console.log("getUserId SQL SELECT FAILED\n");
                return callback(err, null);
            }
            if (result.length < 1) {
                //console.log('User ' + email + ' not found');
                var error = { messsage: 'User ' + email + ' not found' };
                return callback(error, null);
            }
            var id = result[0].userID;
            return callback(null, id);
        })

    })
}

function getUsername(id, callback) {
    var con = connection();
    con.connect(function (err) {
        if (err) {
            //console.log('Database connection failed: ' + err.stack);
            return callback(err, null);
        }

        //var sql = "SELECT firstName, lastName  FROM tblUser WHERE userID = " + id;
        con.query("SELECT firstName, lastName  FROM tblUser WHERE userID = ?", [id], function (err, result, field) {
            con.end();
            if (err) {
                //console.log("getUsername SQL SELECT FAILED\n");
                return callback(err, null);
            }
            if (result.length < 1) {
                //console.log('User id ' + id + ' not found');
                var error = { messsage: 'User id ' + id + ' not found' };
                return callback(error, null);
            }
            var name = result[0].firstName + ' ' + result[0].lastName.charAt(0) + '.';
            return callback(null, name);
        })
    })
}

function validateEmail(email, callback) {
    var validator = require("email-validator");

    if (validator.validate(email.toString()) == true) {
        var con = connection();
        con.connect(function (err) {
            if (err) {
                //console.log('Database connection failed: ' + err.stack);
                return callback(err, null);
            }
            con.query("SELECT email  FROM tblUser WHERE email = ?", [email.toString()], function (err, result, field) {
                con.end();
                if (err) {
                    //console.log("validateEmail SQL SELECT FAILED\n");
                    return callback(err, null);
                }
                if (result.length > 0) {
                    return callback(null, false);
                }
                else {
                    return callback(null, true);
                }
            })
        })
    }
    else {
        return callback(err, null)
    }
}

function checkAdmin(id, callback) {
    var con = connection();
    con.connect(function (err) {
        if (err) {
            //console.log('Database connection failed: ' + err.stack);
            return callback(err, null);
        }

        con.query("SELECT * FROM tblAdmin WHERE userID = ?", [id], function (err, result, field) {
            con.end();
            if (err) {
                //console.log("checkAdmin SQL SELECT FAILED\n");
                return callback(err, null);
            }
            if (result.length > 0) {
                return callback(null, true);
            }
            else {
                return callback(null, false);
            }
        })

    })
}

function getUserReviews(id, callback) {
    var con = connection();
    con.connect(function (err) {
        if (err) {
            //console.log('Database connection failed: ' + err.stack);
            return callback(err, null);
        }

        con.query("SELECT * FROM tblReview as R JOIN tblUser AS U ON R.userID = U.userID JOIN tblRestaurant AS R2 ON R2.restID = R.restID WHERE R.userID = ? ORDER BY rDate DESC", [id], function (err, result) {
            con.end();
            if (err) {
                //console.log("getUserReviews SQL SELECT FAILED\n");
                return callback(err, null);
            }
            if (result.length > 0) {
                return callback(null, result);
            }
            else {
                return callback(null, result);
            }
        })

    })
}

function changePassword(id, oldPass, newPass, callback) {
    var con = connection();
    con.connect(function (err) {
        if (err) {
            //console.log('Database connection failed: ' + err.stack);
            return callback(err, null);
        }

        con.query("SELECT * FROM tblUser WHERE userID = ?", [id], function (err, result) {
            if (err) {
                con.end();
                //console.log("changePassword SQL SELECT FAILED\n");
                return callback(err, null);
            }
            if (result.length > 0) {
                bcrypt.compare(oldPass, result[0].pass, function (err, res) {
                    if (err) {
                        con.end();
                        //console.log('Hash function failed');
                        return callback(err, null);
                    }
                    if (res === true) {
                        bcrypt.hash(newPass, saltRounds, function (err, hash) {
                            if (err) {
                                //con.end();
                                //console.log('Hash function failed: ' + err.stack);
                                return callback(err, null);
                            }

                            con.query("UPDATE tblUser SET pass = ? WHERE userID = ? ", [hash, id], function (err, result) {
                                con.end();
                                if (err) {
                                    //console.log("changePassword SQL UPDATE FAILED\n");
                                    //console.log(err.stack);
                                    return callback(err, null);
                                }
                                return callback(null, true);
                            })
                        })
                    }
                    else {
                        con.end();
                        return callback(null, false) //true or false
                    }

                })
            }
            else {
                con.end();
                return callback(null, false);
            }
        })
    })
}

module.exports.registerUser = registerUser;
module.exports.authenicateUser = authenicateUser;
module.exports.getUserId = getUserId;
module.exports.getUsername = getUsername;
module.exports.validateEmail = validateEmail;
module.exports.checkAdmin = checkAdmin;
module.exports.getUserReviews = getUserReviews;
module.exports.changePassword = changePassword;