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

    app.post('/Search/RestaurantProfile', function (req, res) {
        var id = req.body.id; //post parameter
        console.log(id);
        var alias = req.body.alias; //post parameter
        console.log(alias);

        db.search.CheckRestaurant(id,function(result){
            //if(result) res.redirect
            //else {make profile and res.redirect}
        });

        res.redirect('../Home/Welcome'); //relative to the view folder
    })
}