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
 

cbx.ns('cbx.lib.view');
/*
 * This class is responsible for to create the list control @author PrimeSoft
 *
 
 */

cbx.lib.view.Chart = Class({
    constructor: function (config) {
    	if(typeof config == 'object'){
    		this.chart=$.init.chartView(config);
    	} else
    		return this.chart;  
    },
    getChartComponent:function(){
    	return chart
    }
});

$.widget("init.chartView", {
	
	/*
	 * Default configurations to prevent conflicts
	 */
	defaults : {
		'listMD' : {},
		'parent' : {},
		'utilityScope' : {},
		'pagination' : 'number'
	},
	/*
	 * primary constructor
	 * initate required meta data
	 */
	_init : function(){
        this.options = $.extend({},this.defaults,this.options);
        this.id = this.options.utilityScope.listViewMD.VIEW_ID+'_'+Math.random();
        this.chartType = this.options.utilityScope.listViewMD.FLD_CHART_TYPE;
        this.parentId = iportal.jsutil.getRandomNumber()+"_"+this.options.utilityScope.listViewMD.VIEW_ID;
    	this.appEvtRegistry = this.options.utilityScope.appEventRegistry;
        this.listData = this.options.listMD.businessData;
        this.columnArray = [];
        this.columns = [];
        this.count = 0;
        /*  Theme should be user defined */
        this.theme = 'tbl-jquery';
    	this.chartJSON = "";
		this.pieJSON = "";  
		this.widgetJSON = "";
		this.widgets=["AGAUGE","LGAUGE","HLED","VLED","POLE"];
       this.prepareJson();
       this.createChart();
       
	},
	prepareJson:function(){
		this.options.listMD.additionalData
		var refPts = this.options.listMD.additionalData!= undefined?this.options.listMD.additionalData:"";
		var alpha;
		if(refPts!="" && refPts!=undefined){
			if(refPts.CHART_FORMATTED_DATA.CHART_JSON!=undefined)
			this.chartJSON = cbx.decode(refPts.CHART_FORMATTED_DATA.CHART_JSON);
			if(refPts.CHART_FORMATTED_DATA.PIE_JSON!=undefined)
			this.pieJSON = cbx.decode(refPts.CHART_FORMATTED_DATA.PIE_JSON);
			if(refPts.CHART_FORMATTED_DATA.WIDGET_JSON!=undefined)
			this.widgetJSON = cbx.decode(refPts.CHART_FORMATTED_DATA.WIDGET_JSON);
			var highlightConfig = highlightConfig || { x : [],y : [] };
			highlightConfig.x = highlightConfig.x || [];
			highlightConfig.y = highlightConfig.y || [];
			if(!["AGAUGE","LGAUGE","HLED","VLED"].contains(this.chartType)){
			if(this.chartType=="PIE"){
				for ( var i = 0; i < this.pieJSON.data.length; i++) {
					alpha = highlightConfig == null ? "100" : (highlightConfig.x.indexOf(this.pieJSON.data[i].value) > -1 || highlightConfig.y.indexOf(this.pieJSON.data[i].label) > -1) ? "100" : "30";
					if (highlightConfig != null && highlightConfig.x.length == 0 && highlightConfig.y.length == 0) {
						alpha = "100";
					}
					this.pieJSON.data[i].alpha = alpha;									
				}
			}else{
				for ( var i = 0; i < this.chartJSON.dataset[0].data.length; i++) {
					for ( var j = 0; j < this.chartJSON.dataset.length; j++) {
						alpha = highlightConfig == null ? "100" : (highlightConfig.x.indexOf(this.chartJSON.dataset[j].seriesname) > -1 || highlightConfig.y.indexOf(this.chartJSON.dataset[j].data[i].value) > -1) ? "100" : "30";
						if (highlightConfig.x.indexOf(this.chartJSON.dataset[j].seriesname) > -1 || highlightConfig.y.indexOf(this.chartJSON.dataset[j].data[j].label) > -1) {
							this.chartJSON.dataset[i].data[i].anchorradius = (highlightConfig.x.length == 0 && highlightConfig.y.length == 0) ? "" : "6";
							this.chartJSON.dataset[i].data[i].anchorsides = (highlightConfig.x.length == 0 && highlightConfig.y.length == 0) ? "" : "4";
							this.chartJSON.dataset[i].data[i].anchorbordercolor = (highlightConfig.x.length == 0 && highlightConfig.y.length == 0) ? "" : "000000";
							this.chartJSON.dataset[i].data[i].anchorbgcolor = (highlightConfig.x.length == 0 && highlightConfig.y.length == 0) ? "" : "FF0000";
						} else {
							var alphaLocal = (this.chartType == "LINE"|| this.chartType == "ZOOMLINE" || (highlightConfig.x.length == 0 && highlightConfig.y.length == 0)) ? "100" : alpha;
							this.chartJSON.dataset[j].data[i].alpha = alphaLocal;
						}
					}							
				}
			}	}						
		}else{
			alert('No Data');
			return;
		}
	},
	swfArray:function(){
		var obj={};
		obj['BAR']="/CTRIAFramework/javascript/CBXCharts/MSColumn3D.swf";
		obj['ZOOMLINE']="/CTRIAFramework/javascript/CBXCharts/ZoomLine.swf";
		obj['HBAR']="/CTRIAFramework/javascript/CBXCharts/MSBar3D.swf";
		obj['DUAL']="/CTRIAFramework/javascript/CBXCharts/MSColumn3DLineDY.swf";
		obj['PLSB']="/CTRIAFramework/javascript/CBXCharts/MSColumn3DLineDY.swf";
		obj['LINE']="/CTRIAFramework/javascript/CBXCharts/MSLine.swf";
		obj['SBAR']="/CTRIAFramework/javascript/CBXCharts/StackedColumn3D.swf";
		obj['HSBAR']="/CTRIAFramework/javascript/CBXCharts/StackedBar3D.swf";
		obj["PIE"]="/CTRIAFramework/javascript/CBXCharts/Pie3D.swf";
		obj["DONUT"]="/CTRIAFramework/javascript/CBXCharts/StackedColumn3D.swf";
		obj["AGAUGE"]="/CTRIAFramework/javascript/CBXCharts/AngularGauge.swf";
		obj["POLE"]="/CTRIAFramework/javascript/CBXCharts/VBullet.swf";
		obj["LGAUGE"]="/CTRIAFramework/javascript/CBXCharts/HLinearGauge.swf";
		obj["HLED"]="/CTRIAFramework/javascript/CBXCharts/HLED.swf";
		obj["VLED"]="/CTRIAFramework/javascript/CBXCharts/VLED.swf";
		obj["PYRAMID"]="/CTRIAFramework/javascript/CBXCharts/Pyramid.swf";
		obj["FUNNEL"]="/CTRIAFramework/javascript/CBXCharts/Funnel.swf";
		return obj;
	
	},
	createChart: function () {
			if (this.chartType != null ) {							
				if (this.chartType == "BAR") {
					this.loadChart(this.swfArray()['BAR'],this.chartJSON);
				} else if (this.chartType == "ZOOMLINE") {
					this.loadChart(this.swfArray()['ZOOMLINE'],this.chartJSON);
				} else if (this.chartType == "HBAR") {
					this.loadChart(this.swfArray()['HBAR'],this.chartJSON);
				} else if (this.chartType == "DUAL" || this.chartType == "PBSL") {
					this.loadChart(this.swfArray()['DUAL'],this.chartJSON);
				} else if (this.chartType == "PLSB") {
					var primaryYAxis = this.chartJSON.chart.pyAxisName;
					this.chartJSON.chart.pyAxisName = this.chartJSON.chart.syAxisName;
					this.chartJSON.chart.syAxisName = primaryYAxis;
					for (var i = 0; i<this.chartJSON.dataset.length; i++){
						if(this.chartJSON.dataset[i].parentyaxis == undefined || this.chartJSON.dataset[i].parentyaxis == 'P' || this.chartJSON.dataset[i].parentyaxis == ""){
							this.chartJSON.dataset[i].parentyaxis = 'S';
						}else if(this.chartJSON.dataset[i].parentyaxis == 'S'){
							this.chartJSON.dataset[i].parentyaxis = "";
						}
					}
					this.loadChart(this.swfArray()['PLSB'],this.chartJSON);
				} else if (this.chartType == "LINE") {
					this.loadChart(this.swfArray()['LINE'],this.chartJSON);
				} else if (this.chartType == "SBAR") {
					this.loadChart(this.swfArray()['SBAR'],this.chartJSON);
				} else if (this.chartType == "HSBAR") {
					this.loadChart(this.swfArray()['HSBAR'],this.chartJSON);
				} else if (this.chartType == "PIE") {
					this.loadChart(this.swfArray()['PIE'],this.pieJSON);
				} else if (this.chartType == "DONUT") {
					this.loadChart(this.swfArray()['DONUT'],this.chartJSON);
				} else if (this.chartType == "AGAUGE") {
					this.loadChart(this.swfArray()['AGAUGE'],this.widgetJSON);
				} else if (this.chartType == "POLE") {
					this.loadChart(this.swfArray()['POLE'],this.widgetJSON);
				} else if (this.chartType == "LGAUGE") {
					this.loadChart(this.swfArray()['LGAUGE'],this.widgetJSON);
				} else if (this.chartType == "HLED") {
					this.loadChart(this.swfArray()['HLED'],this.widgetJSON);
				} else if (this.chartType == "VLED") {
					this.loadChart(this.swfArray()['VLED'],this.widgetJSON);
				} else if (this.chartType == "PYRAMID") {
					this.loadChart(this.swfArray()['PYRAMID'],this.pieJSON);
				} else if (this.chartType == "FUNNEL") {
					this.loadChart(this.swfArray()['FUNNEL'],this.pieJSON);
				}
			}
	},
	loadChart : function (chartSWF,chartJSON){
		var that=this;
		CBXDOWNLOADMGR.requestScripts('jqm_CHART_PLUGIN',function(){
			that.parentDivId='#'+that.options.listMD.enrichedViewMD.widgetID;
			var chartId=Math.random()
			that.chart = new FusionCharts(iportal.workspace.metadata.getContextRoot()+chartSWF,Math.random(),'100%', '390',"0", "1");
						that.chart.setJSONData(chartJSON);
						that.chart.setTransparent(true);
						that.chart.render($(that.options.parent).get(0));
						doIScroll("CONTENT_DIV","refresh");
						that.chart.resizeTo('100%','400');	
				if((($($(that.parentDivId).children()[1])).children[1])==undefined)
					that.myChartListener();
			});
			},
		getChartTypes : function() {
			var that = this;
			var chartTypesArray = [];

			if(["DUAL","PBSL","PLSB"].contains(this.chartType)){
				this.chartsDisplay = ["PBSL","PLSB"];
			}else{
					this.chartsDisplay =this.options.listMD.additionalData.CHART_FORMATTED_DATA.CHART_TYPES;
					if(Ext.isEmpty(this.chartsDisplay)||this.chartsDisplay.length==0){
						if (this.widgets.contains(this.options.listMD.enrichedViewMD.md)) {
								this.chartsDisplay = [ "AGAUGE", "LGAUGE", "HLED","VLED", "POLE" ];
						} else {
						var chartData = cbx.decode(this.options.listMD.additionalData.CHART_FORMATTED_DATA.CHART_JSON);
							if (chartData.dataset.length==1) {
								this.chartsDisplay = [ "LINE", "ZOOMLINE","BAR", "HBAR", "PIE", "DONUT","PYRAMID", "FUNNEL" ];
							} else if (chartData.dataset.length>1) {
								this.chartsDisplay = [ "LINE", "ZOOMLINE","BAR", "HBAR", "SBAR", "HSBAR", "DONUT" ];								}
							}
						}																		
				}
				
			return this.chartsDisplay;
			},
	myChartListener:function(){
		var that=this;
		var chartArray=this.options.listMD.enrichedViewMD.md.FLD_SWITCHING_CHARTS.split(',');
		if(chartArray==undefined || chartArray.length==0 || (chartArray.length==1 && chartArray[0]=='')){
			chartArray=this.getChartTypes();
		}
		if(chartArray.length>1){
			this.viewChartAsStr='<ul class="chart-buttons-holder"><span class="chartmenu-label">View Chart As:</span>';
			for(var i=0;i<chartArray.length;i++){
				this.viewChartAsStr+='<li id='+chartArray[i]+' class="icon-chart '+chartArray[i]+'_CHART"></li>';
			}
			this.viewChartAsStr+='</ul>';
			($(that.options.parent)).append(this.viewChartAsStr);
			($(that.options.parent)).children().each(function(index){
				if(index==1){
					$(this).children().bind('click',function() {
						that.chartType=this.id;
						that.createChart();
					});
				}
			
			});
		
		}
	}
});


function onClickChartData(paramsStr) {
	var params = paramsStr.split(",");
		LOGGER.info('params ', params);
		var widgetContainer =  cbx.core.ws.metadata.getCurrentWorkspace().getWidgetContainer();
		var widgetObj = widgetContainer.appMVRegistry.getWidget(params[0]);
		var viewObj =widgetObj.getViewObj();
		LOGGER.info('viewObj ', viewObj);
		var dataElemDtls = {};
		dataElemDtls['VIEW_ID'] = params[0];
		dataElemDtls['X_LABEL'] = params[1];
		dataElemDtls['X_VALUE'] = params[2];
		dataElemDtls['Y_LABEL'] = params[3];
		dataElemDtls['Y_VALUE'] = params[4];
		LOGGER.debug("graphdrilldown : ", cbx.encode(dataElemDtls));
		if(!cbx.isEmpty(widgetObj)){
		viewObj.appEvents.getMVObj().raiseEvent(CWEC.GRAPH_DRILL_DOWN,widgetObj,dataElemDtls);
		}	
}
