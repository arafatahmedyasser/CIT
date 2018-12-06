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
package com.intellectdesign.canvas.servlets;

import java.io.IOException;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.jsmetadata.CanvasJsDataProviderFactory;
import com.intellectdesign.canvas.jsmetadata.ICanvasJsDataProvider;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.login.sessions.SessionManager;

/**
 * A servlet class for Canvas Js data
 * 
 * @version 1.0
 */
public class CanvasJsDataServlet extends HttpServlet
{

	private static final long serialVersionUID = 1L;

	/**
	 * override the init method of servlet config
	 * 
	 * @param woConfig
	 * @throws ServletException
	 */

	public void init(ServletConfig woConfig) throws ServletException
	{
		super.init(woConfig);
	}

	/**
	 * handles incoming HTTP GET requests
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
	 * handles incoming HTTP POST requests
	 * 
	 * @param request
	 * @param response
	 * @throws ServletException
	 * @throws IOException
	 */

	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		response.setContentType("text/javascript;charset=UTF-8");
		response.setHeader("Cache-Control", "no-cache");
		ICanvasJsDataProvider canvasJsDataProvider = null;
		String jsondataString = "";
		try
		{
			SessionManager lSessionManager = SessionManager.getInstance();
			if (!"success".equals(lSessionManager.validateSession(request)))
			{
				lSessionManager.routeToExpiryPage(request, response);
				return;
			}
			CanvasJsDataProviderFactory canvasJsDataProviderFactory = CanvasJsDataProviderFactory.getInstance();
			canvasJsDataProvider = canvasJsDataProviderFactory.getJsDataProvider(request.getParameter("module"));
			jsondataString = canvasJsDataProvider.getJavaScriptData(request);
		} catch (ProcessingErrorException processingErrException)
		{
			logger.cterror("CTRND00290", processingErrException);
		}
		response.getWriter().write(jsondataString);
		return;
	}

	private static final Logger logger = Logger.getLogger(CanvasJsDataServlet.class);

}