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
 
cbx.ns('canvas.lib.view');
/**
 * This class contains the lib specific GroupView confined to the widget / app.
 */
canvas.lib.view.ChartView = Class(cbx.core.Component,{
	/**
	 * 
	 */
	initialize : function() {
		var me = this;
		var rb = CRB.getBundle(me.FLD_BUNDLE_KEY);
		this.rb = rb;
		var elem = me.elem;
		elem.append('<span class="cbx-app ' + me.WIDGET_ID + '" ITEM_ID="WGT_' + me.WIDGET_ID + '"></span>');
		elem = $(elem.find('span[item_id="WGT_' + me.WIDGET_ID + '"]'));
		me.setCmp(elem);
		elem.on("remove", function() {
			me.destroy();
		});
		var params = {
			"__LISTVIEW_REQUEST" : "Y",
			"PAGE_CODE_TYPE" : 'VDF_CODE',
			"INPUT_ACTION" : "INIT_DATA_ACTION",
			"PRODUCT_NAME" : 'CUSER',
			"INPUT_FUNCTION_CODE" : 'VSBLTY',
			"INPUT_SUB_PRODUCT" : 'CUSER',
			"WIDGET_ID" : me.WIDGET_ID,
			"VIEW_ID" : me.md.getViewId(),
			
			"LAYOUT_ID" :iportal.workspace.metadata.getCurrentLayoutId(),
			"WORKSPACE_ID" :iportal.workspace.metadata.getCurrentWorkspaceId(),
		
			"forceCallbacks" : true
		};
		var extraParams = {};
		me.viewConf.raiseEvent(CWEC.EXTRA_PARAMS_HDLR, extraParams);
		if (extraParams) {
			cbx.core.extend(params, extraParams);
		}

		if (me.uData && !cbx.core.isEmpty(me.uData)) {
			cbx.core.extend(params, me.uData);
		}

		this.store = new cbx.core.Store({
			params : params,
			listeners : {
				"load" : this.loadData
			},
			scope : this,
			autoLoad : true,
			reader : {
				root : 'response.value.ALL_RECORDS',
				totalProperty : 'response.value.TOTAL_COUNT',
				additionalData : 'response.value.ADDITIONAL_DATA'
			},
			bufferSize : 45
		});
	},
	/**
	 * @description Data of the chart is loaded and depending upon the
	 *              type or chart to be shown, the control is
	 *              transferred to the corresponding function.
	 * @param records
	 *            The records to display, containing data.
	 */
	loadData : function(records) {
		var me = this;
		var rb = IRB.getBundle(IRB.CUSER);
		var elem = me.getCmp();
		elem.empty();
		var title = graphTitle = rb[me.md.getViewTitle()] || me.md.getViewTitle();
		var extraParams = {};
		me.viewConf.raiseEvent(CWEC.EXTRA_PARAMS_HDLR, extraParams);
		if (extraParams != null && extraParams.SERVICE_TYPE_NAME) {
			title += ': <span style="color:#999999">' + extraParams.SERVICE_TYPE_NAME + '</span>';
		}
		elem.append('<h4>' + title + '</h4>');
		if (cbx.core.isEmpty(records) || records.length == 0) {
			elem.append("<br>No Data Found.");
		} else {
			elem.append('<span class="CHART_WRAPPER"></span>');
			this.chartElem = $(elem.find('span[class="CHART_WRAPPER"]'));
			var chartH = $('div.subNav').height() || '100%';
			var chartW = '100%';

			var cords = this.getXYSeries();
			var data = this.getXYData(cords);
			var category = [];
			var dataset = [];
			var refLine = [];
			var colorRange = [];
			var alpha = "100";
			var xData = data.xData, yData = data.yData, xLabels = data.xLabels[0], yLabels = data.yLabels, xLegend = rb[cords.X_COLUMN_LABEL[0]] != null ? rb[cords.X_COLUMN_LABEL[0]]
					: cords.X_COLUMN_LABEL[0], yLegend = rb[cords.Y_COLUMN_LABEL[0]] != null ? rb[cords.Y_COLUMN_LABEL[0]]
					: cords.Y_COLUMN_LABEL[0];
			var refPts = this.store.additionalData;
			var yAxisName = "";
			if (refPts != null && refPts.Y_AXIS_LABEL) {
				yAxisName = refPts.Y_AXIS_LABEL;
			}
			var colors = [ "F26D7D", "008ED6", "F6BD0F", "006600", "ABA000", "588526", "008ED6", "9D080D",
					"CC6600" ];
			highlightConfig = {
				x : [],
				y : []
			};

			if (refPts && refPts.ColorRange != null) {

				for ( var i = 0; i < (refPts.ColorRange).length; i++) {
					colorRange.push({
						"minvalue" : refPts.ColorRange[i].minValue,
						"maxvalue" : refPts.ColorRange[i].maxValue,
						"label" : refPts.ColorRange[i].label,
						"code" : colors[i]

					});
				}
			} else {
				colorRange.push({
					"minvalue" : "0",
					"maxvalue" : ((1.5 * parseInt(yData[0][0])) / 3).toString() == "0" ? "33"
							: ((1.5 * parseInt(yData[0][0])) / 3).toString(),
					"code" : colors[0]

				}, {
					"minvalue" : ((1.5 * parseInt(yData[0][0])) / 3).toString() == "0" ? "33"
							: ((1.5 * parseInt(yData[0][0])) / 3).toString(),
					"maxvalue" : ((2 * (1.5 * parseInt(yData[0][0]))) / 3).toString() == "0" ? "67"
							: ((2 * (1.5 * parseInt(yData[0][0]))) / 3).toString(),
					"code" : colors[1]

				}, {
					"minvalue" : ((2 * (1.5 * parseInt(yData[0][0]))) / 3).toString() == "0" ? "67"
							: ((2 * (1.5 * parseInt(yData[0][0]))) / 3).toString(),
					"maxvalue" : (1.5 * parseInt(yData[0][0])).toString() == "0" ? "100"
							: (1.5 * parseInt(yData[0][0])).toString(),
					"code" : colors[2]

				});
			}
			if (refPts && refPts.RefPoints != null) {

				var colors = [ "F26D7D", "008ED6", "F6BD0F", "006600", "ABA000", "588526", "008ED6", "9D080D",
						"CC6600" ];
				for ( var i = 0; i < (refPts.RefPoints).length; i++) {
					refLine.push({
						"line" : [ {
							"startvalue" : refPts.RefPoints[i].refValue,
							"displayvalue" : refPts.RefPoints[i].refLabel,
							"color" : colors[i],
							"dashed" : "1",
							"valueonright" : "1",
							"tooltext" : refPts.RefPoints[i].refLabel + " is " + refPts.RefPoints[i].refValue
						} ]
					});
				}
			}

			for ( var k = 0; k < xLabels.length; k++) {
				category.push({
					"label" : xLabels[k]
				});
			}
			for ( var i = 0; i < yData.length; i++) {
				var color = "";
				var data = [];
				for ( var j = 0; j < xLabels.length; j++) {
					color = yData.length > 1 ? colors[i] : colors[j];
					alpha = highlightConfig == null ? "100"
							: (highlightConfig.x.indexOf(xLabels[j]) > -1 || highlightConfig.y
									.indexOf(yData[i][j]) > -1) ? "100" : "30";
					if (highlightConfig.x.indexOf(xLabels[j]) > -1
							|| highlightConfig.y.indexOf(yLabels[i]) > -1) {

						data
								.push({
									"value" : yData[i][j],
									"label" : xLabels[j],
									"tooltext" :yLabels[i] + ": " + yData[i][j],
									"anchorradius" : (highlightConfig.x.length == 0 && highlightConfig.y.length == 0) ? ""
											: "6",
									"anchorsides" : (highlightConfig.x.length == 0 && highlightConfig.y.length == 0) ? ""
											: "4",
									"anchorbordercolor" : (highlightConfig.x.length == 0 && highlightConfig.y.length == 0) ? ""
											: "000000",
									"anchorbgcolor" : (highlightConfig.x.length == 0 && highlightConfig.y.length == 0) ? ""
											: "FF0000"
								});

					} else {
						var alphaLocal = (this.md.md.VIEW_MD.FLD_CHART_TYPE == "LINE"
								|| this.md.md.VIEW_MD.FLD_CHART_TYPE == "ZOOMLINE" || (highlightConfig.x.length == 0 && highlightConfig.y.length == 0)) ? "100"
								: alpha;
						data.push({
							"value" : yData[i][j],
							"label" : xLabels[j],
							"alpha" : alphaLocal,
							"tooltext" : yLabels[i] + ": " + yData[i][j]
						});

					}
				}
				dataset.push({
					"seriesname" : yLabels[i],
					"showvalues" : "0",
					"data" : data
				});

			}

			if (this.md.md.VIEW_MD.FLD_CHART_TYPE == "BAR") {

				if ($.isEmptyObject(xData) || $.isEmptyObject(yData) || xData[0].length == 0
						|| yData[0].length == 0) {
					return;
				}
				this.loadBarGraphFusionChart(xLegend, category, dataset, refLine, chartW, chartH, graphTitle,
						refPts, yAxisName);
			}

			if (this.md.md.VIEW_MD.FLD_CHART_TYPE == "PIE") {
				var data = this.getXYData(cords);
				if ($.isEmptyObject(xData) || $.isEmptyObject(yData) || xData[0].length == 0
						|| yData[0].length == 0) {
					return;
				}
				this.loadPieGraphFusionChart(xLegend, category, dataset, refLine, chartW, chartH, graphTitle,
						data, highlightConfig, refPts, yAxisName);
			}

			if (this.md.md.VIEW_MD.FLD_CHART_TYPE == "LINE") {
				if ($.isEmptyObject(xData) || $.isEmptyObject(yData) || xData[0].length == 0
						|| yData[0].length == 0) {
					return;
				}
				this.loadLineGraphFusionChart(xLegend, category, dataset, refLine, chartW, chartH, graphTitle,
						refPts, yAxisName);
			}
		}

	},
	/**
	 * @description This method is used to looping through the labels'
	 *              array and for each label invoke the
	 *              formatValueByType to format it in proper format.
	 * @param labels
	 *            Array of labels.
	 * @param type
	 *            Type of the coordinate values/legend.
	 * @returns labels The formatted labels array.
	 */
	formatValuesByType : function(labels, type) {
		if (labels != null) {
			for ( var i = 0; i < labels.length; i++) {
				labels[i] = this.formatValueByType(labels[i], type);
			}
		}
		return labels;
	},

	/**
	 * @description Format and Convert the labels into appropriate type
	 *              on the basis of wether it is date or floating-point
	 *              number.
	 * @param label
	 *            A Label to denote the data point in chart.
	 * @param type
	 *            Type of the coordinate values/legend.
	 * @returns label The formatted label.
	 */
	formatValueByType : function(label, type) {
		if (type != null) {
			if (type === "date") {
				if (cbx.core.isDate(label)) {
					return label.format(iportal.preferences.getDateFormat());
				} else {
					return this.convertDateValueToUserPreferedFmt(label);
				}
			} else if (type === "float") {
				if (!$.isEmptyObject(label)) {
					var val = new String(label);
					val = $.format.number(val, '##,##,###.00');
					return val;
				}
			}
		}
		return label;
	},

	/**
	 * @description Converts the date string into a user-preferred
	 *              formatted date object.
	 * @param dateVal
	 *            The Date String.
	 * @returns The Date object in user preferrd format.
	 * @returns __val The Date object not formatted into user preferred
	 *          format.
	 */
	convertDateValueToUserPreferedFmt : function(dateVal) {
		var __val = this.convertStringToDateObject(dateVal);
		if (cbx.core.isDate(__val)) {
			return $.format.date(val, 'dd-mm-yyyy');
		}
		return __val;
	},

	/**
	 * @description Convert a date-string into date-object.
	 * @param stdat
	 *            Date-String.
	 * @returns "Invalid Date" If date-string is not a valid date.
	 * @returns xdate the date object.
	 * @return stdat the date-string if stdat is not a date-string or
	 *         empty.
	 */
	convertStringToDateObject : function(stdat) {
		if (!Ext.isEmpty(stdat) && typeof (stdat) == 'string') {
			var vals = stdat.split("/");
			var xdate = null;
			var monthfield = vals[1];
			var dayfield = vals[0];
			var yearfield = vals[2];
			xdate = new Date(yearfield, monthfield - 1, dayfield);
			if ((xdate.getMonth() + 1 != monthfield) || (xdate.getDate() != dayfield)
					|| (xdate.getFullYear() != yearfield)) {
				return "Invalid Date";
			} else {
				xdate = new Date();
				var intvals = [ Number(vals[0]), Number(vals[1]), Number(vals[2]) ];
				xdate.setFullYear(intvals[2], intvals[1] - 1, intvals[0]);
				return xdate;
			}
		} else
			return stdat;
	},
	/**
	 * @description Get the details of x-y coordinates, like what is the
	 *              type, what is the legend etc.
	 * @returns The object containing the details about coordinates.
	 */
	getXYSeries : function() {

		var clms = this.md.md.VIEW_MD.FLD_COLUMN_LIST;

		var rb = CRB.getBundle(this.md.md.VIEW_MD.FLD_BUNDLE_KEY);
		var commonBundle = rb;

		var obj = {};
		obj.Y_COLUMN = [], obj.Y_COLUMN_LABEL = [], obj.Y_COLUMN_DATA_TYPE = [], obj.X_COLUMN = [],
				obj.X_COLUMN_LABEL = [], obj.X_COLUMN_DATA_TYPE = [];
		var displayName = "";
		for ( var i = 0, clen = clms.length; i < clen; i++) {
			displayName = rb && rb['LBL_' + clms[i].FLD_COLUMN_DISPLAY_NAME_KEY] ? rb['LBL_'
					+ clms[i].FLD_COLUMN_DISPLAY_NAME_KEY] : commonBundle
					&& commonBundle['LBL_' + clms[i].FLD_COLUMN_DISPLAY_NAME_KEY] ? commonBundle['LBL_'
					+ clms[i].FLD_COLUMN_DISPLAY_NAME_KEY] : clms[i].FLD_COLUMN_DISPLAY_NAME_KEY;
			if (clms[i].FLD_Y_SERIES_IND === "Y") {
				obj.Y_COLUMN.push(clms[i].FLD_COLUMN_ID);
				obj.Y_COLUMN_LABEL.push(displayName);
				obj.Y_COLUMN_DATA_TYPE.push(clms[i].FLD_DATA_TYPE);
			} else if (clms[i].FLD_X_SERIES_IND === "Y") {
				obj.X_COLUMN.push(clms[i].FLD_COLUMN_ID);
				obj.X_COLUMN_LABEL.push(displayName);
				obj.X_COLUMN_DATA_TYPE.push(clms[i].FLD_DATA_TYPE);
			}
		}
		return obj;
	},

	/**
	 * @description Get the x-y coordinate values/data.
	 * @param coords
	 *            Conatins the details about the cordinates.
	 * @returns the Object containing the data and labels of x-y
	 *          coordinates.
	 */
	getXYData : function(cords) {
		var totalRec = this.store.getCount(), rec = null, xValue = null, yValue = null, xData = [], yData = [], xLabels = [], yLabels = [], xAllData = [], yAllData = [], xAllLabels = [], yAllLabels = [];
		var maxLen = cords.Y_COLUMN.length > cords.X_COLUMN.length ? cords.Y_COLUMN.length
				: cords.X_COLUMN.length;

		for ( var j = 0; j < maxLen; j++) {
			xData = [], yData = [], xLabels = [], yLabels = [];
			for ( var i = 0; i < totalRec; i++) {
				rec = this.store.getAt(i);

				if (rec != null) {
					xValue = rec[cords.X_COLUMN[j]];
					yValue = rec[cords.Y_COLUMN[j]];
					if (typeof xValue != "number") {
						xLabels.push(xValue);
						xData.push(i + 1);
					} else {
						xLabels.push(xValue);
						xData.push(xValue);
					}

					if (parseFloat(yValue) != yValue) {

						yLabels.push(yValue);
						yData.push(i + 1);
					} else {
						yLabels.push(yValue);
						yData.push(yValue);
					}
				}
			}
			xLabels = this.formatValuesByType(xLabels, cords.X_COLUMN_DATA_TYPE[j]);

			yLabels = this.formatValuesByType(cords.Y_COLUMN_LABEL[j], cords.Y_COLUMN_DATA_TYPE[j]);

			xAllData.push(xData), yAllData.push(yData), xAllLabels.push(xLabels), yAllLabels.push(yLabels);

		}

		return {
			"xData" : xAllData,
			"yData" : yAllData,
			"xLabels" : xAllLabels,
			"yLabels" : yAllLabels

		};
	},

	/**
	 * @description Set the various parameters and render the bar-chart
	 *              on the page.
	 * @param xLegend
	 *            x-axis name.
	 * @param category
	 * @param dataset
	 *            the data set to display.
	 * @param refLine
	 * @param chartW
	 *            chart width.
	 * @param chartH
	 *            chart height.
	 * @param graphTitle
	 *            title of the graph.
	 * @param refPts
	 *            contains last updated date, time and unit of chart
	 *            data.
	 */
	loadBarGraphFusionChart : function(xLegend, category, dataset, refLine, chartW, chartH, graphTitle, refPts) {

		FusionCharts.setCurrentRenderer("javascript");

		var chart = null;
		var chartId = this.WIDGET_ID + "_" + this.md.md.VIEW_MD.VIEW_ID + Math.random();
		chart = new FusionCharts("FusionCharts/MSColumn3D.swf", chartId, chartW, chartH - 10, "0", "1");

		chart.setJSONData({
			"chart" : {
				"palette" : "0",
				"canvasbgColor" : "",
				"bgAlpha" : "0",
				"canvasbgAlpha" : "0",
				"animation" : "1",
				"xAxisName" : xLegend,
				"yAxisName" : "",
				"shownames" : "1",
				"rotateNames" : "0",
				"borderalpha" : "0",
				"showpercentintooltip" : "0",
				"canvasBorderAlpha" : "100",
				// "labeldisplay" : "ROTATE",
				// "slantlabels" : "1",
				"useRoundEdges" : "1",
				"bgcolor" : "000",
				"bgAlpha" : "0",
				"basefontcolor" : "#070B19",
				"tooltipbgcolor" : "#CED8F6",
				"legendBgAlpha" : "0",
				"placeValuesInside" : "0",
				"forceYAxisValueDecimals" : "0",
				"yAxisValueDecimals" : "0",
				"legendposition" : "BOTTOM",
				'numberprefix' : (null != refPts && null != refPts.UNIT_SYMBOL ? refPts.UNIT_SYMBOL : "")

			},
			"categories" : [ {
				"category" : category
			} ],
			"dataset" : dataset,
			"trendlines" : refLine

		});
		chart.setTransparent(true);
		chart.render($(this.elem).get(0));
		setTimeout(function() {
			chart.resizeTo(chartW, chartH);
		}, 500);

	},
	/**
	 * @description Set the various parameters and render the pie-chart
	 *              on the page.
	 * @param xLegend
	 *            x-axis name.
	 * @param category
	 * @param dataset
	 * @param refLine
	 * @param chartW
	 *            chart width.
	 * @param chartH
	 *            chart height.
	 * @param graphTitle
	 *            title of graph.
	 * @param pieData
	 *            the set of data to render on chart.
	 * @param highlightConfig
	 *            object containing details to highlight data.
	 * @param refPts
	 *            contains last updated date, time and unit of chart
	 *            data.
	 */
	loadPieGraphFusionChart : function(xLegend, category, dataset, refLine, chartW, chartH, graphTitle,
			pieData, highlightConfig, refPts) {
		var that = this;
		var obj = [];
		var alpha = "100";
		var colors = [ "F26D7D", "008ED6", "F6BD0F", "006600", "ABA000", "588526", "008ED6", "9D080D", "CC6600" ];
		for ( var i = 0; i < pieData.xLabels[0].length; i++) {
			alpha = highlightConfig == null ? "100"
					: (highlightConfig.x.indexOf(pieData.xLabels[0][i]) > -1 || highlightConfig.y
							.indexOf(pieData.yData[0][i]) > -1) ? "100" : "30";
			if (highlightConfig != null && highlightConfig.x.length == 0 && highlightConfig.y.length == 0) {
				alpha = "100";
			}
			obj.push({
				"value" : pieData.yData[0][i],
				"label" : pieData.xLabels[0][i],
				"color" : colors[i],
				"alpha" : alpha
			});
		}
		FusionCharts.setCurrentRenderer("javascript");

		var chartId = this.WIDGET_ID + "_" + this.md.md.VIEW_MD.VIEW_ID + Math.random();
		var chart = new FusionCharts("FusionCharts/Pie3D.swf", chartId, chartW, chartH - 10, "0", "1");
		chart.setJSONData({
			"chart" : {
				"palette" : "0",
				"canvasbgColor" : "",
				"bgAlpha" : "0",
				"animation" : "1",
				"canvasBorderAlpha" : "100",
				"canvasbgAlpha" : "0",
				"borderalpha" : "0",
				"showpercentintooltip" : "0",
				"canvasBorderAlpha" : "1000",
				"basefontcolor" : "#070B19",
				"tooltipbgcolor" : "#CED8F6",
				"legendBgAlpha" : "0",
				"bgcolor" : "",
				"showlegend" : "1",
				"showvalues" : "0",
				"showlabels" : "1",
				"enableSmartLabels" : "1",
				"legendPosition" : "BOTTOM",
				'numberprefix' : (null != refPts && null != refPts.UNIT_SYMBOL ? refPts.UNIT_SYMBOL : "")
			},

			"data" : obj
		});
		chart.setTransparent(true);
		chart.render($(this.elem).get(0));
		setTimeout(function() {
			chart.resizeTo(chartW, chartH);
		}, 500);
	},
	/**
	 * @description Set the various parameters and render the Line-chart
	 *              on the page.
	 * @param xLegend
	 *            x-axis name.
	 * @param category
	 * @param dataset
	 * @param refLine
	 * @param chartW
	 *            chart width.
	 * @param chartH
	 *            chart height.
	 * @param graphTitle
	 *            title of graph.
	 * @param pieData
	 *            the set of data to render on chart.
	 * @param highlightConfig
	 *            object containing details to highlight data.
	 * @param refPts
	 *            contains last updated date, time and unit of chart
	 *            data.
	 */
	loadLineGraphFusionChart : function(xLegend, category, dataset, refLine, chartW, chartH, graphTitle,
			refPts, yAxisName) {

		var chartId = this.WIDGET_ID + "_" + this.md.md.VIEW_MD.VIEW_ID + Math.random();
		FusionCharts.setCurrentRenderer("javascript");
		var chart = new FusionCharts("FusionCharts/MSSpline.swf", chartId, chartW, chartH, "0", "1");

		chart.setJSONData({
			"chart" : {
				"palette" : "0",
				"canvasbgColor" : "FFFFFF",
				"canvasbgAlpha" : "0",
				"animation" : "1",
				"xAxisName" : xLegend,
				"yAxisName" : yAxisName,
				"shownames" : "1",
				"borderalpha" : "0",
				"seriesNameInToolTip" : "0",
				"divlineisdashed" : "1",
				"connectnulldata" : "1",
				// "labeldisplay" : "ROTATE",
				// "slantlabels" : "1",
				"canvasBorderAlpha" : "100",
				"bgcolor" : "FFFFFF",
				"legendposition" : "BOTTOM"
			},

			"categories" : [ {

				"category" : category

			} ],

			"dataset" : dataset,

			"trendlines" : refLine

		});
		chart.render($(this.chartElem).get(0));
		setTimeout(function() {
			chart.resizeTo(chartW, chartH);
		}, 500);
	}
});
/**
 * 
 */
CLCR.registerCmp({'COMP_TYPE' : 'APP','VIEW_TYPE' : 'CHART'}, canvas.lib.view.ChartView);
