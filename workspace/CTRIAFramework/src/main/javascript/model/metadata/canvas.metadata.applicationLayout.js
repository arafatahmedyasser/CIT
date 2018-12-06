/**
 * Copyright 2015. Intellect Design Arena Limited. All rights reserved. 
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
cbx.namespace("canvas.metadata.applicationLayout");
/**
 *This is a singleton which holds the metadata of the application layout 
 */
canvas.metadata.applicationLayout = function (){
	var applicationLayoutConfig = {};
	var applicationLayoutComponent = {};
	var canvasDockRequired = false;
	var appDockRequired = false;
	var landingPageEnabled = false;
	var headerHeightInPx = 0;
	var footerHeightInPx = 0;
	var headerCls = '';
	var footerCls = '';
	var headerPosition = 'absolute';
	var footerPosition = 'absolute';
	var headerComponent = {};
	var footerComponent = {};
	var workSpaceLayoutConfig = {};
	var headerEnabled = false;
	var footerEnabled = false;
	/**
	 * Private method to initialize the application layout config object 
	 */
	var initAppLayoutConfig = function (){
		var applnLayoutConfigClass = CLCR.getCmp({"CONFIG":"APPLICATION_LAYOUT","LAYOUT":iportal.preferences.getLayout()});
		if (applnLayoutConfigClass) {
			applicationLayoutConfig = new applnLayoutConfigClass();
		}
	};
	return ({
		/**
		 * Method that will initialize the application layout's config object
		 */
		initializeApplicationLayoutMetadata : function (){
			if(cbx.isEmpty(applicationLayoutConfig)){
				initAppLayoutConfig();
			}
		},
		/**
		 * Method that will be used to save the application layout component in the
		 * meta data to be used later
		 */
		setApplicationLayoutComponent : function (applnLayoutComponent){
			applicationLayoutComponent = applnLayoutComponent;
		},
		/**
		 * Method that will be return the application layout component
		 */
		getApplicationLayoutComponent : function (){
			return applicationLayoutComponent;
		},
		/**
		 * Method that will return true if canvas dock is enabled
		 */
		isCanvasDockRequired : function (){
			if( !cbx.isEmpty(applicationLayoutConfig.canvasDockEnabled) && applicationLayoutConfig.canvasDockEnabled){
				canvasDockRequired = true;
			}
			return canvasDockRequired;
		},
		/**
		 * Method that will return true if app dock is enabled
		 */
		isAppDockRequired : function (){
			if( !cbx.isEmpty(applicationLayoutConfig.appDockEnabled) && applicationLayoutConfig.appDockEnabled){
				appDockRequired = true;
			}
			return appDockRequired;
		},
		/**
		 * Method that will return true if landing page is enabled
		 */
		isLandingPageRequired : function (){
			if( !cbx.isEmpty(applicationLayoutConfig.landingPage) && !cbx.isEmpty(applicationLayoutConfig.landingPage.enabled) && applicationLayoutConfig.landingPage.enabled){
				landingPageEnabled = true;
			}
			return landingPageEnabled;
		},
		/**
		 * Method that will return the configured header height(Pixel) if the header is enabled
		 * else it will return 0
		 */
		getHeaderHeightInPx : function (){
			if(!cbx.isEmpty(applicationLayoutConfig.headerConfig)&& applicationLayoutConfig.headerConfig.enabled){
				if( !cbx.isEmpty(applicationLayoutConfig.headerConfig) && !cbx.isEmpty(applicationLayoutConfig.headerConfig.heightInPx) && applicationLayoutConfig.headerConfig.heightInPx){
					headerHeightInPx = applicationLayoutConfig.headerConfig.heightInPx;
				}
			}
			return headerHeightInPx;
		},
		/**
		 * Method that will return the configured footer height(Pixel) if the footer is enabled
		 * else it will return 0
		 */
		getFooterHeightInPx : function (){
			if(!cbx.isEmpty(applicationLayoutConfig.footerConfig)&& applicationLayoutConfig.footerConfig.enabled){
				if(!cbx.isEmpty(applicationLayoutConfig.footerConfig.heightInPx) && applicationLayoutConfig.footerConfig.heightInPx){
					footerHeightInPx = applicationLayoutConfig.footerConfig.heightInPx;
				}
			}
			return footerHeightInPx;
		},
		/**
		 * Method that will return the header cls
		 */
		getHeaderCls : function (){
			if( !cbx.isEmpty(applicationLayoutConfig.headerConfig) && !cbx.isEmpty(applicationLayoutConfig.headerConfig.cls) && applicationLayoutConfig.headerConfig.cls){
				headerCls = applicationLayoutConfig.headerConfig.cls;
			}
			return headerCls;
		},
		/**
		 * Method that will return the footer cls
		 */
		getFooterCls : function (){
			if( !cbx.isEmpty(applicationLayoutConfig.footerConfig) && !cbx.isEmpty(applicationLayoutConfig.footerConfig.cls) && applicationLayoutConfig.footerConfig.cls){
				footerCls = applicationLayoutConfig.footerConfig.cls;
			}
			return footerCls;
		},
		/**
		 * Method that will return the position where the header should be rendered 
		 */
		getHeaderPosition : function (){
			if( !cbx.isEmpty(applicationLayoutConfig.headerConfig) && !cbx.isEmpty(applicationLayoutConfig.headerConfig.position) && applicationLayoutConfig.headerConfig.position){
				headerPosition = applicationLayoutConfig.headerConfig.position;
			}
			return headerPosition;
		},
		/**
		 * Method that will return the position where the footer should be rendered 
		 */
		getFooterPosition : function (){
			if( !cbx.isEmpty(applicationLayoutConfig.footerConfig) && !cbx.isEmpty(applicationLayoutConfig.footerConfig.position) && applicationLayoutConfig.footerConfig.position){
				footerPosition = applicationLayoutConfig.footerConfig.position;
			}
			return footerPosition;
		},
		/**
		 * Method that will return the header component
		 */
		getHeaderComponent : function (){
			if(this.isHeaderEnabled()){
				if(applicationLayoutConfig.headerConfig.component) {
				var applnHeaderClass = CLCR.getCmp({"COMPONENT":applicationLayoutConfig.headerConfig.component,"APPLICATION_FW" : "EXT-JS"});
					if (applnHeaderClass) {
						headerComponent = new applnHeaderClass();
					}
				}
		}
			return headerComponent;
		},
		/**
		 * Method that will return the footer component
		 */
		getFooterComponent : function (){
			if(this.isFooterEnabled()){
				if(applicationLayoutConfig.footerConfig.component) {
				var applnFooterClass = CLCR.getCmp({"COMPONENT":applicationLayoutConfig.footerConfig.component,"APPLICATION_FW" : "EXT-JS"});
					if (applnFooterClass) {
						footerComponent = new applnFooterClass();
					}
				}
			}
			return footerComponent;
		},
		/**
		 * Method that will return the header component name
		 */
		getHeaderComponentName : function (){
			return applicationLayoutConfig.headerConfig.component;
		},
		/**
		 * Method that will return the footer component name
		 */
		getFooterComponentName : function (){
			return applicationLayoutConfig.footerConfig.component;
		},
		/**
		 * Method that will return the landing Page component name
		 */
		getLandingPageComponentName : function (){
			return applicationLayoutConfig.landingPage.component;
		},
		
		/**
		 * Method that will return the workspace component's config object
		 */
		getWorkSpaceLayoutConfig : function (){
			if( !cbx.isEmpty(applicationLayoutConfig.workSpaceLayout) && !cbx.isEmpty(applicationLayoutConfig.workSpaceLayout.config) && applicationLayoutConfig.workSpaceLayout.config){
				workSpaceLayoutConfig = applicationLayoutConfig.workSpaceLayout.config;
			}
			return workSpaceLayoutConfig;
		},
		/**
		 * Method that will return true if the header is enabled
		 */
		isHeaderEnabled : function (){
			if(!cbx.isEmpty(applicationLayoutConfig.headerConfig)&& applicationLayoutConfig.headerConfig.enabled){
				headerEnabled = true;
			}
			return headerEnabled;
		},
		/**
		 * Method that will return true if the footer is enabled
		 */
		isFooterEnabled : function (){
			if(!cbx.isEmpty(applicationLayoutConfig.footerConfig)&& applicationLayoutConfig.footerConfig.enabled){
				footerEnabled = true;
			}
			return footerEnabled;
		}
	});
}();
