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
package com.intellectdesign.canvas.provider;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Locale;
import java.util.PropertyResourceBundle;
import java.util.ResourceBundle;

import com.intellectdesign.canvas.logger.Logger;

/**
 * This class is for DirectResourceProvider
 * 
 * @version 1.0
 */
public class DirectResourceProvider implements Serializable
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = 5317208651759235331L;
	private static final Logger dbLogger = Logger.getLogger(DirectResourceProvider.class);
	private static HashMap sourceMap = new HashMap();
	private ResourceBundle bundle = null;

	public DirectResourceProvider()
	{
	}

	/**
	 * This function return an instance of the class for the given language and country If no specific instance exists a
	 * new instance is created for the following input and is returned . The resource bundle is cached in this instance
	 * 
	 * @param input param String language,String country output param DirectResourceProvider instance
	 */
	public static DirectResourceProvider getInstance(String resource, String language, String country)
	{
		DirectResourceProvider resourceProvider = (DirectResourceProvider) sourceMap.get(resource + language + country);
		try
		{
			if (resourceProvider == null)
			{
				Locale currLocale = new Locale(language, country);

				resourceProvider = new DirectResourceProvider();
				resourceProvider.bundle = PropertyResourceBundle.getBundle(resource, currLocale);

				sourceMap.put(resource + language + country, resourceProvider);
			}
		} catch (Exception ex)
		{
			dbLogger.cterror("CTBAS00031", ex);
		}

		return resourceProvider;
	}

	/**
	 * This function return an instance of the class for the given language and country If no specific instance exists a
	 * new instance is created for the following input and is returned . The resource bundle is cached in this instance
	 * 
	 * @param input param String resorce,String locale output param DirectResourceProvider instance
	 */
	public static DirectResourceProvider getInstance(String resource, String locale)
	{
		DirectResourceProvider resourceProvider = (DirectResourceProvider) sourceMap.get(resource + locale);
		try
		{
			if (resourceProvider == null)
			{
				Locale currLocale = new Locale(locale.substring(0, 2), locale.substring(3));

				resourceProvider = new DirectResourceProvider();
				resourceProvider.bundle = PropertyResourceBundle.getBundle(resource, currLocale);

				sourceMap.put(resource + locale, resourceProvider);
			}
		} catch (Exception ex)
		{
			dbLogger.cterror("CTBAS00031", ex);
		}

		return resourceProvider;
	}

	/**
	 * <code>getEquivalent</code>is a wrapper for the ResourceBundle's getString() method
	 * 
	 * @param label
	 */
	public String getEquivalent(String label)
	{
		try
		{
			return bundle.getString(label);
		} catch (Exception ex)
		{
			dbLogger.cterror("CTBAS00032", ex, label);
			return replaceInvalidChars(label);
		}
	}

	/**
	 * this ref to return get Keyvale to LabelEquivalent <code>getLabelEquivalent</code>is a wrapper for the
	 * ResourceBundle's getString() method
	 * 
	 * @param KeyValue
	 */
	public String getLabelEquivalent(String keyValue)
	{
		try
		{
			return bundle.getString("LBL_" + keyValue);
		} catch (Exception ex)
		{
			dbLogger.cterror("CTBAS00032", ex, "LBL_" + keyValue);
			return keyValue;
		}
	}

	/**
	 * ref to method ReplaceInvalidChars
	 * 
	 * @param val
	 * @return
	 */
	private String replaceInvalidChars(String val)
	{
		if (val == null)
			return val;
		val = replaceAll(val, "%", "&#37;");
		val = replaceAll(val, "$", "&#36;");
		val = replaceAll(val, "&", "&#38;");
		val = replaceAll(val, "+", "&#43;");
		val = replaceAll(val, ";", "&#59;");
		val = replaceAll(val, "=", "&#61;");
		val = replaceAll(val, "?", "&#63;");
		val = replaceAll(val, "#", "&#35;");
		val = replaceAll(val, "{", "&#123;");
		val = replaceAll(val, "}", "&#125;");
		val = replaceAll(val, "|", "&#124;");
		val = replaceAll(val, "[", "&#91;");
		val = replaceAll(val, "]", "&#93;");
		val = replaceAll(val, "`", "&#96;");
		val = replaceAll(val, "<", "&#60;");
		val = replaceAll(val, ">", "&#62;");
		val = replaceAll(val, "\"", "&#92;");
		val = replaceAll(val, "'", "&#39;");
		return val;
	}

	/**
	 * This methos is used String ReplacesAll
	 * 
	 * @param value
	 * @param from
	 * @param to
	 * @return
	 */
	private String replaceAll(String value, String from, String to)
	{
		if (value == null || from == null || to == null || from.length() < 1 || value.indexOf(from) == -1)
			return value;
		StringBuffer replaced = new StringBuffer();
		int index = value.indexOf(from);
		while (index != -1)
		{
			replaced.append(value.substring(0, index)).append(to);
			value = value.substring(index + from.length());
			index = value.indexOf(from);
		}
		return replaced.append(value).toString();
	}
}
