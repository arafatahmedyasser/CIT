/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.*/
package com.intellectdesign.canvas.event.helper;

import java.util.HashMap;
import java.util.List;

import com.intellectdesign.canvas.cache.handler.CacheManager;
import com.intellectdesign.canvas.event.Event;
import com.intellectdesign.canvas.logger.Logger;

/**
 * This Class returns the preprocessor configs of event available in cache along with its data from Event class.
 * 
 * @version 1.0
 */
public class EventConfigHelper
{
	/***
	 * This method fetches the event details from the Event class and preprocessor configs for the events from the cache
	 * and returns it.
	 * 
	 * @param eventId Event ID
	 * @return HashMap returnMap: Event Details map
	 */

	public final HashMap<String, Object> getEventDetails(final String eventId)
	{
		HashMap<String, Object> returnMap = new HashMap<String, Object>();
		Long eventIdin;
		CacheManager cacheManager = CacheManager.getFWInstance();
		Event eventsMap = null;

		logger.ctdebug("CTEVT00027", eventId);

		HashMap<String, String> preprocessorMap = new HashMap<String, String>();

		try
		{
			if (eventId != null && !eventId.equals(""))
			{
				eventIdin = Long.parseLong(eventId);
				// Event for a particular Event ID from static method
				eventsMap = Event.getEventFor(eventIdin);

				returnMap.put("EVENT_ID", eventId);
				returnMap.put("PRODUCT_CODE", eventsMap.getProduct());
				returnMap.put("SUBPRODUCT_CODE", eventsMap.getSubProduct());
				returnMap.put("FUNCTION_CODE", eventsMap.getFunctionCode());
				returnMap.put("ACTION_CODE", eventsMap.getAction());
				returnMap.put("EVENT_TYPE", eventsMap.getEventType());
				returnMap.put("EVENT_DESC", eventsMap.getEventDescription());
				returnMap.put("EVENT_NAME", eventsMap.getEventName());
				returnMap.put("PAGE_CODE", eventsMap.getPageCode());
				returnMap.put("HOST_CODE", eventsMap.getHostCode());
				returnMap.put("EVENT_PRODUCT_KEY", eventsMap.getProduct() + "_" + eventsMap.getSubProduct() + "_"
						+ eventsMap.getFunctionCode() + "_" + eventsMap.getAction());

				// List of Event Preprocessors from the Cache
				List eventConfigList = cacheManager.getDataFromCache(null, "EVENT_MANAGER_CACHE");
				for (int i = 0; i < eventConfigList.size(); i++)
				{
					HashMap iterMap = (HashMap) eventConfigList.get(i);
					if (iterMap.get("EVENT_ID").equals(eventId))
					{
						preprocessorMap.put((String) iterMap.get("PREPROCESSOR_KEY"),
								(String) iterMap.get("PREPROCESSOR_VALUE"));
					}
				}
				returnMap.put("EVENT_PREPROCESSORS", preprocessorMap);
			}
		} catch (Exception e)
		{
			logger.cterror("CTEVT00028", e, eventId);
		}
		logger.ctdebug("CTEVT00029", eventsMap);
		return returnMap;
	}

	/**
	 * this method returns HashMap that contains the Event ID based on the following params
	 * 
	 * @param prodCode
	 * @param subProdCode
	 * @param funcCode
	 * @param actionCode
	 * @return returnMap: Event Details Map
	 */

	public final HashMap<String, Object> getEventByProd(String prodCode, String subProdCode, String funcCode,
			String actionCode)
	{

		HashMap<String, Object> returnMap = null;
		Event eventObj = Event.getEventFor(prodCode, subProdCode, funcCode, actionCode);
		if (eventObj != null)
		{

			logger.ctdebug("CTEVT00030", prodCode, subProdCode, funcCode, actionCode);
			Long eventId = eventObj.getEventId();
			if (eventId != null && eventId != -1)
			{
				String eventIdStr = String.valueOf(eventId);
				returnMap = getEventDetails(eventIdStr);
			}
		}

		return returnMap;
	}

	/**
	 * An instance of Logger
	 */
	private static final Logger logger = Logger.getLogger(EventConfigHelper.class);
}
