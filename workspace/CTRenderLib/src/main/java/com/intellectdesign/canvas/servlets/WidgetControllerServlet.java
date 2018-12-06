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
package com.intellectdesign.canvas.servlets;

import java.io.IOException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.intellectdesign.canvas.action.PortletAction;
import com.intellectdesign.canvas.constants.common.FrameworkConstants;
import com.intellectdesign.canvas.constants.common.JSPIOConstants;
import com.intellectdesign.canvas.data.conversion.util.HashMapToJSONConverter;
import com.intellectdesign.canvas.data.conversion.util.JSONObjectBuilderForExtJs;
import com.intellectdesign.canvas.exceptions.action.OrbiActionException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.logging.PerformanceTimer;
import com.intellectdesign.canvas.login.sessions.SessionInfo;
import com.intellectdesign.canvas.login.sessions.SessionManager;
import com.intellectdesign.canvas.preference.GlobalPreferencesUtil;
import com.intellectdesign.canvas.properties.MessageManager;
import com.intellectdesign.canvas.web.config.ActionMap;
import com.intellectdesign.canvas.web.config.ActionMapRegistry;

/**
 * Purpose: The controller servlet which acts as a single point entry for all the actions performed by the TLIP
 * Dashboard application.
 * 
 * @version 1.0
 * 
 * 
 */
public class WidgetControllerServlet extends HttpServlet
{

	private static final long serialVersionUID = 1L;

	/**
	 * Executed while invoking the servlet for the first time. This method initializes the action mapping for all the
	 * configured products and stores it in the Servlet Context. Later in doPost() method during the request processing,
	 * the action map object is retrieved to identify what action to call.
	 * 
	 * @param woConfig
	 * @throws ServletException
	 * @see javax.servlet.GenericServlet#init(javax.servlet.ServletConfig)
	 */
	public void init(ServletConfig woConfig) throws ServletException
	{
		super.init(woConfig);
	}

	/**
	 * This method is uesd to get the RequestParameters from the request
	 * 
	 * @param HttpServletRequest
	 * @return String of RequestParameters
	 */

	private String getRequestParameters(HttpServletRequest request)
	{
		StringBuffer returnVal = new StringBuffer();
		String currentKey = null;
		returnVal.append("Request URI = " + request.getRequestURI());
		returnVal.append("Request Parameters :");
		Enumeration enumParams = request.getParameterNames();
		while (enumParams.hasMoreElements())
		{
			currentKey = (String) enumParams.nextElement();
			returnVal.append(currentKey);
			returnVal.append(" = ");
			returnVal.append(request.getParameter(currentKey) + ",");
		}
		return returnVal.toString();
	}

