Locality = Locality || {};

Locality.Views.fileUpload = Backbone.View.extend({
	className : 'fileUpload',
	render : function () {
		var which = this;
		var compiled = _.template($("#file-upload-template").html());
		this.$el.html(compiled());
		return this.el;
	}
});