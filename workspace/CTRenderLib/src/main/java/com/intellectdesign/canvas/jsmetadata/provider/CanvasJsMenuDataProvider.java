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

import javax.servlet.http.HttpServletRequest;

import com.intellectdesign.canvas.cache.handler.CacheManager;
import com.intellectdesign.canvas.constants.common.FrameworkConstants;
import com.intellectdesign.canvas.data.conversion.util.HashMapToJSONConverter;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.jsmetadata.ICanvasJsDataProvider;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.viewdefinition.MenuNode;

/**
 * Class used to provide Canvas Js Menu Data.
 * 
 * @version 1.0
 */
public class CanvasJsMenuDataProvider implements ICanvasJsDataProvider
{

	@SuppressWarnings("unchecked")
	/**
	 * Method to return the JavaScriptData.
	 * @param HttpServletRequest
	 * @return String 
	 */
	public String getJavaScriptData(HttpServletRequest request) throws ProcessingErrorException
	{
		logger.ctdebug("CTRND00089");
		String jsMetadataString = "";
		String menuItemsJSON = "";
		List<MenuNode> menuList = null;
		HashMap metaDataMap = new HashMap();

		CacheManager cacheManager = CacheManager.getFWInstance();
		menuList = new ArrayList<MenuNode>();
		menuList = cacheManager.getDataFromCache(request.getSession(), FrameworkConstants.ENTL_MENU_ITEMS_META);
		if (menuList != null && menuList.size() > 0)
		{
			for (MenuNode mNode : menuList)
			{
				menuItemsJSON += mNode.toString() + ",";
			}
			if (menuItemsJSON.length() > 1)
			{
				menuItemsJSON = menuItemsJSON.substring(0, menuItemsJSON.length() - 1);
				menuItemsJSON = "[" + menuItemsJSON + "]";
			}
			metaDataMap.put("MENU_METADTA", menuItemsJSON);
		}
		jsMetadataString = "canvas.metadata.menu.initalize("
				+ HashMapToJSONConverter.convertHashMapToJSONFormat(metaDataMap) + ");";
		logger.ctdebug("CTRND00090", jsMetadataString);
		logger.ctdebug("CTRND00091");
		return jsMetadataString;
	}

	private static final Logger logger = Logger.getLogger(CanvasJsMenuDataProvider.class);
}