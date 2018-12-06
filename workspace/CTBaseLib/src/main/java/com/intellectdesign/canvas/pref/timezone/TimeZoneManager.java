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
package com.intellectdesign.canvas.pref.timezone;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.intellectdesign.canvas.cache.handler.CacheManager;
import com.intellectdesign.canvas.constants.preferences.PreferenceConstants;
import com.intellectdesign.canvas.preferences.PreferenceManager;
import com.intellectdesign.canvas.utils.timezone.TimeZoneComparator;
import com.intellectdesign.canvas.utils.timezone.TimeZoneData;
import com.intellectdesign.canvas.value.ListValue;

/**
 * This is a simple manager for handling the Timezone related content. No instances of this class is expected to be
 * created. It provides only utility functions
 * 
 * @version 1.0
 */
public final class TimeZoneManager
{
	/**
	 * Marking constructor privat to ensure that no instance can be created.
	 */
	private TimeZoneManager()
	{

	}

	/**
	 * This method retrieves the complete timezone data for the given code.
	 * 
	 * @param tzcode The code provided
	 * @return The TimeZoneData details for the provided code
	 */
	public static ListValue getTimeZoneDataFor(String tzcode)
	{
		//
		PreferenceManager pm = new PreferenceManager();
		ListValue timezone = pm.getPreferenceValueFor("TIMEZONE", tzcode);
		return timezone;
	}

	/**
	 * Helper method that returns the GMT Offset for the given Timezone code
	 * 
	 * @param tzCode The time zone code
	 * @return The GMT offset
	 */
	public static String getGMTOffsetFor(String tzCode)
	{
		return TimeZoneManager.getTimeZoneDataFor(tzCode).getAdditionalProperties().get("ATTRIBUTE_VALUE");
	}

	/**
	 * Helper method that returns the Region code for the given Timezone code
	 * 
	 * @param tzCode The time zone code
	 * @return The Region code
	 */
	public static String getRegionCodeFor(String tzCode)
	{
		return TimeZoneManager.getTimeZoneDataFor(tzCode).getAdditionalProperties().get("regionCode");
	}

	/**
	 * Helper method that returns the nickname for the given Timezone code
	 * 
	 * @param tzCode The time zone code
	 * @return The Nickname
	 */
	public static String getNickNameFor(String tzCode)
	{
		return TimeZoneManager.getTimeZoneDataFor(tzCode).getAdditionalProperties().get("nickname");
	}

	/**
	 * This method returns the complete Timezone listing as a sorted list where the contents are sorted by the timezone
	 * code internally.
	 * 
	 * @param sortByCode If true, then the content should be sorted by code ascending.
	 * @return
	 */
	public static List<TimeZoneData> getAllTimezones(boolean sortByCode)
	{
		String sortColumn = sortByCode ? PreferenceConstants.TZ_KEY_CODE : PreferenceConstants.TZ_KEY_REGIONCODE;
		List allTzDetails = CacheManager.getInstance().getDataFromCache(null,
				PreferenceConstants.CACHE_KEY_TIMEZONE_FULL);
		// Create a new list and copy the list of timezones from cache.
		List<TimeZoneData> sortedList = new ArrayList<TimeZoneData>();
		sortedList.addAll((List<TimeZoneData>) allTzDetails.get(1));

		TimeZoneComparator aComparator = new TimeZoneComparator(sortColumn);
		// Sort the list based on the comparator
		Collections.sort(sortedList, aComparator);
		return sortedList;
	}
}
