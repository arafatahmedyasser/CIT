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
cbx.whenReady(function ()
			{
	
				var metaDataSyncDone = false; // Default value which hold false
				/*
				 * Registering the metaDataSyncReady function inside when ready which will be executed once the metadata sync
				 * process completed
				 */
				cbx.metaDataSyncReady(function ()
				{
					if (!metaDataSyncDone) // To avoid multiple fall backs,erecting to avoid multiple execution
					{
						metaDataSyncDone = true;
	var currentTargetedFramework=iportal.systempreferences.getFramework();
	var OnCTReady=["CT_READY",
				   "IMPL_"+currentTargetedFramework+"_READY",
//	               "CT_APPL_"+iportal.preferences.getLayout()+"_"+currentTargetedFramework,
	               "IMPL_APPL_"+iportal.preferences.getLayout()+"_"+currentTargetedFramework];
//	               "CT_WS_LYT_"+currentTargetedFramework];
	
						CBXDOWNLOADMGR.requestScripts(OnCTReady, function ()
						{
							var cClass = CLCR.getCmp({
								'VIEW_TYPE' : 'VIEWPORT'
							});
							if (cClass)
							{
								var viewport = new cClass({
									elem : qwery("#CONTENT_DIV")[0],
									preferredWorkspaces : canvas.getUrlParameterByKey("preferredWorkspaces"),
									preferredInitialWorkspace : canvas.getUrlParameterByKey("preferredInitialWorkspace")
								});
							} else
							{
			new canvas.core.applicationLauncher();
		}
		return;
	});
					}
				});
				/*
				 * Raising the metadatasync event once the DOMContent loaded to continue the sync meta data process
				 */
				cbx.Event.raiseEvent("metadatasync");
	
});
