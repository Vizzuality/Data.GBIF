var is_ie = $.browser.msie;

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};


$(function(){
  var values = generateRandomValues(365);
  var processes = { dates:[
    {start:"2011-1-1", end: "2011-2-11"},
    {start:"2011-3-1"}
  ]};

  if ($("#holder").length ) {
    dataHistory.initialize(values, {height: 180, processes: processes});
    dataHistory.show();
  }

  $('div.graph').each(function(index) {
    $(this).find('ul li .bar').each(function(index) {
      var width = $(this).parents("div").attr("class").replace(/graph /, "");
      $(this).parent().css("width", width);

      var value = $(this).text();

      $(this).delay(index*100).animate({ height: value }, 400, 'easeOutBounce');
    });
  });

  $('.dropdown').click(function(e){
    e.preventDefault();
    $(this).toggleClass("selected");
  });

  $('div.graph ul li a').click(function(e){
    e.preventDefault();
  });

  $("select").uniform();

  var infoWindow = (function() {
    var displayed = false;
    var $login;
    var el;

    function toggle(e, event) {
      event.stopPropagation();
      event.preventDefault();
      el = $("#"+e);
      displayed ? hide(): show();
    }

    function show() {
      el.find(".close").click(function(event) {
        event.preventDefault();
        displayed && hide();
      });

      el.click(function(event) {
        event.stopPropagation();
      });

      $('html').click(function() {
        displayed && hide();
      });

      el.css("top", ( $(window).height() - el.height()) / 2+$(window).scrollTop() + "px");
      el.fadeIn("slow", function() { hidden = false; });
      el.draggable();
      $("body").append("<div id='lock_screen'></div>");
      $("#lock_screen").height($(document).height());
      $("#lock_screen").fadeIn("slow");
      displayed = true;
    }

    function hide(id) {
      el.find('a.close').unbind("click");
      $('html').unbind("click");
      el.draggable(false);
      el.fadeOut("slow");
      $("#lock_screen").fadeOut("slow", function() { displayed = false; $("#lock_screen").remove(); });
    }

    return {
      toggle: toggle,
      hide: hide
    };
  })();

  //$.fn.bindFilterPopover = function(opt) {
  //  $(this).live("click", function(event) {
  //    var c = filterPopover();
  //    c.toggle($(this), event, opt);
  //  });
  //};

  $.fn.bindDownloadPopover = function(opt) {
    $(this).click(function(event) {
      downloadPopover.toggle($(this), event, opt);
    });
  };

  $.fn.bindLoginPopover = function(opt) {
    $(this).click(function(event) {
      loginPopover.toggle($(this), event, opt);
    });
  };

  $.fn.bindSortPopover = function() {
    $(this).click(function(event) {
      sortPopover.toggle($(this), event);
    });
  };

  $.fn.bindLinkPopover = function(opt) {
    $(this).click(function(event) {
      linkPopover.toggle($(this), event, opt);
    });
  };

  $.fn.bindHelpPopover = function(opt) {
    $(this).click(function(event) {
      helpPopover.toggle($(this), event, opt);
    });
  };

  $.fn.bindDatePopover = function() {
    $(this).click(function(event) {
      datePopover.toggle($(this), event);
    });
  };

  // Bindings
  var c = filterPopover();
  $("a.filter").click(function(event){
    c.toggle($(this), event);
  });

  $("a.add_more").live("click", function(event) {
    event.stopPropagation();
    event.preventDefault();
    c.toggle($(this), event);
  });

  $("time.selectable").bindDatePopover();
  $("a.help").bindHelpPopover({title:"Hi, I'm a yellow popover", message:"This is a <strong>message</strong> with a <a href='http://www.gbif.org/'>link</a>."});
  $("a.download").bindDownloadPopover({explanation:"Occurrences of \"Puma concolor\", collected between Jan 1sr, 2000 and Jan 1st, 2010, from dataset \"Felines of the world\"."});
  $("a.download_2").bindDownloadPopover({template: "direct_download", explanation:"Occurrences of \"Puma concolor\", collected between Jan 1sr, 2000 and Jan 1st, 2010, from dataset \"Felines of the world\"."});
  $("a.login").bindLoginPopover();

  $('.sort').bindSortPopover();


//$(".autocomplete input").autocomplete({
//  close: function(event, ui) {
//  },
//  create: function(event, ui) {
//    $(".ui-autocomplete").append("<div class='inner'></div>");
//  },
//  open: function(event, ui) {
//
//    $("ul.ui-autocomplete").find("li:first-child").addClass("first");
//
//        //$('.ui-autocomplete .inner').addClass('scroll-pane').jScrollPane();
//       // $('.jScrollPaneContainer').css({
//       //   'position': 'absolute',
//       //   'top': ($(this).offset().top + $(this).height() + 5) + 'px',
//       //   'left': $(this).offset().left + 'px'
//       // });
//
//
//  },
//  source: [ { label: 'Puma Concolor', desc: 'Species' }, { label: 'Puma Concolor Mexicanensis', desc: 'Subspecies'}, { label: 'Puma Concolor', desc: 'Family '} ]
//}).data("autocomplete")._renderItem = function(ul, item) {
//  return $("<li></li>").data("item.autocomplete", item).append("<a>" + item.label + "</a>" + item.desc).appendTo(ul);
//};

  $(document).keyup(function(e) {
    if (e.keyCode == 27) { // esc key
      downloadPopover.hide();
    }
  });

  $('span.input_text input').focus(function() {
    $(this).parent().addClass("focus");
  });

  $('span.input_text input').focusout(function() {
    $(this).parent().removeClass("focus");
  });

  $('.select-box div.selected_option').click(function(e) {
    selectBox.toggle($(this).parent(), e);
  });

  $( "#slider-range" ).slider({
    range: true,
    min: 0,
    max: 500,
    values: [ 75, 300 ],
    slide: function( event, ui ) {
      $( "#range" ).val( "BETWEEN " + ui.values[ 0 ] + " AND " + ui.values[ 1 ] );
    }
  });

  $( "#range" ).val( "BETWEEN " + $( "#slider-range" ).slider( "values", 0 ) + " AND " + $( "#slider-range" ).slider( "values", 1 ) );

  $.fn.bindSlideshow = function(opt) {
    var $this = $(this);
    var photo_width = 627;
    var currentPhoto = 0;
    var num_of_photos = $this.find("div.photos > img").length - 1;
    var downloads = $this.find("div.download a");

    var $previous_button = $this.find(".previous_slide");
    var $next_button = $this.find(".next_slide");

    $previous_button.addClass("disabled");

    $this.find(".photos").width(num_of_photos*photo_width);

    $previous_button.click(function(event) {
      event.preventDefault();
      if (currentPhoto > 0) {
        $next_button.removeClass("disabled");
        $this.find('.slideshow').scrollTo('-=627px', 500,{easing:'easeOutQuart', axis:'x'});
        $(downloads[currentPhoto]).parent().hide();
        currentPhoto--;
        $(downloads[currentPhoto]).parent().show();

        if (currentPhoto == 0) {
          $previous_button.addClass("disabled");
        }
      }
    });

    $next_button.click(function(event) {
      event.preventDefault();
      if (currentPhoto < num_of_photos) {
        $previous_button.removeClass("disabled");

        $this.find('div.content div.slideshow').scrollTo("+=627px", 500, {easing:'easeOutQuart', axis:'x'});
        $(downloads[currentPhoto]).parent().hide();
        currentPhoto++;
        $(downloads[currentPhoto]).parent().show();

        if (currentPhoto >= num_of_photos) {
          $next_button.addClass("disabled");
        }

      }
    });
  };

  $("article#slideshow-1").bindSlideshow();

  function generateRandomValues2(limit) {
    var last = 0;
    var values = [];

    for (var i=0; i<=limit; i++) {
        values[i] = Math.floor(Math.random()*20);
    }
    return values;
  }

  var values = generateRandomValues2(365);


  function drawGraph(ob, data, opt) {
    var container_id = ob.attr("id");

    function getAnchors(p1x, p1y, p2x, p2y, p3x, p3y) {
        var l1 = (p2x - p1x) / 2, l2 = (p3x - p2x) / 2;
        var a = Math.atan((p2x - p1x) / Math.abs(p2y - p1y));
        var b = Math.atan((p3x - p2x) / Math.abs(p2y - p3y));

        a = p1y < p2y ? Math.PI - a : a;
        b = p3y < p2y ? Math.PI - b : b;

        var alpha = Math.PI / 2 - ((a + b) % (Math.PI * 2)) / 2;
        var dx1 = l1 * Math.sin(alpha + a);
        var dy1 = l1 * Math.cos(alpha + a);
        var dx2 = l2 * Math.sin(alpha + b);
        var dy2 = l2 * Math.cos(alpha + b);

        return {
            x1: p2x - dx1,
            y1: p2y + dy1,
            x2: p2x + dx2,
            y2: p2y + dy2
        };
    }

    if (!opt) {
      var opt = {};
    }

    // Dimensions
    var width = $("#"+container_id).width();
    var height = opt.height || 163;

    // Gutter
    var leftGutter = opt.leftGutter || 0;
    var bottomGutter = opt.bottomGutter || 15;
    var topGutter = opt.topGutter || 50;

    var color = "#E5E5E5";

    var container = Raphael(container_id, width, height);
    var X = (width - leftGutter) / data.length;
    var max = Math.max.apply(Math, data);
    var Y = (height - bottomGutter - topGutter) / max;

    var path = container.path().attr({ stroke: "none"});
    var bgp = container.path().attr({ stroke: "none", fill: color });
    var blanket = container.set();

    var p, bgpp;

    for (var i = 0, ii = data.length; i < ii; i++) {
        var y = Math.round(height - bottomGutter - Y * data[i]),
            x = Math.round(leftGutter + X * (i + .5));
        if (!i) {
            p = ["M", x, y, "C", x, y];
            bgpp = ["M", leftGutter + X * .5, height - bottomGutter, "L", x, y, "C", x, y];
        }
        if (i && i < ii - 1) {
            var Y0 = Math.round(height - bottomGutter - Y * data[i - 1]);
            var X0 = Math.round(leftGutter + X * (i - .5));
            var Y2 = Math.round(height - bottomGutter - Y * data[i + 1]);
            var X2 = Math.round(leftGutter + X * (i + 1.5));
            var a = getAnchors(X0, Y0, x, y, X2, Y2);
            p = p.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
            bgpp = bgpp.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
        }

        blanket.push(container.rect(leftGutter + X * i, 0, X, height - bottomGutter).attr({ stroke: "none", fill: "#fff", opacity: 0 }));
        var rect = blanket[blanket.length - 1];
    }

    p = p.concat([x, y, x, y]);
    bgpp = bgpp.concat([x, y, x, y, "L", x, height - bottomGutter, "z"]);
    path.attr({ path: p });
    bgp.attr({ path: bgpp });
  }

  $.fn.addGraph = function(data, opt) {
    drawGraph(this, data, opt);
  };

  //  $(".select-filter ul").jScrollPane({ verticalDragMinHeight: 20});
  //  $('.search_button, .candy_white_button, .candy_blue_button').mousedown(function() { $(this).addClass('active'); });
  //  $('.search_button, .candy_white_button, .candy_blue_button').mouseup(function() { $(this).removeClass('active'); });
  //  $('.search_button, .candy_white_button, .candy_blue_button').mouseleave(function() { $(this).removeClass('active'); });
});


