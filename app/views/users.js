Locality = Locality || {};

Locality.Views.Users = Backbone.View.extend({
	className : 'users',
	render : function () {
		var compiled = _.template($("#users-template").html());
		this.$el.html(compiled({models:this.collection.toJSON()}));
		return this.el;
	},
});