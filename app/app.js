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
$("#createUser").submit(function(e) {
    e.preventDefault();
        // Something something field validation . . .
    
    // Now check that the username isn't already taken
    $.post("checkUsernameAvailability", { username : username })
        .success(function (data) {
            console.log(data);
        })
        .failure(function () {
            console.log("The route returned a 404. Cool."); // Dingus error handling
        });

});

    
});