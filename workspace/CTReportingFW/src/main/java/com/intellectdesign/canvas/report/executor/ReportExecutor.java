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

package com.intellectdesign.canvas.report.executor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Callable;

import com.intellectdesign.canvas.alert.handler.AlertConstants;
import com.intellectdesign.canvas.common.UserValue;
import com.intellectdesign.canvas.entitlement.EntitlementEngineConstants;
import com.intellectdesign.canvas.entitlement.EntitlementsHelper;
import com.intellectdesign.canvas.event.Event;
import com.intellectdesign.canvas.event.EventDispatcher;
import com.intellectdesign.canvas.event.EventHandlerFrameworkConstants;
import com.intellectdesign.canvas.event.handler.HandlerException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.report.dataaggregator.IReportDataAggregator;
import com.intellectdesign.canvas.report.engine.IReportEngineAdaptor;
import com.intellectdesign.canvas.report.exception.ReportingException;
import com.intellectdesign.canvas.report.instr.ReportInstruction;
import com.intellectdesign.canvas.report.monitor.QuotaMonitor;
import com.intellectdesign.canvas.report.publisher.IReportPublisher;
import com.intellectdesign.canvas.report.statusmonitor.ReportStatusMonitor;
import com.intellectdesign.canvas.report.util.ReportConstants;
import com.intellectdesign.canvas.report.util.ReportStatus;
import com.intellectdesign.canvas.report.util.ReportUtil;
import com.intellectdesign.canvas.report.vo.ReportContext;
import com.intellectdesign.canvas.report.vo.ReportInstanceDefinition;
import com.intellectdesign.canvas.report.vo.ReportPublisher;
import com.intellectdesign.canvas.report.vo.ReportRequest;
import com.intellectdesign.canvas.report.vo.ReportResponse;

/**
 * ReportExecutor executes the report and returns the report response object. It does the following, necessary
 * validations, quota availability validation, data collection from data aggregator, get the report from reporting
 * engine, publish the generated report and send the notication to the entitled users.
 * 
 * 
 * @version 1.0
 */

public class ReportExecutor
{
	/**
	 * This api is used to generate the report.
	 * 
	 * @param reportResponse
	 * @return ReportResponse
	 * @throws ReportingException
	 */
	public ReportResponse generateReport(final ReportRequest reportRequest) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00129");

		/**
		 * Step 1: Validating the report request.
		 * */
		if (reportRequest == null)
		{
			/**
			 * Step 1.1: Throwing the exception since the report request is null.
			 * */
			LOGGER.cterror("CTREP00130");
			throw new ReportingException(ReportConstants.ERR_CD_EMPTY_REPORT_REQUEST);

		}
		/**
		 * Step 2: Validating the report instance id.
		 * */
		String reportInstanceId = reportRequest.getReportInstanceId();

