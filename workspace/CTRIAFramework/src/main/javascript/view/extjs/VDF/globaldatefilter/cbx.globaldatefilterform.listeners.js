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
cbx.ns("cbx.globaldatefilterform.listeners");
/**
 * 
 */
cbx.globaldatefilterform.listeners.CBX_FILTER_FORM = Class(cbx.Observable, {
	/**
	 * 
	 */
	constructor : function(config) {
		this.fm = config.fm;
	},
	/**
	 * 
	 */
	dateDiffInDays:function (b,a) {
		var _MS_PER_DAY = 1000 * 60 * 60 * 24;
	  var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
	  var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

	  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
	},
	/**
	 * 
	 */
	calculateTotalMonthsDifference :function(firstDate, secondDate) {
        var fm = firstDate.getMonth();
        var fy = firstDate.getFullYear();
        var sm = secondDate.getMonth();
        var sy = secondDate.getFullYear();
        var months = Math.abs(((fy - sy) * 12) + fm - sm);
        var firstBefore = firstDate > secondDate;
        firstDate.setFullYear(sy);
        firstDate.setMonth(sm);
        firstBefore ? firstDate < secondDate ? months-- : "" : secondDate < firstDate ? months-- : "";
        return months;
	},
	/**
	 * The method is expected to set the global date filter panel in the intial stage
	 */
	resetDefault:function(fm){
		var mv = fm.additionalConfig.MULTI_VIEW;
		var defaultFilter = fm.additionalConfig.DEFAULT_FILTER;
		fm.setMaxValue('FILTER_FROMDATE',fm.additionalConfig['MAX_DATE_RANGE']);
		fm.setMinValue('FILTER_FROMDATE',fm.additionalConfig['GLOBAL_MIN_DATE']);
		fm.setMaxValue('FILTER_TODATE',fm.additionalConfig['MAX_DATE_RANGE']);
		fm.setMinValue('FILTER_TODATE',fm.additionalConfig['GLOBAL_MIN_DATE']);
		if(defaultFilter){
			defaultDateRange = defaultFilter.split("|");	
			fromDate = (!cbx.isEmpty(defaultDateRange[0])) ? defaultDateRange[0] : '' ;
			toDate = (!cbx.isEmpty(defaultDateRange[1])) ? defaultDateRange[1] : '' ;
			fm.model.setValue("FILTER_RADIO1","Y");
			fm.model.setValue("FILTER_COMBO",defaultFilter);
			fm.model.setValue("FILTER_RADIO2","");
			fm.model.setValue("FILTER_FROMDATE",fromDate);
			fm.model.setValue("FILTER_TODATE",toDate);
			fm.setEnabledFields(["FILTER_FROMDATE","FILTER_TODATE"], false);
			this.doFilter(mv,fm,true)
			
		}else{
			fm.model.setValue("FILTER_RADIO1","Y");
			fm.model.setValue("FILTER_COMBO"," ");
			fm.model.setValue("FILTER_RADIO2","");
			fm.model.setValue("FILTER_FROMDATE","");
			fm.model.setValue("FILTER_TODATE","");
			fm.setEnabledFields(["FILTER_FROMDATE","FILTER_TODATE"], false);
			this.doClear(mv,true);
		}
		fm.setEnabledFields(["FILTER_COMBO"], true);
	},
	doFilter : function(mv,fm,reload){
		if(mv.mvh){
			mv.mvh.applyDateFilter(fm.getModelData(),reload);	
		}
		else{
			mv.applyDateFilter(fm.getModelData(),reload);
		}
	},
	doClear : function(mv,reload){
		if(mv.mvh){
			mv.mvh.clearDateFilter(reload);	
		}
		else{
			mv.clearDateFilter(reload);
		}
	},
	/**
	 * 
	 */
	registerHandlers : function() {	
		/**
		 * 
		 */
		this.fm.registerHandler("cbxclick", "FILTER_BUTTON", function(fm,event, fieldName, params) {	
			var mv = fm.additionalConfig.MULTI_VIEW;
			var resBundle = CRB.getFWBundle();
			if(fm.model.getValue("FILTER_RADIO2") == "Y"){
				if(cbx.isEmpty(fm.model.getValue("FILTER_FROMDATE"))){
					fm.markInvalid("FILTER_FROMDATE" ,resBundle.DATE_FILTER_FROM_DATE_ERROR );
				}
				else if( cbx.isEmpty(fm.model.getValue("FILTER_TODATE"))){
					fm.markInvalid("FILTER_TODATE" ,resBundle.DATE_FILTER_TO_DATE_ERROR);
				}
				else {
			        var splittedToDate = fm.model.getValue("FILTER_TODATE").split("/");
			        var splittedFromDate= fm.model.getValue("FILTER_FROMDATE").split("/");
			        var newToDate = new Date(parseInt(splittedToDate[2], 10), parseInt(splittedToDate[1], 10)-1, parseInt(splittedToDate[0], 10));
			        var newFromDate = new Date(parseInt(splittedFromDate[2], 10), parseInt(splittedFromDate[1], 10)-1, parseInt(splittedFromDate[0], 10));
			        if(newFromDate > newToDate){
			        	fm.markInvalid("FILTER_FROMDATE" ,resBundle.DATE_FILTER_FROM_DATE_GT_TO_DATE);
			        	return;
			        }
			        var days=this.dateDiffInDays(newToDate, newFromDate);
			        var months=this.calculateTotalMonthsDifference(newToDate, newFromDate);
			        var diff = Math.abs(newToDate.getTime() - newFromDate.getTime());
			        var options={fromDate:newFromDate,toDate:newToDate};
			        var response={errorMsg:''};
			        if(iportal.systempreferences.getFramework()==="ext"){
			        	mv.fireEvent('verifydate',options,response);
			        }
			        else{
			        	mv.raiseEvent(CWEC.VERIFY_DATE,options,response);
			        }
					var errorMsg=response.errorMsg;
			        var day = 1000* 60 * 60 * 24;
			        var years = Math.ceil(months/12);
			        if(!cbx.isEmpty(fm.additionalConfig.MAX_SELECTION_PERIOD_UNIT)){
			        	if(fm.additionalConfig.MAX_SELECTION_PERIOD_UNIT == "D"){
			        		if(parseInt(fm.additionalConfig.MAX_SELECTION_PERIOD_VALUE) < days){
			        			fm.markInvalid("FILTER_TODATE" ,resBundle.DATE_FILTER_PERIOD_RANGE +" "+
			        						fm.additionalConfig.MAX_SELECTION_PERIOD_VALUE+" " +resBundle.DAYS);
			        			return;
			        		}
			        	}
			        	else if(fm.additionalConfig.MAX_SELECTION_PERIOD_UNIT == "M"){
			        		if(parseInt(fm.additionalConfig.MAX_SELECTION_PERIOD_VALUE) < months){
			        			fm.markInvalid("FILTER_TODATE" ,resBundle.DATE_FILTER_PERIOD_RANGE  +" "+
			        						fm.additionalConfig.MAX_SELECTION_PERIOD_VALUE+" "+resBundle.MONTHS );
			        			return;
			        		}
			        	}
			        	else if(fm.additionalConfig.MAX_SELECTION_PERIOD_UNIT == "Y"){
			        		if(parseInt(fm.additionalConfig.MAX_SELECTION_PERIOD_VALUE) < years){
			        			fm.markInvalid("FILTER_TODATE" ,resBundle.DATE_FILTER_PERIOD_RANGE  +" "+
			        						fm.additionalConfig.MAX_SELECTION_PERIOD_VALUE+" "+ resBundle.YEARS);
			        			return;
			        		}
			        	}
			        }
		        	else if(!cbx.isEmpty(errorMsg)){
		        		fm.markInvalid("FILTER_FROMDATE" ,errorMsg);
		        		fm.markInvalid("FILTER_TODATE" ,errorMsg);
		        		return;
		        	}
			        fm.clearInvalid("FILTER_TODATE");
			        fm.clearInvalid("FILTER_FROMDATE");
					this.doFilter(mv,fm,true)
				}
			}
			if(fm.model.getValue("FILTER_RADIO1") == 'Y'){
				if(fm.model.getValue("FILTER_COMBO") == " "){
					fm.markInvalid("FILTER_COMBO" ,resBundle.DATE_FILTER_SELECT_COMBO);
				}
				else {
					var temp = fm.model.getValue("FILTER_COMBO");
					var tempdata = temp.split("|");
					if(tempdata[0] == "-1"){
						this.doClear(mv,true)
					}else{
						this.doFilter(mv,fm,true);
					}
				}
			}			
		});	
		/**
		 * Resetting the default filters at the intial stage.
    	 * A function is provided to set the intial state.The same method is expected to be called 
		 * at any time when the transition will be happened from cutom filter radio to default filter's radio
		 */
		this.fm.registerHandler("cbxclick", "FILTER_BUTTON_RESET", function(fm,event, fieldName, params) {
			this.resetDefault(fm);
		});
		
		/**
		 * 
		 */
		this.fm.registerHandler("cbxchange", "FILTER_RADIO1", function(fm, event,fieldName, value) {	
			if(value == "Y"){
				this.resetDefault(fm);
			}		
		});
		  
		/**
		 * 
		 */
		this.fm.registerHandler("cbxchange", "FILTER_RADIO2", function(fm, event,fieldName, value) {	
			if(value == "Y"){ 
				fm.setEnabledFields(["FILTER_COMBO"], false);
				fm.setEnabledFields(["FILTER_FROMDATE","FILTER_TODATE"], true);
				fm.model.setValue("FILTER_RADIO1","");
				fm.model.setValue("FILTER_COMBO"," ");
				fm.model.setValue("FILTER_FROMDATE","");
				fm.model.setValue("FILTER_TODATE","");
			}	
			fm.clearInvalid("FILTER_COMBO");
		});
		
		/**
		 * 
		 */
		this.fm.registerHandler("cbxchange", "FILTER_COMBO", function(fm, event,fieldName, value) {
			if(value){
				var comboVal = value.split("|");
				if(comboVal[0] == "-1" && comboVal[1] == '-1' )
				{
				fm.clearValues(['FILTER_FROMDATE','FILTER_TODATE'],true);
				}
				else
				{
				fm.model.setValue("FILTER_FROMDATE",comboVal[0]);
				fm.model.setValue("FILTER_TODATE",comboVal[1]);
				}
			}
		});
		
		/**
		 * 
		 */
		this.fm.registerHandler("cbxpreinitialize",function(fm) {
			/**
			 *The calculation of the global minimu date in the date picker will be calculated dynamically using configuration.So the below codde has been removed.
			 */
			return { 
				"FILTER_LABEL" : { 
						 bundleKey: 'COMMON', 		 
					displayNmKey : fm.additionalConfig['COL_NM_KEY'], 
					cls:'gtf-label' 
				},
				"FILTER_RADIO1": {
					cls:'gtf-radio'
				},                                                   
				"FILTER_FROMDATE" : {
					minValueDate : fm.additionalConfig['GLOBAL_MIN_DATE'],
					maxValueDate : fm.additionalConfig['MAX_DATE_RANGE'],
			  	  	disabled : true
				},
				"FILTER_TODATE" : {
					minValueDate : fm.additionalConfig['GLOBAL_MIN_DATE'],
					maxValueDate : fm.additionalConfig['MAX_DATE_RANGE'],
					disabled : true
				},
				"FILTER_BUTTON" : {
					cls : 'portal_cbxform_btn',
					overCls : 'portal_cbxform_btn_hover',
					height:15  
				},
				"FILTER_BUTTON_RESET" : {
					cls : 'portal_cbxform_btn',
					overCls : 'portal_cbxform_btn_hover',
					height:15 
				},
				"FILTER_COMPOSITE": {
					hideLabel : true
				}
			};
		});
		/**
		 * 
		 */
		this.fm.registerHandler('cbxafterselect', 'FILTER_FROMDATE', function (fm, event, fieldName, value){
			var resBundle=CRB.getFWBundle();
			var maxDate=fm.additionalConfig['MAX_DATE_RANGE'].split('/');
			var maxDt=new Date().setFullYear(maxDate[2],maxDate[1],maxDate[0]);
			/**
			 * Get the date object of the from date field 
			 * */
			var fromDate=value.split('/');
			if(fromDate[1]=='1'){
				fromDate[1]=0;
				fromDate[2]=parseInt(fromDate[2]-1);
			}else{
				fromDate[1]=parseInt(fromDate[1]-1);
			}
			var myDt=new Date(fromDate[2],fromDate[1],fromDate[0]);
			var myDate=new Date(fromDate[2],fromDate[1],fromDate[0]);
			if(fm.additionalConfig.MAX_SELECTION_PERIOD_UNIT == "D"){
				myDt.setDate(myDt.getDate()+parseInt(fm.additionalConfig.MAX_SELECTION_PERIOD_VALUE));
        	}
        	else if(fm.additionalConfig.MAX_SELECTION_PERIOD_UNIT == "M"){
        		myDt.setMonth(myDt.getMonth()+parseInt(fm.additionalConfig.MAX_SELECTION_PERIOD_VALUE));
        	}
        	else if(fm.additionalConfig.MAX_SELECTION_PERIOD_UNIT == "Y"){
        		myDt.setFullYear(myDt.getFullYear()+parseInt(fm.additionalConfig.MAX_SELECTION_PERIOD_VALUE));
        	}
			LOGGER.info("Date which needs to be set as min date is",myDt);
			var myDt1=iportal.jsutil.convertDateObjectToStandardFmt(myDt);
			var myDt2=myDt1.split('/');
			var myDt1Obj=new Date().setFullYear(myDt2[2],myDt2[1],myDt2[0]);
			var toDate=fm.model.getValue('FILTER_TODATE').split('/');
			if(!cbx.isEmpty(toDate) && !cbx.isEmpty(fm.model.getValue('FILTER_TODATE'))){
				var toDateObj=new Date().setFullYear(toDate[2],toDate[1],toDate[0]);	
			}
			var fromDate=fm.model.getValue('FILTER_FROMDATE').split('/');
			var fromDateObj=new Date().setFullYear(fromDate[2],fromDate[1],fromDate[0]);
			if((myDt1Obj-maxDt)>(1*24*60*60*1000)){
				fm.setMaxValue('FILTER_TODATE',fm.additionalConfig['MAX_DATE_RANGE']);
				fm.setMinValue('FILTER_TODATE',value);
			}
			else{
				fm.setMaxValue('FILTER_TODATE',myDt1);
				fm.setMinValue('FILTER_TODATE',value);
			}
		});
		
		/**
		 * 
		 */
		this.fm.registerHandler('cbxdateclear', 'FILTER_FROMDATE', function (fm, event, fieldName, value){
			if(!cbx.isEmpty(fm.model.getValue('FILTER_TODATE'))){
				this.fm.handlerEvent('cbxchange','FILTER_TODATE',fm.model.getValue('FILTER_TODATE'));
			}
			else{
				fm.setMaxValue('FILTER_FROMDATE',fm.additionalConfig['MAX_DATE_RANGE']);
				fm.setMinValue('FILTER_FROMDATE',fm.additionalConfig['GLOBAL_MIN_DATE']);
				fm.setMaxValue('FILTER_TODATE',fm.additionalConfig['MAX_DATE_RANGE']);
				fm.setMinValue('FILTER_TODATE',fm.additionalConfig['GLOBAL_MIN_DATE']);
			}
		});
		
		/**
		 * 
		 */
		this.fm.registerHandler('cbxdateclear', 'FILTER_TODATE', function (fm, event, fieldName, value){
			if(!cbx.isEmpty(fm.model.getValue('FILTER_FROMDATE'))){
				this.fm.handlerEvent('cbxchange','FILTER_FROMDATE',fm.model.getValue('FILTER_FROMDATE'));
				
			}else{
				fm.setMaxValue('FILTER_FROMDATE',fm.additionalConfig['MAX_DATE_RANGE']);
				fm.setMinValue('FILTER_FROMDATE',fm.additionalConfig['GLOBAL_MIN_DATE']);
				fm.setMaxValue('FILTER_TODATE',fm.additionalConfig['MAX_DATE_RANGE']);
				fm.setMinValue('FILTER_TODATE',fm.additionalConfig['GLOBAL_MIN_DATE']);
			}
		});
		
		/**
		 * 
		 */
		this.fm.registerHandler('cbxafterselect', 'FILTER_TODATE', function (fm, event, fieldName, value){
			var resBundle=CRB.getFWBundle();
			var minDate=fm.additionalConfig['GLOBAL_MIN_DATE'].split('/');
			var minDt=new Date().setFullYear(minDate[2],minDate[1],minDate[0]);
			/**
			 * Get the date object of the from date field 
			 * */
			var toDate=value.split('/');
			if(toDate[1]=='1'){
				toDate[1]=0;
				toDate[2]=parseInt(toDate[2]-1);
			}else{
				toDate[1]=parseInt(toDate[1]-1);
			}
			var myDt=new Date(toDate[2],toDate[1],toDate[0]);
			var myDate=new Date(toDate[2],toDate[1],toDate[0]);
			if(fm.additionalConfig.MAX_SELECTION_PERIOD_UNIT == "D"){
				myDt.setDate(myDt.getDate()-parseInt(fm.additionalConfig.MAX_SELECTION_PERIOD_VALUE));
        	}
        	else if(fm.additionalConfig.MAX_SELECTION_PERIOD_UNIT == "M"){
        		myDt.setMonth(myDt.getMonth()-parseInt(fm.additionalConfig.MAX_SELECTION_PERIOD_VALUE));
        	}
        	else if(fm.additionalConfig.MAX_SELECTION_PERIOD_UNIT == "Y"){
        		myDt.setFullYear(myDt.getFullYear()-parseInt(fm.additionalConfig.MAX_SELECTION_PERIOD_VALUE));
        	}
			LOGGER.info("Date which needs to be set as min date is",myDt);
			var myDt1=iportal.jsutil.convertDateObjectToStandardFmt(myDt);
			var myDt2=myDt1.split('/');
			var myDt1Obj=new Date().setFullYear(myDt2[2],myDt2[1],myDt2[0]);
			var fromDate=fm.model.getValue('FILTER_FROMDATE').split('/');
			if(!cbx.isEmpty(fromDate) && !cbx.isEmpty(fm.model.getValue('FILTER_FROMDATE'))){
				var fromDateObj=new Date().setFullYear(fromDate[2],fromDate[1],fromDate[0]);	
			}
			var toDate=fm.model.getValue('FILTER_TODATE').split('/');
			var toDateObj=new Date().setFullYear(toDate[2],toDate[1],toDate[0]);
			if((minDt-myDt1Obj)>(1*24*60*60*1000)){
				fm.setMinValue('FILTER_FROMDATE',fm.additionalConfig['GLOBAL_MIN_DATE']);
				fm.setMaxValue('FILTER_FROMDATE',value);
			}else{
				fm.setMinValue('FILTER_FROMDATE',myDt1);
				fm.setMaxValue('FILTER_FROMDATE',value);
			}
		});
	}
});

/**
 * 
 */
CFLR.registerListener("CBX_FILTER_FORM", cbx.globaldatefilterform.listeners.CBX_FILTER_FORM);