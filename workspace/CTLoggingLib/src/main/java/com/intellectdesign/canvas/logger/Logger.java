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

import java.net.URL;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.List;
import java.util.Locale;
import java.util.Properties;
import java.util.PropertyResourceBundle;
import java.util.ResourceBundle;

import org.apache.log4j.Appender;
import org.apache.log4j.ConsoleAppender;
import org.apache.log4j.PatternLayout;
import org.apache.log4j.helpers.Loader;

import com.intellectdesign.canvas.logger.config.CanvasLog4JXMLConfigurator;

/**
 * This is the Logger class that will be used for logging with the Canvas Platform. This class is designed to be similar
 * to the manner in which log4J's Logger is provided for easy conversion / migration
 * 
 * A typical usage of this class will be like - {@code
 * import com.intellectdesign.canvas.logger.Logger;
 * 
 * Logger LOGGER = Logger.getLogger("class name" / clazz);
 * LOGGER.info("Message code", obj1, obj2);
 * }
 * 
 * The key difference here is that any logging is done only using codes and no direct string manipulation. To do a
 * logging, the following steps needs to be done.
 * <ul>
 * <li>Create a new message code in the pattern "CTXXXnnnnn". The pattern stands for
 * <ul>
 * <li>CT - Fixed prefix</li>
 * <li>xxx - 3 character code that represents the module</li>
 * <li>nnnnn - 5 digit running sequence that corresponds to the log statement within that module</li>
 * </ul>
 * </li>
 * <li>Add this message code with the appropriate message within the com.intellectdesign.canvas.logger.CTLogMessages.properties
 * bundle. For all places where dynamic content needs to be plugged in, it should have place holders in the manner
 * specified in SLF4j 1.6 documentation</li>
 * <li>Within the end module that needs to do the logging, it should use this newly created message code and pass any
 * dynamic information for logging along with message code. Care should be taken that no implicit / explicit
 * serialization of the object should be done before passing to this API. This is to ensure that from a performance
 * perspective, unnecessary serialization overheads are not present</li>
 * </ul>
 * 
 * @version 1.0
 */
public abstract class Logger
{
	/**
	 * This is the class that provides the logger implementation using SLF4J as the logging library. SLF4J May
	 * internally use Log4J
	 */
	public static final String LOGGER_IMPL_SLF4J_CLASS = "com.intellectdesign.canvas.logger.CanvasSLF4jLoggerImpl";
	/**
	 * This is the class that provides the logger implementation using Log4J as the logging library
	 */
	public static final String LOGGER_IMPL_LOG4J_CLASS = "com.intellectdesign.canvas.logger.CanvasLog4jLoggerImpl";
	/**
	 * This is the default logger implementation used. Currently default hard wired to SLF4J implementation
	 */
	public static final String DEFAULT_LOGGER_IMPL = LOGGER_IMPL_SLF4J_CLASS;
	/**
	 * This is the log4J XML configuration for the Canvas Framework
	 */
	private static final String CANVAS_LOG4J_FRAMEWORK_CONFIG = "canvas-framework-log4j.xml";

	private static Class LOGGER_CLASS;

	/**
	 * Flag indicating whether logging is enabled or not.
	 */
	protected static boolean LOGGING_ENABLED = true;

	/**
	 * This is the Resource bundle control created for loading only property bundles.
	 */
	private static ResourceBundle.Control PROPERTIES_RESOURCE_CONTROL = null;

	protected static PropertyResourceBundle messageBundle = null;

	/**
	 * This will reinitialize all the Loggers with details loaded from the Configuration Manager
	 * 
	 * @param loggingEnabled Boolean value
	 * @param runtimeProps Properties File
	 * @exception RuntimeException
	 */
	public static void initialize(boolean loggingEnabled, Properties runtimeProps, String log4jConfigFile)
	{
		// First get the path to the log4j.properties.
		URL aURL = Loader.getResource(log4jConfigFile);
		// Configure the Log4j properties.
		if (aURL == null)
		{
			// This should never occur. This means that there is an issue in loading the Canvas Log4j xml file that
			// should be part of the distribution. So disable logging and dump it in System error console.
			System.err
					.println("Unable to load Canvas platform Logging configuration. Is the Canvas platform incorporated properly within your EAR / WAR file?");
			LOGGING_ENABLED = false;
			throw new RuntimeException("Unable to locate '" + log4jConfigFile + "' in the classpath.");
		} else
		{
			if (loggingEnabled)
			{
				ensureLog4JRootLoggerConfiguration(runtimeProps);
				CanvasLog4JXMLConfigurator.configure(aURL, runtimeProps);
				mergeCanvasConfigLogging();
				// Create a Logger and log the path information from where it has been initialized.
				Logger logger = Logger.getLogger("com.intellectdesign.canvas.logger.Logger");
				logger.ctinfo("CTLOG00001", aURL.getPath());
			}
			LOGGING_ENABLED = loggingEnabled;
		}
	}

