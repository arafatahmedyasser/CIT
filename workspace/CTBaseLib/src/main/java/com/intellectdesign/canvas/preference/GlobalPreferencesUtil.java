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
package com.intellectdesign.canvas.preference;

import java.text.ParseException;
/**
 *
 * @Version 1.0
 */
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.SystemPreferenceDescriptor;
import com.intellectdesign.canvas.constants.preferences.PreferenceConstants;
import com.intellectdesign.canvas.database.CanvasDatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseResult;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.pref.date.DateFormatterManager;
import com.intellectdesign.canvas.pref.timezone.TimeZoneManager;
import com.intellectdesign.canvas.utility.CTUtility;
import com.intellectdesign.canvas.utils.timezone.TimeZoneData;

/**
 * This class is for GlobalPreferencesUtil Containing IGlobalPreferences
 * 
 * @version 1.0
 */
public class GlobalPreferencesUtil implements IGlobalPreferences
{
	/**
	 * Internal constant for serialization purposes
	 */
	/**
	 * This is a utility class to get the default values to be used for a user's preference. The default values in a
	 * user's preference is been taken from orbionedirect properties file.
	 * 
	 * @return Map contains all the values in a user's default preference along with appropriate keys.
	 */
	public Map getDefaultUserPreferences()
	{
		Map<String, String> attributeMap = new HashMap<String, String>();
		String temp = "";
		int index = -1;
		String[] attributes =
		{ "DEFAULT_AMOUNT_FORMAT", "DEFAULT_TIMEZONE", "DEFAULT_LANG", "DEFAULT_DATE_FORMAT",
				"DEFAULT_ENABLE_SEC_LANG", "DEFAULT_STARTUP_WS", "DEFAULT_SEC_LANG", "DEFAULT_RATE_CARD",
				"DEFAULT_THEME", "DEFAULT_FONT_SIZE", "DEFAULT_CURR", "DEFAULT_TIME_FORMAT" };
		String[] attrKeys =
		{ "AMOUNT", "TIMEZONE", "LANGUAGE", "DATEFORMAT", "ENASECLANG", "STARTWS", "SLANGUAGE", "RATECARD", "THEME",
				"FONTSIZE", "EQUICURR", "TIMEFORMAT" };
		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		for (int i = 0; i < attributes.length; i++)
		{
			SystemPreferenceDescriptor descriptor = configMgr.getSystemPrefDescriptor();
			temp = descriptor.getString(attributes[i], "");
			index = temp.indexOf(" ");
			temp = index != -1 ? temp.substring(0, index) : temp;
			attributeMap.put(attrKeys[i], temp);
		}
		logger.ctdebug("CTBAS00058", attributeMap);
		return attributeMap;
	}

	/**
	 * This is a utility class to get all the timezones from the TIMEZONEMASTER table
	 * 
	 * @return Map contains all the codes and GMT offsets of the timezones available in portal
	 */
	public Map getTimeZones()
	{
		List<TimeZoneData> allTimeZones = TimeZoneManager.getAllTimezones(true);
		int numZones = allTimeZones.size();
		HashMap aTzData;
		TimeZoneData aTz;
		Map retMap = new HashMap();
		for (int count = 0; count < numZones; count++)
		{
			aTz = allTimeZones.get(count);
			aTzData = new HashMap<String, String>();
			aTzData.put(PreferenceConstants.TZ_KEY_CODE, aTz.getCode());
			aTzData.put(PreferenceConstants.TZ_KEY_GMTOFFSET, aTz.getRegionCode());
			retMap.put(String.valueOf(count), aTzData);
		}

		logger.ctdebug("CTBAS00059", retMap);
		return retMap;

	}

	/**
	 * this is ref to list of getAllCurrencies
	 * 
	 * @param rateCard
	 * @return
	 */

	// Here the list of ratecards are directly fetched from cache and for
	// the individual ratecards ,equivalent currencies are being fetched
	public List getAllCurrencies(String rateCard)
	{
		return null;
	}

