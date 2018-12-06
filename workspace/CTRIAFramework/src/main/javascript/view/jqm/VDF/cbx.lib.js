/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
cbx.ns("cbx.lib");

/*
 * This class contains the viewport component.
 */

cbx.lib.viewport = Class(cbx.core.Component, {
	/* Initializes the component. This contains the JS library specific component object. */
	initialize : function ()
	{
		// Creating the view port object by instantiating the layer class
		var cClass = CLCR.getCmp({
			'COMP_TYPE' : 'CONTEXT_APP_PANEL'
		});
		var contextApp = new cClass({
			elem : $('#app')
		})
		var viewportConfig = {
			"eleType" : "div",
			"id" : "JQM-CONTENT",
			style : {
				width : "100%"
			// height:"100%"
			}
		};
		var viewportConfigObj = new cbx.lib.layer(viewportConfig).getLayer();
		this.addItem(viewportConfigObj);
		var config = {
			elem : viewportConfigObj,
			preferredWorkspaces : this.preferredWorkspaces,
			preferredInitialWorkspace : this.preferredInitialWorkspace
		};

		var headerClass = CLCR.getCmp({
			'COMP_TYPE' : 'APPLICATION_HEADER',
			'LAYOUT' : "MENU"
		});
		var header = new headerClass({
			config : this,
			'parentElem' : $('#HEADER_DIV')
		});
		// var content = header.getItem(0).html();
		/* $('#HEADER_DIV').append(header.getItem(0).html()); */

		var footerClass = CLCR.getCmp({
			'COMP_TYPE' : 'APPLICATION_FOOTER',
			'LAYOUT' : "MENU"
		});
		if (footerClass)
		{
			var footer = new footerClass();
			this.addItem(footer.getItem(0));

			// $('#FOOTER_DIV').append(footer.getItem(0));

		}
		var that = this;
		setTimeout(function ()
		{
			// Calling the core workspace manager to assign it to this.wsManager with the config object containing the
			// viewport component.
			that.wsManager = new cbx.core.WSManager(config);
			// adds the app container as viewport's child. This app container contains the workspace container.
			that.getItem(0).appendChild(that.wsManager.getContainer().getAppContainer());
			$("#CONTENT_DIV").prepend(that.getItem(0));
		}, 500);

		/*
		 * $("#CONTENT_DIV").on("swipeleft",function(){ $("#wscontainer").panel( "open"); });
		 */
		// cbx.core.ws.metadata.setCurrentWorkspaceId("RETAIL_HOME");
		/*
		 * var conf = { WORKSPACE_ID:"RETAIL_HOME" };
		 */
		/*
		 * this.wsManager.wsSelectionHandler(conf,null,function(wsContainer){
		 * cbx.core.ws.metadata.setCurrentWorkspace(wsContainer); });
		 */

		$(document).ready(function ()
		{
			setTimeout(function ()
			{
				// cbx.lib.workspacehandler.activateWorkspace(null,0);
				var preferredInitialWorkspaceId = that.preferredInitialWorkspace;
				var preferredWorkspacesArr = (that.preferredWorkspaces) ? that.preferredWorkspaces.split("|") : [];
				// If preferredInitialWorkSpace exists in query string load the workspace
				if (!canvas.isEmpty(preferredInitialWorkspaceId))
				{
					cbx.lib.utility.loadInitialWorkspace(preferredInitialWorkspaceId);
				} else
				{
					if (!canvas.isEmpty(preferredWorkspacesArr))
					{
						cbx.lib.utility.loadInitialWorkspace(preferredWorkspacesArr[0])
					} else
					{
						cbx.lib.utility.loadInitialWorkspace(null);
					}
				}
			}, 500);

			if (!cbx.isIE())
			{
				if (true == iportal.preferences.isLangDirectionRTL())
				{
					$('#app').on('swiperight', function (event)
					{
						event.stopImmediatePropagation();
					});
					$('#app').on("swipeleft", function ()
					{
						if (!$('.cbx-maskable-content').hasClass('cbx-panel-closed'))
						{
							$('.cbx-maskable-content').popup('close');
						} else if (!$('#context-app-panel-popup').hasClass('ui-popup-hidden'))
						{

							return;
						} else if (cbx.core.ws.metadata.getCurrentWorkspaceId() !== "ADDITIONAL_REQUEST")
						{
							cbx.lib.utility.openHeaderPopup();
						}
					});
				} else
				{
					$('#app').on("swiperight", function ()
					{
						if (!$('.cbx-maskable-content').hasClass('cbx-panel-closed'))
						{
							$('.cbx-maskable-content').popup('close');
						} else if (!$('#context-app-panel-popup').hasClass('ui-popup-hidden'))
						{

							return;
						} else if (cbx.core.ws.metadata.getCurrentWorkspaceId() !== "ADDITIONAL_REQUEST")
						{
							cbx.lib.utility.openHeaderPopup();
						}
					});
				}
			}

		});

		/*
		 * $("#staticAdsPanel").on({ panelclose : function(){ $("#staticAdsPanel").addClass('cbx-panel-closed'); },
		 * panelopen : function(){ $("#staticAdsPanel").removeClass('cbx-panel-closed'); } });
		 */

		/**
		 * Disabling swipe events on page during TFD flow
		 */
		/*
		 * $('#app').on("swiperight",function(){ if(!$('.cbx-maskable-content').hasClass('cbx-panel-closed')){
		 * $('.cbx-maskable-content').popup('close'); }
		 * if(cbx.core.ws.metadata.getCurrentWorkspaceId()!=="ADDITIONAL_REQUEST"){ cbx.lib.utility.openHeaderPopup(); }
		 * });
		 */
		/*
		 * $('#app').on("swipeleft",function(){ if(cbx.core.ws.metadata.getCurrentWorkspaceId()!=="ADDITIONAL_REQUEST"){
		 * //if($('#wscontainer').hasClass('cbx-panel-closed')){ $('#staticAdsPanel').panel('open'); var contentCurrent =
		 * $('.ui-content').height(); $('#adspanel').height(contentCurrent); //} } });
		 */

		/*
		 * document.getElementById("HEADER_DIV").appendChild(this.wsManager.getWorkspaceHeader()); new
		 * cbx.items.apps.Demo();
		 */
		/**
		 * Footer element
		 */

	}
});
CLCR.registerCmp({
	'VIEW_TYPE' : 'VIEWPORT'
}, cbx.lib.viewport);

