/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
/**
 * @namespace "ct.view"
 * @description The name space ct.view are useful for organizing the code.<br>
 *              It provides 2 main benefits.<br>
 *              The first is that we can use them to prevent polluting the global namespace with objects,which is
 *              generally considered to be undesireable. cbx, for example has just a single global object (the cbx
 *              object). It's good practice to put any classes inside a namespace, a commonone is the name of your
 *              company or the name of your application.The other advantage is that assists in keeping our code
 *              organized, we can group together similar or co-dependent classes in the same namespace, which helps to
 *              specify your intent to other developers.
 */
cbx.ns('ct.view');
/**
 * @class "ct.view.emptyPanel"
 * @extends "cbx.core.Component"
 * @description This class is used for creating emptyPanel View.
 * @author Sivasubramaniam. D
 */
ct.view.emptyPanel = Class(cbx.core.Component, {

	/**
	 * @method "initialize"
	 * @memberof "ct.view.emptyPanel"
	 * @description "Initialize the empty view component"
	 */
	initialize : function ()
	{
		var me = this;
		this.widgetId = me.WIDGET_ID;
		this.viewMd = me.md;
		this.viewMd.VIEW_ID = this.viewMd.md.VIEW_MD.VIEW_ID
		this.parentElem = me.elem;
		this.createEmptyComponent();
	},
	/**
	 * @method "createEmptyComponent"
	 * @memberof "ct.view.emptyPanel"
	 * @description "Creating empty view component, Getting the view metadata and compiled it with the template."
	 */
	createEmptyComponent : function ()
	{
		var viewMetaData = this.viewMd;
		var tmpLayer = new ct.lib.tmplLayer('emptyview.cttpl', viewMetaData);
		tmpLayer.getTemplate(this.applyTemplate, this);
	},
	/**
	 * @method "getUserContent"
	 * @memberof "ct.view.emptyPanel"
	 * @description "This module is for getting the user content using CGH. If there is no user content then set the
	 *              default message to the display content"
	 */
	getUserContent : function ()
	{
		//this.defaultMsg ="";
		this.viewId = this.viewMd.md.VIEW_MD.VIEW_ID;
		this.userMsg = CGH.getHandler(this.viewId, 
					{
						'OWNER' : this,
						'CONTAINER_ID' : this.getContainerCmpId()
		});
		/*this.userMsg = cbx.isEmpty(this.userContent) ? this.defaultMsg : this.userContent;*/
		this.appendUserContent(this.userMsg);
	},
	/**
	 * @method "appendUserContent"
	 * @memberof "ct.view.emptyPanel"
	 * @description "Appending the display content to the Empty view."
	 */
	appendUserContent : function (data)
	{
		$(this.elem).find("[data-item-id = '"+this.viewMd.VIEW_ID+"|"+this.currentContId+"']").append(data);
	},
	/**
	 * @method "refreshEmpty"
	 * @memberof "ct.view.emptyPanel"
	 * @description "Refreshing the display content for Empty view."
	 */
	refresh : function ()
	{
		this.getUserContent();
	},
	/**
	 * @method "applyTemplate"
	 * @memberof "ct.view.emptyPanel"
	 * @description "Appending the Empty view template to the parent element and check for user content."
	 */
	applyTemplate : function (template, tmpClass)
	{
		if (!cbx.core.isEmpty(this.parentElem))
		{
			$(this.parentElem).append(template);
			this.getUserContent();
		}
	},
	getContainerCmpId : function (){
		if(this.currentContId){
			var currentContId = this.currentContId;
			var emptyContainer = "<div data-item-id="+this.viewMd.VIEW_ID+"|"+(currentContId+1)+"></div>";
			$(this.elem).append(emptyContainer);
			this.currentContId = currentContId + 1;
		}else{
			var emptyContainer = "<div data-item-id='"+this.viewMd.VIEW_ID+"|"+0+"' data-content='child_content'></div>";
			$(this.elem).append(emptyContainer);
			this.currentContId = 0;
		} 
		return $(this.elem).find("[data-content='child_content']:last").data('item-id');
	}

});
/**
 * Registering the empty view component to the CLCR Library.
 */

CLCR.registerCmp({
	'COMP_TYPE' : 'APP',
	'VIEW_TYPE' : 'EMPTY'
}, ct.view.emptyPanel);
