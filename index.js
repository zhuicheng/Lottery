var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var express = require('express');

require('colors'); // change console's style
require('./lib/common'); // extend prototype's function

var utils = require('./lib/utils');
var service = require('./lib/service');
var fetch = require('./lib/service/fetch');

var T_LOTTERY = require('./lib/model/T_LOTTERY');

var app = express();
app.use(express.static(path.join(__dirname, './public'))); // set static resource
app.use(bodyParser.urlencoded({ // parse parameter from request
	extended: false
}));
app.use(bodyParser.json()); // parse parameter from request

app.use('/*', function(req, res) {
	service.select(utils.clone(T_LOTTERY), function(err, rows, fields) {
		if (err) {
			console.log('%s'.red, err);
			return false;
		}
		res.send(JSON.stringify(rows));
	});
});

utils.cascade([ function(next) {
	// if you want to run this app, you must check the database before it
	service.init(next);
}, function(next) {
	// check data is bran-new or not
	fetch.fetchData(next);
} ], function(err) {
	if (err) {
		console.log('%s'.red, err);
		return false;
	}
	app.listen(8888);
	console.log('Server start..'.green);
});