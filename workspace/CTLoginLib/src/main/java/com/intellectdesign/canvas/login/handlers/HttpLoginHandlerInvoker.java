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

import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.net.URL;
import java.net.URLConnection;
import java.util.HashMap;
import java.util.Map;

import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.ImplClassDescriptor;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.logging.initalizer.Log4jMDCInitializer;
import com.intellectdesign.canvas.utils.CanvasThreadLocal;
import com.intellectdesign.canvas.value.CanvasRequestVO;

/**
 * This invoker is to be used when the deployment configuration has the application / handler / service components in a
 * separate JVM and there is a need to do a VM hom using HTTP request. This assumes that the CanvasHttpLoginServlet
 * provided is activated in the target server and the details of the same are provide as part of the Implementation
 * Class configuration descriptor.
 * 
 * For this to work, it is expected that the com.intellectdesign.canvas.action.HttpCanvasInvokerServlet is registered as
 * a servlet in the remote web application and the URL pointing till the servlet name is provided in the implementation
 * class descriptor under the key <b>HTTP_LOGIN_INVOKER_URL</b>
 */
public class HttpLoginHandlerInvoker implements ILoginHandlerInvoker
{
	/**
	 * Default constructor
	 */
	public HttpLoginHandlerInvoker()
	{
		// Nothing to do here
	}

	/**
	 * @param request The request received
	 * @return The response to be sent out
	 * @throws ProcessingErrorException Thrown if any error occurs while processing the request.
	 * @see com.intellectdesign.canvas.login.handlers.ILoginHandlerInvoker#invokeLoginHandler(com.intellectdesign.canvas.value.CanvasRequestVO)
	 */
	@Override
	public ExtReplyObject invokeLoginHandler(CanvasRequestVO request) throws ProcessingErrorException
	{
		String hostCode = "LOGIN";
		ExtReplyObject replyObj = null;
		ImplClassDescriptor descriptor = ConfigurationManager.getInstance().getImplClassDescriptor();
		Map payload = new HashMap();
		// Add the request context to the payload
		payload.put("CONTEXT", getContextData());
		// Add the complete request to the payload.
		payload.put("REQUEST", request);
		payload.put("TRAN_CODE", hostCode);
		try
		{
			replyObj = sendUrlRequest(payload, descriptor.getHttpLoginInvokerUrl());
		} catch (IOException e)
		{
			LOGGER.cterror("CTLGN00061", e, hostCode, request);
			throw new ProcessingErrorException("COMN_ERR", "Error during communication to remote system", e);
		} catch (ClassNotFoundException e)
		{
			LOGGER.cterror("CTLGN00061", e, hostCode, request);
			throw new ProcessingErrorException("COMN_ERR", "Error during communication to remote system", e);
		}
		LOGGER.ctdebug("CTBAS00085", hostCode, replyObj);
		return replyObj;
	}

	/**
	 * This method sends out the request data to the provided URL and sends back the response that it receives.
	 * 
	 * @param requestData The request data
	 * @param remoteurl The URL to which the data is to be sent out
	 * @return The response received from the request
	 * @throws IOException Thrown if any error occurs during communication.
	 * @throws ClassNotFoundException Thrown if the object received as response is of a class that is not present. This
	 *             cannot happen. And is present more to catch the Checked exception
	 */
	private ExtReplyObject sendUrlRequest(Map requestData, URL remoteurl) throws IOException, ClassNotFoundException
	{
		ExtReplyObject reply = null;

		URLConnection conn = remoteurl.openConnection();
		conn.setDoInput(true);
		conn.setDoOutput(true);

		// Transfer the entire request data
		ObjectOutputStream oos = new ObjectOutputStream(conn.getOutputStream());
		oos.writeObject(requestData);
		oos.close();

		ObjectInputStream ois = new ObjectInputStream(conn.getInputStream());
		reply = (ExtReplyObject) ois.readObject();
		ois.close();

		return reply;
	}

	/**
	 * Prepares the parameter to be sent for remote invocation
	 * 
	 * @param params The parameters to be passed to the remote call
	 */
	private Map getContextData()
	{
		Log4jMDCInitializer mdcData = new Log4jMDCInitializer();
		Map requestContext = mdcData.getMDCData();
		// Retrieve from the Canvas Thread Local too.
		requestContext.putAll(CanvasThreadLocal.retrieveAllData());
		return requestContext;
	}

	// Logger instance for this class
	private static final Logger LOGGER = Logger.getLogger(HttpLoginHandlerInvoker.class);

}
