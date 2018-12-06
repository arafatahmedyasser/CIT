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
package com.intellectdesign.canvas.report.handler;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;

import com.intellectdesign.canvas.audit.handler.AuditConstants;
import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.common.ReplyObject;
import com.intellectdesign.canvas.constants.common.FrameworkConstants;
import com.intellectdesign.canvas.event.Event;
import com.intellectdesign.canvas.event.EventDispatcher;
import com.intellectdesign.canvas.event.EventHandlerFrameworkConstants;
import com.intellectdesign.canvas.event.handler.HandlerException;
import com.intellectdesign.canvas.exceptions.common.OnlineException;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.handler.SimpleRequestHandler;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.logging.PerformanceTimer;
import com.intellectdesign.canvas.properties.MessageManager;
import com.intellectdesign.canvas.properties.reader.ReportingProperties;
import com.intellectdesign.canvas.report.ReportManager;
import com.intellectdesign.canvas.report.exception.ReportingException;
import com.intellectdesign.canvas.report.instr.ReportInstruction;
import com.intellectdesign.canvas.report.util.ReportConstants;
import com.intellectdesign.canvas.report.util.ReportUtil;
import com.intellectdesign.canvas.report.vo.ReportColumnDefinition;
import com.intellectdesign.canvas.report.vo.ReportDefinition;
import com.intellectdesign.canvas.report.vo.ReportRequest;
import com.intellectdesign.canvas.report.vo.ReportResponse;
import com.intellectdesign.canvas.utils.ResourceBundleUtils;
import com.intellectdesign.canvas.utils.StringUtils;
import com.intellectdesign.canvas.value.CanvasRequestVO;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionConstants;

/**
 * This class handle the ReportFW Actions which are raised by the user. Based on the user Action it call the appropriate
 * methods of ReportManager and ReportInstruction classes and give the ReplyObject object as response.
 * 
 * @version 1.0
 */
public class ReportDefinitionRequestHandler extends SimpleRequestHandler
{
	/**
	 * This method is the base method invoked whenever a request is received. Depending on the action the internal
	 * private methods are called.
	 * 
	 * @param request The request received
	 * @return The ReplyObject that needs to be sent back to the invoker
	 * @throws ProcessingErrorException Thrown if any error occurs while processing the request
	 */
	public ReplyObject process(CanvasRequestVO request) throws ProcessingErrorException
	{
		ExtReplyObject response = null;
		PerformanceTimer perfTimer = new PerformanceTimer();
		String action = request.getActionCode();
		perfTimer.startTimer("ReportDefinitionRequestHandler.processRequest for Action '" + action + "'");

		try
		{
			if (ReportConstants.GET_SCHEDULED_REPORT_ACTION.equals(action)) // schedule report
			{
				response = getScheduleReportValues(request);
			} else if (ReportConstants.ACTION_RPT_GET_PARENT_NODE.equals(action))
			{
				response = getParentNode(request);
			} else if (ReportConstants.GET_FILTER_CRITERIA_ACTION.equals(action))
			{
				response = getFilterCriteria(request);
			} else if (ReportConstants.GET_FORM_DATA_ACTION.equals(action))
			{
				response = getFormValues(request);
			} else
			{
				response = handleReportAction(request);
			}

		} catch (ReportingException e)
		{
			LOGGER.cterror("CTREP00583", e, action);
			throw new ProcessingErrorException(e);
		} finally
		{
			perfTimer.endTimer();
		}
		return response;
	}

	/**
	 * This is a helper method that retrieves the list of scheduled reports
	 * 
	 * @param requestDataObject The request received
	 * @return The response for this request
	 * @throws ReportingException Thrown if any error occurs while processing the request
	 */
	private ExtReplyObject getScheduleReportValues(CanvasRequestVO requestDataObject) throws ReportingException
	{
		ExtReplyObject replyObject = new ExtReplyObject();
		replyObject.headerMap = new HashMap();

		HashMap params = (HashMap) requestDataObject.getRequestData();
		String reportId = (String) params.get(ReportConstants.REPORT_ID);
		/**
		 * Create instance for ReportInstruction class and call the getScheduleReportValues() method to get the
		 * scheduler details like scheduler's from date, to_date, Type, Frequecy Value in the form of HashMap for the
		 * given reportId.
		 */
		ReportInstruction reportInstruction = new ReportInstruction();
		HashMap returnMap = reportInstruction.getScheduleReportValues(reportId);

		if (returnMap != null)
		{
			replyObject.headerMap = returnMap;
		}
		LOGGER.ctdebug("CTREP00584", returnMap);
		return replyObject;
	}

	/**
	 * This method is to get the parent node of the report being clicked by calling the getParentNode(reportId) method
	 * of ReportInstruction class.
	 * 
	 * @param requestDataObject - It must have the ReportId.
	 * @return ReplyObject - It contains the Parent node's System ReportId and parent ReportId in the form of Map.
	 * @throws ReportingException
	 */
	private ExtReplyObject getParentNode(final CanvasRequestVO requestDataObject) throws ReportingException
	{
		ExtReplyObject replyObject = new ExtReplyObject();
		replyObject.headerMap = new HashMap();

		Map inputParams = requestDataObject.getRequestData();
		String reportId = (String) inputParams.get(ReportConstants.REPORT_ID);

		ReportInstruction reportInstruction = new ReportInstruction();
		HashMap returnMap = reportInstruction.getParentNode(reportId);

		LOGGER.ctdebug("CTREP00585", returnMap);
		replyObject.headerMap = returnMap;

		return replyObject;
	}

