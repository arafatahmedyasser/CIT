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

package com.intellectdesign.canvas.preferences;

import java.util.HashMap;
import java.util.List;
import java.util.Vector;

import com.intellectdesign.canvas.audit.handler.AuditConstants;
import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.common.ReplyObject;
import com.intellectdesign.canvas.common.UserValue;
import com.intellectdesign.canvas.constants.common.JSPIOConstants;
import com.intellectdesign.canvas.constants.util.TIConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.TransactionManager;
import com.intellectdesign.canvas.entitlement.EntitlementsHelper;
import com.intellectdesign.canvas.event.Event;
import com.intellectdesign.canvas.event.EventDispatcher;
import com.intellectdesign.canvas.event.EventHandlerFrameworkConstants;
import com.intellectdesign.canvas.exceptions.common.OnlineException;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.handler.SimpleRequestHandler;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.value.ListValue;

/**
 * This is the class through which the datas that is used to set and retrive the user preferences, like date format,
 * time, font etc.
 * 
 * @version 1.0
 */
public class UserPreferenceHandler extends SimpleRequestHandler
{
	/**
	 * Default constrctor does nothing.
	 */
	public UserPreferenceHandler()
	{
	}

	/**
	 * This method is called from the framework when it encounters any unknown framework action.
	 * 
	 * @see com.orbidirect.aps.handler.ODRequestHandler#onlineProcess(java.lang.Object)
	 * @param obj
	 * @return Object
	 * @throws OnlineException
	 */
	public ReplyObject processRequest(Vector inputVector) throws ProcessingErrorException
	{
		ExtReplyObject reply = null;

		HashMap map = (HashMap) inputVector.get(inputVector.size() - 1);
		map.put("REQ_HEADER_DATA", inputVector.get(TIConstants.VALUE_VECTOR_21));
		map.put("SESSION_ID", inputVector.get(0));
		String action = (String) inputVector.get(TIConstants.INPUT_ACTION_INDEX_IN_VECTOR);
		String userNo = (String) inputVector.get(TIConstants.USER_NO_INDEX_IN_VECTOR);
		String gcif = (String) inputVector.get(TIConstants.GCIF_INDEX_IN_VECTOR);

		if ("UPDATE_PREFERENCE".equals(action))
		{
			if ("N".equals(map.get("TEMP_UPDATE_PREFERENCE_IND")))
			{
				reply = updateUserPreferences(userNo, gcif, map);
			} else
			{
				reply = tempUpdateUserPreferences(map);
			}

		} else if ("GET_USER_PREF".equals(action))
		{
			List prefType = (List) map.get("PREFERENCE_TYPES");
			reply = retrieveUserPreferences(userNo, gcif, prefType);
		}
		return reply;
	}

	/**
	 * This method updates the user preferences into the entitlement system.
	 * 
	 * @param userNo The user number
	 * @param gcif The GCIF
	 * @param requestData The request data received
	 * @return The Reply object having the status of the request
	 * @throws OnlineException Thrown if any error occurs while processing the request.
	 */
	private ExtReplyObject updateUserPreferences(String userNo, String gcif, HashMap requestData)
			throws ProcessingErrorException
	{
		ExtReplyObject reply = null;
		HashMap replyMap = new HashMap();
		List prefType = (List) requestData.get("PREFERENCE_TYPE");
		List prefValue = (List) requestData.get("PREFERENCE_VALUES");
		String requestStatus = null;

		TransactionManager tranBoundary = new TransactionManager();

		try
		{
			// Step 1: Start a transaction
			tranBoundary.begin();

			// Step 2: Ask the entitlement implementation to persist the user preferences.
			EntitlementsHelper entlHelper = new EntitlementsHelper();
			requestStatus = entlHelper.updateUserPreferences(prefType, prefValue, userNo);

			// Step 2.1: Audit this if the result is success
			if (requestStatus != null && !"failure".equals(requestStatus))
			{
				raiseEventForPref(requestData, false);
				// Step 3: Commit the changes
				tranBoundary.commit();
			}
		} catch (DatabaseException e)
		{
			LOGGER.cterror("CTLGN00046", e, userNo);
			throw new ProcessingErrorException(e);
		} catch (ProcessingErrorException e)
		{
			LOGGER.cterror("CTLGN00046", e, userNo);
			throw new ProcessingErrorException(e);
		} finally
		{
			tranBoundary.rollback();
		}

		if (requestStatus == null || "failure".equals(requestStatus))
		{
			reply = new ExtReplyObject();
			replyMap.put("STATUS", "FAILURE");
			reply.headerMap = new HashMap();
			reply.headerMap.put("JSON_MAP", replyMap);

		} else
		{
			reply = new ExtReplyObject();
			replyMap.put("STATUS", "SUCCESS");
			reply.headerMap = new HashMap();
			reply.headerMap.put("JSON_MAP", replyMap);
		}

		return reply;
	}

