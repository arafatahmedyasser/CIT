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
 * @version   1.0
 */



// iportal.formview.showLookupWin, which would be associated to lookup button click of xtype 'iportal-lookup'.
// It will typically creates account lookup widget object and displays the same into window.
// Account Lookup window will have a cancel button left aligned, on click of that account lookup window will close.

// Widgetization of Lookup


Ext.namespace('iportal.formview');
iportal.formview.showLookupWin = function(ob, returnInstance,response) { 

	var acclkppanel = new iportal.Lookup(ob);
	acclkppanel.mv.isParentPortlet = true;
	
	ob.scope.isWindowVisible = true;

	acclkppanel.setParentHeight(Ext.isEmpty(ob.winHeight) ? 250 : ob.winHeight);
	
	/**
	
		if(!Ext.isEmpty(response)) {
		//for passing response value to multiview obj
		acclkppanel.mv.widgetResponseData=response;
		//for make store auto load =false
		acclkppanel.mv.skipDataResult=true;			
		}
	
	*/
	
	
	var win = new iportal.Window({
		bundleKey : CRB.getFWBundleKey(),
		hideOnClose : false,
		tools :  acclkppanel.mv.getLookUpTools(),     
		width : Ext.isEmpty(ob.winWidth) ? 642 : ob.winWidth,
		height : Ext.isEmpty(ob.winHeight) ? 280 : ob.winHeight+30,
		modal : true,
		items : [ acclkppanel.mv ],
		
		
		resizable:true,
		listeners : {
			'resize' : function (cmpt, width, height, obj){
				/**
				 * Resetting the panel's body el height 
				 * */
				var bodyHeight = height - this.getFrameHeight();
				if (this.body.getHeight() != bodyHeight) {
					this.body.setHeight(bodyHeight);
				}
				

				height = height - this.getFrameHeight();
				var wgt = this.getComponent(0);
				wgt.height = height;
				wgt.setHeight(height);
				if (wgt.updateHeight) {
							wgt.updateHeight(height);	
				} else {
					if (wgt.mwc && wgt.mwc.updateHeight)
						wgt.mwc.updateHeight(height);
				}
				wgt.doLayout();

			}
		},
		
		  
		    showToolIcon : function (showFlag){
				
				var showToolsAsLinearFlag = iportal.systempreferences.getToolsAsLinearFlag();
				if (showToolsAsLinearFlag) {
					if (this.tools.help != null) {
						this.tools.help.setVisible(showFlag.HELP_IND);
					} else {
						this.tools[2].hidden = !showFlag.HELP_IND;
					}
					if (this.tools.excel != null) {
						this.tools.excel.setVisible(showFlag.EXCEL_IND);
					} else {
						this.tools[3].hidden = !showFlag.EXCEL_IND;
					}
					if (this.tools.pdf != null) {
						this.tools.pdf.setVisible(showFlag.PDF_IND);
					} else {
						this.tools[4].hidden = !showFlag.PDF_IND;
					}
					if (this.tools.csv != null) {
						this.tools.csv.setVisible(showFlag.CSV_IND);
					} else {
						this.tools[5].hidden = !showFlag.CSV_IND;
					}
					if (this.tools.clearFilter != null) {
						this.tools.clearFilter.setVisible(showFlag.FILTER_IND);
					} else {
						this.tools[6].hidden = !showFlag.FILTER_IND;
					}
					if (this.tools.refresh != null) {
						this.tools.refresh.setVisible(showFlag.REFRESH_IND);
					} else {
						this.tools[7].hidden = !showFlag.REFRESH_IND;
					}
					if (this.tools.print != null) {
						this.tools.print.setVisible(showFlag.PRINT_IND);
					} else {
						this.tools[8].hidden = !showFlag.PRINT_IND;
					}
				}
				else{
					if (this.tools.pin != null) {
						this.tools.pin.setVisible(showFlag.TOOLS_IND);
					} else {
						this.tools[0].hidden = !showFlag.TOOLS_IND;
					}
				}
					
			},
		    
		  
		buttonAlign : 'left'
		/*showToolIcon : function(showFlag) {
			var that = this;
			if (this.tools != null) {
				if (this.tools.length) {
					for ( var i = 0; i < this.tools.length; i++) {
						
						if (this.tools[i].id === "toggle") {
							alert('hi');
							this.tools[i].hidden = !showFlag.COLLAPSE_IND;
						} else if (this.tools[i].id === "pin") {
						
							this.tools[i].hidden = !showFlag.TOOLS_IND;
						}
					}
				} else {
					if (this.tools.pin != null) {
						this.tools.pin.setVisible(showFlag.TOOLS_IND);
					}
					if (this.tools.toggle != null) {
						this.tools.toggle.setVisible(showFlag.COLLAPSE_IND);
					}
				}
			}
		}*/
	});
	 
	win.tools.push({

		id : 'close',
		
		qtip : CRB.getFWBundle().TOOL_TIPS_CLOSE,  

		handler : function(event, toolEl, panel, tc) {

			try{

				

				ob.scope.isWindowVisible = false;

				

				win.close();

				

				ob.scope.lookupCloseHandler(ob.scope);

			}catch(err){}

			

		}

	}
	);
	
	if (!returnInstance) {
		win.show();
	} else {
		return acclkppanel.mv;
	}
};