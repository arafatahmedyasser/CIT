/**
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

package com.intellectdesign.canvas.login.sessions;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSessionBindingEvent;
import javax.servlet.http.HttpSessionBindingListener;

import com.intellectdesign.canvas.common.UserValue;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.logging.initalizer.Log4jMDCInitializer;
import com.intellectdesign.canvas.login.handlers.LoginActions;
import com.intellectdesign.canvas.login.handlers.LoginManager;
import com.intellectdesign.canvas.session.ISessionInfo;
import com.intellectdesign.canvas.utils.CanvasThreadLocal;
import com.intellectdesign.canvas.value.IUserValue;

/**
 * This class is for session info. This contains the datas of user like loginId,userNo,loginInfo,firstName,userAgent
 * etc.
 * 
 * @version 1.0
 */

public class SessionInfo implements HttpSessionBindingListener, Serializable, ISessionInfo
{
	private static final long serialVersionUID = 1L;
	public int mnSessionStatus = -1;
	public String sCustNo;
	public String sCustCif;
	public String mSecLang;
	public String mEnaSecLang;
	public String mStartUpWorkSpaceId;
	public String mTimeZoneId;
	public String strRefCcy;
	public String msCurrDate;
	public String msDispDate;
	public String mLanguage;
	public String mLanguageDesc;
	public String mAmtFormat;
	public String mDateFormat;
	public String timeFormat = "hh:mm:ss a";
	public String mPrefPage;
	public String mPrefPageDesc;
	public HashMap msApplnCache = new HashMap();
	public String loginId;
	public String userNo;
	public String authenticationType;
	public String loginInfo;
	public String lastLogin;
	public int gcifCount;
	public String[] corporateNames;
	public String[] gcifNo;
	public String[] cifNo;
	public String primaryGcif;
	public String primaryCorporate;
	public String invalidAttempts;
	public String customerType;
	public String sessionId;
	public String styleColor;
	public String simLoginId;
	public String userAgent;// Included for Audit FrameWork
	public String rsaId;
	public String requestIp;
	public String firstName; // Included for export to excel
	public String alertId; // added for login alert
	public String middleName;// Included for export to excel
	public String lastName;// Included for export to excel
	public boolean logoutAuditStatus;
	public String subProdCode;// To support Split Deployment
	public String funcCode;// To support Split Deployment
	public boolean isWidgetMaximized; // Included for widget maximized action // handler.
	public String maximizedWidgetID; // Included for widget maximized action
										// handler.
	public boolean isSimulationMode = false;
	public String simulatingUserId = null;
	public int urgentAlertsCounter = 0;
	public int normalAlertsCounter = 0;
	public String logStatus;
	public ArrayList rateCardCurrencies = null;
	public String equivalentCurrency = null;
	/*
	 * This parameter is to uniquely identify the user's request from forgery
	 */
	public String csrfId = "";
	public String SecurityTokenSerialNo; // it is mapped to UDF16 of OD_USERS_MB
											// table in Database.
	public String customerSegment; // it is mapped to OD_CUSTOMER_MASTER_TBL
									// table in Database.
	public String themeId; // it is mapped to ORBIIBS_USER_ATTRIBUTE table in
							// Database.
	public String fontsizeId; // it is mapped to ORBIIBS_USER_ATTRIBUTE table in
								// Database.
	public String prefWorkspace; // it is mapped to ORBIIBS_USER_ATTRIBUTE table in
	// Database.

	public String layouttypeId; // it is mapped to ORBIIBS_USER_ATTRIBUTE table
								// in Database.
	public String notesMsg;

	/**
	 * direction denotes the login user's language prefrences - text rendering(RTL || LTR) mode.
	 */
	public String direction;

	public int channelId = 3;

	public int reauthCount = 0;
	public Boolean isHybrid;
	public String userRole;
	public String loginMode;

	/**
	 * Used to get hybrid value.
	 * 
	 * @return boolean
	 */
	public Boolean isHybrid()
	{
		return isHybrid;
	}

	/**
	 * Used to set the hybrid value.
	 * 
	 * @param isHybrid
	 */

	public void setHybrid(Boolean isHybrid)
	{
		this.isHybrid = isHybrid;
	}

	public HashMap formWidgetPathIdMap = new HashMap();

	/**
	 * The variable that holds in the session what type of the device it is. D = Desktop M = Mobile T = Tablet
	 */

	public String deviceType = "D";
	/**
	 * This property denotes the url from where the request came.
	 */
	public String requestURI = null;

	transient Logger logger = Logger.getLogger(SessionInfo.class);

