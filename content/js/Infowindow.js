var zActualIndex = 999;

GBIFInfowindow = OpenLayers.Class({
    icon: null,
    lonlat: null,
    events: null,
    map: null,

    initialize: function(lonlat, icon, info) {
	    this.lonlat = lonlat;
	    this.info = info;

	    if (this.icon == null) {
	        this.icon = icon;
	    } else {
	        this.icon.url = icon.url;
	        this.icon.size = icon.size;
	        this.icon.offset = icon.offset;
	        this.icon.calculateOffset = icon.calculateOffset;
	    }
	    this.events = new OpenLayers.Events(this, this.icon.imageDiv, null);
    },
    
    destroy: function() {
	    // erase any drawn features
	    this.erase();

	    this.map = null;

	    this.events.destroy();
	    this.events = null;

	    if (this.icon != null) {
	        this.icon.destroy();
	        this.icon = null;
	    }
    },
    

    draw: function(px) {
				
			var me = this;
		
			$(this.icon.imageDiv).css('background','url(/img/infowindow.png) no-repeat 0 0');
			$(this.icon.imageDiv).css('z-index',100000);
		
			$(this.icon.imageDiv).find('a.title').click(function(ev){
				ev.stopPropagation();
				ev.preventDefault();
				window.location.href=me.info.url;
			});
		
			$(this.icon.imageDiv).find('a.close').click(function(ev){
				ev.stopPropagation();
				ev.preventDefault();
				$(me.icon.imageDiv).hide();
			});
		
	    return this.icon.draw(px);
    },


    erase: function() {
	    if (this.icon != null) {
	      this.icon.erase();
	    }
    }, 


    moveTo: function (px) {
			if ((px != null) && (this.icon != null)) {
				this.icon.moveTo(px);
			}           
			this.lonlat = this.map.getLonLatFromLayerPx(px);
    },


    isDrawn: function() {
	    var isDrawn = (this.icon && this.icon.isDrawn());
	    return isDrawn;   
    },


    onScreen:function() {
	    var onScreen = false;
	    if (this.map) {
	      var screenBounds = this.map.getExtent();
	      onScreen = screenBounds.containsLonLat(this.lonlat);
	    }    
	    return onScreen;
    },
    

    inflate: function(inflate) {
			if (this.icon) {
				var newSize = new OpenLayers.Size(this.icon.size.w * inflate,this.icon.size.h * inflate);
			  this.icon.setSize(newSize);
			}        
    },
    

    setOpacity: function(opacity) {
      this.icon.setOpacity(opacity);
    },


    setUrl: function(url) {
      this.icon.setUrl(url);
    },    


    display: function(display) {
    	this.icon.display(display);
    },


    CLASS_NAME: "GBIFInfowindow"
});

