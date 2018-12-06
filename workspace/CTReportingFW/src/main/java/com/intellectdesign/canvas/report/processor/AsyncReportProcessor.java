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

package com.intellectdesign.canvas.report.processor;

import java.util.HashMap;
import java.util.Map;

import javax.transaction.HeuristicMixedException;
import javax.transaction.HeuristicRollbackException;
import javax.transaction.NotSupportedException;
import javax.transaction.RollbackException;
import javax.transaction.UserTransaction;

import org.omg.CORBA.SystemException;

import com.intellectdesign.canvas.classicdb.DataManager;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.report.exception.ReportingException;
import com.intellectdesign.canvas.report.instr.ReportInstruction;
import com.intellectdesign.canvas.report.scheduler.QuartzScheduler;
import com.intellectdesign.canvas.report.util.ReportConstants;
import com.intellectdesign.canvas.report.util.ReportUtil;
import com.intellectdesign.canvas.report.vo.ReportDefinition;
import com.intellectdesign.canvas.report.vo.ReportRequest;
import com.intellectdesign.canvas.report.vo.ReportResponse;

/**
 * This class extends the ReportProcessor.The methods inside the class will be accessed only when the communicationType
 * is Async
 * 
 * @version 1.0
 * */

public class AsyncReportProcessor extends ReportProcessor
{
	private Logger LOGGER = Logger.getLogger(AsyncReportProcessor.class);

	/**
	 * The method is used to save and schedule a report.This method performs the following. It call the saveReport
	 * method of reportprocessor to save the report definition. To schedule the report it creates an instance of
	 * QuartzScheduler and call the scheduleJob method of scheduler to schedule the job.Build the reponse object.return
	 * the reponse object
	 * 
	 * 
	 * @param Reportrequest contains the user selected report schedule details like schedule's from_date, todate, Type,
	 *            frequency
	 * @return ReportResponse contains the status of Schedule action.
	 * @throws ReportingException
	 * */
	@Override
	public ReportResponse saveAndScheduleReport(ReportRequest reportRequest) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00346");
		ReportResponse reportResponse = null;
		try
		{
			/**
			 * Step 1:Call the saveReport method of reportprocessor to save a report definition
			 */

			reportResponse = updateReportSchedule(reportRequest);

			LOGGER.ctdebug("CTREP00347", reportResponse.getReportId());
			/**
			 * Step 2: Check the User Transaction mode
			 * 
			 * Step 2.2 : If its is SIMULATION mode then SKIP this scheduleJob method of scheduler to schedule a job
			 * 
			 * Step 2.3 : if it is NON-SIMULATION mode then CALL the scheduleJob method of scheduler to schedule a job
			 * 
			 * */
			if (reportRequest.isSimulationMode())
			{
				LOGGER.ctdebug("CTREP00348");
			} else
			{
				QuartzScheduler reportScheduler = new QuartzScheduler();
				reportScheduler.scheduleJob(reportRequest);
			}
			/**
			 * Step 3:Build the response object
			 * */
			reportResponse.setStatus(ReportConstants.STATUS_SUCCESS);

		} catch (ReportingException saveAndScheduleException)
		{
			LOGGER.cterror("CTREP00349", saveAndScheduleException, reportRequest.getReportId());

			throw new ReportingException(saveAndScheduleException.getErrorCode(),
					saveAndScheduleException.getErrorMessage(), saveAndScheduleException);
		} catch (Exception exp)
		{
			LOGGER.cterror("CTREP00350", exp, reportRequest.getReportId());

			throw new ReportingException(ReportConstants.ERR_CD_RPT_DEFI_SAVE_SCHEDULE, exp);
		}

