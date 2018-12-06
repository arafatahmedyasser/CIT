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

package com.intellectdesign.canvas.utils;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.MissingResourceException;
import java.util.PropertyResourceBundle;
import java.util.ResourceBundle;

/**
 * This is a helper class that contains utility functions related to using Resource bundles. Note: This class has been
 * created as a Singleton as it is only a collection of utility functions
 * 
 * @version 1.0
 */
public final class ResourceBundleUtils
{

	/**
	 * Marking constructor private to avoid any instantiation of this class
	 */
	private ResourceBundleUtils()
	{
	}

	/**
	 * This method checks whether the provided bundle can be loaded from the class path.
	 * 
	 * @param bundleName The name of the bundle
	 * @return true if the bundle can be loaded, otherwise false
	 */
	public static boolean isPropertyBundlePresent(String bundleName)
	{
		boolean bundlePresent = false;
		try
		{
			ResourceBundle.Control rbc = new ResourceBundle.Control()
			{
				/**
				 * method ref to list ResourceBundleControl CandidateLocales
				 * 
				 * @param baseName
				 * @param locale
				 * @return
				 * @see java.util.ResourceBundle.Control#getCandidateLocales(java.lang.String, java.util.Locale)
				 */
				@Override
				public List<Locale> getCandidateLocales(String baseName, Locale locale)
				{
					{
						if (baseName == null)
							throw new NullPointerException();
					}
					return Arrays.asList(Locale.ROOT);
				}

				/**
				 * method ref to Controlformats
				 * 
				 * @param baseName
				 * @return
				 * @see java.util.ResourceBundle.Control#getFormats(java.lang.String)
				 */
				@Override
				public List<String> getFormats(String baseName)
				{
					if (baseName == null)
					{
						throw new NullPointerException();
					}
					return FORMAT_PROPERTIES;
				}

			};

			PropertyResourceBundle.getBundle(bundleName, Locale.ROOT, rbc);
			bundlePresent = true;
		} catch (MissingResourceException e)
		{
			// Exception means that the bundle could not be loaded. So return false
			bundlePresent = false;
		}
		return bundlePresent;
	}

	/**
	 * This method checks whether the propKey provided is defined within the property bundle provided.
	 * 
	 * @param bundleName The name of the bundle
	 * @param propKey The Property Key to be validated within the bundle
	 * @return true if the key is found. False otherwise
	 */
	public static boolean isPropertyKeyPresent(String bundleName, String propKey)
	{
		boolean propKeyPresent = false;
		try
		{
			ResourceBundle propBundle = PropertyResourceBundle.getBundle(bundleName);
			propBundle.getString(propKey);
			propKeyPresent = true;
		} catch (MissingResourceException e)
		{
			// Exception will be thrown if the bundle is not present, or the key is missing in the bundle. Either way
			// this is a missing key scenario. So set the flag to false
			propKeyPresent = false;
		}
		return propKeyPresent;
	}

	/**
	 * This method checks whether the propKey provided is defined within the property bundle provided.
	 * 
	 * @param propBundle The bundle object
	 * @param propKey The Property Key to be validated within the bundle
	 * @return true if the key is found. False otherwise
	 */
	public static boolean isPropertyKeyPresent(PropertyResourceBundle propBundle, String propKey)
	{
		boolean propKeyPresent = false;
		try
		{
			propBundle.getString(propKey);
			propKeyPresent = true;
		} catch (MissingResourceException e)
		{
			// Exception will be thrown if the bundle is not present, or the key is missing in the bundle. Either way
			// this is a missing key scenario. So set the flag to false
			propKeyPresent = false;
		}
		return propKeyPresent;
	}

	/**
	 * This method checks whether the provided bundle can be loaded from the class path.
	 * 
	 * @param bundleName The name of the bundle
	 * @param languageId The language Id in the Locale format
	 * @return true if the bundle can be loaded, otherwise false
	 */
	public static boolean isResourceBundlePresent(String bundleName, String languageId)
	{
		boolean bundlePresent = false;
		try
		{
			ResourceBundle.getBundle(bundleName + "_" + languageId);
			bundlePresent = true;
		} catch (MissingResourceException e)
		{
			// Exception means that the bundle could not be loaded. So return false
			bundlePresent = false;
		}
		return bundlePresent;
	}