	/**
	 * This will return the date format corresponding to the dateid. dateid will be used as the key in dateformat
	 * combobox and this is what we will get at server if we submit the preferences form. But the session will store
	 * dateformat as the format only, so before setting in session we need to get the corresponding format form the id.
	 * 
	 * @param dateid id set for thid format like D002
	 * @return formatted date
	 */
	public String getDateFormat(String dateid)
	{
		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		DatabaseResult dbResult = new DatabaseResult();

		dbRequest.setDataAccessMapKey(PreferenceConstants.GET_DATEFORMAT_DISPLAY);
		dbRequest.setOperation(DatabaseConstants.SELECT);
		dbRequest.setOperationExtension(PreferenceConstants.DATEID);
		dbRequest.addFilter(PreferenceConstants.DATEID, dateid);

		try
		{
			dbResult = dbRequest.execute();
		} catch (DatabaseException dbx)
		{
			logger.cterror("CTBAS00060", dbx, dateid);
		}
		Map tempMap = new HashMap();
		if (dbResult.getReturnedList().size() > 0)
		{
			tempMap = (HashMap) dbResult.getReturnedList().get(0);
		}
		logger.ctdebug("CTBAS00061", tempMap);
		return (String) tempMap.get(PreferenceConstants.DATE_FORMAT_KEY);
	}

	/**
	 * The method will return date code for a given dateformat
	 * 
	 * @return date code like D002
	 */
	public String getDateCode(String dateformat)
	{
		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		DatabaseResult dbResult = new DatabaseResult();

		dbRequest.setDataAccessMapKey(PreferenceConstants.GET_DATEID_DISPLAY);
		dbRequest.setOperation(DatabaseConstants.SELECT);
		dbRequest.setOperationExtension(PreferenceConstants.DATE_FORMAT);
		dbRequest.addFilter(PreferenceConstants.DATE_FORMAT_KEY, dateformat);

		try
		{
			dbResult = dbRequest.execute();
		} catch (DatabaseException dbx)
		{
			logger.cterror("CTBAS00062", dbx, dateformat);
		}
		Map tempMap = new HashMap();
		if (dbResult.getReturnedList().size() > 0)
		{
			tempMap = (HashMap) dbResult.getReturnedList().get(0);
		}
		return (String) tempMap.get(PreferenceConstants.DATE_ID);
	}

	/**
	 * The method will return timezone offset for a given timezone code
	 * 
	 * @param timezone for which TimeZoneOffset required
	 * @return timezone offset in gmt
	 */
	public String getTimeZoneOffset(String timezone)
	{
		return TimeZoneManager.getGMTOffsetFor(timezone);
	}

	/**
	 * The method will return timezone nick name for a given timezone code
	 * 
	 * @param timezone for which timezone nick name required
	 * @return timezone nick name
	 */
	public String getTimeZoneNickName(String timezone)
	{
		return TimeZoneManager.getNickNameFor(timezone);
	}

	/**
	 * The method will return timezone offset for a given timezone code
	 * 
	 * @param timezone
	 * @param date
	 * @return timezone offset in gmt
	 */
	public String getTimeZoneOffset(String timezone, Date date)
	{

		String timezoneID = null;
		String offset = "";
		timezoneID = getInternalTimeZoneId(timezone);
		offset = convertToOffset(timezoneID, date);

		return offset;
	}

	/**
	 * Gets the internal timezone id for the given timezone.
	 * 
	 * @param timezone
	 * @return Returns the InternalTimeZoneId
	 */
	public String getInternalTimeZoneId(String timezone)
	{
		return TimeZoneManager.getGMTOffsetFor(timezone);

	}

	/**
	 * This Method will construct and return the offset value of Timezone ID.
	 * 
	 * @param timezoneID
	 * @param date
	 * @return offset
	 */

