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

package com.intellectdesign.canvas.logger;

import org.slf4j.helpers.FormattingTuple;
import org.slf4j.helpers.MessageFormatter;

/**
 * This is the implementation of the Canvas Logger interface that uses Log4J as the underlying logger
 * 
 * @version 1.0
 */
public class CanvasLog4jLoggerImpl extends Logger
{
	/**
	 * Internal instance of log4j logger
	 */
	private org.apache.log4j.Logger loggerInstance;

	/**
	 * Constructor that takes the class name
	 * 
	 * @param className The class name
	 */
	public CanvasLog4jLoggerImpl(String className)
	{
		loggerInstance = org.apache.log4j.Logger.getLogger(className);
	}

	/**
	 * Constructor that takes the class reference
	 * 
	 * @param clazz The class reference
	 */
	public CanvasLog4jLoggerImpl(Class clazz)
	{
		loggerInstance = org.apache.log4j.Logger.getLogger(clazz);
	}

	/**
	 * Request to log that message corresponding for messageCode in Debug mode
	 * 
	 * @param messageCode
	 * @see com.intellectdesign.canvas.logger.Logger#ctdebug(java.lang.String)
	 */
	@Override
	public void ctdebug(String messageCode)
	{
		if (LOGGING_ENABLED && loggerInstance.isDebugEnabled())
		{
			FormattingTuple tuple = getFormattedOutput(messageCode, (Object[]) null);
			if (tuple != null)
				loggerInstance.debug(tuple.getMessage());
		}
	}

	/**
	 * Request to log that message corresponding for messageCode in Debug mode
	 * 
	 * @param messageCode
	 * @param arguments
	 * @see com.intellectdesign.canvas.logger.Logger#ctdebug(java.lang.String, java.lang.Object[])
	 */
	@Override
	public void ctdebug(String messageCode, Object... arguments)
	{
		if (LOGGING_ENABLED && loggerInstance.isDebugEnabled())
		{
			FormattingTuple tuple = getFormattedOutput(messageCode, arguments);
			if (tuple != null)
				loggerInstance.debug(tuple.getMessage(), tuple.getThrowable());
		}
	}

	/**
	 * Request to log that message corresponding for messageCode in Debug mode
	 * 
	 * @param messageCode
	 * @param t
	 * @see com.intellectdesign.canvas.logger.Logger#ctdebug(java.lang.String, java.lang.Throwable)
	 */
	@Override
	public void ctdebug(String messageCode, Throwable t)
	{
		if (LOGGING_ENABLED && loggerInstance.isDebugEnabled())
		{
			FormattingTuple tuple = getFormattedOutput(messageCode, (Object[]) null);
			if (tuple != null)
				loggerInstance.debug(tuple.getMessage(), t);
		}
	}

	/**
	 * Request to log that message corresponding for messageCode in Debug mode
	 * 
	 * @param messageCode
	 * @param t
	 * @param arguments
	 * @see com.intellectdesign.canvas.logger.Logger#ctdebug(java.lang.String, java.lang.Throwable, java.lang.Object[])
	 */
	@Override
	public void ctdebug(String messageCode, Throwable t, Object... arguments)
	{
		if (LOGGING_ENABLED && loggerInstance.isDebugEnabled())
		{
			FormattingTuple tuple = getFormattedOutput(messageCode, arguments);
			if (tuple != null)
				loggerInstance.debug(tuple.getMessage(), t);
		}
	}

	/**
	 * Request to log that message corresponding for messageCode in Info mode
	 * 
	 * @param messageCode
	 * @see com.intellectdesign.canvas.logger.Logger#ctinfo(java.lang.String)
	 */
	@Override
	public void ctinfo(String messageCode)
	{
		if (LOGGING_ENABLED && loggerInstance.isInfoEnabled())
		{
			FormattingTuple tuple = getFormattedOutput(messageCode, (Object[]) null);
			if (tuple != null)
				loggerInstance.info(tuple.getMessage());
		}
	}