	private HashMap<String, Object> customSessionInfo = new HashMap<String, Object>();

	/**
	 * Method is called when the user logsin and a new session is created as such which binds the cureent section with
	 * its events
	 * 
	 * @param event
	 * @see javax.servlet.http.HttpSessionBindingListener#valueBound(javax.servlet.http.HttpSessionBindingEvent)
	 */
	public void valueBound(HttpSessionBindingEvent event)
	{

		logger.ctdebug("CTLGN00039");
		return;
	}

	/**
	 * String representation of all values
	 * 
	 * @return Returns the String of all values
	 * @throws Exception
	 */

	public String toString()
	{
		StringBuffer sb = new StringBuffer("sessionId=" + sessionId);
		sb.append(";requestIp=" + requestIp);
		sb.append(";loginId=" + loginId);
		sb.append(";userNo=" + userNo);
		sb.append(";isSimulationMode=" + isSimulationMode);
		sb.append(";simulatingUserId=" + simulatingUserId);
		sb.append(";rsaId=" + rsaId);
		return sb.toString();
	}

	/**
	 * Method is called as the user logsout or the session is invalidated , this method removes all the events bound to
	 * this session
	 * 
	 * @param event
	 * @see javax.servlet.http.HttpSessionBindingListener#valueUnbound(javax.servlet.http.HttpSessionBindingEvent)
	 */
	public void valueUnbound(HttpSessionBindingEvent event)
	{
		String transCode = LoginActions.SESSION_EXPIRY.toString();
		LoginManager logn = new LoginManager();
		Log4jMDCInitializer initializer = new Log4jMDCInitializer();
		boolean isExpiry = true;
		try
		{
			if ("logout".equals(logStatus))
			{
				isExpiry = false;
				transCode = LoginActions.LOGOUT.toString();
			} else
			{
				// This is session expiry. Since this would have started off a separate thread, ensure that our MDC is initialized properly.
				String reqId = UUID.randomUUID().toString();
				String Host = "NA";
				initializer.initLog4jMDC(userNo, Host, reqId);
				CanvasThreadLocal.putAll(initializer.getMDCData());
			}
			IUserValue userValue = new UserValue();

			userValue.setUserNo(userNo);
			userValue.setSessionTicket(sessionId);
			userValue.setTransactionCode(transCode);
			userValue.setSessionId(sessionId);
			userValue.setLoginId(loginId);
			userValue.setUserAgent(userAgent);
			userValue.setRequestURI(requestURI);
			userValue = logn.handleRequest(userValue, null, this);
		} catch (Exception ex)
		{
			// Nothing to do here. Just eat it.
		} finally
		{
			if (isExpiry)
			{
				initializer.removeFromMDC();
				CanvasThreadLocal.clear();
			}
		}
	}

	/**
	 * Method used to get the CustomSessionInfo
	 * 
	 * @param key for CustomSessionInfo
	 * @return Object
	 */
	public Object getCustomSessionInfo(String key)
	{
		Object obj = customSessionInfo.get(key);
		return obj;

	}

	/**
	 * Method used to set the CustomSessionInfo
	 * 
	 * @param key for CustomSessionInfo
	 * @param Object obj
	 * @return 1 if CustomSessionInfo set or -1
	 */

	int setCustomSessionInfo(String key, Object obj)
	{
		if (obj instanceof java.io.Serializable)
		{
			customSessionInfo.put(key, obj);
			return 1;
		}
		return -1;

	}

	/**
	 * Method used for getNormalAlertsCounter
	 * 
	 * @return the normalAlertsCounter
	 */
	public int getNormalAlertsCounter()
	{
		return normalAlertsCounter;
	}

	/**
	 * Method used for set NormalAlertsCounter
	 * 
	 * @param normalAlertsCounter the normalAlertsCounter to set
	 */
	public void setNormalAlertsCounter(int normalAlertsCounter)
	{
		this.normalAlertsCounter = normalAlertsCounter;
	}

	/**
	 * Method used for get urgentAlertsCounter
	 * 
	 * @return the urgentAlertsCounter
	 */
	public int getUrgentAlertsCounter()
	{
		return urgentAlertsCounter;
	}

	/**
	 * Method used for set urgentAlertsCounter
	 * 
	 * @param urgentAlertsCounter the urgentAlertsCounter to set
	 */
	public void setUrgentAlertsCounter(int urgentAlertsCounter)
	{
		this.urgentAlertsCounter = urgentAlertsCounter;
	}

	/**
	 * Method used for get session id
	 * 
	 * @return the session id
	 */
	public String getSessionID()
	{
		return sessionId;
	}

}