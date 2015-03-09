var User = Backbone.Model.extend({
	url : "/",
	default : {
		collection : "Users",
		firstName : "first name",
		lastName : "last name"
	}
});

var logan = new User({ firstName : "Logan", lastName : "Sobczak" });
var lauren = new User({ firstName : "Lauren", lastName : "McLeod" });

var Users = Backbone.Collection.extend({
	url : "/",
	model : User
});

var users = new Users([logan, lauren]);
users.sync("create", users);