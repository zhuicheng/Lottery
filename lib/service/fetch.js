var request = require('request');
var $ = require('jquery');

function fetchData(callback) {
	request('http://trend.baidu.lecai.com/ssq/', function(err, res, body) {
		if (err) {
			console.log('Error: %j', err);
			throw err;
		}

		var contentArr = [];
		var dom = $(body);
		dom.find('#chartTable').find('tbody').children('tr').each(function() {
			var content = '';
			$(this).children('td').each(function(i) {
				if (i === 0 && $(this).text().length === 7) {
					content += '<div>' + $(this).text() + ': ';
				}
				if ($(this).hasClass('red_ball')) {
					content += '<span style="color: red;">' + $(this).text() + '</span> ';
				}
				if ($(this).hasClass('blue_ball')) {
					content += '<span style="color: blue;">' + $(this).text() + '</span></div>';
				}
			});
			if (content.length > 0) {
				contentArr.push(content);
			}
		});

		callback(contentArr);
	});
}

module.exports.fetchData = fetchData;