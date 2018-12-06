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
cbx.namespace("canvas.metadata");
cbx.namespace("cbx");
/**
 * 
 */
canvas.metadata.appcontainer = function(){
	/**
	 * 
	 */
	var APP_CONTAINER_METADATA = null;
	
	return {
		/**
		 * 
		 */
		setAppContainerMetadta : function (appContainerMetadata){
			APP_CONTAINER_METADATA = appContainerMetadata;
		},
		/**
		 * 
		 */
		getAppContainerMetadata : function(appId){
			if(appId){
				return APP_CONTAINER_METADATA[appId];
			}
			return APP_CONTAINER_METADATA;
		},
		/**
		 * 
		 */
		setAppMetaData : function(obj){
			var allApps = APP_CONTAINER_METADATA.ALL_APPS;
			APP_CONTAINER_METADATA = obj;
			if(allApps){
				APP_CONTAINER_METADATA.ALL_APPS = allApps;
			}
		},
		/**
		 * 
		 */
		getAllApps : function(){
			return APP_CONTAINER_METADATA.ALL_APPS;
		},
		/**
		 * 
		 */
		setAllApps : function(obj){
			APP_CONTAINER_METADATA.ALL_APPS = obj;
		}
	};
}();
cbx.appContainerMetadata = canvas.metadata.appcontainer;