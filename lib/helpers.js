/*
 * Name: helpers.js
 * Description: This file implements CRUD operations
 * Author: Shahid
 *
 */

 // Dependencies
const crypto = require('crypto');
const config = require('./config');
const https = require('https');
const querystring = require('querystring');

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


helpers.createOrder = function(amount, callback){
	// Test if amount is number and substantial amount
	amount = typeof amount == 'number' && amount > 0.5 ? amount : false;
	if(amount) {
		// Create the options object
		let options = {
			amount,
			currency: 'usd',
			protocol: 'https:',
			hostname: 'api.stripe.com',
			path: '/v1/charges',
			source: 'tok_mastercard',
			auth: 'sk_test_lMASmWiQ0rWZxSx9iGeSWASS',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			}
		}

		 // Instantiate the request object
    let req = https.request(options, function(res){
        // Grab the status of the sent request
        let status =  res.statusCode;
        // Callback successfully if the request went through
        if(status == 200 || status == 201){
          callback(false);
        } else {
          callback(status);
        }
    });
    // If error occured
    req.on('error', function(e){
    	callback(e);
    });

    req.end();
	}
} 






module.exports = helpers