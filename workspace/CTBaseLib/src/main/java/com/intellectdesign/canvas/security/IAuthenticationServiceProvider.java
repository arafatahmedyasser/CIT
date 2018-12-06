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

package com.intellectdesign.canvas.security;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;

import com.intellectdesign.canvas.value.IUserValue;

/**
 * This interface is for IAuthenticationServiceProvider
 * 
 * @version 1.0
 */
public interface IAuthenticationServiceProvider
{
	/**
	 * This contains the various authentication status values that can be returned by the Authentication Provider
	 * implementation
	 */
	public enum Status
	{
		/**
		 * Indicates that result of the requested operation was successful
		 */
		Success,
		/**
		 * Indicates that the result of the requested Operation was a failure
		 */
		Failure
	}

	/**
	 * This method is called to provide an option for the authentication provider to initialize itself.
	 * 
	 * @throws AuthenticationException
	 */
	public void initialize() throws AuthenticationException;

	/**
	 * This Method is used to Initialize authenticateUser Authenticates the user against the Authentication Info object
	 * 
	 * @exception Authentication
	 */
	public void authenticateUser(IUserValue userValue) throws AuthenticationException;

	/**
	 * This Method authenticateMultiUser
	 * 
	 * @params IUserValue
	 * @exception Authentication
	 * 
	 *                /** This Method changeCredentials
	 * @params IUserValue
	 * @exception Authentication
	 */
	public void changeCredentials(IUserValue userValue) throws AuthenticationException;

	/**
	 * This Method LogOutUser
	 * 
	 * @params IUserValue
	 * @exception Authentication
	 */
	public void logoutUser(IUserValue userValue) throws AuthenticationException;

	/**
	 * This Method LogOutUser
	 * 
	 * @params String User id
	 * @exception Authentication
	 */
	public void logoutUser(String userId) throws AuthenticationException;

	public void dispose();

	/**
	 * This method will be used to provide a hook for the provider to extract custom information from the request into
	 * the user details object provided. This will subsequently be passed back during authentication the user
	 * credentials
	 * 
	 * @param request The request received from the client
	 * @param userDetails The user details into which any custom properties can be populated.
	 * @exception Thrown if any exception occured while extracting information of custom validation failure
	 */
	public void extractUserCredentials(HttpServletRequest request, IUserValue userDetails)
			throws AuthenticationException;

	/**
	 * ref to method resetRSAPWD user value
	 * 
	 * @param userValue
	 * @throws AuthenticationException
	 */
	public void resetRSAPWD(IUserValue userValue) throws AuthenticationException;

	/**
	 * ref to method isRSARollValidated user data
	 * 
	 * @param userData
	 * @return
	 * @throws AuthenticationException
	 */
	public boolean isRSARollValidated(HashMap userData) throws AuthenticationException;

	/**
	 * ref to method isRSATxnValidated user data
	 * 
	 * @param userData
	 * @return
	 * @throws AuthenticationException
	 */
	public boolean isRSATxnValidated(Object userData) throws AuthenticationException;

	/**
	 * methosd is ref to forceReset Uservalue
	 * 
	 * @param userValue
	 * @throws AuthenticationException
	 */
	public void forceReset(IUserValue userValue) throws AuthenticationException;

	/**
	 * This method will be used to provide a hook for the provider validate session if external authentication system is
	 * used
	 * 
	 * @param request The request received from the client
	 * @return True if valid session .
	 * @exception Thrown if any exception occured while validation of session
	 */
	public boolean validateSession(HttpServletRequest request) throws AuthenticationException;

	/**
	 * This method will be used by the provider class to retrieve the user preferences for the user.
	 * 
	 * @param request request The request received from the client
	 * @param userDetails The user details into which any custom properties can be populated.
	 * @return Uservalue Object.
	 * @exception Thrown if any exception occured while validation of session
	 */
	public IUserValue getPreferences(HttpServletRequest request, IUserValue userDetails) throws AuthenticationException;

	/**
	 * This method is called on extending the session.
	 * 
	 * @param uValue User Value
	 * @throws AuthenticationException
	 */
	public void onExtendSession(IUserValue uvalue) throws AuthenticationException;

}
