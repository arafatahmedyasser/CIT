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
cbx.ns('cbx.form');
/**
 * @namespace "cbx.form"
 * @description The name space cbx.form are useful for organizing the code.<br>
 * It provides 2 main benefits.<br>
 * The first is that we can use them to prevent polluting the global namespace with objects,which is generally
 * considered to be undesireable. cbx, for example has just a single global object (the cbx object). It's good practice
 * to put any classes inside a namespace, a commonone is the name of your company or the name of your application.The
 * other advantage is that assists in keeping our code organized, we can group together similar or co-dependent classes
 * in the same namespace, which helps to specify your intent to other developers.
 */
cbx.form.FormManager = Class(cbx.Observable, {
    /**
     * @class "cbx.form.formManager"
     * @extends "cbx.Observable"
     * @description This class is the actual bridge between the app layer and the frame work code, This class is expected to take the formId as a parameter and in return provide the complete form Panel that can be added into any container for rendering.
     * @author gagandeep.singh
     * @example 
     * var fm = new cbx.form.FormManager({ 
     * formId : "DEMO_FORM", mode :'edit',
     * modelData:{EMAIL_ID:'demo@intellectdesign.co.in'}, 
     * listeners:{ 
     * 'initialized': function(manager){
     *          //Do the required stuffs 
     *          } 
     * });
     */
    constructor: function(config) {
        /**@member  {Object} this
         * @memberof "cbx.form.formManager"
         * @description Creating a reference of the current scope to a variable called that so that if the scope is
         * required in any internal function of the construction it should not make wny conflict with that
         * function's scope.
         * @access private
         */
        var that = this;
        /**
         * Adding the events in the form manager scope.
         * */
        this.addEvents({
            'initialized': true,
            'beforeinitialize': true,
            'formPanelRender': true
        });
        if (config.listeners) {
            for (k in config.listeners) {
                if (config.listeners[k] != null && cbx.core.isFunction(config.listeners[k])) {
                    this.registerListener(k, config.listeners[k], config.scope);
                }
            }
        }
        /**
					 * @member  {Object} register
					 * @memberof "cbx.form.formManager"
					 * @description This will be used to register the various events in the form level.Like premodelload,postmodelload and prreinitialize.
					 * Any form level events will be resitered in this object.
					 * @type {Object}
					 * @access private
					 * @example 
					 * <PRE>
if (this.register['cbxpreinitialize' + "|" + this.formId] != null)
	{
	var obj = this.register['cbxpreinitialize' + "|" + this.formId];
	this.preInitConfig = obj.handler.apply(obj.mScope, [ this ]);
}
					</PRE>
					 */
        this.register = {};
        this.func_queue = [];
        /**
         * @member  {Object} preInitConfig
         * @memberof "cbx.form.formManager"
         * @description this.preInitConfig object will be used for storing any pre-initialization parameters that the app
         * team wants to override on the defaul metadata received from the server
         * @access private
         */
        this.preInitConfig = null;
        this.isInitialized = false;
        /**
         * @member  {Array} pushFormRequestQueue
         * @memberof "cbx.form.formManager"
         * @description new sub form addition queue object.
         * @access private
         *
         */
        this.pushFormRequestQueue = [];
        this.formPanelRendered = false;
        this.contextContainer = null;
        /**
         * @member {Object} additionalConfig
         * @memberof "cbx.form.formManager"
         * @description This can be set by app developer at the time of creating the instance of the Form Manager.This
         * property is ideal for adding any data that can be helpful for the developer in processing his
         * business logic and nothing directly related with Form Manager and form components itself and good
         * example for that would be the mode as per the transaction workflow like initiate, amend, etc.
         * @access public
         * @example 
         * var fm=new cbx.form.formManager({ 
         * 	formId:"DEMO_FORM",
         *  additionalConfig:{"SI_TYPE":"AMMEND"} 
         *  }); 
         *  Passing the Standing Instruction Type as ammend or cancel as per the developer. The same object 
         *  configuration will be available as part of the form manager accross the listener 
         *  to perform any business logic. 
         *  
         * */
        this.additionalConfig = config.additionalConfig;
        /**@member {Object} extraParams
					 * @memberof "cbx.form.formManager"
					 * @description This can be used to pass any extra parameter when the form meta data call is happening.
					 * It will be useful when we will try to retreive the additional data based on some dynamic parameters send from the client.
					 * The additional parameter is retrevied through the data support class and in the same class the extraParams object will be available.
					 * @access public
					 * @example 
					 * 	var fm=new cbx.form.formManager({ 
					 * 	formId:"DEMO_FORM",
					 *  extraParams:{"SI_TYPE":"AMMEND"} 
					 *  }); 
					 *  Passing the Standing Instruction Type as ammend or cancel as per the developer. 
					 *  The same object configuration will be available as part of the form manager accross 
					 *  the listener to perform any business logic.A demonstration of a datasupport class is 
					 *  as below.All data suuport class should implement IAdditionalDataSupport.
					 *  Here additional Data menas any data which is required to render the components like
					 *  maxDate,minDate,disabledDate,disabledDatesText for date field,the store for the combo box 
					 *  and the drop down the image src for the logo components per item level
					 *  @Example
		<PRE>			
 public class DemoDataSupport implements IAdditionalDataSupport
	{
	public ArrayList<AdditionalDataCodeValue> getAdditionalDataFor(FormItemDefinition itemDefn, UserValue userValue,
	HashMap inputParams) throws FormDefinitionException
	{
	ArrayList<AdditionalDataCodeValue> dataList = null;
	dataList = new ArrayList<AdditionalDataCodeValue>();
	HashMap filterMap = null;
	//FILTER_COMBO will be the item id as mentioned in the item definition for DEMO_FORM
	if ("FILTER_COMBO".equals(itemDefn.getItemId()))
	{
		if(inputParams.get("SI_TYPE").equals("AMMEND")){
			dataList.add(new AdditionalDataCodeValue("key","AMEND");
		}else{
			dataList.add(new AdditionalDataCodeValue("key","CANCEL");
		}
	}
	return dataList;
	}
private static final Logger LOGGER = Logger.getLogger(DemoDataSupport.class);
}
<PRE> 
					 * */
        this.extraParams = config.extraParams;
        /**@member {Boolean} autoDestroy
         * @memberof "cbx.form.formManager"
         * @description This will be used to determine if the FormManager has to destroy itself or
         * it has to be manually done. The Formmanager is configured to autoDestroy itself after the Form's
         * container is destroyed. In case, the value of this property is false, then the caller of the
         * FormManager would need to manually destroy the reference. It is recommended to keep this value to
         * true.
         * @access private
         */
        this.autoDestroy = true;
        if (cbx.isBoolean(config.autoDestroy)) {
            this.autoDestroy = config.autoDestroy;
        }
        /**
         * @member {Object}	model	
         * @memberof "cbx.form.formManager"
         * @description The coupling of the model object with the form manager.Instantiating the defaule Form Model and also attaching listeners to its events.
         * @access private	
         */
        this.model = new cbx.form.FormModel({
            preData: config.modelData,
            scope: this,
            listeners: {
                'cbxchange': this.handlerEvent,
                'cbxappchange': this.updateField,
                'cbxmodeldatachange': this.updateForm
            }
        });
        this.raiseEvent('formbeforeinitialize', this);
        /**
         * @member {Object}	screenView	
         * @memberof "cbx.form.formManager"
         * @access private
         * @description The FormScreenView Class is intialized with the parent formID, This is like a FormModel and
         * FormManager which is initialized only once for a particular form
         */
        this.screenView = new cbx.form.FormScreenView({
            formId: config.formId
        });
        if (config != null) {
            this.formId = config.formId;
            this.mode = config.mode;
            this.lazzyFormPanel = config.ignoreFormPanel ? config.ignoreFormPanel : false;
            var wrapperConfig = {
                autoScroll: false,
                border: false,
                frame: false,
                layout: 'anchor',
                fm: this,
                boxMinWidth: 400,
                cls: this.formId,
                itemId: cbx.id() + "_" + this.formId + "_WRAPPER",
                defaults: {
                    anchor: '100%'
                },
                listeners: {
                    /**
                     * Wiring the destory method of the form manager with the destroy of the form container
                     * with the autoDestroy property of the form manager is true.
                     */
                    "destroy": function() {
                        if (this.fm.autoDestroy === true) {
                            this.fm.destroy();
                            delete this.fm;
                        }
                    }
                }
            };
            /**
             * Gets the lib Component Class for the Wrapper Panel that contains the Form Panel inside it.
             * Similarly once such instance of Form Panel is created to update the wrapperPanel to add Form
             * Panel inside it. The object obtained will be a class containing wrapperPanel component at 0.
             */
            if (wrapperConfig != null) {
                var param = {
                    'config': wrapperConfig
                }
                var wClass = CLCR.getCmp({
                    'COMP_TYPE': 'FORM_WRAPPER'
                });
                this.wrapperPanel = new wClass(param).getItem(0);
            }
        }
        /**
         * @member {Object}	listeners	
         * @memberof "cbx.form.formManager"
         * @description The variable is used to store the listsners registered by the developer
         * @access private
         */
        this.listeners = config.listeners;
        /**
         * @var {Object} listenerClass
         * @memberof "cbx.form.formManager"
         * @description Finding the Listener Handler class from the factory.
         * The application developer will be using this class to 
         * register different events in the form level and in the item level.
         * Application developer will be able to register event handlers both at form as 
         * well as component level. Following are the available events that can be handled at<b>FORM-LEVEL</b><br><br>
         * <p><h4>1.cbxpreinitialize</h4><br><br>
         *  This event will be called before the Form managers initiate the form creation. The handler of this event is expected
         *  to  return a config object like:<pre> 
         *  {ITEM_ID: {PROPERTY:VALUE}}
         *  </pre>
         *  The returned object configuration will be given priorityover the defaul metadata configuration or the view mode of
         *  the form.</br>
         *  <b>NOTE:</b> This configuration cannot be used for updating the value of the component.
         *  </br>
         *  <b>Example</b>
         *  <br>
         *  <br>
         *  </p>
         * <p><h4>2.cbxprevalidate</h4><br><br>
         *  This event handler can be used to override the framework's  default validation logic for validating
         *  the entire form. The config object that was provided as a parameter to the isFormValid or isFieldsValid method, will
         *  also be sent as a parameter to this method with additional information like the ACTION, etc. helpful for putting 
         *  validation rules. The handler is expected to return value in the following format:
         * 
         * <pre>
         *                 boolean (true/false) as the validation result and return from
         *                 the isFormValid/ is FieldsValid method. 
         *                 JSON {isPreValid : boolean, 
         *                 		 defaultValidation: boolean
         *                 		}. 
         *                 Here, the isPreValid is
         *                 the result of the prevalidate handler and defaultValidation
         *                 is the flag whether to continue with framework's default
         *                 validation or return from the isFormValid/ isFieldsValid
         *                 method. 
         * </pre>
         * 
         * This point-cut will be used for performing validation on conditional mandatory fields.
         * 
         * </br>
         *  <b>Example</b>
         *  </p>
         *  <br>
         *  <br>
         * <p><h4>3.cbxpostvalidate</h4><br><br>
         *  This event handler will be called after the default validation process is executed. The handler is expected to
         *  return a boolean flag where, true is for valid and false is for invalid form. The config object that was provided
         *  as a parameter to the isFormValid or isFieldsValid method will be updated with
         *  {isPreValid:boolean, isDefaultValid: boolean} and sent as a parameter to the handler of this method.
         * </br>
         * <b>Example</b>
         * </p>
         * <br>
         * <br>
         * <p><h4>4.cbxpremodelload</h4><br><br>
         * This event will be called before the the Form Manager makes  its request for loading the model data. The handler of this
         * method is expected to return a boolean flag for continuing the model AJAX call or not. Otherwise the handler should
         * return a JSON containing all the base params needed to be sent to the server for loading the correct model data. In
         * case no handler is registered for this event. The Form Manager will not make any Model data request. 
         * JSON params={PARAM1: VALUE1, PARAM2:VALUE2}
         *  </br>
         * <b>Example</b>
         * </p>
         * <br>
         * <br>
         * <p><h4>5.cbxpostmodelload</h4><br><br>
         * This event will be raised by Form Manager after the successful retrieval of model data from the server. This event
         *  can be used for massaging the received data as per the form structure before the Form Manager updates it with
         *  in the launched form. The handler is expected to return a  JSON mentioned in the following format.
         * <pre>
         *  JSON={	FIELD_NAME1:FIELD_VALUE, 
         *  FIELD_NAME2:[FIELD_VALUES],
         *  FIELD_NAME3:{FIELD_VALUE}
         *  }
         * 
         * JSON={ FIELD_NAME1:FIELD_VALUE, FIELD_NAME2:[FIELD_VALUES],
         *                   FIELD_NAME3:{FIELD_VALUE} } Here,
         * JSON is the object returned by the handler of this method.
         * FIELD_NAME1 is the ITEM_ID of the form component and it expects a scaler  value.
         * FIELD_NAME2 This componet expects a List of Values
         * FIELD_NAME3 This compoents expects the value to be another JSON object. In case no handler is attached to this event,
         * the Form Manager will assume that the received model data from the server is already massaged to match the Form's 
         * components structure and will be directly attached to the Form's Model.
         * </pre>
         * </br>
         * <b>Example</b>
         * </p>
         * <br>
         * <br>
         * <b>
         * The following evenet will be registerebd as a part of component level</b><br><br>
         * <p><h4>1.cbxchange:</h4><br>
         * This event handler will be executed everytime its associated field value gets
         * changed by user interaction and updated in the model.<br><br>
         * <b>Example:</b>
         * </p>
         * <br><br>
         * <p><h4>2.cbxvalidate:</h4><br>
         * This event hanlder will be called everytime its associated field value is changes before its value is set to the 
         * model for update. The handler is expected to invalidated the field if necessary and return true or false. In case
         * of false, the modeldata will not be updated with the same value.<br><br>
         * <b>Example:</b>
         * </p>
         * <br><br>
         * <p><h4>3.cbxbeforeload:</h4><br>
         * This event will be raised by the lookup/ widget components before it creates its data load request. The app layer
         * is expected to return a param JSON that will be attached to override the existing base params of the lookup/ widget.
         * These params will be sent to the server when the component make its data request. 
         * Example {INPUT_PROD_CODE:'CUSER',INPUT_SUBPROD_CODE:'CUSER'}
         * <br><br>
         * <b>Example:</b>
         * </p>
         * <br><br>
         * <p><h4>4.cbxclick:</h4><br>
         * This event will be raised on click event of the button component,where the developer is expected to write his own
         * handling logic to get the expected results.
         * <br><br>
         * <b>Example:</b>
         * </p>
         * <br><br>
         * <p><h4>4.cbxafterselect:</h4><br>
         * This event will be raised by the Lookup component when the user selects a record within the data list presented in
         * the popup. The component will send the selected record JSON object for the app layer to extract the data needed for
         * populating the related fields.
         * <br><br>
         * <b>Example:</b>
         * </p>
         * <br><br>
         * <p><h4>5.cbxbeforetabchange:</h4><br>
         * This event will be raised by the tab panel when the user tries to switch between two tabs. The handler is expected
         * to return boolean value to allow or stop the switch.
         * <br><br>
         * <b>Example:</b>
         * </p>
         */
        var listenerClass = CFLR.getListener(this.formId);
        if (listenerClass) {
            this.listenerScope = new listenerClass({
                fm: this
            });
            /**
             * Calling the lifecycle registerHandlers of the listener handler for Form Manager to register
             * all the handlers available
             */
            if (this.listenerScope.registerHandlers) {
                this.listenerScope.registerHandlers();
            }
        }
        /**
         * The event is expected to call to do certain functionality before intializing a form widget.
         * Initiate the rendering process Retrieving any pre initlize data for overridign the default cached
         * meta data for any component of the form
         */
        if (this.register['cbxpreinitialize' + "|" + this.formId] != null) {
            var obj = this.register['cbxpreinitialize' + "|" + this.formId];
            this.preInitConfig = obj.handler.apply(obj.mScope, [this]);
        }
        if (this.formId != null) {
            /**
             * instantiating the Form renderer and giving the successhandler as this.callback
             */
            new cbx.form.FormRenderer(this, this.initializeFormPanel);
        }
    },
    /**
     * @Method add_to_queue
     * @memberof "cbx.form.formManager"
     * @description Private Method, intended to start pushing all the methods inside the queue which will be updated in
     * its local func_queue object to be used later.We cannot perform modifications on form components until
     * the formpanel rendered completely,hence we maintains those methods in queue which are invoked from
     * formanager and execute after rendering the form panel.
     * @access private
     * @param {Array} args If arguments present for that function
     * @param {Function} handler function that needs to be executed for the passed event
     * @param {Object} scope scope in which the handler is needed to be executed
     */
    add_to_queue: function(handler, scope, args) {
        this.func_queue.push({
            "handler": handler,
            "margs": args || [],
            "mscope": scope
        });
    },
    /**
     * @Method execute_queue
     * @memberof "cbx.form.formManager"
     * @description Private Method, This method will be invoked on after rendering the formPanel.This method tries to
     * exceute the handlers along with its params and maintains the scope too.
     * @access private
     */
    execute_queue: function() {
        var that = this;
        for (var i = 0; i < this.func_queue.length; i++) {
            this.func_queue[i].handler.apply(this.func_queue[i].mscope, this.func_queue[i].margs);
        }
        this.func_queue = [];
    },
    /**
     * @Method initiateModel
     * @memberof "cbx.form.formManager"
     * @description Private, Life Cycle method for initiating the population of the model data. This method will be
     * called by the constructor of the Form Manager and it is intended to take care of making the Model
     * Data specific AJAX request with raising the cbxpremodelload and cbxpostmodelload events and
     * accordingly update the massaged JSON in the Form Manager's model object.The method will be called from the 
     * form panel of the library layer
     * @access private
     */
    initiateModel: function() {
        var params = {};
        params.FORM_ID = this.formId;
        params.forceCallbacks = true;
        var preModelResult = false;
        var that = this;
        var userData = null;
        var stateObj = {
            'NetworkState': 'ACTIVE'
        };
        var obj = this.register['cbxpremodelload' + "|" + this.formId];
        if (obj != null) {
            preModelResult = obj.handler.apply(obj.mScope, [this, params]);
        } else {
            that.model.serializeModelState();
        }
        if (preModelResult != null && preModelResult !== false) {
            cbx.apply(params, preModelResult);
            obj = that.register['cbxpostmodelload' + "|" + that.formId];
            if (canvas.env.network.getState() != 'ACTIVE') {
                if (obj != null) {
                    stateObj.NetworkState = "INACTIVE";
                    userData = obj.handler.apply(obj.mScope, [that, data, stateObj]);
                }
                if (!cbx.isEmpty(userData)) that.model.applyModelData(userData, true);
                that.model.serializeModelState();
            } else {
                cbx.ajax({
                    params: params,
                    success: function(result, request) {
                        var data = result;
                        if (obj != null) {
                            userData = obj.handler.apply(obj.mScope, [that, data, stateObj]);
                        }
                        if (!cbx.isEmpty(userData)) that.model.applyModelData(userData, true);
                        that.model.serializeModelState();
                    },
                    failure: function(result, request) {
                        var data = result;
                        if (obj != null) {
                            data = obj.handler.apply(obj.mScope, [that, data, stateObj]);
                        }
                        that.model.serializeModelState();
                    }
                });
            }
        }
    },
    /**
     * @Method destroy
     * @memberof "cbx.form.formManager"
     * @description
     * The method is intended to clear all the properties of the From Manager and delete all the attached
     * listeners. The method will also call the FormModel's destroy to clear that aswell.
     * @access private
     */
    destroy: function() {
        try {
            delete this.register;
            delete this.listenerScope;
            this.model.destroy();
            delete this.model;
            /**
             * Deleting the FormScreenView object once the form is destroyed
             */
            this.screenView.destroy();
            delete this.screenView;
            this.purgeListeners();
            CFR.clearRequestQueue();
        } catch (e) {
            LOGGER.error(e);
        }
    },
    /**
				 * @Method handlerEvent
				 * @memberof "cbx.form.formManager"
				 * @description This method is used to raise any event dynamically.
				 * @param {Srting} event The event which needs to be raised.
			     * @param {String} fieldName FieldName at which the event needs to be raised
			     * @param {String} value scope New value for the fieldName with which the handlerEvent needs to be called.This is optional.
				 * @param {String} index scope in which the handler is needed to be executed.The index of the multiform in which the field is present if at all the field is a part of the multiform.
				 * @param {String} parent The multiform id
				 * @access public
				 * @example
				 * 
Lets say we want to attach a parameter in the beforeload event before reloading a 
listview component in the form.
<pre>
this.fm.registerHandler("cbxclick", "AST18_SUBMIT", function(fm, event , fieldName) {
var fromDate = fm.model.getValue('AST13_FROM_DATE')||'';
var toDate   = fm.model.getValue('AST14_TO_DATE')||'';
var historic_mon = fm.model.getValue('AST16_HISTRC_STATEMNT_MNTH')||'';
var historic_yr = fm.model.getValue('AST17_HISTRC_STATEMNT_YEAR')||'';
var rb = IRB.getBundle(IRB.CASH);
var past_stmt = fm.model.getValue('AST_PAST_STATEMENT_RADIO')||'';
var date_range = fm.model.getValue('AST12_DATE_RANG_OPTION')||'';
var curr_mnth = fm.model.getValue('AST15_CURRENT_DATE')||'';
if(curr_mnth == 'AST15_CURRENT_DATE'){
	fm.clearValues(['AST_PAST_STATEMENT','AST13_FROM_DATE','AST14_TO_DATE',
	'AST11_STATE_DATE']);
	fm.handlerEvent('cbxbeforeload','AST_WIDGET');
	fm.reloadData('AST_WIDGET');	
}
else if(date_range != 'AST12_DATE_RANG_OPTION'){
	var stmt_date = fm.model.getValue('AST11_STATE_DATE')||'';
	if(stmt_date != ''){
		fm.handlerEvent('cbxbeforeload','AST_WIDGET');
		fm.reloadData('AST_WIDGET');	
	}
else if(stmt_date =='' && 'AST10_STATE_OPTION'== past_stmt){
	fm.markInvalid('AST10_STATE_OPTION',rb.LBL_SELECT_STMT_DATE);
	this.showDialog(rb.LBL_SELECT_STMT_DATE);
}
else{
if(historic_mon !="" && historic_yr!=""){
	stmt_date = fm.model.getValue('AST16_HISTRC_STATEMNT_MNTH')+","+
	fm.model.getValue('AST17_HISTRC_STATEMNT_YEAR');
	var param={
	'INPUT_ACTION':'EXPORT_DATE_DETAIL',
	'INPUT_FUNCTION_CODE':'ACSMT',
	'INPUT_LANGUAGE_ID':iportal.preferences.getPrimaryLang(),
	'INPUT_PRODUCT':'ACCSVS',
	'INPUT_SUB_PRODUCT':'ACCINQ',
	'PAGE_CODE_TYPE':'ACCT_CODE',
	'PRODUCT_NAME':'ACCSVS',
	'STATEMENT_DATE':tmt_date,
	'TRANSACTION_ID':fm.additionalConfig.TRANSACTION_ID,
	'ACCOUNT_NUMBER':account_number
};
cbx.ajax({
	params aram,
	success unction(response,opt){
		var respObj = response;
		var datas = respObj['ALL_RECORDS'];
		fromDate = datas.FROM_DATE;
		toDate = datas.TO_DATE;
		fm.model.setValue('AST13_FROM_DATE',fromDate);
		fm.model.setValue('AST14_TO_DATE',toDate);
		fm.handlerEvent('cbxbeforeload','AST_WIDGET');
		fm.reloadData('AST_WIDGET');	
		fm.model.setValue('AST13_FROM_DATE','');
		fm.model.setValue('AST14_TO_DATE','');
	}
});
}
else
	this.showDialog(rb.LBL_SELECT_STMT_DATE);
}
}
else if(fromDate =='' && toDate==''){
	fm.markInvalid('AST13_FROM_DATE',rb.ERR_CST11_FROM_DATE);
	fm.markInvalid('AST14_TO_DATE',rb.ERR_CST12_TO_DATE);
}
else if(fromDate == ''){
	fm.markInvalid('AST13_FROM_DATE',rb.ERR_CST11_FROM_DATE);
}
else if(toDate == ''){		
	fm.markInvalid('AST14_TO_DATE',rb.ERR_CST12_TO_DATE);
}
else{
	fm.handlerEvent('cbxbeforeload','AST_WIDGET');
	fm.reloadData('AST_WIDGET');			
}
});

</pre>
*/
    handlerEvent: function(event, fieldName, value, index, parent) {
        if (this.register[event + "|" + fieldName] != null) {
            var obj = this.register[event + "|" + fieldName];
            return obj.handler.apply(obj.mScope, [this, event, fieldName, value, index, parent]);
        }
    },
    /**
				 * @Method registerHandler
				 * @memberof "cbx.form.formManager"
				 * @description
				 * Even handlers for all the form components have to registered to the form manager using this method.
				 * The method is intended to updated it local Register object to be used later when receiving the events
				 * from the model
				 * @access public
				 * @param {String} event Event for which handler needs to be registered
				 * @param {String} fieldName ITEM_ID of the component for which the event needs to be registered
				 * @Param {Function} handler Call back function that needs to be executed for the passed event
				 * @param {Object} scope Scope in which the handler is needed to be executed
				 *@example
				 *<pre>
this.fm.registerHandler('cbxpremodelload',function(fm, record) {
	//Do the required stuffs
});
this.fm.registerHandler('cbxpreinitialize',function(fm) {
	//Attach the attributes
});
this.fm.registerHandler('cbxbeforeload',"INPUT_DEBIT_ORG_ACC_NO", 
function(fm, event,fieldName, params) {
//Attach the attributes before loading the view
});
				 *</pre>
				 *
				 */
    registerHandler: function(event, fieldName, handler, scope) {
        if (!cbx.isString(fieldName)) {
            handler = fieldName;
            fieldName = this.formId;
        }
        /**
         * @member scope
         * @memberof "cbx.form.formManager"
         * @description Addign the default scope for all the events raised to be in the listener class.
         * @access private
         */
        if (scope == null) {
            scope = this.listenerScope;
        }
        this.register[event + "|" + fieldName] = {
            "event": event,
            "fieldName": fieldName,
            "handler": handler,
            "mScope": scope
        };
    },
    /**
				 * @Method isFormDataChanged
				 * @memberof "cbx.form.formManager"
				 * @description Intended to return if the data of the form has been updated after the form is launched on the screen.
				 * @access public
				 * @returns {Boolean} true If the data is changed then it will returned as true and false if data is not changed
				 * @example
				 * <pre>
				 * The method can be called whereever the formmanager scope is available
if(fm.isFormDataChanged){
//Do the required stuffs
}
</pre>
				 */
    isFormDataChanged: function() {
        return this.model.isDataChanged();
    },
    /**
     * @Method updateField
     * @memberof "cbx.form.formManager"
     * Method is the event handler of the 'cbxappchange' event on the model. This event will be raised
     * whenever the app layer tries to update the value of the model of the form. This method is intended to
     * update the new value on to the component that is rendered on the screen
     * @access private
     * @param {String} event Event for which the event got raised
     * @param {String} fieldName Name of the field whose value is changed
     * @param {String} newValue The new value to be updated on the screen
     * @param {String/Integer} index The index of the multiform at which the dropdown is present if at all the dropdown is a part of multiform
     * @param {String} parent  The multiform id  
     */
    updateField: function(event, fieldName, newValue, index, parent) {
        if (!this.formPanelRendered) {
            this.add_to_queue(this.updateField, this, [event, fieldName, newValue, index, parent]);
            return;
        }
        if (this.wrapperPanel && this.wrapperPanel.parentCt.hasChildren() /* getComponent(0) */ ) {
            var managerScope = this;
            if (this.lazzyFormPanel) {
                var fieldObj = this.findField(fieldName);
                if (fieldObj != null && fieldObj.setValue) {
                    fieldObj.setValue(newValue);
                }
            } else {
                var fieldsUpdated = this.wrapperPanel.parentCt /* getComponent(0).getForm() */ .setValues(
                    [{
                        id: fieldName,
                        value: newValue,
                        index: index,
                        multiFormId: parent,
                        managerScope: managerScope
                    }], true);
                var fieldObj = this.findField(fieldName);
                if (fieldObj && !fieldObj.triggerField) {
                    if (this.screenView && this.screenView.updateScreenViewData) {
                        this.screenView.updateScreenViewData(this.formId, fieldName, newValue);
                    }
                }
                if (fieldsUpdated === false || (fieldObj && fieldObj.xtype == 'cbx-label')) {
                    if (fieldObj != null && fieldObj.setValue) {
                        fieldObj.setValue(newValue);
                    }
                }
            }
        }
    },
    /**
     * @Method updateForm
     * @memberof "cbx.form.formManager"
     * @description Private method, To update the form when cbxmodeldatachange is fired.
     * @access private 
     */
    updateForm: function(event, modelData) {
        if (!this.formPanelRendered) {
            this.add_to_queue(this.updateForm, this, [event, modelData]);
            return;
        }
        /**
         * While applying form data's through apply model data - Need to populate the date field and amount
         * field same as the format displayed in the form.
         */
        if (cbx.isObject(modelData)) {
            var valueArr = [];
            for (var ind in modelData) {
                valueArr.push({
                    id: ind,
                    value: modelData[ind]
                });
            }
            if (this.wrapperPanel && this.wrapperPanel.parentCt.hasChildren()) {
                var fieldsUpdated = this.wrapperPanel.parentCt /* .getComponent(0).getForm() */ .setValues(valueArr, true);
                if (fieldsUpdated === false) {
                    var len = valueArr.length;
                    var fieldObj = null;
                    for (var i = 0; i < len; i++) {
                        fieldObj = this.findField(valueArr[i].id);
                        if (fieldObj != null && fieldObj.setValue) {
                            fieldObj.setValue(valueArr[i].value);
                        }
                    }
                }
            }
        }
    },
    /**
     * @Method initializeFormPanel
     * @memberof "cbx.form.formManager"
     * @description Private method, expected to receive the form object from the Form Renderer and prepare the received
     * metadata and config object to be wrraped on parent Ext Form Panel
     * @access private
     */
    initializeFormPanel: function(config, formMeta) {
        var that = this;
        /**
         * Referring formTitle value from properties file associated with its bundlekey or cuser properties.
         */
        var bundleObj = CRB.getBundle(config.bundleKey) || CRB.getFWBundle();
        this.formTitle = bundleObj['LBL_' + config.formTitle] ? bundleObj['LBL_' + config.formTitle] : config.formTitle;
        this.formDesc = config.formDesc;
        config.scope = this;
        if (this.lazzyFormPanel) {
            var formObj = {
                xtype: 'cbx-lazzyformpanel',
                bundleKey: config.bundleKey,
                formId: this.formId,
                itemId: this.formId,
                model: this.model,
                preInitConfig: this.preInitConfig,
                screenView: this.screenView,
                fm: this,
                manager: this,
                lazzyFormPanel: true,
                defaults: {
                    layout: 'tableform',
                    anchor: '100%'
                },
                listeners: {
                    "afterrender": function() {
                        that.formPanelRendered = true;
                        setTimeout(function() {
                            that.execute_queue();
							that.raisePostFormRender();	
                        }, 100);
                    }
                }
            };
            this.wrapperPanel.add(formObj);
        }
        /**
         * Replacing the wrapperPanel component with wrapperPanel containing the Form. The adding of the
         * formPanel to the wrapperPanel is done in the lib class.
         */
        else {
						/**
						 * Gets the library component Class containing the Form Panel. The object returned will be a Class
						 * containing the wrapperPanel containing the formObj.
						 */
						var cClass = CLCR.getCmp({
							'COMP_TYPE' : 'FORM_PANEL'
						});
            var formPanel = new cClass(config).getItem(0);
            this.wrapperPanel.parentCt.appendFormPanel(formPanel);
        }
        /**
         * The method is updated to fix the allignment issue of a form at the time of rendering for the
         * first time.
         */
        /*
         * if (this.wrapperPanel.ownerCt) { this.wrapperPanel.ownerCt.doLayout(); } else {
         * this.wrapperPanel.doLayout(); }
         */
        this.pushFormFromQueue();
    },
    /**
				 * @Method addForm
				 * @memberof "cbx.form.formManager"
				 * Provied the ability to add sub forms inside the same form panel. This will be specially used when
				 * some form components are required on the fly.
				 * @access public
				 * @param {Object} formConfig  The cofif of the form that needs to be added.{formId:<FORM_ID as in DB>, [mode:<edit|view>], [direction:<'TOP || BOTTOM'>]}
				 * @example
<pre>fm.addForm({formId:'DYN_FORM',mode:'edit',direction:'BOTTOM'});</pre>
				 */
    addForm: function(formConfig) {
        if (!this.initialized) {
            this.pushFormRequestQueue.push(formConfig);
        } else {
            this.pushForm(formConfig);
        }
    },
    /**
     * @Method pushFormFromQueue
     * @memberof "cbx.form.formManager"
     * @description Private Method, intended to start taking all the forms available in the pushFormRequestQueue and
     * start the process of initiatig them one after another. Once all the Forms from the queue are
     * initialized. It will raise the Form Manager's initialized event
     * @summary A concise summary.
     * @access public
     */
    pushFormFromQueue: function() {
        if (this.pushFormRequestQueue && this.pushFormRequestQueue.length > 0) {
            var formConfig = this.pushFormRequestQueue.shift();
            this.pushForm(formConfig);
        } else {
            this.initialized = true;
            this.raiseEvent('initialized', this);
        }
    },
    /**
     * @Method pushForm
     * @memberof "cbx.form.formManager"
     * @description Private Mehtod, intended to received the Sub Form configurations and initiate the rendering process.
     * @access private
     */
    pushForm: function(formConfig) {
        if (formConfig != null) {
            new cbx.form.FormRenderer(this, this.handleSubFormPush, formConfig);
            this.screenView.updateParentForm(formConfig, this.formId);
        }
    },
    /**
     * @Method  handleSubFormPush
     * @memberof "cbx.form.formManager"
     * @description The method is expected to receive the form object from the Form Renderer for the subForm and insert
     * it appropriatly as per its direction in the Form Panel.
     * @access private
     */
    handleSubFormPush: function(config, formMeta) {
        this.wrapperPanel.parentCt.handleSubForm(config, formMeta);
        this.pushFormFromQueue();
    },
    /**
				 * @Method isTabPanelExists
				 * @memberof "cbx.form.formManager"
				 * @description Intended to Check for tabpanel exists or not in the whole form. This method is added because while
				 * adding the form using addform() method using formManager instance the form loses its padding when
				 * tabpanel is rendered already.
				 * @access public
				 * @returns {boolean} Returns true if the tab panel exists in the form else returns false
				 * @example
				<pre>
if(fm.isTabPanelExists){
			//Do the stuffs if tab panel exists
}
				</pre>
				 */
    isTabPanelExists: function() {
        var result = this.wrapperPanel.parentCt.tabPanelExists(this);
        return result;
    },
    /**@Method getFormView
				 * @memberof "cbx.form.formManager"
				 * @description The method will return the reference of the wrapper panel under which the entire form will be
				 * renderer. The app layer would require to insert this view where it wants to render the form. This
				 * inturn will help the Form Manager to prepare configurations that can help in Lazzy Loading of the
				 * form components.
				 * @access public
				 * @returns {Object/String}Intended to return a view which can be used inside any container.For Jquery it will return html content(string).For EXTJS the item structure
				 * @example
<pre>
{
xtype : 'panel',
layout : 'column',
defaults : {
	columnWidth : 1
},
autoScroll : true,
layout : Ext.isIE6 ? 'fit' : 'auto',
items:fm.getFormView()
}
</pre>
				 * 
				 */
    getFormView: function() {
        return this.wrapperPanel;
    },
    /**
				 * @Method getFormTitle
				 * @memberof "cbx.form.formManager"
				 * @description Return the title as per the meta data of the request Master Form Id
				 * @access public
				 * @returns {String} The form title
				 * @example
<pre>
fm.getFormTitle()
</pre>
				 */
    getFormTitle: function() {
        return this.formTitle;
    },
    /**
				 * @Method getModelData
				 * @memberof "cbx.form.formManager"
				 * @description Return the current updated model data of the form.
				 * @access public
				 * @returns {Object} The updated model data of the form
				 * @example
<pre>fm.getModelData()</pre>
				 */
    getModelData: function() {
        return this.model.getModelData();
    },
    /**
				 * @Method isTabFormValid
				 * @memberof "cbx.form.formManager" 
				 * @description Validate all the fields of the form by invoking the validateTabForm.
				 * @access public
				 * @param {Object} config Additional information that is needed precisely the subform(form rendered as tab) 
				 * @returns true if the form is valid otherwise false.
				 * @example
<pre>fm.isFormValid()</pre>
				 */
    isTabFormValid: function(config) {
        var result = this.wrapperPanel.parentCt.validateTabForm(config, this);
        return result;
    },
    /**
				 * @Method isFormValid
				 * @memberof "cbx.form.formManager" 
				 * @description Validate all the fields of the form. This method is expected to first lookup for custom form
				 * validation provided by app layer. Execute it for validation in case it is provided otherwise call the
				 * default validation process. And then execute the post default validation process in case it is
				 * registered.
				 * @access public
				 * @param {Object} config Additional information that is needed to be sent to the app layer's custom validation.
				 * Specially helpful in knowing the action of the validation. For example. DRAFT, SAVE, etc
				 * @returns true if the form is valid otherwise false.
				 * @example
<pre>fm.isFormValid()</pre>
				 */
    isFormValid: function(config) {
        var preValidateResult = null;
        var postValidateResult = null;
        var continueDefaultValidation = false;
        config = config || {};
        if (this.register['cbxprevalidate' + "|" + this.formId] != null) {
            var obj = this.register['cbxprevalidate' + "|" + this.formId];
            preValidateResult = obj.handler.apply(obj.mScope, [this, config]);
        }
        if (preValidateResult != null && cbx.isObject(preValidateResult)) {
            var isValid = preValidateResult.isPreValid;
            config.isPreValid = isValid;
            if (preValidateResult.defaultValidation === true) {
                continueDefaultValidation = true;
            } else {
                return isValid;
            }
        }
        /**
         * if the reurned value is of boolean type than return the value back to the caller and exit from
         * the function.
         */
        else if (preValidateResult != null && cbx.isBoolean(preValidateResult)) {
            return preValidateResult;
        }
        /**
         * Continue with default validation. This effectively means that the app layer is not handling the
         * cbxprevalidate event for this form.
         */
        else {
            continueDefaultValidation = true;
        }
        /**
         * Executing the default validation process validate method of all the fields will be called and
         * first invalid field will receive focus.
         */
        if (continueDefaultValidation === true) {
            var isValid = this.wrapperPanel.parentCt.doFormValidation();
            config.isDefaultValid = isValid;
            if (this.register['cbxpostvalidate' + "|" + this.formId] != null) {
                var obj = this.register['cbxpostvalidate' + "|" + this.formId];
                postValidateResult = obj.handler.apply(obj.mScope, [this, config]);
                if (postValidateResult != null) {
                    isValid = postValidateResult;
                }
            }
            var isFileUploadValid = this.isUploadPanelValid();
            isValid = isValid && isFileUploadValid;
            // this.doFormLayout(this.wrapperPanel.getComponent(0));
            return isValid;
        }
    },
    /**
     * @Method setActiveTab
     * @memberof "cbx.form.formManager"
     * @description Intended to activate a cbx-tabinnerpanel ,this method searches the tabinnerpanel
     * which is nothing but a subform(formId), whether this exists in the whole form and ,if exists it tries
     * to match the subform's(formId) parent component's itemId with the tabPanelId and activates the
     * respective tab.
     * @access private
     * @param {String} tabPanelId The main tabPanel which contains the tabInnerPanels .
     * @param {String} formId The tabInnerPanel that needs to be actived.
     */
    setActiveTab: function(tabPanelId, formId) {
        if (!this.formPanelRendered) {
            this.add_to_queue(this.setActiveTab, this, [tabPanelId, formId]);
            return;
        }
        var compObj = this.findField(formId);
        if (compObj != null) {
            var tabPanel = compObj.findParentByType('cbx-tabpanel');
            if (tabPanel != null && tabPanel.itemId == tabPanelId) {
                if (tabPanel.activateTab) {
                    tabPanel.activateTab(formId);
                }
            }
        }
    },
    /**
     * @Method isFieldsValid
     * @memberof "cbx.form.formManager"
     * @description Intended to validate certain fields available in the launched form.
     * @access private
     * @param {Object} config Array of field ITEM_ID that need to be validated
     */
    isFieldsValid: function(config) {
        var resultObj = {};
        var firstField = null;
        var fieldNames = config.fieldNames;
        if (fieldNames != null && cbx.isArray(fieldNames)) {
            var compObj = null;
            for (var i = 0; i < fieldNames.length; i++) {
                compObj = this.findField(fieldNames[i]);
                if (compObj != null && compObj.validate) {
                    resultObj[fieldNames[i]] = compObj.validate();
                    if (resultObj[fieldNames[i]] === false && firstField == null) {
                        compObj.focus();
                        firstField = {};
                    }
                }
            }
        }
        return resultObj;
    },
    /**
     * @Method setFocus
     * @memberof "cbx.form.formManager"
     * @description Intended to set the focus in a field
     * @access public
     * @param {String} fieldName The field name where the focus needs to be set.
     * @returns JSON of each passed field name and its valid status e.g {fieldName1:true, fieldName2:false}
     */
    setFocus: function(fieldName) {
        if (!this.formPanelRendered) {
            this.add_to_queue(this.setFocus, this, [fieldName]);
            return;
        }
        var compObj = null;
        if (fieldName != null) {
            compObj = this.findField(fieldName);
            if (compObj != null) {
                compObj.focus();
            }
        }
    },
    /**
				 * @Method isFieldValid
				 * @memberof "cbx.form.formManager" 
				 * @description Intended to validate one field available in the launched form. 
				 * @access public
				 * @param {String} fieldName The ITEM_ID of the field that needs to be validated
				 * @returns true if field valid and false if field is invalid
				 * @example
<pre>fm.isFieldValid('FIELD_NAME')</pre>
				 */
    isFieldValid: function(fieldName) {
        return this.isFieldsValid([fieldName])[fieldName];
    },
    /**
     * @Method findField
     * @memberof "cbx.form.formManager"
     * @description Private method, used to find required field by its name within the form panel and return it.
     * @access private
     * @param {String} fieldName Field which is needed to be search and whose Ext object is needed to be returned.
     */
    findField: function(fieldName) {
        var compObjArr = this.wrapperPanel.parentCt.findField("name", fieldName);
        if (compObjArr != null && compObjArr.length > 0) {
            return compObjArr[0];
        } else {
            return null;
        }
    },
    /**
				 * @Method setVisibleFields
				 * @memberOf "cbx.form.formManager"
				 * @description Intended to show/ hide any component rendered under this Form Manager instance
				 * @access public
				 * @param {Array} fileNames Array of fields that need to be shown/hide
				 * @param {Boolean} showFlag True to show, false to hide
				 * @param {String/Integer} index The index of the multiform at which the field is present if at all the field is a part of multiform.(Optional).
				 * @param {String} parent  The multiform id.(Optional).
				 * @example
<pre>
1.fm.setVisibleFields(['FLD1','FLD2'],true);
2.fm.setVisibleFields(['FLD1','FLD2'],true,2,'DEMO_MULTIFORM');
//The fields are present in the second index of the demo multi form
</pre>
				 */
    setVisibleFields: function(fieldNames, showFlag, index, parent) {
        if (!this.formPanelRendered) {
            if (fieldNames != null && cbx.isArray(fieldNames)) {
                for (var i = 0; i < fieldNames.length; i++) {
                    this.add_to_queue(this.setVisibleFields, this, [
                        [fieldNames[i]], showFlag, index,
                        parent
                    ]);
                }
            }
            return;
        }
        if (fieldNames != null && cbx.isArray(fieldNames)) {
            var compObj = null;
            for (var i = 0; i < fieldNames.length; i++) {
                if (!cbx.isEmpty(index) && !cbx.isEmpty(parent)) {
                    var subForm = this.findField(parent);
                    var compObj = subForm.findField(index, fieldNames[i]);
                    compObj.isFormField = true;
                } else {
                    compObj = this.findField(fieldNames[i]);
                }
                if (compObj != null) {
                    if (showFlag === true) {
                        if (compObj.showItem) {
                            compObj.showItem();
                        } else {
                            compObj.show();
                            if (compObj.doResize) {
                                compObj.doResize();
                            }
                        }
                    } else {
                        if (compObj.hideItem) {
                            compObj.hideItem();
                        } else {
                            compObj.hide();
                        }
                    }
                    if (this.wrapperPanel.ownerCt) {
                        this.wrapperPanel.ownerCt.doLayout();
                    } else {
                        if (this.wrapperPanel.parentCt && this.wrapperPanel.parentCt.doLayout) {
                            this.wrapperPanel.parentCt.doLayout();
                        }
                    }
                }
            }
        }
    },
    /**
				 * @Method setEnabledFields
				 * @memberOf "cbx.form.formManager"
				 * @description Intended to enable/ disable any component rendered under this Form Manager instance
				 * @access public
				 * @param {Array} fileNames Array of fields that need to be enabled/disabled
				 * @param {Boolean} showFlag True to show, false to hide
				 * @param {String/Integer} index The index of the multiform at which the field is present if at all the field is a part of multiform.(Optional).
				 * @param {String} parent  The multiform id.(Optional).
				 * @example
<pre>
1.fm.setEnabledFields([ 'AST_PAST_STATEMENT' ],true);
2.fm.setEnabledFields([ 'AST16_HISTRC_STATEMNT_MNTH' ],false,2,'DEMO_MULTI_FORM');
<pre>
				 * 
				 */
    setEnabledFields: function(fieldNames, enableFlag, index, parent) {
        if (!this.formPanelRendered) {
            if (fieldNames != null && cbx.isArray(fieldNames)) {
                for (var i = 0; i < fieldNames.length; i++) {
                    if (!cbx.isEmpty(index) && !cbx.isEmpty(parent)) {
                        this.add_to_queue(this.setEnabledFields, this, [
                            [fieldNames[i]], enableFlag,
                            index, parent
                        ]);
                    } else {
                        this.add_to_queue(this.setEnabledFields, this, [
                            [fieldNames[i]], enableFlag
                        ]);
                    }
                }
            }
            return;
        }
        if (fieldNames != null && cbx.isArray(fieldNames)) {
            var compObj = null;
            for (var i = 0; i < fieldNames.length; i++) {
                if (!cbx.isEmpty(index) && !cbx.isEmpty(parent)) {
                    var subForm = this.findField(parent);
                    var compObj = subForm.findField(index, fieldNames[i]);
                    compObj.isFormField = true;
                } else {
                    compObj = this.findField(fieldNames[i]);
                }
                if (!cbx.isEmpty(compObj)) {
                    if (enableFlag === true) {
                        compObj.enable();
                    } else {
                        compObj.disable();
                    }
                    this.doFormLayout(compObj.ownerCt);
                }
            }
        }
    },
    /**
				 * @Method markInvalid
				 * @memberOf "cbx.form.formManager"
				 * @access Inteded to mark a particular field invalid. The method will try searching for the resource bundle of
				 * the component to translate the msgKey. In case there is no bundle attached to the component, the
				 * method will try to retrieve it fromt he parent form panel otherwise it will take CRB.getFWBundleKey()
				 * as the bundle.
				 * @access public
				 * @param {String} fieldName Item id of the field name.
				 * @param {String} msgKey The key defined in the bundle of the component or in the bundle of the form or it will search in the framework bundle.If it is not present then it will show the key itself.
				 * So a developer can retreive the key from any bundle and pass the messsage also as msgKey.
				 * @param {String/Integer} index The index of the multiform at which the field is present if at all the field is a part of multiform.(Optional).
				 * @param {String} parent  The multiform id.(Optional).
				 *example
				 *<pre>
1.fm.markInvalid('DEMO_FIELD',"The demofield is invalid");//Hardcoded message
2.fm.markInvalid('DEMO_FIELD',CRB.getBundle('CASH')['DEMO_INVALID_MSG']);
//If value for DEMO_INVALID_MSG is defined in the cash property then it will be shown or undefined will be shown
3.fm.markInvalid('DEMO_FIELD','DEMO_INVALID_MSG');
//Assume that the bundle for the field or the form is CASH.So if the key is deifned in the cash properties
//then it will be shown or else DEMO_INVALID_MSG will be shown.
4.fm.markInvalid('DEMO_FIELD',CRB.getBundle('CASH')['DEMO_INVALID_MSG'],2,'DEMO_MULTIFORM');
//Item is in the second index of the multi form
</pre>
				 */
    markInvalid: function(fieldName, msgKey, index, parent) {
        if (!this.formPanelRendered) {
            if (!cbx.isEmpty(index) && !cbx.isEmpty(parent)) {
                this.add_to_queue(this.markInvalid, this, [fieldName, msgKey], index, parent);
            } else {
                this.add_to_queue(this.markInvalid, this, [fieldName, msgKey]);
            }
            return;
        }
        if (!cbx.isEmpty(index) && !cbx.isEmpty(parent)) {
            var subForm = this.findField(parent);
            var compObj = subForm.findField(index, fieldName);
            compObj.isFormField = true;
        } else {
            var compObj = this.findField(fieldName);
        }
        if (compObj != null && compObj.isFormField === true) {
            var bKey = CRB.getBundle(cbx.jsutil.getBundleKey(compObj));
            var msg = bKey['ERR_' + msgKey] || msgKey;
            if (compObj.doResize) {
                compObj.doResize();
            }
            compObj.markInvalid(msg);
        }
    },
    /**
				 * @Method removeForm
				 * @memberof "cbx.form.formManager"
				 * @description The following method has been added to bring a functionality of removing a form dynamically.
				 * The method should be used to remove any form which is added using addForm method
				 * @access public
				 * @param {String} formId The form Id
				 * @example
 <pre>
fm.removeForm("FORM_ID")
				 * <pre>
				 */
    removeForm: function(formId) {
        if (!this.formPanelRendered) {
            this.add_to_queue(this.removeForm, this, [formId]);
            return;
        }
        var compObj = this.findField(formId);
        if (compObj != null) {
            if (compObj.xtype == 'cbx-lazzyformpanel') {
                compObj.ownerCt.remove(compObj);
            }
        }
    },
    /**
				 * Intended to clear invalid marking of a specific form field.
				 * @memberof "cbx.form.formManager"
				 * @param {String} fieldName Item id of the field name.
				 * @param {String/Integer} index The index of the multiform at which the field is present if at all the field is a part of multiform.(Optional).
				 * @param {String} parent  The multiform id.(Optional).
				 *@example
				 *<pre>
1.fm.clearInvalid('DEMO_FIELD');
2.fm.clearInvalid('DEMO_FIELD',2,'DEMO_MULTIFORM');
//Item is in the second index of the multi form
</pre>
				 */
    clearInvalid: function(fieldName, index, parent) {
        if (!this.formPanelRendered) {
            this.add_to_queue(this.clearInvalid, this, [fieldName, index, parent]);
            return;
        }
        if (!cbx.isEmpty(index) && !cbx.isEmpty(parent)) {
            var subForm = this.findField(parent);
            var compObj = subForm.findField(index, fieldName);
            compObj.isFormField = true;
        } else {
            var compObj = this.findField(fieldName);
        }
        if (compObj != null && compObj.isFormField === true) {
            compObj.clearInvalid();
        }
    },
    /**
				 * @Method focus
				 * @memberof "cbx.form.formManager"
				 * @description Intended to set focus to a specific form field.
				 * @param {String} fieldName Item id of the field name.
				 * @param {String/Integer} index The index of the multiform at which the field is present if at all the field is a part of multiform.(Optional).
				 * @param {String} parent  The multiform id.(Optional).
				 * @example
<pre>
1.fm.focus('DEMO_FIELD');
2.fm.focus('DEMO_FIELD',2,'DEMO_MULTIFORM');
//Items is in the second index of the multi form
</pre>
				 */
    focus: function(fieldName, index, parent) {
        if (!this.formPanelRendered) {
            this.add_to_queue(this.focus, this, [fieldName, index, parent]);
            return;
        }
        if (!cbx.isEmpty(index) && !cbx.isEmpty(parent)) {
            var subForm = this.findField(parent);
            var compObj = subForm.findField(index, fieldName);
            compObj.parentCt.isFormField = true;
        } else {
            var compObj = this.findField(fieldName);
        }
        if (compObj != null && compObj.isFormField === true) {
            compObj.focus();
        }
    },
    /**
				 * @Method updateComboRawStore
				 * @memberof "cbx.form.formManager"
				 * @description Intended to update the combo with fieldname, keys and values supplied.Applicable for dropdown/itemselector/iconcombo/autosuggest/imagePanel.
				 * For image panel the keys will be te ids of the image and the values will be the src for the images.
				 * @memberof "cbx.form.formManager"
				 * @param {String} fieldName Item id of the field name.
				 * @param {Array} keyArray Array of keys.
				 * @param {Array} ValueArray Array of values for the drop down/Itemselector.
				 * @param {String/Integer} index The index of the multiform at which the field is present if at all the field is a part of multiform.(Optional).
				 * @param {String} parent  The multiform id.(Optional).
				 *example
				 *<pre>
1.fm.updateComboRawStore('DEMO_FIELD',['1','2','3'],'One','Two','Three');
2.fm.updateComboRawStore('DEMO_FIELD',['1','2','3'],'One','Two','Three',2,'DEMO_MULTIFORM');
//Items is in the second index of the multi form
</pre>
				 */
    updateComboRawStore: function(fieldName, keyArr, valueArr, index, parent) {
        if (!this.formPanelRendered) {
            this.add_to_queue(this.updateComboRawStore, this, [fieldName, keyArr, valueArr, index, parent]);
            return;
        }
        if (!cbx.isEmpty(index) && !cbx.isEmpty(parent)) {
            var subForm = this.findField(parent);
            var compObj = subForm.findField(index, fieldName);
        } else {
            var compObj = this.findField(fieldName);
        }
        // CTRBXQ115F10 End 09-06-2015
        if (compObj != null && compObj.updateComboRawStore) {
            /*MOBILITY Starts*/
            setTimeout(function() {
                compObj.updateComboRawStore(keyArr, valueArr);
            }, 100);
            /*MOBILITY Ends*/
        }
    },
    /**
				 * @Method setDisabledDates
				 * @memberof "cbx.form.formManager"
				 * @description Intended to update the date with fieldname, disabledDates and disabledDatesText supplied.
				 * @param {String} fieldName  Item Id of the date field.
				 * @param {String} disabledDates The array of the dates that needs to be dsiabled.All the dates should be supplied in dd/MM/YYYY format
				 * @param {String} disabledDatesText The custom text that needs to be shown on mouseover on each and individual date in the date calendar.
				 * @param {String/Integer} index The index of the multiform at which the date field is present if at all the date field is a part of multiform.(Optional)
				 * @param {String} parent  The multiform id.(Optional)
				 * @example
<pre>
1.fm.setDisabledDates('DEMO_DT',['1/05/2014','02/10/2014'],'National Holidays',2,'DEMO_MULTIFORM');
//The date field insecond index of the multiform
2.fm.setDisabledDates('DEMO_DT',['1/05/2014','02/10/2014'],'National Holidays');
//The field is not a part of multi form
</pre>
				 */
    setDisabledDates: function(fieldName, disabledDates, disabledDatesText, index, parent) {
        if (!this.formPanelRendered) {
            this.add_to_queue(this.setDisabledDates, this, [fieldName, disabledDates, disabledDatesText]);
            return;
        }
        if (!cbx.isEmpty(index) && !cbx.isEmpty(parent)) {
            var subForm = this.findField(parent);
            var compObj = subForm.findField(index, fieldName);
        } else {
            var compObj = this.findField(fieldName);
        }
        if (compObj != null && compObj.setDisabledDates) {
            compObj.setDisabledDates(disabledDates, disabledDatesText);
        }
    },
    /**
				 * @Method setDisabledDatesText
				 * @memberof "cbx.form.formManager"
				 * @description Intended to update the date field with fieldname and disabledDatesText supplied.
				 * @access public
				 * @param {String} fieldName  Item Id of the date field.
				 * @param {String} disabledDatesText The custom text that needs to be shown on mouseover on each and individual date in the date calendar.
				 * @param {String/Integer} index The index of the multiform at which the date field is present if at all the date field is a part of multiform.(Optional)
				 * @param {String} parent  The multiform id.(Optional)
				 * @example
<pre>1.fm.setDisabledDatesText('DEMO_DT','National Holidays',2,'DEMO_MULTIFORM');
//The date field in second index of the multiform
2.fm.setDisabledDatesText('DEMO_DT','National Holidays');
//The field is not a part of multi form
</pre>
				 */
    setDisabledDatesText: function(fieldName, disabledDatesText, index, parent) {
        if (!this.formPanelRendered) {
            this.add_to_queue(this.setDisabledDatesText, this, [fieldName, disabledDatesText, index,
                parent
            ]);
            return;
        }
        if (!cbx.isEmpty(index) && !cbx.isEmpty(parent)) {
            var subForm = this.findField(parent);
            var compObj = subForm.findField(index, fieldName);
        } else {
            var compObj = this.findField(fieldName);
        }
        if (compObj != null && compObj.setDisabledDatesText) {
            compObj.setDisabledDatesText(disabledDatesText);
        }
    },
    /**
     * @Method setMaxValue
     * @memberof "cbx.form.formManager"
     * @description Intended to update the date/spinner field with fieldname and maxValue supplied.For date field the value supplied will be in dd/MM/YYYY format
     * @access public
     * @param {String} fieldName  Item Id of the spinner field.
     * @param {String} keyValue The maximum value that needs to be set.
     * @param {String/Integer} index The index of the multiform at which the spinner/date is present if at all the spinner/date is a part of multiform.(Optional)
     * @param {String} parent  The multiform id.(Optional)
     */
    setMaxValue: function(fieldName, value, index, parent) {
        if (!this.formPanelRendered) {
            this.add_to_queue(this.setMaxValue, this, [fieldName, value, index, parent]);
            return;
        }
        if (!cbx.isEmpty(index) && !cbx.isEmpty(parent)) {
            var subForm = this.findField(parent);
            var compObj = subForm.findField(index, fieldName);
        } else {
            var compObj = this.findField(fieldName);
        }
        if (compObj != null && compObj.setMaxValue) {
            compObj.setMaxValue(value);
        }
    },
    /**
     * @Method setMinValue
     * @memberof "cbx.form.formManager" 
     * @description Intended to update the date/spinner field with fieldname and minValue supplied.For date field the value supplied will be in dd/MM/YYYY format
     * @access public
     * @param {String} fieldName  Item Id of the spinner field.
     * @param {String} keyValue The minimum value that needs to be set.
     * @param {String/Integer} index The index of the multiform at which the spinner/date is present if at all the spinner/date is a part of multiform(Optional).
     * @param {String} parent  The multiform id(Optional).
     */
    setMinValue: function(fieldName, value, index, parent) {
        if (!this.formPanelRendered) {
            this.add_to_queue(this.setMinValue, this, [fieldName, value, index, parent]);
            return;
        }
        if (!cbx.isEmpty(index) && !cbx.isEmpty(parent)) {
            var subForm = this.findField(parent);
            var compObj = subForm.findField(index, fieldName);
        } else {
            var compObj = this.findField(fieldName);
        }
        if (compObj != null && compObj.setMinValue) {
            compObj.setMinValue(value);
        }
    },
    /**
				 * @Method setDecimalPrecision
				 * @memberof "cbx.form.formManager"
				 * @descriptionSetting the decimal precision for the spinner field
				 * @access public
				 * @param {String} fieldName  Item Id of the spinner field
				 * @param {String} keyValue The decimal value that needs to be set
				 * @todo:Needs to be implemented if the spinner field is a part of multi form
				 * @example
<pre>fm.setDecimalPrecision('<FIELD_NAME>','<DECIMAL_PRECISION_VALUE>')</pre>
				 */
    setDecimalPrecision: function(fieldName, decimalPrecision) {
        if (!this.formPanelRendered) {
            this.add_to_queue(this.setDecimalPrecision, this, [fieldName, decimalPrecision]);
            return;
        }
        var compObj = this.findField(fieldName);
        if (compObj != null && compObj.setDecimalPrecision) {
            compObj.setDecimalPrecision(decimalPrecision);
        }
    },
    /**
     * @Method setDefaultValue
     * @memberof "cbx.form.formManager"
     * @description Setting the decimal value for the spinner field.Applicable for spinner field.
     * @access public
     * @param {String} fieldName  Item Id of the spinner field
     * @param {String} keyValue The decimal value that needs to be set
     * @param {String/Integer} index The index of the multiform at which the spinner is present if at all the spinner is a part of multiform
     * @param {String} parent  The multiform id
     * @example
     * <pre>To be done</pre>
     *   
     */
    setdefaultValue: function(fieldName, value, index, parent) {
        if (!this.formPanelRendered) {
            this.add_to_queue(this.setdefaultValue, this, [fieldName, value]);
            return;
        }
        if (!cbx.isEmpty(index) && !cbx.isEmpty(parent)) {
            var subForm = this.findField(parent);
            var compObj = subForm.findField(index, fieldName);
        } else {
            var compObj = this.findField(fieldName);
        }
        if (compObj != null && compObj.setdefaultValue) {
            compObj.setdefaultValue(value);
        }
    },
    /**
				 * @Method reloadData
				 * @memberof "cbx.form.formManager"
				 * @description Intended to request the component to reload its data. Currently used for reloading the Widget
				 * Components. This would be equivalent to user clicking refresh from the widget's tools.Applicable for widget panel.(Implemented for list views)
				 * @param {String} fieldName The item id of the listview which needs to be reloaded
				 * @access public
<pre>fm.reloadData('<ITEM_ID for the widgetpanel>')</pre>
				 */
    reloadData: function(fieldName) {
        if (!this.formPanelRendered) {
            this.add_to_queue(this.reloadData, this, [fieldName]);
            return;
        }
        var compObj = this.findField(fieldName);
        if (compObj != null && compObj.refreshWidgetData) {
            compObj.refreshWidgetData();
        }
    },
    /**
				 * @Method getDropDownDisplayValue
				 * @memberof "cbx.form.formManager"
				 * @description The method is intended to retun the display value for the corresponding key value of a dropdown.Applicable only for drop down
				 * @access public
				 * @param {String} fieldName  Item Id of the drop down
				 * @param {String} keyValue The key for which the value needs to be returned
				 * @param {String/Integer} index The index of the multiform at which the dropdown is present if at all the dropdown is a part of multiform
				 * @param {String} parent  The multiform id  
				 * @example
<pre> fm.getDropDownDisplayValue('DEMO_COMBO','1',3,'DEMO_MULTI_FORM');</pre> 
				 * 
				 * */
    getDropDownDisplayValue: function(fieldName, keyValue, index, parent) {
        if (!this.formPanelRendered) {
            this.add_to_queue(this.getDropDownDisplayValue, this, [fieldName, keyValue, index, parent]);
            return;
        }
        if (!cbx.isEmpty(fieldName) && !cbx.isEmpty(keyValue)) {
            if (!cbx.isEmpty(index) && !cbx.isEmpty(parent)) {
                var subForm = this.findField(parent);
                var fieldObj = subForm.findField(index, fieldName);
            } else {
                var fieldObj = this.findField(fieldName);
            }
            if (fieldObj != null && fieldObj.getDisplayValue) {
                return fieldObj.getDisplayValue(keyValue);
            }
        }
    },
    /**
     * @Method uploadReady
     * @memberof "cbx.form.formManager"
     * @description Intended to receive the total no of file count inside panel upload which all mainatined in queued
     * state
     * @access private
     * @returns {Array} 
     */
    uploadReady: function() {
        var compObjArrCount = this.wrapperPanel.parentCt.getUploadPanelCmp();
        var result = this.wrapperPanel.parentCt.getUploadPanelQueuedState(compObjArrCount);
        return result;
    },
    /**
     * @Method updateFileStatus
     * @memberof "cbx.form.formManager"
     * @description Intended to update the file status information for that component either the files are in queue or
     * failed or in success staus .The status information of the components are return as array with the
     * appropriate information. If the fieldNames are empty it is expected to return the status information
     * for all the file upload componnets list available in the form.
     * @access private
     * @param {Array} fieldNames Array of fields
     */
    updateFileStatus: function(fieldNames) {
        var compObjArrCount = this.wrapperPanel.parentCt.getUploadPanelCmp();
        var result = this.wrapperPanel.parentCt.getUploadPanelFileStatus(compObjArrCount, fieldNames);
        return result;
    },
    /**
				 * @Method resetUploadPanel
				 * @memberof "cbx.form.formManager"
				 * @description Intended to reset the files inside the panel upload components which all exists in the form.
				 * @access public
				 * @example
<pre>fm.resetUploadPanel()</pre>
				 */
    resetUploadPanel: function() {
        var compObjArrCount = this.wrapperPanel.parentCt.getUploadPanelCmp();
        var result = this.wrapperPanel.parentCt.resetUploadPanel(compObjArrCount);
        return result;
    },
    /**
				 * @Method clearUploadPanel
				 * @memberof "cbx.form.formManager"
				 * @description Intended to reset the files inside the panel upload components exists in the form with respect to array of fieldnames.
				 * @param {Array} fieldNames	The name of the file uploadpanels available in the current form manager scope.
				 * @access public
				 * @example
<pre>fm.clearUploadPanel(["FUPLD1","FUPLD2","FUPLD3"]);</pre>
				 */
    clearUploadPanel: function(fieldNames) {
        var compObjArrCount = this.wrapperPanel.parentCt.getUploadPanelCmp();
        var result = this.wrapperPanel.parentCt.clearUploadPanel(compObjArrCount, fieldNames);
        return result;
    },
    /**
     * @Method isUploadPanelValid
     * @memberof "cbx.form.formManager"
     * @description To validate the fileupload component ,if this component is mandatory and if the file queues are empty
     * then the component will be validated. This method should be invoked by developer explicitly to
     * @memberof "cbx.form.formManager"
     * @returns {Boolean}  True if the file upload panel  is valid otherwise returns false
     */
    isUploadPanelValid: function() {
        var compObjArrCount = this.wrapperPanel.parentCt.getUploadPanelCmp();
        var resultValid = this.wrapperPanel.parentCt.validateUploadPanel(compObjArrCount);
        return resultValid;
    },
    /**@Method uploadFile
				 * @memberof "cbx.form.formManager"
				 * @description Intended to upload the file in queued state and callbacks the appropriate handler invoked by
				 * developer to update the status.
				 * @param {String} state 
				 * @param {Function} handler CallBack handler which needs to be called after the file got uploaded in the temp location
				 * @access public
				 * @example
				 *<pre>
fm.uploadFile('state',function(params){
	if(params!==''){
	}
	var fileName=fm.model.getValue('BROWSE');
	if(fileName!=undefined){
		var fileType=fileName[0].filename;
		var fileExtLen=0;
		var fileExtLen = fileType.lastIndexOf(".");
		var fileFormatExt = fileType.substring(fileExtLen + 1);	
		if(fileFormatExt=='png' || fileFormatExt=='jpeg' || fileFormatExt=='jpg'
		 || fileFormatExt=='gif'){
			var param = {
			'INPUT_SUB_PRODUCT' : 'CUSER',
			'PAGE_CODE_TYPE': 'IMG_UPL',
			'PRODUCT_NAME': 'CUSER',
			'INPUT_PRODUCT': 'CUSER',
			'INPUT_FUNCTION_CODE': 'VSBLTY',
			'INPUT_ACTION': 'INIT_ACTION',
			'ATTACH_FILE_REFNO': fileName[0].attachmentRefNumber,
			'FILE_NAME': fileName[0].filename,
			'NEW_NAME': fileName[0].enryptedFileName
			};
		Ext.Ajax.request( {
			params : param,
			success : function(responseP, options) {
				var jsondataResponse = Ext.decode(responseP.responseText);
				if(jsondataResponse.SUBMIT_SUCCESS=='Y'){
					showConfirmMsgWin(rb[jsondataResponse.SUCCESS_MESSAGE]);
				}
			},
			failure : function(responseP, optionsP) {
			},
			scope : this
		});
	}else{
		showDialog(rb.LBL_INVALID_FILE);
	}
}else{
	showDialog(rb.LBL_UPLOAD_FILE);
}
});
</pre>
 */
    uploadFile: function(state, handler) {
        var fileQueues = this.uploadReady();
        this.wrapperPanel.parentCt.uploadFile(state, handler, fileQueues);
    },
    submitForm: function(md) {
        form = this.wrapperPanel.getComponent(0).getForm();
        formValObj = this.model.getModelData();
        var bundle = CRB.getFWBundle();
        var obj = form.getValues(false);
        var validForm = false;
        validForm = true;
        if (!validForm) {
            return false;
        }
        var paramObj = md.params;
        for (var index in paramObj) {
            formValObj[index] = paramObj[index];
        }
        cbx.ajax({
            params: formValObj,
            clientValidation: false,
            success: function(result) {
                var action = {},
                    form = null;
                action.result = result;
                if (action.result !== null) {
                    if (action.result.SUBMIT_SUCCESS !== null && action.result.SUBMIT_SUCCESS === 'Y') {
                        md.success(form, action);
                    } else if (!cbx.isEmpty(action.result.SIMULATION_SUCCESS_FLAG) && action.result.SIMULATION_SUCCESS_FLAG) {
                        md.success(form, action);
                    } else if (action.result.success !== null && action.result.success === 'false') {
                        md.failure(form, action);
                    }
                } else {
                    action['result'] = {};
                    action.result['ERR_MESS'] = [bundle['SYSTEM_ERROR']];
                    iportal.formelement.populateErrMsgWin(action, md.failure, form);
                }
            },
            failure: function(result, request) {
                var action = {};
                action.result = cbx.decode(result.responseText);
                if (action !== null && action.result !== null && cbx.encode(action.result) !== 'null') {
                    md.failure(form, action);
                } else {
                    action = (action === null) ? {} : action;
                    action['result'] = {};
                    action.result['ERR_MESS'] = bundle['SYSTEM_ERROR'];
                    iportal.formelement.populateErrMsgWin(action, md.failure, form);
                }
            }
        });
    },
    /**
     * @Method handlerContextResize
     * @memberof "cbx.form.formManager"
     * @description The method is registered as the handler for the resize even of the container of formView. This
     * method will recieve the new height of the container and set that to the tab panel that is marked as
     * the context container.
     * @access private
     */
    handlerContextResize: function(component, adjWidth, adjHeight, rawWidth, rawHeight) {
        if (component != null) {
            /**
             * If the bbar is not configured set the height of the container without including the bbar's
             * height.
             */
            var ht = this.wrapperPanel.ownerCt.getHeight();
            if (this.wrapperPanel.ownerCt.getFrameHeight() !== 0) {
                ht = ht - this.wrapperPanel.ownerCt.getFrameHeight();
            }
            this.contextContainer.setHeight(ht);
            this.doFormLayout(this.contextContainer);
        }
    },
    /**
     * @Method setContextContainer
     * @memberof "cbx.form.formManager"
     * @description The method to be used for setting the Context container. This method will be called by a Tab
     * Panel if its ctxContainerInd value is 'Y'. There can only be one context container for a form
     * manager. By default, this is the window in which the formView is rendered. In case the Tab Panel is
     * set to be context container, then then main form scrolling will be attached to the tab panel and tab
     * panel will resize to take the window's height and width. The method'd responsibility is to only
     * initiate the attachement process as per the rendered status of the wrapperPanel and rest would be
     * done by attachContextContainer Method.
     * @param {String } contextContainer contextContainer is the instance of the tab panel whose ctxContainerInd value is 'Y'
     * @access private
     */
    setContextContainer: function(contextContainer) {
        this.contextContainer = contextContainer;
        if (this.wrapperPanel.ownerCt) {
            this.attachContextContainer();
        } else {
            this.wrapperPanel.on("render", this.attachContextContainer, this);
        }
    },
    /**
     * @Method attachContextContainer
     * @memberof "cbx.form.formManager"
     * @see cbx.form.FormManager.setContextContainer
     * @access private
     */
    attachContextContainer: function() {
        var parentContext = this.contextContainer.findParentByType('cbx-tabpanel');
        if (parentContext != null) {
            return;
        }
        this.wrapperPanel.contextAvailable = true;
        /**
         * Returning from the function without attaching the top tab panel with // container size as IE
         * doesnt support dynamic resizing of height after // autoHeight is set to true
         */
        if (cbx.isIE6()) {
            return;
        }
        /**
         * Attaching listener to the resize event of the container of the formView
         */
        this.wrapperPanel.ownerCt.on('resize', this.handlerContextResize, this);
        /**
         * If the bbar is not configured set the height of the container without including the bbar's
         * height.
         */
        var ht = this.wrapperPanel.ownerCt.getHeight();
        if (this.wrapperPanel.ownerCt.getFrameHeight() !== 0) {
            ht = ht - this.wrapperPanel.ownerCt.getFrameHeight();
        }
        this.contextContainer.setHeight(ht);
        this.doFormLayout(this.contextContainer);
    },
    /**
     * @method isFormFieldsValid
     * @memberof "cbx.form.formManager"
     * @description The method will be used to validate the fields of any container object.Like fieldset,panel,sub form etc. 
     * @memberof "cbx.form.formManager"
     * @param {Object} config configuration of any container object like fieldset/panel etc
     * @access private
     */
    isFormFieldsValid: function(config) {
        var resultObj = {};
        var resultData = true;
        var firstField = null;
        var fieldNames = config.children;
        if (fieldNames != null && cbx.isArray(fieldNames)) {
            var compObj = null;
            for (var i = 0; i < fieldNames.length; i++) {
                compObj = this.findField(fieldNames[i].itemId);
                if (compObj != null && compObj.validate) {
                    resultObj[fieldNames[i]] = compObj.validate();
                    if (resultObj[fieldNames[i]] === false && firstField == null) {
                        resultData = false;
                    }
                }
            }
        }
        return resultData;
    },
    /**
				 * @Method reset
				 * @memberof "cbx.form.formManager"
			     * @description Intended to reset the form.
			     * @access public
				 * @example 
<pre>fm.reset();</pre> 
			 	*/
    reset: function() {
        this.resetSubForms();
        this.wrapperPanel.parentCt.reset();
        this.model.resetModelData();
    },
    redoLayout: function() {
        if (this.ownerCt) {
            this.wrapperPanel.ownerCt.doLayout();
        } else {
            this.wrapperPanel.doLayout();
        }
    },
    /**
				 * @Method clearValues
				 * @memberof "cbx.form.formManager"
			     * @description Intended to clear value of a specific form fields.If an extra flag has been passed as trye the value will
			     * gets reset.
			     * @param {Array/Object} fieldNames The array of the fieldNames which needs to be cleared or resetted.
			     * @param {Boolean} resetFlag The flag will be used to identify to clear or reset the flag
			     * @access pubic
				 * @example 
<pre>fm.clearValues(['DEMO_ONE','DEMO_TWO','DEMO_THREE'],true);//Resettting the fields.If only the 
//first parameter is passed then the instead of reseetting the values will be cleared.</pre>
			 	*/
    clearValues: function(fieldNames, resetFlag) {
        var valToSet = '';
        if (!this.formPanelRendered) {
            if (fieldNames != null && cbx.isArray(fieldNames)) {
                for (var i = 0; i < fieldNames.length; i++) {
                    this.add_to_queue(this.clearValues, this, [fieldNames[i]]);
                }
            }
            return;
        }
        if (fieldNames != null && cbx.isArray(fieldNames)) {
            var compObj = null;
            for (var i = 0; i < fieldNames.length; i++) {
                compObj = this.findField(fieldNames[i]);
                if (compObj != null && compObj.isFormField === true) {
                    compObj.value = valToSet;
                    this.model.setValue(fieldNames[i], valToSet);
                    this.screenView.updateScreenViewData(this.formId, fieldNames[i], valToSet);
                    if (cbx.isEmpty(resetFlag) || resetFlag == true) {
                        compObj.reset();
                    }
                }
            }
        }
    },
    doFormLayout: function(cmp) {
        if (cmp) {
            if (cmp.ownerCt) {
                cmp.ownerCt.doLayout();
            } else {
                cmp.doLayout();
            }
        } else if (this.ownerCt) {
            this.wrapperPanel.ownerCt.doLayout();
        } else {
            if (this.wrapperPanel && this.wrapperPanel.doLayout) {
                this.wrapperPanel.doLayout();
            }
        }
    },
    /**
				 * @Method getForm
				 * @memberof "cbx.form.formManager"
			     * @description The method is used to get the dom object of the form.
			     * @memberof "cbx.form.formManager"
			     * @returns {Object} The Form Panel
			     * @access pubic
				 * @example 
<pre>fm.getForm();</pre>
			 	*/
    getForm: function() {
        if (this.wrapperPanel.getForm) {
            return this.wrapperPanel.getForm();
        } else {
            return this.wrapperPanel.getComponent(0).getForm().getEl().dom;
        }
    },
    /**
				 * @Method addNext
				 * @memberof "cbx.form.formManager"
			     * @description The method is used to add a multiform Instance.If already n number of instance is there
			     * the form will be added in the n+1 th position
			     * @param {String} formId Form Id of the multi form
			     * @access pubic
				 * @example 
<pre>fm.addNext(2,'DEMO_MILTI_FORM');//Add an instance of DEMO_MULTI_FORM in the next index.</pre>
			 	*/
    addNext: function(formId) {
        if (!cbx.isEmpty(formId)) {
            var mForm = this.findField(formId);
            if (mForm.multiFormInd == true) {
                mForm.addNext();
            }
        } else {
            return;
        }
    },
    /**
				 * @Method removeAt
				 * @memberof "cbx.form.formManager"
			     * @description The method is used to remove the multiform instance at a particular index 
			     * @param {String} index Index at which the multiform instance needs to be removed
			     * @param {String} formId FormId of the multiform
			     * @pubic
				 * @example 
fm.removeAt(2,'DEMO_MILTI_FORM');//Remove the multiform at index 2
			 	*/
    removeAt: function(index, formId) {
        if (!cbx.isEmpty(index) && !cbx.isEmpty(formId) && isNaN(index) == true) {
            return;
        } else {
            var mForm = this.findField(formId);
            mForm.removeAt(index);
        }
    },
    /**
				 * @Method removeFrom
				 * @memberof "cbx.form.formManager"
			     * @description The method is used to remove the multiform instance starting from a particular index onwards 
			     * @memberof "cbx.form.formManager"
			     * @param {String} formId Form Id of the multiform.
			     * @param {String} start Starting Index of the multiform from where we want to remove the form.
			     * @param {String} end Ending Index of the multiform from where we want to remove the form.This end index concept is not implemented.Currently it will remove upto the last index.
			     * @pubic
				 * @example 
fm.removeFrom('DEMO_MILTI_FORM',4);//Remove all the form starting from the 4th index
				 * @todo The end index has to be implemented
			 	*/
    removeFrom: function(formId, start, end) {
        if (!cbx.isEmpty(formId) && !cbx.isEmpty(start) && isNaN(start) == false) {
            var mForm = this.findField(formId);
            mForm.removeFrom(start, end);
        }
    },
    /**
				 * @Method getNumberOfSubForms
				 * @memberof "cbx.form.formManager"
			     * @description The method is used to reset all the sub forms.
			     * 
			     * @param {String} formId To get the the number of the replica of the multiform i.e how many instance of the multiform is available
			     * in the screen
			     * @returns {Number} Number of the subforms available in the screen
			     * @access pubic
				 * @example 
fm.getNumberOfSubForms();
			 	*/
    getNumberOfSubForms: function(formId) {
        if (!cbx.isEmpty(formId)) {
            var mForm = this.findField(formId);
            /**
             * As the index will start from 0,for developer to under stand the number of sub form it has
             * been incremented tol one. Suppose I have two subforms which 3 items. Now the returned index
             * will be 2 because last index will be 2.i.e:[0,1,2]
             */
            return parseInt(mForm.items.length);
        } else {
            return;
        }
    },
    /**
				 * @Method resetSubForms
				 * @memberof "cbx.form.formManager"
			     * The method is used to reset all the sub forms.It can be used to reset the sub forms on click on the reset button.
			     * @memberof "cbx.form.formManager"
			     * @access pubic
				 * @example 
fm.resetSubForms();//Reset all the sub forms
			 	*/
    resetSubForms: function() {
        if (this.wrapperPanel.getComponent) {
            var subFormsArr = this.wrapperPanel.getComponent(0).find("multiFormInd", true);
        } else {
            var subFormsArr = this.wrapperPanel.parentCt.findSubForms();
        }
        for (var i = 0; i < subFormsArr.length; i++) {
            subFormsArr[i].reset();
        }
    },
    /**
				 * 
				 * @Method setlabel
				 * @memberof "cbx.form.formManager"
				 * 
			     * @description The method is used to set the dynamic label for a field.The label 
			     * 
			     * @param {String} fieldName The item id of the particular item.
			     * @param {String} label The label which needs to be set
			     * @pubic
				 * @example 
fm.setLabel('DEMO_ITEM','DEMO_LABEL');//Set the label of the itemid DEMO_ITEM to DEMO_LABEL.
//Instead of using a hard code label the same can be used from bundle.
				 *@todo This function has to be tested properly.Specially for setting the labels of the container(fieldset,panel),labels,
				 *some fields which is not a direct child of the parent form etc.It is recomanded not to use this function for 
				 *the containers and for some fields which is not a direct child of the parent form
			 	*/
    setLabel: function(fieldName, label) {
        if (!this.formPanelRendered) {
            this.add_to_queue(this.setLabel, this, [fieldName, label]);
            return;
        }
        if (!Ext.isEmpty(fieldName) && !Ext.isEmpty(label)) {
            var fieldObj = this.findField(fieldName);
            if (fieldObj != null && fieldObj.setFieldLabel) {
                fieldObj.setFieldLabel(label);
            }
        }
    },
    /**
     * @Method setAllowBlank
     * 
     * @memberof "cbx.form.formManager"
     * @description To be done
     * @example 
     * <pre>To be done</pre>
     */
    setAllowBlank: function(fieldName, validation) {
        if (!this.formPanelRendered) {
            this.add_to_queue(this.setMandatory, this, [fieldName, validation]);
            return;
        }
        if (!Ext.isEmpty(fieldName) && !Ext.isEmpty(validation)) {
            var fieldObj = this.findField(fieldName);
            if (fieldObj != null) {
                if (validation == false || validation == true) {
                    fieldObj.allowBlank = validation;
                }
            }
        }
    },
    /**
			     * @Method validateFields
			     * @memberof "cbx.form.formManager"
			     * @description The method is used to validate a particular field.
			     * @param {String} fieldName The item id of the particular item.
			     * @access public
				 * @example 
	fm.validateFields('DEMO_TEXTFIELD');//Validate the itemId DEMO_TEXTFIELD
			 	*/
    validateFields: function(fieldName) {
        if (!this.formPanelRendered) {
            this.add_to_queue(this.validateFields, this, [fieldName]);
            return;
        }
        if (!Ext.isEmpty(fieldName)) {
            var fieldObj = this.findField(fieldName);
            if (fieldObj != null && fieldObj.validate) {
                fieldObj.validate();
            }
        }
    },
    /**
				 * @Method exportForForms
				 * @memberof "cbx.form.formManager"
			     * @description The method is incharge of exporting the form content for printing or as PDF
			     * @param {String} exportType It currently supports two exportTypes. PDF/HTML
			     * @param {String} title The title of the form
				 * @example 
<pre>
{
id : 'print',
qtip : CRB.getFWBundle()['TOOL_TIPS_PRINT'],  
handler : function (){
		formObj.exportForForms('HTML',title); 
		}
}
</pre>
			 	*/
    exportForForms: function(exportType, title) {
        if (Ext.isEmpty(title)) {
            if (this.wrapperPanel.findParentByType('window')) {
                var frmwindow = this.wrapperPanel.findParentByType('window');
                frmwindow.focus();
                title = frmwindow.title;
            } else if (this.wrapperPanel.findParentByType('portlet')) {
                var widget = this.wrapperPanel.findParentByType('portlet');
                title = widget.title;
            }
        }
        this.screenView.updateWindowTitle(title);
        var task = new canvas.util.DelayedTask(function() {
            var svc = this.screenView.getFormScreenView();
            new cbx.form.FormExportManager().formExport(exportType, svc);
        }, this);
        task.delay(20)
    },
    /**
     *@Method addCssClass
     *@memberof "cbx.form.formManager"
     * @description Intended to add any component related Css Class under this Form Manager
     * instance
     * @param {Array} fileNames Array of fields that need to be add css
     * @param {String} clsName name of the css class
     */
    addCssClass: function(fieldNames, clsName, index, parent) {
        if (!this.formPanelRendered) {
            if (fieldNames != null && cbx.isArray(fieldNames)) {
                for (var i = 0; i < fieldNames.length; i++) {
                    this.add_to_queue(this.addCssClass, this, [
                        [fieldNames[i]], clsName, index,
                        parent
                    ]);
                }
            }
            return;
        }
        if (fieldNames != null && cbx.isArray(fieldNames)) {
            var compObj = null;
            for (var i = 0; i < fieldNames.length; i++) {
                if (!cbx.isEmpty(index) && !cbx.isEmpty(parent)) {
                    var subForm = this.findField(parent);
                    var compObj = subForm.findField(index, fieldNames[i]);
                    compObj.isFormField = true;
                } else {
                    compObj = this.findField(fieldNames[i]);
                }
                if (compObj != null) {
                    if (!cbx.isEmpty(clsName) && compObj.addClass) {
                        compObj.addClass(clsName);
                    }
                }
            }
        }
    },
    /**
     * @Methhod removeCssClass
     * @memberof "cbx.form.formManager"
     * @description Intended to remove any component related Css Class under this Form Manager
     * instance
     * 
     * @fileNames Array of fields that need to be remove css
     * @clsName name of the css class
     */
    removeCssClass: function(fieldNames, clsName, index, parent) {
        if (!this.formPanelRendered) {
            if (fieldNames != null && cbx.isArray(fieldNames)) {
                for (var i = 0; i < fieldNames.length; i++) {
                    this.add_to_queue(this.addCssClass, this, [
                        [fieldNames[i]], clsName, index,
                        parent
                    ]);
                }
            }
            return;
        }
        if (fieldNames != null && cbx.isArray(fieldNames)) {
            var compObj = null;
            for (var i = 0; i < fieldNames.length; i++) {
                if (!cbx.isEmpty(index) && !cbx.isEmpty(parent)) {
                    var subForm = this.findField(parent);
                    var compObj = subForm.findField(index, fieldNames[i]);
                    compObj.isFormField = true;
                } else {
                    compObj = this.findField(fieldNames[i]);
                }
                if (compObj != null) {
                    if (!cbx.isEmpty(clsName) && compObj.removeClass) {
                        compObj.removeClass(clsName);
                    }
                }
            }
        }
    },
    /**
     * Intended to update label for specific form level containers.
     * 
     * @fieldName Name of the container  whose fieldLabel to be changed.
     * @label label to be applied.
     */
    setPanelTitle: function(fieldName, title) {
        if (!this.formPanelRendered) {
            this.add_to_queue(this.setPanelTitle, this, [fieldName, title]);
            return;
        }
        if (!Ext.isEmpty(fieldName) && !Ext.isEmpty(title)) {
            var fieldObj = this.findField(fieldName);
            if (fieldObj != null && fieldObj.setTitle) {
                fieldObj.setTitle(title);
            }
        }
    },
    /**
     * Intended to get the focussed field else will return null
     */
    getFocussedField: function() {
        if (this.wrapperPanel && this.wrapperPanel.parentCt && this.wrapperPanel.parentCt.getFormPanel) {
            return (!cbx.isEmpty(this.wrapperPanel.parentCt.getFormPanel().lastFocussedField) ? this.wrapperPanel.parentCt.getFormPanel().lastFocussedField : "");
        } else {
            return "";
        }
    },
    /**
     * Intended to get the FieldDom
     */
    getFieldDom: function(fieldName) {
        if (!this.formPanelRendered) {
            this.add_to_queue(this.getFieldDom, this, [fieldName]);
            return;
        }
        if (!cbx.isEmpty(fieldName)) {
            var compObj = this.findField(fieldName);
            if (compObj != null && compObj.isFormField === true) {
                return compObj.el && compObj.el.dom ? compObj.el.dom : "";
            } else {
                return "";
            }
        } else {
            return "";
        }
	},
	raisePostFormRender: function(){
		if (this.register['cbxpostformrender' + "|" + this.formId] != null)
		{
			var obj = this.register['cbxpostformrender' + "|" + this.formId];
			obj.handler.apply(obj.mScope, [ this ]);
		}
	},
	/**
	 * Intended to get the count of store in a combo.
	 */
	getComboStoreCount: function(fieldName){
		if (!this.formPanelRendered) {
			this.add_to_queue(this.getComboStoreCount, this, [ fieldName ]);
			return;
		}
		if(!cbx.isEmpty(fieldName)){
			var compObj = this.findField(fieldName);
			if (compObj != null && compObj.getStoreCount) {
				return compObj.getStoreCount();
			}
		}
		return null;
    }
});