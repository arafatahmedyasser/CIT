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

package com.intellectdesign.canvas.entitlement;

import java.util.HashMap;
import java.util.List;

import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.value.IUserValue;

/**
 * This interface models the nature of interfaces that Canvas as a system would have with an Entitlement provider. An
 * Entitlement provider is one who maintains the repository of users as well as the privileges (Access rights) and
 * preferences of the users.
 * 
 * In most of the cases, a com.intellectdesign.canvas.value.IUserValue implementated object is expected. It should be noted that
 * Canvas expects the status for any activity to be updated into the UserValue objects that is passed. This can be done
 * using the <code>setTransactionStatus(String)</code> API using the values "success" or "failure" to indicate
 * successful completion or failure in processing. The <code>setInfo(String)</code> API can be used to add any detailed
 * description for the reason for failure
 * 
 * @version 1.0
 */
public interface IEntitlementSource
{
	/**
	 * This method will be called to retrieve the details of the user based on the login Id.
	 * 
	 * @param loginId
	 * @return IUserValue
	 */
	public IUserValue getUserDetails(String loginId);

	/**
	 * This method will be called to retrieve the preferences of the user. The user value provided will have both the
	 * login Id as well as the user number of the user available that can be used as a starting point
	 * 
	 * @param userValue The user value having the details of the user for whom preferences is to be fetched
	 * @return userValue The User value object having the preferences updated.
	 * @throws ProcessingErrorException Thrown if any error occurs while retrieving the preferences
	 */
	public IUserValue getUserPreferences(IUserValue userValue) throws ProcessingErrorException;

	/**
	 * This method will be called to retrieve the access level entitlements of the user. Refer to the documentation on
	 * the CanvasViewEntlVO for details on the construction of that class
	 * 
	 * @param gcif The ID of the corporate entity to which this user belongs to
	 * @param userNo The user number of this user (this is different from the login id)
	 * @return The Access level entitlements associated to this user.
	 * @throws EntitlementException Thrown if there are any errors while retrieving the accesss entitlements.
	 */
	public CanvasViewEntlVO getUserAccessEntitlements(String gcif, String userNo) throws EntitlementException;

	/**
	 * This method will be called to retrieve the access level entitlements of the user. Refer to the documentation on
	 * the CanvasViewEntlVO for details on the construction of that class
	 * 
	 * @param gcif The ID of the corporate entity to which this user belongs to
	 * @param userNo The user number of this user (this is different from the login id)
	 * @param sUserRole The ID of the role that this user is playing. If there is no role preference attached to this
	 *            user, then this can be null
	 * @return The Access level entitlements associated to this user for the specific role.
	 * @throws EntitlementException Thrown if there are any errors while retrieving the accesss entitlements.
	 */
	public CanvasViewEntlVO getUserAccessEntitlements(String gcif, String userNo, String sUserRole)
			throws EntitlementException;

	/**
	 * This method is for UserDataEntitlements
	 * 
	 * @param mapInputParams
	 * @return CanvasViewEntlVO
	 * @throws EntitlementException
	 * @deprecated This API is no longer referenced from Canvas.
	 */
	public DataEntitlements getUserDataEntitlements(HashMap mapInputParams) throws EntitlementException;

	/**
	 * This method is for UserDataEntitlements
	 * 
	 * @param productsList
	 * @param subprodList
	 * @param functionList
	 * @param gcif
	 * @param userNo
	 * @return CanvasViewEntlVO
	 * @throws EntitlementException
	 */
	public DataEntitlements getUserDataEntitlements(String[] productsList, String[] subprodList, String[] functionList,
			String gcif, String userNo) throws EntitlementException;

	/**
	 * This method is for UserDataEntitlements
	 * 
	 * @param productsList
	 * @param subprodList
	 * @param functionList
	 * @param gcif
	 * @param userNo
	 * @return CanvasViewEntlVO
	 * @throws EntitlementException
	 */
	public DataEntitlements getUserDataEntitlements(String[] productsList, String[] subprodList, String[] functionList,
			String gcif, String userNo, String channelId) throws EntitlementException;

	/**
	 * get the User Data Entitlements based on the params
	 * 
	 * @param productsList
	 * @param subprodList
	 * @param functionList
	 * @param gcif
	 * @param userNo
	 * @param sUserRole
	 * @return
	 * @throws EntitlementException
	 */
	public DataEntitlements getUserDataEntitlements(String[] productsList, String[] subprodList, String[] functionList,
			String gcif, String userNo, String channelId, String sUserRole) throws EntitlementException;

	/**
	 * This method is for UserDataEntitlements
	 * 
	 * @param productsList
	 * @param subprodList
	 * @param functionList
	 * @param gcif
	 * @param userNo
	 * @return
	 * @throws EntitlementException
	 */
	public DataEntitlements getUserDataEntitlements(String productsList, String subprodList, String functionList,
			String gcif, String userNo) throws EntitlementException;

	/**
	 * This method is for UserDataEntitlements
	 * 
	 * @param productsList
	 * @param subprodList
	 * @param functionList
	 * @param gcif
	 * @param userNo
	 * @param channelId
	 * @return
	 * @throws EntitlementException
	 */
	public DataEntitlements getUserDataEntitlements(String productsList, String subprodList, String functionList,
			String gcif, String userNo, String channelId) throws EntitlementException;

	/**
	 * This method is for UserDataEntitlements
	 * 
	 * @param productsList
	 * @param subprodList
	 * @param functionList
	 * @param gcif
	 * @param userNo
	 * @param channelId
	 * @param sUserRole
	 * @return
	 * @throws EntitlementException
	 */
	public DataEntitlements getUserDataEntitlements(String productsList, String subprodList, String functionList,
			String gcif, String userNo, String channelId, String sUserRole) throws EntitlementException;

	/**
	 * This method is for ListCategories
	 * 
	 * @param gcif
	 * @param userNo
	 * @return list
	 * @throws EntitlementException
	 * @deprecated This is no longer used. Instead Canvas uses the Access Entitlements of the user to derive the product
	 *             categories for usage in Design your canvas
	 */
	public List<String> getProductCategories(String gcif, String userNo) throws EntitlementException;

	/**
	 * gets the name
	 * 
	 * @return name
	 */
	public String getName();

	/**
	 * Update the user preferences
	 * 
	 * @param preferenceType
	 * @param preferenceValues
	 * @param userNo
	 * @throws ProcessingErrorException
	 */
	public String updateUserPreferences(List<String> preferenceType, List<Object> preferenceValues, String userNo)
			throws ProcessingErrorException;

}
