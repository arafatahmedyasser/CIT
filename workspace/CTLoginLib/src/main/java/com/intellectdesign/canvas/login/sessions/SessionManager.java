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

package com.intellectdesign.canvas.login.sessions;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.SecurityConfigurationDescriptor;
import com.intellectdesign.canvas.constants.login.LoginMasterConstants;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.logging.PerformanceTimer;
import com.intellectdesign.canvas.login.handlers.LoginActions;
import com.intellectdesign.canvas.login.handlers.LoginManager;
import com.intellectdesign.canvas.properties.reader.PropertyReader;
import com.intellectdesign.canvas.security.AuthenticationException;
import com.intellectdesign.canvas.security.AuthenticationProviderFactory;
import com.intellectdesign.canvas.security.IAuthenticationServiceProvider;
import com.intellectdesign.canvas.utils.ChannelUtils;
import com.intellectdesign.canvas.value.IUserValue;

/**
 * This class provides the API's for the end application to work with the trusted session token for the logged in user.
 * A typical life cycle usage would be -
 * 
 * <ul>
 * <li>At the time of login, the invocation sequence is -
 * 
 * <pre>
 * UserValue uValue = new LoginManager().handleRequest(userValue, servletRequest, null);
 * if (&quot;success&quot;.equals(uValue.getTransactionStatus()))
 * 	SessionManager.getInstance().createSession(uValue);
 * </pre>
 * 
 * </li>
 * <li>For any action where the trusted session token is needed, the typical invocation sequence is -
 * 
 * <pre>
 * 		SessionInfo sessInfo = SessionManager.getInstance().getUserSessionInfo(servletRequest);
 * 		if (sessInfo == null)
 * 			//Route the user back to login page...
 * </pre>
 * 
 * </li>
 * <li>To explicitly trigger a validation of the session, the API to be used is -
 * 
 * <pre>
 * 		String status = SessionManager.getInstance().validateSession(request);
 * 		if ("success".equals(status))
 * 			//Session is valid.
 * 		else
 * 			//The status contains the actual error message. Take action accordingly.
 * </pre>
 * 
 * </li>
 * <li>To logout a user, the invocation sequence is -
 * 
 * <pre>
 * SessionManager.getInstance().logoutUser(servletRequest);
 * </pre>
 * 
 * </li>
 * </ul>
 * 
 */
public class SessionManager
{
	// The logger instance for this class
	private static final Logger logger = Logger.getLogger(SessionManager.class);

	private static SessionManager moSessionInstance = new SessionManager();
	private static String appURIWithContextPath = null;
	private static List<String> validReferers = null;
	private PropertyReader propReader = new PropertyReader();
	private static String ROUTING_MODE_FORWARD = "FORWARD";

	/**
	 * default constructor
	 */
	private SessionManager()
	{
	}

	/**
	 * method to get the instance of SessionManager
	 * 
	 * @return SessionManager
	 */

	public static SessionManager getInstance()
	{
		return moSessionInstance;
	}

	/**
	 * This method executes the login sequence. If the login is successful, then the control is transferred to the Home
	 * page configured in the Security Descriptor. If the login is a failure (due to proper validation), the control is
	 * transferred back to the Login page with the error message under the request attribute "ERROR_MESSAGE". If there
	 * are any exceptions faced, then the control is transferred to the error page.
	 * 
	 * @param request The request received
	 * @param response The response object
	 * @param loginParams The login parameters extracted by the end application
	 */
	public void loginUser(HttpServletRequest request, HttpServletResponse response, IUserValue loginParams)
			throws ServletException, IOException
	{
		boolean errorScenario = false;
		Throwable exceptionFaced = null;
		try
		{
			loginImpl(request, response, loginParams);
		} catch (ProcessingErrorException e)
		{
			errorScenario = true;
			exceptionFaced = e;
			logger.cterror("CTLGN00058", e, loginParams);
		} catch (IOException e)
		{
			errorScenario = true;
			exceptionFaced = e;
			logger.cterror("CTLGN00058", e, loginParams);
		}
		if (errorScenario)
		{
			request.setAttribute("exception", exceptionFaced);
			routeToErrorPage(request, response);
		}
	}

