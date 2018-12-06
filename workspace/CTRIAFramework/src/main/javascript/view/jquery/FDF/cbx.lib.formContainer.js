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
 
/**
 * This class contains the form container components specific to jqm FW
 */

cbx.lib.formContainerAppRenderer = Class(cbx.core.Component,{
	/**
	 * The constructor
	 */
	initialize: function(config){
		var me=this;
		this.containerConfig = config;
		this.initFormContainer();
	},
	initFormContainer : function(){
		var config = {};
		config.widgetConfig = {
				"IS_PARENT_IND":"N",
				"WGT_HEADER_IND":"Y",
				"WGT_TITLE":this.title,
				"WIDGET_ID":this.itemId
		}
		config.widgetMD ={};
		var formWrapperClass = CLCR.getCmp({'COMP_TYPE':'PORTLET'});
		var cbxFormWrapper = new formWrapperClass(config);
		var formWrapper = cbxFormWrapper.getWidgetObject();
		$(formWrapper).find('.widget-content').append(this.formObj.getFormView());
		
		var toolsDiv = cbxFormWrapper.generateTools.apply(this,[this.tools]);
		/*var $toolsDiv = $(formWrapper).find("#"+this.itemId+"_TOOLS");
		for(var i=0;i<this.tools.length;i++){
			var toolConfig = {
					"eleType" : "a",
					"href":"",
					"data-role":"button",
					"data-icon":"cbx-"+this.tools[i].id,
					"data-inline":"true",
					"data-align":"right",
					"data-iconpos":"notext",
					"id":this.title+"_"+this.tools[i].id.toUpperCase()
			}
			var tool = new cbx.lib.layer(toolConfig).getLayer();
			var that = this;
			$(tool).on('click',{"counter":i},function(evt){
				var scope = that.tools[evt.data.counter].scope?that.tools[evt.data.counter].scope:that;
				that.tools[evt.data.counter].handler.apply(scope);
			});
			$toolsDiv.attr('align','right');
		}*/
		$(formWrapper).find('.ui-title').html(this.title);
		$(formWrapper).find('.ui-title').append(toolsDiv);
		
		if(this.actionBtns.length>0){ 
			var fieldContainConfig = {
					"eleType" : "div",
					'class' : 'ui-grid-a jqm-formpanel-bbar',
					"id":this.itemId+"_bbar"
			};
			var fieldContain = new cbx.lib.layer(fieldContainConfig).getLayer();
			/*
			 *  Need to test button block positions for more than two buttons
			 */
			var buttonBlockClass = ['ui-block-a','ui-block-b','ui-block-c','ui-block-d'];
			//var bbtnArr = [0,3];
			var btnFlag = false;
			for(var i=0;i<this.actionBtns.length;i++){
				if(!cbx.isEmpty(this.actionBtns[i])){
					if(cbx.isArray(this.actionBtns[i])){
						for(var j=0;j<this.actionBtns[i].length;j++){
							var item = this.actionBtns[i][j];
							if(this.checkXtype(item)){
								item.buttonBlockClass = (btnFlag == true && (this.actionBtns[i].length >= (j+1)))? buttonBlockClass[j+1] : buttonBlockClass[j];
								btnFlag = true;
								this.generateBbarBtn(item, fieldContain);
							}
						}
					}
					else if(cbx.isObject(this.actionBtns[i]) && this.checkXtype(this.actionBtns[i])){
						btnFlag = true;
						this.actionBtns[i].buttonBlockClass = (btnFlag == true && (this.actionBtns.length >= (i+1)))? buttonBlockClass[i+1] : buttonBlockClass[i];
						this.generateBbarBtn(this.actionBtns[i], fieldContain);
					}
				}
			}
		}
		$(formWrapper).append(fieldContain);
		cbx.formcontainer.manager.setActiveFormContainer(this);
		this.addItem(formWrapper);
		var wsCreateCallback = function(wsContainer){
			wsContainer.getLayoutManagerDOM().portal.container.appendChild(formWrapper);
			$(formWrapper).trigger('create');
			doIScroll('CONTENT_DIV','add');
		};
		var wsContainer = cbx.lib.workspacehandler.activateWorkspace("ADDITIONAL_REQUEST",null,wsCreateCallback);
		
	},
	close : function(){
		return;
	},
	checkXtype : function(item){
		return item['xtype'] && item['xtype']==='tbfill'?false:true;
	},
	
	attachAdditionalAttributes:function(){
		return;
	},
	
	generateBbarBtn : function(item,parent){
		var btnContainer = new cbx.lib.layer({
			'eleType' : 'div',
			'class' : item.buttonBlockClass || 'ui-block-a'
		});
		
		var btnConfig = {
				"eleType" : "a",
				"href":"",
				"data-role":"button",
				"id":item.buttonId?this.itemId+"_"
							+item.buttonId.toUpperCase():this.itemId+"_"+item.text.toUpperCase(),
				'data-theme' : (item.btnPosition == 'RIGHT') ? 'jqm-formpanel-bbar-btn' : 'jqm-formpanel-bbar-btn',
				"html":item.text
		};
		var btn = new cbx.lib.layer(btnConfig).getLayer();
		$(btnContainer.getLayer()).append(btn);
		parent.appendChild(btnContainer.getLayer());
		$(btn).on('click',{"item":item},function(evt){		
			var scope = evt.data.item.scope?evt.data.item.scope:evt.data.item;
			evt.data.item.handler(scope);
		});
	
	},
	loadDefaultApp : function(){
		/*var wsContainer = cbx.lib.workspacehandler.activateWorkspace(this.prevWorkspace);*/
		if(window.transactionComplete){
			window.dispatchEvent(window.transactionComplete);
			return true;
		}
		return false;
	}
});
CLCR.registerCmp({'COMP_TYPE':'FORM_CONTAINER','LAYOUT':"APP"}, cbx.lib.formContainerAppRenderer);
cbx.lib.formContainerWindowRenderer = Class(cbx.core.Component,{
	/**
	 * The constructor
	 */
	initialize: function(config){
		var me=this;
		this.containerConfig = config;
		this.initFormContainer();
	},
	initFormContainer : function(){
		var config = {};
		config.widgetConfig = {
				"IS_PARENT_IND":"N",
				"WGT_HEADER_IND":"Y",
				"WGT_TITLE":this.title,
				"WIDGET_ID":this.itemId
		}
		config.widgetMD ={};
		var formWrapperClass = CLCR.getCmp({'COMP_TYPE':'PORTLET'});
		var cbxFormWrapper = new formWrapperClass(config);
		var formWrapper = cbxFormWrapper.getWidgetObject();
		$(formWrapper).find('.widget-content').append(this.formObj.getFormView());
		var $toolsDiv = $(formWrapper).find("#"+this.itemId+"_TOOLS");
		for(var i=0;i<this.tools.length;i++){
			var toolConfig = {
					"eleType" : "a",
					"href":"",
					"data-role":"button",
					"data-icon":"cbx-"+this.tools[i].id,
					"data-inline":"true",
					"data-align":"right",
					"data-iconpos":"notext",
					"id":this.title+"_"+this.tools[i].id.toUpperCase()
			}
			var tool = new cbx.lib.layer(toolConfig).getLayer();
			var that = this;
			$(tool).on('click',{"counter":i},function(evt){
				var scope = that.tools[evt.data.counter].scope?that.tools[evt.data.counter].scope:that;
				that.tools[evt.data.counter].handler.apply(scope);
			});
			$toolsDiv.attr('align','right');
			$toolsDiv.append(tool);
		}
		if(this.actionBtns.length>0){ 
			var fieldContainConfig = {
					"eleType" : "div",
					"data-role":"fieldcontain",
					"id":this.itemId+"_bbar"
			}
			var fieldContain = new cbx.lib.layer(fieldContainConfig).getLayer();
			var bbtnArr = [0,2];
			for(var i=0;i<bbtnArr.length;i++){
				if(!cbx.isEmpty(this.actionBtns[bbtnArr[i]])){
					for(var j=0;j<this.actionBtns[bbtnArr[i]].length;j++){
						var item = this.actionBtns[bbtnArr[i]][j];
						var btnConfig = {
								"eleType" : "a",
								"href":"",
								"data-role":"button",
								"data-inline":"true",
								"id":item.buttonId?this.itemId+"_"
											+item.buttonId.toUpperCase():this.itemId+"_"+item.text.toUpperCase(),
								"html":item.text
						}
						var btn = new cbx.lib.layer(btnConfig).getLayer();
						fieldContain.appendChild(btn);
						$(btn).on('click',{"item":item},function(evt){
							var scope = evt.data.item.scope?evt.data.item.scope:evt.data.item;
							evt.data.item.handler(scope);
						});
					}
				}
			}
		}
		$(formWrapper).append(fieldContain);
		cbx.formcontainer.manager.setActiveFormContainer(this);
		var popupConfig = {
				"eleType": "div",
				'id': 'form_container_panel',
				'data-role':"popup",
				"data-corners":"false",
				"data-theme":"a",
				"data-shadow":"false",
				"data-tolerance":"0,0",
				"data-position-to":"window"
			};
		
		var popup = new cbx.lib.layer(popupConfig).getLayer();
		/*var popupCloseConfig = {
				"eleType": "a",
				'href': '#',
				'data-role':"button",
				"data-theme":"a",
				"data-rel":"back",
				"data-icon":"delete",
				"data-shadow":"false",
				"data-iconpos":"notext",
				"class":"ui-btn-right"
			};
		var popupClose = new cbx.lib.layer(popupCloseConfig).getLayer();*/
		//popup.appendChild(popupClose);
		$(popup).popup()
		popup.appendChild(formWrapper);
		$(popup).popup("open",{"transition":"fade"});
		$(popup).on({
			popupafteropen : function(){
				$(this).trigger('create');
		    	doIScroll('form_container_panel-popup',"add");
		    }
		})
	}
});
CLCR.registerCmp({'COMP_TYPE':'FORM_CONTAINER','LAYOUT':"WINDOW"}, cbx.lib.formContainerWindowRenderer);