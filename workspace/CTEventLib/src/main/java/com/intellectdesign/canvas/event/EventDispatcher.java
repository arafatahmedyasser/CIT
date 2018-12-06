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
package com.intellectdesign.canvas.event;

import java.util.Iterator;
import java.util.Map;

import com.intellectdesign.canvas.event.handler.EventHandler;
import com.intellectdesign.canvas.event.handler.EventHandlerFactory;
import com.intellectdesign.canvas.event.handler.HandlerException;
import com.intellectdesign.canvas.logger.Logger;

/**
 * This class is responsible for posting the event information and the associated data to the event handlers configured
 * in the event_handler_map table.
 *  
 * @version 1.0
 */
public class EventDispatcher
{
	/**
	 * Empty private constructor for EventDispatcher , to prevent direct access from outside
	 * 
	 */
	private EventDispatcher()
	{

	}

	/**
	 * Factory method for EventDispatcher object
	 * 
	 * @return Returns an instance of EventDispatcher
	 */
	public static EventDispatcher getInstance()
	{
		return eventDispatcher;
	}

	/**
	 * Raises event and there by the related handlers for the requested event
	 * 
	 * @param Event event: identifies the requested event
	 * @param mapData: Event data
	 * @throws HandlerException Based on the Event Handlers passed dispatches event data to the appropriate handler. If
	 *             no handlers are associated with an event, nothing happens. Uses the Event handler factory to retrieve
	 *             an instance of a handler
	 * 
	 */
	public void raiseEvent(Event event, Map mapData) throws HandlerException
	{
		LOGGER.ctinfo("CTEVT00002", event.getEventId(), event.getEventDescription());
		EventHandlerFactory eventHandlerFactory = EventHandlerFactory.getInstance();
		Iterator itEventHandlers = eventHandlerFactory.getEventHandlers(new Long(event.getEventId()));
		if (itEventHandlers != null)
			for (; itEventHandlers.hasNext();)
				dispatchEvent(event, (EventHandler) itEventHandlers.next(), mapData);
		LOGGER.ctinfo("CTEVT00003");
	}

	/**
	 * Delegates the tasks for individual Event to specific event handler. <code>handleEvent</code>method of
	 * EventHandler object is invoked for handling the event, provided with the input data needed
	 * 
	 * @param event The event to be raised
	 * @param eventHandler the handler for this event
	 * @param mapData data for the event
	 * @throws HandlerException Thrown if there are any errors while the handler tries to handle the event.
	 */
	private void dispatchEvent(Event event, EventHandler eventHandler, Map mapData) throws HandlerException
	{
		LOGGER.ctinfo("CTEVT00004", event.getEventId(), event.getEventDescription());

		try
		{
			eventHandler.handleEvent(event, mapData);
		} catch (HandlerException handlerException)
		{
			/*
			 * Exceptions from individual handlers to be thrown back to the application only if desired i.e. configured
			 * in the Handler_Master table
			 */
			if (!eventHandler.isIgnoreExceptions())
				throw handlerException;
		}
		LOGGER.ctinfo("CTEVT00005");
	}

	/**
	 * An instance of LOGGER
	 */
	private static final Logger LOGGER = Logger.getLogger(EventDispatcher.class);
	/**
	 * This is a singleton class.
	 */
	private static EventDispatcher eventDispatcher = new EventDispatcher();
}
