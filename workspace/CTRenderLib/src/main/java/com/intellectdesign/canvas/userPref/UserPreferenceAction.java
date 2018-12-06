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
package com.intellectdesign.canvas.userPref;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.intellectdesign.canvas.action.PortletAction;
import com.intellectdesign.canvas.cache.handler.CacheManager;
import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.common.ReplyObject;
import com.intellectdesign.canvas.common.UserValue;
import com.intellectdesign.canvas.constants.common.FrameworkConstants;
import com.intellectdesign.canvas.constants.login.LoginMasterConstants;
import com.intellectdesign.canvas.constants.preferences.PreferenceConstants;
import com.intellectdesign.canvas.data.conversion.util.JSONObjectBuilderForExtJs;
import com.intellectdesign.canvas.entitlement.EntitlementsHelper;
import com.intellectdesign.canvas.exceptions.action.OrbiActionException;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.login.handlers.LoginActions;
import com.intellectdesign.canvas.login.handlers.LoginManager;
import com.intellectdesign.canvas.login.sessions.SessionInfo;
import com.intellectdesign.canvas.login.sessions.SessionManager;
import com.intellectdesign.canvas.preferences.PreferenceManager;
import com.intellectdesign.canvas.value.IUserValue;
import com.intellectdesign.canvas.value.ListValue;
import com.intellectdesign.canvas.web.config.ActionMap;

/**
 * Class for User preference action which extends Portlet action
 */
public class UserPreferenceAction extends PortletAction
{
	/**
	 * to execute the portlet action
	 * 
	 * @param action
	 * @param sessionInfo
	 * @param actionMap
	 * @param requestParams
	 * @param request
	 * @return ReplyObject
	 * @throws OrbiActionException
	 * @see com.intellectdesign.canvas.action.PortletAction#executePortletActionUsing(java.lang.String,
	 *      com.intellectdesign.canvas.login.sessions.SessionInfo, com.intellectdesign.canvas.web.config.ActionMap,
	 *      java.util.Map, javax.servlet.http.HttpServletRequest)
	 */
	@Override
	public ReplyObject executePortletActionUsing(String action, SessionInfo sessionInfo, ActionMap actionMap,
			Map requestParams, HttpServletRequest request) throws OrbiActionException
	{
		ReplyObject reply = null;
		try
		{

			if (LoginMasterConstants.UPDATE_PREFERENCE.equals(action))
			{
				Map currentPrefData = getCurrentPreferences(sessionInfo);
				requestParams.put("CURRENT_PREF_DATA", currentPrefData);
				if ("N".equals(requestParams.get("TEMP_UPDATE_PREFERENCE_IND")))
				{
					reply = executeHostRequest(sessionInfo, actionMap.getHostCode(), requestParams, request);
					if (reply.sErrTxn == null || reply.sErrTxn.length == 0)
					{
						CacheManager cacheManager = CacheManager.getFWInstance();
						cacheManager.invalidateCache(request.getSession(), FrameworkConstants.WORKSPACE_META_DATA);
						updatePreferenceInSession(sessionInfo, (List) requestParams.get("PREFERENCE_TYPE"),
								(List) requestParams.get("PREFERENCE_VALUES"), false);
					} else
						return reply;
				} else
				{
					CacheManager cacheManager = CacheManager.getFWInstance();
					cacheManager.invalidateCache(request.getSession(), FrameworkConstants.WORKSPACE_META_DATA);
					updatePreferenceInSession(sessionInfo, (List) requestParams.get("PREFERENCE_TYPE"),
							(List) requestParams.get("PREFERENCE_VALUES"), true);
					reply = executeHostRequest(sessionInfo, actionMap.getHostCode(), requestParams, request);
				}

				/**
				 * Convert the header map from reply object and add it to reply object as JSON string.
				 * */
				JSONObjectBuilderForExtJs.buildFormResultMap(reply);

			} else if (LoginMasterConstants.GET_USER_PREF.equals(action))
			{
				reply = executeHostRequest(sessionInfo, actionMap.getHostCode(), requestParams, request);

			} else if (LoginMasterConstants.ACTIVE_TOKEN.equals(action))
			{
				reply = extendSession(request);
			}
		} catch (ProcessingErrorException procExcep)
		{

			throw new OrbiActionException(FrameworkConstants.ERROR_SYSTEM_ERROR,
					"Received processing error while handling action - '" + action + "in User Preference action",
					procExcep);
		}
		return reply;
	}

