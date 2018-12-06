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
 * */
package com.intellectdesign.canvas.formcontainer.handler;

import java.util.HashMap;

import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.common.ReplyObject;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.formcontainer.FormContainerManager;
import com.intellectdesign.canvas.handler.SimpleRequestHandler;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.logging.PerformanceTimer;
import com.intellectdesign.canvas.value.CanvasRequestVO;

/**
 * This class is responsible for handling and processing the requests from form container definition.
 * 
 * @version 14.1
 */
public class FormContainerDefinitionHandler extends SimpleRequestHandler
{
	/**
	 * This method is the base method invoked whenever a transaction is made.Depending on the action the internal
	 * private methods are called.
	 * 
	 * @param request The request received
	 * @return The ReplyObject that needs to be sent back to the invoker
	 * @throws ProcessingErrorException Thrown if any error occurs while processing the request
	 */
	@Override
	public ReplyObject process(CanvasRequestVO request) throws ProcessingErrorException
	{
		PerformanceTimer perfTimer = new PerformanceTimer();
		ReplyObject reply = null;
		LOGGER.ctdebug("CTFDF00112", request);

		try
		{
			perfTimer.startTimer("FormDefinitionRequestHandler.processInitializeFormHeaderRequest");
			reply = processInitFormContainerHeaderRequest(request);
		} finally
		{
			perfTimer.endTimer();
		}
		return reply;
	}

	/***
	 * This class returns the reply object containing the hash map of the Form Container Metadata.
	 * 
	 * @param request - Request received by this handler
	 * @return reply - Object of ReplyObject class containing the request and response
	 */
	private ReplyObject processInitFormContainerHeaderRequest(CanvasRequestVO request) throws ProcessingErrorException
	{
		ExtReplyObject reply = null;
		HashMap<String, HashMap<String, String>> headerMap = new HashMap<String, HashMap<String, String>>();
		HashMap<String, String> formContainerDefnMap = null;

		String gcif = request.getUserContext().getOwningGCIF();
		String userno = request.getUserContext().getUserNumber();
		HashMap<String, String> inputMap = (HashMap<String, String>) request.getRequestData();

		FormContainerManager formContainerMgr = new FormContainerManager();
		/**
		 * getcontainerMetadata() method is called to fetch the container's metadata. Container Id String is replaced by
		 * the Request params map.
		 */
		formContainerDefnMap = formContainerMgr.getcontainerMetadata(inputMap, gcif, userno);

		LOGGER.ctdebug("CTFDF00113", formContainerDefnMap);

		headerMap.put("HEADER_FORM_CONTAINER_METADATA", formContainerDefnMap);
		reply = new ExtReplyObject();
		reply.headerMap = headerMap;

		return reply;
	}

	private static final Logger LOGGER = Logger.getLogger(FormContainerDefinitionHandler.class);
}
