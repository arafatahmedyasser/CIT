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
cbx.ns('cbx.lib');

cbx.lib.portlet = Class(cbx.core.Component,{
	windowid: '',
	class_names: '',
	width: '',
	height: '',
	mvConf : null,
	workspaceID: '',
	isCollapsed:false,
	isParentIND: '',
	contentHeight: '',
	constructor: function(config) {
		cbx.lib.portlet.$super.call(this);
		this.widgetConfig = config.widgetConfig;
	
		this.widgetMD = config.widgetMD;
		this.windowid = this.widgetConfig.WIDGET_ID;
		this.widgetMetadata = config.widgetMD;
		this.isParentInd = this.widgetConfig.CONTAINER_FLAG;
		this.viewMD = this.isParentInd=="Y"?config.widgetMD.MULTI_WIDGET_MD:config.widgetMD;
		//if(typeof this.widgetConfig.IS_PARENT_IND !== 'undefined' && this.widgetConfig.IS_PARENT_IND.trim().toUpperCase() === "Y" ) {
		if(typeof this.widgetConfig.CONTAINER_FLAG !== 'undefined' && this.widgetConfig.CONTAINER_FLAG.trim().toUpperCase() === "Y" ) {
			if(!cbx.isEmpty(this.widgetConfig.WIDGET_PXL_HT)) {
				this.height = this.widgetConfig.WIDGET_PXL_HT;
				this.contentHeight = "100%";
			}
			else {
				this.height = "100%";
				this.contentHeight = "100%";
			}
		}
		else {
			if(!cbx.isEmpty(this.widgetConfig.WIDGET_PXL_HT)) {
				this.height = this.widgetConfig.WIDGET_PXL_HT;
			}
			else {
				this.height = "100%";
				this.contentHeight = "100%";
			}
		}
		this.obj = null;
		if (this.isSet(this.widgetConfig.BORDER)) {
			widgetBorder = "#000 solid 1px";
		}
		else {
			widgetBorder = "none";
		}
		this.childrens = [];
		if (this.isModal !== 'undefined' && this.isModal !=='' && this.isModal === 'Y') {
			windowConfig = {
				"eleType": "div",
				id: this.windowid,
				style : {
					width: this.width,
					height: this.height
				},
				"class": "abc",
				"data-role": "dialog"
			};
		}
		else {
			/*  Removed unwanted spaces*/
			windowConfig = {
				"eleType": "div",
				id: this.windowid,
				'class':'app-Container',
				style : {
					width: this.width,
					height: this.height//,
				//	border: widgetBorder//,
					//margin : "5px"
				}
			};
		}
		delete widgetBorder;
		var windowObj = new cbx.lib.layer(windowConfig);
		this.attachListeners(windowObj);
		delete windowConfig;
		this.addItem(windowObj);
		this.createItems();
	}

	,
	attachListeners : function(portlet){
		var that = this;
		$(portlet.getLayer()).bind('remove',function(event){
			/**
			 * Rasing the custom destroy event
			 */
			that.mvConf.raiseEvent(CWEC.CTAPPONDESTROY);	
			/*try{
				if(that.widgetMD.FLD_IS_DATA_CACHED === 'Y' && that.widgetMD.FLD_DATA_CACHE_SCOPE === 'INSTANCE'){
					var requestParams = {};
					requestParams['INPUT_ACTION']='CLEAR_EHCACHE_DATA_ACTION';
					requestParams['PRODUCT_NAME']= 'CUSER';//this.widgetMD.VIEW_MD.PRODUCT_CODE;
					requestParams['INPUT_SUB_PRODUCT']= 'CUSER';//this.widgetMD.VIEW_MD.SUB_PRODUCT_CODE;
					requestParams['INPUT_FUNCTION_CODE']='VSBLTY';//this.widgetMD.VIEW_MD.FUNCTION_CODE;
					requestParams['WIDGET_ID']= that.windowid;
					requestParams['VIEW_ID']= that.widgetMD.VIEW_ID;
					requestParams['PAGE_CODE_TYPE']='VDF_CODE';
					iportal.jsutil.executeClearEhCacheHandler(requestParams);
				}
			}catch(e) {
				LOGGER.info("problem in data cache clear process in onRemove() of multiview : ");
			}*/
			$(this).unbind();
			$(this)[0].parentCt.destroy();
		});
	
	},
	initiateWidget : function(scope){
		
		if(this.isParentInd =="Y"){
			scope.requestMultiAppContainer(this.viewMD);
		}
		else{
			//scope.requestViewMD(this.widgetMD);
			scope.requestViewMD(this.viewMD);
		}
	
	},
	attachAdditionalAttributes : function(tool){
		var attr = {};
		if(!cbx.isEmpty(tool)){
			
			//tool = tool.toLowerCase(tool);
			tool = tool.toString().toLowerCase();
			
			switch (tool){
				case 'refresh':
					attr = {
							'eventParams' : { 'md' : this.widgetMD, 'widgetID' : this.windowid, 'workspaceID' : this.workspaceID,'appEvents':this.mvConf.appEventRegistry }
				};
				break;
				case 'help':
					attr = {
						'type': 'a',
						'data-rel': 'dialog',
						'data-widget-rel' : this.windowid,
						'eventParams' : this,
						'data-theme' : 'c',
						'href':'#HELP_POPUP'		// ID Mapped to popup window
					};
				break;
				case 'pdf':
					attr = { 'eventParams' : { 'md' : this.widgetMD, 'widgetID' : this.windowid }	};
				break;
				case 'excel':
					attr = { 'eventParams' : { 'md' : this.widgetMD, 'widgetID' : this.windowid }	};
				break;
				
				case 'collapse':
					attr = { 'eventParams' : { 'md' : this.widgetMD, 'widgetID' : this.windowid, 'layoutID' : $(this.items[1]).parents('#stack-container').parent().attr('id') }	};
				break;
				case 'expand':
					attr = { 'eventParams' : { 'md' : this.widgetMD, 'widgetID' : this.windowid, 'layoutID' : $(this.items[1]).parents('#stack-container').parent().attr('id') }	};
				break;
				
				case 'csv':
					attr = { 'eventParams' : { 'md' : this.widgetMD, 'widgetID' : this.windowid }	};
				break;
				case 'jpgexport':
					attr = { 'eventParams' : { 'md' : this.widgetMD, 'widgetID' : this.windowid }	};
				break;
				case 'print':
					attr = { 'eventParams' : { 'widgetID' : this.windowid  } };
				break;
			}
		}
		return attr;
	},
	createItems: function() {
		var header;
		var title;
		var window;
		var windowConfig;
		var widgetContent; 
		var widgetFooter;

		var headerInd = this.widgetConfig.WGT_HEADER_IND||this.widgetConfig.WIDGET_HEADER_IND;
		var wgtTitle = this.widgetConfig.WGT_DISPLAY_NM||this.widgetConfig.WGT_TITLE||"";
		var bundleKey = this.isParentInd=="Y"?this.viewMD['WIDGET_BUNDLE_KEY']:this.viewMD['FLD_BUNDLE_KEY'];
		// Moved code inside API
		//if(this.widgetConfig.WGT_HEADER_IND.trim() ===  'Y' &&  this.widgetConfig.WGT_TITLE.trim() !== '')
		if( headerInd.trim() ===  'Y' &&  wgtTitle.trim() !== '')
		
		{
			var hConfig = {
				"eleType"	: "div",
				"data-role"	: "header",
				"class"		: "ui-bar ui-bar-a ui-header app-header app-header-theme",
				"id":this.widgetConfig.WIDGET_ID+"_HEADER"
			};
			
			header = new cbx.lib.layer(hConfig);
			delete hConfig;
			var tConfig = {
				"eleType": "div",
				"class": "hConfigTitle ui-title app-header-body" 
			};
			/*var text =this.widgetMD.VIEW_DISPLAY_NM?iportal.jsutil.
					getTextFromBundle(this.widgetMD.FLD_BUNDLE_KEY,this.widgetMD.VIEW_DISPLAY_NM,CRB.getFWBundleKey()):iportal.jsutil.
					getTextFromBundle(this.widgetMD.FLD_BUNDLE_KEY,this.widgetConfig.WGT_TITLE,CRB.getFWBundleKey());
			if(text ===this.widgetMD.VIEW_DISPLAY_NM || text ===this.widgetConfig.WGT_TITLE ){
				text="";
			}*/
			
			var text =this.viewMD.VIEW_DISPLAY_NM?iportal.jsutil.
						getTextFromBundle(bundleKey,this.viewMD.VIEW_DISPLAY_NM,CRB.getFWBundleKey()):iportal.jsutil.
						getTextFromBundle(bundleKey,wgtTitle,CRB.getFWBundleKey());
				/*if(text ===this.viewMD.VIEW_DISPLAY_NM || text ===wgtTitle ){
					text="";
				}*/
			
			title = new cbx.lib.layer(tConfig);
			var titleConfig = {
				"eleType": "div",
				"class" : "tConfigTitle app-header-text", 
				html: text
			};
			var titleConfigObj = new cbx.lib.layer(titleConfig).getLayer();
			title.addLayer(titleConfigObj);
			
			var toolsConf = (!cbx.isEmpty(this.widgetMD.FLD_TOOLS_LIST)) ? 
					(this.widgetMD.FLD_TOOLS_LIST.match(/[,]/)) ? this.widgetMD.FLD_TOOLS_LIST.split(",") : [this.widgetMD.FLD_TOOLS_LIST]  : [];
			
			LOGGER.info('toolsConf ',toolsConf)
			if(cbx.isArray(toolsConf) && toolsConf.length>0)
			{
			if(toolsConf && cbx.isArray(toolsConf)){
				var apiArr=[];
				for(var i=0;i<toolsConf.length;i++){
					var obj = {
							"qtip":toolsConf[i]
					};
					apiArr.push(obj);
				}
				toolsConf = apiArr;
			}
			var toolsDiv = this.generateTools(toolsConf);
			title.addLayer(toolsDiv);
			}
			
			header.addLayer(title.getLayer());
			this.addItem(header.getLayer());
			this.getItem(0).addLayer(header.getLayer());
		}
		var widgetContentConfig = {
				"eleType": "div",
				"class" : "widget-content",
				style: {
					height: this.contentHeight
				}
		};
		var widgetContentObj = new cbx.lib.layer(widgetContentConfig); 
		delete widgetContentConfig;
		/* var widgetViewContentConfig = {
			"eleType":"div",
			"class":"widget-view-content"
		};
		var widgetviewContentObj = new cbx.lib.layer(widgetViewContentConfig).getLayer(); 
		widgetContentObj.addLayer(widgetviewContentObj); 
		delete widgetViewContentConfig; */		
		this.addItem(widgetContentObj.getLayer());
		this.getItem(0).addLayer(widgetContentObj.getLayer());
		if(!cbx.isEmpty(this.widgetMD.FLD_BBAR_BUTTONS)) {
			widgetFotter = this.addBottomBarButtons(this.widgetMD.FLD_BBAR_BUTTONS);
			this.addItem(widgetFotter.getLayer());
			this.getItem(0).addLayer(widgetFotter.getLayer());  
		}
	
	},
	generateTools : function(toolsConf){
		/*
		 * Options :
		 * 	toolTipMenu : Show's tools in popup 
		 * 	inline : show's as normal
		 */
		
		var btnDirection = "ui-btn-right toolsIcon";	
		if(true == iportal.preferences.isLangDirectionRTL()){
			btnDirection = "ui-btn-left toolsIcon";
		}
		var linearFlag = !cbx.isEmpty(iportal.systempreferences.getToolsAsLinearFlag())?iportal.systempreferences.getToolsAsLinearFlag():false;
		/* simplify widget tool handlers */
		if(toolsConf.length > 0){
			if(!linearFlag){
		
		var toolbarConfig = {
				"eleType": "a",
				"href":"",
				//"class" : linearFlag == 'N' ? "toolsIcon" : "widget-tools",
				"data-role":"button",
				"data-icon":!linearFlag? "toolsIcon" : "widget-tools",
				'data-rel' :!linearFlag? "popup" : "",
				'data-inline':"true",
				"data-iconpos":"notext",
				'data-position-to':"origin",
				"class":btnDirection
		};
		
			
			var toolbarConfigObj = new cbx.lib.layer(toolbarConfig);
			
					var tools = $(toolbarConfigObj.getLayer());
					var _that = this;
					tools.on('click',function(evt){
						var opt = {
							data : toolsConf,
							scope : _that,
							evt:evt
						};
						$.init.tooltipMenu(opt);
					});
				return toolbarConfigObj.getLayer();
				} else {
				var toolbarConfigObj = $("<div />").addClass("linearIconsHolder");
					for(var i=0; i<toolsConf.length; i++){
						var additionalParam = this.attachAdditionalAttributes(toolsConf[i]);
					var toolsHandler = toolsConf[i].qtip+'Handler';
						widgetListener.registerToolsHandler(toolsHandler);
					var additionalParam = (!cbx.isEmpty(additionalParam))?additionalParam:{ 
												"md" : this.widgetMD,
												"widgetID":this.windowid,
												"layoutID":$("div#"+this.windowid).parents('#stack-container').parent().attr('id')
											};
					toolbarConfigObj.append(this.createHeaderIconElement('mobi-'+toolsConf[i].qtip,toolsHandler,this.widgetMD.VIEW_ID, additionalParam));
					}
				return toolbarConfigObj.get(0);
				}
			}
	},
	
	addBottomBarButtons: function (bBarConfig) {
		var rb = CRB.getFWBundleKey();
		/* Commented as on 03-Sep-2013, because B-Bar buttons are part of view not Widget*/
		
		/* var bottombarConfig;
		var bottombarObj;
		var class_name = '';
		bottombarConfig = {
			"eleType": "div",
			"class": "bottombar-buttons widget-footer"
		};
		bottombarObj = new cbx.lib.layer(bottombarConfig);
		this.listListeners = ['fundTSubmit'];
		this.registerListener('fundTSubmit', this.myfundTransferButtonHandleClick);
		for (button = 0; button < buttomBarConfig.length ; button++ ) {
			var buttonConfig;
			var buttonObj;
			if(buttomBarConfig[button]['POSITION'].trim().toUpperCase() === 'LEFT') {
				class_name = "a-button-left-110";
			}
			else if (buttomBarConfig[button]['POSITION'].trim().toUpperCase() === 'RIGHT') {
				class_name = "a-button-right-110";
			}
			else {
				class_name = "a-button-center-110";
			}
			buttonConfig = {
				"eleType": "div",
				"data-role": "button",
				"data-mini": "true",
				"data-inline": "true",
				"listListener": this.listListeners[0],
				"class": class_name,
				id : buttomBarConfig[button]['BBAR_BTN_ID'],
				html: buttomBarConfig[button]['BTN_DISPLAY_NM'] 
			};
			buttonObj = new cbx.lib.layer(buttonConfig);
			bottombarObj.addLayer(buttonObj.getLayer());
			JQMT.addItem('cbx-button',buttomBarConfig[button]['BBAR_BTN_ID']);
		}
		var that = this;				
		var tempButton = bottombarObj.getLayer();
		tempButton.onclick = function() {					
			that.raiseEvent(that.listListeners[0]);						
		};
				
		bottombarObj.setLayer(tempButton);
		JQMT.triggerItems();
		return bottombarObj.getLayer(); */
		/*
		"NEGATIVE_BUTTONS": [
			{
				"FLD_BTN_DISPLAY_NM": "LBL_BENL6_NEWBENE",
				"FLD_BBAR_BTN_ID": "BENL6_NEWBENE",
				"FLD_WIDGET_ID": "WGT_BENE_LIST"
			}
        ],
		"POSITIVE_BUTTONS": [
		
		]*/
		
		bottombarConfig = {
			"eleType": "div",
			"class": "bottombar-buttons app-footer ui-bar ui-bar-b ui-footer app-footer-theme",
		/*	"style":{
				"height":"30px"
			},*/
			"id":this.widgetConfig.WIDGET_ID+"_FOOTER"
		};
		var bottombarObj = new cbx.lib.layer(bottombarConfig);
			
		var leftbtnDirection = "bbarLeftCls";	
		var rightbtnDirection = "bbarRightCls";	
		
		if(true == iportal.preferences.isLangDirectionRTL()){
			leftbtnDirection = "bbarRightCls";
			rightbtnDirection = "bbarLeftCls";
		}
		var leftBottombarConfig = {
				"eleType":"div",
				"class":leftbtnDirection
		};
		var leftBottombarConfigObj = new cbx.lib.layer(leftBottombarConfig);
		
		var rightBottombarConfig = {
				"eleType":"div",
				"class":rightbtnDirection
		};
		var rightBottombarConfigObj = new cbx.lib.layer(rightBottombarConfig);
		
		
		
		//var negativeButtons = bBarConfig.NEGATIVE_BUTTONS;
	    //	var possitiveButtons = bBarConfig.POSITIVE_BUTTONS;
		var bBarConf=IMM.getViewDefinition(this.widgetConfig.WIDGET_ID).getBBarButtons();
		var negativeButtons =  bBarConf.NEGATIVE_BUTTONS;
		var possitiveButtons  = bBarConf.POSITIVE_BUTTONS;
		
		
		if(typeof negativeButtons !== 'undefined' && negativeButtons.length > 0 ) {
			for (var i = 0; i < negativeButtons.length; i++) {
				var btnId = negativeButtons[i].FLD_BBAR_BTN_ID;
				buttonConfig = {
					"eleType": "a",
					"href":"",
					"data-role":"button",
					"data-theme":"jqm-bbar-negbtn",
					"id" : btnId,
					"html": iportal.jsutil.getTextFromBundle(rb,negativeButtons[i].FLD_BTN_DISPLAY_NM),
					"class":"bbar-btn"
				};
				var buttonObj = new cbx.lib.layer(buttonConfig);
				var obj = {
						"id":this.windowid
				};
				rightBottombarConfigObj.addLayer(buttonObj.getLayer());
				this.handleBBarButton($(buttonObj.getLayer()), obj);
			}
		}
		if(typeof possitiveButtons !== 'undefined' && possitiveButtons.length > 0 ) { 
			/* For positive buttons*/
			for (var i = 0; i < possitiveButtons.length; i++) {
				var liConfig = {
						"eleType": "li"
						/*"class": "bottombar-buttons widget-footer"*/
				};
				var btnId = possitiveButtons[i].FLD_BBAR_BTN_ID;
				var li = new cbx.lib.layer(liConfig);
				buttonConfig = {
					"eleType": "a",
					"href":"",
					"data-role":"button",
					"data-theme":"jqm-bbar-posbtn",
					"id" : btnId,
					"html": iportal.jsutil.getTextFromBundle(rb,possitiveButtons[i].FLD_BTN_DISPLAY_NM),
					"class":"bbar-btn"
				};
				var buttonObj = new cbx.lib.layer(buttonConfig);
				leftBottombarConfigObj.addLayer(buttonObj.getLayer());
				this.handleBBarButton($(buttonObj.getLayer()), {
					"id":this.windowid
				})
			}
		}
		bottombarObj.addLayer(leftBottombarConfigObj.getLayer());
		bottombarObj.addLayer(rightBottombarConfigObj.getLayer());
		return bottombarObj;
	},
	getWidgetObject: function() {
		return this.getItem(0).getLayer();
	},
	
	setCollapsedState:function(isColl){
		this.isCollapsed = isColl;		
	},
	
	/*  Additional attributes */
	createHeaderIconElement: function(imagePath, listeners, VIEW_ID, additionalAttr) {
		var toolbarIconConfig;
		var toolbarIconObj;
		var iconConfig;
		var iconObj;
		additionalAttr = additionalAttr || {};

		var anchor = $("<a />").attr({
			"href":"javascript:void(0)",
			"id":VIEW_ID,
			"class"		: "widget-header-div"
		});

		var span = $("<span />").attr({
			"class": imagePath + " header-toolbar-icons"
		});
		anchor.append(span);
		var _this = this;
		anchor.on("click", function(e){
			var span = $(this).find("span");
			if(span.hasClass("mobi-collapse")){
				span.removeClass("mobi-collapse").addClass("mobi-expand");
			} else span.removeClass("mobi-expand").addClass("mobi-collapse");
			var params = { 
				"md" : _this.widgetMD,
				"widgetID":_this.windowid,
				"layoutID":$("div#"+_this.windowid).parents('#stack-container').parent().attr('id')
		};
			widgetListener[listeners].apply(params,[params]);
		});
		return anchor.get(0);
	},
	isSet: function(param) {
		if(typeof param !== 'undefined' && param.trim() !== '' && param.trim().toUpperCase() === 'Y') {
			return true;
		} else {
			return false;
		}
	},
	setViewObject: function(formView){		
		this.formView = formView;
	},
	handleBBarButton: function(buttonObj,obj) {
		buttonObj.on('click',obj,function(evt){
			var id = evt.data.id;
			if(CWEH.getHandler(id,CWEC.BBUT_CLICK)){
				CWEH.getHandler(id,CWEC.BBUT_CLICK)(this.id);
			}
			//this.handleBBarButton();
		});
	},
	getViewObj :function(){
		return this.mvConf?this.mvConf:null;
	}
});

CLCR.registerCmp({'COMP_TYPE':'PORTLET'}, cbx.lib.portlet);