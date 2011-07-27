
	var map,
			pos;
		
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
			map.setCenter(new OpenLayers.LonLat(0, 0), 3);
	
			// First of all, we need all the data: points, polygons paths and grid layer.
			// This function will generate random data.
			addSingleMarker();
		}
	});


	function addSingleMarker() {

	  // <script type="text/javascript" charset="utf-8">
	  // 
	  // $("a#interpretation").helpPopover({title:"Interpreted value", message:"Original value: 'spceimen'."});
	  // 
	  //  var latlng = new google.maps.LatLng(-24.397, 130.644);
	  // 
	  //  var myOptions = { zoom: 8, center: latlng, disableDefaultUI: true, mapTypeId: google.maps.MapTypeId.ROADMAP };
	  // 
	  //  var map    = new google.maps.Map(document.getElementById("map"), myOptions);
	  //  var image  = new google.maps.MarkerImage('/img/icons/marker.png', new google.maps.Size(26, 36), new google.maps.Point(0,0), new google.maps.Point(13, 36));
	  //  var shadow = new google.maps.MarkerImage('/img/icons/marker_shadow.png', new google.maps.Size(27, 15), new google.maps.Point(0,0), new google.maps.Point(13, 7));
	  //  var circle = new google.maps.Circle({map: map, radius: 30000, center: latlng, fillColor:"#fff", fillOpacity: .5, strokeWeight:0});
	  // 
	  //  marker = new google.maps.Marker({ map:map, draggable:false, icon: image, shadow:shadow, animation: google.maps.Animation.DROP, position: latlng });
	  // </script>
	}


