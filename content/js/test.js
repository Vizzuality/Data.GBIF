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
  // Public methods exposed to $.fn.helpPopover2()
  methods = {},

  // HTML template for the dropdowns
  templates = {
    main: ['<div id="<%= name %>_<%= id %>" class="yellow_popover"><div class="t"></div><div class="c"><h3><%= title %></h3><%= message %></div><div class="b"></div></div>'].join('')
  },
  store = "helppopover",

  // Some nice default values
  defaults = {
  };

  // Called by using $('foo').helpPopover2();
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

      // Dont do anything if we've already setup helpPopover2 on this element
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

      // Save the helpPopover2 data onto the <this> element
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
  $.fn.helpPopover2 = function(method) {
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

})(jQuery, window, document);
