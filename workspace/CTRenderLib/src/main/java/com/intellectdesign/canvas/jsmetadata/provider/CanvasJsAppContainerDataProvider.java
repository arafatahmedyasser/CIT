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
 * This package contains the classes for jsmetadata.
 * 
 * @version 1.0
 */
public class CanvasJsAppContainerDataProvider implements ICanvasJsDataProvider
{

	@SuppressWarnings(
	{ "unchecked" })
	/**
	 * Method to return the JavaScriptData.
	 * @param HttpServletRequest
	 * @return String 
	 */
	public String getJavaScriptData(HttpServletRequest request) throws ProcessingErrorException
	{
		logger.ctdebug("CTRND00071");
		List<Map> appContainerList = null;
		StringBuffer sbuff = new StringBuffer();
		String jsMetadataString = "";
		CacheManager cacheManager = CacheManager.getFWInstance();
		appContainerList = new ArrayList();
		appContainerList = cacheManager.getDataFromCache(request.getSession(), "APP_CONTAINER_METADATA");
		logger.ctdebug("CTRND00072", appContainerList);

		for (Map map : appContainerList)
		{
			sbuff.append(HashMapToJSONConverter.convertHashMapToJSONFormat(map));
			sbuff.append(",");
		}
		if (sbuff.length() > 1)
		{
			sbuff.deleteCharAt(sbuff.length() - 1);
		}
		jsMetadataString = "canvas.metadata.appcontainer.setAppContainerMetadta(" + sbuff + ");";
		logger.ctdebug("CTRND00073", jsMetadataString);
		logger.ctdebug("CTRND00074");
		return jsMetadataString;
	}

	private static final Logger logger = Logger.getLogger(CanvasJsAppContainerDataProvider.class);
}