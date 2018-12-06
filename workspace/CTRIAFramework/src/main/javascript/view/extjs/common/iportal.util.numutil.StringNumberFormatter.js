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
cbx.namespace('iportal.util');
/**
 * This function objects encapsulates the functionality of formatting a String number
 */
iportal.util.stringnumformatter = function(){
	var COMMA_DELIMITER = ','; 	
	var PERIOD = '.'; 	
	var ZERO_NUMERAL = '0'; 		
	var EMPTY_STRING = ''; 	
	return {		
		/**
		 * This is a utility function which omits the leading zeroes from a string number 
		 */
		basicFormatter : function(s){
			if(s.indexOf(PERIOD) === -1) 
				s = s.concat(PERIOD).concat(ZERO_NUMERAL.repeat(5));
			var intS = s.substring(0,s.indexOf(PERIOD));	
			var decS = s.substring(s.indexOf(PERIOD)+1,s.length);	
			if(intS.startsWith(ZERO_NUMERAL) && intS.length!== 1){
				return this.basicFormatter(s.substring(1,s.length))
			}
			return intS.concat(PERIOD).concat(decS);
		},
		/**
		 *  accepts a number in string form and formats the number in
		 *  european format.
		 *  @param s : String number to be formatted
		 *  @param sd : Significant digits after string number point
		 */
		usFormatter : function(s,sd){
			var resultArr = [];
			var negative = false;
			if(s.startsWith('-')){
				s = s.substring(1,s.length);
				negative = true;
			}
			/**
			 * Strings are strings and not trusted to have every uniqueness
			 * of an amount. Last check to ensure that amount is not starting
			 * with a '0'
			 */
			if(s.startsWith(ZERO_NUMERAL)) 
				s = this.basicFormatter(s);
			if(s.indexOf(PERIOD) === -1) 
				s = s.concat(PERIOD).concat(ZERO_NUMERAL.repeat(2));
			var intS = s.substring(0,s.indexOf(PERIOD));	
			if(isNaN(sd)) { 
				if (sd == 0) {
					sd = 0;
				}
				if (sd != 0) {
					sd = 2;
				}
			}
			var decS = s.substring(s.indexOf(PERIOD)+1,s.length);	
			decS = decS.substring(0,sd);
			if(decS.length < parseInt(sd)){
				decS = decS.concat(ZERO_NUMERAL.repeat(Math.abs(decS.length - parseInt(sd))));
			}

			var intArr = this.toNumArray(intS).reverse();
			intLen = intArr.length;
			for(var index = 0; index< intLen; index++){
				if(index % 3 === 0 && index !== 0){
					resultArr.push(COMMA_DELIMITER);
					resultArr.push(intArr[index]);					
					continue;
				}
				resultArr.push(intArr[index]);
			}
			if(negative){
				if (sd == 0) {
					var tmp = '-'.concat(resultArr.reverse().join(EMPTY_STRING).concat(PERIOD));
					tmp = tmp.substring(0,tmp.indexOf(PERIOD));
					return tmp;					
				}else{
					return '-'.concat(resultArr.reverse().join(EMPTY_STRING).concat(PERIOD).concat(decS));
				}	
			}			
			if (sd == 0) {				 
				var temps = resultArr.reverse().join(EMPTY_STRING).concat(PERIOD);
				temps = temps.substring(0,temps.indexOf(PERIOD));
				return temps;				
			} else {				 
				return resultArr.reverse().join(EMPTY_STRING).concat(PERIOD).concat(decS);
			}
		},
		/**
		 * accepts a number in string form and formats the number in european format.
		 * 
		 * @param s : String number to be formatted
		 * @param sd : Significant digits after string number point
		 */
		euroFormatter : function(s,sd){
			var negative = false;
			if(s.startsWith('-')){
				s = s.substring(1,s.length);
				negative = true;
			}
			var resultArr = [];
			/**
			 * Strings are strings and not trusted to have every uniqueness
			 * of an amount. Last check to ensure that amount is not starting
			 * with a '0'
			 */
			if(s.startsWith(ZERO_NUMERAL)) 
				s = this.basicFormatter(s);
			if(s.indexOf(PERIOD) === -1) 
				s = s.concat(PERIOD).concat(ZERO_NUMERAL.repeat(2));
			var intS = s.substring(0,s.indexOf(PERIOD));	
			if(isNaN(sd)) { sd = 2; }
			var decS = s.substring(s.indexOf(PERIOD)+1,s.length);	
			decS = decS.substring(0,sd);
			if(decS.length < parseInt(sd)){
				decS = decS.concat(ZERO_NUMERAL.repeat(Math.abs(decS.length - parseInt(sd))));
			}
			var intArr = this.toNumArray(intS).reverse();
			intLen = intArr.length;
			for(var index = 0; index< intLen; index++){
				if(index % 3 === 0 && index !== 0){
					resultArr.push(PERIOD);
					resultArr.push(intArr[index]);
					continue;
				}
				resultArr.push(intArr[index]);
			}
			if(negative){
				if (sd == 0) {
					var tmp = '-'.concat(resultArr.reverse().join(EMPTY_STRING));
					return tmp;					
					}
				else
					return '-'.concat(resultArr.reverse().join(EMPTY_STRING).concat(COMMA_DELIMITER).concat(decS));	
			}
			
			else{
				if (sd == 0) {				 
					var temps = resultArr.reverse().join(EMPTY_STRING);
					return temps;				
				}
				else
					return resultArr.reverse().join(EMPTY_STRING).concat(COMMA_DELIMITER).concat(decS); 
			}
		},
		/**
		 * accepts a number in string form and formats the number in
		 * european format.
		 * @param s : String number to be formatted
		 * @param sd : Significant digits after string number point
		 */
		indianFormatter : function(s,sd){
			var resultArr = [];
			var negative = false;
			if(s.startsWith('-')){
				s = s.substring(1,s.length);
				negative = true;
			}
			/**
			 * Strings are strings and not trusted to have every uniqueness 
			 * of an amount. Last check to ensure that amount is not starting
			 * with a '0'
			 */
			if(s.startsWith(ZERO_NUMERAL)) 
				s = this.basicFormatter(s);
			if(s.indexOf(PERIOD) === -1) 
				s = s.concat(PERIOD).concat(ZERO_NUMERAL.repeat(5));
			var intS = s.substring(0,s.indexOf(PERIOD));	
			if(isNaN(sd)) { sd = 2; }
			var decS = s.substring(s.indexOf(PERIOD)+1,s.length);	
			decS = decS.substring(0,sd);
			if(decS.length < parseInt(sd)){
				decS = decS.concat(ZERO_NUMERAL.repeat(Math.abs(decS.length - parseInt(sd))));
			}
			var intArr = this.toNumArray(intS).reverse();
			intLen = intArr.length;
			if(intLen <=3) {
				return negative ?  '-'.concat(intS.concat(PERIOD).concat(decS)) : intS.concat(PERIOD).concat(decS);
			}
			for(var index = 0; index< intLen; index++){
				if(index === 3){
					resultArr.push(COMMA_DELIMITER);
					resultArr.push(intArr[index]);
					continue;
				}
				if(index >3 && index % 2 === 1){
					resultArr.push(COMMA_DELIMITER);
					resultArr.push(intArr[index]);
					continue;
				}
				resultArr.push(intArr[index]);
			}
			if(negative){
				if (sd == 0) {
					var tmp = '-'.concat(resultArr.reverse().join(EMPTY_STRING));
					return tmp;					
				}
				else
				    return '-'.concat(resultArr.reverse().join(EMPTY_STRING).concat(PERIOD).concat(decS));
			}
			else
				{
				if (sd == 0) {				 
					var temps = resultArr.reverse().join(EMPTY_STRING);
					return temps;				
				}
				else
					return resultArr.reverse().join(EMPTY_STRING).concat(PERIOD).concat(decS);
				}
		},
		/**
		 * Utility method which takes up a number string and converts
		 * it to a number array. If any of the character involved is ,found
		 * to be not a valid number, null object will be returned . So clients
		 * to this method should be cautious enough to check for a null value
		 * before the active use of the method value
		 */
		toNumArray : function(s){
			var sArr = [];
			for(var i = 0;i< s.length; i++){
					if(isNaN(s.charAt(i))) return null;
					sArr.push(parseInt(s.charAt(i)));
			}
			return sArr;
		}
	};

};