	/**
	 * Request to log that message corresponding for messageCode in Info mode
	 * 
	 * @param messageCode
	 * @param arguments
	 * @see com.intellectdesign.canvas.logger.Logger#ctinfo(java.lang.String, java.lang.Object[])
	 */
	@Override
	public void ctinfo(String messageCode, Object... arguments)
	{
		if (LOGGING_ENABLED && loggerInstance.isInfoEnabled())
		{
			FormattingTuple tuple = getFormattedOutput(messageCode, arguments);
			if (tuple != null)
				loggerInstance.info(tuple.getMessage(), tuple.getThrowable());
		}
	}

	/**
	 * Request to log that message corresponding for messageCode in Info mode
	 * 
	 * @param messageCode
	 * @param t
	 * @see com.intellectdesign.canvas.logger.Logger#ctinfo(java.lang.String, java.lang.Throwable)
	 */
	@Override
	public void ctinfo(String messageCode, Throwable t)
	{
		if (LOGGING_ENABLED && loggerInstance.isInfoEnabled())
		{
			FormattingTuple tuple = getFormattedOutput(messageCode, (Object[]) null);
			if (tuple != null)
				loggerInstance.info(tuple.getMessage(), t);
		}
	}

	/**
	 * Request to log that message corresponding for messageCode in Info mode
	 * 
	 * @param messageCode
	 * @param t
	 * @param arguments
	 * @see com.intellectdesign.canvas.logger.Logger#ctinfo(java.lang.String, java.lang.Throwable, java.lang.Object[])
	 */
	@Override
	public void ctinfo(String messageCode, Throwable t, Object... arguments)
	{
		if (LOGGING_ENABLED && loggerInstance.isInfoEnabled())
		{
			FormattingTuple tuple = getFormattedOutput(messageCode, arguments);
			if (tuple != null)
				loggerInstance.info(tuple.getMessage(), t);
		}
	}

	/**
	 * Request to log that message corresponding for messageCode in Warning mode
	 * 
	 * @param messageCode
	 * @see com.intellectdesign.canvas.logger.Logger#ctwarn(java.lang.String)
	 */
	@Override
	public void ctwarn(String messageCode)
	{
		if (LOGGING_ENABLED && loggerInstance.isInfoEnabled())
		{
			FormattingTuple tuple = getFormattedOutput(messageCode, (Object[]) null);
			if (tuple != null)
				loggerInstance.info(tuple.getMessage());
		}
	}

	/**
	 * Request to log that message corresponding for messageCode in Warning mode
	 * 
	 * @param messageCode
	 * @param arguments
	 * @see com.intellectdesign.canvas.logger.Logger#ctwarn(java.lang.String, java.lang.Object[])
	 */
	@Override
	public void ctwarn(String messageCode, Object... arguments)
	{
		if (LOGGING_ENABLED && loggerInstance.isInfoEnabled())
		{
			FormattingTuple tuple = getFormattedOutput(messageCode, arguments);
			if (tuple != null)
				loggerInstance.info(tuple.getMessage(), tuple.getThrowable());
		}
	}

	/**
	 * Request to log that message corresponding for messageCode in Warning mode
	 * 
	 * @param messageCode
	 * @param t
	 * @see com.intellectdesign.canvas.logger.Logger#ctwarn(java.lang.String, java.lang.Throwable)
	 */
	@Override
	public void ctwarn(String messageCode, Throwable t)
	{
		if (LOGGING_ENABLED && loggerInstance.isInfoEnabled())
		{
			FormattingTuple tuple = getFormattedOutput(messageCode, (Object[]) null);
			if (tuple != null)
				loggerInstance.info(tuple.getMessage(), t);
		}
	}

