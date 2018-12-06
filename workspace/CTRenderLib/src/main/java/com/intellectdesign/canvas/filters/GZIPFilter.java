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
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Class for GZip filter which implements filter
 * 
 * @version 1.0
 */
public class GZIPFilter implements Filter
{
	private FilterConfig config;

	public GZIPFilter()
	{
	}

	/**
	 * To initialize the filter
	 * 
	 * @param filterconfig the configuration of the filter
	 */

	public void init(FilterConfig filterconfig)
	{
		config = filterconfig;
	}

	/**
	 * Filters perform filtering in the doFilter method
	 * 
	 * @param ServletRequest
	 * @param ServletResponse
	 * @param FilterChain
	 * @throws IOException
	 */

	public void doFilter(ServletRequest servletrequest, ServletResponse servletresponse, FilterChain filterchain)
			throws IOException, ServletException
	{
		String gzipRequired = "true";
		// CTProperties.getProperty(GZIP_IPORTAL_RESPONSE);
		boolean compressFiles = Boolean.valueOf(gzipRequired.trim()).booleanValue();
		if (!compressFiles)
		{
			filterchain.doFilter(servletrequest, servletresponse);
			return;
		}
		if (servletrequest instanceof HttpServletRequest)
		{
			HttpServletRequest httpservletrequest = (HttpServletRequest) servletrequest;
			HttpServletResponse httpservletresponse = (HttpServletResponse) servletresponse;
			String s = httpservletrequest.getHeader("accept-encoding");
			if (s != null && s.indexOf("gzip") != -1)
			{
				p("Client supports compression : Request URL is " + httpservletrequest.getRequestURI());
				GZIPResponseWrapper gzipresponsewrapper = new GZIPResponseWrapper(httpservletresponse);
				filterchain.doFilter(servletrequest, gzipresponsewrapper);
				gzipresponsewrapper.finishResponse();
				return;
			}
			p("Client doesn't support compression : Request URL is " + httpservletrequest.getRequestURI());

			filterchain.doFilter(servletrequest, servletresponse);
		}
	}

	/**
	 * Static method
	 * 
	 * @param s
	 */
	private static void p(String s)
	{

	}

	/**
	 * Method for destroying
	 * 
	 * @see javax.servlet.Filter#destroy()
	 */
	public void destroy()
	{
		// Nothing to do here
	}

}