/*
* ======================
* BRAND NEW DATE POPOVER
* ======================
*/

(function($, window, document) {

  var ie6 = false;

  // Help prevent flashes of unstyled content
  if ($.browser.msie && $.browser.version.substr(0, 1) < 7) {
    ie6 = true;
  } else {
    document.documentElement.className = document.documentElement.className + ' ps_fouc';
  }

  var
  // Public methods exposed to $.fn.datePopoverNew()
  methods = {},

  store = "datepopover",

  months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG", "SEP","OCT","NOV","DEC"],

  templates = {
    main: ['<div id="<%=name %>_<%= id %>" class="date-selector">',
    '<div class="month"><span></span></div>',
    '<div class="day"><span></span></div>',
    '<div class="year"><span></span></div>',
    '</div>'].join(' ')
  };

  // Some nice default values
  defaults = {
    transitionSpeed:150
  };

  // Called by using $('foo').datePopoverNew();
  methods.init = function(settings) {
    settings = $.extend({}, defaults, settings);

    return this.each(function() {
      var
      // The current <select> element
      $this = $(this),

      // We store lots of great stuff using jQuery data
      data = $this.data(store) || {},

      // This gets applied to the 'ps_container' element
      id = $this.attr('id') || $this.attr('name'),

      // This gets updated to be equal to the longest <option> element
      width = settings.width || $this.outerWidth(),

      // The completed ps_container element
      $ps = false;

      // Dont do anything if we've already setup datePopoverNew on this element
      if (data.id) {
        return $this;
      } else {
       	data.id = id;
        data.$this = $this;
        data.name = store;
        data.templates = templates;
        data.settings = settings;
      }

      // Update the reference to $ps
      $ps = $("#" + data.name + "_" + data.id);

      // Save the updated $ps reference into our data object
      data.$ps = $ps;

      // Save the datePopoverNew data onto the <select> element
      $this.data(store, data);

      // Do the same for the dropdown, but add a few helpers
      $ps.data(store, data);

      $this.click(_toggle);

      $(window).bind('_close.'+data.name+'.'+data.id, function() {
        var $ps = $("#" + data.name + "_" + data.id);
        _close($this, $ps);
      });
    });
  };

  // Expose the plugin
  $.fn.datePopoverNew = function(method) {
    if (!ie6) {
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === 'object' || !method) {
        return methods.init.apply(this, arguments);
      }
    }
  };

  // Build popover
  function _build(data) {
    var $ps = $(_.template(data.templates.main, {name:data.name, id:data.id}));

    $day   = $ps.find(".day");
    $month = $ps.find(".month");
    $year  = $ps.find(".year");

    $ps.bind('click', function(e) {
      e.stopPropagation();
    });

    return $ps;
  }

  // Open a popover
  function _toggle(e) {
    e.preventDefault();
    e.stopPropagation();

    var $this = $(this);
    var $day, $month, $year;
    var day, month, year;
    var data = $this.data(store);

    if ($(this).hasClass("open")) {
      _close($this, data.name, data.id);
    } else {

      data.$ps = _build(data);
      var $ps = data.$ps;

      // setup the close event & signal the other subscribers
      var event = "_close."+data.name+"."+data.id;
      GOD.subscribe(event);
      GOD.broadcast(event);

      $("#content").prepend($ps);
      _center($this, $ps);
      _setup($this, $ps);
      _captureDate($this);
      _setupLists($this, $ps);
      _bindLists($this, $ps);

      if (oldIE) {
        $ps.show();
        $this.addClass("open");
      } else {
        $ps.animate({top:$ps.position().top + 10, opacity:1}, data.settings.transitionSpeed, function() {
          $this.addClass("open");
        });
      }
    }
  }

  // Close popover
  function _close($this, $ps) {
    var data = $this.data(store);
    GOD.unsubscribe("_close."+data.name+"."+data.id);

    if (is_ie) {
      $ps.hide();
      $ps.remove();
      $this.removeClass("open");
    } else {
      $ps.animate({top:$ps.position().top - 10, opacity:0}, data.settings.transitionSpeed, function() {
        $ps.remove();
        $this.removeClass("open");
      });
    }
  }

  function _center ($this, $ps) {
    var data = $this.data(store);

    var x = $this.offset().left;
    var y = $this.offset().top;
    var w = $ps.width();
    var el_w = $this.width();

    $ps.css("left", x - Math.floor(w/2) + Math.floor(el_w/2) - 4); // 4px == shadow

    if (oldIE) {
      $ps.css("top", y + 9 );
    } else {
      $ps.css("top", y + 9 );
    }
  }

  function _captureDate($this) {
    var date = new Date($this.attr("datetime"));

    day = date.getDate();
    month = date.getMonth();
    year = date.getFullYear();
  }

  function _setup($this, $ps) {
    $year.click(function(event) {
      event.stopPropagation();
      $(this).toggleClass("selected");
      $(".day, .month").removeClass("selected");
      var pane = $(this).find('.inner').jScrollPane({ verticalDragMinHeight: 20});
      pane.data('jsp').scrollToY(15*(year - 1950));
    });

    $month.click(function(event) {
      event.stopPropagation();
      $(this).toggleClass("selected");
      $(".year, .day").removeClass("selected");
      var pane = $(this).find('.inner').jScrollPane({ verticalDragMinHeight: 20});
      pane.data('jsp').scrollToY(month);
    });

    $day.click(function(event) {
      event.stopPropagation();
      $(this).toggleClass("selected");
      $(".year, .month").removeClass("selected");
      var pane = $(this).find('.inner').jScrollPane({ verticalDragMinHeight: 20});
      pane.data('jsp').scrollToY(15*(day - 1));
    });
  }

  function _bindLists($this, $ps) {
    var data = $this.data(store);

    $year.find("li").click(function(event){
      event.stopPropagation();
      year = $(this).html();

      _adjustCalendar();

      $year.find("li").removeClass("selected");
      $(this).addClass("selected");

      $year.find("span").animate({opacity:0}, data.settings.transitionSpeed, function() {
        $(this).html(year);
        $(this).animate({opacity:1}, data.settings.transitionSpeed);
      });
      $year.removeClass("selected");
      _updateDate($this);
    });

    $month.find("li").click(function(event){
      event.stopPropagation();
      month = _.indexOf(months, $(this).html());

      _adjustCalendar();

      $month.find("li").removeClass("selected");
      $(this).addClass("selected");

      $month.find("span").animate({opacity:0}, data.settings.transitionSpeed, function() {
        $(this).html(months[month]);
        $(this).animate({opacity:1}, data.settings.transitionSpeed);
      });
      $month.removeClass("selected");
      _updateDate($this);
    });

    $day.find("li").click(function(event){
      event.stopPropagation();
      day = $(this).html();

      $day.find("li").removeClass("selected");
      $(this).addClass("selected");

      $day.find("span").animate({opacity:0}, data.settings.transitionSpeed, function() {
        $(this).html(day);
        $(this).animate({opacity:1}, data.settings.transitionSpeed);
      });

      $day.removeClass("selected");
      _updateDate($this);
    });

  }

  function _setupLists($this, $ps) {
    $month.find("span").html(months[month]);
    $day.find("span").html(day);
    $year.find("span").html(year);

    $month.append('<div class="listing"><div class="inner"><ul></ul></div></div>');
    $day.append('<div class="listing"><div class="inner"><ul></ul></div></div>');
    $year.append('<div class="listing"><div class="inner"><ul></ul></div></div>');

    $ps.find('.listing, .jspVerticalBar').click(function(event) {
      event.stopPropagation();
    });

    _.each(months, function(m, index) {
      if (index == month) {
        $month.find(".listing ul").append('<li class="selected">'+m+'</li>');
      } else {
        $month.find(".listing ul").append("<li>"+m+"</li>");
      }
    });

    for(var i = 1; i <= 31; i++) {
      if (i == day) {
        $day.find(".listing ul").append("<li class='selected'>"+i+"</li>");
      } else {
        $day.find(".listing ul").append("<li>"+i+"</li>");
      }
    }

    for(var i = 1950; i <= 2020; i++) {
      if (i == year) {
        $year.find(".listing ul").append("<li class='selected'>"+i+"</li>");
      } else {
        $year.find(".listing ul").append("<li>"+i+"</li>");
      }
    }
  }

  function _zeroPad(num,count)
  {
    var numZeropad = num + '';
    while(numZeropad.length < count) {
      numZeropad = "0" + numZeropad;
    }
    return numZeropad;
  }

  function _updateDate($this) {
    if (day == 1) {
      n = "st";
    } else if (day == 2){
      n = "nd";
    } else {
      n = "th";
    }

    $this.html(months[month].toProperCase() + " " + day + n + ", " + year);
    $this.attr("datetime", year+"/"+_zeroPad(month+1, 2)+"/"+day);
  }
  function _adjustCalendar() {
    var month_index = month + 1;

    if (month_index == 2) { // February has only 28 days
      var isLeap = new Date(year,1,29).getDate() == 29;

      if (isLeap) {
        $day.find("li").eq(28).show(); // leap year -> show 29th
      } else {
        $day.find("li").eq(28).hide(); // regular year -> hide 29th

        if (day > 28) {
          $day.find("li.selected").removeClass("selected");
          $day.find("li").eq(27).addClass("selected"); // select the 28th
          day = 28;
          $day.find("span").html(day)
        }
      }

      $day.find("li").eq(29).hide(); // 30
      $day.find("li").eq(30).hide(); // 31


    } else if (_.include([4, 6, 9, 11], month_index)) {
      $day.find("li").eq(30).hide(); // 31
    } else {
      $day.find("li").eq(28).show(); // 29
      $day.find("li").eq(29).show(); // 30
      $day.find("li").eq(30).show(); // 31
    }
  }

})(jQuery, window, document);
