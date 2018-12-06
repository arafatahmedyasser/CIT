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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.intellectdesign.canvas.cache.handler.CacheManager;
import com.intellectdesign.canvas.constants.common.FrameworkConstants;
import com.intellectdesign.canvas.data.conversion.util.HashMapToJSONConverter;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.jsmetadata.ICanvasJsDataProvider;
import com.intellectdesign.canvas.logger.Logger;

/**
 * Class which provides Canvas Js Entitlement.
 * 
 * @version 1.0
 */
public class CanvasJsEntitlementDataProvider implements ICanvasJsDataProvider
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
		logger.ctdebug("CTRND00075");
		String jsMetadataString = null;
		String entitlementString = null;
		List<Map<String, Map<String, Map<String, String>>>> entitledActionsList = null;
		Map<String, Map<String, Map<String, String>>> entitledActionsMap = null;
		CacheManager cacheManager = CacheManager.getInstance();

		entitledActionsList = new ArrayList<Map<String, Map<String, Map<String, String>>>>();
		entitledActionsList = cacheManager.getDataFromCache(request.getSession(), FrameworkConstants.ENTL_ACTIONS);
		entitledActionsMap = new HashMap<String, Map<String, Map<String, String>>>();
		if (entitledActionsList != null && entitledActionsList.size() != 0)
		{
			entitledActionsMap = entitledActionsList.get(0);
		}
		logger.ctdebug("CTRND00076", entitledActionsMap);
		entitlementString = HashMapToJSONConverter.convertHashMapToJSONFormat(entitledActionsMap);
		logger.ctdebug("CTRND00077", entitlementString);
		jsMetadataString = "iportal.entitlement.setEntitlementMetadata(" + entitlementString + ");";
		logger.ctdebug("CTRND00078", jsMetadataString);
		logger.ctdebug("CTRND00079");
		return jsMetadataString;
	}

	private static final Logger logger = Logger.getLogger(CanvasJsEntitlementDataProvider.class);
}