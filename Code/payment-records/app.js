var express = require('express');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(express);
var path = require('path');
var port = process.env.PORT || 3000;
var fs = require('fs');
var dbUrl = 'mongodb://localhost/payment';

var app = express();

mongoose.connect(dbUrl);

// Models
var models_path = __dirname + '/app/models';
var walk = function(path) {
  fs
    .readdirSync(path)
    .forEach(function(file) {
      var newPath = path + '/' + file
      var stat = fs.statSync(newPath)

      if (stat.isFile()) {
        if (/(.*)\.(js|coffee)/.test(file)) {
          require(newPath)
        }
      }
      else if (stat.isDirectory()) {
        walk(newPath)
      }
    });
}
walk(models_path);

// all environments
app.set('views', './app/views/pages')
app.set('view engine', 'jade');
/*app.use(express.session({
	secret: 'pamentrecords',
	store: new mongoStore({
		url: dbUrl,
		collection: 'sessions'
	})
}));*/
//-app.locals.moment = require('moment');
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
