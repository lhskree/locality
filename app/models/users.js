Locality = Locality || {};

Locality.Models.Users = Backbone.Collection.extend({
	url : "/read/Users",
	model : Locality.Models.User
});