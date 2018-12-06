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
 * Implementing JQM's navigate event..
 * Fired when a hash change occurs on the browser..
 * 
 * 
 * For browser compatibility and other usability information,see docs
 * http://api.jquerymobile.com/jQuery.mobile.navigate/
 * 
 * 
 */
$(window).on('navigate', function( event, data ) {
	/**
	 * 1.Checking for state obj,which will be available only on browser navigation
	 * 2.Checking for preventHash flag set in beforeLoad Event
	 * The preventHash flag indicates that hashing handler is to be avoided for 
	 * the particular event as it has been fired by JQM directly.
	 */
	if(!cbx.isEmpty(data.state) && cbx.lib.workspacehandler.preventHash==false){
		var hashingRequiredInd = data.state['hashingRequired'];
		if(hashingRequiredInd=="Y"){
			cbx.lib.workspacehandler.createWorkspace(data.state.workspaceId,data.state.index,data.state.callBackFn,data.state.scope);
		}
		else if(cbx.lib.logoutInProgress){
			event.preventDefault();
			return;
		}
		/**
		 * Added to log out user prior initial index i.e first workspace
		 * cbx.lib.logoutInProgress -> This is a flag which will indicate if
		 * the user has already performed a log out operation.This has been added
		 * to prevent this behaviour when log out has been clicked,as it will 
		 * also again trigger a navigate event,where this operation is not required.
		 * 
		 * 
		 */
		else if($.mobile.urlHistory.getLast().index==0 && data.state.direction=='back' && !cbx.lib.logoutInProgress) {
			event.preventDefault();
			cbx.lib.utility.logoutUser();
		}
		/**
		 * Added to handle all url's which have hashing disabled
		 */
		else if(hashingRequiredInd=="N"){
			data.state.direction =="back"?history.back():data.state.direction =="forward"?history.forward():cbx.emptyFn;
		}
	}
});
/**
 * Implementing jqm's beforenavigate event.
 * Added to handle all the page change events fired by jqm
 * e.g dialog
 * 
 * This could be designed to capture more parameters once identified.
 * Currently it is only dialog 
 * 
 * 
 * 1.Checks for the last url in stack.If fired by dialog,updates a flag
 * to tell navigate event that it has been fired by dialog,else resets it
 *  
 */
$(window).on('beforenavigate', function(event) {
	/**
	 * First hit -> get Last will be undefined..
	 * Hence adding this check.
	 * 
	 * preventing navigate to occur for all dialog's
	 * fired by jquery mobile
	 */
	var isPreventRequired= function(){
		if($.mobile.urlHistory.getLast() && $.mobile.urlHistory.getLast().role=='dialog'){
			return true;
		}
		if(cbx.lib.homeInProgress==true){
			cbx.lib.homeInProgress=false;
			return true;
		}
	}
	isPreventRequired()==true?cbx.lib.workspacehandler.setPreventHashFlag(true):cbx.lib.workspacehandler.resetPreventHashFlag();
});

