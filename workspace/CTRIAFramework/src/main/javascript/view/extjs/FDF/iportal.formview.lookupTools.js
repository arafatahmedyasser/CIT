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
Ext.ns("iportal.formview");

	iportal.formview.getLookUpTools=function()
	{
		var that = this;
		var showToolsAsLinearFlag = iportal.systempreferences.getToolsAsLinearFlag();
		var toolsArray = new Array();
		if (showToolsAsLinearFlag) {
			var helpIcon = {
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
			};
			toolsArray.push(helpIcon);
			var exportExcelIcon = {
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
			};
			toolsArray.push(exportExcelIcon);
			var exportPdfIcon = {
				id : 'pdf',
				qtip : CRB.getFWBundle().TOOL_TIPS_PDF,    
				iconCls : 'pdf',
				// specific
				renderHidden : true,
				hidden : true,
				handler : function (event, toolEl, panel, tc){
					var widgetMv = panel.getComponent(0);
					if (widgetMv.handleToolAction) {
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
				handler : function (event, toolEl, panel, tc){
					var widgetMv = panel.getComponent(0);
					if (widgetMv.handleToolAction) {
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
						handler : function (event, toolEl, panel, tc){
							var widgetMv = panel.getComponent(0);
							if (widgetMv.handleToolAction) {
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
				handler : function (event, toolEl, panel, tc){
					var widgetMv = panel.getComponent(0);
					if (widgetMv.handleToolAction) {
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
				handler : function (event, toolEl, panel, tc){
					var widgetMv = panel.getComponent(0);
					if (widgetMv.handleToolAction) {
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
				handler : function (event, toolEl, panel, tc){
					var widgetMv = panel.getComponent(0);
					if (widgetMv.handleToolAction) {
						widgetMv.handleToolAction("PRINT");
					}
				}
			};
			toolsArray.push(printIcon);
		}
		else {
			var pin = {
				id : 'pin',
				qtip : CRB.getFWBundle().TOOL_TIPS_PIN,    
				hidden : true,
				renderHidden : true,
				handler : function (event, toolEl, panel, tc){
					var widgetMv = panel.getComponent(0);
					if (widgetMv.getToolsMenuItems) {
						var menu = widgetMv.getToolsMenuItems();
						if (menu) {
							menu.show(this.id);
						}
					}
				}
			};
			toolsArray.push(pin);
		};
		return toolsArray;
	}
	 