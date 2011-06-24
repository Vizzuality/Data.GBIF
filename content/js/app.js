$(function(){

  var r = Raphael("holder", 620, 300);
  var values = [100, 150, 180, 150, 200, 280, 260, 270, 280, 100, 160, 120, 200, 250, 280, 230, 290, 295, 297, 250, 230, 200, 220, 190, 140, 120, 150, 290, 250];

  var y = 300;
  var path = "M0 " + y + " ";
  var p = 20;
  var i = 1;
  var h = y;

  _.each(values, function(v) {
    console.log(v);

    path += "L" + p*i + ".5 " + h + ".5, ";
    path += "L" + p*i + ".5 " + v + ".5, ";
    h = v;
    i += 1;
  });

    path += "L" + p*i + ".5 " + h + ".5, ";
    path += "L" + p*i + ".5 " + "300.5";

  console.log(path);

  //var path = "M0 300.5 L25.5 300.5, L25.5 250.5, L100.5 250.5, L100.5 200.5, L200.5 200.5, L200.5 250.5, L300.5 250.5, L300.5 300.5"
  var c = r.path(path);
  c.attr("stroke", "#ccc");
  c.attr("fill", "#f1f1f1");
  c.attr("stroke-width", "1");

  $('div.graph').each(function(index) {
    $(this).find('ul li .bar').each(function(index) {
      var width = $(this).parents("div").attr("class").replace(/graph /, "");
      $(this).parent().css("width", width);

      var value = $(this).text();

      $(this).delay(index*100).animate({ height: value }, 400, 'easeOutBounce');
    });
  });


  $('div.graph ul li a').click(function(e){
    e.preventDefault();
  });

  $("select").uniform();
  $("input[type='radio']").uniform();

  var infoWindow = (function() {
    var hidden = true;
    var $login;

    function show(id) {
      this.$login = $("#" + id);

      this.$login.css("top", ( $(window).height() - this.$login.height()) / 2+$(window).scrollTop() + "px");
      this.$login.fadeIn("slow", function() { hidden = false; });
      this.$login.draggable();
      $("body").append("<div id='lock_screen'></div>");
      $("#lock_screen").height($(document).height());
      $("#lock_screen").fadeIn("slow");
    }

    function hide(id) {
      if (hidden) {return;}
      this.$login.draggable(false);
      this.$login.fadeOut("slow");
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

  $("a.login, a.download, a.download2, a.download3").click(function(e) {
    e.preventDefault();
    infoWindow.show($(this).attr("class"));
  });


  $(".infowindow .close").click(function(e) {
    e.preventDefault();
    infoWindow.hide();
  });

  $(document).keyup(function(e) {
    if (e.keyCode == 27) { infoWindow.hide(); }   // esc
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


