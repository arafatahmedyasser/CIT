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
 * This class is intended to render contents to the footer region of the
 * application in the cardlayout.
 */
cbx.ns('canvas.applnlayout.card');
canvas.applnlayout.card.footer = Ext.extend(Ext.Panel,{
	initComponent : function(){
		var defaultConfig = {
		xtype:'panel',
		items:[
		   	{
		   	xtype:'container',
		   	html:'<div class="floatingbanner" width=></div>',
		   	id:'floatIcon'
		   	}
		   	],
		   	id:'floaterIconPanel'
		};
		Ext.apply(this, defaultConfig);	
		canvas.applnlayout.card.footer.superclass.initComponent.call(this);
		var catalog=null;
		if(!catalog){
			catalog = new iportal.Window({
		      id:'footerWin',
			   cls:'footerWin',
		      layout:'column',
			   animCollapse:true,
				width:700,								
				closable:false,
				header:false,
				frame:false,
		      autoHeight:true,
		      plain: true,
			   shadow:false,
		      items: [
		      		{
		      			//id : 'WIDGET_CATALOGUE_OWNER',
		      			xtype : 'container',
		      			cls : 'cardwidgetcatalog-con',
		      			//hidden : true,
		      			html : '<div class="cardwidgetcatalogue"><table cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td align="left" width="22"><div class="cardwidgetcatalogue_left"></div></td><td  class="cardwidgetcatalogue_mid"><div class="widgetcatlContainer" id="widgetCatalogContainer"></div></div></td><td align="right" width="22"><div class="cardwidgetcatalogue_right"></td></tr></table></div>',
		      			border : false,
		      			columnWidth : 1,
		      			layout : 'fit',
		      			/*style: {											
		      	            height: '90px'									
		      	        },	*/
		      			listeners : {
		      				'afterrender' : function (){
		      					var obj = new Ext.Container(
		      								{
		      									//id : 'WIDGET_CATALOGUE',
		      									border : true,							
		      									renderTo : 'widgetCatalogContainer',
		      									buttonAlign : 'center',
		      									align : 'center',
		      									layout : 'table',
		      									width : 656,							
		      									layoutConfig : {
		      										columns : 100
		      									},
		      									collapsible : false, 
		      									autoScroll : true,						
		      									collapsed : false
		      								});
		      					 CCDM.getInstance().on('appdocked',function(dockItem){
		      				    	var iconArr = this.find("itemId", dockItem.itemId);
		      				    	if(iconArr!=null && iconArr[0] != null ){
		      				    		iconArr[0].show();
		      						}
		      				    	else {
		      				    		isHomeIcon = (dockItem && dockItem.isHomeIcon === 'Y' ) ? true : false;
		      				    		if(!isHomeIcon){
		      				    			appIconObj = {
		      				    						xtype : 'iportal-catalog-icon',
		      				    						iconCls : dockItem.id,
		      				    						itemId : dockItem.id,
		      				    						hidden : false,
		      				    						label : dockItem.label,
		      				    						scale : 'large',
		      				    						handler : function() {
		      				    							var widgetContainer = iportal.workspace.metadata.getCurrentWorkspace().getWidgetContainer();
		      				    							IMM.markWidgetOpened(dockItem.id);
		      				    							iportal.workspace.metadata.updateWidgetDef(iportal.workspace.metadata.getCurrentLayoutId(), dockItem.id, {
		      				    								CLOSED_IND : 'N'
		      				    							});
		      				    							CCDM.removeIconFromAppDock(dockItem.id);
		      				    							widgetContainer.addWidget(dockItem.id);
		      				    						}
		      				    					}
		      				    		}
		      				    		else {
		      				    			appIconObj = {
		      				     						xtype : 'iportal-catalog-icon',
		      				    						iconCls : 'master',
		      				    						itemId : "MASTER_ICON",
		      				    						hidden : false,
		      				    						scale : 'large',
		      				    						label : 'HOME',
		      				    						handler : function() {
		      				    							iportal.workspace.metadata.getWorkspaceManager().activate("MASTER_PANEL");
		      				    						}
		      				     			}
		      				    		}
		      				    		this.add(appIconObj);
		      				    	}
		      				    	this.doLayout();
		      				    },obj);
		      					CCDM.getInstance().on('appundocked',function(itemId){
		      				    	this.remove(itemId);
		      				    },obj);
		      					CCDM.getInstance().on('removeall',function(){
		      				    	this.removeAll(true);
		      				    },obj);
		      				},
		      				
		      				'beforerender' : function (){
		      					var applnLayoutItems = canvas.metadata.applicationLayout.getApplicationLayoutComponent().getItem(0);//.getItem(1).itemId
		      					var masterPanel = {};
		      					var workspacePanel = {};
		      					
		      					if(!cbx.isEmpty(applnLayoutItems)){
		      						for(var i=0;i<applnLayoutItems.items.length;i++){
		      							if(applnLayoutItems.getItem(i).itemId == 'MASTER_PANEL'){
		      								masterPanel = applnLayoutItems.getItem(i);
		      								masterPanel.on('beforerender', function(){
		      									var floaterPanel = Ext.get('floaterIconPanel');
		    			    					floaterPanel.hide();
		    		      					});
		      							}
		      							else {
		      								workspacePanel = applnLayoutItems.getItem(i);
		      								workspacePanel.on('beforerender', function(){
		      									var masterFloatingWin = Ext.getCmp('footerWin');
		      									var floaterPanel = Ext.get('floaterIconPanel');
		      									floaterPanel.show();
		      									Ext.getCmp('floatIcon').el.on('mouseover', function ()
		      											{
		      											masterFloatingWin.show(this);
		      											});
		    		      					});
		      								}
		      						}
		      					}
		      					
		      					}
		      			
		      			}
		      	
		      		}],
			   animateTarget:'floaterIconPanel',
			   style: {									
		           //height: '90px'						
		       },										
			   showAnimDuration:.5
		  });
		}
		catalog.show();
		catalog.hide();
		Ext.getBody().on('click',function(){
		if(arguments[0].target.id!='WIDGET_CATALOGUE1' && arguments[0].target.className!='floatingbanner')
			if(!cbx.isEmpty(Ext.getCmp('footerWin'))){
				Ext.getCmp('footerWin').hide();
			}
		Ext.getCmp('vpContainer').doLayout();
		});
	}
		
});

CLCR.registerCmp({"COMPONENT":"cardfooter","APPLICATION_FW" : "EXT-JS"},canvas.applnlayout.card.footer);