	/**
	 * Helper method that retrieves the user preferences for this user
	 * 
	 * @param userNo The user Number
	 * @param gcif The GCIF
	 * @param prefType The list of preference criterias to be retrieved
	 * @return The reply object having the preference information
	 * @throws OnlineException Thrown if any error occurs while retrieving preferences
	 */
	private ExtReplyObject retrieveUserPreferences(String userNo, String gcif, List prefType)
			throws ProcessingErrorException
	{
		UserValue userVal = new UserValue();
		HashMap prefValueMap = new HashMap();
		ListValue lvl = new ListValue();
		PreferenceManager pref = new PreferenceManager();

		userVal.setUserNo(userNo);
		userVal.setPrimaryGcif(gcif);

		for (int i = 0; i < prefType.size(); i++)
		{
			try
			{
				lvl = pref.getUserPreference(userNo, (String) prefType.get(i));
				if (lvl != null)
				{
					prefValueMap.put(lvl.getCode(), lvl.getDesc());
				}
			} catch (PreferenceException exp)
			{
				LOGGER.cterror("CTLGN00047", exp, userNo, prefType.get(i));
				throw new ProcessingErrorException(exp);
			}
		}

		ExtReplyObject reply = new ExtReplyObject();
		reply.headerMap = new HashMap();
		reply.headerMap.put("JSON_MAP", prefValueMap);
		return reply;
	}

