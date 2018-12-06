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
 
cbx.ns('canvas.lib.view');
canvas.lib.view.datatype = function() {
	var colTypeMap = {
		'date' 		: 'cbxdatecolumn',
		'time' 		: 'cbxdatecolumn',
		'float' 	: 'cbxamountcolumn',
		'eqccy' 	: 'cbxamountcolumn',
		'eqamt' 	: 'cbxamountcolumn',
		'context' 	: 'cbxcolumn',
		'string' 	: 'cbxcolumn',
		'int' 		: 'cbxcolumn',
		'numstr' 	: 'cbxcolumn',
		'rate' 		: 'cbxcolumn',
		'boolcheck' : 'cbxcolumn',
		'variance' 	: 'cibcvariancecolumn',
		'price' 	: 'cibcpricecolumn'
	};
	
	var filterTypeMap = {
		"date" 		: "date",
		"time" 		: "string",
		"float" 	: "float",
		"list" 		: "list",
		"string" 	: "string",
		"int" 		: "float",
		"numstr" 	: "string",
		"rate" 		: "float",
		"boolcheck" : "bool"
	};
	return {
		/**
		 * 
		 */
		getColumnTypeMap : function() {
			return colTypeMap;
		},
		
		/**
		 * 
		 */
		getFilterTypeMap : function() {
			return filterTypeMap;
		}, 
		
		/**
		 * 
		 */
		convertStringToDateObject : function(stdat) {
			if (!cbx.core.isEmpty(stdat) && typeof (stdat) == 'string') {
				var vals = stdat.split("/");
				var xdate = null;
				var monthfield = vals[1];
				var dayfield = vals[0];
				var yearfield = vals[2];
				xdate = new Date(yearfield, monthfield - 1, dayfield);
				if ((xdate.getMonth() + 1 != monthfield) || (xdate.getDate() != dayfield)
						|| (xdate.getFullYear() != yearfield)) {
					return "Invalid Date";
				} else {
					xdate = new Date();
					var intvals = [ Number(vals[0]), Number(vals[1]), Number(vals[2]) ];
					xdate.setFullYear(intvals[2], intvals[1] - 1, intvals[0]);
					return xdate;
				}
			} else
				return stdat;
		},
		
		/**
		 * 
		 */
		applyFormatting : function($elem) {
			var dateF = iportal.preferences.getDateFormat();
			var amtF = iportal.preferences.getAmountFormat();
			
			$elem.find('[type="cbxamountcolumn"]').each(function() {
				var cell = $(this);
				var posFlag = true;
				var val = $.trim(cell.html());
				if (val !== '--') {
					val = parseFloat(val.replace(/,/g, ""));
					if (val < 0) {
						posFlag = false;
					}
					val = $.format.number(val, amtF);
					if (posFlag === true) {
						cell.html(val);
					} else {
						cell.html('(' + val + ')');
						cell.addClass('negativeAmt');
					}
				}

			});
			$elem.find('[type="cbxdatecolumn"]').each(function() {
				var cell = $(this);
				var posFlag = true;
				var val = $.trim(cell.html());
				if (val !== '--') {
					val = canvas.lib.view.datatype.convertStringToDateObject(val);
					val = $.format.date(val, dateF);
					cell.html(val);
				}
			});
		
			$elem.find('[type="cibcvariancecolumn"]').each(function() {
				var cell = $(this);
				var posFlag = true;
				var val = $.trim(cell.html());
				var cellVal = val;
				if (val !== '--') {
					val = parseFloat(val.replace(/,/g, ""));
					if (val < 0) {
						posFlag = false;
					}
					if (posFlag === true) {
						cell.html(cellVal);
					} else {
						cell.html('(' + cellVal.replace(val,Math.abs(val)) + ')');
						cell.addClass('negativeAmt');
					}
				}
			});
			$elem.find('[type="cibcpricecolumn"]').each(function() {
				var cell = $(this);
				var posFlag = true;
				var val = $.trim(cell.html());
				var cellVal = val;
				if (val !== '--') {
					val = val.replace(/[^\d.]/g, "");
					if (val < 0) {
						posFlag = false;
					}
					if (posFlag === true) {
						var trillion = 1000000000000;
						var billion = 1000000000;
						var million = 1000000;
						var output = '';
						if(Math.floor(val/trillion) > 0){
							output = val/trillion;
							output = output.toFixed(2);
							cellVal = cellVal.replace(val,output) + ' T';
						} else if(Math.floor(val/billion) > 0){
							output = val/billion;
							output = output.toFixed(2);
							cellVal = cellVal.replace(val,output) + ' B';
						} else if(Math.floor(val/million) > 0){
							output = val/million;
							output = output.toFixed(2);
							cellVal = cellVal.replace(val,output) + ' M';
						}
						cell.html(cellVal);
					} else {						
						cell.html('(' + val + ')');
						cell.addClass('negativeAmt');
					}
				}
			});
		}
	};
}();
