/*
 * The MIT License
 * 
 * Copyright (c) 2009-2010 Niko Ni (bluepspower@163.com)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// namespace
Ext.ns('canvas.ui');

/**
 * @class Ext.ux.TabletopMenu
 * @extends-ext Ext.util.Observable
 
 */
canvas.ui.Tabletop = Ext.extend(Ext.util.Observable, {
    // ------------------------------------------------------------
    // config options
    // ------------------------------------------------------------
    /**
	 * @cfg {Array} items Array of table top menu config object items.
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
    vicinity : 15,/* CHG013_70501-table top changes  */

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
	curveHeight:200,
	zoom:false,
	threshHold:1,
	defaultPadding:5,/* CHG013_70501-table top changes  */
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
        // add custom event
        this.addEvents(
            /**
			 * @event change Fires when table top menu container is clicked
			 * @param {Ext.ux.TabletopMenu}
			 *            this
			 * @param {Object}
			 *            targetItem
			 * @param {Number}
			 *            index
			 */
            'change'
        );
        this.listeners = config.listeners;
        canvas.ui.Tabletop.superclass.constructor.call(this);
       
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
      //  this.el.addClass(this.wrapCls);         
/* CBXQ2FW197 START */
        this.containerEl = this.el.createChild({
            tag : 'div',
            cls : 'ttc-left ' // + this.vAlignCls
        });
        this.containerEl = this.el.createChild({
            tag : 'div',
            id :'crt',
            cls : 'ttc-mid ' // + this.vAlignCls
        });
        this.containerEl = this.el.createChild({
            tag : 'div',
            cls : 'ux-fisheye-menu-container ' + this.vAlignCls
        });
   /* CBXQ2FW197 END */   
        var sId = this.el.getAttribute('id') || Ext.id();


        
        Ext.each(this.items, function(item, index) {
            var sTitle = this.showTitle === true ? (item.tip || item.text) : '';
            if (sTitle == "undefined" || sTitle == null){
		  		sTitle =""
	        }
            var arr = [{
                tag : 'span',
                cls : 'tabletopwslabel', //UIWSLAYOUT
                html : item.text
            }, {
                tag : 'span',
                html : '&nbsp;',
                cls : 'tabletopwsiconDefault tabletop-'+item.itemId //UIWSLAYOUT
                
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
        /* CBXQ2FW197 START */
        this.el.createChild({
            tag : 'div',
            cls : 'ttc-right ' 
        });      
        /* CBXQ2FW197 END */
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
        //Adding listeners for the events raised by the dock model
        CCDM.getInstance().on('appdocked',this.widgetDocked,this);
        CCDM.getInstance().on('appundocked',this.widgetUnDocked,this);
        CCDM.getInstance().on('removeall',this.clearDock,this);
    },
    /**
    * Listener of the removeall event to empty the dock
    */
    clearDock : function(){
    	this.removeAll(true);
    },
    /**
    * Listener of the widgetdocked event. This will add an app icon to the the dock
    */
    widgetDocked : function(dockItem){
    	var iconArr = this.find("itemId", dockItem.itemId);
    	if(iconArr!=null && iconArr[0] != null ){
    		iconArr[0].show();
		}
    	else {
    		isHomeIcon = (dockItem && dockItem.isHomeIcon === 'Y' ) ? true : false;
    		if(!isHomeIcon){
    			appIconObj = {
    						xtype : 'iportal-catalog-icon',
    						iconCls : dockItem.id,
    						itemId : dockItem.id,
    						hidden : false,
    						label : dockItem.label,
    						scale : 'large',
    						handler : function() {
    							var widgetContainer = iportal.workspace.metadata.getCurrentWorkspace().getWidgetContainer();
    							IMM.markWidgetOpened(dockItem.id);
    							iportal.workspace.metadata.updateWidgetDef(iportal.workspace.metadata.getCurrentLayoutId(), dockItem.id, {
    								CLOSED_IND : 'N'
    							});
    							CCDM.removeIconFromAppDock(dockItem.id);
    							widgetContainer.addWidget(dockItem.id);
    						}
    					}
    		}
    		else {
    			appIconObj = {
     						xtype : 'iportal-catalog-icon',
    						iconCls : 'master',
    						itemId : "MASTER_ICON",
    						hidden : false,
    						scale : 'large',
    						label : 'HOME',
    						handler : function() {
    							iportal.workspace.metadata.getWorkspaceManager().activate("MASTER_PANEL");
    						}
     			}
    		}
    		this.add(appIconObj);
    	}
    },
    /**
    * Listener of the widgetundocked event. This will remove an app icon from the the dock
    */
    widgetUnDocked : function(itemId){
    	this.hide(itemId);
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
        if(imgObj!= null){
        imgObj.setStyle({
        	width:(this.itemWidth+50)+'px',
        	top : '5px'
        });
        }
        target = target.is('img') ? target.up('a') : target;
        var itemText = target.child('span');
        if(itemText) {
            itemText.setStyle({
				color: '#f8f8f8'
			});
        }
    },

    /**
	 * @private
	 */
    onItemOut : function(ev, t) {
        var target = Ext.get(t);
        var imgObj=target.is('img')?target:(target.is('span')?target.prev('img'):target.down('img'));
        if(imgObj!= null){
        imgObj.setStyle({
        	width:(this.itemWidth)+'px',
        	top : '0px'
        });
        }
        target = target.is('img') ? target.up('a') : target;
        var itemText = target.child('span');
        if(itemText) {
            itemText.setStyle({
				color: '#fff'
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
				iLeft = (this.el.getWidth() - this.itemWidth * this.itemCount) - increment/2;
				break;
			default:
				iLeft = (this.el.getWidth() - this.itemWidth * this.itemCount)/2 - increment/2;
				break;
		}
		this.containerEl.setStyle({
			left : iLeft + 'px',
			width : this.itemWidth * this.itemCount + increment + 'px',
			height : 80+'px'
		}); /* CBXQ2FW197 START */
		this.containerEl.parent().select('div.ttc-mid').setStyle({
			//left : iLeft + 'px',
			width :( this.itemWidth * this.itemCount + increment )-60 + 'px'//,
			//height : 80+'px'
		});
    }, 
   // this.containerEl.select('a.item-show')
/* CBXQ2FW197 END */
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
			//CHG013_70501-commented this line for getting the table top layout in the footer.
			top=this.curveHeight;/*-( this.itemWidth+top)*/ 
			var left=(this.itemWidth * (index)+(index*this.padding));
			// for bringing breathing space for the first menu item
			if(!Ext.isNumber(left)){
				left=0;
			}
			// CBX_FW_CHG_RTL CBX_INT_CHG007 start
			var isRTL = iportal.preferences.isLangDirectionRTL();
			if(!isRTL){
				item.setStyle({
					left : left+20+ 'px', /* CHG013_70501-css table top changes  */
					top : top-36+ 'px', // CBXQ2FW197  /* CBXFW_TTLCHG001 */
					width : this.itemWidth + 'px'
				});				
			}else{
				item.setStyle({
					right : left+50+ 'px', /* CHG013_70501-css table top changes  */  // CBXQ2FW197
					top : top-36+ 'px',  // CBXQ2FW197  /* CBXFW_TTLCHG001 */
					width : this.itemWidth + 'px'
				});				
			}		// CBX_FW_CHG_RTL CBX_INT_CHG007 end
        }, this);
    },
	doLayout: function(){
		//for resizing if the user resize the window
		if(this.ownerCt!=null){
			this.catalogWidth= this.ownerCt.getWidth()-40;// CHG013_70501-css table top changes
		}
		this.menuItems = this.containerEl.select('a.item-show');
		this.itemCount = this.menuItems.getCount();
		if(this.itemCount<=this.threshHold){
			this.itemDistance=0;
		}else{
			this.itemDistance=Math.round((this.curveHeight-this.itemWidth)/(this.itemCount/2));
		}
		if(this.itemCount> this.threshHold){
			this.padding=Math.round(((this.catalogWidth-40)-(this.itemWidth * this.itemCount ))/(this.itemCount-1)); /* CHG013_70501-css table top changes */
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
	        var sTitle = this.showTitle === true ? (item.tip || item.label) : '';
	        if (sTitle == "undefined" || sTitle == null){
		  		sTitle =""
	        }
	        var shortTitle= iportal.jsutil.getText(sTitle, this.itemWidth-5);
            var arr = [{
                tag : 'span',
                cls : 'tabletopwslabel',
                html : shortTitle
            }, {
            	tag : 'span',
                html : '&nbsp;',
                cls : 'tabletopwsiconDefault TTL-'+item.itemId 
             						 
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
				cls : item.hidden===true?'app-ux-fisheye-menu-item catalog_icon_holder ' + this.vAlignCls:'app-ux-fisheye-menu-item  item-show catalog_icon_holder ' + this.vAlignCls,
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
			itemObj.itemId=item.itemId;
			itemObj.show=function(){
				this.catalog.show(this.itemId);
			};
			itemObj.setLabel=function(label){
				var shortLabel=iportal.jsutil.getText(label, this.catalog.itemWidth-5);
				this.select('span').elements[0].innerHTML=shortLabel;
				this.set({title:label});
				
			};
		}
	},
	
	handleClick: function(){
	var activeitems=this.catalog.containerEl.select('a.activeWS');
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
		this.doLayout();
	},
	find:function(type, value){
		var items=this.containerEl.select('a.app-ux-fisheye-menu-item');
		return [Ext.get(value)];
	}
	
}); 
