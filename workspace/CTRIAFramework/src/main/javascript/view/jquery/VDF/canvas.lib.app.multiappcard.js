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
 * 
 */
canvas.lib.app.multiappcard = Class(cbx.core.Component, {
	/**
	 * Initializes the widget container component.
	 */
	initialize : function() {
		var me = this;
		LOGGER.info("Card= ", me);
		me.rb = CRB.getBundle(me.WIDGET_BUNDLE_KEY);
		var elem = me.elem;
		elem = elem.append('<div id="MULTI_WGT_CONTAINER_' + me.WIDGET_ID + '" ITEM_ID="MULTI_WGT_CONTAINER_'
				+ me.WIDGET_ID + '" class="widgetcontainer multWidgetContainer"></div>');
		me.setCmp(elem);
		me.getCmp().on("remove", function() {
			me.destroy();
		});
		me.cardCont = $(elem.find("div:first"));
		var displayKey = me.WGT_TITLE;
		var title = me.rb[displayKey] || displayKey;
		if (!cbx.core.isEmpty(title) && me.WGT_HEADER_IND === 'Y') {
			me.cardCont.append('<div id="page-title_"'+ me.WIDGET_ID+'  role="heading" '
					+ 'class="displayinline container page-title accessible-area accessibility-contrast-normal col19 '
					+ me.WIDGET_ID + '-title">' + '<H1>' + title + '</H1>' + '</div>');
		}		
		me.createCardItems(me.md);
	},
	/**
	 * 
	 */
	createCardItems : function(meta) {
		var me = this;
		var widgMD = meta.md;
		var multiWidgArr = widgMD.CHILD_WIDGETS;
		var config;
		var firstIndex = null;
		var divRef = null;
		var cardFlag=true;
		var activeCard=0;
		config = {
				elemId : cbx.id(),
				elem : this.getCmp(),
				layoutScope : this,
				uData : this.uData
			};
		if(config.uData && config.uData.activeCard && parseInt(config.uData.activeCard)>0){
			cardFlag=false;	
			activeCard=parseInt(config.uData.activeCard);
		}
		if (!cbx.core.isEmpty(multiWidgArr)) {
			for ( var index = 0; index < multiWidgArr.length; index++) {			

				cbx.core.extend(config, multiWidgArr[index]);
				var title = me.rb[multiWidgArr[index].WIDGET_DISPLAY_NM] || multiWidgArr[index].WIDGET_DISPLAY_NM;
				//delete multiWidgArr[index]['initialized'];
				
				if(activeCard>0 && index==activeCard){
					multiWidgArr[index]['initialized']=false;					
					divRef = $(firstIndex.find('div.resp-cards-container')).append(
							'<div card-index="' + index + '" class="resp-tab-content resp-active"></div>').find('div[card-index="' + index + '"]').attr('style', 'display:block').append('<div class="displayinline container page-title accessible-area accessibility-contrast-normal col15 '
									+ me.WIDGET_ID + '-title">' + '<H2>' + title + '</H2>' + '</div>');
					divRef = $(divRef);
					LOGGER.info("divRef", divRef);
					divRef.attr("ITEM_ID", multiWidgArr[index].WIDGET_ID);
					divRef.data("mwMD", multiWidgArr[index]);
					me.cardSelectionHandler(divRef);
					divRef = null;
					
				}else{
					if ((activeCard==0 && index == 0) && cardFlag) {
						multiWidgArr[index]['initialized']=false;
						firstIndex = this.cardCont.append('<div class="resp-cards-container"></div>');
						divRef = $(firstIndex.find('div.resp-cards-container')).
						append('<div card-index="' + index + '" class="resp-tab-content resp-active"></div>')
								.find('div[card-index="' + index + '"]').attr('style', 'display:block')
								.append('<div class="displayinline container page-title accessible-area accessibility-contrast-normal col15 '
						+ me.WIDGET_ID + '-title">' + '<H2>' + title + '</H2>' + '</div>');
						divRef = $(divRef);
						
						divRef.attr("ITEM_ID", multiWidgArr[index].WIDGET_ID);
						divRef.data("mwMD", multiWidgArr[index]);
						me.cardSelectionHandler(divRef);
						divRef = null;
					} 
					else {
						if(index == 0){
							firstIndex = this.cardCont.append('<div class="resp-cards-container"></div>');	
						}
						multiWidgArr[index]['initialized']=false;
						divRef = $(firstIndex.find('div.resp-cards-container')).append(
								'<div card-index="' + index + '" class="resp-tab-content"></div>').find('div[card-index="' + index + '"]').append('<div class="displayinline container page-title accessible-area accessibility-contrast-normal col15 '
										+ me.WIDGET_ID + '-title">' + '<H2>' + title + '</H2>' + '</div>');
						divRef = $(divRef);
						LOGGER.info("divRef", divRef);
						divRef.attr("ITEM_ID", multiWidgArr[index].WIDGET_ID);
						divRef.data("mwMD", multiWidgArr[index]);
						divRef = null;
					}
				}
			/*	if (index == 0) {
					multiWidgArr[index]['initialized']=false;
					firstIndex = this.cardCont.append('<div class="resp-cards-container"></div>');
					divRef = $(firstIndex.find('div.resp-cards-container')).
					append('<div card-index="' + index + '" class="resp-tab-content resp-active"></div>')
							.find('div[card-index="' + index + '"]').attr('style', 'display:block')
							.append('<div class="displayinline container page-title accessible-area accessibility-contrast-normal col15 '
					+ me.WIDGET_ID + '-title">' + '<H2>' + title + '</H2>' + '</div>');
					divRef = $(divRef);
					
					divRef.attr("ITEM_ID", multiWidgArr[index].WIDGET_ID);
					divRef.data("mwMD", multiWidgArr[index]);
					me.cardSelectionHandler(divRef);
					divRef = null;
				} else {
					multiWidgArr[index]['initialized']=false;
					divRef = $(firstIndex.find('div.resp-cards-container')).append(
							'<div card-index="' + index + '" class="resp-tab-content"></div>').find('div[card-index="' + index + '"]').append('<div class="displayinline container page-title accessible-area accessibility-contrast-normal col15 '
									+ me.WIDGET_ID + '-title">' + '<H2>' + title + '</H2>' + '</div>');
					divRef = $(divRef);
					LOGGER.info("divRef", divRef);
					divRef.attr("ITEM_ID", multiWidgArr[index].WIDGET_ID);
					divRef.data("mwMD", multiWidgArr[index]);
					divRef = null;
				}*/
			}

			

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
		var elementByItemId=this.getElementByItemid(itemId)||'';
		repaint=cbx.isEmpty(repaint)?false:true;
		if(!cbx.isEmpty(elementByItemId)){
			this.cardDeSelectionHandler(this.cardCont.find('div.resp-active'),repaint);	
			this.cardCont.find('div.resp-tab-content').removeClass('resp-active').removeAttr('style');
			elementByItemId=$(elementByItemId);
			
			if(repaint){
				var data = elementByItemId.data('mwMD');
				var appId=this.multiWidgetManager.getAppById(data.WIDGET_ID)
				if(!cbx.isEmpty(appId) && (appId.clearElement())){
					appId.clearElement();
				}
			elementByItemId.data('mwMD')['initialized']=false;		
			}					
			elementByItemId.addClass('resp-active');
			elementByItemId.attr('style', 'display:block');
			
			this.cardSelectionHandler(elementByItemId);
		}	
	},
	
	/**
	 * 
	 */
	cardDeSelectionHandler : function($tabElem) {
		var me = this;
		var data = $tabElem.data('mwMD');
		me.multiWidgetManager.appDeactivateHandler(data);
		
	},
	/**
	 * 
	 */
	setActiveCardByIndex:function(index,repaint){
		var elementByIndex=this.getElementByIndex(index)||'';
		repaint=cbx.isEmpty(repaint)?false:true;
		if(!cbx.isEmpty(elementByIndex)){
			this.cardDeSelectionHandler(this.cardCont.find('div.resp-active'),repaint);				
			this.cardCont.find('div.resp-tab-content').removeClass('resp-active').removeAttr('style');	
			elementByIndex=$(elementByIndex);
			if(repaint){	
				var data = elementByIndex.data('mwMD');
				var appId=this.multiWidgetManager.getAppById(data.WIDGET_ID)
				if(!cbx.isEmpty(appId) && (appId.clearElement())){
					appId.clearElement();
				}
			elementByIndex.data('mwMD')['initialized']=false;		
			}	
			elementByIndex.addClass('resp-active');
			elementByIndex.attr('style', 'display:block');			
			this.cardSelectionHandler(elementByIndex);
		}
	},
	/**
	 * 
	 */
	getElementByItemid:function(itemId){
		return this.cardCont.find("[item_id=" + itemId + "]");
	},
	/**
	 * 
	 */
	getElementByIndex:function(index){
		return this.cardCont.find('.resp-tab-content:eq(' + index + ')');
	},
	/**
	 * 
	 */
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
	/**
	 * 
	 */
	cardSelectionHandler : function($cardElem) {
		var me = this;
		var data = $cardElem.data('mwMD');
		if (data['initialized'] !== true) { 
			var config = {
				elem : $cardElem,
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

CLCR.registerCmp({'COMP_TYPE' : 'MULTI-APP', 'LAYOUT_TYPE' : 'CARD'}, canvas.lib.app.multiappcard);