	public String convertToOffset(String timezoneID, Date date)
	{
		String gmtValue = "GMT";
		long datetolong = 0;
		int offset = 0;
		int hour_offset = 0;
		int minute_offset = 0;
		String gmtOffset = "";

		if (timezoneID != null)
		{
			TimeZone tz = TimeZone.getTimeZone(timezoneID);
			datetolong = date.getTime();
			offset = tz.getOffset(datetolong);
			hour_offset = offset / (60 * 60 * 1000);
			minute_offset = Math.abs(offset / (60 * 1000)) % 60;

			String hourStrValue = Integer.toString(hour_offset);
			String minStrValue = Integer.toString(minute_offset);

			if (Integer.toString(Math.abs(hour_offset)).length() < 2)
			{
				if (hour_offset < 0)
				{
					hourStrValue = "-" + "0" + Integer.toString(Math.abs(hour_offset));
				} else
					hourStrValue = "0" + hourStrValue;
			}

			if (minStrValue.length() < 2)
			{
				minStrValue = "0" + minStrValue;
			}
			if (hour_offset > 0)
			{
				gmtOffset = gmtValue + "+" + hourStrValue + minStrValue;
			} else
			{

				gmtOffset = gmtValue + hourStrValue + minStrValue;
			}
		}
		return gmtOffset;
	}

	/**
	 * This method is used to convert current date and time to user preferred time zone
	 * 
	 * @param userPreferedTimeZone
	 * @return formattedDateAndTime
	 */
	public String getConvertedTime(String userPreferedTimeZone)
	{
		Calendar cal = Calendar.getInstance();
		Date date = cal.getTime();
		String userOffset = getTimeZoneOffset(userPreferedTimeZone, date);
		Calendar calUser = CTUtility.convertTimeZone(cal, userOffset);
		String formattedDateAndTime = formatDateAndTime(calUser);
		return formattedDateAndTime;
	}

	/**
	 * This method is used to convert date and time to user preferred time zone
	 * 
	 * @param userPreferedTimeZone
	 * @param date
	 * @return formattedDateAndTime
	 */
	public String getConvertedTime(String userPreferedTimeZone, Date date)
	{

		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		String userOffset = getTimeZoneOffset(userPreferedTimeZone, date);
		Calendar calUser = CTUtility.convertTimeZone(cal, userOffset);
		String formattedDateAndTime = formatDateAndTime(calUser);
		return formattedDateAndTime;
	}

	/**
	 * This method is used to convert calendar into default format of date and time
	 * 
	 * @param cal
	 * @return Returns the formatted date and time
	 */
	public String formatDateAndTime(Calendar cal)
	{
		String formattedDateAndTime;
		SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
		formatter.setCalendar(cal);
		formattedDateAndTime = formatter.format(cal.getTime());
		return formattedDateAndTime;
	}

	/**
	 * This method is used to convert Date and Time into User Preference format of date and time
	 * 
	 * @param user data format
	 * @param timeZoneId
	 * @param current date
	 * @return Returns the user preferred formatted date and time
	 */
	public String userPrefFormatDateAndTime(String formatDate, String timeZoneId, Date date)
	{
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		String userOffset = getTimeZoneOffset(timeZoneId, date);
		Calendar calUser = CTUtility.convertTimeZone(cal, userOffset);
		String formattedDateAndTime = formatDateAndTime(calUser);
		logger.ctdebug("CTBAS00063", formattedDateAndTime);
		SimpleDateFormat formatter = new SimpleDateFormat((formatDate != null) ? formatDate : "dd/MM/yyyy HH:mm:ss z");
		formatter.setCalendar(calUser);
		formattedDateAndTime = formatter.format(calUser.getTime());
		logger.ctdebug("CTBAS00064", formattedDateAndTime);
		return formattedDateAndTime;
	}

	/**
	 * This method is used to convert Date into User Preference format of date
	 * 
	 * @param formatDate
	 * @param timeZoneId
	 * @param date
	 * @return Returns the user preferred formatted date
	 */
	public String userPrefFormatDate(String formatDate, String timeZoneId, Date date)
	{

		String userPrefDate;
		String jDateFormat = DateFormatterManager.getJavaDateFormat(formatDate);
		SimpleDateFormat formatter = new SimpleDateFormat(jDateFormat);
		userPrefDate = formatter.format(date);
		return userPrefDate;
	}

