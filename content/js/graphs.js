/*
* ============
* DATA HISTORY
* ============
*/

var dataHistory = (function() {
  var width, height, canvas, fillColor, fillOpacity, strokeColor, strokeOpacity, strokeWidth;
  var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DEC"];
  var template =  _.template("L<%= xpos %> <%= old_ypos %>, L<%= xpos2 %> <%= ypos %>,");
  var processes = {};
  var max, stepWidth, leftover;
  var normalized_values = [];
  var values = [];

  function initialize(_values, opt) {
    values = _values;
    width  = $("#holder").width();
    height = opt.height || 180;

    fillColor     = opt.fillColor     || "#000000";
    fillOpacity   = opt.fillOpacity   || ".08";
    strokeColor   = opt.strokeColor   || "#D9D9D9";
    strokeOpacity = opt.strokeOpacity || ".08";
    strokeWidth   = opt.strokeWidth   || "1";

    if (opt.processes) {
      processes     = opt.processes.dates;
    }

    canvas = Raphael("holder", width, height + 57);

    Raphael.el.processPopover = function () {
      this.processPopover;
    };


    max = _.max(values);
    normalized_values = _.map(values, function(v) { return height - Math.round(v  * height/max); });

    stepWidth    = width / values.length;
  }

  function drawLines() {
    var path  = "M0 " + height + " ";
    var previous_value = height;

    _.each(normalized_values, function(value, index) {
      path += template({xpos:(stepWidth*index)+.5, xpos2: (stepWidth*index)+.5, ypos:value + .5, old_ypos:previous_value +.5});
      previous_value = value;
    });

    path += template({xpos:(stepWidth*values.length)+.5, xpos2:(stepWidth*values.length)+.5, ypos:height + .5, old_ypos:previous_value+.5});

    var shape = canvas.path(path);
    shape.attr("stroke", strokeColor);
    shape.attr("stroke-width", strokeWidth);
  }

  function drawMonthLine(x, monthName) {
    var monthWidth = Math.round(stepWidth*values.length / 12);

    var line = canvas.path("M"+x+" 450.5 L"+x+" 0");
    line.attr("stroke", "#D9D9D9");

    if (monthName) {
      var month = canvas.text(x + Math.round(monthWidth/2), height + 50, monthName);
      month.attr("fill", "#ccc");
    }
  }

  function drawMonthLines() {
    var monthWidth = Math.round(stepWidth*values.length / 12);

    for (i = 0; i < 12; i++) {
      var line = canvas.path("M"+monthWidth*i+".5 450.5 L"+monthWidth*i+".5 0");
      line.attr("stroke", "#D9D9D9");
      var month = canvas.text(monthWidth*i + Math.round(monthWidth/2), height + 50, months[i]);
      month.attr("fill", "#ccc");
    }

    var line = canvas.path("M"+(stepWidth*values.length)+".5 450.5 L"+(stepWidth*values.length)+".5 0");
    line.attr("stroke", "#D9D9D9");
  }

  function drawRects() {
    _.each(normalized_values, function(value, index) {
      var rect = canvas.rect(stepWidth*index , value , stepWidth, height - value + 20);

      rect.attr("fill-opacity", fillOpacity);
      rect.attr("fill", fillColor);
      rect.attr("stroke-width", "0");

      rect.hover(function (event) { this.attr({fill: "#D9D9D9"}); }, function (event) { this.attr({fill: "#000"}); });

      var date = new Date(2011, 0, index);

      if (index == 1)  {
        drawMonthLine(0, months[date.getMonth() ]);
      } else if (date.getDate() === 1)  {
        drawMonthLine(stepWidth*index, months[date.getMonth() ]);
      } else if (index == 365) {
        drawMonthLine(width - 1);
      }
    });
  }

  function daysBetween(firstDate, lastDate) {
    return Math.abs((firstDate.getTime() - lastDate.getTime())/(24*60*60*1000));
  }

  function numberOfDay(date) {
    var firstDate = new Date("2011-1-1");
    return Math.round(Math.abs((firstDate.getTime() - date.getTime())/(24*60*60*1000)));
  }

  function drawPoint(x, y, title, message, processID) {
    var rect = canvas.rect(x, y, 6, 6, 3);

    rect.attr("cursor", "pointer");

    rect.hover(function (event) {
      rect.attr("fill", "#01759c");
    },function() {
      rect.attr("fill", "#0099CC");
    });

    $(rect.node).attr("id", "process_"+processID);
    $(rect.node).processPopover({title:title, message:message});

    rect.attr("fill", "#0099CC");
    rect.attr("stroke-width", "0");
  }

  function drawLine(x, y, width, title, message, processID) {
    var rect = canvas.rect(x, y, width, 6, 3);

    rect.attr("cursor", "pointer");

    rect.hover(function (event) {
      rect.attr("fill", "#01759c");
    },function() {
      rect.attr("fill", "#0099CC");
    });

    $(rect.node).attr("id", "process_"+processID);
    $(rect.node).processPopover({title:title, message:message});

    rect.attr("fill", "#0099CC");
    rect.attr("stroke-width", "0");
  }

  function drawProcesses() {
    _.each(processes, function(date, index) {

      var startDate = new Date(date.start);
      var endDate   = new Date(date.end);

      x = numberOfDay(startDate);
      y = numberOfDay(endDate);

      var days = daysBetween(startDate, endDate);

      if (days) {
        drawLine(x*stepWidth, 210, (y-x)*stepWidth + stepWidth*2, date.title, date.message, index + 1);
      } else {
        drawPoint(x*stepWidth, 210, date.title, date.message, index + 1);
      }
    });
  }

  function drawGraph() {
    drawLines();
    drawRects();
    drawProcesses();
  }

  return {
    initialize: initialize,
    show: drawGraph
  };
})();




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


