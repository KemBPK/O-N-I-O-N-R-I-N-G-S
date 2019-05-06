'use strict';

module.exports = function (app, yelp, db) {

    app.get('/User/Register', function (req, res) {
        res.render('./User/Register');
    })

    app.post('/User/Register', function (req, res) {
        //console.log("test");
        //res.render('./User/Register');

        // POST parameters
        var fname = req.body.fname;
        var lname = req.body.lname;
        var email = req.body.email;
        var password = req.body.password;

        db.user.registerUser(email, password, fname, lname, function (err) {
            if (err) {
                console.log("didn't work");
                res.redirect('/User/Register');
                return;
            }
            console.log("worked");
            res.redirect('/User/Login');
            return;
        })
    })

    app.post('/User/Register/CheckEmail', function (req, res) {
        var email = req.body.email;
        db.user.validateEmail(email, function (err, isValid) {
            if (err) {
                console.log('Error when calling validateEmail');
                res.send(false);
                return;
            }
            if (isValid == true) {
                res.send(true);
                return;
            }
            else {
                res.send(false);
                return;
            }
        })
    })

    app.get('/User/Login', function (req, res) {
        res.render('./User/Login');
    })

    app.post('/User/Login', function (req, res) {
        var email = req.body.email;
        var password = req.body.password;
        db.user.authenicateUser(email, password, function (err, isAuthenticated) {
            if (err) {
                console.log("email " + email + " not found");
                res.redirect('/User/Login');
                return;
            }
            if (isAuthenticated == true) {
                db.user.getUserId(email, function (err, id) {
                    if (err) {
                        console.log('Login failed');
                        res.redirect('/User/Login');
                        return;
                    }
                    req.session.id = id;
                    console.log('Login succeeded');
                    res.redirect('/');
                    return;
                })
            }
            else {
                console.log('Login failed');
                res.redirect('/User/Login');
                return;
            }

        })
    })

    app.post('/User/LoginNav', function (req, res) {
        var email = req.body.email;
        var password = req.body.password;
        db.user.authenicateUser(email, password, function (err, isAuthenticated) {
            if (err) {
                console.log("email " + email + " not found");
                res.send(false);
                //res.redirect('/User/Login');
                return;
            }
            if (isAuthenticated == true) {
                db.user.getUserId(email, function (err, id) {
                    if (err) {
                        console.log('Login failed');
                        res.send(false);
                        //res.redirect('/User/Login');
                        return;
                    }
                    req.session.id = id;
                    console.log('Login succeeded');
                    res.send(true);
                    //res.redirect('/');
                    return;
                })
            }
            else {
                console.log('Login failed');
                res.send(false);
                // res.redirect('/User/Login');
                return;
            }

        })
    })

    app.post('/User/Logout', function (req, res) {
        req.session = null;
        res.send(null);
        //res.redirect('/User/Login');
    })

    app.post('/User/GetUsername', function (req, res) {
        console.log('called GetUsername');
        if (req.session.id) {
            db.user.getUsername(req.session.id, function (err, name) {
                if (err) {
                    var account = {
                        isLogged: false,
                    }
                    // return callback(JSON.stringify(account));
                    res.send(account);
                }
                console.log('logged in');
                var account = {
                    isLogged: true,
                    username: name
                };
                res.send(account);
            })
        }
        else {
            console.log('not logged in');
            var account = {
                isLogged: false,
            }
            res.send(account);
        }
    })

    app.get('/User/GetReviews', function (req, res) {
        console.log('called getUserReviews');
        if (req.session.id) {
            db.user.getUserReviews(req.session.id, function (err, result) {
                if (err) {
                    res.redirect('/');
                    return;
                }
                res.render('./User/Reviews', {
                    reviews: result
                });
            })
        }
        else {
            res.redirect('/');
            return;
        }
    })

}