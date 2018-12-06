/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
/**
 * This class is intended to render contents to the footer region of the application in the cardlayout.
 */
cbx.ns('canvas.applnlayout.menu');
canvas.applnlayout.menu.footer= Ext.extend(Ext.Panel,{
	collapsible : false,
	hidden : false,
	initComponent : function(){
	var defaultConfig = {
	xtype:'panel',
	layout : 'column',
	height : 75,
	layoutConfig : {
		columns : 1
	},
	items : [{
		xtype : 'panel',
		html : '<div>Copyright &copy; CT 2015</div>',
	}]
		};
		Ext.apply(this, defaultConfig);	
		canvas.applnlayout.menu.footer.superclass.initComponent.call(this);
	}
});
CLCR.registerCmp({"COMPONENT" : "menufooter","APPLICATION_FW" : "EXT-JS"}, canvas.applnlayout.menu.footer);
