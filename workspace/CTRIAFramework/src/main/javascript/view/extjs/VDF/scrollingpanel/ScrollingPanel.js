/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 * 
 */
/**
 *	@class			: Ext.ux.DDScrollingPanel
 *	@extends		: Ext.Panel
 *

 **/

Ext.ns('cbx.panel');
cbx.panel.DDScrollingPanel = Ext.extend(Ext.Panel, {
	/*
	*	@config	
	* 	dragOutOfBound	Allows users to drag the content of Panel when mouse is outside the bound of panel. Default to true.
	*/
	dragOutOfBound: true,
	
	// Extension specific CSS config
	/*
	*	@config		bodyCssClass	CSS class of the opened_hand.cur cursor. 
									To be appended by other custom classes if users use this property for other purposes.
	*/
	bodyCssClass: 'x-panel-wrap-dd-area',
	
	/*
	*	@config		handCursorCssClass	CSS class of the closed_hand.cur cursor.
	*/
	handCursorCssClass: 'x-panel-wrap-dd-area-scrolling',
		
	// Set the cursor
	// Could be put in a subclass of Ext.Panel
	setDragCursor: function(dragging) {
		var c = this.body,
			cls = this.handCursorCssClass;
		
		if (dragging) {
			if (!c.hasClass(cls)) {
				c.addClass(cls);
			}
		} else {
			c.removeClass(cls);
		}
	},
	
	initEvents: function() {		
		var p = this;
		panel.onRender = panel.onRender.createSequence(function() {
            if (panel.body) {     
                this.renderScrollButton('left');
                this.renderScrollButton('right');                
            }
        }, this);
		
		p.ddScrollZone = new Ext.dd.DragZone(p.body, 		// Body element of the panel is our DragZone
		{
			dragOutOfBound: Ext.isDefined(p.dragOutOfBound) ? p.dragOutOfBound : true,
			
			// On receipt of a mousedown event, see if it is within a DataView node.
			// Return a drag data object if so.
			getDragData: function(e) {
				this.ddscrolling = true;		// User is DD scrolling								
				
				if (!this.ddel) {
					this.ddel = document.createElement('div');
					this.ddel.innerHTML = "Testing";
				}
				
				return this.dragData = {					
					ddel: this.ddel
				};
			},
			
			// On every drag event, we scroll the body of Ext.Panel			
			onDrag: function(e) {
				
				if (this.ddscrolling) {
					// Hide the proxy as we don't need it
					this.hideProxy();										
					
					// Calculate the scrolling position
					var	pb = p.body, 						
						b = pb ? pb.dom : false;
					if (b) {
					
						// Initialize Drag and Drop coordinates
						if (!Ext.isDefined(this.lastDDX)) {
							this.lastDDX = 0;
							this.lastDDY = 0;
						}
						
						// Get position of the mouse
						var r = pb.getRegion(),
							xy = e.getXY(),
							x = xy[0], 
							y = xy[1];
						
						// Check to prevent drag and drop when mouse is out of the bound of the panel
						if (this.dragOutOfBound || ((x < r.right) && (x > r.left) && (y < r.bottom) && (y > r.top))) {
							
							var
							sx = x - this.lastDDX,
							sy = y - this.lastDDY,
							
							sl = parseInt(b.scrollLeft, 10) - parseInt(sx, 10),
							st = parseInt(b.scrollTop, 10) - parseInt(sy, 10);
							
							// Check to prevent flickering
							if (sl >= 0 && st >= 0) {
								b.scrollLeft = sl;
								b.scrollTop = st;
							}
							
							// Save the last Drag and Drop coordinates
							this.lastDDX = x;
							this.lastDDY = y;
						}												
					}
				}
				
			},
			
			onStartDrag : function( target, e, id ){
				// Change the cursor to 'closed_hand'
				p.setDragCursor(true);
			},
			
			onEndDrag : function(data, e){
				// Change the cursor back to 'open_hand'
				p.setDragCursor(false);
				
				// Reset the last Drag and Drop coordinates
				this.lastDDX = 0;
				this.lastDDY = 0;
			},
			 renderScrollButton: function(dir) {
			        var text;
			        switch (dir) {
			            case 'left':
			                text = '&lt;';
			                break;
			            case 'right':
			                text = '&gt;';
			                break;
			            default:
			                return;
			        }
			        new Ext.Toolbar.Button({
			            text: '<div style="height:16px;color:#15428b"><b>' + text +text+'</b></div>',
			            renderTo: dir + this.ddScrollZone,
			            id: dir + "button",
						height:20,
			            //disabled: dir == 'left',
			            scope: this,
			            handler: function() {
			                
			            }
			        });
			    }
			
		});
		
		cbx.panel.DDScrollingPanel.superclass.initEvents.call(this);
	},

	beforeDestroy : function(){
		cbx.panel.DDScrollingPanel.superclass.beforeDestroy.call(this);
		
		if(this.rendered){
            Ext.destroy(this.ddScrollZone);
		}
	}
});

Ext.reg('ddscrollpanel', cbx.panel.DDScrollingPanel);




