/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.* 
 * 
 */
(function($, window) {
	
    var uploadFeautres = {}; 
    uploadFeautres.isFilesAPIAvailable = window.FileReader !== undefined;
    uploadFeautres.formdata = window.FormData !== undefined;   
    uploadFeautres.fileapi = $("<input type='file'/>").get(0).files !== undefined;
    uploadFeautres.isXHR2Available = new window.XMLHttpRequest().upload !== undefined;
    
    $.fn.uploadPanel = function (opts) {
    	
    	 uploadPanelDefaults = {

    		    		fileSizeMax: 1024*1024*10,
    		    		uploadCount: 1,
    		    		allowedBytesInQueue: 0,
    		    		uploadFileSize: 10485760,
    		    		allowedMimeTypes: "*",
    		            method: "POST",
    		            enctype: "multipart/form-data",
    		            url:'./pfus?timeout='+new Date().getTime()+'&'+iportal.systempreferences.getCSRFKeyName()+"="+iportal.systempreferences.getCSRFUniqueId()
    	            	+'&Item-Id='+configData.itemId+'&Form-Id='+configData.formId+'&INPUT_ACTION=FILE_ATTACH_ACTION&INPUT_FUNCTION_CODE=VSBLTY&INPUT_SUB_PRODUCT=CUSER&PAGE_CODE_TYPE=FILE_UPLOAD&PRODUCT_NAME=CUSER',    					
    		    		filesInputName: 'uploadFile',
    		    		inlineFormData: {},
    		    		allowDuplicateFileNames: true,
    		            duplicateStrict: false,
    		            init: $.noop,
    		            multiple: true,
    		            displayCancel: true,
    		            displayAbort: true,
    		            displayDone: true,
    		            displayError: true,
    		            successStatus: true,
    		            errorStatus: true,
    		            displayFileCounter: true,
    		            counterStyle: ".) ",
    		            displayProgress: true,
    		            displayProgressBar: true,
    		            RTLSupported:iportal.preferences.isLangDirectionRTL?iportal.preferences.isLangDirectionRTL():false,
    		            displayProgressBarAfterSuccess: true,
    		            noSupport:$.noop,
    		            onSuccess: function (files, response, xhr, pd) {},
    		            onError: function (files, status, xhr,pd) {},
    		            onCancel: function (fileData, pd,event) {
    		            	 return true;
    		            },
    		            afterCancel: function (result,event) {},
    		            beforeFileAdd: function (filename,uploadCount,files,totalBytes,errorlog) {
    		                return true;
    		            },
    		           fileAdd: function (files,totalBytes,errorlog) {},
    		           removeAll: function (resultData,event,uploadQueue,length,existingFileNames,selectedFiles,totalBytesInQueue) {
    		                return true;
    		            },    
    		            afterRemoveAll: function (resultData,event) {},
    		            onUpload:function(queuedcount,totalqueuedcount) { return true;},
    		            beginSend:function(fileUploader){},
    		            endSend:function(response){},
    		            sendFail:function(response){},
    		            getProgress:function(percent){},
    		            fileAddError: function (errorResponse,errorCause,fileName) {},
    		            abortButtonClass: "cbx-file-upload-abort",
    		            cancelButtonClass: "cbx-file-upload-cancel",
    		            errorClass: "cbx-file-upload-error",
    		            successClass: "cbx-file-upload-success",
    		            successMsg:true,
    		            errorMsg:true,
    		            uploadButtonClass: "cbx-file-upload",
    		            abortLabel: "Abort",
    		            cancelLabel: "Cancel",
    		            donLabel: "Done",
    		            errorLabel: "Error",
    		            extensionErrorLabel: "is not allowed. Allowed extensions: ",
    		            duplicateErrorLabel: "is not allowed. File already exists.",
    		            errorSizeLabel: "is not allowed. Allowed Max size: ",
    		            uploadErrorLabel: "Upload is not allowed",
    		            uploadCountErrorLabel: " is not allowed. Maximum allowed files are:",
    		            statusBarWidth: 500,
    		            displayPreview: false,
    		            previewHeight: "auto",
    		            previewWidth: "10%",
    		            nestedFormInlineObj:true,
    		        	fullSupportClass: 'fullsupport',
    		        	noSupportClass: 'nosupport',
    		        	noFilesAPIClass: 'nofilesapi',
    		        	noXHR2Class: 'noxhr2',
    		        	errorLogPosition:'bottom',
    		        	showQueueDiv:false,
    		        	uploadContentText:"Upload File Queue",
    		        	footerTitle:"Multiple Upload",
    		        	footerText:"Add files to the upload queue",
    		        	fileUploadSupportText:'No FileUploadSupport kindly Upgrade to html5 precisely'
    		    	};
    	var options = $.extend({}, uploadPanelDefaults, opts);
      
    	if(cbx.isEmpty(options.bundle)){
    		options.bundle=CRB.getFWBundle();
    	}
    
    if(!uploadFeautres.formdata) {
    	options.multiple = false;
    }
    if(options.RTLSupported){    
    	options.displayFileCounter=false;
    }
       
    var obj = this;
    
    var groupId = "cbx-fileUpload-"+(new Date().getTime());
    this.groupId = groupId;  
    this.responseCount=0;
    
    var panel='<div id="'+"uploader"+groupId+'" style="position:relative">';
    panel+='<div class="uploadwrapper">';

    panel+='<div class="uploadcontainer">';
    panel+='<div class="upload">';
    panel+='<div class="uploadheader">';
    panel+='<div class="upload_buttons">';
    if(options.RTLSupported){    	 
    	panel+='<div id="'+"uploader_removeall"+groupId+'" class="upload_button_remove_RTL" >'+options.removeAllText+'</div></div>';
    	panel+='<div ><div id="'+"uploader_browse"+groupId+'" class="upload_button_RTL upload_add" style="position: relative; z-index: 1;display: inline-block;">'+options.addText+'</div>';

    }else{
    	panel+='<div ><div id="'+"uploader_browse"+groupId+'" class="upload_button upload_add" style="position: relative; z-index: 1;display: inline-block;">'+options.addText+'</div>';
    	panel+='<div id="'+"uploader_removeall"+groupId+'" class="upload_button_remove" >'+options.removeAllText+'</div></div>';

    }
   panel+='</div>';
    panel+='</div>';
    panel+='<div class="uploadcontent" id="'+"uploadercontent"+groupId+'">';
    

    panel+='<div class="uploadqueue"><center>'+options.uploadContentText+'</center></div>';

    panel+='</div>';

    panel+='<div class="uploadfooter">';
    panel+='<div class="uploadfootercontent">';
    panel+='<div class="uploadfootertitle">'+options.footerTitle+'</div>';
    panel+='<div class="uploadfootertext">'+options.footerText+'</div>';
    panel+='</div>';
    panel+='</div>';

    panel+='</div>';
    panel+='</div>';

    panel+='</div>';

    panel+='</div>';
    
    $(obj).before($(panel));
    
     
    this.errorLog = $("<div class=errorlog></div>"); 
    var headerId="uploader"+obj.groupId;
    options.errorLogPosition=='bottom'?this.after(this.errorLog):$('#'+headerId).before(this.errorLog);
    var formgroup=createformGroup(options,obj);
    
    if (!uploadFeautres.isFilesAPIAvailable || ! uploadFeautres.isXHR2Available) {
    	$("form").removeClass(options.fullSupportClass);
    	$("form").addClass(options.noSupportClass);
    	var flag=true;
		if (!uploadFeautres.isFilesAPIAvailable) {
			$("form").addClass(options.noFilesAPIClass);
			flag=false;
		}
		if (!uploadFeautres.isXHR2Available) {
			$("form").addClass(options.noXHR2Class);
		}
	}

	if (uploadFeautres.isXHR2Available==false || uploadFeautres.fileapi==false || uploadFeautres.formdata==false) {		
			options.noSupport.call(this,obj);
			var uploaderid="uploader"+groupId;
			$(obj).parent().find('#'+uploaderid).remove();
			this.errorLog.html(options.fileUploadSupportText);
			return this;
		}
    if(!options.showQueueDiv){
    	var contentId="uploadercontent"+obj.groupId;  
    	$('#'+contentId).remove();
    }
    $("form").addClass(options.fullSupportClass);    
    options.init.call(this, obj);   
    
    this.startUpload = function (handler, totalQueueCount) {
    	obj.handlerCallback=handler;
    	obj.totalQueueCount=totalQueueCount;
    	 var upload=options.onUpload(this.getQueue(),totalQueueCount);		
    	 var browseId="uploader_browse"+obj.groupId;
		 $("#"+browseId).css({opacity: 0.4, cursor: "wait"}).prop("disabled", true);
		 $("#"+browseId).find("input[name='"+options.filesInputName+"']").attr("disabled", true);
    formgroup.each(function () {
            if($(this).is('form')) {            	 
            	$(this).submit();
        }
    });
    };
    
    this.getQueue = function () {
    	var fileQueueObj=$(obj).data('fileQueue');
    	return fileQueueObj.getUploadQueue();
        };
        
    this.getFileStatus = function () {
    	var fileQueueObj=$(obj).data('fileQueue');
    	return fileQueueObj.getUploadFileStatus();
    };
    
    this.removeAll=function () {
    	 var removeID="uploader_removeall"+obj.groupId;	    	
    	 $("#"+removeID).trigger('click');
    },

	formgroup.each(function() {
	 
	    	var $this = $(this),
			fileQueue = new fileProcessor(options,obj,$this,uploadFeautres),
			fileInputs;	    	
	    	$(this).submit(function(e) {
				fileQueue.beginUpload();
				e.preventDefault();
			    e.stopPropagation();
			    return;
			});

	           var removeID="uploader_removeall"+obj.groupId;
	    	
	    	  $("#"+removeID).click(function (e) {
	    		  fileQueue.removeAll(e);
              });

			$(obj).data('fileQueue', fileQueue);
			
			if ($this.is('input[type=file]')) {
				$this.on('change', function() {
					obj.errorLog.html("");
					fileQueue.addFiles(this);
				});
				$this.on('DOMNodeInserted ', function(e) {
					if ( $(this).parent().is( "div" ) ) {
					 $(this).unwrap();
					}
			    e.stopPropagation();
				});
				if (options.allowedMimeTypes) {
					$this.attr('accept', options.allowedMimeTypes);
				}
			} else {
				fileInputs = $this.find('input[type=file]');
				fileInputs.on('change', function() {
					obj.errorLog.html("");
					fileQueue.addFiles(this);
				});
				fileInputs.on('DOMNodeInserted ', function(e) {
					if ( $(this).parent().is( "div" ) ) {
					 $(this).unwrap();
					}
			    e.stopPropagation();
				});
				if (options.allowedMimeTypes) {
					fileInputs.attr('accept', options.allowedMimeTypes);
				}
			}
		});
	
	
    
    function createformGroup(opt,obj){
    	
    	  var fileUploadId = "cbx-fileUpload-id-" + (new Date().getTime());

          var form = $("<form method='" + opt.method + "' class='"+obj.groupId+"' action='" + opt.url + "' enctype='" + opt.enctype + "'></form>");
          var fileInputStr = "<input type='file' id='" + fileUploadId + "' name='" + opt.filesInputName + "' accept='" + opt.acceptedMimeTypes + "'/>";
          if(opt.multiple) {
              if(opt.filesInputName.indexOf("[]") != opt.filesInputName.length - 2) 
              {
                  opt.filesInputName += "[]";
              }
              fileInputStr = "<input type='file' id='" + fileUploadId + "' name='" + opt.filesInputName + "' accept='" + opt.acceptedMimeTypes + "' multiple/>";
          }
          var fileInput = $(fileInputStr).appendTo(form);
           var browseId="uploader_browse"+obj.groupId;
          if(opt.nestedFormInlineObj && $("#"+browseId).length>0) {
              form.css({
                  'margin': 0,
                  'padding': 0
              });
             
              fileInput.css({
                  'position': 'absolute',
                  'cursor': 'pointer',
                  'top': '-8px',
                  'width': '99%',
                  'height': '130%',
                  'left': '0px',
                  'z-index': '100',
                  'opacity': '0.0',
                  'filter': 'alpha(opacity=0)',
                  '-ms-filter': "alpha(opacity=0)",
                  '-khtml-opacity': '0.0',
                  '-moz-opacity': '0.0'
              });
              form.appendTo($("#"+browseId));

          } else {
              form.appendTo($('body'));
              form.css({
                  'margin': '0',
                  'padding': '0',
                  'display': 'block',
                 ' position': 'absolute',
                  'left': '-250px'
              });
            
                  $("#"+browseId).click(function () {
                      fileInput.click();
                  });
          }
          return form;
    }
    return this;
    };
    
    
   
	
}(jQuery, window));