		if (reportInstanceId == null)
		{
			/**
			 * Step 2.1: Throwing the exception since the report instance id is not available in the report request.
			 * */
			LOGGER.cterror("CTREP00131");
			throw new ReportingException(ReportConstants.ERR_CD_EMPTY_REPORT_INSTANCE_ID);
		}
		/**
		 * Step 3: Fetching the report instance definition for the report instance id.
		 * */
		ReportInstruction reportInstruction = new ReportInstruction();
		ReportInstanceDefinition reportInstanceDefinition = reportInstruction
				.getReportInstanceDefinition(reportInstanceId);
		/**
		 * Step 4: Validating the report instance definition.
		 * */
		if (reportInstanceDefinition == null)
		{
			/**
			 * Step 4.1: Throwing the exception since the report instance is not available.
			 * */
			LOGGER.cterror("CTREP00132", reportInstanceId);
			throw new ReportingException(ReportConstants.ERR_CD_EMPTY_REPORT_INSTANCE);
		}
		ReportResponse reportResponse = null;
		ReportUtil reportUtil = new ReportUtil();
		try
		{

			/**
			 * Step 5: Loading the report id from the report instance.
			 * */
			String reportId = reportInstanceDefinition.getReportId();
			reportRequest.setReportId(reportId);

			/**
			 * Step 6: Fetching the reportContext for the reportInstanceId
			 * */
			ReportContext reportContext = getReportContext(reportInstanceId);

			/**
			 * Step 7: Setting the report instance in report context.
			 * */
			reportContext.setReportInstanceDefinition(reportInstanceDefinition);

			/**
			 * Step 8: Setting the user preferences in report context.
			 * */
	/*		PreferenceManager preferenceManager = new PreferenceManager();
			reportContext.setAttribute(ReportConstants.USER_PREFERENCE,
					preferenceManager.getAllSystemPreferenceDefinitions());*/
			UserValue userVal= new UserValue();
			userVal.setUserNo(reportInstanceDefinition.getUserNo());
			userVal.setPrimaryGcif(reportInstanceDefinition.getGcif());
			EntitlementsHelper entlhlper= new EntitlementsHelper();
			userVal=(UserValue)entlhlper.getUserPreferences(userVal);
					
			reportContext.setAttribute(ReportConstants.USER_PREFERENCE,getUserPreferenceData(userVal));
			

			/**
			 * Step 9: Setting the report context in report request.
			 * */
			reportRequest.setReportContext(reportContext);

			/**
			 * Step 10: Setting the necessary details from report context to report request.
			 * */
			reportRequest.setProductCode(reportContext.getProductCode());
			reportRequest.setSubProductCode(reportContext.getSubProductCode());
			reportRequest.setFuncCode(reportContext.getFuncCode());
			reportRequest.setFuncCode(reportContext.getFuncCode());
			reportRequest.setSystemReportId(reportContext.getSystemReportId());

			/**
			 * Step 11: Setting the necessary details from report instance to report request.
			 * */
			reportRequest.setUserNo(reportInstanceDefinition.getUserNo());
			reportRequest.setGcif(reportInstanceDefinition.getGcif());
			reportRequest.setFormatId(reportInstanceDefinition.getFormatId());
			reportRequest.setReportId(reportInstanceDefinition.getReportId());
			reportRequest.setReportName(reportInstanceDefinition.getReportName());
			reportRequest.setBundleKey(reportContext.getBundleKey());

			/**
			 * Step 12: Checking the entitlement for the user.
			 * */

			if (ReportUtil.isEntitled(reportRequest))
			{
				LOGGER.ctdebug("CTREP00167");
				/**
				 * Step 13: Checking the quota availability before generating the report.
				 * */
				if (isQuotaAvailable(reportRequest))
				{
					LOGGER.ctdebug("CTREP00168");
					/**
					 * Step 14: Updating the report instance status as ReportStatus.IN_PROGRESS.
					 * */
					reportUtil.updateReportInstanceStatus(reportInstanceId, ReportStatus.IN_PROGRESS);

					/**
					 * Step 15: Fetching the data list from the data aggregator for report.
					 * */
					List dataItems = getDataItems(reportContext, reportRequest);

					/**
					 * Step 16: Generating the report.
					 * */
					reportResponse = generateReports(reportContext, reportRequest, dataItems);

					/**
					 * Step 17: Checking the quota availability before publishing the report.
					 * */
					if (isQuotaAvailable(reportRequest))
					{
						LOGGER.ctdebug("CTREP00169");
						/**
						 * Step 18: Publish the reports.
						 * */
						publishReports(reportContext, reportResponse);

						/**
						 * Step 19: To Send notification.
						 * */
						sendNotification(reportContext, reportResponse);

					} else
					{
						LOGGER.ctdebug("CTREP00133");
						/**
						 * Step 20: Updating the report instance status as ReportStatus.QUOTA_AVAILABILITY_FAILURE.
						 * */
						reportUtil.updateReportInstanceStatus(reportInstanceId,
								ReportStatus.QUOTA_AVAILABILITY_FAILURE,
								ReportConstants.ERR_CD_QUOTA_FAILURE_BEFORE_GENERATION,
								ReportUtil.getMessage(ReportConstants.ERR_CD_QUOTA_FAILURE_BEFORE_GENERATION));

						/**
						 * Step 21:Throwing the exception since no quoata availability.
						 * */
						throw new ReportingException(ReportConstants.ERR_CD_NO_QUOTA_AVAILABILITY,
								ReportConstants.DEFAULT_LANG_ID);

					}
				} else
				{
					LOGGER.ctdebug("CTREP00134");
					/**
					 * Step 22: Updating the report instance status as ReportStatus.QUOTA_AVAILABILITY_FAILURE.
					 * */
					reportUtil.updateReportInstanceStatus(reportInstanceId, ReportStatus.QUOTA_AVAILABILITY_FAILURE,
							ReportConstants.ERR_CD_QUOTA_FAILURE_BEFORE_PUBLISH,
							ReportUtil.getMessage(ReportConstants.ERR_CD_QUOTA_FAILURE_BEFORE_PUBLISH));
					/**
					 * Step 23: Throwing the exception since quota availability failure.
					 * */
					throw new ReportingException(ReportConstants.ERR_CD_NO_QUOTA_AVAILABILITY,
							ReportConstants.DEFAULT_LANG_ID);
				}

			} else
			{
				LOGGER.ctdebug("CTREP00135");
				/**
				 * Step 24: Updating the report instance status as ReportStatus.REPORT_ENTL_FAILURE.
				 * */
				reportUtil
						.updateReportInstanceStatus(reportInstanceId, ReportStatus.ENTL_FAILURE,
								ReportConstants.ERR_CD_ENTL_FAILURE,
								ReportUtil.getMessage(ReportConstants.ERR_CD_ENTL_FAILURE));
				/**
				 * Step 25: Throwing the exception since entitlement failure.
				 * */
				throw new ReportingException(EntitlementEngineConstants.ERR_CD_RPT_ENTL_FAILURE,
						EntitlementEngineConstants.ERR_MSG_RPT_ENTL_FAILURE);
			}

		} catch (ReportingException e)
		{
			LOGGER.cterror("CTREP00136", e);

			/**
			 * Step 26: Creating the error response with status as ReportStatus.FAILED.
			 * */
			reportResponse = ReportUtil.createErrorResponse(reportRequest, e.getErrorCode(), e.getErrorMessage());
			// throw e;
		} catch (Exception exp)
		{
			LOGGER.cterror("CTREP00137", exp);
			/**
			 * Step 27: Updating the report instance status as ReportStatus.FAILED.
			 * */
			reportUtil.updateReportInstanceStatus(reportInstanceId, ReportStatus.FAILED,
					ReportConstants.ERR_CD_GENERAL_FAILURE,
					ReportUtil.getMessage(ReportConstants.ERR_CD_GENERAL_FAILURE));

			/**
			 * Step 28: Creating the error response with status as ReportStatus.FAILED.
			 * */
			reportResponse = ReportUtil.createErrorResponse(reportRequest, ReportConstants.ERR_CD_GENERAL_FAILURE);
			/**
			 * The exception need not be thrown since it has been handled and updated the reportReponse as failure
			 * status.
			 * */
			// throw e;
		}

