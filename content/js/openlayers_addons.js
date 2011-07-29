/////////////////////////////
// OPENLAYER MARKER STYLES //
/////////////////////////////

///////////////////////
// Full map styles!  //
///////////////////////

var default_style = new OpenLayers.Style({
	externalGraphic: '${image}',
  graphicWidth:30, 
  graphicHeight:32, 
  graphicOpacity:1,
	graphicXOffset: -13,
	graphicYOffset: -35,
  cursor:'pointer',
	label: '${label}',
	fontColor: "white",
  fontSize: "12px",
  fontFamily: "Arial",
  fontWeight: "normal",
  labelAlign: "center",
  labelXOffset: "3",
  labelYOffset: "25"
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
    strokeColor: "#FF6600",
    strokeOpacity: 0.8,
    strokeWidth: 1,
    fillColor: "#ffffff",
    fillOpacity: 0.5
};


var points_style = 
	new OpenLayers.Style({
      pointRadius: 2,
      fillColor: "#FF7700",
      fillOpacity: 1,
      strokeColor: "#ffffff",
      strokeWidth: 1,
      strokeOpacity: 0.60
  });
