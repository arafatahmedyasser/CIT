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
 * This is the invoker implementation that looks to invoke the handler by making a Http request rather than direct
 * invocation or EJB call. This is useful in cases where the deployment architecture does not use a JEE container but a
 * simple web container like Tomcat.
 * 
 * For this to work, it is expected that the com.intellectdesign.canvas.action.HttpCanvasInvokerServlet is registered as
 * a servlet in the remote web application and the URL pointing till the servlet name is provided in the implementation
 * class descriptor under the key <b>HTTP_HANDLER_INVOKER_URL</b>
 */
public class HttpCanvasHandlerInvoker implements ICanvasHandlerInvoker
{
	private static final Logger LOGGER = Logger.getLogger(HttpCanvasHandlerInvoker.class);

	/**
	 * @param request The request to be sent out.
	 * @param tranCode The transaction code / handler code
	 * @return The response received for this request
	 * @throws ProcessingErrorException Thrown if any error occurs while processing this request
	 * @see com.intellectdesign.canvas.action.ICanvasHandlerInvoker#invokeRequestHandler(com.intellectdesign.canvas.value.CanvasRequestVO,
	 *      java.lang.String)
	 */
	@Override
	public ExtReplyObject invokeRequestHandler(CanvasRequestVO request, String tranCode)
			throws ProcessingErrorException
	{
		ExtReplyObject replyObj = null;
		ImplClassDescriptor descriptor = ConfigurationManager.getInstance().getImplClassDescriptor();
		Log4jMDCInitializer mdcData = new Log4jMDCInitializer();
		Map requestContext = mdcData.getMDCData();
		// Retrieve from the Canvas Thread Local too.
		requestContext.putAll(CanvasThreadLocal.retrieveAllData());

		Map requestData = new HashMap();
		requestData.put("CONTEXT", requestContext);
		requestData.put("REQUEST", request);
		requestData.put("TRAN_CODE", tranCode);

		try
		{
			replyObj = sendUrlRequest(requestData, descriptor.getHttpHandlerInvokerUrl());
		} catch (IOException e)
		{
			LOGGER.cterror("CTBAS00084", e, tranCode, request);
			throw new ProcessingErrorException("COMN_ERR", "Error during communication to remote system", e);
		} catch (ClassNotFoundException e)
		{
			LOGGER.cterror("CTBAS00084", e, tranCode, request);
			throw new ProcessingErrorException("COMN_ERR", "Error during communication to remote system", e);
		}
		LOGGER.ctdebug("CTBAS00085", tranCode, replyObj);
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

}
