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
  
 
 * @description Responsible for rendering a multi widget based on the App metadata..

 */


/**
 * Plugin Description
 * ===============================================================================================
 * Url : https://github.com/samsono/Easy-Responsive-Tabs-to-Accordion
 * 
 * Behaviour : Basically Responsive,Offers the default/Vertical Tab UI
 * for devices like tablets,and turns into an accordion for mobile devices
 * ===============================================================================================
 */
cbx.lib.fluidContainerWidget = Class(cbx.core.Component,{
	widgetMetadata: null,
	activeWidget : null,
	totalCount : null,
	commManager : null,
	activeIndex : null,
	constructor : function(config){
		cbx.lib.fluidContainerWidget.$super.call(this);
		this.widgetMetadata = config.widgetMetadata;
		this.commManager = cbx.core.ws.metadata.getCurrentWorkspace().getWidgetContainer().appMVRegistry;
		this.parentPortlet = config.parentPortlet;
		this.mwMetadata = this.parentPortlet.widgetMetadata;
		this.childApps = this.mwMetadata.CHILD_WIDGETS;
		/*
		 * Needs to be cleaned up
		 * An API needs to be exposed that will do this,as this is being done
		 * more than a few places..
		 * 
		 */
		if (!cbx.isEmpty(this.parentPortlet.widgetConfig.WGT_HEADER_IND) && this.parentPortlet.widgetConfig.WGT_HEADER_IND =='Y') {
			this.appendTo = this.parentPortlet.getItem(2);
		} 
		else{
			this.appendTo = this.parentPortlet.getItem(1);
		}
		this.process();
	},
	/**
	 * 1.Will Create the parent container Div
	 * 2.Will instantiate all the controls required for the plugin to act on the
	 * metadata
	 */
	process: function(){
		var container = this.createContainer();
		this.addItem(container);
		$(container).appendTo(this.appendTo);
		this.initiateControls(container);
	},
	/**
	 * Responsible for the creating the parent container.
	 * @returns
	 */
	createContainer : function(){
		var containerConf ={
				"eleType":"div",
				"id":this.widgetMetadata.WIDGET_ID+"_CONTAINER",
				"class":this.widgetMetadata.WIDGET_ID
		};
		return new cbx.lib.layer(containerConf).getLayer();
	},
	/**
	 * This API will create all the necessary child Containers that are required
	 * for the child widgets to render their data in.
	 * 
	 *  This will also select the first one by default,i.e the active element on
	 *  first view will be the first child
	 * @param parentContainer
	 * 
	 */
	initiateControls : function(parentContainer){
		this.appArray = {};
		var childListConfig = {
				"eleType":"ul",
				"class":"resp-tabs-list"
		};
		var listParent = new cbx.lib.layer(childListConfig).getLayer();
		var childContentConfig = {
				"eleType":"div",
				"id":this.widgetMetadata.WIDGET_ID+"_TAB_PARENT",
				"class":this.widgetMetadata.WIDGET_ID+"_TAB_PARENT resp-tabs-container ct-parent-app"
		};
		var tabParent = new cbx.lib.layer(childContentConfig).getLayer();
		var that = this;
		$(this.childApps).each(function(index){
			var childAppConf = {
					"eleType":"div",
					"id":this.WIDGET_ID+"_CHILD_CONTAINER",
					"class":this.WIDGET_ID+"_CHILD_CONTAINER ct-child-app"
			};
			var childApp = new cbx.lib.layer(childAppConf).getLayer();
			tabParent.appendChild(childApp); 
			//var html = iportal.jsutil.getTextFromBundle(IRB.CUSER,this.WIDGET_DISPLAY_NM,IRB.COMMON);
			var html = iportal.jsutil.getTextFromBundle(this.WIDGET_BUNDLE_KEY,this.WIDGET_DISPLAY_NM,CRB.getFWBundleKey());
			var childClassArray = ["ct-childList",this.WIDGET_ID+"_CHILD_LIST"];
			if(index==0){
				childClassArray.push("ct-initActivate");
			}
			var childClassStr = childClassArray.join().replace(/,/g, " ");
			var childListConf = {
					"eleType":"li",
					"id":this.WIDGET_ID+"_CHILD_LIST",
					"html":html,
					"class":childClassStr
			};
			that.appArray[this.WIDGET_ID] = {
					"container" : childApp,
					"metadata":this
			};
			var childList = new cbx.lib.layer(childListConf).getLayer();
			listParent.appendChild(childList);
		});
		parentContainer.appendChild(listParent);
		parentContainer.appendChild(tabParent);
		this.initiatePlugin(parentContainer);
		/*
		 * Selecting the first child by default
		 */
		var initItem = $(parentContainer).find('.ct-initActivate');
		initItem.trigger('click');
	},
	/**
	 * The API which will instantiate (any) plugin.
	 * It is assumed that,the DOM for the component has been formed before
	 * calling this API,according to the plugin specs
	 * 
	 * @param parentContainer -> The component that will be called on the plugin
	 * @todo : Currently metadata call will go for every switch.Need to fix this
	 */
	initiatePlugin : function(parentContainer){
		var that = this;
		/*
		 * The plug in basically offers 3 types,
		 * 1.Default : tab view
		 * 2.Vertical : more or less our indexed view
		 * 3.Accordion : Mobile compatible accordion view
		 * 
		 * Here we will take the metadata of the parent and map it accordingly
		 * i.e tab ->  'default' else 'vertical'.
		 */
		var configuredType = this.mwMetadata.MULTI_WIDGET_MD['LAYOUT']||"STACK";
		var actualType =  (configuredType && configuredType.toUpperCase() == "TAB")?"default":"vertical";
		$(parentContainer).easyResponsiveTabs({
            type: actualType, //Types: default, vertical, accordion           
            width: 'auto', //auto or any width like 600px
            fit: true,   // 100% fit in a container
            closed : 'accordion',//init-closed with accordion
            activate: function(tab,event) { // Callback function if tab is switched
            	 var $tab = $(this);
            	 var eleType = $tab.prop('tagName');
            	 var eleId = eleType =="LI"?this.id.substr(0,this.id.indexOf("_CHILD_LIST")):
            		 								$tab.next('div').prop('id').substr(0,$tab.next('div').prop('id').indexOf("_CHILD_CONTAINER"))
            	 var baseMeta = that.appArray[eleId]["metadata"];
            	 //var loadingText = String.format(iportal.jsutil.getTextFromBundle(IRB.COMMON,"M_MULTIAPP_LOADING"),$(this).text());
            	 var loadingText = String.format(iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(),"M_MULTIAPP_LOADING",baseMeta.WIDGET_BUNDLE_KEY),$(this).text());
            	 var container = $(that.appendTo).find('#'+baseMeta.WIDGET_ID+"_CHILD_CONTAINER");
            	 container.text(loadingText);
            	 if(baseMeta.WIDGET_ID){
            		 var widgetId=baseMeta.WIDGET_ID;
     				var cachedFlag=false;
     				canvas.metadata.getMetaData("WIDGET_MD",widgetId,function(metadatavalue){
     					if(!cbx.isEmpty(metadatavalue)){
     						try{
     							var cachedMetadata=cbx.decode(metadatavalue);
     							cachedFlag=true;
     							if(!cbx.isEmpty(cachedMetadata)){
 	         						cbx.apply(baseMeta,cachedMetadata);
 	         					}
     							/** Hijacking the metadata here.Any child widget is expected to have 
 	         					 * a header normally if it is being rendered as a singular individual
 	         					 * app.But here,there will be only one header which will be the Multi 
 	         					 * app container's portlet.So the child app need not have the header 
 	         					 * turned off..
 	         					 */
 	         					baseMeta["BLOCK_POSITION"]="CENTER";
 	         					baseMeta["WGT_HEADER_IND"]="N";
 	         					 var config = {
 	         							"widgetConfig" : baseMeta,
 	         							"widgetContainer" : that
 	         					};
 	         					var widgetObj = new cbx.core.Apps(config);	 
 								return;
 								}
 								catch (e) {
 									LOGGER.error('Error while fetching child Widget Metadata  cached data', e);
 									cachedFlag=false;
 								}
     					}
     					if(!cachedFlag){
            		 cbx.ajax({
         				params : {
         					INPUT_ACTION : "GET_WIDGET_MD",
         					INPUT_FUNCTION_CODE : "VSBLTY",
         					INPUT_SUB_PRODUCT : "CUSER",
         					INPUT_PRODUCT : "CUSER",
         					PAGE_CODE_TYPE : "VDF_CODE",
         					PRODUCT_NAME : "CUSER",
         					WIDGET_ID : baseMeta.WIDGET_ID
         				},
         				success : function(metadata){
         					if(!cbx.isEmpty(metadata)){
         						cbx.apply(baseMeta,metadata);
         					}
     	         					
     	         				/** Hijacking the metadata here.Any child widget is expected to have 
         					 * a header normally if it is being rendered as a singular individual
         					 * app.But here,there will be only one header which will be the Multi 
         					 * app container's portlet.So the child app need not have the header 
         					 * turned off..
         					 */
         					baseMeta["BLOCK_POSITION"]="CENTER";
         					baseMeta["WGT_HEADER_IND"]="N";
         					 var config = {
         							"widgetConfig" : baseMeta,
         							"widgetContainer" : that
         					};
         					var widgetObj = new cbx.core.Apps(config);
     	         					setTimeout(function(){
										try{
										canvas.metadata.storeMetaData("WIDGET_MD",{id:widgetId,value:metadata,serverdatetime:metadata.HEADER_VALUE.TXN_PROCESS_DATE_TIME});
         				}
										catch (e) {
											LOGGER.error('Error while storing child Widget Metadata cache', e);
										}
									},100);
     	         					setTimeout(function(){
										try{
										var responseValue=that.mwMetadata;
										if(responseValue.CHILD_WIDGETS && responseValue.CHILD_WIDGETS.length>0){
											responseValue=responseValue.CHILD_WIDGETS;
											for(var CW=0;CW<responseValue.length;CW++){
												if(!cbx.isEmpty(responseValue[CW].WIDGET_ID)){
													if(responseValue[CW].WIDGET_ID!=widgetId)
													cbx.core.multiapp.model.getMultiWidgetBaseMeta(responseValue[CW].WIDGET_ID);	
												}
											}
										}
										}
										catch (e) {
											LOGGER.error('Error while storing Multi Widget child Widget Metadata  cache', e);
										}
									},200);
     	         				}
         			});
     				}
     				},this);
            	 }
            } 
        });
		// Code changed as part of CBX 15.1
		// Implemented code enables on collapse/expand at portlet level
		$(parentContainer).bind("ontabtoggle", function(e,currentTab,tabContainer){
			if(!that.cWidget) return false;
			var value = true;
			if(currentTab.hasClass("resp-tab-active") ){
				var tools = [{"qtip":"expand"}];
			 } else {
				var tools = that.getAppTools(that.cWidget);
				value = false;
			}
			var toolsDiv = that.cWidget.PORTLET.generateTools(tools);
			that.updateParentPortlet(toolsDiv);
			that.cWidget.PORTLET.setCollapsedState(value);
		});
	},
	/**
	 * The API which this class will expose to the Child widgets to get appended.
	 * The child widget(s) will call this API once the DOM for their APP is ready.
	 * 
	 * 1.Get the Item Id of the Portlet trying to get appended.
	 * 2.Select the Container being created for this id(e.g 1_CHILD_CONTAINER)
	 * 3.Append the child Portlet and initiate the App.(Data Call)
	 * 4.If the child has tools,update the Parent portlet with the same.
	 * 
	 * @param item -> The child scope
	 */
	appendChild:function(item){
		LOGGER.info(item);
		var itemId = item.PORTLET.windowid;
		var widgetContainer = $(this.appendTo).find('#'+itemId+"_CHILD_CONTAINER");
		if(widgetContainer){
			widgetContainer.empty();
			widgetContainer.append(item.PORTLET.getItem(0).getLayer()); 
			item.PORTLET.initiateWidget(item.scope);
			widgetContainer.trigger('create');
		}
		var toolsConf = (!cbx.isEmpty(item.PORTLET.viewMD.FLD_TOOLS_LIST)) ? 
				(item.PORTLET.viewMD.FLD_TOOLS_LIST.match(/[,]/)) ? item.PORTLET.viewMD.FLD_TOOLS_LIST.split(",") : item.PORTLET.viewMD.FLD_TOOLS_LIST  : [];
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
		var toolsDiv = item.PORTLET.generateTools(toolsConf);
		}
		this.updateParentPortlet(toolsDiv);
	},
	/**
	 * 1.Check if Parent Portlet has a header,if yes then clean the existing 
	 * tools in the Parent portlet
	 * 2.Replace with the child's Tools if valid
	 */
	updateParentPortlet:function(childTools){
		if(this.parentPortlet.widgetConfig['WGT_HEADER_IND']=="Y"){
			var header = this.parentPortlet.getItem(1);
			LOGGER.info("The parent header",header);
			/**
			 * Have to make it more generic..instead of (a .toolsIcon),we should
			 * add the tools in a container div and reference it with a 
			 * selector class.
			 * ================================
			 * Added temporarily
			 * ================================
			 * 
			 */
			var titleDiv = $(header).find(".app-header-text")
			titleDiv.find('a .toolsIcon').remove();
			if(childTools){
				titleDiv.append(childTools);
			}
		}
	}
	
});
CLCR.registerCmp({"COMP_TYPE":"MULTI_APP","LAYOUT":"STACK"},cbx.lib.fluidContainerWidget);
CLCR.registerCmp({"COMP_TYPE":"MULTI_APP","LAYOUT":"TAB"},cbx.lib.fluidContainerWidget);
CLCR.registerCmp({"COMP_TYPE":"MULTI_APP","LAYOUT":"INDEXED"},cbx.lib.fluidContainerWidget);
CLCR.registerCmp({"COMP_TYPE":"MULTI_APP","LAYOUT":"CARD"},cbx.lib.fluidContainerWidget);
CLCR.registerCmp({"COMP_TYPE":"MULTI_APP","LAYOUT":"EXPLORER"},cbx.lib.fluidContainerWidget);
CLCR.registerCmp({"COMP_TYPE":"MULTI_APP","LAYOUT":"SWITCH"},cbx.lib.fluidContainerWidget);
CLCR.registerCmp({"COMP_TYPE":"MULTI_APP","LAYOUT":"TWO-COLUMN"},cbx.lib.fluidContainerWidget);