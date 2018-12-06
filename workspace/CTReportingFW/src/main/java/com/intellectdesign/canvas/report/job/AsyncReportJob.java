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
package com.intellectdesign.canvas.report.job;

import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.report.exception.ReportingException;
import com.intellectdesign.canvas.report.instr.ReportInstruction;
import com.intellectdesign.canvas.report.util.ReportUtil;
import com.intellectdesign.canvas.report.vo.ReportDefinition;
import com.intellectdesign.canvas.report.vo.ReportInstanceDefinition;
import com.intellectdesign.canvas.report.vo.ReportRequest;

/**
 * this class class AsyncReportJob extends ReportJob
 * 
 * @version 1.0
 */
public class AsyncReportJob extends ReportJob
{
	/**
	 * The class contains the methods for Asynchronous report communication of a report job.
	 */

	/**
	 * Gets the report definition,builds a report instance definition and returns it.
	 * 
	 * @param reportRequest
	 * @return ReportInstanceDefinition
	 * @throws ReportingException
	 */
	@Override
	public ReportInstanceDefinition getReportInstanceDefinition(ReportRequest reportRequest) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00308");
		ReportUtil reportUtil = new ReportUtil();
		ReportInstruction reportInstruction = new ReportInstruction();
		ReportDefinition reportDefinition = null;
		reportDefinition = reportInstruction.getReportDefinition(reportRequest.getReportId());
		LOGGER.ctinfo("CTREP00309");
		return reportUtil.buildReportInstanceDefinition(reportDefinition);
	}

	// instantiating the logger object
	private static Logger LOGGER = Logger.getLogger(AsyncReportJob.class);

}