	/**
	 * This method is used to update preferences in session.
	 * 
	 * @param sessionInfo
	 * @param prefType
	 * @param prefValue
	 * @param tempUpdate
	 */
	private void updatePreferenceInSession(SessionInfo sessionInfo, List prefType, List prefValue, boolean tempUpdate)
			throws ProcessingErrorException
	{
		EntitlementsHelper helper = new EntitlementsHelper();
		UserValue userVal = new UserValue();
		userVal.setUserNo(sessionInfo.userNo);
		userVal.setPrimaryGcif(sessionInfo.primaryGcif);
		userVal.setRoles(sessionInfo.userRole);
		// Invoke the Entitlements implementation for fetching the entitlements!
		// TODO: Need to changes this to a server call.
		IUserValue userValue = helper.getUserPreferences(userVal);

		HashMap prefValues = new HashMap();
		prefValues = userValue.convertToHashMap();
		if (tempUpdate)
		{
			for (int i = 0; i < prefType.size(); i++)
			{
				if ("WORKSPACE".equals(prefType.get(i))
						|| ("USER_ROLE".equals(prefType.get(i)) && "GUEST".equals(prefValue.get(i))))
				{
					prefValues.put(prefType.get(i), prefValue.get(i));
					continue;
				}
				PreferenceManager prefMngr = new PreferenceManager();
				ListValue lvl = prefMngr.getPreferenceValueFor((String) prefType.get(i), (String) prefValue.get(i));
				if (prefType.get(i).equals("TIMEFORMAT"))
				{
					prefValues.put(prefType.get(i), lvl.getDesc());
				} else if (prefType.get(i).equals("AMOUNT"))
				{
					prefValues.put(prefType.get(i), prefValue.get(i));
				} else if (prefType.get(i).equals("DATEFORMAT"))
				{
					prefValues.put(prefType.get(i), prefValue.get(i));
				} else
				{
					prefValues.put(prefType.get(i), lvl.getCode());
				}

				if (prefType.get(i).equals("LANGUAGE"))
				{
					if (lvl.getAdditionalProperties() != null && lvl.getAdditionalProperties().size() > 0)
					{
						prefValues.put(PreferenceConstants.DIRECTION_FORMAT,
								(lvl.getAdditionalProperties().get(PreferenceConstants.DIRECTION_FORMAT)));
					}
				}

			}
		}

		sessionInfo.mLanguage = (String) prefValues.get("LANGUAGE") != null ? (String) prefValues.get("LANGUAGE")
				: sessionInfo.mLanguage;
		sessionInfo.direction = (String) prefValues.get("DIRECTION") != null ? (String) prefValues.get("DIRECTION")
				: sessionInfo.direction;
		sessionInfo.mAmtFormat = (String) prefValues.get("AMOUNT") != null ? (String) prefValues.get("AMOUNT")
				: sessionInfo.mAmtFormat;
		sessionInfo.mDateFormat = (String) prefValues.get("DATEFORMAT") != null ? (String) prefValues.get("DATEFORMAT")
				: sessionInfo.mDateFormat;
		sessionInfo.mSecLang = (String) prefValues.get("SECLANGUAGE") != null ? (String) prefValues.get("SECLANGUAGE")
				: sessionInfo.mSecLang;
		sessionInfo.mEnaSecLang = (String) prefValues.get("ENASECLAN") != null ? (String) prefValues.get("ENASECLAN")
				: sessionInfo.mEnaSecLang;
		sessionInfo.mStartUpWorkSpaceId = (String) prefValues.get("STARTUPWORKSPACEID") != null ? (String) prefValues
				.get("STARTUPWORKSPACEID") : sessionInfo.mStartUpWorkSpaceId;
		sessionInfo.mTimeZoneId = (String) prefValues.get("TIMEZONE") != null ? (String) prefValues.get("TIMEZONE")
				: sessionInfo.mTimeZoneId;
		sessionInfo.equivalentCurrency = (String) prefValues.get("EQUIVALENTCURRENCY") != null ? (String) prefValues
				.get("EQUIVALENTCURRENCY") : sessionInfo.equivalentCurrency;
		sessionInfo.themeId = (String) prefValues.get("THEME") != null ? (String) prefValues.get("THEME")
				: sessionInfo.themeId;
		sessionInfo.fontsizeId = (String) prefValues.get("FONTSIZE") != null ? (String) prefValues.get("FONTSIZE")
				: sessionInfo.fontsizeId;
		sessionInfo.userRole = (String) prefValues.get("USER_ROLE") != null ? (String) prefValues.get("USER_ROLE")
				: sessionInfo.userRole;
		sessionInfo.timeFormat = (String) prefValues.get("TIMEFORMAT") != null ? (String) prefValues.get("TIMEFORMAT")
				: sessionInfo.timeFormat;
		sessionInfo.prefWorkspace = (String) prefValues.get("WORKSPACE") != null ? (String) prefValues.get("WORKSPACE")
				: sessionInfo.prefWorkspace;

	}

