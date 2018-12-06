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
/*
 * This class contains the Ext Js specific Sub-Workspace Container component.
 */
cbx.ns("cbx.lib");
cbx.lib.LayoutContainer = Class(
		cbx.core.Component,
		{
			/*
			 * Initializes the JS lib sub-workspace container component.
			 * Sub-Workspace container contains the layouts inside it.
			 */
			initialize : function() {
				var me = this;
				this.rb = CRB.getFWBundle();
				this.containerLayout = iportal.workspace.metadata.getWorkSpaceById(this.itemId).WORKSPACE_LAYOUT;
				// this.layoutManager=iportal.workspace.metadata.getLayoutManager();
				var layoutComp = CLCR
						.getCmp(
								{
									"COMPONENT" : "LAYOUT_CONTAINER",
									"LAYOUT" : this.containerLayout
								})(this);
				//this.wsLayout = iportal.workspace.metadata.getWorkSpaceById(this.itemId).WORKSPACE_LAYOUT
				this.addItems(layoutComp, this.containerLayout);
				/*
				 * var layoutComp=new Ext.TabPanel({ autoHeight:true,
				 * autoWidth:true, //title:"Layout Container", border : true,
				 * frame : true, //height: this.elem.getHeight()-2,
				 * items:this.createItems([]), activeTab:0,
				 * onDestroy:function(){ me.destroy(); } });
				 */
				/*
				 * if(this.elem){ this.elem.add(layoutComp);
				 * this.elem.doLayout(); }
				 */
				layoutComp.doLayout();
				this.addItem(layoutComp);
			},
			//removed unused code
			/*
			 * Generates the sub-workspaces for the sub-workspace container.
			 */
			addItems : function(layoutComp, LAYOUT) {
				var me = this;
				/*if (LAYOUT === "STACK") {
					layoutComp.addListener("afterrender",
							me.layoutManager.stackHandler,me);
				} else if (LAYOUT === "TAB") {
					layoutComp.addListener("activate",
							me.layoutManager.layoutSelectionHandler, me);
					layoutComp.addListener("deactivate",
							me.layoutManager.layoutDeSelectionHandler, me);
				}*/
				var layoutArr = iportal.workspace.metadata
						.getLayoutsForWS(this.WORKSPACE_ID);
				for ( var index = 0; index < layoutArr.length; index++) {
					var panel = this.layoutManager.getLayoutContainerComponent(layoutArr[index]);
					var lComp = panel.getItem(0);
					if (LAYOUT === "STACK") {
						lComp.addListener("afterrender",
								me.stackHandler,lComp);
					} else if (LAYOUT === "TAB") {
						lComp.addListener("activate",
								me.layoutSelectionHandler, lComp);
						lComp.addListener("deactivate",
								me.layoutDeSelectionHandler, lComp);
					}
					else if (LAYOUT === "R-MENU" || LAYOUT === "L-MENU"){
						layoutComp.getComponent(0).getComponent(0).add(panel.getItem(0));
						var config = {
								comp : lComp,
								scope : me
						};
						
						
						/*if(index == 0){
							lComp.addListener("afterrender",me.menuHandler,config);
						}*/
						lComp.addListener("activate",
									iportal.jsutil.tabSelectionHandler, lComp);
						lComp.addListener("deactivate",
									iportal.jsutil.tabDeSelectionHandler, lComp);
						continue;
					}
					layoutComp.add(panel.getItem(0));
				}

			},
			menuHandler : function(config){
				if(config == null){
					return;
				}
				var component = this.comp;
				var that = this.scope;
				var activeItem = that.items[0].getComponent(0).getComponent(0);
		        activeItem.initialHeight = activeItem.height;
		        var layoutId = that.getLayoutId(activeItem.itemId);
		        var activeNode = that.items[0].getComponent(1).renderer.findTreeNode(layoutId);
		        /**
		         * Manually setting the selected Node as firing the 'click' event does
		         * not update the TreeSelectionModel.
		         */
		        activeNode.ownerTree.getSelectionModel().selNode = activeNode;
	        	activeNode.fireEvent('click', activeNode);
			},
			/**
		     * returns the layout definition panel
		     */
		    getLayoutPane: function () {
		        return this.items[0].getComponent(0);
		    },
		    /**
		     * returns the menu pane
		     */
		    getMenuPane: function () {
		        return this.getComponent(0).getComponent(1);
		    },
		    /**
		     * substrings the layout id for the passed string and returns the result
		     */
		    getLayoutId: function (str) {
		        var index = str.indexOf("_LAYOUT_CONTAINER");
		        return str.substring(0, index);
		    },
			stackHandler: function(component){
				// Invoking the reloadWidgetCatalog of the layout container component
				component.reloadWidgetCatalog(component);
				component.renderWidgets();
				component.doLayout();
			},
			layoutSelectionHandler : function(layoutContainer){

					if(layoutContainer.reloadWidgetCatalog){
						layoutContainer.reloadWidgetCatalog();
					}

					/*var config = {
						elem : panel,
						LAYOUT_ID : layoutContainer.itemId,
						WORKSPACE_ID : this.WORKSPACE_ID
					};
					var widgetContainer = this.getWidgetContainer(config);
					layoutContainer.add(widgetContainer.getCmp(0));*/
					layoutContainer.renderWidgets();
					
					layoutContainer.doLayout();
					//layoutContainer.parentCt.afterRender();

			},
			menuLayoutSelectionHandler : function(layoutContainer){
				if(layoutContainer.reloadWidgetCatalog){
					layoutContainer.reloadWidgetCatalog();
				}
				var selector = function(component){
					if(component.itemId && component.itemId=="MENU-LAYOUT-CNTNR"){
						return true;
					}
					return false;
				}
				var menuContainerPanel = layoutContainer.findParentBy(selector);
				if(menuContainerPanel){
					menuContainerPanel.renderWidgets();
				}
			},
			menuLayoutDeSelectionHandler : function(layoutContainer){
				
			},
			layoutDeSelectionHandler : function(layoutContainer){

					//  stopping workspace switching

					iportal.workspace.metadata.setWorkspaceChangeAcceptable(false);

					try {

						/*
						 *  Removing only the widgets
						 * loaded inside the container after a lag
						 */

						setTimeout(function() {

							try {

								layoutContainer.removeWidgets();

							} catch (e) {

								//  enabling workspace switching in case
								// of error

								iportal.workspace.metadata
										.setWorkspaceChangeAcceptable(true);

							}
							;

						}, 500);

					} catch (e) {

						//  enabling workspace switching in case of
						// error

						iportal.workspace.metadata
								.setWorkspaceChangeAcceptable(true);

					}

			}

		});

CLCR.registerCmp({'COMP_TYPE':'PARENT_LAYOUT_CONTAINER'}, cbx.lib.LayoutContainer);  