	/**
	 * This is a helper method that goes through the list of records available and formats the data present in the
	 * amount column name to the user preferred date format and adds the timezone id provided.
	 * 
	 * 
	 * @param oldDateValue The date value
	 * 
	 * @param timeZoneId The user preferred time zone format.
	 * @param includeTimezone Flag indicating if timezone should be appended to the formatted date.
	 * @return The formatted date time.
	 */
	public String formatDateTime(String oldDateValue, String timeZoneId, boolean includeTimezone)
	{
		SimpleDateFormat defaultDateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
		SimpleDateFormat newDateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		String tideServerTimezone = configMgr.getSystemPrefDescriptor().getServerTimeZone();
		Date oldDate;
		String tzOffset;
		String newDateValue = null;
		Calendar cal = Calendar.getInstance();
		Calendar timezoneCal = Calendar.getInstance(TimeZone.getTimeZone(getInternalTimeZoneId(tideServerTimezone)));
		logger.ctdebug("CTBAS00065", oldDateValue);
		try
		{
			oldDate = defaultDateFormat.parse(oldDateValue);
			newDateValue = oldDateValue; // If any exception return old value
			if (timeZoneId != null)
			{
				timezoneCal.setTime(oldDate);
				// Identify the actual time offset and convert the date to the timezone provided.
				tzOffset = convertToOffset(timeZoneId, oldDate);
				cal = CTUtility.convertTimeZone(timezoneCal, tzOffset);
			} else
			{
				timezoneCal.setTime(oldDate);
				tzOffset = "";
			}
			newDateFormat.setCalendar(cal);
			newDateValue = newDateFormat.format(cal.getTime());
			logger.ctdebug("CTBAS00066", newDateValue);
			return newDateValue;
		} catch (ParseException parseEx)
		{
			logger.cterror("CTBAS00067", parseEx, oldDateValue);
		}
		return newDateValue;
	}

	/**
	 * This is a helper method that goes through the list of records available and formats the data present in the
	 * amount column name to the user preferred date format and adds the timezone id provided.
	 * 
	 * @param recordsList The list of records that needs the update
	 * @param dateColName The date column name
	 * 
	 * @param timeZoneId The user preferred time zone format.
	 * @param includeTimezone Flag indicating if timezone should be appended to the formatted date.
	 * @return The formatted date time.
	 */
	public void formatDateTime(ArrayList<HashMap> recordsList, String dateColName, String timeZoneId,
			boolean includeTimezone)
	{
		if (recordsList == null || recordsList.size() == 0)
			return;
		String actualtimeZoneId = (timeZoneId == null) ? "" : getInternalTimeZoneId(timeZoneId);

		SimpleDateFormat defaultDateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
		SimpleDateFormat newDateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		String tideServerTimezone = configMgr.getSystemPrefDescriptor().getServerTimeZone();

		int numRows = recordsList.size();
		HashMap aRow;
		String oldDateValue;
		Date oldDate;
		String tzOffset;
		String newDateValue;

		if (tideServerTimezone.equalsIgnoreCase(timeZoneId))
			tideServerTimezone = actualtimeZoneId;
		else
			tideServerTimezone = getInternalTimeZoneId(tideServerTimezone);

		for (int count = 0; count < numRows; count++)
		{
			Calendar cal = Calendar.getInstance();
			Calendar timezoneCal = Calendar.getInstance(TimeZone.getTimeZone(tideServerTimezone));
			aRow = recordsList.get(count);
			oldDateValue = (String) aRow.get(dateColName);
			logger.ctdebug("CTBAS00065", oldDateValue);
			try
			{
				oldDate = defaultDateFormat.parse(oldDateValue);
				if (timeZoneId != null)
				{
					timezoneCal.setTime(oldDate);
					// Identify the actual time offset and convert the date to the timezone provided.
					tzOffset = convertToOffset(actualtimeZoneId, oldDate);
					cal = CTUtility.convertTimeZone(timezoneCal, tzOffset);
				} else
				{
					timezoneCal.setTime(oldDate);
					tzOffset = "";
				}

				newDateFormat.setCalendar(cal);
				newDateValue = newDateFormat.format(cal.getTime());
				logger.ctdebug("CTBAS00066", newDateValue);
				aRow.put(dateColName, newDateValue);
			} catch (ParseException parseEx)
			{
				logger.cterror("CTBAS00067", parseEx, oldDateValue);
			}
		}
	}

