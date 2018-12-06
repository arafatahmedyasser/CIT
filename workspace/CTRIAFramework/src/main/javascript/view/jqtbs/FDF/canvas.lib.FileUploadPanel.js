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
cbx.ns('ct.lib.formElement');
/**
 * @namespace 	"canvas.lib"
 * @description This component is currently responsible for creating and rendering a file upload panel.
 */

ct.lib.formElement.FileUploadPanel = Class(canvas.lib.FormElements,{
        
	/**
	 * @method generateFieldSpecificEvents
	 * @memberof "canvas.lib.FileUploadPanel"
	 * @description This method is responsible for creating the element specific functions.
	 */
        generateFieldSpecificEvents:function(){
                
                var i=0;
                this.filesList = [];
                this.tot_fileSize = 0;
                var that=this;
                this.getComponent().find('[data-item-id="ct-addFile"]').bind('click', $.proxy(function (e)
                {
                this.getComponent().find('.progress').find('[data-item-id=ctUpload-progress-bar]').css("width","0%").text("0%");
                this.getComponent().find('.progress').addClass('hidden').find('[data-item-id=ctUpload-progress-bar]').removeClass('progress-bar-danger');
                this.getComponent().find('[data-item-id="ct-uploadForm"]').append("<input type='file' name='f"+i+"' class='files_Ready' style='display: none;'>");
                this.getComponent().find('input[name=f'+i+']').on('change',function(e){
                        var fn=$(this).get(0).files;
                        var size = fn[0].size;
                        that.tot_fileSize = that.tot_fileSize + size;
                        if(fn.length>0){
	                        that.filesList = that.getComponent().find('div[data-item-id="ct-fileList"]')
	                        that.filesList.append('<div class="row" data-item-id="'+(i-1)+'"><span data-item-type="ct-file" class="col-sm-10 col-xs-10 col-lg-10 col-md-10 ct-text-boundary" >'+fn[0].name+'</span><span data-item-type="ct-fileRemove" name="f'+(i-1)+'" class="ct-fileRemove flaticon-close2"></span></div>');
	                        $('span.ct-fileRemove').click(function(){
		                        var name=$(this).attr('name');
		                        that.getComponent().find('input[name='+name+']').remove();
		                        that.tot_fileSize = that.tot_fileSize - size;
		                        $(this).parent().remove();
	                        });
	                        that.getComponent().find('[data-item-id=ct-uploadFile]').removeClass('disabled');	                       
                        }
                        }).trigger('click');
                        i++;
                        
                      
                },this));
               
                this.getComponent().find('[data-item-id="ct-uploadFile"]').bind('click', $.proxy(function (e)
                {
	                if(that.tot_fileSize <= 10485760){
		                var form=this.getComponent().find('[data-item-id="ct-uploadForm"]');
		                var files=form.children();
		                for(var i=0;i<files.length;i++){
		                if(files[i].files.length==0)
		                	files.splice(i,1);
		                }
		                if (files.length != 0){
			                var formData = new FormData($(form)[0]);
			                var progressBar = that.getComponent().find('.progress');
			                if(progressBar.hasClass('hidden')){
			                	progressBar.removeClass('hidden');
			                }
			                
			                var postUrl='./pfus?timeout='+new Date().getTime()+'&'+iportal.systempreferences.getCSRFKeyName()+"="+iportal.systempreferences.getCSRFUniqueId()
			            	+'&Item-Id='+this.itemId+'&Form-Id='+this.formId+'&INPUT_ACTION=FILE_ATTACH_ACTION&INPUT_FUNCTION_CODE=VSBLTY&INPUT_SUB_PRODUCT=CUSER&PAGE_CODE_TYPE=FILE_UPLOAD&PRODUCT_NAME=CUSER';
			                
			               // var URL= './PictureUploadServlet?imgHandle=STORE_USER_IMAGE&INPUT_ACTION=PICTURE_PROCESS_ACTION&INPUT_FUNCTION_CODE=VSBLTY&INPUT_SUB_PRODUCT=CUSER&PAGE_CODE_TYPE=PICTURE_PROCESS&PRODUCT_NAME=CUSER&timeout='+new Date()+'';
			                ct.upload({
			                          form:form,
			                          data : formData,
			                          files: that.filesList,
			                          progressBar : progressBar,
			                          url:postUrl,                           
			                           getResponse:function(res){
			                        	   var val = res.response;
			                               var size = res.response.FileSize;
			                              // if((parseInt(size)>10485760) || res.response.error){
			                               if(res.response.error == "FileSizeExceeds"){
			                            	   progressBar.find('[data-item-id=ctUpload-progress-bar]').addClass('progress-bar-danger').text("0%");
			                            	   var warn_Msg = new canvas.Dialog({
			                            		   dialogType : 'ERROR',                            		  
			                            		   message : 'File size shouldnot exceeded by more than 10MB',
			                            		   title :CRB.getFWBundleValue('LBL_WARN')
			                            	   });
			                            	   warn_Msg.show();
			                               }else if(res.response.error=="File type not supported"){
			                            	   progressBar.find('[data-item-id=ctUpload-progress-bar]').addClass('progress-bar-danger').text("0%");
			                            	   var warn_Msg = new canvas.Dialog({
			                            		   dialogType : 'ERROR',
			                            		   dialogStyle : "OK_CANCEL",
			                            		   message : 'File type not supported',
			                            		   title :CRB.getFWBundleValue('LBL_WARN'),
			                            		   okHandler : function(){
			                            			  
						       	                        	progressBar.addClass('hidden');	
						       	                        	warn_Msg.close();
			                            		   }
			                            		   
			                            	   });
			                            	   warn_Msg.show();
			                            	   	       	                        
			       	                        
			                               }else if(res.response.success=='true'){
			                            	   var DELAY = 200,  timer = null;
			                            	   timer = setTimeout(function() {
			                            		   that.getComponent().find('[data-item-id="ct-uploadForm"] .files_Ready').remove();
			            			        		$(that.filesList).find('[data-item-type=ct-fileRemove]').addClass('flaticon-circle_tick').removeClass('flaticon-close2').removeClass('ct-fileRemove').off('click');
			            			        		that.getComponent().find('[data-item-id=ct-uploadFile]').addClass('disabled');
			            			        	},DELAY);
			                               }
			                            	   
			                                      }        
			                                });
		                }
	                }
	                else{
	                	var warn_Msg = new canvas.Dialog({
                 		   dialogType : 'ERROR',                            		  
                 		   message : 'File size shouldnot exceeded by more than 10MB',
                 		   title :CRB.getFWBundleValue('LBL_WARN')
                 	   });
                 	   warn_Msg.show();
	                }
                },this));                
                     
                
        }
});

CFCR.registerFormCmp({'COMP_TYPE' : 'FORM_FIELDS','COMP_NAME':'cbx-fileuploadpanel' }, ct.lib.formElement.FileUploadPanel);