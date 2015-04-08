Locality = Locality || {};

Locality.Views.UserLogin = Backbone.View.extend({
	className : 'userLogin',
	render : function () {
		var which = this;
		var compiled = _.template($("#user-login-template").html());
		this.$el.html(compiled());
		return this.el;
	}
});