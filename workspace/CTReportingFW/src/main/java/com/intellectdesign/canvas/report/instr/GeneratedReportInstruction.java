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

package com.intellectdesign.canvas.report.instr;

import java.util.HashMap;

import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.entitlement.DataEntitlements;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.report.util.ReportConstants;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionException;
import com.intellectdesign.canvas.viewdefinition.instruction.ListViewsInstruction;

/**
 * This class is responsible for interacting with DB layer to get the view and view data for List of Reports.
 * 
 * @version 1.0
 */

public class GeneratedReportInstruction extends ListViewsInstruction
{
	/**
	 * This method is responsible for the displaying columns in the view
	 * 
	 * @return viewReport
	 */
	@Override
	protected final HashMap<String, String> getSortColumnMap()
	{
		logger.ctinfo("CTREP00204");
		HashMap<String, String> viewReport = new HashMap<String, String>();

		viewReport.put(ReportConstants.CREATED_DATE, ReportConstants.CREATED_DATE);
		viewReport.put(ReportConstants.REPORT_NAME, ReportConstants.REPORT_NAME);

		viewReport.put(ReportConstants.OD_PRODUCT, ReportConstants.OD_PRODUCT);
		viewReport.put(ReportConstants.FORMAT_NAME, ReportConstants.FORMAT_NAME);
		viewReport.put(ReportConstants.STATUS, ReportConstants.STATUS);
		viewReport.put(ReportConstants.REPORT_INSTANCE_ID, ReportConstants.REPORT_INSTANCE_ID);
		logger.ctinfo("CTREP00205", viewReport);
		return viewReport;
	}

	/**
	 * @param hmInputParams HashMap
	 * @param dataEntitlements DataEntitlements
	 * @return mapViewSpecificFilter
	 * @throws ViewDefinitionException This method is responsible for filtering the view on the basis of the specific
	 *             filters provided.
	 */
	@Override
	public final HashMap getViewSpecificFilters(final HashMap hmInputParams, final DataEntitlements dataEntitlements)
			throws ViewDefinitionException
	{
		logger.ctinfo("CTREP00206");
		ConfigurationManager config = ConfigurationManager.getInstance();
		HashMap mapViewSpecificFilter = null;
		mapViewSpecificFilter = new HashMap();
		String geCustId = (String) hmInputParams.get(ReportConstants.INPUT_GCIF);
		String userNo = (String) hmInputParams.get(ReportConstants.INPUT_USER_NO);
		mapViewSpecificFilter.put(ReportConstants.GCIF, geCustId);
		mapViewSpecificFilter.put(ReportConstants.USER_NO, userNo);
		mapViewSpecificFilter.put(ReportConstants.RPT_INST_DEF_FETCH_INTERVEL, config
				.getInformationReportingDescriptor().getReportInstanceFetchInterval());

		logger.ctinfo("CTREP00207", mapViewSpecificFilter);
		return mapViewSpecificFilter;
	}

	@Override
	/**
	 * @return  String
	 * @see com.intellectdesign.canvas.viewdefinition.SimpleViewDefinitionInstruction#getUniqueSortFieldName()
	 */
	protected String getUniqueSortFieldName()
	{
		return ReportConstants.CREATED_DATE;
	}

	@Override
	/**
	 *@return  String:ReportConstants.SORT_DESC
	 */
	protected String getUniqueSortFieldOrder()
	{
		return ReportConstants.SORT_DESC;
	}

	/**
	 * @return String: canvas datasource
	 */
	@Override
	protected String getDataSource()
	{
		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		return configMgr.getDBDescriptor().getCtFWIBATISDSKey();
	}

	// instantiating logger object
	private static Logger logger = Logger.getLogger(GeneratedReportInstruction.class);

}
