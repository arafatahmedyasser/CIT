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

package com.intellectdesign.canvas.properties.reader;

import java.util.PropertyResourceBundle;
import java.util.ResourceBundle;

/**
 * This class contains necessary methods to handle Resource bundle.
 * 
 * @version 1.0
 */
public class CTProperties
{
	public static String propertyFileName = "CT";
	static ResourceBundle bundle = getProperties();

	/**
	 * This method get property file value from provided property name
	 * 
	 * @param : String
	 * @return : String
	 */

	public static String getProperty(String propertyName)
	{
		String propertyValue = "";
		try
		{
			if (propertyName == null || propertyName.equals(""))
				return "";

			if (bundle != null)
			{
				propertyValue = bundle.getString(propertyName);

			}
		} catch (Exception exception)
		{

			return "";
		}

		return propertyValue;
	}

	/**
	 * This method creates new Resource bundle and from that it gets the correspong property value.
	 * 
	 * @param ResourceBundleName
	 * @param locale
	 * @param propertyName
	 * @return : String Value of the given key for the given bundle and locale
	 */

	public static String getProperty(String resourceBundleName, String locale, String propertyName)
	{
		String propertyValue = "";
		ResourceBundle resource = null;

		try
		{
			if (propertyName == null || propertyName.equals(""))
				return "";

			if (resourceBundleName == null || resourceBundleName.equals(""))
				return "";

			resourceBundleName = resourceBundleName + locale;

			resource = PropertyResourceBundle.getBundle(resourceBundleName);

			if (resource != null)
			{
				propertyValue = resource.getString(propertyName);

			}
		} catch (Exception exception)
		{

			return "";
		}

		return propertyValue;
	}

	/**
	 * METHOD TO LOAD THE BASIC SYSTEM PROPERTIES
	 * 
	 * @return resource bundle
	 */
	private static ResourceBundle getProperties()
	{
		ResourceBundle aBundle = null;
		try
		{
			aBundle = PropertyResourceBundle.getBundle(propertyFileName);

		} catch (Exception ex)
		{

		}
		return aBundle;
	}
}
