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

package com.intellectdesign.canvas.report;

import java.util.HashMap;
import java.util.Map;

import com.intellectdesign.canvas.entitlement.EntitlementEngineConstants;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.report.exception.ReportingException;
import com.intellectdesign.canvas.report.instr.ReportInstruction;
import com.intellectdesign.canvas.report.processor.AsyncReportProcessor;
import com.intellectdesign.canvas.report.processor.IReportProcessor;
import com.intellectdesign.canvas.report.processor.SyncReportProcessor;
import com.intellectdesign.canvas.report.util.ReportConstants;
import com.intellectdesign.canvas.report.util.ReportUtil;
import com.intellectdesign.canvas.report.vo.ReportDefinition;
import com.intellectdesign.canvas.report.vo.ReportRequest;
import com.intellectdesign.canvas.report.vo.ReportResponse;

/**
 * This ReportManager class is the single point of contact to access reporting functionality from the Handler classes.
 * 
 * @version 1.0
 */

public class ReportManager
{

	/**
	 * This method will choose the appropriate ReportProcessor according to the reportRequest and save the report.
	 * 
	 * @param reportRequest have the input data which is given by the user to create the Report Definition.
	 * @return reportResponse - which have the report saved status, reportId, etc...
	 */
	public ReportResponse saveReport(ReportRequest reportRequest)
	{
		logger.ctinfo("CTREP00001");

		/**
		 * Check the Report entitlement for the user. If user have the entitlement continue the save process. Otherwise
		 * throw the Entitlement Exception.
		 */
		ReportResponse reportResponse = null;
		if (ReportUtil.isEntitled(reportRequest))
		{
			IReportProcessor reportProcessor = getProcessor(reportRequest.getCommunicationType());

			try
			{
				/**
				 * Call ReportProcesser saveReport(reportRequest) to save the Report Definition.
				 */
				reportResponse = reportProcessor.saveReport(reportRequest);
				reportResponse.setStatus(ReportConstants.STATUS_SUCCESS);

			} catch (ReportingException reportExp)
			{
				logger.cterror("CTREP00002", reportExp.getCause());
				reportResponse = ReportUtil.createErrorResponse(reportRequest, reportExp.getErrorCode(),
						reportExp.getErrorMessage());
			} catch (Exception exp)
			{
				logger.cterror("CTREP00003 ", exp.getCause());
				reportResponse = ReportUtil.createErrorResponse(reportRequest,
						ReportConstants.ERR_CD_RPT_DEFINITION_SAVE);
			}
		} else
		{
			logger.cterror("CTREP00004");
			reportResponse = ReportUtil.createErrorResponse(reportRequest,
					EntitlementEngineConstants.ERR_CD_RPT_ENTL_FAILURE);
		}
		logger.ctinfo("CTREP00005");

		/**
		 * Send the reportResponse to RequestHandler.
		 */
		return reportResponse;
	}

	/**
	 * This method will choose the appropriate ReportProcessor according to the reportRequest and execute the report.
	 * 
	 * @param reportRequest have the input data which is given by the user to run the Report.
	 * @return ReportResponse - which have the report run status, report Instance Id, etc...
	 */
	public ReportResponse runReport(ReportRequest reportRequest)
	{
		logger.ctinfo("CTREP00006");

		/**
		 * Check the Report entitlement for the user. If user have the entitlement continue the RunReport process.
		 * Otherwise throw the Entitlement Exception.
		 */
		ReportResponse reportResponse = null;
		if (ReportUtil.isEntitled(reportRequest))
		{
			IReportProcessor reportProcessor = getProcessor(reportRequest.getCommunicationType());

			try
			{
				/**
				 * Call the runReport() of ReportProcessor.
				 */
				reportResponse = reportProcessor.runReport(reportRequest);

			} catch (ReportingException reportExp)
			{
				logger.cterror("CTREP00007", reportExp.getCause());
				reportResponse = ReportUtil.createErrorResponse(reportRequest, reportExp.getErrorCode(),
						reportExp.getErrorMessage());
			} catch (Exception exp)
			{
				logger.cterror("CTREP00008 ", exp.getCause());
				reportResponse = ReportUtil.createErrorResponse(reportRequest, null, exp.getMessage());
			}
		} else
		{
			logger.cterror("CTREP00009");
			reportResponse = ReportUtil.createErrorResponse(reportRequest,
					EntitlementEngineConstants.ERR_CD_RPT_ENTL_FAILURE);
		}
		logger.ctinfo("CTREP00010");
		/**
		 * Send the reportResponse to RequestHandler.
		 */
		return reportResponse;

	}

