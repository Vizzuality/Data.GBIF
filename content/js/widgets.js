/*
* GOD sees everything
*/
var GOD = (function() {
  var subscribers = {};
  var debug = false;

  function unsubscribe(event) {
    debug && console.log("Unsubscribe ->", event);
    delete subscribers[event];
  }

  function subscribe(event) {
    debug && console.log("Subscribe ->", event);

    subscribers[event] = event
  }

  function _signal(event) {
    debug && console.log("Signal to ", event);

    $(window).trigger(event);
    unsubscribe(event);
  }

  function _signalAll() {
    if (!_.isEmpty(subscribers)) {
      _.each(subscribers, _signal);
    }
  }

  // send signal to all the other subscribers
  function broadcast(protectedEvent) {
    _.each(subscribers, function(event) {
      protectedEvent != event && _signal(event);
    });
  }

  $(function() {
    $(document).keyup(function(e) {
      e.keyCode == 27 && _signalAll();
    });

    $('html').click(_signalAll);
  });

  return {
    subscribe: subscribe,
    unsubscribe: unsubscribe,
    broadcast: broadcast
  };
})();


/*
* ============
* HELP POPOVER
* ============
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
  // Public methods exposed to $.fn.helpPopover()
  methods = {},

  // HTML template for the dropdowns
  templates = {
    main: ['<div id="<%= name %>_<%= id %>" class="yellow_popover"><div class="t"></div><div class="c"><h3><%= title %></h3><%= message %></div><div class="b"></div></div>'].join('')
  },
  store = "helppopover",

  // Some nice default values
  defaults = {
  };

  // Called by using $('foo').helpPopover();
  methods.init = function(settings) {
    settings = $.extend({}, defaults, settings);

    return this.each(function() {
      var
      // The current element
      $this = $(this),

      // We store lots of great stuff using jQuery data
      data = $this.data(store) || {},

      // This gets applied to the 'ps_container' element
      id = $this.attr('id') || $this.attr('name'),

      // This gets updated to be equal to the longest <option> element
      width = settings.width || $this.outerWidth(),

      // The completed ps_container element
      $ps = false;

      // Dont do anything if we've already setup helpPopover on this element
      if (data.id) {
        return $this;
      } else {
        data.id = id;
        data.$this     = $this;
        data.name      = store;
        data.templates = templates;
        data.title     = settings.title;
        data.message   = settings.message;
        data.settings  = settings;
      }

      // Hide the <select> list and place our new one in front of it
      $this.before($ps);

      // Save the updated $ps reference into our data object
      data.$ps = $ps;

      // Save the helpPopover data onto the <this> element
      $this.data(store, data);

      $(this).click(_toggle);

      $(window).bind('resize.yellow_popover', function() {
        _refresh($this, data.name, data.id);
      });

      $(window).bind('_close.'+data.name+'.'+data.id, function() {
        var $ps = $("#" + data.name + "_" + data.id);
        _close($this, $ps);
      });

    });
  };

  // Build popover
  function _build(data) {
    var $ps = $(_.template(data.templates.main, {name:data.name, id:data.id, title: data.title, message:data.message}));

    $ps.bind('click', function(e) {
      e.stopPropagation();
    });

    return $ps;
  }

  // Close popover
  function _close($this, $ps) {
    var data = $this.data(store);
    GOD.unsubscribe("_close."+data.name+"."+data.id);

    if (is_ie) {
      $ps.hide();
      $ps.remove();
    } else {
      $ps.animate({top:$ps.position().top - 10, opacity:0}, 150, function() {
        $ps.remove();
      });
    }
  }

  // Refresh popover
  function _refresh($this, name, id) {
    var $ps = $("#" + name + "_" + id);
    if ($("#" + data.name + "_" + data.id).length != 0) {
      var x = $this.offset().left;
      var y = $this.offset().top;
      var w = $ps.width();
      var h = $ps.height();

      if (oldIE) {
        $ps.css("top", y - h);
      } else {
        $ps.css("top", y - h);
      }

      $ps.css("left", x - w/2 + 7);
    }
  }

  // Open a popover
  function _toggle(e) {
    e.preventDefault();
    e.stopPropagation();

    var $this = $(this);
    var data = $this.data(store);

    if ($("#" + data.name + "_" + data.id).length != 0) {
      var $ps = $("#" + data.name + "_" + data.id);
      _close($this, $ps);
    } else {
      data.$ps = _build(data);
      var $ps = data.$ps;

      // setup the close event & signal the other subscribers
      var event = "_close."+data.name+"."+data.id;
      GOD.subscribe(event);
      GOD.broadcast(event);

      $("#content").prepend($ps);
      _center($this, $ps);

      if (oldIE) {
        $ps.show();
      } else {
        $ps.animate({top:$ps.position().top + 10, opacity:1}, 150);
      }
    }
  }

  function _center ($this, $ps) {
    // link coordinates
    var x = $this.offset().left;
    var y = $this.offset().top;

    // link dimensions
    var lw = $this.width();
    var lh = $this.height();

    // popover dimensions
    var w = $ps.width();
    var h = $ps.height();

    $ps.css("left", x - w/2 + lw/2);

    if (oldIE) {
      $ps.css("top", y - h - 5);
    } else {
      $ps.css("top", y - h - 10);
    }
  }

  // Expose the plugin
  $.fn.helpPopover = function(method) {
    if (!ie6) {
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === 'object' || !method) {
        return methods.init.apply(this, arguments);
      }
    }
  };

})(jQuery, window, document);

/*
* ===============
* PROCESS POPOVER
* ===============
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
  // Public methods exposed to $.fn.processPopover()
  methods = {},

  // HTML template for the dropdowns
  templates = {
    main: ['<div id="<%= name %>_<%= id %>" class="yellow_popover"><div class="t"></div><div class="c"><h3><%= title %></h3><%= message %></div><div class="b"></div></div>'].join('')
  },
  store = "helppopover",

  // Some nice default values
  defaults = {
  };

  // Called by using $('foo').processPopover();
  methods.init = function(settings) {
    settings = $.extend({}, defaults, settings);

    return this.each(function() {
      var
      // The current element
      $this = $(this),

      // We store lots of great stuff using jQuery data
      data = $this.data(store) || {},

      // This gets applied to the 'ps_container' element
      id = $this.attr('id') || $this.attr('name'),

      // This gets updated to be equal to the longest <option> element
      width = settings.width || $this.outerWidth(),

      // The completed ps_container element
      $ps = false;

      // Dont do anything if we've already setup processPopover on this element
      if (data.id) {
        return $this;
      } else {
        data.id = id;
        data.$this     = $this;
        data.name      = store;
        data.templates = templates;
        data.title     = settings.title;
        data.message   = settings.message;
        data.settings  = settings;
      }

      // Hide the <select> list and place our new one in front of it
      $this.before($ps);

      // Save the updated $ps reference into our data object
      data.$ps = $ps;

      // Save the processPopover data onto the <this> element
      $this.data(store, data);

      $(this).click(_toggle);

      $(window).bind('resize.yellow_popover', function() {
        _refresh($this, data.name, data.id);
      });

      $(window).bind('_close.'+data.name+'.'+data.id, function() {
        var $ps = $("#" + data.name + "_" + data.id);
        _close($this, $ps);
      });

    });
  };

  // Build popover
  function _build(data) {
    var $ps = $(_.template(data.templates.main, {name:data.name, id:data.id, title: data.title, message:data.message}));

    $ps.bind('click', function(e) {
      e.stopPropagation();
    });

    return $ps;
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
      $ps.animate({top:$ps.position().top - 10, opacity:0}, 150, function() {
        $ps.remove();
        $this.removeClass("open");
      });
    }
  }

  // Refresh popover
  function _refresh($this, name, id) {
    var $ps = $("#" + name + "_" + id);
    if ($this.hasClass("open")) {

      var x = $this.offset().left;
      var y = $this.offset().top;
      var w = $ps.width();
      var h = $ps.height();

      if (oldIE) {
        $ps.css("top", y - h);
      } else {
        $ps.css("top", y - h);
      }

      $ps.css("left", x - w/2 + 7);
    }
  }

  // Open a popover
  function _toggle(e) {
    e.preventDefault();
    e.stopPropagation();

    var $this = $(this);
    var data = $this.data(store);

    if ($("#" + data.name + "_" + data.id).length != 0) {
      var $ps = $("#" + data.name + "_" + data.id);
      _close($this, $ps);
    } else {
      data.$ps = _build(data);
      var $ps = data.$ps;

      // setup the close event & signal the other subscribers
      var event = "_close."+data.name+"."+data.id;
      GOD.subscribe(event);
      GOD.broadcast(event);

      $("#content").prepend($ps);
      _center($this, $ps);

      if (oldIE) {
        $ps.show();
        $this.addClass("open");
      } else {
        $ps.animate({top:$ps.position().top + 10, opacity:1}, 150, function() {
          $this.addClass("open");
        });
      }
    }
  }

  function _center ($this, $ps) {
    // link coordinates
    var x = $this.offset().left;
    var y = $this.offset().top;

    // link dimensions
    var lw = $this.attr("width");
    var lh = $this.attr("height");

    // popover dimensions
    var w = $ps.width();
    var h = $ps.height();

    $ps.css("left", x - w/2 + lw/2);

    if (oldIE) {
      $ps.css("top", y - h - 5);
    } else {
      $ps.css("top", y - h - 10);
    }
  }

  // Expose the plugin
  $.fn.processPopover = function(method) {
    if (!ie6) {
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === 'object' || !method) {
        return methods.init.apply(this, arguments);
      }
    }
  };

})(jQuery, window, document);

/*
* ============
* DATE POPOVER
* ============
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
  // Public methods exposed to $.fn.datePopover()
  methods = {},

  store = "datepopover",

  months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG", "SEP","OCT","NOV","DEC"],

  templates = {
    main: ['<div id="<%=name %>_<%= id %>" class="date-selector">',
    '<div class="month"><span></span></div>',
    '<div class="day"><span></span></div>',
    '<div class="year"><span></span></div>',
    '</div>'].join(' '),
    input: '<input type="hidden" value="" id="datefield_<%= name %>_<%= id %>" name="<%= name %>" />'
  };

  // Some nice default values
  defaults = {
    transitionSpeed:150
  };

  // Called by using $('foo').datePopover();
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

      // Dont do anything if we've already setup datePopover on this element
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

      // Save the datePopover data onto the <select> element
      $this.data(store, data);

      // Do the same for the dropdown, but add a few helpers
      $ps.data(store, data);

      // Add input field so we can submit the date in the form
      var $input = _buildInput(data);

      $this.before($input); // add the input to the DOM
      data.$input = $('#datefield_'+ data.name + '_' +  data.id);

      // Add the initial date to the hidden input field
      _captureDate($this);
      _updateDate($this);

      $this.click(_toggle);

      $(window).bind('_close.'+data.name+'.'+data.id, function() {
        var $ps = $("#" + data.name + "_" + data.id);
        _close($this, $ps);
      });
    });
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

  // Build hidden input field that stores the date
  function _buildInput(data) {
   return $(_.template(data.templates.input, {name:data.name, id:data.id}));
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
      var $ps = $("#" + data.name + "_" + data.id);
      _close($this, $ps);
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
        $ps.animate({top:$ps.position().top - 15, opacity:1}, data.settings.transitionSpeed, function() {
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
      $ps.css("top", y + 9 + 20);
    }
  }

  // Get the date from the <time> tag
  function _captureDate($this) {
    var date = new Date($this.attr("datetime"));

    day   = date.getDate();
    month = date.getMonth();
    year  = date.getFullYear();
  }

  // Setup the click events on each selector (year, month, day)
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


  // Bind click events on each of the items (1, 2, 3, january, february, 2011, 2012…)
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

  // Update the original date contained in the <time> tag
  function _updateDate($this) {

    function _suffix(n) { // returns the appropriate suffix
      return [null, 'st', 'nd', 'rd', 'th'][n] || "th";
    }

    var data = $this.data(store);

    $this.html(months[month].toProperCase() + " " + day + _suffix(day) + ", " + year); // Visible date

    var datetime = year+"/"+_zeroPad(month+1, 2)+"/"+day;
    $this.attr("datetime", datetime); // Tag's date
    data.$input.val(datetime.replace(/\//g, "-")); // Hidden input's date
  }

  // Adjust the selectors
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

  // Expose the plugin
  $.fn.datePopover = function(method) {
    if (!ie6) {
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === 'object' || !method) {
        return methods.init.apply(this, arguments);
      }
    }
  };

})(jQuery, window, document);


/*
* =============
*  LINK POPOVER
* =============
*/

