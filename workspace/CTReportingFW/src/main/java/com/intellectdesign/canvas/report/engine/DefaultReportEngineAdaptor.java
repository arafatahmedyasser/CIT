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

package com.intellectdesign.canvas.report.engine;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.intellectdesign.canvas.common.UserValue;
import com.intellectdesign.canvas.constants.preferences.PreferenceConstants;
import com.intellectdesign.canvas.exportdata.ExportDataException;
import com.intellectdesign.canvas.exportdata.ExportFormatFactory;
import com.intellectdesign.canvas.exportdata.IExportDataValueObject;
import com.intellectdesign.canvas.exportdata.IExportFormatProvider;
import com.intellectdesign.canvas.exportdata.InfoRptExportDataVO;
import com.intellectdesign.canvas.exportdata.SimpleExportDataColumnHeaderValueObject;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.properties.reader.ReportingProperties;
import com.intellectdesign.canvas.report.exception.ReportingException;
import com.intellectdesign.canvas.report.util.ReportConstants;
import com.intellectdesign.canvas.report.vo.ReportColumnDefinition;
import com.intellectdesign.canvas.report.vo.ReportContext;
import com.intellectdesign.canvas.report.vo.ReportRequest;
import com.intellectdesign.canvas.report.vo.ReportResponse;

/**
 * Represents the default implementation class of the IReportEngineAdaptor. This class uses the existing reporting
 * engine of the CBX which uses poi for generating excel and FOP for generating pdf reports.
 * 
 * 
 * @version 1.0
 */

public class DefaultReportEngineAdaptor implements IReportEngineAdaptor
{

	/***
	 * Populates the data to be sent to the report engine into a format/ object that can be consumed directly by the CBX
	 * report engine framework. The report engine expects the data to be of the type IExportDataValueObject.This method
	 * will process the ReportRequest and the dataItems passsed as paramater and populates into an object of the type
	 * IExportDataValueObject.In short performs the following actions : 1. sets the column header into the object of the
	 * type IExportDataValueObject. 2. sets the report data into the object of the type IExportDataValueObject. 3. sets
	 * the report id into the object of the type IExportDataValueObject. 4. sets the additonal data into the object of
	 * the type IExportDataValueObject.(This is not mandatory). 5. sets the first name of the user into the object of
	 * the type userValue. 6. sets the user no into the object of the type userValue. 7. sets the primary corporate name
	 * into the object of the type userValue. 8. sets the language id into the object of the type userValue. 9. sets the
	 * amount format into the object of the type userValue. 10. sets the direction into the object of the type
	 * userValue.(For RTL support). the final goal of this method is to create and populate data for the objects of the
	 * types IExportDataValueObject and UserValue, which the report engine expects to generate the report.
	 * 
	 * @param reportRequest an instance of the ReportRequest type.
	 * @param dataItems the data from the data aggregator.
	 * @throws ReportingException for any exception that will be thrown.
	 */
	public List processBeforeGenerateReport(ReportRequest reportRequest, List dataItems) throws ReportingException
	{
		logger.ctinfo("CTREP00106");
		IExportDataValueObject exportDataValueObject = null;
		UserValue userValue = null;
		List processedReq = new ArrayList();
		try
		{ // populates the exportDataValueObject
			exportDataValueObject = populateExportDataValueObject(reportRequest, dataItems);
			logger.ctdebug("CTREP00107", exportDataValueObject);
			// populates the userValue
			userValue = populateUserValue(reportRequest);
			logger.ctdebug("CTREP00108", userValue);
		} catch (ReportingException reportingException)
		{
			logger.cterror("CTREP00109", reportingException);
			throw reportingException;
		}
		processedReq.add(exportDataValueObject);
		processedReq.add(userValue);
		logger.ctinfo("CTREP00110");
		return processedReq;
	}

