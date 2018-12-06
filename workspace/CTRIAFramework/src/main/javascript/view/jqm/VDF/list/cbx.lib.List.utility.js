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
cbx.ns('cbx.lib.List');
/*
 * This class helps to create the enrich metadata of list control and responsible for 
 * getting the business data of list control by making Ajax request and responsible for
 * rendering the control to UI
 *

*/

cbx.lib.List.utility = Class( {
	config: null,
	widgetID: '',
	workspaceID: '',
	itemID: '',
	controlBusinessData: {},
	listViewMD: '',
	parentElem: null,
	listView: null,
	constructor : function (conf) {
		this.parentElem = conf.listObj;
		this.listViewMD = conf.listObj.md;
		this.config = conf.listObj;
		this.widgetID = this.config.widgetID;
		this.listListeners = this.config.listListeners;
		this.itemID = '';
		this.workspaceID = this.config.workspaceID;
		this.extraParamsHandler = conf.listObj.extraParamsHandler;
		this.extraParams = conf.listObj.extraParams;
		this.scope = conf.listObj.scope;
		this.appEventRegistry = conf.listObj.appEvents;
		this.accumulate=conf.listObj.accumulate;
		var paginingParams={};
		paginingParams.start=0;
		paginingParams.limit=parseInt(this.listViewMD.FLD_RECORDS_PER_PAGE) || Number(iportal.systempreferences.getDefaultPagesizeForMobile());
		this.id = this.listViewMD.VIEW_ID;
		this.parentId = iportal.jsutil.getRandomNumber()+"_"+this.listViewMD.VIEW_ID;
		this.sortCols = {};
		this.serverDateFormat = 'd/m/Y';
		this.outDateFormat = canvas.datePreferences.getDateFormat();
		
/* Replacing Temp JSON into Real Time Data 
		var jsonURL = cbx.lib.utility.getListControlBusinessDataURL(this.listViewMD.FLD_LIST_TYPE,this.widgetID);	
		cbx.lib.utility.makeAJAXRequest(this.setListControlBusinessData, this,'list/'+jsonURL); -- */
		//this.getListItem(this.setListControlBusinessData, this, paginingParams);
		this.getItem();
	},
	getSortable: function(){
		var columns = this.listViewMD.FLD_COLUMN_LIST;
		for(var i=0; i<columns.length; i++){
			if(columns[i].FLD_SORT_POSITION === "1"){
				this.sortCols.sort = columns[i].FLD_COLUMN_ID;
				if(!cbx.isEmpty(columns[i].FLD_SORT_ORDER)){
					this.sortCols.dir = columns[i].FLD_SORT_ORDER;
				}
				break;
			}
		}
		return this.sortCols;
	},
	getItem:function(){
		this.controlBusinessData = {"enrichedViewMD": this.config,'listListener': this.listListeners};
		 this.controlBusinessData.enrichedViewMD.appendTO.id = this.controlBusinessData.enrichedViewMD.widgetID+"_"+this.controlBusinessData.enrichedViewMD.md.VIEW_ID+"_CHART_CONTAINER";
		var viewConfig = {
					'listMD' : this.controlBusinessData,
					'parent' : this.parentElem.appendTO,
					'utilityScope' : this,
					'pagination' : 'swipe',	
					'appEventRegistry':this.appEventRegistry,
					'graphViewId' : this.controlBusinessData.enrichedViewMD.widgetID,
					'viewConf' : {
						'VIEW_MD' :  this.controlBusinessData.enrichedViewMD.md,
						'widgetID' : this.controlBusinessData.enrichedViewMD.widgetID
					},
					'mvConf' : {
						//'id' : this.controlBusinessData.enrichedViewMD.appendTO,
						'el' : this.controlBusinessData.enrichedViewMD.appendTO,
						'id' : this.controlBusinessData.enrichedViewMD.appendTO.id,
						'clientWidth' : '100%',
						'clientHeight' : '390'
					}
		};
		var that=this;
		if(viewConfig.listMD.enrichedViewMD.md.FLD_VIEW_TYPE=='CHART'){
			this.listView = new canvas.chart.engine(viewConfig);
			CWEH.registerHandler(this.controlBusinessData.enrichedViewMD.widgetID,"renderSwitchIcon",function(json){
				var chartRenderer = that.listView;
				var chartTypes = chartRenderer.getChartTypes();
				var viewChartAsStr ="";
				if(chartTypes.length>1){
				viewChartAsStr='<ul class="chart-buttons-holder"><span class="chartmenu-label">View Chart As:</span>';
				for(var i=0;i<chartTypes.length;i++){
					viewChartAsStr+='<li id='+chartTypes[i]+' class="icon-chart '+chartTypes[i]+'_CHART"></li>';
				}
				viewChartAsStr+='</ul>';
				($(json.renderAt)).append(viewChartAsStr);
				($(json.renderAt)).children().each(function(index){
					//if(index==1){
						$(this).children().bind('click',function() {
							for(var i = 0;i<chartTypes.length;i++){
								if(chartTypes[i] == this.id){
									json.config.isChartTypeBeingChanged = true;
									json.config.switchChartTo  = this.id;
									chartRenderer.constructor(json.config);
									}
								} 
							});
						//}
					});
				}
			  });
		}
		else if(viewConfig.listMD.enrichedViewMD.md.FLD_VIEW_TYPE=='TEMPLATE'){
			this.listView = new cbx.lib.view.Template(viewConfig);
		}
		else{	
			this.massageListMD();																		
			this.listView = new cbx.lib.view.List(viewConfig);
		}
		$("#CONTENT_DIV").trigger('create');
	},
	/*getListItem : function(callback, scopeHandler,additionalParams,scope){
		
		var params = {
				"__LISTVIEW_REQUEST" : "Y",
				"PAGE_CODE_TYPE" : 'VDF_CODE',
				"INPUT_ACTION" : "INIT_DATA_ACTION",
				"INPUT_PRODUCT" : scopeHandler.listViewMD.PRODUCT_CODE,
				"PRODUCT_NAME" : scopeHandler.listViewMD.PRODUCT_CODE,
				"INPUT_FUNCTION_CODE" : scopeHandler.listViewMD.FUNCTION_CODE,
				"INPUT_SUB_PRODUCT" : scopeHandler.listViewMD.SUB_PRODUCT_CODE,
				"WIDGET_ID" : scopeHandler.widgetID,
				"VIEW_ID" : scopeHandler.listViewMD.SYSTEM_VIEW_ID,
				"__PIGGYBACKREQUEST" : "Y"
		};
		var mutiViewObj = this.appEventRegistry.getMVObj();
		var addParams = mutiViewObj.raiseEvent(CWEC.EXTRA_PARAMS_HDLR,[params]);
		if(!cbx.isEmpty(addParams)){
			params = addParams;
		}
		var extraparams = scopeHandler.extraParamsHandler?scopeHandler.extraParamsHandler.apply(this.scope,[params]):params;
		extraparams = !cbx.isEmpty(this.extraParams) && cbx.isObject(this.extraParams)?cbx.apply(extraparams,this.extraParams):extraparams;
		extraparams = !cbx.isEmpty(mutiViewObj.getDefaultDateParams())?cbx.apply(extraparams,mutiViewObj.getDefaultDateParams()):extraparams;
		if(!cbx.isEmpty(additionalParams)){			
		cbx.apply(extraparams,additionalParams);
		}
		var cusTempID = scopeHandler.listViewMD.TEMPLATE_ID; 
		
		
		// Adding Sortables 
		var sorts = this.getSortable();
		if(!cbx.isEmpty(sorts)){
			$.extend(extraparams,sorts);
		}
		
		
		if(!cbx.isEmpty(cusTempID) && cusTempID != 'NONE' && scopeHandler.listViewMD.FLD_AUTOLOAD_IND == 'N' )
		{
				if( scopeHandler.listViewMD.FLD_VIEW_TYPE == 'TEMPLATE' && scopeHandler.listViewMD.FLD_AUTOLOAD_IND == 'N' )
			*//**If it is a custom static template, no need of data ajax call*//*
			callback.apply(scopeHandler,[[],{}]); 
		}
	else
		{
			*//**
			 * For default list view template and custom static template *//*
		cbx.ajax({
			params : extraparams,
			success : function(metadata){
			
				var allRecords = !cbx.isEmpty(metadata.response.value.ALL_RECORDS)?metadata.response.value.ALL_RECORDS:[];
				if(!cbx.isEmpty(scope)){
					
					if(metadata.response!=undefined){

						callback.apply(scope,[allRecords,metadata.response.value.ADDITIONAL_DATA]);
						}else{
						callback.apply(scope,[[],{}]); 	
						}
						
					}else{
						if(metadata.response!=undefined){

						callback.apply(scopeHandler,[allRecords,metadata.response.value.ADDITIONAL_DATA]); 
						}else{
						callback.apply(scopeHandler,[[],{}]); 
						}
					}
				
				
				},
				failure : function(){
					LOGGER.info("data ajax failed!!!!!!!!!!!");
			}
		});
		}
	},*/
	
	/*  EOF Replacing Temp JSON into Real Time Data */
	/*setListControlBusinessData : function(data,additionalData) {
		if(typeof data !== 'undefined'){
			this.controlBusinessData = {"enrichedViewMD": this.config,
			"businessData": data,"additionalData":additionalData,'listListener': this.listListeners};
	
			
			 *  Changed based on cbx.lib.view.List.js constructor
			 * cbx.lib.view.List 
			 * 1 : List Items (object)
			 * 2 : scope (object)
			 * 3 : Container to append list items
			 * 4 : Callback function triggers on long ROW or CELL press
			 *     returns scope, row data
			 
			 this.controlBusinessData.enrichedViewMD.appendTO.id = this.controlBusinessData.enrichedViewMD.widgetID+"_"+this.controlBusinessData.enrichedViewMD.md.VIEW_ID+"_CHART_CONTAINER";
			var viewConfig = {
						'listMD' : this.controlBusinessData,
					
						'parent' : this.parentElem.appendTO,
						'utilityScope' : this,
						'pagination' : 'swipe',			// number : numbered pagination, swipe : on swipe do paginate; default : number
						'appEventRegistry':this.appEventRegistry,
						'graphViewId' : this.controlBusinessData.enrichedViewMD.widgetID,
						'viewConf' : {
							'VIEW_MD' :  this.controlBusinessData.enrichedViewMD.md,
							'widgetID' : this.controlBusinessData.enrichedViewMD.widgetID
						},
						'mvConf' : {
							'el' : this.controlBusinessData.enrichedViewMD.appendTO,
							'id' : this.controlBusinessData.enrichedViewMD.appendTO.id,
							'clientWidth' : '100%',
							'clientHeight' : '390'
						}

					};
			//this
			viewConfig.mvConf.id = viewConfig.mvConf.el.id;
			if(viewConfig.listMD.enrichedViewMD.md.FLD_VIEW_TYPE=='CHART'){
			var that=this;
				this.listView = new canvas.chart.engine(viewConfig);
				 Switching logic for chart

				CWEH.registerHandler(this.controlBusinessData.enrichedViewMD.widgetID,"renderSwitchIcon",function(json){
					var chartRenderer = that.listView;
					var chartTypes = chartRenderer.getChartTypes();
					var viewChartAsStr ="";
					if(chartTypes.length>1){
					viewChartAsStr='<ul class="chart-buttons-holder"><span class="chartmenu-label">View Chart As:</span>';
					for(var i=0;i<chartTypes.length;i++){
						viewChartAsStr+='<li id='+chartTypes[i]+' class="icon-chart '+chartTypes[i]+'_CHART"></li>';
					}
					viewChartAsStr+='</ul>';
					($('#'+json.renderAt)).append(viewChartAsStr);
					($('#'+json.renderAt)).children().each(function(index){
						//if(index==1){
							$(this).children().bind('click',function() {
								for(var i = 0;i<chartTypes.length;i++){
									if(chartTypes[i] == this.id){
										json.config.isChartTypeBeingChanged = true;
										json.config.switchChartTo  = this.id;
										chartRenderer.constructor(json.config);
										}
									} 
								});
							//}
						});
					}

				  });
			}
			else if(viewConfig.listMD.enrichedViewMD.md.FLD_VIEW_TYPE=='TEMPLATE'){
				this.listView = new cbx.lib.view.Template(viewConfig);
			}else{
				this.massageListMD();
				this.listView = new cbx.lib.view.List(viewConfig);
			}
			
			$("#CONTENT_DIV").trigger('create');
		}
		else {
			LOGGER.error('Unable to get the busniss Data for the widget'+this.widgetID+ ' of list type'+this.config.FLD_LIST_TYPE);
			return;
		}
	},*/
	getViewComponent:function(){
		return this.listView;
	},
	
	/**
	 * @member massageListMD
	 * @memberof "cbx.lib.List.utility"
	 * @description Massages the list metadata before passing it to the default list view template or dynamic template construction
	 */
	massageListMD : function(){
			this.id = this.listViewMD.VIEW_ID;
	        this.parentId = iportal.jsutil.getRandomNumber()+"_"+this.listViewMD.VIEW_ID;
	        this.listStore =  this.controlBusinessData;
	        this.listData = this.listStore;
	        this.serverDateFormat = 'd/m/Y';
	        this.outDateFormat = canvas.datePreferences.getDateFormat();
	        this.columnArray = [];
	        this.columns = [];
	        this.count = 0;
		this.parsedNoOfRecs=this.listViewMD.FLD_RECORDS_PER_PAGE;
		this.perPage = this.parsedNoOfRecs && parseInt(this.parsedNoOfRecs)?parseInt(this.parsedNoOfRecs):Number(iportal.systempreferences.getDefaultPagesizeForMobile());
	        this.appEvtRegistry = this.appEventRegistry;
	        this.rtlTableDirection = iportal.preferences.isLangDirectionRTL() ?  'rtl' : 'ltr';
	        this.massageTableHeaderMD();
	},
	/**
	 * @member massageTableHeaderMD
	 * @memberof "cbx.lib.List.utility"
	 * @description Massages the list header related metadata and forms the object array for the same
	 */
	massageTableHeaderMD : function(){
		 	this.columnTitles=IMM.getViewDefinition(this.widgetID).getColumnList();
	        var viewMD = IMM.getViewDefinition(this.widgetID).md.VIEW_MD;
	        if (this.columnTitles.length > 0) {
	            for (var i = 0; i < this.columnTitles.length; i++) {
	            	var titleText = iportal.jsutil.getTextFromBundle(viewMD.FLD_BUNDLE_KEY,"LBL_"+this.columnTitles[i].FLD_COLUMN_DISPLAY_NAME_KEY);
	            	if(titleText === "LBL_"+this.columnTitles[i].FLD_COLUMN_DISPLAY_NAME_KEY){
	            		titleText = iportal.jsutil.getTextFromBundle(viewMD.FLD_BUNDLE_KEY,this.columnTitles[i].FLD_COLUMN_DISPLAY_NAME_KEY);
	            	}
	                var colObj = {
	                    "COL_ID": this.columnTitles[i].FLD_COLUMN_ID,
	                    "POSITION": this.columnTitles[i].FLD_POSITION,
	                    "HIDDEN_IND": this.columnTitles[i].FLD_HIDDEN_IND,
	                    "LIST_DATA": titleText,
						"DATA_TYPE" : this.columnTitles[i].FLD_DATA_TYPE,
	                    "VISIBLE_IND": this.columnTitles[i].FLD_VISIBLE_IND,
	                    "FLD_APPEND_CURRENCY_MODE" :this.columnTitles[i].FLD_APPEND_CURRENCY_MODE,
	                    "LINKED_SOURCE_CCY":this.columnTitles[i].LINKED_SOURCE_CCY
	                };
	                this.columnArray.push(colObj); 
	            }
		}
	}
});
		

		