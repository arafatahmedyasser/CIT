/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */

cbx.ns('canvas.lib');
/**
 * @className : canvas.lib.viewport
 * @extends : cbx.core.Component
 * @description: This class is responsible for the viewport of the application. <BR>
 *               This does the following three tasks : <BR>
 *               1) Renders the coresponding application layout header in the header div.<BR>
 *               2) Renders the coressponding application layout footer in the footer div.<BR>
 *               3) Initiates the workspacemanager which holds the application content.
 */
canvas.lib.viewport = Class(cbx.core.Component, {

	initialize : function ()
	{

		/**
		 * Retrieivng the application layout which is found in the property file.
		 */
		var applicationLayout = iportal.preferences.getLayout();
		var applicationLayoutConfig = canvas.metadata.applicationLayout;
		applicationLayoutConfig.initializeApplicationLayoutMetadata();
		/**
		 * Rendering the application header
		 */
		
		var headerComponentName = applicationLayoutConfig.getHeaderComponentName();
		
		var headerClass = CLCR.getCmp({
			'COMPONENT' : headerComponentName,
			"APPLICATION_FW" : "JQTBS"
		});

		if (headerClass)
		{
			this.workspaceHeader = new headerClass({
				parentElem : '#HEADER_DIV',
				config: applicationLayoutConfig
				
			}).getHeaderDOM();
		}
				
		/**
		 * Rendering the application footer
		 */
		
		var footerComponentName = applicationLayoutConfig.getFooterComponentName();
		
		var footerClass = CLCR.getCmp({
			'COMPONENT' : footerComponentName,
			"APPLICATION_FW" : "JQTBS"
		});

		if (footerClass)
		{
			this.workspaceFooter = new footerClass({
				parentElem : '#FOOTER_DIV',
				config: applicationLayoutConfig
			}).getFooterDOM();
		}

		


		/**
		 * Rendering the application content
		 */
		
		$('#CONTENT_DIV').addClass("container-fluid");
		
		
		var viewPort = this.elem;
		var config = {
			elem : viewPort,
			config: applicationLayoutConfig
		};

		this.wsManager = new cbx.core.WSManager(config);
	}
});

CLCR.registerCmp({
	'VIEW_TYPE' : 'VIEWPORT'
}, canvas.lib.viewport);
