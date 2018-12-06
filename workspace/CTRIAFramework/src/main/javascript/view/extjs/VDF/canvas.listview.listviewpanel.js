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
 * canvas.listview.listviewpanel
 * 
 * @copyright (c) 2008, by Intellect Design Arena.
 * @version 0.1
 */

/**
 * ListViewPanel is a container that has specific functionality and structural components that make it the perfect
 * building block for list view grid and form interfaces. The ListViewPanel contains bottom toolbar,filterform and list
 * view grid
 * 
 * @class canvas.listview.listviewpanel
 * @extends Ext.Panel
 */
Ext.namespace('canvas.listview');
canvas.listview.listviewpanel = Ext
			.extend(
						Ext.Panel,
						{
							showselectedRowsinLookUp:null,//Fix for multiselect
							/**
							 * lastupdateInfoReq - true to set livegrid will put last update date and time in bottom
							 * button bar.
							 */
							lastupdateInfoReq : false,
							/**
							 * Product code
							 */
							productCode : "CUSER",
							/**
							 * Sub product code
							 */
							subProductCode : "CUSER",
							/**
							 * function code
							 */
							functionCode : "VSBLTY",
							/**
							 * 
							 */
							columnList : [],
							/**
							 * 
							 */
							forceRespectWidth : false,
							/**
							 * 
							 */
							monitorResize : true,
							/**
							 * rb bundle Key value
							 */
							resourceBundleKey : null,
							/**
							 * 
							 */
							evaluator : null,
							/**
							 * 
							 */
							emptyText : '',
							/**
							 * 
							 */
							pageSize : null,
							/**
							 * Flag is used to indicate is filter form available or not for list view. Defaults to true,
							 * false to is to indicate no filter form
							 */
							filterFormAvail : true,
							/**
							 * This will be a unique ID that will be set to this Panel's Id This ID will also be used
							 * for generating this panel's internal components for example - the filter form, its
							 * elements, the grid and the action bar. This would except a DOM node or an existing
							 * Element that will be the container to render this component into.
							 */
							listViewId : 'NONE',
							/**
							 * 
							 */
							renderId : 'NONE',
							/**
							 * 
							 */
							view_id : 'NONE',
							/**
							 * If checkboxselection is set true CheckboxSelectionModel is enabled such that multiple
							 * rows can be selected
							 */
							checkboxselection : false,
							/**
							 * Should be object of Ext.grid.ColumnModel. This will be used to render list view columns
							 */
							cm : {},
							responsivecm : {},

							responsiveTemplate : '',
							/**
							 * Either an Array of field definition objects as passed to Ext.data.Record.create, or a
							 * Record constructor created using Ext.data.Record.create.
							 */
							recordType : {},
							/**
							 * An function needs to executes when a row is selected.
							 */
							rowSelectEvent : "",
							/**
							 * 
							 */
							cellActions : null,
							/**
							 * 
							 */
							filterValues : null,
							/**
							 * extraParamsHandler needs to invoke to submit Extra parameters as part of request while
							 * grid component retrieving data from server.
							 */
							extraParamsHandler : "",
							/**
							 * This is to give provision for application specific custom filter panel and hence a
							 * optional fileld.
							 */
							CustomFilterPanel : null,
							/**
							 * 
							 */
							skipDataResult : '',
							/**
							 * The bottom tool bar of the panel. This can be a Ext.Toolbar object, a toolbar config, or
							 * an array of buttons/button configs to be added to the toolbar
							 */
							buttonBar : [],
							/**
							 * To say whether the component should load automatically,Currently it is used by property grid alone.
							 */
							autoLoadInd : true,
							/**
							 * 
							 */
							loadHandler : Ext.emptyFn,
							/**
							 * 
							 */
							currencyChange : Ext.emptyFn,
							/**
							 * 
							 */
							highlightHandler : Ext.emptyFn,
							/**
							 * 
							 */
							afterrender : Ext.emptyFn,
							/**
							 * 
							 */
							cellClickHandler : function (grid, rowIndex, columnIndex, e)
							{
								return;
							},
							/**
							 * 
							 */
							cellSingleClickHandler : function (grid, rowIndex, columnIndex, e)
							{
								return;
							},
							/**
							 * 
							 */
							rowContextHandler : function (grid, rowIndex, e)
							{
								/**
								 * Highlight or focus the present record.
								 */
								grid.getSelectionModel().selectRow(rowIndex);
								return;
							},
							
							advGrpGridRowContextHandler : function (grid, rowIndex, e)
							{
								grid.getSelectionModel().selectRow(rowIndex);
								return;
							},
							advGrpGridrowClickHandler : function (grid, rowIndex, e)
							{
								return;
							},
							

							bodyresize : function (grid, rowIndex, columnIndex)
							{
								return;
							},
							// plugins:[CT.listview.ResponsiveGridPlugin],
							

							/**
							 * 
							 */
							rowClickHandler : function (grid, rowIndex, e)
							{
								return;
							},
							onRowExpand :function(grid,record,headerData)
							{
								return;
							},
							onRowCollapse :function(grid,record,headerData)
							{
								return;
							},
							/**
							 * Either cm/columnList/viewConf configuration options should be available for list view to
							 * build. If viewConf option provided, then filterFormAvail configuration option no needs to
							 * provide.
							 */
							viewConf : null,
							/**
							 * will be passed by classes that are initializing livegrid outside of the view definition
							 * FW
							 */
							gridViewFilter : null,
							enableColumnMove:false,
							/**
							 * 
							 */
							colTypeMap : {
								'date' : {
									'xtype' : 'canvasdate',
									/**
									 * Expected value format from server dd/mm/yyyy
									 */
									'dateFormat' : 'd/m/Y'
								},
								'time' : {
									'xtype' : 'canvasdatetime',
									/**
									 * Expected value format from server dd/mm/yyyy hh24:mi:ss
									 */
									'dateFormat' : 'd/m/Y H:i:s'
								},
								'float' : {
									'xtype' : 'canvasamount'
								},
								'eqccy' : {
									'xtype' : 'canvasamount'
								},
								'eqamt' : {
									'xtype' : 'canvasamount'
								},
								'context' : {
									'xtype' : 'canvascontext'
								},
								'string' : {
									'xtype' : 'canvascolumn'
								},
								'int' : {
									'xtype' : 'canvascolumn'
								},
								'numstr' : {
									'xtype' : 'canvascolumn'
								},
								'rate' : {
									'xtype' : 'canvasrate',
									'align' : 'right'
								},
								'boolcheck' : {
									'xtype' : 'canvascheck'
								},
								'percentage' : {
									'xtype' : 'canvaspercentage',
									'align' : 'right'
								},
								'translatedvalue' : {
									'xtype' : 'canvastranslatedvalue'
								},
								'propertyvalue' : {
									'xtype' : 'canvaspropertyvalue'
								},
								'template' : {
									'xtype' : 'canvastemplatecolumn'
								},
								'combolist' : {
									'xtype' : 'canvascombolist'
								}
							},
							/**
							 * 
							 */
							filterTypeMap : {
								"date" : "date",
								"time" : "date",
								"float" : "float",
								"list" : "list",
								"string" : "string",
								"int" : "float",
								"numstr" : "string",
								"rate" : "rate",
								"boolcheck" : "bool",
								"percentage" : "float",
								"translatedvalue" : "string",
								"template" : "string",
								"canvascombolist" : "list"
							},
							/**
							 * 
							 */
							groupingColumns : null,
							/**
							 * 
							 */
							sortConfig : null,
							/**
							 * The indicator to display the total count below the livegrid and paging grid
							 */
							totalResultIndicator : false,
							/**
							 * default grid type to be livegrid
							 */
							gridType : 'livegrid',
							/**
							 * 
							 */
							initComponent : function ()
							{
								var respTemplateData = {
									"priorityCols" : [],
									"priorityColValues" : [],
									"priorityColLabels" : [],
									"toolTipCols":[],
									"toolTipColLabels":[],
									"isContextEnabled" : false,
									"isCheckBoxEnabled" : false,
									"hasContextColumn" : false
								};

								var respCntxtCol = new Array();
								var defaults = {
									doubleclick : false,
									contextclick : false
								};
								var updateGridType = function (obj)
								{
									if (obj.view_type === 'PROPERTY')
									{
										obj.gridType = 'propertygrid';
									} else if (obj.view_type === 'GROUP')
									{
										obj.gridType = 'groupgrid';
									} else if (obj.view_type === 'PAGING')
									{
										obj.gridType = 'paginggrid';
									} else if (obj.view_type === 'CLASSIC_GRID')
									{
										obj.gridType = 'simplelivegrid';
									} else if (obj.view_type === 'ADVGROUP')
									{

										obj.gridType = 'advgroupinggrid';
									} else if (obj.view_type === 'TREEGRID')
									{

										obj.gridType = 'canvastreegrid';
									} else
									{
										obj.gridType = 'livegrid';
									}
								};
								this.groupingColumns = [];
								/**
								 * The data source to which this combo is bound.This can be any Ext.data.Store subclass
								 */
								var FILTER_STORE = null;
								var resource = CRB.getBundle(this.resourceBundleKey);
								var FILTER_COLUMN_TYPE_MAP = null;
								var viewFilters = [];
								var vdfFilters = null;
								if (this.viewConf)
								{
									this.recordType = new Array();
									this.view_id = this.viewConf.VIEW_MD.VIEW_ID;
									this.view_type = this.viewConf.VIEW_MD.FLD_VIEW_TYPE;
									this.systemViewId = this.viewConf.VIEW_MD.SYSTEM_VIEW_ID;
									this.initCollapsed = false;
									if (this.viewConf.VIEW_MD.FLD_INIT_COLLAPSED != null
												&& this.viewConf.VIEW_MD.FLD_INIT_COLLAPSED === 'Y')
									{
										this.initCollapsed = true;
									}
									var cols = new Array();
									this.responsiveTemplate = this.viewConf.VIEW_MD.FLD_RESPONSIVE_TEMPLATE;
									var respCols = new Array();
									
									 
									this.enableColumnMove=this.viewConf.VIEW_MD.FLD_COL_ORDER_IND=="Y"?true:false;
									 
									
									/**
									 * create column model and record type
									 */
									var clms = IMM.getColumnList(this.viewConf);
									for (i = 0, clen = clms.length; i < clen; i++)
									{
										/**
										 * Record creation start
										 */
										var rec = {};
										var clm = {};
										rec.name = clms[i].FLD_COLUMN_ID;
										rec.type = clms[i].FLD_DATA_TYPE === 'time' ? 'date'
													: (clms[i].FLD_DATA_TYPE === 'rate'
																|| clms[i].FLD_DATA_TYPE === 'numstr'
																|| clms[i].FLD_DATA_TYPE === 'int' ? 'string'
																: clms[i].FLD_DATA_TYPE);

										var coltype = this.colTypeMap[clms[i].FLD_DATA_TYPE];
										clm.xtype = coltype.xtype;
										clm.linkedCurrCol = clms[i].LINKED_SOURCE_CCY;
										clm.TEMPLATE_CONFIG=clms[i].TEMPLATE_CONFIG;
										 
										/**
										 * skip context column from rendering on the grid
										 */
										if (clm.xtype == "canvascontext")
										{
											var contextColumnCssCls = 'rightcolumncontexticon';
											var contextColumnDisabledCssCls = 'rightcolumncontextdisableicon';
											var contextColumnToolTip = CRB.getFWBundle()['LBL_CONTEXTCOL_TOOLTIP'];											
											var contextColumnHandler = function (grid, rowIndex, colIndex, item, event){
												var rec=grid.getStore().getAt(rowIndex);
												if(rec && rec.data && rec.data.DISABLED_CONTEXT_IND==='Y'){
													return false;
												}
												grid.fireEvent("rowcontextmenu", grid, rowIndex, event);
											};

												clm.rbKey = this.resourceBundleKey;
												clm.xtype = 'contextcolumn';
												clm.menuDisabled = false;
												clm.resizable = false;
												clm.width = 30;
												clm.fixed= true;
												clm.hideable = false;
												clm.draggable = false;
												clm.moveable = false;
												clm.locked = false;
												clm.enableColumnMove = false;
												clm.enableDragDrop = false;
												clm.items = [ {
													tooltip : CRB.getBundle(clm.rbKey)['LBL_'+clms[i].FLD_COLUMN_DISPLAY_NAME_KEY+'_TOOLTIP']?
																CRB.getBundle(clm.rbKey)['LBL_'+clms[i].FLD_COLUMN_DISPLAY_NAME_KEY+'_TOOLTIP']: contextColumnToolTip,
													getClass : function (v, meta, rec){	
														if(rec && rec.data && rec.data.DISABLED_CONTEXT_IND==='Y'){
															return contextColumnDisabledCssCls;
														}else{
															return contextColumnCssCls;
														}
														
													},
													handler : contextColumnHandler 
												} ]
											
											respTemplateData.isContextEnabled = true;											
										}
										if (clm.xtype == "canvastemplatecolumn"){
											if (!Ext.isEmpty(clm.TEMPLATE_CONFIG)){
												clm.tpl=clm.TEMPLATE_CONFIG
											}else{
												clm.xtype='canvascolumn';
											}
										}
										
										/**
										 * mapping filter data type and then pushing filter objects to the array
										 */
										if (this.viewConf.VIEW_MD.FLD_TOOLS_LIST != null
													&& this.viewConf.VIEW_MD.FLD_TOOLS_LIST.indexOf("filter") > -1)
										{
											var filter = {};
											if (clms[i].FLD_FILTER_DATA_TYPE == null
														|| clms[i].FLD_FILTER_DATA_TYPE == "")
											{
												filter = {
													type : (this.filterTypeMap[clms[i].FLD_DATA_TYPE] == null
																? "string" : this.filterTypeMap[clms[i].FLD_DATA_TYPE]),
													dataIndex : clms[i].FLD_COLUMN_ID,
													widgetId : clms[i].FLD_CODE_VAL_VIEW_ID
																? clms[i].FLD_CODE_VAL_VIEW_ID : '',
													columnVal : clms[i].FLD_CODE_VAL_CODE_COL
																? clms[i].FLD_CODE_VAL_CODE_COL : '',
													extraParams : clms[i].LOOKUP_FILTER_EXTPARAMS
																? clms[i].LOOKUP_FILTER_EXTPARAMS : ''
												};
											} else
											{
												filter = {
													type : (this.filterTypeMap[clms[i].FLD_FILTER_DATA_TYPE] == null
																? "string"
																: this.filterTypeMap[clms[i].FLD_FILTER_DATA_TYPE]),
													dataIndex : clms[i].FLD_COLUMN_ID,
													widgetId : clms[i].FLD_CODE_VAL_VIEW_ID
																? clms[i].FLD_CODE_VAL_VIEW_ID : '',
													columnVal : clms[i].FLD_CODE_VAL_CODE_COL
																? clms[i].FLD_CODE_VAL_CODE_COL : '',
													extraParams : clms[i].LOOKUP_FILTER_EXTPARAMS
																? clms[i].LOOKUP_FILTER_EXTPARAMS : ''
												};
											}
											if (filter.type == "list")
											{
												if (clms[i].FLD_FILTER_HANDLER_ID != null
															&& clms[i].FLD_FILTER_HANDLER_ID.length > 0)
												{
													filter.options = CGH.getHandler(clms[i].FLD_FILTER_HANDLER_ID);
												} else
												{
													filter.options = [];
												}
											}
											/**
											 * Enabling Filter Depending on DB Flag value
											 */
											if (clms[i].FLD_FILTER_ENABLE_IND == 'Y')
											{
												viewFilters.push(filter);
											}
										}
										if (coltype.dateFormat)
										{
											clm.dateFormat = coltype.dateFormat;
											rec.dateFormat = coltype.dateFormat;
										}
										if (coltype.align)
										{
											clm.align = coltype.align;
										}
										this.recordType.push(rec);
										clm.id = clms[i].FLD_COLUMN_ID;
										clm.parentId = clms[i].FLD_PARENT_COLUMN_ID ? clms[i].FLD_PARENT_COLUMN_ID : '';
										clm.appendCurrencyMode = clms[i].FLD_APPEND_CURRENCY_MODE
													? clms[i].FLD_APPEND_CURRENCY_MODE : '';
										clm.sortable = clms[i].FLD_SORTABLE_IND == 'Y' ? true : false;
										if (clms[i].FLD_VISIBLE_IND === 'Y')
										{
											clm.hidden = false;
											this.autoExpandColumn = clm.id;
										} else
										{
											clm.hidden = true;
										}
										if (clms[i].FLD_HIDDEN_IND == 'Y')
										{
											clm.hideable = false;
										}
										if (clms[i].FLD_IS_DISABLED == 'Y')
										{
											clm.disable = true;
										}
										clm.header = clms[i].FLD_COLUMN_DISPLAY_NAME_KEY;
										
										if (!Ext.isEmpty(clms[i].FLD_COLUMN_WIDTH)){
											clm.colWidth= clms[i].FLD_COLUMN_WIDTH ;
										}
										clm.drillDownReq = clms[i].FLD_DD_REQ_IND;
										if (clms[i].FLD_GROUPED_IND === 'Y')
										{
											this.groupingColumns[this.groupingColumns.length] = (clms[i].FLD_COLUMN_ID);
										}
										if (!Ext.isEmpty(clms[i].FLD_SORT_POSITION))
										{
											this.sortConfig = {
												"field" : clm.id,
												direction : (clms[i].FLD_SORT_ORDER == "" ? "ASC"
															: clms[i].FLD_SORT_ORDER)
											};
										}
										/**
										 * The assumption made here is only one equal amount in column in Header
										 */
										if (clm.id === 'EQUIV_AMT')
										{
											this.headerImgId = iportal.jsutil.getListViewGridId(this.listViewId);
										}
										clm.rbKey = this.resourceBundleKey;
										clm.summaryType = clms[i].FLD_SUMMARY_TYPE;
										clm.priority = clms[i].FLD_PRIORITY;
										var colLabel=CRB.getBundle(clm.rbKey)['LBL_'+clm.header]==null?'?'+clm.header+'?':CRB.getBundle(clm.rbKey)['LBL_'+clm.header];
										if (!Ext.isEmpty(clm.priority))
										{
											 respTemplateData.priorityCols[clm.priority] = clm.id;
											respTemplateData.priorityColValues[clm.priority] = clm.id;
											respTemplateData.priorityColLabels[clm.priority]=colLabel;
											respCols.push(clm);
										}
										if(!clm.hidden)
											{
											respTemplateData.toolTipCols[i]=clm.id;
											respTemplateData.toolTipColLabels[i]=colLabel;
											}
										else
											{
											respTemplateData.toolTipCols[i]='';
											respTemplateData.toolTipColLabels[i]='';
											}
										
										if (clm.xtype != "canvascontext"){
											cols.push(clm);
										}
									}

									/**
									 * If selection type has a value and if it is 'SINGLE' singleSelect is enabled in
									 * the CheckboxSelectionModel; Otherwise multiselect is allowed in the
									 * CheckboxSelectionModel. If it is group Extjs CheckboxSelectionModel else Livegrid
									 * CheckboxSelectionModel is added
									 */

									if ('GROUP' === this.view_type)
									{
										var selectionType = this.viewConf.VIEW_MD.FLD_SELECTION_TYPE;
										//if (!Ext.isEmpty(selectionType))
										if ('SINGLE' === selectionType || 'MULTIPLE' === selectionType)	
										{
										
											var checkBoxsm = new canvas.grid.CheckboxSelectionModel({
												singleSelect : selectionType == 'SINGLE' ? true : false,
												specialLocked : true,
												moveable : false,
												hideable : false,
												enableColumnMove : false,
												enableDragDrop : false
											});
											this.checkboxselection = selectionType == 'MULTIPLE' ? true: false;
											cols.unshift(checkBoxsm);
											respCols.unshift(checkBoxsm);
											respTemplateData.isCheckBoxEnabled = true;
										}
									} 
									
									else if ('livegrid' === this.view_type)
									{
										var selectionType = this.viewConf.VIEW_MD.FLD_SELECTION_TYPE;
										//if (!Ext.isEmpty(selectionType))
										if ('SINGLE' === selectionType || 'MULTIPLE' === selectionType)	
										{
											var checkBoxsm = new iportal.livegrid.checkboxSelectionModel({
												singleSelect : selectionType == 'SINGLE' ? true : false,
												specialLocked : true,
												moveable : false,
												hideable : false,
												enableColumnMove : false,
												enableDragDrop : false
											});
											this.checkboxselection = (selectionType == 'MULTIPLE') ? true : false;
											cols.unshift(checkBoxsm);
											respCols.unshift(checkBoxsm);
											respTemplateData.isCheckBoxEnabled = true;
										}
									}
										
									else
									{
										var selectionType = this.viewConf.VIEW_MD.FLD_SELECTION_TYPE;
										if (!Ext.isEmpty(selectionType))
										{
											var checkBoxsm = new canvas.grid.CheckboxSelectionModel({
												singleSelect : (selectionType == 'SINGLE') ? true : false,
												specialLocked : true,
												moveable : false,
												selectAllRows : (selectionType == 'SINGLE') ? false : true,
												hideable : false,
												enableColumnMove : false,
												enableDragDrop : false
											});
											this.checkboxselection = (selectionType == 'MULTIPLE') ? true : false; 
											cols.unshift(checkBoxsm);
											respCols.unshift(checkBoxsm);
											respTemplateData.isCheckBoxEnabled = true;
										}
									}
									if (this.view_type === 'ADVGROUP')
									{
										for (var i = 0; i < cols.length; i++)
										{
											if (i == 0)
											{
												cols[i].actualId = cols[i].id;
												cols[i].actualXtype = cols[i].xtype;
												cols[i].dataIndex = 'GRP_HEADER';
												cols[i].id = 'GRP_HEADER';
												cols[i].xtype = 'canvasgroupcolumn';
											} else
											{
												cols[i].actualXtype = cols[i].xtype;
												if ((("SUM" == cols[i].summaryType) || ("AVG" == cols[i].summaryType)
															|| ("MIN" == cols[i].summaryType)
															|| ("MAX" == cols[i].summaryType)) && "canvascolumn" != cols[i].xtype)
												{
													cols[i].xtype = 'canvasamount';
												} else
												{
													cols[i].xtype = 'canvascolumn';
												}
											}
											cols[i].sortable = false;
										}
										var rec = {};
										rec.name = 'GRP_HEADER';
										rec.type = "string";
										this.recordType.push(rec);
										this.expander = new Ext.ux.grid.RowExpander({
											tpl : '<div class="ux-row-expander-box"></div>',
											actAsTree : true
										});
										if ('EA' === this.viewConf.VIEW_MD.FLD_INIT_GROUP_STAGE)
										{
											this.expander.triggerExpand = true;
										}
										cols.unshift(this.expander);
									}
									
									if(this.view_type=="PROPERTY")
										{
										cols.unshift({
											xtype : 'canvaspropertyvalue',
											id:'VALUE',
											header:'VALUE',
											layout : {
												type : 'fit',
												align : 'left'
											},
											rbKey: this.resourceBundleKey,
											priority:'2'	 
										});
										cols.unshift({
											xtype : 'canvascolumn',
											id:'PARTICULARS',
											header:'PARTICULARS',
											layout : {
												type : 'fit',
												align : 'left'
											},
											rbKey: this.resourceBundleKey,
											priority:'1'	 
										});
										}

									this.cm = new canvas.listview.columnModel({
										columns : cols
									});
									/**
									 * The view information whether to display the total count below the listview panel
									 * is taken from the view metadata and passed as the information
									 */
									var totalResultIndicator = this.viewConf.VIEW_MD.FLD_TOTAL_RESULT_IND;
									if (totalResultIndicator && totalResultIndicator == 'Y')
									{
										this.totalResultIndicator = true;
									}
									/**
									 * Code to enable/disable/hide action columns for a grid
									 */
									var defaults = {
										doubleclick : false,
										contextclick : false
									};
									if (this.viewConf.VIEW_MD.FLD_DETAIL_ACTION_IND != null
												&& this.viewConf.VIEW_MD.FLD_DETAIL_ACTION_IND === 'Y')
									{
										defaults.doubleclick = true;
									}
									if (this.viewConf.VIEW_MD.FLD_CONTEXT_ACTION_IND != null
												&& this.viewConf.VIEW_MD.FLD_CONTEXT_ACTION_IND === 'Y')
									{
										defaults.contextclick = true;
									}
									updateGridType(this);
									/**
									 * Code added to display the context column as last column in list/paging/grouping
									 * grid based on context column flag indicator obtained from the view metadata
									 * information.
									 */
									if (this.viewConf.VIEW_MD.FLD_CONTEXT_COLUMN
												&& this.viewConf.VIEW_MD.FLD_CONTEXT_COLUMN === 'Y')
									{
										var menuItems = IMM.getContextMenuList(this.view_id);
										var contextAsMenuAvail = false;
										var contextAsIconAvail = false;
										if (!Ext.isEmpty(menuItems))
										{
											for (var i = 0; i < menuItems[0].child_nodes.length; i++)
											{
												if (menuItems[0].child_nodes[i].context_type === "MENU")
												{
													contextAsMenuAvail = true;
												} else if (menuItems[0].child_nodes[i].context_type === "ICON")
												{
													contextAsIconAvail = true;
												}
											}
											if (contextAsMenuAvail == true)
											{
												var contextColumnCssCls = 'rightcolumncontexticon';
												var contextColumnDisabledCssCls = 'rightcolumncontextdisableicon';
												var contextColumnToolTip = CRB.getFWBundle()['LBL_CONTEXTCOL_TOOLTIP'];
												var contextColumnHandler = function (grid, rowIndex, colIndex, item, event)
												{
													var rec = grid.getStore().getAt(rowIndex);
													if (rec && rec.data && rec.data.DISABLED_CONTEXT_IND === 'Y')
													{
														return false;
													}
													grid.fireEvent("rowcontextmenu", grid, rowIndex, event);
												};
												cols.push({
													xtype : 'contextcolumn',
													menuDisabled : true,
													resizable : false,
													width : 20,
													fixed : true,
													hideable : false,
													draggable : false,
													moveable : false,
													locked : false,
													enableColumnMove : false,
													enableDragDrop : false,
													items : [ {
														tooltip : CRB.getFWBundle()
																	&& CRB.getFWBundle()['LBL_CONTEXTIMAGE_TOOLTIP']
																	? CRB.getFWBundle()['LBL_CONTEXTIMAGE_TOOLTIP']
																	: contextColumnToolTip,
														getClass : function (v, meta, rec)
														{
															if (rec && rec.data
																		&& rec.data.DISABLED_CONTEXT_IND === 'Y')
															{
																return contextColumnDisabledCssCls;
															} else
															{
																return contextColumnCssCls;
															}
														},
														handler : contextColumnHandler
													} ]
												});
												respCntxtCol.push({
													xtype : 'contextcolumn',
													menuDisabled : true,
													resizable : false,
													width : 10,
													fixed : true,
													hideable : false,
													draggable : false,
													moveable : false,
													locked : false,
													enableColumnMove : false,
													enableDragDrop : false,
													items : [ {
														tooltip : CRB.getFWBundle()
																	&& CRB.getFWBundleKey()['LBL_CONTEXTIMAGE_TOOLTIP']
																	? CRB.getFWBundleKey()['LBL_CONTEXTIMAGE_TOOLTIP']
																	: contextColumnToolTip,
														getClass : function (v, meta, rec)
														{
															if (rec && rec.data
																		&& rec.data.DISABLED_CONTEXT_IND === 'Y')
															{
																return contextColumnDisabledCssCls;
															} else
															{
																return contextColumnCssCls;
															}

														},

														handler : contextColumnHandler
													} ]
												});
											}
											if (contextAsIconAvail == true)
											{
											
									
												/**
												 * gets the menu items to be populated in the action column for a
												 * particular view
												 */
												var contextAsIconItems = CBXCONTEXTMENU
															.getContextAsIconItems(this.view_id);
												if (contextAsIconItems && contextAsIconItems.length > 0)
												{
													cols.push({
														xtype : 'actioncolumn',
														id:'actioncolumn',
														menuDisabled : true,
														resizable : false,
														fixed : true,
														hideable : false,
														draggable : false,
														moveable : false,
														locked : false,
														enableColumnMove : false,
														enableDragDrop : false,
														items : contextAsIconItems
													});
													respCntxtCol.push({
														xtype : 'actioncolumn',
														id:'actioncolumn',
														resizable : false,
														fixed : true,
														hideable : false,
														draggable : false,
														moveable : false,
														locked : false,
														enableColumnMove : false,
														enableDragDrop : false,
														items : actionColItems

													});
												}
											}
										}
									}
									
									if (this.gridType === "paginggrid")
									{
										this.cm = new canvas.listview.lockingColumnModel({
											columns : cols,
											defaults : defaults
										});
									} else
									{
										if (this.viewConf.VIEW_MD.FLD_GROUP_HEADER_REQD == 'Y')
										{
											this.cm = new canvas.listview.columnModel({
												columns : cbx.grid.groupingheader.GroupingHeaderModel
															.updateColumnModel(cols)
											});
											this.cm.grpColumns = cbx.grid.groupingheader.GroupingHeaderModel
														.getGroupingHeaderModel(cols);
											this.cm.grpLookup = cbx.grid.groupingheader.GroupingHeaderModel
														.getGroupingHeaderLookup(resource, cols);
										} else
										{
											this.cm = new canvas.listview.columnModel({
												columns : cols
											});
										}
									}
									this.pageSize = this.viewConf.VIEW_MD.FLD_RECORDS_PER_PAGE;
									
									if (this.viewConf.VIEW_MD.FLD_AUTOLOAD_IND == 'Y'){
										this.autoLoadInd = true;
									}else if(this.viewConf.VIEW_MD.FLD_AUTOLOAD_IND == 'N'){
										this.autoLoadInd = false;
									}
								}
								/**
								 * create data source for filter1 and filter2 combo's based on column model of grid
								 */
								var createFilterStore = function (colmodel, rectypes, reskey)
								{
									var totalColumns = colmodel.getColumnCount();
									var dataArray = new Array();
									FILTER_COLUMN_TYPE_MAP = {};
									for (var index = 0; index < totalColumns; index++)
									{
										var colId = colmodel.getColumnId(index);
										var lblColId = "LBL_" + colId;
										Ext.each(rectypes, function (item, index, array)
										{
											if (item.name == colId)
											{
												FILTER_COLUMN_TYPE_MAP[colId] = item.type;
												return false;
											}
										});
										if (colId !== "CONTEXT" && !colmodel.isHidden(index))
										{
											/**
											 * Equivalent in Column model requires two labels to be displayed. In
											 * filterform it should display as 'Equivalent in CCY' and for the column
											 * header it should be 'Equivalent in' as the selected currency will be
											 * appended whenever the user selects or the the default currency will be
											 * displayed in case if user didn't selected it. forexample:- 'Equivalent in
											 * USD'
											 */
											if (colId != 'EQUIV_AMT')
												dataArray.push([ colId, resource[lblColId] ]);
											else
												dataArray.push([ colId, resource['LBL_EQULIN_AMT_CCY'] ]);
										}
									}
									FILTER_STORE = new Ext.data.SimpleStore({
										fields : [ 'value', 'displaytxt' ],
										data : dataArray
									});
									return FILTER_STORE;
								};
								/**
								 * This API intended to check column header and data index value is present or not for
								 * all columns in column model. if any of these values are not present, For Data Index -
								 * set column id value as data index For Header - Prefix "LBL_" to column id and get
								 * localised text form given bundle, then sets as header value Also Its sets the fixed
								 * width to all columns.
								 */
								var injectAdditionalMetadata = function (ob)
								{
									var cm = ob.cm;
									var tc = cm.getColumnCount();
									var sn = iportal.util.stringnumber.getInstance();
									for (var i = 0; i < tc; i++)
									{
										var cid = cm.getColumnId(i);
										var headerVal = cm.getColumnHeader(i);
										var dataIndex = cm.getDataIndex(i);
										var headerTxt = "";
										if (Ext.isEmpty(headerVal))
										{
											headerTxt = cbx.isEmpty(resource["LBL_" + cid]) ? cid : resource["LBL_" + cid] ;
											
										} else
										{
											headerTxt = cbx.isEmpty(resource["LBL_" + headerVal]) ? headerVal : resource["LBL_" + headerVal] ;
										}
										
										//For removing the header for the first column for adavnced grp grid
										if(i==0 && ob.view_type == 'ADVGROUP')
										{
											headerTxt = "";
										}
										
										/**
										 * If Column Id EQUIV_AMT, then putting Default CCY Code and Context icon next
										 * to header
										 */
										if (cid === 'EQUIV_AMT')
										{
											var headerIcon = "<span id='" + ob.headerImgId + "_SPAN_$$$' >&nbsp;"
														+ iportal.preferences.getEquivalentCurrency()
														+ "</span><div class='contextcol' id='" + ob.headerImgId
														+ "_IMG_$$$' />";
											headerTxt = '<div style="margin-right:18px;">' + headerTxt + headerIcon
														+ '</div>';
										}
										if (cm.getColumnById(cid).xtype === 'actioncolumn')
										{
											/**
											 * Add the header text for the action(Context Action) column added as well
											 * as the one which is exclusive for the locking grid.
											 */
											if (i == 0)
											{
												headerTxt = CRB.getFWBundle()['LBL_ACTION'];
											} else if (i == tc - 1)
											{
												headerTxt = CRB.getFWBundle()['LBL_CONTEXTACTION_HEADER'];
											}
										}
										/**
										 * Column header text named as context if the column model list contains context
										 * column component
										 */
										if (cm.getColumnById(cid).xtype === 'contextcolumn')
										{
											var rb = CRB.getFWBundle();
											var colHdText = rb['LBL_' + ob.listViewId + '_CONTEXTCOL_HEADER'];
											headerTxt = colHdText ? colHdText : rb['LBL_CONTEXTCOL_HEADER'];
										}
										if (!cm.grpColumns)
										{
											if (cm.config[i].id == "checker")
											{
												if(cm.config[i].selectAllRows){
													/**
													 * Do NOT overwrite the Header of the column with id as "checker" until
													 * the "Select All" checkbox is to be removed irrespective of the
													 * configuration.
													 */
												}
											} else
											{
												cm.setColumnHeader(i, headerTxt);
												cm.setColumnTooltip(i, headerTxt);
											}
											
										}
										if (cm.getColumnById(cid).xtype !== 'canvascontext')
										{
											if (!ob.forceRespectWidth)
											{
												if (ob.view_type != 'ADVGROUP'){
													cm.setColumnWidth(i, sn.getNeededWidthNoEl(headerTxt) + 23); 
												}else if(i != 0){
													cm.setColumnWidth(i, 145);
												}
											}
										}
										if (i == 1 && ob.view_type === 'ADVGROUP')
										{
											cm.setColumnWidth(i, 300);

										}
										if (Ext.isEmpty(dataIndex))
											cm.setDataIndex(i, cid);
									}
									return cm;
								};
								
								var getresponsivecm = function (ob)
								{

									var isResponsive = true;
									if (Ext.isEmpty(respTemplateData.priorityCols))
										isResponsive = false;

									if (ob.gridType === "paginggrid")
									{

										if (defaults.contextclick == false && defaults.doubleclick == false)
											respTemplateData.hasContextColumn = false;
										else
											respTemplateData.hasContextColumn = true;
										return new canvas.listview.lockingColumnModel({
											columns : [ {
												xtype : 'responsivecolumn',
												respTemplateData : respTemplateData,
												respCntxtCol : respCntxtCol,
												userTemplate : ob.responsiveTemplate

											} ],
											defaults : defaults,
											isResponsive : isResponsive

										});
									} else
									{
										return new CT.listview.ResponsiveColumnModel({
											columns : [ {
												xtype : 'responsivecolumn',
												respTemplateData : respTemplateData,
												userTemplate : ob.responsiveTemplate
											} ],
											isResponsive : isResponsive
										});
									}
								};
								
								/**
								 * Decide form and list view would required or not based on filterFormAvail flag
								 */
								var getItems = function (ob)
								{
									var itemsArr = [];
									if (ob.enableHdMenu == null || ob.enableHdMenu == undefined
												|| ob.enableHdMenu == 'undefined')
									{
										ob.enableHdMenu = true;
									}
									vdfFilters = ob.viewConf != null ? ob.viewConf.VIEW_MD.FILTERS : '';
									viewFilters = ob.gridViewFilter != null ? ob.gridViewFilter : viewFilters;
									var highlightInd = false;
									if (ob.viewConf != null && ob.viewConf.VIEW_MD.FLD_HIGHLIGHT_IND === 'Y')
									{
										highlightInd = true;
									}
									var gridFilter = null;
									if (ob.viewConf.VIEW_MD.FLD_VIEW_TYPE != 'PROPERTY')
									{
										gridFilter = new Ext.ux.grid.GridFilters({
											/**
											 * encode and local configuration options defined previously for easier
											 * reuse
											 */
											encode : true,
											local : false,
											filters : viewFilters,
											gridViewFilters : vdfFilters
										});
									}

									var modifiedCol = injectAdditionalMetadata(ob);

									var gridObj = {
										showselectedRowsinLookUp:ob.mvConf.showselectedRowsinLookUp,//Fix for multiselect		
										xtype : ob.gridType,
										height : ob.height,
										cols : ob.cols,
										groupingColumns : ob.groupingColumns,
										groupgridTextTpl : ob.groupgridTextTpl,
										sortConfig : ob.sortConfig,
										bundle : ob.resourceBundleKey,
										itemId : iportal.jsutil.getListViewGridId(ob.listViewId),
										autoLoadStore : !ob.initCollapsed || ob.mvConf.isMaximized ||ob.mvh.isViewSwitching,
										autoLoadInd : ob.autoLoadInd,
										cm : modifiedCol,
										
										expandcm : modifiedCol,
										responsivecm : getresponsivecm(ob),
										plugins : [ CT.listview.ResponsiveGridPlugin,CT.listview.DynamicColumnHeaderPlugin],
										
										 
										enableColumnMove:ob.enableColumnMove,
										 
										recordType : ob.recordType,
										productCode : ob.productCode,
										selectionType :  ob.viewConf.VIEW_MD.FLD_SELECTION_TYPE,		
										pageSize : ob.pageSize,
										columnList : ob.columnList,
										highlightInd : highlightInd,
										enableHdMenu : ob.enableHdMenu,
										autoExpandColumn : ob.autoExpandColumn ? ob.autoExpandColumn : false,
										subProductCode : ob.subProductCode,
										functionCode : ob.functionCode,
										emptyText : ob.emptyText,
										versionNo : ob.mvConf.versionNo,
										totalResultIndicator : ob.totalResultIndicator,
										/**
										 * transfering additionalConfig Object set by app developer for rendering this
										 * instance of the widget
										 * 
										 * @see iportal.widget.MultiWidget.js
										 */
										additionalConfig : ob.additionalConfig,
										lastupdateInfoReq : ob.lastupdateInfoReq,
										extraParamsHandler : ob.extraParamsHandler,
										checkboxselection : ob.checkboxselection,
										skipDataResult : ob.skipDataResult,
										listeners : {
											'celldblclick' : ob.cellClickHandler,
											'cellclick' : ob.cellSingleClickHandler,
											'groupcontextmenu' : ob.groupContextMenuHandler,
											'groupdblclick' : ob.groupdoubleclickHandler,
											'rowcontextmenu' : ob.rowContextHandler,
											'rowclick' : ob.rowClickHandler,
											'currencychange' : ob.currencyChange,
											'highlight' : ob.highlightHandler,
											'afterrender' : ob.afterrender,
											'onRowExpand' : ob.onRowExpand,
											'onRowCollapse' : ob.onRowCollapse,
											'advGrpGridChildContextClick':ob.advGrpGridRowContextHandler, 
											'advGrpGridChildRowClick':ob.advGrpGridrowClickHandler
										},
										buttonBar : ob.buttonBar,
										rowSelectEvent : ob.rowSelectEvent,
										view_id : ob.view_id,
										systemViewId : ob.systemViewId,
										loadHandler : ob.loadHandler,
										cls : ob.gridHeightCls,
										ctCls : ob.ctCls,
										scrollNotRequired : ob.scrollNotRequired,
										filterparams : ob["printFilterParams"],
										systemViewId : ob.systemViewId,
										gridFilter : gridFilter,
										expander : ob.expander
									};
									if (!Ext.isEmpty(gridFilter))
									{
										if (!Ext.isEmpty(ob.cellActions))
										{
											gridObj.cellActions = ob.cellActions;
											if (gridFilter.filters.length > 0)
											{
												gridObj.cellActions.push(gridFilter);
											}
										} else
										{
											if (gridFilter.filters.length > 0)
											{
												gridObj.cellActions = [ gridFilter ];
											}
										}
									}
									if (ob.viewConf.VIEW_MD.FLD_GROUP_HEADER_REQD == 'Y')
									{
										var groupingHeader = new cbx.grid.groupingheader.GroupHeaderGrid({
											rows : [ gridObj.cm ]
										});
										if (Ext.isEmpty(gridObj.cellActions))
										{
											gridObj.cellActions = [ groupingHeader ];
										} else
										{
											gridObj.cellActions.push(groupingHeader);
										}
									}

									

									/*
									 * The Grouping Header Checkbox in Group grid is added only if the selection type is
									 * multiple
									 */

									/* The Initial stage of the grouping grid is conveyed to the component */

									/* ( EA - Expand All , CA - Collapse All , EFR - Expand First Row ) */

									if ('GROUP' === ob.viewConf.VIEW_MD.FLD_VIEW_TYPE)
									{
										gridObj.initialBehavior = ob.viewConf.VIEW_MD.FLD_INIT_GROUP_STAGE;
										var selectionType = ob.viewConf.VIEW_MD.FLD_SELECTION_TYPE;
										//if ((!Ext.isEmpty(selectionType)) && !('SINGLE' == selectionType))
										if ('MULTIPLE' === selectionType) 											
										{
											gridObj.groupgridTextTpl = "<a class='glink deselected'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>&nbsp;"
														+ gridObj.groupgridTextTpl;
										}
									}

									
									if ('ADVGROUP' === ob.viewConf.VIEW_MD.FLD_VIEW_TYPE)
									{
										var relPos = {};
										var columnsList = ob.viewConf.VIEW_MD.FLD_COLUMN_LIST;
										for (var index = 0; index < columnsList.length; index++)
										{
											var column = columnsList[index];
											if ("Y" == column.FLD_GROUPABLE_IND)
												relPos[column.FLD_COLUMN_ID] = column.FLD_REL_POS_IN_GROUP
										}
										if (Ext.isEmpty(gridObj.cellActions))
										{
											gridObj.cellActions = [ ob.expander ];
										} else
										{
											gridObj.cellActions.push(ob.expander);
										}
										if ('Y' === ob.viewConf.VIEW_MD.FLD_IS_SUMMARY_REQUIRED)
										{
											var Total = new Ext.ux.GridTotals({
												"totalRoot" : function (data)
												{
													if (data.GrandTotalData)
													{
														return data.GrandTotalData.TOTAL[0].AGGREGATION;
													} else
													{
														return [];
													}
												}
											});
											gridObj.cellActions.push(Total);
										}
										gridObj.groupableColumns = ob.viewConf.VIEW_MD.FLD_GROUPABLE_COLUMNS;
										gridObj.relPosOfCol = relPos;
										gridObj.isGroupModifiable = ob.viewConf.VIEW_MD.FLD_IS_GROUP_MODIFIABLE;
										gridObj.groupingColumns = ob.viewConf.VIEW_MD.FLD_GROUPING_COLUMNS;
										gridObj.cls = 'ag-outer-grid';
										gridObj.ctCls = 'ag-outer-grid-wrap';
										gridObj.initialBehavior = ob.viewConf.VIEW_MD.FLD_INIT_GROUP_STAGE;
										gridObj.enableHdMenu = false;
										gridObj.enableColumnMove = false;
										gridObj.enableColumnResize = false;
										gridObj.trackMouseOver = false;
										gridObj.enableColumnHide = false;
									}
									itemsArr.push(gridObj);
									return itemsArr;
								};
								this.cols = cols;
								/**
								 * This is the actual panel which contains the filter panel, grid and the button bar
								 */
								var defaultConfig = {
									xtype : 'panel',
									border : true,
									layout : 'fit',
									items : getItems(this)
								};
								/**
								 * Config object has already been applied to 'this' so properties can be overriden here
								 * or new properties (e.g. items, tools, buttons) can be added, eg:
								 */
								Ext.apply(this, defaultConfig);
								canvas.listview.listviewpanel.superclass.initComponent.apply(this);
							},
							/**
							 * The Method Responsible for getting the params from the component which holds the source of list view data
							 */
							getPrintData : function ()
							{
								return this.getComponent(iportal.jsutil.getListViewGridId(this.listViewId))
											.getPrintData();
							}
						});
/**
 * register xtype to allow for lazy initialization
 */
Ext.reg('listview', canvas.listview.listviewpanel);
