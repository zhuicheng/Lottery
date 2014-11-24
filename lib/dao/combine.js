var utils = require('../utils');

/**
 * combine limit with parameter
 * 
 * @param model parameter
 * @param SQL
 */
function limit(model, SQL) {
	if (!utils.isEmpty(model._start) && !utils.isEmpty(model._limit)) {
		return SQL + 'LIMIT ' + model._start + ', ' + model._limit;
	}
	return SQL;
}

/**
 * combine order with parameter
 * 
 * @param model parameter
 * @param SQL
 */
function order(model, SQL) {
	return SQL;
}

module.exports.limit = limit;
module.exports.order = order;