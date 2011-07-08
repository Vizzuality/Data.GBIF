var is_ie = $.browser.msie;

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

$(function(){
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

  $.fn.bindLinkPopover = function() {
    $(this).click(function(event) {
      linkPopover.toggle($(this), event);
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
  $('nav ul li a.more').bindLinkPopover();
  $('.sort').bindSortPopover();


  var renderItemOverride = function (ul, item) {
    return $("<li></li>")
    .data("item.autocomplete", item)
    .append('<a href="#" title="a"> - ' + item.label + '</a>')
    .appendTo(ul);
  };

  var availableTags = [ "ActionScript", "AppleScript", "Asp", "Puma Concolor", "BASIC", "C", "C++", "Clojure", "COBOL", "ColdFusion", "Erlang", "Fortran", "Groovy", "Haskell", "Java", "JavaScript", "Lisp", "Perl", "PHP", "Python", "Ruby", "Scala", "Scheme" ];
  $(".autocomplete input" ).autocomplete({ source: availableTags })._renderItem = renderItemOverride;

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

  //  $(".select-filter ul").jScrollPane({ verticalDragMinHeight: 20});
  //  $('.search_button, .candy_white_button, .candy_blue_button').mousedown(function() { $(this).addClass('active'); });
  //  $('.search_button, .candy_white_button, .candy_blue_button').mouseup(function() { $(this).removeClass('active'); });
  //  $('.search_button, .candy_white_button, .candy_blue_button').mouseleave(function() { $(this).removeClass('active'); });
});


