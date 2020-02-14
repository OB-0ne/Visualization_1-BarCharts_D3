

function renderGraph(attr){

    //Get the current selected attribute - [CHANGE]

    var svgWidth = 750;
    var svgHeight = 450;
    var barWidth = (svgWidth / data.length);

    console.log(d3.max(data.map(d => +d[attr])));

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data.map(d => +d[attr]))])
        .range([0, svgHeight]);

    //Get the svg graph
    var svg = d3.select('svg')
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    d3.selectAll("rect").remove();
        
    var barChart = svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("y", function(d) {
            return svgHeight - yScale(d[attr]); 
        })
        .attr("height", function(d) { 
            return yScale(d[attr]); 
        })
        .attr("width", barWidth - 5)
        .attr("transform", function (d,i) {
            var translate = [barWidth * i, 0]; 
            return "translate("+ translate +")";
        });

};

var data;

//Read data from Csv
d3.csv("data/sample-small.csv", function(d){
    data = d;
    renderGraph("last");
    makeDDM();
});






