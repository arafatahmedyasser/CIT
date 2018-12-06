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
cbx.ns('iportal.preferences');
/**
 * 
 */
iportal.preferences.TimezoneManager = function(){	
	var EMPTY_STRING = "";	
	var default_time_format =iportal.preferences.getTimeFormat();
	return {
		/**
		 * 
		 */
		timeformat : default_time_format,
		/**
		 * 
		 */
		getPreferenceTimeZone : function(){
			return iportal.preferences.getTimeZone();
		},
		/**
		 * 
		 */
		setTimeFormat:function(format){
			this.timeformat = format;
		},
		/**
		 * 
		 */
		getTimeFormat:function(format){
			return this.timeformat;
		},
		/**
		 * 
		 */
		adjustOffset : function(dateobj,timeoffset){
			if(timeoffset === 'GMT'){
				timeoffset+='+0000';
			}
			timeoffset = EMPTY_STRING.concat(timeoffset);
			timeoffset = timeoffset.trim();
			timeoffset = timeoffset.substring(3,timeoffset.length);
			var sign = timeoffset.substring(0,1); 
			var hoursoffset = timeoffset.substring(1,3); 
			hoursoffset = parseInt(hoursoffset,10);
			var minutesoffset = timeoffset.substring(3,5); 
			minutesoffset = parseInt(minutesoffset,10);
			var msoffset = (hoursoffset*60*60*1000)+(minutesoffset*60*1000);
			var offsetedms = (sign==='+') ? dateobj.getTime()+msoffset : dateobj.getTime()-msoffset;
			var newdateobj = new Date(offsetedms);
			return newdateobj;
		},	
		/**
		 * 
		 */
		adjustServerOffset : function(dateobj,timeoffset){
			if(timeoffset === 'GMT'){
				timeoffset+='+0000';
			}
			timeoffset = EMPTY_STRING.concat(timeoffset);
			timeoffset = timeoffset.trim();
			timeoffset = timeoffset.substring(3,timeoffset.length);
			var sign = timeoffset.substring(0,1); 
			var hoursoffset = timeoffset.substring(1,3); 
			hoursoffset = parseInt(hoursoffset,10);
			var minutesoffset = timeoffset.substring(3,5); 
			minutesoffset = parseInt(minutesoffset,10);	
			var msoffset = (hoursoffset*60*60*1000)+(minutesoffset*60*1000);
			var offsetedms = (sign==='+') ? dateobj.getTime()-msoffset : dateobj.getTime()+msoffset;
			var newdateobj = new Date(offsetedms);
			return newdateobj;
		},	
		/**
		 * 
		 */
		doSimpleTZConversion : function(dateobj){
			if(!Ext.type(dateobj)==='date')return dateobj.toString();			
			var prefTimeZone = this.getPreferenceTimeZone();
			var timeoffset = iportal.preferences.getTimeZoneOffset();			
			var returnVal = '';						
			if(timeoffset){	
				timeoffset = timeoffset.substring(3,timeoffset.length);
				var sign = timeoffset.substring(0,1); 
				var hoursoffset = timeoffset.substring(1,3); 
				hoursoffset = Number(hoursoffset);
				var minutesoffset = timeoffset.substring(3,5); 
				minutesoffset = Number(minutesoffset);	
				var msoffset = (hoursoffset*60*60*1000)+(minutesoffset*60*1000);
				var offsetedms = (sign==='+') ? dateobj.getTime()+msoffset : dateobj.getTime()-msoffset;
				var newdate = new Date(offsetedms);
				return newdate;		
			}else{
				return dateobj;	
			}
		},
		/**
		 * 
		 */
		adjustTideServerOffset : function(dateobj){
			if(!Ext.type(dateobj)==='date')return dateobj.toString();
			var timeoffset = 'GMT+0530';			
			timeoffset = timeoffset.substring(3,timeoffset.length);
			var sign = timeoffset.substring(0,1); 
			var hoursoffset = timeoffset.substring(1,3); 
			hoursoffset = Number(hoursoffset);
			var minutesoffset = timeoffset.substring(3,5); 
			minutesoffset = Number(minutesoffset);	
			var msoffset = (hoursoffset*60*60*1000)+(minutesoffset*60*1000);
			var offsetedms = (sign==='+') ? dateobj.getTime()-msoffset : dateobj.getTime()+msoffset;
			var newdate = new Date(offsetedms);
			return newdate;				
		},			
		/**
		 * The method to be called from the application with a date object as
		 * the parameter. This will return the time in a custom format after
		 * adjusting it with the timezone offset 
		 */
		getLocaleTime : function(dateobj,delimiter){
			if(!Ext.type(dateobj)==='date')return dateobj.toString();			
			if(iportal.preferences.getServerTimeZoneOffset()){
				dateobj = this.adjustServerOffset(dateobj,iportal.preferences.getServerTimeZoneOffset());
			}
			var prefTimeZone = this.getPreferenceTimeZone();
			var timeoffset = iportal.preferences.getTimeZoneOffset();
			var returnVal = '';	
					
			if(timeoffset){				
				var newdate = this.adjustOffset(dateobj,timeoffset);
				returnVal = newdate.format(canvas.datePreferences.getDateFormat());				
				if(delimiter){
					returnVal += delimiter;
				}else{
					returnVal += ' ';
				}
				returnVal += newdate.format(this.getTimeFormat());				
			}else{
				returnVal = dateobj.format(canvas.datePreferences.getDateFormat()+' '+this.getTimeFormat());
			}
			return returnVal ;
		},
		/**
		 * 
		 */
		getLocaleTimeFromFormattedString : function(formatteddate){
			var datetimearray = [];
			var newdate ;
			datetimearray = formatteddate.split(' ');
			if(datetimearray.length > 0){
				newdate = iportal.jsutil.convertStringToDateObject(datetimearray[0]);
			}
			if(datetimearray[1]){
				var timearray = datetimearray[1].split(':');
				newdate.setHours(timearray[0]);
				newdate.setMinutes(timearray[1]);
				newdate.setSeconds(timearray[2]);
			}
			return this.getLocaleTime(newdate).concat(' ').concat(iportal.preferences.getTimeZoneOffset());
		},
		/**
		 * The standard format coming from server side is dd/MM/yyyy HH:mi:ss. But for Customer rates
		 * the date will be coming from TIDE backend will be of format dd MMM YYYY  HH:mm:ss z. So this
		 * specific API has been written for such a dateformat and convert into Standard Portal Date-Time
		 * format with , appropriate timezone information and conversion done.
		 */
		getLocaleDateTimeTideRateFormat  : function(formatteddate){
			dt = this.doSimpleTZConversion(formatteddate); 
			var returnVal;
			if(dt){
				returnVal = dt.format(canvas.datePreferences.getDateFormat()+' '+this.getTimeFormat());
				return returnVal.concat(' ').concat(iportal.preferences.getTimeZoneOffset());
			}else{
				return formatteddate;
			}			
		},
		
		/**
		 * The method to be called from the application with a date object as
		 * the parameter. This will return the time in a custom format after
		 * readjusting it to Locale timezone offset
		 */
		reAdjustOffset : function(dateobj,timeoffset){
			if(timeoffset === 'GMT'){
				timeoffset+='+00:00';
			}
			timeoffset = EMPTY_STRING.concat(timeoffset);
			timeoffset = timeoffset.trim();
			timeoffset = timeoffset.substring(3,timeoffset.length);
			var sign = timeoffset.substring(0,1); 
			var hoursoffset = timeoffset.substring(1,3); 
			hoursoffset = parseInt(hoursoffset,10);
			var minutesoffset = timeoffset.substring(4,6); 
			minutesoffset = parseInt(minutesoffset,10);
			var msoffset = (hoursoffset*60*60*1000)+(minutesoffset*60*1000);
			var offsetedms = (sign==='-') ? dateobj.getTime()+msoffset : dateobj.getTime()-msoffset;
			var newdateobj = new Date(offsetedms);
			return newdateobj;
		},
		
		/**
		 * 
		 */
		reAdjustServerOffset : function(dateobj,timeoffset){
			if(timeoffset === 'GMT'){
				timeoffset+='+00:00';
			}
			timeoffset = EMPTY_STRING.concat(timeoffset);
			timeoffset = timeoffset.trim();
			timeoffset = timeoffset.substring(3,timeoffset.length);
			var sign = timeoffset.substring(0,1); 
			var hoursoffset = timeoffset.substring(1,3); 
			hoursoffset = parseInt(hoursoffset,10);
			var minutesoffset = timeoffset.substring(4,6); 
			minutesoffset = parseInt(minutesoffset,10);	
			var msoffset = (hoursoffset*60*60*1000)+(minutesoffset*60*1000);
			var offsetedms = (sign==='-') ? dateobj.getTime()-msoffset : dateobj.getTime()+msoffset;
			var newdateobj = new Date(offsetedms);
			return newdateobj;
		},
		/**
		 * 
		 */
		getServerTime : function(dateobj,delimiter){
			if(!Ext.type(dateobj)==='date')return dateobj.toString();			
			var timeoffset = iportal.preferences.getTimeZoneOffset();
			var returnVal = '';						
			var newdate = this.reAdjustOffset(dateobj,timeoffset);
			if(iportal.preferences.getServerTimeZoneOffset()){
				dateobj = this.reAdjustServerOffset(newdate,iportal.preferences.getServerTimeZoneOffset());
			}
			returnVal = dateobj.format(canvas.datePreferences.getDateFormat());				
			if(delimiter){
				returnVal += delimiter;
			}else{
				returnVal += ' ';
			}
			this.setTimeFormat(iportal.preferences.getTimeFormat());
			returnVal += dateobj.format(this.getTimeFormat());
			return returnVal ;
		}		
	};
}();

   
