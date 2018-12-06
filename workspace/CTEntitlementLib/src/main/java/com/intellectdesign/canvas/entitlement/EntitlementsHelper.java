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
package com.intellectdesign.canvas.entitlement;

import java.util.HashMap;
import java.util.List;

import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.ImplClassDescriptor;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.proxycaller.ProxyCaller;
import com.intellectdesign.canvas.value.IUserValue;

/**
 * This is a utility class that provides the same API's as the IEntitlementSource, but actually routes it to the
 * configured entitlement source
 * 
 * @Version 15.1
 */
public final class EntitlementsHelper implements IEntitlementSource
{
	private IEntitlementSource mEntlSource = null;

	/**
	 * The only constructor. This creates the actual entitlement source instance and keeps it ready for further
	 * invocation
	 */
	public EntitlementsHelper()
	{
		// Create the instance of the actual entitlement source.
		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		ImplClassDescriptor implDescriptor = configMgr.getImplClassDescriptor();

		String className = implDescriptor.getViewEntlClass();
		mEntlSource = ProxyCaller.on(className).create().get();
	}

	/**
	 * @param loginId
	 * @return
	 * @see com.intellectdesign.canvas.entitlement.IEntitlementSource#getUserDetails(java.lang.String)
	 */
	@Override
	public IUserValue getUserDetails(String loginId)
	{
		return mEntlSource.getUserDetails(loginId);
	}

	/**
	 * @param userValue
	 * @return
	 * @throws ProcessingErrorException
	 * @see com.intellectdesign.canvas.entitlement.IEntitlementSource#getUserPreferences(com.intellectdesign.canvas.value.IUserValue)
	 */
	@Override
	public IUserValue getUserPreferences(IUserValue userValue) throws ProcessingErrorException
	{
		return mEntlSource.getUserPreferences(userValue);
	}

	/**
	 * @param gcif
	 * @param userNo
	 * @return
	 * @throws EntitlementException
	 * @see com.intellectdesign.canvas.entitlement.IEntitlementSource#getUserAccessEntitlements(java.lang.String,
	 *      java.lang.String)
	 */
	@Override
	public CanvasViewEntlVO getUserAccessEntitlements(String gcif, String userNo) throws EntitlementException
	{
		return mEntlSource.getUserAccessEntitlements(gcif, userNo);
	}

	/**
	 * @param gcif
	 * @param userNo
	 * @param sUserRole
	 * @return
	 * @throws EntitlementException
	 * @see com.intellectdesign.canvas.entitlement.IEntitlementSource#getUserAccessEntitlements(java.lang.String,
	 *      java.lang.String, java.lang.String)
	 */
	@Override
	public CanvasViewEntlVO getUserAccessEntitlements(String gcif, String userNo, String sUserRole)
			throws EntitlementException
	{
		return mEntlSource.getUserAccessEntitlements(gcif, userNo, sUserRole);
	}

	/**
	 * @param mapInputParams
	 * @return
	 * @throws EntitlementException
	 * @see com.intellectdesign.canvas.entitlement.IEntitlementSource#getUserDataEntitlements(java.util.HashMap)
	 * @deprecated This API is no longer referenced from Canvas.
	 */
	@Override
	public DataEntitlements getUserDataEntitlements(HashMap mapInputParams) throws EntitlementException
	{
		return mEntlSource.getUserDataEntitlements(mapInputParams);
	}

	/**
	 * @param productsList
	 * @param subprodList
	 * @param functionList
	 * @param gcif
	 * @param userNo
	 * @return
	 * @throws EntitlementException
	 * @see com.intellectdesign.canvas.entitlement.IEntitlementSource#getUserDataEntitlements(java.lang.String[],
	 *      java.lang.String[], java.lang.String[], java.lang.String, java.lang.String)
	 */
	@Override
	public DataEntitlements getUserDataEntitlements(String[] productsList, String[] subprodList, String[] functionList,
			String gcif, String userNo) throws EntitlementException
	{
		return mEntlSource.getUserDataEntitlements(productsList, subprodList, functionList, gcif, userNo);
	}

	/**
	 * @param productsList
	 * @param subprodList
	 * @param functionList
	 * @param gcif
	 * @param userNo
	 * @param channelId
	 * @return
	 * @throws EntitlementException
	 * @see com.intellectdesign.canvas.entitlement.IEntitlementSource#getUserDataEntitlements(java.lang.String[],
	 *      java.lang.String[], java.lang.String[], java.lang.String, java.lang.String, java.lang.String)
	 */
	@Override
	public DataEntitlements getUserDataEntitlements(String[] productsList, String[] subprodList, String[] functionList,
			String gcif, String userNo, String channelId) throws EntitlementException
	{
		return mEntlSource.getUserDataEntitlements(productsList, subprodList, functionList, gcif, userNo, channelId);
	}

