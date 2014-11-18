var Index = require('../app/controllers/index');

module.exports = function(app) {
	//index
	app.get('/', Index.index);
}