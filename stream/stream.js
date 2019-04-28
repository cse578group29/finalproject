chart("../Data/statistics.csv" );

var datearray = [];
var colorrange = [];


function chart(csvpath) {


    colorrange = ["#ff0000", "#b30000", "#fd598d", "#E34A33", "#FC8D59", "#FDBB84" ];

    strokecolor = colorrange[0];

    var format = d3.time.format("%Y-%m-%d");
    //format = d3.time.format("%m/%d/%Y");
    var margin = {top: 20, right: 70, bottom: 30, left: 60};
    var width = document.body.clientWidth - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "remove")
        .style("position", "absolute")
        .style("z-index", "20")
        .style("visibility", "hidden")
        .style("top", "30px")
        .style("left", "55px");

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height-10, 0]);

    var z = d3.scale.ordinal()
        .range(colorrange);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(d3.time.years);

    var yAxis = d3.svg.axis()
        .scale(y);

    var stack = d3.layout.stack()
        .offset("silhouette")
        .values(function(d) { return d.values; })
        .x(function(d) { return d.date; })
        .y(function(d) { return d.value; });

    var nest = d3.nest()
        .key(function(d) { return d.topics; });

    var area = d3.svg.area()
        .interpolate("cardinal")
        .x(function(d) { return x(d.date); })
        .y0(function(d) { return y(d.y0); })
        .y1(function(d) { return y(d.y0 + d.y); });

    var svg = d3.select(".streamGraph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv(csvpath, function(data) {
        data.forEach(function(d) {
            d.date = format.parse(d.date);
            d.value = +d.topic_count;
        });

        var layers = stack(nest.entries(data));

        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })]);

        svg.selectAll(".layer")
            .data(layers)
            .enter().append("path")
            .attr("class", "layer")
            .attr("d", function(d) { return area(d.values); })
            .style("fill", function(d, i) { return z(i); });


        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + width + ", 0)")
            .call(yAxis.orient("right"));

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis.orient("left"));

        svg.selectAll(".layer")
            .attr("opacity", 1)
            .on("mouseover", function(d, i) {
                svg.selectAll(".layer").transition()
                    .duration(250)
                    .attr("opacity", function(d, j) {
                        return j != i ? 0.6 : 1;
                    })})

            .on("mousemove", function(d) {
                mousex = d3.mouse(this);
                mousex = mousex[0];
                var invertedxx = x.invert(mousex);

                invertedx = invertedxx.getMonth()+(invertedxx.getFullYear()-2016)*12 ;
                var selected = (d.values);
                for (var k = 0; k < selected.length; k++) {
                    datearray[k] = selected[k].date;
                    datearray[k] = datearray[k].getMonth() + (datearray[k].getFullYear()-2016)*12;
                }

                mousedate = datearray.indexOf(invertedx);
                pro = selected[mousedate].value; // selected in order of time

                d3.select(this)
                    .classed("hover", true)
                    .attr("stroke", strokecolor)
                    .attr("stroke-width", "0.5px");
                    tooltip.html( "<p>" + d.key + "<br>" + pro + "</p>" )
                        .style("visibility", "visible").style("left", 75 + "px")   ;

            })
            .on("mouseout", function(d, i) {
                svg.selectAll(".layer")
                    .transition()
                    .duration(250)
                    .attr("opacity", "1");
                d3.select(this)
                    .classed("hover", false)
                    .attr("stroke-width", "0px");
                tooltip.html( "<p>" + d.key + "<br>" + pro + "</p>" ).style("visibility", "hidden");
            })

        var vertical = d3.select(".streamGraph")
            .append("div")
            .attr("class", "remove")
            .style("position", "absolute")
            .style("z-index", "19")
            .style("width", "1px")
            .style("height", "580px")
            .style("top", "10px")
            .style("bottom", "30px")
            .style("left", "0px")
            .style("background", "#fff");

        d3.select(".streamGraph")
            .on("mousemove", function(){
                mousex = d3.mouse(this);
                mousex = mousex[0] + 5;
                vertical.style("left", mousex + "px" )})
            .on("mouseover", function(){
                mousex = d3.mouse(this);
                mousex = mousex[0] + 5;
                vertical.style("left", mousex + "px")});


        //add legend from keys variable
        var keys = (['Deep Learning', 'Optimization', 'NLP', 'Reinforcement Learning', 'Self-drving or Robotics',  'Game-AI' ]);
        z.domain(keys);

        var legend = svg.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 11).attr("fill","black")
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(keys.slice().reverse())
            .enter().append("g")
            .attr("transform", function(d, i) {
                return "translate(0," + i * 20 + ")";
            });

        //append legend colour blocks
        legend.append("rect")
            .attr("x", 100 + 55)
            .attr("y", 0)
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", z);

        //append legend texts
        legend.append("text")
            .attr("x", 100 + 50)
            .attr("y", -20)
            .attr("dy", "3.32em")
            .text(function(d) {
                return d;
            });
    });
}
