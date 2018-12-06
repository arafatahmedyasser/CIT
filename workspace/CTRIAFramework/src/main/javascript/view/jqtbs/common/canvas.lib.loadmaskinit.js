/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
cbx.ns("canvas.lib");

canvas.lib.maskmgr = function() {

    var MASKSTACK = [];
    var GLOBALMASKON = false;


    return ({
    	
        getMaskStack: function() {
            return MASKSTACK;
        },
        addMaskItem: function(item) {
            MASKSTACK.push(item);
        },
        emptyItems: function() {
            MASKSTACK = [];
        },
        removeMaskItem: function(itemNum) {
            for (var i = 0; i < MASKSTACK.length; i++) {
                if ((MASKSTACK[i].element[0] == itemNum[0])) {
                    MASKSTACK.splice(i, 1);
                }
            }
            return;
        }

    });

}();

canvas.lib.custommaskloader = function() {
	var customGlobalMask;
	var customWidgetMask;
	return ({
		setGlobalLoadTemplate : function(template){
			customGlobalMask=template;
    	},
    	getGlobalLoadTemplate : function(){
    		if(cbx.isEmpty(customGlobalMask)){
    			var mask ='' +
                '<div class="sidebar-bar"></div>' +
                '<div class="sidebar-bar"></div>' +
                '<div class="sidebar-bar"></div>';
    			return mask;
    		}
    		return customGlobalMask;
    	},
    	setWidgetLoadTemplate : function(template){
    		customWidgetMask=template;
    	},
    	getWidgetLoadTemplate : function(){
    		if(cbx.isEmpty(customWidgetMask)){	
    			var mask ='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" >' + '<path opacity=".25" d="M16 0 A16 16 0 0 0 16 32 A16 16 0 0 0 16 0 M16 4 A12 12 0 0 1 16 28 A12 12 0 0 1 16 4"/>' +
                '<path d="M16 0 A16 16 0 0 1 32 16 L28 16 A12 12 0 0 0 16 4z">' +
                '<animateTransform attributeName="transform" type="rotate" from="0 16 16" to="360 16 16" dur="0.8s" repeatCount="indefinite" />' +
                '</path>' +
                '</svg>';
    			return mask;
    		}
    		return customWidgetMask;
    	}
    	
	});
	
}();
canvas.lib.loadmaskinit = Class(cbx.core.Component, {
    constructor: function(scope) {
        if (scope.elementConfig) {
            this.config = scope.config;
            this.element = scope.elementConfig;
            this.data = scope.config.data;
            this.text = scope.text;
            this.iswidgetMaskReq = true;
            this.createMask();
        } else if (scope.config.data && !(canvas.lib.maskmgr.GLOBALMASKON) && ((scope.config.isGlobalMaskReq === undefined) || scope.config.isGlobalMaskReq)) {
            var container = $('#CONTENT_DIV');
            if (container.length > 0 && container.find('[data-item-id=load-mask]').length == 0) {
            	
                container.append('<div data-item-id="load-mask" class="sidebar-load-bar">'+canvas.lib.custommaskloader.getGlobalLoadTemplate()+'</div>');
                canvas.lib.maskmgr.GLOBALMASKON = true;
            }
        }
    },
    createMask: function() {
        var widgetContainer = this.element;
        this.addMask(widgetContainer);

    },
    addMask: function(element) {
        var stack = canvas.lib.maskmgr.getMaskStack();
        var repeatflag = false;
        for (var i = 0; i < stack.length; i++) {
            if ((stack[i].element[0] == element[0])) {
                repeatflag = true;
                stack[i].count++;
                break;
            }
        }
        if (!repeatflag) {
            var item = [];
            item.element = element;
            item.count = 0;
            canvas.lib.maskmgr.addMaskItem(item);
           
            var widgetClass = this.iswidgetMaskReq ? "show" : "hide";
            var maskid = "mask-" + parseInt((Math.random() * 10000), 10);
        	var loadMask ='<div data-item-id="load-mask"  data-mask-id="' + maskid + '" class="overlay-container ' + widgetClass + '">'+
        	'<div class="overlay-loader">'+canvas.lib.custommaskloader.getWidgetLoadTemplate()+
        	'</div></div>';
            element.append(loadMask);
            if (i == 0) {
                this.updateTitleStatus(maskid);
            }
        }

    },
    updateTitleStatus: function(maskid) {
        var container = $('#CONTENT_DIV');
        //        	if(container.find('[data-item-id=load-statusbar]').length==0){
        //        		container.append('<div data-item-id="load-statusbar" class="load-statusbar"></div>');
        //            }
        var statusbar = $('#CONTENT_DIV').find('[data-item-id=load-statusbar]');
        if (!this.iswidgetMaskReq && statusbar.find('div[data-item-id=load-mask]').length == 0) {
            statusbar.append('<div data-item-id="load-mask"  class="overlay-global_spin_container"><div class="overlay-loader">' +
                '<svg class="spinner" width="30px" height="30px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg"><circle class="circle" fill="none" stroke-width="7" stroke-linecap="round" cx="33" cy="33" r="30"></circle></svg>' +
                '</div></div>');
        }
        //        	var text= this.text?this.text:'this is status holder';
        //        	var text= "Loading...";
        //        	var statusHolder='<div data-mask-id="'+maskid+'" class="statusHolder statuspush">'+text+'</div>';
        //        		statusbar.append(statusHolder);
    }
});
CLCR.registerCmp({
    "COMP_TYPE": "GLOBAL_AJAX_LISTENERS",
    "SEQUENCE": "INIT"
}, canvas.lib.loadmaskinit);
