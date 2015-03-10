Locality = Locality || {};

Locality.Router = Backbone.Router.extend({
	routes : {
		"" : function () {console.log("Back at home!");},
		"users" : "getUsers"
	},

	getUsers : function () {
		var users = new Locality.Models.Users();
		users.sync("READ", users).success(function (data) {
			data.forEach(function (d) {
				users.add(d);
			});
			var usersView = new Locality.Views.Users();
			usersView.render(users);
		});
	}
});