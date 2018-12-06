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

package com.intellectdesign.canvas.report.form.data.support;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;

import com.intellectdesign.canvas.cache.handler.CacheManager;
import com.intellectdesign.canvas.formdefinition.FormDefinitionException;
import com.intellectdesign.canvas.formdefinition.FormItemDefinition;
import com.intellectdesign.canvas.formdefinition.addinfo.AdditionalDataCodeValue;
import com.intellectdesign.canvas.formdefinition.addinfo.IAdditionalDataSupport;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.preference.GlobalPreferencesUtil;
import com.intellectdesign.canvas.ratecard.IRateCard;
import com.intellectdesign.canvas.report.ReportManager;
import com.intellectdesign.canvas.report.exception.ReportingException;
import com.intellectdesign.canvas.report.instr.ReportInstruction;
import com.intellectdesign.canvas.report.util.ReportConstants;
import com.intellectdesign.canvas.report.vo.ReportColumnDefinition;
import com.intellectdesign.canvas.report.vo.ReportDefinition;
import com.intellectdesign.canvas.report.vo.ReportRequest;
import com.intellectdesign.canvas.report.vo.ReportResponse;
import com.intellectdesign.canvas.utils.ResourceBundleUtils;
import com.intellectdesign.canvas.value.IUserValue;

/**
 * Intended to load combos and item selectors with dynamic data from DB
 * 
 * @version 1.0
 */

public class ReportDefinitionSupport implements IAdditionalDataSupport
{
	/**
	 * 
	 * @param itemDefn
	 * @param userValue
	 * @param inputParams
	 * @return
	 * @throws FormDefinitionException
	 * @see com.intellectdesign.canvas.formdefinition.addinfo.IAdditionalDataSupport#getAdditionalDataFor(com.intellectdesign.canvas.formdefinition.FormItemDefinition,
	 *      com.intellectdesign.canvas.common.UserValue, java.util.HashMap)
	 */
	public final ArrayList<AdditionalDataCodeValue> getAdditionalDataFor(FormItemDefinition itemDefn,
			IUserValue userValue, HashMap inputParams) throws FormDefinitionException
	{
		logger.ctinfo("CTREP00183");
		ArrayList<AdditionalDataCodeValue> dataList = null;
		String reportId = (String) inputParams.get(ReportConstants.PARENT_REPORT_ID);
		if (reportId == null || "-1".equals(reportId))
		{
			reportId = (String) inputParams.get(ReportConstants.REPORT_ID);
		}
		if (reportId != null)
		{
			if (ReportConstants.FORM_ITEM_REPORT_SELECTED_COLS.equals(itemDefn.getItemId()))
			{
				logger.ctdebug("CTREP00184", inputParams);
				dataList = getAllColumns(inputParams, reportId,userValue.getLangId());
			} else if (ReportConstants.FORM_ITEM_REPORT_GROUP_BY_COLS.equals(itemDefn.getItemId())
					|| ReportConstants.FORM_ITEM_REPORT_SORT_BY_COLS.equals(itemDefn.getItemId())
					|| ReportConstants.FORM_ITEM_REPORT_FILTER_COLUMN.equals(itemDefn.getItemId()))
			{
				logger.ctdebug("CTREP00184", inputParams);
				dataList = getLimitedColumns(inputParams, reportId,userValue.getLangId());
			} else if (ReportConstants.FORM_ITEM_REPORT_FORMAT.equals(itemDefn.getItemId()))
			{
				dataList = getReportformat(reportId);
			} else if (ReportConstants.FORM_ITEM_REPORT_RATE_CARD.equals(itemDefn.getItemId()))
			{
				dataList = getRateCards();
			} else if (ReportConstants.FORM_ITEM_REPORT_BASE_CCY.equals(itemDefn.getItemId()))
			{
				dataList = new ArrayList<AdditionalDataCodeValue>();
				String rateCard = null;
				if (null != inputParams.get(ReportConstants.FORM_ITEM_REPORT_RATE_CARD))
				{
					rateCard = (String) inputParams.get(ReportConstants.FORM_ITEM_REPORT_RATE_CARD);
				}
				if (rateCard != null)
				{
					GlobalPreferencesUtil prefUtil = new GlobalPreferencesUtil();
					List currencies = prefUtil.getAllCurrencies(rateCard);
					String ccy = null;
					if (currencies != null)
					{
						for (Object curr : currencies)
						{
							if (curr != null)
							{
								ccy = (String) curr;
								dataList.add(new AdditionalDataCodeValue(ccy, ccy));
							}
						}
					}
				}
			}
		}
		logger.ctinfo("CTREP00185", dataList);
		return dataList;
	}

