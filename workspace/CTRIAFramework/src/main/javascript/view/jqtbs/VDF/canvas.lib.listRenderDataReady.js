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

cbx.ns('canvas.lib');
/**
 * @className 	canvas.lib.listRenderDataReady
 * @description	
**/

canvas.lib.listRenderDataReady= Class({

	/**
	 * @method 		Constructor
	 * @memberof 	"canvas.lib.listRenderDataReady"
	 * @description Initializes listRenderDataReady.
	 */
	constructor : function(){
		/*
		 * Used to apply filter for a particular column.
		 */
		this.validateFlag=true;
		/*
		 * Contains all the column values grouped row-wise.
		 */
		this.totalRows= [];
		/*
		 * Contains row-wise details for hidden rows.
		 */
		this.hiddenRows = [];
		/*
		 * Renders default sort icon for all columns.
		 */
		this.dirClass= "flaticon-up-down-arrow2";
		this.context_col_position = -1;
		this.updatedRecords = 0;
		this.columnValue = {};
		this.dateTo = canvas.datePreferences.getParsedDateFormat();//iportal.preferences.getDateFormat();
		this.dateFrom = canvas.datePreferences.getParsedDateFormat();//iportal.preferences.getDateFormat();
	},

	/**
	 * @method 		renderListTableWrapper
	 * @memberof 	"canvas.lib.listRenderDataReady"
	 * @param	    isHeaderChangeReq - Boolean value which indicates if header rerendering is required<BR>
	 * @description Initialize function calls the list TableWrapper template.
	 * 				This template contains the parent DOM and the table inside the parent 
	 * 				to hold the grid.
	 * 				If already rendered, renderList method is called.
	 */
	renderListTableWrapper: function(isHeaderChangeReq){
		this.isHeaderChangeReq = (isHeaderChangeReq == true || typeof(isHeaderChangeReq) == 'undefined')? true : false;
		this.viewID = this.listViewMD.viewMD.VIEW_ID;
		if(this.isHeaderChangeReq){
			var templateUrl = "listTableWrapper.cttpl";
			var tplLayer = new ct.lib.tmplLayer(templateUrl, this);
			tplLayer.getTemplate(this.applyTemplate, this);
		} else{
			this.renderList();
		}
		
	},
	
	/**
	 * @method 		applyTemplate
	 * @memberof 	"canvas.lib.listRenderDataReady"
	 * @param	 	template - the html dom of the content inside the list
	 * @description The template is rendered inside the wrapper container. 
	 * 				renderList method is called.
	 */		
	applyTemplate : function(template){
			this.listview.listWrapperCont.html(template);
			this.renderList();
	},

	/**
	 * @method 		renderList
	 * @memberof 	"canvas.lib.listRenderDataReady"
	 * @description 1. 	listDataRenderer class is called here.
	 * 				2. 	The handlers for all the list events are bound here. 
	 * 				3.	Calls listUtility class to initialise custom helper classes of handlebars in list.
	 * 				4. 	Calls the methods to render list header (during initial load only) and 
	 * 					load more (inside tbody) and list footer (inside list footer). 
	 * 				5.	Also calls defaultEventHandler to handle the click events in the load-more part.
	 */	
	renderList : function(){
		
		this.renderer = new canvas.lib.listDataRenderer();
		this.renderer.config = this;
		this.renderer.listview = this.listview;
		this.filterTplUrl = "listFilters.cttpl";
		this.initializeElements();	
		this.saveAsColFilters=[];
		this.renderer.instantiateBindingHandlers();
		this.datePrefFormat =canvas.datePreferences.getParsedDateFormat();
		this.viewMD = this.listViewMD.getViewMD();
		this.viewType = this.listViewMD.getViewType();
		this.metadata = this.listViewMD.getWidgetMD();
		this.colMd = this.listViewMD.getViewColumnMD();
		this.colCount = this.colMd.length;
		this.initColHeaders();
		this.records = this.listData.getRecords();
		this.utility = new canvas.lib.listUtility({config: this});
		this.utility.doHandlerBarsHelpers(this);
		this.perPage = this.listViewMD.getPerPage();
		this.rowSelection = this.viewMD.FLD_SELECTION_TYPE == "ROWMULTI" || this.viewMD.FLD_SELECTION_TYPE == "MULTIPLE" ? true : false;
		this.updatedRecords= !cbx.isEmpty(this.records) ? this.updatedRecords + this.records.length : 0;
		this.recordsCount=this.listData.actualTotalCount;
		this.recordsLength = this.recordsCount;
		if(this.isHeaderChangeReq){
			this.headerCols = [];
			this.renderHeader();
			if(this.viewType=="ADVGROUP"){
				//this.listHeaderCont.find('th.spacer').remove();
				this.prepareGroupedRows();
			}
			else{
				this.renderLoadMore();
				this.renderFooter();
			}
				
		} else{
			if(this.viewType=="ADVGROUP"){
				//this.listHeaderCont.find('th.spacer').remove();
				this.prepareGroupedRows();
			}
			else{
				this.renderLoadMore();
				this.renderFooter();
			}
		}
		//this.defaultEventHandler();
		
	},
	
	/**
	 * @method 		initializeElements
	 * @memberof 	"canvas.lib.listRenderDataReady"
	 * @description All the containers' references are taken here.
	 */		
	initializeElements : function (){
		var that = this;
		this.listHeaderCont = this.listview.listWrapperCont.find("thead[data-item-id=ct_listHead]");
		this.listBodyCont = this.listview.listWrapperCont.find("tbody[data-item-id=ct_listBody]");
		this.listFooterCont = this.listview.listWrapperCont.parent().find("[data-item-id=ct_listFoot]");
		this.listtbar = this.listview.listWrapperCont.parent().find("[data-item-id=list-toolbar]");
		this.tableWrapperCont = this.listview.listWrapperCont.find("div[name='"+this.viewID+"'].table-wrapper-container");
	},

	/**
	 * @method 		getParamValue
	 * @memberof 	"canvas.lib.listRenderDataReady"
	 * @param		key - (String) Key whose value has to be fetched from action params
	 * @return		Parameter value of the key passed
	 * @description Returns the value of a param for a particular key.
	 * 				(Written in listRenderDataReady because it is used in utility class.)
	 */		
	getParamValue: function(key){
		return this.params.actionParams[key];
	},

	/**
	 * @method 		renderHeader
	 * @memberof 	"canvas.lib.listRenderDataReady"
	 * @description Massages the data to render the header for the list.
	 * 				Data massage is done column by column based on metadata values.
	 * 				For the row selection, context and detail action column, columns are rendered 
	 * 				based on indicator calues.
	 * 				Row expander is shown by default in header.
	 * 				After massaging of data, renderListHeader method is called.
	 */	
	renderHeader : function(){
		this.hiddenHeader = [];
		this.renderer.listHeaderCont = this.listHeaderCont;
		
		/*
		 * Sorting the colMd according to priority starts here
		 */
		var tempArray = $.extend(true,[],this.colMd);
		var sortedArray = tempArray.sort(function(a,b){
			return a.FLD_PRIORITY - b.FLD_PRIORITY;
		});
		var prev=0,
			highestPriority = 0,
			firstPriority = false,
			prevPriority = 0;
		for(var i=0;i<sortedArray.length;i++){
			if (sortedArray[i].FLD_HIDDEN_IND == "Y")
			{
				sortedArray[i].FLD_PRIORITY = ""
				continue;
			}
			if(prevPriority == parseInt(sortedArray[i].FLD_PRIORITY) ){
				sortedArray[i].FLD_PRIORITY = prev;
			}
			else if((sortedArray[i].FLD_PRIORITY == "")||cbx.isEmpty(sortedArray[i].FLD_PRIORITY)){
				sortedArray[i].FLD_PRIORITY = "";
			}
			else{
				prevPriority = parseInt(sortedArray[i].FLD_PRIORITY);
				sortedArray[i].FLD_PRIORITY = parseInt(prev)+1;
				prev = sortedArray[i].FLD_PRIORITY;
			}
			if(highestPriority<prev){
				highestPriority = prev;
			}
		}
		for(var i = 0; i < this.colMd.length; i++) {
			for(var j = 0; j < sortedArray.length; j++) {
				if(this.colMd[i].FLD_COLUMN_ID == sortedArray[j].FLD_COLUMN_ID) {
					if((this.colMd[i].FLD_PRIORITY == "")||cbx.isEmpty(sortedArray[j].FLD_PRIORITY)){
						this.colMd[i].FLD_PRIORITY = highestPriority+1;
						if(this.colMd[i].FLD_PRIORITY == 1){
							firstPriority = true;
							highestPriority = 1;
						}
														
					}
					else{
						if(sortedArray[j].FLD_PRIORITY == 1 ){
							this.colMd[i].FLD_PRIORITY =  firstPriority ? 
										sortedArray[j].FLD_PRIORITY+1 : 
											sortedArray[j].FLD_PRIORITY
											firstPriority = true;
						}else{
							this.colMd[i].FLD_PRIORITY = sortedArray[j].FLD_PRIORITY;
						}
					}
					
				}
			}
		}
		/* 	Sorting ends here	*/
		
		/* Massaging of column metadata before sending to template */
		var hiddenCols = 0,
		hiddenColsLength_xs = 0, 
		hiddenColsLength_sm = 0; 
		for(var i=0;i<this.colCount;i++){
			  var colObj = {},
			  		cssClass ="";
			  // chanelId indicator and hidden indicator added , begins
			  if(this.colMd[i].FLD_CHANNEL_ID!='A'){
				  var device=iportal.systempreferences.getDevice();
				  var channels= this.colMd[i].FLD_CHANNEL_ID.split(',');
				  if(channels.contains(device)){
					  	continue;
					  	}
				  }
			  	if (this.colMd[i].FLD_HIDDEN_IND == "Y")
				{continue;}
			  	// chanelId indicator and hidden indicator added, ends
			  colObj["COL_ID"] = this.colMd[i].FLD_COLUMN_ID;
			  colObj["HEADER_VAL"] = this.colMd[i].HEADER_VAL;
			  colObj["VISIBLE_IND"] =  this.colMd[i].FLD_VISIBLE_IND;
			  colObj["FLD_APPEND_CURRENCY_MODE"] = this.colMd[i].FLD_APPEND_CURRENCY_MODE;
			  colObj["DATA_TYPE"] =this.colMd[i].FLD_DATA_TYPE;
			  colObj["LINKED_SOURCE_CCY"] = this.colMd[i].LINKED_SOURCE_CCY;
			  colObj["DRILLDOWN_IND"] = this.colMd[i].FLD_DD_REQ_IND;
			  colObj["TH_INDEX"]= i;
			  colObj["FLD_PRIORITY"]= this.colMd[i].FLD_PRIORITY;
			  cssClass = this.utility.columnPriority(parseInt(this.colMd[i].FLD_PRIORITY));
			  if(cssClass == "hidden-xs"){
					hiddenColsLength_xs++;
				}
				else if(cssClass == "hidden-xs hidden-sm"){
					hiddenColsLength_sm++;
				}else if(cssClass == "hidden"){
					hiddenCols++;
				}
			  if(this.colMd[i].FLD_DATA_TYPE=="float"){
				  cssClass = cssClass + " text-right";
			  }
			  colObj["cssClass"] = cssClass;
			  colObj["additionalData"] =this.additionalData;
			  colObj["ROWSELECTION"] = this.colMd[i].ROWSELECTION;
			  
			  if((this.colMd[i].FLD_VISIBLE_IND == "N")||(this.colMd[i].FLD_GROUPED_IND == "Y")){
				  colObj["cssClass"] = " hidden";
				  this.hiddenHeader.push(colObj);
			  }
			  colObj["SORTABLE"] = this.colMd[i].FLD_SORTABLE_IND;
			  colObj["FILTER_ENABLED"] = this.colMd[i].FLD_FILTER_ENABLE_IND;
			  colObj["COLUMNORDER"]=this.viewType == 'ADVGROUP' ? false : (this.viewMD.FLD_COL_ORDER_IND =='Y' ? true : false);
			  var filter_ind= false;
			  if(this.viewMD.FLD_FILTER_IND == "Y" && this.colMd[i].FLD_FILTER_ENABLE_IND == true && this.colMd[i].FLD_DATA_TYPE != 'translatedvalue'){
					  this.filterClass.setXType(this.colMd[i].FLD_DATA_TYPE);
						var submenu = this.filterClass.getSearchTypes();
						if(submenu.length > 1){
							colObj["SUBMENU"] = submenu;
							}
				 
			  }
			  colObj["SHOW_ICONS"] = true;
			  colObj["FLD_GROUPABLE_IND"] = this.colMd[i].FLD_GROUPABLE_IND;
			  colObj["FLD_GROUPED_IND"]= this.colMd[i].FLD_GROUPED_IND;
			  colObj["FLD_POS_IN_GROUP"]= this.colMd[i].FLD_POS_IN_GROUP;
			  colObj["FLD_SUMMARY_TYPE"]= this.colMd[i].FLD_SUMMARY_TYPE;
			  colObj.toolTipforSorting =this.colMd[i].toolTipforSorting;
			  colObj.toolTipforFilter = this.colMd[i].toolTipforFilter;
			  this.headerCols.push(colObj);
		  }
		  
		
		var context_action = this.metadata.md.VIEW_MD.FLD_CONTEXT_ACTION_IND == 'Y' ? true : false;
		var detail_action = this.metadata.md.VIEW_MD.FLD_DETAIL_ACTION_IND == 'Y' ? true : false;
		
		var context_col = this.metadata.md.VIEW_MD.FLD_CONTEXT_COLUMN == 'Y' ? true : false;
		var context_column = (context_col && context_action) ? true : false;
		
		var action_row = (context_column || detail_action) ? true : false;
		
		if(context_column) {
			context_column = false
			var col_list = this.metadata.md.VIEW_MD.FLD_COLUMN_LIST;
			for(var i=0; i< col_list.length; i++) {
				if(col_list[i].FLD_COLUMN_ID == 'CONTEXT') {
					context_column = true;
				}
			}
		}
		
		if(context_column){
			//change to 'headerCols' for showing only cols of particular chanel ID
			for(var i=0;i<this.headerCols.length;i++){
				if(this.headerCols[i].COL_ID == 'CONTEXT'){
					this.headerCols[i].HEADER_VAL = '';
					this.headerCols[i].SHOW_ICONS = false;
					this.context_col_position = this.headerCols[i].TH_INDEX;
				}
			}
		}
		
		if((context_action && !context_col) || !context_action) {
			for(var i=0;i<this.headerCols.length;i++){
				if(this.headerCols[i].COL_ID == 'CONTEXT'){
					this.context_col_position = i;
					this.headerCols.splice (i,1);
					this.colMd.splice (i,1);
					this.colCount = this.colCount -1;
				}
			}
		}
		/*
		 * Preparing params to pass into the header template, with extra params in case of advanced grouping grid
		 */
		var rowExpand = 'visible';
		if(hiddenCols > 0)
			rowExpand = 'visible';
		else if(hiddenColsLength_sm > 0)
			rowExpand = 'visible-sm visible-xs';
		else if(hiddenColsLength_xs > 0)
			rowExpand = 'visible-xs';
		var listHeaderParams={
				"HEADER_COLS" : this.headerCols,
				"CONTEXT_COLUMN" : context_column,
				"ACTION_COLUMN" : this.viewType=='PAGING' ? action_row : false,
				"ROWSELECTION" : this.rowSelection,
				"IS_LIST_VIEW_TYPE_CLASS" : this.viewType == 'LIST' ? "visible-xs" : "",
				"colLen" : this.getColLen(),
				"rowExpand" : rowExpand
		  };
			if(this.viewType == 'ADVGROUP'){
				listHeaderParams['IS_GROUPING_GRID'] = true;
				listHeaderParams['fieldPosInGroup'] = this.getfieldPosInGroup();
			}
		this.renderer.renderListHeader(listHeaderParams);
	},
	
	/**
	 * @method 		renderBody
	 * @memberof 	"canvas.lib.listRenderDataReady"
	 * @description Massages the data to render the gird values for the list.
	 * 				For each row, Data massage is done column by column based on metadata values.
	 * 				For the row selection, context and detail action column, columns are rendered 
	 * 				based on indicator values.
	 * 				Row expander is shown by default for all the rows.
	 * 				For context action, the whole DOM is created here based on data and then appended 
	 * 				to body. It is displayed on right click.
	 * 				After massaging of data, checkLoadMore method is called. 
	 * 				(done to check if load more is still required.)
	 */		
	renderBody : function() {
		this.renderer.handlerRegistryObj.updatePosition();
		this.records = this.listData.getRecords();
		this.renderer.listBodyCont = this.listBodyCont;
		var listBodyParams = {},
		cssClass="",
		expandCss ="";
		var tags = [];
		/*
		 * Context related actions in the records
		 */
		var context_action = this.metadata.md.VIEW_MD.FLD_CONTEXT_ACTION_IND == 'Y' ? true : false;
		var detail_action = this.metadata.md.VIEW_MD.FLD_DETAIL_ACTION_IND == 'Y' ? true : false;
		var detail_act = detail_action;
		var context_act = context_action;
		context_action = context_action ? "" : "disabled";
		detail_action = detail_action ? "" : "disabled"; 
		var context_col = this.metadata.md.VIEW_MD.FLD_CONTEXT_COLUMN == 'Y' ? true : false;
		var context_column = ( context_col && context_act) ? true : false;
		var action_row = (context_column || detail_act) ? true : false;
		if(context_column) {
			context_column = false;
			var col_list = this.metadata.md.VIEW_MD.FLD_COLUMN_LIST;
			for(var i=0; i< col_list.length; i++) {
				if(col_list[i].FLD_COLUMN_ID == 'CONTEXT') {
					context_column = true;
				}
			}
		}
		
		var context_list = this.metadata.md.CONTEXT_MENU_LIST[0];
		var context_menu_type = null;
		var context_child = [];
		var context_html = '';
		if(!cbx.isEmpty(context_list)) {							
			var find_childs = function(parent_obj) {
				if(!cbx.isEmpty(parent_obj.child_nodes)) {
					for(var temp=0; temp<parent_obj.child_nodes.length; temp++) {
						find_childs(parent_obj.child_nodes[temp]);
					}
				}
				else {
					context_child.push(parent_obj);
				}
			}
			for(var temp=0; temp<context_list.child_nodes.length; temp++) {
				find_childs(context_list.child_nodes[temp]);
			}		
			LOGGER.log("context_child", context_child);
			context_menu_type = context_list.context_type;
			
			if(context_menu_type == 'MENU') {
				for(var i=0;i<context_child.length;i++) {
					context_html += '<span data-context-id="' + context_child[i].menu_id + '" data-item-action="context-action" class="ct-paging_context-menu">';
					context_html += '<span class = "ct-paging_context-menu__' + context_child[i].display_key_nm +'"></span>' + context_child[i].display_key_nm + '</span> ';
					context_html += '&nbsp';
				}
			}
			else if(context_menu_type == 'ICON'){
				context_html += '<div class="btn-group"><span class="ct-listview__context-menu" data-context-paging="true">';
				context_html +=	'<span data-icon-action="context" data-placement="right" data-toggle="tooltip" data-original-title="Context_Action">';
				context_html +=	'<span class="ct-contextaction-fld" aria-hidden="true"></span>';
				context_html += '</span></span></div>';
			}
		}
		
		/* Massaging of records metadata before passing into the template */
		tags = this.getFilterparams();
		if(tags.length > 0){
			listBodyParams["FILTERS"] = tags;
		}
		
		var hiddenCols = 0,
			hiddenColsLength_xs = 0, 
			hiddenColsLength_sm = 0;
		if(!cbx.isEmpty(this.records)){
			var listData = []; 
			var perPage = this.perPage>=this.records.length ? this.records.length : this.perPage;
			for (var j = 0; j < perPage; j++) {
				
				var record = this.records[j];
				var index = this.getParamValue("start")+j;
				var rowData = [],
					rowHidden = [];
				for (var i = 0; i < this.headerCols.length; i++) {
					var colObj = {};
					var key = this.headerCols[i].COL_ID;
					
					if(key == 'CONTEXT') {
						colObj["VALUE"] = context_html;
					}
					else {
						colObj["VALUE"] = this.utility.validateRowData(this.headerCols[i].DATA_TYPE,record[key],this.headerCols[i],record);
					}
					colObj["DATA_TYPE"] = this.headerCols[i].DATA_TYPE;
					colObj["VISIBLE_IND"]= this.headerCols[i].VISIBLE_IND;
					//colObj["DATA_TYPE"] = this.colMd[i].FLD_DATA_TYPE;
					colObj["COL_ID"] = this.headerCols[i].COL_ID;
					colObj["ROW_INDEX"] = index;
					colObj["COL_INDEX"] = this.headerCols[i].COL_ID+"|"+i;
					cssClass = this.utility.columnPriority(parseInt(this.headerCols[i].FLD_PRIORITY));
					if(cssClass == "hidden-xs"){
						expandCss = "visible-xs";
						hiddenColsLength_xs++;
					}
					else if(cssClass == "hidden-xs hidden-sm"){
						expandCss = "visible-xs visible-sm";
						hiddenColsLength_sm++;
					}else if(cssClass == "hidden"){
						expandCss = "visible";
						hiddenCols++;
					}
					else{
						expandCss = "hidden";
					}
					if(key=="CONTEXT"){
						expandCss = "hidden";
					}
					
					if(this.headerCols[i].DATA_TYPE == "amount" || this.headerCols[i].DATA_TYPE == "float") cssClass = cssClass+" text-right";
					if(record.HIGHTLIGHT){
						cssClass += " "+record.HIGHTLIGHT; 
					}
					if( this.headerCols[i].VISIBLE_IND == "N"){
						cssClass += " hidden";
						expandCss = "visible";
						rowHidden.push(colObj);
					}else if(this.headerCols[i].FLD_GROUPED_IND == "Y"){
						cssClass += " hidden";
						expandCss = "hidden";
					}
					if(key == 'CONTEXT') {
						cssClass += " text-center"
					}
					colObj["cssClass"] = cssClass;
					colObj["EXPAND_CLASS"] = expandCss;
					if((key == 'CONTEXT' && context_act && context_col) || (key != 'CONTEXT')) {
						rowData.push(colObj);
					}
				}
				var rowExpand = 'visible';
				if(hiddenCols > 0)
					rowExpand = 'visible';
				else if(hiddenColsLength_sm > 0)
					rowExpand = 'visible-sm visible-xs';
				else if(hiddenColsLength_xs > 0)
					rowExpand = 'visible-xs';
				listData.push({'rowData' : rowData, 'rowExpand' : rowExpand, 'ROW_INDEX' : index});
				if(this.totalRows.indexOf(rowData)<0){
					this.totalRows.push(rowData);
				}
				this.hiddenRows[index]={"data":rowHidden};
			}
			listBodyParams["ROWSELECTION"]= this.rowSelection;
			listBodyParams["LIST_DATA"] = listData;
			listBodyParams["colLen"] = this.getColLen();
			listBodyParams["CONTEXT_COLUMN"] = context_column;
			listBodyParams["CONTEXT_ACTION"] = context_action;
			listBodyParams["DETAIL_ACTION"] = detail_action;
			listBodyParams["ACTION_COLUMN"] = this.viewType=='PAGING' ? action_row : false;
			listBodyParams["CONTEXT_MENU_TYPE"] = context_menu_type;
			listBodyParams["CONTEXT_CHILD"] = context_child;
			listBodyParams["HEADER_COLS"] =this.headerCols;
			listBodyParams["FILTER_IND"] = (this.viewMD.FLD_FILTER_IND == "Y")&&(!cbx.isEmpty(this.viewMD.FLD_FILTER_IND)) ? true : false;
			listBodyParams["IS_LIST_VIEW_TYPE_CLASS"] = this.viewType == 'LIST' ? "visible-xs" : "";
			listBodyParams["VIEW_TYPE"] = this.viewType;
			if(this.viewType == 'ADVGROUP'){
				listBodyParams["colspace"] = this.fieldPosInGroup.length+1;
				this.renderer.renderListBody({
					listBodyData : listBodyParams,
					parentGrpInd : this.fieldPosInGroup.length - 1
				});
			}else{
				if((this.getParamValue("currentPage")==1)||(this.viewType == 'LIST')){
					this.renderer.renderFilters({
						listBodyData : listBodyParams,
					});
				}else{
					this.renderer.renderListBody({
						listBodyData : listBodyParams,
					});
				}
			}
			
			
			
	
	 }else{
		 
		 this.renderEmptyMessage(listBodyParams);
		 
	 }
	},
	
	/**
	 * @method 		renderEmptyMessage
	 * @memberof 	"canvas.lib.listRenderDataReady"
	 * @param		listBodyParams - records metadata 
	 * @description Displays empty message when called.
	 * 				After massaging of data, checkLoadMore method is called. 
	 * 				(done to check if load more is still required.)
	 */		
	renderEmptyMessage : function(listBodyParams){
		this.renderer.listBodyCont = this.listBodyCont;
		var nodata_key = this.listViewMD.SYSTEM_VIEW_ID+"_NO_DATA_MSG";
		var text = CRB.getBundleValue(this.bundleKey,nodata_key);
    	if(cbx.isEmpty(text)){
    		text = CRB.getFWBundleValue("NO_DATA_MSG");
    	}
		listBodyParams["NODATA"] = true;
		listBodyParams["colLen"] = this.getColLen();
		listBodyParams["NODATA_MSG"] = text;
		listBodyParams["HEADER_COLS"] =this.headerCols;
		listBodyParams["VIEW_TYPE"] = this.viewType;
		if(this.viewType == 'ADVGROUP'){
			listBodyParams["colspace"] = this.fieldPosInGroup.length+1;
			this.renderer.renderListBody({
				listBodyData : listBodyParams,
				parentGrpInd : this.fieldPosInGroup.length - 1
			});
		}else{
			this.renderer.renderFilters({
				listBodyData : listBodyParams
			});
		}
		
		
	},
	
	/**
	 * @method 		getfieldPosInGroup
	 * @memberof 	"canvas.lib.listRenderDataReady"
	 * @return		Sorted array of the groupable columns according to FLD_POS_IN_GROUP
	 * @description Sorts the groupable columns according to their position from metadata. 
	 */	
	getfieldPosInGroup : function(){
		var tempArray = [];
		for(var i=0;i<this.headerCols.length;i++){
			if(this.headerCols[i].FLD_GROUPED_IND =="Y"){
				tempArray.push(this.headerCols[i]);
			}
		}
		var sortedArray = tempArray.sort(function(a,b){
			return a.FLD_POS_IN_GROUP - b.FLD_POS_IN_GROUP;
		});

		var highestPriorityNum = 0,
		lowestPriorityNum = sortedArray[0].FLD_POS_IN_GROUP;
		for(var i=0;i<sortedArray.length;i++){
			if(parseInt(sortedArray[i].FLD_POS_IN_GROUP) > highestPriorityNum)
				highestPriorityNum = sortedArray[i].FLD_POS_IN_GROUP;
			if(parseInt(sortedArray[i].FLD_POS_IN_GROUP) < lowestPriorityNum)
				lowestPriorityNum = sortedArray[i].FLD_POS_IN_GROUP;
		}
		for(var i=0;i<sortedArray.length;i++){
			if((sortedArray[i].FLD_POS_IN_GROUP =="-1")||(sortedArray[i].FLD_POS_IN_GROUP =="")||cbx.isEmpty(sortedArray[i].FLD_POS_IN_GROUP))
				sortedArray[i].FLD_POS_IN_GROUP = highestPriorityNum ;
			else
				sortedArray[i].FLD_POS_IN_GROUP = parseInt(sortedArray[i].FLD_POS_IN_GROUP);
		}
		this.fieldPosInGroup = sortedArray;
		return this.fieldPosInGroup;
	},
	
	/**
	 * @method 		prepareGroupedRows
	 * @memberof 	"canvas.lib.listRenderDataReady"
	 * @description Prepares params to pass into the template body for grouped rows
	 */
	prepareGroupedRows : function(){
		var fieldPosInGroup = this.getfieldPosInGroup();
		this.records = this.listData.getRecords();
		this.groupedRecords = this.records;
		this.renderGroupedRows({"parentGroupId": fieldPosInGroup[0].FLD_COLUMN_ID, "grpInd" :0});

		this.renderer.renderFilters({
			"HEADER_COLS" : this.headerCols,
			"FILTER_IND" : (this.viewMD.FLD_FILTER_IND == "Y")&&(!cbx.isEmpty(this.viewMD.FLD_FILTER_IND)) ? true : false,
			"FILTERS" : this.getFilterparams(),
			"GROUPCOLS" : fieldPosInGroup
			
		});
		
	},
	
	/**
	 * @method 		renderGroupedRows
	 * @memberof 	"canvas.lib.listRenderDataReady"
	 * @param		config - (Object)grouped rows metadata 
	 * @description 1. Prepares the data for summary(sum, min, max, avg) for required columns<BR>
	 * 				2. Passes the grouped rows massaged metadata to canvas.lib.listDataRenderer.renderGroupRows
	 */
	renderGroupedRows : function(config){
		
		var parent_grId = config.parentGroupId,
		parent_rowInd = config.parentRowInd,
		grp_index = config.grpInd;
		var groupedRecords = this.getGroupedRecords(grp_index, parent_rowInd);
		var summaryType = ['SUM','MIN','MAX','AVG'];
		if(!cbx.isEmpty(groupedRecords)){
			var groupedRows = [],
				i=0;
			for(var index=0; index<groupedRecords.length;index++){
				var record =groupedRecords[index];
				var colID = record.GRP_HEADER.split('::::')[0],
				colValue = record.GRP_HEADER.split('::::')[1];
				var summmarylbl = "";
				var groupCols = $.extend(true,[],groupCols,this.headerCols);
				groupCols.map(function(e) {
					if(summaryType.contains(e.FLD_SUMMARY_TYPE) ){
						var value = this.utility.validateRowData(e.DATA_TYPE,record[e.COL_ID],e,record);
						var label = e.HEADER_VAL+" ("+e.FLD_SUMMARY_TYPE+" : "+value+")";
						e.SUMMARY_LBL = label;
						summmarylbl = cbx.isEmpty(summmarylbl) ? label : summmarylbl+", "+label;
					}
				},this);
				var colLen = this.fieldPosInGroup.length-grp_index+1;
				if(this.rowSelection){	colLen++; }
					
					var groupedRow={
							"label" : '<span class="ct-app__tools flaticon-expand flaticon-listGroup"></span><span data-header-data class="group_headerData"> '+groupCols[groupCols.map(function(e) { return e.COL_ID; }).indexOf(colID)].HEADER_VAL+" : "+colValue+'</span>',
							"colLen" : colLen,
							"colspace" : grp_index+1,
							"index" : grp_index,
							"COLID" : colID,
							"row_index" : !cbx.isEmpty(parent_rowInd) ? parent_rowInd +""+index : index,
							"summmarylbl" : summmarylbl,
							"isLeaf" : config.isLeaf,
							"ROWSELECTION" : this.rowSelection,
							"HEADER_COLS"  : groupCols
					};
					i++;
					groupedRows.push(groupedRow);
			}
			this.renderer.renderGroupRows({"groupedRows" : groupedRows,
											"index" : grp_index,
											"parentColId": parent_grId,
											"parentRowInd" : parent_rowInd});
			
			
		}else{
			this.renderEmptyMessage({});
		}
	},
	/**
	 * @method 		getGroupedRecords
	 * @memberof 	"canvas.lib.listRenderDataReady"
	 * @param 		grp_index - group level of the column to be fetched
	 * @param		parent_rowInd - row Index of the parent group whose child rows are be fetched
	 * @return 		Child group records of the parent index
	 * @description Returns child group records of the parent group been expanded
	 */
	getGroupedRecords : function(grp_index,parent_rowInd){
		if(grp_index != 0){
			var parent_rowIndArr = parent_rowInd.toString().split("");
			var records = this.groupedRecords;
			for(var i=0; i<parent_rowIndArr.length ; i++){
				records = records[parseInt(parent_rowIndArr[i])].CHILD;
			}
			return records;
		}else{
			return this.groupedRecords;
		}
		
	},
	/**
	 * @method 		renderFooter
	 * @memberof 	"canvas.lib.listRenderDataReady"
	 * @description Displays empty message when called.
	 * 				After massaging of data, checkLoadMore method is called. 
	 * 				(done to check if load more is still required.)
	 */	
	 
	// BO: change done for FLD_TOTAL_RESULT_IND , starts
	renderFooter : function(){
		this.listFooterCont.empty();
		var pagingRecords={},
		totalResultInd = false;
		if(this.viewMD.FLD_TOTAL_RESULT_IND!='N'){
		var startCount;
		totalResultInd = true;
		this.renderer.listFooterCont = this.listFooterCont;
		if(this.viewType == 'PAGING') {
			
			if(cbx.isEmpty(this.recordsCount)){
				startCount = 0;
			}else{
				startCount = 1;
			}
		}
		else {
			if(cbx.isEmpty(this.recordsCount)){
				startCount = 0;
			}else{
				startCount = this.ajaxCall.ajaxParams.start+1;
			}
			var endCount = (startCount + this.perPage -1) > this.recordsCount ? this.recordsCount : (startCount + this.perPage - 1)
		}
		var pagingRecords = {
								"displaying":CRB.getFWBundle()["DISPLAYING"],
								"of":CRB.getFWBundle()["OF"],
								"from": startCount,
								"to":this.viewType == 'PAGING' ? (this.updatedRecords || 0) : (endCount || 0),
								"total":this.recordsCount || 0,
								"colLen" : this.getColLen()
							}
		}
		this.renderer.renderListFooter({
			listFooterData : {"pagingRecords":pagingRecords,
							  "totalResultInd":totalResultInd}
		});
	},	
	/**
	 * @method 		renderFilterForm
	 * @memberof 	"canvas.lib.listRenderDataReady"
	 * @param		opts - (Object) Details like xtype, columnID and searchType of the filter required
	 * @description Renders filter form when called.
	 */	
	renderFilterForm : function(opts) {
		var that = this;
		var obj ={};
		obj["Contains"] = iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(),"LBL_contains");
		obj["LessThan"] = iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(),"LBL_NUM_LT");
		obj["GreaterThan"] = iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(),"LBL_DT_GT");
		obj["equals"] = iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(),"LBL_NUM_CONST_EQUALS");
		obj["btnSearch"] = iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(),"LBL_SEARCH");
		obj["btnCancel"] = iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(),"LBL_CANCEL");
		obj["field_Name"] = opts.column;
		obj["placeHolderEquals"] =iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "LBL_STR_CONST_EQUALS");
		obj["lblGreaterThan"]=iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "LBL_NUM_CONST_GREATER_THAN");
		obj["lblLessThan"]=iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "LBL_NUM_CONST_LESS_THAN");
		var filterParams = this.filterClass.getTemplateParams(opts.searchType);
		$.extend(filterParams,obj);
		filterParams["xType"] = this.getTmplObject(opts.xType);
		var tplLayer = new ct.lib.tmplLayer("listFilters.cttpl",filterParams);
		tplLayer.getTemplate(function(template){
			this.listBodyCont.find("form[data-filter-form]").html(template);
		}, this);
		var container =this.listBodyCont.find("[data-filterformcontainer]");
		if(opts.xType=="float" || opts.xType=="string" ){
			if(!container.is(":visible")){
				container.show("slow",function(){
					that.listBodyCont.find("[data-filterformcontainer] input").focus();
			});
			}else{
				container.hide();
				container.show("slow",function(){
					that.listBodyCont.find("[data-filterformcontainer] input").focus();
			});
			}
		}else{
			if(!container.is(":visible")){
				container.show();
			}
		}
	},
	/**
	 * @method 		getFilterparams
	 * @memberof 	"canvas.lib.listRenderDataReady"
	 * @description Gets filter params from the filter Class and massage them.
	 */
	getFilterparams : function(){
		var allFilters = this.filterClass.getFilters(this.listview.md.getViewFilters());
		var tags=[];
		if(allFilters.length > 0){
			for(var i = 0; i<allFilters.length; i++){
				for(key in allFilters[i]){
					if(allFilters[i].hasOwnProperty(key)){
						if(this.columnValue[key]){
							if(this.columnValue[key].length>1){
							label_val = this.columnValue[key][0].value+" - "+this.columnValue[key][1].value;
							}else{
							label_val = allFilters[i][key]._CONSTRAINT +" "+ this.columnValue[key][0].value;
							}
						}else if(allFilters[i][key]._CONSTRAINT=="dtEquals" ||allFilters[i][key]._CONSTRAINT=="lt" ||allFilters[i][key]._CONSTRAINT=="gt" )
						{
							label_val = allFilters[i][key]._CONSTRAINT + " "+ allFilters[i][key]._VALUE_DATE;
						}
						else if (allFilters[i][key]._CONSTRAINT=="LAST_N_DAY"||allFilters[i][key]._CONSTRAINT=="LAST_N_MONTH"){
							
							label_val = allFilters[i][key]._CONSTRAINT + " "+ allFilters[i][key]._VALUE_PERIOD;
						}
						else if (allFilters[i][key]._CONSTRAINT=='PREVIOUS_MONTH'){
							
							label_val = allFilters[i][key]._CONSTRAINT;
						}
						else if (allFilters[i][key]._CONSTRAINT=='range'){
							
							label_val = allFilters[i][key]._VALUE_DATE + " - "+ allFilters[i][key]._VALUE_DATE2;
						}
						else{
							label_val = allFilters[i][key]._CONSTRAINT + " "+ allFilters[i][key]._VALUE_TXT;
						}
						tags.push({
							"label": this.headerCols[this.headerCols.map(function(e) { return e.COL_ID; }).indexOf(key)].HEADER_VAL,
							"value":label_val,
							"ID": key,
							"cfg":this.tagConfig[i]
						});
					}
				}
			}
			
		}
		return tags;
	},
