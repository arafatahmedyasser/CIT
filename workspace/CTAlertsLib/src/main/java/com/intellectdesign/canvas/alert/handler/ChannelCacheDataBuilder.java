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
 * This is a handler class for caching all the channels that are fetched from the database for the alerts.
 * This class extends the CacheHandler. 
 * 
 * @See com.intellectdesign.canvas.cache.handler.CacheHandler  
 * 
 * @version 1.0
 */
public class ChannelCacheDataBuilder extends CacheDataBuilder
{

	/**
	 * This method initializes the cache with the List of Channels applicable for alerts 
	 * 
	 * @param Params Hashmap of the caching parameters
	 * @return ChannelList List value of the channels for alerts
	 */
	protected List initializeCache(HashMap params)
	{
		logger.ctinfo("CTALT00039");
		List returnList = null;
		try
		{
			returnList = retrieveAllChannelHandlers();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00040");
			// Exception is caught and eaten up since this is only while refereshing cache
		}
		if (returnList != null && !returnList.isEmpty())
			returnList = formatChannelHandlerDetails(returnList);
		else
			logger.ctdebug("CTALT00041");

		logger.ctinfo("CTALT00042");
		return returnList;
	}

	/**
	 * This method provides the empty implementation since no validation is required
	 * 
	 * @param params
	 * @return null
	 */
	protected String validateParameters(HashMap params)
	{
		return null;
	}

	/**
	 * This method formats the List of entire channel Handlers so as to meet the requirement of the framework. 
	 * Incoming list will be in the Format [{ALERT_ID= 'ALERT_ID1',CHANNEL_HANDLER_LIST=[{'CHANNEL_HANDLER_ID1',..},{'CHANNEL_HANDLER_ID2',..}]},{ALERT_ID='ALERT_ID2',...
	 * . . ] 
	 * 
	 * This List is formatted such that the output is in format [{'ALERT_ID1'=[{'CHANNEL_HANDLER_ID1',..},{'CHANNEL_HANDLER_ID2',..}],'ALERT_ID2'=..}] 
	 * 
	 * @param inList List value of Alert ids and their handlers 
	 * 
	 * @return ChannelHandler List value of formatted Alert IDs and Handler Ids
	 */
	private List formatChannelHandlerDetails(List inList)
	{
		logger.ctinfo("CTALT00043");
		HashMap hmAlertMap = null;
		String sAlertId = null;
		List channelHandlerList = null;
		int inListSize = inList.size();
		HashMap listFormattedMap = new HashMap();

		for (int i = 0; i < inListSize; i++)
		{
			hmAlertMap = (HashMap) inList.get(i);
			logger.ctdebug("CTALT00044", hmAlertMap);
			sAlertId = (String) hmAlertMap.get(AlertConstants.ALERT_ID);
			channelHandlerList = (List) hmAlertMap.get(AlertConstants.CHANNEL_HANDLER_LIST);
			listFormattedMap.put(sAlertId, channelHandlerList);
		}
		inList = new ArrayList();
		if (listFormattedMap != null)
		{
			inList.add(listFormattedMap);
		}
		logger.ctdebug("CTALT00045", inList);
		logger.ctinfo("CTALT00046");
		return inList;
	}

	/**
	 * This method retrieves the entire set of channels handlers for all the alert ids 
	 * [{ALERT_ID= 'ALERT_ID1',CHANNEL_HANDLER_LIST=[{'CHANNEL_HANDLER_ID1',..},{'CHANNEL_HANDLER_ID2',..}]},{ALERT_ID='ALERT_ID2',.. ] *
	 * 
	 * @return Returns the list of channel Handlers for all the alert ids
	 * @exception DatabaseException
	 */
	public static List retrieveAllChannelHandlers() throws DatabaseException
	{
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		List returnList = null;

		logger.ctinfo("CTALT00047");
		try
		{
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setOperationExtension(AlertConstants.ALERT_EXT_GET_ALL_CHANNEL_HANDLER_DTLS);
			dbResult = dbRequest.execute();
			returnList = dbResult.getReturnedList();

		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00048", dbEx);
			throw dbEx;
		}
		logger.ctdebug("CTALT00049", returnList);
		logger.ctinfo("CTALT00050");
		return returnList;
	}

	private static Logger logger = Logger.getLogger(ChannelCacheDataBuilder.class);
}