/*
 * This class is used for to register the form components
 */
cbx.ns('cbx.core.form');
cbx.core.form.FormRegistry = function ()
{
	var register = {};
	var serialize = function (obj)
	{
		var keys = [];
		for (i in obj)
		{
			if (obj.hasOwnProperty(i))
			{
				keys.push(i);
			}
		}
		keys.sort();
		var str = '';
		var key;
		for (var i = keys.length - 1; i >= 0; i--)
		{
			key = keys[i]
			str += '|' + key + ':' + obj[key] + '|';
		}
		return str;
	}
	return {
		getFormCmp : function (config)
		{
			if (register[serialize(config)])
			{
				return register[serialize(config)];
			} else
			{
				LOGGER.error("No cbx form component is registered with the following config options:", config);
			}
		},
		registerFormCmp : function (config, className)
		{
			this.addJqmAPIs(className);
			register[serialize(config)] = className;
		},
		addJqmAPIs : function (className)
		{
			className.prototype.formElement = null;
			className.prototype.showItem = function ()
			{
				$(this.getComponentDOM()).show();
				this.hidden = false;
				if (this.xtype !== "cbx-fileuploadpanel")
				{
					var formFields = $(this.getComponentDOM()).find('*').show();
				}
				$(this.getComponentDOM()).find('label').css('display', 'inline-block');
				$(this.getComponentDOM()).removeClass("jqm-display-hide");
				$(this.getComponentDOM()).addClass("jqm-form-field-c jqm-cbxButton");
				this.afterShow && cbx.isFunction(this.afterShow) ? this.afterShow() : cbx.emptyFn();
				doIScroll('CONTENT_DIV', 'refresh');
			};
			className.prototype.hideItem = function ()
			{

				$(this.getComponentDOM()).hide();
				this.hidden = true;
				if (this.xtype !== "cbx-fileuploadpanel")
				{
					$(this.getComponentDOM()).find('*').hide();
				}
				$(this.getComponentDOM()).addClass("jqm-display-hide");
				/**
				 * start CTMQ315F15
				 */
				if( $(this.getComponentDOM()).find('textarea').children().length > 0  && !$(this.getComponentDOM()).hasClass('statictextarea')){//12/10/15
					doIScroll('CONTENT_DIV');
					doIScroll('CONTENT_DIV','add');
				}else{
					doIScroll('CONTENT_DIV','refresh');
				}
				/*ends CTMQ315F15*/
				
			};
			className.prototype.enable = function ()
			{
				this.disabled = false;
				if (this.xtype == "cbx-combobox")
				{
					$(this.getFormField()).removeAttr('disabled');
					$(this.getFormField()).removeClass('mobile-selectmenu-disabled ui-state-disabled ui-disabled');
					var parentDiv = $(this.getFormField()).parent('div:first');
					var parentAnchor = $(this.getFormField()).parent('div:first').children("a");
					parentDiv.removeClass('ui-disabled');
					parentDiv.removeAttr('disabled');
					parentAnchor.removeClass('ui-disabled');
					parentAnchor.removeAttr('disabled');
					$('#' + this.itemId + '_field').selectmenu('enable');
					$('#' + this.itemId + '_field').selectmenu("refresh");
				} else if (this.xtype == "cbx-spinnerfield")
				{
					$(this.spinnerTextField.getLayer()).removeAttr('disabled');
					$(this.downButtonObject.getLayer()).removeAttr('disabled');
					$(this.upButtonObject.getLayer()).removeAttr('disabled');
					$(this.spinnerTextField.getLayer()).removeClass('ui-disabled');
					var parentDiv = $(this.spinnerTextField.getLayer()).parent('div:first');
					parentDiv.removeClass('ui-disabled');
					parentDiv = $(this.downButtonObject.getLayer()).parent('div:first');
					parentDiv.removeClass('ui-disabled ui-btn-active');
					parentDiv = $(this.upButtonObject.getLayer()).parent('div:first');
					parentDiv.removeClass('ui-disabled ui-btn-active');
				} else if (this.xtype == "cbx-radiogroup" || this.xtype == "cbx-checkboxgroup")
				{
					var type = this.xtype == "cbx-radiogroup" ? "radio" : "checkbox";
					$('input:' + type + '[name="' + this.itemId + '"]').checkboxradio("option", {
						disabled : false
					});
					$('input:' + type + '[name="' + this.itemId + '"]').checkboxradio('enable');
				} else if (this.xtype == "cbx-button")
				{
					$(this.buttonConfigObject.getLayer()).removeAttr('disabled');
					$(this.buttonConfigObject.getLayer()).removeClass('ui-disabled');
				}

				else if (this.xtype == "cbx-datefield")
				{
					this.getFormField().textinput();
					this.getFormField().textinput('enable');
					this.getFormField().datebox();
					this.getFormField().datebox('enable');
				}

				else
				{
					$(this.getFormField()).removeAttr('disabled');
					$(this.getFormField()).removeClass('ui-disabled');
					var parentDiv = $(this.getFormField()).parent('div:first');
					parentDiv.removeClass('ui-disabled');
				}
			};
			className.prototype.disable = function ()
			{
				this.disabled = true;
				if (this.xtype == "cbx-combobox")
				{
					$(this.getFormField()).attr('disabled', 'disabled');
					$(this.getFormField()).addClass('ui-disabled');
					var parentDiv = $(this.getFormField()).parent('div:first');
					parentDiv.removeClass('ui-disabled');
					var parentAnchor = $(this.getFormField()).parent('div:first').children("a");
					parentAnchor.addClass('ui-disabled');
					$('#' + this.itemId + '_field').selectmenu('disable');
					$('#' + this.itemId + '_field').prop("disabled", true);
					$('#' + this.itemId + '_field').selectmenu("refresh");
				} else if (this.xtype == "cbx-radiogroup" || this.xtype == "cbx-checkboxgroup")
				{
					var type = this.xtype == "cbx-radiogroup" ? "radio" : "checkbox";
					$('input:' + type + '[name="' + this.itemId + '"]').checkboxradio("option", {
						disabled : true
					});
					$('input:' + type + '[name="' + this.itemId + '"]').checkboxradio('disable');
				} else if (this.xtype == "cbx-spinnerfield")
				{
					$(this.downButtonObject.getLayer()).attr('disabled', 'disabled');
					$(this.upButtonObject.getLayer()).attr('disabled', 'disabled');
					$(this.spinnerTextField.getLayer()).attr('disabled', 'disabled');
					$(this.spinnerTextField.getLayer()).addClass('ui-disabled');
					var parentDiv = $(this.downButtonObject.getLayer()).parent('div:first');
					parentDiv.addClass('ui-disabled');
					parentDiv.removeClass('ui-btn-active');
					parentDiv = $(this.upButtonObject.getLayer()).parent('div:first');
					parentDiv.addClass('ui-disabled');
					parentDiv.removeClass('ui-btn-active');
				} else if (this.xtype == "cbx-button")
				{
					$(this.buttonConfigObject.getLayer()).prop('disabled', true).addClass('ui-disabled');

				}

				else if (this.xtype == "cbx-datefield")
				{
					this.getFormField().textinput();
					this.getFormField().textinput('disable');
					this.getFormField().datebox();
					this.getFormField().datebox('disable');
				}

				else
				{
					$(this.getFormField()).attr('disabled', 'disabled');
					var parentDiv = $(this.getFormField()).parent('div:first');
					parentDiv.removeClass('ui-disabled');
					parentDiv.removeClass('ui-focus');
					$(this.getFormField()).addClass('ui-disabled');
				}
			};
			className.prototype.getFormField = function ()
			{
				return this.formElement;
			};
			className.prototype.setFormField = function (ele)
			{
				this.formElement = ele;
			};
		
			className.prototype.getEleType = function ()
			{
				return this.eleType;
			};
			className.prototype.setEleType = function (val, config)
			{
				this.eleType = val;
				config.eleType = val;
			}
			className.prototype.markInvalid = function (msg)
			{
				if (this.canValidate)
				{
					if (this.xtype == "cbx-fileuploadpanel")
					{
						this.getValidationField().addClass("cbx-formfileupload-bg");
					} else if (this.xtype == "cbx-multiselectcombobox" || this.xtype == "cbx-iconcombobox")
					{
						this.getValidationField().addClass("cbx-form-bg-optional");
					} else
					{
						this.getValidationField().addClass("cbx-form-bg");
					}
					/*
					 * var msg = !cbx.isEmpty(msg)?msg:String.format(
					 * iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(),'ERR_MANDATORY'), this.labelText);
					 */

					if ((this.config.requiredInd && this.config.requiredInd == 'Y')
								&& (this.xtype != "cbx-fileuploadpanel") && (this.xtype != "cbx-multiselectcombobox")
								// && cbx.isEmpty(this.getValue())){
								&& (cbx.isEmpty(this.getValue()) || cbx.isEmpty(this.getValue().replace(/\s/g, '')))
								&& cbx.isEmpty(msg))
					{

						var blankText = this.blankText
									|| iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), 'ERR_MANDATORY');
						msg = String.format(blankText, this.label);

					} else if ((this.config.requiredInd && this.config.requiredInd == 'Y')
								&& (this.xtype == "cbx-multiselectcombobox") && cbx.isEmpty(msg)
								&& this.getValue().length == 0)
					{

						var blankText = this.blankText
									|| iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), 'ERR_MANDATORY');
						msg = String.format(blankText, this.label);

					} else if ((this.config.requiredInd && this.config.requiredInd == 'Y')
								&& (this.xtype == "cbx-fileuploadpanel") && cbx.isEmpty(msg))
					{

						var blankText = this.blankText
									|| iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(), 'ERR_MANDATORY');
						msg = String.format(blankText, this.label);

					} else if (cbx.isEmpty(msg) && this.validationHolder)
					{
						msg = this.validationHolder.html();
					} else if (cbx.isEmpty(msg) && !this.validationHolder)
					{
						msg = "";
					}

					else
					{
						/**
						 * Error msg fonts should common  
						 * Change Log : CTMQ315F08
						 */
						//msg = "<i class='ct-error__mandatory'>"+msg+"</i>";
						msg = msg;
					}
					// msg = cbx.isEmpty(this.labelText.trim())?"":"<i>"+this.labelText.trim()+"</i>";

					var invalidMsgConf = {
						"eleType" : "span",
						"html" : msg,
						"class":'mandatoryAction ct-error__mandatory',
						"style" : {
							/* "display":"inline-block", */
							"color" : "red"
						}
					}
					var invalidMsgHTML = new cbx.lib.layer(invalidMsgConf).getLayer();
					if (!this.validationHolder)
					{
						this.validationHolder = $(invalidMsgHTML);
						$(this.getComponentDOM()).append(this.validationHolder);
					} else
					{
						this.validationHolder.html(msg);
					}
					$.mobile.activePage.trigger('updatelayout');
					doIScroll('CONTENT_DIV', 'refresh');
					this.isValid = false;
				} else
				{
					LOGGER.warn("Mark invalid not applicable for ", this.xtype, " field");
				}

			};
		className.prototype.setFieldLabel = function (text)
				{	
					if( this.xtype != "cbx-fieldset"){
						$(this.getComponentDOM()).find('label:first').html( text );
						if( this.editableInd != "N"){
							if ( this.requiredInd == "Y" && this.conditionalInd != "Y")
							$(this.getComponentDOM()).find('label:first').append( '<span class="cbx-conditional-ind ct-form-component">*</span>' );
						else( this.requiredInd != "Y" && this.conditionalInd == "Y" )
							$(this.getComponentDOM()).find('label:first').append( '<span class=conditional-mandatory>**</span>' );				
						}
					}				
				};
			/**
			 * This function is used to set the dynamic label for formfields.
			 */
			className.prototype.setTitle = function (value)
			{
				if (!cbx.isEmpty(value.trim()))
				{
					if (this.xtype == 'cbx-fileuploadpanel')
					{
						$title = $(this.items).find('.cbx-label');
					} else
					{
						$title = $(this.items).find('.ui-btn-text');
					}
					if (($title.children().length) > 0)
					{
						var temp = $title.children();
					}
					$title.html(value);
					$title.append(temp);
				}
			};
			/**
			 * Intended to update label for specific form fields such as fieldset,panel,uploadpanel..etc.
			 */
			className.prototype.clearInvalid = function ()
			{
				if (this.canValidate)
				{
					if (this.xtype == "cbx-fileuploadpanel")
					{
						this.getValidationField().removeClass("cbx-formfileupload-bg");
					} else if (this.xtype == "cbx-multiselectcombobox" || this.xtype == "cbx-iconcombobox")
					{
						this.getValidationField().removeClass("cbx-form-bg-optional");
					} else
					{
						this.getValidationField().removeClass("cbx-form-bg");
					}
					if (this.validationHolder)
					{
						this.validationHolder.empty();
					}
					this.isValid = true;
					doIScroll('CONTENT_DIV', 'refresh');

				}
			};
			className.prototype.refreshScroll = function ()
			{
				var that = this;
				$.mobile.activePage.trigger('updatelayout');
				setTimeout(function ()
				{
					/*
					 * doIScroll('CONTENT_DIV','add',{ "ele": t.getFormField()[0], "duration":1000 });
					 */
					cbx.lib.utility.resizeContentDiv();
				}, 500)

			};
			className.prototype.focus = function ()
			{
				// this.getFormField().focus();
			};
			className.prototype.reset = function ()
			{
				if (this.xtype == "cbx-combobox")
				{
					$('#' + this.itemId + '_field').val("").attr('selected', true).siblings('option').removeAttr(
								'selected');
					$('#' + this.itemId + '_field').attr('selectedIndex', -1);
					$('#' + this.itemId + '_field').selectmenu('refresh', true);
				} else if (this.xtype == "cbx-checkboxgroup" || this.xtype == "cbx-radiogroup")
				{
					var type = this.xtype == "cbx-radiogroup" ? "radio" : "checkbox";
					$('input:' + type + '[name="' + this.itemId + '"]').attr("checked", false).checkboxradio();
					$('input:' + type + '[name="' + this.itemId + '"]').checkboxradio("refresh");

				} else if (this.xtype == "cbx-statictextarea" || this.xtype == "cbx-passwordfield"
							|| this.xtype == "cbx-amountfield" || this.xtype == "cbx-textarea"
							|| this.xtype == "cbx-textfield" || this.xtype == "cbx-spinnerfield")
				{
					this.getFormField().val("");
				}

				else if (this.xtype == "cbx-datefield")
				{
					this.getFormField().val('');
					this.getFormField().datebox("refresh");

				} else
				{
					this.getFormField().html("");
				}
				this.clearInvalid();
			};
			/**
			 * API added for iscroll focus issue
			 */
			className.prototype.focusOnClick = function ()
			{
				this.getFormField().on('click', function (e)
				{
					$(this).trigger('focus');
				});
			};
			className.prototype.getCompositeWidth = function (width)
			{
				var actualWidth = width.substr(0, width.indexOf("%"));
				actualWidth = 100;// actualWidth*3;
				return actualWidth > 100 ? 100 + "%" : actualWidth + "%";
			};
			className.prototype.getDisplayNameKey = function (configObj)
			{
				var displayLabelName = "";
				if (!cbx.isEmpty(configObj.plainLbl))
				{
					displayLabelName = configObj.plainLbl;
				} else if (!cbx.isEmpty(configObj.displayNmKey))
				{
					displayLabelName = configObj.displayNmKey;
					var bundle = cbx.jsutil.getBundleKey(configObj);
					displayLabelName = iportal.jsutil.getTextFromBundle(bundle, 'LBL_' + displayLabelName, CRB
								.getFWBundleKey());
				} else
				{
					if (cbx.isEmpty(displayLabelName))
					{
						displayLabelName = ''
					} else
					{
						displayLabelName = displayLabelName + '<span class = \'non_mandatory\'"></span>';
					}
				}
				return displayLabelName;

			}, className.prototype.registerDefaultValidation = function (conf)
			{
				var commonbundle = CRB.getFWBundle();
				var that = conf;
				var obj = this;

				if (that.xtype == 'cbx-datefield')
				{
					conf.getFormField().on(
								'focus',
								function (event)
								{
									window.preLoadEvent.detail['text'] = iportal.jsutil.getTextFromBundle(CRB
												.getFWBundleKey(), 'M_DATEBOX_INIT')
									window.dispatchEvent(window.preLoadEvent);
									/**
									 * Timeout -- Giving enough time for any previous input field's soft keypad to
									 * close.
									 */
									setTimeout(function ()
									{
										that.getFormField().trigger('datebox', {
											'method' : 'open'
										});
										$('body').find('.ui-datebox-container').popup("option", "dismissible", false);
									}, 1000);
								});

					conf.getFormField().bind(
								'blur',
								that,
								function (event)
								{
									if ((that.requiredInd && that.requiredInd == 'Y') && cbx.isEmpty(that.getValue()))
									{
										msg = String.format(iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(),
													'ERR_MANDATORY'), that.label);
										obj.markInvalid(msg);
										return;
									}
								});
				}
				else if(that.xtype=='cbx-textfield' || that.xtype=='cbx-textarea' || that.xtype=='cbx-passwordfield' ||that.xtype=='cbx-amountfield'){
					
					
					/***
					 *  Keypress Event not working for all version of Android 
					 *  IOS its working fine
					 * 
					 * 
					 * if(that.xtype=='cbx-textfield' && that.validationType.trim().toUpperCase() == "ALPHA" ){
						conf.getFormField().on('keypress',function(event){
							var r = new RegExp("[A-Za-z]", "g");
							var exp = String.fromCharCode(event.charCode);
							if ( event.keyCode == 8 || event.keyCode == 46 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 9 ) {
									return true;
								}else if ( exp.match(r) ) {
									return true;
								}else{
									return false;
								}
						});
					}
					
					if( that.xtype == "cbx-textfield" && that.validationType.trim().toUpperCase() == "NUMERIC" ){
						conf.getFormField().keypress(function(event){
							var r = new RegExp("[0-9]", "g");
							var exp = String.fromCharCode(event.charCode);
							if ( event.keyCode == 8 || event.keyCode == 46 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 9 ) {
								return true;
							}else if ( exp.match(r) ) {
								return true;
							}else{
								return false;
							}
						});
					}*/
					
					conf.getFormField().on('focus',function(event){
						window.focusEle = that.getFormField();
						setTimeout(function ()
						{
							if( cbx.isNativeAndroid() )
							{
								if(cbx.isChrome() == true){
									if(parseFloat(getAndroidVersion()) > 4.4 || getAndroidVersion() == '4.1.2'){
									if(Orientatoin == "P"){
										iscroller.scrollToElement(that.getComponentDOM());
										that.getComponentDOM().focus();
									}else{
										$('html,body').animate({scrollTop: $(that.getComponentDOM()).offset().top -30 }, 'slow');
									}
									}else if( getAndroidVersion() == '4.4.4' ){
										that.getComponentDOM().scrollIntoView();
									}else{
										$('html,body').animate({scrollTop: $(that.getComponentDOM()).offset().top -100 }, 'slow');
									}
								}
								else if(cbx.isOpera() == true){
									if(Orientatoin == "P"){
										iscroller.scrollToElement(that.getComponentDOM());
										that.getComponentDOM().focus();
									}else{
										$('html,body').animate({scrollTop: $(that.getComponentDOM()).offset().top -30 }, 'slow');
									}
								}else if(cbx.isFireFox() == true){
									that.getComponentDOM().scrollIntoView();
								}
							}
						}, 1000);                
					});
					conf.getFormField().bind(
								'blur',
								that,
								function (event)
								{
									/**
									 * Resetting the id
									 */
									window.focusEle = null;

									if (!(cbx.isIE() && cbx.isWindowsPhone()))
									{
										setTimeout(function ()
										{
											if (!cbx.isNativeIOS())
											{
												$('#JQM-CONTENT')[0].scrollIntoView();
											} else if (cbx.isEmpty(window.focusEle))
											{
												$('#JQM-CONTENT')[0].scrollIntoView();
											}
										}, 100);
									}

									if ((that.requiredInd && that.requiredInd == 'Y') && cbx.isEmpty(that.getValue()))
									{
										msg = String.format(iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(),
													'ERR_MANDATORY'), that.label);
										obj.markInvalid(msg);
										return;
									}
									// else if(that.getValue().length < that.minLength){
									else if (!cbx.isEmpty(that.minLength) && that.getValue().length < that.minLength)
									{
										msg = String.format(commonbundle['ERR_MINLENGTH_EXCEED'], that.label,
													that.minLength);
										obj.markInvalid(msg);
										return;
									} else if (!cbx.isEmpty(that.maxLength)
												&& that.getValue().length > that.config.maxLength)
									{
										msg = String.format(commonbundle['ERR_MAX_LIMIT_REACHED'], that.label,
													that.config.maxLength);
										obj.markInvalid(msg);
										return;
									} else
									{
										that.xtype !== "cbx-amountfield" ? that.validateVType() : cbx.emptyFn();
									}
								});
				} else if (that.xtype == 'cbx-combobox' || that.xtype == 'cbx-autoSuggestCombo')
				{

					/*conf.getFormField().on('focus', function (event)
					{
						$(window).trigger('resize');
						window.focusEle = that.getFormField();
						setTimeout(function ()
						{

							if (!cbx.isNativeIOS() && !cbx.isChrome() && (!(cbx.isIE() && cbx.isWindowsPhone())))
							{
								that.getComponentDOM().scrollIntoView();
							}

						}, 100);
					});*/
					conf.getFormField().bind(
								'blur',
								that,
								function (event)
								{
									/**
									 * Resetting the id
									 */
									/*window.focusEle = null;

									if (!(cbx.isIE() && cbx.isWindowsPhone()))
									{
										setTimeout(function ()
										{
											$(window).trigger('resize');
											if (!cbx.isNativeIOS())
											{
												$('#JQM-CONTENT')[0].scrollIntoView();
											} else if (cbx.isEmpty(window.focusEle))
											{
												$('#JQM-CONTENT')[0].scrollIntoView();
											}
										}, 100);
									}*/

									if ((that.requiredInd && that.requiredInd == 'Y') && cbx.isEmpty(that.getValue())
												|| that.isSelectSelected())
									{
										msg = String.format(that.blankText, that.label);
										obj.markInvalid(msg);
										return;
									}
								});
				}

			};
			className.prototype.validateVType = function ()
			{
				var that = this;
				var key, r, message;
				var valReq = !cbx.isEmpty(that.config.vType);
				switch (that.config.vType.trim().toUpperCase())
				{
					case "ALPHANUMERIC":
						var r = that.config.allowSpaces ? /^[A-Za-z0-9 ]+$/ : /^[A-Za-z0-9]+$/;
						var key = that.config.allowSpaces ? 'ERR_ONLY_ALPHANUMERIC_SPACES' : 'ERR_ONLY_ALPHANUMERIC';
						break;
					case "NUMERIC":
						r = that.config.allowSpaces ? /^[0-9 ]+$/ : /^[0-9]+$/;
						key = that.config.allowSpaces ? 'ERR_NUMERIC_SPACES' : 'ERR_NUMERIC';
						break;
					case "ALPHANUMERICSPECIAL":
						r = that.config.allowSpaces ? /^[A-Za-z0-9 ,-._]+$/ : /^[A-Za-z0-9,-._]+$/;
						key = that.config.allowSpaces ? 'ERR_ALPHA_NUM_SPECIAL_SPACES' : 'ERR_ALPHA_NUM_SPECIAL';
						break;
					case "PORTALSUPPORTED":
						// r = that.config.allowSpaces?/[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-
						// ]$/:/[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]$/;
						// key = that.config.allowSpaces?'ERR_ALPHA_NUM_SPECIAL_SPACES':'ERR_ALPHA_NUM_SPECIAL';
						break;
					default:
						r = that.config.globalRe;
						message = that.config.invalidText;
						break;
				}
				if (valReq && !cbx.isEmpty(r))
				{
					// var message = message || iportal.jsutil.getTextFromBundle(IRB.COMMON,key);
					var message = message || iportal.jsutil.getTextFromBundle("CANVAS", key);
					if (!r.test(that.getValue()))
					{	
						if( (that.requiredInd == "N" && !cbx.isEmpty(that.getValue())) || cbx.isEmpty(that.requiredInd) || that.requiredInd == "Y" )
						that.markInvalid(message);
					}
				}
			};

			className.prototype.isValid = true;
		}
	};
}();
CFCR = cbx.core.form.FormRegistry;
