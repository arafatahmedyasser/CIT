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
 * DEPLOY_MODULE_ID:  <Check with your lead for correct value>
 */
cbx.ns('canvas.form');
/**
 * <PRE>
 * This class will be used to register vtypes in formframework. The developer is
 * expected to attach the custom vtypes by calling the setVtype method and
 * attach the configured vtype in DB. If any parameter is missing as per the
 * configurtion,the vtype will not be registered and a javascript exception will
 * be thrown. Example Usage:
 *  		var value= /[A-Za-z0-9]/;//The value that the field should match * 
 * 			var mask = /[A-Za-z1-9\- ]/;//The value that the developer willbe allowed to enter
 * 		 	var text="Invalid characters entered";//Error message tobe shown
 * 			var name='specialChar'; // name to be configured in DB
 * 			canvas.form.vTypeRegistry.setVtype(name,value,mask,text);//Registering the vtypes
 * 
 * Usually the text will be used if we call the validate function for the particular field.The
 * validate function will work if we copy and paste data to a field.
 * 
 * 
 * </PRE>
 */

canvas.form.vTypeRegistry = function (){

	/**
	 * (Object/Array) The map to keep track of the registered vtypes.
	 */
	var vTypeRegistry={};
	return {
		
		/**
		 * <PRE>
		 * Method(Private):The method that will be used for setting the vtype
		 * 
		 * @param: 
		 * name:The name of the vtype. 
		 * value:The value of the field that needs to be matched(Must be a regular expression) 
		 * mask:The values that the developer will be allowed to enter or not to be allowed to enter(Must be a regular expression) 
		 * text:The error message that needs to be show if the field is not valid as per the vtype
		 * 
		 * Approach:
		 * Step1:
		 * 		a.Check the registry.
		 * 		b.If there is no previous vtype registered then 
		 *			VALIDATE:if validateConfiguration(name, value, mask,text) return true then
		 *				 		 	1.add the vtype to register.
         *					 		2.Register the vtype as a part of Ext.form.vTypes
		 *				
		 *		             else
		 *			   				 return
		 *		c.If there is already some vtypes registered,then
		 *				1.Check the registry if the currennt vtypes already exists or not
		 *					If it is registered then
		 *						 send an information "Already registered"
		 *             		else
		 *             			GOTO step  VALIDATE		
		 * 		 
		 * 
		 *</PRE>
		 */
		setVtype : function (name, value, mask, text, globalRe)
		{
				if (!cbx.isEmpty(vTypeRegistry[name]))
				{
					try
					{
						if (this.validateConfiguration(name, value, mask, text, globalRe) == true)
						{
							this.addToRegistry(name, mask, text, globalRe);
							return;
						}

					} catch (err)
					{
						LOGGER.error('Exception' + err + 'occured at the time of setting the vtype for:', name);
						return;
					}

				} else
				{
					LOGGER.info("The vtype " + name + "is already registered.Please change the name of the vtype");
				}

		},
		/**
		 * <PRE>
		 * @Method(Private):The follwoing method will be used to validate the vtype configuration
		 * </PRE>
		 */
		validateConfiguration:function(name, value, mask,text,globalRe){
			if(cbx.isEmpty(value)){
				LOGGER.error("There is a configuration issue in the value of the vtype you configured");
				return false;
			}else if(cbx.isEmpty(name)){
				LOGGER.error("There is a configuration issue in the name of the vtype you configured");
				return false;
			}else if(cbx.isEmpty(mask)){
					LOGGER.error("There is a configuration issue in the mask of the vtype you configured");
					return false;
			}
			else if(cbx.isEmpty(text)){
				LOGGER.error("There is no error message configured for the vtype");
				return false;
			}else{
				return true;
			}		
			
		},
		
	
		/**
		 * @Method(Private):Used to set the vtype in registry.Expected to be
		 *                       called by setVtype method
		 */
		addToRegistry:function(name,mask,text,globalRe){
			vTypeRegistry[name] = {
				'name' : name,
				'mask' : mask,
				'text' :text,
				"globalRe":globalRe
			};
		},
		/**
		 * @Method:The method will be used by cbx-formfields(E.g:cbx-textfield
		 *             and cbx-textarea) to retrieve all the vtypes
		 */
		getVtypes:function(){
			return vTypeRegistry;
		},
		
		/**
		 * @Method:The method will be used by cbx-formfields(E.g:cbx-textfield
		 *             and cbx-textarea) to retrieve the particular vtype
		 */
		getVtype:function(vTypeName){
			return vTypeRegistry[vTypeName];
		}
	};
}();


CFVR = canvas.form.vTypeRegistry;


// Name -- Mask --- Text -- globalRe

CFVR.addToRegistry('EMAIL',
					/[a-zA-Z0-9._@-]/,
					CRB.getFWBundleValue('ERR_INVALID_EMAIL'),
					/^[a-zA-Z0-9]{1}[a-zA-Z0-9._]*@[a-zA-Z0-9]{1}[a-zA-Z0-9.]*\.[a-zA-Z]{2,4}$/);


CFVR.addToRegistry('AMOUNT',
			/[0-9.-]/,
			CRB.getFWBundleValue('ERR_INVALID_AMOUNT'),
			/^-?\d{1,}(\.\d{1,})?$/);

CFVR.addToRegistry('DECIMAL',
			/[0-9.]/,
			CRB.getFWBundleValue('ERR_INVALID_DECIMAL_NUMBER'),
			/^\d+(\.\d{1,})?$/);
CFVR.addToRegistry('NUMBER',
			/[0-9]/,
			CRB.getFWBundleValue('ERR_INVALID_NUMBER'),
			/^[0-9]+$/);


CFVR.addToRegistry('ALPHANUMERIC',
			/[A-Za-z0-9]/,
			CRB.getFWBundleValue('ERR_INVALID_FIELD'),
			/^[A-Za-z0-9]*$/);

CFVR.addToRegistry('DATE',
			/[0-9/]/,
			CRB.getFWBundleValue('ERR_INVALID_DATE'),
			/^\d{2}\/\d{2}\/\d{4}$/);


CFVR.addToRegistry('ALPHANUMERICSPL',
			/[A-Za-z0-9,-./_]/,
			CRB.getFWBundleValue('ERR_INVALID_FIELD'),
			/^[A-Za-z0-9,-./_]*$/);


CFVR.addToRegistry('PORTALSUPPORTED',
			/[^<>;{}()!=&\'\"]/,
			CRB.getFWBundleValue('ERR_INVALID_FIELD'),
			/^[^<>;{}()!=&\'\"]*$/);










