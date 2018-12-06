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
cbx.ns("cbx.form.listeners");
/**
 * This class is intended to register all the listeners files generated for each
 * form. The form manager will use it later to get the listener class associated
 * to the form which it is trying to load.
 * 
 * @class cbx.form.listeners.Register
 */
cbx.form.listeners.Register = function() {
	var listenerMap = {};
	return {
		getListener : function(id) {
			return listenerMap[id];
		},
		registerListener : function(formId, listenerRef) {
			listenerMap[formId] = listenerRef;
		}
	}
}(); 
// Global variable to be used in the application for accessing the listener
// register
var CFLR = cbx.form.listeners.Register;
var CFL = cbx.form.listeners;