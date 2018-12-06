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
cbx.ns("cbx.lib");
cbx.lib.ComponentRegistry = function (){

	var register = {};
	var serialize=function (obj){
	var keys=[];
	for(i in obj){
		if(obj.hasOwnProperty(i)){
		keys.push(i);
		}
	}
	keys.sort();
	var str='';
	var key;
	for(var i=keys.length-1; i>=0; i--){
		key=keys[i]
		str+='|'+key+':'+obj[key]+'|';

	}
	return str;
}
	return {
		getCmp : function (config){
			if(register[serialize(config)]){
				return register[serialize(config)];
			}else{
				LOGGER.error("No cbx component is registered with the following config options:", config);
			}
		},
		registerCmp: function(config, className){
			console.log('registering comp: className: ' + config);
			
			register[serialize(config)]=className
		}
	};

}();
CLCR=cbx.lib.ComponentRegistry;

