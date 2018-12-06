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
cbx.namespace('canvas.applnlayout.tab');
canvas.applnlayout.tab.component =  Class(cbx.Observable,{
	canvasDockEnabled : true,
	appDockEnabled : false,
	landingPage : {
		enabled : false
	},
	workSpaceLayout : {
		config : {
			activeTab : 0,
			autoHeight : false,
			autoWidth : true,
			baseCls : '',
			border : true,
			cls : 'applnTab x-tab-panel',
			enableTabScroll : true,
			frame : true,
			layoutOnTabChange : true,
			onDestroy : function (){this.destroy();},
			plain : true
		}
	},
	headerConfig : {
		enabled : true,
		heightInPx : 80,
		cssClass : '',
		component : 'tabheader',
		position : 'absolute'
	},
	footerConfig : {
		enabled : false,
		heightInPx : 0,
		position : 'absolute',
		component : 'tabfooter'
	}
});

CLCR.registerCmp({"CONFIG":"APPLICATION_LAYOUT","LAYOUT":"TAB"},canvas.applnlayout.tab.component);