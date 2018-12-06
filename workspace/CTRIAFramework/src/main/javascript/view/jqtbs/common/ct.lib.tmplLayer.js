/**
 * Copyright 2014. Intellect Design Arena Limited
 */

/**
 * ===============================================================================================
 * CHANGE CODE 		AUTHOR 				DESCRIPTION 									   DATE
 * JQTBS01 			ArunKumar Sekar 	Creating initial template layer					30-01-2015
 * JQTBS02 			ArunKumar Sekar 	Enabling support dom level compile				11-02-2015
 * 										Implemented Deffred and Promise on Ajax call
 * ===============================================================================================
 */

cbx.ns("ct.lib");

ct.lib.tmplRepo ={
			
};

/**
 * 	ct.lib.isJSFile:
 * 	If true, the JS file that is compiled from templates is loaded. 
 * 	If false, the template files are loaded directly.
 */
ct.lib.isJSFile = false;

/**
 * @namespace 		"ct.lib"
 * @class 			canvas.lib.tmplLayer
 * @description		This class loads all the template files when the Template file name is given as input 
 * 					in either of the two ways:
 * 					1. Load the template file directly and on success, compile the template and input the values 
 * 					   to the template.
 * 					2. Load the combined complied template-to-js file and compute the response based on the 
 * 					   values inputed to the template upon success.
 */

/**
 * 					This class also handles if an array of templates has to be loaded.
 */