	/**
	 * This method would fetch the filter criteria on the basis of report & column id
	 * 
	 * @param requestDataObject - It contains the reportId and column_Id.
	 * @return replyObject - It contains FilterName and FilterId as form of HashMap.
	 * @throws ReportingException
	 */
	private ExtReplyObject getFilterCriteria(final CanvasRequestVO requestDataObject) throws ReportingException
	{
		ExtReplyObject replyObject = new ExtReplyObject();
		replyObject.headerMap = new HashMap();

		HashMap params = (HashMap) requestDataObject.getRequestData();
		String filterColumn = (String) params.get(ReportConstants.FILTER_COLUMN);
		String reportId = (String) params.get(ReportConstants.PARENT_REPORT_ID);
		if (reportId == null || reportId.trim().length() == 0 || ReportConstants.DUMMY_ID.equals(reportId))
		{
			reportId = (String) params.get(ReportConstants.REPORT_ID);
		}
		/**
		 * Create instance for ReportInstruction class and call the getFilterCriteria() to get the Filter information
		 * for the given reportId.
		 */
		ReportInstruction reportInstruction = new ReportInstruction();
		HashMap returnMap = reportInstruction.getFilterCriteria(filterColumn, reportId);
		replyObject.headerMap = returnMap;

		LOGGER.ctdebug("CTREP00586", returnMap);
		return replyObject;
	}

	/**
	 * This method would fetch the values of an existing report while display the report in edit mode.
	 * 
	 * @param requestDataObject - Contains the user selected report's Id.
	 * @return replyObject - Contains the ReportDefinition object.
	 * @throws ReportingException
	 */
	private ExtReplyObject getFormValues(final CanvasRequestVO requestDataObject) throws ReportingException
	{
		ExtReplyObject replyObject = new ExtReplyObject();
		replyObject.headerMap = new HashMap();
		HashMap columnDisplayNameMap = new HashMap();
		ReportInstruction reportInstruction = new ReportInstruction();
		HashMap params = (HashMap) requestDataObject.getRequestData();
		String reportId = (String) params.get(ReportConstants.REPORT_ID);

		/**
		 * Create instance for ReportInstruction class and call the getReportDefinition() to get the reportdefinition
		 * object for the given reportId.
		 */
		ReportDefinition reportdefinition = reportInstruction.getReportDefinition(reportId);

		if (reportdefinition != null)
		{

			List<ReportColumnDefinition> allColumns = reportInstruction.getColumnDefinitions(reportdefinition
					.getSystemReportId());
			if (allColumns != null && allColumns.size() > 0)
			{
				ResourceBundle reportBundle = null;
				try
				{
					reportBundle = ResourceBundle.getBundle(reportdefinition.getBundleKey() + "_"
							+ requestDataObject.getUserPreferenceContext().getLanguageId());

				} catch (Exception ex)
				{
					LOGGER.cterror("CTREP00642", ex);
				}
				for (ReportColumnDefinition reportColDef : allColumns)
				{
					columnDisplayNameMap.put(reportColDef.getColumnId(), ResourceBundleUtils.getString(reportBundle,
							"LBL_" + reportColDef.getColumnName(), reportColDef.getColumnName()));
				}
			}
			replyObject.headerMap.put(ReportConstants.REPORT_DEFINITION,
					reportdefinition.getReportDefinitionAsMapForUI());
			replyObject.headerMap.put(ReportConstants.COLUMN_DISPLAY_NAME_MAP, columnDisplayNameMap);
		}

		LOGGER.ctdebug("CTREP00587", replyObject.headerMap);
		return replyObject;
	}

	/**
	 * This method get the user Report Actions and its properties as a CBXRequestDataObject object based on that
	 * construct the ReportRequest Object and call the appropiriate ReportManager method for that input action to get
	 * the ReportResponse.
	 * 
	 * @param requestDataObject - contains the user input action with user selected inputs.
	 * @return ReplyObject - It constains the status and responseObject based on the ReportResponse got from
	 *         ReportManager.
	 * @throws ReportingException, OnlineException
	 */
	private ExtReplyObject handleReportAction(final CanvasRequestVO requestDataObject) throws ReportingException
	{
		ExtReplyObject replyObject = null;
		String action = requestDataObject.getActionCode();
		try
		{
			PerformanceTimer perfTimer = new PerformanceTimer();
			perfTimer.startTimer("ReportDefinitionRequestHandler.handleReportAction(" + action + ")");

			/**
			 * Step 1: Fetch the action, paramsMap values from CBXRequestDataObject object.
			 */
			Map paramsMap = requestDataObject.getRequestData();

			/**
			 * Step 2: Construct the ReportRequest object using CBXRequestDataObject object.
			 */
			ReportRequest reportRequest = constructReportRequest(requestDataObject);
			/**
			 * Step 3: Calling the Audit event.
			 */
			/*
			 * try{ auditEvent(requestDataObject, getActionForAudit(action, paramsMap)); } catch(OnlineException onex){
			 * 
			 * }
			 */

			/**
			 * Step 4: Create an object for ReportManger and call the appiropiriate method for that action.
			 */
			ReportManager reportManager = new ReportManager();
			ReportResponse reportResponse = null;

			if (ReportConstants.ACTION_RPT_RUN.equals(action))
			{
				reportResponse = reportManager.runReport(reportRequest);
			} else if (ReportConstants.ACTION_RPT_INST_RUN.equals(action))
			{
				reportResponse = reportManager.runReportInstance(reportRequest);
			} else if (ReportConstants.ACTION_RPT_SAVE.equals(action))
			{
				reportResponse = reportManager.saveReport(reportRequest);
			} else if (ReportConstants.ACTION_RPT_SAVE_SCHEDULE.equals(action))
			{
				reportResponse = reportManager.saveAndScheduleReport(reportRequest);
			} else if ((ReportConstants.ACTION_RPT_SAVE_RUN.equals(action)))
			{
				reportResponse = reportManager.saveAndRunReport(reportRequest);
			} else if ((ReportConstants.ACTION_RPT_DELETE.equals(action)))
			{
				reportResponse = reportManager.deleteReport(reportRequest);
			}

			/**
			 * Step 5: Constructing the reply map.
			 */
			if (reportResponse != null && reportResponse.getStatus() != null
					&& ReportConstants.STATUS_SUCCESS.equalsIgnoreCase(reportResponse.getStatus().trim()))
			{
				if (requestDataObject.getSessionContext().isSimulated())
				{
					/**
					 * Setting the appropriate message if it is in simulation mode.
					 */
					String simulationMsg = getSimulationActionMsg(action);
					/**
					 * Construct the Simulation Mode Success reply object.
					 */
					replyObject = getSimulationModeReplyObj(simulationMsg);
					if (reportResponse.getResponseObject() != null)
					{
						replyObject.headerMap.putAll(reportResponse.getResponseObject());
					}
					replyObject.headerMap.put(FrameworkConstants.SIMULATION_SUCCESS_FLAG,
							FrameworkConstants.SIMULATION_FLAG_FALSE);
					replyObject.headerMap.put(ReportConstants.LBL_SIMULATION_MODE_SUCCESS_MESSAGE, ReportUtil
							.getMessage(ReportConstants.MSG_SIMULATION_MODE_MESSAGE, requestDataObject
									.getUserPreferenceContext().getLanguageId()));

				} else
				{
					replyObject = constructSuccessReply(requestDataObject, reportResponse);
				}
				LOGGER.ctdebug("CTREP00588");
			} else
			{
				LOGGER.ctdebug("CTREP00589");
				if (reportResponse != null)
				{
					replyObject = constructErrorResponse(requestDataObject, reportResponse.getErrorCode());
				} else
				{
					replyObject = constructErrorResponse(requestDataObject, ReportConstants.ERR_CD_RPT_GEN_FAILURE);
				}

			}

			perfTimer.endTimer();
		} catch (ReportingException reportException)
		{
			replyObject = constructErrorResponse(requestDataObject, reportException.getErrorCode());
		} /*
		 * catch (OnlineException onlineException) { replyObject =
		 * constructErrorResponse(onlineException.getErrorCode(), onlineException.getMessage()); }
		 */

		LOGGER.ctdebug("CTREP00590", replyObject);
		return replyObject;

	}

