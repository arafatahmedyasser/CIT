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

package com.intellectdesign.canvas.formcontainer.action;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONArray;
import org.json.JSONException;
import com.intellectdesign.canvas.action.PortletAction;
import com.intellectdesign.canvas.cache.handler.CacheManager;
import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.common.ReplyObject;
import com.intellectdesign.canvas.constants.common.FrameworkConstants;
import com.intellectdesign.canvas.constants.common.JSPIOConstants;
import com.intellectdesign.canvas.data.conversion.util.HashMapToJSONConverter;
import com.intellectdesign.canvas.data.conversion.util.JSONObjectBuilderForExtJs;
import com.intellectdesign.canvas.exceptions.action.OrbiActionException;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.formcontainer.FormContainerConstants;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.login.sessions.SessionInfo;
import com.intellectdesign.canvas.login.sessions.SessionManager;
import com.intellectdesign.canvas.sync.ICanvasSyncSupport;
import com.intellectdesign.canvas.web.config.ActionMap;

/***
 * Action Class for Form Container Framework.
 * 
 * @version 1.0
 */
public class FormContainerDefinitionAction extends PortletAction implements ICanvasSyncSupport
{
	private static final Logger logger = Logger.getLogger(FormContainerDefinitionAction.class);

	/***
	 * @see com.intellectdesign.iportal.ws.framework.PortletAction#executePortletActionUsing(java.lang.String,
	 *      com.orbidirect.sessionmanager.SessionInfo, com.intellectdesign.iportal.util.ActionMap, java.util.Map,
	 *      javax.servlet.http.HttpServletRequest)
	 * 
	 * @return ReplyObject reply
	 * @param sessionInfo Session Info
	 * @param action Action
	 * @param actionMap Action Map
	 * @param requestParams Request Parameters
	 * @param request HTTP request
	 * @throws OrbiActionException OrbiActionException
	 */
	@Override
	public final ReplyObject executePortletActionUsing(final String action, final SessionInfo sessionInfo,
			final ActionMap actionMap, final Map requestParams, HttpServletRequest request) throws OrbiActionException
	{
		ReplyObject reply = null;
		JSONObjectBuilderForExtJs builder = new JSONObjectBuilderForExtJs();

		try
		{
			logger.ctdebug("CTRND00375", action, requestParams);
			if ("GET_FORM_CONTAINER_METADATA".equals(action))
			{
				fetchToolsFromCache(requestParams, request);

				// CacheManager cacheManager = CacheManager.getInstance();
				/**
				 * The Entitled functions list is fetched from the cache and is added to the vector by the method
				 * addEntlFuncToReqParam(). This entitled functions list is used to validate the Form Container Action
				 * Buttons on the Server side while fetching the metadata for the Form Container.
				 */
				// List<ProductFunctionVO>
				// userEntitlementList=cacheManager.getDataFromCache(request.getSession(),FrameworkConstants.ENTL_FUNCTIONS);
				// Map newReqParamMap= new HashMap(); //addEntlFuncToReqParam(userEntitlementList, requestParams);
				// reply = executeHostRequest(sessionInfo, actionMap.host, requestParams);
				reply = executeHostRequest(sessionInfo, actionMap.getHostCode(), requestParams, request);

				logger.ctdebug("CTRND00376", reply);
				// Convert the response as a View Header map.
				builder.buildFormContainerDefinitionHeaderMap(reply);
			}

		} catch (ProcessingErrorException procExcep)
		{
			logger.cterror("CTRND00377", procExcep, action);
			throw new OrbiActionException(
					FrameworkConstants.ERROR_SYSTEM_ERROR,
					"Received processing error while handling action - '" + action + "in FormContainerDefinitionAction",
					procExcep);
		}
		return reply;
	}

	/**
	 * The API that will inject the Applicable tools for Channel in the request params.
	 * 
	 * @param requestParams
	 * @param request
	 */
	private void fetchToolsFromCache(Map requestParams, HttpServletRequest request)
	{
		CacheManager cacheManager = CacheManager.getFWInstance();
		List toolsChannelMap = cacheManager.getDataFromCache(request.getSession(),
				FormContainerConstants.CT_FORM_CONTAINER_TOOLS);
		requestParams.put(FormContainerConstants.APPLICABLE_TOOLS, toolsChannelMap);
	}

