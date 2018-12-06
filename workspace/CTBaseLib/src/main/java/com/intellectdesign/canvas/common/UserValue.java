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

package com.intellectdesign.canvas.common;

import java.io.Serializable;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import com.intellectdesign.canvas.pref.value.CorporatePreferenceValue;
import com.intellectdesign.canvas.value.IUserValue;

/**
 * This class is for UserValue Contaings Serializable
 * 
 * @version 1.0
 */
public class UserValue implements Serializable, IUserValue
{
	/**
	 * Default value of serialVersionUID
	 */
	private static final long serialVersionUID = 1L;

	private String userNo;
	private String loginId;
	private String rsaPin;
	private String newLoginId;
	private String userPin;
	private String newPin;
	private String statusFlag;
	private String authenticationType;
	private String transactionStatus;
	private String info;
	private String transactionCode;
	private String langId;
	private String amountId;
	private String dateId;
	private String ChangeStyle;
	private String seclangId;
	private String enaSecLang;
	private String startUpWorkSpaceId;
	private String mTimeZoneId;
	private String urlId;
	private String urlDesc;
	private String lastLogin;
	private String staticMsgs;
	private String dynamicMsgs;
	private String primaryGcif;
	private String primaryCif;
	private String primaryCorporate;
	private String[] gcifNo;
	private String[] cifNo;
	private String[] corporateNames;
	private String invalidAttempts;
	private int gcifCount;
	private int pendingMails;
	private int pendingAutherisations;
	private int rejectedAutherisations;
	private int pendingBatchAutherisations;
	private String customerType;

	private String FIRST_NAME;
	private String MIDDLE_NAME;
	private String LAST_NAME;
	private String strCity;
	private Date dtDOB;
	private String currDate;
	private String dispDate;
	private String[] functionCode;
	public Object mUser;
	private String roles;
	private String rolesDesc;
	private HashMap mapAds;
	private String timeStamp;
	private String sessionCount;
	private String idleCount;
	private String mAmtFormat;

	// Added by Anoop for certificate based login
	private String certificateNo;
	// Added by sathees for user preference
	private CorporatePreferenceValue corpPrepVal;
	// Added for storing custom SSO properties.
	private HashMap mCustomSSOProperties;

	private String rateCard; // Included for adding the rate card preference for the user
	private String equivalentCurrency; // Included for adding the equivalent currency preference for the user
	private List rateCardCurrencies;
	private boolean isLoginSuccess = false;

	private String armorTicket;
	private String response;

	private boolean isSimulated;
	private String simulatingUserNo;
	private String requestIp;

	private String sessionId;
	private String userAgent;

	private String alertId;

	private String eventId;

	private String channelId;

	private int urgentAlertsCounter = 0;
	private int normalAlertsCounter = 0;
	private boolean isReAuthRequired = false;
	private Object loginRegUserValue = null;
	private String RSATokenSerialNo = null;
	private boolean invalidCred = false;
	private boolean isMigratedUser = false;

	private boolean loginFlag = false;
	private String sessionTicket;
	private boolean logoutAuditStatus = false;
	private int errorCode = 0;
	private String themeId = null;
	private String fontsizeId = null;
	private String direction = null;

	private String exportReportFormat = null;
	/**
	 * This is the property which is used to identify the actions done as part of the request
	 */
	private String requestID = null;
	/**
	 * DeviceBand : As of now the Device_type is stored in this field. It needs to be enhanced furthur.
	 */
	private String deviceBand = null;
	/**
	 * This is the property which will hold the URI of the request.
	 */
	private String requestURI = null;

	/**
	 * 
	 */
	private String userRole = null;

	/**
	 * This is the property that holds the time format of the user
	 */
	private String timeFormat = null;
	
	
	private String loginMode="USER";
	
	private HashMap  mCustomAttributes = new HashMap();
	
	private String preferedWs = "DEFAULT";
	
	
	

	/**
	 * @param preferedWs the preferedWs to set
	 */
	public void setPreferredWorkspaceId(String preferedWs)
	{
		this.preferedWs = preferedWs;
	}

	/**
	 * @return the preferedWs
	 */
	public String getPreferredWorkspaceId()
	{
		return preferedWs;
	}

	/***
	 * method that gets errorCode
	 * 
	 * @return errorCode(int)
	 */
	public int getErrorCode()
	{
		return errorCode;
	}

	/**
	 * method that sets ErrorCode
	 * 
	 * @param errorCode The errorCode to set.
	 */

	public void setErrorCode(int errorCode)
	{
		this.errorCode = errorCode;
	}

	/***
	 * method that gets requestID
	 * 
	 * @return requestID(String)
	 */

	public String getRequestID()
	{
		return requestID;
	}

	/**
	 * method that sets RequestID
	 * 
	 * @param requestID The requestID to set.
	 */

	public void setRequestID(String requestID)
	{
		this.requestID = requestID;
	}

	/***
	 * method that gets exportReportFormat
	 * 
	 * @return exportReportFormat(String)
	 */

	public String getExportReportFormat()
	{
		return exportReportFormat;
	}

	/**
	 * method that sets ExportReportFormat
	 * 
	 * @param exportReportFormat The exportReportFormat to set.
	 */

	public void setExportReportFormat(String exportReportFormat)
	{
		this.exportReportFormat = exportReportFormat;
	}

