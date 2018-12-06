/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
cbx.ns('cbx.lib.view');
/**
 * @namespace "cbx.lib.view"
 * @description The name space cbx.lib.view are useful for organizing the code.<br>
 *              It provides 2 main benefits.<br>
 *              The first is that we can use them to prevent polluting the global namespace with objects,which is
 *              generally considered to be undesireable. cbx, for example has just a single global object (the cbx
 *              object). It's good practice to put any classes inside a namespace, a commonone is the name of your
 *              company or the name of your application.The other advantage is that assists in keeping our code
 *              organized, we can group together similar or co-dependent classes in the same namespace, which helps to
 *              specify your intent to other developers.
 */

cbx.lib.view.Template = Class({
	/**
	 * @class "cbx.lib.view.Template"
	 * @description This class is responsible to build the custom list view with the template provided by the
	 *              implementation (developer). This class is invoked when the view type of a view in VIEW_DEFINITION
	 *              table is 'TEMPLATE' and the appropriate 'TEMPLATE_ID' is set which has an entry in
	 *              VIEW_TEMPLATE_MASTER [TEMPLATE_ID,TEMPLATE_CONFIG (template path) ]
	 * @author Swathi
	 */

	constructor : function (config)
	{
		/**
		 * @member constructor
		 * @memberof "cbx.lib.view.Template"
		 * @description Constructor of the cbx.lib.view.Template class that receives the metadata from the
		 *              cbx.lib.List.utility class and initiate the custom list view construction
		 */
		if (typeof config == 'object')
		{
			$.init.TemplateView(config);
		} else
			return false;
	}
});

