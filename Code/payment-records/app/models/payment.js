var mongoose = require('mongoose');
var PaymentSchema = require('../schemas/payment');
var Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;