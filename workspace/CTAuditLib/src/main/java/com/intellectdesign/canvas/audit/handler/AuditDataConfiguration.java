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

/***
 * This is a singleton class which holds all the data of corresponding eventId as objects.

 */

package com.intellectdesign.canvas.audit.handler;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.cache.handler.CacheManager;
import com.intellectdesign.canvas.database.CanvasDatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseResult;
import com.intellectdesign.canvas.logger.Logger;

/**
 * Singleton class to manipulate the audit data. This class contains apis to access/set various data for audit purpose.
 * 
 * @version 1.0
 */
public final class AuditDataConfiguration
{
	/**
	 * Marking default constructor default to avoid instance creation.
	 */
	AuditDataConfiguration()
	{
		initializeFormatterCache();
	}

	/**
	 * Creating the singleton instance holder class using the Solution of Bill Pugh to avoid concurrency initialization
	 * issues
	 */
	private static class AuditDataConfigurationHolder
	{
		static final AuditDataConfiguration INSTANCE = new AuditDataConfiguration();
	}

	/**
	 * returns the instance of the AuditDataConfiguration. This method have been changed to final due to checkstyles
	 * issue fixing.This might be changed if any classes extends in future
	 * 
	 * @return object of the AuditDataConfiguration type.
	 */
	public static AuditDataConfiguration getInstance()
	{
		return AuditDataConfigurationHolder.INSTANCE;
	}

	/**
	 * This method is used to initialize FormatterCache
	 */
	private static void initializeFormatterCache()
	{
		String allformats = AuditConstants.EVENT_PROP_READER.retrieveProperty("ALL_AUDIT_FORMATS");
		String[] formatArr = allformats.split(",");
		formatterCache = new ArrayList<Class>();
		String aFormatterClass;
		for (String aFormat : formatArr)
		{
			aFormatterClass = AuditConstants.EVENT_PROP_READER.retrieveProperty(aFormat
					+ AuditConstants.AUDIT_FORMAT_CLASS_EXTN);
			try
			{
				formatterCache.add(Class.forName(aFormatterClass));
			} catch (ClassNotFoundException e)
			{
				LOGGER.cterror("CTAUD00093", e, aFormatterClass);
			}
		}
	}

	/**
	 * This method is triggered to parse the contents of the audit and retrieve it in the format requested.
	 * 
	 * @param auditContent
	 * @param format
	 * @param mode
	 * @return Map
	 * @throws AuditHandlerException
	 */
	public final Map<String, Object> parseAuditContent(String auditContent, ParseOutputFormat format,
			ParseOutputMode mode) throws AuditHandlerException
	{
		IAuditOutputFormatter formatter = null;
		// Go through the various audit output formatters and check which one is ready to parse and provide data.
		for (Class formatterClass : formatterCache)
		{
			try
			{
				formatter = (IAuditOutputFormatter) formatterClass.newInstance();
				if (formatter.canParse(auditContent))
					break;
			} catch (InstantiationException e)
			{
				throw new AuditHandlerException("AUDERR", "Error while instantiating formatter class", e);
			} catch (IllegalAccessException e)
			{
				throw new AuditHandlerException("AUDERR", "Error while instantiating formatter class", e);
			}
		}
		if (formatter != null)
			return formatter.parse(auditContent, format, mode);
		else
			return null;
	}

	/***
	 * returns the auditDataValue for the event id passed. This method have been changed to final due to checkstyles
	 * issue fixing.This might be changed if any classes extends in future
	 * 
	 * @param eventId A {@code String}
	 * @return auditDataValueforId
	 * @throws AuditHandlerException must throw AuditHandlerException
	 */
	public final AuditDataValue getAuditDataValue(final long eventId) throws AuditHandlerException
	{
		AuditDataValue auditDataValueforId = null;
		CacheManager mngr = CacheManager.getFWInstance();
		ArrayList<HashMap> auditDataConfig = (ArrayList<HashMap>) mngr.getDataFromCache(null, "AUDIT_CACHE");
		HashMap auditDataMap = auditDataConfig.get(0);

		if (!auditDataMap.containsKey(eventId))
		{
			auditDataValueforId = retrieveAuditConfigurationFor(eventId);
			auditDataMap.put(eventId, auditDataValueforId);
		} else
		{
			auditDataValueforId = (AuditDataValue) auditDataMap.get(eventId);
			auditDataValueforId.preProcessConfiguration();

		}

		return auditDataValueforId;
	}