	/**
	 * This method used to Construct the ReportRequest object from CBXRequestDataObject object input.
	 * 
	 * @param requestDataObject - It have the neccessary properties for the user raised action. Like GCIF No, UserNo,
	 *            ProductCode, SubProductCode, FunctionCode, InputAction. Also it contains the properties like reportId
	 *            (or) report instanceid, Report name, Report Type, Communication Type, Scheduler details, Alert Type,
	 *            publisher Type, Selected report column list, sorting column and etc.. based on the action raised by
	 *            the user
	 * 
	 * @return ReportRequest - It have the properties of user selected UI and action details.
	 * @throws ReportingException
	 */
	private ReportRequest constructReportRequest(final CanvasRequestVO requestDataObject) throws ReportingException
	{
		LOGGER.ctdebug("CTREP00591");

		/**
		 * Step 1: Create a ReportRequest Object.
		 */
		ReportRequest reportRequest = new ReportRequest();

		/**
		 * Step 1.1: Declare the necessary variables.
		 */

		/**
		 * Used to hold the Filter Column list
		 */
		List filterColumnList = null;

		/**
		 * Used to hold the Totals of all column group by list
		 */
		String totalColGroupedBy = null;

		/**
		 * Used to hold the group total List
		 */
		String groupTotalsList = null;

		/**
		 * Used to store the System Report Id
		 */
		String sysReportId = null;

		/**
		 * Used to store the Parent Report Id
		 */
		String parentId = null;

		/**
		 * Variable to store the RateCard
		 */
		String rateCard = null;

		/**
		 * Variable to store the Base Currency
		 */
		String baseCCy = null;

		/**
		 * List for hold the user selected notifiers list. Default Notifier is INBOX
		 */
		List notifiersList = new ArrayList();
		notifiersList.add(ReportConstants.INBOX_LABEL);

		/**
		 * Step 2: Fetching the Event (Prod_code + Sub_Prod_Code + Function_code) details from the requestDataObject and
		 * set the values to ReportRequest Object.
		 */
		reportRequest.setGcif(requestDataObject.getUserContext().getCurrentGCIF());
		reportRequest.setUserNo(requestDataObject.getUserContext().getUserNumber());
		String action = requestDataObject.getActionCode();

		/**
		 * Step 3: Getting the Simulation mode details. set the transaction simulation mode flag in Report Request
		 * object. If simulation mode is true, no transaction will be performed.
		 */
		boolean simulationMode = requestDataObject.getSessionContext().isSimulated();
		reportRequest.setSimulationMode(simulationMode);
		/**
		 * Step 4: Fetching the input params from the requestDataObject.
		 */
		Map paramsMap = requestDataObject.getRequestData();

		/**
		 * Step 5 : Report Delete action validation and form the ReportRequest object for the Delete action.
		 */
		if (action.equals(ReportConstants.ACTION_RPT_DELETE))
		{
			populateEntitlementParameters(reportRequest, paramsMap);// IR_ENHANCEMENTS_001
			reportRequest = validateReportDeleteAction(reportRequest, paramsMap);
			/**
			 * return the ReportRequest to handleReportAction() method.
			 */
			return reportRequest;
		}

		/**
		 * Step 6: Validating Generated Reports Run Now action. The request must have the reportInstanceId to perform
		 * the Run-Now action. If report Instance id is not available in request throw the Exception with neccessary
		 * error code and error message. otherwise form the ReportRequest object and pass to the called method.
		 */
		if (action.equals(ReportConstants.ACTION_RPT_INST_RUN))
		{
			populateEntitlementParameters(reportRequest, paramsMap);// IR_ENHANCEMENTS_001
			reportRequest = validateReportRunNowAction(reportRequest, paramsMap);
			/**
			 * return the ReportRequest to handleReportAction() method.
			 */
			return reportRequest;
		}

		/**
		 * Step 7: Construct the Report Request object based on the Report Details.
		 */

		List reportDetails = (List) paramsMap.get(ReportConstants.REPORT_DETAILS);
		Map reportDetailsMap = null;

		/**
		 * Validate the user request reportDetails list.
		 */
		if (reportDetails != null && !reportDetails.isEmpty())
		{

			/**
			 * Get the reportDetailsMap from user request's reportDetails list. This map contains the user raised
			 * actions properties and user selected inputs from UI screen.
			 */
			reportDetailsMap = (Map) reportDetails.get(0);
			if (reportDetailsMap == null || reportDetailsMap.isEmpty())
			{
				LOGGER.cterror("CTREP00592", "constructReportRequest", action, "reportDetailsMap is null");
				throw new ReportingException(ReportConstants.ERR_CD_RPT_DEFINITION_NULL);
			}

			String reportId = (String) reportDetailsMap.get(ReportConstants.REPORT_ID);
			populateEntitlementParameters(reportRequest, reportDetailsMap);

			/**
			 * Save and Schedule action validation and based on the validation, constructing reportRequest object.
			 * 
			 */
			if (action.equals(ReportConstants.ACTION_RPT_SAVE_SCHEDULE))
			{
				reportRequest = validateSaveAndScheduleAction(reportRequest, reportDetailsMap);
				/**
				 * return the ReportRequest to handleReportAction() method.
				 */
				return reportRequest;
			}

			/**
			 * Create instance for ReprotUtil to use the util methods.
			 */
			ReportUtil reportUtil = new ReportUtil();

			/**
			 * Get the user selected Report Column list from the reportdetailsMap and set to reportRequest object.
			 */
			List selectedColumns = (List) reportDetailsMap.get(ReportConstants.FORM_ITEM_REPORT_SELECTED_COLS);
			if (selectedColumns == null || selectedColumns.isEmpty())
			{
				LOGGER.cterror("CTREP00592", "constructReportRequest", action,
						"Selected Report Columns is null or Empty.");
				throw new ReportingException(ReportConstants.ERR_CD_RPT_SELECTED_COLS_NULL);
			} else
			{
				reportRequest.setSelectedColumns(selectedColumns);
			}

			/**
			 * Get the user selected Report GroupBy Column list from the reportdetailsMap and set to reportRequest
			 * object.
			 */
			if (reportDetailsMap.get(ReportConstants.FORM_ITEM_REPORT_GROUP_BY_COLS) != null
					&& (!((List) reportDetailsMap.get(ReportConstants.FORM_ITEM_REPORT_GROUP_BY_COLS)).isEmpty()))
			{
				List groupedColumns = (List) reportDetailsMap.get(ReportConstants.FORM_ITEM_REPORT_GROUP_BY_COLS);
				reportRequest.setGroupedColumns(groupedColumns);
			}

			/**
			 * Get the user selected Report SortBy Column list from the reportdetailsMap and set to reportRequest
			 * object.
			 */
			if (reportDetailsMap.get(ReportConstants.FORM_ITEM_REPORT_SORT_BY_COLS) != null
					&& (!((List) reportDetailsMap.get(ReportConstants.FORM_ITEM_REPORT_SORT_BY_COLS)).isEmpty()))
			{
				List sortingColumns = (List) reportDetailsMap.get(ReportConstants.FORM_ITEM_REPORT_SORT_BY_COLS);
				reportRequest.setSortingColumns(sortingColumns);
			}

			/**
			 * Get the user selected Report Filters list from the reportdetailsMap and set to reportRequest object.
			 */
			filterColumnList = (List) reportDetailsMap.get(ReportConstants.REPORT_FILTER_LIST);

			if (filterColumnList != null && !filterColumnList.isEmpty())
			{
				reportRequest.setFilters(reportUtil.buildFilterList(filterColumnList));
			}

			/**
			 * Get the user selected Report Total GroupBy details from the reportdetailsMap and construct the list and
			 * set to reportRequest object.
			 */
			totalColGroupedBy = (String) reportDetailsMap.get(ReportConstants.REPORT_TOT_COL_GRP_BY);

			if (totalColGroupedBy != null && !totalColGroupedBy.isEmpty())
			{
				reportRequest.setAllColumnGroupBy(StringUtils.convertToList(totalColGroupedBy, ","));
			}

			/**
			 * Get the Group Total from the reportdetailsMap and construct the list and set to reportRequest object.
			 */
			groupTotalsList = (String) reportDetailsMap.get(ReportConstants.REPORT_GRP_TOT_BY);

			if (groupTotalsList != null && !groupTotalsList.isEmpty())
			{
				reportRequest.setGroupTotal(StringUtils.convertToList(groupTotalsList, ","));
			}

			/**
			 * Construct the ReportRequest object with ReportName.
			 */

			String reportName = getReportName(reportDetailsMap);

			if (ReportUtil.isNotEmpty(reportName))
			{
				reportRequest.setReportName(reportName.trim());
			} else
			{
				LOGGER.cterror("CTREP00592", "constructReportRequest", action, "Report Name is null or Empty.");
				throw new ReportingException(ReportConstants.ERR_CD_RPT_NAME_NULL);
			}

			/**
			 * Get the system report id from request and construct the reportRequest.
			 */
			sysReportId = (String) reportDetailsMap.get(ReportConstants.SYSTEM_REPORT_ID);

			if (ReportUtil.isNotEmpty(sysReportId))
			{
				reportRequest.setSystemReportId(sysReportId);
			}

			/**
			 * Get the parent report id from request and construct the reportRequest.
			 */
			parentId = (String) reportDetailsMap.get(ReportConstants.PARENT_REPORT_ID);

			if (ReportUtil.isNotEmpty(parentId) && !parentId.equals(ReportConstants.DUMMY_ID))
			{
				reportRequest.setParentReportId(parentId);
			} else
			{
				reportRequest.setParentReportId(sysReportId);
			}

			/**
			 * ReportId Setting in ReportRequest for Edit mode of Report Definition Save, Save&Run and Run Process.
			 */

			if (action.equals(ReportConstants.ACTION_RPT_SAVE) || action.equals(ReportConstants.ACTION_RPT_SAVE_RUN)
					|| action.equals(ReportConstants.ACTION_RPT_RUN))
			{
				if (ReportUtil.isNotEmpty(reportId))
				{
					reportRequest.setReportId(reportId);
				} else
				{
					// Validate the ReportName duplication.
					boolean isReportAvailable = checkReportNameAvailabiltiy(reportRequest.getGcif(),
							reportRequest.getUserNo(), sysReportId, reportName);

					if (isReportAvailable)
					{
						LOGGER.cterror("CTREP00592", "constructReportRequest", action, "Report Name already exists.");
						throw new ReportingException(ReportConstants.ERR_CD_RPT_NAME_EXIST);
					}
				}
			}

			/**
			 * Construct the ReportRequest object with ReportFormat includeBalnkRecord details.
			 */
			String formatId = (String) reportDetailsMap.get(ReportConstants.FORM_ITEM_REPORT_FORMAT);
			if (ReportUtil.isNotEmpty(formatId))
			{
				reportRequest.setFormatId(formatId);
			} else
			{
				LOGGER.cterror("CTREP00592", "constructReportRequest", action, "Report Format is null or Empty.");
				throw new ReportingException(ReportConstants.REPORT_ERR_CBX_EXP_FORMAT_NULL_RPT_ENG);
			}
			boolean includeBlankRecord = ReportConstants.VAL_BOOL_YES.equals(reportDetailsMap
					.get(ReportConstants.FORM_ITEM_REPORT_INC_BLANK_REC));
			reportRequest.setIncludeBlankRec(includeBlankRecord);
			// reportRequest.setIncludeTotal(includeTotalInd);

			/**
			 * Set the ratecard and base currency to reportRequest object
			 */
			rateCard = (String) reportDetailsMap.get(ReportConstants.FORM_ITEM_REPORT_RATE_CARD);
			baseCCy = (String) reportDetailsMap.get(ReportConstants.FORM_ITEM_REPORT_BASE_CCY);

			if (ReportUtil.isNotEmpty(rateCard))
				reportRequest.setRateCard(rateCard);
			if (ReportUtil.isNotEmpty(baseCCy))
				reportRequest.setReferenceCcy(baseCCy);

			/**
			 * Get the publishers details from reportDetailsMap of request. Based on this, Construct the publisher list
			 * and set it to reportRequest object.
			 * 
			 * If MAIL report is selected as attachment then set the MAIL publisher also in publishers list.
			 */
			reportRequest.setPublishers(reportUtil.buildPublisherList(reportDetailsMap));

			/**
			 * Get the notifiers details from reportDetailsMap of request and construct the notifiers list and set it to
			 * reportRequest object. If user did not selected any one notifier then set the INBOX as default notifier.
			 */
			notifiersList = (List) reportDetailsMap.get(ReportConstants.REPORT_SEND_MAIL);

			if (notifiersList != null)
			{
				reportRequest.setNotifiers(reportUtil.buildNotifyList(notifiersList));
			}

			/**
			 * set the Communication type in the ReportRequest object based on the isScheduled() (i.e) if
			 * SCHEDULER_FROM_DATE is not null then the communication Type is ASYNC otherwise it is SYNC.
			 */
			if (reportRequest.isScheduled())
			{
				reportRequest.setCommunicationType(ReportRequest.ASYNC);
			} else
			{
				reportRequest.setCommunicationType(ReportRequest.SYNC);
			}
		}
		LOGGER.ctdebug("CTREP00594");
		return reportRequest;
	}

