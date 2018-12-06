/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */

cbx.ns("canvas.lib");
/**
 * @class canvas.lib.workspaceContainer
 * @extends "cbx.core.Component"
 * @description This class contains the workspace individual containers. Called by the wsmanager to be added to the
 *              application container. It is responsible of rendering the workspace menus and the workspace content
 */
canvas.lib.workspaceContainer = Class(cbx.core.Component, {
	/**
	 * @method initialize
	 * @memberof canvas.lib.workspaceContainer
	 * @description Initializes the workspace container.It creates the div which holds the space for the workspace and
	 *              workspace menus.It also sets the reference of the workspace container global.It also initiates the
	 *              layout manager which is responsible for arranging the apps inside the workspace container in the
	 *              following layouts
	 */
	templateContent : null,
	initialize : function ()
	{
		var me = this;

		var elem = $(this.elem).append('<div id="workspaceContainer"><div id="workspaceMenu"></div></div>').find(
					"div:first");
		$(this.elem).find("#workspaceContainer").append('<div id="breadCrumb" data-item-id="sub-workspace-container">'); 
		// data item id is used in appln layer: menu for displaying ws name in mobile
		cbx.core.ws.metadata.setCurrentWorkspace(this);
		this.setCurrentWorkspaceHeader();
		this.setCmp(elem);
		$(elem).on("remove", function ()
		{
			me.destroy();
		});

		var config = {
			elem : elem,
			WORKSPACE_ID : me.WORKSPACE_ID,
			wsMD : me.wsMD,
			uData : me.uData
		};
		this.layoutManager = new cbx.core.LayoutManager(config);
		
		this.renderWorkspaceMenus(this);

	},
	/**
	 * @method renderWorkspaceMenus
	 * @memberof canvas.lib.workspaceContainer
	 * @description This method is incharge of rendering the menus in the workpsace.It readies the metadata to required
	 *              form and then uses the template actionLayer for rendering the workpsace menus.
	 */
	renderWorkspaceMenus : function (that)
	{

		var menuItemID = eval(canvas.metadata.menu.getMenuMetaData())||[];
		for (var i = 0; i < menuItemID.length; i++)
		{
			if (!cbx.isEmpty(menuItemID[i]) && (this.WORKSPACE_ID == menuItemID[i].item_id))
			{
				menuItemID[i].bundle_key = iportal.workspace.metadata.getCurrentWorkspace().wsMD.BUNDLE_KEY;
				var tmpLayer = new ct.lib.tmplLayer('menuLayer.cttpl', menuItemID[i]);
				tmpLayer.getTemplate(this.applyTemplate, this);
			}
		}		
		
		var wsNameComponentJSON = {};
		var curentWorkspace = cbx.core.ws.metadata.getCurrentWorkspaceId();			
		var wsList = iportal.workspace.metadata.getWorkspaces();
		var bundle_key = null;
		for(var i=0; i<wsList.length; i++) {
			if(wsList[i].WORKSPACE_ID == curentWorkspace)
				bundle_key = wsList[i].BUNDLE_KEY;
		}
		var wsName = CRB.getBundleValue(bundle_key,curentWorkspace);
		if(cbx.isEmpty(wsName)) {
			wsName = curentWorkspace;
		}
		wsNameComponentJSON['WS_NAME'] = wsName;
		
		var wsMenuNameMobileLayer = new ct.lib.tmplLayer('al-menu-wsname.cttpl', wsNameComponentJSON);
		wsMenuNameMobileLayer.getTemplate(this.wsMenuNameMobileTemplate, this);

	},
	
	/**
	 * @method applyTemplate
	 * @memberof canvas.lib.workspaceContainer
	 * @description This method is incharge of appending the workspace menus in the screen after the template called
	 *              with respective metadata.
	 */
	applyTemplate : function (template, tmpClass)
	{

		var parentEle = $('#workspaceMenu');

		if ($(parentEle).empty)
		{
			$(parentEle).empty();
		}

		if (!cbx.core.isEmpty(parentEle))
		{
			$(parentEle).append(template);
		}
		this.addClickToMenu();
		
		if (iportal.preferences.getLayout() == 'MENU' || iportal.preferences.getLayout() == 'CARD') {
			$('#breadCrumb').css("paddingTop","50px");	
		}
	},
	
	wsMenuNameMobileTemplate : function (template, tmpClass) {
		
		$('[data-item-id=sub-workspace-container]').prepend(template);

	},
	setCurrentWorkspaceHeader : function(){
		var curentWorkspace=iportal.workspace.metadata.getCurrentWorkspaceId();
		var workspaceDN = iportal.workspace.metadata.getWorkSpaceById(curentWorkspace).WORKSPACE_DISPLAY_NM;
        var wsName = iportal.workspace.metadata.getWorkspaceManager().getContainer().workspaceDisplayName(curentWorkspace, workspaceDN);
		if(canvas.metadata.applicationLayout.getFooterComponentName()=='tabletopfooter' || canvas.metadata.applicationLayout.getFooterComponentName()=='appfooter'||
					canvas.metadata.applicationLayout.getHeaderComponentName()=='menuheader'){	
	        $('[data-item-id=ct-ws-title]').html(wsName);
		}
		if(canvas.metadata.applicationLayout.getHeaderComponentName()=='excardheader'){
			$('[data-item-id=ct-al__excard-ws-list] [data-selection-id]').removeClass('ct-al__excard-is_selected');
			$('[data-item-id=ct-al__excard-ws-list] [data-selection-id='+curentWorkspace+']').addClass('ct-al__excard-is_selected');
		}else if(canvas.metadata.applicationLayout.getFooterComponentName()=='tabletopfooter'){
			$('[data-item-id=ct-al__tabletop-ws-list] [data-selection-id]').removeClass('ct-al__tabletop-is_selected');
			$('[data-item-id=ct-al__tabletop-ws-list] [data-selection-id='+curentWorkspace+']').addClass('ct-al__tabletop-is_selected');
		}else if(canvas.metadata.applicationLayout.getFooterComponentName()=='appfooter'){
			$('[data-item-id=ct-al__app-ws-list] [data-selection-id]').removeClass('ct-al__app-is_selected');
			$('[data-item-id=ct-al__app-ws-list] [data-selection-id='+curentWorkspace+']').addClass('ct-al__app-is_selected');
		}else if(canvas.metadata.applicationLayout.getHeaderComponentName()=='menuheader'){
			$('[data-item-id=ct-al__menu-wslink-container] [data-selection-id]').removeClass('ct-al__menu-is-selected');
			$('[data-item-id=ct-al__menu-wslink-container] [data-selection-id='+curentWorkspace+']').addClass('ct-al__menu-is-selected');
		}
	},
	
	addClickToMenu : function () {
		
		/**Handler for multi level dropdown menu of the app tools in app header
		 * Setting the position of the third level dropdown menu
		 */
		
		var parentEle = $('#workspaceMenu');

		$(parentEle).find('ul.dropdown-menu [data-toggle="dropdown"]').on('click',function (e) { 	
    	    e.stopPropagation(); 
    	    $(this).parent().addClass('open');
	    	var windowWidth = $(window).width();    	    
	    	var prevOffset = $(this).offset();
	    	var prevWidth = $(this).width();
	    	var presentOffset = prevOffset.left + prevWidth;    	    
	    	var presentWidth = $(this).width();    	    
	    	var reqWidth = presentOffset + presentWidth;

	    	if (reqWidth > windowWidth) {
	    		$(this).parent().children('ul.dropdown-menu').css({ left:"auto" , right:"100%" });
	    		
	    		if (prevOffset.left < presentWidth) {
	    			$(this).parent().children('ul.dropdown-menu').css({ left:"auto" , right:"auto" });
	    		}
	    	}
	    	else {
	    		$(this).parent().children('ul.dropdown-menu').css({ left:"100%" , right:"100%" });
    	    }
    	});
		$(parentEle).find('a').parent().unbind().bind('click',function (e) { 
			if( ! $(e.currentTarget).hasClass('dropdown') )
			{
				var temp =  $(e.currentTarget).children("a").attr("data-item-id");
				LOGGER.log("menu click: ", temp);
				
				IWMH.executeHandler(temp, IWMC.EVENT_CLICK, {
					wsId :  cbx.core.ws.metadata.getCurrentWorkspaceId(),
					productCode : canvas.lib.menudata[temp].od_product_code,
					subProductCode : canvas.lib.menudata[temp].od_subprod_code,
					functionCode : canvas.lib.menudata[temp].od_function_code,
					containerId :  canvas.lib.menudata[temp].container_id
				});
								
				return false;
			}
    	});
	},
	/**
	 * @method getWidgetContainer
	 * @description This method is returns the reference of the widget container which the layout manager holds.
	 */

	getWidgetContainer : function ()
	{
		return this.layoutManager.widgetContainer;
	}	
});



canvas.lib.menudata={
			
};


Handlebars.registerHelper("updateMenuData", function(menuData) {	 
	canvas.lib.menudata[menuData.item_id]=menuData;
});




/**
 * 
 */
CLCR.registerCmp({
	'COMP_TYPE' : 'WORKSPACE_CONTAINER'
}, canvas.lib.workspaceContainer);
