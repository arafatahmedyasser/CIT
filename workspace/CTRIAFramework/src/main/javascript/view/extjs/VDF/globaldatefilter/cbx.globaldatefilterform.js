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
cbx.ns("cbx.globaldatefilterform");
/**
 * 
 */
cbx.globaldatefilterform.filterPanelForm = function(mv, globalDateFilterObject) {
	var fromDate = "";
	var toDate = "";
	var defaultDateRange = null;
	if (globalDateFilterObject.DEFAULT_FILTER_VALUE != " ") {
		defaultDateRange = globalDateFilterObject.DEFAULT_FILTER_VALUE.split("|");
		if (defaultDateRange[0] != "-1") {
			fromDate = (!cbx.isEmpty(defaultDateRange[0])) ? defaultDateRange[0] : '' ;
			toDate = (!cbx.isEmpty(defaultDateRange[1])) ? defaultDateRange[1] : '' ;
		}
	}
	var fm = new cbx.form.FormManager({
		formId : "CBX_FILTER_FORM",
		ignoreFormPanel : mv.ignoreFormPanel,
		mode : 'edit',
		height : 50,
		extraParams : {
			/**
			 * Passing the widget id as it is required for
			 * getViewDefinitionb method in server side by the data
			 * support class. The extraParams are expcted to be attached
			 * with the call of form metadata in the form registry
			 */
			"VIEW_ID" : globalDateFilterObject.VIEW_ID,
			"WIDGET_ID" : globalDateFilterObject.WIDGET_ID
		},
		additionalConfig : {
			formPanelCls : 'height:170px',
			"MULTI_VIEW" : mv,
			"COL_NM_KEY" : globalDateFilterObject.COLUMN_DISP_NAME_KEY,
			"MIN_DATE_RANGE" : globalDateFilterObject.MIN_DATE,
			"MAX_DATE_RANGE" : globalDateFilterObject.MAX_DATE,
			/**
			 * Putting proper comments for the static metadata and also
			 * added a parameter called GLOBAL_MIN_DATE
			 */
			"DEFAULT_FILTER" : globalDateFilterObject.DEFAULT_FILTER_VALUE,
			"MAX_SELECTION_PERIOD_UNIT" : globalDateFilterObject.MAX_SELECTION_PERIOD_UNIT,
			"MAX_SELECTION_PERIOD_VALUE" : globalDateFilterObject.MAX_SELECTION_PERIOD_VALUE,
			"GLOBAL_MIN_DATE" : globalDateFilterObject.GLOBAL_MIN_DATE
		},
		modelData : {
			"FILTER_COMBO" : globalDateFilterObject.DEFAULT_FILTER_VALUE,
			"FILTER_RADIO1" : 'Y',
			"FILTER_FROMDATE" : fromDate,
			"FILTER_TODATE" : toDate,
			"COLUMN_ID" : globalDateFilterObject.COLUMN_ID,
			'FILTER_LABEL' : globalDateFilterObject.COLUMN_DISP_NAME_KEY
		},
		listeners : {
			'initialized' : function(manager) {
				if(iportal.systempreferences.getFramework()==="ext"){
					manager.wrapperPanel.findParentByType('buttonscrollpanel').ownerCt.doLayout();
				}
			}
		}
	});
	fm.focus('FILTER_COMBO');
	return fm;
};
