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
package com.intellectdesign.canvas.report.scheduler;

import com.intellectdesign.canvas.report.exception.ReportingException;
import com.intellectdesign.canvas.report.job.IReportJob;
import com.intellectdesign.canvas.report.vo.ReportRequest;

/**
 * This interface will provide the necessary services for the report scheduler.
 * 
 * @version 1.0
 */

public interface IReportScheduler
{
	/**
	 * 
	 * @param reportRequest
	 * @return
	 */
	public IReportJob createJob(ReportRequest reportRequest);

	/**
	 * 
	 * @param reportRequest
	 * @throws ReportingException
	 */
	public void scheduleJob(ReportRequest reportRequest) throws ReportingException;

	/**
	 * 
	 * @param reportRequest
	 * @return
	 * @throws ReportingException
	 */
	public String deleteJob(ReportRequest reportRequest) throws ReportingException;
}
