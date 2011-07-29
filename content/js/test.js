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
      '<ul class="selected_criterias"></ul>',
      '<a href="#" class="more">Add more</a>',
      '</div>'
    ].join(''),
    li: '<li><a data-criteria="<%= criteria %>"><span class="label"><%= text %><span></a></li>',

    // Templates for the criterias
    range: ['<li class="criteria" data-criteria="<%= criteria %>">',
      '<div id="<%= criteria %>_<%= name %>_<%= id %>" class="range"><h4>RANGE</h4> <input type="text" value="" class="legend" /><div class="slider"><div class="ui-slider-handle"></div><div class="ui-slider-handle last"></div></div></div>',
      '</li>'].join(' '),

    date: ['<li class="criteria" data-criteria="<%= criteria %>">',
      '<time id="<%= criteria %>_<%= name %>_<%= id %>_start" class="selectable" datetime="2012/10/22">Oct 22th, 2012</time>  - <time class="selectable" datetime="1981/06/18" id="<%= criteria %>_<%= name %>_<%= id %>_end">Jun 18th, 1981</time>',
      '</li>'].join(' ')
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
      var count = $ps.find(".selected_criterias li").length;

      var countSelected = $ps.find(".selected_criterias li").length;
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

      var $selected_element = $ps.find(".selected_criterias li a[data-criteria=" + $option.attr("data-criteria") + "]").parent();

      if ($selected_element.length < 1) {

        $ps.find("a.select").hide();

        var countSelected = $ps.find(".selected_criterias li").length;
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
          $criteria.bindSlider(0, 500, [0, 500]);

          $criteria.parent().show("fast");

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
