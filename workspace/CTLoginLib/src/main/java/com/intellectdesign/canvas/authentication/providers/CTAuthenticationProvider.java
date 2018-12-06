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

package com.intellectdesign.canvas.authentication.providers;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.intellectdesign.canvas.common.UserValue;
import com.intellectdesign.canvas.constants.login.LoginMasterConstants;
import com.intellectdesign.canvas.database.CanvasDatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseResult;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.security.AuthenticationException;
import com.intellectdesign.canvas.security.IAuthenticationServiceProvider;
import com.intellectdesign.canvas.value.IUserValue;

/**
 * This class is for CT Authentication Provider.This contains the methods to authenticate single/multiuser, change their
 * credential, update user status and validate session.
 * 
 * @version 1.0
 */
public class CTAuthenticationProvider implements IAuthenticationServiceProvider
{
	/**
	 * Method for initializing the user data
	 * 
	 * @throws AuthenticationException
	 * @see com.intellectdesign.canvas.security.IAuthenticationServiceProvider#initialize()
	 */
	public void initialize() throws AuthenticationException
	{

	}

	/**
	 * ============================================================================= Method : authenticateUser()
	 * Description : Authenticates the user against the Authentication Info object
	 * 
	 * @param uservalue
	 * 
	 * @throws AuthenticationException ==============================================================================
	 */

	public void authenticateUser(IUserValue userValue) throws AuthenticationException
	{
		List resultList = null;

		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		try
		{
			dbRequest.setDataAccessMapKey("USER_PWD_CHECK");
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setOperationExtension("ENCRYPT");
			dbRequest.addFilter("OD_USER_PWD", userValue.getUserPin());
			dbRequest.addFilter("OD_LOGIN_ID", userValue.getLoginId());
			resultList = dbRequest.execute().getReturnedList();
			HashMap tmpMap = new HashMap();
			if (null != resultList && resultList.size() > 0)
			{

				tmpMap = (HashMap) resultList.get(0);
				String count = (String) tmpMap.get("COUNT");
				if (count.equals("0"))
				{
					userValue.setTransactionStatus("failure");
					userValue.setInfo("Invalid User Credentials");
					userValue.setInvalidCred(true);
				} else
				{
					userValue.setTransactionStatus("success");
					userValue.setStatusFlag("E");
					String info = "User Profile has been successfully Registered";
					userValue.setInfo(info);
					updateUserLoginTime((UserValue) userValue);
					updateUserStatus((UserValue) userValue);
				}
			}
		} catch (Exception e)
		{
			userValue.setTransactionStatus("failure");
		}
	}

	/**
	 * ============================================================================= Method : authenticateMultiUser()
	 * Description : Authenticates the multiple user against the Authentication Info object
	 * 
	 * @param uservalue
	 * 
	 * @throws AuthenticationException ==============================================================================
	 */

	public void authenticateMultiUser(IUserValue userValue) throws AuthenticationException
	{
		List resultList = null;
		String encryptPwd = userValue.getUserPin();
		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		try
		{
			dbRequest.setDataAccessMapKey("USER_PWD_CHECK");
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setOperationExtension("ENCRYPT");
			dbRequest.addFilter("OD_USER_PWD", encryptPwd);
			dbRequest.addFilter("OD_LOGIN_ID", userValue.getLoginId());
			resultList = dbRequest.execute().getReturnedList();
			if (null != resultList && resultList.size() > 0)
			{
				userValue.setTransactionStatus("success");
			}
		} catch (Exception e)
		{
			userValue.setTransactionStatus("failure");
		}
	}

	/**
	 * ============================================================================= Method : changeCredentials()
	 * Description : Changes the password of the user
	 * 
	 * @param uservalue
	 * 
	 * @throws AuthenticationException ==============================================================================
	 */

	public void changeCredentials(IUserValue userValue) throws AuthenticationException
	{
	}

	/**
	 * ============================================================================= Method : logoutUser() Description
	 * :to logout the user
	 * 
	 * @param uservalue
	 * 
	 * @throws AuthenticationException ==============================================================================
	 */
	public void logoutUser(IUserValue userValue) throws AuthenticationException
	{

		userValue.setStatusFlag("T");
		try
		{
			updateUserStatus((UserValue) userValue);
		} catch (ProcessingErrorException prEx)
		{
			userValue.setTransactionStatus("failure");

		}

	}

	/**
	 * ========================================================================== Method : logoutUser(). Description :
	 * logout the specific user from armor
	 * 
	 * @param userId
	 * 
	 * @throws AuthenticationException ==========================================================================
	 */

	public void logoutUser(String userId) throws AuthenticationException
	{
	}

	/**
	 * Method for dispose
	 * 
	 * @see com.intellectdesign.canvas.security.IAuthenticationServiceProvider#dispose()
	 */
	public void dispose()
	{

	}

	/**
	 * Method for extracting the usercredentials
	 * 
	 * @param request
	 * @param userDetails
	 * @throws AuthenticationException
	 * @see com.intellectdesign.canvas.security.IAuthenticationServiceProvider#extractUserCredentials(javax.servlet.http.HttpServletRequest,
	 *      com.intellectdesign.canvas.value.IUserValue)
	 */
	public void extractUserCredentials(HttpServletRequest request, IUserValue userDetails)
			throws AuthenticationException
	{

	}

	/**
	 * logout the specific user from armor 
	 * 
	 * @param userValue
	 */
	public void bulkLogout(UserValue userValue)
	{
	}

