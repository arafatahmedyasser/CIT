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
 * This class is a singleton class which is responsible for painting the breadcrumbs on workspaces and 
 * for registering listener for "hashupdated" event 
 * hashupdated ---> Event which was raised by cbx.HashManager class when url hash value changed
 * 					Whoever wants to do some action when url hash changed, can register handler for this event to get notified.
 * This class paints the static breadcrumbs only if it was already registered by app developer using workspace id and list of breadcrumbs
 * 
 */

cbx.BreadCrumbManager = function() {
	crumbsRegister = {};
	/**
	 * Register listener for 'hashupdated' event to get notified when url hash value changes 
	 */
	cbx.CommManager.registerListener('hashupdated',	'',this,function(hash) {
		if (hash != null && hash['RELOAD_FLAG'] !== 'N') {
			/**
			 * Check if url hash value has 'RELOAD_FLAG' as 'Y' OR the param is not there
			 * This means if reload is true or not there only proceed
			 * 
			 * Get the <UL> element to which we are going to add <LI> or breadcrumbs
			 */
			var $crumbs = $('.CRUMBS');
			$crumbs.empty();//Clear all childnodes of it
			if (hash.WORKSPACE_ID != null) {
				var wsId = hash.WORKSPACE_ID;
				if (crumbsRegister[wsId] != null) {
					//$crumbs.empty();//Clear all childnodes of it && 
					var crumbList = crumbsRegister[wsId];//Get list of crumbs associated with workspace
					var rb = CRB.getFWBundle();
					var crumbDom = '', crumbTitle, crumb, href;
					for (var i = 0, len = crumbList.length; i < len; i++)
					{
						crumb = crumbList[i];
						var crumbLbl = crumb['LABEL'];
						if (crumbLbl != null && crumbLbl != '' && crumbLbl != 'undefined')
						{
							// If label is not registered by app developer, do not create breadcrumb
							if (crumb['WORKSPACE_ID'] != null)
							{
								href = '#WORKSPACE_ID=' + crumb['WORKSPACE_ID'];
							} else
							{
								href = 'javascript:void(0)';
							}
							crumbDom += '<li><a href="' + href + '" class="history-items">' + crumbTitle + '</a></li>';
						}
					}
					$crumbs.append(crumbDom);
				}
			}
		}
	});
	return {
		/**
		 * Register breadcrumbs list for workspace
		 * @list list<breadcrumbs> breadcrumbs
		 */
		registerCrumbs : function(wsId, crumbList) {
			if (crumbList != null && cbx.core.isArray(crumbList)
					&& crumbList.length > 0) {
				crumbsRegister[wsId] = crumbList;
			}
		},
		updateCrumbs : function(list) {
		}
	};
}();


