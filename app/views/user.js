Locality = Locality || {};

Locality.Views.User = Backbone.View.extend({
	el : '.user',
	tagname : 'li',
	template : _.template,
	render : function () {
		this.$el.html("ok");
		//this.$el.html(this.template($("#userTemplate").html(), this.model));
		console.log(this.$el);
		return this.$el;
	}
});