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
cbx.ns('cbx.lib.view');
/*
 * The class creates the required header for the workspace.
 *

*/

cbx.lib.view.header = Class( {
	headerData: null,
	parentElem: null,
	iconlistener: '',
	headerListeners: '',
	constructor: function(config) {
		this.headerData = config.md;		
		this.parentElem = config.parentElem;
		this.headerListeners = ['favoriteicontap','cbxlogotap','alerttap','notestap','messagetap','workspacemenutap','colorpickertap'];
		this.maindiv = this.createHeader();
	},
	getHeaderDOM: function() {		
		return this.maindiv;
	},		
	createHeader: function() {		
		var iconDataObj;
		var twoColDiv;
		// This parses the given JSON parameters and assigns to header_details variable
		headerData = (typeof this.headerData == 'string'?JSON.parse(this.headerData):this.headerData);				
		// Creates header div
		headerConf={
			"eleType": "div",
			"class": this.headerData[0].HEADER_STYLE_CLASS,
			"data-theme": "a",
			"data-role": "header",
			"role": "banner",
			"data-position": "fixed"
		};
		var headerObj = new cbx.lib.layer(headerConf);			
		/**
		*1.	data-role controlgroup and data-type horizontal, helps to keep all the icons in a single horizontal line 
		* 	creating the 3 types of configuration objects for CBX Header 1)leftDivObj 2.CenterDivObj 3.RightDivObj
		**/
		colOneConf={
			"eleType": "div",
			"class": 'hCol-one',
			'data-role': 'controlgroup',
			'data-type': 'horizontal'
		};
		var headerColOneObj = new cbx.lib.layer(colOneConf);		
		headerObj.addLayer(headerColOneObj.getLayer());
		
		//parse the header control left division details
		for ( var key = 0; key < this.headerData[0].ICON_LEFT_DETAILS.length ; key++ ) {
			this.iconlistener = this.headerListeners[key];
			var leftDataConf = {
				"icondata": this.headerData[0].ICON_LEFT_DETAILS[key],
				"iconlistener": this.iconlistener
			}
			iconDataObj = this.getIconDOM(leftDataConf);			
			headerColOneObj.addLayer(iconDataObj);			
		}				
		headerObj.addLayer(headerColOneObj.getLayer());
		if ( this.headerData[0].hasOwnProperty("HEADER_TEXT") ) {
			//crating configuration for the header center division
			colTwoconf = {
				"eleType": "div",
				"class": 'hCol-two'
			};
			var headerColTwoObj = new cbx.lib.layer(colTwoconf);
			centerConf = {
				"eleType": "div",
				"role": "heading"
			};			
			var centerDivisionObj = new cbx.lib.layer(centerConf);						
			//parse the header control center division details
			for (var key = 0; key < this.headerData[0].ICON_CENTER_DETAILS.length; key++) {	
				var centerDataConf = {
					icondata: this.headerData[0].ICON_CENTER_DETAILS[key]
				};
				iconDataObj = this.getIconDOM(centerDataConf);
				centerDivisionObj.addLayer(iconDataObj);				
			}
			headerColTwoObj.addLayer(centerDivisionObj.getLayer());
			headerObj.addLayer(headerColTwoObj.getLayer());			
		}
		//creating configuration for header right side horizontal division
		colThreeConf = {
			"eleType": "div",
			"class": 'hCol-three',
			'data-role': 'controlgroup',
			'data-type': 'horizontal',
			style: {
				'text-align': 'right'
			}
		};
		var headerColThreeObj = new cbx.lib.layer(colThreeConf);
		//parse the header control right division details
		for (var key = 0; key < this.headerData[0].ICON_RIGHT_DETAILS.length; key++) {
			this.iconlistener = this.headerListeners[2+key];
			rightDataConf = {
				"icondata": this.headerData[0].ICON_RIGHT_DETAILS[key],
				"iconlistener": this.iconlistener
			};
			iconDataObj = this.getIconDOM(rightDataConf);
			headerColThreeObj.addLayer(iconDataObj);
		}
		headerObj.addLayer(headerColThreeObj.getLayer());
		delete headerColOneObj;
		delete headerColTwoObj;
		delete headerColThreeObj;
		delete iconDataObj;
		return headerObj.getLayer();			
	},
	//common function for three division details to read the icon control object.
	getIconDOM: function(data) {
		data['parentElem'] = this.parentElem;
		var iconObj = new cbx.lib.view.icon(data);
		return iconObj.getIconControlDOM();
	}
});