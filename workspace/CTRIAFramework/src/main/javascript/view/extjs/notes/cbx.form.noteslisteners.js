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
/**
 * This class has been configured for save the notes information on notes onchange event
 */
Ext.ns("cbx.form.listeners");

cbx.form.listeners.NOTESFORM = Class(cbx.Observable, {
	constructor : function (config)
	{
		this.fm = config.fm;
	},
	registerHandlers : function ()
	{
		this.fm.registerHandler("cbxchange", 'MESSAGE', function (fm, event, fieldName, value)
		{
			fm.clearInvalid('MESSAGE');
			var params = {
				'PAGE_CODE_TYPE' : 'CANVAS_NOTES',
				'INPUT_PRODUCT' : 'CANVAS',
				'INPUT_ACTION' : 'SAVE_NOTE',
				'INPUT_FUNCTION_CODE' : 'NOTES',
				'INPUT_SUB_PRODUCT' : 'CANVAS',
				'PRODUCT_NAME' : 'CANVAS',
				'MESSAGE' : value,
				'__LISTVIEW_REQUEST' : 'Y'
			};
			cbx.ajax({
				params : params,
				scope : this,
				success : function (responseData)
				{
					if (!cbx.isEmpty(responseData.JSON_MAP.NOTES_DATE))
					{
						iportal.preferences.setLastUpdateNotesDtlTime(responseData.JSON_MAP.NOTES_DATE);
						fm.model.setValue("LAST_UPDATED_DATE", responseData.JSON_MAP.NOTES_DATE);
					}
				},
				failure : function (response)
				{
					var rb=CRB.getFWBundle();
					var errWin = new iportal.Dialog({
						dialogType : 'ERROR',
						cls : 'portal_pos_btn',
						message : rb['NOTES_ERROR'],
						okHandler : function ()
						{
							errWin.close();
						},
						title : rb['LBL_ERROR']
					});
					errWin.show();
					
				}
			});
			iportal.preferences.setParams(params);
			iportal.preferences.setNotesDtl(value);
		});
		// Notes Form showed in view mode , enabling text area in edit mode for updating notes msg.
		this.fm.registerHandler("cbxpreinitialize", function (fm)
		{
			return {
				"MESSAGE" : {
					mode : "edit"
				}
			};
		});
	}
});

CFLR.registerListener("NOTESFORM", cbx.form.listeners.NOTESFORM);
