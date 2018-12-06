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

 * @version 1
 */

cbx.ns("cbx");

/**
 * Contains most of the commonly used api's used for rendering a widget
 */
cbx.widgetUtil = function ()
{
	return {
		/**
		 * Changed the tools order to obtain the preference icon before more icon
		 * 
		 * @returns {Array}
		 */
		getTools : function ()
		{
			var that = this;
			// Framework Upgrade 
			// Getting the SHOW_TOOLS_AS_LINEAR value from
			// orbionedirect.properties.
			var showToolsAsLinearFlag = iportal.systempreferences.getToolsAsLinearFlag();
			var toolsArray = new Array();
			

			var tbarCollapseInd = {
				id : 'plus',
				qtip : CRB.getFWBundle().TOOL_TIPS_ADDBAR,
				renderHidden : true,
				hidden : true,
				handler : this.tbarCollapse,
				scope : this
			};
			
			toolsArray.push(tbarCollapseInd);

			var collapseInd = {
				id : 'toggle',
				qtip : CRB.getFWBundle().TOOL_TIPS_COLLAPSE_EXPAND, 
				renderHidden : true,
				hidden : true,
				handler : this.toggleCollapse,
				scope : this
			};
		
			toolsArray.push(collapseInd);

			var prefIcon = {
				

				id : 'pref',
				qtip : CRB.getFWBundle().TOOL_TIPS_PREFERENCE, 
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
			if (showToolsAsLinearFlag)
			{
				// Add the menu items as linear
				var helpIcon = {
					id : 'help',
					qtip : CRB.getFWBundle().TOOL_TIPS_HELP, 
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
					qtip : CRB.getFWBundle().TOOL_TIPS_EXCEL, 
					iconCls : 'excel',
					// specific
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
					qtip : CRB.getFWBundle().TOOL_TIPS_PDF,
					iconCls : 'pdf',
					// specific
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
					qtip : CRB.getFWBundle().TOOL_TIPS_CSV, 
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
					qtip : CRB.getFWBundle().TOOL_TIPS_RTF,
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
				};
				toolsArray.push(exportRtfIcon);
				
				var clearFilterIcon = {
					id : 'clearFilter',
					qtip : CRB.getFWBundle().TOOL_TIPS_CLEAR_FILTER, 
					iconCls : 'filter',
					// specific
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
					qtip : CRB.getFWBundle().TOOL_TIPS_REFRESH, 
					iconCls : 'refresh',
					// specific
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
					qtip : CRB.getFWBundle().TOOL_TIPS_PRINT,
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
					qtip : CRB.getFWBundle().TOOL_TIPS_PIN, 
					
					// Render the tools as hidden by default.
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
			;
			
			var maxIcon = {
				id : 'maximize',
				qtip : CRB.getFWBundle().TOOL_TIPS_MAXIMIZE, 
				hidden : true,
				renderHidden : true,
				handler : function (event, toolEl, panel, tc)
				{
					var height = iportal.jsutil.getContainerResizeHeight() + 25;
					var width = iportal.jsutil.getContainerResizeWidth();
					var win = null;
				var OldPanelObj=panel;
				var widgetMv = panel.getComponent(0);
				
				if (widgetMv.mwc){
					widgetMv = widgetMv.mwc.getActiveTab().getComponent(0);
				}
				
				var currencyInd = widgetMv.getCurrencyIndicator();				
				//CTCBXQ215F01-Update Starts
				var viewType,gridCmp;
				if(!cbx.isEmpty(widgetMv.mvh.vmd.VIEW_MD)){
					viewType = widgetMv.mvh.vmd.VIEW_MD.FLD_VIEW_TYPE;
				}
				if(viewType==="CHART"){
				gridCmp = widgetMv.mvh.getPanelCmp();
				}
				else{
				gridCmp=widgetMv.mvh.getGridCmp();
				}
			    var currentState= gridCmp.getState();
			    currentState.viewTitle=widgetMv.mvh.getViewTitle();
				var currentStateId=gridCmp.getStateId();
				Ext.state.Manager.set(currentStateId,currentState);
				//CTCBXQ215F01-Update Ends				
				if(Ext.isIE6 || Ext.isIE7 || Ext.isIE8 ||Ext.isIE9)
				{
					width=width-7;
				}
				
				var that=this;
					win = new Ext.Window({
						// title : ' - Daily',
						width : width,
						height : height,
						modal : true,
						cls : 'maxwindow',
						minWidth : width,
						minHeight : height,
						plain : true,
						buttonAlign : 'center',
						autoScroll : true,
						draggable : false,
						resizable : false,
						tools : [ {
							id : 'pin',
							qtip : CRB.getFWBundle().TOOL_TIPS_PIN, 
							hidden : true,
							handler : function (event, toolEl, panel, tc)
							{
								var widgetMv = panel.getComponent(0);
							if (widgetMv.mwc){
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
					},{
						id : 'help',								
					    qtip : CRB.getFWBundle().TOOL_TIPS_HELP, 
					    iconCls : 'help',
					    renderHidden : true,
					    hidden : true,
					    handler : function (event, toolEl, panel, tc){
						var widgetMv = panel.getComponent(0);
						if (widgetMv.handleToolAction) {
							widgetMv.handleToolAction("HELP");
						}
					}
					},{
						id : 'excel',								
						qtip : CRB.getFWBundle().TOOL_TIPS_EXCEL,  
						iconCls : 'excel',
						renderHidden : true,
						hidden : true,
						handler : function (event, toolEl, panel, tc){
							var widgetMv = panel.getComponent(0);
							if (widgetMv.handleToolAction) {
								widgetMv.handleToolAction("EXCEL");
							}
						}
					},{
						id : 'pdf',
						qtip : CRB.getFWBundle().TOOL_TIPS_PDF,    
						iconCls : 'pdf',
						renderHidden : true,
						hidden : true,
						handler : function (event, toolEl, panel, tc){
							var widgetMv = panel.getComponent(0);
							if (widgetMv.handleToolAction) {
								widgetMv.handleToolAction("PDF");
							}
						}
					},
					 {
						id : 'csv',
						qtip : CRB.getFWBundle().TOOL_TIPS_CSV, 
						iconCls : 'csv',
						renderHidden : true,
						hidden : true,
						handler : function (event, toolEl, panel, tc){
							var widgetMv = panel.getComponent(0);
							if (widgetMv.handleToolAction) {
								widgetMv.handleToolAction("CSV");
							}
						}
					},
					 {
						id : 'rtf',
						qtip : CRB.getFWBundle().TOOL_TIPS_RTF,  
						iconCls : 'pdf',
						renderHidden : true,
						hidden : true,
						handler : function (event, toolEl, panel, tc){
							var widgetMv = panel.getComponent(0);
							if (widgetMv.handleToolAction) {
								widgetMv.handleToolAction("RTF");
							}
						}
					},
					{
						id : 'clearFilter',
						qtip : CRB.getFWBundle().TOOL_TIPS_CLEAR_FILTER, 
						iconCls : 'filter',
						renderHidden : true,
						hidden : true,
						handler : function (event, toolEl, panel, tc){
							var widgetMv = panel.getComponent(0);
							if (widgetMv.handleToolAction) {
								widgetMv.handleToolAction("FILTER");
							}
						}
					},
					{
						id : 'refresh',
						qtip : CRB.getFWBundle().TOOL_TIPS_REFRESH,  
						iconCls : 'refresh',
						renderHidden : true,
						hidden : true,
						handler : function (event, toolEl, panel, tc){
							var widgetMv = panel.getComponent(0);
							if (widgetMv.handleToolAction) {
								widgetMv.handleToolAction("REFRESH");
							}
						}
					},
					{
						id : 'print',
						qtip : CRB.getFWBundle().TOOL_TIPS_PRINT, 
						iconCls : 'print',
						renderHidden : true,
						hidden : true,
						handler : function (event, toolEl, panel, tc){
							var widgetMv = panel.getComponent(0);
							if (widgetMv.handleToolAction) {
								widgetMv.handleToolAction("PRINT");
							}
						}
					}],
					items : [],
					/**
					 * The more menu will be visible if the value of
					 * the showFlag.TOOLS_IND is true otherwise it
					 * will be hidden
					 */
					showToolIcon : function (showFlag){
					
						var showToolsAsLinearFlag = iportal.systempreferences.getToolsAsLinearFlag();
						if (showToolsAsLinearFlag == 'Y') {
							if (this.tools.help != null) {
								this.tools.help.setVisible(showFlag.HELP_IND);
							} else {
								this.tools[2].hidden = !showFlag.HELP_IND;
							}
							if (this.tools.excel != null) {
								this.tools.excel.setVisible(showFlag.EXCEL_IND);
							} else {
								this.tools[3].hidden = !showFlag.EXCEL_IND;
							}
							if (this.tools.pdf != null) {
								this.tools.pdf.setVisible(showFlag.PDF_IND);
							} else {
								this.tools[4].hidden = !showFlag.PDF_IND;
							}
							if (this.tools.csv != null) {
								this.tools.csv.setVisible(showFlag.CSV_IND);
							} else {
								this.tools[5].hidden = !showFlag.CSV_IND;
							}
							if (this.tools.clearFilter != null) {
								this.tools.clearFilter.setVisible(showFlag.FILTER_IND);
							} else {
								this.tools[6].hidden = !showFlag.FILTER_IND;
							}
							if (this.tools.refresh != null) {
								this.tools.refresh.setVisible(showFlag.REFRESH_IND);
							} else {
								this.tools[7].hidden = !showFlag.REFRESH_IND;
							}
							if (this.tools.print != null) {
								this.tools.print.setVisible(showFlag.PRINT_IND);
							} else {
								this.tools[8].hidden = !showFlag.PRINT_IND;
							}
						}
						else{
							if (this.tools.pin != null) {
								this.tools.pin.setVisible(showFlag.TOOLS_IND);
							} else {
								this.tools[0].hidden = !showFlag.TOOLS_IND;
							}
						}
							
					}
				});
				
					for (var obj in win.tools){
						if(win.tools[obj].id == "close"){
							win.tools.remove(win.tools[obj]);
						}
					}
					win.tools.push({	
						id : 'close',
						qtip : CRB.getFWBundle().TOOL_TIPS_CLOSE,   
						handler : function (event, toolEl, panel, tc){	
							try {
									if(viewType == 'FORM'){
										var widRef = win.getComponent(0);
										win.remove(widRef,false);
										win.doLayout();
										
										OldPanelObj.add(widRef);
										OldPanelObj.show();
										OldPanelObj.doLayout();
									}
									win.close();
								} 
							catch (err) {
							}
						}
					});
				var config = {
					WIDGET_ID : widgetMv.itemId,
					height : height - 37

				};
				var widget = iportal.jsutil.initiateWidget(config);
				widget.mv.isParentPortlet = true;
				widget.mv['isMaximized'] = true;
				if(viewType == 'FORM'){
					win.add(widgetMv);
				}
				else {
					win.add(widget.mv);
				}				
					win.doLayout();
					win.show();

				}
			};
			toolsArray.push(maxIcon);
			

			var switchChart = {
				id : 'switchChart',
				qtip : CRB.getFWBundle().TOOL_TIPS_SWITCHCHART, 
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
				qtip : CRB.getFWBundle().TOOL_TIPS_SWITCHVIEW, 
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
			
			
			
			if(iportal.preferences.getFooter()==true)
			{ 
				hide=!iportal.workspace.metadata.isWidgetCatalogRequired();
				}else
				{
					hide=true;
					}
			
			
			var closeIcon = {
				id : 'close',
				/**
				 * The close tool will be visible only if the wigdet catalog is required. The value of the hidden field
				 * will be updated based on the value returned by the isWidgetCatalogRequired method
				 */
				qtip : CRB.getFWBundle().TOOL_TIPS_CLOSE,
				hidden : hide,
				handler : function (event, toolEl, panel, tc)
				{
					var widgetMv = panel.getComponent(0);

					var iconId = panel.itemId.substring(0, panel.itemId.indexOf('PORTLET')) + 'ICON';
					var widgetId = panel.itemId.substring(0, panel.itemId.indexOf("_PORTLET"));
					var iconArr = Ext.getCmp('WIDGET_CATALOGUE').find("itemId", iconId);

					iportal.workspace.metadata.updateWidgetDef(widgetMv.LAYOUT_ID, widgetId, {
						CLOSED_IND : 'Y'
					});
					/**
					 * creating the widget catalog if it is not already initialized, otherwise the catalog icons are
					 * rendered
					 */
					if (iconArr != null && iconArr[0] != null)
					{
						iconArr[0].show();
					} else
					{
						var label = widgetMv.titleText != null ? widgetMv.titleText : panel.title; 
						var wigCat = Ext.getCmp("WIDGET_CATALOGUE");
						var iconObj = {
							xtype : 'iportal-catalog-icon',
							iconCls : widgetId,
							itemId : iconId,
							hidden : false,

							scale : 'large',
							label : label, 
							style : 'margin:20px 0px 0px 15px',
							handler : function ()
							{
								var widgetContainer = iportal.workspace.metadata.getCurrentWorkspace()
											.getWidgetContainer();
								var widgetId = this.iconCls;
								
								var layoutId = iportal.workspace.metadata.getCurrentLayoutId();
								iportal.workspace.metadata.updateWidgetDef(layoutId, widgetId, {
									CLOSED_IND : 'N'
								});
								widgetContainer.addWidget(widgetId);
							}
						};
						wigCat.add(iconObj);
						wigCat.doLayout();
					}
					panel.hide();
					var widgetContainer = panel.widgetContainer;
					panel.ownerCt.remove(panel, true);
				}
			};
			// added for widget catalog implementation 
			toolsArray.push(closeIcon);
			return toolsArray;

		},
		showtoolIcon : function (scope, showFlag)
		{
			
			var that = scope; 
			var customTools = {};
			customTools = showFlag.CUSTOM_TOOLS;
			var customToolsInd = showFlag.CUSTOM_TOOLS_IND;
			var customToolsArray = new Array();
			if (showFlag.INIT_COLLAPSED == null || showFlag.INIT_COLLAPSED !== true)
			{
				setTimeout(function ()
				{
					if (that.collapsed)
					{
						try
						{
							that.expand(true);
						} catch (e)
						{
						}
					}
				}, 50);
			}
			
			if (scope.tools.toggle != null && scope.tools.toggle != undefined)
			{
				if (scope.tools.plus != null)
				{
					scope.tools.plus.setVisible(showFlag.SHOW_TBAR_IND);
				} else
				{
					scope.tools[0].hidden = false;
				}

				if (scope.tools.toggle != null)
				{
					scope.tools.toggle.setVisible(showFlag.COLLAPSE_IND);
				} else
				{
					scope.tools[1].hidden = !showFlag.COLLAPSE_IND;
				}

				
				if (scope.tools.pref != null)
				{
					
					scope.tools.pref.setVisible((showFlag.PREFS_IND || showFlag.SWITCH_WIDGET_IND)); 
				} else
				{
					scope.tools[2].hidden = !showFlag.PREFS_IND && !showFlag.SWITCH_WIDGET_IND;
				}

				if (scope.tools != null)
				{
					
					var showToolsAsLinearFlag = iportal.systempreferences.getToolsAsLinearFlag();
					// Set the visibility to the tools.
					if (showToolsAsLinearFlag)
					{

						if (scope.tools.help != null)
						{
							scope.tools.help.setVisible(showFlag.HELP_IND);
						} else
						{
							scope.tools[3].hidden = !showFlag.HELP_IND;
						}
						if (scope.tools.excel != null)
						{
							scope.tools.excel.setVisible(showFlag.EXCEL_IND);
						} else
						{
							scope.tools[4].hidden = !showFlag.EXCEL_IND;
						}
						if (scope.tools.pdf != null)
						{
							scope.tools.pdf.setVisible(showFlag.PDF_IND);
						} else
						{
							scope.tools[5].hidden = !showFlag.PDF_IND;
						}
						if (scope.tools.csv != null)
						{
							scope.tools.csv.setVisible(showFlag.CSV_IND);
						} else
						{
							scope.tools[6].hidden = !showFlag.CSV_IND;
						}
						if (scope.tools.clearFilter != null)
						{
							scope.tools.clearFilter.setVisible(showFlag.FILTER_IND);
						} else
						{
							scope.tools[7].hidden = !showFlag.FILTER_IND;
						}
						if (scope.tools.refresh != null)
						{
							scope.tools.refresh.setVisible(showFlag.REFRESH_IND);
						} else
						{
							scope.tools[8].hidden = !showFlag.REFRESH_IND;
						}
						if (scope.tools.print != null)
						{
							scope.tools.print.setVisible(showFlag.PRINT_IND);
						} else
						{
							scope.tools[9].hidden = !showFlag.PRINT_IND;
						}
					
						if (!Ext.isEmpty(customTools))
						{
							for (var i = 0; i < customTools.length; i++)
							{
								this.getCustomToolsLinear(customTools[i], customToolsArray,scope);
							}
							for (var i = 0; i < customToolsArray.length; i++)
								scope.addTool(customToolsArray[i]);
						}
						

					} else
					{
						if (scope.tools.pin != null)
						{
							scope.tools.pin.setVisible(showFlag.TOOLS_IND);
						} else
						{
							scope.tools[3].hidden = !showFlag.TOOLS_IND;
						}
						/*
						 * Code to add custom tools in the root of the multi view header
						 */
						
						if (!Ext.isEmpty(customTools))
						{
							for (var i = 0; i < customTools.length; i++)
							{
								if (customTools[i].TOOL_TYPE == "ROOT")
								{
									var toolItem = {
										id : customTools[i].MENU_ID + "__CUSTOM",
										qtip : customTools[i].DISPLAY_NAME
													? (scope.cuserBundle[customTools[i].DISPLAY_NAME]
																? scope.cuserBundle[customTools[i].DISPLAY_NAME]
																: customTools[i].DISPLAY_NAME)
													: customToolItem[i].MENU_ID,
										iconCls : customTools[i].MENU_ID,
										renderHidden : false,
										hidden : false,
										handler : function (event, toolEl, panel, tc)
										{
											var widgetMv = panel.getComponent(0);
											if (widgetMv.getCustomToolsMenuItems)
											{
												var menu = widgetMv.getCustomToolsMenuItems(tc.id.substr(0,
															tc.id.length - 8));
												if (menu)
												{
													menu.show(this.id);
												}
											}
										}
									};
									if (!(customTools[i].child_nodes.length > 0))
									{
										toolItem.handler = function (event, toolEl, panel, tc)
										{
											var widgetMv = panel.getComponent(0);
											widgetMv.handleCustomToolAction(tc.id.substr(0, tc.id.length - 8),that);

										};
									}
									scope.addTool(toolItem);
								}
							}
						}
						

					}
					
					if (scope.tools.maximize != null)
					{
						scope.tools.maximize.setVisible(showFlag.MAXIMIZE_IND);
					} else
					{
						scope.tools[4].hidden = !showFlag.MAXIMIZE_IND;

					}
					
					if (scope.tools.switchView != null)
					{

						scope.tools.switchView.setVisible(showFlag.CHART_TOOL_IND);
					} else
					{
						scope.tools[5].hidden = !showFlag.CHART_TOOL_IND;
					}
					if (scope.tools.switchChart != null)
					{

						scope.tools.switchChart.setVisible(showFlag.CHART_TOOL_IND);
					} else
					{
						scope.tools[6].hidden = !showFlag.CHART_TOOL_IND;
					}
					
					var closeIcon = {
						id : 'close',

						// * The close tool will be visible only if the wigdet
						// * catalog is required. The value of the hidden field
						// * will be updated based on the value returned by the
						// * isWidgetCatalogRequired method

						qtip : CRB.getFWBundle().TOOL_TIPS_CLOSE, 
						hidden :  hide,
						handler : that.handleClose
					//  Moved the handler code to a method
					// for re-usability
					};

					if (!Ext.isEmpty(scope.tools["close"]))
					{
						scope.tools["close"].remove(true);
						delete scope.tools["close"];
					}
					scope.addTool(closeIcon);

				} 
			}
		}, 
		/**
		 * This method adds all the custom tools in an array.
		 * 
		 * @param customToolItem- A custom tool toolsArray
		 */
		getCustomToolsLinear : function (customToolItem, toolsArray,scope)
		{
			var that = this;
			var toolItem = {
				id : customToolItem.MENU_ID + "__CUSTOM",
				qtip : customToolItem.DISPLAY_NAME ? (scope.cuserBundle[customToolItem.DISPLAY_NAME]
							? scope.cuserBundle[customToolItem.DISPLAY_NAME] : customToolItem.DISPLAY_NAME)
							: customToolItem.MENU_ID,
				iconCls : customToolItem.MENU_ID,
				renderHidden : false,
				hidden : false,
				handler : function (event, toolEl, panel, tc)
				{
					var widgetMv = panel.getComponent(0);
					widgetMv.handleCustomToolAction(tc.id.substr(0, tc.id.length - 8),toolEl);
				}
			};

			if (!Ext.isEmpty(customToolItem.child_nodes)) 
			{
				for (var i = 0; i < customToolItem.child_nodes.length; i++)
				{
					this.getCustomToolsLinear(customToolItem.child_nodes[i], toolsArray,scope);
				}

			} else
			{
				toolsArray.push(toolItem);
			}

		},
		/**
		 * To get the tools map of the widget header.
		 */
		getToolsMap : function ()
		{
			return this.tools;
		}
	}
}()
