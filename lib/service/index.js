var dao = require('../dao');

/**
 * transfer the function from dao
 * 
 * @param callback
 */
function init(callback) {
	dao.init(callback);
}

/**
 * select data from database
 * 
 * @param model
 * @param callback
 */
function select(model, callback) {
	if (model) {
		if (!model._start) {
			model._start = 0;
		}
		if (!model._limit) {
			model._limit = 10;
		}
	}
	dao.select(model, callback);
}

module.exports.init = init;
module.exports.select = select;