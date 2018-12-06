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
Ext.namespace('cbx.headerlogo');

cbx.headerlogo.cbxCorpImage=function(config) {
	 this.width=config.width || '80px';
	 this.height=config.height || '80px';
	 this.URL=config.URL || '';
	 
	 cbx.headerlogo.cbxCorpImage.superclass.constructor.call(this, config);
};
Ext.extend(cbx.headerlogo.cbxCorpImage,Ext.BoxComponent, {
 	initComponent : function() {
      // this.autoEl={tag: 'img',cls:'user-image', src: 'GetUserImage.jsp',
		// id: 'picedit',width:this.width, height:this.height},

	    this.autoEl = { 
	 cn : [{tag: 'div',cls: iportal.preferences.getLayout().toLowerCase()+'logo', src: this.URL,  id: 'hlogoclick', width:this.width, height:this.height}]
};
	    
 		cbx.headerlogo.cbxCorpImage.superclass.initComponent.apply(
 					this, arguments);
 	   this.on('render',this.logoHandler);
 	},
	afterRender:function(ct,position){									
	cbx.headerlogo.cbxCorpImage.superclass.afterRender.call(this, ct,
			position);	
			
	},
	 	/**
	    *  Handler defined for handling the click event on the home logo.
	    */
	logoHandler : function(config){
		var that=this;
		if(Ext.get('hlogoclick')){
      		 Ext.get('hlogoclick').on('click',function() {
      			 // 'clickheaderlogo' is used to register handler and handle the application logic.
      			var obj = CGH.getHandler('clickheaderlogo',config);
      			
      			 if(cbx.isObject(obj) || cbx.isFunction(obj)){
      				 /// Handled based on the requirement in future.
      				 return;
      			 }
      			 else if(!cbx.isDefined(obj) || obj == null || obj == true || cbx.isEmpty(obj)){		
      				window.location = iportal.workspace.metadata.getContextRoot()+iportal.systempreferences.getHomePageURI();
      				
      			 }
      			 else if(obj == false){
      				 // 
      				return;
      			 }
      			 
			   });
      		}
	}
 });
