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
Ext.namespace('iportal.graph');

iportal.graph.decorator= function(config){
	this.yLabelDecorator= Ext.emptyFn;
	this.chartHeight= .8;
	this.chartWidth= .8;
	this.radius= 100;
	this.xLegendYpos=null;
	this.yLegendYPos=null;
	this.showLegends=true;
	this.curveGraph=false;
	this.scope= Ext.emptyFn;
	this.xLabelDecorator = Ext.emptyFn;
	this.xtype = 'iportal-graph-decorator';
	this.setXLabelDecorator= function(handler){
		this.xLabelDecorator=handler;
	};
	this.setYLabelDecorator= function(handler){
		this.yLabelDecorator=handler;
	};
	this.setScope= function(handler){
		this.scope=handler;
	};
	Ext.apply(this, config);
};

/**
 * iportal.graph.decorators
 *
 * Singleton class intended to store mapping of decorator library for configuring graphs.
 * It has two apis, one is for one is for registering the decorators and other to return the decorator.
 * 

 

 * @version   0.1
 */
iportal.graph.decorators = function(){
	var _ob=null;
	return {
      getInstance : function(){
					 if(_ob === null){
					    _ob = { 
					    		//Intended to register a Decorator. 
					    		//@param id - Handler id/name
					    		//@param ob - Handler object needs to be registered
							   registerDecorator:function(id,ob){
							   	_ob[id] = ob;	
							   },
							    //Intended to return Decorator.
					    		//@param id - Decorator id/name 
					    		//@return ob - Decorator object
							   	// Note: if bundle object not already added for given decorator id/name. 
							   	// It would return empty object.
							   getDecorator:function(id, config){
								   	var reOb =_ob[id];
								   	if(reOb!= null){
								   		if("function"== typeof reOb){
								   			return reOb(config);
								   		}else{
								   			return reOb;
								   		}
								   		
								   	}else{ 
								   		return {};
								   	}
							   }
					   };
					 }
					 return _ob;
      				}
		};
}();
IGD = iportal.graph.decorators.getInstance();

IGD.registerDecorator("DEFAULT_GRAPH_DECORATOR", function(config){
	return new iportal.graph.decorator(config);
});
