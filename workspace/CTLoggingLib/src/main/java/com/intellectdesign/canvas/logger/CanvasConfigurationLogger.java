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
package com.intellectdesign.canvas.logger;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.PropertyResourceBundle;

import org.apache.log4j.ConsoleAppender;
import org.apache.log4j.FileAppender;
import org.apache.log4j.Level;
import org.apache.log4j.PatternLayout;
import org.slf4j.helpers.FormattingTuple;
import org.slf4j.helpers.MessageFormatter;

/**
 * This is the Logger used for logging as part of the Configuration Initialization sequence. This is necessary as the
 * logging system may not be initialized when the Configuration System is initialized. So the logging that happens
 * during configuration initialization may be lost and not figure in any of the logs.
 * 
 * The approach taken is to try identity the application server based on the environment properties and create a Canvas
 * configuration log for the current application within the log folder of the application server itself for validation
 * 
 * @version 1.0
 */
public class CanvasConfigurationLogger
{
	protected static org.apache.log4j.Logger ConfigLogger = null;
	private static PropertyResourceBundle messageBundle = (PropertyResourceBundle) PropertyResourceBundle
			.getBundle("CTLogMessages");
	public static final String CONFIG_LOGGER_NAME = "CanvasConfigurationLogger";
	private String mClassName;

	static
	{
		// All detection logic goes here.
		String appServer = detectApplicationServer();
		String logFilePath = getLogPathForApplicationServer(appServer);
		org.apache.log4j.Logger rootLogger = org.apache.log4j.Logger.getRootLogger();
		if (!rootLogger.getAllAppenders().hasMoreElements())
		{
			rootLogger.setLevel(org.apache.log4j.Level.toLevel("debug"));
			rootLogger.addAppender(new ConsoleAppender(new PatternLayout(PatternLayout.TTCC_CONVERSION_PATTERN)));
		}
		// Setup the logger that we are going to use.
		ConfigLogger = org.apache.log4j.Logger.getLogger(CONFIG_LOGGER_NAME);
		// ConfigLogger = org.apache.log4j.Logger.getLogger("com.intellectdesign.canvas.config");
		FileAppender appender = new FileAppender();
		appender.setName("__CTConfigFileAppender__");
		appender.setFile(logFilePath + ".log");
		appender.setLayout(new PatternLayout("[%d{dd MMM yyyy HH:mm:ss}] [%t] [%p] [%m]%n"));
		appender.setAppend(true);
		appender.setThreshold(Level.DEBUG);
		appender.activateOptions();
		ConfigLogger.addAppender(appender);
		rootLogger.debug("Creating Configuration Logger at path + '" + logFilePath + "'");
		ConfigLogger.debug("Creating Configuration Logger at path + '" + logFilePath + "'");
	}

	/**
	 * The constructor that takes the class name as a String
	 * 
	 * @param className
	 */
	public CanvasConfigurationLogger(String className)
	{
		mClassName = className;
	}

	/**
	 * The constructor variant that takes a Class Reference
	 * 
	 * @param clazz
	 */
	public CanvasConfigurationLogger(Class clazz)
	{
		mClassName = clazz.getName();
	}

	/**
	 * Request to log that message corresponding for messageCode in Debug mode
	 * 
	 * @param messageCode
	 * @see com.intellectdesign.canvas.logger.Logger#ctdebug(java.lang.String)
	 */
	public void ctdebug(String messageCode)
	{
		FormattingTuple tuple = getFormattedOutput(messageCode, (Object[]) null);
		if (tuple != null)
			ConfigLogger.debug(tuple.getMessage());
	}

	/**
	 * Request to log that message corresponding for messageCode in Debug mode
	 * 
	 * @param messageCode
	 * @param arguments
	 * @see com.intellectdesign.canvas.logger.Logger#ctdebug(java.lang.String, java.lang.Object[])
	 */
	public void ctdebug(String messageCode, Object... arguments)
	{
		FormattingTuple tuple = getFormattedOutput(messageCode, arguments);
		if (tuple != null)
			ConfigLogger.debug(tuple.getMessage(), tuple.getThrowable());
	}

