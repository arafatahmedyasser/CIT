/**
 * Copyright 2015. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */

canvas.datePreferences = function ()
{
	return ({

		getDateFormat : function ()
		{
			var dateVariables = {
				"dd" : "d",
				"DD" : "d",
				"d" : "j",
				"D" : "j",
				"M" : "n",
				"MM" : "m",
				"MMM" : "M",
				"MMMM" : "F",
				"y" : "y",
				"yy" : "y",
				"yyy" : "y",
				"yyyy" : "Y",
				"Y" : "y",
				"YY" : "y",
				"YYY" : "y",
				"YYYY" : "Y",
				"" : ""
			};
			var dateFormatJson = iportal.preferences.getDateFormatJson();
			var datePosOne = dateFormatJson.datePositionOne;
			var datePosTwo = dateFormatJson.datePositionTwo;
			var datePosThree = dateFormatJson.datePositionThree;
			var dateSepOne = dateFormatJson.dateSeparatorOne;
			if (dateSepOne == "N")
				dateSepOne = "";
			else if (dateSepOne == "S")
				dateSepOne = " ";
			var dateSepTwo = dateFormatJson.dateSeparatorTwo;
			if (dateSepTwo == "N")
				dateSepTwo = "";
			else if (dateSepTwo == "S")
				dateSepTwo = " ";
			var dateFormatString = dateVariables[datePosOne] + dateSepOne + dateVariables[datePosTwo] + dateSepTwo
						+ dateVariables[datePosThree];
			return dateFormatString;
		},
		getParsedDateFormat : function ()
		{
			var dateVariables = {
				"dd" : "%d",
				"DD" : "%d",
				"d" : "%-d",
				"D" : "%-d",
				"M" : "%-m",
				"MM" : "%m",
				"MMM" : "%b",
				"MMMM" : "%B",
				"y" : "%g",
				"yy" : "%g",
				"yyy" : "%g",
				"yyyy" : "%Y",
				"Y" : "%g",
				"YY" : "%g",
				"YYY" : "%g",
				"YYYY" : "%Y",
				"" : ""
			};
			var dateFormatJson = iportal.preferences.getDateFormatJson();
			var datePosOne = dateFormatJson.datePositionOne;
			var datePosTwo = dateFormatJson.datePositionTwo;
			var datePosThree = dateFormatJson.datePositionThree;
			var dateSepOne = dateFormatJson.dateSeparatorOne;
			if (dateSepOne == "N")
				dateSepOne = "";
			else if (dateSepOne == "S")
				dateSepOne = " ";
			var dateSepTwo = dateFormatJson.dateSeparatorTwo;
			if (dateSepTwo == "N")
				dateSepTwo = "";
			else if (dateSepTwo == "S")
				dateSepTwo = " ";
			var dateFormatString = dateVariables[datePosOne] + dateSepOne + dateVariables[datePosTwo] + dateSepTwo
						+ dateVariables[datePosThree];
			return dateFormatString;
		}
	})
}();