	/**
	 * calls the dopost method
	 * 
	 * @param request
	 * @param response
	 * @throws ServletException
	 * @throws IOException
	 */
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		doPost(request, response);
	}

	/**
	 * dopost method of HttpServletRequest
	 * 
	 * @param request
	 * @param response
	 * @throws ServletException
	 * @throws IOException
	 * @exception OrbiActionException
	 * @see javax.servlet.http.HttpServlet#doPost(javax.servlet.http.HttpServletRequest,
	 *      javax.servlet.http.HttpServletResponse)
	 */

	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		PerformanceTimer pcspost = new PerformanceTimer();
		pcspost.startTimer("WidgetControllerServlet.doPost");
		response.setContentType("text/plain;charset=UTF-8");
		response.setHeader("Cache-Control", "no-cache");
		String reqId = UUID.randomUUID().toString();
		logger.ctdebug("CTRND00214", reqId,
				HashMapToJSONConverter.convertHashMapToJSONFormat(request.getParameterMap()));
		SessionInfo sessionInfo = validateSession(request, response);
		String jsonString = null;

		/**
		 * If sessionInfo is null then send the response error code as 403. Every Ext-JS component will be attached with
		 * the error response listener on the client side. If it receives the response as '403' then
		 * "window.location.href=SessionExpire.jsp" will be invoked to show the session expired page.
		 */
		if (sessionInfo == null)
		{
			PerformanceTimer sessionError = new PerformanceTimer();
			sessionError.startTimer("Sending 403 response:" + this.getRequestParameters(request));
			sessionError.endTimer();
			// response.sendError(HttpServletResponse.SC_FORBIDDEN);
			HashMap expMap = new HashMap();
			HashMap jsonMap = new HashMap();
			expMap.put("SESSION_ERROR", "SESSION_EXPIRY");
			jsonMap.put("JSON_MAP", expMap);
			response.getWriter().write(HashMapToJSONConverter.convertHashMapToJSONFormat(jsonMap));
			return;
		}

		ActionMapRegistry actionMapRegistry = ActionMapRegistry.getDefaultInstance();
		ActionMapRegistry actionMapRegistrycus = ActionMapRegistry.getCustomInstance();

		ActionMap actionMap = null;
		String actionClass = "";

		String product = null;
		String subproduct = null;
		String functionCode = null;
		String screenCode = null;
		product = request.getParameter(FrameworkConstants.PRODUCT_NAME);
		if (product == null)
			logger.ctdebug("CTRND00215", FrameworkConstants.PRODUCT_NAME);

		subproduct = request.getParameter(FrameworkConstants.SUB_PRODUCT_NAME);
		if (subproduct == null)
			logger.ctdebug("CTRND00216", FrameworkConstants.SUB_PRODUCT_NAME);

		functionCode = request.getParameter(JSPIOConstants.INPUT_FUNCTION_CODE);
		if (functionCode == null)
			logger.ctdebug("CTRND00217", JSPIOConstants.INPUT_FUNCTION_CODE);

		screenCode = request.getParameter(FrameworkConstants.PAGE_CODE_TYPE);
		if (screenCode == null)
			logger.ctdebug("CTRND00218", FrameworkConstants.PAGE_CODE_TYPE);

		try
		{
			actionMap = (ActionMap) actionMapRegistry.lookup(screenCode, product, subproduct, functionCode);

			PortletAction action = null;

			if (actionMap == null || actionMap.getActionClass() == null)
			{
				actionMap = (ActionMap) actionMapRegistrycus.lookup(screenCode, product, subproduct, functionCode);
			}

			if (actionMap != null && actionMap.getActionClass() != null)
			{

				actionClass = actionMap.getActionClass();
			}

			action = (PortletAction) Class.forName(actionClass).newInstance();

			/**
			 * Invokes the executePortletAction instead of execute method. executePortletAction has the responsibility
			 * of delegating the call to the respective action classes execute method.
			 */
			jsonString = action.executePortletAction(sessionInfo, actionMap, request);
		}

		catch (OrbiActionException oe)
		{
			logger.cterror("CTRND00227", oe);
			if (oe.getErrorCode() != null)
			{
				logger.cterror("CTRND00221", oe.getErrorCode());
			} else
			{
				logger.cterror("CTRND00222");
			}
			// Get the error message based on the lang code.
			String errorMessage = MessageManager.getMessage("canvas-default", SYSERROR, sessionInfo.mLanguage);
			// Get the errorMap object for JSON String conversion.
			Map errorMap = JSONObjectBuilderForExtJs.buildErrorMessageMap(errorMessage);
			injectHeaderValue(errorMap, sessionInfo);
			logger.cterror("CTRND00223", errorMap);
			// Convert the error JSON string.
			jsonString = HashMapToJSONConverter.convertHashMapToJSONFormat(errorMap);
			// Write the JSON String in the response.
			response.getWriter().write(jsonString);
			return;
		} catch (Throwable e)
		{
			logger.cterror("CTRND00224", e);
			// Get the error message based on the lang code.
			String errorMessage = MessageManager.getMessage("canvas-default", SYSERROR, sessionInfo.mLanguage);
			// Get the errorMap object for JSON String conversion.
			Map errorMap = JSONObjectBuilderForExtJs.buildErrorMessageMap(errorMessage);
			injectHeaderValue(errorMap, sessionInfo);
			logger.cterror("CTRND00225", errorMap);
			// Convert the error JSON string.
			jsonString = HashMapToJSONConverter.convertHashMapToJSONFormat(errorMap);
			// Write the JSON String in the response.
			response.getWriter().write(jsonString);
			return;
		}
		logger.ctdebug("CTRND00226", reqId, jsonString);

		if (jsonString != null && !jsonString.equals(""))
		{
			// Write the JSON String in the response.
			response.getWriter().write(jsonString);
		}
		pcspost.endTimer();
	}

	/**
	 * This method gets the SessionInfo from the current session. In case there is a validation failure, then this
	 * returns null
	 * 
	 * @param request The current request
	 * @return SessionInfo The session info if the session is valid. Else null
	 * @throws IOException
	 */
	private SessionInfo validateSession(HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		logger.ctinfo("CTRND00288");
		SessionManager lSessionManager = SessionManager.getInstance();
		if (!"success".equals(lSessionManager.validateSession(request)))
		{
			return null;
		}
		SessionInfo sessionInfo = lSessionManager.getUserSessionInfo(request);
		logger.ctdebug("CTRND00228", sessionInfo);
		logger.ctinfo("CTRND00308");
		return sessionInfo;
	}

	/**
	 * This method injects the header value
	 * 
	 * @param mapParams
	 * @return SessionInfo
	 * @throws IOException
	 */

	private void injectHeaderValue(Map mapParams, SessionInfo sessionInfo)
	{
		HashMap<String, String> map = new HashMap<String, String>();
		try
		{
			GlobalPreferencesUtil globalPreferencesUtil = new GlobalPreferencesUtil();
			map.put(JSPIOConstants.TXN_PROCESS_DATE_TIME,
					globalPreferencesUtil.getConvertedTime(sessionInfo.mTimeZoneId));
		} catch (Exception e)
		{
			logger.cterror("CTRND00229", e);
		}

		mapParams.put("HEADER_VALUE", map);
	}

	/**
	 * This method checks whether the string is null or not
	 * 
	 * @param str
	 * @return String
	 * 
	 */
	public String checknull(String str)
	{
		return str == null ? "" : (str.trim());
	}

	// Instance of Logger for this class
	private static final Logger logger = Logger.getLogger(WidgetControllerServlet.class);
	public static final String SYSERROR = "SYSERROR";
}