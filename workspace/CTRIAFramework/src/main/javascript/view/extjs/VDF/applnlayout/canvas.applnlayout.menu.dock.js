/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
/**
 * This class is intended to render contents to the footer region of the application in the cardlayout.
 */
cbx.ns('canvas.applnlayout.menu');

canvas.applnlayout.menu.dockLayer = function ()
{
	// Ext.getCmp('CONTENT_AREA').addClass('dockMENU_visible');
	var menuWidth = 90;
	var menuHeight = Ext.getCmp('CONTENT_AREA') != null ? Ext.getCmp('CONTENT_AREA').getInnerHeight() : 570;
	var position = [];
	position[0] = Ext.getCmp('CONTENT_AREA') != null ? Ext.getCmp('CONTENT_AREA').getInnerWidth() - menuWidth : 1300;
	position[1] = Ext.getCmp('APPLICATION_HEADER_AREA').height;

	if (Ext.getCmp("DOCK_LAYER_MENU") == null)
	{
		var menu = new Ext.menu.Menu({
			id : "DOCK_LAYER_MENU",
			// height : menuHeight,
			maxWidth : menuWidth,
			maxHeight : menuHeight,
			shadow : false,

			listeners : {
				'show' : {
					fn : function (menu)
					{
						if (menu.hidden)
							menu.getEl().slideIn('tr', {
								easing : 'easeIn',
								callback : function ()
								{
									if (this.afterShow)
										this.afterShow(true);
								},
								scope : menu
							});

					}
				},
				'hide' : {
					fn : function (menu)
					{
						/*
						 * menu.getEl().slideOut('tr',{easing:'easeOut',callback: function(){ // this.el.hide(); //
						 * this.afterHide(true); }, scope:menu});
						 */
						Ext.getCmp('CONTENT_AREA').removeClass('dockMENU_visible');
					}
				}
			},
			items : new Ext.Panel({
				id : 'WIDGET_CATALOGUE_OUTER',

				items : new Ext.Panel({
					id : 'WIDGET_CATALOGUE',
					border : true,
					align : 'center',
					layout : 'column',
					width : menuWidth,
					cls : 'widgetCat_menuLayout',
					listeners : {
						'afterrender' : function (catPanel)
						{
							if (this.items.length == 0)
							{
								var cacheArr = iportal.workspace.metadata.getClosedAppByLayoutId(iportal.workspace.metadata.getCurrentLayoutId());
								if (cacheArr != null && cacheArr.length > 0)
								{
									for (var i = 0; i < cacheArr.length; i++)
									{
										cacheArr[i].columnWidth = 0.33;
										iportal.jsutil.addIconToCatalog(cacheArr[i]);
									}
									if (Ext.getCmp("widgetCatOuterId") == null)
									{
										Ext.DomHelper.insertBefore("WIDGET_CATALOGUE_OUTER", {
											tag : 'div',
											id : 'widgetCatOuterId',
											cls : 'widgetCatOuterCls'
										});
									}
									Ext.getCmp("DOCK_LAYER_MENU").doLayout();

								}
							}
						}
					}

				})
			})
		});
		if(dockHasApp) {
			menu.showAt(position);
		}
		/*if(showDock || cbx.isEmpty(showDock)){
			menu.showAt(position);
		}
		else {
			setTimeout(function(){
				menu.showAt(position);
			},1000);
		}*/
		
	} 
	else
	{
		Ext.getCmp('WIDGET_CATALOGUE').fireEvent('afterrender', Ext.getCmp('WIDGET_CATALOGUE'));
		if(dockHasApp) {
			Ext.getCmp("DOCK_LAYER_MENU").showAt(position);
		}
		/*if(showDock || cbx.isEmpty(showDock)){
			Ext.getCmp("DOCK_LAYER_MENU").showAt(position);
		}else {
			setTimeout(function(){
				Ext.getCmp("DOCK_LAYER_MENU").showAt(position);
			},1000);
		}*/
	}
}
