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
import com.intellectdesign.canvas.report.util.ReportConstants;
import com.intellectdesign.canvas.report.util.ReportUtil;
import com.intellectdesign.canvas.report.vo.ReportRequest;
import com.intellectdesign.canvas.report.vo.ReportResponse;

/**
 * This class extends the ReportProcessor.The methods inside the class will be accessed only when the communicationType
 * is Sync
 * 
 * @version 1.0
 * 
 * */

public class SyncReportProcessor extends ReportProcessor
{
	private Logger LOGGER = Logger.getLogger(SyncReportProcessor.class);

	/**
	 * The method is used to delete a report definition.the method performs the following: Create an instance of
	 * ReportingInstruction.call the deleteReportDefinition of ReportingInstruction to delete the report definition from
	 * Db for the particular report.Build the ReportResponse object.return the Reportresponse object
	 * 
	 * @param ReportRequestObject contains the ReportId
	 * @return Instance of ReportResponse - contains the status of the report deletion.
	 * @throws ReportingException
	 * */
	@Override
	/**
	 * 
	 * @param reportRequest
	 * @return
	 * @throws ReportingException
	 * @see com.intellectdesign.canvas.report.processor.ReportProcessor#deleteReport(com.intellectdesign.canvas.report.vo.ReportRequest)
	 */
	public ReportResponse deleteReport(ReportRequest reportRequest) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00407");
		ReportResponse reportResponse = new ReportResponse();
		try
		{
			/**
			 * Check the user Transaction type.
			 * 
			 * If it is NON-SIMULATION mode, Step 1: initialize and begin the UserTransaction Stpe 2: Call the
			 * reportInstruction.deleteReportDefinition() method to delete the report. Step 3: Commit the
			 * UserTransaction
			 * 
			 * If it is SIMULATION mode then set the report Reponse is success.
			 * 
			 */
			if (!reportRequest.isSimulationMode())
			{
				/**
				 * Step 1:Initialize the UserTransaction and Begin the transaction
				 */
				UserTransaction userTransaction = DataManager.getUserTransaction();

				if (userTransaction != null)
				{
					userTransaction.begin();
				}

				/**
				 * Step 2: create instance for ReportInstruction class and call deleteReportDefinition() to update the
				 * report status as "DELETED".
				 */
				ReportInstruction reportInstruction = new ReportInstruction();
				reportInstruction.deleteReportDefinition(reportRequest.getReportId());

				/**
				 * Commit the transaction.
				 */
				if (userTransaction != null)
				{
					userTransaction.commit();
				}
			}

			/**
			 * Step 3:Build the ReportResponse object
			 * */
			reportResponse.setStatus(ReportConstants.STATUS_SUCCESS);
		} catch (javax.transaction.SystemException e)
		{
			LOGGER.cterror("CTREP00574", e, reportRequest.getReportId(), e);
			reportResponse = ReportUtil.createErrorResponse(reportRequest, ReportConstants.ERR_CD_RPT_DEFINITION_DEL);
		} catch (ReportingException deleteException)
		{
			LOGGER.cterror("CTREP00408", deleteException, reportRequest.getReportId(), deleteException);

			throw new ReportingException(deleteException.getErrorCode(), deleteException.getErrorMessage(),
					deleteException);
		} catch (NotSupportedException nsExp)
		{
			LOGGER.cterror("CTREP00409", nsExp, reportRequest.getReportId(), nsExp);
			reportResponse = ReportUtil.createErrorResponse(reportRequest, ReportConstants.ERR_CD_RPT_DEFINITION_DEL);
		} catch (SystemException sysExp)
		{
			LOGGER.cterror("CTREP00410", sysExp, reportRequest.getReportId(), sysExp);
			reportResponse = ReportUtil.createErrorResponse(reportRequest, ReportConstants.ERR_CD_RPT_DEFINITION_DEL);
		} catch (SecurityException securityExp)
		{
			LOGGER.cterror("CTREP00411", securityExp, reportRequest.getReportId(), securityExp);
			reportResponse = ReportUtil.createErrorResponse(reportRequest, ReportConstants.ERR_CD_RPT_DEFINITION_DEL);
		} catch (IllegalStateException illgalExp)
		{
			LOGGER.cterror("CTREP00412", illgalExp, reportRequest.getReportId(), illgalExp);
			reportResponse = ReportUtil.createErrorResponse(reportRequest, ReportConstants.ERR_CD_RPT_DEFINITION_DEL);
		} catch (RollbackException rollbackExp)
		{
			LOGGER.cterror("CTREP00413", rollbackExp, reportRequest.getReportId(), rollbackExp);
			reportResponse = ReportUtil.createErrorResponse(reportRequest, ReportConstants.ERR_CD_RPT_DEFINITION_DEL);
		} catch (HeuristicMixedException heuristicMixedExp)
		{
			LOGGER.cterror("CTREP00414", heuristicMixedExp, reportRequest.getReportId(), heuristicMixedExp);
			reportResponse = ReportUtil.createErrorResponse(reportRequest, ReportConstants.ERR_CD_RPT_DEFINITION_DEL);
		} catch (HeuristicRollbackException heuristicRollbackExp)
		{
			LOGGER.cterror("CTREP00415", heuristicRollbackExp, reportRequest.getReportId(), heuristicRollbackExp);
			reportResponse = ReportUtil.createErrorResponse(reportRequest, ReportConstants.ERR_CD_RPT_DEFINITION_DEL);
		}
		LOGGER.ctinfo("CTREP00416");
		/**
		 * step 4:Return the Reportresponse object
		 * */
		return reportResponse;
	}

}