	/***
	 * Method that will make a request to the reporting engine to actually generate the report.This method has three
	 * main steps : 1. form a data object from the Report request and the List data, in such a manner that the report
	 * engine can consume it directly for generating the report. 2. Send a request to the CBX report engine to generate
	 * the report. This will return the path of the report generated.3. Finally updates the ReportResponse object that
	 * needs to be sent back to the calling method.
	 * 
	 * @param reportRequest an instance of the ReportRequest type.
	 * @param dataItems the data from the data aggregator.
	 * @return ReportResponse instance of the type ReportResponse.
	 * @throws ReportingException for any exception thrown.
	 */
	public ReportResponse generateReport(ReportRequest reportRequest, List dataItems) throws ReportingException
	{
		logger.ctinfo("CTREP00111");
		ReportResponse response = new ReportResponse();
		IExportFormatProvider exportFormatProvider = null;
		IExportDataValueObject exportDataValueObject = null;
		UserValue userValue = null;
		List processedList = null;
		String filePath = null;

		try
		{
			logger.ctdebug("CTREP00112");
			processedList = processBeforeGenerateReport(reportRequest, dataItems);
			exportDataValueObject = (IExportDataValueObject) processedList.get(0);
			userValue = (UserValue) processedList.get(1);
			exportFormatProvider = ExportFormatFactory.getFormatProvider(reportRequest.getFormatId());
			// Get the path of the generated file. filePath is the location
			// where the report engine will
			// placed the generated report.
			HashMap TmpColMapData= new HashMap();
			TmpColMapData.put("MODIFIED_COLUMN_NAMES", new HashMap());
			exportDataValueObject.addExportAdditionalData(TmpColMapData);
			filePath = exportFormatProvider.getExportFormat(exportDataValueObject, userValue);
			HashMap responseDataMap = new HashMap();
			responseDataMap.put(ReportConstants.REPORT_REF_LOCATION, filePath);
			responseDataMap.put(ReportConstants.OD_GCIF, reportRequest.getGcif());
			responseDataMap.put(ReportConstants.OD_USER_NO, reportRequest.getUserNo());
			responseDataMap.put(ReportConstants.FORMAT_ID, reportRequest.getFormatId());
			responseDataMap.put(PreferenceConstants.LANGUAGE_ID, userValue.getLangId());
			logger.ctdebug("CTREP00113", responseDataMap);

			// populating data into the ReportResponse object.
			response.setReportInstanceId(reportRequest.getReportInstanceId());
			response.setReportName(reportRequest.getReportName());
			response.setStatus(ReportConstants.STATUS_SUCCESS);
			response.setReportName(reportRequest.getReportName());
			response.setReportInstanceId(reportRequest.getReportInstanceId());

			response.setResponseObject(responseDataMap);
		} catch (ReportingException reportingException)
		{
			logger.cterror("CTREP00057", reportingException);
			response.setStatus(ReportConstants.STATUS_FAILURE);
			response.setErrorCode(reportingException.getErrorCode());
			response.setErrorMsg(reportingException.getErrorMessage());
			throw reportingException;

		} catch (ExportDataException exportDataException)
		{
			logger.cterror("CTREP00057", exportDataException);
			response.setStatus(ReportConstants.STATUS_FAILURE);
			response.setErrorCode(ReportConstants.REPORT_ERR_CBX_EXP_DATA_RPT_ENG);
			response.setErrorMsg(ReportingProperties.getProperty(ReportConstants.REPORT_ERR_CBX_EXP_DATA_RPT_ENG));
			throw new ReportingException(ReportConstants.ERR_CD_DEF_ADAPTOR_GENREP_EXP_DATA_EXC, exportDataException);

		} catch (Exception exception)
		{
			logger.cterror("CTREP00057", exception);
			response.setStatus(ReportConstants.STATUS_FAILURE);
			response.setErrorCode(ReportConstants.REPORT_ERR_GEN_EXEC_RPT_ENG);
			response.setErrorMsg(ReportingProperties.getProperty(ReportConstants.REPORT_ERR_GEN_EXEC_RPT_ENG));
			throw new ReportingException(ReportConstants.ERR_CD_DEF_ADAPTOR_GEN_REPORT, exception);
		}

		logger.ctinfo("CTREP00114");
		return response;

	}

