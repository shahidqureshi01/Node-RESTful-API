var http = require('http');

// Create Server
const server = http.createServer(function(req, res){
	req.end('Hello World!')
});


// Listenn on port 3000 for incoming requests
server.listen(3000,function(){
	console.log('listening on port 3000');
});