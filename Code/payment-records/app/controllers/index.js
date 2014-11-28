var mongoose = require('mongoose');
var Payment = mongoose.model('Payment');
//var	Category = mongoose.model('Category');                                                                                                                                                                                                                                                                                                                                                                                                                         

// Index page
exports.index = function(req, res) {
	res.render('index', {
		title: 'Payment Records'
	});
}