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
cbx.ns('cbx.lib.widget');

cbx.lib.widget.widgetTools = Class(cbx.Observable,{
	
	constructor : function(argument){
		this.arg = argument;
	},
	widgetHelpHandler : function(){
		/*
		 *   implement cbx.lib.popup.js
		 */
		var widgetName = this.arg[0]
		var createHelpPopup = function(widgetName){
			var popupConf ={
					"eleType":"div",
					"id":"HElP_POPUP",
					"data-role":"popup",
					"data-theme":"d",
					"class":"popupCls"
			};
			var htmlPopup = new cbx.lib.layer(popupConf).getLayer();
			
			var scrollWrapperConfig = {
					"eleType":"div",
					"id":"wrapper"
			};
			var scrollWrapper = new cbx.lib.layer(scrollWrapperConfig).getLayer();
			
			var scrollSubWrapperConfig = {
					"eleType":"div",
					"id":"scroller"
			};
			var btnDirection = "ui-btn-right";	
			if(true == iportal.preferences.isLangDirectionRTL()){
				btnDirection = "ui-btn-left";
			}
			var scrollSubWrapper = new cbx.lib.layer(scrollSubWrapperConfig).getLayer();
			$(scrollWrapper).append(scrollSubWrapper);
			var closeBtnConf = {
					"eleType":'a',
					"href":"#",
					"data-rel":"back",
					"data-role":"button",
					"data-theme":"a",
					"data-icon":"delete",
					"data-iconpos":"notext",
					"class":btnDirection,
					"style" : {
						"display" : "block"
					}
			};
			var closeBtn = new cbx.lib.layer(closeBtnConf).getLayer();
			$(htmlPopup).prepend(closeBtn);
			$(htmlPopup).append(scrollWrapper);
			$('#app').append(htmlPopup);
			$(htmlPopup).on("popupafterclose",function(){
				$(this).find('#scroller').empty();
			});
			appendHTMLContent(widgetName);
		};
		var helpPopupExistence = function(){
			return $('#HELP_POPUP')[0]?true:false;
		};
		
		
		var appendHTMLContent = function(moduleName){
			var holderDivConfig ={
					"eleType":"div"
			};
			var htmlHolder = new cbx.lib.layer(holderDivConfig).getLayer();
			var jqmHTMHOlder = $(htmlHolder);
			var htmlPopup = $('#HElP_POPUP');
			var scrollSubWrapper = htmlPopup.find('#scroller');
			var scrollWrapper = htmlPopup.find('#wrapper');
			/*  Handled if no content available in help content */
			jqmHTMHOlder.load(moduleName,function(response, status, xhr){
				var content = jqmHTMHOlder.html();
				if(status == "error"){
					content = CRB.getFWBundleValue('NO_DATA_TO_DISP');
				}
				
				setTimeout(function(){	
					$(this).trigger('create');
				},100);
				scrollSubWrapper.append(content);
				htmlPopup.popup();
				setTimeout(function(){
					htmlPopup.popup('open');
					htmlPopup.trigger('create');
				},100);
				doIScroll(scrollWrapper[0].id,'add');
				setTimeout(function(){
					$.mobile.activePage.trigger('create');
				},100);	
			});
			$("#HElP_POPUP").on({popupbeforeposition: function () {
			        $('.ui-popup-screen').off();
			    }
			});
		};
		if(helpPopupExistence()){
			appendHTMLContent(widgetName);
		}
		else{
			createHelpPopup(widgetName);
		}
	},
	
	widgetToggleCollapseHandler : function(value){
		// Code changed as part of CBX 15.1
		// Implemented code support multi level collapsible for multi widget
		if(typeof this.arg[0] != 'undefined'){
			// Widget can be mapped to multiple layout in that case widget will be duplicates
			var parent  = $(".workspace:visible").find("#"+this.arg[0].layoutID);
			$widget = parent.find("#"+this.arg[0].widgetID+" .widget-content");
			var appContainer = $widget;
			var multiAppContainer = $("#"+this.arg[0].widgetID+"_CHILD_CONTAINER");
			if(multiAppContainer.length > 0){
				multiAppContainer.prev().trigger("click");
			} else {
				appContainer.slideToggle("slow",function(){
					doIScroll('CONTENT_DIV','refresh');
				});
			}
			var portletRef = $widget[0].parentCt;
			portletRef.setCollapsedState(value);
		}
		return true;
	},
	
	widgetRefreshHandler : function(){
		var $container = $("#"+this.arg[0].widgetID).find('.widget-content');
		var content;
		var config = {
			'appendTO' : $container,
			'md':this.arg[0].md,
			'widgetId': this.arg[0].widgetID,
			'workspaceId':this.arg[0].workspaceID,
			'appEvents':this.arg[0].appEvents
		};
		config['extraParams'] = {};
		if(!(cbx.isEmpty(this.arg[0].extraParams)))
		{
			config['extraParams'] = this.arg[0].extraParams;
		}
		else if(!(cbx.isEmpty(this.arg[0].appEvents.mvObj.viewObj.extraParams)))
		{
			config['extraParams'] = this.arg[0].appEvents.mvObj.viewObj.extraParams;
		}
		config['extraParams']['REFRESH_DATA'] = 'Y';
		if($container.html().length > 0){
			 /**
			   * Changed by Arun
             */
           $container.children().each(function(i,child){
           var root = $(child);
           if($(child).find("#CBX_FILTER_FORM").length < 1){

           $(child).remove();
           }
           });
			
		
		
		
			/*for(var i=0;i<$container.children().length;i++){
				var element =  $($container.children()[i])
				var isGlobalDateFilter = element.find('#CBX_FILTER_FORM')[0]||false;
				if(!isGlobalDateFilter){
					element.remove();
				}
			}*/
		}
		var type = this.arg[0].md.FLD_VIEW_TYPE;
		var cClass = CLCR.getCmp({"COMP_TYPE":type});
		var viewComponent;
		switch(type){
			case "CLASSIC_GRID":
			case "PAGING":
			case "LIST":
			case "CHART":
			case "ADVGROUP":
			case "GROUP":
			case "TEMPLATE":
				viewComponent = new cClass(config);
				break;
			case "FORM":
				config["formId"] = this.arg[0].md.FLD_DATA_SRC_ID;
				viewComponent = new cClass(config);
				content = viewComponent.renderFormView();
				$container.append(content.getFormView());
				$container.trigger('create');
				break;
			case "APP":
				config["viewMD"] = this.arg[0].md;
				viewComponent = new cClass(config);
				content = viewComponent.getGroupViewComponent();
				$container.append(content);
				$container.trigger('create');
				break;
		}
	},
	widgetExportHandler : function(exportType){
		$type = exportType.toUpperCase() || 'XLS';
		$baseUrl = iportal.workspace.metadata.getContextRoot()+"/ExportServiceServlet?"; 
		$md = this.arg[0].md;
		if($type === "PRINT"){
			window.open(iportal.workspace.metadata.getContextRoot()+'/CTRIAFramework/jsp/PrintTemplate.jsp'
						+ '?elementIdForConfirmationMsg='
						+ this.arg[0].widgetID + '',
						'print',
						'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,border=thin,top=20,left=110,width=750,height=650');
						  
		} else {
			var defaultInputs = {
				 // Added dinsess param
				'PAGE_CODE_TYPE' : 'VDF_CODE',
				'INPUT_FUNCTION_CODE' : $md.FUNCTION_CODE || 'VSBLTY',
				'PRODUCT_NAME' : $md.PRODUCT_CODE || 'CUSER',
				'INPUT_SUB_PRODUCT' : $md.SUB_PRODUCT_CODE || 'CUSER',
				'GROUP_HEADER_REQD' : $md.FLD_GROUP_HEADER_REQD || 'N',
				'INPUT_ACTION' : 'EXPORT_ACTION',
				'WIDGET_ID' : this.arg[0].widgetID,
				'VIEW_ID' : $md.VIEW_ID,
				'EXPORT_FORMAT': $type,
				/*  need to validate 'iportal.preferences.getEquivalentCurrency()' */
				'CURRENCY_CD' : iportal.preferences.getEquivalentCurrency(),
				'WID_BUNDLE_KEY' : $md.FLD_BUNDLE_KEY
			};
			defaultInputs[iportal.systempreferences.getCSRFKeyName()] = iportal.systempreferences.getCSRFUniqueId();
			var url =  $baseUrl + $.param(defaultInputs);
			/*
			 * iportal.openNewWindow(url);
			 * method coming from EXT(iportal.framework.util.js)
			 */
			window.open(url);
		}
	}
});
cbx.lib.widget.listeners = Class(cbx.Observable, {
	constructor: function() {
		//call the super class constructor to initialize all the required params for events
		cbx.lib.widget.listeners.$super.call(this); 
	},
	registerToolsHandler : function(key){
		if(cbx.isEmpty(this.listeners[key])){
			this.registerListener(key, this[key], this);
		}
	},
	
	expandHandler : function(){
		new cbx.lib.widget.widgetTools(arguments).widgetToggleCollapseHandler(false);
	},
	collapseHandler: function(){
		new cbx.lib.widget.widgetTools(arguments).widgetToggleCollapseHandler(true);
	},
	
	printHandler: function() {
		LOGGER.log("Print event fired");
		/*
		 *  Print Handler Bind with EXT + Form Framework(printTemplate.jsp), need to create jQuery version
		 */
		new cbx.lib.widget.widgetTools(arguments).widgetExportHandler('PRINT');
	},
	pdfHandler: function() {
		LOGGER.log("ExportTo PDF event fired");
		/* thows JAVA Error 
		 *  Needs to take care
		 */
		new cbx.lib.widget.widgetTools(arguments).widgetExportHandler('PDF');
	},
	excelHandler: function() {
		new cbx.lib.widget.widgetTools(arguments).widgetExportHandler('XLS');
	},
	
	CSVHandler: function() {
   		
		new cbx.lib.widget.widgetTools(arguments).widgetExportHandler('CSV');
	},
	helpHandler: function() {
	
		/*new cbx.lib.widget.widgetTools(arguments).widgetHelpHandler();*/
		/**
		 * Commented out as widget Id is used for help in retail
		 * 
		 */
		/*var id = IMM.getViewDefinition(arguments[0].windowid).md.VIEW_MD.VIEW_ID*/
		var id = arguments[0].windowid
		iportal.jsutil.helpHandler("m_"+id+ '_Help.htm');
		
	},
	closeHandler: function() {
		LOGGER.log("Close event fired");
	},
	refreshHandler: function() {
		new cbx.lib.widget.widgetTools(arguments).widgetRefreshHandler();
	},
	chartsHandler: function() {
		/*
		 * Yet to start CHART functionalities
		 */
	},
	jpgexportHandler: function() {
		/*
		 *  Print Handler Bind with EXT + Form Framework(printTemplate.jsp), need to create jQuery version
		 */
		LOGGER.log("ExportTo JPG event fired");
	}
});

var widgetListener = new cbx.lib.widget.listeners();
