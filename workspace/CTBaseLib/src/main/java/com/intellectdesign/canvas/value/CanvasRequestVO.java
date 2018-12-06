/**
 * Copyright 2015. Intellect Design Arena Limited. All rights reserved. 
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
package com.intellectdesign.canvas.value;

import java.io.Serializable;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * This is the value object that is used for passing the request from the web layer to the handler. This object cannot
 * be created directly. Instead use the CanvasRequestVO.CanvasRequestBuilder api's to create the request.
 * 
 * A Request typically has the following properties -
 * <ul>
 * <li><b>productCode</b>: This is the product code provided for the request</li>
 * <li><b>subProductCode</b>: This is the sub product code provided for the request</li>
 * <li><b>functionCode</b>: This is the function code provided for the request</li>
 * <li><b>actionCode</b>: This is the action code provided for the request</li>
 * <li><b>pageCodeType</b>: This is the page code provided for the request</li>
 * <li><b>hostCode</b>: This is the host code identified for the request</li>
 * <li><b>referenceNumber</b>: This is the reference number provided for the request. Useful for cases where this
 * request is related to an end application reference</li>
 * <li><b>requestId</b>: This is the generated request Id that is applicable for this request.</li>
 * <li><b>requestURI</b>: This is the request URI from where this request was processed</li>
 * <li><b>appServerIP</b>: This is the IP of the Application server that is going to process this request. This is
 * updated prior to the handler getting invoked at the server node</li>
 * <li><b>webServerIP</b>: This is the IP of the web server that received this request</li>
 * <li><b>sessionContext</b>: This provides the session context that is passed to the handler for it to process this
 * request. This contains the following attributes -
 * <ul>
 * <li><b>sessionId</b>: This is current active session's id</li>
 * <li><b>sessionMode</b>: This is the current session mode.</li>
 * <li><b>channelId</b>: This is the channel Id attributed with the current session</li>
 * <li><b>deviceType</b>: This is the device type identified for the current session</li>
 * <li><b>hybridAppFlag</b>: This is flag that indicates whether this is being serviced from a mobile App (Hybrid)</li>
 * <li><b>simulatedFlag</b>: This is flag that indicates whether this is session has been triggered in a simulation mode
 * </li>
 * <li><b>simulatingUserLoginId</b>: This is the login Id of the user who has triggered the application launch in
 * simulation mode</li>
 * <li><b>requestingClientIP</b>: This is the IP of the client from where the request was initiated</li>
 * <li><b>browserName</b>: This is the browser name identified from the user agent and stamped on this session</li>
 * <li><b>osName</b>: This is the OS name identified from the user agent and stamped on this session</li>
 * <li><b>userAgent</b>: This is the user agent that has been received at the time of session creation</li>
 * <li><b>customSessionInfo</b>: This is the map having the custom session attributes that were loaded into the session</li>
 * </ul>
 * </li>
 * <li><b>userContext</b>: This provides the user context that is passed to the handler for it to process this request.
 * This contains the following attributes -
 * <ul>
 * <li><b>owningGCIF</b>: This is the GCIF (ID of the entity) under which this user has been created</li>
 * <li><b>currentGCIF</b>: This is the GCIF (ID of the entity) for which this user is currently acting upon</li>
 * <li><b>userNumber</b>: This is the internal user number of this user</li>
 * <li><b>loginId</b>: This is the login Id of this user</li>
 * <li><b>userType</b>: This is the type of user</li>
 * <li><b>firstName</b>: This is the First name of the user</li>
 * <li><b>middleName</b>: This is the Middle name of the user</li>
 * <li><b>lastName</b>: This is the Last name of the user</li>
 * <li><b>mobileNumber</b>: This is the mobile number of the user</li>
 * <li><b>emailId</b>: This is the email id of the user</li>
 * <li><b>customerSegmentCode</b>: This is the customer segment code that the user belongs to</li>
 * <li><b>currentRoleId</b>: This is the ID of the Role that this user belongs to</li>
 * <li><b>authenticationType</b>: This is the primary Authentication type associated to this user</li>
 * </ul>
 * </li>
 * <li><b>prefContext</b>: This provides the Preference information for this user that is passed to the handler for it
 * to process this request. This contains the following attributes -
 * <ul>
 * <li><b>dateFormat</b>: This is the date format code in which the user would like to see all dates</li>
 * <li><b>amountFormat</b>: This is the amount format code in which the user would like to see all amounts</li>
 * <li><b>languageId</b>: This is the language Id (like en_US) in which the user would like to see all content</li>
 * <li><b>languageDirection</b>: This is the direction in which the content should be rendered. This is linked to the
 * languageId preference of the user</li>
 * <li><b>secondaryLanguageEnabled</b>: This flag indicates whether the user would like to have secondary language Id
 * preference.</li>
 * <li><b>secondaryLanguageId</b>: This is the secondary language Id (like ar_AR) that should be respected by the
 * application</li>
 * <li><b>timeZoneId</b>: This is the Timezone in which the user would like to see all time values displayed in the
 * application</li>
 * <li><b>timeDisplayFormat</b>: This is the preference that indicates how the time should be displayed (12 hours or 24
 * hours format)</li>
 * <li><b>themeId</b>: This is the preferred theme for the application as seleted by the user</li>
 * <li><b>fontSizeId</b>: This is the preferred font size in which the user would like to see the application in</li>
 * <li><b>startupWorkspaceId</b>: This is the start up workspace in which the user would like to land when they login
 * into the application</li>
 * <li><b>referenceCCY</b>: This is the reference currency to be used across Apps that would like to show amounts in an
 * equivalent currency</li>
 * <li><b>referenceRateCardId</b>: This is the reference Rate card that should be used for any currency conversion</li>
 * <li><b>additionalSettings</b>: This is a place holder for providing any additional preference settings that the end
 * application would like to be shared to the handler</li>
 * </ul>
 * </li>
 * </ul>
 * 
 * @Version 15.1
 */
