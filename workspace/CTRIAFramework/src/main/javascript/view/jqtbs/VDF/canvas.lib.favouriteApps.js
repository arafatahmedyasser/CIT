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

cbx.ns('ct.view');
/**
 * @className : ct.view.favAppView
 * @extends : cbx.core.Component
 * @description: This class is responsible to initate favourite app view components
 */
ct.view.favAppView = Class(cbx.core.Component,{
	
	/**
	 * @constructor
	 */
	initialize: function() {
		var me = this.md;
		this.widgetID = me.WIDGET_ID;
		this.favAppMD = canvas.metadata.appcontainer.getAppContainerMetadata([this.widgetID]);
		this.childapps = this.favAppMD.CHILD_APPS;
		this.favAppsReq = this.favAppMD.FAV_APPS_REQ_IND;
		this.render();
	},
	
	/**
	 * @member  {Method} render
	 * @memberof "ct.view.favAppView"
	 * @description  gets the config for the view and its template file.
	 */
	render : function () {
		for (var i = 0; i < this.childapps.length; i++) {
			this.childapps[i].widgetTitle = CRB.getBundleValue(this.favAppMD.BUNDLE_KEY,this.childapps[i].APP_DISPLAY_NM_KEY) ? CRB.getBundleValue(this.favAppMD.BUNDLE_KEY,this.childapps[i].APP_DISPLAY_NM_KEY) : this.childapps[i].APP_DISPLAY_NM_KEY;
		}
		var apptemplate = new ct.lib.tmplLayer('favouriteApps.cttpl',this);
		apptemplate.getTemplate(this.renderFavourite, this);
	},
	
	/**
	 * @member  {Method} renderFavourite
	 * @memberof "ct.view.favAppView"
	 * @description  renders the view of the favourite apps.
	 * @param {String} template
	 */
	renderFavourite : function (template) {
		var that= this;
		this.elem.html(template);
		
		if($('.ct-fav-app-container').find('.ct-fav-apps').length == 0) {
			$('[data-item-id="ct-fav-apps-empty-txt"]').show();
		}
		else {
			$('[data-item-id="ct-fav-apps-empty-txt"]').hide();
		}
		
		if(iportal.systempreferences.getDevice() == "D") {
			$( '[data-element-id="ct-app-icon"]' ).mouseover(function() {
				  $(this).find('[data-item-id=cross]').toggleClass( "close-hidden" );
				});
			
			$( '[data-element-id="ct-app-icon"]' ).mouseout(function() {
				  $(this).find('[data-item-id=cross]').toggleClass( "close-hidden" );
				});
		}
		else {
			$('[data-item-id=cross]').addClass("close-hidden");
		}
		
		
		$('[data-item-id=cross]').on('click', function(e) {
			e.stopPropagation();
			var elem = $(this).parents('.ct-fav-apps');
			that.closeApp($(this));

			elem.css({'-webkit-animation': 'fadeOut 0.4s', '-moz-animation': 'fadeOut 0.4s', 'animation': 'fadeOut 0.4s'});
			elem.on('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd',function() {
				elem.remove();
				if($('.ct-fav-app-container').find('.ct-fav-apps').length == 0) {
					$('[data-item-id="ct-fav-apps-empty-txt"]').show();
				}
				else {
					$('[data-item-id="ct-fav-apps-empty-txt"]').hide();
				}
	        });
			
		});
		
		$('[data-element-id="ct-app-icon"]').on('click', function() {
			for (var i = 0; i < that.childapps.length; i++) {
				if(!cbx.isEmpty(that.childapps[i]) && (this.dataset.itemId == that.childapps[i].WIDGET_ID)) {
					this.md = that.childapps[i];
					if(this.md.APP_TYPE == "FORM" && this.md.RENDERER_TYPE == "WINDOW" || this.md.APP_TYPE == "WIDGET" && this.md.RENDERER_TYPE == "WINDOW") {
						var elemConfig = {
									"eleType": "div"
								};
						var element = new cbx.lib.layer(elemConfig).getLayer();
						var widgetConfig = {
									CONTAINER_FLAG : 'N',
									'WGT_HEADER_IND' : 'Y',
									WIDGET_ID : this.md.WIDGET_ID
								};
						var config = {
									elem : element,
									PORTLET_REQ : true,
									uData : this.uData,
									ptScope: this
								};
						cbx.core.extend(config, widgetConfig);
						var appObj = new canvas.lib.app(config);
						appObj.bbutClickHandler = this.buttonHandler;
						appObj.rowDblClickHandler = this.dblClickHandler;
						/**Call portlet model window to render the portlet within it in order to display it maximized**/
						var modal = CLCR.getCmp({
							"COMP_TYPE" : "MODAL_WINDOW",
						});
						var modalConfig = {
							modalContent : element,
							modalClass : 'ct-modal__max',
							fullscreenInd : false
						};
						this.modalObj = new modal(modalConfig);
						
						LOGGER.log("WINDOW");
					} 
					else if(this.md.APP_TYPE == "FORM" && this.md.RENDERER_TYPE == "INLINE" || this.md.APP_TYPE == "WIDGET" && this.md.RENDERER_TYPE == "INLINE"){
						var workspaceID = this.md.WORKSPACE_ID;
						var workspaceDN = iportal.workspace.metadata.getWorkSpaceById(workspaceID).WORKSPACE_DISPLAY_NM;
						var workspace =	iportal.workspace.metadata.getWorkspaceManager().getContainer().workspaceDisplayName(workspaceID,workspaceDN);
						$('[data-item-id=ct-ws-title]').html(workspace);
						iportal.workspace.metadata.getWorkspaceManager().getContainer().switchWorkspace(this.md.WORKSPACE_ID,null, true);
						LOGGER.log("INLINE");
					}
					else{
						LOGGER.log("ERROR");
					}
					break;
				}
				
			}
		});
		
		$(".ct-fav-apps-scroll").mCustomScrollbar({
		    axis:"x"
		});
		
		$("[data-item-id='add-apps']").on('click', function () {
			that.initiateApp();
		});
		
	},
	
	/**
	 * @member  {Method} initiateApp
	 * @memberof "ct.view.favAppView"
	 * @description  gets all the available apps.
	 */
	initiateApp : function () { 
		var me = this;
		if(!canvas.metadata.appcontainer.getAllApps()){
			var params = {
						'INPUT_ACTION' : 'GET_APPS',
						'INPUT_FUNCTION_CODE' : 'VSBLTY',
						'INPUT_PRODUCT' : 'CUSER',
						'INPUT_SUB_PRODUCT' : 'CUSER',
						'PAGE_CODE_TYPE' : 'ALL_APPS',
						'PRODUCT_NAME' : 'CUSER'
					};
			
			cbx.ajax({
				params : params,
				success : function(response){
					var response = response;
					if(response.ALL_APPS !== "APPS_NOT_AVAILABLE"){
						canvas.metadata.appcontainer.setAllApps(response.ALL_APPS);
						var appConfig = me.getItemsForWindow();
						if(cbx.isEmpty(appConfig) && appConfig.length == 0){
							var warningdialog = new canvas.Dialog({
								dialogType: 'USERDEFINED',
								dialogStyle : 'OK',
			                    message: CRB.getFWBundleValue("LBL_APP_NOT_FOUND"),
			                    title: CRB.getFWBundleValue("LBL_MESSAGE"),
			                    okHandler : function(){
			                    	warningdialog.close();
								}
			                });
							warningdialog.show();
						}
						else{
							me.FavouriteWindow(appConfig);
						}
					}
					
				}
			});
		}
		else {
			var appConfig = me.getItemsForWindow();
			if(cbx.isEmpty(appConfig) && appConfig.length == 0){
				var warningdialog = new canvas.Dialog({
					dialogType: 'USERDEFINED',
					dialogStyle : 'OK',
                    message: CRB.getFWBundleValue("LBL_APP_NOT_FOUND"),
                    title: CRB.getFWBundleValue("LBL_MESSAGE"),
                    okHandler : function(){
                    	warningdialog.close();
					}
                });
				warningdialog.show();
			}
			else{
				me.FavouriteWindow(appConfig);
			}
		}
		
	},
	
	/**
	 * @member  {Method} getItemsForWindow
	 * @memberof "ct.view.favAppView"
	 * @description  returns the array of apps to be rendered in the favourite window.
	 * @return {Array} itemArr
	 */
	getItemsForWindow : function (){
		var that = this;
		var appContainer = $('[data-item-id="portlet-main-content"]').find('[data-item-id=' + that.widgetID + '-app-container]');
		var totalCount = canvas.metadata.appcontainer.getAllApps().length;
		var itemArr = [];
		for(i=0;i<totalCount;i++){
			var appMD = canvas.metadata.appcontainer.getAllApps()[i];
			if($(appContainer[0]).find('[data-app-id='+ appMD.APP_ID + ']').length === 0){
				itemArr.push(appMD);
			}
		}
		return itemArr;
	},
	
	/**
	 * @member  {Method} FavouriteWindow
	 * @memberof "ct.view.favAppView"
	 * @description  gets the config for rendering favourite window and its template.
	 * @param {Object} config
	 */
	FavouriteWindow : function (config) {
		this.winApps = config;
		for(i=0;i<this.winApps.length;i++){
			this.winApps[i].widgetTitle = CRB.getBundleValue(this.favAppMD.BUNDLE_KEY,this.winApps[i].APP_DISPLAY_NM_KEY) ? CRB.getBundleValue(this.favAppMD.BUNDLE_KEY,this.winApps[i].APP_DISPLAY_NM_KEY) : this.winApps[i].APP_DISPLAY_NM_KEY;
		}
		var windowTemplate = new ct.lib.tmplLayer('favouriteWindow.cttpl',this);
		windowTemplate.getTemplate(this.renderFavouriteWindow, this);
	},
	
	/**
	 * @member  {Method} renderFavouriteWindow
	 * @memberof "ct.view.favAppView"
	 * @description  renders the favourite window with available apps and has the functionality of adding apps to the container.
	 * @param {String} template
	 */
	renderFavouriteWindow : function (template){
		var that = this;
		$('body').append(template);
		$(".fav-window-container").mCustomScrollbar();
		
		$('[data-item-id="fav-win-close"]').on('click',function(){
			$('.fav-window').remove();
		});
		
		$('[data-item-id=ct-fav-apps-modal]').on('click', function ()
		{
			$(this).children().eq(0).toggleClass('ct-fav-app-checked');
		});
		
		$('[data-item-id=add-checked-fav-apps]').on('click',function(){
			var selectedApps = $(".ct-fav-app-checked");
			var myArray = [];
			for(i=0;i<that.winApps.length;i++){
				for(j=0;j<selectedApps.length;j++){
					var app = $(selectedApps[j]).parent();
					if($(app).data('appId') == that.winApps[i].APP_ID){
						var md = that.winApps[i];
						var config = md;
						config["APP_CONTAINER_ID"] = that.widgetID;
						config["APP_ID"] = that.winApps[i].APP_ID; 
						config["POSITION"] = '1';
						config["IS_FAV_APP"] = 'Y';
						myArray.push(config);
						break;
					}
				}	
			}

			if(myArray.length>0){
				var additionalParams = {
							'APP_LIST':myArray
					};
				var params = {
							'INPUT_ACTION' : 'ADD_APPS', 
							'INPUT_FUNCTION_CODE' : 'VSBLTY',
							'INPUT_PRODUCT' : 'CUSER',
							'INPUT_SUB_PRODUCT' : 'CUSER',
							'PAGE_CODE_TYPE' : 'ALL_APPS',
							'PRODUCT_NAME' : 'CUSER',
							'SELECTED_APPS':JSON.stringify(additionalParams),
							'__LISTVIEW_REQUEST' : 'Y'
					};
				
				cbx.ajax({
					params:  params,
					success : function(response) {
						var resp = response;
						if(resp.STATUS ==="SUCCESS") {
							canvas.metadata.appcontainer.setAppMetaData(resp.APP_CONTAINER_METADATA[0]);
							$('.fav-window').remove();
							that.initialize();
						}
						else {
							// TODO
						}
					}
				});
			}
		});	
	},
	
	/**
	 * @member  {Method} closeApp
	 * @memberof "ct.view.favAppView"
	 * @description  close/delete the app from the container.
	 * @param {html} dom 
	 */
	closeApp :  function (dom){
		var itemId = dom.parents('[data-app-id]').data('appId');
		var params = {
					'INPUT_ACTION' : 'DELETE_APP',
					'INPUT_FUNCTION_CODE' : 'VSBLTY',
					'INPUT_PRODUCT' : 'CUSER',
					'INPUT_SUB_PRODUCT' : 'CUSER',
					'PAGE_CODE_TYPE' : 'ALL_APPS',
					'PRODUCT_NAME' : 'CUSER',
					'APP_ID': itemId,
					'APP_CONTAINER_ID' :this.widgetID,
					'__LISTVIEW_REQUEST' : 'Y'
				}
		cbx.ajax({
			params : params,
			success : function(response){
				var resp = response;
				if(resp.STATUS ==="SUCCESS"){
					canvas.metadata.appcontainer.setAppMetaData(resp.APP_CONTAINER_METADATA[0]);
				}
				else {
					// TODO
				}
			}
		});
	}
});

CLCR.registerCmp({
	'COMP_TYPE' : 'APP',
	'VIEW_TYPE' : 'APP'
},ct.view.favAppView);