	/***
	 * method that gets logoutAuditStatus
	 * 
	 * @return logoutAuditStatus(boolean)
	 */

	public boolean isLogoutAuditStatus()
	{
		return logoutAuditStatus;
	}

	/**
	 * method that sets LogoutAuditStatus
	 * 
	 * @param logoutAuditStatus The logoutAuditStatus to set.
	 */

	public void setLogoutAuditStatus(boolean logoutAuditStatus)
	{
		this.logoutAuditStatus = logoutAuditStatus;
	}

	/***
	 * method that gets isMigratedUser
	 * 
	 * @return isMigratedUser(boolean)
	 */
	public boolean isMigratedUser()
	{
		return isMigratedUser;
	}

	/**
	 * method that sets MigratedUser
	 * 
	 * @param isMigratedUser The isMigratedUser to set.
	 */

	public void setMigratedUser(boolean isMigratedUser)
	{
		this.isMigratedUser = isMigratedUser;
	}

	/**
	 * method that sets InvalidCred
	 * 
	 * @param invalidCred The invalidCred to set.
	 */

	public void setInvalidCred(boolean invalidCred)
	{
		this.invalidCred = invalidCred;
	}

	/**
	 * method that gets InvalidCred
	 * 
	 * @return Returns the invalidCred.
	 */

	public boolean isInvalidCred()
	{
		return invalidCred;
	}

	/**
	 * method that gets loginRegUserValue
	 * 
	 * @return loginRegUserValue(Object)
	 */

	public Object getLoginRegUserValue()
	{
		return loginRegUserValue;
	}

	/**
	 * method that sets LoginRegUserValue
	 * 
	 * @param loginRegUserValue The loginRegUserValue to set.
	 */

	public void setLoginRegUserValue(Object loginRegUserValue)
	{
		this.loginRegUserValue = loginRegUserValue;
	}

	/**
	 * method that gets loginFlag
	 * 
	 * @return loginFlag(boolean)
	 */

	public boolean isLoginFlag()
	{
		return loginFlag;
	}

	/**
	 * method that sets LoginFlag
	 * 
	 * @param loginFlag The loginFlag to set.
	 */

	public void setLoginFlag(boolean loginFlag)
	{
		this.loginFlag = loginFlag;
	}

	/**
	 * method that sets RSATokenSerialNo
	 * 
	 * @param rSATokenSerialNo The rSATokenSerialNo to set.
	 */

	public void setRSATokenSerialNo(String rSATokenSerialNo)
	{
		RSATokenSerialNo = rSATokenSerialNo;
	}

	/**
	 * method that gets RSATokenSerialNo
	 * 
	 * @return RSATokenSerialNo(String)
	 */

	public String getRSATokenSerialNo()
	{
		return RSATokenSerialNo;
	}

	/**
	 * method that gets isLoginSuccess
	 * 
	 * @return isLoginSuccess(boolean)
	 */
	public boolean isLoginSuccess()
	{
		return isLoginSuccess;
	}

	/**
	 * method that sets LoginSuccess
	 * 
	 * @param isLoginSuccess The isLoginSuccess to set.
	 */
	public void setLoginSuccess(boolean isLoginSuccess)
	{
		this.isLoginSuccess = isLoginSuccess;
	}

	/**
	 * method that gets isSimulated
	 * 
	 * @return isSimulated(boolean)
	 */

	public boolean isSimulated()
	{
		return isSimulated;
	}

	/**
	 * method that sets Simulated
	 * 
	 * @param isSimulated The isSimulated to set.
	 */

	public void setSimulated(boolean isSimulated)
	{
		this.isSimulated = isSimulated;
	}

	/**
	 * method that gets simulatingUserNo
	 * 
	 * @return simulatingUserNo(String)
	 */

	public String getSimulatingUserNo()
	{
		return simulatingUserNo;
	}

	/**
	 * method that sets SimulatingUserNo
	 * 
	 * @param simulatingUserNo The simulatingUserNo to set.
	 */

	public void setSimulatingUserNo(String simulatingUserNo)
	{
		this.simulatingUserNo = simulatingUserNo;
	}

	/**
	 * method that gets requestIp
	 * 
	 * @return requestIp(String)
	 */

	public String getRequestIp()
	{
		return requestIp;
	}

	/**
	 * method that sets RequestIp
	 * 
	 * @param requestIp The requestIp to set.
	 */

	public void setRequestIp(String requestIp)
	{
		this.requestIp = requestIp;
	}

	/**
	 * method that gets sessionId
	 * 
	 * @return sessionId(String)
	 */
	public String getSessionId()
	{
		return sessionId;
	}

	/**
	 * method that sets SessionId
	 * 
	 * @param sessionId The sessionId to set.
	 */

	public void setSessionId(String sessionId)
	{
		this.sessionId = sessionId;
	}

	/**
	 * method that gets userAgent
	 * 
	 * @return userAgent(String)
	 */

	public String getUserAgent()
	{
		return userAgent;
	}

	/**
	 * method that sets UserAgent
	 * 
	 * @param userAgent The userAgent to set.
	 */

	public void setUserAgent(String userAgent)
	{
		this.userAgent = userAgent;
	}

	/***
	 * method that gets urgentAlertsCounter
	 * 
	 * @return urgentAlertsCounter(int)
	 */

	public int getUrgentAlertsCounter()
	{
		return urgentAlertsCounter;
	}

