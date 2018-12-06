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
 * ===============================================================================================
 * CHANGE CODE 		AUTHOR 				DESCRIPTION 									   DATE
 *  JQTBS01 		ArunKumar Sekar 	Creating initial List View						09-02-2015
 * ===============================================================================================
 */

cbx.ns("canvas.lib");
/**
 * @className : canvas.lib.listFilters
 * @description: Handles list view filters. <BR>
 * 
 */
canvas.lib.listFilters = Class({
	
	filterTypeMap: {
		"date" 		: "date",
		"time" 		: "date",
		"float" 	: "float",
		"int" 		: "float",
		"percentage" : "float",
		"list" 		: "list",
		"string" 	: "string",
		"numstr" 	: "string",
		"translatedvalue" : "string",
		"rate" 		: "rate",
		"boolcheck" : "bool"
	},
	filters: null,
	dataType: null,
	filtersAll: [],
	colFilters:[],
	/**
	 * Class constructor, prepares all parameters
	 */
	constructor: function(config){
		this.filtersAll=[];
		$.extend(this, config.scope);
	},
	/*
	 * Filter specific params should be added here
	 */
	defaultParams: function(){
		return {};
	},
	
	/** 
	 * returns template container for specific filter to render form
	 */
	getTmplObject: function(dataType){
		var xType = this.filterTypeMap[dataType],
		tmplObj = "";
		this.xType = xType;
		switch(xType){
			case "float":
				tmplObj = "listAmountForm.cttpl";
				break;
			case "string":
				tmplObj = "listStringForm.cttpl";
				break;
			case "date":
				tmplObj = "listDateForm.cttpl";
				break;
		}
		return tmplObj;
	},
	
	/** 
	 * returns template parameters for Handlebars
	 */
	getTemplateParams: function(searchType){
		var obj = {};
		obj[searchType] = "true";
		obj.inputName = this.xType+"_"+searchType;
		if(searchType == "before" || searchType == "after" || searchType == "on")	obj.calenderEnabled = "true";
		return obj;
	},
	
	/** 
	 * data type setter
	 * @xtype : data type 
	 */
	setXType: function(xtype){
		this.dataType = xtype;
		this.filters = this.getFilterClass();
	},
	
	/** 
	 * data type getter
	 */
	getXType: function(){
		if(this.dataType){
			return this.filterTypeMap[this.dataType];
		} else 
			return "string";
	},
	
	/** 
	 * returns search type according to data type
	 */
	getSearchTypes: function(){
		if(this.filters){
			return this.filters.getmenu();	
		}else{
			return []
		}
		
		
	},
	
	/** 
	 * return filter class
	 */
	getFilterClass: function(){
		try{
			return new canvas.filters["canvas"+this.getXType()]();
		} catch(e){
			LOGGER.info("Filter Class not found");
		}
		
	},
	
	/** 
	 * refresh filter parameters if any changes occurs
	 */
	refreshFilters: function(){
		var ajxParams = this.mergeFilterParams();
		return $.extend({},ajxParams,this.defaultParams()); 
	},
	
	/** 
	 * returns ajax params specific to particular data type and search type
	 */
	getAjaxParams: function(config){
		
		var defaultParams = this.defaultParams();
		if(config.datatype){
			if(config.datatype == "rate") config.datatype = "float";
			this.setXType(config.datatype);
			this.filters.initFilter(config);
			if(this.filters.validate()){
				var filterParams = this.filters.getParams();
				this.colFilters.push(filterParams);
				var filterParams = this.doParams(filterParams);
				this.colFiltersForWidgetPanelPrint=  $.extend({},filterParams, this.defaultParams())
				return this.colFiltersForWidgetPanelPrint; 
			}
			else{
				return false;
			}
		}
		return {};
	},
	
	/** 
	 * validates and returns saved filters
	 */
	doParams: function(obj){
		if(this.filtersAll){
			if(this.removeFilterIfExists(obj._FIELD) === false){
				var tmpObj = {};
				tmpObj[obj._FIELD] = obj;
				this.filtersAll.push(tmpObj);
			}
		}
		return this.mergeFilterParams();
	},
	
	/**
	 * Utility method of doParams
	 */
	mergeFilterParams: function(){
		var allParams = {};
		if(typeof(this.filtersAll) != 'undefined'){
			var filtersLength = this.filtersAll.length;
			if(filtersLength > 0){
				var applyCount = function(number, obj){
					var newObj = {};
					for(var key in obj){
						var newName = "FILTER"+number+key;
						newObj[newName] = obj[key]
					}
					return newObj;
				}
				for(var i=0; i<filtersLength; i++){
					var number = (i+1);
					for(key in this.filtersAll[i]){
						if(this.filtersAll[i].hasOwnProperty(key)){
							if(typeof(this.filtersAll[i][key]) == 'object'){
								$.extend(allParams, applyCount(number,this.filtersAll[i][key]));
							}
						}
					}
				}
				allParams.COLUMN_COUNT = filtersLength;
				allParams.IS_FILTER_FORM = "true";
			}
		}
		return allParams;
	},
	
	/**
	 * re-paints filters at filters scope
	 */
	removeFilterIfExists: function(column){
		for(var j=0; j<this.filtersAll.length; j++){
			for(key in this.filtersAll[j]){
				if(this.filtersAll[j].hasOwnProperty(column)){
					this.filtersAll.removeAt(j);
				}
			}
		}
		return false;
	},
	
	/**
	 * re-paints filters at filters scope
	 */
	removeAllFilters: function(){
		this.filtersAll.length = 0;
		return false;
	},
	
	
	/**
	 * returns all saved filters
	 */
	getFilters: function(config){
			if(!cbx.isEmpty(config)){
				for(var i=0 ; i< config.length ;i++){
					var obj ={};
					var innerObj ={};
					var colid=config[i].FLD_COLUMN_ID;
					innerObj._CONSTRAINT = config[i].FLD_FILTER_TYPE;
					innerObj._FIELD = colid;
					if(this.removeFilterIfExists(colid) === false){
						if(config[i].FLD_FILTER_TYPE == "contains" || config[i].FLD_FILTER_TYPE == "=" || config[i].FLD_FILTER_TYPE == ">"|| config[i].FLD_FILTER_TYPE == "<" ){
							
							
								innerObj._VALUE_TXT = config[i].FLD_FILTER_VALUES[0];
								obj[colid] = innerObj;	
							
						}else if(config[i].FLD_FILTER_TYPE=="range"||config[i].FLD_FILTER_TYPE=='lt'||config[i].FLD_FILTER_TYPE=='gt'||config[i].FLD_FILTER_TYPE=='PREVIOUS_MONTH'||config[i].FLD_FILTER_TYPE=="LAST_N_DAY"||config[i].FLD_FILTER_TYPE=="LAST_N_MONTH"|| config[i].FLD_FILTER_TYPE=="dtEquals"){
							innerObj._VALUE_DATE=config[i].FLD_FILTER_VALUES[0];
							innerObj._VALUE_DATE2=config[i].FLD_FILTER_VALUES[1];
							innerObj._VALUE_TXT = "";
							innerObj._VALUE_PERIOD =config[i]._VALUE_PERIOD;
							obj[colid] = innerObj;
						}
					}
					this.filtersAll.push(obj);
				}
			}
		return this.filtersAll;
	}
});

