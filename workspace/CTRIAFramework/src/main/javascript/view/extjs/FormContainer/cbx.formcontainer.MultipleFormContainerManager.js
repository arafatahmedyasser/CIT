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
Ext.namespace('cbx.multipleformcontainer');
/**
 * The MultipleFormContainerManager Class is responsible to create and render the form
 * containers based on the metadata.
 * 
 */



cbx.multipleformcontainer.manager = function (){

	return {

		multipleformContainerInputObj : {},
		/*
		 * This object stores the metadata of a form container once it is
		 * fetched from the Cache
		 */
		
		getMultipleWindowByFormObj :function (formObjArr, containerIdArr, configObjArr){
			
			cbx.multipleformcontainer.manager.multipleformContainerInputObj.FORMARRAY = formObjArr;
			cbx.multipleformcontainer.manager.multipleformContainerInputObj.CONTARRAY = containerIdArr;
			cbx.multipleformcontainer.manager.multipleformContainerInputObj.CONFIGARRAY = configObjArr;
			
			
			var confObjArr=[];

			var that = cbx.multipleformcontainer.manager;

			var confObj = {};
			
			for (var i =0;i<formObjArr.length;i++)
			{
				confObj = {};
				
				if (configObjArr && configObjArr[i]) {
					confObj = configObjArr[i];
					if ((confObj.isTxnHdrReqd != undefined) && confObj.isTxnHdrReqd == 'Y') {
						formObjArr[i] = that.getTxnHdrForm(formObjArr[i]);
					} else {
						confObj.isTxnHdrReqd = "";
					}
				} else {
					confObj = {};
			}
				configObjArr[i] = confObj;
				
			}
			
			var formContManager = cbx.formcontainer.manager;
			
			
			
			that.getFormContainerMetadataForMultiple(containerIdArr, formObjArr, configObjArr,0);
			
		},		
		/***********************************************************************
		 * This function renders the window on the screen
		 * 
		 * @param containerId
		 *            Container Id
		 * @param formObj
		 *            Form manager Object
		 * @param configObj
		 *            Config Object to hold - 1. TXN Header form and 2.Action
		 *            button maps based on Status
		 */
		renderMultipleWindow : function (containerIdArr, formObjArr, configObjArr){
			
			var containerId = containerIdArr[0], formObj = formObjArr[0], configObj = configObjArr[0];
			
			var activeContainer = 0;
			
			if(configObjArr){
				for (var i =0 ;i<configObjArr.length;i++){
					
					if(configObjArr[i] && configObjArr[i].ACTIVE_FORM ==true){
						activeContainer =i;
					}
					
				}
			}

			var winNewHeight;
			var winNewWidth; 			
			var widget;
			var ownerPanel = null;
			var cApp;
			var index;
		
			var rb = CRB.getFWBundle();
			var that = cbx.multipleformcontainer.manager;
			var winTitle = null;
			var formContainerMD;
			var formContManager = cbx.formcontainer.manager;
			if (formContManager.formContainerMetadataObj[containerId][containerId]) {
				formContainerMD = formContManager.formContainerMetadataObj[containerId][containerId];
				winNewHeight = (configObj && configObj.WINHEIGHT) ? configObj.WINHEIGHT : formContainerMD.WINHEIGHT ;
				winNewWidth = (configObj && configObj.WINWIDTH) ? configObj.WINWIDTH : formContainerMD.WINWIDTH ;
				ADDOPREG.executeOp({REAUTH:"Y",PRECONFIRM:"N"},formContainerMD,formObj);
			} else {
				var errorWin = new iportal.Dialog({
					dialogType : 'ERROR',
					title : rb.ERR_ERROR_CODE,
					message : rb.ERR_SORRY_MSG_FOR_FAIL,
					listeners : {
						'close' : function (){
							errorWin.close();
						}
					}

				});
				errorWin.show();
				return;
			}
			
			
			configObj.formConRenderType = configObj.formConRenderType?configObj.formConRenderType:formContainerMD.CONTEXT_FORM_RENDER;
			
			if(configObj.formConRenderType === "APP"){
			var lId = iportal.workspace.metadata.getCurrentLayoutId();
			var layoutObj = iportal.workspace.metadata.getCurrentLayout();
			var contextAppId = iportal.workspace.metadata.getContextApp(lId);
			widgetId = configObj.appWidget?configObj.appWidget:iportal.workspace.metadata.getContextApp(lId);
			if(layoutObj.find('itemId',widgetId).length>0){
			widget = layoutObj.find('itemId',widgetId)[0];
			}
			/**
			 * Added for a same container mapped in different Layouts
			 * Scenario : If a config.appWidget exists in one layout,
			 * but not in the other
			 */
			else if(layoutObj.find('itemId',contextAppId).length>0){
				widget = layoutObj.find('itemId',contextAppId)[0];
			}
			if(widget){
				ownerPanel = widget.find('name','content-panel').length>0?widget.find('name','content-panel')[0].ownerCt:widget.find('itemId',IMM.getDefaultView(widget.itemId))[0]; 
			}
			}
			
			
			bundle = CRB[formContainerMD.BUNDLE_KEY];
			
			if(formContainerMD.ACTIONS[0]!=null && formContainerMD.ACTIONS[0].CONTAINER_ID!= null &&
					(formContainerMD.ACTIONS[0].CONTAINER_ID=='PRE_CONFIRM_WIN' || formContainerMD.ACTIONS[0].CONTAINER_ID=='CONTAINER_LIB_CONFIRM')){ 
			
				var functionCode = configObj.ACTIONS[0].FUNCTION_CODE != null? configObj.ACTIONS[0].FUNCTION_CODE: null;
				var irb = CRB.getBundle(bundle);
				if(functionCode != null && !cbx.isEmpty(functionCode)){
					this.winTitle= irb['LBL_'+functionCode]? irb['LBL_PRE_CONFIRM_WIN_TITLE']+' '+irb['LBL_'+functionCode]:
						irb['LBL_PRE_CONFIRM_WIN_TITLE'];
						
				}
				else {
					this.winTitle= irb['LBL_PRE_CONFIRM_WIN_TITLE'];
				}
			
			}
			
			else if(Ext.isEmpty(formObj.formTitle) || formObj.formTitle==''){
				var containerTitle=CRB.getBundle(bundle)['LBL_' + formContainerMD.WINDOW_TITLE];
				this.winTitle=containerTitle?containerTitle:formContainerMD.WINDOW_TITLE;
			}else{
				this.winTitle=formObj.formTitle;
			}
						
			/**
			 * Need to provide an alternate for iportal.window,which will
			 * respect all these parameters briefed below and render the window accordingly.
			 * Note : iportal.window extends Ext.window
			 */
			if(configObj.formConRenderType === "WINDOW"){
				var formContainer = new iportal.Window({
				itemId : formContainerMD.CONTAINER_ID, 
				rawTitle : this.winTitle,
				height : winNewHeight,
				width : winNewWidth,
				closable : true,
				stateful:false, 
				resizable : true,
				autoScroll : true,
				items:{
					xtype           : 'tabpanel',
					activeTab       : activeContainer,
					title : this.winTitle,
					items : formObj.getFormView()
				},
				tools : cbx.formcontainer.tools.getToolsMenu(formContainerMD,formObj,configObj,this.winTitle),  
				bbar : cbx.formcontainer.buttonBars.getBbarMenu(formContainerMD, formObj, configObj,this.winTitle)

			});
			formContainer.show();
			formContainer.setHeight(winNewHeight);
			formContainer.setWidth(winNewWidth);
			formContainer.setTitle( this.winTitle);
			cbx.formcontainer.manager.setActiveFormContainer(formContainer);
			if(configObj && configObj['TRAN_MGR_HANDLER']){
				CBXTXNMGR.beginTransaction(formWrapper,configObj['TRAN_MGR_HANDLER']);
			}
			}
			/**
			 *  Need to provide an alternate for Ext.Panel,which will
			 * respect all these parameters briefed below and render the window accordingly.
			 * 
			 * This here is the context - app widget concept which will render the form in the 
			 * same widget.If a button inside a context App is clicked,the control checks for the 
			 * handler of the button(in contextmenuhandlerregistry),where the developer is expected to pass the 
			 * App Id of the context App in which the form must be rendered.
			 * example : CBXFORMCONTAINER.getWindow("CONTAINER_SELFTRANS",null,"WGT_RETAIL_IFRAME");
			 * Here, CONTAINER_SELFTRANS is the Container Id and WGT_RETAIL_IFRAME is the App Id.
			 * 
			 * The code in the after render part sizes the portal-column accordingly,i.e formContainerMD.WINHEIGHT
			 * 
			 */
			else if(configObj.formConRenderType === "APP"){
					configObj.appWidget = widget.itemId;
					
					var createItems = function(){
						
						var tabItems=[];
						for(var i=0;i<formObjArr.length;i++){
							
							var winTitle ="";
							var winNewHeight;
							var winNewWidth;

							var formContainerMD;
							
							var formcontainerId=containerIdArr[i];
							
							if (formContManager.formContainerMetadataObj[formcontainerId][formcontainerId]) {
								formContainerMD = formContManager.formContainerMetadataObj[formcontainerId][formcontainerId];
								winNewHeight = (configObjArr[i] && configObjArr[i].WINHEIGHT) ? configObjArr[i].WINHEIGHT : formContainerMD.WINHEIGHT ;
								winNewWidth = (configObjArr[i] && configObjArr[i].WINWIDTH) ? configObjArr[i].WINWIDTH : formContainerMD.WINWIDTH ;
								ADDOPREG.executeOp({REAUTH:"Y",PRECONFIRM:"N"},formContainerMD,formObjArr[i]);
							} else {
								var errorWin = new iportal.Dialog({
									dialogType : 'ERROR',
									title : rb.ERR_ERROR_CODE,
									message : rb.ERR_SORRY_MSG_FOR_FAIL,
									listeners : {
										'close' : function (){
											errorWin.close();
										}
									}

								});
								errorWin.show();
								return;
							}
							
							bundle = CRB[formContainerMD.BUNDLE_KEY];
							
							if(formContainerMD.ACTIONS[0]!=null && formContainerMD.ACTIONS[0].CONTAINER_ID!= null &&
									(formContainerMD.ACTIONS[0].CONTAINER_ID=='PRE_CONFIRM_WIN' || formContainerMD.ACTIONS[0].CONTAINER_ID=='CONTAINER_LIB_CONFIRM')){ 
							
								var functionCode = configObjArr[i].ACTIONS[0].FUNCTION_CODE != null? configObjArr[i].ACTIONS[0].FUNCTION_CODE: null;
								var irb = CRB.getBundle(bundle);
								if(functionCode != null && !cbx.isEmpty(functionCode)){
									winTitle= irb['LBL_'+functionCode]? irb['LBL_PRE_CONFIRM_WIN_TITLE']+' '+irb['LBL_'+functionCode]:
										irb['LBL_PRE_CONFIRM_WIN_TITLE'];
										
								}
								else {
									winTitle= irb['LBL_PRE_CONFIRM_WIN_TITLE'];
								}
							
							}
							
							else if(Ext.isEmpty(formObjArr[i].formTitle) || formObjArr[i].formTitle==''){
								var containerTitle=CRB.getBundle(bundle)['LBL_' + formContainerMD.WINDOW_TITLE];
								winTitle=containerTitle?containerTitle:formContainerMD.WINDOW_TITLE;
							}else{
								winTitle=formObjArr[i].formTitle;
							}
							

							
							tabItems.push({
								title : winTitle,
								items : formObjArr[i].getFormView(),
								autoScroll : true,
								height : winNewHeight, 
								cls:'cbx-tabsubform-wrap',
								tools : cbx.formcontainer.tools.getToolsMenu(formContainerMD,formObjArr[i],configObjArr[i],winTitle),
								bbar :{
									cls : 'app_container_bbar_tbar',
									ctCls : 'app_container_bbar_tbar',
									items : cbx.formcontainer.buttonBars.getBbarMenu(formContainerMD,formObjArr[i],configObjArr[i],winTitle)
								}
							});
						}
						
					return tabItems;
						
					};
					
					
					var formWrapper = new Ext.TabPanel({ 
						items : createItems(),
						activeTab       : activeContainer,
						height : winNewHeight-20,
						autoWidth : true,
						name : 'wrapper-owner',
						resizable : true, 
						header : false,
						autoDestroy : true,
						cls:'cbx-tabform-wrap',
						autoScroll : false,
						listeners : {
							show: function(){
								this[0].el.fadeIn({ 
									easing: 'elasticOut',
									duration: 2
								});
							},
							scope : [widget],
							hide: function(){
								arguments[0].el.fadeOut(); 
							},
							tabchange : function(){
								var arg0 =arguments[0];
								var wgt = this[0];
								
								setTimeout(function (){
									var pWid =  Number(winNewWidth); 
									var finalHeight = Ext.isIE?Number(arg0.activeTab.getHeight())+15:Number(arg0.activeTab.getHeight());
									finalHeight = finalHeight+8;
									finalHeight = finalHeight+25;//Tab header Height
									var finalWidth = Number(arg0.resizeW);
									wgt.height = finalHeight;
									if(wgt.find('name','content-panel').length>0){
										wgt.setHeight(finalHeight);
									}else{
										wgt.ownerCt.getEl().setHeight(finalHeight);
									}
									
									if (wgt.updateHeight) {
										
										wgt.updateHeight(finalHeight);
										
									} else {
										
										wgt.mwc.updateHeight(finalHeight);
										
									}
									if(wgt.updateWidth){
										wgt.updateWidth(finalWidth);
									}
									wgt.doLayout();
									
									if (wgt.ownerCt.ownerCt.ownerCt.ownerCt.resetHeight) {
										
										wgt.ownerCt.ownerCt.ownerCt.ownerCt.resetHeight();
										
									} else {
										
										wgt.ownerCt.ownerCt.ownerCt.ownerCt.doLayout();
										
									}
									iportal.jsutil.adjustPortalColumnsWidth(wgt,pWid);
								}, 500);
							}
						} 
					});
					
					cbx.formcontainer.manager.setActiveFormContainer(formWrapper);
					if(configObj && configObj['TRAN_MGR_HANDLER']){
						CBXTXNMGR.beginTransaction(formWrapper,configObj['TRAN_MGR_HANDLER']);
					}
					
					var options = {
							isCBXContainer : true,
							type : 'F'
					};
					ownerPanel.activateContainer(formWrapper,widget,options);
			}

			
		},
		/***********************************************************************
		 * This function creates the form object for the given form Id
		 * 
		 * @param formId
		 *            Form ID
		 * @param fmData
		 *            Form Model Data
		 */
		getFormObj : function (formId, fmData){
			var that = cbx.multipleformcontainer.manager;
			// To set the mode and model data for the form from
			// the listener handler registry
			var cons = cbx.formcontainer.constants;
			var listenerClass = CFLR.getListener(formId);
			var formModes;
			var formModelData = {};

			if (fmData != undefined && fmData != null) {
				formModelData = fmData;

			}

			if (listenerClass) {
				var listener = new listenerClass({});

				if (listener.getFormModes) {
					formModes = listener.getFormModes();
				}
				if (listener.getFormModelData) {
					formModelData = listener.getFormModelData(formModelData);
				}

			}
			// Creates the form object with the form Id obtained
			var formObj = new cbx.form.FormManager({
				formId : formId,
				mode : formModes,
				modelData : formModelData
			});

			return formObj;
		},
		/***********************************************************************
		 * This function retrieves that data from the Cache for a containerId if
		 * it is not available in the object formContainerMetadataObj
		 * 
		 * @param containerId
		 *            Container ID
		 * @param formObj
		 *            Form manager Object
		 * @param configObj
		 *            Config Object to hold - 1. TXN Header form and 2.Action
		 *            button maps based on Status
		 */
		getFormContainerMetadataForMultiple : function (containerIdArr, formObjArr, configObjArr,index){
			
			var that = cbx.multipleformcontainer.manager;
			
			if(containerIdArr.length < index+1){
				that.renderMultipleWindow(containerIdArr, formObjArr, configObjArr);
				return;
			}
			
			var containerId = containerIdArr[index], formObj = formObjArr[index], configObj = configObjArr[index];
			var rb = CRB.getFWBundle();
			var formContManager = cbx.formcontainer.manager;
			
			if (formContManager.formContainerMetadataObj[containerIdArr[index]] != null
					&& formContManager.formContainerMetadataObj[containerIdArr[index]] != undefined) {
				
				that.getFormContainerMetadataForMultiple(containerIdArr, formObjArr, configObjArr,index+1);
				return;
			}
			
			
			Ext.Ajax.request({
				params : {
					INPUT_ACTION : 'GET_FORM_CONTAINER_METADATA',
					INPUT_FUNCTION_CODE : 'VSBLTY',
					INPUT_SUB_PRODUCT : 'CUSER',
					PAGE_CODE_TYPE : 'FCDF_ACTION',
					PRODUCT_NAME : 'CUSER',
					FORM_CONTAINER_ID : containerId
				},
				success : function (result, request){
					var data = Ext.decode(result.responseText);
					var formMetadata = data.response.value.HEADER_FORM_CONTAINER_METADATA;
					formMetadata[containerId].IS_MULTIPLE_FORM_CONTAINER = true;
					formContManager.formContainerMetadataObj[containerId] = formMetadata;
					var confObj = {};
					var fmObj = null;
					
					// For assigning the proper resource bundle for that product
					if (formMetadata[containerId].BUNDLE_KEY != null && formMetadata[containerId].BUNDLE_KEY != "") {
						rb = CRB.getBundle(CRB[formMetadata[containerId].BUNDLE_KEY]);
					}

					if (configObj != null && configObj != undefined) {
						confObj = configObj;
					}

					if (formObj != null && formObj != undefined) {
						fmObj = formObj;
					} else {
						fmObj = that.getFormObj(formMetadata[containerId].FORM_ID, confObj);
					}
					
					that.getFormContainerMetadataForMultiple(containerIdArr, formObjArr, configObjArr,index+1);
					

				},
				failure : function (result, request){
					// To display an error window on
					// failure of AJAX
					var errorWin = new iportal.Dialog({
						dialogType : 'ERROR',
						title : rb.ERR_ERROR_CODE,
						message : rb.ERR_SORRY_MSG_FOR_FAIL,
						listeners : {
							'close' : function (){
								errorWin.close();
							}
						}

					});
					errorWin.show();
				}
			});

		},
		/***********************************************************************
		 * This function appends the Transaction Header form when required by
		 * the form container
		 * 
		 * @param fm
		 *            Main Form Manager Object
		 */
		getTxnHdrForm : function (fm){
			var that = cbx.multipleformcontainer.manager;
			var cons = cbx.formcontainer.constants;

			fm.addForm({
				formId : cons.TXN_HEADER_FORM,
				mode : cons.VIEW_MODE,
				direction : cons.DIR_TOP
			});

			return fm;
		}
	};
}();

CBXMULTIPLEFORMCONTAINER = cbx.multipleformcontainer.manager;