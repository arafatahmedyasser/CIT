/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.*/

package com.intellectdesign.canvas.vdf;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
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
import com.intellectdesign.canvas.constants.export.ExportFwsConstants;
import com.intellectdesign.canvas.constants.listviews.ListViewConstants;
import com.intellectdesign.canvas.data.conversion.util.HashMapToJSONConverter;
import com.intellectdesign.canvas.data.conversion.util.JSONObjectBuilderForExtJs;
import com.intellectdesign.canvas.data.conversion.util.JSONToHashMapConverter;
import com.intellectdesign.canvas.data.conversion.util.OnlineJSONToHashmapConverter;
import com.intellectdesign.canvas.datahandler.RequestParamsHandler;
import com.intellectdesign.canvas.exceptions.action.OrbiActionException;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.exceptions.util.JSONConvertorException;
import com.intellectdesign.canvas.exportdata.IExportDataProvider;
import com.intellectdesign.canvas.exportdata.IExportDataValueObject;
import com.intellectdesign.canvas.exportdata.SimpleExportDataColumnHeaderValueObject;
import com.intellectdesign.canvas.exportdata.SimpleExportDataValueObject;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.login.sessions.SessionInfo;
import com.intellectdesign.canvas.login.sessions.SessionManager;
import com.intellectdesign.canvas.pref.date.DateFormatterManager;
import com.intellectdesign.canvas.preference.GlobalPreferencesUtil;
import com.intellectdesign.canvas.properties.MessageManager;
import com.intellectdesign.canvas.utils.StringUtils;
import com.intellectdesign.canvas.sync.ICanvasSyncSupport;
import com.intellectdesign.canvas.viewdefinition.ColumnDefinition;
import com.intellectdesign.canvas.viewdefinition.ColumnPositionComparator;
import com.intellectdesign.canvas.viewdefinition.ViewDefinition;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionConstants;
import com.intellectdesign.canvas.viewdefinition.util.ListViewUtil;
import com.intellectdesign.canvas.web.config.ActionMap;

/**
 * This is the action class for all View definition framework actions
 * 
 * @version 1.0
 */
public class ViewDefinitionAction extends PortletAction implements IExportDataProvider, ICanvasSyncSupport
{
	/**
	 * The default constructor for this action
	 */
	public ViewDefinitionAction()
	{
		// Nothing to do here.
	}

