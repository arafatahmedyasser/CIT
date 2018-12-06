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
$(window).on("resize", function (event) {
		setTimeout(
			function(){
				cbx.lib.utility.resizeContentDiv();
				cbx.lib.utility.performUtilityOperations();
			},250);
	});

$(document).on('dateboxcreate', '.ui-page-active',function(evt){
	cbx.lib.datePicker.addToArray(evt.target);
}); 

$(document).bind("mobileinit", function(){
	  $.mobile.ignoreContentEnabled = true;
});