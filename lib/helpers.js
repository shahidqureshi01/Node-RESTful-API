/*
 * Name: helpers.js
 * Description: This file implements CRUD operations
 * Author: Shahid
 *
 */

 // Dependencies
 const crypto = require('crypto');
 const config = require('./config');

// Add the helper functons as keys 
var helpers = {};

helpers.hash = function(str) {
	if(typeof(str) == 'string' && str.length > 0) {
		const hash = crypto.createHmac('sha256', config.secret).update(str).digest('hex');
		return hash;
	} else {
		return false;
	}
}
// Function to prevent throwing up an error
helpers.parseJsonToObject = function(str) {
	try {
		let obj = JSON.parse(str);
		return obj;
	} catch(e) {
		console.log(e);
		return {};
	}
}

// Function to create random string based on length argument.
helpers.createRandomStr = function(len) {
	let alphaNums = 'abcdefghijklmnopqrstuvwxyz0123456789';
	let res = '';
	for(let i=0; i<20; i++){
		res += alphaNums.charAt(Math.floor(Math.random() * alphaNums.length));
	}
	return res;
}


module.exports = helpers