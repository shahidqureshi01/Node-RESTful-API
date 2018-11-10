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
		// Send the response
		res.end('Hello World!\n');
		console.log('request received with this payload ' + buffer);
	});

});


// Listenn on port 3000 for incoming requests
server.listen(3000,function(){
	console.log('listening on port 3000');
});