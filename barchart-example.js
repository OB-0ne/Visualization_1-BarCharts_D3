var dataset = [80, 100, 56, 120, 180, 30, 40, 120, 160];

var svgWidth = 500, svgHeight = 300, barPadding = 5;
var barWidth = (svgWidth / dataset.length);


var yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset)])
    .range([0, svgHeight]);

var svg = d3.select('svg')
    .attr("width", svgWidth)
    .attr("height", svgHeight);
    
var barChart = svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("y", function(d) {
        return svgHeight - yScale(d) 
    })
    .attr("height", function(d) { 
        return yScale(d); 
    })
    .attr("width", barWidth - barPadding)
    .attr("transform", function (d, i) {
        var translate = [barWidth * i, 0]; 
        return "translate("+ translate +")";
    });