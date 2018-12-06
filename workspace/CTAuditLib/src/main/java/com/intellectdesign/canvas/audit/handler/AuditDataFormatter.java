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

import java.lang.reflect.InvocationTargetException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import com.intellectdesign.canvas.event.Event;
import com.intellectdesign.canvas.logger.Logger;

/**
 * This is the base class for all the audit data formatters. This class provides the option for the end consumers to
 * control the manner in which the audit data is formatted before the same is inserted into the audit details table.
 * 
 * @version 1.0
 */
public class AuditDataFormatter
{
	private Map mapOfOldData = null;
	private Map mapOfNewData = null;
	private boolean shouldAuditOldValues = false;
	private IAuditTranslator mTranslator = null;
	private Event event = null;
	private AuditDataValue auditMasterConfig = null;

	/**
	 * Constructor for AuditDataFormatter. Making this protected so that sub classes can access while no other classes
	 * can access. Any instance of AuditDataFormatter should be created only using the static createInstance API
	 * 
	 * @param auditMasterConfig to set
	 * 
	 */
	protected AuditDataFormatter(AuditDataValue auditMasterConfig)
	{
		// Store the reference to the Audit master configuration
		this.auditMasterConfig = auditMasterConfig;
	}

	/**
	 * This is similar to a factory method but relies on the configuration in the property file to identify the
	 * formatter to be used. The formatter class defined should be a sub class of this class.
	 * 
	 * @param auditMasterConfig The Audit Master configuration that is to be used by the formatter provided.
	 * @return AuditDataFormatter The formatter as configured in the event properties
	 * @exception AuditHandlerException thrown if some error occurs in the configuration defined.
	 * @throws AuditHandlerException
	 */
	public static AuditDataFormatter createNewInstance(AuditDataValue auditMasterConfig) throws AuditHandlerException
	{
		AuditDataFormatter formatter = null;
		// Step 1: Identify the formatter class and ensure that it is a sub class of this class.
		formatter = identifyFormatterClassFor(auditMasterConfig);

		// Step 2: Initialize the formatter class with the translator as well as the output formatter
		IAuditTranslator translator = identifyTranslatorClassFor(auditMasterConfig);
		formatter.setTranslator(translator);

		return formatter;
	}

	/**
	 * Helper API used by the factory method to validate and create the audit formatter
	 * 
	 * @param auditMasterConfig The audit master configuration received
	 * @return The Formatter class instance
	 * @throws AuditHandlerException Thrown if any error occurs while identifying / instantiating the class
	 */
	private static AuditDataFormatter identifyFormatterClassFor(AuditDataValue auditMasterConfig)
			throws AuditHandlerException
	{
		Class formatterClass = null;
		AuditDataFormatter formatter = null;
		String formatterClassName = auditMasterConfig.getAuditFormatterClass();
		if ((formatterClassName == null) || ("".equals(formatterClassName.trim())))
		{
			formatterClassName = AuditConstants.EVENT_PROP_READER
					.retrieveProperty("DEFAULT_AUDIT_FORMATTER_CLASS");
		}
		try
		{
			formatterClass = Class.forName(formatterClassName);
			// Type cast can be done safely as the validation for the base class has already been done
			formatter = (AuditDataFormatter) formatterClass.getDeclaredConstructor(AuditDataValue.class).newInstance(
					auditMasterConfig);
		} catch (IllegalArgumentException argumentException)
		{
			logger.cterror("CTAUD00095", argumentException, formatterClassName);
			throw new AuditHandlerException("AUD019",
					AuditConstants.EVENT_PROP_READER.retrieveProperty("AUD019"));
		} catch (InstantiationException instantiationException)
		{
			logger.cterror("CTAUD00096", instantiationException, formatterClassName);
			throw new AuditHandlerException("AUD019",
					AuditConstants.EVENT_PROP_READER.retrieveProperty("AUD019"));
		} catch (IllegalAccessException illegalAccessException)
		{
			logger.cterror("CTAUD00097", illegalAccessException, formatterClassName);
			throw new AuditHandlerException("AUD019",
					AuditConstants.EVENT_PROP_READER.retrieveProperty("AUD019"));
		} catch (ClassNotFoundException e)
		{
			logger.cterror("CTAUD00098", e, formatterClassName);
			throw new AuditHandlerException("AUD019",
					AuditConstants.EVENT_PROP_READER.retrieveProperty("AUD019"));
		} catch (SecurityException e)
		{
			logger.cterror("CTAUD00098", e, formatterClassName);
			throw new AuditHandlerException("AUD014",
					AuditConstants.EVENT_PROP_READER.retrieveProperty("AUD014"));
		} catch (InvocationTargetException e)
		{
			logger.cterror("CTAUD00098", e, formatterClassName);
			throw new AuditHandlerException("AUD014",
					AuditConstants.EVENT_PROP_READER.retrieveProperty("AUD014"));
		} catch (NoSuchMethodException e)
		{
			logger.cterror("CTAUD00098", e, formatterClassName);
			throw new AuditHandlerException("AUD014",
					AuditConstants.EVENT_PROP_READER.retrieveProperty("AUD014"));
		} catch (ClassCastException e)
		{
			logger.cterror("CTAUD00099", e, formatterClassName);
			throw new AuditHandlerException("AUD015",
					AuditConstants.EVENT_PROP_READER.retrieveProperty("AUD015"));
		}
		return formatter;
	}

