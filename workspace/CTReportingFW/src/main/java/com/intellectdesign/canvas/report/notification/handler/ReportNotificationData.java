/**
    COPYRIGHT NOTICE

    Copyright 2012 Polaris Software Lab Limited. All rights reserved.

    These materials are confidential and proprietary to 
    Polaris Software Lab Limited and no part of these materials should
    be reproduced, published, transmitted or distributed in any form or
    by any means, electronic, mechanical, photocopying, recording or 
    otherwise, or stored in any information storage or retrieval system
    of any nature nor should the materials be disclosed to third parties
    or used in any other manner for which this is not authorized, without
    the prior express written authorization of Polaris Software Lab Limited.
 */
package com.intellectdesign.canvas.report.notification.handler;

import java.util.Map;

import com.intellectdesign.canvas.event.handler.IData;

/**
 * It contains the report execution status details. This class will be used in report notification handler.
 * 
 */
public class ReportNotificationData implements IData
{

	/**
	 * Auto generated serial version id.
	 */
	private static final long serialVersionUID = 5774187337781319724L;

	/**
	 * Data Map.
	 */
	private Map dataMap;

	/**
	 * @return the dataMap
	 */
	public Map getDataMap()
	{
		return dataMap;
	}

	/**
	 * @param dataMap the dataMap to set
	 */
	public void setDataMap(Map dataMap)
	{
		this.dataMap = dataMap;
	}

}