var linkPopover = (function() {
  var el;
  var displayed = false;
  var $popover;
  var transitionSpeed = 200;
  var links = {};

  var templates = {
    main:'<div class="white_narrow_popover"><div class="arrow"></div><ul></ul></div>',
    li:'<li><a href="<%=value%>"><span><%=label%></span></a></li>'
  }

  $(function() {
    $(window).bind('_close.linkpopover', hide);
  });

  function toggle(e, event, opt) {
    event.stopPropagation();
    event.preventDefault();
    el = e;

    if (opt) {
      links = opt.links
    }

    displayed ? hide(): show();
  }
  function setupInterface () {
    _.each(links, addLink);
    $popover.find("ul li:first-child").addClass("first");
    $popover.find("ul li:last-child").addClass("last");
  }

  function addLink(value, label) {
    $popover.find("ul").append(_.template(templates.li, {value:value, label:label}));
  }

  function hide() {
    GOD.unsubscribe("_close.linkpopover");

    if (is_ie) {
      $popover.hide();
      $popover.remove();
      displayed = false;
    } else {
      $popover.animate({top:$popover.position().top - 20, opacity:0}, transitionSpeed, function() { $popover.remove(); displayed = false; });
    }
  }

  function showPopover() {
    // get the coordinates and width of the popover
    var x = el.find("span").offset().left;
    var y = el.find("span").offset().top;
    var w = $(".white_narrow_popover").width();

    // center the popover
    $popover.css("left", x - w/2 + 4);

    // setup the close event & signal the other subscribers
    var event = "_close.linkpopover";
    GOD.subscribe(event);
    GOD.broadcast(event);

    if (is_ie) {
      $popover.css("top", y - 5);
      $popover.show(transitionSpeed, function() {
        displayed = true;
      });
    } else {
      $popover.css("top", y + 15);
      $popover.animate({top:$popover.position().top - 20, opacity:1}, transitionSpeed, function() { displayed = true; });
    }
  }

  function show() {
    $("#content").prepend(templates.main);
    $popover = $(".white_narrow_popover");
    setupInterface();

    showPopover();
  }

  return {
    toggle: toggle
  };
})();


