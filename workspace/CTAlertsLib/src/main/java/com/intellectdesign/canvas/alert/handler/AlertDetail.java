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

package com.intellectdesign.canvas.alert.handler;

/**
 * This class is a value Object that encapsulates the Alert's header level properties such as Alert ID, Description, Severity, Entitlement Type and Data Source.
 * 
 * @version 1.0
 */
public class AlertDetail
{
	private String sAlertId = null;
	private String sAlertDesc = null;
	private String sAlertSeverity = null;
	private String sEntitlementType = null;
	private String dataSource = null;

	/**
	 * This method returns the Alert Description
	 * 
	 * @return AlertDesc String value of the Alert Description
	 */

	public String getAlertDesc()
	{
		return sAlertDesc;
	}

	/**
	 * This method sets the Alert Description
	 * 
	 * @param AlertDesc String value of the Alert Description
	 */
	public void setAlertDesc(String alertDesc)
	{
		sAlertDesc = alertDesc;
	}

	/**
	 * This method returns the Alert Id 
	 * 
	 * @return AlertId String value of the AlertId
	 */

	public String getAlertId()
	{
		return sAlertId;
	}

	/**
	 * This method sets the AlertId
	 * 
	 * @param AlertId String value of the AlertId 
	 */
	public void setAlertId(String alertId)
	{
		sAlertId = alertId;
	}

	/**
	 * This method returns the Severity of the Alert 
	 * 
	 * @return AlertSeverity String value of the Alert Severity
	 */
	public String getAlertSeverity()
	{
		return sAlertSeverity;
	}

	/**
	 * This method sets the Severity of the Alert
	 * 
	 * @param AlertSeverity String value of the alert Severity
	 */
	public void setAlertSeverity(String alertSeverity)
	{
		sAlertSeverity = alertSeverity;
	}

	/**
	 * This method returns the EntitlementType of the alert
	 * 
	 * @return EntitlementType String value of the Entitlement Type of the alert
	 */
	public String getEntitlementType()
	{
		return sEntitlementType;
	}

	/**
	 * This method sets the EntitlementType 
	 * 
	 * @param EntitlementType String value of the Entitlement Type
	 */

	public void setEntitlementType(String entitlementType)
	{
		sEntitlementType = entitlementType;
	}

	/**
	 * This method sets the datasource of the current alert
	 * 
	 * @param datasource String value of the Datasource ID
	 */
	public void setDataSource(String dataSource)
	{
		this.dataSource = dataSource;
	}

	/**
	 * This method returns the Datasource ID of the alert 
	 * 
	 * @return dataSource String value of the Datasource ID
	 */
	public String getDataSource()
	{
		return dataSource;
	}
}
