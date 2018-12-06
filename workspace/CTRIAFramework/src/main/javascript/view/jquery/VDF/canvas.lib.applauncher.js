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

cbx.ns('canvas');
/**
 * 
 */
canvas.appLauncher = function ()
{
	cbx.core.extend(this, {

		/**
		 * 
		 */
		launchApp : function (config, params)
		{
			if (config.appLaunchMode == null)
			{
				LOGGER.error("No launch mode was provide, exiting the launch");
				return;
			}
			params = params || {};
			if (config.appLaunchMode === 'layoutSwitch')
			{
				cbx.core.ws.metadata.getLayoutManager().switchLayout(config.layoutId, params);
			}
			if (config.appLaunchMode === 'popup')
			{
				if (!cbx.isEmpty(config.widgetId))
				{
					var elemConfig = {
								'eleType' : 'div',
								'class' : 'white-popup'

					};
					var elemTopLayer = new cbx.lib.layer(elemConfig).getLayer();
					var elem = new cbx.lib.layer({
						"eleType" : "div",
						'class' : config.widgetId + "_POP-UP white-popup"
					}).getLayer();
					elemTopLayer.appendChild(elem);
					config.elem = $(elem);
					config.WIDGET_ID = config.widgetId;
					var popupContent = new canvas.lib.app(config);
					setTimeout(function ()
								{
						$.magnificPopup.open({
							items : {
								src : $(elemTopLayer).html(),
								type : 'inline'
							},
							closeBtnInside : true,
							closeOnBgClick : false,
							enableEscapeKey : false
						});
								}, 300);
				}
			}
			if (config.appLaunchMode === 'workspaceSwitch')
			{
				params = params || {};
				if (cbx.HashManager)
				{
					cbx.apply(params, {
						WORKSPACE_ID : config.workspaceId
					});
					cbx.HashManager.setHash(params);
				} else
				{
					cbx.core.ws.metadata.getWorkspaceManager().switchWorkspace(config.workspaceId, params);
				}
			}
		},
		show : function (config)
		{

			

			
				var elemConfig = {
							'eleType' : 'div',
							'class' : 'white-popup',
							style:{
					width:'100px'
				}

				};
				var elemTopLayer = new cbx.lib.layer(elemConfig).getLayer();
				var elem = new cbx.lib.layer({
					"eleType" : "div",
					'class' : "_POP-UP white-popup "+config.mainClass+'_Parent'
				}).getLayer();
				elemTopLayer.appendChild(elem);
				
				
				if (!cbx.isEmpty(config.message)){
					$(elem).append(config.message)
				}else{
				$(elem).append('<div><div/>');
				}
			
					$.magnificPopup.open({
						items : {
							src : $(elemTopLayer).html(),
							type : 'inline'
						},
						closeBtnInside : true,
						mainClass:(config.mainClass?config.mainClass:''),
						closeOnBgClick : false,
						enableEscapeKey : false
					});
					
			


		},
		close:function(){
		$.magnificPopup.instance.close();
		}
	});
};