	/**
	 * method that sets UrgentAlertsCounter
	 * 
	 * @param urgentAlertsCounter The urgentAlertsCounter to set.
	 */
	public void setUrgentAlertsCounter(int urgentAlertsCounter)
	{
		this.urgentAlertsCounter = urgentAlertsCounter;
	}

	/***
	 * method that gets alertId
	 * 
	 * @return alertId(String)
	 */

	public String getAlertId()
	{

		return alertId;

	}

	/**
	 * method that sets AlertId
	 * 
	 * @param alertId The alertId to set.
	 */

	public void setAlertId(String alertId)
	{

		this.alertId = alertId;

	}

	/***
	 * method that gets normalAlertsCounter
	 * 
	 * @return normalAlertsCounter(int)
	 */

	public int getNormalAlertsCounter()
	{
		return normalAlertsCounter;
	}

	/***
	 * method that gets eventId
	 * 
	 * @return eventId(String)
	 */

	public String getEventId()
	{

		return eventId;

	}

	/**
	 * method that sets eventId
	 * 
	 * @param eventId The eventId to set.
	 */

	public void setEventId(String eventId)
	{

		this.eventId = eventId;

	}

	/***
	 * method that gets channelId
	 * 
	 * @return channelId(String)
	 */

	public String getChannelId()
	{

		return channelId;

	}

	/**
	 * method that sets channelId
	 * 
	 * @param channelId The channelId to set.
	 */

	public void setChannelId(String channelId)
	{

		this.channelId = channelId;

	}

	/**
	 * method that sets normalAlertsCounter
	 * 
	 * @param normalAlertsCounter The normalAlertsCounter to set.
	 */

	public void setNormalAlertsCounter(int normalAlertsCounter)
	{
		this.normalAlertsCounter = normalAlertsCounter;
	}

	/***
	 * method that checks whether reauthentication is required or not
	 * 
	 * @return isReAuthRequired(boolean)
	 */

	public boolean isReAuthRequired()
	{
		return isReAuthRequired;
	}

	/**
	 * method that sets isReAuthRequired
	 * 
	 * @param isReAuthRequired The isReAuthRequired to set.
	 */

	public void setReAuthRequired(boolean isReAuthRequired)
	{
		this.isReAuthRequired = isReAuthRequired;
	}

	/***
	 * method that gets mAmtFormat
	 * 
	 * @return mAmtFormat(String)
	 */

	public String getmAmtFormat()
	{
		return mAmtFormat;
	}

	/**
	 * method that sets mAmtFormat
	 * 
	 * @param mAmtFormat The mAmtFormat to set.
	 */

	public void setmAmtFormat(String mAmtFormat)
	{
		this.mAmtFormat = mAmtFormat;
	}

	/***
	 * method that gets armorTicket
	 * 
	 * @return armorTicket(String)
	 */

	public String getArmorTicket()
	{
		return armorTicket;
	}

	/**
	 * method that sets armorTicket
	 * 
	 * @param armorTicket The armorTicket to set.
	 */

	public void setArmorTicket(String armorTicket)
	{
		this.armorTicket = armorTicket;
	}

	/***
	 * method that gets customerType
	 * 
	 * @return customerType(String)
	 */

	public String getCustomerType()
	{
		return customerType;
	}

	/**
	 * method that sets customerType
	 * 
	 * @param customerType The customerType to set.
	 */

	public void setCustomerType(String customerType)
	{
		this.customerType = customerType;
	}

	/***
	 * method that gets idleCount
	 * 
	 * @return idleCount(String)
	 */

	public String getIdleCount()
	{
		return idleCount;
	}

	/**
	 * method that sets idleCount
	 * 
	 * @param idleCount The idleCount to set.
	 */

	public void setIdleCount(String idleCount)
	{
		this.idleCount = idleCount;
	}

	/***
	 * method that gets sessionCount
	 * 
	 * @return sessionCount(String)
	 */
	public String getSessionCount()
	{
		return sessionCount;
	}

	/**
	 * method that sets sessionCount
	 * 
	 * @param sessionCount The sessionCount to set.
	 */

	public void setSessionCount(String sessionCount)
	{
		this.sessionCount = sessionCount;
	}

	/***
	 * method that gets timeStamp
	 * 
	 * @return timeStamp(String)
	 */

	public String getTimeStamp()
	{
		return timeStamp;
	}

	/**
	 * method that sets timeStamp
	 * 
	 * @param timeStamp The timeStamp to set.
	 */

	public void setTimeStamp(String timeStamp)
	{
		this.timeStamp = timeStamp;
	}

	/***
	 * method that gets mapAds
	 * 
	 * @return mapAds(HashMap)
	 */

	public HashMap getMapAds()
	{
		return mapAds;
	}

	/**
	 * method that sets mapAds
	 * 
	 * @param mapAds The mapAds to set.
	 */

	public void setMapAds(HashMap mapAds)
	{
		this.mapAds = mapAds;
	}

	/***
	 * method that gets roles
	 * 
	 * @return roles(String)
	 */
	public String getRoles()
	{
		return roles;
	}

	/**
	 * method that sets roles
	 * 
	 * @param roles The roles to set.
	 */

	public void setRoles(String roles)
	{
		this.roles = roles;
	}

	/***
	 * method that gets rolesDesc
	 * 
	 * @return rolesDesc(String)
	 */

