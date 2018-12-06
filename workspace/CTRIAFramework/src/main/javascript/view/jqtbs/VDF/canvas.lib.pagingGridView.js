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
 * @className : canvas.lib.pagingGridView
 * @extends : cbx.core.Component
 * @description: This class is responsible to initate all PAGING and LIVE GRID view components. <BR>
 *               This does the following three tasks : <BR>
 *               1) Fetches Grid Template and keeps it for future actions .<BR>
 *               2) Responsible for all ajax calls.<BR>
 *               3) Prepares GRID component for use.
 */
canvas.lib.pagingGridView= Class(cbx.core.Component,{
	
	/**
	 * @method 		initialize
	 * @memberof 	"canvas.lib.pagingGridView"
	 * @description Initialize function calls the list container template.
	 * 				This template contains the DOM to hold the list table.
	 */	
	initialize: function(){
		var widgetId = this.md.WIDGET_ID;
		var templateUrl = "listContainer.cttpl";
		var listContParams = {};
		var tplLayer = new ct.lib.tmplLayer(templateUrl,listContParams);
		tplLayer.getTemplate(this.applyTemplate, this);
	},
	
	/**
	 * @method 		applyTemplate
	 * @memberof 	"canvas.lib.pagingGridView"
	 * @param		template - html DOM that has to be applied on the element
	 * @description Upon rendering the template, Wrapper and Footer container is initialised. 
	 * 				initializeClasses method is called.
	 */		
	applyTemplate : function (template)
	{
		if (!cbx.core.isEmpty(this.elem))
		{
			$(this.elem).html(template);
			this.listWrapperCont = $(this.elem).find("div[data-item-id=ct_listWrapper]");
			
		}
		this.initializeClasses();
	},
	
	/**
	 * @method 		initializeClasses
	 * @memberof 	"canvas.lib.pagingGridView"
	 * @description 1.	listMetadataMassage class is called. The metadata is massaged 
	 * 					and stored in ListviewMd.<BR>
	 * 				2.	listParamsReady class is called. The params are set here.<BR>
	 * 				3.	listAjaxCall is called. After the initial params are set, 
	 * 					the ajax call is made. In the callback, afterAjax function is called.
	 */		
	initializeClasses : function(){
		this.listViewMD = new canvas.lib.listMetadataMassage();
		this.listViewMD.initializeMassageMetadata(this.md);
		
		this.params = new canvas.lib.listParamsReady();
		this.params.md = this.listViewMD;
		this.params.listview = this;
		this.params.readyParams();
		
		this.ajaxCall = new canvas.lib.listAjaxCall();
		this.ajaxCall.listview = this;
		this.ajaxCall.listViewMD = this.listViewMD;
		this.ajaxCall.params = this.params;
		this.ajaxCall.setInitialParams();
		this.ajaxCall.doAjax(this.afterAjax,this);
		
	},
	
	/**
	 * @method 		afterAjax
	 * @memberof 	"canvas.lib.pagingGridView"
	 * @param		data - list data aquired from the ajax call
	 * @description 1.	listDataStore class is called. The initialize data initialses all the data
	 * 					with respect to the values from ajax.<BR>
	 * 				2.	listRenderDataReady class is called. Renders the list, header and footer and
	 * 					binds its event handlers.<BR>
	 * 				3.	listFilters class initialses all filter methods.
	 */
	afterAjax : function(data){
		
		this.listData = new canvas.lib.listDataStore();
		this.listData.listview = this;
		this.listData.listViewMD = this.listViewMD;
		this.listData.initializeData(data);
		
		this.rendererData = new canvas.lib.listRenderDataReady();
		this.rendererData.listview = this;
		this.rendererData.listViewMD = this.listViewMD;
		this.rendererData.listData = this.listData;
		this.rendererData.params = this.params;
		this.rendererData.ajaxCall = this.ajaxCall;
		
		this.filterClass = new canvas.lib.listFilters({"scope": this});
		
		this.rendererData.filterClass = this.filterClass;
		this.columnValue = [];
		this.rendererData.columnValue=this.columnValue;
		this.tagConfig=[];
		this.rendererData.tagConfig=this.tagConfig;
		
		this.renderer = this.rendererData;
		
		this.rendererData.renderListTableWrapper(true);
	},
	
	/**
	 * @method		updateSelectCount 
	 * @memberof 	"canvas.lib.pagingGridView"
	 * @param		count - number of records selected
	 * @description	Updates the footer status bar with number of records selected on selection of each record.
	 */
	updateSelectedCount:function(count){
		this.isStatusBarReq ? this.listFooterCont.find('[data-item-id="selected-count"]').html("("+count+" records selected)") : "";
	},
	
	/**
	 * @method		getSelectedData 
	 * @memberof 	"canvas.lib.pagingGridView"
	 * @return		Data of the records selected
	 * @description	Gets the selected records data from listDataStore and returns.
	 */
	getSelectedData: function(){
		
		return this.dataStore.getSelectedData();
	},
	
	/**
	 * @method		getModifiedData 
	 * @memberof 	"canvas.lib.pagingGridView"
	 * @return		Data of the records modified
	 * @description	Gets the modified records data from listDataStore and returns.
	 */
	getModifiedData: function(){
		return this.dataStore.getModifiedData();
	},
	
	/**
	 * @method		getRecords 
	 * @memberof 	"canvas.lib.pagingGridView"
	 * @return		List records Data
	 * @description	Gets all records data from listDataStore and returns
	 */
	getRecords : function(){
		return this.dataStore.getRecords();
	},
	
	/**
	 * @method 		refresh
	 * @memberof 	"canvas.lib.pagingGridView"
	 * @description Refreshes the list and re-renders from begining.
	 */
	refresh : function(){
		this.rendererData.clearData();
		this.params.readyParams();
		this.ajaxCall.setInitialParams();
		this.ajaxCall.doAjax(function(data){
			this.listData.initializeData(data);
			this.rendererData.renderListTableWrapper(false);
		},this)
		
	},
	/**
	 * @method 		exportToPDF
	 * @memberof 	"canvas.lib.pagingGridView"
	 * @description	This method is responsible for exporting the list to PDF format
	 * 
	 */
	exportToPDF: function(){
	
		ct.app.exportHandler.execute(this,'PDF');
	},
	/**
	 * @method 		exportToExcel
	 * @memberof 	"canvas.lib.pagingGridView"
	 * @description	This method is responsible for exporting the list to Excel format
	 */
	exportToExcel: function(){
	
		ct.app.exportHandler.execute(this,'XLS');
	},
	/**
	 * @method 		exportToCSV
	 * @memberof 	"canvas.lib.pagingGridView"
	 * @description	This method is responsible for exporting the list to CSV format
	 */
	exportToCSV: function(){
	
		ct.app.exportHandler.execute(this,'CSV');
	},
	/**
	 * @method 		exportToRTF
	 * @memberof 	"canvas.lib.pagingGridView"
	 * @description	This method is responsible for exporting the list to RTF format
	 */
	exportToRTF: function(){
	
		ct.app.exportHandler.execute(this,'RTF');
	},
	/**
	 * @method 		print
	 * @memberof 	"canvas.lib.pagingGridView"
	 * @description	This method is responsible for printing the list.
	 */
	print: function(){
	
		ct.app.exportHandler.execute(this,'PRINT');
	},
	
	/**
	 * @method 		clearFilter
	 * @memberof 	"canvas.lib.pagingGridView"
	 * @description Clears all the filters applied from params.<BR> 
	 * 				removes the filter containers and refreshes the list.
	 */
	clearFilter : function(){
		this.params.clearFilterParams();
		this.rendererData.columnValue = [];
		this.rendererData.tagConfig = [];
		this.filterClass.removeAllFilters();
		this.refresh();
	}
});
CLCR.registerCmp({
	'COMP_TYPE' : 'APP',
	'VIEW_TYPE' : 'PAGING'
}, canvas.lib.pagingGridView);
CLCR.registerCmp({
	'COMP_TYPE' : 'APP',
	'VIEW_TYPE' : 'LIST'
}, canvas.lib.pagingGridView);
CLCR.registerCmp({
	'COMP_TYPE' : 'APP',
	'VIEW_TYPE' : 'ADVGROUP'
}, canvas.lib.pagingGridView);