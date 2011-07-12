function generateRandomValues(limit) {
  var last = 0;
  var values = [];

  for (var i=0; i<=limit; i++) {
    if (Math.random()*100 > 80) {
      values[i] = Math.floor(Math.random()*20 + 5);
    } else {
      values[i] = last;
    }
    last = values[i];
  }
  return values;
}

