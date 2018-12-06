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

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;
import org.quartz.CronScheduleBuilder;
import org.quartz.CronTrigger;
import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.TriggerBuilder;
import org.quartz.TriggerKey;
import org.quartz.impl.matchers.GroupMatcher;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.report.exception.ReportingException;
import com.intellectdesign.canvas.report.job.IReportJob;
import com.intellectdesign.canvas.report.job.QuartzReportJob;
import com.intellectdesign.canvas.report.util.ReportConstants;
import com.intellectdesign.canvas.report.util.ReportUtil;
import com.intellectdesign.canvas.report.vo.ReportRequest;

/**
 * This class handles the various quartz scheduler related operations.
 * 
 * @version 1.0
 */

public class QuartzScheduler implements IReportScheduler
{
	TriggerKey triggerKey;
	JobKey jobKey;

	/**
	 * 
	 * @throws ReportingException
	 */
	public QuartzScheduler() throws ReportingException
	{
		scheduler = ReportSchedulerFactory.getInstance().getQuartzScheduler();
	}

	/**
	 * Schedule a new quartz job with the given job details.
	 * 
	 * @param reportRequest > The request that contains the information related to a report.
	 * @throws SchedulerException.
	 * @throws ParseException.
	 * 
	 */

	public void scheduleJob(ReportRequest reportRequest) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00444");
		String cronExpression = null;
		Date startDate = null;
		Date endDate = null;
		int seconds = 0;
		int minutes = 0;
		int hours = 0;

