var is_ie = $.browser.msie;
var broswer_version = parseInt($.browser.version, 10);

String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

function generateRandomValues(limit) {
  var last = Math.floor(Math.random() * 500);
  var random = 0;
  var values = [];
  var s = 0;

  for (var i=0; i <= limit; i++) {
    s = Math.floor(Math.random()*100);

    if (s > 80 && s < 90) {
      random = last + Math.floor(Math.random() * last);
      values[i] = random;
    } else if (s > 95) {
      random = last - Math.floor(Math.random() * last);
      values[i] = random;
    } else {
      values[i] = last + Math.floor(Math.random() * 100);
    }
    last = values[i];
  }
  return values;
}