	/**
	 * Helper API used by the factory method to validate and create the audit formatter
	 * 
	 * @param auditMasterConfig The audit master configuration received
	 * @return The Formatter class instance
	 * @throws AuditHandlerException Thrown if any error occurs while identifying / instantiating the class
	 */
	private static IAuditTranslator identifyTranslatorClassFor(AuditDataValue auditMasterConfig)
			throws AuditHandlerException
	{
		Class translatorClass = null;
		IAuditTranslator translator = null;
		String translatorClassName = auditMasterConfig.getDataTranslatorClass();
		if ((translatorClassName == null) || ("".equals(translatorClassName.trim())))
		{
			translatorClassName = AuditConstants.EVENT_PROP_READER.retrieveProperty("DATA_TRANSLATOR_CLASS");
		}
		try
		{
			translatorClass = Class.forName(translatorClassName);
			// Type cast can be done safely as the validation for the base class has already been done
			translator = (IAuditTranslator) translatorClass.newInstance();
		} catch (IllegalArgumentException argumentException)
		{
			logger.cterror("CTAUD00100", argumentException, translatorClassName);
			throw new AuditHandlerException("AUD016",
					AuditConstants.EVENT_PROP_READER.retrieveProperty("AUD016"));
		} catch (InstantiationException instantiationException)
		{
			logger.cterror("CTAUD00101", instantiationException, translatorClassName);
			throw new AuditHandlerException("AUD016",
					AuditConstants.EVENT_PROP_READER.retrieveProperty("AUD016"));
		} catch (IllegalAccessException illegalAccessException)
		{
			logger.cterror("CTAUD00102", illegalAccessException, translatorClassName);
			throw new AuditHandlerException("AUD016",
					AuditConstants.EVENT_PROP_READER.retrieveProperty("AUD016"));
		} catch (ClassNotFoundException e)
		{
			logger.cterror("CTAUD00103", e, translatorClassName);
			throw new AuditHandlerException("AUD016",
					AuditConstants.EVENT_PROP_READER.retrieveProperty("AUD016"));
		} catch (SecurityException e)
		{
			logger.cterror("CTAUD00103", e, translatorClassName);
			throw new AuditHandlerException("AUD016",
					AuditConstants.EVENT_PROP_READER.retrieveProperty("AUD016"));
		} catch (ClassCastException e)
		{
			logger.cterror("CTAUD00104", e, translatorClassName);
			throw new AuditHandlerException("AUD016",
					AuditConstants.EVENT_PROP_READER.retrieveProperty("AUD016"));
		}
		return translator;
	}

	/**
	 * This method does the actual formatting and returns the data in a String format.
	 * 
	 * @return formatted as String
	 * @param anEvent
	 * @param mapData
	 * @param auditOldValuesFlag
	 * @throws AuditHandlerException
	 */
	public String formatAuditData(Event anEvent, Map mapData, boolean auditOldValuesFlag)
			throws AuditHandlerException
	{
		String auditString = "Missing Configuration";
		setOldData((HashMap) mapData.get(AuditConstants.MANDATORY_AUDIT_DATA_OLD_STATE));
		setNewData((HashMap) mapData.get(AuditConstants.MANDATORY_AUDIT_DATA_NEW_STATE));
		setShouldAuditOldValues(auditOldValuesFlag);
		setEvent(anEvent);
		logger.ctdebug("CTAUD00105", anEvent.getEventId(), auditOldValuesFlag);
		// Retrieve the audit configuration and first validate.
		if (auditMasterConfig == null)
		{
			logger.cterror("CTAUD00106", anEvent.getEventId());
			throw new AuditHandlerException("AUD017",
					AuditConstants.EVENT_PROP_READER.retrieveProperty("AUD017") + anEvent.getEventId());
		} else
		{
			validateAuditDataConfiguration();
			auditString = formatAuditDataImpl();
		}
		return auditString;
	}

