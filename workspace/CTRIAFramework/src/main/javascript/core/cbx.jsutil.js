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
cbx.ns("cbx");
cbx.jsutil = function (){
	return ({
		/**
		 * Getting the bundle key reference ,which will be used by cbx
		 * formcomponents to get the properties.
		 */
		getBundleKey : function (item){
			var bundleKey=item.bundleKey;
			if (cbx.isEmpty(item.bundleKey)) {
				var parent = null;
				if(item && item.findParentByType){
					parent = item.findParentByType('cbx-formpanel');
				}
				if (parent != null) {
					if (parent.bundleKey != null && parent.bundleKey != "") {
						bundleKey = parent.bundleKey;
					} 
					else {
						bundleKey = CRB.getFWBundleKey();
					}
				} 
				else {
					bundleKey = CRB.getFWBundleKey();
				}
			}
			return bundleKey;
		},
		/**
		 * Intended to convert the date value to preferred user format.
		 */
		convertDateValueToUserPreferedFmt : function (dateVal){
			var __val = this.convertStringToDateObject(dateVal);
			if (__val != "Invalid Date") {
				if (cbx.isDate(__val)) {
					return __val.format(canvas.datePreferences.getDateFormat());
				}
			} 
			else {
				__val = "error";
			}
			return __val;
		},
		/**
		 * Expected to receive the date in form of string and converting to
		 * appropriate date format.
		 */
		convertStringToDateObject : function (stdat){
			if (!cbx.isEmpty(stdat) && typeof (stdat) == 'string') {
				var vals = stdat.split("/");
				var xdate = null;
				var monthfield = vals[1];
				var dayfield = vals[0];
				var yearfield = vals[2];
				xdate = new Date(yearfield, monthfield - 1, dayfield);
				if ((xdate.getMonth() + 1 != monthfield) || (xdate.getDate() != dayfield)
							|| (xdate.getFullYear() != yearfield)) {
					return "Invalid Date";
				} 
				else {
					xdate = new Date();
					var intvals = [ Number(vals[0]), Number(vals[1]), Number(vals[2]) ];
					xdate.setFullYear(intvals[2], intvals[1] - 1, intvals[0]);
					return xdate;
				}
			} 
			else{
				return stdat;
			}
		},
		/**
		 * Method used by CBXForomComponent's Widget component for instantiating
		 * a VDF based widget inside a Form. This method is intended to take
		 * care of collecting all the required config params needed by VDF to
		 * launch a widget. The method also expected to map the
		 * extraParamHandler provided by the developer with in the Widget JS
		 * class within the form component's Widget Wrapper class so that that
		 * another additional pointcut can be provided to the form developer to
		 * add/modify the params that widget will send to data fetch request.
		 */
		initiateWidgetForForm : function (config){
			var widgetId = config.WIDGET_ID;
			var widget = null;
			var rb = null;
			var label = null;
			var isClosed = false;
			if (config != null && config.isClosed === true) {
				isClosed = true;
			}
			if (!isClosed) {
				widget = canvas.view.appRegisterMap && canvas.view.appRegisterMap[widgetId] ? canvas.view.appRegisterMap[widgetId](config) : null ;
				if(!widget){
					widget = iportal.listview.listviewrenderermap.getWidget(config);
				}
				iportal.workspace.metadata.getCurrentWorkspace().getWidgetContainer().appMVRegistry.registerWidget(widgetId,widget.mv);

				if (config.isParentPortlet != null) {
					widget.mv.isParentPortlet = config.isParentPortlet;
				}
				if (config.isLoadingToolsInside != null) {
					widget.mv.isLoadingToolsInside = config.isLoadingToolsInside;
				}
				/*
				 * if (config.extraParamsHandler != null) {
				 * widget.mv.extraParamsHandler = config.extraParamsHandler; }
				 */
				/*
				 * Adding the extraParamsHandle in the wrapper's queue.
				 * */
				if (widget.mv.extraParamsHandler != null) {
					config.containerPanel.addHandler(widget.mv.extraParamsHandler);
				}
				widget.mv.extraParamsHandler = config.containerPanel.extraParamsHandler;
				widget.mv.on('dataModified',function(records){
					config.containerPanel.dataModified(records,widgetId);
				});
				
				widget.mv.on('cellclick',function(colId,colVal,record){
					config.containerPanel.cellclick(colId,colVal,record,widgetId);
				});
				
				widget.mv.on('rowclick',function(records){
					config.containerPanel.selectedRecords(records,widgetId);
				});
				widget.mv.on('cellsingleclick',function(colId,colVal,record){ 
					//config.containerPanel.handleClick(record,widgetId);
					config.containerPanel.handleClick(colId,colVal,record,widgetId);			
				});
				
				if(!Ext.isEmpty(widget.mv.loadHandler)){
					widget.mv.loadHandler = widget.mv.loadHandler.createSequence(
						function(){
							return config.containerPanel.loadHandler.apply(config.containerPanel);
					}, this);
				}
				else{
					widget.mv.loadHandler =function() {
	                		return config.containerPanel.loadHandler.apply(config.containerPanel);
					};
				}
				
				
				/**
				 * Code to update and provide parents height to the Widget, In
				 * case there is only one widget to be loaded
				 */
				if (config != null && config.height != null) {
					widget.setParentHeight(config.height);
				}
				if (!cbx.isEmpty(widget)) {
					/**
					 * In case of singular widget loading from the
					 * MultiViewModel rather an new AJAX call
					 */
					if (!widget.isContainer) {
						if (widget.mv.mvh != null) {
							if (config.isParentPortlet != null) {
								widget.mv.mvh.mvConf.isParentPortlet = config.isParentPortlet;
							}
							if (config.isLoadingToolsInside != null) {
								widget.mv.mvh.mvConf.isLoadingToolsInside = config.isLoadingToolsInside;
							}
							if (widget.mv.mvh.getSelectedPanel() != null) {
								widget.mv.mvh.getSelectedPanel().draggable = false;
								widget.mv.mvh.getSelectedPanel().setTitle(widget.mv.mvh.getSystemViewTitle());
							} else {
								widget.mv.mvh.items.itemAt(0).draggable = false;
								widget.mv.mvh.items.itemAt(0).setTitle(widget.mv.mvh.getSystemViewTitle());
							}
							widget.mv.add(widget.mv.mvh);
							widget.mv.doLayout();
						}
					}
				}
			}
			return widget;
		},
		/**
		 * 
		 */
		getWidgetheight : function (rowCount){
			var panelHeader = 26;
			var scrollHeight = 0;
			var gHeaderHeight = iportal.preferences.getGridHeaderHeight();
			var gRowHeight = iportal.preferences.getGridCellHeight();
			rowCount = rowCount == null || rowCount == '' ? 10 : rowCount;
			var totalHeight = (rowCount * gRowHeight) + gHeaderHeight + panelHeader + scrollHeight;
			return totalHeight;
		},
		
		/**
		 * 
		 */
		getTextAreaHeight:function(rowCount){
			var lineHeight = iportal.preferences.getTextAreaRowHeight();
			var tHeight=((rowCount*lineHeight));
			return (tHeight+2);
		},
		/**
		 * Method to set the height of the panels of the itemselectors.
		 * Input:Maximum number of lines as parameter.
		 * Output:return the total height
		 * */
		getItemSelectorFieldSetHeight:function(rowCount){
			var headerheight=17;
			var rowHeight=iportal.preferences.getTextAreaRowHeight();
			var totalHeight=(rowCount*rowHeight);
			/**
			 * Set the total height as total height of the fieldset,added to the
			 * header height(title of the fieldset and 25(height of the title of
			 * the panel
			 */
			var titleHeight=iportal.preferences.getTitleHeight();
			return (totalHeight+titleHeight+60);
		},
		/**
		 *  The getText function will be used to return a string of the
		 *  specified width by truncating the input string if its width is greater
		 * than the input width
		 * 
		 * @param val
		 * @param width
		 * @returns
		 * @returns
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
		},
		//changes done for rendering the widget header inside the form - starts	
		/*
		 * getMDForFormWidget method will return metadata of the widget passed.
		 * This API is used for rendering header of a widget in a form
		 * */
		getMDForFormWidget : function(config,callBackHandler,that)
		{
			cbx.ajax({
				
				params : {
					INPUT_ACTION : "GET_WIDGET_MD",
					INPUT_FUNCTION_CODE : "VSBLTY",
					INPUT_SUB_PRODUCT : "CUSER",
					INPUT_PRODUCT : "CUSER",
					PAGE_CODE_TYPE : "VDF_CODE",
					PRODUCT_NAME : "CUSER",
					WIDGET_ID : config.WIDGET_ID
				},
				success : function(metadata){
					var widgetHeader = metadata.WIDGET_HEADER_IND && metadata.WIDGET_HEADER_IND ==="Y"?true:false;
					var widgetHeight = metadata.WGT_HT_IN_PIXELS && !cbx.isEmpty(metadata.WGT_HT_IN_PIXELS) ?Number(metadata.WGT_HT_IN_PIXELS):null;
					var containerFlag = metadata.CONTAINER_FLAG && !cbx.isEmpty(metadata.CONTAINER_FLAG) ?metadata.CONTAINER_FLAG:'N';
					var text = metadata.WGT_DISPLAY_NM && !cbx.isEmpty(metadata.WGT_DISPLAY_NM) ?metadata.WGT_DISPLAY_NM:'';
					var bundleKey = metadata.BUNDLE_KEY && !cbx.isEmpty(metadata.BUNDLE_KEY) ?metadata.BUNDLE_KEY:'';
					var elem = {
								WIDGET_ID : config.WIDGET_ID,
								isLoadingToolsInside : widgetHeader,
								height : widgetHeight,
								containerId : config.containerId?config.containerId:null,
								isContainer : containerFlag,
								label : text,
								extraParamsHandler :  config.extraParamsHandler?config.extraParamsHandler:null,
								extraParams:config.extraParams?config.extraParams:null,
								scope : config.scope?config.scope:null,
								containerPanel : config.containerPanel,
								bundleKey:bundleKey
						};
						if(typeof(callBackHandler)==='function') {
						callBackHandler(elem,that);
						}
					}
				});
			
		}
		//changes done for rendering the widget header inside the form - ends
	});
}();