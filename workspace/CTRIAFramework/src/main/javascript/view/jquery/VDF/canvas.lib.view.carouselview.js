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
canvas.lib.view.CarouselView = Class(cbx.core.Component, {
	/**
	 * 
	 */
	initialize : function() {
		var me = this;
		var elem = me.elem;
		me.setCmp(elem);
		elem.on("remove", function() {
			me.destroy();
		});
		var displayKey = me.WGT_TITLE || me.md.getViewTitle();
		var title = me.rb[displayKey] || displayKey;

		this.divId = me.WIDGET_ID + "_" + me.md.getViewId() + "_CAROUSEL";

		this.domStr = '<div class="content-brands">';
		this.domStr += '<div class="brand-menu">';
		this.domStr += '<div class="block-title products-gallery-title">';
		this.domStr += '<h3>' + title + '</h3>';
		this.domStr += '</div>';
		this.domStr += '</div>';
		this.domStr += '<div id="' + this.divId + '"></div></div>';

		$(elem).append(this.domStr);

		this.contextMenu = me.md.getContextMenu();
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
		// Binding uData with Params
		if (me.uData) {
			cbx.core.extend(params, me.uData);
		}
		var extraParams = {};
		extraParams = me.viewConf.raiseEvent(CWEC.EXTRA_PARAMS_HDLR, extraParams);
		if (extraParams) {
			cbx.core.extend(params, extraParams);
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
				totalProperty : 'response.value.TOTAL_COUNT'
			},
			bufferSize : 45
		});

	},
	/**
	 * 
	 */
	reloadData : function() {
		this.store.reload();
	},
	
	/**
	 * 
	 */
	loadData : function(records) {
		var me = this;
		var $elem = $($(this.elem).find('div#' + this.divId));
		$elem.empty();
		if (records.length == 0) {
			
			var emptyMsg =(me.rb['NO_DATA_MSG_'+me.WIDGET_ID]!=undefined ?me.rb['NO_DATA_MSG_'+me.WIDGET_ID]: me.rb['NO_DATA_MSG']);
			var emptyDiv = '<div>' + emptyMsg + '</div>';
			$($elem).append(emptyDiv);
		} else {
			this.templateConfig = this.md.md.VIEW_MD.TEMPLATE_CONFIG;
			var template = $.template(null, this.templateConfig);
			var temp;
			var domList = ''
			for ( var ind = 0; ind < records.length; ind++) {
				records[ind]['RECORD_CURR'] = ind;
				temp = $.tmpl(template, records[ind]).html();
				domList += '<div>' + temp + '</div>';
			}
			if (!cbx.core.isEmpty(domList)) {
				$elem.append(domList);
			}
			$elem.bxSlider({
				slideWidth : 200,
				slideHeight : 200,
				minSlides : 1,
				maxSlides : 4,
				infiniteLoop : false
			});
		}
		$($(this.elem).find('*[data-action="true"]')).on("click", {
			scope : me
		}, me.handleClick);
		$($(this.elem).find('*[data-input="true"]')).on("change", {
			scope : me
		}, me.handleInputChange);
		
		setTimeout(function ()
					{
		me.viewConf.raiseEvent(CWEC.AFTER_TEMPLATE_LOAD, {
			elem : $(me.templateConfig),
			uData : me.uData
		});

				}, 500);
	},
	
	/**
	 * 
	 */
	handleClick : function(evtObj) {
		var me = evtObj.data.scope, cell = this;
		var record = me.store.getAt($(cell).attr('RECORD_CURR'));
		var subRecord = $(cell).attr('SUB_RECORD_CURR');
		var colId = $(cell).attr('COLUMN_ID');
		me.viewConf.raiseEvent(CWEC.CELL_CLICK, {
			record : record,
			columnId : colId,
			subRecord : subRecord
		});
	},
	
	/**
	 * 
	 */
	handleInputChange : function(evtObj) {
		var me = evtObj.data.scope, cell = this;
		var record = me.store.getAt($(cell).attr('RECORD_CURR'));
		var subRecord = $(cell).attr('SUB_RECORD_CURR');
		var colId = $(cell).attr('COLUMN_ID');
		record[colId] = $(this).val();
		me.viewConf.raiseEvent(CWEC.CELL_DATA_CHANGE, {
			record : record,
			columnId : colId,
			subRecord : subRecord
		});
	}
});
/**
 * 
 */
CLCR.registerCmp({'COMP_TYPE' : 'APP','VIEW_TYPE' : 'CAROUSEL'}, canvas.lib.view.CarouselView);