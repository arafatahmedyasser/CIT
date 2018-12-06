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

import static com.intellectdesign.canvas.proxycaller.ProxyCaller.on;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.intellectdesign.canvas.cache.handler.CacheDataBuilder;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.logger.Logger;

/**
 * Cache handler for loading the currency decimal places information from the table into the cache. This will be an
 * application cache.
 * 
 * @version 1.0
 */
public class GlobalCurrencyCacheDataBuilder extends CacheDataBuilder
{

	/**
	 * Overriden version of the initialiseCache api which will in turn calls another api to get load the currency
	 * decimal places values in the cache.
	 * 
	 * @param hashMap
	 * @return currDataList : currency decimal places data to be loaded in cache.
	 */
	protected List initializeCache(HashMap hashMap)
	{
		String fnName = "[GlobalCurrencyCacheBuilder.initializeCache]";
		logger.ctinfo("CTVDF00220", fnName);
		List<HashMap<String, String>> currDataList = getCurrDecimalPlacesData();
		logger.ctinfo("CTVDF00221", fnName);
		return currDataList;
	}

	/**
	 * this is ref to VaildParams
	 * 
	 * @param params
	 * @return
	 * @see com.intellectdesign.canvas.cache.handler.CacheDataBuilder#validateParameters(java.util.HashMap)
	 */
	@Override
	protected String validateParameters(HashMap params)
	{

		return null;
	}

	/**
	 * Fetches currency decimal data from the database table.
	 * 
	 * @param
	 * @return List of HashMap currency decimal places data.
	 */
	private List<HashMap<String, String>> getCurrDecimalPlacesData()
	{
		String fnName = "[GlobalCurrencyCacheBuilder.getCurrDecimalPlacesData]";
		logger.ctinfo("CTVDF00223", fnName);
		Class<?> clshandler = null;
		List<HashMap<String, String>> currlistData = new ArrayList<HashMap<String, String>>();
		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		String className = configMgr.getImplClassDescriptor().getGlobalCurrencyProviderClass();
		clshandler = on(className).get();
		currlistData = on(clshandler).create().call("getCurrencyBasedDecimalData").get();
		logger.ctinfo("CTVDF00221", fnName);
		logger.ctdebug("CTVDF00222", currlistData);
		return currlistData;
	}

	private Logger logger = Logger.getLogger(GlobalCurrencyCacheDataBuilder.class);
}
