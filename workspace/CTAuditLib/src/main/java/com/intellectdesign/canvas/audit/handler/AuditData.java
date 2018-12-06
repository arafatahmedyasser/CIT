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

package com.intellectdesign.canvas.audit.handler;

import java.util.Date;

import com.intellectdesign.canvas.event.handler.IData;

/**
 * This class explains about AuditData which implements IData
 * 
 * @version 1.0
 */
public class AuditData implements IData
{
	/**
	 * Internal constant for serializations purposes
	 */
	private static final long serialVersionUID = 5842671545066836863L;
	private long nEventId = -1;
	private String nAuditId = null;
	private String sAppServerIP = null;
	private String sWebserverIP = null;
	private String sClientIP = null;
	private Date dtAuditDateTime = null;
	private String sReferenceNo = null;
	private String sLoginId = null;
	private String sUserNo = null;
	private String sGCIF = null;
	private String sParentGCIF = null;
	private boolean bSimulationMode = false;
	private String sAuditData = null;
	private String sChannel = null;
	private String sSessionId = null;
	private String sBrowserName = null;
	private String sSimulationLoginId = null;
	private String sDSAData = null;
	private String oldReferenceNo = null;
	private String referenceKey = null;

	private String deviceBandId = null;
	private String userAgent = null;
	private String workspaceId = null;
	private String layoutId = null;
	private String widgetId = null;
	private String geoLocation = null;
	private String requestId = null;
	private String refererUrl = null;
	private String UDF1 = null;
	private String UDF2 = null;
	private String UDF3 = null;
	private String UDF4 = null;
	private String UDF5 = null;
	private String UDF6 = null;
	private String UDF7 = null;
	private String UDF8 = null;
	private String UDF9 = null;
	private String UDF10 = null;

	/**
	 * String Representation of all values .
	 * 
	 * @return String
	 */
	public String toString()
	{
		return new StringBuffer("Event ID: ").append(nEventId).append(", App IP: ").append(sAppServerIP)
				.append(", Web IP: ").append(sWebserverIP).append(", Client IP: ").append(sClientIP).append(", Ref: ")
				.append(sReferenceNo).append(", Login ID: ").append(sLoginId).append(", User No: ").append(sUserNo)
				.append(", Simulation Login ID: ").append(sSimulationLoginId).append(", GCIF: ").append(sGCIF)
				.append(", Channel: ").append(sChannel).append(", Sess ID: ").append(sSessionId)
				.append("Data Length: ").append(String.valueOf(sAuditData != null ? sAuditData.length() : -1))
				.append("DSA Data Length: ").append(String.valueOf(sDSAData != null ? sDSAData.length() : -1))
				.toString();
	}

	/**
	 * Returns true if the necessary information for audit is available in the audit data.
	 * 
	 * @param auditData
	 * @return boolean Returns true if the necessary information for audit is available
	 */
	public static boolean isComplete(AuditData auditData)
	{
		boolean mandPresent = (auditData.getAppServerIP() != null && auditData.getReferenceNo() != null
				&& auditData.getSessionId() != null && auditData.getGCIF() != null && auditData.getChannel() != null && auditData
				.getBrowserName() != null);
		boolean oneOfMandPresent = ((auditData.getLoginId() != null) || (auditData.getUserNo() != null));
		// Return true if all mand fields are present and the one of mandatory condition is also satisfied.
		return mandPresent && oneOfMandPresent;
	}

	/**
	 * Returns Simulation Mode
	 * 
	 * @return bSimulationMode as boolean
	 */
	public boolean getSimulationMode()
	{
		return bSimulationMode;
	}

	/**
	 * Sets Simulation Mode
	 * 
	 * @param bSimulationMode as boolean
	 */
	public void setSimulationMode(boolean simulationMode)
	{
		this.bSimulationMode = simulationMode;
	}

	/**
	 * Returns Date and Time
	 * 
	 * @return the dtAuditDateTime
	 */
	public Date getAuditDateTime()
	{
		return dtAuditDateTime;
	}

	/**
	 * Sets Date and Time
	 * 
	 * @param dtAuditDateTime to set
	 */
	public void setAuditDateTime(Date dtAuditDateTime)
	{
		this.dtAuditDateTime = dtAuditDateTime;
	}

	/**
	 * Returns event Id
	 * 
	 * @return the nEventId
	 */
	public long getEventId()
	{
		return nEventId;
	}

	/**
	 * Returns event Id as String
	 * 
	 * @return the EventId
	 */
	public String getEventIdAsString()
	{
		return String.valueOf(nEventId);
	}

