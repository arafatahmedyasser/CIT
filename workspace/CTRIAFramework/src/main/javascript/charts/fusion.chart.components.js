cbx.namespace("fusion.chart");     

fusion.chart.component = Class(cbx.core.Component,{
	constructor : function(obj,chartCategory){
		this.config =  obj.config;
		if(obj.framework == "jqm" || obj.framework == "jqtbs")
			$ = obj;
		this.config.chartCategory = chartCategory;
	},
	renderChart : function(){
		if(cbx.isEmpty(this.config.viewData))
			categoriesList["getViewData"](this.config, categoriesList[this.config.chartCategory.CHART_CAT]);
		else
			categoriesList[this.config.chartCategory.CHART_CAT](this.config,this.config.viewData);
		if(this.config.framework == "jqm")
			setTimeout(function(){doIScroll('CONTENT_DIV','refresh');},1000);
	},
	getChartRef : function(){
		var chartObj = FusionCharts(this.config.id);
		return chartObj;
	},
	disposeChart : function(){
		this.getChartRef().dispose();
	}
});	

CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"PIE2D","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"STANDARD"});
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"DOUGHNUT2D","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"STANDARD"});
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"COLUMN2D","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"STANDARD"});
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"COLUMN3D","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"STANDARD"});
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"LINE","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"STANDARD"});
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"AREA2D","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"STANDARD"});
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"PYRAMID","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"STANDARD"});
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"FUNNEL","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"STANDARD"});
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"BAR2D","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"STANDARD"});
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"BAR3D","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"STANDARD"});
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"PIE3D","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"STANDARD"});
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"DOUGHNUT3D","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"STANDARD"});
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"MSCOMBI2D","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"MULTI_SERIES"});
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"MSCOMBI3D","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"MULTI_SERIES"});
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"MSBAR2D","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"MULTI_SERIES"});
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"MSAREA","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"MULTI_SERIES"});
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"MSLINE","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"MULTI_SERIES"});
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"MSCOLUMN2D","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"MULTI_SERIES"});
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"MSCOLUMN3D","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"MULTI_SERIES"});
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"MSCOLUMN3DLINEDY","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"MULTI_SERIES"});
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"MSBAR3D","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"MULTI_SERIES"});
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"MSCOMBIDY2D","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"MULTI_SERIES"});
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"MSCOLUMNLINE3D","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"MULTI_SERIES"});
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"SCROLLCOMBI2D","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"MULTI_SERIES"});
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"SCROLLAREA2D","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"STANDARD"});
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"SCROLLCOLUMN2D","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"STANDARD"});
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"SCROLLINE2D","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"STANDARD"});
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"SCROLLCOMBIDY2D","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"MULTI_SERIES"});
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"STACKEDCOLUMN2D","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"MULTI_SERIES"});
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"STACKEDCOLUMN3D","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"MULTI_SERIES"});//ZOOMLINE
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"STACKEDAREA2D","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"MULTI_SERIES"});
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"STACKEDBAR2D","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"MULTI_SERIES"});
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"STACKEDBAR3D","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"MULTI_SERIES"});
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"ZOOMLINE","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"MULTI_SERIES"});//HLED
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"ANGULARGAUGE","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"GAUGES"});
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"HLED","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"GAUGES"});
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"VLED","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"GAUGES"})//HLINEARGAUGE
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"HLINEARGAUGE","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"GAUGES"});
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"BULB","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"GAUGES"});//VBULLET
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"VBULLET","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"GAUGES"});//VBULLET
CLCR.registerCmp({"VIEW_TYPE":"CHART","CHART_TYPE":"HBULLET","CHART_LIB":"FUSION"},fusion.chart.component,{"CHART_CAT":"GAUGES"});
var categoriesList = {
	/*
	* This function returns a JSON which is compatible for all chart type under Standard category.
	*/
	getBaseData : function(config,viewData){
		var baseData = {};
		baseData.viewRecords = viewData.ALL_RECORDS;
		baseData.framework = config.framework;
		baseData.chartProps = viewData.ADDITIONAL_DATA.chartProperties || {};
		baseData.viewMD = config.viewConf.VIEW_MD;
		baseData.columns = baseData.viewMD.FLD_COLUMN_LIST;
		baseData.chartType = config.chartType;
		baseData.chartId = config.id;
		baseData.addlProperties = viewData.ADDITIONAL_DATA.CHART_ADDITIONAL_PROPERTIES || {};
		baseData.seriesToBeRendered = config.seriesSwitch?config.seriesSwitch.seriesToBeRendered : "";
		return baseData;
	},
	getBaseChartJson : function(config,viewData){
		var baseData = categoriesList.getBaseData(config,viewData);
		var json = {
			"config" : config,
			"type": baseData.chartType,
		    "renderAt":config.newContainer?config.newContainer.id : config.mvConf.id,
		    "width":  config.mvConf.clientWidth,
		    "height": config.newContainer?config.mvConf.clientHeight-25 :config.mvConf.clientHeight,
		    "id" : baseData.chartId,
		    "dataFormat": "json",
		    "baseChartMessage"  : canvas.env.chart.options.getBaseChartMessage(baseData.chartType),
			"typeNotSupportedMessage" : canvas.env.chart.options.getTypeNotSupportedMessage(baseData.chartType),
			"dataEmptyMessage" :canvas.env.chart.options.getDataEmptyMessage(baseData.chartType),
		    "dataSource" : {
		    	"chart": {
		            "theme": "zune",
		            "showLegend": "1", 
		            "valueBgColor": "#FFFFFF",
			        "valueBgAlpha": "50",
			        "is2d" : "1",
			        "use3DLighting" 	: "0",
		            "legendPosition"	: baseData.chartProps.legendPosition?baseData.chartProps.legendPosition : canvas.env.chart.options.getLegendPosition(baseData.chartType),
		            "paletteColors" 	: baseData.chartProps.PALETTE_COLORS?baseData.chartProps.PALETTE_COLORS : canvas.env.chart.options.getPaletteColors(baseData.chartType),
		            "numberPrefix" 		: baseData.chartProps.setNumberPrefix?baseData.chartProps.setNumberPrefix : canvas.env.chart.options.getNumberPreFix(baseData.chartType),
		            "numberSuffix" 		: baseData.chartProps.setNumberSuffix?baseData.chartProps.setNumberSuffix : canvas.env.chart.options.getNumberSuffix(baseData.chartType),
		            "sNumberPrefix"		: baseData.chartProps.setNumberPrefix?baseData.chartProps.setNumberPrefix : canvas.env.chart.options.getNumberPreFix(baseData.chartType),		           
		            "showToolTip" 		: baseData.chartProps.SHOW_TOOL_TIP?baseData.chartProps.SHOW_TOOL_TIP : canvas.env.chart.options.getShowToolTip(baseData.chartType),
		            "toolTipBgColor" 	: baseData.chartProps.setToolTipBgColor?baseData.chartProps.setToolTipBgColor : canvas.env.chart.options.getToolTipBgColor(baseData.chartType),
		            "showHoverEffect" 	: baseData.chartProps.showHoverEffect?baseData.chartProps.showHoverEffect : canvas.env.chart.options.showHoverEffect(baseData.chartType),
		            "decimalSeparator" 	: baseData.chartProps.decimalSeparator?baseData.chartProps.decimalSeparator : canvas.env.chart.options.getDecimalSeparator(baseData.chartType),
		            "thousandSeparator" : baseData.chartProps.thousandSeparator?baseData.chartProps.thousandSeparator : canvas.env.chart.options.getThousandseparator(baseData.chartType),
		            "formatNumberScale" : baseData.chartProps.formatNumberScale?baseData.chartProps.formatNumberScale : canvas.env.chart.options.formatNumber(baseData.chartType),
		            "sFormatNumberScale": baseData.chartProps.formatNumberScale?baseData.chartProps.formatNumberScale : canvas.env.chart.options.formatNumber(baseData.chartType),
		            "numberScaleValue" 	: baseData.chartProps.numberScaleValue?baseData.chartProps.numberScaleValue : canvas.env.chart.options.getNumberScaleValue(baseData.chartType),
			        "sNumberScaleValue" : baseData.chartProps.numberScaleValue?baseData.chartProps.numberScaleValue : canvas.env.chart.options.getNumberScaleValue(baseData.chartType),
			        "numberScaleUnit" 	: baseData.chartProps.numberScaleUnit?baseData.chartProps.numberScaleUnit : canvas.env.chart.options.getNumberScaleUnit(baseData.chartType),
			  	    "sNumberScaleUnit"  : baseData.chartProps.numberScaleUnit?baseData.chartProps.numberScaleUnit : canvas.env.chart.options.getNumberScaleUnit(baseData.chartType),
			        "decimals" 			: baseData.chartProps.decimals?baseData.chartProps.decimals : canvas.env.chart.options.getDecimals(baseData.chartType),
			        "valueFontColor"	: baseData.chartProps.valueFontColor?baseData.chartProps.valueFontColor : canvas.env.chart.options.getValueFontColor(baseData.chartType),
			        "thousandSeparatorPosition" : baseData.chartProps.thousandSeparatorPosition?baseData.chartProps.thousandSeparatorPosition : canvas.env.chart.options.getThousandSeparatorPosition(baseData.chartType),
			        "rotateLabels" 		: baseData.chartProps.rotateLabels?baseData.chartProps.rotateLabels : canvas.env.chart.options.rotateLabel(baseData.chartType),
			        "slantLabels" 		: baseData.chartProps.slantLabels?baseData.chartProps.slantLabels : canvas.env.chart.options.slantLabel(baseData.chartType),
			        "showSum"			: baseData.chartProps.showSum?baseData.chartProps.showSum : canvas.env.chart.options.getShowSum(baseData.chartType),
			        "stack100Percent"	: baseData.chartProps.stack100Percent?baseData.chartProps.stack100Percent : canvas.env.chart.options.getStack100Percent(baseData.chartType),
			        "labelFontBold" 	: baseData.chartProps.labelFontBold?baseData.chartProps.labelFontBold : canvas.env.chart.options.getLabelFontBold(baseData.chartType),
			        "showShadow": "0",
			        "divLineColor" : "#eee",
			        "divLineDashed" : "0"
			    }
		    }

		};
		return json;
	},
	convertDateToPreferredFrmt : function(date){
		var inFormat = inFormat||'d/m/Y';
			if (!date) {
				return "";
			}
			date = date.replace(/\d{2}:\d{2}:\d{2}/,"").trim();
			var dateObj = new Date(date);
			date = dateObj.getDate()+"/"+dateObj.getMonth()+"/"+dateObj.getFullYear();
		return iportal.jsutil.convertDateValueToUserPreferedFmt(date);
	},
	STANDARD : function(config,viewData){
		var baseData = categoriesList.getBaseData(config,viewData);
		var columnLabels = {},columnType = {};
		columnType["xAxis"]={};
		columnType["yAxis"] ={};
		var j,i;
		for(i=0;i<baseData.columns.length;i++)  
		{
			if(baseData.columns[i].FLD_X_SERIES_IND == "Y" ) {
				columnType["xAxis"]["displayname"] = baseData.columns[i].FLD_COLUMN_DISPLAY_NAME_KEY;
				columnType["xAxis"]["id"] = baseData.columns[i].FLD_COLUMN_ID;
				columnType["xAxis"]["dataType"] = baseData.columns[i].FLD_DATA_TYPE;
			}else if(baseData.columns[i].FLD_Y_SERIES_IND == "Y"){
				columnType["yAxis"][baseData.columns[i].FLD_COLUMN_ID] ={};
				columnType["yAxis"][baseData.columns[i].FLD_COLUMN_ID]["displayname"] = baseData.columns[i].FLD_COLUMN_DISPLAY_NAME_KEY;
				columnType["yAxis"][baseData.columns[i].FLD_COLUMN_ID]["id"] = baseData.columns[i].FLD_COLUMN_ID;
				columnType["yAxis"][baseData.columns[i].FLD_COLUMN_ID]["dataType"] = baseData.columns[i].FLD_DATA_TYPE;
			}
		}

		columnLabels["xAxis"] = columnType["xAxis"];
		columnLabels["yAxis"] ={};
		for(var series in columnType["yAxis"]){
			if(columnType["yAxis"][series].id == baseData.seriesToBeRendered){
				var seriesData = config.seriesSwitch[baseData.seriesToBeRendered];
				columnLabels["yAxis"]["displayname"] = seriesData.displayname;
				columnLabels["yAxis"]["id"] = seriesData.id;
				columnLabels["yAxis"]["dataType"] = seriesData.dataType;
			}else if(cbx.isEmpty(columnLabels["yAxis"])){
				columnLabels["yAxis"]["displayname"] = columnType["yAxis"][series].displayname;
				columnLabels["yAxis"]["id"] = columnType["yAxis"][series].id;
				columnLabels["yAxis"]["dataType"] = columnType["yAxis"][series].dataType;
			}
		}
		var json = categoriesList.getBaseChartJson(config,viewData);
		json.dataSource.chart["xAxisName"] = columnLabels["xAxis"].displayname;
		json.dataSource.chart["yAxisName"] = columnLabels["yAxis"].displayname;
		         
		var data=[];
		for(j=0;j<baseData.viewRecords.length;j++)
		{	
			var obj = {};
			var xaxisLabel = columnLabels["xAxis"].id;
			var yaxisLabel = columnLabels["yAxis"].id;
			obj["value"] = (columnLabels["yAxis"].dataType).toUpperCase() == "DATE"?categoriesList.convertDateToPreferredFrmt(baseData.viewRecords[j][yaxisLabel]) :
																							baseData.viewRecords[j][yaxisLabel];
			obj["label"] = (columnLabels["xAxis"].dataType).toUpperCase() == "DATE"?categoriesList.convertDateToPreferredFrmt(baseData.viewRecords[j][xaxisLabel]) :
																							baseData.viewRecords[j][xaxisLabel];
			data.push(obj);

		}
		json.dataSource.data = data;
		json.dataSource.trendlines = categoriesList.generateTrendLine(config,viewData);
		//json.dataSource.annotations = categoriesList.generateAnnotation(config,viewData);
		json.events = {};
		/*json.events["chartClick"] = function (eventObj, dataObj) {
             		var handler = CWEH.getHandler(this.args.config.graphViewId ,canvas.env.chart.options.getIntentForGesture("SINGLE_CLICK",this.args.type));
                		if(handler)
                			handler(this.args.config,dataObj,eventObj);
                		else
                			console.log("Handler for this widget is not found!");
		      };*/
		json.events["dataplotClick"] = function(eventObj, dataObj){
			        var handler = CWEH.getHandler(this.args.config.graphViewId ,canvas.env.chart.options.getIntentForGesture("dataplotClick",this.args.type));
                		if(handler)
                			handler(this.args.config,dataObj,eventObj);
                		else
                			console.log("Handler for this widget is not found!");
		};
		categoriesList.generateChart(json,baseData.chartId);
	},
	MULTI_SERIES : function(config,viewData){
		var baseData = categoriesList.getBaseData(config,viewData);
		var columnLabels = {};
		var yAxisCount = 1,secondaryYaxisName,primaryYaxisname;
		for(var i=0;i<baseData.columns.length;i++)  
		{
			if(baseData.columns[i].FLD_X_SERIES_IND == "Y" ) {
				columnLabels["xAxis"]={};
				columnLabels["xAxis"]["displayname"] = baseData.columns[i].FLD_COLUMN_DISPLAY_NAME_KEY;
				columnLabels["xAxis"]["id"] = baseData.columns[i].FLD_COLUMN_ID;
				columnLabels["xAxis"]["dataType"] = baseData.columns[i].FLD_DATA_TYPE;
			}
			else if(baseData.columns[i].FLD_Y_SERIES_IND == "Y"){
				columnLabels["yAxis"+yAxisCount] = {};
				columnLabels["yAxis"+yAxisCount]["displayname"] = baseData.columns[i].FLD_COLUMN_DISPLAY_NAME_KEY;
				columnLabels["yAxis"+yAxisCount]["id"] = baseData.columns[i].FLD_COLUMN_ID;
				columnLabels["yAxis"+yAxisCount]["dataType"] = baseData.columns[i].FLD_DATA_TYPE;
				yAxisCount++;
				if(baseData.columns[i].FLD_SECONDARY_IND == "Y"){
					secondaryYaxisName = baseData.columns[i].FLD_COLUMN_DISPLAY_NAME_KEY;
				}else if(baseData.columns[i].FLD_PRIMARY_IND == "Y"){
					primaryYaxisname = baseData.columns[i].FLD_COLUMN_DISPLAY_NAME_KEY;
				}
			}
		}
		var json = categoriesList.getBaseChartJson(config,viewData);
		json.dataSource.chart["xAxisName"] = columnLabels["xAxis"].displayname;
		json.dataSource.chart["pYAxisName"] = primaryYaxisname?primaryYaxisname : "";
		json.dataSource.chart["sYAxisName"] = secondaryYaxisName?secondaryYaxisName : "";

		var categories = [];
		var category = [];
		for(var j=0;j<baseData.viewRecords.length;j++){
			var obj={};
			var xaxisLabel = columnLabels["xAxis"].id;
			obj["label"] = (columnLabels["xAxis"].dataType).toUpperCase() == "DATE"?categoriesList.convertDateToPreferredFrmt(baseData.viewRecords[j][xaxisLabel]) :
																							baseData.viewRecords[j][xaxisLabel];
			category.push(obj);
		}
		categories[0] = {};
		categories[0]["category"] = category;
		json.dataSource["categories"] = categories;
		var dataset = [];
		for(var i=0;i<=yAxisCount;i++){
			var yaxisLabel = columnLabels["yAxis"+i];
			if(yaxisLabel){
				yaxisLabel = columnLabels["yAxis"+i].id;
				if(baseData.columns[i].FLD_PRIMARY_IND == "Y" ){
					dataset[i] = {
						"renderAs" : baseData.chartProps.primaryChartType?baseData.chartProps.primaryChartType : canvas.env.chart.options.getPrimaryChartType(baseData.chartType),
						"seriesName": baseData.chartProps.primarySeriesName?baseData.chartProps.primarySeriesName : canvas.env.chart.options.getPrimarySeriesName(baseData.chartType)?canvas.env.chart.options.getPrimarySeriesName(baseData.chartType) : baseData.columns[i].FLD_COLUMN_DISPLAY_NAME_KEY
					};
				}else if(baseData.columns[i].FLD_PRIMARY_IND != "Y"){
					dataset[i] ={
						"renderAs" : baseData.chartProps["secondaryChartType"+i]?baseData.chartProps["secondaryChartType"+i] : canvas.env.chart.options["getSecondary"+i+"ChartType"](baseData.chartType),
						"seriesName": baseData.chartProps["secondarySeriesName"+i]?baseData.chartProps["secondarySeriesName"+i] : canvas.env.chart.options["getSecondary"+i+"SeriesName"](baseData.chartType)?canvas.env.chart.options["getSecondary"+i+"SeriesName"](baseData.chartType) : baseData.columns[i].FLD_COLUMN_DISPLAY_NAME_KEY
					};
				}
				if(baseData.columns[i].FLD_SECONDARY_IND == "Y"  && baseData.columns[i].FLD_PRIMARY_IND != "Y"){
					dataset[i]["parentYAxis"] = "S";
				}
				var data =[];
				for(var j=0;j<baseData.viewRecords.length;j++){
						var tempObj={};
						tempObj["value"] = (columnLabels["yAxis"+i].dataType).toUpperCase() == "DATE"?categoriesList.convertDateToPreferredFrmt(baseData.viewRecords[j][yaxisLabel]) :
																							baseData.viewRecords[j][yaxisLabel];
							data.push(tempObj);
					}
					dataset[i]["data"] = data;
			}
		}
		json.dataSource["dataset"] = dataset;
		json.dataSource.trendlines = categoriesList.generateTrendLine(config,viewData);
		//json.dataSource.annotations = categoriesList.generateAnnotation(config,viewData);
		json.events = {};
		json.events["chartClick"] = function (eventObj, dataObj) {
             		var handler = CWEH.getHandler(this.args.config.graphViewId ,canvas.env.chart.options.getIntentForGesture("SINGLE_CLICK",this.args.type));
                		if(handler)
                			handler(this.args.config,dataObj,eventObj);
                		else
                			console.log("Handler for this widget is not found!");
		      };
		categoriesList.generateChart(json,baseData.chartId);
	},
	GAUGES : function(config,viewData){
		var baseData = categoriesList.getBaseData(config,viewData);
		var json = categoriesList.getBaseChartJson(config,viewData);
		var addlProperties = baseData.addlProperties;
		var colorRange = {},temp = {};
		var color = [];
		var yColumn;
		for(var i in baseData.columns){
			if(baseData.columns[i]["FLD_Y_SERIES_IND"] == "Y"){
				yColumn = baseData.columns[i];
			}
		}
		if(!cbx.isEmpty(addlProperties)){
			for(var row in addlProperties){
				temp = {};
				if(addlProperties[row].VIEW_ID == baseData.viewMD.VIEW_ID){
					 temp["minValue"] = addlProperties[row].COLOR_RANGE_MIN;
					 temp["maxValue"] = addlProperties[row].COLOR_RANGE_MAX;
					 temp["code"] = "#"+addlProperties[row].COLOR_CODE;
					 if(baseData.chartType == "VBULLET" || baseData.chartType == "HBULLET")
					 	temp["alpha"] = "70";
					 color.push(temp);
				}
			}
			colorRange.color ={};
			colorRange.color= color;
			if(baseData.chartType == "ANGULARGAUGE"){
				json.dataSource.dials = {"dial": [{
	                "value":  baseData.viewRecords[0][yColumn.FLD_COLUMN_ID],
	                "radius" : baseData.chartProps.pointerRadius?baseData.chartProps.pointerRadius : canvas.env.chart.options.getPointerRadius(baseData.chartType),
	                "rearExtension": "15",
	                "bgColor": baseData.chartProps.pointerBgColor?baseData.chartProps.pointerBgColor : canvas.env.chart.options.getPointerBgColor(baseData.chartType),
	                "showValue": "1"
	            }]
	        };
	    }else if(baseData.chartType == "HLINEARGAUGE"){
	    	json.dataSource.pointers =  {"pointer": [{
                "value":  baseData.viewRecords[0][yColumn.FLD_COLUMN_ID]
        		    	}]
   		 			}
	    }else if(baseData.chartType == "HLED" || baseData.chartType == "VLED" ||baseData.chartType == "BULB"){
	    	json.dataSource.value =  baseData.viewRecords[0][yColumn.FLD_COLUMN_ID];
	    }else if(baseData.chartType == "VBULLET" || baseData.chartType == "HBULLET"){
	    	 json.dataSource.chart["targetColor"] = baseData.chartProps.targetColor?baseData.chartProps.targetColor : canvas.env.chart.options.getTargetColor(baseData.chartType),
	    	 json.dataSource.chart["plotFillColor"] = baseData.chartProps.plotFillColor?baseData.chartProps.plotFillColor : canvas.env.chart.options.getPlotFillColor(baseData.chartType),
	    	 json.dataSource["value"] = baseData.viewRecords[0][yColumn.FLD_COLUMN_ID];
	    	 json.dataSource["target"] = "";

	    }
        	json.dataSource.chart.numberSuffix = "";
        	json.dataSource.chart.numberPrefix = "";
        	json.dataSource.chart["pivotFillColor"] = baseData.chartProps.pivotFillColor?baseData.chartProps.pivotFillColor : canvas.env.chart.options.getPivotFillColor(baseData.chartType);
        	json.dataSource.chart["showGaugeBorder"] = "0";
        	json.dataSource.chart["gaugeOuterRadius"] = baseData.chartProps.gaugeOuterRadius?baseData.chartProps.gaugeOuterRadius : canvas.env.chart.options.getGaugeOuterRadius(baseData.chartType);
        	json.dataSource.chart["gaugeInnerRadius"] = baseData.chartProps.gaugeInnerRadius?baseData.chartProps.gaugeInnerRadius : canvas.env.chart.options.getGaugeInnerRadius(baseData.chartType);
			json.dataSource.colorRange = {};
			json.dataSource.colorRange = colorRange;
			categoriesList.generateChart(json,baseData.chartId); 
		}

	},
	generateTrendLine : function(config,viewData){
		var baseData = categoriesList.getBaseData(config,viewData);
		var addlProperties = baseData.addlProperties;
		var trendlines = [];
		var temp ={};
		if(!cbx.isEmpty(addlProperties)){
			temp.line =[];
			temp.point = [];
		for(var row in addlProperties){
				if(addlProperties[row].VIEW_ID == baseData.viewMD.VIEW_ID && addlProperties[row].CUSTOM_LABEL_POSITION!=""){
					var temp1 = {};
					if(baseData.chartType == "HLINEARGAUGE" || baseData.chartType == "ANGULARGAUGE"){
						temp1["startvalue"] = addlProperties[row].CUSTOM_LABEL_POSITION;
						temp1["color"] = "#"+addlProperties[row].COLOR_CODE;
						temp1["valueOnRight"] = "1";
						temp1["tooltext"] = addlProperties[row].REFLINE_TEXT;
						temp1["displayvalue"] = addlProperties[row].REFLINE_VALUE;
						temp.point.push(temp1);
					}else{
						temp1["startvalue"] = addlProperties[row].CUSTOM_LABEL_POSITION;
						temp1["color"] = "#"+addlProperties[row].COLOR_CODE;
						temp1["valueOnRight"] = "1";
						temp1["tooltext"] = addlProperties[row].REFLINE_TEXT;
						temp1["displayvalue"] = addlProperties[row].REFLINE_VALUE;
						temp.line.push(temp1);
					}
				}
			}
		}
		trendlines.push(temp);
		return trendlines;
	},
	generateAnnotation : function(config,viewData){
		var baseData = categoriesList.getBaseData(config,viewData);
		var annotations = {};
		annotations.width = "200";
		annotations.height = "100";
		annotations.autoScale= "1";
		annotations.groups = [{
			"id" : "firstAnnotation",
			"items" : [
				{
						"id": "dyn-label",
                        "type": "text",
                        "fontsize": "30",
                        "text": "20,000",
                        "bold": "0",
                        "wrap": "1",
                        "color" : "#9E9E9E",
                        "wrapWidth": "350",
                        "x": "$canvasEndX -60",
                        "y": "$canvasStartY - 40",
                        "bgColor" : "#ffffff"
				},
				{
						"id": "dyn-label",
                        "type": "text",
                        "fontsize": "15",
                        "text": "in Indian Rupees",
                        "bold": "0",
                        "wrap": "1",
                        "color" : "#E0E0E0",
                        "wrapWidth": "350",
                        "x": "$canvasEndX -60",
                        "y": "$canvasStartY - 17",
                        "bgColor" : "#ffffff"
				}
			]
		}];
		return annotations;
	},
	generateChart : function(json,chartId){
		if(FusionCharts(chartId))
		 	FusionCharts(chartId).dispose();
		var renderedChart = new FusionCharts(json);
		renderedChart.render();
		var eventHandler =  CWEH.getHandler(json.config.viewConf.widgetID,"chartRendered");
		if(eventHandler)
			eventHandler(this,renderedChart);
		if(json.config.framework == "jqm"){
	 	var handler = CWEH.getHandler(json.config.viewConf.widgetID,"renderSwitchIcon");
	 	handler(json);
		
		}
	},
	
			getViewData : function(config, callback)
			{
				if(!cbx.isEmpty(config.chartData)){
					var viewData = {};
					viewData["ALL_RECORDS"] = config.chartData.records;
					viewData["ADDITIONAL_DATA"] = config.chartData.additionalData;
					callback(config,viewData);
				}else
					console.log("Error retrieving View data");
}

}

