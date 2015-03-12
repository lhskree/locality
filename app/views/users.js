Locality = Locality || {};

Locality.Views.Users = Backbone.View.extend({
	className : 'users',
	render : function () {
		var compiled = _.template($("#users-template").html());
		this.$el.html(compiled(this.collection));
		return this.el;
	},
});