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
Ext.override(Ext.Element,{
	/**
	 * @cfg {string} printCSS The file path of the print.css
	 *      file for printout.
	 */
	printCSS : [ '/iportalweb/iportal/css/print.css' ]
	/**
	 * @cfg {string} extAllCSS The file path of a CSS file for
	 *      ext-all.css.
	 */
	,
	extAllCSS : '/iportalweb/iportal/css/ext-all.css'
	/**
	 * *
	 * 
	 * @cfg {Boolean} to indicate whether ext-all.css Required.
	 */
	,
	extAllCSSReqd : false
	/**
	 * *
	 * 
	 * @cfg {Boolean} printStyle Copy the style attribute of
	 *      this element to the print iframe.
	 */
	,
	printStyle : false
	/**
	 * *
	 * 
	 * @property {string} printTitle Page Title for printout.
	 */
	,
	printTitle : document.title
	/**
	 * * Prints this element header. *
	 * 
	 * @config {String} (optional)
	 */
	,
	printHeader : ''
	/**
	 * * Prints this element. * *
	 * 
	 * @param config
	 *            {object} (optional)
	 */
	,
	print : function(config) {
		Ext.apply(this, config);
		var el = Ext.get(this.id).dom;
		if (this.isGrid) {
			el = el.parentNode;
		}

		var c = document.getElementById('printcontainer');
		var iFrame = document.getElementById('printframe');
		var strTemplate = '<HTML><HEAD>{0}<TITLE>{1}</TITLE></HEAD><BODY onload="{3}"><div class="printLogo"><img src="/iportalweb/iportal/images/LogoJPMC.jpg" /></div></br></br><div align="left" class="printLabelHead" style="padding-left: 5px;" >{2}</div><DIV {4}>{5}</DIV></BODY></HTML>';
		var strLinkTpl = '<link rel="stylesheet" type="text/css" href="{0}"/>'
		var strAttr = '';
		var strFormat;
		var strHTML;

		for (var i = 0; i < el.attributes.length; i++) {
			if (this.printStyle ? this.printStyle
					: el.attributes[i].name.toLowerCase() != 'style') {
				var name = el.attributes[i].name;
				var value = el.attributes[i].value;

				if (value == null || value == 'null'
						|| value == '') {
					// IE returns unset attributes that have
					// empty or null values??
					continue;
				}
				if (value == 'true' || value == 'false') {
					// IE is unable to handle setting attributes
					// that have a boolean value??
					continue;
				}
				strAttr += String.format('{0}="{1}" ', name,
						value);
			}
		}

		var strLink = '';

		// Adding the ext-all.css first incase it is required.
		if (this.extAllCSSReqd) {
			strLink += String
					.format(strLinkTpl, this.extAllCSS);
		}

		// Adding the print.css next. PrintCss can be a array of
		// required print related css files.
		if (this.printCSS) {
			if (!Ext.isArray(this.printCSS))
				this.printCSS = [ this.printCSS ];
			for (var i = 0; i < this.printCSS.length; i++) {
				strLink += String.format(strLinkTpl,
						this.printCSS[i]);
			}
		}

		// Build our HTML document for the iframe
		strHTML = String.format(strTemplate, strLink,
				this.printTitle, this.printHeader,
				Ext.isIE ? 'document.execCommand(\'print\');'
						: 'window.print();', strAttr,
				el.innerHTML);

		// Creating a Hidden DIV
		c = document.createElement('div');
		c.setAttribute('style', 'width:0px;height:0px;'
				+ (Ext.isSafari ? 'display:none;'
						: 'visibility:hidden;'));
		c.setAttribute('id', 'printcontainer');
		el.appendChild(c);

		// IE style attributes
		if (Ext.isIE) {
			c.style.display = 'none';
		}

		// Creating an iFrame and adding it to the hidden DIV
		iFrame = document.createElement('iframe');
		iFrame.setAttribute('id', 'printframe');
		iFrame.setAttribute('name', 'printframe');
		c.appendChild(iFrame);

		// Write our new document to the iframe
		iFrame.contentWindow.document.open();
		iFrame.contentWindow.document.write(strHTML);
		iFrame.contentWindow.document.close();

		if (this.isGrid) {
			var iframeBody = Ext
					.get(iFrame.contentWindow.document.body);
			var cc = Ext.get(iframeBody.first().dom.parentNode);
			cc.child('div.x-panel-body').setStyle('height', '');
			cc.child('div.x-grid3').setStyle('height', '');
			cc.child('div.x-grid3-scroller').setStyle('height',
					'');
		}

	}

});

Ext.override(Ext.Component, {
	printEl : function(config) {
		this.el.print(Ext.isEmpty(config) ? this.initialConfig : config);
	},
	printBody : function(config) {
		this.body.print(Ext.isEmpty(config) ? this.initialConfig : config);
	}
});

