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
 * This function is used to update the user preferences as per the config
 * The config should contain preference in json structure as
 * eg. config={"PREFERENCES":{"AMOUNT":"###.##","LANGUAGE":"en_US"...}}
 */


cbx.ns("canvas.preferences");
canvas.preferences.updatePreferences=function(config,successHandler,failureHandler)
{
	var pref=config.PREFERENCES;
	var fm=config;
	var tempInd=config.temporaryInd;
	if(cbx.isEmpty(cbx.isEmpty(pref)))
		return;
	
	var prefKeys= Object.keys(pref);
	var preference={
				PREFERENCE_TYPE:[],
				PREFERENCE_VALUES:[]
	};
	var ind;
	for(ind=0; ind<prefKeys.length;ind++)
		{
		if(!cbx.isEmpty(pref[prefKeys[ind]]))
			{
			preference.PREFERENCE_TYPE.push(prefKeys[ind]);
			preference.PREFERENCE_VALUES.push(pref[prefKeys[ind]]);
			}
		}	
	var updatePrefSuccessFn=function(response,storeMetadata){
		var d = new Date,
		dformat = [ d.getDate().padLeft(),
		            (d.getMonth()+1).padLeft(),
		            d.getFullYear()].join('/')+
		            ' ' +
		            [ d.getHours().padLeft(),
		              d.getMinutes().padLeft(),
		              d.getSeconds().padLeft()].join(':');

		dformat+"";

		if(cbx.isEmpty(response.JSON_MAP["STATUS"])||response.JSON_MAP["STATUS"]=="FAILURE")
		{
			var errWin = new iportal.Dialog({
				dialogType : 'ERROR',
				title : CRB.getFWBundle()['LBL_ERROR'],
				message : CRB.getFWBundle()['LBL_PREF_UPD_ERR_MESS'],
				okHandler : function(){
					errWin.close();
				}
			});
			errWin.show();
		}
		else{
			if(storeMetadata){
				setTimeout(function(){
					try{
						canvas.metadata.storeMetaData("UPDATE_PREFERENCE",{id:"UPDATE_PREFERENCE",value:response,serverdatetime:dformat});
					}
					catch (e) {
						LOGGER.error('Error while storing UPDATE_PREFERENCE  cache', e);
					}
				},100);
			}
			var success = new iportal.Dialog({
				dialogType : 'USERDEFINED',
				dialogStyle : 'OK',
				message : cbx.isEmpty(tempInd)||tempInd=="N"?CRB.getFWBundle()['LBL_UPDATE_PREF_SUCCESS']:CRB.getFWBundle()['LBL_UPDATE_PREF_SUCCESS_TEMP'],
							closeIconRequired : true,
							okHandler : function(){
								success.close();
								appRefresh = true;
								window.location.reload(true);
							},
							title : CRB.getFWBundle()['LBL_CONFIRMATION']
			});
			success.show();	
		}

	};
	
	var updatePrefFailureFn=function(){
		var errWin = new iportal.Dialog({
			dialogType : 'ERROR',
			title : CRB.getFWBundle()['LBL_ERROR'],
			message : CRB.getFWBundle()['LBL_PREF_UPD_ERR_MESS'],
			okHandler : function(){
				errWin.close();
			}
		});
		errWin.show();

	};
	canvas.metadata.getMetaData("UPDATE_PREFERENCE","UPDATE_PREFERENCE",function(metadatavalue){
		var stateObj = {
					'NetworkState' : 'ACTIVE'
				};
		if(canvas.env.network.getState() != 'ACTIVE'){
			if(!cbx.isEmpty(metadatavalue)){
				stateObj.NetworkState="INACTIVE";
				if(cbx.isFunction(successHandler)){
					successHandler.apply(scope || this,[cbx.decode(metadatavalue),stateObj]);
				}else{
					updatePrefSuccessFn(cbx.decode(metadatavalue))
				}	
			}
			else{
				if(cbx.isFunction(failureHandler)){
					failureHandler.apply(scope || this,[cbx.decode(metadatavalue),stateObj]);
				}else{
					updatePrefFailureFn();
				}	
			}
			
		}else{
			var d = new Date,
			dformat = [ d.getDate().padLeft(),
			            (d.getMonth()+1).padLeft(),
			            d.getFullYear()].join('/')+
			            ' ' +
			            [ d.getHours().padLeft(),
			              d.getMinutes().padLeft(),
			              d.getSeconds().padLeft()].join(':');

			dformat+"";
			var params= {
						INPUT_ACTION : "UPDATE_PREFERENCE",
						PAGE_CODE_TYPE : 'USER_PREF_CODE',
						PRODUCT_NAME : "CANVAS",
						INPUT_FUNCTION_CODE : "VSBLTY",
						INPUT_SUB_PRODUCT : "CANVAS",
						INPUT_PRODUCT : "CANVAS",
						TEMP_UPDATE_PREFERENCE_IND:cbx.isEmpty(config.temporaryInd)?"N":config.temporaryInd,
									PREFERENCE:cbx.encode(preference),
									"JSON_TO_HASH_MAP_SUPPORT_FLAG":"PREFERENCE"

			};
			cbx.ajax({
				params : params	,
				success : !cbx.isEmpty(successHandler)?function(response){
					successHandler.apply(scope,[response,stateObj]);
					setTimeout(function(){
						try{
							if(cbx.isEmpty(tempInd) || tempInd=="N")
							canvas.metadata.storeMetaData("UPDATE_PREFERENCE",{id:"UPDATE_PREFERENCE",value:response,serverdatetime:dformat});
						}
						catch (e) {
							LOGGER.error('Error while storing UPDATE_PREFERENCE  cache', e);
						}
					},100);
				}: function(response){
					if(cbx.isEmpty(tempInd) || tempInd=="N")
					updatePrefSuccessFn(response,true)
					else
					updatePrefSuccessFn(response)	
				},
				error:!cbx.isEmpty(failureHandler)?function(response){
					failureHandler.apply(scope,[response,stateObj])
				}: function(response){
				updatePrefFailureFn();

				}

			});	
		}
	},this);
	
	
	
};
/**
 * This method eexpects the following parameter
 * prefTypes: preferences types that need to be fetched has to be referred here. ie. PREFERENCE:{"PREFERENCE_TYPES":{}}
 */