	/**
	 * This method will choose the appropriate ReportProcessor according to the reportRequest and save and execute the
	 * report immediately.
	 * 
	 * @param reportRequest have the input data which is given by the user to save and run the Report.
	 * @return ReportResponse - which have the report saved and run status, reportId and report Instance Id, etc...
	 */
	public ReportResponse saveAndRunReport(ReportRequest reportRequest)
	{

		logger.ctinfo("CTREP00011");

		/**
		 * Check the Report entitlement for the user. If user have the entitlement continue the saveAndRunReport
		 * process. Otherwise throw the Entitlement Exception.
		 */
		ReportResponse reportResponse = null;
		if (ReportUtil.isEntitled(reportRequest))
		{
			IReportProcessor reportProcessor = getProcessor(reportRequest.getCommunicationType());

			try
			{
				/**
				 * Call the saveAndRunReport() of ReportProcessor.
				 */
				reportResponse = reportProcessor.saveAndRunReport(reportRequest);

			} catch (ReportingException reportExp)
			{
				logger.cterror("CTREP00012", reportExp.getCause());
				reportResponse = ReportUtil.createErrorResponse(reportRequest, reportExp.getErrorCode(),
						reportExp.getErrorMessage());
			} catch (Exception exp)
			{
				logger.cterror("CTREP00013", exp.getCause());
				reportResponse = ReportUtil.createErrorResponse(reportRequest, null, exp.getMessage());
			}

		} else
		{
			logger.cterror("CTREP00014");
			reportResponse = ReportUtil.createErrorResponse(reportRequest,
					EntitlementEngineConstants.ERR_CD_RPT_ENTL_FAILURE);
		}
		logger.ctinfo("CTREP00015");
		/**
		 * Send the reportResponse to RequestHandler.
		 */
		return reportResponse;
	}

	/**
	 * This method will check the entitlement of the user reportRequest. If the user reportRequest hasEntitlement as
	 * TRUE then it choose the appropriate ReportProcessor according to the reportRequest and executes the
	 * ReportRequest.
	 * 
	 * @param reportRequest is a ReportRequest Object. That needs to have the necessary information to run the Generated
	 *            ReportInstance.
	 * @return ReportResponse Object that have the ReportInstanceDefinition object as response value.
	 */
	public ReportResponse runReportInstance(ReportRequest reportRequest)
	{
		logger.ctinfo("CTREP00016");

		/**
		 * Check the Report entitlement for the user. If user have the entitlement continue the runReportInstance
		 * process. Otherwise throw the Entitlement Exception.
		 */
		ReportResponse reportResponse = null;
		if (ReportUtil.isEntitled(reportRequest))
		{
			IReportProcessor reportProcessor = getProcessor(reportRequest.getCommunicationType());
			try
			{
				reportResponse = reportProcessor.runReportInstance(reportRequest);

			} catch (ReportingException reportExp)
			{
				logger.cterror("CTREP00017", reportExp.getCause());
				reportResponse = ReportUtil.createErrorResponse(reportRequest, reportExp.getErrorCode(),
						reportExp.getErrorMessage());
			} catch (Exception exp)
			{
				logger.cterror("CTREP00018", exp.getCause());
				reportResponse = ReportUtil.createErrorResponse(reportRequest, null, exp.getMessage());
			}
		} else
		{
			logger.cterror("CTREP00019");
			reportResponse = ReportUtil.createErrorResponse(reportRequest,
					EntitlementEngineConstants.ERR_CD_RPT_ENTL_FAILURE);
		}
		logger.ctinfo("CTREP00020");
		/**
		 * Send the reportResponse to RequestHandler.
		 */
		return reportResponse;
	}

