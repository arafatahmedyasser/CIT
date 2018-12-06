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
/**
 * Filter class for Data type rate. This class is very similar to the
 * NumericFilter.js class which comes as plugin from extjs.
 * 
 */
Ext.namespace('Ext.ux.grid.filter');
Ext.ux.grid.filter.RateFilter = Ext.extend(Ext.ux.grid.filter.Filter, {

	/**
	 * @cfg {Object} fieldCls The Class to use to construct each field item
	 *      within this menu Defaults to:
	 * 
	 * <pre>
	 * fieldCls: Ext.form.NumberField
	 * </pre>
	 */
	fieldCls : Ext.form.NumberField,
	/**
	 * @cfg {Object} fieldCfg The default configuration options for any field
	 *      item unless superseded by the <code>{@link #fields}</code>
	 *      configuration. Defaults to:
	 * 
	 * <pre>
	 * fieldCfg: {
	 * }
	 * </pre>
	 * 
	 * Example usage:
	 * 
	 * <pre><code>
	 * 	fieldCfg : {
	 * 	width: 150,
	 * 	},
	 * 
	 * </code></pre>
	 */
	/**
	 * @cfg {Object} fields The field items may be configured individually
	 *      Defaults to <tt>undefined</tt>. Example usage:
	 * 
	 * <pre><code>
	 * 	fields : {
	 * 	gt: { // override fieldCfg options
	 * 	    width: 200,
	 * 	    fieldCls: Ext.ux.form.CustomNumberField // to override default {@link #fieldCls}
	 * 	}
	 * 	},
	 * </code></pre>
	 */
	/**
	 * @cfg {Object} iconCls The iconCls to be applied to each comparator field
	 *      item. Defaults to:
	 * 
	 * <pre>
	 * 	iconCls : {
	 * 	gt : 'ux-rangemenu-gt',
	 * 	lt : 'ux-rangemenu-lt',
	 * 	eq : 'ux-rangemenu-eq'
	 * 	}
	 * </pre>
	 */
	iconCls : {
		gt : 'ux-rangemenu-gt',
		lt : 'ux-rangemenu-lt',
		eq : 'ux-rangemenu-eq'
	},

	/**
	 * @cfg {Object} menuItemCfgs Default configuration options for each menu
	 *      item Defaults to:
	 * 
	 * <pre>
	 * 	menuItemCfgs : {
	 * 	emptyText: 'Enter Filter Text...',
	 * 	selectOnFocus: true,
	 * 	width: 125
	 * 	}
	 * </pre>
	 */
	menuItemCfgs : {
		emptyText : CRB.getFWBundle()['LBL_FILTER_TEXT'],
		selectOnFocus : true,
		width : 125,
		decimalPrecision : iportal.systempreferences.getRateMaxPrecision()
	},

	/**
	 * @cfg {Array} menuItems The items to be shown in this menu. Items are
	 *      added to the menu according to their position within this array.
	 *      Defaults to:
	 * 
	 * <pre>
	 * menuItems: [ 'lt', 'gt', '-', 'eq' ]
	 * </pre>
	 */
	menuItems : [ 'lt', 'gt', '-', 'eq' ],

	/**
	 * @private Template method that is to initialize the filter and install
	 *          required menu items.
	 */
	init : function(config) {
		// if a menu already existed, do clean up first
		if (this.menu) {
			this.menu.destroy();
		}
		this.menu = new Ext.ux.menu.RangeMenu(Ext.apply(config, {
			// pass along filter configs to the menu
			fieldCfg : this.fieldCfg || {},
			fieldCls : this.fieldCls,
			fields : this.fields || {},
			iconCls : this.iconCls,
			menuItemCfgs : this.menuItemCfgs,
			menuItems : this.menuItems,
			updateBuffer : this.updateBuffer
		}));
		// relay the event fired by the menu
		this.menu.on('update', this.fireUpdate, this);
	},

	/**
	 * @private Template method that is to get and return the value of the
	 *          filter.
	 * @return {String} The value of this filter
	 */
	getValue : function() {

		LOGGER.info("root value:" + Ext.encode(this.menu.getValue()));
		return this.menu.getValue();
	},

	/**
	 * @private Template method that is to set the value of the filter.
	 * @param {Object}
	 *            value The value to set the filter
	 */
	setValue : function(value) {
		this.menu.setValue(value);
	},

	/**
	 * @private Template method that is to return <tt>true</tt> if the filter
	 *          has enough configuration information to be activated.
	 * @return {Boolean}
	 */
	isActivatable : function() {
		var values = this.getValue();
		for (key in values) {
			if (values[key] !== undefined) {
				return true;
			}
		}
		return false;
	},

	/**
	 * @private Template method that is to get and return serialized filter data
	 *          for transmission to the server.
	 * @return {Object/Array} An object or collection of objects containing key
	 *         value pairs representing the current configuration of the filter.
	 */
	getSerialArgs : function() {
		var key, args = [], values = this.menu.getValue();
		for (key in values) {
			args.push({
				type : 'rate',
				comparison : key,
				value : values[key]
			});
		}
		return args;
	},

	/**
	 * Template method that is to validate the provided Ext.data.Record against
	 * the filters configuration.
	 * 
	 * @param {Ext.data.Record}
	 *            record The record to validate
	 * @return {Boolean} true if the record is valid within the bounds of the
	 *         filter, false otherwise.
	 */
	validateRecord : function(record) {
		var val = record.get(this.dataIndex), values = this.getValue();
		if (values.eq !== undefined && val != values.eq) {
			return false;
		}
		if (values.lt !== undefined && val >= values.lt) {
			return false;
		}
		if (values.gt !== undefined && val <= values.gt) {
			return false;
		}
		return true;
	}
});