	private void loginImpl(HttpServletRequest request, HttpServletResponse response, IUserValue loginParams)
			throws ProcessingErrorException, ServletException, IOException
	{
		boolean loginSuccess = false;
		// Step 1: Provide a chance to the Authentication provider to enrich the login params with its custom asks
		IAuthenticationServiceProvider provider = null;
		try
		{
			provider = AuthenticationProviderFactory.getAuthenticationServiceProvider();
			provider.extractUserCredentials(request, loginParams);
		} catch (AuthenticationException e)
		{
			throw new ProcessingErrorException(e);
		}
		HttpSession currentSession = request.getSession(false);
		// Invalidate the current session
		if (currentSession != null)
			currentSession.invalidate();
		currentSession = request.getSession(true);

		String currentSessionId = currentSession.getId();
		// Step 2: Invoke the Login Manager to execute the login.
		loginParams.setTransactionCode(LoginActions.LOGIN.toString());
		loginParams.setUserAgent(request.getHeader("user-agent"));
		loginParams.setSessionTicket(currentSessionId);
		loginParams.setSessionId(currentSessionId);
		IUserValue uValue = new LoginManager().handleRequest(loginParams, request, null);
		String status = uValue.getTransactionStatus();
		String errorMessage = "";
		// Step 3: If login manager returned success, then create the session token, stamp on session and perform a full
		// validation
		if ("success".equals(status))
		{
			request.setAttribute("UserValue", uValue);
			// So the login was success. Create the session and validate the same.
			createSession(request, false);
			String valResponse = validateSession(request);
			if ("success".equals(valResponse))
			{
				loginSuccess = true;
			} else
			{
				errorMessage = valResponse;
			}
		} else
		{
			errorMessage = uValue.getInfo();
		}
		// Step 4: If login is success, then route to home page as configured.
		if (loginSuccess)
		{
			routeToHomePage(request, response);
		} else
		{
			request.setAttribute("ERROR_MESSAGE", errorMessage);
			routeToLoginPage(request, response);
		}
	}

	/**
	 * method to logout the user
	 * 
	 * @param HttpServletRequest
	 */
	public void logoutUser(HttpServletRequest request)
	{
		// As part of this sequence, ensure that the logStatus is set to "logout" in SessionInfo, so that it does
		// confuse this session invalidate with session expiry.

		HttpSession session = request.getSession(false);
		if (session != null)
		{
			SessionInfo sessInfo = getUserSessionInfo(request);
			if (sessInfo != null)
			{
				sessInfo.logStatus = "logout";
				sessInfo.requestURI = request.getRequestURI();
			}
			// If the session info is null, that could only mean that the user's session has already expired. So
			// triggering the invalidate is just enough

			// Now trigger the session to invalidate. The logout will be triggered by the SessionInfo
			session.invalidate();
		}
	}

	/**
	 * This method logs out the current user. Post logout it does an automatic routing of the application to the logout
	 * URL configured in the Security descriptor
	 * 
	 * @param request The request received
	 * @param response The response object
	 * @throws ServletException Thrown if any exception occurs while processing the request
	 * @throws IOException Thrown if any error occurs while sending the response
	 */
	public void logoutUser(HttpServletRequest request, HttpServletResponse response) throws ServletException,
			IOException
	{
		logoutUser(request);
		routeToLogoutPage(request, response);
	}

	/**
	 * method to create the Session
	 * 
	 * @param HttpServletRequest
	 * @return Returns SessionId as String
	 */
	public String createSession(HttpServletRequest request)
	{
		return createSession(request, true);
	}

