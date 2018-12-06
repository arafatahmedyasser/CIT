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

Ext.namespace('cbx.zologsearch');
/**
 * This class is responsible for rendering the Form / widget that is being searched. 
 *

 */
cbx.zologsearch.zologSearchHandler = function (config){
	var cons = cbx.zologsearch.constants;
	var conf = config.value;
	var itemId=conf.ITEM_ID;
	
	this.zologWidgetHandler = function (){
		var win = new iportal.Window({
			bundleKey : CRB.getBundle('common'),
			hideOnClose : false,

			tools : [ {
				id : 'pin',
				qtip : 'More..',
				hidden : false,
				handler : function (event, toolEl, panel, tc){
					var widgetMv = panel.getComponent(0);
					if (widgetMv.getToolsMenuItems) {
						var menu = widgetMv.getToolsMenuItems();
						if (menu) {
							menu.show(this.id);
						}
					}

				}
			}, {
				id : 'close',
				handler : function (event, toolEl, panel, tc){

					win.close();
				}
			} ],
			width : 600,
			height : 430,
			autoScroll : true,
			modal : true,
			// items : [ zlgWidget.mv ],
			buttonAlign : 'left',
			showToolIcon : function (showFlag){
				var that = this;
				if (this.tools != null) {
					if (this.tools.length) {
						for ( var i = 0; i < this.tools.length; i++) {
							if (this.tools[i].id === "pin") {
								this.tools[i].hidden = !showFlag.TOOLS_IND;
							}
						}
					} else {
						if (this.tools.pin != null) {
							this.tools.pin.setVisible(showFlag.TOOLS_IND);
						}
					}
				}
			}
		});
	
		
			var zlgWidget = canvas.view.appRegisterMap && canvas.view.appRegisterMap[widgetId]?canvas.view.appRegisterMap[widgetId](config):null;
			if(!zlgWidget){
				widget = iportal.listview.listviewrenderermap.getInstance(itemId)();
			}
		//var zlgWidget = iportal.listview.listviewrenderermap[itemId]();
		zlgWidget.mv.loadingInContainer=true;
		zlgWidget.mv.draggable=false;
		zlgWidget.setParentHeight(390);
		if(zlgWidget.childWidgets){
			zlgWidget.mv.isParentPortlet = true;
		}
		
		win.add(zlgWidget.mv);
		win.doLayout();
		win.show();

	};

	this.zologFormHandler = function (){
		
		IWMH.executeHandler(conf.WS_MENU_ID, IWMC.EVENT_CLICK, config);

	};

	if (conf.ITEM_TYPE == cons.WIDGET) {
		this.zologWidgetHandler();
	} else if (conf.ITEM_TYPE == cons.FORM) {
		this.zologFormHandler();
	}

};