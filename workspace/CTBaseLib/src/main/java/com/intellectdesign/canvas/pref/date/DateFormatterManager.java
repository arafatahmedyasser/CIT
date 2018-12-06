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
package com.intellectdesign.canvas.pref.date;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;

import com.intellectdesign.canvas.data.conversion.util.HashMapToJSONConverter;
import com.intellectdesign.canvas.exceptions.common.BaseException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.utils.ResourceLoaderUtils;

/**
 * DateFormatterManager is helper class provides many class methods for date format . No instances of this class is ever
 * expected to be created.
 * 
 * @Version 1.0
 */
public final class DateFormatterManager
{
	private static final Logger logger = Logger.getLogger(DateFormatterManager.class);

	/**
	 * Marking the constructor private to avoid instance creation.
	 */
	private DateFormatterManager()
	{

	}

	/**
	 * Helps this method lookup in registry and returns DateFormatConfig object
	 * 
	 * @param toformat
	 * @return DateFormatConfig
	 */
	public static DateFormatConfig getDateFormat(String toformat)
	{
		String mName = "getDateFormat()";
		DateFormatConfig dateFormat = null;
		// look up in DateFormatRegistry with toformat(dateId) and it returns DateFormatConfig object
		DateFormatRegistry datefrmtRegistry = DateFormatRegistry.getInstance();
		try
		{
			dateFormat = (DateFormatConfig) datefrmtRegistry.lookup(toformat);
		} catch (Exception e)
		{
			logger.cterror("CTBAS00110", e, mName);
		}
		return dateFormat;

	}

	/**
	 * Helps this method convert date format object into DateFormat Json string.
	 * 
	 * @param date string -The JavaDateformat
	 * @return String- Json String
	 * @throws BaseException
	 */
	public static String getDateFormatJson(String dateStr)
	{
		HashMap dateHashMap = new HashMap();
		StringBuffer one = new StringBuffer();
		StringBuffer two = new StringBuffer();
		StringBuffer three = new StringBuffer();
		StringBuffer separators = new StringBuffer();
		int index = 0;
		int count = 0;
		int firstSepIndex = 0;
		for (int i = 0; i < dateStr.length(); i++)
		{
			char dateChar = dateStr.charAt(i);
			index = dateStr.indexOf(dateChar);
			if ((firstSepIndex != index)
					&& ((dateChar >= 'a' && dateChar <= 'z') || (dateChar >= 'A' && dateChar <= 'Z')))
			{
				separators.append("N");
				firstSepIndex = index;
			}
			if ((dateChar >= 'a' && dateChar <= 'z') || (dateChar >= 'A' && dateChar <= 'Z'))
			{
				if (index == 0)
				{
					one.append(dateChar);
					count++;
				} else if (index > 0 && count == index)
				{
					two.append(dateChar);
				} else
				{
					three.append(dateChar);
				}
			} else
			{
				if (dateChar == ' ')
					dateChar = 'S';
				separators.append(dateChar);
				count++;
				firstSepIndex = index + 1;
			}

		}
		dateHashMap.put("datePositionOne", one.toString());
		dateHashMap.put("datePositionTwo", two.toString());
		dateHashMap.put("datePositionThree", three.toString());

		if (separators.length() >= 2)
		{
			dateHashMap.put("dateSeparatorOne", separators.substring(0, 1));
			dateHashMap.put("dateSeparatorTwo", separators.substring(1, 2));
		} else
		{
			dateHashMap.put("dateSeparatorOne", separators.toString());
		}
		String jsonString = HashMapToJSONConverter.convertHashMapToJSONFormat(dateHashMap);
		return jsonString;
	}

