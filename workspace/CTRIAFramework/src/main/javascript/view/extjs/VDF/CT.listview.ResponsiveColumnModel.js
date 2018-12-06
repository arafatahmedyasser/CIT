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

Ext.namespace("CT.listview");

/**
 * The purpose of this class to provide responsive column on widget resize.
 */
CT.listview.ResponsiveColumnModel = Ext.extend(canvas.listview.columnModel, {});


CT.listview.Responsivecolumn = Ext
			.extend(
						Ext.grid.Column,
						{

							header : '&#160;',
							resizable : true,
							layout : {
								type : 'fit',
								align : 'left'
							},
							respTemplateData : {},
							respCntxtCol : {},

							parentTemplate : '<div id="{parentTemplateId}" class="x-grid3-col x-grid3-cell x-grid3-td-RESPONSIVE_COLUMN" style="width: 100%; position: relative;">'
										+ '{checkBoxTag}'
										+ '<div class="x-grid3-col x-grid3-cell x-grid3-td"><div class="x-grid3-cell-inner x-grid3-col" ext:qtip="{parentTemplateToolTip}" unselectable="on">{content}</div></div>'
										+ '<div class="x-grid3-col x-grid3-cell x-grid3-td-0 x-grid3-cell-first x-action-col-cell"><div class="x-grid3-cell-inner x-grid3-col-0" unselectable="on" style="width: 30; float:right">{contextActionTag}</div></div>'
										+ '</div>',

							defaultUserTemplate : '<div class="x-grid3-cell-inner x-grid3-col x-grid3-col-resp">'
										+ '<table class="x-grid3-cell-inner x-grid3-col x-grid3-col-resp x-grid3-col-tabl" colspan="0" style="width:100%; height:100%;">'
										+ '<tr class="x-grid3-cell-inner x-grid3-col x-grid3-col-resp x-grid3-col-tabl-tr1"><td class="x-grid3-cell-inner x-grid3-col x-grid3-col-resp x-grid3-col-tabl-tr-tcol1" ext:qtip="{1}">{1}</td>'
										+ '<td class="x-grid3-cell-inner x-grid3-col x-grid3-col-resp x-grid3-col-tabl-tr-tcol2" ext:qtip="{2}">{2}</td></tr>'
										+ '<tr class="x-grid3-cell-inner x-grid3-col x-grid3-col-resp x-grid3-col-tabl-tr2"><td class="x-grid3-cell-inner x-grid3-col x-grid3-col-resp x-grid3-col-tabl-tr-tcol3" ext:qtip="{3}">{3}</td><td></td></tr>'
										+ '</table></div>',

							userTemplate : '',
							constructor : function (cfg)
							{

								CT.listview.Responsivecolumn.superclass.constructor.call(this, cfg);

								this.renderer = function (val, metaData, record, rowIndex, colIndex, store, grid)
								{

									var that = this;
									if (Ext.isEmpty(this.respTemplateData))
										that = this.scope;
									var respTemplateData = that.respTemplateData;
									var respCntxtCol = that.respCntxtCol;

									that.setPriorityCols(record.data, respTemplateData);

									var parentTemplateId = 'row-' + grid.view_id + '-' + record.id;

									that.addParentListener.defer(1, that,
												[ parentTemplateId, grid, rowIndex, colIndex ]);
									respTemplateData.parentTemplateId = parentTemplateId;
									respTemplateData.parentTemplateToolTip = that.getContentTooltip(record.data,respTemplateData);

									var parentTemplate = new Ext.XTemplate(that.parentTemplate);
									var checkBoxTag = '<div class="x-grid3-col x-grid3-cell x-grid3-td-checker x-grid3-cell-first" style="float:left"><div class="x-grid3-cell-inner x-grid3-col-checker"  unselectable="on" ><div class="x-grid3-row-checker" style="height: 18px; width: 18px;">&nbsp;</div></div></div>';
									var template;
									if (Ext.isEmpty(that.userTemplate))
										template = new Ext.XTemplate(that.defaultUserTemplate);
									else
										template = new Ext.XTemplate(that.userTemplate);

									if (respTemplateData.isCheckBoxEnabled)
									{
										respTemplateData['checkBoxTag'] = checkBoxTag;
									}
									if (respTemplateData.hasContextColumn)
									{
										var contextActionTag = '';
										var items;

										if (!Ext.isEmpty(respCntxtCol))
										{
											items = respCntxtCol[0].items;
											for (var i = 0; i < items.length; i++)
											{
												respTemplateData['context_' + grid.view_id + '_'+ i] = 'context_'
															+ grid.view_id + '_'+ i;
												var item = items[i];
												var func = item.handler;
												contextActionTag += '<img id={[this.getImgId(values.itemhandler'
															+ i
															+ ',values.context_'
															+ grid.view_id+'_'
															+ i
															+ ')]} ext:qtip="'
															+ item.tooltip
															+ '" class="x-action-col-icon x-action-col-'
															+ rowIndex
															+ '  '
															+ item.getClass()
															+ '" src='+Ext.BLANK_IMAGE_URL+' alt="" >';
												respTemplateData['itemhandler' + i] = item.handler;

											}
										}

										respTemplateData['contextActionTag'] = new Ext.XTemplate(contextActionTag, {
											getImgId : function (itemHandler, iconId)
											{

												// var iconId=Ext.id();
												this.addListener.defer(1, this, [ iconId, itemHandler ]);
												return iconId;
											},
											addListener : function (iconId, itemHandler)
											{
												if (Ext.isEmpty(Ext.get(iconId)))
													return;

												Ext.get(iconId).on('click', function (event, target, options)
												{
													itemHandler.call(this, grid, rowIndex, colIndex, '', event);
												}, this);
											}
										}).applyTemplate(respTemplateData);
									}
									respTemplateData['content'] = template
												.applyTemplate(respTemplateData.priorityColValues);

									return parentTemplate.applyTemplate(respTemplateData);

								};

							},

							setPriorityCols : function (data, respTemplateData)
							{
								if (!Ext.isEmpty(respTemplateData.priorityCols))
								{
									for (var j = 0; j < respTemplateData.priorityCols.length; j++)
									{
										respTemplateData.priorityColValues[j] = data[respTemplateData.priorityCols[j]];
									}

								}
							},

							getContentTooltip : function (data,respTemplateData)
							{
								var tmpl = '<div><table class=\'resp-qtip\'><th class=\'resp-qtip-th\' style=\'border-bottom:2px; white-space:nowrap;\'><b>Columns</b></th><th><b>Values</b></th>';
								for (var k = 1; k < respTemplateData.toolTipCols.length; k++)
								{
									if(!Ext.isEmpty(respTemplateData.toolTipCols[k]))
												tmpl += '<tr class=\'resp-qtip-tr\' style=\'border-bottom:1px;\'><td class=\'resp-qtip-td1\' style=\'white-space:nowrap;\'>' + respTemplateData.toolTipColLabels[k] + ' : </td><td class=\'resp-qtip-td2\'> '
														+ data[respTemplateData.toolTipCols[k]] + '</td></tr>';
								}
								tmpl += '</table></div>';

								return tmpl;

							},

							addParentListener : function (parentDivId, grid, rowIndex, colIndex)
							{

								if (Ext.isEmpty(Ext.get(parentDivId)))
									return;
								Ext.get(parentDivId).on(
											'click',
											function (event, target, options)
											{
												// if(!Ext.isEmpty(grid.selModel))
												if (target.className == 'x-grid3-row-checker'
															|| Ext.fly(target).hasClass('x-action-col-icon'))
													return;
												grid.fireEvent("rowmousedown", grid, rowIndex, event);
												grid.fireEvent("cellclick", grid, rowIndex, colIndex, event);
											}, this);
								Ext.get(parentDivId).on(
											'dblclick',
											function (event, target, options)
											{
												// if(!Ext.isEmpty(grid.selModel))
												if (target.className == 'x-grid3-row-checker'
															|| Ext.fly(target).hasClass('x-action-col-icon'))
													return;
												grid.fireEvent("rowmousedown", grid, rowIndex, event);
												grid.fireEvent("celldblclick", grid, rowIndex, colIndex, event);
											}, this);
								Ext.get(parentDivId).on('contextmenu', function (event, target, options)
								{
									grid.fireEvent("rowcontextmenu", grid, rowIndex, event);
								}, this);

							}

						});

Ext.grid.Column.types.responsivecolumn = CT.listview.Responsivecolumn;
