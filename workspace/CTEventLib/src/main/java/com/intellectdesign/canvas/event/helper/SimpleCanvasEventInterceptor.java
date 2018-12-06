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
package com.intellectdesign.canvas.event.helper;

import java.util.HashMap;
import java.util.Map;

import com.intellectdesign.canvas.event.Event;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.logger.Logger;

/**
 * This is a sample and default event-interceptor class. It will bundle the neccessary properties for the given event id.
 * The implentation developer needs to provide the custom Event Interceptor class to process event details along with preprocessor configs. Otherwise this class will be called
 * with default and give the neecessary event properties without preprocessor config. 
 * 
 * @version 1.0
 */
public class SimpleCanvasEventInterceptor implements ICanvasEventInterceptor
{

	/**
	 * This method will be triggered in FormContainer metadata caching flow.
	 * The implentation developer needs to overwrite this method and provide the below given event details along with preprocessor configs.	
	 * @param eventId - Event id 
	 * @return
	 * @throws ProcessingErrorException
	 * @see com.intellectdesign.canvas.event.helper.ICanvasEventConfigHelper#getEventDetails(java.lang.String)
	 */
	public HashMap<String, Object> getEventDetails(String eventId, Map requestMap) throws ProcessingErrorException {
		HashMap<String, Object> returnMap = new HashMap<String, Object>();
		
		Event eventsMap = null;
		Long eventIdin;
		if (eventId != null && !eventId.equals(""))
		{
			eventIdin = Long.parseLong(eventId);
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
		}
		return returnMap;
	}

	private static Logger LOGGER = Logger.getLogger(SimpleCanvasEventInterceptor.class);

}
