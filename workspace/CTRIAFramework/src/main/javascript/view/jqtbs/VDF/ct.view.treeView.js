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
cbx.ns('ct.view');

ct.view.treeView = Class(cbx.core.Component,{
	
	treeData:null,
	
	initialize: function(){
		var me = this.md;
		this.widgetID = me.WIDGET_ID;
		this.listViewMD = me.md.VIEW_MD;
		this.extraParamsHandler = me.extraParamsHandler;
		this.extraParams = me.extraParams;
		this.initClosed= me.initCloaed || false;
		this.context = new canvas.lib.listContext({
			"contextMenu":this.md.md.CONTEXT_MENU_LIST,
			"viewMD": this.listViewMD,
			"parent": this
		});
		this.hashmap = {};
		this.doAjax();
		
		
	},
	doAjax: function(){
		var extraparams = this.prepareInputs();
		var that = this;
		CTLOADMASKMANAGER.initiateLoadMask($(this.elem),iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(),"LOADING")+that.md.WGT_TITLE,$(this.elem));
		cbx.ajax({
			isGlobalMaskReq:false,
			params : extraparams,
			success : function(data){
				that.viewConf.raiseEvent(CWEC.BEFORE_LOAD,data.response.value,that.listViewMD);
				var config = { md: data, tpl: that.rawTmpl };
				LOGGER.log("success");
				that.renderTree(config);
			},
			error : function(){
				LOGGER.log("Caught");
				CTLOADMASKMANAGER.hideLoadMask($(that.elem),$(that.elem));
			}
		});

	},
	prepareInputs: function(){
		var params = {
				"__LISTVIEW_REQUEST" : "Y",
				"PAGE_CODE_TYPE" : 'VDF_CODE',
				"INPUT_ACTION" : "INIT_DATA_ACTION",
				"INPUT_PRODUCT" : this.listViewMD.PRODUCT_CODE,
				"PRODUCT_NAME" : this.listViewMD.PRODUCT_CODE,
				"INPUT_FUNCTION_CODE" : this.listViewMD.FUNCTION_CODE,
				"INPUT_SUB_PRODUCT" : this.listViewMD.SUB_PRODUCT_CODE,
				"WIDGET_ID" : this.widgetID,
				"VIEW_ID" : this.listViewMD.SYSTEM_VIEW_ID
		};
		
		return params;
	},
	
	renderTree : function(config) {
		
		var that = this;
		var viewList = this.md.md.VIEWS_LIST;
		var currView = viewList.filter(function(data,index){
			return data.VIEW_ID == that.md.md.VIEW_MD.VIEW_ID;
		});
		
		var additionalData = config.md.response.value.ADDITIONAL_DATA;
		if(additionalData.hasOwnProperty("ENTL_ERROR") || currView.IS_ENTITLED == "N") {
			var notEntitled_key = this.md.md.VIEW_MD.SYSTEM_VIEW_ID+"_NOT_ENTITLED_WIDGET";
			var text = CRB.getBundleValue(this.md.md.VIEW_MD.FLD_BUNDLE_KEY,notEntitled_key);
        	if(cbx.isEmpty(text)){
        		text = CRB.getFWBundleValue("NOT_ENTITLED_WIDGET");
        	}
			$(this.elem).append(text);
		} else {
			LOGGER.log("config",config);
			var treeData = config.md.response.value.ALL_RECORDS;
			this.getHashmap(treeData[0]);
			var tmpLayer = new ct.lib.tmplLayer('treeView.cttpl',treeData[0]);
			tmpLayer.getTemplate(this.buildTree, this);
		}
	},
	buildTree: function(template, tmpClass){
		var that = this;
		CTLOADMASKMANAGER.hideLoadMask($(this.elem),$(this.elem));
		$(this.elem).append(template);
		if(this.initClosed){
		$(this.elem).find("[data-item-id='ct-tree_toggle']").removeClass('flaticon-collapse')
		.addClass('flaticon-expand').parent().find('ul').slideUp();
		}
		
		$(this.elem).find("[data-item-id='ct-tree_name']").on('click',function (e){
			var value = that.hashmap[$(this).attr('data-item-value')]; 
			that.viewConf.raiseEvent(CWEC.TREE_CLICK,value.text,value.ID,value);
	
		}); 
		$(this.elem).find("[data-item-id='ct-tree_toggle']").on('click',function (e){
			var that=$(this);
			$(this).parent().find('ul').toggle(function(){
				if(that.hasClass('flaticon-expand')){that.removeClass('flaticon-expand').addClass('flaticon-collapse');}
				else{that.removeClass('flaticon-collapse').addClass('flaticon-expand');}
			});
		}); 
		
		//context menu
		
		var menuList = that.context.getContextMenuHtml();
		var contextContainer = $("body").find("#context_menu_container");
		if(contextContainer.length <= 0){
			$("body").append($("<div />").attr("id","context_menu_container").addClass("dropdown ct-dropdown"));
		}
		contextContainer = $("body").find("#context_menu_container");
		$(this.elem).find("[data-item-id='ct-tree_name']").on("contextmenu", function(e){
			$(that.elem).find("ul[data-context=\"submenu\"]").hide();
			e.preventDefault();
			contextContainer.html($(menuList));
			$("body").find("#context_menu_container").show();
			/**
			 * Prepares and sets row identifier
			 * Which will easier to get specific row data
			 */
			identifier=$(this).attr('data-item-value');
			contextContainer.data("identifier", identifier);
			
			/**
			 * Update position of Context menu
			 */
			that.setContextMenu(e,contextContainer);
			contextContainer.children().show();
			/**
			 * Show/Hide sub menus
			 */
			contextContainer.find("li").has("ul").on("mouseover", function(){
					$(this).children("ul").show();
				}).on("mouseout", function(){
					$(this).children("ul").hide();
				});
			
			contextContainer.find("li > a").on("click", function(e){
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();
				var id = $(this).data("context-id"),
				id = $.trim(id),
				identifier = $.trim($("#context_menu_container").data("identifier"));
				var value = that.hashmap[identifier]; 
				that.viewConf.raiseEvent(CWEC.CONTEXT_CLICK,value.text,value.ID,value,id);
			});
		return false;
		});
		
		
		
		
	},
	   setContextMenu: function(e, contextContainer){
	    	var mouseX = e.clientX, 
			mouseY = e.clientY,
			boundsX = $(window).width(),
			boundsY = $(window).height(),
			menuWidth = contextContainer.find('.dropdown-menu').outerWidth(),
			menuHeight = contextContainer.find('.dropdown-menu').outerHeight(),
			top,left;
			if(mouseY + menuHeight > boundsY)	top = mouseY - menuHeight + $(window).scrollTop();
			else top = mouseY + $(window).scrollTop();
			if ((mouseX + menuWidth > boundsX) && ((mouseX - menuWidth) > 0)){
				// Right side alignment fix
				contextContainer.find("li ul").css({ "right": "100%","left": "initial" });
				left = mouseX - menuWidth + $(window).scrollLeft();
			} else {
				// Left side alignment fix
				contextContainer.find("li ul").css({ "left": "100%", "right": "initial" });
				left = mouseX + $(window).scrollLeft();
			} 
			parentOffset = contextContainer.offsetParent().offset();
			left = left - parentOffset.left;
			top = top - parentOffset.top;
			contextContainer.css({
				"left": left + "px",
				"top": top + "px",
				"position": "absolute"
			});
	    },
	getHashmap: function(treeData){
		
		var i=treeData.CHILDREN.length;
		var c=treeData.CHILDREN;
		while(i){
			this.hashmap[c[i-1].text]=c[i-1];
			var ch=c[i-1].CHILDREN;
			if(ch.length>0)
			this.getHashmap(c[i-1]);
			i--;
		}
	}
	
	
	
});
CLCR.registerCmp( { 'COMP_TYPE' : 'APP', 'VIEW_TYPE' : 'TREE' }, ct.view.treeView);