	public String getRolesDesc()
	{
		return rolesDesc;
	}

	/**
	 * method that sets rolesDesc
	 * 
	 * @param rolesDesc The rolesDesc to set.
	 */

	public void setRolesDesc(String rolesDesc)
	{
		this.rolesDesc = rolesDesc;
	}

	/***
	 * method that gets functionCode
	 * 
	 * @return functionCode(String[])
	 */

	public String[] getFunctionCode()
	{
		return functionCode;
	}

	/**
	 * method that sets functionCode
	 * 
	 * @param functionCode The functionCode to set.
	 */

	public void setFunctionCode(String[] functionCode)
	{
		this.functionCode = functionCode;
	}

	/***
	 * method that gets currDate
	 * 
	 * @return currDate(String)
	 */
	public String getCurrDate()
	{
		return currDate;
	}

	/**
	 * method that sets CurrDate
	 * 
	 * @param datex The date to set.
	 */

	public void setCurrDate(String datex)
	{
		this.currDate = datex;
	}

	/***
	 * method that gets dispDate
	 * 
	 * @return dispDate(String)
	 */
	public String getDispDate()
	{
		return dispDate;
	}

	/**
	 * method that sets DispDate
	 * 
	 * @param datex The DispDate to set.
	 */

	public void setDispDate(String datex)
	{
		this.dispDate = datex;
	}

	/***
	 * method that gets FIRST_NAME
	 * 
	 * @return FIRST_NAME(String)
	 */

	public String getFIRST_NAME()
	{
		return FIRST_NAME;
	}

	/***
	 * method that gets LAST_NAME
	 * 
	 * @return LAST_NAME(String)
	 */

	public String getLAST_NAME()
	{
		return LAST_NAME;
	}

	/***
	 * method that gets MIDDLE_NAME
	 * 
	 * @return MIDDLE_NAME(String)
	 */

	public String getMIDDLE_NAME()
	{
		return MIDDLE_NAME;
	}

	/***
	 * method that gets strCity
	 * 
	 * @return strCity(String)
	 */

	public String getCity()
	{
		return strCity;
	}

	/***
	 * method that gets dtDOB
	 * 
	 * @return dtDOB(Date)
	 */
	public Date getDOB()
	{
		return dtDOB;
	}

	/**
	 * method that sets First Name
	 * 
	 * @param string The First Name to set.
	 */
	public void setFIRST_NAME(String string)
	{
		FIRST_NAME = string;
	}

	/**
	 * method that sets Last Name
	 * 
	 * @param string The Last Name to set.
	 */
	public void setLAST_NAME(String string)
	{
		LAST_NAME = string;
	}

	/**
	 * method that sets Middle Name
	 * 
	 * @param string The Middle Name to set.
	 */
	public void setMIDDLE_NAME(String string)
	{
		MIDDLE_NAME = string;
	}

	/**
	 * method that sets City
	 * 
	 * @param string The strCity to set.
	 */

	public void setCity(String strCity)
	{
		this.strCity = strCity;
	}

	/**
	 * method that sets DOB
	 * 
	 * @param Date The Date to set.
	 */

	public void setDOB(Date dtDOB)
	{
		this.dtDOB = dtDOB;
	}

	/**
	 * method that sets RejectedAutherisations
	 * 
	 * @param rejectedAutherisations The rejectedAutherisations to set.
	 */

	public void setRejectedAutherisations(int rejectedAutherisations)
	{
		this.rejectedAutherisations = rejectedAutherisations;
	}

	/***
	 * method that gets rejectedAutherisations
	 * 
	 * @return rejectedAutherisations(int)
	 */

	public int getRejectedAutherisations()
	{
		return rejectedAutherisations;
	}

	public UserValue()
	{
	}

	/**
	 * method that sets ArmorUser
	 * 
	 * @param mUser(Object) The ArmorUser to set.
	 */

	public void setArmorUser(Object mUser)
	{
		this.mUser = mUser;
	}

	/***
	 * method that gets ArmorUser
	 * 
	 * @return mUser(Object)
	 */

	public Object getArmorUser()
	{
		return mUser;
	}

	/**
	 * method that sets Response
	 * 
	 * @param Response The Response to set.
	 */

	public void setResponse(String response)
	{
		this.response = response;
	}

	/***
	 * method that gets response
	 * 
	 * @return response(String)
	 */

	public String getResponse()
	{
		return response;
	}

	/**
	 * method that sets UrlDesc
	 * 
	 * @param UrlDesc The UrlDesc to set.
	 */

	public void setUrlDesc(String urlDesc)
	{
		this.urlDesc = urlDesc;
	}

	/***
	 * method that gets UrlDesc
	 * 
	 * @return urlDesc(String)
	 */

	public String getUrlDesc()
	{
		return urlDesc;
	}

	/**
	 * method that sets invalidAttempts
	 * 
	 * @param invalidAttempts The invalidAttempts to set.
	 */

	public void setInvalidAttempts(String invalidAttempts)
	{
		this.invalidAttempts = invalidAttempts;
	}

	/***
	 * method that gets InvalidAttempts
	 * 
	 * @return invalidAttempts(String)
	 */

	public String getInvalidAttempts()
	{
		return invalidAttempts;
	}

	/**
	 * method that sets PendingBatchAutherisations
	 * 
	 * @param PendingBatchAutherisations The PendingBatchAutherisations to set.
	 */

