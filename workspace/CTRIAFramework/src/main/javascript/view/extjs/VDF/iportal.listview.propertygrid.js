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
 * iportal.listview.propertygrid This class is intended to be used when the data is needed to be shown in a key value
 * form in a 2 column grid. This class code is taken from livegrid and modified to work with standard ext grid panel.
 * iportal.listview.listviewpanel will be responsible for creating the instance of a propertygrid.
 */

Ext.namespace('iportal.listview');

iportal.listview.propertygrid = Ext
			.extend(
						Ext.grid.GridPanel,
						{
							// Either an Array of field definition objects as passed to Ext.data.Record.create, or a
							// Record constructor created using Ext.data.Record.create.
							recordType : [],
							// The bottom tool bar of the panel. This can be a Ext.Toolbar object, a toolbar config, or
							// an array of buttons/button configs to be added to the toolbar
							buttonBar : null,
							// extraParamsHandler needs to invoke to submit Extra parameters as part of request params
							// while grid component retrieving data from server
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
							loadHandler : Ext.emptyFn,
							initComponent : function ()
							{
								var rb = CRB.getFWBundle();
								var cuser = CRB.getFWBundle();
								this.on("viewready", this.handleViewReady, this);// attaching the 'viewready' event
																					// to the property grid
								var extraParams = {
									"__LISTVIEW_REQUEST" : "Y",
									"PAGE_CODE_TYPE" : 'VDF_CODE',
									"INPUT_ACTION" : "INIT_DATA_ACTION",
									"PRODUCT_NAME" : this.productCode,
									"INPUT_FUNCTION_CODE" : this.functionCode,
									"INPUT_SUB_PRODUCT" : this.subProductCode,
									"WIDGET_ID" : this.itemId.substring(0, this.itemId.indexOf("__GRID")),
									"VIEW_ID" : this.view_id,
									"LAYOUT_ID" : iportal.workspace.metadata.getCurrentLayoutId(),
									"WORKSPACE_ID" : iportal.workspace.metadata.getCurrentWorkspaceId(),
									"forceCallbacks" : true
								};

								var that = this;

								this.selectedCcy = iportal.preferences.getEquivalentCurrency();

								this.setScrollNotRequired = function (autoHeight)
								{

									this.scrollNotRequired = autoHeight;
								}

								// if application specific extraParamsHandler is given , frmaemwork invokes the handler
								// to append above extraParams with the application specific required params entries.

								function getExtParams (param)
								{
									if (!Ext.isEmpty(param))
									{
										var extParams = param(extraParams);
										return extParams;

									} else
									{
										return extraParams;
									}

								}
								/*
								 * To display emptyText in List View if a customised message to be passed
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
								 * This intended to hide and remove REFRESh_DATE property from request params if
								 * available
								 */

								function doAfterLoad (store, records)
								{
									var rb = CRB.getFWBundle();
									var rbCsrLdqy = CRB.getBundle(store.bundle);
									if (records.reader && records.reader.jsonData && records.reader.jsonData.response
												&& records.reader.jsonData.response.value
												&& records.reader.jsonData.response.value.ADDITIONAL_DATA
												&& records.reader.jsonData.response.value.ADDITIONAL_DATA.ENTL_ERROR)
									{
										if (rb[records.params['WIDGET_ID'] + "_ENTL_ERROR"])
										{
											that.view.emptyText = rb[records.params['WIDGET_ID'] + "_ENTL_ERROR"];
										} else
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
										var widgetResBundle = CRB.getBundle(that.bundle);
										if (widgetResBundle[that.systemViewId + "_NO_DATA_MSG"])
										{
											that.view.emptyText = widgetResBundle[that.systemViewId + "_NO_DATA_MSG"];
										} else
										{
											that.view.emptyText = Ext.util.Format.trim(that.emptyText) !== ''
														? that.emptyText : rb.NO_DATA_MSG;
										}
										that.view.applyEmptyText();
									}
									/**
									 * Update the else part for the empty text
									 */
									else
									{
										that.view.emptyText = Ext.util.Format.trim(that.emptyText) !== ''
													? that.emptyText : rb.NO_DATA_MSG;
										that.view.applyEmptyText();
									}
									if (records.length > 0)
									{
										for (i = 0; i < records.length; i++)
										{
											var obj = records[i].json;
											records[i].set('PARTICULARS', null == rbCsrLdqy["LBL_" + obj.PARTICULARS]
														? obj.PARTICULARS : rbCsrLdqy["LBL_" + obj.PARTICULARS]);
											records[i].set('VALUE', obj.VALUE);
											records[i].commit();
										}
									}

									var panelId = that.id.replace('__GRID', '_PANEL');

									if (this.baseParams.REFRESH_DATA)
										delete this.baseParams.REFRESH_DATA;
									if (!Ext.isEmpty(that))
										that.loadMask.hide();

								}

								function doBeforeLoad (store, options)
								{
									var rb = CRB.getFWBundle();

									that.view.emptyText = rb.LOADING;
									
									if(!that.autoLoadInd){
										that.view.applyEmptyText();
									}
								}

								doAfterLoad = doAfterLoad.createSequence(this.loadHandler);
								this.store = new Ext.data.Store({
									autoLoad : this.autoLoadInd,
									baseParams : getExtParams(this.extraParamsHandler),
									reader : this.jsonReader,
									bundle : this.bundle,
									url : iportal.listview.listviewconstants.AJAX_URL,
									listeners : {
										"load" : doAfterLoad,
										'loadexception' : doAfterLoad,
										"beforeload" : doBeforeLoad
									}
								});

								var colListLength = this.columnList.length;
								if (!Ext.isEmpty(this.columnList.length) && this.columnList.length > 0)
								{
									if (colListLength > 10)
									{
										this.autoExpandColumn = this.columnList[colListLength - 1];
										this.autoExpandMin = 150;
									}
								}

								this.view = new Ext.grid.GridView({
									forceFit : false,
									emptyText : emptyTextMsg,
									nearLimit : iportal.systempreferences.getLiveGridNearLimit(),
									loadMask : {
										msg : rb.LOADING_MSG
									},
									deferEmptyText : false,
									autoFill : false,
									listeners : {
										'refresh' : function (view)
										{
										}

									},
									autoExpand : function (preventUpdate)
									{
										try
										{
											var g = this.grid, cm = this.cm;
											g.autoExpandColumn = true;
											if (!this.userResized && g.autoExpandColumn) {
												var tw = g.tw || cm.getTotalWidth(false);
												if (g.tw == null)
												{
													g.tw = tw;
												}
												var aw = this.grid.getGridEl().getWidth(true) - this.getScrollOffset();
												var totalWidth = tw > aw ? tw : aw;
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
															/*if (this.cm.columns[index].hidden === false) {
																cm.setColumnWidth(index, Math.floor(avgWidth), false);
															}*/
															if(this.cm.columns[index].id == 'PARTICULARS' || this.cm.columns[index].id == 'VALUE'){
																cm.setColumnWidth(index, Math.floor(avgWidth), false);
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
										}
									},
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
									}
								});

								this.ctCls = 'list-view';
								this.stripeRows = true;
								this.width = 'auto';
								this.autoHeight = this.scrollNotRequired;
								this.loadMask = {
									msg : rb.LOADING_MSG
								};
								this.enableHdMenu = false;
								this.enableColumnMove = false;
								this.enableDragDrop = false;
								this.columnLines = true;
								this.plugins = this.cellActions;

								this.stateful = false;
								if (!this.stateEvents)
								{
									this.stateEvents = [];
								}
								this.stateId = this.itemId + '_' + this.view_id + '_GV';
								iportal.listview.propertygrid.superclass.initComponent.call(this);
							},
							/**
							 * The Method Responsible for getting the params from the component which holds the source of list view data
							 */
							getPrintData : function ()
							{
								var store = this.store || this.getStore();
								return store.baseParams;
							},

							/**
							 * Intended to add REFRESH_DATA = Y to base params and reload Store.
							 * P.S REFRESH_DATA this will be deleted after data load success/failure.
							 */
							reloadData : function ()
							{
								var store = this.getStore();
								store.baseParams['REFRESH_DATA'] = 'Y';
								store.load();
							},
							/**
							 * Intended to check whether store has data or not.
							 * Return true if available else false;
							 */
							isDataAvailable : function ()
							{
								if (this.getStore().getCount() > 0)
								{
									return true;
								}
								return false;
							},
							onRender : function (ct, position)
							{
								iportal.listview.propertygrid.superclass.onRender.apply(this, arguments);
							},
							afterRender : function ()
							{
								iportal.listview.propertygrid.superclass.afterRender.apply(this, arguments);
							},

							handleViewReady : function ()
							{
								var rb = CRB.getFWBundle();

								this.view.emptyText = rb.NO_DATA_MSG;

								this.view.applyEmptyText();
							}

						});

// register xtype to allow for lazy initialization
Ext.reg('propertygrid', iportal.listview.propertygrid);
