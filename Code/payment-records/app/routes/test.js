'use strict';

var router = require('koa-router')();
var AV = require('leanengine');
var fs = require('fs');
var multiparty = require('multiparty');

var APP_ID = 'PG2Eoc7wp4F7fzCr8z2RERMW-gzGzoHsz';
var APP_KEY = 'UdRYVXxsPgPRpppRPaGJJ8oV';
var MASTER_KEY = 'cOFpQzcQ3LDWmYPAcup8kIP6';
AV.initialize(APP_ID, APP_KEY, MASTER_KEY);

router.get('/', regeneratorRuntime.mark(function _callee(next) {
	return regeneratorRuntime.wrap(function _callee$(_context) {
		while (1) {
			switch (_context.prev = _context.next) {
				case 0:
					_context.next = 2;
					return this.render('test', {
						title: 'Hello World Koa!'
					});

				case 2:
				case 'end':
					return _context.stop();
			}
		}
	}, _callee, this);
}));

// Not works perfect becaust leanengine's AV.Cloud()
// don't support koa generator function, so can't store
// cookie with leanengine(but signup feature is ok,confused)
router.post('/signup', regeneratorRuntime.mark(function _callee2(next) {
	var user;
	return regeneratorRuntime.wrap(function _callee2$(_context2) {
		while (1) {
			switch (_context2.prev = _context2.next) {
				case 0:
					user = new AV.User();

					user.set('username', this.request.body.username);
					user.set('password', this.request.body.pass);
					user.signUp().then(function (res) {
						console.log(res);
					}).catch(function (err) {
						console.log(err);
					});
					_context2.next = 6;
					return next;

				case 6:
				case 'end':
					return _context2.stop();
			}
		}
	}, _callee2, this);
}));

// Upload normal text file
router.post('/upload', regeneratorRuntime.mark(function _callee3(next) {
	var base64, file;
	return regeneratorRuntime.wrap(function _callee3$(_context3) {
		while (1) {
			switch (_context3.prev = _context3.next) {
				case 0:
					base64 = '6K+077yM5L2g5Li65LuA5LmI6KaB56C06Kej5oiR77yf';
					file = new AV.File('test.txt', {
						base64: base64
					});


					file.save().then(function (res) {
						console.log(res.url());
					}).catch(function (err) {
						console.log(err);
					});

				case 3:
				case 'end':
					return _context3.stop();
			}
		}
	}, _callee3, this);
}));

router.post('/upload/image', regeneratorRuntime.mark(function _callee4(next) {
	var form;
	return regeneratorRuntime.wrap(function _callee4$(_context4) {
		while (1) {
			switch (_context4.prev = _context4.next) {
				case 0:
					form = new multiparty.Form();

					form.parse(this.req, function (err, fields, files) {
						var iconFile = files.imageFile[0];

						// Test file detail
						console.log(files);
						console.log(files.imageFile[0]);

						if (iconFile.size !== 0) {
							fs.readFile(iconFile.path, function (err, data) {
								if (err) {
									throw new Error(err);
								}
								var base64Data = data.toString('base64');
								var theFile = new AV.File(iconFile.originalFilename, { base64: base64Data });
								theFile.metaData('flag', 'lanz');
								theFile.save().then(function (theFile) {
									console.log(theFile);
									console.log(theFile.metaData('flag'));
								});
							});
						}
					});

				case 2:
				case 'end':
					return _context4.stop();
			}
		}
	}, _callee4, this);
}));

router.get('/image/list', regeneratorRuntime.mark(function _callee5(next) {
	var getThumbnail, obj, file;
	return regeneratorRuntime.wrap(function _callee5$(_context5) {
		while (1) {
			switch (_context5.prev = _context5.next) {
				case 0:
					getThumbnail = function getThumbnail(url, width, height, quality, fit, format) {
						var qua = quality || 100;
						var mode = fit ? 1 : 2;
						var fmt = fmt || 'png';
						return url + '?imageView/' + mode + '/w/' + width + '/h/' + height + '/q/' + qua + '/format/' + fmt;
					};

					obj = new AV.Query('_File');
					file = '';

					// test

					obj.get('5707daab1ea4930055a8b530').then(function (res) {
						file = getThumbnail(res.attributes.url, 100, 100);
						console.log(getThumbnail(res.attributes.url, 100, 100));
					});

					this.body = {
						foo: file,
						foo2: 'bar'
					};

					console.log(this.body);

					// this.redirect('/test')

				case 6:
				case 'end':
					return _context5.stop();
			}
		}
	}, _callee5, this);
}));

module.exports = router;