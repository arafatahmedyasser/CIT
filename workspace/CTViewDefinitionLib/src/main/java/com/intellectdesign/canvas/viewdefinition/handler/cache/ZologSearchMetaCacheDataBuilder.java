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

package com.intellectdesign.canvas.viewdefinition.handler.cache;

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
 * This class is for zolog search meta cache builder extends cache handler.
 * 
 * @version 1.0
 */
public class ZologSearchMetaCacheDataBuilder extends CacheDataBuilder
{
	/**
	 * this is ref to InitCache ZologSearchMeta Handler
	 * 
	 * @param hashMap
	 * @return zologSearchdataList
	 * @see com.intellectdesign.canvas.cache.handler.CacheDataBuilder#initializeCache(java.util.HashMap)
	 */
	@Override
	protected final List initializeCache(final HashMap hashMap)
	{

		List zologSearchdataList = null;
		try
		{
			zologSearchdataList = getZologMetadata();
		} catch (DatabaseException e)
		{
			logger.cterror("CTVDF00794", e);
		}

		return zologSearchdataList;
	}

	/**
	 * this is ref to ValidParams Hashmap
	 * 
	 * @param params
	 * @return
	 * @see com.intellectdesign.canvas.cache.handler.CacheDataBuilder#validateParameters(java.util.HashMap)
	 */
	@Override
	protected final String validateParameters(final HashMap params)
	{

		return null;
	}

	/**
	 * this is ref to ZologMetadata DB
	 * 
	 * @return itemlist
	 * @throws DatabaseException
	 */
	private List getZologMetadata() throws DatabaseException
	{

		logger.ctinfo("CTVDF00795");

		List itemList = null;
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		try
		{
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setDataAccessMapKey(ZologSearchConstants.ZOLOG_SEARCH_MAP);
			dbRequest.setOperationExtension(ZologSearchConstants.ITEMS);
			dbResult = dbRequest.execute();
			itemList = dbResult.getReturnedList();

		} catch (DatabaseException e)
		{
			logger.cterror("CTVDF00796");
			throw new DatabaseException(e);

		}
		logger.ctinfo("CTVDF00797");
		return itemList;
	}

	private Logger logger = Logger.getLogger(ZologSearchMetaCacheDataBuilder.class);

}
