(function() {
  window.Locality = {};
  Locality.Models = {};
  Locality.Views = {};
  Locality.Controllers = {};
}());

$(document).ready(function() {

  // Auto-validation for createUser
  $(window).keyup(function() {
    if (document.URL.indexOf("new") !== -1) {
      var p1 = $("#password").val(),
        p2 = $("#password2").val();
      if (p1 !== p2) {
        console.log("Not ok.");
      }
  	}
	});

});

function validateCreateUser(form) {
  var username = $("#username").val();
  $.post("checkUsernameAvailability", {
      "username": username
    })
    .done(function(response) {
      console.log(response);
      if (response === "valid") {
        return true;
      } else {
        console.log("Username is already taken");
        return false;
      }
    })
    .fail(function() {
      console.log("Something very sad happened.");
    });
}

function getCookie(key) {
	var cookies = document.cookie.split(';');
	for (var i = 0; i < cookies.length; i++) {
		if (cookies[i].indexOf(key) !== -1) {
			return cookies[i].split("=")[1];
		}
	}
	return false;
}

function validateCreateGeist (form) {
  return true;
}