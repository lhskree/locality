Locality = Locality || {};

Locality.Models.User = Backbone.Model.extend({
	collection : Locality.Models.Users,
	url : "user",
	default : {
		first : "first name",
		last : "last name",
	}
});