	/**
	 * Sets Event Id
	 * 
	 * @param nEventId as String
	 */
	public void setEventId(long eventId)
	{
		this.nEventId = eventId;
	}

	/**
	 * Returns The Key for the reference
	 * 
	 * @return the Key for the reference
	 */
	public String getReferenceKey()
	{
		return referenceKey;
	}

	/**
	 * Sets The Key for the reference
	 * 
	 * @param key The Key for the reference
	 */
	public void setReferenceKey(String key)
	{
		this.referenceKey = key;
	}

	/**
	 * Returns browser name
	 * 
	 * @return the browser name
	 */
	public String getBrowserName()
	{
		return sBrowserName;
	}

	/**
	 * Sets Browser name
	 * 
	 * @param browser name to set
	 */
	public void setBrowserName(String browserName)
	{
		this.sBrowserName = browserName;
	}

	/**
	 * Returns AuditId
	 * 
	 * @return the AuditId
	 */
	public String getAuditId()
	{
		return nAuditId;
	}

	/**
	 * Sets AuditId
	 * 
	 * @param AuditId to set
	 */
	public void setAuditId(String auditId)
	{
		this.nAuditId = auditId;
	}

	/**
	 * Returns App Server
	 * 
	 * @return the sAppServerIP
	 */
	public String getAppServerIP()
	{
		return sAppServerIP;
	}

	/**
	 * Sets AppServer
	 * 
	 * @param sAppServerIP as String
	 */
	public void setAppServerIP(String appServerIP)
	{
		this.sAppServerIP = appServerIP;
	}

	/**
	 * Returns Client IP
	 * 
	 * @return the sClientIP
	 */
	public String getClientIP()
	{
		return sClientIP;
	}

	/**
	 * Sets Client IP
	 * 
	 * @param sClientIP as String
	 */
	public void setClientIP(String clientIP)
	{
		this.sClientIP = clientIP;
	}

	/**
	 * Returns GCIF
	 * 
	 * @return sGCIF as String
	 */
	public String getGCIF()
	{
		return sGCIF;
	}

	/**
	 * Sets GCIF
	 * 
	 * @param sgcif as String
	 */
	public void setGCIF(String sgcif)
	{
		this.sGCIF = sgcif;
	}

	/**
	 * Returns Login Id
	 * 
	 * @return sLoginId as String
	 */
	public String getLoginId()
	{
		return sLoginId;
	}

	/**
	 * Sets Login Id
	 * 
	 * @param loginId the sLoginId to set
	 */
	public void setLoginId(String loginId)
	{
		this.sLoginId = loginId;
	}

	/**
	 * This field is relevant if say the user of corporate is performing an action on behalf of one of its client
	 * corporates. In such a case the GCIF will be the GCIF of the client Corporate and the parent GCIF will be GCIF of
	 * the original client.
	 * 
	 * @return the sParentGCIF
	 */
	public String getParentGCIF()
	{
		return sParentGCIF;
	}

	/**
	 * Sets Parent GCIF This field is relevant if say the user of corporate is performing an action on behalf of one of
	 * its client corporates. In such a case the GCIF will be the GCIF of the client Corporate and the parent GCIF will
	 * be GCIF of the original client.
	 * 
	 * @param parentGCIF the sParentGCIF to set
	 */
	public void setParentGCIF(String parentGCIF)
	{
		sParentGCIF = parentGCIF;
	}

	/**
	 * This method will return null if the user is a front office user. User Numbers are relevant only for back-office
	 * users.
	 * 
	 * @return the sUserNo
	 */
	public String getUserNo()
	{
		return sUserNo;
	}

	/**
	 * Sets User No(User Numbers are relevant only for back-office users)
	 * 
	 * @param  sBrowserName for the sUserNo to set
	 */
	public void setUserNo(String sBrowserName)
	{
		this.sUserNo = sBrowserName;
	}

	/**
	 * Returns Communication channel
	 * 
	 * @return sCommunicationChannel as String
	 */
	public String getChannel()
	{
		return sChannel;
	}

	/**
	 * Sets Communication channel
	 * 
	 * @param communicationChannel the sCommunicationChannel to set
	 */
	public void setChannel(String sChannel)
	{
		this.sChannel = sChannel;
	}

	/**
	 * Returns Audit data
	 * 
	 * @return sAuditNewData as String
	 */
	public String getAuditData()
	{
		return sAuditData;
	}

