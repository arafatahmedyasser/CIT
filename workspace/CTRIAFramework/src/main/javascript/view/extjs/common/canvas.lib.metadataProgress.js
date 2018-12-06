/**
 * Copyright 2015. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
canvas.lib.metadataProgress = Class(cbx.core.Component, {
		initialize : function ()
		{
			
				var rb = CRB.getFWBundle();
				var loadingText=rb&& rb.LOADING_METADATA?rb.LOADING_METADATA:"Updating App Definitions... Please Wait..";
				var myLoadBar = new Ext.ProgressBar({
					  waitConfig: {interval:100},
						 autoHeight:true
					  

					});

					 var progressUpdateFn = function(v){
							innerFn=function(){
									if(v == 14){
									 for(var j = 1; j <15; j++){
							   setTimeout(progressUpdateFn(j), j*200);
						   }
									}else{
										var i = v/13;
										myLoadBar.updateProgress(i,loadingText);
									}
							   };
							   return innerFn;
						   };
						   for(var i = 1; i <15; i++){
							   setTimeout(progressUpdateFn(i), i*200);
						   }
					this.loadProgressBar = new Ext.Window({
						closable: false, 
						collapsible: false,
						header:false,
						cls:'progressWindow',
						floating: {shadow: false},
						draggable: false,
						resizable: false,
						layout:'fit',
						width:400,
						autoHeight:true,
						plain: true,
						modal: true,
						items: [myLoadBar]
					});
						  
		},
		/**
		 * showProgressBar : 
	     * hideProgressBar : 
		 */
	    showProgressBar : function(){
	    	
	    	this.loadProgressBar.show();
	    },
	    hideProgressBar : function(){
	    		if (this.loadProgressBar)
					this.loadProgressBar.hide();	
	            }
	});
	

CLCR.registerCmp({
	"COMP_TYPE":"METADATA_DIALOG"
}, canvas.lib.metadataProgress);