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
Ext.ns('cbx.appstore');

/**
 * @class cbx.appstore.DataModel

 * @extends Ext.util.Observable This class processes the data received from the AJAX call This class has the following
 *          methods 1) constructor - The place where the components are initialized like resource bundle,model data and
 *          the workspaceId. 2) getModelData - This method will be used to retrieve the modelData. 3) setModelData -
 *          This method will be used to set the value of modelData. 4) dataprocessor - This method will modify the data
 *          according to the requirements in the JS components. 5) setWorkspaceId - This method will be used to set the
 *          value of WorkspaceId. 6) getWorkspaceId - This method will be used to retrieve the WorkspaceId. 7) isUpdate -
 *          This method will return a boolean value to say whether its ADD/UPDATE workspace. 8)
 *          getSelectedWorkspaceDisplayName - This method will be used to retrieve the SelectedWorkspaceDisplayName. 9)
 *          getSelectedWorkspaceLayoutCategory - This method will be used to retrieve the
 *          SelectedWorkspaceLayoutCategory. 10)getProductCategory - This method will be used to retrieve the
 *          ProductCategory. 11)getLayoutCategory - This method will be used to retrieve the LayoutCategory.
 *          12)getSelectedWorkspaceLayoutwidget - This method will be used to retrieve the
 *          SelectedWorkspaceLayoutwidget. 13)getSelectedWorkspaceLayoutProportion - This method will be used to
 *          retrieve the SelectedWorkspaceLayoutProportion.
 */

