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

cbx.ns('canvas.lib');
/**
 * @namespace 	"canvas.lib"
 * @description This component is currently responsible Jquery_Bootstrap Framework to create form composite DOM.
 */

canvas.lib.formCompositeDOM = Class(canvas.lib.FormElements,{	
	/**
	 * @class 		"canvas.lib.FormComposite"
	 * @extends		"canvas.lib.FormCmpManager"
	 * @description This class creates the DOM structure for composite form. 
	 */
	isContainer : true,
	/**
	 * @method 		containerDOM
	 * @memberof 	"canvas.lib.formCompositeDOM"
	 * @description This method returns the DOM structure of composite form parent container. 
	 */
	containerDOM : function() {
		
		var containerDiv = new cbx.lib.layer({
			"eleType" : "div",
			"class" : "form-group"
		}).getLayer();
		var rowDiv = new cbx.lib.layer({
			"eleType" : "div",
			"class" : "ct-form-composite__row row",
			"data-item-id" : "form-composite"
		}).getLayer();
		
		if( !this.visibleInd )
			$(containerDiv).addClass("hidden");
		$(containerDiv).append(rowDiv);
		
		return containerDiv;
	},
	
	/**
	 * @method 		labelDOM
	 * @memberof 	"canvas.lib.formCompositeDOM"
	 * @description This method returns the DOM structure of composite form label. 
	 */
	labelDOM : function() {
		
		this.getLabel() ;
		
		
		var headerDiv = new cbx.lib.layer({
			"eleType" : "div",
			"class" : "col-lg-12 col-md-12 col-sm-12 col-xs-12"
		}).getLayer();
		
		if( !this.hideLabel )
		{
		
			if( this.labelAlignType != "TOP")
				$(headerDiv).removeClass("col-lg-12 col-md-12 col-sm-12 col-xs-12").addClass("col-lg-2 col-md-2 col-sm-2 col-xs-2");
		var labelDiv = new cbx.lib.layer({
			"eleType" : "label",
			"for" : this.itemId
		}).getLayer();
		
		
		var headingDiv = new cbx.lib.layer({
			"eleType" : "span",
			"class" : "ct-form__label",
			"html" : this.fieldLabel
		}).getLayer();
		
		$(labelDiv).append(headingDiv);
		$(headerDiv).append(labelDiv);
		}
		
		return headerDiv;

	},
	
	/**
	 * @method 		compositeBodyDOM
	 * @memberof 	"canvas.lib.formCompositeDOM"
	 * @description This method returns the DOM structure of composite form body. 
	 */
	compositeBodyDOM : function () {
		
		var bodyDiv = new cbx.lib.layer({
			"eleType" : "div",
			"class" : "col-lg-10 col-md-10 col-sm-10 col-xs-10"
		}).getLayer();
		
		if( (this.labelAlignType == "TOP" && !this.hideLabel) || (this.hideLabel) )
			$(bodyDiv).removeClass("col-lg-10 col-md-10 col-sm-10 col-xs-10").addClass("col-lg-12 col-md-12 col-sm-12 col-xs-12");
		var formInlineDiv = new cbx.lib.layer({
			"eleType" : "form",
			"class" : "form-inline ct-from__composite row",
			"data-item-id" : "inline"
		}).getLayer();
		$(bodyDiv).append(formInlineDiv);
		
		return bodyDiv;

	},
	
	/**
	 * @method 		errorMsgDOM
	 * @memberof 	"canvas.lib.formCompositeDOM"
	 * @description This method returns the DOM structure of composite form error msg.
	 */
	errorMsgDOM : function () {
		
		var errorDiv = new cbx.lib.layer({
			"eleType" : "span",
			"class" : "input-group-addon ct-input-group-addon",
			"type" : "error_Msg_Container"
		}).getLayer();
		
		var errorMsg = new cbx.lib.layer({
			"eleType" : "span",
			"class" : "hidden",
			"type" : "error_Msg"
		}).getLayer();
		
		var errorIcon = new cbx.lib.layer({
			"eleType" : "i",
			"class" : "flaticon-alert"
		}).getLayer();
		
		$(errorMsg).append(errorIcon);
		$(errorDiv).append(errorMsg);
		
		return errorDiv;
	},
	
	/**
	 * @method 		generateFieldSpecificEvents
	 * @memberof 	"canvas.lib.formCompositeDOM"
	 * @description 
	 */
	generateFieldSpecificEvents:function(){
		
		// Need to Be done
	}

});