	/**
	 * This is a helper method that goes through the list of records available and formats the data present in the
	 * amount column name to the user preferred date format and adds the timezone id provided.
	 * 
	 * @param recordsList The list of records that needs the update
	 * @param dateColName The date column name
	 * 
	 * @param timeZoneId The user preferred time zone format.
	 * @param toDateFormat To which format date needs to convert
	 * @param ampmMarker the flag for am/pm marker
	 */
	public void formatDateTime(ArrayList<HashMap> recordsList, String dateColName, String timeZoneId,
			String toDateFormat, boolean ampmMarker)
	{
		if (recordsList == null || recordsList.size() == 0)
			return;

		SimpleDateFormat defaultDateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
		String actualtimeZoneId = (timeZoneId == null) ? "" : getInternalTimeZoneId(timeZoneId);
		toDateFormat = (toDateFormat != null && !"".equals(toDateFormat.trim())) ? toDateFormat : "dd/MM/yyyy";
		if (!(toDateFormat.contains("mm:ss")))
		{
			if (ampmMarker)
			{
				toDateFormat = toDateFormat + " hh:mm:ss a";
			} else
			{
				toDateFormat = toDateFormat + " HH:mm:ss";
			}
		}

		SimpleDateFormat userPrefDateFormat = new SimpleDateFormat(toDateFormat);

		int numRows = recordsList.size();
		HashMap aRow;
		String oldDateValue;
		Date oldDate;
		String tzOffset;
		String newDateValue;
		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		String tideServerTimezone = configMgr.getSystemPrefDescriptor().getServerTimeZone();

		if (tideServerTimezone.equalsIgnoreCase(timeZoneId))
			tideServerTimezone = actualtimeZoneId;
		else
			tideServerTimezone = getInternalTimeZoneId(tideServerTimezone);

		for (int count = 0; count < numRows; count++)
		{
			Calendar cal = Calendar.getInstance();
			Calendar timezoneCal = Calendar.getInstance(TimeZone.getTimeZone(tideServerTimezone));
			aRow = recordsList.get(count);
			oldDateValue = (String) aRow.get(dateColName);
			logger.ctdebug("CTBAS00065", oldDateValue);
			try
			{
				oldDate = defaultDateFormat.parse(oldDateValue);
				if (timeZoneId != null)
				{
					timezoneCal.setTime(oldDate);
					// Identify the actual time offset and convert the date to the timezone provided.
					tzOffset = convertToOffset(actualtimeZoneId, oldDate);
					cal = CTUtility.convertTimeZone(timezoneCal, tzOffset);
				} else
				{
					timezoneCal.setTime(oldDate);
					tzOffset = "";
				}

				userPrefDateFormat.setCalendar(cal);
				newDateValue = userPrefDateFormat.format(cal.getTime());
				logger.ctdebug("CTBAS00066", newDateValue);
				aRow.put(dateColName, newDateValue);
			} catch (ParseException parseEx)
			{
				logger.cterror("CTBAS00067", parseEx, oldDateValue);
			}
		}
	}

	/**
	 * This is helper method which return the converted server timezone.
	 * 
	 * @param date
	 * @param sourceTimezone
	 * @param TargetTimeZone
	 * @return Returns formattedDateAndTime in TargertTimezone
	 */
	public String getConvertedTimeInTargertTimezone(Date date, String sourceTimezone, String TargetTimeZone)
	{
		String formattedDateAndTime = "";
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		if (!getTimeZoneOffset(sourceTimezone).equals(getTimeZoneOffset(TargetTimeZone)))
		{
			String userOffset = getTimeZoneOffset(TargetTimeZone, date);
			Calendar calUser = CTUtility.convertTimeZone(cal, userOffset);
			formattedDateAndTime = formatDateAndTime(calUser);
		} else
		{
			formattedDateAndTime = formatDateAndTime(cal);
		}
		return formattedDateAndTime;
	}

