Locality = Locality || {};

Locality.Views.Users = Backbone.View.extend({
	el : '.users',
	render : function () {
		this.$el.html("Hello!");
	}
});