canvas.preferences.initPreferences=function(prefTypes,scope,successHandler,failureHandler,syncFlag,errorMessageDisplay)
{

	var initPrefFailureFn=function(){

		var errWin = new iportal.Dialog({
			dialogType : 'ERROR',
			title : CRB.getFWBundle()['LBL_ERROR'],
			message : CRB.getFWBundle()['LBL_PREF_INIT_ERR_MESS'],
			okHandler : function(){
				errWin.close();
			}
		});
		errWin.show();
	};
	canvas.metadata.getMetaData("GET_USER_PREF","GET_USER_PREF",function(metadatavalue){
		var stateObj = {
					'NetworkState' : 'ACTIVE'
				};
		if(canvas.env.network.getState() != 'ACTIVE'){
			if(!cbx.isEmpty(metadatavalue)){
				stateObj.NetworkState="INACTIVE";
				if(cbx.isFunction(successHandler)){
					successHandler.apply(scope || this,[cbx.decode(metadatavalue),stateObj]);
				}
			}else{
				if(cbx.isFunction(failureHandler)){
					failureHandler.apply(scope || this,[cbx.decode(metadatavalue),stateObj])
				}else{
					initPrefFailureFn();	
				}	
			}
		}
		else{
			var params= {
						INPUT_ACTION : "GET_USER_PREF",
						PAGE_CODE_TYPE : 'USER_PREF_CODE',
						PRODUCT_NAME : "CANVAS",
						INPUT_FUNCTION_CODE : "VSBLTY",
						INPUT_SUB_PRODUCT : "CANVAS",
						INPUT_PRODUCT : "CANVAS",
						PREFERENCE:cbx.encode(prefTypes),
						"JSON_TO_HASH_MAP_SUPPORT_FLAG":"PREFERENCE"

			};
			var d = new Date,
			dformat = [ d.getDate().padLeft(),
			            (d.getMonth()+1).padLeft(),
			            d.getFullYear()].join('/')+
			            ' ' +
			            [ d.getHours().padLeft(),
			              d.getMinutes().padLeft(),
			              d.getSeconds().padLeft()].join(':');

			dformat+"";
			cbx.ajax({

				params : params,
				syncMode: cbx.isBoolean(syncFlag)?syncFlag :true,
				failureMessage: cbx.isBoolean(errorMessageDisplay)?errorMessageDisplay :true,
				success : !cbx.isEmpty(successHandler)? function(response){
					successHandler.apply(scope,[response,stateObj]);
					setTimeout(function(){
						try{
							canvas.metadata.storeMetaData("GET_USER_PREF",{id:"GET_USER_PREF",value:response,serverdatetime:dformat});
						}
						catch (e) {
							LOGGER.error('Error while storing USER_PREF  cache', e);
						}
					},100);
				}:function(response){
					setTimeout(function(){
						try{
							canvas.metadata.storeMetaData("GET_USER_PREF",{id:"GET_USER_PREF",value:response,serverdatetime:dformat});
						}
						catch (e) {
							LOGGER.error('Error while storing USER_PREF  cache', e);
						}
					},100);
				},
				error:!cbx.isEmpty(failureHandler)?function(response){
					failureHandler.apply(scope,[response,stateObj])
				}: function(response){
					initPrefFailureFn();
				}

			});
		}
	},this);



};


canvas.preferences.temporaryPreferences=function(config,successHandler,failureHandler)
{
	config.temporaryInd="Y";
	canvas.preferences.updatePreferences(config,successHandler,failureHandler);
};

canvas.MessageBus.subscribe("canvas.hybrid.lazyChanges", 'canvas.env.network' + cbx.id(), this, function(data) {

	if(iportal.systempreferences.isHybrid() === "true" && canvas.env.network.getState() == 'ACTIVE'){
		var PREFERENCES = {
					PREFERENCE_TYPES : []
		};
		PREFERENCES.PREFERENCE_TYPES.push("AMOUNT");
		PREFERENCES.PREFERENCE_TYPES.push("LANGUAGE");
		PREFERENCES.PREFERENCE_TYPES.push("THEME");
		PREFERENCES.PREFERENCE_TYPES.push("DATEFORMAT");
		PREFERENCES.PREFERENCE_TYPES.push("FONTSIZE");
		PREFERENCES.PREFERENCE_TYPES.push("TIMEZONE");
		PREFERENCES.PREFERENCE_TYPES.push("USER_ROLE"); 
		PREFERENCES.PREFERENCE_TYPES.push("TIMEFORMAT");
		canvas.preferences.initPreferences(PREFERENCES, undefined, cbx.emptyFn, cbx.emptyFn,false,false);
	}

});
