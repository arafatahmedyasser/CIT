/**
 * Copyright 2016. Intellect Design Arena Limited. All rights reserved. 
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
package com.intellectdesign.canvas.login.handlers;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.intellectdesign.canvas.alert.handler.AlertConstants;
import com.intellectdesign.canvas.audit.handler.AuditConstants;
import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.common.ReplyObject;
import com.intellectdesign.canvas.constants.login.LoginMasterConstants;
import com.intellectdesign.canvas.event.Event;
import com.intellectdesign.canvas.event.EventDispatcher;
import com.intellectdesign.canvas.event.EventHandlerFrameworkConstants;
import com.intellectdesign.canvas.event.handler.HandlerException;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.handler.CanvasBaseRequestHandler;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.logging.PerformanceTimer;
import com.intellectdesign.canvas.properties.MessageManager;
import com.intellectdesign.canvas.security.AuthenticationException;
import com.intellectdesign.canvas.security.AuthenticationProviderFactory;
import com.intellectdesign.canvas.security.IAuthenticationServiceProvider;
import com.intellectdesign.canvas.utils.StringUtils;
import com.intellectdesign.canvas.value.CanvasRequestVO;
import com.intellectdesign.canvas.value.IUserValue;

/**
 * This is the request handler that handles all authentication related requests
 */
public class LoginRequestHandler extends CanvasBaseRequestHandler
{
	/**
	 * Default constructor
	 */
	public LoginRequestHandler()
	{
		// Nothing to do here
	}

	/**
	 * @param request The request received
	 * @return The response for this request
	 * @throws ProcessingErrorException Thrown if any error occurs while processing this request
	 * @see com.intellectdesign.canvas.handler.CanvasBaseRequestHandler#process(com.intellectdesign.canvas.value.CanvasRequestVO)
	 */
	@Override
	public ReplyObject process(CanvasRequestVO request) throws ProcessingErrorException
	{
		ExtReplyObject reply = null;
		PerformanceTimer timer = new PerformanceTimer();
		String action = request.getActionCode();
		String requestState = "Processing Login Request for action '" + action + "'";

		timer.startTimer(requestState);
		try
		{
			LoginActions lgnAction = LoginActions.valueOfAction(action);
			switch (lgnAction)
			{
			case LOGIN:
				reply = handleLoginRequest(request);
				break;
			case LOGOUT:
				reply = handleLogoutRequest(request);
				break;
			case EXTEND_SESSION:
				reply = handleSessionExtendRequest(request);
				break;
			case SESSION_EXPIRY:
				reply = handleSessionExpiryRequest(request);
				break;
			case VALIDATE_MULTI_LOGIN:
				reply = handleValidateMultiLoginRequest(request);
				break;
			default:
				reply = prepareErrorResponse(request, "INVALID_LOGIN_ACTION");
				break;
			}
		} catch (IllegalArgumentException e)
		{
			// This means that the action provided is not a valid action. Throw an exception.
			throw new ProcessingErrorException("SYSERROR", "Unknown action received by this handler - " + action, e);
		} catch (AuthenticationException e)
		{
			// This means that there was an error while the authentication provider tried to handle this action. Throw
			// an exception.
			throw new ProcessingErrorException(e.getErrorCode(), requestState, e);
		} finally
		{
			timer.endTimer();
		}

		return reply;
	}

	/**
	 * Creates a standard error response based on the message provided
	 * 
	 * @param request The request received
	 * @param messageCode The error code using which the response is to be created
	 * @return The error response
	 */
	private ExtReplyObject prepareErrorResponse(CanvasRequestVO request, String messageCode)
	{
		IUserValue userValue = (IUserValue) request.getRequestData().get(LoginMasterConstants.FLD_USER_VALUE);
		ExtReplyObject reply = new ExtReplyObject();
		reply.headerMap = new HashMap();
		reply.userValue = userValue;

		String errorMessage = MessageManager.getMessage(null, messageCode, request.getUserPreferenceContext()
				.getLanguageId());
		reply.headerMap.put(LoginMasterConstants.FLD_STATUS_FLAG, LoginMasterConstants.STATUS_FAILURE);
		reply.headerMap.put(LoginMasterConstants.ERROR_MESSAGE, errorMessage);
		reply.headerMap.put(LoginMasterConstants.ERROR_CODE, messageCode);

		userValue.setInfo(errorMessage);

		return reply;
	}

