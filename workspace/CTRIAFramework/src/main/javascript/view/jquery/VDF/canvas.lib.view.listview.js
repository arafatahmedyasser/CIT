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
 * This class follow the CT Component life cycle and contains the lib specific ListView confined to the widget / app.
 * - Arranges the widget contents in a table (grid) view manner.
 * - Also provides bottom tool bar with toolbar buttons (based on databse configuration) and Pagination (using cbxPagination).
 * - And supports remote sort for columns of table.
 * - Selection Model
 * - Context Menu
 * </pre>
 * 
 * @class canvas.lib.view.listview
 */
canvas.lib.view.listview = Class(cbx.core.Component,{
	initialize : function ()
	{
		var me = this;
		me.selectionModel = '';
		me.loaded = false;
		me.bbar = '';
		me.perPage = !cbx.isEmpty(me.md.getRecordsPerPage()) ? parseInt(me.md.getRecordsPerPage())
					: parseInt(iportal.preferences.getDefaultRecsPerPage());
		me.paginationTriggered = '';
		var elem = me.elem;
		me.commonBundle = CRB.getFWBundle();
		this.currentPage = 1;
		this.manualSort = false;
		me.sortConfig = {};
		me.viewFilters={};
		me.filterExists=false;
		var filterTypeMap = canvas.lib.view.datatype.getFilterTypeMap();
		var appId = 'cbx-app-' + me.WIDGET_ID + "_" + me.md.getViewId()
		this.paginationId = me.WIDGET_ID + "_" + me.md.getViewId() + "_pagination"+cbx.form.util.id();
		this.tbodyCls=me.WIDGET_ID + "_" + me.md.getViewId()+"_tbody tableBody";
		this.bbarId = me.WIDGET_ID + "_" + me.md.getViewId() + "_bbar";
		this.pageSize = me.md.FLD_RECORDS_PER_PAGE;
		elem.append('<span class="' + appId + '" ITEM_ID="WGT_' + me.WIDGET_ID + '"></span>');
		elem = $(elem.find('span.' + appId));
		me.setCmp(elem);
		elem.on("remove", function ()
		{
			me.destroy();
		});
		this.contextMenu = me.md.getContextMenu();
		/**
		 * respClassMap map contains a one on one mapping COLUMN_ID: <PRIMARY|SECONDARY_1|SECONDARY_2>
		 */
		//this.respClassMap = me.md.getResponsiveClassMap();
		LOGGER.info('this.respClassMap =', this.respClassMap);
		// Default params to make the data call
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
		if (me.uData)
		{
			cbx.core.extend(params, me.uData);
		}
		/**
		 * Raising Extra Param Handler event for the app developer to provide custom params for the data
		 * call
		 */
		var extraParams = {};
		me.viewConf.raiseEvent(CWEC.EXTRA_PARAMS_HDLR, extraParams);
		if (extraParams)
		{
			cbx.core.extend(params, extraParams);
		}

		var displayKey = me.WGT_TITLE || me.md.getViewTitle();
		var title = me.rb[displayKey] || displayKey;
		var cMenu = this.cMenu = me.contextMenu;
		var visibleClm = me.md.getVisibleColumns();
		elem.append('<div class="conferences-block widgetcontainer"></div>');
		if (!cbx.core.isEmpty(title) && me.loadingInContainer !== true)
		{
			$(elem.find('div.widgetcontainer'))
						.append(
									'<div id="page-title"'+ me.WIDGET_ID+'" role="heading" '
												+ 'class="displayinline container page-title accessible-area accessibility-contrast-normal col19 '
												+ me.WIDGET_ID + '-title">' + '<H1>' + title + '</H1>'
												+ '</div');
		}
		/**
		 * Get the details of sorting columns.
		 */
		var myTable = '';
		var tableId = me.WIDGET_ID + "_" + me.md.getViewId() + "_TABLE";
		for (var i = 0; i < visibleClm.length; i++)
		{
			if (visibleClm[i].FLD_SORT_POSITION != "")
			{
				this.sortConfig = {
					"sort" : visibleClm[i].FLD_COLUMN_ID,
					"dir" : (visibleClm[i].FLD_SORT_ORDER == "" ? "ASC" : visibleClm[i].FLD_SORT_ORDER)
				};
			}
			var filter = {};
			if (visibleClm[i].FLD_FILTER_ENABLE_IND == "Y") {
				filter = {
						type : (filterTypeMap[visibleClm[i].FLD_FILTER_DATA_TYPE] == null ? "string"
									: filterTypeMap[visibleClm[i].FLD_FILTER_DATA_TYPE]),
						dataIndex : visibleClm[i].FLD_COLUMN_ID,
						filterEnabled:true
				}
				me.filterExists=true;
				
			}else{
				filter = {
						filterEnabled:false,
						dataIndex : visibleClm[i].FLD_COLUMN_ID
				}
			}
			me.viewFilters[visibleClm[i].FLD_COLUMN_ID]=filter;
		}

		/**
		 * Creating the base table structure
		 */
		myTable += '<div class= "table-res">'
		myTable += '<table id="' + tableId + '" class="striped footable">';
		myTable += '<thead>';
		myTable += '<tr>';
		/**
		 * Based on database configuration, create an additional column for row selection in case the
		 * selection model is enabled
		 */
		if(!cbx.isEmpty(me.md.getSelectionType())){
			if(me.md.getSelectionType()=="SINGLE")
				myTable += '<th  data-sort-ignore="true"  data-ft-control="checkbox"></th>';
			else
				myTable += '<th  data-sort-ignore="true"><input type="checkbox" value="ALL" data-chk-All="true" /></th>';	
			this.selectionModel=me.md.getSelectionType();
		}
		var cellTitle = '';
		var cellTooltip = '';
		var defaultSort = "";
		for (var i = 0; i < visibleClm.length; i++)
		{
			/**
			 * Based on database configuration, include the attributes for header of sorting column
			 */
			var sortEnabled = visibleClm[i].FLD_SORTABLE_IND == "N" ? "true" : "false";

			cellTitle = me.rb[visibleClm[i].FLD_COLUMN_DISPLAY_NAME_KEY] != null
						? me.rb[visibleClm[i].FLD_COLUMN_DISPLAY_NAME_KEY]
						: visibleClm[i].FLD_COLUMN_DISPLAY_NAME_KEY;

			cellTooltip = me.rb[visibleClm[i].FLD_COLUMN_DISPLAY_NAME_KEY + '_TOOLTIP'] || cellTitle;
			if (!cbx.isEmpty(this.sortConfig))
			{
				if (this.sortConfig.sort == visibleClm[i].FLD_COLUMN_ID)
				{
					var dir = !cbx.isEmpty(this.sortConfig.dir)
								&& this.sortConfig.dir.toUpperCase() == "DESC" ? "descending" : "true";
					defaultSort = "data-sort-initial=" + dir;
				}
				myTable += '<th  ' + defaultSort + ' data-sort-ignore="' + sortEnabled + '"  title="'
							+ cellTooltip + '" class="'/* + this.respClassMap[visibleClm[i].FLD_COLUMN_ID]*/
							+ '">' + cellTitle + '</th>';
				defaultSort = "";
			} else
			{
				myTable += '<th  data-sort-ignore="' + sortEnabled + '"  title="' + cellTitle + '" class="'
							/*+ this.respClassMap[visibleClm[i].FLD_COLUMN_ID]*/ + '">' + cellTitle + '</th>';
			}
		}
		/**
		 * Based on database configuration, create an additional column for context menu
		 */
		if (cMenu.length > 0)
		{
			myTable += '<th data-sort-ignore="true">Actions</th>';
		}	
		myTable += '</tr>';
		myTable += '</thead>';
		myTable += '<tbody  class="'+this.tbodyCls+'">';
		myTable += '</tbody>';
		myTable += '<tfoot>';
		myTable += '</tfoot>';
		myTable += '</table>';
		myTable += '</div>';
		if (!cbx.isEmpty(this.sortConfig))
		{
			cbx.core.extend(params, this.sortConfig);
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
				totalProperty : 'response.value.TOTAL_COUNT',
				additionalData : 'response.value.ADDITIONAL_DATA',
				idProperty : 'response.value.ADDITIONAL_DATA.UNIQUE_COLUMN'
			},
			bufferSize : this.pageSize != null ? this.pageSize : 10
		});

		$(elem.find('div.widgetcontainer')).append(myTable);

		if(!cbx.isEmpty(me.md.getBBarButtons())){
			 me.bbar=me.updateBBar(me.md);
			 $(elem.find('div.widgetcontainer')).append('<div class=bbar id="' + this.bbarId
								+ '" >'+ me.bbar+'</div>');	  
		}

		if (me.md.getContextActionInd() == 'Y')
		{
			var rb = me.commonBundle;
			var contextText = rb && rb['LBL_' + me.md.getViewId() + '_STANDARDNOTE'] ? rb['LBL_'
						+ me.md.getViewId() + '_STANDARDNOTE'] : "";
			if (!cbx.isEmpty(contextText))
			{
				$(elem.find('div.widgetcontainer')).append(
							'<div class=contextText id="' + me.WIDGET_ID + "_" + me.md.getViewId()
										+ '"_contextText" >' + contextText + '</div>');
			}
		}
		this.grid = $(me.elem).find('#' + tableId);
		this.grid.footable({
			sortCallBackFn : function (header, column)
			{
				me.handlesort(header, column);
			}
		});

	},
	
	/**
	 * 
	 */
	preLoad : function (result)
	{
		// LOGGER.info('result==', result);
	},
	/**
	 * 
	 */
	createFilterColumns:function(){
		var filterRows = "";
		var me = this;
		if (me.filterExists && !cbx.isEmpty(me.viewFilters))
		{
			filterRows = '<tr>';
			for ( var i in me.viewFilters)
			{
				filterRows += '<td>'
				if (me.viewFilters[i].filterEnabled)
				{
					filterRows += '<input type=text data-action="filter" class=clmFilter clmId="'
								+ me.viewFilters[i].dataIndex + '" id="' + me.viewFilters[i].dataIndex
								+ '_FILTER"/>'
				}
				filterRows += '</td>'
			}
			if (me.cMenu.length > 0)
			{
				filterRows += '<td></td>';
			}

			if (!cbx.isEmpty(me.selectionModel))
			{
				filterRows += '<td></td>';
			}
			filterRows += '</tr>';
		}
		return filterRows;	
	},
	
	/**
	 * 
	 */
	reloadData : function ()
	{
		this.loaded = false;
		this.store.reload();
		$(this.elem).find('[data-chk-All="true"]').prop('checked',false);
	},
	/**
	 * 
	 */
	clearElement:function() {
		var appId = 'cbx-app-' + this.WIDGET_ID + "_" + this.md.getViewId();
		$(this.elem.find('span.' + appId)).remove();
	},
	/**
	 * 
	 */
	updateBBar : function (md)
	{
		var me = this;
		var bBars = null;
		var domStr = '';
		if (md != null)
		{
			bBars = md.getBBarButtons();
			if (bBars != null)
			{
				var rb = me.commomBundle;
				var title = '', btn = null;
				var posBtns = bBars.POSITIVE_BUTTONS;
				var negBtns = bBars.NEGATIVE_BUTTONS;

				for (var i = 0, len = posBtns.length; i < len; i++)
				{
					btn = posBtns[i];
					title = rb[btn.FLD_BTN_DISPLAY_NM] != null ? rb[btn.FLD_BTN_DISPLAY_NM]
								: btn.FLD_BTN_DISPLAY_NM;
					if (i == 0)
					{
						domStr += '<span class=posBtn>';
					}

					domStr += '<a data-role-button="bbar"  data-button-id="' + btn.FLD_BBAR_BTN_ID
								+ '" data-widget-id="' + btn.FLD_WIDGET_ID + '"  class="btn-pos">' + title
								+ '</a>&nbsp;';

					if (i == posBtns.length - 1)
					{
						domStr += '</span>';
					}

				}
				for (var i = 0, len = negBtns.length; i < len; i++)
				{
					btn = negBtns[i];
					title = rb[btn.FLD_BTN_DISPLAY_NM] != null ? rb[btn.FLD_BTN_DISPLAY_NM]
								: btn.FLD_BTN_DISPLAY_NM;
					if (i == 0)
					{
						domStr += '<span class=negBtn>';
					}
					domStr += '<a data-role-button="bbar"  data-button-id="' + btn.FLD_BBAR_BTN_ID
								+ '" data-widget-id="' + btn.FLD_WIDGET_ID + '"  class="btn-neg">' + title
								+ '</a>&nbsp;';

					if (i == negBtns.length - 1)
					{
						domStr += '</span>';
					}
				}
			}
		}
		return domStr;
	},
	
	/**
	 * 
	 */
	loadData : function (records)
	{
		var me = this;
		if(records!=null){
			var count = records.length;
			if(records.length > 0){
				count = records[0].TOTAL_ROWS;
			}
	        me.viewConf.raiseEvent(CWEC.DATA_LOADED, {
	        	totalRows : count
	        });
	    }
		var commonBundle = CRB.getFWBundle();
		var colTypeMap = canvas.lib.view.datatype.getColumnTypeMap();
		var cMenu = this.contextMenu;
		var len = cMenu.length;
		var elem = me.getCmp();
		var visibleClm = me.md.getVisibleColumns();
		this.count = this.store.totalAvailableRecords || 0;
		var bBar = $(elem.find('#' + this.bBarId));
		if (!cbx.isEmpty(this.paginationSelector))
		{
			if (this.count !== this.paginationSelector.cbxPagination('getItemsCount'))
			{
				me.paginationTriggered = "";
				this.paginationSelector.cbxPagination('destroy');
				this.paginationSelector = "";
				var pagingParams = {};
				pagingParams.start = 0;
				$(this.grid).find('tfoot').empty();
				cbx.core.extend(this.store.getParams(), pagingParams);
				//this.currentPage = 1;
				this.reloadData(records);
				return;
			}
		}
		var tRows = '';
		var rowClass = '';
		this.templateConfig = this.md.md.VIEW_MD.TEMPLATE_CONFIG;
		if(!cbx.isEmpty(this.templateConfig)){
			var template = $.template(null, this.templateConfig);
			var temp;
			for ( var ind = 0; ind < records.length; ind++) {
				records[ind]['RECORD_CURR'] = ind;
				temp = $.tmpl(template, records[ind]).html();
				tRows+='<tr class="" RECORD_CURR="' + ind+'">';
				tRows += temp;
				tRows+='</tr>';						
			}
			$(me.elem).find('[data-chk-single="true"]').each(function() { 
					if($(this).checked==true){
					me.store.addSelectedData($(this).attr('RECORD_CURR'))
				}		                  
            });
		}
 		else
		{
			for (var ind = 0; ind < records.length; ind++)
			{
				tRows += '<tr  class="' + rowClass + '" RECORD_CURR="' + ind + '">';
				for (var j = 0; j < visibleClm.length; j++)
				{
					tRows += '<td class="col-left" id= "td_' + j + '" RECORD_CURR="' + ind + '" type="'
								+ colTypeMap[me.md.getColType(visibleClm[j])] + '">';

					if (records[ind][visibleClm[j]] == "")
					{
						tRows += "&nbsp;";
					} else
					{
						col = visibleClm[j];
						coreTemp = me.md.getColTemplate(col);

						if (!cbx.core.isEmpty(coreTemp))
						{
							template = $.template(null, coreTemp);
							colVal = $.tmpl(template, records[ind]).html();
						} else
						{
							colVal = records[ind][visibleClm[j]["FLD_COLUMN_ID"]];
						}

						if (visibleClm[j]["FLD_DD_REQ_IND"] == "Y")
						{
							if (colVal)
							{
								tRows += '<a class="drilldown" data-drill="true"  COLUMN_ID="'
											+ visibleClm[j]["FLD_COLUMN_ID"]
											+ '" href="JAVASCRIPT:void(0)" RECORD_CURR="' + ind + '">'
											+ colVal + '</a>';
							} else
							{
								tRows += '<span COLUMN_ID="' + visibleClm[j]["FLD_COLUMN_ID"]
											+ '" RECORD_CURR="' + ind + '">--</span>';
							}

						} else
						{
							tRows += colVal;
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
						tRows += '<td class="cbx-type-menu" cbx-type="menu" width="10%">';
					}
					for (var k = 0; k < cMenu.length; k++)
					{
						tRows += '<img class="' + cMenu[k]['ICON_CLS'] + '" src="'
									+ (cMenu[k]['ICON'] ? cMenu[k]['ICON'] : cbx.BLANK_IMAGE_URL)
									+ '"  menu-id="' + cMenu[k]['MENU_ID'] + '" RECORD_CURR="' + ind
									+ '"></img>';
					}
					tRows += '</td>';
				}
				if (!cbx.isEmpty(this.selectionModel))
				{
					$checkStatus = records[ind]["CHECKED"]
								&& (records[ind]["CHECKED"] == 'Y' || records[ind]["CHECKED"] == 'true' || records[ind]["CHECKED"] == true)
								? true : false;
					tRows += '<td class="cbx-type-checkbox" cbx-type="checkbox">';
					if ($checkStatus && me.store.addSelectedDataOnFly(ind) == true)
					{
						tRows += '<input type="checkbox" checked=true data-checked="true" data-chk-single="true" RECORD_CURR="'
									+ ind + '"/>';
					} else
					{
						tRows += '<input type="checkbox"  data-checked="false" data-chk-single="true"   RECORD_CURR="'
									+ ind + '"/>';
					}
					tRows += '</td>';

				}
				tRows += '</tr>';
			}

		}
		if (this.grid != null)
		{
			$(this.grid).find('tbody').empty();
			$colspan = visibleClm.length;
			if (!cbx.isEmpty(this.selectionModel))
			{
				$colspan = $colspan + 1;
			}
			if (cMenu.length > 0)
			{
				$colspan = $colspan + 1;
			}
			var $tfoot = $(this.grid).find('tfoot');

			if (records.length > 0)
			{
				$(this.grid).find('tbody').append(tRows);
				if (this.count > this.perPage)
				{
					if (cbx.isEmpty(this.paginationTriggered))
					{
						$tfoot.empty();
						if (!cbx.isEmpty(this.paginationSelector))
							this.paginationSelector.cbxPagination('destroy');
						tableFooter = $tfoot.append($("<tr/>").append(
									$("<td/>").attr('colspan', $colspan).html(
												'<div class=pagination-centered id="' + this.paginationId
															+ '" ></div>')));
						this.paginateTable();
					}
				} 
				else
				{
					$tfoot.empty();
				}

			} 
			else
			{
				$tfoot.empty();
				var eRow = '<tr class="NO_DATA_MSG"><td colspan="' + $colspan + '">'
							+ commonBundle['NO_DATA_MSG'] + '</td></tr>';
				$(this.grid).find('tbody').append(eRow);
			}
		}
		canvas.lib.view.datatype.applyFormatting($(elem));

		$tds = $(me.elem).find('table').find('tr > td.col-left');

		/**
		 * attaching local handlers to all the action-able elements.
		 */
		$tds.unbind('click');
		$tds.bind("click", {
			scope : me
		}, me.handleCellClick);

		$drillDown = $(me.elem).find('[data-drill="true"]');
		$drillDown.unbind('click');
		$drillDown.bind("click", {
			scope : me
		}, me.handleDrillDownClick);
		
		this.handleCellEdit();
		this.handleCellActionClick();
		this.handleSingleSelectBox();
		this.handleMultipleSelectBox();
		
		$cMenu = $(me.elem).find('table').find('tr').find('td > img');
		$cMenu.unbind('click doubleclick');
		$cMenu.on("click", {
			scope : me
		}, me.handleContextClick);

		$bbar = $(me.elem).find('[data-role-button="bbar"]');
		$bbar.unbind('click');
		$bbar.on("click", {
			scope : me
		}, me.handleBBARClick);
		
		Sfilter=$(me.elem).find('[data-action="filter"]');
		Sfilter.unbind('keypress');
		Sfilter.on("keypress", {
			scope : me
		}, me.handleNumericFilter);
		
		SfieldreadOnly=$(me.elem).find('[data-edit="false"]');
		SfieldreadOnly.unbind('keypress');
		SfieldreadOnly.on("keypress", {
			scope : me
		}, function(){
			return false;
		});

		/**
		 * Attaching handler on check boxes in case the selection model is enabled
		 */
		if(!cbx.isEmpty(me.selectionModel) && !cbx.isEmpty(me.store.selectedDataMap)){
			$(me.elem).find('[data-chk-single="true"]').each(function() {
				var isExists=me.store.getSelectedDataByRec($(this).attr('RECORD_CURR'));
				if(isExists){
				$(this).prop('checked',true);
				}
			
			});
		}
	},
	
	/***
	 * 
	 */
	handleCellEdit : function ()
	{
		var me = this;
		$editFields = $(me.elem).find('[data-input="true"]');
		$editFields.unbind('change');
		$editFields.bind("change", {
			scope : me
		}, me.handleInputChange);
	},
	
	/**
	 * 
	 */
	handleCellActionClick : function ()
	{
		var me = this;
		$editFields = $(me.elem).find('[data-action="true"]');
		$editFields.unbind('click');
		$editFields.bind("click", {
			scope : me
		}, me.handleActionButtonClick);
	},
	
	/**
	 * 
	 */
	handleSingleSelectBox : function ()
	{
		var me = this;
		$checkboxradio = $(me.elem).find('[data-chk-single="true"]');
		$checkboxradio.unbind('click');
		$checkboxradio.bind("click", {
			scope : me
		}, me.handleCheckboxRadio);
	},
	
	/**
	 * 
	 */
	handleMultipleSelectBox:function(){
		var me=this;
		$checkboxradiomulti = $(me.elem).find('[data-chk-All="true"]');
		$checkboxradiomulti.unbind('click');
		$checkboxradiomulti.bind("click", {
			scope : me,
			chkBox:$(me.elem).find('[data-chk-single="true"]')
		}, me.handleCheckboxMultiRadio);
	},
	
	/**
	 * 
	 */
	handleActionButtonClick : function (evtObj)
	{
		var me = evtObj.data.scope, cell = this;
		evtObj.stopPropagation();
		var record = me.store.getAt($(cell).attr('RECORD_CURR'));
		var colId = $(cell).attr('COLUMN_ID');
		me.viewConf.raiseEvent(CWEC.CELL_ACTION, {
			record : record,
			columnId : colId
		});
	},
	
	/**
	 * 
	 */
	handleInputChange : function (evtObj)
	{
		var me = evtObj.data.scope, cell = this;
		if (me.store != undefined)
		{
			var record = me.store.getAt($(cell).attr('RECORD_CURR'));
		}
		var mfyId = $(cell).attr('MODIFY_ID');
		var colId = $(cell).attr('COLUMN_ID');
		record[colId] = $(this).val();
		me.viewConf.raiseEvent(CWEC.CELL_DATA_CHANGE, {
			record : record,
			columnId : colId,
			setData : function (modifyClm)
			{
				me.setColumnData(record, modifyClm, colId, false)
			}
		});
	},	
	
	/**
	 * 
	 */
	setModifiedColumn : function (record, modifyClm, colId, alterRec)
	{
		LOGGER.info('modifyClm ', [ record, modifyClm ]);
		if (!cbx.isEmpty(modifyClm.columnId))
		{
			var elem = $(this.grid).find('tbody').find("tr[record_curr=" + record.REC_CURR + "]").find(
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
	
	/**
	 * 
	 */
	setColumnData : function (record, modifyClm, colId, alterRec)
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
						this.setModifiedColumn(record, modifyClmIndex, colId, alterRec);
					}
				}
			}
		}
	},
	
	/**
	 * 
	 */
	handleNumericFilter : function (evtObj)
	{
		var me = evtObj.data.scope, cell = $(this);
		clmId = cell.attr('clmid');
		// me.paginationTriggered="";
		columnAttr = me.viewFilters[clmId];
		if (!cbx.isEmpty(columnAttr))
		{
			$filterType = columnAttr["type"];
			if ($filterType == "int" || $filterType == "float")
			{
				var keycode = evtObj.keyCode ? evtObj.keyCode : evtObj.which;
				if (keycode !== 8 && keycode !== 46)
				{
					var exp = String.fromCharCode(evtObj.charCode);
					var r = new RegExp("[0-9]", "g");
					if (exp.match(r) == null)
					{
						evtObj.charCode = 0;
						return false;
					}
				}
			}
		}
	},
	
	/**
	 * 
	 */
	getFilterParams : function ()
	{
		var me = this;
		var filterParams = {};
		var i = 0;
		this.deleteOldFilters(this.store.getParams());
		if (me.filterExists)
		{
			$(this.grid).find('tbody > tr:first-child > td > input').each(function ()
			{
				cell = $(this);
				clmId = cell.attr('clmid');
				id = cell.attr('id');

				$filterType = type = me.viewFilters[clmId]["type"];
				val = cell.val();
				if (!cbx.isEmpty($filterType) && !cbx.isEmpty(val))
				{
					i++;
					filterParams["COLUMN_COUNT"] = i;
					filterParams["FILTER" + i + "_FIELD"] = clmId;
					filterParams["FILTER" + i + "_VALUE_DATE"] = "";
					filterParams["FILTER" + i + "_VALUE_DATE2"] = "";
					filterParams["FILTER" + i + "_VALUE_TIME"] = " Select";
					filterParams["FILTER" + i + "_VALUE_TIME2"] = " Select";
					if (type == "string")
					{
						filterParams["FILTER" + i + "_CONSTRAINT"] = "contains";
					}
					if (type == "int" || type == "float")
					{
						filterParams["FILTER" + i + "_CONSTRAINT"] = "=";
					}
					if (type == "date")
					{
						filterParams["FILTER" + i + "_CONSTRAINT"] = "dtEquals";
						var date = canvas.lib.view.datatype.convertDateValueToUserPreferedFmt(val);
						filterParams["FILTER" + i + "_VALUE_DATE"] = date;
						var time = canvas.lib.view.datatype.convertDateObjectToStandardFmt(val);
						filterParams["FILTER" + i + "_VALUE_TIME"] = time;
					}

					filterParams["FILTER" + i + "_VALUE_TXT"] = val;

				}
			});
			if (i > 0)
			{

				filterParams["IS_FILTER_FORM"] = true;
			}
		}
		return filterParams;
	},
	
	/**
	 * 
	 */
	addFilter : function (params)
	{
		var filterParams = {};
		var j = 0;
		var me = this;
		this.deleteOldFilters(this.store.getParams());
		if (!cbx.isEmpty(params) && cbx.isArray(params))
		{
			for (var i = 0; i < params.length; i++)
			{
				j++
				$filterType = type = params[i].columnType;
				clmId = params[i].columnId;
				val = params[i].val;
				if (!cbx.isEmpty($filterType) && !cbx.isEmpty(val))
				{
					i++;
					filterParams["COLUMN_COUNT"] = i;
					filterParams["FILTER" + i + "_FIELD"] = clmId;
					filterParams["FILTER" + i + "_VALUE_DATE"] = "";
					filterParams["FILTER" + i + "_VALUE_DATE2"] = "";
					filterParams["FILTER" + i + "_VALUE_TIME"] = " Select";
					filterParams["FILTER" + i + "_VALUE_TIME2"] = " Select";
					if (type == "string")
					{
						filterParams["FILTER" + i + "_CONSTRAINT"] = "contains";
					}
					if (type == "int" || type == "float")
					{
						filterParams["FILTER" + i + "_CONSTRAINT"] = "=";
					}
					if (type == "date")
					{
						filterParams["FILTER" + i + "_CONSTRAINT"] = "dtEquals";
						var date = canvas.lib.view.datatype.convertDateValueToUserPreferedFmt(val);
						filterParams["FILTER" + i + "_VALUE_DATE"] = date;
						var time = canvas.lib.view.datatype.convertDateObjectToStandardFmt(val);
						filterParams["FILTER" + i + "_VALUE_TIME"] = time;
					}

					filterParams["FILTER" + i + "_VALUE_TXT"] = val;

				}
			}
			if (j > 0)
			{
				filterParams["IS_FILTER_FORM"] = true;
			}
			if (!cbx.isEmpty(filterParams))
			{
				cbx.core.extend(me.store.getParams(), filterParams);
			}
		}
	},
	

	/**
	 * 
	 */
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


	/**
	 * 
	 */
	rebuildPagination : function ()
	{
		this.paginationTriggered = "";
	},
	
	/**
	 * 
	 */
	setPagingCount : function (count)
	{
		if (!cbx.isEmpty(count) && parseInt(count) > 0)
		{
			this.perPage = count;
		}
	},
	/**
	 * This method will apply the flag value to all the check boxes available on the grid.
	 * 
	 * @flag true/ false for checked/ unchecked
	 */
	toggleAllCheckBoxState : function (flag)
	{
		var me = this;
		var childNodes = $(this.grid).find('tbody > tr> td.cbx-type-checkbox').find(':checkbox');
		if (flag)
		{
			childNodes.each(function (index, node)
			{
				node = $(node);
				node.prop('checked', true);
				me.store.addCheckedData(me.currentPage, node.attr('RECORD_CURR'));
			});
		} else
		{
			childNodes.each(function (index, node)
			{
				node = $(node);
				node.prop('checked', false);
				me.store.removeCheckedData(me.currentPage, node.attr('RECORD_CURR'));
			});
		}
	},
	
	/**
	 * 
	 */
	handlesort : function (header, column)
	{
		this.paginationTriggered = "";
		var sortClm = this.md.getColumnNameByIndex(column.index);
		if (!cbx.isEmpty(sortClm))
		{
			var sortParams = {};
			sortParams.sort = sortClm;
			sortParams.dir = column["sortOrder"] || 'ASC';
			sortParams.start = 0;
			cbx.core.extend(this.store.getParams(), sortParams);
			this.reloadData()
		}

	},
	/**
	 * This method is responsible for calling CBX plugin API cbxPagination to create the pagination links
	 * based on the total items,number of records per page - Calls the cbxPagination() with the pagination
	 * dvision id
	 */
	paginateTable : function ()
	{
		var me = this;
		this.paginationSelector = $('#' + this.paginationId).cbxPagination({
			items : me.count,
			itemsOnPage : me.perPage,
			scope : me,
			handlePaginationClick : me.handlePaginationClick
		});
	},
	/**
	 * Handler to be called when a pagination link clicked
	 * 
	 * @currentPage is number of the current page
	 * @evtObj is the event object that has the event details
	 * @totalRecs is the total records to be displayed in current page
	 * @items is the total records
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
	handleCellClick : function (evtObj)
	{
		var me = evtObj.data.scope, cell = this;
		evtObj.stopPropagation();
		var record = me.store.getAt($(cell).attr('RECORD_CURR'));
		me.viewConf.raiseEvent(CWEC.CELL_CLICK, {
			record : record
		});
	},
	
	/**
	 * 
	 */
	handleDrillDownClick : function (evtObj)
	{
		var me = evtObj.data.scope, cell = this;
		evtObj.stopPropagation();
		var record = me.store.getAt($(cell).attr('RECORD_CURR'));
		var colId = $(cell).attr('COLUMN_ID');
		me.viewConf.raiseEvent(CWEC.DRILL_DOWN, {
			record : record,
			columnId : colId

		});
	},
	
	/**
	 * 
	 */
	deleteOldFilters : function (params)
	{
		for (i in params)
		{
			if (i.indexOf("FILTER") > -1)
			{
				delete params[i];
			}
		}
		delete params["COLUMN_COUNT"];
		delete params["IS_FILTER_FORM"];
	},
	
	/**
	 * 
	 */
	handleCheckboxMultiRadio : function (evtObj)
	{
		var me = evtObj.data.scope, cell = this, checkBoxes = evtObj.data.chkBox;
		evtObj.stopPropagation();
		checkBoxes.each(function ()
		{
			if ($(this).attr("column_id") == "chk" && $(this).attr("data-chk-single") == "true")
			{
				if (cell.checked == true)
				{
					$(this).prop('checked', true);
					me.store.addSelectedData($(this).attr('RECORD_CURR'))
				} else
				{
					$(this).prop('checked', false);
					me.store.removeSelectedData($(this).attr('RECORD_CURR'))
				}
			}

		});
	},
	
	/**
	 * 
	 */
	handleCheckboxRadio : function (evtObj)
	{
		var me = evtObj.data.scope, cell = this;
		evtObj.stopPropagation();
		if (cell.checked == true)
		{
			me.store.addSelectedData($(cell).attr('RECORD_CURR'));
		} else
		{
			$(me.elem).find('[data-chk-All="true"]').prop('checked', false);
			if ($(cell).attr('data-checked') == "true")
			{
				me.store.removeSelectedData($(cell).attr('RECORD_CURR'), true);
			} else
			{
				me.store.removeSelectedData($(cell).attr('RECORD_CURR'));
			}
		}
	},

	
	/**
	 * 
	 */
	handleCheckboxRadio : function (evtObj)
	{
		var me = evtObj.data.scope, cell = this;
		evtObj.stopPropagation();
		if (cell.checked == true)
		{
			me.store.addCheckedData(me.currentPage, $(cell).attr('RECORD_CURR'));
			$(me.grid).find('thead').find(':checkbox').prop('checked',
						me.store.getCheckedDataCount(me.currentPage));
		} else
		{
			$(me.grid).find('thead').find(':checkbox').prop('checked', false);
			me.store.removeCheckedData(me.currentPage, $(cell).attr('RECORD_CURR'));
		}
	},
	
	/**
	 * 
	 */
	handleContextClick : function (evtObj)
	{
		evtObj.preventDefault();
		$(this).off(evtObj);
		var me = evtObj.data.scope, cell = this;
		setTimeout(function ()
		{
			$(cell).on("click", {
				scope : me
			}, me.handleContextClick);
		}, 300);
		var record = me.store.getAt($(cell).attr('RECORD_CURR'));
		me.viewConf.raiseEvent(CWEC.CONTEXT_CLICK, {
			record : record,
			MENU_ID : $(cell).attr('menu-id')
		});
	},
	
	/**
	 * 
	 */
	handleBBARClick : function (evtObj)
	{
		evtObj.preventDefault();
		evtObj.stopPropagation();
		var me = evtObj.data.scope, cell = this;
		me.viewConf.raiseEvent(CWEC.BBAR_BUTTON_CLICK, {
			selectedData : me.store.getCheckedDataArray(),
			exactSelectedData : me.store.getCheckedDataArray(),
			BUTTON_ID : $(cell).data('button-id')
		});
	},
	
	/**
	 * 
	 */
	getSelections : function ()
	{
		return this.store.getSelections();
	},
	
	/**
	 * 
	 */
	getExactSelections : function ()
	{
		return this.store.getExactSelections();
	},
	
	/**
	 * 
	 */
	addRow : function (params)
	{
		if (!cbx.isEmpty(this.templateConfig))
		{
			$(this.grid).find('tbody > tr.NO_DATA_MSG').remove();
			var template = $.template(null, this.templateConfig);
			var temp;
			var recCur = {};
			recCur['RECORD_CURR'] = this.store.totalAvailableRecords;
			if (!cbx.isEmpty(params) && cbx.isObject(params))
			{
				for ( var i in params)
				{
					recCur[i] = params[i];
				}
			}
			temp = $.tmpl(template, recCur).html();
			var tRow = '<tr class="" RECORD_CURR="' + recCur['RECORD_CURR'] + '">';
			tRow += temp;
			tRow += '</tr>';
			$(this.grid).find('tbody').append(tRow)
			var cloneRec = cbx.clone(this.store.records[0])
			for ( var i in cloneRec)
			{
				cloneRec[i] = '';
			}
			cloneRec['RECORD_CURR'] = cloneRec['REC_CURR'] = this.store.totalAvailableRecords;

			this.store.records[this.store.records.length] = cloneRec
			this.store.totalAvailableRecords = parseInt(this.store.totalAvailableRecords) + 1
			$(this.grid).find('[data-chk-All="true"]').prop('checked', false);
			this.handleCellEdit();
			this.handleCellActionClick();
			this.handleSingleSelectBox();
			this.handleMultipleSelectBox();
		}
	},
	/**
	 * 
	 */
	appendRow : function (params)
	{

		if (!cbx.isEmpty(this.templateConfig))
		{
			$(this.grid).find('tbody > tr.NO_DATA_MSG').remove();
			var template = $.template(null, this.templateConfig);
			var temp;
			var recCur = {};
			var RecCount = parseInt(this.store.totalAvailableRecords);
			recCur['RECORD_CURR'] = recCur['REC_CURR'] = parseInt(RecCount)
			if (!cbx.isEmpty(params) && cbx.isObject(params))
			{
				for ( var i in params)
				{
					recCur[i] = params[i];
				}
			}
			temp = $.tmpl(template, recCur).html();
			var tRow = '<tr class="" RECORD_CURR="' + recCur['RECORD_CURR'] + '">';
			tRow += temp;
			tRow += '</tr>';
			$(this.grid).find('tbody').append(tRow)

			this.store.records[this.store.records.length] = recCur
			this.store.totalAvailableRecords = parseInt(this.store.totalAvailableRecords) + 1
			$(this.grid).find('[data-chk-All="true"]').prop('checked', false);
			this.handleCellEdit();
			this.handleCellActionClick();
			this.handleSingleSelectBox();
			this.handleMultipleSelectBox();
		}
	},
	
	/**
	 * 
	 */
	deleteRow : function ()
	{
		var me = this;
		var j = 0;
		$(me.elem).find('[data-chk-single="true"]').each(
					function ()
					{
						if ($(this).prop('checked') == true || $(this).prop('checked') == "true")
						{
							$(me.grid).find('tbody').find(
										"tr[record_curr=" + $(this).attr('RECORD_CURR') + "]").remove();
							me.store.removeSelectedData($(this).attr('RECORD_CURR'));
							j++;
						} else
						{
							$(me.elem).find('[data-chk-All="true"]').prop('checked', false);
						}
					});
		var trExists = $(me.grid).find('tbody').find("tr");
		if (j == me.store.records.length || !cbx.isEmpty(trExists))
		{
			$(me.elem).find('[data-chk-All="true"]').prop('checked', false);
		}
	},
	
	/**
	 * 
	 */
	removeEntireSelectedData : function ()
	{
		this.store.removeEntireSelectedData();
	},
	
	/**
	 * 
	 */
	deleteAppendedRow : function ()
	{
		var me = this;
		var j = 0;
		$(me.elem).find('[data-chk-single="true"]').each(function ()
		{
			if ($(this).prop('checked') == true || $(this).prop('checked') == "true")
			{
				var recCur = $(this).attr('RECORD_CURR');
				$(me.grid).find('tbody').find("tr[record_curr=" + recCur + "]").remove();
				me.store.removeSelectedData(recCur);
				var arr = me.store.records.removeAt(recCur, 1)
				me.store.totalAvailableRecords = parseInt(me.store.totalAvailableRecords) - 1
				var storeRecs = me.store.records;
				for (var i = 0; i < storeRecs.length; i++)
				{
					storeRecs[i]["RECORD_CURR"] = i;
					storeRecs[i]["REC_CURR"] = i;
				}
				me.manipulateElements()
				j++;

			} else
			{
				$(me.elem).find('[data-chk-All="true"]').prop('checked', false);
			}
		});
		
		me.store.selectedDataMap = {};

		var trExists = $(me.grid).find('tbody').find("tr");
		if (j == me.store.records.length || !cbx.isEmpty(trExists))
		{
			$(me.elem).find('[data-chk-All="true"]').prop('checked', false);
		}
	},
	
	/**
	 * 
	 */
	manipulateElements : function ()
	{
		var k = 0;
		var me = this;
		me.alterSelectedDataMap = {};
		$(me.grid).find('tbody').find("tr").each(function ()
		{

			if (!cbx.isEmpty(me.store.selectedDataMap))
			{
				me.alterSelectedDataMap[$(this).attr('RECORD_CURR')] = k;
			}
			$(this).attr('RECORD_CURR', k);
			$(this).find('*[RECORD_CURR]').each(function ()
			{
				$(this).attr('RECORD_CURR', k);
			});
			k++;
		});
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
CLCR.registerCmp({'COMP_TYPE' : 'APP','VIEW_TYPE' : 'LIST'}, canvas.lib.view.listview);
CLCR.registerCmp({'COMP_TYPE' : 'APP','VIEW_TYPE' : 'CLASSIC_GRID'}, canvas.lib.view.listview);
CLCR.registerCmp({'COMP_TYPE' : 'APP','VIEW_TYPE' : 'PAGING'}, canvas.lib.view.listview);
CLCR.registerCmp({'COMP_TYPE' : 'APP','VIEW_TYPE' : 'PROPERTY'}, canvas.lib.view.listview);
CLCR.registerCmp({'COMP_TYPE' : 'APP','VIEW_TYPE' : 'ADVGROUP'}, canvas.lib.view.listview);
