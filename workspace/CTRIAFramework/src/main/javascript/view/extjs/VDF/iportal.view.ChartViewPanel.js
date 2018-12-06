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
 * iportal.view.ChartViewPanel
 */
 Ext.ns("iportal.view");
 iportal.view.ChartViewPanel =  Ext.extend(Ext.Panel, {
 	 extraParamsHandler : null,
	 initComponent: function(config){
	 	this.rb = CRB.getFWBundle(); 
	 	this.isChartAvail = false;
	 	var config = {
			xtype:'panel',
			height: iportal.jsutil.getWidgetResizeHeight(),
			//width: 386,					
			autoScroll:true,
			bbar:[],
			html:'<DIV class="chart" ID="'+this.genViewImgId()+'"></DIV>'
		};
	 	Ext.apply(this, config);
	  	iportal.view.ChartViewPanel.superclass.initComponent.apply(this);
	 },
	 genViewImgId : function(){
	  	return this.id+"_GRAPHICAL_VIEW_IMG"; 
	 },
	 afterRender : function(ct,position){
	 	iportal.view.ChartViewPanel.superclass.afterRender.apply(this, arguments);
	 	this.mask = new Ext.LoadMask(this.bwrap, {msg:CRB.getFWBundle()['LOADING_MSG']});
	 	this.loadData();	
	 },
	 refresh : function(){
	 	this.loadData();
	 },
	/**
    * Intended to check whether data or not.
    * Return true if available else false;
    */
    isChartAvailable :function(){
    	return this.isChartAvail;
    },
	 loadData : function(filterVals){
	 	this.mask.show();
	 	var prms={};
	 	prms.forceCallbacks = true;
	 	prms.WIDGET_ID= this.widgetId;
	 	prms.VIEW_ID = this.viewMeta.VIEW_MD.VIEW_ID;
	 	if(this.extraParamsHandler && Ext.isFunction(this.extraParamsHandler)){
	 		prms = this.extraParamsHandler.createDelegate(this.scope,[prms])();
	 	}
	 	if(Ext.isObject(filterVals)){
	 		Ext.apply(prms,filterVals);
	 	}
	 	IMM.initAjaxReq({
	 		params: prms,
	 		successhandler:this.setData,
	 		failurehandler:this.failureHandler,
	 		scope:this
	 	});
	 },
	 failureHandler : function(resp,opt){	 	
	 	this.getBottomToolbar().setVisible(false);
	 	this.mask.hide();
	 	this.noDataMsg();
	 },
	 noDataMsg : function(){
	 	this.isChartAvail = false;
	 	Ext.getDom(this.genViewImgId()).innerHTML = '<div class="x-grid3 x-grid3-body"><div class="x_grid_empty">'+CRB.getFWBundle().NO_DATA_MSG+'</div></div>';
	 },
	 noFxRateMsg : function(){
	 	this.isChartAvail = false;
	 	Ext.getDom(this.genViewImgId()).innerHTML = '<div class="x-grid3 x-grid3-body"><div class="x_grid_empty">'+CRB.getFWBundle().NO_FXRATE_MSG+'</div></div>';
	 },
	 setData : function(resp,opt){	 	
	 	var resp= Ext.decode(resp.responseText);
	 	if(resp.JSON_MAP && resp.JSON_MAP.response && resp.JSON_MAP.response.FATAL_ERROR){
	 		this.failureHandler();
	 		return;
	 	}
	 	if(resp.ERR_NO_FXRATE) {
	 	this.mask.hide();
		this.noFxRateMsg();	 	
	 	return;
	 	}
	 	var chartHtml = resp.IMAGE_MAP;		   					   					   			
		if (chartHtml != ''){
			chartHtml = chartHtml + "<img src='/iportalweb/ImageDownloadServlet?INPUT_ACTION=VIEW_ACTION&imageFileName=" + resp.IMAGE_FILE_NAME + "' usemap='#chartmap'>";
			Ext.getDom(this.genViewImgId()).innerHTML = chartHtml;
			this.isChartAvail = true;
		} else {
			this.mask.hide();
			this.noDataMsg();
			return;
		}		   					   			
		this.setLastUpdated(resp);
	 },
	 setLastUpdated : function(resp){
	 	var bar = this.getBottomToolbar();
	 	if(resp && resp.LAST_UPDATED_DT_TM){
	 		bar.setVisible(true);
	 		var date = iportal.jsutil.getFormattedDateAndTime(resp.LAST_UPDATED_DT_TM);	
	 		bar.addFill();
			var luLabel = bar.get(1);
			var luVal = bar.get(2);
			if(!luLabel){
				bar.addItem({
						xtype:'label',	
						html : "<div class='LAST_UPDATE_LABEL'>"+this.rb.LBL_LAST_UPDATED+"</div>"
						});
			}
			if(!luVal){
				bar.addItem({
					xtype:'label',	
					html :"<div class='LAST_UPDATE_LABEL_VALUE'>"+ date+'</div>'
					});	
			}else{
				luVal.el.dom.innerHTML = "<div class='LAST_UPDATE_LABEL_VALUE'>"+ date+'</div>';
				}
				bar.doLayout();
	 	}else{
	 		bar.setVisible(false);
	 	}
	  	this.mask.hide();	
	 }, 
	 /*
	 * method to refresh this view. This will refresh the view with the URL specified in constructor 
	 */
	refreshView : function(){
		this.mask.show();
		var loader = this.tree.getLoader();
		loader.baseParams['REFRESH_DATA']='Y';
		loader.load(this.tree.getRootNode(),function(){
			// This callback function will be called once the view has been reloaded
			// Hide the load mask here
	 		this.mask.hide();
	 	},this);	 	
	}
 });
 Ext.reg('chart-panel', iportal.view.ChartViewPanel);
 