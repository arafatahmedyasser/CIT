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
 

cbx.ns("canvas.lib");
/**
 * This class contains the Ext Js specific Sub-Workspace Container component.
 */
canvas.lib.app.multiapptab = Class(cbx.core.Component, {
	/**
	 * Initializes the widget container component.
	 */
	initialize : function ()
	{
		var me = this;
		LOGGER.info("tab= ", me);
		// me.multiWidgetManager = cbx.core.ws.metadata.getMultiWidgetManager();
		me.rb = CRB.getBundle(this.md.bundleKey);
		//this.rb = CRB.getBundle(this.md.bundleKey);
		var elem = me.elem;
		elem = elem.append('<div id="MULTI_WGT_CONTAINER_' + me.WIDGET_ID + '" ITEM_ID="MULTI_WGT_CONTAINER_'
				+ me.WIDGET_ID + '" class="widgetcontainer multWidgetContainer"></div>');
		me.setCmp(elem);
		me.getCmp().on("remove", function() {
			me.destroy();
		});
		me.tabCont = $(elem.find("div:first"));
		var displayKey = me.WGT_TITLE;
		var title = me.rb[displayKey] || displayKey;
		if (!cbx.core.isEmpty(title) && me.WGT_HEADER_IND === 'Y') {
			me.tabCont.append('<div id="page-title" role="heading" '
					+ 'class="displayinline container page-title accessible-area accessibility-contrast-normal col19 '
					+ me.WIDGET_ID + '-title">' + '<H1>' + title + '</H1>' + '</div');
		}

		me.tabCont.append('<ul class="resp-tabs-list"></ul>');
		me.tabULList = $(elem.find('ul.resp-tabs-list'));
		me.createTabItems(me.md);
	},
	/**
	 * 
	 */
	createTabItems : function (meta)
	{
		var me = this;
		var widgMD = meta.md;
		var multiWidgArr = widgMD.CHILD_WIDGETS;
		var config;
		var firstIndex = null;
		var divRef = null;
		if (!cbx.core.isEmpty(multiWidgArr)) {
			for ( var index = 0; index < multiWidgArr.length; index++) {
				config = {
					elemId : cbx.id(),
					elem : this.getCmp(),
					layoutScope : this,
					uData : this.uData
				};

				cbx.core.extend(config, multiWidgArr[index]);
				var title = me.rb[multiWidgArr[index].WIDGET_DISPLAY_NM] || multiWidgArr[index].WIDGET_DISPLAY_NM;
				me.tabULList.append('<li title="'+title+'">' + title + '</li>');
				if (index == 0) {
					multiWidgArr[index]['initialized']=false;
					firstIndex = this.tabCont.append('<div class="resp-tabs-container"></div>');
					divRef = $(firstIndex.find('div.resp-tabs-container')).append(
							'<div tab-index="' + index + '"></div>').find('div[tab-index="' + index + '"]');
					divRef = $(divRef);
					divRef.attr("ITEM_ID", multiWidgArr[index].WIDGET_ID);
					divRef.data("mwMD", multiWidgArr[index]);
					me.tabSelectionHandler(divRef);
					divRef = null;
				} else {
					multiWidgArr[index]['initialized']=false;
					divRef = $(this.tabCont.find('div.resp-tabs-container')).append(
							'<div tab-index="' + index + '"></div>').find('div[tab-index="' + index + '"]');
					divRef = $(divRef);
					LOGGER.info("divRef", divRef);
					divRef.attr("ITEM_ID", multiWidgArr[index].WIDGET_ID);
					divRef.data("mwMD", multiWidgArr[index]);
					// me.tabSelectionHandler(divRef);
					divRef = null;
				}
			}

			me.tabCont.easyResponsiveTabs({
				type : 'default', // Types: default, vertical,
				// accordion
				width : 'auto', // auto or any width like 600px
				fit : true, // 100% fit in a container
				closed : 'accordion',
				activate : me.handleTabSelection,
				deactivate : me.handleTabSelection,
				scope : me
			});

			// this.tabCont.on('tabactivate', this.handleTabSelection);

		} else {
			config = {
				elemId : cbx.id(),
				elem : this.getCmp(),
				layoutScope : this,
				uData : this.uData,
				loadingInContainer : true
			};
			me.multiWidgetManager.instantiateApp(config);
		}
	},
	/**
	 * 
	 */
	setActiveCardByItemId:function(itemId,repaint){
		//LOGGER.info('easyResponsiveTabs ',this.tabCont.easyResponsiveTabs())
		LOGGER.info('this.respTab----------- ',this.respTab.tabCont)
		if(!cbx.isEmpty(this.respTab) && this.respTab.tabCont && this.respTab.tabCont.setActiveByItemId){
			this.respTab.setActiveByItemId(itemId);
		}
	},
	setActiveCardByIndex:function(index,repaint){
		if(!cbx.isEmpty(this.tabActiveById) && !cbx.isEmpty(index)) {
				this.tabActiveById.apply(this.tabScope,[index])
		}
			//this.respTab.tabCont.setActiveById(index);
		//LOGGER.info('easyResponsiveTabs ',this.tabCont.easyResponsiveTabs().activations())
	},
	getActivations:function(index){
		var that=this;
		return {
	    	setActiveItemId: function(itemId,repaint) {
	    		that.setActiveCardByItemId.apply( that ,[itemId,repaint]); 
	    	},
	    	setActiveIndex: function(index,repaint) {
	    		that.setActiveCardByIndex.apply( that ,[index,repaint]); 
	    	}
		}
	},
	handleTabSelection : function(e) {
		var me = e.scope;
		var $tab = $(e.target);
		var $container = $(e.currentTarget)
		var event = e.type;
		var control = $tab.attr('aria-controls');

		$tabElem = $($container.find('div[aria-labelledby="' + control + '"]'));
		if (event === 'tabactivate') {
			me.tabSelectionHandler($tabElem);
		} else if (event === 'tabdeactivate') {
			me.tabDeSelectionHandler($tabElem);
		}
	},
	tabDeSelectionHandler : function($tabElem) {
		var me = this;
		var data = $tabElem.data('mwMD');
		me.multiWidgetManager.appDeactivateHandler(data);
		// $tabElem.empty();
	},
	/*
	 * tabSelectionHandler is fired when a widget is selected by clicking on it.
	 */
	tabSelectionHandler : function($tabElem) {
		var me = this;
		var data = $tabElem.data('mwMD');
		if (data['initialized'] !== true) { 
			var config = {
				elem : $tabElem,
				WIDGET_ID : data.WIDGET_ID,
				uData : me.uData,
				loadingInContainer : true,
				parent : me
			};
			me.multiWidgetManager.instantiateApp(config);
			data['initialized'] = true;
		}else{
			me.multiWidgetManager.appActivateHandler(data);
		}
	}
});

/**
 * 
 */
CLCR.registerCmp({'COMP_TYPE' : 'MULTI-APP','LAYOUT_TYPE' : 'TAB'}, canvas.lib.app.multiapptab);
