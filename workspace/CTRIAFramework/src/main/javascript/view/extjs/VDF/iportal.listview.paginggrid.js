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
 * iportal.listview.paginggrid
 * 
 * This class is a newer version of live grid that is extended from locking
 * grid. iportal.listview.listviewpanel will be responsible for creating the
 * instance of a propertygrid.
 * 
 * 
 
 *
 * @version 0.1
 */

Ext.namespace('iportal.listview');
Ext
		.override(
				cbx.grid.GridView,
				{
					/*overriding the default destroy
					 * method by deleting colMenu and hmenu properties
					 * completely
					 */
					destroy : function() {

						if (this.hmenu
								&& this.hmenu.getComponent("filters") == null) {
							Ext.menu.MenuMgr.unregister(this.hmenu);
							this.hmenu.destroy();
							/*
							 * for(i in this.hmenu) delete this.hmenu[i];
							 */
							delete this.hmenu;
						}
						if (this.colMenu) {
							Ext.menu.MenuMgr.unregister(this.colMenu);
							this.colMenu.destroy();
							/*
							 * for(i in this.colMenu) delete this.colMenu[i];
							 */
							delete this.colMenu;
						}
						if (this.hmenu) {
							Ext.menu.MenuMgr.unregister(this.hmenu);
							this.hmenu.destroy();
							/*
							 * for(i in this.hmenu) delete this.hmenu[i];
							 */
							delete this.hmenu;
						}

						this.initData(null, null);
						this.purgeListeners();
						Ext.fly(this.innerHd).un("click", this.handleHdDown,
								this);

						if (this.grid.store) {
							this.grid.store.destroy();
						}

						if (this.grid.enableColumnMove) {
							Ext.destroy(this.columnDrag.el,
									this.columnDrag.proxy.ghost,
									this.columnDrag.proxy.el,
									this.columnDrop.el,
									this.columnDrop.proxyTop,
									this.columnDrop.proxyBottom,
									this.columnDrag.dragData.ddel,
									this.columnDrag.dragData.header);
							if (this.columnDrag.proxy.anim) {
								Ext.destroy(this.columnDrag.proxy.anim);
							}
							delete this.columnDrag.proxy.ghost;
							delete this.columnDrag.dragData.ddel;
							delete this.columnDrag.dragData.header;
							this.columnDrag.destroy();
							delete Ext.dd.DDM.locationCache[this.columnDrag.id];
							delete this.columnDrag._domRef;

							delete this.columnDrop.proxyTop;
							delete this.columnDrop.proxyBottom;
							this.columnDrop.destroy();
							delete Ext.dd.DDM.locationCache["gridHeader"
									+ this.grid.getGridEl().id];
							delete this.columnDrop._domRef;
							delete Ext.dd.DDM.ids[this.columnDrop.ddGroup];
						}

						if (this.splitZone) {
							this.splitZone.destroy();
							delete this.splitZone._domRef;
							delete Ext.dd.DDM.ids["gridSplitters"
									+ this.grid.getGridEl().id];
						}

						Ext.fly(this.innerHd).removeAllListeners();
						Ext.removeNode(this.innerHd);
						delete this.innerHd;

						Ext.fly(this.mainHd).removeAllListeners();
						Ext.removeNode(this.mainHd);

						delete this.mainHd;

						Ext.destroy(this.el, this.mainWrap, this.mainHd,
								this.scroller, this.mainBody, this.focusEl,
								this.resizeMarker, this.resizeProxy,
								this.activeHdBtn, this.dragZone,
								this.splitZone, this._flyweight);

						delete this.grid.container;

						if (this.dragZone) {
							this.dragZone.destroy();
						}

						Ext.dd.DDM.currentTarget = null;
						delete Ext.dd.DDM.locationCache[this.grid.getGridEl().id];

						Ext.EventManager.removeResizeListener(
								this.onWindowResize, this);
						/*
						 * for(i in this) delete this[i];
						 */
					},
				
					/**
					 * Method is indended to return the total columns and width
					 * used for all the columns marked as fixed within the view.
					 */
					getFixedColumnStats : function() {
						var totalWidth = 0;
						var totalColumns = 0;
						for (var index = 0; index < this.cm.columns.length; index++) {
							if (!Ext.isEmpty(this.cm.columns[index])
									&& this.cm.columns[index].fixed) {
								totalWidth += this.cm.columns[index].width;
								totalColumns++;
							}
						}
						return {
							totalWidth : totalWidth,
							totalColumns : totalColumns
						};
					},
					setCustomColsWidth : function(totalWidth,totalColumns){
						var metadata = {};
						var newTotalWidth =totalWidth ;
						var newTotalColumns = totalColumns;
						for ( var index = 0; index < this.cm.columns.length; index++) {
							try{
								if (!Ext.isEmpty(this.cm.columns[index]) && 
													this.cm.columns[index].colWidth && this.cm.columns[index].hidden === false) {
									var widthInPx = Math.floor((Number(this.cm.columns[index].colWidth)/100)*totalWidth)
									var negationNotRequired = (this.cm.columns[index].fixed === true);
									newTotalWidth = newTotalWidth-(negationNotRequired?0:widthInPx);
									newTotalColumns = newTotalColumns-(negationNotRequired?0:1);
									this.cm.width = widthInPx;
									this.cm.setColumnWidth(index,widthInPx,false)
								}
							}
							catch(e){
								LOGGER.info(e);
							}
						}
						metadata['totalWidth'] = newTotalWidth;
						metadata['totalColumns'] = newTotalColumns;
						return metadata;
					},
					
					handleHdMenuClickDefault : function(item) {

						var colModel = this.cm, itemId = item.getItemId(), index = colModel
								.getIndexById(itemId.substr(4));
						var colTypeCount = 0;
						if (!Ext.isEmpty(this.cm.columns)) {
							for (var temp = 0; temp < this.cm.columns.length; temp++) {
								if (!Ext.isEmpty(this.cm.columns[temp])) {
									// console.log('columns xtype
									// ',this.cm.columns[temp].xtype );
								
									if (this.cm.columns[temp].xtype == "actioncolumn"
											|| this.cm.columns[temp].dataIndex == 'checker'
											|| this.cm.columns[temp].xtype == "contextcolumn")
										
										colTypeCount++;
								}
							}
						}

						if (index != -1) {

							if (item.checked
									&& colModel.getColumnsBy(
											this.isHideableColumn, this).length <= colTypeCount + 1) {
								this.onDenyColumnHide();
								return false;
							}
							colModel.setHidden(index, item.checked);
						}
					},// columns hide/show 

				
					autoExpand : function(preventUpdate) {
						try {
							var g = this.grid, cm = this.cm;

							if (!this.userResized && g.autoExpandColumn) {
								
								var tw = g.tw || cm.getTotalWidth(false);
								if (g.tw == null) {
									g.tw = tw;
								}
								
								var aw = this.grid.getGridEl().getWidth(true)
										- this.getScrollOffset();
								/*
								 *  Resetting
								 * the width of all the columns to average width
								 * to have equal size columns
								 */
								var totalWidth = tw > aw ? tw : aw;
								// totalWidth = totalWidth -
								
								var totalColumns = this.cm.getColumnCount(true);
								/**
								 * Code for excludig all the columns with fixed
								 * width aout of the auto expand logic.
								 */
								var fixedColumn = this.getFixedColumnStats();
								totalColumns = totalColumns
										- fixedColumn.totalColumns;
								totalWidth = totalWidth
										- fixedColumn.totalWidth;
								
								
								var customColumn = this.setCustomColsWidth(totalWidth,totalColumns);
								
								totalWidth = !cbx.isEmpty(customColumn.totalWidth)?customColumn.totalWidth:totalWidth;
								totalColumns = !cbx.isEmpty(customColumn.totalColumns)?customColumn.totalColumns:totalColumns;
								if(totalColumns>0){
									var avgWidth = totalWidth / totalColumns;
									g.autoExpandMax = avgWidth - 1
									if (!Ext.isEmpty(this.cm.columns)) {
										for (var index = 0; index < this.cm.columns.length; index++) {
											if (!Ext
														.isEmpty(this.cm.columns[index])) {
												if (this.cm.columns[index].hidden === false &&  Ext.isEmpty(this.cm.columns[index].colWidth)) {
													// this.cm.columns[index].width=
													// Math.floor(avgWidth);
													
													cm.setColumnWidth(index,Math.floor(avgWidth),false);
												}
											}
										}
									}
									
									if (tw < aw) {
										var ci = cm
										.getIndexById(g.autoExpandColumn);
										var currentWidth = cm.getColumnWidth(ci);
										var cw = Math.min(Math.max(
													((aw - tw) + currentWidth),
													g.autoExpandMin), g.autoExpandMax);
										if (cw != currentWidth) {
											cm.setColumnWidth(ci, cw, true);
											if (preventUpdate !== true) {
												this.updateColumnWidth(ci, cw);
											}
										}
									}
								}
							}
							else {
								this.updateHeaders();
							}
						
						} catch (e) {
						}
					}
				
					/**
					 * @private Called when a header cell is clicked - shows the
					 *          menu if the click happened over a trigger button
					 */
					,
					handleHdDown : function(e, target) {
						if (Ext.isEmpty(this.isResponsiveGrid)
								|| !this.isResponsiveGrid) {
							this.superclass().handleHdDown
									.call(this, e, target);
							return;
						}

						if (Ext.fly(target).hasClass('x-grid3-hd-btn')) {
							e.stopEvent();
							// this.fireEvent('beforeshow',this);
							var colModel = this.expandcm, header = this
									.findHeaderCell(target), index = this
									.getCellIndex(header),
							// sortable = colModel.isSortable(index),
							menu = this.colMenu,
							// menuItems = menu.items,
							menuCls = this.headerMenuOpenCls;

							this.hdCtxIndex = index;

							Ext.fly(header).addClass(menuCls);
							// menuItems.get('asc').setDisabled(!sortable);
							// menuItems.get('desc').setDisabled(!sortable);

							menu.on('hide', function() {
								Ext.fly(header).removeClass(menuCls);
							}, this, {
								single : true
							});

							menu.show(target, 'tl-bl?');
						}
					}

					/**
					 * @private Click handler for the shared column dropdown
					 *          menu, called on beforeshow. Builds the menu
					 *          which displays the list of columns for the user
					 *          to show or hide.
					 */
					,
					beforeColMenuShow : function() {
						if (Ext.isEmpty(this.isResponsiveGrid)
								|| !this.isResponsiveGrid) {
							this.superclass().beforeColMenuShow.call(this);
							return;
						}

						var colModel = this.expandcm, colCount = colModel
								.getColumnCount(), colMenu = this.colMenu, i, sortable;

						colMenu.removeAll();
						var that = this;
						var thatGridFilter = this.grid.gridFilter;
						var columns;
						for (i = 0; i < colCount; i++) {
							if (colModel.config[i].hideable !== false) {
								sortable = colModel.isSortable(i);

								colMenu
										.add(new Ext.menu.Item(
												{
													text : colModel
															.getColumnHeader(i),
													itemId : 'resp-col-'
															+ colModel
																	.getColumnId(i),
													disabled : colModel.config[i].hideable === false,
													hideOnClick : false,
													iconCls : 'x-cols-icon',
													menu : {
														items : [
																{
																	itemId : 'asc',
																	text : this.sortAscText,
																	disabled : !sortable,
																	cls : 'xg-hmenu-sort-asc'
																},
																{
																	itemId : 'desc',
																	text : this.sortDescText,
																	disabled : !sortable,
																	cls : 'xg-hmenu-sort-desc'
																},
																{
																	checked : false,
																	itemId : 'filters',
																	text : thatGridFilter.menuFilterText,
																	// menu:[]
																	menu : thatGridFilter.filters
																			.get(i).menu,
																	listeners : {
																		'checkchange' : thatGridFilter.onCheckChange
																				.createDelegate(thatGridFilter),
																		'beforecheckchange' : thatGridFilter.onBeforeCheck
																				.createDelegate(thatGridFilter),
																		'beforeshow' : thatGridFilter.onMenu
																				.createDelegate(thatGridFilter),
																		'beforehide' : thatGridFilter.beforeHide
																				.createDelegate(thatGridFilter)
																	}
																} ],

														listeners : {
															'itemclick' : that.handleHdMenuClick
																	.createDelegate(that)
														},
														itemMenuIndex : i

													}

												}));
							}
						}
					},

					/**
					 * @private Attached as the 'itemclick' handler to the
					 *          header menu and the column show/hide submenu (if
					 *          available). Performs sorting if the sorter
					 *          buttons were clicked, otherwise hides/shows the
					 *          column that was clicked.
					 */
					handleHdMenuClick : function(item) {

						if (Ext.isEmpty(this.isResponsiveGrid)
								|| !this.isResponsiveGrid) {
							this.superclass().handleHdMenuClick
									.call(this, item);
							return;
						}
						var itemMenuIndex;
						if (Ext.isEmpty(item.parentMenu)
								|| Ext.isEmpty(item.parentMenu.itemMenuIndex)) {
							itemMenuIndex = this.hdCtxIndex;
						} else
							itemMenuIndex = item.parentMenu.itemMenuIndex;
						var store = this.ds, dataIndex = this.expandcm
								.getDataIndex(itemMenuIndex);

						switch (item.getItemId()) {
						case 'asc':
							store.sort(dataIndex, 'ASC');
							break;
						case 'desc':
							store.sort(dataIndex, 'DESC');
							break;
						/*
						 * case 'filters': item.menu.removeAll(); var menu=
						 * item.menu.add();
						 * item.setMenu(this.grid.gridFilter.resMenu[itemMenuIndex].menu);
						 * break;
						 */
						/*
						 * default: this.handleHdMenuClickDefault(item);
						 */
						}
						return true;
					}
					
					/*
					 * Overridden method user for responsive grouping grid
					 */

					,
					beforeColMenuShowGroup : function() {

						var colMenu = this.colMenu;

						var colModel;
						var cm;
						colModel = this.expandcm.grpColumns;
						cm = this.expandcm;
						colMenu.removeAll();
						var thatGridFilter = this.grid.gridFilter;
						var that = this;
						for (var i = 0; i < colModel.length; i++) {

							sortable = cm.isSortable(i);
							// if(colModel[i].hidden == false){

							if (colModel[i].id == 'checker') {
								continue;
							}

							if (colModel[i].childs) {

								if (this.childMenu) {

									this.childMenu.destroy();
								}

								this.childMenu = new Ext.menu.Menu({
									id : colModel[i].id + '-hcols-menu'
								});

								var parentHidden;

								var colChildModel = colModel[i].childs;

								for (var j = 0; j < colChildModel.length; j++) {

									this.childMenu
											.add(new Ext.menu.Item(
													{

														text : cm
																.getColumnById(colChildModel[j].id).header, 

														itemId : 'resp-col-'
																+ colChildModel[j].id,
														// disabled :
														// cm.config[i].hideable
														// === false,
														iconCls : 'x-cols-icon',

														menu : {
															items : [
																	{
																		itemId : 'asc',
																		text : this.sortAscText,
																		disabled : !sortable,
																		cls : 'xg-hmenu-sort-asc'
																	},
																	{
																		itemId : 'desc',
																		text : this.sortDescText,
																		disabled : !sortable,
																		cls : 'xg-hmenu-sort-desc'
																	},
																	{
																		checked : false,
																		itemId : 'filters',
																		text : thatGridFilter.menuFilterText,
																		// menu:[]
																		menu : thatGridFilter.filters
																				.get(i).menu,
																		listeners : {
																			'checkchange' : thatGridFilter.onCheckChange
																					.createDelegate(thatGridFilter),
																			'beforecheckchange' : thatGridFilter.onBeforeCheck
																					.createDelegate(thatGridFilter),
																			'beforeshow' : thatGridFilter.onMenu
																					.createDelegate(thatGridFilter),
																			'beforehide' : thatGridFilter.beforeHide
																					.createDelegate(thatGridFilter)
																		}
																	} ],

															listeners : {
																'itemclick' : that.handleHdMenuClick
																		.createDelegate(that)
															},
															itemMenuIndex : i
														},

														// checked :
														// !colChildModel[j].hidden,

														// disabled :
														// colModel.config[i].hideable
														// === false,

														hideOnClick : false

													}));
									this.childCol = true;

									this.childMenu.on("itemclick",
											this.updateHiddenColumns, this,
											this.childcol);

									this.childMenu.on({

										scope : this

									// beforeshow: this.beforeColChildMenuShow,

									// itemclick : this.handleHdChildMenuClick

									});
								}
								var childsHidden = 0;

								for (var k = 0; k < colChildModel.length; k++) {

									if (colChildModel[k].hidden) {

										childsHidden++;
									}
								}
								if (childsHidden == colChildModel.length) {

									parentHidden = true;
								} else {

									parentHidden = false;
								}

								colMenu
										.add(new Ext.menu.Item(
												{
													text : colModel[i].header,
													itemId : 'resp-col-'
															+ colModel[i].id,
													// disabled :
													// cm.config[i].hideable ===
													// false,
													iconCls : 'x-cols-icon',
													// checked : !parentHidden,
													// disabled : true,
													menu : this.childMenu ? this.childMenu
															: {
																items : [
																		{
																			itemId : 'asc',
																			text : this.sortAscText,
																			disabled : !sortable,
																			cls : 'xg-hmenu-sort-asc'
																		},
																		{
																			itemId : 'desc',
																			text : this.sortDescText,
																			disabled : !sortable,
																			cls : 'xg-hmenu-sort-desc'
																		},
																		{
																			checked : false,
																			itemId : 'filters',
																			text : thatGridFilter.menuFilterText,
																			// menu:[]
																			menu : thatGridFilter.filters
																					.get(i).menu,
																			listeners : {
																				'checkchange' : thatGridFilter.onCheckChange
																						.createDelegate(thatGridFilter),
																				'beforecheckchange' : thatGridFilter.onBeforeCheck
																						.createDelegate(thatGridFilter),
																				'beforeshow' : thatGridFilter.onMenu
																						.createDelegate(thatGridFilter),
																				'beforehide' : thatGridFilter.beforeHide
																						.createDelegate(thatGridFilter)
																			}
																		} ],

																listeners : {
																	'itemclick' : that.handleHdMenuClick
																			.createDelegate(that)
																},
																itemMenuIndex : i

															},

													// checked :
													// !colChildModel[j].hidden,

													// disabled :
													// colModel.config[i].hideable
													// === false,

													hideOnClick : false
												}));
							} else {
								colMenu
										.add(new Ext.menu.Item(
												{
													text : cm
															.getColumnById(colModel[i].id).header, 
													itemId : 'resp-col-'
															+ colModel[i].id,
													iconCls : 'x-cols-icon',
													// checked :
													// !colModel[i].hidden,
													// disabled :
													// cm.config[i].hideable ===
													// false,
													menu : {
														items : [
																{
																	itemId : 'asc',
																	text : this.sortAscText,
																	disabled : !sortable,
																	cls : 'xg-hmenu-sort-asc'
																},
																{
																	itemId : 'desc',
																	text : this.sortDescText,
																	disabled : !sortable,
																	cls : 'xg-hmenu-sort-desc'
																},
																{
																	checked : false,
																	itemId : 'filters',
																	text : thatGridFilter.menuFilterText,
																	// menu:[]
																	menu : thatGridFilter.filters
																			.get(i).menu,
																	listeners : {
																		'checkchange' : thatGridFilter.onCheckChange
																				.createDelegate(thatGridFilter),
																		'beforecheckchange' : thatGridFilter.onBeforeCheck
																				.createDelegate(thatGridFilter),
																		'beforeshow' : thatGridFilter.onMenu
																				.createDelegate(thatGridFilter),
																		'beforehide' : thatGridFilter.beforeHide
																				.createDelegate(thatGridFilter)
																	}
																} ],

														listeners : {
															'itemclick' : that.handleHdMenuClick
																	.createDelegate(that)
														},
														itemMenuIndex : i

													},
													hideOnClick : false
												}));
							}
						}

					}

				
				/*
				 * , handleHdMenuClickDefault: function(item) { var colModel =
				 * this.cm, itemId = item.getItemId(), index =
				 * colModel.getIndexById(itemId.substr(4)); totalColumns =
				 * this.cm.getColumnCountIgnoreCheckBox(true); if (index != -1 &&
				 * (totalColumns>1 || item.checked==false)) { if (item.checked &&
				 * colModel.getColumnsBy(this.isHideableColumn, this).length <=
				 * 1) { this.onDenyColumnHide(); return; }
				 * colModel.setHidden(index, item.checked); } } , onHiddenChange :
				 * function(cm, col, hidden) { this.updateColumnHidden(col,
				 * hidden); this.refresh(); }
				 */
			
				});

