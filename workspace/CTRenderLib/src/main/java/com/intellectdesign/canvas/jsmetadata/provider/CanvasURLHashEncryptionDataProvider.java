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

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.intellectdesign.canvas.cache.handler.CacheManager;
import com.intellectdesign.canvas.data.conversion.util.HashMapToJSONConverter;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.jsmetadata.ICanvasJsDataProvider;
import com.intellectdesign.canvas.logger.Logger;

/**
 * Class used for providing Canvas URL Hash Encryption Data
 * 
 * @version 1.0
 */
public class CanvasURLHashEncryptionDataProvider implements ICanvasJsDataProvider
{

	@SuppressWarnings("unchecked")
	/**
	 * Method to return the JavaScriptData.
	 * @param HttpServletRequest
	 * @return String 
	 */
	public String getJavaScriptData(HttpServletRequest request) throws ProcessingErrorException
	{
		logger.ctdebug("CTRND00378");
		String jsMetadataString = "";

		CacheManager cacheManager = CacheManager.getFWInstance();
		List<Map> cachedKeyList = cacheManager.getDataFromCache(request.getSession(), "ENCRYPTION_KEYS");

		Map encMap = null;
		if (cachedKeyList != null && cachedKeyList.size() > 0)
		{
			encMap = cachedKeyList.get(0);
		}
		if (encMap != null)
		{
			jsMetadataString = "canvas.metadata.URLhashencryption.initalize("
					+ HashMapToJSONConverter.convertHashMapToJSONFormat(encMap) + ");";
		}

		logger.ctdebug("CTRND00379", jsMetadataString);
		logger.ctdebug("CTRND00380");
		return jsMetadataString;
	}

	private static final Logger logger = Logger.getLogger(CanvasURLHashEncryptionDataProvider.class);
}