	/**
	 * Handle the request for validating multi login
	 * 
	 * @param request The request received
	 * @return The response to the session expiry request
	 * @throws ProcessingErrorException Thrown if any error occurs while processing the request
	 */
	private ExtReplyObject handleValidateMultiLoginRequest(CanvasRequestVO request) throws ProcessingErrorException
	{
		IUserValue userValue = (IUserValue) request.getRequestData().get(LoginMasterConstants.FLD_USER_VALUE);
		LoginMaster logMngr = null;
		boolean sessionFlag = false;
		try
		{
			logMngr = new LoginMaster();
			sessionFlag = logMngr.isMultiLoginAllowed(userValue);
		} catch (ProcessingErrorException re)
		{
			LOGGER.cterror("CTLGN00057", re);
			throw re;
		}
		userValue.setLoginFlag(sessionFlag);

		ExtReplyObject reply = new ExtReplyObject();
		reply.headerMap = new HashMap();
		reply.userValue = userValue;

		return reply;
	}

	/**
	 * Handle the request for Session Expiry
	 * 
	 * @param request The request received
	 * @return The response to the session expiry request
	 * @throws ProcessingErrorException Thrown if any error occurs while processing the request
	 */
	private ExtReplyObject handleSessionExpiryRequest(CanvasRequestVO request) throws ProcessingErrorException
	{
		IUserValue userValue = (IUserValue) request.getRequestData().get(LoginMasterConstants.FLD_USER_VALUE);
		LoginMaster lgnMngr = new LoginMaster();
		lgnMngr.removeUserSession(userValue);
		IAuthenticationServiceProvider provider = null;

		try
		{
			provider = AuthenticationProviderFactory.getAuthenticationServiceProvider();
			provider.logoutUser(userValue);
		} catch (AuthenticationException authEx)
		{
			// Eating the exception as nothing can be done now due to session expiry.
			LOGGER.cterror("CTLGN00056", authEx);
		}

		// Raise the event for session expire
		Event eventToBeRaised;
		eventToBeRaised = Event.getEventFor("CANVAS", "AUTHENTICATION", "LOGOUT", "EXPIRY");
		raiseEvent(request, eventToBeRaised, userValue);

		ExtReplyObject reply = new ExtReplyObject();
		reply.headerMap = new HashMap();
		reply.userValue = userValue;

		return reply;
	}

	/**
	 * Handle the request for extending the session
	 * 
	 * @param request The request received
	 * @return The response for the session Extend request
	 * @throws ProcessingErrorException Thrown if any error occurs while processing the request
	 */
	private ExtReplyObject handleSessionExtendRequest(CanvasRequestVO request) throws ProcessingErrorException
	{
		IUserValue userValue = (IUserValue) request.getRequestData().get(LoginMasterConstants.FLD_USER_VALUE);
		LoginMaster logMaster = new LoginMaster();
		logMaster.extendSession(userValue);

		// Raise the event for session extend
		Event eventToBeRaised;
		eventToBeRaised = Event.getEventFor("CANVAS", "AUTHENTICATION", "LOGIN", "SESSION_EXTEND");
		raiseEvent(request, eventToBeRaised, userValue);

		ExtReplyObject reply = new ExtReplyObject();
		reply.headerMap = new HashMap();
		reply.userValue = userValue;

		return reply;
	}

