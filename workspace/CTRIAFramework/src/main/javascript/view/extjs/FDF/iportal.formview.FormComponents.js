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
 * namespace to be used for form view designs &#46; Every form elements to be part of this namespace.
 */

Ext.namespace('iportal.formelement');

Ext.apply(Ext.form.VTypes,{
 //  vtype validation function
   invalidChars: function(val, field) {
        return /^([a-zA-Z0-9 #$%^*+,-./:?@\[\]\_`])*$/.test(val);
    },
    // vtype Text property: The error text to display when the validation
	// function returns false
    invalidCharsText:CRB.getFWBundle().ERR_INVALID_CHAR	
});

Ext.apply(Ext.form.VTypes,{
	 //  vtype validation function
	   invalidCharacters: function(val, field) {
	        return /([a-zA-Z0-9\_])$/.test(val);
	    },
	    // vtype Text property: The error text to display when the validation
		// function returns false
	    invalidCharactersText:CRB.getFWBundle().ERR_INVALID_CHAR	
	});


Ext.apply(Ext.form.VTypes,{
	 //  vtype validation function
	   validChar: function(val, field) {
	        return /([a-zA-Z0-9\s])$/.test(val);
	    },
	    // vtype Text property: The error text to display when the validation
		// function returns false
	    validCharText:CRB.getFWBundle().ERR_INVALID_CHAR	
	});

Ext.apply(Ext.form.VTypes,{
	 // vtype validation function
	   invalidCharactersWithBraces: function(val, field) {
	        return /([a-zA-Z0-9\_(){}])$/.test(val);
	    },
	    // vtype Text property: The error text to display when the validation
		// function returns false
	    invalidCharactersWithBracesText:CRB.getFWBundle().ERR_INVALID_CHAR	
	});

Ext.apply(Ext.form.VTypes,{
	specialCharactersWithSpace: function(val, field) {
		 return /^([a-zA-Z0-9 =!;~|#$%^*>+,-./:@^\\[\]\_`])*$/.test(val);
	 },
	 specialCharactersWithSpaceText:CRB.getFWBundle().ERR_INVALID_CHAR	
});

Ext.apply(Ext.form.VTypes,{
	specialCharactersCompMail: function(val, field) {
	
		/**
		 * <PRE>
		 * The below characters will be rescricted from BO and FO Mail.And other than that the fields will allow alpha numeric and other special characters
		 * <>;"{}!=&
		 * In the rectrictedCharacters array the characters are mentioned in ASCII order so that binary search can be applied.
		 * 
		 * 		ASCII			HTML			HTML			Description
		 * DEC	HEX	 SYMBOL		NUMBER			NAME				
		 * =================================================================
		 * 33	21	!			&#33							Exclamation
		 * 
		 * 34	22	"			&#34							Quotes
		 * 					
		 * 60	3C	<			&#60			&quot			less than sign
		 * 
		 * 38	26	&			&#38			&amp			ampersand
		 * 
		 * 60													less than sign
		 * 
		 * 61													equal sign
		 * 
		 * 62													greater than sign
		 * 
		 * 123													opening brace
		 * 													
		 * 125													closing brace
		 * 
		 * </PRE>
		 * */
		
		var resctrictedCharacters=['33','34','38','59','60','61','62','123','125'];
		var status=true;
		var string=val;
		for(var i=0;i<string.length;i++){
		if(this.binaryIndexOf(resctrictedCharacters,string.charCodeAt(i))!='-1'){
			status=false;
			break;
		}else{
			status=true;
			continue;
		}
		}
		return status;
	},
	binaryIndexOf:function(arr,searchElement) {
		  'use strict';
		  var minIndex = 0;
		  var maxIndex = arr.length - 1;
		  var currentIndex;
		  var currentElement;
		  while (minIndex <= maxIndex) {
		      currentIndex = (minIndex + maxIndex) / 2 | 0;
		      currentElement = arr[currentIndex];

		      if (currentElement < searchElement) {
		          minIndex = currentIndex + 1;
		      }
		      else if (currentElement > searchElement) {
		          maxIndex = currentIndex - 1;
		      }
		      else {
		          return currentIndex;
		      }
		  }
		  return -1;
	},
		
	specialCharactersCompMailText:CRB.getFWBundle().ERR_INVALID_CHAR
	});  

Ext.apply(Ext.form.VTypes,{
	 //  vtype validation function
	   invalidCharactersWithSpace: function(val, field) {
	        return /([a-zA-Z0-9\_ ])$/.test(val);
	    },
	    // vtype Text property: The error text to display when the validation
		// function returns false
	    invalidCharactersText:CRB.getFWBundle().ERR_INVALID_CHAR	
	});



//Checking the present value of input field and matches with below spl chars. 
//				hasSpecial will store value without spl char, then condition will check actual value and hasSpecial value and returns boolean.   
/**
*Added by Chiranjib:The vty[pe will accept all the alphanumeric characters including space and underscore.
*
*/
Ext.apply(Ext.form.VTypes,{
/**
*Method intended to return true or false based on the current input in the field
*/
invalidCharactersWithSpace: function(value, field) {

  this.invalidCharactersWithSpaceText = CRB.getFWBundle().ERR_INVALID_CHAR;
  var hasSpecial = value.match(/[a-zA-Z0-9\_\ \$]+/i);
  if (hasSpecial[0]!==value)
  return false;
  else if(hasSpecial[0]===value)
  return true
},
/**
*Config/Object:The text that needs to be displayed as a part of error message
*
*/
invalidCharactersWithSpaceText:CRB.getFWBundle().ERR_INVALID_CHAR	
});



/** @class 		iportal.formelement.InformationPanel 
 *  @extends 	Ext.Panel
 *  @param {Object} config Configuration options
 */

iportal.formelement.InformationPanel = function(config){
    this.name = config.name || config.id;
    iportal.formelement.InformationPanel.superclass.constructor.call(this, config);
};

Ext.extend(iportal.formelement.InformationPanel, Ext.Panel, {
	
	rows: 1,
	columns : 1 ,
	/**
     * @cfg {Object} bundleKey ,key used by resource to lookup bundle(defaults to '')
     */
	bundleKey : '',
	
	initComponent:function(){
	
		if(Ext.isEmpty(this.bundleKey)){
			var parent = this.findParentByType('iportal-formpanel') || this.findParentByType('iportal-fluidform') ;
			this.bundleKey = parent.bundleKey;
		}
		try{
			bundle = CRB.getBundle(this.bundleKey);
		}
		catch(e){
		}
		
		
		if(!this.title)
			this.title = "LBL_"+this.id;
		this.title = bundle[this.title];
	
		var defaultConfig = {
				xtype:'panel',
				height:90,
				width:300, //Width increased for the infofield 
				ctCls:'infopanel',
				layout:'fit',
				style : 'padding :0px;',
				title:this.title,
				border: true,
				frame:true,
				draggable:false,
				layout: 'table',
				layoutConfig: {
					tableAttrs: {
            			style: {
                			width: '100%'
            			}
					},
	        		columns: this.columns,
	        		rows   : this.rows
				}
		};
		Ext.apply(this, defaultConfig);	
		iportal.formelement.InformationPanel.superclass.initComponent.apply(this, arguments);
		
}
	
});

Ext.reg('iportal-infofield', iportal.formelement.InformationPanel);


/**
 * @class iportal.formelement.TextField
 * @extends Ext.form.TextField
 * Base class to customize a textfield display text in a form layout.
 * @constructor
 * Creates a new TextField Field
 * @param {Object} config Configuration options
 * @author 32191
 */

iportal.formelement.TextField = function(config){
    this.name = config.name || config.id;
    iportal.formelement.TextField.superclass.constructor.call(this, config);
};

Ext.extend(iportal.formelement.TextField, Ext.form.TextField, {
	 /**
     * @cfg {String/Object} required ,to specify whether this field is mandatory (defaults to false)
     */
    required : false,
    
	conditional : false,
	/**
     * @cfg {Object} bundleKey ,key used by resource to lookup bundle(defaults to '')
     */
	bundleKey : '',
	
	/**
     * @cfg {Object} lookup ,used when textfield is part of a lookup button
     */
	lookup : false,
	
	vtype :'invalidChars',
		
	/**
     * @cfg {String/Object} validationType ,to specify what modes of validation this field should
	 * support &#46;(defaults to none)
	 * Standard modes available are
	 * 1 alphaNumeric - field allows only alphanumeric characters
	 * 2 none - no validation
     */
    validationType : 'none',
    
    /**
     * @cfg {Object} allowSpaces ,used when spaces are allowed inside the textfield
     * defaults to false
     */
    allowSpaces : false,
    plainLabel : '',
	cls : 'x-form-textField',
     // private
	initComponent:function(){
		iportal.formelement.TextField.superclass.initComponent.apply(this, arguments);	
		var commonbundle = CRB.getFWBundle();
		var bundle;
		if(Ext.isEmpty(this.bundleKey)){
			var parent = this.findParentByType('iportal-formpanel') || this.findParentByType('iportal-fluidform') ;
			this.bundleKey = parent.bundleKey;
		}
		try{
			bundle = CRB.getBundle(this.bundleKey);
		}
		catch(e){
		}
		if(!this.fieldLabel)
			this.fieldLabel = "LBL_"+this.id;
			
		if(this.maxLength < Number.MAX_VALUE){
			this.maxLengthText = String.format(commonbundle['ERR_MAXLENGTH_EXCEED'],bundle[this.fieldLabel],this.maxLength);
		}
		this.plainLabel = bundle[this.fieldLabel];
			
		if(this.required){
			try{
			    
				//this.blankText = String.format(commonbundle['ERR_MANDATORY'] , bundle[this.fieldLabel]);
				this.blankText = String.format(commonbundle['ERR_MANDATORY_TEXTFIELD'] , bundle[this.fieldLabel]);

				/*ANZ formelement cleanup */
				if(bundle[this.fieldLabel]==undefined)
				{
					this.fieldLabel='?'+this.fieldLabel+'?'+'<span class = \'mandatory\'">*</span>';
					
				}
				else if(bundle[this.fieldLabel] == ''){
				this.fieldLabel=bundle[this.fieldLabel]
				}
				else
				{
					this.fieldLabel=bundle[this.fieldLabel]+'<span class = \'mandatory\'">*</span>';
				}
				
			}
			catch(e){
				this.fieldLabel='?'+this.fieldLabel+'?'+'<span class = \'mandatory\'">*</span>' ;
			}
		
			if(this.lookup){
				this.allowBlank=true;
			} else {
				this.allowBlank=false;				
			}
		}
		else if(this.conditional){
			try{
			  
              		  //this.blankText = String.format(commonbundle['ERR_MANDATORY'] , bundle[this.fieldLabel]);
			   this.blankText = String.format(commonbundle['ERR_MANDATORY_TEXTFIELD'] , bundle[this.fieldLabel]);
			   
				if(bundle[this.fieldLabel]==undefined)
				{
					this.fieldLabel='?'+this.fieldLabel+'?'+'<span class = \'mandatory_fx\'">**</span>';
					
				}
				else
				{
					this.fieldLabel=bundle[this.fieldLabel]+'<span class = \'mandatory_fx\'">**</span>';
				}
				
			}
			catch(e){
				this.fieldLabel='?'+this.fieldLabel+'?'+'<span class = \'mandatory_fx\'">**</span>' ;
			}
		}
		else{
			try	{
				this.fieldLabel= '<span class = \'non_mandatory\'"></span>' + bundle[this.fieldLabel]; 
			}
			catch(e){
				this.fieldLabel= '<span class = \'non_mandatory\'"></span>' + '?' + bundle[this.fieldLabel] + '?'; 
			}
		}
		this.labelSeparator = '';
		switch(this.validationType)	{
			// validation type currently supported is alphaNumeric and numeric alone, which restricts the keystrokes
			// to be only alphabets and numerals.Numeric vType is an alternate for numberfield
			case 'alphaNumeric' : 
							if(this.allowSpaces){
								this.maskRe = /[A-Za-z0-9 ]/;
								this.globalRe=/[A-Za-z0-9 ]/g;
							}else{
							this.maskRe = /[A-Za-z0-9]/;
							this.globalRe = /[A-Za-z0-9]/g;
							}
							break;
			// Use numeric vtype as an alternate for NumberField
			case 'numeric' : 
							if(this.allowSpaces){
							this.maskRe = /[0-9 ]/;
							this.globalRe = /[0-9 ]/g;
							}else{
							this.maskRe = /[0-9]/;
							this.globalRe = /[0-9]/g;
							}
							break;
			case 'portalSupported' : 
							if(this.allowSpaces){
							this.maskRe = /[^<>;{}()!=&\'\" ]/;
							this.globalRe =/[^<>;{}()!=&\'\" ]/g;
							}else{
							this.maskRe =/[^<>;{}()!=&\'\"]/;
							this.globalRe = /[^<>;{}()!=&\'\"]/g;
							}
							break;
			case 'alphaNumericUnderscore' : 
				if(this.allowSpaces){
					this.maskRe = /[A-Za-z0-9 _]/;
					this.globalRe = /[A-Za-z0-9 _]/g;
				}else{
					this.maskRe = /[A-Za-z0-9_]/;
					this.globalRe = /[A-Za-z0-9_]/g;
				}
				break;				
		}
		
		this.anchor = (this.anchor == undefined) ? '' : this.anchor ;
		
	},
	isVisible : function(){
		return iportal.formelement.TextField.superclass.isVisible.apply(this, arguments);  
	},
	getPrintData : function(){
		var label = this.plainLabel;
		var fieldValue = this.getValue();
		var printMap = {};
		printMap[label] = fieldValue;
		return printMap;
	},
	validator:function(v,isCompleteValue){	
		var mask = "";
		if(!Ext.isEmpty(this.validationType)){
			
			if(this.validationType == 'email' && (Ext.isEmpty(isCompleteValue) || isCompleteValue == false)){
				isCompleteValue = false;
				return true;
			}
			
			mask=this.globalRe;
		}
		
		 // If the value is not matching with the regular expression
		 //or if the number of matching characters is less than the
		 //field value length
		
		 
		if(!Ext.isEmpty(mask) && !Ext.isEmpty(v)){ 
			
			
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
			
			
			var commonbundle=CRB.getFWBundle();
					if(this.validationType=='alphaNumeric' && this.allowSpaces==true){
						this.invalidText=CRB.getFWBundle()['ERR_ONLY_ALPHANUMERIC_SPACES'];
					}else if(this.validationType=='alphaNumeric'){
						this.invalidText=CRB.getFWBundle()['ERR_ONLY_ALPHANUMERIC'];
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
					
					else if(this.validationType=='email'){
						this.invalidText="This field should be an e-mail address in the format \"user@example.com\"";
						this.markInvalid(this.invalidText);
					}
					
		 			this.vtypeText=this.invalidText;
		 			return false;
	 		}
	
	 	else
	 		return true;
		 },
	
	customValidator:function(e){
		var keyCode=e.getKey();
		var isCompleteValue = true;
		var v=this.getValue();
		if(this.validationType=='alphaNumericToUpper'){
			if(keyCode>=65 && keyCode<=90)
			this.setValue(this.getValue().toUpperCase());
		}			
		return this.validator(v,isCompleteValue);
		
			
	}
});

Ext.reg('iportal-textfield', iportal.formelement.TextField);


/**
 * @class iportal.formelement.ComboBox
 * @extends Ext.form.ComboBox
 * Base class to customize a ComboBox display in a form layout.
 * @constructor
 * Creates a new ComboBox Field
 * @param {Object} config Configuration options
 * @author 32191
 */

iportal.formelement.ComboBox = function(config){
    this.name = config.name || config.id;
    iportal.formelement.ComboBox.superclass.constructor.call(this, config);
};

Ext.extend(iportal.formelement.ComboBox, Ext.form.ComboBox,  {
	 /**
     * @cfg {Boolean} required ,to specify whether this field is mandatory (defaults to false)
     */
    required : false,
	
	conditional : false,
	/**
     * @cfg {Object} bundleKey ,key used by resource to lookup bundle(defaults to '')
     */
	combundleKey : '',
	
	/**
     * @cfg {Boolean} includeSelect ,to specify whether combobox's first option is select or not
	 * (defaults to true)
     */
	includeSelect : true,
	
	/**
     * @cfg {String} defaultValue ,initially Selected value for this combo(defaults to '')
     */
	defaultValue : '',
	/**
     * @cfg {String} rawKeys ,raw keys to be set in the combo in the absence of bundle(defaults to null)
     */
	rawKeys : [],
	/**
     * @cfg {String} rawValues ,raw values to be set in the combo in the absence of bundle(defaults to null)
     */
	rawValues : [],
	
	plainLabel : '',
	fireEventOnSingleSelect : true,
	/**
     * @cfg {String} replaceEntityReference ,true to make replace entity references in combo displayfield
     */
	replaceEntityReference : false,
	
	cls : 'x-form-combo',
	ctCls:'custom-columnwidth',
	/*ANZ formelement cleanup */
	width:142,
	
     // private
	initComponent:function(){

	iportal.formelement.ComboBox.superclass.initComponent.apply(this, arguments);
	
	var combundle;
	var commonbundle = CRB.getFWBundle();
	if(Ext.isEmpty(this.combundleKey)){
		var parentComp = this.findParentByType('iportal-formpanel') || this.findParentByType('iportal-fluidform');
		if (parentComp)
			this.combundleKey = parentComp.bundleKey;
	}
	try{

		combundle = CRB.getBundle(this.combundleKey);
	}
	catch(e){				
	}
	if(!this.fieldLabel)
		this.fieldLabel = "LBL_"+this.id;
	// This is to make sure that when data is posted combo's value should go to server.
	// For the purpose we can utilise the hiddenName attribute of the combobox
	var idTemp = this.id;
	this.hiddenName = idTemp ;
	this.id = '$$_'+ idTemp ;

	var that = this;
	if(combundle !== null)	{
			this.plainLabel = combundle[this.fieldLabel];
		if(this.required) {
		    
            //this.blankText = String.format(commonbundle['ERR_MANDATORY'] , this.plainLabel);	
			this.blankText = String.format(commonbundle['ERR_MANDATORY_COMBOBOX'] , this.plainLabel);
			
			/*ANZ formelement cleanup */
			if(combundle[this.fieldLabel]==undefined)
				{
				this.fieldLabel='?'+this.fieldLabel+'?'+'<span class = \'mandatory\'">*</span>';
				}
				else
				{
				this.fieldLabel=combundle[this.fieldLabel]+'<span class = \'mandatory\'">*</span>';
				}
				
		}
		else if(this.conditional){
		    
            //this.blankText = String.format(commonbundle['ERR_MANDATORY'] , this.plainLabel);
			this.blankText = String.format(commonbundle['ERR_MANDATORY_COMBOBOX'] , this.plainLabel);
			
			try{
				if(combundle[this.fieldLabel]==undefined)
				{
					this.fieldLabel='?'+this.fieldLabel+'?'+'<span class = \'mandatory_fx\'">**</span>';
					
				}
				else
				{
					this.fieldLabel=combundle[this.fieldLabel]+'<span class = \'mandatory_fx\'">**</span>';
				}
				
			}
			catch(e){
				this.fieldLabel='?'+this.fieldLabel+'?'+'<span class = \'mandatory_fx\'">**</span>' ;
			}
		}
		else
		{
			try
			{
				this.fieldLabel= '<span class = \'non_mandatory\'"></span>' + combundle[this.fieldLabel];
			}
			catch(e)
			{
				this.fieldLabel= '<span class = \'non_mandatory\'"></span>' + '?' + this.fieldLabel + '?';
			}
		}
	}
	else
	{
		this.fieldLabel= '?' + this.fieldLabel + '?';
	}
	this.anchor = (this.anchor === undefined) ? '' : this.anchor ;
	this.editable = (this.editableField === undefined || this.editableField === '')? false : this.editableField ; 
	this.labelSeparator = '';
	this.triggerAction = 'all' ;
	this.mode='local'; 

	this.selectOnFocus = (this.selectOnFocus === undefined) ? true : this.selectOnFocus ;  
	
	var bundleCombo = combundle;
	
	if(this.store === undefined) {		
		if(this.data !== undefined && this.resourcePrefix !== undefined && bundleCombo !== null) {
				var prefix = this.resourcePrefix;
				// create a copy of the key array.copy function is available in jsPrototypes.js
				// copy function is used, as in js , variables are just references to objects and we
				// need a clone not a reference.
				var keyArray = this.data.copy();
				// walking through the array and creating another array based on the invoking array. 
				// In this case we are creating corresponding value array from the key array
				// walk function is available in jsPrototypes.js . 
				var valueArray = keyArray.walk(function(elt){
					return bundleCombo[prefix + elt];					
				});
				var dataArray = [];
				var rowArray;
				// If includeSelect config option has not been set off first element to be inserted 
				// into our dataArray is Select				
				if(this.includeSelect && this.data.length != 1) {
					rowArray = [];
					// Make sure the value field for Select option is nothing but a space 
					// to avoid confusion at server validations.
					rowArray.push(' ');
					rowArray.push(bundleCombo['LBL_SELECT']);
					dataArray.push(rowArray);				
				}
				 
				for(var i = 0 ; i < keyArray.length ; i++ ){
					rowArray = [];
					// ExtJs combo store accepts 2D array . In this case we have to create it from the key array
					// and value array
					//rowArray.push(this.resourcePrefix + keyArray[i]);
					rowArray.push( keyArray[i] );
					rowArray.push(valueArray[i]);
					dataArray.push(rowArray);
				}
			
			this.store = new Ext.data.SimpleStore({
				proxy :new Ext.data.HttpProxy( {}),
				fields: ['key', 'value'],
				data : dataArray
			});
			this.displayField = 'value';
			this.valueField  = 'key';
			if(this.includeSelect && this.data.length >1) {
				this.setValue(' ');
			}
			if(this.defaultValue != '') {
				
			}
			if(this.data.length == 1){
				this.value = keyArray[0];
				if(this.fireEventOnSingleSelect){
					this.fireEvent('select',this);
				}
			}
			if(this.includeSelect && this.data.length != 1) {
				this.setSelect();				
			}
		} else if(this.rawKeys !== null && this.rawValues !== null && bundleCombo !== null) {
				var rowArray = [];
				var dataArray = [];
				// If includeSelect config option has not been set off first element to be inserted 
				// into our dataArray is Select 
				if(this.includeSelect && this.rawKeys.length != 1) {
					// Make sure the value field for Select option is nothing but a space 
					// to avoid confusion at server validations.
					rowArray.push(' ');
					rowArray.push(bundleCombo['LBL_SELECT']);
					dataArray.push(rowArray);				
				}
				 
				for(var i = 0 ; i < this.rawKeys.length ; i++ ){
					rowArray = [];
					// 
					rowArray.push(this.rawKeys[i]);
					rowArray.push(this.rawValues[i]);
					dataArray.push(rowArray);
				}
			
				this.store = new Ext.data.SimpleStore({
					proxy :new Ext.data.HttpProxy( {}),
					fields: ['key', 'value'],
					data : dataArray
				});
				this.displayField = 'value';
				this.valueField  = 'key';
				if(this.includeSelect && this.rawKeys.length != 1) {
					this.setValue(' ');
				}	
				if(this.defaultValue !== '') {
					this.setValue(this.defaultValue);
				}	
				if(this.rawKeys.length == 1){
					this.value = this.rawKeys[0];
					if(this.fireEventOnSingleSelect){
						this.fireEvent('select',this);
					}
				}		
		}
		
	}
	this.on('blur',function(obj){
		this.mandatoryValidator(obj.value);
		
		/*if(this.validator && (typeof obj.validator()) == 'string'){	
			
			this.markInvalid(obj.validator());
			return false;				
		}else{
			
			this.clearInvalid();
			return true;
		}*/
	});
	this.on('select',function(obj){		
		this.mandatoryValidator(obj.value);
		/*if(this.validator && (typeof obj.validator()) == 'string'){			
			this.markInvalid(obj.validator());
			return false;
		}else{
			this.clearInvalid();
			return true;
		}	*/
	});
	}, 
	  
	 // private
    onRender : function(ct, position){
        iportal.formelement.ComboBox.superclass.onRender.call(this, ct, position);
    },
	//private
    initEvents : function(){
    	iportal.formelement.ComboBox.superclass.initEvents.call(this);
        this.on('select', this.changeSelect, this);
    },
    changeSelect : function(record, index){
        var v = this.getValue();
        if(String(v) !== String(this.startValue)){        	
            this.fireEvent('change', this, v, this.startValue);
        }
        this.startValue = v;
    },
	/**
     * function listening to blur event to see whether user had select a valid option incase of 
	 * mandatory fields
     * @param {var} v ,selected value of combo
     */
	mandatoryValidator : function(v){
		//  bundle to be changed. This should be common bundle
		combundle = CRB.getFWBundle();
		if(combundle !== null){
			
			if((v == ' ' && this.required) || (v == ' ' && this.conditional)){
			//if((v == '') && (this.required || this.conditional)){
				
				this.markInvalid(this.blankText);
			}else{
				this.clearInvalid();
			}
		}
		else {
			
			//if(v == ' ' && this.required){
			if((v == ' ' && this.required) || (v == ' ' && this.conditional)){
				
                //this.markInvalid('? ERR_MANDATORY ?');
				this.markInvalid('? ERR_MANDATORY_COMBOBOX ?');
				
			}
		}
	},
	/**
     * function to validate a combobox 
     */
	validateCombo : function(){
	combundle = CRB.getFWBundle()
		if(this.isSelectSelected() && this.required ) {
			this.markInvalid(this.blankText);
		}		
	},
	/**
	 * validate method of a field is depend on validateValue method
	 * which is to overridden by the subclasses
     * function to validate a combobox 
     */
	validateValue : function(){
		if(this.isSelectSelected() && this.required ) {
			return false;
		}	
		return true;	
	},
	/**
	* This method will select the Select option from the list. If select is already there. It will use
	* that, otherwise it will create a select option and use it.
	*/
	forceSelect : function(){
		var combundle = CRB.getBundle(this.combundleKey);
		var previousSelect = this.store.find('key',' ');
		if(previousSelect != -1){
			this.setSelect();
			return;
		}
		var newRecord = Ext.data.Record.create([
							{name: 'key', mapping: 'key'},
							{name: 'value', mapping: 'value'}
						]);
		var record = new newRecord({
				key: ' ',
				value: combundle['LBL_SELECT']
		});
		this.store.insert(0,[record]);
		this.store.commitChanges();	
		this.includeSelect = true;
		this.setSelect();
	},
	/**
     * function to set Select option as the value 
     */
	setSelect : function(){
		if(this.includeSelect) {
			this.setValue(' ');
		}
		else {
			this.setValue('');
		}
		this.validateCombo();
	},
	
	/**
     * function to check Select option has been selected
     */
	isSelectSelected : function(){
		var returnFlag = (this.getValue() == ' ' || this.getValue() == 'Select') ? true : false;
		return returnFlag;
	},
	
	/**
     * update the store of this combobox with new keys supplied.
     * @param {Array} arr containing value keys
     */
    updateComboStore : function(arr,prefix){
		combundle = CRB.getBundle(this.combundleKey);
		if(typeof arr != 'object') 
			return false;
		this.store.removeAll();
		if(arr.length == 0 )
		{
			this.store.commitChanges();
			// empties your store and return.
			return;
		}
		// create method returns an object which can act as a constructor for every records having 
		// the defined column model. This method should be used instead of using Record constructor
		// directly. See extJs docs for further details

		var newRecord = Ext.data.Record.create([
							{name: 'key', mapping: 'key'},
							{name: 'value', mapping: 'value'}
						]);
		var record;
	  if(this.includeSelect && (arr.length >1 || this.includeSelectOnSingleValue) ) {
		record = new newRecord({
							key: ' ',
							value: combundle['LBL_SELECT']
						});
		this.store.add( record );
		}
		var widthArr = [];
		var that = this;
		var text_metrics ;
		if(that.el){
			text_metrics = Ext.util.TextMetrics.createInstance(that.el);
	   	}else{
	    	text_metrics = Ext.util.TextMetrics.createInstance(Ext.getBody());
		}
		for(var i = 0 ; i < arr.length ; i++)
		{
			widthArr[i] = text_metrics.getWidth(combundle[prefix + arr[i]]);
			record = new newRecord({
							key: arr[i],
							value: combundle[prefix + arr[i]]
						});
			this.store.add( record );
			
		}		
		var maxWidth = 0;
		
		Ext.each(widthArr,function(item){
			if(parseInt(item) > maxWidth){
				maxWidth = parseInt(item);
			}
		},this);
		var standardWidth = (this.getWidth()) ? this.getWidth() : 170;
		if(standardWidth < maxWidth){
			this.listWidth = maxWidth + 19;
			that.listWidth = (that.listWidth > 220) ? 220 : that.listWidth ;
		}
		if(this.includeSelect &&  (arr.length >1 || this.includeSelectOnSingleValue)) {
			this.setSelect();
		}
		if( arr.length == 1){
			this.setValue(arr[0]);
			if(this.fireEventOnSingleSelect){
				this.fireEvent('select',this);
			}
		}
		this.store.commitChanges();
		this.clearInvalid();
		return true;
    },

	/**
     * update the store of this combobox with new keys and values supplied.
     * @param {Array} arr containing value keys
     */
    updateComboRawStore : function(keyArr,valueArr){
    	////alert(keyArr+'\n\n\n'+valueArr);
       	combundle = CRB.getBundle(this.combundleKey);
		if(keyArr.length !== valueArr.length )  
		{
			// keys and values should be arrays of same length
			return;
		}
		if(this.store === undefined){
			this.store = new Ext.data.SimpleStore({
				proxy :new Ext.data.HttpProxy( {}),
				fields: ['key', 'value']
			});
		}
		this.store.removeAll();
		// create method returns an object which can act as a constructor for every records having 
		// the defined column model. This method should be used instead of using Record constructor
		// directly. See extJs docs for further details

		var newRecord = Ext.data.Record.create([
							{name: 'key', mapping: 'key'},
							{name: 'value', mapping: 'value'}
						]);
		var record;
		
		if(this.includeSelect &&  (keyArr.length >1 || this.includeSelectOnSingleValue)) {
			record = new newRecord({
								key: ' ',
								value: combundle['LBL_SELECT']
							});
			this.store.add( record );
		}
		
		var widthArr = [];
		var that = this;
		if(that.el){
			text_metrics = Ext.util.TextMetrics.createInstance(that.el);
	   	}else{
	    	text_metrics = Ext.util.TextMetrics.createInstance(Ext.getBody());
		}
		for(var i = 0 ; i < keyArr.length ; i++)
		{
			widthArr[i] = text_metrics.getWidth(valueArr[i]);
			record = new newRecord({
							key: keyArr[i],
							value: valueArr[i]
						});
			this.store.add( record );
		}
				
		var maxWidth = 0;
		
		Ext.each(widthArr,function(item){
			if(parseInt(item) > maxWidth){
				maxWidth = parseInt(item);
			}
		},this);
		var standardWidth = (that.getWidth()) ? that.getWidth() : 170;
		
		if(standardWidth < maxWidth){
			that.listWidth = maxWidth + 19;
			that.listWidth = (that.listWidth > 220) ? 220 : that.listWidth ;
		}
		if(this.includeSelect &&  (keyArr.length >1 || this.includeSelectOnSingleValue)) {
			this.setSelect();
		}
		/*
		 * Included the following condition just to make sure that 'Select' gets selected by default in the Combo when the length is 1
		 */
		if( keyArr.length == 1 )
		{
			if( this.includeSelectOnSingleValue){
				this.setValue(' ');
			/*if(this.fireEventOnSingleSelect){
				this.fireEvent('select',this);
			}*/
			}
			else
			{
				this.setValue(keyArr[0]);
				if(this.fireEventOnSingleSelect){
					this.fireEvent('select',this);
				}
			}
		}
		
		this.store.commitChanges();
		this.clearInvalid();
		return true;
    },
/*Start PEG-Preferences To remove the Select in the combo box by default*/
			/**
     * update the store of this combobox with new keys and values supplied.
     * @param {Array} arr containing value keys
     */
    updateComboRawStoreNoSelect : function(keyArr,valueArr){
    	////alert(keyArr+'\n\n\n'+valueArr);
       	combundle = CRB.getBundle(this.combundleKey);
		if(keyArr.length !== valueArr.length )  
		{
			// keys and values should be arrays of same length
			return;
		}
		if(this.store === undefined){
			this.store = new Ext.data.SimpleStore({
				proxy :new Ext.data.HttpProxy( {}),
				fields: ['key', 'value']
			});
		}
		this.store.removeAll();
		// create method returns an object which can act as a constructor for every records having 
		// the defined column model. This method should be used instead of using Record constructor
		// directly. See extJs docs for further details
		var newRecord = Ext.data.Record.create([
							{name: 'key', mapping: 'key'},
							{name: 'value', mapping: 'value'}
						]);
		var record;
		/*if(this.includeSelect && keyArr.length >1) {
			record = new newRecord({
								key: ' ',
								value: combundle['LBL_SELECT']
							});
			this.store.add( record );
		}*/
		var widthArr = [];
		var that = this;
		if(that.el){
			text_metrics = Ext.util.TextMetrics.createInstance(that.el);
	   	}else{
	    	text_metrics = Ext.util.TextMetrics.createInstance(Ext.getBody());
		}
		for(var i = 0 ; i < keyArr.length ; i++)
		{
			widthArr[i] = text_metrics.getWidth(valueArr[i]);
			record = new newRecord({
							key: keyArr[i],
							value: valueArr[i]
						});
			this.store.add( record );
		}
		var maxWidth = 0;
		Ext.each(widthArr,function(item){
			if(parseInt(item) > maxWidth){
				maxWidth = parseInt(item);
			}
		},this);
		var standardWidth = (that.getWidth()) ? that.getWidth() : 170;
		if(standardWidth < maxWidth){
			that.listWidth = maxWidth + 19;
			that.listWidth = (that.listWidth > 220) ? 220 : that.listWidth ;
		}
		if(this.includeSelect &&  (keyArr.length >1 || this.includeSelectOnSingleValue)) {
			this.setSelect();
		}
		if( keyArr.length == 1 )
		{
			if( this.includeSelectOnSingleValue){
				this.setValue(' ');
			/*if(this.fireEventOnSingleSelect){
				this.fireEvent('select',this);
			}*/
			}
			else
			{
				this.setValue(keyArr[0]);
				if(this.fireEventOnSingleSelect){
					this.fireEvent('select',this);
				}
			}
		}
		this.store.commitChanges();
		this.clearInvalid();
		return true;
    },
	/**
     * returns the width of this component &#46; This is different from listwidth of view,which
	 * will decide the width of the component in open state&#46;
     * @return {Num} this&#46;width &#46; The width of the component.
     */
    getWidth : function(){
		return this.width;	
    },
	/**
     * Returns the value field for selected option
     */
    getValue : function(){
    	if(this.store){
	    	for(var recIndex = 0;recIndex < this.store.getCount();recIndex++ ){
	    		if((this.store.getAt(recIndex).data.key === this.value) ||(this.store.getAt(recIndex).data.value === this.value) ){
	    			return this.store.getAt(recIndex).data.key;
	    		}
	    	}
    	}
		return this.value;
    },
	isVisible : function(){
		return iportal.formelement.ComboBox.superclass.isVisible.apply(this, arguments);  
	},
	afterRender:function(){        
		iportal.formelement.ComboBox.superclass.afterRender.apply(this, arguments); 
		var that = this;   
		this.on('select',function(obj){
			if(this.replaceEntityReference){
				var storeCombo = obj.store;
				var storeComboCount = storeCombo.getCount();	
				for(var index=0;index<storeComboCount;index++){
					var rowobject;											
					rowobject = storeCombo.getAt(index).data;																							
					if(rowobject.key === obj.value){
						rowobject.value = rowobject.value+"";
						rowobject.value = that.escapeEntites(rowobject.value); 
						that.setValue(rowobject.key);
						rowobject.value = that.unescapeEntites(rowobject.value); 	
					}
				}
			}
			return true;			
		});	
		var widthArr = [];
		var keyArray = [];
		var valueArray = [];
		if(that.store.getCount() > 0){
			that.store.each(function(rec){
				keyArray.push(rec.data.key);
				valueArray.push(rec.data.value);
			});
			if(that.el){
				text_metrics = Ext.util.TextMetrics.createInstance(that.el);
		   	}else{
		    	text_metrics = Ext.util.TextMetrics.createInstance(Ext.getBody());
			}
			for(var i = 0 ; i < keyArray.length ; i++) {
				widthArr[i] = text_metrics.getWidth(valueArray[i]);			
			}	
				
			var maxWidth = 0;				
			Ext.each(widthArr,function(item){
			if(parseInt(item) > maxWidth){
				maxWidth = parseInt(item);
				}
			},this);
			if(170 < maxWidth){
				that.listWidth = maxWidth + 19;
				that.listWidth = (that.listWidth > 220) ? 220 : that.listWidth ;
			}
		}	
	},
	escapeEntites : function(str){
		return str.replace('&lt;','<').replace('&gt;','>').replace('&quote;','"').replace('&nbsp;',' ');
	},
	unescapeEntites : function(str){
		return str.replace('<','&lt;').replace('>','&gt;').replace('"','&quote;').replace(' ','&nbsp;');
	},
	getDisplayValue : function(key){
		var that = this;
		var storeCombo = that.store;
		var storeComboCount = storeCombo.getCount();
		var rowobject;		
		for(var index=0;index<storeComboCount;index++){													
			rowobject = storeCombo.getAt(index).data;																							
			if(rowobject.key === key){
				return rowobject.value;	
			}
		}
		return key;
	},
	getPrintData : function(){
		var label = this.plainLabel;
		var fieldValue = this.getDisplayValue(this.getValue());
		var printMap = {};
		printMap[label] = fieldValue;
		return printMap;
	},
	/**
     * update the store of this combobox with new keys and values supplied. 
	 * Here wrapping of text inside combo box not done. If text wrapping need to be
     * done use the method updateComboRawStore defned above
     * @param {Array} arr containing value keys
     */
    updateComboNoWrapRawStore : function(keyArr,valueArr){
       	var combundle = CRB.getBundle(this.combundleKey);
		if(keyArr.length !== valueArr.length )  
		{
			// keys and values should be arrays of same length
			return;
		}
		if(this.store === undefined){
			this.store = new Ext.data.SimpleStore({
				fields: ['key', 'value']
			});
		}
		this.store.removeAll();
		// create method returns an object which can act as a constructor for every records having 
		// the defined column model. This method should be used instead of using Record constructor
		// directly. See extJs docs for further details

		var newRecord = Ext.data.Record.create([
							{name: 'key', mapping: 'key'},
							{name: 'value', mapping: 'value'}
						]);
		var record;
		
		if(this.includeSelect &&  (keyArr.length >1 || this.includeSelectOnSingleValue)) {
			record = new newRecord({
								key: ' ',
								value: combundle['LBL_SELECT']
							});
			this.store.add( record );
		}
		
		var that = this;
		
		for(var i = 0 ; i < keyArr.length ; i++)
		{
			record = new newRecord({
							key: keyArr[i],
							value: valueArr[i]
						});
			this.store.add( record );
		}
				
		var maxWidth = 0;		
		
		if(this.includeSelect &&  (keyArr.length >1 || this.includeSelectOnSingleValue)) {
			this.setSelect();
		}
		if( keyArr.length == 1 )
		{
			if( this.includeSelectOnSingleValue){
				this.setValue(' ');
			/*if(this.fireEventOnSingleSelect){
				this.fireEvent('select',this);
			}*/
			}
			else
			{
				this.setValue(keyArr[0]);
				if(this.fireEventOnSingleSelect){
					this.fireEvent('select',this);
				}
			}
		}
		this.store.commitChanges();
		this.clearInvalid();
		return true;
    },
    onTriggerClick : function(){
    /*	var tgt = Ext.EventObject.getTarget();
    	var triggerPattern = /<IMG/i; 
    	if(!triggerPattern.test(tgt.outerHTML)){
    		return;
    	}*/
    	iportal.formelement.ComboBox.superclass.onTriggerClick.apply(this, arguments); 
    }
});

Ext.reg('iportal-combobox', iportal.formelement.ComboBox);


/**
 * @class iportal.formelement.DateField
 * @extends Ext.form.DateField
 * Base class to customize a datefield display in a form layout.
 * @constructor
 * Creates a new DateField Field
 * @param {Object} config Configuration options
 * 
 */

iportal.formelement.DateField = function(config){
    this.name = config.name || config.id;
    iportal.formelement.DateField.superclass.constructor.call(this, config);
};

Ext.extend(iportal.formelement.DateField, Ext.form.DateField,  {
	 /**
    * @cfg {String/Object} required ,to specify whether this field is mandatory (defaults to false)
    */
   required : false,
	
	conditional : false,
	
	/**
    * @cfg {Object} bundleKey ,key used by resource to lookup bundle(defaults to '')
    */
	bundleKey : '',
	/**
    * @cfg {Object} submitFormat ,this is the format used for submitting the data irrespective of the 
	 *	preferences settings and display.
    */
	submitFormat:'d/m/Y',
	
	plainLabel : '',
	cls:'x-form-dateField',
	ctCls:'custom-columnwidth', 
	
    // private
	initComponent:function(){
		if(this.disabledDates!=null &&this.disabledDates.length<1){
			this.disabledDates=null;
		} 
		iportal.formelement.DateField.superclass.initComponent.apply(this, arguments);	
		var that = this;
		
		var bundle;
		var commonbundle = CRB.getFWBundle();
		if(!this.fieldLabel){
			this.fieldLabel = "LBL_"+this.id;
		}
		// This is an ext bug as when in IE dont like name and id to be same in datefields
		// which are manipulating with menu listeners.
		var _id =  this.id;
		this.id = "DATE_" + _id;
		this.name = _id;
		
		/*
		3.1 readOnly attribute hides trigger. So put editable as false
			this.readOnly = true;		
		*/
		this.editable = false;
		
		this.format = canvas.datePreferences.getDateFormat();			
		if(Ext.isEmpty(this.bundleKey)){
			var parent = this.findParentByType('iportal-fluidform')|| this.findParentByType('iportal-formpanel');
			this.bundleKey = parent.bundleKey;
			//if(!this.bundleKey)
			//	this.bundleKey = this.findParentByType('iportal-fluidform').bundleKey;
		}		
			try{
				bundle = CRB.getBundle(this.bundleKey);
				if(this.fieldLabel)
				this.plainLabel = bundle[this.fieldLabel];
			}
			catch(e){
		}
		
		if(this.required){
			try{
			     
                //this.blankText = String.format(commonbundle['ERR_MANDATORY'] , bundle[this.fieldLabel]);
				this.markInvalid('? ERR_MANDATORY_COMBOBOX ?');
				
				/*ANZ formelement cleanup */
				if(bundle[this.fieldLabel]==undefined)
				{
					this.fieldLabel='?'+this.fieldLabel+'?'+'<span class = \'mandatory\'">*</span>';
				}
				else
				{
					this.fieldLabel=bundle[this.fieldLabel]+'<span class = \'mandatory\'">*</span>';
				}
				
			}
			catch(e){
				this.fieldLabel='?' + this.fieldLabel + '?'+'<span class = \'mandatory\'">*</span>' ;
			}
			this.allowBlank=false;
		}
		else if(this.conditional){
			try{
				if(bundle[this.fieldLabel]==undefined)
				{
					this.fieldLabel='?'+this.fieldLabel+'?'+'<span class = \'mandatory_fx\'">**</span>';
					
				}
				else
				{
					this.fieldLabel=bundle[this.fieldLabel]+'<span class = \'mandatory_fx\'">**</span>';
				}
				
			}
			catch(e){
				this.fieldLabel='?'+this.fieldLabel+'?'+'<span class = \'mandatory_fx\'">**</span>' ;
			}
		}
		else{
			try{
				this.fieldLabel= '<span class = \'non_mandatory\'"></span>' + bundle[this.fieldLabel];
			}
			catch(e){
				this.fieldLabel= '<span class = \'non_mandatory\'"></span>' + this.fieldLabel + '?';
			}
		}
		this.invalidText = String.format(this.invalidText , this.fieldLabel, this.format);
		this.labelSeparator = '';
		this.anchor = (this.anchor == undefined) ? '' : this.anchor ;
		// This is to ensure that the select on date menu is actually bubbling it to date field, as whoever using 
		// the datefield maynot be directly interacting with menu. 
		this.menuListeners = {
							select: function(m, d){								
								that.setValue(d.format(that.format));
								that.fireEvent('select', that);
							},
							show: function(){ 
								that.onFocus();
							},
							hide: function(){
								that.focus.defer(10, that);
								var ml = that.menuListeners;
								that.menu.un("select", ml.select, that);
								that.menu.un("show", ml.show, that);
								that.menu.un("hide", ml.hide, that);
							}
			}
		this.clearInvalid();   
	},
   
	/**
    * Sets the format of this datefield &#46; 
    * @param {String} f The format string value to set
	 * Supported Formats are
	 * 'd/m/Y' (defaults to this format) eg: 04/11/08 - 4th November 2008
	 * 'm/d/Y'  eg: 07-11-08 - 7th November 2008
	 * 'd-m-y'  eg: 07-11-08 - 7th November 2008
	 * 'd-m-Y'  eg: 06-11-2008 - 6th November 2008   
	 * 'd.m.Y'  eg: 06.11.2008 - 6th November 2008   
	 * 'd.m.y'  eg: 06.11.08 - 6th November 2008
	 * 'm.d.Y'  eg: 11.05.2008 - 5th November 2008
	 * 'm.d.y'  eg: 11.05.08 - 5th November 2008
    */
   setFormat : function(f){
       this.format  = f;		
   },


   setValue : function(date){
	   var that= this;
	   var commonbundle = CRB.getFWBundle()
       if(this.disabledDates!=null && this.disabledDates.length>0){
       	for(var i=0; i< this.disabledDates.length; i++){  
       		if(date==iportal.jsutil.convertDateValueToUserPreferedFmt(this.disabledDates[i])){
       			var errorMessageWindow = new iportal.Dialog({
       				dialogType : 'ERROR',
       				message: commonbundle['LBL_SELECTED']+" "+this.plainLabel+" "+commonbundle['LBL_DATE_IS_HOLIDAY'],
       				cls:'portal_neg_btn',
       				title : commonbundle['LBL_ERROR'],
       				okHandler : function(){
       					errorMessageWindow.close();
       					that.setValue("");
       				}
       			});
       			errorMessageWindow.show();
       		}
       	}
       }
       return iportal.formelement.DateField.superclass.setValue.call(this, this.formatDate(this.parseDate(date)));
   },

   getPrintData : function(){
		var label = this.plainLabel;
		var fieldValue = this.getValue();
		if(Ext.isDate(fieldValue)){
			fieldValue = fieldValue.format(this.format);
		}
		var printMap = {};
		printMap[label] = fieldValue;
		return printMap;
	},
	// Override the onRender method to insert a hidden field to store the format of the 
	// datefield.
	onRender:function() {        
		iportal.formelement.DateField.superclass.onRender.apply(this, arguments);        
		var name = this.name || this.el.dom.name;  
		if(this.value){
			this.hiddenField = this.el.insertSibling({             
				tag:'input'            
				,type:'hidden'           
				,name:name          
				,value:this.formatHiddenDate(this.parseDate(this.value))      
			});   
		}else{
			this.hiddenField = this.el.insertSibling({             
				tag:'input'            
				,type:'hidden'           
				,name:name          
				,value:''      
			});  
		}
		this.hiddenName = name; 
		// prevent input submission
		this.el.dom.removeAttribute('name');        
		this.el.on({            
			keyup:{scope:this, fn:this.updateHidden}      
			,blur:{scope:this, fn:this.updateHidden}       
		}); 		
		this.setValue = this.setValue.createSequence(this.updateHidden); 			
		}
	// Ensure that once the field is disabled, the hidden uniquely formatted data also dont get posted 
	,onDisable: function(){    
		iportal.formelement.DateField.superclass.onDisable.apply(this, arguments);        
		if(this.hiddenField) {            
		this.hiddenField.dom.setAttribute('disabled','disabled');      
			}   
		} 
	// do the reverse on enabling 
	,onEnable: function(){      
		iportal.formelement.DateField.superclass.onEnable.apply(this, arguments);  
		if(this.hiddenField) {       
		this.hiddenField.dom.removeAttribute('disabled');     
		}
		} 
	// formats the hidden stored date with submit format specified
	,formatHiddenDate : function(date){     
		return Ext.isDate(date) ? Ext.util.Format.date(date, this.submitFormat) : date; 
		}
	// method to store the datefield with latest data clicked. This method will be
	// called on every events which can alter the value od datefield.
	,updateHidden:function() {     
		this.hiddenField.dom.value = this.formatHiddenDate(this.getValue()); 
	},
	// default override for isVisible
	isVisible : function(){
		return iportal.formelement.DateField.superclass.isVisible.apply(this, arguments);  
	},
	validateValue : function(value){
		
		if(this.minValue){
			this.minValue.setHours(0);
			this.minValue.setMinutes(0);
			this.minValue.setSeconds(0);
			this.minValue.setMilliseconds(0);
		}
        value = this.formatDate(value);
        if(!Ext.form.DateField.superclass.validateValue.call(this, value)){
            return false;
        }
        if(value.length < 1){ // if it's blank and textfield didn't flag it then it's valid
             return true;
        }
        var svalue = value;
        value = this.parseDate(value);
        if(!value){
            this.markInvalid(String.format(this.invalidText, svalue, this.format));
            return false;
        }
        var time = value.getTime();
        if(this.minValue && time < this.minValue.getTime()){
       		this.markInvalid(String.format(this.minText, this.formatDate(this.minValue)));
            return false;
        }
        if(this.maxValue && time > this.maxValue.getTime()){
            this.markInvalid(String.format(this.maxText, this.formatDate(this.maxValue)));
            return false;
        }
        if(this.disabledDays){
            var day = value.getDay();
            for(var i = 0; i < this.disabledDays.length; i++) {
            	if(day === this.disabledDays[i]){
            	    this.markInvalid(this.disabledDaysText);
                    return false;
            	}
            }
        }
        var fvalue = this.formatDate(value);
      
        if(this.ddMatch && this.ddMatch.test(fvalue)){
            this.markInvalid(String.format(this.disabledDatesText, fvalue));
            return false;
        }
        return true;
    },
    clearDate : function(fieldObj){
		fieldObj.setValue('');
		if(fieldObj.menu) fieldObj.menu.hide();
		fieldObj.clearInvalid();		
	},
	// override to implement clear button inside datepicker
	onTriggerClick : function(){
		if(this.disabled){
            return;
        }
        /*var tgt = Ext.EventObject.getTarget();
    	var triggerPattern = /<IMG/i; 
    	if(!triggerPattern.test(tgt.outerHTML)){
    		return;
    	}*/
        if(this.menu == null){
            this.menu = new Ext.menu.DateMenu({
                hideOnClick: false,
                focusOnSelect: false
            });
        }
        this.onFocus();
        Ext.apply(this.menu.picker,  {
            minDate : this.minValue,
            maxDate : this.maxValue,
            disabledDatesRE : this.disabledDatesRE,
            disabledDatesText : this.disabledDatesText,
            disabledDays : this.disabledDays,
            disabledDaysText : this.disabledDaysText,
            format : this.format,
            showToday : this.showToday,
            minText : String.format(this.minText, this.formatDate(this.minValue)),
            maxText : String.format(this.maxText, this.formatDate(this.maxValue))
        });
        this.menu.on(Ext.apply({}, this.menuListeners, {
            scope:this
        }));
        var that = this;
        this.menu.picker.setValue(this.getValue() || new Date());
        this.menu.picker.clearFn = function(){that.clearDate(that);};
        this.menu.show(this.el, "tl-bl?");
        this.menuEvents('on');
    }
});

Ext.reg('iportal-datefield', iportal.formelement.DateField);


/**
 * @class iportal.formelement.AmountField
 * @extends Ext.form.TextField
 * Base class to customize a textfield display amount in a form layout.
 * @constructor
 * Creates a new AmountField Field
 * @param {Object} config Configuration options
 * 
 */

iportal.formelement.AmountField = function(config){
    this.name = config.name || config.id;
    iportal.formelement.AmountField.superclass.constructor.call(this, config);
};

Ext.extend(iportal.formelement.AmountField, Ext.form.TextField,  {
	 /**
    * @cfg {String/Object} required ,to specify whether this field is mandatory (defaults to false)
    */
   required : false,
   
   conditional:false,
   
   width:175,
   // changed for dynamic amount values 
   maxLength : 'undefined',

   // changed for dynamic amount values 
   integrallength : false,
   
   // changed for dynamic amount values 
   decimallength : false,
   cls : 'x-form-textField',	
	/**
    * @cfg {Object} bundleKey ,key used by resource to lookup bundle(defaults to '')
    */
	bundleKey : '',
	// this will specify the number of sif=gnificant digits after the decimal point
	// for the amount.This will depends on currency and to be provided by the 
	// application. Defaults to 2
	signdigits : 2,
	
	plainLabel : '',
	customValidator :Ext.emptyFn,
	ccyField:'', 

    // private
	initComponent:function(){
		iportal.formelement.AmountField.superclass.initComponent.apply(this, arguments);
		var bundle;
		var commonbundle = CRB.getFWBundle()
		if(!this.fieldLabel){
			this.fieldLabel = "LBL_"+this.id;
		}
		// All amount field values sent to Server will be suffixed with '_AMT'. This should 
		// be followed through out the application
		this.name =  this.id + '_AMT';
		if(Ext.isEmpty(this.bundleKey)){
			this.bundleKey = this.findParentByType('iportal-formpanel').bundleKey;
		}
			try{

				bundle = CRB.getBundle(this.bundleKey);
			}
			catch(e){
		}
		// In portal allowed maximum length for an amount will be 28 digits before
		// decimal point and 5 points after like , xxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxx
		// changes done for investments topup .Since investment amount is size of 24.4		
		//this.maxLength = 34;
		//this.integrallength = 28;
		//this.decimallength = 5;
		
		//this.maxLength = (this.maxLength == 'undefined') ? 34 : this.maxLength ;		
		//this.integrallength = (this.integrallength == 'undefined') ? 28 : this.integrallength ;
		//this.decimallength = (this.decimallength == 'undefined') ? 5 : this.decimallength ;
		
		if(this.decimallength === 0){
			this.decimallength = 0;
		}else{
			this.decimallength = this.decimallength || 2;
		}
		this.integrallength = this.integrallength || 28;
		
		if(this.integrallength && this.decimallength){
			this.maxLength = Number(this.decimallength) + Number(this.integrallength) + 1 ;
		}
		
		
		
		//this.signdigits = (this.decimallength == 0 ) ? 0 : 2 ;		
		
		if(bundle != null) {	
			if(this.fieldLabel)
			this.plainLabel = bundle[this.fieldLabel];		
			if(this.required){
			   
	           //this.blankText = String.format(commonbundle['ERR_MANDATORY'] , bundle[this.fieldLabel]);
				this.blankText = String.format(commonbundle['ERR_MANDATORY_AMOUNTFIELD'] , bundle[this.fieldLabel]);
				
				/*ANZ formelement cleanup */
				if(bundle[this.fieldLabel]==undefined)
				{
					this.fieldLabel='?'+this.fieldLabel+'?'+'<span class = \'mandatory\'">*</span>';
				}
				else
				{
					this.fieldLabel=bundle[this.fieldLabel]+'<span class = \'mandatory\'">*</span>';
				}
			
				this.allowBlank=false;
			}
			else if(this.conditional){
			    
//				this.blankText = String.format(commonbundle['ERR_MANDATORY'] , bundle[this.fieldLabel]);
				this.blankText = String.format(commonbundle['ERR_MANDATORY_AMOUNTFIELD'] , bundle[this.fieldLabel]);
				
				try{
					if(bundle[this.fieldLabel]==undefined)
					{
						this.fieldLabel='?'+this.fieldLabel+'?'+'<span class = \'mandatory_fx\'">**</span>';
						
					}
					else
					{
						this.fieldLabel=bundle[this.fieldLabel]+'<span class = \'mandatory_fx\'">**</span>';
					}
					
				}
				catch(e){
					this.fieldLabel='?'+this.fieldLabel+'?'+'<span class = \'mandatory_fx\'">**</span>' ;
				}
			}
			else 
				this.fieldLabel = '<span class = \'non_mandatory\'"></span>' +bundle[this.fieldLabel];
		}
		else {
				this.fieldLabel = '?' + this.fieldLabel + '?';
		}
		if(bundle != null) {
			this.maxLengthText = String.format(commonbundle['ERR_MAXLENGTH_EXCEED_AMOUNT'],this.plainLabel,this.integrallength,this.decimallength);			
		}
		this.maskRe = /[0-9.,]/ ;	
		
		this.anchor = (this.anchor == undefined) ? '' : this.anchor ;
		this.labelSeparator = '';			
		this.validationEvent=false;			
		this.on('blur',function(obj){
			this.amountfieldMandatoryValidator(obj.value);
			this.checkFormatter(obj);
			if(this.errorIcon){
				if(this.errorIcon.dom.qtip != ''){
					this.unCleared = true;	
				}
			}
		});
		this.setValue = this.setValue.createSequence(this.updateHidden); 
	},
	/**
	 *
	 * - This API takes the currency from the currField of the amountfield
	 * components returns the decimal place value for the currency.
	 * - if the currency is not found from in cache, it takes the bank's
	 * default currency from the preference
	 * - if the currency is also not found from the preference, it takes the
	 * default currency configured in the orbionedirect properties file.
	 * - Finally updates the this.signdigits with the decimal place value
	 * obtained for the respective currency.
	 * 
	 */
	updateCurrField: function(){
		var currDecimalPlaceList = cbx.globalcurrency.metadata.getCurrDecimalPlaceList();
		var currfield = this.ccyField;
		var curr = Ext.getCmp(currfield).text;
		if(!curr || curr.trim() == ''||curr ==''){
			// get the default curr from preference.
			curr = iportal.systempreferences.getDefaultBankCCY();
			if(!curr || curr.trim() == ''|| curr ==''){
				// get the default curr configured in the orbidirect properties.
				curr = cbx.globalcurrency.metadata.getDefaultCurrency();		
			}
		}
		
		if(curr && curr != '' && curr.trim() != ''){
			var currList=Ext.decode(currDecimalPlaceList);
			var currBasedDecimal = currList[curr];
			this.signdigits = currBasedDecimal; 
		}
	},
	
	
	/*isValid:function(){
		if(this.errorIcon && this.errorIcon.dom.qtip != '')
			return false;
			
		return true;
	},*/
	/**
     * Clear any invalid styles/messages for this field
    */
    validate : function(){
		
		
        if(this.disabled || this.validateValue(this.getValue())){
            this.clearInvalid();
            return true;
        }
        return false;
    },

    clearInvalid : function(){
    	if(this.unCleared){
    		this.unCleared = false;
    		return;
    	}
        if(!this.rendered || this.preventMark){ // not rendered
            return;
        }
        this.el.removeClass(this.invalidClass);
        switch(this.msgTarget){
            case 'qtip':
                this.el.dom.qtip = '';
                break;
            case 'title':
                this.el.dom.title = '';
                break;
            case 'under':
                if(this.errorEl){
                    Ext.form.Field.msgFx[this.msgFx].hide(this.errorEl, this);
                }
                break;
            case 'side':
                if(this.errorIcon){
                    this.errorIcon.dom.qtip = '';
                    this.errorIcon.hide();
                    this.un('resize', this.alignErrorIcon, this);
                }
                break;
            default:
                var t = Ext.getDom(this.msgTarget);
                t.innerHTML = '';
                t.style.display = 'none';
                break;
        }
        this.fireEvent('valid', this);
    },

	/*
	* listening to blur event for amountfield to do format check and further validation
	*/
	checkFormatter : function(obj){
			val =obj.getValue().trim();	
			this.updateHidden();			
			var that = this;			
			var bundle = CRB.getBundle(this.bundleKey);
			var crb = CRB.getFWBundle()
			var res = that.checkAmountInsideMaxLength(that.getValue());
			// MaskRe will not restrict Copy pasting special chars.
			//This code is introduced to validate the special chars pasted.
			val = val.replace(/,/g, "");
			if(isNaN(val)){
				that.markInvalid(crb['ERR_INVALID_AMT_FIELD']);
				return;
			} 			
			if(res === 'invalid'){
				return;
			}
			if(! res){
					that.markInvalid(that.maxLengthText);
					return;
			}
			if(val === ''){
				if(that.required)
				
           //	that.markInvalid(String.format(crb['ERR_MANDATORY'],that.plainLabel));	
				that.markInvalid(String.format(crb['ERR_MANDATORY_AMOUNTFIELD'],that.plainLabel));
				
				return;				
			}else{
				that.clearInvalid();
				val =obj.getValue().trim();	
				var StringNumber = canvas.amountFormatter.getInstance();
				this.setValue(StringNumber.basicFormatter(val.replace(/,/g, ""),this.signdigits));
				
			}
			if(that.checkAmountInsideMaxLength(that.getValue())){
					that.clearInvalid();
			}			
			if(that.validator && (typeof that.validator(that.getValue()) == 'string')){
				that.markInvalid(that.validator(that.getValue()));
				Ext.EventObject.stopEvent();
				return;
			}		

			that.customValidator(that.getValue());					
	},
	getPrintData : function(){
		var label = this.plainLabel;
		var fieldValue = this.getValue();
		var printMap = {};
		printMap[label] = fieldValue;
		return printMap;
	},
	checkAmountInsideMaxLength : function(val){
	 	var maxDigits = this.integrallength;
	 	var maxDecimals = this.decimallength; 
	 	var amount_arr = val.split('.');	 	
	 	var crb = CRB.getFWBundle()
	 	if(amount_arr.length == 2){
	 		if(( amount_arr[0].length <= maxDigits ) && ( amount_arr[1].length <= maxDecimals )){
	 			return true;
	 		}else{
	 			return false;
	 		}
	 	}else if(amount_arr.length == 1){
	 		if( amount_arr[0].length <= maxDigits ){
	 			return true;
	 		}else{
	 			return false;
	 		}
	 	}
	 	else{
	 		this.markInvalid(crb['ERR_INVALID_AMT_FIELD']);
	 		return 'invalid';
	 	}
	},
	afterRender:function() {       
		iportal.formelement.AmountField.superclass.afterRender.apply(this, arguments);    
		var formpanelLayer = this.findParentByType('iportal-formpanel') || this.findParentByType('iportal-fluidform');
		formpanelLayer.add({xtype:'hidden',name: this.id,id:this.id.concat('_HIDDEN'),value:''});
		this.updateHidden();
	},
	updateHidden:function() {   
		var val =this.getValue();
		val = val.replace(/,/g, ""); 
		var hiddenObj=Ext.getCmp(this.id.concat('_HIDDEN'))
		if(hiddenObj!=null){
			hiddenObj.setValue(val);
		}
		//Ext.getCmp(this.id).setValue(val);
	},	
	getValue : function() {
		var val = iportal.formelement.AmountField.superclass.getValue.apply(this, arguments); 
	 	return val.replace(/,/g, ""); 
	},	
	setFormattedValue : function(val) {
		if(val){
			var StringNumber = canvas.amountFormatter.getInstance();
			this.setValue(StringNumber.basicFormatter(val.replace(/,/g, ""),this.signdigits));
		}
	},
	isVisible : function(){
		return iportal.formelement.AmountField.superclass.isVisible.apply(this, arguments);  
	},
	format : function(){
		var val = this.getValue();
		var StringNumber = canvas.amountFormatter.getInstance();
		this.setValue(StringNumber.basicFormatter(val.replace(/,/g, ""),this.signdigits));
	},amountfieldMandatoryValidator : function(v){
		//  bundle to be changed. This should be common bundle
		combundle = CRB.getFWBundle()
		//alert(this.conditional);
		if(combundle !== null){
		//	alert("v==>"+v);
		//	alert(this.conditional);
			//if((v == ' '  && this.required) || (v == ' ' && this.conditional)){
			if((v == '') && (this.required || this.conditional)){
				//alert("marking incvalid1");
				this.markInvalid(this.blankText);
				
			}else{
				//alert("clearing invalid1");
				this.clearInvalid();
			}
		}
		else {
			
			//if(v == ' ' && this.required){
			//if((v == ' ' && this.required) || (v == ' ' && this.conditional)){
			if((v == '') && (this.required || this.conditional)){
				//alert("marking invalid2");
				
//				this.markInvalid('? ERR_MANDATORY ?');
				this.markInvalid('? ERR_MANDATORY_AMOUNTFIELD ?');
				
			}
		}
	}
	
});

Ext.reg('iportal-amountfield', iportal.formelement.AmountField);

/**
 * @class iportal.formelement.Checkbox
 * @extends Ext.form.Checkbox
 * Base class to customize a checkbox display in a form layout.
 * @constructor
 * Creates a new Checkbox Field
 * @param {Object} config Configuration options
 * 
 */

iportal.formelement.Checkbox = function(config){
    this.name = config.name || config.id;
    iportal.formelement.Checkbox.superclass.constructor.call(this, config);
};

Ext.extend(iportal.formelement.Checkbox, Ext.form.Checkbox,  {
	
	/**
     * @cfg {Object} bundleKey ,key used by resource to lookup bundle(defaults to '')
     */
	bundleKey : '',
	 
     // private
	initComponent:function(){
		var bundle;
		if(this.bundleKey !== '')
		{
			try{

				bundle = CRB.getBundle(this.bundleKey);
			}
			catch(e){
			}
		}
		this.labelSeparator = '';
		iportal.formelement.Checkbox.superclass.initComponent.call(this);	
		if(bundle != null)
		{
			if(bundle[this.boxLabel]==undefined)
			{
				this.boxLabel   = ''; 
			}
			else
			{
				this.boxLabel   = bundle[this.boxLabel];
			}
		}
	},
	
	/**
     * Sets the label near to this component.
     * @param {String} value The label value to set
     */
    setLabel : function(key){
        this.boxLabel   = this.bundle[key];		
    },
	getPrintData : function(){
		var printMap = {};
		if(this.getValue()){
			var label = this.boxLabel;
			printMap[label] = this.getValue();
		}
		return printMap;
	}
});

Ext.reg('iportal-checkbox', iportal.formelement.Checkbox);


/**
 * @class iportal.formelement.RadioBox
 * @extends Ext.form.Radio
 * Base class to customize a radio button in a form layout.
 * @constructor
 * Creates a new RadioBox Field
 * @param {Object} config Configuration options
 * 
 */

iportal.formelement.RadioBox = function(config){
    this.name = config.name || config.id;
    iportal.formelement.RadioBox.superclass.constructor.call(this, config);
};

Ext.extend(iportal.formelement.RadioBox, Ext.form.Radio,  {
	
	/**
     * @cfg {Object} bundleKey ,key used by resource to lookup bundle(defaults to '')
     */
	bundleKey : '',

	// private
	initComponent:function(){
		
		iportal.formelement.RadioBox.superclass.initComponent.call(this);	
		if(Ext.isEmpty(this.bundleKey)){
			//This needs to revisit - this.findParentByType('iportal-formpanel').bundleKey returning null
			this.bundleKey = this.findParentByType('iportal-formpanel').bundleKey;
		}		
		var bundle;
		if(!this.boxLabel){
			this.boxLabel = "LBL_"+this.id;
		}
			try{

				bundle = CRB.getBundle(this.bundleKey);
			}
			catch(e){
			}
		this.labelSeparator = '';
		if(bundle != null)
		{
			/*ANZ formelement cleanup */
			if(bundle[this.boxLabel] == undefined)
			{
				//this.boxLabel   = '?'+this.boxLabel+'?';
				this.boxLabel   = ''; //updated by balesh2@feb232011
			}
			else
			{
				this.boxLabel   = bundle[this.boxLabel];
			}
			
		}
		
	},
	
	/**
     * Sets the label near to this component.
     * @param {String} value The label value to set
     */
    setLabel : function(key){
		bundle = CRB.getBundle(this.bundleKey);
        this.boxLabel   = bundle[key];		
    },
	getPrintData : function(){
		var printMap = {};
		if(this.getValue()){
			var label = this.boxLabel;
			printMap[label] = this.getValue();
		}
		return printMap;
	}
});

Ext.reg('iportal-radio', iportal.formelement.RadioBox);



/**
 * @class iportal.formelement.Label
 * @extends Ext.form.Label
 * Base class to customize a label display
 * @constructor
 * Creates a new Label Field
 * @param {Object} config Configuration options
 * 
 */

iportal.formelement.Label = function(config){
    this.name = config.name || config.id;
    iportal.formelement.Label.superclass.constructor.call(this, config);
};

Ext.extend(iportal.formelement.Label, Ext.form.Label,  {
	
	/**
     * @cfg {Object} bundleKey ,key used by resource to lookup bundle(defaults to '')
     */
	bundleKey : '',
	rawText : '',
	 // private
	initComponent:function(){

		iportal.formelement.Label.superclass.initComponent.call(this);	
		if(!this.text){
			this.text = "LBL_"+this.id;
		}
		var bundle;
		if(Ext.isEmpty(this.bundleKey)){
			var parent = this.findParentByType('iportal-formpanel') || this.findParentByType('iportal-fluidform') ;
			this.bundleKey = parent.bundleKey;
		}
		try{
			bundle = CRB.getBundle(this.bundleKey);
		}
		catch(e) {
		}
		if(this.rawText !== ''){
			this.html   = this.rawText;
		}else{
		if(bundle !== null && this.text != '')	{
			try {
				if(bundle[this.text]==undefined)
				{
					this.text   = '?'+this.text+'?';
				}
				else
				{
					this.text   = bundle[this.text];
				}
				
			}
			catch(e){
				this.text   = (this.text && this.text != '' && this.text.trim() != '') ? ('?' + this.text + '?') : '';
			}
		}
		else
			this.text   = (this.text && this.text != '' && this.text.trim() != '') ? ('?' + this.text + '?') : '';
		}
	},
	getPrintData : function(){
		var label = this.text;
		var printMap = {};
		return printMap;
	}//,
	
	/**
     * Sets the label near to this component.
     * @param {String} key The label value to set
    
    setText : function(key){
		bundle = CRB.getBundle(this.bundleKey);
		if(bundle != null)
			this.text   = bundle[key];	
		else
			this.text   = '?' + key + '?';
    }
	 */
});

Ext.reg('iportal-label', iportal.formelement.Label);


/**
 * @class iportal.formelement.FieldSet
 * @extends Ext.form.FieldSet
 * Base class to customize a fieldset in a form layout.
 * @constructor
 * Creates a new FieldSet 
 * @param {Object} config Configuration options
 * 
 */

iportal.formelement.FieldSet = function(config){
    this.name = config.name || config.id;
    iportal.formelement.FieldSet.superclass.constructor.call(this, config);
};

Ext.extend(iportal.formelement.FieldSet, Ext.form.FieldSet,  {
	
	 /**
     * @cfg {Object} bundleKey ,key used by resource to lookup bundle(defaults to '')
     */
	bundleKey : '',
	/*ANZ formelement */
	layout:'column',
	cls:'custom-columnwidth',
	title:'',
	/*ANZ formelement */
	/**
     * @cfg {Boolean} collapsibleFieldSet ,boolean to unset if we need uncollapsible fieldset(defaults to true)
     */
	collapsibleFieldSet : false,
	
	/**
     * @cfg {Boolean} collapsibleFirst ,boolean to set if we need fieldset collapsible beginning(defaults to true)
     */
	collapsibleFirst : false,

	/**
     * @cfg {Boolean} gradientEffect ,boolean to set if we need fieldset to have gradient look and feel
     */
	gradientEffect : false,
	/**
	 *  @cfg {String} Provide value to the plainLabel for displaying labels with treated by Resource Bundle.
	 * this property will take priority over title.
	 * */
	plainLabel:null,
     // private
	initComponent:function(){

		iportal.formelement.FieldSet.superclass.initComponent.call(this);
		


		var bundle;
		if(Ext.isEmpty(this.bundleKey)){
			//this.bundleKey = this.findParentByType('iportal-formpanel').bundleKey;
			//if(!this.bundleKey){
				//this.bundleKey = this.findParentByType('iportal-fluidform').bundleKey;
			//}
			var parent = this.findParentByType('iportal-formpanel') || this.findParentByType('iportal-fluidform') ;
			this.bundleKey = parent.bundleKey;
		}		
		try{
			bundle = CRB.getBundle(this.bundleKey);
		}
		catch(e){
		}

		this.colspan = (this.colspan == undefined) ? 4 : this.colspan ;
		//default style for fieldset
		adjustPadding = 'padding-top:0px; padding-left:10px;';
		
		this.style = (this.style == undefined) ? adjustPadding : this.style ;
		
		this.autoHeight = true;
		this.cls='custom-columnwidth';
		if(this.collapsibleFieldSet)
			this.collapsible =  true  ;
		else
			this.collapsible =  false  ;

		if(this.collapsibleFirst)
			this.collapsed =  true  ;
		else
			this.collapsed =  false  ;
		
		


		if(this.gradientEffect){
			this.cls = this.cls+' formBackground';
		} else  {
			this.cls = '';// Transparent
		}
		// adding check to prioritize the value of plainLabel over title.
		
		if(this.plainLabel!=null && this.plainLabel!==''){
			this.title = this.plainLabel;
		}else{
			if(bundle != null)
			{
				try
				{
				if(this.title=='')
				{
				}
				else
				{
					if(bundle['LBL_'+this.title]==undefined)
					{
						this.title   = '?'+this.title+'?';
					}
					else
					{
						this.title   = bundle['LBL_'+this.title];
					}
				}
				}
				catch(e)
				{
					this.title   = (this.title != '' && this.title.trim() != '') ? ('?' + this.title + '?') : '';
				}
			}
			else
			{
				this.title   = (this.title != '' && this.title.trim() != '') ? ('?' + this.title + '?') : '';
			}
		}
		

		
	},
	getPrintData : function(){
		var fItems = this.items;
		var fieldSetItems = [];
		var fieldSetItem;
		fItems.each(function(item,index,length){
			if(item.getXType() != 'hidden' && !item.hidden){
				if(Ext.type(item.getPrintData) == 'function'){
					if(item.getXType() == 'panel'){
						fieldSetItem = item.getPrintData();
						var fieldSetObj = {};
						Ext.each(fieldSetItem,function(fi){
							if(Ext.encode(fi) != '{}'){
								fieldSetItems.push(fi);
							}
							//Ext.apply(fieldSetObj,fi);
						});
						//fieldSetItems.push(fieldSetObj);
					}
					else if(item.getXType() == 'iportal-fieldset'){
						fieldSetItem = item.getPrintData();
						var fieldSetObj = {};
						Ext.each(fieldSetItem,function(fi){
							if(Ext.encode(fi) != '{}'){
								fieldSetItems.push(fi);
							}
							//Ext.apply(fieldSetObj,fi);
						});
						//fieldSetItems.push(fieldSetObj);
					}else{
						fieldSetItem = item.getPrintData();
						fieldSetItems.push(fieldSetItem);
					}
				}
			}
		},this);
		/*
		if(!this.findParentByType('iportal-fieldset')){
			pfieldSet['sectiontitle'] = this.title || '';
			pfieldSet['fields'] = [fieldItems];
		}
		*/
		////alert("1 END OF FIELDSET \n\n"+Ext.encode(fieldSetItems)); 
		/*if(fieldSetItems.length > 1){
			for(var fieldSetIndex = 0;fieldSetIndex < fieldSetItems.length;fieldSetIndex++){
				if(fieldSetIndex != 0){
					for(jfieldSetIndex in fieldSetItems[fieldSetIndex]){
						fieldSetItems[0][jfieldSetIndex] = fieldSetItems[fieldSetIndex][jfieldSetIndex];
					}
				}
			}
		}
		fieldSetItems.length = 1;*/
		////alert("2 END OF FIELDSET \n\n"+Ext.encode(fieldSetItems));
		////alert(this.title);
		if(!this.findParentByType('iportal-fieldset')){
			var pfieldSet = {};
			pfieldSet['sectiontitle'] = this.title || '';
			pfieldSet['fields'] = fieldSetItems;
			////alert("END OF XXX FIELDSET \n\n"+Ext.encode(pfieldSet));
			return pfieldSet;
		}
		////alert("END OF FIELDSET \n\n"+Ext.encode(fieldSetItems));
		return fieldSetItems; 
	}
	
}); 

Ext.reg('iportal-fieldset', iportal.formelement.FieldSet);



/**
 * @class iportal.formelement.StaticField
 * @extends Ext.form.TextField
 * Base class to customize a staticfield display in a form layout.
 * @constructor
 * Creates a new StaticField 
 * @param {Object} config Configuration options
 *
 */

iportal.formelement.StaticTextArea = function(config){
    this.name = config.name || config.id;
    iportal.formelement.StaticTextArea.superclass.constructor.call(this, config);
};

Ext.extend(iportal.formelement.StaticTextArea, Ext.form.TextArea,  {
	
	/**
     * @cfg {Object} bundleKey ,key used by resource to lookup bundle(defaults to '')
     */
	bundleKey : '',	
	plainLabel : '',	
	conditional : false,
	//cls:'x-form-textField',
	// private
	initComponent:function(){
		iportal.formelement.StaticTextArea.superclass.initComponent.apply(this, arguments);	

		var bundle;
		//this.name = this.id+'_STFLD';
		this.readOnly = true;	
		this.labelSeparator = '';
		this.style = 'border:none;padding-left:0px;background: transparent;';
		this.autoHeight = true; 
		this.anchor = (this.anchor == undefined) ? '' : this.anchor ;
		if(Ext.isEmpty(this.bundleKey)){
			var parent = this.findParentByType('iportal-formpanel') || this.findParentByType('iportal-fluidform') ;
			this.bundleKey = parent.bundleKey;
		}		
		try{
			bundle = CRB.getBundle(this.bundleKey);
		}
		catch(e){
		}
		if(!this.fieldLabel)
			this.fieldLabel = "LBL_"+this.id;
		if(bundle)	{
			this.plainLabel = bundle[this.fieldLabel];
			try	{
				if(this.disableLabel!=null && this.disableLabel==true){
					this.fieldLabel="";
				}
				else if(this.conditional){
					try{
						if(bundle[this.fieldLabel]==undefined)
						{
							this.fieldLabel='?'+this.fieldLabel+'?'+'<span class = \'mandatory_fx\'">**</span>';
							
						}
						else
						{
							this.fieldLabel=bundle[this.fieldLabel]+'<span class = \'mandatory_fx\'">**</span>';
						}
						
					}
					catch(e){
						this.fieldLabel='?'+this.fieldLabel+'?'+'<span class = \'mandatory_fx\'">**</span>' ;
					}
				}
				else if(this.fieldLabel==="EMPTY"){
				this.fieldLabel = '<span class = \'non_mandatory\'"></span>&nbsp;';
				}else{
					/*ANZ formelement cleanup */
					if(bundle[this.fieldLabel]==undefined)
					{
						this.fieldLabel = '<span class = \'non_mandatory\'"></span>' + '?'+this.fieldLabel+'?';
					}
					else
					{
						this.fieldLabel = '<span class = \'non_mandatory\'"></span>' + bundle[this.fieldLabel];
					}
					
				}
			}
			catch(e){
				this.fieldLabel= '<span class = \'non_mandatory\'"></span>' + '?' + this.fieldLabel + '?';
			}
		}
		if(!this.value){
			this.value = '--';
		}
	},
	afterRender:function() {        
		iportal.formelement.StaticTextArea.superclass.afterRender.apply(this, arguments); 
		this.setValue = this.setValue.createSequence(this.updateHidden); 
	},
	updateHidden : function(){
		var realVal = this.getValue();	
		if(realVal == '--'){
			return;
		}
		if(realVal == '' || ((String(realVal).trim()) == '')){
			this.setValue('--');
		}
	},
	getPrintData : function(){
		var label = this.plainLabel;
		var fieldValue = this.getValue();
		var printMap = {};
		printMap[label] = fieldValue;
		return printMap;
	}	

});

Ext.reg('iportal-statictextarea', iportal.formelement.StaticTextArea);






/**
 * @class iportal.formelement.StaticField
 * @extends Ext.form.TextField
 * Base class to customize a staticfield display in a form layout.
 * @constructor
 * Creates a new StaticField 
 * @param {Object} config Configuration options
 *
 */

iportal.formelement.StaticField = function(config){
    this.name = config.name || config.id;
    iportal.formelement.StaticField.superclass.constructor.call(this, config);
};

Ext.extend(iportal.formelement.StaticField, Ext.form.TextField,  {
	
	/**
     * @cfg {Object} bundleKey ,key used by resource to lookup bundle(defaults to '')
     */
	bundleKey : '',	
	plainLabel : '',	
	conditional : false,
	cls:'x-form-textField',
	// private
	initComponent:function(){
		iportal.formelement.StaticField.superclass.initComponent.apply(this, arguments);	

		var bundle;
		//this.name = this.id+'_STFLD';
		this.readOnly = true;	
		this.labelSeparator = '';
		this.style = 'border:none;padding-left:0px;background: transparent;cursor: default;';
		this.focusClass = 'staticfield_focus';
		this.anchor = (this.anchor == undefined) ? '' : this.anchor ;
		if(Ext.isEmpty(this.bundleKey)){
			var parent = this.findParentByType('iportal-formpanel') || this.findParentByType('iportal-fluidform') ;
			this.bundleKey = parent.bundleKey;
		}		
		try{
			bundle = CRB.getBundle(this.bundleKey);
		}
		catch(e){
		}
		if(!this.fieldLabel)
			this.fieldLabel = "LBL_"+this.id;
		if(bundle)	{
			this.plainLabel = bundle[this.fieldLabel];
			try	{
				if(this.disableLabel!=null && this.disableLabel==true){
					this.fieldLabel="";
				}
				else if(this.conditional){
					try{
						if(bundle[this.fieldLabel]==undefined)
						{
							this.fieldLabel='?'+this.fieldLabel+'?'+'<span class = \'mandatory_fx\'">**</span>';
							
						}
						else
						{
							this.fieldLabel=bundle[this.fieldLabel]+'<span class = \'mandatory_fx\'">**</span>';
						}
						
					}
					catch(e){
						this.fieldLabel='?'+this.fieldLabel+'?'+'<span class = \'mandatory_fx\'">**</span>' ;
					}
				}
				else if(this.fieldLabel==="EMPTY"){
					this.fieldLabel = '<span class = \'non_mandatory\'"></span>&nbsp;';
				}else{
					/*ANZ formelement cleanup */
					if(bundle[this.fieldLabel]==undefined)
					{
						this.fieldLabel = '<span class = \'non_mandatory\'"></span>' + '?'+this.fieldLabel+'?';
					}
					else
					{
						this.fieldLabel = '<span class = \'non_mandatory\'"></span>' + bundle[this.fieldLabel];
					}
					
				}
			}
			catch(e){
				this.fieldLabel= '<span class = \'non_mandatory\'"></span>' + '?' + this.fieldLabel + '?';
			}
		}
		if(!this.value){
			this.value = '--';
		}
	},
	afterRender:function() {        
		iportal.formelement.StaticField.superclass.afterRender.apply(this, arguments); 
		this.setValue = this.setValue.createSequence(this.updateHidden); 
	},
	updateHidden : function(){
		var realVal = this.getValue();	
		if(realVal == '--'){
			return;
		}
		if(realVal == '' || ((String(realVal).trim()) == '')){
			this.setValue('--');
		}
	},
	getPrintData : function(){
		var label = this.plainLabel;
		var fieldValue = this.getValue();
		var printMap = {};
		printMap[label] = fieldValue;
		return printMap;
	}	
	/*,
	afterRender:function() {        
		iportal.formelement.StaticField.superclass.afterRender.apply(this, arguments); 
		var formpanelLayer = this.findParentByType('iportal-formpanel');
		formpanelLayer.add({xtype:'hidden',name: this.id,id:this.id.concat('_HIDDEN'),value:''}); 
		if(this.value && this.value.trim() != ''){
			var StringNumber = iportal.util.stringnumber.getInstance();	
			var originalVal = this.value;
			var formattedStr = StringNumber.getStringForWidthEl(this.value,170,this.el);
			this.setValue(formattedStr);
			if(originalVal.trim() != formattedStr.trim()){
				this.el.dom.qtip = originalVal;
			}	
			this.updateHidden(originalVal);		   				
		}
	},
	updateHidden:function(val) {  
		Ext.getCmp(this.id.concat('_HIDDEN')).setValue(val);
	},
	setFormattedValue : function(v) {
		this.setValue(v);
		if(this.value && this.value.trim() != ''){
			var StringNumber = iportal.util.stringnumber.getInstance();	
			var originalVal = this.value;
			var formattedStr = StringNumber.getStringForWidthEl(this.value,170,this.el);
			this.setValue(formattedStr);
			if(originalVal != formattedStr){
				this.el.dom.qtip = originalVal;
			}else{
				this.el.dom.qtip = '';
			}	
			this.updateHidden(originalVal);		   				
		}
	}*/
});

Ext.reg('iportal-staticfield', iportal.formelement.StaticField);

/**
 * @class iportal.submitHandler
 * standard submit handler to be called from every form submit button handler with form metadata
 * @param {Object} md metadata of form for submission of the form -- &gt;
 * <code>
 *			{
 *					formid : &lt; ID of the form to be submitted &gt;, 
 *					action : &lt; action to be performed {SUBMIT} &gt;, 
 *					params : &lt; extra parameters to be passed to server &gt;, 
 *					success : &lt; function to be executed incase of success &gt;, 
 *					( the function will be passed two parameters form and action
 *					 action objects' result property will contain the response from server in
					javascript object form )
 *					failure : &lt; function to be executed incase of failure &gt;, 
 *			        ( the function will be passed two parameters form and action
 *					 action objects' result property will contain the response from server in
					javascript object form incase of server side validation errors )
 *			}
 * </code>
 * 
 */
iportal.submitHandler = function(md){													
							form = Ext.getCmp(md.formid).getForm();
							formValObj = form.getValues(false);
							//  bundle should be a common one 
							var bundle = CRB.getFWBundle();
							var obj = form.getValues(false);							
							var validForm = false;
							if(!md.clientValidation){
								validForm = true;
							}else{
								validForm = iportal.formelement.validateFields(obj);
							}
							if(!validForm) return false; 													
							;
							var paramObj = md.params;
							paramObj['INPUT_ACTION'] = md.action;
							for(var index in paramObj) {
								formValObj[index] = paramObj[index];
							}
							paramObj[iportal.systempreferences.getCSRFKeyName()]=iportal.systempreferences.getCSRFUniqueId();
							form.doAction('submit',{
								params: paramObj,
								clientValidation : false,                            
								success: function(form,action) {
									
									if(action.result !== null){
										if(action.result.SUBMIT_SUCCESS !== null && action.result.SUBMIT_SUCCESS === 'Y'){
											md.success(form,action);
										}else if(!Ext.isEmpty(action.result.SIMULATION_SUCCESS_FLAG) && action.result.SIMULATION_SUCCESS_FLAG){
											md.success(form,action);
										}

										else if(action.result.success !== null && action.result.success === 'false'){
											md.failure(form,action);
										}
									}else {										
										//  response null
										messagesErr = result.ERR_MESS ; 
										action['result'] ={};
										action.result['ERR_MESS'] = [bundle['SYSTEM_ERROR']];
										iportal.formelement.populateErrMsgWin(action,md.failure,form);
									}
								},
								failure: function(form,action){
									
									if(action !== null && action.result !== null && Ext.encode(action.result)!== 'null'){
										md.failure(form,action);
									}else {
										action = (action === null) ? {} : action;
										action['result'] ={};
										action.result['ERR_MESS'] = bundle['SYSTEM_ERROR'];
										iportal.formelement.populateErrMsgWin(action,md.failure,form);
									}
								}
							});
						 
					}


/**
 * @class iportal.cancelHandler
 * standard cancel handler to be called from every form cancel button handler with metadata
 * @param {Object} md metadata
 * <code>
 *			{
 *					INPUT_REFERENCE_NO : &lt; The input reference number &gt;, 
 *					INPUT_VER_NO : &lt; The version number &gt;,	
 *					params : &lt; extra parameters to be passed to server &gt;, 
 *					success : &lt; function to be executed incase of success &gt;
 *			}
 * </code>
 * 
 */
iportal.cancelHandler = function(md){									
							;
							var paramsOb = md.params;
							paramsOb['INPUT_ACTION'] = "CANCEL_TXN";
							paramsOb['INPUT_REFERENCE_NO'] = md.INPUT_REFERENCE_NO;
							paramsOb['INPUT_VER_NO'] = md.INPUT_VER_NO;
							Ext.Ajax.request({
						       params :paramsOb,
							   success: function(response,opt){
											if(!Ext.isEmpty(md.success))
												md.success(); 
												
											}			
							});									 
					}


iportal.formelement.validateFields = function(obj,vbcheck) {
	var valid = true;
	var bundle = CRB.getFWBundle();
	for(var i in obj){
		try{
			cmp = Ext.getCmp(i);
			var isVB = cmp.isVisible();
			if( vbcheck==='SWP'){ // This is temp fix for Sweeps and Tide forms. However needs to revisit
				isVB = true;
			}			
		if(isVB){			
			if(cmp.getXType() === 'iportal-combobox' && cmp.required  && obj[i] === ''){
				valid = false;
				
//				cmp.markInvalid(String.format(bundle['ERR_MANDATORY'],cmp.plainLabel)); 		
				cmp.markInvalid(String.format(bundle['ERR_MANDATORY_COMBOBOX'],cmp.plainLabel)); 
				
				
			}if(cmp.getXType() === 'iportal-textfield' && cmp.required  && obj[i].trim() === ''){
				
				valid = false;
				
//				cmp.markInvalid(String.format(bundle['ERR_MANDATORY'],cmp.plainLabel));	
				cmp.markInvalid(String.format(bundle['ERR_MANDATORY_TEXTFIELD'],cmp.plainLabel));
			
			}if(cmp.getXType() === 'iportal-datefield' && cmp.required  && (obj[i] === '' || obj[i] === 'undefined')){	
				valid = false;
				
//				cmp.markInvalid(String.format(bundle['ERR_MANDATORY'],cmp.plainLabel));			
				cmp.markInvalid(String.format(bundle['ERR_MANDATORY_DATEFIELD'],cmp.plainLabel));
			
			}if(cmp.getXType() === 'iportal-amountfield' && cmp.required  && cmp.getValue().trim() === ''){
				valid = false;
				
//				cmp.markInvalid(String.format(bundle['ERR_MANDATORY'],cmp.plainLabel));	
				cmp.markInvalid(String.format(bundle['ERR_MANDATORY_AMOUNTFIELD'],cmp.plainLabel));
				
			}if(cmp.getXType() === 'iportal-amountfield'){	
				var amount_value = "".concat(cmp.getValue());	
				if((amount_value !== "")){
					if(! cmp.checkAmountInsideMaxLength(amount_value)){
						valid = false;
						var err_mess = String.format(bundle['ERR_MAXLENGTH_EXCEED_AMOUNT'],cmp.plainLabel,28,5);
						cmp.markInvalid(err_mess);
					}
				}								
			}if(cmp.getXType() === 'iportal-lookup' && cmp.required && obj[i].trim() === ''){
				valid = false;
				
               //cmp.markInvalid(String.format(bundle['ERR_MANDATORY'],cmp.plainLabel)); 		
				cmp.markInvalid(String.format(bundle['ERR_MANDATORY_LOOKUP'],cmp.plainLabel));
				
			}if(cmp.getXType() === 'iportal-lookup'){
				if(!Ext.isEmpty(obj[i].trim())){
					var retunflg = cmp.changeFunction(cmp);
						if(Ext.type(retunflg)!='boolean'){
							valid = false;	
							cmp.markInvalid(retunflg); 	
						}					
				}
			}if(cmp.getXType() === 'iportal-editablelookup' && !cmp.submittable){
				valid = false;									
			}if(cmp.getXType() === 'iportal-editablelookup'){
				if(cmp.required && cmp.getValue().trim() === ''){
					valid = false;	
					cmp.markInvalid();
				}								
			}if(cmp.getXType() === 'iportal-textarea'){
				if(cmp.required && obj[i] === ''){
					valid = false;
					 
//					cmp.markInvalid(String.format(bundle['ERR_MANDATORY_SELECT'],cmp.plainLabel));
					cmp.markInvalid(String.format(bundle['ERR_MANDATORY_TEXTAREA'],cmp.plainLabel));
					
				}else if(cmp.required && obj[i] !== '' && obj[i].length > cmp.maxLength){
					valid = false;
				}
			}
		}
		}catch(e) {
			continue;
		}		
	}
	return valid;
}

/**
 * @class iportal.Window
 * @extends Ext.Window
 * Base class to customize a normal window
 * @constructor
 * Creates a new Window 
 * @param {Object} config Configuration options
 * 
 */

iportal.Window = function(config){
    this.name = config.name || config.id;
	////alert('toolButtons');	
    iportal.Window.superclass.constructor.call(this, config);
};

Ext.extend(iportal.Window, Ext.Window,  {
	
	/**
     * @cfg {Object} bundleKey ,key used by resource to lookup bundle(defaults to '')
     */
	bundleKey : '',
	/*ANZ formelement cleanup */
	rawTitle: '',
	
	/**
     * @cfg {Object} toolButtons ,shortcut for defining tools on top of the window
     */
	toolButtons : null,
	
	/**
     * @cfg {Object} toolButtons ,shortcut for defining tools on top of the window
     */
	hideOnClose : false,
	
	
	constrainHeader :true,
	constrain:true,
	
	/**
     * @cfg {Object} closeHandler ,if developer wants to do some finishing task before 
     * closing the window
     */
	closeHandler: Ext.emptyFn,

	/**
     * @cfg {Object} refreshHandler ,if developer wants to do refresh
     */
	refreshHandler: Ext.emptyFn,
	
	tbarDraggable : false,
	/**
     * @cfg {Object} pprintHandler ,if developer wants to print the contents
     */
	pprintHandler: Ext.emptyFn,
	
	helpHandler:function(){
									//var paramshelp = "height="+(screen.availHeight-145)+",width="+(screen.availWidth-110)+"toolbar=no,location=no,directories=no,status=yes,menubar=no,scrollbars=no,resizable=yes,border=thin,top=0,left=0";
		var paramshelp ='toolbar=no,location=no,directories=no,status=no,'+
	                 'menubar=no,scrollbars=no,resizable=no,border=thin,top=60,left=100,width=450,height=450';
		var helphandle = iportal.openNewWindow('/iportalweb/iportal/jsps/UnderConstruction.jsp'+
	                  '?elementIdForConfirmationMsg=globalPreferencesFormPanelId','helpwin',paramshelp);
	},
	// private
	initComponent:function(){
		////alert('toolButtons');	
			var that = this;
			//Checking if another instance non modal window existing or not. if exist then close.
			Ext.WindowMgr.each(function(windowparam){
					if(!windowparam.modal && !that.modal){
				 		if(windowparam.closeHandler){
				 			windowparam.closeHandler();
				 		}
				 		windowparam.close();
				 	}
				});
		//this.autoScroll = true;
		//this.modal = true;
		this.focus = Ext.emptyFn;
		
		this.closable = false;
		//added if condition for enabling resizable options for iportal-window
		if(!this.resizable){
		this.resizable = false;
		}
		
		/*ANZ formelement cleanup */
	//	this.layout='fit';
		this.modal = true;
	
		iportal.Window.superclass.initComponent.apply(this, arguments);	

		var bundle;
		////alert('toolButtons1'+this.toolButtons);	
		// check for toolButtons config and create tools array
//		if(this.toolButtons !== null && typeof this.toolButtons == 'object'){
		if(this.toolButtons !== null ){
			////alert('toolButtons22');	
			////alert('toolButtons33'+this.toolButtons);	
			var cmRb = CRB.getFWBundle();
			//this.toolButtons.removeByValue('print'); // This fix is since print icon is allowed for
				////alert(this.toolButtons);									 // Summary list view and Cash Position.
			var that = this;
			this.tools = [];
		//	//alert('b4 tools');	
			if(this.toolButtons.indexOf('excel') != -1) {
				this.tools.push({id:'iportalExcel'});				
			}
			if(this.toolButtons.indexOf('pin') != -1) {
				this.tools.push({id:'iportalPin'});				
			}
			if(this.toolButtons.indexOf('refresh') != -1) {
				this.tools.push({id:'iportalRefresh',handler:function(){that.refreshHandler();}});				
			}
			if(this.toolButtons.indexOf('help') != -1) {
				////alert('Help');
				this.tools.push({id:'iportalHelp',handler:that.helpHandler});				
			}
			if(this.toolButtons.indexOf('pprint') != -1) {
				this.tools.push({id:'iportalPrint',handler:function(){ that.pprintHandler();
													}});				
			}
			//alert('b4 Felp');
			
			if(this.toolButtons.indexOf('close') != -1) {
				if(this.hideOnClose){
					this.tools.push({id:'iportalClose',tooltip:cmRb['TOOLTIP_CLOSE'],handler:function(){that.hide();}});
				}else{
					this.tools.push({id:'iportalClose',tooltip:cmRb['TOOLTIP_CLOSE'],handler:function(){that.closeHandler();that.close();}});
				}
			}
			
		}
		if(this.bundleKey !== ''){
			try{
				bundle = CRB.getBundle(this.bundleKey);
			}
			catch(e){
			}
		}else{
			bundle = CRB.getFWBundle();
		}
		if(this.rawTitle !== ''){
			this.title = this.rawTitle;
		}else{
		try{
			this.title = bundle[this.title];
		}
		catch(e){
			this.title= '?' + this.title + '?';
		}
		}			
		
		
	},
	afterRender:function(){        
		iportal.Window.superclass.afterRender.apply(this, arguments);    
		this.on('resize',function(){
			
			/**
			 *  The setSize method commented because the developer
			 * wants to re-write their own resize functionality for window. 
			 */ 
			//	this.setSize({width:this.width,height:this.height});
			
		});		
		this.on('show',function(cmp){
			if(this.modal){
				Ext.getBody().addListener('keydown',this.handleKeyDown);	
			}
			var bottombar = this.getBottomToolbar();
			if(bottombar && bottombar.items){
				bottombar.items.each(function(item,index){
					if(item.el){
						if(item.id.indexOf('ext-gen') == -1){							
							item.el.focus();
							if(Ext.getCmp(item.id) && (Ext.getCmp(item.id).getXType() == 'tbbutton' || Ext.getCmp(item.id).getXType() == 'button')){
								Ext.getCmp(item.id).focus(true);
							}
						}
					}													
				});	
			}
		});	
		this.on('beforehide',function(cmp){
			Ext.getBody().removeListener('keydown',this.handleKeyDown);						
		});	
		this.on('beforeclose',function(cmp){
			Ext.getBody().removeListener('keydown',this.handleKeyDown);						
		});	
		if(this.getTopToolbar() && this.tbarDraggable){
			this.dd.setHandleElId(this.getTopToolbar().id);
			this.getTopToolbar().addClass("x-window-draggable");
		}
	},
	
	handleKeyDown : function(e){
		var that = this;
		var evt = (e) ? e : window.event;
		if(evt.keyCode === 9){
			var target = evt.target ? evt.target : evt.srcElement;	
			var targetElement = Ext.get(target);	
			if(!targetElement.findParent('div.x-window')){				
				that.focus();
				var flagFocus = false;
				if(that.items)
				that.items.each(function(item,index){
					if(item.isFormField && !flagFocus){
					     item.el.focus();
					     flagFocus = true;					     
					}
				});
				return false;
			}								
		}
			else if(evt.keyCode === 13){
				var target = evt.target ? evt.target : evt.srcElement;	
				if(!Ext.isEmpty(target) && (!Ext.isEmpty(target.className))){
				if(target.className.indexOf('x-form-textarea')==-1 ){
				Ext.EventObject.stopEvent();
				}
				}			
			}
			
			else if(evt.keyCode === 32){
			var sourceElement = Ext.EventObject.getTarget();
			var targetOuterElement = sourceElement.outerHTML;
			var wrapper_sourceElement = Ext.get(sourceElement);
			var valid_source = (wrapper_sourceElement.findParent('div.x-window')) ? true : false;
			var valid_condition = false;
			if(valid_source){
				var parent_Window = wrapper_sourceElement.findParentNode('div.x-window');
				var wrapper_ParentWindow = Ext.get(parent_Window);
				Ext.WindowMgr.each(function(openedwin){
					if(Ext.getCmp(wrapper_ParentWindow.id).id == openedwin.id){
						valid_condition = true;
					}
				});
			}
			if(targetOuterElement.startsWith('<BUTTON') && !valid_condition){
				Ext.EventObject.stopEvent();
			}						
		}
	}
	

});
Ext.reg('iportal-window', iportal.Window);
/**
 * constructs a window to be displayed incase of ServerSide Validation Error
 * Array of error messages are taken as input 
 * @param action {Object} object containg error messages
 * @param failCallBack {Function} user defined function.On click of OK button or close button 
 *		the function will be called.
 * @param form {Object} form object on which validation validation has been done
 * 
 */
iportal.formelement.populateErrMsgWin = function(action,failCallBack,form) {
	messagesErr = action.result.ERR_MESS ; 
	var showError;
	var bundle = CRB.getFWBundle();
	showError = '<b><ul>';
	if(typeof messagesErr == 'string'){
		showError += messagesErr;
	}else {		
		for(var i = 0; i < messagesErr.length; i++)
		{
			showError += '<li>'+ messagesErr[i] + '</li>';
		}
	}
	showError += '</ul></b>';
	/*
	var errorMessageWindow = new iportal.Window({
				title:'WINDOW_TITLE_ERRORMESSAGES',
				tools:[{id:'iportalClose',handler:function(){errorMessageWindow.close();if(failCallBack !== null && failCallBack!==undefined){failCallBack(form,action);}}}],			
				width:400,
				closable:false,
				modal:false,
				ctCls:'j-window',
				height:230,
				buttons: [{
					text: 'OK',
					type: 'button',
					handler: function(){
						errorMessageWindow.close();
						if(failCallBack !== null && failCallBack!==undefined)  {
						failCallBack(form,action);
						}
					}
				}],
				items:[{
						  xtype: 'box',
						  autoEl: {cn: showError}						 
					}
				]
			});*/
		var errorMessageWindow = new iportal.Dialog({
			dialogType : 'ERROR',
			message: showError,
			
			cls:'portal_neg_btn',
			
			title : bundle['VALIDATION_ERRORS'],
			okHandler : function(){
				errorMessageWindow.close();
				if(failCallBack !== null && failCallBack!==undefined)  {
					failCallBack(form,action);
				}
			}
		});
		errorMessageWindow.show();
}


/**
 * @class iportal.formelement.FormPanel
 * @extends Ext.form.FormPanel
 * Base class to customize a formpanel display in a form layout.
 * @constructor
 * Creates a new FormPanel 
 * @param {Object} config Configuration options
 * 
 */

iportal.formelement.FormPanel = function(config){
    this.name = config.name || config.id;
    iportal.formelement.FormPanel.superclass.constructor.call(this, config);
};

Ext.extend(iportal.formelement.FormPanel, Ext.form.FormPanel,  {
	
	/**
     * @cfg {Object} bundleKey ,key used by resource to lookup bundle(defaults to '')
     */
	bundleKey : '',

	/**
     * @cfg {Boolean} submitOnEnter ,config to be unset if dont want the form to be submitted
	 * on pressing enter
     */
	submitOnEnter : true,
	
	// private
	initComponent:function(){
		
		iportal.formelement.FormPanel.superclass.initComponent.call(this);	
		this.frame = false;	
		this.bodyBorder = false;		
		/*ANZ formelement cleanup*/
		this.bodyStyle='padding:10px';
		this.labelAlign='top';
		/*ANZ formelement cleanup*/
		this.title='';

		//this.autoWidth = true;
		//this.viewConfig = {forceFit  :true,	scrollOffset :19 };
		var bundle;
		if(this.bundleKey !== ''){
			try{
				bundle = CRB.getBundle(this.bundleKey);
			}
			catch(e){
			}
		}	
		
		this.autoScroll = true ;
		
	},
	onRender : function(ct, position){
        iportal.formelement.FormPanel.superclass.onRender.call(this, ct, position);
		var that = this;
		if(this.keys === undefined && this.submitOnEnter) {
			this.keys = [{key : [10,13],fn: function(){					  
					  var bt = Ext.getCmp(that.id.replace('FormPanel','Submit')); 
					  bt.focus();
					  bt.fireEvent("click", bt);
				 }
			}];
		}
		this.el.addKeyListener(27,function(key, e){ 
			e.stopEvent();			
		});		     
    }
});

Ext.reg('iportal-formpanel', iportal.formelement.FormPanel);

/**
 * @class iportal.formelement.LookUp
 * @extends Ext.Panel
 * Base class to customize a LookUp display in a form layout.
 * @constructor
 * Creates a new LookUp 
 * @param {Object} config Configuration options
 * 
 */

 iportal.formelement.LookUp = function(config){
    this.name = config.name || config.id;
    iportal.formelement.LookUp.superclass.constructor.call(this, config);
};

Ext.extend(iportal.formelement.LookUp, Ext.Panel,  {
	
	/**
     * @cfg {Object} bundleKey ,key used by resource to lookup bundle(defaults to '')
     */
	bundleKey : '',	

	/**
     * @cfg {Object} fieldLabel ,label associated with the lookup button 
     */
	fieldLabel : '',	
	plainLabel : '',

	/**
     * @cfg {String/Object} required ,to specify whether this field is mandatory (defaults to false)
     */
    required : false,

	/**
     * @cfg {String/Object} required ,to specify whether this field is mandatory (defaults to false)
     * The lookup window will be opened iff. handler for lookup returns true. So by default give an
     * empty fn which returns true.
     */
    handler : function(){return true},

	/**
     * @cfg {String/Object} buttonTextKey ,text over button (defaults to LOOKUP)
     */
    buttonTextKey : 'LBL_LOOKUP',

	/**
	 * @cfg object required, Meta data object required to render account lookup,
	 * This object can create create with following attributes 
	 * productCode - required, to specify PRODUCT CODE and will be passed to server while retrieving data
	 * subProductCode - required, to specify SUB-PRODUCT CODE and will be passed to server while retrieving data
	 * functionCode - required,  to specify FUNCTION CODE and will be passed to server while retrieving data
	 * cm - required, Should be an object of Ext.grid.ColumnModel, will be used to render lookup grid columns
	 * recordType - required , Used to read records returning from server 
	 * 				Either an Array of field definition objects as passed to Ext.data.Record.create, 
	 * 				or a Record constructor created using Ext.data.Record.create.
	 * rowdbclickhandler - required, Javascript function which would gets executes when a row is double clicked in the grid
	 * extraParams - Optional, If required to pass any params as part of request
	 */
    lookupMetadata:{},
	
	// private
	initComponent:function(){
    	var commonbundle;
		iportal.formelement.LookUp.superclass.initComponent.apply(this, arguments);	
    	this.addEvents('valid');
		var that = this;
		this.frame = false;	
		this.bodyBorder = false;
		this.autoWidth = true;	
		this.autoHeight = true;	
		var bundle;
		if(!this.fieldLabel){
			this.fieldLabel = "LBL_"+this.id
		}
		if(Ext.isEmpty(this.bundleKey)){
			this.bundleKey = this.findParentByType('iportal-formpanel').bundleKey;
		}
			try{
				bundle = CRB.getBundle(this.bundleKey);
			}
			catch(e){
			}
		
		this.layout = 'table';
		if(bundle)
			this.plainLabel = bundle[this.fieldLabel];
		this.layoutConfig = {columns : 4};
		// Add a text field in form layout to the panel
		this.add({
					columnWidth:.70,
					colspan:2,
					layout: 'form',
					layoutConfig: {labelSeparator:''},
					items: [{
					xtype : 'iportal-textfield',
					width:115,
					lookup:true,
					enableKeyEvents:true,
					
					lookupButtonFocus:true,  // property added for disabling backspace key while lookup button is foucsed 
					style:'padding-top:2px;', 
					enableKeyEvents:true,
					listeners:{	
						'keydown':function(obj,evt){
							if(evt.keyCode === 9 && !Ext.EventObject.shiftKey){
							var bt = Ext.getCmp(that.id + 'button')
						  	bt.focus();
						 	bt.fireEvent("click", bt);
							}
						},					
						// listening for the blur event of textfield to do mandatory validation
						'blur':function(field){
							if(!that.required) {
								if(that.blurFunction) that.blurFunction();
								return true;
							}
							if(field.getValue().trim() === ''){
								Ext.getCmp(that.id + 'label').show();								
								document.getElementById(that.id + 'text').className = 'errorBg';
							}else {
								Ext.getCmp(that.id + 'label').hide();
								document.getElementById(that.id + 'text').className = 'x-form-text x-form-field normalBg';
							}
							if(that.blurFunction)that.blurFunction();
							that.changeFn();
							Ext.EventObject.stopEvent();
						},
						'focus':function(field){
								if(!that.required) {
									return true;
								}
								//Ext.getCmp(that.id + 'label').hide();
								//document.getElementById(that.id + 'text').className = 'x-form-text x-form-field normalBg';
								
						}
					},
					fieldLabel: this.fieldLabel,
					readOnly: this.readOnly,
					id : this.id + 'text',
					required: this.required,
					name: this.id,
					bundleKey : this.bundleKey								
				}]
			});					
		buttonHandler = function(){
			if(that.buttonTextKey !== 'LBL_LOOKUP'){
				that.handler();
				return;
			}			
			if(this.handler()){// Widgetization of Lookup 
				this.lookupMetadata.lookupId = this.id;
				iportal.formview.showLookupWin(this.lookupMetadata);
			}			
		},
		// Add the button to the panel to act as lookup
		this.add({xtype:'button',
			height:'75',
				listeners : {'focus':function(){
						if(Ext.EventObject.shiftKey){							
							Ext.getCmp(that.id+ 'text').focus();							
						}
					}
				},
				minWidth :60,cls:'buttonCls',handler :buttonHandler, 
				scope:this, id : this.id + 'button',text: bundle[this.buttonTextKey]
		});
		commonbundle = CRB.getFWBundle();
		
//		textQtip = String.format(commonbundle['ERR_MANDATORY'] , bundle[this.fieldLabel]);
		textQtip = String.format(commonbundle['ERR_MANDATORY_LOOKUP'] , bundle[this.fieldLabel]);
		
		// This is a placeholder for showing the validation message if any..This position is relative wrt.
		// the application. For instance currently CS validations are displayed side to the component. So the 
		// placeholder has to come side to this. We have to use this as, here component to be validated is 
		// textfield and message to be come side to the button.
		this.add({xtype:'label',hidden : true,
						html:'<img style="margin-bottom:0px;margin-left:2px;" src = "/iportalweb/iportal/images/default/form/exclamation.gif" '+
							'ext:qtip="'+textQtip+'"  ext:qclass="x-form-invalid-tip "  />',
						id : this.id + 'label'});	
				
		this.autoScroll = false ;	
		
					
	},
	// getValue function returns the current value in lookup textfield
	getValue : function(){
		return Ext.getCmp(this.id + 'text').getValue() ; 
	},
	markInvalid : function(m){
			if(!m){
			var commonbundle = CRB.getFWBundle();
			m = String.format(commonbundle['ERR_MANDATORY_LOOKUP'] , this.plainLabel);	
		}
	
		var that = this;
		if(Ext.getCmp(that.id + 'label')){
			var labelComp = Ext.getCmp(that.id + 'label');
			labelComp.show();	
			labelComp.el.dom.innerHTML = '<img style="margin-bottom:0px; margin-left:2px;" src = "/iportalweb/iportal/images/default/form/exclamation.gif" '+
				'ext:qtip="'+m+'"  ext:qclass="x-form-invalid-tip "  />';
		}
		document.getElementById(that.id + 'text').className = 'x-form-text x-form-field errorBg';			
	},
	clearInvalid : function(){
			var that = this;
			Ext.getCmp(that.id + 'label').hide();
			document.getElementById(that.id + 'text').className = 'x-form-text x-form-field normalBg';			
	},
	// sets the value to the underlying textfield of lookup field
	// @param val : value to be set to the textfield
	setValue : function(val){
		if(val !== null)
		Ext.getCmp(this.id + 'text').setValue(val) ; 
	},
	changeFn : function(){
		this.clearInvalid();
		var that=this;
		if(this.changeFunction){
			var validFlag = this.changeFunction(this);
			if(Ext.type(validFlag)=='boolean'){
				this.fireEvent("valid", this);
			}else {
				this.markInvalid(validFlag);
			}
		}
	},
	afterRender:function() {        
		iportal.formelement.LookUp.superclass.afterRender.apply(this, arguments);    
		this.setValue = this.setValue.createSequence(this.changeFn); 
	},
	getPrintData : function(){
		var label = this.plainLabel;
		var fieldValue = this.getValue();
		var printMap = {};
		printMap[label] = fieldValue;
		return printMap;
	}

});

Ext.reg('iportal-lookup', iportal.formelement.LookUp);


/**
 * @class iportal.formelement.StaticDateField
 * @extends Ext.form.DateField
 * Base class to customize a datefield display in a form layout.
 * @constructor
 * Creates a new DateField Field
 * @param {Object} config Configuration options
 * 
 */

iportal.formelement.StaticDateField = function(config){
    this.name = config.name || config.id;
    iportal.formelement.StaticDateField.superclass.constructor.call(this, config);
};

Ext.extend(iportal.formelement.StaticDateField, Ext.form.DateField,  {
	 /**
    * @cfg {String/Object} required ,to specify whether this field is mandatory (defaults to false)
    */
   required : false,
	
	/**
    * @cfg {Object} bundleKey ,key used by resource to lookup bundle(defaults to '')
    */
	bundleKey : '',
	/**
    * @cfg {Object} submitFormat ,this is the format used for submitting the data irrespective of the 
	 *	preferences settings and display.
    */
	submitFormat:'d/m/y',
	
    // private
	initComponent:function(){
		iportal.formelement.StaticDateField.superclass.initComponent.apply(this, arguments);	
		//this.format = canvas.datePreferences.getDateFormat();
		var bundle;
		if(!this.fieldLabel){
			this.fieldLabel = "LBL_"+this.id;
		}
		// This is an ext bug as when in IE dont like name and id to be same in datefields
		// which are manipulating with menu listeners.
		var _id =  this.id;
		this.id = "DATE_" + _id;
		this.name = _id;
		var that = this;
		this.readOnly = true;
		this.editable = false; // Static field look and Behaviour 
		this.style = 'border:none;padding-left:0px;background: transparent;cursor: default;'; 
		this.focusClass = 'staticfield_focus';	
		this.triggerClass = 'invisibleClass';
		this.onTriggerClick = Ext.emptyFn;
		this.format = canvas.datePreferences.getDateFormat();			
		if(Ext.isEmpty(this.bundleKey)){
			this.bundleKey = this.findParentByType('iportal-formpanel').bundleKey;
		}
			try{
				bundle = CRB.getBundle(this.bundleKey);
			}
			catch(e){
		}
		this.plainLabel = bundle[this.fieldLabel];

		if(this.required){
			try{
				/*ANZ formelement cleanup */
				if(bundle[this.fieldLabel]==undefined)
				{
					this.fieldLabel='<span class = \'non_mandatory\'"></span>' + bundle[this.fieldLabel];
				}
				else
				{
					this.fieldLabel='?' + this.fieldLabel+'?';
				}
				
			}
			catch(e){
				this.fieldLabel='<span class = \'non_mandatory\'"></span>' + '?' + this.fieldLabel + '?';
			}
			this.allowBlank=false;
			
//			this.blankText = bundle['ERR_MANDATORY'];
			this.blankText = bundle['ERR_MANDATORY_DATEFIELD'];
			
		}
		else{
			try{
				this.fieldLabel= '<span class = \'non_mandatory\'"></span>' + bundle[this.fieldLabel];
			}
			catch(e){
				this.fieldLabel= '<span class = \'non_mandatory\'"></span>' +'?' + this.fieldLabel + '?';
			}
		}
		this.labelSeparator = '';
		this.anchor = (this.anchor == undefined) ? '' : this.anchor ;
		// This is to ensure that the select on date menu is actually bubbling it to date field, as whoever using 
		// the datefield maynot be directly interacting with menu. 
		this.menuListeners = {
							select: function(m, d){	
								////alert(d);
								that.setValue(d.format(that.format));
								that.fireEvent('select', that);
							},
							show: function(){ 
								that.onFocus();
							},
							hide: function(){
								that.focus.defer(10, that);
								var ml = that.menuListeners;
								that.menu.un("select", ml.select, that);
								that.menu.un("show", ml.show, that);
								that.menu.un("hide", ml.hide, that);
							}
			}
	},
   
	/**
    * Sets the format of this datefield &#46; 
    * @param {String} f The format string value to set
	 * Supported Formats are
	 * 'd/m/Y' (defaults to this format) eg: 04/11/08 - 4th November 2008
	 * 'm/d/Y'  eg: 07-11-08 - 7th November 2008
	 * 'd-m-y'  eg: 07-11-08 - 7th November 2008
	 * 'd-m-Y'  eg: 06-11-2008 - 6th November 2008   
	 * 'd.m.Y'  eg: 06.11.2008 - 6th November 2008   
	 * 'd.m.y'  eg: 06.11.08 - 6th November 2008
	 * 'm.d.Y'  eg: 11.05.2008 - 5th November 2008
	 * 'm.d.y'  eg: 11.05.08 - 5th November 2008
    */
   setFormat : function(f){
       this.format  = f;		
   },
	setValue : function(date){
		if ( this.readOnly=true && date == ""){
			return Ext.form.DateField.superclass.setValue.call(this,"--");
		}
	    return Ext.form.DateField.superclass.setValue.call(this, this.formatDate(this.parseDate(date)));
	},
	markInvalid : function(m){
       return true;		
   },
	// Override the onRender method to insert a hidden field to store the format of the 
	// datefield.
	onRender:function() {        
		iportal.formelement.StaticDateField.superclass.onRender.apply(this, arguments);        
		var name = this.name || this.el.dom.name;        
		this.hiddenField = this.el.insertSibling({             
			tag:'input'            
			,type:'hidden'           
			,name:name          
			,value:this.formatHiddenDate(this.parseDate(this.value))      
		});        
		this.hiddenName = name; 
		// prevent input submission
		this.el.dom.removeAttribute('name');        
		this.el.on({            
			keyup:{scope:this, fn:this.updateHidden}      
			,blur:{scope:this, fn:this.updateHidden}       
		});    
		this.setValue = this.setValue.createSequence(this.updateHidden); 			
		}
	// Ensure that once the field is disabled, the hidden uniquely formatted data also dont get posted 
	,onDisable: function(){    
		iportal.formelement.DateField.superclass.onDisable.apply(this, arguments);        
		if(this.hiddenField) {            
		this.hiddenField.dom.setAttribute('disabled','disabled');      
			}   
		} 
	// do the reverse on enabling 
	,onEnable: function(){      
		iportal.formelement.DateField.superclass.onEnable.apply(this, arguments);  
		if(this.hiddenField) {       
		this.hiddenField.dom.removeAttribute('disabled');     
		}
		} 
	// formats the hidden stored date with submit format specified
	,formatHiddenDate : function(date){     
		return Ext.isDate(date) ? Ext.util.Format.date(date, this.submitFormat) : date; 
		}
	// method to store the datefield with latest data clicked. This method will be
	// called on every events which can alter the value od datefield.
	,updateHidden:function() {     
		this.hiddenField.dom.value = this.formatHiddenDate(this.getValue()); 
	},
	getPrintData : function(){
		var label = this.plainLabel;
		var fieldValue = this.getValue();
		if(Ext.isDate(fieldValue)){
			fieldValue = fieldValue.format(this.format);
		}
		var printMap = {};
		printMap[label] = fieldValue;
		return printMap;
	} 
});

Ext.reg('iportal-staticdatefield', iportal.formelement.StaticDateField);




/*********************************************************************************************************************/
/**
 * @class iportal.formelement.MultiSelect
 * @extends Ext.form.MultiSelect
 * Base class to customize a radio button in a form layout.
 * @constructor
 * Creates a new TextArea Field
 * @param {Object} config Configuration options
 * 
 */

iportal.formelement.MultiSelect = function(config){
    this.name = config.name || config.id;
    iportal.formelement.MultiSelect.superclass.constructor.call(this, config);
};

Ext.extend(iportal.formelement.MultiSelect, Ext.ux.form.MultiSelect,  {
	 /**
     * @cfg {String/Object} required ,to specify whether this field is mandatory (defaults to false)
     */
    required : false,
	
	/**
     * @cfg {Object} bundleKey ,key used by resource to lookup bundle(defaults to '')
     */
	bundleKey : '',
	
	/**
     * @cfg {Object} lookup ,used when textfield is part of a lookup button
     */
	lookup : false,
	
		
	/**
     * @cfg {String/Object} validationType ,to specify what modes of validation this field should
	 * support &#46;(defaults to none)
	 * Standard modes available are
	 * 1 alphaNumeric - field allows only alphanumeric characters
	 * 2 none - no validation
     */
    
    /**
     * @cfg {Object} allowSpaces ,used when spaces are allowed inside the textfield
     * defaults to false
     */
     // private
	initComponent:function(){
		iportal.formelement.MultiSelect.superclass.initComponent.apply(this, arguments);	
		var commonbundle = CRB.getFWBundle();
		var bundle;

		if(Ext.isEmpty(this.bundleKey)){
			this.bundleKey = this.findParentByType('iportal-formpanel').bundleKey;
		}
			try{
				bundle = CRB.getBundle(this.bundleKey);
			}
			catch(e){
		}
		this.plainLabel = bundle[this.fieldLabel];


		
		////alert(this.id);
		if(!this.fieldLabel)
			this.fieldLabel = "LBL_"+this.id;
			
		
		this.plainLabel = bundle[this.fieldLabel];
			
		if(this.required){
			try{
				this.plainLabel = bundle[this.fieldLabel];	
				this.fieldLabel=bundle[this.fieldLabel]+'<span class = \'mandatory\'">*</span>';
			}
			catch(e){
				this.fieldLabel='<span class = \'mandatory\'">*</span>' + '?' + this.fieldLabel + '?';
			}
			if(this.lookup){
				this.allowBlank=true;
			} else {
				this.allowBlank=false;				
			}
		}
		else{
			try	{
				this.fieldLabel= '<span class = \'non_mandatory\'"></span>' + bundle[this.fieldLabel];
			}
			catch(e){
				this.fieldLabel= '<span class = \'non_mandatory\'"></span>' + '?' + this.fieldLabel + '?';
			}
		}
							
		
		
		
		
	},
	getPrintData : function(){
		var label = this.plainLabel;
		var fieldValue = this.getValue();
		var printMap = {};
		printMap[label] = fieldValue;
		return printMap;
	}
	
});

Ext.reg('iportal-multiselect', iportal.formelement.MultiSelect);


iportal.showConfMesWin = function(m,parentWinId){
	var masterTmp = new Ext.Template(
		    '<div class="custom-confirm-window-inner">{lblsvalues}</div>'       
		);
	var subTmp = new Ext.Template(
			'<div class="first-row-confirm">'+
			'<div class="label-field-confirm">{label} :</div>'+
			'<div class="value-field-confirm">{lblvalue}</div>'+
			'</div>'		
	);
	var msgTmp = new Ext.Template(
				'<div class="first-row-singleline">{onlymsg}</div>'		
	);
	var commonbundle = CRB.getFWBundle();
	var cuserbundle = CRB.getFWBundle();
	var message_desc='';
	var od_status='';
	var transaction_head='';
	var transaction_ref_no='';
	var maker_date_time='';
	var messageToShow ='';
	if(m.message !== null){
		message_desc = m.message;
	}
	if(m.status !== null){
		od_status = m.status;
		if(od_status){
			od_status = cuserbundle['ACTIVITY_STATUS_'+od_status];
		}
	}
	if(m.transaction !== null){
		transaction_head = m.transaction;
	}
	if(m.transaction_ref !== null){
		transaction_ref_no = m.transaction_ref;
	}
	if(m.date_time !== null){
		maker_date_time = m.date_time;
	}
	var server_maker_date_time = maker_date_time;
	maker_date_time = iportal.jsutil.getFormattedDateAndTime(maker_date_time);
	//maker_date_time = iportal.preferences.TimezoneManager.getLocaleTimeFromFormattedString(maker_date_time);
	if(maker_date_time.indexOf('NaN') != -1){
		maker_date_time = server_maker_date_time;
	}
	messageToShow = subTmp.apply({ 
					'label':commonbundle['LBL_STATUS'],
				    'lblvalue':od_status
				   });
	messageToShow += msgTmp.apply({'onlymsg':message_desc});
	messageToShow += subTmp.apply({ 
						'label':commonbundle['LBL_TXN_REF_NUM'],
					    'lblvalue':transaction_ref_no
					   });
	messageToShow += subTmp.apply({ 
						'label':commonbundle['LBL_DATE_TIME'],
					    'lblvalue':maker_date_time
					   });	
	messageToShow += subTmp.apply({ 
						'label':commonbundle['LBL_TXN_TYPE'],
					    'lblvalue':transaction_head
					   });	
	var finalhtml = masterTmp.apply({'lblsvalues':messageToShow});

	var conf_window = new iportal.Dialog({
		dialogType:'USERDEFINED',
		dialogStyle:'CLOSE',
		title :commonbundle['LBL_CONFIRMATION'],
		width:560,
		height:260,
		close_Handler:function(){
			conf_window.close();
			//If parent win id pass, and it is available then close that
			if(!Ext.isEmpty(parentWinId)){
				if(Ext.getCmp(parentWinId)){
					try{
					Ext.getCmp(parentWinId).close();
					}catch(e){}
				}
			}
		},
		message : finalhtml
	});
	conf_window.show();
}

//
// This is another version of confirmation message window which
// displays several transaction reference numbers at a time.
// @param m metadta object containing what data to be included inside 
// 		confirmation window
// @param parentWinId a reference to the parent window , passed iff 
// 		parent window is also to be closed while closing the confirmation 
//		window 
//
// m {
//
//}
iportal.showMultiTxnsConfMsg=function(m,parentWinId){
	var masterTmp = new Ext.Template(
		    '<div class="custom-confirm-window-inner">{lblsvalues}</div>'       
		);
	var subTmp = new Ext.Template(
			'<div class="first-row-confirm">'+
			'<div class="label-field-confirm">{label} :</div>'+
			'<div class="value-field-confirm">{lblvalue}</div>'+
			'</div>'		
	);
	
	var rejFailTmp = new Ext.Template(
			'<div class="first-row-confirm">'+
			'<div class="label-field-confirm">{label} :</div>'+
			'<div class="value-field-confirm">{lblvalue}</div>'+
			'<div class="label-field-confirm">{label2} :</div>'+
			'<div class="value-field-confirm">{lblvalue2}</div>'+
			'</div>'		
	);
	
	var msgTmp = new Ext.Template(
				'<div class="first-row-singleline">{onlymsg}</div>'		
	);
	var commonbundle = CRB.getFWBundle();
	var cuserbundle = CRB.getFWBundle();
	var message_desc='';
	var od_status='';
	var transaction_head='';
	var transaction_ref_no='';
	var maker_date_time='';
	var messageToShow ='';
	if(m.message !== null){
		message_desc = m.message;
	}
	if(m.status !== null){
		od_status = m.status;
		if(od_status){
			od_status = cuserbundle['ACTIVITY_STATUS_'+od_status];
		}
	}	
	if(m.transaction_ref !== null){
		transaction_ref_no = m.transaction_ref;
	}
	if(m.date_time !== null){
		maker_date_time = m.date_time;
	}
	if(m.transaction !== null  && m.transaction !== undefined){
		transaction_head = m.transaction;
	}
	var server_maker_date_time = maker_date_time;
	maker_date_time = iportal.jsutil.getFormattedDateAndTime(maker_date_time);
	//maker_date_time = iportal.preferences.TimezoneManager.getLocaleTimeFromFormattedString(maker_date_time);
	if(maker_date_time.indexOf('NaN') != -1){
		maker_date_time = server_maker_date_time;
	}
	if(Ext.isEmpty(m.failed_message) && Ext.isEmpty(m.failed_ref)){
		messageToShow = subTmp.apply({ 
			'label':commonbundle['LBL_STATUS'],
		    'lblvalue':od_status
		   });
	}
	messageToShow += msgTmp.apply({'onlymsg':message_desc});
	for(var index= 0; index< m.transaction_ref.length ; index++){
		if(m.failed_message && Ext.isEmpty(m.failed_ref)){
			messageToShow += rejFailTmp.apply({ 
				'label':commonbundle['LBL_TXN_REF_NUM'],
				'lblvalue':m.transaction_ref[index]+'<BR>',
				'label2':commonbundle['LBL_REASON'],
				'lblvalue2':m.failed_message[index]
			});
		}
		else{
			messageToShow += subTmp.apply({ 
				'label':commonbundle['LBL_TXN_REF_NUM'],
				'lblvalue':m.transaction_ref[index]
			});
		}
	}
	messageToShow += subTmp.apply({ 
						'label':commonbundle['LBL_DATE_TIME'],
					    'lblvalue':maker_date_time
					   });	
	if(transaction_head !== ''){		
		messageToShow += subTmp.apply({ 
						'label':commonbundle['LBL_TXN_TYPE'],
					    'lblvalue':transaction_head
					   });	
	}
	var dialogStyleVar = 'PRINT_CLOSE';
	var continueButtonHandler = Ext.emptyFn;
	
	
	
	if(m.digital_sign){
		messageToShow += msgTmp.apply({'onlymsg':m.digital_sign});
		for(var index= 0; index< m.dig_transaction_ref.length ; index++){
			messageToShow += subTmp.apply({ 
				'label':commonbundle['LBL_TXN_REF_NUM'],
				'lblvalue':m.dig_transaction_ref[index]
			});
		}
		dialogStyleVar = 'CONTINUE';
		continueButtonHandler = m.continueHandler;
	}else{
		if(m.failed_msg){
			messageToShow += msgTmp.apply({'onlymsg':m.failed_msg});
			for(var index= 0; index< m.failed_ref.length ; index++){
				if(m.failed_message){
					messageToShow += rejFailTmp.apply({ 
						'label':commonbundle['LBL_TXN_REF_NUM'],
						'lblvalue':m.transaction_ref[index]+'<BR>',
						'label2':commonbundle['LBL_REASON'],
						'lblvalue2':m.failed_message[index]
					});
				}
				else{
					messageToShow += subTmp.apply({ 
						'label':commonbundle['LBL_TXN_REF_NUM'],
						'lblvalue':m.failed_ref[index]
					});
				}
			}
		}
	}
	var finalhtml = masterTmp.apply({'lblsvalues':messageToShow});
	var conf_window = new iportal.Dialog({
		dialogType:'USERDEFINED',
		dialogStyle: dialogStyleVar,
		continueHandler : continueButtonHandler,
		//close_Handler
		title :commonbundle['LBL_CONFIRMATION'],
		width:546,
		height:350,
		autoScroll:true,
		continueHandler:function(){
			conf_window.close();
			//If parent win id pass, and it is available then close that
			if(!Ext.isEmpty(parentWinId)){
				if(Ext.getCmp(parentWinId)){
					Ext.getCmp(parentWinId).close();
				}
			}
			if(m.continueHandler){
				m.continueHandler();
			}
		},
		closeHandler:function(){
			var paramObj = {};
			paramObj['INPUT_REFERENCE_NO'] = m.INPUT_REFERENCE_NO;
			paramObj['PRODUCT_NAME'] = m.PRODUCT_NAME;
			paramObj['INPUT_VER_NO'] = m.INPUT_VER_NO;
			paramObj['INPUT_PRODUCT'] = m.PRODUCT_NAME;
			paramObj['INPUT_FUNCTION_CODE'] = m.INPUT_FUNCTION_CODE;
			paramObj['INPUT_SUB_PRODUCT'] = m.INPUT_SUB_PRODUCT;
			paramObj['SELECTED_RECORDS'] = m.SELECTED_RECORDS;
			paramObj['PAGE_CODE_TYPE'] = m.PAGE_CODE_TYPE;
			iportal.cancelHandler({INPUT_VER_NO:m.INPUT_VER_NO,INPUT_REFERENCE_NO:m.INPUT_REFERENCE_NO, params:paramObj});
		},
		message : finalhtml
	});	
	conf_window.show();
}
//
// This is another version of error message window which
// displays several transaction reference numbers at a time.
// @param m metadta object containing what data to be included inside 
// 		confirmation window
//
//}
iportal.showMutiTxnErrMsgConfWin = function(m,parentWinId){
	var masterTmp = new Ext.Template(
		    '<div class="custom-confirm-window-inner">{lblsvalues}</div>'       
		);
	var subTmp = new Ext.Template(
			'<div class="first-row-confirm">'+
			'<div class="label-field-confirm">{label} :</div>'+
			'<div class="value-field-confirm">{lblvalue}</div>'+
			'</div>'		
	);
	
	var rejFailTmp = new Ext.Template(
			'<div class="first-row-confirm">'+
			'<div class="label-field-confirm">{label} :</div>'+
			'<div class="value-field-confirm">{lblvalue}</div>'+
			'<div class="label-field-confirm">{label2} :</div>'+
			'<div class="value-field-confirm">{lblvalue2}</div>'+
			'</div>'		
	);
	
	var msgTmp = new Ext.Template(
				'<div class="first-row-singleline">{onlymsg}</div>'		
	);
	var commonbundle = CRB.getFWBundle();
	var cuserbundle = CRB.getFWBundle();
	var messageToShow ='';
	if(m.failed_msg){
		messageToShow += msgTmp.apply({'onlymsg':m.failed_msg});
		for(var index= 0; index< m.failed_ref.length ; index++){
			if(m.failed_message){
				messageToShow += rejFailTmp.apply({ 
					'label':commonbundle['LBL_TXN_REF_NUM'],
					'lblvalue':m.failed_ref[index]+'<BR>',
					'label2':commonbundle['LBL_REASON'],
					'lblvalue2':m.failed_message[index]
				});
			}
			else{
				messageToShow += subTmp.apply({ 
					'label':commonbundle['LBL_TXN_REF_NUM'],
					'lblvalue':m.failed_ref[index]
				});
			}
		}
		messageToShow += msgTmp.apply({'onlymsg':m.end_msg});
	}
	var finalhtml = masterTmp.apply({'lblsvalues':messageToShow});
	var invokeCancelHandler = function(){
			var paramObj = {};
			paramObj['INPUT_REFERENCE_NO'] = m.INPUT_REFERENCE_NO;
			paramObj['PRODUCT_NAME'] = m.PRODUCT_NAME;
			paramObj['INPUT_VER_NO'] = m.INPUT_VER_NO;
			paramObj['INPUT_PRODUCT'] = m.PRODUCT_NAME;
			paramObj['INPUT_FUNCTION_CODE'] = m.INPUT_FUNCTION_CODE;
			paramObj['INPUT_SUB_PRODUCT'] = m.INPUT_SUB_PRODUCT;
			paramObj['SELECTED_RECORDS'] = m.SELECTED_RECORDS;
			paramObj['PAGE_CODE_TYPE'] = m.PAGE_CODE_TYPE;
			iportal.cancelHandler({INPUT_VER_NO:m.INPUT_VER_NO,INPUT_REFERENCE_NO:m.INPUT_REFERENCE_NO, params:paramObj});
	};	
	var conf_window = new iportal.Dialog({
		dialogType:'USERDEFINED',
		dialogStyle: 'CLOSE',
		title :commonbundle['LBL_ERROR'],
		width:546,
		height:350,
		autoScroll:true,
		closeHandler:function(){
			invokeCancelHandler();
		},
		closebuttonHandler:function(){
			invokeCancelHandler();
			conf_window.close();
		},
		message : finalhtml
	});	
	conf_window.show();
	
}


/**
 * @class iportal.formelement.StaticAmountField
 * @extends iportal.formelement.AmountField
 * @constructor
 * Creates a new StaticAmountField
 * @param {Object} config Configuration options
 * 
 */

iportal.formelement.StaticAmountField = function(config){
    this.name = config.name || config.id;
    iportal.formelement.StaticAmountField.superclass.constructor.call(this, config);
};

Ext.extend(iportal.formelement.StaticAmountField, Ext.form.TextField,  {
	 /**
    * @cfg {String/Object} required ,to specify whether this field is mandatory (defaults to false)
    */
   required : false,
   	
	/**
    * @cfg {Object} bundleKey ,key used by resource to lookup bundle(defaults to '')
    */
	bundleKey : '',
	
	signdigits:2,
	cls:'x-form-textField',
    // private
	initComponent:function(){
		iportal.formelement.StaticAmountField.superclass.initComponent.apply(this, arguments);
		var bundle;
		var commonbundle = CRB.getFWBundle();
		if(!this.fieldLabel){
			this.fieldLabel = "LBL_"+this.id;
		}
		// All amount field values sent to Server will be suffixed with '_AMT'. This should 
		// be followed through out the application
		this.name =  this.id + '_AMT';
		if(Ext.isEmpty(this.bundleKey)){
			this.bundleKey = this.findParentByType('iportal-formpanel').bundleKey;
		}		
			try{

				bundle = CRB.getBundle(this.bundleKey);
			}
			catch(e){
		}

		if(bundle != null) {				
				this.plainLabel = bundle[this.fieldLabel];	

				if(bundle[this.fieldLabel]==undefined)
				{
					this.fieldLabel='?' + this.fieldLabel +'?';
				}
				else
				{
					this.fieldLabel='<span class = \'non_mandatory\'"></span>' + bundle[this.fieldLabel];
				}
				
			}		
			
		else {
				this.fieldLabel ='<span class = \'non_mandatory\'"></span>' + this.fieldLabel + '?';
		}
		this.maskRe = /[0-9.,]/ ;	
		
		this.anchor = (this.anchor == undefined) ? '' : this.anchor ;
		this.labelSeparator = '';
		if(this.maxLength < Number.MAX_VALUE)
		{
			this.maxLengthText = commonbundle['ERR_MAXLENGTH_EXCEED']; 
		}		
		this.style = 'border:none; padding-left:0px;background: transparent;';
		this.readOnly = true ;		
		//this.width=235;
		this.setValue = this.setValue.createSequence(this.updateHidden); 
		// formatting the default value
		if(this.value){
			var StringNumber = canvas.amountFormatter.getInstance();
			this.value = StringNumber.basicFormatter(this.value.replace(/,/g, ""),this.signdigits);		
		}
		if(!this.value){
			this.setValue('--');
		}
	},		
	afterRender:function() {        
		iportal.formelement.StaticAmountField.superclass.afterRender.apply(this, arguments);    
		var formpanelLayer = this.findParentByType('iportal-formpanel');
		if(this.value && this.value != '--'){
			formpanelLayer.add({xtype:'hidden',name: this.id,id:this.id.concat('_HIDDEN'),value:this.value.replace(/,/g, "")});	
		}else{
		formpanelLayer.add({xtype:'hidden',name: this.id,id:this.id.concat('_HIDDEN'),value:''});	
		}
	},
	updateHidden:function() {  
		var val =this.getValue();
		if(val == '--'){
			if(Ext.getCmp(this.id.concat('_HIDDEN')) !== undefined)	{
				Ext.getCmp(this.id.concat('_HIDDEN')).setValue("");
			}
		}else{
			//val = val.replace(/,/g, ""); 
			
			if(Ext.getCmp(this.id.concat('_HIDDEN')) !== undefined)	{
				Ext.getCmp(this.id.concat('_HIDDEN')).setValue(val);
			}	
		}					
	},	
	
	/**
	 *
	 * - This API takes the currency from the currField of the amountfield
	 * components returns the decimal place value for the currency.
	 * - if the currency is not found from in cache, it takes the bank's
	 * default currency from the preference
	 * - if the currency is also not found from the preference, it takes the
	 * default currency configured in the orbionedirect properties file.
	 * - Finally updates the this.signdigits with the decimal place value
	 * obtained for the respective currency.
	 * 
	 */
	updateCurrField: function(){
		var currDecimalPlaceList = cbx.globalcurrency.metadata.getCurrDecimalPlaceList();
		var currfield = this.ccyField;
		var curr = Ext.getCmp(currfield).text;
		if(!curr || curr.trim() == ''||curr ==''){
			// get the default curr from preference.
			curr = iportal.systempreferences.getDefaultBankCCY();
			if(!curr || curr.trim() == ''|| curr ==''){
				// get the default curr configured in the orbidirect properties.
				curr = cbx.globalcurrency.metadata.getDefaultCurrency();		
			}
		}
		
		if(curr && curr != '' && curr.trim() != ''){
			var currList=Ext.decode(currDecimalPlaceList);
			var currBasedDecimal = currList[curr];
			this.signdigits = currBasedDecimal; 
		}
	},
	
	
	
	getValue : function() {
		var val = iportal.formelement.StaticAmountField.superclass.getValue.apply(this, arguments); 
	 	//return val.replace(/,/g, ""); 
		return val;
	},	
	setFormattedValue : function(v) {
		if(v){	
			if(v == '' || v.trim() == ''){
				this.setValue('--');
				return;
			}		
			var StringNumber = canvas.amountFormatter.getInstance();
			this.setValue(StringNumber.basicFormatter(v.replace(/,/g, ""),this.signdigits));	
		}
	},
	markInvalid : function(m){
       return true;		
    },
	isVisible : function(){
		return iportal.formelement.StaticAmountField.superclass.isVisible.apply(this, arguments);  
	},
	getPrintData : function(){
		var label = this.plainLabel;
		var fieldValue = this.getValue();
		var printMap = {};
		printMap[label] = fieldValue;
		return printMap;
	}	
});
Ext.reg('iportal-staticamountfield', iportal.formelement.StaticAmountField);


/**
 * @class iportal.formelement.TextArea
 * @extends Ext.form.TextArea
 * Base class to customize a radio button in a form layout.
 * @constructor
 * Creates a new TextArea Field
 * @param {Object} config Configuration options
 * 
 */

iportal.formelement.TextArea = function(config){
    this.name = config.name || config.id;
    iportal.formelement.TextArea.superclass.constructor.call(this, config);
};

Ext.extend(iportal.formelement.TextArea, Ext.form.TextArea,  {
	
	/**
     * @cfg {Object} bundleKey ,key used by resource to lookup bundle(defaults to '')
     */
	bundleKey : '',
	
	plainLabel : '',
	
//	cls:'x-form-textarea',
	// private
	initComponent:function(){
		
		iportal.formelement.TextArea.superclass.initComponent.call(this);	
		var commonbundle = CRB.getFWBundle();
		var bundle;
		if(!this.fieldLabel){
			this.fieldLabel = "LBL_"+this.id;
		}
		if(Ext.isEmpty(this.bundleKey)){
			var parent= this.findParentByType('iportal-formpanel')|| this.findParentByType('iportal-fluidform');
			this.bundleKey =parent.bundleKey;
		}
			try{
				bundle = CRB.getBundle(this.bundleKey);
				if(this.fieldLabel)
					this.plainLabel = bundle[this.fieldLabel];
			}
			catch(e){
			}
	
		this.labelSeparator = '';
		if(this.fieldLabel){
			if(this.required ){
				try{
				
//					this.blankText = String.format(commonbundle['ERR_MANDATORY'] , this.plainLabel);
					this.blankText = String.format(commonbundle['ERR_MANDATORY_TEXTAREA'] , this.plainLabel);
					

					if(bundle[this.fieldLabel]==undefined)
					{
						this.fieldLabel='?'+this.fieldLabel+'?'+'<span class = \'mandatory\'">*</span>' ;
					}
					else
					{
						this.fieldLabel=bundle[this.fieldLabel]+'<span class = \'mandatory\'">*</span>' ;
					}
					
				}
				catch(e){
					this.fieldLabel='<span class = \'mandatory\'">*</span>' + '?' + this.fieldLabel + '?';
				}			
			} 
			else if(this.conditional){
				try{
					this.blankText = String.format(commonbundle['ERR_MANDATORY'] , bundle[this.fieldLabel]);
					if(bundle[this.fieldLabel]==undefined)
					{
						this.fieldLabel='?'+this.fieldLabel+'?'+'<span class = \'mandatory_fx\'">**</span>';
						
					}
					else
					{
						this.fieldLabel=bundle[this.fieldLabel]+'<span class = \'mandatory_fx\'">**</span>';
					}
					
				}
				catch(e){
					this.fieldLabel='?'+this.fieldLabel+'?'+'<span class = \'mandatory_fx\'">**</span>' ;
				}
			}
			
			else{
				try	{
					this.fieldLabel= '<span class = \'non_mandatory\'"></span>' + bundle[this.fieldLabel];
				}
				catch(e){
					this.fieldLabel= '<span class = \'non_mandatory\'"></span>' + '?' + this.fieldLabel + '?';
				}
			}
		}
		switch(this.validationType)	{
		// validation type currently supported is alphaNumeric and numeric alone, which restricts the keystrokes
		// to be only alphabets and numerals.Numeric vType is an alternate for numberfield
		case 'alphaNumeric' : 
						if(this.allowSpaces){
							this.maskRe = /[A-Za-z0-9 ]/;
						}else{
						this.maskRe = /^[a-zA-Z0-9]+$/;
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
		
	},
	getPrintData : function(){
		var label = this.plainLabel;
		var fieldValue = this.getValue();
		var printMap = {};
		printMap[label] = fieldValue;
		return printMap;
	}
});

Ext.reg('iportal-textarea', iportal.formelement.TextArea);





/**
 * @class iportal.formelement.DateCombo
 * @extends Ext.form.DateCombo
 * Base class to customize a ComboBox display in a form layout.
 * @constructor
 * Creates a new DateCombo Field
 * @param {Object} config Configuration options
 * 
 */

iportal.formelement.DateCombo = function(config){
    this.name = config.name || config.id;
    iportal.formelement.DateCombo.superclass.constructor.call(this, config);
};

Ext.extend(iportal.formelement.DateCombo, Ext.form.ComboBox,  {
	 /**
     * @cfg {Boolean} required ,to specify whether this field is mandatory (defaults to false)
     */
    required : false,
	
	/**
     * @cfg {Object} bundleKey ,key used by resource to lookup bundle(defaults to '')
     */
	bundleKey : '',
	
	/**
     * @cfg {Boolean} includeSelect ,to specify whether combobox's first option is select or not
	 * (defaults to true)
     */
	includeSelect : true,
	
	/**
     * @cfg {String} defaultValue ,initially Selected value for this combo(defaults to '')
     */
	defaultValue : '',
	/**
     * @cfg {String} rawKeys ,raw keys to be set in the combo in the absence of bundle(defaults to null)
     */
	dateValues : null,
	/**
     * @cfg {String} rawValues ,raw values to be set in the combo in the absence of bundle(defaults to null)
     */
	dateKeys : null,
	
	plainLabel : '',
	width:175,
     // private
	initComponent:function(){

	iportal.formelement.DateCombo.superclass.initComponent.apply(this, arguments);
	this.mode = 'local';
	var bundle;
	var commonbundle = CRB.getFWBundle();
	
	if(!this.fieldLabel){
		this.fieldLabel = "LBL_"+this.id;
	}
	
	if(Ext.isEmpty(this.combundleKey)){
		this.combundleKey = this.findParentByType('iportal-formpanel').bundleKey;
	}
	if(this.combundleKey !== ''){
		try{
			bundle = CRB.getBundle(this.combundleKey);
		}
		catch(e){				
		}
	}
	

	var that = this;
	if(bundle !== null)	{
		this.plainLabel = bundle[this.fieldLabel];
		if(this.required) {
		
//			this.blankText = String.format(commonbundle['ERR_MANDATORY'] , this.plainLabel);	
			this.blankText = String.format(commonbundle['ERR_MANDATORY_COMBOBOX'] , this.plainLabel);
			
			/*ANZ formelement cleanup*/
			if(bundle[this.fieldLabel]==undefined)
			{
				this.fieldLabel= '?'+this.fieldLabel+'?'+'<span class = \'mandatory\'">*</span>';	
			}
			else
			{
				this.fieldLabel= bundle[this.fieldLabel]+'<span class = \'mandatory\'">*</span>';					
			}
	
			this.allowBlank = false;		
		}
		else
		{
			try
			{
				this.fieldLabel= '<span class = \'non_mandatory\'"></span>' + bundle[this.fieldLabel];
			}
			catch(e)
			{
				this.fieldLabel= '<span class = \'non_mandatory\'"></span>' + '?' + this.fieldLabel + '?';
			}
		}
	}
	else
	{
		this.fieldLabel= '?' + this.fieldLabel + '?';
	}
	this.anchor = (this.anchor === undefined) ? '' : this.anchor ;
	
	this.editable =   false  ;
	this.labelSeparator = '';
	this.triggerAction = 'all' ;

	this.selectOnFocus = (this.selectOnFocus === undefined) ? true : this.selectOnFocus ;  
	
	var bundleCombo = bundle;
	
	if(this.store === undefined) {		
		if(this.dateValues !== null && this.dateKeys !== null) {
				
				var keyArray = this.dateKeys.copy();
				
				var valueArray = this.dateValues.sort();
				var valueArray = valueArray.walk(function(elt){
					if(Ext.isDate(elt)){
						return elt.format(canvas.datePreferences.getDateFormat());	
					}else{
						return 'NaD';
					}			
				});
				var dataArray = [];
				var rowArray;
				// If includeSelect config option has not been set off first element to be inserted 
				// into our dataArray is Select 
				if(this.includeSelect) {
					rowArray = [];
					// Make sure the value field for Select option is nothing but a space 
					// to avoid confusion at server validations.
					rowArray.push(' ');
					rowArray.push(commonbundle['LBL_SELECT']);
					dataArray.push(rowArray);				
				}
				 
				for(var i = 0 ; i < keyArray.length ; i++ ){
					rowArray = [];
					// ExtJs combo store accepts 2D array . In this case we have to create it from the key array
					// and value array
					//rowArray.push(this.resourcePrefix + keyArray[i]);
					rowArray.push( keyArray[i] );
					rowArray.push(valueArray[i]);
					dataArray.push(rowArray);
				}
			
			this.store = new Ext.data.SimpleStore({
				fields: ['key', 'value'],
				data : dataArray
			});
			this.displayField = 'value';
			this.valueField  = 'key';
			if(this.includeSelect) {
				this.setValue(' ');
			}
			if(this.defaultValue != '') {
				//this.value = bundleCombo[this.resourcePrefix + this.defaultValue];
			}
		}	
		this.on('blur',function(obj){this.mandatoryValidator(obj.value);});	
	}	
	
	},
	/**
     * update the store of this combobox with new keys and values supplied.
     * @param {Array} keyArr containing value keys
     * @param {Array} valueArr containing value values
     */
    updateDateCombo : function(keyArr,valueArr){		
		bundle = CRB.getBundle(this.bundleKey);
		common_bundle = CRB.getFWBundle();
		if(keyArr.length !== valueArr.length )
		{
			// keys and values should be arrays of same length
			return;
		}
		valueArr = valueArr.walk(function(elt){
					if(! Ext.isDate(elt)){
						var eltArr = elt.split('/');
						var dateN = new Date();
						dateN.setFullYear(eltArr[2],eltArr[1]-1,eltArr[0]);
						return dateN;
						//return dateN.format(canvas.datePreferences.getDateFormat());	
					}		
				});				
		valueArr = valueArr.sort(function(a,b){
			return b-a;
		});
		valueArr = valueArr.walk(function(elt){
						return elt.format(canvas.datePreferences.getDateFormat());								
				});
		

		 keyArr = keyArr.walk(function(elt){
							if(! Ext.isDate(elt)){
								var eltArr = elt.split('/');
								var dateN = new Date();
								dateN.setFullYear(eltArr[2],eltArr[1]-1,eltArr[0]);
								return dateN;
								//return dateN.format(canvas.datePreferences.getDateFormat());	
							}		
						});				
				//keyArr = this.sortingDateArray(keyArr);
		 keyArr= keyArr.sort(function(a,b){
				return b-a;
			});
				keyArr = keyArr.walk(function(elt){
								return elt.format('d/m/Y');								
						//return elt.format(canvas.datePreferences.getDateFormat());
						});
		 
				
		if(this.store === undefined){
			this.store = new Ext.data.SimpleStore({
				fields: ['key', 'value']
			});
		}
		this.store.removeAll();
		// create method returns an object which can act as a constructor for every records having 
		// the defined column model. This method should be used instead of using Record constructor
		// directly. See extJs docs for further details

		var newRecord = Ext.data.Record.create([
							{name: 'key', mapping: 'key'},
							{name: 'value', mapping: 'value'}
						]);
		var record;
		
		if(this.includeSelect) {
			record = new newRecord({
								key: ' ',
								value: common_bundle['LBL_SELECT']
							});
			this.store.add( record );
		}
		
		for(var i = 0 ; i < keyArr.length ; i++)
		{			
				record = new newRecord({
								key: keyArr[i],
								value: valueArr[i]
							});
				this.store.add( record );			
			
		}
		if(this.includeSelect) {
			this.setSelect();
		}
		this.store.commitChanges();
		this.clearInvalid();
		return true;
    },
	/**
     * function to set Select option as the value 
     */
	setSelect : function(){
		if(this.includeSelect) {
			this.setValue(' ');
		}
		else {
			this.setValue('');
		}
		this.validateCombo();
	},
	/**
     * function to validate a combobox 
     */
	validateCombo : function(){
	combundle = CRB.getFWBundle();
		if(this.isSelectSelected() && this.required ) {
			this.markInvalid(this.blankText);
		}		
	},
	/**
     * function to check Select option has been selected
     */
	isSelectSelected : function(){
		var returnFlag = (this.getValue() == ' ' || this.getValue() == 'Select') ? true : false;
		return returnFlag;
	},
	/**
     * function listening to blur event to see whether user had select a valid option incase of 
	 * mandatory fields
     * @param {var} v ,selected value of combo
     */
	mandatoryValidator : function(v){
		var that = this;
		bundle = CRB.getFWBundle();
		if(bundle !== null){
			if(v == ' ' && this.required){
				that.markInvalid(that.blankText);
			}else{
				that.clearInvalid();
			}
		}
		else {
			if(v == ' ' && this.required){
			    
                //this.markInvalid('? ERR_MANDATORY ?');
				this.markInvalid('? ERR_MANDATORY_COMBOBOX ?');
				
			}
		}
	},
	getPrintData : function(){
		var label = this.plainLabel;
		var fieldValue = this.getValue();
		var printMap = {};
		printMap[label] = fieldValue;
		return printMap;
	}
	
});

Ext.reg('iportal-datecombobox', iportal.formelement.DateCombo);


/**
 * @class iportal.formelement.EditableLookUp
 * @extends Ext.Panel
 * Base class to customize a LookUp display in a form layout.
 * @constructor
 * Creates a new EditableLookUp 
 * @param {Object} config Configuration options
 * 
 */

 iportal.formelement.EditableLookUp = function(config){
    this.name = config.name || config.id;
    iportal.formelement.EditableLookUp.superclass.constructor.call(this, config);
};

Ext.extend(iportal.formelement.EditableLookUp, Ext.Panel,  {
	
	/**
     * @cfg {Object} bundleKey ,key used by resource to lookup bundle(defaults to '')
     */
	bundleKey : '',	

	/**
     * @cfg {Object} fieldLabel ,label associated with the lookup button 
     */
	fieldLabel : '',
	plainLabel : '',	

	/**
     * @cfg {String/Object} required ,to specify whether this field is mandatory (defaults to false)
     */
    required : false,
    readOnly: false,
	/**
     * @cfg {String/Object} required ,to specify whether this field is mandatory (defaults to false)
     * The lookup window will be opened iff. handler for lookup returns true. So by default give an
     * empty fn which returns true.
     */
    handler : function(){return true},

	/**
     * @cfg {String/Object} buttonTextKey ,text over button (defaults to LOOKUP)
     */
    buttonTextKey : 'LBL_LOOKUP',
    
    submittable : true,
    /**
     * @cfg {String/Object} Performs Vtype validation which allows Braces
     *  
     */
    vtype :'invalidChars', 

	/**
	 * @cfg object required, Meta data object required to render account lookup,
	 * This object can create create with following attributes 
	 * productCode - required, to specify PRODUCT CODE and will be passed to server while retrieving data
	 * subProductCode - required, to specify SUB-PRODUCT CODE and will be passed to server while retrieving data
	 * functionCode - required,  to specify FUNCTION CODE and will be passed to server while retrieving data
	 * cm - required, Should be an object of Ext.grid.ColumnModel, will be used to render lookup grid columns
	 * recordType - required , Used to read records returning from server 
	 * 				Either an Array of field definition objects as passed to Ext.data.Record.create, 
	 * 				or a Record constructor created using Ext.data.Record.create.
	 * rowdbclickhandler - required, Javascript function which would gets executes when a row is double clicked in the grid
	 * extraParams - Optional, If required to pass any params as part of request
	 */
    lookupMetadata:{},
 	/**
 	 * possiable values are 0 and 1
 	 * 0 indicates apply pre-filter
 	 * 1 indicates no pre-filter required.
 	 * @type Number
 	 */
    preFilterRequired :1,
    
	// private
	initComponent:function(){
    	var commonbundle;
		iportal.formelement.EditableLookUp.superclass.initComponent.apply(this, arguments);	
    	this.addEvents('valid','afterblur');
		var that = this;
		this.frame = false;	
		this.bodyBorder = false;
		this.autoWidth = true;	
		this.autoHeight = true;	
		var bundle;
		if(!this.fieldLabel){
			this.fieldLabel = "LBL_"+this.id;
		}
		if(Ext.isEmpty(this.bundleKey)){
			this.bundleKey = this.findParentByType('iportal-formpanel').bundleKey;
		}
			try{
				bundle = CRB.getBundle(this.bundleKey);
			}
			catch(e){
			}
		if(bundle)
			this.plainLabel = bundle[this.fieldLabel];	
		var lookupLabel = this.fieldLabel;
		this.fieldLabel = '';
		var commonbundle = CRB.getFWBundle();
		this.layout = 'table';
		this.layoutConfig = {columns : 4};
		
		if(this.readOnly=="")
		{
			this.readOnly=false;
		}
		var readOnly=this.readOnly;		
		//var lookupMetadataParamscount = 0;
		 
		// Add a text field in form layout to the panel
		this.add({
					columnWidth:.45,
					colspan:2,
					layout: 'form',
					layoutConfig: {labelSeparator:''},
					items: [{
					xtype : 'iportal-textfield',
					width:165,
					lookupButtonFocus:true,  // property added for disabling backspace key while lookup button is foucsed
					vtype : this.vtype, 
										// perform vtype validation in Editable
										// Lookup
					lookup:true,
					maskRe:/[A-Za-z0-9 ]/,
					enableKeyEvents:true,
					listeners:{	
						// listening for the blur event of textfield to do
						// mandatory validation
						'blur':function(field){							
																		
							// To make an ajax request for getting response
							// using widget id only
							
								if(that.lookupMetadata.filterColumn)
							{			
								var columnCount=0;
								var requestParamsMetadata=null;
							var ajaxCallParams = { 							
								"PAGE_CODE_TYPE":'VDF_CODE',
								"INPUT_ACTION":"INIT_DATA_ACTION",
								"WIDGET_ID":that.lookupMetadata.widgetId,
								"LOOKUP_FLAG":false
								
							};
							
							requestParamsMetadata=that.lookupMetadata.reqparamshandler(ajaxCallParams);
							
							
							
							
								//	setTimeout(function(){
								if(requestParamsMetadata!=null){
								for(var i in requestParamsMetadata){
									if(i.indexOf('_PRODUCT')>-1){
										
									}
									
									if(i.indexOf('COLUMN_COUNT')>-1){
											if(requestParamsMetadata['COLUMN_COUNT']!="")
											{
											columnCount=parseInt(requestParamsMetadata['COLUMN_COUNT'])+1;											
											}
									}
									
																					
								}
								
								if(columnCount==0){columnCount=1;}						
							
							if(field.getValue().trim()!="")	
							{
								ajaxCallParams["COLUMN_COUNT"]=columnCount;
								ajaxCallParams["FILTER"+(columnCount)+"_CONSTRAINT"]="contains";
								ajaxCallParams["FILTER"+(columnCount)+"_FIELD"]=that.lookupMetadata.filterColumn;
								ajaxCallParams["FILTER"+(columnCount)+"_VALUE_TXT"]=that.getValue();
								ajaxCallParams["FILTER"+(columnCount)+"_TYPE"]=that.lookupMetadata.filterType;
								ajaxCallParams["IS_FILTER_FORM"]="true";								
								Ext.apply(requestParamsMetadata,ajaxCallParams);
								
							}														
							that.callLookupAjax(requestParamsMetadata, that, field);
							}
							}
							else
							{
							readOnly=true;
							this.lookupMetadata.lookupId = this.id;							
							this.lookupMetadata.IS_FILTER_FORM =false;				
							iportal.formview.showLookupWin(this.lookupMetadata);
							}
								
							},
						'focus':function(field){
								that.submittable = true;
								/*
								 * if(!that.required) {
									return true;
								}*/



							//   focussing in first invalid field

								/*

								Ext.getCmp(that.id + 'label').hide();

								document.getElementById(that.id + 'text').className = 'x-form-text x-form-field normalBg';

								*/

								

								

							

								var bt = Ext.getCmp(that.id + 'button')
							
							 //	bt.fireEvent("click", bt);

							//	Ext.getCmp(that.id + 'button').focus(); 
							
						}
					},
					fieldLabel: lookupLabel,
					readOnly:readOnly, 	
					id : this.id + 'text',
					required: this.required,
					conditional: this.conditional,
					validateOnBlur:false,
					name: this.id,
					bundleKey : this.bundleKey								
				}]
			});					
		buttonHandler = function(){
			//To disable the lookup button
			if(that.readOnly){
				return;
			}
			if(that.buttonTextKey !== 'LBL_LOOKUP'){
				that.handler();
				return;
			}			
			if(that.handler()){// Widgetization of Lookup
				this.lookupMetadata.lookupId = this.id;
					
				//iportal.formview.showLookupWin(this.lookupMetadata);
				
				
														
				// for make an ajax request for getting response
				// using widget id only
				
					if(that.lookupMetadata.filterColumn)
				{			
					var columnCount=0;
					var requestParamsMetadata=null;
				var ajaxCallParams = { 							
					"PAGE_CODE_TYPE":'VDF_CODE',
					"INPUT_ACTION":"INIT_DATA_ACTION",
					"WIDGET_ID":that.lookupMetadata.widgetId,
					"LOOKUP_FLAG":false
					
				};
				
				requestParamsMetadata=that.lookupMetadata.reqparamshandler(ajaxCallParams);
				
				
				
				
					//	setTimeout(function(){
					if(requestParamsMetadata!=null){
					for(var i in requestParamsMetadata){
						if(i.indexOf('_PRODUCT')>-1){
							
						}
						
						if(i.indexOf('COLUMN_COUNT')>-1){
								if(requestParamsMetadata['COLUMN_COUNT']!="")
								{
								columnCount=parseInt(requestParamsMetadata['COLUMN_COUNT'])+1;											
								}
						}
						
																		
					}
					
					if(columnCount==0){columnCount=1;}						
				
				if(field.getValue().trim()!="")	
				{
					ajaxCallParams["COLUMN_COUNT"]=columnCount;
					ajaxCallParams["FILTER"+(columnCount)+"_CONSTRAINT"]="contains";
					ajaxCallParams["FILTER"+(columnCount)+"_FIELD"]=that.lookupMetadata.filterColumn;
					ajaxCallParams["FILTER"+(columnCount)+"_VALUE_TXT"]=that.getValue();
					ajaxCallParams["FILTER"+(columnCount)+"_TYPE"]=that.lookupMetadata.filterType;
					ajaxCallParams["IS_FILTER_FORM"]="true";								
					Ext.apply(requestParamsMetadata,ajaxCallParams);
					
				}														
				that.callLookupAjax(requestParamsMetadata, that, field);
				}
				}
				else
				{
				readOnly=true;
				this.lookupMetadata.lookupId = this.id;							
				this.lookupMetadata.IS_FILTER_FORM =false;				
				iportal.formview.showLookupWin(this.lookupMetadata);
				}
				
				
			}
		},
		// Add the button to the panel to act as lookup
		this.add({xtype:'button',
					
				listeners : {'focus':function(){
						if(Ext.EventObject.shiftKey){							
							Ext.getCmp(that.id+ 'text').focus();							
						}
					}
				},
				/*ANZ formelement cleanup*/
				icon:'/iportalweb/iportal/images/Lookup.gif',
				width :20,cls:'buttonCls',handler :buttonHandler, 
				scope:this, id : this.id + 'button'
				
		});
		commonbundle = CRB.getFWBundle();
		
//		textQtip = String.format(commonbundle['ERR_MANDATORY'] , bundle[this.fieldLabel]);
		textQtip = String.format(commonbundle['ERR_MANDATORY_LOOKUP'] , bundle[this.fieldLabel]);
	
		// This is a placeholder for showing the validation message if any..This position is relative wrt.
		// the application. For instance currently CS validations are displayed side to the component. So the 
		// placeholder has to come side to this. We have to use this as, here component to be validated is 
		// textfield and message to be come side to the button.
		this.add({xtype:'label',hidden : true,
						html:'<img style="margin-bottom:5px;" src = "/iportalweb/iportal/images/default/form/exclamation.gif" '+
							'ext:qtip="'+textQtip+'"ext:qclass="x-form-invalid-tip "  />',
						id : this.id + 'label'});	
				
		this.autoScroll = false ;	
		
		
	    
	    this.updateLookupMetadataWithFilter = function(field,lookupObj){	    	
	    	
			var transmetadata = {
				reqparamshandler : function(params) {
				//	console.log(params);
					var columnCount=0;					
					for(var i in params){
						if(i.indexOf('_FIELD')>-1){
							columnCount++;
						}
						
					}
					

					
						LOGGER.info("going that.firstLoad : ",this.firstLoad,that.lookupObj,lookupObj.firstLoad);
						
						var count=(parseInt(columnCount)+1);
				
						if(field.getValue().trim()!=""){
							
							params["COLUMN_COUNT"]=count;
							params["FILTER"+(columnCount+1)+"_CONSTRAINT"]="contains";
							params["FILTER"+(columnCount+1)+"_FIELD"]=lookupObj.lookupMetadata.filterColumn;
							params["FILTER"+(columnCount+1)+"_VALUE_TXT"]=field.getValue();
							params["FILTER"+(columnCount+1)+"_TYPE"]=lookupObj.lookupMetadata.filterType;
							params["IS_FILTER_FORM"]="true";
							
							
							
							
						}
						params["LOOKUP_FLAG"]="true";
						
					return params;
				}
			    
			    
			};
			
			
			this.updateMetaData(transmetadata);
		};
		
	    //Common Ajax request handler.
		//This function used to make a ajax call to get the response data
	    this.callLookupAjax=function(ajaxCallParams, lookupObj, field){

	    		
	    		LOGGER.info("ajaxCallParams=",ajaxCallParams);
	    		Ext.Ajax.request({
	    			   url: iportal.jsutil.getController(),
	    		       method:'POST', 
	    		       params :ajaxCallParams,
	    		       success: function(response,opt){
	    		    	   // response data having more than one record then lookup will be shown to the user,
	    		    	   //if it's having only one row that row expected to be fill in lookup text field.
	    								iportal.jsutil.hideLoadingMsgOnBody();
	    								var respObj=Ext.decode(response.responseText);
	    								var count=respObj.response.value.TOTAL_COUNT;	
	    								if (count ==1)
	    								{
	    									var filterColumn=lookupObj.lookupMetadata.filterColumn;									
	    									var filterValue="";									
	    									for(var i=0;i<respObj.response.value.ALL_RECORDS.length;i++)
	    										{
	    										filterValue=respObj.response.value.ALL_RECORDS[i][filterColumn];
	    										}	
	    									
	    									lookupObj.lookupMetadata.rowdbclickhandler.scope = lookupObj.lookupMetadata.scope;	    									
	    									Ext.apply(respObj.response.value.ALL_RECORDS[0],{__LOOKUP_NAME : lookupObj.lookupMetadata.lookupId});
	    									var arr=new Array();
	    									arr.push(filterValue);
	    									arr.push(respObj.response.value.ALL_RECORDS[0]);
	    									arr.push(filterValue);	    									  									
	    									lookupObj.lookupMetadata.rowdbclickhandler.createDelegate(lookupObj.lookupMetadata.scope,arr).call();
	    									lookupObj.setValue(filterValue);
	    								}
	    								else 
	    								{
	    									lookupObj.updateLookupMetadataWithFilter(field,lookupObj);
	    									LOGGER.info("lookupObj.lookupMetadata=",lookupObj.lookupMetadata);
	    									iportal.formview.showLookupWin(lookupObj.lookupMetadata,false,response);
	    								}
	    								
	    								
	    								LOGGER.info("responseObj=",response);
	    														
	    								
	    						
	    						
	    							},
	    			   failure: function (resp,opt){
	    							iportal.jsutil.hideLoadingMsgOnBody();
	    							
	    						}			
	    			});
	    		
	    		
	    		
	    	};
	    	
					
	},
	
	   setDisabled : function(disabled){
		// iportal.formelement.EditableLookUp.superclass.setDisabled.apply(this, arguments);
         Ext.getCmp(this.id + 'text').setDisabled(disabled);
         Ext.getCmp(this.id + 'button').setDisabled(disabled);
         this.disabled=true;
      
       
    },
    enable : function(){
    //	iportal.formelement.EditableLookUp.superclass.enable.apply(this);
           	Ext.getCmp(this.id + 'button').enable();
	        Ext.getCmp(this.id + 'text').enable();
	        this.disabled=false; 
    	      
    },
   
	// getValue function returns the current value in lookup textfield
	getValue : function(){
		return Ext.getCmp(this.id + 'text').getValue() ; 
	},
	

	

	

	focus: function(){
		

		 Ext.getCmp(this.id + 'text').focus() ;
	},





	/** Added by Victor Starts**/
	//updateMetaData function appends the value taken from the previous lookup to the new lookup
	updateMetaData : function(newMetaData){
	
	/* rewiring the new requestHandler method 
	(used for adding filters)to be called with the orignal 
	requesthandler created by the user.*/
	this.lookupMetadata.reqparamshandler=
					this.lookupMetadata.reqparamshandler.
					createSequence(newMetaData.reqparamshandler, this);
		//Ext.apply(this.lookupMetadata,newMetaData);
	
	},
	
	markInvalid : function(m){	
		if(!m){
			var commonbundle = CRB.getFWBundle();
			
//			m = String.format(commonbundle['ERR_MANDATORY'] , this.plainLabel);	
			m = String.format(commonbundle['ERR_MANDATORY_LOOKUP'] , this.plainLabel);
			
		}
		var that = this;
		that.submittable = false;
		if(Ext.getCmp(that.id + 'label')){
			var labelComp = Ext.getCmp(that.id + 'label');	
			labelComp.show();			
			labelComp.el.dom.innerHTML = '<img style="margin-bottom:5px;" src = "/iportalweb/iportal/images/default/form/exclamation.gif" '+
				'ext:qtip="'+m+'"  ext:qclass="x-form-invalid-tip "  />';					
		}
		document.getElementById(that.id + 'text').className = 'x-form-text x-form-field errorBg';			
	},
	clearInvalid : function(){
			var that = this;
			that.submittable = true;
			Ext.getCmp(that.id + 'label').hide();
			document.getElementById(that.id + 'text').className = 'x-form-text x-form-field normalBg';
			var textObj= Ext.getCmp(that.id + 'text');
			if(textObj.disabled===true){
				textObj.getActionEl().addClass(textObj.disabledClass);
			}else{
				textObj.getActionEl().removeClass(textObj.disabledClass);
			}
			
	},
	// sets the value to the underlying textfield of lookup field
	// @param val : value to be set to the textfield
	setValue : function(val){
		if(val !== null){
			Ext.getCmp(this.id + 'text').setValue(val) ;
			Ext.getCmp(this.id).preFilterRequired =1;
		}
	},

	// sets the empty value to the underlying textfield of lookup field 

	 reset : function(){

			Ext.getCmp(this.id + 'text').setValue('') ;

			Ext.getCmp(this.id).preFilterRequired =1;

	},
	
	changeFn : function(){
		this.clearInvalid();
		if(this.changeFunction){
			var validFlag = this.changeFunction(this);
			if(Ext.type(validFlag)=='boolean'){
				this.fireEvent("valid", this);
			}else {
				this.markInvalid(validFlag);
			}
		}
	},
	//It has to be validated formwise. Due to technical problems while doing form.isValid()
	validate : function()
	{	
		return true;
	},
	afterRender:function() {        
		iportal.formelement.EditableLookUp.superclass.afterRender.apply(this, arguments);    
		this.setValue = this.setValue.createSequence(this.changeFn); 
		var that = this;
		this.on('afterblur',function(meta){	
			if(!that.required) {
				if(that.blurFunction) that.blurFunction();
					return true;
			}/*
			
			if(!meta){
				if(that.required && that.getValue().trim() === ''){
					that.markInvalid();				
				}else {
					Ext.getCmp(that.id + 'label').hide();
					document.getElementById(that.id + 'text').className = 'x-form-text x-form-field normalBg';
				}								
			}*/
			if(that.getValue().trim() != ''){				
				if(that.changeFunction){
					var validFlag = that.changeFunction(that);
					if(Ext.type(validFlag)=='boolean'){
						that.fireEvent("valid", that);
					}else {
						that.markInvalid(validFlag);
					}
				}
			}
			if(that.blurFunction)that.blurFunction();
			
		});		
	},
	getPrintData : function(){
		var label = this.plainLabel;
		var fieldValue = this.getValue();
		var printMap = {};
		printMap[label] = fieldValue;
		return printMap;
	}

});

Ext.reg('iportal-editablelookup', iportal.formelement.EditableLookUp);

/**
 * @class iportal.formelement.DisplayField
 * @extends Ext.form.DisplayField
 * Base class to customize a textfield display text in a form layout.
 * @constructor
 * Creates a new DisplayField Field
 * @param {Object} config Configuration options
 *
 */

iportal.formelement.DisplayField = function(config){
    this.name = config.name || config.id;
    iportal.formelement.DisplayField.superclass.constructor.call(this, config);
};

Ext.extend(iportal.formelement.DisplayField, Ext.form.DisplayField,  {
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
	cls : 'x-form-field x-form-displayField',
     // private
	initComponent:function(){
		iportal.formelement.DisplayField.superclass.initComponent.apply(this, arguments);	
		var commonbundle = CRB.getFWBundle();
		var bundle;
		if(Ext.isEmpty(this.bundleKey)){
			var parentPanel = this.findParentByType('iportal-formpanel') || this.findParentByType('iportal-fluidform');
			this.bundleKey = parentPanel.bundleKey;
		}
		try{
			bundle = CRB.getBundle(this.bundleKey);
		}
		catch(e){
		}
		if(!this.fieldLabel)
			this.fieldLabel = "LBL_"+this.id;
			
		
		this.plainLabel = bundle[this.fieldLabel];
			
		if(this.required){
			try{
				this.blankText = String.format(commonbundle['ERR_MANDATORY'] , bundle[this.fieldLabel]);
				this.fieldLabel='<span class = \'mandatory\'"></span>'+ bundle[this.fieldLabel];
			}
			catch(e){
				this.fieldLabel='<span class = \'mandatory\'"></span>' + '?' + this.fieldLabel + '?';
			}
			if(this.lookup){
				this.allowBlank=true;
			} else {
				this.allowBlank=false;				
			}
		}
		else{
			try	{
				this.fieldLabel= '<span class = \'non_mandatory\'"></span>' + bundle[this.fieldLabel];
			}
			catch(e){
				this.fieldLabel= '<span class = \'non_mandatory\'"></span>' + '?' + this.fieldLabel + '?';
			}
		}
		this.labelSeparator = '';
		this.style = 'word-wrap: break-word;overflow-y:hidden;font-weight: normal;',
		//this.boxMaxWidth = this.boxMaxWidth ? this.boxMaxWidth : 170;
		
		this.boxMinWidth = this.boxMinWidth ? this.boxMinWidth : 170;
		this.height = 32;
		this.realValue = this.value;
		this.value = this.formatDisplayValue(this.realValue);
		this.initTip = (this.value != this.realValue);
		if(!this.value){
			this.value = '--';
		}
		this.tooltipText = this.realValue;	
		this.anchor = !this.anchor ? '40%' : this.anchor ;	
		if(parseInt(this.anchor) < 30){
			this.boxMinWidth = 50;
		}	
	},
	isVisible : function(){
		return iportal.formelement.DisplayField.superclass.isVisible.apply(this, arguments);  
	},
	onRender:function() {        
		iportal.formelement.DisplayField.superclass.onRender.apply(this, arguments);        
		var name = this.name || this.el.dom.name;  
		this.hiddenField = this.el.insertSibling({             
			tag:'input',           
			type:'hidden',           
			name:name,          
			value:this.realValue ? this.realValue : ''      
		});
		this.hiddenName = name; 
		// prevent input submission
		this.el.dom.removeAttribute('name');        
	},
	// This method will be called on every events which can alter the display value.
	updateHidden:function() {     
		var formattedVal;    
		this.realValue = this.getValue();
		if(this.realValue == '--'){
			return;
		}
		if(this.realValue == '' || ((String(this.realValue).trim()) == '')){
			Ext.QuickTips.register(this.el);
			this.setValue('--');
		}
		this.tooltipText = this.realValue; 
		this.hiddenField.dom.value = this.realValue; 
		if(this.el){
			formattedVal = this.formatDisplayValue(this.realValue);
			this.el.dom.innerHTML = formattedVal.replace(/\s/g,'&nbsp;');
			if(this.hiddenField.dom.value != this.el.dom.innerHTML){
				this.applyToolTip(this.hiddenField.dom.value);
			}			
		}		
	},
	formatDisplayValue : function(realVal){
		var StringNumber = iportal.util.stringnumber.getInstance();
		var widthDisp = StringNumber.getNeededWidthNoEl(realVal);
		if(widthDisp > ((2*this.boxMinWidth)-20)){
			var dispVal = StringNumber.getStringForWidth(realVal,(2*this.boxMinWidth)-20);
		}else{
			dispVal = realVal;
		}
		return dispVal;
	},
	applyToolTip : function(text){
		var findLabel = function(field) {
              var wrapDiv = null,
              	  label = null;
              //find form-item and label
              wrapDiv = field.getEl().up('div.x-form-item');
              if(wrapDiv) {
                  label = wrapDiv.child('label');        
              }
              if(label) {
                  return label;
              } 
         }
         if(text){
            var label = findLabel(this);
            if(label){                       
                label.addClass(this.tooltipClass || 'x-textfield-tooltip')
                Ext.QuickTips.register({
                    target:  this.el,                   
                    text: text,
                    enabled: true
                });
            }
         }
	},
	afterRender : function(){           
		if(this.initTip){      
       		this.applyToolTip(this.tooltipText);
       	}
        iportal.formelement.DisplayField.superclass.afterRender.call(this);    
        this.initEvents();  
        this.setValue = this.setValue.createSequence(this.updateHidden); 
     },
	getPrintData : function(){
		var label = this.plainLabel;
		var fieldValue = this.getValue();
		var printMap = {};
		printMap[label] = fieldValue;
		return printMap;
	}
});

Ext.reg('iportal-displayfield', iportal.formelement.DisplayField);


/*!
 * @constructor
 * Create a new LookupField.
 * @param {Object} config Configuration options (valid {@Ext.form.TextField} config options will also be applied
 * to the base TextField)
 * @xtype trigger
 */
iportal.formelement.LookupField = Ext.extend(iportal.formelement.TextField,  {
	
	// This configuration should be removed from iportal.formelement.TextField once 
	// application completely migrated to this component
	//lookup : true,
	
    /**
     * @cfg {String} triggerClass
     * An additional CSS class used to style the trigger button.  The trigger will always get the
     * class <tt>'x-form-trigger'</tt> by default and <tt>triggerClass</tt> will be <b>appended</b> if specified.
     */
    /**
     * @cfg {Mixed} triggerConfig
     * <p>A {@link Ext.DomHelper DomHelper} config object specifying the structure of the
     * trigger element for this Field. (Optional).</p>
     * <p>Specify this when you need a customized element to act as the trigger button for a TriggerField.</p>
     * <p>Note that when using this option, it is the developer's responsibility to ensure correct sizing, positioning
     * and appearance of the trigger.  Defaults to:</p>
     * <pre><code>{tag: "img", src: Ext.BLANK_IMAGE_URL, cls: "x-form-trigger " + this.triggerClass}</code></pre>
     */
    /**
     * @cfg {String/Object} autoCreate <p>A {@link Ext.DomHelper DomHelper} element spec, or true for a default
     * element spec. Used to create the {@link Ext.Component#getEl Element} which will encapsulate this Component.
     * See <tt>{@link Ext.Component#autoEl autoEl}</tt> for details.  Defaults to:</p>
     * <pre><code>{tag: "input", type: "text", size: "16", autocomplete: "off"}</code></pre>
     */
    defaultAutoCreate : {tag: "input", type: "text", size: "16", autocomplete: "off"},
    /**
     * @cfg {Boolean} hideTrigger <tt>true</tt> to hide the trigger element and display only the base
     * text field (defaults to <tt>false</tt>)
     */
    hideTrigger:false,
    /**
     * @cfg {Boolean} editable <tt>false</tt> to prevent the user from typing text directly into the field,
     * the field will only respond to a click on the trigger to set the value. (defaults to <tt>true</tt>).
     */
    editable: true,
    /**
     * @cfg {Boolean} readOnly <tt>true</tt> to prevent the user from changing the field, and
     * hides the trigger.  Superceeds the editable and hideTrigger options if the value is true.
     * (defaults to <tt>false</tt>)
     */
    readOnly: false,
    /**
     * @cfg {String} wrapFocusClass The class added to the to the wrap of the trigger element. Defaults to
     * <tt>x-trigger-wrap-focus</tt>.
     */
    wrapFocusClass: 'x-trigger-wrap-focus',
    
    /**
     * @cfg {String/Object} required ,to specify whether this field is mandatory (defaults to false)
     * The lookup window will be opened iff. handler for lookup returns true. So by default give an
     * empty fn which returns true.
     */
    handler : function(){return true},

	/**
     * @cfg {String/Object} buttonTextKey ,text over button (defaults to LOOKUP)
     */
    buttonTextKey : 'LBL_LOOKUP',
    
    submittable : true,

	/**
	 * @cfg object required, Meta data object required to render account lookup,
	 * This object can create create with following attributes 
	 * productCode - required, to specify PRODUCT CODE and will be passed to server while retrieving data
	 * subProductCode - required, to specify SUB-PRODUCT CODE and will be passed to server while retrieving data
	 * functionCode - required,  to specify FUNCTION CODE and will be passed to server while retrieving data
	 * cm - required, Should be an object of Ext.grid.ColumnModel, will be used to render lookup grid columns
	 * recordType - required , Used to read records returning from server 
	 * 				Either an Array of field definition objects as passed to Ext.data.Record.create, 
	 * 				or a Record constructor created using Ext.data.Record.create.
	 * rowdbclickhandler - required, Javascript function which would gets executes when a row is double clicked in the grid
	 * extraParams - Optional, If required to pass any params as part of request
	 */
    lookupMetadata:{},
 	/**
 	 * possiable values are 0 and 1
 	 * 0 indicates apply pre-filter
 	 * 1 indicates no pre-filter required.
 	 * @type Number
 	 */
    preFilterRequired :1,
    /**
     * @hide
     * @method autoSize
     */
    autoSize: Ext.emptyFn,
    // private
    monitorTab : true,
    // private
    deferHeight : true,
    // private
    mimicing : false,

    actionMode: 'wrap',

    removeMode: 'container',

    defaultTriggerWidth: 17,
	initComponent:function(){
    	//this.addEvents('valid','afterblur');
		iportal.formelement.LookupField.superclass.initComponent.apply(this, arguments);	
	},
    // private
    onResize : function(w, h){
        iportal.formelement.LookupField.superclass.onResize.call(this, w, h);
        var tw = this.getTriggerWidth();
        if(Ext.isNumber(w)){
            this.el.setWidth(w - tw);
        }
        this.wrap.setWidth(this.el.getWidth() + tw);
    },

    getTriggerWidth: function(){
        var tw = this.trigger.getWidth();
        if(!this.hideTrigger && tw === 0){
            tw = this.defaultTriggerWidth;
        }
        return tw;
    },

    // private
    alignErrorIcon : function(){
        if(this.wrap){
            this.errorIcon.alignTo(this.wrap, 'tl-tr', [2, 0]);
        }
    },

    // private
    onRender : function(ct, position){
        this.doc = Ext.isIE ? Ext.getBody() : Ext.getDoc();
        var tableId = this.id;
        var bundle = CRB.getBundle(this.bundleKey);
        var buttonText = bundle[this.buttonTextKey];
        iportal.formelement.LookupField.superclass.onRender.call(this, ct, position);
		var lookupButtonCfg = {
			"id": tableId+'RATE_button',
			"tag": 'table',
			"class" : "x-btn x-btn-noicon",
			"style":"float:left;",
			"cellSpacing" : 0,
			"children": [{
				"tag": 'tbody', 
				"class" : 'x-btn-small x-btn-icon-small-left',
				"children": [{
							"tag": 'tr', 
							"children":[
									{"tag": 'td',"class":'x-btn-tc'}
								]	
							},{
							"tag": 'tr', 
							"children":[
									{"tag": 'td',"class":'x-btn-ml','html':'&nbsp;'},
									{
										"tag": 'td',
										"class":'x-btn-mc',
										"children" :[{
											"tag" : "em",
											"class":"",
											"unselectable":"on",
											"children" : [
											{"tag" : "button","class":"x-btn-text",'html':buttonText}
											]
											
										}
										]
									},
									{"tag": 'td',"class":'x-btn-mr','html':'&nbsp;'}
								]	
							},{
							"tag": 'tr', 
							"children":[
									{"tag": 'td',"class":'x-btn-bl','children':[{"tag":'I','html':'&nbsp;'}]},
									{"tag": 'td',"class":'x-btn-bc'},
									{"tag": 'td',"class":'x-btn-br','children':[{"tag":'I','html':'&nbsp;'}]}
								]
							}]		
				}]
		};
		var divCfg = {
			"tag" : "div",
			"style":"float:left;",
			"children" : [lookupButtonCfg]
		}
        this.wrap = this.el.wrap({cls: 'x-form-field-wrap x-form-field-trigger-wrap'});
        this.el.dom.className = 'x-form-textField-lookup';
        this.trigger = this.wrap.createChild(this.triggerConfig || lookupButtonCfg);
        this.initTrigger();
        if(!this.width){
            this.wrap.setWidth(this.el.getWidth()+this.trigger.getWidth());
        }
        this.resizeEl = this.positionEl = this.wrap;
        this.updateEditState();
    },

    updateEditState: function(){
        if(this.rendered){
            if (this.readOnly) {
                this.el.dom.readOnly = true;
                this.el.addClass('x-trigger-noedit');
                this.mun(this.el, 'click', this.onTriggerClick, this);
                this.trigger.setDisplayed(false);
            } else {
                if (!this.editable) {
                    this.el.dom.readOnly = true;
                    this.el.addClass('x-trigger-noedit');
                    this.mon(this.el, 'click', this.onTriggerClick, this);
                } else {
                    this.el.dom.readOnly = false;
                    this.el.removeClass('x-trigger-noedit');
                    this.mun(this.el, 'click', this.onTriggerClick, this);
                }
                this.trigger.setDisplayed(!this.hideTrigger);
            }
            this.onResize(this.width || this.wrap.getWidth());
        }
    },

    setHideTrigger: function(hideTrigger){
        if(hideTrigger != this.hideTrigger){
            this.hideTrigger = hideTrigger;
            this.updateEditState();
        }
    },

    /**
     * @param {Boolean} value True to allow the user to directly edit the field text
     * Allow or prevent the user from directly editing the field text.  If false is passed,
     * the user will only be able to modify the field using the trigger.  Will also add
     * a click event to the text field which will call the trigger. This method
     * is the runtime equivalent of setting the 'editable' config option at config time.
     */
    setEditable: function(editable){
        if(editable != this.editable){
            this.editable = editable;
            this.updateEditState();
        }
    },

    /**
     * @param {Boolean} value True to prevent the user changing the field and explicitly
     * hide the trigger.
     * Setting this to true will superceed settings editable and hideTrigger.
     * Setting this to false will defer back to editable and hideTrigger. This method
     * is the runtime equivalent of setting the 'readOnly' config option at config time.
     */
    setReadOnly: function(readOnly){
        if(readOnly != this.readOnly){
            this.readOnly = readOnly;
            this.updateEditState();
        }
    },

    afterRender : function(){
        iportal.formelement.LookupField.superclass.afterRender.call(this);
        
        
    },

    // private
    initTrigger : function(){
        this.mon(this.trigger, 'click', this.onTriggerClick, this, {preventDefault:true});
        this.trigger.addClassOnOver('x-form-trigger-over');
        this.trigger.addClassOnClick('x-form-trigger-click');
    },

    // private
    onDestroy : function(){
        Ext.destroy(this.trigger, this.wrap);
        if (this.mimicing){
            this.doc.un('mousedown', this.mimicBlur, this);
        }
        delete this.doc;
        iportal.formelement.LookupField.superclass.onDestroy.call(this);
    },

    // private
    onFocus : function(){
        iportal.formelement.LookupField.superclass.onFocus.call(this);
        if(!this.mimicing){
            this.wrap.addClass(this.wrapFocusClass);
            this.mimicing = true;
            this.doc.on('mousedown', this.mimicBlur, this, {delay: 10});
            if(this.monitorTab){
                this.on('specialkey', this.checkTab, this);
            }
        }
    },

    // private
    checkTab : function(me, e){
        if(e.getKey() == e.TAB){
            this.triggerBlur();
        }
    },

    // private
    onBlur : function(){/*Commented For further upgrade autoCompletion for Widgetization of Lookup 
    	if(!this.editable || this.disabled) 
    		return; 
    	var that = this;
    	if(this.getValue().trim() != ''){
			that.lookupMetadata.resourceBundleKey = that.bundleKey;
			that.lookupMetadata.acclookupId = that.id;	
			var panel = iportal.formview.showAccLookupWin(that.lookupMetadata,true);
			panel.items.each(function(item,index,length){
				if(item.getXType() == 'accountlookupgrid'){
					item.doAutoCompletionTask(that,field,that.lookupMetadata);									
				}
			});
		}else{								
			if(that.lookupMetadata.clearHandler){
				that.lookupMetadata.clearHandler.createDelegate(that.lookupMetadata.scope,[that.id]).call();
			}
			that.fireEvent('afterblur');
		}*/
    },

    // private
    mimicBlur : function(e){
        if(!this.isDestroyed && !this.wrap.contains(e.target) && this.validateBlur(e)){
            this.triggerBlur();
        }
    },

    // private
    triggerBlur : function(){
        this.mimicing = false;
        this.doc.un('mousedown', this.mimicBlur, this);
        if(this.monitorTab && this.el){
            this.un('specialkey', this.checkTab, this);
        }
        iportal.formelement.LookupField.superclass.onBlur.call(this);
        if(this.wrap){
            this.wrap.removeClass(this.wrapFocusClass);
        }
    },

    beforeBlur : Ext.emptyFn,

    // private
    // This should be overriden by any subclass that needs to check whether or not the field can be blurred.
    validateBlur : function(e){
        return true;
    },

    /**
     * The function that should handle the trigger's click event.  This method does nothing by default
     * until overridden by an implementing function.  See Ext.form.ComboBox and Ext.form.DateField for
     * sample implementations.
     * @method
     * @param {EventObject} e
     */
    onTriggerClick : function(){
    	var tgt = Ext.EventObject.getTarget();
    	if(String(tgt.outerHTML).toUpperCase().indexOf('BUTTON') === -1){
    		return;
    	}
    	if(this.buttonTextKey !== 'LBL_LOOKUP'){
			this.handler();
			return;
		}			
		if(this.handler()){// Widgetization of Lookup 
				this.lookupMetadata.lookupId = this.id;
				iportal.formview.showLookupWin(this.lookupMetadata);
		}			
    },
	getPrintData : function(){
		var label = this.plainLabel;
		var fieldValue = this.getValue();
		var printMap = {};
		printMap[label] = fieldValue;
		return printMap;
	}
});


Ext.reg('iportal-lookupfield', iportal.formelement.LookupField);


iportal.formelement.SpinnerField = function(config){
    this.name = config.name || config.id;
    iportal.formelement.SpinnerField.superclass.constructor.call(this, config);
};


Ext.extend(iportal.formelement.SpinnerField, Ext.ux.form.SpinnerField, {
	 /**
     * @cfg {String/Object} required ,to specify whether this field is mandatory (defaults to false)
     */
    
    required : false,
    
	conditional : false,
	/**
     * @cfg {Object} bundleKey ,key used by resource to lookup bundle(defaults to '')
     */
	bundleKey : '',
	
	/**
     * @cfg {Object} lookup ,used when textfield is part of a lookup button
     */
	lookup : false,
	
	vtype :'invalidChars',
	
	allowDecimals: 'false',
     incrementValue: 1,
	accelerate: 'true',
	labelSeparator:'',
	conditional:'true',
	/**
     * @cfg {String/Object} validationType ,to specify what modes of validation this field should
	 * support &#46;(defaults to none)
	 * Standard modes available are
	 * 1 alphaNumeric - field allows only alphanumeric characters
	 * 2 none - no validation
     */
    validationType : 'numeric',
    
    /**
     * @cfg {Object} allowSpaces ,used when spaces are allowed inside the textfield
     * defaults to false
     */
   // allowSpaces : false,
    plainLabel : '',
	//cls : 'x-form-textField',
     // private
	initComponent:function(){
		iportal.formelement.SpinnerField.superclass.initComponent.apply(this, arguments);	
		var commonbundle = CRB.getFWBundle();
		var bundle;
		if(Ext.isEmpty(this.bundleKey)){
			var parent = this.findParentByType('iportal-formpanel') || this.findParentByType('iportal-fluidform') ;
			this.bundleKey = parent.bundleKey;
		}
		try{
			bundle = CRB.getBundle(this.bundleKey);
		}
		catch(e){
		}
		if(!this.fieldLabel)
			this.fieldLabel = "LBL_"+this.id;
		
		if(this.maxLength < Number.MAX_VALUE){
			this.maxLengthText = String.format(commonbundle['ERR_MAXLENGTH_EXCEED'],bundle[this.fieldLabel],this.maxLength);
		}
		this.plainLabel = bundle[this.fieldLabel];
		
		if(this.required){
		
		
			try{
				this.blankText = String.format(commonbundle['ERR_MANDATORY'] , bundle[this.fieldLabel]);
				/*ANZ formelement cleanup */
				if(bundle[this.fieldLabel]==undefined)
				{
				
					this.fieldLabel='?'+this.fieldLabel+'?'+'<span class = \'mandatory\'">*</span>';
					
				}
				else if(bundle[this.fieldLabel] == ''){
				this.fieldLabel=bundle[this.fieldLabel]
				}
				else
				{
					
					this.fieldLabel=bundle[this.fieldLabel]+'<span class = \'mandatory\'">*</span>';
				}
				
			}
			catch(e){
				this.fieldLabel='?'+this.fieldLabel+'?'+'<span class = \'mandatory\'">*</span>' ;
			}
			
			if(this.lookup){
				this.allowBlank=true;
			} else {
				this.allowBlank=false;				
			}
		}
		else if(this.conditional){
			try{
				this.blankText = String.format(commonbundle['ERR_MANDATORY'] , bundle[this.fieldLabel]);
				if(bundle[this.fieldLabel]==undefined)
				{
					this.fieldLabel='?'+this.fieldLabel+'?'+'<span class = \'mandatory_fx\'">**</span>';
					
				}
				else
				{
					this.fieldLabel=bundle[this.fieldLabel]+'<span class = \'mandatory_fx\'">**</span>';
				}
				
			}
			catch(e){
				this.fieldLabel='?'+this.fieldLabel+'?'+'<span class = \'mandatory_fx\'">**</span>' ;
			}
		}
		else{
			try	{
				
				this.fieldLabel= '<span class = \'non_mandatory\'"></span>' + this.fieldLabel;
			}
			catch(e){
				this.fieldLabel= '<span class = \'non_mandatory\'"></span>' + '?' + this.fieldLabel + '?';
			}
		}
		this.labelSeparator = '';
		
		
		
		this.on('blur',function(obj){
			
			
			this.spinnerMandatoryValidator(obj.value);
			
			/*if(this.validator && (typeof obj.validator()) == 'string'){	
				alert("inside string");
				this.markInvalid(obj.validator());
				return false;				
			}else{
				alert("clearing invalid!!!");
				this.clearInvalid();
				return true;
			}*/
		});
this.on('spin',function(obj){
			
			this.focus();// To Select the Field While the spin is clicked.
			this.spinnerMandatoryValidator(obj.value);
			
			/*if(this.validator && (typeof obj.validator()) == 'string'){	
				alert("inside string");
				this.markInvalid(obj.validator());
				return false;				
			}else{
				alert("clearing invalid!!!");
				this.clearInvalid();
				return true;
			}*/
		});
		switch(this.validationType)	{
			// validation type currently supported is alphaNumeric and numeric alone, which restricts the keystrokes
			// to be only alphabets and numerals.Numeric vType is an alternate for numberfield
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
	isVisible : function(){
		return iportal.formelement.SpinnerField.superclass.isVisible.apply(this, arguments);  
	},
	getPrintData : function(){
		var label = this.plainLabel;
		var fieldValue = this.getValue();
		var printMap = {};
		printMap[label] = fieldValue;
		return printMap;
	},spinnerMandatoryValidator : function(v){
		//  bundle to be changed. This should be common bundle
		combundle = CRB.getFWBundle();
		
		if(combundle !== null){
			
		//	if((v == ' ' && this.required) ||(v == ' ' && this.conditional)){
			if((v == '') && (this.required || this.conditional)){
				
				this.markInvalid(this.blankText);
				
			}else{
				
				this.clearInvalid();
			}
		}
		else {
			
			//if(v == ' ' && this.required){
			if((v == '') && (this.required || this.conditional)){
				this.markInvalid('? ERR_MANDATORY ?');
			}
		}
	}
});

Ext.reg('iportal-spinnerfield', iportal.formelement.SpinnerField);


//  Ext.form.NumberField is extended here with our regular CBX FW component features
iportal.formelement.NumberField = Ext.extend(Ext.form.NumberField,  {
	 /**
    * @cfg {String/Object} required ,to specify whether this field is mandatory (defaults to false)
    */
   required : false,
   
	conditional : false,
	/**
    * @cfg {Object} bundleKey ,key used by resource to lookup bundle(defaults to '')
    */
	bundleKey : '',
	
	/**
    * @cfg {Object} lookup ,used when textfield is part of a lookup button
    */
	lookup : false,
	
	vtype :'invalidChars',
		
   
   /**
    * @cfg {Object} allowSpaces ,used when spaces are allowed inside the textfield
    * defaults to false
    */
   allowSpaces : false,
   plainLabel : '',
	cls : 'x-form-textField',
    // private
	initComponent:function(){
		iportal.formelement.NumberField.superclass.initComponent.apply(this, arguments);	
		var commonbundle = CRB.getFWBundle();
		var bundle;
		if(Ext.isEmpty(this.bundleKey)){
			var parent = this.findParentByType('iportal-formpanel') || this.findParentByType('iportal-fluidform') ;
			this.bundleKey = parent.bundleKey;
		}
		try{
			bundle = CRB.getBundle(this.bundleKey);
		}
		catch(e){
		}
		if(!this.fieldLabel)
			this.fieldLabel = "LBL_"+this.id;
			
		if(this.maxLength < Number.MAX_VALUE){
			this.maxLengthText = String.format(commonbundle['ERR_MAXLENGTH_EXCEED'],bundle[this.fieldLabel],this.maxLength);
		}
		this.plainLabel = bundle[this.fieldLabel];
			
		if(this.required){
			try{
				
				this.blankText = String.format(commonbundle['ERR_MANDATORY_TEXTFIELD'] , bundle[this.fieldLabel]); 
				
				if(bundle[this.fieldLabel]==undefined)
				{
					this.fieldLabel='?'+this.fieldLabel+'?'+'<span class = \'mandatory\'">*</span>';
					
				}
				else if(bundle[this.fieldLabel] == ''){
					this.fieldLabel='';
				}
				else
				{
					this.fieldLabel=bundle[this.fieldLabel]+'<span class = \'mandatory\'">*</span>';
				}
				
			}
			catch(e){
				this.fieldLabel='?'+this.fieldLabel+'?'+'<span class = \'mandatory\'">*</span>' ;
			}
			
			if(this.lookup){
				this.allowBlank=true;
			} else {
				this.allowBlank=false;				
			}
		}
		else if(this.conditional){
			try{
				this.blankText = String.format(commonbundle['ERR_MANDATORY_TEXTFIELD'] , bundle[this.fieldLabel]);
				if(bundle[this.fieldLabel]==undefined)
				{
					this.fieldLabel='?'+this.fieldLabel+'?'+'<span class = \'mandatory_fx\'">**</span>';
					
				}
				else
				{
					this.fieldLabel=bundle[this.fieldLabel]+'<span class = \'mandatory_fx\'">**</span>';
				}
				
			}
			catch(e){
				this.fieldLabel='?'+this.fieldLabel+'?'+'<span class = \'mandatory_fx\'">**</span>' ;
			}
		}
		else{
			try	{
				this.fieldLabel= '<span class = \'non_mandatory\'"></span>' + bundle[this.fieldLabel]; 
			}
			catch(e){
				this.fieldLabel= '<span class = \'non_mandatory\'"></span>' + '?' + bundle[this.fieldLabel] + '?'; 
			}
		}
		this.labelSeparator = '';
		
		this.anchor = (this.anchor == undefined) ? '' : this.anchor ;
		
	},
	isVisible : function(){
		return iportal.formelement.NumberField.superclass.isVisible.apply(this, arguments);  
	},
	getPrintData : function(){
		var label = this.plainLabel;
		var fieldValue = this.getValue();
		var printMap = {};
		printMap[label] = fieldValue;
		return printMap;
	}
});

Ext.reg('iportal-numberfield', iportal.formelement.NumberField);


Ext.ns('iportal.formview');
iportal.formview.FloatClear = Ext.extend(Ext.Component, {
	cls: 'x-clear'
});
Ext.reg('float-clear', iportal.formview.FloatClear);

iportal.formview.FloatingFormLayout = Ext.extend(Ext.layout.FormLayout, {
	getLabelStyle: function(s, field) {
		var labelStyle = this.labelStyle;
		if (this.labelAlign !== 'top') {
			if (field.labelWidth) {
				labelStyle = 'width:' + field.labelWidth + 'px;';
			}
		}
		var ls = '', items = [labelStyle, s];
		for (var i = 0, len = items.length; i < len; ++i) {
			if (items[i]) {
				ls += items[i];
				if (ls.substr(-1, 1) != ';') {
					ls += ';';
				}
			}
		}
		return ls;
	},

	getElementStyle: function(field) {
		if (this.labelAlign === 'top' || !field.labelWidth) {
			return this.elementStyle;
		} else {
			var pad = Ext.isNumber(this.labelPad) ? this.labelPad : 5;
			return 'padding-left:' + (field.labelWidth + pad) + 'px; margin-bottom : 40px';
		}
	},

	getTemplateArgs: function(field) {
		var noLabelSep = !field.fieldLabel || field.hideLabel;
		field.labelStyle = 'padding-left:30px'
		return {
			id: field.id,
			label: field.fieldLabel,				
			itemCls: (field.itemCls || this.container.itemCls || '') + (field.hideLabel ? ' x-hide-label' : ''),
			clearCls: field.clearCls || 'x-form-clear-left',
			labelStyle: this.getLabelStyle(field.labelStyle, field),
			elementStyle: this.getElementStyle(field) || '',
			labelSeparator: noLabelSep ? '' : (Ext.isDefined(field.labelSeparator) ? field.labelSeparator : this.labelSeparator)
		};
	}
});
Ext.Container.LAYOUTS['iportal-formlayout'] = iportal.formview.FloatingFormLayout;

iportal.formview.FluidFormPanel = Ext.extend(Ext.form.FormPanel, {
	cls: 'floating-form',
	layout: 'iportal-formlayout',
	border: false,
	labelSeparator : '',
	lookupComponent: function(comp) {
		/*
		* comp.msgTarget = 'side';
		* comp.width = comp.width ? comp.width : 175;
		* comp.allowBlank = false;
		*/
		if (Ext.isString(comp)) {
			switch (comp) {
				case "|":
					comp = new iportal.formview.FloatClear();
					break;
				case "-":
					comp = new Ext.form.TextField({
						labelStyle : 'width:120;',hidden : true,
						labelSeparator : '', width : 175,
						disabled : true, hideMode : 'visibility'
					});
					break;
			}
		}
		return iportal.formview.FluidFormPanel.superclass.lookupComponent.call(this, comp);
	}
});
Ext.reg('iportal-fluidform', iportal.formview.FluidFormPanel);