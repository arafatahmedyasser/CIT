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
package com.intellectdesign.canvas.report.job;

import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.report.exception.ReportingException;
import com.intellectdesign.canvas.report.instr.ReportInstruction;
import com.intellectdesign.canvas.report.util.ReportUtil;
import com.intellectdesign.canvas.report.vo.ReportDefinition;
import com.intellectdesign.canvas.report.vo.ReportInstanceDefinition;
import com.intellectdesign.canvas.report.vo.ReportRequest;

/**
 * @version 1.0
 */
public class SyncReportJob extends ReportJob
{
	private ReportInstanceDefinition reportInstanceDefinition = null;

	/**
	 * This method used to get the Report Instance Definition Object.
	 * 
	 * @return the reportInstanceDefinition
	 */
	public ReportInstanceDefinition getReportInstanceDefinition()
	{
		return reportInstanceDefinition;
	}

	/**
	 * This method used to set the Report Instance Definition Object.
	 * 
	 * @param reportInstanceDefinition the reportInstanceDefinition to set for SyncReportJob
	 */
	public void setReportInstanceDefinition(ReportInstanceDefinition reportInstanceDefinition)
	{
		this.reportInstanceDefinition = reportInstanceDefinition;
	}

	/**
	 * This method get the ReprotRequest as a input and check whether the ReportRequest's ReportId already have the
	 * report Instance Definition. It true means it return the object. Otherwise it will do the following steps to get
	 * the new Report Instance definition object. 1. Cal the ReportInstruction's getReportDeinition() method and get the
	 * report definitions from the database. 2 Builds the report instance definition from the report definition using
	 * ReportUtil's buildReportInstanceDefinition() method. 3. Returns the Report Instance Definition object.
	 */
	@Override
	/**
	 * 
	 * @param reportRequest
	 * @return
	 * @throws ReportingException
	 * @see com.intellectdesign.canvas.report.job.ReportJob#getReportInstanceDefinition(com.intellectdesign.canvas.report.vo.ReportRequest)
	 */
	public ReportInstanceDefinition getReportInstanceDefinition(ReportRequest reportRequest) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00337");
		if (this.reportInstanceDefinition == null)
		{
			ReportInstruction reportInstruction = new ReportInstruction();
			ReportDefinition reportDefinition = reportInstruction.getReportDefinition(reportRequest.getReportId());
			ReportUtil reportUtil = new ReportUtil();
			this.reportInstanceDefinition = reportUtil.buildReportInstanceDefinition(reportDefinition);
		}
		LOGGER.ctinfo("CTREP00338");
		return this.reportInstanceDefinition;

	}

	// instantiating the logger object
	private static Logger LOGGER = Logger.getLogger(SyncReportJob.class);
}
