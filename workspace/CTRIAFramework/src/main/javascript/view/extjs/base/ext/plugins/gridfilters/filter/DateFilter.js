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
 * @class Ext.ux.grid.filter.DateFilter
 * @extends Ext.ux.grid.filter.Filter Filter by a configurable Ext.menu.DateMenu
 *          <p>
 *          <b><u>Example Usage:</u></b>
 *          </p>
 * 
 * <pre><code>    
 var filters = new Ext.ux.grid.GridFilters({
 ...
 filters: [{
 // required configs
 type: 'date',
 dataIndex: 'dateAdded',

 // optional configs
 dateFormat: 'm/d/Y',  // default
 beforeText: 'Before', // default
 afterText: 'After',   // default
 onText: 'On',         // default
 pickerOpts: {
 // any DateMenu configs
 },

 active: true // default is false
 }]
 });
 * </code></pre>
 */
Ext.namespace('Ext.ux.grid.filter');
Ext.ux.grid.filter.DateFilter = Ext.extend(Ext.ux.grid.filter.Filter, {

	/**
	 * @cfg {String} afterText Defaults to 'After'.
	 */
	afterText : CRB.getFWBundle().LBL_AFTER,
	/**
	 * @cfg {String} beforeText Defaults to 'Before'.
	 */
	beforeText : CRB.getFWBundle().LBL_BEFORE,

	/**
	 * @cfg {String} btn2datesText Defaults to Between.
	 */
	betweenText : CRB.getFWBundle().LBL_BETWEEN,
	/**
	 * @cfg {String} lastmonthText Defaults to LastMonth.
	 */
	lastmonthText : CRB.getFWBundle().LBL_PERVIOUSMONTH,
	/**
	 * @cfg {String} lastndaysText Defaults to last_N_Days.
	 */
	last_n_daysText : CRB.getFWBundle().LBL_LAST_N_DAYS,
	/**
	 * @cfg {String} lastnmonthsText Defaults to last_N_Month.
	 */
	last_n_monthsText : CRB.getFWBundle().LBL_LAST_N_MONTHS,
	/**
	 * @cfg {Object} compareMap Map for assigning the comparison values used in
	 *      serialization.
	 */

	compareMap : {
		before : 'lt',
		after : 'gt',
		on : 'eq',
		between : 'between',
		lastmonth : 'lastmonth',
		last_n_days : 'last_n_days',
		last_n_months : 'last_n_months'

	},
	/**
	 * @cfg {String} dateFormat The date format to return when using getValue.
	 *      Defaults to 'm/d/Y'.
	 */
	dateFormat : 'm/d/Y',
	/**
	 * For getting labels from resource bundle
	 */

	crb : CRB.getFWBundle(),
	/**
	 * @cfg {Date} maxDate Allowable date as passed to the Ext.DatePicker
	 *      Defaults to undefined.
	 */
	/**
	 * @cfg {Date} minDate Allowable date as passed to the Ext.DatePicker
	 *      Defaults to undefined.
	 */
	/**
	 * @cfg {Array} menuItems The items to be shown in this menu Defaults to:
	 * 
	 * <pre>
	 * menuItems : ['before', 'after', '-', 'on'],
	 * </pre>
	 */

	menuItems : [ 'before', 'after', '-', 'on', 'between', 'lastmonth', 'last_n_days', 'last_n_months' ],

	/**
	 * @cfg {Object} menuItemCfgs Default configuration options for each menu
	 *      item
	 */
	menuItemCfgs : {
		selectOnFocus : true,
		width : 125
	},

	/**
	 * @cfg {String} onText Defaults to 'On'.
	 */
	onText : CRB.getFWBundle().LBL_ON,

	/**
	 * @cfg {String} fromdatefieldText Defaults to From.
	 */

	fromText : CRB.getFWBundle().LBL_FROM,
	/**
	 * @cfg {String} todatefieldText Defaults to To.
	 */
	toText : CRB.getFWBundle().LBL_TO,

	/**
	 * /**
	 * 
	 * @cfg {Object} pickerOpts Configuration options for the date picker
	 *      associated with each field.
	 */
	pickerOpts : {},

	/**
	 * @private Template method that is to initialize the filter and install
	 *          required menu items.
	 */
	init : function (config){
		var menuCfg, i, len, item, cfg, Cls;

		menuCfg = Ext.apply(this.pickerOpts, {
			minDate : this.minDate,
			maxDate : this.maxDate,
			format : this.dateFormat,
			listeners : {
				scope : this,
				select : this.onMenuSelect
			}
		});

		this.fields = {};
		for (i = 0, len = this.menuItems.length; i < len; i++) {
			item = this.menuItems[i];
			if (item !== '-') {
				cfg = {
					itemId : 'range-' + item,
					text : this[item + 'Text'],
					menu : new Ext.menu.DateMenu(Ext.apply(menuCfg, {
						itemId : item
					})),
					listeners : {
						scope : this,
						checkchange : this.onCheckChange
					}
				};

				if (item == 'lastmonth') {

					var that = this;
					cfglastmonth = {
						itemId : 'range-' + item,
						text : this[item + 'Text'],
						listeners : {
							scope : that,
							checkchange : that.onCheckChange 
						}

					};
				}
				;
				if (item == 'last_n_days' || item == 'last_n_months') {

					var that = this;
					n_periods = new Ext.form.NumberField({
						itemId : 'range-' + item + 'periods',
						text : this[item + 'Text'],
						emptyText : this.crb["LBL_NO_OF_PERIODS"],
						enableKeyEvents : true,
						listeners : {
							scope : this,
							keyup : this.onInputKeyUpForLastNperiods
						}
					});
					var fields = items = [ n_periods ], cfg_n_periods = {
						itemId : 'range-' + item,
						text : this[item + 'Text'],
						menu : new Ext.menu.Menu({
							items : items
						}),
						listeners : {
							scope : this,
							checkchange : this.onCheckChange
						}
					};

				}
				if (item == 'between') {

					menuFrom = new Ext.form.DateField({
						itemId : 'range-betweenfrom',
						maxvalue : new Date(),
						text : this['fromText'],
						editable : false,
						emptyText : this.crb["LBL_FROM"],
						onTriggerClick : function (e){
							if (this.menu == null) {
								this.menu = new Ext.menu.DateMenu({
									hideOnClick : true,
									focusOnSelect : false,
									allowOtherMenus : true
								});
							}
							this.constructor.prototype.onTriggerClick.apply(this, arguments);
						},

						listeners : {
							scope : this,
							checkchange : this.onCheckChange,
							select : this.onMenuSelectForBetween,
							clear : this.onMenuSelectForBetween
						}
					});
					menuTo = new Ext.form.DateField({
						itemId : 'range-betweento',
						maxvalue : new Date(),
						text : this['toText'],
						editable : false,
						emptyText : this.crb["LBL_TO"],
						onTriggerClick : function (e){
							if (this.menu == null) {
								this.menu = new Ext.menu.DateMenu({
									hideOnClick : true,
									focusOnSelect : false,
									allowOtherMenus : true
								});
							}
							this.constructor.prototype.onTriggerClick.apply(this, arguments);
						},
						listeners : {
							scope : this,
							checkchange : this.onCheckChange,
							select : this.onMenuSelectForBetween,
							clear : this.onMenuSelectForBetween
						}

					});
					var fields = items = [ menuFrom, menuTo ],

					cfgbetween = {
						itemId : 'range-' + item,
						text : this[item + 'Text'],
						menu : new Ext.menu.Menu({
							items : items
						}),
						listeners : {
							scope : this,
							checkchange : this.onCheckChange
						}
					};
				}
			        /*  including a date field for 'before', 'after' and 'on' filters
				                        to make use of the clear functionality in date picker */	
				if(item == 'before' || item == 'after' || item == 'on'){
					menuDate = new Ext.form.DateField({
						itemId : 'range-' + item,
						maxvalue : new Date(),
						text : this[item],
						editable : false,
						emptyText : item + ' date',
						onTriggerClick : function (e){
							if (this.menu == null) {
								this.menu = new Ext.menu.DateMenu({
									hideOnClick : true,
									focusOnSelect : false,
									allowOtherMenus : true
								});
							}
							this.constructor.prototype.onTriggerClick.apply(this, arguments);
						},

						listeners : {
							scope : this,
							checkchange : this.onCheckChange,
							select : this.onMenuSelectForDate,
							clear : this.onMenuSelectForDate
						}
					});
					var fields = items = [ menuDate ],

					cfgdate = {
						itemId : 'range-' + item,
						text : this[item + 'Text'],
						menu : new Ext.menu.Menu({
							items : items
						}),
						listeners : {
							scope : this,
							checkchange : this.onCheckChange
						}
					};
				
				}
				
				Cls = Ext.menu.CheckItem;

				if (item == 'between') {
					this.fields["range-betweenfrom"] = menuFrom;
					this.fields["range-betweento"] = menuTo;
					item = this.fields[item] = new Cls(cfgbetween);
				} else if (item == 'lastmonth') {
					item = this.fields['range-lastmonth'] = new Cls(cfglastmonth);
				} else if (item == 'last_n_days' || item == 'last_n_months') {
					this.fields["range-" + item + 'periods'] = n_periods;
					item = this.fields[item] = new Cls(cfg_n_periods);
				} else if (item == 'before' || item == 'after' || item == 'on') { 
					this.fields["range-" + item] = menuDate;
					item = this.fields[item] = new Cls(cfgdate); 
				}

				else {

					item = this.fields[item] = new Cls(cfg);

				}

			}

			this.menu.add(item);

		}
	},

	/**
	 * Handler method to check the checkbox of the filter menu and items of
	 * menu.
	 * first validation will happen and after that checked functionality will occur.
	 * if menus are already checked,then first unchecked the checked menu.
	 * 
	 * @param menuItem
	 */
	onCheckChange : function (menuItem){

		if (this.validate(menuItem)) {
			this.setActive(this.isActivatable());
			this.onUnCheckChange(menuItem);
		} else {
			menuItem.setChecked(false, true);
		}

	},
	/**
	 * Method to show the error message which is coming from resource bundle.
	 * 
	 * @param key
	 */
	showErrMsg : function (key){
		var that = this;
		var ewin = new iportal.Dialog({
			dialogType : 'ERROR',
			title : this.crb["LBL_ERROR"],
			message : this.crb[key],
			okHandler : function (ob){
				ewin.close();
			}

		});
		ewin.show();

	},

	/**
	 * Handler method to validate the menu if user checked the checkbox without
	 * entering the values.
	 * 
	 * @param menuItem
	 * @returns {Boolean}
	 * @returns
	 */
	validate : function (menuItem){
		/**
		 * validation for before and after when user select "before" first and "after" second. 
		 */
		/*if (this.fields['before'].checked && this.fields['after'].checked) {
			var beforeDate = this.fields["range-before"].getValue();			
			var afterDate = this.fields["range-after"].getValue();
			if (beforeDate != null && afterDate != null) {
				if (beforeDate.getTime() === afterDate.getTime()) {
					this.showErrMsg('LBL_DATE_SELECT');
					this.menu.hide(true);
					return false;
				} else if (beforeDate.getTime() < afterDate.getTime()) {
					this.showErrMsg('LBL_DATE_SELECT');
					this.menu.hide(true);
					return false;
				}
			}
		}*/
		var key;
		for (key in this.fields) {
			/**
			 * if the fromdate and todate is same and fromdate is greater than to date ,
			 * then error message will display
			 * 
			 */
			if (this.fields[key].checked) {
				if (key === "between" && menuItem.itemId.indexOf('between') > -1) {
					var fromDate = this.fields["range-betweenfrom"].getValue();
					var toDate = this.fields["range-betweento"].getValue();
					if (Ext.isDate(fromDate) && Ext.isDate(toDate)) {
						if (fromDate.getTime() === toDate.getTime() || fromDate.getTime() > toDate.getTime()) {
							this.menu.hide(true);
							this.showErrMsg('LBL_DATE_SELECT');
							this.fields["range-betweenfrom"].setValue('');
							this.fields["range-betweento"].setValue('');
							return false;
						}

					} else if (!Ext.isDate(fromDate) && !Ext.isDate(toDate)) {
						this.showErrMsg('LBL_DATE_ENTERDATE');
						return false;
					}

				} 
				/**
				 * If user don't enter number of days ,it will show error message.
				 * 
				 */
				else if (key === "last_n_days" && menuItem.itemId == this.fields[key].itemId) {
					var lastDays = this.fields["range-last_n_daysperiods"].getValue(); 
					if (this.fields["range-last_n_daysperiods"].getValue() === '') {
						this.showErrMsg('LBL_DATE_ENTER');
						return false;
					}
					
					else if (this.fields["range-last_n_daysperiods"].getValue() <=0) {
						this.showErrMsg('LBL_DATE_ENTER_NEGATIVE');
						return false;

					}
					

				} 
				 /**
				  * If user don't enter number of months,it will show error message.
				  */ 
				 else if (key === "last_n_months" && menuItem.itemId == this.fields[key].itemId) {
					var lastMonths = this.fields["range-last_n_monthsperiods"].getValue(); 	
					if (this.fields["range-last_n_monthsperiods"].getValue() === '') {
						this.showErrMsg('LBL_DATE_ENTER', menuItem);
						return false;
					}
					
					else if (this.fields["range-last_n_monthsperiods"].getValue() <=0) {
						this.showErrMsg('LBL_DATE_ENTER_NEGATIVE');
						return false;
					}
					 

				}
			}
		}
		return true;
	},
	/**
	 * @private Handler method for a checked functionality with delay for
	 *          "LastMonth" item.
	 */
	onCheckChangeWithDelay : function (menuItem){

		new Ext.util.DelayedTask(this.onCheckChange, this, [ menuItem ]).delay(500);
	},
	/**
	 * Handler method for unchecking the already "checked" checkbox when user
	 * select other date filter checkbox.
	 * 
	 * @param menuItem
	 */

	onUnCheckChange : function (menuItem){
		var key;
		for (key in this.fields) {			
			if (this.fields[key].checked===true) {
				if (menuItem && menuItem.itemId != this.fields[key].itemId){
					this.fields[key].setChecked(false, true);				
				this.clearPreviousValues(this.fields[key].itemId);	
					}
			}
		}
	},
	/**
	 * @private private method to clear all previous values
	 */ 	
	clearPreviousValues: function(itemId){
		if(itemId.lastIndexOf('range-between')>-1){
			this.fields[itemId+'to'].setValue('');	
			this.fields[itemId+'from'].setValue('');	
		}
		else if(itemId.lastIndexOf('range-last_n')>-1){
			this.fields[itemId+'periods'].setValue('');	
		}
		else{
			if(typeof(this.fields[itemId].setValue)==='function'){
			this.fields[itemId].setValue('');
			}
			}
	},
	/**
	 * @private Handler method called when there is a keyup event for
	 *          "Last_N_Day" and "Last_N_Months" item of the menu.
	 */
	onInputKeyUpForLastNperiods : function (menuItem, e){

		var k = e.getKey();
		if (k == e.ENTER && menuItem.isValid()) {
			e.stopEvent();
			this.menu.hide(true);

			if (menuItem.itemId == 'range-last_n_daysperiods') {
				if (this.validate(menuItem)) {
					var field = this.fields['last_n_days'];
					if(field.checked){
						field.setChecked(false);
					}
					field.setChecked(true);
					this.fireEvent('update', this);
					return;
						
				}
				else
						field.setChecked(false);
			} else {
				if (this.validate(menuItem)) {
					var field = this.fields['last_n_months'];
					if(field.checked){
						field.setChecked(false);
					}
					field.setChecked(true);
					this.fireEvent('update', this);
					return;
					if (this.validate(menuItem)) {
						this.fireEvent('update', this);
					} else {
						field.setChecked(false);
					}
				}
				

			}
		}

	},

	/**
	 * Handler method called when the menu for a field fires the 'select' event
	 * of "after","before" and "on" items of filter menu.
	 * 
	 * @param {Object}
	 *            menuItem
	 * @param {Object}
	 *            value
	 * @param {Object}
	 *            picker
	 */
	onMenuSelect : function (menuItem, value, picker){
		if (this.validate(menuItem)) {
			var fields = this.fields,

			field = this.fields[menuItem.itemId];
			field.setChecked(true);
			return;
			if (this.validate(menuItem)){
			this.fireEvent('update', this);
			}
			else
				{
				field.setChecked(false);
				}
		}
	},
	/**
	 * Handler for "Between" item when user fires the 'select' and 'clear'
	 * event.
	 * 
	 * @param menuItem
	 * @param value
	 * @param picker
	 */

	onMenuSelectForBetween : function (menuItem, value, picker){
		if (this.validate(menuItem)) {
			var fields = this.fields, field = this.fields[menuItem.itemId];

			if (fields['range-betweenfrom'].value && '' != fields['range-betweenfrom'].value
						&& fields['range-betweento'].value && '' != fields['range-betweento'].value) {
				this.menu.hide(true);
				/**Clicking on some other date when one date is already present in the filter */
				if(fields.between.checked){
					fields.between.setChecked(false);
				}
				
				else
					fields.between.setChecked(true);
				this.fireEvent('update', this);
				return;				
			} else {
				fields.between.setChecked(false);
			}
		}
	},
	
	onMenuSelectForDate : function (menuItem, value, picker){
		var val;
		if (this.validate(menuItem)) {
			var fields = this.fields, field = this.fields[menuItem.itemId];
			if(menuItem.itemId == 'range-before')
				val = fields.before;
			else if(menuItem.itemId == 'range-after')
				val = fields.after;
			else
				val = fields.on;
			if (fields[menuItem.itemId].value && '' != fields[menuItem.itemId].value) {
				this.menu.hide(true);
				if(val.checked){
					//val.setChecked(false); /*This is done so that it does make the filter work when selected more than once*/ 
				}
				else
					val.setChecked(true);
				this.fireEvent('update', this);
				return;				
			} else {
				val.setChecked(false);
			}
		}
	},
	
	/**
	 * @private Template method that is to get and return the value of the
	 *          filter.
	 * @return {String} The value of this filter
	 */
	getValue : function (){
		var key, result = {};
		for (key in this.fields) {
			if (this.fields[key].checked) {
				
				if (key === "between") {
					result["after"] = this.fields["range-betweenfrom"].getValue();
					result["before"] = this.fields["range-betweento"].getValue();
				} else if (key === "range-lastmonth") {
					result["lastmonth"] = 1;

				} else if (key === "last_n_days" || key === "last_n_months") {
					result[key] = this.fields["range-" + key + "periods"].getValue();

				} else if (key === "before" || key === "after" || key === "on") {
					result[key] = this.fields["range-" + key].getValue(); 
				}

				else {

					result[key] = this.fields[key].menu.picker.getValue();

				}

			}
		}
		return result;
	},

	/**
	 * @private Template method that is to set the value of the filter.
	 * @param {Object}
	 *            value The value to set the filter
	 * @param {Boolean}
	 *            preserve true to preserve the checked status of the other
	 *            fields. Defaults to false, unchecking the other fields
	 */
	setValue : function (value, preserve){
		var key;
		for (key in this.fields) {
			if (this.fields[key].checked) {
				if (value[key]) {
					this.fields[key].menu.picker.setValue(value[key]);
					this.fields[key].setChecked(true);
				} else if (!preserve) {
					this.fields[key].setChecked(false);
				}
			}
			/**checking if the filter is checked or not
			   if not checked and the value exists in the field
			   clear/reset the filter */
			else if(Ext.isEmpty(this.fields[key].checked) && (this.fields[key].value || this.fields[key].getValue())){
				if(value == ''){
					if(!Ext.isEmpty(this.fields[key].clearDate)){
						this.fields[key].clearDate(this.fields[key]);
					}
					if(!Ext.isEmpty(this.fields[key].reset)){
						this.fields[key].reset();
					}
				}
			}
			
		}
		this.fireEvent('update', this);
	},

	/**
	 * @private Template method that is to return <tt>true</tt> if the filter
	 *          has enough configuration information to be activated.
	 * @return {Boolean}
	 */
	isActivatable : function (){
		var key;
		for (key in this.fields) {
			if (this.fields[key].checked) {
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
	getSerialArgs : function (){
		var args = [];
		for ( var key in this.fields) {
			if (this.fields[key].checked) {

				if (key === 'between') {
					args.push({
						type : 'date',
						comparison : 'before',
						value : this.fields["range-betweento"].getValue()
					});
					args.push({
						type : 'date',
						comparison : 'after',
						value : this.fields["range-betweenfrom"].getValue()
					});

				} else if (key === 'last_n_days' || key === 'last_n_months') {
					args.push({
						type : 'date',
						comparison : this.compareMap[key],
						value : this.fields["range-" + key + "periods"].getValue()
					});
				} else if (key === 'range-lastmonth') {
					args.push({
						type : 'date',
						comparison : 'lastmonth',
						value : 1
					});
				} 
				else if (key === 'before' || key === "after" || key === "on"){
					args.push({
						type : 'date',
						comparison : this.compareMap[key],
						value : this.fields["range-" + key].getValue()
					});
				} else {
					args.push({
						type : 'date',
						comparison : this.compareMap[key],
						value : this.getFieldValue(key).format(this.dateFormat)
					});
				}

			}
		}
		return args;
	},

	/**
	 * Get and return the date menu picker value
	 * 
	 * @param {String}
	 *            item The field identifier ('before', 'after', 'on')
	 * @return {Date} Gets the current selected value of the date field
	 */
	getFieldValue : function (item){
		if (this.fields[item].menu.picker) {
			return this.fields[item].menu.picker.getValue();
		}
	},

	/**
	 * Gets the menu picker associated with the passed field
	 * 
	 * @param {String}
	 *            item The field identifier ('before', 'after', 'on')
	 * @return {Object} The menu picker
	 */
	getPicker : function (item){
		return this.fields[item].menu.picker;
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
	validateRecord : function (record){
		var key, pickerValue, val = record.get(this.dataIndex);

		if (!Ext.isDate(val)) {
			return false;
		}
		val = val.clearTime(true).getTime();

		for (key in this.fields) {
			if (this.fields[key].checked) {
				pickerValue = this.getFieldValue(key).clearTime(true).getTime();
				if (key == 'before' && pickerValue <= val) {
					return false;
				}
				if (key == 'after' && pickerValue >= val) {
					return false;
				}
				if (key == 'on' && pickerValue != val) {
					return false;
				}
			}
		}
		return true;
	}
});
