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
/**
 * Purpose: Filter for initiatlizing current user information for logging purposes.
 * The following should be added as appropriate in the web.xml
 -------------------------------------------------------------
 <filter> 
 <filter-name>LogInitializationFilter</filter-name> 
 <display-name>LogInitializationFilter</display-name> 
 <filter-class>LogInitializationFilter</filter-class> 	
 </filter> 
 <filter-mapping> 
 <filter-name>LogInitializationFilter</filter-name> 
 <url-pattern>[Web components to be protected]</url-pattern> 
 </filter-mapping>
 ----------------------------------------------------------------
 *
 */

package com.intellectdesign.canvas.filters;

import java.io.IOException;
import java.util.UUID;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.SecurityConfigurationDescriptor;
import com.intellectdesign.canvas.constants.common.FrameworkConstants;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.logging.PerformanceTimer;
import com.intellectdesign.canvas.logging.initalizer.Log4jMDCInitializer;
import com.intellectdesign.canvas.login.sessions.SessionInfo;
import com.intellectdesign.canvas.login.sessions.SessionManager;
import com.intellectdesign.canvas.utils.CanvasThreadLocal;
import com.intellectdesign.canvas.utils.StringUtils;

/**
 * This is the filter used by the Canvas framework to do few basic initializations prior to processing -
 * <ul>
 * <li>Set the Request character encoding to UTF-8 if not already set</li>
 * <li>Initialize the Thread locals used for logging as well as Canvas internal processing</li>
 * <li>Setup the Performance timer to monitor the time taken for the request processing</li>
 * <li>Handle the X-FRAME-OPTIONS header inclusion in the response. This is based on the configuration provided as part
 * of the Security Descriptor</li>
 * </ul>
 * This filter should be attached to all the URL patterns within the Application to ensure correct processing of the
 * request by Canvas framework
 */
public class LogInitializationFilter implements Filter
{
	private FilterConfig filterConfig;
	private Log4jMDCInitializer mInitializer;

	/**
	 * To initialize the filter
	 * 
	 * @param config
	 * @throws ServletException
	 */

	public void init(FilterConfig config) throws ServletException
	{
		this.filterConfig = config;
		this.mInitializer = new Log4jMDCInitializer();
	}

	/**
	 * Invoked when the filter is destroyed
	 * 
	 * @see javax.servlet.Filter#destroy()
	 */
	public void destroy()
	{
		// Nothing to do here
	}

	/**
	 * Filters perform filtering in the doFilter method
	 * 
	 * @param request
	 * @param response
	 * @param chain
	 * @throws IOException
	 * @throws ServletException
	 */

	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException,
			ServletException
	{
		PerformanceTimer logInit = new PerformanceTimer();
		try
		{
			// Step 1: Ensure that the character encoding is set right; just in case it is not set
			if (request.getCharacterEncoding() == null)
			{
				request.setCharacterEncoding("UTF-8");
			}
			// Step 2: Initialize the Thread locals
			String reqId = UUID.randomUUID().toString();
			HttpServletRequest req = (HttpServletRequest) request;
			String requestUri = req.getRequestURI();
			String Host = request.getRemoteAddr();
			String userNo = getUserNoFrom(req);

			mInitializer.initLog4jMDC(userNo, Host, reqId);
			CanvasThreadLocal.putAll(mInitializer.getMDCData());
			CanvasThreadLocal.put(FrameworkConstants.CONTEXT_APPLICATION_ID, req.getContextPath());

			LOGGER.ctdebug("CTRND00057", reqId);
			LOGGER.ctinfo("CTRND00058", userNo);

			// Step 3: Start the performance timer.
			logInit.startTimer("Request ID:" + reqId + " Request URI:" + requestUri);

			LOGGER.ctdebug("CTRND00059", this.filterConfig.getInitParameter("urlpattern"));
			LOGGER.ctdebug("CTRND00060", requestUri);
			request.setAttribute("requestURI", requestUri);

			// Step 4: Handle the X-FRAME-OPTIONS header configuration request.
			handleXFrameOptionsFor(req, ((HttpServletResponse) response));

			// Ask the chain to proceed.
			chain.doFilter(request, response);

			LOGGER.ctdebug("CTRND00061");
		} finally
		{
			logInit.endTimer();
			// Clear out our Thread locals
			mInitializer.removeFromMDC();
			CanvasThreadLocal.clear();
		}
	}

	/**
	 * Helper method that handles the X-FRAME-OPTIONS header setting to be done on the response
	 * 
	 * @param req
	 * @param resp
	 */
	private void handleXFrameOptionsFor(HttpServletRequest req, HttpServletResponse resp)
	{
		// Get the details from the security configuration.
		SecurityConfigurationDescriptor sc = ConfigurationManager.getInstance().getSecurityDescriptor();
		String xFrameOption = sc.getXframeOptionDefaultValue();
		String[] ignoreUrlsList = sc.getXframeOptionIgnoreURLList();
		String requestUri = req.getRequestURI();

		if (isUriPresentIn(requestUri, ignoreUrlsList, req))
			return;

		// For backward compatibility, check the filter config also for the array of Urls.
		if (this.filterConfig.getInitParameter("urlpattern") != null)
		{
			ignoreUrlsList = StringUtils.convertToArray(filterConfig.getInitParameter("urlpattern"), ",");
			if (isUriPresentIn(requestUri, ignoreUrlsList, req))
				return;
		}

		resp.addHeader("X-FRAME-OPTIONS", xFrameOption);
	}

	/**
	 * Helper method to check for the match between the Request URI and the ignore URLs list.
	 * 
	 * @param requestUri
	 * @param ignoreUrlsList
	 * @return
	 */
	private boolean isUriPresentIn(String requestUri, String[] ignoreUrlsList, HttpServletRequest req)
	{
		boolean isPresent = false;
		for (String aUri : ignoreUrlsList)
		{
			// If there is a match with the request Url configured, then skip
			if (requestUri.startsWith(req.getContextPath() + aUri))
			{
				isPresent = true;
				break;
			}
		}
		return isPresent;
	}

	/**
	 * Gets the user number in the following sequence - Session Info -> Header -> Request
	 * 
	 * @param req The request received
	 * @return The User Number. If not available, then a constant 'USER_NO_UNAVAILABLE' is returned.
	 */
	private String getUserNoFrom(HttpServletRequest req)
	{
		String userNo = "";
		SessionInfo sessInfo = SessionManager.getInstance().getUserSessionInfo(req);
		String userNo_Header = req.getHeader("userNo");
		String userNo_Request = req.getParameter("userNo");

		userNo = (sessInfo != null) ? sessInfo.userNo : ((userNo_Header == null) ? userNo_Request : userNo_Header);

		return (userNo == null) ? "USER_NO_UNAVAILABLE" : userNo;
	}

	private static final Logger LOGGER = Logger.getLogger(LogInitializationFilter.class);
}
