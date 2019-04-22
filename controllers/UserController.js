'use strict';

module.exports = function(app, yelp, db) {
    // TODO - Nathan (4/21/19)

    app.get('/User/Register', function (req, res) { 
        res.render('./User/Register');
    })
}