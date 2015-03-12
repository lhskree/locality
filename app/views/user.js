Locality = Locality || {};

Locality.Views.User = Backbone.View.extend({
	className : 'user',
	tagName : 'li',
	render : function () {
		var which = this;
		console.log(which.model.toJSON());
		var compiled = _.template($("#userTemplate").html());
		return this.$el.addClass(this.className).html(compiled(which.model.toJSON()));
	}
});