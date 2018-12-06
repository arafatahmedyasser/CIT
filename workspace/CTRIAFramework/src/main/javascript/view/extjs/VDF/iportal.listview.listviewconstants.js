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
* This file is suppose to have all constant files for structure list view
*/
	Ext.namespace('iportal.listview');
	iportal.listview.listviewconstants ={
											AJAX_URL:iportal.jsutil.getController(),
											AJAX_URL_EXPORT_SERVICES:"/iportalweb/ExportServiceServlet",
											EXPORT_FORMAT_XLS:"XLS",
											//User msg key
											LOADING_MSG			:"LOADING_MSG",
					  						MSG_REQ_FAIL		:"MSG_REQ_FAIL",
					  						//Extra Params for request 
				  							INPUT_ACTION 		:  "INIT_ACTION",
				  							PRODUCT_NAME 		:  "CUSER",
				  							INPUT_FUNCTION_CODE :  "VSBLTY",
				  							INPUT_SUB_PRODUCT	: "CUSER" ,
				  							IS_FILTER_FORM		:"IS_FILTER_FORM",	
				  							/** Filter1 combo id/name */
				  							FILTER1_FIELD		:"FILTER1_FIELD",
				  							/** Filter1 constraint combo id/name */
				  							FILTER1_CONSTRAINT	:"FILTER1_CONSTRAINT",
				  							/** Filter2 text field id/name */
				  							FILTER1_VALUE_TXT	:"FILTER1_VALUE_TXT",
				  							/** Filter1 date filed id/name, Used only if filter1 selected column type is DATE*/
				  							FILTER1_VALUE_DATE	:"FILTER1_VALUE_DATE",	
				  							/** Filter1 2nd text field id/name, used only if filter1 constraint combo value is in-between*/
				  							FILTER1_VALUE_DATE2	:"FILTER1_VALUE_DATE2",
				  							/** Filter2 combo id/name */
				  							FILTER2_FIELD		:"FILTER2_FIELD",
				  							/** Filter2 constraint combo id/name */
				  							FILTER2_CONSTRAINT	:"FILTER2_CONSTRAINT",
				  							/** Filter2 date filed id/name, Used only if filter1 selected column type is DATE*/
				  							FILTER2_VALUE_TXT	:"FILTER2_VALUE_TXT",
				  							/** Filter2 date filed id/name, Used only if filter1 selected column type is DATE*/
				  							FILTER2_VALUE_DATE	:"FILTER2_VALUE_DATE",	
				  							/** Filter2 2nd text field id/name, used only if filter1 constraint combo value is in-between*/
				  							FILTER2_VALUE_DATE2	:"FILTER2_VALUE_DATE2",
				  							
				  							FILTER1_VALUE_TIME : "FILTER1_VALUE_TIME",
				  							FILTER1_VALUE_TIME2 :"FILTER1_VALUE_TIME2",
				  							FILTER2_VALUE_TIME : "FILTER2_VALUE_TIME",
				  							FILTER2_VALUE_TIME2 :"FILTER2_VALUE_TIME2",
				  							TIME_FLD_INCREMENT_VAL : 15,
				  							
			  								FORM_ID_SUFFIX 		: "__FILTER_FORM",
			  								/** FORM ID Suffix*/
			  								NAME_SUFFIX   		:"_NAME",
			  							//The underlying data field name to bind to this filter1 and filter2 ComboBox.Defaults to 'displaytxt'
			  								DISPLAY_FIELD		:'displaytxt',
			  								 //The underlying data value name to bind to this filter1 and filter2 ComboBox.Defaults to 'value'
			  								VALUE_FIELD			:'value',
			  								//Column types
		  									STRING				:"STRING",
		  									//This data type is very simular to String, however it will not mandate user to enter atleast 3 chars to search
		  									NUMSTR				:"NUMSTR",
		  									DATE				:"DATE",
		  									COMBO				:"COMBO",
		  									INT					:"INT",
		  									EQCCY				:"EQCCY",
		  									RATE				:"RATE",//For Rate Fields alone
		  									TIME				:"TIME",
		  									NULL_VALUE_REPLACE	:"--",
		  									FLOAT				:"FLOAT",
		  									BOOLEAN				:"BOOLEAN",
											ACC_DETAIL_ACTION	:"ACC_DETAIL_ACTION",
		  									LV_ACCT_CONTEXT_MENU	:"LV_ACCT_CONTEXT_MENU",
		  									LV_INVST_CONTEXT_MENU	:"LV_INVST_CONTEXT_MENU",
		  									LV_STRC_CONTEXT_MENU	:"LV_STRC_CONTEXT_MENU",
		  									PRODUCT_NAME_INVST		:"INVST",
		  									PRODUCT_NAME_LQDY		:"LQDY",
		  									DT_EQUALS				:"dtEquals",
											RANGE					:"range",
											CCY_MULTI_SELECT		:"CCY_MULTI_SELECT",
											ENTITY_NAME_MULTI_SELECT :"ENTITY_NAME_MULTI_SELECT",	  									
											AUDIT_DATE :"AUDIT_DATE"	  									
		  										
	};
