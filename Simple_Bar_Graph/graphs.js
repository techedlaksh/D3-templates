
//Write your code here
var w = 800;
var h = 450;
var margin = {
	top: 40,
	bottom:100,
	left:80,
	right:20
};
var width = w - margin.left - margin.right;
var height = h - margin.top - margin.bottom;

// var data = [
// 	{key: "Glazed",		value: 132},
// 	{key: "Jelly",		value: 71},
// 	{key: "Holes",		value: 337},
// 	{key: "Sprinkles",	value: 93},
// 	{key: "Crumb",		value: 78},
// 	{key: "Chocolate",	value: 43},
// 	{key: "Coconut", 	value: 20},
// 	{key: "Cream",		value: 16},
// 	{key: "Cruller", 	value: 30},
// 	{key: "Éclair", 	value: 8},
// 	{key: "Fritter", 	value: 17},
// 	{key: "Bearclaw", 	value: 21}
// ];

// Flipping the x and y axis
var x = d3.scale.ordinal() //ordinal uses distinct values instead of min and max
		.domain(data.map(function(entry){
			return entry.key;
		}))
		.rangeBands([0,width]);
var y = d3.scale.linear()
		.domain([0,d3.max(data, function(d){
			return d.value;
		})])
		.range([height,0]);

var linearColorScale = d3.scale.linear()
						.domain([0,data.length])
						.range(["#572500","#F68026"]);
var ordinalColorScale = d3.scale.category20();
var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");
var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");
var yGridlines = d3.svg.axis()
				.scale(y)
				.tickSize(-width,0,0)
				.tickFormat("")
				.orient("left");
var svg = d3.select("body")
			.append("svg")
			.attr("id", "chart")
			.attr("width", w)
			.attr("height", h);
var chart = svg.append("g")
			.classed("display",true)
			.attr("transform","translate("+ margin.left +","+ margin.top +")");
var controls = d3.select("body")
				.append("div")
				.attr("id","controls");
var sort_btn = controls.append("button")
				.html("Sort data: ascending")
				.attr("state", 0);
function drawAxis(params){

	if(params.initialize === true){
		// Draw the gridlines and axes
		// Draw the gridline
	this.append("g")
		.call(params.gridlines)
		.classed("gridline",true)
		.attr("transform","translate(0,0)")

	// This is the x axis
	this.append("g")
		.classed("x axis", true)
		.attr("transform","translate(" + 0 + "," + height + ")")
		.call(params.axis.x)
			.selectAll("text")
				.classed("x-axis-label",true)
				.style("text-anchor","end")
				.attr("dx",-8)
				.attr("dy",8)
				.attr("transform","translate(0,0) rotate(-45)");

	// This is the y axis
	this.append("g")
		.classed("y axis", true)
		.attr("transform","translate(0,0)")
		.call(params.axis.y);

	// This is the Y Label
	this.select(".y.axis")
		.append("text")
		.attr("x", 0)
		.attr("y", 0)
		.style("text-anchor","middle")
		.attr("transform","translate(-50," + height/2 + ") rotate(-90)")
		.text("Units Sold");

	// This is the X Label
	this.select(".x.axis")
		.append("text")
		.attr("x", 0)
		.attr("y", 0)
		.style("text-anchor","middle")
		.attr("transform","translate(" + width/2 + ",85)")
		.text("Donuts Type");
	} else if(params.initialize === false){
		// Update the info
		this.selectAll("g.x.axis")
			.transition()
			.duration(500)
			.ease("bounce")
			.delay(500)
			.call(params.axis.x);
		this.selectAll(".x-axis-label")
			.style("text-anchor","end")
			.attr("dx",-8)
			.attr("dy",8)
			.attr("transform","translate(0,0) rotate(-45)");

		this.selectAll("g.y.axis")
			.transition()
			.duration(500)
			.ease("bounce")
			.delay(500)
			.call(params.axis.y);
	}	
}



function plot(params){
	x.domain(data.map(function(entry){
			return entry.key;
		}));

	y.domain([0,d3.max(data, function(d){
			return d.value;
		})]);

	// Draws the Axis and Labels
	drawAxis.call(this, params);

	
	//enter()
	this.selectAll(".bar")
		.data(params.data)
		.enter()
			.append("rect")
			.classed("bar", true)
			.on("mouseover",function(d,i){
				d3.select(this).style("fill","black");
			})
			.on("mousemove",function(d,i){
				// d3.select(this).style("fill","green");
			})
			.on("mouseout",function(d,i){
				d3.select(this).style("fill",ordinalColorScale(i));
			});


	this.selectAll(".bar-label")
		.data(params.data)
		.enter()
			.append("text")
			.classed("bar-label",true);

	//update
	this.selectAll(".bar")
		.transition()
		.duration(500)
		.ease("bounce")
		.delay(500)
		.attr("x", function(d,i){
			return x(d.key);
		})
		.attr("y", function(d,i){
			return y(d.value);
		})
		.attr("width", function(d,i) {
			return x.rangeBand();
		})
		.attr("height" , function(d,i){
			return height - y(d.value);
		})
		.style("fill", function(d,i){
			return ordinalColorScale(i);
		});

	this.selectAll(".bar-label")
		.transition()
		.duration(500)
		.ease("bounce")
		.delay(500)
		.attr("x", function(d,i){
				return x(d.key) + (x.rangeBand()/2);
			})
			.attr("dx", 0)
			.attr("y", function(d,i){
				return y(d.value);
			})
			.attr("dy", -6)
			.text(function(d,i){
				return d.value;
			});

	//exit()
	this.selectAll(".bar")
		.data(params.data)
		.exit()
		.remove();

	this.selectAll(".bar-label")
		.data(params.data)
		.exit()
		.remove();	
}


sort_btn.on("click",function(){
	var self = d3.select(this);
	var ascending = function(a,b){
		return a.value - b.value;
	};
	var descending = function(a,b){
		return b.value - a.value;
	};
	var state = +self.attr("state");
	var txt = "Sort data: ";
	if(state === 0){
		data.sort(ascending);
		state = 1;
		txt += "descending";
	}
	else if(state === 1){
		data.sort(descending);
		state = 0;
		txt += "ascending";
	}
	self.attr("state", state);
	self.html(txt);
	plot.call(chart, {
		data:data,
		axis:{
			x: xAxis,
			y: yAxis
		},
		gridlines: yGridlines,
		initialize: false
	});
});

// call invokes the the function
plot.call(chart, {
	data:data,
	axis:{
		x: xAxis,
		y: yAxis
	},
	gridlines: yGridlines,
	initialize: true
});
