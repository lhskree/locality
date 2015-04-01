Locality = Locality || {};

Locality.Router = Backbone.Router.extend({
	routes : {
		"" : "homepage",
		"share" : "shareStory",
		"login" : "userLogin",
		"new" : "createUser",
		"users" : "getUsers",
		"user/:first" : "getUser",
	},

	homepage : function () {
		console.log("Back at home!");
		var home = new Locality.Views.Homepage();
		$("#outlet").html(home.render());
	},

	shareStory : function () {
		console.log("Sharing a new story!");
		var shareStory = new Locality.Views.shareStory();
		$("#outlet").html(shareStory.render());
	},

	createUser : function () {
		console.log("Creating a new user!");
		var createUser = new Locality.Views.CreateUser();
		$("#outlet").html(createUser.render());
	},

	getUsers : function () {
		console.log("Transitioned to getUsers");
		var users = new Locality.Models.Users();
		users.fetch({data:{all:true}}).success(function (data) {
			// Generate a new view of the users
			var usersView = new Locality.Views.Users({collection:users});
			$("#outlet").html(usersView.render());
		});
	},

	getUser : function (first) {
		console.log("Transition to getUser");
		var user = new Locality.Models.User({first : first});
		user.fetch({data:{first:first}}).success(function (data) {
			var userView = new Locality.Views.User({model:user});
			$("#outlet").html(userView.render());
		});
	},

	userLogin : function () {
		console.log("Transitioned to userLogin");
		var userLogin = new Locality.Views.UserLogin();
		$("#outlet").html(userLogin.render());
	}

});