	/**
	 * This is a helper method that goes through the list of records available and formats the data present in the
	 * amount column name to the user preferred date format and adds the timezone id provided.
	 * 
	 * @param hashmap values that needs the update
	 * @param dateColName The date column name
	 * 
	 * @param timeZoneId The user preferred time zone format.
	 * @param includeTimezone Flag indicating if timezone should be appended to the formatted date.
	 * 
	 */
	public void formatDateTime(HashMap hashmap, String dateColName, String timeZoneId, boolean includeTimezone)
	{
		String actualtimeZoneId = (timeZoneId == null) ? "" : getInternalTimeZoneId(timeZoneId);
		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		String tideServerTimezone = configMgr.getSystemPrefDescriptor().getServerTimeZone();

		SimpleDateFormat defaultDateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
		SimpleDateFormat newDateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");

		String oldDateValue;
		Date oldDate;
		String tzOffset;
		String newDateValue;

		if (tideServerTimezone.equalsIgnoreCase(timeZoneId))
			tideServerTimezone = actualtimeZoneId;
		else
			tideServerTimezone = getInternalTimeZoneId(tideServerTimezone);

		Calendar timezoneCal = Calendar.getInstance(TimeZone.getTimeZone(tideServerTimezone));
		Calendar cal = Calendar.getInstance();

		oldDateValue = (String) hashmap.get(dateColName);
		logger.ctdebug("CTBAS00065", oldDateValue);
		try
		{
			oldDate = defaultDateFormat.parse(oldDateValue);
			if (timeZoneId != null)
			{
				timezoneCal.setTime(oldDate);
				// Identify the actual time offset and convert the date to the timezone provided.
				tzOffset = convertToOffset(actualtimeZoneId, oldDate);
				cal = CTUtility.convertTimeZone(timezoneCal, tzOffset);
			} else
			{
				timezoneCal.setTime(oldDate);
				tzOffset = "";
			}

			newDateFormat.setCalendar(cal);
			newDateValue = newDateFormat.format(cal.getTime());
			logger.ctdebug("CTBAS00066", newDateValue);
			hashmap.put(dateColName, newDateValue);
		} catch (ParseException parseEx)
		{
			logger.cterror("CTBAS00067", parseEx, oldDateValue);
		}

	}

	/**
	 * This is the helper Method which return the converted date/time
	 * 
	 * @param recordsList
	 * @param dateColName
	 * @param timeZoneId
	 * @param tideServerTimezone
	 */
	public void formatSourcetoDestTz(ArrayList<HashMap> recordsList, String dateColName, String timeZoneId,
			String tideServerTimezone)
	{
		if (recordsList == null || recordsList.size() == 0)
			return;
		String actualtimeZoneId = (timeZoneId == null) ? "" : getInternalTimeZoneId(timeZoneId);

		SimpleDateFormat defaultDateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
		SimpleDateFormat newDateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");

		int numRows = recordsList.size();
		HashMap aRow;
		String oldDateValue;
		Date oldDate;
		String tzOffset;
		String newDateValue;

		tideServerTimezone = tideServerTimezone.trim();
		if (tideServerTimezone.trim().equalsIgnoreCase(timeZoneId))
			tideServerTimezone = actualtimeZoneId;
		else
			tideServerTimezone = getInternalTimeZoneId(tideServerTimezone);

		for (int count = 0; count < numRows; count++)
		{
			Calendar timezoneCal = Calendar.getInstance(TimeZone.getTimeZone(tideServerTimezone));
			Calendar cal = Calendar.getInstance();
			aRow = recordsList.get(count);
			oldDateValue = (String) aRow.get(dateColName);
			logger.ctdebug("CTBAS00068", oldDateValue);
			try
			{
				oldDate = defaultDateFormat.parse(oldDateValue);

				if (timeZoneId != null)
				{
					timezoneCal.setTime(oldDate);
					// Identify the actual time offset and convert the date to the timezone provided.
					tzOffset = convertToOffset(actualtimeZoneId, oldDate);
					cal = CTUtility.convertTimeZone(timezoneCal, tzOffset);
				} else
				{
					timezoneCal.setTime(oldDate);
					tzOffset = "";
				}

				newDateFormat.setCalendar(cal);
				newDateValue = newDateFormat.format(cal.getTime());
				logger.ctdebug("CTBAS00069", newDateValue);
				aRow.put(dateColName, newDateValue);
			} catch (ParseException parseEx)
			{
				logger.cterror("CTBAS00070", parseEx, oldDateValue);
			}
		}
	}

