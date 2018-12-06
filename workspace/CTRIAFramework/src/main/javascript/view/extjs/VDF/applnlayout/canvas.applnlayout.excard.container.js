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
cbx.ns('canvas.applnlayout.excard');
/**
 * Provides a container for the ABX layout
 */
canvas.applnlayout.excard.container = Ext.extend(Ext.Panel, {
	id : null,
	bundle : CRB.getFWBundleKey(),
	height : iportal.jsutil.getContainerResizeHeight(),
	border : true,
	layout : 'border',
	cls : 'MASTER_SCREEN',
	frame : false,
	wsConf : null,
	initComponent : function() {
		this.rb = CRB.getBundle(this.bundle);
		var defaultConfig = {
			itemId : "MASTER_SCREEN",// iportal.workspace.container.master.constants.MASTER_ID,
			collapsible : false,
			items : [ this.getSkeleton() ]
		};
		Ext.apply(this, defaultConfig);
		canvas.applnlayout.excard.container.superclass.initComponent.apply(this);
	},
	afterRender : function() {
		if (this.ownerCt != null)
			this.ownerCt.doLayout();
		canvas.applnlayout.excard.container.superclass.afterRender.apply(this, arguments);
	},
	/**
	 * Method to be called by the parents for removing all the widgets contained
	 * under its child container. This method will be used for auto destroying
	 * all the widgets when the focus is moved to another workspace or inner
	 * tab. The same method will be available down hierarchy till the
	 * appropriate container of the widgets.
	 */
	removeWidgets : function() {
		this.getComponent("MASTER_CONTAINER").removeAll(true);
		// this.getComponent(1).removeWidgets();
		// updating the flag after the widgets are destroyed
		iportal.workspace.metadata.setWorkspaceChangeAcceptable(true);
	},
	/**
	 * Method to be called by the parents for re-rendering the widgets again
	 * into its container. This will be mostly used when the focus comes back to
	 * a workspace or a tab that has been loaded atleast one. The same method
	 * will be available down hierarchy till the appropriate container of the
	 * widgets.
	 */
	renderWidgets : function() {
		var wsManager = iportal.workspace.metadata.getWorkspaceManager();
		var container = this.getComponent("MASTER_CONTAINER");
		// console.info('wsManager ', wsManager);
		if (wsManager != null) {
			for ( var i = 1; i < wsManager.items.length; i++) {
				// alert("adding :
				// "+wsManager.getComponent(i).title.toUpperCase());
				container.add({
					xtype : 'iportal-master-icon',
					height : 48,
					width : 160,
					scale : 'large',
					// iconCls:'CATLOG_ICON',
					style : 'margin:10px',
					label : wsManager.getComponent(i).title.toUpperCase(),
					iconCls : wsManager.getComponent(i).itemId,
					myTabIndex : i,
					handler : function() {
						iportal.workspace.metadata.getWorkspaceManager()
								.setActiveTab(this.myTabIndex);
					}
				});
			}
		}

	},
	getSkeleton : function() {
		return [ {
			region : 'north',
			layout : 'fit',
			height : 80,
			border : false
		}, {
			region : 'east',
			layout : 'fit',
			width : 80,
			border : false
		}, {
			region : 'west',
			layout : 'fit',
			border : false,
			width : 50,
			html : '&nbsp;'
		}, {
			region : 'center',
			layout : 'column',
			cls : 'MASTER_CONTAINER',
			itemId : "MASTER_CONTAINER",// iportal.workspace.container.master.constants.CONTAINER_ID,
			width : 850,
			height : 550,
			autoScroll : true,
			defaults : {
				// style:'margin:5px',
				bodyStyle : 'padding:10px'
			},
			layoutConfig : {
				columns : 5
			},
			border : true
		}, {
			region : 'south',
			layout : 'fit',
			height : 20,
			border : false
		} ];
	}

});
Ext.reg('excard-container', canvas.applnlayout.excard.container);