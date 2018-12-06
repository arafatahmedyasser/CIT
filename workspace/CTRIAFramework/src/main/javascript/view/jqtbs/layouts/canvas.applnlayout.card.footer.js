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
cbx.ns('canvas.applnlayout.card');
/**
 * @namespace "canvas.applnlayout.card"
 * @description This component is currently responsible Jquery Framework to rendered card layout footer.
 */

canvas.applnlayout.card.footer = Class({
	/**
	 * @class "canvas.applnlayout.card.footer"
	 * @description The constructor gets the metadata and parent element (#FOOTER)
	 */
	headerData : null,
	parentElem : null,
	constructor : function(config) {
		this.customJSON = config.config;
		this.footerData = config.md || {};
		this.parentElem = config.parentElem;
		$(this.parentElem).addClass("ct-margintop-sm");
		/**
		 * Appdock construction
		 * homeButton - true only for those layouts that have master screen to navigate (ex : card layout)
		 */		
		if(iportal.workspace.metadata.isWidgetCatalogRequired()){
			var appContainerConfig = {
						parent : config.parentElem,
						homeButton : true 
					};
				var appLayoutComp = CLCR.getCmp({
						"COMP_TYPE":"APPDOCK",
						});
				var appObj= new appLayoutComp(appContainerConfig);
				iportal.workspace.metadata.setAppDock(appObj);
		}
	},
	/**
	 * @method getFooterDOM
	 * @memberof "canvas.applnlayout.card.footer"
	 * @description This method gets the list of workspaces and passes it to the template (cardfooter.cttpl) and
	 *              makes a callback to applyTemplate.
	 */
	getFooterDOM : function() {
		this.FOOTER_REQ = this.customJSON.isFooterEnabled();
		this.footerCopyrights=CRB.getFWBundleValue('LBL_COPYRIGHTS') || '';
		var tmpLayer = new ct.lib.tmplLayer('al-card-footer.cttpl',this);
		tmpLayer.getTemplate(this.applyTemplate, this);
	},
	/**
	 * @method applyTemplate
	 * @memberof "canvas.applnlayout.card.footer"
	 * @description This method gets the template, appends it to the parent element and adds click listener to switch
	 *              workspaces.
	 */
	applyTemplate : function (template, tmpClass)
	{
		if (!cbx.core.isEmpty(this.parentElem))
		{
			$(this.parentElem).append(template);
		}

		$(window).scroll(function() {
			if ($(this).scrollTop() > 0){
				$('[data-item-toggle=ct-show-hide-footer]').css("margin-bottom","0px");
			}
			else{
				var reqWindowHeight = $(window).height();
				var contentHeight = $("#CONTENT_DIV").height();
				
				if(contentHeight > reqWindowHeight) {
					$('[data-item-toggle=ct-show-hide-footer]').css("margin-bottom","-40px");
				}
				else {
					$('[data-item-toggle=ct-show-hide-footer]').css("margin-bottom","0px");
				}
			}
		});
		if(this.customJSON.isLandingPageRequired() == true && iportal.workspace.metadata.isWidgetCatalogRequired()) {
			iportal.workspace.metadata.getAppDock().hideAppDock();
		}
	}
});
CLCR.registerCmp({
	"COMPONENT" : "cardfooter",
	"APPLICATION_FW" : "JQTBS"
		},canvas.applnlayout.card.footer);
