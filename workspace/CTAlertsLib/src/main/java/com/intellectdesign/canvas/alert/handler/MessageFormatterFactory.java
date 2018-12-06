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

import java.util.HashMap;
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
 * This is a singleton. This class is responsible to read message formatters Cache (if available) or from DB.
 * 
 * @version 1.0
 */
public class MessageFormatterFactory
{

	/**
	 * This method just prevents the instantiation of this class.
	 */
	private MessageFormatterFactory()
	{
	}

	/**
	 * This method creates the lazy instantiation of the Message Formatter Factory 
	 * 
	 * @return An instance of the MessageFormatterFactory
	 */
	public static MessageFormatterFactory getInstance()
	{
		return messageFormatterFactory;
	}

	/**
	 * This method returns the message formatter calls from the Cache, for the channel in which the message will be posted; 
	 * If the message formatter is not available in Cache, it makes a database request and populates in cache.
	 * 
	 * @param sChannelId String value of the Alert Channel Id
	 * 
	 * @return MessageFormatter MessageFormmater object that can format the data into readable message
	 * 
	 * @throws AlertHandlerException
	 */
	public MessageFormatter getMessageFormatter(String sChannelId) throws AlertHandlerException
	{
		String sMsgFormatterClassName = null;
		MessageFormatter messageFormatter = null;
		List listMsgFormatters = null;

		logger.ctinfo("CTALT00128");
		logger.ctdebug("CTALT00129", sChannelId);
		
		/*
		 * Gets the message formatter class for the channel id present in the cache. The Database cache component is
		 * used. 
		 * 
		 * What is cached: A map with key as the Channel id and the value as the formatter class instance If yes
		 * then fetch the details of the message formatter from the cache and skip fetching from the DB. Else proceed to
		 * fetch the formatter class from DB. The first parameter expected in getDataFromCache is session object. Since
		 * the cache used is a DB cache and not a session cache the value is passed as null
		 */

		listMsgFormatters = CacheManager.getInstance().getDataFromCache(null, AlertConstants.MSG_FORMATTERS);
		if (listMsgFormatters != null && listMsgFormatters.size() > 0)
		{
			HashMap handlerMap = (HashMap) listMsgFormatters.get(0);
			logger.ctdebug("CTALT00130", handlerMap);
			sMsgFormatterClassName = (String) handlerMap.get(sChannelId);
		}
		/*
		 * Now use this channel Id, go to the DB and pick out all associated Handlers if the list of handlers are not
		 * available in cache. Communicates with the DB framework to fetch the list of handlers from the DB.
		 */
		else
		{
			sMsgFormatterClassName = getMessageFormatterForChannel(sChannelId);
		}
		logger.ctdebug("CTALT00131", sMsgFormatterClassName);
		if (sMsgFormatterClassName != null)
		{
			try
			{
				messageFormatter = (MessageFormatter) Class.forName(sMsgFormatterClassName).newInstance();
			} catch (IllegalAccessException illegalAccessException)
			{
				logger.cterror("CTALT00132", illegalAccessException);
				throw new AlertHandlerException(AlertConstants.ERR_ALERT_ILL_ACCESS_EX,
						prptReader.retrieveProperty(AlertConstants.ERR_ALERT_ILL_ACCESS_EX));
			} catch (InstantiationException instantiationException)
			{
				logger.cterror("CTALT00133", instantiationException);
				throw new AlertHandlerException(AlertConstants.ERR_ALERT_INST_EX,
						prptReader.retrieveProperty(AlertConstants.ERR_ALERT_INST_EX));
			} catch (ClassNotFoundException classNotFoundException)
			{
				logger.cterror("CTALT00134", classNotFoundException);
				throw new AlertHandlerException(AlertConstants.ERR_ALERT_CLASS_EX,
						prptReader.retrieveProperty(AlertConstants.ERR_ALERT_CLASS_EX));
			}
		} else
		{
			logger.ctdebug("CTALT00135");
			throw new AlertHandlerException(AlertConstants.ERR_MSG_FORMATTER_NULL,
					prptReader.retrieveProperty(AlertConstants.ERR_MSG_FORMATTER_NULL));
		}

		logger.ctinfo("CTALT00136");
		return messageFormatter;
	}

	/**
	 * This method gets the message formatter class for the given channel id from the Database
	 * 
	 * @param sChannelId String value of the Alert Channel Id
	 * 
	 * @return MessageFormatter MessageFormmater object that can format the plain data to a readable message
	 * 
	 * @throws AlertHandlerException
	 */
	private String getMessageFormatterForChannel(String sChannelId) throws AlertHandlerException
	{
		logger.ctinfo("CTALT00137");
		DatabaseRequest databaseRequest = null;
		DatabaseResult databaseResult = null;
		List listMsgFormatter = null;
		String sMsgFormatter = null;
		try
		{
			// Go to the DB and fetch the message formatter for the channel id
			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
			databaseRequest.setOperation(DatabaseConstants.SELECT);
			databaseRequest.setOperationExtension(AlertConstants.ALERT_EXT_GET_MSG_FORMATTER_DTLS);
			databaseRequest.addFilter(AlertConstants.CHANNEL_ID, sChannelId);
			databaseResult = databaseRequest.execute();
			listMsgFormatter = databaseResult.getReturnedList();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00138", dbEx, sChannelId);
			throw new AlertHandlerException(AlertConstants.ERR_ALERT_DB_EX,
					prptReader.retrieveProperty(AlertConstants.ERR_ALERT_DB_EX));
		}
		if (listMsgFormatter != null)
			sMsgFormatter = (String) listMsgFormatter.get(0);
		else
		{
			logger.ctdebug("CTALT00139", sChannelId);
			throw new AlertHandlerException(AlertConstants.ERR_MSG_FORMATTER_NULL,
					prptReader.retrieveProperty(AlertConstants.ERR_MSG_FORMATTER_NULL));
		}
		logger.ctdebug("CTALT00140", sMsgFormatter);
		logger.ctinfo("CTALT00141");
		return sMsgFormatter;
	}

	// private instance of MessageFormatterFactory Object
	private static MessageFormatterFactory messageFormatterFactory = new MessageFormatterFactory();

	private static PropertyReader prptReader = AlertConstants.ALERT_PROPERTIES;
	private static final Logger logger = Logger.getLogger(MessageFormatterFactory.class);

}