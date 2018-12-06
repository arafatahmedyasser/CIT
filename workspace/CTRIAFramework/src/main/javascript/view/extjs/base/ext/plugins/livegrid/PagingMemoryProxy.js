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
if(!Array.prototype.map){
    Array.prototype.map = function(fun){
	var len = this.length;
	if(typeof fun != "function"){
	    throw new TypeError();
	}
	var res = new Array(len);
	var thisp = arguments[1];
	for(var i = 0; i < len; i++){
	    if(i in this){
		res[i] = fun.call(thisp, this[i], i, this);
	    }
	}
        return res;
     };
}

/* Paging Memory Proxy, allows to use paging grid with in memory dataset */
Ext.data.PagingMemoryProxy = function(data) {
	Ext.data.PagingMemoryProxy.superclass.constructor.call(this);
	this.data = data;
};

Ext.extend(Ext.data.PagingMemoryProxy, Ext.data.MemoryProxy, {
	load : function(params, reader, callback, scope, arg) {
		params = params || {};
		var result;
		try {
			result = reader.readRecords(this.data);
		}catch(e){
			this.fireEvent("loadexception", this, arg, null, e);
			callback.call(scope, null, arg, false);
			return;
		}
		
		// filtering
		if (params.filter!==undefined) {
			result.records = result.records.filter(function(el){
			    if (typeof(el)=="object"){
					var att = params.filterCol || 0;
					return String(el.data[att]).match(params.filter)?true:false;
			    } else {
					return String(el).match(params.filter)?true:false;
			    }
			});
			result.totalRecords = result.records.length;
		}
		
		// sorting
		if (params.sort!==undefined) {
		    // use integer as params.sort to specify column, since arrays are not named
		    // params.sort=0; would also match a array without columns
		    var dir = String(params.dir).toUpperCase() == "DESC" ? -1 : 1;
        	var fn = function(r1, r2){
				return r1 < r2;
            };
		    result.records.sort(function(a, b) {
				var v = 0;
				if (typeof(a)=="object"){
				    v = fn(a.data[params.sort], b.data[params.sort]) * dir;
				} else {
				    v = fn(a, b) * dir;
				}
				if (v==0) {
				    v = (a.index < b.index ? -1 : 1);
				}
				return v;
		    });
		}

		// paging (use undefined cause start can also be 0 (thus false))
		if (params.start!==undefined && params.limit!==undefined) {
			result.records = result.records.slice(params.start, params.start+params.limit);
		}
		
		callback.call(scope, result, arg, true);
	}
});
