var dimension = 500;

var svg = d3.select('#svg_space').append('svg')
	.attr('width', dimension)
	.attr('height', dimension)
	.style('background-color', 'black');

var dataset = [];
const num_balls = Math.ceil(Math.sqrt(dimension))*2;
console.log(num_balls);

for (var i = 0; i < num_balls; i++ ) {
	var new_x = Math.random() * dimension;
  	var new_y = Math.random() * dimension;
  	dataset.push([new_x, new_y]);
}

let color = d3.scaleLinear().domain([1,num_balls])
.interpolate(d3.interpolateHcl)
.range([d3.rgb("#007AFF"), d3.rgb('#FFF500')]);

svg.selectAll("circle")
	.data(dataset)
	.enter().append("circle")
	.attr("cx", function(d) { return d[0]; })
	.attr("cy", function(d) { return d[1]; }) 
	.attr("r", dimension/100)
	.style("fill",function(d,i) { return color(i); });


	function shuffle(arra1) {
	let ctr = arra1.length;
	let temp;
	let index;
	// While there are elements in the array
	while (ctr > 0) {
		// Pick a random index
	 	index = Math.floor(Math.random() * ctr);
		// Decrease ctr by 1
	  	ctr--;
		// And swap the last element with it
	  	temp = arra1[ctr];
	  	arra1[ctr] = arra1[index];
	  	arra1[index] = temp;
	}
	return arra1;
	}

	function intersect(l1, l2){
	let [[x1, y1], [x2, y2]] = l1;
	let [[x3, y3], [x4, y4]] = l2;

	let det = ((x1 - x2)*(y3 - y4) - (y1 - y2)*(x3 - x4));

	let t = ((x1 - x3)*(y3 - y4) - (y1 - y3)*(x3 - x4))/det;
	let u = - ((x1 - x2)*(y1 - y3) - (y1 - y2)*(x1 - x3))/det;
	let x = (x1 + t*(x2 - x1));
	let y = (y1 + t*(y2 - y1));

	return [x,y];
}

function getLine([point1, point2]){
	// Line in form: y = mx+b
	var deltaX = point1[0] - point2[0];
	var deltaY = point1[1] - point2[1];

	var m = deltaY/deltaX;

	var line = [[],[]];
	
	if(!isNaN(m) && deltaX != 0){
		var b = point1[1] - (m*point1[0]);

		if(b > dimension || b < 0 || (m * dimension) + b > dimension || (m * dimension) + b < 0){
			var top = intersect([[0,0],[dimension,0]],[point1, point2]);
			var bot = intersect([[0,dimension],[dimension,dimension]],[point1, point2]);

			line = [top,bot];
		}
		else{
			line = [[0,b],[dimension, (m * dimension) + b]];
		}
	}
	else{
		line = [[point1[0],0],[point1[0],dimension]];
	}
	return line;
}

function linspace(start, stop, num_vals){
	var arr = [];
	var step = (stop - start) / (num_vals - 1);
	for (var i = 0; i < num_vals; i++) {
		arr.push(start + (step * i));
	}
	return arr;
}

function getDataPoints(two_points){
	const point1 = two_points[0];
	const point2 = two_points[1];

	var x_vals = linspace(point1[0], point2[0], num_balls);

	var y_vals = linspace(point1[1], point2[1], num_balls);

	var data_points = [x_vals, y_vals];

	return data_points;
	
}

function reset_all(){
	svg.selectAll("path").remove();
}

	function drawLine(selection){
	var start, path, active, reset;
	reset = false;
	var line = d3.line();
	selection
		.on("mousedown", function(){
			active = true;
			start = d3.mouse(this);

			path = svg.append("path")
				.attr("d", line(getLine([start, start])) )
				.datum(getLine([start, start]))
				.style("stroke", "gray");
		})
		.on("mousemove", function(){
			if (active){
				var mousePos = d3.mouse(this);
				var newSeg = [mousePos, start];

				path.attr("d", line(getLine(newSeg)))
					.datum(getLine(newSeg))
			}
		})
		.on("mouseup", function(){
			active = false;
			reset = true;

			var new_spots = getDataPoints(path.data()[0]);

			rand = Math.random()*16777215;
			c1 = '#'+Math.floor(rand).toString(16);

			svg.selectAll("circle").transition().duration(1000)
				.attr("cx", function(d,i){return new_spots[0][i]})
				.attr("cy", function(d,i){return new_spots[1][i]});

			reset_spots = []
			for (var i = 0; i < num_balls; i++ ) {
				var new_x = Math.random() * dimension;
		  		var new_y = Math.random() * dimension;
		  		reset_spots.push([new_x, new_y]);
			}

			c2 = '#'+Math.floor(16777215-rand/2).toString(16);
			
			let new_color = d3.scaleLinear().domain([1,num_balls])
	      .interpolate(d3.interpolateHcl)
	      .range([d3.rgb(c1), d3.rgb(c2)]);

			svg.selectAll("circle").transition().delay(2000).duration(10000)
				.attr("cx", function(d,i){return reset_spots[i][0]})
				.attr("cy", function(d,i){return reset_spots[i][1]})
				.style("fill", function(d,i){return new_color(i);});

			path.transition()
				.style("opacity", "0")
				.remove();
		})
		.on("mouseleave", reset_all);
}

svg.call(drawLine)
	.style("cursor", "crosshair");