cbx.ns('ct.lib.formElement');
ct.lib.formElement.StaticItemSelector = Class(canvas.lib.FormElements,{
	
	//Error Icon Hidden in your i tag not in span
	/**
	 * @method generateFieldSpecificEvents
	 * @memberof "canvas.lib.StaticItemSelector"
	 * @description This method is responsible for creating the element specific functions.
	 */
	generateFieldSpecificEvents:function(){
		
	},
	/**
	 * @method setFieldValue
	 * @memberof "canvas.lib.setFieldValue"
	 * @description This method is responsible to set the field value.
	 */
	setFieldValue:function(value){
		
		this.getComponent().find("input[name='"+this.itemId+"']").val(value);
	},
	/**
	 * @method getFieldValue
	 * @memberof "canvas.lib.getFieldValue"
	 * @description This method is responsible to get the field value.
	 */
	getFieldValue:function(){
		return this.getComponent().find("input[name='"+this.itemId+"']").val();
	} 

});

CFCR.registerFormCmp({'COMP_TYPE' : 'FORM_FIELDS','COMP_NAME':'cbx-staticitemselector'},ct.lib.formElement.StaticItemSelector);