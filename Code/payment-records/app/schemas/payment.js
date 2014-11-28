var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var PaymentSchema = new Schema({
	id: Number,
	price: String,
	description: String,
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		}
	}
});

PaymentSchema.pre('save', function(next) {
	if(this.isNew) {
		this.meta.createAt = Date.now();
	} else {
		return ;
	}

	next();
});

PaymentSchema.statics = {
	fetch: function(cb) {
		return this
			.find({})
			.sort('meta.createAt')
			.exec(cb)
	}
	/* TODO or NOT TODO
	,
	findById: function(id, cb) {
		return	this
			.findOne({_id: id})
			.exec(cb)
	}
	*/
}

module.exports = PaymentSchema;