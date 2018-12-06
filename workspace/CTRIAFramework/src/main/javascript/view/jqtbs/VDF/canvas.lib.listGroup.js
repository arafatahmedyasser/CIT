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
 * ===============================================================================================
 * CHANGE CODE 		AUTHOR 				DESCRIPTION 									   DATE
 *  JQTBS01 		ArunKumar Sekar 	Creating initial List Group View				10-03-2015
 * ===============================================================================================
 */
cbx.ns("canvas.lib");
/**
 * @className : canvas.lib.listRenderer
 * @description: This class is responsible to render LIST view. <BR>
 *               This does the following three tasks : <BR>
 *               1) Prepares template and template parameters .<BR>
 *               2) Grid header, pagination and Filter actions.<BR>
 *               3) Row value data type preparations.
 */
canvas.lib.listGroup = Class(canvas.lib.listRenderer,{
	
	groupedCols: [],
	groupedRecords:{},
	newArr:[],
	
	constructor: function(config){
		$.extend(this, config);
		canvas.lib.listGroup.$super.call(this,config);
		this.newArr = new Array();
		this.tmpHeaderArray = new Array();
		this.groupedCols = this.ptScope.listViewMD.FLD_GROUPING_COLUMNS.slice();
	},
	
	
	/**
	 * Method helps us to remove grouped columns 
	 */
	updateGroupedColumns: function(){
		var colLength = this.groupedCols.length,
			headerLen = this.tmpHeaderArray.length
		if(colLength > 0){
			for(var h=0; h<this.tmpHeaderArray.length; h++){
				if(this.groupedCols.indexOf(this.tmpHeaderArray[h].COL_ID) >= 0){
					this.tmpHeaderArray.splice(h,1);
					this.updateGroupedColumns();
				}
			}
		}
		this.setParams("headerCols",this.tmpHeaderArray);
		this.prepareGroupedTags();
	},
	/**
	 * creates group header tag 
	 */
	prepareGroupedTags: function(){
		var colLength = this.groupedCols.length,
			tags = [];
		if(colLength > 0){
			for(var i = 0; i<colLength; i++){
				var lbl = this.headerArray[this.headerArray.map(function(e) { return e.COL_ID; }).indexOf(this.groupedCols[i])].LIST_DATA;
				var cfg = {"LBL": lbl/*this.utility.getTextByColumnID(this.groupedCols[i])*/,"COLID": this.groupedCols[i] };
				tags.push(cfg);
			}
			this.setParams("GROUPCOLS",tags);
			this.setParams("labelGroupBy",iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), "LBL_GROUP_BY"));
		}
	},
	/**
	 * creates footer for the grid
	 */
	getListFoot: function(){
		if(this.ptScope.listViewMD.FLD_TOTAL_RESULT_IND == "Y")
			this.setParams("pagingRecords",{"displaying":CRB.getFWBundle()["DISPLAYING"],"of":CRB.getFWBundle()["OF"],"from":this.getParamValue("start"),"to":(this.perPage * this.getParamValue("currentPage")),"total":this.recordsCount});
	},
	/**
	 * renders the grouping grid
	 */
	renderListApp: function(){
		this.utility.doHandlerBarsHelpers(this);
			this.newArr = new Array();
			this.headerArray = new Array();
			this.getListHead();
			this.tmpHeaderArray = this.headerArray.slice();
			this.updateGroupedColumns();
			this.searchTags();
			this.getGroupedRecords();
			this.getListFoot();
			var templateUrl = this.compactView ? "listViewMobile.cttpl" : "listViewTemplate.cttpl";
			var tpl = new ct.lib.tmplLayer(templateUrl,this.tmplOpts);
			tpl.getTemplate(this.applyTemplate,this);		
	},
	applyTemplate : function(template){
		var obj = null;
		obj = $(template);
		obj.find("[data-group='parent']").parents("tr").attr("data-group-container","parent");
		obj.find("[data-group='subgroup']").parents("tr").attr("data-group-container","subgroup").addClass("hidden");
		CTLOADMASKMANAGER.hideLoadMask(this.parentCont,this.parentCont);
		this.parentCont.html(obj);
		this.groupViewHandlers(obj);
		this.bindHandlers();
		
		var that = this;
		this.parentCont.find("[data-groupdrag=\"listGroupDrag\"][data-groupable='true']").canvasDragDrop({
			droppableElement: this.parentCont.find('.group-column-container'),
			onDrop: function(obj){
				var colID = obj.data("lbl");
				if(colID == "CONTEXT" ) return false;
				//var text = that.utility.getTextByColumnID(obj.find("[data-lbl]").text());
				var text = that.headerArray[that.headerArray.map(function(e) { return e.COL_ID; }).indexOf(colID)].LIST_DATA;
				var tmpl = '<div class="ct-badge__each ct-badge__each-tm">';
					tmpl += '<a href="javascript:void(0)" class="ct-badge__txt">'+text+'</a>';
					tmpl += '<a href="javascript:void(0)" data-filter-id="{{this.ID}}" class="ct-badge__action">x</a>';
					tmpl += '</div>';
				that.groupedCols.removeAt(0);
				that.groupedCols.push(colID);
				that.renderListApp();
				return tmpl;
			}
		});
			this.compactViewValidationOnload();
			this.createSortInfo();
			this.saveAsFilters();
			this.ptScope.viewConf.raiseEvent(CWEC.AFTER_TEMPLATE_LOAD,{elem:template});
		$('[data-toggle="tooltip"]').tooltip();
	},
	/**
	 * Used to group records based on the grouping grid header
	 */
	groupedRecordUtility: function(record, li){
		var obj = [],
			headerLen = this.tmpHeaderArray.length;
		for(var h=0; h<headerLen; h++){
			var key = this.tmpHeaderArray[h].COL_ID;
			/*if(this.parentMap.hasOwnProperty(this.tmpHeaderArray[h].COL_ID)) {
				//condition to not render parent heder column 
				if(this.parentMap[this.tmpHeaderArray[h].COL_ID].length > 0) continue;
			}*/
			for(var k=0;k<this.headerArrayContent.length;k++){
				if(key==this.headerArrayContent[k]._id){
					colIndex=k;
					break;
				}
			}
			var	cssClass = this.utility.columnPriority(parseInt(this.tmpHeaderArray[h].FLD_PRIORITY));
			if(this.tmpHeaderArray[h].VISIBLE_IND == "N" || this.headerArrayContent[colIndex]._hidden == "Y") cssClass += " hidden";
			if(this.tmpHeaderArray[h].DATA_TYPE == "amount" || this.tmpHeaderArray[h].DATA_TYPE == "float") cssClass = cssClass+" text-right";
			if(record.HIGHTLIGHT){
				cssClass += " "+record.HIGHTLIGHT; 
			}
			var colKey = this.headerArray[this.headerArray.map(function(e) { return e.COL_ID; }).indexOf(key)].LIST_DATA;
			var params = {"cssClass":cssClass,"key":key+"|"+li, colKey: colKey,"rowIndex":li};
			if(key == "CONTEXT"){
				this.contextColumn = true;
				var value = "CONTEXT-ICON";
				params.enableContext = this.ptScope.md.md.CONTEXT_MENU_LIST[0].context_type;
			} else {
				this.headerArray[h].additionalData=this.additionalData;
				var value = this.utility.validateRowData(this.tmpHeaderArray[h].DATA_TYPE,record[key],this.tmpHeaderArray[h],record);
			}	
			params.rowValue = value;
			obj.push(params);
		}
		return obj; 
	},
	/**
	 * update rows 
	 */
	updateRows: function(groupCols){
		var colID = groupCols[0];
		var recordsLen = this.records.length;
		var headerLen = this.tmpHeaderArray.length;
		var arrayOBJ = {};
		for(var i = 0; i < recordsLen; i++) {
			var record = this.records[i];
			if(!arrayOBJ.hasOwnProperty(record[colID])) {
				arrayOBJ[record[colID]] = {
					"TMPL": this.getGroupColHeaderTmpl(record[colID],"parent"),
					"RECORD": []
				};
			}
			if(groupCols.length == 1)
				arrayOBJ[record[colID]].RECORD.push(this.groupedRecordUtility(record,i))
			else 
				arrayOBJ[record[colID]].RECORD.push(record);
		}
		return arrayOBJ;
	},
	/**
	 * used to group records for the subgroup
	 */
	updateSubGroups: function(records,colID){
		var arr = [];
		if(cbx.isObject(records)){
			for(var id in records){
				if(records.hasOwnProperty(id)){
					var rows = records[id].RECORD;
					var rowsLen = rows.length;
					var arrayOBJ = {};
					if(rowsLen > 0){
						for(var li = 0; li<rowsLen; li++) {
							var record = rows[li];
							if(!arrayOBJ.hasOwnProperty(record[colID])) {
								arrayOBJ[record[colID]] = {
									"TMPL": this.getGroupColHeaderTmpl(record[colID],"subgroup"),
									"RECORD": []
								};
							}
							arrayOBJ[record[colID]].RECORD.push(this.groupedRecordUtility(record,li));
						}
					}
					records[id].RECORD = arrayOBJ;
				}
			}
		}
		return records;
	},
	/**
	 * creates and returns the DOM for grouped header
	 */
	getGroupColHeaderTmpl: function(param,group){
		if(group == "subgroup")
			var tmpl = '<div data-group="'+group+'" class="ct-'+group+'-header">';
		else
			var tmpl = '<div data-group="'+group+'" class="ct-'+group+'-header">';
			tmpl += '<a href="javascript:void(0)" role="button" data-btn-status="show"><span class="ct-app__tools flaticon-expand flaticon-listGroup group-collapsed"></span></a>';
			tmpl += '<div class="group-header-container">';
			tmpl +=	'<span class="group-title">'+param+'</span>';
			tmpl += '</div>';
			tmpl += '</div>';
		return tmpl;
	},
	/**
	 * used to create object containing grouping header and data
	 */
	prepareGroupRows: function(){
		var groupingCols = this.groupedCols.slice(0);			// Duplicating grouped coluns array
		var rows = null;
		var parentGrouped = this.updateRows(groupingCols);
		groupingCols.removeAt(0);
		var groupedLen = groupingCols.length;
		if(groupedLen > 0){
			for(var i = 0; i < groupedLen; i++) {
				rows = this.updateSubGroups(parentGrouped,groupingCols[i]);
				groupingCols.removeAt(i);
			}
		}
		if(rows == null)
			rows = parentGrouped;
		this.objIntoArray(rows);
	},
	/**
	 * pushes the object into an array
	 */
	objIntoArray: function(rows,recurise){
		if(cbx.isObject(rows)){
			var len = rows.length;
			for(var key in rows) {
				var parent = rows[key];
				this.newArr.push(parent.TMPL);
				if(!cbx.isArray(parent.RECORD)){
					this.objIntoArray(parent.RECORD,true);
				} else {
					this.newArr.push(parent.RECORD);
				}	
			}
		}
	},
	 /**
	  * sets the final object as parameter to be rendered in template
	  */
	getGroupedRecords: function(){
		var that = this;
		var viewList = this.ptScope.md.md.VIEWS_LIST;
		var currView = viewList.filter(function(data,index){
			return data.VIEW_ID == that.ptScope.listViewMD.VIEW_ID;
		});
		this.setParams("GROUPING_ENABLED","true");
		if(this.tmplOpts.hasOwnProperty("NODATA"))	delete this.tmplOpts.NODATA;
		if(this.records && this.records.length > 0){		
			this.prepareGroupRows();
			this.setParams("groupedRows",this.newArr);
		} else if(this.additionalData.hasOwnProperty("ENTL_ERROR") || currView.IS_ENTITLED == "N"){
			var nodata_key = this.ptScope.listViewMD.SYSTEM_VIEW_ID+"_NOT_ENTITLED_WIDGET";
			var text = CRB.getBundleValue(this.bundleKey,nodata_key);
        	if(cbx.isEmpty(text)){
        		text = CRB.getFWBundleValue("NOT_ENTITLED_WIDGET");
        	}
			this.setParams("NODATA", text);
		} else {
			var nodata_key = this.ptScope.listViewMD.SYSTEM_VIEW_ID+"_NO_DATA_MSG";
			var text = CRB.getBundleValue(this.bundleKey,nodata_key);
        	if(cbx.isEmpty(text)){
        		text = CRB.getFWBundleValue("NO_DATA_MSG");
        	}
			this.setParams("NODATA", text);
		}
	},
	/**
	 * event handlers for grouping grid
	 */
	groupViewHandlers: function(obj){
		/**
		 * event handler for grouping grid header
		 */
		obj.find("[data-group-container='parent'] a").on("click", function(evt){
			evt.preventDefault(); evt.stopPropagation();
			var parents = $(this).parents("tr");
			var nextAll = parents.nextUntil("[data-group-container='parent']").filter('[data-group-container="subgroup"]');
			if(nextAll.length > 0){
				if($(this).data("btn-status") == "show"){
					$(this).data("btn-status","hide").children('span').removeClass("flaticon-expand flaticon-listGroup group-collapsed").addClass("flaticon-collapse flaticon-listGroup group-expanded");
					nextAll.removeClass("hidden");
				} else {
					$(this).data("btn-status","show").children('span').removeClass("flaticon-collapse flaticon-listGroup group-expanded").addClass("flaticon-expand flaticon-listGroup group-collapsed");
					nextAll.find("a > span").removeClass("flaticon-collapse flaticon-listGroup group-expanded").addClass("flaticon-expand flaticon-listGroup group-collapsed");
					nextAll.find("a").data("btn-status","show");
					parents.nextUntil("[data-group-container='parent']").addClass("hidden");
				}
			} else {
				var nextAll = parents.nextUntil("[data-group-container='subgroup'],[data-group-container='parent']");
				if($(this).data("btn-status") == "show"){
					$(this).data("btn-status","hide").children('span').removeClass("flaticon-expand flaticon-listGroup group-collapsed").addClass("flaticon-collapse flaticon-listGroup group-expanded");
					nextAll.removeClass("hidden");
				} else {
					$(this).data("btn-status","show").children('span').removeClass("flaticon-collapse flaticon-listGroup group-expanded").addClass("flaticon-expand flaticon-listGroup group-collapsed");
					nextAll.addClass("hidden");
				}
			}
		});
		/**
		 * event handler for sub group header
		 */
		obj.find("[data-group-container='subgroup'] a").on("click", function(evt){
			evt.preventDefault(); evt.stopPropagation();
			var parents = $(this).parents("tr");
			var nextAll = parents.nextUntil("[data-group-container='subgroup'],[data-group-container='parent']");
			if($(this).data("btn-status") == "show"){
				$(this).data("btn-status","hide").children('span').removeClass("flaticon-expand flaticon-listGroup group-collapsed").addClass("flaticon-collapse flaticon-listGroup group-expanded");
				nextAll.removeClass("hidden");
			} else {
				$(this).data("btn-status","show").children('span').removeClass("flaticon-collapse flaticon-listGroup group-expanded").addClass("flaticon-expand flaticon-listGroup group-collapsed");
				nextAll.addClass("hidden");
			}
			
		});
		
		var that = this;
		obj.find("[data-group-id]").on("click",function(evt){
			evt.preventDefault(); evt.stopPropagation();
			if(that.groupedCols.length > 1){
				var colID = $.trim($(this).data("group-id"));
				that.groupedCols.removeByValue(colID);
				delete that.tmplOpts.groupedRows;
				that.renderListApp();
			} else return false;
		});
		/**
		 * init group stage
		 */
		var initGroupInd = this.scope.listViewMD.FLD_INIT_GROUP_STAGE;
		var groupHeader = obj.find("[data-grouped-header='true'][data-group-container='parent'] a");
		if(initGroupInd == "EFA") {
			$(groupHeader[0]).trigger("click");
		} else if (initGroupInd =="EA") {
			for(var index=0; index < groupHeader.length; index++) {
				$(groupHeader[index]).trigger("click");
			}
		}
	}

});