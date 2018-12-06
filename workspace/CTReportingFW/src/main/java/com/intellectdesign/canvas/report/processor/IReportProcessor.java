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
package com.intellectdesign.canvas.report.processor;

import com.intellectdesign.canvas.report.exception.ReportingException;
import com.intellectdesign.canvas.report.vo.ReportRequest;
import com.intellectdesign.canvas.report.vo.ReportResponse;

/**
 * this is an interface IReportProcessor
 * 
 * @version 1.0
 */
public interface IReportProcessor
{
	/**
	 * The saveReport method is used for saving the report definition in the DB.The method is common for both SYNC and
	 * ASYNC communication type.
	 * 
	 * @param ReportRequest
	 * @return ReportResponse
	 * @throws ReportingException
	 * */
	public ReportResponse saveReport(ReportRequest reportRequest) throws ReportingException;

	/**
	 * The runReport method used to run the report
	 * 
	 * @param ReportRequest
	 * @return ReportResponse
	 * @throws ReportingException
	 * */
	public ReportResponse runReport(ReportRequest reportRequest) throws ReportingException;

	/**
	 * The saveAndRunReport method to save the report in DB and run the report
	 * 
	 * @param ReportRequest
	 * @return ReportResponse
	 * @throws ReportingException
	 * */
	public ReportResponse saveAndRunReport(ReportRequest reportRequest) throws ReportingException;

	/**
	 * The scheduleReport report method used to schedule a report.The method used by ASYNC communication type.
	 * 
	 * @param ReportRequest
	 * @return ReportResponse
	 * @throws ReportingException
	 * */
	// public ReportResponse scheduleReport(ReportRequest reportRequest) throws ReportingException;

	/**
	 * The saveAndScheduleReport report method used to save and schedule a report.The method used by ASYNC communication
	 * type
	 * 
	 * @param ReportRequest
	 * @return ReportResponse
	 * @throws ReportingException
	 * */
	public ReportResponse saveAndScheduleReport(ReportRequest reportRequest) throws ReportingException;

	/**
	 * The deleteReport report method used to delete a report.
	 * 
	 * @param ReportRequest
	 * @return ReportResponse
	 * @throws ReportingException
	 * */
	public ReportResponse deleteReport(ReportRequest reportRequest) throws ReportingException;

	/**
	 * The runReportInstance report method used to run a report instance
	 * 
	 * @param ReportRequest
	 * @return ReportResponse
	 * @throws ReportingException
	 * */
	public ReportResponse runReportInstance(ReportRequest reportRequest) throws ReportingException;

}