	/**
	 * Intended to get the list of column names which can be displayed in the report.
	 * 
	 * @return dataList
	 * @throws FormDefinitionException
	 */
	private final ArrayList<AdditionalDataCodeValue> getAllColumns(HashMap inputParams, String reportId,String langId)
			throws FormDefinitionException
	{
		logger.ctinfo("CTREP00186");
		ReportDefinition rptDefinition;
		ResourceBundle reportBundle=null;
		try
		{
			rptDefinition = getReportDefinition(inputParams, reportId);
		    reportBundle = ResourceBundle.getBundle(rptDefinition.getBundleKey()+"_"+langId);
		} catch (ReportingException e)
		{
			logger.cterror("CTREP00187", e);
			throw new FormDefinitionException(ReportConstants.ERR_RDS_REXP, e);
		}
		ArrayList<AdditionalDataCodeValue> dataList = new ArrayList<AdditionalDataCodeValue>();
		if (rptDefinition != null)
		{
			List<ReportColumnDefinition> reportColumns = rptDefinition.getColumns();
			for (ReportColumnDefinition reportColumnDefinition : reportColumns)
			{	
				dataList.add(new AdditionalDataCodeValue(reportColumnDefinition.getColumnId(), ResourceBundleUtils
						.getString(reportBundle, "LBL_"+reportColumnDefinition.getColumnName(),
								reportColumnDefinition.getColumnName())));
	}
		}
		logger.ctinfo("CTREP00188", dataList);
		return dataList;
	}

	/**
	 * Intended to get the list of column names which are used in sorting, grouping and filtering.
	 * 
	 * @return dataList
	 * @throws FormDefinitionException
	 */
	private final ArrayList<AdditionalDataCodeValue> getLimitedColumns(HashMap inputParams, String reportId,String langId)
			throws FormDefinitionException
	{
		logger.ctinfo("CTREP00189");
		ReportDefinition rptDefinition;
		ResourceBundle reportBundle=null;
		try
		{
			rptDefinition = getReportDefinition(inputParams, reportId);
			reportBundle = ResourceBundle.getBundle(rptDefinition.getBundleKey()+"_"+langId);
		} catch (ReportingException e)
		{
			logger.cterror("CTREP00190", e);
			throw new FormDefinitionException(ReportConstants.ERR_RDS_REXP, e);
		}
		ArrayList<AdditionalDataCodeValue> dataList = new ArrayList<AdditionalDataCodeValue>();
		if (rptDefinition != null)
		{
			List<ReportColumnDefinition> reportColumns = rptDefinition.getColumns();
			for (ReportColumnDefinition reportColumnDefinition : reportColumns)
			{
				if (!ReportConstants.EQU_AMT_TPYE.equals(reportColumnDefinition.getDataType())
						&& !ReportConstants.EQU_CURR_TPYE.equals(reportColumnDefinition.getDataType()))
				{
					dataList.add(new AdditionalDataCodeValue(reportColumnDefinition.getColumnId(), ResourceBundleUtils
							.getString(reportBundle, "LBL_"+reportColumnDefinition.getColumnName(),
									reportColumnDefinition.getColumnName())));
				}
			}
		}
		logger.ctinfo("CTREP00191", dataList);
		return dataList;
	}