	public void setPendingBatchAutherisations(int pendingBatchAutherisations)
	{
		this.pendingBatchAutherisations = pendingBatchAutherisations;
	}

	/***
	 * method that gets PendingBatchAutherisations
	 * 
	 * @return pendingBatchAutherisations(int)
	 */

	public int getPendingBatchAutherisations()
	{
		return pendingBatchAutherisations;
	}

	/**
	 * method that sets PendingAutherisations
	 * 
	 * @param PendingAutherisations The PendingAutherisations to set.
	 */

	public void setPendingAutherisations(int pendingAutherisations)
	{
		this.pendingAutherisations = pendingAutherisations;
	}

	/***
	 * method that gets PendingAutherisations
	 * 
	 * @return pendingAutherisations(int)
	 */

	public int getPendingAutherisations()
	{
		return pendingAutherisations;
	}

	/**
	 * method that sets PendingMails
	 * 
	 * @param PendingMails The PendingMails to set.
	 */

	public void setPendingMails(int pendingMails)
	{
		this.pendingMails = pendingMails;
	}

	/***
	 * method that gets PendingMails
	 * 
	 * @return pendingMails(int)
	 */

	public int getPendingMails()
	{
		return pendingMails;
	}

	/**
	 * method that sets DynamicMsgs
	 * 
	 * @param DynamicMsgs The DynamicMsgs to set.
	 */

	public void setDynamicMsgs(String dynamicMsgs)
	{
		this.dynamicMsgs = dynamicMsgs;
	}

	/***
	 * method that gets DynamicMsgs
	 * 
	 * @return dynamicMsgs(String)
	 */

	public String getDynamicMsgs()
	{
		return dynamicMsgs;
	}

	/**
	 * method that sets StaticMsgs
	 * 
	 * @param StaticMsgs The StaticMsgs to set.
	 */

	public void setStaticMsgs(String staticMsgs)
	{
		this.staticMsgs = staticMsgs;
	}

	/***
	 * method that gets StaticMsgs
	 * 
	 * @return staticMsgs(String)
	 */

	public String getStaticMsgs()
	{
		return staticMsgs;
	}

	/**
	 * method that sets PrimaryCorporate
	 * 
	 * @param PrimaryCorporate The PrimaryCorporate to set.
	 */

	public void setPrimaryCorporate(String primaryCorporate)
	{
		this.primaryCorporate = primaryCorporate;
	}

	/***
	 * method that gets PrimaryCorporate
	 * 
	 * @return primaryCorporate(String)
	 */

	public String getPrimaryCorporate()
	{
		return primaryCorporate;
	}

	/**
	 * method that sets PrimaryGcif
	 * 
	 * @param PrimaryGcif The PrimaryGcif to set.
	 */

	public void setPrimaryGcif(String primaryGcif)
	{
		this.primaryGcif = primaryGcif;
	}

	/***
	 * method that gets PrimaryGcif
	 * 
	 * @return primaryGcif(String)
	 */

	public String getPrimaryGcif()
	{
		return primaryGcif;
	}

	/**
	 * method that gets PrimaryCif
	 * 
	 * @return Returns the primaryCif.
	 */
	public String getPrimaryCif()
	{
		return primaryCif;
	}

	/**
	 * method that sets PrimaryCif
	 * 
	 * @param primaryCif The primaryCif to set.
	 */
	public void setPrimaryCif(String primaryCif)
	{
		this.primaryCif = primaryCif;
	}

	/**
	 * method that sets GcifNo
	 * 
	 * @param gcifNo The gcifNo to set.
	 */

	public void setGcifNo(String[] gcifNo)
	{
		this.gcifNo = gcifNo;
	}

	/**
	 * method that gets GcifNo
	 * 
	 * @return Returns the gcifNo.
	 */
	public String[] getGcifNo()
	{
		return gcifNo;
	}

	/**
	 * method that gets CifNo
	 * 
	 * @return Returns the cifNo.
	 */
	public String[] getCifNo()
	{
		return cifNo;
	}

	/**
	 * method that sets CifNo
	 * 
	 * @param cifNo The cifNo to set.
	 */
	public void setCifNo(String[] cifNo)
	{
		this.cifNo = cifNo;
	}

	/**
	 * method that sets CorporateNames
	 * 
	 * @param CorporateNames The CorporateNames to set.
	 */

	public void setCorporateNames(String[] corporateNames)
	{
		this.corporateNames = corporateNames;
	}

	/**
	 * method that gets CorporateNames
	 * 
	 * @return Returns the corporateNames
	 */

	public String[] getCorporateNames()
	{
		return corporateNames;
	}

	/**
	 * method that sets GcifCount
	 * 
	 * @param GcifCount The GcifCount to set.
	 */

	public void setGcifCount(int gcifCount)
	{
		this.gcifCount = gcifCount;
	}

	/**
	 * method that gets GcifCount
	 * 
	 * @return Returns the GcifCount
	 */

	public int getGcifCount()
	{
		return gcifCount;
	}

	/**
	 * method that sets LastLogin
	 * 
	 * @param LastLogin The LastLogin to set.
	 */

	public void setLastLogin(String lastLogin)
	{
		this.lastLogin = lastLogin;
	}

	/**
	 * method that gets LastLogin
	 * 
	 * @return Returns the lastLogin
	 */

