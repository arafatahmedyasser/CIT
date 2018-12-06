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
cbx.namespace('canvas.applnlayout.excard');
var rb = CRB.getFWBundle();
var viewWidth = Ext.getBody().getViewSize().width;
var scrollPanelWidth = 450;
if (viewWidth > 800) {
	scrollPanelWidth = parseInt(viewWidth) - 515;
}
canvas.applnlayout.excard.header = Ext.extend(Ext.Panel,{
	collapsible : false,
	hidden : false,
	//renderTo : 'iportal_LOGO',
	initComponent : function(){
	var defaultConfig = {
	xtype:'panel',
	layout : 'column',
	cls : 'excardheaderpanel',
	height : 75,
	layoutConfig : {
		columns : 4
	},
	items : [{
			width : 190,
			id : 'user-info',
			border : false,
			cls : 'excarduserdetails',
			//contentEl : 'User_Details'
			html : '<div class="excarduserdetails-con"><p class="excardusername">'+iportal.preferences.getLoggedInUserName()+'</p></div><div class="excardlogout-con"><a class="excardlogout" href="#" title="'+CRB.getFWBundle()['LBL_LOGOUT']+'"  onclick="javascript:iportal.logoutUser();"><span class="excardlogouttext">'+CRB.getFWBundle()['LBL_LOGOUT']+'</span></a></div>'
		},{
			cls : 'cbxuserimage-wrap',
			xtype : 'cbx-userimage',
			URL:'./PictureUploadServlet?imgHandle=GET_USER_IMAGE&INPUT_ACTION=PICTURE_PROCESS_ACTION&INPUT_FUNCTION_CODE=VSBLTY&INPUT_SUB_PRODUCT=CUSER&PAGE_CODE_TYPE=PICTURE_PROCESS&PRODUCT_NAME=CUSER',
			width : 58,
			qtip:'User Image',
			height : 58
		},{

			xtype : 'panel',
			height : 75,
			layout : 'table',
			cls : 'excardheaderworkspace',
			layoutConfig : {
				columns : 1,
				align : 'center',
				pack : 'center',
				align : 'middle'
			},
			width : scrollPanelWidth,
			items : [{
				xtype : 'buttonscrollpanel',
				amountOfxScroll : 100,
				ButtonIndicator : false,
				width : scrollPanelWidth,
				height : 80,
				autoScroll : false,
				scrollCmp : [{
					xtype : 'excard-master-screen'
				}]
			}]
		
		},
		{
			width : 220,
			border : false,
			cls : 'excardlogo-con',
			style : 'float:right',
			height : 80,
			//html : '<div class="x-header-logo-wrap" ><div class="divider"></div><div class="intellect_logo"></div></div>'
			html : '<div class="excardlogo"></div>'

		}]
		};
		Ext.apply(this, defaultConfig);	
		canvas.applnlayout.excard.header.superclass.initComponent.call(this);
	}
});
	
//Ext.reg('excardHeader',canvas.applnlayout.excard.header);
CLCR.registerCmp({"COMPONENT":"excardheader","APPLICATION_FW" : "EXT-JS"},canvas.applnlayout.excard.header); 
