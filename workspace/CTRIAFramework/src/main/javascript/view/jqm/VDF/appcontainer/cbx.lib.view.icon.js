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
cbx.ns('cbx.lib.view');
/*
 * The class is a helper class called by the framework controls to render an icon on the UI.
 * 1. This code creates a control which has one or more no of icons in it
 * 2. The icon may or may not have text.
 * 3. If text is present it can have the following positions left,right,top,bottom.
 * 4. The icons are placed equidistant from the border as well as each other.
 *
 3
 * @ modified for :
*/

cbx.lib.view.icon = Class({
	//Global parameters for the icon control
	parentElem: '',
	iconListener: '',
	iconConfigData: '',
	iconObject : null,
	constructor: function(conf) { 
		this.iconConfigData = typeof conf.icondata === 'string' ? JSON.parse(conf.icondata) : conf.icondata;
		this.bundleKey = !cbx.isEmpty(this.iconConfigData["BUNDLE_KEY"])?this.iconConfigData["BUNDLE_KEY"]:CRB.getFWBundleKey();
		this.parentElem = conf.parentElem;
		this.iconListener = conf.iconlistener;
		this.additionalClass = conf.additionalClass?conf.additionalClass:'';
		this.createIconControl();
	},
	createIconControl: function () {
		if (typeof this.iconConfigData.APP_TYPE !== 'undefined') {
			if (this.iconConfigData.APP_TYPE === 'HEADER') {
				this.createHeaderIcon();
			}
			else {
				this.createDashBoardIcon();
			}
		}
	}, 
	createDashBoardIcon : function() {
		var iconConfig;
		iconConfig = {
			'eleType': 'div', 
			'class':"x-app-icon"+" "+this.iconConfigData.APP_CSS_CLASS+" "+this.additionalClass,
			'id': this.iconConfigData.APP_ID+this.iconConfigData.idSuffix
		};
		if (typeof this.iconConfigData.ICON_HOVER_IMAGE_PATH !== 'undefined' && this.iconConfigData.ICON_HOVER_IMAGE_PATH !== '') {
			iconConfig['onMouseOver'] = "javascript: this.style.background = 'url(" + this.iconConfigData.ICON_HOVER_IMAGE_PATH + ") no-repeat #014b66'";
			iconConfig['onMouseOut'] = "javascript: this.style.background = 'url("+this.iconConfigData.ICON_IMAGE_PATH+") no-repeat #014b66'";
		}
		this.iconObject = new cbx.lib.layer(iconConfig);
		
		
		
		contextappConfig = {
				"eleType": "div",
				"class": "contextapp-icon"
			};
		var contextappiconObject = new cbx.lib.layer(contextappConfig).getLayer();
		this.iconObject.addLayer(contextappiconObject);
		
		
		
		
		contextappGIConfig = {
				"eleType": "div",
				"class": "contextapp-glassyicon"
			};
		var contextappgiconObject = new cbx.lib.layer(contextappGIConfig).getLayer();
		this.iconObject.addLayer(contextappgiconObject);
		
		
		if (!cbx.isEmpty(this.iconConfigData.APP_DISPLAY_NM_KEY)) {
			if (typeof this.iconConfigData.APP_DISPLAY_NM_KEY === 'object') {
				for (var i = 0 ; i < this.iconConfigData.APP_DISPLAY_NM_KEY.length ; i++) {
					var iconTextConfig = {
						"eleType": "span",
						"html": this.iconConfigData.APP_DISPLAY_NM_KEY[i].APP_DISPLAY_NM_KEY
					};
					if( typeof this.iconConfigData.APP_DISPLAY_NM_KEY[i].CLASS !== 'undefined' ) {
						iconTextConfig['class'] = "username typeE";
						iconTextConfig['style'] = {"color": "#ffffff","display": "block","width": "190px"};
					}
					var iconTextObject = new cbx.lib.layer(iconTextConfig).getLayer();
					this.iconObject.addLayer(iconTextObject);
				}
			}
			else {
				var text = iportal.jsutil.getTextFromBundle(this.bundleKey,this.iconConfigData.APP_DISPLAY_NM_KEY);
				spanConfig = {
					"eleType": "span",
					"class": "contextapp-label",
					"html": text
				};
				var iconTextObject = new cbx.lib.layer(spanConfig).getLayer();
				/* iconTextObject.onclick = function() {
					alert('in onclick')
					//alert(that.iconListener);
				} */
				this.iconObject.addLayer(iconTextObject);
			}
			var that = this;
			var temp = this.iconObject.getLayer();
			temp.onclick = function(event) {
				var scope= {
					evt :	event,
					appDetails :that.iconConfigData 
				}
				if(that.parentElem && that.parentElem.raiseEvent){
					that.parentElem.raiseEvent(that.iconListener,scope);
				}else{
					return;
				}
			};
			this.iconObject.setLayer(temp);
		}
	},
	createHeaderIcon : function() {
		var iconConfig;
		var iconContainerConfig;
		var iconContainerObject;
		var imageConfig;
		var imageObject;
		iconContainerConfig = {
			"eleType": "div",
			"style": {
				"display": "inline-block",
				"margin": "0px 10px",
				"height": "50px"
			}
		};
		this.iconObject = new cbx.lib.layer(iconContainerConfig);
		iconSpanConfig = {
			"eleType": "span"
		};
		iconSpanObject = new cbx.lib.layer(iconSpanConfig);
		imageConfig = {
			"eleType" : "img",
			'class':"x-app-icon"+" "+this.iconConfigData.APP_CSS_CLASS,
			"id": this.iconConfigData.APP_ID
			
		};
		imageObject = new cbx.lib.layer(imageConfig).getLayer();
		var that = this;
		imageObject.onclick = function(event) {
			that.parentElem.raiseEvent(that.iconListener,event);
		};
		iconSpanObject.addLayer(imageObject);
		this.iconObject.addLayer(iconSpanObject.getLayer());
		/*Check whether the type of text is object or not
          If it is object itterate the object and create the span
		*/
		if (cbx.isObject(this.iconConfigData.APP_DISPLAY_NM_KEY)) {
			var iconTextArray = this.iconConfigData.APP_DISPLAY_NM_KEY;
			var textSpanConfig = {
				"eleType": "span",
				"style" :{
					"display": "inline-block",
					"vertical-align": "top"
				}
			};
			var textSpanObject = new cbx.lib.layer(textSpanConfig);
			for ( var i = 0; i < iconTextArray.length; i++ ) {
				var iconTextConfig = {
					"eleType": "span",
					"style": {
						"display": "block",
						"width": "250px",
						"padding-left": "5px"		
					},
					"class": "typeE",
					"html": iconTextArray[i].APP_DISPLAY_NM_KEY
				};
				var iconTextObject = new cbx.lib.layer(iconTextConfig).getLayer();
				textSpanObject.addLayer(iconTextObject);
			}
			this.iconObject.addLayer(textSpanObject.getLayer());
		}
		else {
			if(!cbx.isEmpty(this.iconConfigData.APP_DISPLAY_NM_KEY) && cbx.isString(this.iconConfigData.APP_DISPLAY_NM_KEY.trim() !== '')) {
				var iconText = iportal.jsutil.getTextFromBundle(this.bundleKey,this.iconConfigData.APP_DISPLAY_NM_KEY);
				var iconTextConfig = {
					"eleType": "span",
					"html" : this.iconConfigData.APP_DISPLAY_NM_KEY
				};
				if (typeof this.iconConfigData.BUBBLE_TEXT !== 'undefined' && this.iconConfigData.BUBBLE_TEXT.trim().toUpperCase() === 'Y') {
					iconTextConfig['class'] = "bubbletext typeF";
				}
				var iconTextObject = new cbx.lib.layer(iconTextConfig).getLayer();
				this.iconObject.addLayer(iconTextObject);
			}
		}
	},
	getIconControlDOM : function() {
		return this.iconObject.getLayer();
	}
});	