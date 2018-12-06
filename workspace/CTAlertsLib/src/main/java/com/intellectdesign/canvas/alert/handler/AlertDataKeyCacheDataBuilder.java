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
package com.intellectdesign.canvas.alert.handler;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.intellectdesign.canvas.cache.handler.CacheDataBuilder;
import com.intellectdesign.canvas.database.CanvasDatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseResult;
import com.intellectdesign.canvas.logger.Logger;

/**
 * This class is responsible for getting the alert data for all alert ids from database and formatting it for Caching
 * This class is the extension of the canvas CacheHandler
 * 
 * @see com.intellectdesign.canvas.cache.handler.CacheDataBuilder
 * 
 * @version 1.0
 */
public class AlertDataKeyCacheDataBuilder extends CacheDataBuilder
{

	/**
	 * This method returns the all the alert ids and their data keys as list for Caching 
	 * 
	 * @param params Hasmap of alert data keys
	 * 
	 * @return AlertDataKeys List of alert ids and their data keys
	 */
	protected List initializeCache(HashMap params)
	{
		logger.ctinfo("CTALT00001");
		List returnList = new ArrayList();
		try
		{
			returnList = retrieveAllAlertDataKeys();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00002", dbEx);
			// Exception is caught and eaten up since this is only while refereshing cache
		}
		if (returnList != null && !returnList.isEmpty())
			returnList = formatAlertDataKeyDetails(returnList);
		else
			logger.cterror("CTALT00003");

		logger.ctinfo("CTALT00004");
		return returnList;
	}

	/**
	 * This method provides empty implementation since no validation required on the alert data keys
	 * 
	 * @param params Hashmap of parameter values for validation
	 * 
	 * @return null
	 */
	protected String validateParameters(HashMap params)
	{
		return null;
	}

	/**
	 * This method formats the data keys of all alerts to meet the caching requirement of the framework. 
	 * Incoming list will be in the format [{ALERT_ID='ALERT_ID1', DATA_KEY_LIST=[{DATA_KEY='DATA_KEY1','DATA_KEY2'..},...]},.....]. 
	 * 	
	 * This List is formatted such that the output is in format [{'ALERT_ID1'=[{DATA_KEY='DATA_KEY1',..},..],..]as expected by the framework
	 * 
	 * @param inList List value of Alert and Alerts Data Key 
	 * 
	 * @return FormattedAlertDataKey List value of formatted Alert and Alert Data Keys
	 */
	private List formatAlertDataKeyDetails(List inList)
	{
		logger.ctinfo("CTALT00005");
		HashMap hmAlertMap = null;
		String sAlertId = null;
		List dataKeyList = null;
		int inListSize = inList.size();
		HashMap listFormattedMap = new HashMap();

		for (int i = 0; i < inListSize; i++)
		{
			hmAlertMap = (HashMap) inList.get(i);
			logger.ctdebug("CTALT00006", hmAlertMap);
			sAlertId = (String) hmAlertMap.get(AlertConstants.ALERT_ID);
			dataKeyList = (List) hmAlertMap.get(AlertConstants.DATA_KEY_LIST);
			listFormattedMap.put(sAlertId, dataKeyList);
		}
		inList = new ArrayList();
		if (listFormattedMap != null)
		{
			inList.add(listFormattedMap);
		}
		logger.ctdebug("CTALT00007", inList);
		logger.ctinfo("CTALT00008");
		return inList;
	}

	/**
	 * This method retrieves the entire set of data keys for all the alert ids
	 * [{ALERT_ID='ALERT_ID1', DATA_KEY_LIST=[{DATA_KEY='DATA_KEY1',..},...]
	 * 
	 * @return AllAlertDataKeys Lis value of all the alerts and their data keys 
	 * @exception DatabaseException
	 */
	public List retrieveAllAlertDataKeys() throws DatabaseException
	{
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		List returnList = null;

		logger.ctinfo("CTALT00009");
		try
		{
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setOperationExtension(AlertConstants.ALERT_EXT_GET_ALL_ALERT_DATA_KEYS);
			dbResult = dbRequest.execute();
			returnList = dbResult.getReturnedList();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00010", dbEx);
			throw dbEx;
		}
		logger.ctdebug("CTALT00011", returnList);
		logger.ctinfo("CTALT00012");
		return returnList;
	}

	private static Logger logger = Logger.getLogger(AlertDataKeyCacheDataBuilder.class);
}
