d3.csv("data/sample-small.csv").then(function(data) {
    d3.select('#test')
        .append('p')
        .text(data[0]);
  });