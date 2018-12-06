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
// cbx.ns('cbx.lib');

// cbx.lib.view.calendar = function() {
	// initialize variables and constants
	// create the required methods that render the calendar on the screen.
	// create the required helper methods that help rendering the calendar data.
	
//}

var monthMaxDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var monthMaxDaysLeap = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var daysInMonthArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
var days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
var minYear = 1980;
var maxYear = 2100;
var labelToggleArray = new Array();
var saturdays = new Array();
var item = '';
var daySchedulesCountArray = new Array();
var actLimit = 3;
var moreShownArr = new Array();
var weekTitleStartMonth;
var weekTitleEndMonth;

var currentDate = new Date().getDate() + ' ' + months[new Date().getMonth()] + ' ' + new Date().getFullYear();

var currentYear = new Date().getFullYear();
var today = new Date().getDate();


function populateMonthsAndYears(monthid, yearid)
{
	var monthsSelect = document.getElementById(monthid);
	var yearsSelect = document.getElementById(yearid);
	for (var i=minYear; i<maxYear; i++)
	{
		var option = document.createElement('option');
		option.text = i;
		option.value = i;
		yearsSelect.add(option);
	}

	for (var i=0; i<months.length; i++)
	{
		var option = document.createElement('option');
		option.text = months[i];
		option.value = i;
		monthsSelect.add(option);
	}

	document.getElementById(yearid).value = new Date().getFullYear();
	document.getElementById(monthid).value = new Date().getMonth();
}

function getCurrentMonth()
{
	if (document.getElementById('months-left').value == new Date().getMonth())
	{
		return (new Date().getMonth());
	}
	else
	{
		return document.getElementById('months-left').value;
	}
}

function loadCalendar(year, month, date, id)
{
	var noofdays;
	if (year % 4 == 0)
	{
		noofdays = monthMaxDaysLeap[month];
	}
	else
	{
		noofdays = monthMaxDays[month];
	}
	var d = new Date(year, month, 1, 00, 00, 00);
	if (document.getElementById('currentMonthAndYear'))
	{
		document.getElementById('currentMonthAndYear').innerHTML = months[month] + ' 1-' + noofdays;
	}
	rearrangeCalendar(d, noofdays, id);

	var tb = document.getElementById(id);
	var rowCounter = 0;
	var cellCounter = 0;

	for (var i=1;i<=noofdays ; i++ )
	{
		if( i == 1 )
		{
			cellCounter = d.getDay();
			blankDays = cellCounter;
		}
		//Retrieve all the saturdays in this month (because that is the last day of the week)
		if (cellCounter == 6)
		{
			saturdays[saturdays.length] = i;
		}
		if( cellCounter > 6 )
		{
			rowCounter++;
			cellCounter = 0;
		}

		if (id == 'days-left')
		{
			tb.rows[rowCounter].cells[cellCounter].innerHTML = '<span onclick="javascript: showDays(\'' + year + '\', \'' + months[month] + '\', \'' + i + '\');">' + i + '</span>';
		}
		else
		{
			var day_header_div = document.createElement('div');
			day_header_div.style.paddingBottom = '5px';
			day_header_div.align = 'right';

			var addnew_div = document.createElement('span');
			addnew_div.align = 'left';
			//addnew_div.style.width = '85px';
			addnew_div.innerHTML = '<img src="images/list.gif" onmouseover="javascript: this.src=\'images/list_hover.gif\';" onmouseout="javascript: this.src=\'images/list.gif\';" alt="Show all the activities" title="Show all the activities" id="showAllActivities' + i + '" style="display: none;"/>';

			day_header_div.appendChild(addnew_div);

			var day_div = document.createElement('span');
			day_div.style.display = 'inline-block';
			day_div.style.width = '90px';
			day_div.innerHTML = i;

			day_header_div.appendChild(day_div);

			tb.rows[rowCounter].cells[cellCounter].id = i + '';
			tb.rows[rowCounter].cells[cellCounter].appendChild(day_header_div);
		}

		if (i == today && new Date().getMonth() == month)
		{
			tb.rows[rowCounter].cells[cellCounter].className += " aumtech-calendar-date-today";
		}

		cellCounter++;
	}

	rowCounter = 0;
	cellCounter = 0;
	blankDays = 0;
	
	if (id != 'days-left')
	{
		
	}
}


function rearrangeCalendar(d, days, id)
{
	var tb = document.getElementById(id);
	if(tb.rows.length > 1)
	{
		for (var row = tb.rows.length-1; row >= 0; row--)
		{
			tb.deleteRow(row);
		}
	}

	var noofrows = 5;
	var cellHeight = '110px';
	//a day starts on friday and has 31 days requires 6 rows to display all the dates
	if (d.getDay() == 5 && days == 31)
	{
		noofrows = 6;
		cellHeight = '91px';
	}
	else if (d.getDay() == 6 && days > 29)
	{
		noofrows = 6;
		cellHeight = '91px';
	}

	for (var i=0; i<noofrows; i++)
	{
		var row = tb.insertRow(i);
		for (var j=0; j<7; j++)
		{
			var cell = row.insertCell(j);
			cell.className = (id != 'days-left'?"aumtech-caneldar-day":"");
			cell.align = (id != 'days-left'?"left":"center");
			cell.vAlign = (id != 'days-left'?"top":"middle");
			//cell.width = "30px";
			if (id != 'days-left')
			{
				cell.height = cellHeight;
			}
		}
	}
}

function clearCalendar()
{
	//Remove all the components from detailed calendar view
	var leftCalDaysObj = document.getElementById('days-left');
	//var rightCalDaysObj = document.getElementById('days');
	for (var i=leftCalDaysObj.rows.length-1; i>=0; i--)
	{
		leftCalDaysObj.deleteRow(i);
		//rightCalDaysObj.deleteRow(i);
	}
}

