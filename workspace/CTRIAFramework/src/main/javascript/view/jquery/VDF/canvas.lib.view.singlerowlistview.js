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
 * This class contains the lib specific ListView confined to the widget / app.
 */
canvas.lib.view.SingleRowListView = Class(cbx.core.Component,{
	/**
	 * 
	 */
	initialize : function() {
		var me = this;
		me.loaded = false;
		var elem = me.elem;
		var appId = 'cbx-app-' + me.WIDGET_ID + "_" + me.md.getViewId();
		this.pageSize = me.md.FLD_RECORDS_PER_PAGE;
		elem.append('<div class="' + me.WIDGET_ID + '"><span class="' + appId + '" ITEM_ID="WGT_' + me.WIDGET_ID + '"></span></div>');
		elem = $(elem.find('span.' + appId));
		me.setCmp(elem);
		me.elem.on("remove", function() {
			me.destroy();
		});
		this.contextMenu = me.md.getContextMenu();
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
		// Binding uData with Params
		if (me.uData) {
			cbx.core.extend(params, me.uData);
		}
		var extraParams = {};
		me.viewConf.raiseEvent(CWEC.EXTRA_PARAMS_HDLR, extraParams);
		if (extraParams) {
			cbx.core.extend(params, extraParams);
		}
		this.store = new cbx.core.Store({
			params : params,
			listeners : {
				"load" : me.loadData
			},
			scope : me,
			accumulate : false,
			autoLoad : true,
			reader : {
				root : 'response.value.ALL_RECORDS',
				totalProperty : 'response.value.TOTAL_COUNT'
			},
			bufferSize : this.pageSize != null ? this.pageSize : 3
		});

		// setting up the header
		elem.empty();
		var displayKey = me.WGT_TITLE || me.md.getViewTitle();
		var title = me.rb[displayKey] || displayKey;
		if (!cbx.core.isEmpty(title) && me.loadingInContainer !== true && me.WGT_HEADER_IND=='Y') {
			$(elem)
			.append(
						'<div id="page-title" role="heading" '
						+ 'class="displayinline container page-title accessible-area accessibility-contrast-normal col19 '
						+ me.WIDGET_ID + '-title">' + '<H1>' + title + '</H1>' + '</div');
		}
		me.divId = me.WIDGET_ID + "_" + me.md.getViewId() + "_SRLIST";
		elem.append('<div id='+me.divId+' class="widget-block '
					+ (me.loadingInContainer !== true ? 'widgetcontainer widgetcontent widgetcontainer_'+me.divId+'' : '') + '"></div>');
		var bWrap = '<div class="' + me.divId + ' col20 "></div></div>';
		$(elem.find('div.widget-block')).append(bWrap);
	},

	/**
	 * 
	 */
	reloadData : function() {
		this.loaded = false;
		this.store.reload();
	},

	/**
	 * 
	 */
	loadData : function(records) {
		var me = this;
		var dataTypeMap = canvas.lib.view.datatype.getColumnTypeMap();
		var cMenu = this.contextMenu;
		var len = cMenu.length;
		var elem = me.getCmp();
		var visibleClm = me.md.getVisibleColumns();

		if (this.loaded === false) {
			this.loaded = true;
		}
		var $elem = $($(me.elem).find('div#' + me.divId));

		var domList = '';
		var template = $.template(null, this.templateConfig);

		for ( var ind = 0; ind < records.length; ind++) {
			records[ind]['RECORD_CURR'] = ind;
			temp = $.tmpl(template, records[ind]).html();

			if (ind == records.length - 1) {
				domList += '<span class="last-row">' + temp + '</span>';
			} else {
				domList += temp;
			}
		}

		$elem.empty();
		if (!cbx.core.isEmpty(domList)) {
			if(records.length==0 || records.length==1){
				var emptyMsg =(me.rb['NO_DATA_MSG_'+me.WIDGET_ID]!=undefined ?me.rb['NO_DATA_MSG_'+me.WIDGET_ID]: me.rb['NO_DATA_MSG']);
				var emptyDiv = '<div>' + emptyMsg + '</div>';
				$elem.append(emptyDiv);	
			}else{
			$elem.append(domList);
			}
		} else {
			var emptyMsg =(me.rb['NO_DATA_MSG_'+me.WIDGET_ID]!=undefined ?me.rb['NO_DATA_MSG_'+me.WIDGET_ID]: me.rb['NO_DATA_MSG']);
			var emptyDiv = '<div>' + emptyMsg + '</div>';
			$elem.append(emptyDiv);
		}

		/**
		 * attaching datatype for all the elements for which the
		 * data-format is true and the column is a visible column
		 */
		for ( var i = 0, len = visibleClm.length; i < len; i++) {
			$($(this.elem).find('*[data-format="true"][column_id="' + visibleClm[i]['FLD_COLUMN_ID'] + '"]'))
			.attr('type', dataTypeMap[me.md.getColType(visibleClm[i])]);
		}

		canvas.lib.view.datatype.applyFormatting($(elem));

		$($(this.elem).find('*[data-action="true"]')).off('click');
		$($(this.elem).find('*[data-input="true"]')).off('click');

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

	handleInputChange : function(evtObj) {
		var me = evtObj.data.scope, cell = this;
		var record = me.store.getAt($(cell).attr('RECORD_CURR'));
		var subRecord = $(cell).attr('SUB_RECORD_CURR');
		var colId = $(cell).attr('COLUMN_ID');
		record[colId] = $(this).val();
		me.viewConf.raiseEvent(CWEC.CELL_DATA_CHANGE, {
			record : record,
			columnId : colId,
			subRecord : subRecord,
			setData : function (modifyClm)
			{
				me.setColumnData(record, modifyClm, colId, false)
			}
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
/**
 * 
 */
CLCR.registerCmp({'COMP_TYPE' : 'APP','VIEW_TYPE' : 'SINGLE_ROW_LIST'}, canvas.lib.view.SingleRowListView);
