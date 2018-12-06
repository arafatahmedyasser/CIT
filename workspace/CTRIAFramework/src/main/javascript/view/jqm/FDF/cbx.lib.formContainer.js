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
	defaultOrder : "PN",
	preferredOrder : null,
	acceptedChars : {
		"P":"POSITIVE",
		"N":"NEGATIVE",
		":":"TABSPACE"
	},
	initialize: function(config){
		var me=this;
		this.containerConfig = config;
		var preferredOrder = $.trim(iportal.preferences.getActionButtonOrder());
		preferredOrder = this.getValidatedOrder(preferredOrder);
		this.formContainerId = this.itemId.split("wrapper-owner_")[1];
		this.actionButtonTemplate = this.constructTemplate(preferredOrder);
		this.initFormContainer();
	},
	/**
	 * The API that will validate the character configuration for order
	 * 1.The configuration String has to have P and N as a mandate
	 * 2.Will take only the first three characters..
	 * 3.The configuration String cannot have repetition of characters and can have only accepted characters
	 * 	P,N,:
	 */
	getValidatedOrder : function(orderConf){
		var validatedOrder;
		if(cbx.isEmpty(orderConf) || orderConf.indexOf('P') == -1 || orderConf.indexOf('N')== -1){
			validatedOrder = this.defaultOrder;
			LOGGER.error("ACTION_BTN_ORDER must contain atleast P and N.."
					+ "Falling back to the default property (PN)");
		}
		else{
			orderConf = orderConf.substring(0,3).toUpperCase();
			var configArray = [];
			var validationFlag = true;
			var that = this;
		
			$.each(orderConf.split(""),function(i,character){
				if($.inArray(character,configArray) == -1 && (character in that.acceptedChars)){
					configArray.push(character);
				}
		
				else{
					validationFlag = false;
					LOGGER.error("A Configuration error has been caught in ACTION_BTN_ORDER property"
									+ "Falling back to the default property (PN)");
				}
			})
			validatedOrder = validationFlag?configArray.join(""):this.defaultOrder;
		}
		return validatedOrder;
	},
	/**
	 * The API which will construct the template for a container.
	 * The template can have p,n,: configurations is all possible ways.
	 * 
	 * p - Positive Container
	 * n - negative Container
	 * : - Container for Tab space 
	 * @param orderStr -> The default/configured order of Action Btns
	 * 
	 */
	constructTemplate : function(orderStr){
		var templateConf = {
				"eleType":"div",
				'class' : 'jqm-formpanel-bbar',
				"id":this.itemId+"_bbar"
		};
		var parentDiv = new cbx.lib.layer(templateConf);
		var tplArray = orderStr.split(""); 
		var that = this;
	
		$.each(tplArray,function(i,character){
			var type = that.acceptedChars[character];
	   
			var childContainerConf = {
					"eleType":"div",
					"class":type+"-ctCls ct-action-btn-container",
					"name":type,
					"id":that.itemId+"_"+type+"_CONTAINER"
			};
			if(type=="TABSPACE"){
				childContainerConf['html']="&nbsp;";
			}
			var childContainer = new cbx.lib.layer(childContainerConf).getLayer();
			parentDiv.addLayer(childContainer);
		});
		return parentDiv;
	},
	/**
	 * Initializes the form container
	 */
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
		
		var toolsConf = $.grep(this.tools,function(obj){
			return obj['id']!='close';
		});
		
		var toolsDiv = cbx.isArray(toolsConf)&&toolsConf.length>0 ? cbxFormWrapper.generateTools.apply(this,[toolsConf]):null;
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
		$(formWrapper).find('.ui-title').html('<span class="formcontainerTitle">'+this.title+'</span>');
		if(toolsDiv){
			$(formWrapper).find('.ui-title').append(toolsDiv);
		}
		
		if(this.actionBtns.length>0){ 
		//Moved this logic to create template API
			/*
			 * Need to test button block positions for more than two buttons
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
								this.generateBbarBtn(item);
							}
						}
					}
					else if(cbx.isObject(this.actionBtns[i]) && this.checkXtype(this.actionBtns[i])){
						btnFlag = true;
						this.actionBtns[i].buttonBlockClass = (btnFlag == true && (this.actionBtns.length >= (i+1)))? buttonBlockClass[i+1] : buttonBlockClass[i];
						this.generateBbarBtn(this.actionBtns[i]);
					}
				}
			}
		}
		$(formWrapper).append(this.actionButtonTemplate.getLayer());
		cbx.formcontainer.manager.setActiveFormContainer(this);
		this.addItem(formWrapper);
		var wsCreateCallback = function(wsContainer){
			wsContainer.getLayoutManagerDOM().portal.container.appendChild(formWrapper);
			$(formWrapper).trigger('create');
			doIScroll('CONTENT_DIV','refresh');
		};
		var wsContainer = cbx.lib.workspacehandler.activateWorkspace("ADDITIONAL_REQUEST",null,wsCreateCallback,null,false);
		
	},
	close : function(){
		window.dispatchEvent(window.transactionComplete);
	},
	checkXtype : function(item){
		return item['xtype'] && item['xtype']==='tbfill'?false:true;
	},
	
	attachAdditionalAttributes:function(){
		return;
	},

	/**
	 * Responsible for generating a button based on Form container MD.
	 * Will determine the type of the button (POS/NEG),generate the 
	 * button and append to the corresponding template container.
	 * 
	 */
	generateBbarBtn : function(item){
		var itemType = item.cls=="portal_neg_btn"?"NEGATIVE":"POSITIVE";
		var tplContainer = $(this.actionButtonTemplate.getLayer()).find("[name="+itemType+"]");
		var btnClass = (item.itemId?item.itemId.toUpperCase(): item.text.toUpperCase())+"-cls";
		var btnConf = new cbx.lib.layer({
			'eleType' : 'div',
			'class' :   btnClass+" ct-actionbtn-subcontainer"
		});
		var btnContainer = $(btnConf.getLayer());
		tplContainer.append(btnContainer);
		/**
		 * Form manager needs to send this information
		 * Temporarily added to identify the type of item
		 */
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
		btnContainer.append(btn);
		$(btn).on('click',{"item":item},function(evt){		
			$(this).trigger('focus');
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
	},
	setTitle:function(title){
		var header=$(this.items[0]).find('.formcontainerTitle');
		if(header.size()>0){
			header.html(title);
		}
	}
});
CLCR.registerCmp({'COMP_TYPE':'FORM_CONTAINER','LAYOUT':"APP"}, cbx.lib.formContainerAppRenderer);
CLCR.registerCmp({'COMP_TYPE':'FORM_CONTAINER','LAYOUT':"WINDOW"}, cbx.lib.formContainerAppRenderer);
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
							$(this).trigger('focus');
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
		
		// The Window is not opening for the second time so mapping the app for the window render type also for the mobile
		$(popup).on({
			popupafterclose : function(){
				try{
					this.innerHTML = "";
					popup.remove();
				}catch(e){
					
				}
		    }
		})
	}
});