ct.lib.tmplLayer = Class({
	
	tmpl: "",
	input: [], 
	tmplOpts: {},
	
	/**
	 * @class 		"canvas.lib.tmplLayer"
	 * @memberof	canvas.lib.tmplLayer
	 * @description	Initialises the input value and changes the input to 
	 * 				required format based on the type of load
	 */
	constructor: function(input, tmplParams, basePath) {
		if(!Handlebars){
			LOGGER.error("Invalid template provider");
			return false;
		}
		
		if(cbx.isEmpty(basePath)){
			basePath = this.getBasePath();
		}
		
		this.tmplHandler = Handlebars;
		
		if(ct.lib.isJSFile){
			if(cbx.isArray(input)) {
				for(var temp=0; temp<input.length; temp++)
					this.input[temp] = input[temp].slice(0,-6);
			}
			else {
				this.input = input.slice(0,-6);
			}
		}else{
			if(cbx.isArray(input)) {
				for(var temp=0; temp<input.length; temp++)
					this.input[temp] = basePath + input[temp];
			}
			else {
				this.input = basePath + input;
			}
		}

		
		//LOGGER.log("input to tmpl", this.input);
		if(!cbx.isEmpty(tmplParams)){
			this.tmplOpts = tmplParams;
		}
	},

	/**
	 * @class 		"getBasePath"
	 * @memberof	canvas.lib.tmplLayer
	 * @description	The path where all template files are saved.
	 */
	getBasePath : function(){
		//return "CTRIAFramework/UITemplates/jqtbs/";
		return iportal.preferences.getTemplatesPath();
	},

	/**
	 * @class 		"setParams"
	 * @memberof	canvas.lib.tmplLayer
	 * @description	Sets a particular value to a key
	 */
	setParams: function(key, value){
		this.tmplOpts[key] = value;
	},
	
	/**
	 * @class 		"getParams"
	 * @memberof	canvas.lib.tmplLayer
	 * @description	Returns all the params or empty string
	 */
	getParams: function(key){
		return this.tmplOpts[key] || "";
	},
	
	/**
	 * @class 		"prepareTplAjax"
	 * @memberof	canvas.lib.tmplLayer
	 * @description	Retuns the type of ajax call made.
	 */
	prepareTplAjax: function(inputTmpl){
		return $.ajax({ cache: false, url: inputTmpl, method: "GET", contentType: "application/json", dataType:"html"});
	},

	/**
	 * @class 		"getTemplate"
	 * @memberof	canvas.lib.tmplLayer
	 * @description	Loads the template from specified path.
	 */
	getTemplate : function (callback, scope)
	{
		var me = this;
		if(ct.lib.isJSFile)
		{
			var source;
			if (cbx.isEmpty(ct.lib.tmplRepo[me.input]))
			{
				if(cbx.isArray(me.input)) 
				{
					for(var temp=0; temp<me.input.length; temp++) 
					{
						source   = me.tmplHandler.templates[me.input[temp]];
						me.ajaxSuccess(callback, source, scope);
					}
				}
				else
				{
					source   = me.tmplHandler.templates[me.input];
					me.ajaxSuccess(callback, source, scope);
				}
			}
			else
			{
				source = ct.lib.tmplRepo[me.input];
				me.ajaxSuccess(callback, source, scope);
			}									
		} 
		else 
		{
			if (cbx.isEmpty(ct.lib.tmplRepo[me.input]))
			{
				//LOGGER.log("input to getTemplate", me.input);
				if(cbx.isArray(me.input)) 
				{
					for(var temp=0; temp<me.input.length; temp++) 
					{
						$.when(this.prepareTplAjax( me.input[temp] )).then(function (response)
						{
							// caching the template
							ct.lib.tmplRepo[me.input[temp]] = response;
							me.ajaxSuccess(callback,response,scope);				
						}, this.ajaxFails);
					}
				}
				else 
				{
					$.when(this.prepareTplAjax( me.input )).then(function (response)
					{
						// caching the template
						ct.lib.tmplRepo[me.input] = response;
						me.ajaxSuccess(callback,response,scope);				
					}, this.ajaxFails);
				}
			} 
			else
			{
				if(cbx.isArray(me.input)) 
				{
					for(var temp=0; temp<me.input.length; temp++) 
					{
						me.ajaxSuccess(callback,ct.lib.tmplRepo[this.input[temp]],scope);
					}
				} 
				else 
				{
					me.ajaxSuccess(callback,ct.lib.tmplRepo[this.input],scope);
				}
			}
		}
	},

	/**
	 * @class 		"ajaxSuccess"
	 * @memberof	canvas.lib.tmplLayer
	 * @description	On succesful load of templates, the response is obtained after inputing 
	 * 				the response(values to be given in templates).
	 */
	ajaxSuccess : function (callback,response,scope){
		var template;
		if(ct.lib.isJSFile)
		{
			template = response(this.tmplOpts);
		}
		else
		{
			var tmplScope = this.tmplHandler.compile(response);
			template = tmplScope(this.tmplOpts);
		}	
		if (typeof (callback) === 'function')
		{
			callback.apply(scope, [ template, this ]);
		}
		
	},
	
	/**
	 * @class 		"ajaxFails"
	 * @memberof	canvas.lib.tmplLayer
	 * @description	Throws error on failure of template load
	 */
	ajaxFails: function(resp){
					LOGGER.error("Template loading failed", resp);
	},
	
	/**
	 * @class 		"isFile"
	 * @memberof	canvas.lib.tmplLayer
	 * @description	Checks if template file is present in specified path.
	 */
	isFile: function(path){
		if(!(/(\.cttpl|\.html|\.handlebars)$/i.test(path))){
			return false;
		}
		return true;
	},

/*
 * 	getRawTpl and recursiveCallforList methods are not required 
 * 	if raw template loading is not used anywhere.
 */	
	
	/**
	 * @class 		"getRawTpl"
	 * @memberof	canvas.lib.tmplLayer
	 * @description	Loads the raw template. Used when compliation has to be done in later stages.
	 */
	getRawTpl: function(callback){
		var me = this;
		if(cbx.isArray(me.input)) {
			me.recursiveCallforList(me.input, 0, me,callback);
		}
		else {
			$.when(this.prepareTplAjax( me.input )).then(function (response)
			{
				if(typeof(callback) === 'function'){
					callback.apply(me,[response]);
				}			
			});
		}
	},	
	
	fresp : '',

	/**
	 * @class 		"recursiveCallforList"
	 * @memberof	canvas.lib.tmplLayer
	 * @description	Used when an array of raw templates has to be loaded 
	 */
	recursiveCallforList : function(input, index, me,callback) {
		var that = this;
		var scriptId;
		if(ct.lib.isJSFile)
		{
			scriptId = input[index].split('/');
			scriptId = scriptId[scriptId.length-1];
			that.fresp = that.fresp + '\n<script id="' + scriptId + '" type="text/x-handlebars-script">\n';
			source = me.tmplHandler.templates[me.input[index]];
			source = source(that.tmplOpts);
			that.fresp = that.fresp + source + '\n</script>\n';
			index = index+1;
			if(index != input.length){
				that.recursiveCallforList(input, index, me,callback);
			}else{				
				if(typeof(callback) === 'function'){
					LOGGER.log("that.fresp", that.fresp);
					callback.apply(me,[that.fresp]);
				}	
			}
		}
		else
		{
			scriptId = input[index].split('/');
			scriptId = scriptId[scriptId.length-1].slice(0,-6);
			that.fresp = that.fresp + '\n<script id="' + scriptId + '" type="text/x-handlebars-script">\n';
			$.when(this.prepareTplAjax(input[index])).then(function (response)
			{
				index = index+1;
				that.fresp = that.fresp + response + '\n</script>\n';
				if(index != input.length){
					that.recursiveCallforList(input, index, me,callback);
				}else{				
					if(typeof(callback) === 'function'){
						LOGGER.log("that.fresp", that.fresp);
						callback.apply(me,[that.fresp]);
					}	
				}						
			});
		}
	}, 

	/**
	 * @class 		"resetOpts"
	 * @memberof	canvas.lib.tmplLayer
	 * @description	Resets the object sent to tmpl class
	 */
	resetOpts: function(){
		this.tmplOtps = {};
	},

	/**
	 * @class 		"compileTpl"
	 * @memberof	canvas.lib.tmplLayer
	 * @description	Compiles directly loaded templates
	 */
	compileTpl: function(html,obj){
		var tpl = this.tmplHandler.compile(html);
		var obj = obj || this.tmplOpts;
		return tpl(obj);
	}
});



