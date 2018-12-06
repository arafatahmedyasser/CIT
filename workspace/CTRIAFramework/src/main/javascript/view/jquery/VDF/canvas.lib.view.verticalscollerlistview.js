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
 
cbx.ns('canvas.lib.view');
/**
 * <pre>
 * This class follow the CT Component life cycle and is responsible for
 * Vertical scrollar view  with template configure with reponsive  also supports the following
*  -Automatic Vertical scrollar 
 * -Mobile Touch Sliding
 * -Manual User Sliding  
 * content. This class uses Idangerous.swiper plugin for rendering the Vertical Scrollar,
 * Mobile touch slide and Manual User Sliding.
 * </pre>
 * 
 * @class canvas.lib.view.verticalscollerlistview
 */
canvas.lib.view.verticalscollerlistview = Class(cbx.core.Component,{
	/**
	 * 
	 */
	initialize : function() {
		var me = this;
		me.loaded = false;
		var elem = me.elem;
		var appId = 'cbx-app-' + me.WIDGET_ID + "_" + me.md.getViewId();
		this.pageSize = me.md.FLD_RECORDS_PER_PAGE;
		elem.append('<span class="' + appId + '" ITEM_ID="WGT_' + me.WIDGET_ID + '"></span>');
		elem = $(elem.find('span.' + appId));
		me.setCmp(elem);
		me.elem.on("remove", function() {
			me.destroy();
		});
		this.contextMenu = me.md.getContextMenu();
		/**
		 * Template config call for this particluar widget 
		 */
		this.templateConfig = this.md.md.VIEW_MD.TEMPLATE_CONFIG;
		var params = {
			"__LISTVIEW_REQUEST" : "Y",
			"PAGE_CODE_TYPE" : 'VDF_CODE',
			"INPUT_ACTION" : "INIT_DATA_ACTION",
			"PRODUCT_NAME" : 'CUSER',
			"INPUT_FUNCTION_CODE" : 'VSBLTY',
			"INPUT_SUB_PRODUCT" : 'CUSER',
			"WIDGET_ID" : me.WIDGET_ID,
			"VIEW_ID" : me.md.getViewId(),
			
			"LAYOUT_ID" :iportal.workspace.metadata.getCurrentLayoutId(),
			"WORKSPACE_ID" :iportal.workspace.metadata.getCurrentWorkspaceId(),
			
			"forceCallbacks" : true
		};
		if (me.uData) {
			cbx.core.extend(params, me.uData);
		}
		var extraParams = {};
		
		/**
		 * To provide custom params for datacall we have to raise the 
		 * extraparam handler event to app developer
		 * 
		 */
		me.viewConf.raiseEvent(CWEC.EXTRA_PARAMS_HDLR, extraParams);
		if (extraParams) {
			cbx.core.extend(params, extraParams);
		}

		this.store = new cbx.core.Store({
			params : params,
			listeners : {
				"load" : me.loadData
			},
			scope : me,
			accumulate : false,
			autoLoad : true,
			reader : {
				root : 'response.value.ALL_RECORDS',
				totalProperty : 'response.value.TOTAL_COUNT'
			},
			bufferSize : this.pageSize != null ? this.pageSize : 3
		});

		elem.empty();
		var displayKey = me.WGT_TITLE || me.md.getViewTitle();
		var title = me.rb[displayKey] || displayKey;
        /**
		 * Appending the Widget title HTML DOM to the
		 * Widget Container HTML contains an up/down arrow image 
		 * contained in DIV HTML element  to transmit from one slide to 
		 * another in vertical scrollar
		 */			
		if (!cbx.core.isEmpty(title) && me.loadingInContainer !== true) {
			$(elem).append('<div id="page-title" role="heading" class="container page-title accessible-area accessibility-contrast-normal col20">');
			$(elem).append('<h1>'+title+'</h1></div>');
			$(elem).append('<div id="earnings-slider" class="earnings-slider widgetcontainer companyInterviews">'
						+'<div class="earnings-slider" id="earning_slider"><a id="conferences_arrow_up" class="buttons prev arrow_up" href="#">'
						+'<img src="equities-eportal/images/containers/components/carousel/arrow-up.png"></a>'
						+'<div id="conferences_swiper_container" class="swiper-container" style="height: 200px; cursor: -webkit-grab; ">'
						+'<div class="swiper-wrapper overview" '
						+'style="padding-top: 0px; padding-bottom: 0px; width: 288px; height: 560px; -webkit-transform: translate3d(0px, 0px, 0px); -webkit-transition-duration: 0.3s; ">'
						+'</div>');
		}		
	},
	
	/**
	 * 
	 */
	reloadData : function() {
		this.loaded = false;
		this.store.reload();
	},
	/**
	 * This method will be called by the listener load in  store instantiation has loaded data and shares
	 * all the records from the data
	 * 
	 * @records List of records
	 */
	loadData : function(records) {
					var me = this;
		var dataTypeMap = canvas.lib.view.datatype.getColumnTypeMap();
		var cMenu = this.contextMenu;
		var len = cMenu.length;
		var elem = me.getCmp();
		/**
		 * Get all visible column data to render it in the configured template
		 */
		var visibleClm = me.md.getVisibleColumns();
		if (this.loaded === false) {
			this.loaded = true;
		}
		var $elem = $($(me.elem).find('.swiper-wrapper'));
		var domList = '';
		/**
		 *  Get Configured template for the particular view and compile it
		 */
		var template = $.template(null, this.templateConfig);
     
		for ( var ind = 0; ind < records.length; ind++) {
			records[ind]['RECORD_CURR'] = ind;
	         /**
	          *  Check records even index  to apply alternative background color  in div 
			  * HTML element  and apply the current record to the place holder of the template 
			  */
			if(ind%2==0){
			
				temp = '<div class=" swiper-slide  swiper-slide-visible alternative-bg-color" >'+$.tmpl(template, records[ind]).html()+'</div>';
			
			}
			/**
			 *  Check records odd index to put  without alternative background color  in div 
			 * HTML element and apply the current record to the place holder of the template 
			 */
			else {
				temp = '<div class=" swiper-slide  swiper-slide-visible">'+$.tmpl(template, records[ind]).html()+'</div>';
				
			}
			if(ind==0)	{
				/**
				 * Activate the automatic swiper slide active by adding class called swiper-slide-active 
				 */
				$(temp).find('.swiper-slide').addClass("swiper-slide-active");
			}
			domList += temp;
		}
		$elem.empty();

		if (!cbx.core.isEmpty(domList)) {
			$elem.append(domList);						
		} else {
			$elem.append(me.rb['LBL_EMPTY']);
		}
		me.elem.find('#earning_slider').append('<a id="'+me.WIDGET_ID+'_arrow_down" class="buttons next arrow_down" href="#"><img src="equities-eportal/images/containers/components/carousel/arrow-down.png"></a></div></div>');
		/**
		 * Attaching datatype for all the elements for which the
		 * data-format is true and the column is a visible column
		 */
		for ( var i = 0, len = visibleClm.length; i < len; i++) {
			$($(this.elem).find('*[data-format="true"][column_id="' + visibleClm[i]['FLD_COLUMN_ID'] + '"]'))
					.attr('type', dataTypeMap[me.md.getColType(visibleClm[i])]);
		}

		canvas.lib.view.datatype.applyFormatting($(elem));
		
		/**
		 * Instantiating Swiper through plugin by giving autoplay time, loop, 
		 * slides per view details and Vertical/Horizontal Mode
		 */
		 var Swiper = $($(this.elem).find('#'+me.WIDGET_ID+'_container')).swiper({
				//Your options here:
				mode:'vertical',
				loop: false,
				calculateHeight:true,
				slidesPerView:'auto',
				grabCursor:true,
				autoplay:10000
		  });
		 /**
		 * Register this swiper container using $.data method  for future use
		 */
								  
		 $.data($('#'+me.WIDGET_ID+'_container'),"swiper", Swiper);  
         /**
		 * Handlers for arrow click to transfer from one slide to another
		 */				 
		 $($(this.elem).find('#'+me.WIDGET_ID+'_arrow_up')).on('click', function(e){
			e.preventDefault()
			Swiper.swipePrev()
		  });
		  $($(this.elem).find('#'+me.WIDGET_ID+'_arrow_down')).on('click', function(e){
			e.preventDefault()
			Swiper.swipeNext()
		  });		
		 /**
		  * Deactivating the click events for our element if it was configured
		  */
		$($(this.elem).find('*[data-action="true"]')).off('click');
		$($(this.elem).find('*[data-action="true"]')).off('click');
		/**
		 * Activating the click/change events for our element to the local handlers handleClick/handleInputChange
		 */
		$($(this.elem).find('*[data-action="true"]')).on("click", {
			scope : me
		}, me.handleClick);

		$($(this.elem).find('*[data-input="true"]')).on("change", {
			scope : me
		}, me.handleInputChange);
	},
	
	/**
	 * 
	 */
	handleClick : function(evtObj) {
		var me = evtObj.data.scope, cell = this;
		var record = me.store.getAt($(cell).attr('RECORD_CURR'));
		var colId = $(cell).attr('COLUMN_ID');
		me.viewConf.raiseEvent(CWEC.CELL_CLICK, {
			record : record,
			columnId : colId
		});
	},
	
	/**
	 * 
	 */
	handleInputChange : function(evtObj) {
		var me = evtObj.data.scope, cell = this;
		var record = me.store.getAt($(cell).attr('RECORD_CURR'));
		var colId = $(cell).attr('COLUMN_ID');
		record[colId] = $(this).val();
		me.viewConf.raiseEvent(CWEC.CELL_DATA_CHANGE, {
			record : record,
			columnId : colId
		});
	}

});

/**
 * 
 */
CLCR.registerCmp({'COMP_TYPE' : 'APP','VIEW_TYPE' : 'VSLIST'}, canvas.lib.view.verticalscollerlistview);