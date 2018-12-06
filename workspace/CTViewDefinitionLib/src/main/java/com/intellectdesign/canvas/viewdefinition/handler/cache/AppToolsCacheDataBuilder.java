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

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.cache.handler.CacheConstants;
import com.intellectdesign.canvas.cache.handler.CacheDataBuilder;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.login.sessions.SessionInfo;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionException;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionInstruction;

/**
 * This class is for app tools cache builder extends cache handler.
 * 
 * @version 1.0
 */
public class AppToolsCacheDataBuilder extends CacheDataBuilder
{

	/**
	 * (non-Javadoc) ref to method AppToolsCacheBuilder
	 * 
	 * @param hm session
	 * 
	 * @see com.intellectdesign.canvas.cache.handler.CacheDataBuilder#initializeCache(java.util.HashMap)
	 * 
	 * @return map
	 */
	@Override
	protected List initializeCache(HashMap sessionMap)
	{
		List<Map> toolsMap = null;
		toolsMap = getAppToolsMap(sessionMap);
		return toolsMap;
	}

	/**
	 * this is ref to GetAppToolsMap
	 * 
	 * @param hm session
	 * @return datalist
	 */
	private List<Map> getAppToolsMap(HashMap sessionMap)
	{
		logger.ctinfo("CTVDF00211");
		List dataList = null;
		try
		{
			SessionInfo sessInfo = null;
			sessInfo = (SessionInfo) sessionMap.get(CacheConstants.OBJECT_SESSIONINFO);
			ViewDefinitionInstruction viewDefinitionInstruction = new ViewDefinitionInstruction();
			dataList = viewDefinitionInstruction.getToolsMapping(sessInfo.deviceType);
		} catch (ViewDefinitionException vdfe)
		{
			logger.cterror("CTVDF00209", vdfe);
		}
		logger.ctinfo("CTVDF00210");
		return dataList;
	}

	/**
	 * this is ref to hashMap vaildParams (non-Javadoc)
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

	private static Logger logger = Logger.getLogger(AppToolsCacheDataBuilder.class);
}
