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
 
cbx.ns("canvas.lib");
/**
 * This class contains the Ext Js specific App container component. The app container contains the workspaces.
 */
canvas.lib.AppContainer = Class(cbx.core.Component,{			
	/**
	 * Initializes the app container component.
	 */
	initialize : function() {
		var me = this;
		this.rb = {};
		this.wsManager = cbx.core.ws.metadata.getWorkspaceManager();
		var elem = $(this.elem).append(
				'<span class="applicationContainer"></span>').find(
				"span:first");
		this.setCmp(elem);
		elem.on("remove", function() {
			me.destroy();
		});
	},
	
	/**
	 * 
	 */
	activateCurrentWorkspace : function() {
		var me = this;
		var wsArr = cbx.core.ws.metadata.getWorkspaces();
		if (wsArr.length > 0) {
			config = {
				elem : this.getCmp(),
				appContainerConfig : this,
				WORKSPACE_ID : wsArr[0].WORKSPACE_ID,
				proportion : wsArr[0].LAYOUT_PROPORTION,
				wsMD : wsArr[0],
				SYSTEM_WORKSPACE_IND:wsArr[0].SYSTEM_WORKSPACE_IND
			};
			this.wsManager.wsSelectionHandler(config);
		}
	},
	
	/**
	 * Creates the workspace items to be added to the app container
	 * component.
	 */
	createTabs : function() {
		var me = this;
		var wsArr = cbx.core.ws.metadata.getWorkspaces();
		var title = "";
		var aRef = null;
		for ( var index = 0; index < wsArr.length; index++) {
			title = me.rb[wsArr[index].WORKSPACE_DISPLAY_NM] == null ? wsArr[index].WORKSPACE_DISPLAY_NM
					: me.rb[wsArr[index].WORKSPACE_DISPLAY_NM];
			aRef = (me.subNav).append(
					'<a href="javascript:void(0)" '
							+ (index == 0 ? "class='active'" : "")
							+ '>' + title + '</a>').find('a')[index];
			aRef = $(aRef);
			if (wsArr[index].WORKSPACE_ACTIVATE_HANDLER) {
				aRef.attr("WORKSPACE_ACTIVATE_HANDLER",
						wsArr[index].WORKSPACE_ACTIVATE_HANDLER);
			}
			aRef.attr("ITEM_ID", wsArr[index].WORKSPACE_ID);
			aRef.data('wsMD', wsArr[index]);
		}
		me.subNav.find("a").bind('click', {
			scope : me
		}, me.tabSelectionHandler);

	},
	
	/**
	 * 
	 */
	handleWSChange : function(evtObj) {
		var me = evtObj.data.scope;
		var currActive = $(me.subNav.find('a:.active'));
		currActive.removeClass('active');
		me.tabDeSelectionHandler(currActive);
		$(this).addClass('active');
		me.tabSelectionHandler($(this));
	},
	
	/**
	 * tabSelectionHandler is fired when a workspace is selected by
	 * clicking on it. It activates the new workspace
	 */
	tabSelectionHandler : function(evtObj) {
		var me = evtObj.data.scope;
		var elem = $(this);
		var config = {
			elem : me.canvas,
			WORKSPACE_ID : elem.attr('ITEM_ID'),
			wsMD : elem.data('wsMD')
		};
		cbx.HashManager.setHash({
			'WORKSPACE_ID' : config.WORKSPACE_ID
		});
	},
	/**
	 * tabDeSelectionHandler is fired when a workspace is selected by
	 * clicking on it. It activates the new workspace
	 */
	tabDeSelectionHandler : function(elem) {
		this.canvas.empty();
	},
	/**
	 * 
	 */
	indexOfWorkspaceId : function(wsId) {
		var wsArr = cbx.core.ws.metadata.getWorkspaces();
		for ( var index = 0; index < wsArr.length; index++) {
			if (wsArr[index].WORKSPACE_ID === wsId) {
				return index;
			}
		}
		return -1;
	},
	/**
	 * 
	 */
	switchWorkspace : function(wsId, uData) {
		var me = this;
		var wsArr = null;
		var index = me.indexOfWorkspaceId(wsId);
		if (index !== -1) {
			wsArr = cbx.core.ws.metadata.getWorkSpaceById(wsId);
			if ($(this.getCmp()).empty) {
				$(this.getCmp()).empty();
			}
			var config = {
				elem : this.getCmp(),
				appContainerConfig : this,
				WORKSPACE_ID : wsId,
				wsMD : wsArr,
				uData : uData,
				SYSTEM_WORKSPACE_IND:wsArr.SYSTEM_WORKSPACE_IND
			};
			this.wsManager.wsSelectionHandler(config);
		}
	}
});
/**
 * 
 */
CLCR.registerCmp({'COMP_TYPE':'APPLICATION_CONTAINER'}, canvas.lib.AppContainer);
