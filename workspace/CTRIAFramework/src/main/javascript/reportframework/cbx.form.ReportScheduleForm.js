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
 * @author papiya.bhowmik
 */
/**
 * DEPLOY_MODULE_ID: OT0138_INFO_RPT_FW
 */
/**
 * <pre>
 * ----------------------------------------------------------------------------------------------------------------
 * CHANGE CODE 	             	AUTHOR 				DESCRIPTION 					DATE
 * ----------------------------------------------------------------------------------------------------------------
 * CHG0001_OT0138_INFO_RPT_FW   Murali R			Updated the Reset method                        06 Sep 2012
 * IR_ENHANCEMENTS_001		Dharmalingam			1. For resest issue in schedule form		16 Jan 2013
 * 								2. Increased the schedule report window width
 *                                                              3. Appropriate error messages for Save Schedule 15 Jan 2013
 * 								button in the Report Schedule Screen.	
 * 								4. Updated to prompt user to confirm the 
 * 								cancel action for report schedule.
 * ----------------------------------------------------------------------------------------------------------------
 * </pre>
 */

Ext.ns('iportal.reportForm');
iportal.reportForm.callScheduleReport = function (reportid,parentFm,mvhObj){
	var winObj;
	var reportnameToset = "--";
	var scheduleTypeToset = "";
	var scheduleFreqValueToSet = "";
	var rb =  CRB.getFWBundle();
	if (parentFm.model.getValue('REPORT_NAME') != null && !Ext.isEmpty(parentFm.model.getValue('REPORT_NAME'))) {
		reportnameToset = parentFm.model.getValue('REPORT_NAME');
	}
	/*
	 * if (parentFm.model.getValue('SCHEDULE_START_DATE') != null &&
	 * !Ext.isEmpty(parentFm.model.getValue('SCHEDULE_START_DATE'))) {
	 * startDateToset = parentFm.model.getValue('SCHEDULE_START_DATE'); } if
	 * (parentFm.model.getValue('SCHEDULE_END_DATE') != null &&
	 * !Ext.isEmpty(parentFm.model.getValue('SCHEDULE_END_DATE'))) {
	 * endDateToset = parentFm.model.getValue('SCHEDULE_END_DATE'); }
	 */
	if (parentFm.model.getValue('SCHEDULE_TYPE') != null && !Ext.isEmpty(parentFm.model.getValue('SCHEDULE_TYPE'))) {
		scheduleTypeToset = parentFm.model.getValue('SCHEDULE_TYPE');
	}
	if (parentFm.model.getValue('SCHEDULE_FREQ_VALUE') != null
				&& !Ext.isEmpty(parentFm.model.getValue('SCHEDULE_FREQ_VALUE'))) {
		scheduleFreqValueToSet = parentFm.model.getValue('SCHEDULE_FREQ_VALUE');
	}
	var modelData = {
		RPT_SCH_REPORT_NAME : reportnameToset,
		RPT_SCH_FROM_DATE : parentFm.additionalConfig.FROM_DATE,
		RPT_SCH_TO_DATE : parentFm.additionalConfig.TO_DATE,
		REPORT_ID:parentFm.model.getValue('REPORT_ID'),
		//IR_ENHANCEMENTS_001 -- Starts
		REPORT_PROD_CODE:parentFm.model.getValue('REPORT_PROD_CODE'),
		REPORT_SUB_PROD_CODE:parentFm.model.getValue('REPORT_SUB_PROD_CODE'),
		REPORT_FUNC_CODE:parentFm.model.getValue('REPORT_FUNC_CODE'),
		//IR_ENHANCEMENTS_001 -- Ends
		RPT_SCH_FREQ_DAILY:null,
		RPT_SCH_FREQ_WEEKLY:null,
		RPT_SCH_RUNS_EVERY:null,
		RPT_SCH_FREQ_MONTHLY:null,
		RPT_SCH_FREQ_MONTHLY_DATE:null		
	};
	LOGGER.info("SCHEDULE DTA",parentFm.additionalConfig);
	if(Ext.isEmpty(modelData.REPORT_ID)){
		modelData.REPORT_ID=reportid;
	}
	if(parentFm.additionalConfig.SCHEDULER_TYPE=='DLY'){
		modelData.RPT_SCH_FREQ_DAILY='DLY';
	}else if(parentFm.additionalConfig.SCHEDULER_TYPE=='WLY'){
		modelData.RPT_SCH_FREQ_WEEKLY='WLY';
		modelData.RPT_SCH_RUNS_EVERY=parentFm.additionalConfig.SCHEDULER_FREQUENCY_VALUE;		
	}else if(parentFm.additionalConfig.SCHEDULER_TYPE=='MLY'){
		modelData.RPT_SCH_FREQ_MONTHLY='MLY';
		modelData.RPT_SCH_FREQ_MONTHLY_DATE=parentFm.additionalConfig.SCHEDULER_FREQUENCY_VALUE;		
	} else{
		modelData.RPT_SCH_FREQ_DAILY='DLY';
	}
	var fm = new cbx.form.FormManager({
		formId : "INFO_RPT_SCHEDULE_FORM",
		modelData : modelData,
		listeners : {
			'initialized' : function (manager){
				if (winObj != null) {
					winObj.setTitle(rb['LBL_REPORT_SCHEDULE']);
				}
			}
		}
	});

	var listener = new canvas.informationRpt.InfoRptBtnListener();
	//var mvhObj=mvhObj;
	var reportname = parentFm.model.getValue('REPORT_NAME'); //IR_ENHANCEMENTS_001
	winObj = new iportal.Window({
		title : rb['LBL_REPORT_SCHEDULE'] || rb['LBL_LOADING'],
		width : 1100, //IR_ENHANCEMENTS_001
		autoHeight : true,
		minWidth : 1100, //IR_ENHANCEMENTS_001
		plain : true,
		autoScroll : true,
		items : fm.getFormView(),
		buttonAlign : 'left',
		buttons : [ {
			text : rb['LBL_SAVE_SCHEDULE'],
			cls : 'portal_pos_btn',
			handler : function (){
				var rb =  CRB.getFWBundle();
				var values = fm.getModelData();
				/* Schedule From, To Date Validation based on CurrentDate - Start*/
				/**Success Date Validation condition :
				 * 1. StartDate must be NOT Null
				 * 2. StartDate must be greater than or equal to Current Date
				 * 3. StartDate must be less than ToDate
				 * 4. EndDate can be null
				 * 5. EndDate must be greater than CurrentDate
				 **/
				var strFromDate = values.RPT_SCH_FROM_DATE;
				var strTodDate = values.RPT_SCH_TO_DATE;
				var currentDate = new Date((new Date()).setHours(0, 0, 0, 0));

				var dateCheck = false;
				var dateMsg="";

				if(Ext.isEmpty(strFromDate) || strFromDate==undefined){
					dateCheck=true;
					dateMsg = rb['ERR_MSG_SCH_STARTDATE_NOT_NULL'];
				}
				// IR_ENHANCEMENTS_001 starts
				else if(Ext.isEmpty(strTodDate) || strTodDate==undefined){
					dateCheck=true;
					dateMsg = rb['ERR_MSG_SCH_TODATE_NOT_NULL'];
				}
				
				else {
					fromDate = new Date(strFromDate.split('/')[2],strFromDate.split('/')[1]-1,strFromDate.split('/')[0]);
					fromDate.setHours(0,0,0,0);
					
					if(fromDate.getTime() < currentDate.getTime()) {	
						dateCheck=true;
						dateMsg = rb['ERR_MSG_SCH_STARTDATE_GREATER_CURRENTDATE'];
					}else {
						if(!Ext.isEmpty(strTodDate) || strTodDate!=undefined){
							toDate= new Date(strTodDate.split('/')[2],strTodDate.split('/')[1]-1,strTodDate.split('/')[0]);
							toDate.setHours(0,0,0,0);
							
							if(toDate.getTime() < currentDate.getTime()) {				
								dateCheck=true;
								dateMsg = rb['ERR_MSG_SCH_TODATE_GREATER_CURRENTDATE']; 
							} else if(fromDate.getTime() >= toDate.getTime()) {				
								dateCheck=true;
								dateMsg = rb['ERR_MSG_SCH_TODATE_GREATER_STARTDATE'];
							}
						}
					}					
				}
				if(dateCheck){
					var err_Dialog = new iportal.Dialog({
						dialogType : 'ERROR',
						title : rb['LBL_ERROR'],
						message : dateMsg, 
						okHandler : function (){
							err_Dialog.close();
						}
					});
					err_Dialog.show();
					/* Schedule From, To Date Validation based on CurrentDate - End*/
				}else{
					var freqDaily = values.RPT_SCH_FREQ_DAILY;
					var freqWeekly = values.RPT_SCH_FREQ_WEEKLY;
					var freqWeekDay = values.RPT_SCH_RUNS_EVERY;
					var freqMonthly = values.RPT_SCH_FREQ_MONTHLY;
					var freqMonthDay = values.RPT_SCH_FREQ_MONTHLY_DATE;
					var isFreqSelected = false;
					if (freqDaily != null && freqDaily != "") {
						isFreqSelected = true;
						var confirmsaveDialog = new iportal.Dialog({
							dialogType : 'USERDEFINED',
							dialogStyle : 'YES_NO',
							title :rb['LBL_CONFIRM_SAVE_SCHEDULE_REPORT_TITLE'],
							message : rb['LBL_CONFIRM_SAVE_SCHEDULE_REPORT']+' '+ reportname,
							yesHandler : function() {
								confirmsaveDialog.close();
								fm.model.setValue("SCHEDULER_TYPE", freqDaily);
								fm.model.setValue("SCHEDULER_FREQUENCY_VALUE", freqDaily);
								listener.saveAndScheduleReportDefinition(fm, mvhObj, winObj);
								
							},
							noHandler : function() {
								confirmsaveDialog.close();
						}
						});
						confirmsaveDialog.show();

						
					} else if (freqWeekly != null && freqWeekly != "") {
						isFreqSelected = true;
						if (freqWeekDay == null || freqWeekDay == undefined || freqWeekDay == "") {						
							var err_Dialog = new iportal.Dialog({
								dialogType : 'ERROR',
								title : rb['LBL_ERROR'],
								message : rb['LBL_ERROR_EMPTY_SCHEDULE_DAY'],  
								okHandler : function (){
									err_Dialog.close();
								}
							});
							err_Dialog.show();
						} else /*if (freqWeekly != null && freqWeekDay != null)*/ {
							var confirmsaveDialog = new iportal.Dialog({
								dialogType : 'USERDEFINED',
								dialogStyle : 'YES_NO',
								title :rb['LBL_CONFIRM_SAVE_SCHEDULE_REPORT_TITLE'],
								message : rb['LBL_CONFIRM_SAVE_SCHEDULE_REPORT']+' '+ reportname,
								yesHandler : function() {
									confirmsaveDialog.close();
									fm.model.setValue("SCHEDULER_TYPE", freqWeekly);
									fm.model.setValue("SCHEDULER_FREQUENCY_VALUE", freqWeekDay);
									listener.saveAndScheduleReportDefinition(fm, mvhObj, winObj);
									
								},
								noHandler : function() {
									confirmsaveDialog.close();
							}
							});
							confirmsaveDialog.show();
						}

					} else if (freqMonthly != null && freqMonthly != "") {
						isFreqSelected = true;
						if (freqMonthDay == null || freqMonthDay == undefined || freqMonthDay == "") {
							var err_Dialog = new iportal.Dialog({
								dialogType : 'ERROR',
								title : rb['LBL_ERROR'],
								message : rb['LBL_ERROR_EMPTY_SCHEDULE_DAY_OF_MONTH'],
								okHandler : function (){
									err_Dialog.close();
								}
							});
							err_Dialog.show();
						} else /*if (freqMonthly != null && freqMonthly != null)*/ {
							
							var confirmsaveDialog = new iportal.Dialog({
								dialogType : 'USERDEFINED',
								dialogStyle : 'YES_NO',
								title :rb['LBL_CONFIRM_SAVE_SCHEDULE_REPORT_TITLE'],
								message : rb['LBL_CONFIRM_SAVE_SCHEDULE_REPORT']+' '+ reportname,
								yesHandler : function() {
									confirmsaveDialog.close();
									fm.model.setValue("SCHEDULER_TYPE", freqMonthly);
									fm.model.setValue("SCHEDULER_FREQUENCY_VALUE", freqMonthDay);					
									listener.saveAndScheduleReportDefinition(fm, mvhObj, winObj);
									
								},
								noHandler : function() {
									confirmsaveDialog.close();
							}
							});
							confirmsaveDialog.show();
							
						}

					}
					else if(!isFreqSelected) {
						
						var err_freqNotSelected = new iportal.Dialog({
							dialogType : 'ERROR',
							title : rb['LBL_ERROR'],
							message : rb['MSG_SCH_FREQUENCY'],
							okHandler : function (){
								err_freqNotSelecte.close();
							}
						});
						err_freqNotSelecte.show();	
						
					}
				}
				
			} // IR_ENHANCEMENTS_001 ends

		}, {
			xtype : 'tbfill'
		}, {
			text : rb['LBL_RESET'],
			cls : 'portal_neg_btn',
			handler : function (){
				fm.reset();
				//IR_ENHANCEMENTS_001 -- Starts
				var values = fm.getModelData();
				if ("DLY" == values.RPT_SCH_FREQ_DAILY){
					fm.setEnabledFields(["RPT_SCH_RUNS_EVERY"], false);
					fm.setEnabledFields(["RPT_SCH_FREQ_MONTHLY_DATE"], false);
				}else if ("WLY" == values.RPT_SCH_FREQ_WEEKLY){
					fm.setEnabledFields(["RPT_SCH_RUNS_EVERY"], true);	
					fm.setEnabledFields(["RPT_SCH_FREQ_MONTHLY_DATE"], false);
				}else if ("MLY" == values.RPT_SCH_FREQ_MONTHLY){
					fm.setEnabledFields(["RPT_SCH_RUNS_EVERY"], false);	
					fm.setEnabledFields(["RPT_SCH_FREQ_MONTHLY_DATE"], true);
				}
				//IR_ENHANCEMENTS_001 -- Ends
			}
		}, {
			text :  rb['LBL_CANCEL'],
			cls : 'portal_neg_btn',
			handler : function (){
				// IR_ENHANCEMENTS_001 starts
				// listener.loadEmptyWidget(mvhObj); //CBX_2.0_OTO138_CHG0001 - Commented
				// winObj.close();
				
				var confirmcancelDialog = new iportal.Dialog({
					dialogType : 'USERDEFINED',
					dialogStyle : 'YES_NO',
					title :rb['LBL_CONFIRM_CANCEL_SCHEDULE_REPORT_TITLE'],
					message : rb['LBL_CONFIRM_CANCELE_SCHEDULE_REPORT'],
					yesHandler : function() {
						confirmcancelDialog.close();
						winObj.close();
					},
					noHandler : function() {
						confirmcancelDialog.close();
				}
				});
				confirmcancelDialog.show();
				 // IR_ENHANCEMENTS_001 ends
			}
		} ]
	});
	//if(fm.formTitle){
		winObj.setTitle(rb['LBL_REPORT_SCHEDULE']);
	//}
	winObj.show();
};