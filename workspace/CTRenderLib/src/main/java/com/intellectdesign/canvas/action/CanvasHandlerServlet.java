/**
 * Copyright 2015. Intellect Design Arena Limited. All rights reserved. 
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
package com.intellectdesign.canvas.action;

import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.rmi.RemoteException;
import java.util.Map;
import java.util.Vector;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.handler.bean.RequestHandlerInvokerBeanRemote;
import com.intellectdesign.canvas.logging.initalizer.Log4jMDCInitializer;
import com.intellectdesign.canvas.utils.CanvasThreadLocal;
import com.intellectdesign.canvas.utils.StringUtils;
import com.intellectdesign.canvas.value.CanvasRequestVO;

/**
 * This is the servlet that is paired to the HttpCanvasHandlerInvoker as the Handler Invoker class. This servlet is to
 * be activated and will process the request only when it is in the proper structure as sent by the
 * HttpCanvasHandlerInvoker class
 */
public class CanvasHandlerServlet extends HttpServlet
{

	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = -725024703270754607L;

	/**
	 * Default constructor.
	 */
	public CanvasHandlerServlet()
	{
		// Nothing to do here.
	}

	/**
	 * @param req
	 * @param resp
	 * @throws ServletException
	 * @throws IOException
	 * @see javax.servlet.http.HttpServlet#doGet(javax.servlet.http.HttpServletRequest,
	 *      javax.servlet.http.HttpServletResponse)
	 */
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException
	{
		doPost(req, resp);
	}

	/**
	 * @param req The request received
	 * @param resp The response to be sent out
	 * @throws ServletException Thrown if any error occurs while processing the request
	 * @throws IOException Thrown if there is an IO error faced
	 * @see javax.servlet.http.HttpServlet#doPost(javax.servlet.http.HttpServletRequest,
	 *      javax.servlet.http.HttpServletResponse)
	 */
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException
	{
		ObjectInputStream ois = new ObjectInputStream(req.getInputStream());
		Map requestPacket = null;
		ExtReplyObject reply = null;
		try
		{
			requestPacket = (Map) ois.readObject();
		} catch (ClassNotFoundException e)
		{
			// Ideally this should not happen.
			throw new ServletException("The parameter provided is not an object of a class available in class path.", e);
		}
		ois.close();
		Map contextData = (Map) requestPacket.get("CONTEXT");
		CanvasRequestVO request = (CanvasRequestVO) requestPacket.get("REQUEST");
		String tranCode = (String) requestPacket.get("TRAN_CODE");
		if (contextData == null || request == null || StringUtils.isEmpty(tranCode))
			throw new ServletException(
					"The request received is an invalid request. It does not have all the mandatory parameters");

		try
		{
			reply = process(contextData, request, tranCode);
		} catch (ProcessingErrorException e)
		{
			throw new ServletException("Caught processing error while processing request", e);
		}
		ObjectOutputStream oos = new ObjectOutputStream(resp.getOutputStream());
		oos.writeObject(reply);
		oos.close();
	}

	/**
	 * 
	 * @param requestContext The Request context
	 * @param requestData The request Data
	 * @param tranCode The transaction code
	 * @return The response for the request
	 * @throws RemoteException Thrown if any error occurs while the remote operation related processing
	 * @throws ProcessingErrorException Thrown if any error occurs while processing the request.
	 * @see RequestHandlerInvokerBeanRemote#process(Map, Vector, String)
	 */
	private ExtReplyObject process(Map requestContext, CanvasRequestVO requestData, String tranCode)
			throws ProcessingErrorException
	{
		// Step 1: Set the request context on current thread.
		Log4jMDCInitializer initializer = new Log4jMDCInitializer();
		initializer.initLog4jMDC(requestContext);
		CanvasThreadLocal.putAll(requestContext);

		SimpleCanvasHandlerInvoker invoker = new SimpleCanvasHandlerInvoker();

		// Step 2: Identify the handler class and invoke the same.
		ExtReplyObject result = null;
		try
		{
			result = invoker.invokeRequestHandler(requestData, tranCode);
		} finally
		{
			// Step 3: Clear request context.
			initializer.removeFromMDC();
			CanvasThreadLocal.clear();
		}

		return result;
	}

}