	private Map getCurrentPreferences(SessionInfo sessionInfo)
	{
		HashMap prefData = new HashMap();
		prefData.put("FONTSIZE_ID", sessionInfo.fontsizeId);
		prefData.put("TIME_FORMAT", sessionInfo.timeFormat);
		prefData.put("THEME_ID", sessionInfo.themeId);
		prefData.put("DATE_FORMAT", sessionInfo.mDateFormat);
		prefData.put("AMOUNT_FORMAT", sessionInfo.mAmtFormat);
		prefData.put("TIMEZONE", sessionInfo.mTimeZoneId);
		prefData.put("LANGUAGE_ID", sessionInfo.mLanguage);
		prefData.put("WORKSPACE", sessionInfo.prefWorkspace);
		return prefData;
	}

	/**
	 * This method is used to call extendSession method of LoginManager class
	 * 
	 * @param request
	 * @return ExtReplyObject
	 * @throws ProcessingErrorException
	 */
	private ExtReplyObject extendSession(HttpServletRequest request) throws ProcessingErrorException
	{
		SessionManager sessMngr = SessionManager.getInstance();
		SessionInfo sessInfo = sessMngr.getUserSessionInfo(request);
		UserValue userValue = new UserValue();
		LoginManager logMngr = new LoginManager();
		ExtReplyObject extReply = new ExtReplyObject();

		populateUserValue(userValue, sessInfo);
		// Set the action to extend session
		userValue.setTransactionCode(LoginActions.EXTEND_SESSION.toString());
		logMngr.handleRequest(userValue, request, sessInfo);
		HashMap hmap = new HashMap();
		hmap.put("ACTIVE_TOKEN", "SUCCESS");
		extReply.headerMap = new HashMap();
		extReply.headerMap.put("JSON_MAP", hmap);
		return extReply;
	}

	/**
	 * This method populates all the information from session info to user value
	 * 
	 * @param uvalue
	 * @param request
	 */
	private void populateUserValue(UserValue uvalue, SessionInfo sessInfo)
	{
		uvalue.setAmountId(sessInfo.mAmtFormat);
		uvalue.setAuthenticationType(sessInfo.authenticationType);
		uvalue.setChannelId("" + sessInfo.channelId);
		uvalue.setCustomerType(sessInfo.customerType);
		uvalue.setDateId(sessInfo.mDateFormat);
		uvalue.setTimeFormat(sessInfo.timeFormat);
		uvalue.setDeviceBand(sessInfo.deviceType);
		uvalue.setDirection(sessInfo.direction);
		uvalue.setEquivalentCurrency(sessInfo.equivalentCurrency);
		uvalue.setFIRST_NAME(sessInfo.firstName);
		uvalue.setFontsizeId(sessInfo.fontsizeId);
		uvalue.setPrimaryGcif(sessInfo.primaryGcif);
		uvalue.setLangId(sessInfo.mLanguage);
		uvalue.setLAST_NAME(sessInfo.lastName);
		uvalue.setLoginId(sessInfo.loginId);
		uvalue.setMIDDLE_NAME(sessInfo.middleName);
		uvalue.setSeclangId(sessInfo.mSecLang);
		uvalue.setSessionId(sessInfo.sessionId);
		uvalue.setSessionTicket(sessInfo.sessionId);
		uvalue.setThemeId(sessInfo.themeId);
		uvalue.setTimeZoneId(sessInfo.mTimeZoneId);
		uvalue.setUserNo(sessInfo.userNo);
		uvalue.setPreferredWorkspaceId(sessInfo.prefWorkspace);
		uvalue.setTransactionStatus("SUCCESS");
	}
}