	/**
	 * method to create the Session
	 * 
	 * @param HttpServletRequest
	 * @param forceCreate Set this to true to explicitly recreate the Http Session (suggested). False otherwise
	 * @return Returns SessionId as String
	 */
	public String createSession(HttpServletRequest request, boolean forceCreate)
	{

		String lcmName = " [SessionManager.createSessions] ";
		logger.ctdebug("CTLGN00021", lcmName, request.getRemoteAddr());
		HttpSession session = request.getSession(false);

		if (forceCreate && session != null)
		{
			session.invalidate();
		}
		session = request.getSession(true);
		SessionInfo sessInfo = new SessionInfo();
		sessInfo = populateSessionInfo(request);
		sessInfo.sessionId = session.getId();
		sessInfo.requestIp = request.getRemoteAddr();
		sessInfo.userAgent = request.getHeader("user-agent"); // included for Audits.
		sessInfo.deviceType = request.getAttribute("deviceType") != null
				&& !((String) request.getAttribute("deviceType")).isEmpty() ? (String) request
				.getAttribute("deviceType") : sessInfo.deviceType;
		sessInfo.requestURI = (String) request.getAttribute("requestURI");
		if (request.getParameter("isHybrid") != null && request.getParameter("isHybrid").equals("H"))
		{
			sessInfo.setHybrid(true);
		} else
		{
			sessInfo.setHybrid(false);
		}
		sessInfo.channelId = Integer.parseInt(ChannelUtils.getDeviceType(sessInfo.deviceType, sessInfo.isHybrid));
		session.setAttribute("sessionInfo", sessInfo);

		return (session.getId());
	}

	/**
	 * Validating the referrer. This method will do the referer validation if VALIDATE_REFERRER_ACTION_FLAG is set as
	 * true in orbionedirect.properties. Referer should match with any one of the url which is metioned in
	 * orbionedirect.properties as VALID_REFERERS.
	 * 
	 * @param request
	 * @return boolean
	 */
	private boolean isValidReferer(HttpServletRequest request)
	{
		ConfigurationManager confMngr = ConfigurationManager.getInstance();
		SecurityConfigurationDescriptor secDesc = confMngr.getSecurityDescriptor();
		boolean actionFlag = secDesc.isReferrerValidationEnabledForContext(request.getContextPath().replace("/", ""));
		boolean isValid = (!actionFlag);
		String referer = request.getHeader("referer");
		if (actionFlag && referer != null)
		{
			if (validReferers == null)
			{
				validReferers = getURLList(request, "VALID_REFERERS");
			}
			/** Validating the valid referers. */
			isValid = validReferers.contains(referer);

			if (!isValid)
			{
				logger.cterror("CTLGN00023", referer);
			}
		}
		return isValid;
	}

	/**
	 * This method will read the urls from orbionedirect.properties for the provided urlListKey and prefix the
	 * application uri and context path in each url and created the list.
	 * 
	 * @param request
	 * @param urlListKey
	 * @return List
	 */
	public List<String> getURLList(HttpServletRequest request, String urlListKey)
	{
		String contextPath = request.getContextPath();
		List<String> urlList = new ArrayList<String>();
		ConfigurationManager confMngr = ConfigurationManager.getInstance();
		SecurityConfigurationDescriptor secDesc = confMngr.getSecurityDescriptor();
		/** Setting the application URI with Context path. */
		if (appURIWithContextPath == null)
		{
			String url = request.getRequestURL().toString();
			appURIWithContextPath = (url.split(contextPath))[0] + contextPath;
		}

		String[] validReferersStr = secDesc.getAllReferrerListForContext(request.getContextPath().replace("/", ""));
		if (validReferersStr != null)
		{
			List<String> tmpList = Arrays.asList(validReferersStr);
			for (int i = 0; i < tmpList.size(); i++)
			{
				urlList.add(appURIWithContextPath + tmpList.get(i).trim());
			}
		}
		return urlList;
	}

