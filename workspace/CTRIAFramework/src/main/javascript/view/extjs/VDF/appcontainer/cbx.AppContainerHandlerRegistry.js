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

cbx.namespace("cbx.AppContainerHandlerRegistry");

/**
 
 * This class provides a means to register handlers for the Apps in the App Containers
 * 
 */
cbx.AppContainerHandlerRegistry = function (){
	var _ob = null;
	return {
		getInstance : function (){

			if (_ob === null) {
				_ob = {
					// Intended to register a Hanlder.
					// @param id - Handler id/name
					// @param ob - Handler object needs to be registered
					registerHandler : function (id, ob){
						_ob[id] = ob;
					},
					getHandler : function (id){
						var reOb = _ob[id];
						if (reOb != null) {
							return reOb;
						} else {
							return null;
						}
					}
					
				};
			}
			return _ob;
		}
	};
}();
ACHR = cbx.AppContainerHandlerRegistry.getInstance();
ACHR.registerHandler("MY_ACCOUNTS", function (config){
	return function (record){
		if(record.data.ASM2_ACCOUNT_TYPE.toUpperCase() === "CURRENT" && record.data.ASM4_STATUS === "Active"){
			return true;
		}
	};
});
ACHR.registerHandler("MANAGE_CARDS", function (config){
	cbx.AppContainerUtil.displayAppInline("WGT_ACCT_SUMMARY",config)
});
ACHR.registerHandler("FUNDS_TRANSFER", function (config){
	var condition = function (record){
		if(record.data.ASM2_ACCOUNT_TYPE.toUpperCase() === "SAVINGS" && record.data.ASM4_STATUS === "Active"){
			return true;
		}
	};
	//config.recordSelect = condition;
	//cbx.AppContainerUtil.launchService("CBX_RETAIL","RETAIL_DASH","WGT_ACCT_SUMMARY","ACC_STATEMENT",config); 
});

ACHR.registerHandler("MANAGE_BENE", function (config){
	cbx.AppContainerUtil.displayAppInline("WGT_BENE_LIST",config)
});



ACHR.registerHandler("MANAGE_ALERTS", function (config){
	CBXFORMCONTAINER.getWindow("CONTAINER_MANAGE_ALERTS");
});

/*
ACHR.registerHandler("MESSAGES_WIDGET", function (config){
	CBXDOWNLOADMGR.requestScripts(cbx.downloadProvider.getMergedArray(["FORM_FRAMEWORK","MESSAGES","ALERTS"]),function(){
	CBXFORMCONTAINER.getWindow("CONTAINER_MESSAGES");
	});
});*/


ACHR.registerHandler("LOGIN_PWD", function (config){
	//var config={}
	//config['EXIT_ACTION']='CLOSE';
	CBXFORMCONTAINER.getWindow("CONTAINER_MANAGE_PWD");
});
ACHR.registerHandler("TRANS_PWD", function (config){
	//config['EXIT_ACTION']='CLOSE';
	CBXFORMCONTAINER.getWindow("CONTAINER_TRANS_PWD");
});
ACHR.registerHandler("CASH_PIN", function (config){
	//config['EXIT_ACTION']='CLOSE';
	CBXFORMCONTAINER.getWindow("CONTAINER_CASH_PIN");
});
ACHR.registerHandler("T_PIN", function (config){
	//config['EXIT_ACTION']='CLOSE';
	CBXFORMCONTAINER.getWindow("CONTAINER_T_PIN");
});


/*ACHR.registerHandler("MANAGE_PERSONALIZE", function (config){
	CBXFORMCONTAINER.getWindow("CONTAINER_PERSONALIZE");
});*/


ACHR.registerHandler("MANAGE_UPDATE", function (config){
	CBXFORMCONTAINER.getWindow("CONTAINER_PREFERENCES");
});

ACHR.registerHandler("LOCATE_ATM", function (config){
	
	var fm = new cbx.form.FormManager({
		formId : "FORM_LOCATE_ATM",
		modelData :{
			"LATM_CITY":" "
		}
	});
	
	CBXFORMCONTAINER.getWindowByFormObj(fm,"CONTAINER_LOCATE_ATM");
});
ACHR.registerHandler("LOCATE_BRANCH", function (config){

	var fm = new cbx.form.FormManager({
		formId : "FORM_LOCATE_BRANCH",
		modelData :{
			"LNB_CITY":" "
		}
	});
	
	CBXFORMCONTAINER.getWindowByFormObj(fm,"CONTAINER_LOCATE_BRANCH");
});

ACHR.registerHandler("DEPOSIT_RATES_LT", function (config){
	CBXFORMCONTAINER.getWindow("CONTAINER_DEP_RATES");
});
ACHR.registerHandler("DEPOSIT_CALC_LT", function (config){
	var fm = new cbx.form.FormManager({
		formId : "FORM_DEPT_CALC"
	});
	CBXFORMCONTAINER.getWindowByFormObj(fm,"CONTAINER_DEPOSIT_CALC",config);
});
ACHR.registerHandler("LOAN_CALC_LT", function (config){
	var fm = new cbx.form.FormManager({
		formId : "FORM_LOAN_CALC",
			modelData:{
			"TENOR_RADIO":"TENOR_RADIO"
		}
	});
	CBXFORMCONTAINER.getWindowByFormObj(fm,"CONTAINER_LOAN_CALC",null);
});

