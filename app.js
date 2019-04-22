var express = require('express'); //express module
var httpsRedirect = require('express-https-redirect');
var app = express();
app.use('/', httpsRedirect());

var db = require('./data/modules'); //imports data module
var yelp = require('./api/yelp');//import yelp module

app.use(express.urlencoded()); //allows retrievals of post parameters

app.use('/content', express.static("content"));

app.set('view engine', 'ejs');

/* Controller Imports  */
require('./controllers/HomeController')(app, yelp, db); //imports home controller module 
require('./controllers/ExampleController')(app, yelp, db); //imports home controller module
require('./controllers/SearchController')(app, yelp, db); //imports home controller module
require('./controllers/UserController')(app, yelp, db,);   //imports user controller module
/* End Controller Imports */

app.use(function(req, res, next) {
  res.status(404);
  res.render('./Error/404', { url: req.url });
});

module.exports = app;