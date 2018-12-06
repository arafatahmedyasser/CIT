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

cbx.lib.MultiAppContainer = Class(cbx.core.Component,{
	initialize: function(){
	var me=this;
	this.rb={};
	
	var multiAppComp=new Ext.TabPanel({
	autoHeight:true,
	autoWidth:true,
	//title:"Multi App Container",
	border : true,
	frame : true,
	//items:this.requestMD(),
	activeTab:0,
	onDestroy:function(){
			me.destroy();
		}
	});
	
		this.addItem(multiAppComp);
		this.requestMD();
	},	
	requestMD:function(){
		cbx.core.multiapp.model.getMultiAppMetadata(this.WIDGET_ID, 1, this.createItems, this);
	},	
	createItems : function(meta) {
		var itemArr=[];
		var me=this;
		//var appsMD=Ext.decode('{"CHILD_WIDGETS":[{"WIDGET_PXL_HT":"300","BLOCK_POSITION":"EXTREMELEFT","RESIZE_IND":"N","NO_OF_ROWS":null,"WIDGET_ID":"WGT_BANK_POSTIENGANG_ADS","WGT_TITLE":"LBL_RETAIL_ADS_VIEW","CLOSED_IND":"N","POSITION":"1"}],"MULTI_WIDGET_MD":{"CONTAINER_FLAG":"Y","LAYOUT":"TAB","NO_OF_ROWS":"","WGT_DISPLAY_NM":"LBL_SWPS_INQUIRY","WIDGET_ID":"WGT_SWP_MULTI"}}');
		var appsMD=meta.md;
		var multiAppArr = appsMD.CHILD_WIDGETS;
		var config;
			for ( var index = 0; index < multiAppArr.length; index++) {
				config={
							elemId: cbx.id(),
							//callback:this.addApp,
							layoutScope:this
						};
						cbx.core.extend(config, multiAppArr[index]);
										
				itemArr[itemArr.length] = new Ext.Panel(
						{
							autoHeight : true,
							autoWidth : true,
							tabCls:'wstab tab-icon', 
							iconCls:'icon-'+multiAppArr[index].WIDGET_ID, 
							title : me.rb[multiAppArr[index].WGT_TITLE] == null ? multiAppArr[index].WGT_TITLE
									: me.rb[multiAppArr[index].WGT_TITLE],
							itemId : multiAppArr[index].WIDGET_ID,
							mode : 'local',
							bundle : me.bundle,
							//items:[new cbx.core.Apps(config)],
							getAppContainer : function() {
								return me.getComponent(0)
										.getAppContainer();
							},
							listeners : {
								"activate" : me.tabSelectionHandler,
								scope : me,
								"deactivate" : me.tabDeSelectionHandler
							}
						});
			}
			
			this.getCmp(0).add(itemArr);
			this.getCmp(0).setActiveTab(0);
		
		},
	tabSelectionHandler: function(panel){
		

		var CurrentIndex = this.getCmp(0).items.indexOf(this.getCmp(0).getActiveTab());
		
		var config={
			elem:panel,
			WIDGET_ID:panel.itemId,
			index:CurrentIndex
		}
		var multiAppContainer=this.multiappMngr.appSelectHandler(config);
		panel.add(multiAppContainer.getCmp(0));
		panel.doLayout();
	},
	tabDeSelectionHandler: function(panel){
		
		var CurrentIndex = this.getCmp(0).items.indexOf(this.getCmp(0).getActiveTab());
		
		panel.removeAll(true);
		var config={
			elem:panel,
			WIDGET_ID:panel.itemId,
			index:CurrentIndex
		}
	},
	addApp: function(app){
		var container= this.getCmp(0);
		container.add(app.getCmp(0));
		container.doLayout();
	}

});


cbx.lib.ChildAppContainer = Class(cbx.core.Component,{

	initialize: function(){
	var me=this;
	var appComp=new Ext.Panel({
		autoHeight:false,
		autoWidth:true,
		//title:"Multi APP Container",
		border : true,
		frame : true,
		height: 300,
		layout:'fit',
		autoScroll:true
	});
	this.appArr=[];
	
	this.addItem(appComp);
	//this.initializeApps();
	this.requestMD();
	
	},
	requestMD:function(){
		cbx.core.multiapp.model.getMultiAppMetadata(this.WIDGET_ID, 1, this.initializeApps, this);
	},	
	initializeApps:function(meta){
		var appsMD=meta.md;
		var apps=appsMD.CHILD_WIDGETS || [];
		var me=this;
					
		var config;
		
		config={
					elemId: cbx.id(),
					callback:this.addApp,
					layoutScope:this
				};
				cbx.core.extend(config, apps[me.index]);
				this.appArr.push(new cbx.core.Apps(config));
		
		/*for(var i=0, len=apps.length; i<len; i++){
			if(this.WIDGET_ID==apps[i].WIDGET_ID){
			config={
				elemId: cbx.id(),
				callback:this.addApp,
				layoutScope:this
			};
			cbx.core.extend(config, apps[i]);
			this.appArr.push(new cbx.core.Apps(config));
			break;
			}
	}
		*/	
	},
	addApp: function(app){
		var container= this.getCmp(0);
		container.add(app.getCmp(0));
		container.doLayout();
	}

});