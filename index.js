// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

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
			message = typeof(message) == 'string' ? message : '';

			// Send the response
			res.writeHead(statusCode);
			res.end(message);

			// Log the response 
			console.log('Sent this response ', statusCode, message);

		});

	});

});


// Listenn on port 3000 for incoming requests
server.listen(3000,function(){
	console.log('listening on port 3000');
});

// Add the handlers
var handlers = {};

handlers.hello = function(data,callback){
	callback(406, 'Hello World!');
};

handlers.notFound = function(data,callback){
	callback(404);
};





