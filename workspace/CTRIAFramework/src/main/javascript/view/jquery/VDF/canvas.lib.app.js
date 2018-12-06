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
 
cbx.ns("canvas.lib");
/**
 * 
 */
canvas.lib.app = Class(cbx.Observable, {
	/**
	 * Config contains the element id and other required parameters. It calls
	 * the appcontainer component class.
	 */
	constructor : function(config) {
		cbx.core.extend(this, config);
		this.initialConfig = config;
		if (this.WIDGET_ID == null) {
			LOGGER.error("No WIDGET_ID is configured for the canvas.lib.app. Check the instance config object.");
			return;
		}
		canvas.lib.app.$super.call(this);
		this.requestMd();
	},
	
	/**
	 * Requests for the metadata of the widget/ app.
	 */
	requestMd : function() {
		if (this.CONTAINER_FLAG === 'Y') {
			cbx.core.app.model.getMultiWidMetadata(this.WIDGET_ID, 1, this.initMultiWidgetManager, this);
		} else {
			cbx.core.app.model.getAppMetadata(this.WIDGET_ID, 1, this.initApp, this, true);
		}
	},
	
	/**
	 * 
	 */
	initMultiWidgetManager : function(md) {
		this.initializeEvents();
		var config = {
			md : md,
			viewConf : this,
			rb : CRB.getBundle(md.md.MULTI_WIDGET_MD.WIDGET_BUNDLE_KEY)
		};
		cbx.core.extend(config, this.initialConfig);
		this.multiWidgetManager = new canvas.core.multiAppManager(config);
		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.INIT_APP);
		if (cbx.core.isFunction(fn)) {
			fn.apply(this.multiWidgetManager.getMultiWidgetContainer(), [this.multiWidgetManager.getMultiWidgetContainer()]);
		} 
	},
	
	/**
	 * Initializes the component with the metadata and config.
	 */
	initApp : function(md) {
		// Check if the app is a singular of a multi widget
		// container.
		var config = {
			md : md,
			viewConf : this,
			rb : CRB.getBundle(md.md.VIEW_MD.FLD_BUNDLE_KEY)
		};
		cbx.core.extend(config, this.initialConfig);
		
		var cClass = CLCR.getCmp({
			'COMP_TYPE' : 'APP',
			'VIEW_TYPE' : md.getViewType()
		});
		if (md.getViewType() === 'FORM') {
			this.initializeFormLifeCycle();
		} else {
			this.initializeEvents();
		}
		
		if (cClass) {
			this.renderer = new cClass(config);			
			this.renderer.on('destroy', this.handleDestroy, this);
			if (this.callback) {
				this.callback.apply(this.layoutScope, [ this.renderer ]);
			}
			var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.INIT_APP);
			if (cbx.core.isFunction(fn)) {
				fn.apply(this, [this]);
			}
		}
	},
	
	/**
	 * 
	 */
	multiWidgetManager:function(){
		return (this.multiWidgetManager || '');
	},
	
	/**
	 * 
	 */
	initializeFormLifeCycle : function() {
		this.isFormView = true;
		var cClass = CLCR.getCmp({
			'COMP_TYPE' : 'LISTENER',
			'WIDGET_ID' : this.WIDGET_ID
		});
		if (cClass) {
			var config = {
					fm : this
			};
			this.listener = new cClass(config);
		}
		if (this.listener) {
			this.initializeFormEvents();
		}
	},
	
	/**
	 * 
	 */
	initializeFormEvents : function() {
		this.registerListener(CWEC.FORM_LOADED, function() {
			this.listener.raiseEvent(this.WIDGET_ID, CWEC.FORM_LOADED);
		}, this);

		this.registerListener(CWEC.CBX_CHANGE, function(itemId, value) {
			this.listener.raiseEvent(itemId, CWEC.CBX_CHANGE, value);
		}, this);

		this.registerListener(CWEC.CBX_CLICK, function(itemId) {
			this.listener.raiseEvent(itemId, CWEC.CBX_CLICK);
		}, this);
	},
	
	/**
	 * 
	 */
	handleDestroy: function(){
			var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.DESTROY_APP);
			if (cbx.core.isFunction(fn)) {
				fn.apply(this, []);
			}
			this.destroy();
	},
	
	/**
	 * 
	 */
	initializeEvents : function() {
		this.registerListener(CWEC.CELL_CLICK, this.cellClickHandler, this);
		this.registerListener(CWEC.SELECTION_CHANGE, this.selectionChangeHandler, this);
		this.registerListener(CWEC.DRILL_DOWN, this.drillDownClickHandler, this);
		this.registerListener(CWEC.CELL_ACTION, this.cellActionClickHandler, this);
		this.registerListener(CWEC.CONTEXT_CLICK, this.contextClickHandler, this);
		this.registerListener(CWEC.EXTRA_PARAMS_HDLR, this.extraParamsHandler, this);
		this.registerListener(CWEC.GET_BUNDLE, this.getBundle, this);
		this.registerListener(CWEC.CELL_DATA_CHANGE, this.cellDataChangeHandler, this);
		this.registerListener(CWEC.FORM_MODE, this.getFormMode, this);
		this.registerListener(CWEC.CHILD_ACTIVATE, this.handleActivate, this);
		this.registerListener(CWEC.CHILD_DEACTIVATE, this.handleDeactivate, this);
		this.registerListener(CWEC.AFTER_TEMPLATE_LOAD, this.templateLoadHandler, this);
		this.registerListener(CWEC.DATA_LOADED, this.handleDataLoaded, this);
	},
	
	/**
	 * 
	 */
	cellClickHandler : function() {
		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.CELL_CLICK);
		if (cbx.core.isFunction(fn)) {
			fn.apply(this, arguments);
		}
	},
	selectionChangeHandler : function() {
		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.SELECTION_CHANGE);
		if (cbx.core.isFunction(fn)) {
			fn.apply(this, arguments);
		}
	},
	
	/**
	 * 
	 */
	drillDownClickHandler : function() {
		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.DRILL_DOWN);
		if (cbx.core.isFunction(fn)) {
			fn.apply(this, arguments);
		}
	},
	/**
	 * 
	 */
	templateLoadHandler : function() {
		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.AFTER_TEMPLATE_LOAD);
		if (cbx.core.isFunction(fn)) {
			fn.apply(this, arguments);
		}
	},
	/**
	 * 
	 */
	cellActionClickHandler : function() {
		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.CELL_ACTION);
		if (cbx.core.isFunction(fn)) {
			fn.apply(this, arguments);
		}
	},
	/**
	 * 
	 */
	clearElement: function() {
		if (this.renderer && this.renderer.clearElement) {
			this.renderer.clearElement();
		}
	},
	
	/**
	 * 
	 */
	contextClickHandler : function() {
		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.CONTEXT_CLICK);
		if (cbx.core.isFunction(fn)) {
			fn.apply(this, arguments);
		}
	},
	
	/**
	 * 
	 */
	extraParamsHandler : function() {
		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.EXTRA_PARAMS_HDLR);
		if (cbx.core.isFunction(fn)) {
			return fn.apply(this, arguments);
		}
	},
	/**
	 * 
	 */
	handleDataLoaded : function() {
	    var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.DATA_LOADED);
	    if (cbx.core.isFunction(fn)) {
	    	return fn.apply(this, arguments);
	    }
	},
	
	/**
	 * 
	 */
	cellDataChangeHandler : function() {
		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.CELL_DATA_CHANGE);
		if (cbx.core.isFunction(fn)) {
			fn.apply(this, arguments);
		}
	},
	
	/**
	 * 
	 */
	getBundle : function() {
		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.GET_BUNDLE);
		if (cbx.core.isFunction(fn)) {
			return fn.apply(this, arguments);
		}
	},
	
	/**
	 * 
	 */
	getFormMode : function() {
		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.FORM_MODE);
		if (cbx.core.isFunction(fn)) {
			return fn.apply(this, arguments);
		}
	},
	
	/**
	 * 
	 */
	handleActivate : function() {
		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.CHILD_ACTIVATE);
		if (cbx.core.isFunction(fn)) {
			return fn.apply(this, arguments);
		}
	},
	
	/**
	 * 
	 */
	handleDeactivate : function() {
		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.CHILD_DEACTIVATE);
		if (cbx.core.isFunction(fn)) {
			return fn.apply(this, arguments);
		}
	},
	
	/**
	 * 
	 */
	reload : function() {
		if (this.renderer.reloadData) {
			this.renderer.reloadData();
		}
	},
	/**
	 * 
	 */
	rebuildPagination :function() {
		if (this.renderer && this.renderer.rebuildPagination) {
			this.renderer.rebuildPagination();
		}
	},
	
	/**
	 * 
	 */
	setPagingCount:function(count){
		if (this.renderer && this.renderer.setPagingCount) {
			this.renderer.setPagingCount(count);
		}	
	},
	
	/**
	 * 
	 */
	updateParams:function(params){
		if (this.renderer && this.renderer.updateParams) {
			this.renderer.updateParams(params);
		}	
	},
	
	/**
	 * 
	 */
	deleteParams:function(params){
		if (this.renderer && this.renderer.deleteParams) {
			this.renderer.deleteParams(params);
		}	
	},
	/**
	 * 
	 */
	sortUpdate : function(params) {
		if (this.renderer.sortUpdate && (!cbx.isEmpty(params) && cbx.isObject(params))) {
			this.renderer.sortUpdate(params);
		}
	},
	
	/**
	 * 
	 */
	addFilter: function(params) {
		if (this.renderer.addFilter && (!cbx.isEmpty(params) && cbx.isArray(params))) {
			this.renderer.addFilter(params);
		}
	},
	
	/**
	 * 
	 */
	deleteFilter :function() {
		if (this.renderer && this.renderer.deleteFilter) {
			this.renderer.deleteFilter();
		}
	},
	
	/**
	 * 
	 */
	getModel : function() {
		return this.renderer.getModel();
	},
	
	/**
	 * 
	 */
	setModel : function(model) {
		return this.renderer.setModel(model);
	},
	
	/**
	 * 
	 */
	setValue : function(itemId, value) {
		this.renderer.setValue(itemId, value);
	},
	
	/**
	 * 
	 */
	getItem : function(itemId) {
		return this.renderer.findField(itemId);
	},
	
	/**
	 * 
	 */
	updateComboRawStore : function(itemId, labelArr, valueArr) {
		this.renderer.updateComboRawStore(itemId, labelArr, valueArr);
	},
	
	/**
	 * 
	 */
	markInvalid: function(itemId, errMsg){
		this.renderer.markInvalid(itemId, errMsg);
	},
	
	/**
	 * 
	 */
	clearInvalid: function(itemId, errMsg){
		this.renderer.clearInvalid(itemId);
	},
	
	/**
	 * 
	 */
	setFocus : function(itemId) {
		this.renderer.setFocus(itemId);
	},	
	
	/**
	 * 
	 */
	getSelections: function() {
		if (this.renderer && this.renderer.getSelections) {
			return this.renderer.getSelections();
		}
	},
	/**
	 * 
	 */
	getExactSelections: function() {
		if (this.renderer && this.renderer.getExactSelections) {
			return this.renderer.getExactSelections();
		}
	},
	
	/**
	 * 
	 */
	addRow:function(params) {
		if (this.renderer && this.renderer.addRow) {
			this.renderer.addRow(params);
		}
	},
	/**
	 * 
	 */
	appendRow:function(params) {
		if (this.renderer && this.renderer.appendRow) {
			this.renderer.appendRow(params);
		}
	},
	
	/**
	 * 
	 */
	deleteRow:function() {
		if (this.renderer && this.renderer.deleteRow) {
			this.renderer.deleteRow();
		}
	},
	
	/**
	 * 
	 */
	deleteAppendedRow:function() {
		if (this.renderer && this.renderer.deleteAppendedRow) {
			this.renderer.deleteAppendedRow();
		}
	},
	/**
	 * 
	 */
	setVisibleFields : function(itemId,flag) {
		this.renderer.setVisibleFields(itemId,flag);
	},
	
	/**
	 * 
	 */
	getRecords:function() {
		if (this.renderer && this.renderer.getRecords) {
			return this.renderer.getRecords();
		}
	},
	
	/**
	 * 
	 */
	setColumnData:function(record,modifyClm,colId,alterRec,type) {
		if (this.renderer && this.renderer.setColumnData) {
			this.renderer.setColumnData(record,modifyClm,colId,alterRec,type);
		}
	},
	addClass:function(record,modifyClm,className) {
		if (this.renderer && this.renderer.addClass) {
			this.renderer.addClass(record,modifyClm,className);
		}
	},
	removeClass:function(record,modifyClm,className) {
		if (this.renderer && this.renderer.removeClass) {
			this.renderer.removeClass(record,modifyClm,className);
		}
	},
	/**
	 * 
	 */
	removeEntireSelectedData:function() {
		if (this.renderer && this.renderer.removeEntireSelectedData) {
			return this.renderer.removeEntireSelectedData();
		}
	}
});