	/**
	 * This is nasty. If our configuration defines a root logger and the App server also uses log4j, then app server
	 * logging will get routed to our files. If the App server does not use Log4j, then Log4j will throw errors that
	 * root logger configuration is missing. So if root logger is not present, then create a default one using console
	 * appender
	 * 
	 * @param runtimeProps Properties file
	 */
	private static void ensureLog4JRootLoggerConfiguration(Properties runtimeProps)
	{
		org.apache.log4j.Logger rootLogger = org.apache.log4j.Logger.getRootLogger();
		if (!rootLogger.getAllAppenders().hasMoreElements())
		{
			rootLogger.setLevel(org.apache.log4j.Level.toLevel(runtimeProps.getProperty("log.level")));
			rootLogger.addAppender(new ConsoleAppender(new PatternLayout(PatternLayout.TTCC_CONVERSION_PATTERN)));
		}
	}

	/**
	 * The initialization sequence ends up creating a separate appender for the configuration logging for the
	 * application. Once the logging has been properly initialized, we have to ensure that the appender configuration
	 * within the framework's configuration is respected and passed along to the actual configuration logger so that any
	 * logging done from the Configuration framework from now on also gets logged into the appropriate logs
	 */
	private static void mergeCanvasConfigLogging()
	{
		org.apache.log4j.Logger logger = org.apache.log4j.Logger.getLogger("com.intellectdesign.canvas.config");
		Enumeration allAppenders = logger.getAllAppenders();
		while (allAppenders.hasMoreElements())
		{
			CanvasConfigurationLogger.ConfigLogger.addAppender((Appender) allAppenders.nextElement());
		}
	}

	/**
	 * In this static block we come across accessing of getCandidateLocales(),getFormats() from ResourceBundle using
	 * ResourceBundle.getBundle factory method as explained below and also exceptions it cause when basename is null
	 * 
	 * getCandidateLocales():The java.util.ResourceBundle.Control.getCandidateLocales(String baseName,Locale locale)
	 * method returns a List of Locales as candidate locales for baseName and locale. This method is called by the
	 * ResourceBundle.getBundle factory method each time the factory method tries finding a resourcebundle for a target Locale. 
	 * 
	 * getFormats():The java.util.ResourceBundle.Control.getFormats(String baseName) method returns a List of
	 * Strings containing formats to be used to load resource bundles for the given baseName. The
	 * ResourceBundle.getBundle factory method tries to load resource bundles with formats in the order specified by the
	 * list. The list returned by this method must have at least one String.(here ResourceBundle is of type properties
	 * which will have .properties extension)
	 * 
	 * Then we initialize log message bundle,after that we will store class name in LOGGER_CLASS variable which we
	 * obtain using KEY argument asssed if any exception raised we will catch it in catch block by reverting the .class
	 * explicitly.
	 */
	static
	{
		PROPERTIES_RESOURCE_CONTROL = new ResourceBundle.Control()
		{
			/**
			 * gets list of CandidateLocales
			 * 
			 * @param baseName
			 * @param locale
			 * @return List
			 * @see java.util.ResourceBundle.Control#getCandidateLocales(java.lang.String, java.util.Locale)
			 */
			@Override
			public List<Locale> getCandidateLocales(String baseName, Locale locale)
			{
				{
					if (baseName == null)
						throw new NullPointerException();
				}
				return Arrays.asList(Locale.ROOT);
			}

			/**
			 * 
			 * gets list of formats
			 * 
			 * @param baseName
			 * @return List
			 * @see java.util.ResourceBundle.Control#getFormats(java.lang.String)
			 */

			@Override
			public List<String> getFormats(String baseName)
			{
				if (baseName == null)
				{
					throw new NullPointerException();
				}
				return FORMAT_PROPERTIES;
			}
		};

		// First initialize the Log Messages bundle.
		messageBundle = (PropertyResourceBundle) PropertyResourceBundle.getBundle("CTLogMessages", Locale.ROOT,
				PROPERTIES_RESOURCE_CONTROL);
		try
		{
			LOGGER_CLASS = Class.forName(DEFAULT_LOGGER_IMPL);
		} catch (ClassNotFoundException e)
		{
			// Really sad. we could not load the class. revert to the class explicitly.
			LOGGER_CLASS = CanvasSLF4jLoggerImpl.class;
		}
	}

	/**
	 * Returns an instance of the Logger for the className provided.
	 * 
	 * @param className The class name
	 * @return The Logger for this class
	 */
	public static Logger getLogger(String className)
	{
		Logger instance = null;
		try
		{
			instance = (Logger) LOGGER_CLASS.getConstructor(String.class).newInstance(className);
		} catch (Throwable e)
		{
			instance = new CanvasSLF4jLoggerImpl(className);
		}
		return instance;
	}

	/**
	 * Returns an instance of the Logger for the className provided.
	 * 
	 * @param clazz
	 * @return The Logger for this class
	 */
	public static Logger getLogger(Class clazz)
	{
		Logger instance = null;
		try
		{
			instance = (Logger) LOGGER_CLASS.getConstructor(Class.class).newInstance(clazz);
		} catch (Throwable e)
		{
			instance = new CanvasSLF4jLoggerImpl(clazz);
		}
		return instance;
	}