	/**
	 * This is the actual method that prepares the data for audit.
	 * 
	 * @return The actual string that should be included in the audit
	 * @throws AuditHandlerException Thrown if any error occurs while constructing the audit text
	 */
	private String formatAuditDataImpl() throws AuditHandlerException
	{
		List<AuditFieldMetrics> metricsCollator = new ArrayList<AuditFieldMetrics>();
		AuditFieldConfig aField;
		List<AuditFieldConfig> fieldConfigList;
		Iterator<AuditFieldConfig> it;
		Object newValue;
		Object oldValue;
		AuditFieldMetrics aMetrics;

		// First start the formatting of the Mandatory fields
		fieldConfigList = this.auditMasterConfig.getMandatoryFieldsConfig();
		it = fieldConfigList.iterator();

		while (it.hasNext())
		{
			aField = it.next();
			newValue = getNewData().get(aField.getFieldName());
			oldValue = getOldData().get(aField.getFieldName());
			if (newValue != null || oldValue != null)
			{
				if ((aMetrics = evaluateField(aField, newValue, oldValue)) != null)
					metricsCollator.add(aMetrics);
			}
		}

		// Now switch over to the optional fields list
		fieldConfigList = this.auditMasterConfig.getOptionalFieldsConfig();
		it = fieldConfigList.iterator();

		while (it.hasNext())
		{
			aField = it.next();
			newValue = getNewData().get(aField.getFieldName());
			oldValue = getOldData().get(aField.getFieldName());
			if (newValue != null || oldValue != null)
			{
				if ((aMetrics = evaluateField(aField, newValue, oldValue)) != null)
					metricsCollator.add(aMetrics);
			}
		}
		logger.ctdebug("CTAUD00107", metricsCollator);
		// Now that we have the metrics collated, let us send it to the output formatter.
		IAuditOutputFormatter outputFormatter = identifyOutputFormatter();
		logger.ctdebug("CTAUD00108", outputFormatter);
		String formattedAudit = outputFormatter.format(metricsCollator, auditMasterConfig, isShouldAuditOldValues());
		logger.ctdebug("CTAUD00109", formattedAudit);
		return formattedAudit;
	}

	/**
	 * This method creates an instance of the output formatter for this audit. This is identified from the
	 * CTevent_properties
	 * 
	 * @return formatter
	 * @throws AuditHandlerException
	 */
	private static IAuditOutputFormatter identifyOutputFormatter() throws AuditHandlerException
	{
		String auditOutputFormat = AuditConstants.EVENT_PROP_READER.retrieveProperty("AUDIT_FORMAT");
		String formatterClassName = AuditConstants.EVENT_PROP_READER.retrieveProperty(auditOutputFormat
				+ AuditConstants.AUDIT_FORMAT_CLASS_EXTN);
		Class formatterClass = null;
		IAuditOutputFormatter formatter = null;
		try
		{
			formatterClass = Class.forName(formatterClassName);
			// Type cast can be done safely as the validation for the base class has already been done
			formatter = (IAuditOutputFormatter) formatterClass.newInstance();
		} catch (IllegalArgumentException argumentException)
		{
			logger.cterror("CTAUD00110", argumentException, formatterClassName);
			throw new AuditHandlerException("AUD011",
					AuditConstants.EVENT_PROP_READER.retrieveProperty("AUD011"));
		} catch (InstantiationException instantiationException)
		{
			logger.cterror("CTAUD00111", instantiationException, formatterClassName);
			throw new AuditHandlerException("AUD011",
					AuditConstants.EVENT_PROP_READER.retrieveProperty("AUD011"));
		} catch (IllegalAccessException illegalAccessException)
		{
			logger.cterror("CTAUD00112", illegalAccessException, formatterClassName);
			throw new AuditHandlerException("AUD011",
					AuditConstants.EVENT_PROP_READER.retrieveProperty("AUD011"));
		} catch (ClassNotFoundException e)
		{
			logger.cterror("CTAUD00113", e, formatterClassName);
			throw new AuditHandlerException("AUD011",
					AuditConstants.EVENT_PROP_READER.retrieveProperty("AUD011"));
		} catch (SecurityException e)
		{
			logger.cterror("CTAUD00113", e, formatterClassName);
			throw new AuditHandlerException("AUD014",
					AuditConstants.EVENT_PROP_READER.retrieveProperty("AUD014"));
		} catch (ClassCastException e)
		{
			logger.cterror("CTAUD00114", e, formatterClassName);
			throw new AuditHandlerException("AUD015",
					AuditConstants.EVENT_PROP_READER.retrieveProperty("AUD015"));
		}
		return formatter;
	}

	/**
	 * Here we evaluate the field against old and new data maps based on the configuration and create the metrics
	 * appropriately
	 * 
	 * @param aFieldConfig The field configuration
	 * @param newValue
	 * @param oldValue
	 * @return The Field metrics
	 * @throws AuditHandlerException Thrown if any error occurs while evaluation
	 */
	private AuditFieldMetrics evaluateField(AuditFieldConfig aFieldConfig, Object newValue, Object oldValue)
			throws AuditHandlerException
	{
		if (aFieldConfig.isCollectionInd())
			return evaluateCollectionField(aFieldConfig, 0, newValue, oldValue);
		else
			return evaluateSimpleField(aFieldConfig, 0, newValue, oldValue);
	}

