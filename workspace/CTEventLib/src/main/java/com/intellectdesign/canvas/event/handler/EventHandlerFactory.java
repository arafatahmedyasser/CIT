/*************************************************************************
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
 *************************************************************************/
package com.intellectdesign.canvas.event.handler;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.cache.handler.CacheManager;
import com.intellectdesign.canvas.event.EventHandlerFrameworkConstants;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.properties.reader.PropertyReader;
import com.intellectdesign.canvas.proxycaller.ProxyCaller;
import com.intellectdesign.canvas.proxycaller.ProxyCallerException;
import com.intellectdesign.canvas.utils.StringUtils;

/**
 * 
 * This is a singleton class Presently is read from DB cache (list of a map) 1 instance of all known event handlers.
 
 *@version 1.0
 */

public class EventHandlerFactory
{
	/**
	 * Ensures the outside world cannot instantiate this class.
	 */
	private EventHandlerFactory()
	{
	}

	/**
	 * Factory class for EventHandlerFactory
	 * 
	 * @return An instance of the EventHandlerFactory
	 */
	public static EventHandlerFactory getInstance()
	{
		return eventHandlerFactory;
	}

	/**
	 * Picks the event handler class from a DB cache and returns it. If not present in cache makes a database hit to get
	 * the list of handlers and populates in cache and returns
	 * 
	 * @param lEventId Long lEventId for which the list of handlers needs to queried
	 * @return Returns the Iterator for the List of <code>EventHandler</code> objects .If no handlers the method throws
	 *         handler exception since it will critical.
	 */
	public Iterator getEventHandlers(Long lEventId) throws HandlerException
	{
		// This is the list of handlers to be used as return parameter
		List listHandlers = null;
		List listEventHandlerObjs = null;
		EventHandler eventHandler = null;
		int listHandlerSize = 0;
		HashMap handlerDetails = null;
		Map handlerDetailsMap = null;

		logger.ctinfo("CTEVT00016", lEventId);

		/*
		 * Gets the entire list of handlers for all event present in the cache. The Database cache component is used.
		 * What is cached: A map with key as the event id and the value as a list of EventHandler instances Each event
		 * handler instance should be instantiated with the handler description, class name, igore exp flag, synch flag
		 * and the priority If yes then fetch the details of the event handler from the cache and skip fetching from the
		 * DB. Else proceed to fetch list of handlers from DB. The first parameter expected in getDataFromCache is
		 * session object. Since the cache used is a DB cache and not a session cache the value is passed as null
		 */

		listHandlers = CacheManager.getFWInstance().getDataFromCache(null, EventHandlerFrameworkConstants.EVENTS);

		logger.ctdebug("CTEVT00017", listHandlers);
		if (listHandlers != null && listHandlers.size() > 0)
		{
			handlerDetailsMap = (Map) listHandlers.get(0);

			listEventHandlerObjs = new ArrayList();

			Iterator entries = handlerDetailsMap.entrySet().iterator();

			while (entries.hasNext())
			{

				Map.Entry entry = (Map.Entry) entries.next();
				listHandlers = (List) entry.getValue();

				if (listHandlers != null && (String.valueOf(lEventId)).equals(entry.getKey()))
				{

					listHandlerSize = listHandlers.size();
					/*
					 * Will need to do this whether or not the list of handlers was from the cache or from the DB. To
					 * loop through all the event handlers mapped to the event.
					 */
					for (int loop = 0; loop < listHandlerSize; loop++)
					{
						handlerDetails = (HashMap) listHandlers.get(loop);
						eventHandler = createHandler(handlerDetails);
						listEventHandlerObjs.add(eventHandler);
					}
				}
			}
		}
		/*
		 * So let the dispatcher know that it should do nothing by sending it null. listHandlers was instantiated in the
		 * begining itself thus it cannot be null. throws a Handler Exception if the list of handlers is null
		 */
		else
		{
			logger.ctdebug("CTEVT00012");
			throw new HandlerException(EventHandlerFrameworkConstants.ERR_EVENT_HANDLERS_NULL,
					prptReader.retrieveProperty(EventHandlerFrameworkConstants.ERR_EVENT_HANDLERS_NULL));
		}

		/*
		 * This is where we ensure that the handler with the highest priority is executed 1st.
		 */
		Collections.sort(listEventHandlerObjs, new HandlerComparator());
		logger.ctinfo("CTEVT00011");
		return listEventHandlerObjs.iterator();
	}

	/**
	 * This method creates a new handler based on the handler details provided. This method is not expected to be
	 * invoked directly by end applications. This is used internally within the framework.
	 * 
	 * @param handlerDetails The handler details
	 * @return The handler created with the details provided.
	 * @exception HandlerException Thrown if there is an error while creating the handler
	 */
	public EventHandler createHandler(HashMap handlerDetails) throws HandlerException
	{
		EventHandler handler = null;
		int handlerId = Integer.valueOf((String) handlerDetails.get(EventHandlerFrameworkConstants.HANDLER_ID)).intValue();
		String className = (String) handlerDetails.get(EventHandlerFrameworkConstants.HANDLER_CLASS);
		String handlerDesc = (String) handlerDetails.get(EventHandlerFrameworkConstants.HANDLER_DESC);
		boolean isSynchronized = StringUtils.convertToBoolean((String) handlerDetails
				.get(EventHandlerFrameworkConstants.SYNCHRONIZED));
		boolean ignoreExceptions = StringUtils.convertToBoolean((String) handlerDetails
				.get(EventHandlerFrameworkConstants.IGNORE_EXCEPTIONS));
		boolean oldValuesReqd = StringUtils.convertToBoolean((String) handlerDetails
				.get(EventHandlerFrameworkConstants.OLD_VALUES_REQUIRED));
		int priority = Integer.valueOf((String) handlerDetails.get(EventHandlerFrameworkConstants.PRIORITY)).intValue();
		try
		{
			handler = ProxyCaller.on(className).create().get();
		} catch (ProxyCallerException e)
		{
			logger.cterror("CTEVT00014", className);
			throw new HandlerException(EventHandlerFrameworkConstants.ERR_EVENT_INST_EX,
					prptReader.retrieveProperty(EventHandlerFrameworkConstants.ERR_EVENT_INST_EX));
		} catch (ClassCastException cce)
		{
			logger.cterror("CTEVT00015", className);
			throw new HandlerException(EventHandlerFrameworkConstants.ERR_EVENT_CLASS_EX,
					prptReader.retrieveProperty(EventHandlerFrameworkConstants.ERR_EVENT_CLASS_EX));
		}
		handler.setHandlerId(handlerId);
		handler.setHandlerDesc(handlerDesc);
		handler.setSynchronized(isSynchronized);
		handler.setIgnoreExceptions(ignoreExceptions);
		handler.setPriority(priority);
		handler.setRequireOldValues(oldValuesReqd);
		handler.setHandlerConfig(handlerDetails);
		
		return handler;
	}

	// private instance of EventHandlerFactory Object
	private static EventHandlerFactory eventHandlerFactory = new EventHandlerFactory();

	/**
	 * Quick cache of event handlers might be a shortcut
	 */
	private static final Logger logger = Logger.getLogger(EventHandlerFactory.class);
	private static PropertyReader prptReader = new PropertyReader("CTevent_properties");//Renaming Property File

}