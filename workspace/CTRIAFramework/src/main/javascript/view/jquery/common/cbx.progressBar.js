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
 * 
 
 */


cbx.lib.progressBar = Class(cbx.core.Component, {
	urlListLength : 0,
	totalFilePercentage : null,
	constructor : function(config) {
		var urlListLength=0;
		
		if(config.urls.indexOf(",") != -1){
			urlListLength = config.urls.split(',').length;
			this.urlListLength = Number(urlListLength);
			this.totalFilePercentage = Number(100 / this.urlListLength);
		}
		
	},
	initializeProgressBar : function() {

	},
	stopProgressBar : function() {

	},
	updateProgress : function(fileCounter) {
		$('#progressText').html(this.calcPercent(fileCounter));
	},
	calcPercent : function(x, y) {
		// console.log("ppppp "+Number(this.totalFilePercentage*x));
		/*
		 * window.setTimeout(function() { return
		 * Math.round(this.totalFilePercentage*x); }, 1000);
		 */
		if(!cbx.isEmpty(this.totalFilePercentage)){
			return Math.round(this.totalFilePercentage * x);
		}
		else{
			return "";
		}
		// return 100 * ( x / y );
	}
})
CLCR.registerCmp({
"COMP_TYPE":"PROGRESS_BAR",
"LAYOUT":"CIRCULAR"
},cbx.lib.progressBar); 