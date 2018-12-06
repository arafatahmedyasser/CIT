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
function fileUpload(file, myQueue, doneCallback,pd,options,obj,fileArray,parentObject) {

	// instance variables
	var jqXHR = null,
		me = this;
	    me.options=options;
	    var uploadFeautres = {}; 
	    uploadFeautres.formdata = window.FormData !== undefined;   

	// public properties
	me.file = file;
	me.size = file.size;
	me.name = file.name;
	me.type = file.type;
	me.id=file.id;
	me.state='queued';
	me.enryptedFileName='';
	me.attachmentRefNumber='';
	
	
	  if(options.displayCancel) {
          pd.cancel.show();
          pd.cancel.click(function (event) {
        	  event.stopPropagation();
        	  var fileData={};
        	  var result=[];
        	  fileData.fileName=me.name;
				fileData.state=me.state;
					fileData.attachmentRefNumber=me.attachmentRefNumber;
					fileData.enryptedFileName=me.enryptedFileName;
              var onCancel=options.onCancel(fileData, pd,event);
              if(onCancel==false) return;
              myQueue.removeExistingFileName(obj, fileArray);
        	  parentObject.totalQueueCount--;
              pd.statusbar.remove();
              obj.selectedFiles -= fileArray.length; //reduce selected File count
              myQueue.updateFileCounter(options, obj);
              parentObject.errorLog.html("");
              doIScroll('CONTENT_DIV', 'refresh');
              myQueue.updateremovedFiles(me.id);
              me.removeFromQueue();
          	options.model.updateValue(options.filesInputName, result);
              for (var i=0; i<myQueue.store.length; i++) { 
                  result.push({'state':myQueue.store[i].state,'enryptedFileName':myQueue.store[i].enryptedFileName,'filename':myQueue.store[i].name,'attachmentRefNumber':myQueue.store[i].attachmentRefNumber,'filesize':myQueue.store[i].size});
           	   	options.model.updateValue(options.filesInputName, result);
                  }
              var afterCancel=options.afterCancel(result,event);
             	if(parentObject.responseCount==parentObject.totalQueueCount){
               		parentObject.responseCount=0;
               	 var browseId="uploader_browse"+parentObject.groupId;
        		$("#"+browseId).css({opacity: 1.0, cursor: "wait"}).prop("disabled", false);
        		 $("#"+browseId).find("input[name='"+options.filesInputName+"[]']").removeAttr('disabled');
               		parentObject.handlerCallback.apply('state',['notuploaded']);
           			}
          });
      }


	me.serializeData=function(extraData) {
        var serialized = [];
        if(jQuery.type(extraData) == "string") {
            serialized = extraData.split('&');
        } else {
            serialized = $.param(extraData).split('&');
        }
        var len = serialized.length;
        var result = [];
        var i, part;
        for(i = 0; i < len; i++) {
            serialized[i] = serialized[i].replace(/\+/g, ' ');
            part = serialized[i].split('=');
            result.push([decodeURIComponent(part[0]), decodeURIComponent(part[1])]);
        }
        return result;
    };
    me.getErrorStatus=function(uploadResponse) {
    	var errorStatus=null;
    	  if(uploadResponse){          
          	if(uploadResponse.size){
					errorStatus=CRB.getFWBundle() && CRB.getFWBundle()[uploadResponse.error]
									?CRB.getFWBundle()[uploadResponse.error]+" "+uploadResponse.size:uploadResponse.error;
				}
				else{
					errorStatus=CRB.getFWBundle() && CRB.getFWBundle()[uploadResponse.error]
									?CRB.getFWBundle()[uploadResponse.error] : uploadResponse.error ;
				}
          }
    	  return errorStatus;
    };
    
    me.updateErrorStatus=function(jqXHR,errorStatus) {
    	var result=[];
    	parentObject.responseCount++;
	   if(options.errorStatus) {
           pd.progressDiv.hide();
           pd.cancel.show();
           if(options.errorMsg){
           pd.statusbar.append("<span class='" + options.errorClass + "'>" + errorStatus + "</span>");
           }
       } else {
           pd.statusbar.hide();
           pd.statusbar.remove();
       }
       obj.selectedFiles -= fileArray.length; 
       myQueue.removeExistingFileName(obj, fileArray);
       me.removeFromQueue(me);	
       options.onError.call(parentObject, fileArray, 'error', jqXHR, pd);
       obj.fCounter += fileArray.length;
       var attachmentRefNumber=me.attachmentRefNumber='';
       var enryptedFileName=me.enryptedFileName='';
       me.state='failed';
       var recordType={};
       recordType.state='failed';
       recordType.enryptedFileName='';
       recordType.attachmentRefNumber='';
       recordType.id=me.id;
       recordType.name=me.name;
       recordType.type=me.type;
       recordType.size=me.size;
       myQueue.store.push(recordType);
       
       for (var i=0; i<myQueue.store.length; i++) {     		
       
       result.push({'state':myQueue.store[i].state,'enryptedFileName':myQueue.store[i].enryptedFileName,'filename':myQueue.store[i].name,'attachmentRefNumber':myQueue.store[i].attachmentRefNumber,'filesize':myQueue.store[i].size});
	   options.model.updateValue(options.filesInputName, result);
       }
			if(parentObject.responseCount==parentObject.totalQueueCount){
       		parentObject.responseCount=0;
       	 var browseId="uploader_browse"+parentObject.groupId;
		$("#"+browseId).css({opacity: 1.0, cursor: "wait"}).prop("disabled", false);
		 $("#"+browseId).find("input[name='"+options.filesInputName+"[]']").removeAttr('disabled');
       		parentObject.handlerCallback.apply('state',['notuploaded']);
   			}
    };
    
    me.updateSuccessStatus=function(response, uploadResponse,jqXHR) {
    	var result=null;
    	parentObject.responseCount++;
    pd.progressbar.width('100%');
    if(options.displayProgress) {
        pd.progressbar.html('100%');
        pd.progressbar.css('text-align', 'center');
    }
    if(!options.displayProgressBarAfterSuccess){
        pd.progressDiv.hide("slow");
	}

    var onSuccess=options.onSuccess.call(parentObject, fileArray, response, jqXHR, pd);
    if(options.successStatus) {
        if(options.displayDone) {
            pd.done.show();
            if(options.successMsg){
            var sucessMsg="";
            try{
            	sucessMsg=String.format(options.fileDoneText, me.name);
            }catch(err){
            	sucessMsg="";
            }
            
            sucessMsg=sucessMsg.replace(/&lt;/gi, "<").replace(/&gt;/gi, ">");
            pd.statusbar.append("<span class='" + options.successClass + "'>" + sucessMsg + "</span>");
        }
            pd.done.click(function (event) {
            	event.stopPropagation();
               
                var fileData={};
	        	  var result=[];
	        	  fileData.fileName=me.name;
					fileData.state=me.state;
						fileData.attachmentRefNumber=me.attachmentRefNumber;
						fileData.enryptedFileName=me.enryptedFileName;
	              var onCancel=options.onCancel(fileData, pd,event);
	              if(onCancel==false) return;
	              myQueue.removeExistingFileName(obj, fileArray);
	              pd.statusbar.hide("slow");
	                pd.statusbar.remove();
	              obj.selectedFiles -= fileArray.length; 
	              myQueue.updateFileCounter(options, obj);
	              parentObject.errorLog.html("");
                var count = $(".cbx-file-upload-filename").length;
	            if(count==0){
	            	 parentObject.responseCount=0;
	            	 var contentId="uploadercontent"+options.groupId;
	        		 $('#'+contentId).find('.uploadqueue').show();
	            }
	            doIScroll('CONTENT_DIV', 'refresh');
	            myQueue.updateremovedFiles(me.id);
	              me.removeFromQueue();
	         	options.model.updateValue(options.filesInputName, result);
	              for (var i=0; i<myQueue.store.length; i++) { 
	                  result.push({'state':myQueue.store[i].state,'enryptedFileName':myQueue.store[i].enryptedFileName,'filename':myQueue.store[i].name,'attachmentRefNumber':myQueue.store[i].attachmentRefNumber,'filesize':myQueue.store[i].size});
	           	   	options.model.updateValue(options.filesInputName, result);
	                  }
	              
	              var afterCancel=options.afterCancel(result,event);
	            
            });
        } else {
            pd.done.hide();
        }
       
    } else {
        pd.statusbar.hide("slow");
        pd.statusbar.remove();

    }
    obj.sCounter += fileArray.length;
    myQueue.updateFileCounter(options, obj);
    var attachmentRefNumber=me.attachmentRefNumber=uploadResponse.attachmentRefNumber;
    var enryptedFileName=me.enryptedFileName=uploadResponse.enryptedFileName;
    var recordType={};
    recordType.state='done';
    recordType.enryptedFileName=enryptedFileName;
    recordType.attachmentRefNumber=attachmentRefNumber;
    recordType.id=me.id;
    recordType.name=me.name;
    recordType.type=me.type;
    recordType.size=me.size;
    myQueue.store.push(recordType);
    me.state='done';
   // result.push({'state':'done','enryptedFileName':enryptedFileName,'filename':me.name,'attachmentRefNumber':attachmentRefNumber,'filesize':uploadResponse.FileSize});
   // options.model.updateValue(options.filesInputName, result);
    var result=[];
    for (var i=0; i<myQueue.store.length; i++) {    	
        
        result.push({'state':myQueue.store[i].state,'enryptedFileName':myQueue.store[i].enryptedFileName,'filename':myQueue.store[i].name,'attachmentRefNumber':myQueue.store[i].attachmentRefNumber,'filesize':myQueue.store[i].size});
 	   options.model.updateValue(options.filesInputName, result);
        }
	if(parentObject.responseCount==parentObject.totalQueueCount){
		parentObject.responseCount=0;
		 var browseId="uploader_browse"+parentObject.groupId;
		 $("#"+browseId).css({opacity: 1.0, cursor: "wait"}).prop("disabled", false);
		 $("#"+browseId).find("input[name='"+options.filesInputName+"[]']").removeAttr('disabled');
		parentObject.handlerCallback.apply('state',['uploaded']);
		}


    };

	me.uploadFile = function(postUrl, fieldName) {
		
		options.filesInputName=fieldName;
		var fd = new window.FormData(),
		extraData=options.inlineFormData,
		lastBytesLoaded = 0,
		lastTime = $.now();

		var beginSend=options.beginSend.call(parentObject,me);

	  if(extraData) {
          var sData = me.serializeData(extraData);
          for(var j = 0; j < sData.length; j++) {
              if(sData[j]) {
                  fd.append(sData[j][0], sData[j][1]);
              }
          }
      }
	fd.append(fieldName, me.file);

		// create AJAX request
		jqXHR = $.ajax({
			url: postUrl,
			data: fd,
			cache: false,
			contentType: false,
			processData: false,
			type: me.options.method,
			   beforeSubmit: function (formData, $form, options) {
                   pd.statusbar.append("<div class='" + options.errorClass + "'>" + options.uploadErrorLabel + "</div>");
                   pd.cancel.show();
                   pd.cancel.click(function () {
                	   myQueue.removeExistingFileName(obj, fileArray);
                       pd.statusbar.remove();
                       options.onCancel.call(obj, fileArray, pd);
                       obj.selectedFiles -= fileArray.length; 
                       myQueue.updateFileCounter(options, obj);
                       me.removeFromQueue(me);
                   });
                   return false;
               },
			  beforeSend: function (xhr, o) {
				  parentObject.errorLog.html("");
				  if(options.displayProgressBar){
                  pd.progressDiv.show();
				  }
                  pd.cancel.hide();
                  pd.done.hide();
                  if(options.displayAbort) {
                      pd.abort.show();
                      pd.abort.click(function (event) {
                    	  event.stopPropagation();
                    	  parentObject.totalQueueCount--;
                    	  myQueue.removeExistingFileName(obj, fileArray);
                          me.cancelUpload();
                          obj.selectedFiles -= fileArray.length; 
                          myQueue.updateFileCounter(options, obj);
                          parentObject.errorLog.html("");
                          doIScroll('CONTENT_DIV', 'refresh');
                          myQueue.updateremovedFiles(me.id);
                          me.removeFromQueue();
                      	if(parentObject.responseCount==parentObject.totalQueueCount){
                       		parentObject.responseCount=0;
                       	 var browseId="uploader_browse"+parentObject.groupId;
                		$("#"+browseId).css({opacity: 1.0, cursor: "wait"}).prop("disabled", false);
                		 $("#"+browseId).find("input[name='"+options.filesInputName+"[]']").removeAttr('disabled');
                       		parentObject.handlerCallback.apply('state',['notuploaded']);
                   			}
                      });
                  }                  
                  if(!uploadFeautres.formdata) 
                  {
                      pd.progressbar.width('5%');
                  } else pd.progressbar.width('1%'); 
              },
			xhr: function() {
				var xhr = new window.XMLHttpRequest();
				xhr.upload.addEventListener('progress', function(event) {
					if (event.lengthComputable) {
						if(options.displayProgress) {
							var percent=Math.ceil(event.loaded / event.total * 100) + '%';
							options.getProgress.call(parentObject,percent);
	                        pd.progressbar.html(percent);
	                        pd.progressbar.width(percent);
	                        pd.progressbar.css('text-align', 'center');
	                    }
					}
				}, false);
				return xhr;
			}
		});

		jqXHR.done(function(response) {
			pd.abort.hide();
			var result=[];
			var decodedResponse=null;
			var errorflag=false;
			var errorStatus=null;
			var uploadResponse =null;
			try{
				decodedResponse=cbx.decode(response);
				uploadResponse = decodedResponse.response;
			}catch(err){
				decodedResponse=options.jsonErrorText;  
				errorflag=true;
			}
			var endSend=options.endSend.call(parentObject, decodedResponse);
			obj.responses.push(response);


			if(errorflag==false && decodedResponse.success=="false"){
				errorStatus=me.getErrorStatus(uploadResponse);
				if(cbx.isEmpty(errorStatus)){

					errorStatus=options.unknownErrorText;
				}
				me.updateErrorStatus(jqXHR,errorStatus);

			}   
			else if(errorflag==false && decodedResponse.response.success=="false"){
				errorStatus=me.getErrorStatus(uploadResponse);
				if(cbx.isEmpty(errorStatus)){

					errorStatus=options.unknownErrorText;
				}
				me.updateErrorStatus(jqXHR,errorStatus);

			} 
			else if(errorflag==false && decodedResponse.success=="true"){
				me.updateSuccessStatus(response,uploadResponse,jqXHR);

			}
			else if(errorflag==false && decodedResponse.response.success=="true"){
				me.updateSuccessStatus(response,uploadResponse,jqXHR);

			}
			else{
				
				errorStatus=options.unknownErrorText;
				me.updateErrorStatus(jqXHR,errorStatus);
			}
			doIScroll('CONTENT_DIV', 'refresh');

		});
		jqXHR.fail(function(jqXHR, status) {
			var result=[];
			var sendFail=options.sendFail.call(parentObject, status);
            pd.abort.hide();
            if(jqXHR.statusText == "abort" || status=="abort") 
            {
            	 pd.statusbar.hide("slow").remove();                
                myQueue.removeExistingFileName(obj, fileArray);
                obj.selectedFiles -= fileArray.length; //reduce selected File count
                myQueue.updateFileCounter(options, obj);
                parentObject.errorLog.html("");
                doIScroll('CONTENT_DIV', 'refresh');
                myQueue.updateremovedFiles(me.id);
                me.removeFromQueue();
            }
             else {

 				me.updateErrorStatus(jqXHR,status);
            }

            var onError= options.onError.call(parentObject, fileArray, status, jqXHR, pd);
          
			doIScroll('CONTENT_DIV', 'refresh');
        });
		jqXHR.always(doneCallback);
	};

	me.cancelUpload = function() {
		if (jqXHR !== null) {
			jqXHR.abort();
		}
	};

	me.removeFromQueue = function() {
		myQueue.removeFile(me);
	};
}
