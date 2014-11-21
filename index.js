var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var express = require('express');

var fetch = require('./lib/service/fetch');

var app = express();
app.use(express.static(path.join(__dirname, './public')));
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());

app.get('/*', function(req, res) {
	fetch.fetchData(function(arr) {
		res.send(arr.join(''));
	});
});

app.listen(8888);
console.log('Server start..');