Handlebars.registerHelper('everyNth', function(context, every, options) {
	  var fn = options.fn;
	  var ret = "";
	  if(context && context.length > 0) {
	    for(var i=0, j=context.length; i<j; i++) {
	      var modZero = i % every === 0;
	      ret = ret + fn(jQuery.extend({}, context[i], {
	        isModZero: modZero,
	        isModZeroNotFirst: modZero && i > 0,
	        isLast: i === context.length - 1
	      }));
	    }
	  } 
	  return ret;
});

var audaciousFn;
Handlebars.registerHelper( 'recursive', function(children, options) {
  var out = '';
  if (options.fn !== undefined) {
    audaciousFn = options.fn;
  }
  children.forEach(function(child){
    out = out + audaciousFn(child);
  });
  return out;
});
/*
 * Used to get element of the passed array at given index inside #each loop
 * Example:
 * {{#each rawKeys}}
	<input type="radio" value="{{getOf ../rawValues @index}}" name="radio-group"/>{{this}}
   {{/each}}
 */
Handlebars.registerHelper('getOf', function(arrayvalue, index) {
	return arrayvalue[index];
});


Handlebars.registerHelper('updateObjValue', function(obj, key,value) {
	if(obj[key]){
		obj[key] = value;
	}
	return;
});

Handlebars.registerHelper('condchk', function (value1, value2, options)
{
	if (value1 === value2)
	{
		return options.fn(this);
	}else{
		return options.inverse(this);
	}
});

/**
 * Identifies wheather the give value is array or object
 */
Handlebars.registerHelper('condObj', function (value1, options){
	if (cbx.isObject(value1) || cbx.isArray(value1)){
		return options.fn(this);
	} else {
		return options.inverse(this);
	}
});
/**
 * returns true if either of the options is true
 */
Handlebars.registerHelper('if_Or', function (value1, value2, options){
	if (value1|| value2)
	{
		return options.fn(this);
	}else{
		return options.inverse(this);
	}
});

/**
 * Logger at template
 */
Handlebars.registerHelper("debug", function(optionalValue) {
	  LOGGER.log("Local Context ====================>",this);
	  if (optionalValue) {
		  LOGGER.log("Context Options ====================>",optionalValue);
	  }
});

Handlebars.registerHelper('helperMissing', function(arg) {
	  //LOGGER.log("helperMissing fired for: ", arg);
});

/**
 * Fetching Display Name
 */
Handlebars.registerHelper("display-name", function(bundle_key, display_key_nm){
	var display_value = CRB.getBundleValue(bundle_key, display_key_nm) || display_key_nm;
	return display_value;
});
