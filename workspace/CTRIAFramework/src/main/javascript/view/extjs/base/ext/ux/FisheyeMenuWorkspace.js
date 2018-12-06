

// namespace
Ext.ns('Ext.ux');

/**
 * @class Ext.ux.FisheyeMenu
 * @extends-ext Ext.util.Observable
 * @author Niko Ni (bluepspower@163.com)
 * @demo http://cz9908.com/showcase/?item=fisheye-menu&p=1
 * @demo-extra http://cz9908.com/showcase/?item=desktop-fisheye&p=1
 * @thumbnail http://cz9908.com/thumb/?item=fisheye-menu
 * @version v0.3
 * @create 2009-06-26
 * @update 2010-02-14 // Example object item: { text: 'some text', imagePath:
 *         'some image path', url: 'some url (optional)', tip: 'some tip
 *         (optional)', target: 'target element (optional)' }
 */
Ext.ux.FisheyeMenuWorkspace = Ext.extend(Ext.util.Observable, {
    // ------------------------------------------------------------
    // config options
    // ------------------------------------------------------------
    /**
	 * @cfg {Array} items Array of fisheye menu config object items.
	 */
    items : [],

	/**
	 * @cfg {Mixed} renderTo The container element.
	 */
	renderTo : document.body,

    /**
	 * @cfg {Number} itemWidth The minimum width for each menu item.
	 */
    itemWidth : 50,

    /**
	 * @cfg {Number} vicinity The distance from element that make item
	 *      interaction.
	 */    
    vicinity : 35,

    /**
	 * @cfg {String} hAlign Horizontal alignment (left|center|right).
	 */
    hAlign : 'center',

    /**
	 * @cfg {String} vAlign Vertical alignment (top|bottom).
	 */
    vAlign : 'bottom',

	/**
	 * @cfg {Boolean} showTitle To show menu item title or not.
	 */
	showTitle : true,
	/**
	 * 
	 */
	curveHeight:200,
	zoom:false,
	threshHold:1,
	defaultPadding:25,
    // ------------------------------------------------------------
    // class constructor
    // ------------------------------------------------------------
    /**
	 * @constructor
	 * @param config
	 * @private
	 */
    constructor : function(config) {
        Ext.apply(this, config);
        Ext.ux.FisheyeMenuWorkspace.superclass.constructor.call(this);

        // add custom event
        this.addEvents(
            /**
			 * @event change Fires when fisheye menu container is clicked
			 * @param {Ext.ux.FisheyeMenu}
			 *            this
			 * @param {Object}
			 *            targetItem
			 * @param {Number}
			 *            index
			 */
            'change'
        );

        // initialize
        this.init();
    },

    // ------------------------------------------------------------
    // public/private methods
    // ------------------------------------------------------------
    /**
	 * @private
	 */
    init : function() {
		// properties
        this.el = Ext.get(this.renderTo);               

        // init markup
        this.initMarkup();

        // init events
        this.initEvents();
    },

    /**
	 * @private
	 */
    initMarkup : function() {
        // set necessary css class
        this.setClass();

        // for wrap class
        this.el.addClass(this.wrapCls);         
        // fisheye menu container
        this.containerEl = this.el.createChild({
            tag : 'div',
            cls : 'ux-fisheye-menu-container ' + this.vAlignCls
        });

        var sId = this.el.getAttribute('id') || Ext.id();


        // build fisheye menu items
        Ext.each(this.items, function(item, index) {
            var sTitle = this.showTitle === true ? (item.tip || item.text) : '';
            var arr = [{
                tag : 'span',
                cls : 'appwslabel',
                html : item.text
            }, {
                tag : 'img',
                src : item.imagePath,
                alt : sTitle
            }];
            if(this.vOrient == 'top') {
                arr = arr.reverse();
            }

            this.containerEl.createChild({
				tag : 'a',
				id : sId + '-' + index,
				cls : 'app-ux-fisheye-menu-item  item-show ' + this.vAlignCls,
				href : item.url || '#',
				title : sTitle,
				target : item.target || '_blank',
				children : arr
            });
        }, this);
                
        /*
		 * this.menuItems = this.containerEl.select('a.item-show');
		 * this.itemCount = this.menuItems.getCount(); if(this.itemCount>
		 * this.threshHold){
		 * this.padding=Math.round((this.catalogWidth-(this.itemWidth *
		 * this.itemCount ))/(this.itemCount-1)); }else{
		 * this.padding=this.defaultPadding }
		 * 
		 * this.itemDistance=Math.round((this.curveHeight-this.itemWidth)/(this.itemCount/2)) //
		 * render UI this.onRender();
		 */
		this.doLayout();
	    this.menuItems.each(function(item, all, index) {
            var top=-0;
			if(index<(this.itemCount/2)){
				top=index*this.itemDistance;
				}
			else{
				top=(this.itemCount-(index+1))*this.itemDistance;
				
			}
			top=this.curveHeight-( this.itemWidth+top+15);
			top=Math.round(top);
			item.setStyle({
                top:''+(top)+'px'
            });
        }, this);
	
		},
    
    /**
	 * @private
	 */
    initEvents : function() {
        // hover or not
       this.menuItems.on('mouseover', this.onItemHover, this);
       this.menuItems.on('mouseout', this.onItemOut, this);

		// for viewport mousemove event
		Ext.getBody().on('mousemove', this.onItemMove, this);

		// for viewport resize event
		Ext.EventManager.on(window, 'resize', this.onRender, this);

        // for custom event
        this.containerEl.on('click', function(ev, t) {
            if(t.href.slice(-1) == '#') {
                ev.preventDefault();
            }
            var index = parseInt(t.id.split('-').pop(), 10);
            this.fireEvent('change', t, index);
        }, this, {
            delegate : 'a'
        });
    },

	/**
	 * @private
	 */
	setClass : function() {
		this.vOrient = this.vAlign.toLowerCase();
		this.wrapCls = 'menu-wrap-' + this.vOrient;
		this.vAlignCls = 'menu-align-' + this.vOrient;
	},

    /**
	 * @private
	 */
    onItemMove : function(ev, t) {
        // pointer
		
		var p = ev.getXY(),
			posX,
			posY,
			increment = 0;

		switch(this.hAlign.toLowerCase()) {
			case 'left':
				posX = p[0] - this.pos[0];
				break;
			case 'right':
				posX = p[0] - this.pos[0] - this.el.getWidth() + this.itemWidth * this.itemCount;
				break;
			default:
				posX = p[0] - this.pos[0] - (this.el.getWidth() - this.itemWidth * this.itemCount)/2 - this.itemWidth/2;
				break;
		}

        posY = Math.pow(p[1] - this.pos[1] - this.el.getHeight()/2, 2);

	    this.menuItems.each(function(item, all, index) {
            // distance mathematical calculation reference from
			// http://interface.eyecon.ro
            var d = Math.sqrt(Math.pow(posX - index * this.itemWidth, 2) + posY);
            d -= this.itemWidth/2;
            d = d < 0 ? 0 : d;
            d = d > this.vicinity ? this.vicinity : d;
            d = this.vicinity - d;
            var extraWidth = this.itemWidth * d / this.vicinity;
			var top=-0;
			if(index<(this.itemCount/2)){
				top=index*this.itemDistance;
				}
			else{
				top=(this.itemCount-(index+1))*this.itemDistance;
				
			}

			top=this.curveHeight-(extraWidth+this.itemWidth+top);
			// top=top<0?0:top;
		top=Math.round(top);
		if(this.zoom===true){
            item.setStyle({
                left : (this.itemWidth * index + increment+(index*this.padding)) + 'px',
                top:(top)+'px',
				width : this.itemWidth + extraWidth + 'px'
            });
		}
            increment += extraWidth;
        }, this);

        this.setPosContainer(increment);
    },

    /**
	 * @private
	 */
    onItemHover : function(ev, t) {
        var target = Ext.get(t);
        
        var imgObj=target.is('img')?target:(target.is('span')?target.prev('img'):target.down('img'));
        
        imgObj.setStyle({
        	width:(this.itemWidth)+'px',
        	top : '5px'
        });
        
        target = target.is('img') ? target.up('a') : target;
        var itemText = target.child('span');
        if(itemText) {
            // itemText.show();
			itemText.setStyle({
				//color: '#039'
			});
        }
    },

    /**
	 * @private
	 */
    onItemOut : function(ev, t) {
        var target = Ext.get(t);
        var imgObj=target.is('img')?target:(target.is('span')?target.prev('img'):target.down('img'));
        imgObj.setStyle({
        	width:this.itemWidth+'px',
        	top : '0px'
        });

        target = target.is('img') ? target.up('a') : target;
        var itemText = target.child('span');
        if(itemText) {
            // itemText.hide();
			itemText.setStyle({
				//color: '#000'
			});

        }
    },

	/**
	 * @private
	 */
	onRender : function() {
		this.pos = this.el.getXY();
		this.setPosContainer(0);
		this.setPosMenuItems();
	},

	/**
	 * @private
	 */
	doAlignment : function() {
		var aWrapCls = ['menu-wrap-top', 'menu-wrap-bottom'],
			aAlignCls = ['menu-align-top', 'menu-align-bottom'];

		this.setClass();
		this.el.removeClass(aWrapCls).addClass(this.wrapCls);
		this.containerEl.removeClass(aAlignCls).addClass(this.vAlignCls);

		this.menuItems.each(function(item, all, index) {
			var itemText = item.child('span');
			var itemTextCfg = {
				tag : 'span',
				html : itemText.dom.innerHTML
			};
			item.removeClass(aAlignCls).addClass(this.vAlignCls);

			if(this.vAlign.toLowerCase() == 'top') {
				if(!item.last().is('span')) {
					item.createChild(itemTextCfg);
					itemText.remove();
				}
			} else {
				if(!item.first().is('span')) {
					item.insertFirst(itemTextCfg);
					itemText.remove();
				}
			}                       
		}, this);
	},
                
        
	/**
	 * Set alignment
	 * 
	 * @param {Object}
	 *            cfg Config options
	 */
	setAlign : function(cfg) {
		var isChange = false;
		// for horizontal alignment
		if(cfg.hAlign) {
			var sHAlign = cfg.hAlign.toLowerCase();
			if(sHAlign != this.hAlign.toLowerCase()) {
				this.hAlign = sHAlign;
				isChange = true;
			}
		}
		// for vertical alignment
		if(cfg.vAlign) {
			var sVAlign = cfg.vAlign.toLowerCase();                 
			if(sVAlign != this.vAlign.toLowerCase()) {
				this.vAlign = sVAlign;
				isChange = true;
			}
		}

		if(isChange) {
			this.doAlignment();
			this.onRender();
		}
	},

    /**
	 * @private
	 */
    setPosContainer : function(increment) {
		var iLeft;
		var padding=this.catalogWidth-(this.itemWidth * this.itemCount );
		if(this.zoom===true){
			if(increment===0){
				increment=padding;
			}else{
				increment+=padding;
			}
		}else{
			increment=padding;
		}
		switch(this.hAlign.toLowerCase()) {
			case 'left':
				iLeft = - increment/this.itemCount;
				break;
			case 'right':
				iLeft = (this.catalogWidth - this.itemWidth * this.itemCount) - increment/2;
				break;
			default:
				iLeft = (this.catalogWidth - this.itemWidth * this.itemCount)/2 - increment/2;
				break;
		}
		this.containerEl.setStyle({
			left : (iLeft+20) + 'px',
			width : this.itemWidth * this.itemCount + increment + 'px',
			height : this.curveHeight+'px'
		});
    },

    /**
	 * @private
	 */    
    setPosMenuItems : function() {
	    this.menuItems.each(function(item, all, index) {
			var top=-0;
			if(index<(this.itemCount/2)){
				top=index*this.itemDistance;
			}
			else{
				top=(this.itemCount-(index+1))*this.itemDistance;
				
			}

			top=Math.round(top);
			top=this.curveHeight-( this.itemWidth+top);
			var left=(this.itemWidth * (index)+(index*this.padding));
			// for bringing breathing space for the first menu item
			if(!Ext.isNumber(left)){
				left=0;
			}
			item.setStyle({
				left : left+ 'px',
				top : top+ 'px',
				width : this.itemWidth + 'px'
			});
        }, this);
    },
	doLayout: function(){
		//for resizing if the user resize the window
		if(this.ownerCt!=null){
			this.catalogWidth= this.ownerCt.getWidth()-100;
		}
		this.menuItems = this.containerEl.select('a.item-show');
		this.itemCount = this.menuItems.getCount();
		if(this.itemCount<=this.threshHold){
			this.itemDistance=0;
		}else{
			this.itemDistance=Math.round((this.curveHeight-this.itemWidth)/(this.itemCount/2));
		}
		if(this.itemCount> this.threshHold){
			this.padding=Math.round((this.catalogWidth-(this.itemWidth * this.itemCount ))/(this.itemCount-1));
		}else{
				this.padding=this.defaultPadding;
		}

		this.onRender();
		this.doAlignment();
		this.initEvents();
	},
	hide : function(itemId) {
		Ext.fly(itemId).hide();
		Ext.fly(itemId).removeClass('item-show');
		this.doLayout();
	},
	show : function(itemId) {
		Ext.fly(itemId).show();
		Ext.fly(itemId).addClass('item-show');
		this.doLayout();
	},
	add: function(item){
	       // CBXR12Q312F05 starts
		var sTitle="";
		if(item.label != undefined){
	        sTitle = this.showTitle === true ? (item.label) : '';
		}
		//CBXR12Q312F05 ends	       
            var arr = [{
                tag : 'span',
                cls : 'appwslabel',
                html : sTitle
            }, {
                tag : 'img',
                src : Ext.BLANK_IMAGE_URL,
                cls: 'appwsiconDefault '+item.iconCls,
                title : sTitle
										 
            }];
            if(this.vOrient == 'top') {
            	  arr = arr.reverse();
            }
            if(this.vOrient == 'bottom') {
          	  arr = arr.reverse();
          }

            var itemId=item.itemId+"_"+Ext.id();
            this.containerEl.createChild({
				tag : 'a',
				id : item.itemId,
				cls : item.hidden===true?'app-ux-fisheye-menu-item appwsiconholder ' + this.vAlignCls:'app-ux-fisheye-menu-item  item-show appwsiconholder ' + this.vAlignCls,
				title : sTitle,
				style: item.hidden===true?'display:none;':'',
				href:'javascript:void(0)',
				children : arr
            });
		this.doLayout();
		item.catalog=this;
		item.show=this.show;
		var itemObj=Ext.get(item.itemId);
		if(item.myTabIndex === 0){
			Ext.fly(item.itemId).addClass('activeWS');    
		}
		if(itemObj!=null){
			itemObj.on('click', this.handleClick, item);
			itemObj.catalog=this;
			// itemObj.id=itemId;
			itemObj.itemId=item.itemId;
			itemObj.show=function(){
				this.catalog.show(this.itemId);
			};
			itemObj.setLabel=function(label){
			   //CBXR12Q312F05 starts
				sTitle=label;
				this.select('span').elements[0].innerHTML=sTitle;
				this.set({title:sTitle});
				this.select('img').elements[0].setAttribute('title',sTitle);
				this.select('img').elements[0].setAttribute('alt',sTitle);
				
			    //CBXR12Q312F05 ends	
				// LOGGER.info("set label ",this.select('img').elements[0]);
				// this.select('img').elements[0].setAttribute("alt",
				// label+"_U");
			};
		}
		
	},
	/*activeItem: function(){
		var activeitems=this.catalog.containerEl.select('a.activeWS');
		
		//	console.log("itemid ",item.id);
		activeitems.removeClass('activeWS');
		
		
		Ext.fly(this.itemId).addClass('activeWS');
		this.handler.apply(this);
			
	},*/
	handleClick: function(){
		
			
			
		var activeitems=this.catalog.containerEl.select('a.activeWS');
		
		//	console.log("itemid ",item.id);
		activeitems.removeClass('activeWS');
		
		
		Ext.fly(this.itemId).addClass('activeWS');
		this.handler.apply(this);
			
		
		
		
	},
	removeAll: function(){
		var items=this.containerEl.select('a.app-ux-fisheye-menu-item');		
		items.each(function(item, all, index) {		
			var me=Ext.get( item.id);
			try{
				me.purgeAllListeners();
			}catch(e){}
			me.remove();
			delete me;

		}, this);
	},
	find:function(type, value){
		var items=this.containerEl.select('a.app-ux-fisheye-menu-item');
		return [Ext.get(value)];
	}
	
});  // end of Ext.ux.FisheyeMenu
