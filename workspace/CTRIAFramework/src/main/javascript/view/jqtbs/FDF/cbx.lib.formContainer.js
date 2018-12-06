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
		
		this.containerConfig = config;
		this.initFormContainer();
	},
	initFormContainer : function(){
		var me=this;
		var container = $(this.widget.elem);
		container.find('[data-item-id=portlet-main-content]').append(this.formObj.getFormView());
		this.fcToolsConfig = {};
		if(!cbx.isEmpty(this.tools)){
			var toolsDiv = $('<div class="pull-right" data-item-id="portlet_toolBar" class="row hidden"></div>');
			toolsDiv.append('<ul class="list-inline ct-no-margin" data-item-id="tools-inline"></ul>')
		for(var i=0;i<this.tools.length;i++){
				var tool = this.tools[i];
	            switch (tool.id.toUpperCase()) {
	            	case 'HELP':
	                { /** Enable help app tool */
	            		toolsDiv.find('[data-item-id=tools-inline]').append('<li class="ct-app__tools-help-con"></li>');
	            		var helpTool = '<a data-item-id="portlet_helpTool" class="ct-app__tools flaticon-info" href="javascript:void(0)" data-toggle="tooltip" data-original-title="'+tool.qtip+'"> </a>';
	        			toolsDiv.find('.ct-app__tools-help-con').append(helpTool);
	        			this.fcToolsConfig['portlet_helpTool']=tool;
	                    break;
			}
	            	case 'EXPORT':
	                { /** Enable pdf app tool */
	            		toolsDiv.find('[data-item-id=tools-inline]').append('<li class="ct-app__tools-pdf-con"></li>');
	            		var exportTool = '<a data-item-id="portlet_exportTool" class="ct-app__tools flaticon-pdf" href="javascript:void(0)" data-toggle="tooltip" data-original-title="'+tool.qtip+'"> </a>';
	        			toolsDiv.find('.ct-app__tools-pdf-con').append(exportTool);
	        			this.fcToolsConfig['portlet_exportTool']=tool;
	                    break;
	                }
	            	case 'PRINT':
	                { /** Enable print app tool */
	            		toolsDiv.find('[data-item-id=tools-inline]').append('<li class="ct-app__tools-print-con"></li>');
	            		var printTool = '<a data-item-id="portlet_printTool" class="ct-app__tools flaticon-print" href="javascript:void(0)" data-toggle="tooltip" data-original-title="'+tool.qtip+'"> </a>';
	        			toolsDiv.find('.ct-app__tools-print-con').append(printTool);
	        			this.fcToolsConfig['portlet_printTool']=tool;
	        			break;
	                }
	            }
	            $(toolsDiv).find('.ct-app__tools').addClass('flaticon_widget_header');
			}
			$(toolsDiv).find('.ct-app__tools').on('click',$.proxy(function(evt){
				switch($(evt.currentTarget).attr('data-item-id')){
					case 'portlet_helpTool': 
										{
										this.fcToolsConfig['portlet_helpTool'].handler();
										break;
										}
					case 'portlet_exportTool':
										{
										this.fcToolsConfig['portlet_exportTool'].handler();
										break;	
							}
					case 'portlet_printTool': 
										{
										this.fcToolsConfig['portlet_printTool'].handler();
										break;
						}
					}
    		},this));
			if(iportal.workspace.metadata.isWidgetCatalogRequired()){
				toolsDiv.find('[data-item-id=tools-inline]').append('<li><span data-item-id="portlet_closeTool" class="flaticon-close flaticon_widget_header" data-toggle="tooltip" data-placement="top" data-original-title="Close"></span></li>');
				$(toolsDiv).find('[data-item-id=portlet_closeTool]').unbind("click").bind('click', me, function(e) {
		        	me.widget.closePortlet(this);
		        });
					}
				}
		var title = $(container).find('[data-item-id=ct-portlet__title]').clone();
		$(title).find('[data-item-id="portlet-title"]').html(this.title);
		$(container).find('.ct-app__header-container').empty();
		$(container).find('.ct-app__header-container').append(title).append(toolsDiv).append('<div class="clearfix"></div>');
		this.fcbuttonConfig ={};
		this['btnClass']="btn-default";
		/**Massage form container action buttons meta data*/
		if(this.actionBtns!=undefined || this.actionBtns.length!=0){	
			var leftBtnCount=0; var leftBtnsList=[];
			var rightBtnCount=0; var rightBtnsList=[];
			if(!cbx.isEmpty(this.actionBtns[0]) && this.actionBtns[0].length!=0){
				/**Set the class names and the display name from resource bundle for Positive action buttons*/
				var actionBtn;
				for(var posInd=0 ; posInd < this.actionBtns[0].length; posInd++){
					actionBtn=this.actionBtns[0][posInd];
					actionBtn['FLD_BBAR_BTN_ID']=actionBtn.buttonId;
					actionBtn['FLD_BTN_DISPLAY_NM']=actionBtn.text;	
					actionBtn['BBAR_CLASS']='btn btn-default ct_btn '+actionBtn.buttonId;
					actionBtn.btnPosition==='LEFT' ? leftBtnsList[leftBtnCount++]=actionBtn : rightBtnsList[rightBtnCount++]=actionBtn;
					this.fcbuttonConfig[actionBtn.buttonId] = actionBtn;
			}
			}//End if
			if(!cbx.isEmpty(this.actionBtns[2]) && this.actionBtns[2].length!=0){
				/**Set the class names and the display name from resource bundle for negative action buttons*/
				var actionBtn;
				for(var posInd=0 ; posInd < this.actionBtns[2].length; posInd++){
					actionBtn=this.actionBtns[2][posInd];
					actionBtn['FLD_BBAR_BTN_ID']=actionBtn.buttonId;
					actionBtn['FLD_BTN_DISPLAY_NM']=actionBtn.text;	
					actionBtn['BBAR_CLASS']='btn btn-default ct_btn_neg '+actionBtn.buttonId;
					actionBtn.btnPosition==='RIGHT' ? rightBtnsList[rightBtnCount++]=actionBtn : leftBtnsList[leftBtnCount++]=actionBtn;
					this.fcbuttonConfig[actionBtn.buttonId] = actionBtn;
		}
			}//End if
			this.LEFT_BBAR_BUTTONS=leftBtnsList;
			this.RIGHT_BBAR_BUTTONS=rightBtnsList;
		}//End if (BBAR buttons undefined)
		var tmpFormContainer = new ct.lib.tmplLayer('portletFooterTemplate.cttpl', this);
		this.container = container;
		tmpFormContainer.getTemplate(this.appendFooter, this);
		cbx.formcontainer.manager.setActiveFormContainer(this);
		this.addItem(container);
		/*var wsCreateCallback = function(wsContainer){
			wsContainer.getLayoutManagerDOM().portal.container.appendChild(container);
			$(container).trigger('create');
			doIScroll('CONTENT_DIV','add');
		};
		var wsContainer = cbx.lib.workspacehandler.activateWorkspace("ADDITIONAL_REQUEST",null,wsCreateCallback);
		*/
	},
	appendFooter : function(footerTemplate){
		var portlet= $(this.container).find('[data-item-id=portlet]');
		portlet.append('<div data-item-id="portlet-footer" class="panel-footer ct-model__panel-footer"></div>');
		var portletFooterDiv= portlet.find('[data-item-id=portlet-footer]')
		portletFooterDiv.append(footerTemplate);
		this.setAppHandlers();
	},
	close : function(){
		return;
	},
	
	attachAdditionalAttributes:function(){
		return;
	},
	
	setAppHandlers : function(){
		$(this.container).find('[system_btn_ind]').on('click',$.proxy(function(evt){
			var buttonId = $(evt.currentTarget).attr('data-item-id');
			this.fcbuttonConfig[buttonId].handler(this.fcbuttonConfig[buttonId]);
		},this));
		
	
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
	initFormContainer : function ()
	{
		cbx.formcontainer.manager.setActiveFormContainer(this);
		this["windowId_subString"]="formCont";
		this.fcToolsConfig={};
		/**Massage tools meta data*/
		for(var index=0; index < this.tools.length; index++){
			switch(this.tools[index].id){
				case "help":{
					  			this["helpReqd"]=true;
					  			this['TOOL_TIPS_HELP']=this.tools[index].qtip;
					  			this.fcToolsConfig['formCont_helpTool']=this.tools[index];
					  			break;
				}
				case "export":{
								this["exportReqd"]=true;
								this['TOOL_TIPS_EXPORT']=this.tools[index].qtip;
								this.fcToolsConfig['formCont_excelTool']=this.tools[index];
								break;
				}
				case "print":	{
								this["printReqd"]=true;
								this['TOOL_TIPS_PRINT']=this.tools[index].qtip;
								this.fcToolsConfig['formCont_printTool']=this.tools[index];
				}
			}
		}
		this.fcbuttonConfig ={};
		
		this['btnClass']="btn-default";
		/**Massage form container action buttons meta data*/
		if(this.actionBtns!=undefined || this.actionBtns.length!=0){	
			var leftBtnCount=0; var leftBtnsList=[];
			var rightBtnCount=0; var rightBtnsList=[];
			if(!cbx.isEmpty(this.actionBtns[0]) && this.actionBtns[0].length!=0){
				/**Set the class names and the display name from resource bundle for Positive action buttons*/
				var actionBtn;
				for(var posInd=0 ; posInd < this.actionBtns[0].length; posInd++){
					actionBtn=this.actionBtns[0][posInd];
					actionBtn['WINDOW_BTN_ID']=actionBtn.buttonId;
					actionBtn['WINDOW_BTN_DISPLAY_NM']=actionBtn.text;		
					actionBtn.btnPosition==='LEFT' ? leftBtnsList[leftBtnCount++]=actionBtn : rightBtnsList[rightBtnCount++]=actionBtn;
					this.fcbuttonConfig[actionBtn.buttonId] = actionBtn;
				}
			}//End if
			if(!cbx.isEmpty(this.actionBtns[2]) && this.actionBtns[2].length!=0){
				/**Set the class names and the display name from resource bundle for negative action buttons*/
				var actionBtn;
				for(var posInd=0 ; posInd < this.actionBtns[2].length; posInd++){
					actionBtn=this.actionBtns[2][posInd];
					actionBtn['WINDOW_BTN_ID']=actionBtn.buttonId;
					actionBtn['WINDOW_BTN_DISPLAY_NM']=actionBtn.text;		
					actionBtn.btnPosition==='RIGHT' ? rightBtnsList[rightBtnCount++]=actionBtn : leftBtnsList[leftBtnCount++]=actionBtn;
					this.fcbuttonConfig[actionBtn.buttonId] = actionBtn;
				}
			}//End if
			this.LEFT_ACTION_BUTTONS=leftBtnsList;
			this.RIGHT_ACTION_BUTTONS=rightBtnsList;
		}//End if (BBAR buttons undefined)
		
		var tmpFormContainer = new ct.lib.tmplLayer('FDF/popUpWindowTemplate.cttpl', this);	 
		tmpFormContainer.getTemplate(this.drawFormContainer, this);	
	},
	/**@member  {Method} drawFormContainer
	 * @memberof "cbx.lib.formContainerAppRenderer"
	 * @description On success of template call, attach the form container template to the form container div, get the form to be displayed within the 
     * form container and then make call to the modal window to pop the form container
	 */
	drawFormContainer : function(formContTemplate, formContTmpClass){
		var tempFormContDiv =  new cbx.lib.layer({"eleType" : "div",  "class" : "panel panel-default ct-app ct-app-tm","data-item-id": "formContainer"}).getLayer();
		$(tempFormContDiv).append(formContTemplate);
		$(tempFormContDiv).find('div[data-item-id=formCont_body]').append(this.formObj.getFormView());
		$(tempFormContDiv).find('[data-toggle="tooltip"]').tooltip();
		
		$(tempFormContDiv).find('a[data-item-type=formCont_button]').on('click',$.proxy(function(evt){
			var buttonId = $(evt.currentTarget).attr('data-item-id');
			this.fcbuttonConfig[buttonId].handler(this.fcbuttonConfig[buttonId]);
		},this));
		
		$(tempFormContDiv).find('a').on('click',$.proxy(function(evt){
			switch($(evt.currentTarget).attr('data-item-id')){
				case 'formCont_helpTool': 
									this.fcToolsConfig['formCont_helpTool'].handler();
									break;
				case 'formCont_excelTool': 
									this.fcToolsConfig['formCont_excelTool'].handler();
									break;		
				case 'formCont_printTool': 
									this.fcToolsConfig['formCont_printTool'].handler();
			}
		},this));
		
		var modal = CLCR.getCmp({
			"COMP_TYPE" : "MODAL_WINDOW",
		});
		var config = {
			modalContent : tempFormContDiv,
			modalClass : 'ct-modal__max',
			fullscreenInd : false
		};
		this.formContainer = new modal(config);
	},
	close : function(){
		this.formContainer.hideModal();
	}
	
});
CLCR.registerCmp({'COMP_TYPE':'FORM_CONTAINER','LAYOUT':"WINDOW"}, cbx.lib.formContainerWindowRenderer);