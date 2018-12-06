/**
 * Copyright 2012. Polaris Software Lab Limited. All rights reserved. These
 * materials are confidential and proprietary to Polaris Software Lab Limited
 * and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical,
 * photocopying, recording or otherwise, or stored in any information storage or
 * retrieval system of any nature nor should the materials be disclosed to third
 * parties or used in any other manner for which this is not authorized, without
 * the prior express written authorization of Polaris Software Lab Limited.
 * 
 * @author chiranjib.datta
 */
/**
 * DEPLOY_MODULE_ID: TODO: <Check with your lead for correct value>
 */
/**
 * <pre>
 * ----------------------------------------------------------------------------------------------------------------
 * CHANGE CODE 	             	AUTHOR 				DESCRIPTION 					DATE
 * ----------------------------------------------------------------------------------------------------------------
 * IR_ENHANCEMENTS_001		Dharmalingam			Added for entitlement issue			16 Jan 2013
 * 								communication Manager				02 Dec 2013
 * ----------------------------------------------------------------------------------------------------------------
 * </pre>
 */
Ext.namespace('canvas.informationRpt');
canvas.informationRpt.InfoRptBtnListener = function (){
	this.myfun=function(){
		this.refreshWidgetData();
	};
	this.loadReportFormApp=function(){
		var metadata={
					WIDGET_ID : 'REPORT_DEF_FORM_APP'
		};
		var widget = iportal.listview.listviewrenderermap.getWidget(metadata);
		widget.mv.setHeight(this.getHeight()-20);
		this.removeAll();
		this.mv.add(widget.mv);
		this.doLayout();
	};
	this.loadReportEmptyApp=function(){
		var metadata={
					WIDGET_ID : 'REPORT_DEF_EMPTY_APP'
		};
		var widget = iportal.listview.listviewrenderermap.getWidget(metadata);
		widget.mv.isLoadingToolsInside = true;
		this.removeAll();
		this.mv.add(widget.mv);
		this.doLayout();
	};
	this.rb = CRB.getFWBundle();
	// TO SAVE THE REPORT
	this.saveReportDefinition = function (fm, mvhObj, isBeforeSchedule){
		var resultArr = new Array();
		//var mvh=mvhObj;
		var needToLoadEmptyWidget = !isBeforeSchedule;
		resultArr.push(fm.getModelData());
		var reqobj = {
			"reportDetails" : resultArr
		};
		var config = {
			'fmObj':fm,
			'INPUT_ACTION' : 'SAVE_REPORT',
			'ADDITIONAL_PARAMS' : {
				'JSON_TO_HASH_MAP_SUPPORT_FLAG' : 'JSON_DATA',
				'JSON_DATA' : cbx.encode(reqobj)
			},
			'SUCCESS_HANDLER' : this.defaultSuccessHandler('LBL_REPORT_STATUS', 'MSG_REPORT_SAVE_SUCCESS', mvhObj, function (){
				var reportid=that.dialog.response.reportId;
				if(that.dialog.response.success=='true'){
					if (isBeforeSchedule) {								
						iportal.reportForm.callScheduleReport(reportid,fm);
					}
					that.dialog.close();
					//	mvh.refresh();
					//iportal.workspace.metadata.getCurrentWorkspace().find('itemId','REPORT_DEF_EMPTY_APP')[0].mv.id=iportal.workspace.metadata.getCurrentWorkspace().find('itemId','REPORT_DEF_EMPTY_APP')[0].mv.itemId;
					//iportal.workspace.metadata.getCurrentWorkspace().find('itemId','REPORT_DEF_EMPTY_APP')[0].mv.init();
					cbx.CommManager.raiseEvent('refreshAvailableReports');
				}else{
				  	that.dialog.close();
					}		
			}, needToLoadEmptyWidget),
			'FAILURE_HANDLER' : this.defaultErrorHandler('LBL_REPORT_STATUS', 'MSG_REPORT_SAVE_FAILURE')
		};
		this.doAjaxCall(config);
	};

	// TO SAVE AND RUN THE REPORT
	this.saveRunreportDefinition = function (fm, mvhObj){
		var values = fm.getModelData();
		var resultArr = new Array();
		resultArr.push(values);
		var reqobj = {
			"reportDetails" : resultArr
		};
		var config = {
			'fmObj':fm,
			'INPUT_ACTION' : 'SAVE_RUN_REPORT',
			'ADDITIONAL_PARAMS' : {
				'JSON_TO_HASH_MAP_SUPPORT_FLAG' : 'JSON_DATA',
				'JSON_DATA' : cbx.encode(reqobj)
			},
			'SUCCESS_HANDLER' : this.defaultSuccessHandler('LBL_REPORT_STATUS', 'MSG_REPORT_SAVE_AND_RUN_SUCCESS', mvhObj, null, true),
			'FAILURE_HANDLER' : this.defaultErrorHandler('LBL_REPORT_STATUS', 'MSG_REPORT_SAVE_AND_RUN_FAILURE')
		};
		this.doAjaxCall(config);
	//	iportal.workspace.metadata.getCurrentWorkspace().find('itemId','REPORT_DEF_EMPTY_APP')[0].mv.id=iportal.workspace.metadata.getCurrentWorkspace().find('itemId','REPORT_DEF_EMPTY_APP')[0].mv.itemId;
		//iportal.workspace.metadata.getCurrentWorkspace().find('itemId','REPORT_DEF_EMPTY_APP')[0].mv.init();
		cbx.CommManager.raiseEvent('refreshAvailableReports');
		cbx.CommManager.raiseEvent('refreshGeneratedReports');
	};
	// TO RUN THE REPORT
	this.runReportDefinition = function (fm, mvhObj){
		var values = fm.getModelData();
		var resultArr = new Array();
		resultArr.push(values);
		var reqobj = {
			"reportDetails" : resultArr
		};
		var config = {
			'fmObj':fm,
			'INPUT_ACTION' : 'RUN_REPORT',
			'ADDITIONAL_PARAMS' : {
				'JSON_TO_HASH_MAP_SUPPORT_FLAG' : 'JSON_DATA',
				'JSON_DATA' : cbx.encode(reqobj)
			},
			'SUCCESS_HANDLER' : this.defaultSuccessHandler('LBL_REPORT_STATUS', 'MSG_REPORT_RUN_SUCCESS', mvhObj, null, true),
			'FAILURE_HANDLER' : this.defaultErrorHandler('LBL_REPORT_STATUS', 'MSG_REPORT_RUN_FAILURE')
		};
		this.doAjaxCall(config);
	//	iportal.workspace.metadata.getCurrentWorkspace().find('itemId','REPORT_DEF_EMPTY_APP')[0].mv.id=iportal.workspace.metadata.getCurrentWorkspace().find('itemId','REPORT_DEF_EMPTY_APP')[0].mv.itemId;
		//iportal.workspace.metadata.getCurrentWorkspace().find('itemId','REPORT_DEF_EMPTY_APP')[0].mv.init();
		cbx.CommManager.raiseEvent('refreshGeneratedReports');
	};

	// TO SAVE THE REPORT SCHEDULE
	this.saveAndScheduleReportDefinition = function (scheduleFm, mvhObj, winObj){
		var scheduleData = scheduleFm.getModelData();
		var resultArr = new Array();
		resultArr.push(scheduleData);
		var win=winObj;
		var mvh=mvhObj;
		var reqobj = {
			"reportDetails" : resultArr
		};

		var config = {
			'fmObj':scheduleFm,
			'INPUT_ACTION' : 'SAVE_SCHEDULE_REPORT',
			'ADDITIONAL_PARAMS' : {
				'JSON_TO_HASH_MAP_SUPPORT_FLAG' : 'JSON_DATA',
				'JSON_DATA' : cbx.encode(reqobj)
			},
			'SUCCESS_HANDLER' : this.defaultSuccessHandler('LBL_REPORT_STATUS', 'MSG_REPORT_SCHEDULE_SUCCESS', mvhObj, function(){
				that.dialog.close();
				win.close();
				//mvh.refresh();
				cbx.CommManager.raiseEvent('loadReportEmptyApp');
			}, true),
			'FAILURE_HANDLER' : this.defaultErrorHandler('LBL_REPORT_STATUS', 'MSG_REPORT_SCHEDULE_FAILURE')
		};
		this.doAjaxCall(config);
		
	};

	// TO DOWNLOAD REPORT
	this.getDownloadReport = function (reportinstId, config){
		
		var fileType =config.record.json.FORMAT_NAME;
		var reportName=config.record.json.REPORT_NAME;
		var archievPath =iportal.systempreferences.getInfoRepFWArchivedPath();
		var downloadFileName = reportName+'_'+reportinstId+'.'+fileType.toLowerCase();
		var clientFileName = reportName+reportinstId+'.'+fileType.toLowerCase(); 
		var url = iportal.workspace.metadata.getContextRoot() + "/FileAttachDownloadServlet?" +
						"PAGE_CODE_TYPE=RDF_CODE" +
						"&PRODUCT_NAME=CANVAS" +
						"&INPUT_SUB_PRODUCT=CANVAS" +
						"&INPUT_FUNCTION_CODE=VSBLTY" +
						"&INPUT_ACTION=FILEATTACH_DOWNLOAD_ACTION" +
						"&DOWNLOAD_FILENAME="+downloadFileName+
						"&TRANS_REF_NO_DOWNLOAD="+reportinstId +
						"&CLIENT_DOWNLOAD_FILENAME="+clientFileName+
						"&PUBLISHED_REP_ARCHIEVED_PATH="+archievPath+
						"&FILE_TYPE="+fileType.toLowerCase();
				
				iportal.openNewWindow(url);
		
	};
	//IR_ENHANCEMENTS_001 -- Starts
	//RUN NOW
	this.startRunNow = function (reportinstId, reportProdCode, reportSubProdCode, reportFuncCode, mvhObj){
		Ext.Ajax.request({
			url : iportal.jsutil.getController(),
			method : 'post',
			params : {
				'PAGE_CODE_TYPE' : 'RDF_CODE',
				'INPUT_PRODUCT' : reportProdCode,
				'INPUT_ACTION' : 'RUN_REPORT_INSTANCE',
				'INPUT_FUNCTION_CODE' : reportFuncCode,
				'INPUT_SUB_PRODUCT' : reportSubProdCode,
				'PRODUCT_NAME' : reportProdCode,
				'REPORT_INSTANCE_ID' : reportinstId,
				'REPORT_PROD_CODE' : reportProdCode,
				'REPORT_SUB_PROD_CODE' : reportSubProdCode,
				'REPORT_FUNC_CODE' : reportFuncCode
			},
	//IR_ENHANCEMENTS_001 -- Ends
			scope : this,
			success : function (resp, ob){
				var rb = CRB.getFWBundle();
				mvhObj.refresh();
				var responseData = Ext.decode(resp.responseText);
				var responseinst = responseData.REPORT_INSTANCE_ID;								
				
				var display_msg = '';
				if (resp.LBL_SIMULATION_MODE_SUCCESS_MESSAGE) {
					display_msg = rb['MSG_SIMULATION_MODE_MESSAGE'] + "<br/>";
				}
				if("false" == responseData.success && "ERROR" == responseData.REPLY_TYPE){
					that.dialog = new iportal.Dialog({
						dialogType : 'ERROR',
						title : rb['LBL_REPORT_STATUS'],
						message : display_msg+''+responseData.ERR_MESS, //responseData.ERR_MESS,
						okHandler : function (){
							that.dialog.close();
						},
						response: Ext.decode(resp.responseText)
					});
					that.dialog.show();
				}else{
					that.dialog = new iportal.Dialog({
						dialogType : 'MESSAGE',					
						title : rb['LBL_REPORT_STATUS'],
						message : display_msg+''+rb['MSG_REPORT_RUN_NOW_SUCCESS']+ ' ' + responseinst,	//rb['MSG_REPORT_RUN_NOW_SUCCESS']+ ' ' + responseinst,			
						okHandler : function (){
							that.dialog.close();
						},
						response: Ext.decode(resp.responseText)
					});
					that.dialog.show();
				}
			},
			failure : function (resp, ob){
				var display_msg = '';
				if (resp.LBL_SIMULATION_MODE_SUCCESS_MESSAGE) {
					display_msg = rb['MSG_SIMULATION_MODE_MESSAGE'] + "<br/>";
				}
				var failurewin = new iportal.Dialog({
					dialogType : 'ERROR',
					title : rb['LBL_REPORT_STATUS'],
					message : display_msg+''+rb['MSG_REPORT_RUN_NOW_FAILURE'], //rb['MSG_REPORT_RUN_NOW_FAILURE'],
					okHandler : function (){
						failurewin.close();
					}
				});
				failurewin.show();

			}
		});
	};
	//IR_ENHANCEMENTS_001 -- Starts
	// TO DELETE AN AVAILABLE REPORT
	this.deleteReportDefinition = function (reportId, reportProdCode, reportSubProdCode, reportFuncCode, isScheduled, mvhObj){
		if (isScheduled == 'Y') {
			var message = this.rb['CONFIRM_MSG_SCHEDULE_REPORT_DELETE'];
		} else {
			var message = this.rb['CONFIRM_MSG_REPORT_DELETE'];
		}
		var listener = this;
		
		
		var confirmation_Dialog = new iportal.Dialog({
			dialogType : 'WARNING',
			title : listener.rb['LBL_CONFIRMATION'],
			message : message,
			okHandler : function (){
				var reqobj = {
						'REPORT_ID' : reportId,
						'REPORT_PROD_CODE' : reportProdCode,
						'REPORT_SUB_PROD_CODE' : reportSubProdCode,
						'REPORT_FUNC_CODE' : reportFuncCode,
						'IS_SCHEDULED' : isScheduled
					};
	//IR_ENHANCEMENTS_001 -- Ends
				var config = {
						'INPUT_ACTION' : 'DELETE_REPORT',
						'ADDITIONAL_PARAMS' : {
							'JSON_TO_HASH_MAP_SUPPORT_FLAG' : 'JSON_DATA',
							'JSON_DATA' : Ext.encode(reqobj)
						},
						'SUCCESS_HANDLER' : listener.defaultSuccessHandler('LBL_REPORT_STATUS',	'MSG_REPORT_DELETE_SUCCESS', mvhObj, null, true),
						'FAILURE_HANDLER' : listener.defaultErrorHandler('LBL_REPORT_STATUS', 'MSG_REPORT_DELETE_FAILURE')
					};
				//listener.doAjaxCall(config);
				//

				if (!Ext.isEmpty(config.INPUT_ACTION)) {
					var params = {
						'INPUT_PRODUCT' : reqobj.REPORT_PROD_CODE,
						'INPUT_FUNCTION_CODE' : reqobj.REPORT_FUNC_CODE,
						'INPUT_SUB_PRODUCT' : reqobj.REPORT_SUB_PROD_CODE,
						'PRODUCT_NAME' : reqobj.REPORT_PROD_CODE,
						'PAGE_CODE_TYPE' : 'RDF_CODE',
						'INPUT_ACTION' : config.INPUT_ACTION
					};
					Ext.apply(params, config.ADDITIONAL_PARAMS);
					Ext.Ajax.request({
						url : iportal.jsutil.getController(),
						method : 'post',
						params : params,
						scope : this,
						success : config.SUCCESS_HANDLER,
						failure : config.FAILURE_HANDLER
					});
				}
			
				//
				confirmation_Dialog.close();
				//iportal.workspace.metadata.getCurrentWorkspace().find('itemId','REPORT_DEF_EMPTY_APP')[0].mv.id=iportal.workspace.metadata.getCurrentWorkspace().find('itemId','REPORT_DEF_EMPTY_APP')[0].mv.itemId;
				//iportal.workspace.metadata.getCurrentWorkspace().find('itemId','REPORT_DEF_EMPTY_APP')[0].mv.init();
				cbx.CommManager.raiseEvent('refreshAvailableReports');
			},
			cancelHandler : function (){
				confirmation_Dialog.close();
			}
		});
		confirmation_Dialog.show();
	};
	
	/**
	 * This method is used to do the ajax call to the reporting framework with
	 * following params. INPUT_ACTION : String. Mandatory. ADDITIONAL_PARAMS :
	 * Object. If any additional parameters required. SUCCESS_HANDLER : Method.
	 * This handler will be called the ajax returns SUCCESS status.
	 * FAILURE_HANDLER : Method. This handler will be called the ajax returns
	 * FAILURE status.
	 */
	this.doAjaxCall = function (config){
		if (!Ext.isEmpty(config.INPUT_ACTION)) {
			var params = {
				'INPUT_PRODUCT' : config.fmObj.model.getValue('REPORT_PROD_CODE'),
				'INPUT_FUNCTION_CODE' : config.fmObj.model.getValue('REPORT_FUNC_CODE'),
				'INPUT_SUB_PRODUCT' : config.fmObj.model.getValue('REPORT_SUB_PROD_CODE'),
				'PRODUCT_NAME' : config.fmObj.model.getValue('REPORT_PROD_CODE'),
				'PAGE_CODE_TYPE' : 'RDF_CODE',
				'INPUT_ACTION' : config.INPUT_ACTION
			};
			Ext.apply(params, config.ADDITIONAL_PARAMS);
			Ext.Ajax.request({
				url : iportal.jsutil.getController(),
				method : 'post',
				params : params,
				scope : this,
				success : config.SUCCESS_HANDLER,
				failure : config.FAILURE_HANDLER
			});
		}
	};

	/**
	 * The success handler will display the dialog with given title and message after the success of the ajax call.
	 * */
	this.defaultSuccessHandler = function (title, message, mvhObj, okHandler, needToLoadEmptyWidget){

		if (Ext.isEmpty(okHandler)) {
			okHandler = function (){
				that.dialog.close();
			};
		}

		return function (response, opts){

			var resp = Ext.decode(response.responseText);
			var rb = CRB.getFWBundle();
			// if(resp.RETAIN_CALLBACKS){}else{
			var display_msg = '';
			if (resp.LBL_SIMULATION_MODE_SUCCESS_MESSAGE) {
				display_msg = rb['MSG_SIMULATION_MODE_MESSAGE'] + "<br/>";
			}
			if ("false" == resp.success && "ERROR" == resp.REPLY_TYPE) {
				that.dialog = new iportal.Dialog({
					dialogType : 'ERROR',
					title : rb[title],
					message : display_msg + '' + resp.ERR_MESS, // resp.ERR_MESS,
					okHandler : okHandler,
					response : resp
				});
				that.dialog.show();
			} else {
				if (needToLoadEmptyWidget == true) {
					//this.loadEmptyWidget(mvhObj);
				}

				//mvhObj.refresh();
				that.dialog = new iportal.Dialog({
					dialogType : 'MESSAGE',
					title : rb[title],
					message : display_msg + '' + rb[message], // rb[message],
					okHandler : okHandler,
					response : resp
				});
				that.dialog.show();
			}
			// }

		};
	};

	/**
	 * The error handler will display the dialog with given title and error
	 * message after the failure of the ajax call.
	 */
	this.defaultErrorHandler = function (title, message){
		
		return function (response, opts){
			var display_msg = '';
			if (response.LBL_SIMULATION_MODE_SUCCESS_MESSAGE) {
				display_msg = rb['MSG_SIMULATION_MODE_MESSAGE'] + "<br/>"+''+this.rb[message];
			}else{
				display_msg=this.rb[message];
			}
			that.showErrorDialog(this.rb[title], display_msg);//this.rb[message]);
		};
	};

	/**
	 * This method will display the error dialog with given title and error message.
	 * */
	this.showErrorDialog = function (title, message){
		that.dialog = new iportal.Dialog({
			dialogType : 'ERROR',
			title : title,
			message : message,
			okHandler : function (){
				that.dialog.close();
			}
		});
		that.dialog.show();
	};
	this.dialog = null;
	this.that = this;
};


