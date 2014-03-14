var layer = new L.StamenTileLayer("toner");

var lat = 42.36837, 
    lon = -83.35270969999999; // the coordinates of Livonia, MI


var map = new L.Map("map", {
    center: new L.LatLng(lat,lon),
    zoom: 10,
    minZoom: 10,
    maxZoom: 10,
    doubleClickZoom: false,
});
map.addLayer(layer);

var svg = d3.select(map.getPanes().overlayPane).append("svg");
var g = svg.append("g").attr("class", "leaflet-zoom-hide");

// get centroid/center of gravity
// var total_count = d3.sum(data, function(d){return d.count})
// var cent_x = d3.sum(data, function(d) {return d2point(d).x * d.count}) / total_count
// var cent_y = d3.sum(data, function(d) {return d2point(d).y * d.count}) / total_count

// var single_centroid = [{x: cent_x,
// 								 			 	y: cent_y,
// 								 			 	city: "Centroid",
// 								 			 	count:""}];

console.log("centroid is: ", single_centroid);



var tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d.city + " " + d.count; });
svg.call(tip)
var side_length = 60;
var padding = 1;

// These are transformation functions for d3, that allow my lat long
// data to interface with leaflet
function projectPoint(x, y) {
    // var point = latLng2point(x,y);
    // this.stream.point(point.x, point.y);
    this.stream.point(x,y);
}
function latLng2point(x,y){
    return map.latLngToLayerPoint(new L.LatLng(y, x));
}
function d2point(d){
    return latLng2point(d.lon,d.lat);
}

function point2latLng(x,y){
		return map.layerPointToLatLng(L.point(x,y));
}

var transform = d3.geo.transform({point: projectPoint});
var path = d3.geo.path().projection(transform);

var points = _.map(data, function(d){
	var xy_point = d2point(d);
	return {x: xy_point.x,
					y: xy_point.y,
					count: d.count}
});
console.log(points);
var drag = d3.behavior.drag()
    .on("dragstart", dragstarted)
    .on("drag", dragged)
    .on("dragend", dragended);

//example
var circle_colors = ["rgba(255,0,0,.8)", "rgba(0,255,0,.5)", "rgba(0,0,255,.5)"];

g.selectAll(".member")
	.data(data)
	.enter().append("circle")
	.attr("class","member")
	.attr("cx",function(d){return d2point(d).x; })
	.attr("cy",function(d){return d2point(d).y; })
	.attr("r", function(d){ return Math.pow(d.count,.5)*5;})
	.attr("fill", circle_colors[0])
	.on('mouseover', tip.show)
  .on('mouseout', tip.hide);

g.selectAll(".centroid")
	.data(single_centroid)
	.enter().append("circle")
	.attr("class","centroid")
	.attr("cx",function(d){return d2point(d).x; })
	.attr("cy",function(d){return d2point(d).y; })
	.attr("r", 25)
	.attr("fill", circle_colors[1])
	.on('mouseover', tip.show)
  .on('mouseout', tip.hide)
  .call(drag);

g.selectAll(".two_centroid")
    .data(centroid)
    .enter().append("circle")
    .attr("class","two_centroid")
    .attr("cx",function(d){return d2point(d).x; })
    .attr("cy",function(d){return d2point(d).y; })
    .attr("r", 20)
    .attr("fill", circle_colors[2])
    .on('mouseover', tip.show)
	  .on('mouseout', tip.hide);

// make the legend for the various circles

var legend_svg = d3.select("#legend").append("svg");
var circle_radius = 20;
var padding = 10;
legend_svg.selectAll("circle")
		.data(circle_colors)
    .enter().append("circle")
    .attr("cx", circle_radius * 1.5)
    .attr("cy", function(d, i) { return i*circle_radius*2.2 + circle_radius + padding; })
    .attr("r", circle_radius)
    .attr("fill", function(d) { return d; });

var text_legend = ["Meetup data scientists", "Optimal single location", "Optimal dual locations"];
legend_svg.selectAll("text")
    .data(text_legend)
    .enter().append("text")
    .text(function(d) { return d; })
    .attr("x", circle_radius * 3)
    .attr("y", function(d, i) { return i*circle_radius*2.2 + circle_radius + padding + 6; })
    .attr("font-family", "Helvetica, Arial, sans-serif")
    .attr("font-size", "16px");

	   
  // transform  the data into lt long



// drag stuff

function dragstarted(d) {
  d3.event.sourceEvent.stopPropagation();
  d3.select(this).classed("dragging", true);

}

function dragged(d) {
  d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
  mean_distance(d);
}

function dragended(d) {
  d3.select(this).classed("dragging", false);
}

function mean_distance(d) {
    // calculates the mean distance from all other red points, weighted b
    // number of data scientists d is an object: d.x = number, d.y =
    // number  points is a list of objects. each obj has x and 
    //  attribute. multiples, .e.i Ann Arbor, are listed multiple times.
    var total_distance = _.reduce(points, function(memo, point){ 
    			var distance = point.count * distance_formula(point,d)
    			return memo + distance; }, 0);
    console.log(Math.round(total_distance / 50));
    $("#distance_traveled").html((total_distance/50).toFixed(1))
}

function distance_formula(a,b) {
		var first = point2latLng(a.x,a.y);
		var second = point2latLng(b.x,b.y);
		return getDistanceFromLatLonInKm(first.lat, first.lng, second.lat, second.lng);

    // return Math.pow( (Math.pow( (b.x - a.x), 2) + Math.pow( (b.y - a.y), 2) ), 0.5) 
}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371 * 0.621371; // Radius of the earth in miles
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in miles
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}