	/**
	 * Here the evaluation of a simple field is done. As part of this the comparison details against old / new maps is
	 * evaluated
	 * 
	 * @param aFieldConfig The field configuration
	 * @param level
	 * @param newValue
	 * @param oldValue
	 * @return The metrics for that field
	 * @throws AuditHandlerException Thrown if any error occurs while evaluation
	 */
	private AuditFieldMetrics evaluateSimpleField(AuditFieldConfig aFieldConfig, int level, Object newValue,
			Object oldValue) throws AuditHandlerException
	{
		AuditFieldMetrics aMetrics = new AuditFieldMetrics();
		String newValueAsString = getValueAsString(aFieldConfig, newValue);
		if ("".equals(newValueAsString.trim()))
			newValueAsString = AuditConstants.DEFAULT_VALUE_FOR_DELETED_DATA;

		aMetrics.setName(aFieldConfig.getFieldLabel());
		aMetrics.setLevel(level);
		aMetrics.setNewValue(newValueAsString);
		aMetrics.setType("F");

		if (shouldAuditOldValues)
		{
			String oldValueAsString = getValueAsString(aFieldConfig, oldValue);
			if ("".equals(oldValueAsString.trim()))
				oldValueAsString = AuditConstants.DEFAULT_VALUE_FOR_DELETED_DATA;
			aMetrics.setOldValue(oldValueAsString);
			aMetrics.setModified(!oldValueAsString.equals(newValueAsString));
		}
		return aMetrics;
	}

	/**
	 * This method goes through the data of the collection configuration and accordingly evaluates the same
	 * 
	 * @param aFieldConfig The audit configuration
	 * @param level The level at which this field is present
	 * @param newValue
	 * @param oldValue
	 * @return The metrics for the entire collection
	 * @throws AuditHandlerException Thrown if any error occurs while evaluation
	 */
	private AuditFieldMetrics evaluateCollectionField(AuditFieldConfig aFieldConfig, int level, Object newValue,
			Object oldValue) throws AuditHandlerException
	{
		
		// There are 3 types of collections that is supported.
		// L - This is a simple List of Strings. If such a configuration is present, then expectation is that a
		// comparison of the list of values is done between old and new values
		// M - This is a Map. In this case, the child configuration items are to be treated within this map
		// If it is a List of Maps and there is no children configured, then the entire list is serialized for auditing
		// If it is a Map and there are no children configured, then the entire map is serialized.
		AuditFieldCollectionMetrics aMetrics = new AuditFieldCollectionMetrics();
		aMetrics.setName(aFieldConfig.getFieldName());
		aMetrics.setLevel(level);
		
		if (newValue instanceof List || oldValue instanceof List) // Add the check for oldValue
																	// also
		{
			List newValueList = (List) newValue;
			List oldValueList = (List) oldValue;
			// If we do not want to audit the old values, just blank it out for now.
			if (!shouldAuditOldValues || oldValueList == null)
				oldValueList = new ArrayList();
			// ensure proper null checks
			if (newValueList == null)
				newValueList = new ArrayList();

			if (newValueList.size() > 0)
			{
				// Ok. So it is a list. Check the first item as to whether it is a String or a Map.
				if (newValueList.get(0) instanceof String)
				{
					processListOfStrings(aFieldConfig, level + 1, newValueList, oldValueList, aMetrics);
				} else if (((List) newValue).get(0) instanceof Map)
				{
					processListOfMaps(aFieldConfig, level + 1, newValueList, oldValueList, aMetrics);
				}
			} else
			{
				if (shouldAuditOldValues)
				{
					// This could mean that old is present, but now it has been deleted. So handle this as a case of
					// deletion
					if (oldValueList.size() > 0)
					{
						// Ok. So it is a list. Check the first item as to whether it is a String or a Map.
						if (oldValueList.get(0) instanceof String)
						{
							processListOfStrings(aFieldConfig, level + 1, newValueList, oldValueList, aMetrics);
						} else if (oldValueList.get(0) instanceof Map)
						{
							processListOfMaps(aFieldConfig, level + 1, newValueList, oldValueList, aMetrics);
						}
					} else
					{
						// There is no data and there are no values to audit. So just set the metrics to null;
						aMetrics = null;
					}
				} else
				{
					// There is no data and there are no values to audit. So just set the metrics to null;
					aMetrics = null;
				}
			}
		
		} else if (newValue instanceof Map || oldValue instanceof Map) // Add the check for
																		// oldValue also
		{
			// Handle null check for cases where old map may be null
			Map oldValueMap = (oldValue == null) ? new HashMap() : (Map) oldValue;
			// Add the null check for newValue also
			Map newValueMap = (newValue == null) ? new HashMap() : (Map) newValue;

			return processAMapMetric(aFieldConfig, level, oldValueMap, newValueMap, "");
			
		} else
		{
			// This is some unsupported collection type. So just revert it from a Collection to a simple field and
			// return the configuration for the same.
			logger.cterror("CTAUD00115", aFieldConfig.getFieldName());
			return evaluateSimpleField(aFieldConfig, level, newValue, oldValue);
		}
		return aMetrics;
	}

