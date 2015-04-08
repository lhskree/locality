Locality = Locality || {};

Locality.Models.User = Backbone.Model.extend({
	url : "user",
	default : {
		first : "first name",
		last : "last name",
	}
});