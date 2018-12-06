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

package com.intellectdesign.canvas.servercomm.encryption.filters;

import java.util.Collections;
import java.util.Enumeration;
import java.util.Map;
import java.util.TreeMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

/**
 * Class for Custom Request Wrapper which extends HttpServletRequestWrapper
 * 
 * @version 1.0
 */
public class CustomRequestWrapper extends HttpServletRequestWrapper
{
	private final Map<String, String[]> modifiableParameters;
	private Map<String, String[]> allParameters = null;

	/**
	 * Create a new request wrapper that will merge additional parameters into the request object without prematurely
	 * reading parameters from the original request.
	 * 
	 * @param request
	 * @param additionalParams
	 */
	public CustomRequestWrapper(final HttpServletRequest request, final Map<String, String[]> additionalParams)
	{
		super(request);
		modifiableParameters = new TreeMap<String, String[]>();
		modifiableParameters.putAll(additionalParams);
	}

	/**
	 * get the string name
	 * 
	 * @param name
	 * @return String
	 * @see javax.servlet.ServletRequestWrapper#getParameter(java.lang.String)
	 */
	@Override
	public String getParameter(final String name)
	{
		String[] strings = getParameterMap().get(name);
		if (strings != null)
		{
			return strings[0];
		}
		return super.getParameter(name);
	}

	/**
	 * get the Parameter Map
	 * 
	 * @return Map<String, String[]>
	 * @see javax.servlet.ServletRequestWrapper#getParameterMap()
	 */
	@Override
	public Map<String, String[]> getParameterMap()
	{
		if (allParameters == null)
		{
			allParameters = new TreeMap<String, String[]>();
			allParameters.putAll(super.getParameterMap());
			allParameters.putAll(modifiableParameters);
		}
		// Return an unmodifiable collection because we need to uphold the interface contract.
		return Collections.unmodifiableMap(allParameters);
	}

	/**
	 * get the Parameter names
	 * 
	 * @return Enumeration<String>
	 * @see javax.servlet.ServletRequestWrapper#getParameterNames()
	 */
	@Override
	public Enumeration<String> getParameterNames()
	{
		return Collections.enumeration(getParameterMap().keySet());
	}

	/**
	 * get the Parameter values
	 * 
	 * @param name
	 * @return string[]
	 * @see javax.servlet.ServletRequestWrapper#getParameterValues(java.lang.String)
	 */
	@Override
	public String[] getParameterValues(final String name)
	{
		return getParameterMap().get(name);
	}
}