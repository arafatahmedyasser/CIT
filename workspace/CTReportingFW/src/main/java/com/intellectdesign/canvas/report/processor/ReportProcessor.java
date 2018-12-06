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
import com.intellectdesign.canvas.report.job.SyncReportJob;
import com.intellectdesign.canvas.report.util.ReportConstants;
import com.intellectdesign.canvas.report.util.ReportStatus;
import com.intellectdesign.canvas.report.util.ReportUtil;
import com.intellectdesign.canvas.report.vo.ReportDefinition;
import com.intellectdesign.canvas.report.vo.ReportInstanceDefinition;
import com.intellectdesign.canvas.report.vo.ReportRequest;
import com.intellectdesign.canvas.report.vo.ReportResponse;

/**
 * It is a abstract class. It specifies the common functionalities of the various report processors like
 * AsyncReportProcessor and SyncReportProcessor. It implements IReportProcessor.
 * 
 * AbstractMethods:deleteReport
 * 
 * Implemented methods(Common methods for ASYNC and SYNC communication
 * type):saveReport,runReport,saveAndRunReport,runReportInstance
 * 
 * Methods with empty implementation:saveAndScheduleReport(Implemented in AsyncReportProcessor),deleteReport(Implemented
 * in AsyncReportProcesssor and SyncReportProcessor) private Methods:runImmediate
 * 
 * @version 1.0
 * */

public abstract class ReportProcessor implements IReportProcessor
{

	/**
	 * The method is used to delete a report definition.The method will delete the report definition from DB as well as
	 * scheduler in case of ASYNC communication type.In case of SYNC communication type the method will dele ethe report
	 * from DB only
	 * 
	 * @param ReportRequest
	 * @return ReportResponse
	 * @throws ReportingException
	 * 
	 * */
	@Override
	/**
	 * 
	 * @param reportRequest
	 * @return
	 * @throws ReportingException
	 * @see com.intellectdesign.canvas.report.processor.IReportProcessor#deleteReport(com.intellectdesign.canvas.report.vo.ReportRequest)
	 */
	public abstract ReportResponse deleteReport(ReportRequest reportRequest) throws ReportingException;

	/**
	 * The method is used to save a report definition in DB. This method performs the following: It will set isUpdate
	 * flag as true, if reportRequest contains reportId otherwise false.Call buildReportDefinition(reportRequest) method
	 * from ReportUtil class and get the reportDefinition object. Create instance for ReportInstruction as
	 * reportInstruction. If isUpdate flag is true, call reportInstruction.deleteReportDefinitionDtl
	 * (reportRequest.reportId) to delete the old report definition. Call
	 * reportInstruction.createReportDefinition(reportDefinition) to create new report definition. If the report is
	 * scheduled, it will call the scheduleJob(reportRequest) method of ReportScheduler. Build the report response
	 * object with success message.Return the report response.
	 * 
	 * @param ReportRequest object
	 * @return Instance of Report Response
	 * @throws ReportingException
	 * */
	@Override
	/**
	 * 
	 * @param reportRequest
	 * @return
	 * @throws ReportingException
	 * @see com.intellectdesign.canvas.report.processor.IReportProcessor#saveReport(com.intellectdesign.canvas.report.vo.ReportRequest)
	 */
	public ReportResponse saveReport(ReportRequest reportRequest) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00377");
		/**
		 * Step 1: Set isUpdate flag as true, if reportRequest contains reportId otherwise false.
		 */
		boolean isUpdateFlag = reportRequest.getReportId() != null;

