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
* This class is container for the stacked widget container component

*
*/

cbx.ns('cbx.lib');
cbx.lib.stack = Class(cbx.core.Component, {
	container : null,
	parent: null,
	constructor: function(config) {
		cbx.lib.stack.$super.call(this);
		this.parent = config.parent;
		this.layoutType = $.trim(this.parent.layoutType).toUpperCase();
		this.lDef = iportal.workspace.metadata.getUpdatedLayoutDef(this.parent.layoutId,this.parent.workspaceID);		
		this.proportion = this.lDef.LAYOUT_PROPORTION && this.lDef.LAYOUT_PROPORTION.indexOf(',') != -1?this.lDef.LAYOUT_PROPORTION.split(','):null;
		this.initializeContainer();
		this.addItem(this.container);
		//this.parent.getItem(0).appendChild(this.getItem(0));
	},
	initializeContainer: function() {
		var containerConfig = {
			"id": "stack-container",
			"eleType": "div",
		/*	"style": {
				"width": "100%",
				"paddingTop": "30px",
				"height":"100%"
			},*/
			"class": "jqm-twocolumnlayout responsiveClass"
			/*  Added responsive class */
		};
		this.container = new cbx.lib.layer(containerConfig).getLayer();
		if(this.layoutType !="STACK"){
			this.colCount = this.layoutType==="TWO-COLUMN"?2:this.layoutType==="THREE-COLUMN"?3:2
			for(var i=0;i<this.colCount;i++){
				var col = {
							"eleType":"div",
							"id":this.parent.layoutId+"_COLUMN_"+(i+1),
							"class":"widgetColumns",
							"style":{
								"width":(cbx.isArray(this.proportion) && this.proportion.length===this.colCount?this.proportion[i]:100/this.colCount)+"%"
							}
				}
				var colDiv = new cbx.lib.layer(col).getLayer();
				this.container.appendChild(colDiv);
			}
		}
	},
	/**
	 * The controlling API to say if the current layout requires responsiveness
	 * or not.
	 * 
	 * Will return true if Two/three/n column layout and number of widgets
	 * about to be rendered in the layout is > 1
	 * 
	 * Empty layout type configuration will result in false.
	 * 
	 * @param sortedAppArray
	 * @returns {Boolean}
	 */
	isLayoutResponsive : function(sortedAppArray){
		return sortedAppArray.length > 1 && !(cbx.isEmpty($.trim(this.parent.layoutType))) && this.parent.layoutType.toUpperCase() != "STACK";
		//return false;
	},
	
	/**
	 *  Added classes for responsive layout
	 */
	addApps : function(sortedAppArray){
		this.cleanPortal();
		var responsiveLayout = this.isLayoutResponsive(sortedAppArray);/* CT_MOBILITY_CHGv1.2 ISSUE_FIXES_504*/
		if(cbx.isArray(sortedAppArray)){
			
			/* CT_MOBILITY_CHGv1.2 ISSUE_FIXES_504 Starts */
				for(var i=0;i<sortedAppArray.length;i++){
					var portlet = sortedAppArray[i].PORTLET;
				var widget = portlet.getWidgetObject();
				if(responsiveLayout){
					var columnToAppend;
					if(this.layoutType==="TWO-COLUMN"){
						columnToAppend = sortedAppArray[i].BLOCK_POSITION==="LEFT"?1:sortedAppArray[i].BLOCK_POSITION==="RIGHT"?2:1;
					}
					else if(this.layoutType==="THREE-COLUMN"){
						columnToAppend = sortedAppArray[i].BLOCK_POSITION==="LEFT"?1:
							sortedAppArray[i].BLOCK_POSITION==="CENTER"?2:sortedAppArray[i].BLOCK_POSITION==="RIGHT"?3:1; 
					}
				
					/*var responsiveClass = $.trim(this.parent.layoutType).toUpperCase() == "TWO-COLUMN"?"widgetColumns":"widget3Columns";
					var $spliter = $('<div />').addClass(responsiveClass);*/
					
					var container = $(this.container).children("#"+this.parent.layoutId+"_COLUMN_"+columnToAppend);
					$(widget).addClass('responsiveWidget');
					container.append(widget);
					}
				else{
					$(this.container).append(widget);
				}
					portlet.initiateWidget(sortedAppArray[i].scope);
					//counter++;
			/* CT_MOBILITY_CHGv1.2 ISSUE_FIXES_504 Ends */
				}
				this.validateColumns();

		}
	},
	cleanPortal : function(){
		if(this.layoutType==="STACK"){
			$(this.container).empty();
		}
		else{
			for(var i=0;i<this.colCount;i++){
				 var container = $(this.container).children().eq(i)
				 if(container[0]){
					 container.empty();
				 }
			}
		}
	},
	validateColumns : function(){
		var validContainerArray = []; 
		var reDrawLayout = false;
		for(var i=0;i<this.colCount;i++){
			 var container = $(this.container).children("#"+this.parent.layoutId+"_COLUMN_"+(i+1));
			 if(!container.is(':empty')){
				 validContainerArray.push(container)
			 }
			 else{
				 reDrawLayout = true;
				 container.remove()
			 }
		}
		if(reDrawLayout){
			for(var i=0;i<validContainerArray.length;i++){
				var child = validContainerArray[i];
				child.width(100/validContainerArray.length+"%");
			}
		}
		
	}
});
CLCR.registerCmp({'COMP_TYPE':'PORTAL','LAYOUT':'STACK'}, cbx.lib.stack);
