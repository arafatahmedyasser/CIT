/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */

 /**
  * @namespace "canvas.lib"
  */
  
cbx.ns("canvas.lib");


canvas.lib.modalmgr = function(){
          
         var MODALINDEX = 0;
         var modalWindows = [];
         
        return ({
                 getModalIndex : function(){
                            return MODALINDEX;
                },
                 setModalIndex : function(modalIndex){
                         MODALINDEX = modalIndex;
                 },
                 incrementModalIndex :function(){
                         MODALINDEX++;
                 },
                 decrementModalIndex :function(){
                         MODALINDEX--;
                 },
                 setModalWindowRef : function(modalWindow){
                	 modalWindows[modalWindows.length]=modalWindow;
                	 canvas.lib.modalmgr.incrementModalIndex();
                 },
                 getActiveModalWindow : function(){
                	 return modalWindows[modalWindows.length];
                 },
                 closeModalWindow:function(){
                	 modalWindows.removeAt(modalWindows.length-1);
                	 canvas.lib.modalmgr.decrementModalIndex();
                 },
                 resizeActiveModalWindow :function (){
                	 if(modalWindows.length>0){
                		 $('#FOOTER_DIV').find('div[data-item-id=modal-'+modalWindows[modalWindows.length-1].index+']').modal('handleUpdate');
                		 
                	 }
                 }
        })
  
}();



(function($) {

    $.fn.dragmove = function() {
    
        return this.each(function() {
                var $dragging = null;
            var $document = $(document),
                $this = $(this),
                $parent=$this.parent(),
                activeX,
                activeY,
                startX,
                startY;
            
            $this.on('mousedown touchstart', function(e) {
            
                    activeX = true;activeY = true;
                startX = e.originalEvent.pageX - $parent.offset().left;
                startY = e.originalEvent.pageY - $parent.offset().top;         
                $parent.removeClass('ct-no-dragable');
                $dragging = $(e.target);
                if ('mousedown' == e.type)
                    
                    click = $this;
                                    
                if ('touchstart' == e.type)
                
                    touch = $this;
                                    
                if (window.mozInnerScreenX == null)
                
                    return false;        
            });
            
            $this.on('mousemove touchmove', function(e) {
                   
                if ('mousemove' == e.type && $dragging){
                        
                        var windowHeight = Math.round($(window).height()+$(window).scrollTop()); 
                        var windowWidth = Math.round($(window).width()+$(window).scrollLeft());
                        var htTotal = Math.round($parent.offset().top+$parent.height());
                        var wtTotal = Math.round($parent.offset().left+$parent.width());
                        var popLeft = e.originalEvent.pageX - startX;
                        var popTop = e.originalEvent.pageY - startY;
                        
            /*            if(windowHeight < htTotal && activeX){
                        	$parent.offset({
                            left: popLeft,
                            top: windowHeight-$parent.height()
                       });
                                if(!$parent.hasClass('ct-no-dragable'))
                                	$parent.addClass('ct-no-dragable');
                                activeY = false;
                        } else if(windowWidth < wtTotal  && activeY) {
                        	$parent.offset({
                            left:windowWidth-$parent.width(),
                            top: popTop
                        });
                                if(!$parent.hasClass('ct-no-dragable'))
                                	$parent.addClass('ct-no-dragable');
                                activeX = false;
                        }else if( Math.round($parent.offset().top)<($(window).scrollTop())  && activeX){
                        	$parent.offset({
                            left: popLeft,
                            top:5+($(window).scrollTop())
                      });
                                if(!$parent.hasClass('ct-no-dragable'))
                                	$parent.addClass('ct-no-dragable');
                                activeY = false;
                        }else if(Math.round($parent.offset().left)<($(window).scrollLeft())  && activeY){
                        	$parent.offset({
                                     top: popTop,
                                     left:5+($(window).scrollLeft())
                        });
                                if(!$parent.hasClass('ct-no-dragable'))
                                	$parent.addClass('ct-no-dragable');
                                activeX = false;
                        }else*/ if(activeX && activeY){
                        	$parent.offset({
                             left: popLeft,
                             top: popTop
                         });
                                
                        }
                }
                        
                if ('touchmove' == e.type && active){
                    touch.offset({
                        left: e.originalEvent.pageX - startX,
                        top: e.originalEvent.pageY - startY
                    });
               }
                
            });
            $document.on('mouseup touchend', function() {
            	if($dragging){
                    activeX = false;activeY = false;
                    $parent.removeClass('ct-no-dragable');
                     $dragging = null;
                     }
            
            });
                                
        });
            
    };

})(jQuery);



/**
 * @description This component is currently responsible for the modal window which provides an fullscreen feature.
 */