Ext.reg('cbx-corpimage', cbx.headerlogo.cbxCorpImage);

 cbx.headerlogo.cbxUserImage=function(config) {
	 this.width=config.width || '80px';
	 this.height=config.height || '80px';
	 this.URL=config.URL || '';
 	cbx.headerlogo.cbxUserImage.superclass.constructor.call(this, config);
 };
 Ext.extend(cbx.headerlogo.cbxUserImage,Ext.BoxComponent, {
  	initComponent : function() {
       // this.autoEl={tag: 'img',cls:'user-image', src: 'GetUserImage.jsp',
		// id: 'picedit',width:this.width, height:this.height},
	    this.autoEl = { 
    cn : [{tag: 'img',cls:'user-image', src: this.URL, id: 'picedit',width:this.width, height:this.height}]
};
  		cbx.headerlogo.cbxUserImage.superclass.initComponent.apply(
  					this, arguments);
       this.on('render',this.imgClick);
  	},
	afterRender:function(ct,position){									
	cbx.headerlogo.cbxUserImage.superclass.afterRender.call(this, ct,
			position);	
			if(Ext.get('picedit') && this.id){
/*
 * This will support in providing the last login details in the tool tip.
 */
var tip= new Ext.ToolTip({
     target: Ext.get('uesrFrameEdit'),
      //cls:'user-callout',
      //html:'<div>'+iportal.preferences.getLastLoginDateTime()+'</div>',
      html:'<div> Change Profile Picture</div>',
      autoDestroy:true,
      //autoHide:false,
      anchor:'top',
     shadow:false
  });
	var that=this;
  		if(Ext.get('uesrFrameEdit')){
  		 Ext.get('uesrFrameEdit').on('click',function() {
  			that.editUploadPicture();
		      });
  	   Ext.get('uesrFrameEdit').on('mouseover',function() {
  		   if(Ext.get('User_Details')){
          if(!tip.isVisible()){
        	  //tip.show();
          }
  	   }
  		   });
  		}
}
	},
	/*
	 * 
	 * On the Image click,This functionality will provide the pop-up for the
	 * 
	 * image upload.
	 * 
	 */
	imgClick:function(){
		Ext.DomHelper.append(this.id, {
		    tag: 'div', id:'uesrFrameEdit',cls:'user-frame',style:'position:absolute'
		});
		var that=this;
		if(Ext.get('picedit')){
      		 Ext.get('picedit').on('click',function() {
      			that.editUploadPicture();
			      });
      		}
	},
  	 showInfoWindow:function(params) {
  		this.wndMsg = new cbx.window.MessageWindow({
  			title: params.title || 'Message',
  			html: params.msg || '',
  			// origin: { offX: params.offX || -5, offY: params.offY || -5 },
  			autoHeight: true,
  			iconCls: 'icon-info',
  			help: false,
  			origin: {
  	                    pos: "t-t",// position to align to (see {@link
									// Ext.Element#alignTo} for more details
									// defaults to "br-br").
  	                    offX: -20, // amount to offset horizontally (-20 by
									// default)
  	                    offY: -20, // amount to offset vertically (-20 by
									// default)
  	                    spaY: 10   // vertical spacing between adjacent
									// messages
  	                },
  			showFx: { align: 't'},
  	                    hideFx: {
  	                        delay: 1000,
  	                        duration: 0.5,
  	                        useProxy: false, // default is false to hide
												// window instead
  	                        mode: 'custom',// null,'standard','custom',or
											// default ghost
  	                        // use callback to control the hide Fx
  	                        callback: function (obj, el, fx) {
  	                            el.slideOut("t", {
  	                    			// duration: fx.duration || 1,
  	                    			easing: 'easeOut',
  	                    		    duration: 0.5,
  	                    		    remove: false,
  	                    		    useDisplay: false,
  	                                scope: obj,
  	                                callback: obj.afterHide
  	                    		});
  	                        }
  	                    }
  		});
  		this.wndMsg.show(Ext.getDoc());
  	},
  	/*
	 * 
	 * This function provide user to update the already uploaded image.
	 * 
	 */
  	editUploadPicture:function(){
			var that=this;
  		this.wndDetailedPictureEdit = null;
  		this.paramObj = {};
  		this.pictUploadForm=null;
  		this.paramObj["_dinsess"] = '';
  		this.paramObj["__PIGGYBACKREQUEST"] = 'N';
  		this.paramObj["headers"] = "{'Content-type' :'multipart/form-data'}";
  		this.paramObj[iportal.systempreferences.getCSRFKeyName()] = iportal.systempreferences.getCSRFUniqueId();
  		this.pictUploadForm = new Ext.FormPanel(
  					{
  						autoHeight : true,
  						frame : true,
  						fileUpload : true,
  						headers : {
  							'Content-type' : 'multipart/form-data'
  						},
  						buttonAlign : 'center',
  						items : [ {
  							bodyStyle : {
  								margin : '0px 0px 0px 0px'
  							},
  							items : [ {
  								layout : 'column',
  								items : [ {
  									layout : 'form',
  									columnWidth : .9,
  									items : [
  									{
  										xtype : 'fieldset',
  										autoWidth:true,
  										autoHeight : true,
  										title : 'Upload Picture',
  										layout : 'column',
  										defaultType : 'textfield',
  										items : [ {
  											xtype : 'textfield',
  											fieldLabel : 'JPG | GIF only',
  											id : 'newPicedit',
  											name : 'newPicedit',
  											inputType : 'file',
  											msgTarget:'side'
  										} ]
  									} ]
  								} ]
  							} ]
  						} ],
  						buttons : [
  								{
  									text : 'Upload Picture',
  									cls:'portal_pos_btn',
  									handler : function (){
  										var theForm = that.pictUploadForm.getForm();
  										if (Ext.getCmp('newPicedit').getValue() == ""
  													|| Ext.getCmp('newPicedit').getValue() == null) {
  											Ext.getCmp('newPicedit').markInvalid("Please upload image file");
  											Ext.getCmp('newPicedit').focus();
  											return false;
  										}
  									if (Ext.getCmp('newPicedit').getValue() != ""
  													&& Ext.getCmp('newPicedit').getValue() != null) {
  											var imagefile = Ext.getCmp('newPicedit').getValue().substring(
  														Ext.getCmp('newPicedit').getValue().lastIndexOf(".") + 1,
  														Ext.getCmp('newPicedit').getValue().length);
  											if (imagefile && imagefile.toLowerCase() != "jpg" && imagefile.toLowerCase() != "jpeg"
  														&& imagefile.toLowerCase() != "gif" && imagefile != "JPG"
  														&& imagefile != "GIF" && imagefile.toLowerCase() != "bmp" && imagefile.toLowerCase() != "png") {
  												Ext.getCmp('newPicedit').markInvalid(
  															"Invalid file extension only jpg|gif|png|bmp image supported");
  												var err_Dialog = new iportal.Dialog({
  													dialogType : 'ERROR',
  													title : "Error", 
  													message : "Invalid file extension only jpg|gif|png|bmp image supported",
  													okHandler : function (){
  														err_Dialog.close();
  													}
  												});
  												err_Dialog.show();
  												Ext.getCmp('newPicedit').markInvalid(
													"Invalid file extension only jpg|gif|png|bmp image supported");
  												Ext.getCmp('newPicedit').focus();
  												return false;
  											}
  										}
  										Ext.Ajax.request({
  											method : 'POST',
  											params : that.paramObj,
  											form : that.pictUploadForm.getForm().getEl().dom,
  											url : './PictureUploadServlet?imgHandle=STORE_USER_IMAGE&INPUT_ACTION=PICTURE_PROCESS_ACTION&INPUT_FUNCTION_CODE=VSBLTY&INPUT_SUB_PRODUCT=CUSER&PAGE_CODE_TYPE=PICTURE_PROCESS&PRODUCT_NAME=CUSER&timeout='+new Date(),													 
  											// con.URL,
  											success : function( res, req) {
  												if(res.responseText)
  												{
  												var jsonDataSuccess = Ext.decode(res.responseText);
  												if(jsonDataSuccess.data.response){
  												that.showInfoWindow({title:'Update', msg:jsonDataSuccess.data.response});
  												}else{
  												that.showInfoWindow({title:'Update', msg:'Picture Upated Succesfully'});
  												}
  												Ext.getDom('picedit').src = "./PictureUploadServlet?imgHandle=GET_USER_IMAGE&INPUT_ACTION=PICTURE_PROCESS_ACTION&INPUT_FUNCTION_CODE=VSBLTY&INPUT_SUB_PRODUCT=CUSER&PAGE_CODE_TYPE=PICTURE_PROCESS&PRODUCT_NAME=CUSER&timeout="+new Date();
  												that.pictUploadForm.getForm().reset();
  												that.wndDetailedPictureEdit.hide();
  												if (that.wndDetailedPictureEdit != null) {
  													Ext.get('editFormPictureWnd').remove();
  													that.wndDetailedPictureEdit = null;
  												}	
  												}
  											},
  											failure : function(res, req) {
  												if(res.responseText)
  												{
  												var jsonDataFailure = Ext.decode(res.responseText);
  												if(jsonDataFailure.data.response){
  												that.showInfoWindow({title:'Update', msg:jsonDataFailure.data.response});
  												}else{
  												that.showInfoWindow({title:'Update', msg:'Picture Not Upated'});
  												}
  												that.pictUploadForm.el.unmask();
  												that.pictUploadForm.getForm().reset();
  												that.wndDetailedPictureEdit.hide();
  												if (that.wndDetailedPictureEdit != null) {
  													Ext.get('editFormPictureWnd').remove();
  													that.wndDetailedPictureEdit = null;
  												}
  											}
  											}
  										});								
  									}
  								}, {
  									text : 'Cancel',
  									cls:'portal_neg_btn',
  									handler : function (){
  										that.wndDetailedPictureEdit.hide();
  										that.pictUploadForm.getForm().reset();
  										if (that.wndDetailedPictureEdit != null) {
  											Ext.get('editFormPictureWnd').remove();
  											that.wndDetailedPictureEdit = null;
  										}
  									}
  								} ]
  					});
  		if (that.wndDetailedPictureEdit == null) {
  			that.wndDetailedPictureEdit = new Ext.Window({
  				width : 300,
  				title : 'Change Picture',
  				id : 'editFormPictureWnd',
  				autoHeight : true,
  				// x : 500,
  				//x:Ext.fly('picedit').getX()+150,
  				//y : 40,
  				animateTarget:Ext.get('picedit'),
  				plain : true,
  				border : false,
  				resizable : false,
  				closeAction : 'close',
  				closable : true,
  				'close' : function (){
  					that.wndDetailedPictureEdit.hide();
  					if(that.wndDetailedPictureEdit!=null){
  		    			Ext.get('editFormPictureWnd').remove();
  		    			that.wndDetailedPictureEdit = null;
  					}
  				},
  				modal : true,
  				items : [ that.pictUploadForm ]
  			});
  		}
  		// alert(Ext.get('picedit'.getX()))
  		that.wndDetailedPictureEdit.show();
  	}
  });
 Ext.reg('cbx-userimage', cbx.headerlogo.cbxUserImage);