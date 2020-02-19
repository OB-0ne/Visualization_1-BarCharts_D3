var svgWidth = 950;
var svgHeight = 500;
var padding = 60;
var barPad = 3;

var bin_domain;
var bin_size = 15;

var dataset_name = "data/sample-small.csv";
var default_attribute = "HistData";
var default_attribute_type = "Num";

var data;

function setChartInfo(){

    
    chart = d3.select("#Charts");

    chart
        .style("Height",svgHeight)
        .style("Width",svgWidth);
}

function makeCategoricalGraph(attr){

    var data = makeCountDict(attr);

    //getting the max and minimum of the data column
    var x_domain = (data.map(function(d){ return d.key;})),
    y_domain = [d3.max(data.map(function(d){ return d.value;})),0];

    //Get the current selected attribute
    var barWidth = ((svgWidth - 2*padding) / data.length);

    //set the u axis labels and ranges
    var x = d3.scaleBand()
        .domain(x_domain) //get correct attribute names here
        .range([padding, svgWidth - padding]);

    //set the y ranges
    var y = d3.scaleLinear()
        .domain(y_domain)
        .range([padding,svgHeight - padding]);

    //Get the svg graph's DOM
    var svg = d3.select('#graph-cat')
        .style("width", svgWidth)
        .style("height", svgHeight);

    d3.selectAll("rect").remove();
    d3.selectAll("g").remove();

    //making the bar chart
    var barChart = svg.selectAll("rect")
        .data(data)
        .enter()
            .append("rect")
            .attr("class","bar")
            .attr("x", function(d) {return x(d.key)+barPad; })
            .attr("y", function(d) {return y(d.value); })
            .attr("height", function(d) { return svgHeight - y(d.value) - padding; })
            .attr("width", barWidth - 2*barPad);

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + (svgHeight - padding) + ")")
        .call(d3.axisBottom(x));
    
    // add the y Axis
    svg.append("g")
        .attr("transform", "translate(" + padding + ",0)")
        .call(d3.axisLeft(y));    

    // add a x Axis Title
    svg.append("text")             
      .attr("transform","translate(" + (svgWidth/2) + " ," + (svgHeight - 20) + ")")
      .style("text-anchor", "middle")
      .text("Values");
    
}

function makeNumericalGraph(attr){

    //get the bin min and max
    var bin_domain = d3.extent(data, function(d) { return +d[attr]; });

    // set the x and y ranges
    var x = d3.scaleLinear()
        .domain([bin_domain[0],bin_domain[1]])
        .rangeRound([padding, svgWidth-padding]); 

    // set the parameters for the histogram
    var histogram = d3.histogram()
        .value(function(d) { return d[attr]; })
        //.domain(bin_domain)
        .domain(x.domain())
        .thresholds(x.ticks(bin_size));

    var bins = histogram(data);

    //getting the max and minimum of the data column
    y_domain = [0,d3.max(bins.map(function(d){ return d.length;}))];
    
    //set the y ranges
    var y = d3.scaleLinear()
        .domain(y_domain)
        .range([svgHeight - padding, padding]);

    //Get the svg graph's DOM
    var svg = d3.select('#graph-num')
        .style("width", svgWidth)
        .style("height", svgHeight);

    //remove all bars
    d3.selectAll("rect").remove();
    d3.selectAll("g").remove();

    console.log(bins.map(function(d){return d.length;}));
    console.log(bins);

    //making the bar chart
    var barChart = svg.selectAll("rect")
        .data(bins)
        .enter()
            .append("rect")
            .attr("class","bar")
            //.attr("x", 1)
            .attr("x", function(d) {return x(d.x0);})
            .attr("y", function(d) {return y(d.length);})
            //.attr("transform", function(d) {
            //    return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
            .attr("width", function(d) { return x(d.x1) - x(d.x0) - 1; })
            .attr("height", function(d) { return svgHeight - padding - y(d.length); })
            .style('transform-origin','bottom')
            .on("mouseover", mouseover)
            .on("mouseout", mouseout);

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + (svgHeight - padding) + ")")
        .call(d3.axisBottom(x));
    
    // add the y Axis
    svg.append("g")
        .attr("transform", "translate(" + padding + ",0)")
        .call(d3.axisLeft(y));    

    // add a x Axis Title
    svg.append("text")             
        .attr("transform","translate(" + (svgWidth/2) + " ," + (svgHeight - 20) + ")")
        .style("text-anchor", "middle")
        .text("Values");
    
}

function mouseover(data,index){

    var width = d3.select(this).attr('width')
    var height = d3.select(this).attr('height')

    var scale = 1.2;
    var scale_o = 0.8;

    var newWidth = width * scale;
    var newHeight = width * scale;
    var newWidth_o = width * scale_o;
    var newHeight_o = width * scale_o;

    var shift = (width - newWidth)/4;
    var shift_o = (width - newWidth_o)/4;

    d3.select(this).attr('class','hov_bar');

    /*d3.select(this)
        .transition()
        .style('transform','scale(' + scale + ')')
        .style('transform','translateX(-' + shift + 'px)')
        .style('transform','translateY(' + shift + 'px)');

    d3.selectAll('.bar')
        .filter((d,i)=> i < index)
        .transition()
        .style('transform','translateX(-' + shift + 'px)')
        .style('transform','translateY(' + shift + 'px)')
        .style('transform','scale(' + scale_o + ')');

    d3.selectAll('.bar')
        .filter((d,i)=> i > index)
        .transition()
        .style('transform','translateX(' + shift + 'px)')
        .style('transform','translateY(' + shift + 'px)')
        .style('transform','scale(' + scale_o + ')');*/

}

function mouseout(data,index){
    d3.select(this).attr('class','bar');
    d3.select(this).transition().style('transform','scale(1)');
    /*d3.selectAll('.bar')
        .filter(d=>d.letter !== data.letter)
        .transition()
        .style('transform','translateX(0)')
        .style('transform','translateY(0)')
        .style('transform','scale(1)');*/
}

function makeCountDict(attr){

    var data_count= d3.nest()
        .key(function(d) {return d[attr];})
        .rollup(function(d) {return d.length;})
        .entries(data);

    return data_count

}

function renderGraph(attr, category){
    
    //hide-unhdide graph DOM according to the category selected and make the graph
    if(category == "Num"){
        d3.select("#graph-num").style("display","initial");
        d3.select("#graph-cat").style("display","none");
        
        makeNumericalGraph(attr);
    }
    else{
        d3.select("#graph-cat").style("display","initial");
        d3.select("#graph-num").style("display","none");

        makeCategoricalGraph(attr);
    }

}



//Read data from Csv
d3.csv(dataset_name, function(d){
    data = d;
    setChartInfo();
    renderGraph(default_attribute,default_attribute_type);
    makeDDM();
});






