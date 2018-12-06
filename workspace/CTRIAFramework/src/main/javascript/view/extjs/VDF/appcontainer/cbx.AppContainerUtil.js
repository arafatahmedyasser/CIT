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

Ext.namespace("cbx.AppContainerUtil");

cbx.AppContainerUtil = function() {
	return {

		goToWorkspace : function(wsId, layoutId, appId, serviceId, config) {

			if (iportal.workspace.metadata.getCurrentWorkspaceId() !== wsId
					&& cbx.AppContainerUtil.isValidWorkspace(wsId)) {
				var tab = iportal.workspace.metadata.getWorkspaceManager().items
						.get(wsId);
				if (tab) {
					iportal.workspace.metadata.getWorkspaceManager().activate(tab);
					if (layoutId) {
						cbx.AppContainerUtil.doTimeoutForWsLoad(wsId, layoutId,
								appId, serviceId, config);
					}
				}
			} else if (iportal.workspace.metadata.getCurrentWorkspaceId() == wsId) {
				cbx.AppContainerUtil.doTimeoutForWsLoad(wsId, layoutId, appId,
						serviceId, config);
			}
		},
		doTimeoutForWsLoad : function(wsId, layoutId, appId, serviceId, config) {
			var t;
			if (wsId !== iportal.workspace.metadata.getCurrentWorkspaceId()) {
				t = setTimeout(function() {
					cbx.AppContainerUtil.doTimeoutForWsLoad(wsId, layoutId,
							appId, serviceId, config);
				}, 500);
			} else {
				cbx.AppContainerUtil.timeLayoutLoad(layoutId, appId, serviceId,
						config);
			}
		},
		isValidWorkspace : function(wsId) {
			var workspaces = iportal.workspace.metadata.getWorkspaces();
			for (i = 0; i < workspaces.length; i++) {
				if (workspaces[i].WORKSPACE_ID === wsId) {
					return true;
				}
			}
			return false;
		},
		isValidLayout : function(layoutId) {
			var wsId = iportal.workspace.metadata.getCurrentWorkspaceId();
			var wsMeta = iportal.workspace.metadata.getWorkSpaceById(wsId);
			if (wsMeta.CHILD_LAYOUTS) {
				for ( var i = 0; i < wsMeta.CHILD_LAYOUTS.length; i++) {
					if (wsMeta.CHILD_LAYOUTS[i].LAYOUT_ID === layoutId) {
						return true;
					}
				}
			}
			return false;
		},
		isValidWidget : function(lId, widId) {
		
			if(widId){
				var layout = iportal.workspace.metadata.getUpdatedLayoutDef(lId);
				for ( var i = 0; i < layout.CHILD_WIDGETS.length; i++) {
					if (layout.CHILD_WIDGETS[i].WIDGET_ID === widId) {
						return true;
					}
		
				}
			}
			return false;
		},
		isValidView : function(widget) {
			var viewId = IMM.getDefaultView(widget);
			if (viewId) {
				var vmd = IMM.getView(viewId);
				
				if (IMM.isListView(vmd) || IMM.isAppView(vmd)) {
					return [true,vmd.VIEW_MD.FLD_VIEW_TYPE];
				}
			}
			return [false,""];
			

		},
		displayAppInAWindow : function(appId) {
			var config = {
				'WIDGET_ID' : appId,
				isClosed : false,
				isParentPortlet : true,
				isLoadingToolsInside : true,
				height : 400
				
			};
			var widget = iportal.jsutil.initiateWidget(config);
			if(widget){
				var window = new Ext.Window({
					width : 500,
					modal : true,
					items : [ widget.mv ],
					tools : [ {
						
						id : 'pin',
						
						qtip : 'More..',
						
						hidden : false,
						
						handler : function(event, toolEl, panel, tc) {
							
							var widgetMv = panel.getComponent(0);
							
							if (widgetMv.getToolsMenuItems) {
								
								var menu = widgetMv.getToolsMenuItems();
								
								if (menu) {
									
									menu.show(this.id);
									
								}
								
							}
							
						}
					
					}, {
						
						id : 'close',
						
						handler : function(event, toolEl, panel, tc) {
							
							try {
								
								Ext.WindowMgr.getActive().close();
								
							} catch (err) {
							}
							
						}
					
					} ]
				});
				window.show();
			}
		},
		
		//Removed displayAppInline API
	
		launchService : function(wsId, layoutId, appId, serviceId, config) {
			if (wsId !== null) {
				cbx.AppContainerUtil.goToWorkspace(wsId, layoutId, appId,
						serviceId, config);
			}
			/*
			 * if(iportal.workspace.metadata.getCurrentWorkspaceId() === wsId){
			 * cbx.AppContainerUtil.timeLayoutLoad(layoutId,appId,serviceId,config) }
			 */

		},
		
		timeLayoutSwitch: function(layoutId, appId,serviceId,config){
			if(iportal.workspace.metadata.getWorkspaceChangeAcceptable()===false){
				var t = setTimeout(function() {
					cbx.AppContainerUtil.timeLayoutSwitch(layoutId, appId,serviceId,config);
				}, 500);
			}
			else{
				if (cbx.AppContainerUtil.isValidWidget(layoutId, appId)) {
					var layout = iportal.workspace.metadata.getCurrentWorkspace().find('itemId', layoutId)[0]; 
					var widget = layout.find('itemId', appId)[0];
					if (widget) {
						cbx.AppContainerUtil.timeGridLoad(widget,
								serviceId, config);
					
					} 
					else {
						return;
					}
				}
				else if(config.customLauncher){
					var configObj = {};
					configObj.widgetId = config.widgetId?config.widgetId:null;
					if(config.appWidget){
						configObj.appWidget = config.appWidget;
					}
					if(!configObj.widgetId){
						delete configObj.widgetId;
						delete configObj.appWidget;
					}
					config.customLauncher(configObj);
					
				}
			}
		},
		
		timeLayoutLoad : function(layoutId, appId, serviceId, config) {
			var t;
			if (iportal.workspace.metadata.getWorkspaceChangeAcceptable() == false) {

				t = setTimeout(function() {
					cbx.AppContainerUtil.timeLayoutLoad(layoutId, appId,
							serviceId, config);
				}, 300);
			} else {
			
				if (cbx.AppContainerUtil.isValidLayout(layoutId)) {
					var layout = iportal.workspace.metadata
							.getCurrentWorkspace().find('itemId', layoutId+ "_LAYOUT_CONTAINER");
					if (layout.length > 0) {
						layout = layout[0];
						layout.loadingMode = 'A';
						//LOGGER.info('Load mode set to A');
						var tabPanel = iportal.workspace.metadata.getCurrentWorkspace().findByType('tabpanel');
						if (tabPanel.length > 0) {
							var lContainer = null;
							for ( var j = 0; j < tabPanel.length; j++) {
								if (tabPanel[j].items.containsKey(layout.itemId)) {
									lContainer = tabPanel[j];
								}
							}
							
							if (lContainer !== null && lContainer.activeTab.itemId !== layout.itemId) { // added null condition
								lContainer.setActiveTab(layout);
								
							}
						}
						cbx.AppContainerUtil.timeLayoutSwitch(layoutId, appId,serviceId,config)
					
					} else {
						return;
					}
				}

			}
		},
		
		doAppSelection : function(widget, service, config){
			var viewSpecs = cbx.AppContainerUtil.isValidView(widget.itemId);
			var isValidView = viewSpecs[0];
			var viewType = viewSpecs[1];
			var cAppId = iportal.workspace.metadata.getContextApp(widget.LAYOUT_ID);
			var layout = iportal.workspace.metadata.getCurrentLayout();
			var cApp = layout.find('itemId', cAppId)[0];
			if (isValidView) {
				switch(viewType){
				case "CLASSIC_GRID":
					var grid = widget.find('xtype', 'simplelivegrid')[0];
					if (grid && grid.store.isLoaded() === true) {
						
						
						if (cApp && grid.store.getCount()>0) {  
							/*
							 * var loadMask = new Ext.LoadMask(Ext.getBody(),
							 * {msg:"Loading Service..Please wait"});
							 */
							var rb = CRB.getFWBundle();
							
							
							if (typeof cApp.getEl() == 'object') {							
								cApp.getEl().mask(rb['LBL_FORM_CONTAINER_LOADER'])
								.addClass('app-container-lmask');
							}
							
							
							var rowIndex = 0;
							var record = null;
							if (config
									&& typeof config.recordSelect === 'function') {
								record = grid.store
								.queryBy(config.recordSelect);
								if (record && record.getCount() > 0) {
									record = record.itemAt(0);
									rowIndex = grid.store.indexOf(record);
									
									grid.getSelectionModel()
									.selectRow(rowIndex);
									grid.fireEvent('cellclick', grid, rowIndex, 0,Ext.EventObject,false);
								} else {
									grid.getSelectionModel().selectFirstRow();
									
									grid.fireEvent('cellclick', grid, 0, 0,Ext.EventObject,false);
									
								}
							}
							else if(config && cbx.isNumber(config.recordSelect)){
								grid.getSelectionModel().selectRow(config.recordSelect);
								grid.fireEvent('cellclick', grid, config.recordSelect, 0,Ext.EventObject,false);
							}
							
							/*else{
									grid.getSelectionModel().selectFirstRow();
									grid.fireEvent('cellclick', grid, 0, 0,Ext.EventObject);
								
								}*/
							
							else {
								
								var recConfig=CGH.getHandler(widget.itemId); // treating  widget.itemId as APP id
								var myIndex=0;
								if(!cbx.isEmpty(recConfig)){
									var indexRows=0;
									for(indexRows=0;indexRows<grid.store.totalLength;indexRows++){
									if(grid.store.data.items[indexRows].data[recConfig['COLUMN_ID']]==recConfig['COLUMN_VALUE']){
									myIndex=indexRows;
									break;
									}
									
									}
									grid.getSelectionModel().selectRow(myIndex);
									grid.fireEvent('cellclick', grid, myIndex, 0,Ext.EventObject);
									CGH.registerHandler(widget.itemId,null);
									    
								
								}
								else{
									grid.getSelectionModel().selectFirstRow();
									grid.fireEvent('cellclick', grid, 0, 0,Ext.EventObject);
								
								}
								
							}
							cbx.AppContainerUtil.timeContextAppLoad(service,cApp,grid.view_id);
						} else {
							return;
						}
					} else {
						t = setTimeout(function() {
							cbx.AppContainerUtil.doAppSelection(widget, service,
									config);
						}, 300);
					}
					break;
				case "APP":
					var viewId = IMM.getDefaultView(widget.itemId);
					var appContainer;
					var app = widget.find('name', 'app-container_'+viewId)[0];
					if(app){
						appContainer = app.find('name','app-container-north')[0];
					}
					if(appContainer && service){
						var serviceObj = appContainer.find('itemId',service)[0];
						if(cApp && cApp.getCurrentViewObj()&& cApp.getCurrentViewObj().rendered == true){
							if(serviceObj){
								this.appClickHandler.apply(serviceObj);
							}
						}
						else{
							cApp.getCurrentViewObj().on('afterRender',function(){
								if(serviceObj){
									this.appClickHandler.apply(serviceObj);
								}	
							},this,[serviceObj])
						}
					}	
					break;
				}
				
			}
		},
		timeGridLoad : function(widget, service, config) {
			var t;
			if (widget.rendered === false) {
				var scope = {
						widget : widget,
						service : service,
						config : config
				}
				widget.on('afterrender',function(){
					cbx.AppContainerUtil.doAppSelection(this.widget, this.service, this.config);
				},scope);
			}
			else{
				cbx.AppContainerUtil.doAppSelection(widget, service, config);
			}

			
		},
		timeContextAppLoad : function(serviceId, cApp,viewId) {
			if (cApp.find('name', 'content-panel').length<1 || cApp.find('name', 'content-panel')[0].itemId != viewId+"_content-panel"){
					var t = setTimeout(function() {
						cbx.AppContainerUtil.timeContextAppLoad(serviceId, cApp,viewId);
				}, 300);
			} else {
				var contentPanel = cApp.find('name', 'content-panel')[0];
				var service = contentPanel.find('itemId', serviceId)[0];
				if (service) {
				
					service.handler.apply(service.scope, [service.scope,Ext.EventObject,service], true);
					//service.handler.call(service.scope,service,Ext.EventObject);
				
				} else {
					cApp.getEl().unmask();
					return; 
				}
			}
			
		},
		appCloseHandler : function(evt,img,panel){
			var rb = CRB.getFWBundle();
			var buttonScrollPanel = this.findParentByType('buttonscrollpanel');
			var loadMask = new Ext.LoadMask(buttonScrollPanel.getEl(), {msg:rb['LBL_SYNC_APPS']});
			loadMask.show();
			this.ownerPanel = buttonScrollPanel;
			var appViewPanelSelector = function(comp){
	    		if(comp.itemId && comp.itemId ==='APP_VIEW_PANEL'){
	    			return true;
	    		}
	    	}
	    	var appViewPanel = buttonScrollPanel.findParentBy(appViewPanelSelector);
	    	var appContainerId = appViewPanel.widgetId;
	    	
			var params = {
					'INPUT_ACTION' : 'DELETE_APP',
					'INPUT_FUNCTION_CODE' : 'VSBLTY',
					'INPUT_PRODUCT' : 'CUSER',
					'INPUT_SUB_PRODUCT' : 'CUSER',
					'PAGE_CODE_TYPE' : 'ALL_APPS',
					'PRODUCT_NAME' : 'CUSER',
					'APP_ID': this.itemId,
					'APP_CONTAINER_ID' :appContainerId,
					'__LISTVIEW_REQUEST' : 'Y'
				}
				Ext.Ajax.request({
					params : params,
					scope : this,
					success : function(response, request) {
						var resp = Ext
								.decode(response.responseText);
						var resp = Ext
						.decode(response.responseText);
						var rb = CRB.getFWBundle();
						if(resp.STATUS ==="SUCCESS"){
							canvas.metadata.appcontainer.setAppMetaData(resp.APP_CONTAINER_METADATA[0]);
							this.getEl().ghost('b', {
							    easing: 'easeOut',
							    scope : this,
							    duration: .5,
							    callback : function(){
							    	var ownerPanel = this.ownerCt;
							    	ownerPanel.remove(this);
							    	/*var appViewPanelSelector = function(comp){
							    		if(comp.itemId && comp.itemId ==='APP_VIEW_PANEL'){
							    			return true;
							    		}
							    	}
							    	var appViewPanel = ownerPanel.findParentBy(appViewPanelSelector);
							    	var appContainerId = appViewPanel.widgetId;*/
							    	ownerPanel.doLayout();
							    	this.ownerPanel.getEl().unmask();
							    }
							});
						}
						else{
							cbx.AppContainerUtil.showErrorWin(rb);
							this.ownerPanel.getEl().unmask();
						}
					},
					failure : function(result, request) { 
						app.ownerPanel.getEl().unMask();
					}
				});
			
			evt.stopPropagation();
			
			
		},
		showErrorWin : function(rb){

			var err_Dialog = new iportal.Dialog({

				dialogType : 'ERROR',

				title : rb['LBL_ERROR'],

				message : rb["LBL_APP_ERR_MSG"],

				okHandler : function (){

					err_Dialog.close();

				}

			});

			err_Dialog.show();

		
		},
		attachAppConfigurations : function(app){
			
			/**
			 * IE8 issue : The el getting hidden was not the actual el
			 */
			var img = '<div class="removeapp"></div>';
			var btnDiv = app.getEl().select('div.appicon-wrap');
			var parentEl = app.getEl().first().first().first().first();
			
			/**
			 * Getting the actual el after creating the child and hiding it
			 */
			app.closeImage = parentEl.createChild(img);
			app.closeImage.setVisible(false);
			var overFn = function(){
				this.setVisible(true,true);
			};
			var outFn = function(){
				this.setVisible(false,true);
			};
			btnDiv.hover(overFn,outFn,app.closeImage);
		
			app.closeImage.on('click',cbx.AppContainerUtil.appCloseHandler,app);
			//cbx.AppContainerUtil.attachAppClickHandlers(btnDiv);
			btnDiv.on('click',cbx.AppContainerUtil.appClickHandler,app);
			//this.closeImg = new EL(this.body.dom.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0]);
			
		},
		appClickHandler : function(target){
			var config ={};
			var md = this.md?this.md:this.scope.metadata;
			var selector = ACHR.getHandler(md.APP_ID);
			if(md.APP_TYPE === "FORM" && md.RENDERER_TYPE ==="INLINE"){
				if(selector){
					config.recordSelect = selector();
				}
				cbx.AppContainerUtil.launchService(md.WORKSPACE_ID,md.LAYOUT_ID,md.WIDGET_ID,md.SERVICE_ID,config);
			}
			else if(md.APP_TYPE === "FORM" && md.RENDERER_TYPE ==="WINDOW"){
			
				if(selector){
					config.customLauncher = selector;
				}
				cbx.AppContainerUtil.launchService(md.WORKSPACE_ID,md.LAYOUT_ID,null,null,config);

				/*else {
					CBXFORMCONTAINER.getWindow("CONTAINER_FUND_TRANSFER");
				}*/
				//cbx.AppContainerUtil.launchService(md.WORKSPACE_ID,md.LAYOUT_ID,md.WIDGET_ID,md.FORM_ID,config);
			}
			else if(md.APP_TYPE === "WIDGET" && md.RENDERER_TYPE ==="INLINE"){
				var appLauncher = function(config){
					config.renderTo = "INLINE";	
					cbx.core.dynamicWidgetManager(config);
				};
				if(selector){
					var additionalParams = selector();
					if(additionalParams && additionalParams.appWidget){
						config.appWidget = additionalParams.appWidget;
					}
				}
				
				config.customLauncher = appLauncher;
				config.widgetId = md.WIDGET_ID;
				cbx.AppContainerUtil.launchService(md.WORKSPACE_ID,md.LAYOUT_ID,md.WIDGET_ID,null,config);
			
			}
			
			else if(md.APP_TYPE === "WIDGET" && md.RENDERER_TYPE ==="WINDOW"){
				var evt = arguments[0];
				cbx.AppContainerUtil.displayAppInAWindow(md.WIDGET_ID,evt);
			}
			else {
				if(selector){
					config.recordSelect = selector();
				}
				cbx.AppContainerUtil.launchService(md.WORKSPACE_ID,md.LAYOUT_ID,md.WIDGET_ID,null,config);
		
			}
			
		}

	};

}();