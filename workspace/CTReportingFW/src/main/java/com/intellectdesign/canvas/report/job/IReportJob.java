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

/**
 * The interface for the report job, that will create the instance of the 
 * report and add it to the queue.

 * @version 1.0
 */
import com.intellectdesign.canvas.report.exception.ReportingException;
import com.intellectdesign.canvas.report.vo.ReportRequest;

public interface IReportJob
{
	/**
	 * This method builds the reportinstance definition and adds it to jms queue for further processing.
	 * 
	 * @param reportRequest
	 * @return
	 */
	public String executeReport(ReportRequest reportRequest) throws ReportingException;

	/**
	 * Adds the report request to the jms queue.
	 * 
	 * @param reportRequest
	 */
	public void addToQueue(ReportRequest reportRequest) throws ReportingException;
}
