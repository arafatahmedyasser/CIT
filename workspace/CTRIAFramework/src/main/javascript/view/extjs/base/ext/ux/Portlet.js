/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
/**
 * @class Portlet class is responsible for the tools and drag and drop of the apps
 */
Ext.ux.Portlet = Ext.extend(Ext.Panel,
			{
				/**
				 * 
				 */
				anchor : '100%',
				/**
				 * 
				 */
				frame : false,
				/**
				 * 
				 */
				border : false,
				/**
				 * 
				 */	
				draggable : iportal.preferences.getAppDrag(),
				/**
				 * 
				 */
				shrinkFlag : true,
				/**
				 * 
				 */
				resizable : true,
				/**
				 * 
				 */
				collapsed : true,
				/**
				 * 
				 */
				title : CRB.getFWBundle()['LBL_LOADING'],
				/**
				 * 
				 */
				initComponent : function ()
				{
					this.cls = 'x-portlet x-portlet-' + this.itemId.substring(0, this.itemId.indexOf("_PORTLET"));
					this.cuserBundle = CRB.getFWBundle();
					var layoutSelector = function (comp)
					{
						if (comp.lytContainer)
						{
							return true;
						}
					};
					var layout = this.findParentBy(layoutSelector);
					var lId = layout.itemId;
					this.header = iportal.workspace.metadata.getWidgetHeaderInd(this.itemId.substring(0, this.itemId
								.indexOf("_PORTLET")), lId);
					if (this.header === true && iportal.preferences.getAppDrag())
					{
						this.draggable = true;
					} else
					{
						this.draggable = false;
					}
					this.tools = cbx.widgetUtil.getTools.apply(this);
					this.currency = '';
					this.on("collapse", this.onFireResize, this);
					this.on("expand", this.onFireExpand, this);
					this.on("beforedestroy", this.destroyCCYSelector, this);
					this.on("titlechange", this.handleTitleUpdate, this);
					var mv = this.items[0];
					mv.on('resizeafterdatacall', this.handleResizeAfterDataCall, this);
					Ext.ux.Portlet.superclass.initComponent.apply(this);
				},
				tbarCollapse : function ()
				{
					var that = this;
					var wgt = that.getComponent(0);
					if (wgt.getTbarConf())
					{
						wgt.getTbarConf().toggleCollapse();
					}

				},
				/**
				 * The handler which receives the record count, checksfor the flag.In case of Multiwidget Tab, it will
				 * rendered the widget based on the height calculated for the first tab, which will be set for all the
				 * respective tab in the container.This is achieved with the help of flag.
				 */
				handleResizeAfterDataCall : function (recordCount)
				{
					var enableWidgetDataShrink = iportal.systempreferences.getEnableWidgetDataShrinkFlag();
					var Widget_Ht_Pxl = iportal.workspace.metadata.getWidgetHtInPixels(this.getComponent(0).itemId,
								this.getComponent(0).LAYOUT_ID);
					var Widget_Ht_Rows = iportal.workspace.metadata.getWidgetHtOnRows(this.getComponent(0).itemId, this
								.getComponent(0).LAYOUT_ID);
					var wgt = this.getComponent(0);

					var curHeight = this.getHeight();
					var resizeFlag = iportal.workspace.metadata.getResizeInd(this.getComponent(0).itemId, this
								.getComponent(0).LAYOUT_ID);
					if (Ext.isEmpty(resizeFlag))
					{
						resizeFlag = "Y";
					}
					if (!cbx.isEmpty(Widget_Ht_Pxl) && (this.resizable === true && resizeFlag === "Y"))
					{
						this.height = Widget_Ht_Pxl;
						this.setHeight(Widget_Ht_Pxl);
						this.resizer.resizeTo(undefined, Widget_Ht_Pxl);
						return;
					}
					if (!cbx.isEmpty(Widget_Ht_Rows) && (this.resizable === true && resizeFlag === "Y"))
					{
						var upd_height = wgt.computeHeight(Widget_Ht_Rows);
						this.height = upd_height;
						this.setHeight(upd_height);
						this.resizer.resizeTo(undefined, upd_height);
						return;
					}
					if (!enableWidgetDataShrink)
					{
						return;
					}

					var curHeight = this.getHeight();
					var wgt = this.getComponent(0);
					/**
					 * Here, it checks for the Flag, In case of <true> only,it will be applicable for shrink else it
					 * will exit.
					 */
					if (this.shrinkFlag === false)
					{
						return;
					}

					if (wgt.mwc)
					{
						var computedHeight = this.computedHeight
									|| wgt.mwc.getActiveTab().getComponent(0).computeHeight(recordCount);
						var tabHeight = 26;
						computedHeight = computedHeight + tabHeight;
						if (curHeight > computedHeight || this.computedHeight != null
									&& (this.resizable === true && resizeFlag === "Y"))
						{
							this.height = computedHeight;
							this.setHeight(computedHeight);
							this.resizer.resizeTo(undefined, computedHeight);

							if (this.computedHeight == null)
							{
								this.computedHeight = computedHeight;
							}
						}
						/** Here, setting the flag to <False>,after it had shrink once.* */
						this.shrinkFlag = false;
					} else
					{
						if (wgt.computeHeight)
						{
							var computedHeight = this.computedHeight || wgt.computeHeight(recordCount);
							if (curHeight > computedHeight || this.computedHeight != null
										&& (this.resizable === true && resizeFlag === "Y"))
							{
								this.height = computedHeight;
								this.setHeight(computedHeight);
								this.resizer.resizeTo(undefined, computedHeight);

								if (this.computedHeight == null)
								{
									this.computedHeight = computedHeight;
								}
							}
							this.shrinkFlag = false;
						}
					}
				},

				/**
				 * Setting the currency value received from immediate child instance
				 * 
				 * @param currency
				 */
				setCurrency : function (currency)
				{
					var prefRateCard = iportal.preferences.getRateCard();
					/**
					 * Validate the combo if the prefRateCard is not available
					 */
					var commonbundle = CRB.getFWBundle();
					if (prefRateCard == null || prefRateCard === "" || prefRateCard === ""
								|| prefRateCard.toUpperCase() === "NULL")
					{
						if (this.ccySelector && this.header)
						{
							this.ccySelector.render(this.header);
							this.ccySelector.markInvalid(commonbundle['CURRENCY_SELECT']);
						}
						return;
					}
					if (currency != null)
					{
						if (this.ccySelector && this.header)
						{
							this.ccySelector.render(this.header);
							if (iportal.jsutil.isValidValueInStore(this.ccySelector.getStore(), currency) === true)
							{
								this.ccySelector.setValue(currency);
								var currConversionAvailability = iportal.preferences.getRatecardCurrencies();
								if (this.ccySelector.getValue() == null || this.ccySelector.getValue() == ''
											|| this.ccySelector.getValue() == ' ')
								{
									if (!currConversionAvailability.contains(iportal.jsutil.getPreferredCurrency()))
									{
										this.ccySelector.markInvalid(commonbundle['NO_CURR_CONVERSION']);
									}
								}
							} else
							{
								this.ccySelector.setValue('');
								this.ccySelector.markInvalid(commonbundle['CURRENCY_INVALID']);
							}
						}
					}
				},
				/**
				 * @returns {Array}
				 */
				getTools : function ()
				{
					var that = this;
					var showToolsAsLinearFlag = iportal.systempreferences.getToolsAsLinearFlag();
					var toolsArray = new Array();
					var rb = CRB.getFWBundle();
					var collapseInd = {
						id : 'toggle',
						qtip : rb['TOOL_TIPS_COLLAPSE_EXPAND'],
						renderHidden : true,
						hidden : true,
						handler : this.toggleCollapse,
						scope : this
					};

					toolsArray.push(collapseInd);

					var prefIcon = {
						id : 'pref',
						qtip : rb['TOOL_TIPS_PREFERENCE'],
						renderHidden : true,
						hidden : true,
						handler : function (event, toolEl, panel, tc)
						{
							var widgetMv = panel.getComponent(0);
							if (widgetMv.getPreferenceMenuItems)
							{
								var menu = widgetMv.getPreferenceMenuItems();
								if (menu)
								{
									menu.show(this.id);
								}
							}
						}
					};
					toolsArray.push(prefIcon);
					if (showToolsAsLinearFlag == 'Y')
					{
						// Add the menu items as linear
						var helpIcon = {
							id : 'help',
							qtip : rb['TOOL_TIPS_HELP'],
							iconCls : 'help',
							renderHidden : true,
							hidden : true,
							handler : function (event, toolEl, panel, tc)
							{
								var widgetMv = panel.getComponent(0);
								if (widgetMv.handleToolAction)
								{
									widgetMv.handleToolAction("HELP");
								}
							}
						};
						toolsArray.push(helpIcon);

						var exportExcelIcon = {
							id : 'excel',
							qtip : rb['TOOL_TIPS_EXCEL'],
							iconCls : 'excel',
							renderHidden : true,
							hidden : true,
							handler : function (event, toolEl, panel, tc)
							{
								var widgetMv = panel.getComponent(0);
								if (widgetMv.handleToolAction)
								{
									widgetMv.handleToolAction("EXCEL");
								}
							}
						};
						toolsArray.push(exportExcelIcon);

						var exportPdfIcon = {
							id : 'pdf',
							qtip : rb['TOOL_TIPS_PDF'],
							iconCls : 'pdf',
							renderHidden : true,
							hidden : true,
							handler : function (event, toolEl, panel, tc)
							{
								var widgetMv = panel.getComponent(0);
								if (widgetMv.handleToolAction)
								{
									widgetMv.handleToolAction("PDF");
								}
							}
						};
						toolsArray.push(exportPdfIcon);

						var exportCsvIcon = {
							id : 'csv',
							qtip : rb['TOOL_TIPS_CSV'],
							iconCls : 'csv',
							renderHidden : true,
							hidden : true,
							handler : function (event, toolEl, panel, tc)
							{
								var widgetMv = panel.getComponent(0);
								if (widgetMv.handleToolAction)
								{
									widgetMv.handleToolAction("CSV");
								}
							}
						};
						toolsArray.push(exportCsvIcon);

						var exportRtfIcon = {
							id : 'rtf',
							qtip : rb['TOOL_TIPS_RTF'],
							iconCls : 'rtf',
							renderHidden : true,
							hidden : true,
							handler : function (event, toolEl, panel, tc)
							{
								var widgetMv = panel.getComponent(0);
								if (widgetMv.handleToolAction)
								{
									widgetMv.handleToolAction("RTF");
								}
							}
						};
						toolsArray.push(exportRtfIcon);

						var clearFilterIcon = {
							id : 'clearFilter',
							qtip : rb['TOOL_TIPS_CLEAR_FILTER'],
							iconCls : 'filter',
							renderHidden : true,
							hidden : true,
							handler : function (event, toolEl, panel, tc)
							{
								var widgetMv = panel.getComponent(0);
								if (widgetMv.handleToolAction)
								{
									widgetMv.handleToolAction("FILTER");
								}
							}
						};
						toolsArray.push(clearFilterIcon);

						var refreshIcon = {
							id : 'refresh',
							qtip : rb['TOOL_TIPS_REFRESH'],
							iconCls : 'refresh',
							renderHidden : true,
							hidden : true,
							handler : function (event, toolEl, panel, tc)
							{
								var widgetMv = panel.getComponent(0);
								if (widgetMv.handleToolAction)
								{
									widgetMv.handleToolAction("REFRESH");
								}
							}
						};
						toolsArray.push(refreshIcon);

						var printIcon = {
							id : 'print',
							qtip : rb['TOOL_TIPS_PRINT'],
							iconCls : 'print',
							renderHidden : true,
							hidden : true,
							handler : function (event, toolEl, panel, tc)
							{
								var widgetMv = panel.getComponent(0);
								if (widgetMv.handleToolAction)
								{
									widgetMv.handleToolAction("PRINT");
								}
							}
						};
						toolsArray.push(printIcon);
					} else
					{
						var pin = {
							id : 'pin',
							qtip : rb['TOOL_TIPS_PIN'],
							hidden : true,
							renderHidden : true,
							handler : function (event, toolEl, panel, tc)
							{
								var widgetMv = panel.getComponent(0);
								if (widgetMv.getToolsMenuItems)
								{
									var menu = widgetMv.getToolsMenuItems();
									if (menu)
									{
										menu.show(this.id);
									}
								}
							}
						};
						toolsArray.push(pin);
					}

					var maxIcon = {
						id : 'maximize',
						qtip : rb['TOOL_TIPS_MAXIMIZE'],
						hidden : true,
						renderHidden : true,
						handler : function (event, toolEl, panel, tc)
						{
							var height = iportal.jsutil.getContainerResizeHeight() + 25;
							var width = iportal.jsutil.getContainerResizeWidth();
							var win = null;

							var OldPanelObj = panel;
							var widgetMv = panel.getComponent(0);

							if (widgetMv.mwc)
							{
								widgetMv = widgetMv.mwc.getActiveTab().getComponent(0);
							}

							var currencyInd = widgetMv.getCurrencyIndicator();
							var viewType = widgetMv.mvh.vmd.VIEW_MD.FLD_VIEW_TYPE;

							if (Ext.isIE6 || Ext.isIE7 || Ext.isIE8 || Ext.isIE9)
							{
								width = width - 7;
							}

							var that = this;
							win = new Ext.Window({
								width : width,
								height : height,
								modal : true,
								minWidth : width,
								cls : 'maxwindow',
								minHeight : height,
								plain : true,
								buttonAlign : 'center',
								autoScroll : true,
								draggable : false,
								resizable : false,
								currencyInd : currencyInd,
								tools : [ {
									id : 'pin',
									qtip : rb['TOOL_TIPS_PIN'],
									hidden : true,
									handler : function (event, toolEl, panel, tc)
									{
										var widgetMv = panel.getComponent(0);

										if (widgetMv.mwc)
										{
											widgetMv = widgetMv.mwc.getActiveTab().getComponent(0);
										}

										if (widgetMv.getToolsMenuItems)
										{
											var menu = widgetMv.getToolsMenuItems();
											if (menu)
											{
												menu.show(this.id);
											}
										}
									}
								}, {
									id : 'help',
									qtip : rb['TOOL_TIPS_HELP'],
									iconCls : 'help',
									renderHidden : true,
									hidden : true,
									handler : function (event, toolEl, panel, tc)
									{
										var widgetMv = panel.getComponent(0);
										if (widgetMv.handleToolAction)
										{
											widgetMv.handleToolAction("HELP");
										}
									}
								}, {
									id : 'excel',
									qtip : rb['TOOL_TIPS_EXCEL'],
									iconCls : 'excel',
									renderHidden : true,
									hidden : true,
									handler : function (event, toolEl, panel, tc)
									{
										var widgetMv = panel.getComponent(0);
										if (widgetMv.handleToolAction)
										{
											widgetMv.handleToolAction("EXCEL");
										}
									}
								}, {
									id : 'pdf',
									qtip : rb['TOOL_TIPS_PDF'],
									iconCls : 'pdf',
									renderHidden : true,
									hidden : true,
									handler : function (event, toolEl, panel, tc)
									{
										var widgetMv = panel.getComponent(0);
										if (widgetMv.handleToolAction)
										{
											widgetMv.handleToolAction("PDF");
										}
									}
								}, {
									id : 'csv',
									qtip : rb['TOOL_TIPS_CSV'],
									iconCls : 'csv',
									renderHidden : true,
									hidden : true,
									handler : function (event, toolEl, panel, tc)
									{
										var widgetMv = panel.getComponent(0);
										if (widgetMv.handleToolAction)
										{
											widgetMv.handleToolAction("CSV");
										}
									}
								}, {
									id : 'rtf',
									qtip : rb['TOOL_TIPS_RTF'],
									iconCls : 'pdf',
									renderHidden : true,
									hidden : true,
									handler : function (event, toolEl, panel, tc)
									{
										var widgetMv = panel.getComponent(0);
										if (widgetMv.handleToolAction)
										{
											widgetMv.handleToolAction("RTF");
										}
									}
								}, {
									id : 'clearFilter',
									qtip : rb['TOOL_TIPS_CLEAR_FILTER'],
									iconCls : 'filter',
									renderHidden : true,
									hidden : true,
									handler : function (event, toolEl, panel, tc)
									{
										var widgetMv = panel.getComponent(0);
										if (widgetMv.handleToolAction)
										{
											widgetMv.handleToolAction("FILTER");
										}
									}
								}, {
									id : 'refresh',
									qtip : rb['TOOL_TIPS_REFRESH'],
									iconCls : 'refresh',
									renderHidden : true,
									hidden : true,
									handler : function (event, toolEl, panel, tc)
									{
										var widgetMv = panel.getComponent(0);
										if (widgetMv.handleToolAction)
										{
											widgetMv.handleToolAction("REFRESH");
										}
									}
								}, {
									id : 'print',
									qtip : rb['TOOL_TIPS_PRINT'],
									iconCls : 'print',
									renderHidden : true,
									hidden : true,
									handler : function (event, toolEl, panel, tc)
									{
										var widgetMv = panel.getComponent(0);
										if (widgetMv.handleToolAction)
										{
											widgetMv.handleToolAction("PRINT");
										}
									}
								}, {
									id : 'close',
									qtip : rb['TOOL_TIPS_CLOSE'],
									handler : function (event, toolEl, panel, tc)
									{
										try
										{

											if (viewType == 'FORM')
											{
												var widRef = win.getComponent(0);
												win.remove(widRef, false);
												win.doLayout();

												OldPanelObj.add(widRef);
												OldPanelObj.show();
												OldPanelObj.doLayout();
											}

											win.close();
										} catch (err)
										{
										}

									}
								} ],
								items : [],
								/**
								 * The more menu will be visible if the value of the showFlag.TOOLS_IND is true
								 * otherwise it will be hidden
								 */
								showToolIcon : function (showFlag)
								{

									var showToolsAsLinearFlag = iportal.systempreferences.getToolsAsLinearFlag();
									if (showToolsAsLinearFlag == 'Y')
									{
										if (this.tools.help != null)
										{
											this.tools.help.setVisible(showFlag.HELP_IND);
										} else
										{
											this.tools[2].hidden = !showFlag.HELP_IND;
										}
										if (this.tools.excel != null)
										{
											this.tools.excel.setVisible(showFlag.EXCEL_IND);
										} else
										{
											this.tools[3].hidden = !showFlag.EXCEL_IND;
										}
										if (this.tools.pdf != null)
										{
											this.tools.pdf.setVisible(showFlag.PDF_IND);
										} else
										{
											this.tools[4].hidden = !showFlag.PDF_IND;
										}
										if (this.tools.csv != null)
										{
											this.tools.csv.setVisible(showFlag.CSV_IND);
										} else
										{
											this.tools[5].hidden = !showFlag.CSV_IND;
										}
										if (this.tools.clearFilter != null)
										{
											this.tools.clearFilter.setVisible(showFlag.FILTER_IND);
										} else
										{
											this.tools[6].hidden = !showFlag.FILTER_IND;
										}
										if (this.tools.refresh != null)
										{
											this.tools.refresh.setVisible(showFlag.REFRESH_IND);
										} else
										{
											this.tools[7].hidden = !showFlag.REFRESH_IND;
										}
										if (this.tools.print != null)
										{
											this.tools.print.setVisible(showFlag.PRINT_IND);
										} else
										{
											this.tools[8].hidden = !showFlag.PRINT_IND;
										}
									} else
									{
										if (this.tools.pin != null)
										{
											this.tools.pin.setVisible(showFlag.TOOLS_IND);
										} else
										{
											this.tools[0].hidden = !showFlag.TOOLS_IND;
										}
									}

								}
							});

							var config = {
								WIDGET_ID : widgetMv.itemId,
								height : height - 37

							};
							var widget = iportal.jsutil.initiateWidget(config);
							widget.mv.isParentPortlet = true;
							if (viewType == 'FORM')
							{
								win.add(widgetMv);
							} else
							{
								win.add(widget.mv);
							}
							win.doLayout();
							win.show();

						}
					};
					toolsArray.push(maxIcon);

					var switchChart = {
						id : 'switchChart',
						qtip : rb['TOOL_TIPS_SWITCHCHART'],
						hidden : true,
						renderHidden : true,
						handler : function (event, toolEl, panel, tc)
						{
							var widgetMv = panel.getComponent(0);
							if (widgetMv.getSwitchChartIcon)
							{
								var menu = widgetMv.getSwitchChartIcon();
								if (menu)
								{
									menu.show(this.id);
								}
							}
						}
					};
					toolsArray.push(switchChart);
					var switchView = {
						id : 'switchView',
						qtip : rb['TOOL_TIPS_SWITCHVIEW'],
						hidden : true,
						renderHidden : true,
						handler : function (event, toolEl, panel, tc)
						{
							var widgetMv = panel.getComponent(0);
							if (widgetMv.getSwitchViewIcon)
							{
								widgetMv.getSwitchViewIcon();
							}
						}
					};

					toolsArray.push(switchView);

					return toolsArray;
				},

				/**
				 * 
				 */
				onFireResize : function (panel)
				{
					var widgetMv = panel.getComponent(0);
					this.doLayout();
					if (this.ownerCt.ownerCt.ownerCt.resetHeight)
					{
						this.ownerCt.ownerCt.ownerCt.resetHeight();
					} else
					{
						this.ownerCt.ownerCt.ownerCt.doLayout();
					}
				},

				/**
				 * 
				 */
				onFireExpand : function (panel)
				{
					this.onFireResize(panel);
					var widgetMv = panel.getComponent(0);

					setTimeout(function ()
					{
						widgetMv.fireEvent("widgetexpand");
					}, 100);
				},

				/**
				 * Destroying the currency combo instance on destroying the panel
				 */
				destroyCCYSelector : function ()
				{
					Ext.destroy(this.ccySelector);
					delete this.ccySelector;
				},

				/**
				 * This method will be used to update the label of the widget catalog icon with the widget's title
				 */
				handleTitleUpdate : function (panel, title)
				{
					var currWs = iportal.workspace.metadata.getCurrentWorkspaceId();
					var wgtTitle = null;
					var iconId = this.itemId.substring(0, this.itemId.indexOf("PORTLET")) + "ICON";
					var wigCat = Ext.getCmp("WIDGET_CATALOGUE");
					if (wigCat != null)
					{
						var iconArr = wigCat.find("itemId", iconId);
						if (iconArr != null && iconArr[0] != null)
						{
							iconArr[0].setLabel(title);
							/**
							 * New code for updating the meta data model with the widget's title. This will be later
							 * used for showing the widget icon title in the catalog.
							 */
							var widgetMv = panel.getComponent(0);
							var widgetId = panel.itemId.substring(0, panel.itemId.indexOf("_PORTLET"));
							if (wigCat.collapsed)
							{
								wgtTitle = iportal.workspace.metadata.getCurrentWidgetTitleByID(currWs, widgetId);
								panel.setTitle(wgtTitle);
							}
							title = wgtTitle != null ? wgtTitle : title;
							/**
							 * Updating the meta data with widget's title.
							 */
							iportal.workspace.metadata.updateWidgetDef(widgetMv.LAYOUT_ID, widgetId, {
								WGT_TITLE : title
							});
							iconArr[0].setLabel(title);
						}
					} else
					{
						var widgetId = panel.itemId.substring(0, panel.itemId.indexOf("_PORTLET"));
						var widgetMv = panel.getComponent(0);

						if (title == 'Loading..')
						{
							wgtTitle = iportal.workspace.metadata.getCurrentWidgetTitleByID(currWs, widgetId);
							panel.setTitle(wgtTitle);
						}

						title = wgtTitle != null ? wgtTitle : title;

						iportal.workspace.metadata.updateWidgetDef(widgetMv.LAYOUT_ID, widgetId, {
							WGT_TITLE : title
						});

					}
				},

				/**
				 * 
				 */
				showToolIcon : function (showFlag)
				{
					cbx.widgetUtil.showtoolIcon(this, showFlag);
				},
				/**
				 * 
				 */
				handleClose : function (event, toolEl, panel, tc)
				{
	//The app dock model will be updated if an app is closed
					var widgetMv = panel.getComponent(0);
		//var iconId = panel.itemId.substring(0, panel.itemId.indexOf('PORTLET')) + 'ICON';
					var widgetId = panel.itemId.substring(0, panel.itemId.indexOf("_PORTLET"));
		var label = widgetMv.titleText != null ? widgetMv.titleText : panel.title; 
		var iconConfig = {
					id : widgetId,
					label : label
		};
		CCDM.addIconToAppDockModel(iconConfig);
		//Removed unused code

			iportal.workspace.metadata.updateWidgetDef(widgetMv.LAYOUT_ID, widgetId, {
				CLOSED_IND : 'Y'
			});
			/**
			 * Removed unused code of Creating the widget catalog if it is not already initialized, otherwise the catalog icons are
			 * rendered
			 */
		panel.hide();
		var widgetContainer = panel.widgetContainer;
		panel.ownerCt.remove(panel, true);
		if (widgetContainer.doLayout)
		{
			widgetContainer.doLayout();
		}
	},
	/**
	 * Setting the currency indicator received from immediate child instance
	 * 
	 * @param currency
	 */
	showCurrencyInd : function (showFlag)
	{
		if (this.header)
		{ 
			if (this.ccySelector)
			{
				var container = this.header.id;
				container = Ext.get(container);
				container.addClass('x-panel-combo');
				this.ccySelector.setVisible(showFlag);
			} 
			else
			{
				var container = this.header.id;
				container = Ext.get(container);
				container.addClass('x-panel-combo');
				this.ccySelector = this.getCcySelectorComp();
				this.ccySelector.setVisible(showFlag);
			} 
		}
	},
				/**
				 * To get the tools map of the widget header.
				 */
				getToolsMap : function ()
				{
					return this.tools;
				},
	/**
	 * OnChange of currency ,Passing the currency value to immediate child
	 * 
	 * @param cmp
	 * @param rec
	 */
	doAfterChange : function (cmp, rec)
	{
		var widgetMv = this.getComponent(0);
		var rateCurrkey = rec.data.rateCurrkey;
		if (rateCurrkey == null || rateCurrkey == '' || rateCurrkey == "null")
		{
			rateCurrkey = iportal.jsutil.getPreferredCurrency();
		}
		widgetMv.onCurrChange(rateCurrkey);
	},

				/**
				 * Currency Selector component rendered next to portlet's title
				 * 
				 * @param ct
				 * @param position
				 */
				afterRender : function (ct, position)
				{
					Ext.ux.Portlet.superclass.afterRender.call(this, ct, position);
					var resizeFlag = iportal.workspace.metadata.getResizeInd(this.getComponent(0).itemId, this
								.getComponent(0).LAYOUT_ID);
					if (Ext.isEmpty(resizeFlag))
					{
						resizeFlag = "Y";
					}
					if (this.resizable === true && resizeFlag === "Y")
					{
						this.resizer = new Ext.Resizable(this.el, {
							handles : 's',
							pinned : true,
							transparent : true
						});
						this.resizer.on('resize', this.resizerAction, this);
					}
					this.ccySelector = this.getCcySelectorComp();
				},

				/**
				 * 
				 */
				resizerAction : function (cmpt, width, height, obj)
				{
					/**
					 * Resetting the panel's body el height as the resizer isn't refreshing it correctly everytime.
					 */
					var bodyHeight = height - this.getFrameHeight();
					if (this.body.getHeight() != bodyHeight)
					{
						this.body.setHeight(bodyHeight);
					}
					height = height - this.getFrameHeight();
					var wgt = this.getComponent(0);
					wgt.height = height;
					wgt.setHeight(height);
					if (wgt.updateHeight)
					{
						if (this.tools.pin && this.tools.pin.isVisible())
						{
							wgt.updateHeight(height);
						} else
						{
							wgt.updateHeight(height - 27);
						}
					} else
					{
						if (wgt.mwc && wgt.mwc.updateHeight)
						{
							wgt.mwc.updateHeight(height);
						}
					}
					wgt.doLayout();
					if (this.ownerCt.ownerCt.ownerCt.resetHeight)
					{
						this.ownerCt.ownerCt.ownerCt.resetHeight();
					} else
					{
						this.ownerCt.ownerCt.ownerCt.doLayout();
					}
				},

				/**
				 * 
				 */
				getCcySelectorComp : function ()
				{
					var ccy = null;
					if (cbx.isEmpty(iportal.jsutil.getCCYSelectorData()))
					{
						ccy = [ "No Currency Available", "No Currency Available" ];
					} else
					{
						ccy = iportal.jsutil.getCCYSelectorData();
					}
					return new Ext.form.ComboBox({
						name : 'state',
						store : new Ext.data.ArrayStore({
							fields : [ 'rateCurrkey', 'rateCurrValue' ],
							data : ccy
						}),
						width : 180,
						valueField : 'rateCurrkey',
						displayField : 'rateCurrValue',
						typeAhead : true,
						mode : 'local',
						triggerAction : 'all',
						emptyText : CRB.getFWBundle()['SELECT_CURRENCY'],
						selectOnFocus : true,
						listeners : {
							"select" : this.doAfterChange,
							scope : this
						}
					});
				}
			});
/**
 * 
 */
Ext.reg('portlet', Ext.ux.Portlet);
