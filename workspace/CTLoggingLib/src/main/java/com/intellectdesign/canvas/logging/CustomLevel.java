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

package com.intellectdesign.canvas.logging;

import org.apache.log4j.Level;

/**
 * This class is an extension of the logger level class with a newly custom added log level as "PERF" for performance
 * tracking. This custom log level is attached with the ERROR level logging so that all the performance tracking logs
 * are generated even when log4j.properties is set to ERROR mode.
 * 
 * @version 1.0
 * @see org.apache.log4j.Level
 */
public class CustomLevel extends Level
{

	/**
	 * version UID for serialization
	 */
	private static final long serialVersionUID = 7288304330257085144L;

	private static String PERF_STR = "PERF";

	public static final int PERF_INT = Level.ERROR_INT + 1;
	public static final CustomLevel PERF = new CustomLevel(PERF_INT, PERF_STR, 3);

	/**
	 * This constructor initiates the logger level object
	 * 
	 * @param levleInt integer value indicating the logging level
	 * @param levelString string value of the logger level name
	 * @param syslogEquiv integer value indicating the System Equivalent Logging Value
	 */
	protected CustomLevel(int levleInt, String levelString, int syslogEquiv)
	{
		super(levleInt, levelString, syslogEquiv);
	}

	/**
	 * This method converts the string passed as argument to a custom logging level.
	 * 
	 * @param sArg string value of the argument passed to get the custom logging level i.e performance logging
	 * @return toLevel corresponding custom logging level i.e performance logging
	 */
	public static Level toLevel(String sArg)
	{
		return toLevel(sArg, CustomLevel.PERF);
	}

	/**
	 * This method converts a string argument from one level to custom log Level. When custom log level is not set, this
	 * method intern will return the default logging Level.
	 * 
	 * @param sArg string value of the argument for convertion
	 * @param defaultValue default logging level to be converted
	 * @return toLevel converted logging level of the argument or the default level
	 */
	public static Level toLevel(String sArg, Level defaultValue)
	{

		if (sArg == null)
		{
			return defaultValue;
		}
		String stringVal = sArg.toUpperCase();

		if (stringVal.equals(PERF_STR))
		{
			return CustomLevel.PERF;
		}

		return Level.toLevel(sArg, defaultValue);
	}

	/**
	 * This method converts an integer passed as argument to a custom logging level. If the conversion fails, then this
	 * method returns default logging level of logger object
	 * 
	 * @param i integer value indicating the logging level
	 * @return toLevel Logging level object matching the integer value
	 * @throws IllegalArgumentException exception object when the argument passsed is an illegal or inappropriate value
	 */
	public static Level toLevel(int i) throws IllegalArgumentException
	{
		switch (i)
		{
		case PERF_INT:
			return CustomLevel.PERF;
		}
		return Level.toLevel(i);
	}

}
