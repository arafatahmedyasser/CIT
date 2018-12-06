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

Ext.namespace("iportal.apps");

/**
 * iportal.apps.alertPiggybackListner
 * 
 *
 * @version   0.1
 * @singleton
 */
iportal.apps.alertPiggybackListner = new ( function() {
	var lastSentAlertPiggybackReqId =null;
	this.checkForHighUnPoppedupAlertsSuceess =  function(response,options){
						//console.log("inside success");
						if(!Ext.isEmpty(response.responseText)){
							var alertJSONRecords = Ext.decode(response.responseText);
							var alertData = alertJSONRecords.response.value.ALL_RECORDS;
							//console.log("alertData : "+alertData);
							if(!Ext.isEmpty(alertData)){
								var alertPopupObj = new iportal.apps.AlertPopup();
								//console.log("About to call showPopupAlerts");
								alertPopupObj.showPopupAlerts(alertData);
							}else{						
								//High severity alerts are null. Hence check for other new alerts
								if(iportal.apps.alertPiggybackListner.isAlertsWidgetPresent())							
								{		
									this.checkIfAnyNewAlertsPresent();
								}else{
									//PiggyBack request ends here
									//When there are no highpopup alerts and the alertwidget is also not present.
									iportal.util.ajaxPiggyback.isPiggyBackInprocess=false;
								}
							}
						}else{
							iportal.util.ajaxPiggyback.isPiggyBackInprocess=false;
						}
	}
	this.checkForHighUnPoppedupAlerts = function(){
		if(lastSentAlertPiggybackReqId===null || !Ext.Ajax.isLoading(lastSentAlertPiggybackReqId))
		{
			var	extraParamaters = {
					"PAGE_CODE_TYPE" : "ALERTSUMMARY_LIST_VIEW",
					"INPUT_ACTION" :  "UNREAD_UNPOPPEDUP_HIGHALERT_FETCH_ACTION",
					"PRODUCT_NAME" :  "CUSER",
					"INPUT_FUNCTION_CODE" :  "VSBLTY",
					"INPUT_SUB_PRODUCT" : "CUSER"
			};
			extraParamaters = iportal.util.ajaxPiggyback.generatePiggybackRequest(extraParamaters);
			var transactionId = Ext.Ajax.request({
					params : extraParamaters,
					success:this.checkForHighUnPoppedupAlertsSuceess.createDelegate(this),
					failure: function(response,options){ 
						iportal.util.ajaxPiggyback.isPiggyBackInprocess=false;
					}
				});
			lastSentAlertPiggybackReqId = transactionId.tId;
		}
	}
	
	this.checkIfAnyNewAlertsPresent = function(){	
		//console.log("Inside checkIfAnyNewAlertsPresent function");
		var responseData = null;
		var	extraParams = {
				"PAGE_CODE_TYPE" : "ALERTSUMMARY_LIST_VIEW",
				"INPUT_ACTION" :  "CHECK_FOR_NEW_ALERTS_ACTION",
				"PRODUCT_NAME" :  "CUSER",
				"INPUT_FUNCTION_CODE" :  "VSBLTY",
				"INPUT_SUB_PRODUCT" : "CUSER"
		};
		extraParams = iportal.util.ajaxPiggyback.generatePiggybackRequest(extraParams);
		Ext.Ajax.request({
			    params : extraParams,
				success: function(response,options){
					if(!Ext.isEmpty(response.responseText)){
						responseData = Ext.decode(response.responseText);
						var data = responseData.response.value.ALL_RECORDS;
						//console.log("data : "+data);
						if(!Ext.isEmpty(data)){							
							var flag = data.IS_NEW_ALERTS_PRESENT;
							//console.log("flag : "+flag);
							if(!Ext.isEmpty(flag) && flag==="true" )
							{						
								//console.log("Alertswidget is present");
								iportal.apps.alertPiggybackListner.refreshAlertWidget();	
							}else{
								//PiggyBack request ends here
								// There are neither highpopup alerts to show nor any regular alerts to update
								iportal.util.ajaxPiggyback.isPiggyBackInprocess=false;
							}
						}else{
							//PiggyBack request ends here
							// There are neither highpopup alerts to show nor any regular alerts to update
							iportal.util.ajaxPiggyback.isPiggyBackInprocess=false;
						}
					}else{
						//PiggyBack request ends here
						// There are neither highpopup alerts to show nor any regular alerts to update
						iportal.util.ajaxPiggyback.isPiggyBackInprocess=false;
					}
				},
				failure: function(response,options){
					iportal.util.ajaxPiggyback.isPiggyBackInprocess=false;
				},
				scope: this
			})	
	}
	
	this.isAlertsWidgetPresent = function(){
		//console.log("inside isAlertsWidgetPresent");
		var getListViewPanelObject =  Ext.getCmp(iportal.jsutil.getListViewGridId(iportal.listview.apps.alertsummarylistview.constants.ID));
		if(getListViewPanelObject){
			return true;
		}else{
			return false;
		}
	}

	this.refreshAlertWidget = function(severity){
		//console.log("Inside RefreshAlertWidget function");
		var getListViewPanelObject =  Ext.getCmp(iportal.jsutil.getListViewGridId(iportal.listview.apps.alertlistview.constants.ID));
		var listViewPanelStore = getListViewPanelObject.getStore();
		var	extraParams = {
				"PAGE_CODE_TYPE" : "ALERTSUMMARY_LIST_VIEW",
				"INPUT_ACTION" :  "REFRESH_WIDGET_ACTION",
				"PRODUCT_NAME" :  "CUSER",
				"INPUT_FUNCTION_CODE" :  "VSBLTY",
				"INPUT_SUB_PRODUCT" : "CUSER",
				"IS_FILTER_FORM":false
		};
		if(!!severity){
			extraParams['SEVERITY_SELECTED'] = severity;
		}
		//Piggy backing on the alert widget refresh 
		extraParams = iportal.util.ajaxPiggyback.generatePiggybackRequest(extraParams);

		getListViewPanelObject.loadMask.show();
		for(x in extraParams){
			listViewPanelStore.baseParams[x] = extraParams[x];
		}
		listViewPanelStore.load({params:{start:0,limit:25},callback:function(record,arg,success){
			if(success == false)
				iportal.util.ajaxPiggyback.isPiggyBackInprocess=false;
		}});
		getListViewPanelObject.loadMask.hide();
	}

	this.processHighUnPoppedupAlerts = function() {
		//console.log("Inside processHighUnPoppedupAlerts");
		//Piggyback request  starts the moment a check for highpopup alert present is sent
		//console.log("iportal.util.ajaxPiggyback.isPiggyBackInprocess : "+iportal.util.ajaxPiggyback.isPiggyBackInprocess);
		if(!iportal.util.ajaxPiggyback.isPiggyBackInprocess){
			//console.log("Inside generate piggyback");
			iportal.util.ajaxPiggyback.isPiggyBackInprocess=true;	
			//this.checkForHighUnPoppedupAlerts();
			this.getUrgentNormalAlertsCounts();
			//iportal.util.ajaxPiggyback.isPiggyBackInprocess=false;	
		}
		
	}
	
	this.getUrgentNormalAlertsCounts = function(){
		var	extraParamaters = {
				"PAGE_CODE_TYPE" : "ALERTSUMMARY_LIST_VIEW",
				"INPUT_ACTION" :  "GET_UNREAD_ALERT_COUNT",
				"PRODUCT_NAME" :  "CANVAS",
				"INPUT_FUNCTION_CODE" :  "VSBLTY",
				"INPUT_SUB_PRODUCT" : "CANVAS"
		};
		extraParamaters = iportal.util.ajaxPiggyback.generatePiggybackRequest(extraParamaters);
		var that = this;
		var transactionId = Ext.Ajax.request({
				params : extraParamaters,
				success : function(response,options){
					var alertJSONRecords = response.responseText && cbx.isObject(response.responseText)?response:cbx.decode(response.responseText);
					var alertData = Number(alertJSONRecords.value[0]['NUM_ALERTS']);
					var alertLabel = alertData != 1?iportal.jsutil.getTextFromBundle("canvas-default","LBL_NUM_ALERTS") : iportal.jsutil.getTextFromBundle("canvas-default","LBL_NUM_ALERT");
					var alertObj= iportal.menuitems.metadata.getMenuToolById("MESSAGES");
					var countLabel = "<span class='alert-count'>"+alertData+"</span>";
					alertLabel = countLabel+alertLabel;
					if(alertObj!=null && alertObj.setText){
						alertObj.setText(alertLabel);
						//Ext.getCmp('ALERT_COUNT').update('<div class="alerts_up"></div><div class="information_alerts_high_up"><a href="#" onclick="iportal.listview.alertListDisplay();">'+alertJSONRecords.response.value.TOTAL_COUNT[0].NUM_ALERTS+' Alerts</a></div>')
					}
					/*Ext.each(alertData,function(severityCountMap){
						switch(severityCountMap.SEVERITY){
							case 'Medium' :
								if(!isNaN(severityCountMap.NUM_ALERTS)){
									if(Ext.get('Normal_Alerts_Count_ID')){
										var currentCount = Ext.get('Normal_Alerts_Count_ID').dom.innerHTML;
										if(severityCountMap.NUM_ALERTS!=currentCount){
											Ext.get('Normal_Alerts_Count_ID').update(severityCountMap.NUM_ALERTS);
										}
									}
								}
								break;
							case 'High':	
								if(!isNaN(severityCountMap.NUM_ALERTS)){
									if(Ext.get('Urgent_Alerts_Count_ID')){
										var currentCount = Ext.get('Urgent_Alerts_Count_ID').dom.innerHTML;
										if(severityCountMap.NUM_ALERTS!=currentCount){
											Ext.get('Urgent_Alerts_Count_ID').update(severityCountMap.NUM_ALERTS);
										}
									}
								}
								//that.checkForHighUnPoppedupAlertsSuceess.createDelegate(that,[response,options])();
								break;
						}
					});*/
		           
					iportal.util.ajaxPiggyback.isPiggyBackInprocess=false;
				
				
				},
				failure: function(response,options){ 
					iportal.util.ajaxPiggyback.isPiggyBackInprocess=false;
				}
			});
		lastSentAlertPiggybackReqId = transactionId.tId;
	}
})();
//iportal.util.ajaxPiggyback.on('piggyback', iportal.apps.alertPiggybackListner.processHighUnPoppedupAlerts, this);
