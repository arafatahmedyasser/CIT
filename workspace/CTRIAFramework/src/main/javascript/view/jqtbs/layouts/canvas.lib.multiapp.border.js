/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
cbx.ns("canvas.lib.multiapp");
/**
 * @namespace		"canvas.lib.multiapp"
 * @class 			canvas.lib.multiapp.border
 * @extends	 		cbx.core.Component
 * @description		This class is responsible for creating the proportions for border
 * 					layout depending upon the number of child widgets. 
 * 					Also, it creates the parent container where all the border layout
 * 					containers are appended. It then calls the multi column class 
 * 					to create the multi columns for multiapp.
 */

canvas.lib.multiapp.border = Class(cbx.core.Component, {
	
	/**
	 * @method 		canvas.lib.multiapp.border
	 * @memberof 	"canvas.lib.multiapp.border"
	 * @description This method is used to set the proportions for border layout
	 * 				depending upon the number of child widgets. Also it creates a 
	 * 				parent border container where all the child containers are
	 * 				appended.
	 */
	constructor : function (config){
				
		cbx.core.extend(this, config);
		
		this.parentDataWidgetId = this.parentDataWidgetId;
		this.parentId = this.parentId;
		
		this.parentBorderContainer =  new cbx.lib.layer({"eleType" : "div","data-item-id": this.md.md.MULTI_WIDGET_MD.WIDGET_ID}).getLayer();
		
		$(this.parentelem).append(this.parentBorderContainer);
		
		var child_widgets_list = this.md.md.CHILD_WIDGETS;
		
		this.widget_count = child_widgets_list.length;
		
		/*
		 * 	Usually, the IDs for each app is considered as 'i' where the app 
		 * 	is the ith element in the list. Here since the array is re-initialised 
		 * 	for most cases, the ID has to set before re-initialising. 
		 */		
		for (var temp = 0; temp < this.widget_count; temp++) {
			child_widgets_list[temp].indexId = temp;
		}
		
		/*
		 * 	The fifth case is considered as default as no more than 5 apps/multiapps
		 * 	is supported inside border layout. All the other apps configured after  
		 * 	the fifth app are left as such without rendering.
		 */
		switch (this.widget_count) {
			
			case 1: this.proportion = [ 100 ];
					var child_widgets = child_widgets_list;
					this.getMultiAppLayout(child_widgets);
					break;
					
			case 2: this.proportion = [ 50, 50 ];
					var child_widgets = child_widgets_list;
					this.getMultiAppLayout(child_widgets);
					break;
			
			case 3: this.proportion = [ 25, 50, 25 ];
					var child_widgets = child_widgets_list;
					this.getMultiAppLayout(child_widgets);
					break;
			
			case 4: var child_widgets = [];
					this.proportion = [ 25, 50, 25 ];
					for (var temp = 0; temp < 3; temp++ ) {
						 child_widgets[temp] = child_widgets_list[temp];
					}
					this.getMultiAppLayout(child_widgets);
					this.proportion = [ 100 ];
					child_widgets = [ child_widgets_list[3] ];
					this.getMultiAppLayout(child_widgets);
					break;
			
			default:var child_widgets = []; 
					this.proportion = [ 100 ];
					child_widgets = [ child_widgets_list[4] ];
					this.getMultiAppLayout(child_widgets);
					this.proportion = [ 25, 50, 25 ];
					for (var temp = 0; temp < 3; temp++ ) {
						 child_widgets[temp] = child_widgets_list[temp];
					}
					this.getMultiAppLayout(child_widgets);
					this.proportion = [ 100 ];
					child_widgets = [ child_widgets_list[3] ];
					this.getMultiAppLayout(child_widgets);
					break;
			
		}
	
	},
	
	/**
	 * @method 		canvas.lib.multiapp.border
	 * @memberof 	"canvas.lib.multiapp.border"
	 * @description This method is create the parent container and calls the 
	 * 				multi column layout. 
	 */	
	getMultiAppLayout : function(child_widgets){

		var multiAppClass = CLCR.getCmp ({ "COMP_TYPE" : "MULTI-COLUMN" });
		
		var parentDatatypeContainer = new cbx.lib.layer({
			"eleType" : "div",
			"data-app-type" : "MULTI_APP"
		}).getLayer();
		
		var parentContainer =  new cbx.lib.layer({"eleType" : "div",  "class" : "row" }).getLayer();
		
		$(parentDatatypeContainer).append(parentContainer);
		
		$(this.parentBorderContainer).append(parentContainer);		
		
		if(multiAppClass){
			
			var multiAppConfig = {	
				proportion:this.proportion,
				parentContainer : parentContainer
			};
			
			this.multiAppObj= new multiAppClass(multiAppConfig);
			
			this.multiAppObj.renderMultiApps({'CHILDAPPS' : child_widgets, 'PARENTDATAWIDGETID': this.parentDataWidgetId , 'PARENTID' : this.parentId});
			
		}	
	}
	
});

CLCR.registerCmp ({	"COMP_TYPE" : "MULTI_APP", "LAYOUT" : "EXPLORER" }, canvas.lib.multiapp.border);

