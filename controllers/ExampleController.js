'use strict';

module.exports = function(app, yelp, db) {

    // app.get('/', function (req, res) { //redirect to homepage when the root URL is requested
    //     res.render('./Example/Welcome');
    // })

    // app.get('/Example/Welcome', function (req, res) {        
    //     res.render('./Example/Welcome'); //relative to the root view folder
    // })

    // app.get('/Example/Search', function (req, res) {
    //     console.log("hello");
    //     const input = {
    //         term:'Onion Rings',
    //         location: req.query.city + ", " + req.query.state,
    //         limit: 5
    //         //categories: 'hotdogs' //fast food 
    //       };
    //     var search = yelp.SearchPlaces(input);

    //     search.then(function(response){
    //         // console.log(response.jsonBody);
    //         return response.jsonBody.businesses;
    //     }).then(function(result){
    //         res.render('./Example/Search', {
    //             input: input,
    //             result: result
    //         });
    //     });
    // })

    app.get('/Example/Table', function(req, res){
        db.selectAll(function(result){
            console.log(result);
            res.render('./Example/Table', {
                result: result
            });
        });     
    })

    app.post('/Example/Insert', function(req, res){
        var input = req.body;
        db.insert(input.first, input.last, input.age, function(){
            res.redirect('./Table');
        });  
    })
    
    //POST example
    // app.post('/Example/get_input', function (req, res) {
    //     var input = req.body.input; //post parameter
    //     console.log(input);
    //     res.redirect('./Welcome'); //relative to the view folder
    // })
}