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
/*
 * The class provides a container to host all the child widgets
 *
 
*/
cbx.ns("cbx.lib");
cbx.lib.popup = Class(cbx.core.Component, {
	popupMetaData: '',
	popupBusinessData: '',
	id: '',
	header: '',
	showbuttons: '',
	bottomBar: '',
	popupContentIndex : 1,
	rendererTo: '',
	editable: '',
	constructor: function(popupConfig) {
		cbx.lib.popup.$super.call(this);
		rendererTo = popupConfig.elem;
		this.popupMetaData = popupConfig.popupConfigData.POPUP_DETAILS;
		this.header = this.popupMetaData.HEADER;
		this.bottomBar = this.popupMetaData.BOTTOM_BAR_BUTTONS;
		this.showbuttons = this.popupMetaData.SHOWBUTTONS;
		this.editable = this.popupMetaData.EDITABLE;
		this.closable = this.popupMetaData.CLOSABLE;
		this.closeButtonPos = this.popupMetaData.CLOSE_BTN_POS;
		this.registerListener("cbxtap",this.handleCBXTap);
		this.initializePopup();
	},
	initializePopup:function() {
		var classNames ='';
		var height = '400px'; 
		var poupConf;
		var width = '400px';
		if(typeof this.popupMetaData.ROUNDED_CORNERS != 'undefined' &&  this.popupMetaData.ROUNDED_CORNERS =='Y') {
			borderRadious = 'ui-corner-all';
		}
		if (typeof this.popupMetaData.POPUP_WIDTH !== 'undefined' && this.popupMetaData.POPUP_WIDTH !== '') {
			width = this.popupMetaData.POPUP_WIDTH+'px !important';
		}
		if (typeof this.popupMetaData.POPUP_HEIGHT !== 'undefined' && this.popupMetaData.POPUP_HEIGHT !== '') {
			height = this.popupMetaData.POPUP_HEIGHT+'px !important';
		}
		poupConf = {
			"eleType": "div",
			id: this.popupMetaData.POPUP_ID,
			"data-role": "popup",
			"data-corners": "true",
			"style": {
				"max-height": height,
				"max-width": width
			},
			"class": classNames
		};
		poupObj = new cbx.lib.layer(poupConf);		
		this.addItem(poupObj);
		/*Check whether the header is enable or not. Id yes create header other wise discard*/
		if(typeof this.header != 'undefined' && this.header == 'Y') {
			var headerConf;
			var headerConfObj;
			headerConf = {
				"eleType": "div",
				"data-role": "header",
				"data-theme": "a",
				"class": "ui-corner-top",
				style:{
					height: "44px"
				}
			};
			headerConfObj = new cbx.lib.layer(headerConf);
			this.addItem(headerConfObj);
			this.getItem(0).addLayer(headerConfObj.getLayer());
		}
		var popupContent;
		var popupContentObj;
		popupContent = {
			"eleType":"div",
			"data-role":"content",
			"data-theme":"c",
			"class":"ui-corner-bottom ui-content"
		};
		popupContentObj = new cbx.lib.layer(popupContent);
		this.addItem(popupContentObj);
		this.getItem(0).addLayer(popupContentObj.getLayer());
		//this.requestBusinessData();
		this.populateBusinessData()
	},
	
	requestBusinessData:function() {
		 this.popupBusinessData  = MockJS.furnishControlBusinessData();
	},
	populateBusinessData: function() {
		if(typeof this.header != 'undefined' && this.header == 'Y') {
			var titleConf;
			var titleConfObj;
			titleConf = {
				"eleType": "h1",
				"html": this.popupMetaData.HEADER_TEXT.toString()
			};
			if(typeof this.closable != 'undefined' && this.closable== 'Y' ){				
				if (typeof this.closeButtonPos != 'undefined' && this.closeButtonPos== 'right' ){
					var closeButton;
					var closeButtonObj; 
					closeButton = {
						"eleType": "a",
						"href": "#",
						"data-rel": "back",
						"data-role": "button",
						"data-icon": "delete",
						"data-iconpos": "notext",
						"class": "ui-btn-right" 
					};
					closeButtonObj = new cbx.lib.layer(closeButton);
					this.addItem(closeButtonObj);
					this.getItem(1).addLayer(closeButtonObj.getLayer());
				}
				else
				{
					var closeButton;
					var closeButtonObj; 
					closeButton = {
						"eleType": "a",
						"href": "#",
						"data-rel": "back",
						"data-role": "button",
						"data-icon": "delete",
						"data-iconpos": "notext",
						"class": "ui-btn-left" 
					};
					closeButtonObj = new cbx.lib.layer(closeButton);
					this.addItem(closeButtonObj);
					this.getItem(1).addLayer(closeButtonObj.getLayer());
				}
			}
			titleConfObj = new cbx.lib.layer(titleConf).getLayer();
			this.getItem(1).addLayer(titleConfObj);
			this.popupContentIndex = 2;
		}
		if(typeof this.editable != 'undefined' && this.editable == 'Y') {
			var notesConf;
			var notesObj;
			notesConf = {
				"eleType": "textarea",
				"rows": "8",
				"cols": "40",
				style: {
					color: "#000",
					padding: "10px"
				}
			};
			notesObj = new cbx.lib.layer(notesConf).getLayer();
			this.getItem(this.popupContentIndex).addLayer(notesObj);
		}
		else
		{
			if (typeof this.popupMetaData.CHILDREN !== 'undefined') {
				var childElementsLength = this.popupMetaData.CHILDREN.length;
				for (var child = 0; child < childElementsLength; child++) {
					if(this.popupMetaData.CHILDREN[child].hasOwnProperty('FLD_VIEW_TYPE')) {
						if (typeof this.popupMetaData.CHILDREN[child].FLD_VIEW_TYPE !== 'undefined') {
							if (this.popupMetaData.CHILDREN[child].FLD_VIEW_TYPE.trim().toUpperCase() === 'LIST') {
								var listWrapper = new cbx.lib.List({"widgetID":this.popupMetaData.POPUP_ID,"md":this.popupMetaData.CHILDREN[child]});
								this.getItem(this.popupContentIndex).addLayer(listWrapper.getListContainer());
								
							}
							else if (this.popupMetaData.CHILDREN[child].FLD_VIEW_TYPE.trim().toUpperCase() === 'MESSAGE') {
								var popupContent;
								var popupContentObj;
								popupContent = {
									"eleType": "p",
									"class": "popupcontent",
									"html": this.popupMetaData.CHILDREN[child].POPUP_TEXT.toString()
								};
								popupContentObj = new cbx.lib.layer(popupContent).getLayer();
								this.getItem(this.popupContentIndex).addLayer(popupContentObj);
							}
						}
					}
					else if (this.popupMetaData.CHILDREN[child].hasOwnProperty('itemType')) {
						if (this.popupMetaData.CHILDREN[child].itemType.trim().toUpperCase() === 'COMBO') {					
							//var t = {'comboBoxConfig':this.popupMetaData.CHILDREN[child],'comboBoxData':this.popupMetaData.CHILDREN[child].additionalData[this.popupMetaData.CHILDREN[child].itemId]};							
							this.popupMetaData.CHILDREN[child]['additionalData'] = this.popupMetaData.additionalData[this.popupMetaData.CHILDREN[child]['itemId']];
							var comboBoxDOM = new cbx.lib.formElement.cbxComboBox(this.popupMetaData.CHILDREN[child]).getComponentDOM();
							this.getItem(this.popupContentIndex).addLayer(comboBoxDOM);
						}
						if (this.popupMetaData.CHILDREN[child].itemType.trim().toUpperCase() === 'TEXTAREA') {
							var comboBoxDOM = new cbx.lib.formElement.cbxTextArea(this.popupMetaData.CHILDREN[child]).getComponentDOM();
							this.getItem(this.popupContentIndex).addLayer(comboBoxDOM);
						}
						 if (this.popupMetaData.CHILDREN[child].itemType.trim().toUpperCase() === 'LABEL') {
							
							var comboBoxDOM = new cbx.lib.formElement.cbxLabel(this.popupMetaData.CHILDREN[child]).getComponentDOM();
							this.getItem(this.popupContentIndex).addLayer(comboBoxDOM);
						} 
					}
				}
			}
		}
		if(typeof this.showbuttons != 'undefined' && this.showbuttons == 'Y' ) {
			if (typeof this.bottomBar !== 'undefined') {
				var bottomBarButtonsLength = this.bottomBar.length;
				var bottomBarConf = {
					"id" : "BOTTOM_BAR",
					"class": "bottombar",
					"eleType": "div"
				};
				bottomBarObj = new cbx.lib.layer(bottomBarConf);
				for ( var button = 0; button < bottomBarButtonsLength; button ++ ) {
					var buttonConfig = {
						"eleType": "div",
						"data-role": "button",
						"data-inline": "true",
						"data-mini": "true",
						"data-theme": "c",
						"html": this.bottomBar[button].BTN_DISPLAY_NM.toString(),
						"id": this.bottomBar[button].BTN_ID,
						"listeners": "cbxtap",
						"parent": this
					};
					buttonConfigObj = new cbx.lib.layer(buttonConfig);
					bottomBarObj.addLayer(buttonConfigObj.getLayer());
				}
				this.getItem(this.popupContentIndex).addLayer(bottomBarObj.getLayer());
			}
		}
		
	},
	getPopupContainer:function() {
		return this.getItem(0).getLayer();
	},
	handleCBXTap :function() {
		console.log('handleAbc');
	}
	
});
CLCR.registerCmp({'VIEW_TYPE':'POPUP'}, cbx.lib.popup);
	
	
	