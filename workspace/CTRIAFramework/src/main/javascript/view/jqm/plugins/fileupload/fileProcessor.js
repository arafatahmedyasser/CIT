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
function fileProcessor(options,parentObject,form,feature) {
	
	var me=obj=this;	
    me.fileCounter = 1;
    me.selectedFiles = 0;
    me.fCounter = 0; //failed uploads
    me.sCounter = 0; //success uploads
    me.responses = [];
    me.existingFileNames = [];
    me.store=[];
    me.recordType={
    			state:'',
    			enryptedFileName:'',
    			attachmentRefNumber:'',
    			id:'',
    			name:'',
    			type:'',
    			size:''
    }; 
    
    var uploadQueue = [];
	me.length = 0;
	me.totalBytesInQueue = 0;
	
	me.beginUpload = function() {
		parentObject.errorLog.html("");
		processNextFile();
	};
	
    me.getUploadQueue=function(){
    	return uploadQueue;
    };
    me.getUploadFileStatus=function(){
    	var uploadQueue=me.getUploadQueue();
    	var i = 0;
    	var result=[];
    	var count=0;
		for (i = 0; i < me.store.length; i++) {
			 count++;
			 result.push({'state':me.store[i].state,'filename':me.store[i].name,totalCount:uploadQueue.length+me.store.length,enryptedFileName:me.store[i].enryptedFileName,attachmentRefNumber:me.store[i].attachmentRefNumber});
		}
		for (i = 0; i < uploadQueue.length; i++) {
			 count++;
			 result.push({'state':uploadQueue[i].state,'filename':uploadQueue[i].name,totalCount:uploadQueue.length+me.store.length,enryptedFileName:uploadQueue[i].enryptedFileName,attachmentRefNumber:uploadQueue[i].attachmentRefNumber});
		}
		return result;
    	
    };
	
	me.removeAll=function(event) {
		 event.stopPropagation();
		var resultData=[];
	      for (var i=0; i<me.store.length; i++) { 
	    	  resultData.push({'state':me.store[i].state,'enryptedFileName':me.store[i].enryptedFileName,'filename':me.store[i].name,'attachmentRefNumber':me.store[i].attachmentRefNumber,'filesize':me.store[i].size});
              }
		 var removeAll=options.removeAll(resultData,event,uploadQueue,me.length,me.existingFileNames,me.selectedFiles,me.totalBytesInQueue);		
		 if(removeAll==false) return;
		parentObject.errorLog.html("");
		uploadQueue = [];
		me.length = 0;
		 me.existingFileNames = [];
		 me.fileCounter=1;
		 me.selectedFiles = 0;
		 me.totalBytesInQueue = 0;
		 $(".cbx-file-upload-statusbar").each(function () {
			 $(this).remove();
		 });
		 var contentId="uploadercontent"+parentObject.groupId;
		 $('#'+contentId).find('.uploadqueue').show();
		 parentObject.reponseCount=0;
		 doIScroll('CONTENT_DIV', 'refresh');
		 me.store=[];
		 var result=[];
			options.model.updateValue(options.filesInputName, result);
            options.afterRemoveAll(result,event);
            
	};
	
	 me.removeExistingFileName=function(obj, fileArr) {
	        if (obj.existingFileNames.length) {
	            for (var x=0; x<fileArr.length; x++) {
	                var pos = obj.existingFileNames.indexOf(fileArr[x]);
	                if (pos != -1) {
	                    obj.existingFileNames.splice(pos, 1);
	                }
	            }
	        }
	    };
	    
	    me.updateremovedFiles=function(id) {
	        if (me.store.length) {
	            for (var x=0; x<me.store.length; x++) {
	            	if(me.store[x].id==id){
	            		me.store.splice(x,1);
	            	}
	            		
	            }
	        }
	    };
	    
	    me.updateFileCounter=function(options, obj) {
	        if(options.displayFileCounter) {
	            var count = $(".cbx-file-upload-filename").length;
	            if(count==0){
	            	 var contentId="uploadercontent"+parentObject.groupId;
	        		 $('#'+contentId).find('.uploadqueue').show();
	        		 parentObject.reponseCount=0;
	            }
	            obj.fileCounter = count + 1;
	            $(".cbx-file-upload-filename").each(function (i, items) {
	                //var arr = $(this).html().split(options.counterStyle);
	            	 var name = count + options.counterStyle + $(this).attr('cbx-filename');
	                $(this).html(name);
	                count--;
	            });
	        }
	    };

    me.addFiles=function(fileList) {
    	
    	parentObject.errorLog.html("");
        var fileArray = [];
        if(fileList.files) //support reading files
        {
            for(var i = 0; i < fileList.files.length; i++) {
                fileList.files[i].state='queued';
                fileArray.push(fileList.files[i].name);
            }
            var validatedFileList=[];
            for(var i = 0; i < fileList.files.length; i++) {
            var fileAdd=options.beforeFileAdd(fileList.files[i].name,options.uploadCount,fileList.files,me.totalBytesInQueue,parentObject.errorLog);
            if(fileAdd == false){
            	continue;
            }
            else{
            validatedFileList.push(fileList.files[i]);
            }
            }
            
        } else {
            var filenameStr = $(fileList).val();
            var flist = [];
            fileArray.push(filenameStr);
            if(!isFileTypeAllowed(obj, options, filenameStr)) {
                if(options.displayError) $("<div class='" + options.errorClass + "'><b>" + filenameStr + "</b> " + options.extensionErrorLabel + options.allowedMimeTypes + "</div>").appendTo(
                    obj.errorLog);
                return;
            }
            flist.push({
                name: filenameStr,
                size: 'NA'
            });
            if(options.beforeFileAdd($(fileList),me.totalBytesInQueue) == false) return;

        }
        
        me.updateFileCounter(options, obj);
        if(feature.fileapi && feature.formdata) 
        {
        	var files=null;
           if(validatedFileList.length>0)
           files = validatedFileList;
           else
           files = [];
           
           uploadFiles(options, obj, files);
           options.fileAdd(files,me.totalBytesInQueue,parentObject.errorLog);
        } 
    	
    };
    
    function isFileTypeAllowed(obj, options, fileName) {
        var fileExtensions = options.allowedMimeTypes.toLowerCase().split(",");
        var ext = fileName.split('.').pop().toLowerCase();
        if(options.allowedMimeTypes != "*" && $.inArray(ext, fileExtensions) < 0) {
            return false;
        }
        return true;
    }

    function isFileDuplicate(obj, filename) {
        var duplicate = false;
        if (obj.existingFileNames.length) {
            for (var x=0; x<obj.existingFileNames.length; x++) {
                if (obj.existingFileNames[x] == filename
                    || options.duplicateStrict && obj.existingFileNames[x].toLowerCase() == filename.toLowerCase()
                ) {
                    duplicate = true;
                }
            }
        }
        return duplicate;
    }

   

    function getImagePreview(file, obj) {
        if(file[0]) {
            obj.show();
            var reader = new FileReader();
            reader.onload = function (e) {
             obj.src=reader.result;
            };
            reader.readAsDataURL(file);
        }
    }

    
    function getSizeStr(size) {
        var sizeStr = "";
        var sizeKB = size / 1024;
        if(parseInt(sizeKB) > 1024) {
            var sizeMB = sizeKB / 1024;
            sizeStr = sizeMB.toFixed(2) + " MB";
        } else {
            sizeStr = sizeKB.toFixed(2) + " KB";
        }
        return sizeStr;
    }

  

    function uploadFiles(options, obj, files) {
        for(var i = 0; i < files.length; i++) {
	        	if(!isFileTypeAllowed(obj, options, files[i].name)) {
	        		if(options.displayError) {
	        			$("<div class='" + options.errorClass + "'><b>" + files[i].name + "</b> " + options.extensionErrorLabel + options.allowedMimeTypes + "</div>").appendTo(parentObject.errorLog);
	        			 options.fileAddError.call(parentObject, "fileMimeMismatch",options.allowedMimeTypes,files[i].name);
	        		}
	        		continue;
	        	}
	        	if(!options.allowDuplicateFileNames && isFileDuplicate(obj, files[i].name)) {
	        		if(options.displayError)
	        		{
	        			$("<div class='" + options.errorClass + "'><b>" + files[i].name + "</b> " + options.duplicateErrorLabel + "</div>").appendTo(parentObject.errorLog);
	        			 options.fileAddError.call(parentObject, "fileduplicate",files[i].name,files[i].name);
	        		}
	        		continue;
	        	}
	        	if(options.fileSizeMax != -1 && files[i].size > options.fileSizeMax) {
	        		if(options.displayError) 
	        		{
	        			$("<div class='" + options.errorClass + "'><b>" + files[i].name + "</b> " + options.errorSizeLabel + getSizeStr(options.fileSizeMax) + "</div>").appendTo(
	        					parentObject.errorLog);
	        			 options.fileAddError.call(parentObject, "filesizeexceed",getSizeStr(options.fileSizeMax),files[i].name);
	        		}
	        		continue;
	        	}
	        	if(options.uploadCount != -1 && ((uploadQueue.length+1)+me.store.length) > options.uploadCount) {
	        		if(options.displayError) {
	        			$("<div class='" + options.errorClass + "'><b>" + files[i].name + "</b> " + options.uploadCountErrorLabel + options.uploadCount + "</div>").appendTo(
	        					parentObject.errorLog);
	        			 options.fileAddError.call(parentObject, "uploadcount",options.uploadCount,files[i].name);
	        		}
	        		continue;
	        	}
        	obj.selectedFiles++;
        	obj.existingFileNames.push(files[i].name);
           
          
            var fileUploadId = "cbx-upload-id-" + (new Date().getTime())+cbx.id();
            files[i].id=fileUploadId;
            var ext = files[i].name.split('.').pop().toLowerCase();
            var pd = new createProgressDiv(obj, options,fileUploadId,ext);
            var fileNameStr = "";
            if(options.displayFileCounter) fileNameStr = obj.fileCounter + options.counterStyle + files[i].name;
            else fileNameStr = files[i].name;
            var fileArray = [];
            fileArray.push(files[i].name);
            pd.filename.html(fileNameStr); 
            pd.filename.attr('cbx-filename',files[i].name);
            if(options.displayPreview && files[i] != null) {
            	try{
                if(files[i].type.toLowerCase().split("/").shift() == "image") getImagePreview(files, pd.preview);
            	}catch(err){}
            }
            obj.fileCounter++;
            options.groupId=parentObject.groupId;
            fileUploadList=new fileUpload(files[i], me, processNextFile,pd,options,obj,fileArray,parentObject);
            uploadQueue.push(fileUploadList);
            me.length = files.length;
            me.totalBytesInQueue += fileUploadList.file.fileSize;
            doIScroll('CONTENT_DIV', 'refresh');        	
        }
    }
    
    function createProgressDiv(obj, options,fileUploadId,ext) {
        this.statusbar = $("<div class='cbx-file-upload-statusbar " + fileUploadId + "'></div>").width(options.statusBarWidth);
        this.preview = $("<img class='cbx-file-upload-preview' />").width(options.previewWidth).height(options.previewHeight).appendTo(this.statusbar).hide();
        this.preview = $("<div class='cbx-file-upload-filetypeClass-"+ext+"'/>").appendTo(this.statusbar).hide();
        this.filename = $("<div cbx-filename='' class='cbx-file-upload-filename'></div>").appendTo(this.statusbar);
        this.progressDiv = $("<div class='cbx-file-upload-progress'>").appendTo(this.statusbar).hide();
        this.progressbar = $("<div class='cbx-file-upload-bar " + fileUploadId + "'></div>").appendTo(this.progressDiv);
        this.abort = $("<div class='cbx-file-upload-red " + options.abortButtonClass + " " + fileUploadId + "'>" + options.abortLabel + "</div>").appendTo(this.statusbar)
            .hide();
        this.cancel = $("<div class='cbx-file-upload-red " + options.cancelButtonClass + " " + fileUploadId + "'>" + options.cancelLabel + "</div>").appendTo(this.statusbar)
            .hide();
        this.done = $("<div class='cbx-file-upload-green'>" + options.donLabel + "</div>").appendTo(this.statusbar).hide();
        var contentId="uploadercontent"+parentObject.groupId;  
        if(options.showQueueDiv){          
        $('#'+contentId).find('.uploadqueue').hide();
        $('#'+contentId).after(this.statusbar);
        }else{
        	parentObject.errorLog.after(this.statusbar);	
        	$('#'+contentId).hide();
        }
        return this;
    }
    
	function processNextFile() {
		var nextFile = getNextFile();
		var filename=options.filesInputName.replace("[]", "");
		if (nextFile) {
			nextFile.uploadFile(
				options.url,
				filename
			);
			return true;
		}
		
		return false;
	}
	
	function getNextFile() {
		var nextFile = uploadQueue.shift();
		if (nextFile) {
			me.length = uploadQueue.length;
			me.totalBytesInQueue -= nextFile.size;
		}
		return nextFile;
	}
	
	me.removeFile = function(file) {
		var i = 0;
		for (i = 0; i < uploadQueue.length; i++) {
			if (uploadQueue[i] === file) {
				uploadQueue.splice(i, 1);
				me.length = uploadQueue.length;
				me.totalBytesInQueue -= file.size;				
				return true;
			}
		}
		return false;
	};
	
}
