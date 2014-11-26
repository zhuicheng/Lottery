var request = require('request');
var $ = require('jquery');
var async = require('async');

var utils = require('../utils');
var dao = require('../dao');

var T_LOTTERY = require('../model/T_LOTTERY');
var initUrl = 'http://kaijiang.zhcw.com/zhcw/html/ssq/list.html';
var templateUrl = 'http://kaijiang.zhcw.com/zhcw/html/ssq/list_{0}.html';

/**
 * fetch data into database
 * 
 * @param callback
 */
function fetchData(callback) {
	console.log('Check data is synchronous or not..'.yellow);
	request(initUrl, function(err, res, body) {
		if (err) {
			callback && callback(err);
			return false;
		}

		var html = $(body);
		var totalCount = html.find('tr:last strong:eq(1)').text().trim();
		var totalPage = html.find('tr:last strong:first').text().trim();

		dao.count(T_LOTTERY, function(err, rows, fields) { // count all the record from database and compare with the fetch data
			if (err) {
				callback && callback(err);
				return false;
			}

			if (rows[0].COUNT == 0) {
				insertWithoutFilter(totalPage, function(err) {
					if (err) {
						callback && callback(err);
						return false;
					}
					console.log('Check data complete..'.yellow);
					callback && callback(err);
				});
			} else if (totalCount != rows[0].COUNT) {
				// TODO
				callback && callback(err);
			} else {
				callback && callback(err);
			}
		});
	});
}

function insertWithoutFilter(totalPage, callback) {
	function fetch(index, totalPage, callback) {
		if (index <= totalPage) {
			request(templateUrl.replace('{0}', index), function(err, res, body) {
				if (err) {
					callback && callback(err);
					return false;
				}

				// combine data array
				var contentArray = [];
				var html = $(body);
				html.find('table').find('tr:not(:eq(0), :eq(1), :last)').each(function() {
					var lottery = utils.clone(T_LOTTERY);
					var publishTime = $(this).children(':eq(0)').text().trim().split('-');
					lottery.PUBLISH_TIME = new Date(publishTime[0], parseInt(publishTime[1]) - 1, parseInt(publishTime[2]));
					lottery.PHASE_NUM = $(this).children(':eq(1)').text();
					lottery.RED_1 = parseInt($(this).children(':eq(2)').children(':eq(0)').text());
					lottery.RED_2 = parseInt($(this).children(':eq(2)').children(':eq(1)').text());
					lottery.RED_3 = parseInt($(this).children(':eq(2)').children(':eq(2)').text());
					lottery.RED_4 = parseInt($(this).children(':eq(2)').children(':eq(3)').text());
					lottery.RED_5 = parseInt($(this).children(':eq(2)').children(':eq(4)').text());
					lottery.RED_6 = parseInt($(this).children(':eq(2)').children(':eq(5)').text());
					lottery.BLUE = parseInt($(this).children(':eq(2)').children(':eq(6)').text());
					contentArray.push(lottery);
				});

				// insert into database
				async.forEachSeries(contentArray, function(o, callback) {
					dao.insert(o, callback);
				}, function(err) {
					if (err) {
						callback && callback(err);
						return false;
					}

					utils.cycleTips({
						prefix: function() {
							if (index > 1) {
								return '';
							}
							return 'Fetching progress: '.cyan;
						},
						tips: (parseInt(index * 100 / totalPage) + '%').cyan,
						eraseLength: function() {
							if (index > 1) {
								return (parseInt((index - 1) * 100 / totalPage) + '%').length;
							}
							return null;
						},
						callback: function() {
							fetch(++index, totalPage, callback);
						}
					});
					// console.log('Fetch page %s data complete, totalPage: %s'.cyan.underline, index, totalPage);
				});
			});
		} else {
			console.log('');
			callback && callback(null);
		}
	}

	fetch(1, totalPage, callback);
}

function insertWithFilter(totalPage, callback) {

}

module.exports.fetchData = fetchData;