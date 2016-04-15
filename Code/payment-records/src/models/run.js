const co = require('co')

function run (fn) {
	co(fn).catch(function (err) {
		console.error(err.stack)
	})
}

module.exports = run