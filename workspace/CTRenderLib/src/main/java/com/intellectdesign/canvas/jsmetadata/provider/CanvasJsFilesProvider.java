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
 * Class which provides Canvas Js Files.
 * 
 * @version 1.0
 */
public class CanvasJsFilesProvider implements ICanvasJsDataProvider
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
		logger.ctdebug("CTRND00080");
		String jsMetadataString = null;
		StringBuffer jsFiles = null;
		int totalCount = 0;
		List<Map> jsFileList = null;
		CacheManager cacheManager = CacheManager.getFWInstance();
		jsFileList = new ArrayList();
		jsFileList = cacheManager.getDataFromCache(request.getSession(), "JS_FILES");
		logger.ctdebug("CTRND00081", jsFileList);

		if (jsFileList != null && jsFileList.size() > 0)
		{
			jsFiles = new StringBuffer();
			for (Map map : jsFileList)
			{
				totalCount = map.size();
				jsFiles.append(HashMapToJSONConverter.convertHashMapToJSONFormat(map));
				jsFiles.append(",");
			}
			if (jsFiles.length() > 1)
			{
				jsFiles.deleteCharAt(jsFiles.length() - 1);
			}
		}
		jsMetadataString = "canvas.metadata.jsfilesLoader.setJsFilesLoaderMetadata(" + jsFiles + ");"
				+ "canvas.metadata.jsfilesLoader.setTotalCount(" + totalCount + ");";
		logger.ctdebug("CTRND00082", jsMetadataString);
		logger.ctdebug("CTRND00083");
		return jsMetadataString;
	}

	private static final Logger logger = Logger.getLogger(CanvasJsFilesProvider.class);
}