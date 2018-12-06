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
/* 
 * Widgetization of Lookup
 * Widget Created in runtime For the LookUp Component
 * The super class for all the lookups for iportal. Every lookups rendering directly
 * into window when the button of editable lookup is clicked.
 * @class iportal.Lookup
 * @extends iportal.Widget
 */


Ext.ns("cbx.widget");// Define the namespace for the widget



cbx.widget.manager = Ext.extend(iportal.Widget, {

	constructor : function(config) {
		this.svcch = null;
		cbx.widget.manager.superclass.constructor.call(this, config);
		Ext.apply(this, config);
		this.mv = new iportal.view.MultiView({
			id : config.WIDGET_ID,
			versionNo:config.VER_NO,
			extraParamsHandler : this.getHandler('extraParamsHandler'),
			services : CWSH.getServiceList(config.WIDGET_ID),
			listeners:{
				'cellclick':this.getHandler('cellclick'),
				'viewchange':this.getHandler('viewchange'),
				'contextclick':this.getHandler('contextclick'),
				'drilldown':this.getHandler('drilldown'),
				'preferencechange':this.getHandler('preferencechange'),
				'bbuttonclick':this.getHandler('bbuttonclick'),
				'treeclick':this.getHandler('treeclick'),
				'treecontextclick':this.getHandler('treecontextclick'),       // added for tree context click
				'nodeClick':this.getHandler('nodeClick'),
				'flowClick':this.getHandler('flowClick'),
				'widgetexpand':this.getHandler('widgetexpand'),
				'dataModified':this.getHandler('dataModified'),
				'groupcontextmenuclick':this.getHandler('groupcontextmenuclick'),
				'groupdoubleclick':this.getHandler('groupdoubleclick'),
				'cellsingleclick':this.getHandler('cellsingleclick'),
				'highlight':this.getHandler('highlight'),
				'ctappbeforeinitialize' : this.getHandler('ctappbeforeinitialize'), 
				'ctappondestroy' : this.getHandler('ctappondestroy'),				
				'forminitialized' : this.getHandler('forminitialized'),				//Events for Form Widgets
				'formbeforeinitialize' : this.getHandler('formbeforeinitialize'),	//Events for Form Widgets
				'orgtemplateinitializer' : this.getHandler('orgtemplateinitializer')  // added for ORG view
				}

		});
	},
	getHandler :function(evtId){
		if(evtId==="extraParamsHandler"){
			return this.extraParamsHandler;
		}
		else{
			return !cbx.isEmpty(CWEH.getHandler(this.WIDGET_ID,evtId))?CWEH.getHandler(this.WIDGET_ID,evtId):cbx.emptyFn;
		}
	},
	extraParamsHandler:function(ob){
		var func = CWEH.getHandler(ob.WIDGET_ID,'extraParamsHandler');
		if(func && func.call){
			return func.call(this, ob);
		} else {
			return ob;
		}
		
	}
});
