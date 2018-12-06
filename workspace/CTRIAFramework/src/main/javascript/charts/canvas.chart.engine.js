cbx.namespace("canvas.chart");
canvas.chart.engine = Class(cbx.core.Component, {
	constructor : function(config){
		var framework = iportal.systempreferences.getFramework(); 
		config.isGridView = false;
		this.config = config;
		this.config.framework = framework;
		this.config.id=config.graphViewId+"_"+config.viewConf.VIEW_MD.VIEW_ID+"_CHART";
		this.createStore(this);
	},
	downloadChartLib : function(){
		var viewType = this.config.viewType = this.config.viewConf.VIEW_MD.FLD_VIEW_TYPE;
		var chartType = this.config.chartType = this.translateChartType(this.config.viewConf.VIEW_MD.FLD_CHART_TYPE);
		var chartLib = this.config.chartLib = canvas.env.chart.options.getChartLibFor(chartType); // Gets the chartLib from ENV
		this.config.currentChartType = chartType;
		var chartCategory;

		if(!cbx.downloadProvider.isCanvasDefaultConstant(chartLib+"_"+viewType+"_LIB"))
			{	
				CBXDOWNLOADMGR.requestScripts("USER_"+chartLib+"_"+viewType+"_LIB",function(){
				var compClass = CLCR.getCmp({"VIEW_TYPE":viewType,"CHART_TYPE":chartType,"CHART_LIB":chartLib});
				var comp = new compClass(this,chartCategory);
				comp.renderChart();
				},'js',this);                         //Downloads the user defined chart library
			}
		else{
				CBXDOWNLOADMGR.requestScripts(cbx.downloadProvider.getConstant(chartLib+"_"+viewType+"_LIB"),function(){
				var compClass = CLCR.getCmp({"VIEW_TYPE":this.config.viewType,"CHART_TYPE":this.config.chartType,"CHART_LIB":this.config.chartLib});
				if(!compClass)
					console.log("Unrecognized Chart Type");
				chartCategory = CLCR.getInitOptions({"VIEW_TYPE":this.config.viewType,"CHART_TYPE":this.config.chartType,"CHART_LIB":this.config.chartLib});
				console.log("1. MV_Charts Now rendering "+ this.config.chartType);
				var comp = new compClass(this,chartCategory);
				comp.renderChart();
				},'js',this);						 //Downloads the framework defined chart library
			}
		},

	isChartAvailable : function()
	{
			return true;
	},
	getChartcmpId : function() {
			return this.config.id;
	},
	getExportContent : function() {
		if(!this.config.isGridView)
			return this.getChartObj().getChartRef().getSVGString();	
		else
			return "gridview";
	},
	getGridData : function(){
		if(!this.config.isGridView)
			return this.getChartObj().getChartRef().getSVGString();	
		else;
			return this.loadGrid();
	},
	/*Used for export Dummy function*/
	getStore : function(){
		return {"sortInfo" : ""};
	},
	reloadData : function(){
		this.restoreDefaults();
		this.constructor(this.config);
	},
	restoreDefaults : function(){
		this.removeOptions();
		this.config.isChartTypeBeingChanged = "";
		this.config.currentChartType ="";
		this.config.seriesSwitch = "";
		this.config.newContainer = "";
	},
	getChartObj : function(){
		return new (CLCR.getCmp({"VIEW_TYPE":this.config.viewType,"CHART_TYPE":this.config.chartType,"CHART_LIB":this.config.chartLib}))(this);
	},
	/*
	*  This method translates the old chart ID to new chart ID as specified by fusioncharts 3.9.0
	*  This method can process both string type argument and array type argument.
	*/
	translateChartType : function(chartType){
		var chartTypeMap = {
				"AGAUGE":{"oldID" : "AGAUGE","newID" : "ANGULARGAUGE"},
				"LGAUGE":{"oldID" : "LGAUGE","newID" : "HLINEARGAUGE"},
				"BAR" :{"oldID" : "BAR","newID" : "COLUMN2D"},
				"HBAR" :{"oldID" : "HBAR","newID" : "BAR2D"},
				"PIE" :{"oldID" : "PIE","newID" : "PIE2D"},
				"DONUT" :{"oldID" : "DONUT","newID" : "DOUGHNUT2D"},
				"SBAR" :{"oldID" : "SBAR","newID" : "STACKEDCOLUMN2D"},
			    "HSBAR" :{"oldID" : "HBAR","newID" : "STACKEDBAR2D"},
				"DUAL" :{"oldID" : "DUAL","newID" : "MSCOMBIDY2D"}
		};
		if(typeof chartType == "string"){
			for(var oldChartType in chartTypeMap){
				if(oldChartType == chartType)
					chartType = chartTypeMap[oldChartType].newID;
			}
		}else if(typeof chartType == "object"){
			var newChartTypes = [];
			for (var i = chartType.length - 1; i >= 0; i--) {
				newChartTypes.push(this.translateChartType(chartType[i]));
			};
			var chartType = newChartTypes;
		}
		return chartType;
	},
	disposeAvailable : function(){
		var containerDiv = document.getElementById(this.config.mvConf.id);
		/**/
		if(this.getChartObj().getChartRef())
			this.getChartObj().disposeChart();
		while (containerDiv.hasChildNodes()) {
   			 containerDiv.removeChild(containerDiv.firstChild);
		}
		
	},
loadGrid : function(){
		
		var viewId = this.config.viewConf.VIEW_MD.VIEW_ID;
		var rawViewData =  canvas.env.chart.data.getChartViewDataOf(viewId);
		var viewData = rawViewData.response.value.ALL_RECORDS;
		var viewMD =this.config.viewConf.VIEW_MD;
		var columns = viewMD.FLD_COLUMN_LIST;
		var containerDiv = document.getElementById(this.config.mvConf.id);
		if(!containerDiv)
			containerDiv =  this.config.mvConf.id;
		var table = document.createElement("table");
		table.setAttribute("id", viewId+"_CHART_GRID");
		table.setAttribute("class","chart-grid");
		table.setAttribute("border","0");
		table.setAttribute("width","100%");
		table.setAttribute("height","100%");
		table.setAttribute("cellpadding","0");
		table.setAttribute("cellspacing","0");
		table.style.fontFamily = "Arial";
		table.style.fontSize = "11px";
		table.style.textAlign = "center";

		var thead = table.createTHead();
		//thead.style.backgroundColor = "#EEEEEE";
		thead.style.padding = "5px 4px 5px 4px";
		var cols =[];
		for(var i=0;i<columns.length;i++){
			if(columns[i].FLD_X_SERIES_IND == "Y" || columns[i].FLD_Y_SERIES_IND == "Y") {
				var tdata = document.createElement("TD");
				tdata.style.padding = "5px 4px 5px 4px";
				var tnode = tdata.appendChild(document.createTextNode(columns[i].FLD_COLUMN_DISPLAY_NAME_KEY));
				thead.appendChild(tdata);
				cols.push(columns[i].FLD_COLUMN_ID);
			}
		}
		for(var i=0;i<viewData.length;i++){
			var trow = table.insertRow(i);
			for(var j=0;j<cols.length;j++){
				var rdata = document.createElement("TD");
				var rNode = document.createTextNode(viewData[i][cols[j]]);
				rdata.style.borderRight = "1px solid rgba(255,255,255,0.30)";
				rdata.style.borderBottom = "1px solid rgba(255,255,255,0.30)";
				if(i%2!=0)
					rdata.style.backgroundColor = "#eee";
				rdata.style.padding = "5px 4px 5px 4px";
				rdata.appendChild(rNode);
				trow.appendChild(rdata);
			}
		}
		
		containerDiv.style.overflowY  = "scroll";
		containerDiv.appendChild(table);
		if(this.config.isGridView){
			table.width = "600px";
			table.height = "600px";
			return table.outerHTML;
			}
		this.config.isGridView = true;
	},
	getChartTypes : function(){
		var that = this;
		var chartList = ["BAR2D","BAR3D","COLUMN2D","COLUMN3D","PIE2D","PIE3D","DOUGHNUT2D","DOUGHNUT3D","PYRAMID","LINE","AREA2D","FUNNEL"];
		var chartListFromMD = this.config.viewConf.VIEW_MD.FLD_SWITCHING_CHARTS;
		var temp = [];
		if(!cbx.isEmpty(chartList)){
			chartList = this.translateChartType(chartListFromMD.split(","));
			if(!chartList.contains(this.config.viewConf.VIEW_MD.FLD_CHART_TYPE))
				chartList.push(this.translateChartType(this.config.viewConf.VIEW_MD.FLD_CHART_TYPE));
				for (var i = chartList.length - 1; i >= 0; i--) {
					if(chartList[i]!= this.translateChartType(this.config.currentChartType))
						temp.push(chartList[i]);
				}
			var chartList = temp;		
		}
		return chartList;
	},
   /*
	* The framework is not using chartType method of FusionCharts due to switching constraints
	* chartType method does not allow us to switch from single_series to multi series.
	*/
	switchChart : function(config){
		var renderedChart = this.getChartObj().getChartRef();
		var configuredChartClassification = this.getChartClassfication(this.translateChartType(this.config.viewConf.VIEW_MD.FLD_CHART_TYPE));
		var toBeSwitchedChartClassification = this.getChartClassfication(this.config.switchChartTo);
		var currentChartClassification = this.getChartClassfication(renderedChart.chartType().toUpperCase());
		if(currentChartClassification == toBeSwitchedChartClassification){
				//renderedChart.chartType(config.switchChartTo);
				//this.restoreDefaults();
				//config.isChartTypeBeingChanged = true;
				this.constructor(config);	
				this.config.currentChartType = this.getChartObj().getChartRef().chartType().toUpperCase(); // this helps in building options for switching charts
		}else if(currentChartClassification == "MULTI_SERIES" && toBeSwitchedChartClassification == "STANDARD"){
			this.createOptions();
			document.getElementById("optionsContainer").firstChild.click();
		}else if(currentChartClassification == "STANDARD" && toBeSwitchedChartClassification == "MULTI_SERIES"){
			if(configuredChartClassification == "MULTI_SERIES"){
				this.restoreDefaults();
				config.isChartTypeBeingChanged = true;
				this.constructor(config);
			}
		}
	},
	updateChartData : function(chartActionCode, filter,chartProperty){
		var viewId = this.config.viewConf.VIEW_MD.VIEW_ID;
		var widgetId =  this.config.viewConf.widgetID;
		var extraParams = {
							"__LISTVIEW_REQUEST" : "Y",
							"PAGE_CODE_TYPE" : 'VDF_CODE',
							"INPUT_ACTION" : "INIT_DATA_ACTION",
							"PRODUCT_NAME" : this.config.viewConf.VIEW_MD.PRODUCT_CODE || "CANVAS",
							"INPUT_FUNCTION_CODE" : this.config.viewConf.VIEW_MD.FUNCTION_CODE || "VSBLTY",
							"INPUT_SUB_PRODUCT" : this.config.viewConf.VIEW_MD.SUB_PRODUCT_CODE || "CANVAS",
							"WIDGET_ID" : widgetId,
							"VIEW_ID" : viewId,
							"LAYOUT_ID" :iportal.workspace.metadata.getCurrentLayoutId(),
							"WORKSPACE_ID" :iportal.workspace.metadata.getCurrentWorkspaceId(),
							"ADDL_FILTERS" : JSON.stringify(filter),
							"CHART_ACTION_CODE" : chartActionCode,
							"forceCallbacks" : true
						};
		var that = this;
		that.value = chartProperty;
		cbx.ajax({ 
				params : extraParams,
				success : function(result) {
					that.config.viewData = result.response.value;
					canvas.env.chart.data.storeChartViewData(that.config.viewConf.VIEW_MD.VIEW_ID,that.config.viewData);
					that.constructor(that.config);
				},
				failure : function(result, request) {
					console.log("Error occurred while updating chart viewData");				}
			});
	},
	getChartClassfication : function(chartType){
		return CLCR.getInitOptions({"VIEW_TYPE":"CHART","CHART_TYPE":chartType,"CHART_LIB":canvas.env.chart.options.getChartLibFor(chartType)}).CHART_CAT;
	},
	createOptions : function(){
		console.log(this);
		var containerDiv = this.config.mvConf.id;
		/*if(cbx.isEmpty(containerDiv)){
			containerDiv.id = this.config.id+"_parent_container";
			containerDiv = containerDiv.id;
		}*/
		var optionsContainer = document.createElement("div");
		optionsContainer.id = "optionsContainer";
		var availableSeries = [];
		var viewColumns = this.config.viewConf.VIEW_MD.FLD_COLUMN_LIST;
		for(var column in viewColumns){
			if(viewColumns[column].FLD_Y_SERIES_IND == 'Y'){
				availableSeries.push({"id": viewColumns[column].FLD_COLUMN_ID,
									   "displayname" : viewColumns[column].FLD_COLUMN_DISPLAY_NAME_KEY,
										"dataType" : viewColumns[column].FLD_DATA_TYPE});
			}
		}
		//this.disposeAvailable();
	/*	var lableContainer = document.createElement("div");
			lableContainer.id = "lableContainer";
			lableContainer.className = "seriesOptions";
			lableContainer.innerHTML = "series : ";*/
		document.getElementById(containerDiv?containerDiv : containerDiv.id).appendChild(optionsContainer);
		//document.getElementById("optionsContainer").appendChild(lableContainer);
		var colors = ["#2196F3","#F44336","#4CAF50","#FF9800","#FFEB3B"];
		var that = this;
		this.config.seriesSwitch = {};

		for (var i = availableSeries.length - 1; i >= 0; i--) {
			var temp = document.createElement("div");
			temp.id = availableSeries[i].id;
			temp.className = "seriesOptions";
			temp.style.backgroundColor = "white";
			temp.innerHTML = availableSeries[i].displayname;
			this.config.seriesSwitch[availableSeries[i].id] = availableSeries[i];
			temp.addEventListener("click",function(e){
				//this.className += " optionSelected";
				that.removeActiveMark();
				that.handleSeriesSwitch(e);
			});
			
			document.getElementById("optionsContainer").appendChild(temp);
			temp = "";
		};
		//document.getElementById(containerDiv).appendChild(optionsContainer);
		var newContainer = document.createElement("div");
		newContainer.id = this.config.id+"_container";
		var c = document.getElementById(containerDiv?containerDiv : containerDiv.id).appendChild(newContainer);
		this.config.newContainer ={};
		this.config.newContainer.id = newContainer.id; 

	},
	handleSeriesSwitch : function(e){
		var trigger = e.currentTarget.id;
		e.currentTarget.className +=" optionSelected";
		this.config.seriesSwitch.seriesToBeRendered = this.config.seriesSwitch[trigger].id;
		this.config.viewData = canvas.env.chart.data.getChartViewDataOf(this.config.viewConf.VIEW_MD.VIEW_ID).response.value;
		//this.config.mvConf.clientHeight = this.config.mvConf.clientHeight-25;
		this.constructor(this.config);
		//alert(seriesToBeRendered);
	},
	removeActiveMark : function(){
		var options = document.getElementById("optionsContainer").children;
		for(var i=0;i<options.length;i++){
			var classNames = options[i].className.split(" ");
			if(classNames.length==2){
				options[i].className = "";
				options[i].className = "seriesOptions";
			}
		}
	},
	removeOptions : function(){
		var options = document.getElementById("optionsContainer");
		this.config.newContainer = "";
		if(options){
		while (options.firstChild) {
		    options.removeChild(options.firstChild);
		}
	  }
	},
	updateChartProperty : function(property,labelValue){
		var renderedChart = this.getChartObj().getChartRef();
		renderedChart.setChartAttribute("xAxisName",labelValue);
		this.config.isChartPropertyUpdated = true;
	},
	createStore:function(scopeHandler){
		var generatedParams=scopeHandler.generateParams();
		this.store = new canvas.core.Store({
			params : generatedParams,
			listeners : {
				'load' : scopeHandler.postLoad,
				'beforeload' : scopeHandler.preLoad
			},
			scope : scopeHandler,
			containerId:scopeHandler.config.graphViewId,
			dataController:true,
			id:'store-'+scopeHandler.config.graphViewId,
			accumulate : scopeHandler.accumulate || false,
			autoLoad : true,
			reader : {
				root : 'response.value.ALL_RECORDS',
				totalProperty : 'response.value.TOTAL_COUNT',
				additionalData : 'response.value.ADDITIONAL_DATA',
				idProperty : 'response.value.ADDITIONAL_DATA.UNIQUE_COLUMN'
			},
			bufferSize : scopeHandler.perPage || ""
		});

	},
	postLoad:function(records,additionalData){
		this.config.chartData = {};
		this.config.chartData["records"] = records;
		this.config.chartData["additionalData"] = additionalData;
		this.downloadChartLib();
	},
	generateParams : function(){
		var viewData,json;
		var config = this.config;
		var viewId = config.viewConf.VIEW_MD.VIEW_ID;
		var widgetId = config.framework == "ext"?config.graphViewId : config.framework == "jqtbs"? config.viewConf.WIDGET_ID : config.listMD.enrichedViewMD.widgetID;
		var paraMeters = {
							"__LISTVIEW_REQUEST" : "Y",
							"PAGE_CODE_TYPE" : 'VDF_CODE',
							"INPUT_ACTION" : "INIT_DATA_ACTION",
							"PRODUCT_NAME" : config.viewConf.VIEW_MD.PRODUCT_CODE || "cuser",
							"INPUT_FUNCTION_CODE" : config.viewConf.VIEW_MD.FUNCTION_CODE || "VSBLTY",
							"INPUT_SUB_PRODUCT" : config.viewConf.VIEW_MD.SUB_PRODUCT_CODE || "cuser",
							"WIDGET_ID" : widgetId,
							"VIEW_ID" : viewId,
							"LAYOUT_ID" :iportal.workspace.metadata.getCurrentLayoutId(),
							"WORKSPACE_ID" :iportal.workspace.metadata.getCurrentWorkspaceId(),
							"forceCallbacks" : true
						};
		return paraMeters;
	} 
});


if(iportal.systempreferences.getFramework() == "jqtbs" )
{
		CLCR.registerCmp({
			'COMP_TYPE' : 'APP',
			'VIEW_TYPE' : 'CHART'
		}, canvas.chart.engine);

}



