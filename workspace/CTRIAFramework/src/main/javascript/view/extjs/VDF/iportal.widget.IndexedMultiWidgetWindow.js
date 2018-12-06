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
 
 * 		@version   0.1
 */

Ext.namespace('iportal.widget');

/**
 * This method is used to load the IndexedMultiWidget in window.
 * */
iportal.widget.IndexedMultiWidgetWindow = function (panelConfig){

	/* Specifying the window height and width. */
	var configHeight = null;
	if(!cbx.isEmpty(panelConfig.windowHeight)){
		configHeight = panelConfig.windowHeight;
	}
	else if (!cbx.isEmpty(panelConfig.height)){
		configHeight = panelConfig.height;
	}
	var windowHeight = cbx.isEmpty(configHeight) ? 335 : configHeight;
	var windowWidth = 705;
	panelConfig.mv.isParentPortlet = true;
	var getTools = function (){
		var showToolsAsLinearFlag = iportal.systempreferences.getToolsAsLinearFlag();
		var toolsArray = new Array();
		if (showToolsAsLinearFlag) {
			var helpIcon = {
				id : 'help',
				qtip : CRB.getFWBundle().TOOL_TIPS_HELP,  
				iconCls : 'help',
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
				hidden : true,
				handler : function (event, toolEl, panel, tc){
					var widgetMv = panel.getComponent(0);
					if (widgetMv.handleToolAction) {
						widgetMv.handleToolAction("CSV");
					}
				}
			};
			toolsArray.push(exportCsvIcon);

			var clearFilterIcon = {
				id : 'clearFilter',
				qtip : CRB.getFWBundle().TOOL_TIPS_CLEAR_FILTER, 
				iconCls : 'filter',
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
				hidden : true,
				handler : function (event, toolEl, panel, tc){
					var widgetMv = panel.getComponent(0);
					if (widgetMv.handleToolAction) {
						widgetMv.handleToolAction("PRINT");
					}
				}
			};
			toolsArray.push(printIcon);
		} else {
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
			
		}
		toolsArray.push({
			id : 'close',
			qtip : CRB.getFWBundle().TOOL_TIPS_CLOSE,  
			handler : function (event, toolEl, panel, tc){

				win.close();
			}
		});
		return toolsArray;
	};

	var win = new iportal.Window({
		bundleKey : CRB.getFWBundleKey(),
		hideOnClose : false,
		tools : getTools(),
		width : windowWidth,
		height : windowHeight,
		modal : true,
		items : [ panelConfig.mv ],
		resizable : true,
		showToolIcon : function (showFlag){
			if (this.tools != null) {
				var showToolsAsLinearFlag = iportal.systempreferences.getToolsAsLinearFlag();
				if (showToolsAsLinearFlag) {
					if (this.tools.help != null) {
						this.tools.help.setVisible(showFlag.HELP_IND);
					} else {
						this.tools[0].hidden = !showFlag.HELP_IND;
					}
					if (this.tools.excel != null) {
						this.tools.excel.setVisible(showFlag.EXCEL_IND);
					} else {
						this.tools[1].hidden = !showFlag.EXCEL_IND;
					}
					if (this.tools.pdf != null) {
						this.tools.pdf.setVisible(showFlag.PDF_IND);
					} else {
						this.tools[2].hidden = !showFlag.PDF_IND;
					}
					if (this.tools.csv != null) {
						this.tools.csv.setVisible(showFlag.CSV_IND);
					} else {
						this.tools[3].hidden = !showFlag.CSV_IND;
					}
					if (this.tools.clearFilter != null) {
						this.tools.clearFilter.setVisible(showFlag.FILTER_IND);
					} else {
						this.tools[4].hidden = !showFlag.FILTER_IND;
					}
					if (this.tools.refresh != null) {
						this.tools.refresh.setVisible(showFlag.REFRESH_IND);
					} else {
						this.tools[5].hidden = !showFlag.REFRESH_IND;
					}
					if (this.tools.print != null) {
						this.tools.print.setVisible(showFlag.PRINT_IND);
					} else {
						this.tools[6].hidden = !showFlag.PRINT_IND;
					}
					
				} else {
					if (this.tools.pin != null) {
						this.tools.pin.setVisible(showFlag.TOOLS_IND);
					} else {
						this.tools[0].hidden = !showFlag.TOOLS_IND;
					}
				} 
				
				

			}
		},
		/**
		 * This function used to display the bottomBarItems.
		 * */
		showBottomBarButtons : function (bottomBarItems){
			if (this.getBottomToolbar && this.getBottomToolbar()) {
				/* Removing the bbar items. */
				this.getBottomToolbar().removeAll();
				this.getBottomToolbar().doLayout();
				this.getBottomToolbar().hide();
				if (bottomBarItems && bottomBarItems.length > 0) {
					/* Adding the bbar items. */
					for (i = 0; i < bottomBarItems.length; i++) {
						this.getBottomToolbar().add(bottomBarItems[i]);
					}
					this.getBottomToolbar().doLayout();
					this.getBottomToolbar().show();
				} else {
					this.getBottomToolbar().renderHidden = true;
				}
			}
		}
	});
	win.show();
};