cbx.ns("canvas.filters");
/**
 * @className : canvas.filters.canvasdate
 * @description: validate and handles all date based filters. <BR>
 * 
 */
canvas.filters.canvasdate = Class({
	
	subMenu: [{"key":"before","display_name":iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(),"LBL_BEFORE")},
	               {"key":"after","display_name":iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(),"LBL_AFTER")},
	               {"key":"on","display_name":iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(),"LBL_ON")},
	               {"key":"between","display_name":iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(),"LBL_BETWEEN")},
	               {"key":"previous-month","display_name":iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(),"LBL_PREVIOUS_MONTH")},
	               {"key":"last-n-days","display_name":iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(),"LBL_LAST_N_DAY")},
	               {"key":"last-n-months","display_name":iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(),"LBL_LAST_N_MONTH")}],
	               
	initFilter: function(config){
		this.formData = config.formData;
		this.searchType = config.searchtype;
		this.columnID = config.column;
	},
	
	validate: function(){
		var value = this.getValue();
		if(this.searchType == "last-n-days" || this.searchType == "last-n-months"){
			value = parseInt(value);
			if(isNaN(value) || typeof(value) == 'undefined'){
				return false;
			}
			return true;
		}
		else if(this.searchType == "between"){
			if (cbx.isEmpty(value.date_from) || (cbx.isString(value.date_from) && value.date_from.length < 1)) {
				return false;
			}
			if (cbx.isEmpty(value.date_to) || (cbx.isString(value.date_to) && value.date_to.length < 1)) {
				return false;
			}
			var date_from = iportal.jsutil.convertStringToDateObject(value.date_from).getTime();
			var date_to = iportal.jsutil.convertStringToDateObject(value.date_to).getTime();
			if(date_from < date_to){
				return true;
			} 
			return false;
		}
		else if(this.searchType == "on"){
			if (cbx.isEmpty(value) || (cbx.isString(value) && value.length < 1)) {
				return false;
			}
		}else if(this.searchType == "before"){
			if (cbx.isEmpty(value) || (cbx.isString(value) && value.length < 1)) {
				return false;
			}
		}else if(this.searchType == "after"){
			if (cbx.isEmpty(value) || (cbx.isString(value) && value.length < 1)) {
				return false;
			}
		}
		return true;
	},
	
	getParams: function(){
		var obj = {};
		if(this.searchType !=  "between"){
			var date = iportal.jsutil.convertDateValueToUserPreferedFmt(this.getValue());
			var time = iportal.jsutil.convertDateObjectToStandardFmt(this.getValue());
			obj._FIELD = this.columnID;
			obj._CONSTRAINT = this.getConstraint();
			obj._VALUE_TXT = "";
			if(this.searchType == "last-n-days" || this.searchType == "last-n-months"){
				obj._VALUE_PERIOD = parseInt(this.getValue());
				obj._VALUE_DATE = "";
				obj._VALUE_DATE2 = "";
				obj._VALUE_TIME = "";
				
			} else {
				obj._VALUE_PERIOD = "";
				obj._VALUE_DATE = date;
				obj._VALUE_DATE2 = "";
				obj._VALUE_TIME = time;
			}
			obj._VALUE_TIME2 = "select";
		} else {
			var value = this.getValue();
			var date1 = iportal.jsutil.convertDateValueToUserPreferedFmt(value.date_from);
			var date2 = iportal.jsutil.convertDateValueToUserPreferedFmt(value.date_to);
			var time = iportal.jsutil.convertDateObjectToStandardFmt(value.date_from);
			obj._FIELD = this.columnID;
			obj._CONSTRAINT = this.getConstraint();
			obj._VALUE_TXT = "";
			obj._VALUE_DATE = date1;
			obj._VALUE_DATE2 = date2;
			obj._VALUE_TIME = time;
			obj._VALUE_TIME2 = "select";
		}
		return obj;
	},
	
	getConstraint: function(){
		var obj = {
			"before" : "lt",
			"after": "gt",
			"on" : "dtEquals",
			"between": "range",
			"previous-month": "PREVIOUS_MONTH",
			"last-n-days" : "LAST_N_DAY",
			"last-n-months": "LAST_N_MONTH"
		}
		return obj[this.searchType];
	},
	
	getmenu: function(){
		return this.subMenu;
	},
	
	getValue: function(){
		if(this.searchType == "between"){
			return {"date_from": this.formData[0].value, "date_to": this.formData[1].value };
		} else
			return this.formData[0].value;
	}

});