	/**
	 * Helper method to process a List of Maps
	 * 
	 * @param aFieldConfig
	 * @param level
	 * @param newValue
	 * @param oldValue
	 * @param aMetrics
	 * @throws AuditHandlerException
	 */
	private void processListOfMaps(AuditFieldConfig aFieldConfig, int level, List<Map> newValue, List<Map> oldValue,
			AuditFieldCollectionMetrics aMetrics) throws AuditHandlerException
	{
		// Check if there is a child configuration present. If not, then treat this as effectively a list of strings.
		if (aFieldConfig.getChildren().size() == 0)
		{
			List<String> newStringList = new ArrayList<String>();
			for (int count = 0; count < newValue.size(); count++)
			{
				newStringList.add(String.valueOf(newValue.get(count)));
			}
			List<String> oldStringList = new ArrayList<String>();
			for (int count = 0; count < oldValue.size(); count++)
			{
				oldStringList.add(String.valueOf(oldValue.get(count)));
			}
			processListOfStrings(aFieldConfig, level, newStringList, oldStringList, aMetrics);
		} else
		{
			aMetrics.setType("L");
			// Iterate through the list and identify the list of additions, modifications and deletions.
			aMetrics.setNewCount(newValue.size());
			aMetrics.setName(aFieldConfig.getFieldLabel());
			if (shouldAuditOldValues)
			{
				// Set the old count.
				aMetrics.setOldCount((oldValue == null) ? 0 : oldValue.size());
			}
			// Go by the child configuration to process each map.
			String[] mapIndexArr = getIndexFieldsForMap(aFieldConfig);
			// Create an index for the list of maps to enable comparison with old values.
			Map<String, Map> newValuesMap = indexListOfMaps(newValue, mapIndexArr);
			Map<String, Map> oldValuesMap = indexListOfMaps(oldValue, mapIndexArr);
			AuditFieldMetrics childMetric = null;

			// First open up the iteration with the new Values map.
			Iterator<Entry<String, Map>> valuesIterator = newValuesMap.entrySet().iterator();
			Entry<String, Map> aRecord;
			String recordKey;
			Map childNewValuesMap;
			int counter = 0;
			String counterLabel;

			while (valuesIterator.hasNext())
			{
				counter++;
				counterLabel = aFieldConfig.getCountLabel() + " " + String.valueOf(counter);
				aRecord = valuesIterator.next();
				recordKey = aRecord.getKey();
				childNewValuesMap = aRecord.getValue();
				if (shouldAuditOldValues)
				{
					// If this key is not present in old values, then treat it as an addition.
					if (!oldValuesMap.containsKey(recordKey))
					{
						// Means that this is an addition. So increment the count.
						aMetrics.setNumAdditions(aMetrics.getNumAdditions() + 1);
						aMetrics.setModified(true);
						// Create a metric with old Value as an empty map
						childMetric = processAMapMetric(aFieldConfig, level, new HashMap(), childNewValuesMap,
								counterLabel);
						if (childMetric != null)
							aMetrics.getChildren().add(childMetric);
					} else
					{
						// Means there is a match between the old and new. So
						childMetric = processAMapMetric(aFieldConfig, level, oldValuesMap.get(recordKey),
								childNewValuesMap, counterLabel);
						if (childMetric != null)
						{
							aMetrics.getChildren().add(childMetric);
							if (childMetric.isModified())
							{
								aMetrics.setNumModifications(aMetrics.getNumModifications() + 1);
								aMetrics.setModified(true);
							}
						}
					}
				} else
				{
					// Okay. Only new values are present. So just process this map and add it as a child.
					// Create a metric with old Value as an empty map
					childMetric = processAMapMetric(aFieldConfig, level, new HashMap(), childNewValuesMap, counterLabel);
					if (childMetric != null)
						aMetrics.getChildren().add(childMetric);
				}
			}

			if (shouldAuditOldValues)
			{
				// The earlier iteration takes care of identifying additions and modifications. Now to check for
				// deletions.
				valuesIterator = oldValuesMap.entrySet().iterator();
				while (valuesIterator.hasNext())
				{
					aRecord = valuesIterator.next();
					recordKey = aRecord.getKey();
					if (!newValuesMap.containsKey(recordKey))
					{
						counter++;
						counterLabel = aFieldConfig.getCountLabel() + " " + String.valueOf(counter);
						// So we have a deletion.
						aMetrics.setNumDeletions(aMetrics.getNumDeletions() + 1);
						aMetrics.setModified(true);
						childMetric = processAMapMetric(aFieldConfig, level, aRecord.getValue(), new HashMap(),
								counterLabel);
						if (childMetric != null)
							aMetrics.getChildren().add(childMetric);
					}
				}
			}
		}
	}