// information reporting validator
canvas.informationRpt.validator = function (){
	err_Dialog=null;
	var rb =  CRB.getFWBundle();
	this.validateSave = function (fm){
		
		var errorMessage = rb['MSG_MANDATORY_ATTRIBUTES'] + '<BR/>';
		var reportname = fm.model.getValue('REPORT_NAME');
		var isInValidReportName = Ext.isEmpty(reportname) || reportname.trim() == '';
		if (isInValidReportName == true) {
			errorMessage = errorMessage + rb['LBL_REPORT_NAME']+'<BR/>';
		}else if(reportname.length >40){// Added for iSolve SIT - #779(B) - IR_ENHANCEMENTS_001
		//}else if(reportname.length >=40){ // commented for iSolve SIT - #779(B) - IR_ENHANCEMENTS_001
			errorMessage = rb['MSG_REPORT_NAME_LENGTH_INVALID'] + '<BR/>'; + rb['LBL_REPORT_NAME']+'<BR/>';
			isInValidReportName = true; // Added for iSolve SIT - #779(B) - IR_ENHANCEMENTS_001
		}
		var format = fm.model.getValue('REPORT_FORMAT');
		var isValidFormat = Ext.isEmpty(format) || format.trim() == '';
		if (isValidFormat == true) {
			errorMessage = errorMessage + rb['LBL_REPORT_FORMAT']+'<BR/>';
		}
		var columnname = fm.model.getValue('REPORT_SELECTED_COLS');
		var isInValidColumnName = Ext.isEmpty(columnname) || columnname == null;
		if (isInValidColumnName == true) {
			errorMessage = errorMessage +rb['LBL_SELECTED_COLUMNS']+'<BR/>';
		}
		if ((isInValidReportName == true) || (isValidFormat == true)  ||(isInValidColumnName == true)) {
			var err_Dialog = new iportal.Dialog({
				dialogType : 'ERROR',
				title : rb['LBL_VALIDATION_ERROR'],
				message : errorMessage,
				okHandler : function (){
					err_Dialog.close();
				}
			});
			err_Dialog.show();
			return false;
		}else{
			return true;
		}
		 /*if (fm.isFormValid()) {
		
		} */
	}, this.validateSchedule = function (fm){
		return this.validateSave(fm);
	}, this.validateSaveRun = function (fm){
		return this.validateSave(fm);
	}, this.validateRun = function (fm){
		return this.validateSave(fm);
	},
	this.confirmationDialog =function(msg,successHandler){
		var that=this;
		this.err_Dialog = new iportal.Dialog({
			dialogType : 'WARNING',
			title : rb['LBL_CONFIRMATION'],
			message : msg,
			okHandler : successHandler,
			cancelHandler : function (){
				that.err_Dialog.close();
			}
		});
		this.err_Dialog.show();
	},this.closeconfirmationDialog=function(){
		this.err_Dialog.close();
	}

};