		LOGGER.ctinfo("CTREP00351");
		/**
		 * Step 4:Return the reponse object
		 * */
		return reportResponse;
	}

	/**
	 * The method is used to delete a report.The method perfroms the following: Create an instnace of the
	 * ReportingInstruction as reportInstruction.Call reportInstruction.deleteReportDefinition(reportId) to delete the
	 * report definition from DB. Create an instance of QuartzScheduler as reportScheduler.Call the
	 * reportScheduler.removeSchedule to delete the report definition from the scheduler. Build the reponse object.
	 * return the reponse object
	 * 
	 * @param ReportRequest contains the ReportId
	 * @return ReportResponse
	 * @throws ReportingException
	 * */
	@Override
	public ReportResponse deleteReport(ReportRequest reportRequest) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00352");
		ReportResponse reportResponse = new ReportResponse();

		try
		{
			/**
			 * Check the user Transaction type.
			 * 
			 * If it is NON-SIMULATION mode, Step 1: initialize and begin the UserTransaction Stpe 2: Call the
			 * reportInstruction.deleteReportDefinition() method to delete the report. Step 3: Commit the
			 * UserTransaction Step 4: Delete the corresponding reortJob in QuartzScheduler.
			 * 
			 * If it is SIMULATION mode then set the report Reponse is success.
			 * 
			 */
			if (!reportRequest.isSimulationMode())
			{
				/**
				 * Step 1:Initialize the UserTransaction and begin the transaction
				 */
				UserTransaction userTransaction = DataManager.getUserTransaction();

				if (userTransaction != null)
				{
					userTransaction.begin();
				}

				/**
				 * Step 2:Update the Report definition status as "DELETED" in DB.
				 */
				ReportInstruction reportInstruction = new ReportInstruction();
				reportInstruction.deleteReportDefinition(reportRequest.getReportId());

				/**
				 * Step 3:Commit the transaction
				 */
				if (userTransaction != null)
				{
					userTransaction.commit();
				}
				/**
				 * Step 4:Delete the report definition from Scheduler
				 * */
				QuartzScheduler reportScheduler = new QuartzScheduler();
				reportScheduler.deleteJob(reportRequest);
			}

			/**
			 * Step 5:Build the response object
			 * */
			reportResponse.setStatus(ReportConstants.STATUS_SUCCESS);

		} catch (ReportingException deleteException)
		{
			LOGGER.cterror("CTREP00353", deleteException, reportRequest.getReportId());

			throw new ReportingException(deleteException.getErrorCode(), deleteException.getErrorMessage(),
					deleteException);
		} catch (NotSupportedException nsExp)
		{
			LOGGER.cterror("CTREP00354", nsExp, reportRequest.getReportId(), nsExp);
			reportResponse = ReportUtil.createErrorResponse(reportRequest, ReportConstants.ERR_CD_RPT_DEFINITION_DEL);
		} catch (SystemException sysExp)
		{
			LOGGER.cterror("CTREP00355", sysExp, reportRequest.getReportId(), sysExp);
			reportResponse = ReportUtil.createErrorResponse(reportRequest, ReportConstants.ERR_CD_RPT_DEFINITION_DEL);
		} catch (SecurityException securityExp)
		{
			LOGGER.cterror("CTREP00356", securityExp, reportRequest.getReportId(), securityExp);
			reportResponse = ReportUtil.createErrorResponse(reportRequest, ReportConstants.ERR_CD_RPT_DEFINITION_DEL);
		} catch (IllegalStateException illgalExp)
		{
			LOGGER.cterror("CTREP00357", illgalExp, reportRequest.getReportId(), illgalExp);
			reportResponse = ReportUtil.createErrorResponse(reportRequest, ReportConstants.ERR_CD_RPT_DEFINITION_DEL);
		} catch (RollbackException rollbackExp)
		{
			LOGGER.cterror("CTREP00358", rollbackExp, reportRequest.getReportId(), rollbackExp);
			reportResponse = ReportUtil.createErrorResponse(reportRequest, ReportConstants.ERR_CD_RPT_DEFINITION_DEL);
		} catch (HeuristicMixedException heuristicMixedExp)
		{
			LOGGER.cterror("CTREP00359", heuristicMixedExp, reportRequest.getReportId(), heuristicMixedExp);
			reportResponse = ReportUtil.createErrorResponse(reportRequest, ReportConstants.ERR_CD_RPT_DEFINITION_DEL);
		} catch (HeuristicRollbackException heuristicRollbackExp)
		{
			LOGGER.cterror("CTREP00360", heuristicRollbackExp, reportRequest.getReportId(), heuristicRollbackExp);
			reportResponse = ReportUtil.createErrorResponse(reportRequest, ReportConstants.ERR_CD_RPT_DEFINITION_DEL);

		} catch (Exception exp)
		{
			LOGGER.cterror("CTREP00361", exp, reportRequest.getReportId(), exp);

			throw new ReportingException(ReportConstants.ERR_CD_RPT_DEFINITION_DEL,
					ReportConstants.ERR_CD_RPT_DEFINITION_DEL, exp);

		}

		LOGGER.ctinfo("CTREP00362");
		/**
		 * Step 6:return the reponse object
		 * */
		return reportResponse;
	}

	/**
	 * This is method for save/update the schedule for a report.
	 * 
	 * @param reportRequest contains the reportId, user filled scheduled details like from_date, to_date, Type,
	 *            Frequency values.
	 * @return ReportResponse - contains the schedule status.
	 * @throws ReportingException
	 */
	private ReportResponse updateReportSchedule(ReportRequest reportRequest) throws ReportingException
	{

		LOGGER.ctinfo("CTREP00363");
		ReportResponse reportResponse = new ReportResponse();

		try
		{
			/**
			 * Step 1: Construct the Report Definition.
			 * */
			ReportDefinition reportDefinition = new ReportDefinition();
			reportDefinition.setReportId(reportRequest.getReportId());

			/***
			 * Step 2: Schedule update process. Check whether the report already have schedule or not.
			 * 
			 * Step 2.1 : If already a schedule is mapped with this reportId's ReportDefinition means remove it and
			 * re-schedule it by DELETE the old scheduled job and ADD the new job to this reportId in QuartzScheduler.
			 * 
			 * Else (ie) if the ReportDefinition don't have schedule then ADD (ie)update the current schedule in
			 * QuartzScheduler.
			 */

			ReportInstruction reportInstruction = new ReportInstruction();
			ReportDefinition old_reportDefintion = reportInstruction.getReportDefinition(reportRequest.getReportId());

			if (old_reportDefintion != null && ReportUtil.isNotEmpty(old_reportDefintion.getFromDate()))
			{

				/**
				 * Step 2.1: Delete the report definition job from Scheduler. Other wise Error will come as :
				 * org.quartz.ObjectAlreadyExistsException: Unable to store Job :
				 * 'cbx_group.5f3bb16f-748c-48b7-82c9-1a1b08d2d84b', because one already exists with this
				 * identification.
				 * */

				QuartzScheduler reportScheduler = new QuartzScheduler();
				/**
				 * Check the User Transaction mode If it is SIMULATION mode then skip the
				 * reportScheduler.deleteJob(reportRequest) process If it is NON-SIMULATION mode then call the
				 * reportScheduler.deleteJob(reportRequest) to delete the job.
				 */
				if (reportRequest.isSimulationMode())
				{
					LOGGER.ctdebug("CTREP00366");
				} else
				{
					reportScheduler.deleteJob(reportRequest);
				}

			}

			/**
			 * Step 3: Construct the report Definiton object with NEW scheduled information.
			 */
			if (reportRequest.isScheduled())
			{
				reportDefinition.setFromDate(reportRequest.getScheduleFromDate());
				reportDefinition.setToDate(reportRequest.getScheduleToDate());
				reportDefinition.setType(reportRequest.getScheduleType());
				reportDefinition.setFrequencyValue(reportRequest.getScheduleFrequencyValue());
			} else
			{
				LOGGER.cterror("CTREP00364", reportRequest.getScheduleFromDate());
				throw new ReportingException(ReportConstants.ERR_CD_RPT_DEFINITION_SCHEDULE);
			}

			/**
			 * Step 4: Check the user transaction mode
			 * 
			 * Step 4.1 : if it is NON-SIMULATION mode then 4.1.1 : Initialize and begin the userTransaction 4.1.2 :
			 * call the reportInstruction.updateReportSchedule(reportDefinition) to update the schedule. 4.1.3 : commit
			 * the userTransaction.
			 * 
			 * 
			 * Step 4.2 : If its is SIMULATION mode Skip this reportInstruction.updateReportSchedule(reportDefinition)
			 * method to avoid the database update operation.
			 * */
			if (reportRequest.isSimulationMode())
			{
				LOGGER.ctdebug("CTREP00365");
			} else
			{
				/**
				 * Step 4.1.1: Initialize the UserTransaction and begin the transaction
				 */
				UserTransaction userTransaction = DataManager.getUserTransaction();
				if (userTransaction != null)
				{
					userTransaction.begin();
				}

				/**
				 * Step 4.1.2: call reportInstruction.updateReportSchedule(reportDefinition) to update the report
				 * schedule for the report definition in Database. using reportId.
				 * */
				reportInstruction.updateReportSchedule(reportDefinition);

				/**
				 * Step 4.1.3: Commit the transaction
				 */
				if (userTransaction != null)
				{
					userTransaction.commit();
				}
			}

			/**
			 * Step 5:Build the report response object with success message.
			 * */

			reportResponse.setStatus(ReportConstants.STATUS_SUCCESS);
			reportResponse.setReportId(reportDefinition.getReportId());

			Map responseObj = new HashMap();
			responseObj.put(ReportConstants.REPORTID, reportResponse.getReportId());

			/**
			 * Step 6:Build the report response object with schedule From and to days, Scheduler Type, Scheduler
			 * Frequencey Value as a input to show the report scheduler form.
			 * 
			 * */
			if (reportRequest.isScheduled())
			{
				if (ReportUtil.isNotEmpty(reportDefinition.getFromDate()))
				{
					String[] temp;
					String delimiter = ReportConstants.DELIMITER; /* white space used as delimeter */
					temp = reportDefinition.getFromDate().split(delimiter);

					responseObj.put(ReportConstants.SCHEDULER_FROM_DATE, temp[0]);

					if (reportDefinition.getToDate() != null && reportDefinition.getToDate().trim().length() > 0)
					{
						temp = reportDefinition.getToDate().split(delimiter);

						responseObj.put(ReportConstants.SCHEDULER_TO_DATE, temp[0]);
					}
					responseObj.put(ReportConstants.SCHEDULER_TYPE, reportDefinition.getType());
					responseObj.put(ReportConstants.SCHEDULER_FREQUENCY_VALUE, reportDefinition.getFrequencyValue());
				}
			}
			reportResponse.setResponseObject(responseObj);

		} catch (ReportingException scheduleException)
		{

			LOGGER.cterror("CTREP00367", scheduleException, reportRequest.getReportId(), scheduleException);

			throw new ReportingException(scheduleException.getErrorCode(), scheduleException.getErrorMessage(),
					scheduleException);
		} catch (NotSupportedException nsExp)
		{
			LOGGER.cterror("CTREP00368", nsExp, reportRequest.getReportId(), nsExp);
			throw new ReportingException(ReportConstants.ERR_CD_RPT_DEFINITION_SCHEDULE, nsExp);
		} catch (SystemException sysExp)
		{
			LOGGER.cterror("CTREP00369", sysExp, reportRequest.getReportId(), sysExp);
			throw new ReportingException(ReportConstants.ERR_CD_RPT_DEFINITION_SCHEDULE, sysExp);
		} catch (SecurityException securityExp)
		{
			LOGGER.cterror("CTREP00370", securityExp, reportRequest.getReportId(), securityExp);
			throw new ReportingException(ReportConstants.ERR_CD_RPT_DEFINITION_SCHEDULE, securityExp);
		} catch (IllegalStateException illgalExp)
		{
			LOGGER.cterror("CTREP00371", illgalExp, reportRequest.getReportId(), illgalExp);
			throw new ReportingException(ReportConstants.ERR_CD_RPT_DEFINITION_SCHEDULE, illgalExp);
		} catch (RollbackException rollbackExp)
		{
			LOGGER.cterror("CTREP00372", rollbackExp, reportRequest.getReportId(), rollbackExp);
			throw new ReportingException(ReportConstants.ERR_CD_RPT_DEFINITION_SCHEDULE, rollbackExp);
		} catch (HeuristicMixedException heuristicMixedExp)
		{
			LOGGER.cterror("CTREP00373", heuristicMixedExp, reportRequest.getReportId(), heuristicMixedExp);
			throw new ReportingException(ReportConstants.ERR_CD_RPT_DEFINITION_SCHEDULE, heuristicMixedExp);
		} catch (HeuristicRollbackException heuristicRollbackExp)
		{
			LOGGER.cterror("CTREP00374", heuristicRollbackExp, reportRequest.getReportId(), heuristicRollbackExp);
			throw new ReportingException(ReportConstants.ERR_CD_RPT_DEFINITION_SCHEDULE, heuristicRollbackExp);

		} catch (Exception exp)
		{
			LOGGER.cterror("CTREP00375", exp, reportRequest.getReportId(), exp);

			throw new ReportingException(ReportConstants.ERR_CD_RPT_DEFINITION_SCHEDULE, exp);
		}

		LOGGER.ctinfo("CTREP00376");
		/**
		 * Step 9:return the reponse object
		 * */
		return reportResponse;
	}
}
