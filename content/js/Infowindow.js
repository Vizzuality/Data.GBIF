
 OpenLayers.Popup = OpenLayers.Class({

     	events: null,
     	id: "",
     	lonlat: null,
     	div: null,
     	size: null,   
     	contentHTML: "",
     	backgroundColor: "",
     	opacity: "",
     	border: "",
     	contentDiv: null,
     	groupDiv: null,
     	closeDiv: null,
	   	padding: 0,
	   	map: null,
	
	    /**
	    * Constructor: OpenLayers.Popup
	    * Create a popup.
	    *
	    * Parameters:
	    * id - {String} a unqiue identifier for this popup.  If null is passed
	    *               an identifier will be automatically generated.
	    * lonlat - {<OpenLayers.LonLat>}  The position on the map the popup will
	    *                                 be shown.
	    * size - {<OpenLayers.Size>}      The size of the popup.
	    * contentHTML - {String}          The HTML content to display inside the
	    *                                 popup.
	    * closeBox - {Boolean}            Whether to display a close box inside
	    *                                 the popup.
	    * closeBoxCallback - {Function}   Function to be called on closeBox click.
	    */
	    initialize:function(id, lonlat, size, contentHTML, closeBox, closeBoxCallback, info) {
	        if (id == null) {
	            id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_");
	        }
	
	        this.id = id;
	        this.lonlat = lonlat;
	        this.size = (size != null) ? size: new OpenLayers.Size(OpenLayers.Popup.WIDTH,OpenLayers.Popup.HEIGHT);
	        if (contentHTML != null) {
	             this.contentHTML = contentHTML;
	        }
					this.info = info;
	        this.backgroundColor = 'none';
	        this.opacity = 1;
	        this.border = 'none';
	
	        this.div = OpenLayers.Util.createDiv(this.id, null, null,null, null, null, "hidden");
	        this.div.className = 'olPopup';
	       
	        this.groupDiv = OpenLayers.Util.createDiv(null, null, null,null, "relative", null,"hidden");
	
	        var id = this.div.id + '_';
	        this.contentDiv = OpenLayers.Util.createDiv(id, null, this.size.clone(),null, "relative", null,"hidden");
	        this.contentDiv.className = 'olPopupContent';                                           
	        this.groupDiv.appendChild(this.contentDiv);
	        this.div.appendChild(this.groupDiv);
	
	        this.registerEvents();
	    },
	
	    /**
	     * Method: destroy
	     * nullify references to prevent circular references and memory leaks
	     */
	    destroy: function() {
	        if (this.map != null) {
	            this.map.removePopup(this);
	            this.map = null;
	        }
	        this.events.destroy();
	        this.events = null;
	        this.div = null;
	    },
	
	    /**
	    * Method: draw
	    * Constructs the elements that make up the popup.
	    *
	    * Parameters:
	    * px - {<OpenLayers.Pixel>} the position the popup in pixels.
	    *
	    * Returns:
	    * {DOMElement} Reference to a div that contains the drawn popup
	    */
	    draw: function(px) {
	        if (px == null) {
	            if ((this.lonlat != null) && (this.map != null)) {
	                px = this.map.getLayerPxFromLonLat(this.lonlat);
	            }
	        }
	       
	        this.setSize();
	        this.setBackgroundColor();
	        this.setOpacity();
	        this.setBorder();
	        this.setContentHTML();
	        this.moveTo(px);
	
	        return this.div;
	    },
	
	    /**
	     * Method: updatePosition
	     * if the popup has a lonlat and its map members set,
	     * then have it move itself to its proper position
	     */
	    updatePosition: function(pos,info) {
					this.lonlat = pos;
					
					$(this.contentDiv).find('span.datasets p').text(info.datasets);
					$(this.contentDiv).find('h2').html('<a href="'+info.url+'">'+info.title+'</a>');
					$(this.contentDiv).find('span.species p').text(info.species);
					$(this.contentDiv).find('span.occurrences p').text(info.occurrences);
					
					this.show();
					
					var height_ = ($('div#infowindow_ h2 a').height()>25)?'160px':'140px';
					$('div#infowindow_').css({height:height_,display:'block!important'});
					$('div#infowindow').css({height:height_});
					
	        if ((this.lonlat) && (this.map)) {
	            var px = this.map.getLayerPxFromLonLat(this.lonlat);
	            if (px) {
	                this.moveTo(px);           
	            }   
	        }
	    },
	
	    /**
	     * Method: moveTo
	     *
	     * Parameters:
	     * px - {<OpenLayers.Pixel>} the top and left position of the popup div.
	     */
	    moveTo: function(px) {
	        if ((px != null) && (this.div != null)) {
							var offset = ($('div#infowindow_ h2 a').height()>25)?21:0;
	            this.div.style.left = px.x-131 + "px";
	            this.div.style.top = px.y-175-offset + "px";
	        }
	    },
	
	    /**
	     * Method: visible
	     *
	     * Returns:     
	     * {Boolean} Boolean indicating whether or not the popup is visible
	     */
	    visible: function() {
	        return OpenLayers.Element.visible(this.div);
	    },
	
	    /**
	     * Method: toggle
	     * Toggles visibility of the popup.
	     */
	    toggle: function() {
	        OpenLayers.Element.toggle(this.div);
	    },
	
	    /**
	     * Method: show
	     * Makes the popup visible.
	     */
	    show: function() {
	        OpenLayers.Element.show(this.div);
	    },
	
	    /**
	     * Method: hide
	     * Makes the popup invisible.
	     */
	    hide: function() {
	        OpenLayers.Element.hide(this.div);
	    },
	
	    /**
	     * Method: setSize
	     * Used to adjust the size of the popup.
	     *
	     * Parameters:
	     * size - {<OpenLayers.Size>} the new size of the popup in pixels.
	     */
	    setSize:function(size) {
	        if (size != undefined) {
	            this.size = size;
	        }
	       
	        if (this.div != null) {
	            this.div.style.width = this.size.w + "px";
	            this.div.style.height = this.size.h + "px";
	        }
	        if (this.contentDiv != null){
	            this.contentDiv.style.width = this.size.w + "px";
	            this.contentDiv.style.height = this.size.h + "px";
	        }
	    }, 
	

	    setBackgroundColor:function(color) {
	        if (color != undefined) {
	            this.backgroundColor = color;
	        }
	       
	        if (this.div != null) {
	            this.div.style.backgroundColor = this.backgroundColor;
	        }
	    }, 
	   

	    setOpacity:function(opacity) {
	        if (opacity != undefined) {
	            this.opacity = opacity;
	        }
	       
	        if (this.div != null) {
	            // for Mozilla and Safari
	            this.div.style.opacity = this.opacity;
	
	            // for IE
	            this.div.style.filter = 'alpha(opacity=' + this.opacity*100 + ')';
	        }
	    }, 
	   

	    setBorder:function(border) {
	        if (border != undefined) {
	            this.border = border;
	        }
	       
	        if (this.div != null) {
	            this.div.style.border = this.border;
	        }
	    },     
	   

	    setContentHTML:function(contentHTML) {
					var me = this;
	        this.contentHTML = 
									'<a class="close" href="#close"></a>'+
									'<div class="top">'+
										'<h2><a href="'+this.info.url+'">'+this.info.title+'</a></h2>'+
									'</div>'+
									'<div class="bottom">'+
										'<span class="datasets">'+
											'<p>'+this.info.datasets+'</p>'+
											'<label>datasets</label>'+
										'</span>'+
										'<span class="occurrences">'+
											'<p>'+this.info.occurreces+'</p>'+
											'<label>occurrences</label>'+
										'</span>'+
										'<span class="species">'+
											'<p>'+this.info.species+'</p>'+
											'<label>species</label>'+
										'</span>'+
									'</div>';
	
	        if (this.contentDiv != null) {
	            this.contentDiv.innerHTML = this.contentHTML;
							$(this.contentDiv).find('a.close').click(function(ev){
								ev.stopPropagation();
								ev.preventDefault();
								me.hide();
							});
	        }   
	    },
	   
	
	   
	    /**
	     * Method: registerEvents
	     * Registers events on the popup.
	     *
	     * Do this in a separate function so that subclasses can
	     *   choose to override it if they wish to deal differently
	     *   with mouse events
	     *
	     *   Note in the following handler functions that some special
	     *    care is needed to deal correctly with mousing and popups.
	     *   
	     *   Because the user might select the zoom-rectangle option and
	     *    then drag it over a popup, we need a safe way to allow the
	     *    mousemove and mouseup events to pass through the popup when
	     *    they are initiated from outside.
	     *
	     *   Otherwise, we want to essentially kill the event propagation
	     *    for all other events, though we have to do so carefully,
	     *    without disabling basic html functionality, like clicking on
	     *    hyperlinks or drag-selecting text.
	     */
	     registerEvents:function() {
	        this.events = new OpenLayers.Events(this, this.div, null, true);
	
	        this.events.on({
	            "mousedown": this.onmousedown,
	            "mousemove": this.onmousemove,
	            "mouseup": this.onmouseup,
	            "click": this.onclick,
	            "mouseout": this.onmouseout,
	            "dblclick": this.ondblclick,
	            scope: this
	        });
	       
	     },
	
	    /**
	     * Method: onmousedown
	     * When mouse goes down within the popup, make a note of
	     *   it locally, and then do not propagate the mousedown
	     *   (but do so safely so that user can select text inside)
	     *
	     * Parameters:
	     * evt - {Event}
	     */
	    onmousedown: function (evt) {
	        this.mousedown = true;
	        OpenLayers.Event.stop(evt, true);
	    },
	
	    /**
	     * Method: onmousemove
	     * If the drag was started within the popup, then
	     *   do not propagate the mousemove (but do so safely
	     *   so that user can select text inside)
	     *
	     * Parameters:
	     * evt - {Event}
	     */
	    onmousemove: function (evt) {
	        if (this.mousedown) {
	            OpenLayers.Event.stop(evt, true);
	        }
	    },
	
	    /**
	     * Method: onmouseup
	     * When mouse comes up within the popup, after going down
	     *   in it, reset the flag, and then (once again) do not
	     *   propagate the event, but do so safely so that user can
	     *   select text inside
	     *
	     * Parameters:
	     * evt - {Event}
	     */
	    onmouseup: function (evt) {
	        if (this.mousedown) {
	            this.mousedown = false;
	            OpenLayers.Event.stop(evt, true);
	        }
	    },
	
	    /**
	     * Method: onclick
	     * Ignore clicks, but allowing default browser handling
	     *
	     * Parameters:
	     * evt - {Event}
	     */
	    onclick: function (evt) {
	        OpenLayers.Event.stop(evt, true);
	    },
	
	    /**
	     * Method: onmouseout
	     * When mouse goes out of the popup set the flag to false so that
	     *   if they let go and then drag back in, we won't be confused.
	     *
	     * Parameters:
	     * evt - {Event}
	     */
	    onmouseout: function (evt) {
	        this.mousedown = false;
	    },
	   
	    /**
	     * Method: ondblclick
	     * Ignore double-clicks, but allowing default browser handling
	     *
	     * Parameters:
	     * evt - {Event}
	     */
	    ondblclick: function (evt) {
	        OpenLayers.Event.stop(evt, true);
	    },
	
	    CLASS_NAME: "OpenLayers.Popup"
	});
	
	OpenLayers.Popup.WIDTH = 200;
	OpenLayers.Popup.HEIGHT = 200;
	OpenLayers.Popup.COLOR = "white";
	OpenLayers.Popup.OPACITY = 1;
	OpenLayers.Popup.BORDER = "0px";