	/**
	 * Steps taken to validate a session - a) The session should have a sessioninfo object. Then only it means a user is
	 * logged in b) If the client ip validation is needed, then the client ip from request and that in session info to
	 * be checked c) Check if the request has switched browsers. Compare the browser specific aspects from the
	 * user-agent stored in the session info against that in the request's user-agent d) The browser details may match,
	 * but OS details could have changed (indicating a change in machine, but no change in browser details) e) Need to
	 * store the channel id from where the login happened and if any change in channel id post login. Then request
	 * processing should not be allowed. May not be able to validate now. But once mobile FW included, channel_ID from
	 * login to be compared with current channel id. This will ensure that even if a user tries manipulating the user
	 * agent post login / change Target URL / JSP post login, this will not allow user to view across channel specific
	 * renditions.
	 * 
	 * @param request
	 * @return Returns the status after validation
	 */
	public String validateSession(HttpServletRequest request)
	{

		String lcmName = " [SessionManager.validateSession] ";
		HttpSession session = request.getSession(false);
		String status = "success";
		/** Return null value if session is not available. */
		if (session == null)
		{
			logger.cterror("CTLGN00024", lcmName);
			status = propReader.retrieveProperty(LoginMasterConstants.RESOURCE_BUNDLE_ERRORS, "LBL_SESSION_NULL");
			return status;
		}

		/** Validating the referrer. */
		if (!isValidReferer(request))
		{
			logger.cterror("CTLGN00025", lcmName);
			status = propReader.retrieveProperty(LoginMasterConstants.RESOURCE_BUNDLE_ERRORS, "LBL_INVALID_REFERER");
			return status;
		}

		SessionInfo sessInfo = null;
		sessInfo = (SessionInfo) session.getAttribute("sessionInfo");
		/** Return null value if sessionInfo is in session. It means user does not logged in the application. */
		if (sessInfo == null)
		{
			logger.ctinfo("CTLGN00026", lcmName);
			status = propReader.retrieveProperty(LoginMasterConstants.RESOURCE_BUNDLE_ERRORS, "LBL_SESSION_INFO");
			return status;
		}

		// This multilogin check is handled before itself.
		/** Validating the userNo according to the MULTILOGIN_STATUS_ACTION_FLAG value in orbionedirect.properties file. */

		/**
		 * Validating the userAgent value with sessionInfo value. It validates the Browser version as well as the OS
		 * value.
		 */
		String userAgent = request.getHeader("user-agent");
		if (userAgent == null || !userAgent.equals(sessInfo.userAgent))
		{
			logger.cterror("CTLGN00027", lcmName, sessInfo.userAgent, userAgent);
			status = propReader
					.retrieveProperty(LoginMasterConstants.RESOURCE_BUNDLE_ERRORS, "LBL_USER_AGENT_MISMATCH");
			return status;
		}

		/** Validating the client IP address. */
		ConfigurationManager confMgr = ConfigurationManager.getInstance();
		SecurityConfigurationDescriptor config = confMgr.getSecurityDescriptor();

		boolean clientIPValidation = config.isCheckClientIpDuringSessionValidation();
		logger.ctdebug("CTLGN00031", lcmName, clientIPValidation);
		boolean checkClientIPValidation = false;
		String sessionId = session.getId();
		String clientIp = request.getRemoteAddr();
		if (clientIPValidation)
		{
			checkClientIPValidation = sessionId.equals(sessInfo.sessionId) && clientIp.equals(sessInfo.requestIp);
		} else
		{
			checkClientIPValidation = sessionId.equals(sessInfo.sessionId);
		}
		logger.ctdebug("CTLGN00028", lcmName, checkClientIPValidation);
		if (checkClientIPValidation)
		{
			logger.ctdebug("CTLGN00029", lcmName);
		} else
		{
			logger.ctdebug("CTLGN00030", lcmName);
			status = propReader.retrieveProperty(LoginMasterConstants.RESOURCE_BUNDLE_ERRORS, "LBL_SESSION_INVALID");
			return status;
		}

		PerformanceTimer sessionError = new PerformanceTimer();
		StringBuffer sb = new StringBuffer();

		IAuthenticationServiceProvider provider = null;
		try
		{
			provider = AuthenticationProviderFactory.getAuthenticationServiceProvider();
			if (!provider.validateSession(request))
			{
				sessionError.startTimer(sb.toString() + "sessInfo = " + sessInfo);
				sessionError.endTimer();
				logger.ctdebug("CTLGN00032", lcmName);
				status = propReader
						.retrieveProperty(LoginMasterConstants.RESOURCE_BUNDLE_ERRORS, "LBL_SESSION_INVALID");
				return status;
			}
		} catch (AuthenticationException e)
		{
			e.printStackTrace();
		}

		return status;
	}