/*
* ========
* DROPDOWN
* ========
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
  // Public methods exposed to $.fn.dropdownPopover()
  methods = {},
  store = "sortpopover",

  // HTML templates for the popover
  templates = {
    main: [
      '<div id="<%= name %>_<%= id %>" class="white_popover">',
      '<div class="arrow"></div>',
      '<ul></ul>',
      '</div>'].join(''),
    item: '<li data-select="<%= select %>"><a href="#"><span><%= name %></span></a></li>'
  },

  // Some nice default values
  defaults = {
  };

  // Called by using $('foo').dropdownPopover();
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

      // Dont do anything if we've already setup dropdownPopover on this element
      if (data.id) {
        return $this;
      } else {
        data.id = id;
        data.$this = $this;
        data.name = store;
        data.settings = settings;
        data.templates = templates;
      }

      // Update the reference to $ps
      $ps = $("#" + data.name + "_" + data.id);

      // Save the updated $ps reference into our data object
      data.$ps = $ps;

      // Save the dropdownPopover data onto the <select> element
      $this.data(store, data);

      // Do the same for the dropdown, but add a few helpers
      $ps.data(store, data);
      $this.click(_toggle);

      $(window).bind('resize.' + data.name + "_" + data.id, function() {
        _refresh($this, data.name, data.id);
      });

      $(window).bind('_close.'+data.name+'.'+data.id, function() {
        _hide($this, data.name, data.id);
      });

    });
  };

  function _buildItems($ps, data) {

    if (data.settings.options &&  data.settings.options.links) {

      _.each(data.settings.options.links, function(option, i) {
        var select = ("select" in option) ? option.select : option.name;

        var $item = _.template(data.templates.item, {name:option.name, select:select});

        $ps.find("ul").append($item);

        $ps.find("ul li:last a").click(function(e) {

          option.callback(e); // execute the callback function

          _close(data.$this, data.name, data.id); // and close the popover

          // Replace the original link with…
          var replacementText;

          if ("replaceWith" in option) { // … a text provided by the user
            replacementText = option.replaceWith;
          } else { // the name of the selected option
            replacementText = $(this).html();
          }
          data.$this.html(replacementText);
        });
      });

      // we need to add these classes for iE
      $ps.find("ul li:first").addClass("first");
      $ps.find("ul li:last").addClass("last");
    }
  }

  // Build popover
  function _build(data, selectedOption) {

    var $ps = $(_.template(data.templates.main, {id:data.id, name:data.name}));

    $ps.bind('click', function(e) {
      e.stopPropagation();
    });

    return $ps;
  }

  // Highlights the selected option
  function _selectOption($ps, optionText) {
    $ps.find("li.selected").removeClass("selected");
    $ps.find('li[data-select="'+optionText+'"]').addClass("selected");
  }

  // Refresh popover
  function _refresh($this, name, id) {
    var $ps = $("#" + name + "_" + id);

    if ($this.hasClass("open")) {

      var x = $this.find("span").offset().left;
      var y = $this.find("span").offset().top;
      var tw = $this.find("span").width();
      var w = $ps.width();

      if (oldIE) {
        $ps.css("top", y);
      } else {
        $ps.css("top", y);
      }

      $ps.css("left", x - w/2 + tw/2);
    }
  }

  // Center popover
  function _center ($this, $ps) {
    var x = $this.find("span").offset().left;
    var y = $this.find("span").offset().top;
    var tw = $this.find("span").width();

    var w = $ps.width();

    $ps.css("left", x - w/2 + tw/2);

    if (oldIE) {
      $ps.css("top", y - 5);
    } else {
      $ps.css("top", y - 15);
    }
  }

  function _hide($this, name, id) {
    _close($this, name, id);
  }
  // Close popover
  function _close($this, name, id) {
    var $ps = $("#" + name + "_" + id);
    GOD.unsubscribe("_close."+name+"."+id);

    if (oldIE) {
      $ps.hide();
      $ps.remove();
      $this.removeClass("open");
    } else {
      $ps.animate({top:$ps.position().top - 20, opacity:0}, 150, function() {
        $ps.remove();
        $this.removeClass("open");
      });
    }
  }

  // Open a popover
  function _toggle(e) {
    e.preventDefault();
    e.stopPropagation();

    var $this = $(this);
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
      _buildItems($ps, data);
      _center($this, $ps);
      _selectOption($ps, $(this).text());

      if (oldIE) {
        $ps.show();
        $this.addClass("open");
      } else {
        $ps.animate({top:$ps.position().top + 15, opacity:1}, 150, function() {
          $this.addClass("open");
        });
      }
    }
  }

  // Expose the plugin
  $.fn.dropdownPopover = function(method) {
    if (!ie6) {
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === 'object' || !method) {
        return methods.init.apply(this, arguments);
      }
    }
  };
})(jQuery, window, document);


/*
* =============
* LOGIN POPOVER
* =============
*/

