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
 * @class cbx.appstore.SelectedWidgetPanel

 * @extends Ext.util.Observable This class creates the panel which is added in the selected widgets area in canvas
 *          layout. It has header with title , Proportion of column layout and a count of selected widgets. It holds all
 *          the widgets in the form of cbx.appstore.Splitter component. The class contains important methods they are 1)
 *          constructor - The place where the components are initialized like template, Dataview, Proportion & Count
 *          Value, Proportion & Count Label , Title, Store and the Workarea. 2) getProportion - The 'afterrender' method
 *          of the workarea where the data is filtered at first when it is update workspace. 3) getLayout - This returns
 *          the reference of the workarea. 4) getPanel - This 'click' method added on the dataview. 5) afterResize -
 *          This loads the respective widgets by filtering the respective widgets. 6) removed - This is called when
 *          widget is removed from selected widget to added to the available widget area. 6) selWidgetLoader - This is
 *          called to add the selected widget. 6) convertTo1column, convertTo2column, convertTo3column - This is called
 *          when Layout is changed. 6) dummyMethod - This is dummy method for communication. 7) getlayoutData - This
 *          gets the layout information from the splitter component. The Class contains important properties they are 1)
 *          dataModel - The DataModel reference 2) canvas - The Reference of the canvas class. 4) count - The Selected
 *          Widget Count 5) widgetStore - The Reference of the store which holds all the widgets. 6) Propositon - The
 *          Proposition of the laouts. 7) header - The Reference of the header (Label) component with selected widget
 *          count. 8) listView - The Reference of the splitter component. 9) workarea - The panel where the components
 *          of selectedWidget panel are put in.
 */

cbx.appstore.SelectedWidgetPanel = Ext
			.extend(
						Ext.util.Observable,
						{

							/**
							 * @param config - contains datamodel reference and canvas reference
							 */

							constructor : function (config)
							{

								this.dataModel = config.dataModel;

								this.canvas = config.canvas;
								this.count = 0;

								this.rb = CRB.getFWBundle();

								this.tpl = new Ext.XTemplate(
											'<div class="template-wrap" style ="width:100%" title="{WIDGET_NAME}">',
											'<div class="template-wrap-inner"><div class="template-left">',
											'<div class="template-right">',
											'<div class="x-template-header"><h1 class="widgetTitle">{WIDGET_NAME}</h1>',
											'<div class="x-tools-wrap"><div class="x-tool x-tool-iportalRemove" style="display: block;">&nbsp;',
											'</div>',
											'<div class="x-tool x-tool-iportalHelp" style="display: block;">&nbsp;</div>',
											'<div class="x-tool x-tool-iportalMove" style="display: block;">&nbsp;</div></div></div>',
											'<div class="description-holder icon-default icon-WGT_DEFAULT">',
											'<p class="description-text">{SHORT_DESC}</p>', '</div>', '</div>',
											'</div></div>', '</div>');

								var Propositon = new Ext.form.Label({
									text : this.rb.LBL_PROPORTION
								});

								var header = new Ext.form.Label({
									text : this.rb.LBL_SEL_WIDGETS + ' ( 0 ) '
								});

								this.listView = new cbx.appstore.Splitter({
									containerHeight : config.height - 40,
									tpl : this.tpl,
									style : 'border-right:1px solid;border-color: #C0C0C0;',
									height : config.height - 40,
									proportion : this.getProportion(),
									width : 720,
									totalColumns : this.getLayout(),
									listeners : {
										"afterResize" : this.afterResize,
										"removewgt" : this.removed,
										scope : this
									}
								});

								this.workarea = new Ext.Panel({
									autoWidth : true,
									height : config.height,
									autoScroll : true,
									// padding:4,
									items : [ this.listView ],
									tbar : [ header, {
										xtype : 'tbfill'
									}, Propositon ],
									holder : this

								});
							},

							/**
							 * @return - the proportion value of the Selected Layout. The Default value is [33,33,34]
							 */

							getProportion : function ()
							{

								var returnVal = [ 33, 33, 34 ];

								if (this.dataModel.isUpdate())
								{

									returnVal = Ext.decode('[' + this.dataModel.getSelectedWorkspaceLayoutProportion()
												+ ']');

								}

								return returnVal;

							},

							/**
							 * @return - the layout of the Selected Layout. The Default value is [1] i.e stack
							 */

							getLayout : function ()
							{

								var returnVal = 1;

								if (this.dataModel.isUpdate())
								{

									returnVal = this.dataModel.getSelectedWorkspaceLayoutCategory() == 'TWO-COLUMN'
												? 2
												: (this.dataModel.getSelectedWorkspaceLayoutCategory() == 'THREE-COLUMN'
															? 3 : 1);

								}

								return returnVal;

							},

							/**
							 * @return - the workarea of the selected widget
							 */

							getPanel : function ()
							{

								return this.workarea;
							},

							/**
							 * @param data - contain the data of PROPORTION of layout
							 * @return - updates the Proportion value
							 */

							afterResize : function (data)
							{

								this.workarea.getTopToolbar().getComponent(2).setText(
											this.rb.LBL_PROPORTION + ' (' + data.PROPORTION + ') ');

							},

							/**
							 * @param data - contain the data of removed widgetIndex
							 * @return - updates the Available Widget Panel and the count of selected widget
							 */

							removed : function (data)
							{

								this.count = this.count - 1;
								this.workarea.getTopToolbar().getComponent(0).setText(
											this.rb.LBL_SEL_WIDGETS + ' (' + this.count + ') ');

								var params = [];
								params.push(data);

								this.canvas.communicate('availableWidgetPanel', 'updateFilterItems', params);

							},

							/**
							 * @param data - contain the data of selected widgetIndex
							 * @return - updates the count of selected widget
							 */

							selWidgetLoader : function (params)
							{

								this.count = params[1];

								this.listView.updateItem(params[0]);

								this.workarea.getTopToolbar().getComponent(0).setText(
											this.rb.LBL_SEL_WIDGETS + ' (' + params[1] + ') ');

							},

							/**
							 * @return - updates the Splitter Component to convert to stack
							 */

							convertTo1column : function ()
							{

								this.listView.convertTo1column();

							},

							/**
							 * @return - updates the Splitter Component to convert to two Column
							 */

							convertTo2column : function ()
							{

								this.listView.convertTo2column();

							},

							/**
							 * @return - updates the Splitter Component to convert to three Column
							 */

							convertTo3column : function ()
							{

								this.listView.convertTo3column();

							},

							/**
							 * empty method used for intializing any communication to avoid errors.
							 */

							dummyMethod : function ()
							{

							},

							/**
							 * @return - the Splitter Component's Layout Information
							 */

							getLayoutData : function ()
							{

								return this.listView.getLayoutData();
							}

						});
