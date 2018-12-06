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
cbx.ns("cbx.core");
	cbx.core.Apps =  Class(cbx.Observable,{
	/* Config contains the element id and other required parameters.
	* It calls the appcontainer component class.
	*/
	constructor: function(config){	
		cbx.core.extend(this, config);
		this.initialConfig = config;
		if(cbx.isEmpty(this.widgetConfig.WIDGET_ID)){
			LOGGER.error("Incorrect metatdata..The Widget Id cannot be null/Empty");
			return;
		}
		else{
			this.requestMetadata();
		}
	},
	/*
	* Requests for the metadata of the widget/ app.
	*/
	requestMetadata: function(){
		if(!cbx.isEmpty(this.widgetConfig.CONTAINER_FLAG) && this.widgetConfig.CONTAINER_FLAG =="Y"){
			cbx.core.multiapp.model.getMultiAppMetadata(this.widgetConfig.WIDGET_ID, 1, this.processApp, this);
		}
		else{
			cbx.core.app.model.getAppMetadata(this.widgetConfig.WIDGET_ID, 1, this.processApp, this);	
		}
	},
	/**
	 * 1.Request the configured Javascript for the App - If any 
	 * 2.Process the app based on the type(Singular/Multi Widget)
	 * @param requestString -> If singuar,it is expected to request the 
	 * corresponding View's javascript otherwise,it will download the 
	 * multi widget's Scripts
	 * 
	 */
	processApp : function(widgetMetadata){
		var containerInd = this.widgetConfig.CONTAINER_FLAG && this.widgetConfig.CONTAINER_FLAG=="Y"?true:false;
		var requestStr = containerInd?"MULTIAPP_"+widgetMetadata.md.MULTI_WIDGET_MD.LAYOUT+"_VIEW":widgetMetadata.md.VIEW_MD.FLD_VIEW_TYPE+"_VIEW"; 
		var that = this;
		CBXDOWNLOADMGR.requestScripts(cbx.downloadProvider.getConstant(requestStr),function(){
			var md =  containerInd?widgetMetadata.md:widgetMetadata.md.VIEW_MD;
			/**
			 * The flag which indicates if the portlet should be created for this configuration.
			 * If it is an unsupported View(singular widget),it will not process further.
			 */
			var isComponentAvailable = true;
			if(!containerInd){
				var viewType = widgetMetadata.md.VIEW_MD.FLD_VIEW_TYPE;
				if(canvas.view.appRegisterMap && canvas.view.appRegisterMap[that.widgetConfig.WIDGET_ID]){
					var config = {
						
					}
					try{
						that.customView = canvas.view.appRegisterMap[that.widgetConfig.WIDGET_ID](config);
					}
					catch(e){
						LOGGER.info("An exception has been caught",e);
					}
					
				}
				
				var cClass = CLCR.getCmp({"COMP_TYPE":viewType});
				if(!cClass){
					isComponentAvailable = false;
					LOGGER.error("unsupported VIEW_TYPE...Kindly register for ",viewType);
				}
			}
			that.initializePortlet(md,isComponentAvailable);
			
		});
	}, 
	/**
	 * This API is responsible for creating the portlet for the App.
	 * It takes in the metadata of the app.
	 * Instantiates the Portlet..
	 * Forms the Child Config for the current child and sends an append request
	 * to the widget container
	 */
	initializePortlet : function(md,isComponentAvailable){
		var config = {
				widgetConfig: this.widgetConfig,
				viewConf: this,
				"workspaceID": this.workspaceID,
				'widgetMD': md
		};
		var portletClass = CLCR.getCmp({"COMP_TYPE":"PORTLET"});
		this.portlet = new portletClass(config);
		var childConf={};
		if(!cbx.isEmpty(this.widgetConfig.BLOCK_POSITION) && isComponentAvailable) {
			var childConf = {
					"PORTLET" :  this.portlet,
					"POSITION" :this.widgetConfig.POSITION,
					"BLOCK_POSITION":this.widgetConfig.BLOCK_POSITION,
					scope : this
			};
		}
		this.widgetContainer.appendChild(childConf);
	},
	/*initApp: function(widgetMetadata) {
	},*/

	getWidgetContainer: function() {
		return this.portlet.getWindowInfo();
	},
	
	/**
	 * 
	 */
	requestMultiAppContainer : function(widgetMetadata){
		var multiAppConfig = {
				"parentPortlet":this.portlet,
				"widgetMetadata":widgetMetadata
		}
		new cbx.core.MultiAppManager(multiAppConfig);
	} ,
	
	/**
	 * 
	 * @param widgetMD
	 */
	
	requestViewMD: function(widgetMD){
		var md = widgetMD;
		var eventConf = {
				"viewType":md.FLD_VIEW_TYPE,
				"widgetId": this.widgetConfig.WIDGET_ID,
				'viewId':md.VIEW_ID
		};
		var appEvents = new canvas.core.appEventRegistry(eventConf);
		var mvConf = {
					viewId : md.VIEW_ID,
					widgetId : this.widgetConfig.WIDGET_ID,
					'appEvents':appEvents
			};
		var multiView = new cbx.lib.multiView(mvConf);
		appEvents.setMVObj(multiView);
		this.portlet.mvConf = multiView;
		var cClass = CLCR.getCmp({'COMP_TYPE':md.FLD_VIEW_TYPE});
		var headerInd = this.widgetConfig.WGT_HEADER_IND||this.widgetConfig.WIDGET_HEADER_IND;
		var viewObj;
		switch(md.FLD_VIEW_TYPE){
		case "CLASSIC_GRID":
		case "PAGING":
		case "GROUP":
		case "LIST":
		case "ADVGROUP":
		case "GROUP":
			// Checking  whether the view has any B-Bar buttons or not
				if(typeof md.FLD_BBAR_BUTTONS !== 'undefined') {
				//	Calling createBottomBar() function to create buttons for view 
					var bBarButtonsDOM = this.portlet.addBottomBarButtons(md.FLD_BBAR_BUTTONS);
				}
                if(cbx.isEmpty(this.extraParamsHandler)){
					
					this.extraParamsHandler = CWEH.getHandler(this.widgetConfig.WIDGET_ID,CWEC.EXTRA_PARAMS_HDLR);
				}
				if ( typeof headerInd != 'undefined' && headerInd =='Y') {
					// Removing the child elements of DOM 
					cbx.lib.utility.removeChildElements(this.portlet.getItem(2));
					viewObj = new cClass({
						"widgetId": this.widgetConfig.WIDGET_ID,
						"md": md,
						'workspaceId': this.workspaceID,
						'appendTO':this.portlet.getItem(2),
						'extraParams':this.extraParams,
						'extraParamsHandler':this.extraParamsHandler,
						'scope':this.scope,
						'appEvents':appEvents
						});
				}
				else {
					 //Removing the child elements of DOM 
					cbx.lib.utility.removeChildElements(this.portlet.getItem(1));
					viewObj = new cClass({
						"widgetId": this.widgetConfig.WIDGET_ID,
						"md": md,
						'workspaceId': this.workspaceID,
						'appendTO':this.portlet.getItem(1),
						'extraParams':this.extraParams,
						'extraParamsHandler':this.extraParamsHandler,
						'scope':this.scope,
						'appEvents':appEvents
					});
				}
			break;
		
		case "CHART":
				if(typeof md.FLD_BBAR_BUTTONS !== 'undefined') {
				//	Calling createBottomBar() function to create buttons for view 
					var bBarButtonsDOM = this.portlet.addBottomBarButtons(md.FLD_BBAR_BUTTONS);
				}
				if ( typeof headerInd != 'undefined' && headerInd =='Y') {
					cbx.lib.utility.removeChildElements(this.portlet.getItem(2));
					viewObj = new cClass({
						"widgetId": this.widgetConfig.WIDGET_ID,
						"md": md,
						'workspaceId': this.workspaceID,
						'appendTO':this.portlet.getItem(2),
						'extraParams':this.extraParams,
						'extraParamsHandler':this.extraParamsHandler,
						'scope':this.scope,
						'appEvents':appEvents
						});
				}
				else {
					cbx.lib.utility.removeChildElements(this.portlet.getItem(1));
					viewObj = new cClass({
						"widgetId": this.widgetConfig.WIDGET_ID,
						"md": md,
						'workspaceId': this.workspaceID,
						'appendTO':this.portlet.getItem(1),
						'extraParamsHandler':this.extraParamsHandler,
						'extraParams':this.extraParams,
						'scope':this.scope,
						'appEvents':appEvents
					});
				}
			break;	
			
		case "FORM":
			var formConfig = {
				"widgetId":this.widgetConfig.WIDGET_ID,
				"formId":md.FLD_DATA_SRC_ID,
				'appEvents':appEvents
				};
				var formViewClass = new cClass(formConfig);
				var formObj = formViewClass.renderFormView()
				//this.portlet.setViewObject(formViewClass);
				if ( typeof headerInd != 'undefined' && headerInd == 'Y') {
					// Removing the child elements of DOM 
					cbx.lib.utility.removeChildElements(this.portlet.getItem(2));
					this.portlet.getItem(2).appendChild(formObj.getFormView());
				}
				else {
					cbx.lib.utility.removeChildElements(this.portlet.getItem(1));
					this.portlet.getItem(1).appendChild(formObj.getFormView());
				}
				$.mobile.activePage.trigger('create');
				viewObj = formViewClass;
			break;
		
		case "APP":
			var groupView = new cClass({
				'md': md,
				'viewMD': md,
				'workspaceId': this.workspaceID,
				'widgetId': this.widgetConfig.WIDGET_ID,
				'extraParams':this.extraParams,
				'appEvents':appEvents
			});
			if ( typeof this.widgetConfig.WGT_HEADER_IND != 'undefined' && this.widgetConfig.WGT_HEADER_IND == 'Y') {
				// Removing the child elements of DOM 
				cbx.lib.utility.removeChildElements(this.portlet.getItem(2));
				this.portlet.getItem(2).appendChild(groupView.getGroupViewComponent());
			}
			else {
				// Removing the child elements of DOM 
				cbx.lib.utility.removeChildElements(this.portlet.getItem(1));
				this.portlet.getItem(1).appendChild(groupView.getGroupViewComponent());
				//var widgetId = $("#"+this.portlet.getItem(0).ele.id);
				//doIScroll(this.widgetConfig.WIDGET_ID,"add");
			}
			
			/**
			 * Mandiri specific..To be removed after implementation
			 */
			/*var divWidth=$(groupView.getGroupViewComponent()).width() / 100 * 100;
		    $('.x-app-icon-cls').css({'margin-left': divWidth + "px"});
			$('#app').on('pagecreat',function(){
				var lists = $('.x-app-icon-cls'); 	  	
				var duration = 500;
				$.each(lists,function(){
					$(this).animate({'marginLeft': 0 + "px"}, duration);
					duration = duration+200;
				});
			});*/
			/*var divWidth=$(groupView.getGroupViewComponent()).width() / 100 * 100;
			divWidth = divWidth+200;
		    $('.x-app-icon-cls').css({'margin-left': divWidth + "px"});*/
			$.mobile.activePage.trigger('create');
			/*setTimeout(function() {
				var lists = $('.x-app-icon-cls'); 	  	
				var duration = 500;
				$.each(lists,function(){
					$(this).animate({'marginLeft': 2 + "%"}, duration);
					duration = duration+200;
				});
			}, 500);*/
			viewObj = groupView;
			break;
		case "ADS":
			if ( typeof headerInd != 'undefined' && headerInd == 'Y') {
				 //Removing the child elements of DOM 
				cbx.lib.utility.removeChildElements(this.portlet.getItem(2));
				viewObj = new cClass({
					"widgetId": this.widgetConfig.WIDGET_ID,
					"md": md,
					'appEvents':appEvents,
					'workspaceId': this.workspaceID,
					'extraParams':this.extraParams,
					'appendTO':this.portlet.getItem(2),
					'scope':this.scope
					});
			}
			else {
				// Removing the child elements of DOM 
				cbx.lib.utility.removeChildElements(this.portlet.getItem(1));
				viewObj = new cClass({
					"widgetId": this.widgetConfig.WIDGET_ID,
					"md": md,
					'workspaceId': this.workspaceID,
					'appendTO':this.portlet.getItem(1),
					'extraParams':this.extraParams,
					'scope':this.scope,
					'appEvents':appEvents
				});
			}
			
			break;
		case "TEMPLATE":
			if ( typeof headerInd != 'undefined' && headerInd == 'Y') {
				 //Removing the child elements of DOM 
				cbx.lib.utility.removeChildElements(this.portlet.getItem(2));
				viewObj = new cClass({
					"widgetId": this.widgetConfig.WIDGET_ID,
					"md": md,
					'appEvents':appEvents,
					'workspaceId': this.workspaceID,
					'appendTO':this.portlet.getItem(2),
					'scope':this.scope
					});
			}
			else {
				// Removing the child elements of DOM 
				cbx.lib.utility.removeChildElements(this.portlet.getItem(1));
				viewObj = new cClass({
					"widgetId": this.widgetConfig.WIDGET_ID,
					"md": md,
					'workspaceId': this.workspaceID,
					'appendTO':this.portlet.getItem(1),
					'scope':this.scope,
					'appEvents':appEvents
				});
			}
			break;
			/*Starts Empty Component CTMQ215F12*/
		case "EMPTY":											
			if ( typeof headerInd != 'undefined' && headerInd == 'Y') {
				 //Removing the child elements of DOM 
				cbx.lib.utility.removeChildElements(this.portlet.getItem(2));
				viewObj = new cClass({
					"widgetId": this.widgetConfig.WIDGET_ID,
					"md": md,
					'appEvents':appEvents,
					'workspaceId': this.workspaceID,
					'appendTO':this.portlet.getItem(2),
					'scope':this.scope
					});
			}
			else {
				// Removing the child elements of DOM 
				cbx.lib.utility.removeChildElements(this.portlet.getItem(1));
				viewObj = new cClass({
					"widgetId": this.widgetConfig.WIDGET_ID,
					"md": md,
					'workspaceId': this.workspaceID,
					'appendTO':this.portlet.getItem(1),
					'scope':this.scope,
					'appEvents':appEvents
				});
			}
			break;
			/*Ends Empty Component CTMQ215F12*/
		}
		multiView.setViewObj(viewObj);
		if(this.widgetContainer.appMVRegistry)
			this.widgetContainer.appMVRegistry.registerWidget(this.widgetConfig.WIDGET_ID,this.portlet.getViewObj());
		else{
			var appMVReg = new canvas.core.communication.appMVRegistry();
			appMVReg.registerWidget(this.widgetConfig.WIDGET_ID,this.portlet.getViewObj());
		}
	}
});
	
