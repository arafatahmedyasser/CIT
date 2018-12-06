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
cbx.ns('cbx.lib');

/* This class is responsible for creating the workspaces and adding to app container. 
 * And also responsible for activate the current workspace
 
 */


 
cbx.lib.workspacehandler = {
	workspacesArray: null,
	currentWorkspaceIndex: 0,
	appContainer: null,
	wsContainer: null,
	
	preventHash:false,
	
	workspacesConfigArray: null,
	
	resetPreventHashFlag : function(){
		this.preventHash = false;
	},
	setPreventHashFlag : function(flag){
		this.preventHash = flag=='Y'||flag==true?true:false;
	},
	
	createWorkspaces: function(wsArray,appContainer){
		this.appContainer = appContainer;
		this.workspacesConfigArray = wsArray;
		this.workspacesArray = {};
	
		var wsMenuContainerConfig = {
			'eleType': 'div',
			'class': 'fixed-header',
			'id': 'wscontainer',
			'data-theme':'c',
			'style' : {
				'display' : 'none'
			},
			"class":'cbx-panel-closed' 
				 						 
		};
		var wsMenuContainer = new cbx.lib.layer(wsMenuContainerConfig);
		var wsMenuPopupConfig = {
			'eleType': 'div',
			'align': 'right',
			'id': 'wspopcont'
		};
		var wsMenuPopupContainer = new cbx.lib.layer(wsMenuPopupConfig);
		var wsMenuPopupContainerLayerConfig = {
			'eleType': 'div',
			'align': 'right',
			
			'class':'ct-form-component',
			
			'id':'wswrapper',
			'style': {
				'display': 'inline-block',
				'vertical-align': 'top'
			}
		};
		var wsMenuPopupContainerLayerObj = new cbx.lib.layer(wsMenuPopupContainerLayerConfig);
		var wsMenuConfig = {
			'eleType': 'div',
			'id': 'wsmenu',
			'data-theme': 'b',
			'class': 'workspacemenus',
			'align': 'left'
		   
		};
		var wsMenu = new cbx.lib.layer(wsMenuConfig);
		var ulElementConfig = {
			'eleType': 'ul',
			'data-role': 'listview',
			'data-inset': 'true',
			'data-theme': 'e',
		
			//'class': 'header-navCls'
			'class': 'header-navCls ct-form-component'
			
		};
		
		var ulElement = new cbx.lib.layer(ulElementConfig);
		
		/**
		 * User info -- Starts
		 */
		
		var userInfoLi = new cbx.lib.layer({
			'eleType' : 'li',
			'class' : 'ui-li-has-thumb ui-first-child ct-form-component ct-user-image',
			'data-icon':'false',
			'data-theme':'a'
		});
		var userImgAnchor = new cbx.lib.layer({
			'eleType':'a',
			//'href':'#popupUserImg',
            		'href': "#",
			'data-rel':"popup",
			'data-position-to':"window",
			'data-transition':'slidedown'
			
		}) 
		var isHybrid = iportal.systempreferences.isHybrid() === "true" ? "H" : "M";

		var userImage=new cbx.lib.layer({
			'eleType':"img",
			'class' : "ct-userimage"
		});
		var userName = new cbx.lib.layer({
			"eleType" : "h3",
			"html":iportal.preferences.getLoggedInUserName()
		})
		var userInfo =new cbx.lib.layer({
			"eleType" : "p",
			"html":iportal.preferences.getLastLoginDateTime()
		});
		
		userImgAnchor.addLayer(userImage.getLayer());
		userImgAnchor.addLayer(userName.getLayer());
		userImgAnchor.addLayer(userInfo.getLayer());
		userInfoLi.addLayer(userImgAnchor.getLayer());
		ulElement.addLayer(userInfoLi.getLayer());
		var completeUserInfo = iportal.jsutil.getTextFromBundle('canvas-default','LBL_LAST_LOGIN_TEXT');
		var completeUserInfo = String.format(completeUserInfo,$(userInfo.getLayer()).html());
		$('.ct-user-name-max').html($(userName.getLayer()).html());
		$('.ct-user-info-max').html(completeUserInfo);
		$(userImgAnchor.getLayer()).on("click", function(){
			if (canvas.env.network.getState() == 'ACTIVE')
			{
				
				$("#popupUserImg").popup("open",{
					positionTo: "window",
					transition:"slidedown"
				});
			}
			else{

				var successDialog = new iportal.Dialog({ dialogType : "ERROR", 
					title : CRB.getFWBundle()['LBL_ERROR'],
					message : CRB.getFWBundle()['LBL_NETWORK_STATUS'],
					okHandler : function () { 

						successDialog.close(); } 

				});
				successDialog.show();	
			}


		});
		/**
		 * User info -- Ends
		 */
		var wsContainerConfig;
		var anchorConfig;
		var anchor;
		cbx.core.ws.metadata.pushAdditionalWorkspace();
		wsArray = this.processPreferredWorkSpaces(wsArray);
		for ( var index = 0; index < wsArray.length; index++) {
			wsContainerConfig = { 
				'workspaceID': wsArray[index].WORKSPACE_ID,
				'proportion': wsArray[index].LAYOUT_PROPORTION//,
				//"odProduct": wsArr[index].OD_PRODUCT,
				//"odSubProduct": wsArr[index].OD_SUB_PRODUCT
			};
	
		if(wsArray[index].WORKSPACE_ID != "ADDITIONAL_REQUEST" && wsArray[index].WORKSPACE_ID != "RETAIL_HOME"){
   	
			
			var liItemConfig = {
				'data-icon': 'false',
				'eleType': 'li',
				'index': index,
				
				//'class': 'ct-form-component nav-listCls'+index+ " "+wsArray[index].WORKSPACE_ID+"-wsmenu"
				//'class': 'ct-form-component nav-listCls'+index 
				'class': 'ct-form-component nav-listCls'+index+ " "+wsArray[index].WORKSPACE_ID+"-wsmenu"  
				
			};
			var liItem = new cbx.lib.layer(liItemConfig);
			var anchorConfig = {
				'eleType': 'span',
				'id': wsArray[index].WORKSPACE_ID,
				
				//'class': '',
				'class': 'ct-form-component',
				
				'html': iportal.jsutil.getTextFromBundle(wsArray[index].BUNDLE_KEY,wsArray[index].WORKSPACE_DISPLAY_NM),
				'index': index
			};
			var anchor = new cbx.lib.layer(anchorConfig);
			liItem.addLayer(anchor.getLayer());
			templiItem = liItem.getLayer();
			var that = this;
			templiItem.onclick = function(event){
				/*starts CTMQ215F15 */
				$('#wsmenu ul li').removeClass('activeWorkspace');
				$(this).addClass('activeWorkspace');
				/*starts CTMQ215F15 */
				var wsId = $(this).children().attr('id');
				that.activateWorkspace(wsId);
            	
				$('#wscontainer').panel('close');
							
				
			};
			liItem.setLayer(templiItem);
			ulElement.addLayer(liItem.getLayer());

		}
		var workspaceContainerConfig = {
				"eleType": "div",
				"id" : wsArray[index].WORKSPACE_ID,
				"class": "workspace",
				"style": {
					"display":"none",
					"height":"100%"
				}
			};
			var wcContainerObject =  new cbx.lib.layer(workspaceContainerConfig).getLayer();
			//this.wsContainer = new cbx.lib.workspaceContainer(wsContainerConfig);
			$(this.appContainer.getItem(0)).append($(wcContainerObject));
			this.workspacesArray[wsArray[index].WORKSPACE_ID] = wcContainerObject;
		}
		wsMenu.addLayer(ulElement.getLayer());
		wsMenuPopupContainerLayerObj.addLayer(wsMenu.getLayer());
		wsMenuPopupContainer.addLayer(wsMenuPopupContainerLayerObj.getLayer());
		wsMenuContainer.addLayer(wsMenuPopupContainer.getLayer());
		/*document.getElementById('CONTENT_DIV').appendChild(wsMenuContainer.getLayer());*/
		document.getElementById('app').appendChild(wsMenuContainer.getLayer());
		/*
		 * User image Caching First, checking the cache whether the user image data is present or not.If not,then loads
		 * the data of new image from the server and also stores into the cache. While reloading or moving to the next
		 * workspaces,user image will be fetched and displayed from the cache using the last modified value.
		 */
		var cachedFlag = false;
		canvas.metadata.getMetaData("USER_IMAGE", "USER_IMAGE", function (metadatavalue)
		{
			if (!cbx.isEmpty(metadatavalue))
			{
				try
				{
					var cachedMetadata = cbx.decode(metadatavalue);
					cachedFlag = true;
					var me = this;
					var imgSrc = cachedMetadata.imageData;
					$('.ct-maximize-userimg').attr('src', imgSrc);
					$('.ct-userimage').attr('src', imgSrc);
					if (cachedMetadata.imageData && cachedMetadata.lastModified && canvas.env.network.getState() == 'ACTIVE')
					{
						var uploadServletUrl = iportal.systempreferences.isHybrid() === "true" ? getDomainUrl()
									+ "PictureUploadServlet?" : "./PictureUploadServlet?";
						var upload_params = {
							imgHandle : 'GET_USER_IMAGE',
							INPUT_ACTION : 'PICTURE_PROCESS_ACTION',
							INPUT_FUNCTION_CODE : 'VSBLTY',
							INPUT_SUB_PRODUCT : 'CUSER',
							PAGE_CODE_TYPE : 'PICTURE_PROCESS',
							PRODUCT_NAME : 'CUSER',
							isHybrid : isHybrid,
							lastModified : cachedMetadata.lastModified,
							timeout : new Date()
						};
							cbx.ajax({
								type : 'json',
								params : upload_params,
								url : uploadServletUrl,
								success : function (metadata)
								{
									$('.ct-maximize-userimg').attr('src', me.imgSrc);
									$('.ct-userimage').attr('src', me.imgSrc);
									var status = metadata.response.STATUS;
									if (status == 'NEW')
									{
										var lastModified = metadata.response.lastModified;
										var imageSource = metadata.response.imageData;
										$('.ct-maximize-userimg').attr('src', imageSource);
										$('.ct-userimage').attr('src', imageSource);
										setTimeout(function ()
										{
											try
											{
												canvas.metadata.storeMetaData("USER_IMAGE", {
													id : "USER_IMAGE",
													value : {
														imageData : metadata.response.imageData,
														lastModified : metadata.response.lastModified
	},
													serverdatetime : metadata.response.SERVER_SYNCTIME
												});
											} catch (e)
											{
												LOGGER.error('Error  ', e);
											}
										}, 100);
									}
								},
								error : function ()
								{
									LOGGER.error("Error while loading response", arguments);
								}
							});
					}
				} catch (e)
				{
					LOGGER.error('Error', e);
					cachedFlag = false;
				}
			}
			if (!cachedFlag && canvas.env.network.getState() == 'ACTIVE')
			{
				var uploadServletUrl = iportal.systempreferences.isHybrid() === "true" ? getDomainUrl()
							+ "PictureUploadServlet?" : "./PictureUploadServlet?";
				var upload_params = {
					imgHandle : 'GET_USER_IMAGE',
					INPUT_ACTION : 'PICTURE_PROCESS_ACTION',
					INPUT_FUNCTION_CODE : 'VSBLTY',
					INPUT_SUB_PRODUCT : 'CUSER',
					PAGE_CODE_TYPE : 'PICTURE_PROCESS',
					PRODUCT_NAME : 'CUSER',
					isHybrid : isHybrid,
					timeout : new Date()
				};
				cbx.ajax({
					type : 'json',
					params : upload_params,
					url : uploadServletUrl,
					success : function (metadata)
					{
						var lastModified = metadata.response.lastModified;
						var imageSource = metadata.response.imageData;
						$('.ct-maximize-userimg').attr('src', imageSource);
						$('.ct-userimage').attr('src', imageSource);
						setTimeout(function ()
						{
							try
							{
								canvas.metadata.storeMetaData("USER_IMAGE", {
									id : "USER_IMAGE",
									value : {
										imageData : metadata.response.imageData,
										lastModified : metadata.response.lastModified
									},
									serverdatetime : metadata.response.SERVER_SYNCTIME
								});
							} catch (e)
							{
								LOGGER.error('Error ', e);
							}
						}, 100);
					},
					error : function ()
					{
						LOGGER.error("Error while loading response", arguments);
					}
				});
			}
		}, this);
	},
	/**
	 * API which will be called by workspace switchers to activate a worspace
	 * This will also 
	 */
	activateWorkspace : function(workspaceId,index,callBackFn,scope,hashingRequired){
		if(cbx.isNumber(index)){
			/*starts CTMQ215F15 */
			if(index == 0){
				$('#wsmenu ul li').eq( index+1 ).addClass('activeWorkspace');
			}	
			/*ends CTMQ215F15 */
			var tempWSConfigObj = this.workspacesConfigArray[index];
			workspaceId = tempWSConfigObj.WORKSPACE_ID
		}
		if(iportal.systempreferences.isNavigationEnabled()){
			hashingRequired = cbx.isEmpty(hashingRequired) || hashingRequired==true?"Y":"N";
			var url = hashingRequired=="Y"?workspaceId:'';
			var dataObj = {
					"workspaceId":url,
					"index":index,
					"scope":scope,
					"hashingRequired":hashingRequired
			};
		}
		$.mobile.navigate('#'+url,dataObj);
	cbx.lib.workspacehandler.createWorkspace(workspaceId,index,callBackFn,scope);
	},
	//activateWorkspace: function(workspaceId,index,callBackFn,scope){
	createWorkspace: function(workspaceId,index,callBackFn,scope){
		/**
		 * Active Workspace Hightlight
		 * When user use Gotoworkspace , Menu Navigation , Hashing Navigation
		 * Change Log : CTMQ314F04
		 */
		if(!cbx.isEmpty(workspaceId)){
			$('#wsmenu ul li').removeClass('activeWorkspace');
			$("span#"+workspaceId+"").parent("li").addClass('activeWorkspace');
		}
		
		if(workspaceId != "ADDITIONAL_REQUEST")
		{
		var wrkspcMd = iportal.workspace.metadata.getWorkSpaceById(workspaceId);
		var wrkspcTitle = iportal.jsutil.getTextFromBundle(wrkspcMd.BUNDLE_KEY,wrkspcMd.WORKSPACE_DISPLAY_NM);
		$('.titleUserName').children().text(wrkspcTitle);
		}
		cbx.lib.utility.performUtilityOperations(); 
	
		callBackFn = cbx.isFunction(callBackFn)?callBackFn:cbx.emptyFn;
		scope = scope?scope: this;
		var SYSTEM_WORKSPACE_IND = 'Y';
		if(cbx.isNumber(index)){
			var tempWSConfigObj = this.workspacesConfigArray[index];
			workspaceId = tempWSConfigObj.WORKSPACE_ID
			SYSTEM_WORKSPACE_IND= tempWSConfigObj.SYSTEM_WORKSPACE_IND
		}
		var currentWorkspace = cbx.core.ws.metadata.getCurrentWorkspaceId();
		if(currentWorkspace){
			$(cbx.core.ws.metadata.getCurrentWorkspace().getWidgetContainer().portal.getItem(0)).empty();
			var tempCurrentWSContainer = this.workspacesArray[currentWorkspace];
			tempCurrentWSContainer.style.display = "none";
			scope["PREV_WS"] = currentWorkspace;
		}
	
		var config = {
				WORKSPACE_ID:workspaceId,
				SYSTEM_WORKSPACE_IND:SYSTEM_WORKSPACE_IND
		};
		scope["CURR_WS"] = workspaceId;
		scope["PREV_WS_OBJ"] = cbx.core.ws.metadata.getCurrentWorkspace();
		cbx.core.ws.metadata.getWorkspaceManager().wsSelectionHandler(config,null,function(wsContainer){
			wsContainer.prevWs = this.PREV_WS
			if(this.PREV_WS == this.CURR_WS && this.CURR_WS== "ADDITIONAL_REQUEST"){
				wsContainer.prevWs = this.PREV_WS_OBJ.prevWs;
			}
			cbx.core.ws.metadata.setCurrentWorkspace(wsContainer);
			callBackFn.apply(scope,[wsContainer]);
			if($.mobile.activePage){
				$.mobile.activePage.trigger('create');
				$.mobile.activePage.trigger('pagecreate');
			}
			
			if(this.CURR_WS=="ADDITIONAL_REQUEST"){
				//$('.ct-quicklink').removeClass('lines-button')
				$('.ct-quicklink').addClass('ct-back-btn');
				$('#FOOTER_DIV').hide();
			}
			else{
				$('.ct-quicklink').removeClass('ct-back-btn');
				$('.ct-quicklink').addClass('lines-button')
				$('#FOOTER_DIV').show();
			}
			cbx.lib.utility.resizeContentDiv();
			
			/*$("#carouselParent").roundabout({
				tilt: -5,
				minScale: 0.8,
				minOpacity: 1,
				duration: 1000,
				easing: 'easeOutQuad',
				//triggerFocusEvents:true,
				enableDrag: true,
				responsive: true,
				dropEasing: 'easeOutBack'
			}, function() {	
				$(this).fadeTo(500, 1);
			});*/
		},scope);//this.workspacesArray[workspaceIndex];
		//$(tempActivateWSContainer.getItem(0)).empty();
		//cbx.core.ws.metadata.setCurrentWorkspaceId(tempActivateWSContainer.workspaceID);
		//this.currentWorkspaceIndex = workspaceIndex;
		/* Get all the child widgets of the current activate workspace with help of layout manager 
		var widgets = tempActivateWSContainer.getWorkspaceWidgets().widgetsArray;
		if(typeof widgets !== 'undefined') {
			for ( widget = 0; widget < widgets.length; widget++ ) {
				widgets[widget].requestMd();
			}
		}
		*/
		/* Get all the layoutmanager of the current workspace and start process  of creating the widget container and widgets creation */
		//var layoutManager = tempActivateWSContainer.getLayoutManagerObject();
	},
	setWorkspaces: function(workspacesArray){
		this.workspacesArray = workspacesArray;
	},

	/**
	 * @Method processPreferredWorkSpaces
	 * @description Filters the existing workspaces array by a set of preferred workspace Ids
	 * @param {Array} wsArr List of workspaces to be filtered.
	 * @return {Array} Filtered workspace
	 */
	processPreferredWorkSpaces : function (wsArr)
	{
		var workSpaceIdsStringObj = this.appContainer.wsManagerConfig.preferredWorkspaces;
		var workSpaceIdsArr = (!canvas.isEmpty(workSpaceIdsStringObj)) ? workSpaceIdsStringObj.split("|") : [];
		var workSpaceObjArr = [];
		var wsArrTemp = [];
		// Return if there is no preferred Workspaces set
		if (canvas.isEmpty(workSpaceIdsStringObj) || canvas.isEmpty(workSpaceIdsArr))
		{
			return wsArr; // Return the original Array
		}
		for (var i = 0; i < workSpaceIdsArr.length; i++)
		{
			var wsObj = cbx.core.ws.metadata.getWorkSpaceById(workSpaceIdsArr[i]);
			if (!canvas.isEmpty(wsObj))
			{
				workSpaceObjArr.push(wsObj);
			}
		}
		for (var i = 0; i < wsArr.length; i++)
		{
			for (var j = 0; j < workSpaceObjArr.length; j++)
			{
				if (wsArr[i] === workSpaceObjArr[j] || wsArr[i].WORKSPACE_ID == "ADDITIONAL_REQUEST")
				{
					wsArrTemp.push(wsArr[i]);
				}
			}

		}
		return (canvas.isEmpty(wsArrTemp)) ? wsArr : wsArrTemp; // Return the processed Array

	}
};