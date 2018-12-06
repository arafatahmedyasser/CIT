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

cbx.ns("cbx.lib");
cbx.lib.LayoutContainerComp = Class(
		cbx.core.Component,
		{
			/*
			 * Initializes the JS lib container component.
			 */
			initialize : function() {
				var me = this;
				this.rb = CRB.getFWBundle();
				// this.layoutManager=iportal.workspace.metadata.getLayoutManager();
				
				var layoutComp = CLCR.getCmp({
					"COMPONENT" : "LAYOUT_CONTAINER_COMPONENT"
				})(this);
				
				this.addLifeCycleMethods(layoutComp);
				//this.addItems(layoutComp,iportal.workspace.metadata.getWorkSpaceById(this.itemId).WORKSPACE_LAYOUT);
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
				this.performOperations(layoutComp);
				layoutComp.doLayout();
				this.addItem(layoutComp);
			},
			addLifeCycleMethods : function(layoutComp){
				layoutComp.renderWidgets = function(){
					/*var selector = function(component){
						if(component.itemId && component.itemId=="MENU-LAYOUT-CNTNR"){
							return true;
						}
						return false;
					}
					var menuContainerPanel = layoutComp.findParentBy(selector);
					if(menuContainerPanel){
						menuContainerPanel.renderWidgets();
					}*/
					this.loadingMode = 'L';
				
					this.init();
					if(this.initialHeight){
						this.setHeight(this.initialHeight);
					}
					that=this;
					var container;
					/**
					 * Calculating the total numbers of rows that will be used for accomodating all the child widgets with in the specified layout
					 * and using that for calculating the correct height of the drag-drop container
					 * */
					/*var totalColumns=1;
					if(this.lytConf.LAYOUT_LAYOUT!=null){
						var layoutObj= new Ext.Container.LAYOUTS[this.lytConf.LAYOUT_LAYOUT.toLowerCase()];
						if(layoutObj!=null && layoutObj.totalColumns!=null){
							totalColumns=layoutObj.totalColumns;
						}
					}
					var totalRows= Math.ceil(this.lytConf.CHILD_WIDGETS.length/totalColumns);
					var containerHeight=(iportal.jsutil.getMultiWidgetResizeHeight()*totalRows)+(35*totalRows);
					//	var containerHeight=(iportal.jsutil.getMultiWidgetResizeHeight()*this.lytConf.CHILD_WIDGETS.length/2)+(32*(this.lytConf.CHILD_WIDGETS.length/2))


					
					containerHeight=containerHeight>ch?containerHeight:ch*/
					var proportion=null;
					if(this.lytConf){
						if(this.lytConf.LAYOUT_PROPORTION!=null && this.lytConf.LAYOUT_PROPORTION!=""){
							proportion= this.lytConf.LAYOUT_PROPORTION.split(",");
						}
						var conf={
								containerHeight:this.initialHeight,
								layout:"fit",
								itemId:this.lytConf.LAYOUT_ID,
								childWidgets:cbx.core.ws.metadata.getAppsByLayoutId(iportal.workspace.metadata.getCurrentWorkspaceId()
										,this.lytConf.LAYOUT_ID)/*this.lytConf.CHILD_WIDGETS*/,
								lytContainer:this,
								containerLayout: this.lytConf.LAYOUT_LAYOUT.toLowerCase(),
								commManager: cbx.CommManager,
								appMVRegistry : new canvas.core.communication.appMVRegistry(),
								proportion:proportion, 
								listeners:{	
									"statechange":function(){
										this.lytContainer.doLayout();
									}
								}
						};
						/*code for deleting the container in case its not yet cleared*/
						if(this.items.length>0){
							this.removeAll(true);
						}
						//if(this.items.length==0){
							if(this.lytConf.LAYOUT_LAYOUT=="STACK"){
								//container= new iportal.container.dd(conf);
								container= new iportal.layout.stack(conf);
								this.add(container);
							}
							else if(this.lytConf.LAYOUT_LAYOUT=="TWO-COLUMN"){
								//container= new iportal.container.dd(conf);
								container= new iportal.layout.twocolumn(conf);
								this.add(container);
							}
							else if(this.lytConf.LAYOUT_LAYOUT=="THREE-COLUMN"){
								//container= new iportal.container.dd(conf);
								container= new iportal.layout.threecolumn(conf);
								this.add(container);
							}
							this.doLayout();
						//}
						/*else if(this.items.length>0){
							var conf={
									layout:"fit",
									itemId:this.lytConf.LAYOUT_ID,
									childWidgets:this.lytConf.CHILD_WIDGETS,
									lytContainer:this,
									width : this.getComponent(0).getWidth(),
									containerLayout: this.lytConf.LAYOUT_LAYOUT.toLowerCase(),
									listeners:{	
										"statechange":function(){
											this.lytContainer.doLayout();
										}
									}
							};		
							Ext.apply(this.items.itemAt(0), conf);		
							this.items.itemAt(0).createItems();
							this.doLayout();
							return;
							try{
								this.items.itemAt(0).destroy();
								var that=this;
								setTimeout(function(){that.renderWidgets();}, 50);			
							}catch(e){}
							
							
						}*/
					}
					
				};
				layoutComp.init = function(){
					var layoutId=this.itemId.substring(0, this.itemId.indexOf("_LAYOUT_CONTAINER"));
					var lytConf=iportal.workspace.metadata.getUpdatedLayoutDef(layoutId);
					if(lytConf!=null){
						this.lytConf= lytConf;			
					}
				};
				layoutComp.removeWidgets = function(){
					this.getComponent(0).removeChildren();
				};
				/**
				* Adding the method reloadWidgetCatalog to the life cycle of layout container component
				* This will be invoked on layout switch to initialize the app dock
				*/
				layoutComp.reloadWidgetCatalog = function(component){
					var wsId = iportal.workspace.metadata.getCurrentWorkspaceId();
					var layoutId=this.itemId.substring(0, this.itemId.indexOf("_LAYOUT_CONTAINER"));
					ct.core.dock.controller.initializeAppDock(wsId,layoutId);
				};
			},
			performOperations : function(layoutComp){
				layoutComp.height = iportal.jsutil.getContainerResizeHeight(),
				layoutComp.addListener('afterlayout',this.resetHeight,layoutComp);
				layoutComp.addListener('afterRender',this.afterRender,layoutComp);
			},
			resetHeight : function(){
				var reqHeight=iportal.jsutil.getContainerResizeHeight();  
				if(reqHeight!=this.height){
					this.setHeight(reqHeight);
				}
			},
			afterRender : function(){
				this.initialHeight= this.height;
				if(this.ownerCt!=null)
					this.ownerCt.doLayout();
				this.setHeight(this.initialHeight);
				
				//Ext.Panel.superclass.afterRender.apply(this, arguments);
			}
			/*method to be used by the workspace or layoutContainer's parents to start loading the widgets*/
			

			
			
			
		});



CLCR.registerCmp({'COMP_TYPE':'LAYOUT_CONTAINER'}, cbx.lib.LayoutContainerComp); 