'use strict';

module.exports = function(app, yelp, db) {
    app.get('/', function (req, res) { //redirect to homepage when the root URL is requested
        res.render('./Home/Welcome');
    })

    app.get('/Home/Welcome', function (req, res) {
        res.redirect('/');     
        //res.render('./Home/Welcome'); //relative to the root view folder
    })

    app.get('/Home/Search', function (req, res) {
        //console.log("hello");
        const input = {
            term:'Onion Rings',
            location: req.query.city + ", " + req.query.state,
            limit: 50
            //categories: 'hotdogs' //fast food 
          };
        var search = yelp.SearchPlaces(input);

        search.then(function(response){
            // console.log(response.jsonBody);
            return response.jsonBody.businesses;
        }).then(function(result){
            res.render('./Restaurant/Search', {
                input: input,
                result: result
            });
        });
    })
}