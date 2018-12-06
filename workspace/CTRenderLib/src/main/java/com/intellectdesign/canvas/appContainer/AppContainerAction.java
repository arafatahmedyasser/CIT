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

package com.intellectdesign.canvas.appContainer;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.intellectdesign.canvas.action.PortletAction;
import com.intellectdesign.canvas.cache.handler.CacheManager;
import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.common.ReplyObject;
import com.intellectdesign.canvas.constants.common.FrameworkConstants;
import com.intellectdesign.canvas.data.conversion.util.JSONObjectBuilderForExtJs;
import com.intellectdesign.canvas.exceptions.action.OrbiActionException;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.login.sessions.SessionInfo;
import com.intellectdesign.canvas.web.config.ActionMap;

/**
 * Class for App container action which extends portlet action.
 * 
 * @version 1.0
 */
public class AppContainerAction extends PortletAction
{
	@Override
	/**
	 * Used to execute the action after validation
	 * @param action
	 * @param sessionInfo
	 * @param actionMap
	 * @param requestParams
	 * @param request
	 * @return replyObject
	 * @throws OrbiActionException
	 * @see com.intellectdesign.canvas.action.PortletAction#executePortletActionUsing(java.lang.String, com.intellectdesign.canvas.login.sessions.SessionInfo, com.intellectdesign.canvas.web.config.ActionMap, java.util.Map, javax.servlet.http.HttpServletRequest)
	 */
	public ReplyObject executePortletActionUsing(String action, SessionInfo sessionInfo, ActionMap actionMap,
			Map requestParams, HttpServletRequest request) throws OrbiActionException
	{
		logger.ctinfo("CTRND00280");
		ReplyObject reply = null;

		try
		{

			if (action.equals(FrameworkConstants.GET_APPS))
			{
				reply = executeHostRequest(sessionInfo, actionMap.getHostCode(), requestParams, request);
				logger.ctdebug("CTRND00009", reply);
				logger.ctdebug("CTRND00010");
				JSONObjectBuilderForExtJs.buildFormResultMap(reply);
			} else if (action.equals(FrameworkConstants.ADD_APPS) || action.equals(FrameworkConstants.DELETE_APP))
			{

				reply = executeHostRequest(sessionInfo, actionMap.getHostCode(), requestParams, request);
				logger.ctdebug("CTRND00011", reply);
				logger.ctdebug("CTRND00010");
				CacheManager cacheManager = CacheManager.getFWInstance();
				cacheManager.invalidateCache(request.getSession(), "APP_CONTAINER_METADATA");
				List<Map> appContainerList = cacheManager.getDataFromCache(request.getSession(),
						"APP_CONTAINER_METADATA");
				((ExtReplyObject) reply).headerMap.put("APP_CONTAINER_METADATA", appContainerList);
				JSONObjectBuilderForExtJs.buildFormResultMap(reply);
			}

		} catch (ProcessingErrorException pex)
		{
			logger.cterror("CTRND00012", pex);
			throw new OrbiActionException(pex.getErrorCode(), pex.getMessage());
		}

		logger.ctinfo("CTRND00281");
		return reply;
	}

	private static Logger logger = Logger.getLogger(AppContainerAction.class);
}
