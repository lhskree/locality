Locality = Locality || {};

Locality.Views.User = Backbone.View.extend({
	el : '.user',
	tagName : 'li',
	render : function () {
		var compiled = _.template($("#userTemplate").html());
		return this.$el.html("<p>Ok</p>");
	}
});