function next(monthORyear, monthid, yearid)
{
	var otherMonthId = (monthid.indexOf('-') > 0?'months':'months-left');
	var otherYearId = (yearid.indexOf('-') > 0?'years':'years-left');

	if (monthORyear == 'month')
	{
		document.getElementById(monthid).value = (document.getElementById(monthid).value == 11?0:parseInt(document.getElementById(monthid).value)+1);
		//document.getElementById(otherMonthId).value = (document.getElementById(otherMonthId).value == 11?0:parseInt(document.getElementById(otherMonthId).value)+1);
		//Need to check the year value whether it exceeds its limit of 2099 years. If it does, make the year value to 1980.
		if (document.getElementById(monthid).value == 0)
		{
			//increment the year
			if (parseInt(document.getElementById(yearid).value, 10) + 1 > 2099)
			{
				document.getElementById(yearid).value = 1980;
				//document.getElementById(otherYearId).value = 1980;
			}
			else
			{
				document.getElementById(yearid).value = parseInt(document.getElementById(yearid).value, 10) + 1;
				//document.getElementById(otherYearId).value = parseInt(document.getElementById(otherYearId).value, 10) + 1;
			}
		}
	}
	else
	{
		document.getElementById(yearid).value = (document.getElementById(yearid).value == 2099?1900:parseInt(document.getElementById(yearid).value)+1);
		//document.getElementById(otherYearId).value = (document.getElementById(otherYearId).value == 2099?1900:parseInt(document.getElementById(otherYearId).value)+1);
	}

	clearCalendar();
	document.getElementById('currentMonthAndYear').innerHTML = months[document.getElementById(monthid).value] + ' ' + document.getElementById(yearid).value;
	loadCalendar(document.getElementById(yearid).value, document.getElementById(monthid).value, 1, 'days-left');
	//loadCalendar(document.getElementById(yearid).value, document.getElementById(monthid).value, 1, 'days');
	//loadCalendarPanel();
}

function previous(monthORyear, monthid, yearid)
{
	var otherMonthId = (monthid.indexOf('-') > 0?'months':'months-left');
	var otherYearId = (yearid.indexOf('-') > 0?'years':'years-left');
	if (monthORyear == 'month')
	{
		document.getElementById(monthid).value = (document.getElementById(monthid).value == 0?11:parseInt(document.getElementById(monthid).value)-1);
		document.getElementById(otherMonthId).value = (document.getElementById(otherMonthId).value == 0?11:parseInt(document.getElementById(otherMonthId).value)-1);
		if (document.getElementById(monthid).value == 0)
		{
			//increment the year
			if (parseInt(document.getElementById(yearid).value, 10) + 1 < 1980)
			{
				document.getElementById(yearid).value = 2099;
				document.getElementById(otherYearId).value = 2099;
			}
			else
			{
				document.getElementById(yearid).value = parseInt(document.getElementById(yearid).value, 10) - 1;
				document.getElementById(otherYearId).value = parseInt(document.getElementById(otherYearId).value, 10) - 1;
			}
		}
	}
	else
	{
		document.getElementById(yearid).value = (document.getElementById(yearid).value == 1900?2099:parseInt(document.getElementById(yearid).value)-1);
		document.getElementById(otherYearId).value = (document.getElementById(otherYearId).value == 1900?2099:parseInt(document.getElementById(otherYearId).value)-1);
	}

	clearCalendar();
	document.getElementById('currentMonthAndYear').innerHTML = months[document.getElementById(monthid).value] + ' ' + document.getElementById(yearid).value;
	loadCalendar(document.getElementById(yearid).value, document.getElementById(monthid).value, 1, 'days-left');
	loadCalendar(document.getElementById(yearid).value, document.getElementById(monthid).value, 1, 'days');
	//loadCalendarPanel();
}

function monthChange(monthSelectId, otherMonthSelectId, yearId)
{
	document.getElementById(otherMonthSelectId).value = document.getElementById(monthSelectId).value;
	clearCalendar();
	document.getElementById('currentMonthAndYear').innerHTML = months[document.getElementById(monthSelectId).value] + ' ' + document.getElementById(yearId).value;
	loadCalendar(document.getElementById(yearId).value, document.getElementById(monthSelectId).value, 1, 'days-left');
	loadCalendar(document.getElementById(yearId).value, document.getElementById(monthSelectId).value, 1, 'days');
}

function yearChange(yearSelectId, otherYearSelectId, monthId)
{
	document.getElementById(otherYearSelectId).value = document.getElementById(yearSelectId).value;
	clearCalendar();
	document.getElementById('currentMonthAndYear').innerHTML = months[document.getElementById(monthId).value] + ' ' + document.getElementById(yearSelectId).value;
	loadCalendar(document.getElementById(yearSelectId).value, document.getElementById(monthId).value, 1, 'days-left');
	loadCalendar(document.getElementById(yearSelectId).value, document.getElementById(monthId).value, 1, 'days');
}

function setCurrentActiveItem(item)
{
	this.item = item;
}

function getCurrentActiveItem()
{
	return item;
}

function padZero(val)
{
	if (val < 10)
	{
		val = '0'+val;
	}

	return val;
}

function showDays(year, month, day)
{
	Ext.getCmp('calendarDisplay').getLayout().setActiveItem('dayDisplay');
	var dCal = Ext.getCmp('dayDisplay');
	//Set the title of the panel
	dCal.setTitle(day + ' ' + month + ' ' + year);

	//alert(month + ' ' + day);
}