	public String getLastLogin()
	{
		return lastLogin;
	}

	/**
	 * method that sets LangId
	 * 
	 * @param LangId The LangId to set.
	 */

	public void setLangId(String langId)
	{
		this.langId = langId;
	}

	/**
	 * method that gets LangId
	 * 
	 * @return Returns the langId
	 */

	public String getLangId()
	{
		return langId;
	}

	/**
	 * method that sets ChangeStyle
	 * 
	 * @param ChangeStyle The ChangeStyle to set.
	 */

	public void setChangeStyle(String ChangeStyle)
	{
		this.ChangeStyle = ChangeStyle;
	}

	/**
	 * method that gets ChangeStyle
	 * 
	 * @return Returns the ChangeStyle
	 */

	public String getChangeStyle()
	{
		return ChangeStyle;
	}

	/**
	 * method that sets AmountId
	 * 
	 * @param AmountId The AmountId to set.
	 */

	public void setAmountId(String amountId)
	{
		this.amountId = amountId;
	}

	/**
	 * method that gets AmountId
	 * 
	 * @return Returns the ChangeStyle
	 */

	public String getAmountId()
	{
		return amountId;
	}

	/**
	 * method that sets DateId
	 * 
	 * @param DateId The DateId to set.
	 */

	public void setDateId(String dateId)
	{
		this.dateId = dateId;
	}

	/**
	 * method that gets DateId
	 * 
	 * @return Returns the dateId
	 */

	public String getDateId()
	{
		return dateId;
	}

	/**
	 * method that sets UrlId
	 * 
	 * @param UrlId The UrlId to set.
	 */

	public void setUrlId(String urlId)
	{
		this.urlId = urlId;
	}

	/**
	 * method that gets UrlId
	 * 
	 * @return Returns the urlId
	 */

	public String getUrlId()
	{
		return urlId;
	}

	/**
	 * method that sets NewLoginId
	 * 
	 * @param NewLoginId The NewLoginId to set.
	 */

	public void setNewLoginId(String newLoginId)
	{
		this.newLoginId = newLoginId;
	}

	/**
	 * method that gets NewLoginId
	 * 
	 * @return Returns the newLoginId
	 */

	public String getNewLoginId()
	{
		return newLoginId;
	}

	/**
	 * method that sets NewPin
	 * 
	 * @param NewPin The NewPin to set.
	 */

	public void setNewPin(String newPin)
	{
		this.newPin = newPin;
	}

	/**
	 * method that gets NewPin
	 * 
	 * @return Returns the newPin
	 */

	public String getNewPin()
	{
		return newPin;
	}

	/**
	 * method that sets UserPin
	 * 
	 * @param UserPin The UserPin to set.
	 */

	public void setUserPin(String userPin)
	{
		this.userPin = userPin;
	}

	/**
	 * method that gets UserPin
	 * 
	 * @return Returns the userPin
	 */

	public String getUserPin()
	{
		return userPin;
	}

	/**
	 * method that sets TransactionStatus
	 * 
	 * @param TransactionStatus The TransactionStatus to set.
	 */

	public void setTransactionStatus(String transactionStatus)
	{
		this.transactionStatus = transactionStatus;
	}

	/**
	 * method that gets TransactionStatus
	 * 
	 * @return Returns the transactionStatus
	 */

	public String getTransactionStatus()
	{
		return transactionStatus;
	}

	/**
	 * method that sets TransactionCode
	 * 
	 * @param TransactionCode The TransactionCode to set.
	 */

	public void setTransactionCode(String transactionCode)
	{
		this.transactionCode = transactionCode;
	}

	/**
	 * method that gets TransactionCode
	 * 
	 * @return Returns the transactionCode
	 */

	public String getTransactionCode()
	{
		return transactionCode;
	}

	/**
	 * method that sets Info
	 * 
	 * @param Info The Info to set.
	 */

	public void setInfo(String info)
	{
		this.info = info;
	}

	/**
	 * method that gets Info
	 * 
	 * @return Returns the info
	 */
	public String getInfo()
	{
		return info;
	}

	/**
	 * method that sets UserNo
	 * 
	 * @param UserNo The UserNo to set.
	 */

	public void setUserNo(String userNo)
	{
		this.userNo = userNo;
	}

	/**
	 * method that gets UserNo
	 * 
	 * @return Returns the userNo
	 */

	public String getUserNo()
	{
		return userNo;
	}

	/**
	 * method that sets RSAPin
	 * 
	 * @param RSAPin The RSAPin to set.
	 * 
	 */
	public void setRSAPin(java.lang.String rsaPin)
	{
		this.rsaPin = rsaPin;
	}

	/**
	 * method that gets RSAPin
	 * 
	 * @return Returns the rsaPin
	 */
	public java.lang.String getRSAPin()
	{
		return rsaPin;
	}

	/**
	 * method that sets StatusFlag
	 * 
	 * @param StatusFlag The StatusFlag to set.
	 * 
	 */

	public void setStatusFlag(String statusFlag)
	{
		this.statusFlag = statusFlag;
	}

	/**
	 * method that gets StatusFlag
	 * 
	 * @return Returns the statusFlag
	 */

	public String getStatusFlag()
	{
		return statusFlag;
	}

	/**
	 * method that sets LoginId
	 * 
	 * @param loginId The loginId to set.
	 * 
	 */

