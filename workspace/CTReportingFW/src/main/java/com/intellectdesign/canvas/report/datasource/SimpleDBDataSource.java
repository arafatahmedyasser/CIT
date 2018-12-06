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
package com.intellectdesign.canvas.report.datasource;

import java.util.List;

import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.report.vo.ReportRequest;

/**
 * This is a SimpleDBDataSource class extends DBDataSource
 * 
 * @version 1.0
 */
public class SimpleDBDataSource extends DBDataSource
{

	@Override
	/**
	 * This method adds Filters.
	 * 
	 * @param reportRequest
	 * @param dbRequest
	 * @see com.intellectdesign.canvas.report.datasource.DBDataSource#addFilters(com.intellectdesign.canvas.report.vo.ReportRequest, com.intellectdesign.canvas.database.DatabaseRequest)
	 */
	public void addFilters(ReportRequest reportRequest, DatabaseRequest dbRequest)
	{
		dbRequest.addFilter("SWEEP_TYPE", "ZERO BALANCE");

	}

	@Override
	/**
	 * This method adds additional filters.
	 * 
	 * @param reportRequest
	 * @param entCriteria
	 * @param dbRequest
	 * @see com.intellectdesign.canvas.report.datasource.DBDataSource#addAdditionalFilters(com.intellectdesign.canvas.report.vo.ReportRequest, java.util.List, com.intellectdesign.canvas.database.DatabaseRequest)
	 */
	public void addAdditionalFilters(ReportRequest reportRequest, List entCriteria, DatabaseRequest dbRequest)
	{

	}

}
