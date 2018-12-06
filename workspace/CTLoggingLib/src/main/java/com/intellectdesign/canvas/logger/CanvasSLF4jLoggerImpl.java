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

import org.slf4j.LoggerFactory;

/**
 * This is the implementation of the Canvas Logger Interface that does the logging using SLF4J API's
 * 
 * In this class for following methods we need this method comment for easy understanding purpose and to know what's
 * going on in that methods
 * 
 * 1.ctdebug(String messageCode, Object... arguments)
 * 
 * 2.ctinfo(String messageCode, Object... arguments)
 * 
 * 3.ctwarn(String messageCode, Object... arguments)
 * 
 * 4.cterror(String messageCode, Object... arguments)
 * 
 * Explanation related to above mentioned methods is:
 * 
 * This nasty stuff is needed due to collision issue faced by JVM when working with vargs on overloaded methods. Instead
 * of trying to use the best match, it uses the most generic signature match. This means that even if the user has used
 * a method signature taking Throwable, it may actaully get wrapped as an argument! Hence if the first argument happens
 * to be a Throwable, extract the first argument and do a left shift of the array contents for ensuring that the value
 * replacements happens as intended
 * 
 * Instead of writing above mentioned explanation as comment at every method mentioned above, we are writing here and
 * using everywhere to reduce code size.
 * 
 * @version 1.0
 */
public class CanvasSLF4jLoggerImpl extends Logger
{
	/**
	 * internal instance of the SLF4J Logger
	 */
	private org.slf4j.Logger loggerInstance;

	/**
	 * The constructor that takes the className
	 * 
	 * @param className The class name
	 */
	public CanvasSLF4jLoggerImpl(String className)
	{
		loggerInstance = LoggerFactory.getLogger(className);
	}

	/**
	 * The constructor that takes the Class reference
	 * 
	 * @param clazz The class reference
	 */
	public CanvasSLF4jLoggerImpl(Class clazz)
	{
		loggerInstance = LoggerFactory.getLogger(clazz);
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
			String message = getMessage(messageCode);
			if (message != null)
				loggerInstance.debug(message);
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
			String message = getMessage(messageCode);
			if (message != null)
			{

				Throwable t = checkFirstArgException(arguments);
				if (t == null)
					loggerInstance.debug(message, arguments);
				else
				{
					loggerInstance.debug(message, leftShiftArray(arguments));
				}
			}
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
			String message = getMessage(messageCode);
			if (message != null)
				loggerInstance.debug(message, t);
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
			String message = getMessage(messageCode);
			if (message != null)
				loggerInstance.debug(message, appendToArray(arguments, t));
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
			String message = getMessage(messageCode);
			if (message != null)
				loggerInstance.info(message);
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
			String message = getMessage(messageCode);
			if (message != null)
			{

				Throwable t = checkFirstArgException(arguments);
				if (t == null)
					loggerInstance.info(message, arguments);
				else
				{
					loggerInstance.info(message, leftShiftArray(arguments));
				}
			}
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
			String message = getMessage(messageCode);
			if (message != null)
				loggerInstance.info(message, t);
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
			String message = getMessage(messageCode);
			if (message != null)
				loggerInstance.info(message, appendToArray(arguments, t));
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
		if (LOGGING_ENABLED && loggerInstance.isWarnEnabled())
		{
			String message = getMessage(messageCode);
			if (message != null)
				loggerInstance.warn(message);
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
		if (LOGGING_ENABLED && loggerInstance.isWarnEnabled())
		{
			String message = getMessage(messageCode);
			if (message != null)
			{

				Throwable t = checkFirstArgException(arguments);
				if (t == null)
					loggerInstance.warn(message, arguments);
				else
				{
					loggerInstance.warn(message, leftShiftArray(arguments));
				}
			}
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
		if (LOGGING_ENABLED && loggerInstance.isWarnEnabled())
		{
			String message = getMessage(messageCode);
			if (message != null)
				loggerInstance.warn(message, t);
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
		if (LOGGING_ENABLED && loggerInstance.isWarnEnabled())
		{
			String message = getMessage(messageCode);
			if (message != null)
				loggerInstance.warn(message, appendToArray(arguments, t));
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
		if (LOGGING_ENABLED && loggerInstance.isErrorEnabled())
		{
			String message = getMessage(messageCode);
			if (message != null)
				loggerInstance.error(message);
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
		if (LOGGING_ENABLED && loggerInstance.isErrorEnabled())
		{
			String message = getMessage(messageCode);
			if (message != null)
			{

				Throwable t = checkFirstArgException(arguments);
				if (t == null)
					loggerInstance.error(message, arguments);
				else
				{
					loggerInstance.error(message, leftShiftArray(arguments));
				}
			}
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
		if (LOGGING_ENABLED && loggerInstance.isErrorEnabled())
		{
			String message = getMessage(messageCode);
			if (message != null)
				loggerInstance.error(message, t);
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
		if (LOGGING_ENABLED && loggerInstance.isErrorEnabled())
		{
			String message = getMessage(messageCode);
			if (message != null)
				loggerInstance.error(message, appendToArray(arguments, t));
		}
	}

	/**
	 * Helper method to retrieve the messag from the bundle if it is present. Else returns null.
	 * 
	 * @param messageCode The message code to be read from bundle
	 * @return Value if present. Else null.
	 */
	private String getMessage(String messageCode)
	{
		String message = null;
		if (messageBundle.containsKey(messageCode))
		{
			StringBuffer buffer = new StringBuffer();
			buffer.append("[");
			buffer.append(messageCode);
			buffer.append("]:");
			buffer.append(messageBundle.getString(messageCode));
			message = buffer.toString();

		}
		return message;
	}

}
