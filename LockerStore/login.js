var userID;
var autocomplte, autocompleteLsr;
$(document).ready(function () {
  addAutocomplete();
});
function addAutocomplete() {
  autocomplete = new google.maps.places.Autocomplete(document.getElementById('location'));
  autocomplete.setFields(
    ['address_components', 'geometry', 'icon', 'name']);
  autocompleteLsr = autocomplete.addListener('place_changed', function () {
    // var place = autocomplete.getPlace();
    // if (!place.geometry) {
    //     // User entered the name of a Place that was not suggested and
    //     // pressed the Enter key, or the Place Details request failed.
    //     window.alert("No details available for input: '" + place.name + "'");
    //     return;
    // }
  });

}
function removeAutocomplete() {
  google.maps.event.removeListener(autocompleteLsr);
  google.maps.event.clearInstanceListeners(autocomplete);
  $(".pac-container").remove();
}
function SwitchToVerify() {
  $('.screen').css("display", "none");
  $('#page-verify').css("display", "block");
}
function SwitchToCreditcard() {
  $('.screen').css("display", "none");
  $('#page-credit-card').css("display", "block");
}
function SwitchToSigninAccount() {
  $('.screen').css("display", "none");
  $('#page-sign-in-account').css("display", "block");
}
function SwitchToSignup() {
  $('.screen').css("display", "none");
  $('#page-sign-up').css("display", "block");
}
function SwitchToLocate() {
  $('.screen').css("display", "none");
  $('#page-locate').css("display", "block");
}
function SwitchToSigninPassword() {
  $('.screen').css("display", "none");
  $('#page-sign-in-password').css("display", "block");
}
function SwitchToSigninVerify() {
  $('.screen').css("display", "none");
  $('#page-sign-in-verify').css("display", "block");
}

$('#send-locate').click(function (e) {
  e.preventDefault();
  if (!$('#location').val()) {
    event.preventDefault();
    alert("您尚未輸入地址");
  }
  else {
    $.get('/getNewID', {
      msg: "Get"
    }, (data) => {
      $('#userID').attr('value', data);
      $('#searchBar').submit();
    })

  }
});