		ReportResponse reportResponse = new ReportResponse();
		try
		{
			/**
			 * Step 2:Call buildReportDefinition(reportRequest) method from ReportUtil class and get the
			 * reportDefinition object.
			 **/
			ReportUtil reportUtil = new ReportUtil();

			ReportDefinition reportDefinition = reportUtil.buildReportDefinition(reportRequest);
			/**
			 * Step 3: Create instance for ReportInstruction as reportInstruction.
			 **/
			ReportInstruction reportInstruction = new ReportInstruction();

			/**
			 * Step 4:If isUpdate flag is true (ie) the given input reportRequest object containing reportId's
			 * ReportDefinition already available.
			 * 
			 * To update this reportdefiniton the step 4.1, 4.2 and 4.3 needs to done. Step 4.1 : First need to
			 * construct the old reportDefinition by reportInstruction.getReportDefinition(reportRequest.reportId) and
			 * set the
			 * 
			 * Step 4.2 : Call reportInstruction.deleteReportDefinitionDetails (reportRequest.reportId) to delete the
			 * old report Definition.
			 * 
			 * Step 4.3 : Call reportInstruction.createReportDefinition(reportDefinition) to create new report
			 * definition with already present reportId.
			 */
			ReportDefinition old_reportDefintion = null;
			if (isUpdateFlag)
			{
				/**
				 * Step 4.1:If isScheduled flag is true, then it's a scheduled report. Need to get the old schedule
				 * information from database and Massage scheduler information like from_date, todate, Type,
				 * FrequencyValue with current report definition details then call createReportDefintion() to update the
				 * report.
				 */

				old_reportDefintion = reportInstruction.getReportDefinition(reportRequest.getReportId());
				if (ReportUtil.isNotEmpty(old_reportDefintion.getFromDate()))
				{
					reportDefinition.setFromDate(old_reportDefintion.getFromDate());
					reportDefinition.setToDate(old_reportDefintion.getToDate());
					reportDefinition.setType(old_reportDefintion.getType());
					reportDefinition.setFrequencyValue(old_reportDefintion.getFrequencyValue());
				}
			}
			if (!reportRequest.isSimulationMode())
			{
				/**
				 * Initialize and begin the UserTransaction.
				 */
				UserTransaction userTransaction = DataManager.getUserTransaction();

				if (userTransaction != null)
				{
					userTransaction.begin();
				}

				if (isUpdateFlag)
				{
					/**
					 * Step 4.2: Delete the old report definition from Database for the reportId.
					 * 
					 * */
					LOGGER.ctdebug("CTREP00378");
					LOGGER.ctdebug("CTREP00379");
					reportInstruction.deleteReportDefinitionDetails(reportRequest.getReportId());
				}

				/**
				 * Step 4.3: Call reportInstruction.createReportDefinition(reportDefinition) to create new report
				 * definition with already present reportId (ie) updating the already available reportId's
				 * reportDefinition.
				 * */
				LOGGER.ctdebug("CTREP00380");
				reportInstruction.createReportDefinition(reportDefinition);

				/**
				 * commit the UserTransaction.
				 */
				if (userTransaction != null)
				{
					userTransaction.commit();
				}
			} else
			{
				LOGGER.ctdebug("CTREP00381");
			}

			/**
			 * Step 5:Build the report response object with success message.
			 * */

			reportResponse.setReportId(reportDefinition.getReportId());

			/**
			 * Step 6:Build the report response object with reportId as input for Scheduling report.
			 * 
			 * */

			Map responseObj = new HashMap();
			responseObj.put(ReportConstants.REPORTID, reportDefinition.getReportId());

			/**
			 * Step 7:Build the report response object with schedule From and to days, Scheduler Type, Scheduler
			 * Frequencey Value as a input to show the report scheduler form.
			 * 
			 * */
			if (old_reportDefintion != null && ReportUtil.isNotEmpty(old_reportDefintion.getFromDate()))
			{
				String[] temp;
				String delimiter = ReportConstants.DELIMITER; /* white space used as delimeter */
				temp = old_reportDefintion.getFromDate().split(delimiter);

				responseObj.put(ReportConstants.SCHEDULER_FROM_DATE, temp[0]);

				if (ReportUtil.isNotEmpty(old_reportDefintion.getToDate()))
				{
					temp = old_reportDefintion.getToDate().split(delimiter);

					responseObj.put(ReportConstants.SCHEDULER_TO_DATE, temp[0]);
				}
				responseObj.put(ReportConstants.SCHEDULER_TYPE, old_reportDefintion.getType());
				responseObj.put(ReportConstants.SCHEDULER_FREQUENCY_VALUE, old_reportDefintion.getFrequencyValue());
			}

			reportResponse.setResponseObject(responseObj);

		} catch (ReportingException saveReportException)
		{
			LOGGER.cterror("CTREP00382", saveReportException, reportRequest.getReportId());

			throw new ReportingException(saveReportException.getErrorCode(), saveReportException.getErrorMessage(),
					saveReportException);
		} catch (NotSupportedException nsExp)
		{
			LOGGER.cterror("CTREP00383", nsExp.getCause(), reportRequest.getReportId());
			throw new ReportingException(ReportConstants.ERR_CD_RPT_DEFINITION_SAVE, nsExp);
		} catch (SystemException sysExp)
		{
			LOGGER.cterror("CTREP00384", sysExp.getCause(), reportRequest.getReportId());
			throw new ReportingException(ReportConstants.ERR_CD_RPT_DEFINITION_SAVE, sysExp);
		} catch (SecurityException securityExp)
		{
			LOGGER.cterror("CTREP00385", securityExp.getCause(), reportRequest.getReportId());
			throw new ReportingException(ReportConstants.ERR_CD_RPT_DEFINITION_SAVE, securityExp);
		} catch (IllegalStateException illgalExp)
		{
			LOGGER.cterror("CTREP00386", illgalExp.getCause(), reportRequest.getReportId());
			throw new ReportingException(ReportConstants.ERR_CD_RPT_DEFINITION_SAVE, illgalExp);
		} catch (RollbackException rollbackExp)
		{
			LOGGER.cterror("CTREP00387", rollbackExp.getCause(), reportRequest.getReportId());
			throw new ReportingException(ReportConstants.ERR_CD_RPT_DEFINITION_SAVE, rollbackExp);
		} catch (HeuristicMixedException heuristicMixedExp)
		{
			LOGGER.cterror("CTREP00388", heuristicMixedExp.getCause(), reportRequest.getReportId());
			throw new ReportingException(ReportConstants.ERR_CD_RPT_DEFINITION_SAVE, heuristicMixedExp);
		} catch (HeuristicRollbackException heuristicRollbackExp)
		{
			LOGGER.cterror("CTREP00389", heuristicRollbackExp.getCause(), reportRequest.getReportId());
			throw new ReportingException(ReportConstants.ERR_CD_RPT_DEFINITION_SAVE, heuristicRollbackExp);
		} catch (Exception exp)
		{
			LOGGER.cterror("CTREP00390", exp, reportRequest.getReportId());

			throw new ReportingException(ReportConstants.ERR_CD_RPT_DEFINITION_SAVE, exp);
		}

