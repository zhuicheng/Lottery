var mysql = require('mysql');

var combine = require('./combine');

// connect pool config
var pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '',
	connectionLimit: 3,
	debug: false
});

/**
 * build database and table if not exist
 * 
 * @param callback
 */
function init(callback) {
	pool.getConnection(function(err, conn) {
		if (err) {
			callback && callback(err);
			return false;
		}
		// conn.query('DROP DATABASE IF EXISTS LOTTERY');
		conn.query('CREATE DATABASE IF NOT EXISTS LOTTERY');
		conn.query('USE LOTTERY');
		conn.query('CREATE TABLE IF NOT EXISTS T_LOTTERY(PHASE_NUM VARCHAR(8) NOT NULL, PUBLISH_TIME DATETIME NOT NULL, RED_1 INT(2) NOT NULL, RED_2 INT(2) NOT NULL, RED_3 INT(2) NOT NULL, RED_4 INT(2) NOT NULL, RED_5 INT(2) NOT NULL, RED_6 INT(2) NOT NULL, BLUE INT(2) NOT NULL, PRIMARY KEY(PHASE_NUM))');
		conn.release();
		console.log('Database is ready..'.green);
		pool.config.connectionConfig.database = 'LOTTERY';
		callback && callback(err);
	});
}

/**
 * count with condition
 * 
 * @param model
 * @param callback
 */
function count(model, callback) {
	if (model && model._tableName) {
		var SQL = 'SELECT COUNT(1) AS COUNT FROM ' + model._tableName + ' WHERE 1 = 1 ';
		var valueArray = [];
		for ( var i in model) {
			if (i.indexOf('_') == 0 || typeof (model[i]) == 'function' || model[i] == null) {
				continue;
			}
			SQL += ' AND ' + i + ' = ? ';
			valueArray.push(model[i]);
		}
		pool.query(SQL, valueArray, function(err, rows, fields) {
			if (err) {
				console.error('%s', err);
				throw err;
			}
			callback && callback(err, rows, fields);
		});
	} else {
		callback && callback('Table is not definitely..'.red);
	}
}

/**
 * insert into database
 * 
 * @param model
 * @param callback
 */
function insert(model, callback) {
	if (model && model._tableName) {
		var SQL = 'INSERT INTO ' + model._tableName;
		var fields = '(';
		var values = [];

		for ( var i in model) {
			if (i.indexOf('_') == 0 || typeof (model[i]) == 'function' || model[i] == null) {
				continue;
			}
			fields += i + ', ';
			values.push(model[i]);
		}

		if (values.length == 0) {
			callback && callback('There is nothing need to insert..'.red);
			return false;
		}

		fields = fields.substring(0, fields.lastIndexOf(',')); // erase the last ','
		fields += ') VALUES (' + (new Array(values.length)).join('?, ') + '?' + ')';

		pool.query(SQL + fields, values, function(err, rows, fields) {
			callback && callback(err, rows, fields);
		});
	} else {
		callback && callback('Table is not definitely..'.red);
	}
}

/**
 * select data from database
 * 
 * @param model
 * @param callback
 */
function select(model, callback) {
	if (model && model._tableName) {
		var SQL = 'SELECT * FROM ' + model._tableName + ' WHERE 1 = 1 ';
		var valueArray = [];
		for ( var i in model) {
			if (i.indexOf('_') == 0 || typeof (model[i]) == 'function' || model[i] == null) {
				continue;
			}
			SQL += ' AND ' + i + ' = ? ';
			valueArray.push(model[i]);
		}

		model._order = {
			PUBLISH_TIME: 'DESC'
		};

		SQL = combine.order(model, SQL); // combine Order
		SQL = combine.limit(model, SQL); // combine Limit

		pool.query(SQL, valueArray, function(err, rows, fields) {
			if (err) {
				console.error('%s', err);
				throw err;
			}
			callback && callback(err, rows, fields);
		});
	} else {
		callback && callback('Table is not definitely..'.red);
	}
}

module.exports.init = init;
module.exports.count = count;
module.exports.insert = insert;
module.exports.select = select;