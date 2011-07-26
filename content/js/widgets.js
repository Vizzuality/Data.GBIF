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
    var x = $this.offset().left;
    var y = $this.offset().top;
    var w = $ps.width();
    var h = $ps.height();

    $ps.css("left", x - w/2 + 7);

    if (oldIE) {
      $ps.css("top", y - h - 5);
    } else {
      $ps.css("top", y - h - 10);
    }
  }

  $(function() {

  });

})(jQuery, window, document);

/*
* ==============
* SELECT POPOVER
* ==============
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
  // Public methods exposed to $.fn.selectPopover()
  methods = {},

  // HTML template for the dropdowns
  templates = {
    main: [
      '<div class="ps_container" id="ps_container_<%= id %>">',
        '<a href="#" class="select">Any value</a>',
        '<div class="ps_options">',
        '<div class="arrow"></div>',
        '<div class="background">',
          '<div class="l">',
            '<div class="scrollpane">',
              '<ul class="ps_options_inner"></ul>',
            '</div>',
          '</div>',
        '</div>',
      '</div>',
      '<ul class="ps_selected"></ul>',
      '<a href="#" class="more">Add more</a>',
      '</div>'
    ].join(''),

    li: '<li><a ps-value="<%=value %>"><span class="label"><%= text %><span></a> <span class="remove"><img src="/img/icons/cross.png" /></span></li>'
  },

  // Some nice default values
  defaults = {
    startSpeed: 1000,
    // I recommend a high value here, I feel it makes the changes less noticeable to the user
    change: false
  };
  // Called by using $('foo').selectPopover();
  methods.init = function(settings) {
    settings = $.extend({}, defaults, settings);

    return this.each(function() {
      var
      // The current <select> element
      $this = $(this),

      // Save all of the <option> elements
      $options = $this.find('option'),

      // We store lots of great stuff using jQuery data
      data = $this.data('selectPopover') || {},

      // This gets applied to the 'ps_container' element
      id = $this.attr('id') || $this.attr('name'),

      // This gets updated to be equal to the longest <option> element
      width = settings.width || $this.outerWidth(),

      // The completed ps_container element
      $ps = false;

      // Dont do anything if we've already setup selectPopover on this element
      if (data.id) {
        return $this;
      } else {
        data.settings = settings;
        data.id = id;
        data.name      = "selectPopover";
        data.w = 0;
        data.$this = $this;
        data.options = $options;
      }

      // Build the dropdown HTML
      $ps = _build(templates.main, data);

      // Hide the <$this> list and place our new one in front of it
      $this.before($ps);

      // Update the reference to $ps
      $ps = $('#ps_container_' + id).fadeIn(settings.startSpeed);

      // Save the updated $ps reference into our data object
      data.$ps = $ps;

      $ps.find('.ps_options .scrollpane').jScrollPane({ verticalDragMinHeight: 20});

      // Save the $this data onto the <$this> element
      $this.data('selectPopover', data);

      // Do the same for the dropdown, but add a few helpers
      $ps.data('selectPopover', data);

      // hide the source of the data
      $this.hide();

      $ps.find(".select").click(function(e){_toggle(e, $this)});

      $(window).bind('_close.'+data.name+'.'+data.id, function() {
        var $ps = $("#" + data.name + "_" + data.id);
        _close($this);
      });
    });
  };

  // Expose the plugin
  $.fn.selectPopover = function(method) {
    if (!ie6) {
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === 'object' || !method) {
        return methods.init.apply(this, arguments);
      }
    }
  };

  // private methods
  function _build(tpl, view) {

    var $ps = $(_.template(tpl, view));
    var elements = [];
    var max_width = 0;

    _.each(view.options, function(option, index) {

      var value = $(option).attr("value");
      var text = $(option).html();

      var li = _.template(templates.li, { value: value, text: text });
      elements.push(li);
    });

    $ps.find("ul.ps_options_inner").append(elements.join(" "));

    return $ps;
  }

  // Close a dropdown
  function _close($this) {
    var data = $this.data('selectPopover');
    GOD.unsubscribe("_close."+data.name+"."+data.id);

    data.$ps.removeClass('ps_open');
  }

  // Open a dropdown

  function _toggle(e, $this) {
    e.preventDefault();
    e.stopPropagation();

    var data = $this.data('selectPopover');
    var $ps = data.$ps;

    // setup the close event & signal the other subscribers
    var event = "_close."+data.name+"."+data.id;
    GOD.subscribe(event);
    GOD.broadcast(event);

    if ($ps.hasClass("ps_open")) {
      $ps.removeClass('ps_open');
    } else {

      $ps.addClass('ps_open');

      var w = $ps.find("ul.ps_options_inner").width();
      var h = $ps.find("ul.ps_options_inner").height()

      var widerElement = _.max($ps.find(".ps_options li"), function(f){ return $(f).width() });
      w = $(widerElement).width();

      if (w > data.w) {
        data.w = w;
      }

      $ps.find(".ps_options .background").width(data.w + 15);
      var api = $ps.find(".ps_options .scrollpane").data('jsp');
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
      var w = $ps.find(".ps_options").width();
      var h = $ps.find(".ps_options").height();

      $ps.find(".ps_options").css("left", x - w/2 + 40);
      $ps.find(".ps_options").css("top", y + 5);

      $ps.find('.jspVerticalBar').click(function(event) {
        event.stopPropagation();
      });
    }
  }

  $(function() {
    // Bind remove action over an element
    $('.ps_selected .remove').live('click', function(e) {

      var $option = $(this);
      var $ps   = $option.parents('.ps_container').first();
      var count = $ps.find(".ps_selected li").length;

      var countSelected = $ps.find(".ps_selected li").length;
      var countOptions = $ps.find(".ps_options_inner li").length;

      if (count <= 1) {
        $ps.find(".select").show();
        $ps.find(".more").hide();
      } else if (count == countOptions) {
        $ps.find(".more").show();
      }

      var selected = $option.siblings('a').attr('ps-value');

      // Remove the element from the temporary list
      $option.parent().remove();

      // Remove the hide class
      var $selected_element = $ps.find("ul.ps_options_inner li a[ps-value=" + selected + "]").parent();

      $selected_element.removeClass("hidden");
      _close($ps);
    });

    // "Add more" action
    $('a.more').live('click', function(e) {
      e.preventDefault();
      e.stopPropagation();

      var
      $option = $(this),
      $ps = $option.parents('.ps_container').first(),
      data = $ps.data('selectPopover');

      _toggle(e, $ps);
    });

    // Bind click action over an original element
    $('.ps_options a').live('click', function(e) {

      e.preventDefault();
      e.stopPropagation();

      var $option = $(this);
      var $ps = $option.parents('.ps_container').first();
      var data = $ps.data('selectPopover');

      var $selected_element = $ps.find(".ps_selected li a[ps-value=" + $option.attr("ps-value") + "]").parent();

      if ($selected_element.length < 1) {

        $ps.find("a.select").hide();

        var countSelected = $ps.find(".ps_selected li").length;
        var countOptions  = $ps.find(".ps_options_inner li").length;

        _close($ps);
        if (countSelected + 1 < countOptions) {
          $ps.find("a.more").show();
        } else {
          $ps.find("a.more").hide();
        }

        $selected = $option.parent();
        $selected.addClass('hidden');

        var $c = _.template(templates.li, { value: $option.attr("ps-value"), text: $option.html()});

        $ps.find(".ps_selected").append($c);
      }
    });
  });
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
    '</div>'].join(' ')
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

      $this.click(_toggle);

      $(window).bind('_close.'+data.name+'.'+data.id, function() {
        var $ps = $("#" + data.name + "_" + data.id);
        _close($this, $ps);
      });
    });
  };

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



/*
* =============
* SELECT BOX
* =============
*/

