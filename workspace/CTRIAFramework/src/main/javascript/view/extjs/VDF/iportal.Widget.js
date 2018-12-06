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
 * 		@version   0.1
 */
Ext.namespace('iportal');

/**
* The super class for all the widgets for iportal. Every widgets rendering directly
* into browser(bit misleading but meant, not coming in any popups or via explicit user trigger)
* are valid candidates for its subclass. 
*/
iportal.Widget = function(config){
	Ext.apply(this,new Ext.util.Observable());	
	this.addEvents(
	        /**
	         * @event widgetready
	         * Fires when any of the widget loads complete data.
	         */
	        "widgetready"
	);	
    iportal.Widget.superclass.constructor.call(this, config);
};
Ext.extend(iportal.Widget, Ext.util.Observable,  function(){
	//var widgetReady = false;
	return {
	
		// Initially this is set false, but once the widget has  been ready
		// it is set as true value
		widgetReady : false,
		listeners :{
			'widgetready':function(option){
				iportal.listview.listviewrenderermap.setLoadedWidget(option);						
			}
		},
		// Once the widget is ready - meant data is loaded into the widget
		// This method will be called by corresponding widget, with the dom component
		// it used for its rendering, as the parameter.
		fireWidgetReady : function(div_key){
			if(!this.widgetReady){
				this.widgetReady = true;
				this.fireEvent('widgetready',div_key);
			}		
		},
		getWidgetView:function(){
			return this.mv.mvh
		},
		setParentHeight:function(height){
			if(!Ext.isEmpty(this.mv)){
				this.mv.height=height;
				this.mv.applyParentHeight=true;
				this.mv.parentHeight=height;
			}
		}
	}
}());

iportal.ListViewWidget = function(config){
	Ext.apply(this,new Ext.util.Observable());	
    this.addEvents(
	        /**
	         * @event listviewwidgetready
	         * Fires when any of the widget loads complete data.
	         */
	        "listviewwidgetready"
	    );	
    iportal.Widget.superclass.constructor.call(this, config);
};
Ext.extend(iportal.ListViewWidget, iportal.Widget,  {
	
});

