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
cbx.namespace('cbx.form');
/**
 * 
 */
cbx.form.formviewpanel = Ext.extend(Ext.Panel, {
	/**
	 * 
	 */
	initComponent : function ()
	{
		var multiConf = this.conf.mvConf;
		/**
		 * Subtracting bbar height from view height, if the bbar is configured 
		 **/
		var heightToSet = multiConf.height;
		/**
		 * 
		 */
		var widgetHeightInPixels = iportal.workspace.metadata.getWidgetHtInPixels(multiConf.itemId, multiConf.LAYOUT_ID);
		
		if(!cbx.isEmpty(widgetHeightInPixels)){
			heightToSet = widgetHeightInPixels - 10;;
		}
		/**
		 * if (multiConf.mvh.bbar !== null) { heightToSet = parseInt(heightToSet -
		 * iportal.jsutil.getBBarHeight(multiConf.mvh.bbar) + 5); }
		 */
		var ifChildWidgets = multiConf.ownerCt.childWidgets;
		/**
		 * For Singular widget height calculation with widget bbar 
		 **/
		if (multiConf.mvh.bbar !== null && ifChildWidgets == null)
		{
			heightToSet = parseInt(heightToSet - iportal.jsutil.getBBarHeight(multiConf.mvh.bbar) + 5);
		}
		/**
		 * For multi widget height calculation with widget bbar 
		 **/
		else
		{
			heightToSet = parseInt(heightToSet - iportal.jsutil.getBBarHeight(multiConf.mvh.bbar) - 32);
		}
		var defaultConfig = {
			xtype : 'panel',
			layout : 'column',
			defaults : {
				columnWidth : 1
			},
			autoScroll : true,
			layout : Ext.isIE6 ? 'fit' : 'auto',
			height : heightToSet
		};
		Ext.apply(this, defaultConfig);
		cbx.form.formviewpanel.superclass.initComponent.apply(this);
		this.loadForm(multiConf);
	},
	
	/**
	 * 
	 */
	loadForm : function (multiConf)
	{
		var that = this;
		CBXDOWNLOADMGR.requestScripts(cbx.downloadProvider.getMergedArray([ "FORM_FRAMEWORK" ]), function ()
		{
			var fm = new cbx.form.FormManager({
				formId : that.viewConf.VIEW_MD.FLD_DATA_SRC_ID,
				scope : that,
				modelData : {},
				listeners : {
					'initialized' : function (manager)
					{
						multiConf.fireEvent('forminitialized', manager);
						multiConf.fireEvent('resizeafterdatacall', that.height);
						that.setFormAvailable();
					},
					'formbeforeinitialize' : function (manager)
					{
						LOGGER.info('formbeforeinitialize', manager);
						multiConf.fireEvent('formbeforeinitialize', manager);
					}
				}
			});
			that.add(fm.getFormView());
			that.doLayout();
			that.fm = fm;
		});
	},
	
	/**
	 * 
	 */
	isFormAvailable : function ()
	{
		return this.isFormAvail;
	},
	
	/**
	 * 
	 */
	updateHeight : function (height)
	{
		this.setHeight(height);
		this.getComponent(0).setHeight(height - 5);
		this.doLayout();
	},
	
	/**
	 * 
	 */
	setFormAvailable : function ()
	{
		this.isFormAvail = true;
	},
	
	/**
	 * 
	 */
	afterRender : function (ct, position)
	{
		cbx.form.formviewpanel.superclass.afterRender.call(this, ct, position);
		this.ownerCt.doLayout();
		LOGGER.info(this.height);
	},
	
	/**
	 * 
	 */
	getFormManager : function ()
	{
		return this.fm;
	},
	
	/**
	 * 
	 */
	afterRender : function ()
	{
		if (this.ownerCt != null)
			this.ownerCt.doLayout();
		cbx.form.formviewpanel.superclass.afterRender.apply(this, arguments);
	}
});
