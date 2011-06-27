$(function(){

  var dataHistory = (function() {
    var width, height, canvas, fillColor, fillOpacity, strokeColor, strokeOpacity, strokeWidth;
    var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DEC"];
    var template =  _.template("L<%= xpos %>.5 <%= old_ypos %>.5, L<%= xpos %>.5 <%= ypos %>.5,");
    var processes = {};
    var max, step, leftover;
    var normalized_values = [];

    function initialize(opt) {
      width  = $("#holder").width();
      height = opt.height || 180;

      fillColor     = opt.fillColor || "#000000";
      fillOpacity   = opt.fillOpacity || ".08";
      strokeColor   = opt.strokeColor || "#D9D9D9";
      strokeOpacity = opt.strokeOpacity || ".08";
      strokeWidth   = opt.strokeWidth || "1";
      processes     = {} || opt.processes;

      canvas = Raphael("holder", width, height + 57);

      max = _.max(values);
      normalized_values = _.map(values, function(v) { return height - Math.round(v  * height/max); });

      step     = Math.floor(width / values.length);
      leftover = Math.round(Math.abs(step*values.length - width) / 2);
    }

    function drawLine() {
      var path  = "M0 " + height + " ";
      var previous_value = height;

      _.each(normalized_values, function(value, index) {
        path += template({xpos:step*index, ypos:value, old_ypos:previous_value});
        previous_value = value;
      });

      path += template({xpos:step*values.length, ypos:height, old_ypos:previous_value});

      var shape = canvas.path(path);
      shape.attr("stroke", strokeColor);
      shape.attr("stroke-width", strokeWidth);
    }

    function drawMonthLines() {
      var monthWidth = Math.round(step*values.length / 12);

      for (i = 0; i < 12; i++) {
        var line = canvas.path("M"+monthWidth*i+".5 450.5 L"+monthWidth*i+".5 0");
        line.attr("stroke", "#D9D9D9");
        var month = canvas.text(monthWidth*i + Math.round(monthWidth/2), height + 50, months[i]);
        month.attr("fill", "#ccc");
      }

      var line = canvas.path("M"+(step*values.length)+".5 450.5 L"+(step*values.length)+".5 0");
      line.attr("stroke", "#D9D9D9");
    }

    function drawRects() {
      _.each(normalized_values, function(value, index) {
        var rect = canvas.rect(step*index + ".5", value + ".5", step, height - value + 20);

        rect.attr("fill-opacity", fillOpacity);
        rect.attr("fill", fillColor);
        rect.attr("stroke-width", "0");

        rect.hover(function (event) { this.attr({fill: "#D9D9D9"}); }, function (event) { this.attr({fill: "#000"}); });
      });
    }

    function drawGraph(values) {
      drawLine();
      drawMonthLines();
      drawRects();
    }

    return {
      initialize: initialize,
      show: drawGraph
    };
  })();

  function generateRandomValues(limit) {
    var last = 0;
    var values = [];

    for (var i=0; i<=limit; i++) {
      if (Math.random()*100 > 90) {
        values[i] = Math.floor(Math.random()*20);
      } else {
        values[i] = last;
      }
      last = values[i];
    }
    return values;
  }
  var values = generateRandomValues(65);

  var processes = { dates:[{start:"10/02", end: "10/02"}, {start:"13/02", end: "12/02"}, {start:"14/02"}] };

  dataHistory.initialize({height: 180, processes: processes});
  dataHistory.show(values);

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


