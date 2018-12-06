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
cbx.ns('canvas');
canvas.idleSessionTimeout = function() {
	var timeoutTimer = null;
	var logoutTimer= null;
	var win = null;
	var seconds =null;
	return {
		startTimers : function() {
			var idleSessionTimeoutInMilliSeconds = iportal.systempreferences.getIdleSessionTimeoutInSeconds();
			timeoutTimer = setTimeout("canvas.idleSessionTimeout.idleTimeout()", idleSessionTimeoutInMilliSeconds);
			logoutTimer = setTimeout("canvas.idleSessionTimeout.idleLogout()", iportal.systempreferences.getMaxInactiveInterval());
		},

		resetTimers : function() {
			clearTimeout(timeoutTimer);
			clearTimeout(logoutTimer);
			canvas.idleSessionTimeout.startTimers();
		},

		idleTimeout :function() {
			var rb = CRB.getFWBundle();
			var timeTologout=(iportal.systempreferences.getMaxInactiveInterval()- iportal.systempreferences.getIdleSessionTimeoutInSeconds())/1000;
			win = new iportal.Dialog({
						dialogType : 'WARNING',
						cls : 'portal_pos_btn',
						cancelHandler : function() {
							win.close();
							clearInterval(seconds);
							setTimeout(function() {
								cbx.lib.utility.logoutUser();
							}, 100);
						},
						message : '<div style=\'padding:3px;\'><div style=\'padding:3px;\'>'
								+ rb['LBL_TIMEOUT_CLOSE']
								+ '<span id=\'stopWatch\'> '+timeTologout+'</span><span> Second(s)</span></div><div style=\'padding:3px;\'>'
								+ rb['LBL_IDLE_SESSION_TIMEOUT'] + '</div></div>',
						okHandler : function() {
							win.close();
							clearInterval(seconds);
							clearTimeout(timeoutTimer);
							clearTimeout(logoutTimer);
							canvas.idleSessionTimeout.startTimers();
						},
						title : rb['LBL_SESSION_TIMEOUT']
					});
			win.show();
			seconds = setInterval(function() {
				var sec = parseInt($('#stopWatch').html());
				if (sec > 0) {
					sec = sec - 1;
					sec.toString();
					$("#stopWatch").text(sec);
				} else {
					clearInterval(seconds);
				}
			}, 1000);
		},

		idleLogout : function() {
			win.close();
			setTimeout(function() {
				cbx.lib.utility.logoutUser();
			}, 100);
		}
	}
}();

if (iportal.systempreferences.getFramework() == "jqm")
{
	$(document).on('pageinit', function (event)
	{
		canvas.idleSessionTimeout.startTimers();
		$(document).on('mouseup keydown click touchstart touchmove touchend ', function ()
		{
			canvas.idleSessionTimeout.resetTimers();
		});
	});
}