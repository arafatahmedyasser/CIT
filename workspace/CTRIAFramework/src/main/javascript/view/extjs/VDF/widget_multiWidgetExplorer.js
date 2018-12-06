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
 * @version 0.1
 */
Ext.namespace('iportal.widget');
/*
 * @class MultiWidgetExplorer class provided a container to load all its child widgets into borderlayout
 */

iportal.widget.MultiWidgetExplorer = Ext.extend(Ext.Panel, {
	childWidgets : [],
	id : null,
	draggable : false,
	initComponent : function ()
	{
		var defaultConfig = this.getConfig();
		Ext.apply(this, defaultConfig);
		iportal.widget.MultiWidgetExplorer.superclass.initComponent.apply(this);
	},
	getConfig : function ()
	{
		var east='east';
		var west='west';
		if(iportal.preferences.isLangDirectionRTL())
		{
			east='west';
			west='east';
			}
		var config= {
			xtype : 'panel',
			isContainerWidget : true,
			draggable : false,
			bodyStyle : 'background-color:#f0f0f0;',
			padding :1,
			border : true,
			layout : 'border',
			items : [ {
				region : 'west',
				// layout:'fit',
				collapseMode : 'mini',
			//	autoScroll : true,
				hidden : this.getAvailability(1), 
				split : true,
				width : 175,
				minSize : 175,
				maxSize : 400,
				items : this.createItems(1, 75)
			}, {
				region : 'center',
				// layout:'fit',
			//	autoScroll : true,
				height : this.height * (75 / 100),
				minSize : this.height * (75 / 100),
				maxSize : this.height * (75 / 100),
				items : this.createItems(2, 75)
			}, {
				region : 'east',
				// layout:'fit',
				collapseMode : 'mini',
			//	autoScroll : true,
				split : true,
				hidden : this.getAvailability(3),
				width : 200,
				minSize : 200,
				maxSize : 200,
				items : this.createItems(3, 75)
			}, {

				region : 'south',
				// layout:'fit',
				collapseMode : 'mini',
			//	autoScroll : true,
				split : true,
				hidden : this.getAvailability(4), 
				height : this.height * (25 / 100),
				minSize : this.height * (25 / 100),
				maxSize : this.height * (25 / 100),
				items : this.createItems(4, 20), 
				listeners : {
					"expand" : this.expandPanel,
					"collapse" : this.collapsePanel
				}
			} ]
		};
		
		return config;
	},
	getWidgetId : function (position)
	{
		for (var index = 0; index < this.childWidgets.length; index++)
		{

			if (position.toString() == this.childWidgets[index].POSITION.toString())
			{
				return this.childWidgets[index].WIDGET_ID;
			}
		}
	},
	/*
	 * Method for loading every region for all the child widgets provided in the meta data
	 */
	createItems : function (position, per)
	{

		for (var index = 0; index < this.childWidgets.length; index++)
		{

			if (position.toString() == this.childWidgets[index].POSITION.toString())
			{

				var itemid = this.childWidgets[index].WIDGET_ID;
				var t = Math.floor(this.height * per / 100);
				
				/**
				 * Passing additionalConfig object to all the child items
				 * 
				 * @see iportal.widget.MultiWidget.js
				 */
				var widget = (canvas.view.appRegisterMap && canvas.view.appRegisterMap[itemid])
							? canvas.view.appRegisterMap[itemid](this.additionalConfig) : null;
				if (!widget)
				{
					var metadata = {
						WIDGET_ID : itemid,
						additionalConfig : this.additionalConfig
					}
					widget = iportal.listview.listviewrenderermap.getWidget(metadata);
				}
				
				widget.setParentHeight(t);
				widget.mv.loadingInContainer = true;
				widget.mv.isParentPortlet = false;
				widget.mv.draggable = false;
				widget.mv.isLoadingToolsInside = true;// to load widget tools inside widget, not at the container
														// level
				
				// resetting the additional Config in case it is not available.
				widget.mv.additionalConfig = widget.mv.additionalConfig || this.additionalConfig;
				
				this.appMVRegistry.registerWidget(itemid, widget.mv);

				/*
				 * In case of singular widget loading from the MultiViewModel rather an new AJAX call Disabling the
				 * dragging adding the header to the mv
				 */
				if (!widget.isContainer)
				{
					if (widget.mv.mvh != null)
					{
						widget.mv.mvh.mvConf.isLoadingToolsInside = true;
						if (widget.mv.mvh.getSelectedPanel() != null)
						{
							widget.mv.mvh.getSelectedPanel().draggable = false;
							widget.mv.mvh.getSelectedPanel().setTitle(widget.mv.mvh.getSystemViewTitle());
						} else
						{
							widget.mv.mvh.items.itemAt(0).draggable = false;
							widget.mv.mvh.items.itemAt(0).setTitle(widget.mv.mvh.getSystemViewTitle());
						}
						widget.mv.add(widget.mv.mvh);
						widget.mv.doLayout();
					}
				}

				return [ widget.mv ];

			}
		}

		return new Ext.Container();

	},
	
	/**
	 * Intended to check availablity of widget in explorer
	 * panel, on the basis of which widget panel would be visible or hidden. It excludes hiding center position.
	 */
	getAvailability : function (position)
	{

		for (var index = 0; index < this.childWidgets.length; index++)
		{

			if (position.toString() == this.childWidgets[index].POSITION.toString())
			{

				return false;

			}

		}
		return true;
	},
	
	expandPanel : function (panelobj)
	{
		var lmask = new Ext.LoadMask(panelobj.ownerCt.bwrap, {
			msg : "Loading"
		});
		lmask.show();
		try
		{
			var newHeight = (Math.floor(panelobj.ownerCt.height * (75 / 100)) - 5);

			var widget = (panelobj.ownerCt.getComponent(1).getComponent(panelobj.ownerCt.getWidgetId(2)));
			widget.updateHeight(newHeight);

			// For instruction widgets
			widget = (panelobj.ownerCt.getComponent(2).getComponent(panelobj.ownerCt.getWidgetId(3)));
			widget.setHeight(newHeight);
			widget.mwc.updateHeight(newHeight);

			// For tree widget
			widget = (panelobj.ownerCt.getComponent(0).getComponent(panelobj.ownerCt.getWidgetId(1)));
			widget.updateHeight(newHeight);

			lmask.hide();
		} catch (e)
		{
			lmask.hide();
			LOGGER.error("issue in Updating the app height" +e);
		}

	},

	collapsePanel : function (panelobj)
	{
		var lmask = new Ext.LoadMask(panelobj.ownerCt.bwrap, {
			msg : "Loading"
		});
		lmask.show();
		try
		{

			var orgHeight = Math.floor(panelobj.ownerCt.items.itemAt(1).items.itemAt(0).getHeight());
			var expHeight = (Math.floor(panelobj.ownerCt.height * (25 / 100)) - 5);
			var newHeight = orgHeight + expHeight
			var widget = (panelobj.ownerCt.getComponent(1).getComponent(panelobj.ownerCt.getWidgetId(2)));
			widget.updateHeight(newHeight);
			// For instruction widgets
			widget = (panelobj.ownerCt.getComponent(2).getComponent(panelobj.ownerCt.getWidgetId(3)));
			widget.setHeight(newHeight)
			widget.mwc.updateHeight(newHeight);

			// For tree widget
			widget = (panelobj.ownerCt.getComponent(0).getComponent(panelobj.ownerCt.getWidgetId(1)));
			widget.updateHeight(newHeight);

			lmask.hide();
		} catch (e)
		{
			lmask.hide();
			LOGGER.error("issue in Updating the app height" +e);
		}
	},
	afterRender : function ()
	{
		if (this.ownerCt != null)
			this.ownerCt.doLayout();
		iportal.widget.MultiWidgetExplorer.superclass.afterRender.apply(this, arguments);
	},
	updateHeight : function (height)
	{
		this.height = height;
		this.setHeight(height);

	}

});
