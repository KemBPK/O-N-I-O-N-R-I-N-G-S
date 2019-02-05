//INSTRUCTIONS:
//npm install express
//npm install ejs

//app needs express package
var express = require('express');
var app = express();


app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('index');
})

app.get('/get_input', function (req, res) {
    var input = req.query.input
    var unirest = require('unirest'); //npm install unirest
    unirest.get("https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/menuItems/search?query=" + input)
        .header("X-RapidAPI-Key", "bc37d905e4msh4f3080a6fc02ccdp136f37jsnbe8cef869ce7")
        .end(function (result) {

            console.log(Object.keys(result.body.menuItems[0]));
            res.render('index', {
                input: input,
                result: result.body.menuItems
            });
            //console.log(/*result.status, result.headers,*/ result.body);
        });
    //res.render('index');
    //res.render('index', {
    //    input : input
    //});
})



//localhost:3000
app.listen(3000);