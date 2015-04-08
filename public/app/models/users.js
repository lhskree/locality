Locality = Locality || {};

Locality.Models.Users = Backbone.Collection.extend({
	url : "users",
	model : Locality.Models.User
});