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

Ext.namespace('cbx.appContainer');

cbx.appContainer.appIcon = Ext.extend(Ext.Panel, {

	// width: 255,

	/**
	 * 
	 * The field 'border' accepts boolean value (true / false). If border value
	 * 
	 * is true, it renders the master icon with border otherwise border will
	 * 
	 * not be rendered.
	 * 
	 */

	border : false,
	/**
	 * 
	 * The field 'tpl' will be used to hold the template for the master icon.
	 * 
	 */
		tpl : new Ext.XTemplate(
				'<div class="appicon-wrap"><div   class="appicon-default {ICON_CLS}">',
				'<div class="addcheck"><input type="checkbox" name="addCheck" value=""></input></div></div>','</div>', 
				'<div class = "div-ab-wrap"><center>{LABEL}</center></div>'
				),
			
	/**
	 * 
	 * The initComponent function will be used to initialize the master icon
	 * 
	 */

	initComponent : function (){

		
		/*
		 * this.height = 150;
		 * 
		 * this.width = 150;
		 */

		/*
		 * if (typeof this.tpl === 'string') {
		 * 
		 * this.tpl = new Ext.XTemplate(this.tpl); }
		 */
		this.on('render',this.update,this);
		this.on("afterRender", this.afterRender, this);
		cbx.appContainer.appIcon.superclass.initComponent.call(this);

		// this.on("afterRender", this.initElements, this);


	},
		afterRender : function(){
			var EL = Ext.Element;
			var panelBody = this.body;
			this.btnDiv = new EL(panelBody.dom.childNodes[0]);
			this.closeImg = new EL(panelBody.dom.childNodes[0].childNodes[0].childNodes[0])
			this.closeImg.on('click',this.addHandler,this,this.closeImg);
			this.btnDiv.on('click',this.handler,this);
		},


	/**
	 * 
	 * An empty handler is created so that it can be implemented in the places
	 * 
	 * where an element is created using the xtype : favorite app icon
	 * 
	 */

	handler : function (){
		
	},
	addHandler : function(){
		
	},
	closeHandler : function(){
		
	}

	/**
	 * 
	 * The update method will be used to update the master icon's template
	 * 
	 */

	,
	update : function (){

		this.tpl.overwrite(this.body, {
			ICON_CLS : this.iconCls,
			CLOSE_CLS : this.closeCls,
			LABEL :this.label 
		});

	}


});

Ext.reg('app-container-app-icon', cbx.appContainer.appIcon);