	/***
	 * Populates the UserValue object with data that is required by the reporting engine. UserNo and language id are
	 * compulsory data hence null check is performed and throws exception if they are found to be empty or null.
	 * 
	 * @param reportRequest Object of the type ReportRequest.
	 * @return object of the type UserValue.
	 * @throws ReportingException for any exception caught.
	 */
	private UserValue populateUserValue(ReportRequest reportRequest) throws ReportingException
	{
		logger.ctinfo("CTREP00115");
		UserValue userValue = new UserValue();
		String userName = reportRequest.getReportContext().getUserName();
		String userNo = reportRequest.getUserNo();
		String languageId = null;
		String amtFormat = null;
		String direction = "";
		String exportReportFormat = null;
		String requestId = null;
		String primaryCorporate = null;
		try
		{
			// getting the user preference data using the ReportUtil class.
			ReportContext reportContext = reportRequest.getReportContext();

			primaryCorporate = "";
			Map userPrefDataMap = (Map) reportContext.getAttribute(ReportConstants.USER_PREFERENCE);
			amtFormat = (String) userPrefDataMap.get(PreferenceConstants.AMOUNT_FORMAT);
			languageId = (String) userPrefDataMap.get(PreferenceConstants.LANGUAGE_FORMAT);
			direction = (String) userPrefDataMap.get(PreferenceConstants.DIRECTION_FORMAT);

			exportReportFormat = reportRequest.getFormatId();
			requestId = reportRequest.getReportInstanceId();

			// user number, exportReportFormat and language id are compulsory,
			// hence if they
			// are not available, throwing reporting exception.
			logger.ctdebug("CTREP00116", amtFormat, languageId, exportReportFormat);
			if (null == userNo || "".equals(userNo))
			{
				logger.cterror("CTREP00117");
				throw new ReportingException(ReportConstants.REPORT_USER_NO_NULL_EXPDATA_RPT_ENG,
						ReportingProperties.getProperty(ReportConstants.REPORT_USER_NO_NULL_EXPDATA_RPT_ENG));
			} else if (null == languageId || "".equals(languageId))
			{
				logger.cterror("CTREP00118");
				throw new ReportingException(ReportConstants.REPORT_ERR_LAN_ID_NULL_RPT_ENG,
						ReportingProperties.getProperty(ReportConstants.REPORT_ERR_LAN_ID_NULL_RPT_ENG));
			} else if (null == exportReportFormat || "".equals(exportReportFormat))
			{
				logger.cterror("CTREP00119");
				throw new ReportingException(ReportConstants.REPORT_ERR_CBX_EXP_FORMAT_NULL_RPT_ENG,
						ReportingProperties.getProperty(ReportConstants.REPORT_ERR_CBX_EXP_FORMAT_NULL_RPT_ENG));
			}

			userValue.setFIRST_NAME(userName);
			userValue.setUserNo(userNo);
			userValue.setPrimaryCorporate(primaryCorporate);
			userValue.setLangId(languageId);
			userValue.setmAmtFormat(amtFormat);
			userValue.setDirection(direction);
			userValue.setExportReportFormat(exportReportFormat);
			userValue.setRequestID(requestId);
			userValue.setDateId((String) userPrefDataMap.get("DATEFORMAT"));
			userValue.setTimeFormat((String) userPrefDataMap.get("TIMEFORMAT"));
			userValue.setTimeZoneId((String) userPrefDataMap.get("TIMEZONE"));
		} catch (Exception exception)
		{
			logger.cterror("CTREP00120", exception);
			throw new ReportingException(ReportConstants.REPORT_ERR_POP_USERDATA_RPT_ENG,
					ReportingProperties.getProperty(ReportConstants.REPORT_ERR_POP_USERDATA_RPT_ENG), exception);
		}
		logger.ctinfo("CTREP00121");
		return userValue;
	}

