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

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.intellectdesign.canvas.cache.currency.GlobalCurrencyConstants;
import com.intellectdesign.canvas.cache.handler.CacheManager;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.data.conversion.util.HashMapToJSONConverter;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.jsmetadata.ICanvasJsDataProvider;
import com.intellectdesign.canvas.logger.Logger;

/**
 * Class which provides Canvas Js Global Currency.
 * 
 * @version 1.0
 */
public class CanvasJsGlobalCurrencyDataProvider implements ICanvasJsDataProvider
{
	/**
	 * Method to return the JavaScriptData.
	 * 
	 * @param request
	 * @return String
	 */
	@SuppressWarnings(
	{ "unchecked" })
	public String getJavaScriptData(HttpServletRequest request) throws ProcessingErrorException
	{
		logger.ctdebug("CTRND00084");
		String jsMetadataString = null;
		CacheManager cacheManager = CacheManager.getFWInstance();
		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		List<HashMap<String, String>> currencyDataList = cacheManager.getDataFromCache(request.getSession(),
				GlobalCurrencyConstants.GLOBAL_CURR_CACHE);

		String currDecimalJSON = HashMapToJSONConverter.convertHashMapToJSONFormat(currencyDataList.get(0));
		logger.ctdebug("CTRND00086", currDecimalJSON);

		String sDefaultCurrency = configMgr.getSystemPrefDescriptor().getDefaultCurrency();

		jsMetadataString = "cbx.globalcurrency.metadata.setCurrDecimalPlaceList(" + currDecimalJSON + ");"
				+ "cbx.globalcurrency.metadata.setDefaultCurrency('" + sDefaultCurrency + "');";
		logger.ctdebug("CTRND00087", jsMetadataString);
		logger.ctdebug("CTRND00088");
		return jsMetadataString;
	}

	private static final Logger logger = Logger.getLogger(CanvasJsGlobalCurrencyDataProvider.class);
}