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
@class	iportal.layout.twocolumn


This class overrides the Panel component and provides a pre-formatted 2 Column invisible container.
The container will align all the components added to it by itself and also make them draggable. 
*/

Ext.ns("iportal.layout");
iportal.layout.twocolumn = Ext.extend(iportal.layout.widgetcontainer, {
 
    border:false,
	autoWidth:true,
	autoScroll:false,
	containerHeight:0,
	totalColumns:2/*,
	//overriding and setting up default skeleton
	initComponent:function() {
		this.addEvents({
			statechange:true});
		var that=this;
		var portalWrapper={
								xtype:'portal',
								width:this.width,
								border:this.border,
								framework:true,
								autoScroll:false,
								layout:'column',
								items:[this.getWrappers()],
								listeners:{'afterdrop':function(obj){
									var layoutId=that.itemId;
									var dataJSON=new Array();
									var widPositions=that.getWidgetPositions();
									var arr={};
									arr['Widgets']=widPositions;
									arr['Layout_ID']=layoutId;
									dataJSON.push(arr);
									
									new iportal.workspace.metadata.setUpdatedWS(dataJSON);
									 
								},'drop':function(obj){
										this.doLayout();
										*//**
										 * After the drop, needs to raise the validateDrop event of the widget container
										 * in order to update an size specific attributes, the event is raised after a delay
										 * to ensure that the portal completes its drop processing.
										 * Also, this is a fix for auto resizing of the tabpanel header strip.
										 * *//*
										if(obj.panel!=null){
											obj=obj.panel.getComponent(0).getComponent(0);
											var task = new Ext.util.DelayedTask(function(){
												try{
													obj.fireEvent("validdrop");
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


		var defaultConfig = {
				autoScroll:false,
				items:[portalWrapper]
		};
		
        Ext.apply(this, defaultConfig);
		this.doLayout();
		iportal.layout.twocolumn.superclass.initComponent.apply(this);
		this.createItems();

    } */
/*	,getWrappers:function(){
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
		
	}*/
	//method call to add item in the left column of the container
	,addLeft: function(item){
		this.items.itemAt(0).items.itemAt(0).add({widgetContainer:this,border:true,itemId:item.itemId+"_PORTLET",items:[item]});
		if(this.appMVRegistry!=null){
			this.appMVRegistry.registerWidget(item.itemId, item);
		}
		this.resetHeight();
	}
	
	//Method call to add item in the right column of the container
	,addRight: function(item){
		this.items.itemAt(0).items.itemAt(1).add({widgetContainer:this,border:true,itemId:item.itemId+"_PORTLET",items:[item]});
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
	},resetHeight:function(){
		var lContainer=this.getComponent(0).getComponent(0);
		var rContainer=this.getComponent(0).getComponent(1);
		var lHeight=this.getTotalCalculatedHeight(lContainer);
		var rHeight=this.getTotalCalculatedHeight(rContainer);
		var calculatedHeight=lHeight>rHeight?lHeight:rHeight;
		//alert(this.height+" != "+ calculatedHeight+", this.containerHeight="+this.containerHeight);
			if(calculatedHeight>this.containerHeight){
				this.setHeight(calculatedHeight);
			//	alert(this.height);
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
	},

	/*Intended to start loading it child widgets in case the container has passed childWidgets array*/
/*	,createItems:function(){
		if(!Ext.isEmpty(this.childWidgets)){
			for(var index=0; index< this.childWidgets.length; index++){
				var widget;
				var config={};
				try{
					if(this.childWidgets.length==1){
						config.height=this.height;
					}
					config.addIconToCatlog=true;
					widget= iportal.jsutil.initiateWidget(this.childWidgets[index].WIDGET_ID, config);
					this.addItem(widget.mv, this.childWidgets[index]);
				}catch(e){
					alert("Problem loading "+this.childWidgets[index].WIDGET_ID+"\n"+e)
				}
			}
		}else{
			this.addItem({html:"No wdget available at this time."});
		}
	},
	addWidget:function(widgetId){
		var widget, config={};
		try{
			if(this.childWidgets==null || this.childWidgets.length==1){
				config.height=this.height;
			}
			config.addIconToCatlog=true;
			widget= iportal.jsutil.initiateWidget(widgetId, config);
			this.addItem(widget.mv);
		}catch(e){
			alert("Problem loading "+this.widgetId+"\n"+e);
		}
	},	
	removeNow: function(parent, child){
		setTimeout(function(){
		    		try{
					parent.remove(child, true);
		    		}catch(e){};
		    	}, 50);
	},
	
	 Removing only the widgets loaded inside the container
	removeChildren:function(){
			if(this.commManager){
				delete this.commManager;
				this.commManager= new iportal.widget.communication.manager();
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
					// updating the flag after the widgets are destroyed
					setTimeout(function(){
			    		try{
			    			iportal.workspace.metadata.setWorkspaceChangeAcceptable(true);
			    		}catch(e){};
			    	}, 100*this.childWidgets.length);	
				}
			}
		},
	/*@@@ To calculate the widgets inside a container */
	getWidgetPositions:function(){
			var container=this.getComponent(0);
			var totalColumns=container.items.length;
			var widPosition='RIGHT';
			var widPositionArr=new Array();
			var newWidgetStr;
			var newWidgetIDArr=new Array();
			var newWidgetArrObj=new Array();
			for(var ind=0; ind<totalColumns; ind++){
				var ddContainer=this.getComponent(0).getComponent(ind);
				var len=ddContainer.items.length;
				var col=this.getComponent(0).getComponent(ind).items.length;
					
					for(var i=0; i<len; i++){
						if(i==0){
							if(widPosition == 'RIGHT'){
								widPosition = 'LEFT';
							}else{
								widPosition = 'RIGHT';
							}
							
						}
						var wid= ddContainer.items.itemAt(i);
						var wid_Id= wid.itemId.replace("_PORTLET","");
						var newWidgetArr={};
						newWidgetArr['WIDGET_ID']=wid_Id;
						newWidgetArr['BLOCK_POSITION']=widPosition;
						newWidgetArr['POSITION']=i;
						
						newWidgetArrObj.push(newWidgetArr);
						
						//newWidgetArr=newWidgetArr+"\""+wid_Id+"\":\""+widPosition+"\",";
						
					}
				
			}
			//newWidgetStr="{"+newWidgetArr.substring(0,newWidgetArr.length-1)+"}";
			return newWidgetArrObj;
			  },
	getLayoutData:function(){
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
	iportal.layout.twocolumn.superclass.afterRender.apply(this, arguments);
}  



}); // eo extend
 
// register xtype
Ext.reg('iportal-2-column', iportal.layout.twocolumn); 


