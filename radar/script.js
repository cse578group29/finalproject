var w = 300,
	h = 300;

var colorscale = d3.scale.category10();

//Legend titles
var LegendOptions = ['2016','2017','2018','2019']; 

//Data
var d = [
	[
		{axis:"Self-driving or Robotics", value:0.253},
		{axis:"NLP",value:0.423},
		{axis:"Optimization",value:0.17},
		{axis:"Reinforcement Learning",value:0.067},		
		{axis:"Gaming-AI",value:0.088}
	],[
		{axis:"Self-Driving or robotics", value:0.097},
		{axis:"NLP",value:0.503},
		{axis:"Optimization",value:0.198},
		{axis:"Reinforcement Learning",value:0.174},		
		{axis:"Gaming-AI",value:0.028}
	],[
		{axis:"Self-Driving or robotics", value: 0.111},
		{axis:"NLP",value:0.401},
		{axis:"Optimization",value:0.159},
		{axis:"Reinforcement Learning",value:0.32},		
		{axis:"Gaming-AI",value:0.008}
	],[
		{axis:"Self-Driving or robotics", value:0.08},
		{axis:"NLP",value:0.371},
		{axis:"Optimization",value:0.093},
		{axis:"Reinforcement Learning",value:0.456},		
		{axis:"Game-AI",value:0}
	]
	
];

//Options for the Radar chart, other than default
var mycfg = {
	w: w,
	h: h,
	maxValue: 0.8,
	levels: 6,
	ExtraWidthX: 400
}

//Call function to draw the Radar chart
//Will expect that data is in %'s
RadarChart.draw("#radar", d, mycfg);

////////////////////////////////////////////
/////////// Initiate legend ////////////////
////////////////////////////////////////////

var svgRadar = d3.select('#legend')
	.selectAll('svg')
	.append('svg')
	.attr("width", w+500)
	.attr("height", h);

//Create the title for the legend
var text = svgRadar.append("text")
	.attr("class", "title")
	.attr('transform', 'translate(90,0)')
	.attr("x", w - 12)
	.attr("y", 10)
	.attr("font-size", "13px")
	.attr("fill", "#404040")
	.text("Year");

//Initiate Legend	
var legend = svgRadar.append("g")
	.attr("class", "legend")
	.attr("height", 100)
	.attr("width", 200)
	.attr('transform', 'translate(90,20)')
;
//Create colour squares
legend.selectAll('rect')
	.data(LegendOptions)
	.enter()
	.append("rect")
	.attr("x", w - 12)
	.attr("y", function(d, i){ return i * 20;})
	.attr("width", 10)
	.attr("height", 10)
	.style("fill", function(d, i){ return colorscale(i);})
;
//Create text next to squares
legend.selectAll('text')
	.data(LegendOptions)
	.enter()
	.append("text")
	.attr("x", w )
	.attr("y", function(d, i){ return i * 20 + 9;})
	.attr("font-size", "12px")
	.attr("fill", "#737373")
	.text(function(d) { return d; })
;