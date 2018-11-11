// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');

// Create Server
const server = http.createServer(function(req, res){

	// Get the URL and parsed it
	let parsedUrl = url.parse(req.url, true);

	// Get the path from Parsed url
	path = parsedUrl.pathname;

	// Remove '/' from either side with RegEx
	let trimmedPath = path.replace(/^\/+|\/+$/g, '');

	// Get the http method
	let method = req.method.toLowerCase();

	// Get the query string object 
	let queryStrObj = parsedUrl.query;

	// Get the header 
	let headers = req.headers;

	// Get the payload
	let decoder = new StringDecoder('utf-8');
	let buffer = '';

	req.on('data', function(data){
		buffer += decoder.write(data);
	});

	req.on('end', function(){
		buffer += decoder.end();

		// Determine the chosen handler
		let chosenHandler = typeof(handlers[trimmedPath]) !== 'undefined' ? handlers[trimmedPath] : handlers.notFound;

		// construct the data object 
		let data = {
			trimmedPath,
			queryStrObj,
			method,
			payload: buffer,
		};

		chosenHandler(data, function(statusCode, message){
			
			// Check if the status code is a number
			statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
			
			// Check if the message was an object
			message = typeof(message) == 'object' ? message : {};
			let messageStr = JSON.stringify(message)

			// Send the response
			res.setHeader('Content-Type', 'application/json');
			res.writeHead(statusCode);
			res.end(messageStr);

			// Log the response 
			console.log('Sent this response ', statusCode, messageStr);

		});

	});

});


// Listenn on port 3000 for incoming requests
server.listen(config.port,function(){
	console.log('listening on port ' + config.port);
});

// Add the handlers
var handlers = {};

handlers.hello = function(data,callback){
	callback(406, {hello: 'World!'});
};

handlers.notFound = function(data,callback){
	callback(404);
};





