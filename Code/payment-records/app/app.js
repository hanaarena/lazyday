"use strict";

require("babel-core/register");
require("babel-polyfill");

var app = require('koa')();
var koa = require('koa-router')();
var logger = require('koa-logger');
var json = require('koa-json');
var views = require('koa-views');
var onerror = require('koa-onerror');
var AV = require('leanengine');

var index = require('./routes/index');
var users = require('./routes/users');
var test = require('./routes/test');

// global middlewares
app.use(views('views', {
  root: __dirname + '/views',
  default: 'jade'
}));

app.use(require('koa-bodyparser')());
app.use(json());
app.use(logger());

app.use(regeneratorRuntime.mark(function _callee(next) {
  var start, ms;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          start = new Date();
          _context.next = 3;
          return next;

        case 3:
          ms = new Date() - start;

          console.log('%s %s - %s', this.method, this.url, ms);

        case 5:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, this);
}));

app.use(require('koa-static')(__dirname + '/public'));

// routes definition
koa.use('/', index.routes(), index.allowedMethods());
koa.use('/users', users.routes(), users.allowedMethods());
koa.use('/test', test.routes(), test.allowedMethods());

// mount root routes
app.use(koa.routes());

app.on('error', function (err, ctx) {
  log.error('server error', err, ctx);
});

module.exports = app;