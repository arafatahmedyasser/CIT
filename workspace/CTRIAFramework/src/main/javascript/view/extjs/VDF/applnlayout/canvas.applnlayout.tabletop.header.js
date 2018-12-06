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
cbx.namespace('canvas.applnlayout.tabletop');
canvas.applnlayout.tabletop.header =Ext.extend(Ext.Panel,{
	initComponent : function(){
		var defaultConfig = {
					xtype:'panel',
					layout : 'column',
					cls : 'excardheaderpanel',
					height : 75,
					layoutConfig : {
						columns : 3
					},
					items : [
					 		
					 		{	
					 			columnWidth : 0.30,
					 			border : false,
					 			cls:'tabletoplogo-col', 
					 			html : '<div class="tabletoplogo"></div>'
					 	
					 		}, {
					 			columnWidth : 0.40,
					 			border : false,
					 			cls : 'tabletopuserdetails-col',
					 			html : '<div class="tabletopuserdetails-con"><p class="tabletopusername">'+iportal.preferences.getLoggedInUserName()+'</p><p class="tabletoplastlogin">'+iportal.preferences.getLastLoginDateTime()+'</p></div>'
					 		}, {
					 			columnWidth : 0.29,
					 			border : false,
					 			cls:'tabletoplogout-col',
					 			html : '<div class="tabletoplogout-con"><a class="tabletoplogout" href="#" title="'+CRB.getFWBundle()['LBL_LOGOUT']+'"  onclick="javascript:iportal.logoutUser();"><span class="tabletoplogouttext">'+CRB.getFWBundle()['LBL_LOGOUT']+'</span></a></div>'

					 		}]
						};
		Ext.apply(this, defaultConfig);	
		canvas.applnlayout.tabletop.header.superclass.initComponent.call(this);
	}
});
//registering this region handler  
CLCR.registerCmp({"COMPONENT":"tabletopheader","APPLICATION_FW" : "EXT-JS"},canvas.applnlayout.tabletop.header);

