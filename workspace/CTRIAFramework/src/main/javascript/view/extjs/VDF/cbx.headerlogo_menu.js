/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
Ext.namespace('cbx.headerlogo');

cbx.headerlogo.cbxUserImageMenuLayout = function (config)
{
	this.width = config.width || '70px';
	this.height = config.height || '70px';
	this.URL = config.URL || '';
	cbx.headerlogo.cbxUserImageMenuLayout.superclass.constructor.call(this, config);
};
Ext
			.extend(
						cbx.headerlogo.cbxUserImageMenuLayout,
						Ext.BoxComponent,
						{
							initComponent : function ()
							{
								// this.autoEl={tag: 'img',cls:'user-image', src: 'GetUserImage.jsp',
								// id: 'picedit',width:this.width, height:this.height},
								this.autoEl = {
									cn : [ {
										tag : 'img',
										cls : 'user-image-menu',
										src : this.URL,
										id : 'picedit'
										//width : this.width,
										//height : this.height
									} ]
								};
								cbx.headerlogo.cbxUserImageMenuLayout.superclass.initComponent.apply(this, arguments);
								this.on('render', this.imgClick);
							},
							afterRender : function (ct, position)
							{
								cbx.headerlogo.cbxUserImageMenuLayout.superclass.afterRender.call(this, ct, position);
								if (Ext.get('picedit') && this.id)
								{
									/*
									 * This will support in providing the last login details in the tool tip.
									 */
									var tip = new Ext.ToolTip({
										target : Ext.get('uesrFrameEdit'),
										html : '<div class="change_settings_cls"> Change Settings</div>',
										autoDestroy : true,
										// autoHide:false,
										anchor : 'top',
										shadow : false
									});
									var that = this;
									if (Ext.get('uesrFrameEdit'))
									{
										Ext.get('uesrFrameEdit').on('click', function (btn, evt)
										{
											that.showSettingMenu(btn);
										});
										Ext.get('uesrFrameEdit').on('mouseover', function ()
										{
											if (Ext.get('User_Details'))
											{
												if (!tip.isVisible())
												{
													// tip.show();
												}
											}
										});
									}
								}
							},
							/*
							 * 
							 * On the Image click,This functionality will provide the pop-up for the
							 * 
							 * image upload.
							 * 
							 */
							imgClick : function ()
							{
								Ext.DomHelper.append(this.id, {
									tag : 'div',
									id : 'uesrFrameEdit',
									cls : 'user-frame-menu'
								});
								Ext.DomHelper.append(this.id, {
									tag : 'div',
									id : 'userimage-dropdown',
									cls : 'menulayoutsettingsiconDefault userimage-dropdown'
								});
								var that = this;
								if (Ext.get('picedit'))
								{
									Ext.get('picedit').on('click', function (btn, evt)
									{

										that.showSettingMenu(btn);
									});
								}
								if (Ext.get('userimage-dropdown'))
								{
									Ext.get('userimage-dropdown').on('click', function (btn, evt)
									{

										that.showSettingMenu(btn);
									});
								}
							},
							showInfoWindow : function (params)
							{
								this.wndMsg = new cbx.window.MessageWindow({
									title : params.title || 'Message',
									html : params.msg || '',
									// origin: { offX: params.offX || -5, offY: params.offY || -5 },
									autoHeight : true,
									iconCls : 'icon-info',
									help : false,
									origin : {
										pos : "t-t",// position to align to (see {@link
										// Ext.Element#alignTo} for more details
										// defaults to "br-br").
										offX : -20, // amount to offset horizontally (-20 by
										// default)
										offY : -20, // amount to offset vertically (-20 by
										// default)
										spaY : 10
									// vertical spacing between adjacent
									// messages
									},
									showFx : {
										align : 't'
									},
									hideFx : {
										delay : 1000,
										duration : 0.5,
										useProxy : false, // default is false to hide
										// window instead
										mode : 'custom',// null,'standard','custom',or
										// default ghost
										// use callback to control the hide Fx
										callback : function (obj, el, fx)
										{
											el.slideOut("t", {
												// duration: fx.duration || 1,
												easing : 'easeOut',
												duration : 0.5,
												remove : false,
												useDisplay : false,
												scope : obj,
												callback : obj.afterHide
											});
										}
									}
								});
								this.wndMsg.show(Ext.getDoc());
							},

							showSettingMenu : function (evt)
							{
								var that = this;

								if (!cbx.isEmpty(Ext.getCmp('MENU_HEADER_PIC_LAYOUT')))
								{
									Ext.getCmp('MENU_HEADER_PIC_LAYOUT').destroy();
								}
								var picMenu = new Ext.menu.Menu({
									id : 'MENU_HEADER_PIC_LAYOUT',
									maxHeight : 500,
									shadow:false,
									listeners:{
										'show' : {
											fn : function (menu)
											{
												menu.getEl().slideIn('t');
											}
										}
									},
									items : [ {
										iconCls : 'menulayoutsettingsiconDefault menu-pic-icon',
										text : 'Change Picture',
										cls : 'menu-pic-icon-cls',
										handler : function ()
										{
											that.editUploadPicture();
										}
									}, {
										iconCls : 'menulayoutsettingsiconDefault menu-settings-icon',
										text : 'Settings',
										cls : 'menu-pic-icon-cls',
										handler : function ()
										{
											canvas.showPreferences();
										}

									}, {
										iconCls : 'menulayoutsettingsiconDefault menu-logout-icon',
										text : 'Logout',
										cls : 'menu-pic-icon-cls',
										handler : function ()
										{
											iportal.logoutUser();
										}
									} ]

								});

								var position = [];
								iportal.preferences.isLangDirectionRTL()==false?position[0] = evt.getXY()[0] : position[0] = evt.getXY()[0]-200;
								position[1] = that.ownerCt.ownerCt.height;
								picMenu.showAt(position);

							},
							/*
							 * 
							 * This function provide user to update the already uploaded image.
							 * 
							 */
							editUploadPicture : function ()
							{
								var that = this;
								this.wndDetailedPictureEdit = null;
								this.paramObj = {};
								this.pictUploadForm = null;
								this.paramObj["__PIGGYBACKREQUEST"] = 'N';
								this.paramObj["headers"] = "{'Content-type' :'multipart/form-data'}";
								this.paramObj[iportal.systempreferences.getCSRFKeyName()] = iportal.systempreferences
											.getCSRFUniqueId();
								this.pictUploadForm = new Ext.FormPanel(
											{
												autoHeight : true,
												frame : true,
												fileUpload : true,
												headers : {
													'Content-type' : 'multipart/form-data'
												},
												buttonAlign : 'center',
												items : [ {
													bodyStyle : {
														margin : '0px 0px 0px 0px'
													},
													items : [ {
														layout : 'column',
														items : [ {
															layout : 'form',
															columnWidth : .9,
															items : [ {
																xtype : 'fieldset',
																autoWidth : true,
																autoHeight : true,
																title : 'Upload Picture',
																layout : 'column',
																defaultType : 'textfield',
																items : [ {
																	xtype : 'textfield',
																	fieldLabel : 'JPG | GIF only',
																	id : 'newPicedit',
																	name : 'newPicedit',
																	inputType : 'file',
																	msgTarget : 'side'
																} ]
															} ]
														} ]
													} ]
												} ],
												buttons : [
														{
															text : 'Upload Picture',
															cls : 'portal_pos_btn',
															handler : function ()
															{
																var theForm = that.pictUploadForm.getForm();
																if (Ext.getCmp('newPicedit').getValue() == ""
																			|| Ext.getCmp('newPicedit').getValue() == null)
																{
																	Ext.getCmp('newPicedit').markInvalid(
																				"Please upload image file");
																	Ext.getCmp('newPicedit').focus();
																	return false;
																}
																if (Ext.getCmp('newPicedit').getValue() != ""
																			&& Ext.getCmp('newPicedit').getValue() != null)
																{
																	var imagefile = Ext
																				.getCmp('newPicedit')
																				.getValue()
																				.substring(
																							Ext
																										.getCmp(
																													'newPicedit')
																										.getValue()
																										.lastIndexOf(
																													".") + 1,
																							Ext.getCmp('newPicedit')
																										.getValue().length);
																	if (imagefile && imagefile.toLowerCase() != "jpg"
																				&& imagefile.toLowerCase() != "jpeg"
																				&& imagefile.toLowerCase() != "gif"
																				&& imagefile != "JPG"
																				&& imagefile != "GIF"
																				&& imagefile.toLowerCase() != "bmp"
																				&& imagefile.toLowerCase() != "png")
																	{
																		Ext
																					.getCmp('newPicedit')
																					.markInvalid(
																								"Invalid file extension only jpg|gif|png|bmp image supported");
																		var err_Dialog = new iportal.Dialog(
																					{
																						dialogType : 'ERROR',
																						title : "Error",
																						message : "Invalid file extension only jpg|gif|png|bmp image supported",
																						okHandler : function ()
																						{
																							err_Dialog.close();
																						}
																					});
																		err_Dialog.show();
																		Ext
																					.getCmp('newPicedit')
																					.markInvalid(
																								"Invalid file extension only jpg|gif|png|bmp image supported");
																		Ext.getCmp('newPicedit').focus();
																		return false;
																	}
																}
																Ext.Ajax
																			.request({
																				method : 'POST',
																				params : that.paramObj,
																				form : that.pictUploadForm.getForm()
																							.getEl().dom,
																				url : './PictureUploadServlet?imgHandle=STORE_USER_IMAGE&INPUT_ACTION=PICTURE_PROCESS_ACTION&INPUT_FUNCTION_CODE=VSBLTY&INPUT_SUB_PRODUCT=CUSER&PAGE_CODE_TYPE=PICTURE_PROCESS&PRODUCT_NAME=CUSER&timeout='
																							+ new Date(),
																				// con.URL,
																				success : function (res, req)
																				{
																					if (res.responseText)
																					{
																						var jsonDataSuccess = Ext
																									.decode(res.responseText);
																						if (jsonDataSuccess.data.response)
																						{
																							that
																										.showInfoWindow({
																											title : 'Update',
																											msg : jsonDataSuccess.data.response
																										});
																						} else
																						{
																							that
																										.showInfoWindow({
																											title : 'Update',
																											msg : 'Picture Upated Succesfully'
																										});
																						}
																						Ext.getDom('picedit').src = "./PictureUploadServlet?imgHandle=GET_USER_IMAGE&INPUT_ACTION=PICTURE_PROCESS_ACTION&INPUT_FUNCTION_CODE=VSBLTY&INPUT_SUB_PRODUCT=CUSER&PAGE_CODE_TYPE=PICTURE_PROCESS&PRODUCT_NAME=CUSER&timeout="
																									+ new Date();
																						that.pictUploadForm.getForm()
																									.reset();
																						that.wndDetailedPictureEdit
																									.hide();
																						if (that.wndDetailedPictureEdit != null)
																						{
																							Ext
																										.get(
																													'editFormPictureWnd')
																										.remove();
																							that.wndDetailedPictureEdit = null;
																						}
																					}
																				},
																				failure : function (res, req)
																				{
																					if (res.responseText)
																					{
																						var jsonDataFailure = Ext
																									.decode(res.responseText);
																						if (jsonDataFailure.data.response)
																						{
																							that
																										.showInfoWindow({
																											title : 'Update',
																											msg : jsonDataFailure.data.response
																										});
																						} else
																						{
																							that
																										.showInfoWindow({
																											title : 'Update',
																											msg : 'Picture Not Upated'
																										});
																						}
																						that.pictUploadForm.el.unmask();
																						that.pictUploadForm.getForm()
																									.reset();
																						that.wndDetailedPictureEdit
																									.hide();
																						if (that.wndDetailedPictureEdit != null)
																						{
																							Ext
																										.get(
																													'editFormPictureWnd')
																										.remove();
																							that.wndDetailedPictureEdit = null;
																						}
																					}
																				}
																			});
															}
														}, {
															text : 'Cancel',
															cls : 'portal_neg_btn',
															handler : function ()
															{
																that.wndDetailedPictureEdit.hide();
																that.pictUploadForm.getForm().reset();
																if (that.wndDetailedPictureEdit != null)
																{
																	Ext.get('editFormPictureWnd').remove();
																	that.wndDetailedPictureEdit = null;
																}
															}
														} ]
											});
								if (that.wndDetailedPictureEdit == null)
								{
									that.wndDetailedPictureEdit = new Ext.Window({
										width : 300,
										title : 'Change Picture',
										id : 'editFormPictureWnd',
										autoHeight : true,
										// x : 500,
										// x:Ext.fly('picedit').getX()+150,
										// y : 40,
										animateTarget : Ext.get('picedit'),
										plain : true,
										border : false,
										resizable : false,
										closeAction : 'close',
										closable : true,
										'close' : function ()
										{
											that.wndDetailedPictureEdit.hide();
											if (that.wndDetailedPictureEdit != null)
											{
												Ext.get('editFormPictureWnd').remove();
												that.wndDetailedPictureEdit = null;
											}
										},
										modal : true,
										items : [ that.pictUploadForm ]
									});
								}
								// alert(Ext.get('picedit'.getX()))
								that.wndDetailedPictureEdit.show();
							}
						});
Ext.reg('cbx-userimage-menulayout', cbx.headerlogo.cbxUserImageMenuLayout);

canvas.showPreferences = function ()
{
	CBXDOWNLOADMGR.requestScripts(cbx.downloadProvider.getMergedArray([ "FORM_CONTAINER" ]),
				function ()
				{
					var fm = new cbx.form.FormManager({
						formId : "UPDATE_PREF_FORM",
						extraParams:{
							"WSLIST":iportal.workspace.metadata.getWorkspacesDetail()
							}
					});
					CBXFORMCONTAINER.getWindowByFormObj(fm, "UPDATE_PREF_FORM_CONTAINER", null);
				});
}

