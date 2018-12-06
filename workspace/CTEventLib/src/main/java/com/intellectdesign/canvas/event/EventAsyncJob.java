/**
 * Copyright 2015. Intellect Design Arena Limited. All rights reserved. 
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
package com.intellectdesign.canvas.event;

import java.util.HashMap;

import com.intellectdesign.canvas.async.AsyncContext;
import com.intellectdesign.canvas.async.AsyncExecutorException;
import com.intellectdesign.canvas.async.AsyncJob;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.TransactionManager;
import com.intellectdesign.canvas.event.handler.EventHandler;
import com.intellectdesign.canvas.event.handler.EventHandlerFactory;
import com.intellectdesign.canvas.event.handler.HandlerException;
import com.intellectdesign.canvas.event.handler.IData;
import com.intellectdesign.canvas.logger.Logger;

/**
 * This is the Async job that is used by the event framework to fork off an event handler processing to an async mode if
 * the handler chooses to do so.
 * 
 * @Version 15.1
 */
public class EventAsyncJob extends AsyncJob
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = 3824881538530353409L;

	private transient static Logger LOGGER = Logger.getLogger(EventAsyncJob.class);

	private HashMap handlerDetails;
	private Event raisedEvent;
	private IData handlerData;

	/**
	 * The only constructor for this class
	 * 
	 * @param theContext The async context
	 */
	public EventAsyncJob(AsyncContext theContext)
	{
		super(theContext);
	}

	/**
	 * This method stores the handler details that will be use for creation of the handler.
	 * 
	 * @param details The handler information
	 */
	public void setHandlerDetails(HashMap details)
	{
		handlerDetails = details;
	}

	/**
	 * This method stores the event for which the handler needs to be executed.
	 * 
	 * @param anEvent The event
	 */
	public void setEvent(Event anEvent)
	{
		raisedEvent = anEvent;
	}

	/**
	 * This method stores the data massaged by the handler for the actual processing
	 * 
	 * @param dataPacket The data to be processed.
	 */
	public void setEventData(IData dataPacket)
	{
		handlerData = dataPacket;
	}

	/**
	 * This is the place where we need to execute the event.
	 * 
	 * @throws AsyncExecutorException Exception thrown if there are any errors faced while processing the event
	 * @see com.intellectdesign.canvas.async.AsyncJob#executeJob()
	 */
	@Override
	public void executeJob() throws AsyncExecutorException
	{
		TransactionManager tranBoundary = new TransactionManager();

		try
		{
			// Step 1: Recreate the handler.
			EventHandler handler = EventHandlerFactory.getInstance().createHandler(handlerDetails);
			// Step 2: Create the transaction boundary
			tranBoundary.begin();
			// Step 3: invoke the handler
			handler.handleEvent(raisedEvent, handlerData);
			// Step 4: commit the same
			tranBoundary.commit();
		} catch (HandlerException e)
		{
			LOGGER.cterror("CTEVT00038", handlerDetails, raisedEvent.getEventId(), e);
			throw new AsyncExecutorException("CTEVT00038", e);
		} catch (DatabaseException e)
		{
			LOGGER.cterror("CTEVT00039", handlerDetails, raisedEvent.getEventId(), e);
			throw new AsyncExecutorException("CTEVT00039", e);
		} finally
		{
			// In case not committed, rollback the transaction.
			tranBoundary.rollback();
		}
	}

}
