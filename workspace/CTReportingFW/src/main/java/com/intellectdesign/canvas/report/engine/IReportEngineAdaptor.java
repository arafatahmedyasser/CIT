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

import java.util.List;

import com.intellectdesign.canvas.report.exception.ReportingException;
import com.intellectdesign.canvas.report.vo.ReportRequest;
import com.intellectdesign.canvas.report.vo.ReportResponse;

/**
 * This interface acts as the adaptor between the report executor and the report engine. It provides abstract methods to
 * process the report request before they are actually sent to the report engine for generating the report. It also
 * provides methods to make a request to the report engine to actually generate the report. These methods must be
 * implemented by the implementing classes based on the nature of the report engine used to generate the report.
 * 
 * @version 1.0
 */

public interface IReportEngineAdaptor
{

	/***
	 * Intension of this method is to generate/populate the report request data into a format that can be consumed by
	 * the reporting engine.For example, for the existing report engine used in the CBX,the report engine expect
	 * ExportDataValueObject and UserValue objects as parameter.This method is expected to be called inside the
	 * generateReport().
	 * 
	 * @param reportRequest an instance of the ReportRequest type.
	 * @param dataItems the data from the data aggregator.
	 * @throws ReportingException for any exception that will be thrown.
	 */
	public List processBeforeGenerateReport(ReportRequest reportRequest, List dataItems) throws ReportingException;

	/***
	 * Intension of this method is to send a request to the report engine to actually generate the report. Important :
	 * This method should not be return null value.
	 * 
	 * @param reportRequest an instance of the ReportRequest type.
	 * @param dataItems the data from the data aggregator.
	 * @return ReportResponse instance of the type ReportResponse.
	 * @throws ReportingException for any exception thrown.
	 */
	public ReportResponse generateReport(ReportRequest reportRequest, List dataItems) throws ReportingException;

}
