require("babel-core/register")
require("babel-polyfill")

const app = require('koa')()
const koa = require('koa-router')()
const logger = require('koa-logger')
const json = require('koa-json')
const views = require('koa-views')
const onerror = require('koa-onerror')
const AV = require('leanengine')

const index = require('./routes/index')
const users = require('./routes/users')
const test = require('./routes/test')

// global middlewares
app.use(views('views', {
  root: __dirname + '/views',
  default: 'jade'
}));

app.use(require('koa-bodyparser')())
app.use(json())
app.use(logger())

app.use(function* (next) {
  var start = new Date()
  yield next
  var ms = new Date() - start
  console.log('%s %s - %s', this.method, this.url, ms)
});

app.use(require('koa-static')(__dirname + '/public'))

// routes definition
koa.use('/', index.routes(), index.allowedMethods())
koa.use('/users', users.routes(), users.allowedMethods())
koa.use('/test', test.routes(), test.allowedMethods())

// mount root routes
app.use(koa.routes())

app.on('error', function (err, ctx) {
  log.error('server error', err, ctx)
});

module.exports = app