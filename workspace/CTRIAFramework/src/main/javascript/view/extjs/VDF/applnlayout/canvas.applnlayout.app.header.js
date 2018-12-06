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

 */
/**
 * DEPLOY_MODULE_ID:  <Check with your lead for correct value>
 */
cbx.ns('canvas.applnlayout.app');
canvas.applnlayout.app.header = Ext.extend(Ext.Container,{
	initComponent : function(){
		/*var header = new iportal.Panel({
			collapsible : false,
			layout : 'column',
			cls : 'appheaderpanel',
			layoutConfig : {
				columns : 4
			},*/
			var defaultConfig = {
						xtype:'panel',
						layout : 'column',
						cls : 'excardheaderpanel',
						height : 75,
						layoutConfig : {
							columns : 8
						},
			items : [{
				columnWidth : 0.38,
				id : 'wstitle',
				border : false,
				cls : 'appworkspacetitle-col', 
				html : '<div class="workspacetitle">'+iportal.workspace.metadata.getCurrentWorkspaceTitle()+'</div>'
			},{	
				columnWidth : 0.30,
				border : false,
				//id : 'Intellect_User_Details',// not used in CT
				cls : 'appuserdetails-col',
				html : '<div class="appuserdetails-con"><p class="appusername">'+iportal.preferences.getLoggedInUserName()+'</p><p class="applastlogin">'+iportal.preferences.getLastLoginDateTime()+'</p></div>'
			},{
				columnWidth : 0.10,
				border : false,
				cls : 'applogout-col',
				html : '<div class="applogout-con"><a class="applogout" title="Logout"  href="#" onclick="javascript:iportal.logoutUser();">Logout</a></div>'
			},{
				columnWidth : 0.20,
				border : false,
				cls:'applogo-col', 
				html : '<div class="applogo-con"></div>'
	
			}]
			
			};
			Ext.apply(this, defaultConfig);	
			canvas.applnlayout.app.header.superclass.initComponent.call(this);
		
	
	}});//registering this region handler  
//CALCR.registerRegionHandler('APP', 'HEADER', cbx.APPlayout.header);
CLCR.registerCmp({"COMPONENT":"appheader","APPLICATION_FW" : "EXT-JS"},canvas.applnlayout.app.header);