	/**
	 * Hepls this method to get formatted Date value for the given Date.
	 * 
	 * @param dateStr
	 * @param toformat
	 * @return formattedDate
	 */
	public static String getFormattedDate(String dateStr, String toformat)
	{
		String mName = "getFormattedDate()";
		IDateFormatter dateFormatter = null;
		DateFormatConfig dateFormat = null;
		String formattedDate = null;
		dateFormat = getDateFormat(toformat);
		try
		{
			dateFormatter = (IDateFormatter) ResourceLoaderUtils.createInstance(dateFormat.getFormatterClass(),
					(Object[]) null);
			formattedDate = dateFormatter.formatDate(dateStr, dateFormat.getJavaDateFormat());
		} catch (Exception exp)
		{
			logger.cterror("CTBAS00112", exp, mName);

		}
		return formattedDate;
	}

	/**
	 * This is utility method to get JavaDateFormat one time lookup for the DateId.
	 * 
	 * @param sDateformat- dateId
	 * @return jDateFormat- The JavaDateFormat
	 */
	public static String getJavaDateFormat(String sDateformat)
	{
		String jDateFormat = null;
		DateFormatConfig dateFormat = null;
		dateFormat = getDateFormat(sDateformat);
		jDateFormat = dateFormat.getJavaDateFormat();
		return jDateFormat;

	}

	/**
	 * This method is used to format given date to standard format(dd/MM/yyyy).
	 * 
	 * @param inComingDateformat - The format of incoming date
	 * @param date - date value as String which needs to be format
	 * @return Returns date value in standard format as String . If inComingDateformat or date value are invalid then
	 *         this api returns date with out formating Userformat to standard format
	 */
	public static String convertDateToStandardFormat(String inComingDateformat, String date)
	{
		String cmName = "DateFormatterManaager.convertDateToStandardFormat(String,String)";
		String returnDate = "";
		try
		{
			if (date != null && !date.trim().equals(""))
			{
				if (inComingDateformat != null && !inComingDateformat.trim().equals(""))
				{
					SimpleDateFormat sdf = new SimpleDateFormat(inComingDateformat);
					Date parsedDate = sdf.parse(date);
					SimpleDateFormat standardsdf = new SimpleDateFormat("dd/MM/yyyy");
					returnDate = standardsdf.format(parsedDate);
				} else
				{
					returnDate = date;
					logger.cterror("CTBAS00113", cmName, date);
				}
			} else
			{
				logger.ctdebug("CTBAS00114", cmName);
			}
		} catch (ParseException pe) // just in case any runtime exception occurred just return input datestr as it is
		{
			returnDate = date;
			logger.cterror("CTBAS00115", pe, cmName, date, inComingDateformat);
		}
		return returnDate;
	}

	/**
	 * Method that returns Date String for the given Format and Date Object
	 * 
	 * @param format String
	 * @param date Date
	 * @return String
	 * @deprecated As of LS410, parameter Date is replaced by Calendar.
	 */
	public static String getDateAndTimeString(String format, Date date)
	{

		SimpleDateFormat simpleDateFormat = new SimpleDateFormat(format);
		String dateandtime = "";
		try
		{
			dateandtime = simpleDateFormat.format(date);
		} catch (Exception e)
		{
			logger.cterror("CTBAS00119", e, format);
		}
		return dateandtime;
	}

	/**
	 * Returns the date in new format.
	 * 
	 * @param sDate
	 * @param sOldFormat - The old format of the date.
	 * @param sNewFormat - The new format in which it is expected
	 * @return String - The date in the new format
	 */
	public static String convertDateTo(String sDate, String sOldFormat, String sNewFormat)
	{
		String cmName = "DateFormatterManager.convertDateTo(String,String,String)";
		logger.ctdebug("CTBAS00116", cmName, sDate, sOldFormat, sNewFormat);
		SimpleDateFormat newDateFormat = new SimpleDateFormat(sNewFormat);
		SimpleDateFormat oldDateFormat = new SimpleDateFormat(sOldFormat);
		String sOldDate = sDate;
		Date date = null;
		String sNewDate = null;
		try
		{
			date = oldDateFormat.parse(sOldDate);
		} catch (ParseException pException)
		{
			logger.cterror("CTBAS00117", pException, cmName, sDate, sOldFormat, sNewFormat);
		}
		sNewDate = newDateFormat.format(date);
		logger.ctdebug("CTBAS00118", sNewDate);
		return sNewDate;
	}

}