	/**
	 * Request to log that message corresponding for messageCode in Debug mode
	 * 
	 * @param messageCode
	 * @param t
	 * @see com.intellectdesign.canvas.logger.Logger#ctdebug(java.lang.String, java.lang.Throwable)
	 */
	public void ctdebug(String messageCode, Throwable t)
	{
		FormattingTuple tuple = getFormattedOutput(messageCode, (Object[]) null);
		if (tuple != null)
			ConfigLogger.debug(tuple.getMessage(), t);
	}

	/**
	 * Request to log that message corresponding for messageCode in Debug mode
	 * 
	 * @param messageCode
	 * @param t
	 * @param arguments
	 * @see com.intellectdesign.canvas.logger.Logger#ctdebug(java.lang.String, java.lang.Throwable, java.lang.Object[])
	 */
	public void ctdebug(String messageCode, Throwable t, Object... arguments)
	{
		FormattingTuple tuple = getFormattedOutput(messageCode, arguments);
		if (tuple != null)
			ConfigLogger.debug(tuple.getMessage(), t);
	}

	/**
	 * Request to log that message corresponding for messageCode in Info mode
	 * 
	 * @param messageCode
	 * @see com.intellectdesign.canvas.logger.Logger#ctinfo(java.lang.String)
	 */
	public void ctinfo(String messageCode)
	{
		FormattingTuple tuple = getFormattedOutput(messageCode, (Object[]) null);
		if (tuple != null)
			ConfigLogger.info(tuple.getMessage());
	}

	/**
	 * Request to log that message corresponding for messageCode in Info mode
	 * 
	 * @param messageCode
	 * @param arguments
	 * @see com.intellectdesign.canvas.logger.Logger#ctinfo(java.lang.String, java.lang.Object[])
	 */
	public void ctinfo(String messageCode, Object... arguments)
	{
		FormattingTuple tuple = getFormattedOutput(messageCode, arguments);
		if (tuple != null)
			ConfigLogger.info(tuple.getMessage(), tuple.getThrowable());
	}

	/**
	 * Request to log that message corresponding for messageCode in Info mode
	 * 
	 * @param messageCode
	 * @param t
	 * @see com.intellectdesign.canvas.logger.Logger#ctinfo(java.lang.String, java.lang.Throwable)
	 */
	public void ctinfo(String messageCode, Throwable t)
	{
		FormattingTuple tuple = getFormattedOutput(messageCode, (Object[]) null);
		if (tuple != null)
			ConfigLogger.info(tuple.getMessage(), t);
	}

	/**
	 * Request to log that message corresponding for messageCode in Info mode
	 * 
	 * @param messageCode
	 * @param t
	 * @param arguments
	 * @see com.intellectdesign.canvas.logger.Logger#ctinfo(java.lang.String, java.lang.Throwable, java.lang.Object[])
	 */
	public void ctinfo(String messageCode, Throwable t, Object... arguments)
	{
		FormattingTuple tuple = getFormattedOutput(messageCode, arguments);
		if (tuple != null)
			ConfigLogger.info(tuple.getMessage(), t);
	}

	/**
	 * Request to log that message corresponding for messageCode in Info mode
	 * 
	 * @param messageCode
	 * @see com.intellectdesign.canvas.logger.Logger#ctwarn(java.lang.String)
	 */
	public void ctwarn(String messageCode)
	{
		FormattingTuple tuple = getFormattedOutput(messageCode, (Object[]) null);
		if (tuple != null)
			ConfigLogger.info(tuple.getMessage());
	}

	/**
	 * Request to log that message corresponding for messageCode in Warning mode
	 * 
	 * @param messageCode
	 * @param arguments
	 * @see com.intellectdesign.canvas.logger.Logger#ctwarn(java.lang.String, java.lang.Object[])
	 */
	public void ctwarn(String messageCode, Object... arguments)
	{
		FormattingTuple tuple = getFormattedOutput(messageCode, arguments);
		if (tuple != null)
			ConfigLogger.info(tuple.getMessage(), tuple.getThrowable());
	}

