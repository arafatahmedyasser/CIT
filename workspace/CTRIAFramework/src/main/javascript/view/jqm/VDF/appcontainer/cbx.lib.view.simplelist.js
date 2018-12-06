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
 

cbx.ns("cbx.lib.view");
/*
* This class contains the library specific widget container component inside the workspace. Called by the layoutManager.
*/
cbx.lib.view.simplelist = Class({
	// Global parameters
	md : '',
	bd : '',
	list : '',
	isContextEnable : false,
	viewMD : '',
	parent : null,
	constructor : function(conf) {
		this.md = conf.md;
		this.bd = conf.bd;
		this.viewMD = this.md;
		this.parent = conf.parent;
		this.widgetID = conf.widgetID;
		if (!cbx.isEmpty(IMM.contextList[this.md.VIEW_ID])) {
			this.isContextEnable = true;
		}
		this.list = '<ul data-role="listview" data-inset="false">';
		var t = this.createLIElements();
		if (typeof t !== 'undefined' && t !== '') {
			this.list = this.list + t + '</ul>';
		} else {
			this.list = this.list + '</ul>';
		}
		if (this.parent != null) {
			// this.parent.append(this.list);
			$(this.parent).append(this.list);
		}
		$(this.parent).trigger('create');
		setTimeout(function() {
			doIScroll("CONTENT_DIV", "refresh");
			// _this.fooTable.scrollTop(_this.fooTable[0].scrollHeight);
		}, 500);
		var selector = '#' + this.widgetID + ' li';
		var me = this;

		$(this.parent).find('li').each(
				function(index) {
					$(this).unbind('click');
					$(this).bind('click',function(e) {
								e.preventDefault();
								var index = $(this).attr('item_id');
								var record = {
									data : me.bd[index]
								};
								 
								    var hander = ICCHF.getHandler(me.viewMD.VIEW_ID);
								    if (hander) {
								     this.svcch = new hander();
								     this.svcch.processCellClick('', '', me, record);
								   }
								/*cbx.contextMenuRenderer.getContextMenu(
										me.md.VIEW_ID, record, e, {
											"showContextIcon" : true
										});*/
								setTimeout(function() {
									doIScroll("CONTENT_DIV", "refresh");
								}, 500);
							})
				});
		/*
		 * $(this).find('li').bind('click',function(e){
		 * 
		 * e.preventDefault(); index = $(this).attr('item_id'); var rowData =
		 * me.bd[index];
		 * 
		 * 
		 * 
		 * });
		 */
	},
	createLIElements : function() {
		var domstr = '';
		var listrstart;
		var listrend;
		for (var i = 0; i < this.bd.length; i++) {
			var tbd = this.bd[i];
			if (this.isContextEnable) {
				listrstart = '<li  item_id="' + i + '" column_id="' + i
						+ '"><a href="javascript: void(0);" item_id="' + i
						+ '" column_id="' + i + '">';

				listrend = '</a></li>';
			} else {
				listrstart = '<li>';
				listrend = '</li>';
			}
			for (var d = 0; d < this.viewMD.FLD_COLUMN_LIST.length; d++) {
				var fldData = this.viewMD.FLD_COLUMN_LIST[d];
				// amount field set through user preferances
				if(fldData.FLD_DATA_TYPE == "float"){ 
					tbd[fldData.FLD_COLUMN_ID] = canvas.amountFormatter.getInstance().basicFormatter(tbd[fldData.FLD_COLUMN_ID].replace(/,/g,""),2);
				}
				// date field set through user preferances
				else if(fldData.FLD_DATA_TYPE == "date"){
					this.outDateFormat = canvas.datePreferences.getDateFormat();
					tbd[fldData.FLD_COLUMN_ID] = cbx.lib.utility.formatDate(tbd[fldData.FLD_COLUMN_ID],this.serverDateFormat,this.outDateFormat);
				}
				if (fldData.FLD_HIDDEN_IND == 'N'
						&& fldData.FLD_VISIBLE_IND == 'Y') {
					listrstart = listrstart + '<div class="ctlistviewli">';
				} else {
					listrstart = listrstart
							+ '<div class="ctlistviewli displaynone">';
				}
				listrstart = listrstart
						+ '<div class="listcol_50 ctlistviewli_col1"><span item_id="" column_id="">'
						+ CRB.getBundle(this.viewMD.FLD_BUNDLE_KEY)["LBL_"
								+ fldData.FLD_COLUMN_DISPLAY_NAME_KEY]
						+ '</span></div>'
						+ '<div class="listcol_50 displayinline ctlistviewli_col2"><span item_id="" column_id="" class="li-data">'
						+ tbd[fldData.FLD_COLUMN_ID] + '</span></div></div>';
			}
			domstr = domstr + listrstart + listrend;
		}
		return domstr;
	}
});