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
 * iportal.view.OrgViewPanel
 */
 Ext.ns("iportal.view");
 iportal.view.OrgViewPanel =  Ext.extend(Ext.Panel, {
 	 extraParamsHandler : null,
	 initComponent: function(config){
	 	this.rb = CRB.getFWBundle();
	 	this.list = iportal.orgview.cashconview.listeners();
	 	var defaultConfig = {
			xtype:'panel',
			cls : 'ORGVIEW_PANEL',
			autoScroll:true,
			html:"<div id='chartApi'></div>",
			tbar:[this.createLegendBt()]
		};
	 	Ext.apply(this, defaultConfig);
	  	iportal.view.OrgViewPanel.superclass.initComponent.apply(this);
	 },
	 /**
	 * Intended to create Legend Button and return the same
	 */
	 createLegendBt : function(){
	 	return {
	 			id:'LEGENDBUTTON_ID',
				text:this.rb.LBL_CASHCONVIEW_SHOWLEGEND,
				listeners:{"click":this.list.showLegend,scope:this.list} 
	 	};
	 },
	 onRender : function(ct,position){
	 	iportal.view.OrgViewPanel.superclass.onRender.apply(this, arguments);
	 	this.list.retriveInitDataforOrgView();
	 },
	 onDestroy : function(ct,position){
	 	iportal.view.OrgViewPanel.superclass.onDestroy.apply(this, arguments);
	 	this.list.destroyOrgViewObjetcs();
	 }
 });
 Ext.reg('org-panel', iportal.view.OrgViewPanel);
 