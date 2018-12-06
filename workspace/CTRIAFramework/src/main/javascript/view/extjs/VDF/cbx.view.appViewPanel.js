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

 * DEPLOY_MODULE_ID: FW17

 */


Ext.ns("cbx.view");
cbx.view.appViewPanel =  Ext.extend(Ext.Panel, {
	autoScroll : true,
	widgetId : this.widgetId,
	itemId : 'APP_VIEW_PANEL',
	viewConf : this.viewConf,
	evaluator : null,
	defaultApps : [],
	favoriteApps : [],
	buildDefaultApps : function(){
		var scope = this.findParentByType('portlet')?this.findParentByType('portlet').getComponent(0):this;
		 var appMetadata = canvas.metadata.appcontainer.getAppContainerMetadata([this.widgetId]);
    	 var itemArray = [];
	 
    	 if(appMetadata && appMetadata.CHILD_APPS && appMetadata.CHILD_APPS.length>0){
	 	
    		 var defaultApp;
			 var config = {
					 VIEW_TYPE : this.viewConf.VIEW_MD.FLD_VIEW_TYPE,
					 WIDGET_ID : this.widgetId,
					 VIEW_ID : this.viewConf.VIEW_MD.VIEW_ID
			 };
			 this.evaluator = new cbx.core.appEvaluator(config);
			 var defaultApp = this.evaluator.getDefaultApp();
    		 for(var i=0;i<appMetadata.CHILD_APPS.length;i++){
    			if(appMetadata.CHILD_APPS[i].IS_FAV_APP !=='Y'){
    				if(defaultApp===appMetadata.CHILD_APPS[i].APP_ID){
    					appMetadata.CHILD_APPS[i].APP_DEFAULT_SELECT = true;
    				}
    				else{
    					appMetadata.CHILD_APPS[i].APP_DEFAULT_SELECT = false;
    				}
				
    				itemArray.push(this.getFavouritesFor(appMetadata.CHILD_APPS[i],this.widgetId,scope,'N'));
    			}
    		 }
    		 this.defaultApps = itemArray;
    	 }
    	 return itemArray;
 },
 buildFavoriteApps : function(){
	 var scope = this.findParentByType('portlet')?this.findParentByType('portlet').getComponent(0):this;
	 var appMetadata = canvas.metadata.appcontainer.getAppContainerMetadata([this.widgetId]);
	 var itemArray = [];
	 if(appMetadata && appMetadata.CHILD_APPS && appMetadata.CHILD_APPS.length>0){
		 for(var i=0;i<appMetadata.CHILD_APPS.length;i++){
			 if(appMetadata.CHILD_APPS[i].IS_FAV_APP==='Y'){
				 appMetadata.CHILD_APPS[i].APP_DEFAULT_SELECT = false; 
				 itemArray.push(this.getFavouritesFor(appMetadata.CHILD_APPS[i],this.widgetId,scope,'Y'));
			 }
		 }
		 this.favoriteApps = itemArray;
	 }
	 return itemArray;
 },
 getDefaultApps : function(){
	return this.defaultApps; 
 },
 getFavoriteApps : function(){
	return this.favoriteApps; 
 },
 
 getFavouritesFor : function(appMetadata,widgetId,scope,fav){
	 var id = appMetadata.APP_ID;
	 var scope = {
			 panel : scope, 
			 metadata : appMetadata
	 };
	 
	 var bundle = canvas.metadata.appcontainer.getAppContainerMetadata([this.widgetId]).BUNDLE_KEY;
	
	 var appIcon = (appMetadata.APP_CSS_CLASS && appMetadata.APP_CSS_CLASS !== '')?appMetadata.APP_CSS_CLASS:'x-default-app';
	 
	// var rb = bundle && CRB.getBundle(CRB[bundle.toUpperCase()])?CRB.getBundle(CRB[bundle.toUpperCase()]):CRB.getFWBundle();
	 var rb = cbx.isEmpty(bundle)?CRB.getFWBundle():CRB.getBundle(bundle);
	 return new Ext.Panel({
			
			itemId : id, 
			cls : fav==="Y"?'appicon-panel-wrap '+widgetId+'-fav-btn':'appicon-panel-wrap '+widgetId+'-app-btn',  
			defaultSelectionReq : appMetadata.APP_DEFAULT_SELECT,
			scope : scope,
			//width : 80,
			label : rb[appMetadata.APP_DISPLAY_NM_KEY]?rb[appMetadata.APP_DISPLAY_NM_KEY]:appMetadata.APP_DISPLAY_NM_KEY,
			isFavouriteApp : fav,
			//bodyCssClass : 'x-appContainer-panel',
			iconCls : appIcon,  
			//closeCls : 'new-sort-btn-arrow',

			update : function (){

				this.tpl.overwrite(this.body, {
					ICON_CLS : this.iconCls,
					CLOSE_CLS : this.closeCls,
					LABEL :this.label 
				});

			}, 
			tpl : new Ext.XTemplate(
					'<div class="appicon-wrap">',
					'<div  class="appicon-default {ICON_CLS}"><div class="removeapp"></div></div>','</div>',
					'<div class = "div-ab-wrap"><center>{LABEL}</center></div>'
					), 
					
			listeners : {
				render : function(){
					
					this.update();
				}
			},
			afterRender : function(){
				var EL = Ext.Element;
				var panelBody = this.body;
				this.btnDiv = new EL(panelBody.dom.childNodes[0]);
				this.closeImg = new EL(panelBody.dom.childNodes[0].childNodes[0].childNodes[0])
				if(this.isFavouriteApp==="Y"){
					this.closeImg.hide();
					var overFn = function(){
						this.show(true);
					}
					var outFn = function(){
						this.hide(true);
					}
					
					this.btnDiv.hover(overFn,outFn,this.closeImg);
					//this.closeImg = new EL(this.body.dom.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0]);
					this.closeImg.on('click',cbx.AppContainerUtil.appCloseHandler,this,this.btnDiv);
				}
				else{
					this.closeImg.remove();
				}
				this.btnDiv.on('click',function(){
					cbx.AppContainerUtil.appClickHandler.apply(this);
					var totalItems=this.ownerCt.items;
					for(var i=0;i<totalItems.length;i++)
					{
					 var eachItem=new Ext.Element(this.ownerCt.items.itemAt(i).body.dom.childNodes[0]);
					 if(totalItems.itemAt(i).itemId!=this.itemId)
					 {
						 eachItem.removeClass('LayoutAppsContainerOpacVal');
					 }
					}
					if(this.btnDiv.dom.className.indexOf('LayoutAppsContainerOpacVal')==-1)
					{
						this.btnDiv.addClass('LayoutAppsContainerOpacVal');
					}
				},this);
				
				this.btnDiv.addClass('LayoutAppsContainerOpacNone');
				if(this.defaultSelectionReq && iportal.workspace.metadata.getCurrentLayout().loadingMode === "L")
				{
					var panel = this.findParentByType("cbx-appContainer");
					var isAppSelected=panel.evaluator.doSelect(this.ownerCt,this.itemId);
					if(isAppSelected)
					{
					var totItems=this.ownerCt.items;
					for(var i=0;i<totItems.length;i++)
					{
					if(totItems.itemAt(i).body)
					{	
					 var eachItm=new Ext.Element(totItems.itemAt(i).body.dom.childNodes[0]);
					 if(totItems.itemAt(i).itemId==this.itemId)
					 {
						 eachItm.addClass('LayoutAppsContainerOpacVal');
					 }
					}
				  }
				}
				}
			}
		});
 },	

	autoScroll : true, 
	 initComponent : function(){
	
		 var favAppList = this.buildFavoriteApps();
		 var favAppHeight;
		 var defAppHt;
		 var rb = null;
		 var favAppsNotReq = true;
		 var scrollPanelWidth = 500;
		 if(canvas.metadata.appcontainer.getAppContainerMetadata([this.widgetId])){
			 rb = canvas.metadata.appcontainer.getAppContainerMetadata([this.widgetId]).BUNDLE_KEY?canvas.metadata.appcontainer.getAppContainerMetadata([this.widgetId]).BUNDLE_KEY:CRB.getFWBundle();
			 favAppsNotReq = canvas.metadata.appcontainer.getAppContainerMetadata([this.widgetId]).FAV_APPS_REQ_IND==="Y"?false:true;
			 var proportion = canvas.metadata.appcontainer.getAppContainerMetadata([this.widgetId]).PROPORTION;
			 if(proportion){
				 var propArray = proportion.split(',');
				 favAppHeight = (propArray[1]/ 100)*this.height;
				 defAppHt = this.height - favAppHeight;
			 }
		
		 }
		 var bundle = (rb && rb === CRB.getFWBundle())?rb:CRB.getFWBundle()
		 
		 var widget = iportal.workspace.metadata.getCurrentWorkspace().getWidgetContainer().find('itemId',this.widgetId)[0];
		 if(!cbx.isEmpty(widget)){
			 scrollPanelWidth = widget.getWidth();	 
		 }
		
		 var appPanel = new Ext.Panel({
			layout : 'border',
			autoScroll : true,
			height : this.height,
			
			itemId : 'app-container',
			name : 'app-container_'+this.viewConf.VIEW_MD.VIEW_ID,
			
			items : [
			         {
			        	 region : 'center',
			        	 name : 'app-container-north',
			        	 cls:'LayoutAppsContainer',/* CSS changes for new LAF   */
				         viewConf :this.viewConf,
				         widgetId : this.widgetId,
				         height : defAppHt,
				         //bodyCssClass : 'x-appContainer-panel',
				         layout : 'column',
				         autoScroll : true,
				         items : this.buildDefaultApps(),
				         listeners : {
				        	 afterRender : function(){
				        		 if(this.items.length ===0){
				        				var rb = CRB.getFWBundle();
					        			var msg = rb['LBL_APP_NOT_FOUND'];
					        			this.update("<div class = 'app-container-display-msg'>"+msg+"</div>"); 
				        			}
				        	 }
				         }
			         },
			         {
			        	xtype : 'buttonscrollpanel', 
			        	region : 'south',
			        	header : true,
			        	amountOfxScroll:130,
			        	height : favAppHeight,
			        	hidden : favAppsNotReq,
			        	collapsible : false,
			        	tools : [
			        	        {
			        	        	id : 'plus',
			        	        	qtip : CRB.getFWBundle().TOOL_TIPS_FAVOURITES,  
			        	        	handler : function(){
			        	        		
			        	        		var appContainer = arguments[2].ownerCt;
			        	        		appContainer.isActiveAppContainer = true;
			        	        		cbx.appContainer.favoritesWindow.showFavoritesWindow();			        	        		
			        	        	}
			        	        }
			        	        
			        	        ],
			        	autoScroll : false,
			        	collapsed : false,
			        	title : bundle['LBL_FAV_APPS'],
			        	//bodyCssClass : 'x-content-panel',
			        	name : 'app-container-south',
				        viewConf :this.viewConf,
				        widgetId : this.widgetId,
				        //bodyCssClass : 'x-appContainer-panel',
					
				        scrollCmp:[{
				        	width :scrollPanelWidth,
				        	initialWidth : scrollPanelWidth,
				        	itemId : 'container-panel',
				        	cls : 'favapp-panel', 
				        	autoHeight : true,
				        	childAppsWidth : 0,
				        	/**
				        	 * The API which calculates the width of the child
				        	 * apps being added and set the width of this container
				        	 * 
				        	 * @mode A-> Add : indicates that an app has been
				        	 * added to the favorites panel.
				        	 * R -> Remove : indicates that an app has been removed
				        	 * from the favorites panel.
				        	 * 
				        	 * @component : the App that has been added or removed.
				        	 */
				        	updateWidth : function(component,mode){
				        		/**
				        		 * as component.getWidth() gives the owner container width
				        		 * when the app has been initially added or removed
				        		 */
				        		var componentWidth = component.getEl().child('div.appicon-wrap').getWidth();/*first().first().first().getWidth();*/ 
				        		/**
				        		 * Giving a certain % of additional width as the apps roll
				        		 * over to the next row which is not desirable.
				        		 */
				        		var additionalWidth = (50/100)*componentWidth; 
				        		var newWidth;
				        		if(mode == "A"){
				        			this.childAppsWidth = this.childAppsWidth+componentWidth+additionalWidth;
				        		}
				        		else if(mode == "R"){
				        			this.childAppsWidth = this.childAppsWidth - componentWidth-additionalWidth;
				        		}
				        		/**
				        		 * The newWidth to be set will always be the initial width
				        		 * if the apps sum up to be lesser than the initial width.
				        		 * If they sum up more than the initial width,then that 
				        		 * becomes the new width
				        		 */
				        		newWidth = this.childAppsWidth >this.initialWidth?this.childAppsWidth:this.initialWidth;
				        		this.setWidth(newWidth);
				        	},
					        	items :[{
						
					        	xtype : 'panel',
					        	autoScroll : false,
					        	autoWidth : true,
					        	//bodyCssClass : 'x-appContainer-panel',
					        	itemId : 'fav-app-holder',
					        	layout : 'column',
					        	html : "<div class = 'app-container-display-msg'>"+bundle['LBL_FAV_APPS_NOT_FOUND']+"</div>", 
					        	items :favAppList,
						
					        	/**
					        	 * Will always return the container panel for 
					        	 * the favorite apps holder
					        	 */
					        	getContainerPanel : function(){
					        		var selector = function(component){
				        				if(component && component.itemId =='container-panel'){
				        					return true;
				        				}
				        			};
				        			return this.findParentBy(selector);
					        	},
							
					        	listeners : {
					        		afterRender : function(){
					        			if(this.items.length>0){
					        			
					        				this.getEl().select('div.app-container-display-msg').update('');
									
					        			}
					        	
					        		},
					        		/**
					        		 * The handler which Ext will fire as soon as an app 
					        		 * has been added to this panel.
					        		 * @purpose : to update the width of the container
					        		 * panel 
					        		 * @param panel
					        		 * @param component
					        		 * @param index
					        		 */
					        		add : function(panel,component,index){
					        			var containerPanel = panel.getContainerPanel();
					        			if(component.rendered){
					        				containerPanel.updateWidth(component,"A");
					        			}
					        			else{
					        				component.on('afterRender',function(containerPanel){
					        					this.updateWidth(arguments[0],"A");
					        				},containerPanel);
					        			}
					        		},
					        		/**
					        		 * The handler which Ext will fire as soon as an app 
					        		 * has been removed from this panel.
					        		 * @param panel
					        		 * @param component
					        		 */
					        		beforeremove : function(panel, component){
					        			var containerPanel = panel.getContainerPanel();
					        			containerPanel.updateWidth(component,"R");
					        		}
					        	}
					        }]
						
				        }],
					
				        listeners : {
				        	collapse : function(){
				        		width:300,
				        		this.ownerCt.layout.south.getCollapsedEl().titleEl.dom.innerHTML = "<span class='x-panel-header-text'>Favourite-Apps</span>"
				        	}
				        }
			         }
			         ], 
			         listeners : {
			        	 afterrender : function(){
			        		
			     			var wgt = this.findParentByType('portlet').getComponent(0);

			     			wgt.height = this.ownerCt.height;

			     			wgt.setHeight(this.ownerCt.height);

			     			if (wgt.updateHeight) {

			     				wgt.updateHeight(this.ownerCt.height);

			     			} else {

			     				wgt.mwc.updateHeight(this.ownerCt.height);

			     			}

			     			wgt.doLayout();

			     			if (wgt.ownerCt.ownerCt.ownerCt.ownerCt.resetHeight) {

			     				wgt.ownerCt.ownerCt.ownerCt.ownerCt.resetHeight();

			     			} else {

			     				wgt.ownerCt.ownerCt.ownerCt.ownerCt.doLayout();

			     			}



			     			cbx.view.appViewPanel.superclass.afterRender.apply(this);
			     		
			        	 }
				
			         },
			         getFavoritesPanel : function(){
			        	 return this.find('itemId','fav-app-holder')[0];
			         }
				 
			         
		 })
		 this.items = appPanel;
		 cbx.view.appViewPanel.superclass.initComponent.apply(this);
	 }, 

	updateHeight : function(){
		return;
	}

})
Ext.reg('cbx-appContainer', cbx.view.appViewPanel);