	/**
	 * This is a helper method to process a Map.
	 * 
	 * @param aFieldConfig
	 * @param level
	 * @param oldValue
	 * @param newValue
	 * @param counterLbl
	 * @return aMetrics AuditFieldMetrics
	 * @throws AuditHandlerException
	 */
	private AuditFieldMetrics processAMapMetric(AuditFieldConfig aFieldConfig, int level, Map oldValue, Map newValue,
			String counterLbl) throws AuditHandlerException
	{
		AuditFieldCollectionMetrics aMetrics = new AuditFieldCollectionMetrics();
		if (counterLbl != null && !"".equals(counterLbl))
			aMetrics.setName(counterLbl);
		else
			aMetrics.setName(aFieldConfig.getFieldLabel());
		aMetrics.setLevel(level);
		aMetrics.setType("M");
		boolean modified = false;
		// Iterate through the child configuration and add the maps accordingly.
		Iterator<AuditFieldConfig> it = aFieldConfig.getChildren().iterator();
		AuditFieldConfig aChildConfig = null;
		AuditFieldMetrics childMetric = null;
		Object newFieldValue = null;
		Object oldFieldValue = null;

		while (it.hasNext())
		{
			aChildConfig = it.next();
			if (!aChildConfig.isCollectionInd())
			{
				// It is a simple field. So just add the field as a child.
				newFieldValue = (newValue.get(aChildConfig.getFieldName()) == null ? AuditConstants.DEFAULT_VALUE_FOR_DELETED_DATA
						: newValue.get(aChildConfig.getFieldName()));
				oldFieldValue = (oldValue.get(aChildConfig.getFieldName()) == null ? AuditConstants.DEFAULT_VALUE_FOR_DELETED_DATA
						: oldValue.get(aChildConfig.getFieldName()));
				childMetric = evaluateSimpleField(aChildConfig, level + 1, newFieldValue, oldFieldValue);
				if (childMetric.isModified())
					modified = true;
				aMetrics.getChildren().add(childMetric);
			} else
			{
				// The child itself is a collection. process it as a collection.
				childMetric = evaluateCollectionField(aChildConfig, level + 1,
						newValue.get(aChildConfig.getFieldName()), oldValue.get(aChildConfig.getFieldName()));
				if (childMetric.isModified())
					modified = true;
				aMetrics.getChildren().add(childMetric);
			}
		}

		aMetrics.setModified(modified);
		return aMetrics;
	}

	/**
	 * Creates an index of the list of maps. The index is created as a combination of the data corresponding to the
	 * index keys provided. In case the index keys is empty, then the entire serialized state of the map is taken as the
	 * key
	 * 
	 * @param inputList
	 * @param mapIndexArr
	 * @return resultMap
	 */
	private Map<String, Map> indexListOfMaps(List<Map> inputList, String[] mapIndexArr)
	{
		Map<String, Map> resultMap = new LinkedHashMap<String, Map>();
		Map aData;
		String index;
		for (int count = 0; count < inputList.size(); count++)
		{
			aData = inputList.get(count);
			if (mapIndexArr.length == 0)
				index = aData.toString();
			else
			{
				index = "";
				for (int j = 0; j < mapIndexArr.length; j++)
					index += String.valueOf(aData.get(mapIndexArr[j]));
			}

			resultMap.put(index, aData);
		}

		return resultMap;
	}

	/**
	 * Identifies the index fields from the child elements configuration within this map
	 * 
	 * @param aFieldConfig
	 * @return indexArr
	 */
	private String[] getIndexFieldsForMap(AuditFieldConfig aFieldConfig)
	{
		String[] indexArr = null;
		String indexFields = aFieldConfig.getCollectionLabel();
		indexArr = indexFields.split(",");
		return indexArr;
	}

	/**
	 * Helper method to process a List of Strings
	 * 
	 * @param aFieldConfig
	 * @param level
	 * @param newValue
	 * @param oldValue
	 * @param aMetrics
	 */
	private void processListOfStrings(AuditFieldConfig aFieldConfig, int level, List<String> newValue,
			List<String> oldValue, AuditFieldCollectionMetrics aMetrics)
	{
		List<String> deletions = new ArrayList<String>();
		List<String> additions = new ArrayList<String>();
		List<String> noChanges = new ArrayList<String>();
		aMetrics.setType("L");
		// Iterate through the list and identify the list of additions, modifications and deletions.
		aMetrics.setNewCount(newValue.size());
		aMetrics.setName(aFieldConfig.getFieldLabel());
		boolean modified = false;
		if (shouldAuditOldValues)
		{
			aMetrics.setOldCount(oldValue.size());
			// For a list of strings, there can be no modifications. only additions and deletions possible
			aMetrics.setNumModifications(0);
			// Now is the ask to bring out the comparison.
			additions.addAll(newValue);
			additions.removeAll(oldValue);
			aMetrics.setNumAdditions(additions.size());
			modified = (additions.size() > 0);

			deletions.addAll(oldValue);
			deletions.removeAll(newValue);
			aMetrics.setNumDeletions(deletions.size());
			modified = modified || (deletions.size() > 0);

			noChanges.addAll(newValue);
			noChanges.removeAll(additions);
			// First add the non modified items.
			addStringListMetricsTo(aMetrics, aFieldConfig, level, noChanges, noChanges);
			// Next add the deletions list.
			addStringListMetricsTo(aMetrics, aFieldConfig, level, deletions, null);
			// Finally add the additions list
			addStringListMetricsTo(aMetrics, aFieldConfig, level, null, additions);
		} else
		{
			// No old values. So only add the new values.
			addStringListMetricsTo(aMetrics, aFieldConfig, level, null, newValue);
		}
		// Finally set the modified status flag appropriately
		aMetrics.setModified(modified);
	}