	public void setLoginId(String loginId)
	{
		this.loginId = loginId;
	}

	/**
	 * method that gets LoginId
	 * 
	 * @return Returns the loginId
	 */

	public String getLoginId()
	{
		return loginId;
	}

	/**
	 * method that sets AuthenticationType
	 * 
	 * @param AuthenticationType The AuthenticationType to set.
	 * 
	 */

	public void setAuthenticationType(String authenticationType)
	{
		this.authenticationType = authenticationType;
	}

	/**
	 * method that gets AuthenticationType
	 * 
	 * @return Returns the authenticationType
	 */

	public String getAuthenticationType()
	{
		return authenticationType;
	}

	/**
	 * method that sets CertificateNo
	 * 
	 * @param CertificateNo The CertificateNo to set.
	 * 
	 */

	public void setCertificateNo(String certificateNo)
	{
		this.certificateNo = certificateNo;
	}

	/**
	 * method that gets CertificateNo
	 * 
	 * @return Returns the certificateNo
	 */

	public String getCertificateNo()
	{
		return certificateNo;
	}

	/**
	 * method that sets UserPreference
	 * 
	 * @param UserPreference The UserPreference to set.
	 * 
	 */

	public void setUserPreference(CorporatePreferenceValue corpPrepVal)
	{
		this.corpPrepVal = corpPrepVal;
	}

	/**
	 * method that gets UserPreference
	 * 
	 * @return Returns the UserPreference
	 */

	public CorporatePreferenceValue getUserPreference()
	{
		return corpPrepVal;
	}

	/**
	 * method that gets SeclangId
	 * 
	 * @return Returns the SeclangId
	 */

	public String getSeclangId()
	{
		return seclangId;
	}

	/**
	 * method that sets SeclangId
	 * 
	 * @param SeclangId The SeclangId to set.
	 * 
	 */

	public void setSeclangId(String seclangId)
	{
		this.seclangId = seclangId;
	}

	/**
	 * method that gets EnaSecLang
	 * 
	 * @return Returns the EnaSecLang
	 */

	public String getEnaSecLang()
	{
		return enaSecLang;
	}

	/**
	 * method that sets EnaSecLang
	 * 
	 * @param EnaSecLang The EnaSecLang to set.
	 * 
	 */

	public void setEnaSecLang(String enaSecLang)
	{
		this.enaSecLang = enaSecLang;
	}

	/**
	 * method that gets startUpWorkSpaceId
	 * 
	 * @return Returns the startUpWorkSpaceId
	 */

	public String getStartUpWorkSpaceId()
	{
		return startUpWorkSpaceId;
	}

	/**
	 * method that sets StartUpWorkSpaceId
	 * 
	 * @param StartUpWorkSpaceId The StartUpWorkSpaceId to set.
	 * 
	 */

	public void setStartUpWorkSpaceId(String startUpWorkSpaceId)
	{
		this.startUpWorkSpaceId = startUpWorkSpaceId;
	}

	/**
	 * method that gets TimeZoneId
	 * 
	 * @return Returns the TimeZoneId
	 */

	public String getTimeZoneId()
	{
		return mTimeZoneId;
	}

	/**
	 * method that sets TimeZoneId
	 * 
	 * @param TimeZoneId The TimeZoneId to set.
	 * 
	 */

	public void setTimeZoneId(String timeZoneId)
	{
		this.mTimeZoneId = timeZoneId;
	}

	/**
	 * Returns the Map containing custom SSO properties identified. Note: All users of the custom properties should
	 * ensure that only objects which have implemented java.io.Serializable should be added to this custom properties
	 * hashmap. This is important to ensure that the User Value (which may get added to the session) is fully
	 * Serializable.
	 * 
	 * @return HashMap
	 * @see com.intellectdesign.canvas.value.IUserValue#getCustomSSOProperties()
	 */
	public HashMap getCustomSSOProperties()
	{
		if (mCustomSSOProperties == null)
			mCustomSSOProperties = new HashMap();
		return mCustomSSOProperties;
	}
	public void setCustomSSOProperties(HashMap customSessionMap)
	{
	 mCustomSSOProperties=customSessionMap;
	}

	/**
	 * method that gets RateCard
	 * 
	 * @return Returns the RateCard
	 */

	public String getRateCard()
	{
		return rateCard;
	}

	/**
	 * method that sets RateCard
	 * 
	 * @param RateCard The RateCard to set.
	 * 
	 */

	public void setRateCard(String rateCard)
	{
		this.rateCard = rateCard;
	}

	/**
	 * method that gets EquivalentCurrency
	 * 
	 * @return Returns the EquivalentCurrency
	 */

	public String getEquivalentCurrency()
	{
		return equivalentCurrency;
	}

	/**
	 * method that sets EquivalentCurrency
	 * 
	 * @param EquivalentCurrency The EquivalentCurrency to set.
	 * 
	 */

	public void setEquivalentCurrency(String equivalentCurrency)
	{
		this.equivalentCurrency = equivalentCurrency;
	}

	/**
	 * method that gets RateCardCurrencies
	 * 
	 * @return Returns the list of RateCardCurrencies
	 */

	public List getRateCardCurrencies()
	{
		return rateCardCurrencies;
	}

	/**
	 * method that sets RateCardCurrencies
	 * 
	 * @param RateCardCurrencies The RateCardCurrencies to set.
	 * 
	 */

