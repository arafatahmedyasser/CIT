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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.cache.handler.CacheDataBuilder;
import com.intellectdesign.canvas.database.CanvasDatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseResult;
import com.intellectdesign.canvas.logger.Logger;

/***
 * This will return all corresponding audit data values from DB.
 * 
 * @version 1.0
 */
public class AuditCacheDataBuilder extends CacheDataBuilder
{

	/**
	 * Initialize the cache with application preference details.This method will be called by cache framework and set
	 * the returned list in application scope. The list can be used throughout the application for getting a table for
	 * lookup for preference values. (non-Javadoc)
	 * 
	 * @see com.intellectdesign.cib.cache.CacheHandler#initializeCache(HashMap hashMap).
	 * @param hashMap - initializeCache.
	 * @return List list containg all available audit data values.
	 */
	@Override
	protected final List initializeCache(final HashMap hashMap)
	{

		logger.ctdebug("CTAUD00006");
		List<Map> auditList = getAuditList();
		logger.ctdebug("CTAUD00007");

		return auditList;
	}

	/**
	 * This method is used to Validate Parameters. There is no validation attached to AuditCache.
	 * 
	 * @param params
	 * @return null
	 * @see com.intellectdesign.canvas.cache.handler.CacheDataBuilder#validateParameters(java.util.HashMap)
	 */
	@Override
	protected final String validateParameters(final HashMap params)
	{
		return null;
	}

	/***
	 * This method will return all the available data from the corresponding DBtables. This method have been changed to
	 * final due to checkstyles issue fixing.This might be changed if any classes extends in future
	 * 
	 * @return auditList which will be an object containing hashmaps of data.
	 */
	public final List getAuditList()
	{

		logger.ctdebug("CTAUD00008");
		List<HashMap> auditList = new ArrayList<HashMap>();
		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		DatabaseResult dbResult = null;
		dbRequest.setDataAccessMapKey(AUDIT_FRMK_MNT);
		dbRequest.setOperation(DatabaseConstants.SELECT);
		dbRequest.setOperationExtension(AUDIT_CONFIGURATION_DATA);
		HashMap map = null;
		try
		{
			dbResult = dbRequest.execute();
			map = populateAuditDataConfiguration(dbResult.getReturnedList());
			auditList.add(map);
		} catch (DatabaseException dbx)
		{
			logger.cterror("CTAUD00010", dbx, dbx.getMessage());
		}
		logger.ctdebug("CTAUD00009");

		return auditList;

	}

	/***
	 * This method is used to get the auditDataValueMap.
	 * 
	 * @param returnedList populateAuditDataConfiguration
	 * @return auditDataValueMap.
	 * @throws DatabaseException
	 */
	private HashMap populateAuditDataConfiguration(final List returnedList) throws DatabaseException
	{

		logger.ctdebug("CTAUD00011");
		Map<Long, AuditDataValue> auditDataValueMap = new HashMap();
		Map auditMap = null;
		try
		{
			for (Object auditObject : returnedList)
			{
				auditMap = (Map) auditObject;
				AuditDataValue auditDataValue = auditDataValueMap.get(auditMap.get(AuditConstants.EVENT_ID));
				if (auditDataValue == null)
				{

					auditDataValue = new AuditDataValue();
					auditDataValue.setEventId((Long) auditMap.get(AuditConstants.EVENT_ID));
					auditDataValue.setAuditFormatterClass((String) auditMap
							.get(AuditConstants.AUDIT_FORMATTER_CLASS));
					auditDataValue.setAuditId((Long) auditMap.get(AuditConstants.AUDIT_ID));
					auditDataValue.setResourceBundle((String) auditMap.get(AuditConstants.RESOURCE_BUNDLE));
					auditDataValue.setDataTranslatorClass((String) auditMap
							.get(AuditConstants.DATA_TRANSLATOR_CLASS));

					auditDataValue.setData(new HashMap());
				}

				AuditFieldConfig auditFieldConfig = new AuditFieldConfig();
				auditFieldConfig.setRequiredInd((Boolean) auditMap.get(AuditConstants.REQUIRED_IND));
				auditFieldConfig.setTranslationRequiredInd((Boolean) auditMap
						.get(AuditConstants.TRANS_FIELD_IND));
				auditFieldConfig.setUsedForDsa((Boolean) auditMap.get(AuditConstants.USED_FOR_DSA));
				auditFieldConfig.setFieldName((String) auditMap.get(AuditConstants.FIELD_NAME));
				auditFieldConfig.setLabelPrefix((String) auditMap.get(AuditConstants.LABLE_PREFIX));
				auditFieldConfig.setFieldResourceBundle((String) auditMap
						.get(AuditConstants.FIELD_RESOURCE_BUNDLE));
				auditFieldConfig.setCollectionInd((Boolean) auditMap.get(AuditConstants.COLLECTION_FIELD_IND));
				auditFieldConfig.setCollectionFieldReference((String) auditMap
						.get(AuditConstants.COLLECTION_REF_FIELD));
				auditFieldConfig.setFieldLabel((String) auditMap.get(AuditConstants.FIELD_LABEL));
				auditFieldConfig.setCountLabel((String) auditMap.get(AuditConstants.COUNT_LABEL));
				auditFieldConfig.setCollectionLabel((String) auditMap.get(AuditConstants.COLLECTION_ELEM_LBL));

				// Inserting the auditFieldConfig object to the data field in the auditDataValue as follows,
				// key as fieldName and value as auditFieldConfig object.
				auditDataValue.getData().put(auditFieldConfig.getFieldName(), auditFieldConfig);
				// Inserting the auditDataValue object to the auditDataValueMap as follows,
				// key as eventId and value as auditDataValue
				auditDataValueMap.put((Long) auditMap.get(AuditConstants.EVENT_ID), auditDataValue);
			}
		} catch (Exception exception)
		{

			logger.cterror("CTAUD00012", exception);
			throw new DatabaseException(exception);
		}
		logger.ctdebug("CTAUD00013");

		return (HashMap) auditDataValueMap;
	}

	private static final Logger logger = Logger.getLogger(AuditCacheDataBuilder.class);
	private static final String AUDIT_FRMK_MNT = "AUDIT_FRMK_MNT";
	private static final String AUDIT_CONFIGURATION_DATA = "AUDIT_CONFIGURATION_DATA";

}