// 
// GBIFInfowindow = OpenLayers.Class({
//     icon: null,
//     lonlat: null,
//     events: null,
//     map: null,
// 
//     initialize: function(lonlat, icon, info) {
// 	    this.lonlat = lonlat;
// 	    this.info = info;
// 
// 	    if (this.icon == null) {
// 	      this.icon = icon;
// 	    } else {
//         this.icon.url = icon.url;
//         this.icon.size = icon.size;
//         this.icon.offset = icon.offset;
//         this.icon.calculateOffset = icon.calculateOffset;
// 	    }
// 	    this.events = new OpenLayers.Events(this, this.icon.imageDiv, null);
//     },
//   
//     destroy: function() {
// 	    // erase any drawn features
// 	    this.erase();
// 
// 	    this.map = null;
// 
// 	    this.events.destroy();
// 	    this.events = null;
// 
// 	    if (this.icon != null) {
//         this.icon.destroy();
//         this.icon = null;
// 	    }
//     },
//   
// 
//     draw: function(px) {
// 				
// 			var me = this;
// 	
// 			$(this.icon.imageDiv).addClass('infowindow');
// 			$(this.icon.imageDiv).append(
// 				'<a class="close" href="#close"></a>'+
// 				'<div class="top">'+
// 					'<h2><a href="'+this.info.url+'">'+this.info.title+'</a></h2>'+
// 				'</div>'+
// 				'<div class="bottom">'+
// 					'<span class="datasets">'+
// 						'<p>'+this.info.datasets+'</p>'+
// 						'<label>datasets</label>'+
// 					'</span>'+
// 					'<span class="occurrences">'+
// 						'<p>'+this.info.occurreces+'</p>'+
// 						'<label>occurrences</label>'+
// 					'</span>'+
// 					'<span class="species">'+
// 						'<p>'+this.info.species+'</p>'+
// 						'<label>species</label>'+
// 					'</span>'+
// 				'</div>'
// 			);
// 	
// 			$(this.icon.imageDiv).find('a.close').click(function(ev){
// 				ev.stopPropagation();
// 				ev.preventDefault();
// 				$(me.icon.imageDiv).hide();
// 			});
// 	
// 	    return this.icon.draw(px);
//     },
// 
// 
//     erase: function() {
// 	    if (this.icon != null) {
// 	      this.icon.erase();
// 	    }
//     }, 
// 
// 
//     moveTo: function (px) {
// 			if ((px != null) && (this.icon != null)) {
// 				this.icon.moveTo(px);
// 			}           
// 			this.lonlat = this.map.getLonLatFromLayerPx(px);
// 			this.showInfowindow();
//     },
// 
// 		
// 		showAt: function(pos,info) {
// 			this.lonlat = pos;
// 			
// 			$(this.icon.imageDiv).find('span.datasets p').text(info.datasets);
// 			$(this.icon.imageDiv).find('h2').html('<a href="'+info.url+'">'+info.title+'</a>');
// 			$(this.icon.imageDiv).find('span.species p').text(info.species);
// 			$(this.icon.imageDiv).find('span.occurrences p').text(info.occurrences);
// 			
// 			var px = this.map.getViewPortPxFromLonLat(pos);
// 			this.icon.moveTo(px);
// 			// var h2_height = ($(this.icon.imageDiv).find('div.top').height()>45)?200:175;
// 			// 			
// 			// 			$(this.icon.imageDiv).css({left:px.x+70+'px',top:px.y-h2_height+'px'});
// 			this.moveTo(px);
// 		},
// 		
// 		
// 		showInfowindow: function() {
// 			$(this.icon.imageDiv).show();
// 		},
// 
// 
//     isDrawn: function() {
// 	    var isDrawn = (this.icon && this.icon.isDrawn());
// 	    return isDrawn;   
//     },
// 
// 
//     onScreen:function() {
// 	    var onScreen = false;
// 	    if (this.map) {
// 	      var screenBounds = this.map.getExtent();
// 	      onScreen = screenBounds.containsLonLat(this.lonlat);
// 	    }    
// 	    return onScreen;
//     },
//   
// 
//     inflate: function(inflate) {
// 			if (this.icon) {
// 				var newSize = new OpenLayers.Size(this.icon.size.w * inflate,this.icon.size.h * inflate);
// 			  this.icon.setSize(newSize);
// 			}        
//     },
//   
// 
//     setOpacity: function(opacity) {
//       this.icon.setOpacity(opacity);
//     },
// 
// 
//     setUrl: function(url) {
//       this.icon.setUrl(url);
//     },    
// 
// 
//     display: function(display) {
//     	this.icon.display(display);
//     },
// 
// 
//     CLASS_NAME: "GBIFInfowindow"
// });
// 