	/**
	 * This is a helper method that sets the entitlement parameters from the provided paramsMap
	 * 
	 * @param reportRequest The request into which entitlement parameters is to be set
	 * @param paramsMap The request data
	 */
	private void populateEntitlementParameters(ReportRequest reportRequest, Map paramsMap)
	{
		reportRequest.setProductCode((String) paramsMap.get(ReportConstants.REPORT_PROD_CODE));
		reportRequest.setSubProductCode((String) paramsMap.get(ReportConstants.REPORT_SUB_PROD_CODE));
		reportRequest.setFuncCode((String) paramsMap.get(ReportConstants.REPORT_FUNC_CODE));
		reportRequest.setUserRole((String) paramsMap.get(ReportConstants.INPUT_USER_ROLE));
	}

	/**
	 * This method used validating Report Delete action and construct the ReportRequest object for the Delete action.
	 * 
	 * @param reportRequest - denotes user ReportRequest
	 * @param paramsMap - contains the reportId
	 * @return reportRequest - constructed Report Request based on Validation.
	 * @throws ReportingException
	 */
	private ReportRequest validateReportDeleteAction(ReportRequest reportRequest, Map paramsMap)
			throws ReportingException
	{
		String reportId = (String) paramsMap.get(ReportConstants.REPORT_ID);

		if (ReportUtil.isNotEmpty(reportId))
		{
			reportRequest.setReportId(reportId);
		} else
		{
			LOGGER.cterror("CTREP00592", "validateReportDeleteAction", "ACTION_RPT_DELETE", "rReport Id null");
			throw new ReportingException(ReportConstants.ERR_CD_RPT_ID_NULL);
		}

		/**
		 * Processer CommunicationType setting based on the Scheduler selection.
		 */
		String is_scheduled = (String) paramsMap.get(ReportConstants.IS_SCHEDULED);
		if (ReportUtil.isNotEmpty(is_scheduled) && is_scheduled.equals(ReportConstants.YES_IND))
		{
			reportRequest.setCommunicationType(ReportRequest.ASYNC);
		} else
		{
			reportRequest.setCommunicationType(ReportRequest.SYNC);
		}

		/**
		 * return the ReportRequest to handleReportAction() method.
		 */
		return reportRequest;
	}

