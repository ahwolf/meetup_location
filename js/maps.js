var layer = new L.StamenTileLayer("toner");

var lat = 41.88362062793376, 
    lon = -87.64411926269531; // the coordinates of Chicago

var map = new L.Map("map", {
    center: new L.LatLng(lat,lon),
    zoom: 12,
    minZoom: 11,
    maxZoom: 15,
    doubleClickZoom: false,
});
map.addLayer(layer);

var svg = d3.select(map.getPanes().overlayPane).append("svg");
var g = svg.append("g").attr("class", "leaflet-zoom-hide");

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
    return latLng2point(d.longitude,d.latitude);
}

var transform = d3.geo.transform({point: projectPoint});
var path = d3.geo.path().projection(transform);


function polygon2geoJsonFeature(polygon){
    // geo_json polygons need to start and stop at the same point
    polygon.push(polygon[0]) 
    return {
	"type": "Feature",
	"properties": {
	    "name": polygon.point.name,
	},
	"geometry": {
	    "type": "Polygon",
	    "coordinates": [polygon]
	}
    };
}

//example
console.log("data is: ", data);


	   
  // transform  the data into lt long



//     g.selectAll("circle")
// 	.data(data)
// 	.enter()
// 	.append("circle")
// 	.attr("class","centers")
// 	.attr('cx', function(d) { 
// 	    return d.x(); })
// 	.attr('cy', function(d) { 
// 	    return d.y(); })
// 	.attr('r', how_far_to_walk() / 32)
// 	.attr("fill","#196E82")
// 	.attr("stroke","black");

//     map.setMaxBounds(
// 	L.latLngBounds(corners_of_map.map(function(d){
// 	    return new L.LatLng(d[0],d[1]);})))

//     geo_json = data2geo_json(data);
//     number_of_choices = 1; // global variable to keep track of how
// 			   // many times i've recolored tiles. This
// 			   // will ensure that the last tile has the
// 			   // biggest top value, so it'll be on top.
    
//     var mouseover_enabled = true;

//     var feature = g.selectAll("path")
//     	.data(geo_json.features)
//     	.enter().append("path")
//         .attr("clip-path", 
// 	      function(d,i) { return "url(#clip-"+i+")"; })
// 	// .style("fill", function(d){
// 	//     return colorScale(d.in_out);})
//        .on("click", on_click)         
// 	.on("mouseover", on_mouseover); 
//     // mouse_over works inititally, until there's been a click. When
//     // there's been a click -- mouse_over is disabled.

//     map.on("viewreset", reset);
//     reset();

//     function on_mouseover(d,i){
// 	var that = this;
// 	if (mouseover_enabled){
// 	    color_tiles(d,i,that);
// 	}
//     }

//     function on_click(d,i){
// 	var that = this;
// 	mouseover_enabled = !mouseover_enabled;
// 	color_tiles(d,i,that);
//     }

//     function color_tiles(geo_feature,index,that){
// 	// update scale and recolors tiles according to dynamic scale
// 	geo_feature.properties.top = number_of_choices++;
	
// 	station_detail.selectAll("text").remove();
// 	station_detail
// 	    .append("text")
// 	    .text(geo_feature.properties.name);

// 	var extent = d3.extent(geo_feature.properties.outCounts);
// 	colorScale = d3.scale.quantize()
// 	    .domain(extent)
// 	    .range(blues);
// 	var small = extent[1]/6; //  *3/2;
// 	var middle= small * 3;
// 	var big   = extent[1];
// 	var text_extent = [small,middle,big]
// 	    .map(Math.round)
// 	    .map(numberWithCommas)
// 	svg_legend.selectAll("text")
// 	    .data(text_extent)
// 	    .text(function(d){return d;})
// 	    .attr("y", side_length + 20) // /2+5)
// 	    .attr("x", function(d,i){
// 		return (padding + side_length)*i*2+side_length/2;})
// 	    .attr("text-anchor", "middle");

// 	// divvy: 5DBCD2
// 	// darker 196E82
// 	g.selectAll("path")
// 	    .sort(function(a,b){ 
// 		return a.properties.top-b.properties.top; })
// 	    .style("stroke","white")
// 	    .style("stroke-width",function(d){
// 		if (geo_feature.properties.outCounts[d.properties.index]>small){
// 		    return .3;
// 		} else {
// 		    return 0;
// 		}
// 	    });

// 	d3.select(that)
// 	    .style("stroke","black")
// 	    .style("stroke-width","2.1");

// 	g.selectAll("path")
// 	    .style("fill", function(d){
// 		return colorScale(geo_feature
// 				  .properties
// 				  .outCounts[d.properties.index]);
// 	    }); // Assumes the ordering in outCounts matches the
// 		// INITIAL ordering of the paths. This ordering can
// 		// change, but index doesn't.

// 	//d3.select("legend")
// 	var top3_indices = argSort(geo_feature.properties.outCounts);
// 	top3_originate = [];
// 	_.each( top3_indices.sortIndices.slice(0,3), function(d,i) {
// 	    top3_originate.push({
// 		rank:i+1,
// 		name:data[d].name,
// 		count:top3_indices[i]
// 	    });
// 	});
	
