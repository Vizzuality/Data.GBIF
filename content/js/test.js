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
    row: '<div class="row<%= clase %>"><span class="name"><%=name %></span><%= desc %></div>',
    list: '<ul id="listing_<%= name %>_<%= id %></ul>',
    result: ['<%= value %>'].join(' ')
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
      var $list = $(_.template(data.templates.list, {name:data.name, id:data.id}));
      $this.after($list);

      $list = $("#listing_"+data.name+"_"+data.id);

      // Save the updated $ps reference into our data object
      data.$list = $list;
      data.$ps = $ps;

      // Save the autosuggest data onto the <this> element
      $this.data(store, data);

      $(this).autocomplete(species, {
        minChars: 0,
        scroll:false,
        width: 225,
        matchContains: "word",
        autoFill: false,
        max:5,
        formatItem: function(row, i, max) {
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
        },
        formatResult: function(row) {
          return row.name;
        }
      }).result(_onResult);

      function _onResult(e, result, formatted) {
        console.log(e, result, formatted);
        console.log($this);

        $this.parent().next(".ac_results").append('<li>' + result.name + '</li>');
        $this.parent().hide("fast");
      }

    });
  };

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
