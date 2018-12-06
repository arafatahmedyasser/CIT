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
package com.intellectdesign.canvas.filters;

import java.io.IOException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.SecurityConfigurationDescriptor;
import com.intellectdesign.canvas.data.conversion.util.HashMapToJSONConverter;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.login.sessions.SessionInfo;
import com.intellectdesign.canvas.login.sessions.SessionManager;
import com.intellectdesign.canvas.utils.UAgentInfo;

/**
 * This is a servlet filter that is used by the Canvas framework for enabling CSRF Validation for the incoming request.
 * This relies on the below configuration from the Security Configuration of Canvas -
 * <ul>
 * <li><b>CSRF_VALIDATION_ENABLED</b>: This is a boolean configuration to indicate whether CSRF Validation is enabled or
 * not. A boolean configuration for Boolean.TRUE is one of "yes", "y", "true", "1" (ignore case). All other values will
 * be treated as equivalent of Boolean.FALSE</li>
 * <li><b>CSRF_TOKEN_FIELD_NAME</b>: This is the key under which the CSRF Token will be sent by the browser to the
 * server.</li>
 * <li><b>CSRF_IGNORE_URLS</b>: This is a comma separated list of URIs. This should not include the context root of the
 * application</li>
 * </ul>
 */
public class CSRFValidationFilter implements Filter
{
	/**
	 * Invoked when the filter is destroyed.
	 * 
	 * @see javax.servlet.Filter#destroy()
	 */
	public void destroy()
	{
		// nothing to do here
	}

	/**
	 * Perform the CSRF Validation here
	 * 
	 * @param ServletRequest
	 * @param ServletResponse
	 * @param FilterChain
	 * @throws IOException
	 * @throws ServletException
	 */
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain arg2) throws IOException,
			ServletException
	{
		ConfigurationManager conf = ConfigurationManager.getInstance();
		SecurityConfigurationDescriptor sc = conf.getSecurityDescriptor();
		String csrfTokenKey = sc.getCsrfTokenFieldName();
		HttpServletRequest req = (HttpServletRequest) request;
		HttpServletResponse resp = (HttpServletResponse) response;
		HttpSession session = req.getSession(false);
		SessionInfo sessioninfo = null;
		String csrfFromRequest;


		if (!isCSRFValidationEnabledFor(req))
		{
			// CSRF Validation is not enabled. So just forward the request down the chain.
			arg2.doFilter(request, response);
			return;
		}

		LOGGER.ctdebug("CTRND00049", req.getRequestURI());
		LOGGER.ctdebug("CTRND00050", getRequestParameters(req));
		LOGGER.ctdebug("CTRND00051", request.getParameter(csrfTokenKey));
		// Check if this is an authenticated session. Handle appropriately.
		if (session != null && !session.isNew())
		{
			sessioninfo = SessionManager.getInstance().getUserSessionInfo(req);
			LOGGER.ctdebug("CTRND00052", sessioninfo);

			if (sessioninfo == null)
			{
				// Not an authenticated session. Route to expiry page.
				SessionManager.getInstance().routeToExpiryPage(req, resp);
				return;
			}
			// So it is a valid session.
			LOGGER.ctdebug("CTRND00053", sessioninfo.csrfId);

			csrfFromRequest = request.getParameter(csrfTokenKey);
			if (csrfFromRequest == null)
			{
				// No CSRF Key present in request. So route to invalid session page
				LOGGER.cterror("CTRND00055");
				SessionManager.getInstance().routeToInvalidSessionPage(req, resp);
				return;
			}
			// Check whether csrf id coming from request is same as the one stored in session
			if (sessioninfo.csrfId.equals(csrfFromRequest))
			{
				arg2.doFilter(request, response);
				return;
			}
			// If the control reaches here that means that CSRF did not match. So route to error page.
			LOGGER.cterror("CTRND00054");
			SessionManager.getInstance().routeToInvalidSessionPage(req, resp);
			return;
		}

		UAgentInfo detector = new UAgentInfo(req.getHeader("User-Agent"), req.getHeader("Accept"));

		// This means that this is a new or unauthenticated session. From CSRF Validation perspective, this is an error
		// scenario
		if (detector.detectMobileQuick())
		{
			Map tmpMap = new HashMap();
			tmpMap.put("Status", "Session invalid");
			resp.getWriter().write(HashMapToJSONConverter.convertHashMapToJSONFormat(tmpMap));
		} else
		{
			SessionManager.getInstance().routeToExpiryPage(req, resp);
		}
	}

	/**
	 * Helper method to check whether CSRF Validation is enabled for this request or not. This takes into account the
	 * configuration in the security descriptor for enabling the CSRF validation as well as the ignore URL list
	 * 
	 * @param req The request received
	 * @return true, if CSRF Validation is enabled for this request, false otherwise.
	 */
	private boolean isCSRFValidationEnabledFor(HttpServletRequest req)
	{
		ConfigurationManager conf = ConfigurationManager.getInstance();
		SecurityConfigurationDescriptor sc = conf.getSecurityDescriptor();
		String requestUri = req.getRequestURI();
		boolean enabled = sc.isCsrfEnabled();

		if (enabled)
		{
			// Check from the URI whether it is added to the ignore list.
			String[] ignoreURLs = sc.getCsrfIgnoreURLs();
			for (String aURL : ignoreURLs)
			{
				if (requestUri.startsWith(req.getContextPath() + aURL))
				{
					enabled = false;
					break;
				}
			}
		}
		return enabled;
	}

	/**
	 * To get the RequestParameters from the request
	 * 
	 * @param HttpServletRequest
	 * @return String representation of all the RequestParameters
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
	 * Initializing filter
	 * 
	 * @param arg0
	 * @throws ServletException
	 * @see javax.servlet.Filter#init(javax.servlet.FilterConfig)
	 */
	public void init(FilterConfig arg0) throws ServletException
	{
		// Do nothing here
	}

	private static final Logger LOGGER = Logger.getLogger(CSRFValidationFilter.class);
}