	/**
	 * Helper method to retrive the details from database for this audit configuration and wrap into the VO structure
	 * 
	 * @param eventId The event id for which audit details needs to be fetched.
	 * @return The processed AuditDataValue object
	 * @throws AuditHandlerException
	 */
	private AuditDataValue retrieveAuditConfigurationFor(final long eventId) throws AuditHandlerException
	{
		AuditDataValue dataValue = new AuditDataValue();
		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		DatabaseResult dbResult = null;

		dbRequest.setDataAccessMapKey(AuditConstants.AUDIT_HANDLER_DAM_KEY);
		dbRequest.setOperation(DatabaseConstants.SELECT);
		dbRequest.setOperationExtension(AuditConstants.AUDIT_EXT_CONFIGURATION_DATA);
		// Add the filter for Event Id
		dbRequest.addFilter("EVENT_ID", Long.valueOf(eventId));
		try
		{
			dbResult = dbRequest.execute();
			populateIntoVO(dataValue, dbResult.getReturnedList());
			dataValue.preProcessConfiguration();
		} catch (DatabaseException dbx)
		{
			LOGGER.cterror("CTAUD00094", dbx, eventId);
			throw new AuditHandlerException("AUDERR", "Error while retrieving Audit configuration for event '"
					+ eventId + "'", dbx);
		}
		return dataValue;
	}

	/**
	 * Helper method to process the result list into the VO.
	 * 
	 * @param dataValue
	 * @param selectedRecords
	 */
	private void populateIntoVO(AuditDataValue dataValue, List selectedRecords)
	{
		boolean first = true;
		HashMap aRecord;
		// Using a linked hashmap to preserve the order in which the configuration was retrieved from database.
		Map<String, AuditFieldConfig> childConfigMap = new LinkedHashMap<String, AuditFieldConfig>();
		AuditFieldConfig aFieldConfig;
		for (Object anItem : selectedRecords)
		{
			aRecord = (HashMap) anItem;
			if (first)
			{
				// Populate basic details from the first item into the VO.
				first = false;
				dataValue.setEventId((Long) aRecord.get(AuditConstants.EVENT_ID));
				dataValue.setAuditFormatterClass((String) aRecord.get(AuditConstants.AUDIT_FORMATTER_CLASS));
				dataValue.setAuditId((Long) aRecord.get(AuditConstants.AUDIT_ID));
				dataValue.setResourceBundle((String) aRecord.get(AuditConstants.RESOURCE_BUNDLE));
				dataValue.setDataTranslatorClass((String) aRecord.get(AuditConstants.DATA_TRANSLATOR_CLASS));
				dataValue.setData(childConfigMap);
			}
			// Now create the field configuration and add it to the child config map.
			aFieldConfig = new AuditFieldConfig();
			aFieldConfig.setRequiredInd((Boolean) aRecord.get(AuditConstants.REQUIRED_IND));
			aFieldConfig.setTranslationRequiredInd((Boolean) aRecord.get(AuditConstants.TRANS_FIELD_IND));
			aFieldConfig.setUsedForDsa((Boolean) aRecord.get(AuditConstants.USED_FOR_DSA));
			aFieldConfig.setFieldName((String) aRecord.get(AuditConstants.FIELD_NAME));
			aFieldConfig.setLabelPrefix((String) aRecord.get(AuditConstants.LABLE_PREFIX));
			aFieldConfig.setFieldResourceBundle((String) aRecord.get(AuditConstants.FIELD_RESOURCE_BUNDLE));
			aFieldConfig.setCollectionInd((Boolean) aRecord.get(AuditConstants.COLLECTION_FIELD_IND));
			aFieldConfig.setCollectionFieldReference((String) aRecord.get(AuditConstants.COLLECTION_REF_FIELD));
			aFieldConfig.setFieldLabel((String) aRecord.get(AuditConstants.FIELD_LABEL));
			aFieldConfig.setCountLabel((String) aRecord.get(AuditConstants.COUNT_LABEL));
			aFieldConfig.setCollectionLabel((String) aRecord.get(AuditConstants.COLLECTION_ELEM_LBL));
			// Add to the child config collection
			childConfigMap.put(aFieldConfig.getFieldName(), aFieldConfig);
		}
	}

	private static List<Class> formatterCache = null;
	private static final Logger LOGGER = Logger.getLogger(AuditDataConfiguration.class);
}
