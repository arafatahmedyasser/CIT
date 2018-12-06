/******************************************************************************
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 ******************************************************************************/

package com.intellectdesign.canvas.event.handler;

import java.util.HashMap;
import java.util.Map;

import com.intellectdesign.canvas.async.AsyncContext;
import com.intellectdesign.canvas.async.AsyncDispatcher;
import com.intellectdesign.canvas.async.AsyncExecutorException;
import com.intellectdesign.canvas.event.Event;
import com.intellectdesign.canvas.event.EventAsyncJob;
import com.intellectdesign.canvas.utils.StringUtils;

/**
 * This is an abstract class for Event Handler
 * 
 * @version 1.0
 */
public abstract class EventHandler
{
	/**
	 * A handler has the following an Id a name a class name a synchronization flag a priority flag an ignore exception
	 * flag
	 */
	private String sHandlerDesc = null;
	protected boolean mIsSynchronized = false;
	protected boolean ignoreExceptions = true;
	protected boolean requireOldValues = false;
	protected int handlerId = -1;
	private int nPriority = -1;
	private HashMap handlerConfig;

	/**
	 * This variable has been introduced only to facilitate caching. Primarily is used only by the handler factory.
	 */
	private String sHandlerClassName = null;

	/**
	 * Constructor for Event Handler class
	 * 
	 * @param sHandlerDesc
	 * @param isSynchronized
	 * @param ignoreExceptions
	 * @param nPriority
	 */
	public EventHandler(String sHandlerDesc, boolean isSynchronized, boolean ignoreExceptions, int nPriority)
	{
		this.sHandlerDesc = sHandlerDesc;
		this.mIsSynchronized = isSynchronized;
		this.ignoreExceptions = ignoreExceptions;
		this.nPriority = nPriority;
	}

	/**
	 * Constructor for Event Handler class
	 * 
	 */
	public EventHandler()
	{
		// Setting up default configurations.
		this.mIsSynchronized = false;
		this.ignoreExceptions = true;
		this.nPriority = 100; // try to keep it more close to the lowest priority.
	}

	/**
	 * this is the entry point for the various handlers. The sub classes need to implement few abstract methods to
	 * provide the necessary behavior that they target through the handler.
	 * 
	 * @param event the Event that has to be handled
	 * @param eventData The data supplied by the caller for this event
	 * @exception HandlerException Thrown if there are any errors while handling this event
	 */
	public final void handleEvent(Event event, Map mapData) throws HandlerException
	{
		// first allow the sub classes to prepare the data for the event processing. This always happens irrespective
		// of whether the handler has to handle immediately or at a later point in time.
		IData eventData = formatEventData(event, mapData);
		if (isSynchronized())
		{
			handleSynchEvent(event, eventData);
		} else
		{
			handleASynchEvent(event, eventData);
		}
	}

	/**
	 * This method is invoked as part of the async event handling routine
	 * 
	 * @param event
	 * @param eventData
	 * @throws HandlerException
	 */
	public final void handleEvent(Event event, IData eventData) throws HandlerException
	{
		handleSynchEvent(event, eventData);
	}

	/**
	 * This method will be called from handleEvent for the handler to prepare the data that can be actually processed
	 * for that event. This gives the chance for the handler to define their own custom Data structure and convert the
	 * data in the HashMap to the format that they wish to use it.
	 * 
	 * @param event the Event that has to be handled
	 * @param eventData The formatted data for this event
	 * @exception HandlerException Thrown if there are any errors while handling this event
	 */
	protected abstract IData formatEventData(Event event, Map mapData) throws HandlerException;

	/**
	 * This method will be called from handleEvent when the handler has been configured to execute in a synchronous
	 * manner.
	 * 
	 * @param event the Event that has to be handled
	 * @param eventData The formatted data for this event
	 * @exception HandlerException Thrown if there are any errors while handling this event
	 */
	protected abstract void handleSynchEvent(Event event, IData eventData) throws HandlerException;

