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

package com.intellectdesign.canvas.data.conversion.util;

/**
 * This class is for OnLineJSONToHashMAPConverter conatins JSONHashMap
 * 
 * @version 1.0
 */
public class OnlineJSONToHashmapConverter extends JSONToHashMapConverter
{

	/**
	 * Super class constructor
	 */
	public OnlineJSONToHashmapConverter()
	{
		super();
	}

	/**
	 * Constructor with sDateFormat as param
	 * 
	 * @param sDateFormat
	 */
	public OnlineJSONToHashmapConverter(String sDateFormat)
	{
		super(sDateFormat);
	}

	/**
	 * Overloaded constructor interpretAsDate and interpretAsNumber as params
	 * 
	 * @param interpretAsDate
	 * @param interpretAsNumber
	 */
	public OnlineJSONToHashmapConverter(boolean interpretAsDate, boolean interpretAsNumber)
	{
		super(interpretAsDate, interpretAsNumber);

	}

	/**
	 * This method is used to validate the passing param as Date Filed or not
	 * 
	 * @param sFieldName
	 */
	@Override
	public boolean isDateField(String sFieldName)
	{
		for (int i = 0; i < DATE_SUFFIX.length; ++i)
			if (sFieldName.endsWith(DATE_SUFFIX[i]))
				return true;
		return false;
	}

	/**
	 * This method is used to validate the passing param as Number Filed or not
	 * 
	 * @param sFieldName
	 */
	@Override
	public boolean isNumberField(String sFieldName)
	{
		for (int i = 0; i < NUM_SUFFIX.length; ++i)
			if (sFieldName.endsWith(NUM_SUFFIX[i]))
				return true;
		return false;
	}

	public static String[] DATE_SUFFIX = { "_DATE", "_DT", "_Dt" };
	public static String[] NUM_SUFFIX =	{ "_AMT", "_NUM", "_AMOUNT" };
}
