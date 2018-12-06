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
 * @namespace "canvas.lib"
 * @description This component is currently responsible for the Appdock which holds and rebuilds the widget.
 */
canvas.lib.appdock = Class(cbx.core.Component, {
	/**
	 * @class "canvas.lib.appdock"
	 * @description The constructor gets the parent element and homebutton config
	 */
	constructor : function (config)
	{
		this.dockparentContainer = config.parent;
		this.homeButton = config.homeButton;
		this.createDock();
	},
	/**
	 * @method createDock
	 * @memberof "canvas.lib.appdock"
	 * @description This method is responsible for creating the empty appdock and registertring click function.
	 */
	createDock : function ()
	{
		//this.cancelButton=CRB.getFWBundleValue("LBL_CLOSE") || 'Cancel';
		this.emptyMsg = CRB.getFWBundleValue("LBL_EMPTYDOCK");
		var tmpLayer = new ct.lib.tmplLayer('appDockEmpty.cttpl',this);
		tmpLayer.getTemplate(this.readyDock, this);
		this.getClicked();
	},
	/**
	 * @method applyTemplate
	 * @memberof "canvas.lib.appdock"
	 * @description This method is responsible for rendering the template to the appdock content.
	 */
	applyTemplate : function (template, tmpClass)
	{

		$('.ct-app-dock__content').append(template);
		this.refreshNotification();
	},
	/**
	 * @method getClicked
	 * @memberof "canvas.lib.appdock"
	 * @description This method is responsible for rebilding the apps that are closed in the appdock and also for going
	 *              back to master screen (when home button is clicked).
	 */
	getClicked : function ()
	{
		var that = this;

		$(this.dockparentContainer).on('click', 'a[data-item-type=\'miniapp\']', function (e)
		{
			e.preventDefault();
			var appId = $(this).attr("data-item-id");
			var appObj=iportal.workspace.metadata.getAppDock();
			appObj.toggleDock(e);
			
			if ("MasterLayout" == appId)
			{
				$("#HEADER_DIV").find("span[data-item-id='ct-workspace__name']").empty();
				$("#HEADER_DIV").find('[data-item-id=ct-ws-title]').html("CANVAS TECHNOLOGY");
				$("#HEADER_DIV").addClass("ct-al-card__home-page").removeClass("ct-al-card__ws-page");
				
				appObj.hideAppDock();
				var homeWorkspaceId = iportal.workspace.metadata.getWorkspaces()[0].WORKSPACE_ID;
				iportal.workspace.metadata.getWorkspaceManager().getContainer().switchWorkspace(homeWorkspaceId);
			} else
			{
				appObj.removeApp(appId);
				iportal.workspace.metadata.getCurrentWorkspace().getWidgetContainer().addApps(appId);
				if(!$(".ct-app-dock__content").children().hasClass('ct-app-dock__each')){
					$('.notify').css("display","block");
					
				}

			}			
		});
	},
	/**
	 * @method removeApp
	 * @memberof "canvas.lib.appdock"
	 * @description This method is responsible for removing the rebuild app from the dock and from the cache
	 */
	removeApp : function (appId)
	{
		var elem = $('.ct-app-dock__content').find('a[data-item-id='+appId+']').parent();
		$(elem).remove();
		this.refreshNotification();
		var cache = iportal.workspace.metadata.getCatalogCache();
		for (var i = 0; i < cache.length; i++)
	{
			if (cache[i].WORKSPACE_ID == iportal.workspace.metadata.getCurrentWorkspaceId()
						&& cache[i].ITEM_ID == appId)
				cache.splice(i, 1);
		}
	},
	refreshNotification: function(){
		var home=$('.ct-app-dock__content').find('a[data-item-id=MasterLayout]').parent();
		var length=$('.ct-app-dock__content').children().not(home).length;
		$('.ct-app-dock__notification').html(length);
	},
	/**
	 * @method cleanDock
	 * @memberof "canvas.lib.appdock"
	 * @description This method is responsible for emptying the dock when it gets loaded at first and during switches in
	 *              workspaces.
	 */
	cleanDock : function ()
	{
		var home=$('.ct-app-dock__content').find('a[data-item-id=MasterLayout]').parent();
		var $items=$('.ct-app-dock__content').children().not(home).remove();
		this.refreshNotification();
	},
	/**
	 * @method dockItems
	 * @memberof "canvas.lib.appdock"
	 * @description This method is responsible for showing the items in dock.
	 */
	dockItems :function(){
		var home=$('.ct-app-dock__content').find('a[data-item-id=MasterLayout]').parent();
		var $items=$('.ct-app-dock__content').children().not(home);
		return $items;
	},
	/**
	 * @method addAppItem
	 * @memberof "canvas.lib.appdock"
	 * @description This method is responsible for adding items to the appdock when they are closed.
	 */
	addAppItem : function (appItem)
	{

		var tmpLayer = new ct.lib.tmplLayer('appdock.cttpl', appItem);
		tmpLayer.getTemplate(this.applyTemplate, this);
		
			
			$('.notify').css("display","none");
		

	},
	/**
	 * @method showAppDock
	 * @memberof "canvas.lib.appdock"
	 * @description This method is responsible for displaying the appdock when widgets are loaded and ready.
	 */
	showAppDock : function ()
	{
		$('#ct-dock').show();
	},
	/**
	 * @method hideAppDock
	 * @memberof "canvas.lib.appdock"
	 * @description This method is responsible for hiding the appdock in the master screen.
	 */
	hideAppDock : function ()
	{
		$('#ct-dock').hide();
	},
	/**
	 * @method readyDock
	 * @memberof "canvas.lib.appdock"
	 * @description This method is responsible for preparing the dock and adding the listeners and home button if
	 *              necessary.
	 */
	readyDock : function (template, tmpClass)
	{
		$(this.dockparentContainer).append(template);
		$('#ct-dock').find('[data-item-id="clicker"]').on('click',function(){
			$('.ct-app-dock__container').addClass('ct-app-dock__open ct-app-dock__animate-down');
			$('.ct-app-dock__content').addClass('ct-app-dock__content-open');
			
			
			if(document.body.scrollHeight > $(window).height()+1)
			{ $('body').addClass('ct-app-dock__dock-open-body');// to fix the 17 px glith while switching the scrollbar visiblity
				$('#HEADER_DIV').children().children().addClass('ct-app-dock__dock-open-header');
				$('#FOOTER_DIV').find('[data-item-id=ct-copyrights]').addClass('ct-app-dock__dock-open-footer');
			}
			
			$('.ct-app-dock__overlay').addClass('ct-app-dock__overlay-show');
			$('body').addClass('ct-app-dock__dock-open');
		});
		
		$('#ct-dock').find('.ct-app-dock__overlay').on('click',this.toggleDock);
		$('#ct-dock').find('.ct-app-dock__cancel').on('click',this.toggleDock);
		if (this.homeButton)
		{
			var homeButton = {
				ITEM_ID : "MasterLayout",
				ITEM_TITLE : CRB.getFWBundleValue("LBL_MASTER_LABEL")
			};
			this.addAppItem([ homeButton ]);
			this.hideAppDock();
		}
	},
	/**
	 * @method toggleDock
	 * @memberof "canvas.lib.appdock"
	 * @description This method is responsible for dynamic resizing of the dock margin during togle.
	 */
	toggleDock : function (e)
	{
		
		e.stopPropagation();
		$('body').removeClass('ct-app-dock__dock-open ct-app-dock__dock-open-body');
		$('#HEADER_DIV').children().children().removeClass('ct-app-dock__dock-open-header');
		$('#FOOTER_DIV').find('[data-item-id=ct-copyrights]').removeClass('ct-app-dock__dock-open-footer');
		$('#ct-dock').find('.ct-app-dock__overlay').removeClass('ct-app-dock__overlay-show');
		$('#ct-dock').find('.ct-app-dock__content').removeClass('ct-app-dock__content-open');
		$('#ct-dock').find('.ct-app-dock__container').removeClass('ct-app-dock__open');
	},
			

});
CLCR.registerCmp({
	"COMP_TYPE" : "APPDOCK"
}, canvas.lib.appdock);
