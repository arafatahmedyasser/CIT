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
package com.intellectdesign.canvas.handler;

import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.common.ReplyObject;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.logging.PerformanceTimer;
import com.intellectdesign.canvas.value.CanvasRequestVO;

/**
 * This is the base request handler for Canvas. This accepts a CanvasRequest created by the Action class and then
 * delegates the same to the sub class to process.
 * 
 * @Version 15.1
 */
public abstract class CanvasBaseRequestHandler
{
	private CanvasRequestVO origRequest;

	/**
	 * The default constructor for this class
	 */
	public CanvasBaseRequestHandler()
	{
	}

	/**
	 * This is the entry point method for the handler
	 * 
	 * @param request The request
	 * @return The response for this request
	 * @throws ProcessingErrorException Thrown if any error while processing the request
	 */
	public final ExtReplyObject execute(CanvasRequestVO request) throws ProcessingErrorException
	{
		ExtReplyObject response = null;
		PerformanceTimer timer = new PerformanceTimer();
		timer.startTimer("execute triggered for action '" + request.getActionCode() + "' on class '"
				+ getClass().getName() + "'");
		try
		{
			origRequest = request;
			ReplyObject reply = process(request);
			if (reply instanceof ExtReplyObject)
			{
				response = (ExtReplyObject) reply;
			} else
			{
				response = new ExtReplyObject(reply);
			}
		} finally
		{
			origRequest = null;
			timer.endTimer();
		}
		return response;
	}

	/**
	 * Returns the original request received by this handler for processing
	 * 
	 * @return The original request received.
	 */
	public CanvasRequestVO getOriginalRequest()
	{
		return origRequest;
	}

	/**
	 * This method is the base method invoked whenever a request is made. This is expected to respond with the
	 * ReplyObject that corresponds to the request
	 * 
	 * @param request The request received
	 * @return The ReplyObject that corresponds to the request
	 * @throws ProcessingErrorException Thrown if any error occurs while processing the request
	 */
	public abstract ReplyObject process(CanvasRequestVO request) throws ProcessingErrorException;

}