	/**
	 * Request to log that message corresponding for messageCode in Warning mode
	 * 
	 * @param messageCode
	 * @param t
	 * @param arguments
	 * @see com.intellectdesign.canvas.logger.Logger#ctwarn(java.lang.String, java.lang.Throwable, java.lang.Object[])
	 */
	@Override
	public void ctwarn(String messageCode, Throwable t, Object... arguments)
	{
		if (LOGGING_ENABLED && loggerInstance.isInfoEnabled())
		{
			FormattingTuple tuple = getFormattedOutput(messageCode, arguments);
			if (tuple != null)
				loggerInstance.info(tuple.getMessage(), t);
		}
	}

	/**
	 * Request to log that message corresponding for messageCode in Error mode
	 * 
	 * @param messageCode
	 * @see com.intellectdesign.canvas.logger.Logger#cterror(java.lang.String)
	 */
	@Override
	public void cterror(String messageCode)
	{
		if (LOGGING_ENABLED)
		{
			FormattingTuple tuple = getFormattedOutput(messageCode, (Object[]) null);
			if (tuple != null)
				loggerInstance.error(tuple.getMessage());
		}
	}

	/**
	 * Request to log that message corresponding for messageCode in Error mode
	 * 
	 * @param messageCode
	 * @param arguments
	 * @see com.intellectdesign.canvas.logger.Logger#cterror(java.lang.String, java.lang.Object[])
	 */
	@Override
	public void cterror(String messageCode, Object... arguments)
	{
		if (LOGGING_ENABLED)
		{
			FormattingTuple tuple = getFormattedOutput(messageCode, arguments);
			if (tuple != null)
				loggerInstance.error(tuple.getMessage(), tuple.getThrowable());
		}
	}

	/**
	 * Request to log that message corresponding for messageCode in Error mode
	 * 
	 * @param messageCode
	 * @param t
	 * @see com.intellectdesign.canvas.logger.Logger#cterror(java.lang.String, java.lang.Throwable)
	 */
	@Override
	public void cterror(String messageCode, Throwable t)
	{
		if (LOGGING_ENABLED)
		{
			FormattingTuple tuple = getFormattedOutput(messageCode, (Object[]) null);
			if (tuple != null)
				loggerInstance.error(tuple.getMessage(), t);
		}
	}

	/**
	 * Request to log that message corresponding for messageCode in Error mode
	 * 
	 * @param messageCode
	 * @param t
	 * @param arguments
	 * @see com.intellectdesign.canvas.logger.Logger#cterror(java.lang.String, java.lang.Throwable, java.lang.Object[])
	 */
	@Override
	public void cterror(String messageCode, Throwable t, Object... arguments)
	{
		if (LOGGING_ENABLED)
		{
			FormattingTuple tuple = getFormattedOutput(messageCode, arguments);
			if (tuple != null)
				loggerInstance.error(tuple.getMessage(), t);
		}
	}

	/**
	 * Use the SLF4J helper library API to format the message for logging
	 * 
	 * @param messageCode The message code
	 * @param arguments The list of arguments
	 * @return The Tuple having the result of the formatting
	 * @exception checkFirstArgException
	 */
	private FormattingTuple getFormattedOutput(String messageCode, Object... arguments)
	{
		String message = null;
		FormattingTuple tuple = null;
		if (messageBundle.containsKey(messageCode))
		{
			message = messageBundle.getString(messageCode);
			/**
			 * This nasty stuff is needed due to collision issue faced by JVM when working with vargs on overloaded
			 * methods. Instead of trying to use the best match, it uses the most generic signature match. This means
			 * that even if the user has used a method signature taking Throwable, it may actaully get wrapped as an
			 * argument! Hence rotate the array once for the Tuple to be built properly as MessageFormatter expects the
			 * throwable if present to be the last element in the array
			 */
			Throwable t = checkFirstArgException(arguments);
			if (t != null)
				leftShiftArray(arguments);
			tuple = MessageFormatter.arrayFormat("[" + messageCode + "] : " + message, arguments);
		}
		return tuple;
	}
}
