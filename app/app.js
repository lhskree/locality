(function () {
	window.Locality = {};
	Locality.Models = {};
	Locality.Views = {};
	Locality.Controllers = {};
} ());

$(document).ready(function() {
    
// Auto-validation for createUser
$(window).keyup(function () {
    if (document.URL.indexOf("new") !== -1) {
        var p1 = $("#password").val(),
            p2 = $("#password2").val();
        if (p1 !== p2) {
            console.log("Not ok.");   
        }
    }
});

// Validation for createUser
function validateCreateUser() {
    
}
    
});