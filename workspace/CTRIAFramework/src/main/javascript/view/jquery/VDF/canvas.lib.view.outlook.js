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
 * <pre>
 * This class follow the CT Component life cycle and is responsible for
 * rendering a Grouping Header with column level grouping upto 2 levels that also supports the following: 
 * - Remote Sorting
 * - Grouping header
 * content The class uses JQuery  FooTable plugin  for rendering remote sort with responsive table.
 * </pre>
 * 
 * @class canvas.lib.view.outlook(Grouped Header,Remote sorting)
 */
canvas.lib.view.outlook = Class(cbx.core.Component,	{
	/**
	 * 
	 */
	initialize : function() {
		var vs_values =new Array();
		var me = this;
		me.loaded = false;
		var elem = me.elem;
		var appId = 'cbx-app-' + me.WIDGET_ID + "_" + me.md.getViewId()
		this.pageSize = me.md.FLD_RECORDS_PER_PAGE;
		/**
		 * Create the span tag for the particular widget 
		 */
		elem.append('<span class="' + appId + '" ITEM_ID="WGT_' + me.WIDGET_ID + '"></span>');
		elem = $(elem.find('span.' + appId));
		me.setCmp(elem);
		elem.on("remove", function() {
			me.destroy();
		});
		this.contextMenu = me.md.getContextMenu();
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
				'load' : me.loadData,
				'beforeload' : me.preLoad
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
		var displayKey = me.WGT_TITLE || me.md.getViewTitle();
		var title = me.rb[displayKey] || displayKey;
		var cMenu = me.contextMenu;
		var visibleClm = me.md.getVisibleColumns();
		var defaultSort = "";
         /**
		  * Attaching the Widget title HTML DOM to the
		  * Widget Container HTML contains. 
		  */	
		elem.append('<div class="widget-block '+(me.loadingInContainer !== true?'widgetcontainer':'')+'"></div>');
		LOGGER.info("grid =", me.loadingInContainer);
		if (!cbx.core.isEmpty(title) && me.loadingInContainer !== true) {
			$(elem.find('div.widget-block'))
					.append(
							'<div id="page-title" role="heading" '
									+ 'class="displayinline container page-title accessible-area accessibility-contrast-normal col19'
									+ me.WIDGET_ID + '-title">' + '<H1>' + title + '</H1>' + '</div');
		}
		var myTable = '';
		var tableId = me.WIDGET_ID + "_" + me.md.getViewId() + "_TABLE";
		 /**
		  * Check the sort position is not null to apply remort sort as per sorting configured 
		  * for the particluiar column
		  *  
		  */	
		for ( var i = 0; i < visibleClm.length; i++) {
			if (visibleClm[i].FLD_SORT_POSITION != "") {
				this.sortConfig = {
					"sort" : visibleClm[i].FLD_COLUMN_ID,
					"dir" : (visibleClm[i].FLD_SORT_ORDER == "" ? "ASC" : visibleClm[i].FLD_SORT_ORDER)
				};
			}
		}

		myTable='<table id="'+tableId+'" class="striped footable"">'
		myTable += '<thead>';
		myTable += '<tr>';
		var cellTitle = '';
		var count = 0;
		/**
		 * Populating the grouped parent header as HTML table header by checking  
		 * their parent column id should be null 
		 */	
		for ( var i = 0; i < visibleClm.length; i++) {
			if(visibleClm[i].FLD_PARENT_COLUMN_ID=="")	{
				cellTitle = me.rb[visibleClm[i].FLD_COLUMN_DISPLAY_NAME_KEY] != null ? me.rb[visibleClm[i].FLD_COLUMN_DISPLAY_NAME_KEY]
						: visibleClm[i].FLD_COLUMN_DISPLAY_NAME_KEY;
				/**
				 * Counting number of  Column span to the parent header HTML element  
				 * by checking with current column id as parent column id to the some other column      
				 */			
				for ( var z = 0; z < visibleClm.length; z++) {
					if (visibleClm[z].FLD_PARENT_COLUMN_ID==visibleClm[i].FLD_COLUMN_ID)	 {
						count = count + 1;
					}
				}
				/**
				 *  Populating Columns span number as per the count   
				 */	
				myTable += count!=0?'<th scope="col" colspan="'+count+'" class="tblheading optional-mobile">'+cellTitle +'</th>': '<th scope="col" class="tblheading footable-first-column">'+cellTitle+'</th>';
				count = 0;
			}
		}
		myTable += '</tr>';
		myTable += '<tr class="sub-thead">';
		/**
		 * Applying sub heading as another <TR> element which has sub heading by checking their 
		 * parent Column id should not be null and also check their parent column id which was 
         * created as main heading.The count variable used here as to check the the parent header
         * has no child or not,According to that we will construct the child header.				 
		 */
		for ( var k = 0; k < visibleClm.length; k++)
		{
			var sortEnabled = visibleClm[k].FLD_SORTABLE_IND == "N" ? "true" : "false";
			
			if (visibleClm[k].FLD_PARENT_COLUMN_ID!="")
			{   
				cellTitle=visibleClm[k].FLD_COLUMN_DISPLAY_NAME_KEY;
				if (!cbx.isEmpty(this.sortConfig)) {
					if (this.sortConfig.sort == visibleClm[k].FLD_COLUMN_ID) {
						var dir = !cbx.isEmpty(this.sortConfig.dir) && this.sortConfig.dir.toUpperCase() == "DESC" ? "descending"
								: "true";
						defaultSort = "data-sort-initial=" + dir;
					}
					/**
					 * Applying remote sorting for the sub heading according to the sortEnabled configuration 
					 */
					myTable += '<th  ' + defaultSort + ' data-sort-ignore="' + sortEnabled + '" class="th-no-bg-color" title="'
							+ cellTitle + '">' + cellTitle + '</th>';
					defaultSort = "";
				} 
				else {
					myTable += '<th  data-sort-ignore="' + sortEnabled + '" class="th-no-bg-color" title="' + cellTitle + '">'
							+ cellTitle + '</th>';
				}
			}
			else {
				for ( var l = 0; l < visibleClm.length; l++) {
					if(visibleClm[k].FLD_COLUMN_ID==visibleClm[l].FLD_PARENT_COLUMN_ID)	{
						count=1;   
					}
				}
				if(count==0)
				{
					cellTitle=" ";
					if (!cbx.isEmpty(this.sortConfig)) {
						if (this.sortConfig.sort == visibleClm[k].FLD_COLUMN_ID) {
							var dir = !cbx.isEmpty(this.sortConfig.dir) && this.sortConfig.dir.toUpperCase() == "DESC" ? "descending"
									: "true";
							defaultSort = "data-sort-initial=" + dir;
						}
						myTable += '<th  ' + defaultSort + ' data-sort-ignore="' + sortEnabled + '" class="th-no-bg-color" title="'
								+ cellTitle + '">' + cellTitle + '</th>';
						defaultSort = "";
					} else {
						myTable += '<th  data-sort-ignore="' + sortEnabled + '" class="th-no-bg-color" title="' + cellTitle + '">'
								+ cellTitle + '</th>';
					}
				}
				count=0;
			}
		}
		
		if (cMenu.length > 0) {
			myTable += '<th>Actions</th>';
		}

		myTable += '</tr>';
		myTable += '</thead>';
		myTable += '<tbody>';
		myTable += '</tbody>';
		myTable += '</table>';

		$(elem.find('div.widget-block')).append(myTable);
		this.grid = $(me.elem).find('#' + tableId);
		this.grid.footable({
			sortCallBackFn : function(header, column) {
				me.handlesort(header, column);
			}
		});

	},
	/**
	 * Preload handler for the store, called before the server response
	 * is processed
	 */
	preLoad : function(result) {
		LOGGER.info('result==', result)
	},
	
	/**
	 * 
	 */
	reloadData : function() {
		this.loaded = false;
		this.store.reload();
	},
	/**
	 * This method will be called by the listener load in  store instantiation has loaded data and shares
	 * all the records from the data
	 * 
	 * @records List of records
	 */
	loadData : function (records){
		LOGGER.info("Records for the data column", records);
		var me = this;
		var colTypeMap = canvas.lib.view.datatype.getColumnTypeMap();
		var cMenu = this.contextMenu;
		var len = cMenu.length;
		var elem = me.getCmp();
		var visibleClm = me.md.getVisibleColumns();
		var tRows = '';
		var rowClass = '';

		for (var ind = 0; ind < records.length; ind++)
		{
			tRows += '<tr  class="earn-up-text" RECORD_CURR="' + ind + '">';
			for (var j = 0; j < visibleClm.length; j++)
			{
				if (visibleClm[j]["FLD_DD_REQ_IND"] == "Y")
				{
					tRows += '<a class="drilldown" data-action="true"  href="JAVASCRIPT:void(0)" RECORD_CURR="'
								+ ind + '">' + records[ind][visibleClm[j]["FLD_COLUMN_ID"]] + '</a>';

				} 
				else
				{
					if (visibleClm[j].FLD_HIDDEN_IND != "Y")
					{
						tRows += '<td  class="col-left" id= "td_' + ind + '" RECORD_CURR="' + ind
									+ '" type="' + colTypeMap[me.md.getColType(visibleClm[j])] + '">';
						if (visibleClm[j]["FLD_COLUMN_ID"] == 'RATINGS_PREV'
									|| visibleClm[j]["FLD_COLUMN_ID"] == 'RATINGS_CURR')
						{
							var check = records[ind][visibleClm[j]["FLD_COLUMN_ID"]];
							switch (check)
							{
								case 'SO':
									tRows += '<span class="icon01"><em>SO</em></span>';
									break;
								case "SP":
									tRows += '<span class="icon01 icon01-grey"><em>SP</em></span>';
									break;
								case "SU":
									tRows += '<span class="icon01 icon01-red"><em>SU</em></span>';
									break;
							}
						} 
						else
						{
							tRows += records[ind][visibleClm[j]["FLD_COLUMN_ID"]];
							if (visibleClm[j]["FLD_COLUMN_ID"] == 'PRICE_TGT_CURR')
							{
								tRows += '<span class="sign" title="up"></span>';

							}
						}
					}
				}
			}
			tRows += '</td>';
		}
		if (cMenu.length > 0)
		{
			if (cMenu.length > 1)
			{
				tRows += '<td class="cbx-type-menu" cbx-type="menu" width="30%">';
			} else
			{
				tRows += '<td class="cbx-type-menu" cbx-type="menu" width="25%">';
			}
			for (var k = 0; k < cMenu.length; k++)
			{
				tRows += '<a class="button blue" href="#" menu-id="' + cMenu[k]['MENU_ID']
							+ '" RECORD_CURR="' + ind + '">' + cMenu[k]['TITLE'] + '</a>';
			}
			tRows += '</td>';
		}
		tRows += '</tr>';

		if (this.grid != null)
		{
			$(this.grid).find('tbody').empty();
			if (records.length > 0)
			{
				$(this.grid).find('tbody').append(tRows);
			} else
			{
				var eRow = '<tr><td colspan="' + visibleClm.length + '">No data avilable at this time.'
							+ me.rb['LBL_EMPTY'] + '</td></tr>';
				$(this.grid).find('tbody').append(eRow);
			}
		}
		canvas.lib.view.datatype.applyFormatting($(elem));
		$tds = $(me.elem).find('table').find('tr > td').not('tr > td.cbx-type-menu');

		$tds.unbind('click');
		$tds.bind("click", {
			scope : me
		}, me.handleCellClick);

		$drillDown = $(me.elem).find('[data-action="true"]');
		$drillDown.bind("click", {
			scope : me
		}, me.handleCellClick);

		$cMenu = $(me.elem).find('table').find('tr').find('td > a');
		$cMenu.on("click", {
			scope : me
		}, me.handleContextClick);
	},
	/**
	 * 
	 */
	handlesort : function(header, column) {
		this.paginationTriggered = "";
		var sortClm = this.md.getColumnNameByIndex(column.index);
		if (!cbx.isEmpty(sortClm)) {
			var sortParams = {};
			sortParams.sort = sortClm;
			sortParams.dir = column["sortOrder"] || 'ASC';
			sortParams.start = 0;
			cbx.core.extend(this.store.getParams(), sortParams);
			this.reloadData()
		}
	},
	/**
	 * 
	 */
    handleCellClick : function(evtObj) {
		var me = evtObj.data.scope, cell = this;
		var record = me.store.getAt($(cell).attr('RECORD_CURR'));
		me.viewConf.raiseEvent(CWEC.CELL_CLICK, {
			record : record
		});
	},
	
	/**
	 * 
	 */
	handleContextClick : function(evtObj) {
		evtObj.preventDefault();
		var me = evtObj.data.scope, cell = this;
		var record = me.store.getAt($(cell).attr('RECORD_CURR'));
		me.viewConf.raiseEvent(CWEC.CONTEXT_CLICK, {
			record : record,
			MENU_ID : $(cell).attr('menu-id')
		});
	}
});

/**
 * 
 */
CLCR.registerCmp({	'COMP_TYPE' : 'APP','VIEW_TYPE' : 'OUTLOOK'}, canvas.lib.view.outlook);