// information reporting btn handler

canvas.informationRpt.btnHandler = function (){
	/**
	 * This method is used to SAVE/UPDATE the report definition.
	 */
	this.validator = new canvas.informationRpt.validator();
	this.listener = new canvas.informationRpt.InfoRptBtnListener();
	this.saveReportDefinition = function (fm, mvhObj)
	{
		var that = this;
		this.bundle=CRB.getFWBundle();
		if (this.validator.validateSave(fm) == true)
		{
			if (fm.isFormDataChanged() == true)
			{
				var isScheduled = fm.model.getValue('IS_SCHEDULED_REPORT');
				if (isScheduled == 'Y')
				{
					this.validator.confirmationDialog(this.bundle['SAVE_REPORT_CONFIRMATION_MSG_IF_SCHEDULED'], function ()
					{
						listener.saveReportDefinition(fm, mvhObj, false);
						that.validator.closeconfirmationDialog();
					});
				} else
				{
					this.listener.saveReportDefinition(fm, mvhObj, false);
				}
			} else
			{
				this.listener.showErrorDialog('SaveChanges', this.bundle['MSG_NO_CHANGE_IN_DATA']);
			}
		}
	};

	/**
	 * This method is used to SAVE_AND_RUN the report definition.
	 */
	this.saveRunreportDefinition = function (fm, mvhObj)
	{
		var that = this;
		this.bundle=CRB.getFWBundle();
		if (this.validator.validateSaveRun(fm) == true)
		{
			if (fm.isFormDataChanged() == true)
			{
				var isScheduled = fm.model.getValue('IS_SCHEDULED_REPORT');
				if (this.isScheduled == 'Y')
				{
					var that = this;
					this.validator.confirmationDialog(this.bundle['SAVE_AND_RUN_REPORT_CONFIRMATION_MSG_IF_SCHEDULED'],
								function ()
								{
									that.listener.saveRunreportDefinition(fm, mvhObj);
									that.validator.closeconfirmationDialog();
								});
				} else
				{
					this.listener.saveRunreportDefinition(fm, mvhObj);
				}
			} else
			{
				this.listener.showErrorDialog('SaveChanges', this.bundle['MSG_NO_CHANGE_IN_DATA']);
			}
		}
	};

	/**
	 * This method is used to RUN the report definition.
	 */
	this.runReportDefinition = function (fm, mvhObj)
	{
		if (this.validator.validateRun(fm) == true)
		{
			this.listener.runReportDefinition(fm, mvhObj);
		}
	};

	/**
	 * This method is used to SAVE/UPDATE the report definition.
	 */
	this.saveReportDefinitionBeforeSchedule = function (fm, mvhObj)
	{
		var that = this;
		var mvh = mvhObj;
		this.bundle=CRB.getFWBundle();
		if (this.validator.validateSchedule(fm) == true)
		{
			if (fm.isFormDataChanged() == true || fm.model.dataChanged == true
						|| fm.additionalConfig.SORT_COLS_IGNORED == true)
			{
				var that = this;
				this.validator.confirmationDialog(this.bundle['SAVE_AND_SCHEDULE_REPORT_CONFIRMATION_MSG_IF_NOT_SAVED'],
							function ()
							{
								that.listener.saveReportDefinition(fm, mvh, true);
								that.validator.closeconfirmationDialog();
							});
			} else
			{
				iportal.reportForm.callScheduleReport(fm.model.getValue('REPORT_ID'), fm, mvh);
			}
		}
	};

	/**
	 * This method is used the RESET the form components in the page.
	 */
	this.resetReportDefinitionForm = function (fm)
	{
		var bundle=CRB.getFWBundle();
		var confirmDialog = new iportal.Dialog({
			dialogType : 'USERDEFINED',
			dialogStyle : 'YES_NO',
			title : bundle['LBL_CONFIRM_RESET_TITLE'],
			message : bundle['LBL_CONFIRM_RESET_REPORT_SETTING'],
			yesHandler : function ()
			{
				confirmDialog.close();
				fm.reset();
				var store = fm.listenerScope.filterGridPanel.store;
				var filterList = fm.model.getValue("REPORT_FILTER_LIST");
				/**
				 * REMOVE THE STORE IF ANY DATA IS AVAILABLE IN THE STORE.
				 */
				if (store)
				{
					store.removeAll();
					/**
					 * Loop through the filter list and set
					 */
					if (!Ext.isEmpty(filterList))
					{
						for (var i = 0; i < filterList.length; i++)
						{
							store.add(new store.recordType({
								filterColumn : filterList[i].FILTERCOLUMN,
								filterCriteriaToDisplay : filterList[i].FILTER_CRIT_TO_DISP,
								filterCriteriaToSend : filterList[i].FILTERCRITERIA,
								data : filterList[i].DATA
							}));
						}
					}
					fm.listenerScope.updateRecord(fm, store);
				}
			},
			noHandler : function ()
			{
				confirmDialog.close();
			}
		});
		confirmDialog.show();
	};

	/**
	 * This method is used the DELETE the report definition.
	 */
	this.deleteReportDefinition = function (fm, mvhObj)
	{
		var isScheduled = fm.model.getValue('IS_SCHEDULED_REPORT');
		var reportId = fm.model.getValue('REPORT_ID');
		var reportProdCode = fm.model.getValue('REPORT_PROD_CODE');
		var reportSubProdCode = fm.model.getValue('REPORT_SUB_PROD_CODE');
		var reportFuncCode = fm.model.getValue('REPORT_FUNC_CODE');
		this.listener.deleteReportDefinition(reportId, reportProdCode, reportSubProdCode, reportFuncCode, isScheduled,mvhObj);
	};
	
};