	/**
	 * Request to log that message corresponding for messageCode in Warning mode
	 * 
	 * @param messageCode
	 * @param t
	 * @see com.intellectdesign.canvas.logger.Logger#ctwarn(java.lang.String, java.lang.Throwable)
	 */
	public void ctwarn(String messageCode, Throwable t)
	{
		FormattingTuple tuple = getFormattedOutput(messageCode, (Object[]) null);
		if (tuple != null)
			ConfigLogger.info(tuple.getMessage(), t);
	}

	/**
	 * Request to log that message corresponding for messageCode in Warning mode
	 * 
	 * @param messageCode
	 * @param t
	 * @param arguments
	 * @see com.intellectdesign.canvas.logger.Logger#ctwarn(java.lang.String, java.lang.Throwable, java.lang.Object[])
	 */
	public void ctwarn(String messageCode, Throwable t, Object... arguments)
	{
		FormattingTuple tuple = getFormattedOutput(messageCode, arguments);
		if (tuple != null)
			ConfigLogger.info(tuple.getMessage(), t);
	}

	/**
	 * Request to log that message corresponding for messageCode in Error mode
	 * 
	 * @param messageCode
	 * @see com.intellectdesign.canvas.logger.Logger#cterror(java.lang.String)
	 */
	public void cterror(String messageCode)
	{
		FormattingTuple tuple = getFormattedOutput(messageCode, (Object[]) null);
		if (tuple != null)
			ConfigLogger.error(tuple.getMessage());
	}

	/**
	 * Request to log that message corresponding for messageCode in Error mode
	 * 
	 * @param messageCode
	 * @param arguments
	 * @see com.intellectdesign.canvas.logger.Logger#cterror(java.lang.String, java.lang.Object[])
	 */
	public void cterror(String messageCode, Object... arguments)
	{
		FormattingTuple tuple = getFormattedOutput(messageCode, arguments);
		if (tuple != null)
			ConfigLogger.error(tuple.getMessage(), tuple.getThrowable());
	}

	/**
	 * Request to log that message corresponding for messageCode in Error mode
	 * 
	 * @param messageCode
	 * @param t
	 * @see com.intellectdesign.canvas.logger.Logger#cterror(java.lang.String, java.lang.Throwable)
	 */
	public void cterror(String messageCode, Throwable t)
	{
		FormattingTuple tuple = getFormattedOutput(messageCode, (Object[]) null);
		if (tuple != null)
			ConfigLogger.error(tuple.getMessage(), t);
	}

	/**
	 * Request to log that message corresponding for messageCode in Error mode
	 * 
	 * @param messageCode
	 * @param t
	 * @param arguments
	 * @see com.intellectdesign.canvas.logger.Logger#cterror(java.lang.String, java.lang.Throwable, java.lang.Object[])
	 */
	public void cterror(String messageCode, Throwable t, Object... arguments)
	{
		FormattingTuple tuple = getFormattedOutput(messageCode, arguments);
		if (tuple != null)
			ConfigLogger.error(tuple.getMessage(), t);
	}

	/**
	 * Use the SLF4J helper library API to format the message for logging
	 * 
	 * @param messageCode The message code
	 * @param arguments The list of arguments
	 * @return The Tuple having the result of the formatting
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
			tuple = MessageFormatter.arrayFormat("[" + mClassName + "] [" + messageCode + "] : " + message, arguments);
		}
		return tuple;
	}

	/**
	 * Helper method that checks whether the first argument is a Throwable. This is a nasty workaround for the situation
	 * where we are using 2 different method signatures, but JVM decides to route request to the most generic overloaded
	 * method! Hence we need to manually splice it out to the specific variant
	 * 
	 * @param args
	 * @return
	 */
	private Throwable checkFirstArgException(Object[] args)
	{
		Throwable returnValue = null;
		if (args != null && args.length > 0)
		{
			if (args[0] instanceof Throwable)
				returnValue = (Throwable) args[0];
		}
		return returnValue;
	}

