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
package com.intellectdesign.canvas.report.monitor;

import com.intellectdesign.canvas.report.exception.ReportingException;
import com.intellectdesign.canvas.report.vo.ReportRequest;

/**
 * This interface contains the services to validate whether the user has the quota availablity.
 * 
 * @version 1.0
 */

public interface IQuotaMonitor
{
	/**
	 * This method validates the quota availabilty.
	 * 
	 * @param reportRequest
	 * @return boolean - It returns true is the user has the quota availablity otherwise false.
	 */
	public boolean isQuotaAvailable(ReportRequest reportRequest) throws ReportingException;
}
