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
/*
@class	iportal.layout.widgetcontainer

This class overrides the Panel component and provides a pre-formatted 2 Column invisible container.
The container will align all the components added to it by itself and also make them draggable. 
*/
Ext.ns("iportal.layout");

iportal.layout.widgetcontainer = Ext.extend(Ext.Container, {
	/**
	 * The field 'border' accepts boolean value (true / false). If border value
	 * is true, it renders the widget container with border otherwise border will
	 * not be rendered.
	 */
    border:false,
	    /**
		 * The field 'autoWidth' accepts boolean value (true / false). If
		 * autoWidth value is true, it will automatically adjusts the width of
		 * the widget container based on the width of the items inside the
		 * container.
		 */
	autoWidth:true,
	/**
	 * The field 'autoScroll' accepts boolean value (true / false). If
	 * autoScroll value is true, it will automatically add a scroll bar to the
	 * widget container based on the height/width of the items inside the
	 * container.
	 */
	autoScroll:false,
	/**
	 * Initially setting the container height to 0.
	 */
	containerHeight:0,
	/**
	 * Initially setting the totalColumns to 2.
	 * The items of the container will now appear in a 2 column layout.
	 */
	totalColumns:2,
	
	defaultWidget : null,
	//overriding and setting up default skeleton
	initComponent:function() {
		this.addEvents({
			statechange:true});
		var that=this;
		// registering event raised by multiview
		cbx.CommManager.registerHandler('widgetnotentitled', 'iportal.layout.widgetcontainer', this, this.handleNonEntitledWidget);
		var portalWrapper={
								xtype:'portal',
								width:this.width,
								border:this.border,
								framework:true,
								autoScroll:false,
								layout:iportal.preferences.getLayoutResize()?'rcolumn':'column',
								items:[this.getWrappers()],
								listeners:{'afterdrop':function(obj){
									      that.updateWSMetadata();
										  },'drop':function(obj){
										this.doLayout();
										/**
										 * After the drop, needs to raise the validateDrop event of the widget container
										 * in order to update an size specific attributes, the event is raised after a delay
										 * to ensure that the portal completes its drop processing.
										 * Also, this is a fix for auto resizing of the tabpanel header strip.
										 * */
										if(obj.panel!=null){
											obj=obj.panel.getComponent(0).getComponent(0);
											var task = new Ext.util.DelayedTask(function(){
												try{												   
													obj.fireEvent("validdrop"); 
													 
													if(obj.mvConf && obj.mvConf.mvh && obj.mvConf.mvh.refresh){
													obj.mvConf.mvh.refresh();
													}
													
												}catch(e){}
											});
											task.delay(50);				
										}
										if(that!=null){
											that.resetHeight();
											that.doLayout();
											//that.fireEvent('statechange');
										}
									}
								}
							};
		/**
		* The following code has been added to position the header & footer based on the configurations
		*/
		var footer;
		var applicationLayoutConfig = canvas.metadata.applicationLayout;
		if (applicationLayoutConfig.getFooterPosition() == 'relative' && applicationLayoutConfig.getHeaderPosition() == 'relative'){
			var defaultConfig = {
				autoScroll:false,
				items:[applicationLayoutConfig.getHeaderComponent(),portalWrapper,applicationLayoutConfig.getFooterComponent()]
			};
		}
		else if (applicationLayoutConfig.getFooterPosition() == 'relative' && applicationLayoutConfig.getHeaderPosition() == 'absolute'){
			var defaultConfig = {
				autoScroll:false,
				items:[portalWrapper,applicationLayoutConfig.getFooterComponent()]
			};
		}
		else if (applicationLayoutConfig.getFooterPosition() == 'absolute' && applicationLayoutConfig.getHeaderPosition() == 'relative'){
			var defaultConfig = {
				autoScroll:false,
				items:[applicationLayoutConfig.getHeaderComponent(),portalWrapper]
			};
		}
		else {
			var defaultConfig = {
						autoScroll:false,
						items:[portalWrapper]
				};
		}
        Ext.apply(this, defaultConfig);
		this.doLayout();
		iportal.layout.widgetcontainer.superclass.initComponent.apply(this);
		this.createItems();

    } ,
    
    /*Handler to search for the protlet panel of the widgent that is not entitled and call its close method to doc it*/
    handleNonEntitledWidget: function(data){
    	var widgetId=data.WIDGET_ID;
    	if(widgetId!=null && this.find){
    		var pArr= this.find('itemId', widgetId+'_PORTLET');
    		if(pArr!=null && pArr.length>0){
    			var portlet=pArr[0];
    			if(portlet!=null && portlet.handleClose){
    				portlet.handleClose('close', null, portlet, null);
    			}
    		}
    	}
    }
    
//method to retrieve a list of all the column containers
	,getWrappers:function(){
		if(this.totalColumns){
			var columnWrappers=[];
			for(var i=0; i< this.totalColumns; i++){
				columnWrappers[i]={itemId:('PORTAL_WRAPPER'+i), border:false, columnWidth:.50, padding:1, items:[]};
				if(this.proportion){
					var prop= this.proportion[i];
	        		if(prop!=null){
	        			if(prop>1){
	        				columnWrappers[i].columnWidth= prop/100;
	        			}
	        			else{
	        				columnWrappers[i].columnWidth = prop;
	        			}
	        		}
				}
			}
	        return columnWrappers;
		}else{
			return[];
		}
	},
	hasWidgetsLoaded: function(){
	}
	//method call to add item in the left column of the container
	,addLeft: function(item){
		this.items.itemAt(0).items.itemAt(0).add({border:true,itemId:item.itemId+"_PORTLET",items:[item]});
		if(this.appMVRegistry!=null){
			this.appMVRegistry.registerWidget(item.itemId, item);
		}
		this.resetHeight();
	}
	
	//Method call to add item in the right column of the container
	,addRight: function(item){
		this.items.itemAt(0).items.itemAt(1).add({border:true,itemId:item.itemId+"_PORTLET",items:[item]});
		if(this.appMVRegistry!=null){
			this.appMVRegistry.registerWidget(item.itemId, item);
		}
		this.resetHeight();
	}
	// Method to add components in the to container in its default left -> right 
	// and top -> bottom approach
	,addItem: function(item, itemAttrs){
		item.isParentPortlet=true;
		if(itemAttrs!=null && itemAttrs.BLOCK_POSITION!=null){
			if(itemAttrs.BLOCK_POSITION=="LEFT"){
				this.addLeft(item);
				return;
			}else if(itemAttrs.BLOCK_POSITION=="RIGHT"){
				this.addRight(item);
				return;
			}
		}
		var lCount=this.getComponent(0).getComponent(0).items.length;
		var rCount=this.getComponent(0).getComponent(1).items.length;
		if (lCount<rCount || lCount==rCount){
			this.addLeft(item);
		}
		else{
			this.addRight(item);
		}
	},
	//Method which sets the height of the container based on the column whose height is the greatest.
	resetHeight:function(){
		var lContainer=this.getComponent(0).getComponent(0);
		var rContainer=this.getComponent(0).getComponent(1);
		var lHeight=this.getTotalCalculatedHeight(lContainer);
		var rHeight=this.getTotalCalculatedHeight(rContainer);
		var calculatedHeight=lHeight>rHeight?lHeight:rHeight;
					if(calculatedHeight>this.containerHeight){
				this.setHeight(calculatedHeight);
			
			}else {
				this.setHeight(this.containerHeight);
			}
			//getting rid of scrollbars getting clipped because of width calculation
			if((Ext.isIE6 || Ext.isIE7) && !Ext.isIE8){
				if((lContainer.columnWidth + rContainer.columnWidth)>=1){
					lContainer.columnWidth= (lContainer.columnWidth*100 -(0.5))/100;
					rContainer.columnWidth=(rContainer.columnWidth*100 -(0.5))/100;
				}
			}
		
		this.doLayout(); 
	}
	//method used to retrieve the height of a container
	,getTotalCalculatedHeight:function(container){
		var totalHeight=0;
		for(var i=0; i<container.items.length; i++){
			if(container.getComponent(i).collapsed){
				totalHeight+=5;
			}else{
				totalHeight+=parseInt(container.getComponent(i).getComponent(0).height);
			}
		}
		totalHeight+=32*container.items.length;
		return totalHeight;
	}

	/*Intended to start loading it child widgets in case the container has passed childWidgets array*/
	,createItems:function(){
		if(!Ext.isEmpty(this.childWidgets)){
			for(var index=0; index< this.childWidgets.length; index++){
				var widget;
				var config=this.childWidgets[index];
				try{
					
					
					var configHeight=iportal.jsutil.getConfigHeight(config);
					if(configHeight != null)
						config.height=configHeight;
					else if(this.childWidgets.length==1){
						config.height=this.containerHeight-40; 
					}
					
					
							
			
					config.addIconToCatlog=true;
					if(this.childWidgets[index].CLOSED_IND==='Y'){
						config.isClosed=true;
					}else{
						config.isClosed=false;
					}
					widget= iportal.jsutil.initiateWidget(config);
					if(widget!=null){
						/**
						 * adding layoutId to the widget, will be later helpful 
						 * in updating the meta data after user interaction
						 * @see Portlet.js 
						 */
						widget.mv.LAYOUT_ID=this.itemId; 
						widget.mv.isDefaultWidget = config.DEFAULT_WIDGET_IND;
						this.addItem(widget.mv, this.childWidgets[index]);
						this.defaultWidget = config.DEFAULT_WIDGET_IND==='Y'?config.WIDGET_ID:this.defaultWidget;
					}
				}catch(e){
					LOGGER.error("Problem loading "+this.childWidgets[index].WIDGET_ID+"\n"+e);
				}
			}
		}else{
			this.addItem({html:"No wdget available at this time."});
		}
	},
	//method to add a widget to a widget container
	addWidget:function(widgetId){
		var widget, config={};
		
		var no_of_rows=0;
		var wgt_hgt_pixels=0;
		
		try{
			/*Snippet to get the no_of_rows and wgt_hgt_pxls of the current widget */
			
			for ( var index = 0; index < this.childWidgets.length; index++)
			{
				var wgt_id=this.childWidgets[index].WIDGET_ID;
				if(wgt_id == widgetId)
					{
					no_of_rows=this.childWidgets[index].NO_OF_ROWS;
					wgt_hgt_pixels=this.childWidgets[index].WIDGET_PXL_HT;
					container_flag = this.childWidgets[index].CONTAINER_FLAG;
					break;
					}
				
				
			
			}
		
			
			config.addIconToCatlog=true;
			config.WIDGET_ID=widgetId;
			config.NO_OF_ROWS=no_of_rows;
			config.WIDGET_PXL_HT=wgt_hgt_pixels;
			config.CONTAINER_FLAG=container_flag;
			/*Snippet to set the height based on no_of_rows or wgt_hgt_pxls for a widget when opened from the widget catalog*/
		
		
			var configHeight=iportal.jsutil.getConfigHeight(config);
			if(configHeight != null)
				config.height=configHeight;
			else if(this.childWidgets==null || this.childWidgets.length==1){
				config.height= cbx.isEmpty(this.height) ? this.childWidgets[0].height :this.height;
			}
		
			
			widget= iportal.jsutil.initiateWidget(config);
			/**
			 * adding layoutId to the widget, will be later helpful 
			 * in updating the meta data after user interaction
			 * @see Portlet.js 
			 */
			widget.mv.LAYOUT_ID=this.itemId;
			this.addItem(widget.mv);
			this.updateWSMetadata();
			this.resetHeight();
		}catch(e){
			LOGGER.error("Problem loading "+this.widgetId+"\n"+e);
		}
	},
	//method to remove a widget from a widget container
	removeNow: function(parent, child){
		setTimeout(function(){
		    		try{
		    			parent.remove(child, true);
		    		}catch(e){};
		    	}, 50);
	},
	
	/* Removing only the widgets loaded inside the container*/
	removeChildren:function(){
			if(this.appMVRegistry){
				delete this.appMVRegistry;
				this.appMVRegistry= new canvas.core.communication.appMVRegistry();
			}
			if(this.totalColumns){
				for(var ind=0; ind< this.totalColumns; ind++){
					var ddContainer=this.getComponent(0).getComponent(ind);
					var len=ddContainer.items.length;
					for(var i=0; i<len; i++){
						var obj= ddContainer.items.itemAt(i);
						this.removeNow(obj, obj.getComponent(0));
					}
					for(var i=0; i<len; i++){
						var obj= ddContainer.items.itemAt(i);
						this.removeNow(ddContainer, obj);
					}
					//updating the flag after the widgets are destroyed
					setTimeout(function(){
			    		try{
			    			iportal.workspace.metadata.setWorkspaceChangeAcceptable(true);
			    		}catch(e){};
			    	}, 100*this.childWidgets.length);	
					
				}
			}
		}	
// method to retrieve layout information
,getLayoutData:function(){
	var ld= new iportal.layout.data();
	ld.layoutType=this.layoutType;
	ld.leftColumnWidth=this.leftColumnWidth;
	ld.centerColumnWidth=this.centerColumnWidth;
	ld.rightColumnWidth=this.rightColumnWidth;
	ld.leftColumns=this.getLeftColumns();
	ld.rightColumns=this.getRightColumns();

	return ld;
}

,afterRender : function(){
	if(this.ownerCt!=null){
		this.ownerCt.doLayout();
	}
	iportal.layout.widgetcontainer.superclass.afterRender.apply(this, arguments);
},

updateWSMetadata:function(){

	var that=this;
	setTimeout(function(){
		try{
			var layoutId=that.itemId;
			var dataObj=[];
			var widPositions=that.getWidgetPositions();
			var arr={};
			arr['Widgets']=widPositions;
			arr['Layout_ID']=layoutId;
			dataObj.push(arr);
			iportal.workspace.metadata.setUpdatedWS(dataObj);
		}catch(e){};
	}, 1000);	
	
}

}); // eo extend


