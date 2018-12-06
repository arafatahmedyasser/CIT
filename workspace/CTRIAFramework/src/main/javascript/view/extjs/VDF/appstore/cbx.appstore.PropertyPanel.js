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

Ext.ns('cbx.appstore');

cbx.appstore.PropertyPanel = Ext.extend(Ext.util.Observable, {
	
	constructor : function(config) {
		
		this.dataModel	=  config.dataModel;
		
		this.rb = CRB.getFWBundle();
		
		this.workarea    = new Ext.Panel({
			autoScroll : true,
			frame:true,
			autoWidth:true,
			padding:8,
			height:config.height,
			layout:'form',
			labelAlign:'top',
			items:[{xtype:'textfield',labelSeparator:'',fieldLabel :this.rb.LBL_WS_NAME+'<span class = \'mandatory\'">*</span>',width:200,maxLength :20}],
			holder:this
		});
	},
	/**
	 * @return - the workarea of the Property panel
	 */
	getPanel:function(){
		
		if(this.dataModel.isUpdate()){
			
			this.workarea.getComponent(0).setValue(this.dataModel.getSelectedWorkspaceDisplayName());
		}
				
		return this.workarea;
		
	},
	/**
	 * @return - the workspace name
	 */
	getWorkspaceName:function(){
		
		return this.workarea.getComponent(0).getValue();
		
	},
	/**
	 * empty method used for intializing any communication to avoid errors.
	 * 
	 */
	dummyMethod :function(){
		
	}

});