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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.intellectdesign.canvas.database.CanvasDatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseResult;
import com.intellectdesign.canvas.logger.Logger;

/**
 * Class for User Entitlement Dao
 * 
 * @version 1.0
 */
public class UserEntitlementDao
{
	/**
	 * Default Constructor
	 */

	public UserEntitlementDao()
	{
	}

	/**
	 * Check for user functionalities based on the gcif ,userNo ,productList ,subProductList and functionsList
	 * 
	 * @param gcif
	 * @param userNo
	 * @param productList
	 * @param subProductList
	 * @param functionsList
	 * @param sUserRole
	 * @return boolean
	 * @throws databaseException
	 */
	public boolean isUserFunctionEntitledFor(String gcif, String userNo, String[] productList, String[] subProductList,
			String[] functionsList, String sUserRole) throws DatabaseException
	{

		boolean isEntitled = false;
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;

		if (productList == null || subProductList == null || functionsList == null)
			return isEntitled;

		dbRequest = new CanvasDatabaseRequest();
		dbRequest.setDataAccessMapKey("USER_ENTITLEMENT");
		dbRequest.setOperation(DatabaseConstants.SELECT);
		dbRequest.addFilter("OD_GCIF", gcif);
		dbRequest.addFilter("OD_USER_NO", userNo);
		dbRequest.addFilter("PRODUCT_LIST", productList);
		dbRequest.addFilter("SUB_PRODUCT_LIST", subProductList);
		dbRequest.addFilter("FUNCTION_LIST", functionsList);
		if(!"GUEST".equals(sUserRole) && !"".equals(sUserRole) && sUserRole!=null){
			dbRequest.addFilter("USER_ROLE", sUserRole);
		}
		dbResult = dbRequest.execute();
		isEntitled = dbResult.getReturnedList().isEmpty() ? false : true;

		return isEntitled;
	}

	/**
	 * Check for user functionalities based on the gcif ,userNo ,productList ,subProductList and functionsList
	 * 
	 * @param gcif
	 * @param userNo
	 * @param productList
	 * @param subProductList
	 * @param functionsList
	 * @return boolean
	 * @throws databaseException
	 */

	public boolean isFunctionReadOnly(String[] productList, String[] subProductList, String[] functionsList,
			String gcif, String userNo) throws DatabaseException
	{
		boolean isReadOnly = true;
		List entitledFunctionList = null;
		if (gcif == null || gcif.trim().equals("") || userNo == null || productList == null || subProductList == null
				|| functionsList == null)
		{
			throw new UnsupportedOperationException(
					"Cannot retrieve users with same entitled functions with some or all input"
							+ " values as null or empty.");
		}
		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		dbRequest.setDataAccessMapKey("ENTITLED_FUNCTION_READONLY");
		dbRequest.setOperation(DatabaseConstants.SELECT);
		dbRequest.addFilter("OD_GCIF", gcif);
		dbRequest.addFilter("OD_USER_NO", userNo);
		dbRequest.addFilter("PRODUCT_LIST", productList);
		dbRequest.addFilter("SUB_PRODUCT_LIST", subProductList);
		dbRequest.addFilter("FUNCTION_LIST", functionsList);

		DatabaseResult dbResult = dbRequest.execute();
		entitledFunctionList = dbResult.getReturnedList();
		if (!entitledFunctionList.isEmpty())
		{
			HashMap mEntlFunction = (HashMap) entitledFunctionList.get(0);
			if (mEntlFunction.get("FLG_IS_READONLY").equals("N"))
			{
				isReadOnly = false;
			}
		}
		return isReadOnly;
	}

	/**
	 * This method retrieves the only entitled criteria values based on the given parameters. The return is a list of
	 * entitled account value object All of the input parameters are mandatory.
	 * 
	 * @param gcif
	 * @param userNo
	 * @param prod , this should match the values present in the product master table
	 * @param subProductList , list of sub products,this should match the values present in the product master table
	 * @param functionsList , list of fucntions, this should match the value present in the function master table
	 * @return a list of criteria Value object, if nothing is entitled this method returns an empty list
	 * @throws DatabaseException
	 * 
	 */
	public List<HashMap> retrieveEntitledCriteriaValuesFor(String[] productList, String[] subProductList,
			String[] functionsList, String gcif, String userNo, String sUserRole) throws DatabaseException
	{

		List<HashMap> criteriaValues = null;
		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		DatabaseResult dbResult = new DatabaseResult();

		if (gcif == null || gcif.trim().equals("") || userNo == null || userNo.trim().equals("") || productList == null
				|| subProductList == null || functionsList == null)
		{
			throw new UnsupportedOperationException(
					"Cannot check entitlements with some or all input values with null or empty.");
		}
		criteriaValues = new ArrayList();
		dbRequest.setDataAccessMapKey("ENTITLED_CRITERIA_VALUES");
		dbRequest.setOperation(DatabaseConstants.SELECT);
		dbRequest.addFilter("OD_GCIF", gcif);
		dbRequest.addFilter("OD_USER_NO", userNo);
		dbRequest.addFilter("PRODUCT_LIST", productList);
		dbRequest.addFilter("SUB_PRODUCT_LIST", subProductList);
		dbRequest.addFilter("FUNCTION_LIST", functionsList);
		dbRequest.addFilter("USER_ROLE", sUserRole);		
		dbResult = dbRequest.execute();
		criteriaValues = dbResult.getReturnedList();

		return criteriaValues;
	}

	/**
	 * Checking the user and the function is mapped to the requested channel.
	 * 
	 * @param gcif
	 * @param userno
	 * @param functionsList
	 * @param channelId
	 * @return
	 * @throws DatabaseException
	 */
	public String checkUserFuncChannelAvailablity(String gcif, String userNo, String[] functionsList, String channelId) throws DatabaseException {
		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		String userFuncChannelAvail = null;
		try {
			if(functionsList == null || functionsList.length == 0){
				return "N";
			}
			dbRequest.setDataAccessMapKey("USER_FUNCTION_CHANNEL");
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.addFilter(EntlConstants.OD_GCIF, gcif);
			dbRequest.addFilter(EntlConstants.OD_USER_NO, userNo);
			dbRequest.addFilter(EntlConstants.FUNCTION_LIST, functionsList);
			dbRequest.addFilter(EntlConstants.INPUT_CHANNEL_ID, channelId);
			DatabaseResult dbResult = dbRequest.execute();
			userFuncChannelAvail = (String) ((HashMap) dbResult.getReturnedList().get(0)).get(EntlConstants.IS_CHANNEL_AVAIL);
			/**
			 * if the user and function channel is not available, will return
			 * this user is not entitled with the channel to get the data.
			 */
			if (userFuncChannelAvail.equals(EntlConstants.NO)) {
				logger.cterror("CTENT00024");
			}
		} catch (DatabaseException adbException) {
			throw adbException;
		}
		return userFuncChannelAvail;
	}

	private static final Logger logger = Logger.getLogger(UserEntitlementDao.class);
}