iportal.listview.paginggrid = Ext
		.extend(
				cbx.grid.GridPanel,
				{
					// Either an Array of field definition objects as passed to
					// Ext.data.Record.create, or a Record constructor created
					// using Ext.data.Record.create.
					recordType : [],
					// The bottom tool bar of the panel. This can be a
					// Ext.Toolbar object, a toolbar config, or an array of
					// buttons/button configs to be added to the toolbar
					buttonBar : null,
					// extraParamsHandler needs to invoke to submit Extra
					// parameters as part of request params while grid component
					// retrieving data from server
					extraParamsHandler : null,
					//
					scrollNotRequired : false,
					productCode : "",
					subProductCode : "",
					functionCode : "",
					checkboxselection : false,

					// An function needs to executes when a row is selected.
					rowSelectEvent : "",
					cellActions : null,
					filterparams : null,
					loadHandler : Ext.emptyFn,
					enableHdMenu : true,
					pageSize : null,
					sortConfig : null, 
					autoLoadStore : true, // to load the grid data only in
											// case of the expanded mode.
					totalResultIndicator : false,
					plugins : [ CT.listview.ResponsiveGridPlugin ],
					initComponent : function() {
		var rb = CRB.getFWBundle(); 
		var cuser = CRB.getFWBundle(); 
						this.on("viewready", this.handleViewReady, this);
						var selectionModel = new canvas.grid.RowSelectionModel(
									{
										singleSelect : true
									});
						if('CELLSINGLE' === this.selectionType){
							selectionModel = new canvas.grid.CellSelectionModel({singleSelect:true});
						}else if('CELLMULTI' === this.selectionType){
							selectionModel = new canvas.grid.CellSelectionModel({singleSelect:false});
						}
						// if checkboxselection is enabled in component need to
						// create object of CheckboxSelectionModel to add it in
						// component
						if (this.checkboxselection == true) {
							selectionModel = new canvas.grid.CheckboxSelectionModel(
									{
										singleSelect : false
									});

						}
						if (!Ext.isEmpty(this.rowSelectEvent)) {
							selectionModel.addListener("rowselect",
									this.rowSelectEvent, this);
						}
						var extraParams = {
							"__LISTVIEW_REQUEST" : "Y",
							"PAGE_CODE_TYPE" : 'VDF_CODE',
							"INPUT_ACTION" : "INIT_DATA_ACTION",
							"PRODUCT_NAME" : this.productCode,
							"INPUT_FUNCTION_CODE" : this.functionCode,
							"INPUT_SUB_PRODUCT" : this.subProductCode,
							"WIDGET_ID" : this.itemId.substring(0, this.itemId
									.indexOf("__GRID")),
							"VIEW_ID" : this.view_id,
							
							"WORKSPACE_ID": iportal.workspace.metadata.getCurrentWorkspaceId(),
							"LAYOUT_ID":iportal.workspace.metadata.getCurrentLayoutId(),
						
							"forceCallbacks" : true
						// start:"0" 
						};
						//  Removed tHe start value
						// as a fix for paging grid scroll
						if (!Ext.isEmpty(this.filterparams)) {
							for (each in this.filterparams) {
								extraParams[each] = this.filterparams[each];
							}

						}

						var that = this;

						this.selectedCcy = iportal.preferences
								.getEquivalentCurrency();

						this.setScrollNotRequired = function(autoHeight) {

							this.scrollNotRequired = autoHeight;
						}

						// if application specific extraParamsHandler is given ,
						// frmaemwork invokes the handler to append above
						// extraParams with the application specific required
						// params entries.
						function getExtParams(param) {
							if (!Ext.isEmpty(param)) {
								var extParams = param.apply(that,
										[ extraParams ]); // CHG_EXTRA_PARAMS
								if (!Ext.isEmpty(that.filterparams)) {
									for (each in that.filterparams) {
										extParams[each] = that.filterparams[each];
									}
								}
								return extParams;

							} else {
								return extraParams;
							}

						}
						/*
						 * To display emptyText in List View if a customised
						 * message to be passed
						 */
						var emptyTextMsg = rb.LOADING; 
						if (Ext.util.Format.trim(this.emptyText) !== '')
							emptyTextMsg = this.emptyText;
						this.jsonReader = new Ext.data.JsonReader({
							root : 'response.value.ALL_RECORDS',
							totalProperty : 'response.value.TOTAL_COUNT',
							id : 'id'
						}, this.recordType);
						/**
						 * This intended to hide and remove REFRESh_DATE
						 * property from request params if available
						 */
						/**
						 *  passing the store & records. Once it
						 * receives firing the event.
						 */
						function doAfterLoad(store, records) {
							that.ownerCt.mvConf.fireEvent(
									'resizeafterdatacall', records.length);
						
							if (records.reader
									&& records.reader.jsonData
									&& records.reader.jsonData.response
									&& records.reader.jsonData.response.value
									&& records.reader.jsonData.response.value.ADDITIONAL_DATA
									&& records.reader.jsonData.response.value.ADDITIONAL_DATA.ENTL_ERROR) {
								if (rb[records.params['WIDGET_ID']
										+ "_ENTL_ERROR"]) {
									that.view.emptyText = rb[records.params['WIDGET_ID']
											+ "_ENTL_ERROR"];
								} else {
									that.view.emptyText = rb[records.reader.jsonData.response.value.ADDITIONAL_DATA.ENTL_ERROR];
								}
							}
							
							else if (this.baseParams.IS_FILTER_FORM
									&& !that.isDataAvailable()) {
								var widgetResBundle = CRB.getBundle(that.bundle);
								if (widgetResBundle[that.systemViewId
										+ "_FILTER_NO_DATA_MSG"]) {

									that.view.emptyText = widgetResBundle[that.systemViewId
											+ "_FILTER_NO_DATA_MSG"];

								} else {
									that.view.emptyText = rb.FILTER_NO_DATA_MSG;
								}

							}

							/**
							 * Can give widget oriented empty text in the grid,
							 * if the widget do have any records to show.
							 */
							else if (records.length == 0|| Ext.isEmpty(that.jsonReader.jsonData.response.value.ALL_RECORDS)) {
								var widgetResBundle = CRB.getBundle(that.bundle);
								if (widgetResBundle[that.systemViewId
										+ "_NO_DATA_MSG"]) {
									that.view.emptyText = widgetResBundle[that.systemViewId
											+ "_NO_DATA_MSG"];
								} else {
									that.view.emptyText = Ext.util.Format
											.trim(that.emptyText) !== '' ? that.emptyText
											: rb.NO_DATA_MSG;
								}
							}
							setTimeout(function() {
								that.lmask.hide();
							}, 200);
							var panelId = that.id.replace('__GRID', '_PANEL');

							// var disc_manager =
							// iportal.framework.globaldisclaimer
							// .getInstance();
							// To Display Disclaimer Text above the footer layer
							// ends
							if (this.baseParams.REFRESH_DATA)
								delete this.baseParams.REFRESH_DATA;

							store.isLoading = false;
							that.view.applyEmptyText();
						}
						;
						
						doAfterLoad = doAfterLoad
								.createSequence(this.loadHandler);

						
						function doBeforeLoad(store, options) {
							var params = getExtParams(that.extraParamsHandler);
							Ext.apply(options.params, params);
						}
						
						var pageSize = iportal.systempreferences
								.getPageSizeForPagination();
						if (this.pageSize != null && this.pageSize != ""
								&& !isNaN(this.pageSize)) {
							try {
								var mdPageSize = parseInt(this.pageSize);
								if (mdPageSize > 1) {
									pageSize = mdPageSize;
								}
							} catch (e) {
								pageSize = 46;
							}

						}
						this.store = new cbx.grid.Store({
							autoLoad : false,
							bufferSize : pageSize,
							baseParams : getExtParams(this.extraParamsHandler),
							reader : this.jsonReader,
							bundle : this.bundle,
							url : iportal.listview.listviewconstants.AJAX_URL,
							sortInfo : this.sortConfig, 
							listeners : {
								"load" : doAfterLoad,
								'loadexception' : doAfterLoad,
								"beforeload" : doBeforeLoad
							

							}
						});
						var opt = {};
						opt.params = opt.params || {};
						opt.params.limit = pageSize;
						opt.params.start = 0;
						opt.add = true;
						this.store.lastOptions = opt

						this.selModel = selectionModel;
						var colListLength = this.columnList.length;
						if (Ext.isEmpty(colListLength)) {
							colListLength = 0;
						}
						if (!Ext.isEmpty(this.columnList.length)
								&& this.columnList.length > 0) {
							if (colListLength > 10) {
								this.autoExpandColumn = this.columnList[colListLength - 1];
								this.autoExpandMin = 150;
							}
						}

						/*  To add min and max expand column
						 * value, restricting the last column resize range
						 */
						this.autoExpandMax = 500 
						this.autoExpandMin = 150
						
						var nearLimit = iportal.systempreferences
								.getLiveGridNearLimit();

						if (pageSize < nearLimit) {
							nearLimit = pageSize - 1;
						}
						
						var viewConfig = {
							forceFit : false,
							emptyText : emptyTextMsg,
							nearLimit : iportal.systempreferences
									.getLiveGridNearLimit(),
							loadMask : false,
							/*
							 * loadMask : { msg : rb.LOADING_MSG },
							 */
							autoFill : false,
							listeners : {
								'refresh' : function(view) {
								}

							},
							updateColumnHidden : function(col, hidden){
						        var llen = this.cm.getLockedCount(),
					            ns, rw, c, row,
					            display = hidden ? 'none' : '';
					        this.updateLockedWidth();
					        if(col < llen){
					            ns = this.getLockedRows();
					            rw = this.getLockedWidth();
					            c = col;
					        }else{
					            ns = this.getRows();
					            rw = this.getTotalWidth();
					            c = col - llen;
					        }
					        var hd = this.getHeaderCell(col);
					        hd.style.display = display;
					        for(var i = 0, len = ns.length; i < len; i++){
					            row = ns[i];
					            row.style.width = rw;
					            if(row.firstChild){
					                row.firstChild.style.width = rw;
					                row.firstChild.rows[0].childNodes[c].style.display = display;
					            }
					        }
					        this.onColumnHiddenUpdated(col, hidden, this.getTotalWidth());
					        delete this.lastViewWidth;
					        this.layout();
							if(this.syncHeights){
								this.refresh();
							}
					    }
						};

						this.fireEvent('highlight', this.store, viewConfig);
						if (!Ext.isEmpty(this.cm.columns)) {
							for ( var index = 0; index < this.cm.columns.length; index++) {
								if (!Ext.isEmpty(this.cm.columns[index])) {
									if (this.cm.columns[index].hidden === false && this.cm.columns[index].xtype=="canvastemplatecolumn") {
										viewConfig.syncHeights=true;
										break;
									}
								}
							}
						}
						this.view = new cbx.grid.GridView(viewConfig);
						
						// adding bbar if the totalResult information is reqd to
						// display
						if (this.totalResultIndicator === true) {
							this.bbar = new cbx.paginggrid.toolbar({
								grid : this,
								displayInfo : true,
								refreshButton : false
							});

						}

					

						this.ctCls = 'list-view';
						this.stripeRows = true;
						this.width = 'auto';
						if (this.enableHdMenu == null
								|| this.enableHdMenu == 'undefined') {
							this.enableHdMenu = true;
						}
						// this.height = 210; Removed for the resize height
						// problem
						this.autoHeight = this.scrollNotRequired;
						this.enableHdMenu = true;
					//	this.enableColumnMove = true; 
						this.enableDragDrop = false;
						this.columnLines = true;
						
						if(!Ext.isEmpty(this.cellActions)){
							
							if (!Ext.isEmpty(this.plugins)) {
								for (var i = 0; i < this.cellActions.length; i++)
									this.plugins.push(this.cellActions[i]);
							} else
								this.plugins = this.cellActions;
							
						}
						
				

						// this.addEvents('statechange','currencychange');
						this.stateful = true;
						if (!this.stateEvents) {
							this.stateEvents = [];
						}
						this.stateEvents.push('statechange');
						this.stateId = this.getStateId();
						iportal.listview.paginggrid.superclass.initComponent
								.call(this);
					},
					getStateId : function() {
						return this.itemId + '_' + this.view_id + '_GV';
					},
					/**
					 * The Method Responsible for give the store params which holds the source of list view data
					 */
					getPrintData : function() {
						var store = this.store || this.getStore();
						return store.baseParams;
					},
					// CgetState()==>SAVE PREFERENCES
					// SUPPORT FOR PAGING GRID
					
					// This method is used to get the current state of
					// the grid.
					// Sorting information, filter details, column
					// changes are fetched and returned.
					getState : function() {
						var that = this;
						// var _state =
						// iportal.listview.livegrid.superclass.getState.apply(this,
						// arguments);

						var colProperties = [];
						var columns = this.getColumnModel().columns;
						var col;
						var sortInfo = this.getStore().sortInfo;
						
						if (!Ext.isEmpty(sortInfo)) {
							sortInfo['position'] = 1;
						}
						
						// Getting the column changes (visibility and
						// position changes)
						for (i = 0; i < columns.length; i++) {
							col = columns[i];
							var colProp = {};
							colProp['_id'] = col.id;
							colProp['_hidden'] = (col.hidden == true) ? 'Y'
									: 'N';
							colProp['_dataindex'] = col.dataIndex;
							colProp['_position'] = i + 1;
							colProperties.push(colProp);
						}

						// Getting the Filter details
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

						// Creating the state object
						var _state = {};
						if (_state) {
							// Code added append the currency
							// value on live grid's filter baseparams
							if (filterBaseParams.CURRENCY_CD) {
								_state['_gvOpt'] = {
									'eqvt_ccy' : filterBaseParams.CURRENCY_CD
								};
							}
							_state['_sortInfo'] = sortInfo;
							_state['_colProperties'] = colProperties;
							_state['_colFilters'] = colFilters;
						} else {
							// Code added append the currency
							// value on live grid's filter baseparams
							_state = {
								'_gvOpt' : {
									'eqvt_ccy' : (filterBaseParams.CURRENCY_CD ? filterBaseParams.CURRENCY_CD
											: null)
								},
								'_sortInfo' : that.getStore().sortInfo,
								'_colProperties' : colProperties,
								'_colFilters' : colFilters
							};
						}
						return _state;
					},
					
					/**
					 * Intended to add REFRESH_DATA = Y to base params and
					 * reload Store. P.S REFRESH_DATA this will be deleted after
					 * data load success/failure.
					 */
					reloadData : function() {
						var store = this.getStore();
						store.baseParams['REFRESH_DATA'] = 'Y';
						// store.load();
						this.loadStore();
					},
					/**
					 * Intended to check whether store has data or not. Return
					 * true if available else false;
					 */
					isDataAvailable : function() {
						if (this.getStore().getCount() > 0) {
							return true;
						}
						return false;
					},
					
					onRender : function(ct, position) {
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
						else{
						if (this.sortConfig) {
							this.getStore().sortInfo = this.sortConfig;
						}
						}
						this.setFilters();
						this.updateColumnHeaders();
						this.updateColumnsState();
						iportal.listview.paginggrid.superclass.onRender.apply(
								this, arguments);
						this.view.layout();
					},
					updateColumnsState: function()
					{
						var colModel=this.getColumnModel();
						var currentColState=this._colProperties;
						if(colModel && currentColState)
						{
							var i=(colModel.columns[0].xtype==="actioncolumn")?1:0;//CTCBXQ215F01_UPD-Widget TBAR related issues
							for(;i<this._colProperties.length;i++)
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
                
					afterRender : function() {
						iportal.listview.paginggrid.superclass.afterRender
								.apply(this, arguments);
		this.lmask = new Ext.LoadMask(this.ownerCt.bwrap, {msg:CRB.getFWBundle()['LOADING_MSG']});
						if (this.autoLoadStore)
							this.loadStore();
						
						var that = this.getView();
						this.getColumnModel().on('hiddenchange', function() {
							that.updateAllColumnWidths();
						});
						
						this.on('columnresize', function(colIndex, newSize) {
							var that = this;
							this.getView().refresh();
							setTimeout(function() {
								that.getView().updateHeaderSortState();
							}, 10);
						}); 
					},
					// Replace the "setFilters()"
					// function and "updateColumnHeaders()" function.
					// Add a new function called "convertStringtoDate()"
					
					setFilters : function() {
						
						if (this.gridFilter) {
							var gridFilters = this.gridFilter.gridViewFilters;
							
							// this code added for set filter value
							if(this.store.baseParams["LOOKUP_FLAG"]=="true")
							{
								var lookup_Filter_Field="";
								var lookup_Filter_Value="";
								var lookup_Filter_Type="";
								
								if(this.store.baseParams["ResetStoreValues"])
								{
								// second time onwards assign the params
								// in to separeate params to the store
								// and delete the base params initially
								// available in store,
								// and get the params from the store and
								// assign it to the filters.
									
									lookup_Filter_Field=this.store.baseParams["LOOKUP_TEXT"];
									lookup_Filter_Value=this.store.baseParams["LOOKUP_VALUE_TXT"];
									lookup_Filter_Type=this.store.baseParams["LOOKUP_TYPE"];										
								}
								else
								{
									
									// First time params are available
									// in the store,so get the params
									// from the store and assign it to
									// the filters.
									var count=this.store.baseParams["COLUMN_COUNT"];
									lookup_Filter_Field=this.store.baseParams["FILTER"+(count)+"_FIELD"];
									lookup_Filter_Value=this.store.baseParams["FILTER"+(count)+"_VALUE_TXT"];
									lookup_Filter_Type=this.store.baseParams["FILTER"+(count)+"_TYPE"];
									
								}								
								var filterArr=new Array();
								filterArr.push(lookup_Filter_Value);
								this.gridViewFilters_lookup  =[ new Ext.data.JsonStore({
				                   	FLD_FILTER_VALUES: filterArr,
				                   	FLD_COLUMN_ID :lookup_Filter_Field,
				                   	FLD_FILTER_TYPE :lookup_Filter_Type
								})];
							
							}
							 
							this.gridFilter
									.deleteOldFilters(this.store.baseParams);

							if (gridFilters.length > 0) {
								this.store.baseParams["IS_FILTER_FORM"] = "true";
								this.store.baseParams["COLUMN_COUNT"] = gridFilters.length;
								for (i = 0; i < gridFilters.length; i++) {
									var tmpFilter = this.gridFilter
											.getFilter(gridFilters[i].FLD_COLUMN_ID);
									if (tmpFilter) {
										if (tmpFilter.type == "string"
												|| tmpFilter.type == "numeric"
												|| tmpFilter.type == "float") {
											this.store.baseParams['FILTER'
													+ (i + 1) + '_FIELD'] = gridFilters[i].FLD_COLUMN_ID;
											this.store.baseParams['FILTER'
													+ (i + 1) + '_CONSTRAINT'] = gridFilters[i].FLD_FILTER_TYPE;
											this.store.baseParams['FILTER'
													+ (i + 1) + '_VALUE_TXT'] = gridFilters[i].FLD_FILTER_VALUES[0];
										} else {
											this.store.baseParams['FILTER'
													+ (i + 1) + '_FIELD'] = gridFilters[i].FLD_COLUMN_ID;
											this.store.baseParams['FILTER'
													+ (i + 1) + '_CONSTRAINT'] = gridFilters[i].FLD_FILTER_TYPE;
											this.store.baseParams['FILTER'
													+ (i + 1) + '_VALUE_TXT'] = gridFilters[i].FLD_FILTER_VALUES[0];
											this.store.baseParams['FILTER'
													+ (i + 1) + '_VALUE_DATE'] = gridFilters[i].FLD_FILTER_VALUES[1];
											this.store.baseParams['FILTER'
													+ (i + 1) + '_VALUE_DATE2'] = gridFilters[i].FLD_FILTER_VALUES[2];
										}
									} else {
										this.store.baseParams['FILTER'
												+ (i + 1) + '_FIELD'] = gridFilters[i].FLD_COLUMN_ID;
										this.store.baseParams['FILTER'
												+ (i + 1) + '_CONSTRAINT'] = gridFilters[i].FLD_FILTER_TYPE;
										this.store.baseParams['FILTER'
												+ (i + 1) + '_VALUE_TXT'] = gridFilters[i].FLD_FILTER_VALUES[0];
										this.store.baseParams['FILTER'
												+ (i + 1) + '_VALUE_DATE'] = gridFilters[i].FLD_FILTER_VALUES[1];
										this.store.baseParams['FILTER'
												+ (i + 1) + '_VALUE_DATE2'] = gridFilters[i].FLD_FILTER_VALUES[2];
									}
								}
							} else {
								delete this.store.baseParams["IS_FILTER_FORM"];
								delete this.store.baseParams["COLUMN_COUNT"];
							}
						}

					},

					updateColumnHeaders : function() {
						
						 
						// this code added for set filter values in the
						// menus
						if(this.store.baseParams["LOOKUP_FLAG"]==="true")
						{	
							this.gridFilter.gridViewFilters=this.gridViewFilters_lookup;
							this.gridViewFilters_lookup=[];
							
						}
						 
						if (this.gridFilter) {
							var gridFilters = this.gridFilter.gridViewFilters;
							if (gridFilters.length > 0) {
								for (i = 0; i < gridFilters.length; i++) {
									var tmpFilter = this.gridFilter
											.getFilter(gridFilters[i].FLD_COLUMN_ID);

									if (tmpFilter) {
										var value = gridFilters[i].FLD_FILTER_VALUES[0];
										var value1 = gridFilters[i].FLD_FILTER_VALUES[1];
										LOGGER.info("gridfilters",
												gridFilters[i]);
										LOGGER.info("value from between:"
												+ value);
										var gridFilterType = gridFilters[i].FLD_FILTER_TYPE;
										if (tmpFilter.type == "string") {

											tmpFilter.menu.fields['def']
													.setValue(value);

										} else if (tmpFilter.type == "list") {
											tmpFilter.menu.setSelected(value);
										} else if (tmpFilter.type == "numeric"
												|| tmpFilter.type == "float") {

											var cons = null;
											LOGGER.info("value" + [ value ]);
											if (gridFilters[i].FLD_FILTER_TYPE) {
												cons = (gridFilters[i].FLD_FILTER_TYPE == "<" ? "lt"
														: (gridFilters[i].FLD_FILTER_TYPE == ">" ? "gt"
																: (gridFilters[i].FLD_FILTER_TYPE == "M" ? "most"
																		: (gridFilters[i].FLD_FILTER_TYPE == "L" ? "least"
																				: "eq"))));
											}
											if (cons != null) {
												var key, field;
												for (key in tmpFilter.menu.fields) {
													field = tmpFilter.menu.fields[key];
													if (field.itemId === "range-"
															+ cons) {
														tmpFilter.menu.fields[cons]
																.setValue(value);
													}
												}

											} else {
												tmpFilter.menu.setValue(value);
											}

										} else if (tmpFilter.type == "date") {
											var key;

											try {
												for (key in tmpFilter.fields) {
													if (gridFilterType === "PREVIOUS_MONTH"
															&& key === "range-lastmonth") {
														tmpFilter.fields[key]
																.setChecked(true);

													} else if (gridFilterType === "LAST_N_DAY"
															&& key === "range-last_n_daysperiods") {

														tmpFilter.fields[key]
																.setValue(value);
														tmpFilter.fields['last_n_days']
																.setChecked(true);
													} else if (gridFilterType === "LAST_N_MONTH"
															&& key === "range-last_n_monthsperiods") {

														tmpFilter.fields[key]
																.setValue(value);
														tmpFilter.fields['last_n_months']
																.setChecked(true);
													} else if (gridFilterType === "range"
															&& key === "between") {
														tmpFilter.fields['range-betweenfrom']
																.setValue(value);
														tmpFilter.fields['range-betweento']
																.setValue(value1);
														tmpFilter.fields[key]
																.setChecked(true);
													} else if (gridFilterType === "lt"
															&& key === "before") {
														var date = this
																.convertStringtoDate(value);
														tmpFilter.fields['before'].menu.picker
																.setValue(date);
														tmpFilter.fields['before']
																.setChecked(true);
													} else if (gridFilterType === "gt"
															&& key === "after") {
														var date = this
																.convertStringtoDate(value);
														tmpFilter.fields[key].menu.picker
																.setValue(date);
														tmpFilter.fields[key]
																.setChecked(true);
													} else if (gridFilterType === "dtEquals"
															&& key === "on") {
														var date = this
																.convertStringtoDate(value);
														tmpFilter.fields[key].menu.picker
																.setValue(date);
														tmpFilter.fields[key]
																.setChecked(true);
													}
												}

											} catch (e) {
												LOGGER.error(e);
											}

										}
										tmpFilter.active = true;
									}
								}
								this.gridFilter.updateColumnHeadings();
							} else {
								this.gridFilter.clearFilters();
							}
						}
					},

					convertStringtoDate : function(sdate) {
						if (!Ext.isEmpty(sdate) && typeof (sdate) == 'string') {
							var vals = sdate.split("-");
							var xdate = null;
							var monthfield = vals[0];
							var dayfield = vals[1];
							var yearfield = vals[2];
							xdate = new Date(yearfield, monthfield - 1,
									dayfield);
							if ((xdate.getMonth() + 1 != monthfield)
									|| (xdate.getDate() != dayfield)
									|| (xdate.getFullYear() != yearfield)) {
								LOGGER.error("Invalid Date", sdate);
								return sdate;
							} else {
								xdate = new Date();
								var intvals = [ Number(vals[1]),
										Number(vals[0]), Number(vals[2]) ];
								xdate.setFullYear(intvals[2], intvals[1] - 1,
										intvals[0]);
								return xdate;
							}
						} else
							return sdate;
					},
					
					updateGridFiltersFromState : function() {
						if (this._colFilters) {
							var gridFilters = [];
							this.gridFilter
									.deleteOldFilters(this.store.baseParams);
							if (this._colFilters) {
								for (i = 0; i < this._colFilters.length; i++) {
									var tmpFilter = {};
									var filterValues = [];
									filterValues[0] = this._colFilters[i]['_value_txt'];
									
									filterValues[1] = this._colFilters[i]['_value_date']
											|| '';
									filterValues[2] = this._colFilters[i]['_value_date2']
											|| '';
								
									tmpFilter['FLD_COLUMN_ID'] = this._colFilters[i]['_field'];
									tmpFilter['FLD_FILTER_TYPE'] = this._colFilters[i]['_constraint'];
									tmpFilter['FLD_FILTER_VALUES'] = filterValues;
									gridFilters.push(tmpFilter);
								}
								this.gridFilter.gridViewFilters = gridFilters;
							}
						}
						
					},
					handleViewReady : function() {

    	var rb = CRB.getFWBundle(); 

						this.view.emptyText = rb.LOADING;

						this.view.applyEmptyText();
						

					}
					
					,
					destroy : function() {
						Ext.state.Manager.clear(this.stateId);
						iportal.listview.paginggrid.superclass.destroy
								.call(this);
					}
				
				});

// register xtype to allow for lazy initialization
Ext.reg('paginggrid', iportal.listview.paginggrid);