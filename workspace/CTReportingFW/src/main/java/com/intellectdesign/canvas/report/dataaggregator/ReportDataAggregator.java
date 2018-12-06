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

package com.intellectdesign.canvas.report.dataaggregator;

/**
 * This class that will perform the following:
 * 1. Gets the report data from different data sources based on the Report request made.
 * 2. Aggregates the report data
 * 3. formats the date/amount data into the user preference specified format. Also performs the currency
 * conversion from a source currency to an equivalent currency.
 * 4. Massage the report data into a format in such a manner that the data can be consumed
 * by the report engine for generate the report. Also provide api that needs to be implemented
 * by the extending sub class.
 * 
 */

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.MissingResourceException;
import java.util.ResourceBundle;
import java.util.Set;

import com.intellectdesign.canvas.constants.preferences.PreferenceConstants;
import com.intellectdesign.canvas.entitlement.DataEntitlements;
import com.intellectdesign.canvas.entitlement.EntitlementsHelper;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.pref.amount.AmountFormatterManager;
import com.intellectdesign.canvas.report.datasource.IReportDataSource;
import com.intellectdesign.canvas.report.exception.ReportingException;
import com.intellectdesign.canvas.report.util.ReportConstants;
import com.intellectdesign.canvas.report.util.ReportUtil;
import com.intellectdesign.canvas.report.vo.ReportColumnDefinition;
import com.intellectdesign.canvas.report.vo.ReportContext;
import com.intellectdesign.canvas.report.vo.ReportDataSourceVO;
import com.intellectdesign.canvas.report.vo.ReportRequest;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionConstants;

/**
 * This is an abstract class ReportDataAggregator implements IReportDataAggregator
 * 
 * @version 1.0
 */