	/**
	 * This method will choose the appropriate ReportProcessor according to the reportRequest and save and schedules the
	 * report .
	 * 
	 * @param reportRequest is a ReportRequest Object that needs to have the necessary information to Save and schedule
	 *            the Report Definition.
	 * @return ReportResponse - which contain the Schedule status, reportId and etc...
	 */
	public ReportResponse saveAndScheduleReport(ReportRequest reportRequest)
	{

		logger.ctinfo("CTREP00021");

		/**
		 * Check the Report entitlement for the user. If user have the entitlement continue the saveAndScheduleReport
		 * process. Otherwise throw the Entitlement Exception.
		 */
		ReportResponse reportResponse = null;
		if (ReportUtil.isEntitled(reportRequest))
		{
			IReportProcessor reportProcessor = getProcessor(reportRequest.getCommunicationType());

			try
			{
				/**
				 * Call the saveAndScheduleReport() of AsycReportProcessor to schedule the Report.
				 */
				reportResponse = reportProcessor.saveAndScheduleReport(reportRequest);

			} catch (ReportingException reportExp)
			{
				logger.cterror("CTREP00022", reportExp.getCause());
				reportResponse = ReportUtil.createErrorResponse(reportRequest, reportExp.getErrorCode(),
						reportExp.getErrorMessage());
			} catch (Exception exp)
			{
				logger.cterror("CTREP00023", exp.getCause());
				reportResponse = ReportUtil.createErrorResponse(reportRequest,
						ReportConstants.ERR_CD_RPT_DEFI_SAVE_SCHEDULE);
			}
		} else
		{
			logger.cterror("CTREP00024");
			reportResponse = ReportUtil.createErrorResponse(reportRequest,
					EntitlementEngineConstants.ERR_CD_RPT_ENTL_FAILURE);
		}
		logger.ctinfo("CTREP00025");
		/**
		 * Send the reportResponse to RequestHandler.
		 */
		return reportResponse;

	}

	/**
	 * This method gets the processor and then delete the report and delete from the scheduler if already scheduled.
	 * 
	 * @param reportRequest which have the details of ReportId and processer communication Type and whether the report
	 *            is scheduled or not.
	 * @return ReportResponse - which have the report delete status and reportId
	 */
	public ReportResponse deleteReport(ReportRequest reportRequest)
	{
		logger.ctinfo("CTREP00026");

		/**
		 * Check the Report entitlement for the user. If user have the entitlement continue the deleteReport process.
		 * Otherwise throw the Entitlement Exception.
		 */
		ReportResponse reportResponse = null;
		if (ReportUtil.isEntitled(reportRequest))
		{
			IReportProcessor reportProcessor = getProcessor(reportRequest.getCommunicationType());

			try
			{
				/**
				 * Call the deleteReport() of ReportProcessor to delete the Report.
				 */
				reportResponse = reportProcessor.deleteReport(reportRequest);

			} catch (ReportingException reportExp)
			{
				logger.cterror("CTREP00027", reportExp.getCause());
				reportResponse = ReportUtil.createErrorResponse(reportRequest, reportExp.getErrorCode());
			} catch (Exception exp)
			{
				logger.cterror("CTREP00027 ", exp.getCause());
				reportResponse = ReportUtil.createErrorResponse(reportRequest,
						ReportConstants.ERR_CD_RPT_DEFINITION_DEL);
			}
		} else
		{
			logger.cterror("CTREP00028");
			reportResponse = ReportUtil.createErrorResponse(reportRequest,
					EntitlementEngineConstants.ERR_CD_RPT_ENTL_FAILURE);
		}
		logger.ctinfo("CTREP00029");
		/**
		 * Send the reportResponse to RequestHandler.
		 */
		return reportResponse;
	}

