var species = [{ name: "Acantocephala", desc: "Family"}, { name: "Actinobacteria", desc: "Especies"}, { name: "Annelida", desc: "Order"}, { name: "Aquificae", desc: "Suborders"}, { name: "Arthropoda", desc: "Especies"}, { name: "Bacteroidetes", desc: "Order"}, { name: "Brachipoda", desc: "Suborders"}, { name: "Cephalorhyncha", desc: "Especies"}, { name: "Chaetognatha", desc: "Especies"}, { name: "Chordata", desc: "Especies"}, { name: "Chromista", desc: "Order"}, { name: "Cnidaria", desc: "Especies"}, { name: "Ctenophora", desc: "Suborders"}, { name: "Fungi", desc: "Order"}, { name: "Plantae", desc: "Especies"}, { name: "Puma Concolor", desc: "Family"}, { name: "Puma", desc: "Order"}];

$(".autocomplete input").autocomplete(species, {
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

    return  '<div class="row' + clase + '"><span class="name">' + row.name + '</span> ' + row.desc + '</div>';
  },
  formatResult: function(row) {
    return row.name;
  }
});


function onResult(event, data, formatted) {
  console.log(event,data, formatted);
}
