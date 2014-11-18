var express = require('express');
var mongoose = require('mongoose');
var http = require('http');
var path = require('path');
var port = process.env.PORT || 3000;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', './app/views/pages')
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.set('showStackErrot', true);
  //app.use(express.logger(':method :url :status'));
  //app.use(express.errorHandler());
}

require('./config/routes')(app);

app.listen(port);

console.log('Server run on ' + port);
