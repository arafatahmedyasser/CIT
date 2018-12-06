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
 * 
 *
 * @version   1.0
 */


// iportal.formview.showLookupWinForFilter, which would be associated to lookup button on string filter 
// It will typically creates account lookup widget object and displays the same into window.
// Account Lookup window will have a cancel button left aligned, on click of that account lookup window will close.

// Widgetization of Lookup


Ext.namespace('iportal.formview');


iportal.formview.showLookupWinForFilter = function(ob, returnInstance) {

	var acclkppanel = new iportal.Lookup(ob);
	acclkppanel.mv.isParentPortlet = true;
	acclkppanel.setParentHeight(Ext.isEmpty(ob.winHeight) ? 250 : ob.winHeight);

	ob.enableFlag=true;
	ob.rangeMenu.lookupFilterWindow = new iportal.Window({
		bundleKey : CRB.getFWBundleKey(),
		hideOnClose : false,
		cls:'cbx-lookupwindow',
		hidden : false,
		 listeners : {
 	        afterrender: function(win) {
 	            win.mon(win.el, {
 	                mouseout: function() {
 	                ob.rangeMenu.enableMenu=false;
 	            },
 	            mouseover: function() {
 	            	ob.rangeMenu.enableMenu=true;
 	            }
 	        });
 	        }
		 	},
		tools : [ {
			id : 'pin',
			qtip : 'More..',	
			handler : function(event, toolEl, panel, tc) {
				var widgetMv = panel.getComponent(0);
				if (widgetMv.getToolsMenuItems) {
					var menu = widgetMv.getToolsMenuItems();
					if (menu) {
						menu.show(this.id);
					}
				}

			}
		}, {
			id : 'close',
			handler : function(event, toolEl, panel, tc) {
				ob.enableFlag=false;
				ob.scope.setEnableMenu(false);
				ob.rangeMenu.enableMenu=false;
				try{					
					ob.rangeMenu.lookupFilterWindow.close();
				}catch(err){}
				ob.rangeMenu.hide(true);
			}
		} ],
		width : Ext.isEmpty(ob.winWidth) ? 642 : ob.winWidth,
		height : Ext.isEmpty(ob.winHeight) ? 280 : ob.winHeight+30,
		modal : true,
		items : [ acclkppanel.mv ],
		buttonAlign : 'left'		
	});
	if (!returnInstance) {
		ob.rangeMenu.lookupFilterWindow.show();
	} else {
		return acclkppanel.mv;
	}
};