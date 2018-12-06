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

package com.intellectdesign.canvas.alert.handler;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.intellectdesign.canvas.cache.handler.CacheDataBuilder;
import com.intellectdesign.canvas.database.CanvasDatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseResult;
import com.intellectdesign.canvas.logger.Logger;

/**
 * This is the cache handler for loading the details of the various alerts configured The details includes the cache key
 * as well as the alert data keys against each alert.
 * 
 * @version 1.0
 */
public class AlertDetailsCacheDataBuilder extends CacheDataBuilder
{
	/**
	 * This method is called when the cache is getting initialized. Here we fetch the entire data of the alerts and
	 * store it in the cache.
	 * 
	 * @see com.intellectdesign.canvas.cache.handler.CacheDataBuilder#initializeCache(javax.servlet.http.HttpSession)
	 * 
	 * @param params
	 * @return returnlist
	 */
	protected List initializeCache(HashMap params)
	{
		LOGGER.ctinfo("CTALT00001");
		List returnList = new ArrayList();
		try
		{
			returnList = retrieveAllAlertDetails();
		} catch (DatabaseException dbEx)
		{
			LOGGER.cterror("CTALT00002", dbEx);
			// Exception is caught and eaten up since this is only while refreshing cache
		}
		// If the query above returned no data, then set the list to an empty list.
		if (returnList == null)
		{
			returnList = new ArrayList();
			LOGGER.cterror("CTALT00013");
		}

		LOGGER.ctinfo("CTALT00004");
		return returnList;
	}

	/**
	 * This method retrieves all the alert details from the alert master
	 * 
	 * @return The list of all alerts as configured in the alert master in database.
	 * @exception DatabaseException
	 */
	private List retrieveAllAlertDetails() throws DatabaseException
	{
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		List returnList = null;

		LOGGER.ctinfo("CTALT00014");
		try
		{
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setOperationExtension(AlertConstants.ALERT_EXT_GET_ALL_ALERT_DETAILS);
			dbResult = dbRequest.execute();
			returnList = dbResult.getReturnedList();
		} catch (DatabaseException dbEx)
		{
			LOGGER.cterror("CTALT00010", dbEx);
			throw dbEx;
		}
		LOGGER.ctdebug("CTALT00011", returnList);
		LOGGER.ctinfo("CTALT00015");
		return returnList;
	}

	/**
	 * This method is ignored as there are no dynamic parameters expected by this Cache Handler
	 * 
	 * @see com.intellectdesign.canvas.cache.handler.CacheDataBuilder#validateParameters(java.util.HashMap)
	 * 
	 * @param params
	 * @return null
	 */
	protected String validateParameters(HashMap params)
	{
		return null;
	}

	private static Logger LOGGER = Logger.getLogger(AlertDetailsCacheDataBuilder.class);

}
