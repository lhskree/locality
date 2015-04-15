Locality = Locality || {};

Locality.Views.Homepage = Backbone.View.extend({
	className : 'homepage',
	render : function () {
		var which = this;
		var compiled = _.template($("#homepage-template").html());
		this.$el.html(compiled());
		return this.el;
	},
	controller : function () {
		if (getCookie('loginerror') == "true") {
			alert("Error logging in!");
		}
		$("#shareStory").click(function (e) {
			var loggedin = getCookie('loggedin');
		  if (loggedin == "true") {
		  	console.log("Welcome, " + getCookie("username"));
		  } else {
		  	alert("Error, not logged in.");
		  	e.preventDefault();
		  }
		});
	}
});