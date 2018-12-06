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
 
cbx.ns('canvas.lib.view');
/**
 * This class contains the lib specific GroupView confined to the widget / app.
 */
canvas.lib.view.TileView = Class(cbx.core.Component,{
	/**
	 * 
	 */
	initialize : function() {
		var me = this;
		me.bbar = '';
		me.perPage = !cbx.isEmpty(me.md.getRecordsPerPage()) ? parseInt(me.md
				.getRecordsPerPage())
				: parseInt(iportal.preferences.getDefaultRecsPerPage());
		me.paginationTriggered = '';

		var elem = me.elem;
		this.paginationId = me.WIDGET_ID + "_" + me.md.getViewId()
				+ "_pagination"
		this.bbarId = me.WIDGET_ID + "_" + me.md.getViewId() + "_bbar";
		this.pageSize = me.md.FLD_RECORDS_PER_PAGE;
		var appId = 'cbx-app-' + me.WIDGET_ID + "_" + me.md.getViewId();
		elem.append('<span class="' + appId + '" ITEM_ID="WGT_'
				+ me.WIDGET_ID + '"></span>');
		elem = $(elem.find('span.' + appId));
		me.setCmp(elem);

		this.divId = me.WIDGET_ID + "_" + me.md.getViewId()
				+ "_CATALOG";
		elem.on("remove", function() {
			me.destroy();
		});
		this.contextMenu = me.md.getContextMenu();
		var displayKey = me.WGT_TITLE || me.md.getViewTitle();
		var title = me.rb[displayKey] || displayKey;
		var domStr='';
		if (!cbx.core.isEmpty(title) && me.loadingInContainer !== true && me.WGT_HEADER_IND=='Y') {
		 domStr = '<div id="page-title" role="heading" '
				+ 'class="displayinline container page-title accessible-area accessibility-contrast-normal col19 '
				+ me.WIDGET_ID + '-title">' + '<H1>' + title + '</H1>'
				+ '</div>';// Widget Title
		}

		domStr += '<div class="' + this.divId
				+ ' context-wrapper"></div>';

		$(elem).append(domStr);
		// Pagination section
		paginationDiv = '<div class="pagination"></div>';
		// Include empty bBar
		var bBar = '<div class=bbar id="' + this.bbarId
				+ '" ></div>';
		$(elem).append(bBar);
		this.templateConfig = this.md.md.VIEW_MD.TEMPLATE_CONFIG;

		var params = {
			"__LISTVIEW_REQUEST" : "Y",
			"PAGE_CODE_TYPE" : 'VDF_CODE',
			"INPUT_ACTION" : "INIT_DATA_ACTION",
			"PRODUCT_NAME" : 'CUSER',
			"INPUT_FUNCTION_CODE" : 'VSBLTY',
			"INPUT_SUB_PRODUCT" : 'CUSER',
			"WIDGET_ID" : me.WIDGET_ID,
			"VIEW_ID" : me.md.getViewId(),
			
			"LAYOUT_ID" :iportal.workspace.metadata.getCurrentLayoutId(),
			"WORKSPACE_ID" :iportal.workspace.metadata.getCurrentWorkspaceId(),
			
			"forceCallbacks" : true
		};
		var extraParams = {};
		extraParams = me.viewConf.raiseEvent(CWEC.EXTRA_PARAMS_HDLR,
				extraParams);
		if (extraParams) {
			cbx.core.extend(params, extraParams);
		}
		if (me.uData && !cbx.core.isEmpty(me.uData)) {
			cbx.core.extend(params, me.uData);
		}

		this.store = new cbx.core.Store({
			params : params,
			listeners : {
				"load" : this.loadData
			},
			scope : this,
			accumulate : false,
			autoLoad : true,
			reader : {
				root : 'response.value.ALL_RECORDS',
				totalProperty : 'response.value.TOTAL_COUNT'
			},
			bufferSize : this.pageSize != null ? this.pageSize : 10
		});
	},
	
	/**
	 * 
	 */
	loadData : function(records) {
		var me = this;
		var elem = me.getCmp();
		var bBar = $(elem.find('#' + this.bBarId));
		if (!cbx.isEmpty(this.paginationSelector)) {
			if (this.count !== this.paginationSelector
					.cbxPagination('getItemsCount')) {
				me.paginationTriggered = "";
				this.paginationSelector.cbxPagination('destroy');
				this.paginationSelector = "";
				var pagingParams = {};
				pagingParams.start = 0;
				cbx.core.extend(this.store.getParams(), pagingParams);
				this.reloadData(records);
				return;
			}
		}
		if (records.length > 0) {
			this.createCatalogItems(records);
			this.updateBBar();// New bBar
		} else {
			bBar.empty();
			var $elem = $($(this.elem).find('div.' + this.divId));
			var emptyMsg =(me.rb['NO_DATA_MSG_'+me.WIDGET_ID]!=undefined ?me.rb['NO_DATA_MSG_'+me.WIDGET_ID]: me.rb['NO_DATA_MSG']);
			var emptyDiv = '<div>' + emptyMsg + '</div>';
			$($elem).append(emptyDiv);
			setTimeout(function ()
						{
			me.viewConf.raiseEvent(CWEC.AFTER_TEMPLATE_LOAD, {
				elem : $(me.templateConfig),
				uData : me.uData
			});

					}, 100);
		}
	},
	
	/**
	 * 
	 */
	reloadData : function() {
		this.store.reload();
	},
	
	/**
	 * 
	 */
	updateBBar : function() {
		var me = this;
		var md = me.md;
		var bBarId = this.bbarId;
		var domStr = '';
		var elem = me.getCmp();
		var bBarButtons = null;
		this.count = this.store.totalAvailableRecords || 0;
		LOGGER.info('this.count:' ,this.count);
		LOGGER.info('this.perPage:' ,this.perPage);
		var bBar = $(elem.find('#' + bBarId));
		LOGGER.info('bBar:' ,bBar);
		if (this.count > this.perPage) {
			if (cbx.isEmpty(this.paginationTriggered)) {
				LOGGER.info('Insaide paginationTriggered:');
				bBar.empty();
				if (md != null) {
					bBarButtons = md.getBBarButtons();
					if (!cbx.isEmpty(bBarButtons)) {
						var rb = me.commonBundle;
						var title = '', btn = null;
						var posBtns = bBarButtons.POSITIVE_BUTTONS;

						for ( var i = 0, len = posBtns.length; i < len; i++) {
							btn = posBtns[i];
							title = rb[btn.FLD_BTN_DISPLAY_NM] != null ? rb[btn.FLD_BTN_DISPLAY_NM]
									: btn.FLD_BTN_DISPLAY_NM;
							if (i == 0) {
								domStr += '<span class=posBtn>';
							}

							domStr += '<a data-role-button="bbar" data-button-id="'
									+ btn.FLD_BBAR_BTN_ID
									+ '" data-widget-id="'
									+ btn.FLD_WIDGET_ID
									+ '" class="bBar-btn">'
									+ title
									+ '</a>&nbsp;';

							if (i == posBtns.length - 1) {
								domStr += '</span>';
							}
						}
						if (domStr != '') {
							bBar.append(domStr);
						}

					}

				}
				domStr = '';
				if (!cbx.isEmpty(this.paginationSelector)) {
					this.paginationSelector.cbxPagination('destroy');
				}
				domStr = '<span class=pagination-centered id="'
						+ this.paginationId + '" ></span>';
				bBar.append(domStr);
				this.totalDisplayInd = md.getTotalDisplayInd();
				this.paginateTable();

				if (md != null) {
					bBarButtons = md.getBBarButtons();
					if (!cbx.isEmpty(bBarButtons)) {
						domStr = '';
						var negBtns = bBarButtons.NEGATIVE_BUTTONS;

						for ( var i = 0, len = negBtns.length; i < len; i++) {
							btn = negBtns[i];
							title = rb[btn.FLD_BTN_DISPLAY_NM] != null ? rb[btn.FLD_BTN_DISPLAY_NM]
									: btn.FLD_BTN_DISPLAY_NM;
							if (i == 0) {
								domStr += '<span class=negBtn>';
							}
							domStr = '<a data-role-button="bbar" data-button-id="'
									+ btn.FLD_BBAR_BTN_ID
									+ '" data-widget-id="'
									+ btn.FLD_WIDGET_ID
									+ '" class="bBar-btn">'
									+ title
									+ '</a>&nbsp;';

							if (i == negBtns.length - 1) {
								domStr += '</span>';
							}
						}
						if (domStr != '') {
							bBar.append(domStr);
						}
					}

				}
			}
		}
	},
	
	
	/**
	 * 
	 */
	createCatalogItems : function(records) {
		var me = this;
		var $elem = $($(this.elem).find('div.' + this.divId));
		$elem.empty();
		var domList = "", paginationDiv = "";
		var template = $.template(null, this.templateConfig);
		var recCount = (records.length > this.perPage)?this.perPage:records.length;
		for ( var ind = 0; ind < recCount; ind++) {
			records[ind]['RECORD_CURR'] = ind;
			temp = $.tmpl(template, records[ind]).html();
			/**
			 * Added a division to wrap each item in a tiles widget and
			 * to assign alternative color to items
			 */
			var itemNo = ind + 1;
			temp = '<div class="catalog-item-wrapper catalog-item-wrapper_'+me.WIDGET_ID 
					+ ((itemNo % 2) == 0 ? ' alternative-bg' : '')
					+ '">' + temp + '</div>';
			if (ind == records.length - 1) {
				domList += '<span class="last-row">' + temp + '</span>';
			} else {
				domList += temp;
			}
		}
		if (!cbx.core.isEmpty(domList)) {
			$elem.append(domList);
		} else {
			$elem.append(me.rb['LBL_EMPTY']);
		}
		

		$($(this.elem).find('*[data-action="true"]')).on("click", {
			scope : me
		}, me.handleClick);

		$($(this.elem).find('*[data-input="true"]')).on("change", {
			scope : me
		}, me.handleInputChange);
		setTimeout(function ()
					{
		me.viewConf.raiseEvent(CWEC.AFTER_TEMPLATE_LOAD, {
			elem : $(me.templateConfig),
			uData : me.uData
		});

				}, 500);
	},
	
	/**
	 * 
	 */
	paginateTable : function() {
		var me = this;
		this.paginationSelector = $('#' + this.paginationId)
				.cbxPagination({
					items : me.count,
					itemsOnPage : me.perPage,
					scope : me,
					handlePaginationClick : me.handlePaginationClick
				});
	},
	
	/**
	 * 
	 */
	handlePaginationClick : function (currentPage, evtObj, totalRecs, items)
	{
		this.paginationTriggered = true;
		LOGGER.info('Pagination ', [ currentPage, evtObj, totalRecs, items ]);
		this.currentPage = currentPage; 
		var pagingParams = {};
		var startRes = Math.abs((currentPage - 1) * this.perPage);
		pagingParams.start = startRes
		pagingParams.limit = this.perPage;
		cbx.core.extend(this.store.getParams(), pagingParams);
		this.reloadData();
	},
	
	/**
	 * 
	 */
	handleClick : function(evtObj) {
		var me = evtObj.data.scope, cell = this;
		var record = me.store.getAt($(cell).attr('RECORD_CURR'));
		var subRecord = $(cell).attr('SUB_RECORD_CURR');
		var colId = $(cell).attr('COLUMN_ID');
		me.viewConf.raiseEvent(CWEC.CELL_CLICK, {
			record : record,
			columnId : colId,
			subRecord : subRecord
		});
	},
	
	/**
	 * 
	 */
	sortUpdate : function(sortParams) {
		this.store.updateParams(sortParams);
	},
	
	/**
	 * 
	 */
	handleInputChange : function(evtObj) {
		var me = evtObj.data.scope, cell = this;
		var record = me.store.getAt($(cell).attr('RECORD_CURR'));
		var subRecord = $(cell).attr('SUB_RECORD_CURR');
		var colId = $(cell).attr('COLUMN_ID');
		record[colId] = $(this).val();
		me.viewConf.raiseEvent(CWEC.CELL_DATA_CHANGE, {
			record : record,
			columnId : colId,
			subRecord : subRecord
		});
	},
	setGridModifiedColumn : function (record, modifyClm, colId, alterRec)
	{
		LOGGER.info('modifyClm ', [ record, modifyClm ]);
		if (!cbx.isEmpty(modifyClm.columnId))
		{
			var elem = $(this.elem).find('tbody').find("tr[record_curr=" + record.REC_CURR + "]").find(
						"[column_id=" + modifyClm.columnId + "]");
			record[modifyClm.columnId] = (modifyClm.val || "");
			if (!cbx.isEmpty(elem))
			{
				var value = modifyClm.val ? modifyClm.val : '';
				elem.val(value);
				elem.text(value);
			}
		}

	},
	setModifiedColumn : function (record, modifyClm, colId, alterRec)
	{
		var me=this;
		LOGGER.info('modifyClm ', [ record, modifyClm ]);
		if (!cbx.isEmpty(modifyClm.columnId))
		{

			var elem = $($(me.elem).find('div#' + me.divId));

			elem.find("[record_curr=" + record.REC_CURR + "]").each(function() {
				if($(this).attr('COLUMN_ID')==modifyClm.columnId){
					var value = modifyClm.val ? modifyClm.val : '';
					$(this).val(value);
					$(this).text(value);
				}

			});

			record[modifyClm.columnId] = (modifyClm.val || "");
		}
	},

	/**
	 * 
	 */
	setColumnData : function (record, modifyClm, colId, alterRec,type)
	{
		if (cbx.isObject(modifyClm) || cbx.isArray(modifyClm))
		{
			if (cbx.isObject(modifyClm))
			{
				this.setModifiedColumn(record, modifyClm, colId, alterRec);
			}
			if (cbx.isArray(modifyClm))
			{
				for (var j = 0; j < modifyClm.length; j++)
				{
					var modifyClmIndex = modifyClm[j];
					if (cbx.isObject(modifyClmIndex))
					{
						if(!cbx.isEmpty(type) && type=="GRID"){
							this.setGridModifiedColumn(record, modifyClmIndex, colId, alterRec);
						}
						else{
							this.setModifiedColumn(record, modifyClmIndex, colId, alterRec);
						}
					}
				}
			}
		}
	},

updateParams : function (params)
{
	if (!cbx.isEmpty(params) && cbx.isObject(params))
	{
		cbx.core.extend(this.store.getParams(), params);
	}
},

/**
 * 
 */
deleteParams : function (params)
{
	if (!cbx.isEmpty(params) && cbx.isObject(params))
	{
		var storeParams = this.store.getParams();
		for (i in params)
		{
			for (j in storeParams)
			{
				if (i == j)
				{
					delete storeParams[j];
				}
			}
		}
	}
},
getRecords : function ()
{
	if (!cbx.isEmpty(this.store.records) && this.store.totalAvailableRecords > 0)
	{
		return this.store.records;
	} else
	{
		return [];
	}
},
addClass : function (record, modifyClm, className)
{
	var me=this;
	LOGGER.info('modifyClm ', [ record, modifyClm ]);
	if (!cbx.isEmpty(modifyClm.columnId))
	{

		var elem = $($(me.elem).find('div#' + me.divId));

		elem.find("[record_curr=" + record.REC_CURR + "]").each(function() {
			if($(this).attr('COLUMN_ID')==modifyClm.columnId){
				$(this).addClass(className);
			}

		});

	}
},
removeClass : function (record, modifyClm, className)
{
	var me=this;
	LOGGER.info('modifyClm ', [ record, modifyClm ]);
	if (!cbx.isEmpty(modifyClm.columnId))
	{

		var elem = $($(me.elem).find('div#' + me.divId));

		elem.find("[record_curr=" + record.REC_CURR + "]").each(function() {
			if($(this).attr('COLUMN_ID')==modifyClm.columnId){
				$(this).removeClass(className);
			}

		});

	}
},
/**
 * 
 */
getRecords : function ()
{
	if (!cbx.isEmpty(this.store.records))
	{
		return this.store.records;
	} else
	{
		return [];
	}
}
});
CLCR.registerCmp({'COMP_TYPE' : 'APP','VIEW_TYPE' : 'TILE'}, canvas.lib.view.TileView);