public class CanvasRequestVO implements Serializable
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = 9211197852415786608L;

	// private variables
	private String functionCode;
	private String productCode;
	private String subProductCode;
	private String actionCode;
	private String pageCodeType;
	private String hostCode;
	private String referenceNumber;
	private String requestId;
	private String requestURI;
	private String appServerIP;
	private String webServerIP;
	private SessionContext sessionContext;
	private UserContext userContext;
	private UserPreferenceContext prefContext;
	private Map requestData;

	/**
	 * Default constructor for this class
	 */
	protected CanvasRequestVO()
	{
		setAppServerIP("");
		setWebServerIP("");
		setRequestId("");
		setPageCodeType("");
		setHostCode("");
		setReferenceNumber("");
		setRequestURI("");
	}

	/**
	 * Helper method that converts the object state to a String
	 * 
	 * @return The String representation of this class
	 * @see java.lang.Object#toString()
	 */
	public String toString()
	{
		StringBuilder builder = new StringBuilder();
		builder.append("Request Data : [");
		builder.append("Product Code : ").append(getProductCode());
		builder.append(",Sub Product Code : ").append(getSubProductCode());
		builder.append(",Function Code : ").append(getFunctionCode());
		builder.append(",Action Code : ").append(getActionCode());
		builder.append(",Page Code : ").append(getPageCodeType());
		builder.append(",Host Code : ").append(getHostCode());
		builder.append(",Request Id : ").append(getRequestId());
		builder.append(",Request URI : ").append(getRequestURI());
		builder.append(",Reference Number : ").append(getReferenceNumber());
		builder.append(",App Server IP : ").append(getAppServerIP());
		builder.append(",Web Server IP : ").append(getWebServerIP());
		builder.append(",").append(getSessionContext().toString());
		builder.append(",").append(getUserContext().toString());
		builder.append(",").append(getUserPreferenceContext().toString());
		builder.append(",Request Data : ").append(getRequestData());
		builder.append("]");
		return builder.toString();
	}

	/**
	 * returns the request id.
	 * 
	 * @return the requestId.
	 */
	public final String getRequestId()
	{
		return requestId;
	}

	/**
	 * return the host code.
	 * 
	 * @return the hostCode
	 */
	public final String getHostCode()
	{
		return hostCode;
	}

	/**
	 * gets the webServerIP.
	 * 
	 * @return the webServerIP
	 */
	public final String getWebServerIP()
	{
		return webServerIP;
	}

	/**
	 * gets the appServerIP
	 * 
	 * @return the appServerIP.
	 */
	public final String getAppServerIP()
	{
		return appServerIP;
	}

	/**
	 * get the function code.
	 * 
	 * @return the functionCode
	 */
	public final String getFunctionCode()
	{
		return functionCode;
	}

	/**
	 * gets the product code.
	 * 
	 * @return the productCode.
	 */
	public final String getProductCode()
	{
		return productCode;
	}

	/**
	 * gets the sub product code.
	 * 
	 * @return the subProductCode
	 */
	public final String getSubProductCode()
	{
		return subProductCode;
	}

	/**
	 * gets the Reference Number set for this request. This can be used for tracking a paticular request sent by the
	 * device
	 * 
	 * @return the referenceNumber
	 */
	public final String getReferenceNumber()
	{
		return referenceNumber;
	}

	/**
	 * gets the sessionContext
	 * 
	 * @return the sessionContext
	 */
	public final SessionContext getSessionContext()
	{
		return sessionContext;
	}

	/**
	 * gets the userContext
	 * 
	 * @return the userContext
	 */
	public final UserContext getUserContext()
	{
		return userContext;
	}

	/**
	 * gets the user preference context
	 * 
	 * @return the prefContext
	 */
	public final UserPreferenceContext getUserPreferenceContext()
	{
		return prefContext;
	}

	/**
	 * gets the pagecode type.
	 * 
	 * @return the pageCodeType
	 */
	public final String getPageCodeType()
	{
		return pageCodeType;
	}

	/**
	 * gets the action cod.
	 * 
	 * @return the actionCode
	 */
	public final String getActionCode()
	{
		return actionCode;
	}

	/**
	 * gets the requestURI
	 * 
	 * @return the requestURI
	 */
	public final String getRequestURI()
	{
		return requestURI;
	}

	/**
	 * gets the requestData
	 * 
	 * @return the requestData
	 */
	public final Map getRequestData()
	{
		return requestData;
	}

	/**
	 * sets the action code.
	 * 
	 * @param actioncode : action for the request passed
	 */
	protected void setActionCode(final String actioncode)
	{
		this.actionCode = actioncode;
	}

	/**
	 * sets the requestId.
	 * 
	 * @param reqId the requestId to set
	 */
	protected void setRequestId(final String reqId)
	{
		this.requestId = reqId;
	}

	/**
	 * sets the host code.
	 * 
	 * @param txncode the hostCode to set
	 */
	protected void setHostCode(final String txncode)
	{
		this.hostCode = txncode;
	}

	/**
	 * sets the webServerIP.
	 * 
	 * @param ipAddress the webServerIP to set
	 */
	protected void setWebServerIP(final String ipAddress)
	{
		this.webServerIP = ipAddress;
	}

	/**
	 * sets the appServerIP. This is made public as this is the only attribute that can be modified by the handler to
	 * ensure that the details of the node handling the same can be updated into the request
	 * 
	 * @param ipAddress the appServerIP to set
	 */
	public void setAppServerIP(final String ipAddress)
	{
		this.appServerIP = ipAddress;
	}

	/**
	 * sets the function code.
	 * 
	 * @param functioncode the functionCode to set
	 */
	protected void setFunctionCode(final String functioncode)
	{
		this.functionCode = functioncode;
	}

	/**
	 * sets the product code.
	 * 
	 * @param productcode the productCode to set
	 */
	protected void setProductCode(final String productcode)
	{
		this.productCode = productcode;
	}

	/**
	 * sets the sub product.
	 * 
	 * @param subProductcode the subProductCode to set
	 */
	protected void setSubProductCode(final String subProductcode)
	{
		this.subProductCode = subProductcode;
	}

	/**
	 * sets the ref no.
	 * 
	 * @param refno the referenceNumber to set
	 */
	protected void setReferenceNumber(final String refno)
	{
		this.referenceNumber = refno;
	}

	/**
	 * sets the sessionContext
	 * 
	 * @param sessContext the sessionContext to set
	 */
	protected void setSessionContext(final SessionContext sessContext)
	{
		this.sessionContext = sessContext;
	}

	/**
	 * sets the userContext
	 * 
	 * @param usrContext the userContext to set
	 */
	protected void setUserContext(final UserContext usrContext)
	{
		this.userContext = usrContext;
	}

	/**
	 * sets the prefContext
	 * 
	 * @param prfContext the prefContext to set
	 */
	protected void setUserPreferenceContext(final UserPreferenceContext prfContext)
	{
		this.prefContext = prfContext;
	}

	/**
	 * sets the pagecodetype.
	 * 
	 * @param pagecodetype the pageCodeType to set
	 */
	protected void setPageCodeType(final String pagecodetype)
	{
		this.pageCodeType = pagecodetype;
	}

	/**
	 * sets the requestURI.
	 * 
	 * @param reqURI the requestURI to set
	 */
	protected void setRequestURI(final String reqURI)
	{
		this.requestURI = reqURI;
	}

	/**
	 * sets the requestData
	 * 
	 * @param reqData the requestData to set
	 */
	protected void setRequestData(final Map reqData)
	{
		this.requestData = reqData;
	}

	/**
	 * This class will provide the current Session context information for the request that is to be processed.
	 * 
	 * @Version 15.1
	 */
	public static class SessionContext implements Serializable
	{
		/**
		 * Internal constant for serialization purposes
		 */
		private static final long serialVersionUID = 2858062669819993013L;
		private String sessionId;
		private String sessionMode;
		private String channelId;
		private String deviceType;
		private boolean hybridAppFlag;
		private boolean simulatedFlag;
		private String simulatingUserLoginId;
		private String requestingClientIP;
		private String browserName;
		private String osName;
		private String userAgent;
		private Map customSessionInfo;

		/**
		 * The default constructor. This is made protected to ensure that this is not created by any class directly.
		 * Instead this should be set using the CanvasRequestBuilder
		 */
		protected SessionContext()
		{
			// Set the default values to ensure that there is never a case where these information come out null.
			setSessionId("Not Available");
			setSessionMode("GUEST");
			setChannelId("3"); // Set the default channel id to 3
			setDeviceType("D"); // Set the default device type to D to indicate that this is desktop
			setHybridApp(false);
			setSimulated(false);
			setRequestingClientIP("Not Available");
			setBrowserName("Not Available");
			setOsName("Not Available");
			setUserAgent("Not Available");
			setCustomSessionInfo(new HashMap());
		}

		/**
		 * Helper method that converts the object state to a String
		 * 
		 * @return The String representation of this class
		 * @see java.lang.Object#toString()
		 */
		public String toString()
		{
			StringBuilder builder = new StringBuilder();
			builder.append("Session Data : [");
			builder.append("Session ID : ").append(getSessionId());
			builder.append(",Session Mode : ").append(getSessionMode());
			builder.append(",Requesting Client IP : ").append(getRequestingClientIP());
			builder.append(",Channel Id : ").append(getChannelId());
			builder.append(",Device Type : ").append(getDeviceType());
			builder.append(",Hybrid Flag : ").append(isHybridApp());
			builder.append(",Simulated Flag : ").append(isSimulated());
			builder.append(",Simulating User Login Id : ").append(getSimulatingUserLoginId());
			builder.append(",Browser Name : ").append(getBrowserName());
			builder.append(",OS Name : ").append(getOsName());
			builder.append(",Custom Session Info : ").append(getCustomSessionInfo());
			builder.append("]");
			return builder.toString();
		}

		/**
		 * @return the sessionId
		 */
		public String getSessionId()
		{
			return sessionId;
		}

		/**
		 * @return the deviceType
		 */
		public String getDeviceType()
		{
			return deviceType;
		}

		/**
		 * @return the channelId
		 */
		public String getChannelId()
		{
			return channelId;
		}

		/**
		 * @return the hybridAppFlag
		 */
		public boolean isHybridApp()
		{
			return hybridAppFlag;
		}

		/**
		 * @return the simulatedFlag
		 */
		public boolean isSimulated()
		{
			return simulatedFlag;
		}

		/**
		 * @return the simulatingUserLoginId
		 */
		public String getSimulatingUserLoginId()
		{
			return simulatingUserLoginId;
		}

		/**
		 * @return the requestingClientIP
		 */
		public String getRequestingClientIP()
		{
			return requestingClientIP;
		}

		/**
		 * @return the browserName
		 */
		public String getBrowserName()
		{
			return browserName;
		}

		/**
		 * @return the osName
		 */
		public String getOsName()
		{
			return osName;
		}

		/**
		 * @return the sessionMode
		 */
		public String getSessionMode()
		{
			return sessionMode;
		}

		/**
		 * @return the userAgent
		 */
		public String getUserAgent()
		{
			return userAgent;
		}

		/**
		 * @return The customSessionInfo
		 */
		public Map getCustomSessionInfo()
		{
			return customSessionInfo;
		}

		/**
		 * @param sessionId the sessionId to set
		 */
		protected void setSessionId(String sessionId)
		{
			this.sessionId = sessionId;
		}

		/**
		 * @param deviceType the deviceType to set
		 */
		protected void setDeviceType(String deviceType)
		{
			this.deviceType = deviceType;
		}

		/**
		 * @param channelId the channelId to set
		 */
		protected void setChannelId(String channelId)
		{
			this.channelId = channelId;
		}

		/**
		 * @param hybridAppFlag the hybridAppFlag to set
		 */
		protected void setHybridApp(boolean hybridAppFlag)
		{
			this.hybridAppFlag = hybridAppFlag;
		}

		/**
		 * @param simulatedFlag the simulatedFlag to set
		 */
		protected void setSimulated(boolean simulatedFlag)
		{
			this.simulatedFlag = simulatedFlag;
		}

		/**
		 * @param simulatingUserLoginId the simulatingUserLoginId to set
		 */
		protected void setSimulatingUserLoginId(String simulatingUserLoginId)
		{
			this.simulatingUserLoginId = simulatingUserLoginId;
		}

		/**
		 * @param requestingClientIP the requestingClientIP to set
		 */
		protected void setRequestingClientIP(String requestingClientIP)
		{
			this.requestingClientIP = requestingClientIP;
		}

		/**
		 * @param browserName the browserName to set
		 */
		protected void setBrowserName(String browserName)
		{
			this.browserName = browserName;
		}

		/**
		 * @param osName the osName to set
		 */
		protected void setOsName(String osName)
		{
			this.osName = osName;
		}

		/**
		 * @param sessMode the sessionMode to set
		 */
		protected void setSessionMode(String sessMode)
		{
			this.sessionMode = sessMode;
		}

		/**
		 * @param usrAgent the userAgent to set
		 */
		protected void setUserAgent(String usrAgent)
		{
			this.userAgent = usrAgent;
		}

		/**
		 * @param sessInfoData The custom session information that may be present
		 */
		protected void setCustomSessionInfo(Map sessInfoData)
		{
			this.customSessionInfo = Collections.unmodifiableMap(sessInfoData);
		}
	}

	/**
	 * This class represents the User context. This has the basic information of the user, their role, etc.
	 * 
	 * @Version 15.1
	 */
	public static class UserContext implements Serializable
	{
		/**
		 * Internal constant for serialization purposes
		 */
		private static final long serialVersionUID = -1889715373155442909L;
		private String owningGCIF;
		private String currentGCIF;
		private String userNumber;
		private String loginId;
		private String userType;
		private String firstName;
		private String middleName;
		private String lastName;
		private String mobileNumber;
		private String emailId;
		private String customerSegmentCode;
		private String currentRoleId;
		private String authenticationType;

		/**
		 * The default constructor. This is made protected to ensure that this is not created by any class directly.
		 * Instead this should be set using the CanvasRequestBuilder
		 */
		protected UserContext()
		{
			// By default initializes like as if this is a guest login
			setOwningGCIF("NA");
			setCurrentGCIF("NA");
			setUserNumber("GUEST");
			setLoginId("GUEST");
			setUserType("CF");
			setFirstName("Guest");
			setMiddleName("");
			setLastName("");
		}

		/**
		 * Helper method that converts the object state to a String
		 * 
		 * @return The String representation of this class
		 * @see java.lang.Object#toString()
		 */
		public String toString()
		{
			StringBuilder builder = new StringBuilder();
			builder.append("User Data : [");
			builder.append("User Number : ").append(getUserNumber());
			builder.append(",Login ID : ").append(getLoginId());
			builder.append(",First Name : ").append(getFirstName());
			builder.append(",Middle Name : ").append(getMiddleName());
			builder.append(",Last Name : ").append(getLastName());
			builder.append(",Owning GCIF : ").append(getOwningGCIF());
			builder.append(",Current GCIF : ").append(getCurrentGCIF());
			builder.append(",Mobile No : ").append(getMobileNumber());
			builder.append(",email Id : ").append(getEmailId());
			builder.append(",Current Role : ").append(getCurrentRoleId());
			builder.append(",User Type : ").append(getUserType());
			builder.append("]");
			return builder.toString();
		}

		/**
		 * @return The full name of the user
		 */
		public String getUserName()
		{
			String modifiedFirstName = Character.toUpperCase(firstName.charAt(0)) + firstName.substring(1);
			String inputUserName = modifiedFirstName.concat(" ").concat(lastName);
			return inputUserName;
		}

		/**
		 * @return the owningGCIF
		 */
		public String getOwningGCIF()
		{
			return owningGCIF;
		}

		/**
		 * @return the currentGCIF
		 */
		public String getCurrentGCIF()
		{
			return currentGCIF;
		}

		/**
		 * @return the userNumber
		 */
		public String getUserNumber()
		{
			return userNumber;
		}

		/**
		 * @return the loginId
		 */
		public String getLoginId()
		{
			return loginId;
		}

		/**
		 * @return the userType
		 */
		public String getUserType()
		{
			return userType;
		}

		/**
		 * @return the firstName
		 */
		public String getFirstName()
		{
			return firstName;
		}

		/**
		 * @return the middleName
		 */
		public String getMiddleName()
		{
			return middleName;
		}

		/**
		 * @return the lastName
		 */
		public String getLastName()
		{
			return lastName;
		}

		/**
		 * @return the mobileNumber
		 */
		public String getMobileNumber()
		{
			return mobileNumber;
		}

		/**
		 * @return the emailId
		 */
		public String getEmailId()
		{
			return emailId;
		}

		/**
		 * @return the customerSegmentCode
		 */
		public String getCustomerSegmentCode()
		{
			return customerSegmentCode;
		}

		/**
		 * @return the currentRoleId
		 */
		public String getCurrentRoleId()
		{
			return currentRoleId;
		}

		/**
		 * @return the authenticationType
		 */
		public String getAuthenticationType()
		{
			return authenticationType;
		}

		/**
		 * @param owningGCIF the owningGCIF to set
		 */
		protected void setOwningGCIF(String owningGCIF)
		{
			this.owningGCIF = owningGCIF;
		}

		/**
		 * @param currentGCIF the currentGCIF to set
		 */
		protected void setCurrentGCIF(String currentGCIF)
		{
			this.currentGCIF = currentGCIF;
		}

		/**
		 * @param userNumber the userNumber to set
		 */
		protected void setUserNumber(String userNumber)
		{
			this.userNumber = userNumber;
		}

		/**
		 * @param loginId the loginId to set
		 */
		protected void setLoginId(String loginId)
		{
			this.loginId = loginId;
		}

		/**
		 * @param userType the userType to set
		 */
		protected void setUserType(String userType)
		{
			this.userType = userType;
		}

		/**
		 * @param firstName the firstName to set
		 */
		protected void setFirstName(String firstName)
		{
			this.firstName = firstName;
		}

		/**
		 * @param middleName the middleName to set
		 */
		protected void setMiddleName(String middleName)
		{
			this.middleName = middleName;
		}

		/**
		 * @param lastName the lastName to set
		 */
		protected void setLastName(String lastName)
		{
			this.lastName = lastName;
		}

		/**
		 * @param mobileNumber the mobileNumber to set
		 */
		protected void setMobileNumber(String mobileNumber)
		{
			this.mobileNumber = mobileNumber;
		}

		/**
		 * @param emailId the emailId to set
		 */
		protected void setEmailId(String emailId)
		{
			this.emailId = emailId;
		}

		/**
		 * @param customerSegmentCode the customerSegmentCode to set
		 */
		protected void setCustomerSegmentCode(String customerSegmentCode)
		{
			this.customerSegmentCode = customerSegmentCode;
		}

		/**
		 * @param currentRoleId the currentRoleId to set
		 */
		protected void setCurrentRoleId(String currentRoleId)
		{
			this.currentRoleId = currentRoleId;
		}

		/**
		 * @param authenticationType the authenticationType to set
		 */
		protected void setAuthenticationType(String authenticationType)
		{
			this.authenticationType = authenticationType;
		}
	}

	/**
	 * This class represents the User Preference context. This has the preference information of the user that needs to
	 * be respected by the handler as appropriate
	 * 
	 * @Version 15.1
	 */
	public static class UserPreferenceContext implements Serializable
	{
		/**
		 * Internal constant for serialization purposes
		 */
		private static final long serialVersionUID = -9150196848809364977L;
		private String dateFormat;
		private String amountFormat;
		private String languageId;
		private String languageDirection;
		private boolean secondaryLanguageEnabled;
		private String secondaryLanguageId;
		private String timeZoneId;
		private String timeDisplayFormat;
		private String themeId;
		private String fontSizeId;
		private String startupWorkspaceId;
		private String referenceCCY;
		private String referenceRateCardId;
		private Map<String, String> additionalSettings;

		/**
		 * The default constructor. This is made protected to ensure that this is not created by any class directly.
		 * Instead this should be set using the CanvasRequestBuilder
		 */
		protected UserPreferenceContext()
		{

		}

		/**
		 * Helper method that converts the object state to a String
		 * 
		 * @return The String representation of this class
		 * @see java.lang.Object#toString()
		 */
		public String toString()
		{
			StringBuilder builder = new StringBuilder();
			builder.append("Preference Data : [");
			builder.append("Date Format : ").append(getDateFormat());
			builder.append(",Amount Format : ").append(getAmountFormat());
			builder.append(",Language Id : ").append(getLanguageId());
			builder.append(",Language Direction : ").append(getLanguageDirection());
			builder.append(",Timezone Id : ").append(getTimeZoneId());
			builder.append(",Time Display Format : ").append(getTimeDisplayFormat());
			builder.append(",Theme : ").append(getThemeId());
			builder.append(",Font Size : ").append(getFontSizeId());
			builder.append(",Startup Workspace Id : ").append(getStartupWorkspaceId());
			builder.append(",Reference CCY : ").append(getReferenceCCY());
			builder.append(",Reference Rate Card : ").append(getReferenceRateCardId());
			builder.append("]");
			return builder.toString();
		}

		/**
		 * @return the dateFormat
		 */
		public String getDateFormat()
		{
			return dateFormat;
		}

		/**
		 * @return the amountFormat
		 */
		public String getAmountFormat()
		{
			return amountFormat;
		}

		/**
		 * @return the languageId
		 */
		public String getLanguageId()
		{
			return languageId;
		}

		/**
		 * @return the languageDirection
		 */
		public String getLanguageDirection()
		{
			return languageDirection;
		}

		/**
		 * @return the secondaryLanguageEnabled
		 */
		public boolean isSecondaryLanguageEnabled()
		{
			return secondaryLanguageEnabled;
		}

		/**
		 * @return the secondaryLanguageId
		 */
		public String getSecondaryLanguageId()
		{
			return secondaryLanguageId;
		}

		/**
		 * @return the timeZoneId
		 */
		public String getTimeZoneId()
		{
			return timeZoneId;
		}

		/**
		 * @return the timeDisplayFormat
		 */
		public String getTimeDisplayFormat()
		{
			return timeDisplayFormat;
		}

		/**
		 * @return the themeId
		 */
		public String getThemeId()
		{
			return themeId;
		}

		/**
		 * @return the fontSizeId
		 */
		public String getFontSizeId()
		{
			return fontSizeId;
		}

		/**
		 * @return the startupWorkspaceId
		 */
		public String getStartupWorkspaceId()
		{
			return startupWorkspaceId;
		}

		/**
		 * @return the referenceCCY
		 */
		public String getReferenceCCY()
		{
			return referenceCCY;
		}

		/**
		 * @return the referenceRateCardId
		 */
		public String getReferenceRateCardId()
		{
			return referenceRateCardId;
		}

		/**
		 * @return the additionalSettings
		 */
		public Map<String, String> getAdditionalSettings()
		{
			return additionalSettings;
		}

		/**
		 * @param dateFormat the dateFormat to set
		 */
		protected void setDateFormat(String dateFormat)
		{
			this.dateFormat = dateFormat;
		}

		/**
		 * @param amountFormat the amountFormat to set
		 */
		protected void setAmountFormat(String amountFormat)
		{
			this.amountFormat = amountFormat;
		}

		/**
		 * @param languageId the languageId to set
		 */
		protected void setLanguageId(String languageId)
		{
			this.languageId = languageId;
		}

		/**
		 * @param languageDirection the languageDirection to set
		 */
		protected void setLanguageDirection(String languageDirection)
		{
			this.languageDirection = languageDirection;
		}

		/**
		 * @param secondaryLanguageEnabled the secondaryLanguageEnabled to set
		 */
		protected void setSecondaryLanguageEnabled(boolean secondaryLanguageEnabled)
		{
			this.secondaryLanguageEnabled = secondaryLanguageEnabled;
		}

		/**
		 * @param secondaryLanguageId the secondaryLanguageId to set
		 */
		protected void setSecondaryLanguageId(String secondaryLanguageId)
		{
			this.secondaryLanguageId = secondaryLanguageId;
		}

		/**
		 * @param timeZoneId the timeZoneId to set
		 */
		protected void setTimeZoneId(String timeZoneId)
		{
			this.timeZoneId = timeZoneId;
		}

		/**
		 * @param timeDisplayFormat the timeDisplayFormat to set
		 */
		protected void setTimeDisplayFormat(String timeDisplayFormat)
		{
			this.timeDisplayFormat = timeDisplayFormat;
		}

		/**
		 * @param themeId the themeId to set
		 */
		protected void setThemeId(String themeId)
		{
			this.themeId = themeId;
		}

		/**
		 * @param fntSizeId the fontSizeId to set
		 */
		protected void setFontSizeId(String fntSizeId)
		{
			this.fontSizeId = fntSizeId;
		}

		/**
		 * @param startupWorkspaceId the startupWorkspaceId to set
		 */
		protected void setStartupWorkspaceId(String startupWorkspaceId)
		{
			this.startupWorkspaceId = startupWorkspaceId;
		}

		/**
		 * @param referenceCCY the referenceCCY to set
		 */
		protected void setReferenceCCY(String referenceCCY)
		{
			this.referenceCCY = referenceCCY;
		}

		/**
		 * @param referenceRateCardId the referenceRateCardId to set
		 */
		protected void setReferenceRateCardId(String referenceRateCardId)
		{
			this.referenceRateCardId = referenceRateCardId;
		}

		/**
		 * @param additionalSettings the additionalSettings to set
		 */
		protected void setAdditionalSettings(Map<String, String> additionalSettings)
		{
			this.additionalSettings = Collections.unmodifiableMap(additionalSettings);
		}
	}

	/**
	 * This is the builder class for this Request. This ensures that the request is constructed will all the necessary
	 * attributes and uses defaults for cases where enough information is not set
	 * 
	 * @Version 15.1
	 */
	public static class CanvasRequestBuilder
	{
		private CanvasRequestVO mRequest;
		private SessionContext mSessionContext;
		private UserContext mUserContext;
		private UserPreferenceContext mPrefContext;

		/**
		 * Default constructor of this builder
		 */
		public CanvasRequestBuilder()
		{
			mSessionContext = new SessionContext();
			mUserContext = new UserContext();
			mRequest = new CanvasRequestVO();
			mPrefContext = new UserPreferenceContext();
		}

		/**
		 * Creates the request based on the various configuration provided and returns the request
		 * 
		 * @return The CanvasRequestVO created based on the inputs provided.
		 */
		public CanvasRequestVO build()
		{
			mRequest.setSessionContext(mSessionContext);
			mRequest.setUserContext(mUserContext);
			mRequest.setUserPreferenceContext(mPrefContext);
			return mRequest;
		}

		/**
		 * sets the action code.
		 * 
		 * @param actioncode : action for the request passed
		 */
		public CanvasRequestBuilder setActionCode(final String actioncode)
		{
			mRequest.setActionCode(actioncode);
			return this;
		}

		/**
		 * sets the requestId.
		 * 
		 * @param reqId the requestId to set
		 */
		public CanvasRequestBuilder setRequestId(final String reqId)
		{
			mRequest.setRequestId(reqId);
			return this;
		}

		/**
		 * sets the host code.
		 * 
		 * @param txncode the hostCode to set
		 */
		public CanvasRequestBuilder setHostCode(final String txncode)
		{
			mRequest.setHostCode(txncode);
			return this;
		}

		/**
		 * sets the webServerIP.
		 * 
		 * @param ipAddress the webServerIP to set
		 */
		public CanvasRequestBuilder setWebServerIP(final String ipAddress)
		{
			mRequest.setWebServerIP(ipAddress);
			return this;
		}

		/**
		 * sets the appServerIP.
		 * 
		 * @param ipAddress the appServerIP to set
		 */
		public CanvasRequestBuilder setAppServerIP(final String ipAddress)
		{
			mRequest.setAppServerIP(ipAddress);
			return this;
		}

		/**
		 * sets the function code.
		 * 
		 * @param functioncode the functionCode to set
		 */
		public CanvasRequestBuilder setFunctionCode(final String functioncode)
		{
			mRequest.setFunctionCode(functioncode);
			return this;
		}

		/**
		 * sets the product code.
		 * 
		 * @param productcode the productCode to set
		 */
		public CanvasRequestBuilder setProductCode(final String productcode)
		{
			mRequest.setProductCode(productcode);
			return this;
		}

		/**
		 * sets the sub product.
		 * 
		 * @param subProductcode the subProductCode to set
		 */
		public CanvasRequestBuilder setSubProductCode(final String subProductcode)
		{
			mRequest.setSubProductCode(subProductcode);
			return this;
		}

		/**
		 * sets the ref no.
		 * 
		 * @param refno the referenceNumber to set
		 */
		public CanvasRequestBuilder setReferenceNumber(final String refno)
		{
			mRequest.setReferenceNumber(refno);
			return this;
		}

		/**
		 * sets the pagecodetype.
		 * 
		 * @param pagecodetype the pageCodeType to set
		 */
		public CanvasRequestBuilder setPageCodeType(final String pagecodetype)
		{
			mRequest.setPageCodeType(pagecodetype);
			return this;
		}

		/**
		 * sets the requestURI.
		 * 
		 * @param reqURI the requestURI to set
		 */
		public CanvasRequestBuilder setRequestURI(final String reqURI)
		{
			mRequest.setRequestURI(reqURI);
			return this;
		}

		/**
		 * sets the requestData
		 * 
		 * @param reqData the requestData to set
		 */
		public CanvasRequestBuilder setRequestData(final Map reqData)
		{
			mRequest.setRequestData(reqData);
			return this;
		}

		/**
		 * @param sessionId the sessionId to set
		 */
		public CanvasRequestBuilder setSessionId(String sessionId)
		{
			mSessionContext.setSessionId(sessionId);
			return this;
		}

		/**
		 * @param deviceType the deviceType to set
		 */
		public CanvasRequestBuilder setDeviceType(String deviceType)
		{
			mSessionContext.setDeviceType(deviceType);
			return this;
		}

		/**
		 * @param channelId the channelId to set
		 */
		public CanvasRequestBuilder setChannelId(String channelId)
		{
			mSessionContext.setChannelId(channelId);
			return this;
		}

		/**
		 * @param hybridAppFlag the hybridAppFlag to set
		 */
		public CanvasRequestBuilder setHybridApp(boolean hybridAppFlag)
		{
			mSessionContext.setHybridApp(hybridAppFlag);
			return this;
		}

		/**
		 * @param simulatedFlag the simulatedFlag to set
		 */
		public CanvasRequestBuilder setSimulated(boolean simulatedFlag)
		{
			mSessionContext.setSimulated(simulatedFlag);
			return this;
		}

		/**
		 * @param simulatingUserLoginId the simulatingUserLoginId to set
		 */
		public CanvasRequestBuilder setSimulatingUserLoginId(String simulatingUserLoginId)
		{
			mSessionContext.setSimulatingUserLoginId(simulatingUserLoginId);
			return this;
		}

		/**
		 * @param requestingClientIP the requestingClientIP to set
		 */
		public CanvasRequestBuilder setRequestingClientIP(String requestingClientIP)
		{
			mSessionContext.setRequestingClientIP(requestingClientIP);
			return this;
		}

		/**
		 * @param browserName the browserName to set
		 */
		public CanvasRequestBuilder setBrowserName(String browserName)
		{
			mSessionContext.setBrowserName(browserName);
			return this;
		}

		/**
		 * @param osName the osName to set
		 */
		public CanvasRequestBuilder setOsName(String osName)
		{
			mSessionContext.setOsName(osName);
			return this;
		}

		/**
		 * @param sessMode the sessionMode to set
		 */
		public CanvasRequestBuilder setSessionMode(String sessMode)
		{
			mSessionContext.setSessionMode(sessMode);
			return this;
		}

		/**
		 * @param usrAgent the userAgent to set
		 */
		public CanvasRequestBuilder setUserAgent(String usrAgent)
		{
			mSessionContext.setUserAgent(usrAgent);
			return this;
		}

		/**
		 * @param sessInfoData The custom session information that may be present
		 */
		public CanvasRequestBuilder setCustomSessionInfo(Map sessInfoData)
		{
			mSessionContext.setCustomSessionInfo(sessInfoData);
			return this;
		}

		/**
		 * @param owningGCIF the owningGCIF to set
		 */
		public CanvasRequestBuilder setOwningGCIF(String owningGCIF)
		{
			mUserContext.setOwningGCIF(owningGCIF);
			return this;
		}

		/**
		 * @param currentGCIF the currentGCIF to set
		 */
		public CanvasRequestBuilder setCurrentGCIF(String currentGCIF)
		{
			mUserContext.setCurrentGCIF(currentGCIF);
			return this;
		}

		/**
		 * @param userNumber the userNumber to set
		 */
		public CanvasRequestBuilder setUserNumber(String userNumber)
		{
			mUserContext.setUserNumber(userNumber);
			return this;
		}

		/**
		 * @param loginId the loginId to set
		 */
		public CanvasRequestBuilder setLoginId(String loginId)
		{
			mUserContext.setLoginId(loginId);
			return this;
		}

		/**
		 * @param userType the userType to set
		 */
		public CanvasRequestBuilder setUserType(String userType)
		{
			mUserContext.setUserType(userType);
			return this;
		}

		/**
		 * @param firstName the firstName to set
		 */
		public CanvasRequestBuilder setFirstName(String firstName)
		{
			mUserContext.setFirstName(firstName);
			return this;
		}

		/**
		 * @param middleName the middleName to set
		 */
		public CanvasRequestBuilder setMiddleName(String middleName)
		{
			mUserContext.setMiddleName(middleName);
			return this;
		}

		/**
		 * @param lastName the lastName to set
		 */
		public CanvasRequestBuilder setLastName(String lastName)
		{
			mUserContext.setLastName(lastName);
			return this;
		}

		/**
		 * @param mobileNumber the mobileNumber to set
		 */
		public CanvasRequestBuilder setMobileNumber(String mobileNumber)
		{
			mUserContext.setMobileNumber(mobileNumber);
			return this;
		}

		/**
		 * @param emailId the emailId to set
		 */
		public CanvasRequestBuilder setEmailId(String emailId)
		{
			mUserContext.setEmailId(emailId);
			return this;
		}

		/**
		 * @param customerSegmentCode the customerSegmentCode to set
		 */
		public CanvasRequestBuilder setCustomerSegmentCode(String customerSegmentCode)
		{
			mUserContext.setCustomerSegmentCode(customerSegmentCode);
			return this;
		}

		/**
		 * @param currentRoleId the currentRoleId to set
		 */
		public CanvasRequestBuilder setCurrentRoleId(String currentRoleId)
		{
			mUserContext.setCurrentRoleId(currentRoleId);
			return this;
		}

		/**
		 * @param authenticationType the authenticationType to set
		 */
		public CanvasRequestBuilder setAuthenticationType(String authenticationType)
		{
			mUserContext.setAuthenticationType(authenticationType);
			return this;
		}

		/**
		 * @param dateFormat the dateFormat to set
		 */
		public CanvasRequestBuilder setDateFormat(String dateFormat)
		{
			mPrefContext.setDateFormat(dateFormat);
			return this;
		}

		/**
		 * @param amountFormat the amountFormat to set
		 */
		public CanvasRequestBuilder setAmountFormat(String amountFormat)
		{
			mPrefContext.setAmountFormat(amountFormat);
			return this;
		}

		/**
		 * @param languageId the languageId to set
		 */
		public CanvasRequestBuilder setLanguageId(String languageId)
		{
			mPrefContext.setLanguageId(languageId);
			return this;
		}

		/**
		 * @param languageDirection the languageDirection to set
		 */
		public CanvasRequestBuilder setLanguageDirection(String languageDirection)
		{
			mPrefContext.setLanguageDirection(languageDirection);
			return this;
		}

		/**
		 * @param secondaryLanguageEnabled the secondaryLanguageEnabled to set
		 */
		public CanvasRequestBuilder setSecondaryLanguageEnabled(boolean secondaryLanguageEnabled)
		{
			mPrefContext.setSecondaryLanguageEnabled(secondaryLanguageEnabled);
			return this;
		}

		/**
		 * @param secondaryLanguageId the secondaryLanguageId to set
		 */
		public CanvasRequestBuilder setSecondaryLanguageId(String secondaryLanguageId)
		{
			mPrefContext.setSecondaryLanguageId(secondaryLanguageId);
			return this;
		}

		/**
		 * @param timeZoneId the timeZoneId to set
		 */
		public CanvasRequestBuilder setTimeZoneId(String timeZoneId)
		{
			mPrefContext.setTimeZoneId(timeZoneId);
			return this;
		}

		/**
		 * @param timeDisplayFormat the timeDisplayFormat to set
		 */
		public CanvasRequestBuilder setTimeDisplayFormat(String timeDisplayFormat)
		{
			mPrefContext.setTimeDisplayFormat(timeDisplayFormat);
			return this;
		}

		/**
		 * @param themeId the themeId to set
		 */
		public CanvasRequestBuilder setThemeId(String themeId)
		{
			mPrefContext.setThemeId(themeId);
			return this;
		}

		/**
		 * @param fntSizeId the fontSizeId to set
		 */
		public CanvasRequestBuilder setFontSizeId(String fntSizeId)
		{
			mPrefContext.setFontSizeId(fntSizeId);
			return this;
		}

		/**
		 * @param startupWorkspaceId the startupWorkspaceId to set
		 */
		public CanvasRequestBuilder setStartupWorkspaceId(String startupWorkspaceId)
		{
			mPrefContext.setStartupWorkspaceId(startupWorkspaceId);
			return this;
		}

		/**
		 * @param referenceCCY the referenceCCY to set
		 */
		public CanvasRequestBuilder setReferenceCCY(String referenceCCY)
		{
			mPrefContext.setReferenceCCY(referenceCCY);
			return this;
		}

		/**
		 * @param referenceRateCardId the referenceRateCardId to set
		 */
		public CanvasRequestBuilder setReferenceRateCardId(String referenceRateCardId)
		{
			mPrefContext.setReferenceRateCardId(referenceRateCardId);
			return this;
		}

		/**
		 * @param additionalSettings the additionalSettings to set
		 */
		public CanvasRequestBuilder setAdditionalSettings(Map<String, String> additionalSettings)
		{
			mPrefContext.setAdditionalSettings(additionalSettings);
			return this;
		}
	}
}
