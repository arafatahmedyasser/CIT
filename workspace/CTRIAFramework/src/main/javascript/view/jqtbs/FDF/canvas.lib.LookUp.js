/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
cbx.ns('canvas.lib');
/**
 * @namespace "canvas.lib"
 * @description This component is responsible to allow the user to select multiple values from grids 
 */
canvas.lib.EditableLookup = Class(canvas.lib.FormElements,{
	
	//Error Icon Hidden in your i tag not in span
	/**
	 * @method generateFieldSpecificEvents
	 * @memberof "canvas.lib.LookUp"
	 * @description This method is responsible for creating the element specific functions.
	 */
	generateFieldSpecificEvents : function ()
	{
		
		// Need to Be done
		this.getComponent().find("span[data-item-id='ct-lookup-search']").on('click', $.proxy(function ()
		{
			if((this.widgetId == "") || (cbx.isEmpty(this.widgetId))){
				var yetToLoadWarnMsg = new canvas.Dialog({
					dialogType : "USERDEFINED",
					dialogStyle : "OK",
					message : CRB.getFWBundleValue('NO_WIDGET_LKP'),
					title : CRB.getFWBundleValue('LBL_CONFIRMATION'),
					okHandler : function(){
						yetToLoadWarnMsg.close();
						
					}
				});
				yetToLoadWarnMsg.show();
			}else{
				
				var filterParams = this.manager.handlerEvent('cbxbeforeload', this.itemid);
				var layerConfig = {
					"eleType": "div"
				};
				var element = new cbx.lib.layer(layerConfig).getLayer();
				var widgetConfig = {
					CONTAINER_FLAG : 'N',
					'WGT_HEADER_IND' : 'Y',
					WIDGET_ID : this.widgetId
				};
				var config = {
					elem : element,
					PORTLET_REQ : true,
					uData : this.uData,
					ptScope: this
				};
				cbx.core.extend(config, widgetConfig);
				var appObj = new canvas.lib.app(config);
				appObj.bbutClickHandler = this.buttonHandler;
				appObj.rowDblClickHandler = this.dblClickHandler;
				/**Call portlet model window to render the portlet within it in order to display it maximized*/
				var modal = CLCR.getCmp({
					"COMP_TYPE" : "MODAL_WINDOW",
				});
				if(cbx.isEmpty(this.widgetId)){
					this.warningTitle = CRB.getFWBundleValue("LBL_LOOKUP_WARN_TITLE");
					this.warningMsg = CRB.getFWBundleValue("LBL_LOOKUP_WARN_MSG");
					var modalConfig = {
								modalContent : '<div class="lookup-warning">'+this.warningTitle+'</div><div class="loolup-warning-msg">'+this.warningMsg+'</div>',
								modalClass : 'ct-modal__max',
								fullscreenInd : false
							};
				}
				else {
					var modalConfig = {
								modalContent : element,
								modalClass : 'ct-modal__max',
								fullscreenInd : false
							};
				}
				
				this.modalObj = new modal(modalConfig);
			CWEH.registerHandler(this.widgetId,CWEC.AFTER_TEMPLATE_LOAD,function(){
					canvas.lib.modalmgr.resizeActiveModalWindow();
				});
			}
			
		}, this));
		/**
		 * This is for Validating the value after entering into the element
		 */
		this.getComponent().find("input[name='" + this.itemId + "']").on('blur', $.proxy(function (event)
		{
			
			var newValue = this.getFieldValue();
			this.updateValue(newValue);
		},this));
		
	},
	/**
	 * @method buttonHandler
	 * @memberof "canvas.lib.LookUp"
	 * @description This method handles the button click in the lookup . It raises the appropriate event to set the selected data
	 */
	buttonHandler: function(){
		var selectedData = arguments[1];
		selectedData.__LOOKUP_NAME = this.ptScope.widgetId;
		var buttonId = arguments[0];
		this.ptScope.manager.handlerEvent("cbxafterselect",this.ptScope.itemId,selectedData,buttonId);
		this.ptScope.modalObj.hideModal();
		this.manager.handlerEvent('cbxclearlookup', this.itemId);
	},
	/**
	 * @method dblClickHandler
	 * @memberof "canvas.lib.LookUp"
	 * @description This method handles the row selections in the lookup . It raises the appropriate event to set the selected data
	 */
	dblClickHandler: function(){
		var selectedData = arguments[2];
		selectedData.__LOOKUP_NAME = this.ptScope.widgetId;
		this.ptScope.manager.handlerEvent("cbxafterselect",this.ptScope.itemId,selectedData);
		this.ptScope.modalObj.hideModal();
		this.manager.handlerEvent('cbxclearlookup', this.itemId);
	},
	/**
	 * @Method setEnabledField
	 * @memberOf "canvas.lib.LookUp"
	 * @param enableFlag- {Boolean} showFlag True to show, false to hide
	 * @description Intended to enable/ disable any component rendered under this Form Manager instance
	 * @access public
	 * 
	 */
	setEnabledField : function (enableFlag)
	{
		if (jQuery.type(enableFlag) === "boolean")
		{
			if (enableFlag)
			{
				this.getComponent().find("input[name='" + this.itemId + "']").removeAttr('disabled');
			} else
			{
				this.getComponent().find("input[name='" + this.itemId + "']").attr('disabled','disabled');
			}
		}
	},
	/**
	 * @method setFieldValue
	 * @memberof "canvas.lib.LookUp"
	 * @description This method is responsible to set the field value.
	 */
	setFieldValue : function (value)
	{
		this.getComponent().find("input[name='" + this.itemId + "']").val(value);
		if(this.compRef.hasClass('has-error')){
			this.markInvalidField();
		}
		this.setEnabledField(this.isEnabled);
	},
	/**
	 * @method getFieldValue
	 * @memberof "canvas.lib.LookUp"
	 * @description This method is responsible to get the field value.
	 */
	getFieldValue : function ()
	{
		return this.getComponent().find("input[name='" + this.itemId + "']").val();
	},
	/**
	 * @method updateValue
	 * @memberof "canvas.lib.LookUp"
	 * @description This method is responsible for updating the modal value with the field value.
	 */
	updateValue : function (newValue)
	{
			if (this.validateValue(newValue))
			{ // if validate is success then allow
				this.setFieldValue(this.formatValue(newValue));
				if(newValue != this.value){
					this.value = newValue
					this.model.updateValue(this.itemId, newValue);// Updated from the setValue to updateValue
					if(this.itemType == "LOOKUP")
						this.updateScreenViewData(this);
	}
				this.setValid(true);
				this.clearInvalid();
			} else
			{
				this.setFieldValue(newValue);
				if(newValue != this.value){
					this.value = newValue
					this.model.updateValue(this.itemId, newValue);// Updated from the setValue to updateValue
					if(this.itemType == "LOOKUP")
						this.updateScreenViewData(this);
				}
				this.setValid(false);
				this.markInvalid(CRB.getFWBundleValue('ERR_VALID_SELECT'));
			}
	},
	/**
	 * @method getScreenViewData
	 * @memberof "canvas.lib.LookUp"
	 * @description returns the data present in the field.
	 */
	getScreenViewData: function(){
		if(this.itemType == "LOOKUP")
			this.getFieldValue();
	}
});

CFCR.registerFormCmp({
	'COMP_TYPE' : 'FORM_FIELDS',
	'COMP_NAME' : 'cbx-editablelookup'
}, canvas.lib.EditableLookup);
CFCR.registerFormCmp({
	'COMP_TYPE' : 'FORM_FIELDS',
	'COMP_NAME':'cbx-lookup' 
}, canvas.lib.EditableLookup);
