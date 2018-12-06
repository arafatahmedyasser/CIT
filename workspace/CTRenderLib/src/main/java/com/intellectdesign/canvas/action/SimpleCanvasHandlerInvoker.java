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
package com.intellectdesign.canvas.action;

import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.handler.CanvasBaseRequestHandler;
import com.intellectdesign.canvas.handler.CanvasHandlerInvoker;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.utils.httpheader.HttpHeaderInterpreter;
import com.intellectdesign.canvas.value.CanvasRequestVO;

/**
 * This is the Canvas Handler Invoker that does a simple invocation of the handler based on the transaction code and
 * completes the invocation. This identifies the handler from the configuration descriptor to get the property file that
 * will provide the handler class name.
 * 
 * @version 1.0
 */
public class SimpleCanvasHandlerInvoker implements ICanvasHandlerInvoker
{
	/**
	 * Invokes the request handler based on the handler class identified for the transaction code.
	 * 
	 * @param input The data package to be sent to the request handler
	 * @param tranCode The transaction code using which the handler is to be identified
	 * @return The response received from the handler
	 * @throws ProcessingErrorException Thrown if any error occurs while invoking the handler
	 * @see com.intellectdesign.canvas.action.ICanvasHandlerInvoker#invokeRequestHandler(java.util.Vector, java.lang.String)
	 */
	@Override
	public ExtReplyObject invokeRequestHandler(CanvasRequestVO input, String tranCode) throws ProcessingErrorException
	{
		ExtReplyObject result = null;
		CanvasBaseRequestHandler reqHandler = null;
		
		//Set the app server ip on the Request.
		HttpHeaderInterpreter headerView = new HttpHeaderInterpreter();
		input.setAppServerIP(headerView.getCurrentServerIPAddress());

		reqHandler = new CanvasHandlerInvoker().createHandler(tranCode);
		result = reqHandler.execute(input);
		LOGGER.ctdebug("CTRND00492", tranCode, result);
		
		return result;
	}

	/**
	 * The logger instance for this class
	 */
	private static Logger LOGGER = Logger.getLogger(SimpleCanvasHandlerInvoker.class);
}
