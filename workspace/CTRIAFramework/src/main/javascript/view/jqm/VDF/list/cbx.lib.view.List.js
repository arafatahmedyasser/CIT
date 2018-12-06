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

cbx.lib.view.List = Class({
	constructor: function (config) {
		if(typeof config == 'object'){
			$.init.listView(config);
		} else
			return false;
	}
});

$.widget("init.listView", {

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
		this.id = this.options.utilityScope.id;
		this.parentId = this.options.utilityScope.parentId;
		this.perPage = this.options.utilityScope.perPage || 45;
		this.accumulate=this.options.utilityScope.accumulate;
		this.parentScope=this.options.utilityScope.scope;
		this.extraParamsHandler = this.options.utilityScope.extraParamsHandler;
		this.extraParams = this.options.utilityScope.extraParams;
		this.appEvtRegistry = this.options.utilityScope.appEventRegistry;
		this.listViewMD=this.options.utilityScope.listViewMD;
		this.widgetID = this.options.utilityScope.widgetID;
		this.listData=[];
		this.listStore={};
		this.theme = 'tbl-jquery';
		this.createTable();
		this.createStore(this);
	},

	postLoad:function(records,additionalData){
		this.listStore = records;
		this.listData = this.listStore;
		this.storeAdditionalData=additionalData;
		var tBody = this.fooTable && this.fooTable.find('tbody');
		var tFoot = this.fooTable && this.fooTable.find('tfoot');
		if(tBody){
			$(tBody).empty();
		}
		if(tFoot){
			$(tFoot).remove();
		}
		this.createTableBody();         
		this.doMorePaginate(this.listTable);
		$(this.options.parent).find('.footable').trigger('footable_initialize');
		$("#CONTENT_DIV").trigger('create');
		setTimeout(function(){        	
			doIScroll("CONTENT_DIV","refresh");
		},200)

	},
	preLoad : function (params)
	{

	},
	reloadData : function ()
	{
		this.store.reload();
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
	loadData:function(){

	},

	generateParams:function(){

		var params = {
					"__LISTVIEW_REQUEST" : "Y",
					"PAGE_CODE_TYPE" : 'VDF_CODE',
					"INPUT_ACTION" : "INIT_DATA_ACTION",
					"INPUT_PRODUCT" : this.listViewMD.PRODUCT_CODE,
					"PRODUCT_NAME" : this.listViewMD.PRODUCT_CODE,
					"INPUT_FUNCTION_CODE" : this.listViewMD.FUNCTION_CODE,
					"INPUT_SUB_PRODUCT" : this.listViewMD.SUB_PRODUCT_CODE,
					"WIDGET_ID" : this.widgetID,
					"VIEW_ID" : this.listViewMD.SYSTEM_VIEW_ID
		};
		var mutiViewObj = this.appEvtRegistry.getMVObj();
		var addParams = mutiViewObj.raiseEvent(CWEC.EXTRA_PARAMS_HDLR,[params]);
		if(!cbx.isEmpty(addParams)){
			params = addParams;
		}
		var extraparams = this.extraParamsHandler?this.extraParamsHandler.apply(this.parentScope,[params]):params;
		extraparams = !cbx.isEmpty(this.extraParams) && cbx.isObject(this.extraParams)?cbx.apply(extraparams,this.extraParams):extraparams;
		extraparams = !cbx.isEmpty(mutiViewObj.getDefaultDateParams())?cbx.apply(extraparams,mutiViewObj.getDefaultDateParams()):extraparams;
		var paginingParams={};
		paginingParams.start=0;
		paginingParams.limit=parseInt(this.listViewMD.FLD_RECORDS_PER_PAGE) || Number(iportal.systempreferences.getDefaultPagesizeForMobile());
		if(!cbx.isEmpty(paginingParams)){			
			cbx.apply(extraparams,paginingParams);
		}

		// Adding Sortables 
		var sorts = this.options.utilityScope.getSortable();
		if(!cbx.isEmpty(sorts)){
			$.extend(extraparams,sorts);
		}

		return extraparams;
	},

	/*
	 * Parent container for list view table
	 */
	createTableContiner: function () {
		return $("<div/>").attr("id", this.parentId).css("background", "#fcfcfc");
	},
	/*
	 * Takes care of rendering table header with column names
	 */
	createTableHead: function () {

		var thead = $("<thead/>");
		var tRow = $("<tr/>");
		if (this.options.utilityScope.columnTitles.length > 0) {
			this.generateTableHeader(tRow);
			thead.append(tRow);
		}
		return thead;
	},
	/*
	 * renders table body with list data
	 */
	createTableBody: function () {
		var tBody = this.fooTable && this.fooTable.find('tbody')?this.fooTable.find('tbody'):$("<tbody/>");
		var _this = this;
		// if (this.options.utilityScope.listViewMD.FLD_DATA_SRC_ID == 'TYPE 6' || this.options.utilityScope.listViewMD.FLD_DATA_SRC_ID == '') {
		if (this.listData.length > 0) {
			var initialRecordLength = tBody.find('tr').length;
			for (var i = 0; i < this.listData.length; i++) {
				var $tr = $("<tr/>").css('cursor', 'pointer');
				$tr.prop('initIndex',this.listData[i].REC_CURR);
				/*   if(this.options.pagination == 'swipe' 
                    	&& (this.count > this.perPage)
                    	&& i > (this.perPage - 1)){
                    	$tr.addClass('swipe-hidden');
                    }*/
				/*if(i==0){
					this.count = this.listData[i].TOTAL_COUNT;
				}*/
				this.count = this.store.getTotalCount() || 0;
				this.count=parseInt(this.count);
				var rowData = this.listData; 
				delete this.listData[i].TOTAL_COUNT;
				for (var j = 0; j < this.options.utilityScope.columnArray.length; j++) {
					var key = this.options.utilityScope.columnArray[j].COL_ID;
					//var tableData = $("<td/>");
					var tableData = this.processColumnData(this.options.utilityScope.columnArray[j].DATA_TYPE,this.listData[i][key],this.options.utilityScope.columnArray[j],this.listData[i]);
					tableData.on('click',function(e){
						var $this = $(this);
						_this.collapseActiveRow($(this).parents('tr'));
						$(this).parents('tr').addClass('selectColor');
						if (e.type == "click" && $(this).parents('tr').data("longTapRegistered")) {
							$(this).parents('tr').removeClass('selectColor');
							e.preventDefault();
							e.stopPropagation();
						}
						$(this).parents('tr').removeData("longTapRegistered");

						/**
						 * Single Click Start
						 * Change Log : CTMQ314F04
						 */
						var parentMV = _this.options.utilityScope.appEventRegistry.getMVObj();
						var element = $(e.target).parents('tr');
						//var rowData = _this.listStore[element[0].initIndex];
						var rowData = _this.store.getAt(element[0].initIndex);
						LOGGER.info("row data",rowData);
						var record = {
									"data":rowData
						}
						parentMV.raiseEvent(CWEC.SINGLE_CLICK,[record]);
						//Single Click Ends
					});
					$tr.append(tableData/*tableData.html(this.listData[i][key])*/);
				}
				/*  need to fix click event triggered (only on Desktop) after tapHold */
				if(!cbx.isEmpty(IMM.contextList[_this.id])){
					var hammerEle = new Hammer($tr[0]);
					hammerEle.on('press',function(e){
						var element = $(e.target).parents('tr');
						_this.collapseActiveRow(element);
						element.data("longTapRegistered", true);
						var that = this;
						var prev;
						$('.footable-detail-show').each(function(index){
							if(this != that){
								prev = $(element[0]);
							} 
						});
						if(prev){
							$(prev).parents('table:first').data('footable').toggleDetail(prev);	
						}
						var parentMV = _this.options.utilityScope.appEventRegistry.getMVObj();
						element.addClass('highlightColor');
						//index = $(this).parents('tbody').find('tr:not(.footable-row-detail)').index(this);
						//var rowData = _this.listStore[element[0].initIndex];
						var rowData = _this.store.getAt(element[0].initIndex);
						LOGGER.info("row data",rowData);
						var record = {
									"data":rowData
						}
						/**
						 * Intentionally commented out this call...
						 * TBD 
						 */
						//parentMV.raiseEvent(CWEC.SINGLE_CLICK,record);

						cbx.contextMenuRenderer.getContextMenu(_this.id,rowData,e,{});
						setTimeout(function() {
							doIScroll("CONTENT_DIV","refresh");
							//_this.fooTable.scrollTop(_this.fooTable[0].scrollHeight);
						},500);

						/*_this._trigger('onRowLongPress', e, rowData[index]);*/


					})
				}

				tBody.append($tr);
			}
		}
		else{
			var $tr = $("<tr/>");
			var tableData = $("<td/>").attr('colspan',this.visibleColsArray.length.toString());
			var text = iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(),this.options.utilityScope.listViewMD.SYSTEM_VIEW_ID+"_NO_DATA_MSG");

			//if(cbx.isEmpty(text)){
			if(cbx.isEmpty(text) || text==this.options.utilityScope.listViewMD.SYSTEM_VIEW_ID+"_NO_DATA_MSG"){
				text = iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(),"NO_DATA_MSG");
			}
			var textConfig = {
						eleType : "span",
						html : text
			}
			var noRecordText = new cbx.lib.layer(textConfig).getLayer();
			tableData.append($(noRecordText).html());
			$tr.append(tableData);
			tBody.append($tr);
		}
		// }
		//return tBody;
	},
	collapseActiveRow : function(currentRow){
		var activeSelectedRow = $('.selectColor');
		if(activeSelectedRow[0] !==  currentRow[0]){
			activeSelectedRow.removeClass('selectColor');
			var footable = $(currentRow).parents('table:first').data('footable');
			if(activeSelectedRow.hasClass('footable-detail-show')){
				footable.toggleDetail(activeSelectedRow);
			}
		}
	},
	processColumnData : function(colType,val,metadata,data){
		var value = val;
		var tableData = $("<td/>");
		//If it's DATE, adding data-value attribute for perfect sorting 
		switch(colType.toUpperCase()){
			case "DATE":
				val = cbx.lib.utility.formatDate(val,this.options.utilityScope.serverDateFormat,this.options.utilityScope.outDateFormat);
				var dateVal = !cbx.isEmpty(val)?new Date.parseDate(val,this.options.utilityScope.outDateFormat).getTime():"";
				tableData.attr("data-value",dateVal); 
				break;
			case "AMOUNT":
			case "FLOAT":
				var fooAttribute;
				var islinkedCurrAvail = false;
				var curr = data[metadata.LINKED_SOURCE_CCY];
				var currAppend = metadata.FLD_APPEND_CURRENCY_MODE || '';
				var currDecimalPlaceList = cbx.globalcurrency.metadata.getCurrDecimalPlaceList();
				var currList = currDecimalPlaceList;
				//var currList = cbx.decode(currDecimalPlaceList);

				if(currList != null){
					var currDecForLinkedCurr = currList[curr];
					if (currDecForLinkedCurr != undefined
								&& currDecForLinkedCurr.trim() != '') {
						(islinkedCurrAvail = true);
					}
				}
				var currBasedDecimal = 2;
				if (!cbx.isEmpty(val)) {
					if (!curr || curr.trim() == '' || curr == '') {
						/**
						 * get the default curr from preference
						 */
						curr = iportal.systempreferences.getDefaultBankCCY();
						if (!curr || curr.trim() == ''
							|| curr == '') {
							/**
							 * get the default curr configured in
							 * the orbidirect properties
							 */
							curr = cbx.globalcurrency.metadata.getDefaultCurrency();
						}
					}
					if (curr && curr != '' && curr.trim() != '') {
						currBasedDecimal = currList[curr];
					}
					try {
						if (val.charAt(0) == ".") {
							val = "0" + val;
						}
					} catch (err) {
					}
					val = new String(val);
					var sn =  canvas.amountFormatter.getInstance();
					val = sn.basicFormatter(val.replace(/,/g,""), currBasedDecimal);
					if (islinkedCurrAvail == true) {
						if (iportal.preferences.isLangDirectionRTL() === true) {
							if (currAppend == "PREFIX") {
								val = "<div  class='amountColumnInRTL'>"
									+ val
									+ " "
									+ curr
									+ "</div>";
							} else {
								val = "<div  class='amountColumnInRTL'>"
									+ curr
									+ " "
									+ val
									+ "</div>";
							}
						} 
						else {
							if (currAppend == "PREFIX") {
								val = curr + " " + val;
							} else if (currAppend == "POSTFIX") {
								val = val + " " + curr;
							}
						}
					} 
					else {
						val = val;
					}
					/*if (val.startsWith('-')
   							&& !val.endsWith('-')) {
   						val = val.substring(1, val.length);
   						val = '(' + val + ')';
   						if (that.drillDownReq === 'Y') {
   							return '<div class = \'negativeAmt\'><a class=\'tlink\'>'
   									+ val + '</a></div>';
   						} else {
   							return '<div class = \'negativeAmt\'>'
   									+ val + '</div>';
   						}
   					} else {
   						if (that.drillDownReq === 'Y') {
   							return "<a class='tlink'>" + val
   									+ "</a>";
   						} else {
   							return val;
   						}
   					}*/
					fooAttribute =Number(value.replace(/[,.]/g,""));
				} 
				else {
					val = canvas.NULL_VAL_REPLACE;
					fooAttribute =0;
				}
				tableData.attr("data-value",fooAttribute);
				break;
		}
		//return tableData.html(val);
		var styles = metadata.COL_ID + (islinkedCurrAvail?" append-currency":"");
		var newValConf ={
					"eleType":"span",
					"class":styles
		};
		if(islinkedCurrAvail){
			this.tableObj.find('.'+metadata.COL_ID+"-thead").addClass('append-currency-th')
		}
		var newVal = new cbx.lib.layer(newValConf).getLayer();
		$(newVal).html(val);
		$(newVal).bind('click',function(e){
			$(this).parents('td').click();
		});
		return tableData.append($(newVal));

	},
	/*
	 * takes care of table header columns additional attributes
	 */
	generateTableHeader: function (tr) {
		this.visibleColsArray = [];
		var hiddenColsArray = [];
		var ignoredColsArray = [];
		for (var i = 0; i < this.options.utilityScope.columnArray.length; i++) {
			var tableData = $("<th/>");
			if (this.options.utilityScope.columnArray[i].VISIBLE_IND === "Y") {
				if (this.options.utilityScope.columnArray[i].HIDDEN_IND === "N") {
					this.visibleColsArray.push(tableData);
				} else {
					hiddenColsArray.push(tableData);
				}
			} else {
				ignoredColsArray.push(tableData);
			}
			/*
			 * below code would add additional data type, which will use on column sorting
			 */
			if(this.options.utilityScope.columnArray[i].DATA_TYPE == 'float' || this.options.utilityScope.columnArray[i].DATA_TYPE == 'number'){
				tableData.attr("data-type","numeric");
			}

			var newValConf ={
						"eleType":"span",
						"class":this.options.utilityScope.columnArray[i].COL_ID+"-thead"
			};
			var newVal = new cbx.lib.layer(newValConf).getLayer();
			$(newVal).html(this.options.utilityScope.columnArray[i].LIST_DATA);
			tableData.append(newVal);
			tr.append(tableData);
		}
		this.attachHeaderAttributes(this.visibleColsArray, hiddenColsArray, ignoredColsArray);
	},
	/**
	 * resposible to show/hide columns on various devices
	 */
	attachHeaderAttributes: function (visArray, hidArray, ignArray) {
		for (var i = 0; i < visArray.length; i++) {
			switch (i) {
				case 0:
					visArray[i].attr("data-toggle", "true");
					break;
				case 1:
					//visArray[i].attr("data-hide", "phone");
					break;
				case 2:
					visArray[i].attr("data-hide", "phone");
					break;
				default:
					visArray[i].attr("data-hide", "phone,tablet");
			}
		}
		for (var i = 0; i < hidArray.length; i++) {
			hidArray[i].attr('data-hide', 'all');
		}
		for (var i = 0; i < ignArray.length; i++) {
			this.attachHiddenAttribute(ignArray[i]);
		}
	},
	/*
	 * by default hidding columns
	 */
	attachHiddenAttribute: function (item) {
		item.attr("data-hide", "all");
		item.attr("data-ignore", "true");
	},
	/*
	 * put togeather all in one function
	 */
	createTable: function () {
		LOGGER.info("Entered into create Table: ",this.id);

		var rtlTableDirection = 'ltr';
		if(true == iportal.preferences.isLangDirectionRTL()){
			rtlTableDirection = 'rtl';
		}

		var filterInd = "N"/*this.options.utilityScope.config.md.FLD_FILTER_IND;*/

			var tbl = this.listTable= $("<table/>").attr({"id" : this.parentId + "-data-grid",dir : rtlTableDirection}).css('width', '100%').addClass("footable table toggle-arrow "+this.theme);

		this.tableObj =tbl; 
		//tbl.append(this.createTableHead()).append(this.createTableBody()).appendTo(this.options.parent);
		tbl.append(this.createTableHead()).append($("<tbody/>")).appendTo(this.options.parent);

		if(filterInd == "Y"){
			this.filterByColumn(tbl);
		}
		//tbl = this.doMorePaginate(tbl);
		/*if(this.options.pagination == 'swipe'){
        	tbl = this.paginateBySwipe(tbl);
        	var _self = this;
        	tbl.unbind().bind('swipeleft swiperight',function(event){
        		_self.swipeHandler(event,tbl);
        	});
        	delete _self;
        } else{
        	tbl = this.doNumberedPaginate(tbl);		// default pagination
        }*/
		this.fooTable = tbl.footable({
			addRowToggle:this.listData.length>0?true:false,

						tooglePosition:'last'

		});
		if(this.listData.length<1 || cbx.isEmpty(this.listData)){
			$(this.fooTable).find('.footable-toggle').remove();
		}
		this.fooTable.find("th span.footable-sort-indicator").addClass("ct-sort-icn");
		var fooTbl = this.fooTable;
		this.fooTable.find("th.footable-sortable").on("click", function(e){
			fooTbl.find("th span.footable-sort-indicator").removeClass("ct-sort-icn-active");
			$(this).find("span.footable-sort-indicator").removeClass("ct-sort-icn").addClass("ct-sort-icn-active");
		});

		this.fooTable.on({
			footable_resized : function(){
				$(this).trigger('footable_collapse_all');
			},
			footable_row_expanded : function(){
				doIScroll("CONTENT_DIV","refresh");
			},
			footable_row_collapsed : function(){
				doIScroll("CONTENT_DIV","refresh");
			}
		})
		doIScroll("CONTENT_DIV","refresh");
	},

	doMorePaginate: function (tbl) {
		var that=this;
		this.start=0;
		this.limit=this.perPage;

		var sysViewLabel = CRB.getBundle(CRB.getFWBundleKey())[this.id+"_M_PAGIN_LABEL"];
		//var paginationLabel=iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(),"LBL_PAGIN_LABEL");
		var paginationLabel=sysViewLabel||iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(),"LBL_PAGIN_LABEL");

		//if (this.count > this.perPage) {
		if(!cbx.isEmpty(this.store.getCount()) && !cbx.isEmpty(this.store.getTotalCount())){
			if (parseInt(this.store.getTotalCount()) > this.store.getCount()) {
				//tbl.attr("data-page-size", this.perPage);
				var colSpan = "colspan=";
				if(this.visibleColsArray.length>0){
					colSpan = "colspan="+this.visibleColsArray.length;
				}
				var moreBtnConf ={
							'id':this.parentId+"_MORE_BTN",
							'eleType':'a',
							'href':'',
							'data-role':'button',
							'html':paginationLabel,
							'data-mini':"true",
							'data-corners':'false',
							'data-theme':'c',
							'class':'paginate'
				};
				var moreBtn = new cbx.lib.layer(moreBtnConf).getLayer();
				var td=$("<td class='ct-force-show'/>").attr('colspan',this.visibleColsArray.length.toString());
				var tableFooter = $("<tfoot/>")/*.addClass('pagingCls')*/.append(
							$("<tr/>").append(td.append(moreBtn)));

				tbl.append(tableFooter);
				$(moreBtn).click(function() {
					that.store.loadPaginatedControllerData();
					/*	if(that.start<Number(that.count)){
					var params={};
					params.start=that.start+that.perPage;
					that.start=params.start;
					params.limit=that.perPage;
					if(params.start<that.count){
						that.options.utilityScope.getListItem(that.paginate,that.options.utilityScope,params,that);
					}
					else{
						$(this).addClass('ui-disabled');
						//$(this).text('No more records');
					}
				}*/
				});

			}
		}
		//return tbl;
	},

	paginate:function (data) {
		this.listData=data;
		//this.listStore = this.listStore.concat(this.listData);
		this.listStore = this.store.getRecords();
		var _this = this;
		//var footable = this.fooTable.data('footable');
		$(this.fooTable.find('tbody')).empty();
		var footable = this.fooTable.data('footable');
		this.createTableBody();
		footable.redraw();
		if($('#'+_this.parentId+'-data-grid'+' tbody>tr').length>=this.count){
			$("#"+this.parentId+"_MORE_BTN").addClass('ui-disabled');
		}
		var scrollEle =$('#'+_this.parentId+'-data-grid'+' tr').eq($('#'+_this.parentId+'-data-grid'+' tr').length - (data.length+2))[0];

		var scrllConfig = {
					"ele":	scrollEle,
					"duration":1000
		}
		doIScroll("CONTENT_DIV","refresh",scrllConfig);
	},    
	/*
	 * default pagination declartion function
	 */
	doNumberedPaginate: function (tbl) {
		if (this.store.getCount() > this.perPage) {
			tbl.attr("data-page-size", this.perPage);
			tableFooter = $("<tfoot/>").addClass('hide-if-no-paging').append(
						$("<tr/>").append(
									$("<td/>").attr('colspan', this.count).html('<div class="pagination pagination-centered"></div>')));
			tbl.append(tableFooter);
		}
		return tbl;
	},
	/*
	 * alied function for swipe pagination
	 * stretch numbers with given range
	 */
	rangeExtend : function(from,to){
		var tmpArry = [];
		if(to > from){
			for(var i=from; i<=to; i++){
				tmpArry.push(i);
			}
		}
		return tmpArry;
	},
	/*  May need to implement tap(click) event for swipe-bullets */
	/*
	 * responsible to create paginate on swipe mode
	 */
	paginateBySwipe : function(tbl){
		dotsCnt = 0;
		if (this.store.getCount() > this.perPage) {    		
			if(tbl.find('tfoot').length > 0){
				tbl.find('tfoot').remove(); 
			}
			var footer = $('<tfoot/>');
			dotsCnt = Math.round(this.count / this.perPage);
			dotsContainer = $('<div/>').addClass('dots');
			var colspan = tbl.find('tbody tr:first-child td').length;
			for(var i=0; i<dotsCnt; i++){
				var spn = $('<span/>');
				if(i == 0) {
					spn.addClass('current');		
				}
				dotsContainer.append(spn.addClass('swipe-bullets'));
			}
			footer.append($('<tr/>').append($('<td/>').attr('colspan',colspan).append(dotsContainer))).appendTo(tbl);
		}
		return tbl;
	},
	/*
	 * decides the swipe direction
	 * swipe-left : next page
	 * swipe-right : previous page
	 */
	swipeHandler : function(event,tbl){
		var cPage = tbl.find('tfoot .current').index();
		var lastPage = (Math.round(this.store.getCount() / this.perPage) - 1);
		var from = 0,
		to = 0,
		page = 0; 
		if(event.type == 'swipeleft'){
			if(cPage != lastPage){
				if(cPage == 0){
					from = this.perPage;
				} else if(cPage > 0){
					from = (parseInt(tbl.data('last-index')) + 1);
				}
				to = ((this.perPage + from ) - 1);
				tbl.data('last-index',to);
				page = (cPage+1);
			} else
				return true;
		} else {
			// SwipeRight
			if(cPage > 0){
				to = ((this.perPage * cPage) - 1);
				from = ((to - this.perPage) + 1);
				page = (cPage - 1);
			} else 
				return true;
		}
		/* parent rows */
		tbl.find('tbody > tr:not(.footable-row-detail)').addClass('swipe-hidden');
		/*
		 * Hiding if any row in expand mode, cuz it cul'd be visible even the parent row in previous page
		 */
		tbl.find('tody > tr.footable-row-detail').hide();		
		var indexRange = this.rangeExtend(from,to);
		var trSelector = '';
		$.each(indexRange,function(i,v){
			trSelector += 'tbody > tr:not(.footable-row-detail):eq('+v+')';
			if(i != (indexRange.length - 1))
				trSelector += ',';
		});
		tbl.find(trSelector).removeClass('swipe-hidden');
		tbl.find('tfoot span.current').removeClass('current');
		tbl.find('tfoot span.swipe-bullets').eq(page).addClass('current');
	},
	/* do not allow hidden columns to filter */
	/*
	 * Plugin addon : filter by column
	 */
	filterByColumn : function(tbl){
		tbl.attr('data-column','#COLUMNS_' + this.parentId);
		var $filterContainer = $("<div />").attr({"class":"tblFilter",
			'data-role':'fieldcontain',
			'data-type':'horizontal'});
		$filterContainer.attr('data-type','horizontal');
		var $combo = $("<select>").attr({"id" : "COLUMNS_"+this.parentId, 
			"data-mini" : "true",
			"data-theme" : "c"});
		/* Adding All option, helps to search in all columns */
		$combo.append("<option value='all'>-- ALL --</option>");
		for(var i = 0; i<this.options.utilityScope.columnArray.length; i++){
			if (this.options.utilityScope.columnArray[i].VISIBLE_IND === "Y") {
				if (this.options.utilityScope.columnArray[i].HIDDEN_IND === "N") {
					$combo.append($("<option>").attr("value",i).text(this.options.utilityScope.columnArray[i].LIST_DATA));
				}
			}
		}
		$filterContainer.append($combo);
		/*  Adding input type as search */
		var $input = $("<input/>").attr({"id":"FILTER_" + this.parentId , 
			"type" : "search",
			"data-theme" : "c",
			"data-mini" : "true",
			"placeholder" : "Search",
			"value":""});
		$filterContainer.append($input);
		$input.trigger('create');
		tbl.attr("data-filter","#FILTER_"+this.parentId).before($filterContainer);
	},
	attachEvent : function(){

	}
});