	/**
	 * This method will logout all
	 * 
	 * @param ServletContext
	 * @param status
	 * 
	 */
	public void logoutAll(ServletContext mSvrCtx, String status)
	{

		String lcmName = new String(" [SessionManager.logoutAll] ");

		try
		{

			logger.ctdebug("CTLGN00033", lcmName);

			HashMap sessionList = (HashMap) mSvrCtx.getAttribute("sessionList");
			Iterator iterSession = sessionList.keySet().iterator();

			String userNo = null;

			HttpSession session = null;

			while (iterSession.hasNext())
			{
				userNo = iterSession.next().toString();
				session = (HttpSession) sessionList.get(userNo);
				if (session != null)
					session.invalidate();

			}
			mSvrCtx.setAttribute("sessionList", new HashMap());

			status = "success";
		} catch (Exception p_ex)
		{

			status = "failure";
			logger.cterror("CTLGN00034", p_ex, lcmName, p_ex.getMessage());
		}
	}

	/**
	 * This method will remove users from context
	 * 
	 * @param ServletContext
	 * @param request
	 * 
	 */
	public void removeContextUser(ServletContext mSvrCtx, HttpServletRequest request)
	{
		String lcmName = new String(" [SessionManager.logoutAll] ");
		logger.ctinfo("CTLGN00035", lcmName);
		try
		{
			HashMap sessionList = (HashMap) mSvrCtx.getAttribute("sessionList");

			SessionInfo lSessionInfo = null;
			lSessionInfo = getUserSessionInfo(request);
			if (lSessionInfo != null)
			{
				String userNo = lSessionInfo.userNo;
				if (sessionList != null)
				{
					sessionList.remove(userNo);
					logger.ctdebug("CTLGN00036", lcmName, userNo);
				} else
				{
					logger.ctdebug("CTLGN00037", lcmName);
				}
			}
		} catch (Exception p_ex)
		{
			logger.cterror("CTLGN00038", p_ex, lcmName, p_ex.getMessage());
		}

	}

	/**
	 * This method will logout the user
	 * 
	 * @param ServletContext
	 * @param UserValue the user to be removed
	 * 
	 */

	public void logoutPwdUser(ServletContext mSvrCtx, IUserValue userValue)
	{

		String lcmName = new String(" [SessionManager.logoutAll] ");

		String userNo = userValue.getUserNo();
		try
		{

			HashMap sessionList = (HashMap) mSvrCtx.getAttribute("sessionList");
			HttpSession session = (HttpSession) sessionList.get(userNo);
			if (session != null)
				session.invalidate();

			sessionList.remove(userNo);

			userValue.setTransactionStatus("success");
		} catch (Exception p_ex)
		{
			userValue.setTransactionStatus("failure");
			logger.cterror("CTLGN00038", p_ex, lcmName, p_ex.getMessage());
		}
	}

