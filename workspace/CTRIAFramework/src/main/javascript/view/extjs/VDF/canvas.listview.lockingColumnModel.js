/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
cbx.namespace('canvas.listview');
canvas.listview.lockingColumnModel = Ext.extend(Ext.ux.grid.LockingColumnModel, {
	constructor : function (config)
	{
		var contextCssCls = 'rightcontexticon';
		var dblClickCssCls = 'doubleclickicon';
		var dblClickToolTip = CRB.getFWBundle()['DBL_CLICK_TOOLTIP'];
		var contextToolTip = CRB.getFWBundle()['CONTEXT_CLICK_TOOLTIP'];
		var dblClickHandler = function (grid, rowIndex, colIndex, event)
		{
			grid.fireEvent("celldblclick", grid, rowIndex, colIndex, event);
		};
		var enableAdditionalOption = true;
		var contextHandler = function (grid, rowIndex, colIndex, item, event)
		{
			grid.fireEvent("rowcontextmenu", grid, rowIndex, event);
		};
		if (config.columns != undefined)
		{
			if (config.defaults.doubleclick == false)
			{
				dblClickCssCls = 'doubleclickdisableicon';
				dblClickToolTip = CRB.getFWBundle()['DBL_CLICK_DISABLE_TOOLTIP'];
				dblClickHandler = Ext.emptyFn;
			}
			if (config.defaults.contextclick == false)
			{
				contextCssCls = 'rightcontextdisableicon';
				contextToolTip = CRB.getFWBundle()['CONTEXT_DISABLE_TOOLTIP'];
				contextHandler = Ext.emptyFn;
			}
			if (config.defaults.doubleclick == false && config.defaults.contextclick == false)
			{
				enableAdditionalOption = false;
			}

			if (enableAdditionalOption && (Ext.isEmpty(config.isResponsive) || !config.isResponsive))
			{
				config.columns.insertAt({
					xtype : 'actioncolumn',
					id : 'actioncolumn',
					menuDisabled : true,
					resizable : false,
					width : 64,
					fixed : true,
					locked : true,
					lockfixed : true,
					hideable : false,
					draggable : false,
					moveable : false,
					enableColumnMove : false,
					enableDragDrop : false,
					dataIndex : 'actioncolumn',
					items : [ {
						getClass : function (v, meta, rec)
						{
							return dblClickCssCls;
						},
						tooltip : dblClickToolTip,
						handler : dblClickHandler
					}, {
						tooltip : contextToolTip,
						getClass : function (v, meta, rec)
						{
							return contextCssCls;
						},
						handler : contextHandler
					} ]
				}, 0);
			}

			else
			{

				if (enableAdditionalOption)
				{
					config.columns[0].respCntxtCol.push({
						xtype : 'actioncolumn',
						id : 'actioncolumn',
						menuDisabled : true,
						resizable : false,
						width : 64,
						fixed : true,
						locked : true,
						lockfixed : true,
						hideable : false,
						draggable : false,
						moveable : false,
						enableColumnMove : false,
						enableDragDrop : false,
						dataIndex : 'actioncolumn',
						items : [ {
							getClass : function (v, meta, rec)
							{
								return dblClickCssCls;
							},
							tooltip : dblClickToolTip,
							handler : dblClickHandler
						}, {
							tooltip : contextToolTip,
							getClass : function (v, meta, rec)
							{
								return contextCssCls;
							},
							handler : contextHandler
						} ]
					});
				}

			}

		} else
		{
			if (config && config.length > 0)
			{
				config.insertAt({
					xtype : 'actioncolumn',
					id : 'actioncolumn',
					menuDisabled : true,
					resizable : false,
					width : 64,
					fixed : true,
					locked : true,
					lockfixed : true,
					hideable : false,
					draggable : false,
					moveable : false,
					enableColumnMove : false,
					enableDragDrop : false,
					dataIndex : 'actioncolumn',
					items : [ {
						getClass : function (v, meta, rec)
						{
							return "doubleclickicon";
						},
						tooltip : CRB.getFWBundle()['DBL_CLICK_TOOLTIP'],
						handler : function (grid, rowIndex, colIndex, event)
						{
							grid.fireEvent("celldblclick", grid, rowIndex, colIndex, event);
						}
					}, {
						tooltip : CRB.getFWBundle()['CONTEXT_CLICK_TOOLTIP'],
						getClass : function (v, meta, rec)
						{
							return "rightcontexticon";
						},
						handler : function (grid, rowIndex, colIndex, item, event)
						{
							grid.fireEvent("cellcontextmenu", grid, rowIndex, colIndex, event);
						}
					} ]
				}, 0);
			}
		}
		canvas.listview.columnModel.superclass.constructor.call(this, config);
	},
	checkAndConvertNullVal : function (val)
	{
		if (Ext.isString(val) && val.length < 1)
		{
			val = iportal.NULL_VAL_REPLACE;
		}
		return val;
	},
	setConfig : function (config, initial)
	{
		var that = this;
		for (var i = 0, len = config.length; i < len; i++)
		{
			var col = config[i];
			if (col.renderer)
			{
				col.renderer = function ()
				{
					var func = col.renderer;
					return function ()
					{
						var val = func.createDelegate(this, arguments)();
						return that.checkAndConvertNullVal(val);
					};
				}();
			} else
			{
				col.renderer = this.checkAndConvertNullVal;
			}
		}
		canvas.listview.columnModel.superclass.setConfig.call(this, config, initial);
	}
});
