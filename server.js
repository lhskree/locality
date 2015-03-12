var http = require('http'),
	qs = require('querystring'),
	url = require('url'),
	fs = require('fs'),
	path = require('path'),
	port = process.argv[2];

// Create a new instance of the http server
var server = http.createServer( function (request, response) {

	// Gets the parsed url, path, and file extension
	request.route = (url.parse(request.url, true)).pathname,
	request.ext = path.extname(request.route),
	request.query = request.url.indexOf("?") !== -1 ? qs.parse(request.url.split("?")[1]) : null;

	//console.dir(request.route + " : " + request.ext + ": " + request.method);

	// EXT MAP

	request.extMap = {
	  '.ico': 'image/x-icon',
	  '.html': 'text/html',
	  '.js': 'text/javascript',
	  '.json': 'application/json',
	  '.css': 'text/css',
	  '.png': 'image/png'
	};

	// ROUTES

	// Default
	if (request.route === "\/") {
		request.route = "/index.html",
		request.ext = "html";
	}

	// REQUESTS

	if (request.method === "POST") _POST(request, response);
	if (request.method === "GET") _GET(request, response);

});

// START THE SERVER

server.listen(port);
console.log("Listening on port " + port + " . . .");


function _POST (request, response) {

	var fullBody = "";

	// Parse the request
	request.on('data', function (chunk) {
		fullBody += chunk;
		// Flood detection
		if (fullBody.length > 1e6) request.connection.destroy();
	});


	// Create or update the request
	request.on('end', function () {

		// POST ROUTES

		if (request.route == "/createUser") {

			var options = {};
			fs.stat(__dirname + '/data/data.json', function (err, stats) {
				if (err) console.error(err.message);
				if (stats) { // The file already exists
					options = { flags : 'r', encoding : 'utf-8'};
				} else { // The file does not exist
					options = { flags : 'w', encoding : 'utf-8'};
				}
			});

			var store = fs.readFile('data/data.json', function (err, data) {
				if (err) console.error(err.message); // Error reading the store !! Transition to a 404-like page or pass some error message

				// Handle error here


				var store = (data.length > 0) ? JSON.parse(data) : {};
				store.users = store.users || [];
				store.users.push(qs.parse(fullBody));
				fs.writeFile('data/data.json', JSON.stringify(store), options, function (err) {
					if (err) console.error(err.message); // <--------- Log error to the server ; Send to an error.html page

					// Handle error here




					// Success!
					// Create a read stream
					var rs = fs.createReadStream(__dirname + "/success.html");
					var fullBody = "";
					// Read the stream
					rs.on('data', function (chunk) {
						fullBody += chunk;
						// Flood detection
						if (fullBody.length > 1e6) request.connection.destroy();
					});

					// Pipe the response to the client
					rs.on('end', function () {
						response.writeHead(200, {'Content-type' : 'text/html'});
						response.end(fullBody);
					});
				});
			});
		}
	});
}

function _GET(request, response) {

	var fullBody = "";

	// ROUTES
	// This should be moved to a separate place later

	// Request for data
	if (request.query) {
		fs.stat(__dirname + '/data/data.json', function (err, stats) {
			if (err) console.error(err.message);
			if (!stats) console.error("The file is empty."); // <------ This should throw an error
		});
		var store = fs.readFile('data/data.json', function (err, data) {
				if (err) console.error(err.message); // Error reading the store !! <------ This should also throw

				// Handle error

				var store = JSON.parse(data);
				response.writeHead(200, {'Content-type' : 'application/json'});
				// All users
				if (request.query.all === 'true') response.end(JSON.stringify(store.users));
				else {
					var requestedUser;
					store.users.forEach(function(user) {
						console.log(user.first + " : " + request.query.first);
						if (user.first == request.query.first) requestedUser = user;
					});
					console.log(requestedUser);
					if (requestedUser) response.end(JSON.stringify(requestedUser));
				}
		});


	// Request for a file	
	} else {

	// Create a read stream
	var rs = fs.createReadStream(__dirname + request.route);

	// Read stream failed to read from path / 404 for html pages
	rs.on('error', function (err) {
		console.error(err.message);
		response.writeHead(404, {'Content-type' : request.extMap[request.ext]});
		if (request.ext === ".html") {
			response.end("<p>" + err.message + "</p><p>404::< " + request.route + " >::not found.</p>");
		} else {
			response.end();
		}
	});

	// Read the stream
	rs.on('data', function (chunk) {
		fullBody += chunk;
		// Flood detection
		if (fullBody.length > 1e6) request.connection.destroy();
	});

	// Pipe the response to the client
	rs.on('end', function () {
		response.writeHead(200, {'Content-type' : request.extMap[request.ext]});
		response.end(fullBody);
	});

}


}