	/**
	 * This method will populate the SessionInfo
	 * 
	 * @param HttpServletRequest
	 * @return Returns the SessionInfo
	 * 
	 */
	private SessionInfo populateSessionInfo(HttpServletRequest request)
	{
		SessionInfo lSessionInfo = null;
		IUserValue userValue = (IUserValue) request.getAttribute("UserValue");
		if (userValue == null)
			return new SessionInfo();
		String userNo = userValue.getUserNo();
		String defaultGcif = userValue.getPrimaryGcif();
		String defaultCif = userValue.getPrimaryCif();

		lSessionInfo = new SessionInfo();
		lSessionInfo.sCustNo = defaultGcif;
		lSessionInfo.sCustCif = defaultCif;
		lSessionInfo.isSimulationMode = userValue.isSimulated();
		lSessionInfo.simulatingUserId = userValue.getSimulatingUserNo();
		lSessionInfo.loginId = userValue.getLoginId();

		lSessionInfo.mLanguage = userValue.getLangId();
		lSessionInfo.direction = userValue.getDirection();
		lSessionInfo.authenticationType = userValue.getAuthenticationType();
		lSessionInfo.mAmtFormat = userValue.getAmountId();
		lSessionInfo.mDateFormat = userValue.getDateId();
		if (userValue.getTimeFormat() != null)
			lSessionInfo.timeFormat = userValue.getTimeFormat();
		lSessionInfo.lastLogin = userValue.getLastLogin();

		lSessionInfo.firstName = userValue.getFIRST_NAME();
		lSessionInfo.middleName = userValue.getMIDDLE_NAME();
		lSessionInfo.lastName = userValue.getLAST_NAME();

		lSessionInfo.mSecLang = userValue.getSeclangId();
		lSessionInfo.mEnaSecLang = userValue.getEnaSecLang();
		lSessionInfo.mStartUpWorkSpaceId = userValue.getStartUpWorkSpaceId();
		lSessionInfo.mTimeZoneId = userValue.getTimeZoneId();
		lSessionInfo.styleColor = userValue.getChangeStyle();

		int getGcifCount = userValue.getGcifCount();
		String[] getCorporateNames = userValue.getCorporateNames();
		String[] getGcifNo = userValue.getGcifNo();
		String[] getCifNo = userValue.getCifNo();
		lSessionInfo.invalidAttempts = userValue.getInvalidAttempts();
		lSessionInfo.gcifCount = getGcifCount;
		lSessionInfo.corporateNames = getCorporateNames;
		lSessionInfo.gcifNo = getGcifNo;
		lSessionInfo.cifNo = getCifNo;
		lSessionInfo.userNo = userNo;
		lSessionInfo.mPrefPage = userValue.getUrlId();
		lSessionInfo.customerType = userValue.getCustomerType();
		lSessionInfo.alertId = userValue.getAlertId();

		lSessionInfo.normalAlertsCounter = userValue.getNormalAlertsCounter();
		lSessionInfo.urgentAlertsCounter = userValue.getUrgentAlertsCounter();

		lSessionInfo.primaryCorporate = userValue.getPrimaryCorporate();
		lSessionInfo.sCustNo = defaultGcif;
		lSessionInfo.sCustCif = defaultCif;

		lSessionInfo.themeId = userValue.getThemeId();
		lSessionInfo.fontsizeId = userValue.getFontsizeId();

		lSessionInfo.prefWorkspace = userValue.getPreferredWorkspaceId();

		lSessionInfo.csrfId = java.util.UUID.randomUUID().toString();
		lSessionInfo.SecurityTokenSerialNo = userValue.getRSATokenSerialNo();
		lSessionInfo.userRole = userValue.getUserRole();

		lSessionInfo.loginMode = userValue.getLoginMode();

		lSessionInfo.primaryGcif = userValue.getPrimaryGcif();
		return lSessionInfo;
	}

