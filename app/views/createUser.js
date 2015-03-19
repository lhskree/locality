Locality = Locality || {};

Locality.Views.CreateUser = Backbone.View.extend({
	className : 'createUser',
	render : function () {
		var which = this;
		var compiled = _.template($("#create-user-template").html());
		this.$el.html(compiled());
		return this.el;
	}
});