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
 */
package com.intellectdesign.canvas.report.scheduler;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

import org.quartz.DateBuilder;
import org.quartz.JobDetail;

import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.report.util.ReportConstants;

/**
 * Utility class for quartz Scheduler.
 * 
 * @version 1.0
 */

public class QuartzUtility
{
	private Date validatedStartDate = null;
	private Date validatedEndDate = null;

	private String expression = ReportConstants.QUARTZ_EXPRESSION;

	/**
	 * Checks if the Job Detail received is Null.
	 * 
	 * @param jobdetail > The jobDetail of the Job.
	 * @return true > If the Job Detail is Null.
	 * 
	 */
	public boolean checkNull(JobDetail jobdetail)
	{
		LOGGER.ctinfo("CTREP00458");
		boolean isNull = false;
		if (jobdetail == null)
		{
			isNull = true;
		}
		LOGGER.ctinfo("CTREP00459");
		return isNull;
	}

	/**
	 * Generates the cron expression for a particular trigger Type.
	 * 
	 * @param startDate > The Sttart date for the trigger.
	 * @param endDate > The End Date for the trigger.
	 * @param triggerType > The Type of the trigger E.g:Monthly,weekly.
	 * @param seconds > The Second at which the trigger should fire.
	 * @param minutes > The Minute at which the trigger should fire.
	 * @param hours > The Hour at which the trigger should fire.
	 * @param dayOfMonth > The Day of the Month at which the trigger should fire.
	 * @param dayOfWeek > The Day of the Week at which the trigger should fire.
	 * @return expression > The cron Expression.
	 * 
	 */
	public String generateCronExpression(Date startDate, Date endDate, String triggerType, int seconds, int minutes,
			int hours, String dayOfMonth, String dayOfWeek)
	{

		LOGGER.ctinfo("CTREP00460");
		String triggerMonth = "*";
		String tempDayOfWeek = ReportConstants.EMPTY_STR;
		String tempDayOfMonth = ReportConstants.EMPTY_STR;

		validatedStartDate = getValidStartDate(startDate);

		GregorianCalendar calendar = new GregorianCalendar();
		calendar.setTime(validatedStartDate);

		validatedEndDate = getValidEndDate(validatedStartDate, endDate);

		if (ReportConstants.DAILY_TRIGGER.equals(triggerType))

		{
			tempDayOfWeek = "?";
			tempDayOfMonth = "*";

		} else if (ReportConstants.WEEKLY_TRIGGER.equals(triggerType))
		{
			tempDayOfMonth = "?";
			if (dayOfWeek == null)
			{
				tempDayOfWeek = "*";
			}

			else
			{

				tempDayOfWeek = dayOfWeek;
			}

		} else if (ReportConstants.MONTHLY_TRIGGER.equals(triggerType))
		{
			tempDayOfWeek = "?";
			if (dayOfMonth == null)
			{
				tempDayOfMonth = "*";
			} else
			{
				tempDayOfMonth = dayOfMonth;

			}

		}
		buildExpression(seconds, minutes, hours, tempDayOfMonth, triggerMonth, tempDayOfWeek);
		LOGGER.ctinfo("CTREP00461");
		return expression;

	}

	/**
	 * 
	 * @param endDate
	 * @return
	 */
	public Date getValidEndDate(Date startDate, Date endDate)
	{
		Date theValidatedEndDate = endDate;
		if (endDate == null || endDate.before(startDate))
		{
			theValidatedEndDate = addDays(startDate, 1);
		}
		return theValidatedEndDate;
	}

	/**
	 * To be implemented when the requirement demands. /** validateTime:Validates the time passed to the trigger
	 * 
	 * 
	 * @param sec > The second at which the trigger should fire.
	 * 
	 * @param min > The minute at which the trigger should fire.
	 * 
	 * @param hour > The hour at which the trigger should fire.
	 * 
	 * @throw RuntimeException
	 * 
	 *        public void validateTime(int sec, int min, int hour) { if ((sec < 0 || sec > 59) || (min < 0 || min > 59)
	 *        || (hour < 0 || hour > 23)) { throw new RuntimeException("Undefined Sec/Min/Hour for the trigger"); }
	 * 
	 *        }
	 */
	/**
	 * checks if the start date of the trigger is null and sets the start date to the next given second if null as the
	 * start cannot be null and also cant be before the current date.
	 * 
	 * @param startDate > The actual start date
	 * @return startDate > The validated start date.
	 * 
	 */
	private Date getValidStartDate(Date startDate)
	{
		return (startDate == null || startDate.before(new Date())) ? DateBuilder.nextGivenSecondDate(new Date(),
				Calendar.SECOND) : startDate;

	}

	/**
	 * 
	 * @param date
	 * @param days
	 * @return Date
	 */
	private static Date addDays(Date date, int days)
	{
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.add(Calendar.DATE, days);
		return cal.getTime();
	}

	/**
	 * Builds the cron expression based on the the received parameters.
	 * 
	 * @param seconds > The Second when the trigger should fire.
	 * @param minutes > The Minute when the trigger should fire.
	 * @param hours > The Hour when the trigger should fire.
	 * @param dayOfMonth > The Day Of the Month when the trigger should fire.
	 * @param months > The Month when the trigger should fire.
	 * @param dayOfWeek > The Day of the Week when the trigger should fire.
	 * 
	 */
	private void buildExpression(int seconds, int minutes, int hours, String dayOfMonth, String months, String dayOfWeek)
	{
		LOGGER.ctinfo("CTREP00462");
		expression = expression.replace("{sec}", String.valueOf(seconds));
		expression = expression.replace("{min}", String.valueOf(minutes));
		expression = expression.replace("{hrs}", String.valueOf(hours));
		expression = expression.replace("{dom}", dayOfMonth);
		expression = expression.replace("{mon}", months);
		expression = expression.replace("{dow}", dayOfWeek);
		LOGGER.ctdebug("CTREP00463", expression);
		LOGGER.ctinfo("CTREP00464");

		// Added to test quartz scheduler...Will execute every 5th minute.
		// to be removed without fail when the test is completed and coninvcing.
		// expression = "0 0/5 * * * ?";

	}

	private static Logger LOGGER = Logger.getLogger(QuartzUtility.class);

	/**
	 * @return the validatedStartDate
	 */
	public Date getValidatedStartDate()
	{
		return validatedStartDate;
	}

	/**
	 * @param validatedStartDate the validatedStartDate to set
	 */
	public void setValidatedStartDate(Date validatedStartDate)
	{
		this.validatedStartDate = validatedStartDate;
	}

	/**
	 * @return the validatedEndDate
	 */
	public Date getValidatedEndDate()
	{
		return validatedEndDate;
	}

	/**
	 * @param validatedEndDate the validatedEndDate to set
	 */
	public void setValidatedEndDate(Date validatedEndDate)
	{
		this.validatedEndDate = validatedEndDate;
	}

}