var loginPopover = (function() {
  var displayed = false;
  var $login;
  var el;
  var explanation = "";
  var selected_template;
  var errorEmail, errorPassword;
  var transitionSpeed = 200;

  var templates = {login: "<div id='login' class='infowindow'>\
    <div class='lheader'></div>\
      <span class='close'></span>\
        <div class='content'>\
          <h2>SIGN IN TO GBIF</h2>\
            <p>You need to log in GBIF in order to download the data.</p>\
              <form autocomplete='off' method='post' action='test'>\
                <div class='light_box'>\
                  <div class='field email'>\
                    <h3>Email</h3>\
                      <span class='input_text'>\
                        <input id='email' name='email' type='text' />\
                          </span>\
                            </div>\
                              <div class='field password'>\
                                <h3>Password</h3>\
                                  <span class='input_text'>\
                                    <input id='password' name='password' type='password' />\
                                      </span>\
                                        </div>\
                                          <div class='tl'></div><div class='tr'></div><div class='bl'></div><div class='br'></div>\
                                            </div>\
                                              <a href='#' class='recover_password' title='Recover your password'>Forgot your password?</a>\
                                                <button type='submit' class='candy_blue_button'><span>Login</span></button>\
                                                  </form>\
                                                    <div class='footer'>Do yo need to Sign up? <a href='/user/register/step0.html' title='Create your account'>Create your account</a></div>\
                                                      </div>\
                                                        <div class='lfooter'></div>\
                                                          </div>",
  password: "<div id='recover_password' class='infowindow'>\
    <div class='lheader'></div>\
      <span class='close'></span>\
        <div class='content'>\
          <h2>RECOVER YOUR PASSWORD</h2>\
            <form autocomplete='off' method='post'>\
              <div class='light_box'>\
                <div class='field'>\
                  <h3>Your email</h3>\
                    <span class='input_text'>\
                      <input id='email' name='email' type='text' />\
                        </span>\
                          </div>\
                            <div class='tl'></div><div class='tr'></div><div class='bl'></div><div class='br'></div>\
                              </div>\
                                <a href='#' class='back_to_login' title='Back to the sign in form'>Back to the sign in form</a>\
                                  <button type='submit' class='candy_blue_button'><span>Send email</span></button>\
                                    </form>\
                                      <div class='footer'>Do yo need to Sign up? <a href='/user/register/step0.html' title='Create your account'>Create your account</a></div>\
                                        </div>\
                                          <div class='lfooter'></div>\
                                            </div>"};



  function toggle(e, event, opt) {
    event.stopPropagation();
    event.preventDefault();
    el = e;

    displayed ? hide(): show();
  }

  function changePopover(selected_template){

    $popover.fadeOut(transitionSpeed, function() {

      // let's remove the old popover and unbind the old buttons
      $popover.find('a.download, a.close').unbind("click");
      $popover.remove();

      // we can now open the new popover: "password"
      rendered_template = _.template(selected_template);
      $("#content").prepend(rendered_template);

      // get the id of the popover
      popover_id = $(selected_template).attr("id");
      $popover = $("#"+popover_id);

      $popover.find("p a").click(function(event) {
        window.location.href = $(this).attr("href");
      });

      // finally bind everyhting so it keeps working
      setupBindings();

      $popover.css("top", getTopPosition() + "px");
      $popover.fadeIn(transitionSpeed);
    });
  }

  function getTopPosition() {
    return (( $(window).height() - $popover.height()) / 2) + $(window).scrollTop();
  }

  function setupBindings() {

    errorEmail = false;
    errorPassword = false;

    $popover.find("form").submit(function(event) {
      event.preventDefault();

      if (!errorEmail) {
        $popover.find(".field.email").addClass("error");
        $popover.find(".field.email h3").append("<span class='error' style='display:none'>Email not recognized</span>");
        $popover.find(".field.email h3 span").fadeIn(transitionSpeed);
        errorEmail = true;
      }
      if (!errorPassword) {
        $popover.find(".field.password").addClass("error");
        $popover.find(".field.password h3").append("<span class='error' style='display:none'>Wrong password</span>");
        $popover.find(".field.password h3 span").fadeIn(transitionSpeed);
        errorPassword = true;
      }
    });

    $popover.find("input").focus(function(event) {
      event.preventDefault();
      if ($(this).parents(".field.error").hasClass("email")) {
        errorEmail = false;
      } else {
        errorPassword = false;
      }

      $(this).parents(".field.error").find("h3 span").fadeOut(transitionSpeed, function() {$(this).remove();});
      $(this).parents(".field.error").removeClass("error");
    });

    $popover.find(".back_to_login").click(function(event) {
      event.preventDefault();
      changePopover(templates.login);
    });

    $popover.find(".recover_password").click(function(event) {
      event.preventDefault();
      changePopover(templates.password);
    });

    $popover.find(".footer a, span.recover_password a").click(function(event) {
      event.preventDefault();
      displayed && hide(function(){ window.location.href = $(this).attr("href"); });
    });

    $popover.find(".close").click(function(event) {
      event.preventDefault();
      displayed && hide();
    });

    $popover.click(function(event) {
      event.stopPropagation();
    });
  }

  function show() {

    var rendered_template = _.template(templates.login);
    $("#content").prepend(rendered_template);
    $popover = $("#login");

    $("body").append("<div id='lock_screen'></div>");
    $("#lock_screen").height($(document).height());
    $("#lock_screen").fadeIn("slow");

    setupBindings();
    $popover.css("top", getTopPosition() + "px");
    $popover.fadeIn("slow", function() { hidden = false; });
    displayed = true;
  }

  function hide(callback) {
    $popover.find('a.close').unbind("click");

    $popover.fadeOut(transitionSpeed, function() {
      $popover.remove(); displayed = false;
      callback && callback();
    });

    $("#lock_screen").fadeOut(transitionSpeed, function() { $("#lock_screen").remove(); });
  }

  return {
    toggle: toggle,
    hide: hide
  };
})();

/*
* ================
* DOWNLOAD POPOVER
* ================
*/

var downloadPopover = (function() {
  var displayed = false;
  var $login;
  var el;
  var explanation = "";
  var transitionSpeed = 200;
  var selected_template;

  var templates = {
    download_selector: ['<div class="infowindow download_popover download_selector">',
      '<div class="lheader"></div>',
      '<span class="close"></span>',
      '<div class="content">',
      '<h2>DOWNLOAD DATA</h2>',
      '<p><%= explanation %></p>',
      '<div class="light_box">',
      '<h3>Select a format</h3>',
      '<ul>',
      '<li><input type="radio" name="format" value="csv" id="format_csv" /> <label for="format_csv">CSV</label> <span class="size">(≈150Kb)</span></li>',
        '<li><input type="radio" name="format" value="xls" id="format_xls" /> <label for="format_xls">XLS</label></li>',
          '<li><input type="radio" name="format" value="xml" id="format_xml" /> <label for="format_xml">XML</label></li>',
            '</ul>',
      '<div class="tl"></div><div class="tr"></div><div class="bl"></div><div class="br"></div>',
      '</div>',
      '<a class="candy_blue_button download" target="_blank" href="http://localhost:3000/tmp/download.zip"><span>Download</span></a>',
        '</div>',
      '<div class="lfooter"></div>',
      '</div>'].join(' '),
      direct_download: ['<div class="infowindow download_popover direct_download">',
        '<div class="lheader"></div>',
        '<span class="close"></span>',
        '<div class="content">',
        '<h2>DOWNLOAD DATA</h2>',
        '<div class="light_box package">',
        '<div class="content">',
        '<p><%= explanation %></p>',
        '</div>',
        '</div>',
        '<span class="filetype"><strong>CSV file</strong> <span class="size">(≈150Kb)</span></span> <a class="candy_blue_button download" target="_blank" href="http://localhost:3000/tmp/download.zip"><span>Download</span></a>',
          '</div>',
        '<div class="lfooter"></div>',
        '</div>'].join(' '),
        download_started: ['<div class="infowindow download_has_started">',
          '<div class="lheader"></div>',
          '<span class="close"></span>',
          '<div class="content">',
          '<h2>DOWNLOAD STARTED</h2>',
          '<p>Remember that the downloaded data has to be correctly cited if it is used in publications. You will receive a citation text vbundled in the file with your download.</p>',
            '<p>If you have any doubt about the legal terms, please check our <a href="/static/terms_and_conditions.html" class="about" title="GBIF Data Terms and Conditions">GBIF Data Terms and Conditions</a>.</p>',
              '<a href="#" class="candy_white_button close"><span>Close</span></a>',
          '</div>',
          '<div class="lfooter"></div>',
          '</div>'].join(' ')
  };

  function toggle(e, event, opt) {
    event.stopPropagation();
    event.preventDefault();
    el = e;

    selected_template = templates.download_selector;

    if (opt) {
      explanation = opt.explanation;
      if (opt.template && opt.template == "direct_download") {
        selected_template = templates.direct_download;
      }
    }

    displayed ? hide(): show();
  }

  function getTopPosition() {
    return (( $(window).height() - $popover.height()) / 2) + $(window).scrollTop() - 50;
  }

  function setupBindings() {
    $popover.find(".about").click(function(event) {
      event.preventDefault();
      displayed && hide(function(){ window.location.href = $(this).attr("href"); });
    });

    $popover.find(".close").click(function(event) {
      event.preventDefault();
      displayed && hide();
    });

    $popover.click(function(event) {
      event.stopPropagation();
    });
  }

  function showDownloadHasStarted(url){

    $popover.fadeOut(transitionSpeed, function() {

      // let's remove the old popover and unbind the old buttons
      $popover.find('a.download, a.close').unbind("click");
      $popover.remove();

      // we can now open the new popover: "download_has_started"
      rendered_template = _.template(templates.download_started);
      $("#content").prepend(rendered_template);
      $popover = $(".download_has_started");

      $popover.find("p a").click(function(event) {
        window.location.href = $(this).attr("href");
      });

      // bind everyhting so it keeps working
      setupBindings();

      $popover.css("top", getTopPosition() + "px");
      $popover.fadeIn(transitionSpeed, function() {
        window.location.href = url;
      });

    });
  }

  function show() {
    var rendered_template = _.template(selected_template, {explanation:explanation});
    $("#content").prepend(rendered_template);
    $popover = $(".download_popover");

    $popover.find("input[type='radio']").uniform();

    $popover.find(".download").click(function(event) {
      event.stopPropagation();
      event.preventDefault();
      var url = $(this).attr("href");

      var checked = $popover.find("ul li input:checked");

      showDownloadHasStarted(url);
    });

    setupBindings();
    $popover.css("top", getTopPosition() + "px");
    $popover.fadeIn("slow", function() { hidden = false; });
    $("body").append("<div id='lock_screen'></div>");
    $("#lock_screen").height($(document).height());
    $("#lock_screen").fadeIn("slow");
    displayed = true;
  }

  function hide(callback) {
    $popover.find('a.close').unbind("click");

    $popover.fadeOut(transitionSpeed, function() { $popover.remove(); displayed = false; });

    $("#lock_screen").fadeOut(transitionSpeed, function() {
      $("#lock_screen").remove();
      callback && callback();
    });
  }

  return {
    toggle: toggle,
    hide: hide
  };
})();

