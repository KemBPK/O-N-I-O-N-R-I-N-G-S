'use strict';

module.exports = function (app, yelp, db) {
    app.get('/', function (req, res) { //redirect to homepage when the root URL is requested
        if (req.session.id) {
            console.log('test');
            console.log(req.session.id);
        }
        // req.session.id = 1; 
        // console.log(req.session.isNew); //true when session is not null anymore
        // console.log(req.session.id);
        // req.session = null;
        res.render('./Home/Welcome');
    })

    app.get('/Home/Welcome', function (req, res) {
        res.redirect('/');
        //res.render('./Home/Welcome'); //relative to the root view folder
    })

    app.get('/Home/Search', function (req, res) {

        if (req.query.city && req.query.state) {
            var input;
            if (req.query.searchFastFood) {
                input = {
                    term: 'Onion Rings',
                    location: req.query.city + ", " + req.query.state,
                    limit: 50,
                    categories: 'hotdogs' //fast food 
                };
            }
            else {
                input = {
                    term: 'Onion Rings',
                    location: req.query.city + ", " + req.query.state,
                    limit: 50
                };
            }

            var search = yelp.SearchPlaces(input);

            search.then(function (response) {
                // console.log(response.jsonBody);
                return response.jsonBody.businesses;
            }).then(function (result) {
                const Cryptr = require('cryptr');
                console.log("Home: " + process.env.SEARCH_KEY);
                const cryptr = new Cryptr(process.env.SEARCH_KEY);
                res.render('./Restaurant/Search', {
                    input: input,
                    result: result,
                    cryptr: cryptr
                });
            });
        }
        else{
            res.redirect('/');
        }

    })

}