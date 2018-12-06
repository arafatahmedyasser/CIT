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
cbx.ns('canvas.formComponent');
canvas.formComponent.editableLookUpFilter = function(config) {
	this.widgetId = config.rangeMenu.widgetId;
	this.columnVal = config.rangeMenu.columnVal;
	this.extraParams = config.rangeMenu.extraParams;
	this.emptyText = 'Select Filter Text...';
	canvas.formComponent.editableLookUpFilter.superclass.constructor.call(this,
			config);
};

Ext.extend(canvas.formComponent.editableLookUpFilter,Ext.form.TriggerField,{
	handler : function() {
		return true;
	},
	submittable : true,
	editable : false,

	/**
	 * @cfg object required, Meta data object required to render
	 *      account lookup, This object can create create with
	 *      following attributes productCode - required, to
	 *      specify PRODUCT CODE and will be passed to server
	 *      while retrieving data subProductCode - required, to
	 *      specify SUB-PRODUCT CODE and will be passed to
	 *      server while retrieving data functionCode -
	 *      required, to specify FUNCTION CODE and will be
	 *      passed to server while retrieving data cm -
	 *      required, Should be an object of
	 *      Ext.grid.ColumnModel, will be used to render lookup
	 *      grid columns recordType - required , Used to read
	 *      records returning from server Either an Array of
	 *      field definition objects as passed to
	 *      Ext.data.Record.create, or a Record constructor
	 *      created using Ext.data.Record.create.
	 *      rowdbclickhandler - required, Javascript function
	 *      which would gets executes when a row is double
	 *      clicked in the grid extraParams - Optional, If
	 *      required to pass any params as part of request
	 */
	lookupMetadata : {},
	/**
	 * possiable values are 0 and 1 0 indicates apply pre-filter
	 * 1 indicates no pre-filter required.
	 * 
	 * @type Number
	 */
	preFilterRequired : 1,
	ctCls : 'c-form-lookup',
	width : 142,
	defaultAutoCreate : {
		tag : "input",
		type : "text",
		size : "100",
		autocomplete : "off"
	},
	initComponent : function() {
		var commonbundle = CRB.getFWBundle();
		if (Ext.isEmpty(this.maxLength)) {
			this.maxLength = undefined;
		}
		if (Ext.isEmpty(this.minLength)) {
			this.minLength = undefined;
		}
		canvas.formComponent.editableLookUpFilter.superclass.initComponent
				.apply(this, arguments);

		this.labelSeparator = '';
		this.hideLabel = true;

	},
	onTriggerClick : function() {
		if (this.disabled) {
			return;
		}
		try {
			var paramStr = this.extraParams;
			var paramArr = paramStr.split(",");
			extraParamArr = {};
			var keyVal = [];
			for ( var i = 0; i < paramArr.length; i++) {
				keyVal = paramArr[i].split(":");
				extraParamArr[Ext.util.Format.trim(keyVal[0])] = Ext.util.Format
						.trim(keyVal[1]);
			}
			;
			this.addParams = extraParamArr;
			this.bundleKey = this.addParams
					&& this.addParams.resourceBundleKey
					&& CRB[this.addParams.resourceBundleKey] ? CRB[this.addParams.resourceBundleKey]
					: CRB.getFWBundleKey();
			var transmetadata = {
				resourceBundleKey : this.bundleKey,
				width : 635,
				widgetId : this.widgetId,
				reqparamshandler : function(params) {
					if (this.addParams != null) {
						Ext.apply(params, this.addParams);
					}
					return params;
				}
			};

			this.lookupMetadata = transmetadata;
			this.lookupMetadata.lookupId = this.widgetId;
			this.lookupMetadata.widgetId = this.widgetId;
			this.lookupMetadata.rowdbclickhandler = this.callBackHandler;
			this.lookupMetadata.scope = this;
			this.lookupMetadata.rangeMenu = this.rangeMenu;
			iportal.formview
					.showLookupWinForFilter(this.lookupMetadata);
		} catch (err) {
			this.rangeMenu.enableMenu = false;
			if (this.rangeMenu.lookupFilterWindow
					&& this.rangeMenu.lookupFilterWindow.isVisible) {
				try {
					this.rangeMenu.lookupFilterWindow.close();
				} catch (err) {
				}
			}
			return;
		}
	},
	/**
	 * Method handles the callback responsibilty on selecting
	 * the row from lookup grid and sets the current value of
	 * our text field, updates the model with fieldname plus
	 * current value.
	 */
	callBackHandler : function(grid, srd, rowindex) {
		if (srd && srd[this.columnVal]) {
			this.setValue(srd[this.columnVal]);
		} else {
			this.setValue('');
		}
	},
	setEnableMenu : function(flag) {
		this.rangeMenu.enableMenu = flag;
	},
	getValue : function() {
		return canvas.formComponent.editableLookUpFilter.superclass.getValue
				.call(this)
				|| "";
	},

	// Set the current value of our trigger field.
	setValue : function(text) {
		canvas.formComponent.editableLookUpFilter.superclass.setValue
				.call(this, text);
		var that = this;
		setTimeout(function() {
			that.rangeMenu.setDefaultValue(that.rangeMenu);
		}, 100);
	}
});
Ext.reg('cbx-filtereditablelookup', canvas.formComponent.editableLookUpFilter);
