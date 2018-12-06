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
package com.intellectdesign.canvas.fdf;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import com.intellectdesign.canvas.action.PortletAction;
import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.common.ReplyObject;
import com.intellectdesign.canvas.constants.common.FrameworkConstants;
import com.intellectdesign.canvas.constants.common.JSPIOConstants;
import com.intellectdesign.canvas.data.conversion.util.HashMapToJSONConverter;
import com.intellectdesign.canvas.data.conversion.util.JSONObjectBuilderForExtJs;
import com.intellectdesign.canvas.exceptions.action.OrbiActionException;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.formdefinition.FormDefinition;
import com.intellectdesign.canvas.formdefinition.FormDefinitionConstants;
import com.intellectdesign.canvas.formdefinition.FormItemDefinition;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.login.sessions.SessionInfo;
import com.intellectdesign.canvas.login.sessions.SessionManager;
import com.intellectdesign.canvas.sync.ICanvasSyncSupport;
import com.intellectdesign.canvas.web.config.ActionMap;

/**
 * Base class to process a particular form action
 * 
 * @version 1.0
 * 
 */
public class FormDefinitionAction extends PortletAction implements ICanvasSyncSupport
{
	private static Logger LOGGER = Logger.getLogger(FormDefinitionAction.class);

	/**
	 * This is called from the base class to process a particular action
	 * 
	 * @see com.intellectdesign.iportal.ws.framework.PortletAction#executePortletActionUsing(java.lang.String,
	 *      com.orbidirect.sessionmanager.SessionInfo, com.intellectdesign.canvas.actionmap.ActionMap, java.util.Map,
	 *      javax.servlet.http.HttpServletRequest)
	 * @see com.intellectdesign.canvas.action.PortletAction#executePortletActionUsing(java.lang.String,
	 *      com.intellectdesign.canvas.login.sessions.SessionInfo, com.intellectdesign.canvas.web.config.ActionMap, java.util.Map,
	 *      javax.servlet.http.HttpServletRequest)
	 * 
	 * 
	 * @param action
	 * @param sessionInfo
	 * @param actionMap
	 * @param requestParams
	 * @param request
	 * @throws OrbiActionException
	 * */
	@Override
	public ReplyObject executePortletActionUsing(String action, SessionInfo sessionInfo, ActionMap actionMap,
			Map requestParams, HttpServletRequest request) throws OrbiActionException
	{
		ReplyObject reply = null;
		JSONObjectBuilderForExtJs builder = new JSONObjectBuilderForExtJs();
		try
		{
			LOGGER.ctdebug("CTRND00038", action);
			LOGGER.ctdebug("CTRND00039", requestParams);
			// GET_ADDITIONAL_DATA_ACTION
			if (FormDefinitionConstants.ACTION_INIT_FORM_HEADER.equals(action))
			{
				reply = executeHostRequest(sessionInfo, actionMap.getHostCode(), requestParams, request);
				LOGGER.ctdebug("CTRND00040", reply);
				// Convert the response as a View Header map.
				builder.buildFormDefinitionHeaderMap(reply);
			}
			if (FormDefinitionConstants.ACTION_GET_ADDITIONAL_DATA.equals(action))
			{
				reply = executeHostRequest(sessionInfo, actionMap.getHostCode(), requestParams, request);
				LOGGER.ctdebug("CTRND00041", reply);
				// Convert the response as a View Header map.
				builder.buildFormDefinitionHeaderMap(reply);
			}

		} catch (ProcessingErrorException procExcep)
		{
			LOGGER.cterror("CTRND00042", procExcep, action);
			throw new OrbiActionException(FrameworkConstants.ERROR_SYSTEM_ERROR,
					"Received processing error while handling action - '" + action + "in ViewDefinition action",
					procExcep);
		}
		return reply;
	}
	/**
	 * This method is intended to to validate the list of keys in sync with the server time that were provided
	 * especially Form
	 * 
	 * @param keys The map having the keys as provided by the client. The exact keys will be as per what the client
	 *            sends
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
		LOGGER.ctdebug("CTRND00439", requestParams);
		JSONArray jsArray = null;
		List syncList = null;
		try
		{
			SessionManager mSessionMan = SessionManager.getInstance();
			sessionInfo = mSessionMan.getUserSessionInfo(request);
			reply = executeHostRequest(sessionInfo, "SYNCMD", requestParams, request);
			LOGGER.ctdebug("CTRND00440", reply);
			replyMap = retriveReplyMap(reply);
			syncList =(List) replyMap.get(FrameworkConstants.SyncMetadataConstants.SYNC_METADATA.getName());
			jsArray = new JSONArray(syncList);
		} catch (ProcessingErrorException procExp)
		{
			LOGGER.cterror("CTRND00441", procExp);
			throw procExp;
		} 
		LOGGER.ctdebug("CTRND00443", jsArray);
		return jsArray;
	}
	/**
	 * This method is intended to get the latest version of the meta data in sync which is based on the keys that were
	 * provided especially Form
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
		ReplyObject formreply = null;
		SessionInfo sessionInfo = null;
		JSONArray jsArray = null;
		Map replyMap = null;
		Map formDataMap = null;
		Map requestParams = new HashMap();
		Map exclusiveParams = new HashMap();
		List formaddDataList = new ArrayList();
		boolean flag = true;
		try
		{
			LOGGER.ctdebug("CTRND00468", keys);
			ArrayList<String> idList = (ArrayList<String>) keys.get(FrameworkConstants.SyncMetadataConstants.ATTR_KEYS
					.getName());
			SessionManager mSessionMan = SessionManager.getInstance();
			sessionInfo = mSessionMan.getUserSessionInfo(request);
			String hostCode = "FORMDEFN";
			requestParams.put(JSPIOConstants.INPUT_FUNCTION_CODE, "VSBLTY");
			requestParams.put(JSPIOConstants.INPUT_PRODUCT, "CANVAS");
			requestParams.put(JSPIOConstants.INPUT_SUB_PRODUCT, "CANVAS");
			requestParams.put(FrameworkConstants.PAGE_CODE_TYPE, "FDF_CODE");
			requestParams.put(JSPIOConstants.PRODUCT_NAME, "CANVAS");
			requestParams.put("forceCallbacks", flag);
			requestParams.put("__FRAMEWORK_REQUEST", flag);
			exclusiveParams.put(JSPIOConstants.INPUT_ACTION, FormDefinitionConstants.ACTION_INIT_FORM_HEADER);
			exclusiveParams.putAll(requestParams);
			for (String formId : idList)
			{
				exclusiveParams.put(FormDefinitionConstants.FORM_ID, formId);
				LOGGER.ctdebug("CTRND00469", exclusiveParams);
				formreply = executeHostRequest(sessionInfo, hostCode, exclusiveParams, request);
				LOGGER.ctdebug("CTRND00470", formreply);
				replyMap = retriveReplyMap(formreply);
				ArrayList datavalue = (ArrayList) replyMap.get("HEADER_FORM_METADATA");
				formDataMap = new HashMap();
				formDataMap.put(FrameworkConstants.ATTR_ID, formId);
				try
				{
					HashMap addData = (HashMap) getFormAddData(sessionInfo, hostCode, request, datavalue, formId,
							requestParams);
					LOGGER.cterror("CTRND00471", formId, addData);
					if (!addData.isEmpty())
						formDataMap.put(FrameworkConstants.SyncMetadataConstants.ATTR_ADDITIONAL_DATA.getName(),
								JSONObject.stringToValue(HashMapToJSONConverter.convertHashMapToJSONFormat(addData)));
				} catch (ProcessingErrorException addDataExcep)
				{
					LOGGER.cterror("CTRND00472", addDataExcep, formId);
				}
				formDataMap.put(FrameworkConstants.SyncMetadataConstants.ATTR_VALUE.getName(), datavalue.toString());
				formaddDataList.add(formDataMap);
			}
			jsArray = new JSONArray(formaddDataList);
		} catch (ProcessingErrorException procExcep)
		{
			LOGGER.cterror("CTRND00473", procExcep);
			throw procExcep;
		}
		LOGGER.ctdebug("CTRND00474", jsArray);
		return jsArray;
	}

	/**
	 * This private method is responsible for retrieving the additional meta data of the formId.
	 * 
	 * @param sessionInfo
	 * @param hostCode
	 * @param requestParams
	 * @param request
	 * @param widgetId
	 * @return Map of widget related metadata
	 * @throws ProcessingErrorException
	 */
	private Map getFormAddData(SessionInfo sessionInfo, String hostCode, HttpServletRequest request,
			ArrayList datavalue, String formId, Map requestParams) throws ProcessingErrorException
	{
		ReplyObject reply = null;
		Map viewaddDataMap = new HashMap();
		Map exclusiveParams = new HashMap();
		requestParams.put(FormDefinitionConstants.FORM_ID, formId);
		exclusiveParams.put("INPUT_ACTION", FormDefinitionConstants.ACTION_GET_ADDITIONAL_DATA);
		exclusiveParams.putAll(requestParams);
		exclusiveParams.put(FormDefinitionConstants.FORM_ID, formId);
		for (int metaDataSize = 0; metaDataSize < datavalue.size(); metaDataSize++)
		{
			FormDefinition formAddData = (FormDefinition) datavalue.get(metaDataSize);
			if (formAddData.getAddDataDrivenItems().size() > 0)
			{
				HashMap fieldsConfig = new HashMap();
				int itemCount = 0;
				for (int addData = 0; addData < formAddData.getAddDataDrivenItems().size(); addData++)
				{
					FormItemDefinition addDataItem = (FormItemDefinition) formAddData.getAddDataDrivenItems().get(
							addData);
					if (addDataItem.getCacheDataInd().equals("N"))
					{
						fieldsConfig.put("FIELD_" + itemCount, addDataItem.getItemId());
						itemCount++;
					}
				}
				if (itemCount > 0)
				{
					fieldsConfig.put("ADD_DATA_ITEM_COUNT", String.valueOf(itemCount));
					exclusiveParams.putAll(fieldsConfig);
					LOGGER.ctdebug("CTRND00475", exclusiveParams);
					reply = executeHostRequest(sessionInfo, hostCode, exclusiveParams, request);
					LOGGER.ctdebug("CTRND00476", reply);
					Map replyMap = retriveReplyMap(reply);
					viewaddDataMap = (HashMap) replyMap.get("HEADER_FORM_METADATA");
				}
			}
		}
		return viewaddDataMap;
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
				LOGGER.ctdebug("CTRND00426");
				throw new ProcessingErrorException("Error_ReplyMap_null", "HashMap in the reply object is null");
			}
		} else
		{
			LOGGER.ctdebug("CTRND00427");
			throw new ProcessingErrorException("Error_Reply_null", "Reply Object is null");
		}
		return returnHeaderMap;
	}
}
