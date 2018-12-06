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

package com.intellectdesign.canvas.audit.handler;

import java.util.MissingResourceException;
import java.util.ResourceBundle;

import com.intellectdesign.canvas.logger.Logger;

/**
 * This is the translator class that is associated with the audit formatter for the purpose of handling field value.
 * translations (for example, the Status DR should be audited as 'Drafts', etc.)
 *  
 * @version 1.0
 */
public class AuditFieldTranslator implements IAuditTranslator
{

	/**
	 * The constructor which takes the event for which translator is created for.
	 */
	public AuditFieldTranslator()
	{

	}

	/**
	 * This method will be invoked when a particular field has expressed intent for translation. The default logic is to
	 * attempt to translate from the bundle present in the field config using the necessary pattern details provided
	 * along with the field value
	 * 
	 * @param aFieldConfig The Field configuration
	 * @param fieldValue The value of the field
	 * @return The translated value. In case translation was not possible, then the original value is returned
	 */
	public String translate(AuditFieldConfig aFieldConfig, String fieldValue)
	{
		String translatedValue = fieldValue;
		ResourceBundle bundle = null;
		// Step 1: Load the resource bundle at the field config.
		String bundleName = aFieldConfig.getFieldResourceBundle();
		if (!isNullOrEmpty(bundleName))
		{
			try
			{
				bundle = ResourceBundle.getBundle(bundleName, AuditConstants.DEFAULT_LOCALE);
			} catch (MissingResourceException e)
			{
				// Okay. So the bundle may not have been created like <bundle name>_en_US.properties. May be
				// present only like a simple property file. Try to load it as it is.
				try
				{
					bundle = ResourceBundle.getBundle(bundleName);
				} catch (MissingResourceException re)
				{
					logger.cterror("CTAUD00137", re, bundleName, aFieldConfig.getFieldName());
				}
			}
		}
		// Step 2: If Bundle can be loaded, then try to read the data from bundle.
		if (bundle != null && !isNullOrEmpty(fieldValue))
		{
			String bundleKey = aFieldConfig.getLabelPrefix() + fieldValue;
			try
			{
				translatedValue = bundle.getString(bundleKey);
			} catch (MissingResourceException e)
			{
				logger.cterror("CTAUD00138", bundleKey, bundleName);
				translatedValue = fieldValue;
			}
		}
		return translatedValue;
	}

	/**
	 * Helper method to check of the value provided is empty.
	 * 
	 * @param the value to be checked for empty
	 * @return true if the value provided is empty
	 */
	private boolean isNullOrEmpty(String aValue)
	{
		return isNullOrEmpty(aValue, "");
	}

	/**
	 * Helper method to check of the value provided is empty. Empty condition is validated by comparing against the
	 * default value provided
	 * 
	 * @param the value to be checked for empty
	 * @param defaultVal This is the default value to be checked to identify whether given value is empty
	 * @return true if the value provided is empty
	 */
	private boolean isNullOrEmpty(String aValue, String defaultVal)
	{
		return (aValue == null) || (aValue.equals(defaultVal));
	}

	private static final Logger logger = Logger.getLogger(AuditFieldTranslator.class);
}
