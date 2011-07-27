
	var map;
		
			// Necessary things to run these kind of map
			// - class singlemap to body


	$(function(){
		// If body has typesmap class - search #map and start rendering map
		if ($('body').hasClass('singlemap')) {

			// Create zoom controls
			$('a.zoom_in').click(function(ev){
				ev.stopPropagation();
				ev.preventDefault();
				map.zoomIn();					
			});
			$('a.zoom_out').click(function(ev){
				ev.stopPropagation();
				ev.preventDefault();
				map.zoomOut();
			});
	

			// Initialize map
			map = new OpenLayers.Map('map', {controls: [],numZoomLevels: 20});


			// Activate double click
			var dblclick = new OpenLayers.Handler.Click(this, {dblclick: function() {map.zoomIn()}, click: null }, {single: true, 'double': true, stopSingle: false, stopDouble: true});
	    dblclick.setMap(map);
	    dblclick.activate();

			// Drag with mouse
			map.addControl(new OpenLayers.Control.Navigation({zoomWheelEnabled : false}));
			map.addControl(new OpenLayers.Control.MousePosition({element: $('#map')}));

			// Tiles
	    var ol_wms = new OpenLayers.Layer.WMS("OpenLayers WMS","http://vmap0.tiles.osgeo.org/wms/vmap0",{layers: 'basic'});
			map.addLayers([ol_wms]);
	
			// First of all, we need all the data: points, polygons paths and grid layer.
			// This function will generate random data.
			var pos = new OpenLayers.LonLat(130.644, -24.397);
			var precission = 1000;
			addSingleMarker(pos,precission);
		}
	});



	function addSingleMarker(position,precission) {
		// Precission circle
		
		var origin = new OpenLayers.Geometry.Point(position.x, position.y);
		// allow testing of specific renderers via "?renderer=Canvas", etc
	  var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
	  renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;


	 	var circle_layer = new OpenLayers.Layer.Vector("Circle", {
	  	styleMap: new OpenLayers.StyleMap({
	    	"default": new OpenLayers.Style({
			      pointRadius: '${radius}',
			      fillColor: "#ffcc66",
			      fillOpacity: 1,
			      strokeColor: "#cc6633",
			      strokeWidth: 2,
			      strokeOpacity: 1
			  },{
					context: {
						radius: function() {
							return precission
						}
					}
				})
	    }),
			renderers: renderer
	  });


	  var selectCtrl = new OpenLayers.Control.SelectFeature(circle_layer,{
			clickout: true,
			select: onSelect
		});

	  map.addControl(selectCtrl);
	  selectCtrl.activate();

	  map.addLayers([circle_layer]);
	 	circle_layer.addFeatures([new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(px, py))]);


		
		// Single marker
		var markers = new OpenLayers.Layer.Markers( "Markers" );
		map.addLayer(markers);
		
		var size = new OpenLayers.Size(28,42);
    var offset = new OpenLayers.Pixel(-(size.w/2), -37);
    var icon = new OpenLayers.Icon('/img/marker.png',size,offset);
    markers.addMarker(new OpenLayers.Marker(position,icon));

		map.setCenter(position, 5);
	}


