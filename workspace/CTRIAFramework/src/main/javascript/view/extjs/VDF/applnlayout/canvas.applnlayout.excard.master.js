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

Ext.namespace('canvas.applnlayout.excard.master');

var sysWSArr1 = iportal.workspace.metadata.getSystemWorkspaces();

canvas.applnlayout.excard.master = Ext.extend(Ext.Panel, {

	id : null,
	border : true,
	layout : 'table',
	cls : 'EXCARDWSPANEL',
	height : 70,
	layoutConfig : {
		columns : 16
	},
	frame : false,
	wsConf : null,
	initComponent : function ()
	{
		var that = this;
		var defaultConfig = {
			itemId : "MASTER_SCREEN",
			collapsible : false,
			items : [ this.getItems() ]
		};

		Ext.apply(this, defaultConfig);
		iportal.workspace.container.master.superclass.initComponent.apply(this);
	},

	afterRender : function ()
	{
		if (this.ownerCt != null)
			this.ownerCt.doLayout();
		iportal.workspace.container.master.superclass.afterRender.apply(this, arguments);
	},

	getItems : function ()
	{
		var rb = CRB.getFWBundle();
		var wsManager = iportal.workspace.metadata.getWorkspaceManager();
		var sysWSArr = iportal.workspace.metadata.getSystemWorkspaces();
		var wsArr = [];
		var custWSArr = [ {
			text : CRB.getFWBundle()['LBL_DYC'], 
			handler : function ()
			{
				CBXDOWNLOADMGR.requestScripts(cbx.downloadProvider.getMergedArray([ "APPSTORE" ]), function () 
							{
					cbx.appstore.Jsutil.initAppstore();
				});
			}
		} ];

		if (wsManager != null)
		{
			for (var i = 0; i < wsManager.items.length; i++)
			{
				if (sysWSArr.indexOf(wsManager.getComponent(i).itemId) > -1)
				{
					wsArr.push({
						xtype : 'iportal-excard-master-icon',
						height : 60,
						width : 60,
						scale : 'large',
						style : 'margin:2px;',
						label : wsManager.getComponent(i).title,
						iconCls : wsManager.getComponent(i).itemId,
						itemId : wsManager.getComponent(i).itemId,
						isSelected : (i === 0 ? true : false),
						myTabIndex : i,
						screenRef : this,
						handler : function ()
						{
							for (var j = 0, len = this.screenRef.items.length; j < len; j++)
							{
								if (j === this.myTabIndex)
								{
									this.screenRef.getComponent(j).setSelected(true);
								} else
								{
									this.screenRef.getComponent(j).setSelected(false);
								}
							}
							iportal.workspace.metadata.getWorkspaceManager().setActiveTab(this.myTabIndex);
						}
					});
				} else
				{
					custWSArr.push({
						text : wsManager.getComponent(i).title,
						iconCls : wsManager.getComponent(i).itemId,
						screenRef : this,
						itemId : wsManager.getComponent(i).itemId,
						myTabIndex : i,
						style : 'margin:2px;',
						handler : function ()
						{
							iportal.workspace.metadata.getWorkspaceManager().setActiveTab(this.myTabIndex);
							for (var j = 0, len = this.screenRef.items.length; j < len; j++)
							{
								if (this.screenRef.getComponent(j).itemId === 'addnewworkspace')
								{
									this.screenRef.getComponent(j).setSelected(true);
								} else
								{
									this.screenRef.getComponent(j).setSelected(false);
								}
							}
						}
					});
				}
			}
			if (iportal.systempreferences.getDesignCanvasInd())
			{ 
				wsArr.push({
					xtype : 'iportal-excard-master-icon',
					height : 60,
					width : 60,
					scale : 'large',
					label : rb.LBL_CUSTOM_WORKSPACES,// 'DESIGN YOUR CANVAS',
					iconCls : 'addnewworkspace',
					itemId : 'addnewworkspace',
					screenRef : this,
					isSelected : (i === 0 ? true : false),
					handler : function ()
					{
						var menuObj = new Ext.menu.Menu({
							items : custWSArr
						})
						menuObj.show(this.el.id);
					}
				});
			}

		}
		return wsArr;
	},
	width : 72 + (parseInt(sysWSArr1.length) * 64)

});

Ext.reg('excard-master-screen', canvas.applnlayout.excard.master);