		/**
		 * Step 29: Returning the report reponse.
		 * */
		LOGGER.ctinfo("CTREP00138");
		return reportResponse;

	}

	/**
	 * Fetching the reportContext for the reportInstanceId.
	 * 
	 * @param reportInstanceId
	 * @return reportContext
	 * @throws ReportingException
	 */
	private ReportContext getReportContext(String reportInstanceId) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00139");
		ReportContext reportContext = null;
		try
		{
			/**
			 * Step 1: Loading the report context details from db.
			 * */
			ReportInstruction reportInstruction = new ReportInstruction();
			reportContext = reportInstruction.getContextDetails(reportInstanceId);

			if (reportContext == null)
			{
				/**
				 * Step 2: Throwing the exception since the report context is not available.
				 * */
				LOGGER.cterror("CTREP00140", reportInstanceId);

				throw new ReportingException(ReportConstants.ERR_CD_CONTEXT_IS_NULL);

			}
		} catch (ReportingException e)
		{
			/**
			 * Step 3: Throwing the exception since the report context is not available.
			 * */
			LOGGER.cterror("CTREP00141 ", reportInstanceId);
			ReportUtil reportUtil = new ReportUtil();
			reportUtil.updateReportInstanceStatus(reportInstanceId, ReportStatus.FAILED, e.getErrorCode(),
					ReportUtil.getMessage(e.getErrorCode()));
			throw e;
		}
		LOGGER.ctinfo("CTREP00142");
		return reportContext;
	}

	/**
	 * This method is used the fetching the data items for the report generation from the data aggregator.
	 * 
	 * @param reportContext
	 * @param reportRequest
	 * @return List of data items
	 * @throws ReportingException
	 */
	private List getDataItems(final ReportContext reportContext, final ReportRequest reportRequest)
			throws ReportingException
	{
		LOGGER.ctinfo("CTREP00143");
		List dataItems = null;
		ReportUtil reportUtil = new ReportUtil();
		String reportInstanceId = reportRequest.getReportInstanceId();
		try
		{
			/**
			 * Step 1: Get the instance for report data aggregator using ReportDataAggregatorFactory.
			 * */
			final IReportDataAggregator reportDataAggregator = reportContext.getReportDataAggregator();

			/**
			 * Step 2: Declaring the Callable object to fetch the data from data aggregator.
			 * 
			 * */
			Callable callable = new Callable()
			{
				public Object call() throws Exception
				{
					return reportDataAggregator.getData(reportRequest);
				}
			};

			ReportStatusMonitor monitor = new ReportStatusMonitor();
			/**
			 * Step 3: Executing to status monitor task to fetch data.
			 * */
			dataItems = (List) monitor.executeTask(callable);
			LOGGER.ctdebug("CTREP00144", dataItems);
			if (dataItems == null)
			{
				LOGGER.cterror("CTREP00145");
				throw new ReportingException(ReportConstants.ERR_CD_TIMEOUT_DATA_SRC);
			}

		} catch (ReportingException e)
		{
			LOGGER.cterror("CTREP00146", e);
			/**
			 * Step 4: Updating the report instance status as ReportStatus.FAILED.
			 * */
			reportUtil.updateReportInstanceStatus(reportInstanceId, ReportStatus.FAILED,
					ReportConstants.ERR_CD_FETCH_DATA, ReportUtil.getMessage(ReportConstants.ERR_CD_FETCH_DATA));

			/**
			 * Step 5: Rethrowing the exception.
			 * */
			throw e;
		}
		LOGGER.ctinfo("CTREP00147");
		return dataItems;
	}

	/**
	 * This method is used to generate the report.
	 * 
	 * @param reportContext
	 * @param reportRequest
	 * @param dataItems
	 * @return ReportResponse
	 * @throws ReportingException
	 */
	private ReportResponse generateReports(final ReportContext reportContext, final ReportRequest reportRequest,
			final List dataItems) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00148");
		ReportResponse reportResponse = null;
		ReportUtil reportUtil = new ReportUtil();
		String reportInstanceId = reportRequest.getReportInstanceId();
		try
		{
			/**
			 * Step 1: Get the instance for report engine using ReportEngineAdaptorFactory.
			 * */
			final IReportEngineAdaptor reportEngineAdaptor = reportContext.getReportEngineAdaptor();

			/**
			 * Step 2: Declaring the callable object to generate the report.
			 * */
			final List data = dataItems;
			Callable callObj = new Callable()
			{
				public Object call() throws Exception
				{
					return reportEngineAdaptor.generateReport(reportRequest, data);
				}
			};

			ReportStatusMonitor monitor = new ReportStatusMonitor();
			/**
			 * Step 3: Executing the Status monitor task ie, generateReport()
			 * */
			reportResponse = (ReportResponse) monitor.executeTask(callObj);
			LOGGER.ctdebug("CTREP00149", reportResponse);

			if (reportResponse == null)
			{
				LOGGER.cterror("CTREP00150");
				throw new ReportingException(ReportConstants.ERR_CD_TIMEOUT_GENERATE_RPT);
			}

		} catch (ReportingException e)
		{
			LOGGER.cterror("CTREP00151", e);
			/**
			 * Step 4: Updating the report instance status as ReportStatus.FAILED.
			 * */
			reportUtil.updateReportInstanceStatus(reportInstanceId, ReportStatus.FAILED,
					ReportConstants.ERR_CD_RPT_GEN_FAILURE,
					ReportUtil.getMessage(ReportConstants.ERR_CD_RPT_GEN_FAILURE));
			/**
			 * Step 5: Rethrowing the exception.
			 * */
			throw e;
		}
		LOGGER.ctdebug("CTREP00152", reportResponse.toJSONString());
		/**
		 * Step 6: Updating the report instance status as ReportStatus.GENERATED.
		 * */
		reportUtil.updateReportInstanceStatus(reportInstanceId, ReportStatus.GENERATED);
		LOGGER.ctinfo("CTREP00153");
		return reportResponse;
	}

	/**
	 * This method is used to publish the report response using the report publishers which all are configured against
	 * the report instance.
	 * 
	 * @param reportContext
	 * @param reportResponse
	 * @throws ReportingException
	 */
	private void publishReports(ReportContext reportContext, ReportResponse reportResponse) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00154");
		/**
		 * Step 1: Fetching the publishers list.
		 * */
		List<ReportPublisher> reportPublishers = reportContext.getReportPublishers();
		List<String> failedPublishers = new ArrayList();
		String reportInstanceId = reportResponse.getReportInstanceId();
		if (reportPublishers != null)
		{
			/**
			 * Step 2: Iterating the publishers list to publish the report using each publisher.
			 * */
			for (ReportPublisher publisher : reportPublishers)
			{
				try
				{
					/**
					 * Step 3: Get the instance for report publisher using the ReportPublisherFactory.
					 * */
					IReportPublisher reportPublisher = publisher.getReportPublisher();

					/**
					 * Step 4: Publishing the report.
					 * */
					if (reportPublisher != null)
					{
						reportPublisher.publish(reportResponse);
					}
				} catch (ReportingException e)
				{
					LOGGER.ctdebug("CTREP00155 ", publisher.getPublisherName());
					/**
					 * Step 5: Add the current publisher to the failed publishers list.
					 * */
					failedPublishers.add(publisher.getPublisherName());
				}
			}

			ReportUtil reportUtil = new ReportUtil();
			if (!failedPublishers.isEmpty())
			{
				/**
				 * Step 6: Updating the report instance status as ReportStatus.PUBLISHER_FAILED since any one publisher
				 * is getting failed.
				 * */
				StringBuffer failedPublishersStr = new StringBuffer();
				for (String publisherName : failedPublishers)
				{
					failedPublishersStr.append("<<<");
					failedPublishersStr.append(publisherName);
					failedPublishersStr.append(">>>");
				}
				LOGGER.ctdebug("CTREP00156", failedPublishersStr);
				reportUtil.updateReportInstanceStatus(reportInstanceId, ReportStatus.PUBLISHER_FAILED,
						ReportConstants.ERR_CD_RPT_PUBLISHER_FAILED,
						ReportUtil.getMessage(ReportConstants.ERR_CD_RPT_PUBLISHER_FAILED));
				if (reportResponse.getResponseObject() == null)
				{
					reportResponse.setResponseObject(new HashMap());
				}
				reportResponse.getResponseObject()
						.put(ReportConstants.PUBLISHER_STATUS, ReportConstants.STATUS_FAILURE);
				reportResponse.getResponseObject().put(ReportConstants.FAILED_PUBLISHERS, failedPublishers);

			} else
			{
				/**
				 * Step 7: Updating the report instance status as ReportStatus.PUBLISHED.
				 * */
				reportUtil.updateReportInstanceStatus(reportInstanceId, ReportStatus.PUBLISHED);
				reportResponse.getResponseObject()
						.put(ReportConstants.PUBLISHER_STATUS, ReportConstants.STATUS_SUCCESS);
			}

		} else
		{
			LOGGER.ctdebug("CTREP00157", reportResponse.getReportInstanceId());
		}
		LOGGER.ctinfo("CTREP00158");
	}

	/**
	 * This method is used to send the notification about the report response using the report notification listeners
	 * which all are configured against the report instance. Event Handler Module is used for sending notifications.
	 * 
	 * @param reportContext
	 * @param reportResponse
	 * @throws ReportingException
	 */
	private void sendNotification(ReportContext reportContext, ReportResponse reportResponse) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00159");
		/**
		 * Step 1: Fetching the necessary data from report context.
		 * */
		/*String productCode = ReportConstants.PRODUCT_CODE;
		String subProductCode = ReportConstants.SUB_PRODUCT_CODE;
		String funcCode = ReportConstants.FUNCTION_CODE;*/
		String productCode = reportContext.getProductCode();
		String subProductCode = reportContext.getSubProductCode();
		String funcCode = reportContext.getFuncCode();
		try
		{
			/**
			 * Step 2: Fetching the event.
			 * */
			Event event = Event.getEventFor(productCode, subProductCode, funcCode,
					ReportConstants.REPORT_EXECUTION_ACTION);

			/**
			 * Step 3: Fetching the report instance definition.
			 * */
			ReportInstanceDefinition reportInstanceDefinition = reportContext.getReportInstanceDefinition();
			if (reportInstanceDefinition != null)
			{

				/**
				 * Step 4: Construction the data map.
				 * */
				HashMap dataMap = new HashMap();
				dataMap.put(EventHandlerFrameworkConstants.FLD_USER_NO, reportInstanceDefinition.getUserNo());
				dataMap.put(EventHandlerFrameworkConstants.FLD_GCIF, reportInstanceDefinition.getGcif());
				dataMap.put(EventHandlerFrameworkConstants.FLD_PROD_CODE, reportContext.getProductCode());
				dataMap.put(EventHandlerFrameworkConstants.FLD_SUB_PROD_CODE, reportContext.getSubProductCode());
				dataMap.put(EventHandlerFrameworkConstants.FLD_FUNC_CODE, reportContext.getFuncCode());
				dataMap.put(EventHandlerFrameworkConstants.EVENT_ID, event.getEventId());
				dataMap.put(ReportConstants.REPORT_ID, reportInstanceDefinition.getReportId());
				dataMap.put(ReportConstants.REPORT_INSTANCE_ID, reportInstanceDefinition.getReportInstanceId());
				dataMap.put(ReportConstants.REPORT_NAME, reportInstanceDefinition.getReportName());
				dataMap.put(ReportConstants.STATUS, reportResponse.getStatus());
				dataMap.put(ReportConstants.ERROR_CODE, reportResponse.getErrorCode());
				dataMap.put(ReportConstants.ERROR_MESSAGE, reportResponse.getErrorMsg());

				Map alertDataMap = new HashMap();
				alertDataMap.put(ReportConstants.REPORT_ID, reportInstanceDefinition.getReportId());
				alertDataMap.put(ReportConstants.REPORT_INSTANCE_ID, reportInstanceDefinition.getReportInstanceId());
				alertDataMap.put(ReportConstants.REPORT_NAME, reportInstanceDefinition.getReportName());
				dataMap.put(AlertConstants.ALERT_DATA_MAP, alertDataMap);
				/**
				 * Step 5: Setting the notifiers list
				 * */
				dataMap.put(ReportConstants.NOTIFICATION_LIST, reportContext.getNotifierList());

				/**
				 * Step 6: Raising the event with dataMap.
				 * */
				EventDispatcher eventDispatcher = EventDispatcher.getInstance();
				eventDispatcher.raiseEvent(event, dataMap);
				/**
				 * Step 7: Updating the report instance status as ReportStatus.NOTIFIED.
				 * */
				ReportUtil reportUtil = new ReportUtil();
				reportUtil.updateReportInstanceStatus(reportInstanceDefinition.getReportInstanceId(),
						ReportStatus.NOTIFIED);
				reportResponse.getResponseObject().put(ReportConstants.NOTIFIER_STATUS, ReportConstants.STATUS_SUCCESS);
			}

		} catch (HandlerException e)
		{
			LOGGER.cterror("CTREP00160", e);

			/**
			 * Step 8: Updating the report instance status as ReportStatus.NOTIFICATION_FAILED.
			 * */
			ReportUtil reportUtil = new ReportUtil();
			LOGGER.ctdebug("CTREP00161");
			reportUtil.updateReportInstanceStatus(reportResponse.getReportInstanceId(),
					ReportStatus.NOTIFICATION_FAILED, ReportConstants.ERR_CD_RPT_NOTIFICATION_FAILED,
					ReportUtil.getMessage(ReportConstants.ERR_CD_RPT_NOTIFICATION_FAILED));
			reportResponse.getResponseObject().put(ReportConstants.NOTIFIER_STATUS, ReportConstants.STATUS_FAILURE);
			LOGGER.ctinfo("CTREP00162");
			throw new ReportingException(ReportConstants.ERR_CD_RPT_NOTIFICATION_FAILED, e);
		}

		LOGGER.ctinfo("CTREP00163");
	}

	/**
	 * This method call the quotaMonitor and get the the quota availabilty for the reportRequest.
	 * 
	 * @param reportRequest
	 * @return boolean quotaAvailability
	 * @throws ReportingException
	 */
	private boolean isQuotaAvailable(ReportRequest reportRequest) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00164");
		QuotaMonitor quotaMonitor = new QuotaMonitor();
		boolean quotaAvailability = false;
		try
		{
			quotaAvailability = quotaMonitor.isQuotaAvailable(reportRequest);
		} catch (ReportingException e)
		{
			LOGGER.cterror("CTREP00165");
			/**
			 * Updating the report instance status as ReportStatus.FAILED.
			 * */
			ReportUtil reportUtil = new ReportUtil();
			reportUtil.updateReportInstanceStatus(reportRequest.getReportInstanceId(), ReportStatus.FAILED,
					ReportConstants.ERR_CD_COULD_NOT_PERFORM_QUOTA,
					ReportUtil.getMessage(ReportConstants.ERR_CD_COULD_NOT_PERFORM_QUOTA));
			throw e;
		}
		LOGGER.ctinfo("CTREP00166");
		return quotaAvailability;
	}
	
	private HashMap getUserPreferenceData(UserValue userVal){
		HashMap usrprefMap= new HashMap();
		usrprefMap.put("DATEFORMAT", userVal.getDateId());
		usrprefMap.put("TIMEFORMAT", userVal.getTimeFormat());
		usrprefMap.put("TIMEZONE", userVal.getTimeZoneId());
		usrprefMap.put("AMOUNT", userVal.getAmountId());
		usrprefMap.put("LANGUAGE", userVal.getLangId());
			
		return usrprefMap;
	}

	private static Logger LOGGER = Logger.getLogger(ReportExecutor.class);
}