	/**
	 * Validating Generated Reports Run Now action. The request must have the reportInstanceId to perform the Run-Now
	 * action. If report Instance id is not available in request throw the Exception with neccessary error code and
	 * error message. otherwise form the ReportRequest object and pass to the called method.
	 * 
	 * @param reportRequest - denotes user ReportRequest
	 * @param paramsMap - contains the reportId
	 * @return reportRequest - constructed Report Request based on Validation.
	 * @throws ReportingException
	 */
	private ReportRequest validateReportRunNowAction(ReportRequest reportRequest, Map paramsMap)
			throws ReportingException
	{
		String reportInstanceId = (String) paramsMap.get(ReportConstants.REPORT_INSTANCE_ID);
		if (ReportUtil.isNotEmpty(reportInstanceId))
		{
			reportRequest.setReportInstanceId(reportInstanceId);
		} else
		{
			LOGGER.cterror("CTREP00592", "validateReportRunNowAction", ReportConstants.ACTION_RPT_INST_RUN,
					"reportInstanceId null");
			throw new ReportingException(ReportConstants.ERR_CD_RPT_INST_ID_NULL);
		}

		/**
		 * return the ReportRequest to handleReportAction() method.
		 */
		return reportRequest;
	}

	/**
	 * This method used for validate the SAVE_SCHEDULE_REPORT action.
	 * 
	 * @param reportRequest - denotes user ReportRequest
	 * @param reportDetailsMap - have the report details which comes in Request.
	 * @return ReportRequest object with schedule information.
	 * @throws ReportingException
	 */
	private ReportRequest validateSaveAndScheduleAction(ReportRequest reportRequest, Map reportDetailsMap)
			throws ReportingException
	{

		if (ReportUtil.isNotEmpty((String) reportDetailsMap.get(ReportConstants.REPORT_ID)))
		{
			reportRequest.setReportId((String) reportDetailsMap.get(ReportConstants.REPORT_ID));
		} else
		{
			LOGGER.cterror("CTREP00592", "validateSaveAndScheduleAction", ReportConstants.ACTION_RPT_SAVE_SCHEDULE,
					"reportId is null");
			throw new ReportingException(ReportConstants.ERR_CD_RPT_ID_NULL);
		}

		/**
		 * Setting Scheduler details to reportRequest.
		 */
		if (!reportDetailsMap.isEmpty())
		{
			reportRequest.setScheduleFromDate((String) reportDetailsMap.get(ReportConstants.RPT_SCH_FROM_DATE));
			reportRequest.setScheduleToDate((String) reportDetailsMap.get(ReportConstants.RPT_SCH_TO_DATE));
			reportRequest.setScheduleType((String) reportDetailsMap.get(ReportConstants.SCHEDULER_TYPE));
			reportRequest.setScheduleFrequencyValue((String) reportDetailsMap
					.get(ReportConstants.SCHEDULER_FREQUENCY_VALUE));
		}

		if (reportRequest.isScheduled())
		{
			/**
			 * set the Communication type in the ReportRequest object based on the SCHEDULER_FROM_DATE value.
			 */
			reportRequest.setCommunicationType(ReportRequest.ASYNC);
		} else
		{
			reportRequest.setCommunicationType(ReportRequest.SYNC);
		}

		return reportRequest;
	}

