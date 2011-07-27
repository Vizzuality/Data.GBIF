/////////////////////////////
// OPENLAYER MARKER STYLES //
/////////////////////////////

///////////////////////
// Full map styles!  //
///////////////////////

var default_style = new OpenLayers.Style({
	externalGraphic: '${image}',
  graphicWidth:28, 
  graphicHeight:42, 
  graphicOpacity:1,
	graphicXOffset: -13,
	graphicYOffset: -35,
  cursor:'pointer',
	label: '${label}',
	fontColor: "white",
  fontSize: "15px",
  fontFamily: "Arial",
  fontWeight: "normal",
  labelAlign: "center",
  labelXOffset: "0",
  labelYOffset: "20"
},{
  context: {
  	label: function(feature) {
    	var pix = '';
      if (feature.cluster!=undefined && feature.cluster.length>1) {
      	pix = feature.cluster.length;
      }
      return pix;
    },
		image: function(feature) {
    	if (feature.cluster!=undefined && feature.cluster.length>1) {
      	return '/img/cluster_marker.png';
      } else {
				return '/img/marker.png';
			}
		}
	}
});


var hover_style = new OpenLayers.Style({
	externalGraphic: '${image}',
},{
	context: {
		image: function(feature) {
    	if (feature.cluster!=undefined && feature.cluster.length>1) {
      	return '/img/cluster_marker_hover.png';
      } else {
				return '/img/marker_hover.png';
			}
		}
	}
});



///////////////////////
// Map types styles! //
///////////////////////

var polygon_style = {
    strokeColor: "#000000",
    strokeOpacity: 1,
    strokeWidth: 2,
    fillColor: "#00FF00",
    fillOpacity: 0.6
};


var points_style = 
	new OpenLayers.Style({
      pointRadius: 5,
      fillColor: "#ffcc66",
      fillOpacity: 1,
      strokeColor: "#cc6633",
      strokeWidth: 2,
      strokeOpacity: 1
  });
