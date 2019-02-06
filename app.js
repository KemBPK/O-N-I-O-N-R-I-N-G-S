//INSTRUCTIONS:
//npm install express
//npm install ejs
//npm install mysql

var express = require('express'); //express module
var app = express();

var db = require('./data/data'); //imports data module

app.use(express.urlencoded()); //allows retrievals of post parameters

app.set('view engine', 'ejs');

app.get('/', function (req, res) { //redirect to homepage when the root URL is requested
  //console.log(db.connection());
  res.render('./Home/Welcome');
})

/* Controller Imports  */
require('./controllers/HomeController')(app); //imports home controller module 

/* End Controller Imports */


app.use(function(req, res, next) {
  res.status(404);
  res.render('./Error/404', { url: req.url });
});

//localhost:3000
app.listen(3000);

//exports = module.exports = app;