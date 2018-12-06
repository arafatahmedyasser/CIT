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

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.intellectdesign.canvas.utils.UAgentInfo;

/**
 * Class used for detecting device using filter.
 * 
 * @version 1.0
 * 
 */
public class DeviceDetectFilter implements Filter
{
	/**
	 * (non-Javadoc)
	 * 
	 * @see javax.servlet.Filter#destroy()
	 */
	public void destroy()
	{

	}

	/**
	 * Filters perform filtering in the doFilter method
	 * 
	 * @param req
	 * @param res
	 * @param chain
	 * @throws IOException
	 * @throws ServletException
	 * @see javax.servlet.Filter#doFilter(javax.servlet.ServletRequest, javax.servlet.ServletResponse,
	 *      javax.servlet.FilterChain)
	 */
	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException,
			ServletException
	{
		HttpServletRequest request = (HttpServletRequest) req;
		HttpServletResponse response = (HttpServletResponse) res;
		String userAgent = request.getHeader("User-Agent");
		String httpAccept = request.getHeader("Accept");
		UAgentInfo detector = new UAgentInfo(userAgent, httpAccept);
		String mobExp = "m_";
		Cookie[] cookies = request.getCookies();
		Boolean isDesktopModeEnabled = false;
		if (cookies != null)
		{
			for (Cookie cookie : cookies)
			{
				if (cookie.getName().equals("DESKTOP_MODE"))
				{
					isDesktopModeEnabled = "true".equals(cookie.getValue()) ? true : false;
					break;
				}
			}
		}
		if (detector.detectTierTablet() && !isDesktopModeEnabled)
		{
			request.setAttribute("deviceType", "T");
		} else if (detector.detectMobileQuick() && !isDesktopModeEnabled) /* EOF Enhancement */
		{
			request.setAttribute("deviceType", "M");
		} else
		{
			request.setAttribute("deviceType", "D");
		}
		String url = "";
		String uri = request.getServletPath();

		if (uri.indexOf(".jsp") == -1)
		{
			chain.doFilter(req, res);
			return;
		}

		if (uri != null)
		{
			String uriArr[] = uri.split("/");
			if (uriArr != null && uriArr.length > 0)
			{
				String fileName = uriArr[uriArr.length - 1];
				String newFileName = "";
				if (detector.detectMobileQuick() && !isDesktopModeEnabled)
				{
					if (fileName != null && !fileName.startsWith(mobExp))
					{
						newFileName = mobExp + fileName;
						url = uri.replaceAll(fileName, newFileName);

						request.getRequestDispatcher(url).forward(request, response);
						return;
					}
				} else
				{
					chain.doFilter(req, res);
					return;
				}
			}
		}
		chain.doFilter(req, res);
	}

	/**
	 * for initializing filter
	 * 
	 * @param config
	 * @throws ServletException
	 * @see javax.servlet.Filter#init(javax.servlet.FilterConfig)
	 */
	public void init(FilterConfig config) throws ServletException
	{

	}

}
