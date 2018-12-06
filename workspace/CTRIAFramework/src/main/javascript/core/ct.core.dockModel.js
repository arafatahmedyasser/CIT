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

 * @version 1
 */

cbx.ns("ct.core.dock");
/**
 * Singleton class which will provide model data for app dock and canvas dock.
 */
ct.core.dockmodel = function(){
	var dockModelInstance = null;
	return cbx.apply(new cbx.Observable, {
	appDockArr : [],
	canvasDockArr : [],
	constructor : function() {
        this.addEvents(
            'appdocked',
            'appundocked',
            'removeall'
        );
    },
    /**
	* Method to return an instance of the dock model
	*/
	getInstance : function(){
		if(cbx.isEmpty(dockModelInstance)){
			dockModelInstance = this;
		}
		return dockModelInstance;
	},
	/**
	* Method to add an item to the canvas dock model
	* The canvasDockItem is an object with values for the following keys
	* canvasId - the workspace id
	* canvasLabel - label for the canvas icon
	* canvasIndex - the index of the workspace
	* if the canvas dock item is that of 'Design Your Canvas', the canvasIndex key is not required
	*/
	addToCanvasDockModel : function (canvasDockItem){
		this.canvasDockArr.push(canvasDockItem);
	},
	/**
	* Method to return the items of the canvas dock model 
	*/
	getCanvasDockItems : function (){
		return this.canvasDockArr;
	},
	/**
	* Method to initialize the app dock model
	*/
	populateAppDockModel : function(dockedAppsArr){
		if(!cbx.isEmpty(this.appDockArr)){
			this.emptyAppDock();
		}
		if(!cbx.isEmpty(dockedAppsArr)){
			for(var i=0;i<dockedAppsArr.length;i++){
				this.addIconToAppDockModel(dockedAppsArr[i]);
			}
		}
	},
	/**
	* Method to empty the app dock model. This will raise the event 'removeall'
	*/
	emptyAppDock : function (){
			this.appDockArr = [];
			this.raiseEvent('removeall');
	},
	/**
	* Method to add an item to the app dock model. This will raise the event 'appdocked'
	* The dockedAppConfig is an object with values for the following keys if this config is for an app
	* id - app id
	* label  - label for the dock item
	* if the config is for the home icon, then it is an object with the value as 'Y' for the key isHomeIcon
	*/
	addIconToAppDockModel : function(dockedAppConfig){
		this.appDockArr.push(dockedAppConfig);
		this.raiseEvent('appdocked',dockedAppConfig);
	},
	/**
	* Method to remove an item from the app dock model. This will raise the event 'appundocked'
	*/
	removeIconFromAppDock : function(itemId){
		for(var i=0;i<this.appDockArr.length;i++){
			if(this.appDockArr[i].id === itemId){
				this.appDockArr.splice(i, 1);
				this.raiseEvent('appundocked',itemId);
			}
		}
	},
	/**
	* Method to return the items of the the app dock model. 
	*/
	getAppDockItems : function(){
		return this.appDockArr;
	}
});
}();
CCDM = ct.core.dockmodel;
