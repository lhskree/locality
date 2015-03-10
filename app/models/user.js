Locality = Locality || {};

Locality.Models.User = Backbone.Model.extend({
	url : "read/User",
	default : {
		first : "first name",
		last : "last name"
	}
});