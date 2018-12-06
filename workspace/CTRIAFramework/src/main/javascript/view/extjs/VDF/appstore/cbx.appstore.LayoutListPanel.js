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
 * @class cbx.appstore.LayoutListPanel
 * @extends Ext.util.Observable
 * 
 * This class construct the Layouts panel of the appstore.
 * The class contains important methods they are 
 * 		1) constructor				- It construct the panel with title of 'Layouts'.
 * 		2) getPanel	 				- This method arrange layouts as ToggleGroup and each Button represent one layout type.
 * 									  Each layout button have one Image and Label. The label have the value of LAYOUT_ID as caption.
 * 									  This method also configure the layout button configuration. 
 * 									  (i.e) label caption, image of the button, its pressed or not, scope, margin, minimum width, ToggleGroup name. 
 * 		3) layoutHandler			- It handle the events of the pressed layout buttons.
 * 									  Based on the layout button the appropriate method will be communicated to arrange the components which are available in the selected widget panel.   
 * 									  (Example) when we click the STACK layout button the convertTo1column method is passed corresponding categories widgets are loaded in the available widgets panel.
 * 		4) isPressed 			- 
 * 
 */	
cbx.appstore.LayoutListPanel	 = Ext.extend(Ext.util.Observable, {
	
	constructor : function(config) {
		
		this.dataModel	=  config.dataModel;
		
		
		this.canvas		 = config.canvas;
		
		this.rb = CRB.getFWBundle();
		
		this.workarea    = new Ext.Panel({
			autoScroll : true,
			frame:true,
			height:config.height,
			autoWidth:true,
			ctCls:'x-panel-appstore',
			title:this.rb.LBL_LAYOUTS,
			holder:this
		});
	},
	
	/**
	 * The method is used to say which button should be selected initally
	 */
	
	isPressed:function(index,layId){
		
		var returnVal = false;
		
		if(this.dataModel.isUpdate()){
			
			returnVal = this.dataModel.getSelectedWorkspaceLayoutCategory()==layId.toUpperCase()?true:false;
			
		}else{
		
			returnVal = index==0?true:false;
		}
		
		return returnVal;
		
	},
	/**
	 * @return - the workarea of the LayoutList panel with layouts as buttons
	 */
	
	getPanel:function(){
				
		
		var configItemsArray = [];
		
		var layoutCategry = this.dataModel.getLayoutCategory();
		
		for (var i=0,len=layoutCategry.length; i<len; i++)
        {
            var buttonConfig = {
            		 xtype: 'button',
            		 ctCls:'x-btn-custom-wrap',
                     text:layoutCategry[i].LAYOUT_ID,
                     iconCls:layoutCategry[i].LAYOUT_ID,
                     minWidth : 174,
                     type:layoutCategry[i].LAYOUT_ID,
                     typeIndex:i,
                     allowDepress:false,
                     pressed :this.isPressed(i,layoutCategry[i].LAYOUT_ID) ,
                     enableToggle:true,
                     toggleGroup: 'Layout', 
                     margin: 50,
                     handler:this.layoutHandler,
                     scope:this
            };
            configItemsArray.push(buttonConfig);
        }
		
		this.workarea.add(configItemsArray);
				
		return this.workarea;
		
	},
	/**
	 * This method is called when a particular layout is clicked
	 * 
	 * @param butn
	 * @param evnt
	 * @returns The Selected widget panel is communicated to load the selected widgets in that layouts. 
	 */
	
	layoutHandler : function(butn,evnt){
		
		
		var methdname = 'dummyMethod';
		
		
		if(butn.type.toUpperCase() == "THREE-COLUMN"){methdname ='convertTo3column';};
		if(butn.type.toUpperCase() == "TWO-COLUMN"){methdname ='convertTo2column';};
		if(butn.type.toUpperCase() == "STACK"){methdname ='convertTo1column';};
		
		this.canvas.communicate('selectedWidgetPanel',methdname);
		
	},
	
	/**
	 * empty method used for intializing any communication to avoid errors.
	 * 
	 */
	dummyMethod :function(){
		
	}

});