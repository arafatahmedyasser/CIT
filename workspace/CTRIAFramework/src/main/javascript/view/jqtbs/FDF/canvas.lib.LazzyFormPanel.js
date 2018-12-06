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
 * @namespace "canvas.lib"
 * @description This component is currently responsible in Jquery_Bootstrap Framework to do the following in form:
 * 				1. Call the method to create the n-columns in a form container.
 * 				2. Render the child items (form components) inside the columns by calling the respective js files.
 */
canvas.lib.LazzyFormPanel = Class(canvas.lib.FormCmpManager,{
	addFormQueue : 0,
	constructor : function(config) {
		canvas.lib.LazzyFormPanel.$super.call(this,config);
	},
	/**
	 * @class 		"canvas.lib.LazzyFormPanel"
	 * @extends 	"canvas.lib.FormCmpManager"
	 * @description The initialize function creates DOM and calls n-col layout to 
	 * 				create column layout; and renders the child items.
	 */
	initialize: function() {
		this.formId = this.formData.formId;
		this.parentFormId = this.formData.parentformId;
		var elem =  new cbx.lib.layer({"eleType" : "div",  
										"class" : "lazzyFormPanel" , 
										"data-item-id" : this.formId , 
										"name" : this.formId}).getLayer();
		var init_mul = this.formData.initialMultiplicity;
		
		if(!cbx.isEmpty(init_mul)){
			this.multiFormInd=true;
			for(var i = 0; i< parseInt(init_mul); i++){
				this.addNext(this.formId)
			}
			if(this.parentContainer[0]){
				this.addItem(this.parentContainer[0]);
			}else{
				this.addItem(this.parentContainer);
			}
		}else{
			this.ncollayout($(elem));
			this.renderChildItems($(elem));
			if(this.formData.insertDirection == 'TOP'){
				$(this.parentContainer).append(elem);
			}else if(this.formData.insertDirection == 'BOTTOM'){
				$(this.parentContainer).append(elem);
			}else{
				$(this.parentContainer).append(elem);
			}
			
			if(this.parentContainer[0]){
				this.addItem(this.parentContainer[0]);
			}else{
				this.addItem(this.parentContainer);
			}
		}
		
	},
	
	/**
	 * @method 		getComponentDOM
	 * @memberof 	"canvas.lib.LazzyFormPanel"
	 * @description This method returns the DOM element.
	 */
	getComponentDOM : function() {
			return this.getItem(0);
	},
	/**
	 * @method 		removeAt
	 * @memberof 	"canvas.lib.LazzyFormPanel"
	 * @param 		index - {Number} index of the sub form
	 * @description This method removes sub form at that index.
	 */
	removeAt : function(index){
		var formID = this.formData.formId;
		this.parentContainer.find('[name = "'+formID+'"]:nth-child('+(index+1)+')').remove();
		this.updateIndex(index,1);
	},
	/**
	 * @method 		removeFrom
	 * @memberof 	"canvas.lib.LazzyFormPanel"
	 * @param 		start - {Number} start index of the sub forms
	 * @param 		end - {Number} end index of the sub forms
	 * @description This method removes sub forms from start index to end index.
	 */
	removeFrom : function(start, end){
		var formID = this.formData.formId;
		if(end!=undefined){
			for(var i=start; i<=end; i++){
				this.parentContainer.find('[data-item-index = "'+(i)+'"]').remove();
			}
			this.updateIndex(start,end-start+1);
		}else{
			for(var i=start; i<this.addFormQueue; i++){
				this.parentContainer.find('[data-item-index = "'+(i)+'"]').remove();
			}
			this.updateIndex(start,this.addFormQueue-start);
		}
		
	},
	/**
	 * @method 		updateIndex
	 * @memberof 	"canvas.lib.LazzyFormPanel"
	 * @param 		index - {Number} start index of the sub forms
	 * @param 		number - {Number} number of forms removed
	 * @description This method updates the index of the subforms after the removed form/forms.
	 */
	updateIndex : function(index, number){
		var subforms_next = this.parentContainer.find('[name = "'+this.formId+'"]').filter(function(){
								if($(this).data('item-index')>index){
									return true;
								}else
									return false;
								});
		for(var i=0; i<subforms_next.length; i++ ){
			var ind = $(subforms_next[i]).data('item-index');
			$(subforms_next[i]).attr('data-item-index', parseInt(index)+i);
			$(subforms_next[i]).attr('data-item-id',this.formId+'_'+(parseInt(index)+i));
		}
		var count = this.addFormQueue - number;
		this.addFormQueue=  count;
		this.items = $(this.parentContainer).children();
	},
	/**
	 * @method 		updateIndex
	 * @memberof 	"canvas.lib.LazzyFormPanel"
	 * @param 		formId - {String} form Id
	 * @description This method appends a new sub form after the last existing form.
	 */
	addNext	: function(formId){
		var index = this.addFormQueue;
		
		var elem =  new cbx.lib.layer({ "eleType" : "div",  
										"class" : "lazzyFormPanel" , 
										"data-item-id" : this.formId+'_'+index , 
										"name" : this.formId,
										"data-item-index" : index ,}).getLayer();
		this.ncollayout($(elem));
		this.renderChildItems($(elem), index, this.formId);
		var lastChildPanel = $(this.parentContainer).find('[name = '+this.formId+']:last');
		if(lastChildPanel[0]){
			$(lastChildPanel).after(elem);
		}else{
			$(this.parentContainer).append(elem)
		}
		
		this.addFormQueue++;
		this.items = $(this.parentContainer).children();
	},
	/**
	 * @method 		findField
	 * @memberof 	"canvas.lib.LazzyFormPanel"
	 * @param 		index - {Number} index of the sub form
	 * @param 		fieldName - {String} form Id in this case
	 * @description The method will be called from the form manager to find the direct child(container) of the multi sub form in
	 * any index. and get the exact field inside that
	 */
	   findField:function(index,fieldName){
		   if(index<=this.addFormQueue){
			   return this.parentContainer.find('[name = "'+fieldName+'"]:nth-child('+index+')');
		   }else{
			   return;
		   }
	   },
	   /**
		 * @method 		reset
		 * @memberof 	"canvas.lib.LazzyFormPanel"
		 * @description Just remove all the instance of the forms and add the intial numebr of forms which got cloned fter render and also set the cloned model data
		 */
	   reset:function(){
		   this.parentContainer.empty();
		   this.items=[];
		   this.addFormQueue=0
		for(var i=0;i<parseInt(this.formData.initialMultiplicity);i++){
			this.addNext(this.formId);	
		}
	   }

});

/**
 * 	Registering the component.
 */
CFCR.registerFormCmp({'COMP_TYPE':'cbx-lazzyformpanel' }, canvas.lib.LazzyFormPanel);