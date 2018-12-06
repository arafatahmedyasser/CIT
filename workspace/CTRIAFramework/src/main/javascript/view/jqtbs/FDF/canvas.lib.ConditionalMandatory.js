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
 * @description This component is responsible to display conditional manadatory note.
 */
canvas.lib.ConditionalMandatory = Class(canvas.lib.FormElements, {
	/**
	 * @class "canvas.lib.ComboBox"
	 * @description The events on and by the component are described below
	 */
	// Error Icon Hidden in your i tag not in span
	/**
	 * @method massageFieldSpecificMD
	 * @memberof "canvas.lib.ConditionalMandatory"
	 * @description This method is responsible for massaging the data to be sent to the template
	 */
	massageFieldSpecificMD : function (config)
	{

		this.CondMandatoryLabel = this.getCondMandatoryLabel();
		this.CondMandatoryText = this.getCondMandatoryText();
		this.ConditionalMandatorySpan = this.getConditionalMandatorySpan();
	},
	/**
	 * @method getCondMandatoryLabel
	 * @memberof "canvas.lib.ConditionalMandatory"
	 * @description This method is responsible for getting label for conditional mandatory from the bundle.
	 */
	getCondMandatoryLabel : function ()
	{
		return CRB.getFWBundleValue('LBL_MANDATORY_NOTE_PREFIX');
	},
	/**
	 * @method getCondMandatoryText
	 * @memberof "canvas.lib.ConditionalMandatory"
	 * @description This method is responsible for getting text for conditional mandatory from the bundle.
	 */
	getCondMandatoryText : function ()
	{
		return CRB.getFWBundleValue('LBL_COND_MANDATORY_NOTE_SUFFIX')
	},
	/**
	 * @method generateFieldSpecificEvents
	 * @memberof "canvas.lib.ConditionalMandatory"
	 * @description 
	 */
	generateFieldSpecificEvents : function ()
	{

		// Need to Be done
	}

});

CFCR.registerFormCmp({
	'COMP_TYPE' : 'FORM_FIELDS',
	'COMP_NAME' : 'cbx-conditionalMandatoryText'
}, canvas.lib.ConditionalMandatory);
