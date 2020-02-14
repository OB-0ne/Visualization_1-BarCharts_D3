//read data 
d3.csv("data/sample-small.csv", function(data) {

    console.log(data.last)

    var svgWidth = 500, svgHeight = 300, barPadding = 5;
    var barWidth = (svgWidth / data.length);


    var yScale = d3.scaleLinear()
        .domain([0,150])
        .range([0, svgHeight]);

    var svg = d3.select('svg')
        .attr("width", svgWidth)
        .attr("height", svgHeight);
        
    var barChart = svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("y", function(d) {
            return svgHeight - yScale(d.last) 
        })
        .attr("height", function(d) { 
            return yScale(d.last); 
        })
        .attr("width", barWidth - barPadding)
        .attr("transform", function (d,i) {
            var translate = [barWidth * i, 0]; 
            return "translate("+ translate +")";
        });

});