	/**
	 * This is the method gives the direction of given language.
	 * 
	 * @param langId id. eg: en_US
	 * @return Direction of the Language. eg: LTR for en_US
	 */
	public String getLangDirection(String langId)
	{
		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		DatabaseResult dbResult = new DatabaseResult();

		dbRequest.setDataAccessMapKey(PreferenceConstants.GET_LANGUAGE_DIRECTION);
		dbRequest.setOperation(DatabaseConstants.SELECT);
		dbRequest.setOperationExtension(PreferenceConstants.DIRECTION_FORMAT);
		dbRequest.addFilter(PreferenceConstants.LANGUAGE_ID, langId);

		try
		{
			dbResult = dbRequest.execute();
		} catch (DatabaseException dbx)
		{
			logger.cterror("CTBAS00071", dbx, langId);
		}
		Map<String, String> tempMap = new HashMap<String, String>();
		if (dbResult.getReturnedList().size() > 0)
		{
			tempMap = (Map<String, String>) dbResult.getReturnedList().get(0);
		}
		logger.ctdebug("CTBAS00072", tempMap);
		return tempMap.get(PreferenceConstants.DIRECTION_FORMAT);
	}

	/**
	 * This method is used to get specific timzone
	 * 
	 * @param String -mTimeZoneId - time zone id of specific location.
	 * @return String value of time zone
	 */
	public String loadGlobalPreferences(String mTimeZoneId)
	{
		String cmName = "JSPUtil.loadGlobalPreferences";
		logger.ctinfo("CTBAS00073", cmName);
		String offSet = "";

		try
		{
			offSet = getTimeZoneOffset(mTimeZoneId);
		} catch (Exception e)
		{
			logger.cterror("CTBAS00074", e, cmName, mTimeZoneId);
		}

		logger.ctinfo("CTBAS00075", cmName, offSet);
		return offSet;
	}

	/**
	 * 
	 * Helper method to convert the System default date time format to the user preferred date format + 24 hr time
	 * format
	 * 
	 * @param formatDateTime the format in which we want our datetime
	 * @param date the date to be converted
	 */
	public String formatUserPrefDateTime(String formatDateTime, String date)
	{
		SimpleDateFormat defaultDateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
		SimpleDateFormat newDateFormat = new SimpleDateFormat(formatDateTime);
		Date givenDate;
		String retVal = date;
		if (date != null && !"".equals(date))
		{
			try
			{
				givenDate = defaultDateFormat.parse(date);
				retVal = newDateFormat.format(givenDate);
			} catch (ParseException e)
			{
			}
		}
		return retVal;
	}

	/**
	 * Helper method to convert the String into date format
	 * 
	 * @param lastLoginDateTime
	 * @return
	 */
	public Date convertStringtoDate(String lastLoginDateTime)
	{

		Date date = null;
		try
		{

			SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

			date = formatter.parse(lastLoginDateTime);

		} catch (ParseException parseException)
		{
			logger.cterror("CTBAS00090", parseException, lastLoginDateTime);
		}

		return date;

	}

	private static final Logger logger = Logger.getLogger(GlobalPreferencesUtil.class);
	
}

