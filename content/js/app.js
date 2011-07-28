$(function(){

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
$('div.graph').each(function(index) {
  $(this).find('ul li .bar').each(function(index) {
    var width = $(this).parents("div").attr("class").replace(/graph /, "");
    $(this).parent().css("width", width);

    var value = $(this).text();

    $(this).delay(index*100).animate({ height: value }, 400, 'easeOutBounce');
  });
});

$('div.graph ul li a').click(function(e){
  e.preventDefault();
});

  $(".selectbox").selectBox();
  $("#taxonomy").taxonomicExplorer({transitionSpeed:300});

  // Some help messages
  $("a#puma_help_1").helpPopover({title:"Help in images", message:"Remember to give <strong>display:block</strong> or <strong>display:inline-block</strong> to the link that opens this message so it can set the alignment right."});
  $("a#help").helpPopover({title:"Hi, I'm a yellow popover", message:"This is a <strong>message</strong> with a <a href='http://www.gbif.org/'>link</a>."});
  $("a#help2").helpPopover({title:"Hi, I'm a yellow popover", message:"This is a <strong>message</strong> with a <a href='http://www.gbif.org/'>link</a>."});
  $("a#help3").helpPopover({title:"Hi, I'm a yellow popover", message:"This is a <strong>message</strong> with a <a href='http://www.gbif.org/'>link</a>."});
  $("a#help4").helpPopover({title:"Hi, I'm a yellow popover", message:"This is a <strong>message</strong> with a <a href='http://www.gbif.org/'>link</a>."});

  $("a.download").bindDownloadPopover({explanation:"Occurrences of \"Puma concolor\", collected between Jan 1sr, 2000 and Jan 1st, 2010, from dataset \"Felines of the world\"."});
  $("a.download_2").bindDownloadPopover({template: "direct_download", explanation:"Occurrences of \"Puma concolor\", collected between Jan 1sr, 2000 and Jan 1st, 2010, from dataset \"Felines of the world\"."});

  $("a.login").bindLoginPopover();

 // Dropdown for the sorting options of the taxonomic explorer
  $('#tax_sort_ocurrences').dropdownPopover({
    options: {
      links: [
        { name: "Sort alphabetically",
          callback: function(e) {
            e.preventDefault();
            $("#taxonomy .sp").animate({opacity:0}, 500, function() {
              sortAlphabetically($("#taxonomy .sp ul:first"));
              $("#taxonomy .sp").animate({opacity:1}, 500);
            });
          },
          replaceWith:'Sort alphabetically<span class="more"></span>'
      },
      { name: "Sort by count",
        callback: function(e) {
          e.preventDefault();
          $("#taxonomy .sp").animate({opacity:0}, 500, function() {
            sortByCount($("#taxonomy .sp ul:first"));
            $("#taxonomy .sp").animate({opacity:1}, 500);
          });
        },
        replaceWith:'Sort by count<span class="more"></span>'
      }
      ]
    }
  });


 // Dropdown for the language selector
 $('#language_selector').dropdownPopover({
   options: {
     links: [
       { name: "English",
       callback: function(e) { e.preventDefault(); /* add callback action here */ },
       replaceWith: "<span>EN</span>",
       select: "EN"
     },
     { name: "Spanish",
       callback: function(e) { e.preventDefault(); /* add callback action here */ },
       replaceWith: "<span>ES</span>",
       select: "ES"
     },
     { name: "Deutsch",
       callback: function(e) { e.preventDefault(); /* add callback action here */ },
       replaceWith: "<span>DE</span>",
       select: "DE"
     }
     ]
   }
 });


  $('span.input_text input').focus(function() {
    $(this).parent().addClass("focus");
  });

  $('span.input_text input').focusout(function() {
    $(this).parent().removeClass("focus");
  });

  $("article#slideshow-1").bindSlideshow();

var processes = {
  dates:[ {start:"2011-1-1", end: "2011-2-11", title: "123 - HARVESTING ", message:"No processes"},
      {start:"2011-3-1", title: "123 - HARVESTING ", message:"No processes"},
        {start:"2011-4-1", end:"2011-4-25", title: "123 - HARVESTING ", message:"No processes"},
          {start:"2011-5-1", title: "123 - HARVESTING ", message:"No processes"},
            {start:"2011-6-1", title: "123 - HARVESTING ", message:"No processes"},
              {start:"2011-7-1", title: "123 - HARVESTING ", message:"No processes"},
                {start:"2011-8-1", title: "123 - HARVESTING ", message:"No processes"}
  ]};

  if ($("#holder").length ) {
    dataHistory.initialize(generateRandomValues(365), {height: 180, processes: processes});
    dataHistory.show();
  }
})
