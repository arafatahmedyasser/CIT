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


Ext.namespace('iportal.treeview');


iportal.treeview.TreePanel = Ext.extend(Ext.Panel, {
		
	  viewConf: null,
	  treeViewId: null,
	  conf:null,
	  initComponent: function(){
			var multiconf = this.conf.mvConf;
			
			var rootVisibleFlag=false;
			if(multiconf.rootText!="")
				{
				rootVisibleFlag=true;
				}
				
			var defaultConfig = {
					xtype:'Panel',
					items:[{	
						xtype : 'iportal-tree',
						params : this.gettreeParams(),
						height:multiconf.height,
						root : new Ext.tree.AsyncTreeNode({
								text: multiconf.rootText,
								draggable:false,
								id: 'root'
							}
						),
						rootVisible:rootVisibleFlag,
						dataUrl : iportal.jsutil.getController(),
						listeners: {
							click: function(node) {
								var strunode = node.attributes.STRUCTURE_GROUP_ID;
								multiconf.fireEvent('treeclick',node.id,strunode,node.attributes); 
							},
							contextmenu:function(node,e)
							{
							multiconf.fireEvent('treecontextclick',node.id,node,this.isDataAvailable(),e);
							}
						
						}
							
						}]
					
					
			};
			Ext.apply(this, defaultConfig);
			iportal.treeview.TreePanel.superclass.initComponent.apply(this);
			
		},
		updateHeight: function(height){
			this.setHeight(height);
			this.getComponent(0).setHeight(height-5);
			this.doLayout();
		},
		gettreeParams:function(){

			var treeParams ={};		
				treeParams['INPUT_ACTION'] = 'INIT_DATA_ACTION';
				treeParams['WIDGET_ID'] = this.treeViewId;
				treeParams['VIEW_ID'] = this.viewConf.VIEW_MD.VIEW_ID;
				
				treeParams['PRODUCT_NAME'] = this.viewConf.VIEW_MD.PRODUCT_CODE;
		    		treeParams['INPUT_FUNCTION_CODE'] = 'VSBLTY';
		    		treeParams['INPUT_SUB_PRODUCT'] = this.viewConf.VIEW_MD.SUB_PRODUCT_CODE;	 
		    		treeParams['PAGE_CODE_TYPE'] = 'VDF_CODE';
		    		
		    		treeParams['LAYOUT_ID'] = iportal.workspace.metadata.getCurrentLayoutId();
		    		treeParams['WORKSPACE_ID'] = iportal.workspace.metadata.getCurrentWorkspaceId();
		    	
		    		var params =this.conf.mvConf.extraParamsHandler(treeParams);
				
				return treeParams;
				
		}


});


Ext.reg('iportal-treepanel', iportal.treeview.TreePanel);