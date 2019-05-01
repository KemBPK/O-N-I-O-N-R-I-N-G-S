'use strict';

module.exports = function (app, yelp, db) {
    app.get('/Restaurant/Map', function (req, res) {
        var name = req.query.restaurant;
        name = name.replace(/[-]/g, ' ');
        name = name.replace(/[0-9]/g, '');
        const input = {
            restaurant: name.toUpperCase(),
            latitude: req.query.latitude,
            longitude: req.query.longitude
        };
        res.render('./Partials/_map', {
            input: input
        });
        //res.render('./Home/Welcome'); //relative to the root view folder
    })

    app.post('/Restaurant/Search', function (req, res) {
        var id = req.body.id; //post parameter
        console.log('POST parameter id:' + id);
        var alias = req.body.alias; //post parameter
        console.log('POST parameter alias:' + alias);

        db.restaurant.checkRestaurant(id, function (err, doesExist) {
            if (err) {
                console.log('caught error in checkRestaurant');
                res.redirect('/');
                return;
            }
            if (doesExist) {
                console.log('exists');
                //res.redirect
                res.redirect('/Restaurant?alias=' + alias);
                return;
            }
            else {
                console.log('does not exists');

                var search = yelp.SearchRestaurant(id);
                search.then(function (response) {
                    //console.log(response.jsonBody);
                    return response.jsonBody;
                }).then(function (result) {
                    //console.log(result);
                    result.name = result.name.replace('\'', '\\\'');
                    db.restaurant.insertRestaurant(result.id, result.name, result.alias, result.location.display_address, result.location.city, result.location.state,
                        result.location.zip_code, result.coordinates.latitude, result.coordinates.longitude, result.display_phone, result.url,
                        function (err) {
                            if (err) {
                                console.log('caught error in insertRestaurant');
                                res.redirect('/');
                                return;
                            }
                            console.log('inserted new restaurant');
                            console.log('COMPARISON TEST - local alias: ' + alias + ' - result.alias: ' + result.alias);
                            res.redirect('/Restaurant?alias=' + result.alias);
                            return;
                        });
                }).catch(function (err) {
                    console.log('SearchRestaurant error: ');
                    res.redirect('/');
                    return;
                });
            }
        })
    })

    app.get('/Restaurant/', function (req, res) {
        var alias = req.query.alias;
        db.restaurant.getRestaurantInfoByAlias(alias, function (err, restaurant) {
            if (err) {
                console.log("error when calling getRestaurantInfoByAlias");
                res.status(404);
                res.render('./Error/404', { url: req.url });
                return;
            }
            db.restaurant.getReviews(restaurant.restID, function (err, result) {
                if (err) {
                    console.log("error when calling getReviews");
                    res.status(404);
                    res.render('./Error/404', { url: req.url });
                    return;
                }

                var search = yelp.SearchRestaurant(restaurant.yelpID);
                search.then(function (response) {
                    //res.send(response.jsonBody);   
                    res.render('./Restaurant/Profile', {
                        profile: restaurant,
                        reviews: result,
                        yelp:    response.jsonBody
                    });
                    return;        
                });

                
            })
        })

    })

    app.post('/Restaurant/Rating', function (req, res) {
        console.log('calling Rating');
        var yelpID = req.body.id;
        db.restaurant.getRestaurantID(yelpID, function (err, restID) {
            if (err) {
                console.log("error when calling getRestaurantID");
                var rating = {
                    count: 0,
                    sum: 0
                };
                res.send(rating);
                return;
            }
            console.log('returning rating result');
            db.restaurant.getRatingSumAndCount(restID, function (err, count, sum) {
                var rating = {
                    count: count,
                    sum: sum
                };
                res.send(rating);
                return;
            })

        })
    })

    app.post('/Restaurant/Review', function (req, res) {
        var restID = req.body.restID;
        var description = req.body.description;
        var rating = req.body.rating;
        var alias = req.body.alias;
        var userID = req.session.id;

        db.restaurant.insertReview(restID, userID, description, rating, function (err) {
            if (err) {
                console.log("error when calling insertReview");
                return;
            }
            res.redirect('/Restaurant?alias=' + alias);
        })
    })

    app.post('/Restaurant/GetMostRecentReview', function(req, res){
        var yelpID = req.body.yelpID;
        db.restaurant.getRestaurantID(yelpID, function (err, restID) {
            if (err) {
                //console.log("getRestaurantID did not find the restaurant with yelpID: " + yelpID);
                res.send(null);
                return;
            }
            db.restaurant.getMostRecentReview(restID, function(err, review){
                if(err || review == null){
                    res.send(null);
                    return;
                }
                else{
                    console.log('returning recent review');
                    res.send(review);
                    return;
                }
            })

        })

        
    })

}