/*
* ================
* POPOVER BINDINGS
* ================
*/

$.fn.bindSlider = function(min, max, values) {
  var $slider = $(this).find(".slider");
  var $legend = $(this).find(".legend");

  $slider.slider({
    range: true,
    min: min,
    max: max,
    values: values,
    slide: function(event, ui) {
      $legend.val("BETWEEN " + ui.values[ 0 ] + " AND " + ui.values[ 1 ] );
    }
  });

  $legend.val( "BETWEEN " + $slider.slider( "values", 0 ) + " AND " + $slider.slider( "values", 1 ) );
};

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

$.fn.bindLinkPopover = function(opt) {
  $(this).click(function(event) {
    linkPopover.toggle($(this), event, opt);
  });
};

$.fn.bindDatePopover = function() {
  $(this).click(function(event) {
    datePopover.toggle($(this), event);
  });
};

$.fn.bindSlideshow = function(opt) {
  var $this = $(this);

  var photoWidth      = 627;
  var currentPhoto    = 0;
  var transitionSpeed = 500;
  var easingMethod    = "easeOutQuart";

  var num_of_photos   = $this.find("div.photos > img").length - 1;
  var downloads       = $this.find("div.download a");

  var $previous_button = $this.find(".previous_slide");
  var $next_button     = $this.find(".next_slide");
  var $slideshow       = $this.find('.slideshow');

  // The previous button is disabled by default
  $previous_button.addClass("disabled");

  // Calculate the width of the slideshow
  $this.find(".photos").width(num_of_photos*photoWidth);

  $previous_button.click(function(event) {
    event.preventDefault();

    if (currentPhoto > 0) {
      $next_button.removeClass("disabled");

      $slideshow.scrollTo('-='+photoWidth+'px', transitionSpeed, {easing:easingMethod, axis:'x'});
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

      $slideshow.scrollTo('+='+photoWidth+'px', transitionSpeed, {easing:easingMethod, axis:'x'});
      $(downloads[currentPhoto]).parent().hide();
      currentPhoto++;
      $(downloads[currentPhoto]).parent().show();

      if (currentPhoto >= num_of_photos) {
        $next_button.addClass("disabled");
      }
    }
  });
};



/*
* ==========
* SELECT BOX
* ==========
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
  // Public methods exposed to $.fn.selectBox()
  methods = {},
  store = "selectbox",

  // HTML template for the dropdowns
  templates = {
    main: ['<div id="<%= name %>_<%= id %>" class="select_box">',
      '<div class="selected_option"><span><%= label %></span></div>',
      '</div>'].join(''),
      list:['<div id="list_<%= name %>_<%= id %>" class="select_listing">',
        '<div class="select_inner">',
        '<ul><%= options %></ul>',
        '</div>',
        '</div>'].join(' ')
  },

  // Some nice default values
  defaults = {
    transitionSpeed: 150
  };
  // Called by using $('foo').selectBox();
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

      // Save all of the <option> elements
      $options = $this.find('option'),
      $original = $this.find(':selected').first();

      // The completed ps_container element
      $ps = false;

      // Dont do anything if we've already setup selectBox on this element
      if (data.id) {
        return $this;
      } else {
        data.id = id;
        data.$this = $this;
        data.settings = settings;
        data.templates = templates;
        data.$original = $original;
        data.name = store;
        data.options = $options;
        data.label   = $original.html();
        data.value   = _notBlank($this.val()) || _notBlank($original.attr('value'));
      }

      // Build the dropdown HTML
      $ps = _build(templates.main, data);
      $l = _buildItems(templates.list, data);

      $this.hide();

      data.$l = $l;

      // Hide the <select> list and place our new one in front of it
      $this.before($ps);

      // Update the reference to $ps
      $ps = $('#' + data.name + "_" + data.id);

      $ps.css("width", width + 35);
      $l.css("width", width + 23);

      // Save the updated $ps reference into our data object
      data.$ps = $ps;

      // Save the selectBox data onto the <select> element
      $this.data(store, data);

      // Do the same for the dropdown, but add a few helpers
      $ps.data(store, data);

      $("#content").append($l);

      $ps.click(_toggle);

      $(window).bind("_close."+data.name+"."+data.id, function(e) {
        _close($this);
      });
    });
  };

  // Build popover
  function _build(template, data) {
    var $ps = _.template(template, {label:data.label, name:data.name, id:data.id});

    return $ps;
  }

  function _buildItems(template, data) {
    var options = "";
    var c = "";

    for (var i = 0; i < data.options.length; i++) {

      var value = $(data.options[i]).val();
      var name  = $(data.options[i]).html();
      if (value) {
        c = (value == data.value) ? ' class="selected"' : '';
        options += '<li'+c+' data-dropdown-value="' + value + '">' + name + '</li>';
      }
    };

    return $(_.template(template, {name:data.name, id:data.id, options:options}));
  }

  // Close popover
  function _close($this) {
    var data = $this.data(store);
    GOD.unsubscribe("_close."+data.name+"."+data.id);
    data.$ps.removeClass("open");
    data.$l.removeClass("open");
  }

  function _notBlank(text) {
    return ($.trim(text).length > 0) ? text : false;
  }

  // Open a popover
  function _toggle(e) {
    e.preventDefault();
    e.stopPropagation();

    var $this = $(this);
    var data = $this.data(store);
    var $ps = $('#' + data.name + "_" + data.id);
    var $l = $('#list_' + data.name + "_" + data.id);

    if ($ps.hasClass("open")) {
      _close($this);
    } else {

      $l.addClass("open");
      $ps.addClass("open");

      // don't do anything if we click inside of the select…
      $l.find('.listing, .jspVerticalBar').click(function(e) {
        e.stopPropagation();
      });

      $l.find('ul').jScrollPane({ verticalDragMinHeight: 20});

      $l.css("top", $ps.offset().top + 34);
      $l.css("left", $ps.offset().left);

      $l.find("li").unbind("click");
      $l.find("li").click(function(event) {
        var text = $(this).text();

        $l.find("li").removeClass("selected");
        $(this).addClass("selected");

        // select the option in the original select
        var value = $(this).attr('data-dropdown-value');
        data.$this.val(value);

        $ps.find("div.selected_option span").animate({ color: "#FFFFFF" }, data.settings.transitionSpeed, function(){
          $ps.find("div.selected_option span").text(text);
          $ps.find("div.selected_option span").animate({ color: "#333" }, data.settings.transitionSpeed);
        });

        _close($ps);
      });

      // setup the close event & signal the other subscribers
      var event = "_close."+data.name+"."+data.id;
      GOD.subscribe(event);
      GOD.broadcast(event);
    }
  }

  // Expose the plugin
  $.fn.selectBox = function(method) {
    if (!ie6) {
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === 'object' || !method) {
        return methods.init.apply(this, arguments);
      }
    }
  };


})(jQuery, window, document);


/*
* ==================
* TAXONOMIC EXPLORER
* ==================
*/

