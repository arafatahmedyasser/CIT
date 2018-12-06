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
cbx.namespace('canvas.lib');
/**
 * canvas.lib
 *
 * Singleton class intended to store all the datatype formatter for the forms
 */
canvas.lib.DatatypeFormatter = function(){
	var _ob=null;
	return {
		getInstance : function(){
    	  	if(_ob === null){
			    _ob = { 
		    		/**
		    		 * Intended to register a Hanlder. 
		    		 * @param id - Handler id/name
		    		 * @param ob - Handler object needs to be registered
		    		 */
				   registerHandler:function(id,ob){
				   	_ob[id] = ob;	
				   },
				   /**
				    * Intended to return Handelr.
				    * @param id - Handler id/name
				    * @return ob - Handler object
				    * Note: if bundle object not already added for given handler id/name. 
				    * It would return empty object.
				    */
				   getHandler:function(id, config){
					   	var reOb =_ob[id];
					   	if(reOb!= null){
					   		if("function"== typeof reOb){
					   			return reOb(config);
					   		}
					   		else{
					   			return reOb;
					   		}
					   		
					   	}
					   	else{ 
					   		return {};
					   	}
				   }
			   };
			}
    	  	return _ob;
		}
	};
}();

DTF = canvas.lib.DatatypeFormatter.getInstance();


//Always the input type will be ######.##
//var curr = data[metadata.LINKED_SOURCE_CCY];
//var currAppend = metadata.FLD_APPEND_CURRENCY_IND || '';

DTF.registerHandler('AMOUNT',function(config){

			var value = config.value ,curr = config.curr ,currAppend = config.currAppend;
			
	   		var islinkedCurrAvail = false;
			
			
			var currDecimalPlaceList = cbx.globalcurrency.metadata.getCurrDecimalPlaceList();
			var currList = currDecimalPlaceList;
			var val = value;
			if(currList != null){
				var currDecForLinkedCurr = currList[curr];
				if (currDecForLinkedCurr != undefined
						&& currDecForLinkedCurr.trim() != '') {
					(islinkedCurrAvail = true);
				}
			}
			var currBasedDecimal = 2;
			if (!cbx.isEmpty(val)) {
				if (!curr || curr.trim() == '' || curr == '') {
					curr = iportal.systempreferences.getDefaultBankCCY();
					if (!curr || curr.trim() == ''
							|| curr == '') {
						curr = cbx.globalcurrency.metadata.getDefaultCurrency();
					}
				}
				if (curr && curr != '' && curr.trim() != '') {
					currBasedDecimal = currList[curr];
				}
				try {
					if (val.charAt(0) == ".") {
						val = "0" + val;
					}
				} catch (err) {	}
				val = new String(val);
				var sn = canvas.amountFormatter.getInstance();
				val = sn.basicFormatter(val.replace(/,/g,""), currBasedDecimal);
				if (islinkedCurrAvail == true) {
					if (currAppend == "PREFIX") {//"PREFIX"
						val = curr + " " + val;
					} else if (currAppend == "SUFFIX") {//"SUFFIX"
						val = val + " " + curr;
				} else {
					val = val;
					}
				}
			} 
		return val;
		
});


DTF.registerHandler('NUMBER',function(){

	
	
});


// Always the input type will be dd/mm/yyy
DTF.registerHandler('DATE', function (inputDate)
{


});



//Always the input type will be dd/mm/yyy HH:mm:ss a 
DTF.registerHandler('TIME',function(){

	
	
	
	
});








