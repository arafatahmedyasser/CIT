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
 * */
package com.intellectdesign.canvas.formcontainer.cache;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.cache.handler.CacheConstants;
import com.intellectdesign.canvas.cache.handler.CacheDataBuilder;
import com.intellectdesign.canvas.formcontainer.FormContainerDefinitionException;
import com.intellectdesign.canvas.formcontainer.instruction.FormContainerDefinitionInstruction;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.login.sessions.SessionInfo;

/**
 * This class is responsible for building the form container tools map metadata in cache.
 * 
 * @version 1.0
 */
public class FormContainerToolsCacheDataBuilder extends CacheDataBuilder
{

	/**
	 * This method initializes the cache for the current session.
	 * 
	 * @see com.intellectdesign.canvas.cache.handler.CacheDataBuilder#initializeCache(java.util.HashMap)
	 * @return toolsMap - List object that contains the Form Container Tools applicable 
	 * 						for the device that the current session used 
	 */
	@Override
	protected List initializeCache(HashMap sessionMap)
	{
		List<Map> toolsMap = null;
		toolsMap = getFCToolsMap(sessionMap);
		return toolsMap;
	}

	/**
	 * This method fetches the Form Container Tools for the current session using the {@link FormContainerDefinitionInstruction} class.
	 * 
	 * @param sessionMap - current session object
	 * @return List - List object that contains the Form Container Tools applicable 
	 * 						for the device that the current session used 
	 */
	private List<Map> getFCToolsMap(HashMap sessionMap)
	{
		logger.ctinfo("CTFDF00119");
		List dataList = null;
		try
		{
			SessionInfo sessInfo = null;
			sessInfo = (SessionInfo) sessionMap.get(CacheConstants.OBJECT_SESSIONINFO);
			FormContainerDefinitionInstruction formContainerDefinitionInstruction = new FormContainerDefinitionInstruction();
			dataList = formContainerDefinitionInstruction.getToolsMapping(sessInfo.deviceType);
		} catch (FormContainerDefinitionException fcde)
		{
			logger.cterror("CTFDF00120", fcde);
		}
		logger.ctinfo("CTFDF00121");
		return dataList;
	}

	/**
	 * Thid method is provided as hook for the sub class to validate the passing params.
	 * 
	 * @see com.intellectdesign.canvas.cache.handler.CacheDataBuilder#validateParameters(java.util.HashMap)
	 * @param params - Hashmap of of parameters from the client
	 * @return ValidationText - String value of the validation Parameters 
	 */
	@Override
	protected String validateParameters(HashMap params)
	{

		return null;
	}

	private static Logger logger = Logger.getLogger(FormContainerToolsCacheDataBuilder.class);
}
