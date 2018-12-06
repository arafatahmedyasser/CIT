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

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.properties.reader.PropertyReader;

/**
 * This is the audit formatter used to audit the data in normal text format.
 *  
 * @version 1.0
 */
public class AuditDataTextFormatter implements IAuditOutputFormatter
{
	private StringBuffer sbAuditData = null;
	private boolean auditOldValues;

	/**
	 * The default Constructor for AuditDataTextFormatter
	 * 
	 */
	public AuditDataTextFormatter()
	{
	}

	/**
	 * Here we check if the content can be parsed by us. Basically search for patterns like the field delimiter or line
	 * delimiter that is used.
	 * 
	 * @param auditContent
	 * @return true
	 */
	public boolean canParse(String auditContent)
	{
		// Always return true as we will somehow try to parse the content using old or new style text formats being
		// generated.
		return true;
	}

	/**
	 * Performs the actual parse of the content to try retrieve the old and new values
	 * 
	 * @param content
	 * @param format
	 * @param mode
	 * @return retVal
	 * @throws AuditHandlerException
	 */
	public Map<String, Object> parse(String content, ParseOutputFormat format, ParseOutputMode mode)
			throws AuditHandlerException
	{
		Map<String, Object> retVal = new HashMap<String, Object>();
		String startKey = "[" + OLD_PREFIX_LABEL + "]=";
		if (content.startsWith(startKey))
		{
			// This is as per the new format

		} else
		{
			// It is the old format. Set the result in the key that this is unparseable.
			retVal.put("UNPARSED_CONTENT", content);
		}
		return retVal;
	}

	/**
	 * This method is used for performing format operation
	 * 
	 * @param auditMetricsList
	 * @param auditConfig
	 * @param shouldAuditOldValues
	 * @return getDataAsString
	 * @throws AuditHandlerException
	 * @see IAuditOutputFormatter
	 */
	public String format(List<AuditFieldMetrics> auditMetricsList, AuditDataValue auditConfig,
			boolean shouldAuditOldValues) throws AuditHandlerException
	{
		setAuditOldValues(shouldAuditOldValues);
		sbAuditData = new StringBuffer();

		if (auditMetricsList != null && auditMetricsList.size() > 0)
		{
			// Set the first content as the flag indicating whether old value is present or not.
			sbAuditData.append("[").append(OLD_PREFIX_LABEL).append("]=").append(convertToString(shouldAuditOldValues))
					.append(NEXT_VALUE_DELIM);
			Iterator<AuditFieldMetrics> metricsIterator = auditMetricsList.iterator();
			AuditFieldMetrics aMetric;
			while (metricsIterator.hasNext())
			{
				aMetric = metricsIterator.next();
				// Simple null checks to ensure no bad things happen
				if (aMetric == null)
					continue;
				format(aMetric);
			}
		}

		return getDataAsString();
	}

	/**
	 * Helper method to convert a Boolean value to Y or N depending on whether it is true or false.
	 * 
	 * @param aVal
	 * @return String
	 */
	private String convertToString(boolean aVal)
	{
		return aVal ? "Y" : "N";
	}

	/**
	 * Method that triggers the format based on the type of the field
	 * 
	 * @param aMetric The field metric
	 * @throws AuditHandlerException Exception thrown if the formatting results in any error
	 */
	protected void format(AuditFieldMetrics aMetric) throws AuditHandlerException
	{
		if ("F".equals(aMetric.getType()))
			formatAField(aMetric);
		else if ("L".equals(aMetric.getType()))
			formatAList(aMetric);
		else if ("M".equals(aMetric.getType()))
			formatAMap(aMetric);
		else
		{
			LOGGER.cterror("CTAUD00119", aMetric);
		}
	}

	/**
	 * Tries to format the metric as a simple field data.
	 * 
	 * @param fieldMetric The metric to be formatted
	 * @throws AuditHandlerException
	 */
	protected void formatAField(AuditFieldMetrics fieldMetric) throws AuditHandlerException
	{
		String sToken = fieldMetric.getName();
		String sNewValue = fieldMetric.getNewValue();
		int level = fieldMetric.getLevel();
		if (isAuditOldValues())
		{
			boolean isModified = fieldMetric.isModified();
			String sOldValue = fieldMetric.getOldValue();
			append(sToken, level, sOldValue, sNewValue, isModified);
		} else
		{
			append(sToken, level, sNewValue);
		}
	}

	/**
	 * Tries to format the metric as a list data.
	 * 
	 * @param listMetric The metric to be formatted
	 * @throws AuditHandlerException
	 */
	protected void formatAList(AuditFieldMetrics listMetric) throws AuditHandlerException
	{
		AuditFieldCollectionMetrics collMetrics = (AuditFieldCollectionMetrics) listMetric;
		String fieldLabel = collMetrics.getName();
		int newCount = collMetrics.getNewCount();
		int level = collMetrics.getLevel();
		if (isAuditOldValues())
		{
			int oldCount = collMetrics.getOldCount();
			boolean isModified = collMetrics.isModified();
			append(fieldLabel, level, String.valueOf(oldCount), String.valueOf(newCount), isModified);
		} else
		{
			append(fieldLabel, level, String.valueOf(newCount));
		}
		// Now go through the children and process the same.
		for (AuditFieldMetrics childMetric : collMetrics.getChildren())
		{
			format(childMetric);
		}
	}

	/**
	 * Tries to format the metric as a Map data.
	 * 
	 * @param mapMetric The metric to be formatted
	 * @throws AuditHandlerException
	 */
	protected void formatAMap(AuditFieldMetrics mapMetric) throws AuditHandlerException
	{
		AuditFieldCollectionMetrics collMetrics = (AuditFieldCollectionMetrics) mapMetric;
		String sToken = collMetrics.getName();
		// Since it is map, just append its label.
		append(sToken, collMetrics.getLevel());
		// Now iterate through the content and start formatting the same.
		for (AuditFieldMetrics childMetric : collMetrics.getChildren())
		{
			format(childMetric);
		}
	}