(function($, window, document) {

  var ie6 = false;
  var debug = false;
  var store = "taxonomicExplorer";

  // Help prevent flashes of unstyled content
  if ($.browser.msie && $.browser.version.substr(0, 1) < 7) {
    ie6 = true;
  } else {
    document.documentElement.className = document.documentElement.className + ' ps_fouc';
  }

  var
  // Public methods exposed to $.fn.taxonomicExplorer()
  methods = {},
  level = 0,
  zIndex = 0,
  stop = false,
  stopBack = false,

  // Some nice default values
  defaults = {
    width: 540,
    transitionSpeed:300,
    liHeight: 25
  };

  // Called by using $('foo').taxonomicExplorer();
  methods.init = function(settings) {
    settings = $.extend({}, defaults, settings);

    return this.each(function() {
      var
      // The current <select> element
      $this = $(this),
      $breadcrumb = false,

      // We store lots of great stuff using jQuery data
      data = $this.data(store) || {},

      // This gets applied to the 'ps_container' element
      id = $this.attr('id') || $this.attr('name'),

      // This gets updated to be equal to the longest <option> element
      width = settings.width || $this.outerWidth(),

      // The completed ps_container element
      $ps = false;

      // Dont do anything if we've already setup taxonomicExplorer on this element
      if (data.id) {
        return $this;
      } else {
        data.id = id;
        data.$this = $this;
        data.settings = settings;
      }

      // Update the reference to $ps
      $ps = $("#"+id);
      $ps.prepend('<div class="breadcrumb"><li class="last">All</li></div>');
      $breadcrumb = $ps.find(".breadcrumb");

      // Save the updated $ps reference into our data object
      data.$ps = $ps;
      data.$breadcrumb = $breadcrumb;

      // Save the taxonomicExplorer data
      $this.data(store, data);
      $ps.data(store, data);

      $this.find('.inner').jScrollPane({ verticalDragMinHeight: 20});

      // Calculate the width of the bars and add them to the DOM
      function addBars($ul) {

        $ul.find("> li").each(function() {
          var value = parseInt($(this).attr("data"));
          var clase = "";

          if ($(this).find("> ul").length > 0) {
            $(this).find("span:first").addClass('clickable');
            clase = " clickable";
          }

          $(this).find("span:first").after('<div class="bar'+clase+'" style="width:'+(value+10)+'px"><div class="count">'+value+'</div></div>');

          $(this).find("span:first").parent().hover(function() {
            $(this).find(".count:first").show();
            $(this).find("a:first").show();
          }, function() {
            $(this).find(".count:first").hide();
            $(this).find("a:first").hide();
          });

        });

        $ul.children().each(function() {
          addBars($(this));
        });
      }

      addBars($ps.find("ul:first"));

      // If the user clicks on a bar with more level insides…
      $ps.find(".sp .clickable").click(function(e) {
        e.preventDefault();

        if (!stop && !stopBack) { // this prevents prolbems when clicking very fast on the items
          stop = true;

          // transform the last element of the breadcrumb in a link
          var $last_li = $breadcrumb.find("li:last");
          $last_li.removeClass("last");
          $last_li.wrapInner('<a href="#" data-level="'+ level +'"></a>');

          // get the name of the taxonomy and add it to the breadcrumb
          var name = $(this).parent().find("span:first").html();
          var item = '<li class="last" style="opacity:0;">' + name + '</li>';
          $breadcrumb.append(item);
          $breadcrumb.find("li:last").animate({opacity:1}, data.settings.transitionSpeed);

          // fix the z-index of the list we're about to show
          var $ul = $(this).siblings("ul");
          $ul.css("z-index", zIndex++);
          $ul.show();

          // move to the list and resize it
          $ps.find(".sp").scrollTo("+=" + data.settings.width, data.settings.transitionSpeed, {axis: "x", onAfter: function() {
            stop = false;
            level++;
            _resize($ps, $ul.find("> li").length, data.$this);
          }});
        }
      });

      // The user clicks on the breadcrumb…
      $breadcrumb.find("a").live("click", function(e) {
        e.preventDefault();

        if (!stopBack && !stop) {

          stopBack = true;

          var gotoLevel = $(this).attr("data-level"); // get the level of destination
          var $ul = $(this).siblings("ul").hide();

          _goto($this, gotoLevel);
          level = gotoLevel;

          // scroll to the top of the list
          $ps.find(".inner").data('jsp').scrollTo(0, 0, true);
        }
      });
    });
  };

  // Build popover
  function _goto($ps, gotoLevel) {
    var data = $ps.data(store);
    var $breadcrumb = data.$breadcrumb;

    // Calculate the number of pages we have to move
    var steps = level - gotoLevel;

    if (gotoLevel == 0) { // if we're going to the first page
      $ps.find(".sp").scrollTo(0, steps*data.settings.transitionSpeed, {axis: "x", onAfter: function() {

        $breadcrumb.find("li").slice(1).animate({opacity:0}, 150, function() {
          $(this).remove();

          $breadcrumb.html('<li class="last">All</a>');
          stopBack = false;
        });

        $ps.find(".sp ul ul").hide();
        _resize($ps, $ps.find(".sp ul:visible:first > li").length, data.$this);
      }});
    } else {
      $ps.find(".sp").scrollTo("-=" + steps * data.settings.width, steps*data.settings.transitionSpeed, {axis: "x", onAfter:function() {

        $breadcrumb.find("li").slice(parseInt(gotoLevel) + 1).animate({opacity:0}, data.settingsetransitionSpeed, function() {
          $(this).remove();

          var $last_li = $breadcrumb.find("li:last");
          $last_li.fadeOut(50, function() {
            $last_li.addClass("last");
            $last_li.html($last_li.text());
            $last_li.show(50, function() {
              stopBack = false;
            });
          });
        });
        _resize($ps,$ps.find(".sp ul:visible:eq("+gotoLevel+") > li").length, data.$this);
      }});
    }
  }

  function _resize($ps, elementCount, $this) {
    var data = $ps.data(store);

    $ps.find(".sp").animate({height:elementCount*data.settings.liHeight}, data.settings.transitionSpeed, function() {
      $this.find(".inner").data('jsp').reinitialise();
    });
  }

  // Expose the plugin
  $.fn.taxonomicExplorer = function(method) {
    if (!ie6) {
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === 'object' || !method) {
        return methods.init.apply(this, arguments);
      }
    }
  };


})(jQuery, window, document);


