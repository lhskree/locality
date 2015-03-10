Locality = Locality || {};

Locality.Views.User = Backbone.View.extend({
	el : ".user",
	template : "<p>Ok</p>",
	render : function (model) {
		return this.template;
	}
});