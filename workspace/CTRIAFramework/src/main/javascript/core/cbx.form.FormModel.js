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
 *  @file This file contains the javascript code for the form manager.
 *  
 */
/**
 * @desc The name space cbx.form are useful for organizing the code.<br>
 * It provides 2 main benefits.<br>
 * The first is that we can use them to prevent polluting the global namespace with objects,which is generally
 * considered to be undesireable. cbx, for example has just a single global object (the cbx object). It's good practice
 * to put any classes inside a namespace, a commonone is the name of your company or the name of your application.The
 * other advantage is that assists in keeping our code organized, we can group together similar or co-dependent classes
 * in the same namespace, which helps to specify your intent to other developers.
 * 
 * @namespace "cbx.form"
 */

cbx.ns('cbx.form');


cbx.form.FormModel = Class(cbx.Observable, {
	/**
	 * 
	 * @class "cbx.form.formModel"
	 * @extends "cbx.Observable"
	 * @description Instance of this class will be attached to the form manager. The user will only have access to this object for updating
	 * the values of the form. At any point of the the UI should always be in sync with the model object. For this, the
	 * model will raise and receive events from / form manager. This class will also provide helper methods for the app
	 * developer to get and set model data.This class will be intialized from the formmanager.The developers are expected to use the required methods of 
	 * this class using the formmanager object
	 * 
	 */
	constructor : function (config)
	{
		/**
		 * @member {Object} md 
		 * @memberof "cbx.form.FormModel"
		 * @description The JSON object to hold the form model data
		 * @access private
		 * 
		 * */
		this.md = config.preData || {};
		/**
		 * @member {Boolean} dataChanged 
		 * @memberof "cbx.form.FormModel"
		 * @description To say whether the model data got changed or not after the md gets initialized.
		 * @access private
		 * */
		this.dataChanged = false;
		/**
		 * @member {Object} initModel
		 * @memberof "cbx.form.FormModel" 
		 * @description An empty object which will be used to serialize the model state
		 * @access private
		 * */
		this.initModel = {};
		
		
		/**
		 * Adding the events
		 * */
		this.addEvents({
			"cbxchange" : true,
			"cbxappchange" : true,
			"cbxmodeldatachange" : true
		});
		
		if (config.listeners)
		{
			for (k in config.listeners)
			{
				if (config.listeners[k] != null && cbx.core.isFunction(config.listeners[k]))
				{
					this.registerListener(k, config.listeners[k], config.scope);
				}
			}
		}
	},
	/**
     * The method is used to say whether the data changed or not.
     * @memberof "cbx.form.formModel"
     * @param {Boolean} flag Flag to say whether the model data is changed or not.
     * @access private
     */
	setDataChanged : function (flag)
	{
		this.dataChanged = flag;
	},
	/**
	 * @Method getValue
	 * @memberof "cbx.form.formModel"
     * @description The method is used to get the value for a particular item id of a form
     * @param {String} fieldName The itemId for which model data needs to be retreived
     * @access public
     * @returns {String/Object} The data that the field holds.
     * @example
<pre>fm.model.getValue('FLD1');</pre>
     */
	getValue : function (fieldName)
	{
		return this.md[fieldName];
	},
	/**
	 * @Method setValue
	 * @memberof "cbx.form.formModel"
     * @description The method is used to set the value for any id.The id may be present in the form or any other value if the user wants to sent to the server as hidden value.
     * This method cannot be used for the multiform.For multiform data should be set individually to all the items at every index.
     * This method will fire cbxappchange method
     * @access public
     * @param {String} fieldName The itemId for which model data needs to be retreived
     * @param {String/Object} value The value needs to be set
     * @param {Boolean} ignoreChanges To say whether setDatachanged method to be called or not.If the value is true,then the setData changed method will not be called.
     * @param {String/Integer} index The index of the multiform at which the field is present if at all the field is a part of multiform
	 * @param {String} parent  The multiform id  
     * @access public
     * @example
<pre>
1.fm.model.setValue('FLD1','Intellect Design Arena');
2.fm.model.setValue('FLD1','Intellect Design Arena',undefined,2,'DEMO_MULTIFORM');
</pre>
     */
	setValue : function (fieldName, value, ignoreChanges, index, formId)
	{
		ignoreChanges = ignoreChanges || false;
		if (!cbx.isEmpty(index) && !cbx.isEmpty(formId))
		{
			if (this.md[formId][fieldName] == undefined)
			{
				this.md[formId][fieldName] = [];
			}
			this.md[formId][fieldName][index] = value;
		} else
		{
			this.md[fieldName] = value;
		}
		if (!ignoreChanges)
		{
			this.setDataChanged(true);
		}
		this.raiseEvent('cbxappchange', "cbxappchange", fieldName, value, index, formId);
	},
	/**@Method updateValue
	 * @memberof "cbx.form.formModel"
	 * @description The method is used to set the value for any id.This method will fire the cbxchange method and it will be used internally by the components.
     * The method should be used in a scenerio when we want to fire the cbxchange method of any field if we set the value of that field from some other field.
     * The use of this method should be avoided if explicitly it is not required.
     * @param {String} fieldName The itemId for which model data needs to be retreived
     * @param {String/Object} value The value needs to be set
     * @param {Boolean} ignoreChanges To say whether setDatachanged method to be called or not.If the value is true,then the setData changed method will not be called.
     * @param {String/Integer} index The index of the multiform at which the field is present if at all the field is a part of multiform
	 * @param {String} parent  The multiform id  
     * @access public
     * @example
<pre>
1.fm.model.updateValue('FLD1','Intellect Design Arena');
2.fm.model.updateValue('FLD1','Intellect Design Arena',undefined,2,'DEMO_MULTIFORM');

</pre>
     */
	updateValue : function (fieldName, value, ignoreChanges, index, formId)
	{
		ignoreChanges = ignoreChanges || false;
		if (!cbx.isEmpty(index) && !cbx.isEmpty(formId))
		{
			this.md[formId][fieldName][index] = value;
		} else
		{
			this.md[fieldName] = value;
		}
		if (!ignoreChanges)
		{
			this.setDataChanged(true);
		}
		this.raiseEvent("cbxchange", "cbxchange", fieldName, value, index, formId);
	},
/**
 * @Method updateField
 * @memberof "cbx.form.formModel"
 * @description To update the value of any field ensuring that none of the events gets fired.
 * @access private
 * @param {String} fieldName The itemId for which model data needs to be retreived
 * @param {String/Object} value The value needs to be set
 * @param {String/Integer} index The index of the multiform at which the field is present if at all the field is a part of multiform
 * @param {String} parent  The multiform id  
 * */
	updateField : function (fieldName, value, index, parent)
	{
		if (!cbx.isEmpty(index) && !cbx.isEmpty(parent))
		{
			this.md[parent][fieldName][index] = value;
		} else
		{
			this.md[fieldName] = value;
		}
	},
/**
 * @Method getModelData
 * @memberof "cbx.form.formModel"
 * @description  To get the modeldata at any poit of time.It is advisable not to use this method directly.Instead use the getModelData of the "cbx.form.formManager"
 * @access public
 * @returns {Object} The model data in JSON format
 * @example
<pre>fm.getModelData();<pre>
 * */
	getModelData : function ()
	{
		return this.md;
	},
	/**
	 * @Method setModelData
	 * @memberof "cbx.form.formModel"
	 * @description  To set the modeldata at any poit of time.
	 * @access public
	 * @param {Object} obj The model data in the JSON format
	 * @param {Boolean} ignoreChanges 
	 * @param {Boolean} ignoreNullChanges  
	 * */
	setModelData : function (obj, ignoreChanges, ignoreNullChanges)
	{
		ignoreChanges = ignoreChanges || false;
		ignoreNullChanges = ignoreNullChanges || false;
		var tmpObj = {};
		if (!ignoreChanges)
		{
			this.setDataChanged(true);
		}
		if (!ignoreNullChanges)
		{
			for ( var ind in obj)
			{
				if (!Ext.isEmpty(obj[ind]))
				{
					tmpObj[ind] = obj[ind];
				}
			}
			if (!Ext.isEmpty(tmpObj))
			{
				obj = tmpObj;
			}
		}
		this.md = obj;
		this.raiseEvent('cbxmodeldatachange', "cbxmodeldatachange", this.md);
	},
	/**
	 * @Method applyModelData
	 * @memberof "cbx.form.formModel"
	 * @description  To set the modeldata at any point of time.
	 * @access public
	 * @param {Object} obj The model data in the JSON format
	 * @param {Boolean} ignoreChanges 
	 * @param {Boolean} ignoreNullChanges  
	 * */
	applyModelData : function (obj, ignoreChanges, ignoreNullChanges)
	{
		ignoreChanges = ignoreChanges || false;
		ignoreNullChanges = ignoreNullChanges || false;
		var tmpObj = {};
		if (!ignoreChanges)
		{
			this.setDataChanged(true);
		}
		if (!ignoreNullChanges)
		{
			for ( var ind in obj)
			{
				if (!Ext.isEmpty(obj[ind]))
				{
					tmpObj[ind] = obj[ind];
				}
			}
			if (!Ext.isEmpty(tmpObj))
			{
				obj = tmpObj;
			}
		}
		cbx.core.extend(this.md, obj);
		this.raiseEvent('cbxmodeldatachange', "cbxmodeldatachange", this.md);
	},

	/**
	 * @Method isDataChanged
	 * @memberof "cbx.form.formModel"
	 * @description The dataChanged method has been changed to keep track whether a data changed or not.The serializeModelState is to
	 * serialize the model data at the time of intializing the model. The resetModelData is to set the preModeldata if
	 * any
	 * @access private
	 *
	 */
	isDataChanged : function ()
	{
		return this.initModel !== cbx.encode(this.md);
	},

	/**
	 * @Method serializeModelState
	 * @memberof "cbx.form.formModel"
	 * @description The following method has been added to serialize the model data after post model load.
	 * @access private
	 * 
	 */
	serializeModelState : function ()
	{
		this.initModel = cbx.encode(this.md);
	},
	/**
	 * @Method resetModelData
	 * @memberof "cbx.form.formModel"
	 * @description To reset the model data
	 * @access private
	 * 
	 */
	resetModelData : function ()
	{
		this.setModelData(cbx.decode(this.initModel));
	},

	/**
	 * @Method destroy
	 * @memberof "cbx.form.formModel"
	 * @description To delete the modeldata and purge the listeners
	 * @access private
	 * 
	 */
	destroy : function ()
	{
		delete this.md;
		this.purgeListeners();
	}
});