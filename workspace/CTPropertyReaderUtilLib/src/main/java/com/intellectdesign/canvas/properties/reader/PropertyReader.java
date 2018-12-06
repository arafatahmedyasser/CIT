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

import java.util.MissingResourceException;
import java.util.PropertyResourceBundle;
import java.util.ResourceBundle;

import com.intellectdesign.canvas.logger.Logger;

/**
 * This class is responsible for reading a propery key value from property resource files
 * 
 * @version 1.0
 */
public class PropertyReader
{
	/**
	 * Default Constructor
	 */
	public PropertyReader()
	{

	}

	/**
	 * This constructor initializes the property reader for reading from a particular property file.
	 * 
	 * @param propertyFileName string value of the name of the property file
	 */
	public PropertyReader(String propertyFileName)
	{
		this.propertyFileName = propertyFileName;
	}

	private String propertyFileName;

	/**
	 * This method returns the property file name currently in use
	 * 
	 * @return propertyFileName string value of the name of the property file
	 */
	public String getPropertyFileName()
	{
		return propertyFileName;
	}

	/**
	 * This method sets the property file name for current use
	 * 
	 * @param propertyfileName string value of the name of the property file
	 */
	public void setPropertyFileName(String propertyfileName)
	{
		// propertyfileName = propertyFileName;
		propertyFileName = propertyfileName;
	}

	/**
	 * This method retrieves the description from a resource file given the property. If the value for the key is not
	 * found, the method will return the key itself as value
	 * 
	 * @param aPropFileName string value of the property file that contains the property key
	 * @param propertyName string value of the propery key to look for in the resource file
	 * 
	 * @return propertyValue string value of property key found the in the property file for the given property
	 */
	public String retrieveProperty(String aPropFileName, String propertyName)
	{
		String propertyValue = null;

		logger.ctinfo("CTPRU00003", aPropFileName, propertyName);

		setPropertyFileName(aPropFileName);

		// retriving the resource bundle to read from the propertyFileName
		ResourceBundle rsBundle = retrieveBundle();
		if (rsBundle != null)
		{
			try
			{
				if (propertyName != null)
				{
					propertyValue = rsBundle.getString(propertyName);
					logger.ctdebug("CTPRU00004", propertyValue);
				} else
				{
					logger.cterror("CTPRU00005");
				}
			} catch (MissingResourceException rsEx)
			{
				logger.cterror("CTPRU00006", rsEx, propertyName);
				propertyValue = propertyName;
			}
		}
		logger.ctinfo("CTPRU00007");
		return propertyValue;
	}

	/**
	 * This method retrieves the property value for the given property key
	 * 
	 * @param propertyName String propertyName Key for which value has to be picked from the property file
	 * @return Returns the key description from the property file
	 */
	public String retrieveProperty(String propertyName)
	{
		logger.ctinfo("CTPRU00008", propertyName);
		String propertyValue = null;
		propertyValue = retrieveProperty(this.propertyFileName, propertyName);
		logger.ctinfo("CTPRU00009");
		return propertyValue;
	}

	/**
	 * This method retrieves the <code>ResourceBundle</code> object to read fromt the property file name.
	 * 
	 * @return rsBundle the resource bundle object containing the property file passed
	 */
	private ResourceBundle retrieveBundle()
	{
		ResourceBundle rsBundle = null;

		logger.ctinfo("CTPRU00010");

		// iniatializing Property file
		if (propertyFileName != null)
		{
			try
			{
				rsBundle = PropertyResourceBundle.getBundle(propertyFileName);
			} catch (MissingResourceException rsEx)
			{
				logger.cterror("CTPRU00011", rsEx, propertyFileName);
			}
		} else
		{
			logger.cterror("CTPRU00012");
		}
		logger.ctinfo("CTPRU00013");
		return rsBundle;
	}

	/**
	 * An instance for Logger
	 */
	private static final Logger logger = Logger.getLogger(PropertyReader.class);
}
