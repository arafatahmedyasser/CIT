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
 * This function objects encapsulates the functionality of basic String number
 * manipulations like addition, subtraction, comparison, formatting etc.
 * Invocation of the function returns the StringNumber object
 */
iportal.util.numutil = function(){
	var COMMA_DELIMITER = ','; 	
	var PERIOD = '.'; 	
	var ZERO_NUMERAL = '0'; 	
	var ONE_NUMERAL = '1'; 	
	var EMPTY_STRING = ''; 	
	var UNARY_MINUS = '-'; 	
	var ELLIPSIS_NOTATION = '...';	
	var formatter_instance = iportal.util.stringnumformatter();
	return {
		/**
		 * The method to add 2 string numbers. This is the method to be used by the clients of this class.
		 * @param a : first number to be added
		 * @param b : second number to be added
		 */
		add : function(a,b){
			if((a.indexOf(PERIOD) !== -1) || (b.indexOf(PERIOD) !== -1)){
				if(a.indexOf(PERIOD) === -1) 
					a = a.concat(PERIOD).concat(ZERO_NUMERAL.repeat(5));
				if(b.indexOf(PERIOD) === -1) 
					b = b.concat(PERIOD).concat(ZERO_NUMERAL.repeat(5));
				var resultSumArray = [];
				var decimalRemainder = 0;
				var integerPartA = a.substring(0,a.indexOf(PERIOD));		
				var integerPartB = b.substring(0,b.indexOf(PERIOD));	
				var decimalPartA = a.substring(a.indexOf(PERIOD)+1,a.length);		
				var decimalPartB = b.substring(b.indexOf(PERIOD)+1,b.length);
				/**
				 * make the decimal part of both string numbers same in length. Decimal part will
				 * be converted to Number and perform the addition on Number datatype.This makes
				 * the restriction on the number of significant digits after string number point,
				 * limited to Js number datatype precision which is around 16 digits.
				 */
				var normalizedDecimalArray = this.normalizeFraction(decimalPartA,decimalPartB);
				var decimalSum = ( parseInt(normalizedDecimalArray[0]) + parseInt(normalizedDecimalArray[1]) ) + EMPTY_STRING;
				/**
				 * This is the case if decimals added to a number greater than 1, which should be
				 * carry through for further addition
				 */
				if(decimalSum.length !== normalizedDecimalArray[0].length){
					decimalRemainder = 1;
					decimalSum = decimalSum.substring(1,decimalSum.length);
				}
				var aArr = [];
				var bArr = [];
				for(var i = 0;i< integerPartA.length; i++){
					if(isNaN(integerPartA.charAt(i))) return;
					aArr.push(parseInt(integerPartA.charAt(i)));
				}
				for(var i = 0;i< integerPartB.length; i++){
					if(isNaN(integerPartB.charAt(i))) return;
					bArr.push(parseInt(integerPartB.charAt(i)));
				}
				if(aArr.length === bArr.length){
					if(decimalRemainder === 0)
					return this._add(aArr,bArr).join(EMPTY_STRING).concat(PERIOD).concat(decimalSum);
					else {
						var sumWithoutFraction = this._add(aArr,bArr);
						var reminderAddFactor = ZERO_NUMERAL.repeat(sumWithoutFraction.length - 1);
						reminderAddFactor = reminderAddFactor.concat(ONE_NUMERAL);
						var remArray = [];
						for(var i = 0;i< reminderAddFactor.length; i++){
							remArray.push(parseInt(reminderAddFactor.charAt(i)));
						}
						var sumWithFraction = this._add(sumWithoutFraction,remArray);
						return sumWithFraction.join(EMPTY_STRING).concat(PERIOD).concat(decimalSum);
					}
				}
				if(aArr.length > bArr.length){
					var margin = aArr.length - bArr.length;		
					var aCompArr = aArr.slice(margin,aArr.length);		
					var aOffsetArr = aArr.slice(0,margin);		
					var partialSum = this._add(aCompArr,bArr);
				}else {
					var margin = bArr.length - aArr.length;		
					var aCompArr = bArr.slice(margin,bArr.length);		
					var aOffsetArr = bArr.slice(0,margin);		
					var partialSum = this._add(aCompArr,aArr);
				}
				if(partialSum.length === aCompArr.length){
					resultSumArray = aOffsetArr.concat(partialSum);
					if(decimalRemainder === 0)
						return resultSumArray.join(EMPTY_STRING).concat(PERIOD).concat(decimalSum);
					else {
						var sumWithoutFraction = resultSumArray;
						var reminderAddFactor = ZERO_NUMERAL.repeat(sumWithoutFraction.length - 1);
						reminderAddFactor = reminderAddFactor.concat(ONE_NUMERAL);
						var remArray = [];
						for(var i = 0;i< reminderAddFactor.length; i++){
							remArray.push(parseInt(reminderAddFactor.charAt(i)));
						}
						var sumWithFraction = this._add(sumWithoutFraction,remArray);
						return sumWithFraction.join(EMPTY_STRING).concat(PERIOD).concat(decimalSum);
					}
				}else{
					var tempArr = [];
					for(var i=0 ; i < aOffsetArr.length-1; i++){
						tempArr.push(0);
					}
					tempArr.push(1);			
					var temp_partialSum = this._add(aOffsetArr,tempArr);			
					resultSumArray = temp_partialSum.concat(partialSum.slice(1,partialSum.length));
					if(decimalRemainder === 0)
						return resultSumArray.join(EMPTY_STRING).concat(PERIOD).concat(decimalSum);
					else {
						var sumWithoutFraction = resultSumArray;
						var reminderAddFactor = ZERO_NUMERAL.repeat(sumWithoutFraction.length - 1);
						reminderAddFactor = reminderAddFactor.concat(ONE_NUMERAL);
						var remArray = [];
						for(var i = 0;i< reminderAddFactor.length; i++){
							remArray.push(parseInt(reminderAddFactor.charAt(i)));
						}
						var sumWithFraction = this._add(sumWithoutFraction,remArray);
						return sumWithFraction.join(EMPTY_STRING).concat(PERIOD).concat(decimalSum);
					}
				}
			}else if((a.indexOf(PERIOD) === -1) && (b.indexOf(PERIOD) === -1)){
				var resultSumArray = [];
				var integerPartA = a;		
				var integerPartB = b;		
				var aArr = [];
				var bArr = [];
				for(var i = 0;i< integerPartA.length; i++){
					if(isNaN(integerPartA.charAt(i))) return;
					aArr.push(parseInt(integerPartA.charAt(i)));
				}
				for(var i = 0;i< integerPartB.length; i++){
					if(isNaN(integerPartB.charAt(i))) return;
					bArr.push(parseInt(integerPartB.charAt(i)));
				}
				if(aArr.length === bArr.length){
					return this._add(aArr,bArr).join(EMPTY_STRING);
				}
				if(aArr.length > bArr.length){
					var margin = aArr.length - bArr.length;		
					var aCompArr = aArr.slice(margin,aArr.length);		
					var aOffsetArr = aArr.slice(0,margin);		
					var partialSum = this._add(aCompArr,bArr);
				}else {
					var margin = bArr.length - aArr.length;		
					var aCompArr = bArr.slice(margin,bArr.length);		
					var aOffsetArr = bArr.slice(0,margin);		
					var partialSum = this._add(aCompArr,aArr);
				}
				if(partialSum.length === aCompArr.length){
					resultSumArray = aOffsetArr.concat(partialSum);
				}else{
					var tempArr = [];
					for(var i=0 ; i < aOffsetArr.length-1; i++){
						tempArr.push(0);
					}
					tempArr.push(1);			
					var temp_partialSum = this._add(aOffsetArr,tempArr);			
					resultSumArray = temp_partialSum.concat(partialSum.slice(1,partialSum.length));
				}
			}
			return resultSumArray.join(EMPTY_STRING);
		},
		/**
		 * 
		 */
		_add : function(aArr,bArr){
			var resultArr = [];
			var rem = 0;
			for(var j=0,index= aArr.length - 1; index>= 0; index--) {
				resultArr.push(aArr[index] + bArr[index] + rem);
				if(resultArr[j] >= 10){
					resultArr[j] -= 10;
					rem = 1;
				}else {
					rem = 0;
				}
				j++;
			}
			if(rem != 0){
				resultArr.push(1);		
			}
			return resultArr.reverse();
		},
		/**
		 * the function will accept 2 strings which are numbers, if both strings 
		 * are of equal length , then simply pack it inside an array and send back.
		 * If that is not the case, padding zeroes will be added to the humble   array.
		 */
		normalizeFraction : function(a,b){
			var resArray = [];			
			if(a.length === b.length){
				resArray.push(a);
				resArray.push(b);
			}else if(a.length > b.length){
				resArray.push(a);
				var margin = a.length - b.length;
				var balanceFactor = ZERO_NUMERAL.repeat(margin);
				b += balanceFactor;
				resArray.push(b);
			}else if(a.length < b.length){		
				var margin = b.length - a.length;				
				var balanceFactor = ZERO_NUMERAL.repeat(margin);
				a += balanceFactor;
				resArray.push(a);
				resArray.push(b);
			}
			return resArray;
		},
		/**
		 * returns the maximum of 2 numbers. Beware this cant be used for
		 * big numbers. After a certain limit (16 chars) for Javascript
		 * interpretor every numbers are equal.
		 */
		max : function(a,b){
			r = ( a >= b ) ? a : b;
			return r;
		},
		/**
		 * returns the minimum of 2 numbers. This also cant be used for
		 * big numbers. The method is used as a utility for some other methods
		 */
		min : function(a,b){
			r = ( a >= b ) ? b : a;
			return r;
		},
		/**
		 * compares 2 string numbers
		 *  @param a : first number to be compared
		 *  @param b : second number to be compared
		 *  @return : -1 means first number is less than the second number
		 * 			  +1 means first number is greater than the second number
		 * 			  0 means both first number and second number are equal
		 */
		compare2Num : function(a,b) {
			if(a.indexOf(PERIOD) === -1) 
				a = a.concat(PERIOD).concat(ZERO_NUMERAL.repeat(5));	
			if(b.indexOf(PERIOD) === -1) 
				b = b.concat(PERIOD).concat(ZERO_NUMERAL.repeat(5));
			var integerPartA = a.substring(0,a.indexOf(PERIOD));		
			var integerPartB = b.substring(0,b.indexOf(PERIOD));	
			var decimalPartA = a.substring(a.indexOf(PERIOD)+1,a.length);		
			var decimalPartB = b.substring(b.indexOf(PERIOD)+1,b.length);	
			var arrAB = this.makeOfSameLength(integerPartA , integerPartB);
			var aArr = this.toNumArray(arrAB[0]);
			var bArr = this.toNumArray(arrAB[1]);
			if( (aArr === null) || (bArr === null) ) return NaN;
			for(var index = 0; index < aArr.length ; index++){
				if(aArr[index] < bArr[index]){
					return -1;
				}else if(aArr[index] > bArr[index]){
					return 1;
				}
			}
			var decArrAB = this.makeDecimalOfSameLength(decimalPartA , decimalPartB);
			aArr = this.toNumArray(decArrAB[0]);
			bArr = this.toNumArray(decArrAB[1]);
			if( (aArr === null) || (bArr === null) ) return NaN;
			for(var index = 0; index < aArr.length ; index++){
				if(aArr[index] < bArr[index]){
					return -1;
				}else if(aArr[index] > bArr[index]){
					return 1;
				}
			}
			return 0;
		},
		/**
		 * This will make 2 strings to be same length and pack it inside
		 * an array and send back.Returned array contains 2 elements both
		 * in same size as another.
		 * @param a : first string to be check for elongation
		 * @param b : second string to be check for elongation
		 */
		makeOfSameLength : function(a,b) {
			var resArr = [];
			if(a.length === b.length){
				resArr.push(a);
				resArr.push(b);
				return resArr;
			}
			var difference = Math.abs(a.length - b.length);
			if(a.length > b.length){
				/**
				 * cascading method to increase clarity.
				 * 0's will be repeated required number of times and prefixed
				 * with the limited string ( in this, if case string b )
				 */
				b = ZERO_NUMERAL.repeat(difference).concat(b);
			} 
			else{
				a = ZERO_NUMERAL.repeat(difference).concat(a);
			}
			resArr.push(a);
			resArr.push(b);
			return resArr;
		},
		/**
		 * This method is doing a similar purpose as of the earlier one
		 * except in the scenario it will be used or the nature of parameters
		 * involved. Here the method accepts 2 number strings, which are
		 * actually decimal part of an original number string. Then make
		 * both the strings in equal length and pack it as an array to be
		 * returned back to the calling method
		 * 
		 * @param a : first string to be check for elongation
		 * @param b : second string to be check for elongation
		 */
		makeDecimalOfSameLength : function(a,b) {
			var resArr = [];
			if(a.length === b.length){
				resArr.push(a);
				resArr.push(b);
				return resArr;
			}
			var difference = Math.abs(a.length - b.length);
			/**
			 * 0's will be padded to the right side of strings to untouch its nicety
			 */
			if(a.length > b.length){
				b = b.concat(ZERO_NUMERAL.repeat(difference));
			}else{
				a = a.concat(ZERO_NUMERAL.repeat(difference));
			}
			resArr.push(a);
			resArr.push(b);
			return resArr;
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
		},
		/**
		 * 
		 */
		sub : function(a,b) {
			if(isNaN(a) || isNaN(b)) return NaN;
			if(a.indexOf(PERIOD) === -1) 
				a = a.concat(PERIOD).concat(ZERO_NUMERAL.repeat(5));
			if(b.indexOf(PERIOD) === -1) 
				b = b.concat(PERIOD).concat(ZERO_NUMERAL.repeat(5));
			var intA = a.substring(0,a.indexOf(PERIOD));		
			var intB = b.substring(0,b.indexOf(PERIOD));
			var decA;
			var decB;
			var signExt = EMPTY_STRING;
			/**
			 * If subtraction is done on a smaller number by a bigger number
			 */
			if(this.compare2Num(a,b) === -1){
				/**
				 * swap integer part and decimal part if subtraction yield negative value
				 */
				var temp = intA;
				intA = intB;
				intB = temp;				
				decA = b.substring(b.indexOf(PERIOD)+1,b.length);		
				decB = a.substring(a.indexOf(PERIOD)+1,a.length);	
				/**
				 * prepend the result with a -ve sign
				 */
				signExt = UNARY_MINUS;				
			}else{
				decA = a.substring(a.indexOf(PERIOD)+1,a.length);		
				decB = b.substring(b.indexOf(PERIOD)+1,b.length);	
			}			
			var arrAB = this.makeOfSameLength(intA , intB);
			var decArrAB = this.makeDecimalOfSameLength(decA , decB);
			decRes = parseInt(decArrAB[0]) - parseInt(decArrAB[1]);
			if(decRes < 0) {
				decRes = parseInt(ONE_NUMERAL + decArrAB[0]) - parseInt(decArrAB[1]);
				arrAB[0] = this._sub(arrAB[0],ZERO_NUMERAL.repeat(arrAB[0].length-1).concat(ONE_NUMERAL));
			}
			if((decRes + EMPTY_STRING).length < decArrAB[0].length){
				decRes = ZERO_NUMERAL.repeat(Math.abs((decRes + EMPTY_STRING).length - decArrAB[0].length)).concat(decRes);
			}
			var resArr = this._sub(arrAB[0],arrAB[1]);
			return signExt.concat(this.basicFormatter(resArr.concat(PERIOD).concat(decRes)));
		},
		/**
		 * Both a and b will be of same length
		 */
		_sub : function(a,b){
			var resArr = [];
			var aArr = this.toNumArray(a);
			var bArr = this.toNumArray(b);
			for(var j=0,index = aArr.length - 1; index >= 0 ;index--) {
				resArr[j] = aArr[index] - bArr[index];
				/**
				 * normal situation where small number being subtracted from
				 * a big or equal number
				 */
				if(resArr[j] >= 0){
					j++;
				}else{
					/**
					 * incase we cant subtract blindly, borrow from neighbours
					 * Make sure this is not the MSN (Most Significant Number)) as there
					 * will be no wealthy neighbours for him.
					 */
					if(index !== 0){
						var jIndex=1;
						var res = this._borrow(aArr,index-1,bArr[index],jIndex);
						aArr = res[0];
						resArr[j] = res[1];				
						j++;				
					}
				}
			}
			return resArr.reverse().join(EMPTY_STRING);
		},
		/**
		 * to be used by subtraction and doesnt make much sense outside 
		 */
		_borrow : function(a,index,bVal,jVal) {
			var resArr = [];
			if( a[index] === 0 ){
				a[index] = 9;
				return this._borrow(a,index-1,bVal,++jVal);
			}else {
				a[index] = a[index] - 1;		
				var diff = ( a[index + jVal] + 10 ) - bVal;		
				resArr.push(a);
				resArr.push(diff);
				return resArr;
			}	
		},
		/**
		 * This is a utility function which omits the leading zeroes from a  string number.
		 */
		basicFormatter : function(s){
			if(s.indexOf(PERIOD) === -1) 
				s = s.concat(PERIOD).concat(ZERO_NUMERAL.repeat(5));
			var intS = s.substring(0,s.indexOf(PERIOD));	
			var decS = s.substring(s.indexOf(PERIOD)+1,s.length);	
			/**
			 * Make sure last zero is preserved
			 */
			if(intS.startsWith(ZERO_NUMERAL) && intS.length!== 1){
				return this.basicFormatter(s.substring(1,s.length))
			}
			return intS.concat(PERIOD).concat(decS);
		},
		/**
		 * accepts a number in string form and formats the number in european format.
		 * 
		 * @param s : String number to be formatted
		 * @param sd : Significant digits after string number point
		 */
		europeanFormatter : function(s,sd){
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
					resultArr.push(COMMA_DELIMITER);
					resultArr.push(intArr[index]);
					continue;
				}
				resultArr.push(intArr[index]);
			}
			return resultArr.reverse().join(EMPTY_STRING).concat(PERIOD).concat(decS);
		},
		/**
		 *  accepts a number in string form and formats the number in
		 *  european format.
		 *  @param s : String number to be formatted
		 *  @param sd : Significant digits after string number point
		 */
		indianFormatter : function(s,sd){
			var resultArr = [];
			/**
			 * Strings are strings and not trusted to have every uniqueness
			 *  of an amount. Last check to ensure that amount is not starting
			 *  with a '0'
			 *  
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
			if(intLen <=3) return intS.concat(PERIOD).concat(decS);
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
			return resultArr.reverse().join(EMPTY_STRING).concat(PERIOD).concat(decS);
		},
		/**
		 * 
		 */
		formatterFactory : {
			en_US : function(n,d){
				return formatter_instance.usFormatter(n,d);
			},
			en_IN : function(n,d){
				return formatter_instance.indianFormatter(n,d);
			},
			en_UK : function(n,d){
				return formatter_instance.euroFormatter(n,d);
			},
			'#,##,###.##' : function(n,d){
				return formatter_instance.indianFormatter(n,d);
			},
			'##,##,###.##' : function(n,d){
				return formatter_instance.indianFormatter(n,d);
			},
			'#,###.##' : function(n,d){
				return formatter_instance.usFormatter(n,d);
			}, 
			'#,###,###.##' : function(n,d){
				return formatter_instance.usFormatter(n,d);
			}    
		},
		/**
		 * This will return width required to accomodate the string contained in the variable value
		 * if no element is been created yet. This can happen while rendering a grid, where each cell's
		 * overlying wrapper is been created after the grid has been rendered. 
		 */
		getNeededWidthNoEl : function(value,metadata){
			var hiddenLabel = new Ext.form.Label({ 
				    	text: value, 
				        renderTo: document.body, 
				        css: metadata ? metadata.css : ''
				    });
			var text_metrics = Ext.util.TextMetrics.createInstance(hiddenLabel.el);	
			var neededWidth = text_metrics.getWidth(value);	
			hiddenLabel.destroy();	
			return neededWidth;
		},
		/**
		 * This method should be used only if the space allocated for this particular string is not
		 * sufficient for its proper rendering. The method will return the string which can be fit
		 * in that particular space with inclusion ellipsis characters. This also should be used incase
		 * of grid rendering as that is the place where we dont have a proper element while rendering.
		 */
		getStringForWidth : function(val,valWidth,metadata){
			var text_metrics;		
			var hiddenLabel = new Ext.form.Label({ 
			           text: val, 
			           renderTo: document.body, 
			           css: metadata ? metadata.css : ''
			        });
			text_metrics = Ext.util.TextMetrics.createInstance(hiddenLabel.el);			
			var theneededIndex = 0 ;
			for(var index = 0; index < val.length; index++){
				var tempWidth = text_metrics.getWidth(val.substring(0,index));	
				if(tempWidth < valWidth){
					theneededIndex = index;
				}else{
					break;
				}
			}
			hiddenLabel.destroy();
			return val.substring(0,theneededIndex-3).concat(ELLIPSIS_NOTATION);
		},
		/**
		 * The method will serve the purpose same as the above, but this time we will have the
		 * element wrapper for the underlying DOM node. If the element passed being null, we will
		 * take the css applied
		 *  
		 */
		getStringForWidthEl : function(val,valWidth,nodeel){
			var text_metrics;		
			if(nodeel){
				text_metrics = Ext.util.TextMetrics.createInstance(nodeel);	
			}else{
				text_metrics = Ext.util.TextMetrics.createInstance(Ext.getBody());
			}		
			var theneededIndex = 0 ;
			for(var index = 0; index <= val.length; index++){
				var tempWidth = text_metrics.getWidth(val.substring(0,index));	
				if(Number(tempWidth) < Number(valWidth)){
					theneededIndex = index;					
				}else{
					break;
				}
			}
			if(theneededIndex == val.length){
				return val;
			}else{	
				return val.substring(0,theneededIndex-3).concat(ELLIPSIS_NOTATION);
			}
		}
	};
};

/**
 * 
 */
iportal.util.stringnumber = function(){
	var _stringnumInstance = null;
	return {
      getInstance : function(){
		 if(_stringnumInstance === null){
		    _stringnumInstance = iportal.util.numutil();
		 }
		 return _stringnumInstance;
		}
	};
}();
