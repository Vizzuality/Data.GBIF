$(function(){
  $("select").uniform();

  var loginWindow = (function() {
    var hidden = true;
    var $login = $("#login");

    function show() {
      $login.css("top", ( $(window).height() - $login.height()) / 2+$(window).scrollTop() + "px");
      $login.fadeIn("slow", function() { hidden = false; });
      $login.draggable();
      $("body").append("<div id='lock_screen'></div>");
      $("#lock_screen").height($(document).height());
      $("#lock_screen").fadeIn("slow");
    }

    function hide() {
      if (hidden) {return;}
      $login.draggable(false);
      $login.fadeOut("slow");
      $("#lock_screen").fadeOut("slow", function() {
        hidden = true;
        $("#lock_screen").remove();
      });
    }

    return {
      show: show,
      hide: hide
    };
  })();

  $("a.login").click(function(e) {
    e.preventDefault();
    loginWindow.show();
  });

  $("#login .close").click(function(e) {
    e.preventDefault();
    loginWindow.hide();
  });

  $(document).keyup(function(e) {
    if (e.keyCode == 27) { loginWindow.hide(); }   // esc
  });

  if ($("#map").length ) {
    var latlng = new google.maps.LatLng(-34.397, 150.644);
    var myOptions = {
      zoom: 8,
      center: latlng,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map"), myOptions);
  }
  //  $('.search_button, .candy_white_button, .candy_blue_button').mousedown(function() { $(this).addClass('active'); });
  //  $('.search_button, .candy_white_button, .candy_blue_button').mouseup(function() { $(this).removeClass('active'); });
  //  $('.search_button, .candy_white_button, .candy_blue_button').mouseleave(function() { $(this).removeClass('active'); });
});
