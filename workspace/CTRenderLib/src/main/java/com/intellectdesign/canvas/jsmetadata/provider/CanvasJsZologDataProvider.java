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
package com.intellectdesign.canvas.jsmetadata.provider;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.intellectdesign.canvas.cache.handler.CacheManager;
import com.intellectdesign.canvas.data.conversion.util.HashMapToJSONConverter;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.jsmetadata.ICanvasJsDataProvider;
import com.intellectdesign.canvas.logger.Logger;

/**
 * Class used to provide Canvas Js Zolog Data
 * 
 * @version 1.0
 */
public class CanvasJsZologDataProvider implements ICanvasJsDataProvider
{

	@SuppressWarnings(
	{ "unchecked", "rawtypes" })
	/**
	 * Method to return the JavaScriptData.
	 * @param HttpServletRequest
	 * @return String 
	 */
	public String getJavaScriptData(HttpServletRequest request) throws ProcessingErrorException
	{
		logger.ctdebug("CTRND00104");
		String jsMetadataString = "";
		String zologSearchListStr = "";
		List<Map> zologSearchList = null;
		CacheManager cacheManager = CacheManager.getFWInstance();
		zologSearchList = new ArrayList<Map>();
		zologSearchList = cacheManager.getDataFromCache(null, "ZOLOG_SEARCH_META_CACHE");

		if (zologSearchList != null && zologSearchList.size() > 0)
		{
			for (Map zologMap : zologSearchList)
			{
				zologSearchListStr += HashMapToJSONConverter.convertHashMapToJSONFormat(zologMap) + ",";
			}
			if (zologSearchListStr.length() > 1)
			{
				zologSearchListStr = zologSearchListStr.substring(0, zologSearchListStr.length() - 1);
				zologSearchListStr = "[" + zologSearchListStr + "]";
			}
		}
		jsMetadataString = "canvas.metadata.zolog.setZologMetaData(" + zologSearchListStr + ");";
		logger.ctdebug("CTRND00105", jsMetadataString);
		logger.ctdebug("CTRND00106");
		return jsMetadataString;
	}

	private static final Logger logger = Logger.getLogger(CanvasJsZologDataProvider.class);
}