	/**
	 * Helper method to loop through a list of String values and add the same as an audit metric to the Collections list
	 * 
	 * @param collMetrics
	 * @param aFieldConfig
	 * @param level
	 * @param oldValues
	 * @param newValues
	 */
	private void addStringListMetricsTo(AuditFieldCollectionMetrics collMetrics, AuditFieldConfig aFieldConfig,
			int level, List<String> oldValues, List<String> newValues)
	{
		AuditFieldMetrics aMetrics = null;
		List<String> listToIterate = (oldValues == null) ? newValues : oldValues;
		int numItems = listToIterate.size();
		String aValue;
		String newValueAsString;
		String oldValueAsString;
		for (int count = 0; count < numItems; count++)
		{
			aMetrics = new AuditFieldMetrics();
			aMetrics.setName(" ");
			aMetrics.setType("F");
			aMetrics.setLevel(level);
			aValue = (newValues != null) ? newValues.get(count) : AuditConstants.DEFAULT_VALUE_FOR_DELETED_DATA;
			newValueAsString = getValueAsString(aFieldConfig, aValue);
			aMetrics.setNewValue(newValueAsString);
			if (shouldAuditOldValues)
			{
				aValue = (oldValues != null) ? oldValues.get(count)
						: AuditConstants.DEFAULT_VALUE_FOR_DELETED_DATA;
				oldValueAsString = getValueAsString(aFieldConfig, aValue);
				aMetrics.setOldValue(oldValueAsString);
				aMetrics.setModified(!newValueAsString.equals(oldValueAsString));
			}
			collMetrics.getChildren().add(aMetrics);
		}
	}

	/**
	 * Convert the value of an object to String. Try some simple formatting tricks
	 * 
	 * @param aFieldConfig The audit configuration
	 * @param aValue The value of the field
	 * @return The String representation of the field value
	 */
	private String getValueAsString(AuditFieldConfig aFieldConfig, Object aValue)
	{
		String retVal = AuditConstants.DEFAULT_VALUE_FOR_EMPTY_DATA;
		Object testVal = null;
		if (aValue != null)
		{
			// There are cases where dates and date times are passed using system default formats. In these cases,
			// treat them as similar to regular date / date time fields
			// Test for a date / time field
			testVal = tryParseAsDateTime(aValue);
			if (testVal == null)
			{
				// Try parsing as a date
				testVal = tryParseAsDate(aValue);
				if (testVal == null)
				{
					// Neither date or date / time formatted string. So just use the value
					testVal = aValue;
				}
			}
			if (testVal instanceof java.util.Date)
			{
				retVal = AuditConstants.DEFAULT_AUDIT_DATE_FORMAT.format((java.util.Date) testVal);
				// If the time part of the date is empty, then truncate the time.
				if (retVal.indexOf(AuditConstants.EMPTY_TIME_VALUE) != -1)
					retVal = retVal.substring(0, retVal.indexOf(AuditConstants.EMPTY_TIME_VALUE));
			} else if (testVal instanceof java.util.Calendar)
			{
				retVal = AuditConstants.DEFAULT_AUDIT_DATE_TIME_FORMAT.format(((java.util.Calendar) testVal)
						.getTime());
				// If the time part of the date is empty, then truncate the time.
				if (retVal.indexOf(AuditConstants.EMPTY_TIME_VALUE) != -1)
					retVal = retVal.substring(0, retVal.indexOf(AuditConstants.EMPTY_TIME_VALUE));
			} else if (testVal instanceof BigDecimal)
			{
				BigDecimal temp = ((BigDecimal) testVal).setScale(8, RoundingMode.FLOOR).stripTrailingZeros();
				retVal = temp.toPlainString();
			} else if (testVal instanceof Float || testVal instanceof Double || testVal instanceof Integer)
			{
				DecimalFormat df = new DecimalFormat("#");
				df.setMaximumFractionDigits(8);
				retVal = df.format(testVal);
			} else if (testVal instanceof Boolean)
			{
				retVal = ((Boolean) testVal) == true ? "Yes" : "No";
			} else
			{
				// For all other cases, just ask the object to give its string representation
				retVal = testVal.toString();
			}
			// Check if the configuration is asking for translation. Accordingly involve the translator
			if (aFieldConfig.isTranslationRequiredInd())
			{
				retVal = getTranslator().translate(aFieldConfig, retVal);
			}
		}
		return retVal;
	}

	/**
	 * Try parsing the content as a Date using the system format of "dd/MM/yyyy HH:mm:ss". If not successful, return
	 * null
	 * 
	 * @param aValue
	 * @return retVal Calendar
	 */
	private Calendar tryParseAsDateTime(Object aValue)
	{
		Calendar retVal = null;
		if (aValue != null && aValue instanceof String)
		{
			String temp = (String) aValue;
			try
			{
				Date test = AuditConstants.SYSTEM_DEFAULT_DATE_TIME_FORMAT.parse(temp);
				retVal = Calendar.getInstance();
				retVal.setTime(test);
			} catch (Exception e)
			{
				// Ignore the exception
				// Test with the next format
				try
				{
					Date test = AuditConstants.SYSTEM_DEFAULT_DATE_TIME_FORMAT_2.parse(temp);
					retVal = Calendar.getInstance();
					retVal.setTime(test);
				} catch (Exception e1)
				{
					// ignore this exception too
				}
			}
		}
		return retVal;
	}

