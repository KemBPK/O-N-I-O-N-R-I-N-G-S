//INSTRUCTIONS:
//npm install express
//npm install ejs

//app needs express package
var express = require('express');
var app = express();

app.use(express.urlencoded()); //allows retrievals of post parameters

app.set('view engine', 'ejs');

require('./controllers/HomeController')(app);

app.get('/', function (req, res) {
    //res.render('index');
    res.render('./Home/Welcome');
})

app.use(function(req, res, next){
    res.status(404);
    // respond with html page
    if (req.accepts('html')) {
      res.render('404', { url: req.url });
      return;
    }
  });

//localhost:3000
app.listen(3000);

exports = module.exports = app;