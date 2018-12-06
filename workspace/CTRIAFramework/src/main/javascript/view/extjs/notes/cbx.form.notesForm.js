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

Ext.ns("cbx.form");
cbx.form.notesForm = function (NOTES_DTL, config, lastUpdatedDate)
{
	if (config)
	{
		config.menu.enableKeyEvents = true;
		if (config.menu.keyNav)
		{
			config.menu.keyNav.disable();
		}
		var win;
		var cons = cbx.form.constants;
		var fm = new cbx.form.FormManager({
			formId : "NOTESFORM",
			mode : cons.EDIT_MODE,
			modelData : {
				'LAST_UPDATED_DATE' : cbx.isEmpty(lastUpdatedDate) ? '--' : lastUpdatedDate,
				'MESSAGE' : NOTES_DTL
			},
			listeners : {
				'initialized' : function (manager)
				{
					if (win != null)
					{
						win.setTitle(this.formTitle);
					}
				}
			}
		});
		win = new Ext.Panel({
			plain : true,
			width : 400,
			autoScroll : true,
			cls : 'notes-menu',
			items : fm.getFormView()
		});
		config.menu.add(win);
		config.menu.show(config.id);
	}
};