	/**
	 * This method will return the report object. This method will be used for editing the report definitions.
	 * 
	 * @param reportRequest contains the ReportId to get the appiropiriate Report Defintion from Database.
	 * @return ReportResponse which contains the Report Defintion object.
	 */
	public ReportResponse getReportDefinition(ReportRequest reportRequest) throws ReportingException
	{
		logger.ctinfo("CTREP00030");
		ReportResponse reportResponse = new ReportResponse();

		/**
		 * Check the Report entitlement for the user. If user have the entitlement, continue the process. Otherwise
		 * throw the Entitlement Exception.
		 */
		if (ReportUtil.isEntitled(reportRequest) && ReportUtil.isNotEmpty(reportRequest.getReportId()))
		{
			String reportId = reportRequest.getReportId();
			/**
			 * call the reportingInstruction.getReportDefinition(reportId) method to get the ReportDefinition.
			 */
			ReportDefinition reportDefinition = null;
			try
			{
				ReportInstruction reportingInstruction = new ReportInstruction();
				reportDefinition = reportingInstruction.getReportDefinition(reportId);

				/**
				 * Construct ReportResponse object with reportId and it's Report Defintion object.
				 */
				if (reportDefinition != null)
				{

					Map responseObjectMap = new HashMap();
					responseObjectMap.put(ReportConstants.REPORT_DEFINITION, reportDefinition);
					reportResponse.setResponseObject(responseObjectMap);

					reportResponse.setReportId(reportId);
					reportResponse.setStatus(ReportConstants.STATUS_SUCCESS);
				} else
				{
					reportResponse = ReportUtil.createErrorResponse(reportRequest,
							ReportConstants.ERR_CD_RPT_DEFINITION_NULL);
				}

			} catch (ReportingException reportExp)
			{
				logger.cterror("CTREP00031", reportExp.getCause());
				reportResponse = ReportUtil.createErrorResponse(reportRequest, reportExp.getErrorCode());
			} catch (Exception exp)
			{
				logger.cterror("CTREP00031", exp.getCause());
				reportResponse = ReportUtil.createErrorResponse(reportRequest, ReportConstants.ERR_CD_GET_RPT_DEF);
			}

		} else
		{
			/**
			 * create Entitlement error response object.
			 */
			logger.cterror("CTREP00032");
			reportResponse = ReportUtil.createErrorResponse(reportRequest,
					EntitlementEngineConstants.ERR_CD_RPT_ENTL_FAILURE);
		}
		logger.ctinfo("CTREP00033");
		/**
		 * Send the reportResponse to RequestHandler.
		 */
		return reportResponse;

	}

	/**
	 * This method returns the appropriage ReportProcessor according to the communication type.
	 * 
	 * @param communicationType - The valid valus are ReportRequest.ASYNC/ReportRequest.SYNC
	 * @return IReportProcessor - if the value is ReportRequest.ASYNC then AsyncReportProcessor will be returned.if the
	 *         value is ReportRequest.SYNC then SyncReportProcessor will be returned.
	 */
	private IReportProcessor getProcessor(int communicationType)
	{
		logger.ctinfo("CTREP00034");
		IReportProcessor reportProcessor = null;

		if (communicationType == ReportRequest.ASYNC)
		{
			reportProcessor = new AsyncReportProcessor();
		} else
		{
			reportProcessor = new SyncReportProcessor();
		}
		logger.ctinfo("CTREP00035");
		return reportProcessor;
	}

	// instantiating logger object
	private static Logger logger = Logger.getLogger(ReportManager.class);
}
