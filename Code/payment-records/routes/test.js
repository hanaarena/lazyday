const router = require('koa-router')();
const AV = require('leanengine');
const fs = require('fs')
const multiparty = require('multiparty')

// DB
const mongorito = require('mongorito')
const run = require('../models/run')
const User = require('../models/User')

// leanengine config
const APP_ID = 'PG2Eoc7wp4F7fzCr8z2RERMW-gzGzoHsz';
const APP_KEY = 'UdRYVXxsPgPRpppRPaGJJ8oV';
const MASTER_KEY = 'cOFpQzcQ3LDWmYPAcup8kIP6';
AV.initialize(APP_ID, APP_KEY, MASTER_KEY);

router.get('/', function* (next) {
	// const obj = new AV.Query('TestObject')
	// let list = 0
	// obj.find().then(function (res) {
	// 	list = res[0].attributes.foo
	// })

	yield this.render('test', {
		title: 'Hello World Koa!'
	});
});

// Not works perfect becaust leanengine's AV.Cloud()
// don't support koa generator function, so can't store
// cookie with leanengine(but signup feature is ok,confused)
router.post('/signup', function* (next) {
	const user = new AV.User();
	user.set('username', this.request.body.username);
	user.set('password', this.request.body.pass);
	user.signUp().then(function (res) {
		console.log(res);
	}).catch(function (err) {
		console.log(err);
	});
	yield next;
});

// Upload normal text file
router.post('/upload', function* (next) {
	const base64 = '6K+077yM5L2g5Li65LuA5LmI6KaB56C06Kej5oiR77yf';
	const file = new AV.File('test.txt', {
		base64: base64
	});

	file.save().then(function (res) {
		console.log(res.url());
	}).catch(function (err) {
		console.log(err);
	});
});

// Upload image or large file
router.post('/upload/image', function* (next) {
	const form = new multiparty.Form();
  form.parse(this.req, function(err, fields, files) {
    let iconFile = files.imageFile[0];

	  // Test file detail 
    console.log(files)
    console.log(files.imageFile[0])

    if(iconFile.size !== 0){
      fs.readFile(iconFile.path, function(err, data){
        if(err) {
          throw new Error(err)
        }
        let base64Data = data.toString('base64');
        let theFile = new AV.File(iconFile.originalFilename, {base64: base64Data});
        theFile.metaData('flag','lanz');
        theFile.save().then(function(theFile){
          console.log(theFile)
          console.log(theFile.metaData('flag'))
        });
      });
    }
  });
})

router.get('/image/list', function* (next) {
	function getThumbnail (url, width, height, quality, fit, format) {
		const qua = quality || 100
		const mode = fit ? 1 : 2
		const fmt = fmt || 'png'
		return url + '?imageView/' + mode + '/w/' + width + '/h/' + height
		  + '/q/' + qua + '/format/' + fmt 
	}

	const obj = new AV.Query('_File')
	let file = ''

	// test
	obj.get('5707daab1ea4930055a8b530').then(function (res) {
		file = getThumbnail(res.attributes.url, 100, 100)
		console.log(getThumbnail(res.attributes.url, 100, 100))
	})

	this.body = {
		foo: file,
		foo2: 'bar'
	}

	console.log(this.body)

	// this.redirect('/test')
})

// Create User & store in mongodb
router.post('/create/user', function* (next) {
	run(function* () {
	  let user = new User({
	    name: 'ffff'
	  })

	  yield user.save()

	  console.log('User:', user.get('_id'))

	  user.set('name', 'New name');
	  yield user.save();

	  console.log('Update User:', user.get('_id'))
	})

	this.body = this.request.body

	console.log(this.body)

  yield next
});

// Get users data
router.get('/api/users', function* (next) {
	let userList = []
	let result = []

	run(function* () {
	  userList = yield User.all()

	  userList.forEach((user, index) => {
	  	result.push({
	  		id: user.get('_id').toString()
	  	})
	  })

  	console.log('Users:', result)
	})

	// http://stackoverflow.com/questions/22059775/using-callbacks-with-nodejs-in-koa/22062524#22062524
	function load (callback) {
  	setTimeout(function() {
      callback(null, result);
    }, 100);
	}
	
	this.body = yield load
	console.log('result: ', result)

  yield next
});

// Get spec user data
router.get('/api/user/:id', function* (next) {
	this.body = this.params

	yield next
})

// Get spec user data (more params)
router.get('/api/user/:id/:date', function* (next) {
	this.body = this.params

	yield next
})

// Get query parameters => foo=bar&bar=foo
router.get('/api/user', function* (next) {
	this.body = this.request.query

	yield next
})

module.exports = router;