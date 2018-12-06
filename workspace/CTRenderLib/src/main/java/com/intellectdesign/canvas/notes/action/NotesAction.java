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
package com.intellectdesign.canvas.notes.action;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.intellectdesign.canvas.action.PortletAction;
import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.common.ReplyObject;
import com.intellectdesign.canvas.constants.common.FrameworkConstants;
import com.intellectdesign.canvas.constants.common.JSPIOConstants;
import com.intellectdesign.canvas.constants.notes.NotesConstants;
import com.intellectdesign.canvas.data.conversion.util.JSONObjectBuilderForExtJs;
import com.intellectdesign.canvas.exceptions.action.OrbiActionException;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.login.sessions.SessionInfo;
import com.intellectdesign.canvas.properties.MessageManager;
import com.intellectdesign.canvas.web.config.ActionMap;

/**
 * 
 * The class GenLibAction is the Action class relating to Generic Library framework. Handles defined list of action
 * related to Library framework.
 * 
 * @version 1.0
 */
@SuppressWarnings("rawtypes")
public class NotesAction extends PortletAction
{
	/**
	 * This method is used to provide the implementation of the framework actions.
	 * 
	 * @param action - The action string associated with this request
	 * @param sessionInfo - The SessionInfo object
	 * @param actionMap - The ActionMap object
	 * @param requestParams - This is a map which has the values passes from the request converted to a map using the
	 *            RequestParamsHandler class
	 * @param request - The request itself
	 * @return ReplyObject - the response for the action
	 * @throws OrbiActionException
	 */
	@Override
	public ReplyObject executePortletActionUsing(String action, SessionInfo sessionInfo, ActionMap actionMap,
			Map requestParams, HttpServletRequest request) throws OrbiActionException
	{
		LOGGER.ctinfo("CTNTS0001");

		ExtReplyObject extReplyObject = null;
		try
		{

			if (NotesConstants.SAVE_NOTE.equals(action))
			{
				extReplyObject = getReplyObjectForSave_Note(sessionInfo, actionMap, requestParams, request);
			}/*
			 * else if (NotesConstants.SEND_NOTE.equals(action)) { extReplyObject =
			 * getReplyObjectForSend_Note(sessionInfo, actionMap, requestParams, request); }
			 */else if (NotesConstants.LOAD_NOTE.equals(action))
			{
				extReplyObject = getReplyObjectForLoad_Note(sessionInfo, actionMap, requestParams, request);
			}

			LOGGER.ctdebug("CTNTS0002", extReplyObject.headerMap);

			JSONObjectBuilderForExtJs.buildFormResultMap(extReplyObject);
		} catch (ProcessingErrorException pEx)
		{
			LOGGER.cterror("CTNTS0003", pEx);
			throw new OrbiActionException(pEx.getErrorCode(), pEx.getMessage(), pEx);
		}

		return extReplyObject;
	}

	/**
	 * This method is used to get the ReplyObject for action "SAVE_NOTE". SAVE_NOTE action is used while creating a new
	 * paymnt details
	 * 
	 * @param sessionInfo sessionInfo having the session information
	 * @param actionMap HashMap containing the list of actions
	 * @param requestParams Map of input parameters requested by the user.
	 * @param request object that contains the client's request.
	 * @return extReplyObject
	 * @exception ProcessingErrorException
	 */
	private ExtReplyObject getReplyObjectForLoad_Note(SessionInfo sessionInfo, ActionMap actionMap, Map requestParams,
			HttpServletRequest request) throws ProcessingErrorException
	{
		ExtReplyObject extReplyObject = null;
		try
		{
			/* Calling the executeHostRequest method from PortletAction class and get the ExtReplyObject. */
			extReplyObject = (ExtReplyObject) executeHostRequest(sessionInfo, actionMap.getHostCode(), requestParams, request);
			if (!extReplyObject.headerMap.containsKey("error"))
			{
				String message = MessageManager.getMessage(
						((String) requestParams.get(JSPIOConstants.INPUT_PRODUCT)).toLowerCase(),
						FrameworkConstants.SUCCESS, sessionInfo.mLanguage);
				extReplyObject.headerMap.put(FrameworkConstants.SUCCESS, FrameworkConstants.SUCCESS);
			} else
			{
				String message = MessageManager.getMessage(
						((String) requestParams.get(JSPIOConstants.INPUT_PRODUCT)).toLowerCase(),
						FrameworkConstants.FAILURE, sessionInfo.mLanguage);
				extReplyObject.headerMap.put(FrameworkConstants.FAILURE, message);
			}
		} catch (ProcessingErrorException pEx)
		{
			LOGGER.cterror("CTNTS0004", pEx);
		}
		return extReplyObject;
	}