/*	*//**
	 * returns bootstrap css class for Device specific priority 
	 *//*
	columnPriority: function(priority, index){
		var cssClass = "";
		if(priority == 1){
			if(this.firstPriority){
				cssClass = "hidden-xs";
			}else{
				this.firstPriority = true
			}
			
		}
		else if(priority == 2)
			cssClass = "hidden-xs";
		else if(priority >= 3)
			cssClass = "hidden-xs hidden-sm";
		return cssClass;
	},*/
	/**
	 * @method 		prepareParams
	 * @memberof 	"canvas.lib.listRenderDataReady"
	 * @description Prepares params for advances grouping grid before sending to template
	 */
	prepareParams : function(){
		var params = this.params.getParams();
		if(this.viewType == 'ADVGROUP'){
			if(params.DATA_REQ_TYPE =='GRPDATA'){
				delete params.DATA_REQ_TYPE;
			}else{
				delete params.DATA_REQ_TYPE;
				delete params.GROUP_FILTERS;
			}
		}
		params.start = 0;
		params.limit = this.recordsLength;
		return params;
	},
	/**
	 * @method 		colProperties
	 * @memberof 	"canvas.lib.listRenderDataReady"
	 * @description Initialize column headers for show/hide and exporting columns
	 */
	initColHeaders : function ()
	{
		this.headerArrayContent = [];
		for (var i = 0; i < this.colCount; i++)
		{
			var headerObj = {};
			headerObj._id = this.colMd[i].FLD_COLUMN_ID;
			
			if(this.colMd[i].FLD_VISIBLE_IND =='N'){
				headerObj._hidden = 'Y';
			}else{
				headerObj._hidden = 'N';	
			}
			
			headerObj._dataindex = this.colMd[i].FLD_COLUMN_ID;
			headerObj._position = this.colMd[i].FLD_POSITION;
			if(!cbx.isEmpty(headerObj._position) || headerObj._dataindex != 'CONTEXT'){
				this.headerArrayContent.push(headerObj);
			}
			
		}
	},
	
	/**
	 * @method 		colProperties
	 * @memberof 	"canvas.lib.listRenderDataReady"
	 * @param		columnId - (String) field Id
	 * @param		hiddenInd - (String) 'Y' or 'N' for hidden column indiaction
	 * @description column properties for updating export columns and show/hide in group and list view..
	 */
	colProperties : function (columnId, hiddenInd)
	{
		for (var j = 0; j < this.headerCount; j++)
		{
			if (this.headerArrayContent[j]._id == columnId)
			{
				if (hiddenInd == "Y")
				{
					this.headerArrayContent[j]._hidden = "Y";
				} else
				{
					this.headerArrayContent[j]._hidden = "N";
				}
				break;
			}
		}
	},

	/**
	 * @method 		formatDateFromInput
	 * @memberof 	"canvas.lib.listRenderDataReady"
	 * @param		value - date value to formatted
	 * @description Formats date from input.
	 */	
	formatDateFromInput : function(value){
		var selecredDate = moment(value, "MM/DD/YYYY");
		return selecredDate.format("DD/MM/YYYY");
	},
	
	/**
	 * @method 		validateFromValue
	 * @memberof 	"canvas.lib.listRenderDataReady"
	 * @param		value - amount value to validated
	 * @description Validation for input value of type numeric
	 */	
	validateFromValue : function (value)
	{
		var Vtype = CFVR.getVtype('AMOUNT');
		if (Vtype && !(Vtype.globalRe.test(value)))
		{
			return false;
		}
		return true;
	},
	
	/**
	 * @method 		getTmplObject
	 * @memberof 	"canvas.lib.listRenderDataReady"
	 * @param		dataType - (String) data Type of the filter form template needed
	 * @description returns template container for specific filter to render form
	 */
	getTmplObject: function(dataType){
		var xType = this.filterClass.filterTypeMap[dataType],
		tmplObj = "";
		this.xType = xType;
		switch(xType){
			case "float":
				tmplObj = "listFilters_amount";
				break;
			case "string":
				tmplObj = "listFilters_string";
				break;
			case "date":
				tmplObj = "listFilters_date";
				break;
		}
		return tmplObj;
	},
	/**
	 * @method 		getColLen
	 * @memberof 	"canvas.lib.listRenderDataReady"
	 * @description Calculates the actual column count of the list including context, row selection columns 
	 */
	getColLen : function(){
		var context_action = this.metadata.md.VIEW_MD.FLD_CONTEXT_ACTION_IND == 'Y' ? true : false;
		var detail_action = this.metadata.md.VIEW_MD.FLD_DETAIL_ACTION_IND == 'Y' ? true : false;
		var action_column = (context_action || detail_action) ? true : false;
		var context_column = this.metadata.md.VIEW_MD.FLD_CONTEXT_COLUMN == 'Y' ? true : false;
		
		// For expand column.
		var colCount = this.colCount +1;
		// For Checkbox column.
		colCount = this.rowSelection ? colCount+1 : colCount;
		// For Context column.
		colCount = context_column ? colCount+1 : colCount;
		// For Detail Action column.
		colCount = action_column ? colCount+1 : colCount;
		return colCount;
	},
	/**
	 * @method 		createSortInfo
	 * @memberof 	"canvas.lib.listRenderDataReady"
	 * @description Creates the sort info for the grid like field Id, sort direction, sort position
	 */
	createSortInfo : function ()
	{
	var returnParamsObj = this.prepareParams();
		this.sortInfo = {};
		this.sortInfo["field"] = returnParamsObj.sort;
		this.sortInfo["direction"] = returnParamsObj.dir;
		this.sortInfo["position"] = 1;
	},
	/**
	 * @method 		saveAsFilters
	 * @memberof 	"canvas.lib.listRenderDataReady"
	 * @description Gets filters from filter Class and sets them to the saveAsColFilters.
	 */
	saveAsFilters : function()
	{
		var allFilters = this.filterClass.getFilters();
		
		for (var i=0;i<allFilters.length;i++){
			for(var key in allFilters[i]){
				var obj={};
				for(var k in allFilters[i][key]){
					var constraint = allFilters[i][key]['_CONSTRAINT'];
					if(constraint=='dtEquals'||constraint=='range'||constraint=='lt'||constraint=='gt'||constraint=='PREVIOUS_MONTH'||constraint=="LAST_N_DAY"||constraint=="LAST_N_MONTH"){
						if(k!='_VALUE_TIME' && k!='_VALUE_TIME2'){
							obj[k.toLowerCase()]=allFilters[i][key][k];
						}
					}else{
						obj[k.toLowerCase()]=allFilters[i][key][k];
					}
					
				}
				this.saveAsColFilters.push(obj);
			}
		}
	},

	/**
	 * @method 		renderLoadMore
	 * @memberof 	"canvas.lib.listRenderDataReady"
	 * @description Renders the load more at the list body. 
	 * 				The colspan of the load more is updated by adding the number of extra columns 
	 * 				other the one that has business data and sending it to the template.
	 */	
	renderLoadMore : function(){
		this.renderer.listBodyCont = this.listBodyCont;
		
		var isPagingViewType = this.viewType == 'PAGING' ? true : false;
		
		loadMoreParams = {
					"colLen" : this.getColLen(),
					"IS_PAGING" : isPagingViewType
				}
		this.renderer.renderLoadMore({
			loadMoreData : loadMoreParams
		});
	},

	/**
	 * @method 		getHiddenHeader
	 * @memberof 	"canvas.lib.listRenderDataReady"
	 * @description Returns the column headings hidden.
	 */	
	getHiddenHeader: function(){
		return this.hiddenHeader;
	},

	/**
	 * @method 		getHiddenRows
	 * @memberof 	"canvas.lib.listRenderDataReady"
	 * @param		index - (Number) index of the row to be fetched
	 * @description Returns the hidden row of the index.
	 */	
	getHiddenRows: function(index){
		return this.hiddenRows[index];
	},

	/**
	 * @method 		renderLoadMoreData
	 * @memberof 	"canvas.lib.listRenderDataReady"
	 * @param 		data - (Object) list body data in case of paging and live grids
	 * @description Renders the load more at the list body. 
	 */	
	renderLoadMoreData : function(data){
		this.listData.initializeData(data);
		this.renderListTableWrapper(false);
	},

	/**
	 * @method 		clearData
	 * @memberof 	"canvas.lib.listRenderDataReady"
	 * @description Clears the list body and the list footer.
	 * 				Resets the params to initial state.
	 * 				Resets the totalRows to empty array.
	 */	
	clearData : function(){
		this.listBodyCont.empty();
		this.listFooterCont.empty();
		this.listtbar.empty();
		this.totalRows= [];
		this.updatedRecords=0;
		this.params.updateAddParams("start", 0);
		this.params.updateAddParams("currentPage", 1);
	}
	
});