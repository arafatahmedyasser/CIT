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
 */
package com.intellectdesign.canvas.event.helper;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.intellectdesign.canvas.cache.handler.CacheDataBuilder;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.event.instruction.EventMasterInstruction;
import com.intellectdesign.canvas.logger.Logger;

/***
 * This Class is responsible for loading the data for the Event into the server side Cache.

 *@version 1.0
 */
public class EventConfigCacheDataBuilder extends CacheDataBuilder
{

	@Override
	/**
	 * This method initializes the Cache 
	 * @param hashMap
	 * @return List
	 * 
	 */
	protected final List initializeCache(final HashMap hashMap)
	{
		List eventConfigList = new ArrayList();

		try
		{
			eventConfigList = getEventConfig();
		} catch (final DatabaseException e)
		{
			logger.cterror("CTEVT00024", e);
		}

		return eventConfigList;
	}

	@Override
	/***
	 * This method validates the Parameters
	 * @param hashMap
	 * @return String 
	 * 
	 */
	protected final String validateParameters(final HashMap params)
	{
		return null;
	}

	@Override
	/***
	 * This method checks whether the CacheUptoDate
	 * @return boolean 
	 * 
	 */
	protected final boolean isCacheUptoDate()
	{
		return false;
	}

	/***
	 * This method fetches the event details from the EventMasterInstruction class and loads into the Cache.
	 * 
	 * @return List
	 * @throws DatabaseException DatabaseException
	 */
	protected final List getEventConfig() throws DatabaseException
	{

		List eventConfigList = null;
		final EventMasterInstruction eventMasterInstr = new EventMasterInstruction();
		try
		{
			eventConfigList = eventMasterInstr.getEventDetails();
		} catch (final DatabaseException e)
		{
			logger.cterror("CTEVT00026", e);
		}

		return eventConfigList;
	}

	// creating the logger object.
	private static final Logger logger = Logger.getLogger(EventConfigCacheDataBuilder.class);
}
