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
 
cbx.ns('cavans.lib.view');
/**
 * 
 */
cavans.lib.view.FormWidgetView = Class(cbx.core.Component,{
	/**
	 * 
	 */
	initialize : function() {
		var me = this;
		me.allItemSelector = 'input,textarea,select';
		var elem = me.elem;
		this.widgetList = {};
		me.formId = me.md.getFormId();
		elem.append('<span class="cbx-app ' + me.WIDGET_ID + '" ITEM_ID="WGT_' + me.WIDGET_ID + '"></span>');
		elem = $(elem.find('span[item_id="WGT_' + me.WIDGET_ID + '"]'));
		me.setCmp(elem);
		var params = {};
		var displayKey = me.WGT_TITLE || me.md.getViewTitle();
		var title = me.rb[displayKey] || displayKey;
		if (!cbx.core.isEmpty(title) && me.loadingInContainer !== true) {
			elem.append('<div class="' + me.WIDGET_ID + '-title">' + title + '</div');
		}
		elem.append('<span ITEM_ID="content-wrapper"><div class="' + this.formId + '" data-form-id="'
				+ this.formId + '" data-form-mode="edit" data-widget-id="' + me.WIDGET_ID + '"></div></span>');
		var extraParams = {};
		me.viewConf.raiseEvent(CWEC.EXTRA_PARAMS_HDLR, extraParams);
		if (extraParams) {
			cbx.core.extend(params, extraParams);
		}
		if (me.uData && !cbx.core.isEmpty(me.uData)) {
			cbx.core.extend(params, me.uData);
		}

		/**
		 * @desc Set timeout function to be invoked after completion of
		 *       the specified time-interval. Get the form manager and
		 *       invoke the loadForm function to retrieve data
		 */
		var obj = {};
		var modeArr = me.viewConf.raiseEvent(CWEC.FORM_MODE, obj);
		var formMode = '';
		if (!cbx.core.isEmpty(modeArr)) {
			for ( var i = 0, len = modeArr.length; i < len; i++) {
				if (!cbx.core.isEmpty(modeArr[i])) {
					formMode = modeArr[i];
					break;
				}
			}
		}
		setTimeout(function() {
			me.fm = new cbx.form.FormManager({
				formId : me.formId,
				mode : formMode,
				containerScope : me,
				FORM_ADDITION_PARAMS : params,
				wrapperEl : elem,
				modelData : {},
				uData : me.uData,
				listeners : {
					'initialized' : {
						fn : me.loadForm,
						scope : me
					}
				}
			});
		}, 100);

		elem.on("remove", {
			scope : me
		}, function(evtObj) {
			var me = evtObj.data.scope
			if (me.getCmp() != null) {
				var elem = $(me.getCmp().find('span[item_id="content-wrapper"]').find(
						'div[data-form-id="' + me.formId + '"]'));
				$(elem).find(this.allItemSelector).unbind("change");
			}
			if (me.fm && me.fm.destroy) {
				me.fm.destroy();
			}
			delete me.fm;
			me.destroy();
		});

	},
	
	/**
	 * 
	 */
	loadForm : function(formDom, manager) {
		var me = this;
		me.rb = {};
		var elem = $(me.getCmp().find('span[item_id="content-wrapper"]').find(
				'div[data-form-id="' + me.formId + '"]'));
		elem.empty();
		elem.append(formDom);
		elem.find(this.allItemSelector).unbind("change", "blur");
		elem.find(this.allItemSelector).bind("change", {
			fm : manager
		}, function(event) {
			me.handleChange(event);
		});

		elem.find(this.allItemSelector).bind("blur", {
			fm : manager
		}, function(event) {
			me.handleBlur(event);
		});
		elem.find('button').unbind("click");
		elem.find('button').bind("click", {
			fm : manager
		}, function(event) {
			me.handleButtonClick(event);
		});

		elem.find('*[cbx-type="LABEL-BUTTON"]').on("click", {
			fm : manager
		}, function(event) {
			me.handleButtonClick(event);
		});

		elem.find(this.allItemSelector).keydown(
				function(event) {
					$elem = $(event.currentTarget);
					if ($elem.attr('vType') === 'numeric') {
						if ((event.keyCode >= 48 && event.keyCode <= 57)
								|| (event.keyCode >= 96 && event.keyCode <= 105) || event.keyCode == 8
								|| event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39
								|| event.keyCode == 46) {
							return true;
						} else {
							event.preventDefault();
						}
					}
				});
		var widgetCmps = me.getCmp().find('[data-form-id=\'' + me.formId + '\']').find('[cbx-type="WIDGET"]');

		for ( var i = 0; i < widgetCmps.length; i++) {
			widgetElem = $(widgetCmps[i]).find('[data-role="cbxwidget"]');
			var widgetConfig = {};
			if (!cbx.core.isEmpty(widgetElem.attr('data-widget-id'))) {
				widgetConfig.elem = $(widgetElem);
				widgetConfig.WIDGET_ID = widgetElem.attr('data-widget-id');
				widgetConfig.itemId=widgetElem.attr('data-item-id');
				if (widgetElem.attr('container-role') == "Y") {
					widgetConfig.CONTAINER_FLAG = "Y";
				}
				cbx.core.extend(widgetConfig, manager.FORM_ADDITION_PARAMS);
				if (manager.uData) {
					cbx.core.extend(widgetConfig, {
						uData : manager.uData
					});
				}
				//new canvas.lib.app(widgetConfig);
				this.instantiateWidget(widgetConfig);
			}
		}
		var dateFields = me.getCmp().find('[data-form-id=\'' + me.formId + '\']').find('[cbx-type="DATE"]');

		for ( var i = 0; i < dateFields.length; i++) {

			var dtFieldId = $(dateFields[i]).attr('id');
			$("#" + dtFieldId).datepicker({
				showOn : "button",
				buttonImage : "assets/css/base/images/calendar.gif",
				buttonImageOnly : true,
				dateFormat : "dd/mm/yy"
			});
		}

		if (manager && manager.afterRender) {
			manager.afterRender();
		}
	},
	/**
	 * 
	 */
	instantiateWidget : function(config) {
		this.widgetList[config.itemId] = new canvas.lib.app(config);
	},
	/**
	 * 
	 */
	getWidgetByItemId : function(itemId) {
		return this.widgetList[itemId];
	},
	
	/**
	 * 
	 */
	handleDate : function(elem) {
		this.fm.model.updateValue(elem.attr('name'), elem.val());
	},
	
	/**
	 * 
	 */
	handleBlur : function(event) {
		$elem = $(event.currentTarget);
	},
	/**
	 * @desc This Function decides which form element is changed and
	 *       takes the corresponding initiative by calling apropriate
	 *       function.
	 * @param event
	 *            the event object
	 */
	handleChange : function(event) {
		var $elem = $(event.currentTarget);
		var itemType = $elem.attr('cbx-type');
		this.fm.model.updateValue($elem.attr('name'), $elem.val());
	},

	/**
	 * @desc show the invalid fields, mandatory fields that are empty
	 * @param elem
	 *            the form element
	 */
	handleButtonClick : function(event) {
		var elem = $(event.currentTarget);
		this.fm.handlerEvent('cbxclick', elem.attr('name'));
	}

});

/**
 * 
 */
CLCR.registerCmp({'COMP_TYPE' : 'APP','VIEW_TYPE' : 'FORMWIDGET'}, canvas.lib.view.FormWidgetView);
