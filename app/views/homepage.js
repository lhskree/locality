Locality = Locality || {};

Locality.Views.Homepage = Backbone.View.extend({
	className : 'homepage',
	render : function () {
		var which = this;
		var compiled = _.template($("#homepage-template").html());
		this.$el.html(compiled());
		return this.el;
	}
});