	/**
	 * Get ReportName from User Request.
	 * 
	 * @param reportDetailsMap - It is a map contains the user request object details.
	 * @return String - contains ReportName if user passed request have the reportName otherwise null.
	 */
	private String getReportName(Map reportDetailsMap)
	{
		String reportName = (String) reportDetailsMap.get(ReportConstants.REPORT_NAME);
		if (reportName == null || (reportName.trim().length() <= 0))
		{
			reportName = (String) reportDetailsMap.get(ReportConstants.RPT_SCH_REPORT_NAME);
		}
		return reportName;
	}

	/**
	 * This method used to check the reportName availability by calling the
	 * reportInstruction.getReportNameAvailability() method.
	 * 
	 * @param gcif - denotes the OD_GCIF_NO
	 * @param userNo - denotes the OD_USER_NO
	 * @param systemReportId - System report Id for the availability checking report.
	 * @param reportName - User typed name for create a new report.
	 * @return boolean - if the entered reportName is already available in database then it returns true otherwise
	 *         false.
	 * @throws ReportingException
	 */
	private boolean checkReportNameAvailabiltiy(final String gcif, final String userNo, final String systemReportId,
			final String reportName) throws ReportingException
	{
		LOGGER.ctdebug("CTREP00593", gcif, userNo, systemReportId, reportName);

		String isReportAvailable = ReportConstants.YES_IND;

		ReportInstruction reportInstruction = new ReportInstruction();
		Map returnMap = reportInstruction.getReportNameAvailability(gcif, userNo, systemReportId, reportName);

		if (returnMap != null)
		{
			isReportAvailable = (String) returnMap.get(ReportConstants.IS_REPORT_AVAILABLE);
		}

		return (isReportAvailable != null && isReportAvailable.equals(ReportConstants.YES_IND)) ? true : false;
	}

	/**
	 * This method is used to identify the appropriate action string for audit.
	 * 
	 * @param action - denotes the user input action.
	 * @param paramsMap - contains the ReportId
	 * @return string - denotes the Audit Action
	 */
	private String getActionForAudit(String action, Map paramsMap)
	{
		String actionForAudit = action;
		List reportDetails = (List) paramsMap.get(ReportConstants.REPORT_DETAILS);
		if (reportDetails != null)
		{
			Map reportDetailsMap = (Map) reportDetails.get(0);
			String reportId = (String) reportDetailsMap.get(ReportConstants.REPORT_ID);

			if (reportId != null && reportId.trim().length() > 0)
			{
				if (ReportConstants.ACTION_RPT_SAVE.equals(action))
				{
					actionForAudit = ReportConstants.ACTION_RPT_UPDATE;
				} else if ((ReportConstants.ACTION_RPT_SAVE_RUN.equals(action)))
				{
					actionForAudit = ReportConstants.ACTION_RPT_UPDATE_RUN;
				} else if ((ReportConstants.ACTION_RPT_SAVE_SCHEDULE.equals(action)))
				{
					actionForAudit = ReportConstants.ACTION_RPT_UPDATE_SCHEDULE;
				}
			}
		}
		LOGGER.ctdebug("CTREP00595", actionForAudit, action);
		return actionForAudit;
	}

