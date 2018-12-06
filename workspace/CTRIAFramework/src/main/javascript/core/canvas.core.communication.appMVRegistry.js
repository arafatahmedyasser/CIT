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
 * cbx.communication.manager
 *
 * This class will be used by the layout containers to provide a communication channel between any apps they contain.
 * It has APIs to register widgets and also return the widget objects for calling their apis.
 * 
 */


cbx.namespace('canvas.core.communication');
canvas.core.communication.constants={
		HIERARCHY_DELEMETER:">"
};


cbx.namespace('canvas.core.communication.appMVRegistry');
canvas.core.communication.appMVRegistry = Class(cbx.Observable,{
	apiDirectory : {},
	constructor : function(){
		this.apiDirectory = {};
	},
	/**
	 * To register a widget object in the comm.manager instance
	 * @id Unique id to associate the widget with
	 * @object Widget ref object
	 * */
	registerWidget : function(id, object){
		try{
			this.apiDirectory[id]=object;
			object.commManager=this;
			return true;
		}catch(e){
			return false;
		}
	},
	
	/**
	 * To fetch the widget ref object from the communication manager's apiDirectory
	 * @id Unique id used for registering the widget
	 * */
	getWidget : function(id){
		if(id!=null){
			var widget= this.apiDirectory[id.split(canvas.core.communication.constants.HIERARCHY_DELEMETER)[0]];
			if(widget!=null)
				return widget;
		}
	}
});
