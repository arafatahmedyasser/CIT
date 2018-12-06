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
cbx.ns('cbx.form');

/**
 * <pre>
 *  
 * Instance of this class will be attached to the form screen view. The user will not
 * have access to this object. At any point
 * of the the UI should always be in sync with the screen view object. For this, the
 * model will raise and receive events from form manager. This class will also
 * provide helper methods for providing screen view for the user to export the form.
 * 
 * 
 * this.SVC={
 * 			windowTitle:'',
 * 			parentFormId:'',
 * 			formIds:[frm1,frm2],
 * 			widgetIds:[
 * 				{	
 * 					widgetID:WIDGET_1,
 * 					exportParams:paramsjson,
 * 					exportFileName:''
 * 				}
 * 			],
 * 			screenViewData:{
 * 				TEXTFIELD_1 : {
 * 							VISIBLE_IND : 'Y',
 * 							screenData : 'abc@gmail.com',
 * 							itemType   : 'TEXT',
 * 							childItems : [],
 * 				},
 * 				TEXTFIELD_2 :{
 * 							VISIBLE_IND : 'Y',
 * 							screenData : 'abc@gmail.com',
 * 							itemType   : 'TEXT',
 * 							childItems : [],
 * 				}
 * 			}
 * 			
 * 	};
 * 
 * 
 * </pre>
 * 
 * @class cbx.form.FormScreenView
 */