		String triggerType;
		String dom = null;
		QuartzUtility quartzUtility = new QuartzUtility();
		boolean isNull = true;
		String dow = null;
		try
		{
			// Sets the various schedule related parameters for the report from the reportRequest.
			String jobName = reportRequest.getReportId(); // example: 24/07/2012
			String delimiter = "\\/"; /* Date Sperator used as the delimeter */
			if (reportRequest.getScheduleFromDate() != null)
			{

				String[] temp = reportRequest.getScheduleFromDate().trim().split(delimiter);
				int date = Integer.parseInt(temp[0].trim());
				int month = Integer.parseInt(temp[1].trim());
				int year = Integer.parseInt(temp[2].trim());

				startDate = ReportUtil.parseDate(year, month, date, ReportConstants.TRIGGER_DATE_TIME_FORMAT); // "EEE MMM d HH:mm:ss zzz yyyy"

			}

			if (reportRequest.getScheduleToDate() != null)
			{

				String[] temp = reportRequest.getScheduleToDate().trim().split(delimiter);
				int date = Integer.parseInt(temp[0].trim());
				int month = Integer.parseInt(temp[1].trim());
				int year = Integer.parseInt(temp[2].trim());

				endDate = ReportUtil.parseDate(year, month, date, ReportConstants.TRIGGER_DATE_TIME_FORMAT);

			}
			triggerType = reportRequest.getScheduleType();
			String triggerName = reportRequest.getReportId() + ReportConstants.TRIGGER_SUFFIX; // "_Trigger";

			// Builds the job Deatils.
			JobDetail jobDetail = JobBuilder.newJob(QuartzReportJob.class).withIdentity(jobName, GROUP_NAME)
					.requestRecovery().build();
			// Puts the report Request in the job data map.
			jobDetail.getJobDataMap().put("ReportRequest", reportRequest);
			LOGGER.ctinfo("CTREP00445", jobName, startDate, endDate, triggerType, dom, dow);
			isNull = quartzUtility.checkNull(jobDetail);
			if (!isNull)
			{
				if (triggerType.equals(ReportConstants.WEEKLY_TRIGGER))
				{
					dow = reportRequest.getScheduleFrequencyValue();
					if (dow.equals("M"))
					{
						dow = ReportConstants.MONDAY;
					} else if (dow.equals("T"))
					{
						dow = ReportConstants.TUESDAY;
					} else if (dow.equals("W"))
					{
						dow = ReportConstants.WEDNESDAY;
					} else if (dow.equals("Th"))
					{
						dow = ReportConstants.THURSDAY;
					} else if (dow.equals("F"))
					{
						dow = ReportConstants.FRIDAY;
					} else if (dow.equals("Sa"))
					{
						dow = ReportConstants.SATURDAY;
					} else if (dow.equals("S"))
					{
						dow = ReportConstants.SUNDAY;
					}
				}

				else if (triggerType.equals(ReportConstants.MONTHLY_TRIGGER)
						|| triggerType.equals(ReportConstants.DAILY_TRIGGER))
				{
					dom = reportRequest.getScheduleFrequencyValue();
					if (dom.equals("F"))
					{
						dom = "1";
					}
				}
				// generates the expression for the cron trigger.
				cronExpression = quartzUtility.generateCronExpression(startDate, endDate, triggerType, seconds,
						minutes, hours, dom, dow);
				/**
				 * Commented for later implementation if needed SIMPLE TRIGGER implementation. SimpleTrigger trigger =
				 * new SimpleTrigger(jobDetail, TRIGGER_GROUP_NAME, jobDetail.getName(),
				 * jobDetail.getGroup(jobDetail.getJobClass().getClass()), startDate, endDate, repeatCount,
				 * repeatInterval);
				 */
				// Builds the cron trigger.
				startDate = quartzUtility.getValidatedStartDate();
				endDate = quartzUtility.getValidatedEndDate();
				CronTrigger trigger = TriggerBuilder.newTrigger().startAt(startDate).endAt(endDate)
						.withIdentity(triggerName, TRIGGER_GROUP_NAME)
						.withSchedule(CronScheduleBuilder.cronSchedule(cronExpression)).build();
				// Schedules the job.
				scheduler.scheduleJob(jobDetail, trigger);

			}
		} catch (ParseException parseException)
		{
			LOGGER.cterror("CTREP00446", parseException);
			throw new ReportingException(ReportConstants.REPORT_ERR_PEX, parseException);

		} catch (SchedulerException schedulerException)
		{
			LOGGER.cterror("CTREP00447", schedulerException);
			throw new ReportingException(ReportConstants.REPORT_ERR_SCHED, schedulerException);
		} catch (ReportingException reportExp)
		{
			LOGGER.cterror("CTREP00448", reportExp);
			throw reportExp;

		} catch (Exception exp)
		{
			LOGGER.cterror("CTREP00449", exp);
			throw new ReportingException(ReportConstants.REPORT_ERR_SCHED, exp);
		}
		LOGGER.ctinfo("CTREP00450");
	}

	/**
	 * creates a job and returns the Job detail to the calling method
	 * 
	 * @param jobKey > The job Name which identifies a job.
	 * @return JobDetail
	 */
	public IReportJob createJob(ReportRequest reportRequest)
	{
		LOGGER.ctinfo("QuartzScheduler.createJob Method.");
		// LOGGER.ctinfo(QuartzReportJob.class);
		LOGGER.ctinfo("QuartzScheduler.createJob Method.");
		return new QuartzReportJob();
	}

	/**
	 * Delete the job for the given name, return true if the job was deleted.
	 * 
	 * @param jobKey > the name/key of the job to delete.
	 * @return true > if the Job was found and deleted.
	 * @throws SchedulerException.
	 */
	public String deleteJob(ReportRequest reportRequest) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00451");
		boolean isDeleted = false;
		String isJobDeleted = null;
		try
		{
			setJobKey(reportRequest.getReportId());
			setTriggerKey(buildTriggerName(reportRequest.getReportId()));
			if (hasJob(jobKey))
			{
				isDeleted = getScheduler().unscheduleJob(triggerKey);
				getScheduler().deleteJob(jobKey);
				if (isDeleted)
				{
					isJobDeleted = ReportConstants.JOB_DELETED;
				} else
				{
					isJobDeleted = ReportConstants.JOB_NOT_DELETED;
				}
			} else
			{
				isJobDeleted = ReportConstants.INVALID_JOB_NAME;
			}
		} catch (SchedulerException schedulerException)
		{
			// String msg = "Could not obtain Quartz Scheduler JobDetails";
			LOGGER.cterror("CTREP00452", schedulerException);
			throw new ReportingException(ReportConstants.REPORT_ERR_SCHED, schedulerException);
		}
		LOGGER.ctinfo("CTREP00453");

		return isJobDeleted;
	}

	/**
	 * Return the list of scheduled JobDetails for the group name: "cbxgroup".
	 * 
	 * @return JobDetail > the list of scheduled JobDetails for the group name: "cbx_group".
	 * @throws SchedulerException
	 */
	private List<JobDetail> getJobDetailList()
	{
		LOGGER.ctinfo("CTREP00454");
		List<JobDetail> jobDetailList = new ArrayList<JobDetail>();
		try
		{
			Set<JobKey> jobKeysByGroup = getScheduler().getJobKeys(GroupMatcher.groupEquals(GROUP_NAME));
			for (JobKey aJobKey : jobKeysByGroup)
			{
				jobDetailList.add(getScheduler().getJobDetail(aJobKey));
			}
		} catch (SchedulerException schedulerException)
		{
			LOGGER.cterror("CTREP00452", schedulerException);
		}
		LOGGER.ctinfo("CTREP00455");
		return jobDetailList;
	}

	/**
	 * Returns true if the scheduler has the named job.
	 * 
	 * @param jobkey > the name of the job.
	 * @return true > If the scheduler has the named job.
	 * @throws SchedulerException.
	 */
	private boolean hasJob(JobKey aJobKey)
	{
		LOGGER.ctinfo("CTREP00456");
		boolean hasJob = false;
		List jobDetailList = getJobDetailList();
		for (int i = 0; i < jobDetailList.size(); i++)
		{
			JobDetail jd = (JobDetail) jobDetailList.get(i);
			if (aJobKey.getName().equals(jd.getKey().getName()))
			{
				hasJob = true;
				break;
			}
		}

		LOGGER.ctinfo("CTREP00457");
		return hasJob;
	}

	/**
	 * Return the scheduler instance.
	 * 
	 * @return Scheduler > The scheduler instance.
	 * 
	 */
	public Scheduler getScheduler()
	{
		return scheduler;
	}

	/**
	 * Sets the jobkey for the corresponding report Id.
	 * 
	 * @param jobName
	 */
	private void setJobKey(String jobName)
	{
		jobKey = JobKey.jobKey(jobName, GROUP_NAME);
	}

	/**
	 * Used to build the TriggerName with Trigger_suffix
	 * 
	 * @param triggerName
	 */
	private String buildTriggerName(String triggerName)
	{
		String tempTriggerName = triggerName + ReportConstants.TRIGGER_SUFFIX;
		return tempTriggerName;
	}

	/**
	 * Set the trigger Key for the given triggerName.
	 * 
	 * @param triggerName
	 */
	private void setTriggerKey(String triggerName)
	{
		triggerKey = TriggerKey.triggerKey(triggerName, TRIGGER_GROUP_NAME);
	}

	private static Logger LOGGER = Logger.getLogger(QuartzScheduler.class);
	ConfigurationManager config = ConfigurationManager.getInstance();
	private String GROUP_NAME = config.getInformationReportingDescriptor().getSchedulerGroupname();
	private String TRIGGER_GROUP_NAME = config.getInformationReportingDescriptor().getSchedulerTriggerGroupname();
	private Scheduler scheduler;

}
