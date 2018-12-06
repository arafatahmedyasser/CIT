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
cbx.namespace("iportal");

iportal.preferences = function(){
	/** Private data*/
    var PRIMARY_LANG ="en_US";
    var SECONDARY_LANG="en_US";
    var ENABLE_SECONDARY_LANG=true;
    var AMOUNT_FORMAT="USA";
    var DATE_FORMAT="dd/MM/yyyy";
    var TIME_ZONE="IST";
    var START_UP_WORKSPACE="LQDY_DASH_BORD";
    var AMOUNT_FORMAT_JSON = {};
    var DATE_FORMAT_JSON = {};
    return Ext.apply(new Ext.util.Observable, {
    	/** Returns primary languge value*/
        getPrimaryLang:function(){
        	return PRIMARY_LANG;
        },
        /** Returns secondary language value*/
        getSecondaryLang:function(){
	        return SECONDARY_LANG;
        },
        /** Returns true if secondary language enabled else false*/
        isSecondayLangEnabled:function(){
	        return ENABLE_SECONDARY_LANG;
        },
        /** Returns amount format value*/
        getAmountFormat:function(){
        	return AMOUNT_FORMAT;
        },
        /** Returns date format value*/
        getDateFormat: function() {
			return DATE_FORMAT;
        },        
        /** Returns time zone value*/
        getTimeZone:function(){
        	return TIME_ZONE;
        },
        /** Returns startup workspace name*/
        getStartupWorkspace:function(){
        	return START_UP_WORKSPACE;
        },
        /** Returns Amount Format Json*/
        getAmountFormatJson:function(){
        	return AMOUNT_FORMAT_JSON;
        },
        /** Returns Date Format Json*/
        getDateFormatJson:function(){
        	return DATE_FORMAT_JSON;
        }
    })
}();



