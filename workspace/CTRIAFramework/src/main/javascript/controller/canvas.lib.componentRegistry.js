/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
cbx.ns("canvas.lib");
/**
 * This is the class incharge of the registring the library components for all the framework availables for the
 * corresponding layout.
 */
canvas.lib.ComponentRegistry = function ()
{

	var compRegister = {};
	var pluginRegister = {};
	var optsRegister = {};

	var serialize = function (obj)
	{
		var keys = [];
		for (i in obj)
		{
			if (obj.hasOwnProperty(i))
			{
				keys.push(i);
			}
		}
		keys.sort();
		var str = '';
		var key;
		for (var i = keys.length - 1; i >= 0; i--)
		{
			key = keys[i]
			str += '|' + key + ':' + obj[key] + '|';

		}
		return str;
	}
	return {
		/**
		 * @Method getCmp
		 * @memberof "CLCR"
		 * @description This is the central API that Retrieves a registered component
		 * Pointcut register must be happen during the component initialized.
		 * In such a way we can over come files un-availability.
		 * @param {Mixed} config Ths is the JSON that is used as the key for registering the component
		 * @returns {Mixed} This is the component class that has been registered against the provided config
		 */
		getCmp : function (config){
			var cfg = serialize(config);
			if (compRegister[cfg]){
				var baseClass = compRegister[cfg];
				if(pluginRegister[cfg]){
					var plugins = pluginRegister[cfg];
					for(var i=0; i<plugins.length; i++){
						baseClass = cbx.core.pointcut(baseClass,plugins[i]);
					}
					delete pluginRegister[cfg];
				}
				return baseClass;
			} else {
				LOGGER.error("No canvas component is registered with the following config options:", config);
			}
		},
		
		/**
		 * get actual component class with out any plugins
		 */
		getBaseClass: function(config){
			var cfg = serialize(config);
			if(compRegister[cfg])
				return cbx.core.pointcut(compRegister[cfg],"remove");
		},

		/**
		 * @Method registerCmp
		 * @memberof "CLCR"
		 * @description This is the central API that allows for a class to be registered against a config pattern.
		 * @param {Mixed} config Ths is the JSON that is used as the key for registering the component
		 * @param {Mixed} cClass This is the class that has to be instantiated when someone wants to get this
		 *            component
		 * @param {Mixed} initOpts This is an optional JSON that can be provided that will be shared to the component
		 *            when it is created
		 */
		registerCmp: function(config, cClass, initOpts){
			var key = serialize(config);
			compRegister[key] = cClass;
			if (!cbx.isEmpty(initOpts))
				optsRegister[serialize(config)] = initOpts;
		},
		/**
		 * @Method getInitOptions
		 * @memberof "CLCR"
		 * @description This is the API that pulls out the initialization options provided if any for the given
		 *              component
		 * @param {Mixed} config Ths is the JSON that is used as the key for looking up the component
		 * @return {Mixed} This is the initialization options against the provided config. If config cannnot be
		 *         detected, then the return value is undefined.
		 */
		getInitOptions : function (config)
		{
			var key = serialize(config);
			if (optsRegister[key])
			{
				return optsRegister[key];
			}
		},
		getPlugin : function(config){
			if(pluginRegister[config]){
				return pluginRegister[config];
			}else{
				LOGGER.error("No plugin is registered with the following config options:", config);
			}
		},
		
		/**
		 * @Method registerPlugin
		 * @memberof "CLCR"
		 * @description This is the API that is used to register a plug in. A plugin is created as an extension that is
		 *              implemented on the jsface.pointcut support.
		 * @param {String} baseComp This is the name of the plugin. Has to be unique. Else will replace the earlier
		 *            plug in if present
		 * @param {Object} plugin This is the plugin class associated to this name
		 */
		registerPlugin : function (baseComp, plugin)
		{
			var key = serialize(baseComp);
			//First check if the cmponent is already in the registry. If not present, then store temporarily.
			if (!pluginRegister[key])
				pluginRegister[key] = [];
			pluginRegister[key].push(plugin);
			
		}

	/*
	 * registerPlugin : function(pluginName,plugin){ pluginRegister[pluginName]=plugin; }, registerCmpWithPlugin :
	 * function(newCmpConfig,defaultCmpConfig,plugins){ var defaultCmp = CLCR.getCmp(defaultCmpConfig); for(var j=0; j<plugins.length;
	 * j++){ var cmpPlugin = pluginRegister[plugins[j]]; defaultCmp = cbx.core.pointcut(defaultCmp,cmpPlugin); }
	 * CLCR.registerCmp(newCmpConfig,defaultCmp); }
	 */
	};

}();
/**
 * This is the Global variable used for registring and getting components for the specific layout type.
 */
CLCR = canvas.lib.ComponentRegistry;
