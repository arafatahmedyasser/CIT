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
package com.intellectdesign.canvas.eventmanager.cache;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.intellectdesign.canvas.cache.handler.CacheDataBuilder;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.event.instruction.EventMasterInstruction;
import com.intellectdesign.canvas.logger.Logger;

/***
 * This Class is responsible for loading the data for the Event into the server side Cache.
 * 
 */
public class EventManagerConfigCacheDataBuilder extends CacheDataBuilder
{

	@Override
	protected final List initializeCache(final HashMap hashMap)
	{

		List eventConfigList = new ArrayList();

		try
		{
			eventConfigList = getEventConfig();
		} catch (final DatabaseException e)
		{
			// TODO Auto-generated catch block
			logger.cterror("CTEVT00038");
		}

		return eventConfigList;
	}

	@Override
	protected final String validateParameters(final HashMap params)
	{
		// TODO Auto-generated method stub
		return null;
	}

	@Override
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
			logger.cterror("CTEVT00039");
		}

		return eventConfigList;
	}

	private Logger logger = Logger.getLogger(EventManagerConfigCacheDataBuilder.class);

}