Ext.ns('cbx.panel');
cbx.panel.ButtonScrollingPanel = Ext.extend(Ext.Panel, {
	  
	amountOfxScroll:10,
	RTLSupported : iportal.preferences.isLangDirectionRTL ? iportal.preferences.isLangDirectionRTL() : false,
	initComponent : function(){
		
		this.currentMoved = 0;
		var p = this.scrollCmp[0];
		
		var defaultConfig = {
				xtype:'panel',
				layout:'column',
				frame:true,
				listeners:{render:{scope:this, fn:function(cmp){
					cmp.el.on('mouseover',this.onMouseOverPanel,this);
					cmp.el.on('mouseout',this.onMouseOutPanel,this);
				}},
				afterLayout:{scope:this,fn:this.onAfterLayoutPanel}
				},
				items: [{
				        	xtype:'button',
				        	cls:'noborder-icon-text',    
				        	iconCls :'scroll-left-icon', 
				        	//text :'&lt;&lt;',  		 
							
		  					height:(this.header && this.header==true)?this.height-34:this.height,// Scrolling panel Fav app 
							
		  					minWidth : 30,
		  					hideMode :'visibility',
		  					hidden :true,
		  					listeners:{click:{scope:this, fn:this.onMouseClickButton}}
		  				},
		  				{
				        	xtype:'panel',
		  					items:this.scrollCmp,
		  					height:this.height-10,
		  					columnWidth: 1
		  				},
				    	{
		  					xtype:'button',
		  					cls:'noborder-icon-text',      
		  					iconCls :'scroll-right-icon',  
		  					//text :'&gt;&gt;',         
							
			  				height:(this.header && this.header==true)?this.height-34:this.height,// Scrolling panel Fav app 
							
			  				minWidth : 30,
			  				hideMode :'visibility',
			  				hidden :true,
		  					listeners:{click:{scope:this, fn:this.onMouseClickButton}}
			  			}]
		};
		
		Ext.apply(this, defaultConfig);	
		
		cbx.panel.ButtonScrollingPanel.superclass.initComponent.call(this);
	} 	
	,onAfterLayoutPanel: function() {
		var p = this.items.items[1].items.items[0];
		var	pb = p.body, 						
		b = pb ? pb.dom : false;
		if (b) {
			var pnlele = Ext.get(b.id);
			var pos= pnlele.getLeft(true);
			if(pos == 0){return;}
			pnlele.setX(pnlele.getX()-this.currentMoved,true);
			this.currentMoved = 0;
		}
	},
	onMouseOverPanel: function(btn,evnt) {
		var inner = Ext.get(this.items.items[1].items.items[0].id).getWidth()+70;
		var outer = Ext.get(this.ownerCt.id).getWidth() ;
		var but = this.items.items[0];
		var but1 = this.items.items[2];
		
		if(outer>inner){but.hide();but1.hide();return;}

		but.show();
		but1.show();
		
	},
	onMouseOutPanel: function(btn,evnt) {
		
		
		var but = this.items.items[0];
		but.hide();
		but = this.items.items[2];
		but.hide();
		
	},
	
	onMouseClickButton: function(btn,evnt) {
			var p = this.items.items[1].items.items[0];
			var outerWidth = this.items.items[1].getWidth();
			
			//var btntext = evnt.target.textContent||evnt.target.innerText||'';   
			var btnclass = evnt.target.className.toString();
			
			var but;
			
			var	pb = p.body, 						
				b = pb ? pb.dom : false;
			if (b) {
				var pnlele = Ext.get(b.id);
				var width = pnlele.getWidth();
				
				if(btnclass.indexOf('scroll-left-icon')>-1) 
				{	
					if(this.currentMoved>=0){
						btn.show();
						return;
	  				}
					else{
						btn.hide();
					}
					btn.disable();
					but = this.items.items[2];
					but.show();
					this.currentMoved = this.currentMoved+this.amountOfxScroll;
					var opt = {
							    easing: 'elasticIn',
							    callback: function(){btn.enable();}
					};
				if (this.RTLSupported) {
					pnlele.setX(pnlele.getX() - this.amountOfxScroll, opt);
				} else {
					pnlele.setX(pnlele.getX() + this.amountOfxScroll, opt);
				}
			} else if (btnclass.indexOf('scroll-right-icon')>-1) {  

					if(-this.amountOfxScroll>=width-outerWidth+this.currentMoved-this.amountOfxScroll){

	  					return; 
	  				}
					btn.disable();
					but = this.items.items[0];
					but.show();
					this.currentMoved = this.currentMoved-this.amountOfxScroll;
					
					var opt = {
							    easing: 'elasticIn',
							    callback: function(){btn.enable();}
					};
				if (this.RTLSupported) {
					pnlele.setX(pnlele.getX() + this.amountOfxScroll, opt);
				} else {
					pnlele.setX(pnlele.getX()-this.amountOfxScroll,opt);
				}
			}

		}
	}
});

Ext.reg('buttonscrollpanel', cbx.panel.ButtonScrollingPanel);