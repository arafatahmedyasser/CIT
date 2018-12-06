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
cbx.namespace('cbx.formcontainer');
/**
 * The FormContainerManager Class is responsible to create and render the form containers based on the metadata.
 * 
 
 */

cbx.formcontainer.manager = function ()
{
	var containerObj;
	return {

		/*
		 * This object stores the metadata of a form container once it is fetched from the Cache
		 */
		formContainerMetadataObj : [],
		
		/*
		 * This method is used for enabling and disabling of container button.
		 * param: container obj, button id, flag for disable (true/false)
		 * functionality: when user pass flag as true the respective button will be disable otherwise enable;
		 */
			setBtnDisable: function(config,btnId,isDisable){
			var btnObj=config.btnRef.ownerCt.ownerCt.getBottomToolbar().find('buttonId',btnId)[0];
			if(!cbx.isEmpty(btnObj)){
				btnObj.setDisabled(isDisable);
			}
			
			},
			
			/*
			 * This method is used for Showing and Hiding the container button.
			 * param: container obj, button id, flag for show/hide (true/false)
			 * functionality: when user pass flag as true the respective button will be shown and false to hide.
			 */
			
			 	   setBtnVisible: function(config,btnId,isDisableBtn){
				   var btnObj=config.btnRef.ownerCt.ownerCt.getBottomToolbar().find('buttonId',btnId)[0];
				   if(!cbx.isEmpty(btnObj)){
				    btnObj.setVisible(isDisableBtn);
				   }

			 },
			
		/***************************************************************************************************************
		 * This function is used to render the container with its associated form Id.
		 * 
		 * @param containerId Container Id
		 * @param modelData Modeldata for the Form object
		 * @param configObj Config Object to hold - 1. TXN Header form and 2.Action button maps based on Status
		 */
		getWindow : function (containerId, configObj/* ,widgetId */)
		{
			
			var that = cbx.formcontainer.manager;
			var formModelData = null;
			var confObj = {};
			var formObj = null;

			if (configObj)
			{
				confObj = configObj;
			}

			// In the absence of metadata for the particular
			// Container ID, AJAX call is made to retrieve it
			// from Cache
			if (that.formContainerMetadataObj[containerId] == null
						|| that.formContainerMetadataObj[containerId] == undefined)
			{

				that.getFormContainerMetadata(containerId, formObj, confObj/* ,widgetId */);
				

			} else
			{
				// Calls the window once the metadata for the
				// window is ready
				formObj = that.getFormObj(that.formContainerMetadataObj[containerId][containerId].FORM_ID);
				that.renderWindow(containerId, formObj, confObj/* ,widgetId */);
			}

		},
		/***************************************************************************************************************
		 * This function is used to render the window based upon the availability of the data with the Form Id.
		 * 
		 * @param formId Form ID
		 * @param containerId Container Id
		 * @param modelData Modeldata for the Form object
		 * @param configObj Config Object to hold - 1. TXN Header form and 2.Action button maps based on Status
		 */
		getWindowByFormId : function (formId, containerId, modelData, configObj)
		{
			var formModelData;
			var that = cbx.formcontainer.manager;
			var confObj = {};

			if (modelData != undefined && modelData != null && modelData != "")
			{
				formModelData = modelData;
			} else
			{
				formModelData = {};
			}

			if (configObj != undefined && configObj != null && configObj != "")
			{
				confObj = configObj;
				if ((confObj.isTxnHdrReqd != undefined) && confObj.isTxnHdrReqd == 'Y')
				{
					formObj = that.getTxnHdrForm(formObj);
				} else
				{
					confObj.isTxnHdrReqd = "";
				}
			} else
			{
				confObj = "";
			}

			// Creating Form Object
			var formObj = that.getFormObj(formId, formModelData);

			// In the absence of metadata for the particular
			// Container ID, AJAX call is made to retrieve it
			// from Cache
			if (that.formContainerMetadataObj[containerId] == null
						|| that.formContainerMetadataObj[containerId] == undefined)
			{

				that.getFormContainerMetadata(containerId, formObj, confObj);

			} else
			{
				// Calls the window once the metadata for the
				// window is ready
				that.renderWindow(containerId, formObj, confObj);
			}

		},
		/***************************************************************************************************************
		 * This function contains the window to be rendered on screen based on Form Object
		 * 
		 * @param formObj Form manager Object provided by the developer
		 * @param containerId Container Id
		 * @param configObj Config Object to hold - 1. TXN Header form and 2.Action button maps based on Status
		 */
		getWindowByFormObj : function (formObj, containerId, configObj/* ,widgetId */)
		{
			var confObj = {};
			var that = cbx.formcontainer.manager;

			if (configObj)
			{
				confObj = configObj;
				if ((confObj.isTxnHdrReqd != undefined) && confObj.isTxnHdrReqd == 'Y')
				{
					formObj = that.getTxnHdrForm(formObj);
				} else
				{
					confObj.isTxnHdrReqd = "";
				}
			} else
			{
				confObj = {};
			}

			// In the absence of metadata for the particular
			// Container ID, AJAX call is made to retrieve it
			// from Cache
			if (that.formContainerMetadataObj[containerId] == null
						|| that.formContainerMetadataObj[containerId] == undefined)
			{
				that.getFormContainerMetadata(containerId, formObj, confObj/* ,widgetId */);
				
			} else
			{
				// Calls the window once the metadata for the
				// window is ready
				that.renderWindow(containerId, formObj, confObj/* ,widgetId */);
				
			}

		},
		/***************************************************************************************************************
		 * This function renders the window on the screen
		 * 
		 * @param containerId Container Id
		 * @param formObj Form manager Object
		 * @param configObj Config Object to hold - 1. TXN Header form and 2.Action button maps based on Status
		 */
		
		renderWindow : function (containerId, formObj, configObj)
		{
			
			var winNewHeight=null;
			var winNewWidth;
			
			/*
			 * var widContainer = iportal.workspace.metadata.getCurrentWorkspace().getWidgetContainer(); var isWidExists =
			 * false;
			 * 
			 * for(var i=0;i<widContainer.childWidgets.length;i++){
			 * 
			 * if(widContainer.childWidgets[i].WIDGET_ID === widgetId){
			 * 
			 * isWidExists = true; } }
			 */

			var widget;
			var ownerPanel = null;
			var cApp;
			var index;

			
			var rb = CRB.getFWBundle();
			var that = cbx.formcontainer.manager;
			var winTitle = null;
			var formContainerMD;
			if (that.formContainerMetadataObj[containerId][containerId])
			{
				formContainerMD = that.formContainerMetadataObj[containerId][containerId];
				formContainerMD['IS_MULTIPLE_FORM_CONTAINER']=configObj.IS_MULTIPLE_FORM_CONTAINER;
				if (!cbx.isEmpty(configObj.WINHEIGHT) || !cbx.isEmpty(formContainerMD.WINHEIGHT))
				{
				winNewHeight = configObj.WINHEIGHT || formContainerMD.WINHEIGHT;
				}
				if (winNewHeight=== null)
				{
					winNewHeight='auto';
				}
				winNewWidth = configObj.WINWIDTH  || formContainerMD.WINWIDTH;
			} else
			{
				// Error window to show that no Container has been configure in
				// the DB
				var errorWin = new iportal.Dialog({
					dialogType : 'ERROR',
					title : rb.ERR_ERROR_CODE,
					message : rb.ERR_SORRY_MSG_FOR_FAIL,
					listeners : {
						'close' : function ()
						{
							errorWin.close();
						}
					}

				});
				errorWin.show();
				return;
			}

			var renderType = configObj.formConRenderType || formContainerMD.CONTEXT_FORM_RENDER;			

			if (renderType === "APP")
			{
				
				var lId = iportal.workspace.metadata.getCurrentLayoutId();
				var layoutObj = iportal.workspace.metadata.getCurrentLayout();
				var contextAppId = iportal.workspace.metadata.getContextApp(lId);
				widgetId = configObj.appWidget || iportal.workspace.metadata.getContextApp(lId);
				if (layoutObj.find && layoutObj.find('itemId', widgetId).length > 0)
				{
					widget = layoutObj.find?layoutObj.find('itemId', widgetId)[0]:null;
				}
				/**
				 * Added for a same container mapped in different Layouts Scenario : If a config.appWidget exists in one
				 * layout, but not in the other
				 */
				else if (layoutObj.find && layoutObj.find('itemId', contextAppId).length > 0)
				{
					widget = layoutObj.find('itemId', contextAppId)[0];
					
				}
				if (widget)
				{
					ownerPanel = widget.find('name', 'content-panel').length > 0
								? widget.find('name', 'content-panel')[0].ownerCt : widget.find('itemId', IMM
											.getDefaultView(widget.itemId))[0];
				}
			}

			
			/*
			 * winTitle = (formObj.formTitle != null && formObj.formTitle != "" && formObj.formTitle!=undefined) ?
			 * formObj.formTitle : formContainerMD.WINDOW_TITLE;
			 * 
			 * 
			 */
			var containerTitle = CRB.getBundle(formContainerMD.BUNDLE_KEY)['LBL_' + formContainerMD.WINDOW_TITLE] ? 
							CRB.getBundle(formContainerMD.BUNDLE_KEY)['LBL_' + formContainerMD.WINDOW_TITLE] : formContainerMD.WINDOW_TITLE;
			var customTitle = this.getCustomTitle();
			if (!Ext.isEmpty(customTitle)) {
				this.winTitle = CRB.getBundle(formContainerMD.BUNDLE_KEY)['LBL_' + customTitle] || customTitle;
			}
			else if (!Ext.isEmpty(containerTitle))
			{
				this.winTitle = containerTitle;
			} 
			else
			{
				this.winTitle = formObj.formTitle;
			}

			cbx.formcontainer.tools.setFmId(formObj.formId); //setting the Form Id for the tools of the FormContainer.
			
			/**
			 *  Need to provide an alternate for iportal.window,which will respect all these parameters
			 * briefed below and render the window accordingly. Note : iportal.window extends Ext.window
			 */
			var cClass = CLCR.getCmp({"COMP_TYPE":"FORM_CONTAINER","LAYOUT":renderType});
			if (renderType === "WINDOW")
			{
				if(cClass){
					var containerConfig = {
							height:winNewHeight,
							tools : cbx.formcontainer.tools.getToolsMenu(formContainerMD,formObj,configObj,this.winTitle),
							formObj: formObj,
							actionBtns :cbx.formcontainer.buttonBars.getBbarMenu(formContainerMD,formObj,configObj,this.winTitle),
							title : this.winTitle,
							itemId : "wrapper-owner_"+formContainerMD.CONTAINER_ID,
							items : formObj.getFormView()
					}
					/**
					 * Setting null for customTitle 
					 * Change Log : CTMQ315F09
					 */
					this.customWinTitle = null; 
					cbx.apply(containerConfig,configObj);
					var formContainer = new cClass(containerConfig);
				}
				else{
				var formContainer = new iportal.Window({
					/**
					 * Component id has been replaced by itemId inorder to get rid of errors arising due to DOM ids
					 */
					itemId : formContainerMD.CONTAINER_ID,
					rawTitle : this.winTitle,
					height : winNewHeight,
					width : winNewWidth,
					closable : true,
					stateful : false,
					resizable : true,
					autoScroll : true,
					items : formObj.getFormView(),
					tools : cbx.formcontainer.tools.getToolsMenu(formContainerMD, formObj, configObj, this.winTitle), 
					bbar : cbx.formcontainer.buttonBars.getBbarMenu(formContainerMD, formObj, configObj, this.winTitle)
				});
				formContainer.show();
				formContainer.setHeight(winNewHeight);
				formContainer.setWidth(winNewWidth);
				formContainer.setTitle(this.winTitle);
				this.customWinTitle = null; 
				cbx.formcontainer.manager.setActiveFormContainer(formContainer);
			}
			}
			/**
			 * Need to provide an alternate for Ext.Panel,which will respect all these parameters briefed
			 * below and render the window accordingly. This here is the context - app widget concept which will render
			 * the form in the same widget.If a button inside a context App is clicked,the control checks for the
			 * handler of the button(in contextmenuhandlerregistry),where the developer is expected to pass the App Id
			 * of the context App in which the form must be rendered. example :
			 * CBXFORMCONTAINER.getWindow("CONTAINER_SELFTRANS",null,"WGT_RETAIL_IFRAME"); Here, CONTAINER_SELFTRANS is
			 * the Container Id and WGT_RETAIL_IFRAME is the App Id. The code in the after render part sizes the
			 * portal-column accordingly,i.e formContainerMD.WINHEIGHT
			 */
			else if (renderType === "APP")
			{
				if(cClass){
					var containerConfig = {
							height:winNewHeight,
							tools : cbx.formcontainer.tools.getToolsMenu(formContainerMD,formObj,configObj,this.winTitle),
							formObj: formObj,
							actionBtns :cbx.formcontainer.buttonBars.getBbarMenu(formContainerMD,formObj,configObj,this.winTitle),
							title : this.winTitle,
							itemId : "wrapper-owner_"+formContainerMD.CONTAINER_ID,
							items : formObj.getFormView()
					}
					cbx.apply(containerConfig,configObj);
					var formContainer = new cClass(containerConfig);
				}
				else{
					configObj.appWidget = widget.itemId;
					var formWrapper = new Ext.Panel(
							{
								items : formObj.getFormView(),
								height : winNewHeight,
								autoHeight:(winNewHeight==='auto')?true:false,
								autoWidth : true,
								name : 'wrapper-owner',
								title : this.winTitle,
								resizable : true,
								header : true,
								autoDestroy : true,
								cls : 'cbx-form-wrap',
								tools : cbx.formcontainer.tools.getToolsMenu(formContainerMD, formObj, configObj,
											this.winTitle),
								bbar : {
									cls : 'app_container_bbar_tbar',
									ctCls : 'app_container_bbar_tbar',
									items : cbx.formcontainer.buttonBars.getBbarMenu(formContainerMD, formObj,
												configObj, this.winTitle)
								},
								autoScroll : true,
								listeners : {
									show : function ()
									{
										this[0].el.fadeIn({
											easing : 'elasticOut',
											duration : 2
										});
									},
									scope : [ widget ],
									hide : function ()
									{
										arguments[0].el.fadeOut();
									},
									afterRender : function ()
									{

										var wgt = this[0];
										var pWid = Number(winNewWidth);
										var finalHeight = Ext.isIE ? Number(arguments[0].height) + 15
													: Number(arguments[0].height);
										inalHeight = finalHeight + 8;
										var finalWidth = Number(arguments[0].resizeW);
										wgt.height = finalHeight;
										if (wgt.find('name', 'content-panel').length > 0)
										{
											wgt.setHeight(finalHeight);
										} else
										{
											wgt.ownerCt.getEl().setHeight(finalHeight);
										}
										if (wgt.updateHeight)
										{
											wgt.updateHeight(finalHeight);
										} else
										{
											wgt.mwc.updateHeight(finalHeight);
										}
										if (wgt.updateWidth)
										{
											wgt.updateWidth(finalWidth);
										}
										wgt.doLayout();
										if (wgt.ownerCt.ownerCt.ownerCt.ownerCt.resetHeight)
										{
											wgt.ownerCt.ownerCt.ownerCt.ownerCt.resetHeight();
										} else
										{
											wgt.ownerCt.ownerCt.ownerCt.ownerCt.doLayout();
										}
										iportal.jsutil.adjustPortalColumnsWidth(wgt, pWid);
									}
								}
							});
					cbx.formcontainer.manager.setActiveFormContainer(formWrapper);
					if (configObj && configObj['TRAN_MGR_HANDLER'])
					{
						CBXTXNMGR.beginTransaction(formWrapper, configObj['TRAN_MGR_HANDLER']);
					}
					var options = {
						isCBXContainer : true,
						type : 'F'
					};
					ownerPanel.activateContainer(formWrapper, widget, options);
				}
			}
		},
		/***************************************************************************************************************
		 * This function creates the form object for the given form Id
		 * 
		 * @param formId Form ID
		 * @param fmData Form Model Data
		 */
		getFormObj : function (formId, fmData)
		{
			var that = cbx.formcontainer.manager;
			// To set the mode and model data for the form from
			// the listener handler registry
			var listenerClass = CFLR.getListener(formId);
			var formModes;
			var formModelData = {};

			if (fmData != undefined && fmData != null)
			{
				formModelData = fmData;
			}

			if (listenerClass)
			{
				var listener = new listenerClass({});

				if (listener.getFormModes)
				{
					formModes = listener.getFormModes();
				}
				if (listener.getFormModelData)
				{
					formModelData = listener.getFormModelData(formModelData);
				}

			}
			
			if(cbx.isEmpty(formModes))
			{
				// Creates the form object with the form Id obtained
				return new cbx.form.FormManager({
					formId : formId,
					modelData : formModelData
				});
	
			}else{
			
				return new cbx.form.FormManager({
					formId : formId,
					mode : formModes,
					modelData : formModelData
				});
	
			}
		},
		/***************************************************************************************************************
		 * This function retrieves that data from the Cache for a containerId if it is not available in the object
		 * formContainerMetadataObj
		 * 
		 * @param containerId Container ID
		 * @param formObj Form manager Object
		 * @param configObj Config Object to hold - 1. TXN Header form and 2.Action button maps based on Status
		 */
		getFormContainerMetadata : function (containerId, formObj, configObj/* ,widgetId */)
		{
			var that = cbx.formcontainer.manager;
			var rb = null;
			var assignFormMetadata=function(formMetadata){
					
					
					that.formContainerMetadataObj[containerId] = formMetadata;
					var confObj = {};
					var fmObj = null;
					
					// For assigning the proper resource bundle for that product
					if (formMetadata[containerId].BUNDLE_KEY != null && formMetadata[containerId].BUNDLE_KEY != "") {
						rb = CRB.getBundle(formMetadata[containerId].BUNDLE_KEY);
					}

					if (configObj != null && configObj != undefined) {
						confObj = configObj;
					}

					if (formObj != null && formObj != undefined) {
						fmObj = formObj;
					} else {
						fmObj = that.getFormObj(formMetadata[containerId].FORM_ID, confObj);
					}

					that.renderWindow(containerId, fmObj, confObj/*,widgetId*/);
			}
			var cachedFlag=false;
			var cachedMetadata=canvas.metadata.getMetaData("FORM_CONTAINER",containerId,function(metadatavalue){
				if(!cbx.isEmpty(metadatavalue)){
					
					try{
						var formMetadata=cbx.decode(metadatavalue);	
						cachedFlag=true;
						assignFormMetadata(formMetadata);
						}
						catch (e) {
							LOGGER.error('Error while fetching Form cached data', e);
							cachedFlag=false;
						}
				}
				if(!cachedFlag){
					cbx.ajax({
						params : {
							INPUT_ACTION : 'GET_FORM_CONTAINER_METADATA',
							INPUT_FUNCTION_CODE : 'VSBLTY',
							INPUT_SUB_PRODUCT : 'CUSER',
							PAGE_CODE_TYPE : 'FCDF_ACTION',
							PRODUCT_NAME : 'CUSER',
							FORM_CONTAINER_ID : containerId
						},
						success : function (result, request)
						{
							//var data = cbx.decode(result.responseText);
							var formMetadata = result.response.value.HEADER_FORM_CONTAINER_METADATA;
							assignFormMetadata(formMetadata);
							setTimeout(function(){
								try{
								canvas.metadata.storeMetaData("FORM_CONTAINER",{id:containerId,value:formMetadata,serverdatetime:result.HEADER_VALUE.TXN_PROCESS_DATE_TIME});
								}
								catch (e) {
									LOGGER.error('Error while storing Form Container data cache', e);
								}
							},100);

				},
				failure : function (result, request)
				{
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
				}
			},this);

		},
		setActiveFormContainer : function (obj)
		{
			containerObj = obj;
		},
		getActiveFormContainer : function ()
		{
			return containerObj;
		},
		/** Setter and Getter methods to set and get the value for customWinTitle variable */
		setCustomTitle : function(title) {
			if (!title) {
				title = "";
			}
			this.customWinTitle = title;
		},
		getCustomTitle : function() {
			return this.customWinTitle;
		},
		exit : function(config){
			if(config.formConRenderType =="APP"){
				iportal.jsutil.loadContextApp(config);
				return;
			}
			else if(this.getActiveFormContainer()){
				this.getActiveFormContainer().close();
			}
		},
		setContainerTitle : function (title)
		{
			var actContainer = this.getActiveFormContainer();
			if (!cbx.isEmpty(actContainer) && actContainer.setTitle)
			{
				actContainer.setTitle(title);
				CBXFORMCONTAINER.winTitle = title;
		}

	}
	}
}();

CBXFORMCONTAINER = cbx.formcontainer.manager;
