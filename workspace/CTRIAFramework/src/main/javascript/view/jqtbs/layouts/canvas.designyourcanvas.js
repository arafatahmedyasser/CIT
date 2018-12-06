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
 * @className : cbx.form.listeners.DYC_FORM
 * @extends : cbx.Observable
 * @description: This class is responsible to initate all Design your canvas view components.
 * 
 */

cbx.form.listeners.DYC_FORM = Class(cbx.Observable, {
	/**
	 * @constructor
	 */
	constructor : function (config)
	{
		var ws = iportal.workspace.metadata.getWorkspaces();
		this.fm = config.fm;
		var that=this;
		if(iportal.workspace.metadata.getCurrentWorkspaceId() == "DYC"){
			var ele = "<input type='text' class='ct-ws-title' data-item-id='ct-ws-title' placeholder='ENTER WORKSPACE NAME HERE!'>";
			$('[data-item-id=ct-ws-title]').filter(':visible').replaceWith(ele);
		}
		//this.createPlaceholder(1);
	},
	
	registerHandlers : function ()
	{
		var dom=$(this.fm.wrapperPanel);
		dom.find('.ct-form__anchor-width').parent('.data-width').removeClass('dyc-button-active');
		dom.find('[data-item-id=DYC_STACK_BTN]').parents('.data-width').addClass('dyc-button-active')
		this.fm.registerHandler("cbxclick","DYC_STACK_BTN", function(fm,event,fieldname,params) {
			dom.find('.ct-form__anchor-width').parent('.data-width').removeClass('dyc-button-active');
			dom.find('[data-item-id=DYC_STACK_BTN]').parents('.data-width').addClass('dyc-button-active')
			var totalColumns = 1;
			this.createPlaceholder(totalColumns);
			
			
		});
		
		
		this.fm.registerHandler("cbxclick","DYC_TWO_COLUMN_BTN", function(fm,event,fieldname,params) {
			dom.find('.ct-form__anchor-width').parent('.data-width').removeClass('dyc-button-active');
			dom.find('[data-item-id=DYC_TWO_COLUMN_BTN]').parents('.data-width').addClass('dyc-button-active')
			var totalColumns = 2;
			this.createPlaceholder(totalColumns);
			
		});
		
		this.fm.registerHandler("cbxclick","DYC_THREE_COLUMN_BTN", function(fm,event,fieldname,params) {
			dom.find('.ct-form__anchor-width').parent('.data-width').removeClass('dyc-button-active');
			dom.find('[data-item-id=DYC_THREE_COLUMN_BTN]').parents('.data-width').addClass('dyc-button-active')
			var totalColumns = 3;
			this.createPlaceholder(totalColumns);
			
		});
		
		this.fm.registerHandler("cbxclick","DYC_SAVE_BTN", function(fm,event,fieldname,params) {
			this.getMD();
		});
		
		this.fm.registerHandler("cbxclick","DYC_CLEAR_BTN", function(fm,event,fieldname,params) {
			$('[data-item-id=dyc-widget]').remove();
		});
		
		

	},
	/**
	 * @member  {Method} createWSContainer
	 * @memberof "cbx.form.listeners.DYC_FORM"
	 * @description  creates the container which conatins the workspaces that are created using design your canvas.
	 * @param {Object} ws 
	 */
	createWSContainer : function (ws){	
		var that = this;	
		var wscard="";
		for(i=0;i<ws.length;i++){
			
			if(ws[i].SYSTEM_WORKSPACE_IND == 'N'){
				wscard += "<li class='dyc-ws-cards'>";
				wscard += "<div class='dyc-ws-icon' data-workspace-id='"+ ws[i].WORKSPACE_ID +"'>"+ ws[i].WORKSPACE_DISPLAY_NM +"";
				wscard += "<div class='dyc-delete-ws' data-item-id='dyc-delete-ws'></div>";
				wscard += "<div class='dyc-update-ws' data-item-id='dyc-update-ws'></div>";
				wscard += "</div>";
				wscard += "</li>";
			}
			
		}
		$('.dyc-ws-container-inner').html(wscard);
		/*$(".dyc-workspace-container").mCustomScrollbar({
		    axis:"x"
		});*/
		
		$('[data-item-id=dyc-delete-ws]').click(function(){
			var wsId = $(this).parent().data('workspaceId');
			var deleteWS = new iportal.Dialog({
				dialogType : 'USERDEFINED',
				dialogStyle : 'YES_NO',
				message : CRB.getFWBundleValue("LBL_DELETE_MSG1") + "&nbsp;" + CRB.getFWBundleValue("LBL_DELETE_MSG2"),
				yesHandler : function(){
					that.deleteWorkspace(wsId);
					deleteWS.close();
					
				},
				noHandler : function ()
				{
					deleteWS.close();
				},
				title : CRB.getFWBundleValue("LBL_CONFIRMATION")
			});
			deleteWS.show();
		});
		
		$('[data-item-id=dyc-update-ws]').click(function(){
			var wsId = $(this).parent().data('workspaceId');
			that.updateWorkspace(wsId);
		});
		
		$('[data-item-id=dyc-toggle]').off('click').on('click',function ()
		{
			$('#dyc-workspace-container').slideToggle('slow');
		})
		
		$('[data-item-id=dyc-clear]').click(function(){
			$('[data-item-id=dyc-widget]').remove();
		});
	},
	
		/**
	 * @member  {Method} createPlaceholder
	 * @memberof "cbx.form.listeners.DYC_FORM"
	 * @description  sends the config needed to create addwidget placeholder(s) inside the empty widget.
	 * @param {Integer} columns 
	 */
	createPlaceholder : function (columns)
	{
		this.obj =[];
		this.totalColumns = columns;
		this.colWidth = 12/columns;
	
		for(i=0;i<columns;i++){
			var config = {};
			this.obj.push(config);
		}
		
		var placeholder = new ct.lib.tmplLayer('dyc.cttpl',this);
		placeholder.getTemplate(this.applyPlaceholder, this);
	},
	
	/**
	 * @member  {Method} createDYCModal
	 * @memberof "cbx.form.listeners.DYC_FORM"
	 * @description  sends the initial config to create the modal window.
	 * @param {Object} config 
	 */
	createDYCModal : function (config) {
		
		Handlebars.registerHelper("getFromBundle",function(value){
			return CRB.getFWBundleValue(value) || value;
		});
		
		this.md = config;
		
		var dycModal = new ct.lib.tmplLayer('dycmodal.cttpl',this);
		dycModal.getTemplate(this.renderModal, this);
		
	},
	
	/**
	 * @member  {Method} applyPlaceholder
	 * @memberof "cbx.form.listeners.DYC_FORM"
	 * @description  creates and apply the addwidget placeholder(s) inside the empty widget.
	 * @param {String} template 
	 */
	applyPlaceholder : function (template){
		var that = this;
		var a = $('.dyc-widgetcontainer').find('[data-item-id="dyc-widget"]');
		$('.dyc-layoutcontainer').html(template);
		if (a.length != 0){
			for(i=0;i<a.length;i++){
				if(that.totalColumns == 1){
					a[i].dataset.widgetPosition = i+1;
					$('[data-item-id=dyc-widgetcontainer-0]').append(a[i]);
				}
				else if(that.totalColumns == 2){
					a[i].dataset.widgetPosition = i+1;
					if( (i+1)%that.totalColumns == 1 ){
						$('[data-item-id=dyc-widgetcontainer-0]').append(a[i]);
					}
					else {
						$('[data-item-id=dyc-widgetcontainer-1]').append(a[i]);
					}
					
				}
				else if(that.totalColumns == 3){
					a[i].dataset.widgetPosition = i+1;
					if( (i+1)%that.totalColumns == 1 ){
						$('[data-item-id=dyc-widgetcontainer-0]').append(a[i]);
					}
					else if((i+1)%that.totalColumns == 2) {
						$('[data-item-id=dyc-widgetcontainer-1]').append(a[i]);
					}
					else {
						$('[data-item-id=dyc-widgetcontainer-2]').append(a[i]);
					}
				}
			}
		}
		
		
		$('.dyc-widgetcontainer').on('click','.dyc-addwidget',function(){
			var initparams = {
						'INPUT_PRODUCT' : 'CANVAS',
						'PRODUCT_NAME' : 'CANVAS',
						'INPUT_SUB_PRODUCT' : 'CANVAS',
						'INPUT_FUNCTION_CODE' : 'VSBLTY',
						'PAGE_CODE_TYPE' : 'WSDF_CODE',
						'INPUT_ACTION' : 'ACTION_APPSTORE_INIT_ACTION'
					};
			
			
			cbx.ajax({
				params : initparams,
				success : function (result)
				{	
					that.createDYCModal(result);
				}
			});
				
			});
		},
		
		/**
		 * @member  {Method} renderModal
		 * @memberof "cbx.form.listeners.DYC_FORM"
		 * @description  creates/renders the modal window.
		 * @param {String} template 
		 */
		renderModal : function(template){
			var that=this;
			
			var modal = CLCR.getCmp({
				"COMP_TYPE" : "MODAL_WINDOW",
			});
			var modalConfig = {
						modalContent : template,
						modalClass : 'ct-modal__max',
						fullscreenInd : true
					};
			
			this.modalObj = new modal(modalConfig, $.proxy(this.afterModalRender,this));
			
		},
		
		/**
		 * @member  {Method} renderSearchList
		 * @memberof "cbx.form.listeners.DYC_FORM"
		 * @description  renders the search results on entering the search query.
		 * @param {Object} list 
		 */
		renderSearchList : function(list){
			var dom="";
			var hiddenFlag="";
			$('[data-item-id=dyc-search-box]').empty();
			dom+="<div class=''>";
			for(var i=0;i<list.length;i++){
				var categoryFromBundle = CRB.getFWBundleValue(list[i].PRODUCT_CATEGORY_DISPLAY_NM) || list[i].PRODUCT_CATEGORY_DISPLAY_NM;
				if(i==5){
					break;
				}
				if($('[data-widget-id='+list[i].WIDGET_ID+']').hasClass('dyc-app-marked')){
					hiddenFlag="	<a hidden class='dyc-select-btn flaticon-checked' data-select="+list[i].WIDGET_ID+"></a><a class='dyc-deselect-btn flaticon-close' data-deselect="+list[i].WIDGET_ID+"></a>"
					
				}else{
					hiddenFlag="<a class='dyc-select-btn flaticon-checked' data-select="+list[i].WIDGET_ID+"></a><a hidden class='dyc-deselect-btn flaticon-close' data-deselect="+list[i].WIDGET_ID+"></a>"
				}
				dom+="<div class='dyc-app-result col-lg-8 col-md-8 col-sm-10 col-xs-12 ' data-list-id="+list[i].WIDGET_ID+">";
				dom+="<div class='dyc-app-ico col-lg-2 col-md-3 col-sm-3 col-xs-3'> <i class='flaticon-default_a'></i></div>"
				dom+="<div class='dyc-app-desc col-lg-10 col-md-9 col-sm-9 col-xs-9'>"
				dom+= "<div class='col-lg-12 dyc-search-desc'>"+list[i].WGT_DISPLAY_NM+"</div>"
				dom+="<div class='col-lg-12 dyc-search-preview-btn'>"
			    dom+="<div class='col-lg-6 col-sm-6 col-xs-6 col-md-6 dyc-search-preview-btn'>"+list[i].PRODUCT_CATEGORY_DISPLAY_NM+"</div>"
			    dom+="<div class='col-lg-6 col-sm-6 col-xs-6 col-md-6 dyc-search-preview-btn' ><a class='dyc-preview flaticon-preview2' data-dyc-id="+list[i].WIDGET_ID+"></a> "+hiddenFlag+" </div></div>";
	        	dom+="</div>"
	        	dom+="</div>"
			}
			dom+="</div>";
			$('[data-item-id=dyc-search-box]').append(dom);
			$('[data-dyc-id]').click(function(){
				$(this).parents("[data-item-id=dyc-search-box]").find(".data-preview-area").remove();
				var widgetId=$(this).data('dyc-id');
				$(this).parents('[data-item-id=dyc-search-box]').find('[data-list-id]').not('[data-list-id='+widgetId+']').remove();
				$(this).parents(".dyc-app-result").after("<div class='data-preview-area col-lg-8 col-md-8 col-sm-10 col-xs-12 '></div>");
				cbx.core.dynamicWidgetManager({renderTo : "CUSTOM", widgetId : widgetId, containerPanel : '.data-preview-area'});
			});
			
			$('[data-select]').click(function(){
				var widgetId=$(this).data('select');
				$(this).next('[data-deselect]').attr('hidden',false)
				$(this).attr('hidden',true);
				$('[data-item-id=dyc-app]').find('[data-widget-id='+widgetId+']').parent().siblings().find('[data-app-select]').addClass('deselect').text('De-select');
				var targetOffset = $('[data-widget-id='+widgetId+']').offset().top;
				$('[data-widget-id='+widgetId+']').addClass('dyc-app-marked');
				/*$('[data-item-id=ct-modal-content]').animate({scrollTop: targetOffset}, 1500,function(){
					
				});*/
			});
			
			$('[data-deselect]').click(function(){
				var widgetId=$(this).data('deselect');
				$(this).prev('[data-select]').attr('hidden',false)
				$(this).attr('hidden',true);
				$('[data-item-id=dyc-app]').find('[data-widget-id='+widgetId+']').parent().siblings().find('[data-app-select]').removeClass('deselect').text('Select');
				var targetOffset = $('[data-widget-id='+widgetId+']').offset().top;
				$('[data-widget-id='+widgetId+']').removeClass('dyc-app-marked');
				/*$('[data-item-id=ct-modal-content]').animate({scrollTop: targetOffset}, 1500,function(){
					
				});*/
			});
        		
		},
		
		/**
		 * @member  {Method} afterModalRender
		 * @memberof "cbx.form.listeners.DYC_FORM"
		 * @description  contains some events that happen in design your canvas.
		 */
		afterModalRender : function(){
			
			var wl = $('[data-item-id="dyc-widget"]');
			var wm =$('.dyc-ico');
			for(i=0;i<wl.length;i++){
				var wlId = wl[i].dataset.widgetId;
				for(j=0;j<wm.length;j++){
					var wmId = wm[j].children[0].dataset.widgetId;
					if(wlId == wmId){
						$(wm[j]).children().eq(0).addClass('dyc-app-marked');
						var dom = $(wm[j]).siblings().children().eq(1);
						dom.addClass('deselect');
						dom.text('De-Select');
					}
				}
			}
			
			
			
			
			
			var me = this;
			$('.dyc-product-category li:first').addClass('ct-active-prod-cat');
			$('[data-product-id=product]').click(function(){
				$(this).siblings().removeClass('ct-active-prod-cat');
				$(this).addClass('ct-active-prod-cat');
				var productId = $(this).children('[data-item-id]').data('item-id');
				if(productId == "ALL"){
					$('[data-product-category]').parents('.dyc-app').show()
				}
				else{	
					$('[data-product-category]').parents('.dyc-app').hide()
					$('[data-product-category='+ productId + ']').parents('.dyc-app').show();
				}
			});
			
			$('[data-app-select]').click(function(){
				var markedApp=$(this).parents('.dyc-app').find('.dyc-ico').children('[data-product-category]');
				if(markedApp.hasClass('dyc-app-marked')){
					markedApp.removeClass('dyc-app-marked');
					$(this).removeClass('deselect');
					$(this).text('Select')
				}else{
					markedApp.addClass('dyc-app-marked');
					$(this).addClass('deselect');
					$(this).text('De-Select')
				}
			});
			
			
			
			
			$('.dyc-search-box').keyup(function(){
				
				if(cbx.isEmpty($(this).val())){
					$(this).parents('.row').siblings('.row').removeClass('modal-backdrop-dyc-search');
					$(this).parent().removeClass('index-2');
					$('[data-item-id=dyc-search-box]').empty();
					//$('[data-item-id=ct-modal-content]').animate({scrollTop: 0}, 1000);
					$('.dyc-search-cont').animate({"margin-top":"0"}, 500);
				}else{
					$(this).parents('.row').siblings('.row').addClass('modal-backdrop-dyc-search');
					$(this).parents('.dyc-search').addClass('index-2');
					$('.dyc-search-cont').animate({"margin-top":"-45"}, 500);
					var term = $(this).val();//term.toLowerCase();
					LOGGER.log('loop..');
					var myObj = me.md.WIDGET_META_DATA;
					var prod = $('.dyc-product-category').find('.ct-active-prod-cat').children('[data-item-id]').data('item-id');
					var choices = $.map(myObj,function(v,i){
					if(prod=='ALL' || v.PRODUCT_CATEGORY == prod)
							return [v];
					});
					var suggestions = [];
					for (i = 0; i < choices.length; i++)
						if (~choices[i].WGT_DISPLAY_NM.toLowerCase().indexOf(term))
							suggestions.push(choices[i]);
					me.renderSearchList(suggestions);
				}
			});
			
			
			$('[data-item-id=dyc-search-close]').click(function(e){
				e.preventDefault();
				e.stopImmediatePropagation();
				$(this).parents('.row').siblings('.row').removeClass('modal-backdrop-dyc-search');
				$(this).parent().removeClass('index-2');
				$('[data-item-id=dyc-search-box]').empty();
				//$('[data-item-id=ct-modal-content]').animate({scrollTop: 0}, 1000);
				$('.dyc-search-cont').animate({"margin-top":"0"}, 500);
				$(this).siblings('.dyc-search-input').val('');
			});
			$('.dyc-save').click(function(){
				var selectedApps = $('.dyc-search-result').find('.dyc-app-marked');
				var widgetsReg = [];
				for(i=0; i < selectedApps.length; i++){
					var widgetRef = selectedApps[i].dataset;
					widgetsReg.push(widgetRef);
				}
				
				me.modalObj.hideModal();
				
				var wd = $('.dyc-layoutcontainer').find('.dyc-addwidget')[0];
				$('.dyc-layoutcontainer').find('.dyc-widgetcontainer').empty();
				$('.dyc-layoutcontainer').find('.dyc-widgetcontainer').html(wd);
				
				for(j=0; j < widgetsReg.length; j++){
					var numberOfColumns = $('.dyc-layoutcontainer').find('.dyc-widgetcontainer').length;
					var wgtId = widgetsReg[j].widgetId;
					var containerDOM = "<div id='dyc-widget-"+ j +"' data-item-id='dyc-widget' data-widget-position='"+ (j+1) +"' data-widget-id='"+ wgtId +"'></div>";
					var placement = j%(numberOfColumns);
					$('[data-item-id=dyc-widgetcontainer-'+placement+']').append(containerDOM);
					cbx.core.dynamicWidgetManager({renderTo : "CUSTOM", widgetId : wgtId, containerPanel : "#dyc-widget-"+j});
				}
			});
			
			
			$('.dyc-cancel').click(function(){
				me.modalObj.hideModal();
				me.registerHandlers();
			});
			$('[data-item-id=ct-actScroll]').mCustomScrollbar({
			    axis:"x"
			});
			
			
			
		},
		
		/**
		 * @member  {Method} getMD
		 * @memberof "cbx.form.listeners.DYC_FORM"
		 * @description  gets the metadata for saving a workspace.
		 */
		getMD : function() {
			this.totalColumns = $('.dyc-widgetcontainer').length;
			var saveInfo = this.getsaveConfig();
			this.save(saveInfo);
		},
		
		/**
		 * @member  {Method} getsaveConfig
		 * @memberof "cbx.form.listeners.DYC_FORM"
		 * @description returns config object for saving a workspace.
		 * @return {Object} saveConfig 
		 */
		getsaveConfig : function() {
			var saveConfig = {};
			saveConfig.CHILD_LAYOUTS=[this.getLayoutData()];
			saveConfig.WORKSPACE_DISPLAY_NM= $('[data-item-id=ct-ws-title]').filter(':visible').val();
			saveConfig.WORKSPACE_LAYOUT = "STACK";

			if(this.WORKSPACE_ID){
				saveConfig.WORKSPACE_ID = this.WORKSPACE_ID;
			}
			
			return saveConfig;
		},
		
		/**
		 * @member  {Method} getLayoutData
		 * @memberof "cbx.form.listeners.DYC_FORM"
		 * @description  returns md.
		 * @return {Object} md 
		 */
		getLayoutData : function() {
			var tmp= {};
			tmp.totalWidth= $('.dyc-layoutcontainer').width();
			tmp.firstColumnWidth=$('[data-item-id="dyc-widgetcontainer-0"]').width();
			tmp.secondColumnWidth=$('[data-item-id="dyc-widgetcontainer-1"]').width();
			tmp.thirdColumnWidth=$('[data-item-id="dyc-widgetcontainer-2"]').width();

			var md= {};
			md.PROPORTION=this.getPercentage(tmp);
			md.CHILD_WIDGETS = this.getItemInfo();
			md.LAYOUT_CATAGORY = this.getLayoutCategory();
			return md;
		},
		
		/**
		 * @member  {Method} getPercentage
		 * @memberof "cbx.form.listeners.DYC_FORM"
		 * @description  returns proportion of width.
		 * @param {Object} obj 
		 * @return {String}   
		 */
		getPercentage : function(obj){
			var first = obj.firstColumnWidth/obj.totalWidth*100;
			var second= obj.secondColumnWidth/obj.totalWidth*100;
			var third = obj.thirdColumnWidth/obj.totalWidth*100;
			
			if(this.totalColumns == 3){
				return Math.floor(first)+","+Math.floor(second)+","+Math.floor(third);
			}
			else if(this.totalColumns == 2){
				return Math.ceil(first) +","+ Math.ceil(second);
			}
			else {
				return Math.floor(first);
			};

		},
		
		/**
		 * @member  {Method} getItemInfo
		 * @memberof "cbx.form.listeners.DYC_FORM"
		 * @description returns widget metadata.
		 * @return {Object} wgtInfo 
		 */
		
		getItemInfo : function(){
			var wgtInfo= {};
			var funArr={};

			if(this.totalColumns == 3){funArr[0]="LEFT";funArr[1]="CENTER";funArr[2]="RIGHT";};
			if(this.totalColumns == 2){funArr[0]="LEFT";funArr[1]="RIGHT";funArr[2]="CENTER";};
			if(this.totalColumns == 1){funArr[0]="LEFT";funArr[1]="RIGHT";funArr[2]="CENTER";};

			for(var i=2;i>=0;i--){

				var cmp = $('[data-item-id=dyc-widgetcontainer-'+ i +']').find('[data-item-id=dyc-widget]');
				var WgtList = this.getWrapperItems(cmp);
				wgtInfo[funArr[i]]=WgtList;
			}

			return wgtInfo;

		},
		
		/**
		 * @member  {Method} getLayoutCategory
		 * @memberof "cbx.form.listeners.DYC_FORM"
		 * @description returns THREE-COLUMN|TWO-COLUMN|STACK
		 * @return {String} 
		 */
		
		getLayoutCategory : function() {

			if(this.totalColumns == 3) {
				return "THREE-COLUMN";
			};
			
			if(this.totalColumns == 2) {
				return "TWO-COLUMN";
			};
			
			if(this.totalColumns == 1) {
				return "STACK";
			};

		},
		
		/**
		 * @member  {Method} getWrapperItems
		 * @memberof "cbx.form.listeners.DYC_FORM"
		 * @description  returns array of widgets.
		 * @param {Object} wrapper 
		 * @return {Array} list
		 */
		
		getWrapperItems : function(wrapper) {
			var list = [];

			for(var i=0; i<wrapper.length; i++){
				if(wrapper[i].dataset.widgetId){
					list.push(wrapper[i].dataset.widgetId);
				}
			}
			return list;
		},
		
		/**
		 * @member  {Method} save
		 * @memberof "cbx.form.listeners.DYC_FORM"
		 * @description  saves a workspace.
		 * @param {Object} config 
		 */
		save : function(config) {
			var me = this;
			var initparams = {
						'INPUT_PRODUCT' : 'CANVAS',
						'PRODUCT_NAME' : 'CANVAS',
						'INPUT_SUB_PRODUCT' : 'CANVAS',
						'INPUT_FUNCTION_CODE' : 'VSBLTY',
						'PAGE_CODE_TYPE' : 'WSDF_CODE',
						'INPUT_ACTION' : 'ACTION_APPSTORE_SAVE',
						'JSON_TO_HASH_MAP_SUPPORT_FLAG' : 'JSON_DATA'
					};
			
			if (config) {
				initparams.JSON_DATA = JSON.stringify(config);
			}
			
			cbx.ajax({
				params : initparams,
				success : function (result)
				{	
					
					if(result.REPLY_TYPE == "SUCCESS") {
						
						var successDialog = new canvas.Dialog({
							dialogType: 'USERDEFINED',
							dialogStyle : 'OK',
		                    message: CRB.getFWBundleValue("LBL_CREATE_UPDATE_MSG_FIN"),
		                    title: CRB.getFWBundleValue("LBL_CONFIRMATION"),
		                    okHandler : function(){
								successDialog.close();
								me.updateWorkSpaceAfterAjax(result); 
								$('[data-item-id=dyc-widget]').remove();
								$('[data-item-id=ct-ws-title]').filter(':visible').val('');
							}
		                });
						successDialog.show();
						
					} 
					else if (result.REPLY_TYPE == "ERROR") {
						
						var errorDialog = new canvas.Dialog({
							dialogType: 'ERROR',
		                    message: result.ERR_MESS,
		                    title: CRB.getFWBundleValue("LBL_ERROR")
		                });
						errorDialog.show();
						
					}
				
				}
			});	
		},
		
		/**
		 * @member  {Method} deleteWorkspace
		 * @memberof "cbx.form.listeners.DYC_FORM"
		 * @description  deletes a workspace.
		 * @param {String} wsId 
		 */
		
		deleteWorkspace : function(wsId){
			var me = this;
			var initparams = {
						'INPUT_PRODUCT' : 'CANVAS',
						'PRODUCT_NAME' : 'CANVAS',
						'INPUT_SUB_PRODUCT' : 'CANVAS',
						'INPUT_FUNCTION_CODE' : 'VSBLTY',
						'PAGE_CODE_TYPE' : 'WSDF_CODE',
						'INPUT_ACTION' : 'ACTION_APPSTORE_DELETE',
						'WORKSPACE_ID' : wsId
					};
			
			cbx.ajax({
				params : initparams,
				success : function (result)
				{	
					var deleteDialog = new canvas.Dialog({
						dialogType: 'USERDEFINED',
						dialogStyle : 'OK',
	                    message: CRB.getFWBundleValue("LBL_DELETE_MSG_FIN"),
	                    title: CRB.getFWBundleValue("LBL_CONFIRMATION"),
	                    okHandler : function(){
							deleteDialog.close();
							me.updateWorkSpaceAfterAjax(wsId);
							$('[data-item-id=dyc-widget]').remove();
							$('[data-item-id=ct-ws-title]').filter(':visible').val('');
						}
	                });
					deleteDialog.show();
				}
			});
		},
		
		/**
		 * @member  {Method} updateWorkspace
		 * @memberof "cbx.form.listeners.DYC_FORM"
		 * @description  updates a workspace.
		 * @param {String} wsId 
		 */
		
		updateWorkspace : function (wsId)
		{
			$('[data-item-id="dyc-widget"]').remove();
			var wsMD = cbx.core.ws.metadata.getWorkSpaceById(wsId)
			this.WORKSPACE_ID = wsId;
			$('[data-item-id=ct-ws-title]').filter(':visible').val(wsMD.WORKSPACE_DISPLAY_NM);
			var nd = wsMD.CHILD_LAYOUTS[0];
			var layout = nd.LAYOUT_LAYOUT;
			
			if(layout == 'STACK' ){
				
				this.createPlaceholder(1);
			} else if(layout == 'TWO-COLUMN'){
				
				this.createPlaceholder(2);
			} else if(layout == 'THREE-COLUMN') {
				
				this.createPlaceholder(3);
			}
			
			for(i=0; i<nd.CHILD_WIDGETS.length; i++){
				var widgetMD = nd.CHILD_WIDGETS[i];
				var widgetId = widgetMD.WIDGET_ID;
				var blockPosition = widgetMD.BLOCK_POSITION;
				var position = widgetMD.POSITION;
				var containerDOM = "<div id='dyc-widget-"+ i +"' data-item-id='dyc-widget' data-widget-position='"+ position +"' data-widget-id='"+ widgetId +"'></div>";
				
				if(layout == 'STACK'){
					$('[data-item-id=dyc-widgetcontainer-0]').append(containerDOM);
					cbx.core.dynamicWidgetManager({renderTo : "CUSTOM", widgetId : widgetId, containerPanel : "#dyc-widget-"+i});
				} 
				
				else if (layout == 'TWO-COLUMN') {
					if(blockPosition == 'LEFT'){
						$('[data-item-id=dyc-widgetcontainer-0]').append(containerDOM);
						cbx.core.dynamicWidgetManager({renderTo : "CUSTOM", widgetId : widgetId, containerPanel : "#dyc-widget-"+i});
					} else if (blockPosition == 'RIGHT'){
						$('[data-item-id=dyc-widgetcontainer-1]').append(containerDOM);
						cbx.core.dynamicWidgetManager({renderTo : "CUSTOM", widgetId : widgetId, containerPanel : "#dyc-widget-"+i});
					}
				} 
				
				else if (layout == 'THREE-COLUMN') {
					if(blockPosition == 'LEFT'){
						$('[data-item-id=dyc-widgetcontainer-0]').append(containerDOM);
						cbx.core.dynamicWidgetManager({renderTo : "CUSTOM", widgetId : widgetId, containerPanel : "#dyc-widget-"+i});
					} else if (blockPosition == 'CENTER'){
						$('[data-item-id=dyc-widgetcontainer-1]').append(containerDOM);
						cbx.core.dynamicWidgetManager({renderTo : "CUSTOM", widgetId : widgetId, containerPanel : "#dyc-widget-"+i});
					}
					else if (blockPosition == 'RIGHT'){
						$('[data-item-id=dyc-widgetcontainer-2]').append(containerDOM);
						cbx.core.dynamicWidgetManager({renderTo : "CUSTOM", widgetId : widgetId, containerPanel : "#dyc-widget-"+i});
					}
				}
				
			}
			
		},
		
		/**
		 * @member  {Method} updateWorkSpaceAfterAjax
		 * @memberof "cbx.form.listeners.DYC_FORM"
		 * @description  creates workspace cards inside the empty widget.
		 * @param {Object} response 
		 */
		
		updateWorkSpaceAfterAjax : function (response)
		{
			var ws = iportal.workspace.metadata.getWorkspaces();
			if(response.WORKSPACE){
				iportal.workspace.metadata.setWorkspace(response.WORKSPACE);
			}else{
				iportal.workspace.metadata.deleteCustomWorkspaceById(response);		
			}
			
			this.createWSContainer(iportal.workspace.metadata.getWorkspaces());
		},
		

		
		

});
CFLR.registerListener("DYC_FORM", cbx.form.listeners.DYC_FORM);
CLCR.registerCmp({"ID":"DYC"},cbx.form.listeners.DYC_FORM,{"fm":{"events":{"initialized":true,"beforeinitialize":true,"formPanelRender":true},"register":{},"func_queue":[],"preInitConfig":null,"isInitialized":false,"pushFormRequestQueue":[],"formPanelRendered":false,"contextContainer":null,"autoDestroy":true,"model":{"md":{},"dataChanged":false,"initModel":{},"events":{"cbxchange":true,"cbxappchange":true,"cbxmodeldatachange":true},"listeners":{"cbxchange":[{}],"cbxappchange":[{}],"cbxmodeldatachange":[{}]}},"screenView":{"FSV":{"windowTitle":"","formIds":["DYC_FORM"],"widgetIds":[],"parentFormId":"DYC_FORM","SVC":{}}},"formId":"DYC_FORM","lazzyFormPanel":false,"wrapperPanel":{"parentCt":{"config":{"autoScroll":false,"border":false,"frame":false,"layout":"anchor","boxMinWidth":400,"cls":"DYC_FORM","itemId":"18_DYC_FORM_WRAPPER","defaults":{"anchor":"100%"},"listeners":{}},"listeners":{},"events":[],"items":[null],"id":19}}}});
CGH.registerHandler('DYC_VIEW', "<div id='dyc-workspace-container' class='dyc-workspace-container'><ul class='dyc-ws-container-inner'></ul></div><div id='dyc-container' class='dyc-container'><div class='dyc-layoutcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 col- no-pad'></div></div>");
//CGH.registerHandler('DYC_VIEW', "<div id='dyc-container' class='dyc-container'><div class='dyc-layoutcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 col- no-pad'><div class='dyc-splitter col-lg-12 no-pad' style='border-right: 3px solid #333;'><div data-item-id='dyc-widgetcontainer-0' class='dyc-widgetcontainer'><div class='dyc-addwidget'></div></div><div class='dyc-hsplitter'></div></div></div></div>");
CWEH.registerHandler('DYC_CONTENT_WGT',CWEC.INIT_APP,function(){
	var ws = iportal.workspace.metadata.getWorkspaces();
	var fm = new cbx.form.FormManager({formId: "DYC_FORM"});
	var config = {};
	config.fm = fm;
	var callz = new cbx.form.listeners.DYC_FORM(config);
	callz.createWSContainer(ws);
	callz.createPlaceholder(1);
});
