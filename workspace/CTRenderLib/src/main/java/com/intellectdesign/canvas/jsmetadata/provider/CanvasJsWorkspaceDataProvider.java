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
import com.intellectdesign.canvas.constants.common.FrameworkConstants;
import com.intellectdesign.canvas.data.conversion.util.HashMapToJSONConverter;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.jsmetadata.ICanvasJsDataProvider;
import com.intellectdesign.canvas.logger.Logger;

/**
 * Class used to provide Canvas Js Workspace Data 
 * 
 * @version 1.0
 */
public class CanvasJsWorkspaceDataProvider implements ICanvasJsDataProvider
{

	@SuppressWarnings("unchecked")
	/**
	 * Method to return the JavaScriptData.
	 * @param HttpServletRequest
	 * @return String 
	 */
	public String getJavaScriptData(HttpServletRequest request) throws ProcessingErrorException
	{
		logger.ctdebug("CTRND00101");
		String jsMetadataString = "";
		String appStrNodesJSON = "";
		String device = (String) request.getAttribute("deviceType");
		List<Map<String, Object>> wsList = null;
		String sControllerUrl = request.getContextPath() + "/WidgetControllerServlet";

		CacheManager cacheManager = CacheManager.getFWInstance();
		wsList = new ArrayList<Map<String, Object>>();
		wsList = cacheManager.getDataFromCache(request.getSession(), FrameworkConstants.WORKSPACE_META_DATA);
		if (wsList != null && wsList.size() > 0)
		{
			appStrNodesJSON += HashMapToJSONConverter.convertHashMapToJSONFormat(wsList.get(0));
		}
		jsMetadataString = "iportal.workspace.metadata.setDevice('"
				+ device
				+ "');" 
				+ "iportal.workspace.metadata.setApplicationNodeStr(" + appStrNodesJSON + ");"
				+ "iportal.workspace.metadata.setControllerUrl('" + sControllerUrl + "');"
				+ "iportal.workspace.metadata.setContextRoot('" + request.getContextPath() + "');";

		logger.ctdebug("CTRND00102", jsMetadataString);
		logger.ctdebug("CTRND00103");
		return jsMetadataString;
	}

	private static final Logger logger = Logger.getLogger(CanvasJsWorkspaceDataProvider.class);
}