cbx.form.FormScreenView = Class(cbx.Observable, {

	/**
	 * In the Constructor FSV - FormScreenView object initialized with
	 * parentformId,and empty screenviewconfig(SVC)
	 */
	constructor : function(config) {
		this.FSV = {
			windowTitle : '',
			formIds : [],
			widgetIds:[],
			parentFormId : config.formId,
			SVC : {}
		};
		this.FSV.formIds.push(config.formId);
	},
	/**
	 * This method used to update the child information of item and the
	 * itemtype,VISIBLE_IND,screenviewData. show/hide information item will be
	 * stored in the VISIBLE_IND, item screen value stored in screenviewData
	 */
	updateItemInfo : function(item) {
		var childItem = [];
		/**
		 * If it is container , then it will have the children else it is a
		 * singular components like textfield then it needs the data need to be
		 * updated. The VisibleIndicator needs to be updated for the both.
		 */
		if (!cbx.isEmpty(item.children)) {
			
			var children ;
			
			
			
			if ("TABPANEL" == item.children[0].itemType) {
				
				children = item.children[0].children; 
				
			}else{
				children = item.children;
			}
			
			
			
			
			for ( var i = 0, len = children.length; i < len; i++) {
				if ("cbx-lazzyformpanel" == children[i].xtype) {
					childItem[childItem.length] = children[i].formId;
				} else {
					if ("Y" == children[i].formInd) {
						childItem[childItem.length] = children[i].formId;
					} else {
						childItem[childItem.length] = children[i].formId
								+ '|||' + children[i].itemId;
					}

				}
			}
			
			
			var itemKey = "";
			if ("cbx-lazzyformpanel" == item.xtype) {
				itemKey = item.formId;
				this.updateFormIds(itemKey);
			} 
			else {
				itemKey = item.formId + '|||' + item.itemId;
			}

			if(!cbx.isEmpty(item.formId)){
				var bundleKey ;
				if(cbx.isEmpty(item.bundleKey)){
					bundleKey= this.FSV.SVC[item.formId].bundleKey;
				}
				else{
					bundleKey=item.bundleKey;
				}
				this.FSV.SVC[itemKey] = {
					VISIBLE_IND : item.visibleInd,
					itemType : item.xtype,
					childItem : childItem,
					bundleKey : bundleKey
				};
			}
		} 
		else {
			var itemKey = item.formId + '|||' + item.itemId;
			if(!cbx.isEmpty(item.formId) && !cbx.isEmpty(item.itemId)){
				var bundleKey ;
				if(cbx.isEmpty(item.bundleKey)){
					bundleKey= this.FSV.SVC[item.formId].bundleKey;
				}
				else{
					bundleKey=item.bundleKey;
				}
				this.FSV.SVC[itemKey] = {	
					VISIBLE_IND : item.visibleInd,
					itemType : item.xtype,
					screenViewData : '--',
					bundleKey : bundleKey
				};
				if ("cbx-widgetpanel" == item.xtype) {
					var widgetParam ={
							widgetID: item.widgetId
					};
					this.FSV.widgetIds.push(widgetParam);
					this.FSV.SVC[itemKey].screenViewData=item.widgetId;
				}
			}
		}
	},
	/**
	 * This mehtod is used to update the FormIDs in the FormScreenView ( The
	 * Forms includes the parent and sub forms).
	 * 
	 * @param Form
	 *            Id
	 */
	updateFormIds : function(formId) {
		if (!this.FSV.formIds.contains(formId)) {
			this.FSV.formIds.push(formId);
		}
	},	
	/**
	 * This method is used to update the title of the form
	 * 
	 * @param WindowTitle
	 */
	updateWindowTitle :  function(windowTitle) {
		this.FSV.windowTitle = windowTitle;
	},
	
	/**
	 * Returns for the FSV to the form manager for the export
	 * 
	 * @returns FSV(Form Screen View)
	 */
	getFormScreenView : function() {
		return this.FSV;
	},
	
	/**
	 * This will destroy the form screen view object This is called from the
	 * destroy method of formManager.
	 */
	destroy : function() {
		delete this.FSV;
		this.purgeListeners();
	},
	
	/**
	 * This used to update the visible indicator attribute for the field in
	 * screenview object
	 * 
	 * @param itemID -
	 *            Form Item Id , Value (Y/N) - VISIBLE_IND
	 */
	updateVisibleInd : function(formId, itemId, value) {
		var itemKey = formId + '|||' + itemId;
		if (!cbx.isEmpty(this.FSV.SVC[itemKey])) {
			this.FSV.SVC[itemKey].VISIBLE_IND = value;
		}
	},
	/**
	 * This used to update screen value in screenviewData attribute for the
	 * field in screenview object
	 * 
	 * @param itemID -
	 *            Form Item Id , Value - The data seen on the screen
	 */
	updateScreenViewData : function(formId, itemId, value) {
		if (!cbx.isEmpty(itemId)) {
			var itemKey = formId + '|||' + itemId;
			var formscreenView=this.getFormScreenView();
			if(!cbx.isEmpty(value)){
				if(formscreenView.SVC[itemKey]!=undefined){
					if('cbx-widgetpanel' == formscreenView.SVC[itemKey].itemType){
						for (var widgetIndex in this.FSV.widgetIds) {
							if(value['widgetID'] == formscreenView.widgetIds[widgetIndex]['widgetID']){
							  formscreenView.widgetIds[widgetIndex]['exportParams'] = value['exportParams'];
							}
						}
					}
					else {
						formscreenView.SVC[itemKey].screenViewData = value;
					}
				}
			}
			else {
				if(formscreenView.SVC[itemKey]!=undefined){
					formscreenView.SVC[itemKey].screenViewData = value;
				}
			}
		}
	},
	updateParentForm : function(formConfig, parentForm){
		if(formConfig.direction == "BOTTOM"){
			this.FSV.formIds[this.FSV.formIds.length] = formConfig.formId;
			this.FSV.SVC[parentForm].childItem[this.FSV.SVC[parentForm].childItem.length] = formConfig.formId;
		}
		else if(formConfig.direction == "TOP"){
			this.FSV.formIds = this.FSV.formIds.insert(1,formConfig.formId);
			this.FSV.SVC[parentForm].childItem = this.FSV.SVC[parentForm].childItem.insert(0,formConfig.formId);
		}
	}
});
