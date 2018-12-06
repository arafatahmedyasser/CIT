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
Ext.ns("iportal.view");
iportal.view.MultiViewModel =  function(){
	var views={};
	var viewsList = [];
	var contextList = [];
	var multiWidgetList = {};
	var accGrpList = [];
	var dview = {};// to hold default view ids
	var prms = {
		INPUT_ACTION : "INIT_HEADER_ACTION",
		PAGE_CODE_TYPE : 'VDF_CODE',
		PRODUCT_NAME : "CUSER",
		INPUT_FUNCTION_CODE : "VSBLTY",
		INPUT_SUB_PRODUCT : "CUSER",
		__LISTVIEW_REQUEST : 'Y',
		INPUT_PRODUCT : "CUSER",
		INPUT_LANGUAGE_ID : iportal.preferences.getPrimaryLang()
	};
	
	prms["__PIGGYBACKREQUEST"]="Y";  
	
	var widgetUserIteractions = {};	//will be used for storing temp. user interactions with the widget 
	return Ext.apply(new Ext.util.Observable, {
			/**
			* Intended to return default parametes for ajax request
			*/
			getParams : function(){
				return prms;
			},
			/**
			* Intended to add views list for given widget.
			* added code to only attach system view id to the widget
			*/
			setViewsList : function(wid,res){
				var arr= new Array();
				var allViewsArray = new Array();
			for ( var i = 0, len = res.VIEWS_LIST.length; i < len; i++) { 
					var tmpView = res.VIEWS_LIST[i];
					if(tmpView.DEFAULT_VIEW_IND==="Y" || tmpView.OD_USER_NO !='-1'){
						arr[arr.length]=tmpView;
					}
				}
				//viewsList[wid] = res.VIEWS_LIST;
				viewsList[wid] = arr;
			},
			/**
			* Intended to set The Account Group list for given USER.
			*/
			setAccGrpList : function(res){
				accGrpList = res.ACC_GRP_LIST;
			},
			/**
			* Intended to add view to viewsList for given widget
			*/
			addView : function(wid,vid){
				viewsList[wid].push(vid);
			},
			/**
			* Intended to delete given view for given widget id from views list
			*/
			deleteView : function(wid,vid){
				var vlist,lview,i,j;
				 vlist = viewsList[wid];
				 for(j=0;j<vlist.length;j++){
				 	lview = vlist[j];
				 		if(lview.VIEW_ID === vid){
				 			vlist.remove(vlist[j]);
				 			return true;
				 		}
				 }			
			},
			/**
			* Intended to return views list for given widget id.
			*/
			getViewsList :  function(wid){
				return viewsList[wid];
			},
			/**
			* Intended to check if the passed widget already there in the model or not.
			*/
			isWidgetExist :  function(wid){
				if(viewsList[wid]!=null){
					return true;
				}else{
					return false;
				}
			},
			/**
			* Intended to Return Account Group List for an User
			*/
			getAccGrpList :  function(){
				return accGrpList;
			},
			/**
			 * This API is intended to iterate all views and create Views object 
			 */
			setViews :  function(wid,res){
				views[res.VIEW_MD.VIEW_ID]={'VIEW_MD':res.VIEW_MD,'VIEW_ADDL_MD':res.VIEW_ADDL_MD};
				this.setViewsList(wid,res);
				this.setDefaultView(wid,res.VIEW_MD.VIEW_ID);
			},
			/**
			*  Intended to Add view meta data for given view id.
			*/
			addViewMeta : function(vid,md){
				views[vid] = md;
			},
			/**
			* Intended to delete view meta data for given view id.
			*/
			deleteViewMeta : function(vid){
				delete views[vid];
			},
			/**
			 * Intended to set default view id
			 */
			setDefaultView :  function(wid,id){
				//alert("setDefaultView wid="+wid+" id= "+id)
				dview[wid] = id;
			},
			/**
			 * Intended to return default view id
			 */
			getDefaultView :  function(wid){
			//alert("getDefaultView wid= "+wid+" "+ dview[wid])
				return dview[wid];
			},
			/**
			* Intended to get startup mode value from mete data and return
			*/
			getStartUpMode : function(wid){
				var meta = IMM.getView(this.getDefaultView(wid));
				return meta ? meta.VIEW_MD.FLD_START_UP_MODE:'';
			},
			/**
			* Intended to check start up mode is SEARCH or not. Return true if yes else false;
			*/
			isSearchMode : function(wid){
				var startMode = IMM.getStartUpMode(wid);
				return !Ext.isEmpty(startMode)&& startMode==="SEARCH";
			},
			/**
			 * Intended to return view definition from views for given system id
			 */
			getView : function(sid){
				return views[sid];		
			},
			
			getColumnList : function(md) {
				// return this.md.VIEW_MD.FLD_COLUMN_LIST;
				var channelCols = [];
				var device=iportal.systempreferences.getDevice();
				for (i = 0, len = md.VIEW_MD.FLD_COLUMN_LIST.length; i < len; i++) {
					if (cbx.core.ws.metadata.getDeviceFilter(md.VIEW_MD.FLD_COLUMN_LIST[i].FLD_CHANNEL_ID,device)
							|| md.VIEW_MD.FLD_COLUMN_LIST[i].FLD_CHANNEL_ID == 'A') {
						channelCols.push(md.VIEW_MD.FLD_COLUMN_LIST[i]);
					}
				}
				return channelCols;
			},
		
			/**
			 * Intended to return views map
			 */
			getViews : function(){
				return views;
			},
	
		isWidgetEntitled : function (wid){
			var viewID = IMM.getDefaultView(wid);
			var viewMD = IMM.getView(viewID);
			var viewList = IMM.getViewsList(wid);
			var isWidgetEntitled = false;
			for ( var i = 0, len = viewList.length; i < len; i++) {
				/*
				 * The Entitlement should check only the system view not the
				 * actual view id
				 */
				if (viewList[i].VIEW_ID == viewMD.VIEW_MD.SYSTEM_VIEW_ID) {
					isWidgetEntitled = viewList[i].IS_ENTITLED === 'Y' ? true : false;
					break;
				}
			}
			return isWidgetEntitled;
		},
		//method to be called by catalog icon for setting value Y and multiview to set back to N once the widget loaded
		markWidgetOpened : function (wid, value){
			value = value || 'Y';
			widgetUserIteractions[wid] = widgetUserIteractions[wid]|| {};
			widgetUserIteractions[wid]['USER_MARKED_OPEN']=value;
		},
		isWidgetMarkedOpen : function (wid){

			return (widgetUserIteractions[wid] && widgetUserIteractions[wid]['USER_MARKED_OPEN']=== 'Y') ? true : false;

		},
			isChartView : function(vmd){
				if(vmd.VIEW_MD.FLD_VIEW_TYPE ==='CHART'){
					return true;
				}
				return false;
			},
			isOrgView : function(vmd){
				if(vmd.VIEW_MD.FLD_VIEW_TYPE ==='ORG'){
					return true;
				}
				return false;
			},
				
			isIFrameView : function(vmd){
				return vmd.VIEW_MD.FLD_VIEW_TYPE ==='IFRAME';
			},
			
			isAdsView : function(vmd){
				return vmd.VIEW_MD.FLD_VIEW_TYPE === "ADS";
			},
			
			isListView : function(vmd){
					
				if(vmd.VIEW_MD.FLD_VIEW_TYPE ==='CLASSIC_GRID' || vmd.VIEW_MD.FLD_VIEW_TYPE ==='LIST'
					|| vmd.VIEW_MD.FLD_VIEW_TYPE ==='PAGING'){
				
					return true;
				}
				return false;
			},
			isPropertyListView : function(vmd){
				if(vmd.VIEW_MD.FLD_VIEW_TYPE ==='PROPERTY'){
					return true;
				}
				return false;
			},
			isTreeView : function(vmd){
				if(vmd.VIEW_MD.FLD_VIEW_TYPE ==='TREE'){
					return true;
				}
				return false;
			},
		
			isMapView : function(vmd){

				if(vmd.VIEW_MD.FLD_VIEW_TYPE ==='MAP'){

					return true;

				}

				return false;

			},
			
			isGroupView : function(vmd){
				if(vmd.VIEW_MD.FLD_VIEW_TYPE ==='GROUP'){
					return true;
				}
				return false;
			},
			isAdvGroupView : function(vmd){
				if(vmd.VIEW_MD.FLD_VIEW_TYPE ==='ADVGROUP'){
					return true;
				}
				return false;
			},
			isCalendarView : function(vmd){
				
				if(vmd.VIEW_MD.FLD_VIEW_TYPE ==='CALENDAR'){
					return true;
				}
				return false;
			},
			isFormView : function(vmd){
				
				if(vmd.VIEW_MD.FLD_VIEW_TYPE ==='FORM'){
					return true;
				}
				return false;
			},
			isEmptyView : function(vmd){
				if(vmd.VIEW_MD.FLD_VIEW_TYPE ==='EMPTY'){
					return true;
				}
				return false;
			},
			
			isAppView : function(vmd){

				if(vmd.VIEW_MD.FLD_VIEW_TYPE ==='APP'){

					return true;

				}

				return false;

			},
			
			/**
			 * Intended to raise ajax Request.
			 * Given params object values will be appended to default object,i.e 
			 * 					 {  INPUT_ACTION:"INIT_HEADER_ACTION",
									PAGE_CODE_TYPE:'VDF_CODE',
									PRODUCT_NAME:"CUSER",
									INPUT_FUNCTION_CODE:"VSBLTY",
									INPUT_SUB_PRODUCT:"CUSER",
									__LISTVIEW_REQUEST:'Y'
									};
			 * If Scope given success handler function will be invokes with that scope, else ajax request scope.
			 * Before invoking success handler, this api will do the following
			 * If action value is INIT_HEADER_ACTION, then it sets all views to model, else 
			 * If action value is INIT_VIEW, then it sets view meta data to model.					 
			 *	Now success handler will invoke.
			 *
			 * @param - Object - Ex:{
			 * 						params:{'INPUT_ACTION':'INIT_ACTION'},
			 * 						successhandler:function(){},
			 * 						scope:this } 
			 * 
			 */
			 /*
			 *Intend to save the metadata in a client side model object
			 */
			 
			 setContextMenuList : function(viewId, contextMenuList){
				 contextList[viewId] = contextMenuList;
			 },
			 getContextMenuList : function(viewId){
				 return contextList[viewId]; 
			 },
			initAjaxReq : function(config){
				var prms={};
				Ext.apply(prms,this.getParams());
				Ext.apply(prms,config.params);
				var type="WIDGET";
				var typeid="";
				if(prms.INPUT_ACTION === 'INIT_HEADER_ACTION'){
					type="WIDGET";
					typeid=prms.WIDGET_ID;
 				}else if(prms.INPUT_ACTION === 'INIT_VIEW'){
 					type="WIDGET_CUSTOM";
 					typeid=prms.WIDGET_ID+"$"+prms.VIEW_ID
 				}
				var cachedFlag=false;
				var self=this;
				var cachedMetadata=canvas.metadata.getMetaData(type,typeid,function(metadatavalue){
					if(!cbx.isEmpty(metadatavalue)){
						try{
							var delegateCacheMetadataFn=function(resp,options){
								var respOb=null;
								if(options.INPUT_ACTION === 'INIT_HEADER_ACTION'){
									respOb= Ext.decode(resp);
									var viewId= respOb.VIEW_MD.VIEW_ID;
					 				var contextdata=respOb.CONTEXT_MENU_LIST;
								}
								else if(options.INPUT_ACTION === 'INIT_VIEW'){
									respOb= Ext.decode(resp);
									respOb=Ext.decode(respOb.responseText);
									var viewId= respOb.response.value.VIEW_MD.VIEW_ID;
					 				var contextdata=respOb.response.value.CONTEXT_MENU_LIST;
								}
				 				/*
				 				*To get the Context menu metadata
				 				*/
				 				/*
				 				*To get the Context menu metadata
				 				*/
				 				/**
				 				* Calling the method for setting value for the Context Menus
				 				*/
				 				if((contextdata!=null) && (contextdata!=undefined) && (contextdata.length!=0)){
				 					IMM.setContextMenuList(viewId,contextdata);				 				
				 				}
				 				if(options.INPUT_ACTION === 'INIT_HEADER_ACTION'){
				 					this.setViews(options.WIDGET_ID,respOb);	
				 					this.setAccGrpList(respOb);	
				 				}else if(options.INPUT_ACTION === 'INIT_VIEW'){
									var md = respOb.response.value;
									this.addViewMeta(md.VIEW_MD.VIEW_ID,md);
				 				}
				 				// added true for a confirmation that the success handler is called after the AJAX call
					       		var callBack = config.scope?config.successhandler.createDelegate(config.scope):config.successhandler;
					       		if(options.INPUT_ACTION === 'INIT_HEADER_ACTION'){
					       			callBack(true, resp,options);	
					       		}
					       		else if(options.INPUT_ACTION === 'INIT_VIEW'){
					       			callBack(true, Ext.decode(resp),options);	
					       		}
				 				}.createDelegate(self)
				 				var opts={};
				 				Ext.apply(opts,prms);	
				 				delegateCacheMetadataFn.apply(self,[metadatavalue,opts]);
				 				cachedFlag=true;	
							}
							catch (e) {
								LOGGER.error('Error while fetching Multi Widget Metadata cached data', e);
								cachedFlag=false;
							}
					}
					if(!cachedFlag){
			 	Ext.Ajax.request({
				       	params:prms,
				       	success:function(resp,options){
			 				var respOb= Ext.decode(resp.responseText);
			 				
			 				/*
			 				*To get the Context menu metadata
			 				*/
			 				var viewId= respOb.response.value.VIEW_MD.VIEW_ID;
			 				var contextdata=respOb.response.value.CONTEXT_MENU_LIST;
			 							 				
			 				/**
			 				* Calling the method for setting value for the Context Menus
			 				*/
			 				if((contextdata!=null) && (contextdata!=undefined) && (contextdata.length!=0)){
			 		
			 					IMM.setContextMenuList(viewId,contextdata);				 				
			 							 				
			 				}
			 				if(options.params.INPUT_ACTION === 'INIT_HEADER_ACTION'){
			 					this.setViews(options.params.WIDGET_ID,respOb.response.value);	
			 					this.setAccGrpList(respOb.response.value);	
				 					var vmd=respOb.response.value;
				 					if(vmd.VIEW_MD.FLD_TOOLS_LIST != null && vmd.VIEW_MD.FLD_TOOLS_LIST.indexOf("gear") < 0){
				 					setTimeout(function(){
										try{
										canvas.metadata.storeMetaData(type,{id:typeid,value:respOb.response.value,serverdatetime:respOb.HEADER_VALUE.TXN_PROCESS_DATE_TIME});
										}
										catch (e) {
											LOGGER.error('Error while storing Multi Widget Metadata  cache', e);
										}
									},100);
				 					}
			 				}else if(options.params.INPUT_ACTION === 'INIT_VIEW'){
			 					var md = respOb.response.value;
								this.addViewMeta(md.VIEW_MD.VIEW_ID,md);
									//Commented to store customized view for future purpose
								/*	setTimeout(function(){
										try{
										canvas.metadata.storeMetaData(type,{id:typeid,value:resp,serverdatetime:respOb.HEADER_VALUE.TXN_PROCESS_DATE_TIME});
			 				}
										catch (e) {
											LOGGER.error('Error while storing Multi Widget Metadata  cache', e);
										}
									},100);*/
				 				}
			 				// added true for a confirmation that the success handler is called after the AJAX call
				       		var callBack = config.scope?config.successhandler.createDelegate(config.scope):config.successhandler
				       			callBack(true, resp,options);
			 				}.createDelegate(this),
			 			
			 			failure : function(resp,options){
			 					 					
			 				var callBack = config.scope?config.failurehandler.createDelegate(config.scope):config.failurehandler
				       			callBack(true,resp,options);
			 			}.createDelegate(this)	
			 			});
					}
				},this);
			},
			/**
			* Intended to check DEFAULT_VIEW_IND value for given viewinfo object. 
			* Return true if value is Y else false
			*/
			isDefaultView : function(viewinfo){
				return (viewinfo.DEFAULT_VIEW_IND === 'Y');
			},
			/**
			* Inteded to deleted the View id for given widget from modal ViewsList and fire 'modalchange' event
			* @param info - Information object given by Preferences  
			*/
			handleDeleteViewAction : function(info){
				this.deleteView(info.WIDGET_ID,info.VIEW_ID);
				//alert('before firing '+info.WIDGET_ID);
				IMM.fireEvent('modalchange',info);
			},
			setViewAsDefaultIfReq : function(pinfo){
				var rfalg =this.isDefaultView(pinfo); 
				if(rfalg){
					this.setDefaultView(pinfo.WIDGET_ID,pinfo.VIEW_ID);
				}
			},
			/**
			* Intended to add view info into views list and fire modalchange event
			*/
			handleCreateViewAction : function(info){
				var viewobInList = {},wid = info.WIDGET_ID;
				Ext.apply(viewobInList,info);
				this.addView(wid,viewobInList);
				IMM.fireEvent('modalchange',info);
			},
			/**
			 * 
			 */
			handleUpdateViewAction : function(info){
				this.deleteViewMeta(info.VIEW_ID);
				IMM.fireEvent('modalchange',info);
			},

			/**
			* Intended to handle the following as and when widget preferences changes
			* Step1: Check what is the action performed by user and delegate respective handlers
			*/
			widgetPrfChanged : function(info){
				var action = info.PREF_ACTION;
				if(action === 'PREF_DELETE_ACTION'){
					this.handleDeleteViewAction(info);
				}else if(action === 'PREF_SAVE_ACTION'){
					this.handleUpdateViewAction(info);
				}else if(action === 'PREF_SAVE_NEW_ACTION'){
					this.handleCreateViewAction(info);
				}
			},
			/**
			* Intended to check and return whether given view metedata is user defined or not
			* If gcif and user no is -1 means this view is system view, else user created view 
			*/
			isSystemView : function(v){
				return v.OD_GCIF ==='-1' && v.OD_USER_NO ==='-1';			
		},
		
		/**
		 * Store the meta data for Multi Widget Configuration and cache it for
		 * multiple use.
		 */
		setMultiWidgetMd : function (md){
			if (md != null) {
				multiWidgetList[md.MULTI_WIDGET_MD.WIDGET_ID] = md;
			}
		},
		/**
		 * Expected to return the cached meta data for the requested widgetId
		 */
		getMultiWidgetMd : function (widgetId){
			return multiWidgetList[widgetId];
		}
		
	});
}(); 
IMM = iportal.view.MultiViewModel;
IMM.addEvents('modalchange');
