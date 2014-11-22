var fs = require('fs');
var path = require('path');

/**
 * judge the target is null
 * 
 * @param o the target
 * @returns {Boolean}
 */
function isNull(o) {
	if (o == null || o == undefined) {
		return true;
	}
	return false;
}

/**
 * judge the target is empty
 * 
 * @param o the target
 * @returns {Boolean}
 */
function isEmpty(o) {
	if (isNull(o)) {
		return true;
	}
	if (o == '') {
		return true;
	}
	return false;
}

/**
 * iterate directory
 * 
 * @param dir the target directory
 * @param dirCall directory will transfer this function
 * @param fileCall file will transfer this function
 */
function iterateDirectory(dir, dirCall, fileCall) {
	dir = dir == undefined ? './' : dir;
	fs.readdirSync(dir).forEach(function(f) {
		var pathName = path.join(dir, f).replace(/\\/g, '/').toLocaleLowerCase();

		if (fs.statSync(pathName).isDirectory()) {
			iterateDirectory(pathName, dirCall, fileCall);
			dirCall && dirCall(pathName);
		} else {
			fileCall && fileCall(pathName);
		}
	});
}

/**
 * clone a bran-new object with the target
 * 
 * @param o the target
 */
function clone(o) {
	if (null != o && typeof (o) == 'object') {
		var obj = {};
		for ( var i in o) {
			switch (typeof (eval('o.' + i))) {
			case 'object':
				if (null == eval('o.' + i)) {
					obj[i] = null;
				} else if (eval('o.' + i) instanceof Array) {
					obj[i] = new Array();
					var arr = eval('o.' + i);
					for (var j = 0; j < arr.length; j++) {
						obj[i].push(arr[j]);
					}
				} else {
					obj[i] = clone(eval('o.' + i));
				}
				break;
			case 'undefined':
				obj[i] = undefined;
				break;
			case 'string':
				obj[i] = eval('o.' + i) + '';
				break;
			case 'number':
				obj[i] = eval('o.' + i) + 0;
				break;
			case 'boolean':
				obj[i] = eval('o.' + i);
				break;
			case 'function':
				obj[i] = eval('o.' + i);
				break;
			}
		}
		return obj;
	} else {
		return o;
	}
}

/**
 * write content into the target file
 * 
 * @param path filePath's location
 * @param content what you want to write in
 * @param callback when this operation is finished, the callback function will be transfer
 */
function writeContent(path, content, callback) {
	if (null == path || path == '') {
		throw new Error('path is invalid');
	}

	content = new Buffer(content);
	var fs = require('fs');
	fs.open(path, 'a', function(e, fd) {
		if (e) {
			throw e;
		}
		fs.write(fd, content, 0, content.length, null, function(err, written) {
			if (err) {
				throw err;
			}
			callback && callback();
		});
	});
}

module.exports.isNull = isNull;
module.exports.isEmpty = isEmpty;
module.exports.iterateDirectory = iterateDirectory;
module.exports.clone = clone;
module.exports.writeContent = writeContent;