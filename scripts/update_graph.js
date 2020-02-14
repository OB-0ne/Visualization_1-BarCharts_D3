

function renderGraph(data){

    //Get the current selected attribute - [CHANGE]
    var attribute = "last";

    var svgWidth = 750;
    var svgHeight = 450;
    var barWidth = (svgWidth / data.length);

    console.log(data.length);
    console.log(barWidth);

    //Get the svg graph
    var svg = d3.select('svg')
        .attr("width", svgWidth)
        .attr("height", svgHeight);
        
    var barChart = svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("y", function(d) {
            return svgHeight - d[attribute]; 
        })
        .attr("height", function(d) { 
            return d[attribute]; 
        })
        .attr("width", barWidth - 5)
        .attr("transform", function (d,i) {
            var translate = [barWidth * i, 0]; 
            return "translate("+ translate +")";
        });

};

//Read data from Csv
d3.csv("data/sample-small.csv", function(data){
    renderGraph(data);
});