	/**
	 * Handle the logout request
	 * 
	 * @param request The request received
	 * @return The response for the logout request
	 * @throws ProcessingErrorException Thrown if any error occurs while processing the request
	 */
	private ExtReplyObject handleLogoutRequest(CanvasRequestVO request) throws ProcessingErrorException
	{
		ExtReplyObject reply = new ExtReplyObject();
		IAuthenticationServiceProvider provider = null;
		reply.headerMap = new HashMap();
		IUserValue userValue = (IUserValue) request.getRequestData().get(LoginMasterConstants.FLD_USER_VALUE);
		LoginMaster lgnMngr = new LoginMaster();

		lgnMngr.removeUserSession(userValue);

		try
		{
			provider = AuthenticationProviderFactory.getAuthenticationServiceProvider();
			provider.logoutUser(userValue);
			userValue.setInfo("User Logged out successfully");
		} catch (AuthenticationException authEx)
		{
			// Eating the exception as there is no point propagating exception for user logout.
			LOGGER.cterror("CTLGN00055", authEx, userValue);
		}

		// Raise event for user logout
		Event eventToBeRaised = Event.getEventFor("CANVAS", "AUTHENTICATION", "LOGOUT", "SUCCESS");

		raiseEvent(request, eventToBeRaised, userValue);

		reply.userValue = userValue;

		return reply;
	}

	/**
	 * Handle the login request
	 * 
	 * @param request The request received
	 * @return The response for the login request
	 * @throws ProcessingErrorException Thrown if any error occurs while processing the request
	 * @throws AuthenticationException Thrown if any error occurs while the Authentication provider handles the request
	 */
	private ExtReplyObject handleLoginRequest(CanvasRequestVO request) throws ProcessingErrorException,
			AuthenticationException
	{
		ExtReplyObject reply = new ExtReplyObject();
		reply.headerMap = new HashMap();
		LoginMaster loginMaster = new LoginMaster();
		boolean multiLoginStatus;
		boolean loginSuccess = false;
		IUserValue userValue = (IUserValue) request.getRequestData().get(LoginMasterConstants.FLD_USER_VALUE);
		String pin = userValue.getUserPin();
		HashMap customSessioninfoMap = userValue.getCustomSSOProperties();

		// Step 1: Ask the Login Master to check within our entitlements implementation of whether the user details are
		// valid.
		userValue = loginMaster.loginUser(userValue);

		// Step 2: Set the password receive into the userValue retrieved and then pass it along to the authentication
		// provider
		userValue.setUserPin(pin);
		userValue.setCustomSSOProperties(customSessioninfoMap);
		try
		{
			authenticateUser(userValue);
			if (LoginMasterConstants.STATUS_SUCCESS.equals(userValue.getTransactionStatus()))
			{
				multiLoginStatus = loginMaster.isMultiLoginAllowed(userValue);
				if (!multiLoginStatus)
				{
					String errorMsg = "LBL_MULTI_LOGIN_MSG";
					loginMaster.handleInValidUser(userValue, errorMsg);
				} else
				{
					try
					{
						userValue = loginMaster.populateUserPreferences(userValue);
						loginSuccess = true;
						loginMaster.insertUserSession(userValue);
					} catch (ProcessingErrorException e)
					{
						String errorMsg = "LBL_DB_EXCEPTION";
						loginMaster.handleInValidUser(userValue, errorMsg);
					}
				}
			} else
			{
				// The authentication has failed. Just pass along the user Value.
				LOGGER.ctdebug("", userValue);
			}
		} catch (ProcessingErrorException e)
		{
			LOGGER.cterror("CTLGN00009", e);
			throw e;
		}

		// Finally raise the event
		Event eventToBeRaised;
		if (loginSuccess)
			eventToBeRaised = Event.getEventFor("CANVAS", "AUTHENTICATION", "LOGIN", "SUCCESS");
		// Raise a different event for Invalid Password being provided.
		else if (userValue.isInvalidCred())
			eventToBeRaised = Event.getEventFor("CANVAS", "AUTHENTICATION", "LOGIN", "INVALID_PWD");
		// All other errors raise it as a failed login attempt.
		else
			eventToBeRaised = Event.getEventFor("CANVAS", "AUTHENTICATION", "LOGIN", "FAILURE");

		raiseEvent(request, eventToBeRaised, userValue);

		reply.userValue = userValue;
		return reply;
	}

