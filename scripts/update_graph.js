var svgWidth = 1120;
var svgHeight = 630;
var padding = 55;
var barPad = 3;

var bin_domain;
var bin_size = 25;

var bar_shift1;
var bar_shift2;
var oldWidth;
var oldHeight;
var oldY;
var inEvent;

var dataset_name = "data/NYC_saf_noconsent_2019.csv";
var default_attribute = "MONTH2";
var default_attribute_type = "Cate";

var data;
var curr_var_type = default_attribute_type;
var curr_var = default_attribute;

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
            .attr("width", barWidth - 2*barPad)
            .style('transform-origin','bottom')
            .style('transform','scale(1)')
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .on('mousemove', mousemove);

    // add the x Axis
    svg.append("g")
        //.attr("transform", "translate(0," + (svgHeight - padding) + ")")
        .attr("transform", "translate(0," + (svgHeight - padding) + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")	
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-20)");
    
    
    // add the y Axis
    svg.append("g")
        .attr("transform", "translate(" + padding + ",0)")
        .call(d3.axisLeft(y));    

    // add a x Axis Title
    d3.select("#g_xtitle")
        .style("text-anchor", "middle")
        .text("Category Names");

    // add a Y Axis Title
    svg.append("g")
        .append("text")
        .attr("transform", "translate(17," + svgHeight/2 + ")rotate(-90)")
        .text("Frequency");    
    
}

function makeNumericalGraph(attr){

    //get the bin min and max
    var bin_domain = d3.extent(data, function(d) { return +d[attr]; });
    var bin_data = data.map(function(d) {return +d[attr];});

    // set the x and y ranges
    var x = d3.scaleLinear()
        .domain([bin_domain[0],bin_domain[1]])
        .range([padding, svgWidth-padding]); 

    // set the parameters for the histogram
    var histogram = d3.histogram()
        .value(function(d) { return d; })
        .domain(x.domain())
        .thresholds(x.ticks(bin_size));
        //.thresholds(x.ticks(bin_size));
    
    var bins = histogram(bin_data);

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

    //making the bar chart
    var barChart = svg.selectAll("rect")
        .data(bins)
        .enter()
            .append("rect")
            .attr("class","bar")
            .attr("x", function(d) {return x(d.x0);})
            .attr("y", function(d) {return y(d.length);})
            .attr("width", function(d) { return x(d.x1) - x(d.x0) - 1; })
            .attr("height", function(d) { return svgHeight - padding - y(d.length); })
            .on('mousemove', mousemove)
            .on('mousedown', mousedown);

    setBarMouseFunc();

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + (svgHeight - padding) + ")")
        .call(d3.axisBottom(x));
    
    // add the y Axis
    svg.append("g")
        .attr("transform", "translate(" + padding + ",0)")
        .call(d3.axisLeft(y));    

    // add a x Axis Title
    d3.select("#g_xtitle")
        .style("text-anchor", "middle")
        .text("Bin Sizes");

    // add a Y Axis Title
    svg.append("g")
        .append("text")
        .attr("transform", "translate(17," + svgHeight/2 + ")rotate(-90)")
        .text("Frequency");  

    d3.select("#g_nsize").text("n-size: "+bin_data.length);
    
}

function mouseover(data,index){

    oldHeight = d3.select(this).attr('height');

    var newHeight = oldHeight * 1.05;

    oldY = d3.select(this).attr('y');

    d3.select(this)
        .attr('class','hov_bar')
        .attr('y',oldY - (newHeight - oldHeight))
        .attr('height',newHeight)
        .transition();


    //adding tool tip and value on graph
    d3.select(".ToolTip")
        .style("left", d3.event.pageX - 50 + "px")
        .style("top", d3.event.pageY + 20 + "px")
        .style("visibility", "visible")
    
    d3.select(this.parentNode)
        .append("text")
        .attr("id","hovertext")
        .attr("x", parseInt(d3.select(this).attr("x")) + (d3.select(this).attr("width"))/2)
        .attr("y", parseInt(d3.select(this).attr("y")) - 10)
        .attr("text-anchor","middle");

    if (curr_var_type == "Num"){
        d3.select(".ToolTip").text("Bin Size: (" + (data.x0) + "," + (data.x1) + ")");
        d3.select("#hovertext").text(data.length);
    }
    else{
        d3.select(".ToolTip").text("Category: " + (data.key) );
        d3.select("#hovertext").text(data.value);
    }

    

}

function mousedown(){
    var w = d3.select(window)
        .on("mousemove", mousedownmove)
        .on("mouseup", mouseup);

    inEvent = true;
    setBarMouseFunc();

    var click_X = d3.event.pageX;
    var pixLimit = 30;

    
    d3.select(".ToolTip")
        .style("visibility", "hidden");

    d3.select("#hovertext").remove();

    function mousedownmove() {
        if (bin_size < 100){
            
            
            if (bin_size > 2){
                var x = d3.event.pageX;

                if(Math.floor(Math.abs((click_X - x)/pixLimit))!=0){
                    bin_size = bin_size - Math.floor((click_X - x)/pixLimit);
                    makeNumericalGraph(curr_attr);
                    click_X = d3.event.pageX;
                }
            
            }
            else{
                bin_size = 3;
            }   
        }
        else{
            bin_size = 49;
        }
    }

    function mouseup() {
        w.on("mousemove", null)
            .on("mouseup", null);

        inEvent = false;
        setBarMouseFunc()
    }
}

function setBarMouseFunc(){
    if(inEvent){        
        d3.selectAll(".bar")
            .on("mouseover", null)
            .on("mouseout",null);
    }
    else{
        d3.selectAll(".bar")
            .on("mouseover", mouseover)
            .on("mouseout",mouseout);
    }
}

function mouseout(){

    d3.select(this)
        .attr('class','bar')
        .attr('height', oldHeight)
        .attr('y',oldY)
        .transition();


    d3.select(".ToolTip")
        .style("visibility", "hidden");

    d3.select("#hovertext").remove();
}

function mousemove(d) {
    d3.select(".ToolTip")
        .style("left", d3.event.pageX -50  + "px")
        .style("top", d3.event.pageY + 20 + "px");
}

function makeCountDict(attr){

    var data_loc = data;

    /*console.log(attr)
    console.log(data_loc)

    if (attr == "SUSPECT_OTHER_DESCRIPTION_TOP10" || attr == "DEMEANOR_OF_PERSON_STOPPED_TOP10"){
        console.log("enter")
        data_loc = function(data, attr) {
            return data.filter(function(d) { return d[attr] != "NONE"; });
        }
    }

    console.log(data_loc)*/

    var data_count= d3.nest()
        .key(function(d) {return d[attr];})
        .rollup(function(d) {return d.length;})
        .entries(data);

    
    d3.select("#g_nsize").text("n-size: "+data.length);

    return data_count

}

function renderGraph(attr, category){
    
    curr_var_type = category;
    curr_attr = attr;

    bin_size = 7;

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