/*ACHR.registerHandler("FX_RATES", function (config){
	CBXFORMCONTAINER.getWindow("CONT_FX_RATES");
});*/


ACHR.registerHandler("APPLY_ONLINE", function (config){
	var fm = new cbx.form.FormManager({
		formId : "FORM_APPLY_ONLINE",
		modelData : {
			'APOE1_PRODUCT' 	 : " ",
			'APOE2_PRODUCT_TYPE' : " ",
			'APOE4_CCY'			 : " "
		},
		additionalConfig : {
			'ENTRY_FORM' : "Y"
		}
	});
	CBXFORMCONTAINER.getWindowByFormObj(fm,"CONTAINER_APPLY_ONLINE",config,"WGT_RETAIL_IFRAME");
});

ACHR.registerHandler("E_STATEMENT", function (config){
	var fm = new cbx.form.FormManager({
		formId : "FORM_E_STATEMENT"
	});
	config={};
	config['EXIT_ACTION']='CANCEL';
	CBXFORMCONTAINER.getWindowByFormObj(fm,"CONTAINER_E_STATEMENT",config);
});


ACHR.registerHandler("UTIL_REGIS", function (config){
	CBXFORMCONTAINER.getWindow("CONTAINER_REGIS_UTIL");
});
ACHR.registerHandler("ADD_UTIL", function (config){
	CBXFORMCONTAINER.getWindow("CONTAINER_MY_UTIL_REGIS");
});
ACHR.registerHandler("MAKE_UTIL_PAY", function (config){
	CBXFORMCONTAINER.getWindow("CONTAINER_PAY_REGIS_UTIL");
});

ACHR.registerHandler("ORG_CPY_STMNT", function (config){
	var fm = new cbx.form.FormManager({
		formId : "FORM_ORG_CPY_STMNT",
		additionalConfig : {
			"ADD_CONFIG" : 'Y'
		}
	});
	config={};
	config.appWidget = "WGT_ACC_FORM";
	config['EXIT_ACTION'] = 'CANCEL';
	CBXFORMCONTAINER.getWindowByFormObj(fm, "CONTAINER_ORG_CPY_STMNT", config);
});

ACHR.registerHandler("MANAGE_CONTACT_DETAILS", function (config){
	var fm = new cbx.form.FormManager({
	formId : "FORM_MANAGE_CONTACT"
	});
	CBXFORMCONTAINER.getWindowByFormObj(fm,"CONTAINER_MANAGE_CONTACT",null,"WGT_RETAIL_IFRAME");
	});

ACHR.registerHandler("CONTACT_DETAILS", function (config){
	var fm = new cbx.form.FormManager({
	formId : "FORM_CONTACT_DET",
	additionalConfig : {
		"ADD_CONFIG" : 'Y'
	}
	});
	CBXFORMCONTAINER.getWindowByFormObj(fm,"CONTAINER_CONTACT_DET",config,"WGT_RETAIL_IFRAME");
	});

ACHR.registerHandler("PERSONAL_DETAILS", function (config){
	var fm = new cbx.form.FormManager({
		formId : "FORM_PERSONAL_DETAILS"
	});
	//config={};
	//config['EXIT_ACTION'] = 'CANCEL';
	CBXFORMCONTAINER.getWindowByFormObj(fm,"CONTAINER_PERSONAL_DETAILS",null);
});

ACHR.registerHandler("ADDRESS_DETAILS", function (config){
	var fm = new cbx.form.FormManager({
		formId : "FORM_ADDRESS_DTLS"
	});
	config={};
	//config['EXIT_ACTION'] = 'CANCEL';
	CBXFORMCONTAINER.getWindowByFormObj(fm,"CONTAINER_ADDRESS_DTLS",config);
});

ACHR.registerHandler("BALANCE_CERTIFICATE", function (config){
	var fm = new cbx.form.FormManager({
		formId : "FORM_BALANCE_CERT",
		additionalConfig:{"FORM":'BALANCE_CERT'}
	});
	config={};
	config.appWidget = "WGT_ACC_FORM";
	config['EXIT_ACTION']='CANCEL';
	CBXFORMCONTAINER.getWindowByFormObj(fm,"CONTAINER_BALANCE_CERT",config);
});

ACHR.registerHandler("NO_LIAB_CERT", function (config){
	var fm = new cbx.form.FormManager({
		formId : "FORM_NOLIAB_CERT",
		additionalConfig:{"FORM":'NO_LIAB_CERT'}
	});
	config={};
	config.appWidget = "WGT_ACC_FORM";
	config['EXIT_ACTION']='CANCEL';
	CBXFORMCONTAINER.getWindowByFormObj(fm,"CONTAINER_NOLIAB_CERT",config);
});


ACHR.registerHandler("PURCHASE_HASSAD_CERT", function (config){
	var fm = new cbx.form.FormManager({
		formId : "FORM_PURCHASE_HASSAD",
		additionalConfig:{"FORM":'PURCHASE_HASSAD'}
	});
	config={};
	config.appWidget = "WGT_ACC_FORM";
	config['EXIT_ACTION'] = 'CANCEL';
	CBXFORMCONTAINER.getWindowByFormObj(fm, "CONTAINER_PURCHASE_HASSAD", config);
});