	/**
	 * Try parsing the content as a Date using the system format of "dd/MM/yyyy". If not successful, return null
	 * 
	 * @param aValue
	 * @return retVal Date
	 */
	private Date tryParseAsDate(Object aValue)
	{
		Date retVal = null;
		if (aValue != null && aValue instanceof String)
		{
			String temp = (String) aValue;
			try
			{
				retVal = AuditConstants.SYSTEM_DEFAULT_DATE_FORMAT.parse(temp);
			} catch (Exception e)
			{
				// Ignore the exception
			}
		}
		return retVal;
	}

	/**
	 * Validates whether the received Audit data meets the minimum asks as per the configuration
	 * 
	 * @throws AuditHandlerException Thrown if basic information needed for audit is not present as per the
	 *             configuration
	 */
	private void validateAuditDataConfiguration() throws AuditHandlerException
	{
		logger.ctinfo("CTAUD00116");
		if (shouldAuditOldValues && getOldData() == null)
		{
			logger.cterror("CTAUD00117", getEvent().getEventId());
			throw new AuditHandlerException("AUD005",
					AuditConstants.EVENT_PROP_READER.retrieveProperty("AUD005"));
		}
		// Now check for mandatory data configuration.
		List<AuditFieldConfig> mandatoryConfig = this.auditMasterConfig.getMandatoryFieldsConfig();
		Iterator<AuditFieldConfig> it = mandatoryConfig.iterator();
		AuditFieldConfig aField;
		String aFieldName;
		while (it.hasNext())
		{
			aField = it.next();
			aFieldName = aField.getFieldName();
			if (!getNewData().containsKey(aFieldName))
			{
				// Check if the old data has it. Then also it is fine.
				if (shouldAuditOldValues && !getOldData().containsKey(aFieldName))
				{
					// The mandatory field is not present in the data. So throw an error that audit cannot be done.
					logger.cterror("CTAUD00118", aFieldName);
					throw new AuditHandlerException("AUD006",
							AuditConstants.EVENT_PROP_READER.retrieveProperty("AUD006"));
				}
			}
		}
	}

	/**
	 * Returns the translator associated with this formatter
	 * 
	 * @return IAuditTranslator The translator for this formatter
	 */
	public IAuditTranslator getTranslator()
	{
		return this.mTranslator;
	}

	/**
	 * Setter method for the Translator
	 * 
	 * @param translator The translator for this formatter
	 */
	private void setTranslator(IAuditTranslator translator)
	{
		this.mTranslator = translator;
	}

	/**
	 * This method is used to get event
	 * 
	 * @return the event
	 */
	protected Event getEvent()
	{
		return event;
	}

	/**
	 * This method is used to set event
	 * 
	 * @param event the event to set
	 */
	protected void setEvent(Event event)
	{
		this.event = event;
	}

	/**
	 * This method is used to get NewData
	 * 
	 * @return the mapOfNewData
	 */
	protected Map getNewData()
	{
		return mapOfNewData;
	}

	/**
	 * This method is used to set NewData
	 * 
	 * @param mapOfNewData the mapOfNewData to set
	 */
	protected void setNewData(Map mapOfNewData)
	{
		this.mapOfNewData = mapOfNewData;
	}

	/**
	 * This method is used to get OldData
	 * 
	 * @return the mapOfOldData
	 */
	protected Map getOldData()
	{
		return mapOfOldData;
	}

	/**
	 * This method is used to set OldData
	 * 
	 * @param mapOfOldData the mapOfOldData to set
	 */
	protected void setOldData(Map mapOfOldData)
	{
		this.mapOfOldData = mapOfOldData;
	}

	/**
	 * This method is used to check AuditOldValues
	 * 
	 * @return the shouldAuditOldValues
	 */
	protected boolean isShouldAuditOldValues()
	{
		return shouldAuditOldValues;
	}

	/**
	 * This method is used to set AuditOldValues
	 * 
	 * @param shouldAuditOldValues the shouldAuditOldValues to set
	 */
	protected void setShouldAuditOldValues(boolean shouldAuditOldValues)
	{
		this.shouldAuditOldValues = shouldAuditOldValues;
	}

	private static final Logger logger = Logger.getLogger(AuditDataFormatter.class);
	public static final String OLD_PREFIX_LABEL = AuditConstants.EVENT_PROP_READER
			.retrieveProperty(AuditConstants.PREFIX_OLD) + " ";
	public static final String NEW_PREFIX_LABEL = AuditConstants.EVENT_PROP_READER
			.retrieveProperty(AuditConstants.PREFIX_NEW) + " ";
}
