'use strict';

module.exports = function(app, yelp, db) {
    app.get('/Search/Map', function (req, res) {
        var name = req.query.restaurant;
        name = name.replace(/[-]/g, ' ');
        name = name.replace(/[0-9]/g, '');
        const input = {
            restaurant: name.toUpperCase(),
            latitude: req.query.latitude,
            longitude: req.query.longitude 
          };
        res.render('./Partials/_map',{
            input: input
        });    
        //res.render('./Home/Welcome'); //relative to the root view folder
    })
}