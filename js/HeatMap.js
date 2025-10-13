
/*
 * StackedAreaChart - ES6 Class
 * @param  parentElement 	-- the HTML element in which to draw the visualization
 * @param  data             -- the data the that's provided initially
 * @param  displayData      -- the data that will be used finally (which might vary based on the selection)
 *
 * @param  focus            -- a switch that indicates the current mode (focus or stacked overview)
 * @param  selectedIndex    -- a global 'variable' inside the class that keeps track of the index of the selected area
 */

class HeatMap {

// constructor method to initialize StackedAreaChart object
constructor(parentElement, data) {
    this.parentElement = parentElement;
    this.cols = Array.from(new Set(data.map(d=> d.group)));
	this.rows = Array.from(new Set(data.map(d=> d.variable)));
	this.data = data
	this.displayData = [];
}

	/*
	 * Method that initializes the visualization (static content, e.g. SVG area or axes)
 	*/
	initVis(){
		let vis = this;

		vis.margin = {top: 40, right: 40, bottom: 60, left: 40};

		vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
		vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

		// SVG drawing area
		vis.svg = d3.select("#" + vis.parentElement).append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
			.append("g")
			.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


		// Scales and axes
		vis.x = d3.scaleBand()
			.range([0, vis.width])
			.domain(this.cols)
			.padding(0.01);

		vis.y = d3.scaleBand()
			.range([vis.height, 0])
			.domain(vis.rows)
			.padding(0.01);

		vis.xAxis = d3.axisBottom()
			.scale(vis.x);

		vis.yAxis = d3.axisLeft()
			.scale(vis.y);

		vis.svg.append("g")
			.attr("class", "x-axis axis")
			.attr("transform", "translate(0," + vis.height + ")");

		vis.svg.append("g")
			.attr("class", "y-axis axis");


		    // Set ordinal color scale
		vis.colorScale = d3.scaleLinear()
			.range(["white", "#612472ff"]);
		
		vis.tooltip = d3.select("#" + vis.parentElement)
							.append("div")
							.style("opacity", 0)
							.attr("class", "tooltip");
	
		vis.wrangleData();

	}

	/*
 	* Data wrangling
 	*/
	wrangleData(){
		let vis = this;

        vis.displayData = vis.data;

		// Update the visualization
		vis.updateVis();
	}

	/*
	 * The drawing function - should use the D3 update sequence (enter, update, exit)
 	* Function parameters only needed if different kinds of updates are needed
 	*/
	updateVis(){

		let vis = this;
		// SET COLOUR DOMAIN
		let maxValue = d3.max(this.data,d=>{
			return +d.value;
		});

		vis.colorScale.domain([0,maxValue]);

		// Draw the layers
		let categories = vis.svg.selectAll(".value")
			.data(vis.displayData);

		categories.enter().append("rect")
			.attr("class", "value")
			.merge(categories)
			.style("fill", d => {
				return vis.colorScale(+d.value)
			})
			.attr("x", d=>{
				return vis.x(d.group)
			})
			.attr("y", d=>{
				return vis.y(d.variable)
			})
			.attr("width", vis.x.bandwidth())
			.attr("height", vis.y.bandwidth())
			.on("mouseover",(event, d)=>{
				vis.tooltip.style("opacity", 1);
			})
			.on("mouseleave", (d)=>{
				vis.tooltip.style("opacity", 0);
			})
			.on("mousemove", (event,d)=>
				{				

   				 vis.tooltip
					.html("Deaths:<br>" + d.value)
					.style("left", (event.pageX+10) + "px")
					.style("top", (event.pageY) + "px");
					
				});

		categories.exit().remove();

		// Call axis functions with the new domain
		vis.svg.select(".x-axis").call(vis.xAxis);
		vis.svg.select(".y-axis").call(vis.yAxis);
	}
}