	/**
	 * This method checks whether the propKey provided is defined within the resource bundle provided.
	 * 
	 * @param bundleName The name of the bundle
	 * @param languageId The language Id in the Locale format
	 * @param propKey The Property Key to be validated within the bundle
	 * @return true if the key is found. False otherwise
	 */
	public static boolean isResourceBundleKeyPresent(String bundleName, String languageId, String propKey)
	{
		boolean propKeyPresent = false;
		try
		{
			ResourceBundle aBundle = ResourceBundle.getBundle(bundleName + "_" + languageId);
			aBundle.getString(propKey);
			propKeyPresent = true;
		} catch (MissingResourceException e)
		{
			// Exception will be thrown if the bundle is not present, or the key is missing in the bundle. Either way
			// this is a missing key scenario. So set the flag to false
			propKeyPresent = false;
		}
		return propKeyPresent;
	}

	/**
	 * This method checks whether the propKey provided is defined within the resource bundle provided.
	 * 
	 * @param aBundle The bundle
	 * @param propKey The Property Key to be validated within the bundle
	 * @return true if the key is found. False otherwise
	 */
	public static boolean isResourceBundleKeyPresent(ResourceBundle aBundle, String propKey)
	{
		boolean propKeyPresent = false;
		try
		{
			aBundle.getString(propKey);
			propKeyPresent = true;
		} catch (MissingResourceException e)
		{
			// Exception will be thrown if the bundle is not present, or the key is missing in the bundle. Either way
			// this is a missing key scenario. So set the flag to false
			propKeyPresent = false;
		}
		return propKeyPresent;
	}

	/**
	 * This method tries to load the key from the bundle provided. If there are any issues, then it returns the default
	 * value provided
	 * 
	 * @param bundleName The name of the bundle
	 * @param propKey The Property Key to be retrieved within the bundle
	 * @param defaultValue The default value to be returned if the key is missing in the bundle
	 * @return The value for the key from the bundle
	 */
	public static String getString(String bundleName, String propKey, String defaultValue)
	{
		String returnValue;
		try
		{
			ResourceBundle aBundle = ResourceBundle.getBundle(bundleName);
			returnValue = aBundle.getString(propKey);
		} catch (MissingResourceException e)
		{
			// Exception will be thrown if the bundle is not present, or the key is missing in the bundle. Either way
			// this is a missing key scenario. So set the flag to false
			returnValue = defaultValue;
		}
		return returnValue.trim();
	}

	/**
	 * This method tries to load the key from the bundle provided. If there are any issues, then it returns the default
	 * value provided
	 * 
	 * @param aBundle The bundle
	 * @param propKey The Property Key to be retrieved within the bundle
	 * @param defaultValue The default value to be returned if the key is missing in the bundle
	 * @return The value for the key from the bundle
	 */
	public static String getString(ResourceBundle aBundle, String propKey, String defaultValue)
	{
		String returnValue;
		try
		{
			returnValue = aBundle.getString(propKey);
		} catch (MissingResourceException e)
		{
			// Exception will be thrown if the bundle is not present, or the key is missing in the bundle. Either way
			// this is a missing key scenario. So set the flag to false
			returnValue = defaultValue;
		}
		return returnValue.trim();
	}

	/**
	 * This method tries to load the key from the bundle provided. If there are any issues, then it returns the default
	 * value provided
	 * 
	 * @param bundleName The name of the bundle
	 * @param propKey The Property Key to be retrieved within the bundle
	 * @param defaultValue The default value to be returned if the key is missing in the bundle
	 * @param languageId The language Id in the Locale format
	 * @return The value for the key from the bundle
	 */
	public static String getString(String bundleName, String propKey, String defaultValue, String languageId)
	{
		String returnValue;
		try
		{
			ResourceBundle aBundle = ResourceBundle.getBundle(bundleName + "_" + languageId);
			returnValue = aBundle.getString(propKey);
		} catch (MissingResourceException e)
		{
			// Exception will be thrown if the bundle is not present, or the key is missing in the bundle. Either way
			// this is a missing key scenario. So set the flag to false
			returnValue = defaultValue;
		}
		return returnValue.trim();
	}

}