	/**
	 * This method will be called from handleEvent when the handler has been configured to execute in a asynchronous
	 * manner.
	 * 
	 * @param event the Event that has to be handled
	 * @param eventData The formatted data for this event
	 * @exception HandlerException Thrown if there are any errors while handling this event
	 */
	protected void handleASynchEvent(Event event, IData eventData) throws HandlerException
	{
		EventAsyncJob job = new EventAsyncJob(new AsyncContext());
		String asyncKey = StringUtils.ensureExists(getAsyncConfigKey(), "EVENT_ASYNC");
		job.setEvent(event);
		job.setEventData(eventData);
		job.setHandlerDetails(handlerConfig);

		try
		{
			AsyncDispatcher.dispatch(asyncKey, job);
		} catch (AsyncExecutorException e)
		{
			throw new HandlerException(e.getErrorCode(), e);
		}
	}

	/**
	 * This method should return the async setup to which the job should be dispatched. If none available, then the
	 * default of "EVENT_ASYNC" will be used.
	 * 
	 * @return The async setup key.
	 */
	protected String getAsyncConfigKey()
	{
		return "EVENT_ASYNC";
	}

	/**
	 * Method to get ignoreExceptions
	 * 
	 * @return the ignoreExceptions
	 */
	public boolean isIgnoreExceptions()
	{
		return ignoreExceptions;
	}

	/**
	 * Method to set ignoreExceptions
	 * 
	 * @param ignoreExceptions the ignoreExceptions to set
	 */
	public void setIgnoreExceptions(boolean ignoreExceptions)
	{
		this.ignoreExceptions = ignoreExceptions;
	}

	/**
	 * Presently this method always returns false to support only Synchronous persistance
	 * 
	 * @return the isSynchronized
	 */
	public boolean isSynchronized()
	{
		return mIsSynchronized;
	}

	/**
	 * Presently this method always returns false to support only Synchronous persistance Method to set Synchronized
	 * 
	 * @param isSynchronized the isSynchronized to set
	 */
	public void setSynchronized(boolean isSynchronized)
	{
		mIsSynchronized = isSynchronized;
	}

	/**
	 * Returns Priority
	 * 
	 * @return the nPriority as integer
	 */
	public int getPriority()
	{
		return nPriority;
	}

	/**
	 * Sets Priority
	 * 
	 * @param nPriority as integer
	 */
	public void setPriority(int nPriority)
	{
		this.nPriority = nPriority;
	}

	/**
	 * Returns Handler Description
	 * 
	 * @return sHandlerDesc as String
	 */
	public String getHandlerDesc()
	{
		return sHandlerDesc;
	}

	/**
	 * Sets Handler Description
	 * 
	 * @param sHandlerDesc as String
	 */
	public void setHandlerDesc(String sHandlerDesc)
	{
		this.sHandlerDesc = sHandlerDesc;
	}

	/**
	 * Returns Handler class name
	 * 
	 * @return sHandlerClassName as String
	 */
	public String getHandlerClassName()
	{
		return sHandlerClassName;
	}

	/**
	 * Sets Handler class name
	 * 
	 * @param sHandlerClassName as String
	 */
	public void setHandlerClassName(String sHandlerClassName)
	{
		this.sHandlerClassName = sHandlerClassName;
	}

	/**
	 * Flag indicating if the handler requires old values also.
	 * 
	 * @param flag Flag indicating if the handler requires old values also.
	 */
	public void setRequireOldValues(boolean flag)
	{
		requireOldValues = flag;
	}

	/**
	 * Return Flag indicating if the handler requires old values also.
	 * 
	 * @returns booelan
	 */
	public boolean doesRequireOldValues()
	{
		return requireOldValues;
	}

	/**
	 * Returns handlerId
	 * 
	 * @return the handlerId as integer
	 */
	public int getHandlerId()
	{
		return handlerId;
	}

	/**
	 * Sets handlerId
	 * 
	 * @param idVal as integer
	 */
	public void setHandlerId(int idVal)
	{
		this.handlerId = idVal;
	}

	/**
	 * Sets handlerConfig
	 * 
	 * @param handlerDetails the full details of the handler
	 */
	public void setHandlerConfig(HashMap handlerDetails)
	{
		this.handlerConfig = handlerDetails;
	}
}