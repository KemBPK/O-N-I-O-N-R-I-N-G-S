'use strict';

module.exports = function(app) {
    app.get('/Home/Welcome', function (req, res) {
        res.render('./Home/Welcome'); //relative to the root view folder
    })

    app.get('/Home/get_input', function (req, res) {
        var input = req.query.input //get parameter
        var unirest = require('unirest'); //npm install unirest
        unirest.get("https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/menuItems/search?query=" + input)
            .header("X-RapidAPI-Key", "bc37d905e4msh4f3080a6fc02ccdp136f37jsnbe8cef869ce7")
            .end(function (result) { //ends unirest.get with a render response
    
                //console.log(Object.keys(result.body.menuItems[0])); //View object properties inside the command prompt
                res.render('./Home/Welcome', {
                    input: input,
                    result: result.body.menuItems
                });
                //console.log(/*result.status, result.headers,*/ result.body); //View api query result inside the command prompt
            });
    })
    
    app.post('/Home/get_input', function (req, res) {
        var input = req.body.input //post parameter
        console.log(input);
        res.redirect('./Welcome'); //relative to the view folder
    })
}