	/**
	 * Does an Left shift (cyclic) of the elements in the array (in place).
	 * 
	 * @param arguments
	 * @return Object[]
	 */
	private Object[] leftShiftArray(Object[] arguments)
	{
		if (arguments != null && arguments.length > 1)
		{
			Object firstElem = arguments[0];
			for (int i = 1; i < arguments.length; i++)
				arguments[i - 1] = arguments[i];
			arguments[arguments.length - 1] = firstElem;
		}
		return arguments;
	}

	/**
	 * This method uses the environment variables that the application server seeds in as part of its startup as the
	 * basis to detect the application server
	 * 
	 * @return The Application server as detected based on the system properties
	 */
	private static String detectApplicationServer()
	{
		String appServer = APP_SERVER_UNKNOWN;
		if (isPropertyPresent("was.install.root"))
			appServer = APP_SERVER_WEBSPHERE;
		else if (isPropertyPresent("weblogic.home"))
			appServer = APP_SERVER_WEBLOGIC;
		else if (isPropertyPresent("jboss.home.dir"))
			appServer = APP_SERVER_JBOSS;
		else if (isPropertyPresent("catalina.base"))
			appServer = APP_SERVER_TOMCAT;
		return appServer;
	}

	/**
	 * Constructs the log path into the application server's log directory
	 * 
	 * @param appServer The application server
	 * @return The log file path based on the log location detected from the application server
	 */
	private static String getLogPathForApplicationServer(String appServer)
	{
		String logBasePath = System.getProperty("user.dir");
		if (APP_SERVER_JBOSS.equals(appServer))
		{
			if (isPropertyPresent("jboss.server.log.dir"))
				logBasePath = System.getProperty("jboss.server.log.dir");
			else
				logBasePath = System.getProperty("user.dir");
		} else if (APP_SERVER_WEBSPHERE.equals(appServer))
		{
			if (isPropertyPresent("user.install.root"))
			{
				logBasePath = System.getProperty("user.install.root");
				File f = new File(logBasePath, "logs");
				if (!f.isDirectory() || !f.exists())
					f.mkdirs();
				logBasePath = f.getAbsolutePath();
			} else
			{
				logBasePath = System.getProperty("user.dir");
			}
		} else if (APP_SERVER_WEBLOGIC.equals(appServer))
		{
			if (isPropertyPresent("weblogic.Name"))
			{
				logBasePath = System.getProperty("user.dir").concat("/").concat("servers").concat("/")
						.concat(System.getProperty("weblogic.Name")).concat("/").concat("logs");
				File f = new File(logBasePath);
				if (!f.isDirectory() || !f.exists())
					f.mkdirs();
			} else
			{
				logBasePath = System.getProperty("user.dir");
			}
		} else if (APP_SERVER_TOMCAT.equals(appServer))
		{
			if (isPropertyPresent("catalina.base"))
			{
				logBasePath = System.getProperty("catalina.base").concat("/").concat("logs");
				File f = new File(logBasePath);
				if (!f.isDirectory() || !f.exists())
					f.mkdirs();
			} else
			{
				logBasePath = System.getProperty("user.dir");
			}
		}
		// Update the path to include the log file name. This is a combination of the app server, fixed string and a
		// Date time stamp to avoid any name conflicts.
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddkkmmss");
		String logFileName = "CanvasConfig".concat("_").concat(sdf.format(new Date())).concat("_").concat(appServer);
		File f = new File(logBasePath, logFileName);
		return f.getAbsolutePath();
	}

	/**
	 * Helper method that checks whether the property key provided is present and has some valid value in the System
	 * properties.
	 * 
	 * @param propKey The property key to check
	 * @return true if the property is present. False otherwise.
	 */
	private static boolean isPropertyPresent(String propKey)
	{
		String propVal = System.getProperty(propKey);
		return propVal != null && (!"".equals(propVal.trim()));
	}

	private static final String APP_SERVER_WEBLOGIC = "weblogic";
	private static final String APP_SERVER_WEBSPHERE = "websphere";
	private static final String APP_SERVER_JBOSS = "jboss";
	private static final String APP_SERVER_TOMCAT = "tomcat";
	private static final String APP_SERVER_UNKNOWN = "unknown";

}
