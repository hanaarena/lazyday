var Index = require('../app/controllers/index');
var Payment = require('../app/controllers/payment');

module.exports = function(app) {
	// Index
	app.get('/', Index.index);

	// Payment
	app.get('/payment', Index.index);
	app.get('/payment/new', Payment.new);
	//app.get('/payment/:id', Payment.detail);

	// Payment List
	//app.get('/admin/payment/list');

	// Results -> for directive date search
	//app.get('/results', Index.search);
}