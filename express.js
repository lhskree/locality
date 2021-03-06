// REQUIRES
// =============================================
var express = require('express'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	busboy = require('connect-busboy'),
	fs = require('fs'),
	path = require('path'),
  MongoClient = require('mongodb').MongoClient,
  assert = require('assert');




// CONSTANTS
// =============================================
var DB_URL = 'mongodb://localhost:27017/geist';
var PORT = process.argv[2];









// INITIALIZATIONS
// =============================================

// Connect to MongoDB
// =============================================
MongoClient.connect(DB_URL, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server.");
  db.close();
});

// Application initialization and middleware binding
// =============================================
var app = express();
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended:false} ));
app.use(busboy());

// Server initialization
// =============================================
var server = app.listen(PORT, function () {
	console.log("Making magic happen on: %s", PORT);
});










// ROUTES
// =============================================

// USER ROUTES
// =============================================

// Get all users
app.get('/users', function (req, res) {

});


// Create a new user
app.post('/user', function (req, res) {

    var body = req.body;     

    var insertDocument = function (db, callback) {
        db.collection('users').insertOne(
            body,
            function(err, result) {
                assert.equal(err, null);
                console.log("Inserted a document into the users collection.");
                callback(result);
        });
    };
         
    MongoClient.connect(DB_URL, function(err, db) {
        assert.equal(null, err);
        insertDocument(db, function() {
            db.close();
        });
    });
    res.end(JSON.stringify(body));
});

// Adds 'id' as a dynamic parameter for GET, PUT, DELETE for a user
app.param('id', function (req, res, next, id) {
	req.id = id;
  next();
})

// Get a user
app.get('/user:id', function (req, res) {
	res.end(JSON.stringify({}));
});

// Update a user
app.put('/user:id', function (req, res) {
	res.end(JSON.stringify({}));
});

// Delet a user
app.delete('/user:id', function (req, res) {
	res.end(JSON.stringify({}));
});

// Logout
app.get('/logout', function (req, res) {
	res.cookie('loggedin', 'false');
	res.cookie('loginerror', 'false');
	res.cookie('username', 'guest');
	res.statusCode = 302;
	res.set({'Location' : '/'})
	res.end();
});

app.post('/userLogin', function (req, res) {
	userLogin(req, res);
});


function checkUsernameAvailability (req, res) {
	fs.readFile(p_data + 'users.json', function (err, data) {
		if (err) console.error(err.message); // HANDLE ME

		// If there are new users, then the first username is valid
		if (!data.toString().length) res.end("valid"); return;

		var store = JSON.parse(data.toString());
		fullBody = qs.parse(fullBody);

		// Make sure the username isn't already taken
		var usernameAlreadyExists = false;
		for (var i = 0; i < store.users.length; i++) {
			if (fullBody.username.toLowerCase() === store.users[i].username.toLowerCase()) {
				//console.log(fullBody.username.toLowerCase() + " : " + store.users[i].username.toLowerCase());
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
	fs.stat(p_data + 'users.json', function (err, stats) {
		if (err) console.error(err.message);
		if (stats) { // The file already exists
			options = { flags : 'r', encoding : 'utf-8'};
		} else { // The file does not exist
			options = { flags : 'w', encoding : 'utf-8'};
		}
	});

	fs.readFile(p_data + 'users.json', function (err, data) {
		if (err) console.error(err.message); // Error reading the store !! Transition to a 404-like page or pass some error message

		// Handle error here


		// Either parse data or create blank objects / arrays
		var store = data.toString() ? JSON.parse(data.toString()) : {};
		store.users = store.users || [];

		// Validate data
		console.log(req.body);
		console.log(req.query);
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
		fs.writeFile(p_data + 'users.json', JSON.stringify(store), options, function (err) {
			if (err) console.error(err.message); // <--------- Log error to the server ; Send to an error.html page

			// Handle error here



			
					
			res.statusCode = 302;
			res.cookie('loggedin', 'true', {'max-age':300});
			res.cookie('loginerror', 'false', {'max-age':300});
			res.cookie('username', fullBody.username);
			res.set({'Location' : '/success'})
			res.end();
		});
	});
}

function userLogin (req, res) {

	fs.readFile(p_data + 'users.json', function (err, data) {
		if (err) console.error(err.message); // HANDLE ME

		var fullBody = req.body;

		// If there are no users, you can't login
		if (data.toString().length) {

			var store = JSON.parse(data.toString());

			// Check that the username extists
			var usernameExists = false,
				passwordValid = false;
			for (var i = 0; i < store.users.length; i++) {
				console.log(fullBody.username + " (request): " + fullBody.password + "\n" + store.users[i].username + " (store):" + store.users[i].pass)
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
			res.cookie('loggedin', 'true', {'max-age':300});
			res.cookie('loginerror', 'false', {'max-age':300});
			res.cookie('username', fullBody.username);
		} else { // There should be a few more cases here for other login failures
			res.cookie('loggedin', 'false', {'max-age':300});
			res.cookie('loginerror', 'true', {'max-age':300});
		}
		res.statusCode = 302;
		res.set({'Location' : '/'})
		res.end();
	});
}

function createGeist(req, res) {
	console.log("Uploading files . . .");

	var qs = req.query;
	var cookies = req.cookies;

	// All uploads are handled by busboy middleware
	req.pipe(req.busboy);

	// Handler for individual images
	req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
		console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
		file.pipe(fs.createWriteStream(p_img + filename, { encoding : encoding }));
	});

	// When all images are received
	req.busboy.on('finish', function() {
    console.log('Done parsing form!');
    res.writeHead(303, { Connection: 'close', Location: '/' });
    res.end();
  });
}