	/**
	 * This method will get the user SessionInfo
	 * 
	 * @param HttpServletRequest
	 * @return Returns the SessionInfo
	 * 
	 */
	public SessionInfo getUserSessionInfo(HttpServletRequest request)
	{
		SessionInfo sessInfo = null;
		HttpSession session = request.getSession(false);
		if (session != null)
			sessInfo = (SessionInfo) session.getAttribute("sessionInfo");
		return sessInfo;
	}

	/**
	 * This method will set the user SessionInfo
	 * 
	 * @param HttpServletRequest
	 * @param SessionInfo
	 * 
	 */
	public void setUserSessionInfo(HttpServletRequest request, SessionInfo sessInfo)
	{
		HttpSession session = request.getSession(false);
		if (session != null)
			session.setAttribute("sessionInfo", sessInfo);
	}

	/**
	 * This method will set the CustomSessionInfo
	 * 
	 * @param HttpServletRequest
	 * @param key
	 * @param value
	 * @return int if success or -1 if not set
	 * 
	 */
	public int setCustomSessionInfo(HttpServletRequest request, String key, Object value)
	{
		SessionInfo sessInfo = null;
		int status = -1;
		HttpSession session = request.getSession(false);
		if (session == null)
			return status;
		sessInfo = (SessionInfo) session.getAttribute("sessionInfo");
		if (sessInfo == null)
		{
			return status;
		}
		status = sessInfo.setCustomSessionInfo(key, value);
		session.setAttribute("sessionInfo", sessInfo);
		return status;
	}

	/**
	 * This method routes the user to the Home Page as per the configuration.
	 * 
	 * @param httpRequest The servlet request
	 * @param httpResponse The servlet response
	 * @throws IOException thrown if any error occurs while routing the response
	 * @throws ServletException Thrown if any error occurs while routing the response
	 */
	public void routeToHomePage(HttpServletRequest httpRequest, HttpServletResponse httpResponse) throws IOException,
			ServletException
	{
		ConfigurationManager confMgr = ConfigurationManager.getInstance();
		SecurityConfigurationDescriptor config = confMgr.getSecurityDescriptor();
		// Now route the user as per the configuration
		if (ROUTING_MODE_FORWARD.equalsIgnoreCase(config.getHomePageRoutingMode()))
			httpRequest.getRequestDispatcher(config.getHomePageURI()).forward(httpRequest, httpResponse);
		else
			// Redundant check for routing mode redirect as those are the only 2 valid values.
			httpResponse.sendRedirect(httpRequest.getContextPath() + config.getHomePageURI());
	}

	/**
	 * This method routes the user to the Login Page as per the configuration.
	 * 
	 * @param httpRequest The servlet request
	 * @param httpResponse The servlet response
	 * @throws IOException thrown if any error occurs while routing the response
	 * @throws ServletException Thrown if any error occurs while routing the response
	 */
	public void routeToLoginPage(HttpServletRequest httpRequest, HttpServletResponse httpResponse) throws IOException,
			ServletException
	{
		ConfigurationManager confMgr = ConfigurationManager.getInstance();
		SecurityConfigurationDescriptor config = confMgr.getSecurityDescriptor();
		// Now route the user as per the configuration
		if (ROUTING_MODE_FORWARD.equalsIgnoreCase(config.getLoginPageRoutingMode()))
			httpRequest.getRequestDispatcher(config.getLoginPageURI()).forward(httpRequest, httpResponse);
		else
			// Redundant check for routing mode redirect as those are the only 2 valid values.
			httpResponse.sendRedirect(httpRequest.getContextPath() + config.getLoginPageURI());
	}

