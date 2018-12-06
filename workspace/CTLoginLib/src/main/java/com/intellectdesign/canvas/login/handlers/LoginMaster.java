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

package com.intellectdesign.canvas.login.handlers;

import static com.intellectdesign.canvas.proxycaller.ProxyCaller.on;
import java.util.HashMap;
import java.util.List;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.ImplClassDescriptor;
import com.intellectdesign.canvas.config.SecurityConfigurationDescriptor;
import com.intellectdesign.canvas.constants.login.LoginMasterConstants;
import com.intellectdesign.canvas.database.CanvasDatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseResult;
import com.intellectdesign.canvas.entitlement.EntitlementsHelper;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.properties.reader.PropertyReader;
import com.intellectdesign.canvas.security.AuthenticationException;
import com.intellectdesign.canvas.security.AuthenticationProviderFactory;
import com.intellectdesign.canvas.security.IAuthenticationServiceProvider;
import com.intellectdesign.canvas.value.IUserValue;

/**
 * This class is for login master.
 * 
 * @version 1.0
 */
class LoginMaster
{
	private static final Logger logger = Logger.getLogger(LoginMaster.class);
	private PropertyReader propReader = new PropertyReader();

	/**
	 * Method for loginUSer
	 * 
	 * @param userValue
	 * @return UserValue
	 */
	public IUserValue loginUser(IUserValue userValue)
	{
		// Get the user details from user mb and nickname master.
		IUserValue loggedInUserDetails = executeUserLogin(userValue);
		// Copy the details from the user Value provided to the new User Value retured.
		loggedInUserDetails.setTransactionCode(userValue.getTransactionCode());
		loggedInUserDetails.setUserAgent(userValue.getUserAgent());
		loggedInUserDetails.setSessionTicket(userValue.getSessionTicket());
		loggedInUserDetails.setSessionId(userValue.getSessionId());

		return loggedInUserDetails;
	}

	/**
	 * This method gets the user preferences for the user no present in userData and loads the preference values into
	 * the userValue provided
	 * 
	 * @param userValue The user value provided
	 * @param userData The user data identified
	 * @throws ProcessingErrorException Thrown if any error occurs while processing the request
	 */
	public IUserValue populateUserPreferences(IUserValue userValue) throws ProcessingErrorException
	{
		Class<?> clshandler = null;
		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		ImplClassDescriptor implDescriptor = configMgr.getImplClassDescriptor();

		String className = implDescriptor.getViewEntlClass();

		clshandler = on(className).get();

		userValue = on(clshandler).create().call("getUserPreferences", userValue).get();
		return userValue;
	}

	/**
	 * Updates the user value with necessary information from user data if the user status is not present.
	 * 
	 * @param userValue The user value
	 * @param userData The user data as retrieved from database
	 */
	public void handleInValidUser(IUserValue userValue, String mesLbl)
	{

		String transactionStatus = LoginMasterConstants.STATUS_FAILURE;
		String info;
		logger.ctdebug("CTLGN00044", mesLbl);
		info = propReader.retrieveProperty(LoginMasterConstants.RESOURCE_BUNDLE_ERRORS, mesLbl);
		userValue.setInfo(info);
		userValue.setTransactionStatus(transactionStatus);
	}

	/**
	 * This is a helper method called from isAlreadyRegisteredUser to validate the user login details, As part of this
	 * process, it also populates the user preferences information
	 * 
	 * @param userValue The userValue provided in the input
	 * @return userValue
	 * @throws ProcessingErrorException Thrown if any error occurs while processing the request
	 */
	private IUserValue executeUserLogin(IUserValue userValue)
	{
		EntitlementsHelper helper = new EntitlementsHelper();
		return helper.getUserDetails(userValue.getLoginId());
	}

	/**
	 * method to check the MultiLogin
	 * 
	 * @param userValue
	 * @returns boolean
	 * @throws DatabaseException
	 * @throws ProcessingErrorException Thrown if any error occurs while processing the DB request
	 */

	protected boolean isMultiLoginAllowed(IUserValue userValue) throws ProcessingErrorException
	{
		boolean validatMmultiLoginFlag = false;
		try
		{
			ConfigurationManager confMgr = ConfigurationManager.getInstance();
			SecurityConfigurationDescriptor securityConfig = confMgr.getSecurityDescriptor();
			if (securityConfig.isAllowMultiLogin())
			{
				return true;
			}
			validatMmultiLoginFlag = validateMultiLogin(userValue);
		} catch (ProcessingErrorException procEx)
		{
			String errorMsg = "LBL_DB_EXCEPTION";
			handleInValidUser(userValue, errorMsg);
			throw new ProcessingErrorException(procEx);

		}
		return validatMmultiLoginFlag;

	}