	/**
	 * Intended to get the list of format names
	 * 
	 * @param reportId
	 * @return dataList
	 */
	private final ArrayList<AdditionalDataCodeValue> getReportformat(String reportId) throws FormDefinitionException
	{
		logger.ctinfo("CTREP00192");
		ReportInstruction reportInstruction = new ReportInstruction();
		List formatList = null;
		try
		{
			formatList = reportInstruction.getReportFormat(reportId);
		} catch (ReportingException reportExp)
		{
			logger.cterror("CTREP00572", reportExp);
			throw new FormDefinitionException(reportExp.getErrorCode(), reportExp.getErrorMessage(), reportExp);
		}
		ArrayList<AdditionalDataCodeValue> dataList = new ArrayList<AdditionalDataCodeValue>();
		if (formatList != null)
		{
			String formatId = null;
			String formatName = null;
			for (Object object : formatList)
			{
				Map formatMap = (Map) object;
				formatId = (String) formatMap.get(ReportConstants.FORMAT_ID);
				formatName = (String) formatMap.get(ReportConstants.FORMAT_NAME);
				dataList.add(new AdditionalDataCodeValue(formatId, formatName));
			}
		}
		logger.ctinfo("CTREP00193", dataList);
		return dataList;
	}

	/**
	 * Intended to get the list of rate cards
	 * 
	 * @return dataList
	 */
	private final ArrayList<AdditionalDataCodeValue> getRateCards()
	{
		logger.ctinfo("CTREP00194");
		ArrayList<AdditionalDataCodeValue> dataList = new ArrayList<AdditionalDataCodeValue>();
		CacheManager cacheManager = CacheManager.getInstance();
		List rateCardList = cacheManager.getDataFromCache(null,
				"CACHE_KEY_BANK_STANDARD_RATES");
		if (rateCardList != null) {
			Iterator cardIt = rateCardList.iterator();
			IRateCard stRate = null;
			Object iterObj = null;
			while (cardIt.hasNext()) {
				iterObj = cardIt.next();
				if (iterObj != null) {
					stRate = (IRateCard) iterObj;
					dataList.add(new AdditionalDataCodeValue(stRate
							.getRateCardId(), stRate
							.getRateCardDescription()));
				}
			}
		}
		return dataList;
	}

	/**
	 * Intended to return reportDefinition from database if reportDefinition is null
	 * 
	 * @param inputParams Map
	 * @param reportId String
	 * @return reportDefinition
	 * @throws ReportingException e
	 */
	private final ReportDefinition getReportDefinition(Map inputParams, String reportId) throws ReportingException
	{
		// need to check the below condition
		logger.ctinfo("CTREP00195");
		if (reportDefinition == null)
		{
			ReportManager reportManager = new ReportManager();
			ReportRequest reportRequest = new ReportRequest();
			reportRequest.setUserNo((String) inputParams.get(ReportConstants.INPUT_USER_NO));
			reportRequest.setGcif((String) inputParams.get(ReportConstants.INPUT_GCIF));

			reportRequest.setProductCode((String) inputParams.get("REPORT_PRODUCT_CODE"));
			reportRequest.setSubProductCode((String) inputParams.get("REPORT_SUB_PRODUCT_CODE"));
			reportRequest.setFuncCode((String) inputParams.get("REPORT_FUNC_CODE"));

			reportRequest.setReportId(reportId);
			ReportResponse reportResponse;
			try
			{
				reportResponse = reportManager.getReportDefinition(reportRequest);
				if (ReportConstants.STATUS_SUCCESS.equals(reportResponse.getStatus()))
				{
					Map responseObjectMap = reportResponse.getResponseObject();
					if (responseObjectMap != null)
					{
						reportDefinition = (ReportDefinition) responseObjectMap.get(ReportConstants.REPORT_DEFINITION);
					}
				}
			} catch (ReportingException e)
			{
				logger.cterror("CTREP00196", e, reportId);
				throw e;
			}
		}
		logger.ctinfo("CTREP00197", reportDefinition);
		return reportDefinition;
	}

	private ReportDefinition reportDefinition = null;
	// instantiating the logger object
	private static Logger logger = Logger.getLogger(ReportDefinitionSupport.class);
}
