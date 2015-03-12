Locality = Locality || {};

Locality.Router = Backbone.Router.extend({
	routes : {
		"" : function () {console.log("Back at home!");},
		"users" : "getUsers",
		"user/:first" : "getUser",
	},

	getUsers : function () {
		console.log("Transitioned to getUsers");
		var users = new Locality.Models.Users();
		users.sync("READ", users).success(function (data) {
			data.forEach(function (d) {
				users.add(d);
			});
			// Generate a new view of the users
			var usersView = new Locality.Views.Users({collection:users});
			usersView.render();
		});
	},

	getUser : function (first) {
		console.log("Transition to getUser");
		var user = new Locality.Models.User({first : first});
		user.fetch({data :{first:first}}).success(function (data) {
			console.log(data);
		});
		console.log(user);
		/*user.sync("READ", user).success(function (data) {

		});*/
	}
});