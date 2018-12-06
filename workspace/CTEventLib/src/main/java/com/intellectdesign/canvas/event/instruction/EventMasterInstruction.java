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

package com.intellectdesign.canvas.event.instruction;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.intellectdesign.canvas.database.CanvasDatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseResult;
import com.intellectdesign.canvas.event.EventHandlerFrameworkConstants;
import com.intellectdesign.canvas.logger.Logger;

/**creating the EventMasterInstruction class used to get the events from EVENT_MASTER table.
 * 
 * @version 1.0
 */
public class EventMasterInstruction
{
	/**
	 * This getAllEventLists() method used to get the event list value from. EVENT_MASTER table.
	 * 
	 * @throws DatabaseException for fetching event list
	 * @return ArrayList of Events
	 */
	public final ArrayList<HashMap<String, String>> getAllEventList() throws DatabaseException
	{
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		List<HashMap<String, String>> returnEventList = null;
		logger.ctinfo("CTEVT00031");

		try
		{
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey(EventHandlerFrameworkConstants.EVENT_LIST_DAM_KEY);
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setOperationExtension(EventHandlerFrameworkConstants.EVENT_EXT_GET_ALL_EVENT_LIST);
			dbResult = dbRequest.execute();
			returnEventList = dbResult.getReturnedList(); 
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTEVT00032", dbEx);
			throw dbEx;
		}
		logger.ctinfo("CTEVT00033");
		// Return the event ArrayList values
		return (ArrayList<HashMap<String, String>>) returnEventList;
	}

	/***
	 * This method fetches the event details from the database.
	 * 
	 * @return List
	 * @throws DatabaseException DatabaseException
	 */
	public final List getEventDetails() throws DatabaseException
	{

		String cname = "getEventDetails";
		logger.ctinfo("CTEVT00034", cname);

		List eventsList = null;
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		try
		{
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setDataAccessMapKey("EVENT_MANAGER");
			dbRequest.setOperationExtension("EVENT_CONFIG_CACHE");
			dbResult = dbRequest.execute();
			eventsList = dbResult.getReturnedList();

			logger.ctdebug("CTEVT00035", eventsList);

		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTEVT00036", dbExp);
			throw new DatabaseException(dbExp);

		}
		logger.ctinfo("CTEVT00037", cname);
		return eventsList;

	}

	// instantiating logger object

	private static final Logger logger = Logger.getLogger(EventMasterInstruction.class);
}
