		
		var map;
		
		$(function(){
			// If body has fullmap class - search #map and start rendering map
			if ($('body').hasClass('mapfull')) {
				
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
					generateMarkers();
				});
				
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
				
				map.setCenter(new OpenLayers.LonLat(0, 0), 5);
				
				// TESTTTTTT
				var markers = new OpenLayers.Layer.Markers( "Markers" );
				map.addLayer(markers);
				var size = new OpenLayers.Size(261,165);
				var offset = new OpenLayers.Pixel(-(size.w/2), -168);
				var infowindow_bkg = new OpenLayers.Icon('/img/infowindow.png',size,offset);
				var infowindow = new GBIFInfowindow(new OpenLayers.LonLat(0,0),infowindow_bkg, {});
				markers.addMarker(infowindow);
			}
		});
		
		
		function generateMarkers() {
			///////////////////
			// Cluster stuff //
			///////////////////
			
			
			// Create markers (TODO REQUEST MARKERS)
			var dx = 9;
      var dy = 9;
      var px, py;
      features = [];
      for(var x=-45; x<=45; x+=dx) {
        for(var y=-22.5; y<=22.5; y+=dy) {
          px = x + (2 * dx * (Math.random() - 0.5));
          py = y + (2 * dy * (Math.random() - 0.5));
					features.push(new OpenLayers.Feature.Vector(
          	new OpenLayers.Geometry.Point(px, py), {x: px, y: py}
          ));
        }
      }



			var default_ = new OpenLayers.Style({
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
                    if(feature.cluster.length>1) {
                        pix = feature.cluster.length;
                    }
                    return pix;
                },
								image: function(feature) {
                  if (feature.cluster.length>1) {
                  	return '/img/cluster_marker.png';
                  } else {
										return '/img/marker.png';
									}
								}
            }
        });

				
				var hover_ = new OpenLayers.Style({
					externalGraphic: '${image}',
				},{
					context: {
						image: function(feature) {
              if (feature.cluster.length>1) {
              	return '/img/cluster_marker_hover.png';
              } else {
								return '/img/marker_hover.png';
							}
						}
					}
				});

	     strategy = new OpenLayers.Strategy.Cluster();
			
			

	     clusters = new OpenLayers.Layer.Vector("Clusters", {
	         strategies: [strategy],
	         styleMap: new OpenLayers.StyleMap({
	             "default": default_,
							 "temporary": hover_
	         }),
					 rendererOptions: {zIndexing: true}
	     });


			var highlightCtrl = new OpenLayers.Control.SelectFeature(clusters, {
          hover: true,
					highlightOnly: true,
					renderIntent: "temporary"
       });

       var selectCtrl = new OpenLayers.Control.SelectFeature(clusters,
          {clickout: true,
						eventListeners: {
            	featurehighlighted: onSelect
            }
					}
       );

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
		}
		
		
		
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

		
		function onSelect(event) {
			var bounds = new OpenLayers.Bounds();
			if (event.feature.cluster.length>1) {
				_.each(event.feature.cluster,function(feature,i){
					bounds.extend(new OpenLayers.LonLat(feature.geometry.x,feature.geometry.y));
				});
				map.zoomToExtent(bounds);
			} else {
				// Show tooltip
			}
		}
