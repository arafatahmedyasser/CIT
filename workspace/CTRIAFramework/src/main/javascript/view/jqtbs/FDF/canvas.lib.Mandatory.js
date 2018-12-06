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
 * @description This component is responsible to diaplay a Mandatory note.
 */
canvas.lib.Mandatory = Class(canvas.lib.FormElements, {
	/**
	 * @class "canvas.lib.Mandatory"
	 * @description The events on and by the component are described below
	 */
	// Error Icon Hidden in your i tag not in span
	/**
	 * @method massageFieldSpecificMD
	 * @memberof "canvas.lib.Mandatory"
	 * @description This method is responsible for massaging the data to be sent to the template
	 */

	massageFieldSpecificMD : function (config)
	{
		this.MandatoryLabel = this.getMandatoryLabel();
		this.MandatoryText = this.getMandatoryText();
		this.MandatorySpan = this.getMandatorySpan();
	},
	/**
	 * @method getMandatoryLabel
	 * @memberof "canvas.lib.Mandatory"
	 * @description This method is responsible for getting label from the bundle
	 */
	getMandatoryLabel : function ()
	{
		return CRB.getFWBundleValue('LBL_MANDATORY_NOTE_PREFIX');
	},
	/**
	 * @method getMandatoryText
	 * @memberof "canvas.lib.Mandatory"
	 * @description This method is responsible for getting text from the bundle
	 */
	getMandatoryText : function ()
	{
		return CRB.getFWBundleValue('LBL_MANDATORY_NOTE_SUFFIX')
	},
	/**
	 * @method generateFieldSpecificEvents
	 * @memberof "canvas.lib.Mandatory"
	 * @description This method is responsible for creating the element specific functions.
	 */
	generateFieldSpecificEvents : function ()
	{

		// Need to Be done
	}

});

CFCR.registerFormCmp({
	'COMP_TYPE' : 'FORM_FIELDS',
	'COMP_NAME' : 'cbx-mandatoryText'
}, canvas.lib.Mandatory);
