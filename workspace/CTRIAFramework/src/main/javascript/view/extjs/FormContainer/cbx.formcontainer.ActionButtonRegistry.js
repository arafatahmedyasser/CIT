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
cbx.ns('cbx.formcontainer');
cbx.formcontainer.defaultActionBtnHandler = function (config){
	var cons = cbx.formcontainer.constants;
	var rb = CRB.getFWBundle();
	var formObj = config.formObj;
	var formId = formObj.formId;
	var values = formObj.getModelData();
	var formConRenderType = config.formConRenderType;	
	var json_values = Ext.encode(values);
	var confirmReqd = "false";
	var status = "";
	var reqType = "";
	var JSONArr = {}; 

	for ( var i in values) {

		if (i != cons.SELECTED_RECORDS) {
			JSONArr[i] = values[i];
		}
	}
	if (config.eventPreProcessors != undefined) {
		
		if (config.eventPreProcessors.PRE_CONFIRM_IND != undefined && config.eventPreProcessors.PRE_CONFIRM_IND == "Y") {
			confirmReqd = "true";
			status = "PR"; // New Status assigned for Pre-Confirmation
		} else if (config.eventPreProcessors.PRE_CONFIRM_IND != undefined && config.eventPreProcessors.PRE_CONFIRM_IND == "N") {
			confirmReqd = "true";
			status = config.txnStatus;
		} else {
			status = config.txnStatus;
		}
		if (config.eventPreProcessors.REAUTH_TYPE != undefined && config.eventPreProcessors.REAUTH_TYPE !=""
				&& config.eventPreProcessors.REAUTH_TYPE !="NA") {
			if (config.requestType == "" || config.requestType == null) {
				config.requestType = cons.INITIATE; 
				confirmReqd = "true";
				status = "PR";
			}
		}
	} else {
		status = config.txnStatus;
	}

	var ajaxParams = {
		INPUT_TXN_STATUS : status,
		REQUEST_TYPE : config.requestType,
		INPUT_ACTION : config.actionCode,
		INPUT_FUNCTION_CODE : config.functionCode,
		INPUT_SUB_PRODUCT : config.subProdCode,
		INPUT_PRODUCT : config.productCode,
		PAGE_CODE_TYPE : config.pageCode,
		INPUT_CHANNEL_ID : cons.INPUT_CHANNEL_ID_VALUE,
		INPUT_CUST_TYPE : cons.INPUT_CUST_TYPE_VALUE,
		ODTXNTYPE : cons.ODTXNTYPE_VALUE,
		INPUT_CONFIRMATION : cons.INPUT_CONFIRMATION_VALUE,
		PRODUCT_NAME : config.productCode,
		IS_CONFORM_PAGE_REQD : confirmReqd
	};
	if (values[cons.SIGN_CHALLENGE]) {
		ajaxParams[cons.SIGN_CHALLENGE] = values[cons.SIGN_CHALLENGE];
	}
	var secreteCodeKey = config.eventPreProcessors.ITEM_ID;
	if (values[cons.SIGN_RESPONSE]) { 
		ajaxParams[cons.SIGN_RESPONSE] = values[secreteCodeKey]; 
	}
	if (values.SELECTED_RECORDS != undefined){
		ajaxParams["SELECTED_RECORDS"] = Ext.encode(values.SELECTED_RECORDS);
	} else {
		ajaxParams['INPUT_MODE'] = cons.CONFORM_SUBMIT;
		ajaxParams['JSON_TO_HASH_MAP_SUPPORT_FLAG'] = 'JSON_DATA';
		ajaxParams['JSON_DATA'] = json_values;
	}
	
	
	if(values["KEY_OTP"]){
		ajaxParams['REQUEST_TYPE']="VALIDATE";
	}
	
	
	if ((status != "DR" && formObj.isFormValid()) || status == "DR") {
		
		Ext.Ajax.request({
			params : ajaxParams,
			success : function (result, request){
				var respData = Ext.decode(result.responseText);
				var data = {};		
				if (respData.RECORDS!= undefined && respData.RECORDS[0].TXN_HEADER_DATA != undefined ) {  
					data = respData.RECORDS[0];
				} else if(respData.TXN_HEADER_DATA != undefined ){
					data = respData;
				}
				else if(respData.DETAIL!=null && respData.DETAIL.INPUT_REFERENCE_NO==''){
					
					data = respData;
				}
				else {
					
					var errorWin = new iportal.Dialog({
						dialogType : 'ERROR',
						title : rb.LBL_ERROR,
						message : rb.ERR_SORRY_MSG_FOR_FAIL,
						okHandler : function (){
							errorWin.close();
						}

					});
					errorWin.show();
					return;
				}
				var headerVal = {};
				if (respData.HEADER_VALUE != undefined) {
					data.HEADER_VALUE = respData.HEADER_VALUE;
				}
				var txnHdrData = {};
				var formData = {};
				// Transaction header data
				if (data.TXN_HEADER_DATA != undefined && data.TXN_HEADER_DATA.TXN_HEADER_DATA != undefined) {
					txnHdrData = data.TXN_HEADER_DATA.TXN_HEADER_DATA;
				}
				// Form data
				if (data.DETAIL != undefined) {
					formData = data.DETAIL;
				} else if (data.TXN_FORM_DATA != undefined) {
					formData = data.TXN_FORM_DATA;
				}
				// Signed Data for Transaction Signing 
				if (data.SIGNED_DATA != undefined) {
					values[cons.SIGN_CHALLENGE] = data.SIGNED_DATA; 
					txnHdrData[cons.SIGN_CHALLENGE] = data.SIGNED_DATA; 
					for ( var i in txnHdrData) {
						if (i != cons.OD_STATUS) { 
							values[i] = txnHdrData[i]; 
						}
					}
				}
				
				// To form a single data Array from both the Transaction header
				// data
				// and form data
				for ( var i in formData) {
					txnHdrData[i] = formData[i];
				}
				var parentWin = Ext.WindowMgr.getActive();
				var ownerPanel = null;
				if(parentWin){
					parentWin.close();
				}
				data.appWidget = config.appWidget; 
				data.formConRenderType=config.formConRenderType;
				data.IS_MULTIPLE_FORM_CONTAINER=config.IS_MULTIPLE_FORM_CONTAINER;
				if (config.eventPreProcessors != undefined) {
					if (config.eventPreProcessors.PRE_CONFIRM_IND != undefined && config.eventPreProcessors.PRE_CONFIRM_IND == "Y") {
						
						if(config.eventPreProcessors.REAUTH_TYPE !='' && config.eventPreProcessors.REAUTH_TYPE !='NA'){
							
							if(config.requestType == cons.VALIDATE && data.SIGNED_FLAG == cons.FAILURE){
								
								if (data.TXN_SIGN_DETAILS != undefined && data.TXN_SIGN_DETAILS.SIGN_ATTEMPTS_LEFT != undefined
										&& data.TXN_SIGN_DETAILS.SIGN_ATTEMPTS_LEFT != "0") {
									
									PRECONFIRMPROCESSOR.getPreConfirmWindow(formObj, config, txnHdrData,data);
								}
								else if (data.TXN_SIGN_DETAILS != undefined && data.TXN_SIGN_DETAILS.SIGN_ATTEMPTS_LEFT != undefined
										&& data.TXN_SIGN_DETAILS.SIGN_ATTEMPTS_LEFT == "0") {
									var cusrb = CRB.getFWBundle();
									var fm = new cbx.form.FormManager({
										formId : "FORM_TXN_CONF_REC",
										modelData : {
									
											"OD_REF_NO":respData.DETAIL.OD_REF_NO,
											//"OD_STATUS" : rb["LBL_TRANSACTION_FAILURE"],
											"OD_STATUS" : cusrb["LBL_TRANSACTION_FAILURE"],
											"OD_MAKER_DATE":iportal.jsutil.getFormattedDateAndTimeNoTZ(iportal.jsutil.convertDateObjectToStandardFmt(respData.HEADER_VALUE.TXN_PROCESS_DATE_TIME)),
											"NOTE":rb["LBL_TRANSACTION_NOTES"],
											"TXN_STATUS":'FAILED'
										}
									});
									var conf=[];
									conf["EXIT_ACTION"]="CUSTOM";
									conf.formConRenderType=config.formConRenderType;
									conf.appWidget = config.appWidget;
									
									CBXFORMCONTAINER.doTransaction("END");
									
									CBXFORMCONTAINER.getWindowByFormObj(fm,"CONTAINER_TXN_CONF",conf);
								}
							}
							else if(config.requestType == cons.VALIDATE && data.SIGNED_FLAG == 'SUCCESS'){
								
								CBXFORMCONTAINER.doTransaction("END");
								
								new cbx.formcontainer.confScreenHandler(config,txnHdrData,data);
							}
							else {
									
									CBXFORMCONTAINER.doTransaction("END");
									
									PRECONFIRMPROCESSOR.getPreConfirmWindow(formObj, config, txnHdrData,data);
								}
							}
						else if(config.eventPreProcessors.REAUTH_TYPE != null && config.eventPreProcessors.REAUTH_TYPE =='NA' ||
								config.eventPreProcessors.REAUTH_TYPE ==''){
									
									CBXFORMCONTAINER.doTransaction("END");
									
							PRECONFIRMPROCESSOR.getPreConfirmWindowOnly(formObj, config,data);
						}
						else {
								
								CBXFORMCONTAINER.doTransaction("END");
								
								new cbx.formcontainer.confScreenHandler(config,txnHdrData,data);
							}
						}
					
					// for all the pre confirmation disabled flows.
					else if(config.eventPreProcessors.PRE_CONFIRM_IND!= null  && config.eventPreProcessors.PRE_CONFIRM_IND == "" ||config.eventPreProcessors.PRE_CONFIRM_IND == 'N' ){
						
						if(config.eventPreProcessors.REAUTH_TYPE !='' && config.eventPreProcessors.REAUTH_TYPE !='NA'){
							
							if(config.requestType == cons.VALIDATE && data.SIGNED_FLAG == cons.FAILURE){
								
								if (data.TXN_SIGN_DETAILS != undefined && data.TXN_SIGN_DETAILS.SIGN_ATTEMPTS_LEFT != undefined
										&& data.TXN_SIGN_DETAILS.SIGN_ATTEMPTS_LEFT != "0") {
									
									
									
									formObj.isFormValid();
									var cuserbundle = CRB.getFWBundle();
									var msgAuthType = "MSG_INV_"+config.eventPreProcessors.REAUTH_TYPE;  // added for handeling mesage in 2fa
									
									if(data.REAUTH_ERR_CODE != null && data.REAUTH_ERR_CODE != ""){
										formObj.markInvalid(config.eventPreProcessors.ITEM_ID,cuserbundle[data.REAUTH_ERR_CODE]);
									}
									else {
										formObj.markInvalid(config.eventPreProcessors.ITEM_ID,cuserbundle['MSG_INVALID_PWD']+' '+cuserbundle[msgAuthType]);
									}
									
									
																	}
								else if (data.TXN_SIGN_DETAILS != undefined && data.TXN_SIGN_DETAILS.SIGN_ATTEMPTS_LEFT != undefined
										&& data.TXN_SIGN_DETAILS.SIGN_ATTEMPTS_LEFT == "0") {
								var cusrb = CRB.getFWBundle();
									var fm = new cbx.form.FormManager({
										formId : "FORM_TXN_CONF_REC",
										modelData : {
											"OD_REF_NO":respData.DETAIL.OD_REF_NO,
											//"OD_STATUS" : rb["LBL_TRANSACTION_FAILURE"],
											"OD_STATUS" :  cusrb["LBL_TRANSACTION_FAILURE"],
											"OD_MAKER_DATE":iportal.jsutil.getFormattedDateAndTimeNoTZ(iportal.jsutil.convertDateObjectToStandardFmt(respData.HEADER_VALUE.TXN_PROCESS_DATE_TIME)),
											"NOTE":rb["LBL_TRANSACTION_NOTES"],
											"TXN_STATUS":'FAILED'
										}
									});
									var conf=[];
									conf["EXIT_ACTION"]="CUSTOM";
									conf.appWidget = config.appWidget;
									conf.formConRenderType=config.formConRenderType;
									
									CBXFORMCONTAINER.doTransaction("END");
									
									CBXFORMCONTAINER.getWindowByFormObj(fm,"CONTAINER_TXN_CONF",conf);
								}
							}
							else if(config.requestType == cons.VALIDATE && data.SIGNED_FLAG == 'SUCCESS'){
								CBXFORMCONTAINER.doTransaction("END");
								new cbx.formcontainer.confScreenHandler(config,txnHdrData,data);
							}
							else {
								CBXTXNSIGNING.getpreCofDisabledWindow(config,formObj,values,data);
							}
							}
						else {
							
							CBXFORMCONTAINER.doTransaction("END");
							
							new cbx.formcontainer.confScreenHandler(config,txnHdrData,data);
							
						}
					}
				
				} else {
					new cbx.formcontainer.confScreenHandler(config,txnHdrData,data);
				}

			},
			
			failure : function (result, request){

				// To display an error window on failure of AJAX
				var errorWin = new iportal.Dialog({
					dialogType : 'ERROR',
					title : rb.LBL_ERROR,
					message : rb.ERR_SORRY_MSG_FOR_FAIL,
					okHandler : function (){
						errorWin.close();
					}

				});
				errorWin.show();
			}
		});

	}

};
