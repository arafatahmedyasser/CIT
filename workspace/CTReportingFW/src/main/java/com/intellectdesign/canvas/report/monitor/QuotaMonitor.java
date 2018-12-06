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
package com.intellectdesign.canvas.report.monitor;

import java.util.List;

import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.report.exception.ReportingException;
import com.intellectdesign.canvas.report.policy.IReportPolicyHandler;
import com.intellectdesign.canvas.report.vo.ReportContext;
import com.intellectdesign.canvas.report.vo.ReportPolicy;
import com.intellectdesign.canvas.report.vo.ReportRequest;

/**
 * This interface contains the services to validate whether the user has the quota availablity.
 * 
 * @version 1.0
 */

public class QuotaMonitor implements IQuotaMonitor
{
	/**
	 * This method validates the quota availabilty.
	 * 
	 * @param reportRequest
	 * @return boolean - It returns true is the user has the quota availablity otherwise false.
	 */
	public boolean isQuotaAvailable(ReportRequest reportRequest) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00339");
		boolean quotaAvailable = false;
		if (reportRequest != null)
		{
			ReportContext reportContext = reportRequest.getReportContext();
			if (reportContext != null)
			{
				List<ReportPolicy> policies = reportContext.getPolicies();
				if (policies == null || policies.isEmpty())
				{
					/**
					 * It should be removed when integrating the quota policies in the application. Setting the default
					 * value as true since the quota policies are not yet integrated in the application.
					 * */
					quotaAvailable = true;
				} else
				{
					for (ReportPolicy reportPolicy : policies)
					{
						IReportPolicyHandler policyHandler = reportPolicy.getReportPolicyHandler();
						quotaAvailable = policyHandler.executePolicy(reportRequest);
						if (!quotaAvailable)
						{
							return quotaAvailable;
						}
					}
				}
			}
		}
		LOGGER.ctinfo("CTREP00340");
		return quotaAvailable;
	}

	// instantiating the logger object
	private static Logger LOGGER = Logger.getLogger(QuotaMonitor.class);
}
