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

/**
 * @class cbx.appstore.Manager
 
 * @extends Ext.util.Observable
 * 
 * This class creates the Wrapper panel which is added has an item for the window.
 * Later it renders the Create/Update Panel recieved from cbx.appstore.Canvas into the wrapper panel after the successfull ajax call ( cbx.appstore.AjaxRepo )
 * Please note for the delete workspace currently we dont need pre-Required data . 
 * cbx.appstore.DataModel class is intialized in this class.
 * The class contains important methods they are 
 * 		1) constructor 					- The place where the wrapper panel is created and ajax call called if required.  
 * 		2) canvasCreator 				- This creates the panel from cbx.appstore.Canvas where the user can create/update the workspace.
 * 		3) canvasCreatorForDelete 		- This creates the panel for delelting the workspace.
 * 		4) getAppsView					- This returns the wrapper panel reference to the util class.
 * 		5) save/remove					- This calls the ajax call for saving new/existing and removing the workspace.
 * 		6) saveResponse/deleteResponse	- This is the successhandler for the ajax call for saving new/existing and removing the workspace.
 * The class contains important property they are
 * 		1) workspaceId					- The WorkspaceId of updating/deleting workspace. 
 * 		2) remove						- The Property is set to true to delete the workspace.
 * 		3) canvas						- The Canvas inside which contenet is rendered.
 * 		4) wrapperPanel					- The WrapperPanel inside which canvas is added as an item.
 * 		5) dataModel					- This holds the reference of the class cbx.appstore.DataModel
 * 		6) rb							- This holds the reference of COMMON - resource bundle
 *  
 */	



cbx.appstore.Manager = Ext.extend(Ext.util.Observable, {

	/**
	 * @param config - contains Worspaceid while updating/deleting the workspace and 
	 * 					also the property remove which differs the both update and deleting the workspace.
	 */
	
	constructor : function(config) {

		this.canvas = null; 
		
		this.rb = CRB.getFWBundle();
		
		var wrapperConfig = {
			autoScroll : false,
			border : false,
			frame : false,
			layout : 'anchor',
			cls : 'canvas-appstore',
			defaults : {
				anchor : '100%'
			}
		};
		
		this.wrapperPanel = new Ext.Panel(wrapperConfig);
		
		this.dataModel = new cbx.appstore.DataModel();
			
		
		if (!Ext.isEmpty(config) && !Ext.isEmpty(config.workspaceId)) {
			
			this.dataModel.setWorkspaceId(config.workspaceId);
		}
		
		
		
		
		if(!Ext.isEmpty(config) && !Ext.isEmpty(config.remove) && config.remove){
			
			this.canvasCreatorForDelete();
			
		}else{
			cbx.appstore.AjaxRepo.getAppstoreMetadata(this, this.canvasCreator, this);
		}
		
		
		cbx.appstore.Manager.superclass.constructor.call(this, config);

	},
	
	/**
	 * @param data - contain the prerequired data for opening window workspace creation 
	 * 					and also contains the existing workspace data while updating the workspace.
	 * @return - renders the the canvas for workspace creation/updation inside the wrapper panel
	 */
	
	canvasCreator : function(data) {
		
		
		this.dataModel.setModelData(data,true);
		
		var workspaceconf = {
			dataModel : this.dataModel,
			width : Ext.lib.Dom.getViewWidth()-5,
			height : Ext.lib.Dom.getViewHeight()-5,
			cls : 'canvas-appstore'
		};

		this.canvas = new cbx.appstore.Canvas(workspaceconf);
		
		this.wrapperPanel.add(this.canvas);
		
		this.wrapperPanel.doLayout();
		
		
	},
	/**
	 * @return - renders the the canvas for workspace deletion inside the wrapper panel 
	 */
	canvasCreatorForDelete:function(){
		
		this.canvas = new Ext.Panel({ 
			autoScroll:true,    
			width : 300,
			height : 100,
			html: this.rb.LBL_DELETE_MSG1+'<BR>'+this.rb.LBL_DELETE_MSG2											
		});
		
		this.wrapperPanel.add(this.canvas);
		this.wrapperPanel.doLayout();

	},
	/**
	 * @return - the wrapper panel 
	 */
	getAppsView : function() {
		return this.wrapperPanel;
	},
	/**
	 * @return - ajax callback for saving the workspace 
	 */
	save : function() {
		var saveInfo = this.canvas.getsaveInfo();
		cbx.appstore.AjaxRepo.save(saveInfo, this.saveResponse,this);
	},
	/**
	 * @return - ajax callback for deleting the workspace 
	 */
	
	remove: function() {
		
		cbx.appstore.AjaxRepo.remove(this, this.deleteResponse, this);
	},
	/**
	 * @param - the callback for the deleting the workspace 
	 */
	deleteResponse: function() {
		
		if("false" == data.success && "ERROR" == data.REPLY_TYPE){

			var errWin = new iportal.Dialog({
				dialogType : 'ERROR',
				title : this.rb.LBL_ERROR,
				message : data.ERR_MESS,
				okHandler : function(){
					errWin.close();
				}
			});
			errWin.show();


		}
		
		else{
		
		var success = new iportal.Dialog({
			dialogType : 'USERDEFINED',
			dialogStyle : 'OK',
			message : this.rb.LBL_DELETE_MSG_FIN,
			closeIconRequired : true,
			okHandler : function(){
				success.close();
				iportal.application_refresh(); 
			},
			title : this.rb.LBL_CONFIRMATION
		});
		success.show();	
		
		}
		
		
	},
	
	/**
	 * @param - the callback for the Saving the workspace 
	 */
	
	saveResponse: function(data) {
		


		if("false" == data.success && "ERROR" == data.REPLY_TYPE){

			var errWin = new iportal.Dialog({
				dialogType : 'ERROR',
				title : this.rb.LBL_ERROR,
				message : data.ERR_MESS,
				okHandler : function(){
					errWin.close();
				}
			});
			errWin.show();


		} 
		
		
		else if(!Ext.isEmpty(data.response) && !Ext.isEmpty(data.response.VALIDATION_ERROR)){
			
			var errWin = new iportal.Dialog({
				dialogType : 'ERROR',
				title : this.rb.LBL_ERROR,
				message : data.response.VALIDATION_ERROR[0],
				okHandler : function(){
					errWin.close();
				}
			});
			errWin.show();
		
			
		}
		
		else{


			var success = new iportal.Dialog({
				dialogType : 'USERDEFINED',
				dialogStyle : 'OK',
				message : this.rb.LBL_CREATE_UPDATE_MSG_FIN,
				closeIconRequired : true,
				okHandler : function(){
					success.close();
					iportal.application_refresh(); 
				},
				title : this.rb.LBL_CONFIRMATION
			});
			success.show();	
		}
	
		
		
		
	}

});