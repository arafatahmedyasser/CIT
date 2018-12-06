/*************************************************************************
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
package com.intellectdesign.canvas.event.cache;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.intellectdesign.canvas.cache.handler.CacheDataBuilder;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.event.EventHandlerFrameworkConstants;
import com.intellectdesign.canvas.event.handler.EventHandlerInstruction;
import com.intellectdesign.canvas.logger.Logger;

/**
 * Handler class for Event Handler Database cache which maintains all the available event handler details
 *  
 * @version 1.0
 */
public class EventFrameworkCacheDataBuilder extends CacheDataBuilder
{

	/**
	 * Initializes the cache with the List of Event Handler details available for all Events
	 * 
	 * @param params
	 * @return returnList
	 */
	protected List initializeCache(HashMap params)
	{
		List returnList = null;
		try
		{
			returnList = EventHandlerInstruction.retrieveAllEventHandlers();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTEVT00006");
			// Exception is caught and eaten up since this is only while refershing cache
		}
		if (returnList != null && returnList.size() > 0)
		{
			returnList = formatEventHandlerDetails(returnList);
		} else
			logger.ctdebug("CTEVT00007");
		return returnList;
	}

	/**
	 * Provide empty implementation since no validation is required returns null
	 * 
	 * @param params
	 * @return String null
	 */
	protected String validateParameters(HashMap params)
	{
		return null;
	}

	/**
	 * Formats the List of entire event Handlers so as to meet the requirement of the framework. Incoming list will be
	 * in the Format
	 * [{EVENT_ID='EVENT_ID1',HANDLER_LIST=[{'HANDLER_ID1',..},{'HANDLER_ID2',..}]},{EVENT_ID='EVENT_ID2',.....] This
	 * List is formatted such that the output is in format
	 * [{'EVENT_ID1'=[{'HANDLER_ID1',..},{'HANDLER_ID2',..}],'EVENT_ID2'=..}]as expected by the framework
	 * 
	 * @param inList Returns the list of formatted handlerId List
	 * @param listFormattedMap
	 * @param eventMap
	 * @param eventId
	 * @param handlerList
	 * @param inlistSize
	 * @return list
	 */
	private static List formatEventHandlerDetails(List inList)
	{
		HashMap listFormattedMap = null;
		logger.ctinfo("CTEVT00008");
		HashMap eventMap = null;
		String eventId = null;
		List handlerList = null;
		int inListSize = inList.size();
		listFormattedMap = new HashMap();

		for (int loopEvent = 0; loopEvent < inListSize; loopEvent++)
		{
			eventMap = (HashMap) inList.get(loopEvent);
			eventId = (String) eventMap.get(EventHandlerFrameworkConstants.EVENT_ID);
			handlerList = (List) eventMap.get(EventHandlerFrameworkConstants.HANDLER_LIST);
			listFormattedMap.put(eventId, handlerList);
		}
		inList = new ArrayList();
		inList.add(listFormattedMap);
		logger.ctdebug("CTEVT00009", inList);
		logger.ctinfo("CTEVT00010");
		return inList;
	}

	// instatiate logger object
	private static final Logger logger = Logger.getLogger(EventFrameworkCacheDataBuilder.class);
}
