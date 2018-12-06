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
package com.intellectdesign.canvas.preferences;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.TreeMap;

import com.intellectdesign.canvas.attribute.IMasterAttribute;
import com.intellectdesign.canvas.cache.handler.CacheDataBuilder;
import com.intellectdesign.canvas.constants.preferences.PreferenceConstants;
import com.intellectdesign.canvas.database.CanvasDatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.value.ListValue;

/**
 * This class is for PreferenceCacheBuilder Containing CacheHandler
 * 
 * @version 1.0
 */
public class PreferenceCacheDataBuilder extends CacheDataBuilder
{
	/**
	 * this is ref to List HashMap Internal constant for serialization purposes
	 * 
	 * @see com.intellectdesign.CacheDataBuilder.cache.CacheHandler#initializeCache(java.util.HashMap)
	 * @param hashMap
	 * @return Returns Arraylist of Cache Data
	 */

	@Override
	protected List initializeCache(HashMap hashMap)
	{
		List cacheData = new ArrayList();
		// Step 1: Load the Preference Configuration.
		List<SystemPreferenceDefinition> allPreferences = getPreferenceDefinitions();
		// Step 2: For each preference criteria, load the possible values and index the same.
		Iterator<SystemPreferenceDefinition> prefIterator = allPreferences.iterator();
		SystemPreferenceDefinition aPrefDefinition;
		List<ListValue> aPrefData;
		Map<String, List<ListValue>> simpleIndexMap = new TreeMap<String, List<ListValue>>();
		Map<String, LinkedHashMap<String, ListValue>> detailedIndexMap = new TreeMap<String, LinkedHashMap<String, ListValue>>();
		while (prefIterator.hasNext())
		{
			aPrefDefinition = prefIterator.next();
			aPrefData = getAllPreferenceValues(aPrefDefinition);
			simpleIndexMap.put(aPrefDefinition.getAttributeType(), aPrefData);
			detailedIndexMap.put(aPrefDefinition.getAttributeType(), indexPreferenceValues(aPrefData));
		}
		// Step 3: Package the same into a List to return the same
		// Position 0: contains the list of all System preference definitions
		cacheData.add(allPreferences);
		// Postion 1: contains the simple index where key is the pref type and values is the list of ListValues
		cacheData.add(simpleIndexMap);
		// Postion 2: contains the detailed index where key is the pref type and values a map having the key as the code
		// value and value as the ListValue for each possible value for this preference type
		cacheData.add(detailedIndexMap);
		return cacheData;
	}

	/**
	 * This is a helper method that converts the List of ListValue objects into an indexed map
	 * 
	 * @param aPrefData The List of List Values
	 * @return The indexed Map
	 */
	private LinkedHashMap<String, ListValue> indexPreferenceValues(List<ListValue> aPrefData)
	{
		LinkedHashMap<String, ListValue> indexMap = new LinkedHashMap<String, ListValue>();
		Iterator<ListValue> it = aPrefData.iterator();
		ListValue aValue;
		while (it.hasNext())
		{
			aValue = it.next();
			indexMap.put(aValue.getCode(), aValue);
		}
		return indexMap;
	}

	/**
	 * Helper method that returns the list of all Preference definitions setup in the system
	 * 
	 * @return The list of preference definitions
	 */
	private List<SystemPreferenceDefinition> getPreferenceDefinitions()
	{
		List<SystemPreferenceDefinition> allPrefs = null;

		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		dbRequest.setDataAccessMapKey(PreferenceConstants.DAM_KEY_GET_ALL_SYSTEM_PREFERENCE_DEFINITIONS);
		dbRequest.setOperation(DatabaseConstants.SELECT);
		dbRequest.setOperationExtension(PreferenceConstants.DB_OPERATION_EXTENSION);
		try
		{
			allPrefs = dbRequest.execute().getReturnedList();
		} catch (DatabaseException e)
		{
			// Eat the exception as there is no point propagating this
			LOGGER.cterror("CTBAS00025", e);
			allPrefs = new ArrayList();
		}

		return allPrefs;
	}

