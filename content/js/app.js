$(function(){
  var values = generateRandomValues(365);
  var processes = { dates:[
    {start:"2011-1-1", end: "2011-2-11", url:"http://www.google.com"},
    {start:"2011-3-1", url:"http://www.google.com"},
    {start:"2011-4-1", end:"2011-4-25", url:"http://www.google.com"},
    {start:"2011-5-1", url:"http://www.google.com" },
    {start:"2011-6-1", url:"http://www.google.com"},
    {start:"2011-7-1", url:"http://www.google.com"},
    {start:"2011-8-1", url:"http://www.google.com"}]};

  if ($("#holder").length ) {
    dataHistory.initialize(values, {height: 180, processes: processes});
    dataHistory.show();
  }

  $('div.graph').each(function(index) {
    $(this).find('ul li .bar').each(function(index) {
      var width = $(this).parents("div").attr("class").replace(/graph /, "");
      $(this).parent().css("width", width);

      var value = $(this).text();

      $(this).delay(index*100).animate({ height: value }, 400, 'easeOutBounce');
    });
  });

  $('.dropdown').click(function(e){
    e.preventDefault();
    $(this).toggleClass("selected");
  });

  $('div.graph ul li a').click(function(e){
    e.preventDefault();
  });

  $(".select").selectBox();

  $("#taxonomy").taxonomicExplorer({transitionSpeed:300});

  $("time.selectable").datePopover();

  $("#select-popover, #select-popover2").selectPopover();

var emails = [{
    name: "Peter Pan",
    to: "Especies"
}, {
    name: "Puma Concolor",
    to: "Family"
}, {
    name: "Puma",
    to: "Order"
}, {
    name: "Tiger",
    to: "Family"
}, {
    name: "Tiger Lilly",
    to: "Subespecies"
}, {
    name: "Tiger II",
    to: "Subespecies"
}, {
    name: "Mc Chick",
    to: "Family"
}, {
    name: "Donnie Darko",
    to: "Family"
}, {
    name: "Quake The Net",
    to: "Subespecies"
}, {
    name: "Dr. Write",
    to: "Species"
}];

$(".autocomplete input").autocomplete(emails, {
  minChars: 0,
  scroll:false,
  width: 225,
  matchContains: "word",
  autoFill: false,
  max:3,
  formatItem: function(row, i, max) {
    //return i + "/" + max + ": \"" + row.name + "\" [" + row.to + "]";
    return  '<div class="row"><span class="name">' + row.name + '</span> ' + row.to + '</div>';
  },
  formatResult: function(row) {
    return row.name;
  }
});


  $("a#puma_help_1").helpPopover({title:"Help in images", message:"Remember to give <strong>display:block</strong> or <strong>display:inline-block</strong> to the link that opens this message so it can set the alignment right."});

  $("a#help").helpPopover({title:"Hi, I'm a yellow popover", message:"This is a <strong>message</strong> with a <a href='http://www.gbif.org/'>link</a>."});
  $("a#help2").helpPopover({title:"Hi, I'm a yellow popover", message:"This is a <strong>message</strong> with a <a href='http://www.gbif.org/'>link</a>."});
  $("a#help3").helpPopover({title:"Hi, I'm a yellow popover", message:"This is a <strong>message</strong> with a <a href='http://www.gbif.org/'>link</a>."});
  $("a#help4").helpPopover({title:"Hi, I'm a yellow popover", message:"This is a <strong>message</strong> with a <a href='http://www.gbif.org/'>link</a>."});

  $("a.download").bindDownloadPopover({explanation:"Occurrences of \"Puma concolor\", collected between Jan 1sr, 2000 and Jan 1st, 2010, from dataset \"Felines of the world\"."});
  $("a.download_2").bindDownloadPopover({template: "direct_download", explanation:"Occurrences of \"Puma concolor\", collected between Jan 1sr, 2000 and Jan 1st, 2010, from dataset \"Felines of the world\"."});
  $("a.login").bindLoginPopover();

  $('#tax_sort_ocurrences').sortPopover({
    options: {
      "Sort alphabetically": function(e) {
        e.preventDefault();
        $("#taxonomy .sp").animate({opacity:0}, 500, function() {
          sortAlphabetically($("#taxonomy .sp ul:first"));
          $("#taxonomy .sp").animate({opacity:1}, 500);
        });
      },
      "Sort by count": function(e) {
        e.preventDefault();
        $("#taxonomy .sp").animate({opacity:0}, 500, function() {
          sortByCount($("#taxonomy .sp ul:first"));
          $("#taxonomy .sp").animate({opacity:1}, 500);
        });
      }
    }
  });

  $('#language_selector').sortPopover({
    options: {
      "English": function(e) {
        e.preventDefault();
      },
      "Castellano": function(e) {
        e.preventDefault();
      }
    }

  })	;


  $('span.input_text input').focus(function() {
    $(this).parent().addClass("focus");
  });

  $('span.input_text input').focusout(function() {
    $(this).parent().removeClass("focus");
  });


  $(".range").bindSlider(0, 500, [0, 500]);

  $("article#slideshow-1").bindSlideshow();

  function generateRandomValues2(limit) {
    var last = 0;
    var values = [];
    var random = 100;

    for (var i=0; i<=limit; i++) {
      random = Math.floor(Math.random()*20);
      values[i] = random;
    }
    return values;
  }

  var values = generateRandomValues2(365);



  function drawPie(ob, r, percentage) {
    var endAngle = Math.floor(percentage / 100 * 360);

    var container_id = ob.attr("id"),
    rad = Math.PI / 180,
    startAngle = 180 - endAngle,
    raphael = Raphael(container_id, ob.width(), r * 2);

    function addLabel() {
      var percentage_label = raphael.text(2*r + 15, r - 10, percentage + "%");
      percentage_label.attr({'font-size': 31, 'font-family': 'DINOT-Medium, Sans-Serif'});
      percentage_label.attr("fill", "#0099CC");
      percentage_label.attr("text-anchor", "start");

      var extra_label = raphael.text(2*r + 15, r + 12, "fullfiled");
      extra_label.attr({'font-size': 13, 'font-family': 'Arial, Sans-Serif'});
      extra_label.attr("fill", "#666666");
      extra_label.attr("text-anchor", "start");
    }

    if (percentage >= 100) {
      c = raphael.circle(r, r, r).attr({ stroke: "none", fill: "#0099CC" });
      addLabel();
      return;
    }
    c = raphael.circle(r, r, r).attr({ stroke: "#E5E5E5", fill: "#E5E5E5" });

    function sector(cx, cy, r, startAngle, endAngle, params) {
      var x1 = cx + r * Math.cos(-startAngle * rad),
      x2 = cx + r * Math.cos(-endAngle * rad),
      y1 = cy + r * Math.sin(-startAngle * rad),
      y2 = cy + r * Math.sin(-endAngle * rad);
      return raphael.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
    }

    p = sector(r, r, r, 0, endAngle, { stroke: "none", fill: "#0099CC" });
    addLabel();

  }

  function drawMultiPie(ob, r, values) {

    var container_id = ob.attr("id"),
    rad = Math.PI / 180,
    startAngle = 180 - endAngle,
    raphael = Raphael(container_id, ob.width(), r * 2);

		var sectorOpacity = 0.8 / values.length;

    c = raphael.circle(r, r, r).attr({ stroke: "#E5E5E5", fill: "#E5E5E5" });

    function sector(cx, cy, r, startAngle, endAngle, params) {
      var x1 = cx + r * Math.cos(-startAngle * rad),
      x2 = cx + r * Math.cos(-endAngle * rad),
      y1 = cy + r * Math.sin(-startAngle * rad),
      y2 = cy + r * Math.sin(-endAngle * rad);
      return raphael.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
    }

		for (var i= 0; i<values.length; i++) {
    	var endAngle = Math.floor(values[i] / 100 * 360);
    	p = sector(r, r, r, 0, endAngle, { stroke: "none", fill: "#222", opacity: sectorOpacity});
		}
  }

	function drawGreyBars(ob, w) {
		var scale = w/100;
		jQuery("ul li", ob).each(function() {
			var bar = $(this).find("div.grey_bar");
			var value = bar.html();
			$(this).append("<div class='value_label'>"+value+"</div>");
			$("div.value_label").css({display: "none"});
			bar.empty();
			bar.css({width: value*scale});
			bar.show();
			$(this).mouseover(function() {
				$("div.value_label").css({display: "none"});
				$(this).find("div.value_label").css({display: "inline-block"});
			});
		});
	}

  $.fn.bindPie = function(r, percentage) {
    drawPie($(this), r, percentage);
  };

  $.fn.bindMultiPie = function(r, values) {
    drawMultiPie($(this), r, values);
  };

	$.fn.bindGreyBars = function(w) {
		drawGreyBars($(this), w);
	}

  $.fn.addMultiLegend = function(number) {
		var baseOpacity = 0.6 / number;
		jQuery("ul li", this).each( function() {
			var elementOpacity = ($(this).index()+1) * baseOpacity;
			$(this).prepend("<div class='pieLegendBullet'/>");
			$(this).find("div.pieLegendBullet").css({opacity: elementOpacity});
		});
  }

  function drawGraph(ob, data, opt) {
    var container_id = ob.attr("id");

    function getAnchors(p1x, p1y, p2x, p2y, p3x, p3y) {
      var l1 = (p2x - p1x) / 2, l2 = (p3x - p2x) / 2;
      var a = Math.atan((p2x - p1x) / Math.abs(p2y - p1y));
      var b = Math.atan((p3x - p2x) / Math.abs(p2y - p3y));

      a = p1y < p2y ? Math.PI - a : a;
      b = p3y < p2y ? Math.PI - b : b;

      var alpha = Math.PI / 2 - ((a + b) % (Math.PI * 2)) / 2;
      var dx1 = l1 * Math.sin(alpha + a);
      var dy1 = l1 * Math.cos(alpha + a);
      var dx2 = l2 * Math.sin(alpha + b);
      var dy2 = l2 * Math.cos(alpha + b);

      return {
        x1: p2x - dx1,
        y1: p2y + dy1,
        x2: p2x + dx2,
        y2: p2y + dy2
      };
    }

    if (!opt) {
      var opt = {};
    }

    // Configuration
    var width  = opt.width  || $("#"+container_id).width();
    var height = opt.height || 163;

    $("#"+container_id).width(width);

    // Gutter
    var leftGutter   = opt.leftGutter   || 0;
    var bottomGutter = opt.bottomGutter || 15;
    var topGutter    = opt.topGutter    || 50;

    var color = opt.color || "#E5E5E5";

    var container = Raphael(container_id, width, height);
    var X = (width - leftGutter) / data.length;
    var max = Math.max.apply(Math, data);
    var Y = (height - bottomGutter - topGutter) / max;

    var path    = container.path().attr({ stroke: "none"});
    var bgp     = container.path().attr({ stroke: "none", fill: color });
    var blanket = container.set();

    var p, bgpp;

    for (var i = 0, ii = data.length; i < ii; i++) {
      var y = Math.round(height - bottomGutter - Y * data[i]),
      x = Math.round(leftGutter + X * (i + .5));
      if (!i) {
        p = ["M", x, y, "C", x, y];
        bgpp = ["M", leftGutter + X * .5, height - bottomGutter, "L", x, y, "C", x, y];
      }
      if (i && i < ii - 1) {
        var Y0 = Math.round(height - bottomGutter - Y * data[i - 1]);
        var X0 = Math.round(leftGutter + X * (i - .5));
        var Y2 = Math.round(height - bottomGutter - Y * data[i + 1]);
        var X2 = Math.round(leftGutter + X * (i + 1.5));
        var a = getAnchors(X0, Y0, x, y, X2, Y2);
        p = p.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
        bgpp = bgpp.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
      }

      blanket.push(container.rect(leftGutter + X * i, 0, X, height - bottomGutter).attr({ stroke: "none", fill: "#fff", opacity: 0 }));
      var rect = blanket[blanket.length - 1];
    }

    p = p.concat([x, y, x, y]);
    bgpp = bgpp.concat([x, y, x, y, "L", x, height - bottomGutter, "z"]);
    path.attr({ path: p });
    bgp.attr({ path: bgpp });
  }

  $.fn.addGraph = function(data, opt) {
    drawGraph(this, data, opt);
  };
});

