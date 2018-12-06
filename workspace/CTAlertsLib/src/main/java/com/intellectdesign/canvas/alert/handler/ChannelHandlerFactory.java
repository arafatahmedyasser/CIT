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
import java.util.Iterator;
import java.util.List;

import com.intellectdesign.canvas.cache.handler.CacheManager;
import com.intellectdesign.canvas.database.CanvasDatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseResult;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.properties.reader.PropertyReader;


/**
 * This is a singleton. This class reads all known channel handlers from DB.
 * 
 * @version 1.0
 */
public class ChannelHandlerFactory
{

	/**
	 * This constructor just ensures the outside world cannot instantiate this class.
	 */
	public ChannelHandlerFactory()// CHCR
	{
	}

	/**
	 * This method creates the lazy instantiation for singleton
	 * 
	 * @return channelHandlerFactory Instance of the ChannelHandlerFactory
	 */
	public static ChannelHandlerFactory getInstance()
	{
		return channelHandlerFactory;
	}

	/**
	 * This method picks the channel handler classes for an alert from a DB cache and returns it. If handlers not
	 * present in cache, makes a database hit to get the list of channel handlers and populates in cache and returns
	 * 
	 * @param sAlertId String value of the sAlertId
	 * 
	 * @return ChannelHandlersForAlert the Iterator object of the list of Channel Handlers.
	 * 
	 * @exception AlertHandlerException
	 */

	public Iterator getChannelHandlersForAlert(String sAlertId) throws AlertHandlerException
	{
		return getListOfChannelHandlersForAlert(sAlertId).iterator();
	}

	/**
	 * This method picks the channel handler class from a DB cache and returns it. If not present in cache makes a
	 * database hit to get the list of channel handlers and populates in cache and returns
	 * 
	 * @param sAlertId String value of the sAlertId
	 * 
	 * @return ChannelHandlersForAlert the Iterator object of the list of Channel Handlers.
	 * 
	 * @exception AlertHandlerException
	 * 
	 */
	public ArrayList getListOfChannelHandlersForAlert(String sAlertId) throws AlertHandlerException

	{
		// This is the list of handlers to be used as return parameter
		List listHandlers = null;
		List listChannelHandlerObjs = null;

		logger.ctinfo("CTALT00051");
		logger.ctdebug("CTALT00052", sAlertId);
		/**
		 * This gets the entire list of channel handlers for all alerts present in the cache. The Database cache
		 * component is used. What is cached: A map with key as the alert id and the value as a list of Channel handler
		 * instances Each channel handler handler instance should be instantiated with the channel id If yes then fetch
		 * the details of the channel handler from the cache and skip fetching from the DB. Else proceed to fetch list
		 * of handlers from DB. The first parameter expected in getDataFromCache is session object. Since the cache used
		 * is a DB cache and not a session cache the value is passed as null
		 */

		listHandlers = CacheManager.getFWInstance().getDataFromCache(null, AlertConstants.CHANNELS);
		if (listHandlers != null && listHandlers.size() > 0)
		{
			HashMap handlerMap = (HashMap) listHandlers.get(0);
			logger.ctdebug("CTALT00053", handlerMap);
			listHandlers = (List) handlerMap.get(sAlertId);
		}

		/**
		 * Now use this alert Id, go to the DB and pick out all associated Handlers if the list of handlers are not
		 * available in cache. Communicates with the DB framework to fetch the list of handlers from the DB.
		 */
		else
		{
			try
			{
				listHandlers = getAllChannelsForAlert(sAlertId);
			} catch (DatabaseException dbEx)
			{
				logger.cterror("CTALT00054", dbEx);
				throw new AlertHandlerException(AlertConstants.ERR_ALERT_DB_EX,
						prptReader.retrieveProperty(AlertConstants.ERR_ALERT_DB_EX));
			}
		}

		logger.ctdebug("CTALT00055", listHandlers);
		if (listHandlers != null)
		{

			listChannelHandlerObjs = getChannelHandlers(listHandlers);
		} else
		{
			logger.ctdebug("CTALT00056");
			throw new AlertHandlerException(AlertConstants.ERR_CHANNEL_HANDLERS_NULL,
					prptReader.retrieveProperty(AlertConstants.ERR_CHANNEL_HANDLERS_NULL));
		}
		logger.ctinfo("CTALT00057");
		return (ArrayList) listChannelHandlerObjs;
	}

