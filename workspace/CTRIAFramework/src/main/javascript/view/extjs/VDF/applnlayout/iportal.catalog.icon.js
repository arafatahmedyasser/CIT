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

Ext.namespace('iportal.catalog');
/**
 * This file will be used to create icons in the widget catalog. 
 */
iportal.catalog.icon = Ext.extend(Ext.Panel, {
	// width: 255,
	/**
	 * The field 'border' accepts boolean value (true / false). If border value
	 * is true, it renders the catalog icon with border otherwise border will
	 * not be rendered.
	 */
	border : false,
	/**
	 * The field 'isSelected' accepts boolean value (true / false). If the
	 * value is true, the widget icon will not be rendered in the widget catalog
	 * and the widget will be rendered in the workspace. If the value is false,
	 * the widget icon will be rendered in the widget catalog and the widget
	 * will not be rendered in the workspace.
	 */
	isSelected : false,
	
	cls:'catalog-icon-panel',
	ctCls:'catalog',
	
	/**
	 * The field 'label' will be used to hold the title of the catalog icon.
	 * The default value is the Loading message
	 */
	label : CRB.getFWBundle().LOADING_MSG,
	/**
	 * The field 'tpl' will be used to hold the template for the catalog icon.
	 */
	tpl : new Ext.XTemplate(
				'<div class="catalog_icon_holder" title="{LABEL}"><center>',
				'<div class="selected catalog_icon_icon {ICON_CLS}"></div>',
				'<span class="catalog_icon_text">{SHORT_LABEL}</span></center>','</div>'),
	/**
	 *  The initComponent function will be used to initialize the catalog icon
	 */
	initComponent : function (){
		this.height = 73;
		this.width = 80;  
		iportal.catalog.icon.superclass.initComponent.call(this);
		this.on("afterRender", this.initElements, this);
		if (typeof this.tpl === 'string') {
			this.tpl = new Ext.XTemplate(this.tpl);
		}
	},
	/**
	 *  An empty handler is created so that it can be implemented in the places
	 * where an element is created using the xtype : iportal-catalog-icon
	 */
	handler : function (){
	},
	/**
	 *  The initElements function will be used to attach the onClick event and a
	 * handler to the catalog icon
	 */
	initElements : function (){
		var EL = Ext.Element;
		var panelBody = this.body;
		this.anchor = new EL(panelBody.dom.childNodes[0]);
		this.anchor.on("click", this.handler, this);

	},
	/**
	 *  The onRender function will be used to call the onRender function of
	 * the catalog icon's supperclass
	 * 
	 * @param ct
	 * @param position
	 * @returns
	 */
	onRender : function (ct, position){
		iportal.catalog.icon.superclass.onRender.call(this, ct, position);
		this.update();
	},
	/**
	 *  The getText function will be used to return a string of the
	 * specified width by truncating the input string if its width is greater
	 * than the input width
	 * 
	 * @param val
	 * @param width
	 * @returns
	 * @returns
	 */
	
	getText : function (val, width){
		if (val == 'null' || val == 'NULL' || val == undefined || val == null || val == '') {
			return '';
		}
		if(val.length > 3 ){
			var stringNumber = iportal.util.stringnumber.getInstance();
			var subString = val.substring(0,3);
			subString = subString + stringNumber.getStringForWidth(val.substring(3,val.length), width-(iportal.preferences.getAverageFontWidth()*3), '');
		}
		return val;//subString; 
	},
	
	/**
	 * The update method will be used to update the catalog template
	 */
	update : function (){
		var label = this.getText(this.label, this.width);
		this.tpl.overwrite(this.body, {
			SHORT_LABEL : label,
			LABEL : this.label,
			ICON_CLS : this.iconCls
		});
	},
	/**
	 * The update method will be used to update to catalog template
	 */
	setLabel : function (label){
		this.label = label;
		this.update();
		this.initElements();
	}
});
// registering iportal-catalog-icon as a xtype
Ext.reg('iportal-catalog-icon', iportal.catalog.icon);