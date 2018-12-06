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
 * This class contains the lib specific app/widget confined to the widget/app container.
 */

/**
 * Purpose : Model, Popup, Dialog libraries 
 
 */

cbx.ns("cbx.lib");
cbx.lib.cbxdialog = Class(cbx.core.Component,{
	
	defaults : {
		dialogType : '',
		title : '',
		message : '',
		dialogId : 'dialogContainer', 
		isModal : false,
		isDismissible : false,
		scope : null,
		yesHandler : function(){},
		okHandler : function(){},
		cancelHandler : function(){},
		
		//dialogWidth : '360px',
		dialogWidth:'auto',
		dialogHeight : 'auto'
			,
		bundle : null
	},
	constructor : function(config){
		this.opt = $.extend({},this.defaults, config);
		this.dialog = {};
		this.scope = config.scope?config.scope:null;
		this.bundle = CRB.getFWBundle();
		this.conFlag = false;
		this.initDialog();
		if (this.conFlag)
		{
			$.mobile.activePage.trigger('pagecreate');
		}
		else
		{
			$.mobile.activePage.append(this.dialog).trigger('pagecreate');
		}
	},
	show : function(){
		//this.dialog.popup('open');
		var options = 
		this.dialog.popup({
			'positionTo' : 'window',
			'transition' : 'pop',
			'overlayTheme' : (this.opt.isModal) ? 'a' : 'false'
		}).popup('open');
	},
	close : function(){
		this.dialog.popup('close');
	},
	initDialog : function(){
		this.dialog = $(this.createContainer());
		this.dialog.append(this.createHeader());
		var content = $(this.createContent());
		this.dialog.append(content);
		this.dialog.append(this.createButtons());
		
		this.dialog.css({
			width : this.opt.dialogWidth,
			height : this.opt.dialogHeight
		});
	},
	createContainer : function(){
		var config = {
			'eleType' : 'div',
			'data-role' : 'popup',
			'id' : this.opt.dialogId,
			'data-theme' : 'd',
			'data-dismissible' : (this.opt.isDismissible) ? 'true' : 'false'
		};
		if ($('#' + this.opt.dialogId).get(0))
		{
			this.conFlag = true;
			var container = $('#' + this.opt.dialogId).empty();
			return container[0];
		} 
		else
		{
			return new cbx.lib.layer(config).getLayer();
		}
	},
	createHeader : function(){
		var config = {
			'eleType' : 'div',
			'data-role' : 'header',
			'data-theme' : 'b'
		};
		var container = new cbx.lib.layer(config);
		var configHeader = {
			'eleType' : 'h1',
			'html' : this.opt.title
		};
		container.addLayer(new cbx.lib.layer(configHeader).getLayer());
		return container.getLayer();
	},
	createContent : function ()
	{
		var mainContent = {
			'eleType' : 'div',
			'data-role' : 'content'
		};
		var mainContainer = new cbx.lib.layer(mainContent);
		var imageContent = {
			'eleType' : 'span'
		};
		/* to add image in dialog box,class has been added for respective dialog types */
		if (this.opt.dialogType == 'CONFIRMATION')
		{
			imageContent['class'] = 'confirmation-image';
		} else if (this.opt.dialogType == 'WARNING')
		{
			imageContent['class'] = 'warning-image';
		} else if (this.opt.dialogType == 'ERROR')
		{
			imageContent['class'] = 'error-image';
		} else
		{
			imageContent['class'] = 'info-image';
		}
		mainContainer.addLayer(new cbx.lib.layer(imageContent).getLayer());
		var config = {
			'eleType' : 'div',
			'data-role' : 'content',
			'class' : 'text-align',
			'role' : 'main',
			'data-theme' : 'd',
			'html' : this.opt.message,
			'style' : {
				'padding' : '10px 10px'
			}

		};
		mainContainer.addLayer(new cbx.lib.layer(config).getLayer());
		return mainContainer.getLayer();
	},
	createButtons : function ()
	{
		var okConfig = {
			'eleType' : 'a',
			'href' : '#',
			'data-role' : 'button',
			'data-theme' : 'b',
			'data-icon' : 'check',
			'html' : this.bundle['LBL_OK'],
			'style' : {
				'margin' : '3px'
			}
		};
		var okButton = new cbx.lib.layer(okConfig).getLayer();
		var yesConfig = {
			'eleType' : 'a',
			'href' : '#',
			'data-role' : 'button',
			'data-theme' : 'b',
			'data-icon' : 'check',
			'html' : this.bundle['LBL_YES'],
			'style' : {
				'margin' : '3px'
			}
		};
		var yesButton = new cbx.lib.layer(yesConfig).getLayer();

		var cancelConfig = {
			'eleType' : 'a',
			'href' : '#',
			'data-role' : 'button',
			'data-theme' : 'c',
			'data-icon' : 'delete',
			'html' : this.bundle['LBL_CANCEL'],
			'style' : {
				'margin' : '3px'
			}
		};
		var cancelButton = new cbx.lib.layer(cancelConfig).getLayer();
		var fooConf = {
			'eleType' : 'div',
			'data-theme' : 'd',
			'data-role' : 'footer',
			'align' : 'center',
			'data-inline' : 'true'
		};
		var footer = new cbx.lib.layer(fooConf);
		$footer = $(footer.getLayer());

		if(this.opt.dialogType == 'CONFIRMATION'){
			
			$(okButton).appendTo($footer);
			this.eventHandler($(okButton),this.opt.okHandler);
			
			$(cancelButton).appendTo($footer);
			this.eventHandler($(cancelButton),this.opt.cancelHandler);
			
			$(yesButton).appendTo($footer);
			this.eventHandler($(yesButton),this.opt.yesHandler);
			
		} else if(this.opt.dialogType == 'WARNING'){
			
			$(okButton).appendTo($footer);
			this.eventHandler($(okButton),this.opt.okHandler);
			
			$(cancelButton).appendTo($footer);
			this.eventHandler($(cancelButton),this.opt.cancelHandler);
		} else if (this.opt.dialogType == 'ERROR')
		{

			$(okButton).appendTo($footer);
			this.eventHandler($(okButton), this.opt.okHandler);
		} else if (this.opt.dialogType == 'MESSAGE')
		{

			$(okButton).appendTo($footer);
			this.eventHandler($(okButton), this.opt.okHandler);
		}

		else
		{

			$(okButton).appendTo($footer);
			this.eventHandler($(okButton), this.opt.okHandler);

		}
		return $footer;
	},
	eventHandler : function (obj, callback)
	{
		obj.on('click', this, function (evt)
		{
			if (evt.data.scope)
			{
				callback.apply(evt.data.scope, [ evt.data ]);
			} else
			{
				callback(evt.data)
			}
		});
	}
});
iportal.Dialog = cbx.lib.cbxdialog;
CLCR.registerCmp({
	'COMP_TYPE' : 'APP',
	'VIEW_TYPE' : 'DIALOG'
}, cbx.lib.cbxdialog);