	/**
	 * This method is used to get the ReplyObject for action "SEND_NOTE". SEND_NOTE action is used while creating a new
	 * paymnt details
	 * 
	 * @param sessionInfo sessionInfo having the session information
	 * @param actionMap HashMap containing the list of actions
	 * @param requestParams Map of input parameters requested by the user.
	 * @param request object that contains the client's request.
	 * @return extReplyObject
	 * @exception ProcessingErrorException
	 */
	/**
	 * private ExtReplyObject getReplyObjectForSend_Note(SessionInfo sessionInfo, ActionMap actionMap, Map
	 * requestParams, HttpServletRequest request) throws ProcessingErrorException { ExtReplyObject extReplyObject =
	 * null; try { Calling the executeHostRequest method from PortletAction class and get the ExtReplyObject.
	 * extReplyObject = (ExtReplyObject) executeHostRequest(sessionInfo, actionMap.getHostCode(), requestParams); if
	 * (!extReplyObject.headerMap.containsKey("error")) { String message = MessageManager.getMessage( ((String)
	 * requestParams.get(JSPIOConstants.INPUT_PRODUCT)).toLowerCase(), FrameworkConstants.SUCCESS,
	 * sessionInfo.mLanguage); extReplyObject.headerMap.put(FrameworkConstants.SUCCESS, FrameworkConstants.SUCCESS); }
	 * else { String message = MessageManager.getMessage( ((String)
	 * requestParams.get(JSPIOConstants.INPUT_PRODUCT)).toLowerCase(), FrameworkConstants.FAILURE,
	 * sessionInfo.mLanguage); extReplyObject.headerMap.put(FrameworkConstants.FAILURE, message); } } catch
	 * (ProcessingErrorException pEx) { LOGGER.cterror("CTNTS0005", pEx); } return extReplyObject; }
	 */

	/**
	 * This method is used to get the ReplyObject for action "SAVE_NOTE". SAVE_NOTE action is used while creating a new
	 * paymnt details
	 * 
	 * @param sessionInfo sessionInfo having the session information
	 * @param actionMap HashMap containing the list of actions
	 * @param requestParams Map of input parameters requested by the user.
	 * @param request object that contains the client's request.
	 * @return extReplyObject
	 * @exception ProcessingErrorException
	 */
	private ExtReplyObject getReplyObjectForSave_Note(SessionInfo sessionInfo, ActionMap actionMap, Map requestParams,
			HttpServletRequest request) throws ProcessingErrorException
	{
		ExtReplyObject extReplyObject = null;
		try
		{
			/** Calling the executeHostRequest method from PortletAction class and get the ExtReplyObject. */
			extReplyObject = (ExtReplyObject) executeHostRequest(sessionInfo, actionMap.getHostCode(), requestParams, request);
			if (!extReplyObject.headerMap.containsKey("error"))
			{
				String message = MessageManager.getMessage(
						((String) requestParams.get(JSPIOConstants.INPUT_PRODUCT)).toLowerCase(),
						FrameworkConstants.SUCCESS, sessionInfo.mLanguage);
				extReplyObject.headerMap.put(FrameworkConstants.SUCCESS, message);
			} else
			{
				String message = MessageManager.getMessage(
						((String) requestParams.get(JSPIOConstants.INPUT_PRODUCT)).toLowerCase(),
						FrameworkConstants.FAILURE, sessionInfo.mLanguage);
				extReplyObject.headerMap.put(FrameworkConstants.FAILURE, message);
			}
		} catch (ProcessingErrorException pEx)
		{
			LOGGER.cterror("CTNTS0006", pEx);
		}
		return extReplyObject;
	}

	private static Logger LOGGER = Logger.getLogger(NotesAction.class);

}