/*
* ===========
* AUTOSUGGEST
* ===========
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
  // Public methods exposed to $.fn.autosuggest()
  methods = {},

  // Test data
  species = [{ name: "Acantocephala", desc: "Family"}, { name: "Actinobacteria", desc: "Especies"}, { name: "Annelida", desc: "Order"}, { name: "Aquificae", desc: "Suborders"}, { name: "Arthropoda", desc: "Especies"}, { name: "Bacteroidetes", desc: "Order"}, { name: "Brachipoda", desc: "Suborders"}, { name: "Cephalorhyncha", desc: "Especies"}, { name: "Chaetognatha", desc: "Especies"}, { name: "Chordata", desc: "Especies"}, { name: "Chromista", desc: "Order"}, { name: "Cnidaria", desc: "Especies"}, { name: "Ctenophora", desc: "Suborders"}, { name: "Fungi", desc: "Order"}, { name: "Plantae", desc: "Especies"}, { name: "Puma Concolor", desc: "Family"}, { name: "Puma", desc: "Order"}],
  // HTML template for the dropdowns
  templates = {
    main: '<div id="<%= name %>_<%= id %>" class="autosuggest"></div>',
    more: '<a href="#" class="more">Add more</a>',
    row: '<div class="row<%= clase %>"><span class="name"><%= name %></span><%= desc %></div>',
    list: '<ul id="listing_<%= name %>_<%= id %>" class="autosuggest_results"></ul>',
    li: '<li><div class="value"><%= value %> <span class="remove"></span><input type="hidden" value="<%= value %>" name="<%= name %>_<%= id %>" /></div></li>',
    result: '<%= value %>'
  },
  store = "autosuggest",

  // Some nice default values
  defaults = {
  };

  // Called by using $('foo').autosuggest();
  methods.init = function(settings) {
    settings = $.extend({}, defaults, settings);

    return this.each(function() {
      var
      // The current element
      $this = $(this),

      // We store lots of great stuff using jQuery data
      data = $this.data(store) || {},

      // This gets applied to the 'ps_container' element
      id = $this.attr('id') || $this.attr('name'),

      // This gets updated to be equal to the longest <option> element
      width = settings.width || $this.outerWidth(),

      // The completed ps_container element
      $ps = false;

      // Dont do anything if we've already setup autosuggest on this element
      if (data.id) {
        return $this;
      } else {
        data.id = id;
        data.$this     = $this;
        data.name      = store;
        data.settings  = settings;
        data.templates = templates;
      }

      // Hide the <select> list and place our new one in front of it
      var $list = _.template(data.templates.list, {name:data.name, id:data.id});
      var $main = _.template(data.templates.main, {name:data.name, id:data.id});
      var $more = _.template(data.templates.more);

      $ps = $(this).parent().wrap($main);
      $ps = $("#"+data.name+"_"+data.id);

      $ps.append($list);
      $ps.append($more);

      $list = $("#listing_"+data.name+"_"+data.id);
      $more = $ps.find(".more");

      $more.click(function(e) {
        e.preventDefault();

        $(this).after($this.parent());
        $this.parent().show("fast")
        $(this).hide("fast");

        _bindAutocomplete($this);
      });


      // Save the updated $ps reference into our data object
      data.$list = $list;
      data.$more = $more;
      data.$ps = $ps;

      // Save the autosuggest data onto the <this> element
      $this.data(store, data);

      _bindAutocomplete($this);
    });
  };

  function _onResult(e, result, formatted, $this) {
    var data = $this.data(store);

    var $li = $(_.template(data.templates.li, {value:result.name, name:data.name, id:data.id}));

    data.$list.append($li);

    $li.find("span").click(function(e) {
      _remove(e, $this);
    });

    $this.val("");
    $this.unautocomplete();
    $this.parent().hide("fast", function() {
      data.$more.fadeIn("fast");
    });
  }

  function _remove(e, $this) {
    var data = $this.data(store);
    var $li = $(e.target).parents("li");

    $li.hide("fast", function() {
      $li.remove();
     });

    if (data.$list.find("li").length == 1) {
      data.$more.hide("fast");
      $this.parent().show("fast")
      _bindAutocomplete($this);
    }
  }

  function _formatItem(row, i, max, data) {
    var clase = "";

    if (max == 1) {
      clase = ' unique';
    } else if (max == 2 && i == 2) {
      clase = ' last_double';
    } else if (i == 1) {
      clase = ' first';
    } else if (i == max ) {
      clase = ' last';
    }

    return  _.template(data.templates.row, {clase:clase, name:row.name, desc:row.desc});
  }

  function _bindAutocomplete($this) {
    var data = $this.data(store);

    $this.autocomplete(species, {
      minChars: 0,
      scroll:false,
      width: 225,
      matchContains: "word",
      autoFill: false,
      max:5,
      formatItem: function(row, i, max) {
        return _formatItem(row, i, max, data);
      },
      formatResult: function(row) {
        return row.name;
      }
    }).result(function(e, result, formatted) {
      _onResult(e, result, formatted, $this);
    });

  }

  // Expose the plugin
  $.fn.autosuggest = function(method) {
    if (!ie6) {
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === 'object' || !method) {
        return methods.init.apply(this, arguments);
      }
    }
  };

})(jQuery, window, document);



/*
* ================
* CRITERIA POPOVER
* ================
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
  // Public methods exposed to $.fn.criteriaPopover()
  methods = {},
  store = "criteria_popover",
  // HTML template for the dropdowns
  templates = {
    main: [
      '<div class="criteria_popover" id="criteria_popover_<%= id %>">',
      '<a href="#" class="select"><%= title %></a>',
      '<div class="criterias">',
      '<div class="arrow"></div>',
      '<div class="background">',
      '<div class="l">',
      '<div class="scrollpane"><ul class="criterias_inner"></ul></div>',
      '</div>',
      '</div>',
      '</div>',
      '<div class="selected_criterias"></div>',
      '<a href="#" class="more">Add more</a>',
      '</div>'
    ].join(''),
    li: '<li><a data-criteria="<%= criteria %>"><span class="label"><%= text %><span></a></li>',

    // Templates for the criterias
    range: ['<div class="refine" data-criteria="<%= criteria %>">',
      '<div id="<%= criteria %>_<%= name %>_<%= id %>" class="range"><h4>RANGE</h4> <input type="text" value="" class="legend" /><div class="slider"><div class="ui-slider-handle"></div><div class="ui-slider-handle last"></div></div></div>',
      '</div>'].join(' '),

    date: ['<div class="refine" data-criteria="<%= criteria %>">',
      '<h4>Date</h4><time id="<%= criteria %>_<%= name %>_<%= id %>_start" class="selectable" datetime="2012/10/22">Oct 22th, 2012</time>  - <time class="selectable" datetime="1981/06/18" id="<%= criteria %>_<%= name %>_<%= id %>_end">Jun 18th, 1981</time>',
      '</div>'].join(' ')
  },

  // Some nice default values
  defaults = { };
  // Called by using $('foo').criteriaPopover();
  methods.init = function(settings) {
    settings = $.extend({}, defaults, settings);

    return this.each(function() {
      var
      // The current <select> element
      $this = $(this),

      // Save all of the <option> elements
      $options = $this.find('option'),

      // We store lots of great stuff using jQuery data
      data = $this.data(store) || {},

      // This gets applied to the 'criteria_popover' element
      id = $this.attr('id') || $this.attr('name'),

      // This gets updated to be equal to the longest <option> element
      width = settings.width || $this.outerWidth(),

      // The completed criteria_popover element
      $ps = false;

      // Dont do anything if we've already setup criteriaPopover on this element
      if (data.id) {
        return $this;
      } else {
        data.settings = settings;
        data.id = id;
        data.name = store;
        data.w = 0;
        data.$this = $this;
        data.options = $options;
        data.templates = templates;
      }

      // Build the dropdown HTML
      $ps = _build(templates.main, data);

      // Hide the <$this> list and place our new one in front of it
      $this.before($ps);

      // Update the reference to $ps
      $ps = $('#criteria_popover_' + id).fadeIn(settings.startSpeed);

      // "Add more" action
      $ps.find('.more').live("click", function(e) {
        e.preventDefault();
        e.stopPropagation();

        var
        $option = $(this),
        $ps = $option.parents('.criteria_popover').first(),
        data = $ps.data(store);

        _toggle(e, $ps);
      });

      // Save the updated $ps reference into our data object
      data.$ps = $ps;

      $ps.find('.criterias .scrollpane').jScrollPane({ verticalDragMinHeight: 20});

      // Save the $this data onto the <$this> element
      $this.data(store, data);

      // Do the same for the dropdown, but add a few helpers
      $ps.data(store, data);

      // hide the source of the data
      $this.hide();

      $ps.find(".select").click(function(e){_toggle(e, $this)});

      $(window).bind('_close.'+data.name+'.'+data.id, function() {
        var $ps = $("#" + data.name + "_" + data.id);
        _close($this);
      });
    });
  };

  // private methods
  function _build(tpl, data) {

    var $ps = $(_.template(tpl, { id:data.id, title:data.$this.html()}));
    var elements = [];
    var max_width = 0;

    _buildItems($ps, data);

    return $ps;
  }

  // Add the items to the list of criterias
  function _buildItems($ps, data) {
    if (data.settings.options &&  data.settings.options.criterias) {

      _.each(data.settings.options.criterias, function(option, i) {
        var $item = _.template(data.templates.li, {criteria:option.criteria, text:option.label});

        $ps.find("ul.criterias_inner").append($item);
      });

      // we need to add these classes for iE
      $ps.find("ul li:first").addClass("first");
      $ps.find("ul li:last").addClass("last");
    }
  }

  // Close a dropdown
  function _close($this) {
    var data = $this.data(store);
    GOD.unsubscribe("_close."+data.name+"."+data.id);

    data.$ps.removeClass('ps_open');
  }

  // Open a dropdown

  function _toggle(e, $this) {
    e.preventDefault();
    e.stopPropagation();

    var data = $this.data(store);
    var $ps = data.$ps;

    // setup the close event & signal the other subscribers
    var event = "_close."+data.name+"."+data.id;
    GOD.subscribe(event);
    GOD.broadcast(event);

    if ($ps.hasClass("ps_open")) {
      $ps.removeClass('ps_open');
    } else {

      $ps.addClass('ps_open');

      var w = $ps.find("ul.criterias_inner").width();
      var h = $ps.find("ul.criterias_inner").height()

      var widerElement = _.max($ps.find(".criterias li"), function(f){ return $(f).width() });
      w = $(widerElement).width();

      if (w > data.w) {
        data.w = w;
      }

      $ps.find(".criterias .background").width(data.w + 15);
      var api = $ps.find(".criterias .scrollpane").data('jsp');
      api.reinitialise();

      // Uncomment the following line to reset the scroll
      // api.scrollTo(0, 0);

      $ps.find(".jspContainer").width(data.w + 15);
      $ps.find(".jspPane").width(data.w + 15);

      var $select = $ps.find(".select:visible");

      if ($select.length < 1) {
        $select = $ps.find(".more");
      }

      var x = $select.position().left;
      var y = $select.position().top;
      var w = $ps.find(".criterias").width();
      var h = $ps.find(".criterias").height();

      $ps.find(".criterias").css("left", x - w/2 + 40);
      $ps.find(".criterias").css("top", y + 5);

      $ps.find('.jspVerticalBar').click(function(e) {
        e.stopPropagation();
      });
    }
  }

  $(function() {

    // Bind remove action over an element (for a future implementation)
    $('.selected_criterias .remove').live('click', function(e) {

      var $option = $(this);
      var $ps   = $option.parents('.criteria_popover').first();
      var count = $ps.find(".selected_criterias > div").length;

      var countSelected = $ps.find(".selected_criterias > div").length;
      var countOptions  = $ps.find(".criterias_inner li").length;

      if (count <= 1) {
        $ps.find(".select").show();
        $ps.find(".more").hide();
      } else if (count == countOptions) {
        $ps.find(".more").show();
      }

      var selected = $option.parent().attr('data-criteria');

      // Remove the element from the temporary list
      $option.parent().remove();

      // Remove the hide class
      var $selected_element = $ps.find("ul.criterias_inner li a[data-criteria=" + selected + "]").parent();

      $selected_element.removeClass("hidden");
      _close($ps);
    });

    // Bind click action over an original element
    $('.criterias a').live('click', function(e) {

      e.preventDefault();
      e.stopPropagation();

      var $option = $(this);
      var $ps = $option.parents('.criteria_popover').first();
      var data = $ps.data(store);

      var $selected_element = $ps.find(".selected_criterias > div a[data-criteria=" + $option.attr("data-criteria") + "]").parent();

      if ($selected_element.length < 1) {

        $ps.find("a.select").hide();

        var countSelected = $ps.find(".selected_criterias > div").length;
        var countOptions  = $ps.find(".criterias_inner li").length;

        _close($ps);

        if (countSelected + 1 < countOptions) {
          $ps.find("a.more").show();
        } else {
          $ps.find("a.more").hide();
        }

        $selected = $option.parent();
        $selected.addClass('hidden');

        // Append the criteria selector to the DOM
        var criteria = $selected.find("a").attr("data-criteria");
        var $criteria = _.template(data.templates[criteria], {criteria: criteria, name:data.name, id:data.id});
        $ps.find(".selected_criterias").append($criteria);

        // Criteria activations/callbacks
        if (criteria == "range") {
          $criteria = $('.selected_criterias #' + criteria + '_' + data.name + '_' + data.id);

          $criteria.parent().show("fast");
          $criteria.bindSlider(0, 500, [0, 500]);

        } else if (criteria == "date") {

          var $criteria_start = $('.selected_criterias #' + criteria + '_' + data.name + '_' + data.id+'_start');
          var $criteria_end   = $('.selected_criterias #' + criteria + '_' + data.name + '_' + data.id+'_end');

          $criteria = $criteria_start;
          $criteria.parent().show("fast");
          $criteria_start.datePopover();
          $criteria_end.datePopover();
        }
      }
    });
  });

  // Expose the plugin
  $.fn.criteriaPopover = function(method) {
    if (!ie6) {
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === 'object' || !method) {
        return methods.init.apply(this, arguments);
      }
    }
  };

})(jQuery, window, document);