	/**
	 * Helper method to raise event
	 * 
	 * @param inputMap The input data received
	 * @param isTempUpdate Flag indicating if this is a temporary update
	 */
	private void raiseEventForPref(HashMap inputMap, boolean isTempUpdate)
	{
		Event prefUpdateEvent = null;
		if (isTempUpdate)
		{
			prefUpdateEvent = Event.getEventFor("CANVAS", "PERSONALIZ", "USER_PREF", "TEMP_UPDATE");
		} else
		{
			prefUpdateEvent = Event.getEventFor("CANVAS", "PERSONALIZ", "USER_PREF", "PREF_SAVE");
		}

		HashMap eventData = new HashMap();
		HashMap prefMap = new HashMap();
		HashMap ReqHeaderMap = (HashMap) inputMap.get("REQ_HEADER_DATA");

		prefMap.put(EventHandlerFrameworkConstants.FLD_USER_NO, inputMap.get(JSPIOConstants.INPUT_USER_NO));
		prefMap.put(EventHandlerFrameworkConstants.FLD_GCIF, inputMap.get(JSPIOConstants.INPUT_GCIF));
		prefMap.put(EventHandlerFrameworkConstants.FLD_SESSION_ID,
				inputMap.get(EventHandlerFrameworkConstants.FLD_SESSION_ID));
		prefMap.put(EventHandlerFrameworkConstants.FLD_REFERENCE_NO, "Preference Update");
		prefMap.put(EventHandlerFrameworkConstants.FLD_REFERENCE_KEY, inputMap.get(JSPIOConstants.INPUT_USER_NO));
		prefMap.put(EventHandlerFrameworkConstants.FLD_CHANNEL_ID,
				ReqHeaderMap.get(EventHandlerFrameworkConstants.FLD_CHANNEL_ID));
		prefMap.put(EventHandlerFrameworkConstants.FLD_APP_SERVER_IP,
				ReqHeaderMap.get(EventHandlerFrameworkConstants.FLD_APP_SERVER_IP));
		prefMap.put(EventHandlerFrameworkConstants.FLD_WEB_SERVER_IP,
				ReqHeaderMap.get(EventHandlerFrameworkConstants.FLD_WEB_SERVER_IP));
		prefMap.put(EventHandlerFrameworkConstants.FLD_BROWSER,
				ReqHeaderMap.get(EventHandlerFrameworkConstants.FLD_BROWSER_NAME));
		prefMap.put(EventHandlerFrameworkConstants.FLD_CLIENT_IP,
				ReqHeaderMap.get(EventHandlerFrameworkConstants.FLD_CLIENT_IP));
		prefMap.put(EventHandlerFrameworkConstants.FLD_LOGIN_ID,
				ReqHeaderMap.get(EventHandlerFrameworkConstants.FLD_LOGIN_ID));
		HashMap<String, String> userPrefMapData = new HashMap<String, String>();
		List userPref = (List) inputMap.get("PREFERENCE_VALUES");
		List userPrefAtrribute = (List) inputMap.get("PREFERENCE_TYPE");

		if (userPref.size() == userPrefAtrribute.size())
		{
			int i = 0;
			for (i = 0; i < userPrefAtrribute.size(); i++)
			{
				userPrefMapData.put((String) userPrefAtrribute.get(i), (String) userPref.get(i));
			}
		} else
		{
			return;
		}
		PreferenceManager prefMngr = new PreferenceManager();
		ListValue lvl = null;
		prefMap.put("FONTSIZE_ID", userPrefMapData.get("FONTSIZE"));
		prefMap.put("THEME_ID", userPrefMapData.get("THEME	"));

		lvl = prefMngr.getPreferenceValueFor("DATEFORMAT", userPrefMapData.get("DATEFORMAT"));
		prefMap.put("DATE_FORMAT", lvl.getDesc());

		lvl = prefMngr.getPreferenceValueFor("AMOUNT", userPrefMapData.get("AMOUNT"));
		prefMap.put("AMOUNT_FORMAT", lvl.getDesc());

		lvl = prefMngr.getPreferenceValueFor("TIMEFORMAT", userPrefMapData.get("TIMEFORMAT"));
		prefMap.put("TIME_FORMAT", lvl.getDesc());

		prefMap.put("TIMEZONE", userPrefMapData.get("TIMEZONE"));
		prefMap.put("LANGUAGE_ID", userPrefMapData.get("LANGUAGE"));
		prefMap.put("WORKSPACE", userPrefMapData.get("WORKSPACE"));

		HashMap oldPrefDataMap = (HashMap) inputMap.get("CURRENT_PREF_DATA");

		eventData.putAll(prefMap);
		eventData.put(AuditConstants.MANDATORY_AUDIT_META_DATA, prefMap);
		eventData.put(AuditConstants.MANDATORY_AUDIT_DATA_OLD_STATE, oldPrefDataMap);
		eventData.put(AuditConstants.MANDATORY_AUDIT_DATA_NEW_STATE, prefMap);
		raiseEvent(prefUpdateEvent, eventData);
	}

	/**
	 * responsible for raising the event
	 * 
	 * @param Event Data Map
	 * 
	 * 
	 */

	private void raiseEvent(Event event, HashMap inputMap)
	{
		try
		{
			EventDispatcher.getInstance().raiseEvent(event, inputMap);
		} catch (Exception ex)
		{
			LOGGER.cterror("CTLGN00054", ex);
		}
	}

	/**
	 * This method raise the event for TempUpdate of user pref. as the temp update is done in action class, so only
	 * event will raise in this clas
	 * 
	 * @param requestData The request data received
	 * @return The Reply object having the status of the request
	 */
	private ExtReplyObject tempUpdateUserPreferences(HashMap inputMap)
	{
		raiseEventForPref(inputMap, true);
		ExtReplyObject extreplyObj = new ExtReplyObject();
		HashMap status = new HashMap();
		status.put("STATUS", "SUCCESS");
		extreplyObj.headerMap = new HashMap();
		extreplyObj.headerMap.put("JSON_MAP", status);
		return extreplyObj;
	}

	// Logger instance for this class
	private static final Logger LOGGER = Logger.getLogger(UserPreferenceHandler.class);
}
