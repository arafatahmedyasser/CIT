/*************************************************************************
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

*************************************************************************/

cbx.namespace('iportal.chartcomponent');


iportal.chartcomponent.OrgView = Ext.extend(Ext.Panel, {
	  viewConf: null,
	  orgViewId: null,
	  conf:null,
	  isOrgAvail : null,
	  nodehighltedFlag:0,
	  totalHighlightedNode:0,
	  searchingKeys:null,
	  initComponent: function(){
	  this.isOrgAvail = false;
		var multiconf = this.conf.mvConf;
		var defaultConfig = {
						xtype:'panel',				
						items:[{
								xtype:'panel',
								itemId:'ORG_SEARCH_PANEL',
								tbar:this.getTbarForORG()
							    },
						       {
								xtype:'iportal-orgview',
								height:this.searchingKeys?multiconf.height-27:multiconf.height-5,
								nodeClick:multiconf.nodeClick,
								flowClick:multiconf.flowClick,
								nodeRenderer :multiconf.orgtemplateinitializer,
								contextclick:multiconf.contextclick
								}
								]
							
			};
			
			Ext.apply(this, defaultConfig);	
			iportal.chartcomponent.OrgView.superclass.initComponent.apply(this);
			this.draw(multiconf.mvh.vmd.VIEW_MD.SYSTEM_VIEW_ID,multiconf.itemId);
		},
		getTbarForORG : function(){

			var colArr = [], rb = CRB.getBundle(this.viewConf.VIEW_MD.FLD_BUNDLE_KEY);		
			var columnIds=[];
			for ( var i = 0; i < this.viewConf.VIEW_MD.FLD_COLUMN_LIST.length; i++) {	
				if(this.viewConf.VIEW_MD.FLD_COLUMN_LIST[i].FLD_FILTER_ENABLE_IND=="Y"){
					var tmpCol=[];
						tmpCol.push(this.viewConf.VIEW_MD.FLD_COLUMN_LIST[i].FLD_COLUMN_ID);
					tmpCol.push(rb["LBL_"+this.viewConf.VIEW_MD.FLD_COLUMN_LIST[i].FLD_COLUMN_DISPLAY_NAME_KEY] || this.viewConf.VIEW_MD.FLD_COLUMN_LIST[i].FLD_COLUMN_DISPLAY_NAME_KEY);
					colArr.push(tmpCol);
					columnIds.push(this.viewConf.VIEW_MD.FLD_COLUMN_LIST[i].FLD_COLUMN_ID);
				}
			}
			
			if(cbx.isEmpty(colArr))
								{
									this.searchingKeys = null;
									return [];
								}
			this.searchingKeys=columnIds;

															var cv = [
										
										{
											xtype : 'textfield',
											itemId : 'ORG_SEARCH_TXTBOX'
										},
										{
											xtype : 'button',
											text : 'Go',
											cls:'x-btn portal_pos_btn x-btn-noicon',
											overCls :'portal_pos_btn_hover',
											listeners : {
												'click' : function (selectedData)
												{
													selectedData.ownerCt.ownerCt.ownerCt.nodehighltedFlag=0;
													selectedData.ownerCt.ownerCt.ownerCt.totalHighlightedNode = selectedData.ownerCt.ownerCt.ownerCt
																.setHighlightedNode(selectedData);
													if (selectedData.ownerCt.ownerCt.ownerCt.totalHighlightedNode > 0)
													{
														selectedData.ownerCt.ownerCt.ownerCt.showHideNavigation(
																	selectedData, true);
														selectedData.ownerCt.ownerCt.ownerCt
																	.setTextMsgOfNavigation(selectedData);
													}
													else{
														var orgViewComp = this.ownerCt.ownerCt.ownerCt.items.itemAt(1)
																	.getInnercmp();
														orgViewComp.clearHighlightedNide();
														selectedData.ownerCt.ownerCt.ownerCt.showHideNavigation(
																	selectedData, false);
														selectedData.ownerCt.ownerCt.ownerCt.nodehighltedFlag=0;
														}
												}
											}
										},
										{
											xtype : 'button',
											text : 'Clear',
											cls:'x-btn portal_pos_btn x-btn-noicon',
											overCls :'portal_pos_btn_hover',
											listeners : {
												'click' : function (selectedData)
												{
													var orgViewComp = this.ownerCt.ownerCt.ownerCt.items.itemAt(1)
																.getInnercmp();
													orgViewComp.clearHighlightedNide();
													selectedData.ownerCt.ownerCt.ownerCt.showHideNavigation(
																selectedData, false);
													selectedData.ownerCt.ownerCt.ownerCt.nodehighltedFlag=0;
												}
											}
										},
										{
											xtype : 'button',
											text : '&lt;',
											itemId : 'BTN_ORG_PREV',
											hidden : true,
											cls:'x-btn portal_pos_btn x-btn-noicon',
											overCls :'portal_pos_btn_hover',
											listeners : {
												'click' : function (selectedData)
												{
													var orgViewComp = selectedData.ownerCt.ownerCt.ownerCt.items
																.itemAt(1).getInnercmp();
													selectedData.ownerCt.ownerCt.ownerCt.nodehighltedFlag = orgViewComp
																.setFocusOnNode(selectedData.ownerCt.ownerCt.ownerCt.nodehighltedFlag,false);
													selectedData.ownerCt.ownerCt.ownerCt
																.setTextMsgOfNavigation(selectedData);
												}
											}
										},
										{
											xtype : 'label',
											itemId : 'LABEL_ORG_COUNT_MSG',
											text : '1 of 10',
											hidden : true
										},
										{
											xtype : 'button',
											text : '&gt;',
											itemId : 'BTN_ORG_NEXT',
											cls:'x-btn portal_pos_btn x-btn-noicon',
											overCls :'portal_pos_btn_hover',
											hidden : true,
											listeners : {
												'click' : function (selectedData)
												{
													var orgViewComp = selectedData.ownerCt.ownerCt.ownerCt.items
																.itemAt(1).getInnercmp();
													selectedData.ownerCt.ownerCt.ownerCt.nodehighltedFlag = orgViewComp
																.setFocusOnNode(selectedData.ownerCt.ownerCt.ownerCt.nodehighltedFlag,true);
													selectedData.ownerCt.ownerCt.ownerCt
																.setTextMsgOfNavigation(selectedData);
												}
											}
										} ];
			return cv;
		},
		setTextMsgOfNavigation: function(selectedData){
			var lblMsg=selectedData.ownerCt.find('itemId','LABEL_ORG_COUNT_MSG')[0];
			var msg= (selectedData.ownerCt.ownerCt.ownerCt.nodehighltedFlag+1) + 'of ' +selectedData.ownerCt.ownerCt.ownerCt.totalHighlightedNode;
			lblMsg.setText(msg);
		},
		// this api show and hide the navigation panel, action is true means show and action is false means hide
		showHideNavigation : function(selectedData,action){

			var prevBtn=selectedData.ownerCt.find('itemId','BTN_ORG_PREV')[0];
			var nextvBtn=selectedData.ownerCt.find('itemId','BTN_ORG_NEXT')[0];
			var lblMsg=selectedData.ownerCt.find('itemId','LABEL_ORG_COUNT_MSG')[0];
		
			if(action){
				prevBtn.show();
				nextvBtn.show();
				lblMsg.show();
			}
			else{
				prevBtn.hide();
				nextvBtn.hide();
				lblMsg.hide();
				selectedData.ownerCt.find('itemId','ORG_SEARCH_TXTBOX')[0].setValue('');
			}
		
		
		},
		setHighlightedNode: function(selectedData){
			 
			var val=selectedData.ownerCt.find('itemId','ORG_SEARCH_TXTBOX')[0].getValue();
        	var orgViewComp=selectedData.ownerCt.ownerCt.ownerCt.items.itemAt(1).getInnercmp();
        	if(!cbx.isEmpty(val)){
        		return orgViewComp.setHighlightedNode(this.searchingKeys,val);
        	}
        	else{
        		var err=new iportal.Dialog({
        			dialogType:'ERROR',
        			title : "Warning!", 
    				message : 'Select Any Value',
        			okHandler:function(){
        				err.close();		
        			}
        		}).show();
        	
        	}
    	
		},
		updateHeight: function(height){
			this.setHeight(height);
			var obj= this.getComponent(1);
			if(this.searchingKeys){
				height=height-27;
			}
			else{
				height=height-5;
				}
			this.getComponent(1).setHeight(height);
		},
		isOrgAvailable :function(){			
			
	    	return this.isOrgAvail;
	    },
	    setOrgAvailable:function(){
	    	this.isOrgAvail = true;
	    },
	    getChartcmpId : function(){
			var cid = this.items.itemAt(1).getComponentId();	
			return cid;
		},
		
		getFlowDetail: function(id){
			var cmp = this.items.itemAt(1).getInnercmp();	
			var nd = cmp.getCompleteNode(cmp.getNumericId(id));
			var instr = nd[0].instDetail;
			return instr;
		}/*,
		afterRender: function(){
			this.draw();			
		},*/
		,reloadOrgData : function(){
								if (this.searchingKeys)
								{
									this.showHideNavigation(this.find('itemId', 'ORG_SEARCH_PANEL')[0].getTopToolbar()
												.find('itemId', 'BTN_ORG_NEXT')[0], false);
								}
								this.draw(this.viewConf.VIEW_MD.VIEW_ID, this.orgViewId);
			}
		,draw:function(viewId,widgetId,strId){
			var myParams ={};		
			myParams['INPUT_ACTION'] = 'INIT_DATA_ACTION';
			myParams['PAGE_CODE_TYPE'] = 'VDF_CODE';
			myParams['INPUT_PRODUCT'] = 'CANVAS';
			myParams['INPUT_SUB_PRODUCT'] = 'CANVAS';
			myParams['PRODUCT_NAME'] = 'CANVAS';
			myParams['INPUT_FUNCTION_CODE'] = 'VSBLTY';
			myParams['VIEW_ID'] = viewId;
			myParams['WIDGET_ID'] = widgetId;
			myParams['LAYOUT_ID']=iportal.workspace.metadata.getCurrentLayoutId();
			myParams['WORKSPACE_ID'] = iportal.workspace.metadata.getCurrentWorkspaceId();
			
			
			
			var rb = CRB.getFWBundle();
			var that=this;
			var loadMask = new Ext.LoadMask(Ext.getBody(),{msg:rb.LOADING_MSG});
		//	var loadMask = new Ext.LoadMask(that.ownerCt.ownerCt.ownerCt.ownerCt.el.dom,{msg:rb.LOADING_MSG})
			loadMask.show();
			var responseData='';
			Ext.Ajax.request({
				   url: iportal.jsutil.getController(),
			       method:'POST', 
			       timeout:300000,
			       params :myParams,
			       success: function(response,options){
			  							
			    	   				//that.setOrgAvailable(); // This has been moved inside the if condition   
									responseData = Ext.decode(response.responseText);
									if(that.items.itemAt(1)!=null && that.items.itemAt(1)!=''){
										that.items.itemAt(1).drawChart(responseData.response.value.ALL_RECORDS);
										that.setOrgAvailable();
									}
									if(that.items.itemAt(0)!=null && that.items.itemAt(0).items.length > 0){
	                                   	that.items.itemAt(0).items.itemAt(0).destroy();
									}
	
									if(that.items.itemAt(1)!=null && that.items.itemAt(1)!='' && responseData.ORGVIEW_CHART_LIST!=null && responseData.ORGVIEW_CHART_LIST!=''){
										//that.items.itemAt(0).add(that.items.itemAt(1).getLegend(responseData));
										that.setOrgAvailable(); 
	
									}
									/*else{
										that.isOrgAvail=false;+
									}*/
	
									 that.doLayout();
	
								//	 that.loadMask.hide();
	
								},
								failure: function(){
								//	that.loadMask.hide();
	
									var win = new iportal.Dialog({
										title:'MESSAGE',
										dialogType:'MESSAGE',
										message:CRB.getFWBundle()["ERR_SORRY_MSG_FOR_FAIL"],
										okHandler:function(){
											win.close();
										}								
									}).show();
								 }
			});		
				
		}

});


Ext.reg('iportal-chart-OrgView', iportal.chartcomponent.OrgView);