canvas.lib.modalwindow = Class(cbx.core.Component, {
        /**
         * @class "canvas.lib.modalwindow"
         * @description The constructor gets the parent element.
         */
        constructor : function (config,callback)
        {	
        		this.callback =callback;
                this.content = config.modalContent;
                this.modalClass=config.modalClass;
                this.fullscreenInd=config.fullscreenInd;
                this.parent = $(this.content).parent();
                canvas.lib.modalmgr.setModalWindowRef(this);
                this.index=canvas.lib.modalmgr.getModalIndex();
                this.viewScope =config.viewScope;
                this.ref=config.scope;
                if (iportal.workspace.metadata.isWidgetCatalogRequired())
                {
                        this.appObj = iportal.workspace.metadata.getAppDock();
                }
                this.createModal();
        },
        /**
         * @method createModal
         * @memberof "canvas.lib.modalwindow"
         * @description This method is responsible for creating the modal window.
         */
        createModal : function ()
        {
                var tmpLayer = new ct.lib.tmplLayer('modalWindow.cttpl',this);
                tmpLayer.getTemplate(this.applyTemplate, this);
        },
        /**
         * @method applyTemplate
         * @memberof "canvas.lib.modalwindow"
         * @description This method is responsible for rendering the template of the modal window, hiding dock in full
         *              screen and adding the close button listener.
         */
        applyTemplate : function (template, tmpClass)
        {
            var that = this;
            $('#FOOTER_DIV').append(template);
            if (iportal.workspace.metadata.isWidgetCatalogRequired() || iportal.workspace.metadata.isCardMasterScreen()== true)
            {
                    this.appObj.hideAppDock();
            }
            this.addContent();
            $('#HEADER_DIV').children().children().addClass('ct-al__modalopen-header');
            $('#FOOTER_DIV').find('[data-item-id=ct-copyrights]').addClass('ct-al__modalopen-footer');
            $('#FOOTER_DIV').find('div[data-item-id=modal-'+that.index+']').modal('show');
            $('#FOOTER_DIV').find('button[data-dismiss=modal-'+that.index+']').on('click',$.proxy(this.hideModal,that));
            $('#FOOTER_DIV').find('div[data-item-id=modal-'+that.index+'] .modal-backdrop').on('click',function(){
                    return false;
            });
            if(!this.fullscreenInd){
                $('#FOOTER_DIV').find('div[data-item-id=modal-' + that.index + ']').find('[data-item-id=ct-modal-header]').dragmove();
               /* $('#FOOTER_DIV').find('div[data-content-id=modal-content-' + that.index + ']').unbind('mousedown').bind('mousedown', function ()
                {
                        return false;
                });*/
                $('#FOOTER_DIV').find('div[data-content-id=modal-content-'+this.index+']').find('[data-item-id=formCont_body]').resize(function(){
                	// $('#FOOTER_DIV').find('div[data-item-id=modal-'+that.index+']').modal('resize');
        	  
                });
            }
            $('[data-toggle="tooltip"]').tooltip();
            if(this.callback){
            	this.callback(this.ref);
            }
            
        },
        hideModal: function (){
	        $('#FOOTER_DIV').find('div[data-item-id=modal-'+this.index+']').modal('hide');
	        this.content = $('#FOOTER_DIV').find('div[data-content-id=modal-content-'+this.index+']').children();
	        if(this.parent!=undefined)
	        $(this.parent).append(this.content);
	        if(this.viewScope){
	        	if(this.viewScope.renderer.refreshViewAfterModalClose)
	        	this.viewScope.renderer.refreshViewAfterModalClose();
	        }
	        this.removeModal();             
        },
        /**
         * @method addContent
         * @memberof "canvas.lib.modalwindow"
         * @description This method is responsible for adding the widget content to the modal
         */
        addContent : function ()
        {
                $('#FOOTER_DIV').find('div[data-content-id=modal-content-'+this.index+']').append(this.content);
        },
        /**
         * @method removeModal
         * @memberof "canvas.lib.modalwindow"
         * @description This method is responsible for removing the modal when it is closed and get back the app dock.
         */
        removeModal : function ()
        {
                $('#FOOTER_DIV').find('div[data-item-id=modal-'+this.index+']').remove();
                canvas.lib.modalmgr.closeModalWindow();
                if (canvas.lib.modalmgr.getModalIndex() == 0)
                {
                        $('body').removeClass('modal-open').removeAttr('style');
                        $('#HEADER_DIV').children().children().removeClass('ct-al__modalopen-header');
                        $('#FOOTER_DIV').find('[data-item-id=ct-copyrights]').removeClass('ct-al__modalopen-footer');
                        if(iportal.workspace.metadata.isWidgetCatalogRequired() && iportal.workspace.metadata.isCardMasterScreen() != true)
                        {
                                this.appObj.showAppDock();
                        }
                }
        }

});
CLCR.registerCmp({
        "COMP_TYPE" : "MODAL_WINDOW"
}, canvas.lib.modalwindow);