	/**
	 * Sets Audit Data
	 * 
	 * @param sAuditNewData as String
	 */
	public void setAuditData(String sAuditData)
	{
		this.sAuditData = sAuditData;
	}

	/**
	 * Returns Reference No
	 * 
	 * @return sReferenceNo as String
	 */
	public String getReferenceNo()
	{
		return sReferenceNo;
	}

	/**
	 * Sets Reference No
	 * 
	 * @param sReferenceNo as String
	 */
	public void setReferenceNo(String sReferenceNo)
	{
		this.sReferenceNo = sReferenceNo;
	}

	/**
	 * Returns Session Id
	 * 
	 * @return SessionId as String
	 */
	public String getSessionId()
	{
		return sSessionId;
	}

	/**
	 * Sets Session Id
	 * 
	 * @param sSessionId as String
	 */
	public void setSessionId(String sSessionId)
	{
		this.sSessionId = sSessionId;
	}

	/**
	 * Returns Web server IP
	 * 
	 * @return Web server IP as String
	 */
	public String getWebserverIP()
	{
		return sWebserverIP;
	}

	/**
	 * Sets Web server IP
	 * 
	 * @param webserverIP as String
	 */
	public void setWebserverIP(String sWebserverIP)
	{
		this.sWebserverIP = sWebserverIP;
	}

	/**
	 * Returns sSimulationLoginId
	 * 
	 * @return sSimulationLoginId as String
	 */
	public String getSSimulationLoginId()
	{
		return sSimulationLoginId;
	}

	/**
	 * Sets sSimulationLoginId
	 * 
	 * @param sSimulationLoginId as String
	 */
	public void setSSimulationLoginId(String simulationLoginId)
	{
		sSimulationLoginId = simulationLoginId;
	}

	/**
	 * Returns DSDA data
	 * 
	 * @return sDSAData as String
	 */
	public String getDSAData()
	{
		return sDSAData;
	}

	/**
	 * Sets DSA Data
	 * 
	 * @param sDSAData as String
	 */
	public void setDSAData(String sDSAData)
	{
		this.sDSAData = sDSAData;
	}

	// Generating getter and setter for set the old ref.no in audit metadata
	/**
	 * To get the OldReferenceNo
	 * 
	 * @return the oldReferenceNo
	 */
	public String getOldReferenceNo()
	{
		return oldReferenceNo;
	}

	/**
	 * To set the OldReferenceNo
	 * 
	 * @param oldReferenceNo the oldReferenceNo to set
	 */
	public void setOldReferenceNo(String oldReferenceNo)
	{
		this.oldReferenceNo = oldReferenceNo;
	}

	/**
	 * To get the DeviceBandId
	 * 
	 * @return the deviceBandId
	 */
	public String getDeviceBandId()
	{
		return deviceBandId;
	}

	/**
	 * To set the deviceBandId
	 * 
	 * @param deviceBandId the deviceBandId to set
	 */
	public void setDeviceBandId(String deviceBandId)
	{
		this.deviceBandId = deviceBandId;
	}

	/**
	 * To get the userAgent
	 * 
	 * @return the userAgent
	 */
	public String getUserAgent()
	{
		return userAgent;
	}

	/**
	 * To set the userAgent
	 * 
	 * @param userAgent the userAgent to set
	 */
	public void setUserAgent(String userAgent)
	{
		this.userAgent = userAgent;
	}

	/**
	 * To get the workspaceId
	 * 
	 * @return the workspaceId
	 */
	public String getWorkspaceId()
	{
		return workspaceId;
	}

	/**
	 * To set the workspaceId
	 * 
	 * @param workspaceId the workspaceId to set
	 */
	public void setWorkspaceId(String workspaceId)
	{
		this.workspaceId = workspaceId;
	}

	/**
	 * To get the layoutId
	 * 
	 * @return the layoutId
	 */
	public String getLayoutId()
	{
		return layoutId;
	}

	/**
	 * To set the layoutId
	 * 
	 * @param layoutId the layoutId to set
	 */
	public void setLayoutId(String layoutId)
	{
		this.layoutId = layoutId;
	}

	/**
	 * To get the widgetId
	 * 
	 * @return the widgetId
	 */
	public String getWidgetId()
	{
		return widgetId;
	}

	/**
	 * To set the widgetId
	 * 
	 * @param widgetId the widgetId to set
	 */
	public void setWidgetId(String widgetId)
	{
		this.widgetId = widgetId;
	}

