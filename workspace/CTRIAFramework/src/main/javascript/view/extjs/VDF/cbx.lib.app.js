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
* This class contains the lib specific ListView confined to the widget / app.
*/
cbx.lib.ListView= Class(cbx.core.Component,{
/*
* Initializes the component.
*/
initialize:function(){

var me=this;
	this.rb={};
	   
	   
	   var metadata={"AUTHORIZER":[{"DATA_ONE":"Data 1","DATA_TWO":"Data 2", "DATA_THREE":"Data 3"},{"DATA_ONE":"Data 1","DATA_TWO":"Data 2", "DATA_THREE":"Data 3"},{"DATA_ONE":"Data 1","DATA_TWO":"Data 2", "DATA_THREE":"Data 3"}
									]
					}
					
   
	   var approver_data = new Ext.data.JsonStore({
                    data: metadata,
                  	root: "AUTHORIZER",
                  fields: [ "DATA_ONE", "DATA_TWO", "DATA_THREE" ]
                });
				
				
		var grid_approver = new Ext.grid.GridPanel({
        store: approver_data,
		frame:true,
		border:true,
		title:this.WIDGET_ID,
	   autoWidth:true,
        columns: [
            {header: 'DATA_ONE',  sortable: true, dataIndex: 'DATA_ONE'},
            {header: 'DATA_TWO',  sortable: true, dataIndex: 'DATA_TWO'},
			{header: 'DATA_THREE',   sortable: true,  dataIndex: 'DATA_THREE'}
             ],
         height:100,
		 onDestroy:function(){
			me.destroy();
		}
	  }); 
	
	    this.addItem(grid_approver);
}
});
//CLCR.registerCmp({'COMP_TYPE':'APP', 'VIEW_TYPE':'ADS'}, cbx.lib.ListView);


/*
* This class contains the lib specific ListView confined to the widget / app.
*/
cbx.lib.FormView= Class(cbx.core.Component,{
/*
* Initializes the component.
*/
initialize:function(){

	var me=this;
	this.rb={};
	   
	   	var fm = new cbx.form.FormManager({
			formId : "FORM_TEST_CORE",
			mode : 'edit',
			// mode : {global:cons.EDIT_MODE, 'TEST_ADD_FORM':cons.VIEW_MODE},
			modelData : {
				MAIL_TO : "abc@intellectdesign.com",
				
				MAIL_BCC : "pqr@intellectdesign.com"
			}
		});	
		
		this.addItem(fm.getFormView());
	  
}
});
CLCR.registerCmp({'COMP_TYPE':'APP', 'VIEW_TYPE':'FORM'}, cbx.lib.FormView);


/*
* This class contains the lib specific ListView confined to the widget / app.
*/
cbx.lib.CbxView= Class(cbx.core.Component,{
/*
* Initializes the component.
*/
initialize:function(){
	var me=this;
	var widgetId=this.WIDGET_ID;
	var config = {
			'WIDGET_ID' : widgetId,
			isClosed : false,
			isParentPortlet : true,
			isLoadingToolsInside : true,
			height : 300 //cApp.findParentByType('portlet').getHeight()

		};
	
	var widget =iportal.jsutil.initiateWidget(config);
	//var widget = new iportal.widget.AccountSummary();
	if(widget){
	var multiView=widget.mv;
	
	var widgetPanel = new Ext.Panel({
		autoHeight:true,
		autoWidth:true,
		draggable:true,
		title:"Widget - "+this.WIDGET_ID,
		border : true,
		frame : false,
		//height: 400,
		//layout:'fit',
		itemId: this.WIDGET_ID,
		items:[multiView],
		tools: [{
			id : 'pin',
			qtip : 'More..',
			hidden : false,
			handler : function(event, toolEl, panel, tc) {
					var multiView = panel.getComponent(0);
					if (multiView.getToolsMenuItems) {
						var menu = multiView.getToolsMenuItems();
						if (menu) {
							menu.show(this.id);
						}
					}
				}
			}
			],
		onDestroy:function(){
				me.destroy();
			}
		});
	
	me.addItem(widgetPanel);
	}
}
});
CLCR.registerCmp({'COMP_TYPE':'APP', 'VIEW_TYPE':'CLASSIC_GRID'}, cbx.lib.CbxView);
CLCR.registerCmp({'COMP_TYPE':'APP', 'VIEW_TYPE':'LIST'}, cbx.lib.CbxView);
CLCR.registerCmp({'COMP_TYPE':'APP', 'VIEW_TYPE':'GROUP'}, cbx.lib.CbxView);
CLCR.registerCmp({'COMP_TYPE':'APP', 'VIEW_TYPE':'TEXT'}, cbx.lib.CbxView);
CLCR.registerCmp({'COMP_TYPE':'APP', 'VIEW_TYPE':'ADS'}, cbx.lib.CbxView);
CLCR.registerCmp({'COMP_TYPE':'APP', 'VIEW_TYPE':'PAGING'}, cbx.lib.CbxView);
CLCR.registerCmp({'COMP_TYPE':'APP', 'VIEW_TYPE':'GROUP'}, cbx.lib.CbxView);
CLCR.registerCmp({'COMP_TYPE':'APP', 'VIEW_TYPE':'CALENDAR'}, cbx.lib.CbxView);
CLCR.registerCmp({'COMP_TYPE':'APP', 'VIEW_TYPE':'ADVGROUP'}, cbx.lib.CbxView);
CLCR.registerCmp({'COMP_TYPE':'APP', 'VIEW_TYPE':'CHART'}, cbx.lib.CbxView);
CLCR.registerCmp({'COMP_TYPE':'APP', 'VIEW_TYPE':'ADS'}, cbx.lib.CbxView);
CLCR.registerCmp({'COMP_TYPE':'APP', 'VIEW_TYPE':'IFRAME'}, cbx.lib.CbxView);
CLCR.registerCmp({'COMP_TYPE':'APP', 'VIEW_TYPE':'EMPTY'}, cbx.lib.CbxView);
CLCR.registerCmp({'COMP_TYPE':'APP', 'VIEW_TYPE':'APP'}, cbx.lib.CbxView);
CLCR.registerCmp({'COMP_TYPE':'APP', 'VIEW_TYPE':'PROPERTY'}, cbx.lib.CbxView);
CLCR.registerCmp({'COMP_TYPE':'APP', 'VIEW_TYPE':'TREE'}, cbx.lib.CbxView);
CLCR.registerCmp({'COMP_TYPE':'APP', 'VIEW_TYPE':'ORG'}, cbx.lib.CbxView);