	/**
	 * @param productsList
	 * @param subprodList
	 * @param functionList
	 * @param gcif
	 * @param userNo
	 * @param channelId
	 * @param sUserRole
	 * @return
	 * @throws EntitlementException
	 * @see com.intellectdesign.canvas.entitlement.IEntitlementSource#getUserDataEntitlements(java.lang.String[],
	 *      java.lang.String[], java.lang.String[], java.lang.String, java.lang.String, java.lang.String,
	 *      java.lang.String)
	 */
	@Override
	public DataEntitlements getUserDataEntitlements(String[] productsList, String[] subprodList, String[] functionList,
			String gcif, String userNo, String channelId, String sUserRole) throws EntitlementException
	{
		return mEntlSource.getUserDataEntitlements(productsList, subprodList, functionList, gcif, userNo, channelId,
				sUserRole);
	}

	/**
	 * @param productsList
	 * @param subprodList
	 * @param functionList
	 * @param gcif
	 * @param userNo
	 * @return
	 * @throws EntitlementException
	 * @see com.intellectdesign.canvas.entitlement.IEntitlementSource#getUserDataEntitlements(java.lang.String,
	 *      java.lang.String, java.lang.String, java.lang.String, java.lang.String)
	 */
	@Override
	public DataEntitlements getUserDataEntitlements(String productsList, String subprodList, String functionList,
			String gcif, String userNo) throws EntitlementException
	{
		return mEntlSource.getUserDataEntitlements(productsList, subprodList, functionList, gcif, userNo);
	}

	/**
	 * @param productsList
	 * @param subprodList
	 * @param functionList
	 * @param gcif
	 * @param userNo
	 * @param channelId
	 * @return
	 * @throws EntitlementException
	 * @see com.intellectdesign.canvas.entitlement.IEntitlementSource#getUserDataEntitlements(java.lang.String,
	 *      java.lang.String, java.lang.String, java.lang.String, java.lang.String, java.lang.String)
	 */
	@Override
	public DataEntitlements getUserDataEntitlements(String productsList, String subprodList, String functionList,
			String gcif, String userNo, String channelId) throws EntitlementException
	{
		return mEntlSource.getUserDataEntitlements(productsList, subprodList, functionList, gcif, userNo, channelId);
	}

	/**
	 * @param productsList
	 * @param subprodList
	 * @param functionList
	 * @param gcif
	 * @param userNo
	 * @param channelId
	 * @param sUserRole
	 * @return
	 * @throws EntitlementException
	 * @see com.intellectdesign.canvas.entitlement.IEntitlementSource#getUserDataEntitlements(java.lang.String,
	 *      java.lang.String, java.lang.String, java.lang.String, java.lang.String, java.lang.String, java.lang.String)
	 */
	@Override
	public DataEntitlements getUserDataEntitlements(String productsList, String subprodList, String functionList,
			String gcif, String userNo, String channelId, String sUserRole) throws EntitlementException
	{
		return mEntlSource.getUserDataEntitlements(productsList, subprodList, functionList, gcif, userNo, channelId,
				sUserRole);
	}

	/**
	 * @param gcif
	 * @param userNo
	 * @return
	 * @throws EntitlementException
	 * @see com.intellectdesign.canvas.entitlement.IEntitlementSource#getProductCategories(java.lang.String, java.lang.String)
	 * @deprecated This is no longer used within the framework. Instead the call is made to getUserAccessEntitlements
	 */
	@Override
	public List<String> getProductCategories(String gcif, String userNo) throws EntitlementException
	{
		return mEntlSource.getProductCategories(gcif, userNo);
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.entitlement.IEntitlementSource#getName()
	 */
	@Override
	public String getName()
	{
		return mEntlSource.getName();
	}

	/**
	 * @param preferenceType
	 * @param preferenceValues
	 * @param userNo
	 * @return
	 * @throws ProcessingErrorException
	 * @see com.intellectdesign.canvas.entitlement.IEntitlementSource#updateUserPreferences(java.util.List, java.util.List,
	 *      java.lang.String)
	 */
	@Override
	public String updateUserPreferences(List<String> preferenceType, List<Object> preferenceValues, String userNo)
			throws ProcessingErrorException
	{
		return mEntlSource.updateUserPreferences(preferenceType, preferenceValues, userNo);
	}

}
