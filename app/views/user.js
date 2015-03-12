Locality = Locality || {};

Locality.Views.User = Backbone.View.extend({
	className : 'user',
	tagName : 'li',
	render : function () {
		var which = this;
		var compiled = _.template($("#user-template").html());
		this.$el.addClass(this.className).html(compiled(which.model.toJSON()));
		return this.el;
	}
});