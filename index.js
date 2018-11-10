// Dependencies
var http = require('http');
var url = require('url');

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

	// Send the response
	res.end('Hello World!\n');

	// Log the request details
	console.log('Request received on path : ' + trimmedPath + ' with method ' + method + ' with query string' + JSON.stringify(queryStrObj));
});


// Listenn on port 3000 for incoming requests
server.listen(3000,function(){
	console.log('listening on port 3000');
});