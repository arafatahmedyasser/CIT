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
canvas.lib.view.formview = Class(cbx.core.Component,{
	/**
	 * 
	 */
	initialize : function()
	{
		var me = this;
		this.domStr = '';
		var elem = me.elem;
		// me.setCmp(elem);
		var appId = 'cbx-app-' + me.WIDGET_ID + '_' + me.md.getViewId();
		elem.append('<span class="' + appId + '" ITEM_ID="WGT_' + me.WIDGET_ID + '"></span>');// Added a
																								// span
																								// wrapper
		// for the whole widget
		elem = $(elem.find('span.' + appId));
		me.setCmp(elem);

		elem.on('remove', function ()
		{
			me.destroy();
		});
		this.contextMenu = me.md.getContextMenu();
		var params = {
			'__LISTVIEW_REQUEST' : 'Y',
			'PAGE_CODE_TYPE' : 'VDF_CODE',
			'INPUT_ACTION' : 'INIT_DATA_ACTION',
			'PRODUCT_NAME' : 'CUSER',
			'INPUT_FUNCTION_CODE' : 'VSBLTY',
			'INPUT_SUB_PRODUCT' : 'CUSER',
			'WIDGET_ID' : me.WIDGET_ID,
			'VIEW_ID' : me.md.getViewId(),
			
			"LAYOUT_ID" :iportal.workspace.metadata.getCurrentLayoutId(),
			"WORKSPACE_ID" :iportal.workspace.metadata.getCurrentWorkspaceId(),
			
			'forceCallbacks' : true
		};

		var extraParams = {};
		extraParams = me.viewConf.raiseEvent(CWEC.EXTRA_PARAMS_HDLR, extraParams);
		if (extraParams)
		{
			cbx.core.extend(params, extraParams);
		}
		// Binding uData with Params
		if (me.uData)
		{
			cbx.core.extend(params, me.uData);
		}
		// Added for widget title if present
		var displayKey = me.WGT_TITLE || me.md.getViewTitle();
		var title = me.rb[displayKey] || displayKey;
		if (!cbx.isEmpty(title))
		{
			this.domStr = '<div id="page-title" role="heading" '
						+ 'class="displayinline container page-title accessible-area accessibility-contrast-normal col19 '
						+ me.WIDGET_ID + '-title">' + '<H1>' + title + '</H1>' + '</div>';// Widget Title
		}

		this.divClass = me.WIDGET_ID + '_' + '_TEMPLATE_' + me.id;
		this.domStr += '<div class="' + this.divClass + '"></div>';
		$(this.elem).append(this.domStr);
		this.templateConfig = this.md.md.VIEW_MD.TEMPLATE_CONFIG;
		if (this.md.md.VIEW_MD.FLD_AUTOLOAD_IND != undefined && this.md.md.VIEW_MD.FLD_AUTOLOAD_IND == 'N')
		{
			this.loadStaticTemplate();
		} else
		{
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
	reloadData : function ()
	{
		this.store.reload();
	},
	
	/**
	 * 
	 */
	loadData : function (records)
	{
		var me = this;
		$($(this.elem).find('*[data-action="true"]')).off('click');
		$($(this.elem).find('*[data-action="true"]')).off('change');
		var $elem = $($(me.elem).find('div.' + me.divClass));
		$elem.empty();
		var template = $.template(null, this.templateConfig);
		var temp;
		var domStr = '';
		for (var ind = 0; ind < records.length; ind++)
		{
			records[ind]['RECORD_CURR'] = ind;
			temp = $.tmpl(template, records[ind]).html();
			domStr += temp;
		}
		if(!cbx.isEmpty(domStr)){
		$elem.append(domStr);
		}else{
			$elem.append(me.templateConfig);	
		}
		$elem.find('select').select2();
		$($(this.elem).find('*[data-action="true"]')).on("click", {
			scope : me
		}, me.handleClick);
		$($(this.elem).find('*[data-input="true"]')).on("change", {
			scope : me
		}, me.handleInputChange);
		setTimeout(function ()
		{
			me.viewConf.raiseEvent(CWEC.FORM_LOADED);
		}, 100);

	},
	
	/**
	 * 
	 */
	loadStaticTemplate : function ()
	{
		var me = this;
		$($(this.elem).find('*[data-action="true"]')).off('click');
		$($(this.elem).find('*[data-action="true"]')).off('change');
		var $elem = $($(me.elem).find('div.' + me.divClass));
		$elem.empty();
		$elem.append(me.templateConfig);

		$elem.find('select').select2();

		$($(this.elem).find('*[data-action="true"]')).on('click', {
			scope : me
		}, me.handleClick);
		$($(this.elem).find('*[data-input="true"]')).on('change', {
			scope : me
		}, me.handleInputChange);
		setTimeout(function ()
		{
			me.viewConf.raiseEvent(CWEC.FORM_LOADED);
		}, 100);
	},
	
	/**
	 * 
	 */
	handleClick : function (evtObj)
	{
		var me = evtObj.data.scope, $item = $(this);
		me.viewConf.raiseEvent(CWEC.CBX_CLICK, $item.attr('ITEM_ID'), $item.attr('ITEM_ID'));
	},
	
	/**
	 * 
	 */
	handleInputChange : function (evtObj)
	{
		var me = evtObj.data.scope, $item = $(this);
		me.viewConf.raiseEvent(CWEC.CBX_CHANGE, $item.attr('ITEM_ID'), $item.val());
	},
	
	/**
	 * 
	 */
	findField : function (itemId)
	{
		var me = this;
		var $elem = $($(me.elem).find('div.' + me.divClass));
		var item = null;
		$elem = $elem.find('[ITEM_ID="' + itemId + '"]');
		if (!cbx.core.isEmpty($elem))
		{
			if ($elem.length == 1)
			{
				item = $($elem[0]);
			} else
			{
				item = $elem;
			}
		}
		return item;
	},
	/**
	 * 
	 */
	isCheckbox : function (item)
	{
		if (item.attr('type').toLowerCase() === 'checkbox')
		{
			return true;
		} else
		{
			return false;
		}
	},
	
	/**
	 * 
	 */
	isRadio : function (item)
	{
		if (item.attr('type').toLowerCase() === 'radio')
		{
			return true;
		} else
		{
			return false;
		}
	},
	
	/**
	 * 
	 */
	isSelect : function (item)
	{
		if (item.prop('tagName').toLowerCase() === 'select')
		{
			return true;
		} else
		{
			return false
		}
	},
	
	/**
	 * 
	 */
	updateComboRawStore : function (itemId, labelArr, valueArr)
	{
		var me = this;
		var item = me.findField(itemId);
		item.select2('val', "");
		if (!cbx.core.isEmpty(item))
		{
			var dataStr = '';
			for (var i = 0, len = labelArr.length; i < len; i++)
			{
				dataStr += '<option value="' + valueArr[i] + '">' + labelArr[i] + '</option>';
			}
			item.empty();
			item.append(dataStr);

		}
	},
	
	/**
	 * 
	 */
	getModel : function ()
	{
		var me = this;
		var $elem = $($(me.elem).find('div.' + me.divClass));
		var model = {};

		$elem.find('[data-input="true"]').each(function (index, item)
		{
			item = $(item);
			if (item.is('[type]'))
			{
				if (me.isRadio(item))
				{

					if (item.is(':checked') === true)
					{

						model[item.attr('ITEM_ID')] = item.val();
					}
					return;

				} else if (me.isCheckbox(item))
				{
					if (item.is(':checked') == true)
					{
						model[item.attr('ITEM_ID')] = item.val();
					}
					return;
				}
			}
			if (me.isSelect(item) === true)
			{
				model[item.attr('ITEM_ID')] = item.select2('val');
				return;
			}
			model[item.attr('ITEM_ID')] = item.val();
		});
		return model;
	},
	
	/**
	 * 
	 */
	setValue : function (itemId, value)
	{
		var me = this;
		var item = me.findField(itemId);
		if (!cbx.core.isEmpty(item))
		{
			if (me.isSelect(item))
			{
				item.select2('val', value);
			} else if (me.isCheckbox(item))
			{
				var itemValue = item.val();
				if (itemValue != null && itemValue !== '')
				{
					if (itemValue === value)
					{
						item.prop('checked', true);
					} else
					{
						item.prop('checked', false);
					}
				} else
				{
					if (value === 'Y')
					{
						item.val(value);
						item.prop('checked', true);
					} else
					{
						item.prop('checked', false);
					}
				}
			} else if (me.isRadio(item))
			{
				var itemValue = null, $item;
				for (var i = 0, len = item.length; i < len; i++)
				{
					$item = $(item[i]);
					itemValue = $item.val();
					if (itemValue === value)
					{
						$item.prop('checked', true);
					} else
					{
						$item.prop('checked', false);
					}
				}
			} else
			{
				// for rest of the components
				item.val(value);
			}
		}
	},
	
	/**
	 * 
	 */
	setModel : function (model)
	{
		var me = this;
		if (model != null && cbx.core.isObject(model))
		{
			var item = null;
			for ( var i in model)
			{
				if (i != null)
				{
					me.setValue(i, model[i]);
				}
			}
		}
	},
	
	/**
	 * 
	 */
	markInvalid : function (itemId, errMsg)
	{
		var me = this;
		var $elem = $($(me.elem).find('div.' + me.divClass));
		var $elemErr = $elem.find('[ITEM_ID="' + itemId + '_ERR"]');
		$elemErr.html(errMsg);
		$($elem.find('[ITEM_ID="' + itemId + '"]')).focus();
	},
	/**
	 * 
	 */
	clearInvalid : function (itemId)
	{
		var me = this;
		var $elem = $($(me.elem).find('div.' + me.divClass));
		$elem = $elem.find('[ITEM_ID="' + itemId + '_ERR"]');
		$elem.empty();
	},
	
	/**
	 * 
	 */
	setFocus : function (itemId)
	{
		var me = this;
		var $elem = $($(me.elem).find('div.' + me.divClass));
		$($elem.find('[ITEM_ID="' + itemId + '"]')).focus();
	},
	
	/**
	 * 
	 */
	setVisibleFields : function (itemId, flag)
	{
		var me = this;
		var $elem = $($(me.elem).find('div.' + me.divClass));
		if (!cbx.isEmpty(flag) && !cbx.isEmpty(itemId))
		{
			if (flag)
				$($elem.find('[ITEM_ID="' + itemId + '"]')).show();
			else
				$($elem.find('[ITEM_ID="' + itemId + '"]')).hide();
		}
	}
});
/**
 * 
 */
CLCR.registerCmp({'COMP_TYPE' : 'APP','VIEW_TYPE' : 'FORM'}, canvas.lib.view.formview);
