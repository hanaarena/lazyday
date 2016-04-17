require("babel-core/register")
require("babel-polyfill")

const app = require('koa')()
const router = require('koa-router')()
const logger = require('koa-logger')
const json = require('koa-json')
const views = require('koa-views')
const bodyparser = require('koa-bodyparser')
const onerror = require('koa-onerror')
const AV = require('leanengine')

// Router
const index = require('./routes/index')
const users = require('./routes/users')
const test = require('./routes/test')

// DB
const mongorito = require('mongorito')
const run = require('./models/run')
run(function* () {
	yield mongorito.connect('localhost/payment')
	console.log('Connected to MongoDB zZZ')
})

// global middlewares
app.use(views('views', {
  root: __dirname + '/views',
  default: 'jade'
}));

app.use(bodyparser())
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
router.use('/', index.routes(), index.allowedMethods())
router.use('/users', users.routes(), users.allowedMethods())
router.use('/test', test.routes(), test.allowedMethods())

// mount root routes
app.use(router.routes())

app.on('error', function (err, ctx) {
  log.error('server error', err, ctx)
});

module.exports = app