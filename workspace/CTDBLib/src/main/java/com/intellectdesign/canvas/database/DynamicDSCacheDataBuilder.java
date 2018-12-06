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
package com.intellectdesign.canvas.database;

import java.util.HashMap;
import java.util.List;

import com.intellectdesign.canvas.database.GenericDatabaseCacheDataBuilder;

/**
 * This is the cache data builder that is incharge of maintaining the dynamic data sources that are supported.
 */
public class DynamicDSCacheDataBuilder extends GenericDatabaseCacheDataBuilder
{
	/**
	 * The default constructor
	 */
	public DynamicDSCacheDataBuilder()
	{
		// Nothing to do here
	}

	/**
	 * @param hashMap
	 * @return
	 * @see com.intellectdesign.canvas.cache.handler.CacheDataBuilder#initializeCache(java.util.HashMap)
	 */
	@Override
	protected List initializeCache(HashMap hashMap)
	{
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * @param params
	 * @return
	 * @see com.intellectdesign.canvas.cache.handler.CacheDataBuilder#validateParameters(java.util.HashMap)
	 */
	@Override
	protected String validateParameters(HashMap params)
	{
		setDataAccessMapKey("");
		return null;
	}

}
