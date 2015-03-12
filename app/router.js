Locality = Locality || {};

Locality.Router = Backbone.Router.extend({
	routes : {
		"" : function () {console.log("Back at home!");},
		"users" : "getUsers"
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
	}
});