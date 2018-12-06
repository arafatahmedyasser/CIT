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

package com.intellectdesign.canvas.report.publisher;

import com.intellectdesign.canvas.report.exception.ReportingException;
import com.intellectdesign.canvas.report.vo.ReportResponse;

/**
 * this is an interface IReportPublisher
 * 
 * @version 1.0
 */
public interface IReportPublisher
{

	/**
	 * 
	 * @param reportResponse
	 * @throws ReportingException
	 */
	public void publish(ReportResponse reportResponse) throws ReportingException;

}
