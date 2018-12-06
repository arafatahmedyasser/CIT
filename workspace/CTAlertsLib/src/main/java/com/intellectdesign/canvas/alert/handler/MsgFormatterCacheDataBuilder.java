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
 * This handler class gets all the Alert Channels and Message Formatters from DB and maintains it  in the Cache.
 *  
 * @version 1.0
 */
public class MsgFormatterCacheDataBuilder extends CacheDataBuilder
{

	/**
	 * This method initializes the Cache with Channel IDs and their Message Formatter 
	 * 
	 * @param params Hashmap of Session parameters to inizialize Cache
	 * 
	 * @return List list object that contains all the Channels for Alerts and their Alert message formatter classes
	 */
	protected List initializeCache(HashMap params)
	{
		logger.ctinfo("CTALT00148");
		List returnList = null;
		try
		{
			returnList = retrieveAllMsgFormatters();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00149", dbEx);
			// Exception is caught and eaten up since this is only while refershing cache
		}
		if (returnList != null && returnList.size() > 0)
			returnList = formatMsgFormatterDetails(returnList);
		else
			logger.ctdebug("CTALT00150");

		logger.ctinfo("CTALT00146");
		return returnList;
	}

	/**
	 * This method provides empty implementation since no validation is required
	 * 
	 * @param params Hashmap of the session object for validations
	 * 
	 * @return null
	 */
	protected String validateParameters(HashMap params)
	{
		return null;
	}

	/**
	 * This method formats the List of message formatter to meet the Alert Framework. 
	 * Input list will be in the format of [{CHANNEL_ID='CHANNEL_ID1',MESSAGE_FORMATTER='MESSAGE_FORMATTER1'},{CHANNEL_ID='CHANNEL_ID',.....]

	 * This method will return the List in the form of [{'CHANNEL_ID1'='MESSAGE_FORMATTER1'},{'CHANNEL_ID2'='MESSAGE_FORMATTER2'},...]
	 *  
	 * @param inList List object that contains the list of channel Ids and the formatter classes
	 * 
	 * @return FormmatedList List object of Channels and the Message formatter classes in the form required by Alert Framework
	 */
	private List formatMsgFormatterDetails(List inList)
	{
		logger.ctinfo("CTALT00152");
		HashMap hmChannelMap = null;
		String sAlertId = null;
		String sMsgFormatter = null;
		int inListSize = inList.size();
		HashMap listFormattedMap = new HashMap();

		for (int i = 0; i < inListSize; i++)
		{
			hmChannelMap = (HashMap) inList.get(i);
			sAlertId = (String) hmChannelMap.get(AlertConstants.CHANNEL_ID);
			sMsgFormatter = (String) hmChannelMap.get(AlertConstants.CHANNEL_FORMATTER);
			listFormattedMap.put(sAlertId, sMsgFormatter);
		}
		inList = new ArrayList();
		if (listFormattedMap != null)
		{
			inList.add(listFormattedMap);
		}
		logger.ctdebug("CTALT00153", inList);
		logger.ctinfo("CTALT00154");
		return inList;
	}

	/**
	 * This method retrieves all the Alert Channels and the message formtters present in CHANNEL_MASTER table. 
	 * The list returns the data in the format [{CHANNEL_ID='CHANNEL_ID1',CHANNEL_FORMATTER='CHANNEL_FORMATTER1'},{CHANNEL_ID='CHANNEL_ID',...]
	 * 
	 * @return returnList List object that contains all the channels and thier message formatter 
	 * 
	 * @throws DatabaseException
	 */
	public static List retrieveAllMsgFormatters() throws DatabaseException
	{
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		List returnList = null;

		logger.ctinfo("CTALT00155");
		try
		{
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setOperationExtension(AlertConstants.ALERT_EXT_GET_ALL_MSG_FORMATTER_DTLS);
			dbResult = dbRequest.execute();
			returnList = dbResult.getReturnedList();

		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00156", dbEx);
			throw dbEx;
		}
		logger.ctdebug("CTALT00157", returnList);
		logger.ctinfo("CTALT00158");
		return returnList;
	}

	private static Logger logger = Logger.getLogger(MsgFormatterCacheDataBuilder.class);
}