	/**
	 * This method gives all channel handlers supported by Canvas as a list.
	 * 
	 * @return listChannelHandlerObjs List object of the all channel handlers
	 * 
	 * @exception AlertHandlerException
	 */
	public List<IChannelHandler> getAllChannelHandlers() throws AlertHandlerException
	{

		logger.ctinfo("CTALT00058");
		ArrayList<IChannelHandler> listChannelHandlerObjs = null;
		List<HashMap> listHandlers = null;
		AlertHandlerInstruction alertHandlerInstr = new AlertHandlerInstruction();

		try
		{
			listHandlers = alertHandlerInstr.getAllChannelHandlers();
			logger.ctdebug("CTALT00059" + listHandlers);
			if (listHandlers != null)
			{
				listChannelHandlerObjs = getChannelHandlers(listHandlers);
			}
		} catch (AlertHandlerException ahEx)
		{
			logger.cterror("CTALT00060", ahEx);
			throw ahEx;
		} catch (DatabaseException e)
		{
			logger.cterror("CTALT00061", e);
			throw new AlertHandlerException("DBERROR", "database exception occured.");
		}
		logger.ctinfo("CTALT00062");
		return listChannelHandlerObjs;
	}

	/**
	 * This method converts the List object of the channel handlers as ArrayList object.
	 * 
	 * @param listHandlers List object of the channel handlers
	 * 
	 * @return listChannelHandlerObjs Array List object of channel handlers
	 * 
	 * @exception AlertHandlerException
	 */
	private ArrayList getChannelHandlers(List listHandlers) throws AlertHandlerException
	{
		ArrayList listChannelHandlerObjs = null;
		String sChannelId = null;
		String sChannelName = null;
		String sHandlerClassName = null;
		IChannelHandler channelHandler = null;
		int listHandlerSize = 0;
		HashMap hmHandlerDetailsMap = null;

		listHandlerSize = listHandlers.size();
		listChannelHandlerObjs = new ArrayList();
		/**
		 * Will need to do this whether or not the list of handlers was from the cache or from the DB. To loop through
		 * all the channel handlers mapped to the alert.
		 */
		for (int loop = 0; loop < listHandlerSize; loop++)
		{
			hmHandlerDetailsMap = (HashMap) listHandlers.get(loop);
			logger.ctdebug("CTALT00063", hmHandlerDetailsMap);
			sChannelId = (String) hmHandlerDetailsMap.get(AlertConstants.CHANNEL_ID);
			sChannelName = (String) hmHandlerDetailsMap.get(AlertConstants.CHANNEL_NAME);
			sHandlerClassName = (String) hmHandlerDetailsMap.get(AlertConstants.CHANNEL_HANDLER);
			try
			{
				channelHandler = (IChannelHandler) Class.forName(sHandlerClassName).newInstance();
			} catch (IllegalAccessException illegalAccessException)
			{
				logger.cterror("CTALT00064", illegalAccessException);
				throw new AlertHandlerException(AlertConstants.ERR_ALERT_ILL_ACCESS_EX,
						prptReader.retrieveProperty(AlertConstants.ERR_ALERT_ILL_ACCESS_EX));
			} catch (InstantiationException instantiationException)
			{
				logger.cterror("CTALT00065", instantiationException);
				throw new AlertHandlerException(AlertConstants.ERR_ALERT_INST_EX,
						prptReader.retrieveProperty(AlertConstants.ERR_ALERT_INST_EX));
			} catch (ClassNotFoundException classNotFoundException)
			{
				logger.cterror("CTALT00066", classNotFoundException);
				throw new AlertHandlerException(AlertConstants.ERR_ALERT_CLASS_EX,
						prptReader.retrieveProperty(AlertConstants.ERR_ALERT_CLASS_EX));
			}

			channelHandler.setChannelId(sChannelId);
			channelHandler.setChannelName(sChannelName);
			listChannelHandlerObjs.add(channelHandler);
		}
		return listChannelHandlerObjs;
	}

	/**
	 * This method gets the list of channel handlers for the given alert id
	 * 
	 * @param sAlertID String value of the Alert Id
	 * 
	 * @return AllChannelsForAlert List object of the channel handlers for the alert
	 * 
	 * @exception DatabaseException
	 */
	private List getAllChannelsForAlert(String sAlertID) throws DatabaseException
	{
		logger.ctinfo("CTALT00067");
		DatabaseRequest databaseRequest = null;
		DatabaseResult databaseResult = null;
		List listChannels = null;
		try
		{
			// Go to the DB and fetch all the channels on which this alert needs to be sent.
			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
			databaseRequest.setOperation(DatabaseConstants.SELECT);
			databaseRequest.setOperationExtension(AlertConstants.ALERT_EXT_GET_CHANNEL_HANDLER_DTLS);
			databaseRequest.addFilter(AlertConstants.ALERT_ID, sAlertID);
			databaseResult = databaseRequest.execute();
			listChannels = databaseResult.getReturnedList();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00068", sAlertID, dbEx);
			throw dbEx;
		}
		logger.ctdebug("CTALT00069", listChannels);
		logger.ctinfo("CTALT00070");
		return listChannels;
	}

	// private instance of ChannelHandlerFactory Object
	private static ChannelHandlerFactory channelHandlerFactory = new ChannelHandlerFactory();

	private static Logger logger = Logger.getLogger(ChannelHandlerFactory.class);
	private static PropertyReader prptReader = AlertConstants.ALERT_PROPERTIES;
}