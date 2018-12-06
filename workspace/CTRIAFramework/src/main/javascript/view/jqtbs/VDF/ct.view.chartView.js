/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
/**
 * @namespace "ct.view"
 * @description The name space ct.view are useful for organizing the code.<br>
 *              It provides 2 main benefits.<br>
 *              The first is that we can use them to prevent polluting the global namespace with objects,which is
 *              generally considered to be undesireable. cbx, for example has just a single global object (the cbx
 *              object). It's good practice to put any classes inside a namespace, a commonone is the name of your
 *              company or the name of your application.The other advantage is that assists in keeping our code
 *              organized, we can group together similar or co-dependent classes in the same namespace, which helps to
 *              specify your intent to other developers.
 */
cbx.ns('ct.view');
/**
 * @class "ct.view.chartView"
 * @extends "cbx.core.Component"
 * @description This class is used for creating chartView View.
 * @author Karthik Velayudham
 */
ct.view.chartView = Class(cbx.core.Component, {

	listViewMD : null,
	respData : null,
	graphViewId : null,
	rb : null,
	extraParamsHandler : null,
	emptyTextMsg : null,
	chartH : 0,
	chartW : 0,
	chartTypes : ["BAR","HBAR","SBAR","HSBAR","LINE","ZOOMLINE","PIE","DONUT","PYRAMID","FUNNEL","AGAUGE","LGAUGE","HLED","VLED","POLE","PBSL","PLSB","MSBAR","DUAL","LDUAL","DUALLINE","SWITCH_TO_GRID","SWITCH_TO_CHART"],
	widgets : ["AGAUGE","LGAUGE","HLED","VLED","POLE"],
	params : null,
	refCount : 0,
	svgStr : null,
	/**
	 * @method "initialize"
	 * @memberof "ct.view.chartView"
	 * @description "Initialize the chart view component"
	 */
	initialize : function ()
	{
		var me = this.md;
		this.widgetId = me.WIDGET_ID;
		if(me.md == undefined){
			me = this;
		}
		this.parentElem = me.md.elem;
		this.vmd = me.md.VIEW_MD;
		this.listViewMD = this.vmd;
		this.params = {
					"__LISTVIEW_REQUEST" : "Y",
					"PAGE_CODE_TYPE" : 'VDF_CODE',
					"INPUT_ACTION" : "INIT_DATA_ACTION",
					"INPUT_PRODUCT" : this.vmd.PRODUCT_CODE,
					"PRODUCT_NAME" : this.vmd.PRODUCT_CODE,
					"INPUT_FUNCTION_CODE" : this.vmd.FUNCTION_CODE,
					"INPUT_SUB_PRODUCT" : this.vmd.SUB_PRODUCT_CODE,
					"WIDGET_ID" : this.widgetId,
					"VIEW_ID" : this.vmd.SYSTEM_VIEW_ID,
					"LAYOUT_ID" :iportal.workspace.metadata.getCurrentLayoutId(),
					"WORKSPACE_ID" :iportal.workspace.metadata.getCurrentWorkspaceId(),
					"forceCallbacks" : true
			};
		this.getViewData(this.params);

		
		
	},
	/*updateChartData : function(actionCode,addlFilters) {
			this.params['CHART_ACTION_CODE'] = actionCode;
			if(addlFilters!="" || !(addlFilters.length>0)){
				this.params['ADDL_FILTERS'] = JSON.stringify(addlFilters);								
			}
			this.getViewData(this.params);
			this.params['CHART_ACTION_CODE'] = "";
		delete this.params['CHART_ACTION_CODE'];
	},*/
	
	/**
	 * @method "getExportContent"
	 * @memberof "ct.view.chartView"
	 * @description "returns the svg string of the chart view which will be used for exporting and printing the charts"
	 */
	getPrintContent : function(){
		
		return this.svgStr+"<br><html>"+this.listTemplate+"</html>";
		
	},
	getExportContent : function(){
		
		return this.svgStr;
		
	},
	/**
	 * @method "disposeAvailable"
	 * @memberof "ct.view.chartView"
	 * @description "to remove the instance of the chart view"
	 */
	disposeAvailable : function(){
		//deleting the chart object
		if (this.chartRef && this.chartRef.dispose) {
			this.chartRef.dispose();
			this.chartRef = null;
		}
		//deleting the content in the div
		this.elem.empty();
	},
	minMaxChartResponsiveness : function(){
		this.disposeAvailable();
		this.elem.html(this.listTemplate);
	},

	/**
	 * @method "initList"
	 * @memberof "ct.view.chartView"
	 * @description "added to initialize the list view of the chart when the user clicks on 'Switch to Grid View' tool"
	 */
	initList : function(){
		//hiding the switching chart type menus from the chart tool option 
		for(var i=0; i<this.chartTypes.length; i++){
				this.portlet.portletHeaderDiv.find('[data-item-id=portlet_'+this.chartTypes[i]+']').removeClass('show').addClass('hidden');
		}
		//showing the 'Switch to Chart View' menu
		this.portlet.portletHeaderDiv.find('[data-item-id=portlet_SWITCH_TO_CHART]').removeClass('hidden').addClass('show');	
		this.elem.html(this.listTemplate);
		
	},
	/**
	 * @method "renderListView"
	 * @memberof "ct.view.chartView"
	 * @description "added to get the list view data and to render the list view in the same view as chart"
	 */
	renderListView: function(config){
		this.templateURL = "charttolistswitchlist.cttpl";
		this.tpl = new ct.lib.tmplLayer(this.templateUrl);
		var alldata =config.md.response.value.ALL_RECORDS;
		var header=[];
		var listRecords=[];
		var i=0;
		var rows=[];
		var prepareParams={};
		if(alldata[0]){
			for(key in alldata[0]){
				header[i]={"col":this.rb["LBL_"+key]};
				i++;
			}
		}
		for(var i=0 ;i<alldata.length;i++){
			var obj=[];
			for(key in alldata[i]){
				var params={};
				params.colKey=key;
				params.rowValue=alldata[i][key];
				obj.push(params);
			}
			rows.push(obj);
		}
		prepareParams.rows=rows;
		prepareParams.header=header;
		var tmpLayer = new ct.lib.tmplLayer('charttolistswitchlist.cttpl',prepareParams);
		tmpLayer.getTemplate(this.buildList, this);
		
		
	},
	buildList : function(template){
		this.listTemplate=template;
	},
	/**
	 * @method "showEmptyMsgForCharts"
	 * @memberof "ct.view.chartView"
	 * @description "added to show the empty message when there is no data to plot the chart"
	 */
	showEmptyMsgForCharts :  function(){
		this.elem.append(this.rb.NO_DATA_MSG_CHART || this.rb.NO_DATA_MSG);
		return;
	},
	/**
	 * @method "refresh"
	 * @memberof "ct.view.chartView"
	 * @description "added to refresh the view"
	 */

	refresh : function(){
		this.disposeAvailable();
		this.getViewData(this.params);
	},
	maximizeOpen : function (){
		this.disposeAvailable();
		this.getViewData(this.params);
	},
	refreshViewAfterModalClose: function(){
		var that =this;
		setTimeout(function(){
			that.disposeAvailable();
			that.getViewData(that.params);
		}, 350);
	},
	/**
	 * @method "exportToPDF"
	 * @memberof "ct.view.chartView"
	 * @description "added to export the chart view as PDF"
	 */
	exportToPDF: function(){
			ct.app.exportHandler.execute(this,'PDF');			
	},
	/**
	 * @method "exportToExcel"
	 * @memberof "ct.view.chartView"
	 * @description "added to export the chart view as Excel"
	 */
	exportToExcel: function(){
		ct.app.exportHandler.execute(this,'XLS');
	},
	/**
	 * @method "exportToCSV"
	 * @memberof "ct.view.chartView"
	 * @description "added to export the chart view as CSV"
	 */
	exportToCSV: function(){
		ct.app.exportHandler.execute(this,'CSV');
	},
	/**
	 * @method "print"
	 * @memberof "ct.view.chartView"
	 * @description "added to print the chart"
	 */
	print: function(){
		ct.app.exportHandler.execute(this,'PRINT');
	},
	/**
	 * @method "loadHighlightedChart"
	 * @memberof "ct.view.chartView"
	 * @description "added to highlight the chart's data elements as per the configuration/a pre-defined case"
	 */
	loadHighlightedChart : function(highlightConfig) {
		this.highlight = 'Y';
		this.disposeAvailable();
		this.initChart(highlightConfig);
		return;
	},
	/**
	 * @method "initChart"
	 * @memberof "ct.view.chartView"
	 * @description "This method is the starting point of painting the graphs
	 * and will do the following Calculate the available height
	 * and width from the parent container ref. Create an instance of the correct
	 * graph object as per the meta data."
	 */
	initChart : function(highlightConfig){
		var viewList = this.md.md.VIEWS_LIST;
		var that = this;
		var currView = viewList.filter(function(data,index){
			return data.VIEW_ID == that.md.md.VIEW_MD.VIEW_ID;
		});
		this.flag = '';
		this.chartType = this.vmd.FLD_CHART_TYPE;
		this.rb = CRB.getBundle(this.vmd.FLD_BUNDLE_KEY != null ? this.vmd.FLD_BUNDLE_KEY : CRB.getFWBundleKey());
		this.chartW = "100%";
		this.chartH = this.elem.width()!=undefined ? this.elem.width()/2 : 300;
		this.graphTitle = this.rb[this.vmd.VIEW_DISPLAY_NM] != null ? this.rb[this.vmd.VIEW_DISPLAY_NM] : this.vmd.VIEW_DISPLAY_NM;
		this.disposeAvailable();
		var refPts = this.respData!= null && this.respData.ADDITIONAL_DATA!=undefined ? this.respData.ADDITIONAL_DATA : "";
		var chartJSON = "",pieJSON = "",widgetJSON = "",alpha,isMultiChart="";
		var availableCharts=[];
		if(refPts!="" && refPts!=undefined && refPts.hasOwnProperty("CHART_FORMATTED_DATA")){
			chartJSON = refPts.CHART_FORMATTED_DATA.CHART_JSON;
			pieJSON = refPts.CHART_FORMATTED_DATA.PIE_JSON;
			widgetJSON = refPts.CHART_FORMATTED_DATA.WIDGET_JSON;
			switchingCharts = refPts.CHART_FORMATTED_DATA.CHART_TYPES;
			if(!switchingCharts.contains(this.chartType))
				switchingCharts.push(this.chartType);
			isMultiChart = refPts.CHART_FORMATTED_DATA.IS_MULTI_CHART;
			if(cbx.isEmpty(switchingCharts) || switchingCharts.length==0 || switchingCharts==""){
				if (this.widgets.contains(this.chartType)) {
					switchingCharts = [ "AGAUGE", "LGAUGE", "HLED","VLED", "POLE" ];
			}else {
				if (isMultiChart === "N") {
					switchingCharts = [ "LINE", "ZOOMLINE","BAR", "HBAR", "PIE", "DONUT","PYRAMID", "FUNNEL" ];
				} else if (isMultiChart === "Y") {
					switchingCharts = [ "LINE", "ZOOMLINE","BAR", "HBAR", "SBAR", "HSBAR"/*,"MPIE", "DONUT"*/ ];
				}
			}
		}	
			/*if(["DUAL","LDUAL","DUALLINE"].contains(this.chartType)){
			switchingCharts = ["DUAL","LDUAL","DUALLINE"];
			}*/	
		if (this.widgets.contains(this.chartType)) {
			availableCharts = [ "AGAUGE", "LGAUGE", "HLED","VLED", "POLE" ];
			for(var i=0;i<switchingCharts.length;i++){
				if(availableCharts.indexOf(switchingCharts[i])==-1){
					switchingCharts.splice(i,1);
					i=i-1;
			}
			}
		}
		else{
			availableCharts = ["BAR","HBAR","SBAR","HSBAR","LINE","ZOOMLINE","PIE","DONUT","PYRAMID","FUNNEL","PBSL","PLSB","MSBAR","DUAL","LDUAL","DUALLINE"];
			for(var i=0;i<switchingCharts.length;i++){
				if(availableCharts.indexOf(switchingCharts[i])==-1){
					switchingCharts.splice(i,1);
					i=i-1;
			}
			}
		}
		switchingCharts.push("SWITCH_TO_GRID");
			for(var i=0; i<this.chartTypes.length; i++){
				this.portlet.portletHeaderDiv.find('[data-item-id=portlet_'+this.chartTypes[i]+']').removeClass('hidden').addClass('show');
				if(switchingCharts.indexOf(this.chartTypes[i])==-1){
					this.portlet.portletHeaderDiv.find('[data-item-id=portlet_'+this.chartTypes[i]+']').removeClass('show').addClass('hidden');
				}
				this.portlet.portletHeaderDiv.find('[data-item-id=portlet_'+this.chartTypes[i]+']').removeClass('ct-dropdown-menu-txt-active').addClass('ct-dropdown-menu-txt');
			}
			this.portlet.portletHeaderDiv.find('[data-item-id=portlet_SWITCH_TO_CHART]').removeClass('show').addClass('hidden');
			this.portlet.portletHeaderDiv.find('[data-item-id=portlet_'+this.chartType+']').removeClass('ct-dropdown-menu-txt').addClass('ct-dropdown-menu-txt-active');			
			var colMetaData = this.vmd.FLD_COLUMN_LIST,amtCols=[],tmpVal="";
			for(var x=0; x<colMetaData.length; x++){
				if(colMetaData[x]['FLD_DATA_TYPE'] == 'float'){
					amtCols.push(colMetaData[x].FLD_COLUMN_ID);
				}
			}
			if(!this.widgets.contains(this.chartType)){
				if(this.chartType=="PIE"){
					for ( var i = 0; i < pieJSON.data.length; i++) {
						alpha = highlightConfig == null ? "100" : (highlightConfig.x.indexOf(pieJSON.data[i].value) > -1 || highlightConfig.y.indexOf(pieJSON.data[i].label) > -1) ? "100" : "30";
						if (highlightConfig != null && highlightConfig.x.length == 0 && highlightConfig.y.length == 0) {
							alpha = "100";
						}
						pieJSON.data[i].alpha = alpha;									
					}
				}else{
					if(!this.chartType=="MSBAR"){
					for ( var i = 0; i < chartJSON.dataset[0].data.length; i++) {
						for ( var j = 0; j < chartJSON.dataset.length; j++) {
							alpha = highlightConfig == null ? "100" : (highlightConfig.x.indexOf(chartJSON.dataset[j].seriesname) > -1 || highlightConfig.y.indexOf(chartJSON.dataset[j].data[i].value) > -1) ? "100" : "30";
							if (highlightConfig.x.indexOf(chartJSON.dataset[j].seriesname) > -1 || highlightConfig.y.indexOf(chartJSON.dataset[j].data[j].label) > -1) {
								chartJSON.dataset[i].data[i].anchorradius = (highlightConfig.x.length == 0 && highlightConfig.y.length == 0) ? "" : "6";
								chartJSON.dataset[i].data[i].anchorsides = (highlightConfig.x.length == 0 && highlightConfig.y.length == 0) ? "" : "4";
								chartJSON.dataset[i].data[i].anchorbordercolor = (highlightConfig.x.length == 0 && highlightConfig.y.length == 0) ? "" : "000000";
								chartJSON.dataset[i].data[i].anchorbgcolor = (highlightConfig.x.length == 0 && highlightConfig.y.length == 0) ? "" : "FF0000";
							} else {
								var alphaLocal = (that.chartType == "LINE"|| that.chartType == "ZOOMLINE" || (highlightConfig.x.length == 0 && highlightConfig.y.length == 0)) ? "100" : alpha;
								chartJSON.dataset[j].data[i].alpha = alphaLocal;
							}
						}							
					}
				}}
			for ( var i = 0; i < chartJSON.dataset.length; i++) {
				for ( var j = 0; j < chartJSON.dataset[i].data.length; j++) {
					if(!(amtCols.indexOf(chartJSON.dataset[i].data[j].COLUMN_ID)<0)){
						tmpVal = this.formatAmt(chartJSON.dataset[i].data[j].value);
						//LOGGER.info(chartJSON.dataset[i].data[j].value,tmpVal);
						chartJSON.dataset[i].data[j].tooltext = (chartJSON.dataset[i].data[j].tooltext).replace(chartJSON.dataset[i].data[j].value,tmpVal);
					}
				}							
				}	
			}else if(this.widgets.contains(this.chartType)){
				widgetJSON.dials.dial[0].value = this.formatAmt(widgetJSON.dials.dial[0].value);
				widgetJSON.pointers.pointer[0].value = this.formatAmt(widgetJSON.pointers.pointer[0].value);
			}
			this.feedChart(chartJSON, pieJSON, widgetJSON);
		}else if(this.respData.ADDITIONAL_DATA.hasOwnProperty("ENTL_ERROR") || currView.IS_ENTITLED == "N"){
			var notEntitled_key = this.md.md.VIEW_MD.SYSTEM_VIEW_ID+"_NOT_ENTITLED_WIDGET";
			var text = CRB.getBundleValue(this.vmd.FLD_BUNDLE_KEY,notEntitled_key);
        	if(cbx.isEmpty(text)){
        		text = CRB.getFWBundleValue("NOT_ENTITLED_WIDGET");
        	}
			this.elem.append(text);
		}else {
			this.showEmptyMsgForCharts();
			return;
		}						
		this.feedChart(chartJSON, pieJSON, widgetJSON);					
	},
	
	formatAmt : function(value){
		//code to be added to format the amount
		return value;
	},
	/**
	 * @method "feedChart"
	 * @memberof "ct.view.chartView"
	 * @description "This method is added to map the swf file to the chart view as per the configuration."
	 */
	feedChart : function(chartJSON, pieJSON, widgetJSON){
		if (this.chartType != null ) {					
			if(this.chartType.indexOf('2')!=-1){
				chartJSON["use3dlighting"] = "0";
				pieJSON["use3dlighting"] = "0";
				chartJSON["showshadow"] = "0";
				pieJSON["showshadow"] = "0";
			}
			if (this.chartType == "BAR") {
				this.loadChart(iportal.workspace.metadata.getContextRoot()+"/CTRIAFramework/javascript/CBXCharts/MSColumn3D.swf",chartJSON);
			} else if (this.chartType == "BAR2D") {
				this.loadChart(iportal.workspace.metadata.getContextRoot()+"/CTRIAFramework/javascript/CBXCharts/MSColumn2D.swf",chartJSON);
			} else if (this.chartType == "ZOOMLINE") {
				this.loadChart(iportal.workspace.metadata.getContextRoot()+"/CTRIAFramework/javascript/CBXCharts/ZoomLine.swf",chartJSON);
			} else if (this.chartType == "HBAR") {
				this.loadChart(iportal.workspace.metadata.getContextRoot()+"/CTRIAFramework/javascript/CBXCharts/MSBar3D.swf",chartJSON);
			} else if (this.chartType == "HBAR2D") {
				this.loadChart(iportal.workspace.metadata.getContextRoot()+"/CTRIAFramework/javascript/CBXCharts/MSBar2D.swf",chartJSON);
			} else if (this.chartType == "DUALLINE") {
				for (var i = 0; i<chartJSON.dataset.length; i++){
						chartJSON.dataset[i]["renderas"] = 'Line';
				}
				this.loadChart(iportal.workspace.metadata.getContextRoot()+"/CTRIAFramework/javascript/CBXCharts/MSColumn3DLineDY.swf",chartJSON);
			} else if (this.chartType == "DUAL") {
				LOGGER.info("DUAL",chartJSON);
				for (var i = 0; i<chartJSON.dataset.length; i++){
					if(chartJSON.dataset[i] && chartJSON.dataset[i].renderas != undefined){
						delete chartJSON.dataset[i].renderas;
					}if(chartJSON.dataset[i].INITIAL_SECONDARY == 'Y'){
						chartJSON.dataset[i].parentyaxis = 'S';
					}else{
						chartJSON.dataset[i].parentyaxis = '';
					}
				}
				this.loadChart(iportal.workspace.metadata.getContextRoot()+"/CTRIAFramework/javascript/CBXCharts/MSColumn3DLineDY.swf",chartJSON);
			} else if (this.chartType == "LDUAL") {
				var primaryYAxis = chartJSON.chart.pyAxisName;
				chartJSON.chart.pyAxisName = chartJSON.chart.syAxisName;
				chartJSON.chart.syAxisName = primaryYAxis;
				for (var i = 0; i<chartJSON.dataset.length; i++){
					if(chartJSON.dataset[i] && chartJSON.dataset[i].renderas != undefined){
						delete chartJSON.dataset[i].renderas;
					}
					if(chartJSON.dataset[i].parentyaxis == undefined || chartJSON.dataset[i].parentyaxis == 'P' || chartJSON.dataset[i].parentyaxis == ""){
						chartJSON.dataset[i].parentyaxis = 'S';
					}else if(chartJSON.dataset[i].parentyaxis == 'S'){
						chartJSON.dataset[i].parentyaxis = "";
					}
				}
				LOGGER.info("LDUAL",chartJSON);
				this.loadChart(iportal.workspace.metadata.getContextRoot()+"/CTRIAFramework/javascript/CBXCharts/MSColumn3DLineDY.swf",chartJSON);
			} else if (this.chartType == "LINE") {
				this.loadChart(iportal.workspace.metadata.getContextRoot()+"/CTRIAFramework/javascript/CBXCharts/MSLine.swf",chartJSON);
			} else if (this.chartType == "SBAR") {
				this.loadChart(iportal.workspace.metadata.getContextRoot()+"/CTRIAFramework/javascript/CBXCharts/StackedColumn3D.swf",chartJSON);
			} else if (this.chartType == "SBAR2D") {
				this.loadChart(iportal.workspace.metadata.getContextRoot()+"/CTRIAFramework/javascript/CBXCharts/StackedColumn2D.swf",chartJSON);
			} else if (this.chartType == "MSBAR") {
				this.loadChart(iportal.workspace.metadata.getContextRoot()+"/CTRIAFramework/javascript/CBXCharts/MSStackedColumn2D.swf",chartJSON);
			} else if (this.chartType == "HSBAR") {
				this.loadChart(iportal.workspace.metadata.getContextRoot()+"/CTRIAFramework/javascript/CBXCharts/StackedBar3D.swf",chartJSON);
			} else if (this.chartType == "HSBAR2D") {
				this.loadChart(iportal.workspace.metadata.getContextRoot()+"/CTRIAFramework/javascript/CBXCharts/StackedBar2D.swf",chartJSON);
			} else if (this.chartType == "PIE") {
				this.loadChart(iportal.workspace.metadata.getContextRoot()+"/CTRIAFramework/javascript/CBXCharts/Pie3D.swf",pieJSON);
			} else if (this.chartType == "PIE2D") {
				this.loadChart(iportal.workspace.metadata.getContextRoot()+"/CTRIAFramework/javascript/CBXCharts/Pie2D.swf",pieJSON);
			}else if (this.chartType == "DONUT") {
				this.loadChart(iportal.workspace.metadata.getContextRoot()+"/CTRIAFramework/javascript/CBXCharts/Doughnut3D.swf",pieJSON);
			} else if (this.chartType == "AGAUGE") {
				this.loadChart(iportal.workspace.metadata.getContextRoot()+"/CTRIAFramework/javascript/CBXCharts/AngularGauge.swf",widgetJSON);
			} else if (this.chartType == "POLE") {
				this.loadChart(iportal.workspace.metadata.getContextRoot()+"/CTRIAFramework/javascript/CBXCharts/VBullet.swf",widgetJSON);
			} else if (this.chartType == "LGAUGE") {
				this.loadChart(iportal.workspace.metadata.getContextRoot()+"/CTRIAFramework/javascript/CBXCharts/HLinearGauge.swf",widgetJSON);
			} else if (this.chartType == "HLED") {
				this.loadChart(iportal.workspace.metadata.getContextRoot()+"/CTRIAFramework/javascript/CBXCharts/HLED.swf",widgetJSON);
			} else if (this.chartType == "VLED") {
				this.loadChart(iportal.workspace.metadata.getContextRoot()+"/CTRIAFramework/javascript/CBXCharts/VLED.swf",widgetJSON);
			} else if (this.chartType == "PYRAMID") {
				this.loadChart(iportal.workspace.metadata.getContextRoot()+"/CTRIAFramework/javascript/CBXCharts/Pyramid.swf",pieJSON);
			} else if (this.chartType == "FUNNEL") {
				this.loadChart(iportal.workspace.metadata.getContextRoot()+"/CTRIAFramework/javascript/CBXCharts/Funnel.swf",pieJSON);
			}
		}
	},
	/**
	 * @method "loadChart"
	 * @memberof "ct.view.chartView"
	 * @description "Creating chart view component and loading the data into it."
	 */
	loadChart : function (chartSWF,chartJSON){
		var that = this;
		this.elem.empty();
		FusionCharts.setCurrentRenderer("javascript");
		var chart = new FusionCharts(chartSWF, that.widgetId+that.id+"_TEMP", that.chartW, that.chartH,"0", "1");
		chart.setJSONData(cbx.encode(chartJSON));
		chart.resizeTo(that.chartW,(0.8*that.chartW)||(0.8*that.chartH));
		var uniqueId = that.vmd.SYSTEM_VIEW_ID+"_TEMP";
		this.elem.append("<div id='"+uniqueId+"'></div>");
		chart.render(uniqueId);
		this.chartRef = chart;
		this.svgStr = chart.ref.getSVGString();
	},
	/**
	 * @method "switchChart"
	 * @memberof "ct.view.chartView"
	 * @description "added to enable viewing a chart as different charts as configured"
	 */
	switchChart : function(){
		var that = this;
		//this.portlet.portletHeaderDiv.find('[data-item-id=pieChartTool]').removeClass('show').addClass('hidden');
		for(var i=0; i<this.chartTypes.length; i++){
			this.portlet.portletHeaderDiv.find('[data-item-id=portlet_'+that.chartTypes[i]+']').unbind("click").bind('click',that,function (e) {
				var chartType = $(this).attr("data-item-id");
				chartType = chartType.replace("portlet_","");
				LOGGER.info(chartType);
				if(chartType=="SWITCH_TO_GRID"){
					that.portlet.portletHeaderDiv.find('[data-item-id=portlet_SWITCH_TO_GRID]').removeClass('show').addClass('hidden');
					that.portlet.portletHeaderDiv.find('[data-item-id=portlet_SWITCH_TO_CHART]').removeClass('hidden').addClass('show');
					that.vmd.FLD_VIEW_TYPE = "CHARTTOLIST";
					that.initList();
				}else if(chartType=="SWITCH_TO_CHART"){
					that.portlet.portletHeaderDiv.find('[data-item-id=portlet_SWITCH_TO_CHART]').removeClass('show').addClass('hidden');
					that.portlet.portletHeaderDiv.find('[data-item-id=portlet_SWITCH_TO_GRID]').removeClass('hidden').addClass('show');
					that.vmd.FLD_VIEW_TYPE = "CHART";
					that.initChart();
				}else{
				that.disposeAvailable();
				that.vmd.FLD_CHART_TYPE = chartType;
				that.initChart();
				}
			});
		}
		
	},
	/**
	 * @method "switchChart"
	 * @memberof "ct.view.chartView"
	 * @description "responsible to send AJAX call to get the view's data" 
	 */
	getViewData: function(params, callback){
		var that = this;
		CTLOADMASKMANAGER.initiateLoadMask(that.elem,iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(),"LOADING")+that.md.md.VIEW_MD.VIEW_DISPLAY_NM,that.elem);
		cbx.ajax({
			params : params,
			isGlobalMaskReq:false,
			success : function(data){
				CTLOADMASKMANAGER.hideLoadMask(that.elem,that.elem);
				that.viewConf.raiseEvent(CWEC.DATA_LOAD,data.response.value,that.vmd);
				that.respData = data.response.value;
				var config = { md: data };
				that.renderListView(config);		
				if(that.vmd.FLD_VIEW_TYPE == "CHART"){
					that.disposeAvailable();
					that.initChart();
					}else if(that.vmd.FLD_VIEW_TYPE == "CHARTTOLIST"){
						that.initList();
					}
				
			}
		});
	},
	getPerPage: function(){
		return parseInt(this.perPage);
	},

});
/**
 * Registering the chart view component to the CLCR Library.
 */

CLCR.registerCmp({
	'COMP_TYPE' : 'APP',
	'VIEW_TYPE' : 'CHART'
}, ct.view.chartView);