	/**
	 * Helper method to retrieve the complete list of preference values for a particular criteria
	 * 
	 * @param aPrefDefinition
	 * @return The list of all preference values
	 */
	private List<ListValue> getAllPreferenceValues(SystemPreferenceDefinition aPrefDefinition)
	{
		List<ListValue> prefValues = new ArrayList<ListValue>();
		String sourceType = aPrefDefinition.getSourceType();
		String sourceValue = aPrefDefinition.getSourceValue();
		List<HashMap> selectedValues = null;

		if (PreferenceConstants.PREF_SOURCE_QUERY.equals(sourceType))
		{
			DatabaseRequest dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey(PreferenceConstants.DAM_KEY_GET_A_PREFERENCE_DATA);
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setOperationExtension(PreferenceConstants.DB_OPERATION_EXTENSION);
			dbRequest.addFilter(PreferenceConstants.PREF_DATA_FLD_QUERY, sourceValue);
			try
			{
				selectedValues = dbRequest.execute().getReturnedList();
			} catch (DatabaseException e)
			{
				// Eat the exception as there is no point propagating this
				LOGGER.cterror("CTBAS00028", aPrefDefinition.getAttributeType(), e);
				selectedValues = new ArrayList();
			}
		} else if (PreferenceConstants.PREF_SOURCE_API.equals(sourceType))
		{
			try
			{
				Class sourceClass = Class.forName(sourceValue);
				if (IMasterAttribute.class.isAssignableFrom(sourceClass))
				{
					IMasterAttribute source = (IMasterAttribute) sourceClass.newInstance();
					// Retrieve the data from this source class
					HashMap<String, String> allAttribData = source.getMasterAttributes();
					// Convert this into a list of maps.
					Iterator<Entry<String, String>> it = allAttribData.entrySet().iterator();
					Entry<String, String> anEntry;
					selectedValues = new ArrayList();
					HashMap aValue;
					while (it.hasNext())
					{
						anEntry = it.next();
						aValue = new HashMap();
						aValue.put(PreferenceConstants.PREF_DATA_FLD_ATTRIBUTE_TYPE, anEntry.getKey());
						aValue.put(PreferenceConstants.PREF_DATA_FLD_ATTRIBUTE_VALUE, anEntry.getValue());
						selectedValues.add(aValue);
					}
				} else
				{
					LOGGER.cterror("CTBAS00026", sourceValue, aPrefDefinition.getAttributeType());
					selectedValues = new ArrayList();
				}
			} catch (Exception e)
			{
				// Eat the exception as there is no point propagating this
				LOGGER.cterror("CTBAS00027", e, sourceValue, aPrefDefinition.getAttributeType());
				selectedValues = new ArrayList();
			}
		}
		// Convert the List of Maps to List of ListValue objects.
		ListValue aValue;
		if (selectedValues != null)
		{
			Iterator<HashMap> valueIterator = selectedValues.iterator();
			HashMap aData;
			String attCode;
			String attDesc;
			while (valueIterator.hasNext())
			{
				aData = valueIterator.next();
				attCode = (String) aData.get(PreferenceConstants.PREF_DATA_FLD_ATTRIBUTE_TYPE);
				attDesc = (String) aData.get(PreferenceConstants.PREF_DATA_FLD_ATTRIBUTE_VALUE);
				aValue = new ListValue(attCode, attDesc);
				aValue.setAdditionalProperties(aData);
				prefValues.add(aValue);
			}
		}
		return prefValues;
	}

	/**
	 * Nothing to do here. So we return null always
	 * 
	 * @see com.intellectdesign.CacheDataBuilder.cache.CacheHandler#validateParameters(java.util.HashMap)
	 * @return hashmap
	 */
	@Override
	protected String validateParameters(HashMap params)
	{
		return null;
	}

	private static final Logger LOGGER = Logger.getLogger(PreferenceCacheDataBuilder.class);
}
