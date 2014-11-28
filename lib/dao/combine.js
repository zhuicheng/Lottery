var utils = require('../utils');

/**
 * combine limit with parameter
 * 
 * @param model parameter
 * @param SQL
 */
function limit(model, SQL) {
	if (!utils.isEmpty(model._start) && !utils.isEmpty(model._limit)) {
		return SQL + ' LIMIT ' + model._start + ', ' + model._limit + ' ';
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
	if (model) {
		if (typeof (model._order) == 'string') {
			return SQL + ' ORDER BY ' + model._order + ' ';
		} else if (model._order instanceof Array) {
			return SQL + ' ORDER BY ' + model._order.join(', ') + ' ';
		} else if (typeof (model._order) == 'object') {
			var orderSQL = [];
			for ( var i in model._order) {
				if (typeof (model._order[i]) != 'function') {
					orderSQL.push(i + ' ' + (model._order[i] == 'DESC' ? model._order[i] : 'ASC'));
				}
			}

			if (orderSQL.length > 0) {
				return SQL + ' ORDER BY ' + orderSQL.join(', ') + ' ';
			} else {
				return SQL;
			}
		}
	}
	return SQL;
}

module.exports.limit = limit;
module.exports.order = order;