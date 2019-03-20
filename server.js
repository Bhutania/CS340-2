var path = require('path');
var express = require('express');
var exphbrs = require('express-handlebars');
var bodyParser = require('body-parser');
var handles = require('handlebars');
var mysql = require('./dbcon.js');
var myLogger = function(req, res, next) {
  console.log('huh')
  console.log(req)
  next()
}


var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);
app.set('mysql', mysql);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.all(myLogger);
app.use('/classes', require('./classes.js'));
app.use('/professors', require('./professors.js'));
app.use('/students', require('./students.js'));
app.use('/buildings', require('./buildings.js'));
app.use('/', express.static('public'));

app.use(function(req,res){
    res.status(404);
    res.render('404');
  });
  
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
  });

  
app.listen(app.get('port'), function(){
    console.log('Express started on access.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
  });