	/**
	 * This method is uesd to remove the user session
	 * 
	 * @param com.intellectdesign.canvas.exceptions.common.UserValue
	 * @throws Exception
	 */

	protected void removeUserSession(IUserValue userValue) throws ProcessingErrorException
	{
		String mLog = "removeUserSession";
		logger.ctinfo("CTLGN00017", mLog);
		String userNo = userValue.getUserNo();
		String jSessionId = userValue.getSessionTicket();
		DatabaseRequest databaseRequest = null;
		try
		{
			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(LoginMasterConstants.ADD_OD_SESSION_LOG);
			databaseRequest.setOperation(DatabaseConstants.DELETE);
			databaseRequest.setOperationExtension(LoginMasterConstants.OD_SESSION_LOG);
			databaseRequest.addFilter(LoginMasterConstants.CT_USER_NO, userNo);
			databaseRequest.addFilter(LoginMasterConstants.CT_JSESSION_ID, jSessionId);
			databaseRequest.execute();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTLGN00018", dbEx, userNo);
			throw new ProcessingErrorException(dbEx);
		}
	}

	/**
	 * method to validate the MultiLogin
	 * 
	 * @param userValue
	 * @returns boolean
	 * @throws DatabaseException
	 * @throws ProcessingErrorException Thrown if any error occurs while processing the DB request
	 */
	private boolean validateMultiLogin(IUserValue userValue) throws ProcessingErrorException
	{
		String cmName = "[SessionManager.validateUserSession]";
		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		DatabaseResult dbResult = new DatabaseResult();
		String userNo;
		String sessionTicket;
		boolean statusFlag = false;
		List returnList = null;
		userNo = userValue.getUserNo();
		sessionTicket = userValue.getSessionTicket();
		if (userNo != null)
		{
			logger.ctinfo("CTLGN00019", cmName, sessionTicket, userNo);
			dbRequest.setDataAccessMapKey(LoginMasterConstants.CHECK);
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setOperationExtension(LoginMasterConstants.USER_SESSION);
			dbRequest.addFilter(LoginMasterConstants.CT_USER_NO, userNo);
			try
			{
				dbResult = dbRequest.execute();
				returnList = dbResult.getReturnedList();
			} catch (DatabaseException dbExcep)
			{
				logger.cterror("CTLGN00043", dbExcep, cmName);
				throw new ProcessingErrorException(dbExcep);
			}
			logger.ctinfo("CTLGN00020", cmName, returnList, userNo);
			if (returnList != null && !returnList.isEmpty())
			{
				if (returnList.size() > 0)
				{
					statusFlag = false;
				} else
					statusFlag = true;
			} else
			{
				// If the user is logged out
				statusFlag = true;
			}
		}
		return statusFlag;
	}

	/**
	 * This method is uesd to insert the user session
	 * 
	 * @param com.intellectdesign.canvas.exceptions.common.UserValue
	 * @throws Exception
	 */
	protected void insertUserSession(IUserValue userValue) throws ProcessingErrorException
	{
		String mLog = "insertUserSession";
		logger.ctinfo("CTLGN00017", mLog);
		String userNo = userValue.getUserNo();
		String jSessionId = userValue.getSessionTicket();
		HashMap sessionDetailMap = new HashMap();
		sessionDetailMap.put(LoginMasterConstants.CT_JSESSION_ID, jSessionId);
		sessionDetailMap.put(LoginMasterConstants.CT_USER_NO, userNo);
		sessionDetailMap.put(LoginMasterConstants.CT_LOGIN_STATUS, LoginMasterConstants.LOGIN);

		DatabaseRequest databaseRequest = null;

		try
		{
			removeUserSession(userValue);
			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(LoginMasterConstants.ADD_OD_SESSION_LOG);
			databaseRequest.setOperation(DatabaseConstants.INSERT);
			databaseRequest.setOperationExtension(LoginMasterConstants.OD_SESSION_LOG);
			databaseRequest.setData(sessionDetailMap);
			databaseRequest.execute();
		} catch (DatabaseException se)
		{
			throw new ProcessingErrorException(se);
		}
	}

	/**
	 * This method calls the extendSession method of the configured provider class
	 * 
	 * @param uValue
	 * @throws ProcessingErrorException
	 */

	public void extendSession(IUserValue uValue) throws ProcessingErrorException
	{
		IAuthenticationServiceProvider provider = null;
		String cmName = " [Login.onActivateSession] ";
		try
		{
			provider = AuthenticationProviderFactory.getAuthenticationServiceProvider();
			provider.onExtendSession(uValue);
		} catch (AuthenticationException authEx)
		{
			logger.cterror("CTLGN00012", authEx, cmName);
			throw new ProcessingErrorException(authEx);
		}
	}
}
