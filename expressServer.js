var express = require('express'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	fs = require('fs'),
	qs = require('querystring'),
	path = require('path'),
	port = process.argv[2];

var app = express();


app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:false}));

var server = app.listen(port, function () {

	var host = server.address().address;
	var port = server.address().port;

	console.log("Listening on:%s", port);

});

// All users
app.get('/users', function (req, res) {

	fs.stat(__dirname + '/public/data/users.json', function (err, stats) {
		if (err) console.error("Error getting stats on the file: " + err.message);
		if (!stats) console.error("The file is empty."); // <------ This should throw an error
	});
	
	fs.readFile(__dirname + '/public/data/users.json', function (err, data) {
		if (err) console.error("Error reading the store: " + err.message); // Error reading the store !! <------ This should also throw

		// Handle error

		var store = JSON.parse(data);
		res.status(200);
		res.set({'Content-type' : 'application/json'});
		res.end(JSON.stringify(store.users));
	});
});

// Single user
app.get('/user', function (req, res) {

	fs.stat(__dirname + '/public/data/users.json', function (err, stats) {
		if (err) console.error("Error getting stats on the file: " + err.message);
		if (!stats) console.error("The file is empty."); // <------ This should throw an error
	});
	
	fs.readFile(__dirname + '/public/data/users.json', function (err, data) {
		if (err) console.error("Error reading the store: " + err.message); // Error reading the store !! <------ This should also throw

		// Handle error

		var store = JSON.parse(data);
		var requestedUser;
		store.users.forEach(function(user) {
			console.log(user.first + " : " + req.query.first);
			if (user.first == req.query.first) requestedUser = user;
		});
		if (requestedUser) res.end(JSON.stringify(requestedUser));
	});
});

app.post('/checkUsernameAvailability', function (req, res) {
	checkUsernameAvailability(req, res)
});

app.post('/createUser', function (req, res) {
	createUser(req, res);
});
		
app.post('/userLogin', function (req, res) {
	userLogin(req, res);
});


function checkUsernameAvailability (req, res) {
	fs.readFile('data/users.json', function (err, data) {
		if (err) console.error(err.message); // HANDLE ME

		// If there are new users, then the first username is valid
		if (!data.toString().length) res.end("valid"); return;

		var store = JSON.parse(data.toString());
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
			res.end("invalid");
		} else {
			res.end("valid");
		}
	});
}

function createUser(req, res) {
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
		var store = data.toString() ? JSON.parse(data.toString()) : {};
		store.users = store.users || [];

		// Validate data
		fullBody = qs.parse(fullBody);
		// Make sure the passwords match
		if (fullBody.password !== fullBody.password2) { // Handle this whole situation better
			console.error("Warning! Passwords don't match. Shouldn't you have validated this client-side?");
		}

		// Data is valid; create the new user
		var user = {};
		user.username = fullBody.username,
		user.first = fullBody.first,
		user.last = fullBody.last,
		user.pass = fullBody.password,
		user.bio = fullBody.bio,
		user.creationDate = Date.now();

		store.users.push(user);
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

			// Pipe the res to the client
			rs.on('end', function () {
				res.writeHead(200, {'Content-type' : 'text/html',
					'Set-Cookie' : 'loggedin=true', // Set a secure cookie...this one isn't very secure but will work
					'Set-Cookie' : 'username=' + user.username});
				res.end(fullBody);
			});
		});
	});
}

function userLogin (req, res) {

	fs.readFile(__dirname + '/public/data/users.json', function (err, data) {
		if (err) console.error(err.message); // HANDLE ME

		var fullBody = req.body;

		// If there are no users, you can't login
		if (data.toString().length) {

			var store = JSON.parse(data.toString());

			// Check that the username extists
			var usernameExists = false,
				passwordValid = false;
			for (var i = 0; i < store.users.length; i++) {
				console.log(fullBody.username + " :" + fullBody.password + "\n" + store.users[i].username + " :" + store.users[i].pass)
				if (fullBody.username === store.users[i].username) {
					usernameExists = true;
					if (fullBody.password === store.users[i].pass) {
						passwordValid = true;
						break;
					}
					break;
				}
			}
		}

		var loginCookie, validCookie;
		if (usernameExists && passwordValid) {
			res.cookie('loggedin', 'true');
			res.cookie('loginerror', 'false');
			res.cookie('username', fullBody.username);
		} else { // There should be a few more cases here for other login failures
			res.cookie('loggedin', 'false');
			res.cookie('loginerror', 'true');
		}
		res.statusCode = 302;
		res.set({'Location' : '/'})
		res.end();
	});
}