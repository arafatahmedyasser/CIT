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
Ext.namespace('canvas.applnlayout.excard.mastericon');
canvas.applnlayout.excard.mastericon = Ext.extend(Ext.Panel, {

	/**
	 * The field 'border' accepts boolean value (true / false). If border value
	 * is true, it renders the master icon with border otherwise border will not
	 * be rendered.
	 */

	border : false,

	/**
	 * The field 'isSelected' accepts boolean value (true / false). If the value
	 * is true, the master screen will be rendered. If the value is false, the
	 * master icon will be rendered in the widget catalog.
	 */

	isSelected : false,

	status : 'AVAILABLE',

	/**
	 * The field 'tpl' will be used to hold the template for the master icon.
	 */

	tpl : new Ext.XTemplate(
			'<div class="excardwsicon_holder" title="{LABEL}"><center>',
			'<div class="excardwsicon {ICON_CLS}"></div>',
			'<div class="excardwslabel">{SHORT_LABEL}</div>', '</center>',
			'</div>'),

	/**
	 * The initComponent function will be used to initialize the master icon
	 */

	initComponent : function() {

		this.height = 60;
		this.width = 60;
		canvas.applnlayout.excard.mastericon.superclass.initComponent
				.call(this);
		this.on("afterRender", this.initElements, this);
		if (typeof this.tpl === 'string') {
			this.tpl = new Ext.XTemplate(this.tpl);
		}
	},

	/**
	 * An empty handler is created so that it can be implemented in the places
	 * where an element is created using the xtype : iportal-master-icon
	 */

	handler : function() {
	},

	/**
	 * The initElements function will be used to attach the onClick event and a
	 * handler to the master icon
	 */

	initElements : function() {
		var EL = Ext.Element;
		var panelBody = this.body;
		this.anchor = new EL(
				panelBody.dom.childNodes[0].childNodes[0].childNodes[0]);
		this.anchor.on("click", this.handler, this);
	},

	/**
	 * The onRender function will be used to call the onRender function of the
	 * master icon's supperclass
	 * 
	 * @param ct
	 * @param position
	 * @returns
	 */

	onRender : function(ct, position) {

		canvas.applnlayout.excard.mastericon.superclass.onRender.call(this,
				ct, position);
		this.update();
	},

	/**
	 * The update method will be used to update the master icon's template
	 */

	update : function() {

		this.tpl.overwrite(this.body, {
			LABEL : this.label,
			SHORT_LABEL : iportal.jsutil.getText(this.label, this.width),
			ICON_CLS : this.isSelected ? this.itemId
					+ '-selectedMaster active-ws' : this.iconCls + 'Master'
		});

	},

	setSelected : function(flag) {

		if (flag) {
			this.isSelected = true;
			this.iconCls = this.itemId + '-selected';
		} else {
			this.isSelected = false;
			this.iconCls = this.itemId;
		}
		this.anchor.purgeAllListeners();
		this.update();
		this.initElements();
	},

	afterRender : function() {
		if (this.ownerCt != null)
			this.ownerCt.doLayout();
		canvas.applnlayout.excard.mastericon.superclass.afterRender.apply(
				this, arguments);
	}
});

Ext.reg('iportal-excard-master-icon', canvas.applnlayout.excard.mastericon);