$.widget("init.TemplateView", {

	defaults : {
		'listMD' : {},
		'parent' : {},
		'utilityScope' : {}
	},

	/**
	 * @member _init
	 * @memberof "cbx.lib.view.Template"
	 * @description init method that initializes the defaults of template class with the config passed to this class
	 */
	_init : function ()
	{

		this.options = $.extend({}, this.defaults, this.options);
		this.md = this.options.utilityScope.listViewMD;
		this.id = this.options.utilityScope.id;
		this.parentId = this.options.utilityScope.parentId;
		this.widgetID = this.options.utilityScope.widgetID;
		this.appEvtRegistry = this.options.utilityScope.appEventRegistry; // Event registry for view type as TEMPLATE,
		// used to raise the events
		this.continer = $(".widget-content");
		this.templateConfig = this.md.TEMPLATE_CONFIG; // Custom template URL from where the template to be fetched
		this.templateConfig = this.templateConfig.replace(/&bsol;/g, "\\"); // Format the URL

		this.accumulate=this.options.utilityScope.accumulate;
		this.parentScope=this.options.utilityScope.scope;
		this.extraParamsHandler = this.options.utilityScope.extraParamsHandler;
		this.extraParams = this.options.utilityScope.extraParams;


		this.parentMv = this.appEvtRegistry.getMVObj(); // Object to be used to raise events that are registered for
		this.parentElem = $(this.options.parent);
		this.renderTemplate();

	},

	/**
	 * @member renderNoDataMsg
	 * @memberof "cbx.lib.view.Template"
	 * @description Displays message acknowledging the user that the business data is not received, thus no data to
	 *              display
	 */
	renderNoDataMsg : function ()
	{
		var $table = $("<table/>").addClass("custom-template");
		var $tr = $("<tr/>");
		var tableData = $("<td/>").addClass("noData").css("font-size", "12px");
		var text = iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(),
					this.md.SYSTEM_VIEW_ID + "_NO_DATA_MSG");

		if (cbx.isEmpty(text) || text == this.md.SYSTEM_VIEW_ID + "_NO_DATA_MSG")
		{
			text = iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "NO_DATA_MSG");
		}
		var textConfig = {
					eleType : "span",
					html : text
		}
		var noRecordText = new cbx.lib.layer(textConfig).getLayer();
		tableData.append($(noRecordText).addClass('noData').html());
		$tr.append(tableData);
		$table.append($tr);
		this.parentElem.append($table);
	},

	/**
	 * @member renderTemplate
	 * @memberof "cbx.lib.view.Template"
	 * @description Checks if the custom template is static or custom and redirects to the appropriate flow accordingly
	 */
	renderTemplate: function() {
		if(this.md.FLD_AUTOLOAD_IND == 'N'){
			this.loadStaticTemplate();	
		}else{
			this.createStore(this);
		}
	},

	createStore:function(scopeHandler){
		var generatedParams=scopeHandler.generateParams();
		this.store = new canvas.core.Store({
			params : generatedParams,
			listeners : {
				'load' : scopeHandler.loadDynamicTemplate,
				'beforeload' : scopeHandler.preLoad

			},
			scope : scopeHandler,
			containerId:scopeHandler.widgetID,
			dataController:true,
			id:'store-'+scopeHandler.widgetID,
			accumulate : scopeHandler.accumulate || false,
			autoLoad : true,
			reader : {
				root : 'response.value.ALL_RECORDS',
				totalProperty : 'response.value.TOTAL_COUNT',
				additionalData : 'response.value.ADDITIONAL_DATA',
				idProperty : 'response.value.ADDITIONAL_DATA.UNIQUE_COLUMN'
			},
			bufferSize : scopeHandler.perPage
		});

	},
	preLoad : function (params)
	{

	},
	reloadData : function ()
	{
		this.store.reload();
	},
	generateParams:function(){

		var params = {
					"__LISTVIEW_REQUEST" : "Y",
					"PAGE_CODE_TYPE" : 'VDF_CODE',
					"INPUT_ACTION" : "INIT_DATA_ACTION",
					"INPUT_PRODUCT" : this.md.PRODUCT_CODE,
					"PRODUCT_NAME" : this.md.PRODUCT_CODE,
					"INPUT_FUNCTION_CODE" : this.md.FUNCTION_CODE,
					"INPUT_SUB_PRODUCT" : this.md.SUB_PRODUCT_CODE,
					"WIDGET_ID" : this.widgetID,
					"VIEW_ID" : this.md.SYSTEM_VIEW_ID
		};
		var mutiViewObj = this.appEvtRegistry.getMVObj();
		var extraparams = this.extraParamsHandler?this.extraParamsHandler.apply(this.parentScope,[params]):params;
		extraparams = !cbx.isEmpty(this.extraParams) && cbx.isObject(this.extraParams)?cbx.apply(extraparams,this.extraParams):extraparams;
		extraparams = !cbx.isEmpty(mutiViewObj.getDefaultDateParams())?cbx.apply(extraparams,mutiViewObj.getDefaultDateParams()):extraparams;
		if(!cbx.isEmpty(this.additionalParams)){			
			cbx.apply(extraparams,this.additionalParams);
		}

		return extraparams;
	},

	/**
	 * @member loadStaticTemplate
	 * @memberof "cbx.lib.view.Template"
	 * @description Responsible to render static template without passing any config to the tmplLayer
	 */
	loadStaticTemplate : function ()
	{
		var cusTempID = this.md.TEMPLATE_ID; 
		if (!cbx.isEmpty(cusTempID) && cusTempID != 'NONE' && (!cbx.isEmpty(this.templateConfig)))
		{
			var tmpLayer = new ct.impl.tmplLayer(this.templateConfig, true);
			tmpLayer.getTemplate(this.applyStaticTemplate, this);
		}else{
			this.parentElem.append($(this.getNoRecordText()).html());	
		}
	},

	/**
	 * @member applyStaticTemplate
	 * @memberof "cbx.lib.view.Template"
	 * @description This method is called on successful compilation of custom static template It is responsible to
	 *              append the template to the parent DOM and attach the required events
	 */
	applyStaticTemplate : function (staticTemplate, tmpClass)
	{
		var me = this;
		this.parentElem.append(staticTemplate);
		$('#app').trigger('pagecreate');
		this.parentElem.find('*[data-single-click="true"]').on("click", {
			scope : me
		}, me.handleClick);
		this.parentElem.find('*[data-input="true"]').on("change", {
			scope : me
		}, me.handleInputChange);
		if (!cbx.isEmpty(this.templateConfig))
		{
			this.parentMv.raiseEvent(CWEC.AFTER_TEMPLATE_LOAD, [ {
				elem : this.parentElem
			} ]);
		}
		doIScroll('CONTENT_DIV', 'refresh');
	},


	handleClick : function (evtObj)
	{
		var me = evtObj.data.scope, cell = this;
		var record="";
		var parentMv= me.parentMv;
		if (me.store != undefined)
		{
			record = me.store.records[$(cell).attr('data-row-index')] || "";
		}
		var columnId = $(cell).attr('data-column-id');
		parentMv.raiseEvent(CWEC.SINGLE_CLICK, [ record,columnId ]);
	},

	/**
	 * 
	 */
	handleInputChange : function(evtObj) {
		var me = evtObj.data.scope, cell = this;
		var record="";
		var parentMv= me.parentMv;
		if (me.store != undefined) {
			record = me.store.records[$(cell).attr('data-row-index')];
		}
		var colId = $(cell).attr('data-column-id');
		var value = $(this).val() || $(this).text();
		parentMv.raiseEvent(CWEC.CELL_DATA_CHANGE, [ record,colId,value ]);
	},

	isRowTemplate : function ()
	{
		if (this.options.utilityScope.columnArray.length > 0)
			return true;
		else
			return false;
	},

	/**
	 * @member prepareListColumns
	 * @memberof "cbx.lib.view.Template"
	 * @description Responsible to massage and separate the visible, hidden and ignored columns of custom dynamic
	 *              template
	 */
	prepareListColumns : function ()
	{
		this.VISIBLE_COLS = []; // Holds the set of columns that set as visible
		this.HIDDEN_COLS = []; // Holds the set of columns that are set as hidden
		this.IGNORED_COLS = []; // Hold the set of columns that are neither set as visible nore hidden
		var columnArray = this.md.FLD_COLUMN_LIST;
		for (var j = 0; j < columnArray.length; j++)
		{
			columnArray[j].FLD_VISIBLE_IND === "Y" ? (columnArray[j].FLD_HIDDEN_IND === "N" ? this.VISIBLE_COLS
						.push(columnArray[j]) : this.HIDDEN_COLS.push(columnArray[j])) : this.IGNORED_COLS
						.push(columnArray[j]);
		}
	},

	prepareRowTemplate : function (records,additionalData)
	{
		var columns = this.md.FLD_COLUMN_LIST;
		if (columns.length > 0)
		{
			var allColumns = [];
			for (var j = 0; j < columns.length; j++)
			{
				var column = columns[j];
				if (column.FLD_VISIBLE_IND == "Y" && (column.FLD_CHANNEL_ID == "A" || column.FLD_CHANNEL_ID == "M"))
				{
					if (!cbx.isEmpty(column.FLD_PRIORITY))
					{
						allColumns.push(column);
					}
				}
			}
			var keysrt = function (key)
			{
				return function (a, b)
				{
					if (a[key] > b[key])
						return 1;
					if (a[key] < b[key])
						return -1;
					return 0;
				}
			}
			allColumns.sort(keysrt("FLD_PRIORITY"));
			if (allColumns.length > 0)
			{
				this.renderRowTemplate(allColumns, records,additionalData);
			} else
			{
				LOGGER.log("No columns found with FLD_PRIORITY aligned");
				this.prepareFullTemplate(records,additionalData);
			}
		}
		return columns;
	},

	processData : function (colType, val, metadata, data)
	{
		var value = val;
		switch (colType.toUpperCase())
		{
			case "DATE":		
				var dateVal = cbx.lib.utility.formatDate(val,this.options.utilityScope.serverDateFormat,this.options.utilityScope.outDateFormat);
				val = !cbx.isEmpty(dateVal)?dateVal:val;
				break;
			case "AMOUNT":
			case "FLOAT":
				var fooAttribute;
				var islinkedCurrAvail = false;
				var curr = data[metadata.LINKED_SOURCE_CCY];
				var currAppend = metadata.FLD_APPEND_CURRENCY_MODE || '';
				var currDecimalPlaceList = cbx.globalcurrency.metadata.getCurrDecimalPlaceList();
				var currList = currDecimalPlaceList;

				if (currList != null)
				{
					var currDecForLinkedCurr = currList[curr];
					if (currDecForLinkedCurr != undefined && currDecForLinkedCurr.trim() != '')
					{
						(islinkedCurrAvail = true);
					}
				}
				var currBasedDecimal = 2;
				if (!cbx.isEmpty(val))
				{
					if (!curr || curr.trim() == '' || curr == '')
					{
						/**
						 * get the default curr from preference
						 */
						curr = iportal.systempreferences.getDefaultBankCCY();
						if (!curr || curr.trim() == '' || curr == '')
						{
							/**
							 * get the default curr configured in the orbidirect properties
							 */
							curr = cbx.globalcurrency.metadata.getDefaultCurrency();
						}
					}
					if (curr && curr != '' && curr.trim() != '')
					{
						currBasedDecimal = currList[curr];
					}
					try
					{
						if (val.charAt(0) == ".")
						{
							val = "0" + val;
						}
					} catch (err)
					{
					}
					val = new String(val);
					var sn =  canvas.amountFormatter.getInstance();
					val = sn.basicFormatter(val.replace(/,/g,""), currBasedDecimal);
					if (islinkedCurrAvail == true)
					{
						if (iportal.preferences.isLangDirectionRTL() === true)
						{
							if (currAppend == "PREFIX")
							{
								val = "<div  class='amountColumnInRTL'>" + val + " " + curr + "</div>";
							} else
							{
								val = "<div  class='amountColumnInRTL'>" + curr + " " + val + "</div>";
							}
						} else
						{
							if (currAppend == "PREFIX")
							{
								val = curr + " " + val;
							} else if (currAppend == "POSTFIX")
							{
								val = val + " " + curr;
							}
						}
					} else
					{
						val = val;
					}
					fooAttribute = Number(value.replace(/[,.]/g, ""));
				} else
				{
					val = canvas.NULL_VAL_REPLACE;
					fooAttribute = 0;
				}
				val = val;
				break;
			default:
				val = val;
		}
		return val;

	},

	getHiddenColumns : function (records, index, alreadyAvailableColumns)
	{
		var hiddenColsArray = [];
		var columnArray = this.md.FLD_COLUMN_LIST;
		for (var j = 0; j < columnArray.length; j++)
		{
			if (columnArray[j].FLD_VISIBLE_IND === "N" && columnArray[j].FLD_HIDDEN_IND === "Y")
			{
				var key = columnArray[j].FLD_COLUMN_ID;
				if (!this.filterColumns(alreadyAvailableColumns, key))
				{
					columnArray[j].VALUE = this.processData(columnArray[j].FLD_DATA_TYPE, records[index][key], columnArray[j],
								records[index]);
					hiddenColsArray.push(columnArray[j]);
				}
			}
		}
		return hiddenColsArray;
	},

	filterColumns : function (cols, colid)
	{
		var tmpArray = [];
		for (i = 0; i < cols.length; i++)
		{
			tmpArray.push(cols[i].FLD_COLUMN_ID);
		}
		if (tmpArray.indexOf(colid) >= 0)
			return true;
		else
			return false;
	},

	renderRowTemplate: function(columns, records,additionalData){
		if(!cbx.isEmpty(columns)){
			var table = $("<table id='custom-tmp-" + this.id + "' data-item-id=\"ct-tpl-bodyContainer\" />").addClass("tbl-type-1");
			var allColumnData = {"columns":[],"id":"custom-tmp-"+this.id};
			var index;
			for(var i=0; i<records.length; i++){
				var row = {};

				this.count = this.store.getTotalCount() || 0;
				for(var col=0; col<columns.length; col++){
					var key = columns[col].FLD_COLUMN_ID,
					colObj = {};
					colObj["SERVER_DATE_FORMAT"] = this.options.utilityScope.serverDateFormat;
					colObj["OUT_DATE_FORMAT"] = this.options.utilityScope.outDateFormat;
					colObj["LINKED_SOURCE_CCY"] = columns[col].LINKED_SOURCE_CCY;
					colObj["FLD_APPEND_CURRENCY_MODE"] = columns[col].FLD_APPEND_CURRENCY_MODE;
					var dataReceived = this.processData(columns[col].FLD_DATA_TYPE, records[i][key], colObj, records[i]);
					row["columnData" + col] = dataReceived;

				}
				allColumnData.columns.push(row);
			}
			var dataArray = [],hiddenCols=[],dataObj={},hiddenColsArr=[],clonedArr=[];

			for(var index=0; index < records.length; index++){
				var rowData = allColumnData.columns[index];
				var remainingDataArray = [];
				for(var rem=2; rem < Object.keys(rowData).length; rem++){
					remainingDataArray.push(rowData["columnData" + rem]);
				}
				hiddenColsArr = this.getHiddenColumns(records, index, columns);
				if(hiddenColsArr.length > 0) {
					clonedArr = cbx.clone(hiddenColsArr);
				}else{
					clonedArr = [];
				}
				dataObj = {
							"primary" : rowData["columnData0"],
							"secondary" : rowData["columnData1"],
							"remainColCount" : remainingDataArray.length - 1,
							"remainingDataArray" : remainingDataArray,
							"REC_CURR":records[index]["REC_CURR"] || index
				};
				if(clonedArr.length > 0){
					dataObj.hiddenCols = clonedArr;
				}
				dataArray.push(dataObj);
			}

			var finalDataObj ={
						"dataArray" : dataArray
			};
			this.parentMv.raiseEvent(CWEC.BEFORE_TEMPLATE_LOAD, [ finalDataObj,true ]);
			this.rowTemplate = true;
			if(!cbx.isEmpty(Handlebars) && !cbx.isEmpty(Handlebars.templates) && cbx.isFunction(Handlebars.templates[this.md.TEMPLATE_ID])){
				var template = Handlebars.templates[this.md.TEMPLATE_ID](finalDataObj);
				table.append(template);
				this.applyDynamicTemplate(table.get(0));
			} else {
				this.templateConfig = this.templateConfig.replace('{FRAMEWORK}', 'jqm');
				var tmpLayer = new ct.impl.tmplLayer(this.templateConfig, finalDataObj);
				var that = this;
				tmpLayer.getTemplate(function(template){
					table.append(template);
					that.applyDynamicTemplate(table.get(0));
				}, this);
			}
		}
	},

	loadMoreRowTemplate : function (data)
	{
		this.listData = this.listData.concat(data);
		this.prepareRowTemplate(data);
	},

	prepareFullTemplate : function (records,additionalData)
	{

		this.prepareListColumns();
		this.getCustomTemp(records,additionalData);
	},

	loadDynamicTemplate : function (records,additionalData)
	{
		if(records.length> 0){
			if (this.md.FLD_COLUMN_LIST.length > 0)
			{
				// consider as row Template
				this.listData = records;
				this.prepareRowTemplate(records,additionalData);
			} else
			{
				this.listData = records;
				this.prepareFullTemplate(records,additionalData);
			}
		} else {
			this.renderNoDataMsg();
		}
	},

	getCustomTemp : function (records)
	{

		var ROWS_CONFIG = [];
		for (var i = 0; i < records.length; i++)
		{

			var rowObj = {
						COLS_CONFIG : [],
						ROW_INDEX : 0
			}; // A row object that has Columns config array of objects and the row index
			var COLS_CONFIG = []; // An array of objects that holds the columns metadata of the current row
			for (var j = 0; j < this.VISIBLE_COLS.length; j++)
			{ // Loop only the visible columns
				var key = this.VISIBLE_COLS[j].FLD_COLUMN_ID; // get the current iteration column id
				var colObj = {}; // An object that holds metadata of the current column of the current row
				colObj["DATA_TYPE"] = this.VISIBLE_COLS[j].FLD_DATA_TYPE; // Set the current column data type
				colObj["CELL_DATA"] = this.processData(this.VISIBLE_COLS[j].FLD_DATA_TYPE, records[i][key], colObj,
							records[i]); // Set the current column formatted data to be displayed in the cell
				colObj["COLUMN_NAME"] = this.VISIBLE_COLS[j].FLD_COLUMN_DISPLAY_NAME_KEY;
				colObj["COLUMN_ID"] = this.VISIBLE_COLS[j].FLD_COLUMN_ID;
				COLS_CONFIG.push(colObj); // Push the current column object to the columns config object array
			}
			rowObj.COLS_CONFIG = COLS_CONFIG; // Set the current columns config object array as value of the current
			// object's key COLS_CONFIG
			rowObj.ROW_INDEX = i; // Set the current row index
			ROWS_CONFIG.push(rowObj); // Push the current row object to the rows config object array
		}

		var listTempConfig = { // Config to be passed to the custom dynamic template for compilation
					"VIEW_ID" : this.id, // View Id
					"VISIBLE_COLS" : this.VISIBLE_COLS, // Set of visible columns to be displayed (list header template
					// metadata)
					"ROWS_CONFIG" : ROWS_CONFIG, // Rows config (list body template metadata)
					"ACTUAL_DATA" : records,
					"HIDDEN_COLS":this.HIDDEN_COLS,
					"IGNORED_COLS":this.IGNORED_COLS,
					"RECORD_COUNT":records.length,
					"TOTAL_COUNT":!cbx.isEmpty(this.store.getTotalCount())?parseInt(this.store.getTotalCount()) : 0
		};

		this.parentMv.raiseEvent(CWEC.BEFORE_TEMPLATE_LOAD, [ listTempConfig ]);

		if (!cbx.isEmpty(Handlebars) && !cbx.isEmpty(Handlebars.templates)
					&& cbx.isFunction(Handlebars.templates[this.md.TEMPLATE_ID]))
		{
			var template = Handlebars.templates[this.md.TEMPLATE_ID](listTempConfig);
			this.applyDynamicTemplate(template, this);
		} else
		{
			this.templateConfig = this.templateConfig.replace('{FRAMEWORK}', 'jqm');
			var tmpLayer = new ct.impl.tmplLayer(this.templateConfig, listTempConfig);
			tmpLayer.getTemplate(this.applyDynamicTemplate, this);
		}
	},

	/**
	 * @member applyDynamicTemplate
	 * @memberof "cbx.lib.view.Template"
	 * @description Responsible append the compiled template received to the parent DOM
	 */
	applyDynamicTemplate : function (dynamicTemplate, tmpClass)
	{
		var me = this;

		this.parentElem.empty();

		this.parentElem.append(dynamicTemplate);
		if(!cbx.isEmpty(this.store.getCount()) && !cbx.isEmpty(this.store.getTotalCount()) && (parseInt(this.store.getTotalCount()) > this.store.getCount())){
			var that = this;
			this.start = 0;
			this.parentElem.find('[data-item-id=ct-tpl-pagination]').on('click', function (e)
						{

				me.store.loadPaginatedControllerData();
				me.isPagination = true;
						});
		} else
		{
			this.parentElem.find('[data-item-id=ct-tpl-pagination]').remove();
		}

		$('#app').trigger('pagecreate');
		doIScroll('CONTENT_DIV', 'refresh');
		var singleClickRows = this.parentElem.find('[data-single-click=true]');
		var viewRowDOMs = this.parentElem.find('[data-item-id=ct-tpl-record]');
		var inputChangeRows = this.parentElem.find('[data-input=true]');
		this.bindRowEvents(singleClickRows, viewRowDOMs,inputChangeRows);



		if(!cbx.isEmpty(this.store.getCount()) && !cbx.isEmpty(this.store.getTotalCount()) && (parseInt(this.store.getCount()) >= this.store.getTotalCount()))
		{
			this.parentElem.find('[data-item-id=ct-tpl-pagination]').remove();
		}else{
			if ($('#custom-tmp-'+this.id).find('[data-item-id="ct-tpl-record"]').length >= this.count)
			{
				this.parentElem.find('[data-item-id=ct-tpl-pagination]').remove();
			}
		}
		if (!cbx.isEmpty(this.templateConfig))
		{
			this.parentMv.raiseEvent(CWEC.AFTER_TEMPLATE_LOAD, [ {
				elem : this.parentElem,
				records : this.listData
			} ]);
		}
	},

	/**
	 * @member bindRowEvents
	 * @memberof "cbx.lib.view.Template"
	 * @description Responsible to bind single click and context click (long tap) events for the records registered
	 */
	bindRowEvents : function (singleClickRows,viewRowDOMs,inputChangeRows)
	{
		var me = this;

		if(inputChangeRows){
			inputChangeRows.on('click',
						function (e)
						{ // Binding single click event
				e.preventDefault();
				e.stopPropagation();
						})

						inputChangeRows.on('change',
									function (e)
									{ // Binding single click event
							e.preventDefault();
							e.stopPropagation();
							var rowIndex = $(this).attr('data-row-index')
							|| $(this).parents("[data-row-index]").attr('data-row-index');
							var currRowData =me.store.getAt(rowIndex);
							//me.listData[rowIndex];
							var columnId = $(this).attr('data-column-id');
							var value = $(this).val() || $(this).text();
							me.parentMv.raiseEvent(CWEC.CELL_DATA_CHANGE, [ currRowData,columnId,value ]);
									});
		}
		if(singleClickRows){
			singleClickRows.on('click',
						function (e)
						{ // Binding single click event
				//e.stopPropagation();
				var rowIndex = $(this).attr('data-row-index')
				|| $(this).parents("[data-row-index]").attr('data-row-index');
				var currRowData =me.store.getAt(rowIndex);
				//me.listData[rowIndex];
				var columnId = $(this).attr('data-column-id');
				me.parentMv.raiseEvent(CWEC.SINGLE_CLICK, [ currRowData,columnId ]);
						});
		}

		if(viewRowDOMs){
			viewRowDOMs.each(function (i, obj)
						{
				$(obj)
				.on(
							'click',
							function (e)
							{ // Binding long tap (context) click event
								//e.stopPropagation();
								var parentTR = $(e.target).parents('[data-item-id=ct-tpl-record]');
								rowIndex = parentTR.attr('data-row-index');
								var currRowData =/* me.listData[rowIndex]*/me.store.getAt(rowIndex), sibilings = parentTR
								.find('[data-sibilings=true]');
								parentTR.siblings().removeClass('selectRowColor');
								$(e.target).parents('tr,[data-item-id=ct-tpl-record]').addClass('selectRowColor');
								parentTR.parents("table").find('[data-sibilings=true]').filter(function ()
											{
									if ($(this).parents("tr").get(0) != parentTR.get(0))
									{
										$(this).parents("tr").removeClass("selectColor");
										$(this).hide();
									}
											});
								if (sibilings.length > 0)
								{
									if (sibilings.is(":visible"))
									{
										sibilings.slideUp("fast", function ()
													{
											parentTR.removeClass("selectColor");
											parentTR.find(".custom-tmp-icons span").removeClass(
											"custom-expandCollpase-reverse").addClass(
											"custom-expandCollpase");
											$('#app').trigger('pagecreate');
											doIScroll('CONTENT_DIV', 'refresh');
													});
									} else
									{
										sibilings.slideDown("fast", function ()
													{
											parentTR.addClass("selectColor");
											parentTR.find(".custom-tmp-icons span").removeClass(
											"custom-expandCollpase").addClass(
											"custom-expandCollpase-reverse");
											parentTR.siblings().find('.custom-expandCollpase-reverse').removeClass("custom-expandCollpase-reverse").addClass(
											"custom-expandCollpase");
											cbx.contextMenuRenderer.getContextMenu(me.id, currRowData, e, {});
											$('#app').trigger('pagecreate');
											doIScroll('CONTENT_DIV', 'refresh');
													});
									}
								} else
								{

									cbx.contextMenuRenderer.getContextMenu(me.id, currRowData, e, {});

								}
								doIScroll('CONTENT_DIV', 'refresh');			
							});
						});
		}


	}

});


