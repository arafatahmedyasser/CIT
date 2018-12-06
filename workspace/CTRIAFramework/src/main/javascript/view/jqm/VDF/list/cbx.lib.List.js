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
cbx.ns('cbx.lib');
/*
 * This class helps to bind the events on list controls types and starts process of  
 * instantiating the cbx.lib.List.utility class
 *

*/


cbx.lib.List = Class(cbx.core.Component, {
	widgetID:null,
	md: '',
	listUtility: null,
	appendTO: '', /* DOM element of widget to append the list control*/
	constructor: function(config) {	
		cbx.lib.List.$super.call(this);
		this.widgetID = config.widgetId;
		this.workspaceID = config.workspaceId;
		this.md = config.md;
		this.scope = config.scope;
		this.appendTO = config.appendTO;
		this.extraParamsHandler=config.extraParamsHandler;
		this.extraParams=config.extraParams;
		this.appEvents = config.appEvents;
		this.dateFilterRequired = cbx.isEmpty($(this.appendTO).find('#CBX_FILTER_FORM')[0]);
		this.accumulate=this.md.FLD_VIEW_TYPE=='LIST' || 'PAGING' || 'ADVGROUP' || 'CLASSIC_GRID' ? true : false;
		this.initiateView();
		},
	initiateView : function ()
	{
		/**
		 * Global date filter Starts
		 */
		var that = this;
			var defaultFilterValue = " ";
			var columnName = null;
			var columnId = null;
			var frmManger = null;
			var minDate = "";
			var maxDate = "";
			var flag = null;
			var maxSelectionPeriodUnit = null; 
			var maxSelectionPeriodValue = null;
			var globalMinDate = null; 
		if (that.md.FLD_GLOBAL_DATE_FILTER_IND === 'Y' && this.dateFilterRequired)
		{
			CBXDOWNLOADMGR.requestScripts(cbx.downloadProvider.getMergedArray(["FORM_VIEW","GLOBAL_DATE_FILTER"]),function(){
				if (that.md.FLD_POSSIBLE_DATE_FILTERS.length != 0)
				{
					for (var i = 0, len = that.md.FLD_POSSIBLE_DATE_FILTERS.length; i < len; i++)
					{
						if ("Y" === that.md.FLD_POSSIBLE_DATE_FILTERS[i].IS_DEFAULT_FILTER)
						{
							defaultFilterValue = that.md.FLD_POSSIBLE_DATE_FILTERS[i].FROM_DATE
										+ '|' + that.md.FLD_POSSIBLE_DATE_FILTERS[i].TO_DATE
										+ '|' + i;
						} else if (that.md.FLD_POSSIBLE_DATE_FILTERS[i].FROM_DATE === '-1')
						{
							flag = i;
						}
					}
					if (defaultFilterValue === "")
					{
						if (flag != null)
						{
							defaultFilterValue = that.md.FLD_POSSIBLE_DATE_FILTERS[flag].FROM_DATE
										+ '|'
										+ that.md.FLD_POSSIBLE_DATE_FILTERS[flag].TO_DATE
										+ '|' + flag;
						}
					}
					columnId = that.md.FLD_POSSIBLE_DATE_FILTERS[0].COLUMN_ID;
					for (var i = 0; i < that.md.FLD_COLUMN_LIST.length; i++)
					{
						if (columnId == that.md.FLD_COLUMN_LIST[i].FLD_COLUMN_ID)
						{
							var columnNmKey = that.md.FLD_COLUMN_LIST[i].FLD_COLUMN_DISPLAY_NAME_KEY;
							columnName = CRB.getBundle(that.md.FLD_BUNDLE_KEY)['LBL_'+ columnNmKey+'_GDF'];
							if(cbx.isEmpty(columnName)) {
								columnName = CRB.getBundle(that.md.FLD_BUNDLE_KEY)['LBL_'+ columnNmKey];
							}							
						}
					}
				}
				if (that.md.FLD_DATE_FILTERS_RANGE.length != 0)
				{
					minDate = that.md.FLD_DATE_FILTERS_RANGE[0].MIN_DATE;
					maxDate = that.md.FLD_DATE_FILTERS_RANGE[0].MAX_DATE;
								maxSelectionPeriodValue = that.md.FLD_DATE_FILTERS_RANGE[0].MAX_SELECTION_PERIOD_VAL
											? that.md.FLD_DATE_FILTERS_RANGE[0].MAX_SELECTION_PERIOD_VAL
											: "",
								maxSelectionPeriodUnit = that.md.FLD_DATE_FILTERS_RANGE[0].MAX_SELECTION_PERIOD_UNIT
											? that.md.FLD_DATE_FILTERS_RANGE[0].MAX_SELECTION_PERIOD_UNIT
											: "",
								globalMinDate = that.md.FLD_DATE_FILTERS_RANGE[0].GLOBAL_MIN_DATE
											? that.md.FLD_DATE_FILTERS_RANGE[0].GLOBAL_MIN_DATE
											: ""
				}
				var globalDateFilterObject = {
					"VIEW_ID" : that.md.VIEW_ID,
					"WIDGET_ID" : this.widgetID,
					"DEFAULT_FILTER_VALUE" : defaultFilterValue,
					"COLUMN_DISP_NAME_KEY" : columnName,
					"MIN_DATE" : minDate,
					"MAX_DATE" : maxDate,
					"COLUMN_ID" : columnId,
					"MAX_SELECTION_PERIOD_UNIT" : maxSelectionPeriodUnit,
					"MAX_SELECTION_PERIOD_VALUE" : maxSelectionPeriodValue,
					"GLOBAL_MIN_DATE" : globalMinDate
				};
				/*
				 * if(that.findParentByType('panel') instanceof cbx.formElement.WidgetPanel){
				 * that.ignoreFormPanel = true; }
				 */
				frmManger = cbx.globaldatefilterform.filterPanelForm(that.appEvents.getMVObj(), globalDateFilterObject);
				if(frmManger){
					that.appEvents.getMVObj().applyDateFilter(frmManger.getModelData(),false);
				}
				$(that.appendTO).append(frmManger.getFormView());
				that.createListView();
				/*
				 * that.add(new cbx.panel.ButtonScrollingPanel({ amountOfxScroll:60, height:38, autoScroll:
				 * false, cls : 'date-scroll-panel', scrollCmp:[{width:750,items:[frmManger.getFormView()]}]
				 * }));
				 */

			});
		}
		else{
			that.createListView();
		}
	},
	createListView: function() {
		var listconf = {
			'listObj': this
		}; 
		this.listUtility = new cbx.lib.List.utility(listconf);
	},
	getActiveView : function(){
		
	},
	getViewDomWrapper: function(){
		return this.appendTO.parentNode;
	}
});

CLCR.registerCmp({'COMP_TYPE':'LIST'}, cbx.lib.List);
CLCR.registerCmp({'COMP_TYPE':'PAGING'}, cbx.lib.List);
CLCR.registerCmp({'COMP_TYPE':'ADVGROUP'}, cbx.lib.List);
CLCR.registerCmp({'COMP_TYPE':'CLASSIC_GRID'}, cbx.lib.List);