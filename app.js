//INSTRUCTIONS:
//npm install express
//npm install ejs

//app needs express package
var express = require('express');
var app = express();

app.use(express.urlencoded()); //allows retrievals of post parameters

app.set('view engine', 'ejs');

require('./controllers/TestController')(app);

app.get('/', function (req, res) {
    res.render('index');
})

app.get('/get_input', function (req, res) {
    var input = req.query.input //get parameter
    var unirest = require('unirest'); //npm install unirest
    unirest.get("https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/menuItems/search?query=" + input)
        .header("X-RapidAPI-Key", "bc37d905e4msh4f3080a6fc02ccdp136f37jsnbe8cef869ce7")
        .end(function (result) {

            //console.log(Object.keys(result.body.menuItems[0])); //View object properties inside the command prompt
            res.render('index', {
                input: input,
                result: result.body.menuItems
            });
            //console.log(/*result.status, result.headers,*/ result.body); //View api query result inside the command prompt
        });
    //res.render('index');
    //res.render('index', {
    //    input : input
    //});
})

app.post('/test_post', function (req, res) {
    var input = req.body.input //post parameter
    console.log(input);
    res.redirect('/get_input');
})


//localhost:3000
app.listen(3000);

exports = module.exports = app;