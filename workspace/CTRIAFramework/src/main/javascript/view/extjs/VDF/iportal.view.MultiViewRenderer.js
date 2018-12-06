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
Ext.ns("iportal.view");
/**
 * Intended to check View type and create View Panels based on View Type
 * 
 * @param {}
 *            con
 */
iportal.view.MultiViewRenderer = function(conf) {
	var idSuffix = "_PANEL";
	var rb = CRB.getFWBundle();
	conf.viewConf.widgetID = conf.itemId;
	var vC = conf.viewConf;
	conf.mvConf['clientWidth'] = conf.mvConf.el.dom.clientWidth;
	conf.mvConf['clientHeight'] = conf.mvConf.el.dom.clientHeight;
	if (IMM.isChartView(vC)) {
		return new canvas.chart.engine(
				{
					graphViewId : conf.itemId,
					productCode : vC.VIEW_MD.PRODUCT_CODE,
					subProductCode : vC.VIEW_MD.SUB_PRODUCT_CODE,
					functionCode : vC.VIEW_MD.FUNCTION_CODE,
					itemId : conf.itemId + idSuffix,
					height : conf.mvConf.height/*-25*/
							- iportal.jsutil.getBBarHeight(conf.mvh.bbar),
					resourceBundleKey : conf.mvConf.bundle,
					extraParamsHandler : conf.mvConf.extraParamsHandler,
					loadHandler : (conf.mvConf.loadHandler != null) ? conf.mvConf.loadHandler
							: Ext.emptyFn,
					scope : conf.mvConf.scope,
					widgetId : conf.id,
					viewConf : vC,
					/**
					 * transfering additionalConfig Object set by app developer
					 * for rendering this instance of the widget
					 * 
					 * @see iportal.widget.MultiWidget.js
					 */
					additionalConfig : conf.mvConf.additionalConfig,
					mvConf : conf.mvConf
				});
	} else if (IMM.isOrgView(vC)) {
		return new iportal.chartcomponent.OrgView({
			viewConf : vC,
			conf : conf,
			orgViewId : conf.itemId,
			/**
			 * transfering additionalConfig Object set by app developer for
			 * rendering this instance of the widget
			 * 
			 * @see iportal.widget.MultiWidget.js
			 */
			additionalConfig : conf.mvConf.additionalConfig
		});
	} else if (IMM.isTreeView(vC)) {
		return new iportal.treeview.TreePanel({
			viewConf : vC,
			treeViewId : conf.itemId,
			extraParamsHandler : conf.mvConf.extraParamsHandler,
			/**
			 * transfering additionalConfig Object set by app developer for
			 * rendering this instance of the widget
			 * 
			 * @see iportal.widget.MultiWidget.js
			 */
			additionalConfig : conf.mvConf.additionalConfig,
			conf : conf
		});
	} else if (IMM.isCalendarView(vC)) {
		return new iportal.calendar.calendarviewpanel({
			viewConf : vC,
			itemId : conf.itemId + idSuffix,
			productCode : vC.VIEW_MD.PRODUCT_CODE,
			subProductCode : vC.VIEW_MD.SUB_PRODUCT_CODE,
			functionCode : vC.VIEW_MD.FUNCTION_CODE,
			/**
			 * transfering additionalConfig Object set by app developer for
			 * rendering this instance of the widget
			 * 
			 * @see iportal.widget.MultiWidget.js
			 */
			additionalConfig : conf.mvConf.additionalConfig,
			conf : conf
		});
	} else if (IMM.isFormView(vC)) {
		return new cbx.form.formviewpanel({
			viewConf : vC,
			conf : conf,
			height : conf.mvConf.height/*-25*/
					- iportal.jsutil.getBBarHeight(conf.mvh.bbar) - 10
		});
	} else if (IMM.isEmptyView(vC)) {
		return new iportal.empty.emptyviewpanel(
				{
					graphViewId : conf.itemId,
					productCode : vC.VIEW_MD.PRODUCT_CODE,
					subProductCode : vC.VIEW_MD.SUB_PRODUCT_CODE,
					functionCode : vC.VIEW_MD.FUNCTION_CODE,
					itemId : conf.itemId + idSuffix,
					height : conf.mvConf.height/*-25*/
							- iportal.jsutil.getBBarHeight(conf.mvh.bbar),
					resourceBundleKey : conf.mvConf.bundle,
					extraParamsHandler : conf.mvConf.extraParamsHandler,
					loadHandler : (conf.mvConf.loadHandler != null) ? conf.mvConf.loadHandler
							: Ext.emptyFn,
					scope : conf.mvConf.scope,
					widgetId : conf.id,
					viewConf : vC,
					mvConf : conf.mvConf
				});
	} else if (IMM.isIFrameView(vC)) {
		var screenRes = screen.width + 'x' + screen.height;
		var parentHeight = Number(iportal.workspace.metadata
				.getWidgetHtInPixels(conf.mvConf.itemId, conf.mvConf.LAYOUT_ID));
		if (Ext.isEmpty(parentHeight) || !parentHeight) {
			parentHeight = conf.mvConf.height
					- iportal.jsutil.getBBarHeight(conf.mvh.bbar);
		}
		var parentWidth = conf.mvConf.getWidth();

		return new iportal.view.iframepanel({
			viewConf : vC,
			conf : conf,
			height : parentHeight,
			loadMask : rb.LBL_LOADMASK_IFRAME,
			height : conf.mvConf.height
					- iportal.jsutil.getBBarHeight(conf.mvh.bbar),
			defaultWidth : parentWidth,
			uri : vC.VIEW_MD.FLD_DATA_SRC_ID
		});
	} else if (IMM.isAdsView(vC)) {
		if (conf.mvConf && conf.mvConf.ownerCt && conf.mvConf.ownerCt.header) { 
			conf.mvConf.ownerCt.header.remove();
		}
		conf.mvh.remove();
		var screenRes = screen.width + 'x' + screen.height;
		var parentHeight = Number(iportal.workspace.metadata
				.getWidgetHtInPixels(conf.mvConf.itemId, conf.mvConf.LAYOUT_ID));
		if (Ext.isEmpty(parentHeight) || !parentHeight) {
			parentHeight = conf.mvConf.height
					- iportal.jsutil.getBBarHeight(conf.mvh.bbar);
		}
		var parentWidth = conf.mvConf.getWidth();
		var currentTheme = iportal.preferences.getCurrentTheme();
		conf.mvConf.ownerCt.addClass('x-ads-portlet');
		return new iportal.view.adsviewpanel({
			viewConf : vC,
			conf : conf,
			height : parentHeight,
			loadMask : rb.LBL_LOADMASK_ADS,
			defaultWidth : parentWidth,
			uri : vC.VIEW_MD.FLD_DATA_SRC_ID + /* '?Img=' + url + */'?Res='
					+ screenRes + '&Th=' + currentTheme + '&Pht='
					+ parentHeight + '&Pwid=' + parentWidth
		});
	} else if (IMM.isAppView(vC)) {
		var widget = conf.mvh.findParentByType('portlet') ? conf.mvh
				.findParentByType('portlet').find('itemId', conf.itemId)[0]
				: null;
		var layoutId = null;
		if (widget) {
			layoutId = widget.LAYOUT_ID;
		}
		var height = Number(iportal.workspace.metadata.getWidgetHtInPixels(
				conf.mvConf.itemId, conf.mvConf.LAYOUT_ID));
		if (Ext.isEmpty(height) || !height) {
			height = conf.mvConf.height
					- iportal.jsutil.getBBarHeight(conf.mvh.bbar);
		}
		return new cbx.view.appViewPanel({
			viewConf : vC,
			height : height,
			widgetId : conf.itemId,
			layoutId : layoutId
		});
	} else if (IMM.isMapView(vC)) {
		return new cbx.view.MapViewPanel({
			height : conf.mvConf.height
					- iportal.jsutil.getBBarHeight(conf.mvh.bbar),
			viewConf : vC,
			widgetId : conf.itemId,
			productCode : vC.VIEW_MD.PRODUCT_CODE,
			subProductCode : vC.VIEW_MD.SUB_PRODUCT_CODE,
			functionCode : 'VSBLTY'
		});
	} else {
		var svid, btns;
		svid = vC.VIEW_MD.SYSTEM_VIEW_ID;
		if (Ext.isEmpty(svid)) {
			svid = vC.VIEW_MD.VIEW_ID;
		}
		btns = conf.mvConf.bbarMap ? conf.mvConf.bbarMap[vC.VIEW_MD.VIEW_ID]
				: [];
		if (!Ext.isArray(btns)) {
			btns = [];
		}
		var adjustHeight = function(height) {
			height = height - iportal.jsutil.getBBarHeight(conf.mvh.bbar);
			/**
			 * Adjusting the listview Panel height if there is datefilterpanel
			 * is displayed.
			 */
			var globalDateFilterIndicator = vC.VIEW_MD.FLD_GLOBAL_DATE_FILTER_IND;
			if (globalDateFilterIndicator && globalDateFilterIndicator == 'Y') {
				height = height - iportal.jsutil.getFilterPanelHeight(true);
			}
			/**
			 * Code added to find context column indicator form view meta data
			 * information by which if it is enabled thereby reducing the
			 * listviewpanel's height by 30% to make the standard note text to
			 * be visible
			 */
			if ((vC.VIEW_MD.FLD_CONTEXT_COLUMN && vC.VIEW_MD.FLD_CONTEXT_COLUMN == 'Y')
					|| vC.VIEW_MD.FLD_DETAIL_MSG_IND == 'Y'
					|| iportal.preferences.getStandardNoteReq() == true) {
				height = height
						- iportal.jsutil.getStandardTextNotePanelHeight(true);
			}
			return height;
		};
		return new canvas.listview.listviewpanel(
				{
					lastupdateInfoReq : conf.mvConf.lastupdateInfoReq,
					highlightHandler : function(store, viewObj) {
						if (this.highlightInd == true) {
							conf.mvConf.fireEvent('highlight', store, viewObj);
						}
					},
					showselectedRowsinLookUp:conf.mvConf.showselectedRowsinLookUp,//Fix for multiselect
					listViewId : conf.itemId,
					filterFormAvail : false,
					productCode : vC.VIEW_MD.PRODUCT_CODE,
					subProductCode : vC.VIEW_MD.SUB_PRODUCT_CODE,
					functionCode : vC.VIEW_MD.FUNCTION_CODE,
					itemId : conf.itemId + idSuffix,
					buttonBar : btns,
					mvh : conf.mvh,
					height : adjustHeight(conf.mvConf.height),
					resourceBundleKey : conf.mvConf.bundle,
					groupgridTextTpl : conf.mvConf.groupgridTextTpl,
					extraParamsHandler : conf.mvConf.extraParamsHandler,
					skipDataResult : conf.mvConf.skipDataResult,
					loadHandler : (conf.mvConf.loadHandler != null) ? conf.mvConf.loadHandler
							: function(store, records, options) {
							},
					eventRasiedTimeStamp : null,
					currencyChange : function(wvid, ccy) {
						conf.ccySelectHandler.createDelegate(conf.header,
								[ wvid, ccy ])();
					},
					cellClickHandler : function(grid, rowIndex, columnIndex, e) {
						grid.doubleclick = true;
						var record = grid.getStore().getAt(rowIndex);
						
						var cm;

						if (!Ext.isEmpty(grid.view.isResponsiveGrid)
								&& grid.view.isResponsiveGrid) {
							cm = grid.expandcm;
						} else {
							cm = grid.getColumnModel();
						}
						
						var colId = cm.getDataIndex(columnIndex);
						var colVal = record.get(colId);
						var dt = new Date();
						if (this.eventRasiedTimeStamp == null)
							this.eventRasiedTimeStamp = dt;
						if (dt == this.eventRasiedTimeStamp
								|| dt >= this.eventRasiedTimeStamp.add(
										Date.SECOND, 3)) {
							this.eventRasiedTimeStamp = dt;
							conf.mvConf.fireEvent('cellclick', colId, colVal,
									record);
						}
					},
					keyDownHandler : function(e) {
						var keyCode = e.getCharCode();
						var rowIndex = this.getSelectionModel()
								.getSelectedIndex();
						var record = this.getStore().getAt(rowIndex);
						var cm = this.getColumnModel();
						var colId = cm.getDataIndex(0);
						var colVal = record.get(colId);
						var dt = new Date();
						if (keyCode == Ext.EventObject.ENTER
								&& this.eventRasiedTimeStamp == null
								&& this.ownerCt.mvConf.enableEnterkey) {
							this.eventRasiedTimeStamp = dt;
							if (dt == this.eventRasiedTimeStamp
									|| dt >= this.eventRasiedTimeStamp.add(
											Date.SECOND, 3)) {
								this.eventRasiedTimeStamp = dt;
								conf.mvConf.fireEvent('cellclick', colId,
										colVal, record);
							}
						}
					},
					cellSingleClickHandler : function(grid, rowIndex,
							columnIndex, e, cellEvtReq) {
						var record = grid.getStore().getAt(rowIndex);
						var dt = new Date();
						if (this.eventRasiedSingleTimeStamp == null
								|| dt == this.eventRasiedSingleTimeStamp
								|| dt >= this.eventRasiedSingleTimeStamp.add(
										Date.SECOND, 1)) {
							this.eventRasiedSingleTimeStamp = dt;
							/**
							 * To identify the single click event wait for a
							 * timeout. If double click did not happen,then
							 * treat it as single click.
							 */
							setTimeout(
									function() {
										if (grid.doubleclick) {
											grid.doubleclick = false;
											return;
										}
									
										var cm;

										if (!Ext
												.isEmpty(grid.view.isResponsiveGrid)
												&& grid.view.isResponsiveGrid) {
											cm = grid.expandcm;
										} else {
											cm = grid.getColumnModel();
										}
										
										var colId = cm
												.getDataIndex(columnIndex);
										var colVal = record.get(colId);
										var clmList = vC.VIEW_MD.FLD_COLUMN_LIST;
										var column = cm.getColumnById(colId);
										if ('canvascheck' == column.xtype) {
											if (!column.disable) {
												record
														.set(
																column.dataIndex,
																!record.data[column.dataIndex]);
											}
											conf.mvConf
													.fireEvent(
															'dataModified',
															grid
																	.getStore()
																	.getModifiedRecords());
										}
										if ('contextcolumn' == column.xtype
												|| 'actioncolumn' == column.xtype) {
											return;
										}
										for (i = 0, clen = clmList.length; i < clen; i++) {
											var clm = {};
											clm.header = clmList[i].FLD_COLUMN_DISPLAY_NAME_KEY;
											clm.drillDownReq = clmList[i].FLD_DD_REQ_IND;
											/**
											 * If the drill down indicator is
											 * enabled for a column which
											 * corresponds to the cell that was
											 * clicked then the drilldown event
											 * will be fired
											 */
											if (clm.drillDownReq === 'Y'
													&& clmList[i].FLD_COLUMN_ID === colId) {
												conf.mvConf.fireEvent(
														'drilldown', colVal,
														colId, record);
											}
										}
										if (cellEvtReq === undefined) {
//											conf.mvConf.fireEvent('cellsingleclick', record);
											conf.mvConf.fireEvent('cellsingleclick',colId,colVal, record,rowIndex); // rowIndex is added
										}
									}, 300);
						}
					},
					updateHeight : function(height) {
						height = adjustHeight(height);
						this.setHeight(height);
						/**
						 * For setting child widget has to be resizable when its
						 * parent indexed multi widget has to be enabled
						 * resizable
						 */
						this.getComponent(0).setHeight(
								height - this.getFrameHeight);
					},
					groupContextMenuHandler : function(grid, groupField,
							groupValue, e) {
						var rowIndex = grid.getSelectionModel().getSelected();
						var record = grid.getStore().indexOf(rowIndex);
						var recordData = grid.getStore().getAt(record);
						var data = "";
						var hd = e.getTarget('.x-grid-group', this.mainBody);
						for (var i = 0; i < grid.getStore().getTotalCount(); i++) {
							if (grid.getStore().getAt(i)._groupId === hd.id) {
								if (Ext.isEmpty(recordData)) {
									recordData = grid.getStore().getAt(i).data;
								}
							}
						}
						conf.mvConf.fireEvent('groupcontextmenuclick',
								groupField, groupValue, "", recordData, e);
					},
					groupdoubleclickHandler : function(grid, groupField,
							groupValue, e) {
						var rowIndex = grid.getSelectionModel().getSelected();
						var record = grid.getStore().indexOf(rowIndex);
						var recordData = grid.getStore().getAt(record);
						conf.mvConf.fireEvent('groupdoubleclick', groupField,
								groupValue, recordData, e);
					},
					
					advGrpGridRowContextHandler : function(grid, rowIndex, e) {
					
						var record = grid.getStore().getAt(rowIndex);
						conf.mvConf.fireEvent('contextclick', "", "", "",
								record, e);
								
					},
					advGrpGridrowClickHandler : function(grid, rowIndex, e) {
					
						var records = grid.getSelectionModel()
									.getSelections();
						conf.mvConf.fireEvent('rowclick', records,grid);
								
					},
					
					rowContextHandler : function(grid, rowIndex, e) {
						var record = grid.getStore().getAt(rowIndex);
						conf.mvConf.fireEvent('contextclick', "", "", "",
								record, e);
					},
					rowClickHandler : function(grid, rowIndex, e) {
						var selectionType = vC.VIEW_MD.FLD_SELECTION_TYPE;
						//if (!Ext.isEmpty(selectionType)) {
						if ('SINGLE' === selectionType || 'MULTIPLE' === selectionType) {
							var records = grid.getSelectionModel()
									.getSelections();
							conf.mvConf.fireEvent('rowclick', records,grid);
						}
					},
					onRowExpand :function(grid,record,headerData)
					{
						var clodnedheaderData= cbx.clone(headerData);
						conf.mvConf.fireEvent('onRowExpand', record,clodnedheaderData);
					},
					onRowCollapse :function(grid,record,headerData)
					{
						var clodnedheaderData= cbx.clone(headerData);
						conf.mvConf.fireEvent('onRowCollapse',record,clodnedheaderData);
					},
					/**
					 * transfering additionalConfig Object set by app developer for rendering this instance of the widget
					 * @see iportal.widget.MultiWidget.js
					 * */
					additionalConfig : conf.mvConf.additionalConfig,
					viewConf : vC,
					mvConf : conf.mvConf
				});
	}
}
