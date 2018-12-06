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
 
cbx.ns('cbx.lib.form');

/*
 * This class is reponsible for Instantiate the all formComponents.
 *
 
*/
cbx.lib.form.CBXFormComponents = Class(cbx.core.Component, {
	
	initialize: function() {		
		this.createFormComponents();	
	},
	createFormComponents: function() {	
		var formFieldObject;		
		try{
			var formComponents = MockJS.getFormComponentsData();		
			this.formData = formComponents.children;		
			formComponentsConf = {
				eleType: "div"
			};			
			this.formComponentsObj = new cbx.lib.layer(formComponentsConf);			
			if(this.formData.length !== 0){
				for(var i = 0;i < this.formData.length ; i++){
				this.itemType = this.formData[i].itemType;				
				if(this.itemType.trim().toUpperCase() === 'TEXT' || this.itemType.trim().toUpperCase() === '') {
					textFlieldConfig = {
						conf: this.formData[i]
					};			
					this.formFieldObject = new cbx.lib.formElement.cbxTextField(textFlieldConfig);			
				}
				else if( this.itemType.trim().toUpperCase() === 'AMOUNT') {
					this.formFieldObject = new cbx.lib.formElement.cbxAmountField(this.formData[i]);
				}
				else if(this.itemType.trim().toUpperCase() === 'DATE') {
					this.formFieldObject = new cbx.lib.formElement.cbxDateField(this.formData[i]);
				}
				else if(this.itemType.trim().toUpperCase() === 'TEXTAREA') {
					this.formFieldObject = new cbx.lib.formElement.cbxTextArea(this.formData[i]);
				}
				else if(this.itemType.trim().toUpperCase() === 'FIELD-SET') {
					this.formFieldObject = new cbx.lib.formElement.cbxFieldSet(this.formData[i]);
				}
				else if(this.itemType.trim().toUpperCase() === 'COMPOSIT-FIELD') {
					this.formFieldObject = new cbx.lib.formElement.cbxCompositField(this.formData[i]);
				}
				else if(this.itemType.trim().toUpperCase() === 'RADIO_GROUP') {
					this.formFieldObject = new cbx.lib.formElement.cbxRadioGroup(this.formData[i]);
				}
				else if(this.itemType.trim().toUpperCase() === 'CHECK_BOX') {
					this.formFieldObject = new cbx.lib.formElement.cbxCheckBoxGroup(this.formData[i]);
				}
				else if(this.itemType.trim().toUpperCase() === 'LINE') {
					this.formFieldObject = new cbx.lib.formElement.cbxLine(this.formData[i]);
				}
				else if(this.itemType.trim().toUpperCase() === 'EMPTYCELL') {
					this.formFieldObject = new cbx.lib.formElement.cbxEmptyCell(this.formData[i]);
				}
				else if(this.itemType.trim().toUpperCase() === 'SPINNER-FIELD') {
					this.formFieldObject = new cbx.lib.formElement.cbxSpinnerField(this.formData[i]);
				}
				this.formComponentsObj.addLayer(this.formFieldObject.getComponentDOM());						
				//delete this.formFieldObject;
				}
			}else{
				LOGGER.info(" FormComponents length is : ", this.formData.length);
				LOGGER.info(" FormComponents are not available");
			}
		}catch(e){
			LOGGER.info(" Invalid Josn FormComponents " );
		}
	},
	getFormComponentsDOM: function(){
		return this.formComponentsObj.getLayer();
	}
	
});