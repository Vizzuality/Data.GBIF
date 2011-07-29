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
    li: '<li><div class="value"><%= name %> <span class="remove"></span></div></li>',
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

      console.log($ps);
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

    var $li = $(_.template(data.templates.li, {name:result.name}));

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

    console.log(data.$list.find("li").length)

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

$(".autocomplete input").autosuggest();
