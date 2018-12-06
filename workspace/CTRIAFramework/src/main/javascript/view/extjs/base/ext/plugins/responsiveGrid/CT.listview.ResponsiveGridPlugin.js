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

/*
 * The purpose of this class is to provide plugin for responsive grid
 */
CT.listview.ResponsiveGridPlugin = Ext.extend(Object,
		{

			init : function(component) {
				 
				if(component.view && iportal.systempreferences.getResponsiveGridInd()){
					component.on("bodyresize", this.bodyresize, this);
				}

			},
			bodyresize : function(p, width, height) {

				var curView = p.view;

				if (iportal.systempreferences.getResponsiveGridInd()
						&& width < parseInt(iportal.systempreferences.getResponsiveGridPercent()) && p.responsivecm.isResponsive) {

					if (p.colModel) {
						var oldColModel = p.colModel;

						oldColModel.un('configchange',
								curView.onColConfigChange, curView);
						oldColModel.un('widthchange', curView.onColWidthChange,
								curView);
						oldColModel.un('headerchange', curView.onHeaderChange,
								curView);
						oldColModel.un('hiddenchange', curView.onHiddenChange,
								curView);
						oldColModel.un('columnmoved', curView.onColumnMove,
								curView);
					}

					var newColModel = p.responsivecm;
					if (newColModel) {
						// delete curView.lastViewWidth;

						curView.on({
							scope : curView,
							configchange : curView.onColConfigChange,
							widthchange : curView.onColWidthChange,
							headerchange : curView.onHeaderChange,
							hiddenchange : curView.onHiddenChange,
							columnmoved : curView.onColumnMove
						 
						});
					}

					newColModel.setColumnWidth(0, width - 20);
					p.view.isResponsiveGrid = true;
					if (!Ext.isEmpty(p.view.hmenu.items.get('columns')))
						p.view.hmenu.items.get('columns').setVisible(false);
					p.view.expandcm = p.expandcm;
					p.colModel = newColModel;
					curView.cm = newColModel;
					p.view.on('beforeColMenuShow', this.beforeColMenuShowResp,
							p.view);
				}
				
			else {
					p.view.isResponsiveGrid = false;
					if (!Ext.isEmpty(p.view.hmenu.items.get('columns')))
						p.view.hmenu.items.get('columns').setVisible(true);
					p.colModel = p.expandcm;
					curView.cm = p.expandcm;
				}

				if (p.rendered) {
					p.view.refresh(true);
				}
			}
		});

Ext.preg('responsiveGridPlugin', CT.listview.ResponsiveGridPlugin);