public abstract class ReportDataAggregator implements IReportDataAggregator
{
	/***
	 * 
	 * This api returns the messaged data from the report data sources. This method performs the following tasks: 1. get
	 * all the data sources for the report request. 2.get the entitlment criteria . 3.if the report have multiple data
	 * sources, then iterate through the data sources and perfrom: get data from the data source and aggregate data. 4.
	 * if the report refers data from a single data source, just get the data. 5. perform date format, amount format
	 * conversion based on the user preference, also perform the currency conversion from the source currency into the
	 * equivalent currency specified, 5. finally massage the data. Aggregate of data and the massage of data are
	 * expected to be performed by the implementation class.
	 * 
	 * @param reportRequest object of the ReportRequet class.
	 * @return List of massage data.
	 * @throws ReportingException for any exception caught.
	 */
	public List getData(ReportRequest reportRequest) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00036");
		List dataList = null;
		List dataItems = null;
		List entlCriteria = null;
		List aggregatedDataItems = new ArrayList();
		IReportDataSource dataSource = null;
		List returnedFormattedData = null;
		ReportContext reportContext = reportRequest.getReportContext();
		ReportDataSourceVO reportDataSrcVO = null;
		try
		{
			if (reportContext != null)
			{
				String entitlementType = reportContext.getEntlType();
				LOGGER.ctdebug("CTREP00037", entitlementType);
				// getting the entitlement criteria.
				entlCriteria = fetchEntitlementCriteria(entitlementType, reportRequest.getUserNo(),
						reportRequest.getGcif(), reportRequest);
				LOGGER.ctdebug("CTREP00570", entlCriteria);
				List<ReportDataSourceVO> dsList = reportContext.getDataSources();
				// for reports with multiple data sources.
				if (dsList.size() > 1)
				{
					for (ReportDataSourceVO reportDataSourceVO : dsList)
					{
						dataSource = reportDataSourceVO.getReportDataSourceImpl();
						dataItems = dataSource.getData(reportRequest, entlCriteria);
						LOGGER.ctdebug("CTREP00038", dataItems);
						// let the implementation class perform the task of aggregating data.
						aggregateData(aggregatedDataItems, dataSource, dataItems);
						LOGGER.ctdebug("CTREP00039", aggregatedDataItems);
					}
					// for report with single data source.
				} else if (dsList.size() == 1)
				{

					reportDataSrcVO = dsList.get(0);
					dataSource = reportDataSrcVO.getReportDataSourceImpl();
					dataItems = dataSource.getData(reportRequest, entlCriteria);
					LOGGER.ctdebug("CTREP00038", dataItems);
					aggregatedDataItems.add(dataItems);
				}
				if (!aggregatedDataItems.isEmpty())
				{
					// let the implementation class perform the massage of data.
					dataList = massageData(aggregatedDataItems, reportRequest);
					// call the api to format the date, amounts and also perform currency conversion.
					returnedFormattedData = formatMassagedData(reportRequest, dataList);
					LOGGER.ctdebug("CTREP00571", returnedFormattedData);
				}
			}
		} catch (ReportingException reportingException)
		{
			LOGGER.cterror("CTREP00040", reportingException);
			throw reportingException;
		}
		if (returnedFormattedData == null)
		{
			returnedFormattedData = Collections.EMPTY_LIST;
			LOGGER.ctdebug("CTREP00042");
		}
		LOGGER.ctinfo("CTREP00041");
		return returnedFormattedData;
	}

	/**
	 * This api accumulates the report data from a single data sources or multiple sources (if the report data needs to
	 * be retrived from maultiple data sources)into a HashMap. This hashmap have the data source name as the Key and the
	 * data from the data source as the value of the HashMap in which the data are populated.
	 * 
	 * @param aggregatedDataItems the HashMap data where the aggregated data items is to be accumulated.
	 * @param dataSource the data source from where the data is going to be retrieved, this will be the key name of the
	 *            HashMap.
	 * @param dataItems the data to be added to the aggregatedDataItems map, this will be the value of the HashMap.
	 */
	public abstract void aggregateData(List aggregatedDataItems, IReportDataSource dataSource, List dataItems);

	/**
	 * This api must be implemented in the implementation class. Reporting framework does not have any control on the
	 * nature of the massaging of data. Hence implementation class is expected to perform the task of data massage.
	 * 
	 * @param aggregatedDataItems the final aggregated data from data sources/ sources.
	 * @param reportRequest the object of the type ReportReport class.
	 * @return List of massaged data.
	 * @throws ReportingException for any exception caught.
	 */
	public abstract List massageData(List aggregatedDataItems, ReportRequest reportRequest) throws ReportingException;

	/**
	 * This method will return the entitlement criteria for the report.
	 * 
	 * @param entitlementType : the type of entitlement.
	 * @param userNo : the user number of the logged user.
	 * @param gcif : gcif number of the user.
	 * @param reportRequest : instance of the ReportRequest.
	 * @return Map of entitlement criteria.
	 * @throws ReportingException for any exception caught.
	 */
	private List fetchEntitlementCriteria(String entitlementType, String userNo, String gcif,
			ReportRequest reportRequest) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00043");
		EntitlementsHelper entlHelper = new EntitlementsHelper();
		List entlCriteria = null;
		try
		{
			DataEntitlements entlData = entlHelper.getUserDataEntitlements(reportRequest.getProductCode(),
					reportRequest.getSubProductCode(), reportRequest.getFuncCode(), gcif, userNo);
			if (entlData.isEntitled())
			{
				entlCriteria = entlData.getEntitlements();
			}
		} catch (Exception exception)
		{
			LOGGER.cterror("CTREP00044", gcif, userNo, reportRequest.getProductCode(),
					reportRequest.getSubProductCode(), reportRequest.getFuncCode(), exception);
			throw new ReportingException(ReportConstants.ERR_CD_DATA_AGGR_ENTL, exception);
		}
		LOGGER.ctinfo("CTREP00045");
		if (entlCriteria == null)
		{
			entlCriteria = Collections.EMPTY_LIST;
		}
		return entlCriteria;
	}

	/**
	 * This private api will perform the following: 1. converts the date format into the format specified for the user
	 * in the user preference. 2. converts the amount format into the format specified for the user in the user
	 * preference. 3. Performs currency conversion from the base currency into the equivalent currency as specified in
	 * the report request.
	 * 
	 * @param aggregatedDataItems the aggregated report data item.
	 */
	private List formatMassagedData(ReportRequest reportRequestList, List massagedData) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00046");

		List formattedMassagedData = null;
		try
		{
			formattedMassagedData = getformatedMassagedData(reportRequestList, massagedData);
		} catch (Exception exception)
		{
			LOGGER.cterror("CTREP00047", exception);
			throw new ReportingException(ReportConstants.ERR_CD_DATA_AGGR_FORMAT_DATA, exception);

		}
		LOGGER.ctdebug("CTREP00048", formattedMassagedData);
		LOGGER.ctinfo("CTREP00049");
		return formattedMassagedData;

	}

	/***
	 * Helper method that will perform the following in the massaged report data.
	 * 
	 * @param reportReq Instance of the report .
	 * @param massagedData List of massaged data.
	 * @return List of foramtted massaged data.
	 * @throws ReportingException for any exception caught.
	 */
	private List getformatedMassagedData(ReportRequest reportReq, List massagedData) throws ReportingException
	{

		LOGGER.ctinfo("CTREP00050");
		List formattedDataList = null;
		try
		{

			ReportContext reportContext = reportReq.getReportContext();
			// getting the user preference data .
			Map userPrefs = (Map) reportContext.getAttribute(ReportConstants.USER_PREFERENCE);
			String userPrefAmtFormat = getUserPreferenceAmountFormat(userPrefs);
			String userPrefDateFormat = getUserPreferenceDate(userPrefs);
			String userPrefRateCard = reportReq.getRateCard();
			String refCurr = reportReq.getReferenceCcy();

			/*if (userPrefRateCard == null || userPrefRateCard.trim().length() == 0)
			{
				userPrefRateCard = getUserPreferenceRateCard(userPrefs);
			}

			if (refCurr == null || refCurr.trim().length() == 0)
			{
				refCurr = getReferenceCurrency(userPrefs);
				reportReq.setReferenceCcy(refCurr);
			}*/

			LOGGER.ctdebug("CTREP00051", userPrefAmtFormat, userPrefDateFormat, userPrefRateCard, refCurr);

			// performing the currency comversion
		//	formattedDataList = convertToEquiValentCurrency(reportReq, massagedData, userPrefRateCard);
			// perform date formatting
			//formattedDataList = performDateFormatting(reportReq, formattedDataList, userPrefDateFormat);
			formattedDataList = performDateFormatting(reportReq, massagedData, userPrefDateFormat);
			// perform amount formatting
			formattedDataList = performAmountFormatting(reportReq, formattedDataList, userPrefAmtFormat);
			LOGGER.ctdebug("CTREP00052", formattedDataList);
		} catch (ReportingException exception)
		{
			LOGGER.cterror("CTREP00053", exception);
			throw exception;
		}
		LOGGER.ctinfo("CTREP00054");
		return formattedDataList;
	}

	/***
	 * Helper method to get the reference currency. It is not found in the user preference data, then fetch the default
	 * currency from the Orbionedirect.properties file.
	 * 
	 * @param userPrefs the user preference data.
	 * @return String reference currency.
	 */
	private String getReferenceCurrency(Map userPrefs) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00055");
		String referenceCurrency = null;
		try
		{
			if (userPrefs != null)
			{
				referenceCurrency = (String) userPrefs.get(PreferenceConstants.EQUIVALENT_CUR_PREF);
			}
			if (referenceCurrency == null || referenceCurrency.trim().length() == 0)
			{
				// get the default default date format.It is expected that the default date format is available in
				// the
				// Orbionedirect property file.
				ResourceBundle bundle = ResourceBundle.getBundle("orbionedirect");
				referenceCurrency = bundle.getString(ReportConstants.DEFAULT_CURR);
			}
			LOGGER.ctdebug("CTREP00056", referenceCurrency);
		} catch (Exception exception)
		{
			LOGGER.cterror("CTREP00057", exception);
			throw new ReportingException(ReportConstants.ERR_CD_DATA_AGGR_GET_REF_CURR, exception);
		}
		LOGGER.ctinfo("CTREP00058");
		return referenceCurrency;
	}

	/**
	 * Helper method to get the user preference rate card from the, if the rate card is not avaialable in the user
	 * preference data, it fetches from the default one from the orbionedirect.properties.
	 * 
	 * @param userPrefs user preference data.
	 * @return String user preference rate card.
	 */
	private String getUserPreferenceRateCard(Map userPrefs) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00059");
		String userPrefRateCard = null;
		try
		{
			if (userPrefs != null)
			{
				userPrefRateCard = (String) userPrefs.get(PreferenceConstants.RATECARD_PREF);
			}

			if (userPrefRateCard == null || userPrefRateCard.trim().length() == 0)
			{
				// get the default default rate card.It is expected that the default rate card is available in
				// the
				// Orbionedirect property file.
				ResourceBundle bundle = ResourceBundle.getBundle("orbionedirect");
				userPrefRateCard = bundle.getString(ReportConstants.DEFAULT_RATE_CARD);
			}
			LOGGER.ctdebug("CTREP00060", userPrefRateCard);
		} catch (Exception exception)
		{
			LOGGER.cterror("CTREP00057", exception);
			throw new ReportingException(ReportConstants.ERR_CD_DATA_AGGR_GET_PREF_RATE_CRD, exception);
		}

		LOGGER.ctinfo("CTREP00061");
		return userPrefRateCard;
	}

	/***
	 * Helper method to get the user preference date format. If the date format is not avaialable in the user preference
	 * data, it takes the default date format from the orbionedirect. properties file.
	 * 
	 * @param userPrefs the user preference data.
	 * @return String user preference date format.
	 */
	private String getUserPreferenceDate(Map userPrefs) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00062");
		String userPrefDateFormat = null;
		try
		{
			if (userPrefs != null)
			{
				userPrefDateFormat = (String) userPrefs.get(PreferenceConstants.DATE_FORMAT);
			}
			/*if (userPrefDateFormat == null || userPrefDateFormat.trim().length() == 0)
			{
				// get the default default date format.It is expected that the default date format is available in the
				// Orbionedirect property file.
				ResourceBundle bundle = ResourceBundle.getBundle(ReportConstants.ORBIONEDIRECT);
				userPrefDateFormat = bundle.getString(ReportConstants.DEFAULT_DATE_FORMAT);
				// if not available in property file, then get from the preferenceConstant.java file.
				if (userPrefDateFormat == null || userPrefDateFormat.trim().length() == 0)
				{
					userPrefDateFormat = PreferenceConstants.DEFAULT_DATE_FORMAT;
				}
			}*/
			LOGGER.ctdebug("CTREP00063", userPrefDateFormat);
		} catch (Exception exception)
		{
			LOGGER.cterror("CTREP00057", exception);
			throw new ReportingException(ReportConstants.ERR_CD_DATA_AGGR_GET_PREF_DATE, exception);
		}
		LOGGER.ctinfo("CTREP00064");
		return userPrefDateFormat;
	}

	/***
	 * Helper methdod to get the userPrefAmtFormat.If the amount format is not avaialable in the user preference data,
	 * then it takes the default amount format from the orbionedirect. properties file.
	 * 
	 * @param userPrefs User preference data.
	 * @return String userPrefAmtFormat.
	 */
	private String getUserPreferenceAmountFormat(Map userPrefs) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00065");
		String userPrefAmtFormat = null;
		try
		{
			if (userPrefs != null)
			{
				userPrefAmtFormat = (String) userPrefs.get(PreferenceConstants.AMOUNT_FORMAT);
			}
			/*if (userPrefAmtFormat == null || userPrefAmtFormat.trim().length() == 0)
			{
				// get the default userPrefAmtFormat.It is expected that the default amount format is available in
				// the
				// Orbionedirect property file.

				try
				{
					ResourceBundle bundle = ResourceBundle.getBundle("orbionedirect");
					userPrefAmtFormat = bundle.getString(ReportConstants.DEFAULT_AMOUNT_FORMAT);
				} catch (MissingResourceException exception)
				{
					userPrefAmtFormat = PreferenceConstants.DEFAULT_AMOUNT_FORMAT;
				}

			}*/
			LOGGER.ctdebug("CTREP00066", userPrefAmtFormat);
		} catch (Exception exception)
		{
			LOGGER.cterror("CTREP00057", exception);
			throw new ReportingException(ReportConstants.ERR_CD_DATA_AGGR_GET_PREF_AMT_FMT, exception);
		}
		LOGGER.ctinfo("CTREP00067");
		return userPrefAmtFormat;
	}

	/***
	 * private function that will perform amount formatting to a gievn format.
	 * 
	 * @param reportReq instance of the report request.
	 * @param massagedData the massaged aggregated data of type list.
	 * @param userPrefAmtFormat the user preference amount format.
	 * @return List of formatted data.
	 */
	private List performAmountFormatting(ReportRequest reportReq, List massagedData, String userPrefAmtFormat)
			throws ReportingException
	{
		LOGGER.ctinfo("CTREP00068");
		List colList = reportReq.getReportContext().getReportInstanceDefinition().getSelectedColumns();
		HashMap formattedData = null;
		ReportColumnDefinition colDef = null;
		String amtColumnId = null;
		List<String> amtColList = new ArrayList<String>();
		List formattedReportDataList = null;
		String formattedAmt = null;
		BigDecimal amtToformat = null;
		HashMap rowDataMap = null;
		Set keySet = null;
		String key = null;
		List massagedataList = null;
		List formattedRowData = null;

		// populating a list that contains all columns with float data type.
		try
		{
			for (Iterator itr = colList.iterator(); itr.hasNext();)
			{
				colDef = (ReportColumnDefinition) itr.next();
				if (ReportConstants.AMT_DATA_TPYE.equals(colDef.getDataType())
						|| ReportConstants.EQU_AMT_TPYE.equals(colDef.getDataType()))
				{
					amtColumnId = colDef.getColumnId();
					amtColList.add(amtColumnId);
				}
				LOGGER.ctdebug("CTREP00069", amtColList);
			}

			Iterator massagedDataItr = massagedData.iterator();
			formattedReportDataList = new ArrayList();
			while (massagedDataItr.hasNext())
			{
				massagedataList = (ArrayList) massagedDataItr.next();
				formattedRowData = new ArrayList();
				for (Iterator formattedDataListItr = massagedataList.iterator(); formattedDataListItr.hasNext();)
				{
					rowDataMap = (HashMap) formattedDataListItr.next();
					keySet = rowDataMap.keySet();
					formattedData = new HashMap();
					for (Iterator keyItr = keySet.iterator(); keyItr.hasNext();)
					{
						key = (String) keyItr.next();
						if (amtColList.contains(key))
						{
							amtToformat = new BigDecimal(Float.toString((Float) rowDataMap.get(key)));
							formattedAmt = AmountFormatterManager.convertAmountTo(amtToformat, userPrefAmtFormat,
									ReportConstants.MIN_FRACTION_DIGIT, ReportConstants.MAX_FRACTION_DIGIT);
							formattedData.put(key, formattedAmt);
						} else
						{
							formattedData.put(key, rowDataMap.get(key));
						}
					}
					formattedRowData.add(formattedData);
				}
				formattedReportDataList.add(formattedRowData);
			}

		} catch (Exception exception)
		{
			LOGGER.cterror("CTREP00070", exception);
			throw new ReportingException(ReportConstants.REPORT_ERR_AMT_FORMATTING_AGGR_DATA, exception);

		}
		LOGGER.ctdebug("CTREP00071", formattedReportDataList);
		LOGGER.ctinfo("CTREP00072");
		return formattedReportDataList;
	}

	/**
	 * private method to perform date formatting.
	 * 
	 * @param massagedData the massaged aggregated report data.
	 * @param dateFormat the user preference date format.
	 * @return List of formatted report data.
	 */
	private List performDateFormatting(ReportRequest reportReq, List massagedData, String dateFormat)
			throws ReportingException
	{
		LOGGER.ctinfo("CTREP00073");
		List colList = reportReq.getReportContext().getReportInstanceDefinition().getSelectedColumns();
		HashMap formattedData = null;
		List formattedDataList = null;
		ReportColumnDefinition colDef = null;
		String dateColumnId = null;
		List formattedReportDataList = null;
		List<String> dateColList = new ArrayList<String>();
		List dataMap = null;
		String formattedDate = null;
		Set mapKey = null;
		String nextDateField = null;
		HashMap rowData = null;
		List reportdata = null;
		try
		{ // populating a list that contains all columns with date data type.
			for (Iterator itr = colList.iterator(); itr.hasNext();)
			{
				colDef = (ReportColumnDefinition) itr.next();
				if (ReportConstants.DATE_DATA_TPYE.equals(colDef.getDataType()))
				{
					dateColumnId = colDef.getColumnId();
					dateColList.add(dateColumnId);
				}
				LOGGER.ctdebug("CTREP00069", dateColList);
			}
			Iterator massagedDataItr = massagedData.iterator();
			while (massagedDataItr.hasNext())
			{
				dataMap = (ArrayList) massagedDataItr.next();
				// formattedData = new HashMap();
				Iterator it = dataMap.iterator();
				formattedReportDataList = new ArrayList();
				while (it.hasNext())
				{
					formattedDataList = new ArrayList();
					reportdata = (ArrayList) it.next();
					for (Iterator itr = reportdata.iterator(); itr.hasNext();)
					{
						rowData = (HashMap) itr.next();
						mapKey = rowData.keySet();
						formattedData = new HashMap();
						for (Iterator keyitr = mapKey.iterator(); keyitr.hasNext();)
						{
							nextDateField = (String) keyitr.next();
							if (dateColList.contains(nextDateField))
							{
								formattedDate = convertDate(dateFormat, (String) rowData.get(nextDateField));
								formattedData.put(nextDateField, formattedDate);
							} else
							{
								formattedData.put(nextDateField, rowData.get(nextDateField));
							}
						}
						formattedDataList.add(formattedData);
					}
					formattedReportDataList.add(formattedDataList);
				}
			}
		} catch (Exception exception)
		{
			LOGGER.cterror("CTREP00074", exception);
			throw new ReportingException(ReportConstants.REPORT_ERR_DATE_FORMATTING_AGGR_DATA, exception);
		}
		LOGGER.ctinfo("CTREP00075");
		return formattedReportDataList;
	}

	/***
	 * private method to perform currecy conversion from a base currency to an equivalent currency.
	 * 
	 * @param reportReq represents the report request.
	 * @param massagedData the aggregated massaged report data.
	 * @return List of data after the currency conversion.
	 * @throws ReportingException Thrown if any error occurs during currency conversion
	 */
	private List convertToEquiValentCurrency(ReportRequest reportReq, List massagedData, String userPrefRateCard)
			throws ReportingException
	{
		return massagedData;

	}

	/**
	 * helper method to conver a date into a format specified as parameter. It the incoming date format is not available
	 * then return the date as it is.
	 * 
	 * @param inComingDateformat the date format on which the date is to be converted.
	 * @param date the date object to be formatted.
	 * @return String formatted date.
	 */
	private String convertDate(String inComingDateformat, String date) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00076");
		String returnDate = "";
		try
		{
			if (date != null && !date.trim().equals(""))
			{
				if (ReportUtil.isNotEmpty(inComingDateformat))
				{
					SimpleDateFormat sdf = new SimpleDateFormat(ViewDefinitionConstants.DATE_FORMAT);
					Date parsedDate = sdf.parse(date);
					SimpleDateFormat standardsdf = new SimpleDateFormat(inComingDateformat);
					returnDate = standardsdf.format(parsedDate);
				} else
				{
					returnDate = date;
					LOGGER.ctdebug("CTREP00077", date);
				}
			} else
			{
				LOGGER.ctdebug("CTREP00078");
			}
		} catch (ParseException pe)
		{
			returnDate = date;
			LOGGER.cterror("CTREP00079", date, inComingDateformat);
			throw new ReportingException(ReportConstants.ERR_CD_DATA_AGGR_DATE_CONV, pe);
		}
		LOGGER.ctinfo("CTREP00080");
		return returnDate;
	}

	/***
	 * Logger to be used inside the class.
	 */
	private static Logger LOGGER = Logger.getLogger(ReportDataAggregator.class);

}
