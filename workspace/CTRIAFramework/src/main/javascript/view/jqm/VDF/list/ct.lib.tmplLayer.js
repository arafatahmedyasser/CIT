/**
 * Copyright 2014. Intellect Design Arena Limited
 */



cbx.ns("ct.lib");

ct.lib.tmplRepo ={
			
};

ct.lib.tmplLayer = Class({
	
	tmpl: "",
	input: "", 
	tmplOpts: {},
	
	constructor: function(input,tmplParams) {
		LOGGER.info("tmplLayer constructor is called");
		if(!Handlebars){
			LOGGER.error("Invalid template provider");
			return false;
		}
		this.tmplHandler = Handlebars;
		this.input = this.getBasePath()+input;
		LOGGER.info("url obtained=====",this.input);
		if(!cbx.isEmpty(tmplParams)){
			this.tmplOpts = tmplParams;
		}
	},
	getBasePath : function(){
		return "CTRIAFramework/UITemplates/jqm/"; 
	},
	setParams: function(key, value){
		this.tmplOpts[key] = value;
	},
	
	getParams: function(key){
		return this.tmplOpts[key] || "";
	},
	
	prepareTplAjax: function(){
		var contextRoot = iportal.workspace.metadata.getContextRoot().split('/');
	    var urlString = iportal.systempreferences.isHybrid()==="true" ? contextRoot[contextRoot.length-2] + "/" + this.input : this.input;
	    return $.ajax({ cache: false, url: urlString , method: "GET", contentType: "application/json", dataType:"html"});
	},
	getTemplate : function (callback, scope)
	{
		LOGGER.info("inside getTemplate method ");
		var me = this;
		if (cbx.isEmpty(ct.lib.tmplRepo[this.input]))
		{

			$.when(this.prepareTplAjax()).then(function (response)
			{
				// caching the template
				LOGGER.info("inside getTemplate method", me.input);
				ct.lib.tmplRepo[me.input] = response;
				me.ajaxSuccess(callback,response,scope);
				
			}, this.ajaxFails);
			
		}else{
			
			me.ajaxSuccess(callback,ct.lib.tmplRepo[this.input],scope);
		}
	},
	ajaxSuccess : function (callback,response,scope){
		var tmplScope = this.tmplHandler.compile(response);
		var template = tmplScope(this.tmplOpts);
		if (typeof (callback) === 'function')
		{
			callback.apply(scope, [ template, this]);
		}
		
	},
	ajaxFails: function(resp){
		LOGGER.error("Template loading failed", resp);
	},
	
	isFile: function(path){
		if(!/(\.cttpl|\.html|\.handlebars)$/i.test(path)){
			return false;
		}
		return true;
	},
	getRawTpl: function(callback){
		var me = this;
		$.when(this.prepareTplAjax()).then(function(response){
			if(typeof(callback) === 'function'){
				callback.apply(me,[response]);
			}
		});
	},
	resetOpts: function(){
		this.tmplOtps = {};
	},
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
/**
 * 
 */
Handlebars.registerHelper('getOf', function(arrayvalue, index) {
	return arrayvalue[index];
});

/**
 * References to Bug https://github.com/wycats/handlebars.js/issues/605
 * 
 * @Cause Handle bars this.[@index] does not work as intended.
 */
Handlebars.registerHelper('getValOf', function(arrayvalue, index, key) {
	return arrayvalue[index][key];
});

Handlebars.registerHelper('updateObjValue', function(obj, key,value) {
	if(obj[key])
		obj[key] = value;
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
 * Logger at template
 */
Handlebars.registerHelper("debug", function(optionalValue) {
	  LOGGER.log("Local Context ====================>",this);
	  if (optionalValue) {
		  LOGGER.log("Context Options ====================>",optionalValue);
	  }
});

/**
 * set single click event for each record
 */
Handlebars.registerHelper('setSingleClick', function (options){
	var tagString = options.fn();
	LOGGER.info("inside single click= ",tagString);
	var splitStrings = tagString.split('>');
	tagString = splitStrings[0]+" data-single-click=true >"+splitStrings[1]+">";
	return new Handlebars.SafeString(tagString);
});

/**
 * set long tap event for each record
 */
Handlebars.registerHelper('setLongTap', function (options){
	options.fn().attr("data-context-click",true);
});

/**
 * Implemented as for of CBX 15.3.0
 * Helper used in Custom Template
 */
Handlebars.registerHelper('incrIndex', function(context, options){

	
	var container = context.hash.id;
	var len = $("#"+container).find("[data-row-index]").length;
			
	if(len > 0){
		return parseInt($("#"+container).find("[data-row-index]").last().attr("data-row-index"))+context.data.index+1;
	} else 
		return context.data.index;
});
