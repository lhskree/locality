var http = require('http'),
	qs = require('querystring'),
	url = require('url'),
	fs = require('fs'),
	path = require('path'),
	port = process.argv[2];

// Create a new instance of the http server
var server = http.createServer( function (request, response) {

	// Gets the parsed url, path, and file extension
	var parsedURL = url.parse(request.url, true),
		pathname = parsedURL.pathname,
		ext = path.extname(pathname).replace(".","");

	if (request.method === "POST") {
		var fullBody = "";

		// Parse the request
		request.on('data', function (chunk) {
			fullBody += chunk;
			// Flood detection
			if (fullBody.length > 1e6) request.connection.destroy();
		});

		// Save the request
		request.on('end', function () {
			var post = fullBody,
				options = {};
			fs.stat(__dirname + '/data/data.json', function (err, stats) {
				if (err) console.error(err.message);
				if (stats) { // The file already exists
					options = { flags : 'r', encoding : 'utf-8'};
				} else { // The file does not exist
					options = { flags : 'w', encoding : 'utf-8'};
				}
			});
			// Add to existing data
			var store = fs.readFile('data/data.json', function (err, data) {
				if (err) console.error(err.message); // Error reading the store !!
				// Handle error
				var store = JSON.parse(data);
				console.log(JSON.parse(post));
				store.users = [];
				store.users.push(post);
				fs.writeFile('data/data.json', JSON.stringify(store), options, function (err) {
					if (err) console.error(err.message);
				});
			});
		});
	}
	// The default route
	if (pathname === "\/") {
		pathname = "/index.html",
		ext = "html";
	}

	var map = {
	  '.ico': 'image/x-icon',
	  '.html': 'text/html',
	  '.js': 'text/javascript',
	  '.json': 'application/json',
	  '.css': 'text/css',
	  '.png': 'image/png'
	};

	// Create a read stream
	var rs = fs.createReadStream(__dirname + pathname);

	 // Read stream failed to read from path / 404 for html pages
	rs.on('error', function (err) {
		console.error(err.message);
		if (ext === "html") {
			response.writeHead(404, {'Content-type': map[ext]});
			response.end("<p>" + err.message + "</p><p>404::< " + pathname + " >::not found.</p>");
		} else {
			response.writeHead(404);
			response.end();
		}
	});

	// Pipe the response to the client
	rs.pipe(response);
});

server.listen(port);
console.log("Listening on port " + port + " . . .");