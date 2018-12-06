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
cbx.namespace('iportal.listview');
iportal.listview.simplelivegrid = Ext.extend(Ext.grid.GridPanel, {
	showselectedRowsinLookUp: null,//Fix for multiselect
	/**
	 * 
	 */
	trackMouseOver : false,
	/**
	 * 
	 */
	// disableSelection:true,
	/**
	 * 
	 */
	loadMask : true,
	/**
	 * 
	 */
	loadingMsg : CRB.getFWBundle().LOADING_MSG,
	/**
	 * 
	 */
	recordType : [],
	/**
	 * 
	 */
	buttonBar : null,
	/**
	 * 
	 */
	extraParamsHandler : null,
	/**
	 * 
	 */
	scrollNotRequired : false,
	/**
	 * 
	 */
	productCode : "",
	/**
	 * 
	 */
	subProductCode : "",
	/**
	 * 
	 */
	functionCode : "",
	/**
	 * 
	 */
	checkboxselection : false,
	/**
	 * 
	 */
	initComponent : function ()
	{
		var rb = CRB.getFWBundle();
		var cuser = CRB.getFWBundle();
		this.on("viewready", this.handleViewReady, this);
										var selectionModel = new canvas.grid.RowSelectionModel({
									singleSelect : true
								});
		if('CELLSINGLE' === this.selectionType){
			selectionModel = new canvas.grid.CellSelectionModel({singleSelect:true});
		}else if('CELLMULTI' === this.selectionType){
			selectionModel = new canvas.grid.CellSelectionModel({singleSelect:false});
		}

								if (this.checkboxselection == true)
								{
									selectionModel = new canvas.grid.CheckboxSelectionModel({
										singleSelect : false
									});

								}
								if (!Ext.isEmpty(this.rowSelectEvent))
								{
									selectionModel.addListener("rowselect", this.rowSelectEvent, this);
								}
		var extraParams = {
			"__LISTVIEW_REQUEST" : "Y",
			"PAGE_CODE_TYPE" : 'VDF_CODE',
			"INPUT_ACTION" : "INIT_DATA_ACTION",
			"INPUT_PRODUCT" : this.productCode,
			"PRODUCT_NAME" : this.productCode,
			"INPUT_FUNCTION_CODE" : this.functionCode,
			"INPUT_SUB_PRODUCT" : this.subProductCode,
			"WIDGET_ID" : this.itemId.substring(0, this.itemId.indexOf("__GRID")),
			"VIEW_ID" : this.view_id,
			"LAYOUT_ID" : iportal.workspace.metadata.getCurrentLayoutId(),
			"WORKSPACE_ID" : iportal.workspace.metadata.getCurrentWorkspaceId(),
			"forceCallbacks" : true
		};
		/**
		 * To display emptyText in List View if a customised message to be passed
		 */
		var emptyTextMsg = rb.LOADING;
		if (Ext.util.Format.trim(this.emptyText) !== '')
		{
			emptyTextMsg = this.emptyText;
		}
		this.viewConfig = {
			forceFit : false,
			/**
			 * 
			 */
			loadMask : {
				msg : this.loadingMsg
			},
			/**
			 * 
			 */
			emptyText : emptyTextMsg,
			/**
			 * Method is indended to return the total columns and width used for all the columns
			 * marked as fixed within the view.
			 */
			getFixedColumnStats : function ()
			{
				var totalWidth = 0;
				var totalColumns = 0;
				for (var index = 0; index < this.cm.columns.length; index++)
				{
					if (!Ext.isEmpty(this.cm.columns[index]) && this.cm.columns[index].fixed)
					{
						totalWidth += this.cm.columns[index].width;
						totalColumns++;
					}
				}
				return {
					totalWidth : totalWidth,
					totalColumns : totalColumns
				};
			},

			/**
			 * 
			 */
			getIndexById : function (id)
			{
				var columns = this.cm.grpColumns;
				var childCols;
				for (var i = 0, len = columns.length; i < len; i++)
				{
					if (columns[i].id == id)
					{
						return i;
					}
					childCols = columns[i].childs;
					if (childCols && childCols.length > 0)
					{
						for (var k = 0, kLen = childCols.length; k < kLen; k++)
						{
							if (childCols[k].id == id)
							{
								return i;
							}
						}
					}
				}
				return -1;
			},

			/**
			 * private
			 */
			getGroupedCellIndex : function (el)
			{
				if (el)
				{
					var match = el.className.match(this.colRe);
					if (match && match[1])
					{
						return this.getIndexById(match[1]);
					}
				}
				return false;
			},

			/**
			 * <p>
			 * Return the index of the grid column which contains the passed HTMLElement.
			 * </p>
			 * See also {@link #findRowIndex}
			 * 
			 * @param {HTMLElement} el The target element
			 * @return {Number} The column index, or <b>false</b> if the target element is not
			 *         within a row of this GridView.
			 */
			findGroupedCellIndex : function (el, requiredCls)
			{
				var cell = this.findCell(el), hasCls;
				if (cell)
				{
					hasCls = this.fly(cell).hasClass(requiredCls);
					if (!requiredCls || hasCls)
					{
						return this.getGroupedCellIndex(cell);
					}
				}
				return false;
			},

			/**
			 * 
			 */
			autoExpand : function (preventUpdate)
			{
				try
				{
					var g = this.grid, cm = this.cm;
					if (!this.userResized && g.autoExpandColumn)
					{
						var tw = g.tw || cm.getTotalWidth(false);
						if (g.tw == null)
						{
							g.tw = tw;
						}
						var aw = this.grid.getGridEl().getWidth(true) - this.getScrollOffset();
						/**
						 * Resetting the width of all the columns to average width to have equal
						 * size columns
						 */
						var totalWidth = tw > aw ? tw : aw;
						totalWidth = totalWidth - 10;
						var totalColumns = this.cm.getColumnCount(true);
						/**
						 * Code for excludig all the columns with fixed width aout of the auto
						 * expand logic.
						 */
						var fixedColumn = this.getFixedColumnStats();
						totalColumns = totalColumns - fixedColumn.totalColumns;
						totalWidth = totalWidth - fixedColumn.totalWidth;
						var avgWidth = totalWidth / totalColumns;
						g.autoExpandMax = avgWidth - 1
						if (!Ext.isEmpty(this.cm.columns))
						{
							for (var index = 0; index < this.cm.columns.length; index++)
							{
								if (!Ext.isEmpty(this.cm.columns[index]))
								{
									if (this.cm.columns[index].hidden === false)
									{
										cm.setColumnWidth(index, Math.floor(avgWidth), true);
									}
								}
							}
						}

						if (tw < aw)
						{
							var ci = cm.getIndexById(g.autoExpandColumn);
							var currentWidth = cm.getColumnWidth(ci);
							var cw = Math.min(Math.max(((aw - tw) + currentWidth),
										g.autoExpandMin), g.autoExpandMax);
							if (cw != currentWidth)
							{
								cm.setColumnWidth(ci, cw, true);
								if (preventUpdate !== true)
								{
									this.updateColumnWidth(ci, cw);
								}
							}
						}
					} else
					{
						this.updateHeaders();
						this.updateHeaderSortState();
					}
				} catch (e)
				{
					LOGGER.error(e);
				}
			}
		};
		if (!Ext.isEmpty(this.filterparams))
		{
			for (each in this.filterparams)
			{
				extraParams[each] = this.filterparams[each];
			}
		}
		var that = this;
		function getExtParams (param)
		{
			if (!Ext.isEmpty(param))
			{
				var extParams = param.apply(that, [ extraParams ]);
				if (!Ext.isEmpty(that.filterparams))
				{
					for (each in that.filterparams)
					{
						extParams[each] = that.filterparams[each];
					}
				}
				return extParams;

			} else
			{
				return extraParams;
			}
		}

		/**
		 * Intended to call the getExtparams Methods to have the updated params including
		 * extraParamsHandler
		 */
		function doBeforeLoad (store, options)
		{
			var params = getExtParams(that.extraParamsHandler);
			Ext.apply(options.params, params);
		}
		/**
		 * This intended to hide and remove REFRESh_DATE property from request params if
		 * available
		 */
		function doAfterLoad (store, records)
		{
			
			// without click apps height configuration is fine in grid			
			var widgetId =  that.itemId.substring(0,that.itemId.indexOf('__GRID'));			
			var portlet = that.ownerCt.findParentByType('portlet') || that.ownerCt.findParentByType('window');
			var widget = portlet?portlet.getComponent(0):null;
			if(widget)
			{
				widget.fireEvent('resizeafterdatacall', records.length);
			}
			/**
			 * Finding the child widget and doing a layout as resize after data call
			 * will only resize the parent portlet and not the child
			 */
			/*if(widget && widgetId != widget.itemId)
			{
				LOGGER.info(widget.getHeight());
				that.ownerCt.setHeight(widget.getHeight());
				that.ownerCt.doLayout();
			}*/
			if(widget && widgetId != widget.itemId)
			{
				LOGGER.info(widget.getHeight());
				var newWidget = that.findParentBy(function(item){return item.itemId==widgetId});
				var bbarHt=0;
				if(newWidget.mvh.getBottomToolbar())
				{
					var bbarHt =  newWidget.mvh.getBottomToolbar().getHeight()-5;
				}
				that.ownerCt.setHeight(widget.getHeight()-bbarHt);
				that.ownerCt.doLayout();
			}
			store.loaded = true;
			if (!Ext.isEmpty(that.view))
			{
				if (this.baseParams.IS_FILTER_FORM && !that.isDataAvailable())
				{
					that.view.emptyText = rb.FILTER_NO_DATA_MSG;
				} 
				else if (records.reader
							&& records.reader.jsonData
							&& records.reader.jsonData.response
							&& records.reader.jsonData.response.value
							&& records.reader.jsonData.response.value.ADDITIONAL_DATA
							&& records.reader.jsonData.response.value.ADDITIONAL_DATA.ENTL_ERROR)
				{
					if (rb[records.params['WIDGET_ID'] + "_ENTL_ERROR"])
					{
						that.view.emptyText = rb[records.params['WIDGET_ID'] + "_ENTL_ERROR"];
					} 
					else
					{
						that.view.emptyText = rb[records.reader.jsonData.response.value.ADDITIONAL_DATA.ENTL_ERROR];
					}
				} 
				/**
				 * Can give widget oriented empty text in the grid, if the widget do have any
				 * records to show.
				 */
				else if (records.length == 0)
				{
					if (rb[that.systemViewId + "_NO_DATA_MSG"])
					{
						that.view.emptyText = rb[that.systemViewId + "_NO_DATA_MSG"];
					} 
					else
					{
						that.view.emptyText = Ext.util.Format.trim(that.emptyText) !== ''
									? that.emptyText : rb.NO_DATA_MSG;
						that.view.updateHeaderWidth();//HorizontalScroll For ClassicGrid Even When There is no data to able to see what are all the columnns available in the grid even when there is no data
					}
				} 
				else
				{
					that.view.emptyText = Ext.util.Format.trim(that.emptyText) !== ''
								? that.emptyText : rb.NO_DATA_MSG;
				}
			}
			
			var panelId = that.id.replace('__GRID', '_PANEL');
			if (this.baseParams.REFRESH_DATA){
				delete this.baseParams.REFRESH_DATA;
			}
			if (that.lmask != null)	{
				that.lmask.hide();
			}
			/**
			 * Since rendering gets delayed in certain cases, the view is unable to hide its
			 * Loading Mask and thus a delay has been introduced if the Loading mask is
			 * Undefined.
			 */
			else if (that.lmask == undefined)
			{
				setTimeout(function ()
				{
					try
					{
						that.lmask.hide();
					} catch (e)
					{
						// Use this block to Catch and Log the errors
					}
					if (!Ext.isEmpty(that.view))
					{
						if (Ext.isEmpty(that.view.emptyText) || Ext.isEmpty(that.emptyText))
						{
							that.view.emptyText = Ext.util.Format.trim(that.emptyText) !== ''
										? that.emptyText : rb.NO_DATA_MSG;
						}
						that.view.applyEmptyText();
					}
				}, 200);
			}
			if (!Ext.isEmpty(that.view))
			{
				that.view.applyEmptyText();
			}
			var widgetId = that.itemId.substring(0, that.itemId.indexOf('__GRID'));
			var config = {
				VIEW_TYPE : "LIST",
				WIDGET_ID : widgetId,
				VIEW_ID : that.view_id
			}
			that.ownerCt.evaluator = new cbx.core.appEvaluator(config);
			that.appSelector = that.ownerCt.evaluator.getDefaultApp();
			var task = new Ext.util.DelayedTask(function ()
			{
				if (iportal.workspace.metadata.getCurrentLayout().loadingMode === "L")
				{
					if(that.store && (cbx.isEmpty(that.store.baseParams['DEFAULT_APP_SELECTION_REQ']) || that.store.baseParams['DEFAULT_APP_SELECTION_REQ'] !=="N")){
						that.ownerCt.evaluator.doSelect(that);
					}					
				}
			});
			task.delay(500);
			//Fix for multiselect-Start
			if(!cbx.isEmpty(widget.showselectedRowsinLookUp)){
				var rowindexList=[];
				var recds=widget.showselectedRowsinLookUp;
				var datastore=widget.mv.mvh.getGridCmp().getStore().data.items;
				var i=0,j=0;
				for(j=0;j<recds.VALUES.length;j++){
					for(i=0;i<datastore.length;i++){
						if(datastore[i].data[recds.COLUMN_ID]==recds.VALUES[j]){
							rowindexList.push(i);
							break;
						}
					}
				}
				var gidObj=widget.mv.mvh.getGridCmp().getSelectionModel();
				gidObj.selectRows(rowindexList,true);
				
			}//Fix for multiselect-End
		}
		doAfterLoad = doAfterLoad.createSequence(this.loadHandler);
		if (this.skipDataResult == true)
		{
			this.autoLoadStore = false;
		}
		var reader = new Ext.data.JsonReader({
			root : 'response.value.ALL_RECORDS',
			totalProperty : 'response.value.TOTAL_COUNT',
			id : 'id'
		}, this.recordType);

		this.store = new cbx.grid.Store({
			_autoLoad : this.autoLoadStore,
			bufferSize : 45,
			loaded : false,
			baseParams : getExtParams(this.extraParamsHandler),
			reader : reader,
			url : iportal.listview.listviewconstants.AJAX_URL,
			isLoaded : function ()
			{
				return this.loaded;
			},
			listeners : {
				"load" : doAfterLoad,
				'loadexception' : doAfterLoad,
				"beforeload" : doBeforeLoad
			}
		});
		
		this.selModel = selectionModel;
		
		this.autoExpandMax = 500;
		this.autoExpandMin = 150;
		this.bbar = new Ext.PagingToolbar({
			pageSize : parseInt(this.pageSize),
			store : this.store,
			autoHeight : true,
			displayInfo : true,
			displayMsg : cuser.GRID_DISPLAY_RESULTS || "", 
			emptyMsg : cuser.GRID_EMPTY_DISP_RESULT || "",
			listeners : {
				'change' : function (scope, params)
				{
					this.refresh.hide(); 
					this.ownerCt.currentPage = params.activePage;
					if (this.ownerCt.store.getTotalCount() > 0)
					{
						var VMD = IMM.getView(this.ownerCt.view_id).VIEW_MD
						var maxRecords = !Ext.isEmpty(VMD.INITIAL_RECORDS_COUNT)
									? Number(VMD.INITIAL_RECORDS_COUNT) : null;
						var recPerPage = !Ext.isEmpty(VMD.FLD_RECORDS_PER_PAGE)
									? Number(VMD.FLD_RECORDS_PER_PAGE) : null;
						maxRecords = (!Ext.isEmpty(maxRecords) && maxRecords === 0) ? null
									: maxRecords;
						var store = this.ownerCt.store;
						if (maxRecords != null && store.data.items.length > maxRecords)
						{
							if (this.hidden)
							{
								this.show();
								this.ownerCt.doLayout();
							}
							this.ownerCt.bufferCols = new Object();
							var recordArray = new Array();
							for (var i = 0; i < store.data.items.length; i++)
							{
								if (i > maxRecords - 1)
								{
									recordArray.push(store.getAt(i));
								}
							}
							this.ownerCt.bufferCols[this.ownerCt.currentPage] = recordArray;
							for (var i = 0; i < recordArray.length; i++)
							{
								store.remove(recordArray[i]);
							}
							this.ownerCt.showHideBbarButtons("SHOW", "HIDE")

						}
						else if (recPerPage != null)
						{
							if (store.totalLength <= recPerPage)
							{
								if (!this.hidden)
								{
									this.hide();
									this.ownerCt.doLayout();
								}
							} else if (store.totalLength > recPerPage)
							{
								if (this.hidden)
								{
									this.show();
									this.ownerCt.doLayout();
								}
							}
							this.ownerCt.showHideBbarButtons("HIDE", "HIDE");
						}
						else
						{
							this.ownerCt.showHideBbarButtons("HIDE", "HIDE");
							if (this.hidden)
							{
								this.show();
								this.ownerCt.doLayout();
							}
							store.commitChanges();
							this.ownerCt.view.refresh();
						}
					} else
					{
						this.ownerCt.showHideBbarButtons("HIDE", "HIDE");
						if (this.ownerCt.store.getTotalCount() == 0)
						{
							if (!this.hidden)
							{
								this.hide();
								this.ownerCt.doLayout();
							}
						}
					}

				}
			},
			items : [
			{
				scope : this,
				name : 'expander',
				iconCls : 'ROW_EXPANDER',
				handler : function ()
				{
					if (this.bufferCols[this.currentPage])
					{
						var recordArray = this.bufferCols[this.currentPage];
						for (var i = 0; i < recordArray.length; i++)
						{
							this.store.add(recordArray[i]);
						}
						this.showHideBbarButtons("HIDE", "SHOW");

					}
				}
			},
			'-',
			{
				scope : this,
				hidden : true,
				name : 'compressor',
				iconCls : 'ROW_COMPRESSOR',
				handler : function ()
				{
					var store = this.store;
					var recordArray = this.bufferCols[this.currentPage];
					for (var i = 0; i < recordArray.length; i++)
					{
						if (store.getById(recordArray[i].id))
						{
							store.remove(recordArray[i]);
						}
					}
					this.showHideBbarButtons("SHOW", "HIDE");
				}
			} ]
		});
		this.ctCls = 'list-view';
		this.stripeRows = true;
		this.width = 'auto';
		if (this.enableHdMenu == null || this.enableHdMenu == 'undefined')
		{
			this.enableHdMenu = true;
		}
		this.autoHeight = this.scrollNotRequired;
		this.loadMask = {
			msg : this.loadingMsg
		};
		this.enableColumnMove = true;
		this.enableDragDrop = false;
		this.columnLines = true;
		this.plugins = this.cellActions;
		this.addEvents('statechange', 'currencychange');
		this.stateful = true;
		if (!this.stateEvents)
		{
			this.stateEvents = [];
		}
		this.stateEvents.push('statechange');
		this.stateId = this.itemId + '_' + this.view_id + '_GV';
		iportal.listview.simplelivegrid.superclass.initComponent.call(this);
	},
	/**
	 * Intended to check whether store has data or not. Return true if available else false;
	 */
	isDataAvailable : function ()
	{
		if (this.getStore().getCount() > 0)
		{
			return true;
		}
		return false;
	},
	
	/**
	 * Intended to add REFRESH_DATA = Y to base params and reload Store. P.S REFRESH_DATA this
	 * will be deleted after data load success/failure.
	 */
	reloadData : function ()
	{
		var store = this.getStore();
		store.baseParams['REFRESH_DATA'] = 'Y';
		store.load();
	},
	//Fix for multiselect-Start
	getSelectedData : function (){
		var selectedRecordList = new Array();
		var selModel = this.getSelectionModel();
		if (selModel != null) {
			// CHG0CHECKBOX - starts
			var nSelectRowCount = selModel.getCount();
			/*
			 * if records are selected in the grid,
			 * their values are retrieved and returned
			 */
			if (nSelectRowCount > 0) {
				selectedRecordList = selModel.getSelections();
			}
		}
		return selectedRecordList;
		// CHG0CHECKBOX - ends
	},
	//Fix for multiselect-End
	/**
	 * 
	 */
	showHideBbarButtons : function (expander, collapser)
	{
		var expanderBtn = this.getBottomToolbar().find('name', 'expander')[0];
		var collapserBtn = this.getBottomToolbar().find('name', 'compressor')[0];
		expanderBtn && expander === 'SHOW' ? expanderBtn.show() : expanderBtn ? expanderBtn
					.hide() : cbx.emptyFn;
		collapserBtn && collapser === 'SHOW' ? collapserBtn.show() : collapserBtn
					? collapserBtn.hide() : cbx.emptyFn;
	},
	
	/**
	 * 
	 */
	getSelectedData : function ()
	{
		var selectedRecordList = new Array();
		var selModel = this.getSelectionModel();
		if (selModel != null)
		{
			var nSelectRowCount = selModel.getCount();
			/**
			 * if records are selected in the grid, their values are retrieved and returned
			 */
			if (nSelectRowCount > 0)
			{
				selectedRecordList = selModel.getSelections();
			}
		}
		return selectedRecordList;
	},
	
	/**
	 * 
	 */
	afterRender : function ()
	{
		iportal.listview.simplelivegrid.superclass.afterRender.apply(this, arguments);
		this.lmask = new Ext.LoadMask(this.ownerCt.bwrap, {
			msg : this.loadingMsg
		});
		if (this.autoLoadStore){
			this.lmask.show();
		}
		this.on('columnresize', function (colIndex, newSize)
		{
			var that = this;
			this.getView().refresh();
			setTimeout(function ()
			{
				that.getView().updateHeaderSortState();
			}, 10);
		});
		this.setResizedLayout();
		this.on('resize', this.setResizedLayout);
		this.doLayout();
	},
	/**
	 * 
	 */
	onRender : function (ct, position)
	{			
	var _laststate = Ext.state.Manager.get(this
				.getStateId(), 'NOT FOUND');
	if (Ext.type(_laststate) === 'object') {
		var item = {};
		item['text'] = _laststate._gvOpt ? _laststate._gvOpt.eqvt_ccy
				: null;
		this.getStore().baseParams['CURRENCY_CD'] = item.text;
		this.selectedCcy = item.text;

		 this.updateGridFiltersFromState();
		  this.getStore().sortInfo = this._sortInfo;
		  if(_laststate.viewTitle){
			  this.ownerCt.mvh.updateViewTitle(_laststate.viewTitle);  
		  }
		
       Ext.state.Manager.clear(this.getStateId());
	}
	else {
	if (this.sortConfig) {
		this.getStore().sortInfo = this.sortConfig;
	}
	}
	this.setFilters();
	this.updateColumnHeaders();
	//this.updateColumnsState();
	iportal.listview.simplelivegrid.superclass.onRender.apply(this, arguments);
	
	   var ds = this.getStore();

if (ds._autoLoad === true) {
delete ds._autoLoad;
ds.load();
}
this.view.layout();
	},
updateColumnsState: function()
{
	var colModel=this.getColumnModel();
	var currentColState=this._colProperties;
	if(colModel && currentColState)
	{
		var i=0;
		for(i=0;i<this._colProperties.length;i++)
		{
			if(this._colProperties[i]._hidden =="Y")
			{
                colModel.config[i].hidden=true;
			}
			else{
				colModel.config[i].hidden=false;
			}
		}
	}
},

updateGridFiltersFromState : function (){
if (this._colFilters) {
var gridFilters = [];
this.gridFilter.deleteOldFilters(this.store.baseParams);
if (this._colFilters) {
for (i = 0; i < this._colFilters.length; i++) {
	var tmpFilter = {};
	var filterValues = [];

	filterValues[0] = this._colFilters[i]['_value_txt'];
	filterValues[1] = this._colFilters[i]['_value_date'] || '';
	filterValues[2] = this._colFilters[i]['_value_date2'] || '';
	
	tmpFilter['FLD_COLUMN_ID'] = this._colFilters[i]['_field'];
	tmpFilter['FLD_FILTER_TYPE'] = this._colFilters[i]['_constraint'];
	tmpFilter['FLD_FILTER_VALUES'] = filterValues;
	gridFilters.push(tmpFilter);
}
this.gridFilter.gridViewFilters = gridFilters;
}
}
},
	/**
	 * 
	 */
	setResizedLayout : function ()
	{
		this.getView().refresh();
	},
	
	/**
	 * 
	 */
	getState : function ()
	{
		var o = {
			columns : []
		}, store = this.store, ss, gs;
		for (var i = 0, c; (c = this.colModel.config[i]); i++)
		{
			o.columns[i] = {
				id : c.id,
				width : c.width,
				hidden : c.fixed ? undefined : false
			};
			if (c.hidden)
			{
				o.columns[i].hidden = true;
			}
			if (c.sortable)
			{
				o.columns[i].sortable = true;
			}
		}
		if (store)
		{
			ss = store.getSortState();
			if (ss)
			{
				o.sort = ss;
			}
			var sortInfo = this.getStore().sortInfo;
			
			if (!Ext.isEmpty(sortInfo)) {
				sortInfo['position'] = 1;
			}
			o._sortInfo = sortInfo;
			var columns = this.colModel.columns;
			var colProperties = [];
			var col;
			for (i = 0; i < this.colModel.columns.length; i++)
			{
				col = columns[i];
				var colProp = {};
				colProp['_id'] = col.id;
				colProp['_hidden'] = (col.hidden == true) ? 'Y' : 'N';
				colProp['_dataindex'] = col.dataIndex;
				colProp['_position'] = i + 1;
				colProperties.push(colProp);
			}
			o._colProperties = colProperties;
			var filterBaseParams = this.store.baseParams;
			var totalFilters = filterBaseParams.COLUMN_COUNT;
			var colFilters = [];
			for (i = 1; i <= totalFilters; i++) {
				var colFilter = {};
				colFilter['_constraint'] = filterBaseParams['FILTER'
						+ i + '_CONSTRAINT'];
				colFilter['_field'] = filterBaseParams['FILTER' + i
						+ '_FIELD'];
				colFilter['_value_date'] = filterBaseParams['FILTER'
						+ i + '_VALUE_DATE'];
				colFilter['_value_date2'] = filterBaseParams['FILTER'
						+ i + '_VALUE_DATE2'];
				colFilter['_value_time'] = filterBaseParams['FILTER'
						+ i + '_VALUE_TIME'];
				colFilter['_value_time2'] = filterBaseParams['FILTER'
						+ i + '_VALUE_TIME2'];
				colFilter['_value_txt'] = filterBaseParams['FILTER'
						+ i + '_VALUE_TXT'];
				/**
				 * In case the filter applied is on Last N Period
				 * then override the default value to be saved
				 */
				if (filterBaseParams['FILTER' + i + '_VALUE_PERIOD']) {
					colFilter['_value_txt'] = filterBaseParams['FILTER'
							+ i + '_VALUE_PERIOD'];
				}

				colFilters.push(colFilter);
			}
			o._colFilters = colFilters;
			
			if (store.getGroupState)
			{
				gs = store.getGroupState();
				if (gs)
				{
					o.group = gs;
				}
			}
		}
		return o;
	},
	/**
	 * 
	 */
	handleViewReady : function ()
	{
		var rb = CRB.getFWBundle();
		this.view.emptyText = rb.LOADING;
		this.view.applyEmptyText();
	},
	/**
	 * 
	 */
	setFilters : function ()
	{
		if (this.gridFilter)
		{
			var gridFilters = this.gridFilter.gridViewFilters;
			if (this.store.baseParams["LOOKUP_FLAG"] == "true")
			{
				var lookup_Filter_Field = "";
				var lookup_Filter_Value = "";
				var lookup_Filter_Type = "";
				if (this.store.baseParams["ResetStoreValues"])
				{
					/**
					 * second time onwards assign the params in to separeate params to the store
					 * and delete the base params initially available in store,
					 * and get the params from the store and assign it to the filters.
					 */
					lookup_Filter_Field = this.store.baseParams["LOOKUP_TEXT"];
					lookup_Filter_Value = this.store.baseParams["LOOKUP_VALUE_TXT"];
					lookup_Filter_Type = this.store.baseParams["LOOKUP_TYPE"];
				} 
				else
				{
					/**
					 * First time params are available in the store,so get the params from the
					 * store and assign it to the filters.
					 */
					var count = this.store.baseParams["COLUMN_COUNT"];
					lookup_Filter_Field = this.store.baseParams["FILTER" + (count) + "_FIELD"];
					lookup_Filter_Value = this.store.baseParams["FILTER" + (count)
								+ "_VALUE_TXT"];
					lookup_Filter_Type = this.store.baseParams["FILTER" + (count) + "_TYPE"];
				}
				var filterArr = new Array();
				filterArr.push(lookup_Filter_Value);
				this.gridViewFilters_lookup = [ new Ext.data.JsonStore({
					FLD_FILTER_VALUES : filterArr,
					FLD_COLUMN_ID : lookup_Filter_Field,
					FLD_FILTER_TYPE : lookup_Filter_Type
				}) ];
			}
			this.gridFilter.deleteOldFilters(this.store.baseParams);
			if (gridFilters.length > 0)
			{
				this.store.baseParams["IS_FILTER_FORM"] = "true";
				this.store.baseParams["COLUMN_COUNT"] = gridFilters.length;
				for (i = 0; i < gridFilters.length; i++)
				{
					var tmpFilter = this.gridFilter.getFilter(gridFilters[i].FLD_COLUMN_ID);
					if (tmpFilter)
					{
						if (tmpFilter.type == "string" || tmpFilter.type == "numeric"
									|| tmpFilter.type == "float")
						{
							this.store.baseParams['FILTER' + (i + 1) + '_FIELD'] = gridFilters[i].FLD_COLUMN_ID;
							this.store.baseParams['FILTER' + (i + 1) + '_CONSTRAINT'] = gridFilters[i].FLD_FILTER_TYPE;
							this.store.baseParams['FILTER' + (i + 1) + '_VALUE_TXT'] = gridFilters[i].FLD_FILTER_VALUES[0];
						} 
						else
						{
							this.store.baseParams['FILTER' + (i + 1) + '_FIELD'] = gridFilters[i].FLD_COLUMN_ID;
							this.store.baseParams['FILTER' + (i + 1) + '_CONSTRAINT'] = gridFilters[i].FLD_FILTER_TYPE;
							this.store.baseParams['FILTER' + (i + 1) + '_VALUE_TXT'] = gridFilters[i].FLD_FILTER_VALUES[0];
							this.store.baseParams['FILTER' + (i + 1) + '_VALUE_DATE'] = gridFilters[i].FLD_FILTER_VALUES[1];
							this.store.baseParams['FILTER' + (i + 1) + '_VALUE_DATE2'] = gridFilters[i].FLD_FILTER_VALUES[2];
						}
					} 
					else
					{
						this.store.baseParams['FILTER' + (i + 1) + '_FIELD'] = gridFilters[i].FLD_COLUMN_ID;
						this.store.baseParams['FILTER' + (i + 1) + '_CONSTRAINT'] = gridFilters[i].FLD_FILTER_TYPE;
						this.store.baseParams['FILTER' + (i + 1) + '_VALUE_TXT'] = gridFilters[i].FLD_FILTER_VALUES[0];
						this.store.baseParams['FILTER' + (i + 1) + '_VALUE_DATE'] = gridFilters[i].FLD_FILTER_VALUES[1];
						this.store.baseParams['FILTER' + (i + 1) + '_VALUE_DATE2'] = gridFilters[i].FLD_FILTER_VALUES[2];
					}
				}
			} 
			else
			{
				delete this.store.baseParams["IS_FILTER_FORM"];
				delete this.store.baseParams["COLUMN_COUNT"];
			}
		}
	},
	/**
	 * 
	 */
	updateColumnHeaders : function ()
	{
		if (this.store.baseParams["LOOKUP_FLAG"] === "true")
		{
			this.gridFilter.gridViewFilters = this.gridViewFilters_lookup;
			this.gridViewFilters_lookup = [];
		}
		if (this.gridFilter)
		{
			var gridFilters = this.gridFilter.gridViewFilters;
			if (gridFilters.length > 0)
			{
				for (i = 0; i < gridFilters.length; i++)
				{
					var tmpFilter = this.gridFilter.getFilter(gridFilters[i].FLD_COLUMN_ID);
					if (tmpFilter)
					{
						var value = gridFilters[i].FLD_FILTER_VALUES[0];
						var value1 = gridFilters[i].FLD_FILTER_VALUES[1];
						var gridFilterType = gridFilters[i].FLD_FILTER_TYPE;
						if (tmpFilter.type == "string")
						{
							tmpFilter.menu.fields['def'].setValue(value);
						} else if (tmpFilter.type == "list")
						{
							tmpFilter.menu.setSelected(value);
						} else if (tmpFilter.type == "numeric" || tmpFilter.type == "float")
						{
							var cons = null;
							if (gridFilters[i].FLD_FILTER_TYPE)
							{
								cons = (gridFilters[i].FLD_FILTER_TYPE == "<"
											? "lt"
											: (gridFilters[i].FLD_FILTER_TYPE == ">"
														? "gt"
														: (gridFilters[i].FLD_FILTER_TYPE == "M"
																	? "most"
																	: (gridFilters[i].FLD_FILTER_TYPE == "L"
																				? "least"
																				: "eq"))));
							}
							if (cons != null)
							{
								var key, field;
								for (key in tmpFilter.menu.fields)
								{
									field = tmpFilter.menu.fields[key];
									if (field.itemId === "range-" + cons)
									{
										tmpFilter.menu.fields[cons].setValue(value);
									}
								}
							} else
							{
								tmpFilter.menu.setValue(value);
							}
						} else if (tmpFilter.type == "date")
						{
							var key;
							try
							{
								for (key in tmpFilter.fields)
								{
									if (gridFilterType === "PREVIOUS_MONTH"
												&& key === "range-lastmonth")
									{
										tmpFilter.fields[key].setChecked(true);
									} else if (gridFilterType === "LAST_N_DAY"
												&& key === "range-last_n_daysperiods")
									{
										tmpFilter.fields[key].setValue(value);
										tmpFilter.fields['last_n_days'].setChecked(true);
									} else if (gridFilterType === "LAST_N_MONTH"
												&& key === "range-last_n_monthsperiods")
									{
										tmpFilter.fields[key].setValue(value);
										tmpFilter.fields['last_n_months'].setChecked(true);
									} else if (gridFilterType === "range" && key === "between")
									{
										tmpFilter.fields['range-betweenfrom'].setValue(value);
										tmpFilter.fields['range-betweento'].setValue(value1);
										tmpFilter.fields[key].setChecked(true);
									} else if (gridFilterType === "lt" && key === "before")
									{
										var date = this.convertStringtoDate(value);
										tmpFilter.fields['before'].menu.picker.setValue(date);
										tmpFilter.fields['before'].setChecked(true);
									} else if (gridFilterType === "gt" && key === "after")
									{
										var date = this.convertStringtoDate(value);
										tmpFilter.fields[key].menu.picker.setValue(date);
										tmpFilter.fields[key].setChecked(true);
									} else if (gridFilterType === "dtEquals" && key === "on")
									{
										var date = this.convertStringtoDate(value);
										tmpFilter.fields[key].menu.picker.setValue(date);
										tmpFilter.fields[key].setChecked(true);
									}
								}
							} catch (e)
							{
								LOGGER.error(e);
							}
						}
						tmpFilter.active = true;
					}
				}
				this.gridFilter.updateColumnHeadings();
			} 
			else
			{
				this.gridFilter.clearFilters();
			}
		}
	},
	/**
	 * The Method Responsible for give the store params which holds the source of list view data
	 */
	getPrintData : function (){
		var store = this.store || this.getStore();
		return store.baseParams;
	}
});
/**
 * 
 */
Ext.reg('simplelivegrid', iportal.listview.simplelivegrid);