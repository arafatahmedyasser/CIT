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
 * 
 */
canvas.lib.view.BannerCmp = Class(cbx.core.Component, {
	initialize : function() {
		var me = this;
		var elem = me.elem;
		me.setCmp(elem);
		elem.on("remove", function() {
			me.destroy();
		});
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
		var extraParams = {};
		extraParams = me.viewConf.raiseEvent(CWEC.EXTRA_PARAMS_HDLR, extraParams);
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
		this.rb = {};
		var elem = me.getCmp();
		elem.empty();
		me.setCmp(elem);
		var displayKey = me.WGT_TITLE || me.md.getViewTitle();
		var title = me.rb[displayKey] || displayKey;
		this.domStr = '<div class="content-brands">';
		this.domStr += '<div class="' + me.WIDGET_ID + '-title">' + title + '</div>';
		this.domStr += '<div class="custom-gallery">';
		this.createBanner(records);
	},
	
	/**
	 * 
	 */
	createBanner : function(records) {
		var me = this;
		var visibleClm = me.md.getVisibleColumns();
		var clmTmplStr = "", clsTmplStr = "";
		this.domStr += '<div class="content-image">';
		var bannerId = me.WIDGET_ID + "_" + me.md.getViewId() + "_IMG";
		var bannerMenu = me.WIDGET_ID + "_" + me.md.getViewId() + "_MENU";
		var galarr = {
			imageClm : ''
		};

		for ( var ind = 0; ind < records.length; ind++) {

			for ( var j = 0; j < visibleClm.length; j++) {
				if (records[ind][visibleClm[j]] != "") {
					if (ind == 0) {
						if (visibleClm[j].FLD_DATA_TYPE == "image") {
							this.domStr += '<img src="' + records[ind][visibleClm[j]["FLD_COLUMN_ID"]] + '" id="'
									+ bannerId + '" /></div>';
							galarr.imageClm = visibleClm[j]["FLD_COLUMN_ID"];
						}
						if (visibleClm[j].FLD_DATA_TYPE == "string") {
							this.domStr += '<div class="content-menus ' + me.WIDGET_ID + "_" + me.md.getViewId()
									+ '_content-menus"  id="' + bannerMenu + '"><span  RECORD_CURR="' + ind
									+ '" class="displayinline galitems galitems-selected">'
									+ records[ind][visibleClm[j]["FLD_COLUMN_ID"]] + '</span>';
						}
					} else {
						if (visibleClm[j].FLD_DATA_TYPE == "string") {
							this.domStr += '<span  RECORD_CURR="' + ind + '" class="displayinline galitems">'
									+ records[ind][visibleClm[j]["FLD_COLUMN_ID"]] + '</span>';
						}
					}
				}
			}

		}
		this.domStr += '</div></div></div>';
		$(this.elem).append(this.domStr);

		$('#' + bannerMenu + ' > span').on('click', function(event) {

			$('#' + bannerMenu + ' > span').each(function() {
				$(this).removeClass('galitems-selected');
			});
			event.stopPropagation();
			var record = me.store.getAt($(this).attr('RECORD_CURR'));
			if (!cbx.core.isEmpty(record) && (!cbx.core.isEmpty(galarr.imageClm))) {
				$('#' + bannerId).attr('src', record[galarr.imageClm]);
			}
			$(this).addClass('galitems-selected');
		});
	}
});
/**
 * 
 */
CLCR.registerCmp({'COMP_TYPE' : 'APP','VIEW_TYPE' : 'BANNERCMP'}, canvas.lib.view.BannerCmp);