	/**
	 * Helper method that appends the details to the buffer for old and new values along with modification flag.
	 * 
	 * @param sLabel
	 * @param level
	 * @param oldValue
	 * @param newValue
	 * @param isModified
	 */
	protected void append(String sLabel, int level, String oldValue, String newValue, boolean isModified)
	{
		handleLevel(level);
		sbAuditData.append(sLabel).append(TEXT_KEY_VALUE_DELIM).append(cleanseValue(oldValue, false))
				.append(TEXT_OLD_NEW_VALUE_DELIMITER).append(cleanseValue(newValue, isModified))
				.append(TEXT_NEXT_FIELD_DELIMITER);
	}

	/**
	 * Helper method to append a label and value to the buffer
	 * 
	 * @param sLabel The label
	 * @param sValue The value
	 * @param  level
	 */
	protected void append(String sLabel, int level, String sValue)
	{
		// Pass empty string for old value.
		append(sLabel, level, "", sValue, false);
	}

	/**
	 * Helper method to append a label and value to the buffer
	 * 
	 * @param sLabel The label
	 * @param level
	 
	 */
	protected void append(String sLabel, int level)
	{
		handleLevel(level);
		sbAuditData.append(sLabel).append(TEXT_KEY_VALUE_DELIM).append(TEXT_OLD_NEW_VALUE_DELIMITER)
				.append(TEXT_NEXT_FIELD_DELIMITER);
	}

	/**
	 * Handles the level prefix for better readable formatting
	 * 
	 * @param level
	 */
	protected void handleLevel(int level)
	{
		for (int count = 0; count < level; count++)
		{
			sbAuditData.append(TEXT_LEVEL_PREFIX);
		}
	}

	/**
	 * Helper method to cleanse the old value if modified.
	 * @param aValue
	 * @param isModified
	 * @return retVal
	 */
	private String cleanseValue(String aValue, boolean isModified)
	{
		String retVal = aValue;
		if (isNullOrEmpty(aValue))
			retVal = TEXT_NO_VALUE_PLACEHOLDER;
		if (isModified)
		{
			int index = TEXT_MODIFIED_TEXT_FORMAT.indexOf(VALUE_PLACEHOLDER);
			if (index > -1)
			{
				retVal = TEXT_MODIFIED_TEXT_FORMAT.substring(0, index) + retVal
						+ TEXT_MODIFIED_TEXT_FORMAT.substring(index + VALUE_PLACEHOLDER.length());
			}
		}
		return retVal;
	}

	/**
	 * Helper method to validate if a Sting is empty.
	 * 
	 * @param aString
	 * @return Null/Empty based on string passed
	 */
	protected boolean isNullOrEmpty(String aString)
	{
		return (aString == null) || (aString.trim().length() == 0);
	}

	/**
	 * return as audit data asstring
	 * 
	 * @return String as audit data
	 */
	private String getDataAsString()
	{
		if (sbAuditData.length() == 0)
		{
			// Means no content was present to Audit. So seed a defaut
			sbAuditData.append(AuditConstants.EVENT_PROP_READER.retrieveProperty("TXT_NO_DATA_AVAILABLE"));
		}
		return sbAuditData.toString();
	}

	/**
	 * Used to set Audit old values
	 * 
	 * @param auditOldValues the auditOldValues to set
	 */
	protected void setAuditOldValues(boolean auditOldValues)
	{
		this.auditOldValues = auditOldValues;
	}

	/**
	 * Get the audit old values
	 * 
	 * @return the auditOldValues
	 */
	protected boolean isAuditOldValues()
	{
		return auditOldValues;
	}

	private static final String VALUE_PLACEHOLDER = "${VALUE}";
	private static final PropertyReader PROPS = AuditConstants.EVENT_PROP_READER;
	private static final String TEXT_KEY_VALUE_DELIM = PROPS.retrieveProperty("NEW_TXT_KEY_VALUE_DELIMITER");
	private static final String TEXT_OLD_NEW_VALUE_DELIMITER = PROPS
			.retrieveProperty("NEW_TXT_OLD_NEW_VALUE_DELIMITER");
	private static final String TEXT_NEXT_FIELD_DELIMITER = PROPS.retrieveProperty("NEW_TXT_NEXT_FIELD_DELIMITER");
	private static final String TEXT_MODIFIED_TEXT_FORMAT = PROPS.retrieveProperty("NEW_TXT_MODIFIED_TEXT_FORMAT");
	private static final String TEXT_NO_VALUE_PLACEHOLDER = PROPS.retrieveProperty("NEW_TXT_NO_VALUE_PLACEHOLDER");
	private static final String TEXT_LEVEL_PREFIX = PROPS.retrieveProperty("NEW_TXT_LEVEL_PREFIX");

	// Initialize the delimiters used for formatting. These are the constants retained for earlier compatibility
	// purposes.
	private static final String NEXT_VALUE_DELIM = PROPS.retrieveProperty(AuditConstants.FORMAT_NEXT_FIELD_DELIMITER);
	public static final String OLD_PREFIX_LABEL = PROPS.retrieveProperty(AuditConstants.PREFIX_OLD) + " ";
	public static final String NEW_PREFIX_LABEL = PROPS.retrieveProperty(AuditConstants.PREFIX_NEW) + " ";
	public static final Logger LOGGER = Logger.getLogger(AuditDataTextFormatter.class);
}
