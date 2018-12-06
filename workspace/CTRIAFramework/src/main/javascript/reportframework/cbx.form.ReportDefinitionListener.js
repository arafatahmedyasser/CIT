/**
 * Copyright 2012. Polaris Software Lab Limited. All rights reserved. These materials are confidential and proprietary
 * to Polaris Software Lab Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of Polaris
 * Software Lab Limited.
 * 
 * @author chiranjib.datta
 */

/**
 * <pre>
 * ------------------------------------------------------------------------------------------------------------------------
 * CHANGE CODE 	              AUTHOR 		    DESCRIPTION 						   DATE
 * ------------------------------------------------------------------------------------------------------------------------
 * CHG0001_OT0138_INFO_RPT_FW  Murali R    Report Filter Grid Column width alignment			        14 Sep 2012                                              
 * 
 * IR_ENHANCEMENTS_001       Dharmalingam	   1. Code changes done to add columnspacing in cbx-preinitiliaze event	16 Jan 2013
 *                                         2. Added for tree data not loading issue			
 *                                         3. Fetch the error messages from Resource bundle
 *                                         4. Enhancement for limit on Sorting
 * ------------------------------------------------------------------------------------------------------------------------
 * </pre>
 */
/**
 * DEPLOY_MODULE_ID: TODO: <Check with your lead for correct value>
 */
Ext.ns('cbx.form.listeners');

