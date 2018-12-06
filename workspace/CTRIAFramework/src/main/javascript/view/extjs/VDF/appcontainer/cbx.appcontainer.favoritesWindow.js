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

/**
 * 
 * DEPLOY_MODULE_ID:
 * 
 */

Ext.ns('cbx.appContainer');
cbx.appContainer.favoritesWindow = function() {

	return {
		showFavoritesWindow : function() {
			var rb = CRB.getFWBundle();
			
			var favWindow = new Ext.Window({
				rb : rb,
				scope : this,
				modal : true,
				resizable : true,
				title : rb['LBL_APP_MASTER'],
				//bodyStyle:'background-color:#000;',
				closable : true, 
				//autoDestroy : false,
				selectedAppArray : [],
				//autoScroll:true,
				tools : [{

					id : 'help',
					handler : function (toolObj, event){
						
						var helpFile = 'appmaster_help.htm';
					    iportal.jsutil.helpHandler(helpFile);
				        }
				}
				        ],
				layout : 'fit',
				bbar :this.favoriteAppActionBtn(), 
				width : 450,
				height : 500,
				listeners : {
					'initiateApp' : function(comp) {
						if (!canvas.metadata.appcontainer.getAllApps()) {
							var comp = comp;
							var params = {
								'INPUT_ACTION' : 'GET_APPS',
								'INPUT_FUNCTION_CODE' : 'VSBLTY',
								'INPUT_PRODUCT' : 'CUSER',
								'INPUT_SUB_PRODUCT' : 'CUSER',
								'PAGE_CODE_TYPE' : 'ALL_APPS',
								'PRODUCT_NAME' : 'CUSER'
							}
							Ext.Ajax.request({
								params : params,
								scope : this,
								success : function(response, request) {
									var 
									resp = Ext
											.decode(response.responseText);
									if(resp.ALL_APPS !== "APPS_NOT_AVAILABLE"){
									
										canvas.metadata.appcontainer.setAllApps(resp.ALL_APPS);
								
										var appItems = cbx.appContainer.favoritesWindow.getItemsForWindow(this);
										if(!cbx.isEmpty(appItems) && appItems.items.length==0){
											
											var cmRb = CRB.getFWBundle();
											var warningMsg = new iportal.Dialog({											
												dialogType : 'ERROR',
												title : cmRb.LBL_MESSAGE,
												message : cmRb.LBL_APP_NOT_FOUND,
												okHandler : function (){
													warningMsg.close();
												}

											});
											warningMsg.show();
											return;
										}else{
											this.show();
										}
										//for(var i=0;i<appItems.length;i++){
										this.add(appItems);
										//}
										this.doLayout();
									}
									else{
										var rb = CRB.getFWBundle();
										this.update(rb["LBL_APP_NOT_FOUND"]);
									}
								},
								failure : function(result, request) {

								}
							});
						}
						else{
							var appItem = cbx.appContainer.favoritesWindow.getItemsForWindow(this);
							if(!cbx.isEmpty(appItem) && appItem.items.length==0){								
								var cmRb = CRB.getFWBundle();
								var warningMsg = new iportal.Dialog({											
									dialogType : 'ERROR',
									title : cmRb.LBL_MESSAGE,
									message : cmRb.LBL_APP_NOT_FOUND,
									okHandler : function (){
										warningMsg.close();
									}
								});
								warningMsg.show();
								return;
							}else{
								this.show();
							}
							//for(var i=0;i<appItems.length;i++){
								this.add(appItem);
							//}
							this.doLayout();
						}
					
					},
					'beforeclose': function(window){
						window.activeAppContainer.isActiveAppContainer = false;
					}
				
				}
			});
			
			favWindow.addEvents('initiateApp');
			favWindow.fireEvent('initiateApp',favWindow,favWindow);
		},
		favoriteAppActionBtn : function (){
			var rb = CRB.getFWBundle();			
			var posBtn= iportal.preferences.getPostiveBtnAlign();
			var negBtn= iportal.preferences.getNegativeBtnAlign();
			var buttonArray = new Array();
			var addSelectedAppBtn = {
					cls : 'portal_neg_btn',
					text : rb['LBL_ADD_APPS'],
					handler : function(){
						
						var win  = this.findParentByType('window');
						var selectedApps = win.find('checked',true);
						var unCheckedApps = win.find('checked',false);
						var position = 0;
							
						for(var i=0;i<selectedApps.length;i++){
							var app = selectedApps[i];
							var favAppLength = win.activeAppContainer.getFavoritesPanel().items.length;
							var defaultAppsLength = win.activeAppContainer.ownerCt.getDefaultApps().length;
							var appPosition = defaultAppsLength+favAppLength+1;
							position = position === 0?appPosition:appPosition+1;//Since an app would be added ahead of this app
							var updateConf = app.md;
							updateConf["APP_CONTAINER_ID"] = win.activeAppContainer.ownerCt.widgetId;
							updateConf["APP_ID"] = app.itemId; 
							updateConf["POSITION"] = position;
							updateConf["IS_FAV_APP"] = 'Y';
							win.selectedAppArray.push(updateConf);
						}
						
						if(win.selectedAppArray.length>0){
							var additionalParams = {
									
									'APP_LIST':win.selectedAppArray
							};
							var loadMask = new Ext.LoadMask(win.getEl(), {msg:win.rb['LBL_SYNC_APPS']});
							loadMask.show();
							var params = {
									'INPUT_ACTION' : 'ADD_APPS', 
									'INPUT_FUNCTION_CODE' : 'VSBLTY',
									'INPUT_PRODUCT' : 'CUSER',
									'INPUT_SUB_PRODUCT' : 'CUSER',
									'PAGE_CODE_TYPE' : 'ALL_APPS',
									'PRODUCT_NAME' : 'CUSER',
									'SELECTED_APPS':Ext.util.JSON.encode(additionalParams),
									'__LISTVIEW_REQUEST' : 'Y'
							};
							
							Ext.Ajax.request({
								params : params,
								scope : win,
								success : function(response, request) {
									var resp = Ext
									.decode(response.responseText);
									if(resp.STATUS ==="SUCCESS"){
										canvas.metadata.appcontainer.setAppMetaData(resp.APP_CONTAINER_METADATA[0]);
										for(var i=0;i<this.selectedAppArray.length;i++){
											var appMd = this.selectedAppArray[i];
											var app = this.find('itemId',appMd.APP_ID)[0]
											var parentEl = app.getEl().first().first().first().first();
											parentEl.first().remove();
											cbx.AppContainerUtil.attachAppConfigurations(app);
											
								
											this.activeAppContainer.getFavoritesPanel().getEl().select('div.app-container-display-msg').update('');
											
											this.remove(app);
											this.activeAppContainer.getFavoritesPanel().add(app);
											app.checked = false;
											this.activeAppContainer.getFavoritesPanel().doLayout();
										}
										this.selectedAppArray = new Array();
									}
									else{
										cbx.AppContainerUtil.showErrorWin(this.rb);
									}
									this.getEl().unmask();
									this.close();
								}, 
								failure : function(result, request) {
									
								}
							});
						}
						else if (cbx.isEmpty(selectedApps) && !cbx.isEmpty(unCheckedApps)&& unCheckedApps.length>0){
							var warningMsg = new iportal.Dialog({
								dialogType : 'ERROR',
								title : rb.LBL_MESSAGE,
								message : rb.ERR_WARNING_MSG_FOR_FAIL,
								okHandler : function (){
									warningMsg.close();
								}

							});
							warningMsg.show();
						}
						else {
							var warningMsg = new iportal.Dialog({
								dialogType : 'ERROR',
								title : rb.LBL_MESSAGE,
								message : rb.LBL_APP_NOT_FOUND,
								okHandler : function (){
									warningMsg.close();
								}

							});
							warningMsg.show();
							
						}
					}
				};
			var tbFill ={
				xtype :'tbfill'
			};
			var cancelBtn={
					cls : 'portal_neg_btn',
					text : rb['LBL_CLOSE'],
					handler : function(){
						Ext.WindowMgr.getActive().close();
					}
			};
			
			if(posBtn==='RIGHT' && negBtn === 'LEFT')
			{
				buttonArray.push(cancelBtn);
				buttonArray.push(tbFill);
				buttonArray.push(addSelectedAppBtn);
				
			}else if (posBtn==='LEFT' && negBtn === 'RIGHT'){
				buttonArray.push(addSelectedAppBtn);
				buttonArray.push(tbFill);
				buttonArray.push(cancelBtn);
				
			}else if (posBtn==='RIGHT' && negBtn === 'RIGHT'){
				buttonArray.push(tbFill);
				buttonArray.push(addSelectedAppBtn);
				buttonArray.push(cancelBtn);
				
			}else{
				buttonArray.push(addSelectedAppBtn);
				buttonArray.push(cancelBtn);	
			}
			return buttonArray;	
			
		},
		getItemsForWindow : function(win) {
			var activeAppContainer = null;
			var appContainerList = iportal.workspace.metadata.getCurrentWorkspace().getWidgetContainer().find('itemId','app-container');
			for(var i = 0;i<appContainerList.length;i++){
				if(appContainerList[i].isActiveAppContainer && appContainerList[i].isActiveAppContainer === true){
					activeAppContainer = appContainerList[i];
					win.activeAppContainer = activeAppContainer ;
				}
			}
			
			var totalCount = canvas.metadata.appcontainer.getAllApps().length;
			var itemArr = [];
			for(var i=0;i<totalCount;i++){
				var bundle = canvas.metadata.appcontainer.getAppContainerMetadata([activeAppContainer.ownerCt.widgetId]).BUNDLE_KEY;				
				var rb = cbx.isEmpty(bundle)?CRB.getFWBundle():CRB.getBundle(bundle);
				
				var label = rb[canvas.metadata.appcontainer.getAllApps()[i].APP_DISPLAY_NM_KEY]?rb[canvas.metadata.appcontainer.getAllApps()[i].APP_DISPLAY_NM_KEY]:canvas.metadata.appcontainer.getAllApps()[i].APP_DISPLAY_NM_KEY;
				var cssClass = activeAppContainer.ownerCt.widgetId+"-fav-btn";
				var item = new cbx.appContainer.appIcon({
					itemId : canvas.metadata.appcontainer.getAllApps()[i].APP_ID,
					//bodyCssClass : 'x-appContainer-panel',
					iconCls : canvas.metadata.appcontainer.getAllApps()[i].APP_CSS_CLASS,
					label : label,
					cls : 'appicon-panel-wrap '+cssClass,
					md : canvas.metadata.appcontainer.getAllApps()[i],
					
			
					checked : false,
					addHandler : function(){
						if(arguments[1].checked === true){
							this.checked  = true;
						}
						else if(arguments[1].checked === false){
							this.checked = false;
						}
						arguments[0].stopPropagation();
					}
				});
				if(activeAppContainer.find('itemId',item.itemId).length===0){
					itemArr.push(item);
				}
			}
			return new Ext.Panel({
				autoDestroy : false,
				name : 'app-wrapper-panel',
				items : itemArr,
				layout : 'column',
				cls:'rcbx-fav-win',
				autoScroll : true
			});
		}
	}
}()