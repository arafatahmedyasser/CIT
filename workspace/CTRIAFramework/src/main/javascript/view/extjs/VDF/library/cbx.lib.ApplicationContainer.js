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
cbx.ns("cbx.lib");
/**
 * This class contains the Ext Js specific App container component. The app container contains the workspaces.
 */
cbx.lib.ApplicationContainer = Class(cbx.core.Component, {
	/**
	 * Initializes the app container component.
	 */
	initialize : function ()
	{
		var me = this;
	/**
	* Changes made to ensure that the workspaceLayout component is built using the configuration
	* for workspaceLayout. It should either be one of the FW default workspace layouts or the implementation 
	* developer should have explicitly registered a workspace layout component
	*/
	var wsComp;
		this.masterScreenRequired = false;
		var wsLayoutComponent = CLCR.getCmp({"LAYOUT_TYPE" : "WORKSPACE_LAYOUT"});
		this.rb = {};
		var rbundle = CRB.getFWBundle();
		this.wsManager = iportal.workspace.metadata.getWorkspaceManager();
		var wsItems = this.createItems();
		this.workspaceSwitchInfo = {
					PREV_WORKSPACE_ID     : null,
					CURRENT_WORKSPACE_ID  : null
				
				};
		/*var wsComp = CLCR.getCmp({
			"LAYOUT_TYPE" : "WORKSPACE_LAYOUT",
			"LAYOUT" : iportal.preferences.getLayout()
		});*/
		if (typeof wsLayoutComponent === 'function')
		{
			wsComp = wsLayoutComponent(this.elem, wsItems);
		}
		iportal.workspace.metadata.setWorkspaceComponent(wsComp);
		this.addItem(wsComp);
		
	},

	/**
	 * Creates the workspace items to be added to the app container component.
	 */
	createItems : function ()
	{
		var itemArr = [];
		var layout = iportal.workspace.metadata.getApplicationLayout();
		var me = this;
		var isDesignSet = iportal.systempreferences.getDesignCanvasInd();
		var wsArr = iportal.workspace.metadata.getWorkspaces();
		/**
		* Master screen will be displayed based on the configuration for the appliation layout
		*/
		this.masterScreenRequired = canvas.metadata.applicationLayout.isLandingPageRequired();
		if (this.masterScreenRequired === true && (((wsArr.length>0 && isDesignSet) || (wsArr.length>1 && !isDesignSet))) || wsArr.length==0)   
		{
			var containerMaster = new iportal.workspace.container.master();
			itemArr.push(new Ext.Panel({
				title : '',
				items : [ containerMaster ],
				mode : 'local',
				height : iportal.jsutil.getContainerResizeHeight(),
				wsManager : this,
				itemId : 'MASTER_PANEL',
				bundle : this.bundle,
				afterRender : function ()
				{
					containerMaster.renderWidgets();
				},
				listeners : {
					"activate" : me.activateMaster,
					scope : me,
					"deactivate" : me.deActivateMaster
				}
			}));
		}
		for (var index = 0; index < wsArr.length; index++)
		{

			var panel = new Ext.Panel({
				height : iportal.jsutil.getContainerResizeHeight(),
				autoWidth : true,
				tabCls : 'wstab tab-icon', 
				iconCls : 'icon-' + wsArr[index].WORKSPACE_ID,
				title : cbx.isEmpty(CRB.getBundleValue(wsArr[index].BUNDLE_KEY, wsArr[index].WORKSPACE_DISPLAY_NM))
							? wsArr[index].WORKSPACE_DISPLAY_NM : CRB.getBundleValue(wsArr[index].BUNDLE_KEY,
										wsArr[index].WORKSPACE_DISPLAY_NM),
				itemId : wsArr[index].WORKSPACE_ID,
				WORKSPACE_ACTIVATE_HANDLER : wsArr[index].WORKSPACE_ACTIVATE_HANDLER,
				UPGRADE_IND : wsArr[index].WORKSPACE_UPGRADE_IND,
				SYSTEM_WORKSPACE_IND : wsArr[index].SYSTEM_WORKSPACE_IND, 
				bundle : me.bundle,
				getWidgetContainer : function ()
				{
					if (this.getComponent(0) && this.getComponent(0).parentCt
								&& this.getComponent(0).parentCt.getWidgetContainer)
					{
						return this.getComponent(0).parentCt.getWidgetContainer();
					}
				},
				listeners : {
					"activate" : me.tabSelectionHandler,
					scope : me,
					"deactivate" : me.tabDeSelectionHandler
				}
			});
			itemArr.push(panel);
		}
		// Saving the reference of the application layout, to make it available to the
		// implementation developer
		canvas.metadata.applicationLayout.setApplicationLayoutComponent(this);
		return itemArr;
	},

	/**
	 * tabSelectionHandler is fired when a workspace is selected by clicking on it. It activates the new workspace
	 */
	tabSelectionHandler : function (tabPanel)
	{
		Ext.getCmp('vpContainer').items.items[2].show();
		cbx.core.ws.metadata.setCurrentWorkspace(tabPanel);
		LOGGER.info("tabSelectionHandler", arguments, this);
		var config = {
			elem : tabPanel,
			WORKSPACE_ID : tabPanel.itemId,
			SYSTEM_WORKSPACE_IND : tabPanel.SYSTEM_WORKSPACE_IND
		
		};
		this.workspaceSwitchInfo.CURRENT_WORKSPACE_ID=config.WORKSPACE_ID;
		
		if(this.workspaceSwitchInfo.PREV_WORKSPACE_ID!=null){
		cbx.CommManager.raiseEvent('onWorkspaceSwitch',this.workspaceSwitchInfo);
		}
		/**
		 * If the WORKSPACE_ACTIVATE_HANDLER is registered for the active Workspace than call the handler registered
		 * inside canvas.globalhandlers and continue or stop the default operation as per the return value of the
		 * handler method
		 */
		if (!Ext.isEmpty(tabPanel.WORKSPACE_ACTIVATE_HANDLER))
		{
			var result = CGH.getHandler(tabPanel.WORKSPACE_ACTIVATE_HANDLER, tabPanel, true);
			if (!Ext.isPrimitive(result) || !result)
			{
				return;
			}
		}
		var headingObj = Ext.getCmp("wstitle"); 
		if (headingObj != null)
		{
			if (headingObj.html)
			{
				headingObj.html = '<div class="workspacetitle">' + tabPanel.title.toUpperCase() + '</div>';
			} else if (headingObj.body)
			{
				headingObj.body.dom.innerHTML = '<div class="workspacetitle">' + tabPanel.title.toUpperCase()
							+ '</div>';
			}
		}
		//Commenting the explicit check for application layout type
		/*var layout = iportal.workspace.metadata.getApplicationLayout();
		if (layout === "CARD")
		{
			this.activateMaster(tabPanel);
		} else if (layout === "EXCARD" /* || layout === "APP" )
		{
			this.resetCatalog();
		}
		*/
		if (tabPanel.items.length > 0)
		{
			tabPanel.getComponent(0).parentCt.renderWidgets();
		} else
		{
			var wsContainer = this.wsManager.wsSelectionHandler(config, tabPanel);
		}

	},

	/**
	 * tabDeSelectionHandler is fired when a workspace is selected by clicking on it. It activates the new workspace
	 */
	tabDeSelectionHandler : function (tabPanel)
	{
		Ext.getCmp('vpContainer').items.items[2].hide();
		LOGGER.info("tabDeSelectionHandler", arguments);
		tabPanel.removeAll(true);
		var config = {
			elem : tabPanel,
			WORKSPACE_ID : tabPanel.itemId
		};
		var headingObj = Ext.getCmp("wstitle");
		if (headingObj != null)
		{
			if (headingObj.html)
			{
				headingObj.html = '<div class="workspacetitle"></div>';
			} else if (headingObj.body)
			{
				headingObj.body.dom.innerHTML = '<div class="workspacetitle"></div>';
			}
		}
		if (tabPanel.items.length > 0)
		{
			/**
			 * creating a load mask to prevent any clicks happening before setWorkspaceChangeAcceptable has been set to
			 * true.
			 */
			var rbundle = CRB.getFWBundle();
			iportal.workspaceDestroyMask = new Ext.LoadMask(Ext.getBody(), {
				msg : rbundle.LOADING_MSG
			});
			iportal.workspaceDestroyMask.show();
			iportal.workspace.metadata.setWorkspaceChangeAcceptable(false);
			setTimeout(function ()
			{
				try
				{
					if (tabPanel)
					{
						for (var i = 0; i < tabPanel.getComponent(0).items.length; i++)
						{
							if (tabPanel.getComponent(0).items.itemAt(i).removeWidgets)
							{
								tabPanel.getComponent(0).items.itemAt(i).removeWidgets();
								tabPanel.getComponent(0).items.itemAt(i).doLayout();
							}
						}
					}
				} catch (e)
				{
					setTimeout(function ()
					{
						try
						{
							iportal.workspace.metadata.setWorkspaceChangeAcceptable(true);
						} catch (e)
						{

						}
						;
					}, 100);
					LOGGER.error("iportal.workspace.wsmanager.js\n" + e);
				}
				;
			}, 1000);
		}
		setTimeout(function ()
		{
			try
			{
				iportal.workspace.metadata.setWorkspaceChangeAcceptable(true);
			} catch (e)
			{

			}
			;
		}, 100);
		this.workspaceSwitchInfo.PREV_WORKSPACE_ID=config.WORKSPACE_ID;
		
	},

	/**
	 * 
	 */
	 //The method resetCatalog will not be used anymore after the introduction of dock model. Removed it


	/**
	 * 
	 */
	 //The method activateMaster will not be used anymore after the introduction of dock model. Removed it.
	activateMaster : function ()
	{

	},

	/**
	 * 
	 */
	deActivateMaster : function ()
	{

	}

});
/**
 * 
 */
CLCR.registerCmp({
	'COMP_TYPE' : 'APPLICATION_CONTAINER'
}, cbx.lib.ApplicationContainer);