var selectBox = (function() {
  var el;
  var selectedOptionText = "";
  var displayed = false;
  var $popover;
  var transitionSpeed = 200;

  $(function() {
    $(window).bind('_close.selectbox', hide);
  });

  function toggle(e, event, opt) {
    event.stopPropagation();

    el = e;

    if (opt) {
      transitionSpeed = opt.transitionSpeed;
      transitionSpeed = opt.transitionSpeed;
    }

    displayed ? hide(): show();
  }

  function select_option(option_text) {
    selectedOptionText = option_text;
    $popover.find("a").removeClass("selected");
    var selected_option = $('a *:contains('+selectedOptionText+')');
    selected_option.parent().addClass("selected");
  }

  function hide() {
    el.removeClass("selected");
    displayed = false;

    GOD.unsubscribe("_close.selectbox");
  }

  function show() {
    el.toggleClass("selected");

    var w = el.find(".selected_option").width();
    el.find(".inner").css("width", w);

    el.find('ul').jScrollPane({ verticalDragMinHeight: 20});
    displayed = true;

    // setup the close event & signal the other subscribers
    var event = "_close.selectbox";
    GOD.subscribe(event);
    GOD.broadcast(event);


    // don't do anything if we click inside of the select…
    el.find('.listing, .jspVerticalBar').click(function(event) {
      event.stopPropagation();
    });

    el.find("li").unbind("click");

    el.find("li").click(function(event) {
      var text = $(this).text();

      el.find("li").removeClass("selected");
      $(this).addClass("selected");

      if (text != selectedOptionText) {
        el.find("div.selected_option span").animate({ color: "#FFFFFF" }, transitionSpeed, function(){
          el.find("div.selected_option span").text(text);
          el.find("div.selected_option span").animate({ color: "#333" }, transitionSpeed);
        });
      }
      selectedOptionText = text;
      $("input#country").val(selectedOptionText);
      hide();
    });
  }

  return {
    toggle: toggle
  };
})();

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
* ============
* SORT POPOVER
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
  // Public methods exposed to $.fn.sortPopover()
  methods = {},
  store = "sortpopover",

  // HTML template for the dropdowns
  templates = {
    main: [
      '<div id="<%= name %>_<%= id %>" class="white_popover">',
      '<div class="arrow"></div>',
      '<ul></ul>',
      '</div>'].join(''),
    item: '<li><a href="#"><span><%= name %></span></a></li>'
  },

  // Some nice default values
  defaults = {
    options:['<li class="first"><a href="#" class="relevance"><span>Sort by relevance</span></a></li>',
      '<li><a href="#" class="occurrence"><span>Sort by ocurrence</span></a></li>',
      '<li class="last"><a href="#" class="size"><span>Sort by size</span></a></li>'].join('')
  };

  // Called by using $('foo').sortPopover();
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

      // Dont do anything if we've already setup sortPopover on this element
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

      // Save the sortPopover data onto the <select> element
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

  // Expose the plugin
  $.fn.sortPopover = function(method) {
    if (!ie6) {
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === 'object' || !method) {
        return methods.init.apply(this, arguments);
      }
    }
  };
  function _buildItems($ps, data) {
    _.each(data.settings.options, function(callback, name) {
      var $item = _.template(data.templates.item, {name:name});
      $ps.find("ul").append($item);
      $ps.find("ul li:last a").click(function(e) {
        callback(e);
      _close(data.$this, data.name, data.id);
      var selectedOptionText = $(this).text();
      data.$this.html(selectedOptionText + "<span class='more'></span>");
      });
    });

    $ps.find("ul li:first").addClass("first");
    $ps.find("ul li:last").addClass("last");
  }

  // Build popover
  function _build(data, selectedOption) {

    var $ps = $(_.template(data.templates.main, {id:data.id, name:data.name}));

    $ps.bind('click', function(e) {
      e.stopPropagation();
    });

    return $ps;
  }

  function _selectOption($ps, optionText) {
    $ps.find("li.selected").removeClass("selected");
    $ps.find("span:contains('"+optionText+"')").parent().addClass("selected");
  }

  // Refresh popover
  function _refresh($this, name, id) {
    var $ps = $("#" + name + "_" + id);
    if ($this.hasClass("open")) {

      var x = $this.find("span").offset().left;
      var y = $this.find("span").offset().top;
      var w = $ps.width();

      if (oldIE) {
        $ps.css("top", y);
      } else {
        $ps.css("top", y);
      }

      $ps.css("left", x - w/2 + 4);
    }
  }

  // Center popover
  function _center ($this, $ps) {
    var x = $this.find("span").offset().left;
    var y = $this.find("span").offset().top;
    var w = $ps.width();

    $ps.css("left", x - w/2 + 4);

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
      $ps.prepend('<div class="breadcrumb" />');
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

          if ($(this).find("ul").length > 0) {
            clase = ' clickable';
          }

          $(this).find("span:first").after("<div class='bar"+clase+"' style='width:"+(value+10)+"px'><div class='count'>"+value+"</div></div>");

          $(this).find("a").hover(function() {
            $(this).parent().parent().stop(true).find(".count:first").fadeIn(150);
          }, function() {
            $(this).parent().parent().stop(true).find(".count:first").fadeOut(150);
          });

          $(this).find(".bar").hover(function() {
            $(this).find(".count").fadeIn(150);
          }, function() {
            $(this).find(".count").fadeOut(150);
          });
        });

        $ul.children().each(function() {
          addBars($(this));
        });
      }

      addBars($ps.find("ul:first"));

      $ps.find(".sp .bar.clickable").click(function(e) {
        e.preventDefault();

        if (!stop) { // this prevents prolbems when clicking very fast on the items
          stop = true;

          var name = $(this).parent().find("a").html();
          var item = '<li style="opacity:0;"><a href="#" data-level="' + level + '">' + name + '</a></li>';
          $breadcrumb.append(item);
          $breadcrumb.find("li:last").animate({opacity:1}, 500);

          var $ul = $(this).siblings("ul");
          $ul.css("z-index", zIndex++);
          $ul.show();

          $ps.find(".sp").scrollTo("+=" + data.settings.width, data.settings.transitionSpeed, {axis: "x", onAfter: function() {
            stop = false;
            level++;
            _resize($ps, $ul.find("> li").length, data.$this);
          }});
        }
      });

      $breadcrumb.find("a").live("click", function(e) {
        e.preventDefault();
        var gotoLevel = $(this).attr("data-level");
        var $ul = $(this).siblings("ul").hide();

        _goto($this, gotoLevel);
        level = gotoLevel;
        $ps.find(".inner").data('jsp').scrollTo(0, 0, true);
      });
    });
  };

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

  // Build popover
  function _goto($ps, gotoLevel) {
    var data = $ps.data(store);
    var $breadcrumb = data.$breadcrumb;

    // Calculate the number of pages we have to move
    var steps = level - gotoLevel;

    if (gotoLevel == 0) {
      $ps.find(".sp").scrollTo(0, steps*data.settings.transitionSpeed, {axis: "x", onAfter: function() {
        $breadcrumb.empty();
        $ps.find(".sp ul ul").hide();
        _resize($ps, $ps.find(".sp ul:visible:first > li").length, data.$this);
      }});

    } else {

      $ps.find(".sp").scrollTo("-=" + steps * data.settings.width, steps*data.settings.transitionSpeed, {axis: "x", onAfter:function() {
        $breadcrumb.find("li").slice(gotoLevel).animate({opacity:0}, data.settingsetransitionSpeed, function() { $(this).remove(); });
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

  $(function() {});

})(jQuery, window, document);