	/**
	 * To get the geoLocation
	 * 
	 * @return the geoLocation
	 */
	public String getGeoLocation()
	{
		return geoLocation;
	}

	/**
	 * To set the geoLocation
	 * 
	 * @param geoLocation the geoLocation to set
	 */
	public void setGeoLocation(String geoLocation)
	{
		this.geoLocation = geoLocation;
	}

	/**
	 * To get the requestId
	 * 
	 * @return the requestId
	 */
	public String getRequestId()
	{
		return requestId;
	}

	/**
	 * To set the requestId
	 * 
	 * @param requestId the requestId to set
	 */
	public void setRequestId(String requestId)
	{
		this.requestId = requestId;
	}

	/**
	 * To get the refererUrl
	 * 
	 * @return the refererUrl
	 */
	public String getRefererUrl()
	{
		return refererUrl;
	}

	/**
	 * To set the refererUrl
	 * 
	 * @param refererUrl the refererUrl to set
	 */
	public void setRefererUrl(String refererUrl)
	{
		this.refererUrl = refererUrl;
	}

	/**
	 * To get the UDF1
	 * 
	 * @return the UDF1
	 */
	public String getUDF1()
	{
		return UDF1;
	}

	/**
	 * To set the UDF1
	 * 
	 * @param UDF1 the UDF1 to set
	 */
	public void setUDF1(String UDF1)
	{
		this.UDF1 = UDF1;
	}

	/**
	 * To get the UDF2
	 * 
	 * @return the UDF2
	 */
	public String getUDF2()
	{
		return UDF2;
	}

	/**
	 * To set the UDF2
	 * 
	 * @param UDF2 the UDF2 to set
	 */
	public void setUDF2(String UDF2)
	{
		this.UDF2 = UDF2;
	}

	/**
	 * To get the UDF3
	 * 
	 * @return the UDF3
	 */
	public String getUDF3()
	{
		return UDF3;
	}

	/**
	 * To set the UDF3
	 * 
	 * @param UDF3 the UDF3 to set
	 */
	public void setUDF3(String UDF3)
	{
		this.UDF3 = UDF3;
	}

	/**
	 * To get the UDF4
	 * 
	 * @return the UDF4
	 */
	public String getUDF4()
	{
		return UDF4;
	}

	/**
	 * To set the UDF4
	 * 
	 * @param UDF4 the UDF4 to set
	 */
	public void setUDF4(String UDF4)
	{
		this.UDF4 = UDF4;
	}

	/**
	 * To get the UDF5
	 * 
	 * @return the UDF5
	 */
	public String getUDF5()
	{
		return UDF5;
	}

	/**
	 * To set the UDF5
	 * 
	 * @param UDF5 the UDF5 to set
	 */
	public void setUDF5(String UDF5)
	{
		this.UDF5 = UDF5;
	}

	/**
	 * To get the UDF6
	 * 
	 * @return the UDF6
	 */
	public String getUDF6()
	{
		return UDF6;
	}

	/**
	 * To set the UDF6
	 * 
	 * @param UDF6 the UDF6 to set
	 */
	public void setUDF6(String UDF6)
	{
		this.UDF6 = UDF6;
	}

	/**
	 * To get the UDF7
	 * 
	 * @return the UDF7
	 */
	public String getUDF7()
	{
		return UDF7;
	}

	/**
	 * To set the UDF7
	 * 
	 * @param UDF7 the UDF7 to set
	 */
	public void setUDF7(String UDF7)
	{
		this.UDF7 = UDF7;
	}

	/**
	 * To get the UDF8
	 * 
	 * @return the UDF8
	 */
	public String getUDF8()
	{
		return UDF8;
	}

	/**
	 * To set the UDF8
	 * 
	 * @param UDF8 the UDF8 to set
	 */
	public void setUDF8(String UDF8)
	{
		this.UDF8 = UDF8;
	}

	/**
	 * To get the UDF9
	 * 
	 * @return the UDF9
	 */
	public String getUDF9()
	{
		return UDF9;
	}

	/**
	 * To set the UDF9
	 * 
	 * @param UDF9 the UDF9 to set
	 */
	public void setUDF9(String UDF9)
	{
		this.UDF9 = UDF9;
	}

	/**
	 * To get the UDF10
	 * 
	 * @return the UDF10
	 */
	public String getUDF10()
	{
		return UDF10;
	}

	/**
	 * To set the UDF10
	 * 
	 * @param UDF10 the UDF10 to set
	 */
	public void setUDF10(String UDF10)
	{
		this.UDF10 = UDF10;
	}

}
