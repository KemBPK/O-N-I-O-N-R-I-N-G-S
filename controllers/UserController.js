'use strict';

module.exports = function(app, yelp, db) {

    app.get('/User/register', function (req, res) { 
        res.render('./User/Register');
    })

    app.post('/User/register', function (req, res) { 
        console.log("test");
        //res.render('./User/Register');

        // POST parameters
        var fname = req.body.fname;
        var lname = req.body.lname;
        var email = req.body.email;
        var password = req.body.password;

        db.user.registerUser(email, password, fname, lname, function(err){
            if(err)
                console.log("didn't work");
            else   
                console.log("worked");
        });
        
    })

    app.get('/User/login', function (req, res) { 
        res.render('./User/login');
    })

    app.post('/User/login', function (req, res) {
        var email = req.body.email;
        var password = req.body.password;
        db.user.authenicateUser(email, password, function(err, isAuthenticated){
            if(err){
                console.log("email " + email + " not found");
                res.redirect('/User/login');
                return;
            }
            if(isAuthenticated == true){
                //set cookie
            }
            else{
                //error message
            }

        });
    });


}