cbx.appstore.DataModel = Ext
			.extend(
						Ext.util.Observable,
						{

							/**
							 * The place where the components are initialized like resource bundle,model data and the
							 * workspaceId.
							 * 
							 * @param config
							 * @returns
							 */
							constructor : function (config)
							{

								this.rb = CRB.getFWBundle();

								if (config)
								{
									if (config.responseData)
									{
										this.mdata = config.responseData;
									}
									if (config.responseData)
									{
										this.workspaceId = config.workspaceId;
									}
									if (config.processData && config.processData == true)
									{
										this.dataprocessor();
									}
								}

								cbx.appstore.DataModel.superclass.constructor.call(this, config);
							},
							/**
							 * This method will be used to retrieve the modelData.
							 */
							getModelData : function ()
							{
								return this.mdata;
							},
							/**
							 * This method will be used to set the value of modelData.
							 */
							setModelData : function (obj, processData)
							{

								this.mdata = obj;

								processData = processData || false;
								if (processData)
								{
									this.dataprocessor();
								}

							},

							/**
							 * This method will modify the data according to the requirements in the JS components.
							 */

							dataprocessor : function ()
							{

								for (var i = 0, len = this.mdata.PRODUCT_CATEGORY_WIDGETS_MAP.length; i < len; i++)
								{
									for (var j = 0, jlen = this.mdata.PRODUCT_CATEGORY_WIDGETS_MAP[i].WIDGETS.length; j < jlen; j++)
									{
										var widgetID = this.mdata.PRODUCT_CATEGORY_WIDGETS_MAP[i].WIDGETS[j];
										var bundle = CRB.getBundle(this.mdata.WIDGET_META_DATA[widgetID].BUNDLE_KEY)
													|| CRB.getFWBundle();
										var widgetmap = {
											'PRODUCT_CATEGORY' : this.mdata.PRODUCT_CATEGORY_WIDGETS_MAP[i].PRODUCT_CATEGORY,
											'SHORT_DESC' : bundle[widgetID + '_DESC'] ? bundle[widgetID + '_DESC']
														: widgetID + '_DESC',
											'WIDGET_NAME' : bundle[this.mdata.WIDGET_META_DATA[widgetID].WGT_DISPLAY_NM]
														? bundle[this.mdata.WIDGET_META_DATA[widgetID].WGT_DISPLAY_NM]
														: this.mdata.WIDGET_META_DATA[widgetID].WGT_DISPLAY_NM
										};
										Ext
													.apply(
																widgetmap,
																this.mdata.WIDGET_META_DATA[this.mdata.PRODUCT_CATEGORY_WIDGETS_MAP[i].WIDGETS[j]]);
										this.mdata.PRODUCT_CATEGORY_WIDGETS_MAP[i].WIDGETS[j] = widgetmap;
									}

								}

								if (this.workspaceId != null)
								{

									
									for (var i = 0, len = this.mdata.SELECTED_WORKSPACE.LAYOUTS[0].WIDGETS.length; i < len; i++)
									{
										
										var widgetID = this.mdata.SELECTED_WORKSPACE.LAYOUTS[0].WIDGETS[i].WIDGET_ID;
										var bundle = CRB.getBundle(this.mdata.WIDGET_META_DATA[widgetID].BUNDLE_KEY)
													|| CRB.getFWBundle();

										var widgetmap = {
											'SHORT_DESC' : bundle[widgetID+ '_DESC'],
											'WIDGET_NAME' : bundle[this.mdata.WIDGET_META_DATA[widgetID].WGT_DISPLAY_NM]? bundle[this.mdata.WIDGET_META_DATA[widgetID].WGT_DISPLAY_NM]
																	: this.mdata.WIDGET_META_DATA[widgetID].WGT_DISPLAY_NM
										};

										Ext.apply(this.mdata.SELECTED_WORKSPACE.LAYOUTS[0].WIDGETS[i], widgetmap);

										Ext
													.apply(
																this.mdata.SELECTED_WORKSPACE.LAYOUTS[0].WIDGETS[i],
																this.mdata.WIDGET_META_DATA[this.mdata.SELECTED_WORKSPACE.LAYOUTS[0].WIDGETS[i].WIDGET_ID]);
									}

								}

							},
							/**
							 * This method will be used to set the value of WorkspaceId.
							 */
							setWorkspaceId : function (wrkspceid)
							{

								this.workspaceId = wrkspceid;

							},
							/**
							 * This method will be used to retrieve the WorkspaceId.
							 */
							getWorkspaceId : function ()
							{

								return this.workspaceId;

							},
							/**
							 * This method will return a boolean value to say whether its ADD/UPDATE workspace.
							 */
							isUpdate : function ()
							{

								return this.workspaceId != null;

							},
							/**
							 * This method will be used to retrieve the SelectedWorkspaceDisplayName.
							 */
							getSelectedWorkspaceDisplayName : function ()
							{

								return this.mdata.SELECTED_WORKSPACE.WORKSPACE_DISPLAY_NM;

							},
							/**
							 * This method will be used to retrieve the SelectedWorkspaceLayoutCategory.
							 */

							getSelectedWorkspaceLayoutCategory : function ()
							{

								return this.mdata.SELECTED_WORKSPACE.LAYOUTS[0].LAYOUT;

							},
							/**
							 * This method will be used to retrieve the ProductCategory.
							 */
							getProductCategory : function ()
							{

								return this.mdata.PRODUCT_CATEGORY_WIDGETS_MAP;

							},
							/**
							 * This method will be used to retrieve the LayoutCategory.
							 */
							getLayoutCategory : function ()
							{

								return this.mdata.LAYOUT_CATAGORIES;

							},
							/**
							 * This method will be used to retrieve the SelectedWorkspaceLayoutwidget.
							 */

							getSelectedWorkspaceLayoutwidget : function ()
							{

								return this.mdata.SELECTED_WORKSPACE.LAYOUTS[0].WIDGETS;
							},
							/**
							 * This method will be used to retrieve the SelectedWorkspaceLayoutProportion.
							 */
							getSelectedWorkspaceLayoutProportion : function ()
							{

								return this.mdata.SELECTED_WORKSPACE.LAYOUTS[0].PROPORTION;
							}

						});
