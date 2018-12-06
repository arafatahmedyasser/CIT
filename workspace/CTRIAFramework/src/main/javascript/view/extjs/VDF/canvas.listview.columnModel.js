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

cbx.namespace('canvas.listview');
/**
 * 
 */
canvas.listview.columnModel = Ext.extend(Ext.grid.ColumnModel, {
	checkAndConvertNullVal : function(val) {
		if (Ext.isEmpty(val) || (Ext.isString(val) && val.length < 1)) {
			val = iportal.NULL_VAL_REPLACE;
		}
		return val;
	},
	setConfig : function(config, initial) {
		var that = this;
		for ( var i = 0, len = config.length; i < len; i++) {
			var col = config[i];
			if (col.renderer) {
				col.renderer = function() {
					var func = col.renderer;
					return function() {
						var val = func.createDelegate(this, arguments)();
						return that.checkAndConvertNullVal(val);
					};
				}();
			} else {
				col.renderer = this.checkAndConvertNullVal;
			}
		}
		canvas.listview.columnModel.superclass.setConfig.call(this, config,initial);
	}
});


cbx.ns('canvas.grid.column.types');
/**
 * 
 */
canvas.grid.column.types.dateColumn = Ext.extend(Ext.grid.DateColumn,{
	format : canvas.datePreferences.getDateFormat(),
	alignment : iportal.preferences.getDateColumnAlignment(),
	isRTL : iportal.preferences.isLangDirectionRTL(),
	constructor : function(cfg) {
		canvas.grid.column.types.dateColumn.superclass.constructor.call(this, cfg);
		/**
		 * If DATE_COLUMN_ALIGNMENT is configured with a valid value it will be used;
		 * otherwise the data will be right aligned. 
		 **/
		if (!Ext.isEmpty(this.alignment)) {
			if (this.alignment == 'LEFT'|| this.alignment == 'CENTER'){
				this.align = this.alignment;
			}
			else {
				this.align = this.isRTL? 'left' : 'right';
			}
		} 
		else {
			this.align = this.isRTL? 'left' : 'right';
		}
		this.format = canvas.datePreferences.getDateFormat();
		var that = this;
		this.resizable = true;
		this.renderer = function(val) {
			if (!Ext.isEmpty(val)) {
				if (typeof (val) == 'string'){
					val = Date.parseDate(val, 'd/m/Y');
				}
				val = Ext.util.Format.date(val, that.format);
				if (that.width < Math.floor(iportal.preferences.getAverageFontWidth()* val.length)) {
					/** 
					 * Fix for apostraphies and double quotes truncating on tooltips
					 * */
					val = val.replace(/'/g, "&#145;");
					val = val.replace(/"/g, '&#34;');
					if (that.drillDownReq === 'Y') {
						return "<a class='tlink'><div class='iportal-grid-cell' ext:qtip='"
								+ val
								+ "'>"
								+ val
								+ "</div></a>";
					} else {
						return '<div class="iportal-grid-cell" ext:qtip="'
								+ val 
								+ '">' 
								+ val 
								+ '</div>';
					}
				} else {
					if (that.drillDownReq === 'Y') {
						return "<a class='tlink'>" + val + "</a>"; 
					} else {
						return val; 
					}
				}
			} 
			else {
				return iportal.NULL_VAL_REPLACE;
			}
		};
	}
});

/**
 * 
 */
canvas.grid.column.types.dateTimeColumn = Ext.extend(Ext.grid.DateColumn,{
	/**
	 * date format along with the time zone. 
	 */
	format : canvas.datePreferences.getDateFormat() + ' '+iportal.preferences.getTimeFormat(), 
	alignment : iportal.preferences.getDateTimeColumnAlignment(),
	isRTL : iportal.preferences.isLangDirectionRTL(),
	constructor : function(cfg) {
		canvas.grid.column.types.dateTimeColumn.superclass.constructor.call(this, cfg);
		if (!Ext.isEmpty(this.alignment)) {
			if (this.alignment == 'LEFT' || this.alignment == 'CENTER'){
				this.align = this.alignment;
			}
			else {
					this.align = this.isRTL? 'left' : 'right';
			}
		} 
		else {
				this.align = this.isRTL? 'left' : 'right';
		}
		this.resizable = true;
		var that = this; 
		this.renderer = function(val) {
			if (!Ext.isEmpty(val)) {
				if (typeof (val) == 'string'){
					val = Date.parseDate(val, 'd/m/Y H:i:s A');
				}
				val = Ext.util.Format.date(val, that.format);
				if (that.width < Math.floor(iportal.preferences.getAverageFontWidth()* val.length)) {
					val = val.replace(/'/g, "&#145;");
					val = val.replace(/"/g, '&#34;');
					if (that.drillDownReq === 'Y') {
						return "<a class='tlink'><div class='iportal-grid-cell' ext:qtip='"
								+ val
								+ "'>"
								+ val
								+ "</div></a>";
					} else {
						return '<div class="iportal-grid-cell" ext:qtip="'
								+ val + '">' + val + '</div>';
					}
				} else {
					if (that.drillDownReq === 'Y') {
						return "<a class='tlink'>" + val + "</a>"; 
					} else {
						return val; 
					}
				}
			} 
			else {
				return iportal.NULL_VAL_REPLACE;
			}
		};
	}
});

/**
 * Updated the below component such that formatting of the decimal place
 * value is based on the linked source currency of the amount column. the steps
 * are : - gets the currency from the linked source currency column. - if
 * currency is not available from the linked source currency column, get it from
 * the preference. - if the currency is also not available in the preference,
 * then get it from the default currency configured in the
 * orbionedirect.properties file. - once the currency is retrieved, get the
 * decimal places value from the iportal.GlobalCurrency.metadata.jsp file. - use
 * the decimal place value obtained for formatting.
 */
canvas.grid.column.types.amountColumn = Ext.extend(Ext.grid.NumberColumn,{
	//format : iportal.preferences.getAmountFormat(),
	alignment : iportal.preferences.getAmountColumnAlignment(),
	isRTL : iportal.preferences.isLangDirectionRTL(),
	constructor : function(cfg) {
		canvas.grid.column.types.amountColumn.superclass.constructor.call(this, cfg);
		/**
		 * If AMOUNT_COLUMN_ALIGNMENT is configured with a valid
		 * value it will be used; otherwise the data will be
		 * right aligned
		 */
		if (!Ext.isEmpty(this.alignment)) {
			if (this.alignment == 'LEFT'|| this.alignment == 'CENTER') {
				this.align = this.alignment;
			} else {
					this.align = this.isRTL? 'left' : 'right';
			}
		} else {
				this.align = this.isRTL? 'left' : 'right';
		}
		var that = this;
		this.renderer = function(val, metaData, record,
				rowIndex, colIndex, store) {
			var islinkedCurrAvail = false;
			var curr = record.data[that.linkedCurrCol];
			var currAppend = that.appendCurrencyMode;
			var currDecimalPlaceList = cbx.globalcurrency.metadata.getCurrDecimalPlaceList();
			var currList = currDecimalPlaceList;
			var currBasedDecimal = 2;	
			
			if (!cbx.isEmpty(val)) {
				if (cbx.isEmpty(curr)) {
					/**
					 * get the default curr from preference
					 */
					curr = iportal.systempreferences.getDefaultBankCCY();
					if (!curr || curr.trim() == ''
							|| curr == '') {
						/**
						 * get the default curr configured in
						 * the orbidirect properties
						 */
						curr = cbx.globalcurrency.metadata.getDefaultCurrency();
					}
					
					if(!cbx.isEmpty(currList) && !cbx.isEmpty(currList[curr])){
						currBasedDecimal = currList[curr];
					}
				}
				else
					{
					if(!cbx.isEmpty(currList) && !cbx.isEmpty(currList[curr])){
						currBasedDecimal = currList[curr];
						islinkedCurrAvail = true;
					}
				}
				/**
				 * For amount columns - refering the value
				 * directly from JSON as Ext converts very long
				 * numbers to exponents.
				 */
				if (!Ext.isEmpty(record.json[this.id])) {
					record.data[this.id] = val = record.json[this.id];
				}
				try {
					if (val.charAt(0) == ".") {
						val = "0" + val;
					}
				} catch (err) {
				}
				val = new String(val);
				var sn = canvas.amountFormatter.getInstance();
				val = sn.basicFormatter(val.replace(/,/g,""), currBasedDecimal);
				if (islinkedCurrAvail == true) {
					if (iportal.preferences.isLangDirectionRTL() === true) {
						if (currAppend == "PREFIX") {
							val = "<div  class='amountColumnInRTL'>"
									+ val
									+ " "
									+ curr
									+ "</div>";
						} else {
							val = "<div  class='amountColumnInRTL'>"
									+ curr
									+ " "
									+ val
									+ "</div>";
						}
					} 
					else {
						if (currAppend == "PREFIX") {
							val = curr + " " + val;
						} else if (currAppend == "POSTFIX") {
							val = val + " " + curr;
						}
					}
				} 
				else {
					val = val;
				}
				if (that.width < Math.floor(iportal.preferences.getAverageFontWidth()* val.length)) {
					if (val.startsWith('-') && !val.endsWith('-')) {
						if(iportal.preferences.getNegativeSignInAmountColumn() == false){
							val = val.substring(1, val.length);
							val = '(' + val + ')';
						}
						/**
						 * Fix for apostraphies and double
						 * quotes truncating on tooltips
						 */
						val = val.replace(/'/g, "&#145;");
						val = val.replace(/"/g, '&#34;');
						if (that.drillDownReq === 'Y') {
							return "<a class='tlink'><div class='iportal-grid-cell' 'negativeAmt' ext:qtip='"
									+ val
									+ "'>"
									+ val
									+ "</div></a>";
						} else {
							return '<div class="iportal-grid-cell" ext:qtip="'
									+ val
									+ '">'
									+ val
									+ '</div>';
						}
					} else {
						if (that.drillDownReq === 'Y') {
							return "<a class='tlink'><div class='iportal-grid-cell' 'negativeAmt' ext:qtip='"
									+ val
									+ "'>"
									+ val
									+ "</div></a>";
						} else {
							return '<div class="iportal-grid-cell" ext:qtip="'
									+ val
									+ '">'
									+ val
									+ '</div>';
						}
					}
				} 
				else {
					if (val.startsWith('-')
							&& !val.endsWith('-')) {
						if(iportal.preferences.getNegativeSignInAmountColumn() == false){
							val = val.substring(1, val.length);
							val = '(' + val + ')';	
						}
						if (that.drillDownReq === 'Y') {
							return '<div class = \'negativeAmt\'><a class=\'tlink\'>'
									+ val + '</a></div>';
						} else {
							return '<div class = \'negativeAmt\'>'
									+ val + '</div>';
						}
					} else {
						if (that.drillDownReq === 'Y') {
							return "<a class='tlink'>" + val
									+ "</a>";
						} else {
							return val;
						}
					}
				}
			} 
			else {
				return iportal.NULL_VAL_REPLACE;
			}
		};
	}
});

/**
 * 
 */
canvas.grid.column.types.contextColumn = Ext.extend(Ext.grid.Column, {
	constructor : function(cfg) {
		canvas.grid.column.types.contextColumn.superclass.constructor.call(this, cfg);
		this.width = 28;
		this.resizable = false;
		this.renderer = function(val, metaData, record, rowIndex, colIndex,
				store) {
			if (val == 'Y') {
				var ctx = record.id + "_" + rowIndex + "_" + colIndex;
				val = "<div id='" + ctx + "' class='context'></div>";
			} else {
				val = ' ';
			}
			return val;
		};
	}
});

/**
 * 
 */
canvas.grid.column.types.canvasColumn = Ext.extend(Ext.grid.Column,{
	constructor : function(cfg) {
		canvas.grid.column.types.canvasColumn.superclass.constructor.call(this, cfg);
		var that = this;
		this.renderer = function(val, metaData, record,rowIndex, colIndex, store) {
			if (Ext.isEmpty(val) || (Ext.isString(val) && val.length < 1)) {
				return iportal.NULL_VAL_REPLACE;
			} 
			else { 
				if (that.width < Math.floor(iportal.preferences.getAverageFontWidth()* val.length)) {
					val = val.replace(/'/g, "&#145;");
					val = val.replace(/"/g, '&#34;');
					if (that.drillDownReq === 'Y') {
						return "<a class='tlink'><div class='iportal-grid-cell' ext:qtip='"
								+ val
								+ "'>"
								+ val
								+ "</div></a>";
					} else {
						return '<div class="iportal-grid-cell" ext:qtip="'
								+ val + '">' + val + '</div>';
					}
				}
				/**
				 * Render a hyperlink in a grid column if the
				 * value of the DRILL_DOWN_IND is 'Y'
				 */
				else if (that.drillDownReq === 'Y') {
					return "<a class='tlink'>" + val + "</a>";
				} else {
					return val;
				}
			}
		};
	}
});

/**
 * 
 */
canvas.grid.column.types.checkboxColumn = Ext.extend(Ext.grid.Column, {
	constructor : function(config) {
		Ext.apply(this, config);
		canvas.grid.column.types.checkboxColumn.superclass.constructor.call(this,config);
		if (!this.id) {
			this.id = Ext.id();
		}
		var that = this;
		this.renderer = function(v, p, record) {
			p.css += ' x-grid3-check-col-td';
			return String.format(
					'<div class="x-grid3-check-col{0} {1} {2}">&#160;</div>',
					v ? '-on' : '', that.disable ? 'x-grid3-check-disabled'
							: '', that.createId());
		};
	},
	createId : function() {
		return 'x-grid3-cc-' + this.id;
	}
});

/**
 * Code added for Grid column type which renders an icon, or a series of icons
 * in a grid cell, and offers a scoped click handler for each icon. The context
 * column can be at any index in the columns array, and a grid can have any
 * number of context columns.
 */
Ext.grid.ContextColumn = Ext.extend(Ext.grid.Column,{
//	header : '&#160;',
	actionIdRe : /x-action-col-(\d+)/,
	altText : '',
	constructor : function(cfg) {
		var me = this, items = cfg.items || (me.items = [ me ]), l = items.length, i, item;
		Ext.grid.ContextColumn.superclass.constructor.call(me,cfg);
		this.align = 'center';
		me.renderer = function(v, meta, record, rowIndex,colIndex, store) {
		//	v = Ext.isFunction(cfg.renderer) ? cfg.renderer.apply(this, arguments)|| '' : '';
			meta.css += ' x-action-col-cell';
			if(cbx.isEmpty(v)){
				v = '';
			}
			for (i = 0; i < l; i++) {
				item = items[i];
				v += '<img alt="'
						+ (item.altText || me.altText)
						+ '" src="'
						+ (item.icon || Ext.BLANK_IMAGE_URL)
						+ '" class="x-action-col-icon x-action-col-'
						+ String(i)
						+ ' '
						+ (item.iconCls || '')
						+ ' '
						+ (Ext.isFunction(item.getClass) ? item.getClass
								.apply(item.scope || me.scope
										|| me, arguments)
								: '')
						+ '"'
						+ ((item.tooltip) ? ' ext:qtip="'
								+ item.tooltip + '"' : '')
						+ ' />';
			}
			return v;
		};
	},
	destroy : function() {
		delete this.items;
		delete this.renderer;
		return Ext.grid.ContextColumn.superclass.destroy.apply(this, arguments);
	},

	processEvent : function(name, e, grid, rowIndex, colIndex) {
		var m = e.getTarget().className.match(this.actionIdRe), item, fn;
		if (m && (item = this.items[parseInt(m[1], 10)])) {
			if (name == 'click') {
				(fn = item.handler || this.handler)
						&& fn.call(item.scope || this.scope
								|| this, grid, rowIndex,
								colIndex, item, e);
			} else if ((name == 'mousedown')
					&& (item.stopSelection !== false)) {
				return false;
			}
		}
		return Ext.grid.ContextColumn.superclass.processEvent.apply(this, arguments);
	}
});

/**
 * 
 */
canvas.grid.column.types.percentageColumn = Ext.extend(Ext.grid.NumberColumn, {
	constructor : function(cfg) {
		canvas.grid.column.types.percentageColumn.superclass.constructor.call(this, cfg);
		this.align = (cfg.align) || 'right';
		var that = this;
		this.renderer = function(val, metaData, record, rowIndex, colIndex,
				store) {
			if (!Ext.isEmpty(val)) {
				var v = val + ' %';
				return v;
			} else {
				return iportal.NULL_VAL_REPLACE;
			}
		};
	}
});

/**
 * 
 */
canvas.grid.column.types.groupColumn = Ext.extend(Ext.grid.Column, {
	constructor : function(cfg) {
		canvas.grid.column.types.groupColumn.superclass.constructor.call(this,cfg);
		this.renderer = function(val) {
			var rb = CRB.getBundle(this.rbKey);
			if (!Ext.isEmpty(val)) {
				var values = val.split("::::");
				var newValue = "";
				try {
					if (rb["LBL_" + values[0]] == undefined) {
						newValue = '?' + values[0] + '?';
					} else {
						newValue = rb["LBL_" + values[0]];
					}
				} catch (e) {
					newValue = '?' + values[0] + '?';
				}

				newValue = newValue + " : " + values[1];

				return newValue;
			} else {
				return iportal.NULL_VAL_REPLACE;
			}
		};
	}
});

/**
 * This is a new column type called translatedvalue column. This takes column
 * values and translates into a different value for displaying. These original
 * values and translated values are mapped in properties file.
 */
canvas.grid.column.types.translatedValueColumn = Ext.extend(Ext.grid.Column, {
	constructor : function(cfg) {
		canvas.grid.column.types.translatedValueColumn.superclass.constructor.call(
				this, cfg);
		var that = this;
		this.renderer = function(val) {

			var rb = CRB.getBundle(that.rbKey) || CRB.getFWBundle();
			if (!Ext.isEmpty(val)) {
				val = new String('LBL_' + val);
				try {
					if (rb[val] == undefined) {
						val = '?' + val + '?';
					} else {
						val = rb[val];
					}
				} catch (e) {
					val = '?' + val + '?';
				}
				return val;
			} else {
				return iportal.NULL_VAL_REPLACE;
			}
		};
	}

});

/**
 * 
 */
canvas.grid.column.types.rateColumn = Ext.extend(Ext.grid.Column,{
	constructor : function(cfg) {
		var that = this;
		canvas.grid.column.types.canvasColumn.superclass.constructor.call(this, cfg);
		this.renderer = function(val, metaData, record,rowIndex, colIndex, store) {
			if (Ext.isEmpty(val) || (Ext.isString(val) && val.length < 1)) {
				return iportal.NULL_VAL_REPLACE;
			} else { 
		if (val.startsWith('.')) {
			val = "0".concat(val);
		}
		if (that.width < Math.floor(iportal.preferences.getAverageFontWidth()* val.length)) {
			val = val.replace(/'/g, "&#145;");
			val = val.replace(/"/g, '&#34;');
			if (that.drillDownReq === 'Y') {
				return "<a class='tlink'><div class='iportal-grid-cell' ext:qtip='"
						+ val
						+ "'>"
						+ val
						+ "</div></a>";
			} 
			else {
				return '<div class="iportal-grid-cell" ext:qtip="'
						+ val + '">' + val + '</div>';
			}
		}
		else if (this.drillDownReq === 'Y') {
					return "<a class='tlink'>" + val + "</a>";
				} else {
					return val;
				}
			}
		};
	}
});

canvas.grid.column.types.propertyValueColumn = Ext.extend(Ext.grid.Column, {
	constructor : function(cfg) {
		canvas.grid.column.types.propertyValueColumn.superclass.constructor.call(this, cfg);
		var that = this;
		this.renderer = function(val, metaData, record,rowIndex, colIndex, store) {
			if (Ext.isEmpty(val) || (Ext.isString(val) && val.length < 1)) {
				return iportal.NULL_VAL_REPLACE;
			} 
			else { 
				var parColid = record.json.PARTICULARS
				var valColmodel = arguments[6].colModel.getColumnById(record.json.PARTICULARS);
				if(cbx.isEmpty(valColmodel)){
					return val;
				}
				var renderer = valColmodel.renderer;
				
				if (Ext.isString(renderer)) {
					renderer = Ext.util.Format[renderer];
				}
				
				var value = renderer.call(valColmodel.scope,val, {}, record, rowIndex, colIndex, store,arguments[6]);
				
				return value;
			}
		};
	}

});

canvas.grid.column.types.templatecolumn = Ext.extend(Ext.grid.Column, {
	tpl:'<div></div>',
    constructor: function(cfg){
    	canvas.grid.column.types.templatecolumn.superclass.constructor.call(this, cfg);
        var tpl = (!Ext.isPrimitive(this.tpl) && this.tpl.compile) ? this.tpl : new Ext.XTemplate(this.tpl);
        this.renderer = function(value, p, r){
            return tpl.apply(r.data);
        };
        this.tpl = tpl;
    }
});



canvas.grid.column.types.combolistcolumn = Ext.extend(Ext.grid.Column, {
	initalSetup : true,
	colAddData :'', 
    constructor: function(cfg){
    	canvas.grid.column.types.templatecolumn.superclass.constructor.call(this, cfg);
    	var that = this;
        this.renderer = function(val, metaData, record,	rowIndex, colIndex, store,grid){
        	
    		if(that.initalSetup){
    			that.initalSetup = false;
    			
    			var addData;
    			var store = grid.getStore();
    			if(store.reader && store.reader.jsonData &&
    						store.reader.jsonData.response && 
    						store.reader.jsonData.response.value &&
    						store.reader.jsonData.response.value.ADDITIONAL_DATA &&
    						store.reader.jsonData.response.value.ADDITIONAL_DATA.ADDL_LIST_CONFIG){
    			
    				addData = store.reader.jsonData.response.value.ADDITIONAL_DATA.ADDL_LIST_CONFIG;
    			}
    			
    			var columns = grid.getColumnModel().columns;

    			if (columns && addData)
    			{
    				for ( var j in addData)
    				{
    					for (i = 0, len = columns.length; i < len; i++)
    					{
    						if (columns[i].id == j)
    						{
    							that.colAddData= addData[j].DATA;
    						}
    					}
    				}
    			}
    		} 
    		 
    		var value = '';
    		if(that.colAddData.RAWKEYS && that.colAddData.RAWVALUES){
    			value = that.colAddData.RAWVALUES[that.colAddData.RAWKEYS.indexOf(val)]
    		}
    		
    		metaData.css += ' x-combo-list-cell';
            return '<div class="x-combo-value"><span class="x-text-content">'+value+'</span><div class="x-combo-img"></div></div>';
        };
    },
	processEvent : function (name, e, grid, rowIndex, colIndex)
	{

		if (e.target.className == 'x-combo-img')
		{
			var tdel = Ext.fly(e.target).findParent('td');
			if (tdel)
			{
				var xy = Ext.fly(tdel).getXY();
				xy[1] = xy[1] + Ext.fly(e.target).getHeight();

				var menuItems = [];
				var menu = '';
				if (this.colAddData.RAWKEYS)
				{
					for (var i = 0; i < this.colAddData.RAWKEYS.length; i++)
					{
						menu = {
							text : this.colAddData.RAWVALUES[i],
							rawKey : this.colAddData.RAWKEYS[i],
							rowIndex:rowIndex,
							colIndex :colIndex,
							rawValue : this.colAddData.RAWVALUES[i],
							grid:grid,
							style : 'padding-left: 3px;',
							handler : function (menu)
							{
								var dpdntdel = menu.grid.view.getCell(menu.rowIndex,menu.colIndex);
								menu.grid.getStore().getAt(menu.rowIndex).set(menu.grid.getStore().fields.items[menu.colIndex-1]['name'],menu.rawKey);
							}
						}
						menuItems[i] = menu;
					}

					var menu = new Ext.menu.Menu({
						width : Ext.fly(tdel).getWidth(),
						style : 'background-image: none;',
						items : menuItems
					}).showAt(xy);
				}
			}
		}
		return false;
	}
});



Ext.grid.Column.types.canvasdate = canvas.grid.column.types.dateColumn;
Ext.grid.Column.types.canvasdatetime = canvas.grid.column.types.dateTimeColumn;
Ext.grid.Column.types.canvasamount = canvas.grid.column.types.amountColumn;
Ext.grid.Column.types.canvascontext = canvas.grid.column.types.contextColumn;
Ext.grid.Column.types.canvascolumn = canvas.grid.column.types.canvasColumn;
Ext.grid.Column.types.canvascheck = canvas.grid.column.types.checkboxColumn;
Ext.grid.Column.types.contextcolumn = Ext.grid.ContextColumn;
Ext.grid.Column.types.canvasgroupcolumn = canvas.grid.column.types.groupColumn;
Ext.grid.Column.types.canvastranslatedvalue = canvas.grid.column.types.translatedValueColumn;
Ext.grid.Column.types.canvasrate = canvas.grid.column.types.rateColumn;
Ext.grid.Column.types.canvaspercentage = canvas.grid.column.types.percentageColumn;
Ext.grid.Column.types.canvaspropertyvalue = canvas.grid.column.types.propertyValueColumn;
Ext.grid.Column.types.canvastemplatecolumn=canvas.grid.column.types.templatecolumn;
Ext.grid.Column.types.canvascombolist=canvas.grid.column.types.combolistcolumn;