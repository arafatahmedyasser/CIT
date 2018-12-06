/**
 * Copyright 2015. Intellect Design Arena Limited. All rights reserved. 
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
cbx.namespace('canvas.applnlayout.card');

canvas.applnlayout.card.header = Ext.extend(Ext.Panel,{
	collapsible : false,
	hidden : false,
	//renderTo : 'iportal_LOGO',
	initComponent : function(){
/*		var wgtDock = new Ext.Container({
			renderTo : 'widgetCatalogContainer1',
			cls : 'widgetCatalogContainer1'
		});
		 CCDM.getInstance().on('appdocked',function(dockItem){
		    	var iconArr = this.find("itemId", dockItem.itemId);
		    	if(iconArr!=null && iconArr[0] != null ){
		    		iconArr[0].show();
				}
		    	else {
		    		this.add(dockItem);
		    	}
		    	this.doLayout();
		    },wgtDock);
			CCDM.getInstance().on('appundocked',function(itemId){
		    	this.remove(itemId);
		    },wgtDock);
			CCDM.getInstance().on('removeall',function(){
		    	this.removeAll(true);
		    },wgtDock);*/
			
	var defaultConfig = {
	xtype:'panel',
	layout : 'column',
	cls : 'excardheaderpanel',
	height : 75,
	layoutConfig : {
		columns : 8
	},
	items : [{
		columnWidth : 0.15,
		border : false,
		cls:'cardlogo-con', 
		//id : 'Intellect_id_logo', // not used in CT 
		html : '<a href="./CT_Home.jsp"><div class="cardlogo"></div></a>'

	},{
		columnWidth : 0.48,
		id : 'wstitle', 
		border : false,
		cls : 'wstitlecolumn',  
		html : '<div class="workspacetitle">'+iportal.workspace.metadata.getCurrentWorkspaceTitle()+'</div>' 

	}/*,{
		columnWidth : 0.35,
		border : false,
		xtype : 'panel',
		html : '<div class="EXCARD-widgetcatalogue"  id="widgetCatalogContainer1"></div>',
		items : [
		wgtDock
		]
	}*/,{
		cls : 'cbxuserimage-wrap',
		xtype : 'cbx-userimage',
		URL:'./PictureUploadServlet?imgHandle=GET_USER_IMAGE&INPUT_ACTION=PICTURE_PROCESS_ACTION&INPUT_FUNCTION_CODE=VSBLTY&INPUT_SUB_PRODUCT=CUSER&PAGE_CODE_TYPE=PICTURE_PROCESS&PRODUCT_NAME=CUSER&timeout='+new Date(),
		columnWidth :0.05,
		width : '58',
		qtip:'User Image',
		height : '58'
	},{
		columnWidth : 0.18,
		border : false,
	//	id : 'Intellect_User_Details',// not used in CT 
		cls : 'carduserdetails', 
		html : '<div class="carduserdetails-con"><p class="cardusername">'+iportal.preferences.getLoggedInUserName()+'</p><p class="cardlastlogin">Last Logged In: '+iportal.preferences.getLastLoginDateTime()+'</p></div>' 
	},{
		columnWidth : 0.06,
		border : false,
		cls:'card-cust-pref',
		//id : 'Intellect_id_logo', // not used in CT
		html : '<div class="cardlsettings-con"><a class="cardsettings" title="Preferences" href="#" onclick="javascript:canvas.showPreferences();"></div>'
			
	},{
		columnWidth : 0.07,
		border : false,
		cls:'cardlogout-con',
		//id : 'Intellect_id_logo', // not used in CT 
		//html : '<div class="cardlogout"></div>'
		html : '<div class="cardlogout-con"><a class="cardlogout" title="'+CRB.getFWBundle()['LBL_LOGOUT']+'" href="#" onclick="javascript:iportal.logoutUser();"><span class="cardlogouttext">'+CRB.getFWBundle()['LBL_LOGOUT']+'</span></a></div>'

	}/*,{
		columnWidth : 0.30,
		border : false,
		xtype : 'panel',
		html : '<div class="EXCARD-widgetcatalogue"  id="widgetCatalogContainer2"></div>',
		items : [
		wgtDock2
		]
	}*/]
		};
		Ext.apply(this, defaultConfig);	
		canvas.applnlayout.card.header.superclass.initComponent.call(this);
	}
});
	

CLCR.registerCmp({"COMPONENT":"cardheader","APPLICATION_FW" : "EXT-JS"},canvas.applnlayout.card.header); 
canvas.showPreferences = function (){
	CBXDOWNLOADMGR.requestScripts(cbx.downloadProvider.getMergedArray(["FORM_CONTAINER","WSPACE_PREF_FORMS"]), function ()
	{
		var fm = new cbx.form.FormManager({
			formId : "UPDATE_PREF_FORM"
		});
		CBXFORMCONTAINER.getWindowByFormObj(fm, "UPDATE_PREF_FORM_CONTAINER", null);
	});
};
