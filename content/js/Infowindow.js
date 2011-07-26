
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
	

		    initialize:function(id, lonlat, size, contentHTML, closeBox, closeBoxCallback, info) {
		        if (id == null) {
		            id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_");
		        }
	
		        this.id = id;
		        this.lonlat = lonlat;
		        this.size = size
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
	

		    destroy: function() {
		        if (this.map != null) {
		            this.map.removePopup(this);
		            this.map = null;
		        }
		        this.events.destroy();
		        this.events = null;
		        this.div = null;
		    },
	

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

	
				updatePosition: function() {
					if ((this.lonlat) && (this.map)) {
	           var px = this.map.getLayerPxFromLonLat(this.lonlat);
	           if (px) {
	               this.moveTo(px);           
	           }   
	       }
				},
			
			
		    changePosition: function(pos,info) {
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

		    moveTo: function(px) {
		        if ((px != null) && (this.div != null)) {
								var offset = ($('div#infowindow_ h2 a').height()>25)?21:0;
		            this.div.style.left = px.x-131 + "px";
		            this.div.style.top = px.y-175-offset + "px";
		        }
		    },

		    visible: function() {
		        return OpenLayers.Element.visible(this.div);
		    },

		    toggle: function() {
		        OpenLayers.Element.toggle(this.div);
		    },

		    show: function() {
					$(this.div).css({opacity:0});
	        this.div.style.display = "block";
					this.div.style.marginTop = "10px";

	        $(this.div).stop().animate({
	        	marginTop: '0px',
	          opacity: 1
	        }, 150, 'swing');
		    },

		    hide: function() {
					var me = this;
					$(this.div).stop().animate({
	          marginTop: '10px',
	          opacity: 0
	        }, 100, 'swing', function(ev){
	          me.div.style.display = "none";
	        });
		    },

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

		    onmousedown: function (evt) {
		        this.mousedown = true;
		        OpenLayers.Event.stop(evt, true);
		    },
		    onmousemove: function (evt) {
		        if (this.mousedown) {
		            OpenLayers.Event.stop(evt, true);
		        }
		    },
		    onmouseup: function (evt) {
		        if (this.mousedown) {
		            this.mousedown = false;
		            OpenLayers.Event.stop(evt, true);
		        }
		    },
		    onclick: function (evt) {
		        OpenLayers.Event.stop(evt, true);
		    },
		    onmouseout: function (evt) {
		        this.mousedown = false;
		    },

		    ondblclick: function (evt) {
		        OpenLayers.Event.stop(evt, true);
		    },
	
		    CLASS_NAME: "OpenLayers.Popup"
		});