cbx.form.listeners.INFO_RPT_DEF_FORM = Ext
			.extend(
						Ext.util.Observable,
						{
							constructor : function (config)
							{
								this.rb = CRB.getFWBundle();
								this.fm = config.fm;
								cbx.form.listeners.INFO_RPT_DEF_FORM.superclass.constructor.call(this, config);
							},
							/**
							 * Object/Record:This will keep track of the selected record.
							 */
							recordInConcern : null,
							/**
							 * Object/Array:This will keep track of the Filter Id.
							 */
							filterIdArray : [],
							/**
							 * Object/Array:This will keep track of the Filter Name.
							 */
							filterNameArray : [],
							/**
							 * Object/Ext.grid.GridPanel:The grid panel that will be rendered as a part of external
							 * plugin
							 */
							filterGridPanel : null,
							/**
							 * Object/String:This will keep track whetrher a row needs to be updated or not.
							 */
							isRowUpdate : false,
							/**
							 * Object/Store:Store for the grid.
							 */
							store : new Ext.data.ArrayStore({
								// CBX_DT_RANGE_FIX
								fields : [ 'filterColumnToDisplay', 'filterColumn', 'filterCriteriaToDisplay',
										'filterCriteriaToSend', 'data', {
											name : 'action',
											type : 'string'
										}, {
											name : 'qtip',
											type : 'string'
										} ],// IR_ENHANCEMENTS_001
								data : []
							}),
							/**
							 * Object/Private Method:The method will be used to update the REPORt_FILTER_LIST(hidden
							 * field). Expected to call initially if any data is there in grid.On every save and update
							 * the method will be called also.
							 */
							updateRecord : function (fm, store)
							{
								var filterArray = [];
								store.commitChanges();
								for (var i = 0; i < store.data.length; i++)
								{
									var record = store.getAt(i);
									var filterColumnToDisplay = record.data.filterColumnToDisplay; // CBX_DT_RANGE_FIX
									var filterColumn = record.data.filterColumn;
									var filterCriteriaToSend = record.data.filterCriteriaToSend;
									var filterCriteriaToDisplay = record.data.filterCriteriaToDisplay;
									var data = record.data.data;
									if (data == '' || Ext.isEmpty(data) || data == 'undefined')
									{
										data = 'null';
									}
									filterArray.push({
										'FILTERCOLUMN_TO_DISP' : filterColumnToDisplay,// CBX_DT_RANGE_FIX
										'FILTERCOLUMN' : filterColumn,
										'FILTERCRITERIA' : filterCriteriaToSend,
										'FILTER_CRIT_TO_DISP' : filterCriteriaToDisplay,
										'DATA' : data
									});
								}
								fm.model.setValue('REPORT_FILTER_LIST', filterArray, false);
							},
							/**
							 * Object/Private Method:The method will be used to update the filter criteraia on change of
							 * the filter column
							 */
							updateFilterCriteraStore : function (fm, event, fieldname, value)
							{
								var reportid = fm.extraParams.REPORT_ID;
								var parentReportId = fm.extraParams.PARENT_REPORT_ID;
								Ext.Ajax.request({
									url : iportal.jsutil.getController(),
									method : 'post',
									params : {
										'INPUT_ACTION' : 'GET_FILTER_CRITERIA_ACTION',
										'INPUT_FUNCTION_CODE' : 'VSBLTY',
										'INPUT_PRODUCT' : 'CANVAS',
										'INPUT_SUB_PRODUCT' : 'CANVAS',
										'PAGE_CODE_TYPE' : 'RDF_CODE',
										'PRODUCT_NAME' : 'CANVAS',
										'REPORT_ID' : reportid,
										'PARENT_REPORT_ID' : parentReportId,
										'FILTER_COLUMN' : value
									},

									scope : this,
									success : function (resp, ob)
									{
										var respJson = Ext.decode(resp.responseText);

										var filterid = respJson.FILTER_ID;
										var filtername = respJson.FILTER_NAME;
										var dataType = respJson.DATA_TYPE[0];
										fm.model.setValue('DATA_TYPE', dataType);
										fm.clearValues([ 'REPORT_FILTER_VALUE', 'REPORT_FILTER_VALUE_DT',
												'REPORT_FILTER_VALUE_DT2' ]);
										if (dataType == 'date')
										{
											fm.setVisibleFields([ 'REPORT_FILTER_VALUE' ], false);
											fm.setVisibleFields([ 'REPORT_FILTER_VALUE_DT' ], true);
										} else
										{
											fm.setVisibleFields([ 'REPORT_FILTER_VALUE' ], true);
											fm.setVisibleFields([ 'REPORT_FILTER_VALUE_DT','REPORT_FILTER_VALUE_DT2' ], false);// CBX_DT_RANGE_FIX
										}

										this.filterIdArray = [];
										this.filterNameArray = [];
										// The below block should be refactored
										var counter = 0;
										for (var i = 0; i < filterid.length; i++)
										{
											if (dataType == 'date')
											{
												if (filterid[i] == 'DT_GT' || filterid[i] == 'DT_LT'
															|| filterid[i] == 'DT_EQUALS' || filterid[i] == 'DT_RANGE')
												{
													this.filterIdArray[counter] = filterid[i];
													this.filterNameArray[counter] = filtername[i];
													counter++;
												}
											} else
											{
												this.filterIdArray[i] = filterid[i];
												this.filterNameArray[i] = filtername[i];
											}
										}
										;
										fm.updateComboRawStore('REPORT_FILTER_CRITERIA', this.filterIdArray,
													this.filterNameArray);
										if (this.isRowUpdate && !Ext.isEmpty(this.recordInConcern))
										{
											fm.model.setValue('REPORT_FILTER_CRITERIA',
														this.recordInConcern.data.filterCriteriaToSend, false);
										}
										this.isRowUpdate = false;
									}
								});
							},
							/**
							 * Object/Method:Registering the handlers
							 */
							registerHandlers : function ()
							{
								var that = this;
								// CBXQ312F10_UPD2 Starts
								var maxSelectionNote = that.rb["SORT_COLS_NOTE"];
								var maxSelection = that.rb["SORT_COLS_MAX_LIMIT"];
								maxSelectionNote += '' + maxSelection;
								// CBXQ312F10_UPD2 Ends
								var reportNameToBeDisabled = true;
								this.fm.registerHandler('cbxpreinitialize', function (fm)
								{
									fm.infoRptBtnHandler = new canvas.informationRpt.btnHandler();
									if (fm.extraParams && fm.extraParams.PARENT_REPORT_ID == -1)
									{
										reportNameToBeDisabled = false;
									}
									return {
										'REPORT_NAME' : {
											itemType : 'TEXT',
											disabled : reportNameToBeDisabled
										},
										'REPORT_FILTER_VALUE_DT' : {
											itemType : 'DATE',
											hidden : true
										},

										'REPORT_SEND_MAIL' : {
											itemType : 'CHECKBOX_GROUP',
											preConfig : [ {
												'INBOX' : {
													disabled : true,
													checked : true
												}
											} ]
										},
										'REPORT_FILTER_COLUMN' : {
											itemType : 'COMBO',
											hideLabel : true
										},
										'REPORT_FILTER_CRITERIA' : {
											itemType : 'COMBO',
											hideLabel : true
										},
										'REPORT_FILTER_VALUE' : {
											itemType : 'TEXT',
											hideLabel : true
										},
										'REPORT_FILTER_ADD_BTN' : {
											itemType : 'BUTTON',
											hideLabel : true
										},
										/*
										 * 'REPORT_TOT_COL_GRP_BY' : { itemType : 'COMBO', disabled : true },
										 * 'REPORT_GRP_TOT_BY' : { itemType : 'COMBO', disabled : true },
										 * 'REPORT_ALERT_TO' : { itemType : 'RADIO_GROUP', readOnlyInd : 'Y' },
										 * 'REPORT_SEL_USERS' : { itemType : 'COMBO', disabled : true },
										 */
										'REPORT_FILTER_GRID' : {
											style : 'padding:0px'
										},
										// CBXQ312F10_UPD2 -- Starts
										'REPORT_SORT_BY_COLS' : {
											maxSelection : maxSelection
										},
										"NOTE_SORT_LBL" : {
											plainLbl : maxSelectionNote,
											hidden : !Ext.isNumber(Number(maxSelection)),
											cls : 'rep-note-cls'
										}
									// CBXQ312F10_UPD2 -- Ends
									};
								});
								this.fm.registerHandler('cbxchange', 'REPORT_FILTER_COLUMN',
											that.updateFilterCriteraStore);
								// CBX_DT_RANGE_FIX start
								this.fm.registerHandler('cbxchange', 'REPORT_FILTER_CRITERIA', function (fm, event,
											fieldname, value)
								{
									if (value == 'DT_RANGE')
									{
										fm.setVisibleFields([ 'REPORT_FILTER_VALUE_DT2' ], true);
									} else
									{
										fm.setVisibleFields([ 'REPORT_FILTER_VALUE_DT2' ], false);
									}
								});// CBX_DT_RANGE_FIX end
								/**
								 * Starts Added By Chiranjib for filter grid panel.The registered handler is
								 * cbxexternalplugin.To run this it is assumed that the workbench has been configured
								 * with the latest from framework.
								 */
								this.fm.registerHandler('cbxexternalplugin', 'REPORT_FILTER_GRID', function (fm, event,
											fieldName, value)
								{

									/**
									 * The grid panel that will be rendered. *
									 */
									var rb = CRB.getFWBundle();
									// CHG0001_OT0138_INFO_RPT_FW - Begin
									that.filterGridPanel = new Ext.grid.GridPanel(
												{
													store : that.store,
													border : false,
													autoExpandColumn : true,
													// style : 'border:1px solid
													// #B5B8C8;width:auto',
													id : 'filterGrid',
													disableSelection : true,
													autoHeight : true,
													// layout : 'fit',
													maxheight : 100,
													clicksToEdit : 1,
													colModel : new Ext.grid.ColumnModel({
														defaults : {
															autoWidth : true,
															sortable : true,
															resizable : false,
															menuDisabled : true,

														},
														columns : [ {
															header : rb['LBL_FILER_COLUMN'],
															sortable : true,
															dataIndex : 'filterColumnToDisplay',
															width : '40%',

														}, { // CBX_DT_RANGE_FIX start
															header : rb['LBL_FILER_COLUMN'],
															sortable : true,
															dataIndex : 'filterColumn',
															width : 300,// IR_ISSUE_FIX
															tooltip : rb['LBL_FILER_COLUMN'],
															hidden : true,
															enableColumnHide : true
														// CBX_DT_RANGE_FIX end
														},

														{
															header : rb['LBL_FILER_CRITERIA'],
															dataIndex : 'filterCriteriaToDisplay',
															width : '20%',
														}, {
															header : rb['LBL_DATA'],
															dataIndex : 'data',
															width : '20%',

														}, {
															header : rb['LBL_ACTION'],
															xtype : 'actioncolumn',
															width : '20%',
															items : [ {
																iconCls : 'deleteicon',
																tooltip : 'Delete',
																handler : function (grid, rowIndex, colIndex)
																{
																	var store = grid.getStore();
																	var rec = store.getAt(rowIndex);
																	store.remove(rec);
																	store.commitChanges();
																	that.updateRecord(fm, store);

																}
															} ]
														}, {
															header : 'FilterCriteriaToSend',
															dataIndex : 'filterCriteriaToSend',
															hidden : true,
															enableColumnHide : true,
														} ],
														viewConfig : {
														// forceFit : true
														},
													}),
													sm : new Ext.grid.RowSelectionModel({
														singleSelect : false
													}),

													frame : false,

													iconCls : 'icon-grid',
													listeners : {
														rowdblclick : function (grid, rowIndex, evt)
														{
															that.indexInConcern = rowIndex;
															/**
															 * Change the text and tooltip of the button having id
															 * 'ADD_MORE_CRITERIA' to 'Edit'.Default text will be 'Save'
															 */
															fm.findField('REPORT_FILTER_ADD_BTN').setText(
																		that.rb['LBL_UPDATE']);
															fm.findField('REPORT_FILTER_ADD_BTN').setTooltip(
																		that.rb['LBL_UPDATE']);
															/**
															 * Getting the selected row.This is record for which we have
															 * to concern in case of edit.This is saved for future
															 * reference
															 */
															that.recordInConcern = grid.getSelectionModel()
																		.getSelected();
															that.isRowUpdate = true;
															/**
															 * Setting the data in the individual fields.
															 */
															fm.model.updateValue('REPORT_FILTER_COLUMN',
																		that.recordInConcern.data.filterColumn, false);
															fm.model.setValue('REPORT_FILTER_COLUMN',
																		that.recordInConcern.data.filterColumn, false);

															fm.model.setValue('REPORT_FILTER_VALUE',
																		that.recordInConcern.data.data, false);
															fm.model.setValue('RPT_FILTER_CRIT_TO_SEND',
																		that.recordInConcern.data.filterCriteriaToSend,
																		false);
														}

													},
													afterrender : function (ct, position)
													{
														this.setWidth(this.ownerCt.getWidth() - 20);
													}

												});
									// CHG0001_OT0138_INFO_RPT_FW - End
									function rendererForHidden ()
									{
										return true;
									}
									/**
									 * filterGrid is config inside which the xtype is Panel.and as a item
									 * this.filterGridPanel is configured.This filter grid will be returned as a item
									 * inside form.
									 */

									filterGrid = this.filterGridPanel;
									return filterGrid;
								});
								/**
								 * Private Method.To update the model data for hidden filter list. On every save,update
								 * and delete it will be updated
								 */

								this.fm.registerHandler('cbxclick', 'REPORT_FILTER_ADD_BTN', that.saveChanges);
								// For time being we are not using it
								/*
								 * this.fm.registerHandler('cbxchange', 'REPORT_RATE_CARD', function (fm, event,
								 * fieldName, value){ Ext.Ajax.request({ params : { 'PAGE_CODE_TYPE' : 'GLOBALPREF',
								 * 'INPUT_PRODUCT' : 'CANVAS', 'INPUT_ACTION' : 'GET_ALL_CURRENCIES',
								 * 'INPUT_FUNCTION_CODE' : 'VSBLTY', 'INPUT_SUB_PRODUCT' : 'CANVAS', 'PRODUCT_NAME' :
								 * CRB.CANVAS, 'RATE' : value }, scope : this, success : function (responseP, optionsP){
								 * var responseObj = Ext.decode(responseP.responseText);
								 * fm.updateComboRawStore('REPORT_BASE_CCY', responseObj.ALL_CURRENCIES,
								 * responseObj.ALL_CURRENCIES); } }); // if the ratecard is // Select,then equivalent //
								 * currency combo has null // values.
								 * 
								 * if (fm.model.getValue('REPORT_RATE_CARD') == 'Select') {
								 * fm.model.setValue('REPORT_BASE_CCY', ' '); fm.updateComboRawStore('REPORT_BASE_CCY',
								 * [], []); } });
								 */
								this.fm.registerHandler('cbxpremodelload', function (fm, event, fieldName, record)
								{
									if (fm.extraParams == null || fm.extraParams.REPORT_ID == null)
									{
										return false;
									}
									var params = {
										'PAGE_CODE_TYPE' : 'RDF_CODE',
										'INPUT_PRODUCT' : 'CANVAS',
										'INPUT_ACTION' : 'GET_FORM_DATA_ACTION',
										'INPUT_FUNCTION_CODE' : 'VSBLTY',
										'INPUT_SUB_PRODUCT' : 'CANVAS',
										'PRODUCT_NAME' : 'CANVAS',
										'REPORT_ID' : fm.extraParams.REPORT_ID
									};
									return params;
								});
								this.fm
											.registerHandler(
														'cbxpostmodelload',
														function (fm, data)
														{
															var filterList = data.REPORT_DEFINITION.REPORT_FILTER_LIST;
															this.columnDisplayMap = data.COLUMN_DISPLAY_NAME_MAP;
															/**
															 * REMOVE THE STORE IF ANY DATA IS AVAILABLE IN THE STORE.
															 */
															if (that.store)
															{
																that.store.removeAll();
																/**
																 * Loop through the filter list and set
																 */
																if (!Ext.isEmpty(filterList))
																{
																	var criteriaDisplay = ''; // CBX_DT_RANGE_FIX
																	for (var i = 0; i < filterList.length; i++)
																	{
																		// CBX_DT_RANGE_FIX start
																		if (filterList[i].FILTER_NAME == 'dtEquals'
																					|| filterList[i].FILTER_NAME == '=')
																		{
																			criteriaDisplay = 'Equals to';
																		} else if (filterList[i].FILTER_NAME == 'gt'
																					|| filterList[i].FILTER_NAME == '>')
																		{
																			criteriaDisplay = 'Greater than';
																		} else if (filterList[i].FILTER_NAME == 'lt'
																					|| filterList[i].FILTER_NAME == '<')
																		{
																			criteriaDisplay = 'Less than';
																		} else if (filterList[i].FILTER_NAME == 'contains')
																		{
																			criteriaDisplay = 'Contains';
																		} else if (filterList[i].FILTER_NAME == 'range')
																		{
																			criteriaDisplay = 'Range';
																		} else
																		{
																			criteriaDisplay = filterList[i].FILTER_NAME;
																		} // CBX_DT_RANGE_FIX end
																		that.store
																					.add(new that.store.recordType(
																								{
																									filterColumnToDisplay : this.columnDisplayMap[filterList[i].COLUMN_ID], // CBX_DT_RANGE_FIX
																									filterColumn : filterList[i].COLUMN_ID,
																									filterCriteriaToDisplay : criteriaDisplay, // CBX_DT_RANGE_FIX

																									filterCriteriaToSend : filterList[i].FILTER_ID,
																									data : filterList[i].FILTER_VALUES,
																								}));
																	}
																	;
																}
																this.updateRecord(fm, that.store);
															}

															var reportColmnDefn = null;// Report column
															// defintiion to
															// set
															var sortColmnDefn = null;// Report sort
															// by
															// column definition
															// to set
															if (!Ext.isEmpty(data.REPORT_DEFINITION.COLUMN_DEFN)
																		&& data.REPORT_DEFINITION.COLUMN_DEFN.length > 0)
															{
																reportColmnDefn = [];
																for (var i = 0; i < data.REPORT_DEFINITION.COLUMN_DEFN.length; i++)
																{
																	reportColmnDefn
																				.push(data.REPORT_DEFINITION.COLUMN_DEFN[i]);
																}
																;
															}
															// CBXQ312F10_UPD2 -- Starts
															var sortColsIgnored = false;
															if (!Ext.isEmpty(data.REPORT_DEFINITION.SORT_BY)
																		&& data.REPORT_DEFINITION.SORT_BY.length > 0)
															{
																var ignoredrecords = '';
																sortColmnDefn = [];
																var ignoredRecordList = new Array();
																for (var i = 0; i < data.REPORT_DEFINITION.SORT_BY.length; i++)
																{
																	if (sortColmnDefn.length < Number(fm.preInitConfig.REPORT_SORT_BY_COLS.maxSelection))
																	{

																		sortColmnDefn
																					.push(data.REPORT_DEFINITION.SORT_BY[i]);
																	} else
																	{
																		ignoredRecordList
																					.push(data.REPORT_DEFINITION.SORT_BY[i]);
																		ignoredrecords = ignoredrecords
																					.concat(data.REPORT_DEFINITION.SORT_BY[i]
																								.toString()
																								+ "<br>");
																	}
																}
																if (ignoredRecordList.length > 0)
																{
																	sortColsIgnored = true;
																	var msg = ignoredRecordList.length.toString()
																				+ that.rb["ERR_MAX_LIMIT_VIOLATION"]
																				+ fm.preInitConfig.REPORT_SORT_BY_COLS.maxSelection
																				+ "<br>";
																	msg = msg.concat(that.rb["IGNORED_SELECTIONS"]);
																	msg = msg.concat(ignoredrecords);
																	var title = that.rb["WARNING"];
																	this.showErrorForReport(msg, title);
																}
															}

															// CBXQ312F10_UPD2 -- Ends
															var isScheduled = 'N';
															if (data.REPORT_DEFINITION.SCHEDULER_FROM_DATE)
															{
																isScheduled = 'Y';
															}
															fm.additionalConfig = {
																'FROM_DATE' : data.REPORT_DEFINITION.SCHEDULER_FROM_DATE,
																'TO_DATE' : data.REPORT_DEFINITION.SCHEDULER_TO_DATE,
																'SCHEDULER_TYPE' : data.REPORT_DEFINITION.SCHEDULER_TYPE,
																'SCHEDULER_FREQUENCY_VALUE' : data.REPORT_DEFINITION.SCHEDULER_FREQUENCY_VALUE,
																'SORT_COLS_IGNORED' : sortColsIgnored
															// CBXQ312F10_UPD2
															};
															if (data.REPORT_DEFINITION.PARENT_REPORT_ID != '-1')
															{
																return {
																	'REPORT_NAME' : data.REPORT_DEFINITION.REPORT_NAME,
																	'REPORT_SELECTED_COLS' : reportColmnDefn,
																	'REPORT_SORT_BY_COLS' : sortColmnDefn,
																	'REPORT_FORMAT' : data.REPORT_DEFINITION.FORMAT_ID,
																	'IS_SCHEDULED_REPORT' : isScheduled,
																	'REPORT_SEND_MAIL' : data.REPORT_DEFINITION.NOTIFICATION_NAME,
																	'REPORT_MAIL_RPT' : data.REPORT_DEFINITION.MAIL_RPT,
																	'REPORT_ID' : data.REPORT_DEFINITION.REPORT_ID,
																	'PARENT_REPORT_ID' : data.REPORT_DEFINITION.PARENT_REPORT_ID,
																	'SYSTEM_REPORT_ID' : data.REPORT_DEFINITION.SYSTEM_REPORT_ID,
																	// IR_ENHANCEMENTS_001-- Starts
																	'REPORT_PROD_CODE' : data.REPORT_DEFINITION.OD_PRODUCT,
																	'REPORT_SUB_PROD_CODE' : data.REPORT_DEFINITION.OD_SUB_PRODUCT,
																	'REPORT_FUNC_CODE' : data.REPORT_DEFINITION.OD_FUNC_CODE,
																	// IR_ENHANCEMENTS_001-- Ends
																	'REPORT_FILTER_COLUMN' : ' ',
																	'REPORT_FILTER_CRITERIA' : ' ',
																	'REPORT_FILTER_VALUE' : null

																};
															}
															return {
																// 'REPORT_NAME' : '',
																// 'REPORT_SELECTED_COLS' : null,
																// 'REPORT_SORT_BY_COLS' : null,
																'REPORT_FORMAT' : data.REPORT_DEFINITION.FORMAT_ID,
																'IS_SCHEDULED_REPORT' : 'N',
																'REPORT_SEND_MAIL' : [ 'INBOX' ],
																'REPORT_MAIL_RPT' : '0',
																// 'REPORT_FILTER_COLUMN' : '',
																// 'REPORT_FILTER_CRITERIA' : '',
																// 'REPORT_FILTER_VALUE' : null,
																'PARENT_REPORT_ID' : data.REPORT_DEFINITION.PARENT_REPORT_ID,
																// IR_ENHANCEMENTS_001-- Starts
																'SYSTEM_REPORT_ID' : data.REPORT_DEFINITION.SYSTEM_REPORT_ID,
																'REPORT_PROD_CODE' : data.REPORT_DEFINITION.OD_PRODUCT,
																'REPORT_SUB_PROD_CODE' : data.REPORT_DEFINITION.OD_SUB_PRODUCT,
																'REPORT_FUNC_CODE' : data.REPORT_DEFINITION.OD_FUNC_CODE
															// IR_ENHANCEMENTS_001-- Ends

															};

														});
							},
							// CBX_DT_RANGE_FIX start
							isDateRangeValid : function (fromDate, toDate)
							{
								var dateChk = null;
								var toDate = iportal.jsutil.convertStringToDateObject(toDate);
								var fromDate = iportal.jsutil.convertStringToDateObject(fromDate);
								if (Ext.isEmpty(fromDate) || fromDate == " " || fromDate == "" || Ext.isEmpty(toDate)
											|| toDate == " " || toDate == "")
								{
									dateChk = false;
									;
								} else
								{
									if (toDate.getFullYear() == fromDate.getFullYear())
									{
										if (toDate.getMonth() == fromDate.getMonth())
										{
											if ((toDate.getDate()) > fromDate.getDate())
											{
												dateChk = true;
											} else
											{
												dateChk = false;
											}
										} else if (toDate.getMonth() > fromDate.getMonth())
										{
											dateChk = true;
										} else
										{
											dateChk = false;
										}
									} else if (toDate.getFullYear() > fromDate.getFullYear())
									{
										dateChk = true;
									} else
									{
										dateChk = false;
									}
								}
								return dateChk;
							}, // CBX_DT_RANGE_FIX end
							/**
							 * Object/Method:/Private Method:The method will be used as a handler to update and save
							 * records.
							 */
							saveChanges : function (fm, event, fieldName, params)
							{
								/**
								 * Checking the condition.Whether the button text is 'Update' or not
								 */
								var that = this;
								var cBundle = CRB.getFWBundle(); // CBX_DT_RANGE_FIX
								if (fm.findField('REPORT_FILTER_ADD_BTN').getText() == that.rb['LBL_UPDATE'])
								{

									/**
									 * Get the value of the form fields
									 */
									var filterColumn = fm.model.getValue('REPORT_FILTER_COLUMN');
									if (Ext.isEmpty(filterColumn) || filterColumn == " " || filterColumn == "")
									{
										this.showErrorForReport(that.rb['MSG_SEL_FILTER_COLUMN']);
										return;
									}
									// var filterCriteria =
									// fm.model.getValue('REPORT_FILTER_CRITERIA');
									var filterCriteriaToSend = fm.model.getValue('REPORT_FILTER_CRITERIA');

									var filterCriteriaToDisplay = this.filterNameArray[this.filterIdArray
												.indexOf(filterCriteriaToSend)];

									if (Ext.isEmpty(filterCriteriaToDisplay) || filterCriteriaToDisplay == " "
												|| filterCriteriaToDisplay == "")
									{
										this.showErrorForReport(that.rb['MSG_SEL_FILTER_CRITERIA']);
										return;
									}
									var dataType = fm.model.getValue('DATA_TYPE');
									// CBX_DT_RANGE_FIX start
									var filtercriteria = fm.model.getValue('REPORT_FILTER_CRITERIA');
									if (dataType == 'date' && filtercriteria == 'DT_RANGE')
									{
										// chanegs for date field fro and to
										var dt2 = fm.model.getValue('REPORT_FILTER_VALUE_DT2');
										var dt1 = fm.model.getValue('REPORT_FILTER_VALUE_DT');
										if (!that.isDateRangeValid(dt1, dt2))
										{
											this
														.showErrorForReport("FROM or TO Date may be left blank of TO is smaller than FROM date");
											return;
										}
										var data = dt1 + ',' + dt2;
										if (Ext.isEmpty(data) || data == " " || data == "")
										{
											this.showErrorForReport("Please select value");
											return;
										}
									} else if (dataType == 'date')
									{
										// chanegs for date field fro and to
										var data = fm.model.getValue('REPORT_FILTER_VALUE_DT');
										if (Ext.isEmpty(data) || data == " " || data == "")
										{
											this.showErrorForReport("Please select value");
											return;
										}
									} // CBX_DT_RANGE_FIX end
									else
									{
										var data = fm.model.getValue('REPORT_FILTER_VALUE');
										if (Ext.isEmpty(data) || data == " " || data == "")
										{
											this.showErrorForReport("Please select value");
											return;
										} else
										{
											if (dataType == 'float' && this.validateFloat(data) != true)
											{
												this.showErrorForReport("Please select proper value");
												return;
											} else if (dataType == 'string' && this.validateString(data) != true)
											{

												this.showErrorForReport("Please select proper value");
												return;
											}
										}

									}
									// IR_ENHANCEMENTS_001 - iSolve #779 - Starts
									if (data.length > 40)
									{
										this.showErrorForReport(that.rb['MSG_FILTER_VALUE_LENGTH_EXCEEDED']);
										return;
									}
									// IR_ENHANCEMENTS_001 - iSolve #779 - Ends
									var Store = this.store;

									/**
									 * Looping through the store and checking whether the edited data already exists in
									 * the grid or not.If exists then appropriate error will be thrown and the function
									 * will return.
									 */
									for (var i = 0; i < Store.getCount(); i++)
									{
										if (filterColumn + filterCriteriaToDisplay + data == Store.getAt(i).data.filterColumn
													+ Store.getAt(i).data.filterCriteriaToDisplay
													+ Store.getAt(i).data.data)
										{
											this.confirmationDialog(that.rb['MSG_DATA_EXISTS'], fm);

											return;
										}
									}
									/**
									 * If after looping the edited record is found to be unique, then edit the current
									 * record withy the edited record.
									 */

									this.recordInConcern.beginEdit();
									this.recordInConcern.set('filterColumn', filterColumn);
									this.recordInConcern.set('filterCriteriaToDisplay', filterCriteriaToDisplay);
									this.recordInConcern.set('filterCriteriaToSend', filterCriteriaToSend);
									this.recordInConcern.set('data', data);
									this.recordInConcern.endEdit();
									this.recordInConcern.commit(false);

									this.filterGridPanel.disableSelection = true;
									/**
									 * Set the default value of the particular combo's as select
									 */
									fm.updateComboRawStore('REPORT_FILTER_CRITERIA', [], []);

									fm.clearValues([ 'REPORT_FILTER_COLUMN', 'REPORT_FILTER_VALUE',
											'REPORT_FILTER_VALUE_DT', 'REPORT_FILTER_VALUE_DT2' ]);

									fm.setVisibleFields([ 'REPORT_FILTER_VALUE' ], true);
									fm.setVisibleFields([ 'REPORT_FILTER_VALUE_DT', 'REPORT_FILTER_VALUE_DT2' ], false);
									Store.getModifiedRecords();
									this.updateRecord(fm, Store);
									/**
									 * After editing the record change the text to save again.
									 */
									fm.findField('REPORT_FILTER_ADD_BTN').setText(that.rb['LBL_SAVE']);
									fm.findField('REPORT_FILTER_ADD_BTN').setTooltip(that.rb['LBL_SAVE']);

								}
								/**
								 * Checking whether the button text is 'Save' or not
								 */
								else if (/* fm.findField('REPORT_FILTER_ADD_BTN').getText() == that.rb['LBL_SAVE'] */true)
								{
									/**
									 * Get the value of the form fields
									 */
									var filterColumn = fm.model.getValue('REPORT_FILTER_COLUMN');
									if (Ext.isEmpty(filterColumn) || filterColumn == " " || filterColumn == "")
									{
										this.showErrorForReport(that.rb['MSG_SEL_FILTER_COLUMN']);
										return;
									}
									var filterCriteriaToSend = fm.model.getValue('REPORT_FILTER_CRITERIA');
									var filterCriteriaToDisplay = this.filterNameArray[this.filterIdArray
												.indexOf(filterCriteriaToSend)];

									if (Ext.isEmpty(filterCriteriaToDisplay) || filterCriteriaToDisplay == " "
												|| filterCriteriaToDisplay == "")
									{
										this.showErrorForReport(that.rb['MSG_SEL_FILTER_CRITERIA']);
										return;
									}

									var dataType = fm.model.getValue('DATA_TYPE');
									// CBX_DT_RANGE_FIX start
									var filtercriteria = fm.model.getValue('REPORT_FILTER_CRITERIA');

									if (dataType == 'date' && filtercriteria == 'DT_RANGE')
									{
										// chanegs for date field fro and to
										var dt2 = fm.model.getValue('REPORT_FILTER_VALUE_DT2');
										var dt1 = fm.model.getValue('REPORT_FILTER_VALUE_DT');
										if (!that.isDateRangeValid(dt1, dt2))
										{
											this
														.showErrorForReport("FROM or TO Date may be left blank of TO is smaller than FROM date");
											return;
										}
										var data = dt1 + ',' + dt2;

										if (Ext.isEmpty(data) || data == " " || data == "")
										{
											this.showErrorForReport("Please select value");
											return;
										}
									} // CBX_DT_RANGE_FIX end
									else if (dataType == 'date')
									{
										var data = fm.model.getValue('REPORT_FILTER_VALUE_DT');
										if (Ext.isEmpty(data) || data == " " || data == "")
										{
											this.showErrorForReport(that.rb['MSG_EMPTY_VALUE']); // IR_ENHANCEMENTS_001
											return;
										}
									} else
									{
										var data = fm.model.getValue('REPORT_FILTER_VALUE');
										data = data.trim(); // CBX_DT_RANGE_FIX
										if (Ext.isEmpty(data) || data == " " || data == "")
										{
											this.showErrorForReport(that.rb['MSG_EMPTY_VALUE']); // IR_ENHANCEMENTS_001
											return;
										} else
										{
											if (dataType == 'float' && this.validateFloat(data) != true)
											{
												this.showErrorForReport(that.rb['MSG_INVALID_VALUE']); // IR_ENHANCEMENTS_001
												return;
											} else if (dataType == 'string' && this.validateString(data) != true)
											{
												this.showErrorForReport(that.rb['MSG_INVALID_VALUE']); // IR_ENHANCEMENTS_001
												return;
											}
										}

									}
									// IR_ENHANCEMENTS_001 - iSolve #779 - Starts
									if (data.length > 40)
									{
										this.showErrorForReport(that.rb['MSG_FILTER_VALUE_LENGTH_EXCEEDED']);
										return;
									}
									// IR_ENHANCEMENTS_001 - iSolve #779 - Ends
									/**
									 * Commit the changes,(if any changes has done previosuly)
									 */
									this.store.commitChanges();
									/**
									 * Get the updated store
									 */
									var updatedStore = this.store;
									/**
									 * Looping through the loop and checks whether the same record exists or not.
									 */
									if (updatedStore.getCount() > 0)
									{
										for (var i = 0; i < updatedStore.getCount(); i++)
										{
											/**
											 * If the record alreadt exists then show the error and return
											 */
											if ((updatedStore.getAt(i).data.filterColumn + updatedStore.getAt(i).data.filterCriteriaToDisplay) == (filterColumn + filterCriteriaToDisplay))
											{
												this.showErrorForReport(that.rb['MSG_DATA_EXISTS']);
												// CBX_DT_RANGE_FIX start //CBX_DT_RANGE_FIX start
												fm.clearValues([ 'REPORT_FILTER_COLUMN', 'REPORT_FILTER_CRITERIA',
														'REPORT_FILTER_VALUE', 'REPORT_FILTER_VALUE_DT',
														'REPORT_FILTER_VALUE_DT2' ]);
												fm.focus('REPORT_FILTER_COLUMN');
												// CBX_DT_RANGE_FIX end
												return;
											}
										}

									}
									/**
									 * During looping if same data has not found then enter a new record
									 */
									updatedStore.add(new updatedStore.recordType({
										filterColumnToDisplay : this.columnDisplayMap[filterColumn], // CBX_DT_RANGE_FIX
										filterColumn : filterColumn,
										filterCriteriaToDisplay : filterCriteriaToDisplay,
										filterCriteriaToSend : filterCriteriaToSend,
										data : data
									}));
									updatedStore.commitChanges();
									/**
									 * Set the default value of the particular combo's as select
									 */
									fm
												.clearValues([ 'REPORT_FILTER_COLUMN', 'REPORT_FILTER_CRITERIA',
														'REPORT_FILTER_VALUE', 'REPORT_FILTER_VALUE_DT',
														'REPORT_FILTER_VALUE_DT2' ]);
									fm.updateComboRawStore('REPORT_FILTER_CRITERIA', [], []);
									fm.setVisibleFields([ 'REPORT_FILTER_VALUE' ], true);
									fm.setVisibleFields([ 'REPORT_FILTER_VALUE_DT','REPORT_FILTER_VALUE_DT2' ], false);
									// if(updatedStore.getCount>0){
									this.updateRecord(fm, updatedStore);
									fm.focus('REPORT_FILTER_COLUMN');//IR_ENHANCEMENTS_001
									// }
								}

							},
							validateString : function (data)
							{
								for (var i = 0; i < data.length; i++)
								{
									var char1 = data.charAt(i);
									var cc = char1.charCodeAt(0);
									if ((cc > 47 && cc < 58) || (cc > 64 && cc < 91) || (cc > 96 && cc < 123))
									{
									} else
									{
										return false;
									}
								}
								return true;
							},
							validateFloat : function (data)
							{
								if (isNaN(data))
									return false;
								else
									return true;

							},
							/**
							 * Private method to show error in any case
							 */
							showErrorForReport : function (msg, title)
							{ //IR_ENHANCEMENTS_001
								var that = this;
								var err_Dialog = new iportal.Dialog({
									dialogType : 'ERROR',
									title : !Ext.isEmpty(title) ? title : that.rb['LBL_ERROR'], //IR_ENHANCEMENTS_001
									message : msg,
									okHandler : function ()
									{
										err_Dialog.close();
									}
								});
								err_Dialog.show();
							},

							confirmationDialog : function (msg, fm)
							{
								var that = this;
								var err_Dialog = new iportal.Dialog({
									dialogType : 'WARNING',
									title : that.rb['LBL_CONFIRMATION'],
									message : msg,
									okHandler : function ()
									{
										fm.model.setValue('REPORT_FILTER_COLUMN', ' ', false);
										fm.updateComboRawStore('REPORT_FILTER_CRITERIA', [], []);
										fm.model.setValue('REPORT_FILTER_VALUE', null, false);
										fm.findField('REPORT_FILTER_ADD_BTN').setText(that.rb['LBL_SAVE']);
										fm.findField('REPORT_FILTER_ADD_BTN').setTooltip(that.rb['LBL_SAVE']);
										err_Dialog.close();
									},
									cancelHandler : function ()
									{
										err_Dialog.close();
									}
								});
								err_Dialog.show();
							}
						});
CFLR.registerListener('INFO_RPT_DEF_FORM', cbx.form.listeners.INFO_RPT_DEF_FORM);
