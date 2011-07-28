
	var map;
	var position = {
		x: 130.644,
		y: -24.397
	}
	var precission = 0.8; // degrees
	
	// Necessary things to run these kind of map
	// - class singlemap to body
	// - declare a position with x and y
	// - declare a preccission var


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
			map = new OpenLayers.Map('map', {controls: [], numZoomLevels: 20, units:'km'});


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
			addSingleMarker();
		}
	});



	function addSingleMarker() {
		// Precission circle
		var origin = new OpenLayers.Geometry.Point(position.x, position.y);
		var lonlat = new OpenLayers.LonLat(position.x,position.y);
		
		var circle = new OpenLayers.Geometry.Polygon.createRegularPolygon(origin, precission, 50);
		var vlayer = new OpenLayers.Layer.Vector("Editable Vectors");
		map.addLayers([vlayer]);
		vlayer.addFeatures([new OpenLayers.Feature.Vector(circle)]);

	
		// Single marker
		var markers = new OpenLayers.Layer.Markers( "Markers" );
		map.addLayer(markers);
	
		var size = new OpenLayers.Size(36,45);
	  var offset = new OpenLayers.Pixel(-(size.w/2), -37);
	  var icon = new OpenLayers.Icon('/img/marker_big.png',size,offset);
	  markers.addMarker(new OpenLayers.Marker(lonlat,icon));

		map.setCenter(lonlat, 5);
	}


