
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
				"dd" : "DD",
				"DD" : "DD",
				"d" : "D",
				"D" : "D",
				"M" : "M",
				"MM" : "MM",
				"MMM" : "MMM",
				"MMMM" : "MMMM",
				"y" : "YY",
				"yy" : "YY",
				"yyy" : "YY",
				"yyyy" : "YYYY",
				"Y" : "YY",
				"YY" : "YY",
				"YYY" : "YY",
				"YYYY" : "YYYY",
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
