/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
cbx.ns('canvas.lib');
canvas.lib.IndependentLookup = Class(canvas.lib.FormElements,{
	
	//Error Icon Hidden in your i tag not in span
	
	generateFieldSpecificEvents:function(){
		var that = this;
		this.getComponent().find('button').click(function(){
		
		});
		// Need to Be done
	},
	/**
	 * @Method setEnabledField
	 * @memberOf "canvas.lib.IconComboBox"
	 * @description Intended to enable/ disable any component rendered under this Form Manager instance
	 * @access public
	 * @param {Boolean} showFlag True to show, false to hide
	 * 
	 */
	setEnabledField: function(enableFlag){
		if(jQuery.type(enableFlag)==="boolean"){
			if(enableFlag){
				this.getComponent().find("button[name='" + this.itemId + "']").removeAttr('disabled');
			}else{
				this.getComponent().find("button[name='" + this.itemId + "']").attr('disabled','disabled');
			}
		}
	}

});

//CFCR.registerFormCmp({'COMP_TYPE' : 'FORM_FIELDS','COMP_NAME':'cbx-lookup' }, canvas.lib.IndependentLookup);