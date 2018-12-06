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
 * 
 */
cbx.ns('canvas.applnlayout.app');
canvas.applnlayout.app.footer = Ext.extend(Ext.Container,{
	initComponent : function(){
		var defaultConfig = {
		xtype:'container',
		height:80,
		hidden : false,
		html :' <div class="APP-workspacecatalogue"  id="workspaceCatalogContainer" ></div>',
		border : false,
		columnWidth : 1,
		layout : 'fit',
		contentEl : 'footer-copyright',
		listeners : {
			'afterrender' : function (){
				var width = this.getWidth();
				var catalog = new Ext.ux.FisheyeMenuWorkspace({
					renderTo : 'workspaceCatalogContainer',
					//id : 'WORKSPACE_CATALOGUE',
					ownerCt : this,
					hAlign : 'center', // left|center|right
					vAlign : 'top', // top|bottom
					itemWidth : 40,
					catalogWidth : width - 100,
					curveHeight : 60,
					zoom : false
				});
				//Ext.ComponentMgr.register(catalog);
				if (this.items.length == 0) {
					var canvasDockArr = CCDM.getCanvasDockItems();
					if(!cbx.isEmpty(canvasDockArr)){
						for(var i =0; i < canvasDockArr.length; i++) {
							if(canvasDockArr[i].canvasId != 'addnewworkspace') {
							var iconObj = {
										xtype : 'iportal-catalog-icon',
										iconCls : canvasDockArr[i].canvasId,
										itemId : canvasDockArr[i].canvasId,
										hidden : false,
										label : canvasDockArr[i].canvasLabel,
										scale : 'large',
										style : 'margin:20px 0px 0px 15px',
										/**
										 * Defining the handler of the iportal-catalog-icon
										 */
										myTabIndex : canvasDockArr[i].canvasIndex,
										handler : function() {
											LOGGER.info(iportal.workspace.metadata
													.getWorkspaceManager().getActiveTab());
											iportal.workspace.metadata
													.getWorkspaceManager().setActiveTab(
																this.myTabIndex);
										}
										};
							catalog.add(iconObj);
							}
							if(canvasDockArr[i].canvasId == 'addnewworkspace') {
								var iconObj = {
											xtype : 'iportal-catalog-icon',
											height : 24,
											width : 24,
											scale : 'large',
											hidden : false,
											style : 'margin:20px 0px 0px 15px',
											label : CRB.getFWBundle()['LBL_DYC'], 
											itemId : canvasDockArr[i].canvasId,
											iconCls : canvasDockArr[i].canvasId,
											handler : function() {

												CBXDOWNLOADMGR.requestScripts(cbx.downloadProvider.getMergedArray([ "APPSTORE" ]), function () 
														{
													cbx.appstore.Jsutil.initAppstore();
												});
											}
										};
								catalog.add(iconObj);
							}
						}
					}
				}
			}
		},
		
		
		};
		Ext.apply(this, defaultConfig);	
		canvas.applnlayout.app.footer.superclass.initComponent.call(this);
		}
		
	});
CLCR.registerCmp({"COMPONENT":"appfooter","APPLICATION_FW" : "EXT-JS"},canvas.applnlayout.app.footer);