	/**
	 * Carrys out auditing of Reporting framework related operations. Invokes audit helper classes of Data and Value to
	 * audit the operation. Constructs a audit value object and invokes data's insert to insert the record in audit
	 * table.
	 * 
	 * @param requestDataObject It contains all request specific information
	 * @param action denotes the action to be performed - Save/Update/Delete/Schedule/Run.
	 * @throws OnlineException In case there is some problem in auditing
	 */
	protected final void auditEvent(final CanvasRequestVO requestDataObject, final String action)
			throws OnlineException
	{
		if (requestDataObject != null)
		{
			String productcode = requestDataObject.getProductCode();
			String subProductcode = requestDataObject.getSubProductCode();
			String functioncode = requestDataObject.getFunctionCode();
			String gcif = requestDataObject.getUserContext().getCurrentGCIF();
			String userNo = requestDataObject.getUserContext().getUserNumber();

			Event event = Event.getEventFor(productcode, subProductcode, functioncode, action);
			LOGGER.ctdebug("CTREP00596", productcode, subProductcode, functioncode, action, event);

			Map dataMap = requestDataObject.getRequestData();

			dataMap.put(EventHandlerFrameworkConstants.FLD_SESSION_ID, requestDataObject.getSessionContext()
					.getSessionId());
			dataMap.put(EventHandlerFrameworkConstants.FLD_USER_NO, userNo);
			dataMap.put(EventHandlerFrameworkConstants.FLD_GCIF, gcif);
			dataMap.put(EventHandlerFrameworkConstants.FLD_PARENT_GCIF, gcif);
			dataMap.put(EventHandlerFrameworkConstants.FLD_TRAN_REF_NO, EventHandlerFrameworkConstants.FLD_TRAN_REF_NO);
			dataMap.put(EventHandlerFrameworkConstants.FLD_REFERENCE_NO,
					EventHandlerFrameworkConstants.FLD_REFERENCE_NO);
			dataMap.put(EventHandlerFrameworkConstants.FLD_PROD_CODE, productcode);
			dataMap.put(EventHandlerFrameworkConstants.FLD_SUB_PROD_CODE, subProductcode);
			dataMap.put(EventHandlerFrameworkConstants.FLD_FUNC_CODE, functioncode);
			dataMap.put(EventHandlerFrameworkConstants.EVENT_ID, event.getEventId());
			dataMap.put(EventHandlerFrameworkConstants.FLD_CHANNEL_ID, requestDataObject.getSessionContext()
					.getChannelId());
			dataMap.put(EventHandlerFrameworkConstants.FLD_APP_SERVER_IP, requestDataObject.getAppServerIP());
			dataMap.put(EventHandlerFrameworkConstants.FLD_WEB_SERVER_IP, requestDataObject.getWebServerIP());
			dataMap.put(EventHandlerFrameworkConstants.FLD_BROWSER, requestDataObject.getSessionContext()
					.getBrowserName());
			dataMap.put(EventHandlerFrameworkConstants.FLD_CLIENT_IP, requestDataObject.getSessionContext()
					.getRequestingClientIP());
			dataMap.put(EventHandlerFrameworkConstants.FLD_LOGIN_ID, requestDataObject.getUserContext().getLoginId());
			dataMap.put(EventHandlerFrameworkConstants.FLD_SIMULATION_USERID, requestDataObject.getSessionContext()
					.getSimulatingUserLoginId());
			dataMap.put(EventHandlerFrameworkConstants.FLD_SIMULATION_MODE, requestDataObject.getSessionContext()
					.isSimulated() ? "Y" : "N");

			String reportId = null;
			List reportDetails = (List) dataMap.get(ReportConstants.REPORT_DETAILS);
			if (reportDetails != null)
			{
				Map reportDetailsMap = (Map) reportDetails.get(0);
				reportId = (String) reportDetailsMap.get(ReportConstants.REPORT_ID);
				String parentReportId = (String) reportDetailsMap.get(ReportConstants.PARENT_REPORT_ID);
				String systemReportId = (String) reportDetailsMap.get(ReportConstants.SYSTEM_REPORT_ID);
				String reportName = getReportName(reportDetailsMap);

				String reportInstanceId = (String) reportDetailsMap.get(ReportConstants.REPORT_INSTANCE_ID);

				if (parentReportId != null)
				{
					dataMap.put(ReportConstants.PARENT_REPORT_ID, parentReportId);
				}
				if (systemReportId != null)
				{
					dataMap.put(ReportConstants.SYSTEM_REPORT_ID, systemReportId);
				}
				if (reportName != null)
				{
					dataMap.put(ReportConstants.REPORT_NAME, reportName);
				}
				if (reportInstanceId != null)
				{
					dataMap.put(ReportConstants.REPORT_INSTANCE_ID, reportInstanceId);
				}
			} else
			{
				reportId = (String) dataMap.get(ReportConstants.REPORT_ID);
			}

			dataMap.put(ReportConstants.REPORT_ID, reportId);
			HashMap auditDataMap = new HashMap();
			auditDataMap.put(AuditConstants.MANDATORY_AUDIT_META_DATA, dataMap);
			auditDataMap.put(AuditConstants.MANDATORY_AUDIT_DATA_OLD_STATE, dataMap);
			auditDataMap.put(AuditConstants.MANDATORY_AUDIT_DATA_NEW_STATE, dataMap);
			LOGGER.ctdebug("CTREP00598", auditDataMap);

			EventDispatcher eventDispatcher = EventDispatcher.getInstance();
			try
			{
				eventDispatcher.raiseEvent(event, auditDataMap);
			} catch (HandlerException e)
			{
				LOGGER.cterror("CTREP00597", e);
				throw new OnlineException(ReportConstants.ERR_CD_GENERAL_FAILURE, ReportUtil.getMessage(
						ReportConstants.ERR_CD_GENERAL_FAILURE, requestDataObject.getUserPreferenceContext()
								.getLanguageId()));
			}
		}
	}

