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
 * This class contains the lib specific GroupView confined to the widget / app.
 */
canvas.lib.view.TemplateView = Class(cbx.core.Component, {
	/**
	 * 
	 */
	initialize : function() {
		var me = this;
		this.domStr = '';
		LOGGER.info('TEMPLATE ME ', me);
		var elem = me.elem;
		var appId = 'cbx-app-' + me.WIDGET_ID + "_" + me.md.getViewId();
		elem.append('<span class="' + appId + '" ITEM_ID="WGT_' + me.WIDGET_ID + '"></span>');//Added a span wrapper for the whole widget
		elem = $(elem.find('span.' + appId));
		me.setCmp(elem);

		elem.on("remove", function() {
			$('body').find('.zoomContainer').remove();
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
		// Binding uData with Params
		if (me.uData) {
			cbx.core.extend(params, me.uData);
		}
		//Added for widget title if present
		var displayKey = me.WGT_TITLE || me.md.getViewTitle();
		var title = me.rb[displayKey] || displayKey;
		LOGGER.info('title ', title);
		if(me.WGT_HEADER_IND=='Y' && (!cbx.isEmpty(title))){
			this.domStr = '<div id="page-title" role="heading" '
				+ 'class="displayinline container page-title accessible-area accessibility-contrast-normal col19 '
				+ me.WIDGET_ID + '-title">' + '<H1>' + title + '</H1>' + '</div>';//Widget Title
		}

		this.divClass = me.WIDGET_ID + "_" + me.md.getViewId() + "_TEMPLATE";
		this.domStr += '<div class="' + this.divClass + '"></div>';
		this.getCmp().append(this.domStr);
		this.templateConfig = this.md.md.VIEW_MD.TEMPLATE_CONFIG;

		if (this.md.md.VIEW_MD.FLD_AUTOLOAD_IND != undefined && this.md.md.VIEW_MD.FLD_AUTOLOAD_IND == 'N') {
			this.loadStaticTemplate();
		} else {
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
		}
	},

	/**
	 * 
	 */
	loadData : function (records)
	{
		var me = this;
		var $elem = $($(me.elem).find('div.' + this.divClass));
		$elem.empty();
		var template = $.template(null, this.templateConfig);
		var temp;
		var domStr = '';
		if (records.length == 1 && !cbx.isEmpty(records[0]['SUB_REC']))
		{
			var subRec = records[0]['SUB_REC'];
			for (var ind = 0; ind < records.length; ind++)
			{
				for (var j = 0; j < subRec.length; j++)
				{
					subRec[j]['RECORD_CURR'] = j;
				}
				temp = $.tmpl(template, records[ind]).html();
				domStr += temp;
			}
		} else
		{
			for (var ind = 0; ind < records.length; ind++)
			{
				records[ind]['RECORD_CURR'] = ind;
				temp = $.tmpl(template, records[ind]).html();
				domStr += temp;
			}
		}
		$elem.append(domStr);
		$($(this.elem).find('*[data-action="true"]')).on("click", {
			scope : me
		}, me.handleClick);
		$($(this.elem).find('*[data-input="true"]')).on("change", {
			scope : me
		}, me.handleInputChange);		
		this.handleSingleSelectBox();

		if (!cbx.isEmpty(this.templateConfig))
		{
			var sliderBoxImg=$($(me.elem).find('[fancy-box="true"]'));
			if(!cbx.isEmpty(sliderBoxImg)){							
				sliderBoxImg.bxSlider({
					slideWidth : !cbx.isEmpty(sliderBoxImg.attr('[img-slideWidth]'))?sliderBoxImg.attr('[img-slideWidth]'):120,
								slideHeight : !cbx.isEmpty(sliderBoxImg.attr('[img-slideHeight]'))?sliderBoxImg.attr('[img-slideHeight]'):34,
											maxSlides : !cbx.isEmpty(sliderBoxImg.attr('[max-imgslides]'))?sliderBoxImg.attr('[max-imgslides]'):5,
														minSlides : !cbx.isEmpty(sliderBoxImg.attr('[min-imgslides]'))?sliderBoxImg.attr('[min-imgslides]'):3,
																	infiniteLoop : false
				});
			}

			sliderBoxImg.find("img").each(function() {
				$(this).off("click");
					$(this).on("click",{
						scope : me
					}, function(evtObj){
					evtObj.stopPropagation();
						var imgElem=$(this);
						var me = evtObj.data.scope
						if(!cbx.isEmpty(imgElem.attr("data-view-image")) && !cbx.isEmpty(imgElem.attr("data-large-image"))){
							if(me.displayImg && me.displayImg.data('elevateZoom')){
								me.displayImg.data('elevateZoom').swaptheimage(imgElem.attr("data-view-image"),imgElem.attr("data-large-image"));
							}
						}
					});	
				});

			setTimeout(function ()
						{
				$($(me.elem).find("img")).each(function() {
					var image=$(this);
					var zoom=image.attr('zoom');

					var imgHeight = !cbx.isEmpty(image.attr('height'))?parseInt((image.attr('height').replace(/['"]+/g, ''))):'';
					var imgWidth = !cbx.isEmpty(image.attr('width'))?parseInt((image.attr('width').replace(/['"]+/g, ''))):'';

					var imageZoom=image.attr('data-zoom-image');
					LOGGER.info('img ',[zoom,imageZoom]);
					if(!cbx.isEmpty(zoom) && !cbx.isEmpty(imageZoom)){
						if(zoom=="true"){
							var config={borderSize: 1};


							if(!cbx.isEmpty(imgHeight) && (!cbx.isEmpty(image.height()) && imgWidth > image.height())){
								config.zoomWindowHeight = imgHeight;
							}
							//else(!cbx.isEmpty(image.height()) && image.height() > 0){
							else{
								config.zoomWindowHeight=image.height();
								LOGGER.info('img height >>>>>>>>>',[image.height()]);

							}
							if(!cbx.isEmpty(imgWidth) && (!cbx.isEmpty(image.width()) && imgWidth > image.width())){
								config.zoomWindowWidth = imgWidth;
							}
							setTimeout(function ()
										{
								me.displayImg=image;
								image.elevateZoom(config);
										},300);
						}
					}

				});

				me.viewConf.raiseEvent(CWEC.AFTER_TEMPLATE_LOAD, {
					elem : $(me.templateConfig),
					uData : me.uData
				});

						}, 500);
		}
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
	loadStaticTemplate : function ()
	{
		var me = this;
		var $elem = $($(me.elem).find('div.' + this.divClass));
		$elem.append(me.templateConfig);
		$($(this.elem).find('*[data-action="true"]')).on("click", {
			scope : me
		}, me.handleClick);
		$($(this.elem).find('*[data-input="true"]')).on("change", {
			scope : me
		}, me.handleInputChange);
		this.handleSingleSelectBox();	

		if (!cbx.isEmpty(this.templateConfig))
		{
			var sliderBoxImg=$($(me.elem).find('[fancy-box="true"]'));
			if(!cbx.isEmpty(sliderBoxImg)){							
				sliderBoxImg.bxSlider({
					slideWidth : !cbx.isEmpty(sliderBoxImg.attr('[img-slideWidth]'))?sliderBoxImg.attr('[img-slideWidth]'):120,
								slideHeight : !cbx.isEmpty(sliderBoxImg.attr('[img-slideHeight]'))?sliderBoxImg.attr('[img-slideHeight]'):34,
											maxSlides : !cbx.isEmpty(sliderBoxImg.attr('[max-imgslides]'))?sliderBoxImg.attr('[max-imgslides]'):5,
														minSlides : !cbx.isEmpty(sliderBoxImg.attr('[min-imgslides]'))?sliderBoxImg.attr('[min-imgslides]'):3,
																	infiniteLoop : false
				});
			}

			sliderBoxImg.find("img").each(function() {
				$(this).off("click");
					$(this).on("click",{
						scope : me
					}, function(evtObj){
					evtObj.stopPropagation();
						var imgElem=$(this);
						var me = evtObj.data.scope
						if(!cbx.isEmpty(imgElem.attr("data-view-image")) && !cbx.isEmpty(imgElem.attr("data-large-image"))){
							if(me.displayImg && me.displayImg.data('elevateZoom')){
								me.displayImg.data('elevateZoom').swaptheimage(imgElem.attr("data-view-image"),imgElem.attr("data-large-image"));
							}
						}
					});	
				});

			setTimeout(function ()
						{
				$($(me.elem).find("img")).each(function() {
					var image=$(this);
					var zoom=image.attr('zoom');

					var imgHeight = !cbx.isEmpty(image.attr('height'))?parseInt((image.attr('height').replace(/['"]+/g, ''))):'';
					var imgWidth = !cbx.isEmpty(image.attr('width'))?parseInt((image.attr('width').replace(/['"]+/g, ''))):'';

					var imageZoom=image.attr('data-zoom-image');
					if(!cbx.isEmpty(zoom) && !cbx.isEmpty(imageZoom)){
						if(zoom=="true"){
							var config={borderSize: 1};


							if(!cbx.isEmpty(imgHeight) && (!cbx.isEmpty(image.height()) && imgWidth > image.height())){
								config.zoomWindowHeight = imgHeight;
							}
							else{
								config.zoomWindowHeight=image.height();

							}
							if(!cbx.isEmpty(imgWidth) && (!cbx.isEmpty(image.width()) && imgWidth > image.width())){
								config.zoomWindowWidth = imgWidth;
							}
							setTimeout(function ()
										{
								image.elevateZoom(config);
										},300);
						}
					}

				});
				me.viewConf.raiseEvent(CWEC.AFTER_TEMPLATE_LOAD, {
					elem : $(me.templateConfig),
					uData : me.uData
				});

						}, 500);

		}
	},

	/**
	 * 
	 */
	updateParams : function (params)
	{
		if (!cbx.isEmpty(params) && cbx.isObject(params))
		{
			cbx.core.extend(this.store.getParams(), params);
		}
	},
	/**
	 * 
	 */
	handleClick : function (evtObj)
	{
		var me = evtObj.data.scope, cell = this;
		if (me.store != undefined)
		{
			var record = me.store.getAt($(cell).attr('RECORD_CURR'));
			var subRecord = $(cell).attr('SUB_RECORD_CURR');
		}
		if(me.store && me.store.records.length==1 && ! cbx.isEmpty(me.store.records[0]['SUB_REC']))
		{
			if(!cbx.isEmpty($(cell).attr('RECORD_CURR')))
				var record=me.store.records[0]['SUB_REC'][$(cell).attr('RECORD_CURR')]
		}
		var colId = $(cell).attr('COLUMN_ID');
		me.viewConf.raiseEvent(CWEC.CELL_CLICK, {
			record : record,
			columnId : colId,
			subRecord : subRecord,
			uData:me.uData
		});
	},

	/**
	 * 
	 */
	handleInputChange : function(evtObj) {
		var me = evtObj.data.scope, cell = this;
		if (me.store != undefined) {
			var record = me.store.getAt($(cell).attr('RECORD_CURR'));
			var subRecord = $(cell).attr('SUB_RECORD_CURR');
		}
		var colId = $(cell).attr('COLUMN_ID');
		if(record && record[colId]){
			record[colId] = $(this).val();	
		}
		me.viewConf.raiseEvent(CWEC.CELL_DATA_CHANGE, {
			record : record,
			columnId : colId,
			uData:me.uData
		});
	},
	/**
	 * 
	 */
	clearElement : function ()
	{
		var appId = 'cbx-app-' + this.WIDGET_ID + "_" + this.md.getViewId();
		$(this.elem.find('span.' + appId)).remove();
	},

	/**
	 * 
	 */
	getSelections : function ()
	{
		return this.store.getSelections();
	},

	/**
	 * 
	 */
	getExactSelections : function ()
	{
		return this.store.getExactSelections();
	},

	/**
	 * 
	 */
	handleCheckboxRadio : function (evtObj)
	{
		var me = evtObj.data.scope, cell = this;
		evtObj.stopPropagation();
		if (cell.checked == true)
		{
			me.store.addSelectedData($(cell).attr('RECORD_CURR'));
		} else
		{
			me.store.removeSelectedData($(cell).attr('RECORD_CURR'));
		}
	},

	/**
	 * 
	 */
	removeEntireSelectedData : function ()
	{
		this.store.removeEntireSelectedData();
	},

	/**
	 * 
	 */
	handleSingleSelectBox : function ()
	{
		var me = this;
		$checkboxradio = $(me.elem).find('[data-chk-single="true"]');
		$checkboxradio.unbind('click');
		$checkboxradio.bind("click", {
			scope : me
		}, me.handleCheckboxRadio);
	},

	/**
	 * 
	 */
	setGridModifiedColumn : function (record, modifyClm, colId, alterRec)
	{
		LOGGER.info('modifyClm ', [ record, modifyClm ]);
		if (!cbx.isEmpty(modifyClm.columnId))
		{
			var elem = $(this.elem).find('tbody').find("tr[record_curr=" + record.REC_CURR + "]").find(
						"[column_id=" + modifyClm.columnId + "]");
			record[modifyClm.columnId] = (modifyClm.val || "");
			if (!cbx.isEmpty(elem))
			{
				var value = modifyClm.val ? modifyClm.val : '';
				elem.val(value);
				elem.text(value);
			}
		}

	},

	setModifiedColumn : function (record, modifyClm, colId, alterRec)
	{
		LOGGER.info('modifyClm ', [ record, modifyClm ]);
		if (!cbx.isEmpty(modifyClm.columnId))
		{
			var elem = $(this.elem).find('tbody').find("tr[record_curr=" + record.REC_CURR + "]").find(
						"[column_id=" + modifyClm.columnId + "]");
			record[modifyClm.columnId] = (modifyClm.val || "");
			if (!cbx.isEmpty(elem))
			{
				var value = modifyClm.val ? modifyClm.val : '';
				elem.val(value);
				elem.text(value);
			}
		}

	},

	/**
	 * 
	 */
	setColumnData : function (record, modifyClm, colId, alterRec,type)
	{
		if (cbx.isObject(modifyClm) || cbx.isArray(modifyClm))
		{
			if (cbx.isObject(modifyClm))
			{
				this.setModifiedColumn(record, modifyClm, colId, alterRec);
			}
			if (cbx.isArray(modifyClm))
			{
				for (var j = 0; j < modifyClm.length; j++)
				{
					var modifyClmIndex = modifyClm[j];
					if (cbx.isObject(modifyClmIndex))
					{
						if(!cbx.isEmpty(type) && type=="GRID"){
							this.setGridModifiedColumn(record, modifyClmIndex, colId, alterRec);
						}
						else{
							this.setModifiedColumn(record, modifyClmIndex, colId, alterRec);
						}
					}
				}
			}
		}		
	},
	addClass : function (record, modifyClm, className)
	{
		var me=this;
		LOGGER.info('modifyClm ', [ record, modifyClm ]);
		if (!cbx.isEmpty(modifyClm.columnId))
		{

			var elem = $($(me.elem).find('div.' + this.divClass));

			elem.find("[record_curr=" + record.REC_CURR + "]").each(function() {
				if($(this).attr('COLUMN_ID')==modifyClm.columnId){
					$(this).addClass(className);
				}

			});

		}
	},
	removeClass : function (record, modifyClm, className)
	{
		var me=this;
		LOGGER.info('modifyClm ', [ record, modifyClm ]);
		if (!cbx.isEmpty(modifyClm.columnId))
		{

			var elem = $($(me.elem).find('div.' + this.divClass));

			elem.find("[record_curr=" + record.REC_CURR + "]").each(function() {
				if($(this).attr('COLUMN_ID')==modifyClm.columnId){
					$(this).removeClass(className);
				}

			});

		}
	},
	/**
	 * 
	 */
	getRecords : function ()
	{
		if (!cbx.isEmpty(this.store.records))
		{
			return this.store.records;
		} else
		{
			return [];
		}
	}
});
/**
 * 
 */
CLCR.registerCmp({'COMP_TYPE' : 'APP','VIEW_TYPE' : 'TEMPLATE'}, canvas.lib.view.TemplateView);