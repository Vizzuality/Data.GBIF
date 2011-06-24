$(function(){

  var width = $("#holder").width();
  var height = 180;

  var r = Raphael("holder", width, height + 57);
  var values = [5, 2, 4, 20, 10, 5, 6, 33, 3, 10, 5, 4];

  var last = 0;

  for (var i=0; i<=100; i++) {
    if (Math.random()*100 > 90) {
      values[i] = Math.floor(Math.random()*20);
    } else {
      values[i] = last;
    }
    last = values[i];
  }

  var max = _.max(values);
  var normalized_values = _.map(values, function(v) { return height - Math.round(v  * height/max); });

  var step  = Math.round(width / values.length);
  var rstep = step*values.length - width;

  console.log(step, step*values.length, width, rstep);

  var lines = [];
  var fonts = [];

  var path  = "M0 " + height + " ";

  var previous_value = height;
  var template =  _.template("L<%= xpos %>.5 <%= old_ypos %>.5, L<%= xpos %>.5 <%= ypos %>.5,");

  _.each(normalized_values, function(value, index) {
    path += template({xpos:step*index, ypos:value, old_ypos:previous_value});
    previous_value = value;
  });

  path += template({xpos:width-1, ypos:height, old_ypos:previous_value});
  var c = r.path(path);
  c.attr("stroke", "#D9D9D9");
  c.attr("stroke-width", "1");

  var z = Math.round(width / 12);

  for (i = 0; i<12; i++) {
    var line = r.path("M"+z*i+".5 450.5 L"+z*i+".5 0");
    console.log(line);
    line.attr("stroke", "#D9D9D9");
  }
    var line = r.path("M"+(width-1)+".5 450.5 L"+(width-1)+".5 0");
    line.attr("stroke", "#D9D9D9");

  //var line = r.path("M"+(step*index + step/2)+" " + height + " L"+ (step*index + step/2)+ " " + (normalized_values[index]+1)+".5");
  //line.attr("stroke", "#ccc");

  _.each(normalized_values, function(value, index) {
      var rect = r.rect(step*index + ".5", value + ".5", step, height - value + 20);

    rect.attr("fill-opacity", ".08");
    rect.attr("fill", "#000");
    rect.attr("stroke-width", "0");

    rect.hover(function (event) {
      this.attr({fill: "#D9D9D9"});
    }, function (event) {
      delete fonts[index];
      this.attr({fill: "#000"});
      //this.animate({fill: "#000"}, 300);
    });
  });

  //  c.attr("stroke", "#D9D9D9");
  //  c.attr("stroke-width", "1");
  //_.each(normalized_values, function(value, index) {
  //  var c = r.path(path);
  //  var rect = r.rect(step*index + ".5", value + ".5", step+".5", height);

  //  rect.attr("fill", "#f1f1f1");
  //  rect.attr("stroke-width", "0");

  //  rect.click(function() {
  //    alert(values[index]);
  //  });

  //});

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


