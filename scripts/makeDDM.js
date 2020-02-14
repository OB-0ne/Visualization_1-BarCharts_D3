
function makeDDM(){

    d3.csv("data/header_control.csv", function(data){

        var options = d3.select('#graph-attribute')
            .selectAll('option')
            .data(data)
            .enter()
            .append('option');
    
        options.text(function(d) {
            return d.DDMName;
            })  //makes the dropdown value
            .attr("value", function(d) {
            return d.Header;
            }); //makes the id value for each dropdown value
    
        options.on("click", function() {
            renderGraph(this.value);
          })
    
    });

}

