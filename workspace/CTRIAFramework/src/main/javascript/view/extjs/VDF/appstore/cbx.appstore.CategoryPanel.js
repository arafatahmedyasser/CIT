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

Ext.ns('cbx.appstore');

/**
 * @class cbx.appstore.CategoryPanel

 * @extends Ext.util.Observable
 * 
 * This class construct the cetegoryPanel of the appstore.
 * The class contains important methods they are 
 * 		1) constructor				- It construct the categories panel with title of 'Categories'.
 * 		2) getPanel	 				- This method arrange categories as ToggleGroup and each Button as one category.
 * 									  Each category button have one Image and Label. The label have the value of PRODUCT_CATEGORY_DISPLAY_NM as caption.
 * 									  This method also configure the category button configuration. 
 * 									  (i.e) label caption, image of the button, its pressed or not, scope, margin, minimum width, ButtonGroup name. 
 * 		3) categoryHandler			- It handle the event of Category button pressed, 
 * 									  (i.e) when we click the category button the corresponding categories widgets are loaded in the available widgets panel. 
 * 
 */	

cbx.appstore.CategoryPanel	 = Ext.extend(Ext.util.Observable, {
	
	constructor : function(config) {
		
		this.dataModel	=  config.dataModel;
		
		this.rb = CRB.getFWBundle();
		
		this.canvas		 = config.canvas;
		this.workarea    = new Ext.Panel({
			autoScroll : true,
			ctCls:'x-panel-appstore',
			autoWidth:true,
			height:config.height,
			frame:true,
			title:this.rb.LBL_CATEGORIES,			
			holder:this
		});
	},
	
	/**
	 * @return - the workarea of the category panel with categories as buttons
	 */
	
	getPanel:function(){
		
		var configItemsArray = [];
		
		
		var prodCategry = this.dataModel.getProductCategory();
		
		
		for (var i=0,len=prodCategry.length; i<len; i++)
        {
			var bundle;
			if(Ext.isEmpty(prodCategry[i].BUNDLE_KEY))
				bundle=CRB.getFWBundle();
			else
				bundle=CRB.getBundle(prodCategry[i].BUNDLE_KEY);
			
            var buttonConfig = {
                xtype: 'button',
                ctCls:'x-btn-custom-wrap',
                text:this.getText((bundle[prodCategry[i].PRODUCT_CATEGORY_DISPLAY_NM])?bundle[prodCategry[i].PRODUCT_CATEGORY_DISPLAY_NM]:prodCategry[i].PRODUCT_CATEGORY_DISPLAY_NM,120),
                iconCls:prodCategry[i].PRODUCT_CATEGORY,
                tooltip :(bundle[prodCategry[i].PRODUCT_CATEGORY_DISPLAY_NM])?bundle[prodCategry[i].PRODUCT_CATEGORY_DISPLAY_NM]:prodCategry[i].PRODUCT_CATEGORY_DISPLAY_NM,
                minWidth : 180,
                toggleGroup: 'Category', 
                allowDepress:false,
                pressed : i==0?true:false,
                enableToggle:true,
                type:prodCategry[i].PRODUCT_CATEGORY,
                typeIndex:i,
                margin: 50,
                handler:this.categoryHandler,
                scope:this
            };
            configItemsArray.push(buttonConfig);
        }
		
		
		this.workarea.add(configItemsArray);
				
		return this.workarea;
		
	},
	/**
	 * This method is called when a particular category is clicked
	 * 
	 * @param butn
	 * @param evnt
	 * @returns The Available widget panel is communocated to load the corresponding category. 
	 */
	
	categoryHandler : function(butn,evnt){
		
		var params=[];
		params.push(butn);
		params.push(evnt);
		
		this.canvas.communicate('availableWidgetPanel','categoryLoader',params);
		
	},
	
	/**
	 * empty method used for intializing any communication to avoid errors.
	 * 
	 */
	
	dummyMethod :function(){
		
	},
	/**
	 * The getText function will be used to return a string of the specified
	 * width by truncating the input string if its width is greater than the
	 * input width
	 * 
	 * @param val
	 * @param width
	 * @returns val
	 */
	getText : function (val, width){
		if (val == 'null' || val == 'NULL' || val == undefined || val == null || val == '') {
			return '';
		}
		var metaData = '';
		var stringNumber = iportal.util.stringnumber.getInstance();
		var neededWidth = stringNumber.getNeededWidthNoEl(val, metaData);
		if (neededWidth > width) {
			var writestring = stringNumber.getStringForWidth(val, width, metaData);
			writestring = writestring.substring(0, writestring.length - 3).concat('..');
			return writestring;
		}
		return val;

	}

});