	/**
	 * This method is used to authenticate the user
	 * 
	 * @param com.intellectdesign.canvas.exceptions.common.UserValue
	 * @throws Exception
	 */
	private void authenticateUser(IUserValue userValue) throws AuthenticationException
	{
		IAuthenticationServiceProvider provider = null;
		String cmName = " [Login.authenticateUser] ";

		try
		{
			provider = AuthenticationProviderFactory.getAuthenticationServiceProvider();
			provider.authenticateUser(userValue);
		} catch (AuthenticationException authEx)
		{
			LOGGER.cterror("CTLGN00012", authEx, cmName);
			throw authEx;
		}
	}

	/**
	 * Helper method to raise event
	 * 
	 * @param request The request received
	 * @param event The event to be raised
	 * @param userValue The userValue to be passed.
	 * @throws ProcessingErrorException thrown if any error occurs while raising the event
	 */
	private void raiseEvent(CanvasRequestVO request, Event event, IUserValue userValue) throws ProcessingErrorException
	{
		Map<String, Object> loginData = EventHandlerFrameworkConstants.getEventMandatoryDataFrom(request, event,
				EventHandlerFrameworkConstants.FLD_NOT_AVAILABLE);
		HashMap<String, Object> eventData = new HashMap<String, Object>();

		if (!StringUtils.isEmpty(userValue.getUserNo()))
			loginData.put(EventHandlerFrameworkConstants.FLD_USER_NO, userValue.getUserNo());
		loginData.put("status", userValue.getInfo());
		if (!StringUtils.isEmpty(userValue.getPrimaryGcif()))
			loginData.put(EventHandlerFrameworkConstants.FLD_GCIF, userValue.getPrimaryGcif());
		if (!StringUtils.isEmpty(userValue.getSessionId()))
			loginData.put(EventHandlerFrameworkConstants.FLD_SESSION_ID, userValue.getSessionId());
		loginData.put("LOGIN_DATE", new Date().toString());
		if (!StringUtils.isEmpty(userValue.getLoginId()))
			loginData.put("LOGIN_ID", userValue.getLoginId());
		if (!StringUtils.isEmpty(userValue.getSimulatingUserNo()))
			loginData.put(EventHandlerFrameworkConstants.FLD_SIMULATION_USERID, userValue.getSimulatingUserNo());
		loginData.put(LoginMasterConstants.FLD_INVALID_ATTEMPTS, userValue.getInvalidAttempts());

		loginData.put(EventHandlerFrameworkConstants.FLD_LAST_LOGIN_DATE, userValue.getLastLogin());
		loginData.put(EventHandlerFrameworkConstants.FLD_SIMULATION_MODE, Boolean.valueOf(userValue.isSimulated()));
		loginData.put(EventHandlerFrameworkConstants.FLD_REFERENCE_NO, userValue.getLoginId());
		loginData.put(EventHandlerFrameworkConstants.FLD_REFERENCE_KEY, userValue.getUserNo());

		// CT_ALERT_NOTIFY starts
		ArrayList recipient = new ArrayList();
		recipient.add(userValue.getUserNo());
		loginData.put(AlertConstants.RECIPIENTS_KEY, recipient);
		// CT_ALERT_NOTIFY ends

		eventData.putAll(loginData);

		eventData.put(AlertConstants.ALERT_DATA_MAP, loginData);
		eventData.put(AlertConstants.LOCALE_KEY, "en_US");
		eventData.put(AuditConstants.MANDATORY_AUDIT_META_DATA, loginData);
		eventData.put(AuditConstants.MANDATORY_AUDIT_DATA_OLD_STATE, loginData);
		eventData.put(AuditConstants.MANDATORY_AUDIT_DATA_NEW_STATE, loginData);

		try
		{
			EventDispatcher.getInstance().raiseEvent(event, eventData);
		} catch (HandlerException e)
		{
			// If the handler is configured to throw an exception, ensure that the same is propagated properly.
			throw new ProcessingErrorException(e);
		}

	}

	private static final Logger LOGGER = Logger.getLogger(LoginRequestHandler.class);
}
