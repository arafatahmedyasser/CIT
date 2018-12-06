cbx.ns('canvas.lib');


CFCR = Class({
	
	$singleton: true,
	registry: {},
	pluginRegister: {},
	
	serialize: function(obj){
		var keys=[];
		for(i in obj){
			if(obj.hasOwnProperty(i)){
				keys.push(i);
			}
		}
		keys.sort();
		var str='';
		var key;
		for(var i=keys.length-1; i>=0; i--) {
			key=keys[i]
			str+='|'+key+':'+obj[key]+'|';
		}
		return str;
	},
	/**
	 * Pointcut register must be happen during the component initialized.
	 * In such a way we can over come files un-availability.
	 */
	getFormCmp : function (config){
		var cfg = this.serialize(config);
		if(this.registry[cfg]){
			var baseClass = this.registry[cfg];
			if(this.pluginRegister[cfg]){
				var plugins = this.pluginRegister[cfg];
				for(var i=0; i<plugins.length; i++){
					baseClass = cbx.core.pointcut(baseClass,plugins[i]);
				}
				delete this.pluginRegister[cfg];
			}
			return baseClass;
		}else{
			LOGGER.error("No cbx form component is registered with the following config options:", config);
		}
	},
	
	/**
	 * get actual component class with out any plugins
	 */
	getBaseClass: function(config){
		var cfg = this.serialize(config);
		if(this.registry[cfg])
			return cbx.core.pointcut(this.registry[cfg],"remove");
	},
	
	registerFormCmp: function(config, className){
		this.registry[this.serialize(config)] = className;
	},
	
	/**
	 * plugin must be registered with component key code
	 */
	registerPlugin: function(config, plugin){
		var key = this.serialize(config);
		if (!this.pluginRegister[key])
			this.pluginRegister[key] = [];
		this.pluginRegister[key].push(plugin);
	}
	
});