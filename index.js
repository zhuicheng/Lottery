var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var express = require('express');

require('colors'); // change console's style
require('./lib/common'); // extend prototype's function

var utils = require('./lib/utils');
var dao = require('./lib/dao');
var fetch = require('./lib/service/fetch');

var app = express();
app.use(express.static(path.join(__dirname, './public'))); // set static resource
app.use(bodyParser.urlencoded({ // parse parameter from request
	extended: false
}));
app.use(bodyParser.json()); // parse parameter from request

app.get('/*', function(req, res) {
	res.send(new Date());
});

utils.cascade([ function(next) {
	// if you want to run this app, you must check the database before it
	dao.init(next);
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