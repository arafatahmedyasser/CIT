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
 * 
 */
cbx.ns('canvas.lib');
/**
 * 
 */
canvas.lib.window = Class( cbx.core.Component, {
	/**
	 * 
	 */
	intialConfig: null,
	/**
	 * 
	 */
	formManager: null,
	/**
	 * 
	 */
	formContainer: null,
	/**
	 * 
	 */
	initialize: function() {
		var domStr='';
		if(!cbx.isEmpty(this.html)){
			this.domStr=this.html;
		}
		var domStr='';
		this.windowConfig={
			showModal  : (!cbx.isEmpty(this.modal) && this.modal==true)?true:false,
			title      : (!cbx.isEmpty(this.title))?this.title:'',
			width      : (!cbx.isEmpty(this.width))?this.width:400,
			height     : (!cbx.isEmpty(this.height))?this.height:300,
			resizable  : (!cbx.isEmpty(this.resizable) && this.resizable==true)?true:false,
			scrollable : (!cbx.isEmpty(this.scrollable) && this.scrollable==true)?true:false
		};
		this.windowObj=$.window(this.windowConfig);
		this.setContent(this.domStr);
	},
	/**
	*Private API
	*/
	setContent:function(){
		this.windowObj.setContent(this.domStr);
	},
	/**
	 * 
	 */
	show:function(){
		this.windowObj.show();
	},
	/**
	 * 
	 */
	showAt:function(){
	
	}
 }); 
/**
 * 
 */
CLCR.registerCmp({'COMP_TYPE':'canvas-window'},canvas.lib.window);







