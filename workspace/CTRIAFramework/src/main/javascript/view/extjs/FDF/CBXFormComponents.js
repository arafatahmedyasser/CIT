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
 * namespace to be used for form view designs; Every form elements to be part of
 * this namespace. Organizing the form components class under a package using
 * namespaces which provides uniqueness and to avoid the conflicts.
 */


//CHG_MAX_LENGTH Starts
/**
Maximum number of characters per line and maximum number of lines validation has to be taken care on keyup
rather than a vtype
*/
Ext.form.Field.prototype.msgTarget = 'side';
Ext.apply(Ext.form.VTypes,{
   invalidChars: function(val, field) {
        return /^([a-zA-Z0-9 #$%^*+,-./:?@\[\]\_`])*$/.test(val);
    },
    invalidCharsText:CRB.getFWBundle().ERR_INVALID_CHAR
});
//CHG_MAX_LENGTH Ends
Ext.namespace('cbx.formElement');

/**
 * Container which manages child Components, rendering them and sizing them
 * where configured. This is an extension of Ext.form.FormPanel class.
 */
cbx.formElement.FormPanel = function(config) {
	this.name = config.name || config.id;
	cbx.formElement.FormPanel.superclass.constructor.call(this, config);
};

Ext.extend(cbx.formElement.FormPanel, Ext.form.FormPanel, {
	bundleKey : '',
	submitOnEnter : true,
	initComponent : function() {

		cbx.formElement.FormPanel.superclass.initComponent.call(this);
		this.frame = false;
		this.bodyBorder = false;
		/**
		 * Right padding increased by 10 pixels for IE6 to align the fields
		 */
		// CHG_FF_ENH -starts
	/*
	 * this.bodyStyle = Ext.isIE6 ? 'padding:10px 20px 10px 10px' :
	 * 'padding:10px'; this.labelAlign = 'top'; this.title = '';
	 */
		// CHG_FF_ENH ends
	},
	onRender : function(ct, position) {
		cbx.formElement.FormPanel.superclass.onRender.call(this, ct, position);
	},
	destroy : function() {
	        responseCount=0 // CHGPANELFILEUPLOAD
		this.items.each(Ext.destroy, Ext); // Destroy all the fields
		cbx.formElement.FormPanel.superclass.destroy.call(this);

	}
});

Ext.reg('cbx-formpanel', cbx.formElement.FormPanel);



/**
 * Container which manages lazy rendering of child Components.This class
 * expected to retrieve the childrens from the formcreator class(getformfields
 * method)by passing the formid,model and manager as config parameters. This is
 * an extension of Ext.Container class.
 */

 cbx.formElement.LazzyFormPanel = Ext.extend(Ext.Container, {
	//CHG_MULTIFORM Starts
	/**
	multiFormInd:Object/Boolean:To indicate a sub form is multi form or not.
	Default value is false
	*/
		multiFormInd:false,
	/**
	initialMultiplicity:Object/String:To indicate the initial multiplicity of a form
	Defaults to empty String
	*/
		initialMultiplicity:'',
	/**
	formIndex:Object/String:To indicate the index of the form in every instance
	*/
		formIndex:null,
		//CHG_MULTIFORM Starts Ends
		initComponent : function() {
			this.labelWidth=parseInt(iportal.preferences.getDefaultLabelWidth());
			if(this.manager && !this.manager.lazzyFormPanel){
				if(this.labelAlignType=='left' || this.findParentByType('cbx-formpanel').labelAlignType=='left'){
					if(this.labelCharCount!="" && parseInt(this.labelCharCount)==this.labelCharCount){
						this.labelWidth=parseInt(iportal.preferences.getLabelCharWidth()*parseInt(this.labelCharCount));
					}
				}
			}
			
	
	/**
	By default the parentForm and childForm is false.
	*/
			//CBXFW_DIT_77 starts
			this.on('hide',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'N']));
			this.on('show',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'Y']));
			//CBXFW_DIT_77 ends
			this.parentForm=false;
			this.childForm=false;
			/**
			 * The following condition is to distinguish between a parent form and a sub form.
			 * A sub form which is configured with an intial multiplicity will be called as a Multi Form
			 * A multiform is nothing but a sub form which has the capability to replicate within itself.
			 * */
			if(this.ownerCt.xtype=='cbx-formpanel'){
				this.parentForm=true;
			}else{
				this.subForm=true;
				if(!Ext.isEmpty(this.initialMultiplicity)){
					this.multiFormInd=true;
					if(this.initialMultiplicity>0){
						this.index=0;
					}else if(this.initialMultiplicity==0){
						this.hidden=true;
						this.index=0;
					}
				}
			}
			//CHG_MULTIFORM Ends
		if (this.formInd !== 'Y') {
			this.formId = this.itemId;
			// CHG_FF_ENHQ2 Starts.The following changes has been done
			// to show and hide a form dynamically.
			this.name=this.itemId;
		}else{
			this.name=this.formId;	
			// //CHG_FF_ENHQ2 Ends
		}
		// calculating the total columns as per the metadata
		var totalColumns = !Ext.isEmpty(this.totalColumns) ? this.totalColumns
				: 1;

		var defaultConfig = {
			itemId : this.itemId,
			title : this.formTitle,
			collapsible : false,
			// CHG_FF_ENHQ2 Starts.
			/**
			 * *Remove the following code to fix the collapsible Indicator issue
			 * of a fieldset
			 */
			/*
			 * collapsed:this.collapsibelInd &&
			 * this.collapsibelInd==='Y'?true:false,
			 */
			// CHG_FF_ENHQ2 Ends.
			items : this.createItems(),
			// bodyStyle:'border:1; border-style:solid;border-color:red',
			// bodyStyle:'border:1;border:solid 1px red;',
			layout : 'tableform',
			layoutConfig : {
				columns : totalColumns
			},
			anchor : '100%',
			forceLayout : true,
			renderHidden : true,
			defaults : {
				layout : 'tableform',
				anchor : '100%'
			}

		};
		Ext.apply(this, defaultConfig);
		// CHG_FF_ENH - starts
		if(this.manager && !this.manager.lazzyFormPanel){ //CBXQ213U09_UPD1 	
			if(this.manager.additionalConfig && this.manager.additionalConfig.formPanelCls){
				this.findParentByType('cbx-formpanel').bodyStyle =this.manager.additionalConfig.formPanelCls;	
			}else{
				var bodyStyleElement = Ext.isIE6 ? 'padding:10px 20px 10px 10px'
							: 'padding:10px';
				this.findParentByType('cbx-formpanel').bodyStyle =bodyStyleElement;					
			}			
		}
		// CHG_FF_ENH --ends
		// CBXR12Q413F08 --starts
		/**
		 * The function handleShow() should have been defined if required. But
		 * it is not required within the scope of the listener, so the line is
		 * unsued and has thus been commented.
		 */
		// this.on("show", this.handleShow);
		// CBXR12Q413F08 --ends
		// call parent initComponent
		cbx.formElement.LazzyFormPanel.superclass.initComponent.call(this);
	},
		//CHG_MULTIFORM Starts
		/**
		 * @Object/Method:private
		 * To create the items as per the metadata.
		 * If the form is a part of the multi form extra logic will be handled in the first call of the lifecycle to create the model structure.
		 * At any point of time when the sub form needs to be added then also the method will be called with a param called
		 * addCall
		 * @param addCall:To indicate the method has been called at the time of addding an isnatnce of the multi form.
		 * @return children as per the metadata
		 * */
		// addCall:When the method will be called before adding the items	
		createItems : function(addCall) {
			/**
			 * Configuration Parameters like formId,model,mode and manger passed to
			 * formcreator to retrieve the children from the metadata
			 */
			/**
			CHG_MULTIFORM Starts:If the multiform indicator is true then cascade the 
			multiFormId property
			*/
			if(this.multiFormInd==true){
				this.multiFormId=this.itemId
			}else{
				this.multiFormId=null;
			}
			//CHG_MULTIFORM Ends
			var config = {
				formId : this.formId,
				model : this.model,
				mode : this.mode,
				//CHG_MULTIFORM Starts
				/**Cascading the multiformId,multiInd and formIndex and also the index property*/
				multiFormId:this.multiFormId,
				multiInd:this.multiFormInd,
				manager : this.manager,
				formIndex:this.index,
				screenView : this.screenView, //CBXFW_DIT_77
				index:this.index,
				//CHG_MULTIFORM Ends
				preInitConfig : this.preInitConfig
			};
			if (this.children != null) {
				config.metadata = {
					totalColumns : 2
				};
				config.metadata.children = this.children;
				config.metadata.additionalData = this.additionalData;
			}
		// Retrieving formfield items
			var formCreator = new cbx.form.FormCreator(config);
			//CHG_MULTIFORM Starts
			/**Creating the items and store into a variable*/
			var formDef=formCreator.getFormFields();
			/**
			 * If the form is a part of mutli form,then there must be a contianer inside which the items needs to be added.
			 * For all the containers which is the immediate children of the sub form for those the item id needs to changed 
			 * as per the EXT life cycle.Other wise the component will be added in the screen.But technically the number of items will not increase.
			 * 
			 * */
			if(this.multiFormInd==true){
				Ext.each(formDef,function(f){
					Ext.apply(f, {
						itemId:f.itemId+'$$$'+Ext.id()//CHG_CT_CLEANUP
					},this);
				});
				/**
				 * Making a clone of the object
				 * */
				this.modelClone=this.cloneObject(this.model.getValue(this.formId));
				/**
				 * Suppose the method has called intially.In that case the addCall parameters will be empty.
				 * Intially a object structure will be created for the sub form.On top of this if already any model data is there(cloned)
				 * then it will be applied on top of this.
				 * */
				if(Ext.isEmpty(addCall)){
					var obj = new Object();
					this.arr=[];
					for(i=0; i < formDef.length;i++) {
						if(formDef[i].children && formDef[i].children.length>0){
							var childs=this.getField(formDef[i]);
							for(var j=0;j<childs.length;j++){
								obj[childs[j].itemId] = [];
							}
						}else{
							obj[formDef[i].itemId] = [];
						}					
						}
					Ext.apply(obj,this.modelClone);
					this.model.updateValue(this.formId,obj);
				}
				return formDef;	
			}else{
				return formDef;
			}
						//CHG_MULTIFORM Ends		
		},
		//CHG_MULTIFORM Starts
		/**Object to store the created fields.Created for future purpose.Not as a part of design*/
		registerMultiForm:{},
		/**Method to store the fields in an oject.Created for future purpose.Not as a part of design*/
		addMultiFormDef : function (formId, formDef){
			this.registerMultiForm[formId] = formDef;
		},
		/**
		 * @Object/Method:private
		 * Utility to put the field level items in an array for communicating with model.
		 * @param:Any container having children.
		 * @return Array of the items contained within the container.
		 * */
		getField:function(def){
			if(Ext.isEmpty(def.children) || def.children.length==0){
				this.arr.push(def);
			}
			else if(!Ext.isEmpty(def) && !Ext.isEmpty(def.children) && def.children.length>0){
				for(var i=0;i<def.children.length;i++){
					this.getField(def.children[i],this.arr);
				}
			}	
			return this.arr;
		},
		/**
		 * @Object/Array:To keep track of the field level items
		 * */
		arr:[],
		/**
		 * @Object/Method:private
		 * To keep a clone of the intial model
		 * @param:Object that needs to be cloneed
		 * @return:Clone reference of the object
		 * */
		cloneObject:function (o) {
		    if(!o || 'object' !== typeof o) {
		        return o;
		    }
		    if('function' === typeof o.clone) {
		        return o.clone();
		    }
		    var c = '[object Array]' === Object.prototype.toString.call(o) ? [] : {};
		    var p, v;
		    for(p in o) {
		        if(o.hasOwnProperty(p)) {
		            v = o[p];
		            if(v && 'object' === typeof v) {
		                c[p] =cbx.core.clone(v);//CHG_CT_CLEANUP
		            }
		            else {
		                c[p] = v;
		            }
		        }
		    }
		    return c;
		},
		//CHG_MULTIFORM Ends
		afterRender : function(ct, position) {
			cbx.formElement.LazzyFormPanel.superclass.afterRender.call(this, ct,
					position);
			// Reformation of layout after rendering the formfield items.
			this.ownerCt.doLayout();
		//CHG_MULTIFORM Starts
			/**
			 * The following block of code will be excuted for a mutli form.
			 * It counts the items  needs to be added as per the model
			 * */
			if(this.multiFormInd==true){
			this.temp=null;
			this.subFormModel=this.model.getValue(this.formId);
			for(var j=0;j<this.arr.length;j++){
				var currentObj=this.arr[j].itemId;
				if(Ext.isEmpty(this.temp)){
					this.temp=this.subFormModel[currentObj].length;
				}
				else if(!Ext.isEmpty(this.subFormModel[currentObj])){
					if(!Ext.isEmpty(this.subFormModel[currentObj])){
						if(this.subFormModel[currentObj].length>this.temp){
							this.temp=this.subFormModel[currentObj].length;
						}
					}
				}
			}
			/**if the initial multiplicty is more than 0 then the temporary variable will be the actual value -1.As already one items will be added by default*/
			if(this.initialMultiplicity>0){
				this.temp=this.temp-1;
			}
			/**Add the forms*/
			for(var i=0;i<this.temp;i++){
				this.addNext();
			}
			/**Again check the initial multiplicty if it is more than 0
			and checking how many items exists.
			Lets say:there are one items in the screen and the multiplicity is 5.
			Then items needs to be added will be multiplicity-items
			*/
			if(this.initialMultiplicity>0){
				if(this.items.length<this.initialMultiplicity){
					var moreItems=parseInt(parseInt(this.initialMultiplicity)-parseInt(this.items.length));
				}
				for(var i=0;i<moreItems;i++){
					this.addNext();
				}
			}
			/**Calculating the initialNumber of forms after rendering.This will be required when resetting the form*/
			this.initialNumberOfForms=this.cloneObject(this.items.length);
			this.modelClone=this.cloneObject(this.model.getValue(this.formId));
			//CHG_MULTIFORM Ends
		}
		},
		destroy : function() {
		responseCount=0 // CHGPANELFILEUPLOAD
			this.items.each(Ext.destroy, Ext); // Destroy all the fields
			cbx.formElement.LazzyFormPanel.superclass.destroy.call(this);
		},
		//CHG_MULTIFORM Starts
		/**
		 * CHGMULTIFORM
		 * @Object/Method:Private
		 * To create a new replica in the sub form. The functional will maintain the model accordingly.
		 * This function will be supposed to be called when a new form needs
		 * to be added in the same form at the next index.
		 * @param:null
		 * @return null
		 * */
		addNext:function(){
			if(Ext.isArray(this.items) && this.items.length>0){
				this.index=this.items.length-0
			}else if(Ext.isArray(this.items) && this.items.length==0){
				this.index=0
			}
			/**Already one items will be there at the time of initializing if the multiplicity is zero or one.Then if the multiplcity was 0 and trying to add,
			then instead of creating the items ,just show the items and set the index to 0*/
			if(this.initialMultiplicity=='0' && this.hidden==true && this.items.length==1){
				this.index=0;
				this.show();
			}
			/**
			If the items.length is greater than one,
			then simply increment the index and addd the fields
			*/
			else if(this.items.length>=1){
				this.index++;
				fields=this.createItems(true);
				this.add(fields);
			}
			/**Else say the developer has removed all the forms from the screen.Now there will not be any items in the screen as well as the items.lengthwill be 0
			In this case just set the index to 0 and add the fields after creating*/
			else if(this.items.length==0) {
				this.index=0;
				fields=this.createItems(true);
				this.add(fields);
			}
			this.doLayout();//CHG_CT_CLEANUP
		},
		/**
		 * @Object/Method:private
		 * This method is intended to call from the form manager to remove an item from the particular index.
		 * @param index(Integer):Which index the items needs to be removed
		 * @return null
		 * */
		 removeAt : function(index){
			 var model = this.manager.model.getValue(this.formId);	
				for(var j=0;j<this.arr.length;j++){
					var currentObj=this.arr[j].itemId;
					if(!Ext.isEmpty(model) && !Ext.isEmpty(model[currentObj])){
						if(index<=model[currentObj].length){
							model[currentObj].removeAt(index);	
						}
					}			
				}
			if(this.items.items.length>index && !Ext.isEmpty(this.items.items[index])){
				//CHG_CT_CLEANUP Starts
				/*this.items.items[index].hide();
				this.items.items[index].removeClass();
				this.items.items[index].removeRef();
				this.items.items[index].el.setDisplayed(false);
				this.items.items[index].el.remove();
				this.items.items[index].destroy();*/
				if(this.index>0)
					this.index--;	
				try{  
					Ext.destroy(this.items.items[index].el.up('tr'));
					this.remove(this.items.items[index].itemId,true);
				}catch(e){
					LOGGER.info(e);
				}
				this.updateIndex(index,this.items.items);
			}else{
				LOGGER.error('The items does not exist');
				return;
				//CHG_CT_CLEANUP Ends
			}
			},
		 /**
			 * @Object/Method:private
			 * This method is intended to call from the form manager to remove an item from the particular index.
			 * @param:index(Integer):Which index the items needs to be removed
			 * @return null
			 * */
			 removeFrom : function(index,endIndex,resetCall){
				 var model = this.manager.model.getValue(this.formId);	
					for(var j=0;j<this.arr.length;j++){
						var currentObj=this.arr[j].itemId;
						if(!Ext.isEmpty(model) && !Ext.isEmpty(model[currentObj])){
							if(index<=model[currentObj].length){
							model[currentObj].removeAt(index,model[currentObj].length);
							}
						}			
					}
				if(this.items.items.length>index ){
					for(var i=this.items.items.length-1;i>=0;i--){
						if(!Ext.isEmpty(this.items.items[index])){
						//CHG_CT_CLEANUP Starts
						
							if(this.index>0)
								this.index--;	
								try{
								Ext.destroy(this.items.items[index].el.up('tr'));
								this.remove(this.items.items[index].itemId,true);
								}catch(e){
									LOGGER.error(e);
								}
//					CHG_CT_CLEANUP Ends
						}
					}
				}else{
					
					return;
				}
			 },
		 /**
		  * Object/Method:private
		  * The method is expected to update the index after removing any index from the particular container.This is a recursive function
		  * @params:items:Items of the contianer within the multi form.
		  * 		index:Index after which we need to update.
		  * 		child:Any child is there or not.
		  * */
		 updateIndex:function(index,items,child){
			 if(!Ext.isEmpty(child)&& child==true)
				 var startIndex=0;
			 else{
				 var startIndex=index;
			 }
			   if(items.length>0){
				   for(var i=startIndex;i<items.length;i++){
				   //CHG_CT_CLEANUP Starts
				   items[i].index=index;
				   if(items[i].items && items[i].children!=undefined){
					   this.updateIndex(i,items[i].items.items,true);
					   index++;
				   }
			   	//CHG_CT_CLEANUP Ends
			   }
			   }else{
				 
				   items.index=index;
			   }
		   },
		   /**Method:findField
		   The method will be called from the form manager to find the direct child(container) of the multi sub form in
		   any index. and get the exact field inside that
		   */
		   findField:function(index,fieldName){
			   var ct=this.items.items[index];
			   if(ct!==undefined && !cbx.isEmpty(ct)){
			   var field=ct.find('name',fieldName)[0];
			   return field;
			   }
		   },
		   /**Method:Reseting the sub form .
		   Just remove all the instance of the forms and add the intial numebr of forms which got cloned fter render and also set the cloned model data
		   */
		   reset:function(){
			this.removeFrom(0,undefined);
			this.model.setValue(this.formId,this.modelClone);
			for(var i=0;i<this.initialNumberOfForms;i++){
				this.addNext();	
			}
		   }
	//CHG_MULTIFORM Ends
		 });
	Ext.reg('cbx-lazzyformpanel', cbx.formElement.LazzyFormPanel);

/**
 * Grouping related form fields together.This is an extension of
 * Ext.form.FieldSet class.
 */
cbx.formElement.fieldset = Ext.extend(Ext.form.FieldSet, {
	RTLSupported:iportal.preferences.isLangDirectionRTL?iportal.preferences.isLangDirectionRTL():false,

	initComponent : function() {
	
		this.hidden=((this.visibleInd && this.visibleInd=='N')||(this.hidden && this.hidden==true))?true:false;	
		
		//LABEL_CHAR_COUNT starts
		this.labelWidth=parseInt(iportal.preferences.getDefaultLabelWidth());
		if(this.labelAlignType=='left' || this.findParentByType('cbx-formpanel').labelAlign=='left'){
			if(this.labelCharCount!="" && parseInt(this.labelCharCount)==this.labelCharCount){
				this.labelWidth=parseInt(iportal.preferences.getLabelCharWidth()*parseInt(this.labelCharCount));
			}
		}
		//LABEL_CHAR_COUNT ends	
		
		//CBXFW_DIT_77 starts
		this.on('hide',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'N']));
		this.on('show',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'Y']));
		//CBXFW_DIT_77 ends
		// Owning title from plainlabel or fieldlabel
		var bundle;
		var commonbundle = CRB.getFWBundle();
		// To get the bundle key reference
		bundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));
		this.collapsible =this.toggleInd && this.toggleInd === 'Y'?false:true; //CHG_TRADE_POC
		if (!Ext.isEmpty(this.plainLbl)) {
			this.title = this.plainLbl;

		} else if (!Ext.isEmpty(this.displayNmKey)) {
			this.title = bundle['LBL_' + this.displayNmKey];
		} else {
			this.title = '';
			this.collapsible = false;
		}
		/* Starts here for iSolve SIT - #773 - IR_ENHANCEMENTS_001 */

		if (this.requiredInd === 'Y' && !Ext.isEmpty(this.title) && this.title !=' ') {
			this.title = this.title+ '<span class = \'cbx-mandatory-label\'>*</span>';
		}
		/* Ends here for iSolve SIT - #773 - IR_ENHANCEMENTS_001 */
		// this.title=this.plainLbl || this.fieldLabel;
		this.autoHeight = true;
		this.name = this.itemId;
		// calculating the total columns as per the metadata
		var totalColumns = !Ext.isEmpty(this.totalColumns) ? this.totalColumns
				: 1;
		var ieRTLCheck = true;
		if(!Ext.isIE ){ // For non-IE 
				ieRTLCheck=false;
		} else if (!this.RTLSupported && Ext.isIE) { //IE with English
			ieRTLCheck=false;
		}else if(this.RTLSupported && Ext.isIE){ //IE with Arabic
			ieRTLCheck=true;
		}else if(!Ext.isIE || this.RTLSupported ){ 
			ieRTLCheck=false;
		}
		var defaultConfig = {
			itemId : this.itemId,
			name : this.itemId,
			title : this.title,
			items : this.createItems(),
			layout : 'tableform',
			layoutConfig : {
				columns : totalColumns
			},
			anchor : '100%',
			forceLayout : true,
			renderHidden : true,
			// CHG_FF_ENHQ2 Starts
			/**
			 * *fix.Fixed for the fieldset to be in collapsed mode intially if
			 * the collapsibleInd is set to true
			 */
			collapsed:this.collapsibelInd==='Y'?true:false,
			// CHG_FF_ENHQ2 Ends
															
			defaults : {
				layout : 'tableform',
				anchor : '100%'
			}

		};
		Ext.apply(this, defaultConfig);
		// call parent initComponent
		cbx.formElement.fieldset.superclass.initComponent.call(this);
	},
	createItems : function() {
		var totalColumns = !Ext.isEmpty(this.totalColumns) ? this.totalColumns
				: 1;
		/**
		 * Configuration Parameters like formId,model,mode and manger passed to
		 * formcreator to retrieve the children from the metadata
		 */

		var config = {
			formId : this.formId || this.parentId,
			model : this.model,
			screenView : this.screenView, //CBXFW_DIT_77
			mode : this.mode,
			manager : this.manager,
			//CHG_MULTIFORM Starts
			/**
			Cascading the multiInd,multiFormId and formIndex
			*/
			multiInd:this.multiFormInd,
			multiFormId:this.multiFormId,
			formIndex:this.index,
			//CHG_MULTIFORM Ends
			preInitConfig : this.preInitConfig
		};

		if (this.children != null) {
			config.metadata = {
				totalColumns : totalColumns
			};
			config.metadata.children = this.children;
		}else{			
			config.metadata={children:[]};
		}
		config.metadata.additionalData = this.metadata.additionalData;
		// Retrieving formfield items
		var formCreator = new cbx.form.FormCreator(config);
		return formCreator.getFormFields();
	},
	afterRender : function(ct, position) {
		cbx.formElement.fieldset.superclass.afterRender
				.call(this, ct, position);
		this.ownerCt.doLayout();

	},

	// FW-R12-08-2012-062 Starts

	onExpand : function(doAnim, animArg){		

		cbx.formElement.fieldset.superclass.onExpand.call(this, doAnim, animArg);

		this.manager.redoLayout();	
		//ARAFAT RTL
		if(this.RTLSupported && Ext.isIE){		
			cbx.formElement.fieldset.superclass.show.call(this);		
    	}
		//ARAFAT RTL
    	}
	//CHG_FIELDSET_DISABLE Starts
	,disable:function(){
		cbx.formElement.fieldset.superclass.disable.call(this);
    	this.items.each(function (f){
			if (f.rendered && f.el.dom!=undefined) {
				f.disable();
			}
		}, this);
    }
	,enable:function(){
		cbx.formElement.fieldset.superclass.enable.call(this);
    	this.items.each(function (f){
			if (f.rendered && f.el.dom!=undefined) {
				f.enable();
			}
		}, this);
    }
	,show:function(){
		cbx.formElement.fieldset.superclass.show.call(this);
    	this.items.each(function (f){
			if (f.rendered && f.el.dom!=undefined) {
				f.show();
			}
		}, this);
    }
	,hide:function(){
		cbx.formElement.fieldset.superclass.hide.call(this);
    	this.items.each(function (f){
			if (f.rendered && f.el.dom!=undefined) {
				f.hide();
			}
		}, this);
    }
	//CHG_FIELDSET_DISABLE Ends
	// FW-R12-08-2012-062 Ends
	//CHG_MULTIFORM Starts.cascade method to cascade any any property within any level.
	 ,cascade : function(fn, scope, args){
	        if(fn.apply(scope || this, args || [this]) !== false){
	            if(this.items){
	                var cs = this.items.items;
	                for(var i = 0, len = cs.length; i < len; i++){
	                    if(cs[i].cascade){
	                        cs[i].cascade(fn, scope, args);
	                    }else{
	                        fn.apply(scope || cs[i], args || [cs[i]]);
	                    }
	                }
	            }
	        }
	        return this;
	    },
	    /**
		 * Find a component under this container at any level by property
		 * 
		 * @param {String}
		 *            prop
		 * @param {String}
		 *            value
		 * @return {Array} Array of Ext.Components
		 */
	    find : function(prop, value){
	        return this.findBy(function(c){
	            return c[prop] === value;
	        });
	    },
	    /**
		 * Find a component under this container at any level by a custom function.
		 * If the passed function returns true, the component will be included in
		 * the results. The passed function is called with the arguments (component,
		 * this container).
		 * 
		 * @param {Function}
		 *            fn The function to call
		 * @param {Object}
		 *            scope (optional)
		 * @return {Array} Array of Ext.Components
		 */
	    findBy : function(fn, scope){
	        var m = [], ct = this;
	        this.cascade(function(c){
	            if(ct != c && fn.call(scope || c, c, ct) === true){
	                m.push(c);
	            }
	        });
	        return m;
	    },
	    /**setValue,getValue,markInvalid and clearInvalid is mark the fieldset as a form fields*/
	    /*setValue:function(){
	    	
	    },
	    getValue:function(){
	    	
	    },
	    markInvalid:function(){
	    	
	    },
	    clearInvalid:function(){
	    	
	    },*/
	    /**Method: Intended to be called from the isFormValid method.
	    Iterate all the fields and validate those
	    */
	    validate:function(){
	    	var isValid=true;
	    	this.items.each(function (f){
				if (f.rendered && f.hidden === false && f.el.dom!=undefined) {
					if (!f.validate()) {
						isValid = false;
					}
				}
			}, this);
	    	return isValid;
	    }
});

Ext.reg('cbx-fieldset', cbx.formElement.fieldset);

/**
 * This is an extension of Ext.form.TextField class
 */
cbx.formElement.cbxTextField = function(config) {
	this.plainLabel = config.plainLbl;
	this.fieldLabel = config.displayNmKey;
	this.lookup = config.lookup;
	this.lookupCmp = config.lookupCmp;
	this.name = config.itemId;
	//CHG_MULTIFORM Starts
	if(!Ext.isEmpty(config.multiFormId) && !Ext.isEmpty(config.index)){
		this.value = config.model.getModelData()[config.multiFormId][config.itemId][config.index];
	}else{
		this.value = config.model.getModelData()[config.itemId];	
	}
	//CHG_MULTIFORM Ends
	this.required = config.requiredInd;
	this.conditional = config.conditionalInd;
	this.maxLength=config.maxLength; // Added for iSolve SIT - #773 -
										// IR_ENHANCEMENTS_001
	this.readOnly = config.readOnlyInd === 'Y' ? true : false;
	this.hidden = config.visibleInd === 'Y' ? false : true;
	this.validationType = config.vType;
	this.multiLangFlag=config.multiLangInd; // FW115
	cbx.formElement.cbxTextField.superclass.constructor.call(this, config);
};
Ext.extend(cbx.formElement.cbxTextField, Ext.form.TextField,
		{
			required : 'N',
			conditional : 'N',
			bundleKey : '',
			lookup : false,
			vtype : '', //UAT_6405
			validationType : 'none',
			allowSpaces : false,
			plainLabel : '',
			fieldLabel : '',
			cls : 'x-form-textField',
				// CBX_FW_Q112F_092 Starts
			/**
			 * String/(Object):The error message for invalidaqtiong a field
			 */
			invalidText:null,
			/**
			 * Regular expression against which the field will be validated
			 */
			maskRe:null,
			globalRe:null,// CBX_FW_Q112F_092_UPD
			enableKeyEvents:true,
				// CBX_FW_Q112F_092 Ends
			initComponent : function() {
				this.cls = this.cls+' '+this.itemId;
				this.on('hide',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'N']));
				this.on('show',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'Y']));
				//CBXFW_DIT_77 ends
				// FW115 Starts
				/**
				 * If multiLangFlag is enabled then the validation type and
				 * vtype should explicitly made empty ,to avoid the validation
				 * error for multilingual data support
				 */
				if(this.multiLangFlag==='Y'){
					this.vtype='';
					this.validationType='';
				}
				// FW115 Ends
				// CBX_FW_Q112F_092 Starts
				/**
				 * if the validation type has been configured then the
				 * configured vtype will be checked in the vtype registry. If
				 * the configured vtype is matching with any vtype in registry
				 * then it will be validated Or else the it will check the
				 * default validation types supprted by text
				 * field(alphaNumeric,portalSupported and numeric).
				 */
				if(!Ext.isEmpty(this.validationType)){
					var registeredVtypes=cbx.form.vTypeRegistry.getVtypes();
					for(var i=0;i<registeredVtypes.length;i++){
						if(this.validationType==registeredVtypes[i].name){
							this.vtype=this.validationType;
							this.maskRe=registeredVtypes[i].mask;
							this.invalidText=registeredVtypes[i].text;
							this.globalRe=registeredVtypes[i].globalRe;//FW_FIX10MAR2013
							break;
// CBXR12Q413U03 starts & RTLVTYPE20062013 Starts
						}else if(this.validationType=='alphaNumeric' || this.validationType=='numeric' || this.validationType=='portalSupported' || this.validationType=='decimal' || this.validationType=='alphaNumericSpecial' || this.validationType=='swiftwithoutsinglequote'){     
// CBXR12Q413U03 ends  & RTLVTYPE20062013 Ends
							LOGGER.info("The vtype that has  been configured is default set as :",this.validationType);
						}else{
							LOGGER.error("The vtype",+this.validationType+" has not registered in vtype registry");
						}
					}
				}
				// CBX_FW_Q112F_092 Ends
				if (Ext.isEmpty(this.maxLength)) {
					this.maxLength = undefined;
				}
				if (Ext.isEmpty(this.minLength)) {
					this.minLength = undefined;
				}
				cbx.formElement.cbxTextField.superclass.initComponent.apply(
						this, arguments);
				var bundle;
				var commonbundle = CRB.getFWBundle();
				// To get the bundle key reference
				bundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));
				/**
				 * If the plainLabel attribute is not null ,component's field
				 * label will be the plain-label else the label associated with
				 * bundle keys will be referred to get the field label.
				 */
				if (!Ext.isEmpty(this.plainLabel)) {
					this.fieldLabel = this.plainLabel;
				} else if (Ext.isEmpty(this.fieldLabel)) {
					this.fieldLabel = '';
				} else {
					this.fieldLabel = bundle['LBL_' + this.fieldLabel];
				}
				if (this.maxLength < Number.MAX_VALUE) {
					this.maxLengthText = String.format(
							commonbundle['ERR_MAXLENGTH_EXCEED'],
							this.fieldLabel, this.maxLength);
				}
				if (this.minLength < Number.MIN_VALUE) {
					this.minLengthText = String.format(
							commonbundle['ERR_MINLENGTH_EXCEED'],
							this.fieldLabel, this.minLength);
				}
				/**
				 * If the conditional attribute is Y the components field label
				 * will be field label associated with two stars
				 */
				if (this.conditional === 'Y') {
					this.blankText = String.format(
							commonbundle['ERR_MANDATORY'], this.fieldLabel);
					if (Ext.isEmpty(this.fieldLabel)) {
						this.fieldLabel = '?' + this.fieldLabel + '?'
								+ '<span class = \'cbx-mandatory-fx\'">**</span>';// CHG001-CSS
																					// changes
					} else {
						this.fieldLabel = this.fieldLabel
								+ '<span class = \'cbx-mandatory-fx\'">**</span>';// CHG001-CSS
																					// changes
					}
				}
				/**
				 * If the required attribute is Y,components field label will be
				 * field label associated with mandatory star and the field will
				 * not allow blank values.
				 */
				else if (this.required === 'Y') {
					this.blankText = String.format(
							commonbundle['ERR_MANDATORY'], this.fieldLabel);
					this.allowBlank = false;
					if (Ext.isEmpty(this.fieldLabel)) {
						this.fieldLabel = '?' + this.fieldLabel + '?'
								+ '<span class = \'mandatory\'">*</span>';
					} else {
						this.fieldLabel = this.fieldLabel
								+ '<span class = \'mandatory\'">*</span>';
					}
				} else {
					this.blankText = String.format(
							commonbundle['ERR_MANDATORY'], this.fieldLabel);
					if (Ext.isEmpty(this.fieldLabel)) {
						this.fieldLabel = '?' + this.fieldLabel + '?'
								+ '<span class = \'non_mandatory\'"></span>';
					} else {
						this.fieldLabel = this.fieldLabel
								+ '<span class = \'non_mandatory\'"></span>';
					}
				}
				this.labelSeparator = '';
				switch (this.validationType) {
				// validation type currently supported is alphaNumeric and
				// numeric alone, which restricts the keystrokes
				// to be only alphabets and numerals.Numeric vType is an
				// alternate for numberfield
				//CHG_TRADE_POC Starts
				case 'swift':
					//NBAD_UAT_6405 starts
					this.maskRe=/[A-Za-z0-9,.:'+\(\)?'\- \/]/; //UAT_6405
					this.globalRe=/[A-Za-z0-9,.:'+\(\)?'\- \/]/g; //UAT_6405
					//NBAD_UAT_6405 ends
					this.invalidText="Only /-?:().,'+ are allowed";
				break;
					/* UAT-7757 starts */
				
				//UAT_8297 STARTS
				case 'email':
					 
					this.maskRe=  /[a-zA-Z0-9._@-]/; 

					this.globalRe= /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

					this.invalidText="This field should be an e-mail address in the format \"user@example.com\"";
				break;
				//UAT_8297 ENDS
				
				case 'swift-res-quote':
					//NBAD_UAT_6405 starts
					this.maskRe=/[A-Za-z0-9,.:+\(\)?\- \/]/; //UAT_6405
					this.globalRe=/[A-Za-z0-9,.:+\(\)?\- \/]/g; //UAT_6405
					//NBAD_UAT_6405 ends
					this.invalidText="Only /-?:().,+ are allowed";
				break;
					/* UAT-7757 ends */
					
				case 'alphaNumericToUpper':
					if (this.allowSpaces) {
						// CBX_FW_Q112F_092 Starts
						this.maskRe = /[A-Za-z0-9 ]/;	
						this.globalRe  = /[A-Za-z0-9 ]/g;
						this.invalidText=commonbundle.ERR_ONLYALPHANUMERIC_TOUPPER_SPACE
					//CHG_MOBILE Ends
						// CBX_FW_Q112F_092 Ends
					} else {
						// CBX_FW_Q112F_092 Starts
						this.maskRe = /[A-Za-z0-9]/;	
						this.globalRe = /[A-Za-z0-9]/g;
						this.invalidText=commonbundle.ERR_ONLYALPHANUMERIC_TOUPPER
					  	// CBX_FW_Q112F_092 Ends
					}
					break;
				//CHG_TRADE_POC Ends
				case 'alphaNumeric':
					if (this.allowSpaces) {
					// CBX_FW_Q112F_092 Starts
						// CBX_FW_Q112F_092_UPD STARTS
						// this.maskRe = /[A-Za-z0-9 ]/g;
						this.maskRe = /[A-Za-z0-9 ]/;
						this.globalRe=/[A-Za-z0-9 ]/g;
						// CBX_FW_Q112F_092_UPD ENDS
						this.invalidText=commonbundle.ERR_ONLY_ALPHANUMERIC_SPACES
						// CBX_FW_Q112F_092 Ends
					} else {
						// CBX_FW_Q112F_092 Starts
						// CBX_FW_Q112F_092_UPD STARTS
						// this.maskRe = /[A-Za-z0-9]/g;
						this.maskRe = /[A-Za-z0-9]/;
						this.globalRe= /[A-Za-z0-9]/g;
						// CBX_FW_Q112F_092_UPD ENDS
							this.invalidText=commonbundle.ERR_ONLY_ALPHANUMERIC
					  	// CBX_FW_Q112F_092 Ends
					}
					break;
					
				//RTLVTYPE20062013 - Starts
				//11.4.1CR001 -Starts
				case 'alphaNumericSpecial':
					
					if (this.allowSpaces) {
						
						this.maskRe = /[A-Za-z0-9 ,-./_]/;	
						this.globalRe  = /[A-Za-z0-9 ,-./_]/g;
						this.invalidText="Only AlphaNumeric and retail supported special characters are allowed";
						
					} else {	
						
						this.maskRe = /[A-Za-z0-9 ,-./_]/;
						this.globalRe = /[A-Za-z0-9 ,-./_]/g;
						this.invalidText="Only AlphaNumeric and retail supported special characters are allowed";	
						
					}
					break;
					//11.4.1CR001 -Ends
			  //RTLVTYPE20062013 - Ends
					
				// Use numeric vtype as an alternate for NumberField
				case 'numeric':
					if (this.allowSpaces) {
						// CBX_FW_Q112F_092 Starts
						// CBX_FW_Q112F_092_UPD STARTS
						// this.maskRe = /[0-9 ]/g;
						this.maskRe = /[0-9 ]/;
						this.globalRe=/[0-9 ]/g;
						// CBX_FW_Q112F_092_UPD ENDS
						this.invalidText="Only numeric and spaces are allowed";
					  	// CBX_FW_Q112F_092 Ends
					} else {
						// CBX_FW_Q112F_092 Starts
						// this.maskRe = /[0-9]/g;
						// CBX_FW_Q112F_092_UPD STARTS
						this.maskRe = /[0-9]/;
						this.globalRe=/[0-9]/g;
                        // CBX_FW_Q112F_092_UPD ENDS
						this.invalidText="Please enter the valid number";
					  	// CBX_FW_Q112F_092 Ends
					}
					break;
				case 'portalSupported':
					if (this.allowSpaces) {
					// CBX_FW_Q112F_092 Starts
                       // CBX_FW_Q112F_092_UPD STARTS
						// this.maskRe = /[^<>;{}()!=&\'\"]/g;
						this.maskRe = /[^<>;{}()!=&\'\"]/;
						this.globalRe=/[^<>;{}()!=&\'\"]/g;
						// CBX_FW_Q112F_092_UPD ENDS
							this.invalidText="Only portal supported caharacters are allowed.";
						  	// CBX_FW_Q112F_092 Ends
					} else {
						// CBX_FW_Q112F_092 Starts
					   // CBX_FW_Q112F_092_UPD STARTS
						// this.maskRe = /[0-9]/g;
						this.maskRe = /[^<>;{}()!=&\'\" ]/;
						this.globalRe=/[^<>;{}()!=&\'\" ]/g;
                                              // CBX_FW_Q112F_092_UPD ENDS
						this.invalidText="Only portal supported caharacters are allowed.";
					  	// CBX_FW_Q112F_092 StartsEnds
					}
					break;
					// CBXR12Q413U03 starts
				case 'decimal':
					if (this.allowSpaces) {
                        // CBX_FW_Q112F_092_UPD STARTS
						// this.maskRe = /[0-9. ]/g;
						this.maskRe = /[0-9. ]/;
						this.globalRe=/[0-9. ]/g;
						// CBX_FW_Q112F_092_UPD ENDS
						var crb = CRB.getFWBundle();
						this.invalidText = String.format(crb['INVALID_TEXT_SPACES']);
					} else {
                        // CBX_FW_Q112F_092_UPD STARTS
						// this.maskRe = /[0-9.]/g;
						this.maskRe = /[0-9.]/;
						this.globalRe=/[0-9.]/g;
						// CBX_FW_Q112F_092_UPD ENDS
						var crb = CRB.getFWBundle();	
						this.invalidText = String.format(crb['INVALID_TEXT']);
					}
					break;
					// CBXR12Q413U03 ends
				}
				// this.on('keyup',this.customValidator);//
				// CBX_FW_Q112F_092//CBX_FW_Q112F_092_UPD
				this.anchor = (this.anchor == undefined) ? '' : this.anchor;
				/**
				 * On change event invokes the syncModelData method which in
				 * turn updates the model with name and current value
				 */
				this.on('change', this.syncModelData);
				// FW-R12-08-2012-057 Starts
				//CBXQ2FW181 Starts
				/*this.onBlur=function(){

					this.syncModelData();	

				};*/
				//CBXQ2FW181 Ends
				// FW-R12-08-2012-057 Ends
			},
			// CBX_FW_Q112F_092_UPD Starts
			afterRender:function(){
				//CBXFW_DIT_77 starts
				this.updateScreenViewData(this);
				//CBXFW_DIT_77 ends
				cbx.formElement.cbxTextField.superclass.afterRender.call(this); //CHG_TRADE_ENH
				////UAT_8296 - STARTS
				if(this.validationType == "email"){
					this.getEl().on('blur',this.customValidator,this); 
				}else {
					this.getEl().on('keyup',this.customValidator,this); //CHG_TRADE_ENH
				}
				//UAT_8296 ENDS
				/*DIT_108 starts- registering events*/
				if(this.copyPasteInd==="Y")
				{
				this.getEl().on('keydown',preventCopyPaste,this);
				this.getEl().on('drop',preventCopyPaste,this);
				this.getEl().on('dragstart',preventCopyPaste,this);
				this.getEl().on('draggesture',preventCopyPaste,this);
				}
				/*DIT_108 Ends*/
				
			},
			//CBXQ313F53 - Starts
			validator:function(v,isCompleteValue){	//UAT_6405 STARTS////UAT_8296					
			//CBXQ313F53_UPD - Starts					
				if(this.allowBlank==false && Ext.util.Format.trim(v).length==0){
					/***
					 * Ensuring that the blanktext is always shown as the invalidText
					 * when the field is always empty
					 */
					 //CHG_CT_CLEANUP Starts
				this.vtypeText=this.blankText;//CBX_TXT_VALDN_01
			        return this.vtypeText;
				//CHG_CT_CLEANUP Ends
				  //UAT_6405 STARTS
				}
				var mask = "";
				if(!Ext.isEmpty(this.validationType)){
					//UAT_8296 - STARTS
					if(this.validationType == 'email' && (Ext.isEmpty(isCompleteValue) || isCompleteValue == false)){
						isCompleteValue = false;
						return true;
					}
					//UAT_8296 - ENDS
					mask=this.globalRe;
				}
				//UAT_6405 ENDS
				 // If the value is not matching with the regular expression
				 //or if the number of matching characters is less than the
				 //field value length
				
				 
				if(!Ext.isEmpty(mask) && !Ext.isEmpty(v)){ //UAT_8297
					
					//UAT_8297 STARTS
					var matchLength=0;
					var matches;
					if(v.match(mask)!=null)
						{
						matches=v.match(mask);
						for(var itemIndex=0;itemIndex< matches.length;itemIndex++)
							{
							matchLength+=matches[itemIndex].length;
							}
						if(matchLength>=v.length)
							return true;
						}
					
					//UAT_8297 ENDS
					
					
					var commonbundle=CRB.getFWBundle();
							if(this.validationType=='alphaNumeric' && this.allowSpaces==true){
								this.invalidText=commonbundle.ERR_ONLY_ALPHANUMERIC_SPACES
							}else if(this.validationType=='alphaNumeric'){
								this.invalidText=commonbundle.ERR_ONLY_ALPHANUMERIC
							}
							else if(this.validationType=='numeric' && this.allowSpaces==true){
								this.invalidText="Only numeric and spaces are allowed";
							}
							else if(this.validationType=='numeric'){
								this.invalidText="Please enter the valid number";
							}
							else if(this.validationType=='swift'){
								this.invalidText="Only /-?:().,'+ are allowed";
							}
							else if(this.validationType=='swift-res-quote'){
								this.invalidText="Only /-?:().,+ are allowed";
							}
							else if(this.validationType=='decimal' && this.allowSPaces==true){
								this.invalidText=CRB.getFWBundle()['INVALID_TEXT_SPACES'];
							}
							else if(this.validationType=='decimal'){
								this.invalidText=CRB.getFWBundle()['INVALID_TEXT'];
							}
							////UAT_8296- STARTS
							else if(this.validationType=='email'){
								this.invalidText="This field should be an e-mail address in the format \"user@example.com\"";
								this.markInvalid(this.invalidText);
							}
							////UAT_8296 - ENDS
				 			this.vtypeText=this.invalidText;
				 			return false;
			 		}
			//CBXQ313F53_UPD - Ends
			 	else
			 		return true;
				 },
			// CBX_FW_Q112F_092 Starts
			customValidator:function(e){
				var keyCode=e.getKey();
				var isCompleteValue = true;////UAT_8296
				/***
				 * Ensuring that the object v is passed on any condition as it has been
				 * handled in such a way in the method validator() with the change log CBX_TXT_VALDN_01.
				 */
				var v=this.getValue();//CBX_TXT_VALDN_01
				if(this.validationType=='alphaNumericToUpper'){
					if(keyCode>=65 && keyCode<=90)
					this.setValue(this.getValue().toUpperCase());
				}			
		/*		if(keyCode=='86' || keyCode == '8' || keyCode == '46' || keyCode == '17'){//FW_FIX10MAR2013
					if(!Ext.isEmpty(this.getValue()))
						var v=this.getValue();	
						//UAT_6405 STARTS
						//COMMENTED
						//UAT_6405 ENDS				
				}*/
				return this.validator(v,isCompleteValue);//UAT_6405 STARTS//UAT_8296	
				/*return this.validator=function(v) {
					*//**
					 * If there is no regular expression configured
					 *//*
					if(mask==null){
						return true;
					}
					*//**
					 * If the value inside the field is null
					 *//*
					else if(v==""){
				 		return true;
				 	}
					*//**
					 * If the value is not matching with the regular expression
					 * or if the number of matching characters is less than the
					 * field value length
					 *//*
					else if(v.match(mask)==null || v.match(mask).length<v.length){	 
					 			this.vtypeText=this.invalidText;
					 			return false;
				 		}
				 	else
				 		return true;
					 }*/
			},

			// CBX_FW_Q112F_092 Ends
			// CBX_FW_Q112F_092_UPD Ends
			isVisible : function() {
				//CHG_TRADE_END Starts
				return cbx.formElement.cbxTextField.superclass.isVisible.apply(
						this, arguments);
				//CHG_TRADE_END Ends
			},
			getPrintData : function() {
				var label = this.plainLabel;
				var fieldValue = this.getValue();
				var printMap = {};
				printMap[label] = fieldValue;
			},
			/**
			 * Method updates the modal with fieldname and current value
			 */
			syncModelData : function() {
				//CHG_MULTIFORM Starts
								if(!Ext.isEmpty(this.multiInd) && this.multiInd==true && !Ext.isEmpty(this.index)){				
									if (this.manager.handlerEvent('cbxvalidate', this.name,this
							.getValue(),this.index,this.multiFormId) === false) {
					return;
					}
				}
				else if (this.manager.handlerEvent('cbxvalidate', this.name, this
						.getValue()) === false) {
				return;
				}
				if(!Ext.isEmpty(this.multiInd) && this.multiInd==true && !Ext.isEmpty(this.index) ){
					this.model.updateValue(this.name,this.getValue(),undefined,this.index,this.multiFormId);
				// CBXR12Q413F07 starts
				/*
				 * Textfield updateValue will be called upon actual value change
				 * only
				 */
				}else if(this.model.getValue(this.name) !== this.getValue()){
					this.model.updateValue(this.name, this.getValue());	
				}	
				//CHG_MULTIFORM  Ends
				this.updateScreenViewData(this);  //CBXFW_DIT_77 
				
			}
			//CBXFW_DIT_77 starts
			, getScreenViewData:function()
			{
				return this.getValue();
			},
			addClass : function(cls){
				if(this.el){
					this.el.addClass(cls);
					this.cls = this.cls ? this.cls + ' ' + cls : cls;
				}else{
					this.cls = this.cls ? this.cls + ' ' + cls : cls;
				}
				return this;
			},
			removeClass : function(cls){
				if(this.el){
					this.el.removeClass(cls);
				}else if(this.cls){
					this.cls = this.cls.split(' ').remove(cls).join(' ');
				}
				return this;
			}
			//CBXFW_DIT_77 ends

		});

Ext.reg('cbx-textfield', cbx.formElement.cbxTextField);
	
/**
 * This is an extension of cbx.formElement.cbxPasswordField class
 */
cbx.formElement.cbxPasswordField = function(config) {
	this.plainLabel = config.plainLbl;
	this.fieldLabel = config.displayNmKey;
	this.lookup = config.lookup;
	this.lookupCmp = config.lookupCmp;
	this.name = config.itemId;
	this.value = config.model.getModelData()[config.itemId];
	this.required = config.requiredInd;
	this.conditional = config.conditionalInd;
	this.readOnly = config.readOnlyInd === 'Y' ? true : false;
	this.hidden = config.visibleInd === 'Y' ? false : true;
	this.validationType = config.vType;
	cbx.formElement.cbxPasswordField.superclass.constructor.call(this, config);
};
Ext.extend(cbx.formElement.cbxPasswordField,cbx.formElement.cbxTextField,
		{
	inputType:'password',
	//enableKeyEvents: true,
		initComponent : function() {
			cbx.formElement.cbxPasswordField.superclass.initComponent.apply(
					this, arguments);
		}/*,
		afterRender:function()
		{
			this.getEl().on('keydown',this.keydown,this);
			this.getEl().on('drop',this.keydown,this);
			this.getEl().on('dragstart',this.keydown,this);
		}
		,keydown:function(e)
		{
			var keyCode=e.getKey() || e.keyCode || e.charCode;
			//for prevent copy and paste functionality
			if((e.ctrlKey && keyCode==86) || (e.ctrlKey && keyCode==67) || e.ctrlKey)
			{
			e.stopEvent();
			e.preventDefault(); // for chrome
			return false; // for IE
			}
			//for prevent drag and drop functionality
			if(e.type=="drop" || e.type=="dragstart")
			{
				if(e.stopPropagation) 
				{
				e.stopPropagation();
				e.preventDefault(); // for chrome
				}
				e.returnValue=false; // for IE
				e.stopEvent();
				return false;
			}
		}*/
		});
Ext.reg('cbx-passwordfield', cbx.formElement.cbxPasswordField);


/**
 * Searches through records and returns the index of the first match.
 * @param {String} field A field in the records being searched
 * @param {String/RegExp} value The string to compare to the field's value
 * @param {Number} startIndex Index to begin searching at (defaults to 0). (optional)
 * @param {Object} config (optional)
 */
Ext.data.SimpleStore.prototype.searchByString = function(field, value, startIndex) {
	var record = false, compare, rc = this.getCount(), range;
	startIndex = startIndex || 0;
	startIndex = startIndex >= rc ? 0 : startIndex;

	if(!(value instanceof RegExp)) { // not a regex
		value = String(value);
		if(value.length == 0){
			return false;
		}
		value = new RegExp("^" + Ext.escapeRe(value), "i");
	}
	if(rc > 0) {
		range = this.getRange(startIndex);
		Ext.each(range, function(r) {
			if( value.test(r.data[field]) ) {
				record = r;
				return false;
			}
		});
		if( !record && startIndex > 0 ) {
			// if a startIndex was provided and we have no match, restart the search from the beginning
			return this.searchByString(field, value, 0);
		}
	}
	return record;
};

/**
 * Makes a ComboBox more closely mimic an HTML SELECT.  Supports clicking and dragging
 * through the list, with item selection occurring when the mouse button is released.
 * When used will automatically set {@link #editable} to false and call {@link Ext.Element#unselectable}
 * on inner elements.  Re-enabling editable after calling this will NOT work.
 */
Ext.form.SelectBox = function(config){
	this.searchResetDelay = 1000;
	config = config || {};
	config = Ext.apply(config || {}, {
		editable: false,
		forceSelection: true,
		rowHeight: false,
		lastSearchTerm: ""
	});
	
	Ext.form.SelectBox.superclass.constructor.apply(this, arguments);
	
	this.lastSelectedIndex = this.selectedIndex || 0;
};

Ext.extend(Ext.form.SelectBox, Ext.form.ComboBox, {

	initEvents : function(){
		Ext.form.SelectBox.superclass.initEvents.apply(this, arguments);
		this.el.on('keydown', this.keySearch, this, true);
		this.cshTask = new Ext.util.DelayedTask(this.clearSearchHistory, this);
	},

	keySearch : function(e, target, options) {
		var raw = e.getKey();
		var key = String.fromCharCode(raw);
		var startIndex = 0;

		if( !this.store.getCount() ) {
			return;
		}

		switch(raw) {
			case Ext.EventObject.HOME:
				e.stopEvent();
				this.selectFirst();
				return;

			case Ext.EventObject.END:
				e.stopEvent();
				this.selectLast();
				return;

			case Ext.EventObject.PAGEDOWN:
				this.selectNextPage();
				e.stopEvent();
				return;

			case Ext.EventObject.PAGEUP:
				this.selectPrevPage();
				e.stopEvent();
				return;
		}

		// skip special keys other than the shift key
		if( (e.hasModifier() && !e.shiftKey) || e.isNavKeyPress() || e.isSpecialKey() ) {
			return;
		}
		/*if( this.lastSearchTerm == key ) {
			startIndex = this.lastSelectedIndex;
		}
*/		
		this.search(this.displayField, this.lastSearchTerm+key, startIndex);
		this.cshTask.delay(this.searchResetDelay);
	},

	onRender : function(ct, position) {
		this.store.on('load', this.calcRowsPerPage, this);
		Ext.form.SelectBox.superclass.onRender.apply(this, arguments);
		if( this.mode == 'local' ) {
			this.calcRowsPerPage();
		}
	},

	onSelect : function(record, index, skipCollapse){
		if(this.fireEvent('beforeselect', this, record, index) !== false){
			this.setValue(record.data[this.valueField || this.displayField]);
			if( !skipCollapse ) {
				this.collapse();
			}
			this.lastSelectedIndex = index + 1;
			this.fireEvent('select', this, record, index);
		}
	},
	
	render : function(ct) {
		Ext.form.SelectBox.superclass.render.apply(this, arguments);
		if( Ext.isSafari ) {
			this.el.swallowEvent('mousedown', true);
		}
		if(Ext.isEmpty(this.innerList)){
			return;
		}
		this.el.unselectable();
		this.innerList.unselectable();
		this.trigger.unselectable();
		this.innerList.on('mouseup', function(e, target, options) {
			if( target.id && target.id == this.innerList.id ) {
				return;
			}
			this.onViewClick();
		}, this);

		this.innerList.on('mouseover', function(e, target, options) {
			if( target.id && target.id == this.innerList.id ) {
				return;
			}
			this.lastSelectedIndex = this.view.getSelectedIndexes()[0] + 1;
			this.cshTask.delay(this.searchResetDelay);
		}, this);

		this.trigger.un('click', this.onTriggerClick, this);
		this.trigger.on('mousedown', function(e, target, options) {
			e.preventDefault();
			this.onTriggerClick();
		}, this);

		this.on('collapse', function(e, target, options) {
			Ext.get(document).un('mouseup', this.collapseIf, this);
		}, this, true);

		this.on('expand', function(e, target, options) {
			Ext.get(document).on('mouseup', this.collapseIf, this);
		}, this, true);
	},

	clearSearchHistory : function() {
		this.lastSelectedIndex = 0;
		this.lastSearchTerm = "";
	},

	selectFirst : function() {
		this.focusAndSelect(this.store.data.first());
	},

	selectLast : function() {
		this.focusAndSelect(this.store.data.last());
	},

	selectPrevPage : function() {
		if( !this.rowHeight ) {
			return;
		}
		var index = Math.max(this.selectedIndex-this.rowsPerPage, 0);
		this.focusAndSelect(this.store.getAt(index));
	},

	selectNextPage : function() {
		if( !this.rowHeight ) {
			return;
		}
		var index = Math.min(this.selectedIndex+this.rowsPerPage, this.store.getCount() - 1);
		this.focusAndSelect(this.store.getAt(index));
	},

	search : function(field, value, startIndex) {
		field = field || this.displayField;
		this.lastSearchTerm = value;
		var record = this.store.searchByString.apply(this.store, arguments);
		if( record !== false ) {
			this.focusAndSelect(record);
		}
	},

	focusAndSelect : function(record) {
		var index = this.store.indexOf(record);
		this.select(index, this.isExpanded());
		this.onSelect(record, index, this.isExpanded());
	},

	calcRowsPerPage : function() {
		if( this.store.getCount() ) {
			this.rowHeight = Ext.fly(this.view.getNode(0)).getHeight();
			this.rowsPerPage = this.maxHeight / this.rowHeight;
		} else {
			this.rowHeight = false;
		}
	}

});
//CBXR12Q114F02 Ends
/**
 * This is an extension of Ext.form.ComboBox class
 */
cbx.formElement.ComboBox = function(config) {
	this.plainLabel = config.plainLbl;
	this.fieldLabel = config.displayNmKey;
	this.name = config.itemId;
	this.addData = config.addData;
	/**
	 * Gagan: If the combo has not received its additional supporting data, then
	 * setting the combo's value will mark it invalid. So the value will be
	 * sotre in temValue property and will be used when the additional data is
	 * available and populated inside the combo. For now this implementation is
	 * done under updateComboRawStore() & updateComboRawStoreNoSelect(). In case
	 * there are methods that can be used for loading the additional data for
	 * the combo, same implementaion should be written under those methods
	 * as well.
	 */
	//CHG_MULTIFORM Starts
	if (this.addData != null) {
		if(!Ext.isEmpty(config.multiFormId) && !Ext.isEmpty(config.index)){
			this.value = config.model.getModelData()[config.multiFormId][config.itemId][config.index];
		}else{
			this.value = config.model.getModelData()[config.itemId];	
		}
		
	} else {
		if(!Ext.isEmpty(config.multiFormId) && !Ext.isEmpty(config.index)){
			this.value = config.model.getModelData()[config.multiFormId][config.itemId][config.index];
		}else{
			this.tempValue = config.model.getModelData()[config.itemId];
		}
	}
	//CHG_MULTIFORM Ends
	this.required = config.requiredInd;
	this.conditional = config.conditionalInd;
	this.readOnly = config.readOnlyInd === 'Y' ? true : false;
	this.hidden = config.visibleInd === 'Y' ? false : true;
	this.includeSelect = config.includeSelectInd === 'Y' ? true : false;
	this.includeSelectOnSingleValue=this.includeSelect;// CHG_SELECT_FW
	cbx.formElement.ComboBox.superclass.constructor.call(this, config);
};
Ext
		.extend(
				cbx.formElement.ComboBox,
				//Ext.form.ComboBox, //CBXR12Q114F02
				Ext.form.SelectBox,//CBXR12Q114F02
				{
					/**
					 * @cfg {Boolean} required ,to specify whether this field is
					 *      mandatory (defaults to N)
					 */
					required : 'N',
					/**
					 * @cfg {Boolean} required ,to specify whether this field is
					 *      conditional (defaults to N)
					 */
					conditional : 'N',
					/**
					 * @cfg {Object} bundleKey ,key used by resource to lookup
					 *      bundle(defaults to '')
					 */
					combundleKey : '',
					/**
					 * @cfg {Boolean} includeSelect ,to specify whether
					 *      combobox's first option is select or not (defaults
					 *      to true)
					 */
					includeSelect : true,
					/**
					 * @cfg {String} defaultValue ,initially Selected value for
					 *      this combo(defaults to '')
					 */
					defaultValue : '',
					/**
					 * @cfg {String} rawKeys ,raw keys to be set in the combo in
					 *      the absence of bundle(defaults to null)
					 */
					rawKeys : [],
					/**
					 * @cfg {String} rawValues ,raw values to be set in the
					 *      combo in the absence of bundle(defaults to null)
					 */
					rawValues : [],
					plainLabel : '',
					fieldLabel : '',
					toolTipLabel:'',//CBX_FW_Q112F_082
					resizable:true, // CHG_FF_ENH
					fireEventOnSingleSelect : true,
					/**
					 * @cfg {String} replaceEntityReference ,true to make
					 *      replace entity references in combo displayfield
					 */
					replaceEntityReference : false,
					cls : 'x-form-combo',
					// CBXR12Q113F12 starts
					// Below tpl config option provides custom template for combobox list items to display its value when mouse hovered.
					tpl : '<tpl for="."><div ext:qtip="{value}" class="x-combo-list-item">{value}</div></tpl>',
					// CBXR12Q113F12 ends
					/* ANZ formElement cleanup by Selva@23Dec2010 */
					// width : 142, //CHG_FF_ENH
					/* Ends added by Selva@23Dec2010 */
					// private
					initComponent : function() {
						this.triggerField = true;
						this.cls = this.cls+' '+this.itemId;
						this.on('hide',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'N']));
						this.on('show',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'Y']));
						//CBXFW_DIT_77 ends
						cbx.formElement.ComboBox.superclass.initComponent
								.apply(this, arguments);
						var combundle;
						var commonbundle = CRB.getFWBundle();
						// To get the bundle key reference
						combundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));
						this.combundleKey=cbx.jsutil.getBundleKey(this);
						/**
						 * If the plainLabel attribute is not null ,component's
						 * field label will be the plain-label else the label
						 * associated with bundle keys will be referred to get
						 * the field label.
						 */
						if (!Ext.isEmpty(this.plainLabel)) {
							this.fieldLabel = this.plainLabel;
						} else {
							this.fieldLabel = combundle['LBL_'
									+ this.fieldLabel];
						}
					this.toolTipLabel=this.fieldLabel || '';// CBX_FW_Q112F_082
						// This is to make sure that when data is posted combo's
						// value should go to server.
						// For the purpose we can utilise the hiddenName
						// attribute of the combobox
						var idTemp = this.id;
						this.hiddenName = idTemp;
						this.id = '$$_' + idTemp;
						var that = this;
						this.anchor = (this.anchor === undefined) ? ''
								: this.anchor;
						this.editable = false;
						this.labelSeparator = '';
						this.triggerAction = 'all';
						this.mode = 'local';
						this.selectOnFocus = (this.selectOnFocus === undefined) ? true
								: this.selectOnFocus;
						var bundleCombo = combundle;
						this.rawKeys = this.populateAddData(this.addData,
								'rawKey');
						this.rawValues = this.populateAddData(this.addData,
								'rawValue');
						if (this.store === undefined) {
							if (this.data !== undefined
									&& this.resourcePrefix !== undefined
									&& bundleCombo !== null) {
								var prefix = this.resourcePrefix;
								// create a copy of the key array.copy function
								// is available in jsPrototypes.js
								// copy function is used, as in js , variables
								// are just references to objects and we
								// need a clone not a reference.
								var keyArray = this.data.copy();
								// walking through the array and creating
								// another array based on the invoking array.
								// In this case we are creating corresponding
								// value array from the key array
								// walk function is available in jsPrototypes.js
								// .
								var valueArray = keyArray.walk(function(elt) {
									return bundleCombo[prefix + elt];
								});
								var dataArray = [];
								var rowArray;
								// If includeSelect config option has not been
								// set off first element to be inserted
								// into our dataArray is Select
								if (this.includeSelect && this.data.length != 1) {
									rowArray = [];
									// Make sure the value field for Select
									// option is nothing but a space
									// to avoid confusion at server validations.
									rowArray.push(''); //CHG_TRADE_POC
									rowArray.push(bundleCombo['LBL_SELECT']);
									dataArray.push(rowArray);
								}
								for ( var i = 0; i < keyArray.length; i++) {
									rowArray = [];
									// ExtJs combo store accepts 2D array . In
									// this case we have to create it from the
									// key array
									// and value array
									// rowArray.push(this.resourcePrefix +
									// keyArray[i]);
									rowArray.push(keyArray[i]);
									rowArray.push(valueArray[i]);
									dataArray.push(rowArray);
								}
								this.store = new Ext.data.SimpleStore({
									proxy : new Ext.data.HttpProxy({}),
									fields : [ 'key', 'value' ],
									data : dataArray
								});
								this.displayField = 'value';
								this.valueField = 'key';
								if (this.includeSelect && this.data.length > 1) {
									this.setValue(''); //CHG_TRADE_POC
								}
								if (this.value != '' && this.value != null) {
								}
								if (this.data.length == 1) {
									this.value = keyArray[0];
									if (this.fireEventOnSingleSelect) {
									// CHG002_68797 starts
										//this.fireEvent('select', this);
										this.syncModelData();
									//CHG002_68797 ends	
									}
								}
								if (this.includeSelect && this.data.length != 1) {
									this.setSelect();
								}
							} else if (this.rawKeys !== null
									&& this.rawValues !== null
									&& bundleCombo !== null) {
								var rowArray = [];
								var dataArray = [];
								// If includeSelect config option has not been
								// set off first element to be inserted
								// into our dataArray is Select
								// CHG_FF_ENH Starts
								if (this.includeSelect) {
								// CHG_FF_ENH Ends
									// Make sure the value field for Select
									// option is nothing but a space
									// to avoid confusion at server validations.
									rowArray.push(''); //CHG_TRADE_POC
									rowArray.push(bundleCombo['LBL_SELECT']);
									dataArray.push(rowArray);
								}
								// rawKeyLength=this.rawKeys.split(',');
								for ( var i = 0; i < this.rawKeys.length; i++) {
									rowArray = [];
									// 
									rowArray.push(this.rawKeys[i]);
									rowArray.push(this.rawValues[i]);
									dataArray.push(rowArray);
								}
								this.store = new Ext.data.SimpleStore({
									proxy : new Ext.data.HttpProxy({}),
									fields : [ 'key', 'value' ],
									data : dataArray
								});
								this.displayField = 'value';
								this.valueField = 'key';
								if (this.includeSelect
										&& this.rawKeys.length != 1) {
									/*
									 * if (this.value == '' || this.value ==
									 * null) { this.setValue(' '); }
									 */
								}
								//CHG_TRADE_ENH Starts
								if (!this.includeSelect && this.rawKeys.length == 1) {
									this.value = this.rawKeys[0];
									this.syncModelData();
									if (this.fireEventOnSingleSelect) {
									// CHG002_68797 starts
										//this.fireEvent('select', this);
										this.syncModelData();
									// CHG002_68797 ends
									}
									this.syncModelData(); // UAT_982
								}
								// if(this.defaultValue !== '') {
								/*
								 * if (this.value != '' && this.value != null) {
								 * this.setValue(this.value); }
								 */
							}
						}
						if (combundle !== null) {
							/**
							 * If the conditional attribute is Y the components
							 * field label will be field label associated with
							 * two stars
							 */
							if (this.conditional == 'Y') {
								this.blankText = String.format(
										commonbundle['ERR_MANDATORY_SELECT'],
										this.fieldLabel);
								try {
									// if(combundle[this.fieldLabel]==undefined)
									if (Ext.isEmpty(this.fieldLabel)) {
										this.fieldLabel = '?'
												+ this.fieldLabel
												+ '?'
												+ '<span class = \'cbx-mandatory-fx\'">**</span>';// CHG001-CSS
																									// changes
									} else {
										this.fieldLabel = this.fieldLabel
												+ '<span class = \'cbx-mandatory-fx\'">**</span>';// CHG001-CSS
																									// changes
									}
								} catch (e) {
									this.fieldLabel = '?'
											+ this.fieldLabel
											+ '?'
											+ '<span class = \'cbx-mandatory-fx\'">**</span>';// CHG001-CSS
																								// changes
								}
							}
							/**
							 * If the required attribute is Y,components field
							 * label will be field label associated with
							 * mandatory star and the field will not allow blank
							 * values.
							 */
							else if (this.required === 'Y') {
								this.blankText = String.format(
										commonbundle['ERR_MANDATORY_SELECT'],
										this.fieldLabel);
								if (this.value == '' || this.value == null
										|| this.value == ' ') {
									this.allowBlank = false;
								}
								if (Ext.isEmpty(this.fieldLabel)) {
									this.fieldLabel = '?'
											+ this.fieldLabel
											+ '?'
											+ '<span class = \'mandatory\'">*</span>';
								} else {
									this.fieldLabel = this.fieldLabel
											+ '<span class = \'mandatory\'">*</span>';
								}
								/* end added by Selva@23Dec2010 */
							} else {
								try {
									this.fieldLabel = '<span class = \'non_mandatory\'"></span>'
											+ this.fieldLabel;
								} catch (e) {
									this.fieldLabel = '<span class = \'non_mandatory\'"></span>'
											+ '?' + this.fieldLabel + '?';
								}
							}
						} else {
							this.fieldLabel = '?' + this.fieldLabel + '?';
						}
						this.on('blur', function(obj) {
							this.mandatoryValidator(obj.value);
							/*
							 * if(this.validator && (typeof obj.validator()) ==
							 * 'string'){ this.markInvalid(obj.validator());
							 * return false; }else{ this.clearInvalid(); return
							 * true; }
							 */
						});
						this.on('select', function(obj) {
							this.mandatoryValidator(obj.value);
							this.syncModelData(); // CHG_FF_ENH
						});
						this.on('change', this.syncModelData);
						//CBXQ2FW160 Starts
						/*
						 * Custom function is added on expand listener to calculate the combo list width based upon the maximum list
						 * item size
						 */
						this.on('expand', this.expandList); 
						//CBXQ2FW160 Ends

					},
					//CBXQ2FW160 Starts
					/**
					 * This custom fuction is invoked on expand listener of drop down list to depict the  maximum list item size and 
					 * this will be calulated after the component rendering and also on updating the combo store(Specifically for updateComboRawStore)
					 * method.
					 */
					expandList: function() {
						try{
						var combo=this;
						if(combo.calculated){ 
							return;
						}

						var store = combo.getStore();
				        if (!Ext.isEmpty(store)) { 
				            var field = combo.displayField;
				            var text_metrics;
				            var maxTextWidth = 0;
				            
				            var keyArray = [];
							var valueArray = [];
							var widthArr=[];
							if (combo.store.getCount() > 0) {
								combo.store.each(function(rec) {
									keyArray.push(rec.data.key);
									valueArray.push(rec.data.value);
								});
								
								/*if (this.el) {
									text_metrics = Ext.util.TextMetrics
											.createInstance(this.el); 
								} else {
									text_metrics = Ext.util.TextMetrics
											.createInstance(Ext.getBody());
								} */
							
							
								for ( var i = 0; i < keyArray.length; i++) 
								{
									widthArr[i] = Math.floor(iportal.preferences.getAverageFontWidth()* valueArray[i].length);
								}
								
								Ext.each(widthArr, function(item) {
									if (parseInt(item) > maxTextWidth) {
										maxTextWidth = parseInt(item);
									}
								}, this);
							
							}				 
							 var newWidth = Math.max(Math.max(combo.wrap.getWidth(), combo.minListWidth), maxTextWidth + 30);
							 
						       if (newWidth != combo.listWidth) {
						            combo.listWidth = newWidth;
						            combo.list.setSize(combo.listWidth, 0);
						            combo.innerList.setWidth(combo.listWidth - combo.list.getFrameWidth('lr'));
						        }
						       combo.calculated = true;
				        }
						}catch(e){
							LOGGER.error("While expandList::: "+e);
						}
				       
				 
				       
						
		            
		        },
		      //CBXQ2FW160 Ends
					
					syncModelData : function() {
						// CBX_FW_Q112F_020 Start
						//CHG_MULTIFORM Starts
						if(!Ext.isEmpty(this.multiInd) && this.multiInd==true && !Ext.isEmpty(this.index)){
							this.model.updateValue(this.name,this.getValue(),undefined,this.index,this.multiFormId);
						}else if(this.model.getValue(this.name)!==this.getValue()){
							this.model.updateValue(this.name, this.getValue());	
						}
						//CHG_MULTIFORM Ends
					    // CBX_FW_Q112F_020 End
						this.updateScreenViewData(this);//CBXFW_DIT_77
					},
					onRender : function(ct, position) {
						cbx.formElement.ComboBox.superclass.onRender.call(this,
								ct, position);
					},
					/**
					 * Method expected to receive the data from additionaldata
					 * attribute and parses the data according to
					 * rawtype(rawkeys and rawValues) and pushes the rawdata to
					 * be obtained on store
					 */
					populateAddData : function(items, rawType) {
						var rawDataArray = [];
						if (items != "" && items != null) {
							for ( var i = 0; i < items.length; i++) {
								rawDataArray.push(items[i][rawType]);
							}
						}
						return rawDataArray;
					},
					// private
					initEvents : function() {
						cbx.formElement.ComboBox.superclass.initEvents
								.call(this);
						this.on('select', this.changeSelect, this);
					},
					changeSelect : function(record, index) {
						var v = this.getValue();
						if (String(v) !== String(this.startValue)) {
							this.fireEvent('change', this, v, this.startValue);
						}
						this.startValue = v;
					},
					/**
					 * function listening to blur event to see whether user had
					 * select a valid option incase of mandatory fields
					 * 
					 * @param {var}
					 *            v ,selected value of combo
					 */
					mandatoryValidator : function(v) {
						combundle = CRB.getFWBundle();
						if (combundle !== null) {

							if ((v == ' ' && this.required === 'Y')
									|| (v == ' ' && this.conditional === 'Y')) {
								// if((v == '') && (this.required ||
								// this.conditional)){
								this.markInvalid(this.blankText);
							}/*
								 * else{ this.clearInvalid(); }
								 */
						} else {
							// if(v == ' ' && this.required){
							if ((v == ' ' && this.required === 'Y')
									|| (v == ' ' && this.conditional === 'Y')) {

								this.markInvalid('? ERR_MANDATORY ?');
							}
						}
					},
					/**
					 * function to validate a combobox
					 */
					validateCombo : function() {
						combundle = CRB.getFWBundle();
						if (this.isSelectSelected() && this.required === 'Y') {
							// Showing the quick tip error indicator if the
							// field is null on mandatory
							this.markInvalid(this.blankText);
						}
					},
					/**
					 * validate method of a field is depend on validateValue
					 * method which is to overridden by the subclasses function
					 * to validate a combobox
					 */
					validateValue : function() {
						var combundle = CRB.getFWBundle();// CBX_FW_Q112F_082
						if(!Ext.isEmpty(this.value)){
						if (!this.isKeyValueMatch() && this.required === 'Y') {
                        // CBXR12Q113F04 ends
							// CBX_FW_Q112F_082 starts
							// this.markInvalid(CRB.getBundle(CRB.COMMON) &&
							// CRB.getBundle(CRB.COMMON)['ERR_VALID_SELECT'] ?
							// CRB.getBundle(CRB.COMMON)['ERR_VALID_SELECT']:'ERR_VALID_SELECT');//CHG_FF_ENH
							this.markInvalid(combundle && combundle['ERR_MANDATORY_SELECT'] ? 
									(String.format(combundle['ERR_MANDATORY_SELECT'],this.toolTipLabel)):'ERR_MANDATORY_SELECT');
							// CBX_FW_Q112F_082 ends
							return false;
						}
						}
						if (this.isSelectSelected() && this.required === 'Y') {
							this.markInvalid(this.blankText);
							return false;
						}
						if (this.isNotSelectSelected() && this.required === 'Y') {
							this.markInvalid(this.blankText);
							return false;
						}
						return true;
					},
					/**
					 * This method will select the Select option from the list.
					 * If select is already there. It will use that, otherwise
					 * it will create a select option and use it.
					 */
					forceSelect : function() {
						var combundle = CRB.getBundle(this.combundleKey);
						var previousSelect = this.store.find('key', ' ');
						if (previousSelect != -1) {
							this.setSelect();
							return;
						}
						var newRecord = Ext.data.Record.create([ {
							name : 'key',
							mapping : 'key'
						}, {
							name : 'value',
							mapping : 'value'
						} ]);
						var record = new newRecord({
							key : '', //CHG_TRADE_POC
							value : combundle['LBL_SELECT']
						});
						this.store.insert(0, [ record ]);
						this.store.commitChanges();
						this.includeSelect = true;
						this.setSelect();
					},
					/**
					 * function to set Select option as the value
					 */
					setSelect : function() {
						if (this.includeSelect) {
							this.setValue('');	//CHG_TRADE_POC
						} else {
							this.setValue('');
						}
						this.validateCombo();
					},

					/**
					 * function to check Select option has been selected
					 */
					isSelectSelected : function() {
						
						var returnFlag = (this.getValue() == ' ' || this
								.getValue() == 'Select') ? true : false;
						return returnFlag;
					},

					isNotSelectSelected : function() {
						
						var returnFlag = (this.getValue() == '' || this
								.getValue() == null) ? true : false;
						return returnFlag;
					},
					isKeyValueMatch : function() {
						// alert(this.getKeyValueMatch())
						var returnFlagValue = (this.getKeyValueMatch() == true || this
								.getKeyValueMatch() == 'true') ? true : false;
						// alert(returnFlagValue)
						return returnFlagValue;
					},

					/**
					 * update the store of this combobox with new keys supplied.
					 * 
					 * @param {Array}
					 *            arr containing value keys
					 */
					updateComboStore : function(arr, prefix) {
						combundle = CRB.getBundle(this.combundleKey);
						if (typeof arr != 'object')
							return false;
						this.store.removeAll();
						if (arr.length == 0) {
							this.store.commitChanges();
							// empties your store and return.
							return;
						}
						// create method returns an object which can act as a
						// constructor for every records having
						// the defined column model. This method should be used
						// instead of using Record constructor
						// directly. See extJs docs for further details
						var newRecord = Ext.data.Record.create([ {
							name : 'key',
							mapping : 'key'
						}, {
							name : 'value',
							mapping : 'value'
						} ]);
						var record;
						if (this.includeSelect
								&& (arr.length > 1 || this.includeSelectOnSingleValue)) {
							record = new newRecord({
								key : '',	//CHG_TRADE_POC
								value : combundle['LBL_SELECT']
							});
							this.store.add(record);
						}
						var widthArr = [];
						var that = this;
						var text_metrics;
						/*if (that.el) {
							text_metrics = Ext.util.TextMetrics
									.createInstance(that.el);
						} else {
							text_metrics = Ext.util.TextMetrics
									.createInstance(Ext.getBody());
						}*/
						for ( var i = 0; i < arr.length; i++) {
							//widthArr[i] = text_metrics
								//	.getWidth(combundle[prefix + arr[i]]);
							widthArr[i]=Math.floor(iportal.preferences.getAverageFontWidth() * combundle[prefix + arr[i]].length);
							record = new newRecord({
								key : arr[i],
								value : combundle[prefix + arr[i]]
							});
							this.store.add(record);
						}
						var maxWidth = 0;
						Ext.each(widthArr, function(item) {
							if (parseInt(item) > maxWidth) {
								maxWidth = parseInt(item);
							}
						}, this);
						var standardWidth = (this.getWidth()) ? this.getWidth()
								: 170;
						if (standardWidth < maxWidth) {
							this.listWidth = maxWidth + 19;
							that.listWidth = (that.listWidth > 220) ? 220
									: that.listWidth;
						}
						if (this.includeSelect
								&& (arr.length > 1 || this.includeSelectOnSingleValue)) {
							this.setSelect();
						}
						if (arr.length == 1) {
							this.setValue(arr[0]);
							if (this.fireEventOnSingleSelect) {
							// CHG002_68797 starts
								//this.fireEvent('select', this);
								this.syncModelData();
							// CHG002_68797 ends
							}
						}
						this.store.commitChanges();
						this.clearInvalid();
						return true;
					},
					removeComboRawStore : function() {
						combundle = CRB.getBundle(this.combundleKey);
						if (this.store === undefined) {
							this.store = new Ext.data.SimpleStore({
								proxy : new Ext.data.HttpProxy({}),
								fields : [ 'key', 'value' ]
							});
						}
						this.store.removeAll();
						var newRecord = Ext.data.Record.create([ {
							name : 'key',
							mapping : 'key'
						}, {
							name : 'value',
							mapping : 'value'
						} ]);
						if (this.includeSelect
								|| this.includeSelectOnSingleValue) {
							record = new newRecord({
								key : '',	//CHG_TRADE_POC
								value : combundle['LBL_SELECT']
							});
							this.store.add(record);
						}
						if (this.includeSelect
								|| this.includeSelectOnSingleValue) {
							this.setSelect();
						} else {
							this.setValue('');
						}
						this.store.commitChanges();
						this.clearInvalid();
					},
					/**
					 * update the store of this combobox with new keys and
					 * values supplied.
					 * 
					 * @param {Array}
					 *            arr containing value keys
					 */
					updateComboRawStore : function(keyArr, valueArr) {
						/**
						 * If the keyArr and valueArr empty ,invoke the
						 * removetheComboStore method to add the empty array
						 */
						if (Ext.isEmpty(keyArr) && Ext.isEmpty(valueArr)) {
							this.removeComboRawStore();
							return;
						}
						combundle = CRB.getBundle(this.combundleKey);
						if (keyArr.length !== valueArr.length) {
							// keys and values should be arrays of same length
							return;
						}
						if (this.store === undefined) {
							this.store = new Ext.data.SimpleStore({
								proxy : new Ext.data.HttpProxy({}),
								fields : [ 'key', 'value' ]
							});
						}
						this.store.removeAll();
						// create method returns an object which can act as a
						// constructor for every records having
						// the defined column model. This method should be used
						// instead of using Record constructor
						// directly. See extJs docs for further details
						var newRecord = Ext.data.Record.create([ {
							name : 'key',
							mapping : 'key'
						}, {
							name : 'value',
							mapping : 'value'
						} ]);
						var record;
						if (this.includeSelect
								&& (keyArr.length > 1 || this.includeSelectOnSingleValue)) {
							record = new newRecord({
								key : '',	//CHG_TRADE_POC
								value : combundle['LBL_SELECT'] || CRB.getFWBundle()['LBL_SELECT']
							});
							this.store.add(record);
						}
						var widthArr = [];
						var that = this;
						// CBXQ2FW160 Starts
						var text_metrics;
						//Code added to caclulate the list width based upon the maximum list item size
						this.calculated=false;
						//The below code is commented as the listwidth calculation is improper;
					
						/*if (that.el) {
							text_metrics = Ext.util.TextMetrics
									.createInstance(that.el);
						} else {
							text_metrics = Ext.util.TextMetrics
									.createInstance(Ext.getBody());
						}*/
						
						for ( var i = 0; i < keyArr.length; i++) {
							//widthArr[i] = text_metrics.getWidth(valueArr[i]);
							widthArr[i]=Math.floor(iportal.preferences.getAverageFontWidth() * valueArr[i].length);
							record = new newRecord({
								key : keyArr[i],
								value : valueArr[i]
							});
							this.store.add(record);
						}

						var maxWidth = 0;

						Ext.each(widthArr, function(item) {
							if (parseInt(item) > maxWidth) {
								maxWidth = parseInt(item);
							}
						}, this);
						var standardWidth = (that.getWidth()) ? that.getWidth()
								: 170;
						if (standardWidth < maxWidth) {
							that.listWidth = maxWidth + 19;
							that.listWidth = (that.listWidth > 220) ? 220
									: that.listWidth;
						}
						
						//CBXQ2FW160 Ends
						if (this.includeSelect
								&& (keyArr.length > 1 || this.includeSelectOnSingleValue)) {
							this.setSelect();
						}
						/*
						 * 
						 * Included the following condition just to make sure
						 * 
						 * that 'Select' gets selected by default in the Combo
						 * 
						 * when the length is 1
						 * 
						 */
						if (keyArr.length == 1) {
							if (this.includeSelectOnSingleValue) {
								this.setValue('');	//CHG_TRADE_POC
								/*
								 * 
								 * if(this.fireEventOnSingleSelect){
								 * 
								 * this.fireEvent('select',this); }
								 * 
								 */
							} else {
								this.setValue(keyArr[0]);
								if (this.fireEventOnSingleSelect) {
								// CHG002_68797 starts
									//this.fireEvent('select', this);
									this.syncModelData();
								// CHG002_68797 ends.	
								}
							}
						}
						this.clearInvalid();
						this.store.commitChanges();
						/**
						 * Gagan: In case the combo didnt have additional
						 * supporting data, Now is the right time for setting
						 * the value that was received at the combo's
						 * initialization time.
						 */
						if (this.tempValue != null) {
							this.setValue(this.tempValue);
							this.tempValue = null;
						}
						this.clearInvalid();
						try{
							if(!cbx.isEmpty(this.triggerCounterElem)){
								this.validateStore();
								this.triggerCounterElem.update(this.getValue().length)
								}
							}catch(err){}
						return true;
					},
					/*
					 * 
					 * Start PEG-Preferences To remove the Select in the combo
					 * 
					 * box by default
					 * 
					 */
					/**
					 * update the store of this combobox with new keys and
					 * values supplied.
					 * 
					 * @param {Array}
					 *            arr containing value keys
					 */
					updateComboRawStoreNoSelect : function(keyArr, valueArr) {
						// //alert(keyArr+'\n\n\n'+valueArr);
						combundle = CRB.getBundle(this.combundleKey);
						if (keyArr.length !== valueArr.length) {
							// keys and values should be arrays of same length
							return;
						}
						if (this.store === undefined) {
							this.store = new Ext.data.SimpleStore({
								proxy : new Ext.data.HttpProxy({}),
								fields : [ 'key', 'value' ]
							});
						}
						this.store.removeAll();
						// create method returns an object which can act as a
						// constructor for every records having
						// the defined column model. This method should be used
						// instead of using Record constructor
						// directly. See extJs docs for further details
						var newRecord = Ext.data.Record.create([ {
							name : 'key',
							mapping : 'key'
						}, {
							name : 'value',
							mapping : 'value'
						} ]);
						var record;
						/*
						 * 
						 * if(this.includeSelect && keyArr.length >1) { record =
						 * 
						 * new newRecord({ key: ' ', value:
						 * 
						 * combundle['LBL_SELECT'] }); this.store.add( record ); }
						 * 
						 */
						var widthArr = [];
						var that = this;
						
						/*if (that.el) {
							text_metrics = Ext.util.TextMetrics
									.createInstance(that.el);
						} else {
							text_metrics = Ext.util.TextMetrics
									.createInstance(Ext.getBody());
						}*/
						
						for ( var i = 0; i < keyArr.length; i++) {
							//widthArr[i] = text_metrics.getWidth(valueArr[i]);
							widthArr[i]=Math.floor(iportal.preferences.getAverageFontWidth() * valueArr[i].length);
							record = new newRecord({
								key : keyArr[i],
								value : valueArr[i]
							});
							this.store.add(record);
						}
						var maxWidth = 0;
						Ext.each(widthArr, function(item) {
							if (parseInt(item) > maxWidth) {
								maxWidth = parseInt(item);
							}
						}, this);
						var standardWidth = (that.getWidth()) ? that.getWidth()
								: 170;
						if (standardWidth < maxWidth) {
							that.listWidth = maxWidth + 19;
							that.listWidth = (that.listWidth > 220) ? 220
									: that.listWidth;
						}
						if (this.includeSelect
								&& (keyArr.length > 1 || this.includeSelectOnSingleValue)) {
							this.setSelect();
						}
						if (keyArr.length == 1) {
							if (this.includeSelectOnSingleValue) {
								this.setValue(''); //CHG_TRADE_POC
								/*
								 * if(this.fireEventOnSingleSelect){
								 * this.fireEvent('select',this); }
								 */
							} else {
								this.setValue(keyArr[0]);
								if (this.fireEventOnSingleSelect) {
								// CHG002_68797 starts
									//this.fireEvent('select', this);
									this.syncModelData();
								// CHG002_68797 ends.	
								}
							}
						}
						this.store.commitChanges();
						/**
						 * In case the combo didnt have additional supporting
						 * data, Now is the right time for setting the value
						 * that was received at the combo's initialization time.
						 */
						if (this.tempValue != null) {
							this.setValue(this.tempValue);
							this.tempValue = null;
						}
						this.clearInvalid();
						return true;
					},
					/**
					 * returns the width of this component &#46; This is
					 * different from listwidth of view,which will decide the
					 * width of the component in open state&#46;
					 * 
					 * @return {Num} this&#46;width &#46; The width of the
					 *         component.
					 */
					getWidth : function() {
						return this.width;
					},
					/**
					 * Returns the value field for selected option
					 */
					getValue : function() {
						if (this.store) {
						
							for ( var recIndex = 0; recIndex < this.store
									.getCount(); recIndex++) {
								
								if ((this.store.getAt(recIndex).data.key === this.value)
										|| (this.store.getAt(recIndex).data.value === this.value)) {
									
									return this.store.getAt(recIndex).data.key;
								}
							}
						}
						return this.value;
					},
					getKeyValueMatch : function() {
						if (this.store) {
							for ( var recIndex = 0; recIndex < this.store
									.getCount(); recIndex++) {
								if ((this.store.getAt(recIndex).data.key === this.value)
										|| (this.store.getAt(recIndex).data.value === this.value)) {
									return true;
								}
							}
						}
						return false;
					},
					isVisible : function() {
						return cbx.formElement.ComboBox.superclass.isVisible
								.apply(this, arguments);
					},
					afterRender : function() {
						this.updateScreenViewData(this);//CBXFW_DIT_77
						cbx.formElement.ComboBox.superclass.afterRender.apply(
								this, arguments);
						var that = this;
						this
								.on(
										'select',
										function(obj) {
											if (this.replaceEntityReference) {
												var storeCombo = obj.store;
												var storeComboCount = storeCombo
														.getCount();
												for ( var index = 0; index < storeComboCount; index++) {
													var rowobject;
													rowobject = storeCombo
															.getAt(index).data;
													if (rowobject.key === obj.value) {
														rowobject.value = rowobject.value
																+ "";
														rowobject.value = that
																.escapeEntites(rowobject.value);
														that
																.setValue(rowobject.key);
														rowobject.value = that
																.unescapeEntites(rowobject.value);
													}
												}
											}
											return true;
										});
						var widthArr = [];
						var keyArray = [];
						var valueArray = [];
						if (that.store.getCount() > 0) {
							that.store.each(function(rec) {
								keyArray.push(rec.data.key);
								valueArray.push(rec.data.value);
							});
							
							/*if (that.el) {
								text_metrics = Ext.util.TextMetrics
										.createInstance(that.el);
							} else {
								text_metrics = Ext.util.TextMetrics
										.createInstance(Ext.getBody());
							}*/
							
							for ( var i = 0; i < keyArray.length; i++) {
								//widthArr[i] = text_metrics
									//	.getWidth(valueArray[i]);
								widthArr[i]=Math.floor(iportal.preferences.getAverageFontWidth() * valueArray[i].length);
							}
							var maxWidth = 0;
							Ext.each(widthArr, function(item) {
								if (parseInt(item) > maxWidth) {
									maxWidth = parseInt(item);
								}
							}, this);
							if (170 < maxWidth) {
								that.listWidth = maxWidth + 19;
								that.listWidth = (that.listWidth > 220) ? 220
										: that.listWidth;
							}
						}
						if (this.includeSelect
								&& this.rawKeys.length != 1) {
							if(Ext.isEmpty(this.value)){
							this.setValue('');
							this.clearInvalid();
							}
						}
					},
					reset : function(){
						cbx.formElement.ComboBox.superclass.reset.call(this);
						if (this.includeSelect){
						this.setValue('');
						this.clearInvalid();
						}
						}, 
					escapeEntites : function(str) {
						return str.replace('&lt;', '<').replace('&gt;', '>')
								.replace('&quote;', '"').replace('&nbsp;', ' ');
					},
					unescapeEntites : function(str) {
						return str.replace('<', '&lt;').replace('>', '&gt;')
								.replace('"', '&quote;').replace(' ', '&nbsp;');
					},
					getDisplayValue : function(key) {
						var that = this;
						var storeCombo = that.store;
						var storeComboCount = storeCombo.getCount();
						var rowobject;
						for ( var index = 0; index < storeComboCount; index++) {
							rowobject = storeCombo.getAt(index).data;
							if (rowobject.key === key) {
								return rowobject.value;
							}
						}
						return key;
					},
					//CBXFW_DIT_77 starts
					getScreenViewData : function() {
						return this.getDisplayValue(this.getValue());
					},
					//CBXFW_DIT_77 ends
					getPrintData : function() {
						var label = this.fieldLabel;
						var fieldValue = this.getDisplayValue(this.getValue());
						var printMap = {};
						printMap[label] = fieldValue;
						return printMap;
					},
					/**
					 * update the store of this combobox with new keys and
					 * values supplied. Here wrapping of text inside combo box
					 * not done. If text wrapping need to be done use the method
					 * updateComboRawStore defned above
					 * 
					 * @param {Array}
					 *            arr containing value keys
					 */
					updateComboNoWrapRawStore : function(keyArr, valueArr) {
						var combundle = CRB.getBundle(this.combundleKey);
						if (keyArr.length !== valueArr.length) {
							// keys and values should be arrays of same length
							return;
						}
						if (this.store === undefined) {
							this.store = new Ext.data.SimpleStore({
								fields : [ 'key', 'value' ]
							});
						}
						this.store.removeAll();
						// create method returns an object which can act as a
						// constructor for every records having
						// the defined column model. This method should be used
						// instead of using Record constructor
						// directly. See extJs docs for further details
						var newRecord = Ext.data.Record.create([ {
							name : 'key',
							mapping : 'key'
						}, {
							name : 'value',
							mapping : 'value'
						} ]);
						var record;
						if (this.includeSelect
								&& (keyArr.length > 1 || this.includeSelectOnSingleValue)) {
							record = new newRecord({
								key : '',	//CHG_TRADE_POC
								value : combundle['LBL_SELECT'] || CRB.getFWBundle()['LBL_SELECT']
							});
							this.store.add(record);
						}
						var that = this;
						for ( var i = 0; i < keyArr.length; i++) {
							record = new newRecord({
								key : keyArr[i],
								value : valueArr[i]
							});
							this.store.add(record);
						}
						var maxWidth = 0;
						if (this.includeSelect
								&& (keyArr.length > 1 || this.includeSelectOnSingleValue)) {
							this.setSelect();
						}
						if (keyArr.length == 1) {
							if (this.includeSelectOnSingleValue) {
								this.setValue(''); //CHG_TRADE_POC
								/*
								 * if(this.fireEventOnSingleSelect){
								 * this.fireEvent('select',this); }
								 */
							} else {
								this.setValue(keyArr[0]);
								if (this.fireEventOnSingleSelect) {
								// CHG002_68797 starts
									//this.fireEvent('select', this);
									this.syncModelData();
								// CHG002_68797 ends.	
								}
							}
						}
						this.store.commitChanges();
						this.clearInvalid();
						return true;
					},
					onTriggerClick : function() {
						/*
						 * var tgt = Ext.EventObject.getTarget(); var
						 * triggerPattern = /<IMG/i;
						 * if(!triggerPattern.test(tgt.outerHTML)){ return; }
						 */
						cbx.formElement.ComboBox.superclass.onTriggerClick
								.apply(this, arguments);
					},
					/**
					 * Intended to get the count of store in a combo.
					 */
					getStoreCount:function(){
						var len=this.store.getCount();
						if(this.includeSelect){
						return len-1;
						}
						else{
						return len;
						}
						return 0;
					}
					
				});
Ext.reg('cbx-combobox', cbx.formElement.ComboBox);
// CHG_ICONCOMBO starts
cbx.formElement.IconComboBox = function(config) {
	this.plainLabel = config.plainLbl;
	this.fieldLabel = config.displayNmKey;
	this.name = config.itemId;
	this.addData = config.addData;
	this.parentId = config.parentId;
	this.cls = config.cls || '';
	/**
	 * Gagan: If the combo has not received its additional supporting data, then
	 * setting the combo's value will mark it invalid. So the value will be
	 * sotre in temValue property and will be used when the additional data is
	 * available and populated inside the combo. For now this implementation is
	 * done under updateComboRawStore() & updateComboRawStoreNoSelect(). In case
	 * there are methods that can be used for loading the additional data for
	 * the combo, same implementaion should be written under those methods
	 * aswell.
	 */
	if (this.addData != null) {
		if(!Ext.isEmpty(config.multiFormId) && !Ext.isEmpty(config.index)){
			this.value = config.model.getModelData()[config.multiFormId][config.itemId][config.index];
		}else{
			this.value = config.model.getModelData()[config.itemId];	
		}
	} else {
		if(!Ext.isEmpty(config.multiFormId) && !Ext.isEmpty(config.index)){
			this.value = config.model.getModelData()[config.multiFormId][config.itemId][config.index];
		}else{
			this.tempValue = config.model.getModelData()[config.itemId][config.itemId][config.index];	
		}
	}
//CHG_MULTIFORM Ends
	this.required = config.requiredInd;
	this.conditional = config.conditionalInd;
	this.readOnly = config.readOnlyInd === 'Y' ? true : false;
	this.hidden = config.visibleInd === 'Y' ? false : true;
	this.includeSelect = config.includeSelectInd === 'Y' ? true : false;
	cbx.formElement.IconComboBox.superclass.constructor.call(this, config);
};
Ext
.extend(
		cbx.formElement.IconComboBox,
		cbx.formElement.ComboBox,
		{
			/**
			 * @cfg {Boolean} required ,to specify whether this field is
			 *      mandatory (defaults to N)
			 */
			required : 'N',
			/**
			 * @cfg {Boolean} required ,to specify whether this field is
			 *      conditional (defaults to N)
			 */
			conditional : 'N',
			/**
			 * @cfg {Object} bundleKey ,key used by resource to lookup
			 *      bundle(defaults to '')
			 */
			combundleKey : '',
			/**
			 * @cfg {Boolean} includeSelect ,to specify whether combobox's first
			 *      option is select or not (defaults to true)
			 */
			includeSelect : true,
			/**
			 * @cfg {String} defaultValue ,initially Selected value for this
			 *      combo(defaults to '')
			 */
			defaultValue : '',
			/**
			 * @cfg {String} rawKeys ,raw keys to be set in the combo in the
			 *      absence of bundle(defaults to null)
			 */
			rawKeys : [],
			/**
			 * @cfg {String} rawValues ,raw values to be set in the combo in the
			 *      absence of bundle(defaults to null)
			 */
			rawValues : [],
			plainLabel : '',
			fieldLabel : '',
			resizable:true,
			fireEventOnSingleSelect : true,
			/**
			 * @cfg {String} replaceEntityReference ,true to make replace entity
			 *      references in combo displayfield
			 */
			replaceEntityReference : false,
			cls : 'x-form-combo',
			initComponent : function() {
				this.cls = this.cls+' '+this.itemId;
				cbx.formElement.IconComboBox.superclass.initComponent
						.apply(this, arguments);
				/*
				 * Karthik : whenever iconcombo is used , first the
				 * initComponent of the cbx-combobox is instantiated and then
				 * only the control will come here. That way, a normal combobox
				 * is first created and the following template makes sure that
				 * the combo items will appear with an icon before the
				 * value(text), provided css code for the comboitem is written.
				 */
				
				// Altered the tpl to display the icon class for combo as per the key earlier was value.
				this.tpl='<tpl for="."><div class="x-combo-list-item icon-combo-item iconcombobox-'+this.itemId+
				' comboIcon-'+this.parentId+"-"+this.name+"-"+'{key}">&nbsp;&nbsp;' + '{value}</div></tpl>';
				if(this.iconClsField){
					this.removeClass(this.iconClsField);
				}
				//this.iconClsField = "comboIcon-"+this.parentId+"-"+this.name+"-"+this.value;
				this.addClass(this.iconClsField);
				this.on('select', function(obj) {
					this.mandatoryValidator(obj.value);
					if(this.iconClsField){
						this.removeClass(this.iconClsField);
					}							
					this.iconClsField = "comboIcon-"+this.parentId+"-"+this.name+"-"+obj.value;
					this.addClass(this.iconClsField);
					this.addClass("icon-combo-item");
					this.syncModelData(); // CHG_FF_ENH
				});
			},
		/*ISSUE DIT_957 starts*/
		
			setValue : function(val) {
				 cbx.formElement.IconComboBox.superclass.setValue.call(this, val);
				 if(this.iconClsField){
						this.removeClass(this.iconClsField);
					}							
				 var setValueKey="";						
					if (this.store) {
							for ( var recIndex = 0; recIndex < this.store
									.getCount(); recIndex++) {
								if ((this.store.getAt(recIndex).data.key === val)
										|| (this.store.getAt(recIndex).data.value === val)) {
									setValueKey=this.store.getAt(recIndex).data.key ;
								}
							}
						}
					this.iconClsField = "comboIcon-"+this.parentId+"-"+this.name+"-"+setValueKey;
					this.addClass(this.iconClsField);
					if(!this.el.hasClass('icon-combo-item')){
						this.el.addClass('icon-combo-item');
					}
			}
		/*ISSUE DIT_957 ends*/
		});
Ext.reg('cbx-iconcombobox', cbx.formElement.IconComboBox);
// CHG_ICONCOMBO ends
/**
 * This class is an extension of Ext.form.TextField class
 */
cbx.formElement.comboStaticField = function(config) {
	this.plainLabel = config.plainLbl;
	this.fieldLabel = config.displayNmKey;
	//CHG_MULTIFORM Starts
	if(!Ext.isEmpty(config.multiInd) && config.multiInd==true && !Ext.isEmpty(config.index)){
		this.value = config.model.getModelData()[config.multiFormId][config.itemId][config.index] || "--";
	}else{
		this.value = config.model.getModelData()[config.itemId] || "--";	
	}
	//CHG_MULTIFORM Ends
	this.name = config.itemId;
	this.addData = config.addData || [];
	this.required = config.requiredInd;
	this.conditional = config.conditionalInd;
	this.hidden = config.visibleInd === 'Y' ? false : true;
	cbx.formElement.comboStaticField.superclass.constructor.call(this, config);
};
Ext.extend(cbx.formElement.comboStaticField, Ext.form.TextField, {
	/**
	 * @cfg {Object} bundleKey ,key used by resource to lookup bundle(defaults
	 *      to '')
	 */
	bundleKey : '',
	cls : 'canvas-staticcombo',
	initComponent : function() {
		this.triggerField = true;
		//CBXFW_DIT_77 starts
		this.on('hide',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'N']));
		this.on('show',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'Y']));
		//CBXFW_DIT_77 ends
		this.allowBlank = true;
		this.maxLength = undefined;
		this.minLength = undefined;
		cbx.formElement.comboStaticField.superclass.initComponent.apply(this,
				arguments);
		var bundle;
		var commonbundle = CRB.getFWBundle();
		bundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));
		if (!Ext.isEmpty(this.plainLabel)) {
			this.fieldLabel = this.plainLabel;
		} else {
			this.fieldLabel = bundle['LBL_' + this.fieldLabel];
		}
		if (this.conditional === 'Y') {
			if (Ext.isEmpty(this.fieldLabel)) {
				//CHG_TRADE_POC Starts
				this.fieldLabel = '?' + this.fieldLabel + '?';
				//CHG_TRADE_POC Ends
			} else {
				//CHG_TRADE_POC Starts
				this.fieldLabel = this.fieldLabel;
				//CHG_TRADE_POC Ends
			}
		} else if (this.required === 'Y') {
			if (Ext.isEmpty(this.fieldLabel)) {
				//CHG_TRADE_POC Starts
				this.fieldLabel = '?' + this.fieldLabel + '?';
				//CHG_TRADE_POC Ends
			} else {
				//CHG_TRADE_POC Starts
				this.fieldLabel = this.fieldLabel;
				//CHG_TRADE_POC Ends
			}
		} else {
			if (Ext.isEmpty(this.fieldLabel)) {
				this.fieldLabel = '?' + this.fieldLabel + '?'
						+ '<span class = \'non_mandatory\'"></span>';
			} else {
				this.fieldLabel = this.fieldLabel
						+ '<span class = \'non_mandatory\'"></span>';
			}
		}
		// this.value = this.getItemValue(this.value) || "--"; //Arafat FW
		// Enhancement
		//CHG_MULTIFORM Starts
		if(!Ext.isEmpty(this.multiInd)&& this.multiInd==true && !Ext.isEmpty(this.index)){
			var value=this.getItemValue(this.model.md[this.multiFormId][this.itemId][this.index]) || '--'; 
		}else{
			var value=this.getItemValue(this.model.getValue(this.name)) || '--';	
		}
		//CHG_MULTIFORM Ends
		// Arafat
																				// FW
																				// Enhancement

		this.setValue(value); // Arafat FW Enhancement

		this.readOnly = true;
		this.labelSeparator = '';
		this.style = 'border:none;background: transparent;padding-left:0;';
		this.anchor = (this.anchor == undefined) ? '' : this.anchor;
		this.tabIndex = 99999991; //CBXQ313F37
	},
	/**
	 * Method checks for the default item value exists.
	 */
	getItemValue : function(value) {
		var out = "";
		if (!Ext.isEmpty(this.addData) ) { // CBX_FW_Q112F_035
			for ( var i = 0; i < this.addData.length; i++) {
				if (this.addData[i]['rawKey'] === value) {
					out = this.addData[i]['rawValue'];
					return out;
				}
			}
		}
		return out;
	},
	//CHG_SCF_PO_004 Starts
	setValue : function(val) {
		var value=this.getItemValue(val) || val;
		if(Ext.isEmpty(value)){
			value='--';
		}
		cbx.formElement.comboStaticField.superclass.setValue.call(this, value);
		this.updateScreenViewData(this);
		
		if(this.el){
			if(this.getValue().length+2>Math.floor(this.el.getWidth()/iportal.preferences.getAverageFontWidth())){
				new Ext.ux.ClickToolTip({ 
					title: '',
					id: '',
					target: this.el,
					anchor: 'bottom',
					html: this.getValue(),
					trackMouse: true					
					});
			}     
		}
	}
	//CHG_SCF_PO_004 Starts Ends
		//CBXFW_DIT_77 starts
	, afterRender:function(){
		this.updateScreenViewData(this);
		cbx.formElement.comboStaticField.superclass.afterRender.apply(this,
				arguments);
	},	
	getScreenViewData:function()
	{
		return this.getValue();
	}
	//CBXFW_DIT_77 ends
});
Ext.reg('cbx-staticcombobox', cbx.formElement.comboStaticField);
/**
 * This is an extension of Ext.form.TextArea class
 */
cbx.formElement.TextArea = function(config) {
	this.plainLabel = config.plainLbl;
	this.fieldLabel = config.displayNmKey;
	this.name = config.itemId;
	//CHG_MULTIFORM Starts
	if(!Ext.isEmpty(config.multiInd) && config.multiInd==true && !Ext.isEmpty(config.index)){
		this.value = config.model.getModelData()[config.multiFormId][config.itemId][config.index];
	}else{
	this.value = config.model.getModelData()[config.itemId];
	}
	//CHG_MULTIFORM Ends
	this.required = config.requiredInd;
	this.conditional = config.conditionalInd;
	this.readOnly = config.readOnlyInd === 'Y' ? true : false;
	this.hidden = config.visibleInd === 'Y' ? false : true;
	this.validationType = config.vType;
	this.multiLangFlag=config.multiLangInd; // FW115
	cbx.formElement.TextArea.superclass.constructor.call(this, config);
};
Ext.extend(cbx.formElement.TextArea, Ext.form.TextArea, {
	growAppend : '&#160;\n&#160;',
	/**
	 * @cfg {Number} growMin The minimum height to allow when grow = true
	 *      (defaults to 60)
	 */
	growMin : 40,
	/**
	 * @cfg {Number} growMax The maximum height to allow when grow = true
	 *      (defaults to 1000)
	 */
	growMax : 1000,
	/**
	 * @cfg {Boolean} preventScrollbars True to prevent scrollbars from
	 *      appearing regardless of how much text is in the field (equivalent to
	 *      setting overflow: hidden, defaults to false)
	 */
	preventScrollbars : false,
	vtype:'',
		// CBX_FW_Q112F_092 Starts
	/**
	 * String/(Object):The error message for invalidaqtiong a field
	 */
	invalidText:null,
	/**
	 * Regular expression against which the field will be validated
	 */
	maskRe:null,
	enableKeyEvents:true,
	cls : 'canvas-textarea',
		
	initComponent : function() {
		
		this.cls=this.name;
		this.on('hide',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'N']));
		this.on('show',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'Y']));
		//CBXFW_DIT_77 ends
		// FW115 Starts
		/**
		 * If multiLangFlag is enabled then the validation type and vtype should
		 * explicitly made empty ,to avoid the validation error for multilingual
		 * data entries
		 */
		if(this.multiLangFlag==='Y'){
			this.vtype='';
			this.validationType='';
		}
		// FW115 Ends
		// CBX_FW_Q112F_092 Starts
		if(!Ext.isEmpty(this.validationType)){
			var registeredVtypes=cbx.form.vTypeRegistry.getVtypes();
			for(var i=0;i<registeredVtypes.length;i++){
				if(this.validationType==registeredVtypes[i].name){
					this.vtype=this.validationType;
					this.maskRe=registeredVtypes[i].mask;
					this.globalRe=registeredVtypes[i].globalRe;//FW_FIX10MAR2013
					this.invalidText=registeredVtypes[i].text;					
					break;
				}else if(this.validationType=='alphaNumeric' || this.validationType=='numeric' || this.validationType=='portalSupported'){
					LOGGER.info("The vtype that has  been configured is default set as :",this.validationType);
				}else{
					LOGGER.error("The vtype",+this.validationType+" has not registered in vtype registry");
				}
			}
		}
			// CBX_FW_Q112F_092 Ends
	// CHG001 starts
// Setting the height of the text area based on the maximum number of lines
		var maxNumOfLinesAsParam=4;
		// this.maxNumLines=9;
		if(!Ext.isEmpty(this.maxNumLines)){
			/*
			 * Condition to check the value of maxNumLines exceeds 10 or not. If
			 * it exceeds 10,it will discard the value and takes 10 as default
			 * value
			 */
			if(this.maxNumLines>10){
				maxNumOfLinesAsParam=10;
			}
			else if(this.maxNumLines>0 && this.maxNumLines<=10){
				maxNumOfLinesAsParam=this.maxNumLines;
			}
			// Set the height based on the utility method.
		}
			/**
			If the eveloper wants to configure the height of the text area
			explicitly
			*/
			if(this.ignoreMaxLines){
				//this.newMaxLines>this.maxNumLines
				if(!Ext.isEmpty(this.newMaxLines) && Ext.isNumber(this.newMaxLines)){
					maxNumOfLinesAsParam=this.newMaxLines;	
				}				
			}
		this.height=cbx.jsutil.getTextAreaHeight(maxNumOfLinesAsParam);
//CHG_MAX_LENGTH Ends
		// CHG001 ends
		// Check the validation based on maximum number of lines and maximum
		// number of characters per line
		if(!Ext.isEmpty(this.maxNumLines) && !Ext.isEmpty(this.maxCharsPerLine)){
			//this.vtype='maxChars';	
			//FW_FIX10MAR2013 Starts
			/**
			 * If maximum number of lines and maximum characters per line has
			 * been provided the max lenth should be counted by multiplicationg.
			 * 
			 */
			this.maxLength=this.maxNumLines*this.maxCharsPerLine;//FW_FIX10MAR2013
		}	
		if (Ext.isEmpty(this.maxLength)) {
			this.maxLength = undefined;
		}
		if (Ext.isEmpty(this.minLength)) {
			this.minLength = undefined;
		}
        		// CHG002 starts
        		// Check the validation based on maximum number of lines and
				// maximum number of characters per line
        		/*if(!Ext.isEmpty(this.maxNumLines) && !Ext.isEmpty(this.maxCharsPerLine)){
        			this.vtype='maxChars';
        			this.maxLength=this.maxNumLines*this.maxCharsPerLine;
        		}*/
        		// CHG002 ends
        		// CHG_FF_ENH Starts
        		if(this.maxLength==0){
        			this.maxLength = undefined;
        		}
        		// CHG_FF_ENH Ends
		cbx.formElement.TextArea.superclass.initComponent.call(this);
		var bundle;
		var commonbundle = CRB.getFWBundle();
		// To get the bundle key reference
		bundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));
		/**
		 * If the plainLabel attribute is not null ,component's field label will
		 * be the plain-label else the label associated with bundle keys will be
		 * referred to get the field label.
		 */
		if (!Ext.isEmpty(this.plainLabel)) {
			this.fieldLabel = this.plainLabel;
		} else {
			this.fieldLabel = bundle['LBL_' + this.fieldLabel];
		}
		this.labelSeparator = '';
		if (this.maxLength < Number.MAX_VALUE) {
			this.maxLengthText = String.format(
					commonbundle['ERR_MAXLENGTH_EXCEED'], this.fieldLabel,
					this.maxLength);
		}
		if (this.minLength < Number.MIN_VALUE) {
			this.minLengthText = String.format(
					commonbundle['ERR_MINLENGTH_EXCEED'], this.fieldLabel,
					this.minLength);
		}
		/**
		 * If the conditional attribute is Y the components field label will be
		 * field label associated with two stars
		 */
		if (this.conditional == 'Y') {
			this.blankText = String.format(commonbundle['ERR_MANDATORY'],
					this.fieldLabel);
			if (Ext.isEmpty(this.fieldLabel)) {
				this.fieldLabel = '?' + this.fieldLabel + '?'
						+ '<span class = \'cbx-mandatory-fx\'">**</span>';// CHG001-CSS
																			// changes
			} else {
				this.fieldLabel = this.fieldLabel
						+ '<span class = \'cbx-mandatory-fx\'">**</span>';// CHG001-CSS
																			// changes
			}
		}
		/**
		 * If the required attribute is Y,components field label will be field
		 * label associated with mandatory star and the field will not allow
		 * blank values.
		 */
		else if (this.required === 'Y') {
			this.allowBlank = false;
			this.blankText = String.format(commonbundle['ERR_MANDATORY'],
					this.fieldLabel);
			if (Ext.isEmpty(this.fieldLabel)) {
				this.fieldLabel = '?' + this.fieldLabel + '?'
						+ '<span class = \'mandatory\'">*</span>';
			} else {
				this.fieldLabel = this.fieldLabel
						+ '<span class = \'mandatory\'">*</span>';
			}
		} else {
			this.blankText = String.format(commonbundle['ERR_MANDATORY'],
					this.fieldLabel);
			if (Ext.isEmpty(this.fieldLabel)) {
				this.fieldLabel = '?' + this.fieldLabel + '?'
						+ '<span class = \'non_mandatory\'"></span>';
			} else {
				this.fieldLabel = this.fieldLabel
						+ '<span class = \'non_mandatory\'"></span>';
			}
		}
			switch (this.validationType) {
		// validation type currently supported is alphaNumeric and numeric
		// alone, which restricts the keystrokes
		// to be only alphabets and numerals.Numeric vType is an alternate for
		// numberfield
		//CHG_TRADE_POC Starts
		case 'swift':
			//UAT_6405_UPDATED_FIX starts
			// Added new line character to text area swift validation
			this.maskRe=/[A-Za-z0-9,.:'+\(\)?'\-\r\n \/]/; 
			this.globalRe=/[A-Za-z0-9,.:'+\(\)?'\-\r\n \/]/g; 
			
			this.invalidText="Only /-?:().,'+ are allowed";
		break;
		//UAT_8297 STARTS
		case 'email':
			 
			this.maskRe=  /[a-zA-Z0-9._@-]/; 
			this.globalRe= /^[a-zA-Z0-9]{1}[a-zA-Z0-9._-]*@[a-zA-Z0-9]{1}[a-zA-Z0-9.-]*\.[a-zA-Z]{2,4}$/;
			 
			this.invalidText="This field should be an e-mail address in the format \"user@example.com\"";
		break;
		//UAT_8297 ENDS
		
		case 'alphaNumericToUpper':
			if (this.allowSpaces) {
				// CBX_FW_Q112F_092 Starts
				this.maskRe = /[A-Za-z0-9 ]/;	
				this.globalRe  = /[A-Za-z0-9 ]/g;
				this.invalidText=commonbundle.ERR_ONLYALPHANUMERIC_TOUPPER_SPACE
			//CHG_MOBILE Ends
				// CBX_FW_Q112F_092 Ends
			} else {
				// CBX_FW_Q112F_092 Starts
				this.maskRe = /[A-Za-z0-9]/;	
				this.globalRe = /[A-Za-z0-9]/g;
				this.invalidText=commonbundle.ERR_ONLYALPHANUMERIC_TOUPPER
			  	// CBX_FW_Q112F_092 Ends
			}
			break;
		//CHG_TRADE_POC Ends
		case 'alphaNumeric':

			if (this.allowSpaces) {

				// CBX_FW_Q112F_092 Starts
                // CBX_FW_Q112F_092_UPD STARTS
				// this.maskRe = /[A-Za-z0-9 ]/g;
				this.maskRe = /[A-Za-z0-9 ]/;	
				this.globalRe=/[A-Za-z0-9 ]/g;	
				// CBX_FW_Q112F_092_UPD ENDS
				this.invalidText=commonbundle.ERR_ONLY_ALPHANUMERIC_SPACES
				// CBX_FW_Q112F_092 Ends
			} else {
				// CBX_FW_Q112F_092 Starts
                // CBX_FW_Q112F_092_UPD STARTS
				// this.maskRe = /[A-Za-z0-9]/g;
				this.maskRe = /[A-Za-z0-9]/;
				this.globalRe=/[A-Za-z0-9]/g;	
				// CBX_FW_Q112F_092_UPD ENDS
				this.invalidText=commonbundle.ERR_ONLY_ALPHANUMERIC
			  	// CBX_FW_Q112F_092 Ends
			}
			break;
		// Use numeric vtype as an alternate for NumberField
		case 'numeric':
			if (this.allowSpaces) {
			// CBX_FW_Q112F_092 Starts
                // CBX_FW_Q112F_092_UPD STARTS
				// this.maskRe = /[0-9 ]/g;
				this.maskRe = /[0-9 ]/;
				this.globalRe=/[0-9 ]/g;
                // CBX_FW_Q112F_092_UPD ENDS
				this.invalidText=commonbundle.ERR_NUMERIC_SPACES
			  	// CBX_FW_Q112F_092 Ends
			} else {
			// CBX_FW_Q112F_092 Starts
                // CBX_FW_Q112F_092_UPD STARTS
				// this.maskRe = /[0-9]/g;
				this.maskRe = /[0-9]/;	
				this.globalRe=/[0-9]/g;	
                // CBX_FW_Q112F_092_UPD ENDS
				this.invalidText=commonbundle.ERR_NUMERIC;			  
			  	// CBX_FW_Q112F_092 Ends
			}
			break;
		case 'portalSupported':
			if (this.allowSpaces) {
				// CBX_FW_Q112F_092 Starts
                // CBX_FW_Q112F_092_UPD STARTS
				// this.maskRe = /[^<>;{}()!=&\'\"]/g;
				this.maskRe = /[^<>;{}()!=&\'\"]/;
				this.globalRe=/[^<>;{}()!=&\'\"]/g;
                // CBX_FW_Q112F_092_UPD ENDS
					this.invalidText=commonbundle.ERR_PORTAL_SUPPORTED
				  	// CBX_FW_Q112F_092 Ends
			} else {
				// CBX_FW_Q112F_092 Starts
                // CBX_FW_Q112F_092_UPD STARTS
				// this.maskRe = /[0-9]/g;
				this.maskRe = /[^<>;{}()!=&\'\" ]/;
				this.globalRe=/[^<>;{}()!=&\'\" ]/g;	
                // CBX_FW_Q112F_092_UPD ENDS
				this.invalidText=commonbundle.ERR_INVALID_CHAR			  
			  	// CBX_FW_Q112F_092 StartsEnds
			}
			break;
		}
		this.labelSeparator = '';// CHG001
		// this.on('keyup',this.customValidator);//
		// CBX_FW_Q112F_092//CBX_FW_Q112F_092_UPD
		/**
		 * On change event invokes the syncModelData method which in turn
		 * updates the model with name and current value
		 */
		this.on('change', this.syncModelData);
	},
	// CBX_FW_Q112F_092_UPD Starts
	afterRender:function(){
		this.updateScreenViewData(this);//CBXFW_DIT_77
		cbx.formElement.TextArea.superclass.afterRender.call(this);
		this.getEl().on('keyup',this.customValidator,this);
		/*DIT_108 starts- registering events*/
		if(this.copyPasteInd==="Y")
			{
		this.getEl().on('keydown',preventCopyPaste,this);
		this.getEl().on('drop',preventCopyPaste,this);
		this.getEl().on('dragstart',preventCopyPaste,this);
		this.getEl().on('draggesture',preventCopyPaste,this);
			}
		/*DIT_108 ends- registering events*/

	},
	// CBX_FW_Q112F_092 Starts
	customValidator:function(e){
	//CHG_MAX_LENGTH Starts
		var that=this;
	var keyCode=e.getKey();
		var isCompleteValue = true;////CHG_CT_CLEANUP 
		if(this.validationType=='alphaNumericToUpper'){
			if(keyCode>=65 && keyCode<=90)
			this.setValue(this.getValue().toUpperCase());
		}			
		//FW_FIX10MAR2013
			if(!Ext.isEmpty(this.getValue()))
				var v=this.getValue();
			if(!Ext.isEmpty(this.validationType)){
				var mask=this.globalRe;
			}
//CHG_CT_CLEANUP Starts
		return this.validator(v,isCompleteValue);
	},
		validator:function(v,isCompleteValue)
		{
			if(this.allowBlank==false && Ext.util.Format.trim(v).length==0){
				this.vtypeText=this.blankText;
		        return this.vtypeText;
			}
			var mask = "";
			if(!Ext.isEmpty(this.validationType)){
				if(this.validationType == 'email' && (Ext.isEmpty(isCompleteValue) || isCompleteValue == false)){
					isCompleteValue = false;
					return true;
				}
				mask=this.globalRe;
			}
//		CHG_MAX_LENGTH Starts
			if(this.respectNewLineChar==undefined || Ext.isEmpty(this.respectNewLineChar) && this.respectNewLineChar==''){
				valforMaxLength=v.replace(/(\r\n|\n|\r)/gm,"");			
			}else{
			valforMaxLength=v;
			}

			if(this.maxLength!=undefined && valforMaxLength.length>this.maxLength){
				this.vtypeText=this.maxLengthText;
				return 	this.vtypeText;
			}
			var charPerLine=this.maxCharsPerLine;
			var numOfLines=this.maxNumLines;
			var rowArr= this.getValue().split('\n');
			var rowVal=null;
			if(!Ext.isEmpty(charPerLine)){
			for(var i=0, len=rowArr.length;i<len; i++){
				rowVal=rowArr[i];
				if(rowVal.length>charPerLine){
					this.vtypeText= String.format(CRB.getFWBundle().ERR_INVALID_NUMBER_OF_CHARS_PERLINE, charPerLine);
					return 	this.vtypeText;
				}
			}
			}
			if(!Ext.isEmpty(numOfLines)){
			if(rowArr.length>numOfLines){
				this.vtypeText=String.format(CRB.getFWBundle().ERR_INVALID_NUMBER_OF_LINES, numOfLines);
				return 	this.vtypeText;
			}
//CHG_CT_CLEANUP Ends
			}
			//CHG_MAX_LENGTH Ends
			/**
			 * If there is no regular expression configured
			 */
			if(mask==null || mask==""){
				return true;
			}
			/**
			 * If the value inside the field is null
			 */
			else if(v==""){
		 		return true;
		 	}
			/**
			 * If the value is not matching with the regular expression or if
			 * the number of matching characters is less than the field value
			 * length
			 */
			else if(v.match(mask)==null || v.match(mask).length<v.length){	 
				var commonbundle=CRB.getFWBundle();
				if(this.validationType=='alphaNumeric' && this.allowSpaces==true){
					this.invalidText=commonbundle.ERR_ONLY_ALPHANUMERIC_SPACES
				}else if(this.validationType=='alphaNumeric'){
					this.invalidText=commonbundle.ERR_ONLY_ALPHANUMERIC
				}
				else if(this.validationType=='numeric' && this.allowSpaces==true){
					this.invalidText="Only numeric and spaces are allowed";
				}
				else if(this.validationType=='numeric'){
					this.invalidText="Please enter the valid number";
				}
				else if(this.validationType=='swift'){
					this.invalidText="Only /-?:().,'+ are allowed";
				}
				else if(this.validationType=='swift-res-quote'){
					this.invalidText="Only /-?:().,+ are allowed";
				}
				//UAT_8297 STARTS
				else if(this.validationType=='email'){
					this.invalidText="This field should be an e-mail address in the format \"user@example.com\"";
				}
				//UAT_8297 ENDS
				else if(this.validationType=='decimal' && this.allowSPaces==true){
					this.invalidText=CRB.getFWBundle()['INVALID_TEXT_SPACES'];
				}
				else if(this.validationType=='decimal'){
					this.invalidText=CRB.getFWBundle()['INVALID_TEXT'];
				}
	 			this.vtypeText=this.invalidText;
	 			return false;			
			 			
		 		}
//CHG_CT_CLEANUP Starts
		 	else{
		 		return true;
			 }
//CHG_CT_CLEANUP Ends
	},
	// CBX_FW_Q112F_092 Ends
	// CBX_FW_Q112F_092_UPD Ends
	/**
	 * Method updates the modal with fieldname and current value
	 */
	syncModelData : function() {
		//CHG_MULTIFORM Starts
		if(!Ext.isEmpty(this.multiInd) && this.multiInd==true && !Ext.isEmpty(this.index)){
			if (this.manager.handlerEvent('cbxvalidate', this.name,this
					.getValue(),this.index,this.multiFormId) === false) {
			return;
			}
		}
		else if (this.manager.handlerEvent('cbxvalidate', this.name, this
				.getValue()) === false) {
		return;
		}
		if(!Ext.isEmpty(this.multiInd) && this.multiInd==true && !Ext.isEmpty(this.index)){
			this.model.updateValue(this.name,this.getValue(),undefined,this.index,this.multiFormId);
		}else{
			this.model.updateValue(this.name, this.getValue());	
		}
		//CHG_MULTIFORM Ends
			this.updateScreenViewData(this);//CBXFW_DIT_77
		},
	getPrintData : function() {
		var label = this.plainLabel;
		var fieldValue = this.getValue();
		var printMap = {};
		printMap[label] = fieldValue;
		return printMap;
	}
	//CBXFW_DIT_77 starts
	,getScreenViewData:function()
	{
		return this.getValue();
	}//CBXFW_DIT_77 ends
	
	,validate : function(){	
	var v=this.getRawValue();
	if(this.respectNewLineChar==undefined || Ext.isEmpty(this.respectNewLineChar) && this.respectNewLineChar==''){
			if(!Ext.isEmpty(v)){
			v=v.replace(/(\r\n|\n|\r)/gm,"");	
			}
		}
		if(this.disabled || this.validateValue(this.processValue(v))){
		 this.clearInvalid();
		 return true;
		 }
		 return false;
		 }
});
Ext.reg('cbx-textarea', cbx.formElement.TextArea);
/**
 * This class is an extension of Ext.form.TriggerField class
 */
cbx.formElement.EditableLookUp = function(config) {
	this.name = config.itemId;
	this.plainLabel = config.plainLbl;
	this.fieldLabel = config.displayNmKey;
	this.required = config.requiredInd;
	this.conditional = config.conditionalInd;
	//CHG_MULTIFORM Starts
	if(!Ext.isEmpty(config.multiInd) && config.multiInd==true &&  !Ext.isEmpty(config.index)){
		this.value = config.model.getModelData()[config.multiFormId][config.itemId][config.index];
	}else{
	this.value = config.model.getModelData()[config.itemId];// Framework changes
	}
	//CHG_MULTIFORM Ends	
	this.model = config.model;
	this.widgetId = config.widgetId;
	this.readOnly = config.readOnlyInd === 'Y' ? true : false;
	this.hidden = config.visibleInd === 'Y' ? false : true;
	/**CBXQ113U01  - EditableLukUpCBX3.0_CHG001 - Starts*/
	this.editable = config.editableInd === 'Y' ? true : false;
	this.filterColType = config.columnType;
	this.filterColId = config.dsKeyColumnId;
	/**CBXQ113U01  - EditableLukUpCBX3.0_CHG001 - Ends*/
	cbx.formElement.EditableLookUp.superclass.constructor.call(this, config);
};
Ext.extend(cbx.formElement.EditableLookUp, Ext.form.TriggerField, {
	/**
	 * @cfg {Object} bundleKey ,key used by resource to lookup bundle(defaults
	 *      to '')
	 */
	showselectedRowsinLookUp:null,//Fix for multiselect
	bundleKey : '',
	/**
	 * @cfg {Object} fieldLabel ,label associated with the lookup button
	 */
	fieldLabel : '',
	plainLabel : '',
	/**
	 * @cfg {String/Object} required ,to specify whether this field is mandatory
	 *      (defaults to false)
	 */
	required : 'N',
	/**
	 * CBX_FW_Q112F_055 Starts
	 */
	// readOnly : true,//Commented
	editable:false,// Added
	/**
	 * CBX_FW_Q112F_055 Ends
	 */
	/**
	 * @cfg {String/Object} required ,to specify whether this field is mandatory
	 *      (defaults to false) The lookup window will be opened iff. handler
	 *      for lookup returns true. So by default give an empty fn which
	 *      returns true.
	 */
	vtype : 'invalidChars',
	//Fix for multiselect-start
	getshowselectedRowsinLookUp :function(){
	return this.showselectedRowsinLookUp;
	},
	setshowselectedRowsinLookUp : function(selrec){
		this.showselectedRowsinLookUp=selrec;
	},//Fix for multiselect-End
	handler : function() {
		return true;
	},
	/**
	 * @cfg {String/Object} buttonTextKey ,text over button (defaults to LOOKUP)
	 */
	buttonTextKey : 'LBL_LOOKUP',
	/*DIT_108 starts*/
	/* for allow key events in trigger field */
	enableKeyEvents:true,
	disableKeyFilter:false,
	/*DIT_108 ends*/

	submittable : true,
	/**
	 * @cfg object required, Meta data object required to render account lookup,
	 *      This object can create create with following attributes productCode -
	 *      required, to specify PRODUCT CODE and will be passed to server while
	 *      retrieving data subProductCode - required, to specify SUB-PRODUCT
	 *      CODE and will be passed to server while retrieving data functionCode -
	 *      required, to specify FUNCTION CODE and will be passed to server
	 *      while retrieving data cm - required, Should be an object of
	 *      Ext.grid.ColumnModel, will be used to render lookup grid columns
	 *      recordType - required , Used to read records returning from server
	 *      Either an Array of field definition objects as passed to
	 *      Ext.data.Record.create, or a Record constructor created using
	 *      Ext.data.Record.create. rowdbclickhandler - required, Javascript
	 *      function which would gets executes when a row is double clicked in
	 *      the grid extraParams - Optional, If required to pass any params as
	 *      part of request
	 */
	lookupMetadata : {},
	/**
	 * possiable values are 0 and 1 0 indicates apply pre-filter 1 indicates no
	 * pre-filter required.
	 * 
	 * @type Number
	 */
	preFilterRequired : 1,
	// triggerClass : 'x-form-search-trigger',
	ctCls:'c-form-lookup', // CHG_CBT_Q2 FIX TC#79 look up icon
							// //CHG00LookupFilter
	width : 142,
	defaultAutoCreate : {
		tag : "input",
		type : "text",
		size : "100",
		autocomplete : "off"
	},
	// private
	initComponent : function() {
		//CBXFW_DIT_77 starts
		this.on('hide',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'N']));
		this.on('show',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'Y']));
		//CBXFW_DIT_77 ends
		var commonbundle = CRB.getFWBundle();
		if (Ext.isEmpty(this.maxLength)) {
			this.maxLength = undefined;
		}
		if (Ext.isEmpty(this.minLength)) {
			this.minLength = undefined;
		}
		//7958 Starts 
		if(this.editable_ind && this.editable_ind=='N'){
			this.editable=false;
		}
		//7958 Ends
		cbx.formElement.EditableLookUp.superclass.initComponent.apply(this,
				arguments);
		var bundle;
		// To get the bundle key reference
		bundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));
		/**
		 * If the plainLabel attribute is not null ,component's field label will
		 * be the plain-label else the label associated with bundle keys will be
		 * referred to get the field label.
		 */
		if (!Ext.isEmpty(this.plainLabel)) {
			this.fieldLabel = this.plainLabel;
		} else if (Ext.isEmpty(this.fieldLabel)) {
			this.text = '';
		} else {
			this.fieldLabel = bundle['LBL_' + this.fieldLabel];
		}
		if (this.maxLength < Number.MAX_VALUE) {
			this.maxLengthText = String.format(
					commonbundle['ERR_MAXLENGTH_EXCEED'], this.fieldLabel,
					this.maxLength);
		}
		if (this.minLength < Number.MIN_VALUE) {
			this.minLengthText = String.format(
					commonbundle['ERR_MINLENGTH_EXCEED'], this.fieldLabel,
					this.minLength);
		}
		/**
		 * If the conditional attribute is Y the components field label will be
		 * field label associated with two stars
		 */
		if (this.conditional == 'Y') {
			try {
				this.blankText = String.format(commonbundle['ERR_MANDATORY'],
						this.fieldLabel);
				if (Ext.isEmpty(this.fieldLabel)) {
					this.fieldLabel = '?' + this.fieldLabel + '?'
							+ '<span class = \'cbx-mandatory-fx\'">**</span>';// CHG001-CSS
																				// changes
				} else {
					this.fieldLabel = this.fieldLabel
							+ '<span class = \'cbx-mandatory-fx\'">**</span>';// CHG001-CSS
																				// changes
				}
			} catch (e) {
				this.fieldLabel = '?' + this.fieldLabel + '?'
						+ '<span class = \'cbx-mandatory-fx\'">**</span>';// CHG001-CSS
																			// changes
			}
		}
		/**
		 * If the required attribute is Y,components field label will be field
		 * label associated with mandatory star and the field will not allow
		 * blank values.
		 */
		else if (this.required === 'Y') {
			try {
				this.allowBlank = false;
				this.blankText = String.format(commonbundle['ERR_MANDATORY'],
						this.fieldLabel);
				// if(bundle[this.fieldLabel]==undefined)
				if (Ext.isEmpty(this.fieldLabel)) {
					this.fieldLabel = '?' + this.fieldLabel + '?'
							+ '<span class = \'mandatory\'">*</span>';
				} else {
					this.fieldLabel = this.fieldLabel
							+ '<span class = \'mandatory\'">*</span>';
				}
			} catch (e) {
				this.fieldLabel = '?' + this.fieldLabel + '?'
						+ '<span class = \'mandatory\'">*</span>';
			}
		} else {
			try {
				this.fieldLabel = '<span class = \'non_mandatory\'"></span>'
						+ this.fieldLabel;
			} catch (e) {
				this.fieldLabel = '<span class = \'non_mandatory\'"></span>'
						+ '?' + this.fieldLabel + '?';
			}
		}
		if (Ext.isEmpty(this.bundleKey)) {
			this.bundleKey = this.findParentByType('cbx-formpanel').bundleKey;
		}
		try {
			bundle = CRB.getBundle(this.bundleKey);
		} catch (e) {
		}
		/**
		 * On change event invokes the syncModelData method which in turn
		 * updates the model with name and current value
		 */
		this.on('change', this.syncModelData);
		this.labelSeparator = '';
		/**CBXQ113U01  - EditableLukUpCBX3.0_CHG001 - Starts*/
		if(this.editable == true && this.readOnly == false){
			this.on('change', this.onTriggerTab);
		}
		this.isWindowVisible = false;
		/**CBXQ113U01  - EditableLukUpCBX3.0_CHG001 - Ends*/
	},
	//NBAD3.0-UAT-7775 - STARTS
	handleKeyDown : function (e){
		var keyCode=e.getKey() || e.keyCode || e.charCode;
		//for prevent copy and paste functionality using keycode in keystroke
		if((e.ctrlKey && keyCode==86)){
			this.onTriggerTab();
		}
	},
	//NBAD3.0-UAT-7775 - ENDS
	afterRender:function(){
		cbx.formElement.EditableLookUp.superclass.afterRender.call(this);
		/*DIT_108 starts- registering events*/
		this.getEl().on('keyup',this.handleKeyDown,this);
		if(this.copyPasteInd==="Y")
			{
			this.getEl().on('keydown',preventCopyPaste,this);
			this.getEl().on('drop',preventCopyPaste,this);
			this.getEl().on('dragstart',preventCopyPaste,this);
			this.getEl().on('draggesture',preventCopyPaste,this);		
			}
		/*DIT_108 ends- registering events*/	

		this.updateScreenViewData(this);//CBXFW_DIT_77

	},
	onTriggerClick : function() {
		if (this.disabled) {
			return;
		}
		if(this.editable == true && this.readOnly == false){
			var filterParams = this.manager.handlerEvent('cbxbeforeload', this.name);
			// CBXQ113U05 - starts
			if(Ext.isEmpty(filterParams)){
				//LOGGER.debug("filterParams null : ", filterParams);
				filterParams={};
				filterParams.INPUT_PRODUCT=this.widgetProductCode;
				filterParams.PRODUCT_NAME=this.widgetProductCode;
				filterParams.INPUT_SUB_PRODUCT=this.widgetSubProductCode;
				filterParams.INPUT_FUNCTION_CODE=this.widgetFunctionCode;
				filterParams.IS_LOOK_UP=true;//UAT_7749
				
				
			}	
			// CBXQ113U05 - Ends
			if(!Ext.isEmpty(filterParams)){
				// LOGGER.debug("filterParams Before : ", filterParams);
				// CBXQ113U05 - Starts
				if(Ext.isEmpty(filterParams.INPUT_PRODUCT)){
					filterParams.INPUT_PRODUCT=this.widgetProductCode;
				}
				
				if(Ext.isEmpty(filterParams.PRODUCT_NAME)){					
					filterParams.PRODUCT_NAME=this.widgetProductCode;
				}
			
				if(Ext.isEmpty(filterParams.INPUT_SUB_PRODUCT)){
					filterParams.INPUT_SUB_PRODUCT=this.widgetSubProductCode;
				}
									
				if(Ext.isEmpty(filterParams.INPUT_FUNCTION_CODE)){
					filterParams.INPUT_FUNCTION_CODE=this.widgetFunctionCode;
				}
				
				filterParams.IS_LOOK_UP=true;
				
				this.additionalFiltersParams=filterParams; //CBXQ113U05_UPD				
				LOGGER.debug("filterParams : ", filterParams);
				// CBXQ113U05 - Ends
				var columnCount = 0;
				var filterValue = this.getValue().trim();
				var ajaxCallParams = { 							
					'PAGE_CODE_TYPE':'VDF_CODE',
					'INPUT_ACTION':'INIT_DATA_ACTION',
					'WIDGET_ID':this.widgetId,
					'IS_LOOK_UP':true,
					'LOOKUP_FLAG': false
				};			
				Ext.apply(ajaxCallParams, filterParams);
				for(var i in ajaxCallParams){
					if(i.indexOf('_FIELD')>-1){
						columnCount++;
					}
				}
				if( !cbx.isEmpty(filterValue) && !cbx.isEmpty(this.filterColId) ){
					var count=(parseInt(columnCount)+1);	
					if(this.filterColType == 'string'){
						ajaxCallParams['COLUMN_COUNT']= count;
						ajaxCallParams['FILTER'+count+'_CONSTRAINT']= 'contains';
						ajaxCallParams['FILTER'+count+'_VALUE_TXT'] = filterValue;
						ajaxCallParams['FILTER'+count+'_FIELD'] = this.filterColId;
						ajaxCallParams['FILTER'+count+'_TYPE'] = this.filterColType;
						ajaxCallParams['IS_FILTER_FORM'] = true;
					}
				}
				var that=this;
				Ext.Ajax.request({
				   url: iportal.jsutil.getController(),
			       method:'POST', 
			       params :ajaxCallParams,
			       success: function(response,opt){
						iportal.jsutil.hideLoadingMsgOnBody();
						var respObj=Ext.decode(response.responseText);
						if(!cbx.isEmpty(respObj) && !cbx.isEmpty(respObj.response) && !cbx.isEmpty(respObj.response.value)){
							var count = respObj.response.value.TOTAL_COUNT;
							if (count == 1 && !iportal.preferences.getLaunchLookupWithOneRecord())
							{
								that.applyLookUpDataToFields(respObj,that);
							}
							else 
							{
								that.showLookupWithRecords(response,that,filterValue);
							}
						}
					},
				   failure: function (resp,opt){
						iportal.jsutil.hideLoadingMsgOnBody();
					}			
				});
			}
			else{
				LOGGER.error("No params configured to load lookup in listner for the lookup id : ", this.itemId);
			}
		}
		else {
			var rb = CRB.getFWBundle();
			
			/**
			 * On Raising this event The Form manager is expected to return a param
			 * JSON that will be attached to / override the existing base params of
			 * the lookup. These params will be sent to the server when the lookup
			 * grid make its data request.
			 */
			var addParams = this.manager.handlerEvent('cbxbeforeload', this.name);
			LOGGER.debug("addParams : ", addParams);
			//CBXQ113U05_UPD Starts
			if(Ext.isEmpty(addParams)){
				addParams={};
				
				// CBXQ113U05_UPD1 Starts
				addParams.INPUT_PRODUCT=this.widgetProductCode;
				addParams.PRODUCT_NAME=this.widgetProductCode;
				addParams.INPUT_SUB_PRODUCT=this.widgetSubProductCode;
				addParams.INPUT_FUNCTION_CODE=this.widgetFunctionCode;
				addParams.IS_LOOK_UP=true;//UAT_7749
				// CBXQ113U05_UPD1 Ends
				
			}
			if(!Ext.isEmpty(addParams)){
				// CBXQ113U05_UPD1 Starts
				if(Ext.isEmpty(addParams.INPUT_PRODUCT)){
					addParams.INPUT_PRODUCT=this.widgetProductCode;
				}				
				if(Ext.isEmpty(addParams.PRODUCT_NAME)){					
					addParams.PRODUCT_NAME=this.widgetProductCode;
				}

				if(Ext.isEmpty(addParams.INPUT_SUB_PRODUCT)){
					addParams.INPUT_SUB_PRODUCT=this.widgetSubProductCode;
				}
				// CBXQ113U05_UPD1 Ends
				if(Ext.isEmpty(addParams.INPUT_FUNCTION_CODE)){
					addParams.INPUT_FUNCTION_CODE=this.widgetFunctionCode;
				}
				
				addParams.IS_LOOK_UP=true;//UAT_7749
				LOGGER.debug("addParams : ", addParams);
			}
			this.additionalFiltersParams=addParams;		// CBXQ113U05_UPD1
			//CBXQ113U05_UPD End
			// The Changed Metadata is as Follows
			var transmetadata = {
				resourceBundleKey : CRB.getFWBundleKey(),
				width : 635,
				widgetId : this.widgetId,
				reqparamshandler : function(params) {
					if (addParams != null) {						
						Ext.apply(params, addParams);
					}
					Ext.apply(params, {'IS_LOOK_UP':true});//UAT_7749
					return params;
				}
			};
			this.lookupMetadata = transmetadata;
			this.lookupMetadata.lookupId = this.widgetId;
			this.lookupMetadata.widgetId = this.widgetId;
			this.lookupMetadata.rowdbclickhandler = this.callBackHandler;
			this.lookupMetadata.multiSelectHandler = this.multislelectHandler;//CBXARXQ313U02
			this.lookupMetadata.scope = this;
			iportal.formview.showLookupWin(this.lookupMetadata);
		}
	},
	multislelectHandler : function(srd,buttonId) {

		var lookup = srd.__LOOKUP_NAME;
		if (lookup == this.widgetId) {
			this.manager.handlerEvent('cbxafterselect', this.name, srd,buttonId);
			this.isWindowVisible = false;
		}
	},
	/**
	 * Method handles the callback responsibilty on selecting the row from
	 * lookup grid and sets the current value of our text field, updates the
	 * model with fieldname plus current value.
	 */
	callBackHandler : function(grid, srd, rowindex) {

		var lookup = srd.__LOOKUP_NAME;
		if (lookup == this.widgetId) {
			this.manager.handlerEvent('cbxafterselect', this.name, srd);
			/**CBXQ113U01  - EditableLukUpCBX3.0_CHG001 - Starts*/
			this.isWindowVisible = false;
			/**CBXQ113U01  - EditableLukUpCBX3.0_CHG001 - Ends*/
		}
	},
	// CBXQ313U09 - STARTS
	lookupCloseHandler : function (){
		if(this.required === 'Y'){
			this.manager.markInvalid(this.name);
			}
			this.manager.handlerEvent('cbxclearlookup', this.name);
	},
	// CBXQ313U09 - ENDS
	// CBXQ313U09_UPD - STARTS
	validate:function(){
		if (!this.disabled && (this.el.dom.className.indexOf('errorBg')!=-1 || this.el.dom.className.indexOf(this.invalidClass) != -1)) {	
			return false;
		}
		if(this.disabled || this.validateValue(this.processValue(this.getValue()))){  
            this.clearInvalid();
            return true;
        }
        return false;
	},
	// CBXQ313U09_UPD - Ends
	getValue : function() {
		return cbx.formElement.EditableLookUp.superclass.getValue.call(this)
				|| "";
	},
	// Set the current value of our text field.
	setValue : function(text) {
		// CBXQ313U09_UPD - STARTS
		if (text == ''){
			if(this.required === 'Y'){
				this.markInvalid(this.blankText);
			}
		}
		else {
			this.clearInvalid();
		}
		// CBXQ313U09_UPD - Ends
		cbx.formElement.EditableLookUp.superclass.setValue.call(this, text);
	},
	getPrintData : function() {
		var label = this.fieldLabel;
		var fieldValue = this.getValue();
		var printMap = {};
		printMap[label] = fieldValue;
		return printMap;
	},
	//CBXFW_DIT_77 starts
	afterRender:function(){	
		this.updateScreenViewData(this);
		cbx.formElement.EditableLookUp.superclass.afterRender.call(this);
	},
	/**
	 * Updates the screen data in the ScreenView
	 */
	getScreenViewData:function()
	{
		return this.getValue();
	},
	//CBXFW_DIT_77 ends
	/**
	 * Method updates the modal with fieldname and new value on selecting the
	 * lookup
	 */
	syncModelDataonLookupSelect : function(newvalue) {
		//CHG_MULTIFORM Starts
		if(!Ext.isEmpty(this.multiInd) && this.multiInd==true &&  !Ext.isEmpty(this.index)){
			this.model.updateValue(this.name, newvalue,undefined,this.index,this.multiFormId);	
		}else{
			this.model.updateValue(this.name, newvalue);
		}
		//CHG_MULTIFORM Ends
		this.updateScreenViewData(this);//CBXFW_DIT_77
		
	},
	/**
	 * Method updates the modal with fieldname and current value
	 */
	syncModelData : function() {	
	//CHG_MULTIFORM Starts
	if(!Ext.isEmpty(this.multiInd) && this.multiInd==true && !Ext.isEmpty(this.index)){
		this.model.updateValue(this.name,this.getValue(),undefined,this.index,this.multiFormId);	
	}else{
		this.model.updateValue(this.name, this.getValue());
		this.updateScreenViewData(this);//CBXFW_DIT_77
		}
	},
	/**CBXQ113U01  - EditableLukUpCBX3.0_CHG001 - Starts*/
	onTriggerTab : function(){
		if(this.isWindowVisible == false){
			this.onTriggerClick();
		}
	},
	applyLookUpDataToFields : function(respObj,that){
		/*var filterValue_grid="";									
		for(var i=0;i<respObj.response.value.ALL_RECORDS.length;i++)
			{
			filterValue_grid=respObj.response.value.ALL_RECORDS[i][that.filterColId];
			}	
		*/
		var record={};
		Ext.apply(record,{__LOOKUP_NAME : that.widgetId});
		Ext.apply(record, respObj.response.value.ALL_RECORDS[0]);
		that.callBackHandler("",record,"");
	},
	showLookupWithRecords : function(response,that,filterValue){
		var transmetadata = {	    												
			widgetId : that.widgetId,
			resourceBundleKey : CRB.getFWBundleKey(),
			width : 635,
			reqparamshandler : function(params) {
				var columnCount=0;					
				for(var i in params){
					if(i.indexOf('_FIELD')>-1){
						columnCount++;
					}
				}
				if( !cbx.isEmpty(filterValue) && !cbx.isEmpty(this.filterColId) ){
					var count=(parseInt(columnCount)+1);	    															
					params['COLUMN_COUNT']= count;
					params['FILTER'+count+'_CONSTRAINT']= 'contains';
					params['FILTER'+count+'_VALUE_TXT'] = filterValue;
					params['FILTER'+count+'_FIELD'] = that.filterColId;
					params['FILTER'+count+'_TYPE'] = that.filterColType;
					params['IS_FILTER_FORM'] = true;
					params['LOOKUP_FLAG']= 'true';
					params['IS_LOOK_UP']= 'true';//UAT_7749
				}
				Ext.apply(params, that.additionalFiltersParams);
				/*//CBXQ113U05_UPD Starts
				if(Ext.isEmpty(that.widgetFunctionCode)){
					// CBXQ113U05_UPD1 Starts
					params['PRODUCT_NAME']=that.additionalFiltersParams.PRODUCT_NAME;
					params['INPUT_SUB_PRODUCT']=that.additionalFiltersParams.INPUT_SUB_PRODUCT;
				// CBXQ113U05_UPD1 Ends
					params['INPUT_FUNCTION_CODE']=that.additionalFiltersParams.INPUT_FUNCTION_CODE;
				}*/
				//CBXQ113U05_UPD Ends
				return params;
			}
		};
		that.lookupMetadata = transmetadata;
		that.lookupMetadata.reqparamshandler= 
					that.lookupMetadata.reqparamshandler.createSequence(transmetadata.reqparamshandler, that);
		that.lookupMetadata.lookupId = that.widgetId;
		that.lookupMetadata.widgetId = that.widgetId;
		that.lookupMetadata.rowdbclickhandler = that.callBackHandler;
		that.lookupMetadata.multiSelectHandler = that.multislelectHandler;//CBXARXQ313U02
		that.lookupMetadata.scope = that;
		that.lookupMetadata.showselectedRowsinLookUp = that.getshowselectedRowsinLookUp();//Fix for multiselect.
		iportal.formview.showLookupWin(that.lookupMetadata,false,response);
	}
});

Ext.reg('cbx-editablelookup', cbx.formElement.EditableLookUp);
/**
 * This class is an extension of Ext.form.CheckboxGroup class
 */
cbx.formElement.checkboxgroup = function(config) {
	this.plainLabel = config.plainLbl;
	this.fieldLabel = config.displayNmKey;
	this.hidden = config.visibleInd === 'Y' ? false : true;
	//CHG_MULTIFORM Starts
	if(!Ext.isEmpty(config.multiInd) && config.multiInd==true && !Ext.isEmpty(config.index)){
		this.values = config.model.getModelData()[config.multiFormId][config.itemId][config.index] || '';
	}else{
		this.values = config.model.getModelData()[config.itemId] || '';	
	}
	//CHG_MULTIFORM Ends
	this.required = config.requiredInd;
	this.readOnly = config.readOnlyInd === 'Y' ? true : false;
	this.conditional = config.conditionalInd;
	this.name = config.itemId;
	this.rawKeys = config.rawKeys;
	this.rawValues = config.rawValues;
	// CHG_FF_ENHQ2. Starts
	/**
	 * This change has been made to bring the functionality of preIntialize
	 * configuration of a checkbox inside a checkbox group.
	 * 
	 * <PRE>
	 * Example usage: 
	 * 	'REPORT_SEND_MAIL' : 
	 * 		{ 
	 * 		itemType : 'CHECKBOX_GROUP',
	 * 			preConfig : [ 
	 * 				{ 
	 * 				'INBOX' : 
	 * 							{ 
	 * 							disabled : true,
	 * 							checked : true 
	 * 							} 
	 * 				} 
	 * 			] 
	 * 	}
	 * 
	 * </PRE>
	 */
	this.preConfig=config.preConfig || ''; 
	// CHG_FF_ENHQ2 Ends
	cbx.formElement.checkboxgroup.superclass.constructor.call(this, config);
};
Ext
		.extend(
				cbx.formElement.checkboxgroup,
				Ext.form.CheckboxGroup,
				{
					blankText : CRB.getFWBundle() && CRB.getFWBundle()['ERROR_ATLEAST_ONE_SELECT'] ? CRB.getFWBundle()['addText']:'ERROR_ATLEAST_ONE_SELECT', // CHG_FF_ENH
					defaultType : 'checkbox',
					groupCls : 'x-form-check-group',
					required : 'N',
					conditional : 'N',
					valuesArray : [],
					labelStyle:'padding-left:0px !important',
					elementStyle:'padding-left:0px !important',
					plainLabel : '',
					fieldLabel : '',
					initComponent : function() {
						
						this.groupCls = this.groupCls+' '+this.itemId;
						this.on('hide',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'N']));
						this.on('show',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'Y']));
						//CBXFW_DIT_77 ends
						cbx.formElement.checkboxgroup.superclass.initComponent
								.call(this, arguments);
						var totalColumns = !Ext.isEmpty(this.totalColumns) ? this.totalColumns
								: 1;
						var bundle;
						var commonbundle = CRB.getFWBundle();
						// To get the bundle key reference
						bundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));
						/**
						 * If the plainLabel attribute is not null ,component's
						 * field label will be the plain-label else the label
						 * associated with bundle keys will be referred to get
						 * the field label.
						 */
						if (!Ext.isEmpty(this.plainLabel)) {
							this.fieldLabel = this.plainLabel;
						} 
						// CHG003 Starts
						else if (Ext.isEmpty(this.fieldLabel)) {
							this.fieldLabel = '';
						}
						// CHG003 Ends
						else {
							this.fieldLabel = bundle['LBL_' + this.fieldLabel];
						}
						/**
						 * If the conditional attribute is Y the components
						 * field label will be field label associated with two
						 * stars
						 */
						if (this.conditional === 'Y') {
							this.blankText = String.format(
									commonbundle['ERR_MANDATORY'],
									this.fieldLabel);
							if (Ext.isEmpty(this.fieldLabel)) {
								this.fieldLabel = '?'
										+ this.fieldLabel
										+ '?'
										+ '<span class = \'cbx-mandatory-fx\'">**</span>';// CHG001-CSS
																							// changes
							} else {
								this.fieldLabel = this.fieldLabel
										+ '<span class = \'cbx-mandatory-fx\'">**</span>';// CHG001-CSS
																							// changes
							}
						}
						/**
						 * If the required attribute is Y,components field label
						 * will be field label associated with mandatory star
						 * and the field will not allow blank values.
						 */
						else if (this.required === 'Y') {
							this.allowBlank = false;
							if (Ext.isEmpty(this.fieldLabel)) {
								this.fieldLabel = '?'
										+ this.fieldLabel
										+ '?'
										+ '<span class = \'mandatory\'">*</span>';
							} else {
								this.fieldLabel = this.fieldLabel
										+ '<span class = \'mandatory\'">*</span>';
							}
						} else {
							this.blankText = String.format(
									commonbundle['ERR_MANDATORY'],
									this.fieldLabel);
							if (Ext.isEmpty(this.fieldLabel)) {
								// CHG003 Starts
								this.fieldLabel = 
									 this.fieldLabel										
									+ '<span class = \'non_mandatory\'"></span>';	
								// CHG003 Ends
							} else {
								this.fieldLabel = this.fieldLabel
										+ '<span class = \'non_mandatory\'"></span>';
							}
						}
						this.anchor = (this.anchor == undefined) ? ''
								: this.anchor;
						// Parsing the default values in to array format
						this.parseRawData(this.values);
						// Create items dynamically based on rawKeys and
						// rawValues
						this.items = this.createItems();
						this.columns = parseInt(totalColumns) || totalColumns; // CBX_176
						this.labelSeparator = '';// CHG001
						/**
						 * On change event invokes the syncModelData method
						 * which in turn updates the model with name and current
						 * value
						 */
						this.on('change', this.syncModelData);
						if (this.values) {
							var itemExits = this.getItemExists(this.items);
							if (itemExits !== 'Exists') {
								this.error = true;
							}
						}
					},
					// CHG_FF_ENHQ2 Starts
					/**
					 * The following methods has been added to set the value of
					 * a check box group properly after intializing
					 */
					/**
					 * Overriding the the setValue method in order to message
					 * the data as needed by the checkbox group and also brought
					 * the orignal setValue code under setValues
					 */
					setValue: function(){
						var values=[], valueObj={};
				    	if(Ext.isArray(arguments[0])){
				    		values=arguments[0];
				    	}else{
				    		values=arguments;
				    	}
				    	for (var i=0; i<values.length; i++){
				    		
				    		if(Ext.isEmpty(values[i]))
				    			valueObj[this.valuesArray[i]]=false;
				    		else	
				    			valueObj[values[i]]=true;
				    	}
				    	this.setValues(valueObj);
					},
				    setValues: function(){
				        if(this.rendered){
				            this.onSetValue.apply(this, arguments);
				        }else{
				            this.buffered = true;
				            this.value = arguments;
				        }
				        return this;
				    },	
				    // CHG_FF_ENHQ2 Ends
					getItemExists : function(items) {
						var out = null;
						var that = this;
						if (!Ext.isEmpty(items)) {
							Ext.each(items, function(item) {
								if (that.valuesArray
										.contains(item['inputValue'])) {
									out = 'Exists';
									return false;
								}
							});
						}
						return out;
					},
					// Add the rawValues to array
					parseRawData : function(val) {
						var sArray = [];
						if (val != "" && val != null) {
							val = val + '';
							var splitValue = val.split(',');
							for ( var i = 0; i < splitValue.length; i++) {
								sArray.push(splitValue[i]);
							}
						}
						this.valuesArray = sArray;
					},
					// Getting the rawValues array
					getValuesArray : function() {
						return this.valuesArray;
					},
					/**
					 * Create the items based on rawKeys and rawValues,check for
					 * the default values[Multiple Values for check box] exists
					 * in valuesArray and if exists the items will be checked.
					 * 
					 * @returns {Array}
					 */
					createItems : function() {
						var valArray = this.getValuesArray();
						var dataArray = [];
						if (this.rawKeys != null && this.rawValues != null) {
							for ( var i = 0; i < this.rawKeys.length; i++) {
								if (valArray.length > 0
										&& valArray.contains(this.rawValues[i])) {
									var formItems = {
										boxLabel : CRB.getBundle(cbx.jsutil.getBundleKey(this))['LBL_' + this.rawKeys[i]] || this.rawKeys[i],// CHG001
										inputValue : this.rawValues[i],
										// CHG_FF_ENHQ2 Starts
										/**
										 * The change has been done to set the
										 * value of check box properly
										 */
										name: this.rawValues[i],
										// CHG_FF_ENHQ2 Ends
										checked : true
									};
									// CHG_FF_ENHQ2 Starts.
									/**
									 * The following changes has been done to
									 * apply the pre intialize configuration for
									 * a check box group.
									 */
									if(this.preConfig!=='' && this.preConfig.length>0 && this.preConfig[0][this.rawValues[i]]){
										Ext.apply(formItems,this.preConfig[0][this.rawValues[i]]);
									}
									// CHG_FF_ENHQ2 Ends
									dataArray.push(formItems);
								} else {
									var formItems = {
										boxLabel : CRB.getBundle(cbx.jsutil.getBundleKey(this))['LBL_' + this.rawKeys[i]] || this.rawKeys[i],// CHG001
										// CHG_FF_ENHQ2 Starts
										/**
										 * The change has been done to set the
										 * value of check box properly
										 */
										name: this.rawValues[i],
										// CHG_FF_ENHQ2 Ends
										inputValue : this.rawValues[i]
									};
									// CHG_FF_ENHQ2 Starts.
									/**
									 * The following changes has been done to
									 * apply the pre intialize configuration for
									 * a check box group.
									 */
									if(this.preConfig!=='' && this.preConfig.length>0 && this.preConfig[0][this.rawValues[i]]){
										Ext.apply(formItems,this.preConfig[0][this.rawValues[i]]);
									}
									// CHG_FF_ENHQ2 Ends
									dataArray.push(formItems);
								}
							}
						}
						return dataArray;
					},
					/**
					 * Method updates the modal with fieldname and current value
					 */
					syncModelData : function(value) {
						//CHG_MULTIFORM Starts
						if(!Ext.isEmpty(this.multiInd) && this.multiInd==true && !Ext.isEmpty(this.index)){
							if (Ext.isEmpty(this.getValue())) {
								this.model.updateValue(this.name, '',undefined,this.index,this.multiFormId);
							} else {
								this.model.updateValue(this.name, this.getValue(),undefined,this.index,this.multiFormId);
							}
						}else{
							if (Ext.isEmpty(this.getValue())) {
								this.model.updateValue(this.name, '');
							} else {
								this.model.updateValue(this.name, this.getValue());
							}
					this.updateScreenViewData(this);//CBXFW_DIT_77
						}
						//CHG_MULTIFORM Ends
					}
					//CBXFW_DIT_77 starts
					,getDisplayValue : function(){
				        var out = [];
				        this.eachItem(function(item){
				            if(item.checked){
				                out.push(item.boxLabel);
				            }
				        });
				        return out;
				    },
					getScreenViewData:function()
					{
						return this.getDisplayValue();
					},
					//CBXFW_DIT_77 ends
					afterRender : function() {
					         this.updateScreenViewData(this);//CBXFW_DIT_77
						// Display the error indicator on default value doesn't
						// exists.
						var that = this;
						if (this.error) {
							this.error = false;
							//CHG TRADE POC STARTS
							if(this.handleError){
							this.markInvalid(CRB.getFWBundle() && CRB.getFWBundle()['ERR_VALID_SELECT'] ? CRB.getFWBundle()['ERR_VALID_SELECT']:'ERR_VALID_SELECT');// CHG_FF_ENH
							}
							//CHG TRADE POC Ends
						}
						// Display the error indicator on null values if the
						// group is mandatory.
						/*
						 * if (this.required === 'Y') { if (this.values === "" ||
						 * this.values === null || this.valuesArray.length ===
						 * 0) { this.markInvalid(this.blankText); } }
						 */
						cbx.formElement.checkboxgroup.superclass.afterRender
								.call(this);
						// CBXR12Q413F12 starts
						/*
						 * var group = this; // Fire the change event on
						 * selecting the items[Multi // value selection]
						 * this.items.each(function(field) { field.on("check",
						 * function(self, checked) { if (checked) {
						 * group.fireEvent('change', group, self .getValue()); }
						 * else { if (Ext.isEmpty(group.getValue())) {
						 * that.syncModelData('none'); } }
						 * 
						 * }); });
						 */
						// CBXR12Q413F12 ends

					}

				});
Ext.reg('cbx-checkboxgroup', cbx.formElement.checkboxgroup);

/**
 * This class is an extension of Ext.form.RadioGroup class
 */
cbx.formElement.radiogrp = function(config) {
	this.plainLabel = config.plainLbl;
	this.fieldLabel = config.displayNmKey;
	this.hidden = config.visibleInd === 'Y' ? false : true;
	//CHG_MULTIFORM Starts
	if(!Ext.isEmpty(config.multiInd) && config.multiInd==true && !Ext.isEmpty(config.index)){
		this.value = config.model.getModelData()[config.multiFormId][config.itemId][config.index] || '';
	}else{
		this.value = config.model.getModelData()[config.itemId] || '';	
	}
	//CHG_MULTIFORM Ends
	this.required = config.requiredInd;
	this.readOnly = config.readOnlyInd === 'Y' ? true : false;
	this.conditional = config.conditionalInd;
	this.name = config.itemId;
	this.rawKeys = config.rawKeys;
	this.rawValues = config.rawValues;
	cbx.formElement.radiogrp.superclass.constructor.call(this, config);
};
Ext
		.extend(
				cbx.formElement.radiogrp,
				Ext.form.RadioGroup,
				{
					blankText : CRB.getFWBundle() && CRB.getFWBundle()['ERROR_ATLEAST_ONE_SELECT'] ? CRB.getFWBundle()['ERROR_ATLEAST_ONE_SELECT']:'ERROR_ATLEAST_ONE_SELECT', // CHG004
					defaultType : 'radio',
					groupCls : 'x-form-radio-group',
					required : 'N',
					conditional : 'N',
					plainLabel : '',
					fieldLabel : '',
					labelStyle:'padding-left:0px !important',
					elementStyle:'padding-left:0px !important',
					initComponent : function() {
						
						this.groupCls = this.groupCls+' '+this.itemId;
						this.on('hide',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'N']));
						this.on('show',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'Y']));
						//CBXFW_DIT_77 ends
						cbx.formElement.radiogrp.superclass.initComponent.call(
								this, arguments);
						var totalColumns = !Ext.isEmpty(this.totalColumns) ? this.totalColumns
								: 1;
						var bundle;
						var commonbundle = CRB.getFWBundle();
						// To get the bundle key reference
						bundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));
						/**
						 * If the plainLabel attribute is not null ,component's
						 * field label will be the plain-label else the label
						 * associated with bundle keys will be referred to get
						 * the field label.
						 */
						if (!Ext.isEmpty(this.plainLabel)) {
							this.fieldLabel = this.plainLabel;
						}
						// CHG003 Starts
						else if (Ext.isEmpty(this.fieldLabel)) {
								this.fieldLabel = '';
						}
						// CHG003 Ends
						else {
							this.fieldLabel = bundle['LBL_' + this.fieldLabel];
						}
						/**
						 * If the conditional attribute is Y the components
						 * field label will be field label associated with two
						 * stars
						 */
						if (this.conditional === 'Y') {
							if (Ext.isEmpty(this.fieldLabel)) {
								this.fieldLabel = '?'
										+ this.fieldLabel
										+ '?'
										+ '<span class = \'cbx-mandatory-fx\'">**</span>';// CHG001-CSS
																							// changes
							} else {
								this.fieldLabel = this.fieldLabel
										+ '<span class = \'cbx-mandatory-fx\'">**</span>';// CHG001-CSS
																							// changes
							}
						}
						/**
						 * If the required attribute is Y,components field label
						 * will be field label associated with mandatory star
						 * and the field will not allow blank values.
						 */
						else if (this.required === 'Y') {
							this.allowBlank = false;
							if (Ext.isEmpty(this.fieldLabel)) {
								this.fieldLabel = '?'
										+ this.fieldLabel
										+ '?'
										+ '<span class = \'mandatory\'">*</span>';
							} else {
								this.fieldLabel = this.fieldLabel
										+ '<span class = \'mandatory\'">*</span>';
							}
						} else {
							this.blankText = String.format(
									commonbundle['ERR_MANDATORY'],
									this.fieldLabel);
							if (Ext.isEmpty(this.fieldLabel)) {
								// CHG003 Starts
								this.fieldLabel = 
									 this.fieldLabel										
									+ '<span class = \'non_mandatory\'"></span>';	
								// CHG003 Ends
							} else {
								this.fieldLabel = this.fieldLabel
										+ '<span class = \'non_mandatory\'"></span>';
							}
						}
						this.anchor = (this.anchor == undefined) ? ''
								: this.anchor;
						// Create items dynamically based on rawKeys and
						// rawValues
						this.items = this.createItems();
						this.columns = parseInt(totalColumns) || totalColumns; // CBX_176
						this.labelSeparator = '';// CHG001
						/**
						 * On change event invokes the syncModelData method
						 * which in turn updates the model with name and current
						 * value
						 */
						this.on('change', this.syncModelData);
						if (this.value) {
							var itemExits = this.getItemExists(this.items);
							if (itemExits !== 'Exists') {
								this.error = true;
							}
						}
					},
					getValue : function() {
						var out = null;
						this.eachItem(function(item) {
							if (item.checked) {
								out = item.inputValue;
								return false;
							}
						});
						return out;
					},
					//CBXFW_DIT_77 starts
					getDisplayValue : function() {
						var out = null;
						this.eachItem(function(item) {
							if (item.checked) {
								out = item.boxLabel;
								return false;
							}
						});
						return out;
					},
				  	/**
					 * Updates the screen data in the ScreenView
					 */
					getScreenViewData:function()
					{
						return this.getDisplayValue();
					},
					//CBXFW_DIT_77 ends
					/**
					 * After item creation check for the default values exists
					 * and if so the item will be selected Supports single
					 * selection
					 * 
					 * @param items
					 * @returns String
					 */
					getItemExists : function(items) {
						var out = null;
						var that = this;
						if (!Ext.isEmpty(items)) {
							Ext.each(items, function(item) {
								if (that.value === item['inputValue']) {
									out = 'Exists';
									return false;
								}
							});
						}
						return out;
					},
					/**
					 * Create the items based on rawKeys and rawValues
					 * 
					 * @returns {Array}
					 */
					createItems : function() {
						var dataArray = [];
						if (this.rawKeys != null && this.rawValues != null) {
							for ( var i = 0; i < this.rawKeys.length; i++) {
							//CHG_MULTIFORM Starts
								var n=this.name;
								if(!Ext.isEmpty(this.index)){
									n=this.name+'$'+this.index;
								}
								//CHG_MULTIFORM Ends
								var formItems = {
									boxLabel : CRB.getBundle(cbx.jsutil.getBundleKey(this))['LBL_' + this.rawKeys[i]] || this.rawKeys[i],// CHG001
									name : n,//CHG_MULTIFORM Starts
									value : this.rawValues[i],
									inputValue : this.rawValues[i]
								};
								dataArray.push(formItems);
							}
						}
						return dataArray;
					},
					/**
					 * Method updates the modal with fieldname and current value
					 */
					syncModelData : function() {
						//CHG_MULTIFORM Starts
						if(!Ext.isEmpty(this.multiInd) && this.multiInd==true && !Ext.isEmpty(this.index)){
							this.model.updateValue(this.name, this.getValue(),undefined,this.index,this.multiFormId);
						}else{
							this.model.updateValue(this.name, this.getValue());	
						}
						//CHG_MULTIFORM Ends
						this.updateScreenViewData(this);//CBXFW_DIT_77
					},
					afterRender : function() {
						this.updateScreenViewData(this);//CBXFW_DIT_77
						// Display the error indicator on default value doesn't
						// exists.
						if (this.error) {
							this.error = false;
							this.markInvalid(CRB.getFWBundle() && CRB.getFWBundle()['ERR_VALID_SELECT'] ? CRB.getFWBundle()['ERR_VALID_SELECT']:'ERR_VALID_SELECT'); // CHG_FF_ENH
							// return false;
						}
						// Display the error indicator on null values if the
						// group is mandatory.
						/*
						 * if (this.required === 'Y') { if (this.value == "" ||
						 * this.value == null) {
						 * this.markInvalid(this.blankText); // return false; } }
						 */
						cbx.formElement.radiogrp.superclass.afterRender.apply(
								this, arguments);
					}
				});
Ext.reg('cbx-radiogroup', cbx.formElement.radiogrp);
/**
 * This class is an extension of Ext.form.TextField class
 */
cbx.formElement.radioGroupStaticField = function(config) {
	this.plainLabel = config.plainLbl;
	this.fieldLabel = config.displayNmKey;
	//CHG_MULTIFORM Starts
	if(!Ext.isEmpty(config.multiInd) && config.multiInd==true && !Ext.isEmpty(config.index)){
		this.value = config.model.getModelData()[config.multiFormId][config.itemId][config.index] || "--";
	}else{
		this.value = config.model.getModelData()[config.itemId] || "--";	
	}
	//CHG_MULTIFORM Ends
	this.name = config.itemId;
	this.required = config.requiredInd;
	this.conditional = config.conditionalInd;
	this.hidden = config.visibleInd === 'Y' ? false : true;
	cbx.formElement.radioGroupStaticField.superclass.constructor.call(this,
			config);
};
Ext.extend(cbx.formElement.radioGroupStaticField, Ext.form.TextField, {
	/**
	 * @cfg {Object} bundleKey ,key used by resource to lookup bundle(defaults
	 *      to '')
	 */
	bundleKey : '',
	required : 'N',
	conditional : 'N',
	plainLabel : '',
	fieldLabel : '',
	initComponent : function() {
		//CBXFW_DIT_77 starts
		this.on('hide',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'N']));
		this.on('show',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'Y']));
		//CBXFW_DIT_77 ends
		this.allowBlank = true;
		this.maxLength = undefined;
		this.minLength = undefined;
		cbx.formElement.radioGroupStaticField.superclass.initComponent.apply(
				this, arguments);
		var bundle;
		var commonbundle = CRB.getFWBundle();
		// To get the bundle key reference
		bundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));
		/**
		 * If the plainLabel attribute is not null ,component's field label will
		 * be the plain-label else the label associated with bundle keys will be
		 * referred to get the field label.
		 */
		if (!Ext.isEmpty(this.plainLabel)) {
			this.fieldLabel = this.plainLabel;
		} else {
			this.fieldLabel = bundle['LBL_' + this.fieldLabel];
		}
		/**
		 * If the conditional attribute is Y the components field label will be
		 * field label associated with two stars
		 */
		if (this.conditional === 'Y') {
			if (Ext.isEmpty(this.fieldLabel)) {
				//CHG_TRADE_POC Starts
				this.fieldLabel = '?' + this.fieldLabel + '?';
				//CHG_TRADE_POC Ends
			} else {
				//CHG_TRADE_POC Starts
				this.fieldLabel = this.fieldLabel;
				//CHG_TRADE_POC Ends
			}
		}
		/**
		 * If the required attribute is Y,components field label will be field
		 * label associated with mandatory star and the field will not allow
		 * blank values.
		 */
		else if (this.required === 'Y') {
			if (Ext.isEmpty(this.fieldLabel)) {
				//CHG_TRADE_POC Starts
				this.fieldLabel = '?' + this.fieldLabel + '?';
				//CHG_TRADE_POC Ends
			} else {
				//CHG_TRADE_POC Starts
				this.fieldLabel = this.fieldLabel;
				//CHG_TRADE_POC Ends
			}
		} else {
			if (Ext.isEmpty(this.fieldLabel)) {
				//CHG_TRADE_POC Starts
				this.fieldLabel = this.fieldLabel;
				//CHG_TRADE_POC Ends
			} else {
				//CHG_TRADE_POC Starts
				this.fieldLabel = this.fieldLabel;
				//CHG_TRADE_POC Ends
			}
		}
		var value=this.model.getValue(this.name) || '--'; //CHG_SCF_PO_004
		this.setValue(value); //CHG_SCF_PO_004
		this.readOnly = true;
		this.labelSeparator = '';
		this.style = 'border:none;background: transparent;padding-left:0;';
		this.anchor = (this.anchor == undefined) ? '' : this.anchor;
		this.tabIndex = 99999992; //CBXQ313F37
	},
	/**
	 * Method checks for the default item value exists.
	 */
	getItemValue : function(value) {
		var out = "";
		if (this.rawKeys !== null && this.rawValues !== null) {
			for ( var i = 0; i < this.rawKeys.length; i++) {
				if (this.rawValues[i] === value) {
					out = CRB.getBundle(cbx.jsutil.getBundleKey(this))['LBL_' + this.rawKeys[i]] || this.rawKeys[i];// CHG001
					return out;
				}
			}
		}
		return out;
	},
	//CHG_SCF_PO_004 Starts
	setValue : function(val) {
		var value=this.getItemValue(val) || val;
		if(Ext.isEmpty(value)){
			value='--';
		}
		cbx.formElement.radioGroupStaticField.superclass.setValue.call(this, value);
		this.updateScreenViewData(this);
	}
	//CBXFW_DIT_77 starts
	,getScreenViewData:function()
	{
		return this.getValue();
	},
	afterRender:function(){
		this.updateScreenViewData(this);
		cbx.formElement.radioGroupStaticField.superclass.afterRender.apply(this,
				arguments);
		this.updateScreenViewData(this);
	}
	//CBXFW_DIT_77 ends
});
Ext.reg('cbx-radiogroupstaticfield', cbx.formElement.radioGroupStaticField);
cbx.formElement.StaticField = function(config) {
	this.plainLabel = config.plainLbl;
	this.fieldLabel = config.displayNmKey;
	//CHG_MULTIFORM Starts
	if(!Ext.isEmpty(config.multiInd)&& config.multiInd==true && !Ext.isEmpty(config.index)){
		this.value = config.model.getModelData()[config.multiFormId][config.itemId][config.index]|| "--";
	}else{
		this.value = config.model.getModelData()[config.itemId] || "--";	
	}
	//CHG_MULTIFORM Ends
	this.name = config.itemId;
	this.required = config.requiredInd;
	this.conditional = config.conditionalInd;
	this.hidden = config.visibleInd === 'Y' ? false : true;
	cbx.formElement.StaticField.superclass.constructor.call(this, config);
};
Ext.extend(cbx.formElement.StaticField, Ext.form.TextField, {
	/**
	 * @cfg {Object} bundleKey ,key used by resource to lookup bundle(defaults
	 *      to '')
	 */
	bundleKey : '',
	initComponent : function() {
		//CBXFW_DIT_77 starts
		this.on('hide',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'N']));
		this.on('show',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'Y']));
		//CBXFW_DIT_77 ends
		this.allowBlank = true;
		this.maxLength = undefined;
		this.minLength = undefined;
		cbx.formElement.StaticField.superclass.initComponent.apply(this,
				arguments);
		var bundle;
		var commonbundle = CRB.getFWBundle();
		// To get the bundle key reference
		bundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));
		/**
		 * If the plainLabel attribute is not null ,component's field label will
		 * be the plain-label else the label associated with bundle keys will be
		 * referred to get the field label.
		 */
		if (!Ext.isEmpty(this.plainLabel)) {
			this.fieldLabel = this.plainLabel;
		} else {
			this.fieldLabel = bundle['LBL_' + this.fieldLabel];
		}
		/**
		 * If the conditional attribute is Y the components field label will be
		 * field label associated with two stars
		 */
		if (this.conditional === 'Y') {
			if (Ext.isEmpty(this.fieldLabel)) {
				//CHG_TRADE_POC Starts
				this.fieldLabel = '?' + this.fieldLabel + '?';
				//CHG_TRADE_POC Ends
			} else {
				//CHG_TRADE_POC Starts
				this.fieldLabel = this.fieldLabel;
				//CHG_TRADE_POC Ends
			}
		}
		/**
		 * If the required attribute is Y,components field label will be field
		 * label associated with mandatory star and the field will not allow
		 * blank values.
		 */
		else if (this.required === 'Y') {
			if (Ext.isEmpty(this.fieldLabel)) {
				//CHG_TRADE_POC Starts
				this.fieldLabel = '?' + this.fieldLabel + '?';
				//CHG_TRADE_POC Ends
			} else {
				//CHG_TRADE_POC Starts
				this.fieldLabel = this.fieldLabel;
				//CHG_TRADE_POC Ends
			}
		} else {
			if (Ext.isEmpty(this.fieldLabel)) {
				this.fieldLabel = '?' + this.fieldLabel + '?'
						+ '<span class = \'non_mandatory\'"></span>';
			} else {
				this.fieldLabel = this.fieldLabel
						+ '<span class = \'non_mandatory\'"></span>';
			}
		}
		this.readOnly = true;
		this.labelSeparator = '';
		this.style = 'border:none;background: transparent;';
		this.anchor = (this.anchor == undefined) ? '' : this.anchor;
		this.tabIndex = 99999993; //CBXQ313F37
	},
	//CBXFW_DIT_77 starts
	setValue : function(v) {
			var value=v;
			if(Ext.isEmpty(value) || value=='--'){
				v='--';
				this.model.updateField(this.name, '');  // added for CBXQ113F10-UPD
			}
			//this.model.updateField(this.name, '');	// commented for CBXQ113F10-UPD
			cbx.formElement.StaticField.superclass.setValue.call(this, v);
			this.updateScreenViewData(this);
			if(this.el){
			if(this.getValue().length+2>Math.floor(this.el.getWidth()/iportal.preferences.getAverageFontWidth())){
				new Ext.ux.ClickToolTip({ 
					title: '',
					id: '',
					target: this.el,
					anchor: 'bottom',
					html: this.getValue(),					
					trackMouse: true
					});
				}			
			}
			
			}
	
	,getScreenViewData:function()
	{
		return this.getValue();
	},
	afterRender:function(){
		this.updateScreenViewData(this);
		cbx.formElement.StaticField.superclass.afterRender.apply(this,
				arguments);
	}
	//CBXFW_DIT_77 ends
});
//Ext.reg('cbx-staticfield', cbx.formElement.StaticField);
/**
 * This class is an extension of Ext.form.TextArea class
 */
cbx.formElement.StaticTextArea = function(config) {
	this.plainLabel = config.plainLbl;
	this.fieldLabel = config.displayNmKey;
	//CHG_MULTIFORM Starts
	if(!Ext.isEmpty(config.multiInd) && config.multiInd==true &&  !Ext.isEmpty(config.index)){
		this.value = config.model.getModelData()[config.formId][config.itemId][config.index] || "--";
	}else{
		this.value = config.model.getModelData()[config.itemId] || "--";	
	}
	//CHG_MULTIFORM Ends
	this.name = config.itemId;
	this.required = config.requiredInd;
	this.conditional = config.conditionalInd;
	this.hidden = config.visibleInd === 'Y' ? false : true;
	cbx.formElement.StaticTextArea.superclass.constructor.call(this, config);
};
Ext.extend(cbx.formElement.StaticTextArea, Ext.form.TextArea, {
	/**
	 * @cfg {Object} bundleKey ,key used by resource to lookup bundle(defaults
	 *      to '')
	 */
	bundleKey : '',
	grow:true,
	cls : 'canvas-statictextarea',
	initComponent : function() {
		//CBXFW_DIT_77 starts
		this.on('hide',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'N']));
		this.on('show',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'Y']));
		//CBXFW_DIT_77 ends
		this.allowBlank = true;
		this.maxLength = undefined;
		this.minLength = undefined;
		cbx.formElement.StaticTextArea.superclass.initComponent.apply(this,
				arguments);
		var bundle;
		var commonbundle = CRB.getFWBundle();
		// To get the bundle key reference
		bundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));
		
		var maxNumOfLinesAsParam=4;
		// this.maxNumLines=9;
		if(!Ext.isEmpty(this.maxNumLines)){
			/*
			 * Condition to check the value of maxNumLines exceeds 10 or not. If
			 * it exceeds 10,it will discard the value and takes 10 as default
			 * value
			 */
			if(this.maxNumLines>10){
				maxNumOfLinesAsParam=10;
			}
			else if(this.maxNumLines>0 && this.maxNumLines<=10){
				maxNumOfLinesAsParam=this.maxNumLines;
			}
			// Set the height based on the utility method.
		}
			/**
			If the eveloper wants to configure the height of the text area
			explicitly
			*/
			if(this.ignoreMaxLines){
				//this.newMaxLines>this.maxNumLines
				if(!Ext.isEmpty(this.newMaxLines) && Ext.isNumber(this.newMaxLines)){
					maxNumOfLinesAsParam=this.newMaxLines;	
				}				
			}
		this.height=cbx.jsutil.getTextAreaHeight(maxNumOfLinesAsParam);
		
		this.growMax = this.height;
		// Check the validation based on maximum number of lines and maximum
		// number of characters per line
		if(!Ext.isEmpty(this.maxNumLines) && !Ext.isEmpty(this.maxCharsPerLine)){
			//this.vtype='maxChars';	
			
			/**
			 * If maximum number of lines and maximum characters per line has
			 * been provided the max lenth should be counted by multiplicationg.
			 * 
			 */
			this.maxLength=this.maxNumLines*this.maxCharsPerLine;
		}	
		if (Ext.isEmpty(this.maxLength)) {
			this.maxLength = undefined;
		}
		if (Ext.isEmpty(this.minLength)) {
			this.minLength = undefined;
		}
        		
        		// Check the validation based on maximum number of lines and
				// maximum number of characters per line
        		/*if(!Ext.isEmpty(this.maxNumLines) && !Ext.isEmpty(this.maxCharsPerLine)){
        			this.vtype='maxChars';
        			this.maxLength=this.maxNumLines*this.maxCharsPerLine;
        		}*/
        		
        		if(this.maxLength==0){
        			this.maxLength = undefined;
        		}

		/**
		 * If the plainLabel attribute is not null ,component's field label will
		 * be the plain-label else the label associated with bundle keys will be
		 * referred to get the field label.
		 */
		if (!Ext.isEmpty(this.plainLabel)) {
			this.fieldLabel = this.plainLabel;
		} else {
			this.fieldLabel = bundle['LBL_' + this.fieldLabel];
		}
		/**
		 * If the conditional attribute is Y the components field label will be
		 * field label associated with two stars
		 */
		if (this.conditional === 'Y') {
			if (Ext.isEmpty(this.fieldLabel)) {
				//CHG_TRADE_POC Starts
				this.fieldLabel = '?' + this.fieldLabel + '?';
				//CHG_TRADE_POC Ends
			} else {
				//CHG_TRADE_POC Starts
				this.fieldLabel = this.fieldLabel;
				//CHG_TRADE_POC Ends
			}
		}
		/**
		 * If the required attribute is Y,components field label will be field
		 * label associated with mandatory star and the field will not allow
		 * blank values.
		 */
		else if (this.required === 'Y') {
			if (Ext.isEmpty(this.fieldLabel)) {
				//CHG_TRADE_POC Starts
				this.fieldLabel = '?' + this.fieldLabel + '?';
				//CHG_TRADE_POC Ends
			} else {
				//CHG_TRADE_POC Starts
				this.fieldLabel = this.fieldLabel;
				//CHG_TRADE_POC Ends
			}
		} else {
			if (Ext.isEmpty(this.fieldLabel)) {
				this.fieldLabel = '?' + this.fieldLabel + '?'
						+ '<span class = \'non_mandatory\'"></span>';
			} else {
				this.fieldLabel = this.fieldLabel
						+ '<span class = \'non_mandatory\'"></span>';
			}
		}
		this.readOnly = true;
		this.labelSeparator = '';
		this.style = 'border:none;background: transparent;';//CHG_MAX_LENGTH
		this.anchor = (this.anchor == undefined) ? '' : this.anchor;
		this.tabIndex = 99999994; //CBXQ313F37
	},
	/* CBXQ113F10 starts */
	setValue : function(v) {
			var value=v;
			if(Ext.isEmpty(value) || value=='--'){
				v='--';
				this.model.updateField(this.name, '');  // added for CBXQ113F10-UPD
			}
			//this.model.updateField(this.name, '');	// commented for CBXQ113F10-UPD
			cbx.formElement.StaticTextArea.superclass.setValue.call(this, v);
			this.updateScreenViewData(this); //CBXFW_DIT_77 
	}
	/* CBXQ113F10 ends */
	, //CBXFW_DIT_77 starts
	/**
	 * Updates the screen data in the ScreenView
	 */
	getScreenViewData:function()
	{
		return this.getValue();
	},
	afterRender:function(){		
		this.updateScreenViewData(this); //CBXFW_DIT_77 
		cbx.formElement.StaticTextArea.superclass.afterRender.call(this);
		var that=this;
		setTimeout(function(){
			that.setValue(that.value);
		},100);
	},
	validate : function ()
	{
		var v = this.getRawValue();
		if (this.respectNewLineChar == undefined || Ext.isEmpty(this.respectNewLineChar)
					&& this.respectNewLineChar == '')
		{
			if (!Ext.isEmpty(v))
			{
				v = v.replace(/(\r\n|\n|\r)/gm, "");
			}
		}
		if (this.disabled || this.validateValue(this.processValue(v)))
		{
			this.clearInvalid();
			return true;
		}
		return false;
	}
});
Ext.reg('cbx-statictextarea', cbx.formElement.StaticTextArea);
/**
 * This class is an extension of Ext.form.TextField class
 */
cbx.formElement.AmountField = function(config) {
	this.plainLabel = config.plainLbl;
	this.fieldLabel = config.displayNmKey;
	this.name = config.itemId;
	//CHG_MULTIFORM Starts
	if(!Ext.isEmpty(config.multiInd) && config.multiInd==true && !Ext.isEmpty(config.itemId)){
		this.value = config.model.getModelData()[config.multiFormId][config.itemId][config.index];
	}else{
		this.value = config.model.getModelData()[config.itemId];	
	}
	//CHG_MULTIFORM Ends
	this.required = config.requiredInd;

	this.currMode=config.appendCurrMode; //CBXQ2FW80	
	this.conditional = config.conditionalInd; // CBX_FW_Q112F_080
	this.maxLength = config.maxLength;
	this.readOnly = config.readOnlyInd === 'Y' ? true : false;
	this.hidden = config.visibleInd === 'Y' ? false : true;
	cbx.formElement.AmountField.superclass.constructor.call(this, config);
};
Ext
		.extend(
				cbx.formElement.AmountField,
				Ext.form.TextField,
				{
					/**
					 * @cfg {String/Object} required ,to specify whether this
					 *      field is mandatory (defaults to N)
					 */
					required : 'N',
					conditional : 'N',
					 maxLength : 'undefined', // CBX_176
					   // changed for dynamic amount values
					 integrallength : false, // CBX_176
					   // changed for dynamic amount values
					  decimallength : false, // CBX_176
					/**
					 * @cfg {Object} bundleKey ,key used by resource to lookup
					 *      bundle(defaults to '')
					 */
					bundleKey : '',
					// this will specify the number of sif=gnificant digits
					// after the decimal
					// point
					// for the amount.This will depends on currency and to be
					// provided by the
					// application. Defaults to 2
					signdigits : 2,
					plainLabel : '',
					plainValue : '',
					cls : 'textfield-width',
					// private
					initComponent : function() {
						this.triggerField = true;
						this.cls = this.cls+' '+this.itemId;
						this.on('hide',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'N']));
						this.on('show',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'Y']));
						//CBXFW_DIT_77 ends
						cbx.formElement.AmountField.superclass.initComponent
								.apply(this, arguments);
						var bundle;
						var commonbundle = CRB.getFWBundle();
						// To get the bundle key reference
						bundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));
						/**
						 * If the plainLabel attribute is not null ,component's
						 * field label will be the plain-label else the label
						 * associated with bundle keys will be referred to get
						 * the field label.
						 */
						if (!Ext.isEmpty(this.plainLabel)) {
							this.fieldLabel = this.plainLabel;
						} else {
							this.fieldLabel = bundle['LBL_' + this.fieldLabel];
						}
						// In portal allowed maximum length for an amount will
						// be 28 digits
						// before
						// decimal point and 5 points after like ,
						// xxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxx
						// CBX_176 Starts
						/*
						 * this.maxLength = 34; this.integrallength = 28;
						 * this.decimallength = 5;
						 */
												
						if(this.decimallength === 0){
							this.decimallength = 0;
						}else{
							this.decimallength = this.decimallength || this.calculateDecimalDigits();
						}
						if(!Ext.isEmpty(this.maxLength))
							this.integrallength = this.maxLength - this.decimallength;	
						if(this.integrallength && this.decimallength && Ext.isEmpty(this.maxLength)){
							this.maxLength = Number(this.decimallength) + Number(this.integrallength);
						}
						if(!Ext.isEmpty(this.maxLength))
							this.maxLength = Number(this.maxLength) + 1;
						else
							this.maxLength = undefined;
				
							// CBX_176 Ends
						if (bundle != null) {
							if (this.fieldLabel)
								this.plainLabel = this.fieldLabel;
							if (this.conditional === 'Y') {
								this.blankText = String.format(
										commonbundle['ERR_MANDATORY'],
										this.fieldLabel);
								this.fieldLabel = this.fieldLabel
										+ '<span class = \'cbx-mandatory-fx\'">**</span>';// CHG001-CSS
																							// changes
							} else if (this.required === 'Y') {
								this.blankText = String.format(
										commonbundle['ERR_MANDATORY'],
										this.fieldLabel);
								this.fieldLabel = this.fieldLabel
										+ '<span class = \'mandatory\'">*</span>';
								this.allowBlank = false;
							} else
								this.fieldLabel = this.fieldLabel
										+ '<span class = \'non_mandatory\'"></span>';
						} else {
							if (this.conditional === 'Y') {
								this.fieldLabel = this.fieldLabel
										+ '<span class = \'cbx-mandatory-fx\'">**</span>';// CHG001-CSS
																							// changes
							} else if (this.required === 'Y') {
								this.fieldLabel = this.fieldLabel
										+ '<span class = \'mandatory\'">*</span>';
								this.allowBlank = false;
							} else {
								this.fieldLabel = '' + this.fieldLabel + '';
							}
						}
						if (bundle != null) {
							// CBX 176 Starts
					this.maxLengthText = String
							.format(
									commonbundle['ERR_MAXLENGTH_EXCEED_AMOUNT'] || "",
									this.plainLabel,
									parseInt(this.integrallength)+parseInt(1),
									this.decimallength);
					// CBX 176 Ends
							//CHG_6644_01_Starts
				/*	this.maxLengthText = String
					.format(
							commonbundle['ERR_AMOUNT_MAXLENGTH_EXCEED_LIMIT'] || "",
							this.plainLabel);*/
							//CHG_6644_01_Ends
						}
						this.maskRe = /[0-9.,]/;
						this.anchor = (this.anchor == undefined) ? ''
								: this.anchor;
						this.labelSeparator = '';
						// CHG_FF_ENHQ2 Start
						/**
						 * listening to chnage event for amountfield to do set
						 * the value and update the model
						 */
						this.on('change', function(obj) {
							this.setValue(obj.getValue())
							this.syncModelData();							
						});
						/**
						 * Focus event will give the absolute value erected from delimeters and displayed in the amount field.
						 */	 
						this.on('focus', function(obj) { 
							var val =this.model.getModelData()[this.itemId];
							if(!cbx.isEmpty(val))
								val = val.replace(/,/g, "");
							else
								val="";
						  this.setRawValue(val); });
						/*
						 * Commented no formatting is required on blur and no
						 * need to set the absolute value on focus
						 */
						/**
						 * listening to blur event for amountfield to do format
						 * check and further validation
						 */
						/*
						 * this.on('blur', function(obj) {
						 * this.checkFormatter(obj); });
						 */
						// Focus event will give the absolute value erected from
						// delimeters
						/*
						 * this.on('focus', function(obj) { var val =
						 * this.getValue(); val = val.replace(/,/g, "");
						 * this.setValue(val); });
						 */
						// CHG_FF_ENHQ2 End
						// CBX_176 Starts
						// Check for the valid value only numerics allowed

						/*
						 * if (this.value) { try { var StringNumber =
						 * iportal.util.stringnumber .getInstance(); this.value =
						 * StringNumber.formatterFactory[iportal.preferences
						 * .getAmountFormat()](this.value.replace( /,/g, ""),
						 * this.signdigits); } catch (e) { this.value = '';
						 * this.error = true; } }
						 */

						// CBX_176 Ends
						// CHG_FF_ENHQ2 Start
						/*
						 * Commented no need to update the absolute value to
						 * hidden field instead we will set the absolute value
						 * in model data
						 */
						// After setting the value delegate the next execution
						// to updateHidden method
						/*
						 * this.setValue = this.setValue
						 * .createSequence(this.updateHidden);
						 */
						// CHG_FF_ENHQ2 End
					},
					calculateDecimalDigits : function(){
						var currDecimalPlaceList = cbx.globalcurrency.metadata.getCurrDecimalPlaceList();
						var currcmp = this.linkedCurrComp;
						var curr;
						if (!Ext.isEmpty(currcmp) && !Ext.isEmpty(currcmp.multiInd) && currcmp.multiInd==true && !Ext.isEmpty(currcmp.index)) {
							curr=this.model.md[currcmp.multiFormId][currcmp.itemId][currcmp.index];
						}else if (!Ext.isEmpty(currcmp)){
							curr=this.initialConfig.model.getValue(currcmp);
						}
						if(Ext.isEmpty(curr)){
							curr = iportal.systempreferences.getDefaultBankCCY();
						}
							
							if(Ext.isEmpty(curr)){
								// get the default curr configured in the
								// orbidirect properties.
								curr = cbx.globalcurrency.metadata.getDefaultCurrency();
							}
						if(!Ext.isEmpty(curr)){
							//var currList=Ext.decode(currDecimalPlaceList);
							var currBasedDecimal = currDecimalPlaceList[curr];
							this.signdigits = currBasedDecimal;
						}
						return this.signdigits;
					},
					
					// After setting the value delegate the next execution to
					// updateHidden method
					checkFormatter : function(obj) {
						val = obj.getValue().trim();
						var that = this;
						var crb = CRB.getFWBundle();
						var res = that.checkAmountInsideMaxLength(that
								.getValue());
						if (res === 'invalid') {
							return;
						}
						if (!res) {
							that.markInvalid(that.maxLengthText);
							return;
						}
						if (val === '') {
							if (that.required === 'Y')
								that.markInvalid(String.format(
										crb['ERR_MANDATORY'] || "", that.plainLabel));
							return;
						} else {
							// that.clearInvalid(); // CHG_FF_ENHQ2
							val = obj.getValue().trim();
							var StringNumber = canvas.amountFormatter.getInstance();
							val=StringNumber.basicFormatter(val.replace(/,/g, ""), this.signdigits);
							this.setValue(val);
							if(cbx.isEmpty(val)){
								this.markInvalid(CRB.getFWBundle() && CRB.getFWBundle()['ERR_INVALID_AMOUNT'] ? CRB.getFWBundle()['ERR_INVALID_AMOUNT']:'ERR_INVALID_AMOUNT');	// CHG_FF_ENH
								return;
							}
						}
						if (that.checkAmountInsideMaxLength(that.getValue())) {
							that.clearInvalid();
						}
					},
					/*
					 * Ovverriding the vaidate function to avoid the invalid
					 * icon to get disappeared on losing focus,if the field is
					 * invalid
					 */
					// CHG_FF_ENHQ2 Start
					validate:function(){
						if (!this.disabled && (this.el.dom.className.indexOf('errorBg')!=-1 || this.el.dom.className.indexOf(this.invalidClass) != -1)) {	
							return false;
						}
						if(this.disabled || this.validateValue(this.processValue(this.getValue()))){  // CBX_176
				            this.clearInvalid();
				            return true;
				        }
				        return false;
					},
					/**
					 * Overriding the base class onBlur event with our own event.
					 */
					onBlur : function(){
				        this.beforeBlur();
				        if(this.focusClass){
				            this.el.removeClass(this.focusClass);
				        }
				        this.hasFocus = false;
				        if(this.validationEvent !== false && (this.validateOnBlur || this.validationEvent == 'blur')){
				            this.validate();
				        }
				        var v = this.getValue();
				            this.fireEvent('change', this, v, this.startValue);
				        this.fireEvent('blur', this);
				        this.postBlur();
				    },
					// CHG_FF_ENHQ2 End
					checkAmountInsideMaxLength : function(val) {
						var maxDigits = this.integrallength; // CBX_176
					 	var maxDecimals = this.decimallength;  // CBX_176
					 if(maxDigits && maxDecimals && !Ext.isEmpty(this.maxLength)){ 
					 	var amount_arr = val.split('.');
						if (amount_arr.length == 2) {
							if ((amount_arr[0].length <= maxDigits)
									&& (amount_arr[1].length <= maxDecimals)) {
								return true;
							} else {
								return false;
							}
						} else if (amount_arr.length == 1) {
							if (amount_arr[0].length <= maxDigits) {
								return true;
							} else {
								return false;
							}
						} else {
							this.markInvalid(CRB.getFWBundle() && CRB.getFWBundle()['ERR_INVALID_FIELD'] ? CRB.getFWBundle()['ERR_INVALID_FIELD']:'ERR_INVALID_FIELD');// CHG_FF_ENH
							return 'invalid';
						}
					 }
					 else
						 return true;
					},
					afterRender : function() {
						this.updateScreenViewData(this);//CBXFW_DIT_77
						cbx.formElement.AmountField.superclass.afterRender
								.apply(this, arguments);
						// CHG_FF_ENHQ2 Start
						if (this.error) {
							this.dataErrorHandler();
						}
						/*DIT_108 starts- registering events*/
						if(this.copyPasteInd==="Y")
							{
						this.getEl().on('keydown',preventCopyPaste,this);
						this.getEl().on('drop',preventCopyPaste,this);
						this.getEl().on('dragstart',preventCopyPaste,this);
						this.getEl().on('draggesture',preventCopyPaste,this);
						}

						//CBXQ2FW80 Starts
						/**
				    	 * if the  currency mode(Prefix/Suffix) is enabled for the amount field an empty span is created
				    	 * above or below the amount field with customed class attached for alteration if necessary.
				    	 * This element will be referred by updateSignDigits method to update the ccycode after the element
				    	 * rendering. 
				    	 */
						if(this.currMode==='PRE_CODE'){
							
							Ext.DomHelper.insertBefore(this.getEl().dom, {
					 		    tag: 'span',cls:'linkedCCy-PRE '+this.name+'-CCy'
					 		});
												
					        this.setWidth(this.getWidth()-Ext.util.TextMetrics.createInstance(Ext.getBody()).getWidth(this.getCurrency())-10);
					  		
						 
						}
						//This Suffix currency mode is  kept for future enhancement and  needs some rework for desired output.
						else if(this.currMode==='SUF_CODE'){
							Ext.DomHelper.insertAfter(this.getEl().dom, {
					 		    tag: 'span',cls:'linkedCCy-SUF '+this.name+'-CCy' 
					 		});
												
						   this.setWidth(this.getWidth()-Ext.util.TextMetrics.createInstance(Ext.getBody()).getWidth(this.getCurrency())-10);
								
						}
						else if(this.currMode==='PRE_SYM'){
							//Will be added in future enhancement
						}
						else if(this.currMode==='SUF_SYM'){
							//Will be added in future enhancement						
						}
						
					//	this.updateSignDigits();

					},
					//CBXQ2FW80 Starts
					 /**Overriden the  onResize method
				     * Called after the component is resized, this method is empty by default but this is implemented by this
				     * subclass that needs to perform custom logic after a resize occurs on resizing.
				     * @param {Number} adjWidth The box-adjusted width that was set
				     * @param {Number} adjHeight The box-adjusted height that was set
				     * @param {Number} rawWidth The width that was originally specified
				     * @param {Number} rawHeight The height that was originally specified
				     */
					onResize : function(adjWidth, adjHeight, rawWidth, rawHeight){
					    if(this.currMode==='PRE_CODE' || this.currMode==='SUF_CODE'){					
						this.getResizeEl().setWidth(adjWidth-Ext.util.TextMetrics.createInstance(Ext.getBody()).getWidth(this.getCurrency()));
						} 
					
				    },
				  //CBXQ2FW80 Ends
					// Error handling method to display error indicator on field
					// validation.
					dataErrorHandler : function() {
						if (this.error)
							//CHG TRADE POC STARTS
							if(this.handleError){							
							this.markInvalid(CRB.getFWBundle() && CRB.getFWBundle()['ERR_INVALID_AMOUNT'] ? CRB.getFWBundle()['ERR_INVALID_AMOUNT']:'ERR_INVALID_AMOUNT');	// CHG_FF_ENH
							}
						//CHG TRADE POC Ends
						this.error = false;
						return;
					},
					updateHidden : function() {
						var val = this.getValue();
						val = val.replace(/,/g, "");
						this.plainValue = val;
						this.syncModelData();
						if (this.error) {
							this.dataErrorHandler();
						}
					},
					// CBX_FW_Q112F_094 Start
					/**
					 * Overriding the reset method because the orginal method
					 * calls the setValue of this field with empty value which
					 * fails due to this field specific implementation in
					 * setValue.
					 */
					reset : function(){
						cbx.formElement.AmountField.superclass.setValue.call(this, '');
				        this.clearInvalid();
				    },
				    // CBX_FW_Q112F_094 Ends
					/**
					 * Overriding the setValue method doing format check and
					 * further validation before setting the value
					 */
				    /**
					 * FW 46 starts: Added a new api to update the signdigits
					 * based on the currency. - get the currency linked with the
					 * component through the linked source curr. - if currency
					 * is not available, get it from the preference. - if the
					 * currency is also not found in preference, get it from the
					 * orbionedirect.properties file. - using the currency, get
					 * the decimal place values from the cache through
					 * iportal.GlobalCurrency.metadata.jsp.Finally updates the
					 * this.signdigits.
					 */
				    updateSignDigits: function(config){
				    	var currDecimalPlaceList = cbx.globalcurrency.metadata.getCurrDecimalPlaceList();
				    	var currcmp = this.linkedCurrComp;
				    	var curr;
				    	//CHG_MULTIFORM Starts
				    	if (!Ext.isEmpty(currcmp) && !Ext.isEmpty(currcmp.multiInd) && currcmp.multiInd==true && !Ext.isEmpty(currcmp.index)) {
				    		curr=this.model.md[currcmp.multiFormId][currcmp.itemId][currcmp.index];
				    	}else if (!Ext.isEmpty(currcmp)){
				    		curr=this.initialConfig.model.getValue(currcmp);
				    	}
				    	//CHG_MULTIFORM Ends
				    	if(cbx.isEmpty(curr)){
							// get the default curr from preference.
							curr = iportal.systempreferences.getDefaultBankCCY();
							if(Ext.isEmpty(curr) || curr==null || curr=='null'){
								// get the default curr configured in the
								// orbidirect properties.
								curr = cbx.globalcurrency.metadata.getDefaultCurrency();
							}
						}
				    	if(!cbx.isEmpty(curr)){
							var currList=currDecimalPlaceList;//Ext.decode(currDecimalPlaceList);
							if(!cbx.isEmpty(currList)){
							var currBasedDecimal = currList[curr];
							this.signdigits = currBasedDecimal;
							}
								//CBXQ213F18	- Starts 
							var commonbundle =CRB.getFWBundle();
							this.maxLengthText = String
							.format(
									commonbundle['ERR_MAXLENGTH_EXCEED_AMOUNT'] || "",
									this.plainLabel,
									parseInt(this.integrallength)+parseInt(1),
									this.signdigits);
							//CBXQ213F18 - Ends
							//CHG_6644_01_Starts
							/*this.maxLengthText = String
							.format(
									commonbundle['ERR_AMOUNT_MAXLENGTH_EXCEED_LIMIT'] || "",
									this.plainLabel);*/
							//CHG_6644_01_Ends

						}
				    	//CBXQ2FW80 Starts 
				    	/**
				    	 * Based on the currency mode(Prefix/Suffix) the currency code is appended with 
				    	 * the amount field and the code below is to update the currency code based on the mode.
				    	 */
				    	if(this.currMode==='PRE_CODE'){
							if(this.getEl() && this.getEl().parent('div') && this.getEl().parent('div').down('span')){
								this.getEl().parent('div').down('span').update(curr);
						   }
						}
						else if(this.currMode==='SUF_CODE'){
							if(this.getEl() && this.getEl().next && this.getEl().next('span')){
						    	this.getEl().next('span').update(curr);
						    }
						}
						else if(this.currMode==='PRE_SYM'){ 
							//Will be added in future enhancement
						}
						else if(this.currMode==='SUF_SYM'){
							//Will be added in future enhancement						
						}
				    	
				    	
				    //	this.updateSignDigits();
					},
					//CBXQ2FW80 Starts
					 /**
					 * Added a new api to get the currency linked with the
					 * component through the linked source curr. - if currency
					 * is not available, get it from the preference. - if the
					 * currency is also not found in preference, get it from the
					 * orbionedirect.properties file.
					 */
					getCurrency:function(config){
						var currDecimalPlaceList = cbx.globalcurrency.metadata.getCurrDecimalPlaceList();
				    	var currcmp = this.linkedCurrComp;
				    	var curr;
				    	if (!Ext.isEmpty(currcmp)) {
				    		curr=this.initialConfig.model.getValue(currcmp);
				    		
				    	}
				    	if(Ext.isEmpty(curr) || curr==null || curr=='null'){
							// get the default curr from preference.
							curr = iportal.systempreferences.getDefaultBankCCY();
							if(Ext.isEmpty(curr)){
								// get the default curr configured in the
								// orbidirect properties.
								curr = cbx.globalcurrency.metadata.getDefaultCurrency();
							}
						}
				    	return curr;
					},
				    
					// FW 46 Ends
					// CHG_FF_ENHQ2 Start
					setValue : function(value) {
						this.updateSignDigits(); 	// FW 46 : calling the api
													// to update the
													// this.signdigits.
							// CBX_176 Starts
							try{
								// CBXR12Q413F16 starts
								if(value!=null  && value!=''){
								val = value.trim();
								val=val.replace(/,/g, "");
								}else{
									val=null;
								}
							}
							    // CBXR12Q413F16 ends
								catch(err){
									val='';
								}
								// CBXR12Q413F16 starts
								var that = this;
								var crb = CRB.getFWBundle();
								if (val===null || val==='' ) {
									cbx.formElement.AmountField.superclass.setValue
									.call(that, val);
									if (that.required === 'Y'){
										that.markInvalid(String.format(
												crb['ERR_MANDATORY'] || "", that.plainLabel));
									}else{
									that.clearInvalid();
									}
								/**
								 * Updating the field value into the modeldata.
								 */
									if(!Ext.isEmpty(this.multiInd) && this.multiInd==true && !Ext.isEmpty(this.index)){
										if (this.manager.handlerEvent('cbxvalidate', this.name, val) === false) {
											return;
										}else{
										this.model.updateField(this.name,val,this.index,this.multiFormId);		
										}
									}
									else if (this.manager.handlerEvent('cbxvalidate', this.name, val) === false) {
										return;
									}
									else{
										this.model.updateField(this.name,val); 
									}
									return;
								}
								// CBXR12Q413F16 ends
							// CBX_176 Ends
						var valToSet=val.replace(/,/g, "");// CBX_FW_Q112F_074.Need
															// to update the
															// model without
															// comma seperator
						var that = this;
						var crb = CRB.getFWBundle();
						var res = that.checkAmountInsideMaxLength(val);
						if (res === 'invalid') {
							// CBX_176 Starts
							cbx.formElement.AmountField.superclass.setValue
							.call(this, val);
							this.markInvalid(CRB.getFWBundle() && CRB.getFWBundle()['ERR_INVALID_AMOUNT'] ? CRB.getFWBundle()['ERR_INVALID_AMOUNT']:'ERR_INVALID_AMOUNT');	// CHG_FF_ENH
							return;
							// CBX_176 Ends
						}
						if (!res) {
							// CBX_176 Starts
							cbx.formElement.AmountField.superclass.setValue
							.call(this, val);
							// CBX_176 Ends
							that.markInvalid(that.maxLengthText);
							return;
						}
						if (val === '') {
							if (that.required === 'Y')
								//CHG TRADE POC STARTS
								{
								//CBX_176 Starts
								cbx.formElement.AmountField.superclass.setValue
								.call(this, val);
								//CBX_176 Ends
								that.markInvalid(String.format(
										crb['ERR_MANDATORY'] || "", that.plainLabel));
							return;
						}
							else{
							cbx.formElement.AmountField.superclass.setValue
							.call(this, val);
							return;
						}
							//CHG TRADE POC Ends
						} else {
							that.clearInvalid();
							var StringNumber = canvas.amountFormatter.getInstance();
							val=StringNumber.basicFormatter(valToSet, this.signdigits);
							if(cbx.isEmpty(val))
							{
								this.markInvalid(CRB.getFWBundle() && CRB.getFWBundle()['ERR_INVALID_AMOUNT'] ? CRB.getFWBundle()['ERR_INVALID_AMOUNT']:'ERR_INVALID_AMOUNT');
								return;			
							}
						}
						var amtFormatJson = iportal.preferences.getAmountFormatJson();
						var groupSep=amtFormatJson.groupSeparator;
						if(groupSep=="S")
							groupSep=" ";
						var decSep=amtFormatJson.decimalSeparator;						
						if(decSep=="S")
							decSep=" ";
						if(cbx.isEmpty(val))
							var valueToSet="";
						else
							var valueToSet=val.split(groupSep).join("").split(decSep).join(".");
						if (that.checkAmountInsideMaxLength(valueToSet.replace(/,/g, ""))) { 
							that.clearInvalid();
						}
						//CHG_MULTIFORM Starts
						if(!Ext.isEmpty(this.multiInd) && this.multiInd==true && !Ext.isEmpty(this.index)){
							if (this.manager.handlerEvent('cbxvalidate', this.name, valueToSet) === false) {
								return;
							}else{
							this.model.updateField(this.name,valueToSet,this.index,this.multiFormId);		
							}
						}
						else if (this.manager.handlerEvent('cbxvalidate', this.name, valueToSet) === false) {
							return;
						}
						else{
							this.model.updateField(this.name,valueToSet); //Need to update the model without comma seperator
						}
						
						//CHG_MULTIFORM Ends
						// CBX_FW_Q112F_074.Need

					cbx.formElement.AmountField.superclass.setValue
								.call(this, val);
					},
					// CHG_FF_ENHQ2 End
					getValue : function() {
						var val = cbx.formElement.AmountField.superclass.getValue
								.apply(this, arguments);
						return val.replace(/,/g, "");
					},
					// CBX_176 Starts
					getRawValue : function() {
						return this.getValue();
					},
					// CBX_176 Ends
					setFormattedValue : function(val) {
						if (val) {
							var StringNumber = canvas.amountFormatter.getInstance();
							this.setValue(StringNumber.basicFormatter(val.replace(/,/g, ""), this.signdigits));
						}
					},
					syncModelData : function() {
						/**
						 * Updating only the rawvalue in the form model.
						 */
						var valToSet =this.model.getModelData()[this.itemId];
						//CHG_MULTIFORM Starts
						if(!Ext.isEmpty(this.multiInd) && this.multiInd==true && !Ext.isEmpty(this.index)){
							if (this.manager.handlerEvent('cbxvalidate', this.name,valToSet,this.index,this.multiFormId) === false) {
								return;
							}else{
							this.model.updateValue(this.name,valToSet,undefined,this.index,this.multiFormId); // CHG_FF_ENHQ2
							}
						}else if (this.manager.handlerEvent('cbxvalidate', this.name, valToSet) === false) {
							return;
						}else{
							this.model.updateValue(this.name, valToSet); // CHG_FF_ENHQ2							
						}
						//CHG_MULTIFORM Ends
							this.updateScreenViewData(this);//CBXFW_DIT_77
					},
					isVisible : function() {
						return cbx.formElement.AmountField.superclass.isVisible
								.apply(this, arguments);
					},
					//CBXFW_DIT_77 starts
					/**
					 * Updates the screen data in the ScreenView
					 */
					getScreenViewData:function()
					{
						var val = this.model.getModelData()[this.itemId];
						if (Ext.isEmpty(val)){
							return "";
						}
						else
						{
							var StringNumber = canvas.amountFormatter.getInstance();
							var returnVal=StringNumber.basicFormatter(val.replace(/,/g, ""), this.signdigits);
							if(cbx.isEmpty(returnVal)){
							LOGGER.error('Not able to translate to amount format ');
							return "";
							}
							else{
							return returnVal;}
						}
					},
					//CBXFW_DIT_77 ends
					format : function() {
						var val = this.getValue();
						var StringNumber = canvas.amountFormatter.getInstance();
						this.setValue(StringNumber.basicFormatter(val.replace(/,/g,
						""), this.signdigits));
					}
				});
Ext.reg('cbx-amountfield', cbx.formElement.AmountField);
/**
 * This class is an extension of Ext.form.TextField class
 */
cbx.formElement.StaticAmountField = function(config) {
	this.plainLabel = config.plainLbl;
	this.fieldLabel = config.displayNmKey;
	//CHG_MULTIFORM Starts
	if(!Ext.isEmpty(config.multiInd) && config.multiInd==true && !Ext.isEmpty(config.index)){
		this.valueInd = config.model.getModelData()[config.multiFormId][config.itemId][config.index];
		this.value = config.model.getModelData()[config.multiFormId][config.itemId][config.index];
	}else{
			this.valueInd = config.model.getModelData()[config.itemId]; //CBXQ2FW80 
			this.value = config.model.getModelData()[config.itemId];
	}
	//CHG_MULTIFORM Ends
	this.name = config.itemId;
	this.currMode=config.appendCurrMode; //CBXQ2FW80 
	this.required = config.requiredInd;
	this.conditional = config.conditionalInd;
	this.hidden = config.visibleInd === 'Y' ? false : true;
	cbx.formElement.StaticAmountField.superclass.constructor.call(this, config);
};
Ext.extend(cbx.formElement.StaticAmountField, Ext.form.TextField, {
	/**
	 * @cfg {String/Object} required ,to specify whether this field is mandatory
	 *      (defaults to false)
	 */
	required : 'N',
	/**
	 * @cfg {Object} bundleKey ,key used by resource to lookup bundle(defaults
	 *      to '')
	 */
	bundleKey : '',
	signdigits : 2,
	plainValue : '',
	cls:'canvas-staticamountfield',
	// private
	initComponent : function() {
		//CBXFW_DIT_77 starts
		this.on('hide',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'N']));
		this.on('show',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'Y']));
		//CBXFW_DIT_77 ends
		this.triggerField = true;
		this.allowBlank = true;
		this.maxLength = undefined;
		this.minLength = undefined;
		cbx.formElement.StaticAmountField.superclass.initComponent.apply(this,
				arguments);
		var bundle;
		var commonbundle = CRB.getFWBundle();
		// To get the bundle key reference
		bundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));
		/**
		 * If the plainLabel attribute is not null ,component's field label will
		 * be the plain-label else the label associated with bundle keys will be
		 * referred to get the field label.
		 */
		 // CBX_FW_Q112F_008 Starts
		if (!Ext.isEmpty(this.plainLabel)) {
			this.fieldLabel = this.plainLabel;
		} else {
			this.fieldLabel = bundle['LBL_' + this.fieldLabel];
		}
		/**
		 * If the conditional attribute is Y the components field label will be
		 * field label associated with two stars
		 */
		if (this.conditional === 'Y') {
			this.blankText = String.format(commonbundle['ERR_MANDATORY'],
					this.fieldLabel);
			if (Ext.isEmpty(this.fieldLabel)) {
				//CHG_TRADE_POC Starts
				this.fieldLabel = '?' + this.fieldLabel + '?';
				//CHG_TRADE_POC Ends
			} else {
				//CHG_TRADE_POC Starts
				this.fieldLabel = this.fieldLabel;
				//CHG_TRADE_POC Ends
			}
		}
		/**
		 * If the required attribute is Y,components field label will be field
		 * label associated with mandatory star and the field will not allow
		 * blank values.
		 */
		else if (this.required === 'Y') {
			this.allowBlank = false;
			if (Ext.isEmpty(this.fieldLabel)) {
				//CHG_TRADE_POC Starts
				this.fieldLabel = '?' + this.fieldLabel + '?';
				//CHG_TRADE_POC Ends
			} else {
				//CHG_TRADE_POC Starts
				this.fieldLabel = this.fieldLabel;
				//CHG_TRADE_POC Ends
			}
		} else {
			this.blankText = String.format(commonbundle['ERR_MANDATORY'],
					this.fieldLabel);
			if (Ext.isEmpty(this.fieldLabel)) {
				this.fieldLabel = '?' + this.fieldLabel + '?'
						+ '<span class = \'non_mandatory\'"></span>';
			} else {
				this.fieldLabel = this.fieldLabel
						+ '<span class = \'non_mandatory\'"></span>';
			}
		}
		// CBX_FW_Q112F_008 Ends
		this.anchor = (this.anchor == undefined) ? '' : this.anchor;
		this.labelSeparator = '';
		this.style = 'border:none; background: transparent;padding-left:0;';
		this.readOnly = true;
		//CBXQ2FW80 Starts
		if (this.valueInd) {
			this.setValue(this.valueInd);
		}
		if (this.value) {
		
		} 
		else {
			this.value = '--';
		}
		this.tabIndex = 99999995; //CBXQ313F37
		//CBXQ2FW80 Ends

	},
	//CBXQ2FW80 Starts
	 /**
	 * Added a new api to get the currency linked with the
	 * component through the linked source curr. - if currency
	 * is not available, get it from the preference. - if the
	 * currency is also not found in preference, get it from the
	 * orbionedirect.properties file.
	 */
	getCurrency:function(config){ 
		var currDecimalPlaceList = cbx.globalcurrency.metadata.getCurrDecimalPlaceList();
    	var currcmp = this.linkedCurrComp;
    	var curr;
    	if (!Ext.isEmpty(currcmp)) {
    		curr=this.initialConfig.model.getValue(currcmp);
    		
    	}
    	if(Ext.isEmpty(curr) || curr==null || curr=='null'){
			// get the default curr from preference.
			curr = iportal.systempreferences.getDefaultBankCCY();
			if(Ext.isEmpty(curr)){
				// get the default curr configured in the
				// orbidirect properties.
				curr = cbx.globalcurrency.metadata.getDefaultCurrency();
			}
		}
    	return curr;
	},
	//CBXQ2FW80 Ends
	afterRender : function() {
		cbx.formElement.StaticAmountField.superclass.afterRender.apply(this,
				arguments);
		// Setting the plainValue based on if value exists
		if (this.value) {
			this.plainValue = this.value.replace(/,/g, "");
		} else {
			this.plainValue = '';
		}
			this.updateScreenViewData(this);//CBXFW_DIT_77
		//CBXQ2FW80 Starts
		/**
    	 * if the  currency mode(Prefix/Suffix) is enabled for the amount field an empty span is created
    	 * above or below the amount field with customed class attached for alteration if necessary.
    	 * This element will be referred by updateSignDigits method to update the ccycode after the element
    	 * rendering. 
    	 */
		if(this.currMode==='PRE_CODE'){
			
			Ext.DomHelper.insertBefore(this.getEl().dom, {
	 		    tag: 'span',cls:'linkedCCy-PRE '+this.name+'-CCy'
	 		});
											
	        this.setWidth(this.getWidth()-Ext.util.TextMetrics.createInstance(Ext.getBody()).getWidth(this.getCurrency())-10);
			
	  	
		 
		}
		//This Suffix currency mode is  kept for future enhancement and  needs some rework for desired output.
		else if(this.currMode==='SUF_CODE'){
			Ext.DomHelper.insertAfter(this.getEl().dom, {
	 		    tag: 'span',cls:'linkedCCyStatic-SUF '+this.name+'-CCy'
	 		});
						
		   this.setWidth(Ext.util.TextMetrics.createInstance(Ext.getBody()).getWidth(this.getValue())+Ext.util.TextMetrics.createInstance(Ext.getBody()).getWidth(this.getCurrency())+38);
			
				
		}
		else if(this.currMode==='PRE_SYM'){
			//Will be added in future enhancement
		}
		else if(this.currMode==='SUF_SYM'){
			//Will be added in future enhancement						
		}
		//CBXQ2FW80 Ends
	},
	//CBXQ2FW80 Starts
	 /**Overriden the  onResize method
     * Called after the component is resized, this method is empty by default but this is implemented by this
     * subclass that needs to perform custom logic after a resize occurs on resizing.
     * @param {Number} adjWidth The box-adjusted width that was set
     * @param {Number} adjHeight The box-adjusted height that was set
     * @param {Number} rawWidth The width that was originally specified
     * @param {Number} rawHeight The height that was originally specified
     */
	onResize : function(adjWidth, adjHeight, rawWidth, rawHeight){
	 
		if(this.currMode==='PRE_CODE' ){					
		this.getResizeEl().setWidth(adjWidth-Ext.util.TextMetrics.createInstance(Ext.getBody()).getWidth(this.getCurrency()));
		} 
	    if(this.currMode==='SUF_CODE'){	
	   
			this.getResizeEl().setWidth(Ext.util.TextMetrics.createInstance(Ext.getBody()).getWidth(this.getValue())+Ext.util.TextMetrics.createInstance(Ext.getBody()).getWidth(this.getCurrency())+38);
		} 
	
    },
  //CBXQ2FW80 Ends
	getValue : function() {
		var val = cbx.formElement.StaticAmountField.superclass.getValue.apply(
				this, arguments);
				//CHG_8379 Starts
		/**
		*All the static field is setting -- for no value .But for amount field -- value cannot be sent to the server
		*as it will throw number format exception.
		*For this CHG_7839 fix has been done. But that fix has not been done considering the negative amount.
		*There will be two conditions,If the value is -- then replace the value with empty
		*Else,there is a good chance to check the value is a number or not
		*and replace
		*/
		if(val=='--'){
			return val.replace(/['--']/g,"");
		}else {
			return val.replace(/,/g,"");
		}
				//CHG_8379 Ends
		
	},
    /**
	 * FW 46 starts: Added a new api to update the signdigits based on the
	 * currency. - get the currency linked with the component through the linked
	 * source curr. - if currency is not available, get it from the preference. -
	 * if the currency is also not found in preference, get it from the
	 * orbionedirect.properties file. - using the currency, get the decimal
	 * place values from the cache through
	 * iportal.GlobalCurrency.metadata.jsp.Finally updates the this.signdigits.
	 */
    
	updateSignDigits: function(config){
    	var currDecimalPlaceList = cbx.globalcurrency.metadata.getCurrDecimalPlaceList();
    	var currcmp = this.linkedCurrComp;

    	// this is the ID of the component that will hold the currency.
    	var curr;
    	if (!Ext.isEmpty(currcmp)) {
    		
    		// curr = this.fm.model.getValue(currcmp);
    		if(!Ext.isEmpty(currcmp.multiInd) && currcmp.multiInd==true && !Ext.isEmpty(currcmp.index)){
    				curr=this.initialConfig.model.getValue(currcmp.multiFormId)[currcmp.itemId][currcmp.index];
    			}else{
    				curr=this.initialConfig.model.getValue(currcmp);    				
    			}
    		
    		
    	}
    	if(Ext.isEmpty(curr)){
			// get the default curr from preference.
			curr = iportal.systempreferences.getDefaultBankCCY();
			
			if(Ext.isEmpty(curr) || curr==null || curr=='null'){
				// get the default curr configured in the orbidirect properties.
				curr = cbx.globalcurrency.metadata.getDefaultCurrency();
				
			}
		}
		
    	if(!Ext.isEmpty(curr)){
    		if(!cbx.isEmpty(currList)){
    		var currList=currDecimalPlaceList;//Ext.decode(currDecimalPlaceList); 
			var currBasedDecimal = currList[curr];
			
			this.signdigits = currBasedDecimal;
    		}
		}
    	//CBXQ2FW80 Starts
    	/**
    	 * Based on the currency mode(Prefix/Suffix) the currency code is appended with 
    	 * the amount field and the code below is to update the currency code based on the mode.
    	 */
    	if(this.currMode==='PRE_CODE'){
			if(this.getEl() && this.getEl().parent('div') && this.getEl().parent('div').down('span')){
				this.getEl().parent('div').down('span').update(curr);
		   }
		}
		else if(this.currMode==='SUF_CODE'){
			if(this.getEl() && this.getEl().parent('div')){
				this.getEl().parent('div').addClass('staticAmtField');
		   }
			if(this.getEl() && this.getEl().next && this.getEl().next('span')){
		    	this.getEl().next('span').update(curr);
		    }
		}
		else if(this.currMode==='PRE_SYM'){ 
			//Will be added in future enhancement
		}
		else if(this.currMode==='SUF_SYM'){
			//Will be added in future enhancement						
		}
    	//CBXQ2FW80 Ends
	},
	// FW 46 ends
	// FW-R12-08-2012-053 Starts
	setValue : function(v) {
		 this.updateSignDigits(); // FW 46: calling the api to update the
									// this.signdigits
		if(!cbx.isEmpty(v)){
			var StringNumber=canvas.amountFormatter.getInstance();
			var val=StringNumber.basicFormatter(v.replace(/,/g, ""), this.signdigits);
				if(!cbx.isEmpty(val))
					this.setRawValue(val);
				else
					this.setRawValue('--');
		}
		else {
			this.setRawValue('--');
		}
		var amtFormatJson = iportal.preferences.getAmountFormatJson();
		var groupSep=amtFormatJson.groupSeparator;
		if(groupSep=="S")
			groupSep=" ";
		var decSep=amtFormatJson.decimalSeparator;						
		if(decSep=="S")
			decSep=" ";
		if(cbx.isEmpty(val))
			var valueToSet="";
		else
			var valueToSet=val.split(groupSep).join("").split(decSep).join(".");
		//CHG_MULTIFORM Starts
		if(!Ext.isEmpty(this.multiInd) && this.multiInd==true && !Ext.isEmpty(this.index)){
			this.model.updateField(this.name, valueToSet,this.index,this.multiFormId);
		}else{
			this.model.updateField(this.name, valueToSet);
		}
		if(this.el)
		{
		if(this.getValue().length+2>Math.floor(this.el.getWidth()/iportal.preferences.getAverageFontWidth())){
			new Ext.ux.ClickToolTip({ 
				title: '',
				id: '',
				target: this.el,
				anchor: 'bottom',
				html: this.getValue(),
				trackMouse: true
				});
		} 
		}
		
		//CHG_MULTIFORM Ends
		this.updateScreenViewData(this);//CBXFW_DIT_77
	},

	// FW-R12-08-2012-053 Starts
	isVisible : function() {
		return cbx.formElement.StaticAmountField.superclass.isVisible.apply(
				this, arguments);
	}
	//CBXFW_DIT_77 starts
	,getScreenViewData:function()
	{
		var val = this.model.getModelData()[this.itemId];
		if (Ext.isEmpty(val)){
			return "";
		}
		else{
			var StringNumber = canvas.amountFormatter.getInstance();
			var returnVal=StringNumber.basicFormatter(val.replace(/,/g, ""), this.signdigits);
			if(cbx.isEmpty(returnVal)){
			LOGGER.error('Not able to translate to amount format ');
			return "";
			}
			else{
			return returnVal;}
		}
	}
	//CBXFW_DIT_77 ends
});
Ext.reg('cbx-staticamountfield', cbx.formElement.StaticAmountField);
cbx.formElement.DateField = function(config) {
	this.plainLabel = config.plainLbl;
	this.fieldLabel = config.displayNmKey;
	this.name = config.itemId;
	//CHG_MULTIFORM Starts
	if(!Ext.isEmpty(config.multiInd) && config.multiInd==true && !Ext.isEmpty(config.index)){
		this.value = config.model.getModelData()[config.multiFormId][config.itemId][config.index];
	}else{
		this.value = config.model.getModelData()[config.itemId];	
	}
	//CHG_MULTIFORM Ends
	this.required = config.requiredInd;
	this.conditional = config.conditionalInd;
	this.readOnly = config.readOnlyInd === 'Y' ? true : false;
	this.hidden = config.visibleInd === 'Y' ? false : true;
	this.addData = config.addData;
	this.markNationalHolidays=config.highlightHolidaysInd === 'Y' ? true : false;// If the value of this property is true, weekends and holidays will be displayed in a different color.
	this.weekEndList=iportal.preferences.getWeekEndList();//This property will hold the configured list of days of the week to be marked as weekends
	this.maxValueDate=config.maxValueDate || ''; 
	this.minValueDate=config.minValueDate || ''; 
	this.disableDates=config.disableDates || ''; 
	this.weedEndText=CRB.getFWBundle()['LBL_WEEK_END'] ? CRB.getFWBundle()['LBL_WEEK_END'] : 'Weekend'; //This is the text which will displayed on hovering over a week end if highlight holidays is enabled
	cbx.formElement.DateField.superclass.constructor.call(this, config);
};
Ext
		.extend(
				cbx.formElement.DateField,
				Ext.form.DateField,
				{
					/**
					 * @cfg {String/Object} required ,to specify whether this
					 *      field is mandatory (defaults to N)
					 */
					required : 'N',
					conditional : 'N',
					/**
					 * @cfg {Object} bundleKey ,key used by resource to lookup
					 *      bundle(defaults to '')
					 */
					bundleKey : '',
					/**
					 * @cfg {Object} submitFormat ,this is the format used for
					 *      submitting the data irrespective of the preferences
					 *      settings and display.
					 */
					submitFormat : 'd/m/Y',
					plainLabel : '',
					plainValue : '',
					oldValue : '',
					cls : 'x-form-dateField',
					ctCls:'custom-columnwidth', // CBX_FW_Q112F_013
					// CBX_FW_Q112F_098 Starts
					disabledDatesText:CRB.getFWBundle() && CRB.getFWBundle()['LBL_DISABLED_DATES'] ? CRB.getFWBundle()['LBL_DISABLED_DATES']:'Disabled',
					/**
					* @cfg {String} holidayDatesText
					* Tool tip Text to be applied to national Holidays if markNationalHolidays is set to true
					*/
					holidayDatesText:CRB.getFWBundle() && CRB.getFWBundle()['LBL_HOLIDAY_DATES'] ? CRB.getFWBundle()['LBL_HOLIDAY_DATES']:'Holiday',// The text to be displayed on hovering over a holiday
					/**
					* @cfg {String} nationalHolidaysCls
					* CSS Class to be applied to national Holidays if markNationalHolidays is set to true
					*/
					nationalHolidaysCls: 'x-datepickerplus-nationalholidays',
					/**
					* @cfg {String} weekEndCls
					* CSS Class to be applied to week ends if markNationalHolidays is set to true
					*/
					weekEndCls: 'x-datepickerplus-weekends',
					/**
					 * @cfg {boolean} markNationalHolidays
					 * flag to enable holiday color coding
					 */
					markNationalHolidays:false,
					/**
					 * @cfg {String} weekEndList
					 * Property that holds the days of the week to be marked as week ends
					 */
					weekEndList:'',
					/**
					 * @cfg {Object} holidayList
					 * contains the list of holidays to be color coded
					 */ 
					holidayList:[],
					/**
					 * @cfg {Object} parsedHolidayDates
					 * contains the list of parsed holidays
					 */ 
					
					parsedHolidayDates:[[],[]],
					initComponent : function() {
						this.triggerField = true;
						this.cls = this.cls+' '+this.itemId;
						this.on('hide',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'N']));
						this.on('show',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'Y']));
						//CBXFW_DIT_77 ends
						this.maxLength = undefined;
						this.minLength = undefined;
						// CBX_FW_Q112F_098 Starts
						if(!Ext.isEmpty(this.disableDates)){
							 if(Ext.isArray(this.disableDates)){
								 var formattedDataArray=[];
								for ( var i = 0; i < this.disableDates.length; i++) {
									// Intended to convert the
									// disabled date value to
									// preferred user format
								formattedDataArray.push(cbx.jsutil.convertDateValueToUserPreferedFmt(this.disableDates[i]));							
										}
								this.disabledDates = formattedDataArray;	 
							 }
						}
						//If markNationalHolidays is true, the  list of holidays is retrieved from iportal.preferences and passed to setHolidayDates 
						if(this.markNationalHolidays){
							var holidays=cbx.decode(iportal.preferences.getHolidayList())["holiday"];
							this.setHolidayDates(holidays);
						}
						
					/**
					 * In case additional data is available for the date field
					 * call the rePopulateAdditionalData before the component is
					 * created.
					 */
					if (this.addData != null) {
						this.rePopulateAdditionaldata(this.addData);
		}
					// CHG_MIN_MAX_DATE Ends
						// CHG001 ends
						if (this.disabledDates != null
								&& this.disabledDates.length < 1) {
							this.disabledDates = null;
						}
						cbx.formElement.DateField.superclass.initComponent
								.apply(this, arguments);
						var that = this;
						var bundle;
						var commonbundle = CRB.getFWBundle();
						/*
						 * 3.1 readOnly attribute hides trigger. So put editable
						 * as false this.readOnly = true;
						 */
						this.editable = false;

						// Get the dateformat
						this.format = canvas.datePreferences.getDateFormat();
						// To get the bundle key reference
						bundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));
						/**
						 * If the plainLabel attribute is not null ,component's
						 * field label will be the plain-label else the label
						 * associated with bundle keys will be referred to get
						 * the field label.
						 */
						if (!Ext.isEmpty(this.plainLabel)) {
							this.fieldLabel = this.plainLabel;
						} else {
							this.fieldLabel = bundle['LBL_' + this.fieldLabel];
						}
						// CHG_FF_ENHQ2 Starts
							/**
							 * *To hide the label of date field,if any
							 * label(plainLabel or fieldLabel) has not been
							 * configured
							 */
						if(this.fieldLabel==="" || this.fieldLabel===" " || Ext.isEmpty(this.fieldLabel)){
							this.hideLabel=true;
						}
						// CHG_FF_ENHQ2 Ends
						/**
						 * If the conditional attribute is Y the components
						 * field label will be field label associated with two
						 * stars
						 */
						if (this.conditional === 'Y') {
							this.blankText = String.format(
									commonbundle['ERR_MANDATORY'],
									this.fieldLabel);
							this.allowBlank = false;
							if (Ext.isEmpty(this.fieldLabel)) {
								this.fieldLabel = '?'
										+ this.fieldLabel
										+ '?'
										+ '<span class = \'cbx-mandatory-fx\'">**</span>';// CHG001-CSS
																							// changes
							} else {
								this.fieldLabel = this.fieldLabel
										+ '<span class = \'cbx-mandatory-fx\'">**</span>';// CHG001-CSS
																							// changes
							}
						}
						/**
						 * If the required attribute is Y,components field label
						 * will be field label associated with mandatory star
						 * and the field will not allow blank values.
						 */
						else if (this.required === 'Y') {
							this.blankText = String.format(
									commonbundle['ERR_MANDATORY'],
									this.fieldLabel);
							this.allowBlank = false;
							if (Ext.isEmpty(this.fieldLabel)) {
								this.fieldLabel = '?'
										+ this.fieldLabel
										+ '?'
										+ '<span class = \'mandatory\'">*</span>';
							} else {
								this.fieldLabel = this.fieldLabel
										+ '<span class = \'mandatory\'">*</span>';
							}
						} else {
							this.blankText = String.format(
									commonbundle['ERR_MANDATORY'],
									this.fieldLabel);
							if (Ext.isEmpty(this.fieldLabel)) {
								this.fieldLabel = '?'
										+ this.fieldLabel
										+ '?'
										+ '<span class = \'non_mandatory\'"></span>';
							} else {
								this.fieldLabel = this.fieldLabel
										+ '<span class = \'non_mandatory\'"></span>';
							}
						}
						this.invalidText = String.format(this.invalidText,
								this.fieldLabel, this.format);
						this.labelSeparator = '';
						this.oldValue = this.value;
						this.anchor = (this.anchor == undefined) ? ''
								: this.anchor;
						// This is to ensure that the select on date menu is
						// actually bubbling it to date field, as whoever using
						// the datefield maynot be directly interacting with
						// menu.
						this.menuListeners = {
							select : function(m, d) {
								that.setValue(d.format(that.format));
								that.fireEvent('select', that);
								// CBX_FW_Q112F_099 Starts
								setTimeout(function(){
									that.manager.handlerEvent('cbxafterselect', that.name, that.plainValue);
								},50)
								// CBX_FW_Q112F_099 Ends
							},
							show : function() {
								that.onFocus();
							},
							hide : function() {
								that.focus.defer(10, that);
								var ml = that.menuListeners;
								that.menu.un("select", ml.select, that);
								that.menu.un("show", ml.show, that);
								that.menu.un("hide", ml.hide, that);
							}
						};
						this.clearInvalid();
						// CBX_FW_Q112F_098 Starts
						if(!Ext.isEmpty(this.maxValueDate)){
							if(Ext.isDate(this.maxValueDate)){
								this.maxValue=this.maxValueDate;
							}if(Ext.isString(this.maxValueDate)){
								this.setMaxValue(this.maxValueDate);	
							}							
							}
						if(!Ext.isEmpty(this.minValueDate)){
							if(Ext.isDate(this.minValueDate)){
								this.minValue=this.minValueDate;
							}if(Ext.isString(this.minValueDate)){
								this.setMinValue(this.minValueDate);	
							}							
							}
						// CBX_FW_Q112F_098 Ends
						// Check the default date value is valid date value
						if (this.value) {
							// CBX_FW_Q112F_057 Starts.
							/**
							 * The following code was commented in the the last
							 * release date to ensure that after resetting the
							 * form the date should set properly.The idea was
							 * that: At the time of setting the value the
							 * developer will set the value in the user
							 * preferred format. But to make the component more
							 * flexible we uncommented the block. Now onwards
							 * (as previous) the developer can get the value
							 * from server in dd/mm/YYYY format and when the
							 * setValue method will be called it will set the
							 * value in user preferred format.It is also ensured
							 * that after resetting the form the changes will
							 * reflect.
							 */
							// CHG_FF_ENHQ2 Starts.
							// CBX_FW_Q112F_099 updated for CBX_FW_Q112F_057
							// Starts
							/**
							 * The below code has been commented for while
							 * setting the datefield,no need to converting it in
							 * user preferred format as the setValue method in
							 * turn converts to user preferred format
							 */
							/*
							 * this.value = cbx.jsutil
							 * 
							 * .convertDateValueToUserPreferedFmt(this.value);
							 */
							// CBX_FW_Q112F_099 updated for CBX_FW_Q112F_057 Ends
							// CHG_FF_ENHQ2 Ends
							// CBX_FW_Q112F_057 Ends
							if (cbx.jsutil.convertDateValueToUserPreferedFmt(this.value) == "error") {  // CBX_FW_Q112F_099 updated for CBX_FW_Q112F_057
								this.error = true;
								this.value = '';
							}
						}
					},
					// CHG_MIN_MAX_DATE starts
	/**
	 * Private method, will be called internally to update the minimum and
	 * maximum date to be allowed from the date picker, if configured.
	 */
	updateDateAttributes: function(){
		if (!Ext.isEmpty(this.maxValueDate)) {
			if (Ext.isDate(this.maxValueDate)) {
				this.maxValue = this.maxValueDate;
			}
			if (Ext.isString(this.maxValueDate)) {
				this.setMaxValue(this.maxValueDate);
			}
		}
		if (!Ext.isEmpty(this.minValueDate)) {
			if (Ext.isDate(this.minValueDate)) {
				this.minValue = this.minValueDate;
			}
			if (Ext.isString(this.minValueDate)) {
				this.setMinValue(this.minValueDate);
			}
		}
	},
					/**
					 * Method expected to receive the data from additionaldata
					 * attribute and parses the data according to
					 * rawtype(rawkeys and rawValues)
					 */
					// CHG001 starts
				/*
				 * CHG_MIN_MAX_DATE Update the method now to not only deal with
				 * disabled dates but other similar date attirbutes
				 */	
	populateAddData : function (items, key){
		var rawDataArray = [];
		if (items != "" && items != null) {
			for ( var i = 0; i < items.length; i++) {
				if (items[i]['rawKey'] === key) {
					// CBX_FW_Q112F_098 Starts
					// Intended to convert the
					// disabled date value to
					// preferred user format
					rawDataArray.push(items[i]["rawValue"]);
					// CBX_FW_Q112F_098 Ends
				}
			}
		}
		return rawDataArray;
	},
	// CBX_FW_Q112F_098 Starts
	/**
	 * Methods directly ties up with the additional data format of Form FW and
	 * is responsible for parsing the provided additional data and repopulate
	 * the date field attributes like disabled date, min and max dates.
	 */
	rePopulateAdditionaldata : function (additionalData){
		var valueArr=null;
		 if(this.disabledDates==null){
			valueArr= this.populateAddData(additionalData, 'DISABLED_DATES');
			if (valueArr != null && valueArr.length>0) {
				this.setDisabledDates(valueArr, null, false);
			}
		 }
		 if (this.maxValueDate == null || this.maxValueDate === '') {
			valueArr = this.populateAddData(additionalData, 'MAX_DATE');
			if (valueArr != null && valueArr.length>0) {
				this.maxValueDate = valueArr[0];
			}
		 }
		 if (this.minValueDate == null || this.minValueDate === '') {
			valueArr = this.populateAddData(additionalData, 'MIN_DATE');
			if (valueArr != null && valueArr.length>0) {
				this.minValueDate = valueArr[0];
			}
		 }
		this.updateDateAttributes();
	},
	// CHG_MIN_MAX_DATE ends
										// CBX_FW_Q112F_098 Ends
										// CHG001 ends
					 /*
						 * Sets the format of this datefield &#46; @param
						 * {String} f The format string value to set Supported
						 * Formats are 'd/m/Y' (defaults to this format) eg:
						 * 04/11/08 - 4th November 2008 'm/d/Y' eg: 07-11-08 -
						 * 7th November 2008 'd-m-y' eg: 07-11-08 - 7th November
						 * 2008 'd-m-Y' eg: 06-11-2008 - 6th November 2008
						 * 'd.m.Y' eg: 06.11.2008 - 6th November 2008 'd.m.y'
						 * eg: 06.11.08 - 6th November 2008 'm.d.Y' eg:
						 * 11.05.2008 - 5th November 2008 'm.d.y' eg: 11.05.08 -
						 * 5th November 2008
						 */
					setFormat : function(f) {
						this.format = f;
					},
					setValue : function(date,isClear) {
						if(isClear==true){
							var obj=this.manager.handlerEvent('cbxdateclear', this.name,date);   
						}
						var that = this;
						// Before setting the value for the date field clearing
						// the invalid icon.
						this.clearInvalid(); // CBX_FW_Q112F_050
						var commonbundle = CRB.getFWBundle();
						if (this.disabledDates != null
								&& this.disabledDates.length > 0) {
							for ( var i = 0; i < this.disabledDates.length; i++) {
								if (date == cbx.jsutil
										.convertDateValueToUserPreferedFmt(this.disabledDates[i])) {
									var errorMessageWindow = new iportal.Dialog(
											{
												dialogType : 'ERROR',
												message : commonbundle['LBL_SELECTED']
														+ " "
														+ this.fieldLabel
														+ " "
														+ commonbundle['LBL_DATE_IS_HOLIDAY'],
												cls : 'portal_neg_btn',
												title : commonbundle['LBL_ERROR'],
												okHandler : function() {
													errorMessageWindow.close();
													that.setValue("");
												}
											});
									errorMessageWindow.show();
								}
							}
						}
					 // CBX_FW_Q112F_099 Starts
					 // Convert the date to preferred user format before
						// setting the date value
						return cbx.formElement.DateField.superclass.setValue.call(this,this.formatDate(cbx.jsutil.convertDateValueToUserPreferedFmt(date)));
					// CBX_FW_Q112F_099 Ends
					},
					// Error handling method to validate the date field
					dataErrorHandler : function() {
						this.error = false;						
						//CHG TRADE POC STARTS
						if(this.handleError){	
						this.markInvalid(CRB.getFWBundle() && CRB.getFWBundle()['ERR_INVALID_DATE'] ? CRB.getFWBundle()['ERR_INVALID_DATE']:'ERR_INVALID_DATE');// CHG_FF_ENH
						}
						//CHG TRADE POC Ends
						return;
					},
					getPrintData : function() {
						var label = this.fieldLabel;
						var fieldValue = this.getValue();
						if (Ext.isDate(fieldValue)) {
							fieldValue = fieldValue.format(this.format);
						}
						var printMap = {};
						printMap[label] = fieldValue;
						return printMap;
					},
					//CBXFW_DIT_77 Starts
					/**
					 * Updates the screen data in the ScreenView
					 */
					getScreenViewData:function()
					{
						return cbx.jsutil.convertDateValueToUserPreferedFmt(this.getValue());
					},
					afterRender:function()
					{
						this.updateScreenViewData(this);
						cbx.formElement.DateField.superclass.afterRender.apply(
								this, arguments);
					},
					//CBXFW_DIT_77 Ends
					/**
					 * Override the onRender method to store the format of the
					 * datefield in plainValue.
					 */
					onRender : function() {
						cbx.formElement.DateField.superclass.onRender.apply(
								this, arguments);
						// var name = this.name || this.el.dom.name;
						if (this.value) {
							this.plainValue = this.formatHiddenDate(this
									.parseDate(this.value));
						} else {
							this.plainValue = this.oldValue;
						}
						this.el.on({
							keyup : {
								scope : this,
								fn : this.updateHidden
							},
							blur : {
								scope : this,
								fn : this.updateHidden
							}
						});
						this.setValue = this.setValue
								.createSequence(this.updateHidden);
					}
					// Ensure that once the field is disabled, the hidden
					// uniquely formatted data also dont get posted
					,
					onDisable : function() {
						cbx.formElement.DateField.superclass.onDisable.apply(
								this, arguments);
						/*
						 * 
						 * if(this.hiddenField) {
						 * 
						 * this.hiddenField.dom.setAttribute('disabled','disabled'); }
						 * 
						 */
					}
					// do the reverse on enabling
					,
					onEnable : function() {
						cbx.formElement.DateField.superclass.onEnable.apply(
								this, arguments);
					}
					// formats the hidden stored date with submit format
					// specified
					,
					formatHiddenDate : function(date) {
						return Ext.isDate(date) ? Ext.util.Format.date(date,
								this.submitFormat) : date;
					}
					// method to store the datefield with latest data clicked.
					// This method will be
					// called on every events which can alter the value od
					// datefield.
					,
					updateHidden : function() {
						this.plainValue = this
								.formatHiddenDate(this.getValue());
						/**CBXQ213U09 - Starts*/
						/*if (Ext.isEmpty(this.plainValue)) {
							this.plainValue = this.oldValue;
						}*/
						/**CBXQ213U09 - Ends*/
						this.syncModelData();
						if (this.error) {
							this.dataErrorHandler();
						}

					},
					syncModelData : function() {
						//CHG_MULTIFORM Starts
						if(!Ext.isEmpty(this.multiInd) && this.multiInd==true && !Ext.isEmpty(this.index)){
							this.model.updateValue(this.name, this.plainValue,undefined,this.index,this.multiFormId);
						}else{
							this.model.updateValue(this.name, this.plainValue);	
						}
						//CHG_MULTIFORM Ends
						this.updateScreenViewData(this);//CBXFW_DIT_77
					},
					// default override for isVisible
					isVisible : function() {
						return cbx.formElement.DateField.superclass.isVisible
								.apply(this, arguments);
					},
					// CBX_FW_Q112F_013 Starts
					validate:function(){
						if (!this.disabled && (this.el.dom.className.indexOf('errorBg')!=-1 || this.el.dom.className.indexOf(this.invalidClass) != -1)) {
						return false;
						}
						if(this.disabled || this.validateValue(this.processValue(this.getRawValue()))){
						           this.clearInvalid();
						           return true;
						       }
						       return false;
						},
						// CBX_FW_Q112F_013 Ends
					validateValue : function(value) {
						if (this.minValue) {
							this.minValue.setHours(0);
							this.minValue.setMinutes(0);
							this.minValue.setSeconds(0);
							this.minValue.setMilliseconds(0);
						}
						value = this.formatDate(value);
						if (!cbx.formElement.DateField.superclass.validateValue
								.call(this, value)) {
							return false;
						}
						if (value.length < 1) { // if it's blank and textfield
												// didn't flag it then it's
												// valid
							return true;
						}
						var svalue = value;
						value = this.parseDate(value);
						if (!value) {
							this.markInvalid(String.format(this.invalidText,
									svalue, this.format));
							return false;
						}
						var time = value.getTime();
						if (this.minValue && time < this.minValue.getTime()) {
							this.markInvalid(String.format(this.minText, this
									.formatDate(this.minValue)));
							return false;
						}
						if (this.maxValue && time > this.maxValue.getTime()) {
							this.markInvalid(String.format(this.maxText, this
									.formatDate(this.maxValue)));
							return false;
						}
						if (this.disabledDays) {
							var day = value.getDay();
							for ( var i = 0; i < this.disabledDays.length; i++) {
								if (day === this.disabledDays[i]) {
									this.markInvalid(this.disabledDaysText);
									return false;
								}
							}
						}
						var fvalue = this.formatDate(value);
						if (this.ddMatch && this.ddMatch.test(fvalue)) {
							this.markInvalid(String.format(
									this.disabledDatesText, fvalue));
							return false;
						}
						return true;
					},
					clearDate : function(fieldObj) {
						fieldObj.setValue('',true);
						if (fieldObj.menu)
							fieldObj.menu.hide();
						fieldObj.clearInvalid();
					},
					//converts all holiday dates to timestamps numbers for faster calculations and splits their attributes into separate arrays
					parseHolidayDatesToNumbers : function(objarr) {
				    	//date,text,class
				    	var converted = [[],[]], i=0, il=objarr.length;
				    	for (;i<il;++i) {
				    	converted[0][i] = objarr[i].date.clearTime().getTime();
				    	converted[1][i] = (objarr[i].text ? objarr[i].text : this.holidayDatesText);
				    	}
				    	return converted;
				    	},
				    	/**
				    	 * This method is vital to set the holiday dates of the component. It formats the holidaydates and parses 
				    	 * the holiday dates for color coding.
				    	 */
					setHolidayDates:function(holidayDatesArr) {
						var formattedDataArray = [];
						if (!Ext.isEmpty(holidayDatesArr) && Ext.isArray(holidayDatesArr)) {
							for ( var i = 0; i < holidayDatesArr.length; i++) {	
								var formatDate=this.formatHolidayDate(holidayDatesArr[i]);
								if(!Ext.isEmpty(formatDate)){
								formattedDataArray.push({
									text: holidayDatesArr[i] && holidayDatesArr[i].description ? holidayDatesArr[i].description:this.holidayDatesText, 
									date: formatDate
								});
								}	 
							}
						}						
						this.holidayList=formattedDataArray;
						this.parsedHolidayDates=this.parseHolidayDatesToNumbers(formattedDataArray);
				        if(this.menu){
				            this.menu.picker.setHolidayList(formattedDataArray);
				            this.menu.picker.setParsedholidaydates(this.parsedHolidayDates);
				        }
					},
					 /**
						 * Replaces any existing disabled dates with new values
						 * and refreshes the DatePicker.
						 * 
						 * @param {Array}
						 *            disabledDates An array of date strings
						 */
					setDisabledDates :function(disabledDateArr,disabledDateArrText,parsed) {
						var formattedDataArray = [];
					if(parsed){
						 this.disabledDates = disabledDateArr;
					}	
					else
						{
						if (!Ext.isEmpty(disabledDateArr)) {
							for ( var i = 0; i < disabledDateArr.length; i++) {
								formattedDataArray.push(cbx.jsutil.convertDateValueToUserPreferedFmt(disabledDateArr[i]));								
							}
						}
						 this.disabledDates = formattedDataArray;
					}
						 if(!Ext.isEmpty(disabledDateArrText)){
							 this.disabledDatesText=CRB.getFWBundle() && CRB.getFWBundle()['LBL_' + disabledDateArrText] ? CRB.getFWBundle()['LBL_' + disabledDateArrText]: disabledDateArrText;
						 }
					        this.initDisabledDays();
					        if(this.menu){
					            this.menu.picker.setDisabledDates(this.disabledDatesRE);
					        }	
					},
					//This method is to format the holiday date to the user preferred format.
					formatHolidayDate:function(holidayDate){
						if(!Ext.isEmpty(holidayDate) && holidayDate.date){
							try{
							var formateDate=Ext.isString(cbx.jsutil.convertDateValueToUserPreferedFmt(holidayDate.date)) ? this.parseDate(cbx.jsutil.convertDateValueToUserPreferedFmt(holidayDate.date)) :cbx.jsutil.convertDateValueToUserPreferedFmt(holidayDate.date);
								return formateDate;
							}catch(err){
								return '';
							}
						}else{
							return '';
						}
					},
				    /**
					 * Replaces any existing <tt>{@link #disabledDatesText}</tt>
					 * with the new value.
					 */
					setDisabledDatesText :function(disabledDateArrText) {
						 if(!Ext.isEmpty(disabledDateArrText)){
							 this.disabledDatesText=CRB.getFWBundle() && CRB.getFWBundle()['LBL_' + disabledDateArrText] ? CRB.getFWBundle()['LBL_' + disabledDateArrText]: disabledDateArrText;
						 }	
					},
					/**
					 * Replaces any existing <tt>{@link #minValue}</tt> with
					 * the new value and refreshes the DatePicker.
					 * Input must be in Date object. If it is String parameter then it should be in MM/DD/YYYY format. // DIT_934
					 * @param {Date}
					 *            value The minimum date that can be selected
					 */
					   setMinValue : function(dt){
						   if(!Ext.isEmpty(dt)){
						   	/**
							*CHG_MIN_MAX_DATE: Updated to code to convert the string
				 			* passed assuming in DD/MM/YYYY format in date object
							*/
							   if(Ext.isString(dt)){
							   dt = cbx.jsutil.convertStringToDateObject(dt);// //CHG_MIN_MAX_DATE
							   }
						   }
				        this.minValue = (Ext.isString(dt) ? this.parseDate(dt) : dt);
				        if(this.menu){
				            this.menu.picker.setMinDate(this.minValue);
				        }
				    },
				    /**
					 * Replaces any existing <tt>{@link #maxValue}</tt> with
					 * the new value and refreshes the DatePicker.
					 * Input must be in Date object. If it is String parameter then it should be in MM/DD/YYYY format. //DIT_934
					 * 
					 * @param {Date}
					 *            value The maximum date that can be selected
					 */
				    setMaxValue : function(dt){
				    	 if(!Ext.isEmpty(dt)){
					 	/**
						*CHG_MIN_MAX_DATE: Updated to code to convert the string
				 		* passed assuming in DD/MM/YYYY format in date object
						*/
				    		 if(Ext.isString(dt)){
							  dt = cbx.jsutil.convertStringToDateObject(dt);// CHG_MIN_MAX_DATE
				    		 }
						   }
				        this.maxValue = (Ext.isString(dt) ? this.parseDate(dt) : dt);
				        if(this.menu){
				            this.menu.picker.setMaxDate(this.maxValue);
				        }
				    },
				    // CBX_FW_Q112F_098 Ends
					// override to implement clear button inside datepicker
					onTriggerClick : function() {
						if (this.disabled) {
							return;
						}
						if (this.menu == null) {
							this.menu = new Ext.menu.DateMenu({
								hideOnClick : false,
								focusOnSelect : false
							});
						}
						this.onFocus();
						Ext.apply(this.menu.picker, {
							minDate : this.minValue,
							maxDate : this.maxValue,
							disabledDatesRE : this.disabledDatesRE,
							disabledDatesText : this.disabledDatesText,
							disabledDays : this.disabledDays,
							disabledDaysText : this.disabledDaysText,
							nationalHolidaysCls: this.nationalHolidaysCls, //setting the holiday cls as an additional attribute.
							weekEndCls: this.weekEndCls,//setting the CSS class that should be applied for week ends
							markNationalHolidays:this.markNationalHolidays, //Boolean value for holiday color coding. only executes if this attribute is true
							nationalHolidays:this.holidayList, //Maintaining the holiday list.
							weekEndList:this.weekEndList,
							weedEndText:this.weedEndText,
							format : this.format,
							showToday : this.showToday,	
							minText : ((!Ext.isEmpty(this.minValue) && !Ext.isEmpty(this.maxValue)) &&  this.minValue.getDate()===this.maxValue.getDate()) ? String.format("The date in this field must be equal to  {0} ", this
										.formatDate(this.minValue))
										: String.format(this.minText, this.formatDate(this.minValue)), 
				    		
							maxText : ((!Ext.isEmpty(this.minValue) && !Ext.isEmpty(this.maxValue)) &&  this.minValue.getDate()===this.maxValue.getDate()) ? String.format("The date in this field must be equal to {0} " , this
										.formatDate(this.maxValue)) : String.format(this.maxText, this.formatDate(this.maxValue))		
									
						});
						this.menu.on(Ext.apply({}, this.menuListeners, {
							scope : this
						}));
						var that = this;
						this.menu.picker
								.setValue(this.getValue() || new Date());
						this.menu.picker.clearFn = function() {
							that.clearDate(that);
						};
						//setting the holidays and parsed holidays after date picker rendering.
						if(this.menu){
							this.menu.picker.setHolidayList(that.holidayList);
							this.menu.picker.setParsedholidaydates(that.parsedHolidayDates);
						}
						this.menu.show(this.el, "tl-bl?");
						this.menuEvents('on');
					},
					// CBX_FW_Q112F_057 Starts.
					/**
					 * The method has been added to ensure that after resetting
					 * the form the value of the date field should reset in the
					 * user preferred format only.
					 */
					  reset : function(){
						  cbx.formElement.DateField.superclass.reset.call(this);
					      this.applyValue(this.oldValue);
				    },
				    /**
					 * private method:applyValue
					 * 
					 * @param date(format
					 *            dd/MM/YYYY) This method will set the raw value
					 *            in the date field in the user preferred
					 *            format.
					 */
					applyValue:function(date){
						var that=this;
						setTimeout(function(){
							that.setRawValue(cbx.jsutil.convertDateValueToUserPreferedFmt(date));
						},100);	
						
					},//CHG033_67641 starts
				// CBX_FW_Q112F_057 Ends
				    onSelect: function(m, d){
				    	this.setValue(d);
				    	this.fireEvent('select', this, d);
				    	var that=this;
				    	setTimeout(function(){
							that.manager.handlerEvent('cbxafterselect', that.name, that.plainValue);

						},50)
				    	this.menu.hide();
				    }
				    //CHG033_67641 ends
				});

Ext.reg('cbx-datefield', cbx.formElement.DateField);

/**
 * This class is an extension of Ext.form.DateField class
 */
cbx.formElement.StaticDateField = function(config) {
	this.plainLabel = config.plainLbl;
	this.fieldLabel = config.displayNmKey;
	this.name = config.itemId;
	//CHG_MULTIFORM Starts
	if(!Ext.isEmpty(config.multiInd) && config.multiInd==true && !Ext.isEmpty(config.index)){
		this.value = config.model.getModelData()[config.multiFormId][config.itemId][config.index] || "";
	}else{
		this.value = config.model.getModelData()[config.itemId] || "";	
	}
	//CHG_MULTIFORM Ends
	this.required = config.requiredInd;
	this.conditional = config.conditionalInd;
	this.readOnly = config.readOnlyInd === 'Y' ? true : false;
	this.hidden = config.visibleInd === 'Y' ? false : true;
	cbx.formElement.StaticDateField.superclass.constructor.call(this, config);
};

Ext.extend(cbx.formElement.StaticDateField, Ext.form.DateField, {
	/**
	 * @cfg {String/Object} required ,to specify whether this field is mandatory
	 *      (defaults to N)
	 */
	required : 'N',

	/**
	 * @cfg {Object} bundleKey ,key used by resource to lookup bundle(defaults
	 *      to '')
	 */
	bundleKey : '',
	plainValue : '',
	/**
	 * @cfg {Object} submitFormat ,this is the format used for submitting the
	 *      data irrespective of the preferences settings and display.
	 */
	submitFormat : 'd/m/y',
	cls : 'canvas-staticdatefield',
	// private
	initComponent : function() {
		this.triggerField = true;
		//CBXFW_DIT_77 starts
		this.on('hide',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'N']));
		this.on('show',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'Y']));
		//CBXFW_DIT_77 ends
		this.maxLength = undefined;
		this.minLength = undefined;
		cbx.formElement.StaticDateField.superclass.initComponent.apply(this,
				arguments);
		var bundle;
		var commonbundle = CRB.getFWBundle();
		// This is an ext bug as when in IE dont like name and id to be same in
		// datefields
		// which are manipulating with menu listeners.
		this.format =canvas.datePreferences.getDateFormat();
		// To get the bundle key reference
		bundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));
		/**
		 * If the plainLabel attribute is not null ,component's field label will
		 * be the plain-label else the label associated with bundle keys will be
		 * referred to get the field label.
		 */
		if (!Ext.isEmpty(this.plainLabel)) {
			this.fieldLabel = this.plainLabel;
		} else {
			this.fieldLabel = bundle['LBL_' + this.fieldLabel];
		}
		/**
		 * If the conditional attribute is Y the components field label will be
		 * field label associated with two stars
		 */
		if (this.conditional === 'Y') {
			this.allowBlank = false;
			if (Ext.isEmpty(this.fieldLabel)) {
				//CHG_TRADE_POC Starts
				this.fieldLabel = '?' + this.fieldLabel + '?';
				//CHG_TRADE_POC Ends
			} else {
				//CHG_TRADE_POC Starts
				this.fieldLabel = this.fieldLabel;
				//CHG_TRADE_POC Ends
			}
		}
		/**
		 * If the required attribute is Y,components field label will be field
		 * label associated with mandatory star and the field will not allow
		 * blank values.
		 */
		else if (this.required === 'Y') {
			if (Ext.isEmpty(this.fieldLabel)) {
				//CHG_TRADE_POC Starts
				this.fieldLabel = '?' + this.fieldLabel + '?';
				//CHG_TRADE_POC Ends
			} else {
				//CHG_TRADE_POC Starts
				this.fieldLabel = this.fieldLabel;
				//CHG_TRADE_POC Ends
			}
		} else {
			if (Ext.isEmpty(this.fieldLabel)) {
				this.fieldLabel = '?' + this.fieldLabel + '?'
						+ '<span class = \'non_mandatory\'"></span>';
			} else {
				this.fieldLabel = this.fieldLabel
						+ '<span class = \'non_mandatory\'"></span>';
			}
		}
		var that = this;
		this.readOnly = true;
		this.style = 'border:none;padding-left:0px;background: transparent;cursor: default;';  //CBXQ413F20
		this.triggerClass = 'invisibleClass';
		this.onTriggerClick = Ext.emptyFn;
		this.labelSeparator = '';
		this.anchor = (this.anchor == undefined) ? '' : this.anchor;
		// This is to ensure that the select on date menu is actually bubbling
		// it to date field, as whoever using
		// the datefield maynot be directly interacting with menu.
		this.menuListeners = {
			select : function(m, d) {
				// //alert(d);
				that.setValue(d.format(that.format));
				that.fireEvent('select', that);
			},
			show : function() {
				that.onFocus();
			},
			hide : function() {
				that.focus.defer(10, that);
				var ml = that.menuListeners;
				that.menu.un("select", ml.select, that);
				that.menu.un("show", ml.show, that);
				that.menu.un("hide", ml.hide, that);
			}
		};
		if (this.value) {
			// CBX_FW_Q112F_099 updated for CBX_FW_Q112F_057 Starts
			/**
			 * The below code has been commented for while setting the
			 * datefield,no need to converting it in user preferred format as
			 * the setValue method in turn converts to user preferred format
			 */
			/*
			 * this.value = cbx.jsutil
			 * 
			 * 
			 * 
			 * .convertDateValueToUserPreferedFmt(this.value);
			 */
			
			if (cbx.jsutil

					.convertDateValueToUserPreferedFmt(this.value) == "error") {
				// CBX_FW_Q112F_099 updated for CBX_FW_Q112F_057 Ends
				this.value = '';
			}
		}
		this.tabIndex = 99999996; //CBXQ313F37
	},

	/**
	 * Sets the format of this datefield &#46;
	 * 
	 * @param {String}
	 *            f The format string value to set Supported Formats are 'd/m/Y'
	 *            (defaults to this format) eg: 04/11/08 - 4th November 2008
	 *            'm/d/Y' eg: 07-11-08 - 7th November 2008 'd-m-y' eg: 07-11-08 -
	 *            7th November 2008 'd-m-Y' eg: 06-11-2008 - 6th November 2008
	 *            'd.m.Y' eg: 06.11.2008 - 6th November 2008 'd.m.y' eg:
	 *            06.11.08 - 6th November 2008 'm.d.Y' eg: 11.05.2008 - 5th
	 *            November 2008 'm.d.y' eg: 11.05.08 - 5th November 2008
	 */
	setFormat : function(f) {
		this.format = f;
	},
	//CHG TRADE POC STARTS
	validate:function(){
		return true;
	},
	//CHG TRADE POC ENDS
	setValue : function(date) {
		if (this.readOnly = true && Ext.isEmpty(date)) {   //CHG_TRADE_POC
			this.value='--';
			this.syncModelData();
			return Ext.form.DateField.superclass.setValue.call(this, "--");
		}
		// CBX_FW_Q112F_099 Starts
		// Convert the date to preferred user format before setting the date
		// value
		this.value=this.formatDate(cbx.jsutil.convertDateValueToUserPreferedFmt(date)); //CBXFW_DIT77
		this.syncModelData(); //CBXFW_DIT_77
		return Ext.form.DateField.superclass.setValue.call(this,this.formatDate(cbx.jsutil.convertDateValueToUserPreferedFmt(date)));
		// CBX_FW_Q112F_099 Ends

	},
	syncModelData : function() {
		this.updateScreenViewData(this);//CBXFW_DIT_77
	},	
	//CBXQ413F21 starts
	validate:function(){
		return true;
		},
	//CBXQ413F21 Ends
	//CBX_FW_Q112F_099  Starts
	setMinValue : function(dt){
		return;
	},
	setMaxValue : function(dt){
		return;
	},
	// CBX_FW_Q112F_099 Ends
	markInvalid : function(m) {
		return true;
	},
	// Override the onRender method to insert a hidden field to store the format
	// of the
	// datefield.
	onRender : function() {
		cbx.formElement.StaticDateField.superclass.onRender.apply(this,
				arguments);
	}
	// Ensure that once the field is disabled, the hidden uniquely formatted
	// data also dont get posted
	,
	onDisable : function() {
		cbx.formElement.StaticDateField.superclass.onDisable.apply(this,
				arguments);
	}
	// do the reverse on enabling
	,
	onEnable : function() {
		cbx.formElement.StaticDateField.superclass.onEnable.apply(this,
				arguments);
	},
	// method to store the datefield with latest data clicked. This method will
	// be
	// called on every events which can alter the value od datefield.
	getPrintData : function() {
		var label = this.fieldLabel;
		var fieldValue = this.getValue();
		if (Ext.isDate(fieldValue)) {
			fieldValue = fieldValue.format(this.format);
		}
		var printMap = {};
		printMap[label] = fieldValue;
		return printMap;
	}
	//CBXFW_DIT_77 starts
	,getScreenViewData:function()
	{
		return this.value;
	},
	afterRender:function(){
		this.updateScreenViewData(this);
		cbx.formElement.StaticField.superclass.afterRender.apply(this,
				arguments);
		this.el.dom.readOnly=true; // CHG001_68797
	}
	//CBXFW_DIT_77 ends
});
Ext.reg('cbx-staticdatefield', cbx.formElement.StaticDateField);

/**
 * This class is expected to do "Return to a New Line".
 */
cbx.formElement.RowClear = Ext.extend(Ext.Container, {
	height : 50,
	anchor : '100%',
	colspan : 100
});
Ext.reg('cbx-rowclear', cbx.formElement.RowClear);
/**
 * This class is expected to do "Return to a New Line".
 */
cbx.formElement.EmptyCell = Ext.extend(Ext.Container, {
	// anchor : '100%'
});
Ext.reg('cbx-emptycell', cbx.formElement.EmptyCell);
cbx.formElement.InfoPanel = function(config) {
	this.plainLabel = config.plainLbl;
	this.fieldLabel = config.displayNmKey;
	this.name = config.itemId;
	this.html = config.model.getModelData()[config.itemId] || '';
	this.hidden = config.visibleInd === 'Y' ? false : true;
	cbx.formElement.InfoPanel.superclass.constructor.call(this, config);
};
Ext.extend(cbx.formElement.InfoPanel, Ext.Panel, {
	initComponent : function() {
		//CBXFW_DIT_77 starts
		this.on('hide',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'N']));
		this.on('show',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'Y']));
		//CBXFW_DIT_77 ends
		var totalColumns = !Ext.isEmpty(this.totalColumns) ? this.totalColumns
				: 1;
		var defaultConfig = {
			layout : 'tableform',
			layoutConfig : {
				columns : totalColumns
			},
			anchor : '100%',
			ctCls : 'infopanel-cwrap',
			cls : 'infopanel',
			// style:'border-width: 1px;',
			forceLayout : true,
			renderHidden : true,
			defaults : {
				layout : 'tableform',
				anchor : '100%',
				border : true,
				autoHeight : true
			}
		};
		Ext.apply(this, defaultConfig);
		var bundle;
		var commonbundle = CRB.getFWBundle();
		// To get the bundle key reference
		bundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));
		if (!Ext.isEmpty(this.plainLbl)) {
			this.title = this.plainLbl;
		} else if (Ext.isEmpty(this.fieldLabel)) {
			this.title = '';
			this.collapsible = false;
		} else {
			this.title = bundle['LBL_' + this.fieldLabel];
		}
		cbx.formElement.InfoPanel.superclass.initComponent.call(this);
	},
	onRender : function(ct, position) {
		cbx.formElement.InfoPanel.superclass.onRender.call(this, ct, position);
	},
	afterRender : function(ct, position) {
		this.updateScreenViewData(this); //CBXFW_DIT_77
		cbx.formElement.InfoPanel.superclass.afterRender.call(this, ct,
				position);
		// Reformation of layout after rendering the field items inside panel.
		this.ownerCt.doLayout();
	},
	setValue : function(value) {
		this.update(value);
		this.doLayout();
		this.syncModelData();//CBXFW_DIT_77
	},
	getValue : function() {
		return this.html;
	},
	//CBXFW_DIT_77 starts
	/**
	 * Updates the screen data in the ScreenView
	 */
	getScreenViewData:function()
	{
		return this.html;
	},
	/**
	 * Method updates the modal with fieldname and current value
	 */
	syncModelData : function() {
		this.model.updateValue(this.name, this.getValue());
		this.updateScreenViewData(this);
	}
	//CBXFW_DIT_77 ends
});
Ext.reg('cbx-panel', cbx.formElement.InfoPanel);
cbx.formElement.LazzyPanel = Ext.extend(Ext.Panel, {
	initComponent : function() {
		//CBXFW_DIT_77 starts
		//LABEL_CHAR_COUNT starts
		this.labelWidth=parseInt(iportal.preferences.getDefaultLabelWidth());
		if(this.labelAlignType=='left' || this.findParentByType('cbx-formpanel').labelAlignType=='left'){
			if(this.labelCharCount!="" && parseInt(this.labelCharCount)==this.labelCharCount){
				this.labelWidth=parseInt(iportal.preferences.getLabelCharWidth()*parseInt(this.labelCharCount));
			}
		}
		//LABEL_CHAR_COUNT ends	
		
		this.on('hide',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'N']));
		this.on('show',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'Y']));
		//CBXFW_DIT_77 ends
		// this.title=this.plainLbl || this.fieldLabel;
		var bundle;
		var commonbundle = CRB.getFWBundle();
		// To get the bundle key reference
		bundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));
		if (!Ext.isEmpty(this.plainLbl)) {
			this.title = this.plainLbl;
		} else if (Ext.isEmpty(this.displayNmKey)) {
			this.title = '';
			this.collapsible = false;
		} else {
			this.title = bundle['LBL_' + this.displayNmKey];
		}
		// this.style='border-width: 1px;';
		this.name = this.itemId;
		// calculating the total columns as per the metadata
		var totalColumns = !Ext.isEmpty(this.totalColumns) ? this.totalColumns
				: 1;
		//CHG_TRADE_POC Starts
		if(!this.border){
			this.borderWidth='border-width: 0px;';
			this.border=false;
		}else{
			this.borderWidth='border-width: 1px;';
		}
		//CHG_TRADE_POC Ends
		var defaultConfig = {
			itemId : this.itemId,
			name : this.itemId,
			title : this.title,
			collapsible : false,
			items : this.createItems(),
			layout : 'tableform',
			layoutConfig : {
				columns : totalColumns
			},
			style : this.borderWidth, //CHG_TRADE_POC
			ctCls : Ext.isEmpty(this.ctCls)? 'infopanel-cwrap':this.ctCls ,  //CHG_TRADE_POC
			cls : Ext.isEmpty(this.cls)? 'infopanel':this.cls,    //CHG_TRADE_POC
			anchor : '100%',
			forceLayout : true,
			renderHidden : true,
			defaults : {
				layout : 'tableform',
				anchor : '100%',
				border : true,
				autoHeight : this.autoHeightRemove ? undefined:true  //CHG_TRADE_POC
			}
		};
		Ext.apply(this, defaultConfig);
		// call parent initComponent
		cbx.formElement.LazzyPanel.superclass.initComponent.call(this);
	},
	createItems : function() {
		/**
		 * Configuration Parameters like formId,model,mode and manger passed to
		 * formcreator to retrieve the children from the metadata
		 */
		var config = {
			formId : this.formId,
			model : this.model,
			screenView : this.screenView, //CBXFW_DIT_77
			mode : this.mode,
			manager : this.manager,
			//CHG_MULTIFORM Starts
			multiInd:this.multiFormInd,
			formIndex:this.index,
			multiFormId:this.multiFormId,
			//CHG_MULTIFORM Ends
			preInitConfig : this.preInitConfig
		};
		if (this.children != null) {
			config.metadata = {
				totalColumns : 1 //CHG_TRADE_POC
			};
			config.metadata.children = this.children;
		}else{
			LOGGER.error('No Children configured for ', this.itemId);
			config.metadata={children:[]};
		}
		config.metadata.additionalData = this.metadata.additionalData;
		// Retrieving formfield items
		var formCreator = new cbx.form.FormCreator(config);
		return formCreator.getFormFields();
	},
	// CHOOTAB starts
	addExternalComponent:function(obj){ 
		this.add(obj);	        		
	},
	afterRender : function(ct, position) {			
		cbx.formElement.LazzyPanel.superclass.afterRender.call(this, ct,
				position);
		var obj=this.manager.handlerEvent('cbxexternalplugin', this.name);    
			if(obj!=null && obj!="" && Ext.isObject(obj)){				
		 this.addExternalComponent(obj);
			}
		// Reformation of layout after rendering the formfield items.
		this.ownerCt.doLayout();
	},
		// CHOOTAB ends
	destroy : function() {
		this.items.each(Ext.destroy, Ext); // Destroy all the fields
		LOGGER.info("DESTROYING the LAZY  PANEL");
		cbx.formElement.LazzyPanel.superclass.destroy.call(this);
	}
});
Ext.reg('cbx-lazzypanel', cbx.formElement.LazzyPanel);
cbx.formElement.cbxCompositeField = function(config) {
	this.plainLabel = config.plainLbl;
	this.fieldLabel = config.displayNmKey;
	this.hideLabel=config.hideLabel === 'Y' ? true:false;//FW-R12-08-2012-027
	cbx.formElement.cbxCompositeField.superclass.constructor.call(this, config);
};
/*
 * Ext.extend(cbx.formElement.cbxCompositeField, Ext.form.CompositeField, {
 * initComponent : function() { this.fieldLabel='Company'; Ext.apply(this,{
 * items:[ {name:'test3',xtype:'label',text:'{',style:'width:auto;'},
 * {name:'test',xtype:'textfield',style:'width:10%;'},
 * {name:'test4',xtype:'label',text:'}',style:'width:auto;'},
 * {name:'test2',xtype:'textfield',flex:1} ] });
 * cbx.formElement.cbxCompositeField.superclass.initComponent.apply(this); } });
 */
cbx.formElement.cbxCompositeField = Ext.extend(Ext.form.CompositeField, {
	combineErrors : false, //CBXQ2FW123
	initComponent : function() {
		//CBXFW_DIT_77 starts
		this.on('hide',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'N']));
		this.on('show',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'Y']));
		//CBXFW_DIT_77 ends
		var bundle;
		var commonbundle = CRB.getFWBundle();
		// To get the bundle key reference
		bundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));
		if (!Ext.isEmpty(this.plainLbl)) {
			this.fieldLabel = this.plainLbl;
		} else if (Ext.isEmpty(this.displayNmKey)) {
			this.fieldLabel = '';
		} else {
			this.fieldLabel = bundle['LBL_' + this.displayNmKey];
		}
		// ISSUE_FIX_Q2_001 - starts
		if(this.fieldLabel == ''||Ext.isEmpty(this.fieldLabel)){
			this.hideLabel =true;
		}
		// ISSUE_FIX_Q2_001 - ends
		this.name = this.itemId;
		// FW-R12-08-2012-027 - starts
		if(this.mode && (this.mode == 'view' || this.mode.global == 'view')){
			this.conditionalInd = 'N';
			this.requiredInd = 'N';
		}
		/**
		 * If the conditional attribute is Y the components field label will be
		 * field label associated with two stars
		 */
		//if(this.hideLabel==false){	// commented for CBXQ413F25
			if (this.conditionalInd === 'Y') {
					this.blankText = String.format(
						commonbundle['ERR_MANDATORY'], this.fieldLabel);
				if (Ext.isEmpty(this.fieldLabel)) {
					//CHG_TRADE_POC Starts
					this.fieldLabel = '?' + this.fieldLabel + '?'
							+ '<span class = '+((this.mode && (this.mode == 'view' || (this.mode.global &&
									this.mode.global == 'view')))?'\'cbx-mandatory-fx-view\'"':'\'cbx-mandatory-fx\'"')+'">**</span>';//SANITY_ISSUE_FIX
					//CHG_TRADE_POC Ends
				} else {
					//CHG_TRADE_POC Starts
					this.fieldLabel =this.fieldLabel
					+ '<span class = '+((this.mode && (this.mode == 'view' || (this.mode.global && 
							this.mode.global == 'view')))?'\'cbx-mandatory-fx-view\'"':'\'cbx-mandatory-fx\'"')+'">**</span>';//SANITY_ISSUE_FIX
					//CHG_TRADE_POC Ends
				}
			}
			/**
			 * If the required attribute is Y,components field label will be
			 * field label associated with mandatory star and the field will
			 * not allow blank values.
			 */
			else if (this.requiredInd === 'Y') {
				this.allowBlank=false; //CHG_TRADE_POC
				if (Ext.isEmpty(this.fieldLabel)) {
					//CHG_TRADE_POC Starts
					this.fieldLabel ='?' + this.fieldLabel + '?'
					+ '<span class ='+(this.mode && this.mode==='view'?'\'cbx-mandatory-fx-view\'"':'\'mandatory\'"')+'>*</span>';
					//CHG_TRADE_POC Ends
				} else {
					//CHG_TRADE_POC Starts
					this.fieldLabel =this.fieldLabel
					+ '<span class ='+(this.mode && this.mode==='view'?'\'cbx-mandatory-fx-view\'"':'\'mandatory\'"')+'>*</span>';
					//CHG_TRADE_POC Ends
				}
			} else {
				if (Ext.isEmpty(this.fieldLabel)) {
					this.fieldLabel = '?' + this.fieldLabel + '?'
							+ '<span class = \'non_mandatory\'"></span>';
				} else {
					this.fieldLabel = this.fieldLabel
							+ '<span class = \'non_mandatory\'"></span>';
				}
			}
		//}		// commented for CBXQ413F25
		// FW-R12-08-2012-027 - ends
		this.labelSeparator = '';// CHG001
		// FW-R12-08-2012-027 - starts
		/**
		 * Commented unreachable code
		 */
		/*
		 * // CHG_FF_ENH -- starts
		 * 
		 * 
		 * 
		 * if(this.fieldLabel==="" || this.fieldLabel===" "){
		 * 
		 * 
		 * 
		 * this.hideLabel=true; } // CHG_FF_ENHQ2 Starts
		 * 
		 */
		// FW-R12-08-2012-027 - ends
		/**
		 * *To apply the anchor for composite field.
		 */
		// CHG_FF_ENH -ends
		this.anchor = (this.anchor == undefined) ? '100%': this.anchor; 
		var defaultConfig = {
			itemId : this.itemId,
			name : this.itemId,
			title : this.title,
			collapsible : false,
			items : this.createItems(),
		    anchor : this.anchor,// CHG_FF_ENHQ2
		    forceLayout:true, // CHG_FF_ENH
		    renderHidden:true, // CHG_FF_ENH
		    flex:1 // CHG_FF_ENH
		};
		Ext.apply(this, defaultConfig);
		// // CHG_FF_ENHQ2 Ends
		// call parent initComponent
		cbx.formElement.cbxCompositeField.superclass.initComponent.call(this);
	},
	// CHG_FF_ENH Starts
	 onResize: function(adjWidth, adjHeight, rawWidth, rawHeight) {
        var innerCt = this.innerCt;
        if (this.rendered && innerCt.rendered) {
            innerCt.setSize(adjWidth, adjHeight);
        }
        cbx.formElement.cbxCompositeField.superclass.onResize.apply(this, arguments);
    },
	 onShow : function() {
       cbx.formElement.cbxCompositeField.superclass.onShow.call(this);
        this.doLayout();
    },
	doLayout: function(shallow, force) {
        if (this.rendered) {
            var innerCt = this.innerCt;
            innerCt.forceLayout = this.ownerCt.forceLayout;
            innerCt.doLayout(shallow, force);
        }
	},
	// CHG_FF_ENH Ends
	createItems : function() {
		var config = {
			formId : this.formId,
			model : this.model,
			mode : this.mode,
			screenView : this.screenView, //CBXFW_DIT_77
			//CHG_MULTIFORM Starts
			index:this.index,
			multiInd:this.multiInd,
			multiFormId:this.multiFormId,
			//CHG_MULTIFORM Ends
			manager : this.manager,
			preInitConfig : this.preInitConfig
		};
		if (this.children != null) {
			config.metadata = {
			};
			config.metadata.children = this.children;
		}else{
			LOGGER.error('No Children configured for ', this.itemId);
			config.metadata={children:[]};
		}
		config.metadata.additionalData = this.metadata.additionalData;
		// Retrieving formfield items
		var formCreator = new cbx.form.FormCreator(config);
		var fields = formCreator.getFormFields();
		var flex=0; // CHG_FF_ENH
		for ( var i = 0, len = fields.length; i < len; i++) {			
			// CHG_FF_ENH -- starts
			flex=parseInt(fields[i].anchor);
			fields[i].flex = parseInt(fields[i].anchor) / 100;
			// CBXR12Q413F02 starts
			/*
			 * isFormField for button is set true to make "BUTTON" (configured
			 * inside composite field) visible in findField() method
			 */
			if(fields[i].itemType && fields[i].itemType==="BUTTON"){
				fields[i].isFormField = true; 
			}
			// CBXR12Q413F02 ends
			// CHG_FF_ENH -- ends
		}
		return fields;
	},
	afterRenderField : function(ct, position) {
		cbx.formElement.cbxCompositeField.superclass.afterRender.call(this, ct,
				position);
		// Reformation of layout after rendering the formfield items.
		this.innerCt.doLayout();
	},	
	// CHG_FF_ENH -- starts
	/**
	 * Cascades down the component/container heirarchy from this component
	 * (called first), calling the specified function with each component. The
	 * scope (this) of function call will be the scope provided or the current
	 * component. The arguments to the function will be the args provided or the
	 * current component. If the function returns false at any point, the
	 * cascade is stopped on that branch.
	 * 
	 * @param {Function}
	 *            fn The function to call
	 * @param {Object}
	 *            scope (optional) The scope of the function (defaults to
	 *            current component)
	 * @param {Array}
	 *            args (optional) The args to call the function with (defaults
	 *            to passing the current component)
	 * @return {Ext.Container} this
	 */
    cascade : function(fn, scope, args){
        if(fn.apply(scope || this, args || [this]) !== false){
            if(this.items){
                var cs = this.items.items;
                for(var i = 0, len = cs.length; i < len; i++){
                    if(cs[i].cascade){
                        cs[i].cascade(fn, scope, args);
                    }else{
                        fn.apply(scope || cs[i], args || [cs[i]]);
                    }
                }
            }
        }
        return this;
    },
    /**
	 * Find a component under this container at any level by property
	 * 
	 * @param {String}
	 *            prop
	 * @param {String}
	 *            value
	 * @return {Array} Array of Ext.Components
	 */
    find : function(prop, value){
        return this.findBy(function(c){
            return c[prop] === value;
        });
    },
    /**
	 * Find a component under this container at any level by a custom function.
	 * If the passed function returns true, the component will be included in
	 * the results. The passed function is called with the arguments (component,
	 * this container).
	 * 
	 * @param {Function}
	 *            fn The function to call
	 * @param {Object}
	 *            scope (optional)
	 * @return {Array} Array of Ext.Components
	 */
    findBy : function(fn, scope){
        var m = [], ct = this;
        this.cascade(function(c){
            if(ct != c && fn.call(scope || c, c, ct) === true){
                m.push(c);
            }
        });
        return m;
    },
    onResize:function(){	
		 if(this.doLayout){
			 this.doLayout();
		 }
	 }
  // CHG_FF_ENH - ends
});

Ext.reg('cbx-compositefield', cbx.formElement.cbxCompositeField);


cbx.formElement.Label = function(config) {
	
	this.name = config.itemId;
	this.plainLabel = config.plainLbl;
	this.copyPasteInd=config.copyPasteInd; //DIT_108- get the copyPasteInd from config object

	this.required = config.requiredInd; // Added for iSolve SIT - #773 -/ IR_ENHANCEMENTS_001
	//CHG_MULTIFORM Starts
	if(!Ext.isEmpty(config.multiInd) && config.multiInd==true && !Ext.isEmpty(config.index)){
		this.labelText = config.model.getModelData()[config.multiFormId][config.itemId][config.index] || "";
	}else{
		this.labelText = config.model.getModelData()[config.itemId] || "";	
	}
	//CHG_MULTIFORM Ends
	this.fieldLabelText = config.displayNmKey; // CBX_FW_Q112F_032
	this.cls = config.cls || '';  // CHG_FF_ENH
	
	this.hidden = config.visibleInd === 'Y' ? false : true; //CHG001_68530
	//CBXQ2FW143 Starts
	/**
	Getting the conditional indicator as a parameter
	*/
	this.conditional=config.conditionalInd;
	//CBXQ2FW143 Ends
	cbx.formElement.Label.superclass.constructor.call(this, config);
};

Ext.extend(cbx.formElement.Label, Ext.form.Label, {
	isFormField : true,
	/**
	 * @cfg {Object} bundleKey ,key used by resource to lookup bundle(defaults
	 *      to '')
	 */
	bundleKey : '',
	//CBXQ2FW123 Starts
	/**
	The height for the label field has been calculated as per the element.
	But in large font some the fields got truncated.So the height has been set to 17
	pixels as per the designer's choice
	*/
	height:17,
	//CBXQ2FW143 Ends
	// private
	initComponent : function() {
		this.hideLabel = true;
		//CBXFW_DIT_77 starts
		this.on('hide',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'N']));
		this.on('show',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'Y']));
		//CBXFW_DIT_77 ends
		// CHG_FF_ENH -- starts
		// this.cls='cbx-formfw-label'; CBTQ3Q4_Label commented
		cbx.formElement.Label.superclass.initComponent.call(this);
		var bundle;
		var commonbundle = CRB.getFWBundle();
		// To get the bundle key reference
		bundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));
		if(this.labelText!="" && this.labelText!=null){
			this.text = this.labelText;
		}
		else{
		if (!Ext.isEmpty(this.plainLabel)) {
			this.text = this.plainLabel;
		} else if (Ext.isEmpty(this.fieldLabelText)) { // CBX_FW_Q112F_032
			this.text = '';
		} else {
			this.text = bundle['LBL_' + this.fieldLabelText]; // CBX_FW_Q112F_032
		}
		}
		// CHG_FF_ENH -- ends
		/* Starts here for iSolve SIT - #773 - IR_ENHANCEMENTS_001 */
		if (this.required === 'Y' && !Ext.isEmpty(this.text) && this.text !=' ') {
			'<span class = \'mandatory\'">*</span>';
			this.html = this.text+ '<span class = \'mandatory\'">*</span>';
			this.text = '';
		}else 	if (this.conditional === 'Y' && !Ext.isEmpty(this.text) && this.text !=' ') {
			this.html = this.text+ '<span class = \'cbx-mandatory-fx\'">**</span>';	 //CBXQ2FW143 end
			this.text = '';
		}
		else
		{
			this.html=this.text;
		}
		/* Ends here for iSolve SIT - #773 - IR_ENHANCEMENTS_001 */
		// CBTQ3Q4_Label Starts
		this.tabIndex = 99999997; //CBXQ313F37
	},
	afterRender : function(ct, position) {
		this.updateScreenViewData(this);//CBXFW_DIT_77
		this.el.addClass("cbx-formfw-label");
		cbx.formElement.Label.superclass.afterRender.call(this, ct,
				position);
	}, // CBTQ3Q4_Label Ends 
	getPrintData : function() {
		var label = this.text;
		var printMap = {};
		return printMap;
	}
	//CBXQ213F04 starts
	,isValid : function(){
		return true;
	}
	//CBXQ213F04 ends
	//CBXFW_DIT_77 starts
	/**
	 * Updates the screen data in the ScreenView
	 */
	,getScreenViewData:function(){
		return this.text;
	},
	setValue : function(value){
		this.setText(value);
	},
	getValue : function (){
		return this.text;
	},
	getName : function(){
		return this.name;
	}
	//CBXFW_DIT_77 ends
});
Ext.reg('cbx-label', cbx.formElement.Label);

cbx.formElement.checkboxGroupStaticField = function(config) {
	this.plainLabel = config.plainLbl;
	this.displayNmKey = config.displayNmKey; //CHG_TRADE_POC
	//CHG_MULTIFORM Starts
	if(!Ext.isEmpty(config.multiInd) && config.multiInd==true && !Ext.isEmpty(config.index)){
		this.values = config.model.getModelData()[config.multiFormId][config.itemId][config.index] || "--";		
	}else{
		this.values = config.model.getModelData()[config.itemId] || "--";	
	}
	//CHG_MULTIFORM Ends
	this.name = config.itemId;
	this.required = config.requiredInd;
	this.conditional = config.conditionalInd;
	this.hidden = config.visibleInd === 'Y' ? false : true;
	cbx.formElement.checkboxGroupStaticField.superclass.constructor.call(this,
			config);
};
Ext
		.extend(
				cbx.formElement.checkboxGroupStaticField,
				Ext.form.TextField,
				{
					/**
					 * @cfg {Object} bundleKey ,key used by resource to lookup
					 *      bundle(defaults to '')
					 */
					bundleKey : '',
					required : 'N',
					conditional : 'N',
					plainLabel : '',
					fieldLabel : '',
					cls : 'canvas-staticcheckboxgroup',
					initComponent : function() {
						//CBXFW_DIT_77 starts
						this.on('hide',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'N']));
						this.on('show',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'Y']));
						//CBXFW_DIT_77 ends
						this.allowBlank = true;
						this.maxLength = undefined;
						this.minLength = undefined;
						cbx.formElement.checkboxGroupStaticField.superclass.initComponent
								.apply(this, arguments);
						var bundle;
						var commonbundle = CRB.getFWBundle();
						// To get the bundle key reference
						bundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));
						/**
						 * If the plainLabel attribute is not null ,component's
						 * field label will be the plain-label else the label
						 * associated with bundle keys will be referred to get
						 * the field label.
						 */
						if (!Ext.isEmpty(this.plainLabel)) {
							this.fieldLabel = this.plainLabel;
						} else {
							this.fieldLabel = bundle['LBL_' + this.displayNmKey]; //CHG_TRADE_POC
						}
						/**
						 * If the conditional attribute is Y the components
						 * field label will be field label associated with two
						 * stars
						 */
						if (this.conditional === 'Y') {
							if (Ext.isEmpty(this.fieldLabel)) {
								//CHG_TRADE_POC Starts
								this.fieldLabel = '?'
										+ this.fieldLabel
										+ '?';
								//CHG_TRADE_POC Ends
							} else {
								//CHG_TRADE_POC Starts
								this.fieldLabel = this.fieldLabel;
								//CHG_TRADE_POC Ends
							}
						}
						/**
						 * If the required attribute is Y,components field label
						 * will be field label associated with mandatory star
						 * and the field will not allow blank values.
						 */
						else if (this.required === 'Y') {
							if (Ext.isEmpty(this.fieldLabel)) {
								//CHG_TRADE_POC Starts
								this.fieldLabel = '?'
										+ this.fieldLabel
										+ '?';
								//CHG_TRADE_POC Ends
							} else {
								//CHG_TRADE_POC Starts
								this.fieldLabel = this.fieldLabel;
								//CHG_TRADE_POC Ends
							}
						} else {
							if (Ext.isEmpty(this.fieldLabel)) {
								this.fieldLabel = '?'
										+ this.fieldLabel
										+ '?'
										+ '<span class = \'non_mandatory\'"></span>';
							} else {
								this.fieldLabel = this.fieldLabel
										+ '<span class = \'non_mandatory\'"></span>';
							}
						}
						//this.parseRawData(this.values); //CHG_SCF_PO_004 
						//this.value = this.getItemValue() || "--"; //CHG_SCF_PO_004 
						 var value=this.model.getModelData()[this.itemId]; //CHG_SCF_PO_004 
						this.setValue(value); //CHG_SCF_PO_004 
						this.readOnly = true;
						this.labelSeparator = '';
						this.style = 'border:none;background: transparent;';
						this.anchor = (this.anchor == undefined) ? ''
								: this.anchor;
						this.tabIndex = 99999998; //CBXQ313F37
					},
					// Add the rawValues to array
					parseRawData : function(val) {
						var sArray = [];
						if (val != "" && val != null) {
							val = val + '';
							var splitValue = val.split(',');
							for ( var i = 0; i < splitValue.length; i++) {
								sArray.push(splitValue[i]);
							}
						}
						this.valuesArray = sArray;
					},
					// Getting the rawValues array
					getValuesArray : function() {
						return this.valuesArray;
					},
					/**
					 * Method checks for the default item value exists.
					 */
					getItemValue : function() {
						var valArray = this.getValuesArray();
						var dataArray = [];
						if (this.rawKeys != null && this.rawValues != null) {
							for ( var i = 0; i < this.rawKeys.length; i++) {
								if (valArray.length > 0
										&& valArray.contains(this.rawValues[i])) {
									dataArray.push(CRB.getBundle(cbx.jsutil.getBundleKey(this))['LBL_' + this.rawKeys[i]] || this.rawKeys[i]);// CHG001
								}
							}
						}
						return dataArray.toString();
					},
					//CHG_SCF_PO_004  Starts
					setValue : function(val) {
						if(Ext.isArray(val)){
				    		this.valuesArray = val;
				    	}else{
				    		this.parseRawData(val);	
				    	}
						var value=this.getItemValue() || val;
						if(Ext.isEmpty(value)){
							value='--';
						}
						cbx.formElement.checkboxGroupStaticField.superclass.setValue.call(this, value);
					}
					//CHG_SCF_PO_004  Ends
										//CBXFW_DIT_77 starts
					/**
					 * Updates the screen data in the ScreenView
					 */
					,getScreenViewData:function()
					{
						return this.value;
					},
					afterRender : function(ct, position) {
						this.updateScreenViewData(this);
					cbx.formElement.checkboxGroupStaticField.superclass.afterRender.call(this, ct,position);
					}//CBXFW_DIT_77 ends
				});
Ext.reg('cbx-checkboxgroupstaticfield',	cbx.formElement.checkboxGroupStaticField);
cbx.formElement.Button = function(config) {
	this.plainLabel = config.plainLbl;
	this.fieldLabelInd = config.displayNmKey;// CBXR12Q113F05
	this.name = config.itemId;
	this.disabled = config.editableInd === 'Y' ? false : true;
	this.hidden = config.visibleInd === 'Y' ? false : true;
	cbx.formElement.Button.superclass.constructor.call(this, config);
};


Ext.extend(cbx.formElement.Button, Ext.Button, {
	/**
	 * @cfg {Object} bundleKey ,key used by resource to lookup bundle(defaults
	 *      to '')
	 */
	bundleKey : '',

	/**
	 * @cfg {Object} fieldLabel ,label associated with the lookup button
	 */
	fieldLabel : '',
	plainLabel : '',
	handler : function() {
		return true;
	},
	submittable : true,
	iconCls : '',
	// CBXQ414F11 Starts
	/**
	 * The following variable has been added to keep track of the text
	 */
	/**
	 * @cfg/(String):To keep track of the text for the button.
	 */
	displayText:'',
	// CBXQ414F11 Ends
	initComponent : function() {
		var commonbundle = CRB.getFWBundle();

		cbx.formElement.Button.superclass.initComponent.apply(this, arguments);

		var bundle;
		// To get the bundle key reference
		bundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));
		/**
		 * If the plainLabel attribute is not null ,component's field label will
		 * be the plain-label else the label associated with bundle keys will be
		 * referred to get the field label.
		 */
        this.labelSeparator=''; //CBXR12Q113F05
		if (!Ext.isEmpty(this.plainLabel)) {
			// CBXQ414F11Starts
			this.displayText = this.plainLabel;
			// CBXQ414F11Ends
			//CBXR12Q113F05 starts
		} else if (Ext.isEmpty(this.fieldLabelInd)) {
			// CBXQ414F11Starts
			this.displayText = '';
			// CBXQ414F11Ends
		} else {
			// CBXQ414F11Starts
			this.displayText = bundle['LBL_' + this.fieldLabelInd];
			// CBXQ414F11Ends
			//CBXR12Q113F05 ends
		}
		// CBXQ414F11Starts
		if (this.displayText) {
			this.tooltip = this.displayText;
			/**
			 * The following code has been commented to ensure that the text
			 * inside button can be set dynamically.
			 */
			//this.text=Ext.util.Format.ellipsis(this.text,12);
			
		}
		// CBXQ414F11 Ends
		this.on('click', this.handleClickEvent);
	},
	//CHG_CT_CLEANUP Starts
	handleClickEvent : function() {
		if(!Ext.isEmpty(this.multiInd) && this.multiInd==true && !Ext.isEmpty(this.index)){
			this.manager.handlerEvent('cbxclick', this.name,this.index,this.multiFormId);
		}
		else{
			this.manager.handlerEvent('cbxclick', this.name);
		}
	}
	//CHG_CT_CLEANUP Ends
// CBXR12Q113F02 starts
	,
	getName : function(){
		return this.name;
	}
// CBXR12Q113F02 ends
// CBXR12Q113F06 starts
	,setValue : function(v){
		this.setText(v);	//Anchor For Button
	},
	reset : function(){
		return;
	}
// CBXR12Q113F06 ends
  // CBXR12Q113U02 starts
	,afterRender : function() {
		
		this.el.addClass("cbx-noborder-btn cbx-custom-btn");
		cbx.formElement.Button.superclass.afterRender.call(this, arguments);
	}
	 // CBXR12Q113U02 ends
	 //CBXQ213F04 starts
	,isValid : function(){
		return true;
	}
	//CBXQ213F04 ends
	,
	// CBXQ414F11 Starts
	/**
	 * Private Method:To set the text.This method overrides the default setText
	 * method of Extjs.In default method the width of the button will be set
	 * automatically after setting the text.To ensure the proper alignment this
	 * method has been overridded
	   
	   As an Enhancement,this method is not overridden so as to respect the anchor
	   that is configured in DB. The width of the button is set according to the 
	   anchor configured. The text will adjust according to the width of the button set.
	 */
	 //Anchor For Button Starts
	  /*setText : function(text){
		  if(Ext.isEmpty(text) && !Ext.isEmpty(this.displayText)){
			 text = this.displayText;
		  }else{
			  text = text;  
		  }
	        if(this.el){
	            this.btnEl.update(text || '&#160;');
	            this.setButtonClass();
	        }
	        return this;
	    },*/
	 //Anchor For Button Ends
	  getText:function(){
		  return this.text || this.displayText;
	  },
	    /**
		 * Private method:To set the button text and the button width based on
		 * resizing the button.This resize method is also called at the time of
		 * rendering any component,which will help to render the text and the
		 * width based on the container width
		 */
	  //Anchor For Button Starts
	   onResize:function(aw, ah, w, h){		
		   var ib = this.btnEl;
		   var w=aw;
		  //this.widthOfAlphabet=iportal.preferences.getAverageFontWidth();
		  //this.labelLength=parseInt(w/this.widthOfAlphabet);
		  //this.setText(Ext.util.Format.ellipsis(this.displayText, this.labelLength));
		   ib.setWidth(aw);
		   ib.addClass("x-btn-wraplabel");
		   this.setText(this.displayText);
	  //Anchor For Button Ends
	},
	afterRender : function() {
		
		this.addClass("form-button");
		cbx.formElement.Button.superclass.afterRender.call(this, arguments);
	}
	    // CBXQ414F11 Ends
});
Ext.reg('cbx-button', cbx.formElement.Button);
cbx.formElement.cbxHiddenField = function(config) {
	this.name = config.itemId;
	//CHG_MULTIFORM Starts
	if(!Ext.isEmpty(config.multiInd) && config.multiInd==true && !Ext.isEmpty(config.index)){
		this.value = config.model.getModelData()[config.multiFormId][config.itemId][config.index];
	}else{
		this.value = config.model.getModelData()[config.itemId];	
	}
	//CHG_MULTIFORM ENds
	cbx.formElement.cbxHiddenField.superclass.constructor.call(this, config);
};

Ext.extend(cbx.formElement.cbxHiddenField, Ext.form.Hidden, {

	inputType : 'hidden',
	setSize : Ext.emptyFn,
	setWidth : Ext.emptyFn,
	setHeight : Ext.emptyFn,
	setPosition : Ext.emptyFn,
	setPagePosition : Ext.emptyFn,
	markInvalid : Ext.emptyFn,
	clearInvalid : Ext.emptyFn,
	shouldLayout : false,
	initComponent : function() {
		cbx.formElement.cbxHiddenField.superclass.initComponent.call(this);
		this.on('change', this.syncModelData);
	},
	onRender : function() {
		cbx.formElement.cbxHiddenField.superclass.onRender.apply(this,
				arguments);
	},
	initEvents : function() {
		this.originalValue = this.getValue();
	},
	syncModelData : function() {
		//CHG_MULTIFORM Starts
		if(!Ext.isEmpty(this.multiInd) && this.multiInd==true && !Ext.isEmpty(this.index)){
			this.model.updateValue(this.name, this.getValue(),undefined,this.index,this.multiFormId);
		}else{
			this.model.updateValue(this.name, this.getValue());	
		}
		//CHG_MULTIFORM Ends
	},
	setValue : function(v) {
		var o = this.getValue();
		cbx.formElement.cbxHiddenField.superclass.setValue.call(this, v);
		this.fireEvent('change', this, this.getValue(), o);
		return this;
	}
});
Ext.reg('cbx-hidden', cbx.formElement.cbxHiddenField);

/**
 * This components is used to provide a widget inside the form panel. This
 * widget will be an instance of iportal.Widget or its subclasses and will
 * follow the default VDF lifeccycle for rendering a widget. The height of the
 * widget is determined by the value of MAX_NUM_LINES given in the metadata. If
 * this value is not provided, component will calculate the height for 10 rows.
 */
cbx.formElement.WidgetPanel = Ext.extend(Ext.Panel, {
	initComponent : function() {
		//CBXFW_DIT_77 starts
		this.on('hide',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'N']));
		this.on('show',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'Y']));
		//CBXFW_DIT_77 ends
		/* Calculating the max number of rows for the widget */
		if (this.maxNumLines == null || this.maxNumLines === ''
				|| (parseInt(this.maxNumLines)) != this.maxNumLines) {
			this.maxNumLines = 10;
		} else {
			this.maxNumLines = parseInt(this.maxNumLines);
		}
		// Array for storing all the extraparamHandlers added on the widget.
		this.handlerArr = [];
		var defaultConfig = {
			itemId : this.itemId,
			name : this.itemId,
			collapsible : false,
			layout : 'anchor',
			height : cbx.jsutil.getWidgetheight(this.maxNumLines) + 35,
			anchor : '100%',
			forceLayout : true,
			renderHidden : true,
			cls : 'cbx-form-widget',
			border : true,
			defaults : {
				anchor : '100%'
			}
		};
		Ext.apply(this, defaultConfig);
		cbx.formElement.WidgetPanel.superclass.initComponent.call(this);
	},
	afterRender : function(ct, position) {
		cbx.formElement.WidgetPanel.superclass.afterRender.call(this, ct,
				position);
		/** Preparing the configuration for instantiating the Widget */
		//CHG_009_70503 -- Starts
		if(this.hidden == false){
			var config = {
					WIDGET_ID : this.widgetId,
					isParentPortlet : true,
					isLoadingToolsInside : true,
					extraParamsHandler : this.extraParamsHandler,
					height : cbx.jsutil.getWidgetheight(this.maxNumLines),
					containerPanel : this,
					renderTo:"FORM"
			};
				//Changes done for rendering the widget inside the form
				cbx.jsutil.getMDForFormWidget(config,this.successhandler,this);
	
		//	this.ownerCt.doLayout();
		}
		else{
			this.on('show',function(){
				var widgetObjArr = this.ownerCt.find('itemId',this.widgetId);
				if(widgetObjArr.length == 0){
					var config = {
							'WIDGET_ID' : this.widgetId,
							isParentPortlet : true,
							isLoadingToolsInside : true,
							extraParamsHandler : this.extraParamsHandler,
							height : cbx.jsutil.getWidgetheight(this.maxNumLines),
							containerPanel : this
					};
						// calling the utility method for retrieving the Widget Metadata
						cbx.jsutil.getMDForFormWidget(config,this.successhandler,this);
						
						}
					},this)
					}	
			
		},
		successhandler : function(config,that) //call back method, which will be executed when ajax call is a success 
		{
		var widget = cbx.jsutil.initiateWidgetForForm(config);// calling the utility method for returning the widget
		

			if (widget != null) {
							that.add(widget.mv);
							if (that.resizableInd && that.resizableInd === "Y") {
								that.resizer = new Ext.Resizable(that.el, {
									handles : 's',
									pinned : true,
									transparent : true
								});
								that.resizer.on('resize', that.resizerAction, that);
							}
							
							
							
						}
			that.ownerCt.doLayout();
			
			},
		// CHG_FOR_RENDERING_WIDGET_HEADER_INSIDE_FORM ends
	loadHandler:function(){

var widgetMv= this.getComponent(0);
		if(widgetMv!=null && widgetMv.getHtmlExportContentPathParamsForForms){
			widgetMv.getHtmlExportContentPathParamsForForms.call(widgetMv, [function(exportParams){
				this.exportParams = exportParams;
				this.updateScreenViewData(this);
			},this]);
		}
	},
	getScreenViewData:function (){
		var params={};
			params['widgetID']=this.widgetId;
			params['exportParams']=this.exportParams;
		return params;
		// CBXFW_DIT_77 Ends
	},
	// FW69_WGT_RESIZE starts
	resizerAction : function(cmpt, width, height, obj) {
		/**
		 * Resetting the panel's body el height as the resizer isn't refreshing
		 * it correctly everytime.
		 */
		var bodyHeight = height - this.getFrameHeight();
		if (this.body.getHeight() != bodyHeight) {
			this.body.setHeight(bodyHeight);
		}
		height = height - this.getFrameHeight();
		var wgt = this.getComponent(0);
		wgt.height = height;
		wgt.setHeight(height);
		if (wgt.updateHeight) {
			wgt.updateHeight(height);
		} else {
			if (wgt.mwc && wgt.mwc.updateHeight)
				wgt.mwc.updateHeight(height);
		}
		wgt.doLayout();
		if (wgt.ownerCt.ownerCt.ownerCt.setHeight) {
			wgt.ownerCt.ownerCt.ownerCt.setHeight(height+20);
		} 
		wgt.ownerCt.ownerCt.ownerCt.doLayout();
	},
	// FW69_WGT_RESIZE ends
	/**
	 * This method is used to register any extraParam Handler configured by the
	 * developer while defining the Widgets.
	 */
	addHandler : function(handler) {
		this.handlerArr.push(handler);
	},
	/**
	 * This is the default wrapper function for handling all the
	 * extraParamHandler registered for the widget. This method will first
	 * execute any handler written for the widget iteself and after that, it
	 * will raise the FormManager's cbxbeforeload for the form developer to
	 * update the request parameters before they are sent to the server for data
	 * fetch
	 */
	extraParamsHandler : function(params) {
		/*
		 * searching fot the its own reference object from the widget's level in
		 * the hierarchy so that extraParamHanlder can be executed in the
		 * component's scope.
		 */
		// Code change to display Graph Widgets inside Form
        if ((this.ownerCt != undefined)&&(this.ownerCt.mvh !=undefined)){			
			var that = this.ownerCt.mvh.mvConf.findParentByType('cbx-widgetpanel');
		}
		if (that != null) {
			for ( var i = 0, len = that.handlerArr.length; i < len; i++) {
				Ext.apply(params, that.handlerArr[i](params));
			
			}
			var addParams = that.manager.handlerEvent('cbxbeforeload',
					that.name, params);
			Ext.apply(params, addParams);
		
		}
		return params;
	},
	/**
	 * Public API provided for reloading the data of the VDF widget.
	 */
	refreshWidgetData: function(){
		var widgetMv= this.getComponent(0);
		if(widgetMv!=null && widgetMv.refreshWidgetData){
			widgetMv.refreshWidgetData();
		}
	},
	destroy : function() {
		try
		{
			if(this.items)
				this.items.each(Ext.destroy, Ext); // Destroy all the fields
				cbx.formElement.WidgetPanel.superclass.destroy.call(this);
		}
		catch(e){
			this.items!=undefined;
		}
	}, // CHGWDGT_MODIFIEDDATA starts
	dataModified:function(records,widgetId){
		if (this.ownerCt.manager.register['cbxwidgetmodified' + "|" + this.itemId] != null) {
			var obj = this.ownerCt.manager.register['cbxwidgetmodified' + "|" + this.itemId];
			for(var i=0;i<records.length;i++){
				records[i].data.widgetId=widgetId;
			}
			var recordsResult = obj.handler.apply(obj.mScope, [ this.ownerCt.manager, 'cbxwidgetmodified',this.itemId,records]);
				}  // CHGWDGT_MODIFIEDDATA ends
	},
	//CHGFW_CR012 starts
	selectedRecords:function(records,widgetId){
		if (this.ownerCt.manager.register['cbxwidgetselected' + "|" + this.itemId] != null) {
			var obj = this.ownerCt.manager.register['cbxwidgetselected' + "|" + this.itemId];
			var recordsResult = obj.handler.apply(obj.mScope, [ this.ownerCt.manager, 'cbxwidgetselected',this.itemId,records]);
				}  // CHGWDGT_MODIFIEDDATA ends
	},
	//CHGFW_CR012 ends
	// Widget Single Click - CBX*cbx.jsutilQ2FW72
	handleClick:function(records,widgetId){
		if (this.manager.register['cbxwidgetsingleclick' + "|" + this.itemId] != null) {
			var obj = this.manager.register['cbxwidgetsingleclick' + "|" + this.itemId];
			
			var recordsResult = obj.handler.apply(obj.mScope, [ this.manager, 'cbxwidgetsingleclick',this.itemId,records,widgetId]);
				}  // CHGWDGT_MODIFIEDDATA ends
	}
	/*Events for FormWidgets*/
	/**
	 * Adding cellclick function that is called from the initiateWidgetForForm API defined in cbx.jsutil.js.
	 * Currently cbxwidgetcellclick is the event that gets fired when a cellclick event happens in a widget inside the form.
	 */
	,cellclick : function(colId,colVal,record,widgetId){
		if (this.manager.register['cbxwidgetcellclick' + "|" + this.itemId] != null) {
			var obj = this.manager.register['cbxwidgetcellclick' + "|" + this.itemId];
			
			var recordsResult = obj.handler.apply(obj.mScope, [colId,colVal,record,widgetId]);
				}
	}
	/*Events for FormWidgets*/
});
Ext.reg('cbx-widgetpanel', cbx.formElement.WidgetPanel);


cbx.formElement.SpinnerField = function(config){
	this.plainLabel = config.plainLbl;
	this.fieldLabel = config.displayNmKey;
	this.name = config.itemId;
	//CHG_MULTIFORM Starts
	if(!Ext.isEmpty(config.multiInd) && config.multiInd==true && !Ext.isEmpty(config.index)){
		this.value = config.model.getModelData()[config.multiFormId][config.itemId][config.index];
	}else{
		this.value = config.model.getModelData()[config.itemId];	
	}
	//CHG_MULTIFORM Ends
	this.required = config.requiredInd;
	this.conditional = config.conditionalInd;
	this.readOnly = config.readOnlyInd === 'Y' ? true : false;
	this.hidden = config.visibleInd === 'Y' ? false : true;
	this.validationType = config.vType;
	/**
	 * Below code commented so that the developer can provide minimum value in
	 * cbxpreinitialize event else the default minimum value 0 will be assigned
	 */
	// this.minValue='0'; //CBX_FW_Q112F_106
    cbx.formElement.SpinnerField.superclass.constructor.call(this, config);
};
Ext.extend(cbx.formElement.SpinnerField, Ext.ux.form.SpinnerField, {
	 /**
		 * @cfg {String/Object} required ,to specify whether this field is
		 *      mandatory (defaults to false)
		 */
	required : 'N',
	conditional : 'N',
	/**
	 * @cfg {Object} bundleKey ,key used by resource to lookup bundle(defaults
	 *      to '')
	 */
	bundleKey : '',
	minValue:0, // CBX_FW_Q112F_106
	/**
	 * @cfg {Object} lookup ,used when textfield is part of a lookup button
	 */
	lookup : false,
	vtype :'invalidChars',
	allowDecimals: false, // CBX_165
    incrementValue: 1,
	accelerate: 'true',
	labelSeparator:'',
	/**
	 * @cfg {String/Object} validationType ,to specify what modes of validation
	 *      this field should support &#46;(defaults to none) Standard modes
	 *      available are 1 alphaNumeric - field allows only alphanumeric
	 *      characters 2 none - no validation
	 */
	 validationType : 'numeric', // CBX_FW_Q112F_106
    /**
	 * @cfg {Object} allowSpaces ,used when spaces are allowed inside the
	 *      textfield defaults to false
	 */
   // allowSpaces : false,
    plainLabel : '',
	fieldLabel : '',
	// cls : 'x-form-textField',
     // private
	initComponent:function(){
		//CBXFW_DIT_77 starts
		this.on('hide',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'N']));
		this.on('show',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'Y']));
		//CBXFW_DIT_77 ends
		if (Ext.isEmpty(this.maxLength)) {
			this.maxLength = undefined;
		}
		if (Ext.isEmpty(this.minLength)) {
			this.minLength = undefined;
		}
		cbx.formElement.SpinnerField.superclass.initComponent.apply(this, arguments);	
		var bundle;
		var commonbundle = CRB.getFWBundle();
		// To get the bundle key reference
		bundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));
		/**
		 * If the plainLabel attribute is not null ,component's field label will
		 * be the plain-label else the label associated with bundle keys will be
		 * referred to get the field label.
		 */
		if (!Ext.isEmpty(this.plainLabel)) {
			this.fieldLabel = this.plainLabel;
		} else if (Ext.isEmpty(this.fieldLabel)) {
			this.fieldLabel = '';
		} else {
			this.fieldLabel = bundle['LBL_' + this.fieldLabel];
		}
		if (this.maxLength < Number.MAX_VALUE) {
			this.maxLengthText = String.format(
					commonbundle['ERR_MAXLENGTH_EXCEED'],
					this.fieldLabel, this.maxLength);
		}
		if (this.minLength < Number.MIN_VALUE) {
			this.minLengthText = String.format(
					commonbundle['ERR_MINLENGTH_EXCEED'],
					this.fieldLabel, this.minLength);
		}
		/**
		 * If the conditional attribute is Y the components field label will be
		 * field label associated with two stars
		 */
		if (this.conditional === 'Y') {
			this.blankText = String.format(
					commonbundle['ERR_MANDATORY'], this.fieldLabel);
			if (Ext.isEmpty(this.fieldLabel)) {
				this.fieldLabel = '?' + this.fieldLabel + '?'
						+ '<span class = \'cbx-mandatory-fx\'">**</span>';// CHG001-CSS
																			// changes
			} else {
				this.fieldLabel = this.fieldLabel
						+ '<span class = \'cbx-mandatory-fx\'">**</span>';// CHG001-CSS
																			// changes
			}
		}
		/**
		 * If the required attribute is Y,components field label will be field
		 * label associated with mandatory star and the field will not allow
		 * blank values.
		 */
		else if (this.required === 'Y') {
			this.allowBlank=false;	
			this.blankText = String.format(
					commonbundle['ERR_MANDATORY'], this.fieldLabel);
			if (Ext.isEmpty(this.fieldLabel)) {
				this.fieldLabel = '?' + this.fieldLabel + '?'
						+ '<span class = \'mandatory\'">*</span>';
			} else {
				this.fieldLabel = this.fieldLabel
						+ '<span class = \'mandatory\'">*</span>';
			}
		} else {
			this.blankText = String.format(
					commonbundle['ERR_MANDATORY'], this.fieldLabel);
			if (Ext.isEmpty(this.fieldLabel)) {
				this.fieldLabel = '?' + this.fieldLabel + '?'
						+ '<span class = \'non_mandatory\'"></span>';
			} else {
				this.fieldLabel = this.fieldLabel
						+ '<span class = \'non_mandatory\'"></span>';
			}
		}
		this.labelSeparator = '';
	// CHG_FF_ENH Starts
	this.onBlur=function(){ 
	this.clearInvalid();  // CBX_FW_Q112F_106
	this.validate();      // CBX_FW_Q112F_106
	this.syncModelData();
	this.spinnerMandatoryValidator(this.getValue());
	};
	this.on('spin',function(obj){
		this.clearInvalid(); // CBX_FW_Q112F_106
		this.syncModelData();
		this.spinnerMandatoryValidator(obj.value);
		});
	// CHG_FF_ENH Ends
		switch(this.validationType)	{
			// validation type currently supported is alphaNumeric and numeric
			// alone, which restricts the keystrokes
			// to be only alphabets and numerals.Numeric vType is an alternate
			// for numberfield
			case 'alphaNumeric' : 
							if(this.allowSpaces){
								this.maskRe = /[A-Za-z0-9 ]/;
							}else{
							this.maskRe = /[A-Za-z0-9]/;
							}
							break;
			// Use numeric vtype as an alternate for NumberField
			case 'numeric' : 
							if(this.allowSpaces){
							this.maskRe = /[0-9 ]/;
							}else{
							this.maskRe = /[0-9]/;
							}
							break;
			case 'portalSupported' : 
							if(this.allowSpaces){
							this.maskRe = /[^<>;{}()!=&\'\"]/;
							}else{
							this.maskRe = /[0-9]/;
							}
							break;								
		}
		this.anchor = (this.anchor == undefined) ? '' : this.anchor ;
	},
// CBX_FW_Q112F_106 Starts
 afterRender:function(){
	 var that=this;
	 this.updateScreenViewData(this);//CBXFW_DIT_77
	 cbx.formElement.SpinnerField.superclass.afterRender
		.call(this); 
	 this.getEl().on('keyup',function(){  
			that.clearInvalid();
			});
		if(this.copyPasteInd==="Y")
			{
	
	 this.getEl().on('keydown',preventCopyPaste,this);
     this.getEl().on('drop',preventCopyPaste,this);
	 this.getEl().on('dragstart',preventCopyPaste,this);
	 this.getEl().on('draggesture',preventCopyPaste,this);
			}
		this.spinner.repeater.setDisabled(true);
	    this.spinner.trigger.on("click", this.spinner.onTriggerClick, this.spinner, {
	       preventDefault: true
	      });
 },
 // CBX_FW_Q112F_106 Ends
// CHG_FF_ENH Starts
syncModelData : function() {
	//CHG_MULTIFORM Starts
	if(!Ext.isEmpty(this.multiInd) && this.multiInd==true && !Ext.isEmpty(this.multiFormId)){
		this.model.updateValue(this.name, this.getValue(),undefined,this.index,this.multiFormId);	
	}		
	else if(this.model.getValue(this.name)!==this.getValue()){
	this.model.updateValue(this.name, this.getValue());
}
	//CHG_MULTIFORM Ends
		this.updateScreenViewData(this);//CBXFW_DIT_77
},
// CBX_FW_Q112F_106 Starts
setMinValue: function(minValue) {
 if(!Ext.isEmpty(minValue) && !(isNaN(minValue))){
	 this.minValue=minValue;
 }
},
setMaxValue: function(maxValue) {
	if(!Ext.isEmpty(maxValue) && !(isNaN(maxValue))){
		 this.maxValue=maxValue;
	 }
},
setdefaultValue: function(defaultValue) {
	if(!Ext.isEmpty(defaultValue) && !(isNaN(defaultValue))){
		 this.defaultValue=defaultValue;
	 }
},
setDecimalPrecision: function(allowDecimalPrecision) { 
	if(!Ext.isEmpty(allowDecimalPrecision) ){
		if(this.allowDecimals==true && !(isNaN(allowDecimalPrecision))){
			this.decimalPrecision=allowDecimalPrecision;
		}
	 }
},
/**
 * Validates the field value
 * 
 * @return {Boolean} True if the value is valid, else false
 */
validate:function(){
	if (!this.disabled && (this.el.dom.className.indexOf('errorBg')!=-1 || this.el.dom.className.indexOf(this.invalidClass) != -1)) {
	return false;
	}
	if(this.disabled || this.validateValue(this.processValue(this.getRawValue()))){
	           this.clearInvalid();
	           return true;
	       }
	       return false;
	},
// CBX_FW_Q112F_106 Ends
// CHG_FF_ENH Ends
	isVisible : function(){
		return cbx.formElement.SpinnerField.superclass.isVisible.apply(this, arguments);  
	},
	getPrintData : function(){
		var label = this.plainLabel;
		var fieldValue = this.getValue();
		var printMap = {};
		printMap[label] = fieldValue;
		return printMap;
	},
	spinnerMandatoryValidator : function(v){
		// TODO bundle to be changed. This should be common bundle
		combundle = CRB.getFWBundle();
		// CBX_FW_Q112F_106 Starts
		if(combundle !== null){
			if((v == '') && (this.required==='Y')){
				this.markInvalid(this.blankText);				
			}
		}
		// CBX_FW_Q112F_106 Ends
		else {			
		    	if((v == '') && (this.required==='Y')){
				this.markInvalid('? ERR_MANDATORY ?');
			}
		}
	},
	//CBXFW_DIT_77 starts
	/**
	 * Updates the screen data in the ScreenView
	 */
	getScreenViewData:function()
	{
		return this.getValue();
	}
	//CBXFW_DIT_77 ends
});
Ext.reg('cbx-spinnerfield', cbx.formElement.SpinnerField);
/**
 * @class cbx.formElement.cbxTitle
 * @Used to bring a title inside form.
 * @extends Ext.BoxComponent
 * @Base class for any visual Ext.Component that uses a box container.
 * @author Chiranjib
 */
cbx.formElement.cbxTitle=function(config) {
	this.name = config.itemId;
	this.plainLbl= config.plainLbl;
	this.fieldLbl= config.displayNmKey;
	this.hidden=(config.visibleInd && config.visibleInd=='N')?true:false;
	cbx.formElement.cbxTitle.superclass.constructor.call(this, config);
};
Ext.extend(cbx.formElement.cbxTitle,Ext.BoxComponent, {
	initComponent : function() {
		//CBXFW_DIT_77 starts
		this.on('hide',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'N']));
		this.on('show',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'Y']));
		//CBXFW_DIT_77 ends
		cbx.formElement.cbxTitle.superclass.initComponent.apply(
					this, arguments);
		var bundle;
		var commonbundle = CRB.getFWBundle();		
		// To get the bundle key reference
		bundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));
		if (!Ext.isEmpty(this.plainLbl)) {
			this.title= this.plainLbl;
		} else if (Ext.isEmpty(this.fieldLbl)) {
			this.title= '';
		} else {
			this.title= bundle['LBL_' + this.fieldLbl];
		}	
		this.anchor = (this.anchor == undefined) ? '' : this.anchor;
	},
    onRender : function(ct, position){
       this.updateScreenViewData(this);//CBXFW_DIT_77
        if(!this.template){
            if(!cbx.formElement.cbxTitle.titleTemplate){
                cbx.formElement.cbxTitle.titleTemplate= new Ext.Template(
                		'<div class="x-form-title">',
      						'<br><b>{0}</b></br>',
      						'</div>'
                );
            }            
        }    
        this.template=cbx.formElement.cbxTitle.titleTemplate;
        this.template.compile();
        var fs; var  targs = [this.title || '&#160;'];
        if(position){
            fs = this.template.insertBefore(position, targs, true);
        }else{
            fs = this.template.append(ct, targs, true);
        }
        this.el = fs;
        cbx.formElement.cbxTitle.superclass.onRender.call(this);
     }
 	//CBXFW_DIT_77 starts
	/**
	 * Updates the screen data in the ScreenView
	 */
 	,getScreenViewData:function(){
 		return this.title;
 	}
 	//CBXFW_DIT_77 ends
});
Ext.reg('cbx-title',cbx.formElement.cbxTitle);
// CHGPANELFILEUPLOAD Starts
cbx.formElement.BrowseButton = Ext.extend(Ext.Button, {
		/*
		 * 
		 * 
		 * 
		 * Config options:
		 * 
		 * 
		 * 
		 */
		/**
		 * @cfg {String} inputFileName Name to use for the hidden input file DOM
		 *      element. Deaults to "file".
		 */
		inputFileName: 'file',
		/**
		 * @cfg {Boolean} debug Toggle for turning on debug mode. Debug mode
		 *      doesn't make clipEl transparent so that one can see how
		 *      effectively it covers the Ext.Button. In addition, clipEl is
		 *      given a green background and floatEl a red background to see how
		 *      well they are positioned.
		 */
		debug: false,
		/*
		 * 
		 * 
		 * 
		 * Private constants:
		 * 
		 * 
		 * 
		 */
		/**
		 * @property FLOAT_EL_WIDTH
		 * @type Number The width (in pixels) of floatEl. It should be less than
		 *       the width of the IE "Browse" button's width (65 pixels), since
		 *       IE doesn't let you resize it. We define this width so we can
		 *       quickly center floatEl at the mouse cursor without having to
		 *       make any function calls.
		 * @private
		 */
		FLOAT_EL_WIDTH: 70,		
		/**
		 * @property FLOAT_EL_HEIGHT
		 * @type Number The heigh (in pixels) of floatEl. It should be less than
		 *       the height of the "Browse" button's height. We define this
		 *       height so we can quickly center floatEl at the mouse cursor
		 *       without having to make any function calls.
		 * @private
		 */
		FLOAT_EL_HEIGHT: 21,	
		/*
		 * Private properties:
		 */
		/**
		 * @property buttonCt
		 * @type Ext.Element Element that contains the actual Button DOM
		 *       element. We store a reference to it, so we can easily grab its
		 *       size for sizing the clipEl.
		 * @private
		 */
		buttonCt: null,
		/**
		 * @property clipEl
		 * @type Ext.Element Element that contains the floatEl. This element is
		 *       positioned to fill the area of Ext.Button and has overflow
		 *       turned off. This keeps floadEl tight to the Ext.Button, and
		 *       prevents it from masking surrounding elements.
		 * @private
		 */
		clipEl: null,
		/**
		 * @property floatEl
		 * @type Ext.Element Element that contains the inputFileEl. This element
		 *       is size to be less than or equal to the size of the input file
		 *       "Browse" button. It is then positioned wherever the user moves
		 *       the cursor, so that their click always clicks the input file
		 *       "Browse" button. Overflow is turned off to preven inputFileEl
		 *       from masking surrounding elements.
		 * @private
		 */
		floatEl: null,
		/**
		 * @property inputFileEl
		 * @type Ext.Element Element for the hiden file input.
		 * @private
		 */
		inputFileEl: null,
		/**
		 * @property originalHandler
		 * @type Function The handler originally defined for the Ext.Button
		 *       during construction using the "handler" config option. We need
		 *       to null out the "handler" property so that it is only called
		 *       when a file is selected.
		 * @private
		 */
		originalHandler: null,
		/**
		 * @property originalScope
		 * @type Object The scope originally defined for the Ext.Button during
		 *       construction using the "scope" config option. While the "scope"
		 *       property doesn't need to be nulled, to be consistent with
		 *       originalHandler, we do.
		 * @private
		 */
		originalScope: null,		
		/*
		 * Protected Ext.Button overrides
		 */
		/**
		 * @see Ext.Button.initComponent
		 */
		initComponent: function(){
			cbx.formElement.BrowseButton.superclass.initComponent.call(this);
			/**
			 * Store references to the original handler and scope before nulling
			 * them.This is done so that this class can control when the handler
			 * is called.There are some cases where the hidden file input browse
			 * button doesn't completely cover the Ext.Button. The handler
			 * shouldn't be called in these cases. It should only be called if a
			 * new file is selected on the file system.
			 */
			this.originalHandler = this.handler;
			this.originalScope = this.scope;
			this.handler = null;
			this.scope = null;
		},
		/**
		 * @see Ext.Button.onRender
		 */
		onRender: function(ct, position){
			cbx.formElement.BrowseButton.superclass.onRender.call(this, ct, position); 
			this.buttonCt = this.el.child('em');
			this.buttonCt.position('relative'); // this is important!
			var styleCfg = {
				position: 'absolute',
				overflow: 'hidden',
				width : '70px', 
				height : '21px',
				top: '0px', // default
				left: '0px' // default
			};
			// browser specifics for better overlay tightness
			if (Ext.isIE) {
				/**
				 * In IE, while clicking add button, it is not opening upload winodw for more than 10 cliicks,
				 * Commented the below code to set the default overlay tightness.- CIBC IMPL - Raja
				 */
				Ext.apply(styleCfg, {
					left: '4px',
					top: '-7px',								
				width: '60px',
				height: '18px'
				});
			} else if (Ext.isGecko) {
				Ext.apply(styleCfg, {
					left: '-3px',
					top: '-3px'
				});
			} else if (Ext.isSafari) {
				Ext.apply(styleCfg, {
					left: '-4px',
					top: '-2px'
				});
			}else if (Ext.isChrome) {
				Ext.apply(styleCfg, {
					left: '-5px',
					top: '-4px'
				});
			}
			this.clipEl = this.buttonCt.createChild({
				tag: 'div',
				style: styleCfg
			});
			this.setClipSize();
			this.clipEl.on({
				'mousemove': this.onButtonMouseMove,
				'mouseover': this.onButtonMouseMove,
				scope: this
			});
			this.floatEl = this.clipEl.createChild({
				tag: 'div',
				style: {
					position: 'absolute',
					width: this.FLOAT_EL_WIDTH + 'px',
					height: this.FLOAT_EL_HEIGHT + 'px',
					overflow: 'hidden'
				}
			});
			if (this.debug) {
				this.clipEl.applyStyles({
					'background-color': 'green'
				});
				this.floatEl.applyStyles({
					'background-color': 'red'
				});
			} else {
				this.clipEl.setOpacity(0.0);
			}
			/*
			 * Cover cases where someone tabs to the button: Listen to focus of
			 * the button so we can translate the focus to the input file el.
			 */
			var buttonEl = this.el.child(this.buttonSelector);
			buttonEl.on('focus', this.onButtonFocus, this);
			/*
			 * In IE, it's possible to tab to the text portion of the input file
			 * el. We want to listen to keyevents so that if a space is pressed,
			 * we "click" the input file el.
			 */
			if (Ext.isIE) {
				this.el.on('keydown', this.onButtonKeyDown, this);
			}
			this.createInputFile();
		},		
		/*
		 * Private helper methods:
		 */
		/**
		 * Sets the size of clipEl so that is covering as much of the button as
		 * possible.
		 * 
		 * @private
		 */
		setClipSize: function(){
			if (this.clipEl) {
				var width = this.buttonCt.getWidth();
				var height = this.buttonCt.getHeight();
				/*
				 * The button container can have a width and height of zero when
				 * it's rendered in a hidden panel. This is most noticable when
				 * using a card layout, as the items are all rendered but
				 * hidden, (unless deferredRender is set to true). In this case,
				 * the clip size can't be determined, so we attempt to set it
				 * later. This check repeats until the button container has a
				 * size.
				 */
				if (width === 0 || height === 0) {
					this.setClipSize.defer(100, this);
				} else {
					if (Ext.isIE) {
						width = width + 15;
						height = height + 8;
					} else if (Ext.isGecko) {
						width = width + 26;
						height = height + 4;
					} else if (Ext.isSafari) {
						width = width + 27;
						height = height + 5;
					} else if (Ext.isChrome){
						width = width + 27;
						height = height + 6;
					}
					this.clipEl.setSize(width, height);
				}
			}
		},
		/**
		 * Creates the input file element and adds it to inputFileCt. The
		 * created input file elementis sized, positioned, and styled
		 * appropriately. Event handlers for the element are set up, and a
		 * tooltip is applied if defined in the original config.
		 * 
		 * @private
		 */
		createInputFile: function(){
			/*
			 * When an input file gets detached and set as the child of a
			 * different DOM element, straggling <em> elements get left behind.
			 * I don't know why this happens but we delete any <em> elements we
			 * can find under the floatEl to prevent a memory leak.
			 */
			this.floatEl.select('em').each(function(el){
				// el.remove();
			});
			this.inputFileEl = this.floatEl.createChild({
				tag: 'input',
				type: 'file',
				cls : 'btn-fileupload',
				size: 1, // must be > 0. It's value doesn't really
						// matter due to our masking div
						// (inputFileCt).
				name: this.inputFileName || Ext.id(this.el),
				tabindex: this.tabIndex,
				/*
				 * 
				 * Use the same pointer as an Ext.Button would use. This doesn't
				 * 
				 * work in Firefox. This positioning right-aligns the input file
				 * 
				 * to ensure that the "Browse" button is visible.
				 * 
				 * 
				 */
				style: {
					position: 'absolute',
					cursor: 'pointer',            				
					right: '0px',
					height: '21px',
					width: '60px',
					filter: 'alpha(opacity=0)',
					top: '0px'
				}
			});
			this.inputFileEl = this.inputFileEl.child('input') || this.inputFileEl;
			// setup events
			this.inputFileEl.on({
				'click': this.onInputFileClick,
				'change': this.onInputFileChange,
				'focus': this.onInputFileFocus,
				'select': this.onInputFileFocus,
				'blur': this.onInputFileBlur,
				scope: this
			});
			// add a tooltip
			if (this.tooltip) {
				if (typeof this.tooltip == 'object') {
					Ext.QuickTips.register(Ext.apply({
						target: this.inputFileEl
					}, this.tooltip));
				} else {
					this.inputFileEl.dom[this.tooltipType] = this.tooltip;
				}
			}
		},
		/**
		 * Redirecting focus to the input file element so the user can press
		 * space and select files.
		 * 
		 * @param {Event}
		 *            e focus event.
		 * @private
		 */
		onButtonFocus: function(e){
			if (this.inputFileEl) {
				this.inputFileEl.focus();
				e.stopEvent();
			}
		},
		/**
		 * Handler for the IE case where once can tab to the text box of an
		 * input file el. If the key is a space, we simply "click" the
		 * inputFileEl.
		 * 
		 * @param {Event}
		 *            e key event.
		 * @private
		 */
		onButtonKeyDown: function(e){
			if (this.inputFileEl && e.getKey() == Ext.EventObject.SPACE) {
				this.inputFileEl.dom.click();
				e.stopEvent();
			}
		},
		/**
		 * Handler when the cursor moves over the clipEl. The floatEl gets
		 * centered to the cursor location.
		 * 
		 * @param {Event}
		 *            e mouse event.
		 * @private
		 */
		onButtonMouseMove: function(e){
			var xy = e.getXY();
			xy[0] -= this.FLOAT_EL_WIDTH / 2;
			xy[1] -= this.FLOAT_EL_HEIGHT / 2;
			// this.floatEl.setXY(xy);
		},
		/**
		 * Add the visual enhancement to the button when the input file recieves
		 * focus. This is the tip for the user that now he/she can press space
		 * to select the file.
		 * 
		 * @private
		 */
		onInputFileFocus: function(e){
			if (!this.isDisabled) {
				this.el.addClass("x-btn-over");
			}
		},
		/**
		 * Removes the visual enhancement from the button.
		 * 
		 * @private
		 */
		onInputFileBlur: function(e){            			
			this.el.removeClass("x-btn-over");
		},
		/**
		 * Handler when inputFileEl's "Browse..." button is clicked.
		 * 
		 * @param {Event}
		 *            e click event.
		 * @private
		 */
		onInputFileClick: function(e){
			e.stopPropagation();
		},
		/**
		 * Handler when inputFileEl changes value (i.e. a new file is selected).
		 * 
		 * @private
		 */
		onInputFileChange: function(){
			if (this.originalHandler) {
				this.originalHandler.call(this.originalScope, this);
			}
		},
		/*
		 * Public methods:
		 */
		/**
		 * Detaches the input file associated with this BrowseButton so that it
		 * can be used for other purposed (e.g. uplaoding). The returned input
		 * file has all listeners and tooltips applied to it by this class
		 * removed.
		 * 
		 * @param {Boolean}
		 *            whether to create a new input file element for this
		 *            BrowseButton after detaching. True will prevent creation.
		 *            Defaults to false.
		 * @return {Ext.Element} the detached input file element.
		 */
		detachInputFile: function(noCreate){
			var result = this.inputFileEl;
			if (typeof this.tooltip == 'object') {
				Ext.QuickTips.unregister(this.inputFileEl);
			} else {
				this.inputFileEl.dom[this.tooltipType] = null;
			}
			this.inputFileEl.removeAllListeners();
			this.inputFileEl = null;
			if (!noCreate) {
				this.createInputFile();
			}
			return result;
		},
		/**
		 * @return {Ext.Element} the input file element attached to this
		 *         BrowseButton.
		 */
		getInputFile: function(){
			return this.inputFileEl;
		},
		/**
		 * @see Ext.Button.disable
		 */
		disable: function(){
			cbx.formElement.BrowseButton.superclass.disable.call(this);
			this.inputFileEl.dom.disabled = true;
		},
		/**
		 * @see Ext.Button.enable
		 */
		enable: function(){
			cbx.formElement.BrowseButton.superclass.enable.call(this);
			this.inputFileEl.dom.disabled = false;
		}
	});
	Ext.reg('cbx-browsebutton', cbx.formElement.BrowseButton);
	/**
	 * cbx.formElement.FileUploader
	 */
	/* global Ext */
	/**
	 * @class cbx.formElement.FileUploader
	 * @extends Ext.util.Observable
	 * @constructor
	 */
	cbx.formElement.FileUploader = function(config) {
		Ext.apply(this, config);
		// call parent
		cbx.formElement.FileUploader.superclass.constructor.apply(this, arguments);
		// add events
		this.addEvents(
			/**
			 * @event beforeallstart Fires before an upload (of all files) is
			 *        started. Return false to cancel the event.
			 * @param {cbx.formElement.FileUploader}
			 *            this
			 */
			 'beforeallstart',
			/**
			 * @event allfinished Fires after upload (of all files) is finished
			 * @param {cbx.formElement.FileUploader}
			 *            this
			 */
			'allfinished',
			/**
			 * @event beforefilestart Fires before the file upload is started.
			 *        Return false to cancel the event. Fires only when
			 *        singleUpload = false
			 * @param {cbx.formElement.FileUploader}
			 *            this
			 * @param {Ext.data.Record}
			 *            record upload of which is being started
			 */
			'beforefilestart',
			/**
			 * @event filefinished Fires when file finished uploading. Fires
			 *        only when singleUpload = false
			 * @param {cbx.formElement.FileUploader}
			 *            this
			 * @param {Ext.data.Record}
			 *            record upload of which has finished
			 */
			'filefinished',
			/**
			 * @event progress Fires when progress has been updated
			 * @param {cbx.formElement.FileUploader}
			 *            this
			 * @param {Object}
			 *            data Progress data object
			 * @param {Ext.data.Record}
			 *            record Only if singleUpload = false
			 */
			'progress'
		);
	}; // eo constructor
	Ext.extend(cbx.formElement.FileUploader, Ext.util.Observable, {
		// configuration options
		/**
		 * @cfg {Object} baseParams baseParams are sent to server in each
		 *      request.
		 */
		 baseParams:{cmd:'upload',dir:'.'},
		/**
		 * @cfg {Boolean} concurrent true to start all requests upon upload
		 *      start, false to start the next request only if previous one has
		 *      been completed (or failed). Applicable only if singleUpload =
		 *      false
		 */
		concurrent:true,
		/**
		 * @cfg {Boolean} enableProgress true to enable querying server for
		 *      progress information
		 */
		enableProgress:false,
		/**
		 * @cfg {String} jsonErrorText Text to use for json error
		 */
		jsonErrorText:CRB.getFWBundle() && CRB.getFWBundle()['ERR_JSON_DECODE'] ? CRB.getFWBundle()['ERR_JSON_DECODE']:'ERR_JSON_DECODE', // CHG_FF_ENH
		/**
		 * @cfg {Number} Maximum client file size in bytes
		 */
		maxFileSize:524288,
		/**
		 * @cfg {String} progressIdName Name to give hidden field for upload
		 *      progress identificator
		 */
		progressIdName:'UPLOAD_IDENTIFIER',
		/**
		 * @cfg {Number} progressInterval How often (in ms) is progress
		 *      requested from server
		 */
		progressInterval:2000,
		/**
		 * @cfg {String} progressUrl URL to request upload progress from
		 */
		progressUrl:this.url,
			// this.progressUrl = this.url;
		/**
		 * @cfg {Object} progressMap Mapping of received progress fields to
		 *      store progress fields
		 */
		progressMap:{
			 bytes_total:'bytesTotal'
			,bytes_uploaded:'bytesUploaded'
			,est_sec:'estSec'
			,files_uploaded:'filesUploaded'
			,speed_average:'speedAverage'
			,speed_last:'speedLast'
			,time_last:'timeLast'
			,time_start:'timeStart'
		},
		/**
		 * @cfg {Boolean} singleUpload true to upload files in one form, false
		 *      to upload one by one
		 */
		singleUpload:false,
		/**
		 * @cfg {Ext.data.Store} store Mandatory. Store that holds files to
		 *      upload
		 */
		/**
		 * @cfg {String} unknownErrorText Text to use for unknow error
		 */
		unknownErrorText:CRB.getFWBundle() && CRB.getFWBundle()['ERR_UNKNOWN'] ? CRB.getFWBundle()['ERR_UNKNOWN']:'ERR_UNKNOWN', // CHG_FF_ENH
		/**
		 * @cfg {String} url Mandatory. URL to upload to
		 */
		// private
		/**
		 * uploads in progress count
		 * 
		 * @private
		 */
		upCount:0,
		callBackSuccess: 'afterUploadSuccess',
		// methods
		// {{{
		/**
		 * creates form to use for upload.
		 * 
		 * @private
		 * @return {Ext.Element} form
		 */
		createForm:function(record) {
			var progressId = parseInt(Math.random() * 1e10, 10);
			var form = Ext.getBody().createChild({
				 tag:'form'
				,action:this.url
				,method:'post'
				,cls:'x-hidden'
				,id:Ext.id()
				,cn:[{
					 tag:'input'
					,type:'hidden'
					,name:'APC_UPLOAD_PROGRESS'
					,value:progressId
				},{
					 tag:'input'
					,type:'hidden'
					,name:this.progressIdName
					,value:progressId
				},{
					 tag:'input'
					,type:'hidden'
					,name:'MAX_FILE_SIZE'
					,value:this.maxFileSize
				}]
			});
			if(record) {
				record.set('form', form);
				record.set('progressId', progressId);
			}
			else {
				this.progressId = progressId;
			}
			return form;
		}, // eo function createForm
		deleteForm:function(form, record) {
			form.remove();
			if(record) {
				record.set('form', null);
			}
		}, // eo function deleteForm
		/**
		 * Fires event(s) on upload finish/error
		 * 
		 * @private
		 */
		fireFinishEvents:function(options) {
			if(true !== this.eventsSuspended && !this.singleUpload) {
				this.fireEvent('filefinished', this, options && options.record);
			}
			if(true !== this.eventsSuspended && 0 === this.upCount) {
				this.stopProgress();
				this.fireEvent('allfinished', this);
			}
		}, // eo function fireFinishEvents
		/**
		 * Geg the iframe identified by record
		 * 
		 * @private
		 * @param {Ext.data.Record}
		 *            record
		 * @return {Ext.Element} iframe or null if not found
		 */
		getIframe:function(record) {
			var iframe = null;
			var form = record.get('form');
			if(form && form.dom && form.dom.target) {
				iframe = Ext.get(form.dom.target);
			}
			return iframe;
		}, // eo function getIframe
		/**
		 * returns options for Ajax upload request
		 * 
		 * @private
		 * @param {Ext.data.Record}
		 *            record
		 * @param {Object}
		 *            params params to add
		 */
		getOptions:function(record, params) {
			var o = {
				 url:this.url
				,method:'post'
				,isUpload:true
				,scope:this
				,callback:this.uploadCallback
				,record:record
				,params:this.getParams(record, params)
			};
			return o;
		}, // eo function getOptions
		/**
		 * get params to use for request
		 * 
		 * @private
		 * @return {Object} params
		 */
		getParams:function(record, params) {
			var p = {path:this.path,headers : {'Content-type' : 'multipart/form-data'},__PIGGYBACKREQUEST:'Y' };
			Ext.apply(p, this.baseParams || {}, params || {});
			return p;
		},
		/**
		 * processes success response
		 * 
		 * @private
		 * @param {Object}
		 *            options options the request was called with
		 * @param {Object}
		 *            response request response object
		 * @param {Object}
		 *            o decoded response.responseText
		 */
		/** FILE_UPLOAD_ENHANCEMENTS -- Starts */
		processSuccess:function(options, response, o) {
			var record = false;            			
			var uploadResponse = Ext.util.JSON.decode( response.responseText ).response;
			// all files uploadded ok
			if(this.singleUpload) {
				var result=[];
				this.store.each(function(r) {
					r.set('state', 'done');
					r.set('error', '');
					r.set('enryptedFileName', uploadResponse.enryptedFileName); // Added
																				// to
																				// attach
																				// enryptedFileName
																				// on
																				// file
																				// store
					r.set('attachmentRefNumber', uploadResponse.attachmentRefNumber); // Added
																						// to
																						// attach
																						// filereferencenumber
																						// on
																						// file
																						// store
					r.set('bytesUploaded',uploadResponse.FileSize);
					r.commit();
					result.push({'state':r.get('state')});
    				result.push({'enryptedFileName':r.get('enryptedFileName')}); // Added
																					// to
																					// attach
																					// enryptedFileName
																					// on
																					// file
																					// store
    				result.push({'filesize':r.get('bytesUploaded')});
    				result.push({'filename':r.get('fileName')});
    				result.push({'attachmentRefNumber':r.get('attachmentRefNumber')}); // Added
																						// to
																						// attach
																						// filereferencenumber
																						// on
																						// file
																						// store
    				this.model.updateValue(this.panel.name, result);
				});
				if(responseCount==this.totalqueuedcount){
					responseCount=0;
					this.uploadProgressBar.hide();
    			this.handlerCallback.apply('state',['uploaded']); // Calling
																	// back the
																	// handler
																	// after
																	// receiving
																	// the
																	// response.
    			}
			} 
			else {
				record = options.record;
				record.set('state', 'done');
				record.set('error', '');
				record.set('enryptedFileName', uploadResponse.enryptedFileName);
				record.set('attachmentRefNumber', uploadResponse.attachmentRefNumber);
				record.set('bytesUploaded',uploadResponse.FileSize);
				record.commit();
				var result=[];
				for ( var i = 0; i < this.store.getCount(); i++) {			
					result.push({'state':this.store.getAt(i).get('state'),'enryptedFileName':this.store.getAt(i).get('enryptedFileName'),'filename':this.store.getAt(i).get('fileName'),'attachmentRefNumber':this.store.getAt(i).get('attachmentRefNumber'),'filesize':this.store.getAt(i).get('bytesUploaded')});
					this.model.updateValue(this.panel.name, result);
				}				
				
				            				
    			if(responseCount==this.totalqueuedcount){
    				responseCount=0;
    				this.uploadProgressBar.hide();
    				
    			this.handlerCallback.apply('state',['uploaded']); // Calling
																	// back the
																	// handler
																	// after
																	// receiving
																	// the
																	// response.
    			}
			}
			
			 this.deleteForm(options.form, record);
		}, // eo processSuccess
		/** FILE_UPLOAD_ENHANCEMENTS -- Ends */
		/**
		 * processes failure response
		 * 
		 * @private
		 * @param {Object}
		 *            options options the request was called with
		 * @param {Object}
		 *            response request response object
		 * @param {String/Object}
		 *            error Error text or JSON decoded object. Optional.
		 */
		processFailure:function(options, response, error) {
			var record = options.record;
			var records;
			// singleUpload - all files uploaded in one form
			if(this.singleUpload) {
				// some files may have been successful
				records = this.store.queryBy(function(r){
					var state = r.get('state');
					return 'done' !== state && 'uploading' !== state;
				});
				records.each(function(record) {
					var e = error.errors ? error.errors[record.id] : this.unknownErrorText;
					if(e) {
						record.set('state', 'failed');
						record.set('error', e);
						Ext.getBody().appendChild(record.get('input'));
					}
					else {
						record.set('state', 'done');
						record.set('error', '');
					}
					record.commit();
				}, this);
				var result=[];
				/** FILE_UPLOAD_ENHANCEMENTS -- Starts */
				for ( var i = 0; i < this.store.getCount(); i++) {
					// Added enryptedFileName and filereference number which is
					// retrieved from file store which is to be in part of
					// result array.
					result.push({'state':this.store.getAt(i).get('state'),'enryptedFileName':this.store.getAt(i).get('enryptedFileName'),'filename':this.store.getAt(i).get('fileName'),'attachmentRefNumber':this.store.getAt(i).get('attachmentRefNumber'),'filesize':'0'});
					this.model.updateValue(this.panel.name, result);
				}				
				/** FILE_UPLOAD_ENHANCEMENTS -- Ends */				
				
				
    			if(responseCount==this.totalqueuedcount){
    				responseCount=0;
    				this.uploadProgressBar.hide();
    			this.handlerCallback.apply('state',['uploaded']);
    			}
			}
			// multipleUpload - each file uploaded in it's own form
			else {
			var uploadResponse = Ext.util.JSON.decode( response.responseText ).response;
			/** FW138_MIMEVALID01 - Starts */
			if(error && 'object' === Ext.type(error)) {
				 if(response && response.responseText && uploadResponse){
					 var errMsg = null;// frank
					 if(uploadResponse.size){
						 errMsg = (CRB.getFWBundle()[uploadResponse.error]?CRB.getFWBundle()[uploadResponse.error]:uploadResponse.error)+" "+uploadResponse.size;
					 }
					 else{
						 errMsg = CRB.getFWBundle()[uploadResponse.error] || uploadResponse.error;
					 }
					record.set('error',errMsg );
				}else{
					record.set('error', this.unknownErrorText);	
				}
			}
			else if(error) {
				record.set('error', error);
			}
			else if(response && response.responseText && uploadResponse) {
				if(uploadResponse.size){// frank
					record.set('error', CRB.getFWBundle() && CRB.getFWBundle()[uploadResponse.error]
									?CRB.getFWBundle()[uploadResponse.error]+" "+uploadResponse.size:uploadResponse.error);
				}
				else{
					record.set('error',CRB.getFWBundle() && CRB.getFWBundle()[uploadResponse.error]
									?CRB.getFWBundle()[uploadResponse.error] : uploadResponse );
				}
			}
			else {
				record.set('error', this.unknownErrorText);
			}
			/** FW138_MIMEVALID01 - Ends */
			record.set('state', 'failed');
			record.set('attachmentRefNumber',''); // Added to attach
													// attachmentRefNumber on
													// record set.
			record.commit();
			var result=[];
			for ( var i = 0; i < this.store.getCount(); i++) {
				// Added enryptedFileName and filereference number which is
				// retrieved from file store which is to be in part of result
				// array.
				result.push({'state':this.store.getAt(i).get('state'),'enryptedFileName':this.store.getAt(i).get('enryptedFileName'),'filename':this.store.getAt(i).get('fileName'),'attachmentRefNumber':this.store.getAt(i).get('attachmentRefNumber'),'filesize':'0'});
				this.model.updateValue(this.panel.name, result);
			}  
			if(responseCount==this.totalqueuedcount){
				responseCount=0;
				this.uploadProgressBar.hide();
    			this.handlerCallback.apply('state',['notuploaded']);
    			}
			}
			this.deleteForm(options.form, record); 
		}, // eof processFailure
		/**
		 * Delayed task callback
		 */
		requestProgress:function() {
			var records, p;
			var o = {
				 url:this.progressUrl
				,method:'post'
				,params:{}
				,scope:this
				,callback:function(options, success, response) {
					var o;
					if(true !== success) {
						return;
					}
					try {
						o = Ext.decode(response.responseText);
					}
					catch(e) {
						return;
					}
					if('object' !== Ext.type(o) || true !== o.success) {
						return;
					}
					if(this.singleUpload) {
						this.progress = {};
						for(p in o) {
							if(this.progressMap[p]) {
								this.progress[this.progressMap[p]] = parseInt(o[p], 10);
							}
						}
						if(true !== this.eventsSuspended) {
							this.fireEvent('progress', this, this.progress);
						}
					}
					else {
						for(p in o) {
							if(this.progressMap[p] && options.record) {
								options.record.set(this.progressMap[p], parseInt(o[p], 10));
							}
						}
						if(options.record) {
							options.record.commit();
							if(true !== this.eventsSuspended) {
								this.fireEvent('progress', this, options.record.data, options.record);
							}
						}
					}
					this.progressTask.delay(this.progressInterval);
				}
			};
			if(this.singleUpload) {
				o.params[this.progressIdName] = this.progressId;
				o.params.APC_UPLOAD_PROGRESS = this.progressId;
				o.params.__PIGGYBACKREQUEST='Y';
				Ext.Ajax.request(o);
			}
			else {
				records = this.store.query('state', 'uploading');
				records.each(function(r) {
					o.params[this.progressIdName] = r.get('progressId');
					o.params.APC_UPLOAD_PROGRESS = o.params[this.progressIdName];
					o.record = r;
					o.params.__PIGGYBACKREQUEST='Y';
					(function() {
						Ext.Ajax.request(o);
					}).defer(250);
				}, this);
			}
		}, // eo function requestProgress
		/**
		 * path setter
		 * 
		 * @private
		 */
		setPath:function(path) {
			this.path = path;
		}, // eo setPath
		/**
		 * url setter
		 * 
		 * @private
		 */
		setUrl:function(url) {
			this.url = url;
		}, // eo setUrl
		/**
		 * Starts progress fetching from server
		 * 
		 * @private
		 */
		startProgress:function() {
			if(!this.progressTask) {
				this.progressTask = new Ext.util.DelayedTask(this.requestProgress, this);
			}
			this.progressTask.delay.defer(this.progressInterval / 2, this.progressTask, [this.progressInterval]);
		}, // eo function startProgress
		/**
		 * Stops progress fetching from server
		 * 
		 * @private
		 */
		stopProgress:function() {
			if(this.progressTask) {
				this.progressTask.cancel();
			}
		}, // eo function stopProgress
		/**
		 * Stops all currently running uploads
		 */
		stopAll:function() {
			var records = this.store.query('state', 'uploading');
			records.each(this.stopUpload, this);
		}, // eo function stopAll
		/**
		 * Stops currently running upload
		 * 
		 * @param {Ext.data.Record}
		 *            record Optional, if not set singleUpload = true is assumed
		 *            and the global stop is initiated
		 */
		stopUpload:function(record) {
			// single abord
			var iframe = false;
			if(record) {
				iframe = this.getIframe(record);
				this.stopIframe(iframe);
				this.upCount--;
				this.upCount = 0 > this.upCount ? 0 : this.upCount;
				record.set('state', 'stopped');
				this.fireFinishEvents({record:record});
			}
			// all abort
			else if(this.form) {
				iframe = Ext.fly(this.form.dom.target);
				this.stopIframe(iframe);
				this.upCount = 0;
				this.fireFinishEvents();
			}
		}, // eo function abortUpload
		/**
		 * Stops uploading in hidden iframe
		 * 
		 * @private
		 * @param {Ext.Element}
		 *            iframe
		 */
		stopIframe:function(iframe) {
			if(iframe) {
				try {
					iframe.dom.contentWindow.stop();
					iframe.remove.defer(250, iframe);
				}
				catch(e){}
			}
		}, // eo function stopIframe
		/**
		 * Main public interface function. Preforms the upload
		 */
		upload:function(handler,queuedcounts,totalqueuedcounts,uploadProgressBar) {
			this.handlerCallback=handler;
			this.queuedcount=queuedcounts;
			this.totalqueuedcount=totalqueuedcounts;
			var records = this.store.queryBy(function(r){return 'done' !== r.get('state');});
			if(!records.getCount()) {
				
		     return;
			}
			this.uploadProgressBar=uploadProgressBar;
			// fire beforeallstart event
			if(true !== this.eventsSuspended && false === this.fireEvent('beforeallstart', this)) {
				return;
			}
			if(this.singleUpload) {
				this.uploadSingle();
			}
			else {
				records.each(this.uploadFile, this);
			}
			if(true === this.enableProgress) {
				this.startProgress();
			}
			// return this.uploadFlagSuccess;
		}, // eo function upload
		/**
		 * called for both success and failure. Does nearly nothing
		 * 
		 * @private but dispatches processing to processSuccess and
		 *          processFailure functions
		 */
		uploadCallback:function(options, success, response) {
			this.uploadFlagSuccess=false; 
			var o;
			this.upCount--;
			this.form = false;
			responseCount++;
			// process ajax success
			if(true === success || "true" === success) {
				try {
					this.uploadFlagSuccess=true;
					o = Ext.decode(response.responseText);
				}
				catch(e) {
					this.uploadFlagSuccess=false;
					this.processFailure(options, response, this.jsonErrorText);
					this.fireFinishEvents(options);
					return;
				}
				// process command success
				if(true === o.response.success || "true" === o.response.success) { 
					this.uploadFlagSuccess=true;
					this.processSuccess(options, response, o);
				}
				// process command failure
				else {
					this.uploadFlagSuccess=false;
					this.processFailure(options, response, o);
				}
			}
			// process ajax failure
			else {
				this.uploadFlagSuccess=false;
				this.processFailure(options, response);
			}
			this.fireFinishEvents(options);
		}, // eo function uploadCallback
		/**
		 * Uploads one file
		 * 
		 * @param {Ext.data.Record}
		 *            record
		 * @param {Object}
		 *            params Optional. Additional params to use in request.
		 */
		uploadFile:function(record, params) {
			// fire beforestart event
			if(true !== this.eventsSuspended && false === this.fireEvent('beforefilestart', this, record)) {            				
			return;
			}
			// create form for upload
			var form = this.createForm(record);
			// append input to the form
			var inp = record.get('input');
			inp.set({name:inp.id});
			form.appendChild(inp);
			// get params for request
			var o = this.getOptions(record, params);
			o.form = form;
			o.params['Content-type']= 'multipart/form-data';
			o.params.headers ={'Content-type' : 'multipart/form-data'};
			o.params.__PIGGYBACKREQUEST = 'Y';
			/** FW138_MIMEVALID01 - Starts */
			o.params['Form-Id']= this.panel.formId;
			o.params['Item-Id']= this.panel.itemId;
            o.url=o.url+'?timeout='+new Date().getTime()+'&'+iportal.systempreferences.getCSRFKeyName()+"="+iportal.systempreferences.getCSRFUniqueId()
            	+'&Item-Id='+this.panel.itemId+'&Form-Id='+this.panel.formId+'&INPUT_ACTION=FILE_ATTACH_ACTION&INPUT_FUNCTION_CODE=VSBLTY&INPUT_SUB_PRODUCT=CUSER&PAGE_CODE_TYPE=FILE_UPLOAD&PRODUCT_NAME=CUSER';
            /** FW138_MIMEVALID01 - Ends */
			record.set('state', 'uploading');
			record.set('pctComplete', 0);
			// increment active uploads count
			this.upCount++;
			// request upload
			Ext.Ajax.request(o);			
			// todo:delete after devel
			this.getIframe.defer(100, this, [record]);
		}, // eo function uploadFile
		/**
		 * Uploads all files in single request
		 */
		uploadSingle:function() {
			// get records to upload
			var records = this.store.queryBy(function(r){return 'done' !== r.get('state');});
			if(!records.getCount()) {
				this.uploadFlagSuccess=false;
				return;
			}
			// create form and append inputs to it
			var form = this.createForm();
			records.each(function(record) {
				var inp = record.get('input');
				inp.set({name:inp.id});
				form.appendChild(inp);
				record.set('state', 'uploading');
			}, this);
			// create options for request
			var o = this.getOptions();
			o.params.__PIGGYBACKREQUEST='Y';
			o.form = form;
			// save form for stop
			this.form = form;
			// increment active uploads counter
			this.upCount++;
			// request upload
			Ext.Ajax.request(o);
		} // eo function uploadSingle
	}); // eo extend
	// register xtype
	Ext.reg('fileuploader', cbx.formElement.FileUploader);
	 // eof
	var responseCount = 0;
	var nRemoveAllButton = 0;
	/* global Ext */
	/**
	 * @class cbx.formElement.UploadPanel
	 * @extends Ext.Panel
	 */
	cbx.formElement.UploadPanel = function(config) {
    	this.plainLabel = config.plainLbl;
	/** FILE_UPLOAD_ENHANCEMENTS -- Starts */
    	this.displayNmKey = config.displayNmKey; 
    	this.name = config.itemId;
    	this.required = config.requiredInd ==='Y' ? true :false; // Added
																	// Required
																	// indicator
																	// to decide
																	// whether
																	// the
																	// component
																	// is
																	// mandotory
																	// or not.
    	this.conditional = config.conditionalInd ==='Y'? true :false; // Added
																		// Conditional
																		// indicator.
  	/** FILE_UPLOAD_ENHANCEMENTS -- Ends */
    	this.hidden = config.visibleInd === 'Y' ? false : true;
    	cbx.formElement.UploadPanel.superclass.constructor.call(this, config);
    };
	Ext.extend(cbx.formElement.UploadPanel, Ext.Panel, {
		// configuration options overridable from outside
		/**
		 * @cfg {String} addIconCls icon class for add (file browse) button
		 */
		 addIconCls:'icon-plus',
		/**
		 * @cfg {String} addText Text on Add button
		 */
		addText:CRB.getFWBundle() && CRB.getFWBundle()['addText'] ? CRB.getFWBundle()['addText']:'Add',
		/**
		 * @cfg {Object} baseParams This object is not used directly by
		 *      FileTreePanel but it is propagated to lower level objects
		 *      instead. Included here for convenience.
		 */
		/**
		 * @cfg {String} bodyStyle style to use for panel body
		 */
		bodyStyle:'padding:2px',
		/**
		 * @cfg {String} buttonsAt Where buttons are placed. Valid values are
		 *      tbar, bbar, body (defaults to 'tbar')
		 */
		buttonsAt:'tbar',
		/**
		 * @cfg {String} clickRemoveText
		 */
		clickRemoveText:CRB.getFWBundle() && CRB.getFWBundle()['clickRemoveText'] ? CRB.getFWBundle()['clickRemoveText']:'Click to remove',
		/**
		 * @cfg {String} clickStopText
		 */
		clickStopText:CRB.getFWBundle() && CRB.getFWBundle()['clickStopText'] ? CRB.getFWBundle()['clickStopText']:'Click to stop',
		/** FILE_UPLOAD_ENHANCEMENTS -- Starts */
		/**
		 * @cfg {String} emptyText empty text for dataview
		 */
		emptyText:CRB.getFWBundle() && CRB.getFWBundle()['emptyText'] ? CRB.getFWBundle()['emptyText']:'No Files',
		/** FILE_UPLOAD_ENHANCEMENTS -- Ends */
		/**
		 * @cfg {Boolean} enableProgress true to enable querying server for
		 *      progress information Passed to underlying uploader. Included
		 *      here for convenience.
		 */
		enableProgress:false,
		/**
		 * @cfg {String} errorText
		 */
		errorText:'Error',
		/**
		 * @cfg {String} fileCls class prefix to use for file type classes
		 */
		fileCls:'file',
		/**
		 * @cfg {String} fileQueuedText File upload status text
		 */
		fileQueuedText:CRB.getFWBundle() && CRB.getFWBundle()['fileQueuedText'] ? CRB.getFWBundle()['fileQueuedText']:'File <b>{0}</b> is queued for upload', 
		/**
		 * @cfg {String} fileDoneText File upload status text
		 */
		fileDoneText:CRB.getFWBundle() && CRB.getFWBundle()['fileDoneText'] ? CRB.getFWBundle()['fileDoneText']:'File <b>{0}</b> has been successfully uploaded', 
		/**
		 * @cfg {String} fileFailedText File upload status text
		 */
		fileFailedText:CRB.getFWBundle()  && CRB.getFWBundle()['fileFailedText']  ? CRB.getFWBundle()['fileFailedText']:'File <b>{0}</b> failed to upload', 
		/**
		 * @cfg {String} fileStoppedText File upload status text
		 */
		fileStoppedText:CRB.getFWBundle()  && CRB.getFWBundle()['fileStoppedText']  ? CRB.getFWBundle()['fileStoppedText']:'File <b>{0}</b> stopped by user', 
		/**
		 * @cfg {String} fileUploadingText File upload status text
		 */
		fileUploadingText:CRB.getFWBundle() && CRB.getFWBundle()['fileUploadingText'] ? CRB.getFWBundle()['fileUploadingText']:'Uploading file <b>{0}</b>', 
		/**
		 * @cfg {Number} maxFileSize Maximum upload file size in bytes This
		 *      config property is propagated down to uploader for convenience
		 */
		maxFileSize:524288,
		/**
		 * @cfg {Number} Maximum file name length for short file names
		 */
		maxLength:18,
		/**
		 * @cfg {String} removeAllIconCls iconClass to use for Remove All button
		 *      (defaults to 'icon-cross'
		 */
		removeAllIconCls:'icon-cross',
		/**
		 * @cfg {String} removeAllText text to use for Remove All button tooltip
		 */
		removeAllText:CRB.getFWBundle() && CRB.getFWBundle()['removeAllText'] ? CRB.getFWBundle()['removeAllText']:'Remove All', 
		/**
		 * @cfg {String} removeIconCls icon class to use for remove file icon
		 */
		removeIconCls:'icon-minus',
		/**
		 * @cfg {String} removeText Remove text
		 */
		removeText:CRB.getFWBundle() && CRB.getFWBundle()['removeText'] ? CRB.getFWBundle()['removeText']:'Remove', 
		/**
		 * @cfg {String} selectedClass class for selected item of DataView
		 */
		selectedClass:'ux-up-item-selected',
		/**
		 * @cfg {Boolean} singleUpload true to upload files in one form, false
		 *      to upload one by one This config property is propagated down to
		 *      uploader for convenience
		 */
		singleUpload:false,
		/**
		 * @cfg {String} stopAllText
		 */
		stopAllText:CRB.getFWBundle() && CRB.getFWBundle()['stopAllText'] ? CRB.getFWBundle()['stopAllText'] :'Stop All',
		/**
		 * @cfg {String} stopIconCls icon class to use for stop
		 */
		stopIconCls:'icon-stop',
		/**
		 * @cfg {String/Ext.XTemplate} tpl Template for DataView.
		 */
		/**
		 * @cfg {String} uploadText Upload text
		 */
		uploadText:CRB.getFWBundle() && CRB.getFWBundle()['uploadText'] ?CRB.getFWBundle()['uploadText']:'Upload', 
		/**
		 * @cfg {String} uploadIconCls icon class to use for upload button
		 */
		uploadIconCls:'icon-upload',
		/**
		 * @cfg {String} workingIconCls iconClass to use for busy indicator
		 */
		workingIconCls:'icon-working',
		RTLSupported:iportal.preferences.isLangDirectionRTL?iportal.preferences.isLangDirectionRTL():false,
		/** FILE_UPLOAD_ENHANCEMENTS -- Starts */
				/**
				 * @cfg {Boolean} isFormField true to enable markInvalid method
				 */
		isFormField :true,
		url:'./pfus',
		defaulttoolTipText:CRB.getFWBundle() && CRB.getFWBundle()['uploadPanelInvalidText'] ?CRB.getFWBundle()['uploadPanelInvalidText']:'Please upload atlest one file', 
		/** FILE_UPLOAD_ENHANCEMENTS -- Ends */
		initComponent:function() {
			//CBXFW_DIT_77 starts
			this.on('hide',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'N']));
			this.on('show',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'Y']));
			//CBXFW_DIT_77 ends
	   this.uploadCount= this.uploadCount || 1;
	   this.maxFileSize=10485760;
	   // this.enableProgress=true;
		var totalColumns = !Ext.isEmpty(this.totalColumns) ? this.totalColumns
    				: 1;
        		var bundle;
        		var commonbundle = CRB.getFWBundle();
        		// To get the bundle key reference
        		bundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));
			/** FILE_UPLOAD_ENHANCEMENTS -- Starts */
        		if (!Ext.isEmpty(this.plainLbl)) {
        			this.title = this.plainLbl;
        		} else if (Ext.isEmpty(this.displayNmKey)) {
        			this.title = '';
        			this.collapsible = false;
        		} else {
        			this.title = bundle['LBL_' + this.displayNmKey];
        		}
        		this.labelSeparator = '';
        		/**
				 * If the component is mandatory/conditional then appending the
				 * title with style class to indicate the component.
				 */
        		if(this.required){
        			this.title=this.title+'<span class = \'mandatory\'">*</span>';
        		}else if(this.conditional){
        			this.title=this.title+'<span class = \'cbx-mandatory-fx\'">*</span>';
        		}
			/** FILE_UPLOAD_ENHANCEMENTS -- Ends */
	   //this.url='./pfus';
			
			// add (file browse button) configuration
			var addCfg = {
				 xtype:'cbx-browsebutton'
				,text:this.addText + '...'
				,iconCls:this.addIconCls
				,scope:this
				,handler:this.onAddFile
			};
			// upload button configuration
			var upCfg = {
				 xtype:'button'
				,iconCls:this.uploadIconCls
				,text:this.uploadText
				,scope:this
				,handler:this.onUpload
				,disabled:true
				,hidden:true
			};
			
			var upCfgForImage = {
					 xtype:'button'
					,iconCls:this.uploadIconCls
					,text:this.uploadText
					,cls:'uploadBtnCls'
					,ctCls:'uploadBtnctCls'
					,scope:this
					,id:this.name+"_UploadBtn"
					,handler:this.uploadClick
				};

			nRemoveAllButton++;
			// remove all button configuration
			var removeAllCfg = {
				xtype:'button'
				,ctCls : 'cbx-fileupload-bar'	
				,id:'removeAttachedFiles'+nRemoveAllButton
				,name:'removeAttachedFiles'+nRemoveAllButton
				,iconCls:this.removeAllIconCls
				,tooltip:this.removeAllText
				,scope:this
				,handler:this.onRemoveAllClick
				,disabled:true
			};
			// todo: either to cancel buttons in body or implement
			// it
			if('body' !== this.buttonsAt) {
				if(this.uploadButton)
				this[this.buttonsAt] = [addCfg, upCfgForImage,'->', removeAllCfg];
				else
				this[this.buttonsAt] = [addCfg,'->', removeAllCfg];
			}			
			// create store
			// fields for record
			var fields = [
				 {name:'id', type:'text', system:true}
				,{name:'shortName', type:'text', system:true}
				,{name:'fileName', type:'text', system:true}
				,{name:'filePath', type:'text', system:true}
				,{name:'fileCls', type:'text', system:true}
				,{name:'input', system:true}
				,{name:'form', system:true}
				,{name:'state', type:'text', system:true}
				,{name:'error', type:'text', system:true}
				,{name:'progressId', type:'int', system:true}
				,{name:'bytesTotal', type:'int', system:true}
				,{name:'bytesUploaded', type:'int', system:true}
				,{name:'estSec', type:'int', system:true}
				,{name:'filesUploaded', type:'int', system:true}
				,{name:'speedAverage', type:'int', system:true}
				,{name:'speedLast', type:'int', system:true}
				,{name:'timeLast', type:'int', system:true}
				,{name:'timeStart', type:'int', system:true}
				,{name:'pctComplete', type:'int', system:true}
				/** FILE_UPLOAD_ENHANCEMENTS -- Starts */
				,{name:'enryptedFileName', type:'text'} // Added
														// enryptedFileName as
														// part of fieldlist
				,{name:'attachmentRefNumber', type:'text'} // Added
															// filereferencenumber
															// as part of
															// fieldlist
				/** FILE_UPLOAD_ENHANCEMENTS -- Ends */
			];
			// add custom fields if passed
			if(Ext.isArray(this.customFields)) {
				fields.push(this.customFields);
			}
			// create store
			this.store = new Ext.data.SimpleStore({
				 id:0
				,fields:fields
				,data:[]
			});
			// create view
			if(!this.RTLSupported){
			Ext.apply(this, {
				items:[{
					 xtype:'dataview'
					,itemSelector:'div.ux-up-item'
					,store:this.store
					,selectedClass:this.selectedClass
					,singleSelect:true
					,deferEmptyText:true // FILE_UPLOAD_ENHANCEMENTS
					,emptyText:this.emptyText
					,tpl: this.tpl || new Ext.XTemplate(
						  '<tpl for=".">'
						+ '<div class="ux-up-item">'
						+ '<div class="ux-up-icon-file {fileCls}">&#160;</div>'
						+ '<div class="ux-up-text x-unselectable handCursor" ext:qtip="{fileName}">{shortName}</div>'
						+ '<div id="remove-{[values.input.id]}" class="ux-up-icon-state ux-up-icon-{state}"'
						+ 'ext:qtip="{[this.scope.getQtip(values)]}">&#160;</div>'
						+ '</div>'
						+ '</tpl>'
						, {scope:this}
					)
					,listeners:{click:{scope:this, fn:this.onViewClick}}
				}]
			});
		}
			else{
				Ext.apply(this, {
    				items:[{
    					 xtype:'dataview'
    					,itemSelector:'div.ux-up-item'
    					,store:this.store
    					,selectedClass:this.selectedClass
    					,singleSelect:true
    					,deferEmptyText:true // FILE_UPLOAD_ENHANCEMENTS
    					,emptyText:this.emptyText
    					,tpl: this.tpl || new Ext.XTemplate(
    								  '<tpl for=".">'
    								+ '<div class="ux-up-item" style="background-image:none">'
    								+ '<div class="ux-up-icon-file {fileCls}">&#160;</div>'	
    								+ '<div  class="ux-up-text x-unselectable handCursor" ext:qtip="{fileName}">{shortName}</div>'
    								+ '<div id="remove-{[values.input.id]}" style="float:left" class="ux-up-icon-state ux-up-icon-{state}"'
    								+ 'ext:qtip="{[this.scope.getQtip(values)]}">&#160;</div>'
    								+ '</div>'
    								+ '</tpl>'
    							, {scope:this}
    						)
    					,listeners:{click:{scope:this, fn:this.onViewClick}}
    				}]
    			});            				
			}
			var defaultConfig = {
            			layout : 'tableform',
            			layoutConfig : {
            				columns : totalColumns
            			},
            			anchor : '100%',
            			ctCls : 'canvas-fileuploadpanel-cwrap',
            			cls : 'canvas-fileuploadpanel',
            			forceLayout : true,
            			renderHidden : true,
            			defaults : {
            				layout : 'tableform',
            				cls : 'cbx-fileupload',
            				anchor : '100%',
            				border : true,
            				manager:this.manager, // FILE_UPLOAD_ENHANCEMENTS
            				autoWidth:true, 
            				autoHeight : true
            			}
            		};
            		Ext.apply(this, defaultConfig);
			// call parent
			cbx.formElement.UploadPanel.superclass.initComponent.apply(this, arguments);
			// save useful references
			this.view = this.items.itemAt(0);
			// {{{
			// add events
			this.addEvents(
				/**
				 * Fires before the file is added to store. Return false to
				 * cancel the add
				 * 
				 * @event beforefileadd
				 * @param {cbx.formElement.UploadPanel}
				 *            this
				 * @param {Ext.Element}
				 *            input (type=file) being added
				 */
				'beforefileadd'
				/**
				 * Fires after the file is added to the store
				 * 
				 * @event fileadd
				 * @param {cbx.formElement.UploadPanel}
				 *            this
				 * @param {Ext.data.Store}
				 *            store
				 * @param {Ext.data.Record}
				 *            Record (containing the input) that has been added
				 *            to the store
				 */
				,'fileadd'
				/**
				 * Fires before the file is removed from the store. Return false
				 * to cancel the remove
				 * 
				 * @event beforefileremove
				 * @param {cbx.formElement.UploadPanel}
				 *            this
				 * @param {Ext.data.Store}
				 *            store
				 * @param {Ext.data.Record}
				 *            Record (containing the input) that is being
				 *            removed from the store
				 */
				,'beforefileremove'
				/**
				 * Fires after the record (file) has been removed from the store
				 * 
				 * @event fileremove
				 * @param {cbx.formElement.UploadPanel}
				 *            this
				 * @param {Ext.data.Store}
				 *            store
				 */
				,'fileremove'
				/**
				 * Fires before all files are removed from the store (queue).
				 * Return false to cancel the clear. Events for individual files
				 * being removed are suspended while clearing the queue.
				 * 
				 * @event beforequeueclear
				 * @param {cbx.formElement.UploadPanel}
				 *            this
				 * @param {Ext.data.Store}
				 *            store
				 */
				,'beforequeueclear'
				/**
				 * Fires after the store (queue) has been cleared Events for
				 * individual files being removed are suspended while clearing
				 * the queue.
				 * 
				 * @event queueclear
				 * @param {cbx.formElement.UploadPanel}
				 *            this
				 * @param {Ext.data.Store}
				 *            store
				 */
				,'queueclear'
				/**
				 * Fires after the upload button is clicked but before any
				 * upload is started Return false to cancel the event
				 * 
				 * @param {cbx.formElement.UploadPanel}
				 *            this
				 */
				,'beforeupload'
			);
			// relay view events
			this.relayEvents(this.view, [
				 'beforeclick'
				,'beforeselect'
				,'click'
				,'containerclick'
				,'contextmenu'
				,'dblclick'
				,'selectionchange'
			]);
			// create uploader
			var config = {
				 store:this.store
				,singleUpload:this.singleUpload
				,maxFileSize:this.maxFileSize
				,enableProgress:this.enableProgress
				,url:this.url
				,path:this.path
				,panel:this
				,model:this.model
			};
			if(this.baseParams) {
				config.baseParams = this.baseParams;
			}
			this.uploader = new cbx.formElement.FileUploader(config);
			// relay uploader events
			this.relayEvents(this.uploader, [
				 'beforeallstart'
				,'allfinished'
				,'progress'
			]);
			// install event handlers
			this.on({
				 beforeallstart:{scope:this, fn:function() {
				 	this.uploading = true;
					this.updateButtons();
				}}
				,allfinished:{scope:this, fn:function() {
					this.uploading = false;
					this.updateButtons();
				}}
				,progress:{fn:this.onProgress.createDelegate(this)}
			});
		}, // eo function initComponent
		//CBXFW_DIT_77 starts
		getScreenViewData:function()
		{
			var data =[];
			var items =this.store.data.items;
			for (var index = 0; index < items.length; index++) {
				var dataItem = {};
				dataItem.shortName = items[index].data.shortName;
				dataItem.state= items[index].data.state;
				data[data.length]= dataItem;
			}
			return data;
		},
		//CBXFW_DIT_77 ends
		/**
		 * onRender override, saves references to buttons
		 * 
		 * @private
		 */
		onRender:function() {
			this.updateScreenViewData(this);//CBXFW_DIT_77
			// call parent
			cbx.formElement.UploadPanel.superclass.onRender.apply(this, arguments);
			// save useful references
			var tb = 'tbar' === this.buttonsAt ? this.getTopToolbar() : this.getBottomToolbar();
			this.addBtn = Ext.getCmp(tb.items.first().id);
			// this.uploadBtn = Ext.getCmp(tb.items.itemAt(1).id);
			this.removeAllBtn = Ext.getCmp(tb.items.last().id);
		}, // eo function onRender
		// added methods
		/**
		 * called by XTemplate to get qtip depending on state
		 * 
		 * @private
		 * @param {Object}
		 *            values XTemplate values
		 */
		getQtip:function(values) {
			var qtip = '';
			switch(values.state) {
				case 'queued':
					qtip = String.format(this.fileQueuedText, values.fileName);
					qtip += '<br>' + this.clickRemoveText;
				break;
				case 'uploading':
					qtip = String.format(this.fileUploadingText, values.fileName);
					qtip += '<br>' + values.pctComplete + '% done';
					qtip += '<br>' + this.clickStopText;
				break;
				case 'done':
					qtip = String.format(this.fileDoneText, values.fileName);
					qtip += '<br>' + this.clickRemoveText;
				break;
				case 'failed':
					qtip = String.format(this.fileFailedText, values.fileName);
					qtip += '<br>' + this.errorText + ':' + values.error;
					qtip += '<br>' + this.clickRemoveText;
				break;
				case 'stopped':
					qtip = String.format(this.fileStoppedText, values.fileName);
					qtip += '<br>' + this.clickRemoveText;
				break;
			}
			return qtip;
		}, // eo function getQtip
		/**
		 * get file name
		 * 
		 * @private
		 * @param {Ext.Element}
		 *            inp Input element containing the full file path
		 * @return {String}
		 */
		getFileName:function(inp) {
			return inp.getValue().split(/[\/\\]/).pop();
		}, // eo function getFileName
		/**
		 * get file path (excluding the file name)
		 * 
		 * @private
		 * @param {Ext.Element}
		 *            inp Input element containing the full file path
		 * @return {String}
		 */
		getFilePath:function(inp) {
			return inp.getValue().replace(/[^\/\\]+$/,'');
		}, // eo function getFilePath
		/**
		 * returns file class based on name extension
		 * 
		 * @private
		 * @param {String}
		 *            name File name to get class of
		 * @return {String} class to use for file type icon
		 */
		getFileCls: function(name) {
			var atmp = name.split('.');
			if(1 === atmp.length) {
				return this.fileCls;
			}
			else {
				return this.fileCls + '-' + atmp.pop().toLowerCase();
			}
		},
		
		uploadClick:function() {
			var uploadFile=true;
			if (this.manager.register['uploadClick' + "|" + this.name] != null) {
				var obj = this.manager.register['uploadClick' + "|" + this.name];
				/** Executing the handler attached to beforefileadd */
				// CBXQ413F24 Starts
				uploadFile = obj.handler.apply(obj.mScope, [this.manager,this.name,this.uploadCount,this.store ]);
				// CBXQ413F24 Ends

			}
		},
		
		/**
		 * called when file is added - adds file to store
		 * 
		 * @private
		 * @param {cbx.formElement.BrowseButton}
		 */
		/** FILE_UPLOAD_ENHANCEMENTS -- Starts */
		onAddFile:function(bb) {
			var beforefileadd=true;
			if(this.uploadButton){
			Ext.getCmp(this.name+"_UploadBtn").show();
			Ext.getCmp(this.name+"_UploadBtn").enable();
			}
			if (this.manager.register['beforefileadd' + "|" + this.name] != null) {
				var obj = this.manager.register['beforefileadd' + "|" + this.name];
				/** Executing the handler attached to beforefileadd */
				//CHG_SCF_PO_004 Starts
				beforefileadd = obj.handler.apply(obj.mScope, [this.manager,this.name,this.getFileName(bb.getInputFile()),this.uploadCount,this.store ]);
				//CHG_SCF_PO_004 Ends
			}
			// if(true !== this.eventsSuspended && false ===
			// this.fireEvent('beforefileadd', this, bb.getInputFile())) {
			if(true !== this.eventsSuspended && false === beforefileadd) {
				return; 
			}
			if(this.uploadCount && parseInt(this.uploadCount)==1){
			if(this.store){
				this.store.removeAll();	
			}
			}else{
			if(this.store.getCount()>(parseInt(this.uploadCount)-1)){
			return;
			}
			}
			var inp = bb.detachInputFile();
			inp.addClass('x-hidden');
			var fileName = this.getFileName(inp);
			this.maxLengthFileName=30;
			this.maxLengthFileNameTip=30;
			this.shortFileName=fileName;
			var shortFileName=cbx.jsutil.getText(this.shortFileName,this.el.getWidth()-100);
			// create new record and add it to store
			var rec = new this.store.recordType({
				 input:inp
				,id:Ext.id()
				,fileName:fileName
				,filePath:this.getFilePath(inp)
				,shortName: shortFileName
				,fileCls:this.getFileCls(fileName)
				,state:'queued'
			}, inp.id);
			rec.commit();
			this.store.add(rec);
			this.syncShadow();
			// this.uploadBtn.enable();
			this.removeAllBtn.enable();
			if(true !== this.eventsSuspended) {
				// this.fireEvent('fileadd', this, this.store, rec);
				if (this.manager.register['fileadd' + "|" + this.name] != null) {
					var obj = this.manager.register['fileadd' + "|" + this.name];
					/** Executing the handler attached to fileadd */
					//CHG_SCF_PO_004 Starts
					var fileadd = obj.handler.apply(obj.mScope, [this.manager,this.name,this.store, rec]);
					//CHG_SCF_PO_004 Ends
				}
			}
			this.validate();
			this.doLayout();
			this.updateScreenViewData(this);//CBXFW_DIT_77
		}, // eo onAddFile
/**
 * Added markInvalid explicitly as this component is not form field ,hence this
 * uses custom css class to validate the component
 */
		markInvalid:function(msg){	
			this.clearInvalid();
			if(this.el){
		    	this.el.addClass('uploadpanelerrorCt');	
		    	this.addErrorIcon(this.el.up('div').dom.id,msg);
		    	}		
		},
		 /**
			 * Validates the component
			 * 
			 * @return {Boolean} True if the value is valid, else false
			 */
		validate : function(){
			/**
			 * If the component is disabled or if the validateValue method
			 * returns true no error will be indicated
			 */
	        if(this.disabled || this.validateValue(this.store.getCount())){
	            this.clearInvalid();
	            return true;
	        }
	        return false;
	    },
	    /**
		 * Added clearInvalid explicitly as this component is not form field.
		 */
	    clearInvalid:function(){
	    	if(this.el){
	    	this.el.removeClass('uploadpanelerrorCt');
	    	this.removeErrorIcon();
	    	}
	    },
	    /**
		 * Performs validation checks on component and returns false on
		 * validation fail.
		 * 
		 * @return {Boolean} false if validation fails.
		 */
		validateValue : function(value) {
			if(this.required && value==0){
				if(this.el){
			    	this.el.addClass('uploadpanelerrorCt');	
			    	this.addErrorIcon(this.el.up('div').dom.id);
			    	}
				return false;
			}
			else{
				return true;
			}
	     },
	     addErrorIcon:function(id,customTooltipText){	    
	    	 if(!Ext.isEmpty(customTooltipText)){
	    		 msg=customTooltipText;
	    	 }else{
	    		 msg=this.defaulttoolTipText; 
	    	 }
	    	Ext.DomHelper.append(id, {
	 		    tag: 'div', id:'uploadpanelinvalid',cls:'x-form-invalid-icon uploadpanelinvalid-icon','ext:qtip':msg
	 		}); 
	     },
	     removeErrorIcon:function(){	
	    	 if(this.el){
	    		 try{
	    			 if(this.el.dom && this.el.dom.nextSibling){
	    				 Ext.get(this.el.dom.nextSibling.id).remove();	 
						if(Ext.get(this.el.dom.nextSibling.id)){
	    					 Ext.get(this.el.dom.nextSibling.id).remove(); 
	    				 }
	    			 }
	    		 }catch(err){
	    		 }
	    	 }
	    	 },
		 /** FILE_UPLOAD_ENHANCEMENTS -- Ends */
		onResize:function(){
 			var that=this;
			 this.store.each(function(r) {	
				 if(that.el.getWidth()){
				r.set('shortName', cbx.jsutil.getText(r.get('fileName'),that.el.getWidth()-100));
				r.commit();		
				 }
			});
			 if(this.doLayout){
			 this.doLayout();
			 }
		 },
		/**
		 * destroys child components
		 * 
		 * @private
		 */
		onDestroy:function() {
			// destroy uploader
			if(this.uploader) {
				this.uploader.stopAll();
				this.uploader.purgeListeners();
				this.uploader = null;
			}
			// destroy view
			if(this.view) {
				this.view.purgeListeners();
				this.view.destroy();
				this.view = null;
			}
			// destroy store
			if(this.store) {
				this.store.purgeListeners();
				this.store.destroy();
				this.store = null;
			}
		}, // eo function onDestroy
		/**
		 * progress event handler
		 * 
		 * @private
		 * @param {cbx.formElement.FileUploader}
		 *            uploader
		 * @param {Object}
		 *            data progress data
		 * @param {Ext.data.Record}
		 *            record
		 */
		onProgress:function(uploader, data, record) {
			var bytesTotal, bytesUploaded, pctComplete, state, idx, item, width, pgWidth;
			if(record) {
				state = record.get('state');
				bytesTotal = record.get('bytesTotal') || 1;
				bytesUploaded = record.get('bytesUploaded') || 0;
				if('uploading' === state) {
					pctComplete = Math.round(1000 * bytesUploaded/bytesTotal) / 10;
				}
				else if('done' === state) {
					pctComplete = 100;
				}
				else {
					pctComplete = 0;
				}
				record.set('pctComplete', pctComplete);
				idx = this.store.indexOf(record);
				item = Ext.get(this.view.getNode(idx));
				if(item) {
					width = item.getWidth();
					item.applyStyles({'background-position':width * pctComplete / 100 + 'px'});
				}
			}
		}, // eo function onProgress
		/**
		 * called when file remove icon is clicked - performs the remove
		 * 
		 * @private
		 * @param {Ext.data.Record}
		 */
		onRemoveFile:function(record,ev) { //CHG_SCF_PO_004 
			//CHG_SCF_PO_004  Starts
			if(Ext.isEmpty(ev)){
				ev='-1';
			}
			//CHG_SCF_PO_004  Ends
			var beforefileremove=true;
			//CHG_SCF_PO_004 Starts
			if (this.manager.register['beforefileremove' + "|" + this.name] != null) {
				var obj = this.manager.register['beforefileremove' + "|" + this.name];
				/** Executing the handler attached to beforefileremove */
				var fileData={};
				fileData.fileName=record.data.fileName;
				fileData.state=record.data.state;
				if(record.data.attachmentRefNumber){
					fileData.attachmentRefNumber=record.data.attachmentRefNumber;
				}
				if(record.data.enryptedFileName){
					fileData.enryptedFileName=record.data.enryptedFileName;
				}
				beforefileremove = obj.handler.apply(obj.mScope, [this.manager,this.name,fileData,ev]);
			}
			//CHG_SCF_PO_004 Ends
			// if(true !== this.eventsSuspended && false ===
			// this.fireEvent('beforefileremove', this, this.store, record)) {
			if(true !== this.eventsSuspended && false === beforefileremove) {
				return;
			}
			// remove DOM elements
			var inp = record.get('input');
			var result=[];
			// try added for SPCG updation purpose
			/*
			 * 
			 * try{ var wrap = inp.up('em'); inp.remove(); if(wrap) {
			 * 
			 * wrap.remove(); } }catch(e){}
			 * 
			 */
			// remove record from store
			this.store.remove(record);
			this.model.updateValue(this.name, result);
			for ( var i = 0; i < this.store.getCount(); i++) {							
				// Added enryptedFileName and filereference number which is
				// retrieved from file store which is to be in part of result
				// array.
				result.push({'state':this.store.getAt(i).get('state'),'enryptedFileName':this.store.getAt(i).get('enryptedFileName'),'filename':this.store.getAt(i).get('fileName'),'attachmentRefNumber':this.store.getAt(i).get('attachmentRefNumber')});
				this.model.updateValue(this.name, result);
			} 
			responseCount=0;
			var count = this.store.getCount();
			// this.uploadBtn.setDisabled(!count);
			this.removeAllBtn.setDisabled(!count);
			if(true !== this.eventsSuspended) {
				// this.fireEvent('fileremove', this, this.store);
				if (this.manager.register['fileremove' + "|" + this.name] != null) {
					var obj = this.manager.register['fileremove' + "|" + this.name];
					/** Executing the handler attached to fileremove */
					var fileRemove = obj.handler.apply(obj.mScope, [this.manager,this.name,result,ev]); //CHG_SCF_PO_004  
				}
				this.syncShadow();
			}
			this.updateScreenViewData(this);//CBXFW_DIT_77
		}, // eo function onRemoveFile
		/** FILE_UPLOAD_ENHANCEMENTS -- Ends */
		/**
		 * Remove All/Stop All button click handler
		 * 
		 * @private
		 */
		onRemoveAllClick:function(btn) {
			if(true === this.uploading) {
				this.stopAll();
			}
			else {
				this.removeAll('clickEvent'); //CHG_SCF_PO_004
				this.updateScreenViewData(this);//CBXFW_DIT_77
			}
		}, // eo function onRemoveAllClick
		stopAll:function() {
			this.uploader.stopAll();
		}, // eo function stopAll
		/**
		 * DataView click handler
		 * 
		 * @private
		 */
		onViewClick:function(view, index, node, e) {
			var t = e.getTarget('div:any(.ux-up-icon-queued|.ux-up-icon-failed|.ux-up-icon-done|.ux-up-icon-stopped)');
			if(t) {
				this.onRemoveFile(this.store.getAt(index),'clickEvent'); //CHG_SCF_PO_004
			}
			t = e.getTarget('div.ux-up-icon-uploading');
			if(t) {
				this.uploader.stopUpload(this.store.getAt(index));
			}
		}, // eo function onViewClick
		/**
		 * tells uploader to upload
		 * 
		 * @private
		 */
		/** FILE_UPLOAD_ENHANCEMENTS -- Starts */
		onUpload:function(handler,queuedcount,totalqueuedcount,uploadProgressBar) {
			var beforeupload=true;
			if (this.manager.register['beforeupload' + "|" + this.name] != null) {
				var obj = this.manager.register['beforeupload' + "|" + this.name];
				/** Executing the handler attached to beforeupload */
				beforeupload = obj.handler.apply(obj.mScope, [this.manager,this.name,queuedcount,totalqueuedcount]); //CHG_SCF_PO_004  
			}
			if(true !== this.eventsSuspended && false === beforeupload) {
				return false;
			}
			this.uploader.upload(handler,queuedcount,totalqueuedcount,uploadProgressBar);
		},
		// eo function onUpload
		/** FILE_UPLOAD_ENHANCEMENTS -- Ends */
		/**
		 * url setter
		 */
		setUrl:function(url) {
			this.url = url;
			this.uploader.setUrl(url);
		}, // eo function setUrl
		/**
		 * path setter
		 */
		setPath:function(path) {
			this.uploader.setPath(path);
		}, // eo function setPath
		/**
		 * Updates buttons states depending on uploading state
		 * 
		 * @private
		 */
		updateButtons:function() {
			if(true === this.uploading) {
				this.addBtn.disable();
				// this.uploadBtn.disable();
				this.removeAllBtn.setIconClass(this.stopIconCls);
				this.removeAllBtn.getEl().child(this.removeAllBtn.buttonSelector).dom[this.removeAllBtn.tooltipType] = this.stopAllText;
			}
			else {
				this.addBtn.enable();
				// this.uploadBtn.enable();
				this.removeAllBtn.setIconClass(this.removeAllIconCls);
				this.removeAllBtn.getEl().child(this.removeAllBtn.buttonSelector).dom[this.removeAllBtn.tooltipType] = this.removeAllText;
			}
		},// eo function updateButtons
		/**
		 * Removes all files from store and destroys file inputs
		 */
		removeAll:function(ev) { //CHG_SCF_PO_004  
			//CHG_SCF_PO_004  Starts
			if(Ext.isEmpty(ev)){
				ev='-1';
			}
			//CHG_SCF_PO_004  Ends
			var suspendState = this.eventsSuspended;
			var beforequeueclear=true;
			//CHG_SCF_PO_004  Starts
			if (this.manager.register['beforequeueclear' + "|" + this.name] != null) {
				var obj = this.manager.register['beforequeueclear' + "|" + this.name];
				/** Executing the handler attached to beforequeueclear */	
				var resultData=[];
				if (this.store
						&& this.store.getCount() > 0) {
					for ( var i = 0; i < this.store.getCount(); i++) {							
						// Added enryptedFileName and filereference number which is
						// retrieved from file store which is to be in part of result
						// array.
						resultData.push({'state':this.store.getAt(i).get('state'),'enryptedFileName':this.store.getAt(i).get('enryptedFileName'),'filename':this.store.getAt(i).get('fileName'),'attachmentRefNumber':this.store.getAt(i).get('attachmentRefNumber')});
					}
				}
				beforequeueclear = obj.handler.apply(obj.mScope, [this.manager,this.name,resultData,ev]);
			}
			//CHG_SCF_PO_004  Ends
			if(false !== this.eventsSuspended && false === beforequeueclear) {
				return false;
			}
			this.suspendEvents();
			this.store.each(this.onRemoveFile, this);
			var result=[]; 
			responseCount=0;
		    this.model.updateValue(this.name, result);
			this.eventsSuspended = suspendState;
			if(true !== this.eventsSuspended) {
				//CHG_SCF_PO_004  Starts
				if (this.manager.register['queueclear' + "|" + this.name] != null) {
					var obj = this.manager.register['queueclear' + "|" + this.name];
					/** Executing the handler attached to queueclear */
					var resultDataQueueClear=[];
					if (this.store
							&& this.store.getCount() > 0) {
					for ( var i = 0; i < this.store.getCount(); i++) {							
						// Added enryptedFileName and filereference number which is
						// retrieved from file store which is to be in part of result
						// array.
						resultDataQueueClear.push({'state':this.store.getAt(i).get('state'),'enryptedFileName':this.store.getAt(i).get('enryptedFileName'),'filename':this.store.getAt(i).get('fileName'),'attachmentRefNumber':this.store.getAt(i).get('attachmentRefNumber')});
					} 
					}
					var queueclear = obj.handler.apply(obj.mScope, [this.manager, this.name,resultDataQueueClear,ev]);
			}
				//CHG_SCF_PO_004  Ends
			}
			this.syncShadow();
		}, // eo function removeAll
		/** FILE_UPLOAD_ENHANCEMENTS -- Ends */
		/**
		 * synchronize context menu shadow if we're in contextmenu
		 * 
		 * @private
		 */
		syncShadow:function() {
			if(this.contextmenu && this.contextmenu.shadow) {
				this.contextmenu.getEl().shadow.show(this.contextmenu.getEl());
			}
		}, // eo function syncShadow
		/**
		 * Return store. for SPCG
		 */
		 getStore:function() {
		 	return this.store;
		 },
			afterRender : function(ct, position) {
				cbx.formElement.UploadPanel.superclass.afterRender
						.call(this, ct, position);
				//this.ownerCt.doLayout();
				if (this.rendered) {
					this.el.up('.x-form-item', 10, true).child('.x-form-item-label')
							.remove();
				}
		 }
	}); // eo extend
	// register xtype
	Ext.reg('cbx-fileuploadpanel', cbx.formElement.UploadPanel);
	// eof cbx-fileuploadpanel
	/**
	 * @class Ext.UploadMessageBox Singleton class for upload status bar window
	 */
	        Ext.UploadMessageBox = function(){
	            var dlg, opt, mask, waitTimer,
	                bodyEl, msgEl, textboxEl, textareaEl, progressBar, pp, iconEl, spacerEl,
	                buttons, activeTextEl, bwidth, bufferIcon = '', iconCls = '',
	                buttonNames = ['ok', 'yes', 'no', 'cancel'],
	                defaultrendering=document.body,
	                rendering='';	            
	            var handleButton = function(button){
	                buttons[button].blur();
	                if(dlg.isVisible()){
	                    dlg.hide();
	                    handleHide();
	                    Ext.callback(opt.fn, opt.scope||window, [button, activeTextEl.dom.value, opt], 1);
	                }
	            };	            
	            var handleHide = function(){
	                if(opt && opt.cls){
	                    dlg.el.removeClass(opt.cls);
	                }
	                progressBar.reset();        
	            };
	            var handleEsc = function(d, k, e){
	                if(opt && opt.closable !== false){
	                    dlg.hide();
	                    handleHide();
	                }
	                if(e){
	                    e.stopEvent();
	                }
	            };
	            var updateButtons = function(b){
	                var width = 0,
	                    cfg;
	                if(!b){
	                    Ext.each(buttonNames, function(name){
	                        buttons[name].hide();
	                    });
	                    return width;
	                }
	                dlg.footer.dom.style.display = '';
	                Ext.iterate(buttons, function(name, btn){
	                    cfg = b[name];
	                    if(cfg){
	                        btn.show();
	                        btn.setText(Ext.isString(cfg) ? cfg : Ext.MessageBox.buttonText[name]);
	                        width += btn.getEl().getWidth() + 15;
	                    }else{
	                        btn.hide();
	                    }
	                });
	                return width;
	            };
	            return {
	                setRenderer:function(renderer){
	            	this.renderer=renderer;
	            },
	            getRenderer:function(){
	            	return this.renderer;
	            },
	                getDialog : function(titleText){
	                   if(!dlg){
	                        var btns = [];
	                        buttons = {};
	                        Ext.each(buttonNames, function(name){
	                            btns.push(buttons[name] = new Ext.Button({
	                                text: this.buttonText[name],
	                                handler: handleButton.createCallback(name),
	                                hideMode: 'offsets'
	                            }));
	                        }, this);
	                        dlg = new Ext.Window({
	                            autoCreate : true,
	                            title:titleText,
	                            resizable:false,
	                            constrain:true,
	                            constrainHeader:true,
	                            minimizable : false,
	                            maximizable : false,
	                            stateful: false,
	                            modal: true,
	                            draggable:false,
	                            shim:true,
	                            buttonAlign:"center",
	                            width:400,
	                            height:100,
	                            minHeight: 80,
                         cls:'fileuploadprogress',
	                            plain:true,
	                            footer:true,
	                            closable:true,
	                            close : function(){
	                                if(opt && opt.buttons && opt.buttons.no && !opt.buttons.cancel){
	                                    handleButton("no");
	                                }else{
	                                    handleButton("cancel");
	                                }
	                            },
	                            fbar: new Ext.Toolbar({
	                                items: btns,
	                                enableOverflow: false
	                            })
	                        });	                     
	                        dlg.render(document.body);
	                        dlg.getEl().addClass('x-window-dlg');
	                        mask = dlg.mask;
	                        bodyEl = dlg.body.createChild({
	                            html:'<div class="ext-mb-icon"></div><div class="ext-mb-content"><span class="ext-mb-text"></span><br /><div class="ext-mb-fix-cursor"><input type="text" class="ext-mb-input" /><textarea class="ext-mb-textarea"></textarea></div></div>'
	                        });
	                        iconEl = Ext.get(bodyEl.dom.firstChild);
	                        var contentEl = bodyEl.dom.childNodes[1];
	                        msgEl = Ext.get(contentEl.firstChild);
	                        textboxEl = Ext.get(contentEl.childNodes[2].firstChild);
	                        textboxEl.enableDisplayMode();
	                        textboxEl.addKeyListener([10,13], function(){
	                            if(dlg.isVisible() && opt && opt.buttons){
	                                if(opt.buttons.ok){
	                                    handleButton("ok");
	                                }else if(opt.buttons.yes){
	                                    handleButton("yes");
	                                }
	                            }
	                        });
	                        textareaEl = Ext.get(contentEl.childNodes[2].childNodes[1]);
	                        textareaEl.enableDisplayMode();
	                        progressBar = new Ext.ProgressBar({
	                            renderTo:bodyEl
	                        });
	                       bodyEl.createChild({cls:'x-clear'});
	                    }
	                    return dlg;
	                },
	                updateText : function(text){
	                    if(!dlg.isVisible() && !opt.width){
	                        dlg.setSize(this.maxWidth, 100); 
	                    }
	                    msgEl.update(text ? text + ' ' : '&#160;');
	                    var iw = iconCls != '' ? (iconEl.getWidth() + iconEl.getMargins('lr')) : 0,
	                        mw = msgEl.getWidth() + msgEl.getMargins('lr'),
	                        fw = dlg.getFrameWidth('lr'),
	                        bw = dlg.body.getFrameWidth('lr'),
	                        w;
	                    w = Math.max(Math.min(opt.width || iw+mw+fw+bw, opt.maxWidth || this.maxWidth),
	                            Math.max(opt.minWidth || this.minWidth, bwidth || 0));
	                    if(opt.prompt === true){
	                        activeTextEl.setWidth(w-iw-fw-bw);
	                    }
	                    if(opt.progress === true || opt.wait === true){
	                        progressBar.setSize(w-iw-fw-bw);
	                    }
	                    if(Ext.isIE && w == bwidth){
	                        w += 4; 
	                    }
	                    msgEl.update(text || '&#160;');
	                    dlg.setSize(w, 'auto').center();
	                    return this;
	                },
	                updateProgress : function(value, progressText, msg){
	                    progressBar.updateProgress(value, progressText);
	                    if(msg){
	                        this.updateText(msg);
	                    }
	                    return this;
	                },
	                isVisible : function(){
	                    return dlg && dlg.isVisible();
	                },
	                hide : function(){
	                    var proxy = dlg ? dlg.activeGhost : null;
	                    if(this.isVisible() || proxy){
	                        dlg.hide();
	                        handleHide();
	                        if (proxy){
	                            dlg.unghost(false, false);
	                        } 
	                    }
	                    return this;
	                },
	                show : function(options){
	                    if(this.isVisible()){
	                        this.hide();
	                    }
	                    opt = options;
	                    var d = this.getDialog(opt.title || "&#160;");
	                    d.setTitle(opt.title || "&#160;");
	                    var allowClose = (opt.closable !== false && opt.progress !== true && opt.wait !== true);
	                    d.tools.close.setDisplayed(allowClose);
	                    activeTextEl = textboxEl;
	                    opt.prompt = opt.prompt || (opt.multiline ? true : false);
	                    if(opt.prompt){
	                        if(opt.multiline){
	                            textboxEl.hide();
	                            textareaEl.show();
	                            textareaEl.setHeight(Ext.isNumber(opt.multiline) ? opt.multiline : this.defaultTextHeight);
	                            activeTextEl = textareaEl;
	                        }else{
	                            textboxEl.show();
	                            textareaEl.hide();
	                        }
	                    }else{
	                        textboxEl.hide();
	                        textareaEl.hide();
	                    }
	                    activeTextEl.dom.value = opt.value || "";
	                    if(opt.prompt){
	                        d.focusEl = activeTextEl;
	                    }else{
	                        var bs = opt.buttons;
	                        var db = null;
	                        if(bs && bs.ok){
	                            db = buttons["ok"];
	                        }else if(bs && bs.yes){
	                            db = buttons["yes"];
	                        }
	                        if (db){
	                            d.focusEl = db;
	                        }
	                    }
	                    if(Ext.isDefined(opt.iconCls)){
	                      d.setIconClass(opt.iconCls);
	                    }
	                    this.setIcon(Ext.isDefined(opt.icon) ? opt.icon : bufferIcon);
	                    bwidth = updateButtons(opt.buttons);
	                    progressBar.setVisible(opt.progress === true || opt.wait === true);
	                    this.updateProgress(0, opt.progressText);
	                    this.updateText(opt.msg);
	                    if(opt.cls){
	                        d.el.addClass(opt.cls);
	                    }
	                    d.proxyDrag = opt.proxyDrag === true;
	                    d.mask = opt.modal !== false ? mask : false;
	                    if(!d.isVisible()){
	                        document.body.appendChild(dlg.el.dom);
	                        d.on('show', function(){
	                            if(allowClose === true){
	                                d.keyMap.enable();
	                            }else{
	                                d.keyMap.disable();
	                            }
	                        }, this, {single:true});
	                        d.show(opt.animEl);
	                    }
	                    if(opt.wait === true){
	                        progressBar.wait(opt.waitConfig);
	                    }
	                    return this;
	                },
	                setIcon : function(icon){
	                    if(!dlg){
	                        bufferIcon = icon;
	                        return;
	                    }
	                    bufferIcon = undefined;
	                    if(icon && icon != ''){
	                        iconEl.removeClass('x-hidden');
	                        iconEl.replaceClass(iconCls, icon);
	                        bodyEl.addClass('x-dlg-icon');
	                        iconCls = icon;
	                    }else{
	                        iconEl.replaceClass(iconCls, 'x-hidden');
	                        bodyEl.removeClass('x-dlg-icon');
	                        iconCls = '';
	                    }
	                    return this;
	                },
	                progress : function(title, msg, progressText){
	                    this.show({
	                        title : title,
	                        msg : msg,
	                        buttons: false,
	                        progress:true,
	                        closable:false,
	                        minWidth: this.minProgressWidth,
	                        progressText: progressText
	                    });
	                    return this;
	                },
	                wait : function(msg, title, config){
	                    this.show({
	                        title : title,
	                        msg : msg,
	                        buttons: false,
	                        closable:false,
	                        wait:true,
	                        modal:true,
	                        minWidth: this.minProgressWidth,
	                        waitConfig: config
	                    });
	                    return this;
	                },
	                alert : function(title, msg, fn, scope){
	                    this.show({
	                        title : title,
	                        msg : msg,
	                        buttons: this.OK,
	                        fn: fn,
	                        scope : scope,
	                        minWidth: this.minWidth
	                    });
	                    return this;
	                },
	                confirm : function(title, msg, fn, scope){
	                    this.show({
	                        title : title,
	                        msg : msg,
	                        buttons: this.YESNO,
	                        fn: fn,
	                        scope : scope,
	                        icon: this.QUESTION,
	                        minWidth: this.minWidth
	                    });
	                    return this;
	                },
	                prompt : function(title, msg, fn, scope, multiline, value){
	                    this.show({
	                        title : title,
	                        msg : msg,
	                        buttons: this.OKCANCEL,
	                        fn: fn,
	                        minWidth: this.minPromptWidth,
	                        scope : scope,
	                        prompt:true,
	                        multiline: multiline,
	                        value: value
	                    });
	                    return this;
	                },
	                OK : {ok:true},
	                CANCEL : {cancel:true},
	                OKCANCEL : {ok:true, cancel:true},
	                YESNO : {yes:true, no:true},
	                YESNOCANCEL : {yes:true, no:true, cancel:true},
	                INFO : 'ext-mb-info',
	                WARNING : 'ext-mb-warning',
	                QUESTION : 'ext-mb-question',
	                ERROR : 'ext-mb-error',
	                defaultTextHeight : 75,
	                maxWidth : 600,
	                minWidth : 100,
	                minProgressWidth : 250,
	                minPromptWidth: 250,
	                buttonText : {
	                    ok : "OK",
	                    cancel : "Cancel",
	                    yes : "Yes",
	                    no : "No"
	                }
	            };
	        }();
	// CHGPANELFILEUPLOAD Ends
	    // CHG-ITEMSELECTOR Starts
/**
 * @ Component: cbx-itemselector @ extends cbx.formElement.itemSelector
 *   author:Chiranjib Description:A control that allows selection of betweens
 *   Ext.ux.form.Multiselect.ItemSelector is a specialized MultiSelect field
 *   that renders as a pair of MultiSelect field, one with available options and
 *   the other with selected options. A set of buttons in between allows items
 *   to be moved between the fields and reordered within the selection. Items
 *   can also be moved via drag and drop.
 */
cbx.formElement.itemSelector=function(config) {	
	this.plainLabel = config.plainLbl;
	this.fieldLabel = config.displayNmKey;
	this.name = config.itemId;
	this.addData = config.addData;
	this.required = config.requiredInd;
	this.conditional = config.conditionalInd;
	this.hidden = config.visibleInd === 'Y' ? false : true;
	this.showCountInd = config.showCountInd || 'Y';
	// CBXR12Q413U02 starts
	/*
	 * Below style config added to render item selector component properly on
	 * changing item label alignment
	 */
	this.style = "width:100%";
	// CBXR12Q413U02 ends
	this.rightPanelData=config.model.getModelData()[config.itemId];
	this.value=config.model.getModelData()[config.itemId];
	this.leftTitle = config.leftTitle;
	this.rightTitle = config.rightTitle;	
	cbx.formElement.itemSelector.superclass.constructor.call(this, config);
};
Ext.extend(cbx.formElement.itemSelector,Ext.ux.form.ItemSelector,  {
	 /**
		 * @cfg {Object} required ,to specify the number of times valuesChanged
		 *      method has executed (defaults to false)
		 */
	executionTracker:0,
	 /**
		 * @cfg {Object} required ,to specify the paths of the image icons
		 */
	imagePath : Ext.BLANK_IMAGE_PATH,
	// CHG_FF_ENHQ2 Starts.To bring the label seperator for cbx-itemselector
	/**
	 * @cfg{Object} Used to specify label separator
	 */
	labelSeparator :'', 
	/**
	 * @cfg{object} store to maintain the available data store.
	 */
	dataStore:null,
	/**
	 * @cfg{object} Array to maintain the raw Values
	 */
	rawValues:[],
	dataArray:null,
	// CHG_FF_ENHQ2 Ends.
	// Private--Initialization of the component
	initComponent:function(){
			//CBXFW_DIT_77 starts
			this.on('hide',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'N']));
			this.on('show',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'Y']));
			//CBXFW_DIT_77 ends
	        var combundle;
			var commonbundle = CRB.getFWBundle();
			/* Title for the available and selected panel */
			this.leftTitle=cbx.isEmpty(this.leftTitle) ? commonbundle.LBL_ITEM_SEL_AVAIL  : this.leftTitle;
			this.rightTitle=cbx.isEmpty(this.rightTitle) ? commonbundle.LBL_ITEM_SEL_SELECTED  : this.rightTitle;
			combundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));
			this.combundleKey=cbx.jsutil.getBundleKey(this);
			/**
			 * If the plainLabel attribute is not null ,component's field label
			 * will be the plain-label else the label associated with bundle
			 * keys will be referred to get the field label.
			 */
			if (!Ext.isEmpty(this.plainLabel)) {
				this.fieldLabel = this.plainLabel;
			} else {
				this.fieldLabel = combundle['LBL_'
						+ this.fieldLabel];
			}
			// CHG_FF_ENHQ2 Starts.This change has been added to hide the label
			// for cbx-itemselector inabsence of fieldLabel
		    if (Ext.isEmpty(this.fieldLabel)){
		       	this.labelSeparator = '';
	    		this.hideLabel=true;
		    }
		  // CHG_FF_ENHQ2 Ends
			/**
			 * If the conditional attribute is Y the components field label will
			 * be field label associated with two stars
			 */
			if (this.conditional === 'Y') {
				this.blankText = String.format(
						commonbundle['ERR_MANDATORY'], this.fieldLabel);
				if (Ext.isEmpty(this.fieldLabel)) {
					this.fieldLabel = '?' + this.fieldLabel + '?'
							+ '<span class = \'cbx-mandatory-fx\'">**</span>';
				} else {
					this.fieldLabel = this.fieldLabel
							+ '<span class = \'cbx-mandatory-fx\'">**</span>';
				}
			}	
			/**
			 * If the required attribute is Y,components field label will be
			 * field label associated with mandatory star and the field will not
			 * allow blank values.
			 */
			else if (this.required === 'Y') {
				if (Ext.isEmpty(this.fieldLabel)) {
					this.fieldLabel = '?' + this.fieldLabel + '?'
							+ '<span class = \'mandatory\'">*</span>';
				} else {
					this.fieldLabel = this.fieldLabel
							+ '<span class = \'mandatory\'">*</span>';
				}
			} else {
				if (Ext.isEmpty(this.fieldLabel)) {
					this.fieldLabel = '?' + this.fieldLabel + '?'
							+ '<span class = \'non_mandatory\'"></span>';
				} else {
					this.fieldLabel = this.fieldLabel
							+ '<span class = \'non_mandatory\'"></span>';
				}
			}			
			var bundleCombo = combundle;
	        this.rawKeys = this.populateAddData(this.addData,'rawKey');
	        this.rawValues = this.populateAddData(this.addData,'rawValue');
	        if (this.rawKeys !== null
						&& this.rawValues !== null
						&& bundleCombo !== null) {
					var rowArray = [];
					this.dataArray = [];
					for ( var i = 0; i < this.rawKeys.length; i++) {
						rowArray = [];
						/*
						 * ExtJs combo store accepts 2D array . In this case we
						 * have to create it from the key array and value array
						 * rowArray.push(this.resourcePrefix + keyArray[i]);
						 */
						rowArray.push(this.rawKeys[i]);
						rowArray.push(this.rawValues[i]);
						this.dataArray.push(rowArray);
					}
					// CHG_FF_ENHQ2 Starts.
					/**
					 * *The following changes has been done to change the store
					 * configuration. Previously it was an ArrayStore with
					 * ['value','text'],which // was confusing });
					 */
					this.dataStore =  new Ext.data.SimpleStore({
						proxy : new Ext.data.HttpProxy({}),
						data: this.dataArray,
						fields : [ 'key','value']// CHG_FF_ENHQ2 .
				});	       
	        /*
			 * The events for the components. 1.rowdbClick: On clicking any
			 * items the items will be moved 2.change:Indiactes dragging or
			 * moving by icon
			 */
	        this.addEvents({
	            'rowdblclick' : true,
	            'change' : true
	        });
	        /**
			 * MultiSelects configuration of the left panel and rightpanel
			 */
	        this.multiselects= [{	        	
	            height: this.getFieldSetHeight(),
	            width:'100%',
	            store:this.dataStore,
	            displayField: 'value',// CHG_FF_ENHQ2.
                valueField: 'key',// CHG_FF_ENHQ2 ends
                droppable : true,
    			draggable : true
	        },{  
	            height: this.getFieldSetHeight(),
	            store:[],
	            width:'100%',
	            allowBlank:false,
	            droppable : true,
				draggable : true
	        }];
	     /**
			 * Set the anchor for the component
			 */
	        this.anchor = (this.anchor == undefined) ? '' : this.anchor;
	        cbx.formElement.itemSelector.superclass.initComponent.apply(this,arguments);
		}
	},
		/**
		 * Added By Gagan:To set the value for model.
		 */
		setValue: function(value){
			if(Ext.isArray(value)){
				this.rightPanelData=value;
			}
			this.loadSelectedData();	
		},
		afterRender:function(){
			var that=this;
			/**
			 * Capturing the instance of the two panels by ther id and stored
			 * inside ffromObj and toObj respectively
			 */
			this.updateScreenViewData(this);//CBXFW_DIT_77
			var fromObj=Ext.getCmp(that.fromMultiselect.el.down('div.x-panel').dom.id);
			var toObj=Ext.getCmp(that.toMultiselect.el.down('div.x-panel').dom.id);
			/* Setting the title of the panels */
			fromObj.setTitle('<div style="display:inline" ext:qtip="' + that.leftTitle + '">' + that.leftTitle + '</div>');
			toObj.setTitle('<div style="display:inline" ext:qtip="' + that.rightTitle + '">' + that.rightTitle + '</div>');	
			/**
			 * If show count indicator has set to false the bottom bar will not
			 * appear.So we have increase the size of the innerpanel which is
			 * rendering the list accordinly by increasing the height by 30 Px
			 */
			if(this.showCountInd=='N'){
				fromObj.getComponent(0).setHeight(fromObj.getComponent(0).getHeight()+30);
				toObj.getComponent(0).setHeight(toObj.getComponent(0).getHeight()+30);
			}			
			cbx.formElement.itemSelector.superclass.afterRender.call(this);
		},
		// CHG_FF_ENHQ2 Starts.
		/**
		 * The following changes has been done to bring the functionality of
		 * cache Indicator inside Item Selector.The codes changes can be
		 * moved.The method valueChanged has been redfined later.
		 */
		/**
		 * Methods directly ties up with the additional data format of Form FW
		 * and is responsible for parsing the provided additional data and
		 * repopulate the combo store.
		 */
		rePopulateAdditionaldata : function(additionalData) {
			this.rawKeys= this.populateAddData(additionalData,
					'rawKey');
			this.rawValues = this.populateAddData(additionalData,
					'rawValue');
			this.updateComboRawStore(this.rawKeys,this.rawValues);
			//this.valueChanged(this.toStore);//NBAD3.0 
			this.loadSelectedData();
		},
		/**
		 * update the store of this combobox with new keys and values supplied.
		 * 
		 * @param {Array}
		 *            arr containing value keys
		 */
		updateComboRawStore : function(keyArr, valueArr) {
			/**
			 * If the keyArr and valueArr empty ,invoke the removetheComboStore
			 * method to add the empty array
			 */
			if (Ext.isEmpty(keyArr) && Ext.isEmpty(valueArr)) {
				this.removeComboRawStore();
				return;
			}
			combundle = CRB.getBundle(this.combundleKey);
			if (keyArr.length !== valueArr.length) {
				// keys and values should be arrays of same length
				return;
			}
			if (this.dataStore === undefined) {
				this.dataStore = new Ext.data.SimpleStore({
					proxy : new Ext.data.HttpProxy({}),
					fields : [ 'key', 'value' ]
				});
			}
			this.dataStore.removeAll();
			var newRecord = Ext.data.Record.create([ {
				name : 'key',
				mapping : 'key'
			}, {
				name : 'value',
				mapping : 'value'
			} ]);
			var record;
			var that = this;
			for ( var i = 0; i < keyArr.length; i++) {
				record = new newRecord({
					key : keyArr[i],
					value : valueArr[i]
				});
				this.dataStore.add(record);
			}
			this.dataStore.commitChanges();
			this.clearInvalid();
			// CBXR12Q413F06 starts
			/**
			 * The validateflag is false signifies a new store is loaded using
			 * updateComboRawStore When a new store is loaded, it checks for the
			 * count condition and if true, removes all the selections of the
			 * previous store, commits and resets the selections.
			 */
			 //Added By Yasir - For Perfoemance
			this.rawKeys=keyArr;
			this.rawValues=valueArr;
			this.valueChanged(this.dataStore,false);
			if(this.toMultiselect && this.toMultiselect.store.getCount()>=1){
				this.toMultiselect.store.removeAll();
				this.toMultiselect.store.commitChanges();
				this.toMultiselect.view.refresh();				
			}
			this.toMultiselect.reset();
			// CBXR12Q413F06 Ends
			return true;
		},
		removeComboRawStore : function() {
			combundle = CRB.getBundle(this.combundleKey);
			if (this.dataStore === undefined) {
				this.dataStore = new Ext.data.SimpleStore({
					proxy : new Ext.data.HttpProxy({}),
					fields : [ 'key', 'value' ]
				});
			}
			this.dataStore .removeAll();
			var newRecord = Ext.data.Record.create([{
				name : 'key',
				mapping : 'key'
			},{
				name : 'value',
				mapping : 'value'
			}]);
			this.dataStore.commitChanges();
			this.clearInvalid();
		},
		// CHG_FF_ENHQ2 Ends.
	    /**
		 * Private: To get the value of the selected list
		 */
	    getValue : function() {
	    	// CHG_FF_ENHQ2 Starts.
	    	/**
			 * If no value is there in the selected list of item selector the
			 * value returned will be null
			 */
	    	if(Ext.isEmpty(this.hiddenField.dom.value)){
	    		return null;	
	    	}
	    	// CHG_FF_ENHQ2 Ends
	        return this.hiddenField.dom.value;
	    },
	    /**
		 * Method expected to receive the data from additionaldata attribute and
		 * parses the data according to rawtype(rawkeys and rawValues) and
		 * pushes the rawdata to be obtained on store
		 */
		populateAddData : function(items, rawType) {
			var rawDataArray = [];
			if (items != "" && items != null) {
				for ( var i = 0; i < items.length; i++) {
					rawDataArray.push(items[i][rawType]);
				}
			}
			return rawDataArray;
		},
		/**
		 * Method to get the height according to the maximum number of lines
		 * provided.If maximum number of lies has not provided as meta data it
		 * will take the default heights of the icons
		 */
		getFieldSetHeight:function(){
			 	var iconsHeight=125;
		     	var heightToSet='';
		     	var heightAsParam='';
		     	if (!Ext.isEmpty(this.maxNumLines)){ 
		     		heightAsParam=cbx.jsutil.getItemSelectorFieldSetHeight(this.maxNumLines);
		     	}	        	
		     	if(heightAsParam>iconsHeight){
		        	heightToSet=heightAsParam;       	
		     	}
		     	else{
		     		heightToSet=iconsHeight;
		     	}
		     return (heightToSet+60);
		},
		// CHG_FF_ENHQ2 Starts.The listUpdate methiod can be deleted here for
		// code refactoring
		/**
		 * private:The method is called on submitting the form fields or if any
		 * value has changed.Used to validate the component as per the required
		 * indicator.
		 */
		validate : function(){
			/**
			 * If the component is disabled or if the validateValue method
			 * returns true no error will be indicated
			 */
	        if(this.disabled || this.validateValue(this.toMultiselect.store.getCount())){
	            this.clearInvalid();
	            return true;
	        }
	        this.fromMultiselect.view.select(0, true);
	        return false;
	    },
	    /**
		 * private:used to show the error as per the required indicator.
		 */
		validateValue : function(value) {
			if(this.required=='Y' && value==0){
				this.markInvalid(CRB.getFWBundle() && CRB.getFWBundle()['ERR_ITEMSELECTOR_SELECT'] ? CRB.getFWBundle()['ERR_ITEMSELECTOR_SELECT']:'ERR_ITEMSELECTOR_SELECT'); // CHGPANELFILEUPLOAD
				return false;
			}
			else{
				return true;
			}
	     },
	 	reset : function (){			
			range = this.toMultiselect.store.getRange();
			this.toMultiselect.store.removeAll();
			this.fromMultiselect.store.add(range);
			var si = this.fromMultiselect.store.sortInfo;
			if (si) {
				this.fromMultiselect.store.sort(si.field, si.direction);
			}
			this.valueChanged(this.toMultiselect.store);
			this.clearInvalid();			
			this.fromMultiselect.view.refresh();
		},
	    /**
		 * private:Setting the width of the individual panels on resizing the
		 * components
		 */
		onResize:function(){	
			var iconpanelWidth=iportal.preferences.getIconPanelwidth();
			var totalWidth=this.getWidth()-iconpanelWidth;	
			Ext.getCmp(this.fromMultiselect.el.down('div.x-panel').dom.id).setWidth(Math.round((totalWidth/2)),true);
			Ext.getCmp(this.fromMultiselect.el.down('div.x-panel').dom.id).doLayout();
			Ext.getCmp(this.toMultiselect.el.down('div.x-panel').dom.id).setWidth(Math.round((totalWidth/2)),true); 	 
			Ext.getCmp(this.toMultiselect.el.down('div.x-panel').dom.id).doLayout();
	 },
	 // CHG_FF_ENHQ2 Starts.
	/**
	 * The below changes has been done for code refactoring.The
	 * listUpdate,compareLists,valueChanged,loadSelecteddata previouslty has
	 * been provided as a part of ItemSelector.js file. So these method has been
	 * moved here.
	 */
	 /**
		 * private.The method will will update the selected list panel data with
		 * the model data which is also configured as value in additional
		 * data.if the provided model data is not available in the additional
		 * data,the moethod will not populate the selected list panel
		 */
		listUpdate : function (){
			
				// var modeldata = this.getValueArrays(this.rightPanelData); // CIBC- Item Selector-Duplicate-display-name-issue
			var modeldata = this.rightPanelData; // CIBC- Item Selector-Duplicate-display-name-issue
				// this.Multiselect.view.store.removeAll();
					
					var selectionsArray = [];
					for(var i=0;i<modeldata.length;i++){
					
						for ( var j = 0; j < this.fromMultiselect.store.getCount(); j++) {
							//if (modeldata[i]==this.fromMultiselect.view.store.data.items[j].data.value) { // CIBC- Item Selector-Duplicate-display-name-issue
							if (modeldata[i]==this.fromMultiselect.view.store.data.items[j].data.key) { // CIBC- Item Selector-Duplicate-display-name-issue
								selectionsArray.push(j);
								//CIBC -ITEM SELECTOR ISSUE-Starts
								break;
								//CIBC -ITEM SELECTOR ISSUE-End
								
							}
						}
					}	
					var records = [];		
					if (selectionsArray.length > 0) {
						for ( var i = 0; i < selectionsArray.length; i++) {
							record = this.fromMultiselect.view.store.getAt(selectionsArray[i]);
							records.push(record);
						}
						
						if (!this.allowDup){
							selectionsArray = [];
						}
							
						
						for ( var i = 0; i < records.length; i++) {
							record = records[i];
							if (this.allowDup) {
								var x = new Ext.data.Record();
								record.id = x.id;
								delete x;
								this.toMultiselect.view.store.add(record);
							} else {
								this.fromMultiselect.view.store.remove(record);
								this.toMultiselect.view.store.add(record);
								selectionsArray.push((this.toMultiselect.view.store.getCount() - 1));
							}
						}
					}
					this.toMultiselect.view.refresh();
					this.fromMultiselect.view.refresh();
					var si = this.toMultiselect.store.sortInfo;
					if (si) {
						this.toMultiselect.store.sort(si.field, si.direction);
					}
				
					
		},
	 /**
		 * private:Compare the model data and the available data and returns
		 * 'valid' the data of model data is available in available lists or
		 * returns 'invalid'
		 */
     comparelists:function(a1, a2){	
    	 var valid='valid';
    	 for(var j=0;j<a2.length;j++){
    		 if(a1.contains(a2[j])===false){
    			 valid='notvalid';
    		 }    		
    	 }	
    	return valid;
     },
	/**
	 * After rendering the components if model data is available the component
	 * will automatically populate the selected list panel with the model
	 * data.For this it will call the list update method
	 */
	loadSelectedData:function(){			
			if (!Ext.isEmpty(this.rightPanelData)) {				
				 if (this.comparelists(this.rawKeys, this.rightPanelData) == 'notvalid') {
					this.markInvalid("Please select valid data");
				} 
				 else if (this.comparelists(this.rawKeys, this.rightPanelData) == 'valid') {
						this.clearInvalid();
				}
				this.listUpdate();
			}
	},
	/**
	 * Private:The method is first executed after rendereing the component.after
	 * that each time values are changed the method will be executed
	 */
	// CBXR12Q413F06 Starts
    valueChanged: function(store,validateFlag) {
    	 /**
			 * If the method is executed first time the error for required
			 * indicator will not appear.The indicator will start executing on
			 * changing the value or on submit the error will be indicated
			 */
    	if(this.executionTracker>0){   //DIT_1620
		 this.validate();					
		}
		 var that=this;
		 if(validateFlag==false){
	    		this.clearInvalid();
	    		val=null;
	    	}
		 /**
			 * This else was added to be executed when value is changed
			 * explicitly and 'if' is executed when updateComboRawStore is
			 * called.
			 */
		 else{
		 var record = null;
		 var values = [];
		 var currSelVal=null; // CIBC- Item Selector-Duplicate-display-name-issue
		
		 for (var i=0; i<store.getCount(); i++) {
			 record = store.getAt(i);
			// CIBC- Item Selector-Duplicate-display-name-issue - start
			 currSelVal = record.get('key'); 
			 var alreadySelected=false;
			 for(var j=0;j<values.length;j++){
				 if(currSelVal===values[j]){
					 alreadySelected=true;
					 break;
				 }
			 }
			 if(!alreadySelected){
				 values.push(currSelVal);   
			 }
			// CIBC- Item Selector-Duplicate-display-name-issue - End 
			
		 }
		 that.hiddenField.dom.value = values.join("?");// CIBC - Item Selector split issue
		 that.toMultiselect.view.refresh();
		 that.fromMultiselect.view.refresh();
		 var val=null;
		 if(this.getValue()!=null){
			 val=this.getValue().split("?");// CIBC - Item Selector split issue
		 }
		 }
	// CBXR12Q413F06 Ends
		// that.model.updateValue(this.name,this.getKeys(val));	// CIBC- Item Selector-Duplicate-display-name-issue	
		 that.model.updateValue(this.name,val); // CIBC- Item Selector-Duplicate-display-name-issue
		 this.updateScreenViewData(this);//CBXFW_DIT_77
		 /**
			 * Set title to change the count on value change.the title will
			 * specify the total number of elements avaialble in the list
			 */
			var fromObj=Ext.getCmp(that.fromMultiselect.el.down('div.x-panel').dom.id);
			var toObj=Ext.getCmp(that.toMultiselect.el.down('div.x-panel').dom.id);		
			/**
			 * If show count indicatror has set to true the text of the bottom
			 * bar will updated by the count.If it has set to false we will
			 * destroy the bottom bar itself
			 */
			if(this.showCountInd=='Y'){
				setTimeout(function(){
					var leftCount=that.fromMultiselect.view.store.getCount();
					var rightCount=that.toMultiselect.view.store.getCount();
					fromObj.getComponent(1).getTopToolbar().getComponent(0).setText(leftCount.toString());
					toObj.getComponent(1).getTopToolbar().getComponent(0).setText(rightCount.toString());
				},100);	
			}else{
				fromObj.getComponent(1).getTopToolbar().hide();
				toObj.getComponent(1).getTopToolbar().hide();		
			}
		 this.executionTracker++;
	 },
	 // CHG_FF_ENHQ2 Endso
	 //NBAD3.0 - STARTS - CHAGNES DONE FOR THE KEY VALUE SETTING IN THE ITEM SELECTOR
	getKeys:function(valueArr){
		var keyArray=[];
		if(!Ext.isEmpty(valueArr)){
		for(var i=0;i<valueArr.length;i++){
			var indexOfVal=this.rawValues.indexOf(valueArr[i]);
			keyArray[i]=this.rawKeys[indexOfVal];
		}
		}
		return  keyArray;
	},
	getValueArrays:function(keyArr){
		var valArray=[];
		if(!Ext.isEmpty(keyArr)){
		for(var i=0;i<keyArr.length;i++){
			var indexOfKey=this.rawKeys.indexOf(keyArr[i]);
			valArray[i]=this.rawValues[indexOfKey];
		}
		}
		return  valArray;
	}
	//NBAD3.0 - eNDS
		//CBXFW_DIT_77 starts
	,getScreenViewData:function()
	{
		return this.model.getValue(this.name);
	}
	//CBXFW_DIT_77 ends

});	
Ext.reg('cbx-itemselector',cbx.formElement.itemSelector);
// CHG-ITEMSELECTOR Ends


cbx.formElement.staticItemSelector = function(config) {
	this.plainLabel = config.plainLbl;
	this.fieldLabel = config.displayNmKey;
	if(!Ext.isEmpty(config.multiInd) && config.multiInd==true && !Ext.isEmpty(config.index)){
		this.value = config.model.getModelData()[config.multiFormId][config.itemId][config.index] || "--";
	}else{
		this.value = config.model.getModelData()[config.itemId] || "--";	
	}
	this.name = config.itemId;
	this.addData = config.addData;
	this.required = config.requiredInd;
	this.conditional = config.conditionalInd;
	this.hidden = config.visibleInd === 'Y' ? false : true;
	cbx.formElement.staticItemSelector.superclass.constructor.call(this, config);
};

Ext.extend(cbx.formElement.staticItemSelector, Ext.form.TextArea, {

	/**
	 * @cfg {Object} bundleKey ,key used by resource to lookup bundle(defaults
	 *      to '')
	 */
	bundleKey : '',

	initComponent : function() {
		this.on('hide',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'N']));
		this.on('show',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'Y']));
		this.allowBlank = true;
		this.maxLength = undefined;
		this.minLength = undefined;

		cbx.formElement.staticItemSelector.superclass.initComponent.apply(this,
				arguments);
		var bundle;
		var commonbundle = CRB.getFWBundle();
		bundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));
		
		if (!Ext.isEmpty(this.plainLabel)) {
			this.fieldLabel = this.plainLabel;

		} else {
			this.fieldLabel = bundle['LBL_' + this.fieldLabel];
		}

		if (this.conditional === 'Y') {

			if (Ext.isEmpty(this.fieldLabel)) {
				this.fieldLabel = '?' + this.fieldLabel + '?'
						+ '<span class = \'cbx-mandatory-fx\'">**</span>';
			} else {
				this.fieldLabel = this.fieldLabel
						+ '<span class = \'cbx-mandatory-fx\'">**</span>';
			}
		} else if (this.required === 'Y') {

			if (Ext.isEmpty(this.fieldLabel)) {
				this.fieldLabel = '?' + this.fieldLabel + '?'
						+ '<span class = \'mandatory\'">*</span>';

			} else {
				this.fieldLabel = this.fieldLabel
						+ '<span class = \'mandatory\'">*</span>';
			}

		} else {
			if (Ext.isEmpty(this.fieldLabel)) {
				this.fieldLabel = '?' + this.fieldLabel + '?'
						+ '<span class = \'non_mandatory\'"></span>';

			} else {
				this.fieldLabel = this.fieldLabel
						+ '<span class = \'non_mandatory\'"></span>';
			}
		}

		if(!Ext.isEmpty(this.multiInd)&& this.multiInd==true && !Ext.isEmpty(this.index)){
			var value=this.getItemValue(this.model.md[this.multiFormId][this.itemId][this.index]) || '--'; 
		}else{
			var value=this.getItemValue(this.model.getValue(this.name)) || '--';	
		}
		
		this.setValue(value); 

		this.readOnly = true;
		this.labelSeparator = '';
		this.style = 'border:none;background: transparent;';
		this.anchor = (this.anchor == undefined) ? '' : this.anchor;
		this.tabIndex = 99999991; 
	},
	/**
	 * Method checks for the default item value exists.
	 */
	getItemValue : function(value) {
		var out = "";
	
		
		if (!Ext.isEmpty(this.addData) ) { 
			for ( var i = 0; i < this.addData.length; i++) {
				if (this.addData[i]['rawKey'] === value) {
					out = this.addData[i]['rawValue'];
					return out;
				}
			}
		}
		return out;
	},

		/**
	 * Methods directly ties up with the additional data format of Form FW and
	 * is responsible for parsing the provided additional data and repopulate
	 * the combo store.
	 */

	rePopulateAdditionaldata : function(additionalData) {

		if(!Ext.isEmpty(additionalData)){

		this.addData=additionalData;
			if(!Ext.isEmpty(this.multiInd)&& this.multiInd==true && !Ext.isEmpty(this.index)){
			 value=this.getItemValue(this.model.getValue(this.multiFormId)[this.itemId][this.index]) || '--';
		}else{
			var value=this.getItemValue(this.model.getValue(this.name)) || '--';
		}
		
		this.setValue(value);

		}		

	},
	
	    afterRender:function(){
		
		this.updateScreenViewData(this);

		cbx.formElement.staticItemSelector.superclass.afterRender.apply(this,
				arguments);
	},	
	getScreenViewData:function()
	{
		return this.getValue();
	}
	
	
});
Ext.reg('cbx-staticitemselector', cbx.formElement.staticItemSelector);






// CHG00TAB Starts
/**
 * Container which manages to render its children into individual cards
 * displayed as separate tabs.
 */
cbx.formElement.TabPanel = Ext.extend(Ext.TabPanel, {
	TABSWITCH_ONCLOSE:true, // CBXR12Q413F04_UPD
	initComponent : function() {		
		//CBXFW_DIT_77 starts
		this.on('hide',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'N']));
		this.on('show',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'Y']));
		//CBXFW_DIT_77 ends
		var defaultConfig = {
			itemId : this.itemId,
			items : this.createItems(),
			manager : this.manager, // CHGWDGT_MODIFIEDDATA
			anchor:'100%',
			forceLayout : true,
			// default cls provided for the PEG for implementation specific
			// styling
			cls : 'cbx-tabpanel',
			// internal flag to be used by FW to override the validation call at
			// the time of tab switch
			skipValidation : false,
			border: this.ctxContainerInd==='Y'?false:null,
			renderHidden : true,
			// marking false to make sure the entire tab conent with all the
			// children are rendered at the initialization time.
			deferredRender : false,
			enableTabScroll : true, // CBXR12Q113F10
			activeTab:0
		};
		/**
		 * Since IE6 is not able to make the tab as context container, so border
		 * is needed for the first tab for layout purpose.
		 */
		if(Ext.isIE6 && this.ctxContainerInd==='Y'){
			Ext.apply(defaultConfig, {border:true});
		}
		Ext.apply(this, defaultConfig);
		// CBXR12Q413F04 starts
		/*
		 * The event 'beforetabchange' is called only when the tab component is
		 * visible.
		 */
	// if(this.isVisible()== true){ // CBXR12Q413F04_UPD
			this.on('beforetabchange', this.verifyTabSwitchAccepted,
						this);	
	// } // CBXR12Q413F04_UPD
		// CBXR12Q413F04 ends
		this.on('beforeadd', this.beforeAdd, this);		
		// call parent initComponent
		cbx.formElement.TabPanel.superclass.initComponent.call(this);
	},
	/**
	 * Method is responsible for reading the meta data and create an instance of
	 * cbx-tabinnerpanel for each direct sub form id provided as its child.
	 */
	createItems : function() {
		var config={};
		if (this.children != null) {
			config.metadata = {
				totalColumns : 2
			};
			config.metadata.children = this.children;
		}
		var childForms=[];
		var formConfig=null;
		if(this.children==null){
			LOGGER.error('No child components configured for the tab panel', this.itemId);
			return[];
		}
		for(var i=0, len=this.children.length; i<len; i++){
			/**
			 * Creating the config for lazzy form panel with all teh required
			 * attributes for the FW to take care of the defaul rendering
			 * process.
			 */
			formConfig={
						xtype:'cbx-lazzyformpanel',
						anchor:'100%',
						formId: this.children[i].formId,
						itemId: this.children[i].formId,
						model : this.model,
						mode : this.mode,
						screenView : this.screenView,//CBXFW_DIT_77
						// default cls provided for the PEG for implementation
						// specific
						// styling
						cls : 'cbx-lazzyformpanel',
						// CBXR12Q413U02 starts
						/*
						 * This will set labelAlign value to each child form in
						 * the tabpanel
						 */
		labelAlign : (this.children[i].labelAlignType ? this.children[i].labelAlignType : this.labelAlignType),
						// CBXR12Q413U02 ends
						manager : this.manager,
						preInitConfig : this.preInitConfig
					};
			/**
			 * Child panels for the tab.
			 */
			childForms.push({
				xtype:'cbx-tabinnerpanel', 
				//CHG_FF_ENHQ213 Starts
				title:CRB.getBundle(cbx.jsutil.getBundleKey(this.children[i]))?CRB.getBundle(cbx.jsutil.getBundleKey(this.children[i]))['LBL_' + this.children[i].formTitle] || this.children[i].formTitle:this.children[i].formTitle,
				//CHG_FF_ENHQ213 Ends
				itemId: this.children[i].formId+"_INNER_PANEL",
				autoScroll: this.ctxContainerInd==='Y'?true:null,
				// default cls provided for the PEG for
				// implementation specific
				// styling
				cls : 'cbx-tabinnerpanel',
				model : this.model,
				mode : this.mode,
				screenView : this.screenView,//CBXFW_DIT_77
				manager : this.manager,
				preInitConfig : this.preInitConfig,
				listeners : {
					"activate" : this.tabSelectionHandler
				},				
				items:[formConfig]});
		}
		return childForms;
	},
	tabSelectionHandler: function(panel){
		panel.doLayout();
	},
	/**
	 * The method is used validate if the switch between tab is allowed at any
	 * point of time during the time tab panel is available on the screen. This
	 * method will perform the following check in the order given below.
	 * 
	 * @1) In case validOnSwitchInd==='Y' then perform the validation of the sub
	 *     form using manager.isTabFormValid({formId:oldFormId}) and return from
	 *     the handler in case the form is invalid.
	 * @2) Raise the cbxbeforetabchange event for the PEG developer to provide
	 *     custom handler for validating if switch needs to be allowed or not.
	 *     In case the event handler is available, then execute the handler and
	 *     as per its return value allow or stop the tab change.
	 */
	verifyTabSwitchAccepted: function(tabPanel, newTab, currentTab){
		// CBXR12Q413F04_UPD starts
		if(this.getSwitchTabOnClose() === false){
			return false;
		}
		// CBXR12Q413F04_UPD ends
		if(newTab!=null && currentTab!=null){
			var newFormId= newTab.itemId.substring(0, newTab.itemId.indexOf("_INNER_PANEL"));
			var oldFormId= currentTab.itemId.substring(0, currentTab.itemId.indexOf("_INNER_PANEL"));
			
			if(this.validOnSwitchInd==='Y' && !this.skipValidation){
				if(!this.manager.isTabFormValid({formId:oldFormId})){
					return false;
				}
			}else{
				this.skipValidation=false;
			}
			if (this.manager.register['cbxbeforetabchange' + "|" + this.itemId] != null) {
				var obj = this.manager.register['cbxbeforetabchange' + "|" + this.itemId];
				/** Executing the handler attached to cbxbeforetabchange */
				var beforeTabChangeResult = obj.handler.apply(obj.mScope, [ this.manager, newFormId, oldFormId ]);
				if(beforeTabChangeResult!=null && Ext.isBoolean(beforeTabChangeResult)){
					return beforeTabChangeResult;
				}
			}
		}
		return true;
	},
	// CBXR12Q413F04_UPD starts
	setSwitchTabOnClose : function(flag){
		this.TABSWITCH_ONCLOSE = flag;
	},
	getSwitchTabOnClose : function(){
		return this.TABSWITCH_ONCLOSE;
	},
	// CBXR12Q413F04_UPD ends
	/**
	 * Method to call the Form Manager for setting the tab panel as the context
	 * container as per the meta data provided.
	 */
	beforeAdd : function(item) {
		if(this.ctxContainerInd==='Y'){
			this.manager.setContextContainer(this);
		}
	},
	//CHG_TRADE_POC Starts
	activateTab:function(formId){
			try{
			this.setActiveTab(formId+"_INNER_PANEL");
			}catch(err){
				LOGGER.error('No FormId is found ', formId);
			}
	},
	//CHG_TRADE_POC Ends
	afterRender : function(ct, position) {
		cbx.formElement.TabPanel.superclass.afterRender.call(this, ct,
				position);
		this.ownerCt.doLayout();
	},	
	destroy : function() {
		this.setSwitchTabOnClose(false);	// CBXR12Q413F04_UPD
		this.items.each(Ext.destroy, Ext); // Destroy all the fields
		cbx.formElement.TabPanel.superclass.destroy.call(this);
	}
});
Ext.reg('cbx-tabpanel', cbx.formElement.TabPanel);
cbx.formElement.TabInnerPanel = Ext.extend(Ext.Panel, {
	initComponent : function() {
		var defaultConfig = {
			layout:'column',
			autoHeight: Ext.isIE6 ? true : null,
			defaults : {
				columnWidth:1
			},
			forceLayout : true,
			renderHidden : true
		};
		Ext.apply(this, defaultConfig);
		// call parent initComponent
		cbx.formElement.TabInnerPanel.superclass.initComponent.call(this);
	},
	afterRender : function(ct, position) {
		cbx.formElement.TabInnerPanel.superclass.afterRender.call(this, ct,
				position);
		this.ownerCt.doLayout();
	}
});
Ext.reg('cbx-tabinnerpanel', cbx.formElement.TabInnerPanel);
// CHG00TAB Ends
    // CHG00LookupFilter Starts
	      cbx.formElement.EditableLookUpFilter = function(config) {
	    		this.widgetId=config.rangeMenu.widgetId;
	    		this.columnVal=config.rangeMenu.columnVal;
	    		this.extraParams=config.rangeMenu.extraParams;	  		
    			this.emptyText='Select Filter Text...';
	    		cbx.formElement.EditableLookUpFilter.superclass.constructor.call(this, config);
	    	};
	    	Ext.extend(cbx.formElement.EditableLookUpFilter, Ext.form.TriggerField, {
	    		handler : function() {
	    			return true;
	    		},
	    		submittable : true,
	    		editable:false,
	    		/**
				 * @cfg object required, Meta data object required to render
				 *      account lookup, This object can create create with
				 *      following attributes productCode - required, to specify
				 *      PRODUCT CODE and will be passed to server while
				 *      retrieving data subProductCode - required, to specify
				 *      SUB-PRODUCT CODE and will be passed to server while
				 *      retrieving data functionCode - required, to specify
				 *      FUNCTION CODE and will be passed to server while
				 *      retrieving data cm - required, Should be an object of
				 *      Ext.grid.ColumnModel, will be used to render lookup grid
				 *      columns recordType - required , Used to read records
				 *      returning from server Either an Array of field
				 *      definition objects as passed to Ext.data.Record.create,
				 *      or a Record constructor created using
				 *      Ext.data.Record.create. rowdbclickhandler - required,
				 *      Javascript function which would gets executes when a row
				 *      is double clicked in the grid extraParams - Optional, If
				 *      required to pass any params as part of request
				 */
	    		lookupMetadata : {},
	    		/**
				 * possiable values are 0 and 1 0 indicates apply pre-filter 1
				 * indicates no pre-filter required.
				 * 
				 * @type Number
				 */
	    		preFilterRequired : 1,
	    		ctCls:'c-form-lookup',
	    		width : 142,
	    		defaultAutoCreate : {
	    			tag : "input",
	    			type : "text",
	    			size : "100",
	    			autocomplete : "off"
	    		},
	    		initComponent : function() {
	    			var commonbundle = CRB.getFWBundle();
	    			if (Ext.isEmpty(this.maxLength)) {
	    				this.maxLength = undefined;
	    			}
	    			if (Ext.isEmpty(this.minLength)) {
	    				this.minLength = undefined;
	    			}
	    			cbx.formElement.EditableLookUpFilter.superclass.initComponent.apply(this,
	    					arguments);
	    			this.labelSeparator = '';
	    			this.hideLabel=true;
	    		},
	    		onTriggerClick : function() {
	    			if (this.disabled) {
	    				return;
	    			}try{
	    			var paramStr=this.extraParams;
	    			var paramArr= paramStr.split(",");
	    			extraParamArr={};
	    			var keyVal=[];
	    			for(var i=0; i< paramArr.length; i++){
	    				keyVal=paramArr[i].split(":");
	    				extraParamArr[Ext.util.Format.trim(keyVal[0])]=Ext.util.Format.trim(keyVal[1]);
	    			};
	    			this.addParams=extraParamArr;
	    			this.bundleKey=this.addParams && this.addParams.resourceBundleKey && CRB.getBundle(this.addParams.resourceBundleKey)? CRB.getBundle(this.addParams.resourceBundleKey):CRB.getFWBundleKey();
	    			var transmetadata = {
	    				resourceBundleKey : this.bundleKey,			
	    				width : 635,
	    				widgetId : this.widgetId,
	    				reqparamshandler : function(params) {
	    					if (this.addParams != null) {
	    						Ext.apply(params, this.addParams);
	    					}
	    					return params;
	    				}
	    			};
	    			this.lookupMetadata = transmetadata;
	    			this.lookupMetadata.lookupId = this.widgetId;
	    			this.lookupMetadata.widgetId = this.widgetId;
	    			this.lookupMetadata.rowdbclickhandler = this.callBackHandler;
	    			this.lookupMetadata.scope = this;
	    			this.lookupMetadata.rangeMenu=this.rangeMenu;
	    			iportal.formview.showLookupWinForFilter(this.lookupMetadata);
	    			}catch(err){
	    			this.rangeMenu.enableMenu=false;
	    			if(this.rangeMenu.lookupFilterWindow && this.rangeMenu.lookupFilterWindow.isVisible){
	    				try{
	    					this.rangeMenu.lookupFilterWindow.close();	
	    				}catch(err){}
	    			}
	    			return;
	    			}
	    		},
	    		/**
				 * Method handles the callback responsibilty on selecting the
				 * row from lookup grid and sets the current value of our text
				 * field, updates the model with fieldname plus current value.
				 */
	    		callBackHandler : function(grid, srd, rowindex) {		
	    			if(srd && srd[this.columnVal]){
	    				this.setValue(srd[this.columnVal]);
	    			}else{
	    				this.setValue('');
	    			}
	    		},
	    	setEnableMenu:function(flag){
	    		this.rangeMenu.enableMenu=flag;	
	    	},
	    		getValue : function() {
	    			return cbx.formElement.EditableLookUpFilter.superclass.getValue.call(this)
	    					|| "";
	    		},
	    		// Set the current value of our trigger field.
	    		setValue : function(text) {		
	    			cbx.formElement.EditableLookUpFilter.superclass.setValue.call(this, text);
	    			var that=this;
	    			setTimeout(function (){
	    				that.rangeMenu.setDefaultValue(that.rangeMenu);
	    			}, 100);
	    		}
	    	});
	    	Ext.reg('cbx-filtereditablelookup', cbx.formElement.EditableLookUpFilter);
	    	// CHG00LookupFilter Ends
// CHG-HTMLEDITOR Starts
cbx.formElement.htmlEditor=function(config) {	
	this.plainLabel = config.plainLbl;
	this.fieldLabel = config.displayNmKey;
	this.name = config.itemId;
	this.required = config.requiredInd;
	this.conditional = config.conditionalInd;
	this.hidden = config.visibleInd === 'Y' ? false : true;
	this.value = config.model.getModelData()[config.itemId];
	cbx.formElement.htmlEditor.superclass.constructor.call(this, config);
};
Ext.extend(cbx.formElement.htmlEditor,Ext.form.HtmlEditor,  {
	/**
	 * @cfg {Boolean} enableSourceEdit Enable the switch to source edit button.
	 *      Not available in Safari. (defaults to false)
	 */
	enableSourceEdit:false,
	/**
	 * @cfg {Integer} heightToSet used to set the height of the
	 *      textarea.(defaults to 300)
	 */
	heightToSet:300,
	initComponent:function(){
		//CBXFW_DIT_77 starts
		this.on('hide',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'N']));
		this.on('show',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'Y']));
		//CBXFW_DIT_77 ends
		var combundle;
		var commonbundle = CRB.getFWBundle();
		combundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));
		/**
		 * If the plainLabel attribute is not null ,component's field label will
		 * be the plain-label else the label associated with bundle keys will be
		 * referred to get the field label.
		 */
		if (!Ext.isEmpty(this.plainLabel)) {
			this.fieldLabel = this.plainLabel;
		} else {
			this.fieldLabel = combundle['LBL_'
					+ this.fieldLabel];
		}
		/**
		 * If the conditional attribute is Y the components field label will be
		 * field label associated with two stars
		 */
		if (this.conditional == 'Y') {
			this.blankText = String.format(commonbundle['ERR_MANDATORY'],
					this.fieldLabel);
			if (Ext.isEmpty(this.fieldLabel)) {
				this.fieldLabel = '?' + this.fieldLabel + '?'
						+ '<span class = \'cbx-mandatory-fx\'">**</span>';// CHG001-CSS
																			// changes
			} else {
				this.fieldLabel = this.fieldLabel
						+ '<span class = \'cbx-mandatory-fx\'">**</span>';// CHG001-CSS
																			// changes
			}
		}
		/**
		 * If the required attribute is Y,components field label will be field
		 * label associated with mandatory star and the field will not allow
		 * blank values.
		 */
		else if (this.required === 'Y') {
			this.allowBlank=false;
			this.blankText = String.format(
					commonbundle['ERR_MANDATORY'], this.fieldLabel);
			if (Ext.isEmpty(this.fieldLabel)) {
				this.fieldLabel = '?' + this.fieldLabel + '?'
						+ '<span class = \'mandatory\'">*</span>';
			} else {
				this.fieldLabel = this.fieldLabel
						+ '<span class = \'mandatory\'">*</span>';
			}
		} else {
			if (Ext.isEmpty(this.fieldLabel)) {
				this.fieldLabel = '?' + this.fieldLabel + '?'
						+ '<span class = \'non_mandatory\'"></span>';
			} else {
				this.fieldLabel = this.fieldLabel
						+ '<span class = \'non_mandatory\'"></span>';
			}
		}
		if(!Ext.isEmpty(this.maxNumLines)){
			this.heightToSet=cbx.jsutil.getTextAreaHeight(this.maxNumLines);
		}
		this.defaultAutoCreate = {
		        tag: "textarea",
		        style:"width:500px;height:"+this.heightToSet+"px;",
		        autocomplete: "off"
		};
		cbx.formElement.htmlEditor.superclass.initComponent.apply(this,arguments);
		/* Intializing onBlur and onKeyup event. */
		this.on('initialize', function() {
            Ext.EventManager.on(this.getDoc(), {
                'blur': this.onBlur,
                'keyup':this.onKeyUp,
                scope: this
            });
        });
		/**
		 * On Blur event call the syncmodeldata method will be called which
		 * inturn wil update the model
		 */
		this.onBlur=function(){
			this.syncModelData();	
		};
	},
	onKeyUp:function(){
		this.validate();
	},
		//CBXFW_DIT_77 starts
	afterRender:function()
	{
		this.updateScreenViewData(this);
		cbx.formElement.htmlEditor.superclass.afterRender.apply(this,arguments);
	},
	/**
	 * Updates the screen data in the ScreenView
	 */
	getScreenViewData:function()
	{
		var value = this.getValue();
		if(!Ext.isEmpty(value)){
			return value.replace(/"/g, '\'');
		}
		return "";
	},
	//CBXFW_DIT_77 ends
	syncModelData:function(){
		if (this.manager.handlerEvent('cbxvalidate', this.name, this
					.getValue()) === false) {
				LOGGER.debug('Invalid data for ' + this.name
						+ " skip updating the model", this.getValue());
				return;
			}
		this.model.updateValue(this.name, this.getValue());
		this.updateScreenViewData(this); //CBXFW_DIT_77
	}
});
Ext.reg('cbx-htmleditor',cbx.formElement.htmlEditor);
cbx.formElement.LookUp = function(config) {
//CHG_TRADE_POC
	cbx.formElement.LookUp.superclass.constructor.call(this, config);
};
Ext.extend(cbx.formElement.LookUp, Ext.form.TriggerField, {
	handler : function() {
		return true;
	},
	buttonTextKey : 'LBL_LOOKUP',
	submittable : false,
	lookupMetadata : {},
	preFilterRequired : 1,
	ctCls:'c-form-lookup',
	width : 30,
	defaultAutoCreate : {
		tag:'br',
		size : "100",
		autocomplete : "off",
		style:"display:'none'"
	},
	initComponent : function() {
		this.name = this.itemId;
		this.widgetId = this.widgetId;
		this.readOnly = this.readOnlyInd === 'Y' ? true : false;
		this.hidden = this.visibleInd === 'Y' ? false : true;
		this.value = (this.model.getModelData()[this.itemId])?(this.model.getModelData()[this.itemId]):' ';//CT1.0_FFW Fixes
		//CHG_TRADE_POC Starts
		if (Ext.isEmpty(this.maxLength)) {
			this.maxLength = undefined;
		}
		if (Ext.isEmpty(this.minLength)) {
			this.minLength = undefined;
		}
		cbx.formElement.EditableLookUp.superclass.initComponent.apply(this,
				arguments);
		//CHG_TRADE_POC  ends
	},
	onTriggerClick : function() {
		if (this.disabled) {
			return;
		}
		var rb = CRB.getFWBundle();
		/**
		 * On Raising this event The Form manager is expected to return a param
		 * JSON that will be attached to / override the existing base params of
		 * the lookup. These params will be sent to the server when the lookup
		 * grid make its data request.
		 */
		var addParams = this.manager.handlerEvent('cbxbeforeload', this.name);
		// The Changed Metadata is as Follows
		var transmetadata = {
			resourceBundleKey : CRB.getFWBundleKey(),
			width : 635,
			widgetId : this.widgetId,
			reqparamshandler : function(params) {
				if (addParams != null) {
					Ext.apply(params, addParams);
				}
				return params;
			}
		};
		this.lookupMetadata = transmetadata;
		this.lookupMetadata.lookupId = this.widgetId;
		this.lookupMetadata.widgetId = this.widgetId;
		this.lookupMetadata.rowdbclickhandler = this.callBackHandler;
		this.lookupMetadata.scope = this;
		iportal.formview.showLookupWin(this.lookupMetadata);
	},
	/**
	 * Method handles the callback responsibilty on selecting the row from
	 * lookup grid and sets the current value of our text field, updates the
	 * model with fieldname plus current value.
	 */
	callBackHandler : function(grid, srd, rowindex) {
		var lookup = srd.__LOOKUP_NAME;
		if (lookup == this.widgetId) {
			this.manager.handlerEvent('cbxafterselect', this.name, srd);
			// this.setValue(srd.INPUT_ORG_ACC_NO);
			// this.syncModelDataonLookupSelect(srd.INPUT_ORG_ACC_NO);
		}
	},
	setValue:function(){
		cbx.formElement.LookUp.superclass.setValue.call(this,
					arguments);
	},
	getValue:function(){
		cbx.formElement.LookUp.superclass.getValue.call(this,
					arguments);	
	},
	getPrintData : function() {
		var label = this.fieldLabel;
		var fieldValue = this.getValue();
		var printMap = {};
		printMap[label] = fieldValue;
		return printMap;
	}
});
Ext.reg('cbx-lookup', cbx.formElement.LookUp);
//CHG_TRADE_POC Ends
// CHG-HTMLEDITOR Ends

/** CHG00NOTES Sticky Notes --- Starts */
cbx.formElement.cbxLine=function(config) {
	this.name = config.itemId;	
	cbx.formElement.cbxLine.superclass.constructor.call(this, config);
};
Ext.extend(cbx.formElement.cbxLine,Ext.BoxComponent, {
	initComponent : function() {
		//CBXFW_DIT_77 starts
		this.on('hide',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'N']));
		this.on('show',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'Y']));
		//CBXFW_DIT_77 ends
		cbx.formElement.cbxLine.superclass.initComponent.apply(
					this, arguments);
		this.anchor = (this.anchor == undefined) ? '' : this.anchor;
	},
    onRender : function(ct, position){
        if(!this.template){
            if(!cbx.formElement.cbxLine.lineTemplate){
                cbx.formElement.cbxLine.lineTemplate= new Ext.Template(
                		'<div  style=width:100>',
      						'<hr></hr>',
      						'</div>'
                );
            }            
        }    
        this.template=cbx.formElement.cbxLine.lineTemplate;
        this.template.compile();
        var fs; var  targs = ['width:100'];
        if(position){
            fs = this.template.insertBefore(position, targs, true);
        }else{
            fs = this.template.append(ct, targs, true);
        }
        this.el = fs;
        cbx.formElement.cbxLine.superclass.onRender.call(this);
     }
});
Ext.reg('cbx-line',cbx.formElement.cbxLine);
/** CHG00NOTES Sticky Notes ---- Ends */
/** FW137_FF_HYPERLINK -- Starts */
/**
 * This component is used to link to the window or an any url that provided.
 */
cbx.formElement.cbxHyperlink=function(config) {
	this.name = config.itemId;	
	this.plainLabel = config.plainLbl;
	this.displayNmKey = config.displayNmKey;
	this.hidden = config.visibleInd === 'Y' ? false : true;
	this.value = config.model.getModelData()[config.itemId];
	cbx.formElement.cbxHyperlink.superclass.constructor.call(this, config);
};
/**
 * 
 */
Ext.extend(cbx.formElement.cbxHyperlink,Ext.BoxComponent, {	
	hideLabel : true, //CBXQ213U04
	initComponent : function() {	
		//CBXFW_DIT_77 starts
		this.on('hide',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'N']));
		this.on('show',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'Y']));
		//CBXFW_DIT_77 ends
		var bundle;
		var commonbundle = CRB.getFWBundle();
		// To get the bundle key reference
		bundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));
		this.linkText = '';
		// Will not be disabled, Should available to click.
		this.disabled = false;
		// will not be hidden, should be visible.
		this.labelSeparator = '';
		/*CBXQ213U04 starts*/
		
		if (!Ext.isEmpty(this.value)) {
		
			this.linkText = this.value;
			
		}		
		
		else if (!Ext.isEmpty(this.plainLbl)) {

			this.linkText = this.plainLbl;

		}
        

		else if (!Ext.isEmpty(this.displayNmKey)) {

			this.linkText = bundle['LBL_' + this.displayNmKey];
			if(Ext.isEmpty(this.linkText)){
				this.linkText = '?'+this.displayNmKey+'?';
			}
		} else {
			this.linkText = '';
		}
		//this.hideLabel = true;
		/*CBXQ213U04 ends*/	
		this.anchor = (this.anchor == undefined) ? '' : this.anchor;
		var that= this;
		var defaultConfig = {
					id : this.itemId,
					cls : this.disabled == false ? 'cbx-formfw-hyperlink': '',
					autoEl:{
					    // html: '&nbsp;<a href>Link To Prospect</a>'
					    tag: 'a',			
					    cn: this.linkText
					},
					listeners: {
					    render: function(component) {
					        component.getEl().on('click', function(e) {
					        	if(that.disabled == false){
					        		that.handleClickEvent();
					        	} else {
					        		return false;
					        	}
					        });    
					    }
					}
				};
				Ext.apply(this, defaultConfig);
		cbx.formElement.cbxHyperlink.superclass.initComponent.apply(
					this, arguments);
		// this.on('click', this.handleClickEvent);
	},
	//CHG_CT_CLEANUP Starts
	handleClickEvent : function() {
		if(!Ext.isEmpty(this.multiInd) && this.multiInd==true && !Ext.isEmpty(this.index)){
			this.manager.handlerEvent('cbxclick', this.name,this.index,this.multiFormId);
		}
		else{
			this.manager.handlerEvent('cbxclick', this.name);
		}
	}  
	//CHG_CT_CLEANUP Ends
	/*CBXQ213U04 starts*/
	//CBXFW_DIT_77 starts
	,getValue : function() {
	
		return this.linkText;  

	},
	// IUT_FIX_1 - Starts
	setValue : function(value) {
		this.value = value;
		this.update(value);
		this.updateScreenViewData(this);
	}
	/*CBXQ213U04 ends*/
	,afterRender:function(){	
		this.updateScreenViewData(this);
		cbx.formElement.cbxHyperlink.superclass.afterRender.call(this);
	}
	/**
	 * Updates the screen data in the ScreenView
	 */
 	,getScreenViewData:function(){
 		return this.value;
 	}
	// IUT_FIX_1 - Ends
 	//CBXFW_DIT_77 ends
});
Ext.reg('cbx-hyperlink',cbx.formElement.cbxHyperlink);
/** FW137_FF_HYPERLINK -- Ends */
// FW_134 STARTS
/**
 * @author chiranjib.datta cbx.formElement.cbxLogo
 * @extends Ext.BoxComponent It can be implemented to render a logo or image as
 *          a form component
 */
cbx.formElement.cbxLogo=function(config) {
	this.name=config.itemId;
	cbx.formElement.cbxLogo.superclass.constructor.call(this, config);
};
Ext.extend(cbx.formElement.cbxLogo,Ext.BoxComponent, {
	/**
	 * Object/Method:initComponent The method is used to intialize any extjs
	 * component.It is a part of default component lifecycle.
	 */
	initComponent : function() {
		/**
		 * The following if condition has been added to check the default path
		 * of form level logo exists or not.The name of the component will be
		 * empty when it gets called from form level. If it exists then it will
		 * check for valid image extendion by calling isValidImageExtension
		 * method. If isValidImageExtension returns true then the path of the
		 * image will be set using setPath method or appropriate LOGGER will be
		 * shown
		 */
		if(Ext.isEmpty(this.name) || this.name==''){
			if(this.defaultPath && this.defaultPath!=' '){
				 if(this.isValidImageExtension(this.defaultPath)==true){
					  this.setPath(this.defaultPath);
		    	 }else{
		    		 LOGGER.error('Invalid extension in the image URL',this.defaultPath);
		    		 this.hide();
		    	 }				
			}
			else if(Ext.isEmpty(this.defaultPath)|| this.defaultPath==''){
				this.hidden=true;
		    	  LOGGER.info('Empty image URL in form level');
		    	  this.hide();	
			}
		}
		/**
		 * The following else condition has been added to check if the component
		 * is being called as component. It will check for additional
		 * information in.If it is not null then the additional information will
		 * be parsed using populateAddData. populateAddData inturn will return
		 * the raw keys and raw values.In this scenerio only a raw key and raw
		 * value. If the raw value is not empty ,then it will check for valid
		 * image extension using isValidImageExtension IfisValidImageExtension
		 * returns true then the path of the image will be set using setPath
		 * method or appropriate LOGGER will be shown. If the image path is
		 * empty then appropriate LOGGER will be shown
		 */
		else{
			  if(this.addData && this.addData!='')
			  this.rawKeys = this.populateAddData(this.addData,'rawKey');
		      this.rawValues = this.populateAddData(this.addData,'rawValue');
		      if(this.rawValues && this.rawValues!=''){
		    	  var path=this.rawValues.toString();
		    	 if(this.isValidImageExtension(path)==true){
		    		 this.setPath(path); 
		    	 }else{
		    		 var name=this.name;
		    		 LOGGER.error('Invalid extension in the image URL.Item Id:'+name+';URL:'+path);
		    		 this.hide();		    		    
		    	 }
		      }else if(Ext.isEmpty(path)|| path==''){
		    	  LOGGER.error('Empty URL for the item:',this.name);
		    	  this.hide();	
				}
		}
		cbx.formElement.cbxLogo.superclass.initComponent.apply(this, arguments);
	},
	/**
	 * Object/Method:Private The method will check for the valid image extension
	 * as .jps,.png,.bmp,.gif
	 * 
	 * @return Object/Boolean *
	 */
	isValidImageExtension:function(path){
		if((path.search('jpg')!=-1)||(path.search('png')!=-1) || (path.search('gif')!=-1) || (path.search('bmp')!=-1)|| (path.search('jsp')!=-1)){ //CBXQ2FW138  tabletop
			return true;
		}else{
			return false;
		}
	},
	/**
	 * Object/Method:Private The method will set the path of the image in a
	 * variable(this.imagePath)
	 * 
	 * @return Object/null *
	 */
	setPath:function(path){
		this.imagePath=path;
	},
	/**
	 * Object/Method:Private The method will return the path of the image *
	 */
	getPath:function(){
		  return this.imagePath;
	},
	/**
	 * Object/Method:Private This method is a part of default component
	 * lifecycle.This method is responsible for actual rendering of the
	 * component
	 */
	onRender : function(ct, position){     
	/**
	 * If the template is null then intialize the approprioate template
	 */
     if(!this.template){
         if(!cbx.formElement.cbxLogo.lineTemplate){            	
         	   var myTpl = new Ext.Template(            
         			        '<div>',
         			        '<img src="{imageUrl}" style="border:1px solid #B5B8C8 ">',
         			        '</div>'
         			    );
         	   cbx.formElement.cbxLogo.lineTemplate=myTpl;
         }  
     } 
     this.template=cbx.formElement.cbxLogo.lineTemplate;
     /**
		 * Compile the template
		 */
     this.template.compile();
     var fs;
     /**
		 * Set the arguements for the template. The path of the image will be
		 * set here.
		 */
     var  targs = {
         color : "#FFE9E9",
         imageUrl:(this.getPath() && this.getPath()!=' ')?this.getPath():''
     };
     if(position){
         fs = this.template.insertBefore(position, targs, true);
     }else{
         fs = this.template.append(ct, targs, true);
     }
     this.el = fs;
     /**
		 * Calling the superclass method with existing object configuration
		 */
     cbx.formElement.cbxLogo.superclass.onRender.call(this);
  },
  /**
	 * Object/Method:Private.This method is a part of default extjs component
	 * life cycle. After rendering the component this will call the beforeSghow
	 * event to check again the validity of the image.Because it may be a
	 * scenerio that the extension is proper but the path is wrong.
	 */
  afterRender:function(){
 	 cbx.formElement.cbxLogo.superclass.afterRender.call(this);
 	 this.on('beforeshow',this.isValidImage,this);
  },
	 /**
		 * Object/Method:Private.The method will be used to check whether the
		 * image url ir proper or not before showing the component. If the URL
		 * does not having an image appropriate LOGGEr will be shown. If it
		 * fails to load the image URL,the component will be hidden and it will
		 * return false.
		 */
  isValidImage:function()
  	{
 	this.objImg = new Image();
 	 this.objImg.src = this.getPath();
 	 if(this.objImg.src!='' && !this.objImg.complete)
 	  { 
 	    LOGGER.error('Failed to load image URL:',objImg.src);  
 	    this.hide();
 	    return false;
 	    }
 	 },
		 /**
			 * Object/Method:Private It will be used to retreive the additional
			 * information.
			 */
		populateAddData : function(items, rawType) {
			var rawDataArray = [];
			if (items != "" && items != null) {
				for ( var i = 0; i < items.length; i++) {
					rawDataArray.push(items[i][rawType]);
				}
			}
			return rawDataArray;
		}
});
/**
 * Registering the component as a part of extjs registry
 */
Ext.reg('cbx-logo',cbx.formElement.cbxLogo);
// FW_134 ENDS

//FW_INTELLEGENT_SEARCH Starts
/**
 * @Component:Auto Suggest Box
 * @Behavior:At the time of typing the values starts autopopulating
 * @extends:cbx.formEleement.comboBox
 * */
cbx.formElement.AutoSuggestTextBox=function(config){
	this.plainLabel = config.plainLbl;
	this.fieldLabel = config.displayNmKey;
	this.name = config.itemId;
	this.addData = config.addData;
	if(!Ext.isEmpty(config.model.getModelData())){
	if (this.addData != null) {
		this.value = config.model.getModelData()[config.itemId];
	} else {
		this.tempValue = config.model.getModelData()[config.itemId];
	}
	}
	this.required = config.requiredInd;
	this.conditional = config.conditionalInd;
	this.readOnly = config.readOnlyInd === 'Y' ? true : false;
	this.hidden = config.visibleInd === 'Y' ? false : true;
	this.includeSelect=false;  
	this.includeSelectOnSingleValue=this.includeSelect;
	cbx.formElement.AutoSuggestTextBox.superclass.constructor.call(this, config);
};
Ext.extend(cbx.formElement.AutoSuggestTextBox,cbx.formElement.ComboBox,	{
			/**
			 * @cfg {Boolean} required ,to specify whether this field is
			 * mandatory (defaults to N)
			 */
			required : 'N',
			/**
			 * @cfg {Boolean} required ,to specify whether this field is
			 * conditional (defaults to N)
			 */
			conditional : 'N',
			/**
			 * @cfg {Object} bundleKey ,key used by resource to looku
			 * bundle(defaults to '')
			 */
			combundleKey : '',
			/**
			 * @cfg {Boolean} includeSelect ,to specify whether
			 * combobox's first option is select or not (defaults
			 * to true)
			 */
			includeSelect : false,  
			/**
			 * @cfg {String} defaultValue ,initially Selected value for
			 * this combo(defaults to '')
			 */
			defaultValue : '',
			/**
			 * @cfg {String} rawKeys ,raw keys to be set in the combo in
			 * the absence of bundle(defaults to null)
			 */
			rawKeys : [],
			/**
			 * @cfg {String} rawValues ,raw values to be set in the
			 * combo in the absence of bundle(defaults to null)
			 */
			rawValues : [],
			plainLabel : '',
			fieldLabel : '',
			toolTipLabel:'',
			resizable:true, 
			fireEventOnSingleSelect : true,
			hideTrigger:true,
			/**
			 * @cfg {String} replaceEntityReference ,true to make
			 * replace entity references in combo displayfield
			 */
			 replaceEntityReference : false,
			 cls : 'x-form-combo',
			 /**
			  * @method:initComponent
			  * Default method of any component life cycle to initialize the configuration properties
			  * of any component			  * 
			  * */
			  initComponent : function() {
				  cbx.formElement.AutoSuggestTextBox.superclass.initComponent.apply(this, arguments);
					 this.triggerAction='all';
					 this.typeAhead=false;
					 /* restrict the user to select only the list values*/
					 this.forceSelection= true;
					 this.includeSelect=false;
					 this.minChars=1;
					 this.editable=true;
					 this.selectOnFocus=false;
					 this.autoSelect=false;
			  },			 
			 /**
				 * 
				 * Execute a query to filter the dropdown list. Fires the
				 * beforequery event prior to performing the query allowing the
				 * query action to be canceled if needed.
				 * 
				 * @Parameters inText : String .Input Text to be entered by user
				 *             uplon which a like filter will be applied/
				 *             forceAll : Boolean true to force the query to
				 *             execute even if there are currently fewer
				 *             characters in the field than the minimum
				 *             specified by the minChars config option. It also
				 *             clears any filter previously saved in the current
				 *             store (defaults to false)
				 * @Purpose: This method is overridden to filter the suggestion
				 *           values depending upon the input text
				 */
			 doQuery : function(inText, forceAll){
				  inText = Ext.isEmpty(inText) ? '' : inText;
				  var qe = {
				      query: inText,
				      forceAll: forceAll,
				      combo: this,
				      cancel:false
				  };
				  if(this.fireEvent('beforequery', qe)===false || qe.cancel){
				      return false;
				  }
				  inText = qe.query;
				  forceAll = qe.forceAll;
				  
				  if(inText==' ')
					  {
					  return;
					  }
				  
				  if(forceAll === true || (inText.length >= this.minChars)){
				      if(this.lastQuery !== inText){
				          this.lastQuery = inText;
				          if(this.mode == 'local'){
				              this.selectedIndex = -1;
				              if(forceAll){
				                  this.store.clearFilter();
				              }else{
				                  this.store.filter(this.displayField, inText, true,false,true); // supply the anyMatch option
				                  }
				                  this.onLoad();
				              }else{
				                  this.store.baseParams[this.queryParam] = inText;
				                  this.store.load({
				                      params: this.getParams(inText)
				                      });
				                  this.expand();
				              }
				          }else{
				              this.selectedIndex = -1;
				              this.onLoad();
				          }
				      }
				  }
		});

Ext.reg('cbx-autoSuggest', cbx.formElement.AutoSuggestTextBox);
// FW_INTELLEGENT_SEARCH - Ends


//CHG001_62663 starts
/**
* ImagePanel component supports displaying one or more than one images inside a panel. 
* The main features of this component are :
* 1. The images sources can be static or dynamic.
* 2. Developers can configure tha sources of the images from any sources they want.
* But make sure the details of the images are given to be framework component in the format
* defined by the framework.
* 3. Labels of the images can be shown or Hide. Its configurababl.
* 4. The size of the image is condfigurable.
* 5. Provides listeners/ event handlers for the click on the image.
* 6. Provides listener/event handler on the select of items from the combo.Example, based on 
* the item selected from the combo, the images in the imagepanels can be reloaded.
*/


cbx.formElement.ImagePanel = function(config) {

	this.plainLabel = config.plainLbl;

	this.fieldLabel = config.displayNmKey;

	this.name = config.itemId;
	
	this.addData = config.addData;

	this.html = config.model.getModelData()[config.itemId] || '';

	this.hidden = config.visibleInd === 'Y' ? false : true;

	cbx.formElement.ImagePanel.superclass.constructor.call(this, config);

};
Ext.extend(cbx.formElement.ImagePanel, Ext.Panel, {

	rawKeys : [],
	rawValues : [],
	containerHeight : 120,
	
	initComponent : function() {
		this.rawKeys = this.populateAddData(this.addData,'rawKey');
		this.rawValues = this.populateAddData(this.addData,'rawValue');
		var defaultScrollPanelWidth = 100;
		var actualScrollPanelWidth = 100 * (this.rawValues.length);
		var width = defaultScrollPanelWidth;
		if(actualScrollPanelWidth> defaultScrollPanelWidth){
			width = actualScrollPanelWidth;	
		}
		 
		this.bsp = new cbx.panel.ButtonScrollingPanel({
			amountOfxScroll:100,	
			height : this.containerHeight,
			autoScroll: false,
			scrollCmp : [{width:width,
				items :[{
					xtype : 'panel',
					id: 'scrollID',
					layout : 'column',
					items :this.createItems(),
					autoScroll : false
					
				}]
			}]
		});

		var defaultConfig = {
				height :this.containerHeight,
				items : [this.bsp]
		};

		Ext.apply(this, defaultConfig);
		var bundle;

		bundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));

			if (!Ext.isEmpty(this.plainLbl)) {

				this.title = this.plainLbl;

			} else if (Ext.isEmpty(this.fieldLabel)) {

				this.title = '';

			} else {

				this.title = bundle['LBL_' + this.fieldLabel];

			}
		
		cbx.formElement.ImagePanel.superclass.initComponent.call(this);
	},
	
	/**
	 * Creates the images to be displayed inside the image panel.
	 */
	createItems : function() {
		
		var panelList =[];
		var combundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));
		var imgheight = this.containerHeight-40;
		
		for ( var i = 0; i < this.rawValues.length; i++) { 
			var src = this.rawValues[i];
			var item=this.rawKeys[i];
			this.label =(this.hideLabelInd == 'Y') ? '' :combundle['LBL_'+item];// combundle['LBL_STRTS_WTH'];
			var tpl=new Ext.XTemplate(
					'<div class = "div-img-wrap"><img style = "height:'+imgheight+'px" src='+src+' label></img><div class="img-label">'+this.label+'</div></div>'
					);
			tpl.compile();		
			var panel= {
				xtype   :'panel',
				html:tpl.html,
				src:src,
				name:this.itemId,
				imageId : item+'+'+Ext.id(),
				height 	: this.containerHeight-5,
				width	:100,
				cls : 'ipItems-cls',
				hideLabel : true,
				manager:this.manager,
				listeners : {
					afterRender : function(){
						var scope = {
								fm : this.manager,
								imageId : this.imageId,
								name:this.name,
								src:this.src
						}
						this.getEl().on('click',function(){
							this.fm.handlerEvent('cbxclick',this.name, this.imageId.split('+')[0]+'$'+this.src);
						},scope);
						
					}
				}
			};
			panelList.push(panel);
		}
		return panelList;
	},
	populateAddData : function(items, rawType) {
		var rawDataArray = [];
		if (items != "" && items != null) {
		for ( var i = 0; i < items.length; i++) {
			rawDataArray.push(items[i][rawType]);
		}
			}
		return rawDataArray;
		},
	/**
	 * Reloads the Scroll button component.
	 */
	reload: function(){
		Ext.getCmp('scrollID').removeAll();
		var item = this.createItems();
		Ext.getCmp('scrollID').add(item);
		this.doLayout();
	},
	/**
	 * Updates the store with the arrays of keys and values.
	 */
	updateComboRawStore : function(keyArr, valueArr) {
		if(!Ext.isEmpty(keyArr) && !Ext.isEmpty(valueArr)){
			this.rawValues=valueArr;
			this.rawKeys=keyArr;
			this.reload();
		}
	}
});
Ext.reg('cbx-imagepanel', cbx.formElement.ImagePanel);
//CHG001_62663 ends

//CBXQ2FW111 Starts
/**
 * @class cbx.formElement.DisplayField
 * @extends Ext.form.DisplayField
 * Base class to customize a textfield display text in a form layout.
 * @constructor
 * Creates a new DisplayField Field
 * @param {Object} config Configuration options
 */
cbx.formElement.DisplayField = function(config){
    this.name = config.itemId;
	this.conditional = config.conditionalInd;
	this.valueInd = config.model.getModelData()[config.itemId] || '--';
	this.required = config.requiredInd;
	this.plainLabel = config.plainLbl;
	this.fieldLabel = config.displayNmKey;
	this.lookup = config.lookup;
	this.hidden = config.visibleInd === 'Y' ? false : true;
    cbx.formElement.DisplayField.superclass.constructor.call(this, config);
};

Ext.extend(cbx.formElement.DisplayField, Ext.form.DisplayField,  {
	 /**
     * @cfg {String/Object} required ,to specify whether this field is mandatory (defaults to false)
     */
    required : false,
	
	/**
     * @cfg {Object} bundleKey ,key used by resource to lookup bundle(defaults to '')
     */
	bundleKey : '',
	
	realValue : '',
	
	initTip : false,
		
    plainLabel : '',
	
    fieldLabel : '',

	cls : 'x-form-field x-form-displayField',
	
	charWidth:iportal.preferences.getLabelCharWidth(),
     // private
	initComponent:function(){
		cbx.formElement.DisplayField.superclass.initComponent.apply(this, arguments);	
		var commonbundle = CRB.getFWBundle();
		var bundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));
		/**
				 * If the plainLabel attribute is not null ,component's field
				 * label will be the plain-label else the label associated with
				 * bundle keys will be referred to get the field label.
				 */
				if (!Ext.isEmpty(this.plainLabel)) {
					this.fieldLabel = this.plainLabel;

				} else if (Ext.isEmpty(this.fieldLabel)) {
					this.fieldLabel = '';

				} else {
					this.fieldLabel = bundle['LBL_' + this.fieldLabel];
				}
				

				/**
				 * If the conditional attribute is Y the components field label
				 * will be field label associated with two stars
				 */
				if (this.conditional === 'Y') {

					this.blankText = String.format(
							commonbundle['ERR_MANDATORY'], this.fieldLabel);

					if (Ext.isEmpty(this.fieldLabel)) {
						this.fieldLabel = '?' + this.fieldLabel + '?'
								+ '<span class = \'cbx-mandatory-fx\'">**</span>';// CHG001-CSS
																					// changes

					} else {
						this.fieldLabel = this.fieldLabel
								+ '<span class = \'cbx-mandatory-fx\'">**</span>';// CHG001-CSS
																					// changes
					}
				}
				/**
				 * If the required attribute is Y,components field label will be
				 * field label associated with mandatory star and the field will
				 * not allow blank values.
				 */
				else if (this.required === 'Y') {

					this.blankText = String.format(
							commonbundle['ERR_MANDATORY'], this.fieldLabel);
				if(this.lookup){
				this.allowBlank=true;
					} else {
				this.allowBlank=false;				
						}
					if (Ext.isEmpty(this.fieldLabel)) {
						this.fieldLabel = '?' + this.fieldLabel + '?'
								+ '<span class = \'mandatory\'">*</span>';

					} else {
						this.fieldLabel = this.fieldLabel
								+ '<span class = \'mandatory\'">*</span>';
					}

				} else {

					this.blankText = String.format(
							commonbundle['ERR_MANDATORY'], this.fieldLabel);

					if (Ext.isEmpty(this.fieldLabel)) {
						this.fieldLabel = '?' + this.fieldLabel + '?'
								+ '<span class = \'non_mandatory\'"></span>';

					} else {
						this.fieldLabel = this.fieldLabel
								+ '<span class = \'non_mandatory\'"></span>';
					}
				}
		this.labelSeparator = '';
		this.style = 'word-wrap: break-word;overflow:hidden;font-weight: normal;',	
		this.height = this.customHeight || 32;	
		this.realValue = this.valueInd;
		if (this.valueInd) {
			this.setValue(this.valueInd);
		}
		else {
			this.setValue = '--';
		}
			
	},
	isVisible : function(){
		return cbx.formElement.DisplayField.superclass.isVisible.apply(this, arguments);  
	},
	// This method will be called on every events which can alter the display value.
	updateformattedVal:function() {     
		var formattedVal="";  
		if(this.realValue == '--' || this.getValue()=='--'){
			return;
		}					
		if(this.el){
			Ext.QuickTips.unregister(this.el);
			if(Ext.isEmpty(this.realValue)){
			this.el.dom.innerHTML = "--";
			}
			formattedVal = this.formatDisplayValue(this.realValue);
			this.el.dom.innerHTML = formattedVal.replace(/\s/g,'&nbsp;');
			if(this.realValue != formattedVal){
				this.applyToolTip(this.realValue); 
			}			
		}
		
	},
	formatDisplayValue : function(realVal){		
		realVal = realVal +"";
		var widthDisp =this.charWidth*realVal.length;
		var dispVal="--";
		var elemWidth=this.el.getWidth();
		if(widthDisp > ((2*elemWidth)-20)){
			if(this.el){
			dispVal = this.getStringForWidthEl(realVal,((2*elemWidth)-20),this.el);
			}else{
			dispVal = this.getStringForWidth(realVal,((2*elemWidth)-20));
			}
		}else{
			dispVal = realVal;
		}
		return dispVal;
	},
	
		
		/**
		 * This method should be used only if the space allocated for this particular string is not
		 * sufficient for its proper rendering. The method will return the string which can be fit
		 * in that particular space with inclusion ellipsis characters. This also should be used incase
		 * of grid rendering as that is the place where we dont have a proper element while rendering.
		 */
		getStringForWidth : function(val,valWidth,metadata){
		var ELLIPSIS_NOTATION = '...';	
			var text_metrics;		
			var hiddenLabel = new Ext.form.Label({ 
			           text: val, 
			           renderTo: document.body, 
			           css: metadata ? metadata.css : ''
			        });
			text_metrics = Ext.util.TextMetrics.createInstance(hiddenLabel.el);			
			var theneededIndex = 0 ;
			for(var index = 0; index < val.length; index++){
				var tempWidth = text_metrics.getWidth(val.substring(0,index));	
				if(tempWidth < valWidth){
					theneededIndex = index;
				}else{
					break;
				}
			}
			hiddenLabel.destroy();
			return val.substring(0,theneededIndex-3).concat(ELLIPSIS_NOTATION);
		},
		/**
		 * The method will serve the purpose same as the above, but this time we will have the
		 * element wrapper for the underlying DOM node. If the element passed being null, we will
		 * take the css applied
		 *  
		 */
		getStringForWidthEl : function(val,valWidth,nodeel){
			var ELLIPSIS_NOTATION = '...';		
			var theneededIndex = 0 ;
			for(var index = 0; index <= val.length; index++){
			var tempWidth = parseInt(this.charWidth)*(val.substring(0,index)).length;	
				if(Number(tempWidth) < Number(valWidth)){
					theneededIndex = index;					
				}else{
					break;
				}
			}
			if(theneededIndex == val.length){
				return val;
			}else{	
				return val.substring(0,theneededIndex-3).concat(ELLIPSIS_NOTATION);
			}
		},
		applyToolTip : function(text){	
                Ext.QuickTips.register({
                    target:  this.el, 
                    text: text,
                    cls:'x-tip-body',
                    enabled: true
                });            
	},
	afterRender : function(){	
		this.updateScreenViewData(this);
		this.setValue = this.setValue.createSequence(this.updateformattedVal); 		
        cbx.formElement.DisplayField.superclass.afterRender.call(this);    
		
     },	 
	  onResize:function(){		
		this.updateformattedVal();
	},
	 setValue : function(v) {	  
		this.realValue=(Ext.isEmpty(v) ? '--' : v);
		cbx.formElement.DisplayField.superclass.setValue.call(this, this.realValue);
		this.updateScreenViewData(this);
	},
	getScreenViewData:function()
	{
		return this.getValue();
	}
});

Ext.reg('cbx-displayfield', cbx.formElement.DisplayField);
Ext.reg('cbx-staticfield', cbx.formElement.DisplayField);
//CBXQ2FW111 Ends

//CHG2409_59873_Starts
/**
 * This class, an extension of Ext.form.TextField class, has been created for RATE_FIELD in EDIT mode. Item no. 55.
 * This component appends the symbol '%' to represent the rate. But the actual value is the number itself and does not contain '%'.
 */
cbx.formElement.RateField = function(config) {
	this.plainLabel = config.plainLbl;
	this.fieldLabel = config.displayNmKey;
	this.name = config.itemId;
	this.value = config.model.getModelData()[config.itemId];
	this.required = config.requiredInd;
	this.conditional = config.conditionalInd; 
	this.readOnly = config.readOnlyInd === 'Y' ? true : false;
	this.hidden = config.visibleInd === 'Y' ? false : true;
	cbx.formElement.RateField.superclass.constructor.call(this, config);
};

Ext.extend(
				cbx.formElement.RateField,
				Ext.form.TextField,
				{
					/**
					 * @cfg {String/Object} required ,to specify whether this
					 *      field is mandatory (defaults to N)
					 */
					required : 'N',
					conditional : 'N',
					 maxLength : 'undefined', 

					   // changed for dynamic amount values
					 integrallength : false, 
					   
					   // changed for dynamic amount values
					  decimallength : false, 
					/**
					 * @cfg {Object} bundleKey ,key used by resource to lookup
					 *      bundle(defaults to '')
					 */
					bundleKey : '',
					// this will specify the number of sif=gnificant digits
					// after the decimal
					// point
					// for the amount.This will depends on currency and to be
					// provided by the
					// application. Defaults to 2
					signdigits : 2,

					plainLabel : '',

					plainValue : '',

					cls : 'textfield-width',
					// private
					initComponent : function() {
						cbx.formElement.RateField.superclass.initComponent
								.apply(this, arguments);
						var bundle;
						var commonbundle = CRB.getFWBundle();
						// To get the bundle key reference
						bundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));
						/**
						 * If the plainLabel attribute is not null ,component's
						 * field label will be the plain-label else the label
						 * associated with bundle keys will be referred to get
						 * the field label.
						 */
						if (!Ext.isEmpty(this.plainLabel)) {
							this.fieldLabel = this.plainLabel;

						} else {
							this.fieldLabel = bundle['LBL_' + this.fieldLabel];
						}
						// In portal allowed maximum length for an amount will
						// be 28 digits
						// before
						// decimal point and 5 points after like ,
						// xxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxx
						

						/*
						 * this.maxLength = 34; this.integrallength = 28;
						 * this.decimallength = 5;
						 */
							if(this.decimallength === 0){
								this.decimallength = 0;
							}else{
								this.decimallength = this.decimallength || 5;
							}
							this.integrallength = this.integrallength || 28;
							
							if(this.integrallength && this.decimallength){
								this.maxLength = Number(this.decimallength) + Number(this.integrallength) + 1 || 34;
							}

							
						if (bundle != null) {
							if (this.fieldLabel)
								this.plainLabel = this.fieldLabel;
							if (this.conditional === 'Y') {
								this.blankText = String.format(
										commonbundle['ERR_MANDATORY'],
										this.fieldLabel);
								this.fieldLabel = this.fieldLabel
										+ '<span class = \'cbx-mandatory-fx\'">**</span>';// CHG001-CSS
																							// changes
							} else if (this.required === 'Y') {
								this.blankText = String.format(
										commonbundle['ERR_MANDATORY'],
										this.fieldLabel);
								this.fieldLabel = this.fieldLabel
										+ '<span class = \'mandatory\'">*</span>';
								this.allowBlank = false;
							} else
								this.fieldLabel = this.fieldLabel
										+ '<span class = \'non_mandatory\'"></span>';
						} else {
							if (this.conditional === 'Y') {
								this.fieldLabel = this.fieldLabel
										+ '<span class = \'cbx-mandatory-fx\'">**</span>';// CHG001-CSS
																							// changes
								
							} else if (this.required === 'Y') {
								this.fieldLabel = this.fieldLabel
										+ '<span class = \'mandatory\'">*</span>';
								this.allowBlank = false;
							} else {
								this.fieldLabel = '' + this.fieldLabel + '';
							}
						}
						if (bundle != null) {
							

					this.maxLengthText = String

							.format(

									commonbundle['ERR_MAXLENGTH_EXCEED_AMOUNT'],

									this.plainLabel,

									parseInt(this.integrallength)+parseInt(1),

									this.decimallength);

					
						}
						this.maskRe = /[0-9.,]/;

						this.anchor = (this.anchor == undefined) ? ''
								: this.anchor;
						this.labelSeparator = '';
						
						/**
						 * listening to chnage event for amountfield to do set
						 * the value and update the model
						 */
						this.on('change', function(obj) {
							this.setValue(obj.getValue())
							this.syncModelData();							
						});
					},
					// After setting the value delegate the next execution to
					// updateHidden method
					checkFormatter : function(obj) {
						val = obj.getValue().trim();
						var that = this;
						var crb = CRB.getFWBundle();
						var res = that.checkAmountInsideMaxLength(that
								.getValue());
						if (res === 'invalid') {
							return;
						}
						if (!res) {
							that.markInvalid(that.maxLengthText);
							return;
						}
						if (val === '') {
							if (that.required === 'Y')
								that.markInvalid(String.format(
										['ERR_MANDATORY'], that.plainLabel));
							return;
						} else {
							// that.clearInvalid(); 
							val = obj.getValue().trim();
							var StringNumber = canvas.amountFormatter.getInstance();
							this
									.setValue(StringNumber.b(val.replace(
											/,|%/g, ""), this.signdigits));

						}
						if (that.checkAmountInsideMaxLength(that.getValue())) {
							that.clearInvalid();
						}
					},
					/*
					 * Ovverriding the vaidate function to avoid the invalid
					 * icon to get disappeared on losing focus,if the field is
					 * invalid
					 */
					validate:function(){
						
						if (!this.disabled && (this.el.dom.className.indexOf('errorBg')!=-1 || this.el.dom.className.indexOf(this.invalidClass) != -1)) {	
							return false;
						}
						if(this.disabled || this.validateValue(this.processValue(this.getValue()))){ 
				            this.clearInvalid();
				            return true;
				        }
				        return false;
					},
					checkAmountInsideMaxLength : function(val) {
						var maxDigits = this.integrallength; 
					 	var maxDecimals = this.decimallength;  
						var amount_arr = val.split('.');
						if (amount_arr.length == 2) {
							if ((amount_arr[0].length <= maxDigits)
									&& (amount_arr[1].length <= maxDecimals)) {
								return true;
							} else {
								return false;
							}
						} else if (amount_arr.length == 1) {
							if (amount_arr[0].length <= maxDigits) {
								return true;
							} else {
								return false;
							}
						} else {
							this.markInvalid(CRB.getFWBundle() && CRB.getFWBundle()['ERR_INVALID_FIELD'] ? CRB.getFWBundle()['ERR_INVALID_FIELD']:'ERR_INVALID_FIELD');// CHG_FF_ENH
							return 'invalid';
						}
					},
					afterRender : function() {
						cbx.formElement.RateField.superclass.afterRender
								.apply(this, arguments);
						if (this.error) {
							this.dataErrorHandler();
						}
					},
					// Error handling method to display error indicator on field
					// validation.
					dataErrorHandler : function() {
						if (this.error)
							this.markInvalid(CRB.getFWBundle() && CRB.getFWBundle()['ERR_INVALID_AMOUNT'] ? CRB.getFWBundle()['ERR_INVALID_AMOUNT']:'ERR_INVALID_AMOUNT');	// CHG_FF_ENH
						this.error = false;
						return;

					},
					updateHidden : function() {

						var val = this.getValue();
						val = val.replace(/,|%/g, "");
						this.plainValue = val;
						this.syncModelData();
						if (this.error) {
							this.dataErrorHandler();
						}
					},
					/**
					 * Overriding the reset method because the orginal method
					 * calls the setValue of this field with empty value which
					 * fails due to this field specific implementation in
					 * setValue.
					 */

					

					reset : function(){

						

						cbx.formElement.RateField.superclass.setValue.call(this, '');

						

				        this.clearInvalid();

				    },
				   /**
					 * Overriding the setValue method doing format check and
					 * further validation before setting the value
					 */
				    /**
					 * Added a new api to update the signdigits
					 * based on the currency. - get the currency linked with the
					 * component through the linked source curr. - if currency
					 * is not available, get it from the preference. - if the
					 * currency is also not found in preference, get it from the
					 * orbionedirect.properties file. - using the currency, get
					 * the decimal place values from the cache through
					 * iportal.GlobalCurrency.metadata.jsp.Finally updates the
					 * this.signdigits.
					 */
				    
				    updateSignDigits: function(config){
				    	var currDecimalPlaceList = cbx.globalcurrency.metadata.getCurrDecimalPlaceList();
				    	var currcmp = this.linkedCurrComp;
				    	var curr;
				    	if (!Ext.isEmpty(currcmp)) {
				    		curr=this.initialConfig.model.getValue(currcmp);
				    		
				    	}
				    	if(Ext.isEmpty(curr)){
							// get the default curr from preference.
							curr = iportal.systempreferences.getDefaultBankCCY();
							if(Ext.isEmpty(curr)){
								// get the default curr configured in the
								// orbidirect properties.
								curr = cbx.globalcurrency.metadata.getDefaultCurrency();
							}
						}
				    	if(!Ext.isEmpty(curr)){
							var currList=Ext.decode(currDecimalPlaceList);
							if(!cbx.isEmpty(currList)){
							var currBasedDecimal = currList[curr];
							this.signdigits = currBasedDecimal;
							}
						}
					},
				setValue : function(value) {
						
						this.updateSignDigits(); 	// calling the api
													// to update the
													// this.signdigits.
						

							try{
								
								if(value!=null  && value!=''){
								val = value.trim();
								val=val.replace(/,|%/g, "");
								}else{
									val=null;
								}
							}
							  
								catch(err){
									val='';
								}
								
								var that = this;
								var crb = CRB.getFWBundle();
								if (val===null || val==='' ) {
									cbx.formElement.RateField.superclass.setValue
									.call(that, val);
									if (that.required === 'Y'){
										that.markInvalid(String.format(
												crb['ERR_MANDATORY'], that.plainLabel));
									}else{
									that.clearInvalid();
									}
									return;
								}
								
						

							

						var valToSet=val.replace(/,|%/g, "");// Need
															// to update the
															// model without
															// comma seperator

						var that = this;

						var crb = CRB.getFWBundle();

						var res = that.checkAmountInsideMaxLength(val);

						if (res === 'invalid') {

							

							cbx.formElement.RateField.superclass.setValue

							.call(this, val);

							this.markInvalid(CRB.getFWBundle() && CRB.getFWBundle()['ERR_INVALID_AMOUNT'] ? CRB.getFWBundle()['ERR_INVALID_AMOUNT']:'ERR_INVALID_AMOUNT');	// CHG_FF_ENH

							return;

							

						}

						if (!res) {

							

							cbx.formElement.RateField.superclass.setValue

							.call(this, val);

							

							that.markInvalid(that.maxLengthText);

							return;

						}

						if (val === '') {

							if (that.required === 'Y')

							cbx.formElement.RateField.superclass.setValue

								.call(this, val);

								that.markInvalid(String.format(

										crb['ERR_MANDATORY'], that.plainLabel));

							return;

						} else {

							that.clearInvalid();

							var StringNumber = canvas.amountFormatter.getInstance();

							val=StringNumber.basicFormatter(valToSet, this.signdigits);
							
							val=val+"%";
						}

						if (that.checkAmountInsideMaxLength(val.replace(/,|%/g, ""))) { 

							that.clearInvalid();

						}

						

						this.model.updateField(this.name,valToSet); //Need
																	// to update
																	// the model
																	// without
																	// comma
																	// seperator

					cbx.formElement.RateField.superclass.setValue

								.call(this, val);

					},
					getValue : function() {
						var val = cbx.formElement.RateField.superclass.getValue
								.apply(this, arguments);
						return val.replace(/,|%/g, "");
					},
					getRawValue : function() {

						
						return this.getValue();
					},
					setFormattedValue : function(val) {
						if (val) {
							var StringNumber = canvas.amountFormatter.getInstance();
							this
									.setValue(StringNumber.basicFormatter(val.replace(/,|%/g, ""), this.signdigits));
						}
					},
					syncModelData : function() {
						this.model.updateValue(this.name, this.getValue()); 
					},
					isVisible : function() {
						return cbx.formElement.RateField.superclass.isVisible
								.apply(this, arguments);
					},
					format : function() {
						var val = this.getValue();
						var StringNumber = canvas.amountFormatter.getInstance();
						this
								.setValue(StringNumber.basicFormatter(val.replace(/,|%/g,
										""), this.signdigits));
					}

				});


Ext.reg('cbx-ratefield', cbx.formElement.RateField);

/** Mandatory notes -- Starts */

/**
 * This component is used to show the mandatory note.
 */
cbx.formElement.cbxMandatoryText=function(config) {

	this.name = config.itemId;	

	this.plainLabel = config.plainLbl;

	this.displayNmKey = config.displayNmKey;

	this.hidden = config.visibleInd === 'Y' ? false : true;

	this.value = config.model.getModelData()[config.itemId];
	
	cbx.formElement.cbxMandatoryText.superclass.constructor.call(this, config);

};

/**
 * 
 */
Ext.extend(cbx.formElement.cbxMandatoryText,Ext.BoxComponent, {	

	initComponent : function() {
		
		//CBXFW_DIT_77 starts
		this.on('hide',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'N']));
		this.on('show',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'Y']));
		//CBXFW_DIT_77 ends
		
		var bundle;

		var commonbundle = CRB.getFWBundle();

		// To get the bundle key reference

		// bundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));

		// this.linkText = '';
		this.mandatoryText=commonbundle['LBL_MANDATORY_NOTE_PREFIX']+':'+'(<span style="color: #FF0000;"> * </span>)'+commonbundle['LBL_MANDATORY_NOTE_SUFFIX'];
		
		// Will not be disabled, Should available to click.
		
		this.disabled = false;
		
		// will not be hidden, should be visible.
				
		this.labelSeparator = '';
		
		this.hideLabel = true;
		
		var that= this;
		
		var defaultConfig = {

					id : this.itemId,
					
					cls :'cbx-formfw-mandlabel',
					
					autoEl:{
						
					    cn: this.mandatoryText
					    
					}
				};

				Ext.apply(this, defaultConfig);
		
		cbx.formElement.cbxMandatoryText.superclass.initComponent.apply(

					this, arguments);
		
		// this.on('click', this.handleClickEvent);

	}
});
Ext.reg('cbx-mandatoryText',cbx.formElement.cbxMandatoryText);



/** conditonal Mandatory notes -- Starts */

/**
 * This component is used to show the conditional mandatory note.
 */
cbx.formElement.cbxConditionalMandatoryText=function(config) {

	this.name = config.itemId;	

	this.plainLabel = config.plainLbl;

	this.displayNmKey = config.displayNmKey;

	this.hidden = config.visibleInd === 'Y' ? false : true;

	this.value = config.model.getModelData()[config.itemId];
	
	cbx.formElement.cbxConditionalMandatoryText.superclass.constructor.call(this, config);

};

/**
 * 
 */
Ext.extend(cbx.formElement.cbxConditionalMandatoryText,Ext.BoxComponent, {	

	initComponent : function() {	
		
		//CBXFW_DIT_77 starts
		this.on('hide',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'N']));
		this.on('show',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'Y']));
		//CBXFW_DIT_77 ends
		
		var bundle;

		var commonbundle = CRB.getFWBundle();

		// To get the bundle key reference

		bundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));

		// this.linkText = '';
		// this.mandatoryText='NOTE:'+'(<span style="color: #0000FF;"> **
		// </span>)'+'Indicates Conditional Mandatory field';
		this.mandatoryText=commonbundle['LBL_MANDATORY_NOTE_PREFIX']+':'+'(<span style="color: #0000FF;"> ** </span>)'+commonbundle['LBL_COND_MANDATORY_NOTE_SUFFIX'];
		// Will not be disabled, Should available to click.
		
		this.disabled = false;
		
		// will not be hidden, should be visible.
				
		this.labelSeparator = '';
		
		this.hideLabel = true;
		
		var that= this;
		
		var defaultConfig = {

					id : this.itemId,
					
					cls :'cbx-formfw-mandlabel',
					
					autoEl:{
						
					    cn: this.mandatoryText
					    
					}
				};

				Ext.apply(this, defaultConfig);
		
		cbx.formElement.cbxConditionalMandatoryText.superclass.initComponent.apply(

					this, arguments);
		
		// this.on('click', this.handleClickEvent);

	}
});
Ext.reg('cbx-conditionalMandatoryText',cbx.formElement.cbxConditionalMandatoryText);
/** DIT_80 --ends */
/*DIT_108 starts*/
/**
 * This class, an extension of Ext.form.TextField class, has been created for RATE_FIELD in view mode. Item no. 55.
 * This component appends the symbol '%' to represent the rate. But the actual value is the number itself and does not contain '%'.
 */
cbx.formElement.DisplayRateField = function(config) {
	this.plainLabel = config.plainLbl;
	this.fieldLabel = config.displayNmKey;
	this.value = config.model.getModelData()[config.itemId];
	this.name = config.itemId;
	this.required = config.requiredInd;
	this.conditional = config.conditionalInd;
	this.hidden = config.visibleInd === 'Y' ? false : true;
	cbx.formElement.DisplayRateField.superclass.constructor.call(this, config);
};

Ext.extend(cbx.formElement.DisplayRateField, Ext.form.TextField, {
	/**
	 * @cfg {String/Object} required ,to specify whether this field is mandatory
	 *      (defaults to false)
	 */
	required : 'N',

	/**
	 * @cfg {Object} bundleKey ,key used by resource to lookup bundle(defaults
	 *      to '')
	 */
	bundleKey : '',

	signdigits : 2,
	plainValue : '',

	// private
	initComponent : function() {
		this.allowBlank = true;
		this.maxLength = undefined;
		this.minLength = undefined;
		cbx.formElement.DisplayRateField.superclass.initComponent.apply(this,
				arguments);
		var bundle;
		var commonbundle = CRB.getFWBundle();
		// To get the bundle key reference
		bundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));
		/**
		 * If the plainLabel attribute is not null ,component's field label will
		 * be the plain-label else the label associated with bundle keys will be
		 * referred to get the field label.
		 */
		if (!Ext.isEmpty(this.plainLabel)) {
			this.fieldLabel = this.plainLabel;

		} else {
			this.fieldLabel = bundle['LBL_' + this.fieldLabel];
		}
	    
	
		/**
		 * If the conditional attribute is Y the components field label will be
		 * field label associated with two stars
		 */
		if (this.conditional === 'Y') {

			this.blankText = String.format(commonbundle['ERR_MANDATORY'],
					this.fieldLabel);

			if (Ext.isEmpty(this.fieldLabel)) {
				this.fieldLabel = '?' + this.fieldLabel + '?'
						+ '<span class = \'cbx-mandatory-fx\'">**</span>';

			} else {
				this.fieldLabel = this.fieldLabel
						+ '<span class = \'cbx-mandatory-fx\'">**</span>';
			}
		}
		/**
		 * If the required attribute is Y,components field label will be field
		 * label associated with mandatory star and the field will not allow
		 * blank values.
		 */
		else if (this.required === 'Y') {

			this.allowBlank = false;
			if (Ext.isEmpty(this.fieldLabel)) {
				this.fieldLabel = '?' + this.fieldLabel + '?'
						+ '<span class = \'mandatory\'">*</span>';

			} else {
				this.fieldLabel = this.fieldLabel
						+ '<span class = \'mandatory\'">*</span>';
			}

		} else {

			this.blankText = String.format(commonbundle['ERR_MANDATORY'],
					this.fieldLabel);

			if (Ext.isEmpty(this.fieldLabel)) {
				this.fieldLabel = '?' + this.fieldLabel + '?'
						+ '<span class = \'non_mandatory\'"></span>';

			} else {
				this.fieldLabel = this.fieldLabel
						+ '<span class = \'non_mandatory\'"></span>';
			}
		}
		this.anchor = (this.anchor == undefined) ? '' : this.anchor;
		this.labelSeparator = '';
		this.style = 'border:none; background: transparent;';
		this.readOnly = true;
		if (this.value) {
			
				var StringNumber = canvas.amountFormatter.getInstance();
				this.value = StringNumber.basicFormatter(this.value.replace(/,|%/g, ""), this.signdigits);
				if(cbx.isEmpty(this.value)) {
					this.value = '--';
				}
			} else {
				this.value = '--';
			}

	},
	afterRender : function() {
		cbx.formElement.DisplayRateField.superclass.afterRender.apply(this,
				arguments);
		// Setting the plainValue based on if value exists
		if (this.value) {
			this.plainValue = this.value.replace(/,|%/g, "");

		} else {
			this.plainValue = '';
		}
	},

	getValue : function() {
		var val = cbx.formElement.DisplayRateField.superclass.getValue.apply(
				this, arguments);
		return val.replace(/,|%/g, "");
	},
    /**
	 * api to update the signdigits based on the
	 * currency. - get the currency linked with the component through the linked
	 * source curr. - if currency is not available, get it from the preference. -
	 * if the currency is also not found in preference, get it from the
	 * orbionedirect.properties file. - using the currency, get the decimal
	 * place values from the cache through
	 * iportal.GlobalCurrency.metadata.jsp.Finally updates the this.signdigits.
	 */    
	updateSignDigits: function(config){
    	var currDecimalPlaceList = cbx.globalcurrency.metadata.getCurrDecimalPlaceList();
    	var currcmp = this.linkedCurrComp;
    
    	// this is the ID of the component that will hold the currency.
    	var curr;
    	if (!Ext.isEmpty(currcmp)) {
    		
    		// curr = this.fm.model.getValue(currcmp);
    		curr=this.initialConfig.model.getValue(currcmp);
    		
    		
    	}
    	if(Ext.isEmpty(curr)){
			// get the default curr from preference.
			curr = iportal.systempreferences.getDefaultBankCCY();
		
			if(Ext.isEmpty(curr)){
				// get the default curr configured in the orbidirect properties.
				curr = cbx.globalcurrency.metadata.getDefaultCurrency();
			
			}
		}
		
    	if(!Ext.isEmpty(curr)){
			var currList=Ext.decode(currDecimalPlaceList);
			if(!cbx.isEmpty(currList)){
			var currBasedDecimal = currList[curr];
			}
			
			this.signdigits = currBasedDecimal; 
		}
	},
	setValue : function(v) {
		
		 this.updateSignDigits(); 
		 if(v){
				var StringNumber = canvas.amountFormatter.getInstance();
				var value = StringNumber.basicFormatter(v.replace(/,|%/g, ""), this.signdigits);
				if(!cbx.isEmpty(value)){
					this.setRawValue(value+"%");
				}
				else
					{
					this.setRawValue('--');
					}

			}

		this.model.updateField(this.name, this.getValue());// If setValue

															// method is called

															// it should update

															// the value in the

															// model also

	},
	isVisible : function() {
		return cbx.formElement.DisplayRateField.superclass.isVisible.apply(
				this, arguments);
	}
});
Ext.reg('cbx-displayratefield', cbx.formElement.DisplayRateField);


// Single checkbox component starts

cbx.formElement.checkbox = function (config){
	this.plainLabel = config.plainLbl;
	this.fieldLabel = config.displayNmKey;
	this.hidden = config.visibleInd === 'Y' ? false : true;
	if (!Ext.isEmpty(config.multiInd) && config.multiInd == true && !Ext.isEmpty(config.index)) {
		this.values = config.model.getModelData()[config.multiFormId][config.itemId][config.index] || '';
	} else {
		this.values = config.model.getModelData()[config.itemId] || '';
	}
	this.required = config.requiredInd;
	this.readOnly = config.readOnlyInd === 'Y' ? true : false;
	this.conditional = config.conditionalInd;
	this.name = config.itemId;
	this.rawKeys = config.rawKeys;
	this.rawValues = config.rawValues;
	this.preConfig = config.preConfig || '';
	cbx.formElement.checkbox.superclass.constructor.call(this, config);
};

Ext.extend(cbx.formElement.checkbox, cbx.formElement.checkboxgroup, {
		blankText : 'Please select',
		defaultType : 'checkbox',
		required : 'N',
		conditional : 'N',
		valuesArray : [],
		labelStyle : 'padding-left:0px !important',
		elementStyle : 'padding-left:0px !important',
		plainLabel : '',
		fieldLabel : '',
		initComponent : function (){
			this.on('hide', Ext.createDelegate(this.updateVisibilityInSV, this, [ this, 'N' ]));
			this.on('show', Ext.createDelegate(this.updateVisibilityInSV, this, [ this, 'Y' ]));
			cbx.formElement.checkbox.superclass.initComponent.call(this, arguments);
		},
		syncModelData : function (value){
			if (!Ext.isEmpty(this.multiInd) && this.multiInd == true && !Ext.isEmpty(this.index)) {
				if (Ext.isEmpty(this.getValue())) {
					this.model.updateValue(this.name, '', undefined, this.index, this.multiFormId);
				} else {
					this.model.updateValue(this.name, this.getValue().toString(), undefined, this.index, this.multiFormId);
				}
			} else {
				if (Ext.isEmpty(this.getValue())) {
					this.model.updateValue(this.name, '');
				} else {
					this.model.updateValue(this.name, this.getValue().toString());
				}
				this.updateScreenViewData(this);
			}
		}
	});
	Ext.reg('cbx-checkbox', cbx.formElement.checkbox);
	
	Ext.ux.ClickToolTip = Ext.extend(Ext.ToolTip,{
		initTarget : function(target){ 
		var t; 
		if((t = Ext.get(target))){ 
		if(this.target){
		var tg = Ext.get(this.target);
		//this.mun(tg, 'click', this.onTargetOver, this);
		this.mun(tg, 'mouseover', this.onTargetOver, this);
		this.mun(tg, 'mouseout', this.onTargetOut, this);
		this.mun(tg, 'mousemove', this.onMouseMove, this);
		}
		this.mon(t, {
		mouseover: this.onTargetOver,
		//click: this.onTargetOver,
		mouseout: this.onTargetOut,
		mousemove: this.onMouseMove,
		scope: this
		});
		this.target = t;
		}
		if(this.anchor){
		this.anchorTarget = this.target;
		}
		}
		});
	Ext.reg('ux.ClickToolTip', Ext.ux.ClickToolTip);
	
	
cbx.formElement.cbxImage = function(config) {
	this.plainLabel = config.plainLbl;
	this.fieldLabel = config.displayNmKey;
	this.name = config.itemId;
	this.readOnly = config.readOnlyInd === 'Y' ? true : false;
	this.hidden = config.visibleInd === 'Y' ? false : true;
	cbx.formElement.cbxImage.superclass.constructor.call(this, config);
};
Ext.extend(cbx.formElement.cbxImage,Ext.BoxComponent,
		{
	src : Ext.BLANK_IMAGE_URL,
	imgWidth:'147px',
	imgHeight:'147px',
    
    /**
     * @cfg
     */
   
    
    /**
 * Inits this component with the specified config-properties and automatically
 * creates its components.
 */
    initComponent: function () {   
   
    	 
    	 var bundle;
 		// To get the bundle key reference
 		bundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));
 		/**
 		 * If the plainLabel attribute is not null ,component's field label will
 		 * be the plain-label else the label associated with bundle keys will be
 		 * referred to get the field label.
 		 */
 		
    	if (!Ext.isEmpty(this.plainLabel)) {
			this.fieldLabel = this.plainLabel;

		} else {
			this.fieldLabel = bundle['LBL_' + this.fieldLabel];
		}
    	
    	
 	    this.autoEl = { 

 	    	    cn : [{tag: 'img',cls:'user-image', src : this.src, alt:this.fieldLabel ,width:this.imgWidth, height:this.imgHeight}]
 	    	};
    	 
    	 
            cbx.formElement.cbxImage.superclass.initComponent.apply(this, arguments);
            
           
    		
    },
    
    /**
 * Renders the component within it's container
 */
    onRender: function(){
            cbx.formElement.cbxImage.superclass.onRender.apply(this, arguments);
            
            if(!Ext.isEmpty(this.src) && (this.src !== Ext.BLANK_IMAGE_URL)){
                    this.setSrc(this.src);
            }
            this.relayEvents(this.el, 
                    [
                            "click", "dblclick", "mousedown", "mouseup", "mouseover",
                            "mousemove", "mouseout", "keypress", "keydown", "keyup"
                    ]
            );                              
    },
    
    /**
     * Sets the src for the image component
     * @cfg {String} src the new src
     */
    setSrc: function (src) {
    	this.el.dom.firstChild.src = src;    	
    }
	
		});
Ext.reg('cbx-image', cbx.formElement.cbxImage);

// Single checkbox component ends


/**
 * Deselects a node.
 * @param {HTMLElement/Number/Record} node The node, node index or record to deselect
 */
Ext.apply(Ext.DataView.prototype, {
	deselect:function(node, suppressEvent){
    if(this.isSelected(node)){
			var node = this.getNode(node);
			this.selected.removeElement(node);
			if(this.last == node.viewIndex){
				this.last = false;
			}
			Ext.fly(node).removeClass(this.selectedClass);
			if(!suppressEvent){
				this.fireEvent('selectionchange', this, this.selected.elements);
			}
		}
	}
});

/**
 * @class Ext.form.TwinTriggerField
 * @extends Ext.form.TriggerField
 * TwinTriggerField is not a public class to be used directly.  It is meant as an abstract base class
 * to be extended by an implementing class.  For an example of implementing this class, see the custom
 * SearchField implementation here:
 * <a href="http://extjs.com/deploy/ext/examples/form/custom.html">http://extjs.com/deploy/ext/examples/form/custom.html</a>
 */
Ext.form.TwinTriggerField = Ext.extend(Ext.form.TriggerField, {
    /**
     * @cfg {Mixed} triggerConfig
     * <p>A {@link Ext.DomHelper DomHelper} config object specifying the structure of the trigger elements
     * for this Field. (Optional).</p>
     * <p>Specify this when you need a customized element to contain the two trigger elements for this Field.
     * Each trigger element must be marked by the CSS class <tt>x-form-trigger</tt> (also see
     * <tt>{@link #trigger1Class}</tt> and <tt>{@link #trigger2Class}</tt>).</p>
     * <p>Note that when using this option, it is the developer's responsibility to ensure correct sizing,
     * positioning and appearance of the triggers.</p>
     */
    /**
     * @cfg {String} trigger1Class
     * An additional CSS class used to style the trigger button.  The trigger will always get the
     * class <tt>'x-form-trigger'</tt> by default and <tt>triggerClass</tt> will be <b>appended</b> if specified.
     */
    /**
     * @cfg {String} trigger2Class
     * An additional CSS class used to style the trigger button.  The trigger will always get the
     * class <tt>'x-form-trigger'</tt> by default and <tt>triggerClass</tt> will be <b>appended</b> if specified.
     */

    initComponent : function(){
        Ext.form.TwinTriggerField.superclass.initComponent.call(this);

        this.triggerConfig = {
            tag:'span', cls:'x-form-twin-triggers', cn:[
            {tag: "img", src: Ext.BLANK_IMAGE_URL, alt: "", cls: "x-form-trigger " + this.trigger1Class},
            {tag: "img", src: Ext.BLANK_IMAGE_URL, alt: "", cls: "x-form-trigger " + this.trigger2Class}
        ]};
    },

    getTrigger : function(index){
        return this.triggers[index];
    },
    
    afterRender: function(){
        Ext.form.TwinTriggerField.superclass.afterRender.call(this);
        var triggers = this.triggers,
            i = 0,
            len = triggers.length;
            
        for(; i < len; ++i){
            if(this['hideTrigger' + (i + 1)]){
                    triggers[i].hide();
                }

        }    
    },

    initTrigger : function(){
        var ts = this.trigger.select('.x-form-trigger', true),
            triggerField = this;
            
        ts.each(function(t, all, index){
            var triggerIndex = 'Trigger'+(index+1);
            t.hide = function(){
                var w = triggerField.wrap.getWidth();
                this.dom.style.display = 'none';
                triggerField.el.setWidth(w-triggerField.trigger.getWidth());
                triggerField['hidden' + triggerIndex] = true;
            };
            t.show = function(){
                var w = triggerField.wrap.getWidth();
                this.dom.style.display = '';
                triggerField.el.setWidth(w-triggerField.trigger.getWidth());
                triggerField['hidden' + triggerIndex] = false;
            };
            this.mon(t, 'click', this['on'+triggerIndex+'Click'], this, {preventDefault:true});
            t.addClassOnOver('x-form-trigger-over');
            t.addClassOnClick('x-form-trigger-click');
        }, this);
        this.triggers = ts.elements;
    },

    getTriggerWidth: function(){
        var tw = 0;
        Ext.each(this.triggers, function(t, index){
            var triggerIndex = 'Trigger' + (index + 1),
                w = t.getWidth();
            if(w === 0 && !this['hidden' + triggerIndex]){
                tw += this.defaultTriggerWidth;
            }else{
                tw += w;
            }
        }, this);
        return tw;
    },

    // private
    onDestroy : function() {
        Ext.destroy(this.triggers);
        Ext.form.TwinTriggerField.superclass.onDestroy.call(this);
    },

    /**
     * The function that should handle the trigger's click event.  This method does nothing by default
     * until overridden by an implementing function. See {@link Ext.form.TriggerField#onTriggerClick}
     * for additional information.
     * @method
     * @param {EventObject} e
     */
    onTrigger1Click : Ext.emptyFn,
    /**
     * The function that should handle the trigger's click event.  This method does nothing by default
     * until overridden by an implementing function. See {@link Ext.form.TriggerField#onTriggerClick}
     * for additional information.
     * @method
     * @param {EventObject} e
     */
    onTrigger2Click : Ext.emptyFn
});
Ext.reg('trigger', Ext.form.TriggerField);


/**
 * @class cbx.formElement.multiSelectComboBox
 * @extends cbx.formElement.combobox
 * <p>A combobox control with multiselect support</p>
 * <p>A ComboBox works in a similar manner to a traditional HTML &lt;select> field. The difference is
 * that to submit the {@link #valueField}, you must specify a {@link #hiddenName} to create a hidden input
 * field to hold the value of the valueField. The <i>{@link #displayField}</i> is shown in the text field
 * which is named according to the {@link #name} and the most likely events are select and change.
 */

cbx.formElement.multiSelectComboBox = function(config){
	if (config.transform && typeof config.multiSelect == 'undefined'){
		var o = Ext.getDom(config.transform);
		config.multiSelect = (Ext.isIE ? o.getAttributeNode('multiple').specified : o.hasAttribute('multiple'));
	}
	if (config.multiSelect){
		config.selectOnFocus = false;
	}
	config.hideTrigger2 = config.hideTrigger2||config.hideTrigger;
	this.plainLabel = config.plainLbl;
	this.fieldLabel = config.displayNmKey;
	this.name = config.itemId;
	this.addData = config.addData;
	this.parentId = config.parentId;
	this.cls = config.cls || '';
	
	if (this.addData != null) {
		if(!Ext.isEmpty(config.multiFormId) && !Ext.isEmpty(config.index)){
			this.value = config.model.getModelData()[config.multiFormId][config.itemId][config.index];
		}else{
			this.value = config.model.getModelData()[config.itemId];	
		}
	} else {
		if(!Ext.isEmpty(config.multiFormId) && !Ext.isEmpty(config.index)){
			this.value = config.model.getModelData()[config.multiFormId][config.itemId][config.index];
		}else{
			this.tempValue = config.model.getModelData()[config.itemId][config.itemId][config.index];	
		}
	}

	this.required = config.requiredInd;
	this.conditional = config.conditionalInd;
	this.readOnly = config.readOnlyInd === 'Y' ? true : false;
	this.hidden = config.visibleInd === 'Y' ? false : true;
	this.includeSelect =false;
	
	cbx.formElement.multiSelectComboBox.superclass.constructor.call(this, config);
}

Ext.extend(cbx.formElement.multiSelectComboBox , cbx.formElement.ComboBox, {
	/**
	 * @cfg {Boolean} multiSelect Multiple selection is allowed (defaults to false)
	 */
	multiSelect:true,
	/**
	 * @cfg {Integer} minLength Minimum number of required items to be selected
	 */
	minLength:0,
	/**
	 * @cfg {String} minLengthText Validation message displayed when minLength is not met.
	 */
	minLengthText:'Minimum {0} items required',
	/**
	 * @cfg {Integer} maxLength Maximum number of allowed items to be selected
	 */
	maxLength:Number.MAX_VALUE,
	/**
	 * @cfg {String} maxLengthText Validation message displayed when maxLength is not met.
	 */
	maxLengthText:'Maximum {0} items allowed',
	/**
	 * @cfg {Boolean} clearTrigger Show the clear button (defaults to true)
	 */
	clearTrigger:true,
	/**
	 * @cfg {Boolean} history Add selected value to the top of the list (defaults to false)
	 */
	history:false,
	/**
	 * @cfg {Integer} historyMaxLength Number of entered values to remember. 0 means remember all (defaults to 0)
	 */
	historyMaxLength:-1,

	/**
	 * @cfg {Boolean} required ,to specify whether this field is
	 *      mandatory (defaults to N)
	 */
	required : 'N',
	/**
	 * @cfg {Boolean} required ,to specify whether this field is
	 *      conditional (defaults to N)
	 */
	conditional : 'N',
	/**
	 * @cfg {Object} bundleKey ,key used by resource to lookup
	 *      bundle(defaults to '')
	 */
	combundleKey : '',
	/**
	 * @cfg {Boolean} includeSelect ,to specify whether combobox's first
	 *      option is select or not (defaults to true)
	 */
	includeSelect : true,
	/**
	 * @cfg {String} defaultValue ,initially Selected value for this
	 *      combo(defaults to '')
	 */
	defaultValue : '',
	/**
	 * @cfg {String} rawKeys ,raw keys to be set in the combo in the
	 *      absence of bundle(defaults to null)
	 */
	rawKeys : [],
	/**
	 * @cfg {String} rawValues ,raw values to be set in the combo in the
	 *      absence of bundle(defaults to null)
	 */
	rawValues : [],
	plainLabel : '',
	fieldLabel : '',
	resizable:true,
	fireEventOnSingleSelect : true,
	/**
	 * @cfg {String} replaceEntityReference ,true to make replace entity
	 *      references in combo displayfield
	 */
	replaceEntityReference : false,
	cls : 'x-form-combo',
	// Below tpl config option provides custom template for combobox list items to display its value.
	tpl:'<tpl for="."><div  ext:qtip="{value}" class="x-combo-list-item"><span class="x-combo-checker"></span>{value}</div></tpl>',

	// private
	initComponent:function(){
		this.triggerField = true;
		this.on('hide',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'N']));
		this.on('show',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'Y']));
		//from twintrigger
		this.triggerConfig = {
					tag:'span', cls:'x-form-twin-triggers', cn:[			

					                                            {tag: "img", src: Ext.BLANK_IMAGE_URL, cls: "x-form-trigger " + this.trigger1Class,style:"display:none"},
					                                            {tag: "img", src: Ext.BLANK_IMAGE_URL, cls: "x-form-trigger " + this.trigger2Class},
					                                            {tag:"span",cls:"x-combo-count"}

					                                            ]
		};


		this.on('select', function(obj) {
			this.mandatoryValidator(obj.value);											
			this.syncModelData();
		});


		cbx.formElement.multiSelectComboBox.superclass.initComponent.call(this);
		if (this.multiSelect){
			this.typeAhead = false;
			this.editable = false;
			this.triggerAction = 'all';
		}
		this.valueArray =[];
		if(this.getValue().length!=0)
		{
			this.valueArray.push(this.getValue());
		}
	},

	hideTrigger1:true, //Initially the cancel icon is hidden and will be viewed for minimum of one selected value

	getTrigger:Ext.form.TwinTriggerField.prototype.getTrigger,

	initTrigger:Ext.form.TwinTriggerField.prototype.initTrigger,

	trigger1Class:'x-form-clear-trigger', //cancel or close icon class

	/**
	 * The function that should handle the trigger's click event.  This method does nothing by default
	 * until overridden by an implementing function. See {@link Ext.form.TriggerField#onTriggerClick}
	 * for additional information.
	 * @method
	 * @param {EventObject} e
	 */
	onTrigger2Click:function(){
		if(!this.validateValue())
		{
			this.clearValue(false);
			this.onTriggerClick();
		}
		else
		{
			/**
			 * The function that should handle the trigger's click event.  This method does nothing by default
			 * until overridden by an implementing function. See {@link Ext.form.TriggerField#onTriggerClick}
			 * for additional information.
			 * @method
			 * @param {EventObject} e
			 */
			this.onTriggerClick();
		}
	},
   
			/**
			 *  private, Since this extends superclass trigger field while initiliazing need the bind 
			 *  the necessary trigger fields.
			 */
	initTrigger : function(){
		var ts = this.trigger.select('.x-form-trigger', true),
		tscount = this.trigger.select('.x-combo-count', true),
		triggerField = this;

		ts.each(function(t, all, index){
			var triggerIndex = 'Trigger'+(index+1);
			t.hide = function(){
				var w = triggerField.wrap.getWidth();
				this.dom.style.display = 'none';
				triggerField.el.setWidth(w-triggerField.trigger.getWidth());
				triggerField['hidden' + triggerIndex] = true;

			};
			t.show = function(){
				var w = triggerField.wrap.getWidth();
				this.dom.style.display = '';
				triggerField.el.setWidth(w-triggerField.trigger.getWidth());
				triggerField['hidden' + triggerIndex] = false;
			};
			this.mon(t, 'click', this['on'+triggerIndex+'Click'], this, {preventDefault:true});
			t.addClassOnOver('x-form-trigger-over');
			t.addClassOnClick('x-form-trigger-click');
		}, this);
		this.triggers = ts.elements;
		this.triggercounter=tscount.elements;    
		this.triggerCounterElem=this.triggercounter[0];

		tscount.each(function(t, all, index){
			t.hide = function(){
				var w = triggerField.wrap.getWidth();
				this.dom.style.display = 'none';
				triggerField.el.setWidth(w-triggerField.trigger.getWidth());
			};
			t.show = function(){
				var w = triggerField.wrap.getWidth();
				this.dom.style.display = '';
				triggerField.el.setWidth(w-triggerField.trigger.getWidth());
			};

		}, this);
		this.triggerCounterElem.hide();
	},
	onTrigger1Click:function(){
		this.clearValue();
	},

    //method which clears the selected values on deselecting the drop down values.
	clearValue:function(flag){
		if(cbx.isEmpty(flag)){
			this.setValue('',true);
			cbx.formElement.multiSelectComboBox.superclass.clearValue.call(this);
		}
		this.valueArray = [];
		try{
			var nodes = Ext.apply([], this.view.getSelectedNodes());
			for (var i=0, len=nodes.length; i<len; i++){
				this.view.deselect(nodes[i], true);
			}
		}catch(err){}
	},
	
	//method which deselcts the drop down values(selected node values).
	reset:function(){
		try
		{
			var nodes = Ext.apply([], this.view.getSelectedNodes());
			for (var i=0, len=nodes.length; i<len; i++){
				this.view.deselect(nodes[i], true);
			}
			cbx.formElement.multiSelectComboBox.superclass.reset.call(this);
		}catch(err){}
	},
   
	//private
	initList:function(){
		if(!this.list){
			var cls = 'x-combo-list';

			this.list = new Ext.Layer({
				shadow: this.shadow, cls: [cls, this.listClass].join(' '), constrain:false
			});

			var lw = this.listWidth || Math.max(this.wrap.getWidth(), this.minListWidth);
			this.list.setWidth(lw);
			this.list.swallowEvent('mousewheel');
			this.assetHeight = 0;

			if(this.title){
				this.header = this.list.createChild({cls:cls+'-hd', html: this.title});
				this.assetHeight += this.header.getHeight();
			}

			this.innerList = this.list.createChild({cls:cls+'-inner'});
			this.innerList.on('mouseover', this.onViewOver, this);
			this.innerList.on('mousemove', this.onViewMove, this);
			this.innerList.setWidth(lw - this.list.getFrameWidth('lr'))

			if(this.pageSize){
				this.footer = this.list.createChild({cls:cls+'-ft'});
				this.pageTb = new Ext.PagingToolbar({
					store:this.store,
					pageSize: this.pageSize,
					renderTo:this.footer
				});
				this.assetHeight += this.footer.getHeight();
			}


			/**
			 * The {@link Ext.DataView DataView} used to display the ComboBox's options.
			 * @type Ext.DataView
			 */
			this.view = new Ext.DataView({
				applyTo: this.innerList,
				tpl: this.tpl,
				singleSelect: true,


				multiSelect: this.multiSelect,
				simpleSelect: true,
				overClass:cls + '-cursor',


				selectedClass: this.selectedClass,
				itemSelector: this.itemSelector || '.' + cls + '-item'
			});
			
			//Binding the events.{beforeClick & click}
			this.view.on('click', this.onViewClick, this);

			this.view.on('beforeClick', this.onViewBeforeClick, this);


			this.bindStore(this.store, true);

			if (this.valueArray.length){
				this.selectByValue(this.valueArray);
			}

			if(this.resizable){
				this.resizer = new Ext.Resizable(this.list,  {
					pinned:true, handles:'se'
				});
				this.resizer.on('resize', function(r, w, h){
					this.maxHeight = h-this.handleHeight-this.list.getFrameWidth('tb')-this.assetHeight;
					this.listWidth = w;
					this.innerList.setWidth(w - this.list.getFrameWidth('lr'));
					this.restrictHeight();
				}, this);
				this[this.pageSize?'footer':'innerList'].setStyle('margin-bottom', this.handleHeight+'px');
			}
		}
	},

	// private
	onViewOver:function(e, t){
		if(this.inKeyMode){ // prevent key nav and mouse over conflicts
			return;
		}


	},

	// private
	initEvents:function(){
		cbx.formElement.multiSelectComboBox.superclass.initEvents.call(this);

		this.keyNav = new Ext.KeyNav(this.el, {
			"up" : function(e){
				this.inKeyMode = true;
				this.hoverPrev();
			},

			"down" : function(e){
				if(!this.isExpanded()){
					this.onTriggerClick();
				}else{
					this.inKeyMode = true;
					this.hoverNext();
				}
			},

			"enter" : function(e){
				if (this.isExpanded()){
					this.inKeyMode = true;
					var hoveredIndex = this.view.indexOf(this.view.lastItem);
					this.onViewBeforeClick(this.view, hoveredIndex, this.view.getNode(hoveredIndex), e);
					this.onViewClick(this.view, hoveredIndex, this.view.getNode(hoveredIndex), e);
				}else{
					this.onSingleBlur();
				}
				return true;
			},

			"esc" : function(e){
				this.collapse();
			},

			"tab" : function(e){
				this.collapse();
				return true;
			},

			"home" : function(e){
				this.hoverFirst();
				return false;
			},

			"end" : function(e){
				this.hoverLast();
				return false;
			},

			scope : this,

			doRelay : function(foo, bar, hname){
				if(hname == 'down' || this.scope.isExpanded()){
					return Ext.KeyNav.prototype.doRelay.apply(this, arguments);
				}

				if(hname == 'enter' || this.scope.isExpanded()){
					return Ext.KeyNav.prototype.doRelay.apply(this, arguments);
				}

				return true;
			},

			forceKeyDown: true
		});
		this.queryDelay = Math.max(this.queryDelay || 10,
					this.mode == 'local' ? 10 : 250);
		this.dqTask = new Ext.util.DelayedTask(this.initQuery, this);
		if(this.typeAhead){
			this.taTask = new Ext.util.DelayedTask(this.onTypeAhead, this);
		}
		if(this.editable !== false){
			this.el.on("keyup", this.onKeyUp, this);
		}
		if(this.forceSelection){
			this.on('blur', this.doForce, this);
		}

		else if(!this.multiSelect){
			this.on('focus', this.onSingleFocus, this);
			this.on('blur', this.onSingleBlur, this);
		}
		this.on('change', this.onChange, this);

	},

	onChange:function(){
		if (!this.clearTrigger){
			return;
		}
		if (this.getValue() != ''){
			this.triggers[0].show();
		}else{
			this.triggers[0].hide();
		}
	},

	// private
	selectFirst:function(){
		var ct = this.store.getCount();
		if(ct > 0){
			this.select(0);
		}
	},

	// private
	selectLast:function(){
		var ct = this.store.getCount();
		if(ct > 0){
			this.select(ct);
		}
	},
	
	// private
	assertValue : function(){
		var val = this.getRawValue(),
		rec;
		if(this.valueField && Ext.isDefined(this.value)){
			rec = this.findRecord(this.valueField, this.value);
		}
		if(!rec || rec.get(this.displayField) != val){
			rec = this.findRecord(this.displayField, val);
		}
		if(!rec && this.forceSelection){
			if(val.length > 0 && val != this.emptyText){
				this.el.dom.value = Ext.value(this.lastSelectionText, '');
				this.applyEmptyText();
			}else{
				this.clearValue(false);
			}
		}else{
			if(rec && this.valueField){
				if (this.value == val){
					return;
				}
				val = rec.get(this.valueField || this.displayField);
			}
			this.setValue(val);
		}
	}, 

	/**
	 * Hover an item in the dropdown list by its numeric index in the list.
	 * @param {Number} index The zero-based index of the list item to select
	 * @param {Boolean} scrollIntoView False to prevent the dropdown list from autoscrolling to display the
	 * hovered item if it is not currently in view (defaults to true)
	 */
	hover:function(index, scrollIntoView){
		if (!this.view){
			return;
		}
		this.hoverOut();
		var node = this.view.getNode(index);
		this.view.lastItem = node;
		Ext.fly(node).addClass(this.view.overClass);
		if(scrollIntoView !== false){
			var el = this.view.getNode(index);
			if(el){
				this.innerList.scrollChildIntoView(el, false);
			}
		}
	},

	hoverOut:function(){
		if (!this.view){
			return;
		}
		if (this.view.lastItem){
			Ext.fly(this.view.lastItem).removeClass(this.view.overClass);
			delete this.view.lastItem;
		}
	},

	// private
	hoverNext:function(){
		if (!this.view){
			return;
		}
		var ct = this.store.getCount();
		if(ct > 0){
			if(!this.view.lastItem){
				this.hover(0);
			}else{
				var hoveredIndex = this.view.indexOf(this.view.lastItem);
				if(hoveredIndex < ct-1){
					this.hover(hoveredIndex+1);
				}
			}
		}
	},

	// private
	hoverPrev:function(){
		if (!this.view){
			return;
		}
		var ct = this.store.getCount();
		if(ct > 0){
			if(!this.view.lastItem){
				this.hover(0);
			}else{
				var hoveredIndex = this.view.indexOf(this.view.lastItem);
				if(hoveredIndex != 0){
					this.hover(hoveredIndex-1);
				}
			}
		}
	},

	// private
	hoverFirst:function(){
		var ct = this.store.getCount();
		if(ct > 0){
			this.hover(0);
		}
	},

	// private
	hoverLast:function(){
		var ct = this.store.getCount();
		if(ct > 0){
			this.hover(ct);
		}
	},

	collapse:function(){
		this.hoverOut();
		cbx.formElement.multiSelectComboBox.superclass.collapse.call(this);
	},

	expand:function(){
		cbx.formElement.multiSelectComboBox.superclass.expand.call(this);
	},

	// private
	onSelect:function(record, index){
		if(this.fireEvent('beforeselect', this, record, index) !== false){
			this.addValue(record.data[this.valueField || this.displayField]);
			//this.fireEvent('select', this, record, index);
			if (!this.multiSelect){
				this.collapse();
			}
		}
	},

	/**
	 * Add a value if this is a multi select
	 * @param {String} value The value to match
	 */
	addValue:function(v){
		v = String(v);
		if (!this.multiSelect){
			this.setValue(v);
			return;
		}
		if (this.valueArray.indexOf(v) == -1){
			this.valueArray.push(v);
			this.setValue(this.valueArray.sort());
		}
	},

	/**
	 * Remove a value
	 * @param {String} value The value to match
	 */
	removeValue:function(v){
		v = String(v);
		if (this.list){
			var r = this.findRecord(this.valueField, v);
			this.deselect(this.store.indexOf(r));
		}
		this.valueArray.remove(v);
		this.setValue(this.valueArray.sort());
	},
	//private ,Method to validate on updating the combostore
	validateStore:function(){

		var resultarr=[];		
		var finalisedResultarr=[];		
		var val=this.value;
		if(!cbx.isEmpty(val))
		{

			if (Ext.isArray(val)){ 
				resultarr=val;					
			}else{				
				resultarr=val.split(",");	
			}				
		}


		if (this.store) {
			for ( var recIndex = 0; recIndex < this.store
			.getCount(); recIndex++) {
				if ((resultarr.contains(this.store.getAt(recIndex).data.key))
							|| (resultarr.contains(this.store.getAt(recIndex).data.value))) {
					finalisedResultarr.push(this.store.getAt(recIndex).data.key);
				}
			}
		}



		this.setValue(finalisedResultarr);

	},
	/**
	 * Sets the specified value for the field. The value can be an Array or a String (optionally with separating commas)
	 * If the value finds a match, the corresponding record text will be displayed in the field.
	 * @param {Mixed} value The value to match
	 */
	setValue:function(v,flag){
		var result = []
		,resultRaw = [],exactKeyMatch=[];
		var val=v;
		if (Ext.isString(val) && (!Ext.isArray(val))){ 
			var resultVal = [];
			resultVal=val.split(",");

			v=resultVal;
		}
		if (!(v instanceof Array)){
			v = [v];
		}
		if (!this.multiSelect && v instanceof Array){
			v = v.slice(0,1);
		} 
		for (var i=0, len=v.length; i<len; i++){
			var value = v[i];
			var text = value;
			if(this.valueField){
				var r = this.findRecord(this.valueField, value);
				if(r){
					text = r.data[this.displayField];
					exactKeyMatch.push(text);
				}
			}
			resultRaw.push(value);
			result.push(text);
		}	
		v = resultRaw.join(',');
		text = result.join(',');

		this.lastSelectionText = text;
		this.valueArray = resultRaw.sort();
		if(this.hiddenField){
			this.hiddenField.value = v;
		}
		cbx.formElement.multiSelectComboBox.superclass.setValue.call(this, text);
		this.value = v;
		this.updateScreenViewData(this);
		if(this.store.getCount() > 1 && v.length>1){
			this.triggerCounterElem.show();
			if(exactKeyMatch.length!==this.getValue().length)
				this.triggerCounterElem.update(exactKeyMatch.length);
			else
				this.triggerCounterElem.update(this.getValue().length);				
		}else{
			this.triggerCounterElem.update("");
			this.triggerCounterElem.hide();
		}
		if (this.view){
			if(!this.isExpanded()){
				this.view.clearSelections();
				this.selectByValue(this.valueArray);
			}
		}

		if (this.oldValueArray != this.valueArray){
			if(this.isExpanded()){
				this.fireEvent('blur', this, this.oldValueArray, this.valueArray);
			}
			if(!this.isExpanded() && flag==true){
				this.fireEvent('change', this, this.oldValueArray, this.valueArray);
			}
		}
		this.oldValueArray = Ext.apply([], this.valueArray).sort();
		if (this.history && !this.multiSelect && this.mode == 'local'){
			this.addHistory(this.getRawValue());
		}		
		this.onChange();


	},


	// private
	onLoad:function(){
		if(!this.hasFocus){
			return;
		}
		if(this.store.getCount() > 0){
			this.expand();
			this.restrictHeight();
			if(this.lastQuery == this.allQuery){
				if(this.editable){
					this.el.dom.select();
				}

				this.selectByValue(this.value, true);


			}else{
				this.selectNext();
				if(this.typeAhead && this.lastKey != Ext.EventObject.BACKSPACE && this.lastKey != Ext.EventObject.DELETE){
					this.taTask.delay(this.typeAheadDelay);
				}
			}
		}else{
			this.onEmptyResults();
		}

	},

	selectByValue:function(v, scrollIntoView){
		this.hoverOut();
		if(v !== undefined && v !== null){
			if (!(v instanceof Array)){
				v = [v];
			}
			var result = [];
			for (var i=0, len=v.length; i<len; i++){
				var value = v[i];
				var r = this.findRecord(this.valueField || this.displayField, value);
				if(r){
					this.select(this.store.indexOf(r), scrollIntoView);
					result.push(value);
				}
			}
			return result.join(',');
		}
		return false;
	},

	// private
	onViewBeforeClick:function(vw, index, node, e){
		this.preClickSelections = this.view.getSelectedIndexes();
	},

	// private
	onViewClick:function(vw, index, node, e){
		if (typeof index != 'undefined'){
			var arrayIndex = this.preClickSelections.indexOf(index);
			if (arrayIndex != -1 && this.multiSelect){
				this.removeValue(this.store.getAt(index).data[this.valueField || this.displayField]);
				if (this.inKeyMode){
					this.view.deselect(index, true);
				}
			}else{
				var r = this.store.getAt(index);
				if (r){
					if (this.inKeyMode){
						this.view.select(index, true);
					}
					this.onSelect(r, index);
				}
			}
		}

		if(vw !== false){
			this.el.focus();
		}
	},
	
	/**
	 * gets the specified value for the field. The value can be only Array in sorted manner.
	 */
	getValue : function() {

		var resultarr = [];
		var val=this.value;
		if(!cbx.isEmpty(val))
		{

			if (Ext.isArray(val)){ 
				resultarr=val;					
			}else{				
				resultarr=val.split(",");	
			}				
		}
		return resultarr.sort();

	},

	getKeyValueMatch : function() {
		var resultarr=[];			
		var val=this.value;
		if(!cbx.isEmpty(val))
		{

			if (Ext.isArray(val)){ 
				resultarr=val;					
			}else{				
				resultarr=val.split(",");	
			}				
		}


		if (this.store) {
			for ( var recIndex = 0; recIndex < this.store
			.getCount(); recIndex++) {
				if ((resultarr.contains(this.store.getAt(recIndex).data.key))
							|| (resultarr.contains(this.store.getAt(recIndex).data.value))) {
					return true;
				}
			}
		}
		return false;

	}, 
	isKeyValueMatch : function() {

		var returnFlagValue = (this.getKeyValueMatch() == true || this
					.getKeyValueMatch() == 'true') ? true : false;

		return returnFlagValue;
	},
	validateValue : function() {
		var combundle = CRB.getFWBundle();
		if(!Ext.isEmpty(this.value)){
			if (!this.isKeyValueMatch()) {

				this.markInvalid(combundle && combundle['ERR_MANDATORY_SELECT'] ? 
							(String.format(combundle['ERR_MANDATORY_SELECT'],this.toolTipLabel)):'ERR_MANDATORY_SELECT');

				return false;
			}
		}

		if (this.isNotSelectSelected() && this.required === 'Y') {
			this.markInvalid(this.blankText);
			return false;
		}
		return true;
	},

	select:function(index, scrollIntoView){
		this.selectedIndex = index;
		if (!this.view){
			return;
		}
		this.view.select(index, this.multiSelect);
		if(scrollIntoView !== false){
			var el = this.view.getNode(index);
			if(el){
				this.innerList.scrollChildIntoView(el, false);
			}
		}
	},

	deselect:function(index, scrollIntoView){
		this.selectedIndex = index;
		this.view.deselect(index, this.multiSelect);
		if(scrollIntoView !== false){
			var el = this.view.getNode(index);
			if(el){
				this.innerList.scrollChildIntoView(el, false);
			}
		}
	},

	// ability to delete value with keyboard
	doForce:function(){
		if(this.el.dom.value.length > 0){
			if (this.el.dom.value == this.emptyText){
				this.clearValue();
			}
			else{
				this.el.dom.value =
					this.lastSelectionText === undefined?'':this.lastSelectionText;
				this.applyEmptyText();
			}
		}
	},

	// private
	onSingleBlur:function(){
		var r = this.findRecord(this.displayField, this.getRawValue());
		if (r){
			this.select(this.store.indexOf(r));
			return;
		}
		if (String(this.oldValue) != String(this.getRawValue())){
			this.setValue(this.getRawValue());
			this.fireEvent('change', this, this.oldValue, this.getRawValue());
		}
		this.oldValue = String(this.getRawValue());
	},

	// private
	onSingleFocus:function(){
		this.oldValue = this.getRawValue();
	},

	addHistory:function(value){
		if (!value.length){
			return;
		}
		var r = this.findRecord(this.displayField, value);
		if (r){
			this.store.remove(r);
		}else{
			var o = this.store.reader.readRecords([[value]]);
			r = o.records[0];
		}
		this.store.clearFilter();
		this.store.insert(0, r);
		this.pruneHistory();
	},


	// private
	pruneHistory:function(){
		if (this.historyMaxLength == 0){
			return;
		}
		if (this.store.getCount()>this.historyMaxLength){
			var overflow = this.store.getRange(this.historyMaxLength, this.store.getCount());
			for (var i=0, len=overflow.length; i<len; i++){
				this.store.remove(overflow[i]);
			}
		}
	},
	//Helper method to get the display value, will be invoked by manager.
	getDisplayValue:function(val){

		var resultarr=[];		
		var finalisedResultarr=[];		
		if(!cbx.isEmpty(val))
		{

			if (Ext.isArray(val)){ 
				resultarr=val;					
			}else{				
				resultarr=val.split(",");	
			}				
		}

		if(resultarr.length>0){
			if (this.store) {
				for ( var recIndex = 0; recIndex < this.store
				.getCount(); recIndex++) {
					if ((resultarr.contains(this.store.getAt(recIndex).data.key))
								|| (resultarr.contains(this.store.getAt(recIndex).data.value))) {
						finalisedResultarr.push(this.store.getAt(recIndex).data.value);
					}
				}
			}
		}
		return finalisedResultarr;
	},
	getScreenViewData : function() {
		return this.getDisplayValue(this.getValue());
	}

});
Ext.reg('cbx-multiselectcombobox', cbx.formElement.multiSelectComboBox);


/**
 * @class cbx.formElement.multiselectComboStaticField
 * @extends Ext.form.TextArea
 * Multiline text field.  Can be used as a direct replacement for traditional textarea fields in read only manner
 * @constructor
 * Creates a new TextArea
 */


cbx.formElement.multiselectComboStaticField = function(config) {
	this.plainLabel = config.plainLbl;
	this.fieldLabel = config.displayNmKey;
	this.name = config.itemId;
	this.addData = config.addData;
	this.required = config.requiredInd;
	this.conditional = config.conditionalInd;
	this.hidden = config.visibleInd === 'Y' ? false : true;
	cbx.formElement.multiselectComboStaticField.superclass.constructor.call(this, config);
};

Ext.extend(cbx.formElement.multiselectComboStaticField, Ext.form.TextArea, {
	/**
	 * @cfg {Object} bundleKey ,key used by resource to lookup bundle(defaults
	 *      to '')
	 */
	bundleKey : '',
	initComponent : function() {
		this.triggerField = true;
		this.on('hide',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'N']));
		this.on('show',Ext.createDelegate(this.updateVisibilityInSV, this, [this,'Y']));
		
		this.allowBlank = true;
		this.maxLength = undefined;
		this.minLength = undefined;
		cbx.formElement.multiselectComboStaticField.superclass.initComponent.apply(this,
				arguments);
		var bundle;
		var commonbundle = CRB.getFWBundle();
		bundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));
		if (!Ext.isEmpty(this.plainLabel)) {
			this.fieldLabel = this.plainLabel;
		} else {
			this.fieldLabel = bundle['LBL_' + this.fieldLabel];
		}
		if (this.conditional === 'Y') {
			if (Ext.isEmpty(this.fieldLabel)) {
				
				this.fieldLabel = '?' + this.fieldLabel + '?';
				
			} else {
				
				this.fieldLabel = this.fieldLabel;
			
			}
		} else if (this.required === 'Y') {
			if (Ext.isEmpty(this.fieldLabel)) {
			
				this.fieldLabel = '?' + this.fieldLabel + '?';
				
			} else {
				
				this.fieldLabel = this.fieldLabel;
				
			}
		} else {
			if (Ext.isEmpty(this.fieldLabel)) {
				this.fieldLabel = '?' + this.fieldLabel + '?'
						+ '<span class = \'non_mandatory\'"></span>';
			} else {
				this.fieldLabel = this.fieldLabel
						+ '<span class = \'non_mandatory\'"></span>';
			}
		}
		
		if(!Ext.isEmpty(this.multiInd)&& this.multiInd==true && !Ext.isEmpty(this.index)){
			var value=this.getItemValue(this.model.md[this.multiFormId][this.itemId][this.index]) || '--'; 
		}else{
			var value=this.getItemValue(this.model.getValue(this.name))  || '--';	
		}
		
		this.value=value;

		this.readOnly = true;
		this.labelSeparator = '';
		this.style = 'border:none;background: transparent;';
		this.anchor = (this.anchor == undefined) ? '' : this.anchor;
		this.tabIndex = 99999991; 
	},
	
	 /**
     * Returns the items of the "value" attribute
     * @param {String} list of items
     * @return {Array
     */	
	getItemValue : function(val) {
		var value=[];
		if(!cbx.isEmpty(val)){
			if (!Ext.isArray(val)){ 
				var result = [];
				result=val.split(",");
				
				value=result;
			}else if (Ext.isArray(val)){
				value=val;
			}
			}
		
		var out = [];
		if (!Ext.isEmpty(this.addData) ) { 
			for ( var i = 0; i < this.addData.length; i++) {
				if (value.contains(this.addData[i]['rawKey'])) {
					out.push(this.addData[i]['rawValue']);
					
				}
			}
		}
		return out;
	},
	
	/**
	 * Methods directly ties up with the additional data format of Form FW and
	 * is responsible for parsing the provided additional data and repopulate
	 * the combo store.
	 */
	rePopulateAdditionaldata : function(additionalData) {
		if(!Ext.isEmpty(additionalData)){
		this.addData=additionalData;
		if(!Ext.isEmpty(this.multiInd)&& this.multiInd==true && !Ext.isEmpty(this.index)){
			 value=this.getItemValue(this.model.getValue(this.multiFormId)[this.itemId][this.index]) || '--';
		}else{
			var value=this.getItemValue(this.model.getValue(this.name)) || '--';
		}
		this.setValue(value);
		}		
	},
	
	 /**
     * Sets a data value into the field  without validation 
     * @param {Mixed} value The value to set
     */
	setValue : function(val) {
		var value=this.getItemValue(val) || val;
		if(Ext.isEmpty(value)){
			value='--';
		}else {
			value=value.join(',');
		}
		
		if(!cbx.isEmpty(val) && value=='--'){
			value=val;
		}
		cbx.formElement.multiselectComboStaticField.superclass.setValue.call(this, value);
		this.updateScreenViewData(this);
	},
	
	 afterRender:function(){
		this.updateScreenViewData(this);
		cbx.formElement.multiselectComboStaticField.superclass.afterRender.apply(this,
				arguments);
	},	
	getScreenViewData:function()
	{
		//return this.getValue();
		return this.getItemValue(this.model.getValue(this.name));
	}

});
Ext.reg('cbx-staticmultiselectcombobox', cbx.formElement.multiselectComboStaticField);




//CHG2409_59873_Ends
/**
 * function used for preventing copy/paste and drag/drop
 */
preventCopyPaste=function(e){
	
	var keyCode=e.getKey() || e.keyCode || e.charCode;
	//for prevent copy and paste functionality using keycode in keystroke
	if((e.ctrlKey && keyCode==86) || (e.ctrlKey && keyCode==67))
	{
	e.stopEvent();
	e.preventDefault(); // for chrom browser
	return false; // for IE
					
	}
	//for prevent drag and drop functionality for lower version browsers
	if(e.type=="drop" || e.type=="dragstart")
	{
		if(e.stopPropagation)
			{
		e.stopPropagation();
		e.preventDefault(); // for chrome
		
			}
		
		e.returnValue=false; // for IE
		
		return false; // for IE
	}
	//for higher version browsers 
	if(e.type=="draggesture")
	{
	this.selectText(0,0);
	}
}