	/***
	 * This method poplulates the report data into an object of the type SimpleExportDataValueObject.This is the format
	 * that the CBX report engine expects.Hence forming a dataobject of type SimpleExportDataValueObject is compulsory
	 * to sent the report data to the engine.This methods performs the following task: 1. populates the column header
	 * data in the SimpleExportDataValueObject object. 2. populates the report data into the SimpleExportDataValueObject
	 * object and . 3. sets the report id into the SimpleExportDataValueObject object.
	 * 
	 * @param reportRequest Object of the type ReportRequest.
	 * @param dataItems the data returned by the data aggregator.
	 * @return Object of the type IExportDataValueObject.
	 * @throws ReportingException for any exception caught.
	 */
	private IExportDataValueObject populateExportDataValueObject(ReportRequest reportRequest, List dataItems)
			throws ReportingException
	{
		logger.ctinfo("CTREP00122");
		IExportDataValueObject exportDataValueObject = new InfoRptExportDataVO();
		// 1. populating the column header data.
		SimpleExportDataColumnHeaderValueObject colHeader = null;
		ReportColumnDefinition reportColmun = null;
		HashMap dataMap = null;
		List dataList = null;
		HashMap displayMap = null;
		List discardColumns = new ArrayList();
		try
		{
			List<ReportColumnDefinition> columnList = reportRequest.getReportContext().getReportInstanceDefinition()
					.getSelectedColumns();
			for (Iterator itr = columnList.iterator(); itr.hasNext();)
			{
				reportColmun = (ReportColumnDefinition) itr.next();

				if ("0".equals(reportColmun.getVisibilityInd()))
				{
					discardColumns.add(reportColmun.getColumnId());
				} else
				{
					colHeader = new SimpleExportDataColumnHeaderValueObject(reportColmun.getColumnId(),
							reportColmun.getColumnName(), reportColmun.getDataType());
					exportDataValueObject.addColumnHeader(colHeader);
				}

			}
			logger.ctdebug("CTREP00123", exportDataValueObject.getColumnHeaders());
			// 2. populating the report data.
			String colId = null;
			Iterator dataItemsItr = dataItems.iterator();
			while (dataItemsItr.hasNext())
			{
				dataList = (ArrayList) dataItemsItr.next();
				dataMap = new HashMap();
				Set keySet = null;
				for (Iterator dataListItr = dataList.iterator(); dataListItr.hasNext();)
				{
					dataMap = (HashMap) dataListItr.next();
					keySet = dataMap.keySet();
					Iterator keySetItr = keySet.iterator();
					displayMap = new HashMap();
					while (keySetItr.hasNext())
					{
						colId = (String) keySetItr.next();

						if (!discardColumns.contains(colId))
						{
							displayMap.put(colId, dataMap.get(colId));
						}

					}
					exportDataValueObject.addExportData(displayMap);
				}
			}
			logger.ctdebug("CTREP00123", exportDataValueObject.getExportData());

			exportDataValueObject.setReportId(reportRequest.getReportName());
			exportDataValueObject.setBundleKey(reportRequest.getBundleKey());
			logger.ctdebug("CTREP00124", reportRequest.getReportName());
		} catch (Exception exception)
		{
			logger.cterror("CTREP00125", exception);
			throw new ReportingException(ReportConstants.REPORT_ERR_POP_EXPDATA_RPT_ENG,
					ReportingProperties.getProperty(ReportConstants.REPORT_ERR_POP_EXPDATA_RPT_ENG), exception);
		}
		logger.ctdebug("CTREP00126");
		return exportDataValueObject;
	}

	// instatiating logger object

	private Logger logger = Logger.getLogger(DefaultReportEngineAdaptor.class);
}