	public void setRateCardCurrencies(List rateCardCurrencies)
	{
		this.rateCardCurrencies = rateCardCurrencies;
	}

	/**
	 * method that sets SessionTicket
	 * 
	 * @param SessionTicket TheSessionTicket to set.
	 * 
	 */

	public void setSessionTicket(String sessionTicket)
	{
		this.sessionTicket = sessionTicket;
	}

	/**
	 * method that gets SessionTicket
	 * 
	 * @return Returns the SessionTicket
	 */

	public String getSessionTicket()
	{
		return sessionTicket;
	}

	/**
	 * method that sets ThemeId
	 * 
	 * @param ThemeId The ThemeId to set.
	 * 
	 */
	public void setThemeId(String themeId)

	{

		this.themeId = themeId;

	}

	/**
	 * method that gets ThemeId
	 * 
	 * @return Returns the ThemeId
	 */

	public String getThemeId()

	{

		return themeId;

	}

	/**
	 * method that sets FontsizeId
	 * 
	 * @param FontsizeId The FontsizeId to set.
	 * 
	 */

	public void setFontsizeId(String fontsizeId)

	{

		this.fontsizeId = fontsizeId;

	}

	/**
	 * method that gets FontsizeId
	 * 
	 * @return Returns the FontsizeId
	 */

	public String getFontsizeId()

	{

		return fontsizeId;

	}

	/**
	 * method that sets Direction
	 * 
	 * @param direction set the direction of the user's language
	 */
	public void setDirection(String direction)
	{
		this.direction = direction;
	}

	/**
	 * method that gets direction of the user's language
	 * 
	 * @return the direction of the user's language
	 */
	public String getDirection()
	{
		if (direction != null)
			return direction;
		else
			return "LTR";
	}

	/**
	 * ref to methd getdevice
	 * 
	 * @return the deviceBand
	 */
	public String getDeviceBand()
	{
		return deviceBand;
	}

	/**
	 * ref to methd DEVICEBand
	 * 
	 * @param deviceBand the deviceBand to set
	 */
	public void setDeviceBand(String deviceBand)
	{
		this.deviceBand = deviceBand;
	}

	/**
	 * ref to method GetReqURI
	 * 
	 * @return the requestURI
	 */
	public String getRequestURI()
	{
		return requestURI;
	}

	/**
	 * ref to method SetRequest URI
	 * 
	 * @param requestURI the requestURI to set
	 */
	public void setRequestURI(String requestURI)
	{
		this.requestURI = requestURI;
	}

	/**
	 * @return the userRole
	 */
	public String getUserRole()
	{
		return userRole;
	}

	/**
	 * @param userRole - the userRole to set
	 */
	public void setUserRole(String userRole)
	{
		this.userRole = userRole;
	}

	/**
	 * @return the timeFormat
	 */
	public String getTimeFormat()
	{
		return timeFormat;
	}

	/**
	 * @param the timeFormat to set
	 */
	public void setTimeFormat(String timeFormat)
	{
		this.timeFormat = timeFormat;
	}

	

	/**
	 * @return the loginMode
	 */
	public String getLoginMode()
	{
		return loginMode;
	}

	/**
	 * @param loginMode the loginMode to set
	 */
	public void setLoginMode(String loginMode)
	{
		this.loginMode = loginMode;
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.value.IUserValue#getLoginFlag()
	 */
	@Override
	public boolean getLoginFlag()
	{
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public void setCustomAttrbutes(HashMap mCustomAttributes)
	{
		this.mCustomAttributes = mCustomAttributes;

	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.value.IUserValue#getCustomAttrbutes()
	 */
	@Override
	public HashMap getCustomAttrbutes()
	{
		return mCustomAttributes;
	}

	/**
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.value.IUserValue#convertToHashMap()
	 */
	public HashMap convertToHashMap()
	{
		HashMap hm = new HashMap();

		hm.put("LANGUAGE", getLangId());
		hm.put("AMOUNT", getAmountId());
		hm.put("DATEFORMAT", getDateId());
		hm.put("TIMEFORMAT", getTimeFormat());
		hm.put("CHANGESTYLE", getChangeStyle());
		hm.put("SECLANG", getSeclangId());
		hm.put("ENASECLANG", getEnaSecLang());
		hm.put("TIMEZONE", getTimeZoneId());
		hm.put("LASTLOGIN", getLastLogin());
		hm.put("STATICMSGS", getStaticMsgs());
		hm.put("DYNAMICMSGS", getDynamicMsgs());
		hm.put("CURRDATE", getCurrDate());
		hm.put("DISPDATE", getDispDate());
		hm.put("TIMESTAMP", getTimeStamp());
		hm.put("EQUIVALENTCURRENCY", getEquivalentCurrency());
		hm.put("CHANNEL", getChannelId());
		hm.put("THEME", getThemeId());
		hm.put("FONTSIZE", getFontsizeId());
		hm.put("DIRECTION", getDirection());
		hm.put("STARTUPWORKSPACEID", getStartUpWorkSpaceId());

		hm.put("REQUEST_ID", getRequestID());
		hm.put("REQUEST_URI", getRequestURI());
		hm.put("DEVICE_BAND_ID", getDeviceBand());
		hm.put("USER_ROLE", getUserRole());
		return hm;
	}
}