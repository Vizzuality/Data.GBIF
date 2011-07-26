
	var strategy,
			clusters,
			infowindow
			map,
			features = [];

	// Openlayers functions and addons in
	// js/openlayers_addons.js
	// - Hover and default marker style there.
	// - ...


	$(function(){
		// If body has fullmap class - search #map and start rendering map
		if ($('body').hasClass('mapfull')) {

			// Create infowindow
			infowindow = new OpenLayers.Popup("infowindow",new OpenLayers.LonLat(0,0),new OpenLayers.Size(261,140),'',false,null,{title:'GBIF Infowindow',datasets:43,occurreces:1234,species:42,url:'/'});


			// Create markers (TODO REQUEST MARKERS or TAKE FROM A JS VAR)
			var dx = 9;
	    var dy = 9;
	    var px, py;
	    features = [];
	    for(var x=-45; x<=45; x+=dx) {
	      for(var y=-22.5; y<=22.5; y+=dy) {
	        px = x + (2 * dx * (Math.random() - 0.5));
	        py = y + (2 * dy * (Math.random() - 0.5));
					features.push(new OpenLayers.Feature.Vector(
	        	new OpenLayers.Geometry.Point(px, py), {x: px, y: py, title: "Example - "+px.toFixed(2)+','+py.toFixed(2), url: "/", datasets:y, species:x, occurrences:dx}
	        ));
	      }
	    }


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


			// Explore map control
			$('.mapfull p.explore a').click(function(ev){
				ev.stopPropagation();
				ev.preventDefault();

				$('a.zoom_out,a.zoom_in').show();
				$('.mapfull .dataset').fadeOut();

				if ($(this).closest('article').hasClass('cluster')) {
					generateClusterMarkers(features);
				} else {
					generateCountryMarkers(features);
				}
			});


			// Initialize map
			map = new OpenLayers.Map('map', {controls: [],numZoomLevels: 20});
			map.events.register("zoomend", map, function() {
				infowindow.hide();
				map.events.remove('zoomend');
			});

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
			map.setCenter(new OpenLayers.LonLat(0, 0), 5);
		}
	});


	/////////////////////
	// Countries stuff //
	/////////////////////
	function generateCountryMarkers(features) {
		// allow testing of specific renderers via "?renderer=Canvas", etc
	  var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
	  renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;


	 	var countries = new OpenLayers.Layer.Vector("Countries", {
	  	styleMap: new OpenLayers.StyleMap({
	    	"default": default_style,
				"hover": hover_style
	    }),
			rendererOptions: {zIndexing: true},
			renderers: renderer
	  });


		var highlightCtrl = new OpenLayers.Control.SelectFeature(countries, {
			hover: true,
			highlightOnly: true,
			renderIntent: "hover"
	  });

	  var selectCtrl = new OpenLayers.Control.SelectFeature(countries,{
			clickout: true,
			select: onSelect
		});

	  map.addControl(highlightCtrl);
	  map.addControl(selectCtrl);

	  highlightCtrl.activate();
	  selectCtrl.activate();

	  map.addLayers([countries]);
	  setTimeout(function(){countries.addFeatures(features)},500);

		// Set bounds to map
		var bounds = new OpenLayers.Bounds();
		$.each(features,function(i,feature){
			bounds.extend(feature.geometry);
		});
	 	map.zoomToExtent(bounds);


		map.addPopup(infowindow);
	}


	///////////////////
	// Cluster stuff //
	///////////////////
	function generateClusterMarkers(features) {

		// allow testing of specific renderers via "?renderer=Canvas", etc
	  var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
	  renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;


	  strategy = new OpenLayers.Strategy.Cluster();

	 	clusters = new OpenLayers.Layer.Vector("Clusters", {
	      strategies: [strategy],
	      styleMap: new OpenLayers.StyleMap({
	        "default": default_style,
				  "hover": hover_style
	      }),
				rendererOptions: {zIndexing: true},
				renderers: renderer
	   });


		var highlightCtrl = new OpenLayers.Control.SelectFeature(clusters, {
	      hover: true,
				highlightOnly: true,
				renderIntent: "hover"
	   });

	  var selectCtrl = new OpenLayers.Control.SelectFeature(clusters,{
				clickout: true,
				select: onSelect
		});

	   map.addControl(highlightCtrl);
	   map.addControl(selectCtrl);

	   highlightCtrl.activate();
	   selectCtrl.activate();

	   map.addLayers([clusters]);


	   reset();
	   $("reset").onclick = reset;


		// Set bounds to map
		var bounds = new OpenLayers.Bounds();
		$.each(features,function(i,feature){
			bounds.extend(feature.geometry);
		});
	 	map.zoomToExtent(bounds);

		// Adding infowindow popup
		map.addPopup(infowindow);
	}


	// Reset function for cluster render
	function reset() {
		var distance = parseInt($("distance").value);
		var threshold = parseInt($("threshold").value);
		strategy.distance = distance || strategy.distance;
		strategy.threshold = threshold || strategy.threshold;
		$("distance").value = strategy.distance;
		$("threshold").value = strategy.threshold || "null";
		clusters.removeFeatures(clusters.features);
		clusters.addFeatures(features);
	}


	// On select feature - show tooltip or focus on cluster markers
	function onSelect(event) {
		var bounds = new OpenLayers.Bounds();
		if (event.cluster!=undefined && event.cluster.length>1) {
			// If cluster - bounds to cluster markers
			infowindow.hide();
			_.each(event.cluster,function(feature,i){
				bounds.extend(new OpenLayers.LonLat(feature.geometry.x,feature.geometry.y));
			});
			map.zoomToExtent(bounds);
		} else {
			// Show tooltip
			infowindow.changePosition(new OpenLayers.LonLat(event.geometry.x,event.geometry.y),event.data);
		}
	}