	/**
	 * This method is intended to to validate the list of keys in sync with the server time that were provided
	 * especially FormContainer
	 * 
	 * @param keys The map having the keys as provided by the clientcanvassupport. The exact keys will be as per what
	 *            the client
	 * @param request
	 * @return The Array of matched meta data structures provided as JSON objects inside JSON Array
	 * @throws ProcessingErrorException
	 * @see com.intellectdesign.canvas.sync.ICanvasSyncSupport#getSyncData(java.util.Map,
	 *      javax.servlet.http.HttpServletRequest)
	 */
	@Override
	public JSONArray validateSyncList(Map keys, HttpServletRequest request) throws ProcessingErrorException, JSONException
	{
		ReplyObject reply = null;
		SessionInfo sessionInfo = null;
		Map replyMap = null;
		Map requestParams = new HashMap();
		requestParams.put(JSPIOConstants.INPUT_FUNCTION_CODE, "VSBLTY");
		requestParams.put(JSPIOConstants.INPUT_PRODUCT, "CANVAS");
		requestParams.put(JSPIOConstants.INPUT_SUB_PRODUCT, "CANVAS");
		requestParams.put(FrameworkConstants.PAGE_CODE_TYPE, "SYNC_METADATA_CODE");
		requestParams.put(JSPIOConstants.PRODUCT_NAME, "CANVAS");
		requestParams.put(FrameworkConstants.SyncMetadataConstants.ATTR_KEYS.getName(), keys);
		requestParams.put(JSPIOConstants.INPUT_ACTION, "SYNC_METADATA");
		logger.ctdebug("CTRND00444", requestParams);
		JSONArray jsArray = null;
		List syncList = null;
		try
		{
			SessionManager mSessionMan = SessionManager.getInstance();
			sessionInfo = mSessionMan.getUserSessionInfo(request);
			reply = executeHostRequest(sessionInfo, "SYNCMD", requestParams, request);
			logger.ctdebug("CTRND00445", reply);
			replyMap = retriveReplyMap(reply);
			syncList =(List) replyMap.get(FrameworkConstants.SyncMetadataConstants.SYNC_METADATA.getName());
			jsArray = new JSONArray(syncList);
		} catch (ProcessingErrorException procExp)
		{
			logger.cterror("CTRND00446", procExp);
			throw procExp;
		}
		logger.ctdebug("CTRND00448", jsArray);
		return jsArray;
	}
	/**
	 * This method is intended to get the latest version of the meta data in sync which is based on the keys that were
	 * provided especially FormContainer
	 * 
	 * @param keys
	 * @param keys The map having the keys as provided by the client. The exact keys will be as per what the client
	 *            sends for this module
	 * @return The Array of matched meta data structures provided as JSON objects inside JSON Array
	 * @throws ProcessingErrorException Thrown if any error occurs while processing this request
	 * @see com.intellectdesign.canvas.sync.ICanvasSyncSupport#validateSyncList(java.util.Map,
	 *      javax.servlet.http.HttpServletRequest)
	 */
	@Override
	public JSONArray getSyncData(Map keys, HttpServletRequest request) throws ProcessingErrorException, JSONException
	{
		ReplyObject formContainerreply = null;
		SessionInfo sessionInfo = null;
		JSONArray jsArray = null;
		Map replyMap = null;
		Map formContainerDataMap = null;
		Map requestParams = new HashMap();
		List formaddDataList = new ArrayList();
		try
		{
			logger.ctdebug("CTRND00477", keys);
			ArrayList<String> idList = (ArrayList<String>) keys.get(FrameworkConstants.SyncMetadataConstants.ATTR_KEYS
					.getName());
			SessionManager mSessionMan = SessionManager.getInstance();
			sessionInfo = mSessionMan.getUserSessionInfo(request);
			requestParams.put(JSPIOConstants.INPUT_ACTION, "GET_FORM_CONTAINER_METADATA");
			requestParams.put(JSPIOConstants.INPUT_FUNCTION_CODE, "VSBLTY");
			requestParams.put(JSPIOConstants.INPUT_PRODUCT, "CANVAS");
			requestParams.put(JSPIOConstants.INPUT_SUB_PRODUCT, "CANVAS");
			requestParams.put(FrameworkConstants.PAGE_CODE_TYPE, "FCDF_ACTION");
			requestParams.put(JSPIOConstants.PRODUCT_NAME, "CANVAS");
			for (String containerId : idList)
			{
				requestParams.put("FORM_CONTAINER_ID", containerId);
				fetchToolsFromCache(requestParams, request);
				logger.ctdebug("CTRND00478", requestParams);
				formContainerreply = executeHostRequest(sessionInfo, "FORMCONTAINERDEFN", requestParams, request);
				logger.ctdebug("CTRND00479", formContainerreply);
				replyMap = retriveReplyMap(formContainerreply);
				HashMap datavalue = (HashMap) replyMap.get("HEADER_FORM_CONTAINER_METADATA");
				formContainerDataMap = new HashMap();
				formContainerDataMap.put(FrameworkConstants.SyncMetadataConstants.ATTR_UNIQUE.getName(), containerId);
				formContainerDataMap.put(FrameworkConstants.SyncMetadataConstants.ATTR_VALUE.getName(),
						HashMapToJSONConverter.convertHashMapToJSONFormat(datavalue));
				formaddDataList.add(formContainerDataMap);
			}
			jsArray = new JSONArray(formaddDataList);
		} catch (ProcessingErrorException procExcep)
		{
			logger.cterror("CTRND00480", procExcep);
			throw procExcep;
		}
		logger.ctdebug("CTRND00481", jsArray);
		return jsArray;
	}
	/**
	 * This API used to return headerMap from ReplyObject. First it will check given reply object and headerMap of that
	 * is null or not. if not returns headerMap object. else throws ProcessingErrorException
	 * 
	 * @param reply ReplyObject needs to check
	 * @throws ProcessingErrorException if given reply object or headerMap of reply object is null
	 */
	private static Map retriveReplyMap(ReplyObject reply) throws ProcessingErrorException
	{
		Map returnHeaderMap = null;
		if (reply != null)
		{
			returnHeaderMap = ((ExtReplyObject) reply).headerMap;
			if (returnHeaderMap == null)
			{
				logger.ctdebug("CTRND00426");
				throw new ProcessingErrorException("Error_ReplyMap_null", "HashMap in the reply object is null");
			}
		} else
		{
			logger.ctdebug("CTRND00427");
			throw new ProcessingErrorException("Error_Reply_null", "Reply Object is null");
		}
		return returnHeaderMap;
	}
}
