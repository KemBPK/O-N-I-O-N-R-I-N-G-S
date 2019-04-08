'use strict';

module.exports = function(app, yelp, db) {

    var search; 

    app.get('/', function (req, res) { //redirect to homepage when the root URL is requested
        res.render('./Home/Welcome');
    })

    app.get('/Home/Welcome', function (req, res) {        
        res.render('./Home/Welcome'); //relative to the root view folder
    })

    app.get('/Home/Search', function (req, res) {
        console.log("hello");
        const input = {
            term:'Onion Rings',
            location: req.query.city + ", " + req.query.state,
            limit: 5
            //categories: 'hotdogs' //fast food 
          };
        search = yelp.SearchPlaces(input);

        search.then(function(response){
            // console.log(response.jsonBody);
            return response.jsonBody.businesses;
        }).then(function(result){
            res.render('./Home/Search', {
                input: input,
                result: result
            });
        });
    })

    app.get('/Home/Table', function(req, res){
        db.selectAll(function(result){
            console.log(result);
            res.render('./Home/Table', {
                result: result
            });
        });     
    })

    app.post('/Home/Insert', function(req, res){
        var input = req.body;
        db.insert(input.first, input.last, input.age, function(){
            res.redirect('./Table');
        });  
    })
    
    //POST example
    // app.post('/Home/get_input', function (req, res) {
    //     var input = req.body.input; //post parameter
    //     console.log(input);
    //     res.redirect('./Welcome'); //relative to the view folder
    // })
}