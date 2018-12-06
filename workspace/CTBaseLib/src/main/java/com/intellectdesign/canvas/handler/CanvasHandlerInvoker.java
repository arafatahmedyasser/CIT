/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to intellectdesign Financial Technology 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 * 
 */
package com.intellectdesign.canvas.handler;

import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.SystemPreferenceDescriptor;
import com.intellectdesign.canvas.exceptions.common.BaseException;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.utils.ResourceBundleUtils;
import com.intellectdesign.canvas.utils.ResourceLoaderUtils;
import com.intellectdesign.canvas.utils.StringUtils;

/**
 * This is a utility class that identifies the appropriate handler that needs to be invoked
 */
public class CanvasHandlerInvoker
{
	/**
	 * This is a factory method that creates an instance of the request handler for the given handler code. This first
	 * checks from the framework configuration. If not available, then looks into the application provided configuration
	 * 
	 * @param handlerCode The handler code for which the handler class is to be created.
	 * @return The handler class created for the given handler code.
	 * @throws ProcessingErrorException
	 */
	public CanvasBaseRequestHandler createHandler(String handlerCode) throws ProcessingErrorException
	{
		CanvasBaseRequestHandler reqHandler = null;
		String className = null;

		// First try to get the class from the default framework handler property file
		className = ResourceBundleUtils.getString("canvashandler", handlerCode + "_Handler", "");

		if (StringUtils.isEmpty(className))
		{
			// If the class is not present in the framework configuration, fetch it from the application level
			// configuration file
			ConfigurationManager confMngr = ConfigurationManager.getInstance();
			SystemPreferenceDescriptor syspref = confMngr.getSystemPrefDescriptor();
			className = ResourceBundleUtils.getString(syspref.getHandlerPropertiesFile(), handlerCode + "_Handler", "");
		}

		if (StringUtils.isEmpty(className))
		{
			LOGGER.cterror("CTBAS00086", handlerCode);
			throw new ProcessingErrorException("INV_CONFIG", "Missing or invalid configuration. " + handlerCode
					+ " cannot be identified in Canvas or application provided configuration");
		}
		LOGGER.ctdebug("CTBAS00088", handlerCode, className);
		try
		{
			// Invoke the process method on the handler class.
			reqHandler = (CanvasBaseRequestHandler) ResourceLoaderUtils.createInstance(className);
		} catch (BaseException invokeException)
		{
			LOGGER.cterror("CTBAS00089", invokeException, className, handlerCode);
			throw new ProcessingErrorException(invokeException);
		} catch (ClassCastException castException)
		{
			LOGGER.cterror("CTBAS00089", castException, className, handlerCode);
			throw new ProcessingErrorException(castException);
		}

		return reqHandler;
	}

	/**
	 * Logger instance for this class.
	 */
	private static final Logger LOGGER = Logger.getLogger(CanvasHandlerInvoker.class);
}
