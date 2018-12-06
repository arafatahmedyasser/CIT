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
 
cbx.ns('canvas.lib');
/**
 * 
 */
canvas.lib.viewport= Class(cbx.core.Component,{
	/**
	 * Initializes the component. 
	 * This contains the JS library specific component object.
	 **/
	initialize: function(){
		/**
		 * 
		 */
		var that=this;
		/**
		 * 
		 */
		var viewPort = this.elem;
		/**
		 * 
		 */
		this.setCmp(viewPort);
		/**
		 * 
		 */
		var config={
			elem: viewPort
		};
		/**
		 * Calling the core workspace manager to assign it to this.wsManager with 
		 * the config object containing the viewport component. 
		 */
		var headerClass= CLCR.getCmp({
			'COMPONENT':'APPLICATION_HEADER',
			'LAYOUT':"STACK"
		});
		
		if(headerClass){
			this.workspaceHeader= new headerClass({
				parentElem:$('#HEADER_DIV')
			}).getHeaderDOM();
		}
		/**
		 * 
		 */
		this.wsManager=new cbx.core.WSManager(config);
		
		/**
		 * 
		 */
		var footerClass= CLCR.getCmp({
			'COMPONENT':'APPLICATION_FOOTER',
			'LAYOUT':"STACK"
		});
		
		if(footerClass){
			this.workspaceFooter= new footerClass({
				parentElem:$('#FOOTER_DIV')
			}).getFooterDOM();
		}
	}
});
/**
 * 
 */
CLCR.registerCmp({'VIEW_TYPE':'VIEWPORT'}, canvas.lib.viewport);