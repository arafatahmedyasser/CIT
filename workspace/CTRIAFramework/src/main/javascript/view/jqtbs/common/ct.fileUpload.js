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

ct.upload=function(config){
        var config=config;
        this.upload_Success = true;
        config.form.attr("action", config.url);
        config.form.attr("method", "post");
        config.form.attr("target",'ct_iframe');
        config.form.attr("encoding", "multipart/form-data");
        config.form.attr("enctype", "multipart/form-data");
    
         var iframe = document.createElement('iframe');
         iframe.id = "ct_iframe";
         iframe.name = "ct_iframe";
         iframe.style.display='none'
         document.body.appendChild(iframe);
         
     			    cbx.ajax({
     			        url: config.url,
     			        type: 'POST',
     			        data: config.data,
     			        cache: false,
     			        dataType: 'json',
     			        processData: false,
     			        contentType: false,
     			        enctype: 'multipart/form-data',
     			        success: function(data, textStatus, jqXHR)
     			        {
     			            if(typeof data.response.error === 'undefined')
     			            {
     			                // Success so call function to process the form
     			                 console.log('SUCCESS: ' + data.response.success);
     			                 config.getResponse(data);
     			                this.upload_Success = true;
	     			             $(iframe).remove();
	     			             config.form.removeAttr("action");
	     			             config.form.removeAttr("method");
	     			             config.form.removeAttr("target");
	     			             config.form.removeAttr("encoding");
	     			             config.form.removeAttr("enctype");
     			            }
     			            else
     			            {
     			                // Handle errors here
     			            	config.getResponse(data);
     			            	this.upload_Success = false;
     			                console.log('ERRORS: ' + data.response.error);
     			            }
     			        },
     			       xhr: function() {  // Custom XMLHttpRequest
     			            var myXhr = $.ajaxSettings.xhr();
     			           var progressHandlingFunction = function (e){
     	     				    if(e.lengthComputable){
     	     				    	var percentComplete = (e.loaded/e.total)*100;
     	     				        $(config.progressBar).find('[data-item-id=ctUpload-progress-bar]').css("width",percentComplete);
     	     				        var percenttext = Math.round(percentComplete) + "%";
     	     				      $(config.progressBar).find('[data-item-id=ctUpload-progress-bar]').text(percenttext);
     	     				       
     	     				    }
     	     				}
     			            if(myXhr.upload){ // Check if upload property exists
     			                myXhr.upload.addEventListener('progress',progressHandlingFunction, false); // For handling the progress of the upload
     			            }
     			            return myXhr;
     			        },
     			        error: function(jqXHR, textStatus, errorThrown)
     			        {
     			            // Handle errors here
     			            console.log('ERRORS: ' + textStatus);
     			        },
     			        complete: function()
     			        {
     			        	if(this.upload_Success){
     			        		var DELAY = 200,  timer = null;
                          	   	timer = setTimeout(function() {
         			        	 $(config.progressBar).find('[data-item-id=ctUpload-progress-bar]').css("width","100%");
         			        	 $(config.progressBar).find('[data-item-id=ctUpload-progress-bar]').text("100%");
                          	   	},DELAY);
     			        	}
     			        	
     			            // STOP LOADING SPINNER
     			        }
     			    });
     			   
     			   //xhr.send(data);
     		
},
ct.pictureUpload=function(config){
    var config=config;
    config.form.attr("action", config.url);
    config.form.attr("method", "post");
    config.form.attr("target",'ct_iframe');
    config.form.attr("encoding", "multipart/form-data");
    config.form.attr("enctype", "multipart/form-data");

     var iframe = document.createElement('iframe');
     iframe.id = "ct_iframe";
     iframe.name = "ct_iframe";
     iframe.style.display='none'
     document.body.appendChild(iframe);
     config.form.submit();
     
     var callback = function () {
             var data=iframe.contentWindow.document.all[2].innerHTML;
             var res=cbx.decode(data);
             config.getResponse(res);
             $(iframe).unbind('load', callback);
         $(iframe).remove();
         config.form.removeAttr("action");
         config.form.removeAttr("method");
         config.form.removeAttr("target");
         config.form.removeAttr("encoding");
         config.form.removeAttr("enctype");
     };
     $(iframe).bind('load', callback);
}