	/**
	 * Method for logout the user
	 * 
	 * @param aTkt
	 */
	public void doLogOutUser(String aTkt)
	{
	}

	/**
	 * Get The Challenge value from Safeword server
	 * 
	 * @param uservalue
	 */
	public void getChallenge(UserValue userValue)
	{
	}

	/**
	 * Verify the Safeword Password
	 * 
	 * @param userValue
	 */
	public void authenticateChallengeResponse(UserValue userValue)
	{

	}

	/**
	 * to reset the password of RSA user for first time
	 * 
	 * @param userValue
	 * @throws AuthenticationException
	 */
	public void resetRSAPWD(IUserValue userValue) throws AuthenticationException
	{

	}

	/**
	 * validating the RSA roll
	 * 
	 * @param userData
	 * @return boolean
	 * @throws AuthenticationException
	 * @see com.intellectdesign.canvas.security.IAuthenticationServiceProvider#isRSARollValidated(java.util.HashMap)
	 */
	public boolean isRSARollValidated(HashMap userData) throws AuthenticationException
	{
		return true;
	}

	/**
	 * to get the data from vector calls the Armor for RSA Txn
	 * 
	 * @param userData
	 * @return boolean
	 * @throws AuthenticationException
	 */
	public boolean isRSATxnValidated(Object userData) throws AuthenticationException
	{
		return true;
	}

	/**
	 * to reset the password of Migrated user in Armor DB
	 * 
	 * @param userValue
	 * @throws AuthenticationException
	 */
	public void forceReset(IUserValue userValue) throws AuthenticationException
	{
	}

	/**
	 * Updating the user status in DB
	 * 
	 * @param userValue
	 * @throws ProcessingErrorException
	 */
	private void updateUserStatus(UserValue userValue) throws ProcessingErrorException
	{
		DatabaseRequest dbRequest;

		String statusVal = userValue.getStatusFlag();
		HashMap dataMap = new HashMap();
		if (statusVal != null)
		{

			dataMap.put(LoginMasterConstants.FLD_STATUS_FLAG, statusVal);
			dataMap.put(LoginMasterConstants.FLD_USER_NO, userValue.getUserNo());
			dataMap.put(LoginMasterConstants.FLD_LAST_LOGIN_DATE, new Date().toString());
			// Perform the actual update.
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey("UPDATE_USER_STATUS");
			dbRequest.setOperation(DatabaseConstants.UPDATE);
			dbRequest.setOperationExtension("REGISTER");
			dbRequest.setData(dataMap);

			executeAndGetResult(dbRequest);
		}
	}

	/**
	 * Method to update the user login time
	 * 
	 * @param userValue
	 * @throws ProcessingErrorException
	 */
	private void updateUserLoginTime(UserValue userValue) throws ProcessingErrorException
	{
		DatabaseRequest dbRequest;

		HashMap dataMap = new HashMap();
		dataMap.put(LoginMasterConstants.FLD_USER_NO, userValue.getUserNo());
		dataMap.put(LoginMasterConstants.FLD_LAST_LOGIN_DATE, new Date());
		// Perform the actual update.
		dbRequest = new CanvasDatabaseRequest();
		dbRequest.setDataAccessMapKey("UPDATE_USER_LOGIN_TIME");
		dbRequest.setOperation(DatabaseConstants.UPDATE);
		dbRequest.setData(dataMap);

		executeAndGetResult(dbRequest);
	}

	/**
	 * Helper method to execute the database request and return the result list.
	 * 
	 * @param dbRequest The database request to execute
	 * @return The result list
	 * @throws ProcessingErrorException Thrown if any error occurs while processing the DB request
	 */
	private DatabaseResult executeAndGetResult(DatabaseRequest dbRequest) throws ProcessingErrorException
	{
		DatabaseResult dbResult = null;
		try
		{
			dbResult = dbRequest.execute();
		} catch (DatabaseException dbExcep)
		{
			throw new ProcessingErrorException(dbExcep);
		}
		return dbResult;
	}

	/**
	 * Method for validating the session
	 * 
	 * @see com.intellectdesign.cib.security.IAuthenticationServiceProvider#validateSession(javax.servlet.http.HttpServletRequest)
	 * @param request
	 * 
	 * @throws AuthenticationException
	 */
	@Override
	public boolean validateSession(HttpServletRequest request) throws AuthenticationException
	{
		return true;
	}

	/**
	 * Method for getting the preferences
	 * 
	 * @see com.intellectdesign.cib.security.IAuthenticationServiceProvider#getPreferences(javax.servlet.http.HttpServletRequest,
	 *      com.intellectdesign.canvas.common.UserValue)
	 * @param request
	 * @param userDetails
	 * @return IUserValue
	 * 
	 * @throws AuthenticationException
	 */
	@Override
	public IUserValue getPreferences(HttpServletRequest request, IUserValue userDetails) throws AuthenticationException
	{
		return null;
	}

	/**
	 * Method for extending the session
	 * 
	 * @param request
	 * @throws AuthenticationException
	 * @see com.intellectdesign.canvas.security.IAuthenticationServiceProvider#onActivateSession(javax.servlet.http.HttpServletRequest)
	 */
	@Override
	public void onExtendSession(IUserValue uvalue) throws AuthenticationException
	{
		uvalue.setInfo("User session has been extended");
	}
}
