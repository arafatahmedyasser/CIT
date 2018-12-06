/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
 

cbx.ns('cbx.lib');
/*
 * This is the class helps to instantiation of the Header Class.
 * 
 * 
 */

cbx.lib.header = Class(cbx.core.Component, {
	parentElem : null,
	constructor : function(config){
		this.parentElem = config.parentElem;
		this.mapContainer = '';
		this.registerListener('favoriteicontap', this.favoriteHandleClick);
		this.registerListener('cbxlogotap', this.cbxLogoHandleClick);
		this.registerListener('alerttap', this.alertHandleClick);
		this.registerListener('notestap', this.noteHandleClick);
		this.registerListener('messagetap', this.messageHandleClick);
		this.registerListener('workspacemenutap', this.workspaceMenuHandleClick);
		this.registerListener('colorpickertap', this.colorpickerHandleClick);
		cbx.lib.header.$super.call(this,config);
		var header=this.createHeader(); 
		this.addItem(header);
	},
	/*
	 * createHeader: function() { var headerConf = { md: cbx.core.ws.metadata.getWorkspaceHeader(), parentElem: this };
	 * Start process of instantiating the header control by passing the header metadata and current object var header =
	 * new cbx.lib.view.header(headerConf); delete headerConf; return header.getHeaderDOM(); },
	 */
	
	createHeader : function(){
		
		var $continer = $('#HEADER_DIV');
		/*
		 * var headConfig={
		 * 
		 * 'eleType':'div', 'data-role':'header', 'data-position':'inline' };
		 */
		// var headConfig= new cbx.lib.layer(headConfig);
		
		/* HEADER - Quick Links */ 
		var quickLinks = {
			'eleType' : 'button',
			'type' : 'button',
			'role':"button",
			'class':"lines-button arrow arrow-left ui-btn-left ct-quicklink",
			'title' : 'Links',
			'data-enhance':"false"
		};
		var quickLinksDiv = new cbx.lib.layer(quickLinks);
		var lineConfig = {			 
			'eleType': 'span',
			"class":"lines"
		};
		var lineEle = new cbx.lib.layer(lineConfig);
		quickLinksDiv.addLayer(lineEle.getLayer());
		
		var backButton = {
			'eleType':'a',
			'href' :'#',
			'class':'backButton ui-btn-left',
			'title':'Back'
		};
		backButton = new cbx.lib.layer(backButton);
		var backImgConfig = {
			'eleType':'img',
			'src':'/iportalweb/iportal/images/header/icon_arrow_back_small.gif',
			'alt':'backLogo',
			'style':{
				'width':'19px',
				'height':'19px'
			}
		};
		backLogo = new cbx.lib.layer(backImgConfig);
		 var that=this;
		 
		 
		 /*
			 * $("#HEADER_DIV a.backButton").unbind().bind('click touchend tap', function(e){ e.preventDefault();
			 * cbx.lib.utility.navigateToPrev(); e.stopImmediatePropagation(); });
			 */
		 
		 
		 
		$continer.append(quickLinksDiv.getLayer());
		// $continer.append(backButton.getLayer());
		
		$(quickLinksDiv.getLayer()).on('click', function(e){
			
			if(iportal.workspace.metadata.getCurrentWorkspaceId() ==="ADDITIONAL_REQUEST"){
				cbx.lib.utility.navigateToPrev(e);
			}
			else{
				that.workspaceMenuHandleClick();
			}
		});
		
		/* Header LOGO */
		/* Adding loggedIn user name in Header */
		/*
		 * var headerTitle = { 'eleType' : 'h1', 'class' : 'page-headerlogo' }; headerTitle = new
		 * cbx.lib.layer(headerTitle); var logoConfig = { 'eleType': 'img',
		 * 'src':'/iportalweb/iportal/images/CBX_Logo.png', 'alt':'Logo' }; var logoConfig = new
		 * cbx.lib.layer(logoConfig);
		 */
		//var loggedInUserName = iportal.preferences.getLoggedInUserName();
		
		var workspaceId = iportal.workspace.metadata.getCurrentWorkspaceId();
		var wsMetadata = iportal.workspace.metadata.getWorkSpaceById(workspaceId);
		var wsBundleKey = wsMetadata.BUNDLE_KEY;
		var displayName = iportal.jsutil.getTextFromBundle(wsBundleKey,wsMetadata.WORKSPACE_DISPLAY_NM);
		if (this.config.preferredInitialWorkspace || this.config.preferredWorkspaces)
		{
			displayName = "";
		}
		var headerTitle = {
			'eleType' : 'h1',
			'class' : 'titleUserName',
			'html' : '<span>'+displayName+'</span>'
		};
		headerTitle = new cbx.lib.layer(headerTitle);
		
		$continer.append(headerTitle.getLayer());
		
		
		var btnDirection = "ui-btn-right";	
		if(true == iportal.preferences.isLangDirectionRTL()){
		// if(true){
			btnDirection = "ui-btn-left";
		}
		/*
		 * var iconGroup = { 'eleType' : 'div', 'class' : btnDirection, 'data-role' : 'controlgroup', 'data-type' :
		 * 'horizontal' }; iconGroup = new cbx.lib.layer(iconGroup);
		 * 
		 * var homeCon = { 'eleType' : 'a', 'href' : '#', 'data-role' : 'button', 'title' : 'Home', 'class' : 'homeLink' };
		 * homeCon = new cbx.lib.layer(homeCon);
		 * 
		 * $(homeCon.getLayer()).on('click', function(e){ cbx.lib.utility.loadInitialWorkspace(); });
		 * iconGroup.addLayer(homeCon.getLayer());
		 * 
		 * Header LOGOUT var logoutImgConfig = { 'eleType': 'a', 'href':'#', 'data-role' : 'button', 'alt':'Logo',
		 * 'class' : 'logoutLink' }; var signOutImg = new cbx.lib.layer(logoutImgConfig);
		 * 
		 * var logoutImg = { 'eleType' : 'img', 'src' : '/iportalweb/iportal/images/header/signout.png', 'alt' :
		 * 'Logout' }; logoutImg = new cbx.lib.layer(logoutImg); // signOutImg.addLayer(logoutImg.getLayer());
		 */		 
		
		var miscIconConf ={
					"eleType":"i",
					"class":"fa fa-ellipsis-v fa-2x ct-misc-icon "+btnDirection
		} 
		 var miscIcon = new cbx.lib.layer(miscIconConf).getLayer();
		$('#preferencePopup').on("popupafterclose", function( event, ui ) {
			if(canvas.headerListeners.getActiveItem()=="logout"){
				cbx.lib.utility.logoutUserWithPrompt();
			}
			else if(canvas.headerListeners.getActiveItem()=="preferences"){
				canvas.showPreferences();
			}
			canvas.headerListeners.resetActiveItem();
		});
		$(miscIcon).on('click', function(e){
             $('#miscLink').click();
		});
		
		 
		 // iconGroup.addLayer(signOutImg.getLayer());
		 $continer.append(miscIcon); 
		 
		 /**
		  * Alert Changes starts
		  */
		
		 	var rb=CRB.getFWBundle();
			var alertCon = {
						'eleType' : 'a',
						'href' : '#',
						'data-role' : 'button',
						'class' : 'alertLink ui-btn ui-shadow ui-btn-corner-all ui-btn-up-a '+btnDirection,
						'data-enhance' : false
					};
					alertCon = new cbx.lib.layer(alertCon);
					/*var alertConfig = {				 
						 'eleType': 'img',
						 'alt': rb['LBL_ALERTLOGO'],
						 'style' : {
							 'width' : '19px',
							 'height' : '19px'
						 } 
				    };				
					var alertConfig = new cbx.lib.layer(alertConfig);*/
						
					/*$("#HEADER_DIV a.alertLink").unbind().bind('click touchend tap', function(e){
						//$('.ALERTS-wsmenu').trigger('click');	
						$('.DASHBOARD_WS-wsmenu').trigger('click');	
					});	*/
					
					
					var alertcounter = {
								'eleType' : 'span',
								'class' : 'alert-counter',
								'html':'0',
								'style' : {							//STARTS CTMQ314F01
									 'display' : 'none'
								 }                                  //ENDS CTMQ314F01
					};
					alertcounter = new cbx.lib.layer(alertcounter);
					alertCon.addLayer(alertcounter.getLayer());
					$continer.append(alertCon.getLayer());
					
					
					/*$(document).on('click','.alertLink',function(e){
						cbx.CommManager.raiseEvent('Alertnotification');
						});*/
					$(alertCon.getLayer()).on('click',function(){
						cbx.CommManager.raiseEvent('Alertnotification');
					})
					
					cbx.CommManager.registerHandler('incrementAlertCount', 'canvas.count',this,function(str){
						if( !cbx.isEmpty(str) ){                                      //STARTS CTMQ314F01
							$('.alert-counter').html(str);
							if( str > 0 )
								$('.alert-counter').css("display","block");
							else
								$('.alert-counter').css("display","none");     
						}															  //ENDS CTMQ314F01
					});
		 
		 /*
			 * Header Singout Confirmation popup start here Need to change popup into cbx.lib.popup.js
			 */
		 	var appContainer = $('#app'); 
		 	var popUpContainer = {
				'eleType' : 'div',
				'data-role':'popup',
				'id' : 'signoutConfirm',
				'data-theme':'c',
				'data-shadow':'true',
				'data-corners':'true' ,
				'data-dismissible':'false',
				'data-transition':'none'
		 	};
		 	popupContainer = new cbx.lib.layer(popUpContainer);
		 	
		 	var popUpHeader = {
		 		'eleType' : 'div',
		 		'data-role' : 'header',
		 		'data-theme':'a',
		 		'html' : '<h1>Success</h1>',
		 		'role' : 'banner'
		 	};
		 	popupHeader = new cbx.lib.layer(popUpHeader);
		 	popupContainer.getLayer().appendChild(popupHeader.getLayer());
		 	
		 	var popUpContent = {
		 		'eleType' : 'div',
		 		'id' : 'content',
		 		'data-role' : 'content',
		 		'role' : 'main',
		 		'data-theme':'d'
		 		// 'html' : '<h4 style="padding:25px;">'+message+'</h4>'
		 	};
		 	popupContent = new cbx.lib.layer(popUpContent);
		 	popupContainer.getLayer().appendChild(popupContent.getLayer());
		 	var popUpFooter = {
		 			'eleType' : 'div',
			 		'data-role' : 'footer',
			 		'align' : 'center',
			 		'data-theme':'b',
			 		'html' : '<a href="#" data-role="button" data-rel="back" data-align="center">OK</a>'
		 	};
		 	popupFooter = new cbx.lib.layer(popUpFooter);
		 	popupContainer.getLayer().appendChild(popupFooter.getLayer());

		 	$.mobile.activePage.append(popupContainer.getLayer()).trigger('pagecreate');

		 	this.parentElem.append($continer);
		 	return $continer;
	 // Header Singout Confirmation popup end here
	},
	workspaceMenuHandleClick: function(evt) {
		cbx.lib.utility.openHeaderPopup();
	}
});
CLCR.registerCmp({"COMP_TYPE":"APPLICATION_HEADER","LAYOUT":"MENU"},cbx.lib.header);
canvas.headerListeners = Class(function(){
	
	 var activeItem = null;
	 function setActiveItem(item){
		activeItem = item;
	}
return {
	$singleton : true,
	constructor : function(){
		
	},
	handleClick : function(action){
		setActiveItem(action);
		$('#preferencePopup').popup('close');
	},
	getActiveItem : function(){
		return activeItem;
	},
	resetActiveItem : function(){
		setActiveItem(null);
	}
};
})
canvas.showPreferences = function (){
	CBXDOWNLOADMGR.requestScripts(cbx.downloadProvider.getMergedArray(["FORM_CONTAINER","WSPACE_PREF_FORMS"]), function ()
	{
		var fm = new cbx.form.FormManager({
			formId : "UPDATE_PREF_FORM",
			extraParams:{
				"WSLIST":iportal.workspace.metadata.getWorkspacesDetail()
				}
		});
		CBXFORMCONTAINER.getWindowByFormObj(fm, "UPDATE_PREF_FORM_CONTAINER", null);
	});
}