var express = require('express'); //express module
var app = express();

var db = require('./data/data'); //imports data module
var yelp = require('./api/yelp');//import yelp module

app.use(express.urlencoded()); //allows retrievals of post parameters

app.set('view engine', 'ejs');

/* Controller Imports  */
require('./controllers/HomeController')(app, yelp, db); //imports home controller module 

/* End Controller Imports */

app.use(function(req, res, next) {
  res.status(404);
  res.render('./Error/404', { url: req.url });
});

module.exports = app;