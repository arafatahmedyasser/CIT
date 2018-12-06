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
Ext.namespace('canvas.applnlayout.card.master.icon');
canvas.applnlayout.menu.icons = Ext.extend(Ext.Panel, {
	//width: 255,
	/**
	 * The field 'border' accepts boolean value (true / false). If border value
	 * is true, it renders the master icon with border otherwise border will
	 * not be rendered.
	 */
	border : false,
	/**
	 * The field 'isSelected' accepts boolean value (true / false). If the
	 * value is true, the master screen will be rendered. If the value is false,
	 * the master icon will be rendered in the widget catalog.
	 */
	isSelected : false,

	status : 'AVAILABLE',
	/**
	 * The field 'tpl' will be used to hold the template for the master icon.
	 */
	tpl : new Ext.XTemplate('<div class="menulayoutwsicon_holder"><center>', '<div class="menulayoutwsiconDefault {ICON_CLS}" ></div>', 
				'<div class="menulayoutws_text">{LABEL}</div>', '</center>', '</div>'), 
	/**
	 *  The initComponent function will be used to initialize the master icon
	 */
	initComponent : function (){
		this.height = 150;
		this.width = 150;
		this.on("afterRender", this.initElements, this);
		if (typeof this.tpl === 'string') {
			this.tpl = new Ext.XTemplate(this.tpl);
		}
		canvas.applnlayout.menu.icons.superclass.initComponent.call(this);
	},
	/**
	 * An empty handler is created so that it can be implemented in the places
	 * where an element is created using the xtype : iportal-master-icon
	 */
	handler : function (){
	},
	/**
	 *  The initElements function will be used to attach the onClick event and a
	 * handler to the master icon
	 */
	initElements : function (){
		var EL = Ext.Element;
		var panelBody = this.body;
		this.holder=new EL(panelBody.dom.childNodes[0]);
		this.anchor = new EL(panelBody.dom.childNodes[0].childNodes[0].childNodes[0]);
		this.textEl=new EL(panelBody.dom.childNodes[0].childNodes[0].childNodes[1]);
		this.holder.on("click", this.handler, this);
		this.anchor.on("click", this.handler, this);
		this.textEl.on("click", this.handler, this);

	},
	/**
	 *  The onRender function will be used to call the onRender function of
	 * the master icon's supperclass
	 * 
	 * @param ct
	 * @param position
	 * @returns
	 */
	onRender : function (ct, position){
		canvas.applnlayout.menu.icons.superclass.onRender.call(this, ct, position);
		this.update();
	},
	/**
	 * The update method will be used to update the master icon's template
	 */
	update : function (){
		this.tpl.overwrite(this.body, {
			LABEL : this.label,
			ICON_CLS : this.iconCls + 'Master'
		});
	},

	afterRender : function (){
		if (this.ownerCt != null)
			this.ownerCt.doLayout();
		canvas.applnlayout.menu.icons.superclass.afterRender.apply(this, arguments);
	}
});
Ext.reg('canvas-menulayout-icon', canvas.applnlayout.menu.icons);