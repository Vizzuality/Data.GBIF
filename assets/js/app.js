$(function(){
  var latlng = new google.maps.LatLng(-34.397, 150.644);
  var myOptions = {
    zoom: 8,
    center: latlng,
    disableDefaultUI: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("map"), myOptions);

//  $('.search_button, .candy_white_button, .candy_blue_button').mousedown(function() { $(this).addClass('active'); });
//  $('.search_button, .candy_white_button, .candy_blue_button').mouseup(function() { $(this).removeClass('active'); });
//  $('.search_button, .candy_white_button, .candy_blue_button').mouseleave(function() { $(this).removeClass('active'); });
});
