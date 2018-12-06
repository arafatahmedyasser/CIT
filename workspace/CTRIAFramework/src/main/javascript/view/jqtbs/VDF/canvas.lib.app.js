/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */

cbx.ns("canvas.lib");
/**
 * @namespace "canvas.lib"
 * @class 			canvas.lib.app
 * @extends	 		cbx.Observable
 * @description		This class is responsible for rendering the singular and multi apps 
 * 					by calling their respective components.
 * 					Also has initialised events, toolbar and global date for widgets and listeners for forms. 
 * 
 */
canvas.lib.app = Class(cbx.Observable, {
	
	/*
	 * 	multiappThroughPortlet -	Based on this value, the multiapps will be rendered.
	 * 								If true, multiapps will be rendered inside portlet.
	 * 								If false, it will be rendered outside portlet.
	 */
	multiappThroughPortlet :  { 'TAB'		: true,
								'CARD'		: true, 
	                            'INDEXED'	: true,
	                            'SWITCH'	: true,
	                          	'TWO-COLUMN': false,
	                          	'THREE-COL': false,
	                        	'EXPLORER'	: false,
	                            'STACK'		: false},
	                            
	 /**
	 * @constructor
	 * @memberof 	"canvas.lib.app"
	 * @param		config - Config contains the element id and other required parameters. It calls the appcontainer component class. 
	 */                          
	constructor : function (config)
	{
		cbx.core.extend(this, config);
		this.initialConfig = config;
		if (this.WIDGET_ID == null)
		{
			LOGGER.error("No WIDGET_ID is configured for the canvas.lib.app. Check the instance config object.");
			return;
		}
		canvas.lib.app.$super.call(this);
		
		this.requestMd();
	},

	/**
	 * @method 		requestMd
	 * @memberof 	"canvas.lib.app"
	 * @description Requests for the metadata of the widget/ app.
	 */
	requestMd : function ()
	{
		if (this.CONTAINER_FLAG === 'Y')
		{
			cbx.core.app.model.getMultiWidMetadata(this.WIDGET_ID, 1, this.initMultiAppManager, this,false);
		}
		else
		{
			cbx.core.app.model.getAppMetadata(this.WIDGET_ID, 1, this.initApp, this, true);
		}
	},

	/**
	 * @method 		initMultiAppManager
	 * @memberof 	"canvas.lib.app"
	 * @param		md - metadata for multiappmanager
	 * @description Based on the value of 'multiappThroughPortlet', the multiapps components are 
	 * 				initiated here.
	 */
	initMultiAppManager : function (md)
	{	
		var that = this;
		var layout = md.md.MULTI_WIDGET_MD.LAYOUT;
		CBXDOWNLOADMGR.requestScripts(cbx.downloadProvider.getConstant("MULTIAPP_"+layout+"_VIEW"),function(){

		if (that.multiappThroughPortlet[layout] == true)
		{

			that.initializeEvents();
			that.raiseEvent(CWEC.CTAPPBEFOREINITIALIZE);
			var clonedMD = cbx.clone(md);
			var config = {
				md : clonedMD,
				viewConf : that,
				rb : CRB.getBundle(md.md.MULTI_WIDGET_MD.WIDGET_BUNDLE_KEY)
			};
			cbx.core.extend(config, that.initialConfig);

			var portletclass = CLCR.getCmp({
				'COMP_TYPE' : 'PORTLET'
			});

			if (portletclass)
			{
				that.portlet = new portletclass(config);
				that.portlet.on('destroy', that.handleDestroy, that);
			}
		}
		else if (that.multiappThroughPortlet[layout] == false) {
			
			var clonedMD = cbx.clone(md);
			var config = {
				md : clonedMD,
				CHILD_WIDGETS : clonedMD.md.CHILD_WIDGETS,
				parent : that,
				parentelem : that.elem,
				layout : md.md.MULTI_WIDGET_MD.LAYOUT
			};
			
			new canvas.lib.multiapp(config);

		}else{
			
			LOGGER.error("The MultiApp Layout is not supported"+layout);
		}
	});
	},
	
	
	
	/**
	 * @method 		initApp
	 * @memberof 	"canvas.lib.app"
	 * @param		md - metadata for initmanager
	 * @description Initializes the component with the metadata and config.
	 */
	initApp : function (md)
	{
		try
		{
			var that=this;
			CBXDOWNLOADMGR.requestScripts(cbx.downloadProvider.getConstant(md.getViewType()+"_VIEW"),function(){
				var clonedMD = cbx.clone(md);
				var config = {
					md : clonedMD,
					viewConf : that,
					rb : CRB.getBundle(md.md.VIEW_MD.FLD_BUNDLE_KEY),
					renderView : that.renderView,
					renderGlobalDate : that.renderGlobalDate,
					renderToolBar : that.renderToolBar
				};
				cbx.core.extend(config, that.initialConfig);
	
				var portletclass = CLCR.getCmp({
					'COMP_TYPE' : 'PORTLET'
				});
	
				var cClass = CLCR.getCmp({
					'COMP_TYPE' : 'APP',
					'VIEW_TYPE' : md.getViewType()
				});
				if (md.getViewType() === 'FORM')
				{
					that.initializeFormLifeCycle();
					/*
					 * BO: registering formInitialize and formBeforeInitialize events, Start
					 *  
					 */
					that.registerListener(CWEC.FORM_INITIALIZE, that.forminitialized, that);
					that.registerListener(CWEC.FORM_BEFORE_INITIALIZE, that.formBeforeInitialize, that);
					/*
					 * BO: registering formInitialize and formBeforeInitialize events, End   
					 */
				} else
				{
					that.initializeEvents();
					that.raiseEvent(CWEC.CTAPPBEFOREINITIALIZE);
				}
	
				if (cClass)
				{
					that.portlet = new portletclass(config);
					that.portlet.on('destroy', that.handleDestroy, that);
				}
			});
		} catch (e)
		{
			LOGGER.error('Error While initiating the apps', e);
		}
	},
	
	/**
	 * @method 		renderView
	 * @memberof 	"canvas.lib.app"
	 * @param		config - metadata for renderView function
	 * @description Calls the respective app's js.
	 */
	renderView : function (config)
	{
		
		var parentPortlet= config.portlet
		if(this.parentPortlet){
			parentPortlet =this.parentPortlet
		}else{
			this.parentPortlet = config.portlet;
		}

		var cClass = CLCR.getCmp({
			'COMP_TYPE' : 'APP',
			'VIEW_TYPE' : config.md.getViewType()
		});
		config.parentPortlet = parentPortlet;
		if(config.md.getViewType() == 'CHART'){//chart changes
			config["viewConf"]["VIEW_MD"] = config.md.md.VIEW_MD;
			config["graphViewId"] = config.viewConf.WIDGET_ID;
			config["viewConf"]["widgetID"] = config.viewConf.WIDGET_ID;
			config['mvConf'] = {};
			config['mvConf']['el'] = config.elem[0];
			config['mvConf']['el']['id'] = config.graphViewId+"_"+config.viewConf.VIEW_MD.VIEW_ID+"_CHART_CONTAINER";
			config.mvConf.id = config.mvConf.el.id;
			config['mvConf']['clientWidth'] = config.elem[0].clientWidth;
			config['mvConf']['clientHeight'] = config.elem[0].clientWidth/2 >300? "300" : config.elem[0].clientWidth/2;
		} else if(config.md.getViewType() == 'FORM') {
			/*
			 * BO: adding app event registry to the view, Starts
			 */
			var eventConf = {
						"viewType":config.md.md.VIEW_MD.FLD_VIEW_TYPE,
						"widgetId": config.viewConf.WIDGET_ID,
						'viewId':config.md.md.VIEW_MD.VIEW_ID
						};
			var appEvents = new canvas.core.appEventRegistry(eventConf);
			
			
			config["widgetId"] = config.viewConf.WIDGET_ID
			config["formId"] = config.md.md.VIEW_MD.FLD_DATA_SRC_ID
			config["appEvents"] = appEvents;
			/*
			 * BO: adding app event registry to the view, Ends
			 */
		}
		this.renderer = new cClass(config);
		
		this.renderer.on('destroy', this.handleDestroy, this);
		this.widgetContianer = iportal.workspace.metadata.getCurrentWorkspace().getWidgetContainer();
		
		/*
		 * BO: Check done for preventing new instance creation of appMVRegistry if present ,Starts
		 */
		if(this.widgetContianer.appMVRegistry){
			this.appMVReg = this.widgetContianer.appMVRegistry;
		}else{
			this.appMVReg = new canvas.core.communication.appMVRegistry();
		}
		this.appMVReg.registerWidget(this.initialConfig.WIDGET_ID,this.renderer);//widetID
		/*
		 * BO: Check done for preventing new instance creation of appMVRegistry if present ,Ends
		 */
		
		if (parentPortlet)
		{
			parentPortlet.renderer = this.renderer;
			parentPortlet.updatePortletHeaderFooter(config.md);	
		}

		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.INIT_APP);
		if (cbx.core.isFunction(fn))
		{
			fn.apply(this, [ this ]);
		}
	},
	
	/**
	 * @method 		renderToolBar
	 * @memberof 	"canvas.lib.app"
	 * @param		config - metadata for rendertoolbar function
	 * @description To render the toolbar of widget.
	 * 				The toolbar contains form for the corresponding widget.
	 */
	renderToolBar : function(config) 
	{
		var renderEle = config.elem;
		if(!cbx.isEmpty( config.md.md.VIEW_MD.FLD_TBAR_BUTTONS)) {
			var formId = config.md.md.VIEW_MD.FLD_TBAR_BUTTONS.TBAR_CONFIG[0].FORM_ID;				
			CBXDOWNLOADMGR.requestScripts(cbx.downloadProvider.getMergedArray([ "FORM_FRAMEWORK" ]), function (){
				var fm = new cbx.form.FormManager({
					formId : formId
				});	
				$(renderEle).append(fm.getFormView());
			});
		}
	},
	
	/**
	 * @method 		renderGlobalDate
	 * @memberof 	"canvas.lib.app"
	 * @param		config - metadata for renderglobaldate function
	 * @description To render the global date filter of widget.
	 */
	renderGlobalDate : function (config)
	{
		var that = this;
		var renderEle = config.elem;

		CBXDOWNLOADMGR.requestScripts(cbx.downloadProvider.getMergedArray(["GLOBAL_DATE_FILTER", "FORM_FRAMEWORK"]), function (){
			var viewID = config.md.md.VIEWS_LIST[0].VIEW_ID;
			var defaultFilterValue = " ";
			var columnName = null;
			var columnId = null;
			var frmManger = null;
			var minDate = "";
			var maxDate = "";
			var flag = null;
			var maxSelectionPeriodUnit = null; 
			var maxSelectionPeriodValue = null;
			var globalMinDate = null;
			var columnId = null;
			if (config.md.md.VIEW_MD.FLD_GLOBAL_DATE_FILTER_IND == 'Y') {
				if(config.md.md.VIEW_MD.FLD_POSSIBLE_DATE_FILTERS.length != 0){
					for (var i=0, len=config.md.md.VIEW_MD.FLD_POSSIBLE_DATE_FILTERS.length;i<len;i++ ){
						if("Y" === config.md.md.VIEW_MD.FLD_POSSIBLE_DATE_FILTERS[i].IS_DEFAULT_FILTER){
							var from_date = config.md.md.VIEW_MD.FLD_POSSIBLE_DATE_FILTERS[i].FROM_DATE || '';
							var to_date = config.md.md.VIEW_MD.FLD_POSSIBLE_DATE_FILTERS[i].TO_DATE || '';
							defaultFilterValue = from_date + '|' + to_date +'|'+i;
						}	
						else if(config.md.md.VIEW_MD.FLD_POSSIBLE_DATE_FILTERS[i].FROM_DATE === '-1'){
							flag = i;
						}
					}
					if(defaultFilterValue === ""){
						if(flag != null){
							var from_date = config.md.md.VIEW_MD.FLD_POSSIBLE_DATE_FILTERS[i].FROM_DATE || '';
							var to_date = config.md.md.VIEW_MD.FLD_POSSIBLE_DATE_FILTERS[i].TO_DATE || '';
							defaultFilterValue = from_date + '|' + to_date +'|'+flag;
						}
					}
					columnId = config.md.md.VIEW_MD.FLD_POSSIBLE_DATE_FILTERS[0].COLUMN_ID;	
					for(var i=0; i< config.md.md.VIEW_MD.FLD_COLUMN_LIST.length; i++){
						if(columnId == config.md.md.VIEW_MD.FLD_COLUMN_LIST[i].FLD_COLUMN_ID){
							var columnNmKey = config.md.md.VIEW_MD.FLD_COLUMN_LIST[i].FLD_COLUMN_DISPLAY_NAME_KEY;
							columnName = CRB.getBundle(config.md.md.VIEW_MD.FLD_BUNDLE_KEY)['LBL_'+columnNmKey];
						}							
					}						
				}
				if(config.md.md.VIEW_MD.FLD_DATE_FILTERS_RANGE.length !=0){
					minDate = config.md.md.VIEW_MD.FLD_DATE_FILTERS_RANGE[0].MIN_DATE;
					maxDate = config.md.md.VIEW_MD.FLD_DATE_FILTERS_RANGE[0].MAX_DATE;
					maxSelectionPeriodValue = config.md.md.VIEW_MD.FLD_DATE_FILTERS_RANGE[0].MAX_SELECTION_PERIOD_VAL ? config.md.md.VIEW_MD.FLD_DATE_FILTERS_RANGE[0].MAX_SELECTION_PERIOD_VAL : "",
					maxSelectionPeriodUnit = config.md.md.VIEW_MD.FLD_DATE_FILTERS_RANGE[0].MAX_SELECTION_PERIOD_UNIT ? config.md.md.VIEW_MD.FLD_DATE_FILTERS_RANGE[0].MAX_SELECTION_PERIOD_UNIT : "",
					globalMinDate=config.md.md.VIEW_MD.FLD_DATE_FILTERS_RANGE[0].GLOBAL_MIN_DATE ? config.md.md.VIEW_MD.FLD_DATE_FILTERS_RANGE[0].GLOBAL_MIN_DATE : ""
				}	
				var globalDateFilterObject = {
					"VIEW_ID":viewID,
					"WIDGET_ID":config.md.WIDGET_ID,
					"DEFAULT_FILTER_VALUE":defaultFilterValue,
					"COLUMN_DISP_NAME_KEY" :columnName,
					"MIN_DATE": minDate,
					"MAX_DATE": maxDate,
					"COLUMN_ID":columnId,
					"MAX_SELECTION_PERIOD_UNIT": maxSelectionPeriodUnit,
					"MAX_SELECTION_PERIOD_VALUE": maxSelectionPeriodValue,
					"GLOBAL_MIN_DATE":globalMinDate
				};
				that.ignoreFormPanel = false;
				that.mvh = config.portlet;
				frmManger = cbx.globaldatefilterform.filterPanelForm(that,globalDateFilterObject);
				$(renderEle).append(frmManger.getFormView());
			}
		});
	},

	/**
	 * @method 		initializeFormLifeCycle
	 * @memberof 	"canvas.lib.app"
	 * @description Initialises the listeners for form components.
	 */
	initializeFormLifeCycle : function ()
	{
		this.isFormView = true;
		var cClass = CLCR.getCmp({
			'COMP_TYPE' : 'LISTENER',
			'WIDGET_ID' : this.WIDGET_ID
		});
		if (cClass)
		{
			var config = {
				fm : this
			};
			this.listener = new cClass(config);
		}
		if (this.listener)
		{
			this.initializeFormEvents();
		}
	},

	/**
	 * @method 		initializeFormEvents
	 * @memberof 	"canvas.lib.app"
	 * @description Initialises the events for form components.
	 */
	initializeFormEvents : function ()
	{
		this.registerListener(CWEC.FORM_LOADED, function ()
		{
			this.listener.raiseEvent(this.WIDGET_ID, CWEC.FORM_LOADED);
		}, this);

		this.registerListener(CWEC.CBX_CHANGE, function (itemId, value)
		{
			this.listener.raiseEvent(itemId, CWEC.CBX_CHANGE, value);
		}, this);

		this.registerListener(CWEC.CBX_CLICK, function (itemId)
		{
			this.listener.raiseEvent(itemId, CWEC.CBX_CLICK);
		}, this);
	},

	/**
	 * @method 		handleDestroy
	 * @memberof 	"canvas.lib.app"
	 * @description Calls the handler to destroy apps.
	 */
	handleDestroy : function ()
	{
		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.DESTROY_APP);
		if (cbx.core.isFunction(fn))
		{
			fn.apply(this, []);
		}
		this.destroy();
	},

	/**
	 * @method 		initializeEvents
	 * @memberof 	"canvas.lib.app"
	 * @description Listeners for the registered events are called here.
	 */
	initializeEvents : function ()
	{
		this.registerListener(CWEC.CELL_CLICK, this.cellClickHandler, this);
		this.registerListener(CWEC.SINGLE_CLICK, this.cellSingleClickHandler, this);
		this.registerListener(CWEC.CELL_DBLCLICK, this.cellDblClickHandler, this);
		this.registerListener(CWEC.ROW_CLICK, this.rowClickHandler, this);
		this.registerListener(CWEC.ROW_DBLCLICK, this.rowDblClickHandler, this);
		this.registerListener(CWEC.BBUT_CLICK, this.bbutClickHandler, this);
		this.registerListener(CWEC.SELECTION_CHANGE, this.selectionChangeHandler, this);
		this.registerListener(CWEC.DRILL_DOWN, this.drillDownClickHandler, this);
		this.registerListener(CWEC.CELL_ACTION, this.cellActionClickHandler, this);
		this.registerListener(CWEC.CONTEXT_CLICK, this.contextClickHandler, this);
		this.registerListener(CWEC.EXTRA_PARAMS_HDLR, this.extraParamsHandler, this);
		this.registerListener(CWEC.GET_BUNDLE, this.getBundle, this);
		this.registerListener(CWEC.CELL_DATA_CHANGE, this.cellDataChangeHandler, this);
		this.registerListener(CWEC.FORM_MODE, this.getFormMode, this);
		this.registerListener(CWEC.CHILD_ACTIVATE, this.handleActivate, this);
		this.registerListener(CWEC.CHILD_DEACTIVATE, this.handleDeactivate, this);
		this.registerListener(CWEC.AFTER_TEMPLATE_LOAD, this.templateLoadHandler, this);
		this.registerListener(CWEC.DATA_LOADED, this.handleDataLoaded, this);
		this.registerListener(CWEC.BEFORE_LOAD, this.beforeLoadHandler, this);
		this.registerListener(CWEC.DATA_MOD, this.dataModifiedClickHandler, this);
		this.registerListener(CWEC.VERIFY_DATE, this.verifyDateClickHandler, this);
		this.registerListener(CWEC.TREE_CLICK, this.treeClickHandler, this);
		this.registerListener(CWEC.WGT_EXPAND, this.widgetexpand, this); //Checked
		this.registerListener(CWEC.WGT_COLLAPSED, this.widgetcollapsed, this); //Checked
		this.registerListener(CWEC.GP_CONT_MENU_CLICK, this.groupcontextmenuclick, this);
		this.registerListener(CWEC.GP_DBL_CLICK, this.groupdoubleclick, this);
		this.registerListener(CWEC.DESTROY_APP, this.handleDestroy, this);	// Done
		this.registerListener(CWEC.CTAPPBEFOREINITIALIZE, this.ctappbeforeinitialize, this);
		this.registerListener(CWEC.CTAPPONDESTROY, this.ctappondestroy, this);
		this.registerListener(CWEC.PREF_CHNG, this.preferencechange, this);
		this.registerListener(CWEC.VIEW_CHANGE, this.viewchange, this);
	},

	/*
	 * 	The handlers for events registered are called here..
	 */

	/*
	 * BO: forminitialized and formbeforeinitialize listeners invokes their registered implementation functions, starts
	 */
	
	forminitialized:function(){
		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.FORM_INITIALIZE);
		if (cbx.core.isFunction(fn))
		{
			fn.apply(this, arguments);
		}
	},
	
	formBeforeInitialize:function(){
		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.FORM_BEFORE_INITIALIZE);
		if (cbx.core.isFunction(fn))
		{
			fn.apply(this, arguments);
		}
	},
	
	/*
	 * BO: forminitialized and formbeforeinitialize listeners invokes their registered implementation functions, ends
	 */
	
	/*
	 * To be used..
	 */
	/**
	 * @method 		viewchange
	 * @memberof 	"canvas.lib.app"
	 * @description Listeners for the registered events are called here.
	 */
	viewchange :  function(){
		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.VIEW_CHANGE);
		if (cbx.core.isFunction(fn))
		{
			fn.apply(this, arguments);
		}
	},
	
	/*
	 * To be used..
	 */
	/**
	 * @method 		preferencechange
	 * @memberof 	"canvas.lib.app"
	 * @description Listeners for the registered events are called here.
	 */
	preferencechange :  function(){
		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.PREF_CHNG);
		if (cbx.core.isFunction(fn))
		{
			fn.apply(this, arguments);
		}
	},
	
	/*
	 * To be used..
	 */
	/**
	 * @method 		ctappondestroy
	 * @memberof 	"canvas.lib.app"
	 * @description Function to handle APPONDESTROY event.
	 */
	ctappondestroy :  function(){
		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.CTAPPONDESTROY);
		if (cbx.core.isFunction(fn))
		{
			fn.apply(this, arguments);
		}
	},
	
	/*
	 * To be used..
	 */
	/**
	 * @method 		ctappbeforeinitialize
	 * @memberof 	"canvas.lib.app"
	 * @description Function to handle CTAPPBEFOREINITIALIZE event.
	 */
	ctappbeforeinitialize :  function(){
		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.CTAPPBEFOREINITIALIZE);
		if (cbx.core.isFunction(fn))
		{
			fn.apply(this, arguments);
		}
	},
	
	/*
	 * To be used..
	 */
	/**
	 * @method 		groupdoubleclick
	 * @memberof 	"canvas.lib.app"
	 * @description Function to handle GP_DBL_CLICK event.
	 */
	groupdoubleclick :  function(){
		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.GP_DBL_CLICK);
		if (cbx.core.isFunction(fn))
		{
			fn.apply(this, arguments);
		}
	},
	
	/**
	 * @method 		groupcontextmenuclick
	 * @memberof 	"canvas.lib.app"
	 * @description Function to handle GP_CONT_MENU_CLICK event.
	 */
	groupcontextmenuclick :  function(){
		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.GP_CONT_MENU_CLICK);
		if (cbx.core.isFunction(fn))
		{
			fn.apply(this, arguments);
		}
	},
	
	/**
	 * @method 		widgetcollapsed
	 * @memberof 	"canvas.lib.app"
	 * @description Function to handle WGT_COLLAPSED event.
	 */
	widgetcollapsed :  function(){
		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.WGT_COLLAPSED);
		if (cbx.core.isFunction(fn))
		{
			fn.apply(this, arguments);
		}
	},
	
	/**
	 * @method 		widgetexpand
	 * @memberof 	"canvas.lib.app"
	 * @description Function to handle WGT_EXPAND event.
	 */
	widgetexpand :  function(){
		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.WGT_EXPAND);
		if (cbx.core.isFunction(fn))
		{
			fn.apply(this, arguments);
		}
	},
	
	/**
	 * @method 		treeClickHandler
	 * @memberof 	"canvas.lib.app"
	 * @description Function to handle TREE_CLICK event.
	 */
	treeClickHandler : function(){
		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.TREE_CLICK);
		if (cbx.core.isFunction(fn))
		{
			fn.apply(this, arguments);
		}
	},
	
	/**
	 * @method 		cellSingleClickHandler
	 * @memberof 	"canvas.lib.app"
	 * @description Function to handle SINGLE_CLICK event.
	 */
	cellSingleClickHandler : function ()
	{
		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.SINGLE_CLICK);
		if (cbx.core.isFunction(fn))
		{
			fn.apply(this, arguments);
		}
	},
	
	/*
	 * To be used..
	 */
	/**
	 * @method 		verifyDateClickHandler
	 * @memberof 	"canvas.lib.app"
	 * @description Function to handle VERIFY_DATE event.
	 */
	verifyDateClickHandler : function ()
	{
		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.VERIFY_DATE);
		if (cbx.core.isFunction(fn))
		{
			fn.apply(this, arguments);
		}
	},
	
	/**
	 * @method 		dataModifiedClickHandler
	 * @memberof 	"canvas.lib.app"
	 * @description Function to handle DATA_MOD event.
	 */
	dataModifiedClickHandler : function ()
	{
		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.DATA_MOD);
		if (cbx.core.isFunction(fn))
		{
			fn.apply(this, arguments);
		}
	},
	
	/**
	 * @method 		beforeLoadHandler
	 * @memberof 	"canvas.lib.app"
	 * @description Function to handle BEFORE_LOAD event.
	 */
	beforeLoadHandler : function ()
	{
		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.BEFORE_LOAD);
		if (cbx.core.isFunction(fn))
		{
			fn.apply(this, arguments);
		}
	},
	
	/**
	 * @method 		cellDblClickHandler
	 * @memberof 	"canvas.lib.app"
	 * @description Function to handle CELL_DBLCLICK event.
	 */
	cellDblClickHandler : function ()
	{
		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.CELL_DBLCLICK);
		if (cbx.core.isFunction(fn))
		{
			fn.apply(this, arguments);
		}
	},
	
	/**
	 * @method 		rowDblClickHandler
	 * @memberof 	"canvas.lib.app"
	 * @description Function to handle ROW_DBLCLICK event.
	 */
	rowDblClickHandler : function ()
	{
		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.ROW_DBLCLICK);
		if (cbx.core.isFunction(fn))
		{
			fn.apply(this, arguments);
		}
	},
	
	/**
	 * @method 		cellClickHandler
	 * @memberof 	"canvas.lib.app"
	 * @description Function to handle CELL_CLICK event.
	 */
	cellClickHandler : function ()
	{
		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.CELL_CLICK);
		if (cbx.core.isFunction(fn))
		{
			fn.apply(this, arguments);
		}
	},
	
	/**
	 * @method 		rowClickHandler
	 * @memberof 	"canvas.lib.app"
	 * @description Function to handle ROW_CLICK event.
	 */
	rowClickHandler : function ()
	{
		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.ROW_CLICK);
		if (cbx.core.isFunction(fn))
		{
			fn.apply(this, arguments);
		}
	},
	
	/**
	 * @method 		bbutClickHandler
	 * @memberof 	"canvas.lib.app"
	 * @description Function to handle BBUT_CLICK event.
	 */
	bbutClickHandler : function ()
	{
		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.BBUT_CLICK);
		if (cbx.core.isFunction(fn))
		{
			fn.apply(this, arguments);
		}
	},

	/**
	 * @method 		drillDownClickHandler
	 * @memberof 	"canvas.lib.app"
	 * @description Function to handle DRILL_DOWN event.
	 */
	drillDownClickHandler : function ()
	{
		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.DRILL_DOWN);
		if (cbx.core.isFunction(fn))
		{
			fn.apply(this, arguments);
		}
	},

	/**
	 * @method 		templateLoadHandler
	 * @memberof 	"canvas.lib.app"
	 * @description Function to handle AFTER_TEMPLATE_LOAD event.
	 */
	templateLoadHandler : function ()
	{
		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.AFTER_TEMPLATE_LOAD);
		if (cbx.core.isFunction(fn))
		{
			fn.apply(this, arguments);
		}
	},

	/**
	 * @method 		contextClickHandler
	 * @memberof 	"canvas.lib.app"
	 * @description Function to handle CONTEXT_CLICK event.
	 */
	contextClickHandler : function ()
	{
		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.CONTEXT_CLICK);
		if (cbx.core.isFunction(fn))
		{
			fn.apply(this, arguments);
		}
	},

	/**
	 * @method 		extraParamsHandler
	 * @memberof 	"canvas.lib.app"
	 * @description Function to handle EXTRA_PARAMS_HDLR event.
	 */
	extraParamsHandler : function ()
	{
		
		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.EXTRA_PARAMS_HDLR);
		if (cbx.core.isFunction(fn))
		{
			return fn.apply(this, arguments);
		}
	},

	/**
	 * @method 		handleDataLoaded
	 * @memberof 	"canvas.lib.app"
	 * @description Function to handle DATA_LOADED event.
	 */
	handleDataLoaded : function ()
	{
		var fn = CWEH.getHandler(this.WIDGET_ID, CWEC.DATA_LOADED);
		if (cbx.core.isFunction(fn))
		{
			return fn.apply(this, arguments);
		}
	},

	/**
	 * @method 		setValue
	 * @memberof 	"canvas.lib.app"
	 * @param		itemId - The item id of the component.
	 * 				value - The value given for the corresponding componenent in DB.
	 * @description Sets the value to the component based on item id.
	 */
	setValue : function (itemId, value)
	{
		this.renderer.setValue(itemId, value);
	},

	/**
	 * @method 		getItem
	 * @memberof 	"canvas.lib.app"
	 * @param		itemId - The item id of the component.
	 * @description Get the item using the item id.
	 */
	getItem : function (itemId)
	{
		return this.renderer.findField(itemId);
	},

	/**
	 * @method 		updateComboRawStore
	 * @memberof 	"canvas.lib.app"
	 * @params		itemId - The item id of the component.
	 * 				labelArr - The label aray from the 'keys' column in DB.
	 * 				valueArr - The value array from the 'values' column in DB.
	 * @description Listeners for the registered events are called here.
	 */
	updateComboRawStore : function (itemId, labelArr, valueArr)
	{
		this.renderer.updateComboRawStore(itemId, labelArr, valueArr);
	},

	/**
	 * @method 		markInvalid
	 * @memberof 	"canvas.lib.app"
	 * @params		itemId - The item id of the component.
	 * 				errMsg - The error msg that has to be displayed in the application.
	 * @description An 'Invalid' or 'Error' symbol is shown.
	 */
	markInvalid : function (itemId, errMsg)
	{
		this.renderer.markInvalid(itemId, errMsg);
	},

	/**
	 * @method 		clearInvalid
	 * @memberof 	"canvas.lib.app"
	 * @params		itemId - The item id of the component.
	 * 				errMsg - The error msg that has to be displayed in the application.
	 * @description Clears the 'Invalid' or 'Error' symbol.
	 */
	clearInvalid : function (itemId, errMsg)
	{
		this.renderer.clearInvalid(itemId);
	},

	/**
	 * @method 		getRecords
	 * @memberof 	"canvas.lib.app"
	 * @description Returns the list of records.
	 */
	getRecords : function ()
	{
		if (this.renderer && this.renderer.getRecords)
		{
			return this.renderer.getRecords();
		}
	}
});
