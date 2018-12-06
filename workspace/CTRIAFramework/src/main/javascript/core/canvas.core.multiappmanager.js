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
 * This class is the Multi-App manager. It is responsible to manage the Multi
 * Apps and get the lib specific Multi App Container.
 * 
 */
cbx.ns("cbx.core");
cbx.core.MultiAppManager = Class(cbx.Observable,{
			parentContainer:null,
			constructor : function(config) {
				cbx.core.extend(this, config);
				this.config = config;
				this.multiAppConfig = config.widgetMetadata;
				this.portlet = config.parentPortlet;
				this.createMultiAppContainer();
			},
			/**
			 * The API which will instantiate the corresponding library's multi
			 * App container.
			 */
			createMultiAppContainer : function() {
				var widgetContainerClass = CLCR.getCmp({
					"COMP_TYPE" : "MULTI_APP",
					"LAYOUT" : this.multiAppConfig.LAYOUT
				});
				if (widgetContainerClass) {
					this.parentContainer = new widgetContainerClass(this.config); 
				}
			},
			/**
			 * Returns the parent widget container Class 
			 * @returns {widgetContainerClass}
			 */
			getContainer : function() {
				return this.parentContainer;
			},
			/**
			 * Features yet to be implemented
			 * 
			 * Any child select implementation should call back this API.
			 * @param config
			 * @returns {cbx.lib.ChildAppContainer}
			 */
			appSelectHandler : function(config) {
				
			},
			/**
			 * Features yet to be implemented
			 * 
			 * Any child de-select implementation should call back this API.
			 * @param config
			 * @returns {cbx.lib.ChildAppContainer}
			 */
			appDeSelectHandler : function(config) {

			}
});