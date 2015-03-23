Locality = Locality || {};

Locality.Views.shareStory = Backbone.View.extend({
	className : 'shareStory',
	render : function () {
		var which = this;
		var compiled = _.template($("#share-story-template").html());
		this.$el.html(compiled());
		return this.el;
	}
});