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
 * 
 */
iportal.Dialog = function(config) {
	this.name = config.name || config.id;
	iportal.Dialog.superclass.constructor.call(this, config);
};

/**
 * 
 */
Ext
		.extend(
				iportal.Dialog,
				Ext.Window,
				{
					/**
					 * @cfg {Object} bundleKey ,key used by resource to lookup
					 *      bundle(defaults to '')
					 */
					bundleKey : '',

					width : 360,

					height : 200,

					autoScroll : true,

					toolButtons : null,

					heightoverride : false,

					cls : 'formBg',

					buttonStyleOverride : false,

					buttonStyle : '',

					closeIconRequired : true,

					dialogType : 'CONFIRMATION',

					// buttons : [],

					closeHandler : Ext.emptyFn,

					printReqd : false,

					helpReqd : false,

					customMsgOnly : true, 

					/**
					 * 
					 * @cfg {Object} pprintHandler ,if developer wants to print
					 *      the contents
					 * 
					 */

					pprintHandler : Ext.emptyFn,

					/**
					 * 
					 * @cfg {Object} helpHandler ,if developer wants to show the
					 *      help contents
					 * 
					 */

					helpHandler : Ext.emptyFn,

					modal : true,

					// private

					initComponent : function() {

						this.focus = Ext.emptyFn;

						this.closable = false;

						var bundle;

						this.scope = this.initialConfig.scope ? this.initialConfig.scope
								: this;

						var cmRb = CRB.getFWBundle();

						var avoidClose = (this.dialogType == 'CONFIRMATION')
								|| (this.dialogType == 'ERROR')
								|| (this.dialogType == 'WARNING');

						this.tools = [];

						if (this.heightoverride) {

							this.height = this.heightoverride;

						}

						var that = this;

						this.resizable = false;

						if (this.printReqd) {

							this.tools.push({
								id : 'iportalPrint',
								handler : function() {
									that.pprintHandler();
								}
							});

						}

						if (this.helpReqd) {

							this.tools.push({
								id : 'iportalHelp',
								handler : function() {
									that.helpHandler();
								}
							});

						}

						if (this.closeIconRequired && !avoidClose) {

							this.tools.push({
								id : 'iportalClose',
								handler : function() {
									that.closeHandler();
									that.close();
								}
							});

						}

						var that = this;

						this.tools = [];

						if (this.toolButtons != null) {

							if (this.toolButtons.indexOf('close') != -1) {

								if (this.hideOnClose) {

									this.tools.push({
										id : 'iportalClose',
										tooltip : cmRb['TOOLTIP_CLOSE'],
										handler : function() {
											that.hide();
										}
									});

								} else {

									this.tools.push({
										id : 'iportalClose',
										tooltip : cmRb['TOOLTIP_CLOSE'],
										handler : function() {
											that.closeHandler();
											that.close();
										}
									});

								}

							}

						}

						if (this.bundleKey === '')
							this.bundleKey = CRB.getFWBundleKey();

						bundle = CRB.getBundle(this.bundleKey);
						var posBtn = iportal.preferences.getPostiveBtnAlign();
						var negBtn = iportal.preferences.getNegativeBtnAlign();
						switch (that.dialogType) {

						case 'CONFIRMATION':

							that.bbar = [];
							var yesPosBtn = {

								xtype : 'tbbutton',
								minWidth : 40,
								cls : 'portal_pos_btn',
								handler : that.yesHandler,
								text : bundle['LBL_YES']

							};
							var noNegBtn = {

								xtype : 'tbbutton',
								minWidth : 40,
								handler : that.noHandler,
								text : bundle['LBL_NO']

							};

							var tbFill = {
								xtype : 'tbfill'
							};

							var cancelNegBtn = {
								xtype : 'tbbutton',
								minWidth : 40,
								handler : that.cancelHandler,
								text : bundle['LBL_CANCEL']
							};

							var tbSpac = {
								xtype : 'tbspacer'
							};

							if (posBtn === 'RIGHT' && negBtn === 'LEFT') {
								that.bbar.push(noNegBtn);
								that.bbar.push(cancelNegBtn);
								that.bbar.push(tbFill);
								that.bbar.push(yesPosBtn);

							} else if (posBtn === 'LEFT' && negBtn === 'RIGHT') {

								that.bbar.push(yesPosBtn);
								that.bbar.push(tbFill);
								that.bbar.push(noNegBtn);
								that.bbar.push(cancelNegBtn);

							} else if (posBtn === 'RIGHT' && negBtn === 'RIGHT') {

								that.bbar.push(tbFill);
								that.bbar.push(yesPosBtn);
								that.bbar.push(noNegBtn);
								that.bbar.push(cancelNegBtn);

							} else {

								that.bbar.push(yesPosBtn);
								that.bbar.push(noNegBtn);
								that.bbar.push(cancelNegBtn);

							}
						
							this.title = bundle['LBL_CONFIRMATION'];
							/* To add image in Confirmation Dialog */
							this.html = '<span class = \'confirmation-image\'></span>';
							this.html += '<div class = \'message-window\'>'
										+ this.message + '</div>';

							break;

						case 'WARN_EDIT_OK':

							that.bbar = [];

							that.bbar.push({

								xtype : 'tbbutton',

								minWidth : 40,

								handler : that.okHandler,

								cls : 'portal_pos_btn',

								text : bundle['LBL_OK']

							});

							that.bbar.push({

								xtype : 'tbfill'

							});

							that.bbar.push({

								xtype : 'tbbutton',

								minWidth : 40,

								width : 50,

								handler : that.editHandler,

								cls : 'portal_pos_btn',

								text : bundle['LBL_EDIT']

							// text:'Edit'

							});
					
							this.buttonAlign = 'center';
							/*To add image in Warning image*/
							this.html = '<span class = \'warning-image\'></span>';
							this.html += '<div class = \'message-window\'>'
										+ this.message + '</div>';

							this.title = bundle['LBL_WARN'];

							break;
						case 'MESSAGE':

							that.bbar = [];

							if (posBtn === 'RIGHT') {
								that.bbar.push({
									xtype : 'tbfill'
								});
								that.bbar.push({
									xtype : 'tbbutton',
									minWidth : 40,
									cls : 'portal_pos_btn',
									handler : that.okHandler,
									text : bundle['LBL_OK']
								});
							} else {
								that.bbar.push({
									xtype : 'tbbutton',
									minWidth : 40,
									cls : 'portal_pos_btn',
									handler : that.okHandler,
									text : bundle['LBL_OK']
								});
							}
							/* To add image in information/message Dialog */
							this.html = '<span class = \'info-image\'></span>';
							this.html += '<div class = \'message-window\'>'
										+ this.message + '</div>';

							this.title = that.title;

							break;

						case 'ERROR':
							that.bbar = [];

							if (posBtn === 'RIGHT') {
								that.bbar.push({
									xtype : 'tbfill'
								});
								that.bbar
										.push({
											xtype : 'tbbutton',
											style : (that.buttonStyleOverride) ? that.buttonStyle
													: '',
											minWidth : 40,
											cls : 'portal_pos_btn',
											handler : that.okHandler,
											text : bundle['LBL_OK']
										});
							} else {
								that.bbar
										.push({
											xtype : 'tbbutton',
											style : (that.buttonStyleOverride) ? that.buttonStyle
													: '',
											minWidth : 40,
											cls : 'portal_pos_btn',
											handler : that.okHandler,
											text : bundle['LBL_OK']
										});
							}
							/* To add image in error Dialog */
							this.html = '<span class = \'error-image\'></span>';
							this.html += '<div class = \'message-window\'>'
									+ this.message + '</div>';

							this.title = that.title;

							break;

						case 'WARNING':
							var continueText;
							var cancelText;
							that.bbar = [];
							if (this.buttonText1) {
								continueText = this.buttonText1;
							} else {
								continueText = bundle['LBL_OK'];
							}
							if (this.buttonText2) {
								cancelText = this.buttonText2;
							} else {
								cancelText = bundle['LBL_CANCEL'];
							}
							var cancelBtn = {
								xtype : 'tbbutton',
								minWidth : 40,
								cls : 'portal_neg_btn',
								handler : that.cancelHandler,
								text : cancelText
							};
							var okBtn = {
								xtype : 'tbbutton',
								scope : this.scope,
								minWidth : 40,
								cls : 'portal_pos_btn',
								handler : that.okHandler,
								text : continueText
							};
							var tbFill = {
								xtype : 'tbfill'
							};
							if (posBtn === 'RIGHT' && negBtn === 'LEFT') {
								that.bbar.push(cancelBtn);
								that.bbar.push(tbFill);
								that.bbar.push(okBtn);
							} else if (posBtn === 'LEFT' && negBtn === 'RIGHT') {
								that.bbar.push(okBtn);
								that.bbar.push(tbFill);
								that.bbar.push(cancelBtn);
							} else if (posBtn === 'RIGHT' && negBtn === 'RIGHT') {
								that.bbar.push(tbFill);
								that.bbar.push(okBtn);
								that.bbar.push(cancelBtn);
							} else {
								that.bbar.push(okBtn);
								that.bbar.push(cancelBtn);
							}

							this.buttonAlign = 'center';
							/* To add image in Warning Dialog */
							this.html = '<span class = \'warning-image\'></span>';
							this.html += '<div class = \'message-window\'>'
									+ this.message + '</div>';

							this.title = bundle['LBL_WARN'];

							break;

						case 'USERDEFINED':

							that.title = that.title;
							/* To add image in information/Message Dialog */
							that.html = '<span class = \'info-image\'></span>';
							that.html += '<div class = \'message-window\'>'
									+ that.message + '</div>';

							that.bbar = [];

							switch (that.dialogStyle) {

							case 'YES_NO_CANCEL':

								var yesPosBtn = {

									xtype : 'tbbutton',
									minWidth : 40,
									cls : 'portal_pos_btn',
									handler : that.yesHandler,
									text : bundle['LBL_YES']

								};
								var noNegBtn = {

									xtype : 'tbbutton',
									minWidth : 40,
									handler : that.noHandler,
									text : bundle['LBL_NO']

								};

								var tbFill = {
									xtype : 'tbfill'
								};

								var cancelNegBtn = {
									xtype : 'tbbutton',
									minWidth : 40,
									handler : that.cancelHandler,
									text : bundle['LBL_CANCEL']
								};

								var tbSpac = {
									xtype : 'tbspacer'
								};

								if (posBtn === 'RIGHT' && negBtn === 'LEFT') {
									that.bbar.push(noNegBtn);
									that.bbar.push(cancelNegBtn);
									that.bbar.push(tbFill);
									that.bbar.push(yesPosBtn);

								} else if (posBtn === 'LEFT'
										&& negBtn === 'RIGHT') {

									that.bbar.push(yesPosBtn);
									that.bbar.push(tbFill);
									that.bbar.push(noNegBtn);
									that.bbar.push(cancelNegBtn);

								} else if (posBtn === 'RIGHT'
										&& negBtn === 'RIGHT') {

									that.bbar.push(tbFill);
									that.bbar.push(yesPosBtn);
									that.bbar.push(noNegBtn);
									that.bbar.push(cancelNegBtn);

								} else {

									that.bbar.push(yesPosBtn);
									that.bbar.push(noNegBtn);
									that.bbar.push(cancelNegBtn);

								}
								break;

							case 'PRINTLGL_CLOSE':

								if (this.customMsgOnly) {

									this.html = '<div class = \'message-window\'>'
											+ this.message + '</div>';

								} else {

									this.html = '<div class = \'message-window\'>'
											+ this.message

											+ "<div style='padding-left:5px;'>"

											+ bundle.LBL_LEGAL_AGREE_MSG

											+ '</div> </div>';

								}

								/*
								 * that.bbar.push({
								 * 
								 * xtype:'tbbutton',
								 * 
								 * minWidth :40,
								 * 
								 * 
								 * 
								 * cls:'portal_neg_btn',
								 * 
								 * style:'font-color:ffffff;',
								 * 
								 * handler:function(){that.printLglHandler();that.close_Handler();},
								 * 
								 * text: bundle['LBL_PRINTLGL']
								 * 
								 * });
								 */
								that.bbar.push({

									xtype : 'tbfill'

								});

								that.bbar.push({

									xtype : 'tbbutton',

									minWidth : 40,

									cls : 'portal_neg_btn',

									handler : that.close_Handler,

									text : bundle['LBL_CLOSE']

								});

								break;

							/*
							 * Introduced for liquidity authorisation workflow.
							 * The Print legal agreement handler should not
							 * invoke the close handler of the window.
							 */

							case 'PRINTLGL_CLOSE_TYPE2':

								if (this.customMsgOnly) {

									this.html = '<div class = \'message-window\'>'
											+ this.message + '</div>';

								} else {

									this.html = '<div class = \'message-window\'>'
											+ this.message

											+ "<div style='padding-left:5px;'>"

											+ bundle.LBL_LEGAL_AGREE_MSG

											+ '</div> </div>';

								}

								/*
								 * that.bbar.push({
								 * 
								 * xtype:'tbbutton',
								 * 
								 * minWidth :40,
								 * 
								 * cls:'secondary-btn',
								 * 
								 * handler:function(){that.printLglHandler();},
								 * 
								 * text: bundle['LBL_PRINTLGL']
								 * 
								 * });
								 */
								that.bbar.push({

									xtype : 'tbfill'

								});

								that.bbar.push({

									xtype : 'tbbutton',

									minWidth : 40,

									handler : that.close_Handler,

									text : bundle['LBL_CLOSE']

								});

								break;

							case 'REPRINTLGL_CLOSE':

								if (this.customMsgOnly) { 
															 

									this.html = '<div class = \'message-window\'>'
											+ this.message + '</div>';

								} else {

									this.html = '<div class = \'message-window\'>'
											+ this.message

											+ "<div style='padding-left:5px;'>"

											+ bundle.LBL_LEGAL_AGREE_MSG

											+ '</div> </div>';

								}

								/*
								 * that.bbar.push({
								 * 
								 * xtype:'tbbutton',
								 * 
								 * minWidth :40,
								 * 
								 * cls:'secondary-btn',
								 * 
								 * handler:function(){that.close_Handler();that.rePrintLglHandler();},
								 * 
								 * text: bundle['LBL_REPRINTLGL']
								 * 
								 * });
								 */
								that.bbar.push({

									xtype : 'tbfill'

								});

								that.bbar.push({

									xtype : 'tbbutton',

									minWidth : 40,

									handler : that.close_Handler,

									text : bundle['LBL_CLOSE']

								});

								break;

							case 'REPRINT_CLOSE':

								that.bbar.push({

									xtype : 'tbbutton',

									minWidth : 40,

									handler : that.rePrintHandler,

									text : bundle['LBL_REPRINT']

								});

								that.bbar.push({

									xtype : 'tbfill'

								});

								that.bbar.push({

									xtype : 'tbbutton',

									minWidth : 40,

									handler : that.close_Handler,

									text : bundle['LBL_CLOSE']

								});

								break;

							case 'PRINT_CLOSE':

								that.bbar = [];

								that.bbar
										.push({

											xtype : 'tbbutton',

											minWidth : 40,

											handler : function() {

												iportal
														.openNewWindow(
																'/iportalweb/iportal/jsps/ConfirmationMsgPrintWindow.jsp'
																		+

																		'?elementIdForConfirmationMsg=printConfirmMsg',
																'print',
																'toolbar=no,location=no,directories=no,status=no,'
																		+

																		'menubar=no,scrollbars=no,resizable=no,border=thin,top=60,left=120,width=700');

											},

											text : bundle['LBL_PRINT'],

											cls : 'portal_pos_btn'

										});

								that.bbar.push({

									xtype : 'tbfill'

								});

								that.bbar.push({

									xtype : 'tbbutton',

									minWidth : 40,

									handler : function() {

										that.close();

									},

									text : bundle['LBL_CLOSE'],

									cls : 'portal_pos_btn'

								});

								that.html = '';

								that.items = new Ext.Panel(
										{

											autoScroll : true,

											html : '<div id="printConfirmMsg" class = \'message-window\'>'
													+ that.message + '</div>'

										});

								break;

							case 'CONTINUE':

								that.bbar = [];

								that.bbar.push({

									xtype : 'tbfill'

								});

								that.bbar.push({

									xtype : 'tbbutton',

									minWidth : 40,

									handler : that.continueHandler,

									text : bundle['LBL_CONTINUE']

								});

								break;

							case 'CLOSE':

								that.bbar = [];

								that.bbar.push({

									xtype : 'tbfill'

								});

								that.bbar.push({

									xtype : 'tbbutton',

									minWidth : 40,

									handler : function() {

										that.close();

									},

									text : bundle['LBL_CLOSE'],

									cls : 'portal_pos_btn'

								});

								break;

							case 'ACCEPT_REJECT_CANCEL':

								that.bbar.push({

									xtype : 'tbbutton',

									minWidth : 40,

									handler : that.acceptHandler,

									text : bundle['LBL_ACCEPT'],

									cls : 'portal_neg_btn'

								});

								that.bbar.push({

									xtype : 'tbspacer'

								});

								that.bbar.push({

									xtype : 'tbbutton',

									minWidth : 40,

									handler : that.rejectHandler,

									text : bundle['LBL_REJECT'],

									cls : 'portal_neg_btn'

								});

								that.bbar.push({

									xtype : 'tbfill'

								});

								that.bbar.push({

									xtype : 'tbspacer'

								});

								that.bbar.push({

									xtype : 'tbbutton',

									minWidth : 40,

									handler : that.cancelHandler,

									text : bundle['LBL_CANCEL'],

									cls : 'portal_neg_btn'

								});

								break;

							case 'ACCEPTPRINT_REJECT_CANCEL':

								that.bbar.push({

									xtype : 'tbbutton',

									minWidth : 40,

									cls : 'secondary-btn',

									handler : that.acceptPrintHandler,

									text : bundle['LBL_ACCEPT_PRINT']

								});

								that.bbar.push({

									xtype : 'tbspacer'

								});

								that.bbar.push({

									xtype : 'tbbutton',

									minWidth : 40,

									handler : that.rejectHandler,

									text : bundle['LBL_REJECT']

								});

								that.bbar.push({

									xtype : 'tbfill'

								});

								that.bbar.push({

									xtype : 'tbbutton',

									minWidth : 40,

									handler : that.cancelHandler,

									text : bundle['LBL_CANCEL']

								});

								break;

							case 'PRINTSUCCESS_PRINTFAIL':

								that.bbar.push({

									xtype : 'tbbutton',

									minWidth : 40,

									cls : 'secondary-btn',

									handler : that.printSuccess,

									text : bundle['LBL_PRINTSUCCESS']

								});

								that.bbar.push({

									xtype : 'tbspacer'

								});

								that.bbar.push({

									xtype : 'tbfill'

								});

								that.bbar.push({

									xtype : 'tbbutton',

									minWidth : 40,

									handler : that.printFail,

									text : bundle['LBL_PRINTFAIL']
								});

								break;

							case 'YES_NO':

								var yesBtnPos = {

									xtype : 'tbbutton',
									cls : 'portal_pos_btn',
									minWidth : 40,
									handler : that.yesHandler,
									text : bundle['LBL_YES']
								};

								var tbfill = {
									xtype : 'tbfill'
								};

								var tbspa = {
									xtype : 'tbspacer'
								};

								var noBtnpos = {
									xtype : 'tbbutton',
									cls : 'portal_neg_btn',
									minWidth : 40,
									handler : that.noHandler,
									text : bundle['LBL_NO']

								};
								if (posBtn === 'RIGHT' && negBtn === 'LEFT') {
									that.bbar.push(noBtnpos);
									that.bbar.push(tbfill);
									that.bbar.push(yesBtnPos);
								} else if (posBtn === 'LEFT'
										&& negBtn === 'RIGHT') {
									that.bbar.push(yesBtnPos);
									that.bbar.push(tbfill);
									that.bbar.push(noBtnpos);
								} else if (posBtn === 'RIGHT'
										&& negBtn === 'RIGHT') {
									that.bbar.push(tbfill);
									that.bbar.push(yesBtnPos);
									that.bbar.push(noBtnpos);
								} else {
									that.bbar.push(yesBtnPos);
									that.bbar.push(noBtnpos);
								}

								break;

							case 'SUBMIT_CANCEL':

								that.bbar.push({
									xtype : 'tbbutton',
									minWidth : 40,
									handler : that.submitHandler,
									text : bundle['LBL_SUBMIT'],
									cls : 'portal_pos_btn'

								});

								that.bbar.push({
									xtype : 'tbfill'
								});

								that.bbar.push({
									xtype : 'tbspacer'
								});

								that.bbar.push({
									xtype : 'tbbutton',
									minWidth : 40,
									handler : that.cancelHandler,
									text : bundle['LBL_CANCEL'],
									cls : 'portal_pos_btn'

								});

								break;

							case 'OK_CANCEL':

								var cancelBtn = {
									xtype : 'tbbutton',
									minWidth : 40,
									cls : 'portal_neg_btn',
									handler : that.cancelHandler,
									text : cancelText
								};
								var okBtn = {
									xtype : 'tbbutton',
									scope : this.scope,
									minWidth : 40,
									cls : 'portal_pos_btn',
									handler : that.okHandler,
									text : continueText
								};
								var tbFill = {
									xtype : 'tbfill'
								};
								if (posBtn === 'RIGHT' && negBtn === 'LEFT') {
									that.bbar.push(cancelBtn);
									that.bbar.push(tbFill);
									that.bbar.push(okBtn);
								} else if (posBtn === 'LEFT'
										&& negBtn === 'RIGHT') {
									that.bbar.push(okBtn);
									that.bbar.push(tbFill);
									that.bbar.push(cancelBtn);
								} else if (posBtn === 'RIGHT'
										&& negBtn === 'RIGHT') {
									that.bbar.push(tbFill);
									that.bbar.push(okBtn);
									that.bbar.push(cancelBtn);
								} else {
									that.bbar.push(okBtn);
									that.bbar.push(cancelBtn);
								}

								break;

							case 'OK':
								if (posBtn === 'RIGHT') {
									that.bbar.push({
										xtype : 'tbfill'
									});

									that.bbar.push({

										xtype : 'tbbutton',
										minWidth : 40,
										cls : 'portal_pos_btn',
										handler : that.okHandler,
										text : bundle['LBL_OK']

									});
								} else {
									that.bbar.push({

										xtype : 'tbbutton',
										minWidth : 40,
										cls : 'portal_pos_btn',
										handler : that.okHandler,
										text : bundle['LBL_OK']

									});
									that.bbar.push({

										xtype : 'tbfill'

									});

								}

								break;

							case 'PRINT_CANCEL':

								that.bbar
										.push({

											xtype : 'tbbutton',

											minWidth : 40,

											handler : function() {

												iportal
														.openNewWindow(
																'/iportalweb/iportal/jsps/ConfirmationMsgPrintWindow.jsp'
																		+

																		'?elementIdForConfirmationMsg=printConfirmMsg',
																'print',
																'toolbar=no,location=no,directories=no,status=no,'
																		+

																		'menubar=no,scrollbars=no,resizable=no,border=thin,top=60,left=120,width=700');

											},

											text : bundle['LBL_PRINT']

										});

								that.bbar.push({

									xtype : 'tbfill'

								});

								that.bbar.push({

									xtype : 'tbspacer'

								});

								that.bbar.push({

									handler : that.close_Handler,

									text : bundle['LBL_CLOSE']

								});

								that.html = '';

								that.items = new Ext.Panel(
										{

											autoScroll : true,

											html : '<div id="printConfirmMsg" class = \'message-window\'>'
													+ that.message + '</div>'

										});

								break;

							}

							break;
						}

						iportal.Dialog.superclass.initComponent.apply(this,
								arguments);

					},

					afterRender : function() {

						iportal.Dialog.superclass.afterRender.apply(this,
								arguments);

						this.on('resize', function() {

							this.setSize({
								width : this.width,
								height : this.height
							});

						});

						this
								.on(
										'show',
										function(cmp) {

											Ext.getBody().addListener(
													'keydown',
													this.handleKeyDown);

											var bottombar = this
													.getBottomToolbar();

											if (bottombar && bottombar.items) {

												bottombar.items
														.each(function(item,
																index) {

															if (item.el) {

																if (item.id
																		.indexOf('ext-gen') == -1) {

																	item.el
																			.focus();

																	if (Ext
																			.getCmp(item.id)) {

																		Ext
																				.getCmp(
																						item.id)
																				.focus(
																						true);

																	}

																}

															}

														});

											}

										});

						this.on('beforehide', function(cmp) {

							Ext.getBody().removeListener('keydown',
									this.handleKeyDown);

						});

						this.on('beforeclose ', function(cmp) {

							Ext.getBody().removeListener('keydown',
									this.handleKeyDown);

						});

					},

					handleKeyDown : function(e) {

						var that = this;

						var evt = (e) ? e : window.event;

						if (evt.keyCode === 9) {

							var target = evt.target ? evt.target
									: evt.srcElement;

							var targetElement = Ext.get(target);

							if (!targetElement.findParent('div.x-window')) {

								that.focus();

								var flagFocus = false;

								if (that.items)

									that.items.each(function(item, index) {

										if (item.isFormField && !flagFocus) {

											item.el.focus();

											flagFocus = true;

										}

									});

								return false;

							}

						} else if (evt.keyCode === 10 || evt.keyCode === 13) {

							Ext.EventObject.stopEvent();

						} else if (evt.keyCode === 32) {

							var sourceElement = Ext.EventObject.getTarget();

							var targetOuterElement = sourceElement.outerHTML;

							var wrapper_sourceElement = Ext.get(sourceElement);

							var valid_source = (wrapper_sourceElement
									.findParent('div.x-window')) ? true : false;

							var valid_condition = false;

							if (valid_source) {

								var parent_Window = wrapper_sourceElement
										.findParentNode('div.x-window');

								var wrapper_ParentWindow = Ext
										.get(parent_Window);

								Ext.WindowMgr
										.each(function(openedwin) {

											if (Ext
													.getCmp(wrapper_ParentWindow.id).id == openedwin.id) {

												valid_condition = true;

											}

										});

							}

							if (targetOuterElement
									&& targetOuterElement.startsWith('<BUTTON')
									&& !valid_condition) {

								Ext.EventObject.stopEvent();

							}

						}

					}

				});

Ext.reg('iportal-dialog', iportal.Dialog);
