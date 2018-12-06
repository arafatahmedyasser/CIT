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

import java.util.ResourceBundle;

import org.apache.log4j.Logger;

/**
 * The class measures the performance of particular section of a code by capturing their execution time. This class has
 * two methods to be called before and after a set of codes that records the start and end times. Any code elapsed for
 * more than 3000 milliseconds(configurable in Logger.properties file) is considered as a performance issue and advice
 * further reviewing.
 * 
 * 
 * @version 1.0
 */
public class PerformanceTimer
{
	private long startTime = 0l;

	private String methodName = null;

	/**
	 * An instance of Logger
	 */
	private static Logger logger = Logger.getLogger(PerformanceTimer.class);

	private static final boolean loggerthreshold;
	private static final int loggerthresholdlimit;
	static
	{
		ResourceBundle propRead = ResourceBundle.getBundle("performanceLogger");
		String thresholdRequired = propRead.getString("PERFORMANCE_TIMER_THRESHOLD");
		loggerthreshold = Boolean.valueOf(thresholdRequired.trim());

		if (loggerthreshold)
		{
			String thresholdlimit = propRead.getString("PERFORMANCE_TIMER_THRESHOLD_LIMIT");
			loggerthresholdlimit = new Integer(thresholdlimit.trim()).intValue();
		} else
		{
			loggerthresholdlimit = 0;
		}
		logger.log(CustomLevel.PERF, "Performance monitoring Threshold evaluated as " + loggerthresholdlimit + "ms");
	}

	/**
	 * This method captures the long format of the start time
	 * 
	 * @param startTime long value of start time in milliseconds
	 */
	private void setStartTime(long startTime)
	{
		this.startTime = startTime;
	}

	/**
	 * This method returns the start time
	 * 
	 * @return getStartTime long value of the current millisecond elapsed when the timer turned on
	 */
	private long getStartTime()
	{
		return this.startTime;
	}

	/**
	 * This method sets the name of the method for which performance tracking is turned on
	 * 
	 * @param methodName string value of the name of the method
	 */
	private void setMethodName(String methodName)
	{
		this.methodName = methodName;
	}

	/**
	 * This method returns the name of the method for which the performance tracking is turned on
	 * 
	 * @return getMethodName string value of the name of the method
	 */
	private String getMethodName()
	{

		return this.methodName;
	}

	/**
	 * This method captures the current time as method start time in milliseconds to compute the performance
	 * 
	 * @param aMethodName string value of the name of the method for which to capture the start time
	 */
	public void startTimer(String aMethodName)
	{
		setMethodName(aMethodName);
		if (startTime != 0l)
		{
			startTime = 0l;
		}
		long setGo = System.currentTimeMillis();
		setStartTime(setGo);
	}

	/**
	 * This method captures the current time as method (in particular class) start time in milliseconds to compute the
	 * performance
	 * 
	 * @param classname class object of the class that contains the method to track performance
	 * @param aMethodName string value of the name of the method for which to track performance
	 */
	public void startTimer(Class<?> classname, String aMethodName)
	{
		setMethodName(getClassNameWithoutPackage(classname) + "." + aMethodName);
		if (startTime != 0l)
		{
			startTime = 0l;
		}
		long setGo = System.currentTimeMillis();
		setStartTime(setGo);
	}

	/**
	 * This method captures the current time as method end time in milliseconds. After capturing the current time,
	 * computes the total duration of method or method of a class and records as Performance logs.
	 */
	public void endTimer()
	{
		long setGo = 0l;
		long finish = 0l;
		setGo = getStartTime();
		if (setGo != 0l)
		{
			finish = System.currentTimeMillis();
			long timeElapsed = finish - setGo;
			if (!loggerthreshold)
			{
				logger.log(CustomLevel.PERF, getMethodName() + "()$" + timeElapsed + "$ms");
			} else
			{
				if (timeElapsed >= loggerthresholdlimit)
				{
					logger.log(CustomLevel.PERF, getMethodName() + "()$" + timeElapsed + "$ms");
				}
			}
		} else
		{
			logger.log(CustomLevel.PERF, this.getMethodName()
					+ "() uses performance timer without starting it. Unable to validate time taken");
			return;
		}
		setStartTime(0l);
		setMethodName(null);
	}

	/**
	 * This method returns the name of the class.
	 * 
	 * @param classname class object for which to get the class name
	 * 
	 * @return getClassNameWithoutPackage string value of the name of the calss
	 */
	private String getClassNameWithoutPackage(Class<?> classname)
	{
		String clsname = "";
		if (classname != null)
		{
			clsname = classname.getName();
			int mid = clsname.lastIndexOf('.') + 1;
			String finalClsName = clsname.substring(mid);
			return finalClsName;
		} else
		{
			return "You passed null";
		}
	}

}