	/**
	 * Helper method that checks whether the first argument is a Throwable. This is a nasty workaround for the situation
	 * where we are using 2 different method signatures, but JVM decides to route request to the most generic overloaded
	 * method! Hence we need to manually splice it out to the specific variant
	 * 
	 * @param args
	 * @return exception of type throwable class
	 */
	protected Throwable checkFirstArgException(Object[] args)
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
	 * @return Object[] Object Array of arguments
	 */
	protected Object[] leftShiftArray(Object[] arguments)
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
	 * Appends the given element to the array
	 * 
	 * @param arguments The source array
	 * @param appendVal The value to be appended
	 * @return The final array
	 */
	protected Object[] appendToArray(Object[] arguments, Object appendVal)
	{
		Object[] retVal;
		if (arguments == null || arguments.length == 0)
			retVal = new Object[]
			{ appendVal };
		else
		{
			retVal = new Object[arguments.length + 1];
			System.arraycopy(arguments, 0, retVal, 0, arguments.length);
			retVal[arguments.length] = appendVal;
		}
		return retVal;
	}

	/**
	 * Request to log that message corresponding for messageCode in Debug mode
	 * 
	 * @param messageCode The messageCode to be logged
	 */
	public abstract void ctdebug(String messageCode);

	/**
	 * Request to log that message corresponding for messageCode in Debug mode
	 * 
	 * @param messageCode The messageCode to be logged
	 * @param arguments The list of objects to be replaced in the various placeholders
	 */
	public abstract void ctdebug(String messageCode, Object... arguments);

	/**
	 * Request to log that message corresponding for messageCode in Debug mode
	 * 
	 * @param messageCode The messageCode to be logged
	 * @param t The exception to be logged
	 */
	public abstract void ctdebug(String messageCode, Throwable t);

	/**
	 * Request to log that message corresponding for messageCode in Debug mode
	 * 
	 * @param messageCode The messageCode to be logged
	 * @param t The exception to be logged
	 * @param arguments The list of objects to be replaced in the various placeholders
	 */
	public abstract void ctdebug(String messageCode, Throwable t, Object... arguments);

	/**
	 * Request to log that message corresponding for messageCode in Info mode
	 * 
	 * @param messageCode The messageCode to be logged
	 */
	public abstract void ctinfo(String messageCode);

	/**
	 * Request to log that message corresponding for messageCode in Info mode
	 * 
	 * @param messageCode The messageCode to be logged
	 * @param arguments The list of objects to be replaced in the various placeholders
	 */
	public abstract void ctinfo(String messageCode, Object... arguments);

	/**
	 * Request to log that message corresponding for messageCode in Info mode
	 * 
	 * @param messageCode The messageCode to be logged
	 * @param t The exception to be logged
	 */
	public abstract void ctinfo(String messageCode, Throwable t);

	/**
	 * Request to log that message corresponding for messageCode in Info mode
	 * 
	 * @param messageCode The messageCode to be logged
	 * @param t The exception to be logged
	 * @param arguments The list of objects to be replaced in the various placeholders
	 */
	public abstract void ctinfo(String messageCode, Throwable t, Object... arguments);

	/**
	 * Request to log that message corresponding for messageCode in Warning mode
	 * 
	 * @param messageCode The messageCode to be logged
	 */
	public abstract void ctwarn(String messageCode);

	/**
	 * Request to log that message corresponding for messageCode in Warning mode
	 * 
	 * @param messageCode The messageCode to be logged
	 * @param arguments The list of objects to be replaced in the various placeholders
	 */
	public abstract void ctwarn(String messageCode, Object... arguments);

	/**
	 * Request to log that message corresponding for messageCode in Warning mode
	 * 
	 * @param messageCode The messageCode to be logged
	 * @param t The exception to be logged
	 */
	public abstract void ctwarn(String messageCode, Throwable t);

	/**
	 * Request to log that message corresponding for messageCode in Warning mode
	 * 
	 * @param messageCode The messageCode to be logged
	 * @param t The exception to be logged
	 * @param arguments The list of objects to be replaced in the various placeholders
	 */
	public abstract void ctwarn(String messageCode, Throwable t, Object... arguments);

	/**
	 * Request to log that message corresponding for messageCode in Error mode
	 * 
	 * @param messageCode The messageCode to be logged
	 */
	public abstract void cterror(String messageCode);

	/**
	 * Request to log that message corresponding for messageCode in Error mode
	 * 
	 * @param messageCode The messageCode to be logged
	 * @param arguments The list of objects to be replaced in the various placeholders
	 */
	public abstract void cterror(String messageCode, Object... arguments);

	/**
	 * Request to log that message corresponding for messageCode in Error mode
	 * 
	 * @param messageCode The messageCode to be logged
	 * @param t The exception to be logged
	 */
	public abstract void cterror(String messageCode, Throwable t);

	/**
	 * Request to log that message corresponding for messageCode in Error mode
	 * 
	 * @param messageCode The messageCode to be logged
	 * @param t The exception to be logged
	 * @param arguments The list of objects to be replaced in the various placeholders
	 */
	public abstract void cterror(String messageCode, Throwable t, Object... arguments);
}