	/**
	 * This method returns the success ExtReplyObject.
	 * 
	 * @param requestDataObject - The request received
	 * @param reportResponse - denotes the ReportResponse object.
	 * @return ExtReplyObject - have the success status and reponseObject.
	 */
	private ExtReplyObject constructSuccessReply(final CanvasRequestVO requestDataObject,
			final ReportResponse reportResponse)
	{
		ExtReplyObject reply = new ExtReplyObject();
		reply.headerMap = new HashMap();

		reply.headerMap.put(FrameworkConstants.SUCCESS, FrameworkConstants.TRUE);
		reply.headerMap.put(FrameworkConstants.KEY_REPLY_TYPE, FrameworkConstants.KEY_SUCCESS);
		if (reportResponse.getResponseObject() != null)
		{
			reply.headerMap.putAll(reportResponse.getResponseObject());
		}

		return reply;
	}

	/**
	 * The method used to get the appropriate simulation mode message for the given action.
	 * 
	 * @param action - denotes the current user action.
	 * @return - current action success message.
	 */
	private String getSimulationActionMsg(String action)
	{
		String actionMessage = null;
		if (ReportConstants.ACTION_RPT_RUN.equals(action) || (ReportConstants.ACTION_RPT_INST_RUN.equals(action)))
		{
			actionMessage = MessageManager.getMessage(ReportingProperties.propertyFileName,
					ReportConstants.REPORT_EXECUTE_SIMULATION, ReportConstants.DEFAULT_LANG_ID);
		} else if (ReportConstants.ACTION_RPT_SAVE.equals(action))
		{
			actionMessage = MessageManager.getMessage(ReportingProperties.propertyFileName,
					ReportConstants.REPORT_SAVE_SIMULATION, ReportConstants.DEFAULT_LANG_ID);
		} else if (ReportConstants.ACTION_RPT_SAVE_RUN.equals(action))
		{
			actionMessage = MessageManager.getMessage(ReportingProperties.propertyFileName,
					ReportConstants.REPORT_SAVE_RUN_SIMULATION, ReportConstants.DEFAULT_LANG_ID);
		} else if (ReportConstants.ACTION_RPT_SAVE_SCHEDULE.equals(action))
		{
			actionMessage = MessageManager.getMessage(ReportingProperties.propertyFileName,
					ReportConstants.REPORT_SAVE_SCHEDULE_SIMULATION, ReportConstants.DEFAULT_LANG_ID);
		} else if (ReportConstants.ACTION_RPT_DELETE.equals(action))
		{
			actionMessage = MessageManager.getMessage(ReportingProperties.propertyFileName,
					ReportConstants.REPORT_DELETE_SIMULATION, ReportConstants.DEFAULT_LANG_ID);
		}
		return actionMessage;
	}

	/**
	 * Helper method that constructs an error reply based on the parameters provided
	 * 
	 * @param userVO The user value that needs to be sent back
	 * @param errorCode The error code to be provided
	 * @param errorMessage The error message to be provided
	 * @return The Error reply object
	 */
	private ExtReplyObject constructErrorResponse(String errorCode, String errorMessage)
	{
		ExtReplyObject response = new ExtReplyObject();
		response.sErrTxn = new String[]
		{ FrameworkConstants.ERROR_SYSTEM_ERROR };
		response.headerMap = new HashMap();
		response.headerMap.put(FrameworkConstants.KEY_ERROR_CODE, errorCode);
		response.headerMap.put(FrameworkConstants.KEY_REPLY_TYPE, FrameworkConstants.KEY_ERROR);
		response.headerMap.put(FrameworkConstants.KEY_ERROR_MESSAGE, errorMessage);
		response.headerMap.put(FrameworkConstants.SUCCESS, false);
		return response;
	}

	/**
	 * This method returns the error reply object.
	 * 
	 * @param requestDataObject - It is a request object. It contains the action and user inputs in values.
	 * @param errorCode - Error Code
	 * @return extReplyObject - ExtReplyObject with error details.
	 */
	private ExtReplyObject constructErrorResponse(final CanvasRequestVO requestDataObject, final String errorCode)
	{
		/**
		 * Get the user language id. if it is null then assign the en_US as locale.
		 */
		String strLocale = requestDataObject.getUserPreferenceContext().getLanguageId();

		if (StringUtils.isEmpty(strLocale))
		{
			strLocale = FrameworkConstants.DEFAULT_LOCALE;
		}

		String strErrorMessage = ReportUtil.getMessage(ReportConstants.MSG_ERR_RPT_RESPONSE, strLocale); // "Error occured. your request is not successfully done.";
		if (errorCode != null)
		{
			strErrorMessage = ReportUtil.getMessage(errorCode, strLocale);
		}

		LOGGER.cterror("CTREP00599", errorCode);

		/**
		 * Form the error ExtReplyObject.
		 */
		ExtReplyObject reply = new ExtReplyObject();
		reply.sErrTxn = new String[]
		{ ViewDefinitionConstants.ERR_SERVER_VALDN_FAILURE };

		reply.headerMap = new HashMap();
		reply.headerMap.put(FrameworkConstants.KEY_ERROR_CODE, errorCode);
		reply.headerMap.put(FrameworkConstants.KEY_REPLY_TYPE, FrameworkConstants.KEY_ERROR);
		reply.headerMap.put(FrameworkConstants.KEY_ERROR_MESSAGE, strErrorMessage);
		reply.headerMap.put(FrameworkConstants.SUCCESS, false);

		return reply;
	}

	/**
	 * The logger instance for this class.
	 */
	private static final Logger LOGGER = Logger.getLogger(ReportDefinitionRequestHandler.class);
}
