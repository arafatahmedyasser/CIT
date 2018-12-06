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



/**

 * This class is intended to render contents to the header region of the retail application layout.

 */





Ext.namespace('cbx.Menulayout');

cbx.Menulayout.header = function (){

	var rb = CRB.getFWBundle();

	var viewWidth = Ext.getBody().getViewSize().width;

	var scrollPanelWidth = 450;

	if (viewWidth > 800) {

		scrollPanelWidth = parseInt(viewWidth) - 515;



	}

	//Added for Header Menu
	/*
	var btnHandler = function(btn) {
        btn.el.frame();	
    };
    */
	
	var header = new iportal.Panel({

					collapsible : false,

					renderTo : 'iportal_LOGO',

					layout : 'column',

					cls : 'topheaderpanel',

					height : 75,

					layoutConfig : {

						columns : 4

					},

					items : [{

								xtype : 'button',								
		
								border : false,
		
								columnWidth : 0.03,
		
								align : 'right',
								
								cls : 'noborder-icon-text cbx-header-menu',
										
								style : 'float:left',
								
								handler : function (btn,evt){
									var rb = CRB.getFWBundle();
									var workspaces = iportal.workspace.metadata.getWorkspaces();
									var wsTitleArray = [];
									var menu = new Ext.menu.Menu({
										items : wsTitleArray,
										listeners :{
										'click' : function(index) { 
											cbx.AppContainerUtil.goToWorkspace(arguments[1].itemId);
										
											}
										}
									});
									for(var i=0;i<workspaces.length;i++){
										if(workspaces[i].WORKSPACE_ID!=="RETAIL_HOME"){
											
										//wsTitleArray[i]= rb[workspaces[i].WORKSPACE_DISPLAY_NM]?rb[workspaces[i].WORKSPACE_DISPLAY_NM]:workspaces[i].WORKSPACE_DISPLAY_NM;
											menu.add({
												itemId : workspaces[i].WORKSPACE_ID,
												text:CRB.getBundleValue(wsArr[index].BUNDLE_KEY,workspaces[i].WORKSPACE_DISPLAY_NM) == undefined ? workspaces[i].WORKSPACE_DISPLAY_NM
														: CRB.getBundleValue(wsArr[index].BUNDLE_KEY,workspaces[i].WORKSPACE_DISPLAY_NM)
											});
										}
									}
									menu.showAt(evt.getXY());
								},							
		
								iconCls : 'cbx-headermenu'

							},{

								width : 220,
		
								border : false,
		
								cls : 'excard-logo-wrap',
		
								style : 'float:left',
		
								height : 80,
		
								html : '<div class="x-header-logo-wrap" ><div class="intellect_logo"></div></div>'



							},{

								width : 280,

								id : 'user-info',

								border : false,

								cls : 'user-info-panel',

								contentEl : 'User_Details'

							}, {

								xtype : 'panel',

								border : false,

								columnWidth : 0.15,

								align : 'right',

								style : 'float:right',

								contentEl : 'footer_Items',

								cls : 'intellect_signoff'

							},{

								xtype : 'button',								

								border : false,

								columnWidth : 0.03,

								align : 'right',

								style : 'float:right',
								
								handler : function(){
									cbx.AppContainerUtil.goToWorkspace("RETAIL_HOME");
								},
								
								cls : 'noborder-icon-text cbx-home',
								
								iconCls : 'intellect_home'

							}]

				});

};



// registering this region handler

//CALCR.registerRegionHandler('MENULAYOUT', 'HEADER', cbx.Menulayout.header);
CLCR.registerCmp({"COMPONENT":"APPLICATION_HEADER","LAYOUT":"MENULAYOUT"},cbx.Menulayout.header);








