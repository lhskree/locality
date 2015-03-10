Locality = Locality || {};

Locality.Views.Users = Backbone.View.extend({
	el : '.users',
	render : function (collection) {
		this.$el.html(this.renderChildren(collection));
	},
	renderChildren : function (collection) {
		var which = this;
		collection.models.forEach(function (model) {
			var userView = new Locality.Views.User();
			which.$el.append(userView.render(model));
		});
	}
});