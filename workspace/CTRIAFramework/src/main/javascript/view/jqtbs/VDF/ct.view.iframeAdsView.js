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

cbx.ns('ct.view');
 /**
 * @namespace "ct.view"
 * @description The name space ct.view are useful for organizing the code.<br>
 * It provides 2 main benefits.<br>
 * The first is that we can use them to prevent polluting the global namespace with objects,which is generally
 * considered to be undesireable. cbx, for example has just a single global object (the cbx object). It's good practice
 * to put any classes inside a namespace, a commonone is the name of your company or the name of your application.The
 * other advantage is that assists in keeping our code organized, we can group together similar or co-dependent classes
 * in the same namespace, which helps to specify your intent to other developers.
 */
ct.view.iframeAdsView = Class(cbx.core.Component,{
	/**
				 * @class "ct.view.iframeAdsView"
				 * @extends "cbx.core.Component"
				 * @description This class is used for creating iframeAdsView View.
				 * @author Mrinmoy Mukherjee	
				 */
	/**
	* @method "initialize"
	* @memberof "ct.view.iframeAdsView"
	* @description "Initialize the iframeAds view component"
	*/
	initialize : function() {
		var me = this;
		this.widgetId = me.WIDGET_ID;		
		this.viewMd = me.md;		
		this.paremtElem = me.elem;
		this.createComponent();
	},
	/**
	* @method "createComponent"
	* @memberof "ct.view.iframeAdsView"
	* @description "Creating iframeAds view component, Getting the view metadata and compiled it with the template."
	*/
	createComponent : function(){
		var viewType= this.viewMd.md.VIEW_MD.FLD_VIEW_TYPE==='ADS' ? 'ads' : 'iframe';
		var viewMetaData = this.viewMd.md.VIEW_MD;
		viewMetaData['VIEW_TYPE']=viewType;
		var tmpLayer = new ct.lib.tmplLayer('iframeadsview.cttpl', viewMetaData);
		tmpLayer.getTemplate(this.applyTemplate, this);
	},
	/**
	* @method "applyTemplate"
	* @memberof "ct.view.iframeAdsView"
	* @description "Appending the iframeAds view template to the parent element.
	* 	Check if the view is ADS then remove the header and footer."
	*/
	applyTemplate : function (template, tmpClass)
	{
		if (!cbx.core.isEmpty(this.paremtElem))
		{
			$(this.paremtElem).append(template);
		}
		if('ADS' === this.viewMd.md.VIEW_MD.FLD_VIEW_TYPE){
			this.parentPortlet.hideHeader();
			this.parentPortlet.hideFooter();
		}
	},
	callMulti: function(urlArray)
	{
		this.elem=$('.ct-iframe__container iframe[data-item-id=iframe-element]');
		var i=1;
		var me=this;
		setInterval(function() {
		      me.elem.attr("src",me.urlArray[i]);
		      if(i>=urlArray.length)
		      {
		    	  i=i % urlArray.length;
		      }
		      i++;		    	  
		}, 5000);
	},
	maximizeOpen : function(){
		LOGGER.log("Code Detected.....")
	}
	
});
/**
* Registering the iframeAds view component to the CLCR Library.
*/

CLCR.registerCmp({'COMP_TYPE' : 'APP','VIEW_TYPE':'IFRAME'}, ct.view.iframeAdsView);
CLCR.registerCmp({'COMP_TYPE' : 'APP','VIEW_TYPE':'ADS'}, ct.view.iframeAdsView);

