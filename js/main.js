
// Variables for the visualization instances
let heatmap;


// Start application by loading the data
loadData();

function loadData() {


	d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv").then(function(data) {
    console.log("data is loaded");

	// Prepare the data so that it can be converted into a heatmap
	let clean_data = prepareData(data)

	// Create heatmap visualizations
	heatmap = new HeatMap("heatmap", clean_data)
	heatmap.initVis();
	
	});


}


// helper function to prepare raw data
function prepareData(data){

	return data
}



