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
m

 */

/**

 * This class is intended to render contents to the footer region of the

 * application in the excardlayout.

 */

cbx.ns('canvas.applnlayout.excard');
canvas.applnlayout.excard.footer = Ext.extend(Ext.Container,{
	initComponent : function(){
		var defaultConfig = {
					//id : 'WIDGET_CATALOGUE_OWNER',
					height:90,
					xtype : 'container',
					cls :'WIDGET_CATALOGUE_OWNER',
					hidden : false,
					html : '<div class="EXCARD-widgetcatalogue"  id="widgetCatalogContainer"></div>',
					border : false,
					columnWidth : 1,
					layout : 'fit',
					listeners : {
						'afterrender' : function (){
							var width = this.getWidth();
							if(iportal.preferences.getStrExcardLayoutFooterType()=="APP")
							{
								var catalog = new Ext.ux.FisheyeMenu({
									renderTo : 'widgetCatalogContainer',
									//id : 'WIDGET_CATALOGUE',
									ownerCt : this,
									hAlign : 'center', // left|center|right
									vAlign : 'top', // top|bottom
									itemWidth : 40,
									catalogWidth : width - 100,
									curveHeight : 60,
									zoom : false,
									items : []
								});
							}	
							else {
								var catalog = new Ext.ux.TabletopMenuWorkspace({
									renderTo : 'widgetCatalogContainer',
									//id : 'WIDGET_CATALOGUE',
									ownerCt : this,
									hAlign : 'center',
									vAlign : 'bottom',
									itemWidth : titemwidth,
									catalogWidth : width - 30,
									curveHeight : 44,
									zoom : false
									
								});
							}
								
							
							//Ext.ComponentMgr.register(catalog);
							if (this.items.length == 0) {
								var cacheArr = iportal.workspace.metadata.getCatalogCache();
								if (cacheArr != null && cacheArr.length > 0) {
									for ( var i = 0; i < cacheArr.length; i++) {
										iportal.jsutil.addIconToCatalog(cacheArr[i]);
									}
								}
							}
						}
					}
		};
		Ext.apply(this, defaultConfig);	
		canvas.applnlayout.excard.footer.superclass.initComponent.call(this);
	}
	
});
// registering this region handler
CLCR.registerCmp({"COMPONENT":"excardfooter","APPLICATION_FW" : "EXT-JS"},canvas.applnlayout.excard.footer);