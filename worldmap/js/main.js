var width = 960,
    height = 600;

var probe,
    hoverData;

var dateScale, sliderScale, slider;

var format = d3.format(",");

var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    months_full = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    // orderedColumns = ["Jan-04", "Jan-05"], //, "Jan-06", "Jan-07", "Jan-08", "Jan-09", "Jan-10", "Jan-11", "Jan-12", "Jan-13", "Jan-14", "Jan-15"],
    orderedColumns = ["Jan-16", "Jan-17", "Jan-18", "Jan-19"],
    currentFrame = 0,
    interval,
    frameLength = 500,
    isPlaying = false;

var sliderMargin = 65;

dateScale = createDateScale(orderedColumns).range([0, 400]);

createSlider();
function createSlider() {

    sliderScale = d3.scale.linear().domain([0, orderedColumns.length - 1]);

    var val = slider ? slider.value() : 0;

    slider = d3.slider()
        .scale(sliderScale)
        .on("slide", function(event, value) {
            if (isPlaying) {
                clearInterval(interval);
            }
            currentFrame = value;
            updateMap();
            //drawMonth(orderedColumns[value], d3.event.type != "drag");
        })
        .on("slideend", function() {
            if (isPlaying) animate();
            d3.select("#slider-div").on("mousemove", sliderProbe)
        })
        .on("slidestart", function() {
            d3.select("#slider-div").on("mousemove", null)
        })
        .value(val);

    d3.select("#slider-div").remove();

    d3.select("#slider-container")
        .append("div")
        .attr("id", "slider-div")
        .style("width", dateScale.range()[1] + "px")
        .on("mousemove", sliderProbe)
        .on("mouseout", function() {
            d3.select("#slider-probe").style("display", "none");
        })
        .call(slider);

    d3.select("#slider-div a").on("mousemove", function() {
        d3.event.stopPropagation();
    })

    var sliderAxis = d3.svg.axis()
        .scale(dateScale)
        .tickValues(dateScale.ticks(orderedColumns.length).filter(function(d, i) {
            // ticks only for beginning of each year, plus first and last
            return d.getMonth() == 0 || i == 0 || i == orderedColumns.length - 1;
        }))
        /*.tickFormat(function(d) {
            // abbreviated year for most, full month/year for the ends
            if (d.getMonth() == 0) return "'" + d.getFullYear().toString().substr(2);
            return months[d.getMonth()] + " " + d.getFullYear();
        })*/
        .tickSize(10)

    d3.select("#axis").remove();

    d3.select("#slider-container")
        .append("svg")
        .attr("id", "axis")
        .attr("width", dateScale.range()[1] + sliderMargin * 2)
        .attr("height", 25)
        .append("g")
        .attr("transform", "translate(" + (sliderMargin + 1) + ",0)")
        .call(sliderAxis);

    d3.select("#axis > g g:first-child text").attr("text-anchor", "end").style("text-anchor", "end");
    d3.select("#axis > g g:last-of-type text").attr("text-anchor", "start").style("text-anchor", "start");
}

function setProbeContent(d) {
    var val = d[orderedColumns[currentFrame]],
        m_y = getMonthYear(orderedColumns[currentFrame]),
        month = months_full[months.indexOf(m_y[0])];
    var html = "<strong>" + d.CITY + "</strong><br/>" +
        format(Math.abs(val)) + " jobs " + (val < 0 ? "lost" : "gained") + "<br/>" +
        "<span>" + month + " " + m_y[1] + "</span>";
    probe
        .html(html);
}

function sliderProbe() {
    var d = dateScale.invert((d3.mouse(this)[0]));
    d3.select("#slider-probe")
        .style("left", d3.mouse(this)[0] + sliderMargin + "px")
        .style("display", "block")
        .select("p")
        .html(d.getFullYear())
}

function resize() {
    var w = d3.select("#container").node().offsetWidth,
        h = window.innerHeight - 80;
    var scale = Math.max(1, Math.min(w / width, h / height));
    svg
        .attr("width", width * scale)
        .attr("height", height * scale);
    g.attr("transform", "scale(" + scale + "," + scale + ")");

    d3.select("#map-container").style("width", width * scale + "px");

    dateScale.range([0, 500 + w - width]);

    createSlider();
}

function createDateScale(columns) {
    var start = getMonthYear(columns[0]),
        end = getMonthYear(columns[columns.length - 1]);
        //alert(months.indexOf(start[0]));
    return d3.time.scale()
        .domain([new Date(start[1], months.indexOf(start[0])), new Date(end[1], months.indexOf(end[0]))]);
}

function getMonthYear(column) {
    var m_y = column.split("-");
    var year = parseInt(m_y[1]);
    if (year > 90) year += 1900;
    else year += 2000;
    return [m_y[0], year];
}