		LOGGER.ctinfo("CTREP00391");
		/**
		 * Step 8:Return the report response
		 * */
		return reportResponse;
	}

	/**
	 * This method is used to run a report.This method performs the following. Set parent report id as report id in the
	 * report request.Run the report using runImmediate method.Build the report response object.Return the reponse
	 * object
	 * 
	 * @param ReportRequest contains the user selected form inputs to run the report.
	 * @return ReportResponse
	 * @throws ReportingException
	 * 
	 * */
	@Override
	/**
	 * 
	 * @param reportRequest
	 * @return
	 * @throws ReportingException
	 * @see com.intellectdesign.canvas.report.processor.IReportProcessor#runReport(com.intellectdesign.canvas.report.vo.ReportRequest)
	 */
	public ReportResponse runReport(ReportRequest reportRequest) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00392");
		ReportResponse reportResponse = null;
		/**
		 * Step 1:Set parent report id as report id in the report request
		 * */
		if (ReportUtil.isNotEmpty(reportRequest.getReportId()))
		{
			reportRequest.setReportId(reportRequest.getReportId());
		} else
		{
			reportRequest.setReportId(reportRequest.getParentReportId());
		}

		try
		{
			/**
			 * Step 2:Run the report using runImmediate method
			 */
			reportResponse = runImmediate(reportRequest);
			/**
			 * Step 3:Build the response object with the success message
			 * */
			reportResponse.setReportId(reportRequest.getReportId());
			reportResponse.setStatus(ReportConstants.STATUS_SUCCESS);

		} catch (ReportingException runException)
		{
			LOGGER.cterror("CTREP00393", runException, reportRequest.getReportId());

			throw new ReportingException(runException.getErrorCode(), runException.getErrorMessage(), runException);
		}
		LOGGER.ctinfo("CTREP00394");
		/**
		 * Step 4:Return the report response
		 * 
		 */
		return reportResponse;
	}

	/**
	 * This method is used to save and run a report.The method inturn calls the saveReport method to save a report and
	 * call runImmediate method to run a report immediately.Build the reponse object.Return the reponse object
	 * 
	 * @param ReportRequest contains the user selected form inputs to save and Run the report.
	 * @return ReportResponse
	 * @throws ReportingException
	 * 
	 * */
	@Override
	/**
	 * 
	 * @param reportRequest
	 * @return
	 * @throws ReportingException
	 * @see com.intellectdesign.canvas.report.processor.IReportProcessor#saveAndRunReport(com.intellectdesign.canvas.report.vo.ReportRequest)
	 */
	public ReportResponse saveAndRunReport(ReportRequest reportRequest) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00395");

		ReportResponse reportResponse = null;

		try
		{
			/**
			 * Step 1:Save the report definition for the particular report request
			 */
			reportResponse = saveReport(reportRequest);
			/**
			 * Step 2: Update the ReportID in ReportRequest which is got from current save action's reportResponse
			 * object.
			 * */
			reportRequest.setReportId(reportResponse.getReportId());

			/**
			 * Step 3: Run the report immediately for the paricular reportRequest if request communicationType is SYNC.
			 * */
			reportResponse = runImmediate(reportRequest);

			/**
			 * Step 4:Building the ReportResponse by updating reportId and sccess-status.
			 * */
			reportResponse.setReportId(reportRequest.getReportId());
			reportResponse.setStatus(ReportConstants.STATUS_SUCCESS);
		} catch (ReportingException saveAndRunReportException)
		{
			LOGGER.cterror("CTREP00396", saveAndRunReportException, reportRequest.getReportId());

			throw new ReportingException(saveAndRunReportException.getErrorCode(),
					saveAndRunReportException.getErrorMessage(), saveAndRunReportException);
		} catch (Exception exp)
		{
			LOGGER.cterror("CTREP00397", exp, reportRequest.getReportId());

			throw new ReportingException(ReportConstants.ERR_CD_RPT_DEFI_SAVE_RUN, exp);
		}

		LOGGER.ctinfo("CTREP00398");
		/**
		 * Step4:Returning the repornse object
		 * */
		return reportResponse;
	}

	/**
	 * The method is used to save and schedule a report definition.The method is implemented inside AsynReportProcessor
	 * 
	 * @param ReportRequest
	 * @return ReportResponse
	 * @throws ReportingException
	 * 
	 * */
	@Override
	public ReportResponse saveAndScheduleReport(ReportRequest reportRequest) throws ReportingException
	{
		LOGGER.cterror("CTREP00399");
		return null;
	}

	/**
	 * The method is used to run the ReportDefinition instantly. It will be triggered by the context menu (Run Now) from
	 * the generated Reports grid.
	 * 
	 * @param ReportRequest object contains the user selected report instance details like instanceId, format name,
	 *            etc...
	 * @return Instance of ReportResponse
	 * @throws ReportngException
	 * 
	 * */
	@Override
	public ReportResponse runReportInstance(ReportRequest reportRequest) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00400");
		ReportResponse reportResponse = new ReportResponse();

		ReportInstruction reportInstruction = new ReportInstruction();

		try
		{
			/**
			 * call getReportInstanceDefinition(String reportInstanceId) of ReportInstruction.java and get the
			 * ReportInstanceDefinition object.
			 */
			ReportInstanceDefinition reportInstanceDefinition = reportInstruction
					.getReportInstanceDefinition(reportRequest.getReportInstanceId());

			if (reportInstanceDefinition != null)
			{
				/**
				 * Set the SYNC Communication Type to ReportRequest object
				 */
				reportRequest.setCommunicationType(ReportRequest.SYNC);

				/**
				 * Create instance for SyncReportJob as reportJob and call setReportInstanceDefinition().
				 */

				SyncReportJob syncReportJob = new SyncReportJob();

				/**
				 * Updating the status and report instance id for the new report instance definition.
				 * */
				reportInstanceDefinition.setStatus(ReportStatus.INIT.toString());
				reportInstanceDefinition.setReportInstanceId(ReportUtil.createReportInstanceId());
				syncReportJob.setReportInstanceDefinition(reportInstanceDefinition);

				String reportInstanceId = syncReportJob.executeReport(reportRequest);

				/**
				 * Construct the SUCCESS reportResponse and return to ReportManager.
				 */

				reportResponse.setReportInstanceId(reportInstanceId);
				reportResponse.setReportName(reportInstanceDefinition.getReportName());
				reportResponse.setStatus(ReportConstants.STATUS_SUCCESS);

				// Create ResponseObject Map's <Key,Value> as <"REPORT_INSTANCE_DEFINITION", reportInstanceDefinition>
				// and set the ReposeObject.
				Map<String, String> reportInstanceDefMap = new HashMap<String, String>();
				reportInstanceDefMap.put(ReportConstants.REPORT_INSTANCE_ID, reportInstanceId); // CHG0001_OT0138_INFO_RPT_FW
				reportInstanceDefMap.put(ReportConstants.REPORT_NAME, reportInstanceDefinition.getReportName()); // CHG0001_OT0138_INFO_RPT_FW
				reportResponse.setResponseObject(reportInstanceDefMap);
			} else
			{
				/**
				 * Construct the FAILURE reportResponse and return to ReportManager.
				 */

				LOGGER.cterror("CTREP00401");
				throw new ReportingException(ReportConstants.ERR_CD_RPT_GEN_FAILURE);

			}

		} catch (ReportingException runNowException)
		{
			LOGGER.cterror("CTREP00402", runNowException);
			throw new ReportingException(runNowException.getErrorCode(), runNowException.getErrorMessage(),
					runNowException);
		} catch (Exception exp)
		{
			LOGGER.cterror("CTREP00402", exp);
			throw new ReportingException(ReportConstants.ERR_CD_RPT_GEN_FAILURE, exp);
		}
		LOGGER.ctinfo("CTREP00403");
		return reportResponse;
	}

	/**
	 * The methiod is used to run a report immediately at a particular instance. If the ReportRequest has
	 * runImmidiateFlag as true then the method will be called. The method performs the following: Call the
	 * executeReport report method of SyncReportJob.The executeReport method calls
	 * ReportUtil.buildReportInstanceDefinition(reportRequest) and get the reportInstanceDefinition object. Set the new
	 * report instance id in reportInstanceDefinition object and report request. Call
	 * reportInstruction.createReportInstanceDefinition(reportInstanceDefinition) to insert into database. Call
	 * addToImmediateQueue(reportRequest) to add to the immediate report execution queue. Please refer the "Execution
	 * Queue" sequential flow. Call reportInstruction.updateReportInstanceStatus(reportInstanceId, ReportStatus.QUEUED )
	 * and update the report instance status.
	 * 
	 * @return void
	 * @param ReportingException
	 * 
	 * */
	private ReportResponse runImmediate(ReportRequest reportRequest) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00404");
		ReportResponse reportResponse = new ReportResponse();
		String reportInstanceId = null;
		try
		{
			/**
			 * Step 1: Create a instance for SyncReportJob as reportJob.
			 * */
			SyncReportJob reportJob = new SyncReportJob();

			/**
			 * Step 2: create ReportInstanceDefinition object based on the ReportRequest and set to reportJob.
			 * 
			 * */
			ReportInstanceDefinition reportInstanceDefinition = ReportUtil.buildReportInstanceDefinition(reportRequest);
			reportJob.setReportInstanceDefinition(reportInstanceDefinition);

			/**
			 * Step 3: Call reportJob.execute(reportRequest)
			 * 
			 * */
			reportInstanceId = reportJob.executeReport(reportRequest);
			/**
			 * Step 4:Build the Response Object with reportInstanceId.
			 * */
			reportResponse.setReportInstanceId(reportInstanceId);
		} catch (ReportingException runImmediateException)
		{
			LOGGER.cterror("CTREP00405", runImmediateException, reportRequest.getReportInstanceId());

			throw new ReportingException(runImmediateException.getErrorCode(), runImmediateException.getErrorMessage(),
					runImmediateException);
		} catch (Exception exp)
		{
			LOGGER.cterror("CTREP00405", exp, reportRequest.getReportInstanceId());

			throw new ReportingException(ReportConstants.ERR_CD_RPT_GEN_FAILURE, exp);
		}
		LOGGER.ctinfo("CTREP00406");
		/**
		 * Step 5:return the response object
		 * */
		return reportResponse;
	}

	// instantiating logger object.
	private static Logger LOGGER = Logger.getLogger(ReportProcessor.class);
}
