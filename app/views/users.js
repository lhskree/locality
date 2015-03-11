Locality = Locality || {};

Locality.Views.Users = Backbone.View.extend({
	el : '.users',
	render : function () {
		var which = this;
		this.$el.empty();
		this.collection.models.forEach(function (user) {
			var userView = new Locality.Views.User({model:user});
			which.$el.append(userView.render());
		});
	}
});