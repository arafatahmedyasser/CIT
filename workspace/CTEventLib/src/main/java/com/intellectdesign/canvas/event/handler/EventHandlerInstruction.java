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

import java.util.List;

import com.intellectdesign.canvas.database.CanvasDatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseResult;
import com.intellectdesign.canvas.event.EventHandlerFrameworkConstants;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.logging.PerformanceTimer;

/**
 * Instruction class for EventHandlerFramework to interact with the Database Access Layer
 * 
 * @version 1.0
 */
public class EventHandlerInstruction
{
	/**
	 * Retrieves the set of handlers and handler properties for the particular event id
	 * 
	 * @param eventId Long eventId for which the handler and the handler properties has to be retrieved
	 * @return Returns the list of event handlers for
	 * @throws DatabaseException
	 */
	public static List retrieveEventHandlers(Long eventId) throws DatabaseException
	{
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		List resultList = null;

		logger.ctinfo("CTEVT00018");
		// The timer so as to scale the time of execution for fetching event handlers for an event
		perfomanceTimer.startTimer("EventHandlerInstruction.retrieveEventHandlers");
		try
		{
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey(EventHandlerFrameworkConstants.EVENT_HANDLER_DAM_KEY);
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setOperationExtension(EventHandlerFrameworkConstants.EVENT_EXT_GET_HANDLER_DTLS);
			dbRequest.addFilter(EventHandlerFrameworkConstants.EVENT_ID, eventId);
			dbResult = dbRequest.execute();
			resultList = dbResult.getReturnedList();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTEVT00019", dbEx, eventId);
			throw dbEx;
		}
		// End the timer
		perfomanceTimer.endTimer();
		logger.ctinfo("CTEVT00020");
		return resultList;
	}

	/**
	 * Retrieves the entire set of handlers present in the Handler master table for all Events in format
	 * [{EVENT_ID='EVENT_ID1',HANDLER_LIST=[{'HANDLER_ID1',..},{'HANDLER_ID2',..}]},{EVENT_ID='EVENT_ID2',.....]
	 * 
	 * @return Returns the list of Handlers for all the Events
	 */
	public static List retrieveAllEventHandlers() throws DatabaseException
	{
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		List returnList = null;

		logger.ctinfo("CTEVT00021");
		//  the timer so as to scale the time of execution for fetching all event handlers
		perfomanceTimer.startTimer("retrieveAllEventHandlers");
		try
		{
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey(EventHandlerFrameworkConstants.EVENT_HANDLER_DAM_KEY);
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setOperationExtension(EventHandlerFrameworkConstants.EVENT_EXT_GET_ALL_HANDLER_DTLS);
			dbResult = dbRequest.execute();
			returnList = dbResult.getReturnedList();

		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTEVT00022", dbEx);
			throw dbEx;
		}
		perfomanceTimer.endTimer();
		logger.ctinfo("CTEVT00023");
		return returnList;
	}

	// initializing the logger object.
	private static final Logger logger = Logger.getLogger(EventHandlerInstruction.class);

	// creating object of PerformanceTimer
	private static PerformanceTimer perfomanceTimer = new PerformanceTimer();
}
