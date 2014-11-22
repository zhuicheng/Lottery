/**
 * calculate date
 * 
 * @param day the target, it can less than zero, but it must be a INTEGER
 * @returns {Date}
 */
Date.prototype.addDay = function(day) {
	if (null == day || isNaN(day)) {
		return this;
	}
	this.setDate(this.getDate() + day);
	return this;
};

/**
 * judge the target in Array
 * 
 * @param o the target
 * @returns {Boolean}
 */
Array.prototype.contains = function(o) {
	var flag = false;
	for (var i = 0; i < this.length; i++) {
		if (this[i] == o) {
			flag = true;
			break;
		}
	}
	return flag;
};

/**
 * trim blank character
 * 
 * @returns
 */
Object.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, '');
}