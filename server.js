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
	  '.html' : 'text/html',
	  '.js' : 'text/javascript',
	  '.json' : 'application/json',
	  '.css' : 'text/css',
	  '.jpg' : 'image/jpg',
	  './gif' : 'image/gif',
	  '.png' : 'image/png',
	  '.ttf' : 'application/x-font-ttf',
	  '.otf' : 'application/x-font-otf'
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

	// DEBUG
	console.log(request.route);
	console.log(request.ext);

	var fullBody = "";

	// Parse the request
	request.on('data', function (chunk) {
		fullBody += chunk;
		// Flood detection
		if (fullBody.length > 1e6) request.connection.destroy();
	});

	// Create or update the request
	request.on('end', function () {

		// DEBUG
		console.log("Fullbody::" + fullBody);

		// POST ROUTES
		if (request.route == "/checkUsernameAvailability") {
			fs.readFile('data/users.json', function (err, data) {
				if (err) console.error(err.message); // HANDLE ME

				//

				var store = JSON.parse(data.toString()); // <---------------- This needs to handle if no initial data is present
				fullBody = qs.parse(fullBody);

				// Make sure the username isn't already taken
				var usernameAlreadyExists = false;
				for (var i = 0; i < store.users.length; i++) {
					if (fullBody.username.toLowerCase() === store.users[i].username.toLowerCase()) {
						console.log(fullBody.username.toLowerCase() + " : " + store.users[i].username.toLowerCase());
						usernameAlreadyExists = true;
						break;
					}
				}

				if (usernameAlreadyExists) {
					response.end("invalid");
				} else {
					response.end("valid");
				}
			});
		}

		if (request.route == "/createUser") {

			var options = {};
			fs.stat(__dirname + '/data/users.json', function (err, stats) {
				if (err) console.error(err.message);
				if (stats) { // The file already exists
					options = { flags : 'r', encoding : 'utf-8'};
				} else { // The file does not exist
					options = { flags : 'w', encoding : 'utf-8'};
				}
			});

			fs.readFile('data/users.json', function (err, data) {
				if (err) console.error(err.message); // Error reading the store !! Transition to a 404-like page or pass some error message

				// Handle error here


				// Either parse data or create blank objects / arrays
				var store = (data) ? JSON.parse(data.toString()) : {};
				store.users = store.users || [];

				// Validate data
				fullBody = qs.parse(fullBody);
				// Make sure the passwords match
				if (fullBody.password !== fullBody.password2) { // Handle this whole situation better
					console.error("Warning! Passwords don't match. Shouldn't you have validated this client-side?");
				}

				// Data is valid; create the new user
				store.users.push(fullBody);
				fs.writeFile('data/users.json', JSON.stringify(store), options, function (err) {
					if (err) console.error(err.message); // <--------- Log error to the server ; Send to an error.html page

					// Handle error here



					// Success!
					// Create a read stream and re-route to success.html
					var rs = fs.createReadStream(__dirname + "/success.html");
					fullBody = "";
					// Read the stream
					rs.on('data', function (chunk) {
						fullBody += chunk;
						// Flood detection
						if (fullBody.length > 1e6) request.connection.destroy();
					});

					// Pipe the response to the client
					rs.on('end', function () {
						response.writeHead(200, {'Content-type' : 'text/html',
							'Set-Cookie' : 'loggedin=true'}); // Set a secure cookie...this one isn't very secure but will work
						response.end(fullBody);
					});
				});
			});
		}
	});
}

function _GET(request, response) {

	// Debug the request
	/*
	console.dir(request.route);
	console.dir(request.ext);
	*/

	var fullBody = "";

	// ROUTES
	// This should be moved to a separate place later

	// Request for user data
	if (request.query) {
		fs.stat(__dirname + '/data/users.json', function (err, stats) {
			if (err) console.error(err.message);
			if (!stats) console.error("The file is empty."); // <------ This should throw an error
		});
		var store = fs.readFile('data/users.json', function (err, data) {
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

	// Handle file encoding
	var encoding = "binary"; // Default is binary
	if (request.ext === ".html") encoding = "utf-8";
	if (request.ext === ".gif") {
		encoding = "binary";
		console.dir(request.route + "::" + request.ext + "Binary encoding");
	}

	// Create a read stream
	var rs = fs.createReadStream(__dirname + request.route, {encoding: encoding});

	// Read stream failed to read from path / 404 for html pages
	rs.on('error', function (err) {
		console.error(err.message);
		response.writeHead(404, {'Content-type' : request.extMap[request.ext]});
		if (request.ext === ".html") {
			response.end("<p>" + err.message + "</p><p>404::< " + request.route + " >::not found.</p>");
		} else {
			response.end("File not found!");
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
		response.end(fullBody, encoding);
	});

}


}