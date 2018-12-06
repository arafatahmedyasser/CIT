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
 * 
 * 
 * @description Singleton class which handles the loading indicator/mask whenever the asynchronous call is happening.  
 * 
 */



cbx.ns('canvas.core');
canvas.core.loadMaskManager = Class(cbx.Observable, {
	loadMaskRequestQueue : [],
	getLoadMaskManager : function() {
		return this;
	},
	constructor: function(){
        this.loadMaskRequestQueue = [];
	},
	/**
	 * loadMaskRequestQueue : Its an array it holds the every ajax requests which is currently processing.
	 * initiateLoadMask : It initiates the load mask and keeps the every request in the processing queue.
     * hideLoadMask : It resets the queue once the request is completed or callback or error and removes the load mask whenever the request is completed.
	 */
    initiateLoadMask : function(request,text,config){
               if(!config){
                    /* generate a random number for request ID */
                    var reqID = cbx.id();
                    /* store request id into array */
                    this.loadMaskRequestQueue.push({requestID: reqID, loadingText: (text && text.length > 0) ? text : ""});
                    /* pass the generated request ID to config */
                    request.requestID = reqID;
              }
                    var cClass = CLCR.getCmp({
                                        "COMP_TYPE":"GLOBAL_AJAX_LISTENERS",
                                        "SEQUENCE":"INIT"
                                             });
                                if(cClass){
                                    var scope = {'config' : request, 'text' : text,'elementConfig':config};
                                    new cClass(scope);
                                }
    },
    hideLoadMask : function(response,config){
    				//Once the response is processed for a particular request it will be removed from the processing array
                    this.loadMaskRequestQueue =
                                 this.loadMaskRequestQueue.filter(function (el) {
                                            return el.requestID !== response.requestID;
                                });
                    if(config){
                    	 var cClass = CLCR.getCmp({
                             "COMP_TYPE":"GLOBAL_AJAX_LISTENERS",
                             "SEQUENCE":"COMPLETE"
                    	 });
                    	 if(cClass){
                    		 new cClass(response,config);
                    	 }
                    	return;
                    }
                    if(this.loadMaskRequestQueue.length == 0){ // all the ajax requests has been processed and remove the loading mask
                        var cClass = CLCR.getCmp({
                                    "COMP_TYPE":"GLOBAL_AJAX_LISTENERS",
                                    "SEQUENCE":"COMPLETE"
                        });
                    if(cClass){
                    		response.loadMaskRequestQueue=0;
                            new cClass(response,'',true);
                            }
                    }
                    else{ 
                    	// Once the current request is completed it updates the loading mask text as top most request request in the processing queue
                            var cClass = CLCR.getCmp({
                                    "COMP_TYPE":"GLOBAL_AJAX_LISTENERS",
                                    "SEQUENCE":"INIT"
                            });
                            if(cClass){
                                var scope = {'config' : response, 'text' : this.loadMaskRequestQueue[this.loadMaskRequestQueue.length-1].text};
                                new cClass(scope);
                            }
                        }
            }
});
CTLOADMASKMANAGER = new canvas.core.loadMaskManager();
//cbx.whenReady(function(){
//              CTLOADMASKMANAGER = new canvas.core.loadMaskManager();
//});
