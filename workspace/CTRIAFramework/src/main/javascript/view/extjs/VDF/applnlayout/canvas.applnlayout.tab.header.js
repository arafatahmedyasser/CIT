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
cbx.ns('canvas.applnlayout.tab');

canvas.applnlayout.tab.header = Ext.extend(Ext.Panel,{
	initComponent:function(){
		var defaultConfig = {
			xtype:'panel',
			layout : 'column',
			cls : 'tabheaderpanel',
			layoutConfig : {
				columns : 3
			},
			listeners : {
				'render' : function (){
				}
			},
			items : [{
				columnWidth : 0.62,
				border : false,
				cls:'tablogo-col',
				//id : 'Intellect_id_logo',
				html : '<div class="tablogo"></div>'
			},{
				columnWidth : 0.20,
				border : false,
				cls : 'tabuserdetails-col',
				html : '<div class="tabuserdetails-con"><p class="tabusername">'+iportal.preferences.getLoggedInUserName()+'</p><p class="tablastlogin">'+iportal.preferences.getLastLoginDateTime()+'</p></div>'
			},{
				columnWidth : 0.18,
				border : false,
				cls:'tablogout-col',
				html : '<div class="tablogout-con"><a class="tablogout" title="'+CRB.getFWBundle()['LBL_LOGOUT']+'"  href="#" onclick="javascript:iportal.logoutUser();"><span class="tablogouttext">'+CRB.getFWBundle()['LBL_LOGOUT']+'</span></a></div>'
			}]
		};
		Ext.apply(this, defaultConfig);	
		canvas.applnlayout.tab.header.superclass.initComponent.call(this);
	}
});
	
CLCR.registerCmp({"COMPONENT":"tabheader","APPLICATION_FW" : "EXT-JS"},canvas.applnlayout.tab.header);
