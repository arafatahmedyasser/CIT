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
 * IR_ENHANCEMENTS_001 		Dharmalingam			Issue fixes in schedule form			16 Jan 2013
 * 																
 * CBXQ413F09			Venkateshprasana	Schedule frequency radio button for daily,
 							 weekly and monthly not displaying
							  properly – inconsistent		08-Feb-2013

 * ----------------------------------------------------------------------------------------------------------------
 * </pre>
 */
Ext.ns("cbx.form.listeners");

cbx.form.listeners.INFO_RPT_SCHEDULE_FORM = Ext.extend(Ext.util.Observable, {
	constructor : function (config){
		this.fm = config.fm;
		cbx.form.listeners.INFO_RPT_SCHEDULE_FORM.superclass.constructor.call(this, config);
	},
	registerHandlers : function (){
		this.fm.registerHandler("cbxchange", "RPT_SCH_FREQ_DAILY", function (fm, event, fieldname, value){
			// CBXQ413F09 - Starts here - condition added to verify Daily selected now or not
			if((fm.model.getValue("RPT_SCH_FREQ_DAILY"))==="DLY")
			{
			// CBXQ413F09 - ends here - condition added to verify Daily selected now or not
				//CBX_2.0_OTO138_CHG0001 -- Starts
				fm.model.setValue("RPT_SCH_FREQ_WEEKLY", "");
				fm.model.setValue("RPT_SCH_FREQ_MONTHLY", "");
				fm.model.setValue("RPT_SCH_FREQ_MONTHLY_DATE", "");
				fm.model.setValue("RPT_SCH_RUNS_EVERY", "");
				//CBX_2.0_OTO138_CHG0001 -- Ends
				fm.setEnabledFields(["RPT_SCH_RUNS_EVERY"], false);
				fm.setEnabledFields(["RPT_SCH_FREQ_MONTHLY_DATE"], false);
			}// CBXQ413F09
		});

		this.fm.registerHandler("cbxchange", "RPT_SCH_FREQ_WEEKLY", function (fm, event, fieldname, value){
			// CBXQ413F09 - Starts here - condition added to verify Weekly selected now or not
			if((fm.model.getValue("RPT_SCH_FREQ_WEEKLY"))==="WLY")
			{
			// CBXQ413F09 - ends here - condition added to verify Weekly selected now or not
				//CBX_2.0_OTO138_CHG0001 -- Starts
				fm.model.setValue("RPT_SCH_FREQ_DAILY", "");			
				fm.model.setValue("RPT_SCH_FREQ_MONTHLY", "");
				fm.model.setValue("RPT_SCH_FREQ_MONTHLY_DATE", "");
				fm.model.setValue("RPT_SCH_RUNS_EVERY", "");
				//CBX_2.0_OTO138_CHG0001 -- Ends
				fm.setEnabledFields(["RPT_SCH_RUNS_EVERY"], true);	
				fm.setEnabledFields(["RPT_SCH_FREQ_MONTHLY_DATE"], false);
			}// CBXQ413F09
		});

		this.fm.registerHandler("cbxchange", "RPT_SCH_FREQ_MONTHLY", function (fm, event, fieldname, value){
			// CBXQ413F09 - Starts here - condition added to verify Monthly selected now or not
			if((fm.model.getValue("RPT_SCH_FREQ_MONTHLY"))==="MLY")
			{
			// CBXQ413F09 - ends here - condition added to verify Monthly selected now or not
				fm.model.setValue("RPT_SCH_FREQ_DAILY", "");
				fm.model.setValue("RPT_SCH_FREQ_WEEKLY", "");
				fm.model.setValue("RPT_SCH_FREQ_MONTHLY_DATE", "");
				fm.model.setValue("RPT_SCH_RUNS_EVERY", "");
				fm.setEnabledFields(["RPT_SCH_FREQ_MONTHLY_DATE"], true);
				fm.setEnabledFields(["RPT_SCH_RUNS_EVERY"], false);	
			}// CBXQ413F09

		});
		this.fm.registerHandler("cbxpreinitialize",function(fm) {
			if(fm.model.getValue('RPT_SCH_FREQ_WEEKLY')!="" && !Ext.isEmpty(fm.model.getValue('RPT_SCH_FREQ_WEEKLY'))){
				return {
					"RPT_SCH_FREQ_MONTHLY_DATE": {itemType:"RADIO_GROUP",disabled:true}
					};
			}else if(fm.model.getValue('RPT_SCH_FREQ_MONTHLY')!="" && !Ext.isEmpty(fm.model.getValue('RPT_SCH_FREQ_MONTHLY'))){
				return {
					"RPT_SCH_RUNS_EVERY": {itemType:"RADIO_GROUP",disabled:true}
					};
			}else{
				return {
					"RPT_SCH_FREQ_MONTHLY_DATE": {itemType:"RADIO_GROUP",disabled:true},
					"RPT_SCH_RUNS_EVERY": {itemType:"RADIO_GROUP",disabled:true}
					};
		
			}
			
		});
	}
});
CFLR.registerListener("INFO_RPT_SCHEDULE_FORM", cbx.form.listeners.INFO_RPT_SCHEDULE_FORM);