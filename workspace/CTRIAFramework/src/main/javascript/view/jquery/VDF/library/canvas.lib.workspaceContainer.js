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
 
cbx.ns("canvas.lib");
/**
 * This class contains the workspace individual containers. Called by the
 * wsmanager to be added to the app container.
 */
canvas.lib.workspaceContainer = Class(cbx.core.Component, {
	/**
	 * Initializes the workspace container.
	 */
	initialize : function() {
		var me = this;
		var elem = this.elem;
		elem.append('<span ITEM_ID="WS_CONTAINER_' + this.WORKSPACE_ID
				+ '"></span>');
		elem = $(elem.find('span:first'));
		this.setCmp(elem);
		elem.on("remove", function() {
			me.destroy();
		});
		var config = {
			elem : elem,
			WORKSPACE_ID : me.WORKSPACE_ID,
			wsMD : me.wsMD,
			uData : me.uData
		};
		this.layoutManager = new cbx.core.LayoutManager(config);
	}
});

/**
 * 
 */
CLCR.registerCmp({'COMP_TYPE':'WORKSPACE_CONTAINER'}, canvas.lib.workspaceContainer);