	/**
	 * This is called from the base class to process a particular action
	 * 
	 * @see com.intellectdesign.iportal.ws.framework.PortletAction#executePortletActionUsing(java.lang.String,
	 *      com.orbidirect.sessionmanager.SessionInfo, com.intellectdesign.canvas.actionmap.ActionMap, java.util.Map,
	 *      javax.servlet.http.HttpServletRequest)
	 */
	@Override
	/**
	 * This method displays the error message 
	 * @param action
	 * @param actionMap
	 * @param sessionInfo
	 * @param requestParams
	 * @return request
	 * @throws OrbiActionException
	 */
	public ReplyObject executePortletActionUsing(String action, SessionInfo sessionInfo, ActionMap actionMap,
			Map requestParams, HttpServletRequest request) throws OrbiActionException
	{
		ReplyObject reply = null;
		JSONObjectBuilderForExtJs builder = new JSONObjectBuilderForExtJs();
		try
		{
			LOGGER.ctdebug("CTRND00230", action);
			LOGGER.ctdebug("CTRND00231", requestParams);
			if (ViewDefinitionConstants.ACTION_INIT_MULTI_HEADER_ACTION.equals(action))
			{
				reply = executeHostRequest(sessionInfo, actionMap.getHostCode(), requestParams, request);
				LOGGER.ctdebug("CTRND00232", reply);
				// Convert the response as a View Header map.
				builder.buildMultiWidgetDefinitionHeaderMap(reply);
			} else if (ViewDefinitionConstants.ACTION_INIT_HEADER_ACTION.equals(action))
			{
				fetchToolsFromCache(requestParams, request);
				reply = executeHostRequest(sessionInfo, actionMap.getHostCode(), requestParams, request);
				LOGGER.ctdebug("CTRND00233", reply);
				// Convert the response as a View Header map.
				builder.buildViewDefinitionHeaderMap(reply);
			} else if (ViewDefinitionConstants.ACTION_INIT_ACTION.equals(action))
			{
				/**
				 * Its found that INIT_ACTION is already used for User Preferences launch, Hence Client code has changed
				 * to send INIT_DATA_ACTION as value for INPUT_ACTION. However our application layer code expects value
				 * as INIT_ACTION, Hence changing value.
				 */
				requestParams.put(ViewDefinitionConstants.INPUT_ACTION, "INIT_ACTION");

				reply = executeHostRequest(sessionInfo, actionMap.getHostCode(), requestParams, request);
				LOGGER.ctdebug("CTRND00234", reply);
				// Call a helper method that will do the necessary processing
				// for the init action response.
				processInitActionResponse(reply, request);

				// Convert the response to a list view result JSON map.
				builder.buildViewDefinitionDataMap(reply);
			} else if (ViewDefinitionConstants.ACTION_PRINT.equals(action))
			{
				reply = executeHostRequest(sessionInfo, actionMap.getHostCode(), requestParams, request);
				LOGGER.ctdebug("CTRND00235", reply);
				// Call a helper method that will do the necessary processing
				// for the init action response.
				processInitActionResponse(reply, request);

				// Convert the response to a list view result JSON map.
				builder.buildViewDefinitionDataMap(reply);

			} else if (ViewDefinitionConstants.GET_WIDGET_METADATA.equals(action))
			{
				reply = executeHostRequest(sessionInfo, actionMap.getHostCode(), requestParams, request);
				LOGGER.ctdebug("CTRND00236", reply);
			}

			else if (ViewDefinitionConstants.ACTION_INIT_VIEW.equals(action))
			{

				reply = executeHostRequest(sessionInfo, actionMap.getHostCode(), requestParams, request);
				LOGGER.ctdebug("CTRND00237", reply);
				// Convert the response as a View Header map.
				builder.buildViewDefinitionHeaderMap(reply);
			} else if (ViewDefinitionConstants.ACTION_PREF_SAVE_NEW.equals(action))
			{

				reply = executeHostRequest(sessionInfo, actionMap.getHostCode(), requestParams, request);
				LOGGER.ctdebug("CTRND00238", reply);
				// Convert the response as a View Header map.
				JSONObjectBuilderForExtJs.buildFormResultMap(reply);
			} else if (ViewDefinitionConstants.ACTION_PREF_SAVE.equals(action))
			{

				reply = executeHostRequest(sessionInfo, actionMap.getHostCode(), requestParams, request);
				LOGGER.ctdebug("CTRND00239", reply);
				// Convert the response as a View Header map.
				JSONObjectBuilderForExtJs.buildFormResultMap(reply);
			} else if (ViewDefinitionConstants.ACTION_PREF_DELETE.equals(action))
			{

				reply = executeHostRequest(sessionInfo, actionMap.getHostCode(), requestParams, request);
				LOGGER.ctdebug("CTRND00240", reply);
				// Convert the response as a View Header map.
				JSONObjectBuilderForExtJs.buildFormResultMap(reply);
			}

			else if (ViewDefinitionConstants.ACTION_APPSTORE_INIT_ACTION.equals(action))
			{
				/**
				 * Handling ACTION_APPSTORE_INIT_ACTION.
				 * */
				reply = executeHostRequest(sessionInfo, actionMap.getHostCode(), requestParams, request);
				LOGGER.ctdebug("CTRND00241", reply);
				/**
				 * Convert the header map from reply object and add it to reply object as JSON string.
				 * */
				JSONObjectBuilderForExtJs.buildFormResultMap(reply);
			} else if (ViewDefinitionConstants.ACTION_APPSTORE_SAVE.equals(action))
			{
				/**
				 * Handling ACTION_APPSTORE_SAVE.
				 * */
				reply = executeHostRequest(sessionInfo, actionMap.getHostCode(), requestParams, request);
				/**
				 * Invalidate the workspace and workspace menu items fram cache after successfully inserted a new
				 * workspace.
				 * */
				if (reply.sErrTxn == null || reply.sErrTxn.length == 0)
				{
					CacheManager cacheManager = CacheManager.getFWInstance();
					cacheManager.invalidateCache(FrameworkConstants.APP_MENU_ITEMS_META);

					cacheManager.invalidateCache(request.getSession(),

					FrameworkConstants.ENTL_MENU_ITEMS_META);

					cacheManager.invalidateCache(request.getSession(), FrameworkConstants.WORKSPACE_META_DATA);
					List<Map<String, Object>> wsList = new ArrayList<Map<String, Object>>();
					wsList = cacheManager.getDataFromCache(request.getSession(), FrameworkConstants.WORKSPACE_META_DATA);
					ExtReplyObject actionReplyObject = (ExtReplyObject) reply;
					Map replyMap = actionReplyObject.headerMap;
					String workspaceId=null;
					if (replyMap != null)
					{
						workspaceId=(String) replyMap.get("WORKSPACE_ID");
					}
					Map ws = wsList.get(0);
					ArrayList workspaces = (ArrayList) ws.get("WORKSPACES");
					for (int i = 0; i < workspaces.size(); i++){
						Map wsListObject =(Map) workspaces.get(i);
						if(wsListObject.get("WORKSPACE_ID").equals(workspaceId)){
							actionReplyObject.headerMap.put("WORKSPACE", wsListObject);
							break;
						}
					}	
				}

				LOGGER.ctdebug("CTRND00242", reply);
				/**
				 * Convert the header map from reply object and add it to reply object as JSON string.
				 * */
				JSONObjectBuilderForExtJs.buildFormResultMap(reply);
			} else if (ViewDefinitionConstants.ACTION_APPSTORE_DELETE.equals(action))
			{
				/**
				 * Handling ACTION_APPSTORE_DELETE.
				 * */
				reply = executeHostRequest(sessionInfo, actionMap.getHostCode(), requestParams, request);

				/**
				 * Invalidate the workspace and workspace menu items from cache after successfully deleted a workspace.
				 * */
				if (reply.sErrTxn == null || reply.sErrTxn.length == 0)
				{
					CacheManager cacheManager = CacheManager.getFWInstance();
					cacheManager.invalidateCache(FrameworkConstants.APP_MENU_ITEMS_META);

					cacheManager.invalidateCache(request.getSession(),

					FrameworkConstants.ENTL_MENU_ITEMS_META);

					cacheManager.invalidateCache(request.getSession(), FrameworkConstants.WORKSPACE_META_DATA);
				}

				LOGGER.ctdebug("CTRND00243", reply);
				/**
				 * Convert the header map from reply object and add it to reply object as JSON string.
				 * */
				JSONObjectBuilderForExtJs.buildFormResultMap(reply);
			}

			else if (ViewDefinitionConstants.ACTION_CLEAR_EHCACHE_DATA.equals(action))
			{
				requestParams.put(ViewDefinitionConstants.INPUT_SESSION_ID, sessionInfo.getSessionID());
				reply = executeHostRequest(sessionInfo, actionMap.getHostCode(), requestParams, request);
				LOGGER.ctdebug("CTRND00244", reply);
				// Convert the response as a View Header map.
				JSONObjectBuilderForExtJs.buildFormResultMap(reply);
			}

			else
			{
				// For all other non supported actions, throw an exception.
				throw new OrbiActionException(FrameworkConstants.ERROR_SYSTEM_ERROR,
						"Non-supported action in ViewDefinitionAction.executePortletActionUsing. Action in question is - '"
								+ action + "'.");
			}
			LOGGER.ctdebug("CTRND00245", reply);
		} catch (ProcessingErrorException procExcep)
		{
			LOGGER.cterror("CTRND00246", procExcep, action);
			throw new OrbiActionException(FrameworkConstants.ERROR_SYSTEM_ERROR,
					"Received processing error while handling action - '" + action + "in ViewDefinition action",
					procExcep);
		}
		LOGGER.ctdebug("CTRND00247", reply);
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
				ViewDefinitionConstants.CACHE_KEY_APP_TOOLS_MAP);
		requestParams.put(ViewDefinitionConstants.APPLICABLE_TOOLS, toolsChannelMap);
	}

	/**
	 * This is a helper method that processes the response for init action. This action fetches data for a view. Now
	 * along with the data, there can be additional data that is sent back by the request handler. There are cache
	 * related keys that may be present in the response. If such a key is present, then the data in the additional data
	 * is added to the session under the cache key provided.
	 * 
	 * @param reply The reply object provided by the Request handler
	 * @param request The servlet request
	 */
	private void processInitActionResponse(ReplyObject reply, HttpServletRequest request)
	{
		ExtReplyObject extReply = (ExtReplyObject) reply;
		HashMap headerMap = extReply.headerMap;
		HashMap addnData = null;
		String cacheKey;
		Object cacheData;
		if (headerMap != null)
		{
			// Check if there is additional data key.
			if (headerMap.containsKey(ViewDefinitionConstants.HEADER_KEY_ADDITIONAL_DATA))
			{
				addnData = (HashMap) headerMap.get(ViewDefinitionConstants.HEADER_KEY_ADDITIONAL_DATA);
				if (addnData != null)
				{
					cacheKey = (String) addnData.get(ViewDefinitionConstants.KEY_CACHE_KEY);
					if (!isNullOrEmpty(cacheKey))
					{
						cacheData = addnData.get(ViewDefinitionConstants.KEY_CACHE_DATA);
						request.getSession(false).setAttribute(cacheKey, cacheData);
						// Remove the cache key and the cache data from
						// additional data as we dont want it to be sent to
						// the client.
						addnData.remove(ViewDefinitionConstants.KEY_CACHE_DATA);
						addnData.remove(ViewDefinitionConstants.KEY_CACHE_KEY);
					}
				}
			}
		}
	}

	/**
	 * Helper method to check if a string provided is present or not
	 * 
	 * @param str The string to be validated
	 * @return true if the string is empty. false otherwise
	 */
	private boolean isNullOrEmpty(String str)
	{
		return ((str == null) || ("".equals(str)));
	}

	/**
	 * Intended to communicate with Handler and gets View Data
	 * 
	 * @return IExportDataValueObject
	 * @see com.intellectdesign.iportal.services.exportdata.IExportDataProvider#getExportData(javax.servlet.http.HttpServletRequest,
	 *      com.intellectdesign.canvas.actionmap.ActionMap)
	 */
	public IExportDataValueObject getExportData(HttpServletRequest request, ActionMap actionMap)
	{
		LOGGER.ctinfo("CTRND00294");
		SessionManager sm = SessionManager.getInstance();
		SessionInfo sessionInfo = sm.getUserSessionInfo(request);
		Map requestParams = new RequestParamsHandler().getParameterSet(request);
		requestParams.put("MODE", request.getAttribute("MODE"));

		updateParams(request, requestParams);

		SimpleExportDataValueObject simpleExportData = getExportData(actionMap, sessionInfo, requestParams, request);
		return simpleExportData;
	}

	/**
	 * This method is used to get the ExportData
	 * 
	 * @param actionMap
	 * @param sessionInfo
	 * @param requestParams
	 * @return SimpleExportDataValueObject
	 */
	public SimpleExportDataValueObject getExportData(ActionMap actionMap, SessionInfo sessionInfo, Map requestParams,
			HttpServletRequest request)
	{
		String viewId = (String) requestParams.get("VIEW_ID");

		String groupHeaderReqd = (String) (requestParams.get(ViewDefinitionConstants.GROUP_HEADER_REQD) == null ? FrameworkConstants.NO_N
				: requestParams.get(ViewDefinitionConstants.GROUP_HEADER_REQD));

		String bundleKey = ExportFwsConstants.CUSER;
		if (requestParams.get(ExportFwsConstants.WID_BUNDLE_KEY) != null)
		{
			bundleKey = (String) requestParams.get(ExportFwsConstants.WID_BUNDLE_KEY);
		}

		LOGGER.ctdebug("CTRND00248", bundleKey);

		SimpleExportDataValueObject simpleExportData = null;
		try
		{
			ExtReplyObject reply = executeHostRequest(sessionInfo, actionMap.getHostCode(), requestParams, request);
			List<HashMap<String, Object>> listViewData = (List) reply.headerMap
					.get(ViewDefinitionConstants.HEADER_KEY_VIEW_DATA);
			ViewDefinition viewDef = (ViewDefinition) reply.headerMap
					.get(ViewDefinitionConstants.HEADER_KEY_VIEW_METADATA);

			/**
			 * Update the widget's column properties state to ViewDefinition object.
			 */
			viewDef = updateViewDefinitionColumnState(viewDef, requestParams);

			LOGGER.ctdebug("CTRND00249", listViewData);
			LOGGER.ctdebug("CTRND00250", requestParams);
			ListViewUtil lUtil = new ListViewUtil();
			String dateStrVal = null;
			String dateStrFormattedVal = null;
			Date dateFormat = null;
			ArrayList<ColumnDefinition> arrColumnsList = viewDef.getListColumns();
			arrColumnsList = (ArrayList<ColumnDefinition>) getColumnsAvailableForCurrentDevice(arrColumnsList,
					sessionInfo.deviceType);

			ArrayList arrGroupedColList = new ArrayList();
			ArrayList listGrpHeaders = new ArrayList();
			if (groupHeaderReqd.equals("Y"))
			{
				ArrayList tempColList = new ArrayList();
				ArrayList tempChildColList = new ArrayList();
				ArrayList arrParentColList = new ArrayList();
				ArrayList tempChildHeader = new ArrayList();
				if (arrColumnsList != null && !arrColumnsList.isEmpty())
				{
					for (int i = 0; i < arrColumnsList.size(); i++)
					{
						ColumnDefinition colDefinition = arrColumnsList.get(i);
						if (colDefinition.getParentColumnId().isEmpty())
						{
							tempColList.add(colDefinition);
						} else
						{
							tempChildColList.add(colDefinition);
							arrParentColList.add(colDefinition.getParentColumnId());
						}
					}
					for (int i = 0; i < tempColList.size(); i++)
					{
						ColumnDefinition colDefinition = (ColumnDefinition) tempColList.get(i);
						String colId = colDefinition.getColumnId();
						boolean isChild = false;
						for (int j = 0; j < tempChildColList.size(); j++)
						{
							ColumnDefinition colChildDefinition = (ColumnDefinition) tempChildColList.get(j);
							String colChildId = colChildDefinition.getParentColumnId();
							if (colId.equals(colChildId))
							{
								arrGroupedColList.add(colChildDefinition);
								tempChildHeader.add(colChildDefinition.getColumnDisplayNameKey());
								isChild = true;
							}
						}
						if (isChild)
						{
							Map tempGrpHeaderMap = new HashMap();
							tempGrpHeaderMap.put(colDefinition.getColumnDisplayNameKey(), tempChildHeader);
							listGrpHeaders.add(tempGrpHeaderMap);
						} else
						{
							arrGroupedColList.add(colDefinition);
							listGrpHeaders.add(colDefinition.getColumnDisplayNameKey());
						}
					}
				}
			}

			ArrayList<String> arrDisplayColumnsList = new ArrayList<String>();
			SimpleExportDataColumnHeaderValueObject simpleExportDataColumnHeader = null;
			simpleExportData = new SimpleExportDataValueObject();
			simpleExportData.setexportMode((String) requestParams.get("MODE"));

			/**
			 * Set the view name into VO, so that it can be accessed at servlet and assign the filename prefix
			 */
			String viewName = !StringUtils.isEmpty((String) requestParams.get(ViewDefinitionConstants.FLD_VIEW_NAME)) ? (String) requestParams
					.get(ViewDefinitionConstants.FLD_VIEW_NAME) : viewDef.getViewName();
			LOGGER.ctdebug("CTRND00251", viewName);
			LOGGER.ctdebug("CTRND00252", viewDef.getGCIF(), viewDef.getUserNumber());
			simpleExportData.setFileNamePrefix(viewName);

			simpleExportData.setLocalizationRequiredForFileName(viewDef.isPreDefinedView());

			if (groupHeaderReqd.equals("Y"))
			{
				simpleExportData.setGroupColumnHeader(listGrpHeaders);
			}

			// Get the current date and convert it into the user preferred time
			// zone.
			String userTimezoneCode = (String) requestParams.get(ListViewConstants.USER_PREFEERENCE_TIMEZONE_FORMAT);
			Date currDate = new Date();

			GlobalPreferencesUtil gpUtil = new GlobalPreferencesUtil();
			String lastUpdatedDate = gpUtil.userPrefFormatDateAndTime(
					DateFormatterManager.getJavaDateFormat(sessionInfo.mDateFormat) + " " + sessionInfo.timeFormat,
					sessionInfo.mTimeZoneId, currDate);

			LOGGER.ctdebug("CTRND00253", userTimezoneCode, lastUpdatedDate);

			HashMap additionalData = (HashMap) reply.headerMap.get(ViewDefinitionConstants.HEADER_KEY_ADDITIONAL_DATA);
			String langCode = sessionInfo.mLanguage;
			LOGGER.ctdebug("CTRND00254", sessionInfo.mDateFormat, lastUpdatedDate, sessionInfo.mTimeZoneId);
			String lastUpdateMsg = MessageManager.getMessage("cuser", "LBL_LAST_UPDATED_AS_OF", langCode);
			additionalData.put(ViewDefinitionConstants.HEADER_KEY_LAST_UPDATED_DATE_MSG, lastUpdateMsg);
			additionalData.put(ViewDefinitionConstants.HEADER_KEY_LAST_UPDATED_DATE_TIME, lastUpdatedDate);
			additionalData.put(ListViewConstants.FLD_CURRENCY_CD, requestParams.get(ListViewConstants.FLD_CURRENCY_CD));
			if ("true".equals(requestParams.get("IS_DATE_FILTER_FORM")))
			{
				additionalData.put("FILTER_DATE_FIELD", requestParams.get("FILTER_DATE_FIELD"));
				additionalData.put("FILTER_DATE_VALUE_DATE", requestParams.get("FILTER_DATE_VALUE_DATE"));
				additionalData.put("FILTER_DATE_VALUE_DATE2", requestParams.get("FILTER_DATE_VALUE_DATE2"));
			}
			LOGGER.ctdebug("CTRND00255", additionalData);
			simpleExportData.addExportAdditionalData(additionalData);

			Iterator<ColumnDefinition> columnIterator;
			if (groupHeaderReqd.equals(FrameworkConstants.YES_Y))
			{
				columnIterator = arrGroupedColList.iterator();
			} else
			{
				columnIterator = arrColumnsList.iterator();
			}

			String strHidden = null;
			String strColHeaderType = null;
			String formatedDate = "";
			// Include grouped by columns as separate columns in the exported

			ArrayList<ColumnDefinition> arrGroupsList = viewDef.getOrderedGroupColumns();
			for (ColumnDefinition columnDef : arrGroupsList)
			{
				strColHeaderType = headerTypeMap.get(columnDef.getDataType());
				if (additionalData.get("MODIFIED_COLUMN_NAMES") != null && ((HashMap) additionalData.get("MODIFIED_COLUMN_NAMES")).get(columnDef.getColumnId()) != null)
				{
					simpleExportDataColumnHeader = new SimpleExportDataColumnHeaderValueObject(columnDef.getColumnId(),
							(String) ((HashMap) additionalData.get("MODIFIED_COLUMN_NAMES")).get(columnDef
									.getColumnId()), strColHeaderType);
				} else
				{
					simpleExportDataColumnHeader = new SimpleExportDataColumnHeaderValueObject(columnDef.getColumnId(),
							columnDef.getColumnDisplayNameKey(), strColHeaderType);
				}
				
				strHidden = columnDef.getStrHidden();
				if(columnDef.getColumnId().equals(ListViewConstants.CONTEXT))
					continue;
				simpleExportData.addColumnHeader(simpleExportDataColumnHeader);
				arrDisplayColumnsList.add(columnDef.getColumnId());
			}

			// Include grouped by columns as separate columns in the exported

			String linkedCurrCol = null;
			String columnId = null;
			HashMap linkedCurrMap = new HashMap();
			while (columnIterator.hasNext())
			{
				ColumnDefinition colDef = columnIterator.next();

				if (colDef.getDataType().equals("float") && !colDef.getLinkedSourceCcy().equals(""))
				{
					columnId = colDef.getColumnId();
					linkedCurrCol = colDef.getLinkedSourceCcy();

					linkedCurrMap.put(columnId, linkedCurrCol);

				}

				strHidden = colDef.getStrHidden();
				strColHeaderType = headerTypeMap.get(colDef.getDataType());
				LOGGER.ctdebug("CTRND00256", colDef.getDataType(), strColHeaderType);
				if (/* !colDef.isVisible() || */ViewDefinitionConstants.VAL_BOOL_YES.equals(strHidden)
						|| colDef.getColumnId().equals(ListViewConstants.CONTEXT))
					continue;

				if (arrDisplayColumnsList.contains(colDef.getColumnId()))
				{
					continue;
				}
				if (additionalData.get("MODIFIED_COLUMN_NAMES") != null
						&& ((HashMap) additionalData.get("MODIFIED_COLUMN_NAMES")).get(colDef.getColumnId()) != null)
				{
					simpleExportDataColumnHeader = new SimpleExportDataColumnHeaderValueObject(colDef.getColumnId(),
							(String) ((HashMap) additionalData.get("MODIFIED_COLUMN_NAMES")).get(colDef.getColumnId()),
							strColHeaderType);
				} else
				{
					simpleExportDataColumnHeader = new SimpleExportDataColumnHeaderValueObject(colDef.getColumnId(),
							colDef.getColumnDisplayNameKey(), strColHeaderType);
				}
				simpleExportData.addColumnHeader(simpleExportDataColumnHeader);
				arrDisplayColumnsList.add(colDef.getColumnId());
			}

			simpleExportData.addLinkedCurrData(linkedCurrMap);
			LOGGER.ctdebug("CTRND00257", linkedCurrMap);

			LOGGER.ctdebug("CTRND00258", arrDisplayColumnsList);
			Iterator rowsIterator = listViewData.iterator();
			SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
			while (rowsIterator.hasNext())
			{
				HashMap<String, Object> hmDataMap = (HashMap<String, Object>) rowsIterator.next();
				LOGGER.ctdebug("CTRND00259", hmDataMap);
				HashMap<String, Object> hmDisplayDataMap = new HashMap<String, Object>();
				Iterator<String> displayColumnsIterator = arrDisplayColumnsList.iterator();
				while (displayColumnsIterator.hasNext())
				{
					String colId = displayColumnsIterator.next();
					LOGGER.ctdebug("CTRND00260", colId, hmDataMap.get(colId));
					if (lUtil.isDateField(viewId, colId))
					{
						Object dateTemp = hmDataMap.get(colId);
						Class dateClass = Date.class;
						if (dateTemp != null && dateClass.isInstance(dateTemp))
						{
							dateFormat = (Date) dateTemp;
							formatedDate = gpUtil.userPrefFormatDate(sessionInfo.mDateFormat, sessionInfo.mTimeZoneId,
									dateFormat);
						} else
						{
							dateStrVal = (String) hmDataMap.get(colId);
							if (dateStrVal != null && !"".equals(dateStrVal))
							{
								dateStrFormattedVal = dateStrVal;
								LOGGER.ctdebug("CTRND00261", dateStrFormattedVal);
								try
								{
									dateFormat = formatter.parse(dateStrFormattedVal);
									formatedDate = gpUtil.userPrefFormatDate(sessionInfo.mDateFormat,
											sessionInfo.mTimeZoneId, dateFormat);

									LOGGER.ctdebug("CTRND00262", dateFormat);
								} catch (ParseException e)
								{
									LOGGER.ctdebug("CTRND00263", dateStrFormattedVal);
									formatedDate = dateStrFormattedVal;
								}
							} else
							{
								formatedDate = "";
							}
						}

						hmDisplayDataMap.put(colId, formatedDate);
					} else if (lUtil.isTimeField(viewId, colId))
					{
						dateStrVal = (String) hmDataMap.get(colId);
						if (dateStrVal != null && !"".equals(dateStrVal))
						{
							dateStrFormattedVal = dateStrVal;
							LOGGER.ctdebug("CTRND00264", dateStrFormattedVal);
							formatedDate = gpUtil.formatUserPrefDateTime(dateStrFormattedVal,
									DateFormatterManager.getJavaDateFormat(sessionInfo.mDateFormat) + " "
											+ sessionInfo.timeFormat);
							LOGGER.ctdebug("CTRND00265", formatedDate);
						} else
						{
							formatedDate = "";
						}

						hmDisplayDataMap.put(colId, formatedDate);

					} else if (lUtil.isNumberField(viewId, colId))
					{
						// This is an amount column. Ensure that the amount is
						// formatted to 2 decimal places at the minimum
						hmDisplayDataMap.put(colId, (hmDataMap.get(colId) != null) ? hmDataMap.get(colId)
								: new Float(0));
					}
					else if (lUtil.isTransalateValueField(viewId, colId))
					{
						// This is an amount column. Ensure that the amount is
						// formatted to 2 decimal places at the minimum
						hmDisplayDataMap.put(colId,MessageManager.getMessage(viewDef.getBundleKey(), "LBL_"+(String)hmDataMap.get(colId), langCode,true));
					}
					else
					{

						hmDisplayDataMap.put(colId, (hmDataMap.get(colId) != null) ? hmDataMap.get(colId) : "");

					}
				}
				simpleExportData.addExportData(hmDisplayDataMap);
			}
			LOGGER.ctdebug("CTRND00266", simpleExportData.getExportData());
			LOGGER.ctdebug("CTRND00267", simpleExportData.getColumnHeaders());
			simpleExportData.setReportId(viewDef.getSystemViewID());

			boolean isSystemView = viewDef.isPreDefinedView();

			if (isSystemView)
			{

				simpleExportData.setReportHeader(MessageManager.getMessage(bundleKey, viewName, langCode,
						true));
			} else
			{

				simpleExportData.setReportHeader(viewName); // To Change the Header
			}

			if (groupHeaderReqd.equals(FrameworkConstants.YES_Y))
			{
				simpleExportData.setGroupHeaderReqd(groupHeaderReqd);
			}

		} catch (ProcessingErrorException e)
		{
			LOGGER.cterror("CTRND00268", e);
		}
		LOGGER.ctinfo("CTRND00297");
		return simpleExportData;
	}

	private static Logger LOGGER = Logger.getLogger(ViewDefinitionAction.class);
	// Intended to maintain view definition column type and
	// Export services understandable column type format
	private static Map<String, String> headerTypeMap = new HashMap<String, String>();
	static
	{
		headerTypeMap.put(ViewDefinitionConstants.DATA_TYPE_NUMBER, "N");
		headerTypeMap.put(ViewDefinitionConstants.DATA_TYPE_INTEGER, "I");
		headerTypeMap.put(ViewDefinitionConstants.DATA_TYPE_DATE, "D");
		headerTypeMap.put(ViewDefinitionConstants.DATA_TYPE_TIMESTAMP, "T");
		headerTypeMap.put(ViewDefinitionConstants.DATA_TYPE_NUMBER_EQ_CCY, "N");
		headerTypeMap.put("", "");
		headerTypeMap.put(null, "");
	}

	/**
	 * This method update the ViewDefintion's ColumnDefintion object with the widget's column properties which is
	 * updated in UI by the user.
	 * 
	 * @param viewDef - ViewDefintion Object
	 * @param requestParams - Contains the ViewId, Widget State object's Column Properties.
	 * @return ViewDefinition
	 */
	protected ViewDefinition updateViewDefinitionColumnState(ViewDefinition viewDef, Map requestParams)
	{

		/**
		 * Step 1: Get the ColumnDefinition State properties from the requestParams
		 */
		String colPropertites = (String) requestParams.get(ViewDefinitionConstants.COLUMN_PROPERTIES);
		ArrayList reqColumnList = null;
		if (colPropertites != null && !colPropertites.isEmpty())
		{
			String columnJSON = "{" + "'" + ViewDefinitionConstants.COLUMN_PROPERTIES + "'" + ":" + colPropertites
					+ "}";
			JSONToHashMapConverter jsonConverter = new OnlineJSONToHashmapConverter();
			try
			{
				HashMap columnDefMap = jsonConverter.convert(columnJSON);
				reqColumnList = (ArrayList) columnDefMap.get(ViewDefinitionConstants.COLUMN_PROPERTIES);
			} catch (JSONConvertorException e)
			{
			}
		}

		/**
		 * Step 2: Get the ColumnDefinition List from the ViewDefinition Object.
		 */
		ArrayList columnDefList = viewDef.getListColumns();

		/**
		 * Step 3: Set the ColumnDefiniton properties from state object to the ViewDefinition's ColumnDefinition Object
		 */
		if (reqColumnList != null && !reqColumnList.isEmpty() && columnDefList != null && columnDefList.size() > 0)
		{
			for (int index = 0; index < reqColumnList.size(); index++)
			{

				Map colProp = (Map) reqColumnList.get(index);
				String dataIndex = (String) colProp.get("_dataindex");

				for (int colDefIndex = 0; colDefIndex < columnDefList.size(); colDefIndex++)
				{
					ColumnDefinition colDef = (ColumnDefinition) columnDefList.get(colDefIndex);

					// If dataIndex is equal then 'set' the state object column porperties to ViewDefinition's
					// ColumnDefinition
					// and then 'break' the loop to process the next column.
					if (dataIndex != null && dataIndex.equals(colDef.getColumnId()))
					{
						/**
						 * Step 3.1: Hidden Indicator updating to viewdefinition's columnDefinition object.
						 */
						boolean hidden = ((String) colProp.get("_hidden"))
								.equalsIgnoreCase(ViewDefinitionConstants.VAL_BOOL_YES) ? true : false;
						((ColumnDefinition) columnDefList.get(colDefIndex)).setHidden(hidden);
						/**
						 * Step 3.2: Column position value updating to viewdefinition's columnDefinition object.
						 */
						String position = (String) colProp.get("_position");
						((ColumnDefinition) columnDefList.get(colDefIndex)).setPosition(Integer.parseInt(position));

						break;
					}
				} // inner for-loop end
			} // outer for-loop end

			/**
			 * Step 4: Sort the ColumnDefinitions objects by the column position comparator.
			 */
			Collections.sort(columnDefList, new ColumnPositionComparator());
			/**
			 * Step 5: Update the ColumnDefinition to ViewDefinition Object.
			 */
			viewDef.setListColumns(columnDefList);
		} // if condition closed.

		/**
		 * Step 6: Return the State updated ViewDefinition object to process.
		 */
		return viewDef;
	}

	/**
	 * 
	 * @param columnList
	 * @return
	 */
	private List<ColumnDefinition> getColumnsAvailableForCurrentDevice(ArrayList<ColumnDefinition> columnList,
			String deviceType)
	{
		List<ColumnDefinition> channelBasedColumnList = new ArrayList<ColumnDefinition>();
		for (int colIndex = 0; colIndex < columnList.size(); colIndex++)
		{
			ColumnDefinition colDef = columnList.get(colIndex);
			if ("A".equals(colDef.getChannelId()) || deviceType.equals(colDef.getChannelId()))
			{
				channelBasedColumnList.add(colDef);
			}
		}
		// Sort the columns by the column position comparator
		Collections.sort(channelBasedColumnList, new ColumnPositionComparator());
		return channelBasedColumnList;
	}
	/**
	 * This method is intended to to validate the list of keys in sync with the server time that were provided
	 * especially widget and multiWidget data
	 * 
	 * @param keys The map having the keys as provided by the client. The exact keys will be as per what the client
	 *            sends for this module
	 * @param request
	 * @return The Array of matched meta data structures provided as JSON objects inside JSON Array
	 * @throws ProcessingErrorException
	 * @see com.intellectdesign.canvas.sync.ICanvasSyncSupport#getSyncData(java.util.Map,
	 *      javax.servlet.http.HttpServletRequest)
	 */
	@Override
	public JSONArray validateSyncList(Map keys, HttpServletRequest request) throws ProcessingErrorException,
			JSONException
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
		LOGGER.ctdebug("CTRND00434", requestParams);
		JSONArray jsArray = null;
		List syncList = null;
		try
		{
			SessionManager mSessionMan = SessionManager.getInstance();
			sessionInfo = mSessionMan.getUserSessionInfo(request);
			reply = executeHostRequest(sessionInfo, "SYNCMD", requestParams, request);
			LOGGER.ctdebug("CTRND00435", reply);
			replyMap = retriveReplyMap(reply);
			syncList = (List) replyMap.get(FrameworkConstants.SyncMetadataConstants.SYNC_METADATA.getName());
			jsArray = new JSONArray(syncList);
		} catch (ProcessingErrorException procExp)
		{
			LOGGER.cterror("CTRND00436", procExp);
			throw procExp;
		}
		LOGGER.ctdebug("CTRND00438", jsArray);
		return jsArray;
	}
	/**
	 * This method is intended to get the latest version of the meta data in sync which is based on the keys that were
	 * provided especially widget and multiWidget data
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
		ReplyObject viewreply = null;
		SessionInfo sessionInfo = null;
		JSONArray jsArray = null;
		Map replyMap = null;
		Map viewaddDataMap = null;
		String widgetId = null;
		Map requestParams = new HashMap();
		Map exclusiveParams = new HashMap();
		HashMap multiWidgetChildMetaMap = null;
		List viewaddDataList = new ArrayList();
		List multiWidgetChildMetaList = null;
		try
		{
			LOGGER.ctdebug("CTRND00450", keys);
			String type = (String) keys.get(FrameworkConstants.SyncMetadataConstants.ATTR_TYPE.getName());
			ArrayList<String> idList = (ArrayList<String>) keys.get(FrameworkConstants.SyncMetadataConstants.ATTR_KEYS
					.getName());
			SessionManager mSessionMan = SessionManager.getInstance();
			sessionInfo = mSessionMan.getUserSessionInfo(request);
			String hostCode = "VIEWDEFN";
			requestParams.put("__LISTVIEW_REQUEST", "Y");
			requestParams.put(JSPIOConstants.INPUT_FUNCTION_CODE, "VSBLTY");
			requestParams.put(JSPIOConstants.INPUT_SUB_PRODUCT, "CANVAS");
			requestParams.put(FrameworkConstants.PAGE_CODE_TYPE, "VDF_CODE");
			requestParams.put(JSPIOConstants.PRODUCT_NAME, "CANVAS");
			if ("MULTI_WIDGET".equals(type))
			{
				exclusiveParams.put(JSPIOConstants.INPUT_ACTION,
						ViewDefinitionConstants.ACTION_INIT_MULTI_HEADER_ACTION);
				exclusiveParams.putAll(requestParams);
				ArrayList<HashMap> chlidWgtList = null;
				for (String multiWgtId : idList)
				{
					viewaddDataMap = new HashMap();
					exclusiveParams.put(ViewDefinitionConstants.PARAM_WIDGET_ID, multiWgtId);
					LOGGER.ctdebug("CTRND00451", exclusiveParams);
					viewreply = executeHostRequest(sessionInfo, hostCode, exclusiveParams, request);
					LOGGER.ctdebug("CTRND00452", viewreply);
					replyMap = retriveReplyMap(viewreply);
					chlidWgtList = (ArrayList<HashMap>) replyMap
							.get(ViewDefinitionConstants.HEADER_MULTI_WIDGETS_CHILDREN);
					viewaddDataMap.put(FrameworkConstants.SyncMetadataConstants.ATTR_UNIQUE.getName(), multiWgtId);
					viewaddDataMap.put(FrameworkConstants.SyncMetadataConstants.ATTR_VALUE.getName(), replyMap);
					multiWidgetChildMetaList = new ArrayList();
					for (HashMap widgetMetaMap : chlidWgtList)
					{
						try
						{
							widgetId = (String) widgetMetaMap.get(ViewDefinitionConstants.PARAM_WIDGET_ID);
							multiWidgetChildMetaMap = (HashMap) getWidgetMetadata(sessionInfo, hostCode, requestParams,
									request, widgetId);
							multiWidgetChildMetaList.add(multiWidgetChildMetaMap);
						} catch (ProcessingErrorException procExcep)
						{
							LOGGER.cterror("CTRND00453", procExcep, "WIDGET", widgetId);
						}
					}
					if (multiWidgetChildMetaList.size() > 0)
					{
						multiWidgetChildMetaMap = new HashMap();
						multiWidgetChildMetaMap.put(FrameworkConstants.SyncMetadataConstants.ATTR_TYPE.getName(),
								"WIDGET");
						multiWidgetChildMetaMap.put(FrameworkConstants.SyncMetadataConstants.ATTR_DATA.getName(),
								multiWidgetChildMetaList);
						viewaddDataMap.put(FrameworkConstants.SyncMetadataConstants.ATTR_CHILD_WIDGET.getName(),
								multiWidgetChildMetaMap);
						LOGGER.ctdebug("CTRND00454", viewaddDataMap);
					}
					multiWidgetChildMetaList = new ArrayList();
					for (HashMap widgetMetaMap : chlidWgtList)
					{
						try
						{
							widgetId = (String) widgetMetaMap.get(ViewDefinitionConstants.PARAM_WIDGET_ID);
							multiWidgetChildMetaMap = (HashMap) getWidgetContainerMetadata(sessionInfo, hostCode,
									requestParams, request, widgetId);
							multiWidgetChildMetaList.add(multiWidgetChildMetaMap);
						} catch (ProcessingErrorException procExcep)
						{
							LOGGER.cterror("CTRND00455", procExcep, "WIDGET_MD", widgetId);
						}
					}
					if (multiWidgetChildMetaList.size() > 0)
					{
						multiWidgetChildMetaMap = new HashMap();
						multiWidgetChildMetaMap.put(FrameworkConstants.SyncMetadataConstants.ATTR_TYPE.getName(),
								"WIDGET_MD");
						multiWidgetChildMetaMap.put(FrameworkConstants.SyncMetadataConstants.ATTR_DATA.getName(),
								multiWidgetChildMetaList);
						viewaddDataMap.put(FrameworkConstants.SyncMetadataConstants.ATTR_CHILD_WIDGET_MD.getName(),
								multiWidgetChildMetaMap);
						LOGGER.ctdebug("CTRND00456", viewaddDataMap);
					}
					viewaddDataList.add(viewaddDataMap);
				}
				jsArray = new JSONArray(viewaddDataList);
				LOGGER.ctdebug("CTRND00457", jsArray);
			} else if ("WIDGET_MD".equals(type))
			{
				for (String widgetmdId : idList)
				{
					try
					{
						viewaddDataMap = getWidgetContainerMetadata(sessionInfo, hostCode, requestParams, request,
								widgetmdId);
						viewaddDataList.add(viewaddDataMap);
					} catch (ProcessingErrorException procExcep)
					{
						LOGGER.cterror("CTRND00458", procExcep, "WIDGET_MD", widgetmdId);
						throw procExcep;
					}
				}
				jsArray = new JSONArray(viewaddDataList);
				LOGGER.ctdebug("CTRND00459", jsArray);
			} else if ("WIDGET".equals(type))
			{
				for (String id : idList)
				{
					try
					{
						viewaddDataMap = getWidgetMetadata(sessionInfo, hostCode, requestParams, request, id);
						viewaddDataList.add(viewaddDataMap);
					} catch (ProcessingErrorException procExcep)
					{
						LOGGER.cterror("CTRND00460", procExcep, "WIDGET", id);
						throw procExcep;
					}
				}
				jsArray = new JSONArray(viewaddDataList);
				LOGGER.ctdebug("CTRND00461", jsArray);
			} else if ("WIDGET_CUSTOM".equals(type))
			{
			}
		} catch (ProcessingErrorException procExcep)
		{
			LOGGER.cterror("CTRND00462", procExcep);
			throw procExcep;
		}
		LOGGER.ctdebug("CTRND00463", jsArray);
		return jsArray;
	}
	/**
	 * This private method is responsible to get the widget container metadata for the corresponding widget id
	 * 
	 * @param sessionInfo
	 * @param hostCode
	 * @param requestParams
	 * @param request
	 * @param widgetId
	 * @return Map of widget related metadata
	 * @throws ProcessingErrorException
	 */
	private Map getWidgetContainerMetadata(SessionInfo sessionInfo, String hostCode, Map requestParams,
			HttpServletRequest request, String widgetId) throws ProcessingErrorException
	{
		ReplyObject viewReply = null;
		Map viewaddDataMap = null;
		Map exclusiveParams = new HashMap();
		exclusiveParams.put(JSPIOConstants.INPUT_ACTION, ViewDefinitionConstants.GET_WIDGET_METADATA);
		exclusiveParams.putAll(requestParams);
		exclusiveParams.put(ViewDefinitionConstants.PARAM_WIDGET_ID, widgetId);
		LOGGER.ctdebug("CTRND00464", exclusiveParams);
		viewReply = executeHostRequest(sessionInfo, hostCode, exclusiveParams, request);
		LOGGER.ctdebug("CTRND00465", viewReply);
		Map replyMap = retriveReplyMap(viewReply);
		viewaddDataMap = new HashMap();
		viewaddDataMap.put(FrameworkConstants.SyncMetadataConstants.ATTR_UNIQUE.getName(),
				exclusiveParams.get(ViewDefinitionConstants.PARAM_WIDGET_ID));
		viewaddDataMap.put(FrameworkConstants.SyncMetadataConstants.ATTR_VALUE.getName(),
				replyMap.get(JSONObjectBuilderForExtJs.JSON_MAP));
		return viewaddDataMap;
	}
	/**
	 * This private method is responsible to get the widget metadata for the corresponding widget id
	 * 
	 * @param sessionInfo
	 * @param hostCode
	 * @param requestParams
	 * @param request
	 * @param widgetId
	 * @return Map of widget related metadata
	 * @throws ProcessingErrorException
	 */
	private Map getWidgetMetadata(SessionInfo sessionInfo, String hostCode, Map requestParams,
			HttpServletRequest request, String widgetId) throws ProcessingErrorException
	{
		ReplyObject viewreply = null;
		Map replyMap = new HashMap();
		Map viewaddDataMap = null;
		Map exclusiveParams = new HashMap();
		exclusiveParams.put(JSPIOConstants.INPUT_ACTION, ViewDefinitionConstants.ACTION_INIT_HEADER_ACTION);
		exclusiveParams.putAll(requestParams);
		exclusiveParams.put(ViewDefinitionConstants.PARAM_WIDGET_ID, widgetId);
		fetchToolsFromCache(exclusiveParams, request);
		LOGGER.ctdebug("CTRND00466", exclusiveParams);
		viewreply = executeHostRequest(sessionInfo, hostCode, exclusiveParams, request);
		LOGGER.ctdebug("CTRND00467", viewreply);
		replyMap = retriveReplyMap(viewreply);
		HashMap rowsMap = new HashMap();
		HashMap addMap = new HashMap();
		rowsMap.put(FrameworkConstants.HEADER_KEY_VIEW_METADATA,
				replyMap.get(FrameworkConstants.HEADER_KEY_VIEW_METADATA));
		if (replyMap.containsKey(FrameworkConstants.HEADER_KEY_VIEWS_LIST))
			rowsMap.put(FrameworkConstants.HEADER_KEY_VIEWS_LIST,
					replyMap.get(FrameworkConstants.HEADER_KEY_VIEWS_LIST));
		if (replyMap.containsKey(FrameworkConstants.VIEW_CONTEXT_LIST))
			rowsMap.put(FrameworkConstants.VIEW_CONTEXT_LIST, replyMap.get(FrameworkConstants.VIEW_CONTEXT_LIST));
		if (replyMap.containsKey(FrameworkConstants.HEADER_KEY_REF_CCY_LIST))
			addMap.put(FrameworkConstants.HEADER_KEY_REF_CCY_LIST,
					replyMap.get(FrameworkConstants.HEADER_KEY_REF_CCY_LIST));
		if (replyMap.containsKey(FrameworkConstants.HEADER_KEY_REFERENCE_CCY))
			addMap.put(FrameworkConstants.HEADER_KEY_REFERENCE_CCY,
					replyMap.get(FrameworkConstants.HEADER_KEY_REFERENCE_CCY));
		rowsMap.put(FrameworkConstants.HEADER_KEY_VIEW_ADDITIONAL_META_DATA, addMap);
		viewaddDataMap = new HashMap();
		viewaddDataMap.put(FrameworkConstants.SyncMetadataConstants.ATTR_UNIQUE.getName(),
				exclusiveParams.get(ViewDefinitionConstants.PARAM_WIDGET_ID));
		viewaddDataMap.put(FrameworkConstants.SyncMetadataConstants.ATTR_VALUE.getName(),
				HashMapToJSONConverter.convertHashMapToJSONFormat(rowsMap));
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
