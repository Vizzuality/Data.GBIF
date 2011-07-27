/*
* ================
* PLUGIN STRUCTURE
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
    // Public methods exposed to $.fn.selectBox()
    methods = {},
    store = "selectbox",

        // HTML template for the dropdowns
        templates = {
            main: ['<div id="<%= name %>_<%= id %>" class="select-box">',
          '<div class="selected_option"><span>Select country</span></div>',
          '</div>'].join(''),
         list:['<div id="list_<%= name %>_<%= id %>" class="listing">',
          '<div class="inner">',
          '<ul><%= options %></ul>',
          '</div>',
          '</div>'].join(' ')
        },

        // Some nice default values
        defaults = {
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

            // The completed ps_container element
            $ps = false;

            console.log($this);
            // Save all of the <option> elements
            $options = $this.find('option');

            // Dont do anything if we've already setup selectBox on this element
            if (data.id) {
                return $this;
            } else {
                data.id = id;
                data.$this = $this;
                data.settings = settings;
                data.templates = templates;
                data.name = store;
                data.options = $options;
            }

            // Build the dropdown HTML
            $ps = _build(templates.main, data);

            $this.hide();

            var options = "";

            console.log(data.options);
            for (var i = 0; i < data.options.length; i++) {
              options += '<li>' + $(data.options[i]).html() + '</li>';
            };

            var $l = $(_.template(data.templates.list, {name:data.name, id:data.id, options:options}));
            $l.addClass("open");
            $("#content").append($l);

            // Hide the <select> list and place our new one in front of it
            $this.before($ps);

            // Update the reference to $ps
            $ps = $('#' + data.name + "_" + data.id);

            // Save the updated $ps reference into our data object
            data.$ps = $ps;

            // Save the selectBox data onto the <select> element
            $this.data(store, data);

            // Do the same for the dropdown, but add a few helpers
            $ps.data(store, data);

            console.log($ps, name, id);
            $ps.live("click", _toggle);
        });
    };

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

    // Build popover
    function _build(template, data) {
      var $ps = _.template(template, {name:data.name, id:data.id});

      return $ps;
    }

    // Close popover
    function _close($ps) {
      var data = $ps.data(store);
      GOD.unsubscribe("_close."+data.name+"."+data.id);

      $ps.removeClass("open");
    }

    // Open a popover
  function _toggle(e) {
    e.preventDefault();
    e.stopPropagation();

    var $this = $(this);
    var data = $this.data(store);
    var $ps = $('#' + data.name + "_" + data.id);

    if ($ps.hasClass("open")) {
      _close($this, $ps);
    } else {

//
//      $l.css("top", $ps.position().top);
//      $l.css("left", $ps.position().left);
//
//      $l.addClass("open");
      $ps.addClass("open");
      // setup the close event & signal the other subscribers
      var event = "_close."+data.name+"."+data.id;
      GOD.subscribe(event);
      GOD.broadcast(event);
    }
  }

    $(function() {});

})(jQuery, window, document);

/*
* =============
* SELECT BOX
* =============
*/

var selectBoxOld = (function() {
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

