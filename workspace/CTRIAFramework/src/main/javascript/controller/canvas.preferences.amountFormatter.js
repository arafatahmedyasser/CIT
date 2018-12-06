/**
 * Copyright 2015. Intellect Design Arena Limited. All rights reserved. 
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
cbx.ns('canvas.preferences');
canvas.preferences.amountFormatter = function ()
{
	return {
		basicFormatter : function (numVal, signdigits)
		{
			// retrieve the amount format values
			var amtFormatJson = iportal.preferences.getAmountFormatJson();
			var clientFormatterClass = amtFormatJson.clientFormatterClass;
			if(!cbx.isFunction(clientFormatterClass))
				clientFormatterClass = this.defaultFormatter;
			var formatClass=new clientFormatterClass();
			return formatClass.formatAmount(numVal, {
				'signdigits' : signdigits,
				'groupSep' : amtFormatJson.groupSeparator,
				'decSep' : amtFormatJson.decimalSeparator,
				'groupSize' : amtFormatJson.groupSize,
				'leadingGroupSize' : amtFormatJson.leadingGroupSize,
				'negativeSignFormat' : amtFormatJson.negativeSignFormat
			});
		},

		defaultFormatter : function ()
		{
			return {
				formatAmount : function (numVal, props)
				{
					var signSymbol;
					var absoluteValue;
					var integralValue;
					var integerPart;
					var decimalValue;
					var ZERO_NUMERAL = '0';
					var PERIOD = '.';
					var isNegative = false;
					if (!isNaN(numVal))
					{
						var groupSize = isNaN(props.groupSize) ? 3 : props.groupSize;
						var leadingGroupSize = isNaN(props.leadingGroupSize) ? groupSize : props.leadingGroupSize;
						var signdigits = isNaN(props.signdigits) ? 2 : props.signdigits;
						var groupSep = cbx.isEmpty(props.groupSep)? "," : props.groupSep;
						if(groupSep == "S"){
							groupSep = " ";
						}
						var decSep = cbx.isEmpty(props.decSep) ? "." : props.decSep;
						if(decSep == "S"){
							decSep = " ";
						}
						var negativeSignFormat = props.negativeSignFormat;
						if (numVal.startsWith("-"))
						{
							absoluteValue = numVal.substr(1, numVal.length);
							signSymbol = "-";
							isNegative = true;
						} else
						{
							absoluteValue = numVal;
							signSymbol = "";
						}
						integerPart = absoluteValue.split(PERIOD)[0];
						var lastGroupDigits = integerPart.length > Number(groupSize) ? integerPart.substr(integerPart.length - groupSize, groupSize) : integerPart
						var otherNumbers = integerPart.substring(0, integerPart.length - groupSize);
						if (otherNumbers != '')
							lastGroupDigits = groupSep + lastGroupDigits;
						if (groupSize == leadingGroupSize)
						{
							var index = otherNumbers.length % Number(groupSize);
							var resultStrNum = otherNumbers.substr(0, index);
							for (index; index < otherNumbers.length; index += Number(groupSize))
							{
								if (index != 0)
									resultStrNum += groupSep;
								resultStrNum += otherNumbers.substr(index, groupSize);
							}
						} else
						{
							var index = otherNumbers.length % Number(leadingGroupSize);
							var resultStrNum = otherNumbers.substr(0, index);
							for (index; index < otherNumbers.length; index += Number(leadingGroupSize))
							{
								if (index != 0)
									resultStrNum += groupSep;
								resultStrNum += otherNumbers.substr(index, leadingGroupSize);
							}
						}
						integralValue = resultStrNum + lastGroupDigits;
						decimalValue = absoluteValue.toString();
						if (decimalValue.indexOf(PERIOD) === -1)
							decimalValue = decimalValue.concat(PERIOD).concat(ZERO_NUMERAL.repeat(signdigits));
						decimalValue = decimalValue.substring(decimalValue.indexOf(PERIOD) + 1, decimalValue.length);
						decimalValue = decimalValue.substring(0, signdigits);
						if (decimalValue.length < parseInt(signdigits))
						{
							decimalValue = decimalValue.concat(ZERO_NUMERAL.repeat(Math.abs(decimalValue.length
										- parseInt(signdigits))));
						}
						decimalValue = decSep + decimalValue;
						if (isNegative)
						{
							switch (negativeSignFormat)
							{
								case 'PREFIX':
									return signSymbol + integralValue + decimalValue;
									break;
								case 'SUFFIX':
									return integralValue + decimalValue + signSymbol;
									break;
								case 'WRAP':
									return "(" + integralValue + decimalValue + ")";
									break;
								case 'NONE':
									return integralValue + decimalValue;
									break;
								default:
									return signSymbol + integralValue + decimalValue;
							}
						} else
						{
							return integralValue + decimalValue;
						}
					} else
					{
						return;
					}
				}
			};
		}
	};
};

canvas.amountFormatter = function(){
	var _stringnumInstance = null;
	return {
      getInstance : function(){
		 if(_stringnumInstance === null){
		    _stringnumInstance = canvas.preferences.amountFormatter();
		 }
		 return _stringnumInstance;
		}
	};
}();


	

