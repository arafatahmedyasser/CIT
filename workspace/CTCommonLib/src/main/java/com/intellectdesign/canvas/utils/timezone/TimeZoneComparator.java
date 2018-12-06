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

package com.intellectdesign.canvas.utils.timezone;

import java.util.Comparator;

import com.intellectdesign.canvas.constants.preferences.PreferenceConstants;

/**
 * This class contains the Time Zone Comparator
 * 
 * @version 1.0
 */
public final class TimeZoneComparator implements Comparator<TimeZoneData>
{
	private String sortKey;

	/**
	 * The only constructor. Takes the sort field
	 * 
	 * @param sortField The sort field. Refer to the constants defined in PreferenceConstants.TZ_KEY_xxx for the various
	 *            sort options.
	 */
	public TimeZoneComparator(String sortField)
	{
		sortKey = sortField;
	}

	/**
	 * Compare based on the sort field provided and return the comparison status
	 * 
	 * @param arg0 The first TimeZoneData object
	 * @param arg1 The second TimeZoneData object
	 * @return int 0 if both are same, -1 if first is less than second, 1 otherwise.
	 */
	public int compare(TimeZoneData arg0, TimeZoneData arg1)
	{
		String firstValue = getCompareValue(arg0);
		String secondValue = getCompareValue(arg1);

		return firstValue.compareTo(secondValue);
	}

	/**
	 * Helper method to get the actual compare value from the given object.
	 * 
	 * @param aTz
	 * @return String
	 */
	private String getCompareValue(TimeZoneData aTz)
	{
		String retVal = "";
		if (PreferenceConstants.TZ_KEY_CODE.equals(sortKey))
			// Handle the time zone code properly as this is actually a numeric sequence present as string. a Lpad with
			// 0 ensures that proper comparison happens
			retVal = String.format("%05d", Integer.valueOf(aTz.getCode()));
		else if (PreferenceConstants.TZ_KEY_REGIONCODE.equals(sortKey))
			retVal = aTz.getRegionCode();
		else if (PreferenceConstants.TZ_KEY_GMTOFFSET.equals(sortKey))
			retVal = aTz.getGmtOffset();
		else if (PreferenceConstants.TZ_KEY_DESCRIPTION.equals(sortKey))
			retVal = aTz.getDescription();
		else if (PreferenceConstants.TZ_KEY_NICKNAME.equals(sortKey))
			retVal = aTz.getNickname();
		return retVal;
	}
}
