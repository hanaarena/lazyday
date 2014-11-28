var mongoose = require('mongoose');
var Payment = mongoose.model('Payment');
//var Category = mongoose.model('Category');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');

// New Payment
exports.new = function(req, res) {
	Payment.find({}, function(err, payments) {
		res.render('list', {
			title: '录入新payment',
			payments: {}
		});
	});	
}

// Post payment
exports.save = function(req, res) {
	var id = req.body.movie._id;
	var paymentObj = req.body.payment;
	var _payment;

	if(rq.poster) {
		paymentObj.poster = req.poster;
	}

	if(id) {
		Payment.findById(id, function(err, payment) {
			if(err) {
				console.log(err);
			}

			_payment = _.extend(payment, paymentObj);
			_payment.save(function(err, payment) {
				if(err) {
					console.log(err);
				}

				res.redirect('/payment/' + payment._id);
			});
		});
	}
}

// Payment list
exports.list = function(req, res) {
	Payment.find({})
		.exec(function(err, payments) {
			if(err) {
				console.log(err);
			}

			res.render('list', {
				title: 'Payment list',
				payments: payments
			});
		});
}