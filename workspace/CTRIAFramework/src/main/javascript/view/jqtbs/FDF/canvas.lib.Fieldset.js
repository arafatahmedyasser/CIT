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

cbx.ns('canvas.lib');
/**
 * @namespace 	"canvas.lib"
 * @description This component is currently responsible Jquery_Bootstrap Framework to form fieldset.
 */

canvas.lib.Fieldset = Class(canvas.lib.FormCmpManager,{
	/**
	 * @class 		"canvas.lib.Fieldset"
	 * @extends		"canvas.lib.FormCmpManager"
	 * @description The initialize function creates the DOM structure for fieldset and renders the form components by calling the respective methods.
	 */
	
	initialize: function() {
		
		var that = this;
		/*
		 * 	Getting the fieldset label. Priority:
		 * 	1. Plain Label
		 * 	2. Display Name from bundle
		 * 	3. Display Name
		 */		
		var plainLbl = cbx.isEmpty(this.formData.plainLbl) ? cbx.isEmpty(CRB.getBundleValue(this.formData.bundleKey, 'LBL_'+ this.formData.displayNmKey)) ? this.formData.displayNmKey : CRB.getBundleValue(this.formData.bundleKey, 'LBL_'+ this.formData.displayNmKey) : this.formData.plainLbl;
		/*
		 * 	The following DOM structure is created here:
		 * 	<div class = "panel panel-default ct-form__fieldset">
		 * 		<div class="panel-heading">
		 * 			<h3 class="panel-title">
		 * 				<a data-toggle="collapse" data-parent="#accordion" href=".{{FIELDSET_ITEMID}}" data-item-id="fieldset_icon_toggler">
		 * 					<span class="ct-form_fieldset_icon flaticon-expand_up" data-item-id="ct-form_fieldset_icon"></span>
		 * 					{{FIELDSET_LABEL}}
		 *				</a>
		 *			</h3>
		 *		</div>
		 *		<div class = "panel-collapse collapse in {{FIELDSET_ITEMID}}">
		 *			<div class = "panel-body" data-item-id = "fieldset">
		 *			<div>
		 *		</div>
		 * 	</div>
		 */
		var parent = new cbx.lib.layer({"eleType" : "div", "class": "panel panel-default ct-form__fieldset" }).getLayer();
		var heading = $('<div class="panel-heading"><h3 class="panel-title"><a data-toggle="collapse" data-parent="#accordion" href=".' + this.formData.itemId +'" data-item-id="fieldset_icon_toggler"><span class="ct-form_fieldset_icon flaticon-expand_up" data-item-id="ct-form_fieldset_icon"></span>'+plainLbl+'</a></h3></div>');		
		$(parent).append(heading);
		var fieldset_body = new cbx.lib.layer({"eleType" : "div", "class": "panel-collapse collapse in " + this.formData.itemId }).getLayer();		
		/*
		 * 	If the fieldset is initially collapsed, following DOM is used instead.
		 */
		if(this.formData.collapsibelInd=='Y'){
			fieldset_body = new cbx.lib.layer({"eleType" : "div", "class": "panel-collapse collapse " + this.formData.itemId }).getLayer();
			heading = $('<div class="panel-heading"><h3 class="panel-title"><a data-toggle="collapse" data-parent="#accordion" href="javascript:void(0);" data-item-id="fieldset_icon_toggler"><span class="ct-form_fieldset_icon ct-form_fieldset_collapse_icon flaticon-expand_down" data-item-id="ct-form_fieldset_icon"></span>'+plainLbl+'</a></h3></div>');		
		}
		var obj = new cbx.lib.layer({"eleType" : "div", "class": "panel-body ct-form__fieldset_align", "data-item-id" : "fieldset" }).getLayer();		
		$(fieldset_body).append(obj);
		$(parent).append(fieldset_body);

		/*
		 * 	The n-columns of inside the fieldset is created by calling the "ncollayout" method 
		 * 	in "canvas.lib.FormCmpManager".
		 */
		this.ncollayout($(obj));
		
		/*
		 * 	The form items inside the fieldset are rendered by calling the "renderChildItems" method 
		 *  in "canvas.lib.FormCmpManager". The form items are rendered inside the DOM structure created.
		 */
		this.renderChildItems($(obj));
		
		/*
		 * 	The DOM structure is appended to its parent.
		 */
		$(this.parentContainer).append(parent);
		
		/*
		 * 	Everytime the fieldset is toggled, the icon to the side of the fieldset label is toggled here.
		 */
		var $this = $(this.parentContainer).find('[data-item-id=fieldset_icon_toggler]');
		
		$this.unbind('click').bind('click', function() {
			if(	$this.find('[data-item-id=ct-form_fieldset_icon]').hasClass('ct-form_fieldset_collapse_icon flaticon-expand_down')) {
				$this.find('[data-item-id=ct-form_fieldset_icon]').removeClass('ct-form_fieldset_collapse_icon flaticon-expand_down');
				$this.find('[data-item-id=ct-form_fieldset_icon]').addClass('flaticon-expand_up');
			}
			else {
				$this.find('[data-item-id=ct-form_fieldset_icon]').removeClass('flaticon-expand_up');
				$this.find('[data-item-id=ct-form_fieldset_icon]').addClass('ct-form_fieldset_collapse_icon flaticon-expand_down');
			}
			if(!cbx.isEmpty($this.parents().find('[data-item-id=ct-modal-content]')))
				that.resizeModalWindow();
		});
		
		
	},
	
	/**
	 * @method resizeModalWindow
	 * @memberof "canvas.lib.Fieldset"
	 * @description Resize the modal window if the form is rendered in the form window.
	 *  			Collapse.TRANSITION_DURATION = 350
	 */
	
	resizeModalWindow: function(){
		setTimeout(function(){
			canvas.lib.modalmgr.resizeActiveModalWindow();
		}, 350);
	},
	
	/**
	 * @method getComponentDOM
	 * @memberof "canvas.lib.Fieldset"
	 * @description This method returns the DOM structure created in the initialize method. 
	 */
	getComponentDOM : function() {
			return this.getItem(0);
	}

});

/**
 * 	Registering the component.
 */
CFCR.registerFormCmp({'COMP_TYPE':'cbx-fieldset' }, canvas.lib.Fieldset);