/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */

cbx.ns("cbx.lib.view");
/*
 * This class contains the library specific widget container component inside the workspace. Called by the
 * layoutManager.
 */
cbx.lib.view.group = Class({
	// Global parameters
	md : '',
	bd : '',
	list : '',
	isContextEnable : false,

	constructor : function (conf)
	{

		this.groupingGridData = ''
		this.groupingColumnsData = [];
		this.consolidatedGroupedData = [];
		this.processedGroupedData = [];
		this.tempGroupedColData = ''
		this.tempBD = ''
		this.pData = ''
		this.tbd = ''

		cbx.core.extend(this, conf);

		this.md = this.utilityScope.md;
		this.parsedNoOfRecs = this.md.FLD_RECORDS_PER_PAGE;
		this.perPage = this.parsedNoOfRecs && parseInt(this.parsedNoOfRecs) ? parseInt(this.parsedNoOfRecs) : 45;
		this.id = this.utilityScope.id;
		this.parentId = this.utilityScope.parentId;
		this.widgetID = this.utilityScope.widgetID;
		this.appEvtRegistry = this.utilityScope.appEvtRegistry;
		this.accumulate = this.utilityScope.accumulate;
		this.parentScope = this.utilityScope.scope;
		this.extraParamsHandler = this.utilityScope.extraParamsHandler;
		this.extraParams = this.utilityScope.extraParams;
		this.additionalParams = this.utilityScope.additionalParams;
		this.appendTO = this.parent = this.utilityScope.parent;
		if (!cbx.isEmpty(IMM.contextList[this.md.VIEW_ID]))
		{
			this.isContextEnable = true;
		}

		this.createStore(this);
	},

	preLoad : function (params)
	{

	},
	postLoad : function (records, additionalData)
	{
		this.bd = records;
		this.additionalData = additionalData;
		if (records.length > 0)
		{
			this.processData(records, additionalData);
		} else
		{
			this.renderComponent(false)
		}
		$("#CONTENT_DIV").trigger('create');

	},
	reloadData : function ()
	{
		this.store.reload();
	},
	createStore : function (scopeHandler)
	{
		var generatedParams = scopeHandler.generateParams();
		this.store = new canvas.core.Store({
			params : generatedParams,
			listeners : {
				'load' : scopeHandler.postLoad,
				'beforeload' : scopeHandler.preLoad

			},
			scope : scopeHandler,
			groupEnabled : true,
			groupingColumns : scopeHandler.md.FLD_GROUPING_COLUMNS,
			containerId : scopeHandler.widgetID,
			dataController : true,
			id : 'store-' + scopeHandler.widgetID,
			accumulate : scopeHandler.accumulate || false,
			autoLoad : true,
			reader : {
				root : 'response.value.ALL_RECORDS',
				totalProperty : 'response.value.TOTAL_COUNT',
				additionalData : 'response.value.ADDITIONAL_DATA',
				idProperty : 'response.value.ADDITIONAL_DATA.UNIQUE_COLUMN'
			},
			bufferSize : scopeHandler.parsedNoOfRecs
		});

	},

	renderComponent : function (recsExist)
	{
		if (recsExist)
		{
			this.groupinGrid = '<div class="' + this.md.VIEW_ID
						+ '" data-role="collapsible-set" data-inset="false" data-collapsed="false">';
			var t = this.createCollapsibleElements();
			if (typeof t !== 'undefined' && t !== '')
			{
				this.groupinGrid = this.groupinGrid + t + '</ul>';
			} else
			{
				this.groupinGrid = this.groupinGrid + '</ul>';
			}
			$(this.parent).empty();
			if (this.parent != null)
			{
				$(this.parent).append(this.groupinGrid);
			}
			this.adjustCmp();
			var me = this;
			$(this.parent).find('li').each(function (index)
			{
				$(this).unbind('click');
				$(this).bind('click', function (e)
				{
					e.preventDefault();
					var index = $(this).attr('rec_index');
					if (!cbx.isEmpty(index))
					{
						var record = {
							data : me.store.getAt(index)
						};
						cbx.contextMenuRenderer.getContextMenu(me.id, record, e);
					}
				})
			});
		} else
		{
			if (this.parent != null)
			{
				$(this.parent).append(this.getNoRecordText());
			}
			this.adjustCmp();
		}
	},

	adjustCmp : function ()
	{
		$(this.parent).trigger('create');
		setTimeout(function ()
		{
			doIScroll("CONTENT_DIV", "refresh");
		}, 500);
	},
	getNoRecordText : function ()
	{
		var text = iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), this.md.SYSTEM_VIEW_ID + "_NO_DATA_MSG");

		if (cbx.isEmpty(text) || text == this.md.SYSTEM_VIEW_ID + "_NO_DATA_MSG")
		{
			text = iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "NO_DATA_MSG");
		}
		var textConfig = {
			eleType : "span",
			html : text
		}
		var noRecordText = new cbx.lib.layer(textConfig).getLayer();
		return noRecordText || '';
	},

	generateParams : function ()
	{

		var params = {
			"__LISTVIEW_REQUEST" : "Y",
			"PAGE_CODE_TYPE" : 'VDF_CODE',
			"INPUT_ACTION" : "INIT_DATA_ACTION",
			"INPUT_PRODUCT" : this.md.PRODUCT_CODE,
			"PRODUCT_NAME" : this.md.PRODUCT_CODE,
			"INPUT_FUNCTION_CODE" : this.md.FUNCTION_CODE,
			"INPUT_SUB_PRODUCT" : this.md.SUB_PRODUCT_CODE,
			"WIDGET_ID" : this.widgetID,
			"VIEW_ID" : this.md.SYSTEM_VIEW_ID
		};

		var mutiViewObj = this.appEvtRegistry.getMVObj();
		var extraparams = this.extraParamsHandler ? this.extraParamsHandler.apply(this.parentScope, [ params ])
					: params;
		extraparams = !cbx.isEmpty(this.extraParams) && cbx.isObject(this.extraParams) ? cbx.apply(extraparams,
					this.extraParams) : extraparams;
		extraparams = !cbx.isEmpty(mutiViewObj.getDefaultDateParams()) ? cbx.apply(extraparams, mutiViewObj
					.getDefaultDateParams()) : extraparams;
		if (!cbx.isEmpty(this.additionalParams))
		{
			cbx.apply(extraparams, this.additionalParams);
		}

		return extraparams;
	},

	processData : function (records, additionalData)
	{
		this.groupingColumns = this.md.FLD_GROUPING_COLUMNS;
		this.groupingColumnName = this.groupingColumns[0];
		if (!cbx.isEmpty(this.groupingColumnName))
		{
			this.processedGroupedData = this.store.getGroupedRecords(this.groupingColumnName)

			this.renderComponent(true);
		} else
		{
			this.renderComponent(false);
		}

	},
	
	getFloatValue:function(rawValue){	
		var sn = canvas.amountFormatter.getInstance();
		if(rawValue)
		return sn.basicFormatter(rawValue.replace(/,/g, ""), 2);
		else
		return rawValue;	
	},
	getDateValue:function(rawValue){
		var val = cbx.lib.utility.formatDate(rawValue,this.utilityScope.serverDateFormat,this.utilityScope.outDateFormat);
		var dateVal = !cbx.isEmpty(val)?val:rawValue;
		return dateVal;
	},

	createCollapsibleElements : function ()
	{
		var domstr = '';
		if (this.processedGroupedData.length > 0)
		{
			for (var pd = 0; pd < this.processedGroupedData.length; pd++)
			{
				this.pData = this.processedGroupedData[pd];

				var collapsibleHeader = '<div data-role="collapsible" data-collapsed="false" class="childRecords"+i><h2>';
				if ((!cbx.isEmpty(this.pData.values[0].TXT_SUBPROD)) && (!cbx.isEmpty(this.pData.values[0].TXT_STRCNAME)))
				{
					headerText = this.pData.values[0].TXT_SUBPROD + "-" + this.pData.values[0].TXT_STRCNAME + "-"
								+ this.pData.key + "(" + this.pData.values.length + ")";
				} else
				{
					headerText = this.pData.key + "(" + this.pData.values.length + ")";
				}
				collapsibleHeader = collapsibleHeader + '<div class="listcol_50 displayinline">' + headerText
							+ '</div>';
				collapsibleHeader = collapsibleHeader + '</h2>';
				collapsibleHeader = collapsibleHeader + '<ul data-role="listview" class="groupgrid-ul">';
				this.groupingGridData = this.pData.values;

				var lidomstr = '';
				if (this.groupingGridData.length > 0)
				{
					var listrstart;
					var listrend;
					for (var d = 0; d < this.groupingGridData.length; d++)
					{
						this.tbd = this.groupingGridData[d];
						if (this.isContextEnable)
						{
							listrstart = '<li class="groupgrid-li" rec_index="' + this.tbd.REC_CURR + '" column_id="'
										+ i + '"><a href="javascript: void(0);" item_id="' + d + '" column_id="' + d
										+ '">';

							listrend = '</a></li>';
						} else
						{
							listrstart = '<li>';
							listrend = '</li>';
						}
						var rowCount = 0;
						for (var d1 = 0; d1 < this.md.FLD_COLUMN_LIST.length; d1++)
						{
							var fldData = this.md.FLD_COLUMN_LIST[d1];
							if (fldData.FLD_HIDDEN_IND == 'N' && fldData.FLD_VISIBLE_IND == 'Y')
							{
								if (rowCount != 1)
								{
									listrstart = listrstart + '<div class="ctlistviewli">';
								}
								if (rowCount == 0 || rowCount == 1)
								{
									var val=this.tbd[fldData.FLD_COLUMN_ID];
									 if (fldData.FLD_DATA_TYPE == "float")
										{
											val = new String(val);
											val = this.getFloatValue(val)
										} 
										else if (fldData.FLD_DATA_TYPE == "date")
										{
											 
											val=this.getDateValue(val);
										}
									if (rowCount == 0)
									{
										listrstart = listrstart
													+ '<div class="listcol_50 ctlistviewli_col_header displayinline"><span>'
													+ val + '</span></div>';
									} else
									{
										listrstart = listrstart
													+ '<div class="listcol_50 ctlistviewli_col_header displayinline headercol1"><span>'
													+ val + '</span></div>';
									}

								} else if (fldData.FLD_DATA_TYPE == "float")
								{
									var val = new String(this.tbd[fldData.FLD_COLUMN_ID]);
									listrstart = listrstart
												+ '<div class="listcol_50 displayinline"><span>'
												+ CRB.getBundle(this.md.FLD_BUNDLE_KEY)["LBL_"
															+ fldData.FLD_COLUMN_DISPLAY_NAME_KEY]
												+ '</span></div><div class="listcol_50 ctlistviewli_col1"><span>' + this.getFloatValue(val)
												+ '</span></div>';
								} 
								else if (fldData.FLD_DATA_TYPE == "date")
								{
									 
									listrstart = listrstart
												+ '<div class="listcol_50 displayinline"><span>'
												+ CRB.getBundle(this.md.FLD_BUNDLE_KEY)["LBL_"
															+ fldData.FLD_COLUMN_DISPLAY_NAME_KEY]
												+ '</span></div><div class="listcol_50 ctlistviewli_col1"><span>' + this.getDateValue(this.tbd[fldData.FLD_COLUMN_ID])
												+ '</span></div>';
								}
								else
								{
									if (fldData.FLD_COLUMN_ID != "COD_FREQUENCY"
												&& fldData.FLD_COLUMN_ID != "TXT_SWEEPTYPE")
									{
										var data = this.tbd[fldData.FLD_COLUMN_ID];
									} else
									{
										var data = CRB.getBundle(this.md.FLD_BUNDLE_KEY)["LBL_"
													+ this.tbd[fldData.FLD_COLUMN_ID]];
									}
									if (cbx.isEmpty(data))
									{
										data = "--";
									}
									listrstart = listrstart
												+ '<div class="listcol_50 displayinline"><span>'
												+ CRB.getBundle(this.md.FLD_BUNDLE_KEY)["LBL_"
															+ fldData.FLD_COLUMN_DISPLAY_NAME_KEY]
												+ '</span></div><div class="listcol_50 ctlistviewli_col1"><span>'
												+ data + '</span></div>';
								}
								if (rowCount != 0)
								{
									listrstart = listrstart + '</div>';
								}
								rowCount++;
							}
						}
						lidomstr = lidomstr + listrstart + listrend;
					}
					collapsibleHeader = collapsibleHeader + lidomstr + '</ul></div>';
				}
				domstr = domstr + collapsibleHeader;
			}
		}
		return domstr;
	}
});