/**
 * @className : canvas.filters.canvasfloat
 * @description: validate and handles all float based filters. <BR>
 * 
 */
canvas.filters.canvasfloat = Class({
	subMenu: [{"key":"greater","display_name":iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(),"LBL_NUM_GT")},{"key":"lesser","display_name":iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(),"LBL_NUM_LT")},{"key":"equals","display_name":iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(),"LBL_STR_CONST_EQUALS")}],
	
	initFilter: function(config){
		this.formData = config.formData;
		this.searchType = config.searchtype;
		this.columnID = config.column;
	},
	
	validate: function(){
		var value = this.getValue();
		if(this.searchType == "equals" || this.searchType == "greater" || this.searchType == "lesser"){
			value = parseFloat(value);
			if(isNaN(value) || typeof(value) == 'undefined'){
				return false;
			}
		return true;
		}
	},
	
	getParams: function(){      
		return {
			"_FIELD": this.columnID,
			"_CONSTRAINT": this.getConstraint(),
			"_VALUE_TXT":this.getValue()
		}
	},
	
	getmenu: function(){
		return this.subMenu;
	},
	
	getValue: function(){
		return this.formData[0].value;
	},
	
	getConstraint: function(){
		var obj = {
			"greater" : ">",
			"lesser": "<",
			"equals" : "="
		}
		return obj[this.searchType];
	},
});

/**
 * @className : canvas.filters.canvasstring
 * @description: validate and handles all string based filters. <BR>
 * 
 */
canvas.filters.canvasstring = Class({
	subMenu: [{"key":"contains","display_name":"Contains"}],
	
	initFilter: function(config){
		this.formData = config.formData;
		this.searchType = config.searchtype;
		this.columnID = config.column;
	},
	
	validate: function(){
	var value = this.getValue();
		if (cbx.isEmpty(value) || (cbx.isString(value) && value.length < 1)) {
			return false;
		}
		return true;
	},
	
	getParams: function(){
		return {
			"_FIELD": this.columnID,
			"_CONSTRAINT": this.getConstraint(),
			"_VALUE_TXT":this.getValue()
		}
	},
	
	getConstraint: function(){
		return "contains";
	},
	
	getmenu: function(){
		return this.subMenu;
	},
	
	getValue: function(){
		return this.formData[0].value;
	}
});
canvas.filters.canvasbool = Class({
	subMenu: [{"key":"bool_true","display_name":iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(),"LBL_TRUE")},{"key":"bool_false","display_name":iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(),"LBL_FALSE")}],
	initFilter: function(config){
		this.searchType = config.searchtype;
		this.columnID = config.column;
	},
	validate: function(){
		return true;
	},
	getParams: function(){
		return {
			"_FIELD": this.columnID,
			"_CONSTRAINT": "contains",
			"_VALUE_TXT":this.getValue()
		}
	},
	getmenu: function(){
		return this.subMenu;
	},
	getValue: function(){
		// Since search value could be boolean
		if(this.searchType == "bool_true") return "true"; else return "false";
	}
});