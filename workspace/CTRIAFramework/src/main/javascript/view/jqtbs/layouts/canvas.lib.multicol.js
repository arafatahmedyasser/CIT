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
 
cbx.ns('canvas.lib.layout');
/**
 * @namespace "canvas.lib.layout"
 * @class 			canvas.lib.multicol
 * @extends	 		cbx.core.Component
 * @description		This class is responsible for creating the multi columns as per the width 
 * 					mentioned by the user in Database. If no width is mentioned, 
 * 					then default width is taken.
 */
canvas.lib.multicol = Class(cbx.core.Component,	{
	/**
	 * @class 		"canvas.lib.multicol"
	 * @memberof	canvas.lib.multicol
	 * @description	Initializes the proportion sent by the parent of nth column (STACL, 
	 * 				TWO-COLUMN, THREE-COLUMN) and also defines the propotion mappings
	 * 				to map with bootstrap classes.
	 */
	proportion : [],
	
	prop : [],
	
	proportionMappings : [{ '8.33':'1'},
	                      {'16.67':'2'},
	                      {'25.00':'3'},
	                      {'33.33':'4'},
	                      {'41.66':'5'},
	                      {'50.00':'6'},
	                      {'58.33':'7'},
	                      {'66.66':'8'},
	                      {'75.00':'9'},
	                      {'83.33':'10'},
	                      {'91.66':'11'}, 
	                      {'100.00':'12'}],

	constructor : function(config) {
		
		this.proportion=config.proportion;
		this.parentContainer=config.parentContainer;
		/*
		 *  this.prop has to be set to null again. 
		 *  If a STACK muti-app is called after TWO-COLUMN,
		 *  then the STACK app will also created with two columns
		 *  if it is not nulled.
		 */
		this.prop = [];
		
		this.initializeColumns();
		
		canvas.lib.multicol.$super.call(this);
		
	},
	
	/**
	 * @method initializeColumns
	 * @memberof 	"canvas.lib.multicol"
	 * @description This method is used to map the proportions of the N columns
	 * 				to the proportion mappings to enable bootstrap defined width.
	 */
	initializeColumns : function() {
		
		var proportion1, proportion2;
					
		/*
		 * 	If the propotion given by the user is in decimal, 
		 *  then it is converted to percentage.
		 */
		for (var temp=0; temp < this.proportion.length; temp++) {
			
			if(this.proportion[temp] !=null){
				if (this.proportion[temp] < 1) {
					this.proportion[temp] = this.proportion[temp]*100;
				}
			}
		
		}
		
		/*
		 * Mapping the proportion of the user to that of bootstrap values for columns.
		 */
		for (var j = 0, temp = 0; j < this.proportion.length; j++)
		{
			for (var i = 0, tot = this.proportionMappings.length; i < tot; i++) {
				var key = Object.keys(this.proportionMappings[i])[0];
				if (parseInt(key) >= parseInt(this.proportion[j])) {
					/*
					 * Here, the last proportion is set to take the remaining width.
					 * This is done because the proportional mapping is done based on approximation
					 * and it may exceed the maximum supported columns in a row if the same
					 * is followed till the last column.
					 */
					if ( j == this.proportion.length - 1) {
						this.prop[j] = 12 - temp;
					}
					else {
						this.prop[j] = parseInt(this.proportionMappings[i][key]);
						temp += this.prop[j];
					}
					break;
				}
			}
		}

	},
	
	/**
	 * @method 		renderMultiApps
	 * @memberof 	"canvas.lib.multicol"
	 * @description This method is used to create and append the containers
	 * 				in the parent container for all the proportions defined. 
	 * 				It then appends the apps in the multi-app to their 
	 * 				respective containers. 				
	 */
	renderMultiApps : function(config) {
		
		var child_widgets = config.CHILDAPPS;
		var parentDataWidgetId = config.PARENTDATAWIDGETID ;
		var parentId = config.PARENTID ;
		
		var parentelem = this.parentContainer;
		
		for (var j = 0; j < this.prop.length; j++) {
			var containerLayer =  new cbx.lib.layer({
					'eleType' : 'div',
					'class' :  'column-child col-md-'+ this.prop[j]
				}).getLayer();
				$(parentelem).append(containerLayer);
		}

		
		for (var i = 0; i < child_widgets.length ; i++) {
			/*
			 * 	In case if the id for the app is set previously by the parent component,
			 * 	then that id is considered. Else, the id is set based on the value of i, 
			 * 	where i is the position of the app in the array list.
			 */
			var indexId;			
			if (!cbx.core.isEmpty(child_widgets[i].indexId)) { indexId = child_widgets[i].indexId;	}
			else {	indexId = i; }
			for (var j = 0; j < this.prop.length; j++) {
				if ( i % this.prop.length == j) {
					var appLayer =  new cbx.lib.layer({
						'eleType' : 'div',
						'id' : parentId + indexId,
						/*'class' :  'col-md-12',*/
						'data-widgetid' : parentDataWidgetId + child_widgets[i].WIDGET_ID
					}).getLayer();
					
					var temp = j+1;
					var parentNthChild = '.column-child:nth-child(' + temp + ')'; 
					$(parentelem).find($(parentNthChild)).append(appLayer);
					
					/*
					 * 	Header of each app is initialised by setting the 
					 * 	WGT_HEADER_IND.
					 */
					var appConfig = {
						elem :$(appLayer),
						'WGT_HEADER_IND':child_widgets[i].WIDGET_HEADER_IND, //WGT_HEADER_IND assigned for each child widget
					    PORTLET_REQ : true
					};
					cbx.core.extend(appConfig, child_widgets[i]);
					var appObj= new canvas.lib.app(appConfig);
				}
			}
		}
		
				
	}
	
});
/**
 * 		Registering the componenent.
 */
CLCR.registerCmp({'COMP_TYPE' : 'MULTI-COLUMN'}, canvas.lib.multicol);