	/**
	 * This method routes the user to the Logout Page as per the configuration.
	 * 
	 * @param httpRequest The servlet request
	 * @param httpResponse The servlet response
	 * @throws IOException thrown if any error occurs while routing the response
	 * @throws ServletException Thrown if any error occurs while routing the response
	 */
	public void routeToLogoutPage(HttpServletRequest httpRequest, HttpServletResponse httpResponse) throws IOException,
			ServletException
	{
		ConfigurationManager confMgr = ConfigurationManager.getInstance();
		SecurityConfigurationDescriptor config = confMgr.getSecurityDescriptor();
		// Now route the user as per the configuration
		if (ROUTING_MODE_FORWARD.equalsIgnoreCase(config.getLogoutPageRoutingMode()))
			httpRequest.getRequestDispatcher(config.getLogoutPageURI()).forward(httpRequest, httpResponse);
		else
			// Redundant check for routing mode redirect as those are the only 2 valid values.
			httpResponse.sendRedirect(httpRequest.getContextPath() + config.getLogoutPageURI());
	}

	/**
	 * This method routes the user to the Error Page as per the configuration.
	 * 
	 * @param httpRequest The servlet request
	 * @param httpResponse The servlet response
	 * @throws IOException thrown if any error occurs while routing the response
	 * @throws ServletException Thrown if any error occurs while routing the response
	 */
	public void routeToErrorPage(HttpServletRequest httpRequest, HttpServletResponse httpResponse) throws IOException,
			ServletException
	{
		ConfigurationManager confMgr = ConfigurationManager.getInstance();
		SecurityConfigurationDescriptor config = confMgr.getSecurityDescriptor();
		// Now route the user as per the configuration
		if (ROUTING_MODE_FORWARD.equalsIgnoreCase(config.getErrorPageRoutingMode()))
			httpRequest.getRequestDispatcher(config.getErrorPageURI()).forward(httpRequest, httpResponse);
		else
			// Redundant check for routing mode redirect as those are the only 2 valid values.
			httpResponse.sendRedirect(httpRequest.getContextPath() + config.getErrorPageURI());
	}

	/**
	 * This method routes the user to the Expiry Page as per the configuration.
	 * 
	 * @param httpRequest The servlet request
	 * @param httpResponse The servlet response
	 * @throws IOException thrown if any error occurs while routing the response
	 * @throws ServletException Thrown if any error occurs while routing the response
	 */
	public void routeToExpiryPage(HttpServletRequest httpRequest, HttpServletResponse httpResponse) throws IOException,
			ServletException
	{
		ConfigurationManager confMgr = ConfigurationManager.getInstance();
		SecurityConfigurationDescriptor config = confMgr.getSecurityDescriptor();
		// Now route the user as per the configuration
		if (ROUTING_MODE_FORWARD.equalsIgnoreCase(config.getExpiryPageRoutingMode()))
			httpRequest.getRequestDispatcher(config.getExpiryPageURI()).forward(httpRequest, httpResponse);
		else
			// Redundant check for routing mode redirect as those are the only 2 valid values.
			httpResponse.sendRedirect(httpRequest.getContextPath() + config.getExpiryPageURI());
	}

	/**
	 * This method routes the user to the Invalid Session Page as per the configuration.
	 * 
	 * @param httpRequest The servlet request
	 * @param httpResponse The servlet response
	 * @throws IOException thrown if any error occurs while routing the response
	 * @throws ServletException Thrown if any error occurs while routing the response
	 */
	public void routeToInvalidSessionPage(HttpServletRequest httpRequest, HttpServletResponse httpResponse)
			throws IOException, ServletException
	{
		ConfigurationManager confMgr = ConfigurationManager.getInstance();
		SecurityConfigurationDescriptor config = confMgr.getSecurityDescriptor();
		// Now route the user as per the configuration
		if (ROUTING_MODE_FORWARD.equalsIgnoreCase(config.getInvalidSessionPageRoutingMode()))
			httpRequest.getRequestDispatcher(config.getInvalidSessionPageURI()).forward(httpRequest, httpResponse);
		else
			// Redundant check for routing mode redirect as those are the only 2 valid values.
			httpResponse.sendRedirect(httpRequest.getContextPath() + config.getInvalidSessionPageURI());
	}
}
