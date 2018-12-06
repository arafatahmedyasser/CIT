cbx.ns('ct.lib.formElement');
ct.lib.formElement.HtmlEditor = Class(canvas.lib.FormElements, {
	/**
	 * @method massageFieldSpecificMD
	 * @memberof "canvas.lib.HtmlEditor"
	 * @description This method is responsible for massaging the data to be sent to the template
	 */
	massageFieldSpecificMD : function ()
	{
		(this.editableInd === 'Y' || this.readOnlyInd === 'N') ? this.disableComp = false : this.disableComp = true;
	},
	/**
	 * @method generateFieldSpecificEvents
	 * @memberof "canvas.lib.HtmlEditor"
	 * @description This method is responsible for creating the element specific functions.
	 */
	generateFieldSpecificEvents : function ()
	{
		var that = this;
		this.htmlEditor = $('.html-editor');
		this.htmlEditor.wysiwyg();
		this.htmlEditor.onblur = function ()
		{
			var data = this.htmlEditor.html();
			that.updateValue(data);
		};
	},
	/**
	 * @method setFieldValue
	 * @memberof "canvas.lib.HtmlEditor"
	 * @description This method is responsible to set the field value.
	 */
	setFieldValue : function (value)
	{
		this.htmlEditor.text(value);
	},
	/**
	 * @method getFieldValue
	 * @memberof "canvas.lib.HtmlEditor"
	 * @description This method is responsible to get the field value.
	 */
	getFieldValue : function ()
	{
		return this.htmlEditor.html()
	},
	/**
	 * @method updateValue
	 * @memberof "canvas.lib.HtmlEditor"
	 * @description This method is responsible for updating the modal value with the field value.
	 */
	updateValue : function (newValue)
	{
		this.model.updateValue(this.itemId, newValue);// Updated from the setValue to updateValue
	},
	/**
	 * @Method setEnabledField
	 * @memberOf "canvas.lib.HtmlEditor"
	 * @description Intended to enable/ disable any component rendered under this Form Manager instance
	 * @access public
	 * @param enableFlag - {Boolean} showFlag True to show, false to hide
	 */
	setEnabledField : function (enableFlag)
	{
		if (jQuery.type(enableFlag) === "boolean")
		{
			this.htmlEditor.attr('contenteditable',enableFlag);			
		}
	}
});

CFCR.registerFormCmp({
	'COMP_TYPE' : 'FORM_FIELDS',
	'COMP_NAME' : 'cbx-htmleditor'
}, ct.lib.formElement.HtmlEditor);
