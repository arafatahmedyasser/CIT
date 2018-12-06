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

package com.intellectdesign.canvas.database;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.intellectdesign.canvas.cache.handler.CacheDataBuilder;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.DBConfigurationDescriptor;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.utils.StringUtils;

/**
 * This is a generic database cache handler that fetches data from the database based on the configuration parameters
 * provided. This expects the following parameters to be configured in the Configuration XML. (a) DATA_ACCESS_MAP_KEY
 * (b) DATA_ACCESS_EXTN. The actual clause formed will be - DATA_ACCESS_MAP_KEY + SELECT + DATA_ACCESS_EXTN.
 * 
 * @version 1.0
 */
public class GenericDatabaseCacheDataBuilder extends CacheDataBuilder
{
	/**
	 * Default constructor
	 */
	public GenericDatabaseCacheDataBuilder()
	{

	}

	/**
	 * this is ref to GetDataBaseCacheHandlerAccessMapKey
	 * 
	 * @return the mDataAccessMapKey
	 */
	public String getDataAccessMapKey()
	{
		return mDataAccessMapKey;
	}

	/**
	 * this is ref to SetDataAccessMapKey
	 * 
	 * @param dataAccessMapKey the mDataAccessMapKey to set
	 */
	public void setDataAccessMapKey(String dataAccessMapKey)
	{
		mDataAccessMapKey = dataAccessMapKey;
	}

	/**
	 * thisis ref to GETDataAccessExtn
	 * 
	 * @return the mDataAccessExtn
	 */
	public String getDataAccessExtn()
	{
		return mDataAccessExtn;
	}

	/**
	 * this is ref to SetDataAccessExtn
	 * 
	 * @param dataAccessExtn the mDataAccessExtn to set
	 */
	public void setDataAccessExtn(String dataAccessExtn)
	{
		mDataAccessExtn = dataAccessExtn;
	}

	/**
	 * this is ref to parmeters to hashmap Override the base class implementation to retrieve the parameters and store
	 * the same in local variables
	 */
	@Override
	protected void setParameters(HashMap params)
	{
		super.setParameters(params);
		setDataAccessMapKey((String) params.get(PARAM_KEY_DATA_ACCESS_MAP_KEY));
		setDataAccessExtn((String) params.get(PARAM_KEY_DATA_ACCESS_EXTN));
	}

	/**
	 * Initialize the contents of the cache.
	 * 
	 * @param params
	 * @see com.intellectdesign.CacheDataBuilder.cache.CacheHandler#initializeCache(javax.servlet.http.HttpSession)
	 */
	@Override
	protected List initializeCache(HashMap hashMap)
	{
		List returnList = null;
		// Use the data access map key and data access extn to create a DB request and return the result list.
		DatabaseRequest dbRequest = new DatabaseRequest();

		if (mFWDataSourceFlag)
		{
			DBConfigurationDescriptor descriptor = ConfigurationManager.getInstance().getDBDescriptor();
			dbRequest.setDataSource(descriptor.getCtFWIBATISDSKey());
		}
		dbRequest.setDataAccessMapKey(getDataAccessMapKey());
		dbRequest.setOperation(DatabaseConstants.SELECT);
		dbRequest.setOperationExtension(getDataAccessExtn());

		try
		{
			returnList = dbRequest.execute().getReturnedList();
			LOGGER.ctdebug("CTRND00065", getDataAccessMapKey(), getDataAccessExtn(), returnList);
		} catch (DatabaseException e)
		{
			LOGGER.cterror("CTRND00066", e, getDataAccessMapKey(), getDataAccessExtn());
			// Eat the exception as this method cannot throw an exception.
			returnList = new ArrayList();
		}

		return returnList;
	}

	/**
	 * Here we validate whether the necessary parameters have been provided
	 * 
	 * @param params
	 * @return
	 * @see com.intellectdesign.canvas.cache.handler.CacheDataBuilder#validateParameters(java.util.HashMap)
	 */
	@Override
	protected String validateParameters(HashMap params)
	{
		String errors = "";

		LOGGER.ctdebug("CTRND00067", params);
		// Step 1: Check whether the Data access map key has been provided.
		if (!params.containsKey(PARAM_KEY_DATA_ACCESS_MAP_KEY))
		{
			errors += "Missing Mandatory Parameter with Key='" + PARAM_KEY_DATA_ACCESS_MAP_KEY + "'.";
		} else
		{
			mDataAccessMapKey = (String) params.get(PARAM_KEY_DATA_ACCESS_MAP_KEY);
		}
		// Step 2: Check whether the Data access extension key has been provided.
		if (!params.containsKey(PARAM_KEY_DATA_ACCESS_EXTN))
		{
			errors += "Missing Mandatory Parameter with Key='" + PARAM_KEY_DATA_ACCESS_EXTN + "'.";
		} else
		{
			mDataAccessExtn = (String) params.get(PARAM_KEY_DATA_ACCESS_EXTN);
		}
		if (params.containsKey("FW_DATA_SOURCE_FLAG"))
		{
			mFWDataSourceFlag = StringUtils.convertToBoolean((String) params.get("FW_DATA_SOURCE_FLAG"));
		}

		// Nullify the errors if none were identified.
		if (errors.trim().length() == 0)
			errors = null;
		else
		{
			LOGGER.cterror("CTRND00068", errors);
		}

		return errors;
	}

	private String mDataAccessMapKey = "";
	private String mDataAccessExtn = "";
	private boolean mFWDataSourceFlag = false;

	private static final String PARAM_KEY_DATA_ACCESS_MAP_KEY = "DATA_ACCESS_MAP_KEY";
	private static final String PARAM_KEY_DATA_ACCESS_EXTN = "DATA_ACCESS_EXTN";
	private static final Logger LOGGER = Logger.getLogger(GenericDatabaseCacheDataBuilder.class);
}
