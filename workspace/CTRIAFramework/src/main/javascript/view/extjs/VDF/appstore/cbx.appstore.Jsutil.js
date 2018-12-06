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

Ext.ns('cbx.appstore');


/**
 * @class cbx.appstore.Jsutil

 * @returns Ext.util.Observable class
 * This class is the static class whose methods can be called without creating object of it.
 * This class is the utility class for interacting with the Appstore. its the entry point of the Appstore.
 * This class contains three methods : 
 *			1) initAppstore   - This method is to initialize the appstore.
 *								This method is called from Add Tab button in tab layout and Add Workspace(Front Screen) in card layout. 
 *			2) updateAppstore - This method is to update the existing workspace. (The workspaces that has been created by Appstore).
 *								This method is called from menus of the user created workspace - Other Services.
 *			3) deleteAppstore - This method is to delete the existing workspace. (The workspaces that has been created by Appstore).
 *								This method is called from menus of the user created workspace - Other Services.
 */

cbx.appstore.Jsutil = function() {

	return Ext.apply(new Ext.util.Observable, {

		/** initAppstore - Step 1 : Initialize the appstore manager  (cbx.appstore.Manager)
		 *                 Step 2 : Create an Ext.Window with maximum height/width of the browser available.
		 *                 Step 3 : Get the reference of the panel in which appstore is rendered by the method getAppsView and 
		 *							add has an item to the window.
		 *                 Step 4 : Add a button for Create Workspace and call the method save in appstore manager for saving. 
		 *                 Step 5 : Show the window.
		 */

		initAppstore : function() {
			var appsmanager = new cbx.appstore.Manager();
			
			var rb = CRB.getFWBundle();

			var win = new iportal.Window({
				rawTitle : rb.LBL_CREATE_APPS,
				width : Ext.lib.Dom.getViewWidth()-25,
				height : Ext.lib.Dom.getViewHeight()-25,
				modal : true,
				resizable  :false,
				plain : true,
				autoScroll : false,
				items : appsmanager.getAppsView(),
				bbar : [ {
					text : rb.LBL_CREATE,
					cls:'portal_pos_btn',
					handler : function() {
						appsmanager.save();
					}
				},{
					xtype: 'tbfill'
				},{
					text :  rb.LBL_CANCEL,
					cls:'portal_neg_btn',
					handler : function() {
						win.close();
					}
				} ]
			});
			
			win.show();

		},

		/**updateAppstore- Step 1 : Initialize the appstore manager  (cbx.appstore.Manager) with the current workspace id 
		 * 							(The workspace that has to be updated).
		 *                 Step 2 : Create an Ext.Window with maximum height/width of the browser available.
		 *                 Step 3 : Get the reference of the panel in which appstore is rendered by the method getAppsView and 
		 *							add has an item to the window.
		 *                 Step 4 : Add a button for Update Workspace and call the method save in appstore manager for updating. 
		 *                 Step 5 : Show the window.
		 */

		updateAppstore : function() {

			var appsmanager = new cbx.appstore.Manager({
				workspaceId : iportal.workspace.metadata.getCurrentWorkspaceId()
			});
			
			var rb = CRB.getFWBundle();

			var win = new iportal.Window({
				rawTitle : rb.LBL_UPDATE_APPS,
				width : Ext.lib.Dom.getViewWidth()-5,
				height : Ext.lib.Dom.getViewHeight()-5,
				modal : true,
				resizable  :false,
				plain : true,
				autoScroll : false,
				items : appsmanager.getAppsView(),
				bbar : [ {
					text : rb.LBL_UPDATE,
					cls:'portal_pos_btn',
					handler : function() {
						appsmanager.save();
					}
				},{
					xtype: 'tbfill'
				}, {
					text : rb.LBL_CANCEL,
					cls:'portal_neg_btn',
					handler : function() {
						win.close();
					}
				} ]
			});
			win.show();

		},

		/**deleteAppstore- Step 1 : Initialize the appstore manager  (cbx.appstore.Manager) with the current workspace id 
		 * 							(The workspace that has to be updated) and a property remove as true.
		 *                 Step 2 : Create an Ext.Window.
		 *                 Step 3 : Get the reference of the panel in which appstore is rendered by the method getAppsView and 
		 *							add has an item to the window.
		 *                 Step 4 : Add a button for Remove Workspace and call the method remove in appstore manager for deletion. 
		 *                 Step 5 : Show the window.
		 */

		deleteAppstore : function() {

			var appsmanager = new cbx.appstore.Manager({
				workspaceId : iportal.workspace.metadata.getCurrentWorkspaceId(),
				remove    : true
			});
			
			var rb = CRB.getFWBundle();

			var win = new iportal.Window({
				rawTitle : rb.LBL_DELETE_APPS,
				width : 300,
				height : 100,
				modal : true,
				resizable  :false,
				plain : true,
				autoScroll : false,
				items : appsmanager.getAppsView(),
				bbar : [ {
					text : rb.LBL_REMOVE,
					cls:'portal_pos_btn',
					handler : function() {
						appsmanager.remove();

					}
				},{
					xtype: 'tbfill'
				}, {
					text : rb.LBL_CANCEL,
					cls:'portal_neg_btn',
					handler : function() {
						win.close();
					}
				} ]
			});
			win.show();

		}

	});
}();

