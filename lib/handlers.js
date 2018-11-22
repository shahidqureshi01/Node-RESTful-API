/*
 * Name: handlers.js
 * Description: This file implements CRUD operations
 * Author: Shahid
 *
 */

 // Dependencies

// Add the handlers
var handlers = {};

handlers.hello = function(data,callback){
	callback(406, {hello: 'World!'});
};

handlers.notFound = function(data,callback){
	callback(404);
};

module.exports = handlers