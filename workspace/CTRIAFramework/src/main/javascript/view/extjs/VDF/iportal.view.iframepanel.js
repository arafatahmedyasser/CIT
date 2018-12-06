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
 * DEPLOY_MODULE_ID: FW25
 */

/**
 * The iframe panel which renders an iframe (HTML).
 * This creates a panel inside which the mif child sits.The Only compulsory
 * parameter which the mif needs is the defaultSrc.
 * The defaultSrc or the iframe source, in the current set up is the value of DEFAULT_SRC_ID of the 
 * VIEW_DEFINITION table.
 *  ------------------------------------------------------------------------------------------------------------------
 * | Value to be specified in the column DEFAULT_SRC_ID(SAMPLE):iportal/jsfiles/sample.html                           |
 * | Ensure a valid HTML file by the name sample.html is present in the path-> iportalweb/WebContent/iportal/jsfiles/ |
 *  ------------------------------------------------------------------------------------------------------------------
 */


Ext.ns("iportal.view");
iportal.view.iframepanel = Ext.extend(Ext.Panel, {

	viewConf : null,
	conf : null,
	uri : null,
	autoScroll : null,
	loadMask : '',
	initComponent : function (){
		// Ensure that we randomize the name of the iframe so that it is unique within this browser dom.
		this.iframeId = this.viewConf.VIEW_MD.VIEW_ID + '_' + cbx.id();
		var mif = new Ext.ux.ManagedIFrame.Panel({
			defaultSrc : this.uri,
			eventsFollowFrameLinks : true, 
			height : this.height,
			width : this.defaultWidth,
			frameborder : 0,
			maskMessage : this.loadMask,
			border : false,
			name : this.iframeId
		});
		this.items = mif;
		this.messageBusProxy = new canvas.comm.MessageBusProxy({
			domainURL : this.uri,
			windowName : this.iframeId
		});
		iportal.view.iframepanel.superclass.initComponent.apply(this);

	},
	updateHeight : function(height){
		this.setHeight(height);
		this.getComponent(0).setHeight(height);
	},
	beforeDestroy : function ()
	{
		if (this.rendered)
		{
			Ext.destroy(this.getComponent(0));
			// Handler that will be called whenever the child iframe panel is destroyed. At that point in time ensure that
			// our proxy created is also destroyed.
			if (this.messageBusProxy)
			{
				this.messageBusProxy.destroy();
				delete this.messageBusProxy;
			}
		}
		iportal.view.iframepanel.superclass.beforeDestroy.apply(this);
	}
});


Ext.reg('iportal-iframepanel', iportal.view.iframepanel);