// 	top3_terminate = data.map(function(d,i){
// 	    return {name:d.name,
// 		    count:$.parseJSON(d.outCounts)[geo_feature.properties.index]
// 		   };})
// 	    .sort(function(a,b){ return b.count - a.count})
// 	    .slice(0,3)
// 	_.each(top3_terminate, function(d,i){
// 	    d.rank = i+1;
// 	});

// 	original_total = geo_feature.properties.outCounts
// 	    .reduce(function(pv, cv) { return pv + cv; }, 0);
// 	terminal_total = geo_json.features
// 	    .map(function(x){
// 		return x.properties.outCounts[geo_feature.properties.index]})
// 	    .reduce(function(a,b){return a+b});

// 	top3_originate.push({rank:"TOTAL",
// 			     name:"all stations",
// 			     count:original_total});
// 	top3_terminate.push({rank:"TOTAL",
// 			     name:"all stations",
// 			     count:terminal_total});

// 	$("span.station-name").html(geo_feature.properties.name)
// 	update_table("terminate",top3_terminate,"to");
// 	update_table("originate",top3_originate,"from");
//     };

//     function update_table(direction, data,text){
// 	function td(stuff,class_name){
// 	    class_name = class_name || "";
// 	    return "<td class='"+class_name+"'>"+stuff+"</td>";
// 	}
// 	function span(stuff,class_name){
// 	    class_name = class_name || "";
// 	    return "<span class='"+class_name+"'>"+stuff+"</span>";
// 	}
// 	var html = ""

// 	_.each(data, function(d){
// 	    var tds = td(numberWithCommas(d.count),     "NTrips");
// 	    tds +=    td("&nbsp;"+text+" "+nice_name(d),"RowStationName");
// 	    html += "<tr>"+ tds +"</tr>";
// 	});

// 	$("#"+direction +">tbody").html(html)
//     }

//     function nice_name(d){
// 	return d.name
// 	    .replace(/ & /g,"/")
// 	    .replace(/ St/g,"")
// 	    .replace(/ Dr/g,"")
// 	    .replace(/ Ave/g,"")
// 	    .replace(/ Pkwy/g,"")
// 	    .replace(/ Rd/g,"")
// 	    .replace(/ Blvd/g,"")
// 	    .replace(/ Way/g,"")
// 	    .replace(/ Ln/g,"")
// 	    .replace(/ Ct/g,"")
// 	    .replace(/ Plaza/g,"")
// 	    .replace(/ Pl/g,"")
// 	    .replace(/Merchandise Mart/g,"MerchMart")
//     }

//     function reset(){
// 	// even though geo_json doesn't change, since path is a
// 	// function that depends on the map boundaries (zoom level,
// 	// position), the path function needs to be reset
// 	geo_json = data2geo_json(data);
// 	feature.data(geo_json.features); // updates the features w new data
	
// 	var bounds      = path.bounds(geo_json);
// 	var topLeft     = bounds[0];
//     	var bottomRight = bounds[1];

//     	svg .style("width", bottomRight[0] - topLeft[0] + "px")
//     	    .style("height", bottomRight[1] - topLeft[1] + "px")
//     	    .style("left", topLeft[0] + "px")
//     	    .style("top", topLeft[1] + "px")
	
//     	g   .attr("transform", 
//     		  "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

// 	// update the coordinates of the voronoi polygons
// 	feature.attr("d",path);

// 	// update the coordinates of the circles
// 	clips.selectAll("circle")
// 	    .attr('cx', function(d) { 
// 		return d.x(); })
// 	    .attr('cy', function(d) { 
// 		return d.y(); })
// 	    .attr('r', how_far_to_walk());
	
// 	g.selectAll(".centers")
// 	    .attr("class","centers")
// 	    .attr('cx', function(d) { 
// 		return d.x(); })
// 	    .attr('cy', function(d) { 
// 		return d.y(); })
// 	    .attr('r', how_far_to_walk() /32)
// 	    .attr("fill","#196E82")
// 	    .attr("stroke","black");
//     };
// })

// function argSort(toSort) {
//     var out = new Array(300);
//     for (var i = 0; i < toSort.length; i++) {
// 	out[i] = [toSort[i], i];
//     }
//     out.sort(function(a, b)
// 	     {
// 		 return b[0]-a[0];	
// 	     });
//     // out.map(function(x){return x[1];});

//     out.sortIndices = [];
//     for (var j = 0; j < toSort.length; j++) {
// 	out.sortIndices.push(out[j][1]);
// 	out[j] = out[j][0];
//     }
//     return out;
// }

// function numberWithCommas(x) {
//     return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// }

var mapmargin = 70;
$(window).on("resize", resize);
resize();
function resize(){

    if($(window).width()>=980){
        $('#map_wrapper').css("padding-left", mapmargin);
    }else{
        $('#map_wrapper').css("padding-left", 0);
    }

}
